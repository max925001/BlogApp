import Blog from '../models/blogModel.js'



export const createBlog = async (req, res) => {
  const { title, content, tags } = req.body;

  try {
    // Validate required fields and length constraints
    if (!title || !content) {
      return res.status(400).json({ success: false, message: "Title and content are required" });
    }
    if (title.length > 50) {
      return res.status(400).json({ success: false, message: "Title cannot exceed 50 characters" });
    }
    if (content.length < 50) {
      return res.status(400).json({ success: false, message: "Content must be at least 50 characters" });
    }
    if (content.length > 2000) {
      return res.status(400).json({ success: false, message: "Content cannot exceed 2000 characters" });
    }

let blog = await Blog.findOneAndUpdate({ author: req.user.id, status: "draft" });

    if (blog) {
      // Update existing draft
      blog.title = title || "";
      blog.content = content || "";
      blog.tags = tags || [];
      blog.status= "published";
      blog.updatedAt = Date.now()
      
    } else {
      // Create new auto-draft
      blog = new Blog({
        title: title || "",
        content: content || "",
        tags: tags || [],
        status: "published",
        author: req.user.id,
      });
    }

    await blog.save();


    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const addTags = async (req,res) =>{
 const { id } = req.params;
  const { tags } = req.body;
  try {
    const blog = await Blog.findById(id);
    if (!blog || blog.author.toString() !== req.user.id) {
      return res.status(404).json({success:false, message: 'Blog not found or unauthorized' });
    }
    blog.tags = [...new Set([...blog.tags, ...(tags || [])])]; // Avoid duplicates
    await blog.save();
    res.status(201).json({
        success: true,
        message: 'Tags added successfully',
        blog: blog
    });
  } catch (error) {
    res.status(500).json({ success:false ,message: 'Server error', error: error.message });
  }

}


export const saveDraft = async (req,res) =>{


 const { id, title, content, tags } = req.body;
  try {
    let blog;
    if (id) {
      blog = await Blog.findById(id);
      if (!blog || blog.author.toString() !== req.user.id) {
        return res.status(404).json({ message: 'Blog not found or unauthorized' });
      }
      blog.title = title || blog.title;
      blog.content = content || blog.content;
      blog.tags = tags || blog.tags;
      blog.status = 'draft';
    } else {
      if (!title || !content) {
        return res.status(400).json({ success:false, message: 'Title and content are required' });
      }
      blog = new Blog({
        title,
        content,
        tags: tags || [],
        status: 'draft',
        author: req.user.id,
      });
    }
    await blog.save();
    res.json(blog);
  } catch (error) {
    res.status(500).json({ success:false , message: 'Server error', error: error.message });
  }


}

export const editBlog = async(req,res) =>{


 const { id } = req.params;
  const { title, content, tags, status } = req.body;
  console.log(title, content, tags, status)
  try {
    const blog = await Blog.findById(id);
    if (!blog || blog.author.toString() !== req.user.id) {
      return res.status(404).json({success:false, message: 'Blog not found or unauthorized' });
    }
    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.tags = tags || blog.tags;
    blog.status = status || blog.status;
    await blog.save();
    res.json({
        success:true,
        message: 'Blog updated successfully',
        blog
    });
  } catch (error) {
    res.status(500).json({success:false, message: 'Server error', error: error.message });
  }

}


export const autoSaveDraft = async (req, res) => {
  const { title, content, tags } = req.body;
  console.log(title, content, tags)

  try {
    // Find existing auto-saved draft for the user
    let blog = await Blog.findOne({ author: req.user.id, status: "draft" });

    if (blog) {
      // Update existing draft
      blog.title = title || "";
      blog.content = content || "";
      blog.tags = tags || [];
      blog.updatedAt = Date.now();
    } else {
      // Create new auto-draft
      blog = new Blog({
        title: title || "",
        content: content || "",
        tags: tags || [],
        status: "draft",
        author: req.user.id,
      });
    }

    await blog.save();
    res.status(200).json({ success: true, message: "Auto-draft saved successfully", blog });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};



export const fetchAutoDraft = async (req, res) => {
  try {
    console.log("hello")
    const blog = await Blog.findOne({ author: req.user.id, status: "draft" });
    console.log(blog)
    if (!blog) {
      return res.status(404).json({ success: false, message: "No auto-draft found" });
    }
    res.status(200).json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const deleteBlog = async (req,res) =>{


 const { id } = req.params;
  try {
    const blog = await Blog.findById(id);
    if (!blog || blog.author.toString() !== req.user.id) {
      return res.status(404).json({ success:false ,message: 'Blog not found or unauthorized' });
    }
      await Blog.findByIdAndDelete(id);
    res.json({ 
        success:true,
        message: 'Blog deleted successfully' });
        blog
  } catch (error) {
    res.status(500).json({ success:false,message: 'Server error', error: error.message });
  }
}

export const getAllBlogsByID = async (req,res) =>{


 try {
    const blogs = await Blog.find({ author: req.user.id }).sort({ updated_at: -1 });
    res.status(200).json({
        success:true,
        message: 'Blogs retrieved successfully',
        blogs
    });
  } catch (error) {
    res.status(500).json({ success:false,message: 'Server error', error: error.message });
  }

}


export const getBlogById = async (req,res) =>{

 const { id } = req.params;
  try {
     const blog = await Blog.findById(id).populate('author', '_id username avatar');
    if (!blog) {
      return res.status(404).json({ success:false,message: 'Blog not found or unauthorized' });
    }
    res.status(200).json({
        success:true,
        message: 'Blog retrieved successfully',
        blog
    });
  } catch (error) {
    res.status(500).json({ success:false ,message: 'Server error', error: error.message });
  }

}
export const getAllBlogs = async (req, res) => {
  try {
    
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    
    const totalBlogs = await Blog.countDocuments();

    
    const blogs = await Blog.find({ status: "published" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "username avatar");

    const totalPages = Math.ceil(totalBlogs / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      message: "Blogs retrieved successfully",
      blogs,
      pagination: {
        currentPage: page,
        totalPages,
        totalBlogs,
        limit,
        hasNextPage,
        hasPrevPage,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


