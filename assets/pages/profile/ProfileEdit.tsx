import { Component } from "solid-js";
import { AiFillEdit } from "solid-icons/ai";
import { FormSubmitEventType, InputEventType } from "../../types/events";
import { UserType } from "../../types/user.";
import ProfileImage from "./ProfileImage";

type PropsType = {
    user: UserType | undefined;
    isLoading: boolean;
    setIsEditing: (value: boolean) => void;
    handleEditSubmit: (e: FormSubmitEventType) => void;
    handleChangeProfileImage: (e: Event) => void;
    handleInput: (e: InputEventType) => void;
};

const ProfileEdit: Component<PropsType> = (props) => {
    return (
        <form onSubmit={props.handleEditSubmit} class="flex items-center justify-start space-x-4">
            <label class="w-28 h-28 relative rounded-full cursor-pointer border-none border-gray-300">
                <ProfileImage image={props.user?.profileImage} />
                <AiFillEdit class="absolute size-6 top-2/3 right-[70%] text-primary shadow-md" />
                <input
                    onChange={props.handleChangeProfileImage}
                    type="file"
                    name="image"
                    id="dropzone-file"
                    accept="image/png, image/jpeg, image/jpg"
                    disabled={props.isLoading}
                    hidden
                />
            </label>
            <div class="flex justify-center items-center space-x-4 h-full">
                <input
                    onInput={props.handleInput}
                    value={props.user?.username}
                    type="text"
                    name="username"
                    placeholder="Username"
                    class="input input-bordered input-lg w-full bg-transparent"
                />
                <button disabled={props.isLoading} type="submit" class="btn btn-primary h-1/2">
                    Save
                </button>
                <button
                    type="button"
                    onClick={() => props.setIsEditing(false)}
                    class="btn btn-outline h-1/2"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default ProfileEdit;
