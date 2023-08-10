function reduce() {
  const prices = [12, 19, 7, 209];

  const total = prices.reduce(function (totalPrice, nextPrice) {
    console.log(`Total price so far: ${totalPrice}`)
    console.log(`Next price to add: ${nextPrice}`)

    totalPrice += nextPrice

    return totalPrice
  }, 0)
  console.log("Total Final total price is: %d", total)
}
