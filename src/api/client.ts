const BASE_URL = 'https://api.openf1.org/v1';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      // The OpenF1 API returns 404 for "No results found."
      // Returning array/null equivalent here based on generic T is tricky,
      // but returning an empty array avoids breaking iterators if T is an array type.
      return [] as unknown as T;
    }
    
    throw new ApiError(
      response.status,
      `API Error: ${response.status} ${response.statusText}`
    );
  }

  return response.json() as Promise<T>;
}
