import axios from 'axios';

const API_BASE_URL = 'https://spamsharev2api.onrender.com';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ShareRequest {
  cookie: string;
  url: string;
  amount: number;
  interval: number;
}

export interface ShareResponse {
  status: number;
  message: string;
  session_id: string;
  target_shares: number;
  start_time: string;
}

export interface Session {
  session: number;
  url: string;
  count: number;
  id: string;
  target: number;
  start_time: string;
  last_update: string;
  last_status: string;
  success_rate: string;
  consecutive_errors: number;
  last_error?: string;
}

export interface MetricsResponse {
  total_urls_submitted: number;
  total_successful_urls: number;
  total_failed_urls: number;
  shares_statistics: {
    total_shares: number;
    successful_shares: number;
    failed_shares: number;
    success_rate: string;
  };
  successful_urls_details: any[];
  failed_urls_details: any[];
}

export interface FailedUrlsResponse {
  total_failed: number;
  failure_reasons_summary: Record<string, number>;
  failed_urls: any[];
}

export const api = {
  submitShare: async (data: ShareRequest): Promise<ShareResponse> => {
    const response = await axiosInstance.post('/api/submit', data);
    return response.data;
  },

  getMetrics: async (): Promise<MetricsResponse> => {
    const response = await axiosInstance.get('/metrics');
    return response.data;
  },

  getTotalSessions: async (): Promise<Session[]> => {
    const response = await axiosInstance.get('/total');
    return response.data;
  },

  getFailedUrls: async (): Promise<FailedUrlsResponse> => {
    const response = await axiosInstance.get('/failed_urls');
    return response.data;
  }
};