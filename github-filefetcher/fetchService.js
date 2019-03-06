const fetch = require("fetch");

module.exports = (url, options) => {
    return new Promise((resolve, reject) => {
        fetch.fetchUrl(url, options, (error, meta, body) => {
           if(error || !body){
                reject(error || meta.status);
           }
           let fileJson = JSON.parse(body.toString());
           resolve(fileJson.download_url);
        });
    })
    
};