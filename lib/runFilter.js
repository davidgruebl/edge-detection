'use strict'

var $ = require('jquery')
var Filters = require('filters')

module.exports = function(id, filter, arg1, arg2, arg3) {
  var $current = $('#' + id)
  var $before = $current.prev()
  var $button = $current.siblings('button')

  var originalText = $button[0].originalText

  if (originalText) {
    originalText = $button[0].originalText = $button.text()
  }

  if ($before.css('display') === 'none') {
    $before.show()
    $current.hide()
    $button.text(originalText)
    return
  }

  var idata = Filters.filterImage(filter, $('#orig')[0], arg1, arg2, arg3)

  $current.width(idata.width)
  $current.height(idata.height)

  var ctx = $current[0].getContext('2d')
  ctx.putImageData(idata, 0, 0)

  $before.hide()
  $current.show()
  $button.text('restore')
}