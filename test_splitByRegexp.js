function test_splitByRegexp() {
  //str = "1aaa-2bbb-3ccc-4ddd 5eee 6fff";
  str3 = ",*1. # 3. **長青團契*";
  str2 = ",*2. # 2. Linda Vista **多元文化博覽會*";
  str1 = "*1. #12**粵語部牧師聘**牧**委員會**Cantonese Pastor Search Committee*"
  //var a = str.split(/-(.*)/s);
  //split by how many times
  //var a = str.split('-', 2)
  //var a = str.split(/-(.+)/)
  var a = str1.split("#")
  //var a1 = a[1].split(/-(\d)/)
  var a1 = a[1].split(/(\d+)/)
  //var a2 = a1[0].replace(/[a-z,A-Z]/g, "");
  var a2 = a1[1] + "\.";
  //1st "-"
  //var a = str.substring(str.indexOf('-')+1)
  //2nd "-"
  //var a = str.substring(str.indexOf('-', str.indexOf('-') + 1) + 1 )
  //myString = myString.substring(myString.indexOf('_')+1)
  console.log(a)
  console.log(a1)
  console.log(a2)
  //console.log(a1)
}
