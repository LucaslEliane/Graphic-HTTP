var CarMaker = function() {}

CarMaker.prototype.drive = function() {
  return `Hello, I have ${this.doors} doors`
}

CarMaker.prototype.factory = function(carStr) {
  var newCar
  if (typeof CarMaker[carStr] !== 'function') {
    throw new TypeError(`Request car type is not existed`)
  }
  if (typeof CarMaker[carStr].prototype.drive !== 'function') {
    CarMaker[carStr].prototype.drive = CarMaker.prototype.drive
  }
  newCar = new CarMaker[carStr]()
  return newCar
}

CarMaker.Compact = function() {
  this.doors = 4
}

CarMaker.Convertible = function() {
  this.doors = 2
}

CarMaker.SUV = function() {
  this.doors = 7
}

var carMaker = new CarMaker()
var corolla = carMaker.factory('Compact')
var solstice = carMaker.factory('Convertible')
var cherokee = carMaker.factory('SUV')
console.log(corolla.drive())
console.log(solstice.drive())
console.log(cherokee.drive())