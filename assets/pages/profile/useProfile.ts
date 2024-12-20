import { useParams } from "@solidjs/router";
import { createResource } from "solid-js";
import { getUserProfile } from "../../services/profileService";

export const useProfile = () => {
    const params = useParams();
    const userId = parseInt(params.userId);

    const [profile] = createResource(userId, getUserProfile);

    return { profile };
};
