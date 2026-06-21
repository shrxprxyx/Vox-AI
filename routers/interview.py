from fastapi import APIRouter, Depends
from pydantic import BaseModel
from services.rag import retrieve_context
from services.llm import generate_question
from services.evaluator import evaluate_answer
from db.database import SessionLocal, InterviewSession, InterviewResult
from auth.clerk import verify_clerk_token

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
def start_interview(req: StartRequest, user=Depends(verify_clerk_token)):
    context = retrieve_context(
        f"{req.domain} skills projects experience", req.session_id
    )
    question = generate_question(context, req.domain, [])

    db = SessionLocal()
    try:
        db.add(InterviewSession(
            id=req.session_id,
            user_id=user["sub"],
            domain=req.domain
        ))
        db.commit()
    except Exception:
        db.rollback()
    finally:
        db.close()

    return {"question": question}

@router.post("/answer")
def submit_answer(req: AnswerRequest, user=Depends(verify_clerk_token)):
    evaluation = evaluate_answer(req.question, req.answer, req.domain)

    context = retrieve_context(req.answer, req.session_id)
    next_question = generate_question(context, req.domain, req.history)

    db = SessionLocal()
    try:
        db.add(InterviewResult(
            session_id=req.session_id,
            question=req.question,
            answer=req.answer,
            correctness=evaluation["correctness"],
            communication=evaluation["communication"],
            technical_depth=evaluation["technical_depth"],
            confidence=evaluation["confidence"],
            overall=evaluation["overall"],
            feedback=evaluation["feedback"]
        ))
        db.commit()
    except Exception:
        db.rollback()
    finally:
        db.close()

    return {
        "evaluation": evaluation,
        "next_question": next_question        
    }