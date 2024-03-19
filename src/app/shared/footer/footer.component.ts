import { Component, OnInit } from '@angular/core';
import { AirportService } from '../../service/airport.service';

export interface BookingLink {
  id: number;
  title: string;
  url: string;
}

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent implements OnInit {
  bookingLinks: BookingLink[] = [];
  constructor(private service: AirportService) {}

  ngOnInit(): void {
    this.service.getBookingLinks().subscribe((data) => {
      this.bookingLinks = data.bookingLinks;
    });
  }
}
