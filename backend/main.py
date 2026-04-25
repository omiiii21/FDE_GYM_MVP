from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import models, schemas, ai
from db import engine, get_db

# Create DB tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/profile", response_model=schemas.ProfileResponse)
def create_profile(profile: schemas.Profile, db: Session = Depends(get_db)):
    # Simple MVP: Just keeping one profile (id=1), if it exists we update it.
    db_user = db.query(models.User).filter(models.User.id == 1).first()
    if db_user:
        db_user.name = profile.name
        db_user.age = profile.age
        db_user.goal = profile.goal
    else:
        db_user = models.User(id=1, name=profile.name, age=profile.age, goal=profile.goal)
        db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/profile", response_model=schemas.ProfileResponse)
def get_profile(db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == 1).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Profile not found")
    return db_user

@app.post("/log", response_model=schemas.WorkoutResponse)
def log_workout(workout: schemas.Workout, db: Session = Depends(get_db)):
    db_workout = models.Workout(
        user_id=1,
        activity=workout.activity,
        duration=workout.duration,
        intensity=workout.intensity,
        notes=workout.notes
    )
    db.add(db_workout)
    db.commit()
    db.refresh(db_workout)
    return db_workout

@app.get("/logs", response_model=List[schemas.WorkoutResponse])
def get_logs(db: Session = Depends(get_db)):
    workouts = db.query(models.Workout).filter(models.Workout.user_id == 1).order_by(models.Workout.id.desc()).all()
    return workouts

@app.post("/recommend")
def recommend(data: schemas.RecommendRequest, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == 1).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="Profile must be created first")
    
    workouts = db.query(models.Workout).filter(models.Workout.user_id == 1).order_by(models.Workout.id.asc()).all()
    
    recommendation = ai.call_gemini(api_key=data.api_key, profile=db_user, workouts=workouts)
    
    return {"recommendation": recommendation}
