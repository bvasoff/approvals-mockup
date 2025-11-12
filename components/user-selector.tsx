"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { X, ChevronDown, Search, User } from "lucide-react"
import { UserService } from "../services/user-service"
import type { Approver } from "../types/approval"

interface UserSelectorProps {
  selectedUsers: Approver[]
  onUsersChange: (users: Approver[]) => void
  placeholder?: string
  maxUsers?: number
}

export function UserSelector({
  selectedUsers,
  onUsersChange,
  placeholder = "Search and select users...",
  maxUsers,
}: UserSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredUsers, setFilteredUsers] = useState<Approver[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const users = UserService.searchUsers(searchQuery)
    // Filter out already selected users
    const availableUsers = users.filter((user) => !selectedUsers.some((selected) => selected.id === user.id))
    setFilteredUsers(availableUsers)
  }, [searchQuery, selectedUsers])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleUserSelect = (user: Approver) => {
    if (maxUsers && selectedUsers.length >= maxUsers) return
    onUsersChange([...selectedUsers, user])
    setSearchQuery("")
  }

  const handleUserRemove = (userId: string) => {
    onUsersChange(selectedUsers.filter((user) => user.id !== userId))
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="space-y-2">
        {/* Selected Users */}
        {selectedUsers.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedUsers.map((user) => (
              <Badge key={user.id} variant="secondary" className="flex items-center gap-2 px-3 py-1">
                <Avatar className="h-4 w-4">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{user.name}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => handleUserRemove(user.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            className="pl-10 pr-10"
            disabled={maxUsers ? selectedUsers.length >= maxUsers : false}
          />
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredUsers.length > 0 ? (
            <div className="py-1">
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-3"
                  onClick={() => handleUserSelect(user)}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-xs">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-3 py-2 text-sm text-muted-foreground flex items-center gap-2">
              <User className="h-4 w-4" />
              {searchQuery ? "No users found" : "Start typing to search users"}
            </div>
          )}
        </div>
      )}

      {maxUsers && (
        <p className="text-xs text-muted-foreground mt-1">
          {selectedUsers.length} of {maxUsers} users selected
        </p>
      )}
    </div>
  )
}
