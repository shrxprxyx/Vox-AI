"use client";
import { useState, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { uploadResume, startInterview, submitAnswer, transcribeAudio } from "@/lib/api";

const DOMAINS = ["Frontend", "Backend", "AI/ML", "DSA", "HR"];

type Evaluation = {
  correctness: number;
  communication: number;
  technical_depth: number;
  confidence: number;
  overall: number;
  feedback: string;
};

type Stage = "upload" | "interview" | "evaluated";

export default function InterviewPage() {
  const { getToken } = useAuth();

  const [stage, setStage] = useState<Stage>("upload");
  const [domain, setDomain] = useState("Frontend");
  const [sessionId, setSessionId] = useState("");
  const [question, setQuestion] = useState("");
  const [transcript, setTranscript] = useState("");
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState(0);
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = await uploadResume(file, getToken);
      setSessionId(data.session_id);
    } catch {
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleStart() {
    if (!sessionId) return alert("Please upload your resume first.");
    setLoading(true);
    try {
      const data = await startInterview(sessionId, domain, getToken);
      setQuestion(data.question);
      setQuestionCount(1);
      setStage("interview");
      speak(data.question);
    } catch {
      alert("Failed to start interview. Check your backend is running.");
    } finally {
      setLoading(false);
    }
  }

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mr = new MediaRecorder(stream);
    chunksRef.current = [];
    mr.ondataavailable = (e) => chunksRef.current.push(e.data);
    mr.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      try {
        const data = await transcribeAudio(blob, getToken);
        setTranscript(data.transcript);
      } catch {
        alert("Transcription failed.");
      }
    };
    mr.start();
    mediaRef.current = mr;
    setRecording(true);
    setRecordingTime(0);
    timerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000);
  }

  function stopRecording() {
    mediaRef.current?.stop();
    setRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }

  async function handleSubmit() {
    if (!transcript) return alert("Please record your answer first.");
    setLoading(true);
    try {
      const data = await submitAnswer(
        { session_id: sessionId, domain, question, answer: transcript, history },
        getToken
      );
      setEvaluation(data.evaluation);
      setHistory((h) => [...h, question, transcript]);
      setStage("evaluated");
    } catch {
      alert("Submission failed.");
    } finally {
      setLoading(false);
    }
  }

  function handleNext() {
    if (!evaluation) return;
    setQuestion((evaluation as any).next_question || "");
    setTranscript("");
    setEvaluation(null);
    setQuestionCount((c) => c + 1);
    setStage("interview");
  }

  function speak(text: string) {
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 0.95;
    speechSynthesis.speak(utt);
  }

  function formatTime(s: number) {
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  }

  const scoreColor = (score: number) =>
    score >= 8 ? "#34D399" : score >= 5 ? "#A78BFA" : "#F87171";

  return (
    <main className="min-h-screen" style={{ background: "#0D0D0D" }}>

      {/* Navbar */}
      <nav
        className="flex items-center justify-between px-10 py-5 border-b"
        style={{ borderColor: "#1A1A1A" }}
      >
        <Link
          href="/home"
          className="text-xl font-bold tracking-tight"
          style={{ fontFamily: "'Sora', sans-serif", color: "#F5F5F5" }}
        >
          Vox AI
        </Link>
        <div className="flex items-center gap-4">
          {stage !== "upload" && (
            <span style={{ fontSize: 13, color: "#555555", fontFamily: "'Inter', sans-serif" }}>
              Question {questionCount}
            </span>
          )}
          <UserButton />
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Progress bar */}
        {stage !== "upload" && (
          <div className="flex gap-2 mb-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 2,
                  background: i < questionCount ? "#A78BFA" : "#222222",
                  transition: "background 0.3s",
                }}
              />
            ))}
          </div>
        )}

        {/* STAGE: UPLOAD */}
        {stage === "upload" && (
          <div className="max-w-xl mx-auto">
            <h1
              className="text-3xl font-bold mb-2"
              style={{ fontFamily: "'Sora', sans-serif", color: "#F5F5F5" }}
            >
              Start your interview
            </h1>
            <p style={{ color: "#555555", fontFamily: "'Inter', sans-serif", marginBottom: 32 }}>
              Upload your resume and pick a domain to get personalized questions.
            </p>

            {/* Upload box */}
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                border: "1px dashed #333333",
                borderRadius: 12,
                padding: 40,
                textAlign: "center",
                cursor: "pointer",
                marginBottom: 24,
                background: "#141414",
              }}
            >
              <i
                className="ti ti-upload"
                style={{ fontSize: 32, color: sessionId ? "#34D399" : "#333333", display: "block", marginBottom: 12 }}
                aria-hidden="true"
              />
              {uploading ? (
                <p style={{ color: "#A78BFA", fontFamily: "'Inter', sans-serif", fontSize: 14 }}>Uploading...</p>
              ) : sessionId ? (
                <>
                  <p style={{ color: "#34D399", fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 500 }}>Resume uploaded</p>
                  <p style={{ color: "#555555", fontFamily: "'Inter', sans-serif", fontSize: 12, marginTop: 4 }}>Click to replace</p>
                </>
              ) : (
                <>
                  <p style={{ color: "#F5F5F5", fontFamily: "'Inter', sans-serif", fontSize: 14 }}>Click to upload resume</p>
                  <p style={{ color: "#555555", fontFamily: "'Inter', sans-serif", fontSize: 12, marginTop: 4 }}>PDF or DOCX</p>
                </>
              )}
              <input ref={fileRef} type="file" accept=".pdf,.docx" onChange={handleUpload} style={{ display: "none" }} />
            </div>

            {/* Domain */}
            <p style={{ color: "#555555", fontFamily: "'Inter', sans-serif", fontSize: 12, marginBottom: 10 }}>
              Select domain
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}>
              {DOMAINS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDomain(d)}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 20,
                    border: `1px solid ${domain === d ? "#A78BFA" : "#222222"}`,
                    background: domain === d ? "#A78BFA" : "#141414",
                    color: domain === d ? "#0D0D0D" : "#555555",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13,
                    cursor: "pointer",
                    fontWeight: domain === d ? 600 : 400,
                  }}
                >
                  {d}
                </button>
              ))}
            </div>

            <button
              onClick={handleStart}
              disabled={!sessionId || loading}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 12,
                background: sessionId ? "#A78BFA" : "#222222",
                color: sessionId ? "#0D0D0D" : "#555555",
                fontFamily: "'Sora', sans-serif",
                fontSize: 15,
                fontWeight: 700,
                border: "none",
                cursor: sessionId ? "pointer" : "not-allowed",
              }}
            >
              {loading ? "Starting..." : "Start Interview"}
            </button>
          </div>
        )}

        {/* STAGE: INTERVIEW */}
        {stage === "interview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

            {/* Question card */}
            <div
              style={{
                background: "#141414",
                border: "1px solid #222222",
                borderRadius: 12,
                padding: 24,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <i className="ti ti-messages" style={{ fontSize: 16, color: "#A78BFA" }} aria-hidden="true" />
                <p style={{ fontSize: 11, fontWeight: 600, color: "#A78BFA", textTransform: "uppercase", letterSpacing: ".05em", fontFamily: "'Inter', sans-serif" }}>
                  Question
                </p>
              </div>
              <p style={{ fontSize: 15, color: "#F5F5F5", lineHeight: 1.7, fontFamily: "'Inter', sans-serif" }}>
                {question}
              </p>
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #1A1A1A", display: "flex", gap: 8 }}>
                <span style={{ padding: "4px 12px", borderRadius: 20, background: "#A78BFA22", border: "1px solid #A78BFA44", fontSize: 11, color: "#A78BFA", fontFamily: "'Inter', sans-serif" }}>
                  {domain}
                </span>
              </div>
            </div>

            {/* Voice recorder */}
            <div
              style={{
                background: "#141414",
                border: "1px solid #222222",
                borderRadius: 12,
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <i className="ti ti-microphone" style={{ fontSize: 16, color: "#34D399" }} aria-hidden="true" />
                <p style={{ fontSize: 11, fontWeight: 600, color: "#34D399", textTransform: "uppercase", letterSpacing: ".05em", fontFamily: "'Inter', sans-serif" }}>
                  Your Answer
                </p>
              </div>

              {/* Record button */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, padding: "16px 0" }}>
                {!recording ? (
                  <button
                    onClick={startRecording}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      background: "#34D39922",
                      border: "1px solid #34D39944",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <i className="ti ti-microphone" style={{ fontSize: 24, color: "#34D399" }} aria-hidden="true" />
                  </button>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        background: "#34D39922",
                        border: "1px solid #34D399",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <i className="ti ti-microphone" style={{ fontSize: 24, color: "#34D399" }} aria-hidden="true" />
                    </div>
                    <div>
                      <p style={{ fontSize: 13, color: "#F5F5F5", fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>Recording</p>
                      <p style={{ fontSize: 12, color: "#555555", fontFamily: "'Inter', sans-serif", marginTop: 2 }}>{formatTime(recordingTime)}</p>
                    </div>
                    <button
                      onClick={stopRecording}
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        background: "#222222",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <i className="ti ti-player-stop" style={{ fontSize: 18, color: "#F5F5F5" }} aria-hidden="true" />
                    </button>
                  </div>
                )}
              </div>

              {/* Transcript */}
              {transcript && (
                <div style={{ background: "#0D0D0D", borderRadius: 8, padding: 14 }}>
                  <p style={{ fontSize: 11, color: "#555555", marginBottom: 6, fontFamily: "'Inter', sans-serif" }}>Transcript</p>
                  <p style={{ fontSize: 13, color: "#F5F5F5", lineHeight: 1.6, fontFamily: "'Inter', sans-serif" }}>{transcript}</p>
                </div>
              )}

              {transcript && (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    padding: "12px",
                    borderRadius: 10,
                    background: "#A78BFA",
                    color: "#0D0D0D",
                    fontFamily: "'Sora', sans-serif",
                    fontSize: 14,
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {loading ? "Evaluating..." : "Submit Answer"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* STAGE: EVALUATED */}
        {stage === "evaluated" && evaluation && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Scores */}
            <div
              style={{
                background: "#141414",
                border: "1px solid #222222",
                borderRadius: 12,
                padding: 24,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <i className="ti ti-chart-bar" style={{ fontSize: 16, color: "#A78BFA" }} aria-hidden="true" />
                <p style={{ fontSize: 11, fontWeight: 600, color: "#A78BFA", textTransform: "uppercase", letterSpacing: ".05em", fontFamily: "'Inter', sans-serif" }}>
                  Evaluation
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
                {[
                  ["Correctness", evaluation.correctness],
                  ["Communication", evaluation.communication],
                  ["Tech Depth", evaluation.technical_depth],
                  ["Confidence", evaluation.confidence],
                ].map(([label, score]) => (
                  <div key={label as string} style={{ background: "#0D0D0D", borderRadius: 8, padding: 14 }}>
                    <p style={{ fontSize: 11, color: "#555555", marginBottom: 6, fontFamily: "'Inter', sans-serif" }}>{label as string}</p>
                    <p style={{ fontSize: 24, fontWeight: 700, color: scoreColor(score as number), fontFamily: "'Sora', sans-serif" }}>
                      {score as number}<span style={{ fontSize: 12, color: "#333333" }}>/10</span>
                    </p>
                  </div>
                ))}
              </div>

              <div style={{ background: "#0D0D0D", borderRadius: 8, padding: 16, marginBottom: 20 }}>
                <p style={{ fontSize: 11, color: "#555555", marginBottom: 8, fontFamily: "'Inter', sans-serif" }}>Feedback</p>
                <p style={{ fontSize: 14, color: "#F5F5F5", lineHeight: 1.7, fontFamily: "'Inter', sans-serif" }}>{evaluation.feedback}</p>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <p style={{ fontSize: 13, color: "#555555", fontFamily: "'Inter', sans-serif" }}>Overall</p>
                  <p style={{ fontSize: 20, fontWeight: 700, color: scoreColor(evaluation.overall), fontFamily: "'Sora', sans-serif" }}>
                    {evaluation.overall}/10
                  </p>
                </div>
                {questionCount < 5 ? (
                  <button
                    onClick={handleNext}
                    style={{
                      padding: "10px 24px",
                      borderRadius: 20,
                      background: "#A78BFA",
                      color: "#0D0D0D",
                      fontFamily: "'Sora', sans-serif",
                      fontSize: 14,
                      fontWeight: 700,
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Next Question
                  </button>
                ) : (
                  <Link
                    href="/dashboard"
                    style={{
                      padding: "10px 24px",
                      borderRadius: 20,
                      background: "#34D399",
                      color: "#0D0D0D",
                      fontFamily: "'Sora', sans-serif",
                      fontSize: 14,
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                  >
                    View Results
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}