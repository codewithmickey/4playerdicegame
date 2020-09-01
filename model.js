class Singleton {
    
    _ioInstance;
    #name

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
  }
  
  const singletonInstance = new Singleton();
  //Object.freeze(singletonInstance);

  module.exports = singletonInstance;