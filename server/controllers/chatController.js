const db = require('../utils/db');

const getChat = async (req, res) => {
    const recipient = req.params.recipient;
    const userId = req.userId;
    const sql = `SELECT 
        directmessage.content,
        sender.username AS "from",
        recipient.username AS "to",
        time,
        is_read
    FROM 
        directmessage
    JOIN 
        user AS sender ON directmessage.from_id = sender.id
    JOIN 
        user AS recipient ON directmessage.to_id = recipient.id
    WHERE 
        (directmessage.from_id = (SELECT id FROM user WHERE username = ?) AND directmessage.to_id = ?)
        OR 
        (directmessage.from_id = ? AND directmessage.to_id = (SELECT id FROM user WHERE username = ?));`;
    db.query(sql, [recipient, userId, userId, recipient], (err, result) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log(result);
        res.json(result);
    });
};

module.exports = {
    getChat
}