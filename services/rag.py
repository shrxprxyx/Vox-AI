from sentence_transformers import SentenceTransformer
from db.qdrant import retrieve_vectors

model = SentenceTransformer("BAAI/bge-small-en-v1.5")

def retrieve_context(query: str, session_id: str, top_k: int = 3) -> str:
    query_embedding = model.encode([query]).tolist()[0]
    return retrieve_vectors(session_id, query_embedding, top_k)