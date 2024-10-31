from io import StringIO
from contextlib import redirect_stdout
from typing import Any, Dict
import myspark
from random import randint

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
    file_id:str
    cluster_id:str

    vars: Dict[str, Any] = { }
    cells:list[Cell] = []
    _original_keys: set[str]

    def __init__(self,user_id:str, file_id:str, cluster_id:str, id:str=""):
        self.user_id = user_id
        self.file_id = file_id
        self.cluster_id = cluster_id

        if not id: id = _random_id()
        self.id = id

        self.cells = [Cell(self.vars)]
        self._original_keys = set(globals().keys()) 

    def save_cells(self, cells: list[Cell]):
        print('here1', flush=True)
        old_cell_map:dict[str,Cell] = {} 
        for cell in self.cells:
            old_cell_map[cell.id] = cell

        print('here2', flush=True)
        new_cells: list[Cell] = []

        for cell in cells:
            print('here3',cell.__dict__, flush=True)
            if cell.id in old_cell_map:
                print('here5', flush=True)
                #retain errors and results
                old_cell = old_cell_map[cell.id]
                old_cell.content = cell.content
                new_cells.append(old_cell)
            else:
                cell.vars=self.vars
                new_cells.append(cell)

        print('here4', flush=True)
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
            "userId":self.user_id,
            "fileId": self.file_id,
            "clusterId": self.cluster_id,

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

