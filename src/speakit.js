

export default class SpeakIT {
  constructor() {
    this.group = 0;
    this.page = 0;
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
    console.log(levelSix);
    return levelSix;
  }

  valueLevel() {
    this.buttonSelection = document.getElementById('select');
    this.inputLevel = document.getElementById('level');
    this.buttonSelection.addEventListener('click', (e) => {
      e.preventDefault();
      this.value = this.inputLevel.value;
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
 listWords(el) {
  const result = el;
  console.log(result);
  return result;
}
  
  init() {
    this.valueLevel();
   this.listWords();
  }
}
