from __future__ import annotations
from myspark.shared.shared import Column, Row, Condition, Operator, WorkerDataframeDTO
from random import randint
import sys


class WorkerDataFrame:
    columns: list[Column]
    rows: list[Row]
    id: str
    nth_file_slice:int
    _num_bytes:int 

    def __init__(self, columns: list[Column], rows: list[Row], nth_file_slice:int) -> None:
        self.columns = columns
        self.rows = rows
        self.nth_file_slice = nth_file_slice

        if len(self.columns) != len(self.rows[0].values):
            raise ValueError(f"Columns and rows length mismatch, columns: {len(self.columns)}, rows: {len(self.rows[0].values)}")
        self.id = str(randint(1000, 10000))
        self._num_bytes = -1 


    def calculate_size(self): #O(n) i think

        num_bytes = 0
        for col in self.columns:
            num_bytes += sys.getsizeof(col.name)
        
        num_bytes += sys.getsizeof(self.rows)
        for row in self.rows:
            num_bytes += sys.getsizeof(row.values)
            for val in row.values:
                num_bytes += sys.getsizeof(val)

        self._num_bytes = num_bytes
        return num_bytes
    
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

        return WorkerDataFrame(columns=new_cols, rows=new_rows, nth_file_slice=0)
    
    def get_size(self)->int:
        if self._num_bytes == -1:
            self._num_bytes = self.calculate_size()
        return self._num_bytes
    
    def to_dict(self, num_rows:int = 10, include_size:bool=True):
        num_bytes = self._num_bytes
        if include_size:
            num_bytes = self.get_size()

        dto = WorkerDataframeDTO(
            id=self.id,
            columns=self.columns,
            sliced_rows=self.rows[0:num_rows],
            num_rows=len(self.rows),
            nth_file_slice=self.nth_file_slice,
            num_bytes=num_bytes
        )

        return dto.to_dict()



wdf = WorkerDataFrame(columns=[Column("x"), Column('y')], rows=[
    Row([1, 1]),
    Row([2, 2]),
    Row([3, 3])
], nth_file_slice=0)

wdf.print()
wdf.filter(Condition(left="x", operator=Operator.Lesser, right=2)).print()
print(wdf.calculate_size())

