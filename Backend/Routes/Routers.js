const express = require('express');
const router = express.Router();

const signup = require('../Controller/SignUp');
const login = require('../Controller/LogIn');
const clubDescription=require("../Controller/ClubController/ClubDescription");
const { auth, isAdmin, isClub } = require('../MiddleWare/Auth');
const clubMemberAdd = require('../Controller/ClubController/CLubMemberAdd');
const clubMemberDelete = require('../Controller/ClubController/ClubMemberDetele');
const clubSocialMedia = require('../Controller/ClubController/ClubSocialMedia');
const clubGallery = require('../Controller/ClubController/ClubGallary');
const deleteGalleryImage = require('../Controller/ClubController/ClubGallaryDelete');
const clubMemberUpdate = require('../Controller/ClubController/ClubMemberEdit');
const getClubMember = require('../Controller/ClubController/getClubMember');
const getClubGallery = require('../Controller/ClubController/getClubGallary');

// user route
router.post("/sign-up",signup);

router.post("/login",login);

// club router
router.post("/club_description",auth,isClub,clubDescription);

router.post("/club_member",auth,isClub,clubMemberAdd);

router.post("/club_member_delete",auth,isClub,clubMemberDelete);

router.post("/club_social_media",auth,isClub,clubSocialMedia);

router.post("/club_gallery",auth,isClub,clubGallery);

router.post("/club_gallery_detele",auth,isClub,deleteGalleryImage);

router.post("/club_member_update",auth,isClub,clubMemberUpdate);

router.get("/get_club_member",auth,isClub,getClubMember)

router.get("/get_club_gallery",auth,isClub,getClubGallery);

module.exports=router