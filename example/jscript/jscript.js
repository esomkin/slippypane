document.addEventListener('DOMContentLoaded', function (event) {

	var body = document.querySelector('body');

	body.addEventListener('click', function (event) {

		event.preventDefault();

		var target = event.target;

		if (target.classList.contains('slippy-handle')) {

			var id = target.dataset.id;
			var side = target.dataset.side;
			var index = target.dataset.index;

			SlippyPane(['#', id].join('')).open({ side: side, index: index, callback: { open: function () { console.log('Callback on open'); }, close: function () { console.log('Callback on close') } } });
		}	
	})

}, false); 