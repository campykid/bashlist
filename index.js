'use strict';
let request = require('request');
let requestUrls = require('./request-urls.js');


// Скоп приложения.
let bashlit = {};



// Штуки для автаризаци - https://developer.wunderlist.com/documentation/concepts/authorization
bashlit.authKeys = {
	"X-Access-Token": "8d5596e05ed8de4c4eb5a9654fe5673c98b437f0d7cce23b730e97f0dbdb",
	"X-Client-ID": "94a0ac48561078fd5530",
};



let listsUrl = requestUrls.getRequestUrl('lists')

// Тело запроса. like - https://a.wunderlist.com/api/v1/tasks?list_id=150029475
let requesBody = {
 url: listsUrl,
 // Заголовки
 headers: bashlit.authKeys
};



// Шлем запрос к апи чтобы получить списки.
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
		requesBody.headers = bashlit.authKeys;

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
