# 黑马优购



## 1. 项目介绍

首页、分类、搜索、商品列表、商品详情、购物车、支付



## 2. 初始化项目

### 2.1 初始化项目

1. 运行 `wepy init standard heima_ugo` 命令，初始化小程序项目
2. 运行 `cd heima_ugo` 进入项目根目录
3. 运行 `npm install` 安装所有依赖项
4. 运行 `wepy build --watch` 命令，开启 wepy 项目的实时编译功能
5. 打开微信开发者工具，加载 wepy 项目并查看效果
6. 解决 ESLint 语法报错问题

### 2.2 梳理项目结构

1. 清理并重置 `src -> pages -> index.wpy` 首页
2. 在根目录的 `.prettierrc` 配置文件内，新增 `"semi": false` 配置，防止每次格式化代码，添加分号的问题
3. 清理并重置 `src -> app.wpy` 中的代码，将 `style` 和 `script` 标签中，不必要的代码删除掉
4. 清空 `src -> components` 和 `src -> mixins` 目录
5. 将梳理完毕后的项目，上传至码云

### 2.3 绘制 tabBar

1. 新建 `src -> pages -> tabs` 文件夹，用来存放所有 tabBar 相关的页面

2. 删除 `src -> pages -> index.wpy` 页面，并在 `tabs` 目录中，新建 `home.wpy`，`cates.wpy`，`search.wpy`，`cart.wpy`，`me.wpy` 五个 tabBar 相关的页面

3. 将页面路径，记录到 `src -> app.wpy` 文件的 `config -> pages` 节点中，示例代码如下：

   ```js
   pages: [
     'pages/tabs/home',
     'pages/tabs/cates',
     'pages/tabs/search',
     'pages/tabs/cart',
     'pages/tabs/me'
   ]
   ```

4. 新建 `src -> assets` 目录，并将素材中的 `icons` 文件夹，拷贝到项目 `src -> assets` 目录中

5. 在 `src -> app.wpy` 文件中，新增 `tabBar` 节点，并做如下配置：

   ```js
   tabBar: {
     // 选中的文本颜色
     selectedColor: '#D81E06',
     // tabBar 的列表
     list: [
       {
         // 页面路径
         pagePath: 'pages/tabs/home',
         // 显示的文本
         text: '首页',
         // 默认图标
         iconPath: '/assets/icons/home.png',
         // 选中图标
         selectedIconPath: '/assets/icons/home-active.png'
       },
       {
         pagePath: 'pages/tabs/cates',
         text: '分类',
         iconPath: '/assets/icons/cates.png',
         selectedIconPath: '/assets/icons/cates-active.png'
       },
       {
         pagePath: 'pages/tabs/search',
         text: '搜索',
         iconPath: '/assets/icons/search.png',
         selectedIconPath: '/assets/icons/search-active.png'
       },
       {
         pagePath: 'pages/tabs/cart',
         text: '购物车',
         iconPath: '/assets/icons/cart.png',
         selectedIconPath: '/assets/icons/cart-active.png'
       },
       {
         pagePath: 'pages/tabs/me',
         text: '我的',
         iconPath: '/assets/icons/my.png',
         selectedIconPath: '/assets/icons/my-active.png'
       }
     ]
   }
   ```

### 2.4 修改导航栏样式

打开 `src -> app.wpy` 文件，找到 `window` 节点，并配置如下：

```js
window: {
  // 页面背景色
  backgroundTextStyle: 'dark',
  // 导航条背景色
  navigationBarBackgroundColor: '#D81E06',
  // 导航条标题文本
  navigationBarTitleText: '黑马优购',
  // 导航条标题文字颜色
  navigationBarTextStyle: 'white'
}
```



## 3. 首页

### 3.1 为异步 API 启用 Promise 功能

1. 打开 `src -> app.wpy` 文件

2. 找到 constructor() 构造函数

3. 在构造函数的最后，新增如下代码：

   ```js
   constructor() {
       super()
       this.use('requestfix')
       // 通过下面这一行代码，可以为异步的API，
       // 开启Promise功能，这样，异步API调用的结果，返回值是Promise对象
       this.use('promisify')
   }
   ```

### 3.2 轮播图数据渲染

1. 获取轮播图数据

   ```js
     // 获取轮播图数据的函数
   async getSwiperData() {
       const { data: res } = await wepy.get('/home/swiperdata')
   
       if (res.meta.status !== 200) {
         return wepy.baseToast()
       }
   
       this.swiperList = res.message
       this.$apply()
   }
   ```

2. 使用 `wepy.showToast()` 弹框提示

3. 使用 `swiper` 组件和 `swiper-item` 组件渲染轮播图效果

4. 使用 `navigator` 组件将 `images` 图片包裹起来，从而点击图片实现跳转

   ```xml
   <!-- 轮播图区域 -->
   <swiper circular indicator-dots>
     <swiper-item wx:for="{{swiperList}}" wx:key="index">
       <navigator url="{{item.navigator_url}}" open-type="{{item.open_type}}">
         <image src="{{item.image_src}}" />
       </navigator>
     </swiper-item>
   </swiper>
   ```

5. 设置 `swiper` 组件的高度为 `350rpx` 从而实现轮播图在不同屏幕的自适应

   ```less
   swiper {
     height: 350rpx;
     navigator,
     image {
       height: 100%;
       width: 750rpx;
     }
   }
   ```

### 3.3 获取首页分类选项数据

```js
  // 获取首页分类相关的数据项
async getCateItems() {
    const { data: res } = await wepy.get('/home/catitems')

    if (res.meta.status !== 200) {
      return wepy.baseToast()
    }

    this.cateItems = res.message
    this.$apply()
}
```

### 3.4 渲染分类数据项对应的UI结构

```xml
<!-- 分类区域 -->
<view class="cates">
  <block wx:for="{{cateItems}}" wx:key="index">
    <navigator url="/pages/tabs/cates" open-type="{{item.open_type}}" wx:if="{{item.navigator_url !== undefined}}" hover-class="none">
      <image src="{{item.image_src}}" />
    </navigator> 

    <image src="{{item.image_src}}" wx:else/>
  </block>
</view>
```

### 3.5 美化分类数据项的UI显示效果

```less
.cates {
  display: flex;
  justify-content: space-around;
  margin: 40rpx 0;
  image {
    width: 128rpx;
    height: 140rpx;
  }
}
```

### 3.6 获取楼层相关的数据

```js
onLoad() {
    this.getSwiperData()
    this.getCateItems()
    // 在页面加载完成后，自动获取楼层数据
    this.getFloorData()
}

// 获取楼层相关的数据
async getFloorData() {
    const { data: res } = await wepy.get('/home/floordata')

    if (res.meta.status !== 200) {
      return wepy.baseToast()
    }

    this.floorData = res.message
    // 通知页面，data中数据发生了变化，需要强制页面重新渲染一次
    this.$apply()
}
```

### 3.7 渲染楼层UI结构

```xml
<!-- 楼层区域 -->
<view class="floor-container">
  <view class="floor-item" wx:for="{{floorData}}" wx:key="index">
    <!-- 楼层的标题 -->
    <image class="floor-item-title" src="{{item.floor_title.image_src}}"/>
    <!-- 楼层的图片 -->
    <view class="floor-img-box">
      <image class="floor-item-pic" wx:for="{{item.product_list}}" wx:key="index" src="{{item.image_src}}" style="width: {{item.image_width}}rpx;" @tap="goGoodsList({{item.navigator_url}})"/>
    </view>
  </view>
</view>
```

### 3.8 美化楼层UI结构

```less
.floor-container {
  .floor-item {
    .floor-item-title {
      height: 50rpx;
      width: 640rpx;
      display: block;
    }
    .floor-img-box {
      .floor-item-pic {
        float: left;
        height: 190rpx;
        margin: 8rpx;
        margin-top: 0;
        &:nth-child(1) {
          height: 390rpx;
        }
      }
    }
  }
}
```

### 3.9 点击楼层图片跳转到商品列表页面

```js
methods = {
    // 点击楼层中的每一张图片，都要跳转到商品列表页面
    goGoodsList(url) {
      wepy.navigateTo({
        url
      })
    }
}
```



## 4. 优化

### 4.1 把页面的业务逻辑抽离到单独的 `mixin` 文件中

为了精简每个小程序页面的代码，可以将 script 中的业务逻辑，抽离到对应的 mixin 文件中，具体步骤：

1. 在 `src -> mixins` 文件夹中，新建与页面路径对应的 `.js` 文件，并初始化基本的代码结构如下：

   ```js
   import wepy from 'wepy'
   
   // 注意，必须继承自 wepy.mixin
   export default class extends wepy.mixin {}
   ```

2. 在对应的页面中，可以导入并使用对应的 mixin，具体代码如下：

   ```js
   <script>
   import wepy from 'wepy'
   // 1. 导入外界的 mixin 文件，并接受
   // @ 就代表 src 这一层路径
   import mix from '@/mixins/tabs/home.js'
   
   export default class extends wepy.page {
     // 2. 把导入的 mix 对象，挂载到 mixins 这个数据中就行
     mixins = [mix]
   }
   </script>
   ```

### 4.2 封装 `baseToast` 函数提示错误消息

1. 为了提高项目的维护性、可用性、扩展性，可以将常用的 js 逻辑，封装到 `src -> baseAPI.js` 文件中：

   ```js
   import wepy from 'wepy'
   
   /**
    * 弹框提示一个无图标的 Toast 消息
    * @str 要提示的消息内容
    */
   wepy.baseToast = function(str = '获取数据失败！') {
     wepy.showToast({
       title: str,
       // 弹框期间不会携带任何图标
       icon: 'none',
       duration: 1500
     })
   }
   ```

