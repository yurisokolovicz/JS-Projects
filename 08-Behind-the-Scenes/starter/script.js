"use strict";

// ## Scoping in Practice

// function calcAge(birthYear) {
//   const age = 2037 - birthYear;

//   function printAge() {
//     let output = `${firstName}, You are ${age}, born in ${birthYear}`;
//     console.log(output);

//     if (birthYear >= 1981 && birthYear <= 1996) {
//       var millenial = true;
//       // Creating NEW variable with same name as outer scope's variable
//       const firstName = `Steven`;
//       const str = `Oh, and you're a millenial, ${firstName}`;
//       console.log(str);

//       function add(a, b) {
//         return a + b;
//       }

//       // Reassigning outer scope's variable
//       output = `NEW OUTPUT!`;
//     }
//     console.log(millenial);
//     // console.log(str);
//     // console.log(add(2, 3));
//     console.log(output);
//   }
//   printAge();

//   return age;
// }

// const firstName = "Yuri";
// calcAge(1991);
// // console.log(age);
// // printAge();

// ## Hoisting and TDZ in Practice

// // Variables
// console.log(me);
// // console.log(job);
// // console.log(year);

// var me = "Yuri";
// let job = "Researcher";
// const year = 1991;

// // Functions
// console.log(addDecl(2, 3));
// // console.log(addExpr(2, 3));
// console.log(addArrow);
// // console.log(addArrow(2, 3));

// function addDecl(a, b) {
//   return a + b;
// }

// const addExpr = function (a, b) {
//   return a + b;
// };

// var addArrow = (a, b) => a + b;

// // Example
// console.log(undefined);
// if (!numProducts) deleteShoppingCart();

// var numProducts = 10;

// function deleteShoppingCart() {
//   console.log(`All products deleted!`);
// }

// var x = 1;
// let y = 2;
// const z = 3;

// console.log(x === window.x);
// console.log(y === window.y);
// console.log(z === window.z);

// ## The this Keyword/Variable - will point to the object wich is calling the method - Dynamic and not static

console.log(this); // Window Object

const calcAge = function (birthYear) {
  console.log(2037 - birthYear);
  console.log(this);
};
calcAge(1991);

const calcAgeArrow = (birthYear) => {
  console.log(2037 - birthYear);
  console.log(this);
};
calcAgeArrow(1991);

const jonas = {
  year: 1991,
  calcAge: function () {
    console.log(this);
    console.log(2037 - this.year);
  },
};
jonas.calcAge();

const matilda = {
  year: 2017,
};

matilda.calcAge = jonas.calcAge;
matilda.calcAge(); // we are calling the method on matilda so this will point to matilda even this was inside jonas object

const f = jonas.calcAge;
f(); // this keyweord is undefined