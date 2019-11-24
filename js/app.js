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
    this.element = document.querySelector(id);
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
    this.buttons = this.elements.buttons;
    this.gameOverModal = this.elements.modals.gameOver;
    this.scoreboard = this.elements.scoreboard;
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

    this.displayTurn(this.turn);

    if (this.turn <= 8) { this.speed -= 100; }

    actualSequence.forEach((e, i) => {
      setTimeout(() => {
        this.buttons[e].shine(this.speed);
        if (i === actualSequence.length - 1) { this.userTurn(); } // Callback sent when the sequence has been played
      }, i * this.speed);
    });
  }

  addToPlayerSequence(button) {
    this.playerSequence.push(parseInt(button));

    this.displayStreak(this.playerSequence.length);

    if (!this.sequence.match(this.playerSequence)) { this.over(); return; }
    if (this.playerSequence.length === this.sequence.length()) {
      this.playerTurn = false;
      this.scoreboard.whoseturn.innerHTML = "Simon's turn!";
      this.displayStreak(0);
      setTimeout(() => { this.nextTurn(); }, 1200);
    }
  }

  displayTurn(turn) {
    this.scoreboard.turns.forEach((e) => { e.innerHTML = turn; });
  }

  displayStreak(streak) {
    this.scoreboard.streaks.forEach((e) => { e.innerHTML = streak; });
  }

  userTurn() {
    this.playerSequence = [];
    this.playerTurn = true;
    this.scoreboard.whoseturn.innerHTML = 'Your turn!';
  }

  over() {
    this.playerTurn = false;
    this.gameOverModal.show();
  }

  reset() {
    this.displayTurn(0);
    this.displayStreak(0);
    this.build();
  }
}

class Modal {
  constructor(id, open, close) {
    this.window = document.querySelector(id);
    this.close = document.querySelector(`${id} ${close}`);
    this.close.addEventListener('click', () => {
      this.hide();
    });

    // Open is an optionnal parameter
    if (open) {
      this.open = document.querySelector(open);
      this.open.addEventListener('click', () => {
        this.show();
      });
    }
  }

  show() {
    this.window.style = 'display: block';
  }

  hide() {
    this.window.style = '';
  }
}


// Init game

// Buttons
const red = new Button('#red', 'audio/do.mp3');
const blue = new Button('#blue', 'audio/re.mp3');
const green = new Button('#green', 'audio/mi.mp3');
const yellow = new Button('#yellow', 'audio/fa.mp3');

const buttons = {
  1: red, 2: blue, 3: green, 4: yellow,
};

// Display
const $turnDisplays = document.querySelectorAll('#turn-display');
const $whoseTurnDisplay = document.querySelector('#whoseturn');
const $streakDisplays = document.querySelectorAll('#streak-display');

const scoreboard = {
  turns: $turnDisplays, streaks: $streakDisplays, whoseturn: $whoseTurnDisplay,
};

// Modals
const gameOverModal = new Modal('#gameover', '', '.close');
new Modal('#rules', '#infos', '.close');

const modals = {
  gameOver: gameOverModal,
};


const domElements = {
  buttons, scoreboard, modals,
};

const game = new Game(domElements);
game.nextTurn();
