import { Readable } from "stream";
import { XMLBuilder } from "fast-xml-parser";

export default class DataGenarator extends Readable {
  constructor(dataGenerator, { rows, ...options }) {
    super(options);
    this.dataGenerator = dataGenerator;
    this.rows = rows;
    this.builder = new XMLBuilder();
    this.count = 0;
  }

  _read(size) {
    let chunk = "";

    while (chunk.length < size && this.count < this.rows) {
      let data = this.dataGenerator.create();
      chunk += this.builder.build({ data }) + "\n";
      this.count++;
    }

    this.push(chunk);

    if (this.count >= this.rows) this.push(null);
  }
}
