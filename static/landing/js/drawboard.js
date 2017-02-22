function Drawboard( width , height, paperDivId, addedWidth ) {
	var $this = this;
	
	if ( typeof addedWidth === 'undefined' ) addedWidth = 400;
	
	this.height = width > height ? height : width;
	this.width = this.height;
	this.scale = this.height / 224;
	
	this.paper = Raphael( paperDivId, this.width, this.height + addedWidth );
	$('#' + paperDivId).width( this.width );
	this.paperDiv = $('#' + paperDivId);
	
	this.center = new Pos( this.height / 2, this.height / 2 );
	
	if ( typeof MouseHandler !== 'undefined' )	this.mousehandler = new MouseHandler( this );
	
	this.loadMandala = function( mandalaDesign ) {
		if ( typeof mandala != 'undefined' ) mandala.destroy();
	
		this.mandala = new Mandala( mandalaDesign );
		this.mandala.draw( this );
		
		if (this.cursorMenu) this.cursorMenu.setAdvisedRepeats( mandalaDesign.advicedRepeats );
		if (this.cursorMenu) this.cursorMenu.setRepeat( mandalaDesign.numRepeats );
	};
	
	this.loadColorMenus = function() {
		this.colorMenu = new ColorMenu( this.paper, this.width , 50, this.width, function( color ) { 
			$this.mousehandler.setColor( color );
			if ( $this.ft ) $this.ft.setColor( color );
		} );
		this.cursorMenu = new CursorMenu( this.paper, 2 * this.center.x + 40, 480, function( repeatCount ) { 
			$this.mousehandler.setRepeat( repeatCount );
		} );

		this.colorMenu.paint();
	};

	this.tip = function( msg, delay ) {

	};
}