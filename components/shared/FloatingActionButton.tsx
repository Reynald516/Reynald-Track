"use client"

import { useState } from "react"
import { Plus, X, ListTodo, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface FloatingActionButtonProps {
  onAdd: () => void
  onManage: () => void
}

export function FloatingActionButton({ onAdd, onManage }: FloatingActionButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-24 right-6 z-50 md:bottom-10">
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-background/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            <div className="absolute bottom-16 right-0 flex flex-col items-end gap-3">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
              >
                <Button
                  size="lg"
                  className="rounded-full shadow-lg"
                  onClick={() => {
                    onAdd()
                    setOpen(false)
                  }}
                >
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Tambah Transaksi
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ delay: 0.05 }}
              >
                <Button
                  size="lg"
                  variant="secondary"
                  className="rounded-full shadow-lg"
                  onClick={() => {
                    onManage()
                    setOpen(false)
                  }}
                >
                  <ListTodo className="mr-2 h-5 w-5" />
                  Kelola Transaksi
                </Button>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <Button
        size="icon"
        className={cn(
          "h-14 w-14 rounded-full shadow-xl transition-transform",
          open && "rotate-45"
        )}
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </Button>
    </div>
  )
}