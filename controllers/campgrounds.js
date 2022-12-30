const Campground = require('../models/campground');
//Mapbox requirements method
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');


module.exports.index = async (req, res) => {
    //pass 'isLoggedin' as middleware in every request so you dont have to manually
    //write the logic in every route.
        const campgrounds = await Campground.find({});
        res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
        res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res) => {
//This will search for a place, based on request location for forwarding.
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
//Limit the searches to 1 only.
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
//geoCoding the form and and pick a first end point which is the point location.
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
//Map over the array that is been added to cloudinary or being logging to the terminal.
    campground.author = req.user._id;
//this will save a request, thats coming from the user schema.
    await campground.save();
    console.log(campground);
//save a particular instance of campgrounds
    req.flash('success', 'Added Campgrounds');
    res.redirect(`/campgrounds/${campground._id}`)
}


module.exports.showCampground = async (req, res,) => {
    const campground = await Campground.findById(req.params.id).populate({
//Populate the value from object ID called author and reviews
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
//if you dint find a campground or the ID of the campground is not exist throw
//an error or flash and redirext to main campgrounds.
        req.flash('error', 'Campgrounds Not Found');
        //flash error template
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'Not a Campgrounds');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}


module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
//Map to a new array.
    campground.images.push(...imgs);
//Spread the images from cloudinary 
    await campground.save();
//Save to the database
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Campgrounds Updated');
    res.redirect(`/campgrounds/${campground._id}`)
}


module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campgrounds Deleted')
    res.redirect('/campgrounds');
}


