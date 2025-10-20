import { AuthProvider } from "react-admin";

const API_URL = 'https://localhost:7225/api';

interface LoginResponse {
  success: boolean;
  userName: string;
  accessToken: string;
  refreshToken: string;
  errors?: string[];
}

interface RefreshTokenResponse {
  success: boolean;
  userName: string;
  accessToken: string;
  refreshToken: string;
}

interface StoredAuth {
  accessToken: string;
  refreshToken: string;
  userName: string;
  role: string;
  userId: number;
}

// Decode JWT để lấy thông tin role và userId
const decodeJWT = (token: string): { role: string; userId: number; exp: number } | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const payload = JSON.parse(jsonPayload);
    return {
      role: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload.role,
      userId: parseInt(payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || payload.sub),
      exp: payload.exp
    };
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

// Kiểm tra token có hết hạn không
const isTokenExpired = (token: string): boolean => {
  const decoded = decodeJWT(token);
  if (!decoded) return true;

  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

// Refresh token
const refreshAccessToken = async (): Promise<boolean> => {
  const authString = localStorage.getItem('auth');
  if (!authString) return false;

  const auth: StoredAuth = JSON.parse(authString);

  try {
    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: auth.refreshToken })
    });

    if (!response.ok) {
      localStorage.clear();
      return false;
    }

    const data: RefreshTokenResponse = await response.json();

    if (!data.success) {
      localStorage.clear();
      return false;
    }

    const decoded = decodeJWT(data.accessToken);
    if (!decoded) {
      localStorage.clear();
      return false;
    }

    const newAuth: StoredAuth = {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      userName: data.userName,
      role: decoded.role,
      userId: decoded.userId
    };

    localStorage.setItem('auth', JSON.stringify(newAuth));
    return true;
  } catch (error) {
    console.error('Refresh token failed:', error);
    localStorage.clear();
    return false;
  }
};

const authProvider: AuthProvider = {
  login: async ({ email, password }: { email: string; password: string }) => {
    const request = new Request(`${API_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    try {
      const response = await fetch(request);

      if (!response.ok) {
        throw new Error('Đăng nhập không thành công');
      }

      const data: LoginResponse = await response.json();

      if (!data.success) {
        throw new Error(data.errors?.[0] || 'Đăng nhập không thành công');
      }

      // Decode JWT để lấy role
      const decoded = decodeJWT(data.accessToken);

      if (!decoded) {
        throw new Error('Token không hợp lệ');
      }

      // Kiểm tra role Admin
      if (decoded.role !== 'Admin') {
        throw new Error('Bạn không có quyền truy cập trang Admin');
      }

      // Lưu thông tin auth
      const auth: StoredAuth = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        userName: data.userName,
        role: decoded.role,
        userId: decoded.userId
      };

      localStorage.setItem('auth', JSON.stringify(auth));
      return Promise.resolve();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Đăng nhập không thành công');
    }
  },

  logout: () => {
    localStorage.clear();
    return Promise.resolve();
  },

  checkError: async (error) => {
    const status = error.status;

    // Nếu lỗi 401, thử refresh token
    if (status === 401) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        return Promise.resolve(); // Token đã được refresh, retry request
      }
      localStorage.clear();
      return Promise.reject();
    }

    if (status === 403) {
      localStorage.clear();
      return Promise.reject();
    }

    return Promise.resolve();
  },

  checkAuth: async () => {
    const authString = localStorage.getItem('auth');

    if (!authString) {
      return Promise.reject();
    }

    const auth: StoredAuth = JSON.parse(authString);

    // Kiểm tra role Admin
    if (auth.role !== 'Admin') {
      localStorage.clear();
      return Promise.reject('Bạn không có quyền truy cập');
    }

    // Kiểm tra token có hết hạn không
    if (isTokenExpired(auth.accessToken)) {
      // Thử refresh token
      const refreshed = await refreshAccessToken();
      if (!refreshed) {
        return Promise.reject('Token đã hết hạn');
      }
    }

    return Promise.resolve();
  },

  getPermissions: async () => {
    const authString = localStorage.getItem('auth');
    if (!authString) return Promise.reject();

    const auth: StoredAuth = JSON.parse(authString);

    // Chỉ cho phép Admin
    if (auth.role !== 'Admin') {
      return Promise.reject();
    }

    return Promise.resolve(auth.role);
  },

  getIdentity: () => {
    const authString = localStorage.getItem('auth');
    if (!authString) return Promise.reject();

    const auth: StoredAuth = JSON.parse(authString);

    return Promise.resolve({
      id: auth.userId,
      fullName: auth.userName,
      avatar: undefined
    });
  },
};

export default authProvider;