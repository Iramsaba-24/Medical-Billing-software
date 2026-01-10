import { Download, Upload, Print, RestartAlt, ContentCopy } from "@mui/icons-material";
import { IconEyeSearch, IconPencilMinus, IconShare3, IconCircleCheck, IconCircleX, IconLibraryPlus, IconSend, IconPhone, IconTrashX } from "@tabler/icons-react";
 
export const iconMap = {
  view: { icon: <IconEyeSearch stroke={2} />, label: "View", color: "#1976d2" },
  edit: { icon: <IconPencilMinus stroke={2} />, label: "Edit", color: "#2e7d32" },
  delete: { icon: <IconTrashX stroke={2} />, label: "Delete", color: "#f40e0eff" },
  download: { icon: <Download />, label: "Download", color: "#2e7d32" },
  upload: { icon: <Upload />, label: "Upload", color: "#ed6c02" },
  print: { icon: <Print />, label: "Print", color: "#000000" },
  reset: { icon: <RestartAlt />, label: "Reset", color: "#ed6c02" },
  copy: { icon: <ContentCopy />, label: "Copy", color: "#2e7d32" },
  send: { icon: <IconSend stroke={2} />, label: "Send", color: "#1976d2" },
  approve: { icon: <IconCircleCheck stroke={2} />, label: "Approve", color: "#2e7d32" },
  reject: { icon: <IconCircleX stroke={2} />, label: "Reject", color: "#d32f2f" },
  share: { icon: <IconShare3 stroke={2} />, label: "Reject", color: "#d32f2f" },
  plus: { icon: <IconLibraryPlus stroke={2} />, label: "Reject", color: "#d32f2f" },
  phone: { icon: <IconPhone stroke={2} />, label: "Reject", color: "#d32f2f" },
};
 