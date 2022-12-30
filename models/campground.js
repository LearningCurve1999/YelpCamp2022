const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')


const ImageSchema = new Schema({
    url: String,
    filename: String
});



ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
//This type of schema will enchanced the picture 200 pixel wide 
//Everytime you add a picture, the thumbnail along with this virtual schema.
});



//Just like the stringify that JSON have, we set the virtuals to work in this end to true.
const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId, ref: 'Review'
    }]
    
    //This will insert the reviewSchema from review.js, and 
    //treat this as an ObjectID, this is useful when you have more than
    //one review on each campgrounds database.

},opts);
//pass into this schema types.


//Actual popup properties that have in clusterMap
CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
//Every Uncluster popUp, will contain the campgrounds title
//and its description but limit only to 0-20 characters when clicking the Uncluster Campgrounds.
});


CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) { 
        //(doc)defines the object of the campgroundSchema and its value,
        //inside the object theres an ObjectId from reviews that has a property existing to campGround
        //if we dont use this middleware and just rely on our delete method on main file, the reviews area will be left.
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
            // this documents has reviews and were going to basically delete
            //all reviews where ID field is in our document that was deleted
            //in its array
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);