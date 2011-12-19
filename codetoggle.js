if(typeof NodeList !== "undefined" && typeof HTMLElement !== "undefined" && 
		document.querySelector && document.querySelectorAll && window.addEventListener) {
	
	if (!Function.prototype.bind) {
		Function.prototype.bind = function (oThis) {
			// closest thing possible to the ECMAScript 5 internal IsCallable
			// function 
			if (typeof this !== "function") {
				throw new TypeError("Function.prototype.bind - what is trying to be fBound is not callable");
			}

	    	var aArgs = Array.prototype.slice.call(arguments, 1),
	        	fToBind = this,
	        	fNOP = function () {},
	        	fBound = function () {
	          				return fToBind.apply( this instanceof fNOP ? this : oThis || window,
	                 			aArgs.concat(Array.prototype.slice.call(arguments)));
	        			 };

	    	fNOP.prototype = this.prototype;
	    	fBound.prototype = new fNOP();

	    	return fBound;
		};
	}

	NodeList.prototype.forEach = function(fun) {
		if (typeof fun !== "function") throw new TypeError();
		for (var i = 0; i < this.length; i++) {
			fun.call(this, this[i]);
		}
	};

	HTMLElement.prototype.$ = function HTMLElement_$(aQuery) {
		return this.querySelector(aQuery);
	};

	HTMLElement.prototype.$$ = function HTMLElement_$$(aQuery) {
		return this.querySelectorAll(aQuery);
	};

	HTMLElement.prototype.set = function HTMLElement_set(flag) {
		flag = flag || 'aria-selected';
		this.setAttribute(flag, true);
	};

	HTMLElement.prototype.unset = function HTMLElement_unset(flag) {
		flag = flag || 'aria-selected';
		this.removeAttribute(flag);
	};

	var $ = (HTMLElement.prototype.$).bind(document);
	var $$ = (HTMLElement.prototype.$$).bind(document);

	function createCookie(name,value,days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
		}
		else var expires = "";
		document.cookie = name+"="+value+expires+"; path=/";
	}

	function readCookie(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	}

	function eraseCookie(name) {
		createCookie(name,"",-1);
	}

	function getLocationHash(prefix) {
		return location.hash && location.hash.substr(0, prefix.length) == prefix ? location.hash.substr(prefix.length) : false;
	}
	
	window.addEventListener("hashchange", function() {
		var hashsection = getLocationHash("#toggleview:id=");

		if(hashsection) {
			$$("div.toggleview").forEach(function(node) {
				if(node.$(".section[data-id=" + hashsection + "]")) {
					node.$("a[aria-selected]").unset();
					node.$(".section[aria-selected]").unset();

					node.$(".section[data-id=" + hashsection + "]").set();
					node.$("div.hlselectors a[data-id=" + hashsection + "]").set();
				}
			});
		}
	});

	window.addEventListener("load", function() {
		var cookiesection = readCookie("toggleview");
		var hashsection = getLocationHash("#toggleview:id=");
		var enable_syntax_highlighter = false;

		$$("div.toggleview").forEach(function(node) {
			enable_syntax_highlighter = true;
			node.className += " init";

			var links = document.createElement("div");
			links.className = "hlselectors";

			node.insertBefore(links, node.firstChild);

			node.$$(".section").forEach(function(span) {
				var anchor = document.createElement("a");
				anchor.href = "#toggleview:id=" + span.getAttribute("data-id");
				anchor.innerHTML = span.getAttribute("data-title");
				anchor.setAttribute("data-id", span.getAttribute("data-id"));

				anchor.addEventListener("click", function toggle_view_section(e) {
					var el = e.target;
					var id = el.getAttribute("data-id");

					el.parentNode.$("a[aria-selected]").unset();
					el.set();

					var parent = el.parentNode.parentNode;

					parent.$(".section[aria-selected]").unset();

					parent.$(".section[data-id=" + id + "]").set();

					createCookie("toggleview", id, 365);
				});

				links.appendChild(anchor);
			});


			if(hashsection && node.$(".section[data-id=" + hashsection + "]")) {
				node.$(".section[data-id=" + hashsection + "]").set();
				node.$("div.hlselectors a[data-id=" + hashsection + "]").set();
			} else if(cookiesection && node.$(".section[data-id=" + cookiesection + "]")) {
				node.$(".section[data-id=" + cookiesection + "]").set();
				node.$("div.hlselectors a[data-id=" + cookiesection + "]").set();
			} else {
				node.$(".section:nth-of-type(1)").set();
				node.$("div.hlselectors a:nth-of-type(1)").set();
			}
		});
		
		if(enable_syntax_highlighter && SyntaxHighlighter) {
			function SyntaxHighlighter_path() {
				var result = [];
				for(var i = 0; i < arguments.length; i++) {
					result.push(arguments[i].replace('@', Drupal.settings.codetoggle.library_base_path));
				}
				return result
			}

			SyntaxHighlighter.autoloader.apply(null, SyntaxHighlighter_path(
			  'applescript            @shBrushAppleScript.js',
			  'actionscript3 as3      @shBrushAS3.js',
			  'bash shell             @shBrushBash.js',
			  'coldfusion cf          @shBrushColdFusion.js',
			  'cpp c                  @shBrushCpp.js',
			  'c# c-sharp csharp      @shBrushCSharp.js',
			  'css                    @shBrushCss.js',
			  'delphi pascal          @shBrushDelphi.js',
			  'diff patch pas         @shBrushDiff.js',
			  'erl erlang             @shBrushErlang.js',
			  'groovy                 @shBrushGroovy.js',
			  'java                   @shBrushJava.js',
			  'jfx javafx             @shBrushJavaFX.js',
			  'js jscript javascript  @shBrushJScript.js',
			  'perl pl                @shBrushPerl.js',
			  'php                    @shBrushPhp.js',
			  'text plain             @shBrushPlain.js',
			  'py python              @shBrushPython.js',
			  'ruby rails ror rb      @shBrushRuby.js',
			  'sass scss              @shBrushSass.js',
			  'scala                  @shBrushScala.js',
			  'sql                    @shBrushSql.js',
			  'vb vbnet               @shBrushVb.js',
			  'xml xhtml xslt html    @shBrushXml.js'
			));

			SyntaxHighlighter.defaults['toolbar'] = "false";

			SyntaxHighlighter.all();
		}
	}, true);	
}