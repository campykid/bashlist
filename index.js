const requestUrls = require('./lib/request-urls.js');
const authKeys = require('./lib/auth.js');
const listsUrl = requestUrls.getRequestUrl('lists');
const req = require('requisition');
const ramda = require('ramda');

// =============================================  our days 2017 node version 8.0.0 (node-nightly) ===========================================

async function getListsIds() {
    const requestIists = await req(listsUrl).set(authKeys);
    const lists = await requestIists.json();;
    return lists.map(list => list.id);
};

async function buildReqUrls() {
    const ids = await getListsIds();
    return ids.map(id => requestUrls.getRequestUrl('tasks', id));
};

async function getAllLists() {
    const urls = await buildReqUrls();
    const requestAllLists = await Promise.all(urls.map(async url => await req(url).set(authKeys)));
    return await Promise.all(requestAllLists.map(async list => await list.json()));
};

(async function showAllTasks(){
    const lists = await getAllLists();
    const tasks = ramda.flatten(lists.map(list => list.map(task => task.title)));
    tasks.forEach(task => console.log(task))
})();


// =============================================  interim period 2016 node version 4.5 ===========================================

//const co = require('co');
//const syncRequest = require('sync-request');
//co(function *(){
//const request = require('request');
	//// Getting all ids for  all tasks.
	//const ids = yield new Promise((resolve, reject) => request.get({url: listsUrl, headers: authKeys},
			//(err, res, body) => resolve(JSON.parse(body).map(list => list.id))));
	//// Builds urls.
	//const urls = yield new Promise((resolve, reject) => resolve(ids.map(id => requestUrls.getRequestUrl('tasks', id))));
	//// Gets data.
	//const requests = yield new Promise((resolve, reject) => resolve(urls.map(url => syncRequest('GET', url,
			//{ 'headers': authKeys }).getBody().toString())));
	//return requests
//}).then(requests => requests.forEach(answer => JSON.parse(answer).forEach(answer => console.log(answer.title))));






// ============================================= old style 2015 node version 0.12 ===========================================

// request.get({url: listsUrl, headers: authKeys}, (error, response, body) => resolve(JSON.parse(body).map(list => list.id)));

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


// next();
