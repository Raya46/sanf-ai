import { Button } from "@/components/ui/button";
import { Sparkles, Download, User } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="flex items-center justify-end p-4 bg-white border-b border-gray-200">
      <div className="flex items-center gap-3">
        <Button className="bg-blue-500 hover:bg-blue-600 text-white">
          <Sparkles className="w-4 h-4 mr-2" />
          View AI Analysis
        </Button>
        <Button
          size="icon"
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          <Download className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="text-gray-600 hover:text-gray-900"
        >
          <User className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
