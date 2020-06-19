import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    // 购物车商品列表
    cart: []
  }

  onLoad() {
    // 把全局的转存成自己的
    this.cart = this.$parent.globalData.cart
  }

  computed = {
    // 判断购物车是否为空
    isEmpty() {
      if (this.cart.length <= 0) {
        return true
      }
      return false
    },
    // 总价格，单位是 分
    amount() {
      let total = 0 // 单位是 元
      this.cart.forEach((x) => {
        if (x.isCheck) {
          total += x.price * x.count
        }
      })

      return total * 100
    },
    // 是否全选
    isFullChecked() {
      // 获取所有商品的个数
      const allCount = this.cart.length

      let c = 0
      this.cart.forEach((x) => {
        if (x.isCheck) {
          c++
        }
      })

      return allCount === c
    }
  }

  methods = {
    countChanged(e) {
      // 获取到变化之后最新的数量值
      const count = e.detail
      // 商品的Id值
      const id = e.target.dataset.id
      // 直接调用全局定义的方法
      this.$parent.updateGoodsCount(id, count)
    },
    // 当商品前面的复选框，选中状态变化，会触发这个函数
    statusChanged(e) {
      // console.log(e)
      // 当前最新的选中状态
      const status = e.detail
      // 当前点击项对应的商品Id
      const id = e.target.dataset.id

      this.$parent.updateGoodsStatus(id, status)
    },
    // 拉出删除按钮，点击删除
    close(id) {
      // console.log(e)
      this.$parent.removeGoodsById(id)
    },
    // 监听全选复选框值改变的事件
    onFullCheckChanged(e) {
      // console.log(e)
      this.$parent.updateAllGoodsStatus(e.detail)
    },
    // 提交订单
    submitOrder() {
      if (this.amount <= 0) {
        return wepy.baseToast('订单金额不能为空！')
      }

      wepy.navigateTo({
        url: '/pages/order'
      })
    }
  }
}
