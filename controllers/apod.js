module.exports = (app) => {

    return APODController = {

        apod: function (req, res) {

            const axios = require('axios');

            axios.get('https://api.nasa.gov/planetary/apod?api_key='+ nasa_api_key)
                .then(response => {
                    console.log(JSON.stringify(response.data));
                    console.log(response.data.explanation);
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