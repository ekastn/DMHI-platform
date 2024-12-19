import axios from "axios";
import { APIResponseType } from "../types/api";

type PinType = {
    id: number;
    latitude: number;
    longitude: number;
    storyId: number;
};

type ListPinPayload = { pins: PinType[] };

export const getListOfPinsApi = async () => {
    const { data } = await axios.get<APIResponseType<ListPinPayload>>("/api/pin/");
    return data;
};
