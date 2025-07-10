"use client";

import { ChatSection } from "@/components/new-application/ui/chat-section";
import { AnalyticsSidebar } from "@/components/new-application/ui/analytics-sidebar";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CreditApplication, ChatMessage } from "@/lib/types";

export type ActiveView = "credit-application" | "macroeconomics";

export default function CreditChat() {
  const params = useParams();
  const applicationId = params.applicationId as string;
  const [activeView, setActiveView] =
    useState<ActiveView>("credit-application");

  // State for application data
  const [applicationData, setApplicationData] =
    useState<CreditApplication | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [errorData, setErrorData] = useState<Error | null>(null);

  // State for chat messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoadingChat, setIsLoadingChat] = useState(true);

  // Fetch application data
  useEffect(() => {
    if (!applicationId) return;
    const fetchData = async () => {
      setIsLoadingData(true);
      setErrorData(null);
      try {
        const response = await fetch(`/api/applications/${applicationId}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data: CreditApplication = await response.json();
        setApplicationData(data);
      } catch (err) {
        setErrorData(err as Error);
        console.error("Failed to fetch application data:", err);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchData();
  }, [applicationId]);

  // Fetch chat history
  useEffect(() => {
    if (!applicationId) return;
    const fetchChat = async () => {
      setIsLoadingChat(true);
      try {
        const response = await fetch(`/api/applications/${applicationId}/chat`);
        if (!response.ok) {
          throw new Error("Failed to fetch chat history");
        }
        const data: ChatMessage[] = await response.json();
        setChatMessages(data);
      } catch (err) {
        console.error("Chat history fetch error:", err as Error);
        // Not setting a state error here to avoid blocking the UI
      } finally {
        setIsLoadingChat(false);
      }
    };
    fetchChat();
  }, [applicationId]);

  return (
    <div className="flex h-screen p-4 gap-4">
      <ChatSection
        activeView={activeView}
        setActiveView={setActiveView}
        applicationData={applicationData}
        isLoadingData={isLoadingData}
        errorData={errorData}
        initialMessages={chatMessages}
        isLoadingChat={isLoadingChat}
        applicationId={applicationId}
      />
      <AnalyticsSidebar applicationId={applicationId} activeView={activeView} />
    </div>
  );
}
