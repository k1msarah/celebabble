blackbeltApp.factory('MainFactory', function ($http, $location) {
	var factory = {};
	var users = [];
	var userinfo = {};

	factory.addUser = function(info, callback){
		$http.post('/create_user', info).success(function (data){
			// users.push(data);
			// data = receipt from insert, can only use insert id
			var loggeduser = {}
			loggeduser.id = data.insertId; // Holds user id
			$http.post('/user_json', loggeduser).success(function (userinfo){
				localStorage.loggedInUser = JSON.stringify(userinfo[0]);
				$location.path('/home');
			})			
		})
	}
	factory.getQuestions = function(callback){
		$http.get('/question_json').success(function (output){
			callback(output);
		})
	}
	factory.addNewQuestion = function(info, callback){
		//info = question form details + logged in user
		$http.post('/create_question', info).success(function (output){
			$location.path('/home');
		})
	}
	factory.getOneQuestion = function(id, callback){
		$http.post('/show_question', id).success(function(output){
			callback(output);
		})
	}
	factory.addNewAnswer = function(info, callback){
		$http.post('/create_answer', info).success(function(output){
			callback(output);
		})
	}
	factory.getAllAnswers = function(id,callback){
		$http.post('/show_answer',id).success(function(output){
			callback(output);
		})
	}
	factory.addALike = function(idinfo, callback){
		var answer = {};
		answer.id = idinfo
		$http.post('/create_like', answer).success(function(output){
			callback(output);
		})
	}
	return factory;
})