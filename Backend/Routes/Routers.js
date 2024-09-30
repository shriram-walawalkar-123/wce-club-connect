const express = require('express');
const signup = require('../Controller/SignUp');
const router = express.Router();


router.post("/sign-up",signup);
module.exports=router