"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon, CheckIcon } from "lucide-react"

interface NextDecisionProps {
  transactionCount: number
  onAddAnother: () => void
  onFinish: () => void
}

export function NextDecision({ transactionCount, onAddAnother, onFinish }: NextDecisionProps) {
  const canAddMore = transactionCount < 3

  return (
    <div className="px-4 py-6 max-w-md mx-auto">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg text-balance">Tambah transaksi lagi hari ini?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {canAddMore ? (
            <>
              <Button onClick={onAddAnother} className="w-full h-12" size="lg">
                <PlusIcon className="size-4" />
                Tambah lagi
              </Button>
              <Button onClick={onFinish} variant="outline" className="w-full h-12 bg-transparent" size="lg">
                Selesai
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground text-center mb-2">Maksimal 3 transaksi sudah tercatat</p>
              <Button onClick={onFinish} className="w-full h-12" size="lg">
                <CheckIcon className="size-4" />
                Selesai
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
