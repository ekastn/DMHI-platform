import { UserType } from "./user.";

export type StoryType = {
    id: number;
    title: string;
    content: string;
    user: UserType;
    createdAt: Date;
    updateAt: Date;
    pin: PinType;
};

export type PinType = {
    latitude: number;
    longitude: number;
};
