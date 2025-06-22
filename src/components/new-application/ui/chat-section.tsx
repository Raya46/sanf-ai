"use client";

import { ChatCard } from "@/components/new-application/ui/chat-card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp } from "lucide-react";
import {  useRef, KeyboardEvent } from "react";
import { useChat } from "@ai-sdk/react";

export function ChatSection() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat({
      api: "/api/chat",
      initialMessages: [
        {
          id: "1",
          role: "assistant",
          content:
            "Berdasarkan dokumen yang disediakan, aplikasi kredit ini terkait dengan PT Maju Bersama. Laporan keuangan menunjukkan kesehatan finansial yang stabil selama 2 tahun terakhir, dengan pertumbuhan pendapatan yang konsisten. Rekening koran 3 bulan mengkonfirmasi likuiditas yang kuat.",
        },
      ],
      onError: (error) => {
        console.error("Chat error:", error);
      },
    });

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

  return (
    <div className="flex flex-col flex-1 bg-white gap-3 m-4 p-4 rounded-lg h-[calc(100vh-2rem)]">
      <h1 className="flex-shrink-0">Credit Application</h1>
      <div className="flex-1 overflow-y-auto flex flex-col gap-3">
        {messages.map((message, index) => {
          // Extract sources from the message content or use fallback
          let sources = undefined;
          let content = message.content;

          if (message.role === "assistant") {
            // Try to extract sources from the end of the message
            const sourceMatch = content.match(/Sources?: ([^\n]+)$/);
            if (sourceMatch) {
              sources = sourceMatch[0];
              content = content.replace(/\n?Sources?: [^\n]+$/, "").trim();
            } else if (index === 0) {
              // Fallback for initial message
              sources =
                "Sources: Laporan_Keuangan_2_Tahun.pdf, Rekening_Koran_3_Bulan.pdf";
            }
          }

          return (
            <ChatCard
              key={message.id}
              color={
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-transparent"
              }
              position={message.role === "user" ? "end" : "start"}
              chat={content}
              sources={sources}
            />
          );
        })}
        {isLoading && (
          <ChatCard
            color="bg-transparent"
            position="start"
            chat="Sedang menganalisis dokumen..."
          />
        )}
        {error && (
          <ChatCard
            color="bg-red-100 text-red-800"
            position="start"
            chat={`Error: ${error.message}`}
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
    </div>
  );
}
