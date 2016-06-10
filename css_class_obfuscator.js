
var CharMap = (function(){

	function genMapForInterval(start, fin) {
		var retval = [],
			finish = fin.charCodeAt('0'),
			code = start.charCodeAt('0');
		do {
			retval.push( String.fromCharCode(code) );
			code++;
		} while (code <= finish);
		return retval;
	}

	var firstLetterWidth = 'z'.charCodeAt('0') - 'a'.charCodeAt('0') + 1,
		retval = [].concat( genMapForInterval('a', 'z'), '-', '_', genMapForInterval('0', '9') ),
		width = retval.length;

	retval.getFirstLetter = function( o ) {
		var num = o.value % firstLetterWidth;
		o.value = Math.trunc(o.value / firstLetterWidth);
		return this[ num ];
	};
	retval.getLetter = function( o ) {
		var num = o.value % width;
		// if (this[ num ] == undefined)
		// 	console.log('Un: ', num, o.value, width);
		// console.log(width, o, num);
		o.value = Math.trunc(o.value / width);
		return this[ num ];
	};

	return retval;
})();


function extractClassNames(data) {
	var retval = {};
	if (data.forEach instanceof Function)
		data.forEach( function(clname) {
			if ( retval[clname] === undefined )
				retval[clname] = null;
		} );
	return retval;
}


function genHashV1(str) {

	var hash = 0,
		res;
	// simple hash function
	Array.prototype.forEach.call(str, function( l ) {
		hash = hash*2 + l.charCodeAt(0);
	} );
	hash = { value: hash };
	res = CharMap.getFirstLetter(hash);
	while ( hash.value > 0)
		res += CharMap.getLetter(hash);
	return res;
}

function genHashV2(i) {

	var hash = { value: i },
		res;
	res = CharMap.getFirstLetter(hash);
	while ( hash.value > 0)
		res = res + CharMap.getLetter(hash);
	return res;
}



/**
  * @param {Array} data – массив CSS классов
  */
module.exports = function(data) {
	var classList = extractClassNames(data);
	var o = {}, t;
	Object.keys(classList).sort().forEach( function(clname, idx) {
		// t = genHashV1( clname );
		t = genHashV2( idx );
		// if (! (o[t]) ) o[t] = 1;
		// 	else {
		// 		o[t]++;
		// 		console.log('D: ', clname, ' -> ', t, o[t]);
		// 	}
		classList[ clname ] = t;
	} );
	// console.log(o);
	return classList;
};

