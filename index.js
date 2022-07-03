require('dotenv').config();

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json());

const posts = [
    {
        username:'srinivas',
        title:'Post 1'
    },
    {
        username:'Akella',
        title:'Post 2'
    }
];

app.get('/posts', authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name));
});

app.post('/login', (req, res) => {
    const username = req.body.username
    const user = {name:username}

    const accessToken = jwt.sign(user, process.env.SECRET_ACCESS_TOKEN);
    res.json({accessToken: accessToken});
});

function authenticateToken(req, res, next) {
   const authHeader = req.header['authorization'];
   const token = authHeader && authHeader.split(' ')[1];

   if (token === null) return res.sendStatus(401);
   
   jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (err, user) => {
    if (err) return res.status(403).send(err);
    req.user = user
    next()
   })
}

app.listen(3500);

/* to create a token we need to type node in terminal and and then
require('crypto').randomBytes(64).toString('hex') <= this line. */