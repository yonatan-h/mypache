from __future__ import annotations
from myspark.shared.shared import Column, Row

class WorkerDataFrame:
    columns: list[Column]
    rows: list[Row]

    def __init__(self, columns: list[Column], rows: list[Row]):
        self.columns = columns
        self.rows = rows

    
    def print(self):
        print("\n-- Table --", flush=True)
        for i in range(len(self.columns)):
            print(self.columns[i].name, end="\t")
        print(flush=True)


    

