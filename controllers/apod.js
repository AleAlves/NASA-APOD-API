module.exports = (app) => {

    var rate = app.models.rate;
    const jsonWebToken = require('jwt-simple');
    const axios = require('axios');

    return APODController = {

        apod: function (req, res) {

            console.log("\n * Date: "+req.body.date);

            axios.get('https://api.nasa.gov/planetary/apod?api_key='+ nasa_api_key+"&date="+req.body.date)
                .then(response => {
                    console.log("\nAPOD Data: \n"+JSON.stringify(response.data));
                    let params = {
                        apod: response.data,
                        status: HTTP_STATUS.SUCESS.OK
                    };
                
                    sendAPOD(res, params);
                })
                .catch(error => {
                    console.log("\nError: "+error);
                    let response = {
                        status: HTTP_STATUS.BUSINESS.UNAVAILABLE_APOD
                    };
                    sendAPOD(res, response);
                });

                function sendAPOD(res, response){
                    res.send(response);
                }
        }
    }
}