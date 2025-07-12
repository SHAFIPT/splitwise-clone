'use client';
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Plus, 
  Search, 
  MoreVertical,
  MessageSquare,
  Video,
  Receipt,
  Settings,
  Eye,
  UserPlus,
  Grid3X3,
  List,
  Calendar,
  Clock,
  X
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreateGroupModal from '@/components/dashboard/CreateGroupModal';
import Image from 'next/image';
import useDebounce from '@/hooks/useDebounce';
import { useGroups } from '@/hooks/group/useGroups';
import { useRouter } from 'next/navigation';

const Groups = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [filterCategory] = useState('all');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const { data: groups = [], isLoading, error, refetch } = useGroups(debouncedSearch, filterCategory);
    
  // Filter groups based on search term and category
  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                         (group.description && group.description.toLowerCase().includes(debouncedSearch.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || group.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD'
//     }).format(amount || 0);
//   };

  const formatDate = (dateString : string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 48) return 'Yesterday';
  if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
  return formatDate(dateString);
};

  const handleGroupClick = (groupId : string) => {
    router.push(`/groups/${groupId}`);
  };

const handleAddExpense = (e: React.MouseEvent, groupId: string) => {
  e.stopPropagation();
  router.push(`/groups/${groupId}/add-expense`);
};

const handleAddMember = (e: React.MouseEvent, groupId: string) => {
  e.stopPropagation();
  router.push(`/groups/${groupId}/add-member`);
};
  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleGroupCreated = async () => {
    // Clear search to show all groups including the new one
    setSearchTerm('');
    // Refetch groups after creating a new one
    await refetch();
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
        trip: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        home: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        food: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
        entertainment: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
        other: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    };

    return colors[category] || colors.other;
    };

  // Check if user has any groups at all
  const hasAnyGroups = groups.length > 0;
  // Check if search/filter returned results
  const hasSearchResults = filteredGroups.length > 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading groups...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">Error loading groups: {error.message}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Header Section */}
          <div className="py-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Your Groups
                  </h1>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Manage your expense groups and track shared expenses
                  </p>
                </div>
                
                {/* Quick Stats - Only show if user has groups */}
                {hasAnyGroups && (
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {groups.length} {groups.length === 1 ? 'Group' : 'Groups'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {groups.filter(g => new Date(g.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length} New this week
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <CreateGroupModal
                  onGroupCreated={handleGroupCreated}
                  trigger={
                    <Button className="bg-gradient-to-r cursor-pointer from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Group
                    </Button>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and filters - Show when user has groups OR when searching */}
        {(hasAnyGroups || searchTerm) && (
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10 h-12 border-gray-200 dark:border-gray-700"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-6 w-6 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="px-3 cursor-pointer"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="px-3 cursor-pointer"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Content based on different states */}
        {!hasAnyGroups ? (
          // No groups at all - First time user
          <Card className="text-center py-12">
            <CardContent>
              <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No groups created yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Create your first group to start splitting expenses with friends and family
              </p>
              <CreateGroupModal
                onGroupCreated={handleGroupCreated}
                trigger={
                  <Button className="bg-gradient-to-r cursor-pointer from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Group
                  </Button>
                }
              />
            </CardContent>
          </Card>
        ) : !hasSearchResults ? (
          // Has groups but search/filter returned no results
          <Card className="text-center py-12">
            <CardContent>
              <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No groups found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm 
                  ? `No groups match "${searchTerm}". Try adjusting your search terms.`
                  : 'No groups match your current filters.'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {searchTerm && (
                  <Button 
                    variant="outline" 
                    onClick={handleClearSearch}
                    className="cursor-pointer"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear Search
                  </Button>
                )}
                <CreateGroupModal
                  onGroupCreated={handleGroupCreated}
                  trigger={
                    <Button className="bg-gradient-to-r cursor-pointer from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Group
                    </Button>
                  }
                />
              </div>
            </CardContent>
          </Card>
        ) : (
          // Show filtered groups
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" 
            : "space-y-4"
          }>
            {filteredGroups.map((group) => (
              <Card 
                key={group.id} 
                className="group hover:shadow-lg transition-all duration-300 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 cursor-pointer"
                onClick={() => handleGroupClick(group.id)}
              >
                <div className="relative">
                  {group.image && (
                    <Image 
                      src={group.image}
                      alt={group.name}
                      width={400}
                      height={192}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  )}
                  <div className="absolute top-4 right-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900 cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem 
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGroupClick(group.id);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="cursor-pointer"
                          onClick={(e) => handleAddExpense(e, group.id)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Expense
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="cursor-pointer"
                          onClick={(e) => handleAddMember(e, group.id)}
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Add Member
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Group Chat
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Video className="w-4 h-4 mr-2" />
                          Video Call
                        </DropdownMenuItem>
                        <Separator className="my-1" />
                        <DropdownMenuItem className="cursor-pointer">
                          <Settings className="w-4 h-4 mr-2" />
                          Settings
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge className={`${getCategoryColor(group.category)} border-0`}>
                      {group.category}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {group.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {group.description || 'No description provided'}
                    </p>
                  </div>

                  {/* No Expenses Message */}
                  <div className="flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4">
                    <div className="text-center">
                      <Receipt className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        No expenses yet
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Add your first expense to get started!
                      </p>
                    </div>
                  </div>

                  {/* Members */}
                  {group.members && group.members.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Members ({group.members.length})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {group.members.slice(0, 5).map((member) => (
                            <Avatar key={member.id} className="w-8 h-8 border-2 border-white dark:border-gray-900">
                              <AvatarImage src={member.avatarUrl} />
                              <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 text-xs">
                                {member.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {group.members.length > 5 && (
                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-900 flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                                +{group.members.length - 5}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Group Info */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Created
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {formatDate(group.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Last activity
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {getRelativeTime(group.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs cursor-pointer"
                      onClick={(e) => handleAddExpense(e, group.id)}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Expense
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs cursor-pointer"
                      onClick={(e) => handleAddMember(e, group.id)}
                    >
                      <UserPlus className="w-3 h-3 mr-1" />
                      Add Member
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Groups;