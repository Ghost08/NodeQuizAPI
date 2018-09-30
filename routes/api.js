const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

const mongoose = require("mongoose");
const db = "mongodb://ghost08:mongo2018@ds151382.mlab.com:51382/demo"
const secretKey = "abcdefghijklmnopqrstuvwxyz";

//import models
const User = require("../models/user");
const Quiz = require("../models/quiz");
const Paper = require("../models/paper");
const Question = require("../models/question");
const Subscription = require("../models/subscription");
const Error = require("../models/error");
const ApiResponse = require("../models/response");
const Answer = require("../models/answer");
const Result = require("../models/result");

mongoose.connect(db, {
    useNewUrlParser: true
}, err => {

    if (err) {
        console.error(err);
    } else {
        console.log("connected to mongodb");
    }

})

function verifyToken(req, res, next) {

    if (!req.headers.authorization) {
        let errorData = new Error(401, "unauthorized request");
        let response = new ApiResponse("error", null, errorData);
        return res.status(401).send(response);
    }

    //extract token from header
    let token = req.headers.authorization.split(' ')[1];
    if (token === 'null') {
        let errorData = new Error(401, "unauthorized request");
        let response = new ApiResponse("error", null, errorData);
        return res.status(401).send(response);
    }

    let payload = jwt.verify(token, secretKey);
    if (!payload) {
        let errorData = new Error(401, "unauthorized request");
        let response = new ApiResponse("error", null, errorData);
        return res.status(401).send(response);
    }

    req.userId = payload.subject;
    next();
}

//register user
router.post("/register", (req, res) => {

    let userData = req.body;

    //check if username already exists or not
    //if exists then send error
    //else register new user

    User.findOne({
        userName: userData.userName
    }, (error, existingUser) => {

        if (error) {
            console.log(error);
            let errorData = new Error(400, "db error");
            let response = new ApiResponse("error", null, errorData);
            res.status(400).send(response);
        } else {
            if (existingUser) {
                let errorData = new Error(400, "Username already taken");
                let response = new ApiResponse("error", null, errorData);
                res.status(400).send(response);
            } else {
                //parse input user info
                let user = new User(userData);
                user.role = "maker";
                user.save((error, registeredUser) => {
                    if (error) {
                        console.log(error);
                        let errorData = new Error(400, "error in saving user details");
                        let response = new ApiResponse("error", null, errorData);
                        res.status(400).send(response);

                    } else {

                        let payload = {
                            subject: registeredUser._id,
                            userName: registeredUser.userName,
                            role: registeredUser.role
                        };
                        let token = jwt.sign(payload, secretKey);
                        let response = new ApiResponse("success", {
                            token: token,
                            userName: registeredUser.userName,
                            role: registeredUser.role
                        }, null);

                        //let response = new ApiResponse("success", registeredUser, null);
                        res.status(200).send(response);
                    }
                });
            }
        }
    });
});

//user login
router.post("/login", (req, res) => {

    let userData = req.body;
    User.findOne({
        userName: userData.userName
    }, (error, user) => {

        if (error) {
            console.log(error);
            let errorData = new Error(400, "db error");
            let response = new ApiResponse("error", null, errorData);
            res.status(400).send(response);
        } else {

            if (!user) {
                let errorData = new Error(401, "Invalid username");
                let response = new ApiResponse("error", null, errorData);
                res.status(401).send(response);
            } else {
                if (user.password !== userData.password) {
                    let errorData = new Error(401, "Invalid password");
                    let response = new ApiResponse("error", null, errorData);
                    res.status(401).send(response);
                } else {
                    //let response = new ApiResponse("success", user, null);

                    let payload = {
                        subject: user._id,
                        userName: user.userName,
                        role: user.role
                    };
                    let token = jwt.sign(payload, secretKey);
                    let response = new ApiResponse("success", {
                        token: token,
                        userName: user.userName,
                        role: user.role
                    }, null);

                    res.status(200).send(response);
                }
            }
        }
    });
});

