"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, XCircle, Clock, User, MessageSquare, ArrowUp, ArrowDown, Trash2 } from "lucide-react"
import type { ApprovalWorkflow, ApprovalStage, ApprovalStatus } from "../types/approval"
import { ApprovalService } from "../services/approval-service"

interface ApprovalWorkflowProps {
  workflow: ApprovalWorkflow
  currentUserId?: string
  onWorkflowUpdate?: (workflow: ApprovalWorkflow) => void
  onEditWorkflow?: (workflow: ApprovalWorkflow) => void
}

export function ApprovalWorkflowComponent({
  workflow,
  currentUserId,
  onWorkflowUpdate,
  onEditWorkflow,
}: ApprovalWorkflowProps) {
  const [selectedStage, setSelectedStage] = useState<string | null>(null)
  const [comment, setComment] = useState("")

  const getStatusIcon = (status: ApprovalStatus) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: ApprovalStatus) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleApproval = (stageId: string, status: "approved" | "rejected") => {
    if (!currentUserId) return

    const stage = workflow.stages.find((s) => s.id === stageId)
    const approver = stage?.approvers.find((a) => a.id === currentUserId)

    if (!approver) return

    const updatedWorkflow = ApprovalService.submitApproval(
      workflow,
      stageId,
      currentUserId,
      approver.name,
      status,
      comment,
    )

    onWorkflowUpdate?.(updatedWorkflow)
    setComment("")
    setSelectedStage(null)
  }

  const canUserApprove = (stage: ApprovalStage): boolean => {
    if (!currentUserId) return false
    const isApprover = stage.approvers.some((a) => a.id === currentUserId)
    const hasAlreadyActed = stage.actions.some((a) => a.approverId === currentUserId)
    return isApprover && !hasAlreadyActed && stage.status === "pending"
  }

  const moveStage = (index: number, direction: "up" | "down") => {
    // Implementation for moving stages
  }

  const removeStage = (index: number) => {
    // Implementation for removing stages
  }

  const formData = workflow // Assuming formData is meant to be workflow

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 w-full">
          {getStatusIcon(workflow.status)}
          {workflow.title}
        </CardTitle>
        <div className="flex items-center gap-2 mt-2">
          <Badge className={getStatusColor(workflow.status)}>{workflow.status.toUpperCase()}</Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEditWorkflow?.(workflow)}
            className="text-blue-600 border-blue-600 hover:bg-blue-50 rounded-full"
          >
            Edit Workflow
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">{workflow.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {workflow.stages.map((stage, index) => (
          <Card key={stage.id} className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex flex-col space-y-3">
                <div className="flex items-center justify-between w-full">
                  <h4 className="font-semibold flex items-center gap-2 flex-1">
                    {getStatusIcon(stage.status)}
                    Stage {index + 1}: {stage.name}
                  </h4>
                  <Badge className={getStatusColor(stage.status)}>{stage.status}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs whitespace-nowrap">
                      {stage.executionType}
                    </Badge>
                    <Badge variant="outline" className="text-xs whitespace-nowrap">
                      {stage.approvalRequirement} required
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost" onClick={() => moveStage(index, "up")} disabled={index === 0}>
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => moveStage(index, "down")}
                      disabled={index === formData.stages.length - 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeStage(index)}
                      disabled={formData.stages.length <= 1}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {stage.approvers.map((approver) => {
                  const action = stage.actions.find((a) => a.approverId === approver.id)
                  return (
                    <div key={approver.id} className="flex items-center gap-2 p-2 border rounded-lg">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={approver.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">
                          {approver.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{approver.name}</span>
                      {action && (
                        <Badge
                          className={
                            action.status === "approved" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }
                        >
                          {action.status}
                        </Badge>
                      )}
                    </div>
                  )
                })}
              </div>

              {stage.actions.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-sm font-medium flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    Comments & Actions
                  </h5>
                  {stage.actions.map((action) => (
                    <div key={action.id} className="p-2 bg-gray-50 rounded text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-3 w-3" />
                        <span className="font-medium">{action.approverName}</span>
                        <Badge
                          className={
                            action.status === "approved" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }
                        >
                          {action.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{action.timestamp.toLocaleDateString()}</span>
                      </div>
                      {action.comment && <p className="text-muted-foreground ml-5">{action.comment}</p>}
                    </div>
                  ))}
                </div>
              )}

              {canUserApprove(stage) && (
                <div className="space-y-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium">Your approval is required for this stage</p>
                  <Textarea
                    placeholder="Add a comment (optional)"
                    value={selectedStage === stage.id ? comment : ""}
                    onChange={(e) => {
                      setComment(e.target.value)
                      setSelectedStage(stage.id)
                    }}
                    className="min-h-[60px]"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleApproval(stage.id, "approved")}
                      className="bg-green-600 hover:bg-green-700 rounded-full whitespace-nowrap"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      className="rounded-full whitespace-nowrap"
                      size="sm"
                      variant="destructive"
                      onClick={() => handleApproval(stage.id, "rejected")}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  )
}
