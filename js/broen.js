var DR = DR || {};
DR.BroenGallery = {};

DR.BroenGallery.config = {
    jsonDataUrl: 'data.json',
    jsonDataTestUrl: 'http://socialbld01.net.dr.dk/broen/test.json',

    votingEnabled: true,
    voteEndpoint: 'Quickpoll/front/vote',

    faces: {
        url: 'img/faces/',
        size: 80
    }
};

var host = document.location.host;
if(host == 'www.dr.dk') {
    DR.BroenGallery.config.jsonDataUrl = '/tjenester/broen2/data.json';
    DR.BroenGallery.config.faces.url   = '/tjenester/broen2/ansigter/';
};DR.BroenGallery.App = (function() {
  App.prototype.isIE = false;

  App.prototype.isMobile = false;

  App.prototype.data = null;

  function App(containerId) {
    this.fetchData();
    this.featureDetect();
    this.container = document.getElementById(containerId);
    this.container.innerHTML = this.html();
    this.homeLink = document.getElementById('broen-home-link');
    this.homeView = new HomeView(this);
    this.personView = new PersonView(this);
    this.initVoting();
    return this;
  }

  App.prototype.start = function() {
    return this.router = new MooRouter(this);
  };

  App.prototype.showHome = function() {
    if (this.homeLink.className.indexOf('hide') === -1) {
      this.homeLink.className += ' hide';
    }
    this.personView.hide();
    return this.homeView.show();
  };

  App.prototype.showPerson = function(slug) {
    this.homeView.hide();
    this.homeLink.className = this.homeLink.className.replace(' hide', '');
    return this.personView.show(this.data[slug]);
  };

  App.prototype.fetchData = function() {
    var dataUrl,
      _this = this;
    dataUrl = DR.BroenGallery.config.jsonDataUrl;
    if (document.location.href.indexOf('testjson') > -1) {
      dataUrl = DR.BroenGallery.config.jsonDataTestUrl;
    }
    return d3.json(dataUrl, function(error, data) {
      _this.data = data;
      return _this.start();
    });
  };

  App.prototype.vote = function(slug) {
    return this.voteMachine.vote(slug);
  };

  App.prototype.featureDetect = function() {
    var features;
    features = document.html.className;
    if (features.indexOf('mobile') !== -1) {
      this.isMobile = true;
    }
    if (features.indexOf('ie7') !== -1) {
      this.isIE = true;
    }
    if (features.indexOf('ie8') !== -1) {
      return this.isIE = true;
    }
  };

  App.prototype.initVoting = function() {
    return this.voteMachine = new DR.BroenGallery.VoteMachine(this);
  };

  App.prototype.html = function() {
    return "<div id=\"broen-gallery\" class=\"section boxed container-green-light\">\n    <h2><a href=\"#home\">Verdächtige</a><a id=\"broen-home-link\" class=\"dr-icon-link-small dr-link-readmore hide\" href=\"#home\">Se alle</a></h2>\n\n    <div id=\"broen-gallery-home\" class=\"hide\">\n        <p class=\"intro-text\">Hier sind die wichtigsten Personen in die Brücke II und ihre Beziehungen zueinander.</p>\n        <div id=\"broen-gallery-home-persons\"></div>\n        <div id=\"broen-gallery-home-popover\" class=\"hide container-green\"></div>\n    </div>\n    \n    <div id=\"broen-gallery-person\">\n        <div id=\"broen-gallery-person-info\"></div>\n        <div id=\"broen-gallery-graph\">\n            <div id=\"broen-gallery-graph-popover\" class=\"hide container-green\"></div>\n        </div>\n    </div>\n</div>";
  };

  return App;

})();

var MooRouter;

MooRouter = (function() {
  function MooRouter(app) {
    var router,
      _this = this;
    this.app = app;
    router = Router.implement({
      routes: {
        '': 'homeRoute',
        '#:slug': 'personRoute'
      },
      homeRoute: function() {
        return _this.app.showHome();
      },
      personRoute: function() {
        return this.showPerson(this.param.slug);
      },
      showPerson: function(slug) {
        var offset;
        if (slug === 'home') {
          return _this.app.showHome();
        }
        if (_this.app.isMobile) {
          offset = _this.app.container.offsetTop - 10;
          window.scrollTo(0, offset);
        }
        if (_this.app.data[slug]) {
          return _this.app.showPerson(slug);
        } else {
          return alert('Mangler data for ' + slug + '.');
        }
      }
    });
    return new router;
  }

  return MooRouter;

})();

