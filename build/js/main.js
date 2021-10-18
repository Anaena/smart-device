'use strict';

const MIN_NAME_LENGTH = 1;
const TEL_LENGHT = 10;

const body = document.querySelector('body');

const popup = document.querySelector('.popup');
const closeButton = document.querySelector('.popup__close');

// Form
const callbackButton = document.querySelector('.page-header__contact-button');
const sectionQuestions = document.querySelector('.questions');
const feedbackForm = document.querySelector('.form');
const itemForm = document.querySelectorAll('.form__item');
const userNameInput = feedbackForm.querySelector('[name="username"]');
const userPhoneInput = feedbackForm.querySelector('[name="userphone"]');
const userTextarea = feedbackForm.querySelector('[name="question"]');
let storageName = "";
let storagePhone = "";
let storageQuestion = "";

// Utils
const getBodyScrollTop = () => {
  return self.pageYOffset || (document.documentElement && document.documentElement.ScrollTop) || (document.body && document.body.scrollTop);
}

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
  try{
    storageName = localStorage.getItem('userName');
    storagePhone = localStorage.getItem('userPhone');
    storageQuestion = localStorage.getItem('userQuestion');
    return true;
  } catch (err) {
    return false;
  }
}

const isStorage = storage();

userNameInput.addEventListener('input', (evt) => {
  checkNameValidity(userNameInput);
  localStorage.setItem('userName', evt.target.value);
});

userPhoneInput.addEventListener('input', (evt) => {
  checkPhoneValidity(userPhoneInput);
  localStorage.setItem('phoneNumber', evt.target.value);
});

const onFormSubmit = (evt) =>{
  if (!userNameInput.value || !userPhoneInput.value) {
    evt.preventDefault();
    userPhoneInput.parentNode.classList.add('form__item--error');
    userNameInput.parentNode.classList.add('form__item--error');
  } else {
    if (isStorage) {
      localStorage.setItem('userName', userNameInput.value);
      localStorage.setItem('phoneNumber', userPhoneInput.value);
    }
  }
}

feedbackForm.addEventListener('submit', onFormSubmit);

// Popup

const isEscEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

const onPopupEscKeydown = (evt) => {
  if (isEscEvent(evt)) {
    evt.preventDefault();
    closeModal();
  }
};

const closeModal = () => {
  popup.classList.remove('popup--show');
  body.classList.remove('page__body--locked');
  feedbackForm.reset();
  itemForm.forEach((item) => {
    item.classList.remove('form__item--error');
  });
  popup.removeEventListener('click', hideModal);
  document.removeEventListener('keydown', onPopupEscKeydown);
}

const hideModal = (evt) => {
  if (evt.target === popup) {
    closeModal();
  }
};

const openModal = () => {
  popup.classList.add('popup--show');
  body.classList.add('page__body--locked');
  popup.querySelector('[name="username"]').focus();
  document.addEventListener('click', hideModal);
  document.addEventListener('keydown', onPopupEscKeydown);
};

callbackButton.addEventListener('click', openModal);

closeButton.addEventListener('click', closeModal);

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

  if(parent.classList.contains('accordion__item--active')) {
    parent.classList.remove('accordion__item--active');
  } else {
    accordionItem.forEach((child) =>
    child.classList.remove('accordion__item--active'));
    parent.classList.toggle('accordion__item--active');
  }
  })
);
