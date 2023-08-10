function mapReduce2() {
  const fruitBasket = ['banana', 'cherry', 'orange', 'apple', 'cherry', 'orange', 'apple', 'banana', 'cherry', 'orange', 'fig'];

  const count = fruitBasket.reduce((tally, fruit) => {
    if (!tally[fruit]) {
      tally[fruit] = 1;
    } else {
      tally[fruit] = tally[fruit] + 1;
    }
    
    console.log("fruit is %s ", fruit)
    return tally;

  }, {})
  console.log(count)
}
