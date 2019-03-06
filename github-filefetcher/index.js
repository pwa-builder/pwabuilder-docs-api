const fetchService = require("./fetchService");
const fs = require("fs");
const config = require('../config');
const constants = require('../constants');
const fetch = require("fetch");
const download = require("download");
const { StringDecoder } = require('string_decoder');
const FetchStream = fetch.FetchStream;


module.exports = async (snippet) => {
    if(!fs.existsSync(config.repositoryIndexPath)){ 
        const downloadUrl = await fetchService(`${config.baseGitHubUrl}/${config.ownerGitHubUrl}/${config.repoGitHubUrl}/${config.endpointGithubUrl}/${config.snippetsURL}`);
        await downloadFile(downloadUrl, config.repositoryIndexPath);
    }
    const filesList = await readIndex(config.repositoryIndexPath);
    if (!filesList[snippet]) {
        return false;
    }
        let pathlist = [];
        
        pathlist.push(filesList[snippet].docs);
        
        const results = await Promise.all(pathlist.concat(filesList[snippet].snippets)
                                        .map((path) => {
                                            const promise = fetchService(`${config.baseGitHubUrl}/${config.ownerGitHubUrl}/${config.repoGitHubUrl}/${config.endpointGithubUrl}/${path}?ref=add/snippits-index`);
                                            
                                            if(path.includes(constants.DOCS)){
                                                return promise.then((downloadUrl) => downloadHTMLFromURL(downloadUrl));    
                                            }

                                            return promise;
                                        }));

        return results.reduce((previous, current) => {
            if(!current.includes(config.repoGitHubUrl)){
                previous.docs = current;
            }
            else {
                previous.snippets.push(current);    
            }
            return previous;
        }, {
            docs: "",
            snippets: []
        });
}

const downloadHTMLFromURL = (downloadURL) => {
    return download(downloadURL).then((buffer) => {
                let decoder = new StringDecoder('utf8');
                return decoder.write(buffer);
            });
    }

const readIndex = (path) => {
    const promise = new Promise((resolve, reject) => {
            fs.readFile(path, "utf-8", (err, contents) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            const file_list = JSON.parse(contents);
            resolve(file_list);
        })
    })
    return promise;
}

async function downloadFile(url, dest) {  
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        const fetchStream =  new FetchStream(url);
        fetchStream.pipe(file);

        file.on("finish", () => resolve());

        file.on("error", err => {
            file.close();

            if (err.code === "EEXIST") {
                reject("File already exists");
            } else {
                fs.unlink(dest, () => {}); // Delete temp file
                reject(err.message);
            }
        });
    });
}