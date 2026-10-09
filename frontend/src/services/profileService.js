import apiRequest from "./api";

export async function getProfile() {
    return apiRequest("/users/me");
}

export async function updateProfile(profileData) {
    return apiRequest("/users/me", {
        method: "PUT",
        body: JSON.stringify(profileData)
    });
}