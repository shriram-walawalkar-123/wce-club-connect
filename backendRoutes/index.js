const backend_url = "http://192.168.208.87:5000/api/v1";

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

    
};
export default SummaryApi;