//create quiz
router.post("/quiz", verifyToken, (req, res) => {

    let quizData = req.body;
    //check for existing record
    //if exists then update 
    //else insert
    console.log(quizData._id);
    Quiz.findOne({
        _id: quizData._id
    }, (error, existingQuiz) => {
        if (error) {
            console.log(error);
            let errorData = new Error(400, "db error");
            let response = new ApiResponse("error", null, errorData);
            res.status(400).send(response);
        } else {
            if (existingQuiz) {
                existingQuiz.quizName = quizData.quizName;
                existingQuiz.quizType = quizData.quizType;
                existingQuiz.quizDesc = quizData.quizDesc;
                existingQuiz.active = quizData.active;
                existingQuiz.modifiedBy = req.userId;
                existingQuiz.modifiedDate = new Date();
                existingQuiz.save();
                isExistingQuiz = true;
                let response = new ApiResponse("success", existingQuiz, null);
                res.status(200).send(response);
            } else {
                quizData.createdDate = new Date();
                quizData.createdBy = req.userId;
                let quiz = new Quiz(quizData);
                quiz.save((error, savedQuiz) => {
                    if (error) {
                        console.log(error);
                        let errorData = new Error(400, "db error");
                        let response = new ApiResponse("error", null, errorData);
                        res.status(400).send(response);
                    } else {
                        let response = new ApiResponse("success", savedQuiz, null);
                        res.status(200).send(response);
                    }
                })
            }
        }
    });
});

//create paper
router.post("/paper", verifyToken, (req, res) => {
    let paperData = req.body;
    Paper.findOne({
        _id: paperData._id
    }, (error, existingPaper) => {
        console.log("paper exists : updating data");
        if (error) {
            console.log(error);
            let errorData = new Error(400, "db error");
            let response = new ApiResponse("error", null, errorData);
            res.status(400).send(response);
        } else {
            if (existingPaper) {
                existingPaper.paperTitle = paperData.paperTitle;
                existingPaper.paperDesc = paperData.paperDesc;
                existingPaper.active = paperData.active;
                existingPaper.modifiedBy = req.userId;
                existingPaper.modifiedDate = new Date();
                existingPaper.save();
                isExistingPaper = true;
                let response = new ApiResponse("success", existingPaper, null);
                res.status(200).send(response);
            } else {
                paperData.createdDate = new Date();
                paperData.createdBy = req.userId;
                let paper = new Paper(paperData);
                paper.save((error, savedPaper) => {
                    if (error) {
                        console.log(error);
                        let errorData = new Error(400, "db error");
                        let response = new ApiResponse("error", null, errorData);
                        res.status(400).send(response);
                    } else {
                        let response = new ApiResponse("success", savedPaper, null);
                        res.status(200).send(response);
                    }
                });
            }
        }
    });
});

//add question
router.post("/question", verifyToken, (req, res) => {
    let questionData = req.body;

    Question.findOne({
        _id: questionData._id
    }, (error, existingQuestion) => {

        if (error) {
            console.log(error);
            let errorData = new Error(400, "db error");
            let response = new ApiResponse("error", null, errorData);
            res.status(400).send(response);
        } else {
            if (existingQuestion != null) {
                existingQuestion.questionTitle = questionData.questionTitle;
                existingQuestion.questionDesc = questionData.questionDesc;
                existingQuestion.active = questionData.active;
                existingQuestion.modifiedBy = req.userId;
                existingQuestion.modifiedDate = new Date();

                if (questionData.options != null &&
                    questionData.options.length > 0) {
                    existingQuestion.options = [];
                    for (let i = 0; i < questionData.options.length; i++) {
                        questionData.options[i].createdBy = req.userId;
                        questionData.options[i].createdDate = new Date();
                        existingQuestion.options.push(questionData.options[i]);
                    }
                }

                existingQuestion.save();
                isExistingQuestion = true;
                let response = new ApiResponse("success", existingQuestion, null);
                res.status(200).send(response);
            } else {

                isExistingQuestion = false;
                questionData.createdDate = new Date();
                questionData.createdBy = req.userId;
                let question = new Question(questionData);
                question.save((error, savedQuestion) => {
                    if (error) {
                        console.log(error);
                        let errorData = new Error(400, "db error");
                        let response = new ApiResponse("error", null, errorData);
                        res.status(400).send(response);
                    } else {
                        let response = new ApiResponse("success", savedQuestion, null);
                        res.status(200).send(response);
                    }
                });
            }
        }
    });

});


//save subscription
router.post("/subscription", verifyToken, (req, res) => {
    let subscriptionData = req.body;
    subscriptionData.createdDate = new Date();
    subscriptionData.createdBy = req.userId;
    subscriptionData.userId = req.userId;

    let subscription = new Subscription(subscriptionData);
    subscription.save((error, savedSubscription) => {
        if (error) {
            console.log(error);
            let errorData = new Error(400, "db error");
            let response = new ApiResponse("error", null, errorData);
            res.status(400).send(response);
        } else {
            let subscriptionId = savedSubscription._id;

            let response = new ApiResponse("success", {
                subscriptionId
            }, null);
            res.status(200).send(response);
        }
    })
});

