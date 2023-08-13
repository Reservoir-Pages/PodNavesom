function setFieldColor(field, validate) {
  if(validate) {
    field.style.borderColor = 'green';
  } else {
    field.style.borderColor = 'red';
  }

  return validate;
};

function fieldValidate(field) {
  const rePhone = /^[+]*[()\s0-9-]+$/;
  const reEmail = /^[a-zA-Z0-9_!#&$%;+-=?^^`{}|~]+@[a-z_]+\.+[a-z]+$/;
  const reFullname = /^[А-яa-zA-Z]+[-|\s|А-яa-zA-Z]*[А-яa-zA-Z]+$/;
  let elValidate = false;

  switch(field.name) {
    case 'phone':
      elValidate = setFieldColor(field, field.value.length >= 7 && field.value.length < 20 && rePhone.test(field.value))
    break;
    case 'email':
      elValidate = setFieldColor(field, reEmail.test(field.value) && field.value.length < 50)
    break;
    default:
      elValidate = setFieldColor(field, field.value.length > 2 && field.value.length < 50 && reFullname.test(field.value))
    break;
  };

  return elValidate;
};

function formValidate(formBtn, formInput) {
  let checkResults = [];

  document.querySelectorAll(formInput).forEach((input, i) => {
    input.addEventListener('input', () => {
      checkResults[i] = fieldValidate(input);
      document.querySelector(formBtn).disabled = !(checkResults.length === 3 && !checkResults.includes(false));
    });
    input.addEventListener('paste', () => {
      fieldValidate(input);
    });
  });
};

formValidate('.form__btn', '.form__input');
