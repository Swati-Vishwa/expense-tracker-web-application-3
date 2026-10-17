import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-4xl font-bold text-[#1A1A1A]">404</h1>
      <p className="mt-2 text-[#1A1A1A]/60">This page doesn't exist.</p>
      <Link
        to="/"
        className="mt-4 inline-block rounded-md bg-[#A2B5E2] px-4 py-2 text-sm font-medium text-[#1A1A1A] hover:opacity-90"
      >
        Go to dashboard
      </Link>
    </div>
  );
}