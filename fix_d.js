function fix_d(d_in) {
  //d_in = "10/20/2022"

  let d = d_in.split('/');
  //console.log("d = ", d)
  //supress leading 0 for the month
  m_fix = d[0].replace(/^0/, "")
  d_fix = d[1].replace(/^0/, "")
  //console.log("m_fix = %s, d_fix = %s ", m_fix, d_fix )
  return ((m_fix + "/" + d_fix + "/" + d[2]))
}
