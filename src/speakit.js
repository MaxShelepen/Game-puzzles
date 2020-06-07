export default class SpeakIT {
  constructor() {
    this.group = 0;
    this.page = 0;
    this.recognition = null;
    this.control = null;
    this.containerApp = null;
  }

  async getWords() {
    const url = `https://afternoon-falls-25894.herokuapp.com/words?page=${this.page}&group=${this.group}`;
    const res = await fetch(url);
    const json = await res.json();
    return json;
  }

  async getTranslation() {
    const url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20200322T155651Z.de98a60e6a99185e.089aea4237b51c6db082c966f27a7895cd1e8b44&text=${this.word}&lang=en-ru`;
    const res = await fetch(url);
    const data = await res.json();
    return data.text[0];
  }

  async templateForBlockWord(object, index) {
    this.word = object.word;
    const translate = await this.getTranslation();
    const div = document.createElement('div');
    div.setAttribute('data-word', `${index}`);
    div.className = 'word';
    div.innerHTML = `<span data-sound-number=${index} class="sound-word">
    <i data-icon=${index} class="fas fa-volume-up"></i>
    <audio data-sound=${index} class="audio" src="src/${object.audio}"></audio>
    </span>
       <div data-word-descriptions=${index} class="word-descriptions">
           <p data-england-word-number=${index} class="england-word">${object.word}</p>
           <p data-transcript-word=${index} class="transcript-word">${object.transcription}</p>
           <p data-translate-number=${index} data-translate-img="src/${object.image}" class="translate-word">${translate}</p>
       </div>`;
    return div;
  }

  async getTranslationForListWords(listWords) {
    const result = await Promise.all(listWords.map(async (el, idx) => {
      const temp = await this.templateForBlockWord(el, idx);
      return temp;
    }));
    return result;
  }

  async appendForDomListWords(words) {
    this.listWords.append(...words);
    this.sectionWraper.append(this.listWords);
    SpeakIT.addWordListIntScore(this.listWords);
  }

  async createNewListWords() {
    this.resetListWords();

    const responseWords = await this.getWords();
    responseWords.length = 10;
    const words = await this.getTranslationForListWords(responseWords);
    await this.appendForDomListWords(words);
    this.addEventHandlerForAudio();
  }

  createWordTranslationBlock() {
    this.wordTranslationBlock = document.createElement('div');
    this.wordTranslationBlock.className = 'transcription-block';

    this.wordTranslationBlock.innerHTML = '<div class="wrapper-image"><img class="source-img" src="src/files/blank.jpg"></div><span class="translation-word"></span>';

    this.containerApp.append(this.wordTranslationBlock);
  }

  resetListWords() {
    const section = document.querySelector('.list-words');

    if (section) {
      section.remove();
    }

    this.listWords = document.createElement('section');
    this.listWords.className = 'list-words';


    const newUrl = this.wordTranslationBlock.querySelector('.source-img').src;
    this.wordTranslationBlock.querySelector('.source-img').src = `${newUrl.slice(0, newUrl.indexOf('src'))}src/files/blank.jpg`;
    this.wordTranslationBlock.querySelector('.translation-word').textContent = '';
  }

  getTranslationHTML(transcriptionElement) {
    const transcriptionUrlImage = transcriptionElement.attributes[1].value;
    const newUrl = this.wordTranslationBlock.querySelector('.source-img').src;

    this.wordTranslationBlock.querySelector('.source-img').src = `${newUrl.slice(0, newUrl.indexOf('src'))}${transcriptionUrlImage}`;
    this.wordTranslationBlock.querySelector('.translation-word').textContent = transcriptionElement.textContent;
  }

  addEventHandlerForAudio() {
    this.listWords.addEventListener('click', ({
      target,
    }) => {
      const index = target.attributes[0].value;

      const audio = [...document.querySelectorAll('[data-sound]')].find((el) => el.attributes[0].value === index);
      audio.play();

      const transcriptionElement = [...document.querySelectorAll('[data-translate-number]')]
        .find((el) => el.attributes[0].value === index);

      this.getTranslationHTML(transcriptionElement);
    });
  }

  highlightActiveGroupNavigation() {
    [...this.navigation.querySelectorAll('[data-number]')].forEach((el) => {
      el.classList.remove('active');
    });

    [...this.navigation.querySelectorAll('[data-number]')].find((el) => {
      el.classList.remove('active');
      return +el.attributes[0].value === +this.group;
    }).classList.add('active');
  }

  createPage() {
    this.containerApp = document.createElement('section');
    this.containerApp.className = 'wrapper';

    this.navigationBlock = document.createElement('section');
    this.navigationBlock.className = 'wrapper-navigation';

    this.navigation = document.createElement('ul');
    this.navigation.className = 'page';

    const group = Array(6).fill(null).reduce((ass, el, idx) => `${ass}<li class="item-page"><span data-number="${idx}" class="pointer">&#1010${idx + 2};</span></li>`, '');
    this.navigation.insertAdjacentHTML('afterbegin', group);

    this.resultSection = document.createElement('ul');
    this.resultSection.className = 'check-result';

    this.navigationBlock.append(this.navigation, this.resultSection);


    this.containerApp.append(this.navigationBlock);


    document.body.append(this.containerApp);
    this.addHandlerchangeGroupe();
  }

  createButtonControl() {
    this.control = document.createElement('div');
    this.control.className = 'button-wrapper';
    this.control.innerHTML = '<button class="btn restart">Restart</button><button class="btn start">Start game</button><button class="btn result">Result</button>';
    this.containerApp.append(this.control);

    this.addHandlerClickButton();
  }

  addHandlerchangeGroupe() {
    this.navigation.addEventListener('click', ({
      target,
    }) => {
      if (!target.className.includes('pointer')) {
        return;
      }

      const group = +target.attributes[0].value;

      if (+this.group === group) {
        this.page = this.page !== 29 ? this.page + 1 : 0;
      } else {
        this.page = 0;
        this.group = group;
        this.highlightActiveGroupNavigation();
      }
      this.resetDefaultSpeackWord();
      this.createNewListWords();
    });
  }

  addHandlerClickButton() {
    this.control.addEventListener('click', ({
      target,
    }) => {
      if (target.className === 'btn start') {
        this.resetDefaultSpeackWord();
        this.createRecognition();
      }
      if (target.className === 'btn result') {
        document.querySelector('.wrapper-score').classList.remove('hidden');
      }

      if (target.className === 'btn restart') {
        this.resetDefaultSpeackWord();
      }
    });
  }

  createWordSection() {
    this.sectionWraper = document.createElement('div');
    this.sectionWraper.className = 'section-word-wrapper';
    this.containerApp.append(this.sectionWraper);
  }

  createRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.start();

      this.recognition.onstart = () => {
        console.log('Voice recognition started. Try speaking into the microphone.');
      };
      this.wordTranslationBlock.querySelector('.translation-word').classList.add('speack-active');

      this.recognition.onresult = (event) => {
        const word = [...event.results].pop()[0].transcript;
        this.wordTranslationBlock.querySelector('.translation-word').textContent = word;
        this.chectSpeackWord(word);
        SpeakIT.addWordListIntScore(this.listWords);
      };
    } else {
      console.log('Speech recognition not supported 😢');
    }
  }

  addLike() {
    const li = document.createElement('li');
    li.className = 'star';
    li.innerHTML = '<i class="far fa-thumbs-up"></i>';
    this.resultSection.append(li);
  }

  chectSpeackWord(word) {
    [...this.listWords.querySelectorAll('.england-word')].forEach((el) => {
      const currentWord = el.textContent.toLocaleLowerCase().trim();
      if (currentWord === word.toLocaleLowerCase().trim()) {
        el.parentElement.parentElement.classList.add('win');
        this.changeImgForWord(el);
        this.addLike();
      }
    });
  }

  changeImgForWord(el) {
    const index = +el.attributes[0].value;
    const transcriptionUrlImage = [...this.listWords.querySelectorAll('[data-translate-img]')]
      .find((element) => +element.attributes[0].value === index).attributes[1].value;

    const newUrl = this.wordTranslationBlock.querySelector('.source-img').src;
    this.wordTranslationBlock.querySelector('.source-img').src = `${newUrl.slice(0, newUrl.indexOf('src'))}${transcriptionUrlImage}`;
  }

  resetDefaultSpeackWord() {
    [...this.listWords.querySelectorAll('.word')].forEach((el) => {
      el.classList.remove('win');
    });

    this.wordTranslationBlock.querySelector('.translation-word').classList.remove('speack-active');
    this.wordTranslationBlock.querySelector('.translation-word').textContent = '';

    const newUrl = this.wordTranslationBlock.querySelector('.source-img').src;
    this.wordTranslationBlock.querySelector('.source-img').src = `${newUrl.slice(0, newUrl.indexOf('src'))}src/files/blank.jpg`;

    if (this.recognition) {
      this.recognition.stop();
      this.recognition = null;
    }
  }

  addHandlerScoreMenu() {
    document.querySelector('.return').addEventListener('click', () => {
      document.querySelector('.wrapper-score').classList.add('hidden');
    });

    document.querySelector('.newGame').addEventListener('click', () => {
      this.resetDefaultSpeackWord();
      SpeakIT.addWordListIntScore(this.listWords);

      document.querySelector('.wrapper-score').classList.add('hidden');
    });
  }

  static addWordListIntScore(words) {
    const {
      win,
      dontKnow,
    } = [...words.querySelectorAll('.word')].reduce((acc, el) => {
      const winWord = `<span class="resalt-word-translate">${el.querySelector('.england-word').textContent}</span>
      <span>${el.querySelector('.transcript-word').textContent}</span>
      <span>${el.querySelector('.translate-word').textContent}</span>`;

      const div = document.createElement('div');
      div.innerHTML = winWord;

      if ([...el.classList].includes('win')) {
        acc.win.push(div);
      } else {
        acc.dontKnow.push(div);
      }

      return acc;
    }, {
      win: [],
      dontKnow: [],
    });

    const dntKnowElement = document.querySelector('.dntKnow');
    const knowElement = document.querySelector('.know');
    const resultKnow = document.createElement('div');
    resultKnow.className = 'score-result-know';
    const tamplateScoreKnow = `<p>Know : </p><div class = 'score-result correctly'><span>${win.length}</span></div>`;
    resultKnow.innerHTML = tamplateScoreKnow;

    const resultDntknow = document.createElement('div');
    resultDntknow.className = 'score-result-dont-know';
    const tamplateScoreDntknow = ` <p>Do not know : </p><div class = 'score-result error'><span>${dontKnow.length}</span></div>`;
    resultDntknow.innerHTML = tamplateScoreDntknow;

    [...dntKnowElement.querySelectorAll('div')].forEach((el) => el.remove());
    [...knowElement.querySelectorAll('div')].forEach((el) => el.remove());

    knowElement.append(resultKnow);
    dntKnowElement.append(resultDntknow);
    dntKnowElement.append(...dontKnow);
    knowElement.append(...win);
  }

  init() {
    this.createPage();
    this.createWordTranslationBlock();
    this.createWordSection();
    this.createButtonControl();
    this.createNewListWords();
    this.highlightActiveGroupNavigation();
    this.addHandlerScoreMenu();
  }
}
