import portalApi from "./portalApi";

export const getPortalMeetings = () => portalApi.get("/portal/meetings");

export const registerPortalMeeting = (meetingId) =>
  portalApi.post(`/portal/meetings/${meetingId}/register`);

export const uploadPortalMeetingPayment = (meetingId, formData) =>
  portalApi.patch(`/portal/meetings/${meetingId}/payment`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
