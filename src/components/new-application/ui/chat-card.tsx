import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface ChatCardProps {
  chat: string;
  sources?: string;
  color?: string;
  position?: "start" | "end";
}

export function ChatCard({
  chat,
  sources,
  color,
  position = "start",
}: ChatCardProps) {
  const isUser = color?.includes("text-white");

  return (
    <div
      className={cn(
        "flex w-full",
        position === "end" ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn("max-w-[80%] rounded-lg p-3", color)}>
        <div
          className={cn(
            "prose prose-sm max-w-none prose-p:my-0 prose-ul:my-2 prose-ol:my-2 prose-headings:my-2",
            isUser ? "text-white" : "text-black"
          )}
        >
          <ReactMarkdown>{chat}</ReactMarkdown>
        </div>
        {sources && (
          <div
            className={cn(
              "mt-2 text-xs",
              isUser ? "text-blue-200" : "text-gray-500"
            )}
          >
            <span className="font-semibold">Sources:</span> {sources}
          </div>
        )}
      </div>
    </div>
  );
}
