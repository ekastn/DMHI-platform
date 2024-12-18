export const catchError = <T, E extends new (message?: string) => Error>(
    promise: Promise<T>,
    errorsToCatch?: E[]
): Promise<[undefined, T] | [Error]> => {
    return promise
        .then((data) => [undefined, data] as [undefined, T])
        .catch((error) => {
            if (errorsToCatch == undefined) {
                return [error];
            }
            if (errorsToCatch.some((e) => error instanceof e)) {
                return [error];
            }
            throw error;
        });
};

export const formatDate = (input: string | Date): string => {
    const date = input instanceof Date ? input : new Date(input);

    if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
    }

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");

    const ordinal = (n: number): string => {
        if (n > 3 && n < 21) return "th";
        switch (n % 10) {
            case 1:
                return "st";
            case 2:
                return "nd";
            case 3:
                return "rd";
            default:
                return "th";
        }
    };

    return `${month} ${day}${ordinal(day)} ${year}, ${hours}:${minutes}`;
};
