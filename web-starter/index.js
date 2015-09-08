'use strict';
var generators = require('yeoman-generator'), 
  _ = require('lodash');

module.exports = generators.Base.extend({
  engine : require('yeoman-hoganjs-engine'),
  prompting : function() {
    var done = this.async();
    var config = _.extend({
      deploy_via : 'rsync',
      keep_releases : 3
    }, this.config.getAll());

    this.prompt([{
      type: 'list',
      name: 'deploy_via',
      message: 'Method of deploying code',
      choices: ['rsync', 'git'],
      default: config.deploy_via
    },
    {
      type: 'input',
      name: 'keep_releases',
      message: 'Number of releases to keep',
      default: config.keep_releases
    }], function (answers) {
      this.config.set(answers);
      
      answers.config = {};
      // Expose the answers on the parent generator
      _.extend(this.options.parent.answers, { 'web-starter-capistrano' : answers });
      
      done();
    }.bind(this));
  },
  writing : {
    deploy : function() {
      var done = this.async();
      
      // Get current system config for this sub-generator
      var config = this.options.parent.answers['web-starter-capistrano'];
      _.extend(config, this.options.parent.answers);
      
      config.config = _.map(config.config, function(val, idx) {
        return {
          key : idx,
          value : val.toString()
        }
      });

      this.fs.copyTpl(
        this.templatePath('config/deploy.rb'),
        this.destinationPath('config/deploy.rb'),
        config
      );

      done();
    }
  }
});
