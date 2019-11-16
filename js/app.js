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
}
