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
  fb: FormBuilder, // Pass the FormBuilder instance to the function
  addId = true
) {
  if (addId && !form.get('id')) {
    form.addControl('id', new FormControl('', Validators.required));
  }

  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      // Check if the current form control is a FormArray
      const array = (form.get(key) as FormArray) || fb.array([]);
      value.forEach((item, index) => {
        const group = fb.group({});
        setControl(item, group, fb, false); // Recursively set control for each group in the array
        array.push(group);
      });
      if (!form.get(key)) {
        form.setControl(key, array); // Set the FormArray to the form if it doesn't exist
      }
    } else if (typeof value === 'object' && value !== null) {
      // Handle FormGroup recursively
      let group = (form.get(key) as FormGroup) || fb.group({});
      setControl(value, group, fb, false);
      if (!form.get(key)) {
        form.setControl(key, group);
      }
    } else {
      // Handle FormControl
      const control = form.get(key) || new FormControl();
      control.setValue(value);
      if (!form.get(key)) {
        form.addControl(key, control);
      }
    }
  });
}

export { setControls, setControlsArray, setControl };
