import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KittithatITMan — SaaS for modern IT teams",
  description:
    "KittithatITMan helps IT teams streamline operations, ticketing, and customer relationships in one place.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900">{children}</body>
    </html>
  );
}
