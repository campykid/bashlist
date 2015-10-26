var request = require('request');

var options = {
  url: 'https://a.wunderlist.com/api/v1/tasks?list_id=150029475',
  headers: {
    "X-Access-Token": "8d5596e05ed8de4c4eb5a9654fe5673c98b437f0d7cce23b730e97f0dbdb",
    "X-Client-ID": "94a0ac48561078fd5530",
  },
};




request(options, function (error, response, body) {
    //console.log(error);

  if (!error && response.statusCode == 200) {
    console.log( JSON.parse(body)[0].title)
  }
})



// curl -H "X-Access-Token: 8d5596e05ed8de4c4eb5a9654fe5673c98b437f0d7cce23b730e97f0dbdb" -H "X-Client-ID: 94a0ac48561078fd5530" a.wunderlist.com/api/v1/lists
