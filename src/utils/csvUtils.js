import dayjs from "dayjs";

export const downloadAsCSV = (appointments, selecteDate) => {
  const csvContent = [
    "Agent$Date$Name$Phone(fixe)$Phone(mobile)$Address$Date programmation$Commercial",
    ...(appointments?.docs || []).map((item) => {
      const agent = item.userId?.firstName;
      return [
        agent,
        dayjs(item.createdAt).format("DD/MM/YY HH:mm"),
        item.name,
        item.phone_1,
        item.phone_2,
        item.address,
        dayjs(item.date).format("DD/MM/YY HH:mm"),
        item.commercial,
      ].join("$");
    }),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = `${selecteDate}-appointments.csv`;
  link.click();

  return blob;
};
