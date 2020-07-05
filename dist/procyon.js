(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f();}else if(typeof define==="function"&&define.amd){define([],f);}else {var g;if(typeof window!=="undefined"){g=window;}else if(typeof global!=="undefined"){g=global;}else if(typeof self!=="undefined"){g=self;}else {g=this;}g.ejs=f();}})(function(){return function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r);}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e}()({1:[function(require,module,exports){var fs=require("fs");var path=require("path");var utils=require("./utils");var scopeOptionWarned=false;var _VERSION_STRING=require("../package.json").version;var _DEFAULT_OPEN_DELIMITER="<";var _DEFAULT_CLOSE_DELIMITER=">";var _DEFAULT_DELIMITER="%";var _DEFAULT_LOCALS_NAME="locals";var _NAME="ejs";var _REGEX_STRING="(<%%|%%>|<%=|<%-|<%_|<%#|<%|%>|-%>|_%>)";var _OPTS_PASSABLE_WITH_DATA=["delimiter","scope","context","debug","compileDebug","client","_with","rmWhitespace","strict","filename","async"];var _OPTS_PASSABLE_WITH_DATA_EXPRESS=_OPTS_PASSABLE_WITH_DATA.concat("cache");var _BOM=/^\uFEFF/;exports.cache=utils.cache;exports.fileLoader=fs.readFileSync;exports.localsName=_DEFAULT_LOCALS_NAME;exports.promiseImpl=new Function("return this;")().Promise;exports.resolveInclude=function(name,filename,isDir){var dirname=path.dirname;var extname=path.extname;var resolve=path.resolve;var includePath=resolve(isDir?filename:dirname(filename),name);var ext=extname(name);if(!ext){includePath+=".ejs";}return includePath};function getIncludePath(path,options){var includePath;var filePath;var views=options.views;var match=/^[A-Za-z]+:\\|^\//.exec(path);if(match&&match.length){includePath=exports.resolveInclude(path.replace(/^\/*/,""),options.root||"/",true);}else {if(options.filename){filePath=exports.resolveInclude(path,options.filename);if(fs.existsSync(filePath)){includePath=filePath;}}if(!includePath){if(Array.isArray(views)&&views.some(function(v){filePath=exports.resolveInclude(path,v,true);return fs.existsSync(filePath)})){includePath=filePath;}}if(!includePath){throw new Error('Could not find the include file "'+options.escapeFunction(path)+'"')}}return includePath}function handleCache(options,template){var func;var filename=options.filename;var hasTemplate=arguments.length>1;if(options.cache){if(!filename){throw new Error("cache option requires a filename")}func=exports.cache.get(filename);if(func){return func}if(!hasTemplate){template=fileLoader(filename).toString().replace(_BOM,"");}}else if(!hasTemplate){if(!filename){throw new Error("Internal EJS error: no file name or template "+"provided")}template=fileLoader(filename).toString().replace(_BOM,"");}func=exports.compile(template,options);if(options.cache){exports.cache.set(filename,func);}return func}function tryHandleCache(options,data,cb){var result;if(!cb){if(typeof exports.promiseImpl=="function"){return new exports.promiseImpl(function(resolve,reject){try{result=handleCache(options)(data);resolve(result);}catch(err){reject(err);}})}else {throw new Error("Please provide a callback function")}}else {try{result=handleCache(options)(data);}catch(err){return cb(err)}cb(null,result);}}function fileLoader(filePath){return exports.fileLoader(filePath)}function includeFile(path,options){var opts=utils.shallowCopy({},options);opts.filename=getIncludePath(path,opts);return handleCache(opts)}function rethrow(err,str,flnm,lineno,esc){var lines=str.split("\n");var start=Math.max(lineno-3,0);var end=Math.min(lines.length,lineno+3);var filename=esc(flnm);var context=lines.slice(start,end).map(function(line,i){var curr=i+start+1;return (curr==lineno?" >> ":"    ")+curr+"| "+line}).join("\n");err.path=filename;err.message=(filename||"ejs")+":"+lineno+"\n"+context+"\n\n"+err.message;throw err}function stripSemi(str){return str.replace(/;(\s*$)/,"$1")}exports.compile=function compile(template,opts){var templ;if(opts&&opts.scope){if(!scopeOptionWarned){console.warn("`scope` option is deprecated and will be removed in EJS 3");scopeOptionWarned=true;}if(!opts.context){opts.context=opts.scope;}delete opts.scope;}templ=new Template(template,opts);return templ.compile()};exports.render=function(template,d,o){var data=d||{};var opts=o||{};if(arguments.length==2){utils.shallowCopyFromList(opts,data,_OPTS_PASSABLE_WITH_DATA);}return handleCache(opts,template)(data)};exports.renderFile=function(){var args=Array.prototype.slice.call(arguments);var filename=args.shift();var cb;var opts={filename:filename};var data;var viewOpts;if(typeof arguments[arguments.length-1]=="function"){cb=args.pop();}if(args.length){data=args.shift();if(args.length){utils.shallowCopy(opts,args.pop());}else {if(data.settings){if(data.settings.views){opts.views=data.settings.views;}if(data.settings["view cache"]){opts.cache=true;}viewOpts=data.settings["view options"];if(viewOpts){utils.shallowCopy(opts,viewOpts);}}utils.shallowCopyFromList(opts,data,_OPTS_PASSABLE_WITH_DATA_EXPRESS);}opts.filename=filename;}else {data={};}return tryHandleCache(opts,data,cb)};exports.Template=Template;exports.clearCache=function(){exports.cache.reset();};function Template(text,opts){opts=opts||{};var options={};this.templateText=text;this.mode=null;this.truncate=false;this.currentLine=1;this.source="";options.client=opts.client||false;options.escapeFunction=opts.escape||opts.escapeFunction||utils.escapeXML;options.compileDebug=opts.compileDebug!==false;options.debug=!!opts.debug;options.filename=opts.filename;options.openDelimiter=opts.openDelimiter||exports.openDelimiter||_DEFAULT_OPEN_DELIMITER;options.closeDelimiter=opts.closeDelimiter||exports.closeDelimiter||_DEFAULT_CLOSE_DELIMITER;options.delimiter=opts.delimiter||exports.delimiter||_DEFAULT_DELIMITER;options.strict=opts.strict||false;options.context=opts.context;options.cache=opts.cache||false;options.rmWhitespace=opts.rmWhitespace;options.root=opts.root;options.outputFunctionName=opts.outputFunctionName;options.localsName=opts.localsName||exports.localsName||_DEFAULT_LOCALS_NAME;options.views=opts.views;options.async=opts.async;options.destructuredLocals=opts.destructuredLocals;options.legacyInclude=typeof opts.legacyInclude!="undefined"?!!opts.legacyInclude:true;if(options.strict){options._with=false;}else {options._with=typeof opts._with!="undefined"?opts._with:true;}this.opts=options;this.regex=this.createRegex();}Template.modes={EVAL:"eval",ESCAPED:"escaped",RAW:"raw",COMMENT:"comment",LITERAL:"literal"};Template.prototype={createRegex:function(){var str=_REGEX_STRING;var delim=utils.escapeRegExpChars(this.opts.delimiter);var open=utils.escapeRegExpChars(this.opts.openDelimiter);var close=utils.escapeRegExpChars(this.opts.closeDelimiter);str=str.replace(/%/g,delim).replace(/</g,open).replace(/>/g,close);return new RegExp(str)},compile:function(){var src;var fn;var opts=this.opts;var prepended="";var appended="";var escapeFn=opts.escapeFunction;var ctor;if(!this.source){this.generateSource();prepended+='  var __output = "";\n'+"  function __append(s) { if (s !== undefined && s !== null) __output += s }\n";if(opts.outputFunctionName){prepended+="  var "+opts.outputFunctionName+" = __append;"+"\n";}if(opts.destructuredLocals&&opts.destructuredLocals.length){var destructuring="  var __locals = ("+opts.localsName+" || {}),\n";for(var i=0;i<opts.destructuredLocals.length;i++){var name=opts.destructuredLocals[i];if(i>0){destructuring+=",\n  ";}destructuring+=name+" = __locals."+name;}prepended+=destructuring+";\n";}if(opts._with!==false){prepended+="  with ("+opts.localsName+" || {}) {"+"\n";appended+="  }"+"\n";}appended+="  return __output;"+"\n";this.source=prepended+this.source+appended;}if(opts.compileDebug){src="var __line = 1"+"\n"+"  , __lines = "+JSON.stringify(this.templateText)+"\n"+"  , __filename = "+(opts.filename?JSON.stringify(opts.filename):"undefined")+";"+"\n"+"try {"+"\n"+this.source+"} catch (e) {"+"\n"+"  rethrow(e, __lines, __filename, __line, escapeFn);"+"\n"+"}"+"\n";}else {src=this.source;}if(opts.client){src="escapeFn = escapeFn || "+escapeFn.toString()+";"+"\n"+src;if(opts.compileDebug){src="rethrow = rethrow || "+rethrow.toString()+";"+"\n"+src;}}if(opts.strict){src='"use strict";\n'+src;}if(opts.debug){console.log(src);}if(opts.compileDebug&&opts.filename){src=src+"\n"+"//# sourceURL="+opts.filename+"\n";}try{if(opts.async){try{ctor=new Function("return (async function(){}).constructor;")();}catch(e){if(e instanceof SyntaxError){throw new Error("This environment does not support async/await")}else {throw e}}}else {ctor=Function;}fn=new ctor(opts.localsName+", escapeFn, include, rethrow",src);}catch(e){if(e instanceof SyntaxError){if(opts.filename){e.message+=" in "+opts.filename;}e.message+=" while compiling ejs\n\n";e.message+="If the above error is not helpful, you may want to try EJS-Lint:\n";e.message+="https://github.com/RyanZim/EJS-Lint";if(!opts.async){e.message+="\n";e.message+="Or, if you meant to create an async function, pass `async: true` as an option.";}}throw e}var returnedFn=opts.client?fn:function anonymous(data){var include=function(path,includeData){var d=utils.shallowCopy({},data);if(includeData){d=utils.shallowCopy(d,includeData);}return includeFile(path,opts)(d)};return fn.apply(opts.context,[data||{},escapeFn,include,rethrow])};if(opts.filename&&typeof Object.defineProperty==="function"){var filename=opts.filename;var basename=path.basename(filename,path.extname(filename));try{Object.defineProperty(returnedFn,"name",{value:basename,writable:false,enumerable:false,configurable:true});}catch(e){}}return returnedFn},generateSource:function(){var opts=this.opts;if(opts.rmWhitespace){this.templateText=this.templateText.replace(/[\r\n]+/g,"\n").replace(/^\s+|\s+$/gm,"");}this.templateText=this.templateText.replace(/[ \t]*<%_/gm,"<%_").replace(/_%>[ \t]*/gm,"_%>");var self=this;var matches=this.parseTemplateText();var d=this.opts.delimiter;var o=this.opts.openDelimiter;var c=this.opts.closeDelimiter;if(matches&&matches.length){matches.forEach(function(line,index){var closing;if(line.indexOf(o+d)===0&&line.indexOf(o+d+d)!==0){closing=matches[index+2];if(!(closing==d+c||closing=="-"+d+c||closing=="_"+d+c)){throw new Error('Could not find matching close tag for "'+line+'".')}}self.scanLine(line);});}},parseTemplateText:function(){var str=this.templateText;var pat=this.regex;var result=pat.exec(str);var arr=[];var firstPos;while(result){firstPos=result.index;if(firstPos!==0){arr.push(str.substring(0,firstPos));str=str.slice(firstPos);}arr.push(result[0]);str=str.slice(result[0].length);result=pat.exec(str);}if(str){arr.push(str);}return arr},_addOutput:function(line){if(this.truncate){line=line.replace(/^(?:\r\n|\r|\n)/,"");this.truncate=false;}if(!line){return line}line=line.replace(/\\/g,"\\\\");line=line.replace(/\n/g,"\\n");line=line.replace(/\r/g,"\\r");line=line.replace(/"/g,'\\"');this.source+='    ; __append("'+line+'")'+"\n";},scanLine:function(line){var self=this;var d=this.opts.delimiter;var o=this.opts.openDelimiter;var c=this.opts.closeDelimiter;var newLineCount=0;newLineCount=line.split("\n").length-1;switch(line){case o+d:case o+d+"_":this.mode=Template.modes.EVAL;break;case o+d+"=":this.mode=Template.modes.ESCAPED;break;case o+d+"-":this.mode=Template.modes.RAW;break;case o+d+"#":this.mode=Template.modes.COMMENT;break;case o+d+d:this.mode=Template.modes.LITERAL;this.source+='    ; __append("'+line.replace(o+d+d,o+d)+'")'+"\n";break;case d+d+c:this.mode=Template.modes.LITERAL;this.source+='    ; __append("'+line.replace(d+d+c,d+c)+'")'+"\n";break;case d+c:case"-"+d+c:case"_"+d+c:if(this.mode==Template.modes.LITERAL){this._addOutput(line);}this.mode=null;this.truncate=line.indexOf("-")===0||line.indexOf("_")===0;break;default:if(this.mode){switch(this.mode){case Template.modes.EVAL:case Template.modes.ESCAPED:case Template.modes.RAW:if(line.lastIndexOf("//")>line.lastIndexOf("\n")){line+="\n";}}switch(this.mode){case Template.modes.EVAL:this.source+="    ; "+line+"\n";break;case Template.modes.ESCAPED:this.source+="    ; __append(escapeFn("+stripSemi(line)+"))"+"\n";break;case Template.modes.RAW:this.source+="    ; __append("+stripSemi(line)+")"+"\n";break;case Template.modes.COMMENT:break;case Template.modes.LITERAL:this._addOutput(line);break}}else {this._addOutput(line);}}if(self.opts.compileDebug&&newLineCount){this.currentLine+=newLineCount;this.source+="    ; __line = "+this.currentLine+"\n";}}};exports.escapeXML=utils.escapeXML;exports.__express=exports.renderFile;exports.VERSION=_VERSION_STRING;exports.name=_NAME;if(typeof window!="undefined"){window.ejs=exports;}},{"../package.json":6,"./utils":2,fs:3,path:4}],2:[function(require,module,exports){var regExpChars=/[|\\{}()[\]^$+*?.]/g;exports.escapeRegExpChars=function(string){if(!string){return ""}return String(string).replace(regExpChars,"\\$&")};var _ENCODE_HTML_RULES={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&#34;","'":"&#39;"};var _MATCH_HTML=/[&<>'"]/g;function encode_char(c){return _ENCODE_HTML_RULES[c]||c}var escapeFuncStr="var _ENCODE_HTML_RULES = {\n"+'      "&": "&amp;"\n'+'    , "<": "&lt;"\n'+'    , ">": "&gt;"\n'+'    , \'"\': "&#34;"\n'+'    , "\'": "&#39;"\n'+"    }\n"+"  , _MATCH_HTML = /[&<>'\"]/g;\n"+"function encode_char(c) {\n"+"  return _ENCODE_HTML_RULES[c] || c;\n"+"};\n";exports.escapeXML=function(markup){return markup==undefined?"":String(markup).replace(_MATCH_HTML,encode_char)};exports.escapeXML.toString=function(){return Function.prototype.toString.call(this)+";\n"+escapeFuncStr};exports.shallowCopy=function(to,from){from=from||{};for(var p in from){to[p]=from[p];}return to};exports.shallowCopyFromList=function(to,from,list){for(var i=0;i<list.length;i++){var p=list[i];if(typeof from[p]!="undefined"){to[p]=from[p];}}return to};exports.cache={_data:{},set:function(key,val){this._data[key]=val;},get:function(key){return this._data[key]},remove:function(key){delete this._data[key];},reset:function(){this._data={};}};},{}],3:[function(require,module,exports){},{}],4:[function(require,module,exports){(function(process){function normalizeArray(parts,allowAboveRoot){var up=0;for(var i=parts.length-1;i>=0;i--){var last=parts[i];if(last==="."){parts.splice(i,1);}else if(last===".."){parts.splice(i,1);up++;}else if(up){parts.splice(i,1);up--;}}if(allowAboveRoot){for(;up--;up){parts.unshift("..");}}return parts}var splitPathRe=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;var splitPath=function(filename){return splitPathRe.exec(filename).slice(1)};exports.resolve=function(){var resolvedPath="",resolvedAbsolute=false;for(var i=arguments.length-1;i>=-1&&!resolvedAbsolute;i--){var path=i>=0?arguments[i]:process.cwd();if(typeof path!=="string"){throw new TypeError("Arguments to path.resolve must be strings")}else if(!path){continue}resolvedPath=path+"/"+resolvedPath;resolvedAbsolute=path.charAt(0)==="/";}resolvedPath=normalizeArray(filter(resolvedPath.split("/"),function(p){return !!p}),!resolvedAbsolute).join("/");return (resolvedAbsolute?"/":"")+resolvedPath||"."};exports.normalize=function(path){var isAbsolute=exports.isAbsolute(path),trailingSlash=substr(path,-1)==="/";path=normalizeArray(filter(path.split("/"),function(p){return !!p}),!isAbsolute).join("/");if(!path&&!isAbsolute){path=".";}if(path&&trailingSlash){path+="/";}return (isAbsolute?"/":"")+path};exports.isAbsolute=function(path){return path.charAt(0)==="/"};exports.join=function(){var paths=Array.prototype.slice.call(arguments,0);return exports.normalize(filter(paths,function(p,index){if(typeof p!=="string"){throw new TypeError("Arguments to path.join must be strings")}return p}).join("/"))};exports.relative=function(from,to){from=exports.resolve(from).substr(1);to=exports.resolve(to).substr(1);function trim(arr){var start=0;for(;start<arr.length;start++){if(arr[start]!=="")break}var end=arr.length-1;for(;end>=0;end--){if(arr[end]!=="")break}if(start>end)return [];return arr.slice(start,end-start+1)}var fromParts=trim(from.split("/"));var toParts=trim(to.split("/"));var length=Math.min(fromParts.length,toParts.length);var samePartsLength=length;for(var i=0;i<length;i++){if(fromParts[i]!==toParts[i]){samePartsLength=i;break}}var outputParts=[];for(var i=samePartsLength;i<fromParts.length;i++){outputParts.push("..");}outputParts=outputParts.concat(toParts.slice(samePartsLength));return outputParts.join("/")};exports.sep="/";exports.delimiter=":";exports.dirname=function(path){var result=splitPath(path),root=result[0],dir=result[1];if(!root&&!dir){return "."}if(dir){dir=dir.substr(0,dir.length-1);}return root+dir};exports.basename=function(path,ext){var f=splitPath(path)[2];if(ext&&f.substr(-1*ext.length)===ext){f=f.substr(0,f.length-ext.length);}return f};exports.extname=function(path){return splitPath(path)[3]};function filter(xs,f){if(xs.filter)return xs.filter(f);var res=[];for(var i=0;i<xs.length;i++){if(f(xs[i],i,xs))res.push(xs[i]);}return res}var substr="ab".substr(-1)==="b"?function(str,start,len){return str.substr(start,len)}:function(str,start,len){if(start<0)start=str.length+start;return str.substr(start,len)};}).call(this,require("_process"));},{_process:5}],5:[function(require,module,exports){var process=module.exports={};var cachedSetTimeout;var cachedClearTimeout;function defaultSetTimout(){throw new Error("setTimeout has not been defined")}function defaultClearTimeout(){throw new Error("clearTimeout has not been defined")}(function(){try{if(typeof setTimeout==="function"){cachedSetTimeout=setTimeout;}else {cachedSetTimeout=defaultSetTimout;}}catch(e){cachedSetTimeout=defaultSetTimout;}try{if(typeof clearTimeout==="function"){cachedClearTimeout=clearTimeout;}else {cachedClearTimeout=defaultClearTimeout;}}catch(e){cachedClearTimeout=defaultClearTimeout;}})();function runTimeout(fun){if(cachedSetTimeout===setTimeout){return setTimeout(fun,0)}if((cachedSetTimeout===defaultSetTimout||!cachedSetTimeout)&&setTimeout){cachedSetTimeout=setTimeout;return setTimeout(fun,0)}try{return cachedSetTimeout(fun,0)}catch(e){try{return cachedSetTimeout.call(null,fun,0)}catch(e){return cachedSetTimeout.call(this,fun,0)}}}function runClearTimeout(marker){if(cachedClearTimeout===clearTimeout){return clearTimeout(marker)}if((cachedClearTimeout===defaultClearTimeout||!cachedClearTimeout)&&clearTimeout){cachedClearTimeout=clearTimeout;return clearTimeout(marker)}try{return cachedClearTimeout(marker)}catch(e){try{return cachedClearTimeout.call(null,marker)}catch(e){return cachedClearTimeout.call(this,marker)}}}var queue=[];var draining=false;var currentQueue;var queueIndex=-1;function cleanUpNextTick(){if(!draining||!currentQueue){return}draining=false;if(currentQueue.length){queue=currentQueue.concat(queue);}else {queueIndex=-1;}if(queue.length){drainQueue();}}function drainQueue(){if(draining){return}var timeout=runTimeout(cleanUpNextTick);draining=true;var len=queue.length;while(len){currentQueue=queue;queue=[];while(++queueIndex<len){if(currentQueue){currentQueue[queueIndex].run();}}queueIndex=-1;len=queue.length;}currentQueue=null;draining=false;runClearTimeout(timeout);}process.nextTick=function(fun){var args=new Array(arguments.length-1);if(arguments.length>1){for(var i=1;i<arguments.length;i++){args[i-1]=arguments[i];}}queue.push(new Item(fun,args));if(queue.length===1&&!draining){runTimeout(drainQueue);}};function Item(fun,array){this.fun=fun;this.array=array;}Item.prototype.run=function(){this.fun.apply(null,this.array);};process.title="browser";process.browser=true;process.env={};process.argv=[];process.version="";process.versions={};function noop(){}process.on=noop;process.addListener=noop;process.once=noop;process.off=noop;process.removeListener=noop;process.removeAllListeners=noop;process.emit=noop;process.prependListener=noop;process.prependOnceListener=noop;process.listeners=function(name){return []};process.binding=function(name){throw new Error("process.binding is not supported")};process.cwd=function(){return "/"};process.chdir=function(dir){throw new Error("process.chdir is not supported")};process.umask=function(){return 0};},{}],6:[function(require,module,exports){module.exports={name:"ejs",description:"Embedded JavaScript templates",keywords:["template","engine","ejs"],version:"3.0.2",author:"Matthew Eernisse <mde@fleegix.org> (http://fleegix.org)",license:"Apache-2.0",main:"./lib/ejs.js",repository:{type:"git",url:"git://github.com/mde/ejs.git"},bugs:"https://github.com/mde/ejs/issues",homepage:"https://github.com/mde/ejs",dependencies:{},devDependencies:{browserify:"^13.1.1",eslint:"^4.14.0","git-directory-deploy":"^1.5.1",jake:"^10.3.1",jsdoc:"^3.4.0","lru-cache":"^4.0.1",mocha:"^5.0.5","uglify-js":"^3.3.16"},engines:{node:">=0.10.0"},scripts:{test:"mocha",postinstall:"node --harmony ./postinstall.js"}};},{}]},{},[1])(1)});

class Resource {
  constructor(controller, action) {
    this.controller = controller;
    this.action = action;
  }

  async load() {
    const path = this.relativePath();
    await import(path);
  }

  relativePath() {
    return `${procyon.subPath()}/${procyon.appFolder}/controllers/${this.controller}.js`;
  }

  classDef() {
    return procyon.classDef(this.controller);
  }

  className() {
    return this.controller;
  }

  methodName() {
    return this.action;
  }
}

class Router {
  static pathParam() {
    return procyon.constructor.currentURL.searchParams.get('path');
  }

  static anchor() {
    return procyon.constructor.currentURL.hash.substring(1);
  }

  static hasAnchor() {
    return !!procyon.constructor.currentURL.hash;
  }

  async whenReady() {
    const jsonUrl = procyon.appUrl('routes.json');
    const response = await fetch(jsonUrl);
    this.routes = await response.json();
  }

  resource() {
    const routeObj = this.routeReference();
    const { controller } = routeObj;
    const { action } = routeObj;
    return new Resource(controller, action);
  }

  args() {
    const routeObj = this.routeReference();
    if (!routeObj.args) return [];

    return routeObj.args.map((item) => procyon.constructor.param(item));
  }

  routeReference() {
    let routeKey = '/';
    if (this.hasPath()) routeKey = this.constructor.pathParam();
    else if (this.constructor.hasAnchor()) routeKey = this.constructor.anchor();
    return this.routes[routeKey];
  }

  hasPath() {
    return !!this.constructor.pathParam();
  }

  path() {
    return this.constructor.pathParam();
  }
}

const RenderState = {
  NOT_RENDERED: 'not_rendered',
  RENDERED: 'rendered',
  RENDERING: 'rendering',
};

class View {
  constructor(options = {}) {
    this.components = options.components;
    this.data = options.data;
    this.model = options.model;
    this.bindedElements = [];
    this.renderState = RenderState.NOT_RENDERED;
  }

  /* eslint class-methods-use-this: "off" */
  bindings() {}

  get templateData() {
    return { model: this.model, ...this.data };
  }

  async render() {
    if (this.renderState === RenderState.RENDERING) return;
    if (!this.el) {
      this.el = document.createElement('div');
    }
    this.renderState = RenderState.RENDERING;
    const templatesStr = await this.templateStr();
    this.template = ejs.compile(templatesStr);
    this.HTML = this.template(this.templateData);
    this.el.innerHTML = this.HTML;
    if (this.components) {
      Object.entries(this.components).forEach(async (item) => {
        await item[1].render();
        const el = this.el.querySelector(`[data-component="${item[0]}"]`);
        el.replaceWith(item[1].el);
      });
    }
    this.bindings();
    this.renderState = RenderState.RENDERED;
  }

  bind(selector, event, handler) {
    const el = this.el.querySelector(selector);
    this.addToBindedElements(el);
    el[event] = async (ev) => {
      await handler.bind(this)(ev);
    };
  }

  async bindRender() {
    if (this.hasFocus()) {
      await new Promise((resolve) => {
        setTimeout(async () => {
          await this.bindRender();
          resolve();
        }, 500);
      });
    }
    await this.render();
  }

  hasFocus() {
    const { activeElement } = document;
    return this.bindedElements.some((el) => el === activeElement);
  }

  addToBindedElements(el) {
    this.bindedElements.push(el);
  }

  async templateStr() {
    if (this.cachedTemplateStr) return this.cachedTemplateStr;
    const response = await fetch(procyon.relativeUrl(`${procyon.appFolder}/templates/${this.constructor.templatePath}.ejs`));
    this.cachedTemplateStr = await response.text();
    return this.cachedTemplateStr;
  }
}

class Controller {
  constructor() {
    this.styles = [];
  }

  static get layout() {
    return 'basic';
  }

  // eslint-disable-next-line class-methods-use-this
  performBeforeAction() {
  }

  async performAction(action, ...args) {
    await this[action](...args);
    if (this.styles.length > 0) {
      procyon.addStyles(this.styles);
    }
  }

  async render(view, options) {
    const module = await import(`${procyon.subPath()}/${procyon.appFolder}/views/${view}.js`);
    const Klass = module.default;
    const vi = new Klass(options);
    await vi.render();
    vi.el.dataset.path = procyon.route.path();
    await this.renderToPage({ content: vi.el });
    return vi;
  }

  async renderToPage(data) {
    const response = await fetch(procyon.relativeUrl(`${procyon.appFolder}/layouts/${this.constructor.layout}.html`));
    const layoutHtml = await response.text();
    this.el = document.createElement('div');
    this.el.innerHTML = layoutHtml;
    Object.entries(data).forEach(([key, value]) => {
      this.el.querySelector(`div[data-hook="${key}"]`).replaceWith(value);
    });
    procyon.appendElement(this.el);
  }

  addStyle(stylePath) {
    this.styles.push(stylePath);
  }
}

class DataModel {
  constructor(attr = {}) {
    this.emitter = document.createElement('div'); // to have an event emitter
    this.attributes = attr;
  }

  get savePath() {
    return `${this.apiHref}/post`;
  }

  get updatePath() {
    return `${this.apiHref}/put`;
  }

  get getPath() {
    return `${this.apiHref}/get`;
  }

  get deletePath() {
    return `${this.apiHref}/delete`;
  }

  get batchPath() {
    return `${this.apiHref}/batch`;
  }

  get apiHref() {
    return `${procyon.config.apiUrl}${this.constructor.name.toLowerCase()}`;
  }

  static async find(id) {
    const obj = new this();
    const response = await axios.get(obj.getPath, { params: { id } });
    obj.object2attr(response.data);
    return obj;
  }

  get(name) {
    return this.attributes[name];
  }

  set(name, value) {
    this.attributes[name] = value;
  }

  object2attr(object) {
    this.attributes = object;
  }

  async save() {
    try {
      const response = this.isNew()
        ? await axios.post(this.savePath, this.attributes)
        : await axios.post(this.updatePath, this.attributes);
      this.object2attr(response.data);
      this.dispatch('saved');
    } catch (e) {
      if (e.isAxiosError) throw e; // todo handle

      const module = await Promise.resolve().then(function () { return dataModelError; });
      const ErrorKlass = module.default;
      throw new ErrorKlass(this, 'Failed to save record');
    }
  }

  async delete() {
    try {
      await axios.get(this.deletePath, { params: { id: this.get('id') } });
      return true;
    } catch (e) {
      return false;
    }
  }

  isNew() {
    return !Object.prototype.hasOwnProperty.call(this.attributes, 'id');
  }

  when(eventName) {
    return new Promise((resolve) => {
      this.emitter.addEventListener(eventName, resolve, { once: true });
    });
  }

  dispatch(eventName) {
    this.emitter.dispatchEvent(new Event(eventName));
  }
}

DataModel.all = async function () {
  const model = new this();
  const response = await axios.get(model.batchPath, { params: { action: 'all' } });
  return response.data.map((item) => new this(item));
};

DataModel.count = async function () {
  const models = await this.all();
  return models.length;
};

class List extends View {
  constructor(options = { size: 2 }) {
    super();
    this.index = parseInt(procyon.constructor.param('page') || 0, 0);
    this.length = options.length;
    this.size = options.size;
    this.loader = options.loader;
    this.html = options.html;
    this.showLink = options.showLink;
    this.deleteLink = options.deleteLink;
    if (options.cssClass) this.cssClass = options.cssClass;
  }

  async render() {
    if (!this.el) {
      this.el = document.createElement('div');
      this.el.classList.add('list-component');
      if (this.cssClass) {
        this.el.classList.add(this.cssClass);
      }
    }

    await this.renderItems();
    await this.renderPagination();
  }

  async renderItems() {
    if (!this.content) {
      this.content = document.createElement('div');
      this.content.classList.add('items');
      this.el.appendChild(this.content);
    } else {
      this.content.innerHTML = '';
    }
    const items = await this.loader(this.index * this.size, this.size);
    items.forEach((item) => this.renderItem(item));
  }

  renderItem(item) {
    const el = this.html(item);
    el.classList.add('item');
    const show = document.createElement('div');
    show.classList.add('btn-group');
    show.classList.add('btn-group-sm');
    show.setAttribute('role', 'group');
    const showEl = this.showLinkEl(item);
    const delEl = this.deleteLinkEl(item);
    show.appendChild(showEl);
    show.appendChild(delEl);
    el.appendChild(show);
    this.content.appendChild(el);
  }

  deleteLinkEl(item) {
    const deleteLink = this.deleteLink(item);
    return this.constructor.link(deleteLink, 'Delete');
  }

  showLinkEl(item) {
    const showLink = this.showLink(item);
    return this.constructor.link(showLink, 'View');
  }

  static link(showLink, text) {
    const link = document.createElement('a');
    link.innerHTML = text;
    link.classList.add('btn');
    link.classList.add('btn-secondary');
    link.href = showLink;
    return link;
  }

  async renderPagination() {
    if (!this.pagination) {
      this.pagination = document.createElement('nav');
      this.pagination.classList.add('pagination-wrapper');
      const ul = document.createElement('ul');
      ul.classList.add('pagination');
      this.pagination.appendChild(ul);
      this.el.appendChild(this.pagination);
    }
    this.pagination.querySelectorAll('a').forEach((link) => link.remove());
    const ul = this.pagination.querySelector('ul');
    let times = 0;
    const len = await this.length();
    for (let i = 0; i < len; i += this.size) {
      const link = document.createElement('a');
      link.classList.add('page-link');
      link.setAttribute('data-index', times);
      link.innerText = `${times + 1}`;
      link.setAttribute('href', '#');
      link.onclick = this.onPaginationClick.bind(this);
      const li = document.createElement('li');
      li.classList.add('page-item');
      if (times === this.index) {
        li.classList.add('current', 'active');
      }
      li.setAttribute('data-index', times);
      li.appendChild(link);
      ul.appendChild(li);
      times += 1;
    }
  }

  onPaginationClick(event) {
    this.pagination.querySelectorAll('li.current').forEach((el) => el.classList.remove('current', 'active'));
    event.target.classList.add('current', 'active');
    event.target.parentElement.classList.add('current', 'active');
    this.index = parseInt(event.target.dataset.index, 0);
    this.renderItems().then(() => {});
    event.preventDefault();
  }
}

class Config {
  constructor(configJson = {}) {
    this.apiUrl = null;
    if (configJson.api) this.apiUrl = new URL(configJson.api);
  }
}

function requireOne(file) {
  const script = document.createElement('script');
  return new Promise((resolve) => {
    script.onload = resolve;
    script.src = file;
    document.head.appendChild(script);
  });
}

function requireFiles(files) {
  if (typeof files === 'string') return requireOne(files);

  return Promise.all((files).map((file) => requireOne(file)));
}

class App {
  constructor(appFolder = 'app', config = {}) {
    this.config = new Config(config);
    this.appFolder = appFolder;
    this.classReferences = {};
    this.setBootUrl();
    this.setBasePath();
    if (this.config.apiUrl) {
      const link = document.createElement('link');
      link.setAttribute('rel', 'preconnect');
      link.setAttribute('href', this.config.apiUrl);
      this.appendElement(link);
    }
    this.boot()
      .then(() => this.prepareRequest())
      .then(() => this.processRequest());
    window.procyon = this;
  }

  static get currentURL() {
    return new URL(window.location.href);
  }

  static get rootElement() {
    return document.querySelector('#app');
  }

  static param(name) {
    const url = new URL(window.location);
    return url.searchParams.get(name);
  }

  async boot() {
    await this.constructor.loadLib();
    this.route = new Router();
    await this.route.whenReady();
  }

  async prepareRequest() {
    const resource = this.route.resource();
    await resource.load();
  }

  async processRequest() {
    const resource = this.route.resource();
    const module = await import(`${procyon.subPath()}/${this.appFolder}/controllers/${resource.className()}.js`);
    const ControllerKlass = module.default;
    const controller = new ControllerKlass();
    try {
      controller.performBeforeAction();
      const returnVal = controller.performAction(resource.methodName(), ...this.route.args());
      if (returnVal instanceof Promise) {
        await returnVal;
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(`Procyon: ${e.message}`);
      throw e;
    }
  }

  static async loadLib() {
    await requireFiles([
    ]);
  }

  static reload() {
    window.location.reload();
  }

  basePath() {
    return this.cachedBasePath;
  }

  setBootUrl() {
    this.bootUrl = window.location;
  }

  subPath() {
    const url = new URL(this.bootUrl);
    return url.pathname.split('/').slice(0, -1).join('/');
  }

  setBasePath() {
    const url = this.bootUrl;
    this.cachedBasePath = `${url.protocol}//${url.host}`;
  }

  baseUrl() {
    return new URL(this.basePath());
  }

  pathUrl(path, params = {}) {
    const url = new URL(this.bootUrl.origin + this.bootUrl.pathname);
    url.searchParams.set('path', path);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    return url.href;
  }

  relativeUrl(url) {
    return new URL(`${this.basePath()}/${url}`);
  }

  appUrl(url) {
    return new URL(`${this.basePath()}/${this.appFolder}/${url}`);
  }

  appendClass(className, classDef) {
    this.classReferences[className] = classDef;
  }

  classDef(className) {
    return this.classReferences[className];
  }

  appendElement(el) {
    this.constructor.rootElement.append(el);
  }

  visit(path, params = {}) {
    window.location = this.pathUrl(path, params);
  }

  addStyles(stylePaths) {
    stylePaths.forEach((style) => {
      const styleUrl = this.appUrl(`styles/${style}.css`);
      const cssTag = document.createElement('link');
      cssTag.rel = 'stylesheet';
      cssTag.href = styleUrl.href;
      document.head.append(cssTag);
    });
  }
}

class DataModelError extends Error {
  constructor(model, ...args) {
    super(...args);
  }
}

var dataModelError = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': DataModelError
});

export { App, Controller, DataModel, List, View };
