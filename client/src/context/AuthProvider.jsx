import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { getMe, loginUser, registerUser } from "../services/api";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // Only "loading" if there's a saved token we need to verify
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem("token")));

  // On page load, restore the session from the saved token
  useEffect(() => {
    if (!localStorage.getItem("token")) return;
    let ignore = false;

    const restore = async () => {
      try {
        const { data } = await getMe();
        if (!ignore) setUser(data.data);
      } catch {
        localStorage.removeItem("token");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    restore();
    return () => {
      ignore = true;
    };
  }, []);

  const saveSession = ({ user, token }) => {
    localStorage.setItem("token", token);
    setUser(user);
  };

  const login = async (credentials) => {
    const { data } = await loginUser(credentials);
    saveSession(data.data);
  };

  const register = async (info) => {
    const { data } = await registerUser(info);
    saveSession(data.data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}