import { Injectable } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { MatSpinner } from '@angular/material/progress-spinner';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private overlayRef: OverlayRef = null;

  constructor(private overlay: Overlay) {}

  public show(): void {
    if (!this.overlayRef) {
      this.overlayRef = this.overlay.create({
        hasBackdrop: true,
        backdropClass: 'dark-backdrop',
        positionStrategy: this.overlay
          .position()
          .global()
          .centerHorizontally()
          .centerVertically(),
      });

      const spinnerOverlayPortal = new ComponentPortal(MatSpinner);
      const component = this.overlayRef.attach(spinnerOverlayPortal);
    }
  }

  public hide(): void {
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef = null;
    }
  }
}