2. 在 `app.wpy` 中导入执行 `baseAPI.js` 文件中的代码：

   ```js
   <script>
       import wepy from 'wepy'
       import 'wepy-async-function'
       // 导入并执行 baseAPI.js 中的所有代码
       import '@/baseAPI.js'
   </script>
   ```

### 4.3 封装 `wepy.get` 函数发起get请求

在小程序项目中，需要经常发起数据请求，因此，可以将 `wepy.request()` 函数封装，在全局挂在 `wepy.get()` 函数，从而发起 Get 请求，代码如下：

```js
// src/baseAPI.js

import wepy from 'wepy'

// 请求根路径
const baseURL = 'https://www.zhengzhicheng.cn/api/public/v1'

/**
 * 发起 get 请求的 API
 * @url 请求的地址，为相对路径，必须以 / 开头
 * @data 请求的参数对象
 */
wepy.get = function(url, data = {}) {
  return wepy.request({
    url: baseURL + url,
    method: 'GET',
    data
  })
}
```

### 4.4 封装 `wepy.post` 函数发起get请求

在小程序项目中，需要经常发起数据请求，因此，可以将 `wepy.request()` 函数封装，在全局挂在 `wepy.post()` 函数，从而发起 Post 请求，代码如下：

```js
// src/baseAPI.js

import wepy from 'wepy'

// 请求根路径
const baseURL = 'https://www.zhengzhicheng.cn/api/public/v1'

/**
 * 发起 post 请求的 API
 * @url 请求的地址，为相对路径，必须以 / 开头
 * @data 请求的参数对象
 */
wepy.post = function (url, data = {}) {  
  return wepy.request({
    url: baseURL + url,
    method: 'POST',
    data
  })
}
```



## 5. 分类页面

### 5.1 自定义分类页面的编译模式

1. 点击工具栏中，编译模式的下拉菜单，选择新建编译模式
2. 填写编译模式的名称
3. 选择启动页面的路径
4. 确认添加

### 5.2 获取分类数据列表

```js
async getCateList() {
    const { data: res } = await wepy.get('/categories')

    if (res.meta.status !== 200) {
      return wepy.baseToast()
    }

    this.cateList = res.message
    this.secondCate = res.message[0].children
    this.$apply()
}
```

### 5.3 下载并安装 `vant` 小程序UI组件库

1. 访问 `vant-weapp` 的 Github 主页 https://github.com/youzan/vant-weapp
2. 点击 `Clone or Download` 按钮
3. 选择 `Download ZIP`
4. 解压下载的 `vant-weapp-dev.zip`
5. 进入解压后的目录，将 `lib` 目录重命名为 `vant`
6. 把重命名为 `vant` 的目录，复制到 `src -> assets` 目录中

### 5.4 将 vant 中的徽章组件注册为全局组件

1. 打开 `app.wpy` 文件

2. 在 `config` 节点内，新增 `usingComponents` 节点，具体代码如下：

   ```js
   config = {
       // 引用并注册全局组件
       usingComponents: {
         // 徽章组件
         'van-badge': './assets/vant/badge/index',
         'van-badge-group': './assets/vant/badge-group/index'
       }
   }
   ```

### 5.5 渲染左侧的一级分类列表结构

```xml
<van-badge-group active="{{ active }}" bind:change="onChange">
    <van-badge title="{{item.cat_name}}" wx:for="{{cateList}}" wx:key="index" />
</van-badge-group>
```

### 5.6 使用 `scroll-view` 优化左侧分类的滚动效果

```xml
<!-- 左侧的滚动视图区域 -->
<scroll-view class="left" scroll-y style="height: 200px;">
  <van-badge-group active="{{ active }}" bind:change="onChange">
    <van-badge title="{{item.cat_name}}" wx:for="{{cateList}}" wx:key="index" />
  </van-badge-group>
</scroll-view>
```

### 5.7 动态获取窗口的可用高度

```js
onLoad() {
    // 动态获取屏幕可用的高度
    this.getWindowHeight()
    this.getCateList()
}
  
    // 动态获取屏幕可用的高度
async getWindowHeight() {
    const res = await wepy.getSystemInfo()
    if (res.errMsg === 'getSystemInfo:ok') {
      this.wh = res.windowHeight
      this.$apply()
    }
}
```

### 5.8 根据一级分类的变化动态切换二级分类数据

```js
  methods = {
    onChange(e) {
      // e.detail 是点击项的索引
      // console.log(e.detail)
      this.secondCate = this.cateList[e.detail].children
    }
  }
```

### 5.9 渲染二级和三级分类的UI结构

```xml
<!-- 右侧滚动视图区域 -->
<scroll-view class="right" scroll-y style="height: {{wh}}px;">
  <!-- 循环创建二级分类 -->
  <block wx:for="{{secondCate}}" wx:key="index">
    <van-row>
      <van-col span="24" style="text-align:center;">
        <text class="cate_title" space="ensp">/  {{item.cat_name}}  /</text>
      </van-col>
    </van-row>
    <!-- 三级分类 -->
    <van-row>
      <block wx:for="{{item.children}}" wx:key="index">
        <van-col span="8" class="cell" @tap="goGoodsList({{item.cat_id}})">
          <image src="{{item.cat_icon}}" class="thumbImg" />
          <view class="thumbTitle">{{item.cat_name}}</view>
        </van-col>
      </block>
    </van-row>
  </block>
</scroll-view>
```

### 5.10 点击三级分类跳转到商品列表页面

```js
  methods = {
    // 点击跳转到商品列表页面，同时把商品分类的 cid 传递过去
    goGoodsList(cid) {
      wepy.navigateTo({
        url: '/pages/goods_list?cid=' + cid
      })
    }
  }
```



## 6. interceptor 拦截器

### 6.1 介绍 wepy 中的拦截器

可以使用WePY提供的全局拦截器对原生API的请求进行拦截。

具体方法是配置API的config、fail、success、complete回调函数。参考示例：

```js
import wepy from 'wepy';

export default class extends wepy.app {
    constructor () {
        // this is not allowed before super()
        super();
        // 拦截request请求
        this.intercept('request', {
            // 发出请求时的回调函数
            config (p) {
                // 对所有request请求中的OBJECT参数对象统一附加时间戳属性
                p.timestamp = +new Date();
                console.log('config request: ', p);
                // 必须返回OBJECT参数对象，否则无法发送请求到服务端
                return p;
            },

            // 请求成功后的回调函数
            success (p) {
                // 可以在这里对收到的响应数据对象进行加工处理
                console.log('request success: ', p);
                // 必须返回响应数据对象，否则后续无法对响应数据进行处理
                return p;
            },

            //请求失败后的回调函数
            fail (p) {
                console.log('request fail: ', p);
                // 必须返回响应数据对象，否则后续无法对响应数据进行处理
                return p;
            },

            // 请求完成时的回调函数(请求成功或失败都会被执行)
            complete (p) {
                console.log('request complete: ', p);
            }
        });
    }
}
```

### 6.2 实现数据加载期间的loading效果

打开 `app.wpy`，在 `constructor()` 构造函数中，通过拦截器实现loading效果，具体代码如下：

```js
constructor() {
    super()
    this.use('requestfix')
    // 通过这一行代码，可以为异步的API，开启Promise功能，这样，异步API调用的结果，返回值是Promise对象
    this.use('promisify')

    // 拦截器
    this.intercept('request', {
      // 发出请求时的回调函数
      config(p) {
        // 显示loading效果
        wepy.showLoading({
          title: '数据加载中...'
        })
        // 必须返回OBJECT参数对象，否则无法发送请求到服务端
        return p
      },

      // 请求成功后的回调函数
      success(p) {
        // 必须返回响应数据对象，否则后续无法对响应数据进行处理
        return p
      },

      // 请求失败后的回调函数
      fail(p) {
        // 必须返回响应数据对象，否则后续无法对响应数据进行处理
        return p
      },

      // 请求完成时的回调函数(请求成功或失败都会被执行)
      complete(p) {
        // 隐藏loading效果
        wepy.hideLoading()
      }
    })
}
```



## 7. 搜索

### 7.1 全局注册搜索组件并渲染到页面中

1. 在 `app.wpy` 中的 `config` 节点中，找到 `usingComponents` 并注册搜索组件，代码如下：

   ```js
   export default class extends wepy.app {
     config = {
         // 引用并注册全局组件
         usingComponents: {
             // 商品卡片组件
             'van-card': './assets/vant/card/index'
         }
     }
   ```

2. 在 `search.wpy` 中使用刚才注册的组件：

   ```xml
   <!-- 搜索框区域 -->
   <van-search value="{{ value }}" placeholder="请输入搜索关键词" show-action bind:change="onChange" bind:search="onSearch" bind:cancel="onCancel" />
   ```

### 7.2 根据关键字的变化动态获取搜索建议列表数据

1. 监听搜索框组件的 `bind:change="onChange"` 事件：

   ```js
   // 当搜索关键词发生变化，会触发这个事件处理函数
   onChange(e) {
         // e.detail 是变化过后最新的内容
         console.log(e.detail)
         this.getSuggestList(e.detail)
   }
   ```

2. 定义 `getSuggestList()` 函数获取搜索建议列表：

   ```js
   // 获取搜索建议列表
   async getSuggestList(searchStr) {
       const { data: res } = await wepy.get('/goods/qsearch', { query: searchStr })
   
       if (res.meta.status !== 200) {
         return wepy.baseToast()
       }
   
       this.suggestList = res.message
       this.$apply()
   }
   ```

