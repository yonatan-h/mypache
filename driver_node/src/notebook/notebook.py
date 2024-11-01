from io import StringIO
from contextlib import redirect_stdout
from typing import Any, Dict
import myspark
from random import randint
import flaskr #not from x import x. To avoid circular imports

def _random_id()->str:
    return str(randint(1000, 9999))


class Cell:
    id:str =_random_id()
    content:str
    error:str = ""
    result:str = ""
    vars: Dict[str, Any]

    def __init__(self, vars: Dict[str, Any]={}, id:str="", content:str="", error:str="", result:str=""):
        self.vars = vars
        if id: self.id = id
        self.content = content
        self.error = error
        self.result = result
    
    def run(self, content:str):
        string_io = StringIO()
        with redirect_stdout(string_io):
            try:
                exec(content, self.vars)
            except Exception as e:
                self.error = str(e)
        self.result = string_io.getvalue()
        


class Notebook:
    id:str
    user_id:str
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

        self.cells = [Cell(self.vars)]
        self._original_keys = set(globals().keys()) 

    def save_cells(self, cells: list[Cell]):
        old_cell_map:dict[str,Cell] = {} 
        for cell in self.cells:
            old_cell_map[cell.id] = cell

        new_cells: list[Cell] = []

        for cell in cells:
            if cell.id in old_cell_map:
                #retain errors and results
                old_cell = old_cell_map[cell.id]
                old_cell.content = cell.content
                new_cells.append(old_cell)
            else:
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

            "cells": [
                {
                    "id": cell.id,
                    "content": cell.content,
                    "result": cell.result,
                    "error": cell.error
                } for cell in self.cells
            ]
        }


myspark.say_hello()

