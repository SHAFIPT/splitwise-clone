'use client';
import React, { useEffect, useState, useRef, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  X, 
  Home, 
  Plane, 
  Coffee, 
  ShoppingBag, 
  Car, 
  Utensils,
  Check,
  Search,
  UserPlus
} from "lucide-react";
import Image from "next/image";
import useDebounce from "@/hooks/useDebounce";
import { useSearchUserByEmail } from "@/hooks/group/useSearchUserByEmail";
import toast from "react-hot-toast";
import { GroupPayload } from "@/lib/api/group-api";
import { useCreateGroup } from "@/hooks/group/useCreateGroup";
import { useRouter } from "next/navigation";

interface Member {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface FoundUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
}

type CreateGroupModalProps = {
  trigger: React.ReactNode;
  onGroupCreated?: () => void;
};

const categoryIcons = {
  general: Users,
  home: Home,
  trip: Plane,
  entertainment: Coffee,
  shopping: ShoppingBag,
  transportation: Car,
  food: Utensils,
} as const;

const groupImages = [
  "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=300&fit=crop",
];

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ trigger , onGroupCreated  }) => {
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<keyof typeof categoryIcons | "">("");
  const [selectedImage, setSelectedImage] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [step, setStep] = useState(1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const createGroupMutation = useCreateGroup();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const suggestionItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const router = useRouter();
  const debouncedEmail = useDebounce(newMemberEmail, 300);
  const { data, isLoading, isError } = useSearchUserByEmail(debouncedEmail);
  console.log('This isthe data in bakcien : ',data)
  console.log('This isthe isError in bakcien : ',isError)
  const foundUsers = useMemo(() => {
  return (Array.isArray(data) ? data : []) as FoundUser[];
}, [data]);
  

  useEffect(() => {
    // Show suggestions when there's a search term and results
    if (debouncedEmail.trim() && (foundUsers || (!isLoading && !foundUsers))) {
      setShowSuggestions(true);
      setSelectedSuggestionIndex(-1);
    } else {
      setShowSuggestions(false);
    }
  }, [debouncedEmail, foundUsers, isLoading]);

  // Scroll selected suggestion into view
  useEffect(() => {
    if (selectedSuggestionIndex >= 0 && suggestionItemsRef.current[selectedSuggestionIndex]) {
      suggestionItemsRef.current[selectedSuggestionIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedSuggestionIndex]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        !emailInputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;

    const suggestions = Array.isArray(foundUsers) ? foundUsers : [];
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0 && suggestions[selectedSuggestionIndex]) {
          selectUser(suggestions[selectedSuggestionIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  const selectUser = (user: FoundUser) => {
    // Check if user is already added
    const isAlreadyAdded = members.some(member => member.email === user.email);
    
    if (isAlreadyAdded) {
      toast.error("This user is already added to the group.");
      return;
    }

    const newMember: Member = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatarUrl || "",
    };
    
    setMembers([...members, newMember]);
    setNewMemberEmail("");
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    toast.success(`${user.name} added to the group!`);
  };

  const removeMember = (id: string) => {
    setMembers(members.filter(member => member.id !== id));
  };

  const handleCreateGroup = () => {
  const payload: GroupPayload = {
    name: groupName,
    description,
    category,
    image: selectedImage,
    members: members.map((member) => member.id)
  };

  createGroupMutation.mutate(payload, {
    onSuccess: () => {
      setGroupName("");
      setDescription("");
      setCategory("");
      setSelectedImage("");
      setMembers([]);
      setStep(1);
      setOpen(false);
      onGroupCreated?.();
      router.push("/dashboard/groups");
    },
  });
};

  const canProceedToStep2 = groupName.trim() && category;
  const canCreateGroup = canProceedToStep2 && members.length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border-0 shadow-2xl">
        <DialogHeader className="space-y-4 pb-6">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Create New Group
          </DialogTitle>
          
          {/* Progress indicator */}
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
            } transition-colors duration-300`}>
              {step > 1 ? <Check className="w-4 h-4" /> : '1'}
            </div>
            <div className={`h-1 flex-1 rounded ${
              step > 1 ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
            } transition-colors duration-300`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
            } transition-colors duration-300`}>
              2
            </div>
          </div>
          
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span className={step === 1 ? 'font-medium text-blue-600 dark:text-blue-400' : ''}>
              Group Details
            </span>
            <span className={step === 2 ? 'font-medium text-blue-600 dark:text-blue-400' : ''}>
              Add Members
            </span>
          </div>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-6">
            {/* Group Image Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Choose Group Image
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {groupImages.map((image, index) => (
                  <div
                    key={index}
                    className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-300 transform hover:scale-105 ${
                      selectedImage === image
                        ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <Image
                      src={image}
                      alt={`Group option ${index + 1}`}
                      width={300}
                      height={80}
                      className="w-full h-20 object-cover"
                    />
                    {selectedImage === image && (
                      <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                        <Check className="w-6 h-6 text-blue-600" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Group Name */}
            <div className="space-y-2">
              <Label htmlFor="groupName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Group Name *
              </Label>
              <Input
                id="groupName"
                placeholder="Enter group name (e.g., 'Weekend Trip', 'Apartment 4B')"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="h-12 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-300"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Category *
              </Label>
              <Select value={category} onValueChange={(value: keyof typeof categoryIcons) => setCategory(value)}>
                <SelectTrigger className="h-12 border-gray-200 dark:border-gray-700 focus:border-blue-500">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  {Object.entries(categoryIcons).map(([key, Icon]) => (
                    <SelectItem key={key} value={key} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <div className="flex items-center space-x-2">
                        <Icon className="w-4 h-4" />
                        <span className="capitalize">{key === 'general' ? 'General' : key}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Description (optional)
              </Label>
              <Textarea
                id="description"
                placeholder="Add a description for your group..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[80px] border-gray-200 dark:border-gray-700 focus:border-blue-500 resize-none transition-colors duration-300"
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                onClick={() => setStep(2)}
                disabled={!canProceedToStep2}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                Next: Add Members
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            {/* Group Preview */}
            <Card className="border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  {selectedImage && (
                    <Image
                      src={selectedImage}
                      alt="Group"
                      width={80}
                      height={80}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{groupName}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      {category && (
                        <>
                          {React.createElement(categoryIcons[category], { className: "w-4 h-4" })}
                          <span className="capitalize">{category}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add Members */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Add Members
                </Label>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {members.length} member{members.length !== 1 ? 's' : ''}
                </Badge>
              </div>

              {/* Search Member Input with Suggestions */}
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    ref={emailInputRef}
                    placeholder="Search by email address..."
                    type="email"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                      if (debouncedEmail.trim() && (foundUsers || (!isLoading && !foundUsers))) {
                        setShowSuggestions(true);
                      }
                    }}
                    className="h-12 pl-10 pr-12 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-300"
                  />
                  {isLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && (
                  <div
                    ref={suggestionsRef}
                    className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
                    style={{ maxHeight: '240px' }} // Fixed height for about 5 items
                  >
                    {isLoading ? (
                      <div className="p-4 text-center text-gray-500">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm">Searching...</span>
                        </div>
                      </div>
                    ) : foundUsers && foundUsers.length > 0 ? (
                      <div
                          className="overflow-y-auto hide-scrollbar"
                          style={{ maxHeight: '240px' }}
                        >
                        {foundUsers.map((user, index) => (
                          <div
                            key={user.id}
                            ref={(el) => {
                              suggestionItemsRef.current[index] = el;
                            }}
                            className={`p-3 cursor-pointer transition-colors duration-150 ${
                              selectedSuggestionIndex === index 
                                ? 'bg-blue-50 dark:bg-blue-900/50 border-l-2 border-blue-500' 
                                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                            } ${index === 0 ? 'rounded-t-lg' : ''} ${index === foundUsers.length - 1 ? 'rounded-b-lg' : ''}`}
                            onClick={() => selectUser(user)}
                            onMouseEnter={() => setSelectedSuggestionIndex(index)}
                          >
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                                <AvatarImage src={user.avatarUrl || undefined} />
                                <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 text-xs sm:text-sm">
                                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">
                                  {user.name}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                                  {user.email}
                                </p>
                              </div>
                              <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : debouncedEmail.trim() && !isLoading ? (
                      <div className="p-4 text-center text-gray-500">
                        <div className="flex flex-col items-center space-y-2">
                          <Users className="w-6 h-6 sm:w-8 sm:h-8 text-gray-300" />
                          <p className="text-sm">No user found with this email</p>
                          <p className="text-xs text-gray-400">Only registered users can be added</p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>

              {/* Helper Text */}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Start typing an email address to search for registered users
              </p>
            </div>

            {/* Members List */}
            {members.length > 0 && (
              <div className="space-y-3">
                <Separator className="bg-gray-200 dark:bg-gray-700" />
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 text-sm">
                            {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                            {member.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {member.email}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => removeMember(member.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 h-8 w-8 p-0 flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="px-6 py-3 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 order-2 sm:order-1"
              >
                Back
              </Button>
              <Button
                onClick={handleCreateGroup}
                disabled={!canCreateGroup}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl order-1 sm:order-2"
              >
                Create Group
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupModal;