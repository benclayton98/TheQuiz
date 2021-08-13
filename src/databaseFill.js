require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000
const questions = require('./../questions.json')

const { Questions } = require('./../models')

async function databaseFill(){
     for(let i=0; i<41; i++){
    await Questions.create({
        question: questions.results[i].question,
        answer: questions.results[i].correct_answer
    })}
}

databaseFill()