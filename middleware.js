module.exports.isLoggedIn = (req,res,next)=>{
    if (req.isAuthenticated()){
        next()
    }
    else{
        req.session.returnTo = req.originalUrl;
        req.flash('error','you have to login first')
        res.redirect('/login')
    }
}

module.exports.isAuthor = async(req,res,next)=>{
    console.log(id);
    const campground = await Campground.findById(id)
    if(!campground.author.equals(req.user._id)){
        req.flash('error','You dont have permission for this')
        return res.redirect('/campgrounds')
    }
    next()
}