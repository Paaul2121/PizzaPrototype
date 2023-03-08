const {writeFile} = require("fs/promises");

const fileWriterAsync = async(filePath, content) =>{
    try{
        await writeFile(filePath, content);
    }catch(error){
        console.error(error)
    }
}

module.exports = fileWriterAsync;