import { FormControl, FormGroup, Validators } from '@angular/forms';

function setControls<T extends { [key: string]: any }>(
  data: T,
  form: FormGroup,
  addId = true
) {
  if (addId) {
    form.addControl('id', new FormControl('', Validators.required));
  }
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
      setControls(value, control, false);
    } else if (control) {
      control.setValue(value);
    }
  }
}

export { setControls };
