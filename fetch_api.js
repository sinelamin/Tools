'use strict';

// Простой конвертор RUB в USD перпеделанный на fetch
const inputRub = document.querySelector('.item-rub'),
      inputUsd = document.querySelector('.item-usd');

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

    const sendMassage = document.createElement('div');
    sendMassage.classList.add('form-message');
    sendMassage.textContent = message.load;
    form.append(sendMassage);

    const formData = new FormData(form);

    // Преобразование formDate в обычный объект
    // const obj = {};
    // formData.forEach((value, key) => {
    //   obj[key] = value;
    // });

    fetch('server.php', {
      method: 'POST',
      body: formData,
      // body: JSON.stringify(obj), // для передачи в JSON формате преобразуем объект
      // headers: {
      //   'Content-type': 'application/json', // прописываем заоловки для JSON
      // }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Could not fetch server.php, status: ${response.status}`);
      }

      return response.text();
    })
    .then(data => {
      console.log(data);
      sendMassage.textContent = message.success;
    })
    .catch((e) => {
      sendMassage.textContent = message.failure;
      console.error(e);
    })
    .finally(() => {
      form.reset();
      setTimeout(() => {
        sendMassage.remove();
      }, 3000);
    });
  });
}