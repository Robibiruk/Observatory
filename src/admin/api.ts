import type { Project, TimelineMilestone } from "../data/types";
import type { TechItem } from "../lib/techGraph";

const TOKEN_KEY = "obs_admin_token";

export const getToken = () => sessionStorage.getItem(TOKEN_KEY);
export const setToken = (t: string) => sessionStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => sessionStorage.removeItem(TOKEN_KEY);

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });
  const data = (await res.json().catch(() => ({}))) as {
    error?: string;
    [k: string]: unknown;
  };
  if (!res.ok) {
    throw new ApiError(
      data.error ?? `Request failed (${res.status})`,
      res.status
    );
  }
  return data as T;
}

export async function login(password: string): Promise<string> {
  const data = await req<{ token: string }>("/.netlify/functions/admin-login", {
    method: "POST",
    body: JSON.stringify({ password }),
  });
  setToken(data.token);
  return data.token;
}

export async function verify(): Promise<void> {
  await req<{ ok: boolean }>("/.netlify/functions/admin?action=verify", {
    method: "POST",
    body: "{}",
  });
}

export function createItem<T>(
  resource: string,
  item: unknown
): Promise<{ item: T }> {
  return req(`/.netlify/functions/admin?action=create`, {
    method: "POST",
    body: JSON.stringify({ resource, item }),
  });
}

export function updateItem<T>(
  resource: string,
  id: number,
  item: unknown
): Promise<{ item: T }> {
  return req(`/.netlify/functions/admin?action=update`, {
    method: "POST",
    body: JSON.stringify({ resource, id, item }),
  });
}

export function deleteItem(
  resource: string,
  id: number
): Promise<{ ok: boolean }> {
  return req(`/.netlify/functions/admin?action=delete`, {
    method: "POST",
    body: JSON.stringify({ resource, id }),
  });
}

export function reorderItems(
  resource: string,
  orderedIds: number[]
): Promise<{ ok: boolean }> {
  return req(`/.netlify/functions/admin?action=reorder`, {
    method: "POST",
    body: JSON.stringify({ resource, orderedIds }),
  });
}

export function seedItems(payload: {
  projects: Project[];
  missions: TimelineMilestone[];
  tech: TechItem[];
}): Promise<{ inserted: { projects: number; missions: number; tech: number } }> {
  return req(`/.netlify/functions/admin?action=seed`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
