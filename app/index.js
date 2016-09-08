'use strict';
var generators = require('yeoman-generator'),
  _ = require('lodash');

var configDefault = {
    stage_name : '',
    site_url : '',
    web_root : 'public',
    deploy_path : '',
    branch : 'master',
    app_role : '',
    web_role : '',
    db_role : ''
  };

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);
    this.argument('stages', { type: Array, required: true, desc: 'list of stages (dev, staging, production)' });
  },
  prompting : {
    plugins : function() {
      var that = this;
      var label = {
          stage_name : 'Name of stage',
          site_url : 'URLs for site',
          web_root : 'Web root for files',
          deploy_path : 'Path to deploy files to',
          branch : 'Branch to use',
          app_role : 'Connection for app role',
          web_role : 'Connection for web role',
          db_role : 'Connection for database role'
        };
      var configDefaultStages = {};
      _.forEach(this.stages, function(s) {
        _.forEach(configDefault, function(value, key) {
          configDefaultStages[key + '_' + s] = value;
        });
      });
      var config = _.extend(configDefaultStages, this.config.getAll());
      var questions = [];
      _.forEach(this.stages, function(s) {
        _.forEach(configDefault, function(value, key) {
          var question = {};
          question.type = 'input';
          question.name = key + '_' + s;
          question.message = s + '> ' + label[key];
          question.default = configDefaultStages[key+'_'+s];
          questions.push(question);
        });
      });
      
      var that = this;
      
      return this.prompt(questions)
      .then(function(answers) {
        that.config.set(answers);
        that.answers = _.extend(config, answers);
      });
    }
  },
  writing : {
    ruby : function() {
      var config = this.answers;
      var that = this;
      
      _.forEach(this.stages, function(s) {
        var localConf = {};
        _.forEach(configDefault, function(value, key) {
          localConf[key] = config[key + '_' + s];
        });
        
        that.fs.copyTpl(
          that.templatePath('config/deploy/dev.rb'),
          that.destinationPath('config/deploy/' + s + '.rb'),
          localConf
        );
      });
    }
  }
});
