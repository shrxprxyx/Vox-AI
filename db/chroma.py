import chromadb

client = chromadb.EphemeralClient()

def get_collection(session_id: str):
    return client.get_or_create_collection(name=session_id)
