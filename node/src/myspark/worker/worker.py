from __future__ import annotations
from myspark.shared.shared import Column, Row, Condition, Operator
from random import randint


class WorkerDataFrame:
    columns: list[Column]
    rows: list[Row]
    id: str

    def __init__(self, columns: list[Column], rows: list[Row]):
        self.columns = columns
        self.rows = rows
        if len(self.columns) != len(self.rows[0].values):
            raise ValueError("Columns and rows length mismatch")
        self.id = str(randint(1000, 10000))

    
    def print(self):
        print("\n-- Table --")
        for i in range(len(self.columns)):
            print(self.columns[i].name, end="\t")
        print()

        print("-"*len(self.columns)*5)
        for i,row in enumerate(self.rows):
            for val in row.values:
                print(val, end="\t")
            print()
        
        print("-"*len(self.columns)*5)
    
    def get_val(self, row:Row, key:str):
        index = -1
        for i, col in enumerate(self.columns):
            if col.name == key:
                index = i
                break

        if index == -1:
            raise ValueError(f"Column {key} not found")
        
        return row.values[index]



    def _filter_row(self, row:Row, cond:Condition):
        left = self.get_val(row, cond.left)
        op = cond.operator
        if cond.right == None:
            raise ValueError("Filter condition right value is None")
        right = cond.right

        if type(right) == str or type(left) ==str:
            right = str(right)
            left = str(left)

            if op == Operator.Greater: return left > right
            elif op == Operator.Lesser: return left < right
        else:
            right = float(right)
            left = float(left)

            if op == Operator.Greater: return left > right
            elif op == Operator.Lesser: return left < right
        


    def filter(self, cond:Condition):
        new_rows:list[Row] = []
        for row in self.rows:
            if self._filter_row(row, cond):
                new_rows.append(Row(row.values.copy()))
        
        new_cols:list[Column] = []
        for col in self.columns:
            new_cols.append(Column(col.name))

        return WorkerDataFrame(columns=new_cols, rows=new_rows)



wdf = WorkerDataFrame(columns=[Column("x"), Column('y')], rows=[
    Row([1, 1]),
    Row([2, 2]),
    Row([3, 3])
])

wdf.print()
wdf.filter(Condition(left="x", operator=Operator.Lesser, right=2)).print()
    

