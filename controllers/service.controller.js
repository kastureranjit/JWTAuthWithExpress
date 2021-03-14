const logger = require("../config/logger");
const { generateJWT,invokeUrl,authenticateJWT } = require("../utilities/helpers");
const db = require("../utilities/db");
const jsonpatch = require('jsonpatch');
const fs = require('fs');
const fetch = require('node-fetch');
const sharp = require('sharp'); 

exports.jsonPatch = async (req, res) => {
    try {
        let patcheddoc = await jsonpatch.apply_patch(req.body.mydoc, req.body.thepatch);
        res.json({
          'new_json': patcheddoc
        });  
      } catch (error) {
        console.log("Errro is: ",error);
      }
}


exports.getThumbnail = async (req,res) => {
    try {
        const url = req.body.url;
        await download(url);
        await generateThumbnail();
        res.status(200).json({
            'message':`thumbnail created at http://localhost:${process.env.PORT}/getImage`
        })
    } catch (error) {
        console.log("error: ",error);
        res.status(500).json({
            error: error || 'internal server error'
        })
    }
}


exports.createAddress = async(req,res)=>{
    const result = await db.query(
      `INSERT INTO users 
      (address) 
      VALUES 
      (?)`, 
      [
        req.body.address
      ]
    );
  
    let message = 'Error in creating addresses';
  
    if (result.affectedRows) {
      message = 'address created';
    }
  
    res.status(200).json({
        'messgae':message  
    }); 
}

async function download(url) {
    return new Promise(async(resolve,reject)=>{
        try {
            const response = await fetch(url);
            const buffer = await response.buffer();
            fs.writeFile(`./assets/image.png`, buffer, () => 
            resolve(true)
            );
            
        } catch (error) { 
            reject(error);
           
        }
    });
    

}

async function generateThumbnail(){
    return new Promise(async(resolve,reject)=>{
        sharp(`./assets/image.png`).resize({ height:50, width:50}).toFile(`./assets/image_thumb.png`)
        .then(function(newFileInfo){
        console.log("Image Resized");
        resolve('Image resized');
        })
        .catch(function(err){
        console.log("Got Error: ",err);
        reject(err);
        });
    });
    
}


 