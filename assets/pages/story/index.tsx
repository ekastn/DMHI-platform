import { AiFillEdit } from "solid-icons/ai";
import { FaSolidPen } from "solid-icons/fa";
import { Component } from "solid-js";
import { useViewStory } from "./useStory";

const ViewStory: Component = () => {
    const { isEditing, story, setIsEditing, handleInput, fields, handleUpdate } = useViewStory();

    const onSubmit = async (e: Event) => {
        e.preventDefault();
        await handleUpdate();
    };

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this story?")) {
        
            
        }
    };

    return (
        <div class="fixed inset-0 flex justify-end z-5 p-20">
            <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl">
                {isEditing() ? (
                    <form onSubmit={onSubmit} class="space-y-6">
                        <h1 class="text-2xl text-center mb-4">Edit Story</h1>
                        <p class="text-xl ">Tittle :</p>
                        <label class="input input-lg input-bordered flex items-center gap-4">
                            <FaSolidPen />
                            <input
                                onInput={handleInput}
                                id="title"
                                name="title"
                                type="text"
                                class="grow"
                                value={fields.title}
                                required
                            />
                        </label>

                        <p class="text-xl ">Content :</p>
                        <label class="input input-lg input-bordered flex items-center gap-4 h-96">
                            <AiFillEdit />
                            <textarea
                                onInput={handleInput}
                                id="content"
                                name="content"
                                class="h-80 w-full rounded-lg bg-inherit"
                                rows="4"
                                value={fields.content}
                                required
                            />
                        </label>

                        <div class="flex justify-end space-x-4">
                            <button type="submit" class="btn btn-success">
                                Save
                            </button>
                            <button type="button" onClick={handleDelete} class="btn btn-error">
                                Delete
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                class="btn btn-outline"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div class="space-y-4 mt-4 p-12">
                        <div class="">
                            <div class="flex justify-between items-center">
                                <h1 class="text-3xl ml-4">{story.title}</h1>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    class="flex items-center gap-2 mr-12 mt-4 text-sm text-gray-500"
                                >
                                    <AiFillEdit />
                                    Edit
                                </button>
                            </div>
                            <p class="text-sm text-gray-500 mt-4 ml-4">Author: {story.user}</p>
                        </div>

                        <div class="p-4 font-thin rounded-md ">
                            <p class="text-lg">{story.content}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewStory;

// import { Component, createSignal, onMount, Show } from "solid-js";
// import { AiFillEdit } from "solid-icons/ai";
// import { FaSolidPen } from "solid-icons/fa";
// import axios from "axios";

// const ViewStory: Component = () => {
//     const [story, setStory] = createSignal<any>(null);
//     const [isEditing, setIsEditing] = createSignal(false);
//     const [isLoading, setIsLoading] = createSignal(true);
//     const [error, setError] = createSignal<string | null>(null);

//     // Mock current user ID for determining ownership
//     const currentUserId = 1;

//     // Fetch story data by ID
//     const fetchStory = async (storyId: number) => {
//         try {
//             setIsLoading(true);
//             const response = await axios.get(`/api/story/${storyId}`); // Replace `/api/story/1` with your real API endpoint
//             setStory(response.data.story);
//         } catch (err) {
//             setError("Failed to fetch the story. Please try again.");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // Handle form submission for editing the story
//     const onSubmit = async (e: Event) => {
//         e.preventDefault();

//         const formData = new FormData(e.target as HTMLFormElement);
//         const updatedStory = {
//             title: formData.get("title"),
//             content: formData.get("content"),
//         };

//         try {
//             await axios.put(`/api/story/${story().id}`, updatedStory); // Replace with your real API endpoint
//             setStory({ ...story(), ...updatedStory }); // Update local state
//             setIsEditing(false);
//         } catch (err) {
//             console.error("Failed to update story:", err);
//         }
//     };

//     // Handle delete story
//     const handleDelete = async () => {
//         if (confirm("Are you sure you want to delete this story?")) {
//             try {
//                 await axios.delete(`/api/story/${story().id}`); // Replace with your real API endpoint
//                 console.log("Story deleted successfully");
//                 // Redirect or handle post-delete logic
//             } catch (err) {
//                 console.error("Failed to delete story:", err);
//             }
//         }
//     };

//     // Fetch the story when the component mounts (example: story ID = 1)
//     onMount(() => {
//         fetchStory(1); // Replace `1` with the actual story ID you want to fetch
//     });

//     return (
//         <div class="fixed inset-0 flex justify-end p-20">
//             <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl">
//                 <Show when={isLoading()}>
//                     <p>Loading story...</p>
//                 </Show>
//                 <Show when={error()}>
//                     <p class="text-red-500">{error()}</p>
//                 </Show>
//                 <Show when={story() && !isLoading() && !error()}>
//                     {isEditing() ? (
//                         <form onSubmit={onSubmit} class="space-y-6">
//                             <h1 class="text-2xl text-center mb-4">Edit Story</h1>
//                             <p class="text-xl">Title:</p>
//                             <label class="input input-lg input-bordered flex items-center gap-4">
//                                 <FaSolidPen />
//                                 <input
//                                     id="title"
//                                     name="title"
//                                     type="text"
//                                     class="grow"
//                                     value={story().title}
//                                     required
//                                 />
//                             </label>

//                             <p class="text-xl">Content:</p>
//                             <label class="input input-lg input-bordered flex items-center gap-4 h-96">
//                                 <AiFillEdit />
//                                 <textarea
//                                     id="content"
//                                     name="content"
//                                     class="h-80 w-full rounded-lg bg-inherit"
//                                     rows="4"
//                                     value={story().content}
//                                     required
//                                 />
//                             </label>

//                             <div class="flex justify-end space-x-4">
//                                 <button type="submit" class="btn btn-success">
//                                     Save
//                                 </button>
//                                 <button
//                                     type="button"
//                                     onClick={handleDelete}
//                                     class="btn btn-error"
//                                 >
//                                     Delete
//                                 </button>
//                                 <button
//                                     type="button"
//                                     onClick={() => setIsEditing(false)}
//                                     class="btn btn-outline"
//                                 >
//                                     Cancel
//                                 </button>
//                             </div>
//                         </form>
//                     ) : (
//                         <div class="space-y-4 mt-4 p-12">
//                             <div class="">
//                                 <div class="flex justify-between items-center">
//                                     <h1 class="text-3xl ml-4">{story().title}</h1>
//                                     <Show when={story().user_id === currentUserId}>
//                                         <button
//                                             onClick={() => setIsEditing(true)}
//                                             class="flex items-center gap-2 mr-12 mt-4 text-sm text-gray-500"
//                                         >
//                                             <AiFillEdit />
//                                             Edit
//                                         </button>
//                                     </Show>
//                                 </div>
//                                 <p class="text-sm text-gray-500 mt-4 ml-4">
//                                     Author: {story().user_id}
//                                 </p>
//                             </div>

//                             <div class="p-4 font-thin rounded-md ">
//                                 <p class="text-lg">{story().content}</p>
//                             </div>
//                         </div>
//                     )}
//                 </Show>
//             </div>
//         </div>
//     );
// };

// export default ViewStory;
