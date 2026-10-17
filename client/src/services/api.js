import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

// Attach the token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the token is rejected (expired/invalid), clear it and go to login
API.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config?.url || "";
    const isAuthForm = url.includes("/auth/login") || url.includes("/auth/register");
    if (err.response?.status === 401 && !isAuthForm) {
      localStorage.removeItem("token");
      if (!["/login", "/register"].includes(window.location.pathname)) {
        window.location.assign("/login");
      }
    }
    return Promise.reject(err);
  }
);

// Drop empty filter values so they aren't sent as ?type=
const clean = (params = {}) =>
  Object.fromEntries(Object.entries(params).filter(([, v]) => v !== "" && v != null));

// Auth
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getMe = () => API.get("/auth/me");

// Transactions
export const getTransactions = (params) => API.get("/transactions", { params: clean(params) });
export const getSummary = (params) => API.get("/transactions/summary", { params: clean(params) });
export const addTransaction = (data) => API.post("/transactions", data);
export const updateTransaction = (id, data) => API.put(`/transactions/${id}`, data);
export const deleteTransaction = (id) => API.delete(`/transactions/${id}`);

export const getErrorMessage = (err) =>
  err.response?.data?.message || "Cannot reach the server";