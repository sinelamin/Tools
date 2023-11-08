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

const changePosition = (positionSlide, paginationItem) => {
  paginationItem.textContent = positionSlide;
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
    }).catch();

  const sliderWrapper = document.querySelector('.slider-wrapper');
  const arrowleft = document.querySelector('.slider-btn__left');
  const arrowRight = document.querySelector('.slider-btn__right');
  const cards = document.querySelectorAll('.slider-item');
  const paginationItem = document.querySelector('.pagination-list__item');

  const marginCard = getMarginCard(cards);

  const sliderWrapperWidth = sliderWrapper.offsetWidth;
  setCardsWidth(cards, sliderWrapperWidth, marginCard);
  const cardWidth = cards[0].offsetWidth;

  const step = Math.floor((sliderWrapperWidth / (cardWidth + marginCard)));
  const offset = (cardWidth + marginCard) * step;

  let position = 0;
  let positionSlide = 1;

  disableArrowBtn(arrowleft);

  arrowRight.addEventListener('click', () => {
    const displayedCards = cards.length / step;

    if (positionSlide < displayedCards) {
      sliderList.style.transform = `translateX(${position -= offset}px)`;

      enabledArrowBtn(arrowleft);

      positionSlide += 1;
      changePosition(positionSlide, paginationItem);

      if (displayedCards != Math.floor(displayedCards) && positionSlide === Math.ceil(displayedCards)) {
        sliderList.style.transform = `
        translateX(${position + offset * (Math.ceil(displayedCards) - displayedCards)}px)
        `;
      }
    }


    if (positionSlide === Math.ceil(displayedCards)) {
      disableArrowBtn(arrowRight);
    }
  });

  arrowleft.addEventListener('click', () => {
    if (positionSlide > 1) {
      sliderList.style.transform = `translateX(${position += offset}px)`;

      enabledArrowBtn(arrowRight);

      positionSlide -= 1;
      changePosition(positionSlide, paginationItem);

      if (positionSlide == 1) {
        disableArrowBtn(arrowleft);
      }
    }
  });
};

if (`${document.location.pathname.slice(0, -5)}` == '/slider1') {
  addSlider();
}