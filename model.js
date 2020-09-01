class Singleton {
    
    _ioInstance;
    #name
    #redis

    constructor(){
   
    }
  
    get io() {
        return this.ioInstance;
    }
    set io(value) {
        this.ioInstance = value;
    }

    get namea() {
        return this.#name;
    }
    
    set namea(value) {
        this.#name = value;
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