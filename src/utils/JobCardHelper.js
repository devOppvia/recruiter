export const getStatusBadgeColor = (status) => {
  switch (status) {
    case "Approved": return "bg-[#E7F7EE] text-[#0DAC53] border border-[#0DAC5326]";
    case "Paused": return "bg-[#DA90281A] text-[#DA9028] border border-[#DA902826]";
    case "Completed": return "bg-[#A0A6EF42] text-[#0028C8] border border-[#1C5EA926]";
    case "Rejected": return "bg-[#FEE7E7] text-[#F40909] border border-[#F4090926]";
    case "Draft": return "bg-[#8888881A] text-[#727272] border border-[#EDEDED]";
    case "Review": return "bg-[#9750FB1A] text-[#7E28DA] border border-[#8D41DF33]";


    default: return "bg-gray-100 text-gray-800";
  }
};


export const getCandidateBadgeColor = (status) => {
  switch (status) {
    case "Hired": return "bg-[#E7F7EE] text-[#0DAC53] border border-[#0DAC5326]";
    case "Shortlisted": return "bg-[#DA90281A] text-[#DA9028] border border-[#DA902826]";
    case "Completed": return "bg-[#A0A6EF42] text-[#0028C8] border border-[#1C5EA926]";
    case "Rejected": return "bg-[#FEE7E7] text-[#F40909] border border-[#F4090926]";
    case "Review": return "bg-[#9750FB1A] text-[#7E28DA] border border-[#8D41DF33]";
    case "Interview": return "bg-[#64AFF51A] text-[#2875DA] border border-[#0466B726]";



    default: return "bg-gray-100 text-gray-800";
  }
};

export const getBadgeColor = (status) => {
  switch (status) {
    case "APPROVED": return "text-[#0DAC53] ";
    case "PAUSED": return "text-[#DA9028] ";
    case "COMPLETED": return "text-[#0028C8] ";
    case "REJECTED": return " text-[#F40909] ";
    case "DRAFT": return "text-[#727272] ";


    default: return "text-gray-800";
  }
};






export const getTypeColor = (type) =>
  type === "Paid" ? "text-orange-500" : "text-green-500";


export const formatInterviewDateTime = (dateStr, timeStr) => {
  try {
    // Guard against invalid or missing values
    if (!dateStr || !timeStr) return "";

    // Some APIs send date like '20-11-2025' — convert to ISO if needed
    let isoDate = dateStr;
    if (dateStr.includes("-") && dateStr.split("-")[0].length !== 4) {
      // convert dd-mm-yyyy → yyyy-mm-dd
      const [day, month, year] = dateStr.split("-");
      isoDate = `${year}-${month}-${day}`;
    }

    const dateTimeString = `${isoDate}T${timeStr}`;
    const date = new Date(dateTimeString);

    // Still invalid? Return gracefully
    if (isNaN(date.getTime())) return "";

    // Format the readable date/time
    return new Intl.DateTimeFormat("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  } catch (err) {
    console.error("Date formatting error:", err);
    return "";
  }
};



export const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};


export const formatStipend = (num) => {
  if (!num) return "0";

  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + "K";

  // For smaller numbers, add commas
  return Number(num).toLocaleString();
};
