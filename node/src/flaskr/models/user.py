from typing import Dict, Any

class User:
    id: str
    def __init__(self, id:str):
        self.id = id
    
    def to_dict(self)->Dict[str, Any]:
        return {
            "id": self.id
        }
