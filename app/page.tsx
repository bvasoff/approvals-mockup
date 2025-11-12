"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Menu,
  HelpCircle,
  ShoppingCart,
  List,
  Mail,
  Grid3X3,
  Search,
  Folder,
  Upload,
  Plus,
  Bell,
  Share2,
  Settings,
  ClipboardCheck,
  Eye,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import WorkflowSetupPage from "../pages/workflow-setup"
import WorkflowsListPage from "../pages/workflows-list"
import WorkflowViewerPage from "../pages/workflow-viewer"
import type { ApprovalWorkflow } from "../types/approval"
import AssetSearchPage from "../pages/asset-search"

type PageType = "workflows" | "setup" | "search"

export default function ApprovalFrameworkDemo() {
  const [currentPage, setCurrentPage] = useState<PageType>("search")
  const [selectedWorkflow, setSelectedWorkflow] = useState<ApprovalWorkflow | null>(null)
  const [editingWorkflow, setEditingWorkflow] = useState<ApprovalWorkflow | null>(null)
  const [activeSidebarItem, setActiveSidebarItem] = useState<string | null>("Search")

  const renderPage = () => {
    if (selectedWorkflow) {
      return (
        <WorkflowViewerPage
          workflow={selectedWorkflow}
          onBack={() => setSelectedWorkflow(null)}
          onWorkflowUpdate={(updatedWorkflow) => setSelectedWorkflow(updatedWorkflow)}
        />
      )
    }

    if (editingWorkflow) {
      return (
        <WorkflowSetupPage
          workflow={editingWorkflow}
          onCancel={() => setEditingWorkflow(null)}
          onWorkflowSaved={() => {
            setEditingWorkflow(null)
            setCurrentPage("workflows")
          }}
        />
      )
    }

    switch (currentPage) {
      case "workflows":
        return <WorkflowsListPage onViewWorkflow={setSelectedWorkflow} onEditWorkflow={handleEditWorkflow} />
      case "setup":
        return <WorkflowSetupPage />
      case "search":
        return <AssetSearchPage onAssetClick={handleAssetClick} />
      default:
        return <WorkflowsListPage onViewWorkflow={setSelectedWorkflow} onEditWorkflow={handleEditWorkflow} />
    }
  }

  const handleEditWorkflow = (workflow: ApprovalWorkflow) => {
    setEditingWorkflow(workflow)
  }

  const handleAssetClick = (assetId: string) => {
    // Navigate to the Marketing Video Asset Approval workflow
    if (assetId === "2") {
      // Find the marketing video workflow
      const marketingWorkflow = {
        id: "asset_001",
        title: "Marketing Video Asset Approval",
        description: "Review and approve the Q4 marketing campaign video before publication",
        itemType: "asset" as const,
        itemId: "video_marketing_q4_2024",
        status: "in-progress" as const,
        createdAt: new Date("2024-01-15"),
        createdBy: "sarah.johnson@company.com",
        notifications: {
          emails: ["marketing@company.com", "creative@company.com"],
          triggers: ["stage-completion", "rejections-only"] as const,
        },
        stages: [
          {
            id: "stage_1",
            name: "Creative Review",
            order: 1,
            executionType: "sequential" as const,
            approvers: [
              { id: "user_1", name: "Alex Chen", email: "alex.chen@company.com" },
              { id: "user_2", name: "Maria Rodriguez", email: "maria.rodriguez@company.com" },
            ],
            approvalRequirement: "any" as const,
            status: "approved" as const,
            actions: [
              {
                id: "action_1",
                approverId: "user_1",
                approverName: "Alex Chen",
                status: "approved" as const,
                comment: "Great work on the visual effects. The messaging is clear and engaging.",
                timestamp: new Date("2024-01-16"),
              },
            ],
            completedAt: new Date("2024-01-16"),
          },
          {
            id: "stage_2",
            name: "Legal Compliance",
            order: 2,
            executionType: "sequential" as const,
            approvers: [{ id: "user_3", name: "David Kim", email: "david.kim@company.com" }],
            approvalRequirement: "all" as const,
            status: "pending" as const,
            actions: [],
          },
          {
            id: "stage_3",
            name: "Final Sign-off",
            order: 3,
            executionType: "parallel" as const,
            approvers: [
              { id: "user_4", name: "Jennifer Walsh", email: "jennifer.walsh@company.com" },
              { id: "user_5", name: "Robert Taylor", email: "robert.taylor@company.com" },
            ],
            approvalRequirement: "all" as const,
            status: "pending" as const,
            actions: [],
          },
        ],
      }

      setSelectedWorkflow(marketingWorkflow)
      setActiveSidebarItem(null)
    }
  }

  const sidebarIcons = [
    { icon: Search, label: "Search" },
    { icon: Folder, label: "Folders" },
    { icon: Upload, label: "Upload" },
    { icon: Bell, label: "Notifications" },
    { icon: ShoppingCart, label: "Cart" },
    { icon: Share2, label: "Share" },
    { icon: Settings, label: "Settings" },
  ]

  const getPendingApprovalsCount = () => {
    // This would typically come from your API/state management
    // For demo purposes, we'll simulate some pending approvals
    const currentUserId = "user_3" // This would be the actual logged-in user ID

    // Sample workflows - in real app this would come from your data source
    const sampleWorkflows = [
      {
        id: "asset_001",
        status: "in-progress",
        stages: [
          {
            id: "stage_2",
            status: "pending",
            approvers: [{ id: "user_3", name: "David Kim" }],
            actions: [],
          },
        ],
      },
      {
        id: "order_001",
        status: "pending",
        stages: [
          {
            id: "stage_1",
            status: "pending",
            approvers: [
              { id: "user_3", name: "David Kim" },
              { id: "user_6", name: "Lisa Park" },
            ],
            actions: [],
          },
        ],
      },
    ]

    let pendingCount = 0
    sampleWorkflows.forEach((workflow) => {
      workflow.stages.forEach((stage) => {
        if (stage.status === "pending") {
          const isAssignedToUser = stage.approvers.some((approver) => approver.id === currentUserId)
          const hasNotActed = !stage.actions.some((action) => action.approverId === currentUserId)
          if (isAssignedToUser && hasNotActed) {
            pendingCount++
          }
        }
      })
    })

    return pendingCount
  }

  const pendingApprovalsCount = getPendingApprovalsCount()

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className="w-16 bg-gray-800 flex flex-col items-center py-4 space-y-4">
        {sidebarIcons.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            className={`w-10 h-10 p-0 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg ${
              activeSidebarItem === item.label ? "bg-gray-700 text-white" : ""
            }`}
            title={item.label}
            onClick={() => {
              if (item.label === "Search") {
                setActiveSidebarItem("Search")
                setCurrentPage("search" as PageType)
                setSelectedWorkflow(null)
                setEditingWorkflow(null)
              } else {
                setActiveSidebarItem(item.label)
              }
            }}
          >
            <item.icon className="h-5 w-5" />
          </Button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Bar */}
        <header className="bg-white border-b shadow-sm">
          <div className="px-6 py-3">
            <div className="flex items-center justify-between">
              {/* Left side of top bar */}
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">A</span>
                  </div>
                  <h1 className="text-lg font-semibold">Approval Management</h1>
                </div>
              </div>

              {/* Right side of top bar */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="p-2">
                  <HelpCircle className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2 relative">
                  <ShoppingCart className="h-5 w-5" />
                </Button>

                {/* Approvals Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-2 relative" title="Approval Actions">
                      <ClipboardCheck className="h-5 w-5" />

                      {pendingApprovalsCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-orange-500">
                          {pendingApprovalsCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Approval Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        setCurrentPage("workflows")
                        setSelectedWorkflow(null)
                        setEditingWorkflow(null)
                      }}
                      className={
                        currentPage === "workflows" && !selectedWorkflow && !editingWorkflow ? "bg-blue-50" : ""
                      }
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          <span>All Approvals</span>
                        </div>
                        {pendingApprovalsCount > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {pendingApprovalsCount} pending
                          </Badge>
                        )}
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setCurrentPage("setup")
                        setSelectedWorkflow(null)
                        setEditingWorkflow(null)
                      }}
                      className={currentPage === "setup" && !selectedWorkflow && !editingWorkflow ? "bg-blue-50" : ""}
                    >
                      <div className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        <span>New Approval</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="ghost" size="sm" className="p-2">
                  <List className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <Mail className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <Grid3X3 className="h-5 w-5" />
                </Button>
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">{renderPage()}</main>
      </div>
    </div>
  )
}
