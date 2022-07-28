const eyeColors = ["Brown", "Blue", "Hazel", "Amber", "Grey", "Green"];
const hairColors = [
  "Brunette",
  "Blonde",
  "Ginger",
  "Auburn",
  "Grey",
  "Green",
  "Pink",
  "Blue",
];

class UserDescriptionGenarator {
  create() {
    return {
      eyeColor: randomFromArray(eyeColors),
      hairColor: randomFromArray(hairColors),
      height: getHeight(),
      weight: getWeight(),
    };
  }
}

function getHeight() {
  return 160 + Math.trunc(Math.random() * 40) - 20;
}

function getWeight() {
  return 160 + Math.trunc(Math.random() * 60) - 30;
}

function randomFromArray(array) {
  return array[Math.trunc(Math.random() * array.length)];
}

export default UserDescriptionGenarator;
