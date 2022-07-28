import threads from "worker_threads";
import { createWriteStream } from "fs";
import { promisify } from "util";

import parseArgs from "./argsParser.js";

console.time();

const {
  ordered,
  flatten,
  mode,
  outputFile,
  maxItems,
  maxItemsPerDocument,
  maxThreads,
} = parseArgs();

const writeStream = createWriteStream(outputFile);

writeStream.on("error", (err) => {
  console.error(err);
});

const a = promisify(createWorker);

const rowsPerThread = Math.floor(maxItems / maxThreads);

let workers = [];

for (let i = 1; i < maxThreads; i++) {
  workers.push(a(rowsPerThread));
}

workers.push(a(rowsPerThread + (maxItems % maxThreads)));

try {
  await Promise.all(workers);
  writeStream.end();
  await new Promise((res) => writeStream.on("close", () => res()));
} catch (e) {
  console.error(e);
  workers.forEach((w) => w.terminate());
} finally {
  console.timeEnd();
}

function createWorker(maxCreate, cb) {
  const worker = new threads.Worker("./src/genarators/userGenerator.js", {
    workerData: { maxCreate },
  });

  worker.on("message", (data) => {
    try {
      if (!data) {
        worker.terminate();
        cb();
      } else {
        let bufferFull = writeStream.write(data);
        if (bufferFull) {
          worker.postMessage("pause");
          writeStream.once("drain", () => worker.postMessage("resume"));
        }
      }
    } catch (e) {
      cb(e);
    }
  });

  worker.on("error", (err) => console.error(err));
}
