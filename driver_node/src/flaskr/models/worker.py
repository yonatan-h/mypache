class Worker:
    address:str
    def __init__(self, address:str):
        self.address = address
    
    def to_dict(self):
        return {
            "address": self.address
        }