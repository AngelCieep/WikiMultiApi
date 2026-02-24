import type { Universe } from '../interfaces/universe.interface';
import type { Character } from '../interfaces/character.interface';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1').replace(/\/$/, '');

export const apiService = {
  async getUniverses(): Promise<Universe[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/universes`);
      if (!response.ok) {
        throw new Error('Error fetching universes');
      }
      const payload = await response.json();
      return Array.isArray(payload.status) ? payload.status : [];
    } catch (error) {
      console.error('Error fetching universes:', error);
      return [];
    }
  },

  async getUniverse(id: string): Promise<Universe | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/universes/${id}`);
      if (!response.ok) {
        throw new Error('Error fetching universe');
      }
      const payload = await response.json();
      return payload.status || null;
    } catch (error) {
      console.error('Error fetching universe:', error);
      return null;
    }
  },

  async getUniverseStyle(slug: string): Promise<Universe | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/universes/style/${slug}`);
      if (!response.ok) {
        throw new Error('Error fetching universe style');
      }
      const payload = await response.json();
      return payload.status || null;
    } catch (error) {
      console.error('Error fetching universe style:', error);
      return null;
    }
  },

  async getCharactersByUniverse(universeId: string): Promise<Character[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/characters/universe/${universeId}`, {
        method: 'POST'
      });
      if (!response.ok) {
        throw new Error('Error fetching characters');
      }
      const payload = await response.json();
      return Array.isArray(payload.status) ? payload.status : [];
    } catch (error) {
      console.error('Error fetching characters:', error);
      return [];
    }
  }
};
