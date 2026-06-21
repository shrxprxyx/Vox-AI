import os
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from dotenv import load_dotenv

load_dotenv()

client = QdrantClient(
    url=os.environ.get("QDRANT_URL"),
    api_key=os.environ.get("QDRANT_API_KEY")
)

VECTOR_SIZE = 384  # BGE-small output size

def get_or_create_collection(session_id: str):
    existing = [c.name for c in client.get_collections().collections]
    if session_id not in existing:
        client.create_collection(
            collection_name=session_id,
            vectors_config=VectorParams(size=VECTOR_SIZE, distance=Distance.COSINE)
        )

def store_vectors(session_id: str, chunks: list[str], embeddings: list[list[float]]):
    get_or_create_collection(session_id)
    points = [
        PointStruct(id=i, vector=embeddings[i], payload={"text": chunks[i]})
        for i in range(len(chunks))
    ]
    client.upsert(collection_name=session_id, points=points)

def retrieve_vectors(session_id: str, query_embedding: list[float], top_k: int = 3) -> str:
    results = client.query_points(
        collection_name=session_id,
        query=query_embedding,
        limit=top_k
    ).points
    return "\n".join(r.payload["text"] for r in results)