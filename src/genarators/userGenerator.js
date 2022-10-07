import threads from "worker_threads";
import UserGenerator from "./people/user.js";
// import { EventEmitter } from "events";
import * as reader from "../transformers/index.js";

if (!threads.isMainThread) {
  const {
    rows = 100,
    ordered = false,
    flatten = false,
    mode = "jsonl",
  } = threads.workerData ?? {};

  const dataGenerator = new UserGenerator({});
  const readStream = new reader[mode](dataGenerator, { rows });

  threads.parentPort.on("message", ({ message, size }) => {
    switch (message) {
      case "read":
        const data = readStream.read(size);
        threads.parentPort.postMessage(data);
        break;
    }
  });

  console.log("Worker Started");
}
