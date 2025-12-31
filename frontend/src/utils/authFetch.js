export async function authFetch(url, options = {}) {
  const token = localStorage.getItem("token");

  if (!token) {
    console.warn("❌ No token found");
    return null;
  }

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  return res;
}
