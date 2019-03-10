module.exports = {
  /**
   * 从身份证那里获取年龄
   */
  getAgeFromIdCard: function(idCard) {
    const reg = /[1-9]\d{5}((?:19|20)\d{2})(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])(?:\d{4}|\d{3}[Xx])/
    if (!idCard) {
      return '';
    } 

    let regArr = idCard.match(reg)
    if (regArr) {
      let year = new Date().getFullYear()
      let age = year - regArr[1]
      return age
    }

    return '';
  }
}
