var gulp = require('gulp'),
	rename = require('gulp-rename'),
	_ = require('lodash'),
	csv2json = require('gulp-csv2json'),
	runSequence = require('run-sequence'),
	download = require('gulp-download'),
	fs = require('fs');



gulp.task('default', function() {

	runSequence('convert');

});

gulp.task('convert', function() {

	return gulp.src('source/master.csv')
		.pipe(csv2json())
		.pipe(rename({extname: '.json'}))
		.pipe(gulp.dest('./json'));

});

function getGeo(iteratee) {

	var address = [iteratee['Street Address'], iteratee.City, iteratee.State, iteratee.Zip].join(' ');

	var encoded = encodeURIComponent(address).replace('%20', '+');

	var url = 'https://maps.googleapis.com/maps/api/geocode/json?address='+encoded;

	download(url)
		.pipe(rename('geo.json'))
		.pipe(gulp.dest('geo/'));


}