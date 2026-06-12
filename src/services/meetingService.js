import api from "./api";

export const getUpcomingMeeting = async (
  chapterId
) => {
  const response = await api.get(
    `/meeting/chapter/${chapterId}/upcoming`
  );

  return response.data;
};