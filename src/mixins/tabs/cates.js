import wepy from 'wepy'

// 注意，必须继承自 wepy.mixin
export default class extends wepy.mixin {
  data = {
    // 分类数据列表
    cateList: [],
    // 当前屏幕可用高度
    wh: 0,
    // 二级分类
    secondCate: []
  }

  onLoad() {
    this.getCateList()
    this.getWindowHeight()
  }

  methods = {
    // 徽章组件选中改变时
    onChange(e) {
      // console.log(e.detail)
      this.secondCate = this.cateList[e.detail].children
      console.log(this.secondCate)
    },
    // 点击跳转到商品列表页面，同时把id传过去
    goGoodsList(cid) {
      console.log(cid)

      wepy.navigateTo({
        url: '/pages/goods_list?cid=' + cid
      })
    }
  }

  async getCateList() {
    const { data: res } = await wepy.get('/categories')

    // console.log(res)
    if (res.meta.status !== 200) {
      return wepy.baseToast()
    }

    this.cateList = res.message
    // 解决刚进来二级分类没有数据
    this.secondCate = res.message[0].children
    this.$apply()
    console.log(this.cateList)
  }

  async getWindowHeight() {
    const res = await wepy.getSystemInfo()
    console.log(res)
    if (res.errMsg === 'getSystemInfo:ok') {
      this.wh = res.windowHeight
      this.$apply()
    }
  }
}
