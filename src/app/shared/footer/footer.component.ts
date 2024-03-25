import { Component, OnInit } from '@angular/core';
import { AirportService } from '../../service/airport.service';

export interface IFooterDetail {
  title: string;
  url: string;
}

export interface IFooter {
  booking: IFooterDetail[];
  journeyPlanning: IFooterDetail[];
  aboutUs: IFooterDetail[];
  inFlightService: IFooterDetail[];
  nokFanClub: IFooterDetail[];
  corporateCustomer: IFooterDetail[];
  contactUs: IFooterDetail[];
  nokMobile: IFooterDetail[];
}

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent implements OnInit {
  footer!: IFooter;
  isHovering = [
    {
      img: 'assets/image/facebook-logo.webp',
      url: 'https://www.facebook.com/nokairlines',
      status: false,
    },
    {
      img: 'assets/image/twitter-logo.webp',
      url: 'https://twitter.com/nokairlines',
      status: false,
    },
    {
      img: 'assets/image/youtube-logo.webp',
      url: 'https://www.youtube.com/user/NokairlinesTV/featured?&ab_channel=NokAirlines',
      status: false,
    },
    {
      img: 'assets/image/line-logo.webp',
      url: 'https://line.me/R/ti/p/@nokair?from=page&openQrModal=true&searchId=nokair',
      status: false,
    },
  ];
  download = [
    {
      img: 'assets/image/googleplay.webp',
      url: 'https://play.google.com/store/apps/details?id=com.NokAir.app&hl=en',
    },
    {
      img: 'assets/image/appstore.webp',
      url: 'https://apps.apple.com/us/app/nok-airlines/id1597911105',
    },
    {
      img: 'assets/image/appgalleryhuawei.webp',
      url: 'https://appgallery.huawei.com/app/C105119185?channelId=web&detailType=0',
    },
  ];

  constructor(private service: AirportService) {}

  ngOnInit(): void {
    this.service.getFooter().subscribe((data) => {
      this.footer = data as IFooter;
    });
  }
}
