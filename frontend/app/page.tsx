import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";

export default async function LandingPage() {
  const user = await currentUser();

  return (
    <main className="min-h-screen flex flex-col" style={{ background: "#0D0D0D" }}>

      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-5">
        <span
          className="text-2xl font-bold tracking-tight"
          style={{ fontFamily: "'Sora', sans-serif", color: "#F5F5F5" }}
        >
          Vox AI
        </span>
        <div className="flex gap-3 items-center">
          {!user ? (
            <>
              <Link
                href="/sign-in"
                className="px-5 py-2 rounded-full text-sm font-medium border transition-all hover:opacity-80"
                style={{ borderColor: "#A78BFA", color: "#A78BFA", fontFamily: "'Inter', sans-serif" }}
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-5 py-2 rounded-full text-sm font-medium transition-all hover:opacity-90"
                style={{ background: "#A78BFA", color: "#0D0D0D", fontFamily: "'Inter', sans-serif" }}
              >
                Get Started
              </Link>
            </>
          ) : (
            <Link
              href="/home"
              className="px-5 py-2 rounded-full text-sm font-medium transition-all hover:opacity-90"
              style={{ background: "#A78BFA", color: "#0D0D0D", fontFamily: "'Inter', sans-serif" }}
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
          style={{
            background: "#A78BFA22",
            border: "1px solid #A78BFA44",
            color: "#A78BFA",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          AI-Powered Interview Prep
        </div>

        <h1
          className="text-5xl sm:text-6xl font-bold leading-tight max-w-3xl"
          style={{ fontFamily: "'Sora', sans-serif", color: "#F5F5F5" }}
        >
          Practice Interviews That{" "}
          <span style={{ color: "#34D399" }}>Know Your Resume</span>
        </h1>

        <p
          className="text-lg max-w-xl leading-relaxed"
          style={{ color: "#666666", fontFamily: "'Inter', sans-serif" }}
        >
          Upload your resume, pick a domain, and get personalized interview
          questions powered by AI — then answer by voice and receive instant
          feedback.
        </p>

        <div className="flex gap-4 flex-wrap justify-center">
          <Link
            href="/sign-up"
            className="px-8 py-3 rounded-full text-base font-semibold transition-all hover:opacity-90"
            style={{ background: "#A78BFA", color: "#0D0D0D", fontFamily: "'Sora', sans-serif" }}
          >
            Start for Free
          </Link>
          <Link
            href="/sign-in"
            className="px-8 py-3 rounded-full text-base font-semibold border transition-all hover:opacity-80"
            style={{ borderColor: "#333333", color: "#666666", fontFamily: "'Inter', sans-serif" }}
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-10 pb-24 max-w-5xl mx-auto w-full"
      >
        {[
          {
            icon: "ti-file-description",
            title: "Resume-Aware Questions",
            accent: "#A78BFA",
            desc: "Questions are generated from your actual experience, not generic templates.",
          },
          {
            icon: "ti-microphone",
            title: "Voice Answers",
            accent: "#34D399",
            desc: "Speak your answers naturally. Whisper transcribes and AI evaluates in real time.",
          },
          {
            icon: "ti-chart-bar",
            title: "Instant Feedback",
            accent: "#A78BFA",
            desc: "Get scored on correctness, communication, technical depth, and confidence.",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="rounded-2xl p-6 flex flex-col gap-3"
            style={{ background: "#141414", border: "1px solid #222222" }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: f.accent + "22",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <i className={`ti ${f.icon}`} style={{ fontSize: 20, color: f.accent }} aria-hidden="true" />
            </div>
            <h3
              className="font-semibold text-lg"
              style={{ fontFamily: "'Sora', sans-serif", color: "#F5F5F5" }}
            >
              {f.title}
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "#555555", fontFamily: "'Inter', sans-serif" }}
            >
              {f.desc}
            </p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer
        className="text-center py-6 text-sm border-t"
        style={{
          color: "#333333",
          borderColor: "#1A1A1A",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        © 2025 Vox AI — Built for final year project.
      </footer>

    </main>
  );
}