import wepy from 'wepy'
export default class extends wepy.mixin {
  data = {
    addressInfo: null,
    // 过滤出的商品列表
    cart: []
  }

  onLoad() {
    // 读取收货地址
    this.addressInfo = wepy.getStorageSync('address') || null
    // 从购物车列表中过滤出已经选择的商品形成新数组
    const newArr = this.$parent.globalData.cart.filter((x) => x.isCheck)
    // console.log(newArr)
    this.cart = newArr
  }

  methods = {
    // 选择收货地址
    async chooseAddress() {
      const res = await wepy.chooseAddress().catch((err) => err)

      if (res.errMsg !== 'chooseAddress:ok') {
        return
      }

      this.addressInfo = res
      wepy.setStorageSync('address', res)
      this.$apply()
    }
  }

  computed = {
    isHaveAddress() {
      if (this.addressInfo === null) {
        return false
      }
      return true
    },
    addressStr() {
      if (this.addressInfo === null) {
        return false
      }
      return (
        this.addressInfo.provinceName +
        this.addressInfo.cityName +
        this.addressInfo.countyName +
        this.addressInfo.detailInfo
      )
    }
  }
}
