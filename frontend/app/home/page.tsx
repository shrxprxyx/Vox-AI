import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default async function HomePage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const firstName = user.firstName || "there";

  return (
    <main className="min-h-screen" style={{ background: "#384959" }}>
      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-5 border-b" style={{ borderColor: "#6A89A7" }}>
        <span className="text-2xl font-bold tracking-tight" style={{ color: "#BDDDFC" }}>
          Vox AI
        </span>
        <div className="flex items-center gap-4">
          <span className="text-sm" style={{ color: "#88BDF2" }}>
            {user.emailAddresses[0].emailAddress}
          </span>
          <UserButton />
        </div>
      </nav>

      {/* Welcome */}
      <section className="px-10 py-14 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-2" style={{ color: "#BDDDFC" }}>
          Welcome back, {firstName} 👋
        </h1>
        <p className="text-base mb-12" style={{ color: "#6A89A7" }}>
          Ready to practice? Upload your resume and start a mock interview.
        </p>

        {/* Action cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          <Link href="/interview">
            <div
              className="rounded-2xl p-8 cursor-pointer hover:opacity-90 transition-all"
              style={{ background: "#88BDF2" }}
            >
              <span className="text-4xl">🎙️</span>
              <h2 className="text-xl font-bold mt-4 mb-2" style={{ color: "#384959" }}>
                Start Interview
              </h2>
              <p className="text-sm" style={{ color: "#384959" + "cc" }}>
                Upload your resume, pick a domain, and begin your mock interview session.
              </p>
            </div>
          </Link>

          <Link href="/dashboard">
            <div
              className="rounded-2xl p-8 cursor-pointer hover:opacity-90 transition-all"
              style={{ background: "#6A89A7" }}
            >
              <span className="text-4xl">📊</span>
              <h2 className="text-xl font-bold mt-4 mb-2" style={{ color: "#BDDDFC" }}>
                Past Sessions
              </h2>
              <p className="text-sm" style={{ color: "#BDDDFC" + "cc" }}>
                Review your previous interview scores, feedback, and transcripts.
              </p>
            </div>
          </Link>
        </div>

        {/* Domains */}
        <h2 className="text-lg font-semibold mb-4" style={{ color: "#BDDDFC" }}>
          Available Domains
        </h2>
        <div className="flex flex-wrap gap-3">
          {["Frontend", "Backend", "AI/ML", "DSA", "HR"].map((d) => (
            <span
              key={d}
              className="px-4 py-2 rounded-full text-sm font-medium"
              style={{ background: "#384959", border: "1px solid #6A89A7", color: "#88BDF2" }}
            >
              {d}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}