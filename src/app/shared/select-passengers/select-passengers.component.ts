import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-select-passengers',
  templateUrl: './select-passengers.component.html',
  styleUrl: './select-passengers.component.scss',
})
export class SelectPassengersComponent {
  constructor(
    public dialogRef: MatDialogRef<SelectPassengersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  decreaseQuantity(item: any) {
    if (item.quantity > 0) {
      item.quantity--;
    }
  }

  increaseQuantity(item: any) {
    item.quantity++;
  }

  closeDialog() {
    this.dialogRef.close(this.data.items);
  }
}
