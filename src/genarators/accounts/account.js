import { v4 as uuid } from "uuid";

class Account {
  create() {
    return {
      id: uuid(),
      initialAmount: Math.trunc(Math.random() * 100000) / 100,
      transactions: []
    };
  }
}

export default Account;
