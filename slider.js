'use strict';

console.log(document.URL); //*

// Класс для создания экземпляров карточки
class Card {
  constructor(img, title, descr, parent) {
    this.img = img;
    this.title = title;
    this.descr = descr;
    this.parent = parent;
  }

  render() {
    const card = document.createElement('div');

    card.classList.add('slider-item');
    card.innerHTML = `
          <img class="slider-item__img" src=${this.img} alt="slider-img">
          <h3 class="slider-item__title">${this.title}</h3>
          <p class="slider-item__descr">${this.descr}</p>
      `;

    this.parent.append(card);
  }
}
//-------------------------------------------

const getCards = async (url) => {
  const response = await fetch(url);

  return await response.json();
};

const setCardsWidth = (cards, htmlWidth, sliderWrapperWidth, marginCard) => {
  cards.forEach(card => {
    if (htmlWidth > 880) {
      card.style.minWidth = `${Math.floor((sliderWrapperWidth / 3) - marginCard)}px`;
    }

    if (htmlWidth > 600 && htmlWidth < 881) {
      card.style.minWidth = `${Math.floor((sliderWrapperWidth / 2) - marginCard)}px`;
    }

    if (htmlWidth > 300 && htmlWidth < 601) {
      card.style.minWidth = `${Math.floor((sliderWrapperWidth / 1) - marginCard)}px`;
    }
  });
};

const getMarginCard = (cards) => {
  const marginCss = getComputedStyle(cards[0]).getPropertyValue('margin'); //*
  const indexSpace = marginCss.indexOf(' ');
  const margin = +marginCss.slice(indexSpace, -2) * 2;

  // console.log('card margin: ', margin);
  return margin;
};

const addSlider = async () => {
  const sliderWrapper = document.querySelector('.slider-wrapper');
  const sliderList = document.querySelector('.slider-list');
  const arrowleft = document.querySelector('.slider-btn__left');
  const arrowRight = document.querySelector('.slider-btn__right');

  await getCards('http://localhost:3000/cards')
    .then(data => {
      data.forEach(({ img, title, descr }) => {
        new Card(
          img,
          title,
          descr,
          sliderList
        ).render();
      });
    });

  const cards = document.querySelectorAll('.slider-item');

  console.log(cards);

  const htmlWidth = document.documentElement.offsetWidth; //*

  const numberOfCards = cards.length;
  const marginCard = getMarginCard(cards);

  const sliderWrapperWidth = sliderWrapper.offsetWidth;

  setCardsWidth(cards, htmlWidth, sliderWrapperWidth, marginCard);

  const cardWidth = cards[0].offsetWidth;
  const step = Math.floor((sliderWrapperWidth / (cardWidth + marginCard)));

  const offset = (cardWidth + marginCard) * step;
  let position = 0;
  let positionSlide = 1;

  arrowleft.setAttribute('disabled', ''); //*
  arrowleft.style.pointerEvents = 'none';

  arrowRight.addEventListener('click', () => {
    if (positionSlide < (numberOfCards / step)) {
      sliderList.style.transform = `translateX(${position -= offset}px)`;

      arrowleft.removeAttribute('disabled', ''); //*
      arrowleft.style.pointerEvents = 'auto';

      positionSlide += 1;

      if ((numberOfCards / step) != Math.floor(numberOfCards / step) && positionSlide === Math.ceil((numberOfCards / step))) {
        sliderList.style.transform = `translateX(${position + (offset - (offset * ((numberOfCards / step) - Math.floor(numberOfCards / step))))}px)`;
      }
    }


    if (positionSlide === Math.ceil((numberOfCards / step))) {
      arrowRight.setAttribute('disabled', '');
      arrowRight.style.pointerEvents = 'none';
    }
  });

  arrowleft.addEventListener('click', () => {
    if (positionSlide > 1) {
      sliderList.style.transform = `translateX(${position += offset}px)`;

      arrowRight.removeAttribute('disabled', '');
      arrowRight.style.pointerEvents = 'auto';

      positionSlide -= 1;
    }

    if (position === 0) {
      arrowleft.setAttribute('disabled', '');
      arrowleft.style.pointerEvents = 'none';
    }
  });
};

if (`${document.location.pathname}` == '/slider.html') { //*
  addSlider();
}



  // new Card(
  //   './assets/service-card-1.png',
  //   'title',
  //   'Lorem ipsum dolor sit, amet consectetur adipisicing elit.',
  //   sliderList
  // ).createCard();