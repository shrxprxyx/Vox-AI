import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";

export default async function LandingPage() {
  const user = await currentUser();

  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ background: "#384959" }}
    >
      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-5">
        <span className="text-2xl font-bold tracking-tight" style={{ color: "#BDDDFC" }}>
          Vox AI
        </span>
        <div className="flex gap-3">
          {!user ? (
            <>
              <Link
                href="/sign-in"
                className="px-5 py-2 rounded-full text-sm font-medium border transition-all"
                style={{ borderColor: "#88BDF2", color: "#88BDF2" }}
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-5 py-2 rounded-full text-sm font-medium transition-all"
                style={{ background: "#88BDF2", color: "#384959" }}
              >
                Get Started
              </Link>
            </>
          ) : (
            <Link
              href="/home"
              className="px-5 py-2 rounded-full text-sm font-medium transition-all"
              style={{ background: "#88BDF2", color: "#384959" }}
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center flex-1 text-center px-6 py-24 gap-8">
        <div
          className="text-xs font-semibold uppercase tracking-widest px-4 py-1 rounded-full"
          style={{ background: "#6A89A7", color: "#BDDDFC" }}
        >
          AI-Powered Interview Prep
        </div>

        <h1
          className="text-5xl sm:text-6xl font-bold leading-tight max-w-3xl"
          style={{ color: "#BDDDFC" }}
        >
          Practice Interviews That{" "}
          <span style={{ color: "#88BDF2" }}>Know Your Resume</span>
        </h1>

        <p
          className="text-lg max-w-xl leading-relaxed"
          style={{ color: "#6A89A7" }}
        >
          Upload your resume, pick a domain, and get personalized interview
          questions powered by AI — then answer by voice and receive instant
          feedback.
        </p>

        <div className="flex gap-4 flex-wrap justify-center">
          <Link
            href="/sign-up"
            className="px-8 py-3 rounded-full text-base font-semibold transition-all hover:opacity-90"
            style={{ background: "#88BDF2", color: "#384959" }}
          >
            Start for Free
          </Link>
          <Link
            href="/sign-in"
            className="px-8 py-3 rounded-full text-base font-semibold border transition-all"
            style={{ borderColor: "#6A89A7", color: "#BDDDFC" }}
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-10 pb-24 max-w-5xl mx-auto w-full">
        {[
          {
            icon: "📄",
            title: "Resume-Aware Questions",
            desc: "Questions are generated from your actual experience, not generic templates.",
          },
          {
            icon: "🎙️",
            title: "Voice Answers",
            desc: "Speak your answers naturally. Whisper transcribes and AI evaluates in real time.",
          },
          {
            icon: "📊",
            title: "Instant Feedback",
            desc: "Get scored on correctness, communication, technical depth, and confidence.",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="rounded-2xl p-6 flex flex-col gap-3"
            style={{ background: "#6A89A733", border: "1px solid #6A89A7" }}
          >
            <span className="text-3xl">{f.icon}</span>
            <h3 className="font-semibold text-lg" style={{ color: "#BDDDFC" }}>
              {f.title}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "#88BDF2" }}>
              {f.desc}
            </p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer
        className="text-center py-6 text-sm"
        style={{ color: "#6A89A7" }}
      >
        © 2025 Vox AI. Built for final year project.
      </footer>
    </main>
  );
}