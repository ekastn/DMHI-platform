import { BiRegularErrorCircle } from "solid-icons/bi";
import { Component, createSignal, For, Match, Switch } from "solid-js";
import FloatingLayout from "../../components/FloatingLayout";
import { useAuth } from "../../context/AuthContext";
import ListUserFriends from "./ListUserFriends";
import ListUserStories from "./ListUserStories";
import ProfileEdit from "./ProfileEdit";
import ProfileInfo from "./ProfileInfo";
import { useProfile } from "./useProfile";

const tabs = [
    { id: 1, title: "Stories" },
    { id: 2, title: "Friends" },
];

const UserProfile: Component = () => {
    const { profile, handleClickTalk, isLoading, isEditing, setIsEditing, handleEditSubmit } =
        useProfile();
    const { user } = useAuth();

    const [selectedTab, setSelectedTab] = createSignal(tabs[0].title);

    const selectedTabClass =
        "text-primary font-medium underline decoration-0 underline-offset-[1em]";

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
                                <ProfileInfo
                                    currentUser={user()}
                                    user={profile()?.user}
                                    handleClickTalk={handleClickTalk}
                                    isLoading={isLoading()}
                                    setIsEditing={setIsEditing}
                                />
                            </Match>
                            <Match when={isEditing()}>
                                <ProfileEdit
                                    handleEditSubmit={handleEditSubmit}
                                    isLoading={isLoading()}
                                    user={profile()?.user}
                                    setIsEditing={setIsEditing}
                                />
                            </Match>
                        </Switch>
                        <ul class="flex items-center">
                            <For each={tabs}>
                                {(tab) => (
                                    <li>
                                        <button
                                            onClick={() => setSelectedTab(tab.title)}
                                            class={`btn border-0 text-lg bg-transparent outline-none hover:bg-transparent ${tab.title === selectedTab() ? selectedTabClass : "font-light"}`}
                                        >
                                            {tab.title}
                                        </button>
                                    </li>
                                )}
                            </For>
                        </ul>
                        <Switch>
                            <Match when={selectedTab() === "Stories"}>
                                <ListUserStories userId={profile()?.user.id!} />
                            </Match>
                            <Match when={selectedTab() === "Friends"}>
                                <ListUserFriends userId={profile()?.user.id!} />
                            </Match>
                        </Switch>
                    </div>
                </Match>
            </Switch>
        </FloatingLayout>
    );
};

export default UserProfile;
