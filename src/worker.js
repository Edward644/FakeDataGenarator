import { Readable } from "stream";
import threads from "worker_threads";

const workerPath = "./src/genarators/userGenerator.js";

export default class Worker extends Readable {
  #worker;

  constructor({ rows, ordered, flatten, mode, ...options }) {
    super(options);

    this.#worker = new threads.Worker(workerPath, {
      workerData: { rows, ordered, flatten, mode },
    });

    this.#worker.on("error", (err) => console.error(err));

    this.#worker.on("message", (chunk) => {
      this.push(chunk);
      if (chunk === null) {
        this.#worker.terminate();
      }
    });
  }

  _read(size) {
    this.#worker.postMessage({ message: "read", size });
  }

  _destroy() {
    this.#worker.terminate();
  }
}