DR.BroenGallery.VoteMachine = (function() {
  VoteMachine.prototype.hasVotedThisWeek = false;

  function VoteMachine(app) {
    this.app = app;
    this.cookie = new Hash.Cookie('benzErGud2', {
      duration: 365
    });
    this.currentWeek = this.getWeek(new Date());
    this.hasVotedThisWeek = this.hasVotedThisWeek();
    return this;
  }

  VoteMachine.prototype.hasVotedThisWeek = function() {
    var lastVotedWeek;
    lastVotedWeek = this.cookie.get('week');
    if (!lastVotedWeek || lastVotedWeek !== this.currentWeek) {
      return false;
    } else {
      return true;
    }
  };

  VoteMachine.prototype.vote = function(slug) {
    var req, voteId,
      _this = this;
    if (this.hasVotedThisWeek) {
      return alert('Sie haben in dieser Woche bereits einmal abgestimmt.');
    } else {
      voteId = this.app.data[slug].voteId;
      req = new Request({
        url: DR.BroenGallery.config.voteEndpoint + '?qid=5&aid=' + voteId,
        onSuccess: function() {
          alert('Vielen Dank für Ihre Stimme. Sie können nächste Woche noch einmal abstimmen.');
          _this.cookie.set('week', _this.currentWeek);
          return _this.hasVotedThisWeek = true;
        },
        onFailure: function() {
          return alert('Serverfehler! Es wurde keine Stimme vergeben.');
        }
      });
      return req.send();
    }
  };

  VoteMachine.prototype.getWeek = function(d) {
    var dayDiff, dayNr, jan4, target, weekNr;
    target = new Date(d.valueOf());
    dayNr = (d.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    jan4 = new Date(target.getFullYear(), 0, 4);
    dayDiff = (target - jan4) / 86400000;
    weekNr = 1 + Math.ceil(dayDiff / 7);
    return weekNr;
  };

  return VoteMachine;

})();

/*
todo
dr-widget-swipe-carousel.js fehlt
swipe.js fehlt
usw
http://requirejs.org/docs/faq-advanced.html namepsace benutzen damit couchdb funktioniert
*/


window.log = function(x, y) {
  if (y == null) {
    y = '';
  }
  return console.log(x, y);
};

window.bindEvent = function(el, eventName, eventHandler) {
  if (el.addEventListener) {
    return el.addEventListener(eventName, eventHandler, false);
  } else if (el.attachEvent) {
    return el.attachEvent('on' + eventName, eventHandler);
  }
};

DR.BroenGallery.getImg = function(url, w, h) {
  return "<img src=\"" + (DR.BroenGallery.getResizedImg(url, w, h)) + "\" width=\"" + w + "\" height=\"" + h + "\" />";
};

DR.BroenGallery.getResizedImg = function(url, w, h) {
  return "" + url;
  /*
  host = document.location.host
  
  if host is 'www.dr.dk'
      "http://www.dr.dk/imagescaler/?file=#{url}&w=#{w}&h=#{h}&scaleAfter=crop"
  else
      "imagescaler/?file=#{url}&w=#{w}&h=#{h}&scaleAfter=crop&server=#{host}"
  */

};

DR.BroenGallery.getFaceImg = function(image, size) {
  var url;
  url = DR.BroenGallery.getFaceImgUrl(image);
  if (!size) {
    size = DR.BroenGallery.config.faces.size;
  }
  return DR.BroenGallery.getImg(url, size, size);
};

DR.BroenGallery.getFaceImgUrl = function(image) {
  return DR.BroenGallery.config.faces.url + image;
};

var D3Graph;

D3Graph = (function() {
  D3Graph.prototype.hasBeenInit = false;

  D3Graph.prototype.isD3 = true;

  function D3Graph(app, container) {
    this.app = app;
    this.container = container;
    this.width = container.offsetWidth;
    this.height = container.offsetHeight;
    this.popover = new PopoverView(document.getElementById('broen-gallery-graph-popover'), this.app);
    return this;
  }

  D3Graph.prototype.init = function() {
    if (this.hasBeenInit) {
      d3.select('svg').remove();
    }
    this.initD3();
    this.hasBeenInit = true;
    this.selectedPerson = null;
    return this.popover.hide();
  };

  D3Graph.prototype.initD3 = function() {
    this.svg = d3.select(this.container).append('svg:svg').attr('width', this.width).attr('height', this.height);
    this.force = d3.layout.force().linkDistance(40).distance(130).charge(-1000).size([this.width, this.height]);
    this.nodes = this.force.nodes();
    return this.links = this.force.links();
  };

  D3Graph.prototype.show = function(person) {
    var centerNode, i, node, nodes, r, _i, _j, _len, _len1, _ref;
    this.init();
    _ref = person.relations;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      r = _ref[i];
      r.image = this.app.data[r.slug].image;
      this.links.push({
        'source': i + 1,
        'target': 0
      });
    }
    centerNode = {
      'name': person.name,
      'slug': person.slug,
      'image': person.image,
      'isCenter': true
    };
    nodes = [centerNode].concat(person.relations);
    for (_j = 0, _len1 = nodes.length; _j < _len1; _j++) {
      node = nodes[_j];
      this.nodes.push(node);
    }
    return this.update();
  };

  D3Graph.prototype.update = function() {
    var link, node, nodeEnter,
      _this = this;
    link = this.svg.selectAll('line.link').data(this.links);
    link.enter().insert('line').attr('class', 'link');
    link.exit().remove();
    node = this.svg.selectAll('g.node').data(this.nodes, function(d) {
      return d.slug;
    });
    nodeEnter = node.enter().append('g').attr('class', function(d) {
      if (d.isCenter) {
        return 'centerNode';
      } else {
        return 'node';
      }
    }).call(this.force.drag);
    nodeEnter.on('click', function(person) {
      if (person.index !== 0) {
        if (!_this.popover.open || person.slug !== _this.popover.person.slug) {
          _this.selectedPerson = person;
          _this.popover.updatePos(person.x + 30, person.y + 30);
          return _this.popover.show(person);
        } else {
          return _this.popover.hide();
        }
      }
    });
    nodeEnter.append('image').attr('xlink:href', function(d) {
      var size;
      size = 60;
      if (d.isCenter) {
        size = 90;
      }
      return DR.BroenGallery.getResizedImg(DR.BroenGallery.getFaceImgUrl(d.image), size, size);
    }).attr('x', function(d) {
      if (d.isCenter) {
        return -45;
      } else {
        return -30;
      }
    }).attr('y', function(d) {
      if (d.isCenter) {
        return -45;
      } else {
        return -30;
      }
    }).attr('width', function(d) {
      if (d.isCenter) {
        return 90;
      } else {
        return 60;
      }
    }).attr('height', function(d) {
      if (d.isCenter) {
        return 90;
      } else {
        return 60;
      }
    });
    node.append('text').attr('x', -20).attr('y', function(d) {
      if (d.isCenter) {
        return 5;
      } else {
        return 0;
      }
    }).attr('dy', '3.35em').text(function(d) {
      return d.name;
    });
    node.exit().remove();
    this.force.on('tick', function() {
      if (_this.selectedPerson) {
        _this.popover.updatePos(_this.selectedPerson.x + 20, _this.selectedPerson.y + 20);
      }
      link.attr('x1', function(d) {
        return d.source.x;
      }).attr('y1', function(d) {
        return d.source.y;
      }).attr('x2', function(d) {
        return d.target.x;
      }).attr('y2', function(d) {
        return d.target.y;
      });
      return node.attr('transform', function(d) {
        return 'translate(' + d.x + ',' + d.y + ')';
      });
    });
    return this.force.start();
  };

  return D3Graph;

})();

