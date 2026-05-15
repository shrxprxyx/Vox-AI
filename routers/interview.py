from fastapi import APIRouter
from pydantic import BaseModel
from services.rag import retrieve_context
from services.llm import generate_question
from services.evaluator import evaluate_answer

router = APIRouter()

class StartRequest(BaseModel):
    session_id: str
    domain: str

class AnswerRequest(BaseModel):
    session_id: str
    domain: str
    question: str
    answer: str
    history: list[str] = []

@router.post("/start")
def start_interview(req: StartRequest):
    context = retrieve_context(
        f"{req.domain} skills projects experience", req.session_id
    )
    question = generate_question(context, req.domain, [])
    return {"question": question}

@router.post("/answer")
def submit_answer(req: AnswerRequest):
    evaluation = evaluate_answer(req.question, req.answer, req.domain)
    context = retrieve_context(req.answer, req.session_id)
    next_question = generate_question(context, req.domain, req.history)
    return {"evaluation": evaluation, "next_question": next_question}