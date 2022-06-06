const { isAuth } = require("../middlewares/auth.middleware");
const { getResponse, getAllResponses, createResponse, updateResponse, deleteResponse, 
        preCreateResponseCheck,postCreateResponseCheck } = require("../services/response.service");

const router = require("express").Router();

// get a response for an assignment 
router.get("/",isAuth,preCreateResponseCheck,postCreateResponseCheck,getResponse)

// get all responses for an assignment
router.get("/",isAuth,preCreateResponseCheck,postCreateResponseCheck,getAllResponses)

// create a response for an assignment 
router.post("/",isAuth,preCreateResponseCheck,createResponse) 

// update a response for an assignment
router.put("/",isAuth,preCreateResponseCheck,postCreateResponseCheck,updateResponse)

// delete a response for an assignment
router.delete("/",isAuth,preCreateResponseCheck,postCreateResponseCheck,deleteResponse)

module.exports = router;


