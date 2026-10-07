import apiRequest from "./api";

export async function getRecentActivities() {
  return apiRequest("/activities/recent");
}