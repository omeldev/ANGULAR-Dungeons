export {};

declare global {

  //Experimental functionalitys
  interface Array<T> {
    log(): void;
  }


}
//Experimental functionalitys implementation
Array.prototype.log = function <T>(): void {
  console.log(this);
}

