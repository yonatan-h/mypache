

class DataFrame:
    cols: list[str]
    
    def __init__(self, cols:list[str]) -> None:
        self.cols = cols
    
    def show(self):
        print(",\t".join(self.cols))


def create_dataframe(file_name:str, cols:list[str]):
    return DataFrame(cols=cols)
