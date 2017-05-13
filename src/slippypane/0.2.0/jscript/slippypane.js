/*==========================================================================

@package	SlippyPane
@author 	Evgeny Somkin <esomkin@gmail.com>
@license: 	MIT License (MIT)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

========================================================================= */

(function (root, factory) {

	'use strict';

	if (typeof module === 'object' 
		&& module.exports) {

		module.exports = factory();

	} else if (typeof define === 'function' 
		&& define.amd) {

		define([], factory);

	} else {

		root.SlippyPane = factory(root);
  }

} (this, function (root) {

	'use strict';

	function SlippyPane (selector) {

		if (!(this instanceof SlippyPane)) {

			return new SlippyPane(selector);
        }

       	_init.call(this, selector);

		return this;
	}

	var proto = SlippyPane.prototype;

	var config = {

		ns: 'slippy',
		class: {

			pane: 'pane',
			anim: 'anim',
			open: 'open',
			l: 'l',
			r: 'r',
			o: 'o'
		}
	}

	var _cache = {};
	
	var _pane = null;
	var _call = null;

	function _className (name) {

		if (!config.class.hasOwnProperty(name)) return;

		return [config.ns, config.class[name]].join('-');
	}

	function _class (name) {

		return ['.', _className(name)].join('');
	}

	function _init (selector) {

		selector = selector || _class('pane');

		var slippyArray = document.querySelectorAll(selector);

		if (!slippyArray) {

			throw new Error('It seem`s element (selector `' + selector + '`) doesn`t present in DOM');
		}

		for (var i = 0, count = slippyArray.length; i < count; i ++) {

			var slippy = slippyArray[i];
			var id = slippy.id;
			
			if (_cache.hasOwnProperty(id)) {

				_pane = id;
				continue;
			}

			slippy.addEventListener('click', function (event) {
				
				var target = event.target;

				if (target.classList.contains(_className('pane'))
					&& !target.classList.contains(_className('anim'))) {

					event.preventDefault();

					var id = target.id;

					return this.get(id).close();
				}

			}.bind(this));

			slippy.addEventListener('transitionend', function (event) {

				var target = event.target;
				var parent = target.parentElement;

				parent.classList.remove(_className('anim'));

				if (!parent.classList.contains(_className('open'))) {

					var plane = parent.querySelector(_class('o'));
					plane.classList.remove(_className('o'));

					document.body.classList.remove('overflow');
				}

				if (_call) {

					_call.call(this);
					_call = null;
				}

			}.bind(this));

			_cache[id] = slippy;
			_pane = id;
		}
	}

	function get (id) {

		if (!_cache.hasOwnProperty(id)) {

			throw new Error('It seem`s element with id `' + id + '` does not present in cache');
		}

		_pane = id;

		return this;
	}

	/*
	* @options { index, callback }
	* 
	* side: side
	* index: layer index
	* callback: callback function
	*/

	function open (options) {

		var slippy = _cache[_pane];

		var options = options || {};
		var side = options.side || 'l';
		var index = options.index || 0;
		var callback = options.callback || null;

		if (callback) {

			_call = callback;
		}

		document.body.classList.add('overflow');

		var plane = slippy.querySelectorAll(_class(side))[index];
		plane.classList.add(_className('o'));

		slippy.classList.add(_className('anim'), _className('open'));
		
		return this;
	}

	/*
	* @options { callback }
	* 
	* callback: callback function
	*/

	function close (options) {

		var slippy = _cache[_pane];

		var options = options || {};
		var callback = options.callback || null;

		if (callback) {

			_call = callback;
		}

		slippy.classList.add(_className('anim'));
		slippy.classList.remove(_className('open'));

		return this;
	}

	var version = '0.2.0';

	proto.version 	= version;
	proto.config 	= config;
	proto.get 		= get;
	proto.open 		= open;
	proto.close 	= close;

	return SlippyPane;	
}));