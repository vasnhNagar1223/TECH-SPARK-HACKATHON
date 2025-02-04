class DataStream {
  constructor(container, index, messages) {
    this.container = container;
    this.index = index;
    this.stream = "";
    this.chars = "░▒▓█▄▀╠╣║╔╗╚╝╬╦╩";
    this.messages = messages; // Accepts different message sets
    this.currentMessage = "";
    this.messageIndex = 0;
    this.charIndex = 0;
  }

  start() {
    this.messageInterval = setInterval(() => {
      this.updateMessage();
    }, 200);
  }

  updateMessage() {
    const message = this.messages[this.messageIndex];
    if (this.charIndex < message.length) {
      this.currentMessage += message[this.charIndex];
      this.charIndex++;
    } else {
      this.charIndex = 0;
      this.currentMessage = "";
      this.messageIndex = (this.messageIndex + 1) % this.messages.length;
    }
    this.container.textContent = this.currentMessage + this.getRandomChars(5);
  }

  getRandomChars(length) {
    return Array(length)
      .fill()
      .map(() => this.chars[Math.floor(Math.random() * this.chars.length)])
      .join("");
  }

  stop() {
    clearInterval(this.messageInterval);
  }
}

// First DataStream with original messages
document.querySelectorAll(".data-stream").forEach((container, index) => {
  const messages1 = [
    "Innovation...",
    "Feasibility...",
    "Presentation skills...",
  ];
  const dataStream1 = new DataStream(container, index, messages1);
  dataStream1.start();
});

// Second DataStream with Judging Criteria messages
document
  .querySelectorAll(".data-stream-criteria")
  .forEach((container, index) => {
    const messages2 = [
      "Judging Criteria:",
      "● Innovation and Scalability (30%)",
      "● Technical Implementation (30%)",
      "● Integration of Hardware & Software (20%)",
      "● Team Collaboration (20%)",
    ];
    const dataStream2 = new DataStream(container, index, messages2);
    dataStream2.start();
  });
