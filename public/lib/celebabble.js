blackbeltApp.controller('MainController', function($scope, MainFactory, $routeParams, $location){
	
	var answers = [];

	getAllQuestions();
	getAQuestion();
	getAnswers();

	if(localStorage.length !== 0){
		$scope.logged_userinfo = JSON.parse(localStorage.loggedInUser);
	}

	$scope.loginUser = function(){
		MainFactory.addUser($scope.new_user, function(result){
		})
	}

	$scope.addQuestion = function(info){
		if($scope.new_question == undefined || $scope.new_question.question.length < 9){
			$scope.errors = {error_message: "Fields cannot be blank and min 10 characters!"};
			return;
		}
		else{
			$scope.new_question.userinfo = info;
			MainFactory.addNewQuestion($scope.new_question, function(results){
				// result returns response from add new question.
				$scope.success = {success_message: "Your question has been added!"};
			});
		}
	}

	function getAllQuestions(){
		MainFactory.getQuestions(function (output){
			$scope.questions = output;
		})
	}

	function getAQuestion(){
		MainFactory.getOneQuestion($routeParams, function (output){
			$scope.question = output[0];
		})
	}

	function getAnswers(){
		MainFactory.getAllAnswers($routeParams, function (output){
			$scope.answers = output;
		})
	}

	$scope.addAnswer = function(){
		if($scope.new_answer == undefined){
			$scope.errors = {error_message: "Fields cannot be blank"};
			return;
		}
		else{
			$scope.new_answer.userinfo = JSON.parse(localStorage.loggedInUser);
			$scope.new_answer.questionid = $routeParams;
			MainFactory.addNewAnswer($scope.new_answer, function(results){
				getAnswers();
			})
		}
	}

	$scope.addLike = function(answerid){
		MainFactory.addALike(answerid, function(results){
			getAnswers();
		})
	}

	$scope.logOut = function(){
		localStorage.clear();
		$location.path('/');
	}

})