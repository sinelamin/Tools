'use strict';

const cardsList = document.querySelector('.cards-list');

if (cardsList) {
  const getCards = (url) => {
    fetch(url, {
      headers: {
        'Content-type': 'application/json',
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
  
      data.forEach(({img, title, descr}) => {
  
        const card = document.createElement('div');
        card.classList.add('cards-item');
        card.innerHTML = `
        <img class="cards-item__img" src="${img}" alt="service picture">
        <h5 class="cards-item__title">${title}</h5>
        <p class="cards-item__description">${descr}</p>
        `;
        cardsList.append(card);
      });
    });
  };
  
  getCards('http://localhost:3000/cards');
}
