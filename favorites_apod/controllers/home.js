module.exports = function(app){

    var apod = app.models.apod;

    var HomeController = {
        index: function(req, res){
            res.render('home/index');
        },
        rate: function(req, res){
            apod.create(req.body, function(error, apod){
                if(error){
                    res.send("error :"+ error +" \n\n\n req body: "+ req.body);
                }
                else{
                    res.send("sucesso: "+ apod);
                }
            });
        }
    };
    return HomeController;
};