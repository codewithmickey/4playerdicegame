class Singleton {
    
    _ioInstance;
    #gamesarray
    #redis

    constructor(){
   
    }
  
    get io() {
        return this.ioInstance;
    }
    set io(value) {
        this.ioInstance = value;
    }

    get games() {
        return this.#gamesarray;
    }
    
    set games(value) {
        this.#gamesarray = value;
    }

    get redisClient() {
        return this.#redis;
    }
    
    set redisClient(value) {
        this.#redis = value;
    }
  }
  
  const singletonInstance = new Singleton();
  //Object.freeze(singletonInstance);

  module.exports = singletonInstance;