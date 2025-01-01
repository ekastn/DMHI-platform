import { BiRegularErrorCircle } from "solid-icons/bi";
import { Component, createResource, For, Match, Switch } from "solid-js";
import { getUserFriendsApi } from "../../services/userService";
import { A } from "@solidjs/router";

type PropsType = {
    userId: number;
};

const ListUserFriends: Component<PropsType> = (props) => {
    const [friends] = createResource(props.userId, getUserFriendsApi);

    return (
        <Switch>
            <Match when={friends.error}>
                <div role="alert" class="alert">
                    <BiRegularErrorCircle />
                    <span>{friends.error}</span>
                </div>
            </Match>
            <Match when={friends.loading}>
                <div>loading...</div>
            </Match>
            <Match when={friends()?.friends}>
                <div class="flex flex-col space-y-4 mt-4">
                    <For each={friends()?.friends}>
                        {(story) => (
                            <A href={`/user/${story.id}`} class="p-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200">
                                <h2 class="text-lg font-semibold">{story.username}</h2>
                            </A>
                        )}
                    </For>
                </div>
            </Match>
        </Switch>
    );
};

export default ListUserFriends;
