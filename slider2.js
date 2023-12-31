'use strict';

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

const disableArrowBtn = (btn) => {
  btn.setAttribute('disabled', '');
  btn.style.pointerEvents = 'none';
};

const enabledArrowBtn = (btn) => {
  btn.removeAttribute('disabled', '');
  btn.style.pointerEvents = 'auto';
};

const setCardsWidth = (cards, sliderWrapperWidth, marginCard) => {
  const htmlWidth = document.documentElement.offsetWidth;

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
  const marginCss = getComputedStyle(cards[0]).getPropertyValue('margin');
  const indexSpace = marginCss.indexOf(' ');
  const margin = +marginCss.slice(indexSpace, -2) * 2;

  return margin;
};

const createProgressBar = (parent, displayedCards) => {
  for (let i = 0; i < Math.ceil(displayedCards); i += 1) {
    const progressbarPoint = document.createElement('li');
    progressbarPoint.classList.add('slider-progressbar__point');

    parent.append(progressbarPoint);
  }
};

const changeProgressBar = (positionSlide, progressbarPoint) => {
  progressbarPoint.forEach((item, index) => {
    if ((index + 1) == positionSlide) {
      item.classList.add('slider-progressbar__point--active');
    } else {
      item.classList.remove('slider-progressbar__point--active');
    }
  });
};

const addSlider = async () => {
  const sliderList = document.querySelector('.slider-list');

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

  const sliderWrapper = document.querySelector('.slider-wrapper');
  const arrowleft = document.querySelector('.slider-btn__left');
  const arrowRight = document.querySelector('.slider-btn__right');
  const cards = document.querySelectorAll('.slider-item');
  const progressbarList = document.querySelector('.slider-progressbar__list');
  // const progressbarPoint = document.querySelectorAll('.slider-progressbar__point');


  const marginCard = getMarginCard(cards);

  const sliderWrapperWidth = sliderWrapper.offsetWidth;
  setCardsWidth(cards, sliderWrapperWidth, marginCard);
  const cardWidth = cards[0].offsetWidth;

  const step = Math.floor((sliderWrapperWidth / (cardWidth + marginCard)));
  const offset = (cardWidth + marginCard) * step;

  let position = 0;
  let positionSlide = 1;

  const displayedCards = cards.length / step;

  createProgressBar(progressbarList, displayedCards);
  const progressbarPoint = document.querySelectorAll('.slider-progressbar__point');
  changeProgressBar(positionSlide, progressbarPoint);

  arrowRight.addEventListener('click', () => {
    if (positionSlide < displayedCards) {
      sliderList.style.transform = `translateX(${position -= offset}px)`;

      positionSlide += 1;


      if (displayedCards != Math.floor(displayedCards) && positionSlide === Math.ceil(displayedCards)) {
        sliderList.style.transform = `
        translateX(${position + offset * (Math.ceil(displayedCards) - displayedCards)}px)
        `;
      }
    } else {
      position = 0;
      positionSlide = 1;
      sliderList.style.transform = `translateX(${position}px)`;
    }

    changeProgressBar(positionSlide, progressbarPoint);
  });

  arrowleft.addEventListener('click', () => {
    if (positionSlide > 1) {
      sliderList.style.transform = `translateX(${position += offset}px)`;

      positionSlide -= 1;

    } else {
      positionSlide = Math.ceil(displayedCards);
      sliderList.style.transform = `translateX(-${((cardWidth + marginCard) * cards.length) - offset}px)`;
      position = -((((cardWidth + marginCard) * cards.length) - offset) + (offset * (Math.ceil(displayedCards) - displayedCards)));
    }

    changeProgressBar(positionSlide, progressbarPoint);
  });
};


if (`${document.location.pathname.slice(0, -5)}` == '/slider2') {
  addSlider();
}