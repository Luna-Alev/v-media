const db = require('../utils/db');

const newPost = async (req, res) => {
    console.log(req.body);
    const { title, body, theme } = req.body;
    const userId = req.userId;
    var sql = 'INSERT INTO article (title, body, theme, author_id, date) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [title, body, theme, userId, new Date()], (err, result) => {
        if (err) {
            console.log('Error creating post');
            return;
        }
        console.log('Post created');
        res.send('Post created').status(200);
    });
};

const getPosts = async (req, res) => {
    switch (req.query.sort) {
        case 'popular':
            var sql = 'SELECT article.ID, article.title, article.body, article.date, user.username, COUNT(likes.post_id) AS likes FROM article INNER JOIN user ON article.author_id = user.ID LEFT JOIN likes ON article.ID = likes.post_id GROUP BY article.ID ORDER BY likes DESC LIMIT 10;';
            break;
        case 'oldest':
            var sql = 'SELECT article.ID, article.title, article.body, article.date, user.username, COUNT(likes.post_id) AS likes FROM article INNER JOIN user ON article.author_id = user.ID LEFT JOIN likes ON article.ID = likes.post_id GROUP BY article.ID ORDER BY article.date ASC LIMIT 10;';
            break;
        case 'newest':
            var sql = 'SELECT article.ID, article.title, article.body, article.date, user.username, COUNT(likes.post_id) AS likes FROM article INNER JOIN user ON article.author_id = user.ID LEFT JOIN likes ON article.ID = likes.post_id GROUP BY article.ID ORDER BY article.date DESC LIMIT 10;';
            break;
    }
    db.query(sql, async (err, results) => {
        if (err) {
            console.log('Error fetching posts');
            return;
        }
        res.json(results);
    });
};

const getPostsByUser = async (req, res) => {
    var sql = 'SELECT article.ID, article.title, article.body, article.date, user.username, COUNT(likes.post_id) AS likes FROM article INNER JOIN user ON article.author_id = user.ID LEFT JOIN likes ON article.ID = likes.post_id WHERE user.username = ? GROUP BY article.ID LIMIT 10';
    db.query(sql, [req.params.user], async (err, results) => {
        if (err) {
            console.log('Error fetching posts');
            return;
        }
        res.json(results);
    });
};

module.exports = {
    newPost,
    getPosts,
    getPostsByUser
};