import { ChatCard } from "@/components/new-application/ui/chat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

export function ChatSection() {
  return (
    <div className="flex flex-col flex-1 bg-white gap-3 m-4 p-4 rounded-lg h-[calc(100vh-2rem)]">
      <h1 className="flex-shrink-0">Credit Application Overview</h1>
      <div className="flex-1 overflow-y-auto flex flex-col gap-3">
        <ChatCard
          color="transparent"
          position="start"
          chat="Berdasarkan dokumen yang disediakan, aplikasi kredit ini terkait
              dengan PT Maju Bersama. Laporan keuangan menunjukkan kesehatan
              finansial yang stabil selama 2 tahun terakhir, dengan pertumbuhan
              pendapatan yang konsisten. Rekening koran 3 bulan mengkonfirmasi
              likuiditas yang kuat."
          sources="Sources: Laporan_Keuangan_2_Tahun.pdf, Rekening_Koran_3_Bulan.pdf"
        />
        <ChatCard
          color="#007BFF"
          position="end"
          chat="Bisakah Anda merangkum poin-poin risiko utama dari aplikasi ini?"
        />
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Input placeholder="Ketik pesan Anda..." className="flex-grow" />
        <Button className="bg-blue-600">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
