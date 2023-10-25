'use strict';

import { } from './ajax_get_post.js';
import { } from './fetch_api.js';

const inputNumbers = document.querySelectorAll('.form-input__tel');

let phoneNumber = '+7(';

inputNumbers.forEach(input => {
  input.addEventListener('input', (e) => {
  
    if (+e.data == e.data && phoneNumber.length < 14 && e.data != ' ') {
      phoneNumber = `${phoneNumber}${e.data}`;
      
      if (phoneNumber.length == 6) {
        phoneNumber = `${phoneNumber})`;
      }
      
    } else if (e.inputType == 'deleteContentBackward' && phoneNumber.length > 3) {
      phoneNumber = phoneNumber.slice(0, -1);
    }
    
    input.value = phoneNumber;
  });

  input.addEventListener('focus', () => {
    if (input.value == '') {
      inputNumbers.forEach(input => {
        input.value = '';
        phoneNumber = '+7(';
      });
    }
  });
});