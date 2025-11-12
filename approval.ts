export type ApprovalStatus = "pending" | "approved" | "rejected" | "in-progress" | "cancelled"
export type StageExecutionType = "sequential" | "parallel"
export type ApprovalRequirement = "any" | "all"
export type NotificationTrigger = "all-activity" | "stage-completion" | "rejections-only"

export interface Approver {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface ApprovalAction {
  id: string
  approverId: string
  approverName: string
  status: "approved" | "rejected"
  comment?: string
  timestamp: Date
}

export interface ApprovalStage {
  id: string
  name: string
  order: number
  executionType: StageExecutionType
  approvers: Approver[]
  approvalRequirement: ApprovalRequirement
  status: ApprovalStatus
  actions: ApprovalAction[]
  completedAt?: Date
}

export interface NotificationConfig {
  emails: string[]
  triggers: NotificationTrigger[]
}

export interface ApprovalWorkflow {
  id: string
  title: string
  description: string
  itemType: "asset" | "order" | "license" | "cart"
  itemId: string
  stages: ApprovalStage[]
  notifications: NotificationConfig
  status: ApprovalStatus
  createdAt: Date
  createdBy: string
  completedAt?: Date
  cancelledAt?: Date
  cancelledBy?: string
  cancelReason?: string
}

export interface ApprovalItem {
  id: string
  type: "asset" | "order" | "license" | "cart"
  title: string
  description: string
  metadata: Record<string, any>
}
