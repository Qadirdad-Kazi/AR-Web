const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export interface Model {
  _id: string;
  name: string;
  description: string;
  thumbnail: {
    secure_url: string;
  };
  glbFile?: {
    secure_url: string;
  };
  usdzFile?: {
    secure_url: string;
  };
  fileSize: number;
  viewCount: number;
  downloadCount: number;
  createdAt: string;
  tags: string[];
}

export interface ModelsResponse {
  models: Model[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export interface GetModelsParams {
  page?: number;
  limit?: number;
  search?: string;
  tags?: string;
}

// Get all models
export const getModels = async (params: GetModelsParams = {}): Promise<ModelsResponse> => {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.limit) searchParams.append('limit', params.limit.toString());
  if (params.search) searchParams.append('search', params.search);
  if (params.tags) searchParams.append('tags', params.tags);
  
  const response = await fetch(`${API_BASE_URL}/models?${searchParams}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch models');
  }
  
  return response.json();
};

// Get single model
export const getModel = async (id: string): Promise<Model> => {
  const response = await fetch(`${API_BASE_URL}/models/${id}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Model not found');
    }
    throw new Error('Failed to fetch model');
  }
  
  return response.json();
};

// Upload model
export const uploadModel = async (formData: FormData): Promise<{ message: string; model: Model }> => {
  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Upload failed');
  }
  
  return response.json();
};

// Update model
export const updateModel = async (id: string, data: Partial<Model>): Promise<Model> => {
  const response = await fetch(`${API_BASE_URL}/models/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update model');
  }
  
  return response.json();
};

// Delete model
export const deleteModel = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/models/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete model');
  }
};

// Health check
export const healthCheck = async (): Promise<{ status: string; message: string }> => {
  const response = await fetch(`${API_BASE_URL}/health`);
  
  if (!response.ok) {
    throw new Error('API health check failed');
  }
  
  return response.json();
};