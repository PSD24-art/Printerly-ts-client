export const getStatusStyle = (status: string) => {
  switch (status?.toLowerCase()) {
    case "accepted":
      return "bg-emerald-50 text-emerald-700";
    case "Accepted":
      return "bg-emerald-50 text-emerald-700";
    case "rejected":
      return "bg-red-50 text-red-700";
    case "Rejected":
      return "bg-emerald-50 text-emerald-700";
    case "completed":
      return "bg-blue-50 text-blue-700";
    case "Completed":
      return "bg-blue-50 text-blue-700";
    case "pending":
      return "bg-amber-50 text-amber-700";
    case "Pending":
      return "bg-amber-50 text-amber-700";
    default:
      return "bg-amber-50 text-amber-700";
  }
};
