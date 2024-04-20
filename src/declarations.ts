export {};

declare global {

  //Experimental functionalitys
  interface Array<T> {
    log(o: T): void;
  }
}

//Experimental functionalitys implementation
Array.prototype.log = function<T>(o: T): void {
  console.log(o);
}
