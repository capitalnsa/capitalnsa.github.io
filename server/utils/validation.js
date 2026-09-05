const { body, validationResult } = require('express-validator');

// Skema validasi untuk registrasi dan login.
const authValidationRules = () => {
    return [
        body('phone').trim().notEmpty().withMessage('Nomor ponsel wajib diisi').isNumeric().withMessage('Nomor ponsel harus berupa angka'),
        body('password').trim().notEmpty().withMessage('Kata sandi wajib diisi').isLength({ min: 8 }).withMessage('Kata sandi minimal 8 karakter')
    ];
};

// Skema validasi untuk transaksi (top up/withdraw).
const transactionValidationRules = () => {
    return [
        body('amount').trim().notEmpty().withMessage('Nominal wajib diisi').isNumeric().withMessage('Nominal harus berupa angka').isFloat({ min: 10000 }).withMessage('Nominal minimal Rp 10.000')
    ];
};

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

    return res.status(422).json({
        errors: extractedErrors
    });
};

module.exports = {
    authValidationRules,
    transactionValidationRules,
    validate
};