//save answer of a questionn
router.post("/answer", verifyToken, (req, res) => {
    let answerData = req.body;

    Answer.findOne({
        questionId: mongoose.Types.ObjectId(answerData.questionId),
        paperId: mongoose.Types.ObjectId(answerData.paperId),
        quizId: mongoose.Types.ObjectId(answerData.quizId)

    }, (error, existingQuestion) => {
        if (error) {
            console.log(error);
            let errorData = new Error(400, "db error");
            let response = new ApiResponse("error", null, errorData);
            res.status(400).send(response);
        } else {

            if (existingQuestion != null) {
                existingQuestion.answerId = answerData.answerId;
                existingQuestion.modifiedBy = req.userId;
                existingQuestion.modifiedDate = new Date();
                existingQuestion.save();
                let response = new ApiResponse("success", existingQuestion, null);
                res.status(200).send(response);
            } else {
                answerData.createdDate = new Date();
                answerData.createdBy = req.userId;
                let answer = new Answer(answerData);
                answer.save((error, savedAnswer) => {
                    if (error) {
                        console.log(error);
                        let errorData = new Error(400, "db error");
                        let response = new ApiResponse("error", null, errorData);
                        res.send(400).send(response);
                    } else {

                        let response = new ApiResponse("success", savedAnswer, null);
                        res.status(200).send(response);
                    }
                });
            }
        }
    })

});

router.post("/result", verifyToken, (req, res) => {

    let resultData = req.body;

    Result.findOne({
        subscriptionId: mongoose.Types.ObjectId(resultData.subscriptionId),
        paperId: mongoose.Types.ObjectId(resultData.paperId),
        quizId: mongoose.Types.ObjectId(resultData.quizId)
    }, (error, existingResult) => {
        if (error) {
            console.log(error);
            let errorData = new Error(400, "db error");
            let response = new ApiResponse("error", null, errorData);
            res.status(400).send(response);
        } else {

            if (existingResult != null) {
                existingResult.totalQuestions = resultData.totalQuestions;
                existingResult.correctAnswers = resultData.correctAnswers;
                existingResult.wrongAnswers = resultData.wrongAnswers;
                existingResult.score = resultData.score;
                existingResult.result = resultData.result;
                existingResult.active = resultData.active;
                existingResult.modifiedBy = req.userId;
                existingResult.modifiedDate = new Date();
                existingResult.save();
                let response = new ApiResponse("success", existingResult, null);
                res.status(200).send(response);
            } else {
                resultData.createdBy = req.userId;
                resultData.createdDate = new Date();

                let finalResult = new Result(resultData);
                finalResult.save((error,savedResult)=>{
                    if (error) {
                        console.log(error);
                        let errorData = new Error(400, "db error");
                        let response = new ApiResponse("error", null, errorData);
                        res.status(400).send(response);
                    } else{
                        let response = new ApiResponse("success", savedResult, null);
                        res.status(200).send(response);
                    }
                })
            }
        }
    })
})

router.get("/", (req, res) => {
    res.send("From api route");
});

router.get("/quiz", verifyToken, (req, res) => {
    Quiz.find({}, (error, quizlist) => {
        if (error) {
            let errorData = new Error(400, "db error");
            let response = new ApiResponse("error", null, errorData);
            res.status(400).send(response);
        } else {
            let response = new ApiResponse("success", quizlist, null);
            res.status(200).send(response);
        }
    })
});

router.get("/quiz/:quizId", verifyToken, (req, res) => {
    Quiz.findOne({
        _id: mongoose.Types.ObjectId(req.params.quizId)
    }, (error, quizData) => {
        if (error) {
            let errorData = new Error(400, "db error");
            let response = new ApiResponse("error", null, errorData);
            res.status(400).send(response);
        } else {
            let response = new ApiResponse("success", quizData, null);
            res.status(200).send(response);
        }
    })
});

router.get("/paper", verifyToken, (req, res) => {
    Paper.find({}, (error, paperlist) => {
        if (error) {
            let errorData = new Error(400, "db error");
            let response = new ApiResponse("error", null, errorData);
            res.status(400).send(response);
        } else {
            let response = new ApiResponse("success", paperlist, null);
            res.status(200).send(response);
        }
    })
});

