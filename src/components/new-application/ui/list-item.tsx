import { Check, File, LoaderCircle, AlertTriangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function ListItem({
  title,
  uploadStatus,
}: {
  title: string;
  uploadStatus: "pending" | "uploading" | "uploaded" | "error";
}) {
  const getStatusIcon = () => {
    switch (uploadStatus) {
      case "uploading":
        return (
          <div className="bg-yellow-100 p-1.5 rounded-full">
            <LoaderCircle size={16} className="text-yellow-500 animate-spin" />
          </div>
        );
      case "uploaded":
        return (
          <div className="bg-green-100 p-1.5 rounded-full">
            <Check size={16} className="text-green-500" />
          </div>
        );
      case "error":
        return (
          <div className="bg-red-100 p-1.5 rounded-full">
            <AlertTriangle size={16} className="text-red-500" />
          </div>
        );
      case "pending":
      default:
        return (
          <div className="bg-gray-100 p-1.5 rounded-full">
            <File size={16} className="text-gray-400" />
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center gap-3 py-4">
        {getStatusIcon()}
        <p
          className={
            uploadStatus === "uploaded" ? "text-gray-500 line-through" : ""
          }
        >
          {title}
        </p>
      </div>
      <Separator />
    </div>
  );
}
