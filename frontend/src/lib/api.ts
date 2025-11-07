import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// 创建 axios 实例
const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 请求拦截器 - 自动添加 token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器 - 处理 token 过期
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const response = await axios.post(`${API_URL}/api/auth/refresh`, {
                        refreshToken,
                    });

                    const { accessToken, refreshToken: newRefreshToken } = response.data;
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', newRefreshToken);

                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Refresh token 失效，清除本地存储并跳转到登录页
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// 认证相关 API
export const authAPI = {
    register: (data: { email: string; password: string; name: string }) =>
        api.post('/auth/register', data),

    login: (data: { email: string; password: string }) =>
        api.post('/auth/login', data),

    refreshToken: (refreshToken: string) =>
        api.post('/auth/refresh', { refreshToken }),

    getCurrentUser: () =>
        api.get('/auth/me'),
};

// 文件上传 API
export const uploadAPI = {
    uploadSingle: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/upload/single', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    uploadMultiple: (files: File[]) => {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });
        return api.post('/upload/multiple', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
};

// 视频处理 API
export const videoAPI = {
    convert: (data: any) =>
        api.post('/process/video/convert', data),

    compress: (data: any) =>
        api.post('/process/video/compress', data),

    cut: (data: any) =>
        api.post('/process/video/cut', data),

    merge: (data: any) =>
        api.post('/process/video/merge', data),

    rotate: (data: any) =>
        api.post('/process/video/rotate', data),

    extractAudio: (data: any) =>
        api.post('/process/video/extract-audio', data),

    toGif: (data: any) =>
        api.post('/process/video/to-gif', data),

    addWatermark: (data: any) =>
        api.post('/process/video/watermark', data),
};

// 图片处理 API
export const imageAPI = {
    convert: (data: any) =>
        api.post('/process/image/convert', data),

    resize: (data: any) =>
        api.post('/process/image/resize', data),
};

// 任务查询 API
export const jobAPI = {
    getStatus: (jobId: number) =>
        api.get(`/process/status/${jobId}`),

    getHistory: (page = 1, limit = 20) =>
        api.get(`/process/history?page=${page}&limit=${limit}`),

    download: async (jobId: number) => {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${API_URL}/api/process/download/${jobId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Download failed');
        }

        // 获取文件名 - 支持多种格式
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = 'processed-file';

        if (contentDisposition) {
            // 尝试匹配 filename*=UTF-8''encoded-name 格式
            let match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/);
            if (match && match[1]) {
                filename = decodeURIComponent(match[1]);
            } else {
                // 尝试匹配 filename="name" 或 filename=name 格式
                match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (match && match[1]) {
                    filename = match[1].replace(/['"]/g, '');
                    filename = decodeURIComponent(filename);
                }
            }
        }

        // 创建下载链接
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();

        // 清理
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }, 100);
    },
};

export default api;

