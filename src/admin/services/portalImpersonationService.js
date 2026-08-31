import api from "../../services/api";

// ─── Admin-only: log directly into a Member/Visitor's portal session.
// Uses the ADMIN-authenticated api instance (mcn_token), not portalApi —
// this call itself is an admin action, only its *result* is a portal
// session. ───
export const impersonatePortalUser = (role, id) =>
  api.post(`/portal/auth/impersonate/${role}/${id}`);

// ─── Stores the returned portal session under the portal's own
// localStorage keys and opens the portal dashboard in a new tab, leaving
// the admin's own session in the current tab untouched. ───
export const openPortalAsUser = async (role, id) => {
  const res = await impersonatePortalUser(role, id);
  const { user, accessToken } = res.data.data;

  localStorage.setItem("mcn_portal_user", JSON.stringify({ ...user, impersonated: true }));
  localStorage.setItem("mcn_portal_token", accessToken);

  window.open("/portal/dashboard", "_blank", "noopener,noreferrer");
};
