'use strict'

var $ = require('jquery')
var Filters = require('filters')

module.exports = function (id, filter, arg1, arg2, arg3) {
  var c = $('#' + id)[0]
  var s = $('#' + id).prev()[0].style
  var b = c.parentNode.getElementsByTagName('button')[0]
  if (b.originalText === null) {
    b.originalText = b.textContent
  }
  if (s.display === 'none') {
    s.display = 'inline'
    c.style.display = 'none'
    b.textContent = b.originalText
    return
  }
  var idata = Filters.filterImage(filter, img, arg1, arg2, arg3)
  c.width = idata.width
  c.height = idata.height
  var ctx = c.getContext('2d')
  ctx.putImageData(idata, 0, 0)
  s.display = 'none'
  c.style.display = 'inline'
  b.textContent = 'restore'
}