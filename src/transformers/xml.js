import { Readable } from "stream";
import { XMLBuilder } from "fast-xml-parser";

class DataGenarator extends Readable {
  constructor(dataGenerator, { rows, ...options }) {
    super(options);
    this.dataGenerator = dataGenerator;
    this.rows = rows;
    this.builder = new XMLBuilder();
  }

  _read() {
    this.push(writeStreamInit());

    const transform = (data) => this.builder.build({ data }) + "\n";

    for (let i = 0; i < this.rows; i++) {
      let data = this.dataGenerator.create();
      this.push(transform(data));
    }

    this.push(writeStreamClose());
    this.push(null);
  }
}

function writeStreamInit(rows, offset) {
  return '<?xml version="1.0" encoding="UTF-8"?>\n<response>\n';
}

function writeStreamClose() {
  return "</data>";
}

export default DataGenarator;
