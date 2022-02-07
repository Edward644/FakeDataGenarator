import { Readable } from "stream";

class DataGenarator extends Readable {
  constructor(dataGenerator, { rows, offset, ...options }) {
    super(options);
    this.dataGenerator = dataGenerator;
    this.rows = rows;
    this.offset = offset;
  }

  _read() {
    this.push(writeStreamInit(this.rows, this.offset));

    const transform = (data) => "    " + JSON.stringify(data);

    for (let i = 0; i < this.rows; i++) {
      let data = this.dataGenerator.create();
      this.push(transform(data));
      if (i === this.rows - 1) this.push("\n");
      else this.push(",\n");
    }

    this.push(writeStreamClose());
    this.push(null);
  }
}

function writeStreamInit(rows, offset) {
  return `{\n  \"total_rows\": ${rows},\n  \"offset\": ${offset},\n  \"rows\":[\n`;
}

function writeStreamClose() {
  return "  ]\n}";
}

export default DataGenarator;
