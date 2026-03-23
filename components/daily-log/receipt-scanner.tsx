// components/daily-log/receipt-scanner.tsx

"use client"

import { useRef, useState } from "react"
import { Camera, X, Loader2 } from "lucide-react"

interface ScanResult {
  amount?: number
  category?: string
  note?: string
  type?: "expense" | "income"
}

interface ReceiptScannerProps {
  onScanComplete: (result: ScanResult) => void
}

export function ReceiptScanner({ onScanComplete }: ReceiptScannerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [scanning, setScanning] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)

    // Preview gambar
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)

    // Proses dengan Gemini
    await scanWithGemini(file)

    // Reset input biar bisa scan ulang foto yang sama
    e.target.value = ""
  }

  const scanWithGemini = async (file: File) => {
    setScanning(true)
    setError(null)

    try {
      // Convert ke base64
      const base64 = await fileToBase64(file)
      const base64Data = base64.split(",")[1]
      const mimeType = file.type || "image/jpeg"

      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
      if (!apiKey) throw new Error("Gemini API key tidak ditemukan")

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    inline_data: {
                      mime_type: mimeType,
                      data: base64Data,
                    },
                  },
                  {
                    text: `Kamu adalah asisten keuangan. Analisis gambar ini (struk belanja, nota, atau catatan keuangan).

Ekstrak informasi berikut dan jawab HANYA dalam format JSON, tanpa teks lain:
{
  "amount": <total nominal dalam angka bulat, tanpa titik/koma, contoh: 50000>,
  "category": <salah satu dari: "Makanan & Minuman", "Transport", "Belanja", "Tagihan", "Entertainment", "Lainnya", "Gaji", "Bonus", "Freelance">,
  "note": <nama merchant atau deskripsi singkat, maks 50 karakter>,
  "type": <"expense" atau "income">
}

Aturan:
- Jika tidak ada gambar struk/nota yang jelas, tetap berikan estimasi terbaik
- amount harus angka bulat tanpa format (contoh: 45000 bukan 45.000)
- Jika total tidak jelas, ambil angka terbesar yang terlihat
- note berisi nama toko/merchant jika ada, atau deskripsi singkat
- Jawab HANYA JSON, tidak ada penjelasan lain`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 256,
            },
          }),
        }
      )

      if (!response.ok) {
        throw new Error(`Gemini error: ${response.status}`)
      }

      const data = await response.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ""

      // Parse JSON dari response
      const cleanText = text.replace(/```json|```/g, "").trim()
      const result: ScanResult = JSON.parse(cleanText)

      // Validasi result
      if (!result.amount && !result.category) {
        throw new Error("Tidak bisa membaca struk. Coba foto yang lebih jelas.")
      }

      onScanComplete(result)
      setPreview(null)

    } catch (err: any) {
      console.error("Scan error:", err)
      if (err.message.includes("JSON")) {
        setError("Format response AI tidak valid. Coba lagi.")
      } else {
        setError(err.message || "Gagal scan struk. Coba lagi.")
      }
      setPreview(null)
    } finally {
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

  const cancelPreview = () => {
    setPreview(null)
    setScanning(false)
    setError(null)
  }

  // Loading state
  if (scanning) {
    return (
      <div className="flex items-center justify-center gap-3 py-4 px-4 bg-muted/50 rounded-xl border border-dashed border-border">
        <Loader2 className="size-5 animate-spin text-primary" />
        <div>
          <p className="text-sm font-medium">Membaca struk...</p>
          <p className="text-xs text-muted-foreground">AI lagi analisis gambar</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="py-3 px-4 bg-destructive/10 rounded-xl border border-destructive/20">
        <p className="text-sm text-destructive">{error}</p>
        <button
          onClick={() => { setError(null); fileInputRef.current?.click() }}
          className="text-xs text-primary underline mt-1"
        >
          Coba lagi
        </button>
      </div>
    )
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dashed border-border bg-muted/30 hover:bg-muted/60 transition-colors text-sm text-muted-foreground hover:text-foreground"
      >
        <Camera className="size-4" />
        <span>Scan struk / foto nota</span>
      </button>
    </>
  )
}