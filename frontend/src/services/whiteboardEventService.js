import apiRequest from "./api";

const WHITEBOARD_ENDPOINT = "/whiteboard";

export async function getTankWhiteboardEvents(tankId) {
    return apiRequest(`${WHITEBOARD_ENDPOINT}/tank/${tankId}`);
}

export async function getWhiteboardEvent(eventId) {
    return apiRequest(`${WHITEBOARD_ENDPOINT}/${eventId}`);
}

export async function createWhiteboardEvent(
    tankId,
    userId,
    eventData
) {
    return apiRequest(
        `${WHITEBOARD_ENDPOINT}/${tankId}/${userId}`,
        {
            method: "POST",
            body: JSON.stringify(eventData)
        }
    );
}

export async function deleteWhiteboardEvent(eventId) {
    return apiRequest(
        `${WHITEBOARD_ENDPOINT}/${eventId}`,
        {
            method: "DELETE"
        }
    );
}

export async function clearWhiteboard(tankId) {
    return apiRequest(
        `${WHITEBOARD_ENDPOINT}/tank/${tankId}/clear`,
        {
            method: "DELETE"
        }
    );
}