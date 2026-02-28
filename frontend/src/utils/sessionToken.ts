const SESSION_TOKEN_KEY = 'resume_builder_session_token';

function generateToken(): string {
  const array = new Uint8Array(24);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
}

export function getOrCreateSessionToken(): string {
  const existing = localStorage.getItem(SESSION_TOKEN_KEY);
  if (existing) return existing;
  const token = generateToken();
  localStorage.setItem(SESSION_TOKEN_KEY, token);
  return token;
}

export function getSessionToken(): string | null {
  return localStorage.getItem(SESSION_TOKEN_KEY);
}
