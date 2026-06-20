import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default async function HomePage() {
    const user = await currentUser();
    if (!user) redirect("/sign-in");

    const firstName = user.firstName || "there";

    return (
        <main className="min-h-screen" style={{ background: "#0D0D0D" }}>

            {/* Navbar */}
            <nav
                className="flex items-center justify-between px-10 py-5 border-b"
                style={{ borderColor: "#1A1A1A" }}
            >
                <span
                    className="text-2xl font-bold tracking-tight"
                    style={{ fontFamily: "'Sora', sans-serif", color: "#F5F5F5" }}
                >
                    Vox AI
                </span>
                <div className="flex items-center gap-4">
                    <span
                        className="text-sm"
                        style={{ color: "#555555", fontFamily: "'Inter', sans-serif" }}
                    >
                        {user.emailAddresses[0].emailAddress}
                    </span>
                    <UserButton />
                </div>
            </nav>

            {/* Content */}
            <section className="px-10 py-14 max-w-5xl mx-auto">

                {/* Greeting */}
                {/* Greeting — no emoji */}
                <h1
                    className="text-4xl font-bold mb-2"
                    style={{ fontFamily: "'Sora', sans-serif", color: "#F5F5F5" }}
                >
                    Welcome back, {firstName}
                </h1>

                {/* Action cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                    <Link href="/interview">
                        <div
                            className="rounded-2xl p-8 cursor-pointer transition-all hover:opacity-90"
                            style={{ background: "#A78BFA" }}
                        >
                            <i className="ti ti-microphone" style={{ fontSize: 32, color: "#0D0D0D" }} aria-hidden="true" />
                            <h2
                                className="text-xl font-bold mt-4 mb-2"
                                style={{ fontFamily: "'Sora', sans-serif", color: "#0D0D0D" }}
                            >
                                Start Interview
                            </h2>
                            <p
                                className="text-sm"
                                style={{ color: "#0D0D0Dcc", fontFamily: "'Inter', sans-serif" }}
                            >
                                Upload your resume, pick a domain, and begin your mock interview session.
                            </p>
                        </div>
                    </Link>

                    <Link href="/dashboard">
                        <div
                            className="rounded-2xl p-8 cursor-pointer transition-all hover:opacity-90"
                            style={{ background: "#141414", border: "1px solid #222222" }}
                        >
                            <i className="ti ti-layout-dashboard" style={{ fontSize: 32, color: "#A78BFA" }} aria-hidden="true" />
                            <h2
                                className="text-xl font-bold mt-4 mb-2"
                                style={{ fontFamily: "'Sora', sans-serif", color: "#F5F5F5" }}
                            >
                                Past Sessions
                            </h2>
                            <p
                                className="text-sm"
                                style={{ color: "#555555", fontFamily: "'Inter', sans-serif" }}
                            >
                                Review your previous interview scores, feedback, and transcripts.
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Domains */}
                <h2
                    className="text-lg font-semibold mb-4"
                    style={{ fontFamily: "'Sora', sans-serif", color: "#F5F5F5" }}
                >
                    Available Domains
                </h2>
                <div className="flex flex-wrap gap-3">
                    {["Frontend", "Backend", "AI/ML", "DSA", "HR"].map((d) => (
                        <span
                            key={d}
                            className="px-4 py-2 rounded-full text-sm font-medium"
                            style={{
                                background: "#141414",
                                border: "1px solid #222222",
                                color: "#A78BFA",
                                fontFamily: "'Inter', sans-serif",
                            }}
                        >
                            {d}
                        </span>
                    ))}
                </div>

            </section>
        </main>
    );
}