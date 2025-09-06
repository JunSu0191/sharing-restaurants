const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8080";

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  name: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
};

/** 토큰 저장 키 */
const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";
const USER_KEY = "current_user";

function setTokens(data: AuthResponse | null) {
  if (!data) {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    // 같은 탭에서 상태 갱신 알림
    window.dispatchEvent(new Event("authchange"));
    return;
  }
  if (data.accessToken) {
    localStorage.setItem(ACCESS_KEY, data.accessToken);
  }
  if (data.refreshToken) {
    localStorage.setItem(REFRESH_KEY, data.refreshToken);
  }
  // 같은 탭에서 상태 갱신 알림
  window.dispatchEvent(new Event("authchange"));
}

export function setUser(user: any | null) {
  if (!user) {
    localStorage.removeItem(USER_KEY);
  } else {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  window.dispatchEvent(new Event("authchange"));
}

export function getCurrentUserFromStorage(): any | null {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY);
}
function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}
export function clearAuth() {
  setTokens(null);
}

async function refreshTokens(): Promise<boolean> {
  try {
    const refreshToken = getRefreshToken();

    if (refreshToken) {
      const res = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) return false;
      const ct = res.headers.get("content-type") || "";
      const data = ct.includes("application/json") ? await res.json() : null;
      if (data?.accessToken) {
        setTokens(data);
        return true;
      }
      return false;
    } else {
      const res = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) return false;
      const ct = res.headers.get("content-type") || "";
      const data = ct.includes("application/json") ? await res.json() : null;
      if (data?.accessToken) {
        setTokens(data);
        return true;
      }
      return false;
    }
  } catch {
    return false;
  }
}

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const makeFetch = async (withAuth = true) => {
    const headers = {
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    } as Record<string, string>;

    if (withAuth) {
      const token = getAccessToken();
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }

    return fetch(`${API_BASE}${path}`, {
      ...opts,
      headers,
      credentials: opts.credentials ?? "include",
    });
  };

  let res = await makeFetch(true);
  const contentType = res.headers.get("content-type") || "";
  let raw = await res.text();

  if (res.status === 401) {
    const refreshed = await refreshTokens();
    if (refreshed) {
      res = await makeFetch(true);
      raw = await res.text();
    } else {
      clearAuth();
      throw new Error(raw || res.statusText || "Unauthorized");
    }
  }

  if (!res.ok) {
    if (contentType.includes("application/json")) {
      try {
        const json = JSON.parse(raw);
        throw new Error(JSON.stringify(json));
      } catch {
        throw new Error(raw || res.statusText);
      }
    } else {
      throw new Error(raw || res.statusText);
    }
  }

  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(raw) as T;
    } catch {
      throw new Error(`Invalid JSON response. Body: ${raw.slice(0, 300)}`);
    }
  }

  return raw as unknown as T;
}

export const authApi = {
  login: async (body: LoginRequest) => {
    const data = await request<any>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
      credentials: "include",
    });

    const accessToken = (data && (data.accessToken ?? data.token)) || null;
    const refreshToken = data?.refreshToken ?? null;

    if (accessToken) {
      setTokens({ accessToken, refreshToken: refreshToken ?? undefined });
    }

    if (data?.user) {
      setUser(data.user);
    }

    return {
      accessToken,
      refreshToken,
      ...(data?.expiresIn ? { expiresIn: data.expiresIn } : {}),
      user: data?.user ?? null,
    } as AuthResponse & { user?: any };
  },

  register: async (body: RegisterRequest) => {
    const data = await request<{
      message?: string;
      accessToken?: string;
      refreshToken?: string;
    }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
      credentials: "include",
    });

    if (data.accessToken) {
      setTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
    }

    return data;
  },

  oauthRedirectUrl: (provider: "google" | "kakao" | "naver") =>
    `${API_BASE}/oauth2/authorization/${provider}`,

  refresh: async () => {
    const ok = await refreshTokens();
    if (!ok) throw new Error("refresh failed");
    return {
      accessToken: getAccessToken(),
      refreshToken: getRefreshToken(),
    } as AuthResponse;
  },

  logout: () => {
    clearAuth();
  },
};