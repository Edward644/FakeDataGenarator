import { Readable } from "stream";

class DataGenarator extends Readable {
  constructor(dataGenerator, { rows, ...options }) {
    super(options);
    this.dataGenerator = dataGenerator;
    this.rows = rows;
    this.count = 0;
  }

  _read() {
    if (this.count++ < this.rows) {
      let data = this.dataGenerator.create();
      this.push(JSON.stringify(data) + "\n");
    } else {
      this.push(null);
      this.count = 0;
    }
  }
}

export default DataGenarator;
