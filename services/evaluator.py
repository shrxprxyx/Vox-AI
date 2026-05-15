import json
from services.llm import ask_ollama

def evaluate_answer(question: str, answer: str, domain: str) -> dict:
    prompt = f"""You are evaluating a {domain} interview answer.

Question: {question}
Candidate answer: {answer}

Respond ONLY in this JSON format, no extra text:
{{
  "correctness": <1-10>,
  "communication": <1-10>,
  "technical_depth": <1-10>,
  "confidence": <1-10>,
  "overall": <1-10>,
  "feedback": "<2-3 sentence feedback>"
}}"""
    raw = ask_ollama(prompt)
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        # strip any markdown fences if llama wraps in ```json
        clean = raw.strip().removeprefix("```json").removesuffix("```").strip()
        return json.loads(clean)