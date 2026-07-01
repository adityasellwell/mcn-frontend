import api from "./api";

export const getUpcomingMeeting = async (
  chapterId
) => {
  const response = await api.get(
    `/meeting/chapter/${chapterId}/upcoming`
  );

  return response.data;
};

export const getUpcomingMeetings = async () => {
  const response = await api.get(`/dashboard/upcoming-meetings`);

  return response.data;
};