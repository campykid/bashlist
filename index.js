'use strict';
let requestUrls = require('./lib/request-urls.js');
let authKeys = require('./lib/auth.js');
let syncRequest = require('sync-request');
let listsUrl = requestUrls.getRequestUrl('lists');

// Request settings, example - https://a.wunderlist.com/api/v1/tasks?list_id=150029475
let requesBody = {
	url: listsUrl,
};

let getIdsRequstFunc = () => {
	let ids = [];
	let response = syncRequest('GET', requesBody.url, { 'headers': authKeys })

	var parseAnswer = JSON.parse(response.getBody().toString())

	parseAnswer.forEach((list) => {
		ids.push(list.id)
	})

	next(null, ids)

}

let getTasksRequests = (ids) => {

	let tasksRequests = [];

	ids.forEach(function (id) {
		// For each ID make a link-request.
		tasksRequests.push(requestUrls.getRequestUrl('tasks', id));
	})

	next(null, tasksRequests)

}

let getAllLinks = (tasksRequests) => {

	let requesBody = {};
	let links = [];

	tasksRequests.forEach((link) => {
		links.push(link);
	})
	next(null, links);
};

let getAllTitles = (links) => {
	let allTitles = [];
	let JSONAnswer = [];

	links.forEach((link) => {
		// Doing requst for all links.
		var respond = syncRequest('GET', link, { 'headers': authKeys })

		JSONAnswer.push(JSON.parse(respond.getBody().toString()));
	});



	JSONAnswer.forEach((array) => {
		array.forEach((task) => {
			allTitles.push(task.title);
		})
	})

	next(null, allTitles);
}

let printToConsole = (allTitles) => {
	allTitles.forEach((title) => {
		process.stdout.write(title + '\n');
	})
}

//sync executing all the functions.
let allFuncArray = [
	getIdsRequstFunc,
	getTasksRequests,
	getAllLinks,
	getAllTitles,
	printToConsole
];

let next = (err, result) => {
	if (err) { throw err };

	let currentTask = allFuncArray.shift();

	if (currentTask) {
		currentTask(result);
	};
}

next();
