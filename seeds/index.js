const mongoose = require('mongoose');
const cities = require('./cities');
const Campground = require('../models/campground');
const { places, descriptors } = require('./seedHelpers');

if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'))

// main().catch(err => {
//     console.log('Connection Error')
//     console.log(err)
// });

// async function main() {
//     await mongoose.connect('mongodb://127.0.0.1:27017/Yelp-Camp');
//     console.log('Connection Established');
// }

const dbUrl = process.env.DB_ATLAS || 'mongodb://127.0.0.1:27017/Yelp-Camp';

main().catch(err => {
    console.log('Connection Error')
    console.log(err)
});

async function main() {
    await mongoose.connect(dbUrl,{  
        useNewUrlParser: true,
        // useCreateIndex: true,
        useUnifiedTopology: true
        // useFindAndModify: false
    });//Use some option to get rid of the deprecated error warnings 
    //printed in our console.
    console.log('Connection Established');
}


const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    //We Start Deleting everything in the model campgrounds
    for (let i = 0; i < 350; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 20;
        //then 50 times we pick a random number to get a city with 
        //the city name and state and set to LOCATION: string.
        const camp = new Campground({
            author: '637e502d3c5421c17d1badd5',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nobis ex omnis eaque praesentium cum itaque dolore. Eaque id at voluptatum laudantium quia ducimus, officia eos voluptas vel quos, molestias deserunt.Illo facilis assumenda ipsam quam ad minima voluptates fugiat asperiores libero esse ratione soluta quo, incidunt perspiciatis ea doloribus? Itaque facere laudantium beatae quis aspernatur reiciendis hic sit consectetur assumenda',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                cities[random1000].longitude,
                cities[random1000].latitude,
            ] //Clustermaps data to display exact location or nearby countries 
            //within the location.
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dwuj4wyfn/image/upload/v1668793638/YelpCampGrounds/sqfqwmaexit6gqb2thqj.jpg',
                    filename: 'YelpCampGrounds/sqfqwmaexit6gqb2thqj'
                }, 
    
                {
                    url:'https://res.cloudinary.com/dwuj4wyfn/image/upload/v1668793638/YelpCampGrounds/sv7degxofd3ych78dewb.jpg',
                    filename:'YelpCampGrounds/sv7degxofd3ych78dewb'
                }
             ],
//Loop the image that stored in cloudinary and include the URL and filename.
           
            // and then we pick a random descriptor in a random place for our title 
        })
        await camp.save();
        //and then we save
    }
}

seedDB().then(() => {
    mongoose.connection.close()
    //Connect and then close the mongoose.
})

