import apiRequest, {
    API_BASE_URL
} from "./api";

const MESSAGES_ENDPOINT =
    "/messages";

export async function getTankMessages(
    tankId
) {

    return apiRequest(
        `${MESSAGES_ENDPOINT}/tank/${tankId}`
    );
}

export async function sendMessage(
    tankId,
    userId,
    messageData
) {

    return apiRequest(
        `${MESSAGES_ENDPOINT}/${tankId}/${userId}`,
        {
            method: "POST",
            body: JSON.stringify(
                messageData
            )
        }
    );
}

export async function sendMessageWithAttachments(
    tankId,
    userId,
    content,
    files = []
) {

    const formData =
        new FormData();

    if (content?.trim()) {

        formData.append(
            "content",
            content.trim()
        );
    }

    files.forEach(file => {

        formData.append(
            "files",
            file
        );
    });

    return apiRequest(
        `${MESSAGES_ENDPOINT}/${tankId}/${userId}/attachments`,
        {
            method: "POST",
            body: formData
        }
    );
}

export async function updateMessage(
    messageId,
    messageData
) {

    return apiRequest(
        `${MESSAGES_ENDPOINT}/${messageId}`,
        {
            method: "PUT",
            body: JSON.stringify(
                messageData
            )
        }
    );
}

export async function deleteMessage(
    messageId
) {

    return apiRequest(
        `${MESSAGES_ENDPOINT}/${messageId}`,
        {
            method: "DELETE"
        }
    );
}

export function getAttachmentUrl(
    tankId,
    attachmentId
) {

    return (
        `${API_BASE_URL}` +
        `${MESSAGES_ENDPOINT}` +
        `/tank/${tankId}` +
        `/attachments/${attachmentId}`
    );
}