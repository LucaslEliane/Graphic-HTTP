class Publisher {
  private subscribers: Object = {
    any: []
  }
  public subscribe(fn, type: string = 'any') {
    if (typeof fn != 'function') {
      throw new TypeError('subscribe need a function as the first parameter')
    }
    if (this.subscribers[type] === undefined) {
      this.subscribers[type] = []
    }
    this.subscribers[type].push(fn)
  }
  public unsubscribe(fn, type: string = 'any') {
    if (typeof fn != 'function') {
      throw new TypeError('unsubscribe need a function as the first parameter')
    }
    this.visitSubscribers('unsubscribers', fn, type)
  }
  protected publish(publication: string, type: string = 'any') {
    this.visitSubscribers('publish', publication, type)
  }
  private visitSubscribers(operate: string, fn, type: string) {
    let subscribers = this.subscribers,
        i,
        length = subscribers[type].length,
        subscriberArray = subscribers[type]
    for (i = 0; i < length ; i++) {
      if (operate === 'unsubscribers') {
        if (fn == subscriberArray[i]) {
          subscriberArray.splice(i, 1)
        }
      } else if (operate === 'publish') {
        subscriberArray[i](fn)
      }
    }
  }
}

class Paper extends Publisher {
  constructor(private paperName: string = 'default paper') {
    super()
  }
  public daily() {
    super.publish(`daily ${this.paperName}`)
  }
  public weekly() {
    super.publish(`weekly ${this.paperName}`)
  }
}

let dailyNews = new Paper('daily news')

var joe = {
  drinkCoffee: function(paper) {
    console.log('Just read ' + paper)
  },
  sundayPreNap: function(paper) {
    console.log('About to fall asleep reading this ' + paper)
  }
}

dailyNews.subscribe(joe.drinkCoffee)
dailyNews.subscribe(joe.sundayPreNap, 'monthly')

dailyNews.daily()
dailyNews.daily()
dailyNews.weekly()