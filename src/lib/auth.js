import { apiClient } from './api';

class AuthManager {
  constructor() {
    this.listeners = [];
    this.state = {
      user: null,
      token: localStorage.getItem('auth_token'),
      isAuthenticated: false
    };
    this.initializeAuth();
  }

  async initializeAuth() {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        apiClient.setToken(token);
        const response = await apiClient.getProfile();
        this.setState({
          user: response,
          token,
          isAuthenticated: true
        });
      } catch (error) {
        // Token is invalid, clear it
        this.signOut();
      }
    }
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach(listener => listener(this.state));
  }

  subscribe(listener) {
    this.listeners.push(listener);
    // Immediately call with current state
    listener(this.state);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getState() {
    return this.state;
  }

  async signUp(email, password, fullName) {
    try {
      const response = await apiClient.register({ email, password, fullName });
      
      if (response.token) {
        apiClient.setToken(response.token);
        this.setState({
          user: response.user,
          token: response.token,
          isAuthenticated: true
        });
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  async signIn(email, password) {
    try {
      const response = await apiClient.login({ email, password });
      
      if (response.token) {
        apiClient.setToken(response.token);
        this.setState({
          user: response.user,
          token: response.token,
          isAuthenticated: true
        });
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  async signOut() {
    apiClient.setToken(null);
    this.setState({
      user: null,
      token: null,
      isAuthenticated: false
    });
  }

  async updateProfile(data) {
    try {
      const response = await apiClient.updateProfile(data);
      this.setState({
        user: response.user
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(email) {
    return apiClient.forgotPassword({ email });
  }

  async resetPassword(token, password) {
    return apiClient.resetPassword({ token, password });
  }
}

export const authManager = new AuthManager();