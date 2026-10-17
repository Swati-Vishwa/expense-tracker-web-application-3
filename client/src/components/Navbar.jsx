import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";

const linkClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition ${isActive
    ? "bg-[#E87CA6] text-[#1A1A1A]"
    : "text-[#FBF9F1]/80 hover:bg-white/10 hover:text-[#FBF9F1]"
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-[#1A1A1A]">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3">
        <Link to="/" className="text-5xl font-bold text-[#F3D883] font-serif">
          Pockets
          <p className="text-xs font-light text-gray-400 font-mono">Expense Tracker app</p>
        </Link>

        {user ? (
          <div className="flex flex-wrap items-center gap-2">
            <NavLink to="/" end className={linkClass}>Dashboard</NavLink>
            <NavLink to="/transactions" className={linkClass}>Transactions</NavLink>
            <NavLink to="/reports" className={linkClass}>Reports</NavLink>
            <span className="hidden px-2 text-sm text-[#FBF9F1]/70 sm:inline">{user.name}</span>
            <button
              onClick={handleLogout}
              className="rounded-md border border-[#FBF9F1]/30 px-3 py-2 text-sm text-[#FBF9F1] hover:bg-white/10"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <NavLink to="/login" className={linkClass}>Login</NavLink>
            <NavLink to="/register" className={linkClass}>Register</NavLink>
          </div>
        )}
      </nav>
    </header>
  );
}