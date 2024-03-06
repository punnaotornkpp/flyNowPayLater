import { FormGroup } from '@angular/forms';

type FormDataType = { [key: string]: any };

function setControls<T extends FormDataType>(data: T, form: FormGroup) {
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

function setControlsArray<T extends FormDataType>(
  formGroup: FormGroup,
  controlNames: string[],
  data: T
): void {
  controlNames.forEach((controlName) => {
    if (formGroup.controls[controlName]) {
      formGroup.controls[controlName].setValue(data[controlName]);
    }
  });
}

export { setControls, setControlsArray };
