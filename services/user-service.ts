import type { Approver } from "../types/approval"

export const AVAILABLE_USERS: Approver[] = [
  { id: "user_1", name: "Alex Chen", email: "alex.chen@company.com", avatar: "/placeholder.svg?height=32&width=32" },
  {
    id: "user_2",
    name: "Maria Rodriguez",
    email: "maria.rodriguez@company.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  { id: "user_3", name: "David Kim", email: "david.kim@company.com", avatar: "/placeholder.svg?height=32&width=32" },
  {
    id: "user_4",
    name: "Jennifer Walsh",
    email: "jennifer.walsh@company.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "user_5",
    name: "Robert Taylor",
    email: "robert.taylor@company.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  { id: "user_6", name: "Lisa Park", email: "lisa.park@company.com", avatar: "/placeholder.svg?height=32&width=32" },
  {
    id: "user_7",
    name: "Michael Brown",
    email: "michael.brown@company.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "user_8",
    name: "Sarah Wilson",
    email: "sarah.wilson@company.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "user_9",
    name: "James Anderson",
    email: "james.anderson@company.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "user_10",
    name: "Amanda Foster",
    email: "amanda.foster@company.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  { id: "user_11", name: "Thomas Lee", email: "thomas.lee@company.com", avatar: "/placeholder.svg?height=32&width=32" },
  {
    id: "user_12",
    name: "Rachel Green",
    email: "rachel.green@company.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "user_13",
    name: "Kevin Martinez",
    email: "kevin.martinez@company.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "user_14",
    name: "Emily Davis",
    email: "emily.davis@company.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "user_15",
    name: "Christopher White",
    email: "christopher.white@company.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "user_16",
    name: "Nicole Johnson",
    email: "nicole.johnson@company.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "user_17",
    name: "Daniel Garcia",
    email: "daniel.garcia@company.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "user_18",
    name: "Ashley Miller",
    email: "ashley.miller@company.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

export class UserService {
  static getAllUsers(): Approver[] {
    return AVAILABLE_USERS
  }

  static searchUsers(query: string): Approver[] {
    if (!query.trim()) return AVAILABLE_USERS

    const lowercaseQuery = query.toLowerCase()
    return AVAILABLE_USERS.filter(
      (user) => user.name.toLowerCase().includes(lowercaseQuery) || user.email.toLowerCase().includes(lowercaseQuery),
    )
  }

  static getUserById(id: string): Approver | undefined {
    return AVAILABLE_USERS.find((user) => user.id === id)
  }

  static getUsersByIds(ids: string[]): Approver[] {
    return AVAILABLE_USERS.filter((user) => ids.includes(user.id))
  }
}
