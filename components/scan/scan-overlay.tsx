// components/scan/scan-overlay.tsx

"use client"

import { useEffect, useRef, useState } from "react"
import { X, Loader2, Camera } from "lucide-react"

interface ScanResult {
  amount?: number
  category?: string
  note?: string
  type?: "expense" | "income"
}

interface ScanOverlayProps {
  onClose: () => void
  onScanComplete: (result: ScanResult) => void
}

export function ScanOverlay({ onClose, onScanComplete }: ScanOverlayProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Auto-trigger kamera saat overlay muncul
  useEffect(() => {
    setTimeout(() => {
      fileInputRef.current?.click()
    }, 300)
  }, [])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      onClose()
      return
    }

    setScanning(true)
    setError(null)

    try {
      const base64 = await fileToBase64(file)
      const base64Data = base64.split(",")[1]
      const mimeType = file.type || "image/jpeg"

      const groqKey = process.env.NEXT_PUBLIC_GROQ_API_KEY
      if (!groqKey) throw new Error("Groq API key tidak ditemukan")

      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${groqKey}`,
            },
            body: JSON.stringify({
                model: "meta-llama/llama-4-scout-17b-16e-instruct",
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:${mimeType};base64,${base64Data}`,
                                },
                            },
                            {
                                type: "text",
                                text: `Kamu adalah asisten keuangan. Analisis gambar ini (struk belanja, nota, atau catatan keuangan).

Ekstrak informasi berikut dan jawab HANYA dalam format JSON, tanpa teks lain:
{
  "amount": <total nominal dalam angka bulat, tanpa titik/koma, contoh: 50000>,
  "category": <salah satu dari: "Makanan & Minuman", "Transport", "Belanja", "Tagihan", "Entertainment", "Lainnya", "Gaji", "Bonus", "Freelance">,
  "note": <nama merchant atau deskripsi singkat, maks 50 karakter>,
  "type": <"expense" atau "income">
}

Aturan:
- amount harus angka bulat tanpa format (contoh: 45000 bukan 45.000)
- Jika total tidak jelas, ambil angka terbesar yang terlihat
- note berisi nama toko/merchant jika ada
- Jawab HANYA JSON, tidak ada penjelasan lain`,
                            },
                        ],
                    },
                ],
                max_tokens: 256,
                temperature: 0.1,
            }),
        }
    )
    const data = await response.json()
    const text = data.choices?.[0]?.message?.content || ""
    const cleanText = text.replace(/```json|```/g, "").trim()
    const result: ScanResult = JSON.parse(cleanText)

      if (!result.amount && !result.category) {
        throw new Error("Tidak bisa membaca struk. Coba foto lebih jelas.")
      }

      setSuccess(true)

      // Simpan result ke sessionStorage biar bisa diambil di form
      sessionStorage.setItem("scan_result", JSON.stringify(result))

      setTimeout(() => {
        onScanComplete(result)
      }, 800)

    } catch (err: any) {
      console.error("Scan error:", err)
      setError(err.message || "Gagal scan. Coba lagi.")
      setScanning(false)
    }
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Hidden file input — auto trigger kamera */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
        >
          <X className="size-5 text-white" />
        </button>
        <span className="text-white text-sm font-medium">Scan Struk</span>
        <div className="w-10" />
      </div>

      {/* Center area */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-8">

        {/* State: scanning */}
        {scanning && !success && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
              <Loader2 className="size-10 text-white animate-spin" />
            </div>
            <p className="text-white text-base font-medium">Membaca struk...</p>
            <p className="text-white/50 text-sm text-center">AI lagi analisis gambar kamu</p>
          </div>
        )}

        {/* State: success */}
        {success && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg className="size-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-white text-base font-medium">Berhasil dibaca!</p>
            <p className="text-white/50 text-sm text-center">Mengisi form...</p>
          </div>
        )}

        {/* State: error */}
        {error && (
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
              <X className="size-10 text-red-400" />
            </div>
            <p className="text-white text-base font-medium text-center">{error}</p>
            <button
              onClick={() => {
                setError(null)
                fileInputRef.current?.click()
              }}
              className="mt-2 px-6 py-3 rounded-xl bg-white text-black text-sm font-semibold"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* State: idle — waiting for camera */}
        {!scanning && !error && !success && (
          <div className="flex flex-col items-center gap-6 w-full">
            {/* Viewfinder box */}
            <div className="relative w-64 h-40">
              <div className="absolute inset-0 border-2 border-white/30 rounded-2xl" />
              {/* Corner markers */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white rounded-br-xl" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera className="size-8 text-white/40" />
              </div>
            </div>

            <div className="text-center">
              <p className="text-white text-sm font-medium">Arahkan kamera ke struk</p>
              <p className="text-white/50 text-xs mt-1">atau pilih dari galeri</p>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-8 py-3 rounded-xl bg-white text-black text-sm font-semibold"
            >
              Buka Kamera
            </button>
          </div>
        )}
      </div>

      {/* Bottom hint */}
      {!scanning && !success && (
        <div className="pb-12 flex justify-center">
          <p className="text-white/30 text-xs">Struk, nota, atau catatan keuangan</p>
        </div>
      )}
    </div>
  )
}