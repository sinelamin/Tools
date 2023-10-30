'use strict';

import { } from './ajax_get_post.js';
import { } from './fetch_api.js';
import { } from './getCards.js';
import { } from './slider.js';

const inputNumbers = document.querySelectorAll('.form-input__tel');

let phoneNumber = '+7(';

inputNumbers.forEach(input => {
  input.addEventListener('input', (e) => {

    if (+e.data == e.data && phoneNumber.length < 14 && e.data != ' ') {
      phoneNumber = `${phoneNumber}${e.data}`;
      console.log(phoneNumber.length);
      if (phoneNumber.length == 7) {
        phoneNumber = `${phoneNumber.slice(0, -1)})${e.data}`;
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