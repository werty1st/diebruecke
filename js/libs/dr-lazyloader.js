/**
Loads images as they become visible in the viewport.
Uses the two custom events `dr-dom-inserted` and `dr-css-changed` to
Exposes 2 custom events on the window object that can be used when toggling hidden content visible;
"dr-lazyloader-check" should be used for content that has already been displayed and "dr-lazyloader-update" should be used for content that hasn't been displayed yet.
Note: Placeholder images are styled through base.css (lazyloader.less) - depends on document.documentElement (html) to have a "js" class.

@module dr-lazyloader
@function lazyloader
@param {element} element Optional. The element that contains the images to be lazy loaded. Defaults to document.body.
@example

Uses the following html-structure:

<a href="#" class="image-wrap ratio-16-9" >
<noscript data-src="my-source-image.jpg" data-alt="An image of me" width="1600" height="900">
<img src="my-prescaled-image.jpg" alt="An image of me" width="620" height="349">
</noscript>
</a>

Or (soon to be deprecated):

<a href="#" class="image-wrap">
<img src="/assets/img/ratio-16-9.gif" data-src="my-image.jpg" width="640" height="360" alt="An image of me"/>
<noscript><img src="my-image.jpg" alt="An image of me"></noscript>
</a>

Used stand-alone like this:

require(["dr-lazyloader"], function (lazyloader) {
var container = document.getElement("div.container");
lazyloader(container);
});

**/

/*
lazyloader:
loads modules as they come into view.

module:
selector:
load:

types: image, flash, iframe, app, widget etc

*/

