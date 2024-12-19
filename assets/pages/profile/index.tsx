import { Component } from "solid-js";
import FloatingLayout from "../../components/FloatingLayout"; 

const UserProfile: Component = () => {
    return (
        <FloatingLayout>
            <div class="flex flex-col h-full p-4 bg-white rounded-lg">
                {/* Profile Picture and Username */}
                <div class="flex items-center justify-start space-x-4">
                    <img
                        src="https://img.freepik.com/premium-vector/people-vector_53876-25570.jpg?semt=ais_hybrid" 
                        alt="Profile"
                        class="w-28 h-28 rounded-full border-none border-gray-300"
                    />
                    <h1 class="text-4xl font-bold">John Doe</h1>
                </div>
                <h1 class="font-xl mt-8 text-2xl">Stories:</h1>
                <div class="flex flex-col space-y-4 mt-4">
                    <a href="https://example.com/story1" class="p-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200">
                        <h2 class="text-lg font-semibold">Story Title 1</h2>
                        <p class="text-gray-600">Short description of the story...</p>
                    </a>
                    <a href="https://example.com/story2" class="p-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200">
                        <h2 class="text-lg font-semibold">Story Title 2</h2>
                        <p class="text-gray-600">Short description of the story...</p>
                    </a>
                </div>
                {/* Chat Button */}
                <div class="flex justify-end w-full mt-4">
                    <button class="px-4 py-2 w-24 bg-primary text-white rounded-lg shadow-md my-8">
                        Chat
                    </button>
                </div>
            </div>
        </FloatingLayout>
    );
};

export default UserProfile;
