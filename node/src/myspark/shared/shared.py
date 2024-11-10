from __future__ import annotations
from enum import Enum
from typing import Dict, Any

class Operator(Enum):
    Greater = ">"
    Lesser = "<"



class Condition:
    left: str #df.columnname
    right: Value|None
    operator: Operator | None

    def __init__(self, left: str, right: Value |None = None, operator: Operator|None = None) -> None:
        self.left = left
        self.right = right
        self.operator = operator
    
    def _add_right(self, operator: Operator, right:Value) -> Condition:
        self.right = right
        self.operator = operator
        return self
    
    def __gt__(self, right:Value) -> Condition:
        return self._add_right(Operator.Greater, right)
    
    def __lt__(self, right:Value) -> Condition:
        return self._add_right(Operator.Lesser, right)
    
    def is_valid(self) -> bool:
        if self.right is None or self.operator is None:
            return False
        return True

    def to_dict(self)->Dict[str, Any]:
        return {
            "left": self.left,
            "right": self.right,
            "operator": self.operator
        }
    
    @staticmethod
    def from_dict(dict: Dict[str, Any])->Condition:
        #Todo: add further value type validation
        if "left" not in dict: raise ValueError("left is required")
        if "right" not in dict: raise ValueError("right is required")
        if "operator" not in dict: raise ValueError("operator is required")

        return Condition(
            left=dict["left"],
            right=dict.get("right"),
            operator=dict.get("operator")
        )

Value = str | int | float #| Condition #Todo: add composing conditions
    

class Column:
    name:str
    def __init__(self, name:str) -> None:
        self.name = name
    def to_dict(self):
        return {"name": self.name}

    @staticmethod
    def from_dict(data: Dict[str, Any])->Column:
        if "name" not in data:
            raise ValueError("name is required")
        return Column(data["name"])

class Row:
    values: list[Value]
    def __init__(self, values: list[Value]) -> None:
        self.values = values
    def to_dict(self):
        return {"values": self.values}
    
    @staticmethod
    def from_dict(data: Dict[str, Any])->Row:
        if "values" not in data:
            raise ValueError("values is required")
        return Row(data["values"])


class WorkerDataframeDTO:
    id:str
    columns: list[Column]
    sliced_rows: list[Row]
    num_rows: int
    nth_file_slice:int
    num_bytes:int

    def __init__(self, id:str, columns: list[Column], sliced_rows: list[Row], num_rows: int, nth_file_slice:int, num_bytes:int) -> None:
        self.id = id
        self.columns = columns
        self.sliced_rows = sliced_rows
        self.num_rows = num_rows
        self.nth_file_slice = nth_file_slice
        self.num_bytes = num_bytes
    
    def to_dict(self)->Dict[str, Any ]:
        return {
            "id": self.id,
            "columns": [c.to_dict() for c in self.columns],
            "sliced_rows": [r.to_dict() for r in self.sliced_rows],
            "num_rows": self.num_rows,
            "nth_file_slice": self.nth_file_slice,
            "num_bytes":self.num_bytes
        }
    
    @staticmethod
    def from_dict(data: Dict[str, Any])->WorkerDataframeDTO:
        req_keys = ["id", "columns", "sliced_rows", "num_rows", "nth_file_slice", "num_bytes"]
        for key in req_keys:
            if key not in data:
                raise ValueError(f"{key} is required")

        return WorkerDataframeDTO(
            id=data["id"],
            columns=[Column.from_dict(c) for c in data["columns"]],
            sliced_rows=[Row.from_dict(r) for r in data["sliced_rows"]],
            num_rows=data["num_rows"],
            nth_file_slice=data["nth_file_slice"],
            num_bytes=data["num_bytes"]
        )


