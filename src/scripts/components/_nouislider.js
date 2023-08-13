import * as noUiSlider from 'nouislider';

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
    },
    from: function (value) {
      return parseFloat(value).toFixed(1);
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

let lengthNaves = 3, widthNaves = 2;

lengthSlider.on('change', () => {
  lengthNaves = lengthSlider.get();
  setButtonAtribute();
  setButtonValue();
  setCostCalculation();
});

widthSlider.on('change', () => {
  widthNaves = widthSlider.get();
  setButtonAtribute();
  setButtonValue();
  setCostCalculation();
});

function setButtonAtribute() {
  if (checkingZerothSliderValue()) {
    document.querySelector('.calc__result').removeAttribute('href');
  } else {
    document.querySelector('.calc__result').href = '#feedback';
  };
};

function checkingZerothSliderValue() {
  if (lengthNaves === '0.0' || widthNaves === '0.0') {
    return true;
  };
  return false;
};

function setCostCalculation() {
  const volumeCost = 6000;
  const parametersSum = lengthNaves * widthNaves * volumeCost;
  document.querySelector('.calc__result-sum').textContent = parametersSum + 'р.';
};

function setButtonValue() {
  if (checkingZerothSliderValue()) {
    document.querySelector('.calc__result-sum--text').textContent = 'Не Заказать с такими параметрами!';
  } else {
    document.querySelector('.calc__result-sum--text').textContent = 'Заказать!';
  }
}

setCostCalculation();








// import * as noUiSlider from 'nouislider';

// const lengthSlider = noUiSlider.create(document.getElementById('length-slider'), {
//   start: [3],
//   step: 0.5,
//   tooltips: true,
//   connect: [true, false],
//   range: {
//     'min': 0,
//     'max': 16,
//   },
//   pips: {
//     mode: 'values',
//     values: [0, 3, 16],
//     density: 6.25,
//   },
//   format: {
//     to: function (value) {
//       return parseFloat(value).toFixed(1);
//     },
//     from: function (value) {
//       return parseFloat(value).toFixed(1);
//     },
//   },
// });

// const widthSlider = noUiSlider.create(document.getElementById('width-slider'), {
//   start: [2],
//   step: 0.5,
//   tooltips: true,
//   connect: [true, false],
//   range: {
//     'min': 0,
//     'max': 6,
//   },
//   pips: {
//     mode: 'values',
//     values: [0, 2, 6],
//     density: 8,
//   },
//   format: {
//     to: function (value) {
//       return parseFloat(value).toFixed(1);
//     },
//     from: function (value) {
//       return parseFloat(value).toFixed(1);
//     },
//   },
// });

// lengthSlider.on('change', () => {
//   costCalculation({name: 'lengthNaves', value: lengthSlider.get()});
// });

// widthSlider.on('change', () => {
//   costCalculation({name: 'widthNaves', value: widthSlider.get()});
// });

// let lengthNaves = 3, widthNaves = 2;

// function costCalculation(argument = {}, volumeCost = 6000) {

//   if (argument.name === 'lengthNaves') lengthNaves = argument.value;
//   if (argument.name === 'widthNaves') widthNaves = argument.value;

//   const parametersSum = lengthNaves * widthNaves * volumeCost;

//   document.querySelector('.calc__result-sum').textContent = parametersSum + 'р.';

//   if (argument.value === '0.0') {
//     document.querySelector('.calc__result').removeAttribute('href')
//   } else {
//     document.querySelector('.calc__result').href = '#feedback'
//   };
// };

// costCalculation();
