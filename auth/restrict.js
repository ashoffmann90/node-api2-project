module.exports = (req, res, next) => {
    const {authorization} = req.headers
    const API_SHH = process.env.API_SHH
    if(authorization === API_SHH){
        next()
    } else {
        res.status(403).json({ uhh: "you can't sit with us"})
    }
}