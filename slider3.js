'use strict';

// Класс для создания экземпляров карточки
class Card {
  constructor(img, title, descr, dataAttribute, parent) {
    this.img = img;
    this.title = title;
    this.descr = descr;
    this.dataAttribute = dataAttribute;
    this.parent = parent;
  }

  render(boolean = true) {
    const card = document.createElement('div');

    card.classList.add('slider-item');

    card.setAttribute('data-id', this.dataAttribute);

    card.innerHTML = `
          <img class="slider-item__img" src=${this.img} alt="slider-img">
          <h3 class="slider-item__title">${this.title}</h3>
          <p class="slider-item__descr">${this.descr}</p>
      `;

    if (boolean) {
      this.parent.append(card);
    } else {
      this.parent.prepend(card);
    }
  }
}
//---------------------------------------------------------------------------------------

const getCards = async (url) => {
  const response = await fetch(url);

  return await response.json();
};

const setCardsWidth = (cards, sliderWrapperWidth, marginCard, step) => {
  cards.forEach(card => {
    card.style.minWidth = `${Math.floor((sliderWrapperWidth / step) - marginCard)}px`;
  });
};

const getStep = (htmlWidth) => {
  let value;
  if (htmlWidth > 880) {
    value = 3;
  }

  if (htmlWidth > 600 && htmlWidth < 881) {
    value = 2;
  }

  if (htmlWidth > 300 && htmlWidth < 601) {
    value = 1;
  }

  return value;
};

const getMarginCard = (cards) => {
  const marginCss = getComputedStyle(cards[0]).getPropertyValue('margin');
  const indexSpace = marginCss.indexOf(' ');
  const margin = +marginCss.slice(indexSpace, -2) * 2;

  return margin;
};

const deleteExtraCards = (step, cards, position) => {
  if (position == 0) { // напрвление лево
    for (let i = ((step * 3) - 1); i > ((step * 2) - 1); i -= 1) {
      cards[i].remove();
    }
  } else { // напрвление право
    for (let i = 0; i < step; i += 1) {
      cards[i].remove();
    }
  }
};

const addNewCards = async (step, sliderList, position) => {

  let arr = [];

  if (position != 0) { // напрвление право
    for (let i = step; i < (step * 2); i += 1) {
      arr.push(+document.querySelectorAll('.slider-item')[i].getAttribute('data-id'));
    }
  } else {
    for (let i = 0; i < step; i += 1) { // напрвление лево
      arr.push(+document.querySelectorAll('.slider-item')[i].getAttribute('data-id'));
    }
  }

  let newRandomArr = await getRandomArr(arr, step);

  await getCards('http://localhost:3000/cards')
    .then(data => {
      for (let i = 0; i < step; i += 1) {
        const newCard = new Card(
          data[newRandomArr[i]].img,
          data[newRandomArr[i]].title,
          data[newRandomArr[i]].descr,
          data[newRandomArr[i]].id,
          sliderList
        );

        if (position != 0) {
          newCard.render(true); // напрвление право
        } else {
          newCard.render(false); // напрвление лево
        }
      }
    });
};

const getRandomIntIgetRandomArrnclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const getRandomArr = async (arr, step) => {
  let randomArr = [];
  let randomNum;

  let numberOfCardOptions = await getCards('http://localhost:3000/cards').then(data => data.length - 1);

  while (randomArr.length < step) {
    randomNum = getRandomIntIgetRandomArrnclusive(0, numberOfCardOptions);

    if (!arr.includes(randomNum) && !randomArr.includes(randomNum)) {
      randomArr.push(randomNum);
    }
  }

  return randomArr;
};

const disableArrowBtn = (btn) => {
  btn.style.pointerEvents = 'none';
};

const enabledArrowBtn = (btn) => {
  btn.style.pointerEvents = 'auto';
};

//---------------------------------------------------------------------------------------

const addSlider = async () => {
  const sliderList = document.querySelector('.slider-list');

  const htmlWidth = document.documentElement.offsetWidth;

  const step = getStep(htmlWidth);

  await getCards('http://localhost:3000/cards')
    .then(data => {
      console.log(data[1].id);
      for (let i = 0; i < (step * 3); i += 1) {
        new Card(
          data[i].img,
          data[i].title,
          data[i].descr,
          data[i].id,
          sliderList
        ).render();
      }
    });

  const sliderWrapper = document.querySelector('.slider-wrapper');
  const arrowleft = document.querySelector('.slider-btn__left');
  const arrowRight = document.querySelector('.slider-btn__right');
  const cards = document.querySelectorAll('.slider-item');

  const marginCard = getMarginCard(cards);

  const sliderWrapperWidth = sliderWrapper.offsetWidth;

  setCardsWidth(cards, sliderWrapperWidth, marginCard, step);

  const cardWidth = cards[0].offsetWidth;
  const offset = (cardWidth + marginCard) * step;

  let position = -offset;

  sliderList.style.transition = 'none';
  sliderList.style.transform = `translateX(${position}px)`;

  async function newCards() {
    await addNewCards(step, sliderList, position);

    setCardsWidth(document.querySelectorAll('.slider-item'), sliderWrapperWidth, marginCard, step);
  }

  arrowRight.addEventListener('click', () => {
    disableArrowBtn(arrowRight);

    sliderList.style.transition = 'transform 1s';
    sliderList.style.transform = `translateX(${position -= offset}px)`;

    setTimeout(() => {
      deleteExtraCards(step, document.querySelectorAll('.slider-item'), position); // удаляем левые карточки

      newCards(); // добавляем правые карточки

      sliderList.style.transition = 'none';
      sliderList.style.transform = `translateX(${position += offset}px)`; // смещение на position == -offset

      enabledArrowBtn(arrowRight);
    }, 1000);
  });


  arrowleft.addEventListener('click', () => {
    disableArrowBtn(arrowleft);

    sliderList.style.transition = 'transform 1s';
    sliderList.style.transform = `translateX(${position += offset}px)`;

    setTimeout(async () => {
      await deleteExtraCards(step, document.querySelectorAll('.slider-item'), position); // удаляем правые карточки

      await newCards(); // добавляем левые карточки

      sliderList.style.transition = 'none';
      sliderList.style.transform = `translateX(${position -= offset}px)`; // смещение на position == 0

      enabledArrowBtn(arrowleft);
    }, 1000);
  });
};

if (`${document.location.pathname.slice(0, -5)}` == '/slider3') {
  addSlider();

  window.addEventListener('resize', () => {
    location.reload(); // обновлние страницы для динамической адаптивности слайдера
  });
}