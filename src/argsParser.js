function parseArgs() {
  const _args = process.argv;
  let args = {};

  if (_args.indexOf("-h") !== -1 || _args.indexOf("--help") !== -1) {
    printHelp();
    process.exit();
  }

  setOutputFile(args, _args); // Get and set output file
  setMaxGeneration(args, _args); // Get and set the number of objects to be created
  setMaxPerDoc(args, _args); // Get and set the max number of objects to be written to a single file

  let mode = getValue(_args, "-m") ?? getValue(_args, "--mode") ?? "json";
  validateArgs(args, mode); // Run validations

  return args;
}

function validateArgs(args, mode) {
  args.mode = validateMode(mode);
  args.maxObjectCount = validateNumber(args.maxObjectCount);
  args.maxObjectsPerPage = validateNumber(args.maxObjectsPerPage);
}

function setMaxPerDoc(args, _args) {
  let val = getValue(_args, "-p") ?? getValue(_args, "--max-per-page") ?? "";
  args.maxObjectsPerPage = +val.replace(/_/g, "") || args.maxObjectCount;
}

function setOutputFile(args, _args) {
  args.outputFile =
    getValue(_args, "-o") ??
    getValue(_args, "--output") ??
    `dataGenarator.${args.mode}`;
}

function setMaxGeneration(args, _args) {
  let val = getValue(_args, "-M") ?? getValue(_args, "--max") ?? "";
  args.maxObjectCount = +val.replace(/_/g, "") || 1000;
}

function validateMode(mode) {
  switch (mode) {
    case "json":
      return "json";
    case "jsonl":
      return "jsonl";
    case "csv":
      return "csv";
    case "xml":
      return "xml";
    default:
      throw new Error("Mode not valid");
  }
}

function validateNumber(value, propName) {
  if (!Number.isInteger(+value)) {
    throw new TypeError(
      `${propName} not valid: expected an integer, got ${value}`
    );
  } else {
    return +value;
  }
}

function getValue(args, arg) {
  const index = args.indexOf(arg);

  if (index != -1) {
    return args[index + 1];
  } else {
    return undefined;
  }
}

function printHelp() {
  console.log(`Fake Data Gererator 
ARGS
\t-h, --help            Print this help page
\t-m, --mode            Data type to save as. Default=json [json, csv, jsonl, xml]
\t-o, --output          Path of file to save to. Default=dataGenarator.{mode type}
\t-M, --max             The maximum number of rows/items across all documents. Default=1000
\t-p, --max-per-page    The maximum number of rows/items per document. Default=Infinity
  `);
}

export default parseArgs;
