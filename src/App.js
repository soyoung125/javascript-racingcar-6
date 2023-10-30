import { MissionUtils } from "@woowacourse/mission-utils";
import Car from "./Car.js";

class App {

  constructor() {
    this.cars = [];
    this.tryCount = 0;
  }

  async initGame() {
    const names = await this.inputCarNames();

    this.makeCarArray(names)

    await this.inputTryCount();
  }

  async inputTryCount() {
    const count = await MissionUtils.Console.readLineAsync("시도할 횟수는 몇 회인가요?\n");

    const numberRegex = /^[0-9]+$/;
    if (!numberRegex.test(count)) {
      throw new Error("[ERROR] 숫자가 잘못된 형식입니다.")
    }

    this.tryCount = parseInt(count);
  }

  async inputCarNames() {
    return await MissionUtils.Console.readLineAsync("경주할 자동차 이름을 입력하세요.(이름은 쉼표(,) 기준으로 구분)\n")
  }

  makeCarArray(names) {
    names.split(",").forEach((name) => {
      if (name.length > 5) {
        throw new Error("[ERROR] 이름이 5자를 초과했습니다.")
      }
      if (this.cars.find((car) => car.isSameName(name)) !== undefined) {
        throw new Error("[ERROR] 중복된 이름이 존재합니다.")
      }

      this.cars.push(new Car(name));
    })
  }

  startRacing() {
    MissionUtils.Console.print("\n실행 결과");

    for (let count = 0; count < this.tryCount; count++) {
      this.cars.forEach((car) => {
        this.moveForward(car)
        car.printState();
      });
      MissionUtils.Console.print("\n");
    }

    this.printWinner()
  }

  moveForward(car) {
    if (MissionUtils.Random.pickNumberInRange(0, 9) >= 4) {
      car.goForward();
    }
  }

  getWinnersNames() {
    const maxForwardCount = Math.max.apply(null, this.cars.map((car) => car.getForwardCount))
    return this.cars.filter((car) => car.isWinner(maxForwardCount)).map((car) => car.getName);
  }

  printWinner() {
    const winners = this.getWinnersNames();
    MissionUtils.Console.print(`최종 우승자 : ${winners.join(", ")}`);
  }

  async play() {
    await this.initGame();

    this.startRacing();
  }
}

export default App;
