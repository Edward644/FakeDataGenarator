import threads from "worker_threads";
import UserGenerator from "./people/user.js";
import { EventEmitter } from "events";

if (!threads.isMainThread) {
  const ee = new EventEmitter();

  threads.parentPort.on("message", (val) => {
    if (val === "pause") paused = true;
    else if (val === "resume") {
      paused = false;
      ee.emit("resume");
    }
  });

  const userGenerator = new UserGenerator({});

  const { maxCreate = 1_000_000 } = threads.workerData ?? {};

  let paused = false;
  let count = 0;

  while (count < maxCreate) {
    if (paused) await new Promise((res) => ee.once("resume", res));
    const batchCount = Math.min(10000, maxCreate - count);
    count += batchCount;

    let batch = [];
    for (let i = 0; i < batchCount; i++) {
      batch.push(userGenerator.create());
    }

    threads.parentPort.postMessage(
      batch.map((r) => JSON.stringify(r)).join("\n") + "\n"
    );
  }

  threads.parentPort.postMessage("");
}
