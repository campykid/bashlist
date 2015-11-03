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

// Sent the reques and getting lists.
request(requesBody, (error, response, body) => {

	if (!error && response.statusCode == 200) {

		// Parse the answer, getting array from objects-lists.
		let answerJSON = JSON.parse(body);
		let allListsId = [];
		let urlForReques = [];

		let promise = new Promise((resolve, reject) => {

			// Getting the array with ID from each list.
			answerJSON.forEach((item) => {
				return allListsId.push(item.id);
			});

			resolve(Promise.all(allListsId));
		});

		promise.then((allListsId) => {
			let tasksRequests = [];

			allListsId.forEach(function (elem) {
				// For each ID make a link-request.
				tasksRequests.push(requestUrls.getRequestUrl('tasks', elem));
			})

			return Promise.all(tasksRequests);

		}).then((tasksRequests) => {
			let requesBody = {};

			// Add in the request auth info.
			requesBody.headers = authKeys;

			tasksRequests.forEach((link) => {

				// Add url in the request.
				requesBody.url = link;

				// Doing requst for all links.
				request(requesBody, (error, response, body) => {
					let responseJSON = JSON.parse(body);
					let allTasks = [];

					responseJSON.forEach((elem) => {
						// Withdraw all the tasks in console.
						process.stdout.write(elem.title + '\n');
					})
				})
			})
		}).catch(console.log.bind(console));
	} else {
		throw new Error(error);
	}
});
