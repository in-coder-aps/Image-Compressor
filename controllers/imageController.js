const Image = require('../models/imageModel');
const { processImages } = require('../services/imageService');
const mongoose=require("mongoose")
const fs=require('fs')
const csv=require('csv-parser');
const { log } = require('console');

exports.uploadCSV = async (req, res) => {
  const results = [];
  const file = req.file;
  const requestId = new mongoose.Types.ObjectId();

  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  // Parse CSV file and save to database
  fs.createReadStream(file.path)
    .pipe(csv())
    .on('data', (row) => {
      console.log('Row data:', row);  // Log the row data for debugging
      results.push(row);
    })
    .on('end', async () => {
      for (let row of results) {
        console.log(row['Product Name']);
        
        if (!row['Input Image Urls']) {
          console.error('Input Image Urls column is missing or empty in the row:', row);
          continue; // Skip this row if the column is missing or empty
        }

        const image = new Image({
          serialNumber: row['S. No.'],
          productName: row['Product Name'],
          inputUrls: row['Input Image Urls'].split(','),
          status: 'processing',
          requestId:requestId
        });
        await image.save();
      }
      console.log('Log: ',requestId);
      res.status(200).json({ requestId });
      processImages(requestId, results);
    });
};

// exports.uploadCSV = async (req, res) => {
//   const results = [];
//   const file = req.file;
//   const requestId = new mongoose.Types.ObjectId();

//   if (!file) {
//     return res.status(400).send('No file uploaded.');
//   }

//   // Parse CSV file and save to database
//   fs.createReadStream(file.path)
//     .pipe(csv())
//     .on('data', (row) => results.push(row))
//     .on('end', async () => {
//       for (let row of results) {
//         console.log(row['S. No.'],row['Product Name']);
        
//         const image = new Image({
//           serialNumber: row['S. No.'],
//           productName: row['Product Name'],
//           inputUrls: row['Input Image Urls'].split(','),
//           status: 'processing',
//         });
//         await image.save();
//       }

//       res.status(200).json({ requestId });
//       processImages(requestId, results);
//     });
// };

exports.checkStatus = async (req, res) => {
  const { requestId } = req.params;
  const images = await Image.find({ requestId });
  console.log(images);
  

  if (!images) {
    return res.status(404).send('Request ID not found.');
  }

  res.status(200).json(images);
};
