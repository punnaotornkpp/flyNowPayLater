import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

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

function setControl<T extends { [key: string]: any }>(
  data: T,
  form: FormGroup,
  fb: FormBuilder
) {
  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      const array = (form.get(key) as FormArray) || fb.array([]);
      value.forEach((item, index) => {
        const group = fb.group({});
        setControl(item, group, fb);
        array.push(group);
      });
      if (!form.get(key)) {
        form.setControl(key, array);
      }
    } else if (typeof value === 'object' && value !== null) {
      let group = (form.get(key) as FormGroup) || fb.group({});
      setControl(value, group, fb);
      if (!form.get(key)) {
        form.setControl(key, group);
      }
    } else {
      const control = form.get(key) || new FormControl();
      control.setValue(value);
      if (!form.get(key)) {
        form.addControl(key, control);
      }
    }
  });
}

export { setControls, setControlsArray, setControl };
