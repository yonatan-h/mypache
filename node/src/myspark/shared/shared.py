from __future__ import annotations
from enum import Enum

class Operator(Enum):
    Greater = ">"
    Lesser = "<"
    Equal = "=="



class Condition:
    left: str |int| float | Condition
    right: Operand|None
    operator: Operator | None

    def __init__(self, left: Operand, right: Operand |None = None, operator: Operator|None = None) -> None:
        self.left = left
        self.right = right
        self.operator = operator
    
    def _add_right(self, operator: Operator, right:Operand) -> Condition:
        self.right = right
        self.operator = operator
        return self
    
    def __gt__(self, right:Operand) -> Condition:
        return self._add_right(Operator.Greater, right)
    
    def __lt__(self, right:Operand) -> Condition:
        return self._add_right(Operator.Lesser, right)
    
    def is_valid(self) -> bool:
        if self.right is None or self.operator is None:
            return False
        return True

Operand = str | int | float | Condition
    

class Column:
    name:str
    def __init__(self, name:str) -> None:
        self.name = name
    def to_dict(self):
        return {"name": self.name}

class Row:
    values: list[str|float|int]
    def __init__(self, values: list[str|float|int]) -> None:
        self.values = values
    def to_dict(self):
        return {"values": self.values}

