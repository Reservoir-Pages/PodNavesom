import * as noUiSlider from 'nouislider';

// NoUiSlider
const lengthSlider = noUiSlider.create(document.getElementById('length-slider'), {
  start: [3],
  step: 0.5,
  tooltips: true,
  connect: [true, false],
  range: {
    'min': 0,
    'max': 16,
  },
  pips: {
    mode: 'values',
    values: [0, 3, 16],
    density: 6.25,
  },
  format: {
    to: function (value) {
      return parseFloat(value).toFixed(1);
      // return parseFloat(value);
    },
    from: function (value) {
      return parseFloat(value).toFixed(1);
      // return parseFloat(value);
    },
  },
});
const widthSlider = noUiSlider.create(document.getElementById('width-slider'), {
  start: [2],
  step: 0.5,
  tooltips: true,
  connect: [true, false],
  range: {
    'min': 0,
    'max': 6,
  },
  pips: {
    mode: 'values',
    values: [0, 2, 6],
    density: 8,
  },
  format: {
    to: function (value) {
      return parseFloat(value).toFixed(1);
    },
    from: function (value) {
      return parseFloat(value).toFixed(1);
    },
  },
});
let lengthNaves = 2, widthNaves = 2;
lengthSlider.on('change', () => {
  costCalculation({name: 'lengthNaves', value: lengthSlider.get()});
});
widthSlider.on('change', () => {
  costCalculation({name: 'widthNaves', value: widthSlider.get()});
});
function costCalculation(argument = {}, volumeCost = 6000) {
  if (argument.name === 'lengthNaves') lengthNaves = argument.value;
  if (argument.name === 'widthNaves') widthNaves = argument.value;
  const parametersSum = lengthNaves * widthNaves * volumeCost;

  // document.querySelector('.calc__params-sum').textContent = parametersSum;
  document.querySelector('.calc__result-sum').textContent = parametersSum + 'р.';
};
costCalculation();

// Active btn
const btns = document.querySelectorAll('.btn');
btns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    btns.forEach(btn => {
      btn.classList.remove('btn--active');
    });
    btn.classList.add('btn--active');
  });
});
