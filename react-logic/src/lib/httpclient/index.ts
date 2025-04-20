type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type HTTPResponse<T> = {
  response: Response;
  body: T;
};

export default class HTTPClient {
  baseURL: string;
  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async request<I, O>(
    method: HTTPMethod,
    path: string,
    data?: I,
  ): Promise<HTTPResponse<O>> {
    const url = `${this.baseURL}${path}`;
    const options: {
      method: HTTPMethod;
      headers: {
        "Content-Type": string;
      };
      body?: string;
    } = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
    };

    const res = await fetch(url, options);
    const body = await res.json();

    return {
      response: res,
      body,
    };
  }

  async get(path: string) {
    return this.request("GET", path);
  }

  async post<I, O>(path: string, data: I) {
    return this.request<I, O>("POST", path, data);
  }

  async patch<I, O>(path: string, data: I) {
    return this.request<I, O>("PATCH", path, data);
  }

  async delete<I, O>(path: string) {
    return this.request<I, O>("DELETE", path);
  }
}
