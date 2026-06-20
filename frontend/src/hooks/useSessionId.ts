import { useMemo } from "react";

const SESSION_KEY = "stayfinder_session_id";

function generateId(): string {
  return crypto.randomUUID();
}

export function useSessionId(): string {
  return useMemo(() => {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = generateId();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  }, []);
}

export function getSessionId(): string {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = generateId();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}
