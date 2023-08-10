function rowToObjects() {
  var array = [  
    ['Name', 'Phone Number'],
    ['Bill Chu', "858-716-7471"],
    ['Le Chu', "858-472-7563"]
  ]

  var header = array.shift();
  
  var data = [];
  array.forEach(function (row) {
    var object  = {};
    row.forEach(function (value, index) {
      object[header[index]] = value;
    });
    data.push(object);
  });
  console.log(data)
  //return data;
}

