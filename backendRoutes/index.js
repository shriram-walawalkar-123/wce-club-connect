// const backend_url = "https://wce-club-connect.onrender.com/api/v1";
const render = "https://wce-club-connect.onrender.com/api/v1";
const local = "http://192.168.250.3:5000/api/v1";
const backend_url = render;

const SummaryApi = {
    signUp: { // Changed to camelCase and used quotes for keys with hyphens
        url: `${backend_url}/sign-up`,
        method: "post",
    },
    logIn: { // Changed to camelCase and used quotes for keys with hyphens
        url: `${backend_url}/login`,
        method: "post",
    },

    // club router
    club_description:{
        url:`${backend_url}/club_description`,
        method:"post",
    },
    club_social_media:{
        url:`${backend_url}/club_social_media`,
        method:"post",
    },
    get_club:{
        url:`${backend_url}/get_club`,
        method:"get",
    },

    // member route
    club_member:{
        url:`${backend_url}/club_member`,
        method:"post",
    },
    get_club_member:{
        url:`${backend_url}/get_club_member`,
        method:"get",
    },
    club_member_delete:{
        url:`${backend_url}/club_member_delete`,
        method:"post",
    },
    club_member_update:{
        url:`${backend_url}/club_member_update`,
        method:"post",
    },

    // gallery router
    club_gallery:{
        url:`${backend_url}/club_gallery`,
        method:"post",
    },
    get_club_gallery:{
        url:`${backend_url}/get_club_gallery`,
        method:"get",
    },
    club_gallery_detele:{
        url:`${backend_url}/club_gallery_detele`,
        method:"post",
    },

    // event router
    club_event_add:{
        url:`${backend_url}/club_event_add`,
        method:"post",
    },
    club_event_edit:{
        url:`${backend_url}/club_event_edit`,
        method:"post",
    },
    get_club_event:{
        url:`${backend_url}/get_club_event`,
        method:"get",
    },
    
    // common route
    get_all_club:{
        url:`${backend_url}/get_all_club`,
        method:"get",
    },
    get_club_info:{
        url:`${backend_url}/get_club_info`,
        method:"post",
    },
    get_club_member_common:{
        url:`${backend_url}/get_club_member_common`,
        method:"post",
    },
    get_club_upcomming_events:{
        url:`${backend_url}/get_club_upcomming_events`,
        method:"post",
    },
    get_club_past_events:{
        url:`${backend_url}/get_club_past_events`,
        method:"post",
    },

    // all events
    get_all_upcomming_events:{
        url:`${backend_url}/get_all_upcomming_events`,
        method:"get",
    },
    get_all_past_events:{
        url:`${backend_url}/get_all_past_events`,
        method:"get",
    },
    delete_event:{
        url:`${backend_url}/delete_event`,
        method:"post",
    },
    // admin route get_all_club_id
    club_id_create:{
        url:`${backend_url}/club_id_create`,
        method:"post",
    },
    get_all_club_id:{
        url:`${backend_url}/get_all_club_id`,
        method:"get",
    },
};
export default SummaryApi;
