# SDE 1 Assignment Backend

## Overview

This project processes images from CSV files by compressing them and storing the output in a database. It provides APIs to upload CSV files, check processing status, and trigger webhooks.

## Setup

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Configure environment variables in a `.env` file.
4. Run `npm start` to start the server.

## API Endpoints

- `POST /api/images/upload`: Upload a CSV file for processing.
- `GET /api/images/status/:requestId`: Check the status of image processing.

## Tools & Technologies

- Node.js
- Express.js
- MongoDB
- Sharp (for image processing)
- Multer (for file uploads)

## How to Test

Use Postman or any other API client to test the endpoints.
