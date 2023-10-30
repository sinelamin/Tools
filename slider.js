'use strict';

const sliderWrapper = document.querySelector('.slider-wrapper');
const sliderList = document.querySelector('.slider-list');
const cards = document.querySelectorAll('.slider-item');
const arrowleft = document.querySelector('.slider-btn__left');
const arrowRight = document.querySelector('.slider-btn__right');

const numberOfCards = 9;
const marginCard = 50;

// const sliderWrapperWidth = sliderWrapper.offsetWidth;
const sliderWrapperWidth = sliderWrapper.offsetWidth;
const cardWidth = cards[0].offsetWidth;
const listWidth = (numberOfCards * (cardWidth + marginCard));
const step = Math.floor((sliderWrapperWidth / (cardWidth + marginCard)));

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