var express = require('express');
var multer = require('multer');
var fs = require('fs');
var uuid = require('uuid');
var PDFDocument = require('pdf-lib');
var path = require('path');

var router = express.Router();
const upload = multer({ dest: 'uploads/' });


router.get('/', (req , res) =>{
  res.render('index',{title:"Express"})
})

router.post('/upload', upload.single('pdfFile'), async (req, res) => {
  if (req.file) {
    const originalFilename = req.file.originalname; // Get original filename
    const uploadedFilePath = req.file.path; // Path to uploaded file

    try {
      // Read the uploaded file using appropriate method (e.g., fs)
      const fileBuffer = await fs.promises.readFile(uploadedFilePath);

      // Check if the file needs conversion (not already PDF)
      const isPDF = originalFilename.toLowerCase().endsWith('.pdf');
      if (!isPDF) {
        // Perform conversion using pdf-lib (adjust based on your needs)
        const newPdf = await PDFDocument.create();
        const pages = await newPdf.addPage(fileBuffer); // Add content to PDF
        const convertedPdfBuffer = await newPdf.save();

        // Generate a unique filename with .pdf extension
        const newFilename = `${uuid.v4()}.pdf`;
        const convertedFilePath = path.join(__dirname, 'uploads', newFilename);

        // Save the converted PDF file
        await fs.promises.writeFile(convertedFilePath, convertedPdfBuffer);

        res.json({ message: 'File converted and uploaded successfully!', filename: newFilename });
      } else {
        // File is already a PDF, send it as it is
        const newFilename = `${uuid.v4()}.pdf`;
        const savePath = path.join(__dirname, '../Saveuploads', newFilename);
      
       // console.log(req.file.path + "   " + savePath);
        // Move the uploaded file to the desired location
        await fs.promises.rename(req.file.path, savePath);
        res.json({ message: 'File uploaded successfully!', filename: originalFilename });
      }
    } catch (error) {
      console.error('Error during upload or conversion:', error);
      res.status(500).json({ message: 'Error uploading file' });
    } finally {
      // Clean up temporary files (optional)
      //await fs.promises.unlink(uploadedFilePath); // Remove uploaded file
    }
  } else {
    console.error('Error uploading file');
    res.status(500).json({ message: 'Error uploading file' });
  }
});

module.exports = router;
