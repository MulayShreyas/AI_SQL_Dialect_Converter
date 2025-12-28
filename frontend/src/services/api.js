import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// API Service
export const apiService = {
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
