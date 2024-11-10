import myspark

class Database:
    _dfs:list[myspark.WorkerDataFrame] = []

    def get_df(self, id:str):
        #Todo: implement LRU cache
        for i, df in enumerate(self._dfs): 
            if df.id == id:
                df = self._dfs.pop(i)
                self._dfs = [df] + self._dfs
                return df
        raise ValueError(f"WorkerDataFrame with id {id} not found")
    
    def has_df(self, id:str):
        for df in self._dfs:
            if df.id == id:
                return True
        return False
    
    def add_df(self, df:myspark.WorkerDataFrame):
        #Todo: remove least recently used df if cache is full
        self._dfs = [df] + self._dfs
        return df


db = Database()



