'use strict';
let request = require('request');

// Скоп приложения.
let bashlit = {};



// Штуки для автаризаци - https://developer.wunderlist.com/documentation/concepts/authorization
bashlit.authKeys = {
	"X-Access-Token": "8d5596e05ed8de4c4eb5a9654fe5673c98b437f0d7cce23b730e97f0dbdb",
	"X-Client-ID": "94a0ac48561078fd5530",
};

// Урлы для запростов - https://developer.wunderlist.com/documentation
bashlit.requestUrls = {
	tasks: 'a.wunderlist.com/api/v1/tasks?list_id=',
	lists: 'a.wunderlist.com/api/v1/lists',
	getRequestUrl: function (type, param) {
		if (param) {
			let url = 'https://' + this[type] + param;
			return  url	
		} else {
			let url = 'https://' + this[type];
			return  url;
		}
	}
}

let listsUrl = bashlit.requestUrls.getRequestUrl('lists')

// Тело запроса. like - https://a.wunderlist.com/api/v1/tasks?list_id=150029475
let requesBody = {
  url: listsUrl,
  // Заголовки
  headers: bashlit.authKeys 
};



// Шлем запрос к апи чтобы получить списки.
request(requesBody, function (error, response, body) {

  if (!error && response.statusCode == 200) {

  	// Парсим ответ, получаем массив из объетов-списков
    let answerJSON = JSON.parse(body);
    let allListsId = [];
    let urlForReques = [];


	let promise = new Promise(function(resolve, reject) {
	    // Получаем массив с идентификаторами от каждого списка.
	    answerJSON.forEach(function (item, index, array) {
	    	allListsId.push(item.id);
	    });
	    resolve(allListsId);
	})

	promise.then(function (allListsId) {
		let tasksRequests = [];
		
		allListsId.forEach(function (elem) {
			// Для каждого идентификатора создаем ссылку-запрос.	
			tasksRequests.push(bashlit.requestUrls.getRequestUrl('tasks', elem));
		})
		return tasksRequests;
	}).then(function (tasksRequests) {
			//
			let requesBody = {};
			// Добавляем в тело зпроса штуки для авторизации.
			requesBody.headers = bashlit.authKeys;
			
			tasksRequests.forEach(function (link) {
				 // Добавляем в тело зпроса урл
				 requesBody.url = link;
				 // Делам запрос для каждой ссылки.
				 request(requesBody, function (error, response, body) {
				 	let responseJSON = JSON.parse(body);
				 	responseJSON.forEach(function (elem) {
				 		// Выводим в консоль все таски.
				 		process.stdout.write(elem.title + '\n');
				 	})
				 })
				 
			})
	})
  }
});





// curl -H "X-Access-Token: 8d5596e05ed8de4c4eb5a9654fe5673c98b437f0d7cce23b730e97f0dbdb" -H "X-Client-ID: 94a0ac48561078fd5530" a.wunderlist.com/api/v1/lists
