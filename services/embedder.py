from sentence_transformers import SentenceTransformer
from langchain_text_splitters import RecursiveCharacterTextSplitter
from db.qdrant import store_vectors

model = SentenceTransformer("BAAI/bge-small-en-v1.5")

def embed_and_store(text: str, session_id: str) -> int:
    splitter = RecursiveCharacterTextSplitter(chunk_size=300, chunk_overlap=50)
    chunks = splitter.split_text(text)
    embeddings = model.encode(chunks).tolist()
    store_vectors(session_id, chunks, embeddings)
    return len(chunks)