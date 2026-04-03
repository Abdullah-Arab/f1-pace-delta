const BASE_URL = 'https://api.openf1.org/v1';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
  retries = 3
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  for (let i = 0; i <= retries; i++) {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (response.ok) {
      return response.json() as Promise<T>;
    }

    if (response.status === 404) {
      // The OpenF1 API returns 404 for "No results found."
      return [] as unknown as T;
    }

    if (response.status === 429 && i < retries) {
      // Rate limit hit: Max 3 requests/second
      // Backoff progressively: 1s, 2s, 4s
      const waitTime = Math.pow(2, i) * 1000;
      await delay(waitTime);
      continue;
    }
    
    throw new ApiError(
      response.status,
      `API Error: ${response.status} ${response.statusText}`
    );
  }

  throw new ApiError(500, 'Max retries reached');
}
