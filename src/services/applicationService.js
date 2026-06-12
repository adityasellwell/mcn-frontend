import axios from "axios";

const API_URL = "http://localhost:5000/api/application";

export const createApplication = async (data) => {
  const formData = new FormData();

  // ─── Append scalar fields only ───
  const scalarFields = [
    "registrationType", "chapterId", "chapterName",
    "meetingId", "fullName", "mobile", "email",
    "companyName", "businessCategory", "website",
    "address", "referredBy", "utrNumber",
  ];

  scalarFields.forEach((key) => {
    if (data[key] !== null && data[key] !== undefined && data[key] !== "") {
      formData.append(key, data[key]);
    }
  });

  // ─── Serialize socialProfiles array as JSON string ───
  if (data.socialProfiles && data.socialProfiles.length > 0) {
    formData.append("socialLinks", JSON.stringify(data.socialProfiles));
  }

  // ─── Append screenshot file if provided ───
  if (data.screenshot) {
    formData.append("screenshot", data.screenshot);
  }

  // ─── DEBUG ───
  console.log("socialLinks being sent:", data.socialProfiles);

  const response = await axios.post(API_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};