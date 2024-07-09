import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Task",
  description: "Track tasks and ideas",
};

function NavBar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-900 text-white  transition-colors">
      <Link href="/" className="text-2xl font-bold  hover:text-slate-300">
        Task
      </Link>
      <div>
        <Link href="/login" className="mr-4 hover:text-slate-300">
          Login
        </Link>
      </div>
    </nav>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
