import api from "../../services/api";

// ─── Fetch all payments ───
export const fetchAllPayments = () =>
  api.get("/payment");

// ─── Fetch pending payments ───
export const fetchPendingPayments = () =>
  api.get("/payment/pending");

// ─── Approve member payment ───
export const approveMemberPayment = (id) =>
  api.patch(`/payment/member/${id}/approve`);

// ─── Reject member payment ───
export const rejectMemberPayment = (id) =>
  api.patch(`/payment/member/${id}/reject`);

// ─── Approve visitor payment ───
export const approveVisitorPayment = (id) =>
  api.patch(`/payment/visitor/${id}/approve`);

// ─── Reject visitor payment ───
export const rejectVisitorPayment = (id) =>
  api.patch(`/payment/visitor/${id}/reject`);