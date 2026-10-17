import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import Navbar from "./components/Navbar";
import { ProtectedRoute, GuestRoute } from "./components/RouteGuards";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-slate-50 text-slate-800">
          <Navbar />
          <main className="mx-auto max-w-6xl px-4 py-8">
            <Routes>
              <Route element={<GuestRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/reports" element={<Reports />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}