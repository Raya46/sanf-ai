"use client";

import { useChat, Message } from "@ai-sdk/react";
import { ArrowUp } from "lucide-react";
import { Fragment, KeyboardEvent, useEffect, useRef } from "react";
import { ActiveView } from "@/app/dashboard/[projectId]/new-application/[applicationId]/page";
import { ChatCard } from "@/components/new-application/ui/chat-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { MacroEconomicView } from "./macro-economic-view";
import { ChartBarNegative } from "./negative-bar-chart";
import { CreditApplication, ChatMessage as DbChatMessage } from "@/lib/types";

interface ChatSectionProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  applicationData?: CreditApplication | null;
  isLoadingData: boolean;
  errorData?: Error | null;
  initialMessages: DbChatMessage[];
  isLoadingChat: boolean;
  applicationId: string;
}

export function ChatSection({
  activeView,
  setActiveView,
  applicationData,
  initialMessages,
  isLoadingChat,
  applicationId,
}: ChatSectionProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const formattedInitialMessages: Message[] = initialMessages.map((msg) => ({
    id: msg.id,
    role: msg.sender_type === "ai" ? "assistant" : "user",
    content: msg.message_content,
  }));

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    data,
    setMessages,
  } = useChat({
    api: "/api/chat",
    body: { applicationId },
    initialMessages: formattedInitialMessages,
  });

  useEffect(() => {
    setMessages(formattedInitialMessages);
  }, [formattedInitialMessages, setMessages]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleSubmit(e);
    }
  };

  const lastData = data?.[data.length - 1] as { status?: string } | undefined;
  const statusMessage = lastData?.status ?? "Sedang menganalisis dokumen...";

  const parseMessage = (content: string) => {
    const sourceMatch = content.match(/Sumber: (.*)$/);
    const sources = sourceMatch ? sourceMatch[1] : undefined;
    const mainContent = sourceMatch
      ? content.replace(/Sumber: .*$/, "").trim()
      : content;
    return { mainContent, sources };
  };

  return (
    <div className="flex flex-col flex-1 bg-white gap-3 m-4 p-4 rounded-lg h-[calc(100vh-2rem)]">
      <Tabs
        value={activeView}
        onValueChange={(value) => setActiveView(value as ActiveView)}
        className="flex flex-col h-full"
      >
        <TabsList>
          <TabsTrigger value="credit-application">
            Credit Application
          </TabsTrigger>
          <TabsTrigger value="macroeconomics">Macroeconomics</TabsTrigger>
        </TabsList>
        <TabsContent
          value="credit-application"
          className="flex-1 flex flex-col gap-3 mt-2 overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto flex flex-col gap-3">
            {isLoadingChat && (
              <ChatCard
                color="bg-transparent"
                position="start"
                chat="Loading chat history..."
              />
            )}

            {messages.map((message, index) => {
              const { mainContent, sources } = parseMessage(message.content);
              return (
                <Fragment key={message.id}>
                  <ChatCard
                    color={
                      message.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-transparent"
                    }
                    position={message.role === "user" ? "end" : "start"}
                    chat={mainContent}
                    sources={sources}
                  />
                  {index === 0 &&
                    message.role === "assistant" &&
                    applicationData && (
                      <div className="px-4 py-2">
                        <ChartBarNegative
                          data={applicationData.revenue || []}
                        />
                      </div>
                    )}
                </Fragment>
              );
            })}
            {isLoading && (
              <ChatCard
                color="bg-transparent"
                position="start"
                chat={statusMessage}
              />
            )}
          </div>
          <form onSubmit={onSubmit} className="relative w-full flex-shrink-0">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ketik pesan Anda..."
              className="min-h-[24px] max-h-[calc(75dvh)] overflow-hidden resize-none rounded-2xl !text-base bg-muted pb-10 pr-12"
              rows={2}
              disabled={isLoading}
            />
            <div className="absolute bottom-0 right-0 p-2 w-fit flex flex-row justify-end">
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="rounded-full bg-blue-500 p-1.5 h-fit border"
                size="icon"
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </TabsContent>
        <TabsContent
          value="macroeconomics"
          className="flex-1 mt-2 overflow-hidden"
        >
          <MacroEconomicView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
