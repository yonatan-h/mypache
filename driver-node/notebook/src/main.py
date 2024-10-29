from flask import Flask
from io import StringIO
from contextlib import redirect_stdout

app = Flask(__name__)


class Cell:
    content:str = ""
    error:str = ""
    result:str = ""
    globals: dict

    def __init__(self, globals: dict):
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
    vars: dict = {}
    cells:list[Cell] = []
    _original_keys: set[str] = []
    def __init__(self):
        self.cells = [Cell(self.vars)]
        self._original_keys = set(globals().keys()) 

    def add(self, cell):
        self.cells.append(cell)

    def get(self):
        return self.data
    
    def print(self):
        new_keys = set(self.vars.keys())
        new_vars:dict = {}
        for key in new_keys:
            if key not in self._original_keys:
                new_vars[key] = self.vars[key]

        print(f"Globals {new_vars}")


        for i, cell in enumerate(self.cells):
            print(f"Cell {i+1}----")
            print(f"Content: {cell.content}")
            print(f"Result: {cell.result}")
            print(f"Error: {cell.error}")


notebook = Notebook() 
notebook.cells[0].run('''
x = 5
print(x)
''')
notebook.print()

# @app.route('/')
# def hello():
    # return "Hello World!"