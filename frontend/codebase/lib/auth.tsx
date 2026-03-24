import axios from "axios";

// Default FastAPI backend URL
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const loginUser = async (email: string, password: string) => {
  const res = await axios.post(`${API}/api/auth/login`, {
    email,
    password,
  });
  return res.data;
};

export const registerUser = async (email: string, password: string) => {
  const res = await axios.post(`${API}/api/auth/register`, {
    email,
    password,
  });
  return res.data;
};