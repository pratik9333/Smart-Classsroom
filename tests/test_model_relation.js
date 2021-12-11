const sequelize = require("../config/db");
const Answer = require("../models/answer.model");
const Question = require("../models/question.model");
const Tag = require("../models/tag.model");
const User = require("../models/user.model");


// 1:M User and Question
Question.belongsTo(User)
User.hasMany(Question)

// 1:M Question and Answer
Answer.belongsTo(Question)
Question.hasMany(Answer)

// 1:M User and Answer
Answer.belongsTo(User)
User.hasMany(Answer)


// M:M Question and Tag
Question.belongsToMany(Tag,{through: 'QuestionTag'});


sequelize.sync({ force: true }).then((result) => {})
    // user and question
    // User.create({
    //     "fullname" : "demo user",
    //     "email" : "demo@test1.com",
    //     "password" : "demo123",
    //     "role" : "student",
    //     "classname" : "d12b",
    //     "rollno" : 3,
    //     "gender" : "male"
    // }).then(user =>{

    //     console.log("User", user.email);
    //      Question.create({
    //         heading: 'Test Question',
    //         description: 'Test description'
    //     }).then(question =>{
    //         console.log("Question created:", question.heading);
    //         user.addQuestion(question)
    //             .then(ques =>{
    //                 console.log("Question added:", ques.heading);
    //                 user.countQuestions().then(count =>{
    //                     console.log("Questions related to user:",count);
    //                     user.removeQuestion(question)
    //                     .then(que =>{
    //                         console.log("Question deleted:", que.heading);
    //                         user.countQuestions().then(deletedCount =>{
    //                             console.log("Questions related to user:",deletedCount);
    //                         })
    //                     })
    //                 })
    //             })

    //     })

    // })




    // user and answer
    // User.create({
    //     "fullname": "demo user",
    //     "email": "demo@test1.com",
    //     "password": "demo123",
    //     "role": "student",
    //     "classname": "d12b",
    //     "rollno": 3,
    //     "gender": "male"
    // }).then(user => {

    //     // question create
    //     Question.create({
    //         heading: 'Test Question',
    //         description: 'Test description'
    //     }).then(question => {

    //         question.createTag({
    //             name: 'Tag 1'
    //         })
    //             .then(tag => {
    //                 console.log(tag.questionId);
    //                 question.countTags().then(count => {

    //                     console.log('Tags related to Question: ', count);
    //                 })
    //             })
            // create answer
            //     user.createAnswer({
            //         description: 'Test description'
            //     }).then(ans => {

            //         // answer added to question.
            //         console.log("Answer created:", ans);
            //         question.addAnswer(ans)
            //             .then( _ => {
            //                 question.countAnswers().then(count => {
            //                     console.log("Answer related to question:", count);
            //                     question.removeAnswer(ans)
            //                         .then(a => {
            //                             console.log("Answer deleted:", a);
            //                             question.countAnswers().then(deletedCount => {
            //                                 console.log("Answer related to question:", deletedCount);
            //                             })
            //                         })
            //                 })
            //             })

            //     })

            // })
    //     })
    // })
    // user can add question :)



    // user can delete question :)



    // user can modify question :)



    // how many question user has ? :)



    // user can add answer 



    // user can delete answer



    // user can modify answer



    // how many answer user has ?



    // a question has how many answers ?




    // a question has how many tags ?



    // how many questions are there with this tag ?

// });