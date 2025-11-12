"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertTriangle } from "lucide-react"
import type { ApprovalWorkflow } from "../types/approval"

interface CancelWorkflowDialogProps {
  workflow: ApprovalWorkflow | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
}

export function CancelWorkflowDialog({ workflow, isOpen, onClose, onConfirm }: CancelWorkflowDialogProps) {
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleConfirm = async () => {
    if (!reason.trim()) return

    setIsSubmitting(true)
    try {
      await onConfirm(reason.trim())
      setReason("")
      onClose()
    } catch (error) {
      console.error("Error cancelling workflow:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setReason("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <DialogTitle>Cancel Approval Workflow</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to cancel "{workflow?.title}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Cancellation Reason *</Label>
            <Textarea
              id="reason"
              placeholder="Please provide a reason for cancelling this workflow..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Keep Workflow
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!reason.trim() || isSubmitting}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {isSubmitting ? "Cancelling..." : "Cancel Workflow"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
