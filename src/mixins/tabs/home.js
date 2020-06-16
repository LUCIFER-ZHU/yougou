import wepy from 'wepy'

// 注意，必须继承自 wepy.mixin
export default class extends wepy.mixin {
  data = {
    // 轮播图数据
    swiperList: [],
    // 分类数据
    cateItems: [],
    // 楼层数据
    floorData: []
  }

  onLoad() {
    this.getSwiperData()
    // 分类数据
    this.getCateItems()
    // 在页面加载完成后，自动获取楼层数据
    this.getFloorData()
  }

  methods = {
    // 点击楼层中的每一张图片，都要跳转到商品列表页面
    goGoodsList(url) {
      wepy.navigateTo({
        url
      })
    }
  }
  // 获取轮播图数据
  async getSwiperData() {
    // 解构赋值
    const { data: res } = await wepy.get('/home/swiperdata')

    console.log(res)
    if (res.meta.status !== 200) {
      // console.log('获取数据失败')
      return wepy.baseToast()
    }

    this.swiperList = res.message
    this.$apply()
  }

  // 获取首页分类相关的数据项
  async getCateItems() {
    const { data: res } = await wepy.get('/home/catitems')

    if (res.meta.status !== 200) {
      return wepy.baseToast()
    }

    this.cateItems = res.message
    this.$apply()
  }

  // 获取楼层相关数据
  async getFloorData() {
    const { data: res } = await wepy.get('/home/floordata')

    if (res.meta.status !== 200) {
      return wepy.baseToast()
    }

    this.floorData = res.message
    this.$apply()
  }
}
