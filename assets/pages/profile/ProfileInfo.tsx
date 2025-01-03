import { AiFillEdit } from "solid-icons/ai";
import { BsPersonFillAdd } from "solid-icons/bs";
import { Component, createSignal, Match, onMount, Show, Switch } from "solid-js";
import { checkFriendApi, createFriendRequestApi } from "../../services/userService";
import { UserType } from "../../types/user.";
import ProfileImage from "./ProfileImage";

type PropsType = {
    currentUser: UserType | null;
    user: UserType | undefined;
    isLoading: boolean;
    setIsEditing: (value: boolean) => void;
    handleClickTalk: (userId: number) => Promise<void>;
};

const ProfileInfo: Component<PropsType> = (props) => {
    const [showAddFriend, setShowAddFriend] = createSignal(false);
    const [isLoading, setIsLoading] = createSignal(false);

    onMount(async () => {
        if (props.currentUser && props.user) {
            const data = await checkFriendApi(props.currentUser.id, props.user.id);
            setShowAddFriend(
                !data.isFriend &&
                    data.friendRequest == null &&
                    props.currentUser.id != props.user.id
            );
        }
    });

    const handleAddFriendClick = async (userId: number) => {
        setIsLoading(true);
        const data = await createFriendRequestApi(userId);
        if (data.success) {
            setShowAddFriend(false);
        }
        setIsLoading(false);
    };

    return (
        <div class="flex items-center justify-start space-x-4">
            <ProfileImage image={props.user?.profileImage} />
            <div class="space-y-2">
                <h1 class="text-4xl font-bold">{props.user?.username}</h1>
                <Switch>
                    <Match when={showAddFriend()}>
                        <button
                            onClick={() => handleAddFriendClick(props.user?.id!)}
                            disabled={isLoading()}
                            class={`flex items-center gap-2 mt-4 text-sm  ${isLoading() ? "text-transparent" : "text-gray-500"}`}
                        >
                            <BsPersonFillAdd />
                            Add friend
                        </button>
                    </Match>
                    <Match when={props.currentUser?.id == props.user?.id}>
                        <button
                            onClick={() => props.setIsEditing(true)}
                            class="flex items-center gap-2 mt-4 text-sm text-gray-500"
                        >
                            <AiFillEdit />
                            Edit
                        </button>
                    </Match>
                </Switch>
            </div>
            <Show when={props.currentUser?.id != props.user?.id}>
                <div class="flex justify-end w-full mt-4">
                    <button
                        onClick={async () => await props.handleClickTalk(props.user?.id!)}
                        disabled={props.isLoading}
                        class="px-4 py-2 w-24 bg-primary text-white rounded-lg shadow-md my-8"
                    >
                        Talk
                    </button>
                </div>
            </Show>
        </div>
    );
};

export default ProfileInfo;
