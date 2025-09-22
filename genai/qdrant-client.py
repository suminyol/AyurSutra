from qdrant_client import QdrantClient

client = QdrantClient(url="http://localhost:6333")
try:
    client.delete_collection("panchkarma-data")
    print("Cleared existing collection")
except:
    print("Collection didn't exist or couldn't be deleted")
