import { Component, createResource, For, Match, Switch } from "solid-js";
import { getUserStoriesApi } from "../../services/userService";
import { BiRegularErrorCircle } from "solid-icons/bi";
import { A } from "@solidjs/router";

type PropsType = {
    userId: number;
};

const ListUserStories: Component<PropsType> = (props) => {
    const [stories] = createResource(props.userId, getUserStoriesApi);

    return (
        <Switch>
            <Match when={stories.error}>
                <div role="alert" class="alert">
                    <BiRegularErrorCircle />
                    <span>{stories.error}</span>
                </div>
            </Match>
            <Match when={stories.loading}>
                <div>loading...</div>
            </Match>
            <Match when={stories()?.stories}>
                <div class="flex flex-col space-y-4 mt-4">
                    <For each={stories()?.stories}>
                        {(story) => (
                            <A href={`/story/${story.id}`} class="p-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200">
                                <h2 class="text-lg font-semibold">{story.title}</h2>
                                <p class="text-gray-600">{story.content}</p>
                            </A>
                        )}
                    </For>
                </div>
            </Match>
        </Switch>
    );
};

export default ListUserStories;
