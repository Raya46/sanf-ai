import { Card } from "@/components/ui/card";

interface ChatCardProps {
  color: string;
  position: string;
  chat: string;
  sources?: string;
}

export function ChatCard({ color, position, chat, sources }: ChatCardProps) {
  const hasTransparentBackground = color.includes("bg-transparent");
  return (
    <Card className={`p-4 self-${position} ${color} ${hasTransparentBackground ? "" : "border"}`}>
      <p>{chat}</p>
      {sources ? <p>{sources}</p> : null}
    </Card>
  );
}
