import axios, { AxiosError } from 'axios';

const environment = import.meta.env.VITE_ENVIRONMENT || 'DEVELOPMENT';

const BASE_URL: Record<string, string> = {
  DEVELOPMENT: 'http://localhost:8000/v1',
  PRODUCTION: 'https://hermes-api.ishantdahiya.com/v1',
};

const BackendBaseURL: string = BASE_URL[environment];

const instance = axios.create({
  baseURL: BackendBaseURL,
  withCredentials: true,
  timeout: 60 * 1000,
});

const shouldRefresh = (error: AxiosError) => {
  return (
    (error.status === 401 ||
      (error.response && error.response.status === 401)) &&
    !error.config?.url?.includes('/auth/')
  );
};

instance.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    if (shouldRefresh(error)) await Request('POST', '/auth/logout/', null);

    return Promise.reject(error.response ? error.response.data : error);
  }
);

const SetHeader = (key: string, value: string) => {
  instance.defaults.headers.common[key] = value;
};

const RemoveHeader = (key: string) => {
  delete instance.defaults.headers.common[key];
};

const Request = async (method: string, url: string, body?: any) => {
  const requestOptions = {
    method: method,
    url: url,
    data: body,
    headers: { 'Content-Type': 'application/json' },
  };

  try {
    const response = await instance.request(requestOptions);
    return response;
  } catch (error) {
    throw error;
  }
};

export { Request, SetHeader, RemoveHeader, BackendBaseURL };
