const container = document.getElementById('Sortanim');
const button = document.getElementById('Button');
const input = document.getElementById('Input');
const status = document.getElementById('Status');

let numbers = [4, 3, 2, 1];
const boxes = [];
const duration = 700;

function clearContainer() {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  boxes.length = 0;
}

// genterate boxes
function genterateBoxes() {
  clearContainer();
  numbers.forEach((n) => {
    const box = document.createElement('div');
    box.classList.add('box');
    box.textContent = n;
    container.append(box);
    boxes.push(box);
  });
  return Promise.resolve(null);
}

function animDone(d) {
  return new Promise(resolve => setTimeout(() => {
    resolve(null);
  }, d));
}

function getBoxes(i, j) {
  return [boxes[i], boxes[j]];
}

function jumpUp(i, j) {
  const [el1, el2] = getBoxes(i, j);
  el1.classList.add('jump');
  el2.classList.add('jump');
  return animDone(duration);
}

function jumpDown(i, j) {
  const [el1, el2] = getBoxes(i, j);
  el1.classList.add('down');
  el2.classList.add('down');
  return animDone(duration);
}

function swap(i, j) {
  const [el1, el2] = getBoxes(i, j);
  el1.classList.add('right');
  el2.classList.add('left');
  return animDone(duration);
}

function swapAnim(i, j, swappable) {
  return new Promise(resolve => setTimeout(() => {
    jumpUp(i, j).then(() => {
      if (swappable) {
        swap(i, j).then(() => {
          jumpDown(i, j).then(() => {
            resolve(null);
          });
        });
      } else {
        jumpDown(i, j).then(() => {
          resolve(null);
        });
      }
    });
  }, 1000));
}

function showStatus(msg) {
  status.textContent = msg;
  setTimeout(() => {
    status.textContent = '';
  }, 3000);
}

const sort = async () => {
  genterateBoxes();
  for (let k = 0; k < numbers.length - 1; k += 1) {
    for (let i = 0; i < numbers.length - 1; i += 1) {
      const j = i + 1;
      const swappable = numbers[i] > numbers[j];
      // eslint-disable-next-line
      await new Promise(resolve => swapAnim(i, j, swappable).then(() => {
        if (swappable) {
          const t = numbers[i];
          numbers[i] = numbers[j];
          numbers[j] = t;
        }
        genterateBoxes();
        resolve(null);
      }));
    }
  }
  button.removeAttribute('disabled');
  button.textContent = 'Sort';
  showStatus('Sorted!!');
};


function onClick() {
  if (button.hasAttribute('disabled')) {
    return;
  }
  let valid = true;
  numbers = input.value.split(',').map((x) => {
    const v = parseInt(x, 10);
    if (Number.isNaN(v)) valid = false;
    return v;
  });
  if (valid) {
    button.setAttribute('disabled', true);
    button.textContent = 'Sorting';
    sort();
  } else {
    showStatus('Invalid, Fill in coma saperated numbers!');
  }
}

button.addEventListener('click', onClick);
