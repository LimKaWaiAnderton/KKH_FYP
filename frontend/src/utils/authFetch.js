export async function authFetch(url, options = {}) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  // 1️⃣ Start with auth header
  const headers = {
    Authorization: `Bearer ${token}`,
    ...(options.headers || {}),
  };

  // 2️⃣ Add Content-Type ONLY if there is a body
  if (options.body) {
    headers["Content-Type"] = "application/json";
  }

  // 3️⃣ Make the request
  const res = await fetch(url, {
    ...options,
    headers,
  });

  return res;
}