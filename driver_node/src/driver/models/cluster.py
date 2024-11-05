from driver.models.worker import Worker
from driver.utils import random_id
from typing import Dict, Any
from enum import Enum

class ClusterRuntime:
    id:str
    name:str
    lang:str

    def __init__(self, id:str, name:str, lang:str):
        self.id = id
        self.name = name
        self.lang = lang
    
    def to_dict(self):
        return {
            "id":self.id,
            "name":self.name,
            "lang":self.lang,
        }


class ClusterStatus(Enum):
    Live = "live"
    STOPPED = "stopped"

class Cluster:
    id:str
    state: ClusterStatus 
    user_id:str
    workers: list[Worker] = []
    name:str
    runtime:ClusterRuntime

    def __init__(self, name:str, workers:list[Worker], user_id:str, runtime:ClusterRuntime, id:str=""):
        if not id: self.id = random_id()
        else: self.id = id

        self.name = name
        self.workers = workers
        self.user_id = user_id
        self.state = ClusterStatus.Live
        self.runtime = runtime
    
    def stop(self):
        self.state = ClusterStatus.STOPPED
        self.workers = []
    
    def to_dict(self) -> Dict[str, Any] :
        return {
            "id":self.id,
            "state":self.state.value,
            "userId":self.user_id,
            "name":self.name,
            "workers":[w.to_dict(hide_address=True) for w in self.workers],
            "runtime":self.runtime.to_dict()
        }