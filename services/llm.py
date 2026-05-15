import httpx

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "llama3"

def ask_ollama(prompt: str) -> str:
    response = httpx.post(
        OLLAMA_URL,
        json={"model": MODEL, "prompt": prompt, "stream": False},
        timeout=120
    )
    return response.json()["response"].strip()

def generate_question(context: str, domain: str, history: list[str]) -> str:
    history_text = "\n".join(history[-4:]) if history else "None yet"
    prompt = f"""You are a technical interviewer for {domain} roles.

Candidate background:
{context}

Questions already asked:
{history_text}

Ask ONE new specific interview question based on the candidate's background.
Do not repeat previous questions. Output only the question, nothing else."""
    return ask_ollama(prompt)