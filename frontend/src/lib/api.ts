
import { useAuthStore } from '@/store/auth';

const BASE_URL = 'http://localhost:8000';

type FetchOptions = RequestInit & {
    requiresAuth?: boolean;
};

export async function apiFetch(endpoint: string, options: FetchOptions = {}) {
    const { token, logout } = useAuthStore.getState();

    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

    const headers = new Headers(options.headers || {});

    // Default to JSON content type if not specified and not FormData
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }

    // Add Authorization header if token exists
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    // Handle 401 Unauthorized
    if (response.status === 401) {
        logout();
        // No need to manually redirect if we use the auth state in ProtectedRoute 
        // or if the component reacts to logout state change.
        // However, throwing error stops the caller execution flow.
        throw new Error('Session expired. Please login again.');
    }

    return response;
}
