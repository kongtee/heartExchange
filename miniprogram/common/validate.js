module.exports = (data, rules, cb) => {
  // console.log('data:', data)
  // console.log('rules:', rules)
  if (!data || !rules) {
    cb({ valid: true })
  }

  for (let key in rules) {
    // console.log('field:', key)
    const rule = rules[key]
    const len = rules[key].length
    for (let i = 0; i < len; i++) {
      // console.log('rule:', rule)
      // 是否是必填
      if (rule[i].required) {
        if (!data[key] || data[key] === '') {
          cb({
            errKey: key,
            errNo: i,
            valid: false
          })
          return
        }
      }
    }
  }
  cb({ valid: true })
}