import { Component } from "solid-js";
import { AiFillEdit } from "solid-icons/ai";
import { FormSubmitEventType } from "../../types/events";
import { UserType } from "../../types/user.";

type PropsType = {
    user: UserType | undefined;
    isLoading: boolean;
    setIsEditing: (value: boolean) => void;
    handleEditSubmit: (e: FormSubmitEventType) => void;
};

const ProfileEdit: Component<PropsType> = (props) => {
    return (
        <form onSubmit={props.handleEditSubmit} class="flex items-center justify-start space-x-4">
            <label class="w-28 h-28 relative rounded-full cursor-pointer border-none border-gray-300">
                <img
                    class="w-28 h-28 rounded-full border-none border-gray-300"
                    src="https://img.freepik.com/premium-vector/people-vector_53876-25570.jpg?semt=ais_hybrid"
                />
                <AiFillEdit class="absolute size-6 top-2/3 right-[70%] text-primary shadow-md" />
                <input
                    type="file"
                    name="image"
                    id="dropzone-file"
                    accept="image/png, image/jpeg, image/jpg"
                    hidden
                />
            </label>
            <div class="flex justify-center items-center space-x-4 h-full">
                <input
                    type="text"
                    placeholder="Username"
                    value={props.user?.username}
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
