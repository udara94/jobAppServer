//validation
const Joi = require('@hapi/joi');


//Register validation
const registerValidation = data =>{
    const schema = Joi.object({
        mobile: Joi.string()
                .min(10)
                .required(),
    });
    return schema.validate(data);
};

//login validation
const loginValidation = data =>{
        const schema = Joi.object({
            email: Joi.string()
                    .min(6)
                    .required()
                    .email(),
            password: Joi.string()
                    .min(6)
                    .required()
        
        });
        return schema.validate(data);
    };

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;