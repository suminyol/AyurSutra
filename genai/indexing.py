from pathlib import Path
from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings
from langchain_qdrant import QdrantVectorStore
from langchain_community.document_loaders.csv_loader import CSVLoader

load_dotenv()

pdf_path1 = Path(__file__).parent / "data1.csv"
pdf_path2 = Path(__file__).parent / "data2.csv"
pdf_path3 = Path(__file__).parent / "data3.csv"
pdf_path4 = Path(__file__).parent / "data4.csv"

#loading
loader1 = CSVLoader(pdf_path1)
docs1 = loader1.load()

loader2 = CSVLoader(pdf_path2)
docs2 = loader2.load()

loader3 = CSVLoader(pdf_path3)
docs3 = loader3.load()

loader4 = CSVLoader(pdf_path4)
docs4 = loader4.load()




docs = docs1 + docs2 + docs3 + docs4


# vector embedding
embedding_model = OpenAIEmbeddings(
    model="text-embedding-3-small"
)



# Using [embedding_model] create embeddings of [split_docs] and store in DB
vector_store = QdrantVectorStore.from_documents(
    documents=docs,
    url="http://localhost:6333",
    collection_name="panchkarma-new-data",
    embedding=embedding_model
)

print("INDEXING DONE")

