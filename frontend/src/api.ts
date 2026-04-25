const API_URL = import.meta.env.VITE_API_URL || "http://localhost:6969";


export const createProfile = async (payload: any) => {
  const res = await fetch(`${API_URL}/profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create profile");
  return res.json();
};

export const getProfile = async () => {
  const res = await fetch(`${API_URL}/profile`);
  if (!res.ok) throw new Error("Profile not found");
  return res.json();
};

export const logWorkout = async (payload: any) => {
  const res = await fetch(`${API_URL}/log`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to log workout");
  return res.json();
};

export const getLogs = async () => {
  const res = await fetch(`${API_URL}/logs`);
  if (!res.ok) throw new Error("Failed to fetch logs");
  return res.json();
};

export const getRecommendation = async (payload: { api_key: string }) => {
  const res = await fetch(`${API_URL}/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.detail || "Failed to fetch recommendation");
  }
  return res.json();
};
