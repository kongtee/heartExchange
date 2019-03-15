module.exports = function() {
  const date = new Date()
  const year = date.getFullYear()
  let month = date.getMonth() + 1
  month = month > 9 ? month : `0${month}`
  let day = date.getDate()
  day = day > 9 ? day : `0${day}`
  return [ year, month, day ].join('') 
}