### 7.3 解决搜索关键字为空时候的小Bug

产生 Bug 的原因，是因为用户输入关键词的 length 长度导致的，因此，可以适当修改 `onChange` 事件处理函数如下：

```js
// 当搜索关键词发生变化，会触发这个事件处理函数
onChange(e) {
      // e.detail 是变化过后最新的内容
      console.log(e.detail)
      if (e.detail.trim().length <= 0) {
        this.suggestList = []
        return
      }
      this.getSuggestList(e.detail)
}
```

### 7.4 通过Cell单元格组件渲染搜索建议列表的UI结构

1. 全局注册 `cell` 单元格相关的组件：

   ```js
   export default class extends wepy.app {
     config = {
         // 引用并注册全局组件
         usingComponents: {
             // 单元格组件
             'van-cell': './assets/vant/cell/index',
             'van-cell-group': './assets/vant/cell-group/index'
         }
     }
   ```

2. 在 `search.wpy` 页面中渲染搜索建议列表结构：

   ```xml
   <!-- 搜索的建议列表 -->
   <van-cell-group>
     <block wx:for="{{suggestList}}" wx:key="index">
       <van-cell title="{{item.goods_name}}" />
     </block>
   </van-cell-group>
   ```

### 7.5 点击搜索建议项导航到商品详情页

1. 为 `vant-cell` 组件绑定点击事件处理函数：

   ```xml
   <van-cell title="{{item.goods_name}}" @tap="goGoodsDetail({{item.goods_id}})" />
   ```

2. 定义事件处理函数，并导航到详情页面：

   ```js
   methods = {
       // ...
       // 点击搜索建议项，导航到商品详情页面
       goGoodsDetail(goods_id) {
         wepy.navigateTo({
           url: '/pages/goods_detail/main?goods_id=' + goods_id
         })
       }
   }
   ```

### 7.6 触发搜索事件后导航到商品列表页面

1. 监听 `vant-search` 组件的 `bind:search="onSearch"` 事件

2. 导航到商品详情页面：

   ```js
   // 触发了搜索
   onSearch(e) {
         // e.detail 就是最新的搜索关键字
         const kw = e.detail.trim()
         // 如果搜索关键词为空，则阻止跳转
         if (kw.length <= 0) {
           return
         }
         wepy.navigateTo({
           url: '/pages/goods_list?query=' + kw
         })
   }
   ```

### 7.7 页面加载期间读取搜索关键词列表

```js
  onLoad() {
    // 调用小程序官方提供的 getStorageSync 函数，可以从本地存储中读取数据
    const kwList = wx.getStorageSync('kw') || []
    // 将读取的数据挂载到 data 中
    this.kwList = kwList
  }
```

### 7.8 将关键词存储到Storage中

```js
// 触发了搜索
onSearch(e) {
      // e.detail 就是最新的搜索关键字
      const kw = e.detail.trim()
      if (kw.length <= 0) {
        return
      }

      // 把用户填写的搜索关键词，保存到 Storage 中
      if (this.kwList.indexOf(kw) === -1) {
        this.kwList.unshift(kw)
      }
      // 数组的 slice 方法，不会修改原数组，而是返回一个新的数组
      this.kwList = this.kwList.slice(0, 10)
      wepy.setStorageSync('kw', this.kwList)

      wepy.navigateTo({
        url: '/pages/goods_list?query=' + kw
      })
}
```

### 7.9 定义计算属性来决定是否展示历史搜索区域

```js
// 计算属性
computed = {
    // true 展示搜索历史区域
    // false 展示搜索建议区域
    isShowHistory() {
      if (this.value.length <= 0) {
        return true
      }
      return false
    }
}
```

### 7.10 绘制历史搜索头部区域的UI结构

1. 全局注册 `vant-icon` 组件：

   ```js
   export default class extends wepy.app {
     config = {
         // 引用并注册全局组件
         usingComponents: {
             // 图标
             'van-icon': './assets/vant/icon/index'
         }
     }
   ```

2. 定义历史搜索头部区域的UI结构：

   ```xml
   <!-- 历史搜索区域 -->
   <view wx:else>
     <view class="history_title">
       <text>历史搜索</text>
       <van-icon name="delete" @tap="clearHistory" />
     </view>
   </view>
   ```

2. 定义样式美化对应的UI结构：

   ```less
   .history_title {
     display: flex;
     justify-content: space-between;
     padding: 0 20rpx;
     text:nth-child(1) {
       font-size: 26rpx;
       font-weight: bold;
     }
   }
   ```

### 7.11 渲染历史搜索列表的UI结构

1. 全局注册 `vant-tag` 组件：

   ```js
   export default class extends wepy.app {
     config = {
         // 引用并注册全局组件
         usingComponents: {
             // Tag 标签
             'van-tag': './assets/vant/tag/index'
         }
     }
   ```

2. 通过循环渲染历史搜索列表的UI结构：

   ```xml
   <!-- 历史搜索区域 -->
   <view wx:else>
     <view class="history_title">
       <text>历史搜索</text>
       <van-icon name="delete" @tap="clearHistory" />
     </view>
     <view class="history_body">
       <van-tag size="large" wx:for="{{kwList}}" wx:key="index" class="tag" @tap="goGoodsList({{item}})">{{item}}</van-tag>
     </view>
   </view>
   ```

2. 通过样式美化 `vant-tag` 组件的样式：

   ```less
   .tag {
     > view {
       margin: 15rpx;
     }
   }
   ```



## 8. 商品列表

### 8.1 处理请求参数

1. 在 `goods_list.js` 中定义 `data` 节点，并定义对应的请求参数：

   ```js
   data = {
       // 查询关键词
       query: '',
       // 商品分类的Id
       cid: '',
       // 页码值
       pagenum: 1,
       // 每页显示多少条数据
       pagesize: 10
   }
   ```

2. 在 `onLoad()` 生命周期函数中，处理 `query` 和 `cid` 的值，并发起数据请求：

   ```js
   onLoad(options) {
       this.query = options.query || ''
       this.cid = options.cid || ''
       this.getGoodsList()
   }
   ```

### 8.2 获取商品列表数据

```js
// 获取商品列表数据
async getGoodsList(cb) {
    const { data: res } = await wepy.get('/goods/search', {
      query: this.query,
      cid: this.cid,
      pagenum: this.pagenum,
      pagesize: this.pagesize
    })

    if (res.meta.status !== 200) {
      return wepy.baseToast()
    }

    this.goodslist = res.message.goods
    this.total = res.message.total
    this.$apply()
}
```

### 8.3 循环渲染商品列表的UI结构

1. 全局注册 `vant-card` 组件：

   ```js
   export default class extends wepy.app {
     config = {
         // 引用并注册全局组件
         usingComponents: {
             // 商品卡片组件
             'van-card': './assets/vant/card/index'
         }
     }
   ```

2. 循环渲染商品列表对应的UI结构：

   ```xml
   <!-- 商品列表区域 -->
   <block wx:for="{{goodslist}}" wx:key="index">
     <van-card num="{{item.goods_number}}" price="{{item.goods_price}}" title="{{item.goods_name}}" thumb="{{ item.goods_small_logo }}" />
     <!-- 分割线 -->
     <view class="sep_line"></view>
   </block>
   ```

3. 美化分割线的样式：

   ```less
   .sep_line {
     border-top: 1rpx solid #eee;
   }
   ```

### 8.4 初步实现上拉加载更多的操作

1. 在 `goods_list.wpy` 中配置上拉加载更多的距离：

   ```js
   <script>
   import wepy from 'wepy'
   import mix from '@/mixins/goods_list.js'
   
   export default class extends wepy.page {
     // 注意：config 节点只能写到页面的JS中，不能抽离到 mixin 中
     config = {
       navigationBarTitleText: '商品列表',
       // 上拉触底的距离，默认是 50px
       onReachBottomDistance: 100
     }
   
     mixins = [mix]
   }
   </script>
   ```

2. 在 `goods_list.js` 中监听上拉触底的事件：

   ```js
   // 触底操作
   onReachBottom() {
       console.log('触底了')
       this.pagenum++
       this.getGoodsList()
   }
   ```

3. 新旧数据拼接合并：

   ```js
   // 获取商品列表数据
     async getGoodsList(cb) {
       // ...
       this.goodslist = [...this.goodslist, ...res.message.goods]
       // ...
     }
   ```

### 8.5 通过公式判断列表数据是否全部加载完毕

1. 判断数据是否加载完毕的公式为：

   ```js
   当前页码值 * 每页显示的数据条数 >= 总数据条数
   pagemun * pagesize >= total
   ```

2. 优化 `onReachBottom()` 函数的业务处理逻辑：

   ```js
   // 触底操作
   onReachBottom() {
       // 先判断是否有下一页的数据
       if (this.pagenum * this.pagesize >= this.total) {
         return
       }
       console.log('触底了')
       this.pagenum++
       this.getGoodsList()
   }
   ```

### 8.6 通过 `isover` 控制数据加载完毕后的提示消息

1. 在 data 中定义 `isover` 布尔值：

   ```js
   data = {
       // ...
       // 数据是否加载完毕的布尔值，默认为 false
       isover: false
   }
   ```

2. 当所有数据加载完毕之后，把 `isover` 的值重置为 `true`：

   ```js
   if (this.pagenum * this.pagesize >= this.total) {
         this.isover = true
         return
   }
   ```

3. 在页面上，渲染数据加载完毕之后的UI结构，并通过 `isover` 控制其显示与隐藏：

   ```xml
   <!-- 数据加载完毕后的提示消息 -->
   <view class="over_line" hidden="{{!isover}}">-------- 我是有底线的 --------</view>
   ```

