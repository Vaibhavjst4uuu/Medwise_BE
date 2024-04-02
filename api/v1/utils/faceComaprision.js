const { Canvas, Image, loadImage } = require('canvas');
const faceapi = require('face-api.js');
const fs = require('fs');

// Monkey patching environment for face-api.js
faceapi.env.monkeyPatch({ Canvas, Image, loadImage });

// Load face detection models
Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromDisk('./public/models'),
  faceapi.nets.faceLandmark68Net.loadFromDisk('./public/models'),
  faceapi.nets.faceRecognitionNet.loadFromDisk('./public/models'),
]).then(start);

async function start() {
  // Function to calculate Euclidean distance between two face descriptors
  // async function calculateEuclideanDistance(imagePath1, imagePath2) {
  //   // Load images
  //   const img1 = await loadImage(imagePath1);
  //   const img2 = await loadImage(imagePath2);

  //   // Detect faces and compute descriptors
  //   const detections1 = await faceapi.detectAllFaces(img1).withFaceLandmarks().withFaceDescriptors();
  //   const descriptors1 = detections1.map(detection => detection.descriptor);

  //   const detections2 = await faceapi.detectAllFaces(img2).withFaceLandmarks().withFaceDescriptors();
  //   const descriptors2 = detections2.map(detection => detection.descriptor);

  //   // Check if descriptors arrays are empty
  //   if (descriptors1.length === 0 || descriptors2.length === 0) {
  //     throw new Error('No faces detected in one or both images');
  //   }

  //   // Calculate Euclidean distance between the first descriptor of each image
  //   const distance = faceapi.utils.round(faceapi.euclideanDistance(descriptors1[0], descriptors2[0]));

  //   return distance;
  // }

  async function calculateEuclideanDistance(imagePath1, imagePath2) {
    // Load images
    const img1Promise = loadImage(imagePath1);
    const img2Promise = loadImage(imagePath2);
  
    // Wait for both images to load
    const [img1, img2] = await Promise.all([img1Promise, img2Promise]);
  
    // Detect faces and compute descriptors for both images concurrently
    const [detections1, detections2] = await Promise.all([
      faceapi.detectSingleFace(img1).withFaceLandmarks().withFaceDescriptor(),
      faceapi.detectSingleFace(img2).withFaceLandmarks().withFaceDescriptor()
    ]);
  
    // Check if descriptors are found
    if (!detections1 || !detections2) {
      throw new Error('No faces detected in one or both images');
    }
  
    // Calculate Euclidean distance between the descriptors
    const distance = faceapi.utils.round(faceapi.euclideanDistance(detections1.descriptor, detections2.descriptor));
  
    return distance;
  }
  

  // Export the function for use in other files
  module.exports = {

    calculateEuclideanDistance
  };
}

start(); // Start loading models
