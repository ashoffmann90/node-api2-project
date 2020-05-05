const router = require('express').Router()

const Posts = require('../data/db')

router.post('/', (req, res) => {
    const {title, contents} = req.body
    if(!title || !contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }
    Posts.insert({title, contents})
    .then(({id}) => {
        Posts.findById(id)
        .then(([posts]) => {
            res.status(201).json(posts)
        })
    })
    .catch(err => {
        res.status(500).json({ error: "There was an error while saving the post to the database" })
    })
})

router.post('/:post_id/comments', (req, res) => {
    const {post_id} = req.params
    const {text} = req.body
    if(text === '' || typeof text !== 'string'){
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    }
    Posts.insertComment({text, post_id})
    .then(({id: comment_id}) => {
        Posts.findCommentById(comment_id)
        .then(([comment]) => {
            if(comment){
                res.status(200).json(comment)
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ error: "There was an error while saving the comment to the database" })
    })
})

router.get('/', (req, res) => {
    Posts.find(req.query)
    .then(posts => {
        res.status(200).json(posts)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ error: "The posts information could not be retrieved." })
    })
})

router.get('/:id', (req, res) => {
    const id = req.params.id
    Posts.findById(id)
    .then(post => {
        if(post) {
            res.status(200).json(post)
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ error: "The post information could not be retrieved." })
    })
})

router.get('/:id/comments', (req, res) => {
    const id = req.params.id
    Posts.findCommentById(id)
    .then(([comment]) => {
        if(comment){
            res.status(200).json(comment)
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ error: "The comments information could not be retrieved." })
    })
})

router.delete('/:id', (req, res) => {
    const id = req.params.id
    Posts.remove(id)
    .then(posts => {
        if(posts) {
            res.status(200).json({ message: "The post has been deleted "})
        } else {
            res.status(404).json({ errorMessage: "The post with the specified ID does not exist"})
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({errorMessage: "The post could not be removed" })
    })
})

router.put('/:id', (req, res) => {
    const post_id = req.params.id
    const updated_post = req.body
    Posts.update(post_id, updated_post)
    .then(updatedPost => {
        if(updatedPost){
            Posts.findById(post_id)
            .then(([post]) => {
                res.status(201).json(post)
            })
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ error: "The posts information could not be retrieved." })
    })
})


module.exports = router