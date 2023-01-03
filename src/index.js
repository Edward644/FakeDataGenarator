import { createWriteStream } from "fs";
import { Readable, PassThrough } from "stream";
import { pipeline } from "stream/promises";

import parseArgs from "./argsParser.js";
import Worker from "./worker.js";

const merge = (streams) => {
  let pass = new PassThrough();
  pass.setMaxListeners(streams.length + 2);
  let waiting = streams.length;

  pass.push('<?xml version="1.0" encoding="UTF-8"?>\n<response>\n');

  for (let stream of streams) {
    pass = stream.pipe(pass, { end: false });
    stream.once("end", () => {
      if (--waiting === 0) {
        pass.push("</response>");
        pass.emit("end");
      }
    });
  }
  return pass;
};

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

try {
  const rows = Math.floor(maxItems / maxThreads);

  let readStream = merge(
    Array.from(new Array(maxThreads)).map(
      () => new Worker({ rows, ordered, flatten, mode })
    )
  );

  await pipeline(readStream, writeStream);
} catch (e) {
  console.error(e);
} finally {
  console.timeEnd();
}
