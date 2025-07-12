'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  User,  
  Phone, 
  MapPin, 
  Calendar, 
  CreditCard, 
  DollarSign, 
  Users, 
  TrendingUp,
  Edit3,
  Save,
  X,
  Camera,
  Upload
} from "lucide-react";
import Header from "@/components/layout/Header";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import toast from "react-hot-toast";
import { useUpdateProfile } from "@/hooks/profile/useUpdateProfile";
import { useUploadAvatar } from "@/hooks/profile/useUploadAvatar";
import Image from "next/image";
import Spinner from "@/components/ui/spinner";

const Profile = () => {
  const user = useSelector((state: RootState) => state.user);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    location: user.location || "",
    joinDate: "January 2023", 
  });
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const { mutate: uploadAvatar, isPending: isUploading } = useUploadAvatar(user);
  const [editData, setEditData] = useState(profileData);

  const handleSave = () => {
    updateProfile({
      name: editData.name,
      phone: editData.phone,
      location: editData.location,
    });
    setProfileData(editData);
    setIsEditing(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    uploadAvatar(selectedFile); 
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setShowImageUploader(false);
    setSelectedFile(null);
    setPreview(null);
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const stats = [
    { label: "Total Expenses", value: "$2,847.50", icon: DollarSign, color: "text-emerald-600", gradient: "from-emerald-500 to-emerald-600" },
    { label: "Active Groups", value: "8", icon: Users, color: "text-blue-600", gradient: "from-blue-500 to-blue-600" },
    { label: "Monthly Avg", value: "$456.80", icon: TrendingUp, color: "text-purple-600", gradient: "from-purple-500 to-purple-600" },
  ];

  const recentActivity = [
    { action: "Split dinner at Mario's", amount: "$67.50", date: "2 hours ago", type: "expense" },
    { action: "Received payment from Sarah", amount: "$25.00", date: "1 day ago", type: "payment" },
    { action: "Added to 'Weekend Trip' group", amount: "", date: "3 days ago", type: "group" },
    { action: "Split Uber ride", amount: "$18.75", date: "1 week ago", type: "expense" },
  ];

  return (
    <>
      {(isUploading || isUpdating) && <Spinner />}
       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-blue-950/30 dark:to-purple-950/20 transition-all duration-300">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Profile</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-300">Manage your account and expense preferences</p>
            </div>
            <Button
                onClick={() => setIsEditing(!isEditing)}
                variant="outline"
                className={`cursor-pointer w-fit shadow transition-all duration-300 ${
                    isEditing
                    ? 'border-[#3d35db] text-[#3d35db] hover:bg-[#f4f4ff]'
                    : 'bg-[#3d35db] text-white hover:bg-[#5148e0]'
                }`}
                >
                {isEditing ? (
                    <>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                    </>
                ) : (
                    <>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                    </>
                )}
                </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/70 dark:bg-gray-800 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 relative z-10">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white transition-colors duration-300">Personal Information</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300 transition-colors duration-300">Your basic account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    {user.avatarUrl ? (
                      <Image  
                        src={user.avatarUrl} 
                        alt="Profile" 
                          width={80}
                          height={80}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <User className="w-10 h-10 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">{profileData.name}</h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300"
                      onClick={() => setShowImageUploader(true)}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Change Photo
                    </Button>
                  </div>
                </div>

                <Separator className="dark:bg-gray-600" />

                {/* Editable Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700 dark:text-gray-300 transition-colors duration-300">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={editData.name}
                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white transition-all duration-300"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 p-2 bg-gradient-to-r from-gray-50 to-blue-50/50 dark:from-gray-700/50 dark:to-blue-900/20 rounded-md border border-gray-200 dark:border-gray-600 transition-all duration-300">
                        <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-gray-900 dark:text-white transition-colors duration-300">{profileData.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                      Email Address
                    </Label>

                    <Input
                      id="email"
                      type="email"
                      value={editData.email}
                      disabled
                      readOnly
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white transition-all duration-300 cursor-not-allowed opacity-70"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300 transition-colors duration-300">Phone Number</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={editData.phone}
                        onChange={(e) => setEditData({...editData, phone: e.target.value})}
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white transition-all duration-300"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 p-2 bg-gradient-to-r from-gray-50 to-purple-50/50 dark:from-gray-700/50 dark:to-purple-900/20 rounded-md border border-gray-200 dark:border-gray-600 transition-all duration-300">
                        <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span
                          className={`transition-colors duration-300 ${
                            profileData.phone
                              ? 'text-gray-900 dark:text-white'
                              : 'text-gray-400 italic dark:text-gray-500'
                          }`}
                        >
                          {profileData.phone || 'Please enter your phone number'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-gray-700 dark:text-gray-300 transition-colors duration-300">Location</Label>
                    {isEditing ? (
                      <Input
                        id="location"
                        value={editData.location}
                        onChange={(e) => setEditData({...editData, location: e.target.value})}
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white transition-all duration-300"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 p-2 bg-gradient-to-r from-gray-50 to-indigo-50/50 dark:from-gray-700/50 dark:to-indigo-900/20 rounded-md border border-gray-200 dark:border-gray-600 transition-all duration-300">
                        <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span
                          className={`transition-colors duration-300 ${
                            profileData.location
                              ? 'text-gray-900 dark:text-white'
                              : 'text-gray-400 italic dark:text-gray-500'
                          }`}
                        >
                          {profileData.location || 'Please enter your location'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSave} className="flex-1 sm:flex-none hover:shadow-lg transition-all duration-300">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancel} className="flex-1 sm:flex-none hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300">
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 relative z-10">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white transition-colors duration-300">Recent Activity</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300 transition-colors duration-300">Your latest expense and payment activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-blue-50/30 dark:from-gray-700/50 dark:to-blue-900/20 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white transition-colors duration-300">{activity.action}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">{activity.date}</p>
                      </div>
                      {activity.amount && (
                        <div className="text-right">
                          <Badge 
                            variant={activity.type === 'payment' ? 'default' : 'secondary'} 
                            className={activity.type === 'payment' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50' 
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                            }
                          >
                            {activity.amount}
                          </Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="space-y-4">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative z-10">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.gradient} shadow-lg`}>
                        <stat.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">{stat.label}</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">{stat.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 relative z-10">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 dark:text-white transition-colors duration-300">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Payment Methods
                </Button>
                <Button variant="outline" className="w-full justify-start hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-300 dark:hover:border-green-600 transition-all duration-300">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Groups
                </Button>
                <Button variant="outline" className="w-full justify-start hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300">
                  <Calendar className="w-4 h-4 mr-2" />
                  Expense History
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Premium Image Upload Modal - Moved outside main container for proper z-index */}
      {showImageUploader && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md mx-4 overflow-hidden transform transition-all duration-300 scale-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Update Profile Photo
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Choose a new photo for your profile
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Current/Preview Image */}
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-600 shadow-lg">
                  {preview ? (
                    <Image  
                      src={preview} 
                      alt="Preview"
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  ) : user.avatarUrl ? (
                    <Image  
                      src={user.avatarUrl} 
                      alt="Current"
                      width={80}
                      height={80} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                      <User className="w-12 h-12 text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* File Input */}
              <div className="space-y-3">
                <label 
                  htmlFor="avatar-upload" 
                  className="block w-full"
                >
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors duration-200 cursor-pointer bg-gray-50 dark:bg-gray-700/50">
                    <Upload className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      <span className="font-medium text-blue-600 dark:text-blue-400">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {selectedFile && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-700 dark:text-green-300 font-medium">
                      {selectedFile.name}
                    </span>
                    <span className="text-xs text-green-600 dark:text-green-400 ml-auto">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <Button
                variant="outline"
                onClick={handleCloseModal}
                className="flex-1 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Photo
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Profile;