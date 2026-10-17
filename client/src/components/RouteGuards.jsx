import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../context/useAuth";

const Loading = () => <p className="mt-20 text-center text-slate-500">Loading...</p>;

// Only logged-in users can enter
export function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

// Login/Register are hidden once logged in
export function GuestRoute() {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  return user ? <Navigate to="/" replace /> : <Outlet />;
}