4. 美化 `over_line` 的样式：

   ```less
   .over_line {
     font-size: 24rpx;
     text-align: center;
     height: 60rpx;
     line-height: 60rpx;
     color: #ddd;
   }
   ```

### 8.7 通过 `isloading` 防止重复发起数据请求

1. 在 data 中定义 `isloading` 布尔值：

   ```js
   data = {
       // ...
       // 表示当前数据是否正在请求中
       isloading: false
   }
   ```

2. 优化 `getGoodsList()` 函数：

   ```js
   // 获取商品列表数据
   async getGoodsList(cb) {
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
   
       this.goodslist = [...this.goodslist, ...res.message.goods]
       this.total = res.message.total
       // 当数据请求完成后，将 isloading 重置为 false
       this.isloading = false
       this.$apply()
   }
   ```

3. 优化 `onReachBottom()` 函数：

   ```js
   // 触底操作
   onReachBottom() {
       // 判断当前是否正在请求数据中，
       // 如果 isloading 值为 true，则 return 从而终止后续操作，防止重复发起数据请求
       if (this.isloading) {
         return
       }
       // ...
   }
   ```

### 8.8 下拉刷新

1. 在 `goods_list.wpy` 中启用 `下拉刷新` 和设置 `下拉刷新窗口的背景色` ：

   ```js
   export default class extends wepy.page {
     // 注意：config 节点只能写到页面的JS中，不能抽离到 mixin 中
     config = {
       // ...
   
       // 开启下拉刷新
       enablePullDownRefresh: true,
       // 设置下拉刷新窗口的背景色
       backgroundColor: '#eee'
     }
   
     mixins = [mix]
   }
   </script>
   ```

2. 在 `goods_list.js` 中监听下拉刷新的事件处理函数：

   ```js
   // 下拉刷新的操作
   onPullDownRefresh() {
       // 初始化必要的字段值
       this.pagenum = 1
       this.total = 0
       this.goodslist = []
       this.isover = this.isloading = false
   
       // 重新发起数据请求
       this.getGoodsList()
   }
   ```

3. 在 `getGoodsList()` 函数中，当数据请求完成后，手动调用API关闭下拉刷新效果：

   ```js
     // 获取商品列表数据
     async getGoodsList(cb) {
   	// ...
   
       this.goodslist = [...this.goodslist, ...res.message.goods]
       this.total = res.message.total
       this.isloading = false
       this.$apply()
       // 当数据请求成功后，立即关闭下拉刷新效果
       wepy.stopPullDownRefresh()
     }
   ```

### 8.9 通过 callback 回调函数优化关闭下拉刷新的行为

1. 优化 `onPullDownRefresh` 中的代码，在调用 `getGoodsList()` 函数时，把停止下拉刷新的代码，以回调函数的形式传递进去，示例代码如下：

   ```js
     // 下拉刷新的操作
     onPullDownRefresh() {
       // 初始化必要的字段值
       this.pagenum = 1
       this.total = 0
       this.goodslist = []
       this.isover = this.isloading = false
   
       // 重新发起数据请求
       this.getGoodsList(() => {
         // 停止下拉刷新的行为
         wepy.stopPullDownRefresh()
       })
     }
   ```

2. 优化 `stopPullDownRefresh()` 中的代码如下：

   ```js
     // 获取商品列表数据
     async getGoodsList(cb) {
   	// ...
       this.$apply()
       // 只有当外界传递了 cb 回调函数之后，才调用 cb()
       cb && cb()
     }
   ```

### 8.10 点击商品列表Item项导航到商品详情页

1. 为商品列表中的每个 Item 项绑定点击事件处理函数：

   ```js
   <van-card @tap="goGoodsDetail({{item.goods_id}})" />
   ```

2. 定义事件处理函数，导航到商品详情页面：

   ```js
   methods = {
       // 点击跳转到商品详情页面
       goGoodsDetail(goods_id) {
         wepy.navigateTo({
           url: '/pages/goods_detail/main?goods_id=' + goods_id
         })
       }
   }
   ```



## 9. 商品详情

### 9.1 获取商品详情数据

1. 在 `data` 中定义需要的数据节点：

   ```js
   data = {
       // 商品的Id值
       goods_id: '',
       // 商品的详情
       goodsInfo: {}
   }
   ```

2. 在 `onLoad` 生命周期函数中，转存商品Id，并发起数据请求：

   ```js
   onLoad(options) {
       // 转存商品Id
       this.goods_id = options.goods_id
       // 发起数据请求
       this.getGoodsInfo()
   }
   ```

3. 定义 `getGoodsInfo` 函数，发起数据请求：

   ```js
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
   }
   ```

### 9.2 渲染商品详情页的轮播图

1. 绘制UI结构：

   ```xml
   <!-- 商品轮播图区域 -->
   <swiper indicator-dots circular>
     <block wx:for="{{goodsInfo.pics}}" wx:key="index">
       <swiper-item>
         <image src="{{item.pics_big}}"></image>
       </swiper-item>
     </block>
   </swiper>
   ```

2. 美化样式：

   ```less
   swiper {
     height: 750rpx;
     image {
       width: 100%;
       height: 100%;
     }
   }
   ```

### 9.3 绘制价格名称运费区域

1. 绘制对应的UI结构：

   ```xml
   <!-- 商品信息区域 -->
   <view class="goods_info">
     <!-- 价格、名称、运费 -->
     <view class="box1">
       <view class="price">￥{{goodsInfo.goods_price}}</view>
       <view class="goods_name">
         <view class="left">{{goodsInfo.goods_name}}</view>
         <view class="right">
           <van-icon name="star-o"></van-icon>
           <view>收藏</view>
         </view>
       </view>
       <view class="yunfei">快递：免运费</view>
     </view>
   </view>
   ```

2. 通过样式美化价格名称运费区域：

   ```less
   .goods_info {
     .sep_line {
       border-bottom: 15rpx solid #efefef;
     }
     .box1 {
       padding: 0 10rpx;
       .price {
         font-size: 40rpx;
         color: red;
         margin: 20rpx 0;
       }
       .goods_name {
         display: flex;
         justify-content: space-between;
         .left {
           font-size: 26rpx;
           padding-right: 40rpx;
         }
         .right {
           width: 200rpx;
           text-align: center;
           border-left: 1rpx solid #eee;
           > view {
             font-size: 20rpx;
           }
         }
       }
       .yunfei {
         font-size: 26rpx;
         color: #666;
         font-weight: bold;
         line-height: 80rpx;
       }
     }
   }
   ```

### 9.4 绘制促销已选区域

1. 绘制对应的UI结构：

   ```xml
   <!-- 促销已选区域 -->
   <view class="box2">
       <!-- 促销 -->
       <view>
         <text>促销</text>
         <text>满300元减30元</text>
       </view>
       <!-- 已选 -->
       <view>
         <text>已选</text>
         <text>黑色/S/1件</text>
       </view>
   </view>
   <view class="sep_line"></view>
   ```

2. 通过样式美化促销已选区域：

   ```less
   .box2 {
       font-size: 24rpx;
       padding: 0 10rpx;
       > view {
         line-height: 80rpx;
         text:nth-child(1) {
           margin-right: 20rpx;
         }
         text:nth-child(2) {
           color: #666;
         }
       }
   }
   ```

### 9.5 绘制收货地址区域

1. 绘制对应的UI结构：

   ```xml
   <!-- 收货地址区域 -->
   <view class="box3" @tap="chooseAddress">
       <view>
         <text>送至</text>
         <text>{{addressStr}}</text>
       </view>
       <van-icon name="arrow"></van-icon>
   </view>
   <view class="sep_line"></view>
   ```

2. 通过样式美化收货地址区域：

   ```less
   .box3 {
       display: flex;
       justify-content: space-between;
       font-size: 24rpx;
       padding: 25rpx 10rpx 25rpx 10rpx;
       > view {
         text:nth-child(1) {
           margin-right: 20rpx;
         }
         text:nth-child(2) {
           color: #666;
         }
       }
   }
   ```

### 9.6 注册并使用标签页组件

1. 在 `app.wpy` 中注册对应的组件：

   ```js
   usingComponents: {
       // ...
       // tab 标签页
       'van-tab': './assets/vant/tab/index',
       'van-tabs': './assets/vant/tabs/index'
   }
   ```

2. 通过`标签页组件`，在详情页面上渲染商品详情区域：

   ```xml
   <!-- 商品详情区域 -->
   <van-tabs>
         <van-tab title="图文详情">
           图文详情
         </van-tab>
         <van-tab title="规格参数" class="tab2">
           规格参数
         </van-tab>
   </van-tabs>
   ```

### 9.7 渲染规格参数面板的UI结构

1. 通过 for 循环，渲染对应的UI结构：

   ```xml
   <van-tab title="规格参数" class="tab2">
       <block wx:for="{{goodsInfo.attrs}}" wx:key="index">
         <van-row>
           <!-- 参数名 -->
           <van-col span="10">{{item.attr_name}}</van-col>
           <!-- 参数值 -->
           <van-col span="14">{{item.attr_value}}</van-col>
         </van-row>
       </block>
   </van-tab>
   ```

2. 美化样式：

   ```less
   .tab2 {
     font-size: 24rpx;
     .van-row {
       border-top: 1rpx solid #eee;
       .van-col {
         padding: 25rpx 0 25rpx 10rpx;
         &:nth-child(1) {
           border-right: 1rpx solid #eee;
         }
       }
     }
   }
   
   .van-tabs {
     z-index: 0;
   }
   
   .goods_detail_container {
     padding-bottom: 50px !important;
   }
   ```

