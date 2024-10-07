const backend_url = "http://10.40.6.121:5000/api/v1";

const SummaryApi = {
    signUp: { // Changed to camelCase and used quotes for keys with hyphens
        url: `${backend_url}/sign-up`,
        method: "post",
    },
    logIn: { // Changed to camelCase and used quotes for keys with hyphens
        url: `${backend_url}/login`,
        method: "post",
    },
    club_description:{
        url:`${backend_url}/club_description`,
        method:"post",
    },
    club_social_media:{
        url:`${backend_url}/club_social_media`,
        method:"post",
    },
    club_member:{
        url:`${backend_url}/club_member`,
        method:"post",
    }
};
export default SummaryApi;
