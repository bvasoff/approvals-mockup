import type { ApprovalWorkflow, ApprovalStage, ApprovalAction } from "../types/approval"

export class ApprovalService {
  static createWorkflow(workflow: Omit<ApprovalWorkflow, "id" | "createdAt" | "status">): ApprovalWorkflow {
    return {
      ...workflow,
      id: `approval_${Date.now()}`,
      status: "pending",
      createdAt: new Date(),
    }
  }

  static submitApproval(
    workflow: ApprovalWorkflow,
    stageId: string,
    approverId: string,
    approverName: string,
    status: "approved" | "rejected",
    comment?: string,
  ): ApprovalWorkflow {
    const updatedWorkflow = { ...workflow }
    const stage = updatedWorkflow.stages.find((s) => s.id === stageId)

    if (!stage) return workflow

    // Add the approval action
    const action: ApprovalAction = {
      id: `action_${Date.now()}`,
      approverId,
      approverName,
      status,
      comment,
      timestamp: new Date(),
    }

    stage.actions.push(action)

    // Check if stage is complete
    const approvedActions = stage.actions.filter((a) => a.status === "approved")
    const rejectedActions = stage.actions.filter((a) => a.status === "rejected")

    if (rejectedActions.length > 0) {
      stage.status = "rejected"
      updatedWorkflow.status = "rejected"
    } else if (stage.approvalRequirement === "any" && approvedActions.length > 0) {
      stage.status = "approved"
      stage.completedAt = new Date()
    } else if (stage.approvalRequirement === "all" && approvedActions.length === stage.approvers.length) {
      stage.status = "approved"
      stage.completedAt = new Date()
    }

    // Check overall workflow status
    this.updateWorkflowStatus(updatedWorkflow)

    return updatedWorkflow
  }

  private static updateWorkflowStatus(workflow: ApprovalWorkflow): void {
    const rejectedStages = workflow.stages.filter((s) => s.status === "rejected")
    if (rejectedStages.length > 0) {
      workflow.status = "rejected"
      return
    }

    const completedStages = workflow.stages.filter((s) => s.status === "approved")
    if (completedStages.length === workflow.stages.length) {
      workflow.status = "approved"
      workflow.completedAt = new Date()
    } else {
      workflow.status = "in-progress"
    }
  }

  static getNextPendingStages(workflow: ApprovalWorkflow): ApprovalStage[] {
    const pendingStages = workflow.stages.filter((s) => s.status === "pending")

    if (pendingStages.length === 0) return []

    // For sequential stages, only return the first pending stage
    const firstPendingSequential = pendingStages.find((s) => s.executionType === "sequential")
    if (firstPendingSequential) {
      return [firstPendingSequential]
    }

    // For parallel stages, return all pending parallel stages at the same order level
    const minOrder = Math.min(...pendingStages.map((s) => s.order))
    return pendingStages.filter((s) => s.order === minOrder && s.executionType === "parallel")
  }

  static cancelWorkflow(workflow: ApprovalWorkflow, cancelledBy: string, reason?: string): ApprovalWorkflow {
    return {
      ...workflow,
      status: "cancelled",
      cancelledAt: new Date(),
      cancelledBy,
      cancelReason: reason,
    }
  }
}
