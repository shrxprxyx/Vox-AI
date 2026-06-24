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

@router.get("/sessions/{user_id}")
def get_sessions(user_id: str, user=Depends(verify_clerk_token)):
    db = SessionLocal()
    sessions = db.query(InterviewSession).filter(
        InterviewSession.user_id == user_id
    ).order_by(InterviewSession.created_at.desc()).all()
    
    result = []
    for s in sessions:
        results = db.query(InterviewResult).filter(
            InterviewResult.session_id == s.id
        ).all()
        avg_score = (
            sum(r.overall for r in results) / len(results)
            if results else 0
        )
        result.append({
            "session_id": s.id,
            "domain": s.domain,
            "created_at": str(s.created_at),
            "question_count": len(results),
            "avg_score": round(avg_score, 1),
            "results": [
                {
                    "question": r.question,
                    "answer": r.answer,
                    "correctness": r.correctness,
                    "communication": r.communication,
                    "technical_depth": r.technical_depth,
                    "confidence": r.confidence,
                    "overall": r.overall,
                    "feedback": r.feedback,
                }
                for r in results
            ]
        })
    db.close()
    return result