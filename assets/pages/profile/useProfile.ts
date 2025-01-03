import { useNavigate, useParams } from "@solidjs/router";
import { createEffect, createResource, createSignal } from "solid-js";
import { getOrCreateChatApi } from "../../services/chatServices";
import { getUserInfoApi, updateUserApi, uploadProfileImageApi } from "../../services/userService";
import { FormSubmitEventType, InputEventType } from "../../types/events";
import { catchError } from "../../utils/common";

export const useProfile = () => {
    const [userId, setUserId] = createSignal<number>();
    const params = useParams();

    const [isEditing, setIsEditing] = createSignal(false);
    const [isLoading, setIsLoading] = createSignal(false);

    const [profile, { mutate }] = createResource(userId, getUserInfoApi);

    const navigate = useNavigate();

    createEffect(() => {
        setUserId(parseInt(params.userId));
    });

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

    const handleInput = (e: InputEventType) => {
        const { name, value } = e.currentTarget;
        if (name == "username") {
            mutate((prev) => {
                if (!prev) return prev;
                return { user: { ...prev.user, username: value } };
            });
        }
    };

    const handleEditSubmit = async (e: FormSubmitEventType) => {
        e.preventDefault();
        if (!profile()) return;
        setIsLoading(true);
        const [error, data] = await catchError(updateUserApi(profile().user));
        if (error) {
            console.error(error);
            setIsLoading(false);
            return;
        }

        if (data.success) {
            mutate((prev) => {
                if (!prev) return prev;
                return { user: { ...prev.user, ...data.data } };
            });
        }

        setIsLoading(false);
        setIsEditing(false);
    };

    const handleChangeProfileImage = async (e: Event) => {
        setIsLoading(true);
        const target = e.target as HTMLInputElement;
        if (target.files && target.files[0]) {
            const file = target.files[0];
            const formData = new FormData();
            formData.append("file", file);

            const [error, data] = await catchError(uploadProfileImageApi(formData));
            if (error) {
                console.error(error);
                setIsLoading(false);
                return;
            }

            if (data.success) {
                // type of mutate is {user: UserType}
                if (profile()) {
                    mutate((prev) => {
                        if (!prev) return prev;
                        return { user: { ...prev.user, profileImage: data.data.filePath } };
                    });
                }
            } else {
                console.error("File upload failed:", data.message);
            }
        }
        setIsLoading(false);
    };

    return {
        profile,
        handleClickTalk,
        handleChangeProfileImage,
        isLoading,
        isEditing,
        setIsEditing,
        handleEditSubmit,
        handleInput,
    };
};
