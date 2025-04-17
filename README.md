# App_Dev

Steps to make it:
- npx create-react-app pdf-labeling-app
- cd pdf-labeling-app
- npm install react-pdf

Follow this dir structure:
image-labeling-app/
│── public/
│   ├── images/  (Store images here)
│   ├── labels.txt (This will store labels)
│── src/
│   ├── components/
│   │   ├── ImageLabeler.js
│   │   ├── ImageList.js
│   ├── App.js
│   ├── index.js
│── package.json


Google Drive:
    - have a public folder with all of the files inside
    - copy the id from each pdf
    - modify it like this:
    you get this
    https://drive.google.com/file/d/FILE_ID/view?usp=sharing
    and convert it to this
    https://drive.google.com/uc?id=FILE_ID
    - save all of the filenames and urls to pdfs.json



CORS policy:
    use your own server:
    create a directory for it, navigate to it, type:
    git clone https://github.com/Rob--W/cors-anywhere.git
    cd cors-anywhere
    then do
    npm install
    and to run it do
    node server.js





Deploy:

Install Vercel:
npm install -g vercel
Deploy:
vercel
