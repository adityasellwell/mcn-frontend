import api from "./api";

// ─── Look up an existing member by phone + email (public Register page) ───
export const lookupMember = async (phone, email) => {
  const response = await api.get("/member/lookup", {
    params: { phone, email },
  });

  return response.data;
};
