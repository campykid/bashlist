'use strict';
let request = require('request');
let requestUrls = require('./lib/request-urls.js');
let authKeys = require('./lib/auth.js');

let listsUrl = requestUrls.getRequestUrl('lists');

// Request settings, example - https://a.wunderlist.com/api/v1/tasks?list_id=150029475
let requesBody = {
 url: listsUrl,
 headers: authKeys
};

let allListsId = new Promise((resolve, reject) => {

	request(requesBody, (error, response, body) => {

		if (error || response.statusCode !== 200) error ? console.error(error) : console.log('Status code = ' + resonse.response.statusCode + ' but must be == 200' );

		// Parse the answer, getting array from objects-lists.
		let answerJSON = JSON.parse(body);
		let ids =[];

		// Getting the array with ID from each list.
		answerJSON.forEach((item) => {
			return ids.push(item.id);
		});

		resolve(Promise.all(ids));
	});
});


allListsId.then(function(ids){
	let tasksRequests = [];

	ids.forEach(function (id) {
		// For each ID make a link-request.
		tasksRequests.push(requestUrls.getRequestUrl('tasks', id));
	})

	return Promise.all(tasksRequests);

}).then((tasksRequests)=>{
	let requesBody = {};

	// Add in the request auth info.
	requesBody.headers = authKeys;

	tasksRequests.forEach((link) => {

		// Add url in the request.
		requesBody.url = link;

		// Doing requst for all links.
		request(requesBody, (error, response, body) => {
			let responseJSON = JSON.parse(body);

			responseJSON.forEach((elem) => {
				// Withdraw all the tasks in console.
				process.stdout.write(elem.title + '\n');
			})
		})
	})
}).catch(console.log.bind(console));
