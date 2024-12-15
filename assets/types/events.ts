import { DOMElement } from "solid-js/jsx-runtime";

export type InputEventType = InputEvent & {
    currentTarget: HTMLInputElement;
    target: HTMLInputElement;
};

export type FormSubmitEventType = SubmitEvent & {
    currentTarget: HTMLFormElement;
    target: DOMElement;
};

export type InputEventTextAreaType = InputEvent & {
    currentTarget: HTMLTextAreaElement;
    target: HTMLTextAreaElement;
};