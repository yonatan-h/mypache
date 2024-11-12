from __future__ import annotations
from driver.models.cluster import Cluster
from driver.models.file import File
from myspark.shared.shared import Condition, Column, WorkerDataframeDTO
from random import randint
import requests



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
            raise ValueError(f"File not found, expected {self.myspark.file.filename}")
        
        df = DataFrame(self.myspark)
        return df

def display(df:DataFrame):
    print("\n-- Table --")
    for i in range(len(df.columns)):
        print(df.columns[i].name, end="\t")
    print()

    print("-"*len(df.columns)*5)
    for i, worker_df in enumerate(df.worker_dfs):
        for i,row in enumerate(worker_df.sliced_rows):
            for val in row.values:
                print(val, end="\t")
            if i != len(worker_df.sliced_rows)-1: print()
            else: print("_")
        
    print("-"*len(df.columns)*5)

class DataFrame:
    id:str
    myspark: MySpark
    columns: list[Column]
    worker_dfs: list[WorkerDataframeDTO]

    def __init__(
            self, 
            myspark:MySpark,
            worker_dfs:list[WorkerDataframeDTO]|None=None
        ) -> None:
        self.id = str(randint(1000, 10000))
        self.myspark = myspark
        self.columns = []
        self.worker_dfs = []

        if worker_dfs is None: 
            self._create_worker_dfs()
        else:
            if len(worker_dfs) == 0:
                raise ValueError("Empty worker_dfs")
            self.worker_dfs = worker_dfs
            self.columns = worker_dfs[0].columns

    def _create_worker_dfs(self):
        columns: list[Column] = []
        worker_dfs: list[WorkerDataframeDTO] = []

        with open(f"/tmp/{self.myspark.file.filename}") as file:
            col_line = file.readline()
            col_names = col_line.split(",")
            for name in col_names:
                columns.append(Column(name))
        
        if not columns: raise ValueError("No columns found")

        #Todo: make parallel async requests
        workers = self.myspark.cluster.workers
        for i,worker in enumerate(workers):
            res = requests.post(f"{worker.address}/instruction/new", json={
                "file_id": self.myspark.file.id,
                "slices": len(workers),
                "slice": i,
                "columns": [c.to_dict() for c in columns]
            })
            if res.status_code != 200:
                raise ValueError(res.json().get('error'))
            dict = res.json()
            worker_dfs.append(WorkerDataframeDTO.from_dict(dict))
        
        self.columns = columns
        self.worker_dfs = worker_dfs

    
    
    def printSchema(self):
        print("root")
        for col in self.columns:
            print(f" |-- {col.name}")
    
    def filter(self, condition:Condition)->DataFrame:
        #Todo: make parallel and async
        new_worker_dfs:list[WorkerDataframeDTO] = []
        workers = self.myspark.cluster.workers
        for i, worker_df in enumerate(self.worker_dfs):
            worker = workers[i]
            res = requests.post(f"{worker.address}/instruction/filter/{worker_df.id}", json={
                "condition": condition.to_dict() 
            })

            if res.status_code != 200:
                print("json is", res.json())
                raise ValueError(res.json().get('error'))

            new_worker_df = WorkerDataframeDTO.from_dict(res.json())
            new_worker_dfs.append(new_worker_df)
        return DataFrame(self.myspark, worker_dfs=new_worker_dfs)
    
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

# spark = MySpark(
#     cluster=Cluster(
#         runtime=ClusterRuntime(id="1", lang="python", name="pyspark"),
#         name="abc", workers=[Worker(address="abc.com")],
#         user_id="1", ),
#         file=File("mycsv.csv", "1")
# )
# The applied options are for CSV files. For other file types, these will be ignored.
# df = spark.read.format(file_type) \
#   .option("inferSchema", infer_schema) \
#   .option("header", first_row_is_header) \
#   .option("sep", delimiter) \
#   .load(file_location)

# df.printSchema()
# display(df.filter(df.x > 1))