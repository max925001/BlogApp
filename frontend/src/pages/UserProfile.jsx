import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaUserCircle, FaEdit, FaTimes, FaHome, FaSave } from "react-icons/fa";
import { fetchUserBlogs } from "../redux/slices/BlogSlice";
import { updateUserProfile } from "../redux/slices/AuthSlice";

const UserProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userBlogs, userBlogsLoading, userBlogsError } = useSelector((state) => state.blogs);
  const { loading: authLoading, error: authError } = useSelector((state) => state.auth);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("data") || "{}"));
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.avatar?.secure_url || "");

  // Fetch user blogs on mount
  useEffect(() => {
    if (!user._id) {
      toast.error("Please log in to view your profile");
      navigate("/login");
      return;
    }
    dispatch(fetchUserBlogs());
  }, [dispatch, user._id, navigate]);

  // Handle image selection and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        toast.error("Please upload a JPEG or PNG image");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        return;
      }
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Handle profile photo update
  const handleSave = async () => {
    if (!profileImage) {
      toast.error("Please select a profile picture");
      return;
    }
    const formData = new FormData();
    formData.append("avatar", profileImage);
    const result = await dispatch(updateUserProfile(formData));
    if (updateUserProfile.fulfilled.match(result)) {
      const updatedUser = result.payload.user;
      const newData = {
        _id: updatedUser._id,
        username: updatedUser.username,
        avatar: updatedUser.avatar,
      };
      localStorage.setItem("data", JSON.stringify(newData));
      setUser(newData);
      setIsEditing(false);
      setProfileImage(null);
      setPreviewUrl(updatedUser.avatar.secure_url);
      toast.success("Profile photo updated successfully");
    } else {
      toast.error(result.payload || "Failed to update profile photo");
    }
  };

  // Cancel edit
  const handleCancel = () => {
    setIsEditing(false);
    setProfileImage(null);
    setPreviewUrl(user?.avatar?.secure_url || "");
  };

  // Navigate to home
  const handleHomeClick = () => {
    navigate("/");
  };

  // Navigate to blog detail
  const handleBlogClick = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-3 sm:p-6 lg:p-8">
      <div className="max-w-3xl sm:max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleHomeClick}
                className="text-orange-500 hover:text-orange-400 transition-all transform hover:scale-110"
                title="Back to Home"
              >
                <FaHome className="text-xl sm:text-2xl" />
              </button>
              <h1 className="text-xl sm:text-2xl font-bold text-orange-500">User Profile</h1>
            </div>
          </div>

          {/* Error Message */}
          {(userBlogsError || authError) && (
            <p className="text-red-500 text-sm sm:text-base mb-4">
              {userBlogsError || authError}
            </p>
          )}

          {/* Profile Section */}
          <div className="space-y-6">
            {/* User Info */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Profile"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-orange-500 object-cover"
                />
              ) : (
                <FaUserCircle className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300" />
              )}
              <div className="text-center sm:text-left">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-300">{user.username}</h2>
                <p className="text-sm sm:text-base text-gray-400">Your Blogs: {userBlogs.length}</p>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-orange-500 text-gray-900 px-3 sm:px-4 py-1 sm:py-2 rounded-full font-bold hover:bg-orange-400 hover:shadow-lg hover:shadow-orange-500/50 transition-all transform hover:scale-105"
              >
                <FaEdit className="inline mr-1" /> Edit Photo
              </button>
            </div>

            {/* Edit Profile Photo */}
            {isEditing && (
              <div className="bg-gray-700 p-4 rounded-md space-y-4">
                <h3 className="text-sm sm:text-base font-medium text-gray-300">Change Profile Photo</h3>
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleImageChange}
                  className="w-full text-gray-300 bg-gray-800 border border-gray-600 rounded-md p-2 text-sm sm:text-base"
                />
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    onClick={handleSave}
                    disabled={authLoading}
                    className={`bg-orange-500 text-gray-900 px-3 sm:px-4 py-1 sm:py-2 rounded-full font-bold hover:bg-orange-400 hover:shadow-lg hover:shadow-orange-500/50 transition-all transform hover:scale-105 w-full sm:w-auto ${
                      authLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <FaSave className="inline mr-1" /> {authLoading ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={authLoading}
                    className="bg-gray-600 text-gray-300 px-3 sm:px-4 py-1 sm:py-2 rounded-full font-bold hover:bg-gray-500 transition-all transform hover:scale-105 w-full sm:w-auto"
                  >
                    <FaTimes className="inline mr-1" /> Cancel
                  </button>
                </div>
              </div>
            )}

            {/* User Blogs */}
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-orange-500 mb-4">Your Blogs</h3>
              {userBlogsLoading ? (
                <p className="text-gray-300 text-center">Loading blogs...</p>
              ) : userBlogs.length === 0 ? (
                <p className="text-gray-400 text-center">No blogs found</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userBlogs.map((blog) => (
                    <div
                      key={blog._id}
                      onClick={() => handleBlogClick(blog._id)}
                      className="bg-gray-700 rounded-md p-4 hover:bg-gray-600 cursor-pointer transition-all transform hover:scale-105"
                    >
                      <h4 className="text-sm sm:text-base font-bold text-gray-300 truncate">
                        {blog.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-400 line-clamp-2">{blog.content}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {blog.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-orange-500 text-gray-900 text-xs px-2 py-1 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(blog.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;