import apiRequest from "./api";

const MESSAGES_ENDPOINT = "/messages";

export async function getTankMessages(tankId) {
    return apiRequest(`${MESSAGES_ENDPOINT}/tank/${tankId}`);
}

export async function sendMessage(tankId, userId, messageData) {
    return apiRequest(`${MESSAGES_ENDPOINT}/${tankId}/${userId}`, {
        method: "POST",
        body: JSON.stringify(messageData)
    });
}

export async function updateMessage(messageId, messageData) {
    return apiRequest(`${MESSAGES_ENDPOINT}/${messageId}`, {
        method: "PUT",
        body: JSON.stringify(messageData)
    });
}

export async function deleteMessage(messageId) {
    return apiRequest(`${MESSAGES_ENDPOINT}/${messageId}`, {
        method: "DELETE"
    });
}