### 9.8 渲染图文详情面板

1. 全局注册 `wxparse` 组件：

   ```js
   usingComponents: {
       // ...
       // 把 HTML 代码转换为 WXML 代码的插件
       wxparse: './assets/wxparse/wxparse'
   }
   ```

2. 在详情页使用 `wxparse` 组件：

   ```xml
   <van-tab title="图文详情">
       <wxparse data="{{goodsInfo.goods_introduce}}"></wxparse>
   </van-tab>
   ```

### 9.9 实现轮播图预览效果

1. 为轮播图中的每一张图片，绑定点击事件处理函数：

   ```xml
   <image src="{{item.pics_big}}" @tap="preview({{item.pics_big}})"></image>
   ```

2. 在事件处理函数中，调用 `wepy.previewImage()` 函数，实现轮播图预览效果：

   ```js
   methods = {
       // 点击预览图片
       preview(current) {
         wepy.previewImage({
           // 所有图片的路径
           urls: this.goodsInfo.pics.map(x => x.pics_big),
           // 当前默认看到的图片
           current: current
         })
       }
   }
   ```

### 9.10 选择收获地址

1. 给收货地址对应的 `view` 组件，绑定点击事件处理函数：

   ```xml
   <!-- 收货地址区域 -->
   <view class="box3" @tap="chooseAddress"></view>
   ```

2. 通过 `wepy.chooseAddress()` 函数，选择收货地址：

   ```js
   // 获取用户的收货地址
   async chooseAddress() {
         const res = await wepy.chooseAddress().catch(err => err)
   
         if (res.errMsg !== 'chooseAddress:ok') {
           return wepy.baseToast('获取收货地址失败！')
         }
   
         this.addressInfo = res
         // 将选择的收获地址，存储到本地 Storage 中
         wepy.setStorageSync('address', res)
         this.$apply()
   }
   ```

### 9.11 通过计算属性动态渲染收货地址

1. 定义计算属性节点：

   ```js
   computed = {
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
   ```

2. 在页面上渲染对应的收货地址：

   ```xml
   <!-- 收货地址区域 -->
   <view class="box3" @tap="chooseAddress">
       <view>
         <text>送至</text>
         <text>{{addressStr}}</text>
       </view>
       <van-icon name="arrow"></van-icon>
   </view>
   ```

### 9.12 全局注册并使用商品导航组件

1. 在 `app.wpy` 中全局注册 `商品导航组件`：

   ```js
   usingComponents: {
       // ...
       // 商品导航区域
       'van-goods-action': './assets/vant/goods-action/index',
       'van-goods-action-icon': './assets/vant/goods-action-icon/index',
       'van-goods-action-button': './assets/vant/goods-action-button/index'
   }
   ```

2. 在详情页中使用 `商品导航组件`：

   ```xml
   <!-- 商品导航区域 -->
   <van-goods-action>
         <van-goods-action-icon icon="chat-o" text="客服" />
         <van-goods-action-icon icon="cart-o" text="购物车" url="/pages/tabs/cart" link-type="switchTab" />
         <van-goods-action-button text="加入购物车" type="warning" />
         <van-goods-action-button text="立即购买" />
   </van-goods-action>
   ```

### 9.13 客服功能

1. 为客服按钮，添加 `open-type` 属性：

   ```xml
   <van-goods-action-icon icon="chat-o" text="客服" open-type="contact" />
   ```

2. 登录小程序后台，在 `功能 -> 客服` 面板中，可以**维护客服人员列表**，也可以**登录网页端客服**，为用户提供客服服务。



## 10. 加入购物车

### 10.1 为加入购物车按钮绑定单击事件处理函数

1. 为 `加入购物车` 按钮，绑定单击事件处理函数：

   ```xml
   <van-goods-action-button text="加入购物车" type="warning" bind:click="addToCart" />
   ```

2. 在 `methods` 中定义对应的事件处理函数：

   ```js
   // 点击按钮，把商品添加到购物车列表中
   addToCart() {
     // 获取到当前商品的所有信息
     console.log(this.goodsInfo)
     // 提示用户加入购物车成功
     wepy.showToast({
       title: '已加入购物车',
       icon: 'success'
     })
   }
   ```

### 10.2 在`app.wpy`中定义全局共享的数据和方法

1. 在 `globalData` 中，定义全局的购物车列表：

   ```js
   // 专门存储全局共享的数据
   // 只需要通过 this.$parent.globalData 就可以拿到这个全局共享的数据对象
   globalData = {
     // 全局的购物车列表
     cart: []
   }
   ```

2. 和 `globalData` 平级，定义全局可调用的函数：

   ```js
   test() {
       console.log('ok')
   }
   ```

3. 在每个小程序页面中，可通过 `this.$parent` 访问全局的数据或函数：

   ```js
   // 点击按钮，把商品添加到购物车列表中
   addToCart() {
     // 获取到当前商品的所有信息
     // console.log(this.goodsInfo)
     console.log(this.$parent.globalData)
     console.log(this.$parent)
     // 提示用户加入购物车成功
     wepy.showToast({
       title: '已加入购物车',
       icon: 'success'
     })
   }
   ```

### 10.3 把商品详情直接存储到购物车中

1. 点击加入购物车按钮时候，直接调用全局函数：

   ```js
   // 点击按钮，把商品添加到购物车列表中
   addToCart() {
     // ...
     this.$parent.addGoodsToCart(this.goodsInfo)
     // ...
   }
   ```

2. 在 `app.wpy` 中，定义全局函数 `addGoodsToCart()` 如下：

   ```js
   // 把商品，添加到购物车列表中
   addGoodsToCart(goods) {
     this.globalData.cart.push(goods)
   }
   ```

### 10.4 优化商品对象存储到购物车中的过程

1. 在将商品添加至购物车期间，不需要用到商品的所有属性，因此可以有选择地将需要的属性，梳理为一个新对象，保存到购物车列表中，具体代码如下：

   ```js
   // 把商品，添加到购物车列表中
   addGoodsToCart(goods) {
       // 梳理出来的商品信息对象
       const info = {
         // 商品Id
         id: goods.goods_id,
         // 名称
         name: goods.goods_name,
         // 图片
         pic: goods.goods_small_logo,
         // 价格
         price: goods.goods_price,
         // 数量
         count: 1,
         // 是否默认被选中
         isCheck: true
       }
       // 将整理出来的商品信息对象，存储到购物车列表中
       this.globalData.cart.push(info)
   }
   ```

### 10.5 防止商品重复添加

```js
  // 把商品，添加到购物车列表中
  addGoodsToCart(goods) {
    // 先根据 Id 查找购物车列表中，是否已经存储了对应的商品信息
    // 如果查找的结果，值为 -1，证明要添加的商品不存在于购物车中，可以直接 push
    // 如果查找的结果，值不为 -1，证明要添加的商品，已存在以购物车中，此时直接更新数量即可！！！
    const i = this.globalData.cart.findIndex(x => x.id === goods.goods_id)
    if (i !== -1) {
      this.globalData.cart[i].count++
      return
    }
    // ...
  }
```

### 10.6 持久化存储购物车数据

1. 在 `app.wpy` 全局，定义函数 `saveCartToStorage()` 如下：

   ```js
   // 将购物车中的商品数据，持久化保存到本地
   saveCartToStorage() {
       wepy.setStorageSync('cart', this.globalData.cart)
   }
   ```

2. 凡是对购物车中的数据做了操作，在操作完毕后，已经要调用 `saveCartToStorage` 函数：

   ```js
   // 把商品，添加到购物车列表中
   addGoodsToCart(goods) {
       const i = this.globalData.cart.findIndex(x => x.id === goods.goods_id)
       if (i !== -1) {
         this.globalData.cart[i].count++
         this.saveCartToStorage()
         return
       }
       console.log(goods)
       // 梳理出来的商品信息对象
       const info = {
         // 商品Id
         id: goods.goods_id,
         // 名称
         name: goods.goods_name,
         // 图片
         pic: goods.goods_small_logo,
         // 价格
         price: goods.goods_price,
         // 数量
         count: 1,
         // 是否默认被选中
         isCheck: true
       }
       // 将整理出来的商品信息对象，存储到购物车列表中
       this.globalData.cart.push(info)
       this.saveCartToStorage()
   }
   ```

3. 在小程序启动的 `onLaunch()` 生命周期函数中，加载 `storage` 中的数据，并赋值给购物车列表：

   ```js
   onLaunch() {
       console.log('小程序启动了')
       this.globalData.cart = wepy.getStorageSync('cart') || []
   }
   ```

### 10.7 自定义编译模式并美化空白购物车的页面结构

1. 将购物车页面，添加为新的自定义编译模式

2. 将 `素材` 中的 `cart_empty@2x.png` 图片，拷贝到 项目的 `src/assets/images` 目录中

3. 打开 `cart.wpy` 页面，渲染对应的UI结构：

   ```xml
   <template>
     <view>
       <!-- 空白的购物车 -->
       <view class="empty_cart">
         <image src="/assets/images/cart_empty@2x.png" />
         <view>哎呦，购物车是空的噢~</view>
       </view>
       <!-- 非空的购物车 -->
     </view>
   </template>
   ```

4. 在 `cart.wpy` 的 `style` 节点中，美化空白购物车的样式效果：

   ```less
   <style lang="less">
   .empty_cart {
     font-size: 26rpx;
     color: #666;
     text-align: center;
     padding-top: 200rpx;
     image {
       width: 180rpx;
       height: 180rpx;
     }
   }
   </style>
   ```




