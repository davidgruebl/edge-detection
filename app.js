var grayscale, sobel, custom;

var img = document.getElementById( 'orig' );
var customFilterContainer = document.getElementById( 'customFilter' );
var canvas = document.createElement( "canvas" );
canvas.width = 336;
canvas.height = 336;

Pixastic.revert( document.getElementById( "pixeltasticEdge" ) );
var img = document.getElementById( "pixeltasticEdge" );
Pixastic.process( img, "edges" );

Pixastic.revert( document.getElementById( "pixeltasticEdge2" ) );
var img = document.getElementById( "pixeltasticEdge2" );
Pixastic.process( img, "edges2" );

Pixastic.revert( document.getElementById( "pixeltasticLaplace" ) );
var img = document.getElementById( "pixeltasticLaplace" );
Pixastic.process( img, "laplace", {
    invert: true
} );

function runFilter( id, filter, arg1, arg2, arg3 ) {
    var c = document.getElementById( id );
    var s = c.previousSibling.style;
    var b = c.parentNode.getElementsByTagName( 'button' )[0];
    if( b.originalText == null ) {
        b.originalText = b.textContent;
    }
    if( s.display == 'none' ) {
        s.display = 'inline';
        c.style.display = 'none';
        b.textContent = b.originalText;
    }
    else {
        var idata = Filters.filterImage( filter, img, arg1, arg2, arg3 );
        c.width = idata.width;
        c.height = idata.height;
        var ctx = c.getContext( '2d' );
        ctx.putImageData( idata, 0, 0 );
        s.display = 'none';
        c.style.display = 'inline';
        b.textContent = 'Wiederherstellen';
    }
}

img.addEventListener( 'load', function() {
    var canvases = customFilterContainer.getElementsByTagName( 'canvas' );
    for( var i = 0; i < canvases.length; i++ ) {
        var c = canvases[i];
        c.parentNode.insertBefore( img.cloneNode( true ), c );
        c.style.display = 'none';
    }

    grayscale = function() {
        runFilter( 'grayscale', Filters.grayscale );
    };

    sobel = function() {
        runFilter( 'sobel', function( px ) {
            px = Filters.grayscale( px );
            var vertical = Filters.convoluteFloat32( px,
                    [-1, -2, -1,
                        0, 0, 0,
                        1, 2, 1] );
            var horizontal = Filters.convoluteFloat32( px,
                    [-1, 0, 1,
                        -2, 0, 2,
                        -1, 0, 1] );
            var id = Filters.createImageData( vertical.width, vertical.height );
            for( var i = 0; i < id.data.length; i += 4 ) {
                var v = Math.abs( vertical.data[i] );
                id.data[i] = v;
                var h = Math.abs( horizontal.data[i] );
                id.data[i + 1] = h
                id.data[i + 2] = (v + h) / 4;
                id.data[i + 3] = 255;
            }
            return id;
        } );
    };
    sobel();

    custom = function() {
        var inputs = document.getElementById( 'customMatrix' ).getElementsByTagName( 'input' );
        var arr = [];
        for( var i = 0; i < inputs.length; i++ ) {
            arr.push( parseFloat( inputs[i].value ) );
        }
        runFilter( 'custom', Filters.convolute, arr, true );
    }
    custom();

}, false );
