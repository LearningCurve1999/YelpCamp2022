// const Joi = require('joi');
// const { number } = require('joi');
const BaseJoi = require('joi');

//Require sanitize html npm package
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
//escapeHTML will validate the value whatever it receives inside the open and close parenthesis
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [], //Nothing is allowed
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        // image: Joi.string().required(),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML()
    }).required(),
    deleteImages: Joi.array()
});// Validation purposes


module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML()
    }).required()
});
// Validation for each schema that needs to have, 
// for example review should have rating and a review. any of the following
// are missing return a corresponding error. with "review should have rating/reviews"