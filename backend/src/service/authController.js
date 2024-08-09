const { sendAuthEmail } = require('./emailSend');
const { verifyAuthCode } = require('./emailAuth');

exports.sendAuthEmail = async (req, res) => {
    try {
        await sendAuthEmail(req, res);
    } catch (error) {
        res.status(500).json({ ok: false, msg: '서버 오류', error: err.message});
    }
};

exports.verifyAuthCode = (req, res) => {
    try {
        verifyAuthCode(req, res);
    } catch (error) {
        res.status(500).json({ ok: false, msg: '서버 오류' });
    }
};
