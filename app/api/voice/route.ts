// app/api/voice/route.ts

import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const audio = formData.get("audio") as Blob

    if (!audio) {
      return NextResponse.json({ error: "No audio" }, { status: 400 })
    }

    // Kirim ke Groq Whisper
    const groqForm = new FormData()
    const contentType = audio.type || "audio/mp4"
    const ext = contentType.includes("mp4") ? "mp4" 
      : contentType.includes("ogg") ? "ogg" 
      : "webm"
    groqForm.append("file", audio, `audio.${ext}`)
    groqForm.append("model", "whisper-large-v3-turbo")
    groqForm.append("language", "id")
    groqForm.append("response_format", "json")

    const groqRes = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: groqForm,
    })

    if (!groqRes.ok) {
        const err = await groqRes.text()
        console.error("Groq Whisper error:", err)
        return NextResponse.json({ error: "Transcription failed", detail: err }, { status: 500 })
    }

    if (!groqRes.ok) {
      const err = await groqRes.text()
      console.error("Groq error:", err)
      return NextResponse.json({ error: "Transcription failed" }, { status: 500 })
    }

    const data = await groqRes.json()
    return NextResponse.json({ transcript: data.text })

  } catch (err) {
    console.error("Voice API error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}