import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found. Please login.");
  return { Authorization: `Bearer ${token}` };
};

export const analyzeRepo = async (repoUrl: string) => {
  const res = await axios.post(`${API}/api/analyze`, { repo_url: repoUrl }, { headers: getHeaders() });
  return res.data;
};

export const chatInteraction = async (query: string, collectionName: string) => {
  const res = await axios.post(`${API}/api/chat`, { query, collection_name: collectionName }, { headers: getHeaders() });
  return res.data;
};

export const getRecentRepos = async () => {
  const res = await axios.get(`${API}/api/history/repos`, { headers: getHeaders() });
  return res.data;
};

export const getChatHistory = async (repositoryId: string) => {
  const res = await axios.get(`${API}/api/history/chats/${repositoryId}`, { headers: getHeaders() });
  return res.data;
};
