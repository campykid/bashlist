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
	getRequestUrl (type, param) {
		return param && 'https://' + this[type] + param || 'https://' + this[type]
	}


}

module.exports = requestUrls;
