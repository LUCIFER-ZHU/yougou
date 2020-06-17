import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    // 搜索框默认内容
    value: '',
    // 搜索建议列表
    suggestList: [],
    // 搜索历史列表
    kwList: []
  }

  onLoad() {
    const kwList = wepy.getStorageSync('kw') || []
    // console.log(kwList)
    // 将读取的数据挂载到 data 中
    this.kwList = kwList
  }

  methods = {
    // 触发搜索
    onSearch(e) {
      // console.log(e.detail)
      const kw = e.detail.trim()
      if (kw.length <= 0) {
        return
      }
      // 用户填写的关键词 保存到storage里去
      if (this.kwList.indexOf(kw) === -1) {
        this.kwList.unshift(kw)
      }
      // 截取前十个 slice获取一个新数组
      this.kwList = this.kwList.slice(0, 10)
      wepy.setStorageSync('kw', this.kwList)

      wepy.navigateTo({
        url: '/pages/goods_list?query=' + kw
      })
      // // 提交后清空搜索框内容
      // this.value = ''
    },
    // 触发取消
    onCancel() {
      this.suggestList = []
    },
    // 搜索关键词发生变化
    onChange(e) {
      this.value = e.detail.trim()

      if (e.detail.trim().length <= 0) {
        this.suggestList = []
        return
      }
      this.getSuggestList(e.detail)
    },
    // 点击搜索详情列表
    goGoodsDetail(goodsId) {
      wepy.navigateTo({
        url: '/pages/goods_detail/main?goods_id=' + goodsId
      })
    },
    // 点击TAG标签，导航到商品列表页面
    goGoodsList(query) {
      wepy.navigateTo({
        url: '/pages/goods_list?query=' + query
      })
    },
    // 点击清除按钮，清除历史记录
    clearHistory() {
      wepy.setStorageSync('kw', [])
      this.kwList = []
    }
  }

  computed = {
    // 是否展示搜索历史区域
    isShowHistory() {
      if (this.value.length <= 0) {
        return true
      }
      return false
    }
  }

  // 获取搜索建议列表
  async getSuggestList(searchStr) {
    const { data: res } = await wepy.get('/goods/qsearch', { query: searchStr })
    console.log(res)
    if (res.meta.status !== 200) {
      return wepy.baseToast()
    }

    this.suggestList = res.message
    this.$apply()
  }
}
