'use strict';

const MIN_NAME_LENGTH = 1;
const TEL_LENGHT = 10;
const BODY = document.querySelector('body');
const PROMOBUTTON = document.querySelector('.promo__button');
const POPUP = document.querySelector('.popup');
const CLOSEBUTTON = document.querySelector('.popup__close');
const CALLBACKBUTTON = document.querySelector('.page-header__contact-button');
const FEEDBACKFORM = document.querySelector('.form');
const USERNAMEINPUT = FEEDBACKFORM.querySelector('[name="username"]');
const USERPHONEINPUT = FEEDBACKFORM.querySelector('[name="userphone"]');
const USERTEXTAREA = FEEDBACKFORM.querySelector('[name="question"]');

let storageName = "";
let storagePhone = "";
let storageQuestion = "";

// Utils
const getBodyScrollTop = () => {
  return self.pageYOffset || (document.documentElement && document.documentElement.ScrollTop) || (document.BODY && document.BODY.scrollTop);
}

PROMOBUTTON.addEventListener('click', getBodyScrollTop);

function maskPhone(selector, masked = '+7(___)___-__-__') {
  const elems = document.querySelectorAll('.form__phone');

  function mask(event) {
    const keyCode = event.keyCode;
    const template = masked,
      def = template.replace(/\D/g, ""),
      val = this.value.replace(/\D/g, "");
    console.log(template);
    let i = 0,
      newValue = template.replace(/[_\d]/g, function (a) {
        return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
      });
    i = newValue.indexOf("_");
    if (i !== -1) {
      newValue = newValue.slice(0, i);
    }
    let reg = template.substr(0, this.value.length).replace(/_+/g,
      function (a) {
        return "\\d{1," + a.length + "}";
      }).replace(/[+()]/g, "\\$&");
    reg = new RegExp("^" + reg + "$");
    if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) {
      this.value = newValue;
    }
    if (event.type === "blur" && this.value.length < 5) {
      this.value = "";
    }
  }

  for (const elem of elems) {
    elem.addEventListener("input", mask);
    elem.addEventListener("focus", mask);
    elem.addEventListener("blur", mask);
  }
}

maskPhone();

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

const storage = () => {
  try {
    storageName = localStorage.getItem('userName');
    storagePhone = localStorage.getItem('userPhone');
    storageQuestion = localStorage.getItem('userQuestion');
    return true;
  } catch (err) {
    return false;
  }
}

const isStorage = storage();

USERNAMEINPUT.addEventListener('input', (evt) => {
  checkNameValidity(USERNAMEINPUT);
  localStorage.setItem('userName', evt.target.value);
});

USERPHONEINPUT.addEventListener('input', (evt) => {
  checkPhoneValidity(USERPHONEINPUT);
  localStorage.setItem('phoneNumber', evt.target.value);
});

const onFormSubmit = (evt) => {
  if (!USERNAMEINPUT.value || !USERPHONEINPUT.value) {
    evt.preventDefault();
    USERPHONEINPUT.parentNode.classList.add('form__item--error');
    USERNAMEINPUT.parentNode.classList.add('form__item--error');
  } else {
    if (isStorage) {
      localStorage.setItem('userName', USERNAMEINPUT.value);
      localStorage.setItem('phoneNumber', USERPHONEINPUT.value);
      localStorage.setItem('userQuestion', USERTEXTAREA.value);
    }
  }
}

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
  FEEDBACKFORM.reset();
  itemForm.forEach((item) => {
    item.classList.remove('form__item--error');
  });
  POPUP.removeEventListener('click', hideModal);
  document.removeEventListener('keydown', onPopupEscKeydown);
}

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

//Accordion

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
