import dayjs from "dayjs";

import emailProviders from "../../../randomData/emailProviders.js";

import AddressGenarator from "./address.js";

const addressGenarator = new AddressGenarator();

class ContactDetailsGenarator {
  create(user) {
    return {
      email: getEmail(user),
      mobile: getMobile(),
      address: addressGenarator.create(),
    };
  }
}

function getMobile() {
  return (
    "07" +
    Math.trunc(Math.random() * 1000000000)
      .toString()
      .padStart("5", 9)
  );
}

function getEmail({ firstName, lastName, birthday }) {
  const abbreviate = (name) => (Math.random() > 0.5 ? name : name.at(0));
  const dateFormat = Math.random() > 0.5 ? "YYYY" : "YY";

  const fName = abbreviate(firstName);
  const lName = abbreviate(lastName);

  const year = dayjs(birthday).format(dateFormat);

  let index = Math.trunc(Math.random() * emailProviders.length);
  const provider = emailProviders[index];

  let format = Math.random() > 0.5;

  return format
    ? `${fName}${lName}${year}@${provider}`
    : `${lName}${fName}${year}@${provider}`;
}

export default ContactDetailsGenarator;
