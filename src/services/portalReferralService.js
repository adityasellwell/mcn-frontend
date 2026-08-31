import portalApi from "./portalApi";

export const getPortalReferrals = () => portalApi.get("/portal/referrals");

export const createPortalReferral = (data) => portalApi.post("/portal/referrals", data);

export const invitePortalVisitor = (data) => portalApi.post("/portal/invite", data);

export const getPortalMembers = () => portalApi.get("/portal/members");
