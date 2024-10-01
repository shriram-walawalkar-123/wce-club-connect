const backend_url = "http://192.168.71.40:5000/api/v1";

const SummaryApi = {
    signUp: { // Changed to camelCase and used quotes for keys with hyphens
        url: `${backend_url}/sign-up`,
        method: "post",
    },
    logIn: { // Changed to camelCase and used quotes for keys with hyphens
        url: `${backend_url}/login`,
        method: "post",
    }
};
export default SummaryApi;
