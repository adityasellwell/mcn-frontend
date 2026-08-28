import api from "./api";

// Get all slider images (public)
export const getSliderImages = async () => {
  const response = await api.get("/slider");
  return response.data;
};

// Upload a slider image (admin)
export const uploadSliderImage = async (formData) => {
  const response = await api.post("/slider", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Delete a slider image (admin)
export const deleteSliderImage = async (id) => {
  const response = await api.delete(`/slider/${id}`);
  return response.data;
};
