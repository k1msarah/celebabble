var connection;
// To set up DB & table, called in server.js when connection is called
exports.setupDBAndTable = function (conn) {

    // save connection
    connection = conn;

    // If no environment variable: 
    if (!process.env.VCAP_SERVICES) {
        connection.query('CREATE DATABASE IF NOT EXISTS celebabble_db;', function (err) {
            if (err)  return console.log(err);
        });

        //Switch to 'celebabble_db' database
        connection.query('USE  celebabble_db;', function (err) {
            if (err)  return console.log(err);
        });
    }

    //setup 'users' table w/ schema
    connection.query('SHOW TABLES LIKE "users";', function (err, rows) {
        if (err) return console.log(err);

        //create table if it's not already setup
        if (rows.length == 0) {
            var sql = "" +
                "CREATE TABLE users(" +
                " idusers INT UNSIGNED NOT NULL auto_increment," +
                " name VARCHAR(50) NOT NULL default ''," +
                " u_created_at DATETIME NOT NULL default ''," +
                " u_updated_at DATETIME NOT NULL default ''," +
                " PRIMARY KEY (id)" +
                ");";

            connection.query(sql, function (err) {
                if (err) return console.log(err);
            });
        }
    });
};

// Creating users
exports.createUser = function (user, connection, callback){
    connection.query("INSERT INTO users (name, u_created_at, u_updated_at) VALUES (?, NOW(), NOW())", [user.name], callback);
}

// Show logged in user
exports.showUser = function (userid, connection, callback){
    connection.query("SELECT * FROM users WHERE idusers = ?", [userid.id], callback);
}

// Creating question
exports.createQuestion = function (question, connection, callback){
    var zero = 0;
    connection.query("INSERT INTO questions (question, description, q_created_at, q_updated_at, users_idusers, counter) VALUES (?, ?, NOW(), NOW(), ?, zero)", [question.question, question.description, question.users_id], callback);
}

// Show all questions
exports.showQuestions = function (connection, callback){
    connection.query("SELECT * FROM questions", callback);
}

// Creating answer
exports.createAnswer = function (answer, connection, callback){
    var zero = 0;
    connection.query("INSERT INTO answers (answer, likes, a_created_at, a_updated_at, questions_idquestions, users_idusers) VALUES (?, ?, NOW(), NOW(), ?, ?)", [answer.answer, zero, answer.questions_idquestions, answer.users_idusers], callback);
}

exports.commentCounter = function (info, connection){
    connection.query("UPDATE questions SET questions.counter = questions.counter + 1 WHERE questions.idquestions = ?", [info.questions_idquestions]);
}

// Show answers
exports.showAnswers = function (question, connection, callback){
    connection.query("SELECT * FROM answers JOIN users ON users.idusers = answers.users_idusers JOIN questions ON questions.idquestions = answers.questions_idquestions WHERE answers.questions_idquestions = ?", [question.questions_id], callback);
}

// Update answer to add like
exports.updateLike = function (id, connection, callback){
    connection.query("UPDATE answers SET answers.likes = answers.likes + 1 WHERE answers.idanswers = ?", [id.id], callback);
}

// Show the question
exports.showTheQuestion = function (id, connection, callback){
    connection.query("SELECT * FROM questions WHERE idquestions = ?", [id.idquestions], callback);
}