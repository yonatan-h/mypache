from io import StringIO
from contextlib import redirect_stdout
from typing import Any, Dict
import myspark
from random import randint
import flaskr #not from x import x. To avoid circular imports

def _random_id()->str:
    return str(randint(1000, 9999))


class Cell:
    id:str
    content:str
    error:str = ""
    result:str = ""
    vars: Dict[str, Any]

    def __init__(self, vars: Dict[str, Any]={}, id:str="", content:str="", error:str="", result:str=""):
        self.vars = vars
        if id: self.id = id
        else: self.id = _random_id()
        self.content = content
        self.error = error
        self.result = result
    
    def run(self, content:str):
        string_io = StringIO()
        self.result = ""
        self.error = ""
        with redirect_stdout(string_io):
            try:
                exec(content, self.vars)
            except Exception as e:
                self.error = str(e)
        self.result = string_io.getvalue()
    
    def to_dict(self)->Dict[str, Any]:
        return {
            "id": self.id,
            "content": self.content,
            "result": self.result,
            "error": self.error
        }
        


class Notebook:
    id:str
    file:flaskr.File
    cluster:flaskr.Cluster
    user:flaskr.User
    name:str

    vars: Dict[str, Any] = { }
    cells:list[Cell] = []
    _original_keys: set[str]

    def __init__(self,user:flaskr.User, file:flaskr.File, cluster:flaskr.Cluster, id:str=""):
        self.file = file
        self.cluster = cluster
        self.user = user

        if not id: id = _random_id()
        self.id = id

        self.cells = [Cell(self.vars, content="""\
import myspark
myspark.say_hello()
""")]
        self._original_keys = set(globals().keys()) 

    def save_cells(self, cells: list[Cell]):
        old_cell_map:dict[str,Cell] = {} 
        for cell in self.cells:
            old_cell_map[cell.id] = cell


        print("cells", [c.to_dict() for c in cells], flush=True)
        new_cells: list[Cell] = []

        for cell in cells:
            if cell.id in old_cell_map:
                print("exists cell id", cell.id, flush=True)
                #retain errors and results
                old_cell = old_cell_map[cell.id]
                old_cell.content = cell.content
                new_cells.append(old_cell)
            else:
                print("not exists cell id", cell.id, flush=True)
                cell.vars=self.vars
                new_cells.append(cell)
        self.cells = new_cells

    def run(self, index:int):
        if index < 0 or index >= len(self.cells):
            raise ValueError(f"Invalid index {index}")
        cell = self.cells[index]
        cell.run(cell.content)
    
    def print(self):
        new_keys = set(self.vars.keys())
        new_vars:Dict[str, Any] = {}
        for key in new_keys:
            if key not in self._original_keys:
                new_vars[key] = self.vars[key]

        print(f"Globals {new_vars}")


        for i, cell in enumerate(self.cells):
            print(f"Cell #{i+1} - [{cell.id}]")
            print(f"Content: {cell.content}")
            print(f"Result: {cell.result}")
            print(f"Error: {cell.error}")

    def to_dict(self)->Dict[str, Any]:
        return {
            "id": self.id,
            "user":self.user.to_dict(),
            "file": self.file.to_dict(),
            "cluster": self.cluster.to_dict(),

            "cells": [ cell.to_dict() for cell in self.cells ]
        }


myspark.say_hello()

