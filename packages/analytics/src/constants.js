/* eslint-disable class-methods-use-this */
// eslint-disable-next-line max-classes-per-file
class Order {}

export class Asc extends Order {
  matchStage(nextKey) {
    return { $gt: nextKey }
  }

  order() {
    return 1
  }
}

export class Desc extends Order {
  matchStage(nextKey) {
    return { $lt: nextKey }
  }

  order() {
    return -1
  }
}
