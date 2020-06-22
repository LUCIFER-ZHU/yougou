import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    // 默认标签页激活索引
    active: 0,
    // 全部 订单列表
    allOrderList: [],
    // 待付款 订单列表
    waitOrderList: [],
    // 已付款 订单列表
    finishOrderList: []
  }

  onLoad() {
    this.getOrderList(this.active)
  }

  methods = {
    tabChanged(e) {
      // console.log(e)
      this.active = e.detail.index

      this.getOrderList(this.active)
    }
  }

  // 获取订单列表
  async getOrderList(index) {
    // console.log(index)
    const { data: res } = await wepy.get('/my/orders/all', { type: index + 1 })

    if (res.meta.status !== 200) {
      return wepy.baseToast('获取订单列表失败！')
    }

    res.message.orders.forEach(
      (x) => (x.order_detail = JSON.parse(x.order_detail))
    )

    console.log(res)

    if (index === 0) {
      this.allOrderList = res.message.orders
    } else if (index === 1) {
      this.waitOrderList = res.message.orders
    } else if (index === 2) {
      this.finishOrderList = res.message.orders
    } else {
      wepy.baseToast('订单类型错误！')
    }

    this.$apply()
  }
}
