function MouseHandler( drawboard ) {
	var $this = this;
	
	this.cursor = new Array();
	this.cursorsHidden = false;
	this.drawboard = drawboard;

	this.color = "#FF0000";
	this.missClickProtection = 1;

	this.calibrate = function () {
		var w = 10;
		alert( this.drawboard.center.str() );
		var pos = this.drawboard.center.translate_( -100, -100 );
		var ref = this.drawboard.paper.rect( pos.x - w, pos.y - w, 2 * w, 2 * w );
		ref.attr( "fill", "#F00" );
		ref.attr( "stroke", "none" );
		
		var q = 30;
		var r = 1;
		
		for ( var x = - w; x <= + w; x++ ) {
			for ( var y = - w; y <= + w; y++ ) {
				var pixel = this.drawboard.paper.rect( ( x + q ) * r, ( y + q ) * r, r, r );
				pixel.attr('fill', ( x + y ) % 2 == 0 ? '#000' : '#666');
				pixel.attr( "stroke", "none" );
			}
		}
		
		for ( var x = - q; x <= + q; x++ ) {
			for ( var y = - q; y <= + q; y++ ) {
				// var check = ( x + y ) %  2 == 0;
				if ( this.elementFromPoint( new Pos( pos.x + x, pos.y + y ) ) != ref.node ) continue;
				var pixel = this.drawboard.paper.rect( ( x + q ) * r, ( y + q ) * r, r, r );
				pixel.attr( "fill", '#0F0' );
				pixel.attr( "stroke", "none" );
			}
		}
	};
	
	this.getCursorPosition = function( e, div ) {
	    var x;
	    var y;
	    if (e.pageX != undefined && e.pageY != undefined) {
	    	x = e.pageX;
	    	y = e.pageY;
	    }
	    else {
	    	x = e.clientX + document.body.scrollLeft +
	                document.documentElement.scrollLeft;
	    	y = e.clientY + document.body.scrollTop +
	                document.documentElement.scrollTop;
	    }
	    
	    return new Pos( x - div.offset().left, y - div.offset().top );
	};

	this.elementFromPoint = function ( pos )
	{
	    if(!document.elementFromPoint) return null;

	    var x = pos.x + this.drawboard.paperDiv.offset().left - $(document).scrollLeft();
	    var y = pos.y + this.drawboard.paperDiv.offset().top - $(document).scrollTop();

	    return this.drawboard.paper.getElementByPoint( x, y ).node;	    
		return document.elementFromPoint(x,y);
	};

	this.calculateCursorPosition = function( pos, n, i ) {
		return pos.rot_( 360 * i / n, this.drawboard.center );		
	};
	
	this.isGoodClick = function( posOriginal, n ) {
		if ( this.missClickProtection == 1 ) {
			var shapeIndex = -1;
			
			for ( var i = 0; i < n; i++ ) {
				var node = this.elementFromPoint( this.calculateCursorPosition( posOriginal, n, i ) );
				
				var el = $(node).data('element');
				if ( el == null || typeof el == 'undefined' || typeof el.jc_shapeIndex == 'undefined') return false;
				
				if ( i == 0 ) {
					shapeIndex = el.jc_shapeIndex;
				} else {
					if ( shapeIndex != el.jc_shapeIndex ) return false;
				}
			}
		}
		
		return true;
	};
	
	this.canvasSimClicks = function( posOriginal, n ) {
		// First we check if this click is even in an element at all
		if ( ! $(this.elementFromPoint( posOriginal ) ).data('element') ) return;
		
		if ( ! this.isGoodClick( posOriginal, n ) ) {
			this.drawboard.tip( l.draw_missclick, 2500 );
			return;
		}
			
		for ( var i = 0; i < n; i++ ) {
			var el = this.elementFromPoint( this.calculateCursorPosition( posOriginal, n, i ) );
			if ( el != null && $(el).data('paint') ) $(el).data('paint').call( el );
		}
	};
	
	this.hideCursors = function() {
		for ( var i = 0; i < this.cursorRepeat; i++ ) this.cursor[i].hide();
		this.cursorsHidden = true;
	};
	
	this.showCursors = function() {
		for ( var i = 0; i < this.cursorRepeat; i++ ) this.cursor[i].show();
		this.cursorsHidden = false;
	};
	
	this.setColor = function( color ) {
		this.color = color;
		for ( var i = 0; i < this.cursorRepeat; i++ ) {
			this.cursor[i].attr( "fill", this.color );
		}
	};
	
	this.makeCursors = function() {
		for ( var i = 0; i < this.cursorRepeat; i++ ) {
			this.cursor[i] = this.drawboard.paper.circle( 0, 0, 3 );
			this.cursor[i].attr( "fill", this.color );
		}
	};
	        	    
	this.setRepeat = function( n ) {
		for ( var i = 0; i < this.cursorRepeat; i++ ) {
			if ( this.cursor[i] ) this.cursor[i].remove();
		}
		this.cursorRepeat = n;
		this.makeCursors(); 	
		this.hideCursors();
	};
	
	this.click = function( e ) {
	    var pos = this.getCursorPosition( e, this.drawboard.paperDiv );

		if ( this.cursorRepeat > 0 ) {
			this.hideCursors();
			this.canvasSimClicks( pos, this.cursorRepeat );
			this.showCursors();
		}
	};
	
	this.move = function( e ) {
	    var pos = this.getCursorPosition( e, this.drawboard.paperDiv );
		
		if ( pos.x > this.drawboard.center.x * 2 || pos.y > this.drawboard.center.y * 2 ) { 
			if ( ! this.cursorsHidden ) this.hideCursors(); 
			return; 
		}
		
		/* DBG *//*
		var n = this.cursorRepeat;
		this.hideCursors();
		if ( this.oldPos != null ) {
			for ( var i = 0; i < n; i++ ) {
				var el = $( this.elementFromPoint( this.calculateCursorPosition( this.oldPos, n, i ) ) ).data('element');
				if ( el != null ) el.attr( "fill", "#FFF" );
			}		
		}
		this.oldPos = pos.clone();
		for ( var i = 0; i < n; i++ ) {
			var el = $( this.elementFromPoint( this.calculateCursorPosition( pos, n, i ) ) ).data('element');
			if ( el != null ) el.attr( "fill", "#FF0" );
		}		
		this.showCursors();
		*/

		for ( var i = 0; i < this.cursorRepeat; i++ ) {
	       var posr = this.calculateCursorPosition( pos, this.cursorRepeat, i );
	       this.cursor[i].attr( "cx", posr.x);
	       this.cursor[i].attr( "cy", posr.y);
		}
		
	    if ( this.cursorsHidden == true ) this.showCursors();
	};

	$( drawboard.paper.canvas ).click( function( e ) { $this.click( e ); } );
	$( drawboard.paper.canvas ).disableTextSelection();
	this.setRepeat( 6 );

	$( drawboard.paper.canvas ).mouseenter(  function() { $this.showCursors(); } );
	$( drawboard.paper.canvas ).mousemove( function( e ) { $this.move( e ); } );
	$( drawboard.paper.canvas ).mouseleave( function() { $this.hideCursors(); } );

}

/**
 * Prevents click-based selectiion of text in all matched elements.
 */
jQuery.fn.disableTextSelection = function()
{
    return this.each(function()
    {
        if (typeof this.onselectstart != "undefined") // IE
        {
            this.onselectstart = function() { return false; };
        }
        else if (typeof this.style.MozUserSelect != "undefined") // Firefox
        {
            this.style.MozUserSelect = "none";
        }
        else // All others
        {
            this.onmousedown = function() { return false; };
            this.style.cursor = "default";
        }
    });
};




 