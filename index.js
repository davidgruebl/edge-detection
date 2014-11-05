'use strict'

var $ = require('jquery')
var Pixastic = require('pixastic')
require('pixastic.laplace')
require('pixastic.edges')
require('pixastic.edges2')
var imagesLoaded = require('imagesloaded')

var lib = require('./lib')
var Filters = lib.Filters

function process(name, options) {
  var img = $('#pixeltastic' + require('capitalize')(name))[0]
  Pixastic.revert(img)
  Pixastic.process(img, name, options)
}

process('edges')
process('edges2')
process('laplace', {
  invert: true
})

imagesLoaded($('#orig')[0]).on('done', onImagesLoaded)
function onImagesLoaded() {
  $('#customFilter').find('canvas').each(function() {
    var clone = $('#pixeltasticLaplace').clone()[0]
    $(this)
      .hide()
      .parent()[0].insertBefore(clone, $(this)[0])
  })

  var $grayscale = $('#grayscale')
  function grayscale() {
    lib.runFilter($grayscale, Filters.grayscale)
  }

  var $sobel = $('#sobel')
  $sobel.siblings('button').click(sobel)
  function sobel() {
    lib.runFilter($sobel, function(px) {
      px = Filters.grayscale(px)
      var vertical = Filters.convoluteFloat32(px, [
        -1, -2, -1,
         0,  0,  0,
         1,  2,  1 ])
      var horizontal = Filters.convoluteFloat32(px, [
        -1, 0, 1,
        -2, 0, 2,
        -1, 0, 1 ])
      var id = Filters.createImageData(vertical.width, vertical.height)
      for (var i = 0; i < id.data.length; i += 4) {
        var v = Math.abs( vertical.data[i] )
        id.data[i] = v
        var h = Math.abs(horizontal.data[i])
        id.data[i + 1] = h
        id.data[i + 2] = (v + h) / 4
        id.data[i + 3] = 255
      }
        return id
    })
  }
  sobel()

  var $custom = $('#custom')
  $custom.siblings('button').click(custom)
  function custom() {
      var inputs = $('#customMatrix input')
      var arr = []
      for (var i = 0; i < inputs.length; i++) {
          arr.push(parseFloat(inputs[i].value))
      }
      lib.runFilter($custom, Filters.convolute, arr, true)
  }
  custom()
}
