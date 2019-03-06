const app = require('express')();
const getDowndloadURL = require('./github-filefetcher');
const config = require('./config');
const constants = require('./constants');

app.get('/', async function(req,res){
    let url = await getDowndloadURL(req.query.control);

    if(url){
        res.status(constants.SUCESSFUL).send(url)
    } else {
        res.status(constants.NOT_FOUND).send({
            error: constants.ERROR_MESSAGE
        })
    }
})

app.listen(config.port, () => {
    console.log(constants.PORT_INFO,config.port)
  });