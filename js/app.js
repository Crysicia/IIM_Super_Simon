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
    this.sequence = new Sequence(this.buttons.length);
    buttons.forEach((e) => {
      e.element.addEventListener('click', () => { e.shine(); });
    });
  }

  play() {
    const actualSequence = this.sequence.generateSequence();

    actualSequence.forEach((e, i) => {
      setTimeout(() => {
        this.buttons[e - 1].shine();
        if (i === actualSequence.length - 1) { console.log('END'); }
      }, i * 1000);
    });
  }
}

const $red = new Button('red', 'audio/do.mp3');
const $blue = new Button('blue', 'audio/re.mp3');
const $green = new Button('green', 'audio/mi.mp3');
const $yellow = new Button('yellow', 'audio/fa.mp3');

const buttons = [$blue, $red, $green, $yellow];

const game = new Game(buttons);

// $blue.element.addEventListener("click", () => { $blue.shine() });
// $red.element.addEventListener("click", () => { $red.shine() });
// $green.element.addEventListener("click", () => { $green.shine() });
// $yellow.element.addEventListener("click", () => { $yellow.shine() });
