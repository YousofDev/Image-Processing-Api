### Image Processing Project Overview
- Server will listen on port 5000 => http://localhost:5000/
- Original Images inside => assets/original
- Resized Images will be saved in => assets/resized
- image processing function will create the resized folder if not exist
- image processing function will return the image if already in resized folder
- image processing function will save the image with multiple sizes
- Before and After Tests the resized folder will be removed

### Scripts
- Install: 'npm install'
- Dev: 'npm run dev'
- Build: 'npm run build' 
- Start: 'npm run start'
- Tests: 'npm run test'
- Lint: 'npm run lint'
- Fix: 'npm run fix'
- Format: 'npm run format'

#### Main Endpoint for resizing an image: 
Required: filename, Optional: height, width
http://localhost:5000/api/images?filename=coffin&width=500&height=500

### Handled Errors:

### 1) - Missing Filename:
# Avoid:
http://localhost:5000/api/images

#Expected:
at least shoud provide a filename:

### 2) - Filename not exists:
# Avoid:
http://localhost:5000/api/images?filename=map

#Expected:
available filenames: coffin - carol - luxor - museum - palace

### 3) - Non Numeric-Positive Value:
# Avoid:
http://localhost:5000/api/images?filename=coffin&width=-400&height=big

#Expected:
height and width shoud be a positive numeric 

### 4) - Providing One of those => Height or Width:
# Avoid:
http://localhost:5000/api/images?filename=coffin&width=200

#Expected:
both Height and Width should be provided together