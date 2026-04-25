from pydantic import BaseModel
from typing import Optional

class Profile(BaseModel):
    name: str
    age: int
    goal: str

class ProfileResponse(Profile):
    id: int
    class Config:
        from_attributes = True

class Workout(BaseModel):
    activity: str
    duration: int
    intensity: str
    notes: Optional[str] = ""

class WorkoutResponse(Workout):
    id: int
    user_id: int
    timestamp: str
    class Config:
        from_attributes = True

class RecommendRequest(BaseModel):
    api_key: str