var HomeView;

HomeView = (function() {
  HomeView.prototype.hasBeenShow = false;

  function HomeView(app) {
    this.app = app;
    this.el = document.getElementById('broen-gallery-home');
    this.personsEl = document.getElementById('broen-gallery-home-persons');
    this.popover = new SimplePopoverView(document.getElementById('broen-gallery-home-popover'));
    if (!this.app.isMobile) {
      this.addEvents();
    }
    return this;
  }

  HomeView.prototype.addEvents = function() {
    var _this = this;
    return bindEvent(this.el, 'mouseover', function(e) {
      var parent, slug, target;
      target = e.target ? e.target : window.event.srcElement;
      if (target.tagName.toLowerCase() === 'img') {
        parent = target.parentNode;
        slug = parent.getAttribute('data-person-slug');
        if (!_this.popover.open || slug !== _this.popover.person.slug) {
          if (_this.app.isMobile) {
            _this.popover.updatePos(parent.offsetLeft + 40, parent.offsetTop + 40);
          } else {
            _this.popover.updatePos(parent.offsetLeft + 55, parent.offsetTop + 55);
          }
          return _this.popover.show(_this.app.data[slug]);
        }
      } else if (target === _this.personsEl) {
        return _this.popover.hide();
      }
    });
  };

  HomeView.prototype.render = function() {
    var person, slug, _ref;
    _ref = this.app.data;
    for (slug in _ref) {
      person = _ref[slug];
      this.personsEl.innerHTML += this.personHTML(slug, person);
    }
    return this.hasBeenShow = true;
  };

  HomeView.prototype.show = function() {
    if (!this.hasBeenShow) {
      this.render();
    }
    return this.el.className = '';
  };

  HomeView.prototype.hide = function() {
    this.el.className = 'hide';
    return this.popover.hide();
  };

  HomeView.prototype.personHTML = function(slug, person) {
    return "<a href=\"#" + slug + "\" data-person-slug=\"" + slug + "\" class=\"person\">\n    " + (DR.BroenGallery.getFaceImg(person.image)) + "\n</a>";
  };

  return HomeView;

})();

