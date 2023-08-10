function mapReduce() {
  var array = [
    ['Name', 'Phone Number'],
    ['Bill Chu', "858-716-7471"],
    ['Le Chu', "858-472-7563"]
  ]

  var keys = array.shift();
  var objects = array.map(function (values) {
    
    return keys.reduce(function (o, k, i) {
      o[k] = values[i];
      return o;
    }, {});

  });
  console.log(objects)
}
