'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
    owner: 'Yuri Sokolovicz',
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2, // %
    pin: 1111,

    movementsDates: [
        '2022-08-18T21:31:17.178Z',
        '2022-09-23T07:42:02.383Z',
        '2022-10-28T09:15:04.904Z',
        '2022-11-01T10:17:24.185Z',
        '2023-01-08T14:11:59.604Z',
        '2023-02-06T17:01:17.194Z',
        '2023-02-12T23:36:17.929Z',
        '2023-02-15T10:51:36.790Z'
    ],
    currency: 'EUR',
    locale: 'pt-PT' // de-DE
};

const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,

    movementsDates: [
        '2021-11-01T13:15:33.035Z',
        '2021-11-30T09:48:16.867Z',
        '2021-12-25T06:04:23.907Z',
        '2022-01-25T14:18:46.235Z',
        '2022-02-05T16:33:06.386Z',
        '2022-04-10T14:43:26.374Z',
        '2023-02-05T18:49:59.371Z',
        '2023-02-10T12:01:20.894Z'
    ],
    currency: 'USD',
    locale: 'en-US'
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const displayMovements = function (acc, sort = false) {
    containerMovements.innerHTML = '';

    const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

    movs.forEach(function (mov, i) {
        const type = mov > 0 ? 'deposit' : 'withdrawal';

        const date = new Date(acc.movementsDates[i]);
        const day = `${date.getDate()}`.padStart(2, '0');
        const month = `${date.getMonth() + 1}`.padStart(2, '0');
        const year = date.getFullYear();
        const displayDate = `${day}/${month}/${year}`;

        const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${mov.toFixed(2)}€</div>
      </div>
    `;

        containerMovements.insertAdjacentHTML('afterbegin', html);
    });
};

const calcDisplayBalance = function (acc) {
    acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
    labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

const calcDisplaySummary = function (acc) {
    const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
    labelSumIn.textContent = `${incomes.toFixed(2)}€`;

    const out = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
    labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;

    const interest = acc.movements
        .filter(mov => mov > 0)
        .map(deposit => (deposit * acc.interestRate) / 100)
        .filter((int, i, arr) => {
            // console.log(arr);
            return int >= 1;
        })
        .reduce((acc, int) => acc + int, 0);
    labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const createUsernames = function (accs) {
    accs.forEach(function (acc) {
        acc.username = acc.owner
            .toLowerCase()
            .split(' ')
            .map(name => name[0])
            .join('');
    });
};
createUsernames(accounts);

const updateUI = function (acc) {
    // Display movements
    displayMovements(acc);

    // Display balance
    calcDisplayBalance(acc);

    // Display summary
    calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
    // Set time to 5 min
    let time = 300;
    // Call the timer every second
    const timer = setInterval(function () {
        const min = String(Math.trunc(time / 60)).padStart(2, 0);
        const sec = String(time % 60).padStart(2, 0);
        // In each call, print the remaining time to UI (User Interface)
        labelTimer.textContent = `${min}:${sec}`;

        // Decrease 1s
        time--; // time = time - 1

        // When 0 seconds, stop timer and log out user
        if (time === 0) {
            clearInterval(timer);
            labelWelcome.textContent = `Log in to get started`;
            containerApp.style.opacity = 0;
        }
    }, 1000);
    return timer;
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

// // FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

// day/month/year

btnLogin.addEventListener('click', function (e) {
    // Prevent form from submitting
    e.preventDefault();

    currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
    console.log(currentAccount);

    if (currentAccount?.pin === +inputLoginPin.value) {
        // Display UI and message
        labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
        containerApp.style.opacity = 100;

        // Create current date and time
        const now = new Date();
        const day = `${now.getDate()}`.padStart(2, '0');
        const month = `${now.getMonth() + 1}`.padStart(2, '0');
        const year = now.getFullYear();
        const hour = `${now.getHours()}`.padStart(2, '0');
        const min = `${now.getMinutes()}`.padStart(2, '0');
        labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

        // Clear input fields
        inputLoginUsername.value = inputLoginPin.value = '';
        inputLoginPin.blur();

        // Timer - clear the time of another accounts to avoid time overlap
        if (timer) clearInterval(timer);
        timer = startLogOutTimer();

        // Update UI
        updateUI(currentAccount);
    }
});

btnTransfer.addEventListener('click', function (e) {
    e.preventDefault();
    const amount = +inputTransferAmount.value;
    const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
    inputTransferAmount.value = inputTransferTo.value = '';

    if (amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc?.username !== currentAccount.username) {
        // Doing the transfer
        currentAccount.movements.push(-amount);
        receiverAcc.movements.push(amount);

        // Add transfer date
        currentAccount.movementsDates.push(new Date().toISOString());
        receiverAcc.movementsDates.push(new Date().toISOString());

        // Update UI
        updateUI(currentAccount);
    }
});

btnLoan.addEventListener('click', function (e) {
    e.preventDefault();

    const amount = Math.floor(inputLoanAmount.value);

    if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
        setTimeout(function () {
            // Add movement
            currentAccount.movements.push(amount);

            // Add loan date
            currentAccount.movementsDates.push(new Date().toISOString());

            // Update UI
            updateUI(currentAccount);
        }, 2500);
    }

    inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
    e.preventDefault();

    if (inputCloseUsername.value === currentAccount.username && +inputClosePin.value === currentAccount.pin) {
        const index = accounts.findIndex(acc => acc.username === currentAccount.username);
        console.log(index);
        // .indexOf(23)

        // Delete account
        accounts.splice(index, 1);

        // Hide UI
        containerApp.style.opacity = 0;
    }

    inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
    e.preventDefault();
    displayMovements(currentAccount.movements, !sorted);
    sorted = !sorted;
});

/*
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

///////////////////////////////////////
// Converting and Checking Numbers
console.log(23 === 23.0);

// Base 10 - 0 to 9. 1/10 = 0.1. 3/10 = 3.3333333
// Binary base 2 - 0 1
console.log(0.1 + 0.2);
console.log(0.1 + 0.2 === 0.3); // This is an error in javascript

// Conversion
console.log(Number('23'));
console.log(+'23'); // type coercion - convert to numbers - code looks cleaner (apply in this project)

// Parsing
// util para pegar valores do css e aplicar no js
console.log(Number.parseInt('30px', 10));
console.log(Number.parseInt('e23', 10));

console.log(Number.parseInt('  2.5rem  '));
console.log(Number.parseFloat('  2.5rem  '));

// console.log(parseFloat('  2.5rem  ')); // old way

// Check if value is NaN
console.log(Number.isNaN(20));
console.log(Number.isNaN('20'));
console.log(Number.isNaN(+'20X'));
console.log(Number.isNaN(23 / 0));

// Checking if value is number
console.log(Number.isFinite(20));
console.log(Number.isFinite('20'));
console.log(Number.isFinite(+'20X'));
console.log(Number.isFinite(23 / 0));

console.log(Number.isInteger(23));
console.log(Number.isInteger(23.0));
console.log(Number.isInteger(23 / 0));


///////////////////////////////////////
// Math and Rounding
console.log(Math.sqrt(25)); // sqrt = square root = raiz quadrada
console.log(25 ** (1 / 2)); // 25^(1/2) = raiz quadrada de 25
console.log(8 ** (1 / 3)); // 8^(1/3)

console.log(Math.max(5, 18, 23, 11, 2));
console.log(Math.max(5, 18, '23', 11, 2)); // it does type coercion
console.log(Math.max(5, 18, '23px', 11, 2)); /// it does not parsing

console.log(Math.min(5, 18, 23, 11, 2));

// calculating a area of a circle of 10px
// parseFloat does parsing
console.log(Math.PI * Number.parseFloat('10px') ** 2); // ** = square

// random values between 1 and 6
console.log(Math.trunc(Math.random() * 6) + 1);

const randomInt = (min, max) => Math.floor(Math.random() * (max - min) + 1) + min;
// 0...1 -> 0...(max - min) -> min...max
console.log(randomInt(10, 20));

// Rounding integers
console.log(Math.trunc(23.9)); // apenas remove a decimal
console.log(Math.round(23.3)); // arredonta para o valor matematico correto
console.log(Math.round(23.9));

console.log(Math.ceil(23.3)); // arredonda p cima - rounds up
console.log(Math.ceil(23.9));

console.log(Math.floor(23.3)); // arredonda p baixo - rounds down
console.log(Math.floor('23.9')); // does type coercion
console.log(Math.floor('23.9px')); // does not do parsing

console.log(Math.trunc(23.3));

console.log(Math.trunc(-23.3));
console.log(Math.floor(-23.3));

// Rounding decimals
console.log((2.7).toFixed(0)); // always return a string
console.log((2.7).toFixed(3)); // always return a string
console.log((2.345).toFixed(2)); // always return a string
console.log(+(2.345).toFixed(2)); // + = Number, to converting string to a number



///////////////////////////////////////
// The Remainder Operator
console.log(5 % 2); // 1
console.log(5 / 2); // 5 / 2 = 2.5 ; 5 = 2 * 2 + 1

console.log(8 % 3); // 2
console.log(8 / 3); // 8 / 3 = 2.66666 ;8 = 2 * 3 + 2

console.log(6 % 2); //0
console.log(6 / 2); // 6 / 2 = 3; 3 * 2 = 6. falta 0 para 6 virar 6

console.log(7 % 2); // 1
console.log(7 / 2); // 7 / 2 = 3.5; 3 * 2 = 6. falta 1 para 6 virar 7

// even number = numero par
// odd number = numero impar
const isEven = n => n % 2 === 0;
console.log(isEven(8));
console.log(isEven(23));
console.log(isEven(514));

// labelBalance.addEventListener('click', function () {
//     [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
//         // 0, 2, 4, 6
//         if (i % 2 === 0) row.style.backgroundColor = 'orangered';
//         // 0, 3, 6, 9
//         if (i % 3 === 0) row.style.backgroundColor = 'blue';
//     });
// });


///////////////////////////////////////
// Numeric Separators - ES2021

// 287,460,000,000
const diameter = 287_460_000_000;
console.log(diameter);

const price = 345_99;
console.log(price);

const transferFee1 = 15_00;
const transferFee2 = 1_500;

const PI = 3.1415;
console.log(PI);

// Converting strings to a number
console.log(Number('230_000'));
console.log(parseInt('230_000'));


///////////////////////////////////////
// Working with BigInt - serve para store large numbers
console.log(2 ** 53 - 1); // numero maximo possivel em javascript - perde precisao acima desse ponto
console.log(Number.MAX_SAFE_INTEGER);
console.log(2 ** 53 + 1); // unsafe numbers
console.log(2 ** 53 + 2);
console.log(2 ** 53 + 3);
console.log(2 ** 53 + 4);

// (n) no final transforma um regular number em um bigInt number
console.log(4838430248342043823408394839483204n);
console.log(BigInt(48384302));

// Operations
console.log(10000n + 10000n);
console.log(36286372637263726376237263726372632n * 10000000n);
// console.log(Math.sqrt(16n)); // square operator does not work for bigInt

// Its not possible to mix bigInt with regular numbers
// console.log(10000n + 10000); // Error: Cannot mix BigInt and other types
const huge = 20289830237283728378237n;
const num = 23;
console.log(huge * BigInt(num));

// Exceptions
console.log(20n > 15);
console.log(20n === 20); // === js does not do type coercion
console.log(typeof 20n);
console.log(20n == '20'); // == js does type coercion

console.log(huge + ' is REALLY big!!!');

// Divisions
console.log(11n / 3n); // 3 - corta as casas decimais
console.log(10 / 3); // 3.333333



///////////////////////////////////////
// Creating Dates

// Create a date

const now = new Date();
console.log(now);

console.log(new Date('Aug 02 2020 18:05:41'));
console.log(new Date('December 24, 2015'));
console.log(new Date(account1.movementsDates[0]));

// months is zero based, 0 = january, 10 = november
// JS corrigi os dias dos meses
console.log(new Date(2037, 10, 19, 15, 23, 5));
console.log(new Date(2037, 10, 31)); // corrigiu p 01 Dec

console.log(new Date(0));
console.log(new Date(3 * 24 * 60 * 60 * 1000)); // 3 days after day 0 in js

// Working with dates
const future = new Date(2037, 10, 19, 15, 23);
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDate());
console.log(future.getDay());
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds());
console.log(future.toISOString()); // Util para converter date Object in string - usado nesse projeto
console.log(future.getTime());

console.log(new Date(2142256980000));

console.log(Date.now());

future.setFullYear(2040);
console.log(future);



///////////////////////////////////////
// Operations With Dates
const future = new Date(2037, 10, 19, 15, 23); // result in milliseconds
console.log(+future);

// / (1000 * 60 * 60 * 24) is to convert milliseconds in days
// Math.abs eh para nao ficar diferenca de dia negativo
const calcDaysPassed = (date1, date2) => Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);

// To calculate the diference in days between two dates
const days1 = calcDaysPassed(new Date(2037, 3, 4), new Date(2037, 3, 10));
console.log(days1);



///////////////////////////////////////
// Timers

// setTimeout
// asynchronous javascript
setTimeout(() => console.log(`Here is your pizza 🍕`), 3000);
console.log('Waiting1...');

setTimeout((ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2} 🍕`), 5000, 'olives', 'spinach');
console.log('Waiting2...');

const ingredients = ['olives', 'tomatoes'];
const pizzaTimer = setTimeout((ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2} 🍕`), 7000, ...ingredients);
console.log('Waiting3...');

if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);

// // setInterval - executes this every 1 second
setInterval(function () {
    const now = new Date();
    console.log(now);
}, 5000);

*/
