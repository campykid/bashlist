'use strict'
// The urls for request - https://developer.wunderlist.com/documentation
let requestUrls = {
	tasks: 'a.wunderlist.com/api/v1/tasks?list_id=',
	lists: 'a.wunderlist.com/api/v1/lists',

	/**
	 * Returns urls with the necessary get parameters .
	 * 
	 * @param {string} type - Type of the request.
	 * @param {string} param - The get params.
	 */
	getRequestUrl: function (type, param) {
		if (param) {
			let url = 'https://' + this[type] + param;
			return url
		} else {
			let url = 'https://' + this[type];
			return url;
		}
	}
}

module.exports = requestUrls;
