'use strict';

var gulp = require('gulp');

var ngrok = require('ngrok');
var psi = require('psi');
var sequence = require('run-sequence');
var imageResize = require('gulp-image-resize');
var rename = require('gulp-rename');
//var gm = require('gulp-gm');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

var inline = require('gulp-inline');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');

var htmlmin = require('gulp-htmlmin');

var del = require('del');

//var gzip = require('gulp-gzip'); //this did not do what I thought it did, lol
var site = '';

//create a task to run ngrok and grab the tunnel url it is creating
gulp.task('ngrok-url', function (cb) {
  return ngrok.connect(55, function (err, url) {
  	//console.log(err);
    site = url;
    console.log('serving your tunnel from: ' + site);
    cb();
  });
});

//PSI tasks for desktop & mobile
gulp.task('psi-desktop', function (cb) {
	console.log(site);
  	psi(site, {
    	nokey: 'true',
    	strategy: 'desktop'
  	}).then(function (data) {
  		console.log('Desktop speed score: ' + data.ruleGroups.SPEED.score);
  		//console.log(data.pageStats);
  		//cb();
  	});
  	cb();
});

gulp.task('psi-mobile', function (cb) {
  psi(site, {
    nokey: 'true',
    strategy: 'mobile'
  }).then(function(data){
  	console.log('Mobile speed score: ' + data.ruleGroups.SPEED.score);
  });
  cb();
});

//Run ngrok, get its url and run psi
gulp.task('psi-seq', function (cb) {
  return sequence(
    'ngrok-url',
    'psi-desktop',
    'psi-mobile',
    cb
  );
});

//exit once finished
gulp.task('psi', ['psi-seq'], function() {
  console.log('Woohoo! Check out your page speed scores!')
  setTimeout(function() {
  	process.exit();
  },10000)
  //process.exit();
})

//resize the overszied pizzeria image for use as thumbnail
gulp.task('resize', function () {
  gulp.src('views/images/pizzeria.jpg')
    .pipe(imageResize({
    	width : 100,
    	imageMagick : true
    	 }))
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'));
});

//compress images in img folder
gulp.task('imagemin', function () {
	gulp.src('img/*.jpg')
	.pipe(imagemin())
	.pipe(gulp.dest('dist/img'));
})

gulp.task('inline', function() {
	gulp.src('index.html')
	.pipe(inline({
		js: uglify,
		css:minifyCss,
		disabledTypes: ['svg','img'],
		ignore: ['css/print.css', 'js/perfmatters.js']
	}))
	.pipe(gulp.dest('dist'))
})

gulp.task('minify-html', function() {
	gulp.src('index.html')
	.pipe(htmlmin({
		collapseWhitespace: true,
		removeComments: true
	}))
	.pipe(gulp.dest('dist'));
})

//combines above to functions: inlines and then minifies the html
gulp.task('optimize-stack', function() {
	gulp.src('index.html')
	.pipe(inline({
		js: uglify,
		css:minifyCss,
		disabledTypes: ['svg','img'],
		ignore: ['css/print.css', 'js/perfmatters.js', 'js/analytics.js']
	}))
	.pipe(htmlmin({
		collapseWhitespace: true,
		removeComments: true
	}))
	//.pipe(gzip()) did not do what I thought it did, lol
	.pipe(gulp.dest('dist'));
})

gulp.task('clean', function(cb) {
	del(['dist/*'], cb);
})

gulp.task('watch', function() {
    gulp.watch('index.html', ['optimize-stack']);
});

//Move over performant pizza files
gulp.task('copy-views', function() {
	gulp.src('views/**')
		.pipe(gulp.dest('dist/views'));
})

gulp.task('big-pizza', function () {
  gulp.src('views/images/pizzeria.jpg')
    .pipe(imageResize({
    	width : 720,
    	imageMagick : true
    	 }))
    .pipe(imagemin())
    .pipe(gulp.dest('dist'));
});
