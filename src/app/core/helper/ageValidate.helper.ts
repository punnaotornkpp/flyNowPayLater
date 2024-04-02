import { AbstractControl, ValidatorFn } from '@angular/forms';

function ageValidator(minAge: number, maxAge: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return null;
    }

    const today = new Date();
    const birthDate = new Date(control.value);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age >= minAge && age <= maxAge) {
      return null;
    } else {
      return {
        ageRange: {
          value: control.value,
          message: `Age must be between ${minAge} and ${maxAge + 1} years.`,
        },
      };
    }
  };
}

export { ageValidator };
