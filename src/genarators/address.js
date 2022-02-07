import streets from "../../randomData/streets.js";
import towns from "../../randomData/towns.js";
const alpahbet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

class AddressGenarator {
  create() {
    let town = randomFromArray(towns);
    let street = randomFromArray(streets);

    return {
      buildingNumber: Math.trunc(Math.random() * 160),
      street: street.street,
      town: town.name,
      county: town.county,
      postcode: getPostCode(street.district),
    };
  }
}

function getPostCode(p) {
  return `${p} ${Math.trunc(Math.random() * 10)}${randomFromArray(
    alpahbet
  )}${randomFromArray(alpahbet)}`;
}

function randomFromArray(array) {
  return array[Math.trunc(Math.random() * array.length)];
}

export default AddressGenarator;
