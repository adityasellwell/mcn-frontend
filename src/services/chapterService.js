// services/chapterService.js

import api from "./api";

export const getChapters = async () => {
  const response = await api.get(
    "/chapter/public"
  );

  return response.data;
};