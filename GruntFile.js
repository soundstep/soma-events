module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		meta:{
			version:'<%= pkg.version %>',
		},
		uglify: {
			options: {
				banner: '/* <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> - https://github.com/soundstep/soma-events - http://www.soundstep.com */',
				mangle: true
			},
			my_target: {
				files: {
					'min/soma-events-v<%= meta.version %>-min.js': ['src/soma-events.js']
				}
			}
		},
		watch:{
			scripts:{
				files:[
					'src/*.js',
					'GruntFile.js'
				],
				tasks:['uglify']
			}
		}
	});

	grunt.registerTask('default', ['uglify']);

}