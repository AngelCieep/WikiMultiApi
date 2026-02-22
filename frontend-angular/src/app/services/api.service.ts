import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UniverseCardResponse } from '../interfaces/universe-card.interface';
import { UniverseDetailResponse } from '../interfaces/universe-detail.interface';
import { CharacterCardResponse } from '../interfaces/character-card.interface';
import { CharacterDetailResponse } from '../interfaces/character-detail.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000/api/v1';

  constructor(private http: HttpClient) {}

  // ── UNIVERSOS ──────────────────────────────────────────────

  getUniverses(): Observable<UniverseCardResponse> {
    return this.http.get<UniverseCardResponse>(`${this.baseUrl}/universes`);
  }

  getUniverse(id: string): Observable<UniverseDetailResponse> {
    return this.http.get<UniverseDetailResponse>(`${this.baseUrl}/universes/${id}`);
  }

  addUniverse(universe: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/universes`, universe);
  }

  updateUniverse(id: string, universe: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/universes/${id}`, universe);
  }

  deleteUniverse(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/universes/${id}`);
  }

  // ── PERSONAJES ─────────────────────────────────────────────

  getCharacters(): Observable<CharacterCardResponse> {
    return this.http.get<CharacterCardResponse>(`${this.baseUrl}/characters/all`);
  }

  getCharacter(id: string): Observable<CharacterDetailResponse> {
    return this.http.get<CharacterDetailResponse>(`${this.baseUrl}/characters/character/${id}`);
  }

  getCharactersByUniverse(slug: string): Observable<CharacterCardResponse> {
    return this.http.post<CharacterCardResponse>(`${this.baseUrl}/characters/universe/${slug}`, {});
  }

  addCharacter(character: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/characters`, character);
  }

  addCharactersBulk(characters: any[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/characters/bulk`, characters);
  }

  updateCharacter(id: string, character: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/characters/${id}`, character);
  }

  deleteCharacter(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/characters/${id}`);
  }
}
