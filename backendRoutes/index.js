const backend_url = "http://10.40.3.100:5000/api/v1";

const SummaryApi = {
    signUp: { // Changed to camelCase and used quotes for keys with hyphens
        url: `${backend_url}/sign-up`,
        method: "post",
    }
};

export default SummaryApi;
