export type StoryType = {
    id: number;
    title: string;
    content: string;
    user: string;
    created_at: Date;
    update_at: Date;
    pin: PinType;
};

export type PinType = { 
    latitude: number;
    longitude: number;
};