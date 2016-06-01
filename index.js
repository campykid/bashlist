'use strict';
let requestUrls = require('./lib/request-urls.js');
let authKeys = require('./lib/auth.js');
let syncRequest = require('sync-request');
let listsUrl = requestUrls.getRequestUrl('lists');
let co = require('co');

co(function *(){
	// yield any promise
	let ids = yield new Promise((resolve, reject) => {
		let ids = [];
		// The example an url - https://a.wunderlist.com/api/v1/tasks?list_id=150029475
		let response = syncRequest('GET', listsUrl, { 'headers': authKeys })

		let parseAnswer = JSON.parse(response.getBody().toString())

		parseAnswer.forEach((list) => {
			ids.push(list.id)
		});
		resolve(ids)
	});

	let urls = yield new Promise((resolve, reject) => {
		resolve(ids.map(id => requestUrls.getRequestUrl('tasks', id)))
	});

	let requsts = yield new Promise((resolve, reject) => {
		resolve(urls.map(url => syncRequest('GET', url, { 'headers': authKeys }).getBody().toString()))
	});
	return requsts
}).then(requsts => {
	requsts.forEach(request => {
		console.log(request)
	})
})

// let getIdsRequstFunc = () => {
	// let ids = [];
	// // The example an url - https://a.wunderlist.com/api/v1/tasks?list_id=150029475
	// let response = syncRequest('GET', listsUrl, { 'headers': authKeys })

	// let parseAnswer = JSON.parse(response.getBody().toString())

	// parseAnswer.forEach((list) => {
	// 	ids.push(list.id)
	// })

// 	next(null, ids)
// }

// let getTasksRequests = (ids) => {

// 	let tasksRequests = [];

// 	ids.forEach(function (id) {
// 		// For each ID make a link-request.
// 		tasksRequests.push(requestUrls.getRequestUrl('tasks', id));
// 	})

// 	next(null, tasksRequests)
// }

// let getAllLinks = (tasksRequests) => {

// 	let requesBody = {};
// 	let links = [];

// 	tasksRequests.forEach((link) => {
// 		links.push(link);
// 	})
// 	next(null, links);
// };

// let getAllTitles = (links) => {
// 	let allTitles = [];
// 	let JSONAnswer = [];

// 	links.forEach((link) => {
// 		// Doing requst for all links.
// 		let respond = syncRequest('GET', link, { 'headers': authKeys })

// 		JSONAnswer.push(JSON.parse(respond.getBody().toString()));
// 	});

// 	JSONAnswer.forEach((array) => {
// 		array.forEach((task) => {
// 			allTitles.push(task.title);
// 		})
// 	})

// 	next(null, allTitles);
// }

// let giveResult = (allTitles) => {
// 	if (!module.parent) {
// 		allTitles.forEach((title) => {
// 			process.stdout.write(title + '\n');
// 		})
// 	} else {
// 		module.exports = allTitles
// 	}
// }

// //sync executing all the functions.
// let allFuncArray = [
// 	getIdsRequstFunc,
// 	getTasksRequests,
// 	getAllLinks,
// 	getAllTitles,
// 	giveResult
// ];

// let next = (err, result) => {
// 	if (err) { throw err };

// 	let currentTask = allFuncArray.shift();

// 	if (currentTask) {
// 		currentTask(result);
// 	};
// }

// next();
