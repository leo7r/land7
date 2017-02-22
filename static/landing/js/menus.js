function CircleButton( paper, x, y, fillCol, txt, click, data ) {
	this.set = paper.set();
	this.set.push( paper.circle( x, y, 30 ) );
	this.set.push( paper.circle( x, y, 23 ).attr( { "fill" : fillCol, "stroke-width" : 1, 'stoke' : 'black', 'cursor' : "pointer" } ) );
	
	this.fillCol = fillCol;
	this.click = click;
	this.data = data;
	
	var $this = this;
	if ( txt ) this.set.push( paper.text( x, y, txt ).attr( {'font-size': 10, 'fill': "#000" } ) );

	this.set.click( function() { $this.click(); } );
	this.set.attr('cursor', "pointer" );
	
	this.deselect = function() {
		this.set[0].attr('fill', 'none');		
	};
	
	this.select = function() {
		this.set[0].attr('fill', '#000');		
	};
	
	this.hide = function() { this.set.hide(); };
	this.show = function() { this.set.show(); };
	
	this.fill = function( fillCol ) { 
		this.fillCol = fillCol; 
		this.set[1].attr('fill', fillCol );
	};
	this.fillText = function( fillCol ) { 
		this.set[2].attr('fill', fillCol );
	};
	this.sizeText = function( fillCol ) { 
		this.set[2].attr('font-size', fillCol );
	};
	this.move = function( x, y ) {
		this.set.attr( { 'x' : x, 'y' : y, 'cx' : x, 'cy' : y } );		
	};
}

function ColorMenu( paper, size, x, y, colorChanged ) {
	var $this = this;
	this.size = size;

	var colorDialogDiv = $('<DIV></DIV>');
	var colorPickerDiv = $('<DIV></DIV>');
	var colorPickedDiv = $('<DIV style="float: right; width: 60px; height: 50px; margin-top: -120px"></DIV>');
	colorPickerDiv.appendTo( colorDialogDiv );
	colorPickedDiv.appendTo( colorDialogDiv );
	$('<BR clear="both"/>').appendTo( colorDialogDiv );
	this.ft = $.farbtastic( colorPickerDiv, colorPickedDiv );		
	
	this.colorDialog = colorDialogDiv.dialog( { autoOpen: false, closeText : "X", title : l.draw_pickcolor, buttons : { "OK" : function() { $this.colorPicked();  $(this).dialog('close'); } } } );

	this.x = x;
	this.y = y;
	this.paper = paper;
	this.circlesDefault = new Array();
	this.circlesCustom = new Array();
	
	this.setColor = function ( colorNew ) {
		if ( this.colorCurrent ) this.colorCurrent.deselect();
		this.colorCurrent = colorNew;
		if ( this.colorCurrent ) this.colorCurrent.select();
		if ( colorChanged ) colorChanged( colorNew.fillCol );
	};
	
	this.pickColor = function( col ) {
		this.colorDialog.dialog( 'open' );
		this.pickingColumn = col;
		this.ft.setColor( this.circlesCustom[ 3 + col ].fillCol );
	};
	
	this.colorPicked = function() {
		var colors = ColorGenerator.generate( this.ft.color );
		for ( var row = 1; row < 10; row++ ) {
			this.circlesCustom[ row * 3 + this.pickingColumn ].fill( colors[row - 1] );
		}	
	};

	this.doAction = function( header, action ) {
		if (this.opentab) this.opentab.close();
		this.opentab = header;
		this.opentab.open();
		
		if ( action == "default" ) {
			uiShowAll( this.circlesDefault );
			uiHideAll( this.circlesCustom );
		} else {
			uiHideAll( this.circlesDefault );
			uiShowAll( this.circlesCustom );
		}
	};
	
	this.paint = function() {
		
		var $this = this;
		
		var w = this.size-100;
		var h = 400; 

		var x = this.x;
		var y = this.y;
			
		paper.rect( x, y + 18, w, h-20 ).attr("fill", "#EEEEEE" );

		var headerDefault = new UiHeader( paper, x, y, w, 'Colors' );
		headerDefault.click( function() { $this.doAction( this, "default" ); } );
				
		fillStyles = [ "#FFFFFF", "#999999", "#000000", "#D18C54", "#d15e00", "#853C00", "#FF3E33", "#C32C25", "#751B16", "#F1FB4D", "#F2B741", "#EA7A2E", "#ACFF63", "#83F24B", "#5AA633", "#99FAFF", "#33F5FF", "#24ABB3", "#58BBF5", "#3D81A8", "#21465C", "#949DFF", "#2e3fff", "#202CB3", "#E6C9FF", "#B663FF", "#8046B3", "#FF00FC", "#d100b9", "#850075"];
		
		h -= 40;
		y += 30;
		
		for ( var row = 0; row < 3; row++ ) {
			for ( var col = 0; col < 10; col++ ) {
				var cx = w / 10 / 2 + w / 10 * col;
				var cy = h / 3 / 2 + h / 3 * row;
				var fillDefault = fillStyles[ row * 10 + col ];
				
				// Default color stuff
				var button = new CircleButton( this.paper, x + cx, y + cy, fillDefault, "", function() { $this.setColor( this ); } );
				this.circlesDefault.push( button );
				if ( row == 2 && col == 0 ) this.setColor( button );
			}
		}
		
		headerDefault.onclick();
	};
		
	this.getColor = function() {
		if ( this.colorCurrent ) return this.colorCurrent.fillCol;
	};
	
	this.paper = paper;
	this.colorChanged = colorChanged;
}

