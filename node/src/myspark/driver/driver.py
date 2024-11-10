from __future__ import annotations
from driver.models.cluster import Cluster, ClusterRuntime
from driver.models.file import File
from driver.models.worker import Worker
from myspark.shared.shared import Condition, Column, Row
from random import randint



class MySpark:
    read:Read
    cluster:Cluster
    file:File

    def __init__(self, cluster:Cluster, file:File) -> None:
        self.read = Read(self)
        self.cluster = cluster
        self.file = file


class Read:
    myspark:MySpark

    def __init__(self, myspark:MySpark) -> None:
        self.myspark = myspark 
    
    def format(self, file_type:str):
        if file_type == "csv": return self
        else: raise ValueError("Only csv files are supported") 
    
    def option(self, key:str, value:str):
        if key == "inferSchema" and value == "true": return self
        if key == "header" and value == "true": return self
        if key == "sep" and value==",": return self

        raise ValueError("Invalid option, currently supported options are: inferSchema=true, header=true, sep=,")

    def load(self, filename:str):
        if filename != self.myspark.file.filename:
            raise ValueError("File not found")
        
        df = DataFrame(self.myspark)
        return df

def display(df:DataFrame):
    print("\n-- Table --")
    for i in range(len(df.columns)):
        print(df.columns[i].name, end="\t")
    print()

    print("-"*len(df.columns)*5)
    for i in range(len(df.row_groups)):
        row_group = df.row_groups[i]
        for i,row in enumerate(row_group):
            for val in row.values:
                print(val, end="\t")
            if i != len(row_group)-1: print()
            else: print("_")
        
    print("-"*len(df.columns)*5)

class DataFrame:
    id:str
    myspark: MySpark
    columns: list[Column]
    row_groups: list[list[Row]]

    def __init__(self, myspark:MySpark, id:str|None=None) -> None:
        self.columns = []
        self.row_groups = []
        if id is not None: self.id = id
        else: self.id = str(randint(1000, 10000))

        self.myspark = myspark
        self._fetch_data(id)

    def _fetch_data(self, id:str|None=None):
        #Todo: implement
        self.columns = [Column("x"), Column("y")]
        self._set_row_groups( [
            [Row([randint(0,100), 1]),
             Row([1, 1])],

            [Row([2, 2]),
             Row([2, 2])],

            [Row([3, 3]),
            Row([3, 3])],
        ])
    
    def _set_row_groups(self, row_groups: list[list[Row]]):
        #Todo: implement
        for (i, row_group) in enumerate(row_groups):
            for row in row_group:
                if len(row.values) != len(self.columns):
                    raise ValueError(f"Row {i} has {len(row.values)} values, expected {len(self.columns)}")
        self.row_groups = row_groups
        
    
    def printSchema(self):
        print("root")
        for col in self.columns:
            print(f" |-- {col.name}")
    
    def filter(self, condition:Condition)->DataFrame:
        return DataFrame(self.myspark)
    
    def __getattribute__(self, name: str) -> Condition:
        try:
            return super().__getattribute__(name)
        except AttributeError:
            if name not in [c.name for c in self.columns]:
                raise AttributeError(f"Column {name} not found")

        return Condition(left=name)

    




##exec

# File location and type
file_location = "mycsv.csv"
file_type = "csv"

# CSV options
infer_schema = "true"
first_row_is_header = "true"
delimiter = ","

spark = MySpark(
    cluster=Cluster(
        runtime=ClusterRuntime(id="1", lang="python", name="pyspark"),
        name="abc", workers=[Worker(address="abc.com")],
        user_id="1", ),
        file=File("mycsv.csv", "1")
)
# The applied options are for CSV files. For other file types, these will be ignored.
df = spark.read.format(file_type) \
  .option("inferSchema", infer_schema) \
  .option("header", first_row_is_header) \
  .option("sep", delimiter) \
  .load(file_location)

df.printSchema()
display(df.filter(df.x > 1))