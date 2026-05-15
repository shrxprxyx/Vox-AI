from sentence_transformers import SentenceTransformer
from db.chroma import get_collection
from langchain_text_splitters import RecursiveCharacterTextSplitter 

model = SentenceTransformer('BAAI/bge-small-en-v1.5')

def embed_and_store(text: str, session_id: str):
    splitter = RecursiveCharacterTextSplitter(chunk_size=300, chunk_overlap=50)
    chunks = splitter.split_text(text)
    embeddings = model.encode(chunks).tolist()
    collection = get_collection(session_id)
    
    collection.add(documents=chunks, embeddings=embeddings, ids=[f"{session_id}-{i}" for i in range(len(chunks))])
    
    return len(chunks)
