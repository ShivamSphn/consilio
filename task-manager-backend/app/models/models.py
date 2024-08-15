from pydantic import BaseModel

class Task(BaseModel):
    id: str
    text: str
