import Joi from 'joi';

//AUTH
export const registerSchema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(30).required(),
    phone: Joi.string().min(11).max(12).required()
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(30).required()
});

// CATEGORY VALIDATION
export const categorySchema = Joi.object({
  name: Joi.string().min(3).required(),
  description: Joi.string().min(10).required(),
  photo: Joi.string().uri().optional().allow(""),
});



//PRODUCT VALIDATION
export const productSchema = Joi.object({
    image: Joi.string().optional(), // Add imgUrl to schema if it's part of the payload
    secondImage: Joi.string().optional(),
    name: Joi.string().min(5).required(),
    price: Joi.number().required(), // Consider Joi.number() for price if you do calculations
    tag: Joi.string().min(3).optional(),
    oldprice: Joi.number().optional(),
    description: Joi.string().min(15).required(),
    category: Joi.string().required(),
    
});
