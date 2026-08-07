/** JSON response helper for the classic Netlify function signature. */
export function json(statusCode: number, data: unknown) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
}

export function methodNotAllowed() {
  return json(405, { error: "Method not allowed" });
}

export function unauthorized() {
  return json(401, { error: "Unauthorized" });
}

export function badRequest(message = "Bad request") {
  return json(400, { error: message });
}

export function parseBody<T = Record<string, unknown>>(body: string | null): T {
  if (!body) return {} as T;
  try {
    return JSON.parse(body) as T;
  } catch {
    return {} as T;
  }
}
