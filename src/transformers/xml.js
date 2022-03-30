import { Readable } from "stream";
import { XMLBuilder } from "fast-xml-parser";

class DataGenarator extends Readable {
  constructor(dataGenerator, { rows, ...options }) {
    super(options);
    this.dataGenerator = dataGenerator;
    this.rows = rows;
    this.builder = new XMLBuilder();
    this.count = 0;
  }

  _read() {
    if (!this.count) {
      this.push(writeStreamInit());
    } else if (this.count++ < this.rows) {
      const transform = (data) => this.builder.build({ data }) + "\n";

      let data = this.dataGenerator.create();
      this.push(transform(data));
    } else {
      this.push(writeStreamClose());
      this.push(null);
      this.count = 0;
    }
  }
}

function writeStreamInit(rows, offset) {
  return '<?xml version="1.0" encoding="UTF-8"?>\n<response>\n';
}

function writeStreamClose() {
  return "</response>";
}

export default DataGenarator;
