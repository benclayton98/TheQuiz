require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000
const questions = require('./questions.json')
const session = require('express-session')

const { Questions } = require('./models')

async function databaseFill() {
    for(let i=0; i<41; i++){
        await Questions.create({
            question: questions.results[i].question,
            answer: questions.results[i].correct_answer
        })}
}

let unique = []
function checkUnique() {
    if (unique.includes(random)){
    random = Math.round(Math.random() * (42 - 1) + 1)
    checkUnique()
}
    else return random;
}

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }))
app.use(express.static('public'))

app.get('/', (req, res) => {
    req.app.locals.correctAnswers = 0
    req.app.locals.questionNumber = 0
    unique = []
    res.render('home.ejs')
  })

app.get('/firstQuestion', async (req, res) => {

    // use databaseFill() here if there are no questions loaded
    
    const random = Math.round(Math.random() * (42 - 1) + 1)
    req.app.locals.question1 = await Questions.findAll({where: {id: random}})
    unique.push(random)
    req.app.locals.questionNumber += 1
    res.render('questions.ejs', {
        question: req.app.locals.question1,
        number: req.app.locals.questionNumber
    })
})

app.post('/result', async (req, res) => {
    if(req.body.answer === req.app.locals.question1[0].answer){
        req.app.locals.correctAnswers += 1
        result= 'Correct'
    }
    else { 
        result = 'Incorrect'
    }

    res.render('result.ejs', {
        question: req.app.locals.question1,
        result: result,
        correct: req.app.locals.question1[0].answer,
        tally: req.app.locals.correctAnswers,
        number: req.app.locals.questionNumber
    }) 
})

app.post('/questions', async (req, res) => {
    if(req.app.locals.questionNumber >= 10){
        res.render('finalScore.ejs',{
            number: req.app.locals.questionNumber,
            tally: req.app.locals.correctAnswers
        })
    }
    else{    
    random = Math.round(Math.random() * (42 - 1) + 1)
    checkUnique()
    req.app.locals.question1 = await Questions.findAll({where: {id: random}})
    unique.push(random)
    req.app.locals.questionNumber += 1
    res.render('questions.ejs', {
        question: req.app.locals.question1,
        number: req.app.locals.questionNumber
    })}
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })