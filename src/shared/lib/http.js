export async function http(path, { method = 'GET', headers = {}, body } = {}) {
  const res = await fetch(path, {
    method,
    headers: { Accept: 'application/json', ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} – ${text || res.statusText}`);
  }
  return res.json();
}
