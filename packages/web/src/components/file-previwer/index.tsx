import Image from "next/image";
import { FileX2Icon } from "lucide-react";

import type { FileMetadata } from "@/hooks/use-file-upload";

interface FilePreviwerProps {
  file: FileMetadata | File;
}

function getFileType(file: FileMetadata | File) {
  const type = file instanceof File ? file.type : file.type;
  const name = file instanceof File ? file.name : file.name;
  return { type, name };
}

function FilePreviwer({ file }: FilePreviwerProps) {
  const { type, name } = getFileType(file);
  let url: string | undefined = undefined;
  if (file instanceof File) {
    url = URL.createObjectURL(file);
  } else if (typeof (file as FileMetadata).url === "string") {
    url = (file as FileMetadata).url;
  }

  // Render preview based on file type
  if (type.startsWith("image/") && url) {
    return (
      <div className="relative flex h-full max-h-full min-h-[200px] w-full max-w-full items-center justify-center overflow-hidden">
        <Image src={url} alt={name} fill className="object-contain" />
      </div>
    );
  } else if (type.startsWith("video/") && url) {
    return <video src={url} controls width={180} className="h-full w-full" />;
  } else if (type.startsWith("audio/") && url) {
    return <audio src={url} controls className="w-full" />;
  } else if ((type.includes("pdf") || name.endsWith(".pdf")) && url) {
    return <embed src={url} type="application/pdf" className="h-full w-full" />;
  }

  return (
    <div className="text-muted-foreground flex h-full w-full flex-col items-center gap-2">
      <FileX2Icon className="size-20" strokeWidth={1.25} />
      <span className="text-base">
        Can&apos;t preview this type ({type}) of file
      </span>
    </div>
  );
}

export default FilePreviwer;
