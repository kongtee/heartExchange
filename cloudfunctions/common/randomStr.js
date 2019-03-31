/**
 * 生成随机字符串
 */
module.exports = function(n) {
  const dict = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  let res = ''

  for (let i = 0; i < n; i++) {
    const num = Math.round(Math.random() * 35)
    res += dict[num]
  }

  return res
}