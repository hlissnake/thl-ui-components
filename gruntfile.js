module.exports = function (grunt) {

	grunt.loadNpmTasks('grunt-conventional-changelog');
	grunt.loadNpmTasks('grunt-bump');

	grunt.registerTask('release', ['bump-only', 'conventionalChangelog', 'bump-commit']);
	grunt.registerTask('release:patch', ['bump-only:patch','conventionalChangelog','bump-commit']);
	grunt.registerTask('release:minor', ['bump-only:minor','conventionalChangelog','bump-commit']);
	grunt.registerTask('release:major', ['bump-only:major','conventionalChangelog','bump-commit']);
	grunt.registerTask('release:prerelease', ['bump-only:prerelease','conventionalChangelog','bump-commit']);
	grunt.registerTask('release:prepatch', ['bump-only:prepatch','conventionalChangelog','bump-commit']);
	grunt.registerTask('release:preminor', ['bump-only:preminor','conventionalChangelog','bump-commit']);
	grunt.registerTask('release:premajor', ['bump-only:premajor','conventionalChangelog','bump-commit']);

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		conventionalChangelog: {
			options: {
				changelogOpts: {
					preset: 'angular'
				}
			},
			release: {
				src: 'CHANGELOG.md'
			}
		},
		bump: {
			options: {
				files: [ 'package.json' ],
				updateConfigs: ['pkg'],
				commit: true,
				commitMessage: 'chore(version): %VERSION%',
				commitFiles: [ 'package.json', 'CHANGELOG.md' ],
				createTag: true,
				tagName: '%VERSION%',
				tagMessage: 'Version %VERSION%',
				push: false,
				gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
				globalReplace: false,
				prereleaseName: 'rc',
				regExp: false
			}
		}
	});
};
