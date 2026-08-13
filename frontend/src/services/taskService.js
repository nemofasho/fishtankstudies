import apiRequest from "./api";

const TASKS_ENDPOINT = "/tasks";

export async function getTankTasks(tankId) {
    return apiRequest(`${TASKS_ENDPOINT}/tank/${tankId}`);
}

export async function getTask(taskId) {
    return apiRequest(`${TASKS_ENDPOINT}/${taskId}`);
}

export async function createTask(tankId, taskData) {
    return apiRequest(`${TASKS_ENDPOINT}/${tankId}`, {
        method: "POST",
        body: JSON.stringify(taskData)
    });
}

export async function updateTask(taskId, taskData) {
    return apiRequest(`${TASKS_ENDPOINT}/${taskId}`, {
        method: "PUT",
        body: JSON.stringify(taskData)
    });
}

export async function deleteTask(taskId) {
    return apiRequest(`${TASKS_ENDPOINT}/${taskId}`, {
        method: "DELETE"
    });
}