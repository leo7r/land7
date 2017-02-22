function Pos( x, y ) {
	this.x = x;
	this.y = y;
	
	this.rot = function( degree, center ) {
		if ( typeof center != 'undefined' ) this.translate( -center.x, -center.y );
	    var a = Math.PI / 180 * degree;
	    var xrot = (this.x * Math.cos(a)) - (this.y * Math.sin(a));
	    var yrot = (this.x * Math.sin(a)) + (this.y * Math.cos(a));
	    this.x = xrot;
	    this.y = yrot;
	    if ( typeof center != 'undefined' ) this.translate( center.x, center.y );
	    return this;
	};
	
	this.clone = function() {
		return new Pos( this.x, this.y );
	};
	
	this.str = function( ) {
	    return "" + ( this.x  ) + "," + ( this.y  ) + " ";
	};

	this.round = function( ) {
	    this.x = Math.round( this.x );
	    this.y = Math.round( this.y );
	    return this;
	};
	
	this.scale = function( scaleX, scaleY ) {
		if ( typeof scaleY == 'undefined' ) scaleY = scaleX;
		
		this.x *= scaleX;
		this.y *= scaleY;
		return this;
	};
	
	this.translate = function( transX, transY ) {
		this.x += transX;
		this.y += transY;
		return this;
	};
	
	this.circlify = function( max_x, offs, center ) {
		if ( typeof center == 'undefined' ) center = new Pos( 0, 0 );
		x = this.x;
		this.x = center.x;
		this.rot( 360 / max_x * x + offs,  center );
		return this;
	};

	this.dist = function( p2 ) {
		return Math.sqrt( Math.pow( this.x - p2.x, 2 ) + Math.pow( this.y - p2.y, 2 ) );
	};
	
	// Short hand functions that return a copy
	this.rot_ = function( degree, center ) { return this.clone().rot( degree, center );	};
	this.translate_ = function( transX, transY ) { return this.clone().translate( transX, transY );	};
	this.scale_ = function( scaleX, scaleY ) { return this.clone().scale( scaleX, scaleY );	};
	this.round_ = function( ) { return this.clone().round();	};

}


function CurveDef( start, points ) {
	this.start = start;
	this.points = points;

	this.clone = function( firstPointIndex, lastPointIndex ) {
		if ( typeof firstPointIndex === 'undefined' ) firstPointIndex = 0;
		if ( typeof lastPointIndex === 'undefined' ) lastPointIndex = this.points.length - 1 + 1;
		
		var startPoint = firstPointIndex == 0 ? this.start : this.points[ firstPointIndex - 1 ];
		
		var clone = new CurveDef( startPoint.clone(), new Array() );
		
		for ( var i = firstPointIndex; i < lastPointIndex; i ++ ) clone.points[i - firstPointIndex] = this.points[i].clone();
		return clone;
	};
	
	this.scale = function( scaleX, scaleY ) {
		for ( var i = 0; i < this.points.length; i ++ ) this.points[i].scale( scaleX, scaleY );
		this.start.scale( scaleX, scaleY );
		return this;
	};

	this.repeat = function( n ) {
		var len = this.points.length;
		var xplus = this.points[ points.length - 1 ].x - this.start.x;
		var yplus = this.points[ points.length - 1 ].y - this.start.y;
		for ( var j = 0; j < n; j++ ) for ( var i = 0; i < len; i ++ ) this.points.push( this.points[i].translate_( xplus * ( j + 1 ), yplus * ( j + 1 ) ) );
		return this;
	};

	this.translate = function ( transX, transY ) {
		for ( var i = 0; i < this.points.length; i ++ ) this.points[i].translate( transX, transY );
		this.start.translate( transX, transY );
		return this;
	};

	this.circlify = function( r, offs, width, center ) {
		if ( typeof width === 'undefined' ) width = this.points[ this.points.length - 1 ].x - this.start.x;

		this.translate( 0, -r );
		this.start.circlify( width, offs, center );
		for ( var i = 0; i < this.points.length; i ++ ) this.points[i].circlify( width, offs, center );
		return this;
	};

	this.str = function( firstchar ) {
		if ( typeof firstchar === 'undefined' ) firstchar = "M";
		var path = firstchar + this.start.str() + " C";
		
		for ( var i = 0; i < this.points.length; i ++ ) path += this.points[i].str();
		
		return path;
	};
	
	this.fromString = function( str ) {
		var sc = str.split('C'); 
		this.start = new Pos( parseFloat(sc[0].split('M')[1].split(',')[0]), parseFloat(sc[0].split('M')[1].split(',')[1]) );
		this.points = new Array();
		for ( var i = 1; i < sc.length; i++ ) {
			var psPre = sc[i].split(/[,\ ]/g);
			var ps = new Array();
			for ( var j = 0; j < psPre.length; j++ ) if ( psPre[j] != '' ) ps.push(psPre[j]);
			for ( var j = 0; j < ps.length; j+=2 ) this.points.push( new Pos(parseFloat(ps[j]),parseFloat(ps[j+1])) );
		}
		return this;
	};
}
