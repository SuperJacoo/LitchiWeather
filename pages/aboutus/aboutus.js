const app = getApp();

Page({
  /**
   * 组件的初始数据
   */
  data: {

  },
  // 跳转至数据来源及致谢
  dataFromDetail: function (e) {
    wx.navigateTo({
      url: '../detail/datafrom/datafrom'
    })
  },
  // 跳转至使用技巧
  useSkillsDetail: function (e) {
    wx.navigateTo({
      url: '../detail/useskills/useskills'
    })
  },
  // 跳转至关于作者
  aboutMeDetail: function (e) {
    wx.navigateTo({
      url: '../detail/aboutme/aboutme'
    })
  },
})
