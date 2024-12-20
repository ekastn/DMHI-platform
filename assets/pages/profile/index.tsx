import { Component, Show, Switch } from "solid-js";
import FloatingLayout from "../../components/FloatingLayout";
import { useProfile } from "./useProfile";
import { Match } from "solid-js";
import { BiRegularErrorCircle } from "solid-icons/bi";
import { For } from "solid-js";
import { useAuth } from "../../context/AuthContext";

const UserProfile: Component = () => {
    const { profile, handleClickTalk, isLoading } = useProfile();
    const { user } = useAuth();

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
                        <div class="flex items-center justify-start space-x-4">
                            <img
                                src="https://img.freepik.com/premium-vector/people-vector_53876-25570.jpg?semt=ais_hybrid"
                                alt="Profile"
                                class="w-28 h-28 rounded-full border-none border-gray-300"
                            />
                            <h1 class="text-4xl font-bold">{profile()?.user.username}</h1>
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
                    </div>
                </Match>
            </Switch>
        </FloatingLayout>
    );
};

export default UserProfile;
