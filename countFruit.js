function countFruit() {
  const fruitBasket = ['banana', 'cherry', 'orange', 'apple', 'cherry', 'orange', 'apple', 'banana', 'cherry', 'orange', 'fig'];

  count = fruitBasket.reduce((tally, fruit) => {
    //tally[fruit] = (tally[fruit] || 0) + 1 ;
    //return tally;
    //} , {})

    if (!tally[fruit]) {
      tally[fruit] = 1;
    } else {
      tally[fruit] = tally[fruit] + 1;
    }
    return tally;
  }, {})

  console.log(count) // { banana: 2, cherry: 3, orange: 3, apple: 2, fig: 1 }
}
