from dotenv import load_dotenv
from openai import OpenAI
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from pydantic import BaseModel
from system_prompt import scheduler_system_prompt,panchkarma_context
from langchain_openai import OpenAIEmbeddings
from langchain_qdrant import QdrantVectorStore
import os


load_dotenv()

#vector embedding
embedding_model = OpenAIEmbeddings(
    model="text-embedding-3-small"
)

vector_db = QdrantVectorStore.from_existing_collection(
    url="http://localhost:6333",
    collection_name="panchkarma-new-data",
    embedding=embedding_model
)


client = OpenAI(
    api_key= os.getenv('GEMINI_API_KEY'),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)

class State(TypedDict):
    query : str
    schedule : list | None

class DayPlan(BaseModel):
    day: int
    doctor_consultation: str  # "yes" or "no"
    plan: list[str]

class ScheduleClassifier(BaseModel):
    schedule: list[DayPlan]

def chat_node(state : State):
    patient_symptoms = state["query"]
    
    # Perform vector search inside the function
    search_results = vector_db.similarity_search(
        query = patient_symptoms
    )
    
    specific_information_with_respect_to_symptoms = "\n\n\n".join([f"Specific Content: {result.page_content} " for result in search_results])

    SYSTEM_PROMPT = scheduler_system_prompt + f"""
    <context>
        general_information_about_panchkarma : {panchkarma_context}
        specific_information_with_respect_to_symptoms : {specific_information_with_respect_to_symptoms}
        patient_symptoms : {patient_symptoms}
    </context>

    """

    response = client.beta.chat.completions.parse(
        model= "gemini-2.5-pro",
        response_format=ScheduleClassifier,
        messages= [
            {"role" : "assistant", "content" : SYSTEM_PROMPT},
            {"role" : "user", "content" : patient_symptoms}
        ]
    )

    state["schedule"] = response.choices[0].message.parsed.schedule

    return state

graph_builder = StateGraph(State)

graph_builder.add_node("chat_node", chat_node)

graph_builder.add_edge(START, "chat_node")
graph_builder.add_edge("chat_node", END)

graph = graph_builder.compile()

def main():
    user_query = input("> ")
    
    _state = State(
        query=user_query
    )

    result = graph.invoke(_state)

    print(result)
      

if __name__ == "__main__":
    main()





