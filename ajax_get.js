'use strict'

// Простой конвертор RUB в USD
const inputRub = document.querySelector('.item-rub'),
      inputUsd = document.querySelector('.item-usd');

inputRub.addEventListener('input', () => {
  const requestCurrent = new XMLHttpRequest();

  requestCurrent.open('GET', './data-currency.json');
  requestCurrent.setRequestHeader('Content-type', 'application/json');
  requestCurrent.send();

  requestCurrent.addEventListener('load', (e) => {

    if (requestCurrent.status == 200) {
      const data = JSON.parse(requestCurrent.response);
      inputUsd.value = (+inputRub.value / data.current.usd).toFixed(2);
    } else {
      inputUsd.value = 'Что-то пошло не так!';
    }
  });
});


// Отправка данных формы на сервер (formDate и JSON)
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

    const statusMessage = document.createElement('div');
    statusMessage.classList.add('form-message');
    statusMessage.textContent = message.load;
    form.append(statusMessage);


    const requestForm = new XMLHttpRequest();
    requestForm.open('POST', 'server.php');

    // requestForm.setRequestHeader('Content-type', 'application/json'); // заголовок для JSON
    const formData = new FormData(form);

    // Преобразование formDate в обычный объект
/*     const obj = {};
    formData.forEach((value, key) => {
      obj[key] = value;
    }); */

    // const json = JSON.stringify(obj); // Преобразование нового объекта в JSON формат

    // requestForm.send(json); // отправляем новый json объект
    requestForm.send(formData);

    requestForm.addEventListener('load', () => {
      if (requestForm.status === 200) {
        console.log(requestForm.response);
        form.reset();
        statusMessage.textContent = message.success;
        setTimeout(() => {
          statusMessage.remove();
        }, 4000);
      } else {
        statusMessage.textContent = message.failure;
        setTimeout(() => {
          statusMessage.remove();
        }, 4000);
      }
    });
  });
}