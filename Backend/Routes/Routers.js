const express = require('express');
const signup = require('../Controller/SignUp');
const login = require('../Controller/LogIn');
const router = express.Router();


router.post("/sign-up",signup);
router.post("/login",login);
module.exports=router