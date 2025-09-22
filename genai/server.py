from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

# Import your graph & State from your existing file
from main import graph, State

app = FastAPI()

# CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request schema
class Query(BaseModel):
    message: str

@app.post("/chat")
def chat(query: Query):
    _state: State = {"query": query.message, "schedule": None}
    result = graph.invoke(_state)

    return {"schedule": result["schedule"]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "server:app",   # "server" = filename without .py, "app" = FastAPI instance
        host="0.0.0.0",
        port=8000,
        reload=True      # auto-reload on code changes (dev only)
    )
