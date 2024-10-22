from fastapi import FastAPI, HTTPException
from pydantic import BaseModel 
from random import randint


app = FastAPI()

class Todo(BaseModel):
    id: str
    content:str

class TodoCreate(BaseModel):
    content:str


todos:list[Todo] = [
    Todo(id="1", content="Buy Milk"),
    Todo(id="2", content="Buy Bread"),
]

@app.get("/todos", response_model=list[Todo])
def get_todos():
    return todos


@app.post("/todos" )
def add_todo(item: TodoCreate):
    todo = Todo(id=str(randint(0,1000)), content=item.content)
    todos.append(todo)
    return todo


@app.delete("/todos/{id}")
def delete_todo(id:str):

    for todo in todos:
        if todo.id == id:
            todos.remove(todo)
            return
    
    raise HTTPException(status_code=404, detail="Todo not found")




