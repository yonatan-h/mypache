from io import StringIO
from contextlib import redirect_stdout
from typing import Any, Dict
import myspark 
import json

class Cell:
    content:str = ""
    error:str = ""
    result:str = ""
    globals: Dict[str, Any]

    def __init__(self, globals: Dict[str, Any]):
        self.globals = globals
    
    def run(self, content:str):
        string_io = StringIO()
        with redirect_stdout(string_io):
            try:
                exec(content, self.globals)
            except Exception as e:
                self.error = str(e)
        self.result = string_io.getvalue()
        


class Notebook:
    id:str
    vars: Dict[str, Any] = { }
    cells:list[Cell] = []
    _original_keys: set[str]

    def __init__(self, id:str):
        self.id = id
        self.cells = [Cell(self.vars)]
        self._original_keys = set(globals().keys()) 

    def add(self, cell:Cell):
        self.cells.append(cell)
    
    def print(self):
        new_keys = set(self.vars.keys())
        new_vars:Dict[str, Any] = {}
        for key in new_keys:
            if key not in self._original_keys:
                new_vars[key] = self.vars[key]

        print(f"Globals {new_vars}")


        for i, cell in enumerate(self.cells):
            print(f"Cell {i+1}----")
            print(f"Content: {cell.content}")
            print(f"Result: {cell.result}")
            print(f"Error: {cell.error}")
    
    def to_json(self)->str:
        return json.dumps({
            "id": self.id,
            "cells": [
                {
                    "content": cell.content,
                    "result": cell.result,
                    "error": cell.error
                } for cell in self.cells
            ]
        })


myspark.say_hello()
notebook = Notebook("abcd") 

notebook.cells[0].run('''
import myspark
myspark.say_hello()
x = 5
print(f"printing {x}")
''')
print(notebook.to_json())