const { isAuth } = require("../middlewares/auth.middleware");
const { getResponse, getAllResponses, createResponse, updateResponse, deleteResponse } = require("../services/response.service");

const router = require("express").Router();

// get a response for an assignment 
router.get("/",isAuth,getResponse)

// get all responses for an assignment
router.get("/",isAuth,getAllResponses)

// create a response for an assignment 
router.post("/",isAuth,createResponse) 

// update a response for an assignment
router.put("/edit",isAuth,updateResponse)

// delete a response for an assignment
router.delete("/delete",isAuth,deleteResponse)

module.exports = router;


