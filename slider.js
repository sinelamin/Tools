'use strict';

const sliderWrapper = document.querySelector('.slider-wrapper');
const sliderList = document.querySelector('.slider-list');
const cards = document.querySelectorAll('.slider-item');
const arrowleft = document.querySelector('.slider-btn__left');
const arrowRight = document.querySelector('.slider-btn__right');

const htmlWidth = document.documentElement.offsetWidth;

const numberOfCards = 9;
const marginCard = getMarginCard();

const sliderWrapperWidth = sliderWrapper.offsetWidth;

setCardsWidth();

const cardWidth = cards[0].offsetWidth;
const listWidth = (numberOfCards * (cardWidth + marginCard));
const step = Math.floor((sliderWrapperWidth / (cardWidth + marginCard)));

console.log('step: ', step);
console.log('sliderWrapperWidth: ', sliderWrapperWidth);
console.log('cardWidth + margin: ', cardWidth + marginCard);
console.log('cardWidth: ', cardWidth);

const offset = (cardWidth + marginCard) * step;
let position = 0;
let positionSlide = 1;

arrowleft.setAttribute('disabled', '');
arrowleft.style.pointerEvents = 'none';


arrowRight.addEventListener('click', () => {
  if (positionSlide < (numberOfCards / step)) {
    sliderList.style.transform = `translateX(${position -= offset}px)`;

    arrowleft.removeAttribute('disabled', '');
    arrowleft.style.pointerEvents = 'auto';

    positionSlide += 1;

    if ((numberOfCards / step) != Math.floor(numberOfCards / step) && positionSlide === Math.ceil((numberOfCards / step))) {
      sliderList.style.transform = `translateX(${position + (offset / 2)}px)`;
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

  console.log(position);
  console.log(positionSlide);
});

function setCardsWidth() {

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
}

function getMarginCard() {
  const marginCss = getComputedStyle(cards[0]).getPropertyValue('margin');
  const indexSpace = getComputedStyle(cards[0]).getPropertyValue('margin').indexOf(' ');
  const margin = +marginCss.slice(indexSpace, -2) * 2;

  console.log('card margin: ', margin);
  return margin;
}

// function getMarginCard() {
//   // const marginCss = getComputedStyle(cards[0]).getPropertyValue('margin');
//   // const indexSpace = getComputedStyle(cards[0]).getPropertyValue('margin').indexOf(' ');
//   // const margin = +marginCss.slice(indexSpace, -2) * 2;

//   const marginCss = getComputedStyle(cards[0]).getPropertyValue('min-width');
//   const marginOne = +marginCss.slice(0, -2);

//   const margin = (sliderWrapperWidth - (marginOne * step)) / (step * 2);

//   console.log('card width: ', margin);
//   return margin;
// }

// getWidthCard();

console.log(document.documentElement.offsetWidth);