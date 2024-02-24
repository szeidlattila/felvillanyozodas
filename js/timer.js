class Timer {
  #time;
  #currentTime = 0;
  #timer = null;

  constructor(time) {
    this.#time = time;
  }

  get currentTime() {
    return this.#currentTime;
  }

  set currentTime(currentTime) {
    this.#currentTime = currentTime;
  }

  start() {
    this.#time.innerHTML = this.#currentTime;
    this.#timer = setInterval(() => this.increment(), 1000);
  }

  stop() {
    this.#currentTime = 0;
    clearInterval(this.#timer);
  }

  increment() {
    this.#time.innerHTML = ++this.#currentTime;
  }
}