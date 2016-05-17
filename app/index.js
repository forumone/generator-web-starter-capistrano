'use strict';
var generators = require('yeoman-generator'),
  _ = require('lodash');

module.exports = generators.Base.extend({
  initializing : {
  },
  prompting : {
    plugins : function() {
      var done = this.async();
      var that = this;
      var config = _.extend({
        stage_name : '',
        site_url : '',
        web_root : 'public',
        deploy_path : '',
        branch : 'master',
        app_role : '',
        web_role : '',
        db_role : ''
      }, this.config.getAll());
      
      this.prompt([{
        type    : 'input',
        name    : 'stage_name',
        message : 'Name of stage',
        default : config.stage_name
      },
      {
        type    : 'input',
        name    : 'site_url',
        message : 'URLs for site',
        default : config.site_url
      },
      {
        type    : 'input',
        name    : 'web_root',
        message : 'Web root for files',
        default : config.web_root
      },
      {
        type    : 'input',
        name    : 'deploy_path',
        message : 'Path to deploy files to',
        default : config.deploy_path
      },
      {
        type    : 'input',
        name    : 'branch',
        message : 'Branch to use',
        default : config.branch
      },
      {
        type    : 'input',
        name    : 'app_role',
        message : 'Connection for app role',
        default : config.app_role
      },
      {
        type    : 'input',
        name    : 'web_role',
        message : 'Connection for web role',
        default : config.web_role
      },
      {
        type    : 'input',
        name    : 'db_role',
        message : 'Connection for database role',
        default : config.database_role_connection
      }], function (answers) {
        this.config.set(answers);
        this.answers = _.extend(config, answers);
        done();
      }.bind(this));
    }
  },
  writing : {
    ruby : function() {
      var done = this.async();
      
      // Get current system config
      var config = this.answers;

      this.fs.copyTpl(
        this.templatePath('config/deploy/dev.rb'),
        this.destinationPath('config/deploy/' + this.answers.stage_name + '.rb'),
        config
      );
      
      done();
    }
  }
});
