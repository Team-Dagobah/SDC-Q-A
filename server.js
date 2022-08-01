const express = require('express');
const axios = require('axios');
const port = 3000;
const {getQuestions, getSpecificAnswers, askQuestion, answerQuestion, markQAsHelpful, markAnsAsHelpful, reportQuestion, reportAns} = require('./db.js');

const app = express();

app.use(express.json());
app.use(express.static('dist'));

app.get('/qa/questions', (req, res) => {
  getQuestions(req)
  .then((questions) => {
    console.log('got response from server');
    res.status(200).send(questions.rows);
  })
  .catch(err => {console.log(err)});
})

app.get('/qa/questions/:question_id/answers', (req, res) => {
  getSpecificAnswers(req)
  .then((answers) => {
    console.log('got response from server');
    res.status(200).send(answers.rows);
  })
  .catch(err => {console.log(err)});
})

app.post('/qa/questions', (req, res) => {
  askQuestion(req)
  .then(() => {
    console.log('got response from server');
    res.sendStatus(201);
  })
  .catch(err => {console.log(err)});
})

app.post('/qa/questions/:question_id/answers/questions', (req, res) => {
  answerQuestion(req)
  .then(() => {
    console.log('got response from server');
    res.sendStatus(201);
  })
  .catch(err => {console.log(err)});
})

app.put('/qa/questions/:question_id/helpful', (req, res) => {
  markQAsHelpful(req)
  .then(() => {
    console.log('got response from server');
    res.sendStatus(204);
  })
  .catch(err => {console.log(err)});
})

app.put('/qa/questions/:question_id/report', (req, res) => {
  reportQuestion(req)
  .then(() => {
    console.log('got response from server');
    res.sendStatus(204);
  })
  .catch(err => {console.log(err)});
})

app.put('/qa/answers/:answer_id/helpful', (req, res) => {
  markAnsAsHelpful(req)
  .then(() => {
    console.log('got response from server');
    res.sendStatus(204);
  })
  .catch(err => {console.log(err)});
})

app.put('/qa/answers/:answer_id/report', (req, res) => {
  reportAns(req)
  .then(() => {
    console.log('got response from server');
    res.sendStatus(204);
  })
  .catch(err => {console.log(err)});
})


app.listen(port, () => {
  console.log(`listening on port ${port} for QA requests`);
})