var MediaView;

MediaView = (function() {
  MediaView.prototype.hasBeenOpened = false;

  function MediaView(name, media, isMobile) {
    this.name = name;
    this.media = media;
    this.isMobile = isMobile;
    this.el = document.createElement('div');
    this.el.setAttribute('id', 'broen-gallery-person-media');
    this.el.innerHTML = this.html();
    this.addEvents();
    return this.el;
  }

  MediaView.prototype.addEvents = function() {
    var _this = this;
    return bindEvent(this.el, 'click', function(e) {
      var index, target;
      target = e.target ? e.target : window.event.srcElement;
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }
      if (target.tagName.toLowerCase() === 'img') {
        if (!_this.hasBeenOpened) {
          _this.initSlider();
        }
        target = $(target);
        if (target.getParent().hasClass('image-wrap')) {
          target = target.getParent();
        }
        index = target.getParent().getChildren().indexOf(target);
        return _this.openSlider(index);
      } else if (target.className === 'dr-link-readmore dr-icon-close') {
        return _this.closeSlider();
      }
    });
  };

  MediaView.prototype.initSlider = function() {
    this.slider = document.getElementById('broen-gallery-person-media-slider');
    return this.slider.innerHTML = this.getSliderHTML();
  };

  MediaView.prototype.openSlider = function(index) {
    var el,
      _this = this;
    this.slider.className = '';
    if (this.isMobile) {
      document.body.className = 'broen';
    }
    if (!this.hasBeenOpened) {
      el = $('broen-gallery-swipe-carousel');
      require(["js/libs/dr-widget-swipe-carousel"], function(Swipe) {
        _this.swipe = new Swipe(el, {
          startSlide: index
        });
        window.fireEvent('dr-dom-inserted', [$$('span.image-wrap')]);
        return window.fireEvent('dr-dom-inserted', [$$('div.dr-widget-video-player')]);
      });
    } else {
      this.swipe.slide(index);
    }
    return this.hasBeenOpened = true;
  };

  MediaView.prototype.closeSlider = function() {
    this.slider.className = 'hide';
    if (this.isMobile) {
      return document.body.className = '';
    }
  };

  MediaView.prototype.html = function() {
    var html, media, _i, _len, _ref;
    html = '<div>';
    _ref = this.media;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      media = _ref[_i];
      if (media.type === 'image') {
        html += "" + (DR.BroenGallery.getImg(media.url, 79, 79));
      } else if (media.type === 'video') {
        html += "<span class=\"image-wrap dr-icon-play-boxed-small\">\n    " + (DR.BroenGallery.getImg(media.image, 79, 79)) + "\n</span>";
      }
    }
    return html + "</div><div id=\"broen-gallery-person-media-slider\" class=\"hide\"></div>";
  };

  MediaView.prototype.getSliderHTML = function() {
    var html, media, _i, _len, _ref;
    html = "<div class=\"section boxed\">\n<h3>" + this.name + " - billeder/video<a href=\"#\" class=\"dr-link-readmore dr-icon-close\">Luk</a></h3>\n<div id=\"broen-gallery-swipe-carousel\" class=\"dr-widget-swipe-carousel\" data-min-item-span=\"8\">";
    _ref = this.media;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      media = _ref[_i];
      if (media.type === 'image') {
        html += "<div class=\"carousel-item\">\n    <div class=\"item\">\n        <span role=\"presentation\" aria-hidden=\"true\" class=\"image-wrap ratio-16-9\">\n            <noscript data-src=\"" + media.url + "\" data-width=\"0\" data-height=\"0\">\n                <img src=\"" + media.url + "\" alt=\"\" width=\"0\" height=\"0\" role=\"presentation\" aria-hidden=\"true\" />\n            </noscript>\n        </span>\n    </div>\n</div>";
      } else if (media.type === 'video') {
        html += "<div class=\"carousel-item video\">\n    <div class=\"item\">\n        <div class=\"dr-widget-video-player ratio-16-9\" data-resource=\"http://www.dr.dk/handlers/GetResource.ashx?id=" + media.resourceId + "\" data-image=\"" + media.image + "\"></div>\n    </div>\n</div>";
      }
    }
    return html + "</div></div>";
  };

  return MediaView;

})();

