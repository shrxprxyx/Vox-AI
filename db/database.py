import os
from sqlalchemy import create_engine, Column, String, Integer, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

DATABASE_URL = os.environ.get("SUPABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

class InterviewSession(Base):
    __tablename__ = "sessions"
    id = Column(String, primary_key=True)
    user_id = Column(String)                # Clerk user ID
    domain = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class InterviewResult(Base):
    __tablename__ = "results"
    id = Column(Integer, primary_key=True, autoincrement=True)
    session_id = Column(String)
    question = Column(Text)
    answer = Column(Text)
    correctness = Column(Integer)
    communication = Column(Integer)
    technical_depth = Column(Integer)
    confidence = Column(Integer)
    overall = Column(Integer)
    feedback = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

def init_db():
    Base.metadata.create_all(engine)