## 11. 购物车

### 11.1 实现空白购物车和非空购物车的按需展示

1. 定义购物车私有数据：

   ```js
   data = {
       // 购物车商品列表
       cart: []
   }
   ```

2. 在页面加载期间，转存购物车数据到当前页面中：

   ```js
   onLoad() {
       this.cart = this.$parent.globalData.cart
   }
   ```

3. 定义计算属性：

   ```js
   computed = {
       // 判断购物车是否为空
       isEmpty() {
         if (this.cart.length <= 0) {
           return true
         }
         return false
       }
   }
   ```

4. 按需渲染页面结构：

   ```xml
   <!-- 空白的购物车 -->
   <view class="empty_cart" wx:if="{{isEmpty}}"></view>
   
   <!-- 非空的购物车 -->
   <view class="cart-container" wx:else></view>
   ```

### 11.2 渲染购物车列表标题

1. 需要用到 `van-cell` 单元格组件：

   ```xml
   <!-- 购物车标题 -->
   <van-cell title="购物车列表" icon="shop-o" />
   ```

### 11.3 循环渲染基本的商品列表结构

```xml
<!-- 购物车商品列表 -->
<block wx:for="{{cart}}" wx:key="id">
	<van-card title="{{item.name}}" thumb="{{item.pic}}"></van-card>
</block>
```

### 11.4 通过插槽自定义渲染商品的价格和数量

1. 全局注册 `van-stepper` 组件：

   ```js
   // 引用并注册全局组件
   usingComponents: {
       // Stepper 步进器
     'van-stepper': './assets/vant/stepper/index'
   }
   ```

2. 通过插槽自定义渲染价格与数量：

   ```xml
   <van-card title="{{item.name}}">
       <!-- 自定义商品的描述区域 -->
       <view slot="desc" class="desc">
         <!-- 商品的价格 -->
         <text class="price">￥{{item.price}}</text>
         <!-- 商品的数量 -->
         <van-stepper value="{{item.count}}" />
       </view>
   </van-card>
   ```

### 11.5 美化商品价格和数量区域

```less
.desc {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  bottom: 0;
  width: 100%;
  .price {
    color: red;
    font-weight: bold;
    font-size: 12px;
  }
}
```

### 11.6 数量改变时获取最新的数量值和当前商品的Id

1. 为 `van-stepper` 组件绑定事件，并通过自定义属性传参：

   ```xml
   <van-stepper value="{{item.count}}" bind:change="countChanged" data-id="{{item.id}}" />
   ```

2. 定义事件处理函数：

   ```js
   countChanged(e) {
     // 获取到变化之后最新的数量值
     const count = e.detail
     // 商品的Id值
     const id = e.target.dataset.id
   }
   ```

### 11.7 完成商品数量的更新操作

1. 在 `app.wpy` 中定义如下函数：

   ```js
   // 更新商品的数量
   updateGoodsCount(id, count) {
       const i = this.globalData.cart.findIndex(x => x.id === id)
       if (i !== -1) {
         // 根据索引值，获取到对应的那个商品，
         // 然后更新数量
         this.globalData.cart[i].count = count
         // 把更新过后的购物车数据，立即存储到Storage中
         this.saveCartToStorage()
       }
   }
   ```

2. 当数量改变时，调用这个全局函数：

   ```js
   methods = {
       // 监听商品数量变化的事件
       countChanged(e) {
         // 获取到变化之后最新的数量值
         const count = e.detail
         // 商品的Id值
         const id = e.target.dataset.id
         this.$parent.updateGoodsCount(id, count)
       }
   }
   ```

### 11.8 在商品之间渲染分割线

1. 为 `van-card` 组件添加下边框线：

   ```less
   .van-card {
     border-bottom: 1rpx solid #eee;
   }
   ```

### 11.9 通过thumb插槽渲染复选框和缩略图

1. 注册复选框组件：

   ```js
   // 引用并注册全局组件
   usingComponents: {
     // 复选框
     'van-checkbox': './assets/vant/checkbox/index'
   }
   ```

2. 渲染对应的UI结构：

   ```xml
   <van-card title="{{item.name}}">
     <!-- 自定义渲染缩略图的插槽 -->
     <view slot="thumb" class="thumb">
       <!-- 复选框 -->
       <van-checkbox value="{{ item.isCheck }}"></van-checkbox>
       <!-- 缩略图 -->
       <image src="{{item.pic}}" />
     </view>
   </van-card>
   ```

   

### 11.10. 美化复选框和缩略图的样式

```less
.van-card {
  border-bottom: 1rpx solid #eee;
  padding-left: 7px !important;
}

.thumb {
  display: flex;
  align-items: center;
  width: 118px;
  image {
    width: 90px;
    height: 90px;
    margin-left: 8px;
  }
}

.van-card__thumb {
  width: 118px !important;
}
```

### 11.11 监听复选框状态变化的事件

1. 绑定事件处理函数：

   ```xml
   <van-checkbox value="{{ item.isCheck }}" checked-color="#d81e06" bind:change="statusChanged" data-id="{{item.id}}"></van-checkbox>
   ```

2. 定义事件处理函数：

   ```js
   methods = {
       // 当商品前面的复选框，选中状态变化，会触发这个函数
       statusChanged(e) {
         // console.log(e)
         // 当前最新的选中状态
         const status = e.detail
         // 当前点击项对应的商品Id
         const id = e.target.dataset.id
       }
   }
   ```

### 11.12 修改商品的选中状态

1. 在 `app.wpy` 中定义如下函数：

   ```js
   // 更新商品的选中状态
   updateGoodsStatus(id, status) {
       const i = this.globalData.cart.findIndex(x => x.id === id)
       if (i !== -1) {
         this.globalData.cart[i].isCheck = status
         this.saveCartToStorage()
       }
   }
   ```

2. 调用全局定义的函数：

   ```js
   methods = {
       // 当商品前面的复选框，选中状态变化，会触发这个函数
       statusChanged(e) {
         // console.log(e)
         // 当前最新的选中状态
         const status = e.detail
         // 当前点击项对应的商品Id
         const id = e.target.dataset.id
         
         this.$parent.updateGoodsStatus(id, status)
       }
   }
   ```

### 11.13 初步实现滑动删除的UI效果

1. 注册 `van-swipe-cell` 组件：

   ```js
   // 引用并注册全局组件
   usingComponents: {
     // 滑动单元格组件
     'van-swipe-cell': './assets/vant/swipe-cell/index'
   }
   ```

2. 把商品卡片使用滑动单元格组件包裹起来：

   ```xml
   <van-swipe-cell right-width="{{ 65 }}" left-width="{{ 0.1 }}">
     <van-card title="{{item.name}}">
     	<!--省略不必要的代码-->
     </van-card>
     <view slot="right" class="close">删除</view>
   </van-swipe-cell>
   ```

### 11.14 美化滑动单元格右侧的删除按钮

```less
.close {
  background-color: #ff4444;
  width: 65px;
  height: 100%;
  color: white;
  font-size: 13px;
  display: flex;
  justify-content: center;
  align-items: center;
}
```

### 11.15 根据Id从购物车列表中删除对应的商品

1. 为删除按钮绑定事件处理函数：

   ```xml
   <view slot="right" class="close" @tap="close({{item.id}})">删除</view>
   ```

2. 定义事件处理函数：

   ```js
   // 点击删除对应的商品
   close(id) {
     this.$parent.removeGoodsById(id)
   }
   ```

3. 在 `app.wpy` 中定义 `removeGoodsById()` 函数如下：

   ```js
   // 根据Id删除对应的商品
   removeGoodsById(id) {
       const i = this.globalData.cart.findIndex(x => x.id === id)
       if (i !== -1) {
         this.globalData.cart.splice(i, 1)
         this.saveCartToStorage()
       }
   }
   ```

### 11.16 渲染提交订单区域的UI结构

1. 全局注册 `van-submit-bar` 组件：

   ```js
   // 引用并注册全局组件
   usingComponents: {
     // 提交订单
     'van-submit-bar': './assets/vant/submit-bar/index'
   }
   ```

2. 在页面上绘制提交订单的UI结构：

   ```xml
   <!-- 提交订单区域 -->
   <van-submit-bar price="{{ amount }}" button-text="提交订单" bind:submit="submitOrder" tip="{{ false }}">
       <!-- 全选/反选 的复选框 -->
       <van-checkbox class="fullCheck" value="{{isFullChecked}}" checked-color="#d81e06">全选</van-checkbox>
   </van-submit-bar>
   ```

3. 美化全选复选框的样式：

   ```css
   .fullCheck {
     margin-left: 7px;
   }
   ```

### 11.17 通过计算属性动态计算勾选商品的总价格

```js
// 总价格，单位是 分
amount() {
  let total = 0 // 单位是 元
  this.cart.forEach(x => {
    if (x.isCheck) {
      total += x.price * x.count
    }
  })

  return total * 100
}
```

### 11.18 通过计算属性判断全选的状态

```js
// 是否全选
isFullChecked() {
  // 获取所有商品的个数
  const allCount = this.cart.length

  let c = 0
  this.cart.forEach(x => {
    if (x.isCheck) {
      c++
    }
  })

  return allCount === c
}
```

### 11.19 点击全选更新所有商品的选中状态

1. 为全选的复选框绑定点击事件：

   ```xml
   <!-- 全选/反选 的复选框 -->
   <van-checkbox class="fullCheck" value="{{isFullChecked}}" checked-color="#d81e06" bind:change="onFullCheckChanged">全选</van-checkbox>
   ```

