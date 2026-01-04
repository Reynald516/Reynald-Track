"use server"

import { createSupabaseServerClient } from "@/src/lib/supabase/server"

export type CreateTransactionResult =
  | {
      ok: true
      transaction: {
        id: string
        amount: number
        category: string
        wallet: string
        type: "income" | "expense"
        notes: string | null
        date: string
        user_id: string
        created_at?: string
      }
      addAnother: boolean
      submissionId: string
    }
  | {
      ok: false
      error: string
      submissionId: string
    }


function safeString(v: FormDataEntryValue | null): string {
  if (typeof v !== "string") return ""
  return v
}

export async function createTransactionServer(
  _prevState: CreateTransactionResult | null,
  formData: FormData,
): Promise<CreateTransactionResult> {
  const submissionId = crypto.randomUUID()

  console.log("SERVER ACTION HIT:", submissionId)
  console.log("SERVER FORM DATA:", Object.fromEntries(formData.entries()))

  try {
    const supabase = await createSupabaseServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (!user || authError) {
      return { ok: false, error: "UNAUTHENTICATED", submissionId }
    }

    // ---- Parse payload from formData
    const typeRaw = safeString(formData.get("type"))
    const type = (typeRaw === "income" ? "income" : "expense") as "income" | "expense"

    const amountRaw = safeString(formData.get("amount"))
    // amount can come like "100.000" or "100000" -> normalize
    const amount = Number.parseInt(amountRaw.replace(/[^0-9]/g, ""), 10) || 0

    const category = safeString(formData.get("category"))
    const wallet = safeString(formData.get("wallet"))
    const notesRaw = safeString(formData.get("notes")).trim()
    const notes = notesRaw.length > 0 ? notesRaw : null

    const date = safeString(formData.get("date")) || new Date().toISOString().slice(0, 10)

    const addAnother = safeString(formData.get("addAnother")) === "1"

    // ---- Server-side validation (anti data sampah)
    if (!amount || amount <= 0) {
      return { ok: false, error: "Jumlah harus lebih dari 0", submissionId }
    }
    if (!category) {
      return { ok: false, error: "Kategori wajib dipilih", submissionId }
    }
    if (!wallet) {
      return { ok: false, error: "Wallet wajib dipilih", submissionId }
    }

    const { data, error: insertError } = await supabase
      .from("transactions")
      .insert({
        amount,
        category,
        wallet,
        type,
        notes,
        user_id: user.id,
        date,
      })
      .select("id, amount, category, wallet, type, notes, date, user_id, created_at")
      .single()

    if (insertError) {
      return { ok: false, error: insertError.message, submissionId }
    }

    return {
      ok: true,
      transaction: data,
      addAnother,
      submissionId,
    }
  } catch (e: any) {
    return { ok: false, error: e?.message ?? "Unknown server error", submissionId }
  }
}