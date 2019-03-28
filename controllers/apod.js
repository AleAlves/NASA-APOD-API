module.exports = (app) => {

    const axios = require('axios');

    return APODController = {

        apod: function (req, res) {

            axios.get('https://api.nasa.gov/planetary/apod?api_key='+ nasa_api_key)
                .then(response => {
                    console.log("\nAPOD Data: \n"+JSON.stringify(response.data));
                    var response = {
                        apod: response.data,
                        status: HTTP_STATUS.SUCESS.OK
                    };
                    sendAPOD(res, response);
                })
                .catch(error => {
                    console.log(error);
                    var response = {
                        apod: response.data,
                        message: error,
                        status: HTTP_STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR
                    };
                    sendAPOD(res, response);
                });

                function sendAPOD(res, response){
                    res.send(response);
                }
        }
    }
}