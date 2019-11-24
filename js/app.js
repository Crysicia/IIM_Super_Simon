class Sequence {
  constructor(numberOfButtons) {
    this.sequence = [];
    this.buttons = numberOfButtons;
  }

  generate() {
    const buttonNumber = Math.ceil(Math.random(1) * this.buttons);
    this.sequence.push(buttonNumber);
    return this.sequence;
  }

  match(userSequence) {
    const concatComputerSequence = this.sequence.join('');
    const concatUserSequence = userSequence.join('');

    return concatUserSequence === concatComputerSequence.slice(0, concatUserSequence.length);
  }

  length() {
    return this.sequence.length;
  }
}

class Button {
  constructor(id, sound) {
    this.id = id;
    this.element = document.querySelector(`#${this.id}`);
    this.sound = new Audio(sound);
  }

  shine(speed) {
    this.stopSound();
    this.element.classList.add('active');
    this.sound.play();
    setTimeout(() => { this.element.classList.remove('active'); }, speed / 2);
  }

  stopSound() {
    this.sound.currentTime = 0;
    this.sound.pause();
  }
}

class Game {
  constructor(elements) {
    this.elements = elements;
    this.build();
  }

  build() {
    this.turn = 0;
    this.speed = 1200;
    this.buttons = this.elements['buttons'];
    this.scoreboard = this.elements['scoreboard'];
    this.sequence = new Sequence(Object.keys(this.buttons).length);
    this.playerTurn = false;
    this.playerSequence = [];

    for (const key in this.buttons) {
      this.buttons[key].element.addEventListener('click', () => {
        if (this.playerTurn) {
          this.buttons[key].shine(this.speed);
          this.addToPlayerSequence(key);
        }
      });
    }
  }

  nextTurn() {
    const actualSequence = this.sequence.generate();
    this.turn++;

    this.scoreboard['turn'].innerHTML = this.turn;

    if (this.turn <= 8) { this.speed -= 100; }

    actualSequence.forEach((e, i) => {
      setTimeout(() => {
        this.buttons[e].shine(this.speed);
        if (i === actualSequence.length - 1) { this.userTurn(); } // Callback sent when the sequence has been played
      }, i * this.speed);
    });
  }

  over() {
    this.playerTurn = false;
    console.error('Game over!');
  }

  addToPlayerSequence(button) {
    this.playerSequence.push(parseInt(button));

    this.scoreboard['streak'].innerHTML = this.playerSequence.length;

    if (!this.sequence.match(this.playerSequence)) { this.over(); return; }
    if (this.playerSequence.length === this.sequence.length()) {
      this.playerTurn = false;
      setTimeout(() => { this.nextTurn(); }, 2000);
    }
  }

  userTurn() {
    this.playerSequence = [];
    this.playerTurn = true;
  }

  reset() {
    this.scoreboard['turn'].innerHTML = 0;
    this.scoreboard['streak'].innerHTML = 0;
    this.build();
  }
}

const $red = new Button('red', 'audio/do.mp3');
const $blue = new Button('blue', 'audio/re.mp3');
const $green = new Button('green', 'audio/mi.mp3');
const $yellow = new Button('yellow', 'audio/fa.mp3');

const $turnDisplay = document.querySelector('#turn-display');
const $streakDisplay = document.querySelector('#streak-display');

const buttons = {
  1: $red, 2: $blue, 3: $green, 4: $yellow,
};

const scoreboard = {
  turn: $turnDisplay, streak: $streakDisplay,
}

const domElements = {
  buttons: buttons, scoreboard: scoreboard,
}


const game = new Game(domElements);
game.nextTurn();
