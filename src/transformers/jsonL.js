import { Readable } from "stream";

class DataGenarator extends Readable {
  constructor(dataGenerator, { rows, ...options }) {
    super(options);
    this.dataGenerator = dataGenerator;
    this.rows = rows;
  }

  _read() {
    const transform = (data) => JSON.stringify(data) + "\n";

    for (let i = 0; i < this.rows; i++) {
      let data = this.dataGenerator.create();
      this.push(transform(data));
    }

    this.push(null);
  }
}

export default DataGenarator;
