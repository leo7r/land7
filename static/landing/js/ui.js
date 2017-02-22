function UiHeader( paper, x, y, width, title ) {
	var p1 = new Pos( x + 10, y );
	var p2 = new Pos( x + width - 10, y );
	var p3 = new Pos( x + width, y + 10 );
	var p4 = new Pos( x + width, y + 20 );
	var p5 = new Pos( x, y + 20 );
	var p6 = new Pos( x, y + 10 );
	
	this.pathClosed = "M " + p1.str() + " L" + p2.str() + " A 10,10 0 0 1 " + p3.str() + " L" + p4.str() + " L" + p5.str() + " L" + p6.str() + " A 10,10 0 0 1 " + p1.str();
	this.pathOpen = "M " + p5.str() + " L" + p6.str() + " A 10,10 0 0 1 " + p1.str() + " L" + p2.str() + " A 10,10 0 0 1 " + p3.str() + " L" + p4.str();
	var r = paper.path( this.pathClosed );
	r.attr("fill", "#999999" );
	var t = paper.text(x + width / 2, y + 10, title);
	t.attr({'font-size': 16, 'fill': "#000" } );
	
	this.set = paper.set();
	this.set.push(r);
	this.set.push(t);
	this.backElement = r;
	this.textElement = t;
	this.title = title;
	
	this.click = function( handle ) {
		this.onclick = handle;
		var $this = this;
		this.set.click( function() { $this.onclick(); } );
		this.set.attr('cursor','pointer');
	};
	
	this.open = function() {
		this.backElement.attr( 'path', this.pathOpen );
		this.backElement.attr( 'fill', "#EEEEEE" );
	};

	this.close = function() {
		this.backElement.attr( 'path', this.pathClosed );
		this.backElement.attr( 'fill', "#999999" );
	};

	return this;
}

function uiAddHandler( set, handle, params ) {
	for ( var i = 0; i < set.length; i++ ) {
		for ( var key in params ) {
			set[i][key] = params[key];
		}
		
	}
	set.click( handle );
	set.attr('cursor', "pointer" );
}

/* 
 * Can be an array of sets or a set
 */
function uiHideAll( set ) {
	for ( var i = 0; i < set.length; i++ ) {
		set[i].hide();
	}
}

/* 
 * Can be an array of sets or a set
 */
function uiShowAll( set ) {
	for ( var i = 0; i < set.length; i++ ) {
		set[i].show();
	}
}