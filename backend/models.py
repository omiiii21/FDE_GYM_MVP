from sqlalchemy import Column, Integer, String
from db import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    age = Column(Integer)
    goal = Column(String)

class Workout(Base):
    __tablename__ = "workouts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    activity = Column(String)
    duration = Column(Integer) # in minutes
    intensity = Column(String)
    notes = Column(String)
    timestamp = Column(String, default=lambda: datetime.datetime.now().isoformat())
