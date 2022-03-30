import { Readable } from "stream";

class DataGenarator extends Readable {
  constructor(dataGenerator, { rows, ...options }) {
    super(options);
    this.dataGenerator = dataGenerator;
    this.rows = rows;
    this.count = 0;
  }

  _read() {
    if (!this.count) {
      this.push(writeStreamInit());
    } else if (this.count++ < this.rows) {
      const transform = (data) =>
        `${parseData(data.id)},${parseData(data.firstName)},${parseData(
          data.lastName
        )},${parseData(data.birthday)},${parseData(
          data.contactDetails.email
        )},${parseData(data.contactDetails.mobile)},${parseData(
          data.contactDetails.address.buildingNumber
        )},${parseData(data.contactDetails.address.street)},${parseData(
          data.contactDetails.address.town
        )},${parseData(data.contactDetails.address.county)},${parseData(
          data.contactDetails.address.postcode
        )},${parseData(data.description.eyeColor)},${parseData(
          data.description.hairColor
        )},${parseData(data.description.height)},${parseData(
          data.description.weight
        )}`;

      let data = this.dataGenerator.create();
      this.push(transform(data) + "\n");
    } else {
      this.push(null);
      this.count = 0;
    }
  }
}

function parseData(item) {
  if (item.toString().includes(",")) {
    return `"${item}"`;
  } else {
    return item;
  }
}

function writeStreamInit() {
  return "id,firstName,lastName,birthday,email,mobile,buildingNumber,street,town,county,postcode,eyeColor,hairColor,height,weight\n";
}

export default DataGenarator;
