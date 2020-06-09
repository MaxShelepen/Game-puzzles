

export default class SpeakIT {
  constructor() {
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
  console.log(this.createShuffledArray(words[0].textExample));
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
  
  init() {
  this.valueLevel();
   this.listWords();
  }
}
