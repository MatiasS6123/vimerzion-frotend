import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeleccionService {

  private readonly STORAGE_KEY = 'userSelection';
  private selectionSubject = new BehaviorSubject<string>(this.getStoredSelection());

  constructor() { }

  private getStoredSelection(): string {
    return localStorage.getItem(this.STORAGE_KEY) || '';
  }

  setSelection(selection: string): void {
    localStorage.setItem(this.STORAGE_KEY, selection);
    this.selectionSubject.next(selection);
  }

  getSelection() {
    return this.selectionSubject.asObservable();
  }

  clearSelection(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.selectionSubject.next('');
  }
}
