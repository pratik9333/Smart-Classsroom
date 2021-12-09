require("dotenv").config({ path: __dirname + "./config/.env" });

const jwt = require('jsonwebtoken');

exports.isAuth = (req,res,next) =>{

    try{

        const token = req.header('Authorization').split(' ')[1];

        const decodedPayload = jwt.verify(token,process.env.SECRET);

        req.userId = decodedPayload._id;

        next();

    }catch(err){

        return res.status(400).json({message:'UnAuthorized Access'});
    }

}
