import axios from "axios";
import { APIResponseType } from "../types/api";
import { StoryType } from "../types/story";
import { UserType } from "../types/user.";

type userProfile = {user: UserType};

export const getUserProfile = async (
    userId: number , 
    username: string
    ) => {
    const { data } = await axios.get<APIResponseType<userProfile>>(`/api/user/?userId=${userId}&username=${username}`);
    return data;
}

