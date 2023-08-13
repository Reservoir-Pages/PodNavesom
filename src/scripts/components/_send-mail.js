import { disableScroll } from "../functions/_scroll_disable";
import { enableScroll } from "../functions/_scroll_enable";

// Send mail
const form = document.querySelector('.form');
const inputs = document.querySelectorAll('.form__input');
const modalOverlay = document.querySelector('.modal__overlay');

function sendMail() {
  let formData = new FormData(form);
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        modalOverlay.classList.add('modal__overlay--visible');
        setTimeout(() => {
          modalOverlay.classList.remove('modal__overlay--visible');
        },1000);
      };
    };
  };
  xhr.open('POST', '../mail.php', true);
  xhr.send(formData);
  form.reset();
};

if(form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let validatesArray = [];

    inputs.forEach((input, i) => {
      if(input.style.borderColor === 'green') {
        validatesArray[i] = true;
      };
    });

    if(validatesArray.length === 3) {
      sendMail();
      inputs.forEach(input => {
        input.style.borderColor = 'transparent';
      });
    } else {
      console.log('unsended');
    };

    modalOverlay.classList.add('modal__overlay--visible');
    disableScroll();
    setTimeout(() => {
      modalOverlay.classList.remove('modal__overlay--visible');
      enableScroll();
    },1000);
  });
};
