import api from "../../services/api";

export const fetchDashboardOverview = () =>
  api.get("/dashboard/overview");

export const fetchRecentApplications = () =>
  api.get("/dashboard/recent-applications");

export const fetchUpcomingMeetings = () =>
  api.get("/dashboard/upcoming-meetings");