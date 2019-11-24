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

  shine() {
    this.stopSound();
    this.element.classList.add('active');
    this.sound.play();
    setTimeout(() => { this.element.classList.remove('active'); }, 500);
  }

  stopSound() {
    this.sound.currentTime = 0;
    this.sound.pause();
  }
}

class Game {
  constructor(buttons) {
    this.buttons = buttons;
    this.sequence = new Sequence(Object.keys(this.buttons).length);
    this.playerTurn = false;
    this.playerSequence = [];

    for (const key in this.buttons) {
      this.buttons[key].element.addEventListener('click', () => {
        this.buttons[key].shine();
        this.addToPlayerSequence(key);
      });
    }
  }

  playSequence() {
    const actualSequence = this.sequence.generate();
    actualSequence.forEach((e, i) => {
      setTimeout(() => {
        this.buttons[e].shine();
        if (i === actualSequence.length - 1) { console.log('Callback'); this.userTurn(); } // Callback sent when the sequence has been played
      }, i * 1000);
    });
  }

  addToPlayerSequence(button) {
    if (!this.playerTurn) return;
    this.playerSequence.push(parseInt(button));
    const match = this.sequence.match(this.playerSequence);
    if (!match) {
      console.error('Game over!');
      return;
    }

    if (this.playerSequence.length === this.sequence.length()) {
      this.playerTurn = false;
      setTimeout(() => { this.playSequence(); }, 1000);
    }
    console.log(match);
  }

  userTurn() {
    this.playerSequence = [];
    this.playerTurn = true;
  }
}

const $red = new Button('red', 'audio/do.mp3');
const $blue = new Button('blue', 'audio/re.mp3');
const $green = new Button('green', 'audio/mi.mp3');
const $yellow = new Button('yellow', 'audio/fa.mp3');

const buttons = {
  1: $red, 2: $blue, 3: $green, 4: $yellow,
};

const game = new Game(buttons);
