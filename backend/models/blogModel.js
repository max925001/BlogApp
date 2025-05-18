import mongoose from "mongoose";

const blogModel = new mongoose.Schema({

  title: { type: String, required: true,maxLength: [50, "Title cannot exceed 50 characters"], },
  content: { type: String, required: true  ,maxLength:[2000,"Content cannot exceed 2000 characters"] },
  tags: { type: [String], default: [] },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

},{timestamps:true})


blogModel.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

const Blog = mongoose.model('Blog',blogModel)
export default Blog