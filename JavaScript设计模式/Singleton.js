
/**
 * 将实例缓存在静态属性里面，但这样得到的属性也是暴露出来了，容易被误修改
 * 
 * @returns 缓存的Universe实例
 */
function propertyUniverse() {
  if (typeof this.instance === 'object') {
    return this.instance
  }

  this.start_time = 0
  this.bang = "Big"

  this.instance = this

  return this
}

function closureUniverse() {
  var instance = this

  this.start_time = 0
  this.bang = "Big"

  closureUniverse = function() {
    return instance
  }
}

function closureUniverse() {
  var instance

  closureUniverse = function() {
    return instance
  }

  closureUniverse.prototype = this

  instance = new closureUniverse()

  instance.constructor = Universe

  this.start_time = 0
  this.bang = "Big"

  return instance
}

var IIFEUniverse

(function() {
  var instance;
  IIFEUniverse = function() {
    if (instance) {
      return instance
    }

    instance = this
    this.start_time = 0
    this.bang = "Big"
  }
}())

var uni1 = new IIFEUniverse()
var uni2 = new IIFEUniverse()

console.log(uni1 === uni2)