'use strict'

var $ = require('jquery')
var Filters = require('filters')

var original = $('#orig')[0]

module.exports = function($current, filter, arg1, arg2, arg3) {
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

  var idata = Filters.filterImage(filter, original, arg1, arg2, arg3)

  $current.width(idata.width)
  $current.height(idata.height)

  $current[0]
    .getContext('2d')
    .putImageData(idata, 0, 0)

  $before.hide()
  $current.show()
  $button.text('restore')
}