define("dr-lazyloader", function () {

	var lazyloader = (function (win, doc) {

		var images = new Elements(),
			active = false,
			buffer = 800,
			breakpoint = 0,
			devicePixelRatio = ("devicePixelRatio" in win) ? win.devicePixelRatio : 1,
			quality = 0,
			body = document.id(document.body),
			html = doc.documentElement,
			viewportHeight = null,
			viewportOffsetObject = html,
			viewportOffsetProp = "scrollTop",
			viewportHeightObject = html,
			viewportHeightProp = "clientHeight",
			location = win.location,
			isDrdk = (location.hostname === "www.dr.dk" || location.hostname === "beta.dr.dk" || location.hostname === "stage.dr.dk"),
			isLocalhost = (location.hostname === "localhost"),
			isExcludedpath = false,
			scaler = (isDrdk) ? "//asset.dr.dk/imagescaler/" : "//wcf/imagescaler/",
			ratios = {
				"ratio-16-9": 0.5625,
				"ratio-4-3": 0.75,
				"ratio-1-1": 1,
				"ratio-3-4": 1.25
			};

		// higher pixel density allows for
		// larger images at lower quality for roughly the same weight
		quality = (function (p) {
			var value = 0,
				max = 90,
				min = 50,
				range = max - min;

			if (p >= 2) {
				value = min;
			}
			else if (p > 1 && p < 2) {
			    value = min + Math.round((1 - p + 1) * range);
			}

			return value;
		} (devicePixelRatio));

		if ("pageYOffset" in win) {
			viewportOffsetProp = "pageYOffset";
			viewportOffsetObject = win;
		}

		if ("innerHeight" in win) {
			viewportHeightProp = "innerHeight";
			viewportHeightObject = win;
		}

		function getViewportHeight() {
			viewportHeight = viewportHeightObject[viewportHeightProp];
		}

		function getViewport() {
			var top = viewportOffsetObject[viewportOffsetProp];

			return {
				top: top,
				bottom: top + viewportHeight
			};
		}

		function check(bottom) {
			var count = images.length;

			if (!count) {
				stop();
			}
			else {
				var viewport = getViewport(),
					inview = [],
					top = viewport.top - buffer,
					image, _top, _bottom;


				bottom = bottom || (viewport.bottom + buffer);

				for (var i = 0; i < count; i++) {
					image = images[i];
					if (image) {
						_top = image.top;
						_bottom = image.bottom;
						if ((_top < bottom && _top > top) || (_bottom > top && _bottom < bottom)) {
							inview.push(image);
						}
					}
				}

				count = inview.length;
				for (var i = 0; i < count; i++) {
					replace(inview[i]);
				}

			}
		}

		function replace(image) {

			var dataElement = (image.type === "image") ? image : image.getElement("noscript"),
				src = dataElement.get("data-src"),
				properties = {
					"aria-hidden": "true",
					"role": "presentation"
				};

			if (src) {
				var queryAdd = {};
				dataElement.set("data-src", "");

				var alt;

				if (image.type === "image") {
					alt = image.alt;
					if (image.alt) {
						properties.alt = image.alt;
					}
					properties["class"] = "lazy-offset";
				}
				else {
					alt = dataElement.get("data-alt");
				}

				var scaleAfter;
				if (dataElement.get("data-scale-after") != undefined) {
					scaleAfter = dataElement.get("data-scale-after");
					Object.append(queryAdd, { scaleAfter: scaleAfter });
					if (scaleAfter == "ratio") {
						var imageRatio = dataElement.get("data-ratio");
						Object.append(queryAdd, { ratio: imageRatio });
					}
				}

				properties.alt = alt || "";

				if ("static" in image) {
					properties.width = image.getAttribute("width");
					properties.height = image.getAttribute("height");
				}
				else {

					// if src is _not_ an absolute path on localhost _or_ the path is _not_ excluded - then scale images
					if (!((src.match(/^\/[^\/]/) && isLocalhost) || isExcludedpath) || (isLocalhost && src.match(/^\/(?:nr|mu)\//i))) {

						var width = image.offsetWidth,
							height = image.offsetHeight,
							ratio = image.className.match(/ratio-(\d+)-(\d+)/);

						if (image.type === "noscript") {
							width -= image.getStyle("padding-right").toInt() + image.getStyle("padding-left").toInt();
						}

						if (ratio) {
							ratio = (ratio[0] in ratios) ? ratios[ratio[0]] : ratio[2] / ratio[1];
							height = width * ratio;
						}

						width = Math.round(width * devicePixelRatio),
						height = Math.round(height * devicePixelRatio);

						var widthReg = /((\?|(&(amp;)?))w(idth)?=)\d+/,
							heightReg = /((\?|(&(amp;)?))h(eight)?=)\d+/,
							isScaled = src.replace(widthReg, "").replace(heightReg, "") != src;

						// if the url already has parameters for height/width
						// it's already passed through an imagescaler
						if (isScaled) {
							src = src.replace(widthReg, "$1" + width).replace(heightReg, "$1" + height);
						}
						// url doesn't have height/width parameters - pass it through an imagescaler
						else {

							var server = src.match(/^https?:\/\/([^\/]+)/),
								query = {
									file: src,
									w: width,
									h: height,
									scaleAfter: "crop" // loose this bit when imagescaler is done
								};

							Object.append(query, queryAdd); // Adding customized query parameters.

							if (quality) {
								query.quality = quality;
							}

							// extract contentType from url
							var contentType = src.match(/contenttype=([^&=]+)/i);

							if (contentType) {
								query.contenttype = contentType[1];
							}

							if (server) {
								query.file = query.file.slice(server[0].length);
								query.server = server[1];
							}
							else if (!isDrdk) {
								query.server = (src.match(/^\/(?:nr|mu)\//i) && isLocalhost) ? "www.dr.dk" : location.host;
							}

							// NOTE beta.dr.dk used to test PsdbWebFront for new radio pages; added 2013-10-08 by DREXMOME, may be removed when beta-site no longer in use
							if (query.server && query.server.match(/^(cmsred|webcms|beta\.dr\.dk)/)) { // removed due to popular demand /(^(cmsred|webcms))|(\.net\.dr\.dk$)/
								query.server = "www.dr.dk";
							}

							var imagescaled = scaler + "?" + Object.toQueryString(query);

							src = imagescaled;
						}
					}
				}

				function callback(img) {
					images.erase(image);
					if (image.type === "image") {
						img.inject(image, "after");
						image.destroy();
						img.removeClass("lazy-offset");
					}
					else {
						img.inject(image, "top");

						image.className = image.className.replace(/ratio-(\d+)-(\d+)/g, "");
					}
				}

				function onerror() {
					image.addClass("lazy-broken");
				}

				loadImage(src, callback, onerror, properties);
			}
		}

		function stop() {
			if (active) {
				win.removeEvent("dr-css-changed", updateAndCheck);
				win.removeEvent("scroll", check);
				win.removeEvent("resize", updateAndCheck);
			}
		}

		function updatePositions(_images) {
			_images = _images || images;
			var l = _images.length,
				image;
			for (var i = 0; i < l; i++) {
				image = _images[i];
				var height = image.offsetHeight;

				if (height) {
					var pos = image.getPosition();
					image.top = pos.y;
					image.bottom = image.top + height;
				}
			}
		}

		function updateAndCheck() {
			getViewportHeight();
			updatePositions();
			check();
		}

		function loadImage(src, callback, onerror, options) {
			var completed,
				img = new Element("img", options || {});
			img.onload = onload;
			img.onerror = function (e) {
				e = e || win.event;
				if (onerror) {
					onerror(img);
				}
				if (window.console) {
					console.log("error", e, src);
				}
			};
			img.src = src;
			if (img.complete) {
				onload();
			}
			function onload() {
				if (!completed) {
					completed = true;
					if (callback) {
						callback(img);
					}
				}
			}
		}

		// re-update positions onload due to webfonts (default fonts have different metrics)
		win.addEvent("load", function () {
			updateAndCheck.delay(100);
		});

		win.addEvent("dr-dom-inserted", function (elements) {
			elements.each(init);
		});

		function handleScrollable(element) {
			var imageData = getImages(element);
			element.addEvent("scroll", function () {
				updatePositions(imageData.images);
				check();
			});
		};

		function getElements(el, selector) {
			return el.querySelectorAll ? new Elements(el.querySelectorAll(selector)) : el.getElements(selector);
		}

		function getImages(element) {
			var placeholders = {},
				_images = new Elements(),
				elements = getElements(element || doc, ".image-wrap > img[data-src], .image-wrap > noscript[data-src]");

			elements.each(function (image) {
				var type = (image.get("tag") === "img") ? "image" : "noscript";
				if (type === "noscript") {
					image = image.getParent();
				}
				if (images.indexOf(image) < 0) {
					image.type = type;
					// oldschool placeholder img
					if (image.type === "image") {
						var src = image.src;
						if (src) {
							if (src.match(/ratio-none/)) {
								image["static"] = true;
							}
							if (!(src in placeholders)) {
								placeholders[src] = [];
							}
							placeholders[src].push(image);
						}
					}
					images.push(image);
				}
				_images.push(image);
			});

			return {
				placeholders: placeholders,
				images: _images
			};
		}

		function init(element) {
			element = element || document.id(document.body);
			var hasPlaceholders = false,
				placeholders = {},
				scrollables = (element.hasClass("dr-lazyloader-scroll")) ? [element] : element.getElements(".dr-lazyloader-scroll");

			scrollables.each(handleScrollable);

			var imageData = getImages(element);

			if (imageData.images.length) {

				if (imageData.placeholders) {
					Object.extend(placeholders, imageData.placeholders);
				}

				for (var k in placeholders) {
					hasPlaceholders = true;
					break;
				}

				// for clients that do not support lazyloading
				if (window.operamini) {
					if (hasPlaceholders) {
						Object.each(placeholders, function (_images, src) {
							loadImage(src, function () {
								updatePositions(_images);
								_images.each(replace);
							});
						});
					}
					else {
						updatePositions(images);
						images.each(replace);
					}
				}
				else {

					if (hasPlaceholders) {
						Object.each(placeholders, function (_images, src) {
							loadImage(src, function () {
								updatePositions(_images);
							});
						});
					}

					if (!active) {
						active = true;
						win.addEvent("dr-css-changed", updateAndCheck);
						win.addEvent("scroll", check);
						win.addEvent("resize", updateAndCheck);
					}

					(function () {
						getViewportHeight();
						updatePositions(imageData.images);
						check();
					}).delay(0);

				}
			}
		};

		return init;

	} (window, document));

	if (!window.DR) {
		window.DR = {};
	}

	DR.Lazyloader = lazyloader;

	return lazyloader;

});
