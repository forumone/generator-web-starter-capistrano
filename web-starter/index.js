'use strict';
var generators = require('yeoman-generator'), 
  _ = require('lodash'),
  Promise = require('bluebird');

module.exports = generators.Base.extend({
  prompting : function() {
    var done = this.async();
    var that = this;
    
    var config = _.extend({
      deploy_via : 'rsync',
      keep_releases : 3
    }, this.config.getAll());

    return new Promise(function(resolve, reject) {
      that.prompt([{
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
      }], function(answers) {
        resolve(answers);
      });
    }).then(function(answers) {
      that.config.set(answers);
        
      answers.config = {};
      // Expose the answers on the parent generator
      _.extend(that.options.parent.answers, { 'web-starter-capistrano' : answers });
    }).finally(function() {
      done();
    });
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
