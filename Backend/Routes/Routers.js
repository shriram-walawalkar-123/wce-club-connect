const express = require('express');
const router = express.Router();

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
const { clubEventAdd } = require('../Controller/ClubController/ClubEventAdd');
const clubEventEdit = require('../Controller/ClubController/CLubEventEdit');
const getClubEvent = require('../Controller/ClubController/getClubEvent');
const getAllClub = require('../Controller/CommonController/GetAllClub');
const { getClubPastEvent } = require('../Controller/CommonController/GetClubPastEvent');
const getAllPastEvents = require('../Controller/CommonController/GetAllPastEvents');
const getAllUpCommingEvents = require('../Controller/CommonController/GetAllUpCommingEvents');
const getClubUpcomingEvent = require('../Controller/CommonController/GetClubUpCommingEvent');
const getClub = require('../Controller/ClubController/GetClub');
const getClubInfo = require('../Controller/CommonController/GetClubInfo');
const signup = require('../Controller/SignUp');
const login = require('../Controller/LogIn');
const { clubIdCreate } = require('../Controller/AdminController/ClubIdCreate');
const  getAllClubId = require('../Controller/AdminController/GetAllClubId');
const getClubMemberCommon = require('../Controller/CommonController/GetClubMemberCommon');
// user route
router.post("/sign-up",signup);

router.post("/login",login);

// club router
router.post("/club_description",auth,isClub,clubDescription);

router.post("/club_social_media",auth,isClub,clubSocialMedia);

router.get("/get_club",auth,isClub,getClub);

// galary
router.post("/club_gallery",auth,isClub,clubGallery);

router.post("/club_gallery_detele",auth,isClub,deleteGalleryImage);

router.get("/get_club_gallery",auth,isClub,getClubGallery);

// member
router.post("/club_member_update",auth,isClub,clubMemberUpdate);

router.get("/get_club_member",auth,isClub,getClubMember)

router.post("/club_member_delete",auth,isClub,clubMemberDelete);

router.post("/club_member",auth,isClub,clubMemberAdd);

// event 
router.post("/club_event_add",auth,isClub,clubEventAdd);

router.post("/club_event_edit",auth,isClub,clubEventEdit);

router.get("/get_club_event",auth,isClub,getClubEvent);

// common route
router.get("/get_all_club",getAllClub);

router.post("/get_club_info",getClubInfo);

router.post("/get_club_member_common",getClubMemberCommon);

// event by club
router.post("/get_club_upcomming_events",getClubUpcomingEvent);

router.post("/get_club_past_events",getClubPastEvent);

// all event 
router.get("/get_all_upcomming_events",getAllUpCommingEvents);

router.get("/get_all_past_events",getAllPastEvents);

// admin route
router.post("/club_id_create",auth,isAdmin,clubIdCreate)

router.get("/get_all_club_id",auth,isAdmin,getAllClubId);

module.exports=router