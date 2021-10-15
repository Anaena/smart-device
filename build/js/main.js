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
