'use strict'

// Простой конвертор RUB в USD
const inputRub = document.querySelector('.item-rub'),
      inputUsd = document.querySelector('.item-usd');

inputRub.addEventListener('input', () => {
  const request = new XMLHttpRequest();

  request.open('GET', './data-currency.json');
  request.setRequestHeader('Content-type', 'application/json');
  request.send();

  request.addEventListener('load', () => {

    if (request.status == 200) {
      const data = JSON.parse(request.response);
      inputUsd.value = (+inputRub.value / data.current.usd).toFixed(2);
    } else {
      inputUsd.value = 'Что-то пошло не так!';
    }
  });
});