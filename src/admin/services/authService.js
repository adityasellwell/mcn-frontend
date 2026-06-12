import api from "../../services/api";

export const loginAdmin = (credentials) =>
  api.post("/admin/login", credentials);