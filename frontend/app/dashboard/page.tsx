"use client";
import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { getSessions } from "@/lib/api";

type Result = {
  question: string;
  answer: string;
  correctness: number;
  communication: number;
  technical_depth: number;
  confidence: number;
  overall: number;
  feedback: string;
};

type Session = {
  session_id: string;
  domain: string;
  created_at: string;
  question_count: number;
  avg_score: number;
  results: Result[];
};

export default function DashboardPage() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [activeResult, setActiveResult] = useState<number>(0);

  useEffect(() => {
    if (!user) return;
    async function load() {
      try {
        const data = await getSessions(user!.id, getToken);
        setSessions(data);
      } catch {
        console.error("Failed to load sessions");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const scoreColor = (score: number) => {
    if (score >= 8) return "text-emerald-400";
    if (score >= 5) return "text-violet-400";
    return "text-red-400";
  };

  const scoreBg = (score: number) => {
    if (score >= 8) return "bg-emerald-400/10 border border-emerald-400/20";
    if (score >= 5) return "bg-violet-400/10 border border-violet-400/20";
    return "bg-red-400/10 border border-red-400/20";
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-[#0D0D0D]">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-5 border-b border-[#1A1A1A]">
        <Link
          href="/home"
          className="text-xl font-bold tracking-tight text-[#F5F5F5]"
          style={{ fontFamily: "'Sora', sans-serif" }}
        >
          Vox AI
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/interview"
            className="px-5 py-2 rounded-full text-sm font-semibold bg-[#A78BFA] text-[#0D0D0D] hover:opacity-90 transition-opacity"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            New Interview
          </Link>
          <UserButton />
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-3xl font-bold text-[#F5F5F5] mb-1"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            Past Sessions
          </h1>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-[#A78BFA] animate-pulse" />
              <p className="text-[#555555] text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                Loading sessions...
              </p>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && sessions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-[#141414] rounded-2xl border border-[#222222] text-center">
            <i
              className="ti ti-microphone-off text-5xl text-[#333333] mb-4"
              aria-hidden="true"
            />
            <p
              className="text-[#F5F5F5] text-lg font-semibold mb-2"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              No interviews yet
            </p>
            <p
              className="text-[#555555] text-sm mb-6 max-w-xs"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Complete your first mock interview to see results here.
            </p>
            <Link
              href="/interview"
              className="px-6 py-2.5 rounded-full text-sm font-bold bg-[#A78BFA] text-[#0D0D0D] hover:opacity-90 transition-opacity"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Start Interview
            </Link>
          </div>
        )}

        {/* Sessions list */}
        {!loading && sessions.length > 0 && (
          <div className="flex flex-col gap-3">
            {sessions.map((session) => (
              <div key={session.session_id} className="rounded-2xl overflow-hidden border border-[#222222]">

                {/* Session header */}
                <div
                  onClick={() => {
                    setExpanded(expanded === session.session_id ? null : session.session_id);
                    setActiveResult(0);
                  }}
                  className="flex items-center justify-between px-6 py-4 bg-[#141414] cursor-pointer hover:bg-[#1A1A1A] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#A78BFA]/10 border border-[#A78BFA]/20 flex items-center justify-center">
                      <i className="ti ti-microphone text-[#A78BFA] text-lg" aria-hidden="true" />
                    </div>
                    <div>
                      <p
                        className="text-[#F5F5F5] font-semibold text-sm"
                        style={{ fontFamily: "'Sora', sans-serif" }}
                      >
                        {session.domain} Interview
                      </p>
                      <div className="flex gap-3 mt-0.5">
                        <p className="text-[#555555] text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {formatDate(session.created_at)}
                        </p>
                        <p className="text-[#555555] text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {session.question_count} question{session.question_count !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[#555555] text-xs mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Avg score
                      </p>
                      <p
                        className={`text-lg font-bold ${scoreColor(session.avg_score)}`}
                        style={{ fontFamily: "'Sora', sans-serif" }}
                      >
                        {session.avg_score}<span className="text-xs text-[#333333]">/10</span>
                      </p>
                    </div>
                    <i
                      className={`ti ${expanded === session.session_id ? "ti-chevron-up" : "ti-chevron-down"} text-[#555555] text-lg transition-transform`}
                      aria-hidden="true"
                    />
                  </div>
                </div>

                {/* Expanded session */}
                {expanded === session.session_id && (
                  <div className="bg-[#0D0D0D] border-t border-[#1A1A1A]">

                    {/* Score summary */}
                    <div className="grid grid-cols-4 gap-3 p-6 border-b border-[#1A1A1A]">
                      {[
                        ["Correctness", session.results.reduce((a, r) => a + r.correctness, 0) / session.results.length],
                        ["Communication", session.results.reduce((a, r) => a + r.communication, 0) / session.results.length],
                        ["Tech Depth", session.results.reduce((a, r) => a + r.technical_depth, 0) / session.results.length],
                        ["Confidence", session.results.reduce((a, r) => a + r.confidence, 0) / session.results.length],
                      ].map(([label, avg]) => (
                        <div
                          key={label as string}
                          className={`rounded-xl p-3 ${scoreBg(avg as number)}`}
                        >
                          <p className="text-xs text-[#555555] mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                            {label as string}
                          </p>
                          <p
                            className={`text-xl font-bold ${scoreColor(avg as number)}`}
                            style={{ fontFamily: "'Sora', sans-serif" }}
                          >
                            {(avg as number).toFixed(1)}
                            <span className="text-xs text-[#333333]">/10</span>
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Question tabs */}
                    {session.results.length > 0 && (
                      <div className="p-6">
                        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                          {session.results.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setActiveResult(i)}
                              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                                activeResult === i
                                  ? "bg-[#A78BFA] text-[#0D0D0D]"
                                  : "bg-[#141414] border border-[#222222] text-[#555555] hover:text-[#F5F5F5]"
                              }`}
                              style={{ fontFamily: "'Inter', sans-serif" }}
                            >
                              Q{i + 1}
                            </button>
                          ))}
                        </div>

                        {/* Active result */}
                        <div className="flex flex-col gap-3">
                          <div className="bg-[#141414] rounded-xl border border-[#222222] p-4">
                            <p className="text-xs text-[#A78BFA] uppercase tracking-widest font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                              Question
                            </p>
                            <p className="text-[#F5F5F5] text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                              {session.results[activeResult].question}
                            </p>
                          </div>

                          <div className="bg-[#141414] rounded-xl border border-[#222222] p-4">
                            <p className="text-xs text-[#34D399] uppercase tracking-widest font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                              Your Answer
                            </p>
                            <p className="text-[#F5F5F5] text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                              {session.results[activeResult].answer}
                            </p>
                          </div>

                          <div className="grid grid-cols-4 gap-2">
                            {[
                              ["Correctness", session.results[activeResult].correctness],
                              ["Communication", session.results[activeResult].communication],
                              ["Tech Depth", session.results[activeResult].technical_depth],
                              ["Confidence", session.results[activeResult].confidence],
                            ].map(([label, score]) => (
                              <div key={label as string} className="bg-[#141414] rounded-xl border border-[#222222] p-3 text-center">
                                <p className="text-xs text-[#555555] mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                                  {label as string}
                                </p>
                                <p
                                  className={`text-lg font-bold ${scoreColor(score as number)}`}
                                  style={{ fontFamily: "'Sora', sans-serif" }}
                                >
                                  {score as number}
                                </p>
                              </div>
                            ))}
                          </div>

                          <div className="bg-[#141414] rounded-xl border border-[#222222] p-4">
                            <p className="text-xs text-[#555555] uppercase tracking-widest font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                              Feedback
                            </p>
                            <p className="text-[#F5F5F5] text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                              {session.results[activeResult].feedback}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}