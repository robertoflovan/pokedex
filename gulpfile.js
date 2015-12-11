var gulp = require('gulp');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');

//levanta el servidor local
var webserver = require('gulp-webserver');

//actualizar el navegador automáticamente
var livereload = require('gulp-livereload');

////////////////STYLUS/////////////////
//permite compilar stylus
var stylus = require('gulp-stylus');
//agrega prefijos a los atributos css
var nib = require('nib');
//minificar los css
var minifyCSS = require('gulp-minify-css');

/////////////////JS//////////////////
//minificar JS
var uglify = require('gulp-uglify');

//////////////// JADE ///////////////
var jade = require('gulp-jade');

/////////////// BORRAR LA CARPETA dist  CADA VEZ QUE TRABAJE GULP ////
var clean = require('gulp-rimraf');

//modules of bower
//hacer funcionar los requieredel frontend 
var browserify = require('browserify');
var debowerify = require('debowerify');



//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------


var config = {
	styles: {
		main: './src/styles/app.styl',
		output: './dist/css',
		watch: './src/styles/*.styl',
		fonts:{
			main: './src/styles/fonts/*',
			output: './dist/css/fonts/'
		}
	},
	htmls: {
		main: './src/index.jade',
		output: './dist',
		watch: './src/*.jade'
	},
	scripts:{
		main: './src/scripts/*.js',
		output: './dist/js',
		watch: './src/scripts/*.js'
	},
	api:{
		main: './api/*',
		output: './dist/api'
	}
}

gulp.task('server', function(){
	gulp
		.src('./dist')//levanta la carpeta dist en servidor
		.pipe(webserver({
			host: '0.0.0.0',
			port: 8080
		}));
})


gulp.task('clean', function(){//borra la carpeta dist cada vez que se actualiza
	return gulp
				.src('./dist', {read: false})
				.pipe(clean(-{force: true}));
})

gulp.task('jadeToHTML', function(){//compila de jade a html
	gulp
		.src(config.htmls.main)
		.pipe(jade({
			pretty: true
		}))
		.pipe(gulp.dest(config.htmls.output))
		.pipe(livereload());
});


gulp.task('stylusToCSS', function(){
	gulp
		.src(config.styles.main)
		.pipe(stylus({
			use: nib(),
			'include css':true
		}))
		.pipe(minifyCSS())
		.pipe(gulp.dest(config.styles.output))
		.pipe(livereload());
});


gulp.task('js', function(){
	gulp
		.src(config.scripts.main)
		//.pipe(uglify())
		.pipe(gulp.dest(config.scripts.output))
		.pipe(livereload());
});

// Observa los cambios tanto en HTML, CSS y JS
gulp.task('watch', function(){
	livereload.listen();
	gulp.watch(config.styles.watch, ['stylusToCSS']);
	gulp.watch(config.scripts.watch, ['js']);
	gulp.watch(config.htmls.watch, ['jadeToHTML']);
})


//Copiar carpeta FONTS
gulp.task('fonts', function(){
	gulp
		.src(config.styles.fonts.main)
		.pipe(gulp.dest(config.styles.fonts.output));
});

//Copiar carpeta API
gulp.task('api', function(){
	gulp
		.src(config.api.main)
		.pipe(gulp.dest(config.api.output));
});


//Tarea por default
gulp.task('default',['clean','server','watch'], function(){
	gulp
		.start('fonts','stylusToCSS','js','jadeToHTML','api');
})

