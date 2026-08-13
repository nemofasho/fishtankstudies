import apiRequest from "./api";

const TIMERS_ENDPOINT = "/timers";

export async function getTankTimers(tankId) {
    return apiRequest(`${TIMERS_ENDPOINT}/tank/${tankId}`);
}

export async function getTimer(timerId) {
    return apiRequest(`${TIMERS_ENDPOINT}/${timerId}`);
}

export async function createTimer(tankId, timerData) {
    return apiRequest(`${TIMERS_ENDPOINT}/tank/${tankId}`, {
        method: "POST",
        body: JSON.stringify(timerData)
    });
}

export async function updateTimer(timerId, timerData) {
    return apiRequest(`${TIMERS_ENDPOINT}/${timerId}`, {
        method: "PUT",
        body: JSON.stringify(timerData)
    });
}

export async function deleteTimer(timerId) {
    return apiRequest(`${TIMERS_ENDPOINT}/${timerId}`, {
        method: "DELETE"
    });
}