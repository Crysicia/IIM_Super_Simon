class Sequence {
  constructor(numberOfButtons) {
    this.sequence = [];
    this.buttons = numberOfButtons;
  }

  generateSequence() {
    const buttonNumber = Math.ceil(Math.random(1) * this.buttons);
    this.sequence.push(buttonNumber);
    return this.sequence;
  }

  matchSequence(userSequence) {
    const concatComputerSequence = this.sequence.join('');
    const concatUserSequence = userSequence.join('');

    return concatUserSequence === concatComputerSequence.slice(0, concatUserSequence.length);
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
    this.userSequence = [];
    Object.values(this.buttons).forEach((e) => {
      e.element.addEventListener('click', () => { e.shine(); });
    });
  }

  playSequence() {
    const actualSequence = this.sequence.generateSequence();
    actualSequence.forEach((e, i) => {
      setTimeout(() => {
        this.buttons[e].shine();
        if (i === actualSequence.length - 1) { console.log('END'); } // Callback sent when the sequence has been played
      }, i * 1000);
    });
  }


}

const $red = new Button('red', 'audio/do.mp3');
const $blue = new Button('blue', 'audio/re.mp3');
const $green = new Button('green', 'audio/mi.mp3');
const $yellow = new Button('yellow', 'audio/fa.mp3');

const buttons = {1: $red, 2: $blue, 3: $green, 4: $yellow};

const game = new Game(buttons);

