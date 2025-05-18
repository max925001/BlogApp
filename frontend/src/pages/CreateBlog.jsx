import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBlog, saveDraft, autoSaveDraft, fetchAutoDraft, clearCreateError, clearDraftError } from "../redux/slices/BlogSlice";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import debounce from "lodash.debounce";
import { FaHome } from "react-icons/fa";

const CreateBlog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { createLoading, draftLoading, autoSaveLoading, createError, draftError, autoDraft } = useSelector((state) => state.blogs);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  // Fetch user's auto-saved draft on mount
  useEffect(() => {
    console.log("Fetching auto-draft on mount");
    dispatch(fetchAutoDraft()).then((result) => {
      if (result.payload?.blog) {
        console.log("Auto-draft fetched:", result.payload.blog);
        setTitle(result.payload.blog.title || "");
        setContent(result.payload.blog.content || "");
        setTags(result.payload.blog.tags || []);
      } else {
        console.log("No auto-draft found or error:", result.payload);
      }
    });
  }, [dispatch]);

  // Debounced auto-save function
  const debouncedAutoSave = useCallback(
    debounce((title, content, tags) => {
      if (title || content || tags.length > 0) {
        console.log("Triggering auto-save with:", { title, content, tags });
        dispatch(autoSaveDraft({ title, content, tags })).then((result) => {
          if (!result.error) {
            toast.success("Draft auto-saved", { duration: 2000 });
          } else {
            console.error("Auto-save failed:", result.error);
          }
        });
      } else {
        console.log("Skipping auto-save: all fields empty");
      }
    }, 2000),
    [dispatch]
  );

  // Auto-save on title, content, or tags change
  useEffect(() => {
    debouncedAutoSave(title, content, tags);
    return () => {
      console.log("Canceling debounced auto-save");
      debouncedAutoSave.cancel();
    };
  }, [title, content, tags, debouncedAutoSave]);

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

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e, isDraft = false) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error("Title and content are required");
      return;
    }
    const action = isDraft ? saveDraft({ title, content, tags }) : createBlog({ title, content, tags });
    const result = await dispatch(action);
    if (!result.error) {
      console.log(isDraft ? "Draft saved" : "Blog published");
      setTitle("");
      setContent("");
      setTags([]);
      setTagInput("");
      if (!isDraft) navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-3 sm:p-6 lg:p-8">
      
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/")}
            aria-label="Go to home page"
            className="text-orange-500 hover:text-orange-400 transition-all transform hover:scale-105 focus:outline-none"
          >
            <FaHome className="text-2xl sm:text-3xl cursor-pointer" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-orange-500 text-center flex-1">
            Create a New Blog
          </h1>
          <div className="w-8 sm:w-10"></div> {/* Spacer for alignment */}
        </div>
        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-base sm:text-lg font-medium text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={50}
              required
              className="w-full bg-gray-800 text-gray-300 border border-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-md p-2 sm:p-3 text-sm sm:text-base outline-none"
              placeholder="Enter blog title"
            />
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              {title.length}/50 characters
            </p>
            {createError && createError.includes("Title") && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{createError}</p>
            )}
            {draftError && draftError.includes("Title") && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{draftError}</p>
            )}
          </div>
          <div>
            <label htmlFor="content" className="block text-base sm:text-lg font-medium text-gray-300 mb-1">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(

e) => setContent(e.target.value)}
              minLength={50}
              maxLength={2000}
              required
              rows={8}
              className="w-full bg-gray-800 text-gray-300 border border-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-md p-2 sm:p-3 text-sm sm:text-base outline-none resize-y"
              placeholder="Write your blog content here..."
            />
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              {content.length}/2000 characters
            </p>
            {createError && createError.includes("Content") && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{createError}</p>
            )}
            {draftError && draftError.includes("Content") && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{draftError}</p>
            )}
          </div>
          <div>
            <label htmlFor="tags" className="block text-base sm:text-lg font-medium text-gray-300 mb-1">
              Tags
            </label>
            <input
              type="text"
              id="tags"
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
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <button
              type="submit"
              disabled={createLoading || draftLoading || autoSaveLoading}
              className="bg-orange-500 text-gray-900 px-4 sm:px-6 py-2 rounded-full font-bold hover:bg-orange-400 hover:shadow-lg hover:shadow-orange-500/50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {createLoading ? "Publishing..." : "Publish Blog"}
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={createLoading || draftLoading || autoSaveLoading}
              className="bg-gray-700 text-gray-300 px-4 sm:px-6 py-2 rounded-full font-bold hover:bg-gray-600 cursor-pointer hover:shadow-lg hover:shadow-orange-500/50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {draftLoading ? "Saving..." : "Save as Draft"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;