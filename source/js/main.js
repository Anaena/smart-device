'use strict';

const MIN_NAME_LENGTH = 1;
const BODY = document.querySelector('body');
const PROMOBUTTON = document.querySelector('.promo__button');
const POPUP = document.querySelector('.popup');
const CLOSEBUTTON = document.querySelector('.popup__close');
const CALLBACKBUTTON = document.querySelector('.page-header__contact-button');
const FEEDBACKFORM = document.querySelector('.form');
const POPUPFORM = POPUP.querySelector('.form');

// Utils
const getBodyScrollTop = () => {
  return self.pageYOffset || (document.documentElement && document.documentElement.ScrollTop) || (document.BODY && document.BODY.scrollTop);
};

PROMOBUTTON.addEventListener('click', getBodyScrollTop);

// Form

const checkNameValidity = (nameElement) => {
  const inputElement = nameElement.parentNode;
  const valueLength = nameElement.value.length;

  if (valueLength < MIN_NAME_LENGTH) {
    inputElement.classList.add('form__item--error');
  } else {
    inputElement.classList.remove('form__item--error');
  }
};

const checkPhoneValidity = (phoneElement) => {
  const inputElement = phoneElement.parentNode;

  if (phoneElement.validity.patternMismatch) {
    inputElement.classList.add('form__item--error');
  } else {
    inputElement.classList.remove('form__item--error');
  }
};

let storageName = '';
let storagePhone = '';
let storageQuestion = '';

const storage = () => {
  try {
    storageName = localStorage.getItem('userName');
    storagePhone = localStorage.getItem('userPhone');
    storageQuestion = localStorage.getItem('userQuestion');
    return true;
  } catch (err) {
    return false;
  }
};

const isStorage = storage();

const fillForm = (form) => {
  storage();
  const nameField = form['username'];
  const phoneField = form['user-phone'];
  const textariaField = form['question'];
  if (storageName) {
    nameField.value = storageName;
  }
  if (storagePhone) {
    phoneField.value = storagePhone;
  }
  if (storageQuestion) {
    textariaField.value = storageQuestion;
  }
};

fillForm(POPUPFORM);
fillForm(FEEDBACKFORM);

const userNameInput = document.querySelectorAll('[name="username"]');
const userPhoneInput = document.querySelectorAll('[name="userphone"]');
const userTextaria = document.querySelectorAll('[name="question"]');

userNameInput.forEach((item) => {
  item.addEventListener('input', (evt) => {
    checkNameValidity(item);
    localStorage.setItem('userName', evt.target.value);
  });
});

userPhoneInput.forEach((item) => {
  item.addEventListener('input', (evt) => {
    checkPhoneValidity(item);
    localStorage.setItem('phoneNumber', evt.target.value);
  });
});

const onFormSubmit = (evt) => {
  if (!userNameInput.value || !userPhoneInput.value) {
    evt.preventDefault();
    userPhoneInput.parentNode.classList.add('form__item--error');
    userNameInput.parentNode.classList.add('form__item--error');
  } else {
    if (isStorage) {
      localStorage.setItem('userName', userNameInput.value);
      localStorage.setItem('phoneNumber', userPhoneInput.value);
      localStorage.setItem('userQuestion', userTextaria.value);
    }
  }
};

FEEDBACKFORM.addEventListener('submit', onFormSubmit);

// Popup

const isEscEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';
const itemForm = document.querySelectorAll('.form__item');

const onPopupEscKeydown = (evt) => {
  if (isEscEvent(evt)) {
    evt.preventDefault();
    closeModal();
  }
};

const closeModal = () => {
  POPUP.classList.remove('popup--show');
  BODY.classList.remove('page__body--locked');
  POPUPFORM.reset();
  itemForm.forEach((item) => {
    item.classList.remove('form__item--error');
  });
  POPUP.removeEventListener('click', hideModal);
  document.removeEventListener('keydown', onPopupEscKeydown);
};

const hideModal = (evt) => {
  if (evt.target === POPUP) {
    closeModal();
  }
};

const openModal = () => {
  POPUP.classList.add('popup--show');
  BODY.classList.add('page__body--locked');
  POPUP.querySelector('[name="username"]').focus();
  document.addEventListener('click', hideModal);
  document.addEventListener('keydown', onPopupEscKeydown);
};

CALLBACKBUTTON.addEventListener('click', openModal);

CLOSEBUTTON.addEventListener('click', closeModal);

// Accordion

const pageFooter = document.querySelector('.page-footer');
const accordion = document.querySelector('.accordion');
const accordionTitle = document.querySelectorAll('.accordion__title');
const accordionItem = document.querySelectorAll('.accordion__item');

pageFooter.classList.remove('page-footer--nojs');
accordion.classList.remove('accordion--nojs');

accordionTitle.forEach((item) =>
  item.addEventListener('click', () => {
    const parent = item.parentNode;

    if (parent.classList.contains('accordion__item--active')) {
      parent.classList.remove('accordion__item--active');
    } else {
      accordionItem.forEach((child) =>
        child.classList.remove('accordion__item--active'));
      parent.classList.toggle('accordion__item--active');
    }
  })
);
