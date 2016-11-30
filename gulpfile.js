var gulp = require('gulp'),
	rename = require('gulp-rename'),
	_ = require('lodash'),
	csv2json = require('gulp-csv2json'),
	runSequence = require('run-sequence'),
	download = require('gulp-download'),
	clean = require('gulp-clean'),
	fs = require('fs'),
	convert = require('gulp-convert');


gulp.task('default', function() {

	runSequence('convert');

});

gulp.task('convert', function() {

	return gulp.src('source/master.csv')
		.pipe(csv2json())
		.pipe(rename({extname: '.json'}))
		.pipe(gulp.dest('./json'));

});

gulp.task('get-info', function() {

	var converted = require('./json/master.json');

	var updated = _.map(converted, getInfo);

	fs.writeFileSync('json/master.json', JSON.stringify(updated));

});

gulp.task('delete-geo', function() {

	return gulp.src('geo/*.json')
			.pipe(clean({force: true}));

});


gulp.task('create-csv', function() {

	runSequence('clean-data', 'back-to-csv');

});

gulp.task('clean-data', function() {

	var cleanedUp = _.map(require('./json/master.json'), cleanData);

	fs.writeFileSync('json/cleaned.json', JSON.stringify(cleanedUp));

});

gulp.task('back-to-csv', function() {

	return gulp.src('json/cleaned.json')
			.pipe(convert({
				from: 'json',
				to: 'csv'
			}))
			.pipe(gulp.dest('complete'));

});

function cleanData(iteratee) {

	delete iteratee.Geodata;
	delete iteratee.randomString;

	return iteratee;

}

function getInfo(iteratee) {

	var allSet = false;

	if(!iteratee.randomString || !iteratee.randomString.length) {
		iteratee.randomString = randomString(12);
	} else {

		if(!iteratee.Geodata) {
			iteratee.Geodata = getGeo(iteratee);
		} else {

			if(!iteratee.County || !iteratee.County.length) {

				iteratee.County = getCounty(iteratee.Geodata);

			} else {

				// if(!iteratee['Who\'s contacting?'] || !iteratee['Who\'s contacting?'].length) {
				// 	iteratee['Who\'s contacting?'] = getContact(geodata);
				// } else {
					allSet = true;
					console.log('All set!');

				// }

			}

		}

	}

	if(!allSet)
		console.log('Run it again!');

	return iteratee;

}

function getCounty(geodata) {

	var components = geodata.results[0].address_components;

	for(var a in components) {

		if(components[a].types.indexOf('administrative_area_level_2') > -1)
			return components[a].long_name.replace(' County','');

	}

	return '';

}

function getGeo(user) {

	var address = [user['Street Address'], user.City, user.State, user.Zip].join(' ');

	var encoded = encodeURIComponent(address).replace('%20', '+');

	var url = 'https://maps.googleapis.com/maps/api/geocode/json?address='+encoded;

	var unique = user.randomString;

	file = './geo/'+unique+'.json';

	if(fs.existsSync(file)) {
		required = require(file);
		if(required.error_message){
			download(url)
				.pipe(rename(unique+'.json'))
				.pipe(gulp.dest('geo/'));
			return '';
		}

		return required;
	} else {
		download(url)
			.pipe(rename(unique+'.json'))
			.pipe(gulp.dest('geo/'));
		return '';
	}

}

function randomString(length) {

	var alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];

	var string = _.times(length, function() {
		letter = alphabet[_.random(0,25)];
		if(_.random(0,1))
			letter = letter.toUpperCase();

		return letter;
	}).join('');

	return string;

}