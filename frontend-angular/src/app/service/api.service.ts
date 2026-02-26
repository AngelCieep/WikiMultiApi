import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  UniverseCardResponse,
  UniverseDetailResponse,
  UniverseStyleResponse,
  CharacterCardResponse,
  CharacterDetailResponse
} from '../common/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://backend-wikiapi.vercel.app/api/v1';

  constructor(private http: HttpClient) {}

  // ── UNIVERSOS ──────────────────────────────────────────────

  getUniverses(page: number = 1, limit: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<any>(`${this.baseUrl}/universes`, { params });
  }

  getUniversesFiltered(page: number = 1, limit: number = 10, sortBy: string = 'createdAt', order: string = 'desc'): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sortBy', sortBy)
      .set('order', order);
    return this.http.get<any>(`${this.baseUrl}/universes/filtered`, { params });
  }

  searchUniverses(query: string, page: number = 1, limit: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.post<any>(`${this.baseUrl}/universes/search`, { query }, { params });
  }

  getUniverse(id: string): Observable<UniverseDetailResponse> {
    return this.http.get<UniverseDetailResponse>(`${this.baseUrl}/universes/${id}`);
  }

  getUniverseStyle(slug: string): Observable<UniverseStyleResponse> {
    return this.http.get<UniverseStyleResponse>(`${this.baseUrl}/universes/style/${slug}`);
  }

  addUniverse(universe: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/universes`, universe);
  }

  updateUniverse(id: string, universe: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/universes/${id}`, universe);
  }

  updatePopularityScore(id: string, popularityScore: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/universes/${id}/popularity`, { popularityScore });
  }

  deleteUniverse(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/universes/${id}`);
  }

  // ── PERSONAJES ─────────────────────────────────────────────

  getCharacters(page: number = 1, limit: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<any>(`${this.baseUrl}/characters/all`, { params });
  }

  getCharactersFiltered(page: number = 1, limit: number = 10, sortBy: string = 'createdAt', order: string = 'desc'): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sortBy', sortBy)
      .set('order', order);
    return this.http.get<any>(`${this.baseUrl}/characters/filtered`, { params });
  }

  getCharacter(universeId: string, characterId: string): Observable<CharacterDetailResponse> {
    return this.http.get<CharacterDetailResponse>(`${this.baseUrl}/characters/universe/${universeId}/character/${characterId}`);
  }

  getCharactersByUniverse(slug: string, page: number = 1, limit: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.post<any>(`${this.baseUrl}/characters/universe/${slug}`, {}, { params });
  }

  getCharactersByUniverseId(universeId: string, page: number = 1, limit: number = 100): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.post<any>(`${this.baseUrl}/characters/universe/${universeId}`, {}, { params });
  }

  addCharacter(character: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/characters`, character);
  }

  updateCharacter(id: string, character: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/characters/${id}`, character);
  }

  deleteCharacter(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/characters/${id}`);
  }
}
