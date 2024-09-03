const sharp = require('sharp');
const axios = require('axios');
const Image = require('../models/imageModel');
const mongoose=require("mongoose")

exports.processImages = async (requestId, rows) => {
  try {
    for (let row of rows) {
      const imageDoc = await Image.findOne({ serialNumber: row['S. No.'] });

      let outputUrls = [];
      for (let url of imageDoc.inputUrls) {
        try {
          const response = await axios({ url, responseType: 'arraybuffer' });
          const buffer = Buffer.from(response.data, 'binary');

          // Check the metadata of the image
          const metadata = await sharp(buffer).metadata();
          if (!metadata.width || !metadata.height) {
            throw new Error(`Invalid image dimensions for URL: ${url}`);
          }

          // Resize the image to 50% of its original width
          const resizedBuffer = await sharp(buffer)
            .resize({ width: Math.floor(metadata.width * 0.5) })
            .toBuffer();

          const outputPath = `output/${new mongoose.Types.ObjectId()}.jpg`;
          await sharp(resizedBuffer).toFile(outputPath);

          outputUrls.push(outputPath);

        } catch (imageProcessingError) {
          console.error(`Error processing image from URL: ${url}`, imageProcessingError);
          // Optionally, you can skip this image or continue processing other images
          continue;
        }
      }

      imageDoc.outputUrls = outputUrls;
      imageDoc.status = 'completed';
      await imageDoc.save();
    }

    const webhookUrl = process.env.WEBHOOK_URL;
    if (webhookUrl) {
      await axios.post(webhookUrl, {
        requestId,
        status: 'completed',
      });
      console.log(`Webhook triggered successfully for Request ID: ${requestId}`);
    } else {
      console.log(`No webhook URL provided for Request ID: ${requestId}`);
    }

  } catch (error) {
    console.error(`Error processing images for Request ID: ${requestId}`, error);
    await Image.updateMany({ _id: requestId }, { status: 'error' });
  }
};


// exports.processImages = async (requestId, rows) => {
//   try {
//     for (let row of rows) {
//       const imageDoc = await Image.findOne({ serialNumber: row['S. No.'] });
//       console.log(imageDoc);
      

//       let outputUrls = [];
//       for (let url of imageDoc.inputUrls) {
//         const response = await axios({ url, responseType: 'arraybuffer' });
//         console.log(response);
        
//         const buffer = Buffer.from(response.data, 'binary');
//         console.log(buffer.width);
        

//         const compressedBuffer = await sharp(buffer)
//           .resize({ width: Math.floor(buffer.width * 0.5) })
//           .toBuffer();

//         const outputPath = `output/${new mongoose.Types.ObjectId()}.jpg`;
//         await sharp(compressedBuffer).toFile(outputPath);

//         outputUrls.push(outputPath);
//       }

//       imageDoc.outputUrls = outputUrls;
//       imageDoc.status = 'completed';
//       await imageDoc.save();
//     }

//     // Trigger webhook after all images are processed
//     // const webhookUrl = process.env.WEBHOOK_URL;
//     // if (webhookUrl) {
//     //   await axios.post(webhookUrl, {
//     //     requestId,
//     //     status: 'completed',
//     //   });
//     //   console.log(`Webhook triggered successfully for Request ID: ${requestId}`);
//     // } else {
//     //   console.log(`No webhook URL provided for Request ID: ${requestId}`);
//     // }

//   } catch (error) {
//     console.error(`Error processing images for Request ID: ${requestId}`, error);
//     // Optionally, update the status in the database to reflect the error
//     await Image.updateMany({ _id: requestId }, { status: 'error' });
//   }
// };
