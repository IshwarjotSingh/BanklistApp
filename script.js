'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP


// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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



const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a , b) => a - b) : movements;
  
  movs.forEach(function(mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
      <div class="movements__value">${mov}€</div>
        </div>
    `;

    //This is used to write something in the html
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });



};



//Movememts of Current account will be passed into this funtion at the end
const calcPrintBalance = function(acc) {
  const balance = acc.movements.reduce((acc, mov) => acc + mov,0);
  acc.balance = balance;
  labelBalance.textContent = `${balance}€`;
}






const calcDisplaySummary = function(acc) {
  const incomes = acc.movements
  //If movement is greater than zero, it will be added to the income
  .filter(mov => mov > 0)
  .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  //If movement is less than zero, then it will be added to withdrawl(out)
  const out = acc.movements
      .filter(mov => mov < 0)
      .reduce((acc, mov) => acc + mov,0);
    labelSumOut.textContent = `${Math.abs(out)}€`;


  const interst = acc.movements
  .filter(mov => mov > 0)
  .map(deposite => (deposite * acc.interestRate) /100)
  .filter((int, i, arr) => {
  console.log(arr);
  return int >=1;
})
  .reduce((acc, int) => acc + int, 0);
   labelSumInterest.textContent = `${interst}€`; // Displaying the value 

   
};

  




const createUsernames = function(accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner  // new property // assinging username == owner
    .toLowerCase()
    .split(' ')
    .map(name => name[0])
    .join('')
  })    
};

createUsernames(accounts);
console.log(accounts)

/*

const firstWithdrawal = movements.find(mov => mov < 0);
console.log(movements);
console.log(firstWithdrawal);
*/

// Find method is used to find first element in an array that satisfies a provided condition 
const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);



const updateUI = function(acc){
    displayMovements(acc.movements);

    //DIsplay balance
    calcPrintBalance(acc);

    //DIsplay summary
    calcDisplaySummary(acc);

}

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)){
    currentAccount.movements.push(amount);

    //Update UI
    updateUI(currentAccount);

  }
  inputLoanAmount.value = '';
})



//Event Handlers
 btnClose.addEventListener('click', function(e) {
  e.preventDefault();
  username1 = account.username;
  pass1 = account.pin;


  if( inputLoginUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin){
    const index = account.findIndex(acc => acc.username === currentAccount.username)


    //Delete account
    account.splice(index,1);

    containerApp.style.opacity = 100;


  }
  inputCloseUsername.value = inputCloseUsername.value = '';

 })


 
let currentAccount;

btnLogin.addEventListener('click', function(e){
  //Prevent form from submitting
  e.preventDefault();

  // Here the acc.username will check the account method, if the..
  //.. the username does exist in the system 

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(currentAccount);

  if(currentAccount?.pin === Number(inputLoginPin.value)){
    console.log('LOGIN');

    //DIsplay UI and message
    
    labelWelcome.textContent = `Welcome Back, 
    ${currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;


    //CLear input fiels

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //UpdateUI

    updateUI(currentAccount);
    //DIsplay movements
    
    /*
    displayMovements(currentAccount.movements);

    //DIsplay balance
    calcPrintBalance(currentAccount);

    //DIsplay summary
    calcDisplaySummary(currentAccount.movements);
    */
  }
});



let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});


btnTransfer.addEventListener('click', function(e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
}
})





