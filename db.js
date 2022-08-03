const { Pool } = require('pg');
// should probably switch to const Pool = require('pg').Pool
const client = new Pool({
  host: 'localhost',
  user: 'postgres',
  port: 5432,
  password: 'SDC22',
  database: 'sdc'
});

client.connect();

// GET /qa/questions

const getQuestions = async (req) => {
  var id = req.query.product_id;
  var page = req.query.page || 1;
  var count = req.query.count || 5;
  var questions = await client.query(`SELECT
questions.id AS question_id,
questions.body AS question_body,
questions.date_written AS question_date,
questions.asker_name,
questions.asker_email,
questions.helpful AS question_helpfulness,
questions.reported AS reported,
( SELECT json_agg(answer)
  FROM ( SELECT
      answers.id AS answer_id,
      answers.body AS body,
      answers.date_written AS date,
      answers.answerer_name,
      answers.helpful AS helpfulness,
      ( SELECT json_agg(item)
        FROM ( SELECT
          answers_photos.id,
          answers_photos.url
          FROM answers_photos
          WHERE answers_photos.answer_id = answers.id
            ) item
          ) AS photos
        FROM answers
        WHERE answers.question_id = questions.id
    ) answer
  ) AS answers
FROM questions
WHERE product_id = ${id} AND reported = 0;`
)
return questions;
}

// GET /qa/questions/:question_id/answers
const getSpecificAnswers = async (req) => {
  var id = req.params.question_id
  var page = req.query.page || 1;
  var count = req.query.count || 5;
  var answers = await client.query(
  `SELECT answers.id AS answer_id,
  answers.body AS body,
  answers.date_written AS date,
  answers.answerer_name,
  answers.helpful AS helpfulness,
  ( SELECT json_agg(item)
    FROM (
      SELECT answers_photos.id,
      answers_photos.url
      FROM answers_photos
      WHERE answers_photos.answer_id = answers.id
      ) item
    ) AS photos
  FROM answers
  WHERE question_id = ${id} AND reported = 0;`
  )
  return answers;
  }

const askQuestion = async (req) => {
  var body = req.body.body;
  var name = req.body.name;
  var email = req.body.email;
  var id = req.body.product_id;
  var date = Date.now();

  await client.query(
  `INSERT INTO questions (product_id, body, date_written, asker_name, asker_email, reported, helpful)
  VALUES (${id}, '${body}', ${date}, '${name}', '${email}',  0, 0);`)
}

const answerQuestion = async (req) => {
  var body = req.body.body;
  var name = req.body.name;
  var email = req.body.email;
  var id = req.body.question_id;
  var photos = req.body.photos;
  var date = Date.now();
  console.log(req.body);
  await client.query(
  `INSERT INTO answers (question_id, body, date_written, answerer_name, answerer_email, reported, helpful)
  VALUES (${id}, '${body}', ${date}, '${name}', '${email}',  0, 0);`)

  var answer_id = await client.query(`SELECT MAX(answers.id) FROM answers;`)
  answer_id = answer_id.rows[0].max;
  photos.forEach((url) => {
  client.query(
        `INSERT INTO answers_photos (url, answer_id)
        VALUES ('${url}', ${answer_id});`)
    })
};

const markQAsHelpful = async (req) => {
  await client.query(
    `UPDATE questions
    SET helpful = helpful + 1
    WHERE id = ${req.query.question_id};`
  )
}

const markAnsAsHelpful = async (req) => {
  await client.query(
    `UPDATE answers
    SET helpful = helpful + 1
    WHERE id = ${req.query.answer_id};`
  )
}

const reportQuestion = async (req) => {
  await client.query(
    `UPDATE questions
    SET reported = 1
    WHERE id = ${req.query.question_id};`
  )
}

const reportAns = async (req) => {
  await client.query(
    `UPDATE answers
    SET reported = 1
    WHERE id = ${req.query.answer_id};`
  )
}



module.exports = {
  getQuestions,
  getSpecificAnswers,
  askQuestion,
  answerQuestion,
  markQAsHelpful,
  markAnsAsHelpful,
  reportQuestion,
  reportAns
};