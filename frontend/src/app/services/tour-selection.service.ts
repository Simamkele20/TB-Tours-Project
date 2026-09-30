import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface SelectedTour {
  id: number;
  title: string;
  description: string;
  price: number;
  duration?: string;
  highlights?: string[];
  included?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class TourSelectionService {
  private selectedTourSubject = new BehaviorSubject<SelectedTour | null>(null);
  public selectedTour$ = this.selectedTourSubject.asObservable();

  setSelectedTour(tour: SelectedTour) {
    console.log('[TOUR SELECTION] Tour selected:', tour.title);
    this.selectedTourSubject.next(tour);
  }

  getSelectedTour(): SelectedTour | null {
    return this.selectedTourSubject.value;
  }

  clearSelectedTour() {
    this.selectedTourSubject.next(null);
  }
}
