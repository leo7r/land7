function Mandala( design ) {
	this.design = design;
	this.mandalaSet = null;
	this.border = 2;
	this.generatedByShapeIndex;
	this.modified = 0;

	this.toggleBorder = function() {
		this.border = ( this.border == 2 ) ? 0 : 2;
		this.updateBorders();
	};
	
	this.updateBorders = function() {
		if ( this.border == 2 ) {
			this.mandalaSet.attr( {'stroke':'#000', 'stroke-width':'2'} );
		} else {
			// No border
			for ( var i = 0; i < this.mandalaSet.length; i++ ) {
				this.mandalaSet[i].attr({'stroke':'none', 'stroke-width':'0'});
			}
		}
	};

	this.mandalifyLevel = function( original, levels, shapeIndex, drawboard, generated, curLevel, transformString ) {
		if ( curLevel >= 0 ) {
			// recursive: loop, calculate rotation string and recurse
			var n = levels[ curLevel ].n;
			var t = levels[ curLevel ].t * drawboard.scale;
			var a = 3.6 / n * levels[ curLevel ].a;
			
			for ( var i = 0; i < n; i++ ) {
				var r = ( 360 / n * i + a );
				var newTransformString =  "T0,-" + t + "R" + r + "," + drawboard.center.str() + transformString;
				this.mandalifyLevel( original, levels, shapeIndex, drawboard, generated, curLevel - 1, newTransformString );
			}
			
		} else {
			var copy = original.clone();

			copy.transform( transformString );

		 	copy.jc_shapeIndex = shapeIndex;
		 	copy.jc_copyNumber = generated.length;
			copy.jc_alwaysborder = original.jc_alwaysborder;
			
		 	this.mandalaSet.push( copy );
		 	generated.push( copy ); 

		 	$drawboard = drawboard;
		 	$(copy.node).data('element', copy); 
		 	
		 	$(copy.node).data('paint', function() {
			    var el = $(this).data('element');
				    
			    // Check if anything changed (for modifiaction-flag validity)
			    if ( el.attr("fill") != $drawboard.colorMenu.getColor() ) {
			    	$drawboard.mandala.modified = 1;
			    	el.attr( "fill", $drawboard.colorMenu.getColor() );			    	
			    };
		 	});
		};
	};
	
	this.mandalify = function ( original, levels, shapeIndex, drawboard ) {
		
		var generated = new Array();
		original.attr( { 'stroke':'#000', 'stroke-width':'2' } );
		
		this.mandalifyLevel( original, levels, shapeIndex, drawboard, generated, levels.length - 1, "" );
		
		this.generatedByShapeIndex[ shapeIndex ] = generated;
		original.remove();
	};

	this.drawShape = function ( shapeIndex, drawboard ) {
		var shape = this.design.shapes[ shapeIndex ];
		
		// The first level of repeats is kindof special
		var n = typeof shape.n != 'undefined' ? shape.n : 1;
		var aoffs = typeof shape.aoffs != 'undefined' ? shape.aoffs : 0;

		c = makeShape( shape, 360 / n, drawboard ); 
		if ( c == null ) return; // safeguard 
		
		var levels = [ { n: n, t: 0, a: aoffs } ];
		
		// get next levels of repeats, if any
		var l = 2;
		while ( typeof shape[ 'level_' + l + '_n'] != 'undefined' ) {
			var nx = shape[ 'level_' + l + '_n'];
			var tx = shape[ 'level_' + l + '_t'];
			var ax = shape[ 'level_' + l + '_a'];
			
			levels.push( { n: nx, t: tx, a: ax } );
			l++;
		}
		
		this.mandalify( c, levels, shapeIndex, drawboard );
	};

	this.draw = function( drawboard ) {
		this.generatedByShapeIndex = new Array();	
		this.mandalaSet = drawboard.paper.set();
		
    	for ( var shapeCounter = 0; shapeCounter < this.design.shapes.length; shapeCounter++ ) {
        	this.drawShape( shapeCounter, drawboard );
    	}
    	
    	this.size = drawboard.center.x * 2;
    	this.reset();
	};
	
	this.destroy = function() {
		this.mandalaSet.remove();
	};
	
	this.reset = function() {
		this.mandalaSet.attr('fill','#FFF');
		this.updateBorders();
	};
	
	this.getImage = function( type, api_url ) {
		getImage( type, this, api_url ); // calls function in filehandling.js
	};
	
	this.color = function ( colors ) {
		for ( var i = 0; i < this.mandalaSet.length; i++ ) {
			var shapeIndex = this.mandalaSet[i].jc_shapeIndex;
			var copyNumber = this.mandalaSet[i].jc_copyNumber;

			this.mandalaSet[i].attr('fill', colors[shapeIndex][copyNumber]);
		}
	};

	this.getColors = function () {
		result = new Array();
		for ( var i = 0; i < this.mandalaSet.length; i++ ) {
			var shapeIndex = this.mandalaSet[i].jc_shapeIndex;
			var copyNumber = this.mandalaSet[i].jc_copyNumber;
			if ( typeof ( result[shapeIndex] ) == 'undefined' ) result[shapeIndex] = new Array();
			result[shapeIndex][copyNumber] = this.mandalaSet[i].attr('fill');
		}
		return result;
	};

	this.store_v2 = function( what, type, successFunc, api_url, idUser ) {
		if ( typeof( action ) === 'undefined' ) action = 'forpost';
		if ( typeof successFunc === 'undefined' ) successFunc = function() {};
		
		var data;
		if ( what == 'design' ) {
			if ( this.design.shapes.length == 0 ) return -1;
			
			data = {
					design : JSON.stringify( this.design ),
					raphael : raphaelToJSON( this ),
			};
			url = api_url + "/design/store";
		} else {
			var colors = this.getColors();
			
			// Check if there's actually anything non-white
			var ok = false;
			for ( var i = 0; i < colors.length && ! ok; i++ ) for ( var j = 0; j < colors[i].length && ! ok; j++ ) if ( colors[i][j] != '#FFF' && colors[i][j] != '#FFFFFF' ) ok = true;
			if ( !ok ) return -1;
			
			data = {
					design : JSON.stringify( this.design ),
					settings : JSON.stringify( { border: this.border } ),
					colors : JSON.stringify( colors )
			};
			url = api_url + "/mandala/store";
		}
		
		if ( this.prevdraft ) data.prevdraft = this.prevdraft;
		data.draft = type == 'draft' ? '1' : '0';
		data.idUser = idUser;

		$mandala = this;
		$draft = type == 'draft' ? '1' : '0';
		$what = what; // pointless yet instructive
		$successFunc = successFunc; // pointless yet instructive
		$.ajax( { 
			url : url,
			dataType : 'json', 
			type : 'post', 
			data: data, 
			success: function( data ) {
				if ( data == null ) { alert('No Data'); return; }
	           	
				if ( data.status ) {
		           	if ( $draft == 1 ) {
		           		$mandala.prevdraft = data.hash ? data.hash : data.key;
		           	} else {
		           		$mandala.prevdraft = 0;
		           	}
		           	$mandala.modified = 0;
	           		$successFunc( $what, $draft, data );
		       	} else {
		           	if ( data.msg ) alert( data.msg ); 
		    	}
	        } 
		} );		
	};
}