import axios from "axios";

export const GetAllUsers = async (url : string) => {
    try {
        const req = await axios.get(url)
        
        if(!req?.data.users) {
            return alert(req?.data?.message)
        }
        
        return req?.data.users
    } catch (error) {
        console.log(error);
        
    }
}