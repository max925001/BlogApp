import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helper/axiosInstance";
import { toast } from "react-hot-toast";

export const fetchBlogs = createAsyncThunk(
  "blogs/fetchBlogs",
  async ({ page = 1, limit = 20 }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`blog?page=${page}&limit=${limit}`);
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch blogs";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const createBlog = createAsyncThunk(
  "blogs/createBlog",
  async ({ title, content, tags }, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosInstance.post("blog/create", {
        title,
        content,
        tags,
        status: "published",
      });
      dispatch(fetchBlogs({ page: 1, limit: 20 }));
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create blog";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const saveDraft = createAsyncThunk(
  "blogs/saveDraft",
  async ({ id, title, content, tags }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("blog/save-draft", {
        id,
        title,
        content,
        tags,
      });
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to save draft";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const autoSaveDraft = createAsyncThunk(
  "blogs/autoSaveDraft",
  async ({ title, content, tags }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("blog/auto-save-draft", {
        title,
        content,
        tags,
      });
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to auto-save draft";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchAutoDraft = createAsyncThunk(
  "blogs/fetchAutoDraft",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("blog/auto-draft");
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || "No draft found";
      return rejectWithValue(message);
    }
  }
);

export const fetchBlogById = createAsyncThunk(
  "blogs/fetchBlogById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`blog/${id}`);
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch blog";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const editBlog = createAsyncThunk(
  "blogs/editBlog",
  async ({ id, title, content, tags }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`blog/edit/${id}`, {
        title,
        content,
        tags,
        status: "published",
      });
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update blog";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const deleteBlog = createAsyncThunk(
  "blogs/deleteBlog",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`blog/delete/${id}`);
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete blog";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchUserBlogs = createAsyncThunk(
  "blogs/fetchUserBlogs",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("blog/userBlog");
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch user blogs";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    blogs: [],
    currentBlog: null,
    userBlogs: [],
    autoDraft: null,
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalBlogs: 0,
      limit: 20,
      hasNextPage: false,
      hasPrevPage: false,
    },
    loading: false,
    createLoading: false,
    draftLoading: false,
    autoSaveLoading: false,
    editLoading: false,
    deleteLoading: false,
    userBlogsLoading: false,
    error: null,
    createError: null,
    draftError: null,
    autoSaveError: null,
    editError: null,
    deleteError: null,
    userBlogsError: null,
  },
  reducers: {
    clearCreateError: (state) => {
      state.createError = null;
    },
    clearDraftError: (state) => {
      state.draftError = null;
    },
    clearAutoSaveError: (state) => {
      state.autoSaveError = null;
    },
    clearEditError: (state) => {
      state.editError = null;
    },
    clearDeleteError: (state) => {
      state.deleteError = null;
    },
    clearUserBlogsError: (state) => {
      state.userBlogsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchBlogs
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload.blogs;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // createBlog
      .addCase(createBlog.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.createLoading = false;
        state.blogs.unshift(action.payload.blog);
        state.userBlogs.unshift(action.payload.blog);
        state.autoDraft = null;
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload;
      })
      // saveDraft
      .addCase(saveDraft.pending, (state) => {
        state.draftLoading = true;
        state.draftError = null;
      })
      .addCase(saveDraft.fulfilled, (state, action) => {
        state.draftLoading = false;
      })
      .addCase(saveDraft.rejected, (state, action) => {
        state.draftLoading = false;
        state.draftError = action.payload;
      })
      // autoSaveDraft
      .addCase(autoSaveDraft.pending, (state) => {
        state.autoSaveLoading = true;
        state.autoSaveError = null;
      })
      .addCase(autoSaveDraft.fulfilled, (state, action) => {
        state.autoSaveLoading = false;
        state.autoDraft = action.payload.blog;
      })
      .addCase(autoSaveDraft.rejected, (state, action) => {
        state.autoSaveLoading = false;
        state.autoSaveError = action.payload;
      })
      // fetchAutoDraft
      .addCase(fetchAutoDraft.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAutoDraft.fulfilled, (state, action) => {
        state.loading = false;
        state.autoDraft = action.payload.blog || null;
      })
      .addCase(fetchAutoDraft.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchBlogById
      .addCase(fetchBlogById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBlog = action.payload.blog;
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // editBlog
      .addCase(editBlog.pending, (state) => {
        state.editLoading = true;
        state.editError = null;
      })
      .addCase(editBlog.fulfilled, (state, action) => {
        state.editLoading = false;
        state.currentBlog = action.payload.blog;
        const index = state.blogs.findIndex((b) => b._id === action.payload.blog._id);
        if (index !== -1) {
          state.blogs[index] = action.payload.blog;
        }
        const userIndex = state.userBlogs.findIndex((b) => b._id === action.payload.blog._id);
        if (userIndex !== -1) {
          state.userBlogs[userIndex] = action.payload.blog;
        }
      })
      .addCase(editBlog.rejected, (state, action) => {
        state.editLoading = false;
        state.editError = action.payload;
      })
      // deleteBlog
      .addCase(deleteBlog.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.currentBlog = null;
        state.blogs = state.blogs.filter((b) => b._id !== action.meta.arg);
        state.userBlogs = state.userBlogs.filter((b) => b._id !== action.meta.arg);
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
      })
      // fetchUserBlogs
      .addCase(fetchUserBlogs.pending, (state) => {
        state.userBlogsLoading = true;
        state.userBlogsError = null;
      })
      .addCase(fetchUserBlogs.fulfilled, (state, action) => {
        state.userBlogsLoading = false;
        state.userBlogs = action.payload.blogs;
      })
      .addCase(fetchUserBlogs.rejected, (state, action) => {
        state.userBlogsLoading = false;
        state.userBlogsError = action.payload;
      });
  },
});

export const {
  clearCreateError,
  clearDraftError,
  clearAutoSaveError,
  clearEditError,
  clearDeleteError,
  clearUserBlogsError,
} = blogSlice.actions;
export default blogSlice.reducer;