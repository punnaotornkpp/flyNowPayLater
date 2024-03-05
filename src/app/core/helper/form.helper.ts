import { FormControl, FormGroup, Validators } from '@angular/forms';

function setControls<T extends { [key: string]: any }>(
  data: T,
  form: FormGroup
) {
  for (const [key, value] of Object.entries(data)) {
    if (
      typeof value === 'object' &&
      value !== null &&
      !(value instanceof FormGroup)
    ) {
      continue;
    }
    const control = form.get(key);

    if (control instanceof FormGroup) {
      setControls(value, control);
    } else if (control) {
      control.setValue(value);
    }
  }
}

function setControlsArray(
  formGroup: FormGroup,
  controlNames: string[],
  data: any
): void {
  controlNames.forEach((controlName) => {
    if (formGroup.controls[controlName]) {
      formGroup.controls[controlName].setValue(data[controlName]);
    }
  });
}

export { setControls, setControlsArray };
