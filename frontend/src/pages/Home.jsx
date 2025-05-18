import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../redux/slices/BlogSlice";
import { logout } from "../redux/slices/AuthSlice";
import { useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { FaHeart, FaComment, FaBookmark, FaUserCircle, FaPlus } from "react-icons/fa";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { blogs, pagination, loading, error } = useSelector((state) => state.blogs);
  const user = JSON.parse(localStorage.getItem("data"));
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchBlogs({ page, limit: 20 }));
  }, [dispatch, page]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
        !loading &&
        pagination.hasNextPage
      ) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, pagination.hasNextPage]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleBlogClick = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  const handleProfileClick = () => {
    navigate("/userprofile");
  };

  const handleCreateBlog = () => {
    navigate("/create-blog");
  };

  return (
    <div className="min-h-screen bg-gray-900 p-3 sm:p-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-orange-500">
          Latest Blogs
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleProfileClick}
            className="focus:outline-none cursor-pointer"
            aria-label="User Profile"
          >
            {user?.avatar?.secure_url ? (
              <img
                src={user.avatar.secure_url}
                alt={user.username}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-orange-500 hover:border-orange-400 transition-colors"
              />
            ) : (
              <FaUserCircle className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300 hover:text-orange-400 transition-colors" />
            )}
          </button>
          <button
            onClick={handleLogout}
            className="bg-orange-500 text-gray-900 cursor-pointer px-4 sm:px-6 py-2 rounded-full font-bold hover:bg-orange-400 hover:shadow-lg hover:shadow-orange-500/50 transition-all transform hover:scale-105"
          >
            Logout
          </button>
        </div>
      </div>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto">
        {/* Create New Blog Card */}
        <div
          className="bg-gray-800 rounded-lg shadow-md p-3 sm:p-4 flex flex-col justify-center items-center cursor-pointer hover:bg-gray-700 hover:shadow-lg hover:shadow-orange-500/50 transition-all transform hover:scale-105 h-80 w-full"
          onClick={handleCreateBlog}
        >
          <FaPlus className="text-orange-500 text-2xl sm:text-3xl mb-2" />
          <h2 className="text-base sm:text-xl font-semibold text-orange-500 text-center">Create New Blog</h2>
          <p className="text-gray-300 text-xs sm:text-sm text-center mt-2">Share your thoughts with the world!</p>
        </div>
        {/* Blog Cards */}
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-gray-800 rounded-lg shadow-md p-3 sm:p-4 flex flex-col justify-between cursor-pointer hover:bg-gray-700 hover:shadow-lg hover:shadow-orange-500/50 transition-all transform hover:scale-105 h-80 w-full"
          >
            <div onClick={() => handleBlogClick(blog._id)} className="flex-1">
              <h2 className="text-base sm:text-xl font-semibold text-orange-500 mb-2 line-clamp-2">
                {blog.title}
              </h2>
              <div className="flex items-center mb-2 cursor-pointer">
                {blog.author?.avatar?.secure_url ? (
                  <img
                    src={blog.author.avatar.secure_url}
                    alt={blog.author.username}
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full mr-2 border border-orange-500 cursor-pointer"
                  />
                ) : (
                  <FaUserCircle className="w-6 h-6 sm:w-8 sm:h-8 text-gray-300 mr-2 cursor-pointer" />
                )}
                <span className="text-gray-300 text-xs sm:text-sm">{blog.author.username}</span>
              </div>
              <div className="text-gray-300 text-xs sm:text-sm mb-2 overflow-hidden line-clamp-3">
                {blog.content.length > 100
                  ? blog.content.slice(0, 100)
                  : blog.content}
              </div>
              {blog.content.length > 100 && (
                <button
                  onClick={() => handleBlogClick(blog._id)}
                  className="text-orange-400 hover:underline text-xs sm:text-sm"
                >
                  See More
                </button>
              )}
              {blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {blog.tags.slice(0, 6).map((tag, index) => (
                    <span
                      key={index}
                      className="bg-orange-500 text-gray-900 text-xs px-1 sm:px-1.5 py-0.5 rounded-md hover:bg-orange-400 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                  {blog.tags.length > 6 && (
                    <span className="text-gray-300 text-xs sm:text-sm">...</span>
                  )}
                </div>
              )}
            </div>
            <div className="flex justify-between items-center mt-2">
              <div className="flex gap-2 sm:gap-4">
                <FaHeart
                  className="text-gray-300 hover:text-orange-500 cursor-pointer text-base sm:text-lg"
                  onClick={(e) => e.stopPropagation()}
                />
                <FaComment
                  className="text-gray-300 hover:text-orange-500 cursor-pointer text-base sm:text-lg"
                  onClick={(e) => e.stopPropagation()}
                />
                <FaBookmark
                  className="text-gray-300 hover:text-orange-500 cursor-pointer text-base sm:text-lg"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      {loading && (
        <p className="text-center text-gray-300 mt-4">Loading more blogs...</p>
      )}
      {!loading && !pagination.hasNextPage && blogs.length > 0 && (
        <p className="text-center text-gray-300 mt-4">No more blogs to load</p>
      )}
    </div>
  );
};

export default Home;