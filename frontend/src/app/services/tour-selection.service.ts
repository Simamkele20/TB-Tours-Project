import { Injectable, signal } from '@angular/core';

export interface SelectedTour {
  id: number;
  title: string;
  description: string;
  price: number;
  highlights?: string[];
  included?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class TourSelectionService {
  private selectedTourSignal = signal<SelectedTour | null>(null);

  getSelectedTour() {
    return this.selectedTourSignal();
  }

  setSelectedTour(tour: SelectedTour) {
    this.selectedTourSignal.set(tour);
  }

  clearSelectedTour() {
    this.selectedTourSignal.set(null);
  }
}
