import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// API Service
export const apiService = {
    // ============ AUTH ENDPOINTS ============
    
    // Register new user
    register: async (username, email, password) => {
        const response = await api.post('/api/auth/register', {
            username,
            email,
            password
        });
        return response.data;
    },

    // Login user
    login: async (email, password) => {
        const response = await api.post('/api/auth/login', {
            email,
            password
        });
        return response.data;
    },

    // Get current user
    getCurrentUser: async (token) => {
        const response = await api.get('/api/auth/me', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    // Logout user
    logout: async () => {
        const response = await api.post('/api/auth/logout');
        return response.data;
    },

    // ============ CONVERSION HISTORY ENDPOINTS ============

    // Save conversion
    saveConversion: async (conversionData) => {
        const response = await api.post('/api/conversions/save', conversionData);
        return response.data;
    },

    // Get conversion history
    getConversionHistory: async (limit = 50, offset = 0) => {
        const response = await api.get(`/api/conversions/history?limit=${limit}&offset=${offset}`);
        return response.data;
    },

    // Get single conversion
    getConversion: async (conversionId) => {
        const response = await api.get(`/api/conversions/${conversionId}`);
        return response.data;
    },

    // Delete conversion
    deleteConversion: async (conversionId) => {
        const response = await api.delete(`/api/conversions/${conversionId}`);
        return response.data;
    },

    // ============ EXISTING ENDPOINTS ============

    // Get supported dialects
    getDialects: async () => {
        console.log('API: Fetching dialects...');
        const response = await api.get('/api/dialects');
        console.log('API: Dialects response:', response.data);
        return response.data.dialects;
    },

    // Get supported formats
    getFormats: async () => {
        console.log('API: Fetching formats...');
        const response = await api.get('/api/formats');
        console.log('API: Formats response:', response.data);
        return response.data.formats;
    },

    // Parse uploaded file
    parseFile: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/api/parse-file', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Parse manual SQL input
    parseSQL: async (sqlText) => {
        console.log('API: Parsing SQL...', sqlText.substring(0, 50));
        const response = await api.post('/api/parse-sql', {
            sql_text: sqlText,
        });
        console.log('API: Parse SQL response:', response.data);
        return response.data;
    },

    // Convert SQL statements
    convertSQL: async (statements, sourceDialect, targetDialect) => {
        const response = await api.post('/api/convert', {
            statements,
            source_dialect: sourceDialect,
            target_dialect: targetDialect,
        });
        return response.data;
    },

    // Export results
    exportResults: async (results, sourceDialect, targetDialect, format) => {
        const response = await api.post('/api/export', {
            results,
            source_dialect: sourceDialect,
            target_dialect: targetDialect,
            format,
        }, {
            responseType: 'blob',
        });

        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;

        // Determine filename based on format
        const extensions = {
            'PDF': '.pdf',
            'Word Document': '.docx',
            'Excel': '.xlsx',
            'SQL File': '.sql',
        };

        link.setAttribute('download', `converted_sql${extensions[format] || '.txt'}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    },

    // Validate API key
    validateAPIKey: async (apiKey) => {
        const formData = new FormData();
        formData.append('api_key', apiKey);

        const response = await api.post('/api/validate-key', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};

export default api;
