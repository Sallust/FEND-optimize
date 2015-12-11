'use strict';

var gulp = require('gulp');

var ngrok = require('ngrok');
var psi = require('psi');
var sequence = require('run-sequence');
var imageResize = require('gulp-image-resize');
var rename = require('gulp-rename');
var gm = require('gulp-gm');
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
  	//console.log(data.pageStats);

  	//cb();
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
/*
gulp.task('resize', function () {
  gulp.src('test.png')
    .pipe(imageResize({
      width : 100
    }))
    .pipe(gulp.dest('dist'));
});
*/
gulp.task('resize', function () {
  gulp.src('views/images/pizzeria.jpg')
    .pipe(imageResize({ width : 500 }))
    .pipe(rename(function (path) { path.basename += '-100'; }))
    .pipe(gulp.dest('dist'));
});

gulp.task('resize-test', function() {
	gulp.src('views/images/pizzeria.jpg')
    .pipe(imageResize({
    	width : 500,
    	imageMagick : true
    	 }))
  	.pipe(gulp.dest("dist")); // ./dist/main/text/ciao/goodbye.md
})
