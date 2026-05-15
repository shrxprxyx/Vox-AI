from sentence_transformers import SentenceTransformer
from db.chroma import get_collection

model = SentenceTransformer("BAAI/bge-small-en-v1.5")

def retrieve_context(query: str, session_id: str, top_k: int = 3) -> str:
    collection = get_collection(session_id)
    query_embedding = model.encode([query]).tolist()

    results = collection.query(
        query_embeddings=query_embedding,
        n_results=top_k
    )
    docs = results["documents"][0]
    return "\n".join(docs)