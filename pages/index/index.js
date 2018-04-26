//index.js
//获取应用实例
const app = getApp();
var wxCharts = require('../../libs/wxcharts.js');

Page({
  data: {
    update: '',
    basic: {},
    now:{},
    now_basic: {},
    today: {},
    tomorrow: {},
    afterTomor: {},
    air_now_city: {},
    categories: [],
    canvdata: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    lifestyle_drsg: '',
    lifestyle_uv: '',
    lifestyle_air: '',
    todyIcon: '../../imgs/weather/999.png',
    tomorrowIcon: '../../imgs/weather/999.png',
    afterTomorIcon: '../../imgs/weather/999.png'
  },
  onShow: function () {
    this.getLocation();
  },
  onLoad: function () {
    
  },
  // 跳转至生活指数数据详情
  lifestyleDetail: function (e) {
    let str = JSON.stringify(this.data.now);
    wx.navigateTo({
      url: '../detail/lifestyle/lifestyle?artype=' + str
    })
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  getLocation: function () {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        that.getWeatherInfo(latitude, longitude);
        that.getNowWeatherInfo(latitude, longitude);
        that.getHourlyWeatherInfo(latitude, longitude);
        that.getAirWeatherInfo(latitude, longitude);
      }
    })
  },
  // 逐小时预报
  getHourlyWeatherInfo: function (latitude, longitude) {
    var _this = this;
    var key = app.data.weather_key2;
    var url = app.data.weather_hourly_url + '?key=' + key + '&location=' + longitude + ',' + latitude;
    wx.request({
      url: url,
      data: {},
      method: 'GET',
      success: function (res) {
        // console.log(res)
      }
    })
  },
  // 空气质量指数
  getAirWeatherInfo: function (latitude, longitude) {
    var _this = this;
    var key = app.data.weather_key2;
    var url = app.data.weather_air_url + '?key=' + key + '&location=' + longitude + ',' + latitude;
    wx.request({
      url: url,
      data: {},
      method: 'GET',
      success: function (res) {
        var air_now_city = res.data.HeWeather6[0].air_now_city;
        _this.setData({
          air_now_city: air_now_city,
        });
      }
    })
  },
  // 实况天气
  getNowWeatherInfo: function (latitude, longitude) {
    var _this = this;
    var key = app.data.weather_key2;
    var url = app.data.weather_now_url + '?key=' + key + '&location=' + longitude + ',' + latitude;
    wx.request({
      url: url,
      data: {},
      method: 'GET',
      success: function (res) {
        var daily_now = res.data.HeWeather6[0].now;
        var daily_now_basic = res.data.HeWeather6[0].basic;
        _this.setData({
          now: daily_now,
          now_basic: daily_now_basic
        });
      }
    })
  },
  // 3天天气预报
  getWeatherInfo: function (latitude, longitude) {
    var _this = this;
    var categories = [];
    var avgdata = [];
    var maxdata = [];
    var mindata = [];
    var key = app.data.weather_key2;
    var url = app.data.weather_forecast_url + '?key=' + key + '&location=' + longitude + ',' + latitude;
    wx.request({
      url: url,
      data: {},
      method: 'GET',
      success: function (res) {
        var daily_forecast_today = res.data.HeWeather6[0].daily_forecast[0];//今天预报
        var daily_forecast_tomorrow = res.data.HeWeather6[0].daily_forecast[1];//明天天预报
        var daily_forecast_afterTomor = res.data.HeWeather6[0].daily_forecast[2];//后天预报
        var basic = res.data.HeWeather6[0].basic;
        var update = res.data.HeWeather6[0].update.loc;//更新时间
        for (var i = 0; i < res.data.HeWeather6[0].daily_forecast.length; i++){
          var weather_info = res.data.HeWeather6[0].daily_forecast[i];
          var max_tem = Number(weather_info.tmp_max);
          var min_tem = Number(weather_info.tmp_min);
          var avg_tem = parseInt((Number(weather_info.tmp_min) + Number(weather_info.tmp_max))/2);
          categories.push(weather_info.date);
          avgdata.push(avg_tem);
          maxdata.push(max_tem);
          mindata.push(min_tem);
        }
        var that = this;
        let windowWidth = 320;
        try {
          let res = wx.getSystemInfoSync();
          windowWidth = res.windowWidth;
        } catch (e) { }

        new wxCharts({
          canvasId: 'lineGraph',
          type: 'line',
          categories: categories,
          offsetX: 50,
          series: [{
            color: '#FF9900',
            name: '三日最高温走势',
            data: maxdata,
            format: function (val) {
              return val + '℃';
            }
          },{
            color: '#F6CB2D',
            name: '三日最低温走势',
            data: mindata,
            format: function (val) {
              return val + '℃';
            }
          }],
          yAxis: {
            gridColor: '#7cb5ec',
            format: function (val) {
              return val;
            },
          },
          width: windowWidth - 30,
          height: 230,
          dataLabel: true,
          dataPointShape: true,
          extra: {
            lineStyle: 'curve',
          }
        });
        _this.setData({
          update: update,
          basic: basic,
          today: daily_forecast_today,
          // categories: categories,
          // canvdata: canvdata,
          tomorrow: daily_forecast_tomorrow,
          afterTomor: daily_forecast_afterTomor,
          todyIcon: '../../imgs/weather/' + daily_forecast_today.cond_code_d + '.png',
          tomorrowIcon: '../../imgs/weather/' + daily_forecast_tomorrow.cond_code_d + '.png',
          afterTomorIcon: '../../imgs/weather/' + daily_forecast_afterTomor.cond_code_d + '.png'
        })
      }
    })
  }
})