import { Wwwk } from "@/components/wwwk";

function Footer() {
  return (
    <div className="flex items-center justify-center gap-4 border-t-2 border-dashed p-10">
      <Wwwk size="sm" />
      <div className="flex flex-col text-lg">
        <h1 className="flex items-center gap-1">
          Make with{" "}
          {/* biome-ignore lint/correctness/useImageSize: width/height can be provided via props for flexible sizing */}
          <img
            alt="love"
            className="inline h-5 w-5"
            src="/static/logos/love.svg"
          />{" "}
          by
        </h1>
        <h1 className="font-bold">World Wide Web KMUTT</h1>
      </div>
    </div>
  );
}
export default Footer;
