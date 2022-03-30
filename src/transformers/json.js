import { Readable } from "stream";

class DataGenarator extends Readable {
  constructor(dataGenerator, { rows, offset, ...options }) {
    super(options);
    this.dataGenerator = dataGenerator;
    this.rows = rows;
    this.offset = offset;
    this.count = 0;
  }

  _read() {
    if (!this.count) {
      this.push(writeStreamInit(this.rows, this.offset));
    } else if (this.count++ < this.rows) {
      let data = this.dataGenerator.create();
      this.push("    " + JSON.stringify(data));
      if (i === this.rows - 1) this.push("\n");
      else this.push(",\n");
    } else {
      this.push(writeStreamClose());
      this.push(null);
      this.count = 0
    }
  }
}

function writeStreamInit(rows, offset) {
  return `{\n  \"total_rows\": ${rows},\n  \"offset\": ${offset},\n  \"rows\":[\n`;
}

function writeStreamClose() {
  return "  ]\n}";
}

export default DataGenarator;
