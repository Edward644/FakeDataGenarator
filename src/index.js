import { createWriteStream } from "fs";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
dayjs.extend(relativeTime);

import parseArgs from "./argsParser.js";

import UserGenerator from "./genarators/user.js";

import JsonGenarator from "./transformers/json.js";
import JsonlGenarator from "./transformers/jsonL.js";
import CsvGenarator from "./transformers/csv.js";
import XmlGenarator from "./transformers/xml.js";

import Logger from "./logger.js";
const logger = new Logger();

async function main() {
  let startTime = dayjs();
  const args = parseArgs();

  let maxRowsTotal = args.maxObjectCount;
  let maxRowsPerDoc = args.maxObjectsPerPage;

  let docsRequired = Math.ceil(args.maxObjectCount / args.maxObjectsPerPage);

  let offset = 0;

  let writes = [];

  let fileGenarator = getFileGenerator(args.mode);

  const userGenerator = new UserGenerator();

  for (let docNumber = 0; docNumber < docsRequired; docNumber++) {
    let fileName =
      docsRequired > 1
        ? getNewFileName(args.outputFile, docNumber)
        : args.outputFile;

    let writeStream = createWriteStream(fileName);

    const rows = Math.min(maxRowsPerDoc, maxRowsTotal - offset);

    const readstream = new fileGenarator(userGenerator, { rows, offset });
    readstream.pipe(writeStream);

    writes.push(
      new Promise((res) =>
        writeStream.on("finish", () => {
          logger.log(`Created file ${fileName}`);
          res();
        })
      )
    );

    offset += maxRowsPerDoc;
  }

  await Promise.all(writes);
  console.log(`Duration: ${startTime.fromNow(true)}`);
}

function getNewFileName(original, docNumber) {
  let path = original.split("/");
  let filename = path.at(-1).split(".");
  return filename.splice(1, 0, docNumber);
}

function getFileGenerator(type) {
  switch (type) {
    case "jsonl":
      return JsonlGenarator;
    case "csv":
      return CsvGenarator;
    case "xml":
      return XmlGenarator;
    default:
      return JsonGenarator;
  }
}

main();
