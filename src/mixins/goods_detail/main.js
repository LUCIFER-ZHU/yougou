import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    // 商品的Id值
    goods_id: '',
    // 商品的详情
    goodsInfo: {},
    // 收货地址
    addressInfo: null
  }

  onLoad(options) {
    console.log(options)
    // 转存商品Id
    this.goods_id = options.goods_id
    // 发起数据请求
    this.getGoodsInfo()
  }

  methods = {
    // 点击预览图片
    preview(current) {
      wepy.previewImage({
        // 所有图片的路径
        urls: this.goodsInfo.pics.map((x) => x.pics_big),
        // 当前默认看到的图片
        current: current
      })
    },

    // 获取用户的收货地址
    async chooseAddress() {
      const res = await wepy.chooseAddress().catch((err) => err)

      if (res.errMsg !== 'chooseAddress:ok') {
        return wepy.baseToast('获取收货地址失败！')
      }

      this.addressInfo = res
      // 将选择的收获地址，存储到本地 Storage 中
      wepy.setStorageSync('address', res)
      this.$apply()
    }
  }

  computed = {
    // 动态获取收货地址
    addressStr() {
      if (this.addressInfo === null) {
        return '请选择收货地址'
      }
      const addr = this.addressInfo
      const str =
        addr.provinceName + addr.cityName + addr.countyName + addr.detailInfo
      return str
    }
  }

  // 获取商品详情数据
  async getGoodsInfo() {
    const { data: res } = await wepy.get('/goods/detail', {
      goods_id: this.goods_id
    })

    if (res.meta.status !== 200) {
      return wepy.baseToast()
    }

    this.goodsInfo = res.message
    this.$apply()

    var WxParse = require('../../wxParse/wxParse.js')
    /**
     * WxParse.wxParse(bindName , type, data, target,imagePadding)
     * 1.bindName绑定的数据名(必填)
     * 2.type可以为html或者md(必填)
     * 3.data为传入的具体数据(必填)
     * 4.target为Page对象,一般为this(必填)
     * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
     */
    var that = this
    WxParse.wxParse('article', 'html', this.goodsInfo.goods_introduce, that, 2)
  }
}
