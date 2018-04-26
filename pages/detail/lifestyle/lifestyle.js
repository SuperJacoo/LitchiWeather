Page({
  /**
   * 组件的初始数据
   */
  data: {
    now: {},
  },
  onLoad: function (options) {
    let item = JSON.parse(options.artype);
    console.log('item:', item);
    this.setData({
      now: item
    })
  },
})
