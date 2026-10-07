import apiRequest from "./api";

const TIMERS_ENDPOINT = "/timers";

export async function getTankTimers(tankId) {
    return apiRequest(
        `${TIMERS_ENDPOINT}/tank/${tankId}`
    );
}

export async function getTimer(
    tankId,
    timerId
) {
    return apiRequest(
        `${TIMERS_ENDPOINT}/tank/${tankId}/${timerId}`
    );
}

export async function createTimer(
    tankId,
    timerData
) {
    return apiRequest(
        `${TIMERS_ENDPOINT}/tank/${tankId}`,
        {
            method: "POST",
            body: JSON.stringify(timerData)
        }
    );
}

export async function updateTimer(
    tankId,
    timerId,
    timerData
) {
    return apiRequest(
        `${TIMERS_ENDPOINT}/tank/${tankId}/${timerId}`,
        {
            method: "PUT",
            body: JSON.stringify(timerData)
        }
    );
}

export async function deleteTimer(
    tankId,
    timerId
) {
    return apiRequest(
        `${TIMERS_ENDPOINT}/tank/${tankId}/${timerId}`,
        {
            method: "DELETE"
        }
    );
}