var MobileGraph;

MobileGraph = (function() {
  function MobileGraph(app, container) {
    this.app = app;
    this.container = container;
  }

  MobileGraph.prototype.show = function(person) {
    this.person = person;
    return this.container.innerHTML = this.html(person);
  };

  MobileGraph.prototype.html = function(person) {
    var faceImg, html, relation, _i, _len, _ref;
    faceImg = DR.BroenGallery.getFaceImg(person.slug);
    html = "<div class=\"section\">\n    <h2>Relationer</h2>\n    <ul>";
    _ref = person.relations;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      relation = _ref[_i];
      html += this.relationHtml(relation);
    }
    html += "</ul></div>";
    return html;
  };

  MobileGraph.prototype.relationHtml = function(relation) {
    var faceImg;
    faceImg = this.app.data[relation.slug].image;
    return "<li>\n    " + (DR.BroenGallery.getFaceImg(faceImg, 50)) + "\n    <a href=\"#" + relation.slug + "\" class=\"name\">" + relation.name + "</a>\n    <p>" + relation.text + "</p>\n    <a href=\"#" + relation.slug + "\" title=\"Se mere om " + relation.name + "\" class=\"dr-icon-link-small dr-link-readmore\">Se mere</a>\n</li>";
  };

  return MobileGraph;

})();

var PersonView;

PersonView = (function() {
  function PersonView(app) {
    this.app = app;
    this.el = document.getElementById('broen-gallery-person');
    this.info = new PersonInfoView(this.app, document.getElementById('broen-gallery-person-info'));
    if (this.app.isMobile || this.app.isIE) {
      this.graph = new MobileGraph(app, document.getElementById('broen-gallery-graph'));
      this.app.container.className += ' mobile';
    } else {
      this.graph = new D3Graph(app, this.el.getElementById('broen-gallery-graph'));
    }
    this.hide();
    return this;
  }

  PersonView.prototype.hide = function() {
    this.el.className = 'hide';
    if (this.graph.isD3) {
      return this.graph.popover.hide();
    }
  };

  PersonView.prototype.show = function(person) {
    this.el.className = '';
    this.info.show(person);
    return this.graph.show(person);
  };

  return PersonView;

})();

var PersonInfoView;

