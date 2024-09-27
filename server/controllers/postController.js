const db = require('../utils/db');

const newPost = async (req, res) => {
    var sql = 'INSERT INTO article (title, body, theme, author_id, date) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [req.body.title, req.body.body, req.body.theme, req.body.author, new Date()], (err, result) => {
        if (err) {
            console.log('Error creating post');
            return;
        }
        console.log('Post created');
        res.send('Post created').status(200);
    });
};

const getPosts = async (req, res) => {
    var sql = 'SELECT article.ID, article.title, article.body, article.date, user.username, COUNT(likes.post_id) AS likes FROM article INNER JOIN user ON article.author_id = user.ID LEFT JOIN likes ON article.ID = likes.post_id GROUP BY article.ID LIMIT 10';
    db.query(sql, async (err, results) => {
        if (err) {
            console.log('Error fetching posts');
            return;
        }
        res.json(results);
    });
};

module.exports = {
    newPost,
    getPosts
};