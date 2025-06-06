import { Separator } from "@/components/ui/separator";

export function ListItem({ title }: { title: string }) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center gap-3 py-4">
        <div className="bg-blue-600 p-1.5 rounded-full border border-black"></div>
        <p>{title}</p>
      </div>
      <Separator />
    </div>
  );
}
