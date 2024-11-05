class Worker:
    address:str

    def __init__(self, address:str):
        self.address = address

    def to_dict(self, hide_address:bool=False):
        if hide_address:
            return {"address":"--Hidden--" }
        return { "address": self.address }