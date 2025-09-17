const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  // Auth endpoints
  async register(data) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async updateProfile(data) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async forgotPassword(data) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async resetPassword(data) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Mood endpoints
  async createMoodEntry(data) {
    return this.request('/mood', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMoodEntries(params) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request(`/mood${queryString}`);
  }

  async updateMoodEntry(id, data) {
    return this.request(`/mood/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMoodEntry(id) {
    return this.request(`/mood/${id}`, {
      method: 'DELETE',
    });
  }

  // Journal endpoints
  async createJournalEntry(data) {
    return this.request('/journal', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getJournalEntries(params) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request(`/journal${queryString}`);
  }

  async updateJournalEntry(id, data) {
    return this.request(`/journal/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteJournalEntry(id) {
    return this.request(`/journal/${id}`, {
      method: 'DELETE',
    });
  }

  // Meditation endpoints
  async createMeditationSession(data) {
    return this.request('/meditation', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMeditationSessions(params) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request(`/meditation${queryString}`);
  }

  async updateMeditationSession(id, data) {
    return this.request(`/meditation/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMeditationSession(id) {
    return this.request(`/meditation/${id}`, {
      method: 'DELETE',
    });
  }

  // Goals endpoints
  async createWellnessGoal(data) {
    return this.request('/goals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getWellnessGoals() {
    return this.request('/goals');
  }

  async updateWellnessGoal(id, data) {
    return this.request(`/goals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteWellnessGoal(id) {
    return this.request(`/goals/${id}`, {
      method: 'DELETE',
    });
  }

  // Community endpoints
  async createCommunityPost(data) {
    return this.request('/community', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCommunityPosts(params) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request(`/community${queryString}`);
  }

  async updateCommunityPost(id, data) {
    return this.request(`/community/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCommunityPost(id) {
    return this.request(`/community/${id}`, {
      method: 'DELETE',
    });
  }

  async likeCommunityPost(id) {
    return this.request(`/community/${id}/like`, {
      method: 'POST',
    });
  }

  // Crisis endpoints
  async getCrisisResources() {
    return this.request('/crisis');
  }

  // AI endpoints
  async aiChat(data) {
    return this.request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);