'use strict';

import { } from './ajax_get.js';

const inputNumber = document.querySelector('[name="tel"]');

let phoneNumber = '+7(';

inputNumber.addEventListener('input', (e) => {
  
  if (+e.data == e.data && phoneNumber.length < 14) {
    phoneNumber = `${phoneNumber}${e.data}`;
    
    if (phoneNumber.length == 6) {
      phoneNumber = `${phoneNumber})`;
    }
    
  } else if (e.inputType == 'deleteContentBackward' && phoneNumber.length > 3) {
    phoneNumber = phoneNumber.slice(0, -1);
  }
  
  inputNumber.value = phoneNumber;
});

inputNumber.addEventListener('blur', (e) => {
  if (inputNumber.value.length < 4) {
    inputNumber.value = '';
  }
});