PersonInfoView = (function() {
  function PersonInfoView(app, container) {
    this.app = app;
    this.container = container;
    this.addEvents();
  }

  PersonInfoView.prototype.addEvents = function() {
    var _this = this;
    return bindEvent(this.container, 'click', function(e) {
      var target;
      target = e.target ? e.target : window.event.srcElement;
      if (target.className === 'vote-btn') {
        if (e.preventDefault) {
          e.preventDefault();
        } else {
          e.returnValue = false;
        }
        return _this.app.vote(_this.person.slug);
      }
    });
  };

  PersonInfoView.prototype.show = function(person) {
    var inner, p;
    this.person = person;
    this.container.innerHTML = this.html(person);
    p = document.getElementById('broen-gallery-person-text');
    window.fireEvent('dr-dom-inserted', [$$('p')]);
    if (person.media && person.media.length > 0) {
      inner = document.getElementById('broen-gallery-person-info-inner');
      return inner.appendChild(new MediaView(person.name, person.media, this.app.isMobile));
    }
  };

  PersonInfoView.prototype.html = function(person) {
    var html;
    html = "<div id=\"broen-gallery-person-info-inner\">\n    " + (DR.BroenGallery.getFaceImg(person.image, 50)) + "\n    <h2>" + person.name + "</h2>\n    <p id=\"broen-gallery-person-text\" data-maxlines=\"5\" data-readmore=\"true\" >" + person.longText + "</p>";
    if (DR.BroenGallery.config.votingEnabled) {
      html += "<div class=\"vote\">Tror du " + person.name + " er involveret i forbrydelserne?<br /><button class=\"vote-btn\">ja!</button></div>";
    }
    return html + "</div>";
  };

  return PersonInfoView;

})();

var PopoverView;

PopoverView = (function() {
  PopoverView.prototype.open = false;

  function PopoverView(el, app) {
    this.el = el;
    this.app = app;
    this.addEvents();
    return this;
  }

  PopoverView.prototype.addEvents = function() {
    var _this = this;
    return bindEvent(this.el, 'click', function(e) {
      var target;
      target = e.target ? e.target : window.event.srcElement;
      if (e.target.className === 'dr-link-readmore dr-icon-close') {
        if (e.preventDefault) {
          e.preventDefault();
        } else {
          e.returnValue = false;
        }
        return _this.hide();
      } else if (e.target.className === 'vote-btn') {
        if (e.preventDefault) {
          e.preventDefault();
        } else {
          e.returnValue = false;
        }
        return _this.app.vote(_this.person.slug);
      }
    });
  };

  PopoverView.prototype.updatePos = function(x, y) {
    this.el.style.left = x + 'px';
    return this.el.style.top = y + 'px';
  };

  PopoverView.prototype.center = function() {
    this.el.style.left = '50%';
    this.el.style["margin-left"] = '-100px';
    return this.el.style.top = '50%';
  };

  PopoverView.prototype.show = function(person) {
    this.person = person;
    this.el.innerHTML = this.html(this.person);
    this.el.className = '';
    return this.open = true;
  };

  PopoverView.prototype.hide = function() {
    this.el.className = 'hide';
    return this.open = false;
  };

  PopoverView.prototype.html = function(person) {
    var html;
    html = "<h3><a href=\"#\" class=\"dr-link-readmore dr-icon-close\"></a><a href=\"#" + person.slug + "\">" + person.name + "</a></h3>\n<p>" + person.text + "</p>\n<a class=\"dr-icon-link-small dr-link-readmore\" href=\"#" + person.slug + "\">Se mere</a>";
    if (DR.BroenGallery.config.votingEnabled) {
      html += "   \n<div class=\"vote\">\n    <p>Er " + person.name + "<br /> involveret?</p>\n    <button class=\"vote-btn\">ja!</button>\n</div>";
    }
    return html;
  };

  return PopoverView;

})();

var SimplePopoverView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

SimplePopoverView = (function(_super) {
  __extends(SimplePopoverView, _super);

  function SimplePopoverView() {
    _ref = SimplePopoverView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  SimplePopoverView.prototype.html = function(person) {
    return "<h3><a href=\"#" + person.slug + "\">" + person.name + "</a></h3>\n<p>" + person.text + "</p>";
  };

  return SimplePopoverView;

})(PopoverView);
