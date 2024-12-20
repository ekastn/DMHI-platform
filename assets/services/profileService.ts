import axios from "axios";
import { APIResponseType } from "../types/api";
import { StoryType } from "../types/story";
import { UserType } from "../types/user.";

export type ProfileResponseType = { user: UserType & { stories: StoryType[] } };

export const getUserProfile = async (userId: number) => {
    const { data } = await axios.get<APIResponseType<ProfileResponseType>>(`/api/user/${userId}`);
    return data.data;
};