2. 监听全选复选框值改变的事件：

   ```js
   // 监听全选复选框值改变的事件
   onFullCheckChanged(e) {
     this.$parent.updateAllGoodsStatus(e.detail)
   }
   ```

3. 在 `app.wpy` 中定义 `updateAllGoodsStatus()` 函数：

   ```js
   // 更新购物车中每件商品的选中状态
   updateAllGoodsStatus(status) {
       this.globalData.cart.forEach(x => {
         x.isCheck = status
       })
       this.saveCartToStorage()
   }
   ```

### 11.20 为TabBar中的购物车添加数字徽章

1. 在 `app.wpy` 中定义渲染徽章的函数：

   ```js
   // 渲染购物车的徽章
   async renderCartBadge() {
       // 计算已勾选的商品数量
       let c = 0
       this.globalData.cart.forEach(x => {
         if (x.isCheck) {
           c += x.count
         }
       })
   	
       // 调用 API，将已勾选的商品数量渲染到指定的 TabBar 中
       const res = await wepy
         .setTabBarBadge({
           index: 3,
           text: c + ''
         })
         .catch(err => err)
   
       // 设置 tabBar 的徽章失败！
       if (res.errMsg !== 'setTabBarBadge:ok') {
       }
   }
   ```

2. 在 `app.wpy` 的 `onLaunch()` 生命周期函数中，调用刚才定义的函数：

   ```js
   onLaunch() {
       console.log('小程序启动了')
       this.globalData.cart = wepy.getStorageSync('cart') || []
       this.renderCartBadge()
   }
   ```

3. 在 `app.wpy` 中 `saveCartToStorage()` 的函数中，新增如下代码：

   ```js
   // 将购物车中的商品数据，持久化保存到本地
   saveCartToStorage() {
       wepy.setStorageSync('cart', this.globalData.cart)
     + this.renderCartBadge()
   }
   ```

### 11.21 为商品详情页的购物车图标添加数字徽章

1. 在 `app.wpy` 中，定义如下的全局共享数据：

   ```js
   globalData = {
       // 全局的购物车列表
       cart: [],
       // 当前购物车中已经勾选的商品数量
    +  total: 0
   }
   ```

2. 修改 `app.wpy` 中的 `renderCartBadge()` 函数：

   ```js
   // 渲染购物车的徽章
   async renderCartBadge() {
       let c = 0
       this.globalData.cart.forEach(x => {
         if (x.isCheck) {
           c += x.count
         }
       })
   
    +  // 更新全局的商品数量
    +  this.globalData.total = c
   
       const res = await wepy
         .setTabBarBadge({
           index: 3,
           text: c + ''
         })
         .catch(err => err)
   
       // 设置 tabBar 的徽章失败！
       if (res.errMsg !== 'setTabBarBadge:ok') {
       }
   }
   ```

3. 在 `src/mixins/goods_detail/main.js` 中，定义计算属性如下：

   ```js
   computed = {
       // 所有已经勾选的商品的数量
       total() {
         return this.$parent.globalData.total
       }
   }
   ```

4. 在 `src/pages/goods_detail/main.wpy` 中，修改UI结构如下：

   ```xml
   <!-- 商品导航区域 -->
   <van-goods-action>
     <!--省略其他代码-->
     <van-goods-action-icon icon="cart-o" text="购物车" url="/pages/tabs/cart" link-type="switchTab" info="{{total}}" />
     <!--省略其他代码-->
   </van-goods-action>
   ```

### 11.22 提交订单

1. 为购物车页面的 `提交订单区域` 绑定 `bind:submit` 事件处理函数：

   ```xml
   <!-- 提交订单区域 -->
   <van-submit-bar price="{{ amount }}" button-text="提交订单" bind:submit="submitOrder" tip="{{ false }}">
     <!--省略其他代码-->
   </van-submit-bar>
   ```

2. 在 `methods` 节点中新增如下处理函数：

   ```js
   // 提交订单
   submitOrder() {
     if (this.amount <= 0) {
       return wepy.baseToast('订单金额不能为空！')
     }
   
     wepy.navigateTo({
       url: '/pages/order'
     })
   }
   ```

3. 在 `src/pages` 目录中，新建 `order.wpy` 页面文件，并初始化

4. 在 `src/mixins` 目录中，新建 `order.js` 逻辑文件，并初始化

5. 将 `order.js` 导入并挂在到 `order.wpy` 中

6. 将新页面的路径，记录到 `src/app.wpy` 文件的 `config -> pages` 数组中：

   ```js
   export default class extends wepy.app {
     config = {
       pages: [
         // 省略其他不必要的代码
         // 确认订单页面
         'pages/order'
       ]
     }
   }
   ```

   

## 12. 确认订单

### 12.1 修改确认订单页面的标题

```js
<script>
import wepy from 'wepy'
import mix from '@/mixins/order.js'

export default class extends wepy.page {
  config = {
    // 设置当前页面的标题
    navigationBarTitleText: '确认订单'
  }

  mixins = [mix]
}
</script>
```

### 12.2 渲染选择收货地址区域的UI结构

1. 绘制UI结构：

   ```xml
   <!-- 选择收货地址按钮区域 -->
   <view class="choose_address_box">
     <van-button type="info" size="small">+ 选择收货地址</van-button>
   </view>
   
   <!-- 分割线 -->
   <image src="/assets/images/cart_border@2x.png" class="sep_line"></image>
   ```

2. 美化样式：

   ```less
   .choose_address_box {
     text-align: center;
     padding: 60rpx 0;
   }
   
   .sep_line {
     height: 7px;
     width: 100%;
     display: block;
   }
   ```

### 12.3 选择收货地址

1. 为选择收货地址按钮绑定点击事件处理函数：

   ```xml
   <van-button type="info" size="small" @tap="chooseAddress">+ 选择收货地址</van-button>
   ```

2. 在 `methods` 中定义事件处理函数：

   ```js
   // 选择收货地址
   async chooseAddress() {
     const res = await wepy.chooseAddress().catch(err => err)
   
     if (res.errMsg !== 'chooseAddress:ok') {
       return
     }
   
     this.addressInfo = res
     wepy.setStorageSync('address', res)
     this.$apply()
   }
   ```

### 12.4 在订单页面加载期间读取收货地址

```js
onLoad() {
    // 读取收货地址
    this.addressInfo = wepy.getStorageSync('address') || null
}
```

### 12.5 通过计算属性控制收货地址按钮和收货人信息区域的按需显示

1. 定义计算属性：

   ```js
   computed = {
       isHaveAddress() {
         if (this.addressInfo === null) {
           return false
         }
         return true
       }
   }
   ```

2. 按需展示：

   ```xml
   <!-- 选择收货地址按钮区域 -->
   <view class="choose_address_box" wx:if="{{isHaveAddress === false}}">
     <!--省略不必要的代码-->
   </view>
   
   <!-- 收货人信息区域 -->
   <view class="address_box" wx:else>
     <!--省略不必要的代码-->
   </view>
   ```

### 12.6 渲染并美化收货信息区域

1. 渲染收货信息区域的UI结构：

   ```xml
   <!-- 收货人信息区域 -->
   <view class="address_box" wx:else>
     <!-- 收货人，联系电话 -->
     <view class="box1">
       <text>收货人：{{addressInfo.userName}}</text>
       <view @tap="chooseAddress">
         <text>联系电话：{{addressInfo.telNumber}}</text>
         <van-icon name="arrow" />
       </view>
     </view>
     <!-- 收货地址 -->
     <view class="box2">收货地址：{{addressStr}}</view>
   </view>
   ```

2. 美化样式：

   ```less
   .address_box {
     font-size: 26rpx;
     padding: 0 10rpx;
     .box1 {
       display: flex;
       justify-content: space-between;
       padding: 30rpx 0;
     }
     .box2 {
       padding-bottom: 30rpx;
     }
   }
   ```

### 12.7 点击联系电话区域重新选择收货地址

```xml
<!-- 收货人，联系电话 -->
<view class="box1">
    <text>收货人：{{addressInfo.userName}}</text>
    <view @tap="chooseAddress">
      <text>联系电话：{{addressInfo.telNumber}}</text>
      <van-icon name="arrow" />
    </view>
</view>
```

### 12.8 渲染订单商品列表

1. 渲染结构：

   ```xml
   <!-- 商品列表 -->
   <view class="goods_list">
     <block wx:for="{{cart}}" wx:key="id">
       <van-card num="{{item.count}}" price="{{item.price}}" title="{{item.name}}" thumb="{{item.pic}}" />
     </block>
   </view>
   ```

2. 美化样式：

   ```less
   .van-card {
     border-bottom: 1rpx solid #eee;
   }
   ```

### 12.9 渲染登录后下单的按钮

1. 在 `app.wpy` 中全局注册按钮组件：

   ```js
   // 引用并注册全局组件
   usingComponents: {
     // 按钮组件
     'van-button': './assets/vant/button/index'
   }
   ```

2. 渲染按钮区域

   ```xml
   <!-- 登录后下单 -->
   <van-button type="primary" size="large" class="btnLogin">登录后下单</van-button>
   ```

3. 美化样式：

   ```less
   .btnLogin {
     position: fixed;
     bottom: 0;
     width: 100%;
   }
   
   .order_container {
     padding-bottom: 50px;
   }
   ```

   

## 13. 订单支付

### 13.1 准备登录相关的参数 - 获取用户信息

1. 为登录按钮设置 `open-type` 和 `bindgetuserinfo` 属性：

   ```xml
   <!-- 登录后下单 -->
   <van-button type="primary" size="large" class="btnLogin" open-type="getUserInfo" bindgetuserinfo="getUserInfo">登录后下单</van-button>
   ```

