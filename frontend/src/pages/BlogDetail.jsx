import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBlogById,
  editBlog,
  deleteBlog,
  clearEditError,
  clearDeleteError,
} from "../redux/slices/BlogSlice";
import { toast } from "react-hot-toast";
import { FaEdit, FaTrash, FaSave, FaTimes, FaUserCircle, FaHome } from "react-icons/fa";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentBlog, loading, error, editLoading, deleteLoading, editError, deleteError } =
    useSelector((state) => state.blogs);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [localError, setLocalError] = useState(null);

  // Get logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem("data") || "{}");
  const isAuthor = currentBlog?.author?._id === user._id;
  

  // Fetch blog on mount
  useEffect(() => {
    if (!user._id) {
      toast.error("Please log in to view this blog");
      navigate("/login");
      return;
    }
    dispatch(fetchBlogById(id));
    return () => {
      dispatch(clearEditError());
      dispatch(clearDeleteError());
    };
  }, [dispatch, id, user._id, navigate]);

  // Initialize form fields when blog is fetched
  useEffect(() => {
    if (currentBlog) {
      setTitle(currentBlog.title || "");
      setContent(currentBlog.content || "");
      setTags(currentBlog.tags || []);
    }
  }, [currentBlog]);

  // Handle tag input
  const handleTagInput = (e) => {
    const value = e.target.value;
    setTagInput(value);
    if (value.endsWith(",") || e.key === "Enter") {
      const newTag = value.replace(",", "").trim();
      if (newTag && tags.length < 10 && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setTagInput("");
      } else if (tags.length >= 10) {
        toast.error("Maximum 10 tags allowed");
      }
    }
  };

  // Remove tag
  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  // Toggle edit mode
  const handleEditToggle = () => {
    if (!isAuthor) {
      toast.error("Only the blog author can edit this blog");
      return;
    }
    setIsEditing(!isEditing);
    setLocalError(null);
    dispatch(clearEditError());
  };

  // Save edited blog
  const handleSave = async () => {
    if (!isAuthor) {
      toast.error("Only the blog author can edit this blog");
      setLocalError("Unauthorized");
      return;
    }
    if (!title || !content) {
      setLocalError("Title and content are required");
      toast.error("Title and content are required");
      return;
    }
    if (title.length > 50) {
      setLocalError("Title cannot exceed 50 characters");
      toast.error("Title cannot exceed 50 characters");
      return;
    }
    if (content.length < 50) {
      setLocalError("Content must be at least 50 characters");
      toast.error("Content must be at least 50 characters");
      return;
    }
    if (content.length > 2000) {
      setLocalError("Content cannot exceed 2000 characters");
      toast.error("Content cannot exceed 2000 characters");
      return;
    }

    const result = await dispatch(
      editBlog({ id, title, content, tags, status: "published" })
    );
    if (editBlog.fulfilled.match(result)) {
      setIsEditing(false);
      toast.success("Blog updated successfully");
    } else {
      const errorMsg = result.payload || "Failed to update blog";
      setLocalError(errorMsg);
      if (errorMsg.includes("not authorized")) {
        toast.error("Only the blog author can edit this blog");
      }
    }
  };

  // Delete blog
  const handleDelete = async () => {
    if (!isAuthor) {
      toast.error("Only the blog author can delete this blog");
      return;
    }
    if (window.confirm("Are you sure you want to delete this blog?")) {
      const result = await dispatch(deleteBlog(id));
      if (deleteBlog.fulfilled.match(result)) {
        toast.success("Blog deleted successfully");
        navigate("/");
      } else {
        const errorMsg = result.payload || "Failed to delete blog";
        if (errorMsg.includes("not authorized")) {
          toast.error("Only the blog author can delete this blog");
        }
      }
    }
  };

  // Navigate to home page
  const handleHomeClick = () => {
    navigate("/");
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-900 text-gray-300 text-center pt-20">Loading...</div>;
  }

  if (!currentBlog) {
    return <div className="min-h-screen bg-gray-900 text-red-500 text-center pt-20">Blog not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 p-3 sm:p-6 lg:p-8">
      <div className="max-w-3xl sm:max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleHomeClick}
                className="text-orange-500 hover:text-orange-400 transition-all transform hover:scale-110 cursor-pointer"
                title="Back to Home"
              >
                <FaHome className="text-xl sm:text-2xl" />
              </button>
              <h1 className="text-xl sm:text-2xl font-bold text-orange-500">
                {isEditing ? "Edit Blog" : currentBlog.title}
              </h1>
            </div>
            {isAuthor && (
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={editLoading}
                      className={`bg-orange-500 text-gray-900 px-3 sm:px-4 py-1 cursor-pointer sm:py-2 rounded-full font-bold hover:bg-orange-400 hover:shadow-lg hover:shadow-orange-500/50 transition-all transform hover:scale-105 w-full sm:w-auto ${
                        editLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <FaSave className="inline mr-1" /> {editLoading ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={handleEditToggle}
                      disabled={editLoading}
                      className="bg-gray-700 text-gray-300 px-3 sm:px-4 py-1 sm:py-2 cursor-pointer rounded-full font-bold hover:bg-gray-600 hover:shadow-lg transition-all transform hover:scale-105 w-full sm:w-auto"
                    >
                      <FaTimes className="inline mr-1" /> Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleEditToggle}
                      className="bg-orange-500 text-gray-900 px-3 sm:px-4 py-1 cursor-pointer sm:py-2 rounded-full font-bold hover:bg-orange-400 hover:shadow-lg hover:shadow-orange-500/50 transition-all transform hover:scale-105 w-full sm:w-auto"
                    >
                      <FaEdit className="inline mr-1" /> Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={deleteLoading}
                      className={`bg-red-600 text-gray-900 px-3 cursor-pointer sm:px-4 py-1 sm:py-2 rounded-full font-bold hover:bg-red-500 hover:shadow-lg transition-all transform hover:scale-105 w-full sm:w-auto ${
                        deleteLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <FaTrash className="inline mr-1" /> {deleteLoading ? "Deleting..." : "Delete"}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Error Message */}
          {(localError || error || editError || deleteError) && (
            <p className="text-red-500 text-sm sm:text-base mb-4">
              {localError || error || editError || deleteError}
            </p>
          )}

          {/* Blog Content */}
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-300 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                readOnly={!isEditing}
                maxLength={50}
                className={`w-full bg-gray-800 text-gray-300 border border-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-md p-2 sm:p-3 text-sm sm:text-base outline-none ${
                  !isEditing ? "cursor-default" : ""
                }`}
                placeholder="Blog title"
              />
              {isEditing && (
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  {title.length}/50 characters
                </p>
              )}
            </div>

            {/* Author */}
            <div className="flex items-center">
              {currentBlog.author?.avatar?.secure_url ? (
                <img
                  src={currentBlog.author.avatar.secure_url}
                  alt={currentBlog.author.username}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-2 border border-orange-500"
                />
              ) : (
                <FaUserCircle className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300 mr-2" />
              )}
              <div>
                <p className="text-gray-300 text-sm sm:text-base">{currentBlog.author.username}</p>
                <p className="text-gray-400 text-xs sm:text-sm">
                  {new Date(currentBlog.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-300 mb-1">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                readOnly={!isEditing}
                minLength={50}
                maxLength={2000}
                rows={8}
                className={`w-full bg-gray-800 text-gray-300 border border-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-md p-2 sm:p-3 text-sm sm:text-base outline-none resize-y ${
                  !isEditing ? "cursor-default" : ""
                }`}
                placeholder="Blog content"
              />
              {isEditing && (
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  {content.length}/2000 characters
                </p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-300 mb-1">Tags</label>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={handleTagInput}
                    onKeyDown={handleTagInput}
                    className="w-full bg-gray-800 text-gray-300 border border-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-md p-2 sm:p-3 text-sm sm:text-base outline-none"
                    placeholder="Enter tags (comma or Enter to add, max 10)"
                  />
                  <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-orange-500 text-gray-900 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-md flex items-center"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="ml-2 text-gray-900 hover:text-orange-400 focus:outline-none"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">
                    {tags.length}/10 tags
                  </p>
                </>
              ) : (
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {currentBlog.tags.length > 0 ? (
                    currentBlog.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-orange-500 text-gray-900 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-md"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-400 text-xs sm:text-sm">No tags</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;