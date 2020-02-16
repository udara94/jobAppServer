const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const verify = require('./veriftToken');

//get all post
router.get('/',verify , async (req, res) =>{
   try{
       const posts = await Post.find();
       res.json(posts);
   }catch(err){
       res.json({
           message: err
       });
   }
})

//submit a post
router.post('/', verify ,async (req, res)=>{
    const post = new Post({
        title: req.body.title,
        description: req.body.description
    });

    try{
        const savedPost = await post.save()
        res.json(savedPost);
    }catch(err){
        res.json({message: err});
    }
});

// specific post
router.get('/:postId', verify, async(req, res)=>{
    try{
        const post = await Post.findById(req.params.postId);
        res.json(post);
    }catch(err){
        res.json({message: err});
    }
})

//delete specific post
router.delete('/:postId', verify, async(req, res)=>{
    try{
        const removePost = await Post.remove({ _id : req.params.postId});
        res.json(removePost);
    }catch(err){
        res.json({message: err});
    }
  
})

// update post
router.patch('/:postId', verify, async(req, res)=>{
    try{
        const updatePost = await Post.updateOne(
            {_id: req.params.postId},
            {$set: {title: req.body.title}}
        );
        res.json(updatePost);
    }catch(err){
        res.json({ message: err});
    }
})
module.exports = router;