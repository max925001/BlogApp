import {Router} from 'express'

import { isLoggedIn } from '../middleware/auth.js'
import { addTags, autoSaveDraft, createBlog, deleteBlog, editBlog, fetchAutoDraft, getAllBlogs, getAllBlogsByID, getBlogById, saveDraft } from '../controllers/blogController.js'


const blogRoute = Router()


blogRoute.post('/create',isLoggedIn,createBlog)
blogRoute.put('/tags/:id',isLoggedIn,addTags)
blogRoute.get('/auto-draft',isLoggedIn,fetchAutoDraft)
blogRoute.post('/save-draft',isLoggedIn,saveDraft)
blogRoute.put('/edit/:id',isLoggedIn,editBlog)
blogRoute.delete('/delete/:id',isLoggedIn,deleteBlog)
blogRoute.get('/userBlog',isLoggedIn,getAllBlogsByID)
blogRoute.get('/:id',isLoggedIn,getBlogById)
blogRoute.get('/',isLoggedIn,getAllBlogs)
blogRoute.post('/auto-save-draft',isLoggedIn,autoSaveDraft)





export default blogRoute