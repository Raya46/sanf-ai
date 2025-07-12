"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { CreditApplication } from "@/lib/types";
import { useChat } from "@ai-sdk/react";
import { LoaderCircle, Bold, Italic } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface PdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationData: CreditApplication | null;
}

export function PdfExportModal({
  isOpen,
  onClose,
  applicationData,
}: PdfExportModalProps) {
  const [showAiPromptInput, setShowAiPromptInput] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  const editor = useEditor({
    extensions: [StarterKit],
    content: "", // Initial content will be set by useEffect
    immediatelyRender: false, // Fix for SSR hydration mismatch
    onUpdate: ({ editor }) => {
      console.log(editor); // Satisfy linter
    },
  });

  const { input, handleInputChange, handleSubmit, isLoading, setInput } =
    useChat({
      api: `/api/applications/${applicationData?.id}/enhance-ai`, // New API endpoint
      initialMessages: [], // We will manage messages manually for enhancement
      onFinish: (message) => {
        if (editor) {
          editor.commands.setContent(message.content); // Set editor content with AI response
        }
        setInput(""); // Clear AI prompt input after response
        setShowAiPromptInput(false); // Hide AI prompt input after response
      },
      onError: (error) => {
        console.error("AI enhancement error:", error);
        // TODO: Show error to user
      },
    });

  useEffect(() => {
    if (editor && applicationData && applicationData.ai_analysis) {
      editor.commands.setContent(applicationData.ai_analysis);
    }
  }, [editor, applicationData]);

  const handleDone = async () => {
    if (!applicationData?.id || !editor) {
      console.error("Application ID or editor is missing.");
      return;
    }

    const finalContent = editor.getHTML(); // Get HTML content from editor

    try {
      const response = await fetch(`/api/applications/${applicationData.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ai_analysis: finalContent }),
      });

      if (!response.ok) {
        throw new Error("Failed to update AI analysis.");
      }

      console.log("AI analysis updated successfully!");

      // Generate PDF
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Credit Analysis Report</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1, h2, h3 { color: #333; }
                b, strong { font-weight: bold; }
                i, em { font-style: italic; }
                ul, ol { margin-left: 20px; }
                p { margin-bottom: 10px; }
              </style>
            </head>
            <body>
              ${finalContent}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      } else {
        console.error("Failed to open print window.");
      }

      onClose();
    } catch (error) {
      console.error("Error updating AI analysis:", error);
      // TODO: Show error to user
    }
  };

  const handleEnhanceWithAi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !editor) return;

    // Manually construct the body for the handleSubmit call
    const body = {
      currentContent: editor.getHTML(),
      userPrompt: input,
    };

    // Trigger AI generation with the custom body
    handleSubmit(new Event("submit"), {
      body: body,
    });
  };

  if (!editor) {
    return null; // Or a loading spinner
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Export Analysis to PDF</DialogTitle>
          <DialogDescription>
            Review and edit the AI analysis results before exporting.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden p-4 border rounded-lg bg-white shadow-inner flex flex-col">
          <div className="flex gap-1 mb-2">
            <Button
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editor.can().chain().focus().toggleBold().run()}
              variant="outline"
              size="sm"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
              variant="outline"
              size="sm"
            >
              <Italic className="h-4 w-4" />
            </Button>
          </div>
          <EditorContent
            editor={editor}
            className="w-full h-full overflow-y-auto text-base prose max-w-none"
          />
          {showAiPromptInput && (
            <form onSubmit={handleEnhanceWithAi} className="flex gap-2 mt-2">
              <Textarea
                ref={textareaRef}
                value={input} // Use input from useChat
                onChange={handleInputChange} // Use handleInputChange from useChat
                placeholder="Enter your prompt to enhance with AI..."
                className="min-h-[40px] max-h-[100px] resize-none"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                {isLoading ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  "Enhance"
                )}
              </Button>
            </form>
          )}
        </div>
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            onClick={() => setShowAiPromptInput(!showAiPromptInput)}
          >
            {showAiPromptInput ? "Hide AI Prompt" : "Enhance with AI"}
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleDone}>Done</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
