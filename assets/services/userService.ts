import axios from "axios";
import { APIResponseType } from "../types/api";
import { StoryType } from "../types/story";
import { UserType } from "../types/user.";

export const getUserInfoApi = async (userId: number) => {
    const { data } = await axios.get<APIResponseType<{ user: UserType }>>(`/api/user/${userId}`);
    return data.data;
};

export const updateUserApi = async (user: UserType) => {
    const { data } = await axios.put<APIResponseType<{ user: UserType }>>(`/api/user/${user.id}`, {
        username: user.username,
    });
    return data;
};

export const getUserStoriesApi = async (userId: number) => {
    const { data } = await axios.get<APIResponseType<{ stories: StoryType[] }>>(
        `/api/user/${userId}/stories`
    );
    return data.data;
};

export const getUserFriendsApi = async (userId: number) => {
    const { data } = await axios.get<APIResponseType<{ friends: UserType[] }>>(
        `/api/user/${userId}/friends`
    );
    return data.data;
};

export const checkFriendApi = async (userId: number, friendId: number) => {
    const { data } = await axios.get<
        APIResponseType<{ isFriend: boolean; friendRequest?: string }>
    >(`/api/user/${userId}/friends/${friendId}`);
    return data.data;
};

export const getUserFriendRequestsApi = async (userId: number) => {
    const { data } = await axios.get<APIResponseType<{ friendRequests: UserType[] }>>(
        `/api/user/${userId}/friends/requests`
    );
    return data.data;
};

export const createFriendRequestApi = async (userId: number) => {
    const { data } = await axios.post<APIResponseType>(`/api/user/${userId}/friends/request`);
    return data;
};

export const updateFriendRequestApi = async (userId: number, accept: boolean) => {
    const { data } = await axios.put<APIResponseType>(`/api/user/${userId}/friends/request`, {
        accept,
    });
    return data;
};

export const uploadProfileImageApi = async (formData: FormData) => {
    const { data } = await axios.post<APIResponseType<{ filePath: string }>>(
        "/api/user/profile_image",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return data;
};
