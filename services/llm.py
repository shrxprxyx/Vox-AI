import os
from groq import Groq

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def ask_llm(prompt: str) -> str:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content.strip()

def generate_question(context: str, domain: str, history: list[str]) -> str:
    history_text = "\n".join(history[-4:]) if history else "None yet"
    prompt = f"""You are a technical interviewer for {domain} roles.

Candidate background:
{context}

Questions already asked:
{history_text}

Ask ONE new specific interview question based on the candidate's background.
Do not repeat previous questions. Output only the question, nothing else."""
    return ask_llm(prompt)