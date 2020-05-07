require('dotenv').config()
const express = require('express')
const postsRouter = require('./posts/posts-router')
const server = express()

server.use(express.json())

server.get('/', (req, res) => {
    res.json({ query: req.query, params: req.params, headers: req.header})
})

server.use('/api/posts', postsRouter)

const port = process.env.PORT

server.listen(port, () => {
    console.log(`\n*** Server Running on localhost:${port} ***\n`)
})