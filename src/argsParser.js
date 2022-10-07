function parseArgs() {
  const _args = process.argv;
  let args = {};

  if (_args.indexOf("-h") !== -1 || _args.indexOf("--help") !== -1) {
    printHelp();
    process.exit(); // Ends program execution
  }

  args.ordered = getOrdered(_args);
  args.mode = getMode(_args) ?? "jsonl";
  args.flatten = getFlatten(_args);
  args.outputFile = getOutputFile(_args) ?? `dataGenarator.${args.mode}`;
  args.maxItems = getMaxItems(_args) || 1000;
  args.maxItemsPerDocument = getMaxItemsPerDocument(_args) || args.maxItems;
  args.maxThreads = Math.max(getMaxThreads(_args) || 1, 1);

  return args;
}

function getOrdered(args) {
  return args.indexOf("--ordered") != -1;
}

function getFlatten(args) {
  return args.indexOf("--flatten") != -1 || args.indexOf("-f") != -1;
}

function getMode(args) {
  return getValue(args, "-m") ?? getValue(args, "--mode");
}

function getOutputFile(_args) {
  return getValue(_args, "-o") ?? getValue(_args, "--output-dest");
}

function getMaxItems(_args) {
  let val = getValue(_args, "-M") ?? getValue(_args, "--max") ?? "";
  return +val.replace(/_/g, "");
}

function getMaxItemsPerDocument(args) {
  let val = getValue(args, "-p") ?? getValue(args, "--max-per-doc") ?? "";
  return +val.replace(/_/g, "");
}

function getMaxThreads(args) {
  let val = getValue(args, "--threads") ?? "";
  return +val.replace(/_/g, "");
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
\t-o, --output-dest          Output directory. Default=output/
\t-M, --max             The maximum number of rows/items across all documents. Default=1000
\t-p, --max-per-doc    The maximum number of rows/items per document. Default=Infinity
\t--ordered             Will order the data.
\t--flatten             Will flatten the data.
  `);
}

export default parseArgs;
