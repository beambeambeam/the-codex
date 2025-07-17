import {
  FileArchiveIcon,
  FileIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  HeadphonesIcon,
  ImageIcon,
  VideoIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

const getFileIcon = (
  file: { file: File | { type: string; name: string } },
  className?: string,
) => {
  const fileType = file.file instanceof File ? file.file.type : file.file.type;
  const fileName = file.file instanceof File ? file.file.name : file.file.name;
  const baseClass = "size-4 opacity-60";

  if (
    fileType.includes("pdf") ||
    fileName.endsWith(".pdf") ||
    fileType.includes("word") ||
    fileName.endsWith(".doc") ||
    fileName.endsWith(".docx")
  ) {
    return <FileTextIcon className={cn(baseClass, className)} />;
  } else if (
    fileType.includes("zip") ||
    fileType.includes("archive") ||
    fileName.endsWith(".zip") ||
    fileName.endsWith(".rar")
  ) {
    return <FileArchiveIcon className={cn(baseClass, className)} />;
  } else if (
    fileType.includes("excel") ||
    fileName.endsWith(".xls") ||
    fileName.endsWith(".xlsx")
  ) {
    return <FileSpreadsheetIcon className={cn(baseClass, className)} />;
  } else if (fileType.includes("video/")) {
    return <VideoIcon className={cn(baseClass, className)} />;
  } else if (fileType.includes("audio/")) {
    return <HeadphonesIcon className={cn(baseClass, className)} />;
  } else if (fileType.startsWith("image/")) {
    return <ImageIcon className={cn(baseClass, className)} />;
  }
  return <FileIcon className={cn(baseClass, className)} />;
};

export { getFileIcon };

export function formatFileType(fileType: string): string {
  if (!fileType) return "Unknown";
  const lower = fileType.toLowerCase();

  if (lower.includes("pdf")) return "PDF";
  if (lower.includes("ppt") || lower.includes("pptx")) return "PowerPoint";
  if (lower.includes("word") || lower.includes("doc") || lower.includes("docx"))
    return "Word";
  if (lower.includes("excel") || lower.includes("xls")) return "Excel";
  if (
    lower.includes("zip") ||
    lower.includes("archive") ||
    lower.includes("rar")
  )
    return "Archive";
  if (lower.startsWith("image/")) return "Image";
  if (lower.startsWith("video/")) return "Video";
  if (lower.startsWith("audio/")) return "Audio";
  if (lower.includes("txt")) return "Text";
  return lower.split("/").pop() || "Unknown";
}
