"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();

  const studentLinks = [
    { href: "/dashboard", label: "My Books" },
    { href: "/dashboard/student/browse", label: "Browse Books" },
    { href: "/dashboard/student/reservations", label: "Reservations" },
    { href: "/dashboard/student/suggestions", label: "Suggestions" },
    { href: "/dashboard/student/fines", label: "Fines" },
  ];

  const librarianLinks = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/librarian/books", label: "Manage Books" },
    { href: "/dashboard/librarian/borrowings", label: "Borrowings" },
    { href: "/dashboard/librarian/suggestions", label: "Suggestions" },
  ];

  const links = user.role === "librarian" ? librarianLinks : studentLinks;

  return (
    <nav className="bg-green-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <span className="text-xl font-bold">Library</span>
            </Link>

            <div className="hidden md:flex space-x-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    pathname === link.href
                      ? "bg-green-800 text-white"
                      : "text-green-100 hover:bg-green-600"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-green-200 capitalize">{user.role}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="bg-green-800 hover:bg-green-900 px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

