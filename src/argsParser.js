function parseArgs() {
  const _args = process.argv;
  let args = {};

  let mode = getValue(_args, "-m") ?? getValue(_args, "--mode") ?? "json";

  // Get and set output file
  args.outputFile =
  getValue(_args, "-o") ??
  getValue(_args, "--output") ??
  `dataGenarator.${args.mode}`;
  
  // Get and set the number of objects to be created
  args.maxObjectCount =
  getValue(_args, "-M") ?? getValue(_args, "--max") ?? 1000;
  
  // Get and set the max number of objects to be written to a single file
  args.maxObjectsPerPage =
    getValue(_args, "-p") ??
    getValue(_args, "__max-per-page") ??
    args.maxObjectCount;

  // Validations
  args.mode = validateMode(mode);
  args.maxObjectCount = validateNumber(args.maxObjectCount);
  args.maxObjectsPerPage = validateNumber(args.maxObjectsPerPage);

  return args;
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

export default parseArgs;
