import { useNavigate, useParams } from "@solidjs/router";
import { createResource, createSignal } from "solid-js";
import { getUserInfoApi } from "../../services/userService";
import { catchError } from "../../utils/common";
import { getOrCreateChatApi } from "../../services/chatServices";
import { FormSubmitEventType } from "../../types/events";

export const useProfile = () => {
    const params = useParams();
    const userId = parseInt(params.userId);

    const [isEditing, setIsEditing] = createSignal(false);
    const [isLoading, setIsLoading] = createSignal(false);

    const [profile] = createResource(userId, getUserInfoApi);

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

    const handleEditSubmit = (e: FormSubmitEventType) => {
        e.preventDefault();
        console.log(e.target);
        setIsEditing(false);
    };

    return { profile, handleClickTalk, isLoading, isEditing, setIsEditing, handleEditSubmit };
};
