import wepy from 'wepy'

// 注意，必须继承自 wepy.mixin
export default class extends wepy.mixin {
  data = {
    // 查询关键词
    query: '',
    // 商品分类的Id
    cid: '',
    // 页码值
    pagenum: 1,
    // 每页显示多少条数据
    pagesize: 10,
    // 商品列表数据
    goodslist: [],
    // 商品列表数据总数
    total: 0,
    // 加载完毕
    isover: false,
    // 表示当前数据是否正在请求中
    isloading: false
  }

  onLoad(options) {
    console.log(options)
    this.query = options.query || ''
    this.cid = options.cid || ''
    this.getGoodsList()
  }

  methods = {
    goGoodsDetail(goodsId) {
      wepy.navigateTo({
        url: '/pages/goods_detail/main?goods_id=' + goodsId
      })
    }
  }

  // 获取商品列表数据
  async getGoodsList(callback) {
    // 即将发起请求时，将 isloading 重置为 true
    this.isloading = true

    const { data: res } = await wepy.get('/goods/search', {
      query: this.query,
      cid: this.cid,
      pagenum: this.pagenum,
      pagesize: this.pagesize
    })

    if (res.meta.status !== 200) {
      return wepy.baseToast()
    }

    // 展开运算符
    this.goodslist = [...this.goodslist, ...res.message.goods]
    this.total = res.message.total

    // 当数据请求完成后，将 isloading 重置为 false
    this.isloading = false
    this.$apply()

    callback && callback()
  }

  // 触底操作
  onReachBottom() {
    // 判断当前是否正在请求数据中，
    // 如果 isloading 值为 true，则 return 从而终止后续操作，防止重复发起数据请求
    if (this.isloading) {
      return
    }
    // 先判断是否有下一页的数据
    if (this.pagenum * this.pagesize >= this.total) {
      this.isover = true
      return
    }
    // console.log('触底了')
    this.pagenum++
    this.getGoodsList()
  }

  // 下拉刷新的操作
  onPullDownRefresh() {
    // 初始化必要的字段值
    this.pagenum = 1
    this.total = 0
    this.goodslist = []
    this.isover = this.isloading = false

    // 重新发起数据请求
    this.getGoodsList(() => {
      // 当数据请求成功后，立即关闭下拉刷新效果
      wepy.stopPullDownRefresh()
    })
  }
}
