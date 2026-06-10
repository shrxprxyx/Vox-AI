import { UserButton, SignInButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b">
      <Link href="/" className="text-xl font-semibold">
        Vox AI
      </Link>

      <div>
        <SignInButton mode="modal">
          <button className="px-4 py-2 bg-black text-white rounded-lg text-sm">
            Sign In
          </button>
        </SignInButton>

        <UserButton />
      </div>
    </nav>
  );
}