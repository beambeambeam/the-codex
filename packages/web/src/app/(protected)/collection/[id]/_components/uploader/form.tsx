import CollectionUploaderFile from "@/app/(protected)/collection/[id]/_components/uploader/uploader";

function CollectionFileForm() {
  return (
    <div className="grid h-full w-full grid-cols-[3fr_2fr]">
      <div className="h-full w-full"></div>
      <div className="grid h-full w-full grid-rows-[auto_1fr]">
        <CollectionUploaderFile initialFiles={[]} />
        <div>d</div>
      </div>
    </div>
  );
}
export default CollectionFileForm;
