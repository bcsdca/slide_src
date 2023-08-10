function mapReduce1() {
  const euros = [29.76, 41.85, 46.5];

  const average = euros.reduce((total, amount, index, array) => {
    total += amount;
    if (index === array.length - 1) {
      console.log ("Total is %d, Average is %d", total, total/array.length)
      return total / array.length;
      
    } else {
      console.log ("Total is %d", total)
      return total;
    }
  });
}