router.get("/paper/:quizId", verifyToken, (req, res) => {
    Paper.find({
        quizId: mongoose.Types.ObjectId(req.params.quizId)
    }).populate("quizId").exec((error, paperlist) => {
        if (error) {
            let errorData = new Error(400, "db error");
            let response = new ApiResponse("error", null, errorData);
            res.status(400).send(response);
        } else {
            let response = new ApiResponse("success", paperlist, null);
            res.status(200).send(response);
        }
    });
});

router.get("/paper/:quizId/:paperId", verifyToken, (req, res) => {
    Paper.findOne({
        quizId: mongoose.Types.ObjectId(req.params.quizId),
        _id: mongoose.Types.ObjectId(req.params.paperId)
    }).populate("quizId").exec((error, paperData) => {
        if (error) {
            let errorData = new Error(400, "db error");
            let response = new ApiResponse("error", null, errorData);
            res.status(400).send(response);
        } else {
            let response = new ApiResponse("success", paperData, null);
            res.status(200).send(response);
        }
    });
});

//get all questions of the paper
router.get("/question/:quizId/:paperId", verifyToken, (req, res) => {

    Question.find({
        quizId: mongoose.Types.ObjectId(req.params.quizId),
        paperId: mongoose.Types.ObjectId(req.params.paperId)
    }).populate("paperId").populate("quizId").exec((error, paperlist) => {
        if (error) {
            let errorData = new Error(400, "db error");
            let response = new ApiResponse("error", null, errorData);
            res.status(400).send(response);
        } else {
            let response = new ApiResponse("success", paperlist, null);
            res.status(200).send(response);
        }
    });


});

//get all answers of the paper
router.get("/answer/:quizId/:paperId", verifyToken, (req, res) => {
    Answer.find({
            quizId: mongoose.Types.ObjectId(req.params.quizId),
            paperId: mongoose.Types.ObjectId(req.params.paperId)
        }).populate("quizId").populate("paperId").populate("questionId")
        .exec((error, answerList) => {
            if (error) {
                let errorData = new Error(400, "db error");
                let response = new ApiResponse("error", null, errorData);
                res.status(400).send(response);
            } else {
                let response = new ApiResponse("success", answerList, null);
                res.status(200).send(response);
            }
        });
});

router.get("/subscription", verifyToken, (req, res) => {

    Subscription.find({
        userId: req.userId
    }).populate("userId").populate("quizId").populate("paperId").exec((error, subscriptionList) => {
        if (error) {
            console.log(error);
            let errorData = new Error(400, "db error");
            let response = new ApiResponse("error", null, errorData);
            res.status(400).send(response);
        } else {
            let response = new ApiResponse("success", subscriptionList, null);
            res.status(200).send(response);
        }
    });
});

router.get("/subscription/:subscriptionId", verifyToken, (req, res) => {

    Subscription.findOne({
        _id: req.params.subscriptionId
    }).populate("userId").
    populate("paperId").
    populate("quizId").exec((error, subscriptionList) => {
        if (error) {
            let errorData = new Error(400, "db error");
            let response = new ApiResponse("error", null, errorData);
            res.status(400).send(response);
        } else {
            let response = new ApiResponse("success", subscriptionList, null);
            res.status(200).send(response);
        }
    });
});

router.get("/result",verifyToken,(req,res)=>{
    Result.find({
        userId : req.userId
    })
    .populate("userId",'userName firstName middleName lastName')
    .populate("quizId",'quizName quizDesc quizType')
    .populate("paperId",'paperTitle paperDesc')
    .exec((error,results)=>{
        if (error) {
            let errorData = new Error(400, "db error");
            let response = new ApiResponse("error", null, errorData);
            res.status(400).send(response);
        } else {
            let response = new ApiResponse("success", results, null);
            res.status(200).send(response);
        }

    })

})

router.delete("/question/:questionId", verifyToken, (req, res) => {
    Question.findOne({
        _id: req.params.questionId
    }, (error, questionData) => {
        if (error) {
            let errorData = new Error(400, "db error");
            let response = new ApiResponse("error", null, errorData);
            res.status(400).send(response);
        } else {

            if (questionData) {
                Question.deleteOne({
                    _id: req.params.questionId
                }, (e) => {
                    if (error) {
                        let errorData = new Error(400, "db error");
                        let response = new ApiResponse("error", null, errorData);
                        res.status(400).send(response);
                    } else {
                        let response = new ApiResponse("success", {
                            "questionId": req.params.questionId,
                            "deleted": true
                        }, null);
                        res.status(200).send(response);
                    }

                })
            } else {
                let errorData = new Error(400, "question not found");
                let response = new ApiResponse("error", null, errorData);
                res.status(400).send(response);
            }
        }
    })


})

module.exports = router;