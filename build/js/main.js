'use strict';

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
  const phoneField = form['userphone'];
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

const userPhoneInput = document.querySelectorAll('[name="userphone"]');

const checkPhoneValidity = (evt) => {
  const target = evt.target.closest('form');
  target.reportValidity();
  const phoneElement = target.querySelector('[type="tel"]');
  const phonePattern = /\+7\(\d{3}\)\d{3}-\d\d-\d\d/;
  const phoneParentElement = target.querySelector('.form__item--phone');
  if (!phonePattern.test(phoneElement.value)) {
    evt.preventDefault();
    phoneElement.setCustomValidity('Неправильный формат номера');
    phoneParentElement.classList.add('form__item--error');
  } else {
    phoneParentElement.classList.remove('form__item--error');
    phoneElement.setCustomValidity('');
  }
  phoneElement.reportValidity();
};

userPhoneInput.forEach((item) => {
  item.addEventListener('input', checkPhoneValidity);
});

const formDataSave = (form) => {
  if (isStorage) {
    localStorage.setItem('userName', form['username'].value);
    localStorage.setItem('userPhone', form['userphone'].value);
    localStorage.setItem('userQuestion', form['question'].value);
  }
};

const onFormSubmit = (evt) => {
  const target = evt.target.closest('form');
  const phoneElement = target.querySelector('[type="tel"]');
  const nameElement = target.querySelector('[name="username"]');
  const nameParentElement = target.querySelector('.form__item--name');
  const phoneParentElement = target.querySelector('.form__item--phone');
  if (!phoneElement.value) {
    evt.preventDefault();
    phoneParentElement.classList.add('form__item--error');
  } else if (!nameElement.value) {
    evt.preventDefault();
    nameParentElement.classList.add('form__item--error');
  } else {
    nameParentElement.classList.remove('form__item--error');
    phoneParentElement.classList.remove('form__item--error');
    formDataSave(target);
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

const switchPopupElement = (evt) =>{
  const popup = evt.target.closest('.popup');
  const elements = [...popup.querySelector('form').elements];

  if (evt.key === 'Tab') {
    if (evt.shiftKey) {
      if (evt.target === elements[0]) {
        evt.preventDefault();
        CLOSEBUTTON.focus();
      }
    } else {
      if (evt.target === CLOSEBUTTON) {
        evt.preventDefault();
        elements[0].focus();
      }
    }
  }
};

POPUP.addEventListener('keydown', switchPopupElement);

CALLBACKBUTTON.addEventListener('click', openModal);

CLOSEBUTTON.addEventListener('click', closeModal);

POPUPFORM.addEventListener('submit', onFormSubmit);

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
