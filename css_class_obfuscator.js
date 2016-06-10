

/**
 * Объект допустимого алфавита для имени класса
 * Методы
 * 	getFirstLetter 	--- для получения первого символа имени класса
 *  getLetter 		--- для получения допустимого символа имени класса
 */
var CharMap = (function(){
	/**
	 * Приватная функция для генерации массива всех символов из заданного интервала
	 * @param  {String} start 	первый символ из интервала для генерации (включительно)
	 * @param  {String} fin   	последний символ из интервала для генерации (включительно)
	 * @return {Array}       	массив сгенерированных символов
	 */
	function genMapForInterval(start, fin) {
		var retval = [],
			finish = fin.charCodeAt(0),
			code = start.charCodeAt(0);
		while (code <= finish) {
			retval.push( String.fromCharCode(code) );
			code++;
		};
		return retval;
	}
		// количество символов разрешённых в качестве первого символа
	var firstLetterWidth = 'z'.charCodeAt('0') - 'a'.charCodeAt(0) + 1, 
		// собственно сам алфавит
		retval = [].concat( genMapForInterval('a', 'z'), '-', '_', genMapForInterval('0', '9') ),
		// в замыкании сохраняем количество символов, для ускорения работы
		width = retval.length;

	/**
	 * Функция получения первого символа имени по номеру
	 * 	Возвращается допустимый символ алфавита, получаемый по номеру --- остатку от деления 
	 * 	входного аргумента на количество допустимых символов
	 * @param  {Integer} o 	Объект, хранящий значение индекса для генерации (изменяется)
	 * @return {String}		Символ
	 */
	retval.getFirstLetter = function( o ) {
		var num = o.value % firstLetterWidth;
		o.value = Math.trunc(o.value / firstLetterWidth);
		return this[ num ];
	};

	/**
	 * Функция получения символа имени по номеру
	 * 	Возвращается допустимый символ алфавита, получаемый по номеру --- остатку от деления 
	 * 	входного аргумента на количество допустимых символов
	 * @param  {Integer} o 	Объект, хранящий значение индекса для генерации (изменяется)
	 * @return {String}		Символ
	 */
	retval.getLetter = function( o ) {
		var num = o.value % width;
		o.value = Math.trunc(o.value / width);
		return this[ num ];
	};

	return retval;
})();

/**
 * Функция для получения хеша со списком уникальных классов
 * @param  {array} data 	массив имен классов
 * @return {object}      	объект-хеш, ключи --- имена классов, значения --- null
 */
function extractClassNames(data) {
	var retval = {};
	if (data.forEach instanceof Function)
		data.forEach( function(clname) {
			if ( retval[clname] === undefined )
				retval[clname] = null;
		} );
	return retval;
}

/**
 * Функция, вычисляющая уникальную хеш-строку для каждого уникального номера
 * @param  {Integer} i 	Номер генерируемого хеша
 * @return {String}   	Сгенерированная хеш-строка
 */
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
	Object.keys(classList).forEach( function(clname, idx) {
		classList[ clname ] = genHashV2( idx ); 
	} );
	return classList;
};

