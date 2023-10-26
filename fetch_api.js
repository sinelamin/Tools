'use strict';

// Простой конвертор RUB в USD перпеделанный на fetch
const inputRub = document.querySelector('.item-rub'),
      inputUsd = document.querySelector('.item-usd');


if (inputRub) {
  inputRub.addEventListener('input', () => {
    fetch('./data-currency.json')
      .then(response => {
        if (!response.ok) { // так как fetch не в качестве ошибки распознает только неполадки с сетью, то мы в ручную прописываем ошибку
          throw new Error(`Could not fetch ./data-currency.json, status: ${response.status}`);
        }
        return response.text();
      })
      .then(result => {
        const data = JSON.parse(result);
        inputUsd.value = (+inputRub.value / data.current.usd).toFixed(2);
      })
      .catch((e) => {
        console.error(e); // выводим в консоль нашу рукатворную ошибку
        inputUsd.value = 'Что-то пошло не так!';
      });
  });
}


// Отправка данных формы на сервер (formDate и JSON) реализованный на fetch
const forms = document.querySelectorAll('.form');

const message = {
  load: 'Загрузка',
  success: "Спасибо, мы скоро с Вами свяжемся!",
  failure: 'Что-то пошло не так, порпобуйте чуть позже'
};

forms.forEach(form => {
  postData(form);
});

function postData(form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const body = document.querySelector('body');

    const overlay = document.createElement('div');
    const popup = document.createElement('div');

    overlay.classList.add('overlay');
    popup.classList.add('popup');

    body.prepend(overlay);
    overlay.after(popup);

    body.style.overflow = 'hidden';
    overlay.style.height = `${document.documentElement.scrollHeight}px`;
    popup.style.top = `${document.documentElement.scrollTop + (document.documentElement.clientHeight / 2)}px`;

    popup.innerHTML = `
    <p class="popup-text">${message.load}</p>
    <img class="spinner" src="./assets/054 spinner.svg" alt="">
    `;

    form.reset();

    const formData = new FormData(form);

    // Преобразование formDate в обычный объект
      const obj = {};
      formData.forEach((value, key) => {
        obj[key] = value;
      });

    fetch('http://localhost:3000/request', {
      method: 'POST',
      // body: formData, // передача данных в формате formData
      body: JSON.stringify(obj), // для передачи в JSON формате преобразуем объект
      headers: {
        'Content-type': 'application/json', // прописываем заоловки для JSON
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Could not fetch server.php, status: ${response.status}`);
      }

      return response.text();
    })
    .then(data => {
      console.log(data);
      document.querySelector('.spinner').remove();
      document.querySelector('.popup-text').textContent = message.success;
    })
    .catch((e) => {
      document.querySelector('.spinner').remove();
      document.querySelector('.popup-text').textContent = message.failure;
      console.error(e);
    })
    .finally(() => {
      setTimeout(() => {
        overlay.remove();
        popup.remove();
        body.style.overflow = '';
      }, 3000);
    });
  });
}