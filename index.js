'use strict';
let request = require('request');
let requestUrls = require('request-urls');
let authKeys = require('auth');

let listsUrl = requestUrls.getRequestUrl('lists');

// Request settings, example - https://a.wunderlist.com/api/v1/tasks?list_id=150029475
let requesBody = {
 url: listsUrl,
 // Заголовки
 headers: authKeys
};



// Sent reques and getting lists.
request(requesBody, (error, response, body) => {

 if (!error && response.statusCode == 200) {

// Парсим ответ, получаем массив из объетов-списков
let answerJSON = JSON.parse(body);
let allListsId = [];
let urlForReques = [];


	let promise = new Promise((resolve, reject) => {
	// Получаем массив с идентификаторами от каждого списка.
	answerJSON.forEach((item, index, array) => {
		allListsId.push(item.id);
	});
	resolve(allListsId);
	})

	promise.then((allListsId) => {
		let tasksRequests = [];

		allListsId.forEach(function (elem) {
			// Для каждого идентификатора создаем ссылку-запрос.
			tasksRequests.push(requestUrls.getRequestUrl('tasks', elem));
		})
		return tasksRequests;
	}).then((tasksRequests) => {
		//
		let requesBody = {};
		// Добавляем в тело зпроса штуки для авторизации.
		requesBody.headers = authKeys;

		tasksRequests.forEach((link) => {
			// Добавляем в тело зпроса урл
			requesBody.url = link;
			// Делам запрос для каждой ссылки.
			request(requesBody, (error, response, body) => {
				let responseJSON = JSON.parse(body);
					responseJSON.forEach((elem) => {
					// Выводим в консоль все таски.
					process.stdout.write(elem.title + '\n');
				})
			})
		})
	})
 }
});
