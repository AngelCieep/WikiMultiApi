import type { Universe } from '../interfaces/universe.interface';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const apiService = {
  async getUniverses(): Promise<Universe[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/universe`);
      if (!response.ok) {
        throw new Error('Error fetching universes');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching universes:', error);
      return [];
    }
  },

  async getUniverse(id: string): Promise<Universe | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/universe/${id}`);
      if (!response.ok) {
        throw new Error('Error fetching universe');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching universe:', error);
      return null;
    }
  }
};
