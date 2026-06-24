const API_BASE_URL = '/api';

const getHeaders = (isFormData = false) => {
    const token = localStorage.getItem('token');
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (!isFormData) headers['Content-Type'] = 'application/json';
    return headers;
};

const handleResponse = async (response) => {
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        const error = new Error(data.message || 'An error occurred');
        error.status = response.status;
        throw error;
    }
    return data;
};

export const authAPI = {
    login: async (email, password) => {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST', headers: getHeaders(),
            body: JSON.stringify({ email, password }),
        });
        return handleResponse(res);
    },
    register: async (name, email, password) => {
        const res = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST', headers: getHeaders(),
            body: JSON.stringify({ name, email, password }),
        });
        return handleResponse(res);
    },
};

export const blogsAPI = {
    getAll: async () => {
        const res = await fetch(`${API_BASE_URL}/blog/all`, { headers: getHeaders() });
        return handleResponse(res);
    },
    getById: async (id) => {
        const res = await fetch(`${API_BASE_URL}/blog/${id}`, { headers: getHeaders() });
        return handleResponse(res);
    },
    create: async (formData) => {
        const res = await fetch(`${API_BASE_URL}/blog/create`, {
            method: 'POST', headers: getHeaders(true), body: formData,
        });
        return handleResponse(res);
    },
    update: async (id, formData) => {
        const res = await fetch(`${API_BASE_URL}/blog/update/${id}`, {
            method: 'PUT', headers: getHeaders(true), body: formData,
        });
        return handleResponse(res);
    },
    delete: async (id) => {
        const res = await fetch(`${API_BASE_URL}/blog/delete/${id}`, {
            method: 'DELETE', headers: getHeaders(),
        });
        return handleResponse(res);
    },
};

export const userAPI = {
    getProfile: async () => {
        const res = await fetch(`${API_BASE_URL}/user/profile`, { headers: getHeaders() });
        return handleResponse(res);
    },
    updateProfile: async (formData) => {
        const res = await fetch(`${API_BASE_URL}/user/update-profile`, {
            method: 'PUT', headers: getHeaders(true), body: formData,
        });
        return handleResponse(res);
    },
    getMyBlogs: async () => {
        const res = await fetch(`${API_BASE_URL}/user/my-blogs`, { headers: getHeaders() });
        return handleResponse(res);
    },
};

export const adminAPI = {
    getAllUsers: async () => {
        const res = await fetch(`${API_BASE_URL}/admin/users`, { headers: getHeaders() });
        return handleResponse(res);
    },
    deleteUser: async (id) => {
        const res = await fetch(`${API_BASE_URL}/admin/delete-user/${id}`, {
            method: 'DELETE', headers: getHeaders(),
        });
        return handleResponse(res);
    },
    toggleBlock: async (id) => {
        const res = await fetch(`${API_BASE_URL}/admin/toggle-block/${id}`, {
            method: 'PUT', headers: getHeaders(),
        });
        return handleResponse(res);
    },
    getAllBlogs: async () => {
        const res = await fetch(`${API_BASE_URL}/admin/blogs`, { headers: getHeaders() });
        return handleResponse(res);
    },
    deleteAnyBlog: async (id) => {
        const res = await fetch(`${API_BASE_URL}/admin/delete-blog/${id}`, {
            method: 'DELETE', headers: getHeaders(),
        });
        return handleResponse(res);
    },
};
