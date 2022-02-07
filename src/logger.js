import dayjs from "dayjs";

class Logger {
  log(message) {
    let timestamp = dayjs().format();
    console.log(`[${timestamp}] ${message}`);
  }
}

export default Logger;
