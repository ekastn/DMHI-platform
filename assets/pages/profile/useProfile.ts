import { useNavigate, useParams } from "@solidjs/router";
import { createResource, createSignal } from "solid-js";
import { getUserProfile } from "../../services/profileService";
import { catchError } from "../../utils/common";
import { getOrCreateChatApi } from "../../services/chatServices";

export const useProfile = () => {
    const params = useParams();
    const userId = parseInt(params.userId);

    const [isLoading, setIsLoading] = createSignal(false);

    const [profile] = createResource(userId, getUserProfile);

    const navigate = useNavigate();

    const handleClickTalk = async (userId: number) => {
        setIsLoading(true);
        const [error, data] = await catchError(getOrCreateChatApi(userId));

        if (error) {
            console.error(error);
        }

        if (data?.success) {
            navigate(`/chats/${data.data.chatRoomId}`);
        }
        setIsLoading(false);
    };

    return { profile, handleClickTalk, isLoading };
};
