import dayjs from "dayjs";
import { v4 as uuid } from "uuid";

import { firstnames, lastnames } from "../../../randomData/names.js";

import ContactDetailsGenarator from "./contactDetails.js";
import UserDescriptionGenarator from "./description.js";

class UserGenarator {
  constructor() {
    this.contactDetailsGenarator = new ContactDetailsGenarator();
    this.userDescriptionGenarator = new UserDescriptionGenarator();
  }

  create() {
    let user = {
      id: uuid(),

      firstName: randomFromArray(firstnames),
      lastName: randomFromArray(lastnames),
      birthday: genarateDateOfBirth(),
    };

    user.contactDetails = this.contactDetailsGenarator.create(user);
    user.description = this.userDescriptionGenarator.create();

    return user;
  }
}

function genarateDateOfBirth() {
  let age = (Math.random() * 70 + 18).toFixed(2).split(".");

  let birthday = dayjs();

  birthday = birthday.subtract(age[0], "years");
  birthday = birthday.subtract(Math.trunc(365 / (age[1] / 10)), "days");
  return birthday.format("YYYY/MM/DD");
}

function randomFromArray(array) {
  return array[Math.trunc(Math.random() * array.length)];
}

export default UserGenarator;
