"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState, useRef, KeyboardEvent } from "react";
import { useChat } from "@ai-sdk/react";
import { ChatCard } from "./chat-card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CommodityData {
  Commodity: string;
  Unit: string;
  Price: string;
  Day: string;
  "%": string;
}

interface MacroData {
  energy_prices: CommodityData[];
  // mainIndicators: IndicatorData[]; // Temporarily removed
}

export function MacroEconomicView() {
  const [data, setData] = useState<MacroData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading: isChatLoading,
  } = useChat({
    api: "/api/chat",
    body: {
      macroData: data,
    },
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content:
          "Data makroekonomi telah dimuat. Tanyakan apa pun tentang data ini atau hubungannya dengan analisis kredit.",
      },
    ],
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

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoadingData(true);
        setError(null);
        const response = await fetch("/api/macroeconomics");
        if (!response.ok) {
          throw new Error("Failed to fetch data from the server.");
        }
        const result: MacroData = await response.json();
        setData(result);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoadingData(false);
      }
    }

    fetchData();
  }, []);

  console.log(error);

  return (
    <div className="flex flex-col flex-1 gap-4 h-full overflow-y-auto p-1">
      <div className="grid gap-4 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Commodities</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingData ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Commodity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Day</TableHead>
                    <TableHead className="text-right">%</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.energy_prices.map((item) => (
                    <TableRow key={item.Commodity}>
                      <TableCell>
                        <div className="font-medium">{item.Commodity}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.Unit}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{item.Price}</TableCell>
                      <TableCell
                        className={`text-right flex items-center justify-end gap-1 ${
                          !String(item.Day).startsWith("-")
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {!String(item.Day).startsWith("-") ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )}
                        {item.Day}
                      </TableCell>
                      <TableCell
                        className={`text-right ${
                          !item["%"].startsWith("-")
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {item["%"]}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Chat Section */}
      <Card className="flex flex-col flex-1">
        <CardContent className="flex-1 flex flex-col gap-3 overflow-y-auto">
          {messages.map((message) => (
            <ChatCard
              key={message.id}
              color={
                message.role === "user" ? "bg-blue-500 text-white" : "bg-muted"
              }
              position={message.role === "user" ? "end" : "start"}
              chat={message.content}
            />
          ))}
          {isChatLoading && (
            <ChatCard color="bg-muted" position="start" chat="Analyzing..." />
          )}
        </CardContent>
        <form onSubmit={onSubmit} className="relative w-full p-4">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask about the data..."
            className="min-h-[40px] w-full resize-none rounded-2xl !text-base bg-muted pr-12"
            rows={1}
            disabled={isChatLoading || isLoadingData}
          />
          <div className="absolute bottom-4 right-4 p-2">
            <Button
              type="submit"
              disabled={isChatLoading || !input.trim()}
              className="rounded-full bg-blue-500 p-1.5 h-fit"
              size="icon"
            >
              <ArrowUp className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
