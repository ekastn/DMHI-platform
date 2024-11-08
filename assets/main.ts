import Experience from "./experience/Experience";

const experienceContainer = document.querySelector("#experience-container") as HTMLElement;
const experience = new Experience(experienceContainer);

experience.start();
