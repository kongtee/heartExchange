Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    // rules: Function,
    rules: Object
  },
  data: {
    someData: {

    }
  },
  methods: {
    validate(e) {
      console.log('validate:', e)
    },

    onSubmit(e) {
      console.log('form:',e)
      const myEventDetail = {} // detail对象，提供给事件监听函数
      const myEventOption = {} // 触发事件的选项
      this.triggerEvent('submit', myEventDetail, myEventOption)
    },

    onSubmit1(e) {
      console.log('form1:', e)
      const myEventDetail = {} // detail对象，提供给事件监听函数
      const myEventOption = {} // 触发事件的选项
      this.triggerEvent('submit', myEventDetail, myEventOption)
    }
  }
})