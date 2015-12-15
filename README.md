## Website Performance Optimization portfolio project

The files to be measured for speed are in 'dist' folder
To see non-minified version of index.html refer to files in root folder

Navigate to dist folder and open index.html
From there, follow links to pizza.html and move slider and scroll to see results

Part 1: Page Speed Insights & CRP optimization
-used gulp & gulp plug ins to acheive 99 score on desktop and mobile
-ngrok & psi: command line access to changes in PSI score
-gulp-image-resize: resized large images using imageMagick
-gulp-imagemin: lossless compression of images
-gulp-uglify, minifyCSS: minification of JS & CSS
-gulp-inline: replaced links with inlined files
-gulp-htmlmin: minify html file
-gulp-task 'optimize-stack': included above 3 plug-ins

-removed call to google-fonts
-used IIS to set up a cache protocol
-used IIS to utilize compression protocol on ALL files starting at 0 bytes
-saved images to reduce call to another server for images
-used async tags on javascript
-removed javascript into new file with async tag
-used media print attribute on print.css

Part 2:Browser Rendering: Slider & Scrolling
A: Slider
	-changed sizeSwicher & changePizzaSizes functions
	-first takes size and returns 25, 33.3 or 50
	-the second takes that number before "%" as the new width
	-time to resize pizzas reduced to around 0.45ms on this machine
B.Scrolling
	-fixed Forced Synchronous layout by removing call to scrollTop within for loop
	-achieved movement using "transform" vs "left"
	-used will-change: transform
	-this resulted in less need for layout and paint
	-moved call to updatePositions out of scroll listener
	-used request animationFrame trigged by scroll event
	-reduced number of pizzas being generated to 10 rows
	-average time to generate frames reduced to around 0.4ms on this machine

References not directly from course:
https://travismaynard.com/writing/getting-started-with-gulp
http://yeoman.io/blog/performance-optimization.html
http://www.html5rocks.com/en/tutorials/speed/parallax/



