import wepy from 'wepy'
export default class extends wepy.mixin {
  data = {
    addressInfo: null,
    // 过滤出的商品列表
    cart: [],
    // 是否登录成功
    islogin: false
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
    },
    // 获取用户信息
    async getUserInfo(userInfo) {
      // 判断是否获取用户信息失败
      if (userInfo.detail.errMsg !== 'getUserInfo:ok') {
        return wepy.baseToast('获取用户信息失败！')
      }
      console.log(userInfo)

      // 获取用户登录的凭证 Code
      const loginRes = await wepy.login()
      if (loginRes.errMsg !== 'login:ok') {
        return wepy.baseToast('微信登录失败！')
      }
      console.log(loginRes)

      // 登录的参数
      const loginParams = {
        code: loginRes.code,
        encryptedData: userInfo.detail.encryptedData,
        iv: userInfo.detail.iv,
        rawData: userInfo.detail.rawData,
        signature: userInfo.detail.signature
      }

      // 发起登录的请求，换取登录成功之后的 Token 值
      const { data: res } = await wepy.post('/users/wxlogin', loginParams)
      console.log(res)
      if (res.meta.status !== 200) {
        return wepy.baseToast('微信登录请求失败！')
      }
      // 把登录成功之后的 Token 字符串，保存到 Storage 中
      wepy.setStorageSync('token', res.message.token)
      this.islogin = true
      this.$apply()
    },
    // 支付订单
    async onSubmit() {
      if (this.amount <= 0) {
        return wepy.baseToast('订单金额不能为0！')
      }
      if (this.addressStr.length <= 0) {
        return wepy.baseToast('请选择收货地址！')
      }

      // 1. 创建订单
      const { data: createResult } = await wepy.post('/my/orders/create', {
        // 订单金额 单位 元
        order_price: '0.01',
        consignee_addr: this.addressStr,
        order_detail: JSON.stringify(this.cart),
        goods: this.cart.map((x) => {
          return {
            goods_id: x.id,
            goods_number: x.count,
            goods_price: x.price
          }
        })
      })

      // 创建订单失败
      if (createResult.meta.status !== 200) {
        return wepy.baseToast('创建订单失败！')
      }

      // 创建订单成功了
      const orderInfo = createResult.message
      console.log(orderInfo)

      // 2. 生成预支付订单
      const { data: orderResult } = await wepy.post(
        '/my/orders/req_unifiedorder',
        {
          order_number: orderInfo.order_number
        }
      )

      // 生成预支付订单失败
      if (orderResult.meta.status !== 200) {
        return wepy.baseToast('生成预支付订单失败！')
      }

      // 走支付的流程
      // 3. 调用微信支付的API
      // console.log(orderResult)
      const payResult = await wepy
        .requestPayment(orderResult.message.pay)
        .catch((err) => err)

      // 用户取消了支付
      if (payResult.errMsg === 'requestPayment:fail cancel') {
        return wepy.baseToast('您已取消了支付！')
      }

      // 用户完成了支付的过程
      // 4. 检查用户支付的结果
      const { data: payCheckResult } = await wepy.post('/my/orders/chkOrder', {
        order_number: orderInfo.order_number
      })

      if (payCheckResult.meta.status !== 200) {
        return wepy.baseToast('订单支付失败！')
      }

      // 5. 提示用户支付成功
      wepy.showToast({
        title: '支付成功！'
      })

      // 6. 跳转到订单列表页面
      wepy.navigateTo({
        url: '/pages/orderlist'
      })
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
      const addr = this.addressInfo
      const str =
        addr.provinceName + addr.cityName + addr.countyName + addr.detailInfo
      return str
    },
    // 当前订单总价格
    amount() {
      let total = 0

      this.cart.forEach((x) => {
        total += x.price * x.count
      })

      return total * 100
    }
  }
}
