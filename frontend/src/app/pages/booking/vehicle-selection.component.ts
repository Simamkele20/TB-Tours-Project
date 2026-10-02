import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Router, ActivatedRoute } from "@angular/router";

interface Vehicle {
  id: string;
  name: string;
  description: string;
  capacity: string;
  icon: string;
  color: string;
}

@Component({
  selector: "app-vehicle-selection",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="vehicle-selection-container">
      <div class="container">
        <div class="header">
          <h1>SELECT YOUR VEHICLE</h1>
          <p class="subtitle">Choose the perfect vehicle for your Cape Town journey</p>
        </div>

        <div class="vehicles-grid">
          <div class="vehicle-card" *ngFor="let vehicle of vehicles" (click)="selectVehicle(vehicle)">
            <div class="vehicle-icon">{{ vehicle.icon }}</div>
            <h2>{{ vehicle.name }}</h2>
            <p class="vehicle-description">{{ vehicle.description }}</p>
            <div class="vehicle-capacity">
              <span class="capacity-label">Passengers:</span>
              <span class="capacity-value">{{ vehicle.capacity }}</span>
            </div>
            <button class="select-btn">SELECT</button>
          </div>
        </div>

        <div class="back-link">
          <a routerLink="/plan">← Back to Plans</a>
        </div>
      </div>
    </div>
  `,
  styleUrl: "./vehicle-selection.component.scss"
})
export class VehicleSelectionComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  vehicles: Vehicle[] = [
    {
      id: 'mercedes-vito',
      name: 'Mercedes Benz Vito Van',
      description: 'Spacious van perfect for group tours and family trips',
      capacity: 'Up to 8 passengers',
      icon: '🚐',
      color: '#1e3a5f'
    },
    {
      id: 'mercedes-c-class',
      name: 'Mercedes Benz C Class',
      description: 'Premium sedan for comfortable executive travel',
      capacity: 'Up to 4 passengers',
      icon: '🚙',
      color: '#2c5aa0'
    },
    {
      id: 'honda-ballade',
      name: 'Honda Ballade',
      description: 'Reliable and fuel-efficient for city tours',
      capacity: 'Up to 4 passengers',
      icon: '🚗',
      color: '#1f4788'
    },
    {
      id: 'hyundai-elantra',
      name: 'Hyundai Elantra',
      description: 'Comfortable compact sedan for personal tours',
      capacity: 'Up to 4 passengers',
      icon: '🚘',
      color: '#0d2f4f'
    }
  ];

  selectVehicle(vehicle: Vehicle) {
    // Get package info from query params
    const packageName = this.route.snapshot.queryParamMap.get('package');
    const packagePrice = this.route.snapshot.queryParamMap.get('price');

    // Store vehicle selection (you can use a service for this)
    sessionStorage.setItem('selectedVehicle', JSON.stringify(vehicle));
    
    // Navigate to booking page with vehicle info
    this.router.navigate(['/contact'], {
      queryParams: {
        package: packageName,
        price: packagePrice,
        vehicle: vehicle.name,
        vehicleId: vehicle.id
      }
    });
  }
}
