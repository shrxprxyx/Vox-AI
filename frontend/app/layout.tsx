import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
// @ts-ignore: allow global CSS side-effect import without module declarations
import "./globals.css";

export const metadata: Metadata = {
  title: "Vox AI",
  description: "AI-Powered Mock Interview Assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning={true}>
        <head>
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css"
          />
        </head>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}