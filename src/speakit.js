

export default class SpeakIT {
  constructor() {
    this.currentPage = [];
    this.wordPerPage = 10;//ипользуем переменную для разбивки массива по предложениям Раундов(10)
  }

  async levelOne() {
    const levelOne = await import('./data/book1.js');
    console.log(levelOne);
    return levelOne;
  }
  async levelTwo() {
    const levelTwo = await import('./data/book2.js');
    console.log(levelTwo);
    return levelTwo;
  }
  async levelThree() {
    const levelThree = await import('./data/book3.js');
    console.log(levelThree);
    return levelThree;
  }
  async levelFour() {
    const levelFour = await import('./data/book4.js');
    console.log(levelFour);
    return levelFour;
  }
  async levelFive() {
    const levelFive = await import('./data/book5.js');
    console.log(levelFive);
    return levelFive;
  }
  async levelSix() {
    const levelSix = await import('./data/book6.js');
    const result = await Promise.all(levelSix.map((el) => el))
    console.log(levelSix);
    return levelSix;
  }

  valueLevel() {
    this.buttonSelection = document.getElementById('select');
    this.inputLevel = document.getElementById('level');
    this.inputPage = document.getElementById('page');
    this.buttonSelection.addEventListener('click', (e) => {
      e.preventDefault();
      this.value = this.inputLevel.value;
      this.valuePage = this.inputPage.value;
      this.changeLevelWords();
    })
  }
  changeLevelWords() {
    switch (+this.value) {
      case 1:
        this.listWords(this.levelOne());
        break;
      case 2:
        this.levelTwo();
        break;
      case 3:
        this.levelThree();
        break;
      case 4:
        this.levelFour();
        break;
      case 5:
        this.levelFive();
        break;
      case 6:
        this.levelSix();
        break;
    }
  }
 async listWords(el) {
  const result = await el;
  const begin = ((this.valuePage * this.wordPerPage) - this.wordPerPage);
  const end = begin + this.wordPerPage;
  const words = result.default.slice(begin, end);
  // console.log(this.createShuffledArray(words[0].textExample));
  // let array = this.createShuffledArray(words[0].textExample));
  //  this.createPeage(words);
   this.currentPage = this.createPuzzle(words);
   this.renderPuzzle(this.currentPage[0].randomWords);
   
   console.log(this.currentPage[0].randomWords);
  // console.log(words.length)
  
}

createShuffledArray(string) {
  const array = string.split(' ');

  let currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
  
createPuzzle(arr) {
  const array = [];
  const arrayPuzzle = arr.map((el) => {
    array.push({
      audioExample: el.audioExample,
      textExample: el.textExample,
      textArray: el.textExample.split(' '),
      randomWords: this.createShuffledArray(el.textExample),
      translation: el.textExampleTranslate,
    });
  });
  return array;
}

renderPuzzle(arr) {
  const fragment = document.createDocumentFragment();
  arr.map(el => {
    const node = document.createElement('span');
    node.className = 'word__item';
    node.style.flexGrow = el.length - 1;
    node.textContent = el;
    fragment.appendChild(node);

  });
  document.querySelector('#task-line').innerHTML = '';
  document.querySelector('#task-line').appendChild(fragment);
}

  eventHandler() {
    const taskLine = document.getElementById('task-line');
    // const parentTaskLine = taskline.getBoundingClientRect().width;
    const solvedLine = document.getElementById('1-str');
    const parentWidth = solvedLine.getBoundingClientRect().width;

    taskLine.addEventListener('click', e => {
      // console.log('parentWidth', '  ' , parentWidth);
      const parentTasklineWidth = e.currentTarget.getBoundingClientRect().width;
      const targetWidth = e.target.getBoundingClientRect().width;
      console.log(targetWidth);
      const newTargetWidth = targetWidth / parentWidth * 100;
      const word = document.createElement('span');
      word.className = 'word__puzzle'
      word.style.width = `${newTargetWidth}%`;
      word.style.display = 'inline-block';
      word.textContent = e.target.textContent;
      solvedLine.appendChild(word);
      e.target.className === 'word__item' ? e.target.remove() : null;
      e.currentTarget.style.width = `${parentTasklineWidth  - targetWidth}px`;
  })
    
}


  init() {
  this.valueLevel();
   this.listWords();
   this.eventHandler();
  }
}
