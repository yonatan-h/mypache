from flaskr.models.worker import Worker

class Cluster:
    id:str
    workers: list[Worker] = []