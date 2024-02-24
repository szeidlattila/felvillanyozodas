class Timer {
  #innerHTML;
  #currentTime = 0;
  #timer = null;

  constructor(innerHTML, currentTime) {
    this.#innerHTML = innerHTML;
    this.#currentTime = currentTime;
  }

  get currentTime() {
    return this.#currentTime;
  }

  set currentTime(currentTime) {
    this.#currentTime = currentTime;
  }

  start() {
    this.#innerHTML = this.#currentTime
    this.#timer = setInterval(function () {
      this.#innerHTML = ++this.#currentTime
    }, 1000);
  }

  stop() {
    clearInterval(this.#timer);
  }

  reset() {
    this.#currentTime = 0;
    stop();
  }
}