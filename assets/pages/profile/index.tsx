import { Component, createSignal, Show, Switch } from "solid-js";
import FloatingLayout from "../../components/FloatingLayout";
import { useProfile } from "./useProfile";
import { Match } from "solid-js";
import { BiRegularErrorCircle } from "solid-icons/bi";
import { For } from "solid-js";
import { useAuth } from "../../context/AuthContext";
import { AiFillEdit } from "solid-icons/ai";
import { FormSubmitEventType } from "../../types/events";

const UserProfile: Component = () => {
    const [isEditing, setIsEditing] = createSignal(true);
    const { profile, handleClickTalk, isLoading } = useProfile();
    const { user } = useAuth();

    const handleSubmit = (e: FormSubmitEventType) => {
        e.preventDefault();
        setIsEditing(false);
    };

    return (
        <FloatingLayout>
            <Switch>
                <Match when={profile.loading}>
                    <div>Loading...</div>
                </Match>
                <Match when={profile.error}>
                    <div role="alert" class="alert">
                        <BiRegularErrorCircle />
                        <span>{profile.error}</span>
                    </div>
                </Match>
                <Match when={profile()}>
                    <div class="flex flex-col h-full p-4 bg-white rounded-lg">
                        <Switch>
                            <Match when={!isEditing()}>
                                <div class="flex items-center justify-start space-x-4">
                                    <img
                                        src="https://img.freepik.com/premium-vector/people-vector_53876-25570.jpg?semt=ais_hybrid"
                                        alt="Profile"
                                        class="w-28 h-28 rounded-full border-none border-gray-300"
                                    />
                                    <div class="space-y-2">
                                        <h1 class="text-4xl font-bold">
                                            {profile()?.user.username}
                                        </h1>
                                        <Show when={user()?.id == profile()?.user.id}>
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                class="flex items-center gap-2 mr-12 mt-4 text-sm text-gray-500"
                                            >
                                                <AiFillEdit />
                                                Edit
                                            </button>
                                        </Show>
                                    </div>
                                    <Show when={user()?.id != profile()?.user.id}>
                                        <div class="flex justify-end w-full mt-4">
                                            <button
                                                onClick={async () =>
                                                    await handleClickTalk(profile()?.user.id!)
                                                }
                                                disabled={isLoading()}
                                                class="px-4 py-2 w-24 bg-primary text-white rounded-lg shadow-md my-8"
                                            >
                                                Talk
                                            </button>
                                        </div>
                                    </Show>
                                </div>
                            </Match>
                            <Match when={isEditing()}>
                                <form
                                    onClick={handleSubmit}
                                    class="flex items-center justify-start space-x-4"
                                >
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
                                            value={profile()?.user.username}
                                            class="input input-bordered input-lg w-full bg-transparent"
                                        />
                                        <button type="submit" class="btn btn-primary h-1/2">
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            class="btn btn-outline h-1/2"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </Match>
                        </Switch>
                        <Show when={profile()?.user.stories.length! > 0}>
                            <h1 class="font-xl mt-8 text-2xl">Stories:</h1>
                            <div class="flex flex-col space-y-4 mt-4">
                                <For each={profile()?.user.stories}>
                                    {(story) => (
                                        <a class="p-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200">
                                            <h2 class="text-lg font-semibold">{story.title}</h2>
                                            <p class="text-gray-600">{story.content}</p>
                                        </a>
                                    )}
                                </For>
                            </div>
                        </Show>
                    </div>
                </Match>
            </Switch>
        </FloatingLayout>
    );
};

export default UserProfile;
