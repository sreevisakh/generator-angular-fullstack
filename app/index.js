'use strict';
var fs = require('fs');
var path = require('path');
var util = require('util');
var genUtils = require('../util.js');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var wiredep = require('wiredep');

var AngularFullstackGenerator = yeoman.generators.Base.extend({

  init: function() {
    this.argument('name', {
      type: String,
      required: false
    });
    this.appname = this.name || path.basename(process.cwd());
    this.appname = this._.camelize(this._.slugify(this._.humanize(this.appname)));

    this.option('app-suffix', {
      desc: 'Allow a custom suffix to be added to the module name',
      type: String,
      required: 'false'
    });
    this.scriptAppName = this.appname + genUtils.appName(this);
    this.appPath = this.env.options.appPath;
    this.pkg = require('../package.json');

    this.filters = {html:true,css:true,js:true,ngroute:true,uibootstrap:true};
  },

  info: function() {
    this.log(this.yeoman);
    this.log('This is a modified yeoman for AIL.\n');
  },

  checkForConfig: function() {
    return;
  },

  clientPrompts: function() {
    return;
  },

  serverPrompts: function() {
    return;
  },

  saveSettings: function() {
    if (this.skipConfig) return;
    this.config.set('insertRoutes', true);
    this.config.set('registerRoutesFile', 'server/routes.js');
    this.config.set('routesNeedle', '// Insert routes below');

    this.config.set('routesBase', '/api/');
    this.config.set('pluralizeRoutes', true);

    this.config.set('insertSockets', true);
    this.config.set('registerSocketsFile', 'server/config/socketio.js');
    this.config.set('socketsNeedle', '// Insert sockets below');


    this.config.set('filters', this.filters);
    this.config.forceSave();

  },

  compose: function() {
    if (this.skipConfig) return;
    var appPath = 'client/app/';
    var extensions = [];
    var filters = [];
    /*
        if(this.filters.ngroute) filters.push('ngroute');
        if(this.filters.uirouter) filters.push('uirouter');
        if(this.filters.babel) extensions.push('babel');
        if(this.filters.coffee) extensions.push('coffee');
        if(this.filters.js) extensions.push('js');
        if(this.filters.html) extensions.push('html');
        if(this.filters.jade) extensions.push('jade');
        if(this.filters.css) extensions.push('css');
        if(this.filters.stylus) extensions.push('styl');
        if(this.filters.sass) extensions.push('scss');
        if(this.filters.less) extensions.push('less');

    */
    filters.push('ngroute');
    extensions.push('js');
    extensions.push('html');
    extensions.push('css');

    this.composeWith('ng-component', {
      options: {
        'routeDirectory': appPath,
        'directiveDirectory': appPath,
        'filterDirectory': appPath,
        'serviceDirectory': appPath,
        'filters': filters,
        'extensions': extensions,
        'basePath': 'client'
      }
    }, {
      local: require.resolve('generator-ng-component/app/index.js')
    });
  },

  ngModules: function() {
    this.filters = this._.defaults(this.config.get('filters'), {
      bootstrap: true,
      uibootstrap: true
    });

    var angModules = [
      "'ngCookies'",
      "'ngResource'",
      "'ngSanitize'"

    ];
    if (this.filters.ngroute) angModules.push("'ngRoute'");
    if (this.filters.socketio) angModules.push("'btford.socket-io'");
    if (this.filters.uirouter) angModules.push("'ui.router'");
    if (this.filters.uibootstrap) angModules.push("'ui.bootstrap'");

    this.angularModules = "\n  " + angModules.join(",\n  ") + "\n";
  },

  generate: function() {
    this.sourceRoot(path.join(__dirname, './templates'));
    genUtils.processDirectory(this, '.', '.');
  },

  end: function() {
    this.installDependencies({
      skipInstall: this.options['skip-install']
    });
  }
});

module.exports = AngularFullstackGenerator;
