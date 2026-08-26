import { authHeaders, fetchJson } from "../../shared/api/client";

export interface PushDevice {
  id: string;
  user_agent: string | null;
  created_at: string;
  last_seen_at: string;
}

export interface PushTestResult {
  success: boolean;
  delivered: number;
  total: number;
}

function jsonRequest(token: string | null, method: string, body?: unknown): RequestInit {
  return {
    method,
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: body === undefined ? undefined : JSON.stringify(body),
  };
}

export async function fetchVapidKey(token: string | null) {
  return fetchJson<{ configured: boolean; publicKey: string | null }>("/api/admin/push/key", {
    headers: authHeaders(token),
  });
}

export async function fetchPushDevices(token: string | null) {
  return fetchJson<{ configured: boolean; devices: PushDevice[] }>("/api/admin/push/devices", {
    headers: authHeaders(token),
  });
}

export async function registerPushSubscription(token: string | null, subscription: PushSubscriptionJSON) {
  return fetchJson<{ success: boolean }>(
    "/api/admin/push/subscribe",
    jsonRequest(token, "POST", subscription)
  );
}

export async function removePushSubscription(token: string | null, endpoint: string) {
  return fetchJson<{ success: boolean }>(
    "/api/admin/push/subscribe",
    jsonRequest(token, "DELETE", { endpoint })
  );
}

export async function sendTestPush(token: string | null) {
  return fetchJson<PushTestResult>("/api/admin/push/test", jsonRequest(token, "POST"));
}
