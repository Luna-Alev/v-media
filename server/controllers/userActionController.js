const db = require('../utils/db');

const follow = async (req, res) => {
    var sql = 'SELECT * FROM follow WHERE follower_id = ? AND followee_id = (SELECT id FROM user WHERE username = ?)';
    db.query(sql, [req.body.follower, req.body.followee], (err, results) => {
        if (err) {
            console.log('Error checking if user is followed');
            return;
        }
        if (results.length > 0) {
            var sql = 'DELETE FROM follow WHERE follower_id = ? AND followee_id = (SELECT id FROM user WHERE username = ?)';
            db.query(sql, [req.body.follower, req.body.followee], (err, result) => {
                if (err) {
                    console.log('Error unfollowing user');
                    return;
                }
                res.send('User unfollowed').status(200);
            });
        }
        else {
            var sql = 'INSERT INTO follow (follower_id, followee_id) VALUES (?, (SELECT id FROM user WHERE username = ?))';
            db.query(sql, [req.body.follower, req.body.followee], (err, result) => {
                if (err) {
                    console.log('Error following user');
                    return;
                }
                res.send('User followed').status(200);
            });
        }
    });
};

const like = async (req, res) => {
    const userId = req.userId;
    var sql = 'SELECT * FROM likes WHERE post_id = ? AND user_id = ?';
    db.query(sql, [req.body.postID, userId], (err, results) => {
        if (err) {
            console.log('Error checking if post is liked');
            return;
        }
        if (results.length > 0) {
            var sql = 'DELETE FROM likes WHERE post_id = ? AND user_id = ?';
            db.query(sql, [req.body.postID, userId], (err, result) => {
                if (err) {
                    console.log('Error unliking post');
                    return;
                }
                res.send('Post unliked').status(200);
            });
        }
        else {
            var sql = 'INSERT INTO likes (post_id, user_id) VALUES (?, ?)';
            db.query(sql, [req.body.postID, userId], (err, result) => {
                if (err) {
                    console.log('Error liking post');
                    return;
                }
                res.send('Post liked').status(200);
            });
        }
    });
};

module.exports = {
    follow,
    like
};