2. 定义事件处理函数 `getUserInfo`，并通过形参接收用户信息：

   ```js
   methods = {
       // 获取用户信息
       async getUserInfo(userInfo) {
         // 判断是否获取用户信息失败
         if (userInfo.detail.errMsg !== 'getUserInfo:ok') {
           return wepy.baseToast('获取用户信息失败！')
         }
   
         console.log(userInfo)
       }
   }
   ```

### 13.2 准备登录相关的参数 - 获取用户登录凭证

1. 在 `getUserInfo` 处理函数中，新增如下代码：

   ```js
     // 获取用户登录的凭证 Code
     const loginRes = await wepy.login()
     console.log(loginRes)
     if (loginRes.errMsg !== 'login:ok') {
       return wepy.baseToast('微信登录失败！')
     }
   
     // 登录的参数
     const loginParams = {
       code: loginRes.code,
       encryptedData: userInfo.detail.encryptedData,
       iv: userInfo.detail.iv,
       rawData: userInfo.detail.rawData,
       signature: userInfo.detail.signature
     }
   ```

### 13.3 实现登录功能并得到登录成功后的Token值

1. 在 `getUserInfo` 处理函数中，新增如下代码：

   ```js
     // 发起登录的请求，换取登录成功之后的 Token 值
     const { data: res } = await wepy.post('/users/wxlogin', loginParams)
   
     console.log(res)
     if (res.meta.status !== 200) {
       return wepy.baseToast('微信登录失败！')
     }
   
     // 把登录成功之后的 Token 字符串，保存到 Storage 中
     wepy.setStorageSync('token', res.message.token)
     this.islogin = true
     this.$apply()
   ```

### 13.4 按需渲染订单支付区域

1. 通过 `wx:if` 和 `wx:else` 按需渲染 `登录按钮` 和 `订单支付` 区域：

   ```xml
   <!-- 登录后下单 -->
   <van-button type="primary" size="large" class="btnLogin" open-type="getUserInfo" bindgetuserinfo="getUserInfo" wx:if="{{islogin === false}}">登录后下单</van-button>
   
   <!-- 订单支付区域 -->
   <van-submit-bar price="{{amount}}" button-text="支付订单" bind:submit="onSubmit" wx:else></van-submit-bar>
   ```

### 13.5 通过拦截器为header请求头添加Authorization字段

1. 打开 `app.wpy` 文件，找到 `constructor` 构造函数中定义的拦截器，从而自定义 header 请求头：

   ```js
   constructor() {
       // ...
       
       // 拦截器
       this.intercept('request', {
             // 发出请求时的回调函数
         config(p) {
           // 显示loading效果
           wepy.showLoading({
             title: '数据加载中...'
           })
             
           // 自定义请求头
           p.header = {
             Authorization: wepy.getStorageSync('token')
           }
   
           // console.log(p)
           // 必须返回OBJECT参数对象，否则无法发送请求到服务端
           return p
         },
         
         // ...
       }
   }
   ```

### 13.6 实现下单及支付功能

1. 通过 `bind:submit` 为支付订单按钮，绑定事件处理函数：

   ```xml
   <!-- 订单支付区域 -->
   <van-submit-bar price="{{amount}}" button-text="支付订单" bind:submit="onSubmit" wx:else></van-submit-bar>
   ```

2. 定义事件处理函数 `onSubmit`，并实现下单及支付功能：

   ```js
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
       goods: this.cart.map(x => {
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
       .catch(err => err)
   
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
   ```



## 14. 订单列表

### 14.1 渲染标签页

1. 渲染UI结构：

   ```xml
   <van-tabs active="{{ active }}" bind:change="tabChanged">
     <van-tab title="全部">全部</van-tab>
     <van-tab title="待付款">待付款</van-tab>
     <van-tab title="已付款">已付款</van-tab>
   </van-tabs>
   ```

2. 在 data 中定义 active 属性值：

   ```js
   data = {
     // 默认被激活的标签页的索引
     active: 0
   }
   ```

3. 在 methods 中定义事件处理函数 `tabChanged`：

   ```js
   methods = {
       // 每当切换标签页的时候，都会触发这个函数
       tabChanged(e) {
         console.log(e)
         this.active = e.detail.index
       }
   }
   ```

### 14.2 获取订单列表数据

1. 在 data 中定义数据列表：

   ```js
   data = {
       // 默认被激活的标签页的索引
       active: 0,
       // 全部 订单列表
       allOrderList: [],
       // 待付款 订单列表
       waitOrderList: [],
       // 已付款 订单列表
       finishOrderList: []
   }
   ```

2. 在 `onLoad` 中获取订单列表数据：

   ```js
   onLoad() {
       this.getOrderList(this.active)
   }
   ```

3. 在标签页发生切换时，获取订单列表数据：

   ```js
   // 每当切换标签页的时候，都会触发这个函数
   tabChanged(e) {
     console.log(e)
     this.active = e.detail.index
     this.getOrderList(this.active)
   }
   ```

4. 定义函数 `getOrderList` 如下：

   ```js
   // 获取订单列表
   async getOrderList(index) {
       console.log(index)
       const { data: res } = await wepy.get('/my/orders/all', { type: index + 1 })
   
       if (res.meta.status !== 200) {
         return wepy.baseToast('获取订单列表失败！')
       }
   
       res.message.orders.forEach(
         x => (x.order_detail = JSON.parse(x.order_detail))
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
   ```

### 14.3 通过Panel面板渲染订单信息

1. 全局注册 `Panel` 面板组件：

   ```js
   usingComponents: {
     // Panel 面板
     'van-panel': './assets/vant/panel/index'
   }
   ```

2. 循环渲染订单信息面板：

   ```xml
   <block wx:for="{{allOrderList}}" wx:key="index">
     <view class="sep_line"></view>
       <van-panel title="{{'订单号：' + item.order_number}}">
         <block wx:for="{{item.order_detail}}" wx:key="index">
           <van-card num="{{item.count}}" price="{{item.price}}" title="{{item.name}}" thumb="{{item.pic}}" />
         </block>
         <!-- 商品件数，以及金额 -->
         <van-cell value="共{{item.total_count}}件商品，订单金额￥{{item.order_price}}" />
     </van-panel>
   </block>
   ```

3. 美化样式：

   ```less
   .sep_line {
     border-top: 15rpx solid #eee;
   }
   
   .van-card {
     border-bottom: 1rpx solid #eee;
   }
   ```

### 14.4 把订单Item项的UI结构封装为自定义组件

1. 在 `src/components` 目录中，新建组件文件 `orderItem.wpy` 如下：

   ```xml
   <template>
     <view>
       <view class="sep_line"></view>
       <van-panel title="{{'订单号：' + order.order_number}}">
         <block wx:for="{{order.order_detail}}" wx:key="index">
           <van-card num="{{item.count}}" price="{{item.price}}" title="{{item.name}}" thumb="{{item.pic}}" />
         </block>
         <!-- 商品件数，以及金额 -->
         <van-cell value="共{{order.total_count}}件商品，订单金额￥{{order.order_price}}" />
       </van-panel>
     </view>
   </template>
   
   <script>
   import wepy from 'wepy'
   
   export default class extends wepy.component {
     data = {}
   
     // 外界传递过来的数据
     props = {
       // 外界把订单数据传递过来
       order: Object
     }
   
     methods = {}
   }
   </script>
   
   <style lang="less">
   .sep_line {
     border-top: 15rpx solid #eee;
   }
   .van-card {
     border-bottom: 1rpx solid #eee;
   }
   </style>
   ```

### 14.5 通过repeat循环创建自定义组件

1. 在 `orderlist.wpy` 中，导入自定义的组件：

   ```js
   import orderItem from '@/components/orderItem'
   ```

2. 注册自定义组件：

   ```js
   // 注册自定义组件
   components = {
     'order-item': orderItem
   }
   ```

3. 通过 `WePY` 官方提供的辅助组件 `<repeat>` 循环创建自定义组件：

   ```xml
   <van-tabs active="{{ active }}" bind:change="tabChanged">
     <van-tab title="全部">
       <!-- repeat 组件并不是微信官方提供的，而是 WePY 框架提供的 -->
       <repeat for="{{allOrderList}}" key="index">
         <order-item :order="item"></order-item>
       </repeat>
     </van-tab>
     <van-tab title="待付款">
       <repeat for="{{waitOrderList}}" key="index">
         <order-item :order="item"></order-item>
       </repeat>
     </van-tab>
     <van-tab title="已付款">
       <repeat for="{{finishOrderList}}" key="index">
         <order-item :order="item"></order-item>
       </repeat>
     </van-tab>
   </van-tabs>
   ```



## 15. 发布小程序

1. 在 `微信开发者工具` 的工具栏中，点击 `上传` 按钮，填写 `版本号` 和 `项目备注`，将最新的小程序项目代码，上传为 **开发版本**
2. 登录到自己的 `微信小程序后台主页`，点击 `管理 -> 版本管理`
3. 点击 `开发版本` 面板内的 `提交审核` 按钮，填写相关内容后，将最新的 `开发版本` 提交为 **审核版本**，由腾讯官方进行审核，审核过程需要等待若干天
4. 当腾讯官方审核通过之后，可以将审核通过的小程序，提交发布为 **线上版本**，供所有微信用户进行使用
5. 注意：只有 **线上版本** 才能被普通微信用户正常访问和使用，**开发版本** 和 **审核版本** 无法被普通用户访问和使用！