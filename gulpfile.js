
'use strict';
const gulp           	 = require('gulp'),
			sass           	 = require('gulp-sass')(require('sass')),
			nunjucksRender 	 = require('gulp-nunjucks-render'),
			plumber        	 = require('gulp-plumber'),
			postcss        	 = require('gulp-postcss'),
			cssnano        	 = require('gulp-cssnano'),
			mqpacker       	 = require('css-mqpacker'),
			sortCSSmq 			 = require('sort-css-media-queries'),
			autoprefixer   	 = require('autoprefixer'),
			sourcemaps     	 = require('gulp-sourcemaps'),
			imagemin     		 = require('gulp-imagemin'),
			browserSync    	 = require('browser-sync'),
			concat         	 = require('gulp-concat'),
			babel          	 = require('gulp-babel'),
			uglify         	 = require('gulp-uglify'),
			rename         	 = require('gulp-rename'),
			del            	 = require('del');

const html = done => {
		const htmlSrc = [
			'./src/html/**/*.{html, njk}',
			'!src/html/**/_*.{html, njk}'
		];
		gulp.src(htmlSrc)
		.pipe(plumber())
		.pipe(nunjucksRender({
			path: './src/html'
		}))
		.pipe(gulp.dest('./build'))
		.pipe(browserSync.stream());
	done();
};

const fonts = done => {
	gulp.src('./src/fonts/**/*')
		.pipe(plumber())
		.pipe(gulp.dest('./build/fonts'))
		.pipe(browserSync.stream());
	done();
};

const commonJs = done => {
	const commonJsSrc = './src/js/common.js';
	gulp.src(commonJsSrc)
	.pipe(plumber())
	.pipe(gulp.dest('./build/js'))
	.pipe(browserSync.stream());
	gulp.src(commonJsSrc)
		.pipe(plumber())
		.pipe(babel({
			presets: ['@babel/env']
		}))
	.pipe(rename({suffix: '.babel'}))
	.pipe(gulp.dest('./build/js'));
	done();
};

const scripts = done => {
	const jsFiles = [
		'./src/scripts/swiper-bundle.min.js',
	];
	gulp.src(jsFiles)
	.pipe(plumber())
	.pipe(concat('scripts.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('./build/js'))
	.pipe(browserSync.stream());
	done();
};

const styles = done => {
	gulp.src('./src/styles/styles.scss')
	.pipe(plumber())
	.pipe(sass({
		outputStyle: 'compressed'
	}))
	.pipe(postcss([
		autoprefixer(),
		mqpacker({
			sort: sortCSSmq
		}),
	]))
	.pipe(cssnano())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('./build/css'))
	.pipe(browserSync.stream());
	done();
};

const scss = done => {
	gulp.src('./src/scss/**/*.scss')
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(sass())
	.pipe(postcss([
		autoprefixer(),
		mqpacker({
			sort: sortCSSmq
		}),
	]))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('./build/css'))
	.pipe(browserSync.stream());
	done();
};

const images = done => {
	const imagesSrc = [
		'./src/img/**/*'
	];
	const imageMinSrc = [
		'./src/img/**/*.{jpg,png,svg}',
	];

	gulp.src(imagesSrc)
	.pipe(plumber())
	.pipe(gulp.dest('./build/img'));

	gulp.src(imageMinSrc)
	.pipe(plumber())
	.pipe(imagemin([
		imagemin.gifsicle({
			interlaced: true
		}),
    imagemin.mozjpeg({
			quality: 80,
			progressive: true
		}),
    imagemin.optipng({
			optimizationLevel: 5
		}),
  ]))
	.pipe(gulp.dest('./build/img'));
	done();
};

const watching = () => {
	browserSync.init({
		server: {
				baseDir: './build'
		},
		notify: false,
		open: false,
		port: 3000
	});

	gulp.watch('./src/fonts/**/*', fonts);
	gulp.watch('./src/styles/**/*.{scss,css}', styles);
	gulp.watch('./src/scss/**/*.scss', scss);
	gulp.watch('./src/scripts/**/*.js', scripts);
	gulp.watch('./src/js/common.js', commonJs);
	gulp.watch('./src/img/**/*', images).on('change', browserSync.reload);
	gulp.watch('./src/html/**/*.{html, njk}', html).on('change', browserSync.reload);
};

const clean = done => {
	del('build');
	done();
};

exports.html = html;
exports.fonts = fonts;
exports.styles = styles;
exports.scss = scss;
exports.scripts = scripts;
exports.commonJs = commonJs;
exports.images = images;
exports.watching = watching;
exports.clean = clean;

exports.build = gulp.series(
	clean,
	html,
	styles,
	scss,
	fonts,
	images,
	scripts,
	commonJs
);

exports.default = gulp.series(
	gulp.parallel(
		html,
		styles,
		scss,
		fonts,
		images,
		scripts,
		commonJs
	),
	gulp.parallel(watching)
);
