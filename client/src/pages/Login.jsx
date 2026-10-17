import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../context/useAuth";
import { getErrorMessage } from "../services/api";
import Alert from "../components/Alert";

const inputClass =
  "w-full rounded-md border border-[#EBE6D8] bg-white px-3 py-2 text-sm text-[#1A1A1A] outline-none focus:border-[#E87CA6] focus:ring-2 focus:ring-[#E87CA6]/30";

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email.trim() || !form.password) {
      setError("Email and password are required.");
      return;
    }
    try {
      setLoading(true);
      await login({ email: form.email.trim(), password: form.password });
    } catch (err) {
      setError(getErrorMessage(err));
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-xl border border-[#EBE6D8] bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-[#1A1A1A]">Welcome back</h1>
      <p className="text-sm text-[#1A1A1A]/60">Log in to manage your finances.</p>
      <Alert message={error} />

      <form onSubmit={handleSubmit} noValidate className="mt-6 grid gap-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-[#1A1A1A]">Email</label>
          <input id="email" name="email" type="email" value={form.email}
            onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-[#1A1A1A]">Password</label>
          <input id="password" name="password" type="password" value={form.password}
            onChange={handleChange} className={inputClass} />
        </div>
        <button
          type="submit" disabled={loading}
          className="rounded-md bg-[#1A1A1A] px-4 py-2 text-sm font-medium text-[#FBF9F1] hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-[#1A1A1A]/60">
        No account?{" "}
        <Link to="/register" className="font-medium text-[#1A1A1A] underline underline-offset-4 hover:opacity-70">Register</Link>
      </p>
    </div>
  );
}