import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { environment } from "../../environments/environment";

export interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  message: string;
}

@Injectable({ providedIn: "root" })
export class BookingApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiBaseUrl;

  sendContactMessage(payload: ContactPayload) {
    return this.http.post<{ message: string; contact: { id: string; status: string } }>(`${this.apiUrl}/contact`, payload);
  }
}
