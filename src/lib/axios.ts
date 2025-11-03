import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to track if we're currently refreshing the token
let isRefreshing = false;
// Queue to store failed requests while refreshing
let failedQueue: Array<{
  resolve: (value?: string | null) => void;
  reject: (error?: unknown) => void;
}> = [];

// Process queued requests after token refresh
const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Response interceptor to handle 401 errors and token refresh
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If error is not 401 or request was already retried, reject
    if (!originalRequest || error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Skip token refresh for login, signup, and refresh-token endpoints
    if (
      originalRequest.url?.includes('/user/login') ||
      originalRequest.url?.includes('/user/register') ||
      originalRequest.url?.includes('/user/refresh-token')
    ) {
      return Promise.reject(error);
    }

    // If already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => {
          return axiosInstance(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Call refresh token endpoint
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/refresh-token`,
        { refreshToken },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const newRefreshToken = response.data?.data?.refreshToken;

      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
      }

      // Process queued requests
      processQueue(null, newRefreshToken);

      // Retry the original request
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      // Refresh failed - clear token and redirect to login
      processQueue(refreshError as AxiosError, null);
      localStorage.removeItem('refreshToken');

      // Redirect to login page if we're in the browser
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;

