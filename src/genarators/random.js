import loremipsum from "../../randomData/loremipsum.js";

const m = loremipsum.length;

class RandomGenerator {
  create() {
    return {
      a: newString(),
      b: Math.random(),
      c: Math.random().toString(),
    };
  }
}

function newString() {
  let len = Math.trunc(Math.random() * (m - 500));
  return loremipsum.substring(len, len + 500);
}

export default RandomGenerator;