function CursorMenu( paper, x, y, cursorChanged ) {
	var $this = this;
	
	this.x = x;
	this.y = y;
	this.cursors = new Array();
	this.cursorCounts = [ 1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 16, 24 ];
	this.currentRepeat = 1;
	this.bg;
	
	this.setAdvisedRepeats = function ( advisedCounts ) {
		this.advisedCounts = advisedCounts;
		this.showAdvisedOnly = 1;
		this.update();
	};
	
	this.setRepeat = function( repeat ) {
		if ( this.cursors[ this.currentRepeat ] ) this.cursors[ this.currentRepeat ].deselect();
		this.currentRepeat = repeat; 
		if ( this.cursors[ this.currentRepeat ] ) this.cursors[ this.currentRepeat ].select();
		if ( this.cursorChanged ) this.cursorChanged( repeat );
	};
	
	this.paint = function() {

		var w = 150;
		var h = 210; 
		var x = this.x;
		var y = this.y;

		this.bg = paper.rect( x, y + 20, w, h-20 ).attr("fill", "#EEEEEE" );
		header = new UiHeader( paper,  x, y, w , l.draw_cursorcount );
		
		h -= 40;
		y += 30;

		for ( var row = 0; row < 4; row++ ) {
			for ( var col = 0; col < 3; col++ ) {
				var cx = w / 3 / 2 + w / 3 * col + x;
				var cy = h / 4 / 2 + h / 4 * row + y;
				var count = this.cursorCounts[ row * 3 + col ];

				// Create Circle With Number in Center
				var button = new CircleButton( this.paper, cx, cy, "#AA4444", count, function() { $this.setRepeat( this.data ); }, count ); 
				button.fillText( "#fff" ) ;
				button.sizeText( 16 );

				
				this.cursors[ count ] = button;
			}
		}
		
		this.update();
	};
	
	this.update = function() {
		var w = 150;
		var h = 160; 

		if ( this.showAdvisedOnly ) {
			for ( var i = 0; i < this.cursorCounts.length; i++ ) {
				if ( this.cursors[ this.cursorCounts[ i ] ] ) this.cursors[ this.cursorCounts[ i ] ].hide();
			}
			for ( var i = 0; i < this.advisedCounts.length; i++ ) {
				if ( this.cursors[ this.advisedCounts[ i ] ] ) {
					this.cursors[ this.advisedCounts[ i ] ].show();
					var x = w / 3 / 2 + w / 3 * ( i % 3 ) + this.x;
					var y = h / 4 / 2 + h / 4 *  parseInt( i / 3 ) + this.y + 30;
					this.bg.attr('height', h / 4 * ( parseInt( i / 3 ) + 1 ) + 20 );
					this.cursors[ this.advisedCounts[ i ] ].move( x, y);
				}
			}
		} else {
			for ( var i = 0; i < this.cursorCounts.length; i++ ) {
				if ( this.cursors[ this.cursorCounts[ i ] ] ) this.cursors[ this.cursorCounts[ i ] ].show();
			}
		}
	};

	this.paper = paper;
	this.cursorChanged = cursorChanged;
}


