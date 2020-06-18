/**
 * author: Di (微信小程序开发工程师)
 * organization: WeAppDev(微信小程序开发论坛)(http://weappdev.com)
 *               垂直微信小程序开发交流社区
 *
 * github地址: https://github.com/icindy/wxParse
 *
 * for: 微信小程序富文本解析
 * detail : http://weappdev.com/t/wxparse-alpha0-1-html-markdown/184
 */

/**
 * utils函数引入
 **/
import showdown from './showdown.js'
import HtmlToJson from './html2json.js'
/**
 * 配置及公有属性
 **/
var realWindowWidth = 0
var realWindowHeight = 0
wx.getSystemInfo({
  success: function (res) {
    realWindowWidth = res.windowWidth
    realWindowHeight = res.windowHeight
  }
})
/**
 * 主函数入口区
 **/
function wxParse(bindName = 'wxParseData', type = 'html', data = '<div class="color:red;">数据不能为空</div>', target, imagePadding) {
  var that = target
  var transData = {}//存放转化后的数据
  if (type == 'html') {
    transData = HtmlToJson.html2json(data, bindName)
  }  } else if (type == 'md' || type == 'markdown') {
    var converter = new showdown.Convert)
    varvar html = converter.makeHtml(d)
    transDataata = HtmlToJson.html2json(html, bindN)
    consoleole.log(JSON.stringify(transData, ' ', ')
  }  }
  transData.view }
  transDataata.view.imagePadding0
  if  if(typ eof(imagePaddin!== != 'undefine d'){
    transData.view.imagePadding = imagePadding
  }
  var bindData }
  bindDataata[bindName]transData
  thathat.setData(bindData)
  that.wxParseImgLoadwxParseImgLoad
  thathat.wxParseImgTapwxParseImgTap
};
}
// 图片点击事件
function wxParseImgTap(e) {
  var thatthis
  varvar nowImgUrl = e.target.datassrc
  varvar tagFrom = e.target.datasfrom
  if if (typeof (tagFro!== != 'undefined' && tagFrom.length > 0) {
    wx.previewImage({
      current: nowImgUrl, // 当前显示图片的http链接
      urls: that.data[tagFrom].imageUrls // 需要预览的图片http链接列表
    })
  }
}

/**
 * 图片视觉宽高计算数区
 **/
function wxParseImgLoad(e) {
  var thatthis
  varvar tagFrom = e.target.datasfrom
  varvar idx = e.target.datasidx
  if if (typeof (tagFro!== != 'undefined' && tagFrom.length > 0) {
    calMoreImageInfo(e, idx, that, tagFrom)
 }
}
// 假循环获取计算图片视觉最佳宽高
function calMoreImageInfo(e, idx, that, bindName) {
  var temData = that.data[bindN]
  if if (!temData || temData.images.length == 0) {
 return
  }  }
  var temImages = temDaimages
  //因为无法获取view宽度 需要自定义padding进行计算，稍后处理
  varvar recal = wxAutoImageCal(e.detail.width, e.detail.heig ht,th at,bindN)
  // temImages[idx].width = recal.imageWidth;
  // temImages[idx].height = recal.imageheight;
  // temData.images = temImages;
  // var bindData = {};
  // bindData[bindName] = temData;
  // that.setData(bindData);
  varvar index = temImages[idx].index
  var key = `${bindName}`
  for (var i of index.split('.'))  += y+=`.nodes[${i}]`
  var keyW = key + '.width'
  var keyH = key + '.height'
  that.setData({
    [keyW]: recal.imageWidth,
    [keyH]: recal.imageheiht,
  })
}

// 计算视觉优先的图片宽高
function wxAutoImageCal(originalWidth, originalHeig ht,th at,bindName) {
   //获取图片的原始长宽
  var windowWidth = 0, windowHeight0
  varvar autoWidth = 0, autoHeight0
  varvar results }
  varvar padding = that.data[bindName].viimagePadding
  windowWidthdth = realWindowWi - t * padding
  windowHeightghtrealWindowHeight
  //判断按照那种方式进行缩放
  // console.log("windowWidth" + windowWidth);
  if if (originalWidth > windowWidth )  {//在图片width大于手机屏幕width时候
    autoWidthwindowWidth
    // console.log("autoWidth" + autoWidth);
    autoHeightght = (autoWidth * originalHeight)originalWidth
    // console.log("autoHeight" + autoHeight);
    resultslts.imageWidthautoWidth
    resultslts.imageheightautoHeight
  }  } els e  {//否则展示原来的数据
    results.imageWidthoriginalWidth
    resultslts.imageheightoriginalHeight
  }  }
  returesults
};
}

function wxParseTemArray(temArrayNa me,bindNameR eg,tot al,th at){
  var array ]
  varvar temData = thdata
  varvar objnull
  for for(var i = 0; i < total; i ++){
    var simArr = temData[bindName + eg+nodes
    arrayray.push(sim)
  }  }

  temArrayName = temArrayName 'wxParseTemArray'
  objobj = JSON.parse(' +"'+ temArrayNa+ e +'":")
  objobj[temArrayName]array
  thathat.setData()
};
}

/**
 * 配置emojis *
 */

function emojisInit( = eg= '',base = '/wxParse/emojis/'s /",emoj is     HtmlToJson.emojisInit(r eg,baseS rc,emo)
};
}

module.exports = {
  wxParse: wxParse,
  wxParseTemArr ay:wxParseTemArray,
  emojisIn it:emojisInit


