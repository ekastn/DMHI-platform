import { FaSolidCircleUser } from "solid-icons/fa";
import { Component, Show } from "solid-js";

const ProfileImage: Component<{ image: string | undefined }> = (props) => {
    return (
        <Show
            when={props.image}
            fallback={
                <FaSolidCircleUser class="size-20 rounded-full border-none border-gray-300" />
            }
        >
            <img class="size-20 rounded-full border-none object-cover border-gray-300" src={props.image} />
        </Show>
    );
};

export default ProfileImage;
