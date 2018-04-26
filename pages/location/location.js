// var amapFile = require('../../libs/amap-wx.js');
// var markersData = [];
// Page({
//   data: {
//     weather: "",
//     markers: [],
//     latitude: '',
//     longitude: '',
//     textData: {},
//     tips: {},
//     points: [],
//     isShow: false,
//     location: '',
//     name: '',
//     address: '',
//     aroundList: [
//       {
//         name: '汽车服务',
//         id: '010000'
//       },
//       {
//         name: '汽车销售',
//         id: '020000'
//       },
//       {
//         name: '汽车维修',
//         id: '030000'
//       },
//       {
//         name: '摩托车',
//         id: '040000'
//       },
//       {
//         name: '餐饮',
//         id: '050000'
//       },
//       {
//         name: '购物',
//         id: '060000'
//       },
//       {
//         name: '生活',
//         id: '070000'
//       },
//       {
//         name: '体育休闲',
//         id: '080000'
//       },
//       {
//         name: '医疗保健',
//         id: '090000'
//       },
//       {
//         name: '住宿',
//         id: '100000'
//       },
//       {
//         name: '风景名胜',
//         id: '110000'
//       },
//       {
//         name: '商务住宅',
//         id: '120000'
//       }
//     ],
//     status: null,
//   },
//   onLoad: function () {
//     var that = this;
//     var myAmapFun = new amapFile.AMapWX({ key: '48916ae2c38f471cccae6bc5b007725d' });
//     myAmapFun.getPoiAround({
//       success: function (data) {
//         markersData = data.markers;
//         that.setData({
//           markers: markersData
//         });
//         that.setData({
//           latitude: markersData[0].latitude
//         });
//         that.setData({
//           longitude: markersData[0].longitude
//         });
//         that.showMarkerInfo(markersData, 0);
//       },
//       fail: function (info) {
//         wx.showModal({ title: info.errMsg })
//       }
//     }),
//     myAmapFun.getRegeo({
//       success: function (data) {
//         //成功回调
//       },
//       fail: function (info) {
//         //失败回调
//         console.log(info)
//       }
//     })
//   },
  
//   showMarkerInfo: function (data, i) {
//     var that = this;
//     console.log('data:', data[i]);
//     that.setData({
//       textData: {
//         name: data[i].name,
//         desc: data[i].address
//       }
//     });
//   }, 
  
//   // changeMarkerColor: function (data, i) {
//   //   var that = this;
//   //   var markers = [];
//   //   markers.push(data[j]);
//   //   that.setData({
//   //     markers: markers
//   //   });
//   // },
//   // makertap: function (e) {
//   //   var id = e.markerId;
//   //   var that = this;
//   //   that.showMarkerInfo(markersData, id);
//   //   that.changeMarkerColor(markersData, id);
//   // }
// })  
var app = getApp();
var amap = require('../../libs/amap-wx.js');
var key = '48916ae2c38f471cccae6bc5b007725d';
Page({
  data: {
    aroundList: [
      {
        name: '汽车服务',
        id: '010000'
      },
      {
        name: '汽车销售',
        id: '020000'
      },
      {
        name: '汽车维修',
        id: '030000'
      },
      {
        name: '摩托车',
        id: '040000'
      },
      {
        name: '餐饮',
        id: '050000'
      },
      {
        name: '购物',
        id: '060000'
      },
      {
        name: '生活',
        id: '070000'
      },
      {
        name: '体育休闲',
        id: '080000'
      },
      {
        name: '医疗保健',
        id: '090000'
      },
      {
        name: '住宿',
        id: '100000'
      },
      {
        name: '风景名胜',
        id: '110000'
      },
      {
        name: '商务住宅',
        id: '120000'
      }
    ],
    status: null,
    latitude: null,
    longitude: null,
    isShow: false,
    markers: [],
    points: [],
    location: '',
    name: '',
    address: ''
  },
  onLoad: function () {
    // 页面加载获取当前定位位置为地图的中心坐标
    var _this = this;
    wx.getLocation({
      success(data) {
        if (data) {
          _this.setData({
            latitude: data.latitude,
            longitude: data.longitude,
            markers: [{
              id: 0,
              latitude: data.latitude,
              longitude: data.longitude,
              iconPath: '../../imgs/local/blue.png',
              width: 32,
              height: 32
            }]
          });
        }
      }
    });
  },
  getType(e) {//获取选择的附近关键词，同时更新状态
    this.setData({ status: e.currentTarget.dataset.type })
    this.getAround(e.currentTarget.dataset.keywords, e.currentTarget.dataset.type);
  },
  getAround(keywords, types) {//通过关键词获取附近的点，只取前十个，同时保证十个点在地图中显示
    var _this = this;
    var myAmap = new amap.AMapWX({ key: key });
    myAmap.getPoiAround({
      iconPath: '../../imgs/local/blue.png',
      iconPathSelected: '../../imgs/local/blue.png',
      querykeywords: keywords,
      querytypes: types,
      location: _this.data.location,
      success(data) {
        console.log('data:', data);
        if (data.markers) {
          var markers = [], points = [];
          for (var value of data.markers) {
            if (value.id > 9) break;
            if (value.id == 0) {
              _this.setData({
                name: value.name,
                address: value.address,
                isShow: true
              })
            }
            markers.push({
              id: value.id,
              latitude: value.latitude,
              longitude: value.longitude,
              title: value.name,
              iconPath: value.iconPath,
              width: 32,
              height: 32,
              anchor: { x: .5, y: 1 },
              label: {
                content: value.name,
                color: 'green',
                fontSize: 12,
                borderRadius: 5,
                bgColor: '#fff',
                padding: 3,
                x: 0,
                y: -50,
                textAlign: 'center'
              }
            });
            points.push({
              latitude: value.latitude,
              longitude: value.longitude
            })
          }
          _this.setData({
            markers: markers,
            points: points
          })
        }
      },
      fail: function (info) {
        wx.showToast({ title: info })
      }
    })
  }
});