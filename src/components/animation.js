import createjs from 'createjs-browserify'

var data_json_url = "http://golem.network/data.json";

var ajax = {};
ajax.x = function() {
if (typeof XMLHttpRequest !== 'undefined') {
    return new XMLHttpRequest();
}
var versions = [
    "MSXML2.XmlHttp.6.0",
    "MSXML2.XmlHttp.5.0",
    "MSXML2.XmlHttp.4.0",
    "MSXML2.XmlHttp.3.0",
    "MSXML2.XmlHttp.2.0",
    "Microsoft.XmlHttp"
];

var xhr;
for (var i = 0; i < versions.length; i++) {
    try {
        xhr = new ActiveXObject(versions[i]);
        break;
    } catch ( e ) {}
}
return xhr;
};

ajax.send = function(url, callback, method, data, async) {
if (async === undefined) {
    async = true;
}
var x = ajax.x();
x.open(method, url, async);
x.onreadystatechange = function() {
    if (x.readyState == 4) {
        callback(x.responseText)
    }
};
if (method == 'POST') {
    x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
}
x.send(data)
};

ajax.get = function(url, data, callback, async) {
var query = [];
for (var key in data) {
    query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
}
ajax.send(url + (query.length ? '?' + query.join('&') : ''), callback, 'GET', null, async)
};

ajax.post = function(url, data, callback, async) {
var query = [];
for (var key in data) {
    query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
}
ajax.send(url, callback, 'POST', query.join('&'), async)
};

window.$ = document.querySelectorAll.bind(document)
window.$.extend = function() {
for (var i = 1; i < arguments.length; i++)
    for (var key in arguments[i])
        if (arguments[i].hasOwnProperty(key))
            arguments[0][key] = arguments[i][key];
return arguments[0];
}
window.$.each = Function.prototype.call.bind(Array.prototype.forEach);
window.$.grep = function(x, y) {
return x.filter(y);
}
window._isMobile = function() {
var _isMobile = /iphone|ipod|android|ie|blackberry|fennec/.test(navigator.userAgent.toLowerCase());
return _isMobile;
};
window.Tangents = window.Tangents || {}, function() {
    function tangent() {
    }
    tangent.prototype.events = {
        resize: function() {
            Tangents.resizeCanvas();
            Tangents.setRatio();
            clearTimeout(Tangents.timeouts.resize);
            Tangents.timeouts.resize = setTimeout(function() {
                Tangents.clearStage(function() {
                    Tangents.addCircles();
                });
            }, Tangents.options.timeouts.resize);
        }
    };
    tangent.prototype.config = function() {
        if (this.stage) {
            if (this.canvas) {
                createjs.Ticker.setFPS(this.options.fps);
                createjs.Touch.enable(this.stage);
                this.stage.enableDOMEvents(true);
                this.stage.enableMouseOver(10);
                createjs.Ticker.addEventListener("tick", this.tick);
                this.canvas.style.backgroundColor = this.options.colors.canvas;
                this.resizeCanvas();
                this.setRatio();
            }
        }
    };
    tangent.prototype.resizeCanvas = function() {
        if (this.canvas) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
    };
    tangent.prototype.setRatio = function() {
        this.ratioX = window.innerWidth / 1680;
        this.ratioY = window.innerHeight / 1050;
        this.ratio = Math.min(this.ratioX, this.ratioY);
    };
    tangent.prototype.initialize = function(options) {
        var prepareScene = this;
        var opts = options || {};
        var defaults = {
            fps: 60,
            colors: {
                canvas: "rgba(0, 0, 0, 0)",
                //colorDark: "rgba(0, 29, 85, 0.9)",
                //colorDarkOpacity: "rgba(0, 29, 85, 0.4)",
                //colorLight: "rgba(1, 211, 224, 0.9)",
                //colorLightOpacity: "rgba(1, 211, 224, 0.4)"
                colorDark: "rgba(0, 0, 0, 0.9)",
                colorDarkOpacity: "rgba(0, 0, 0, 0.4)",
                colorLight: "rgba(255, 255, 255, 0.9)",
                colorLightOpacity: "rgba(255, 255, 255, 0.4)"
            },
            scale: {
                max: 0.1,
                min: 0.15
            },
            fractionalDigits: 5,
            positions: {
                x: {
                    max: 5,
                    min: 5
                },
                y: {
                    max: 5,
                    min: 5
                }
            },
            animationPaused: false,
            easing: createjs.Ease.backInOut,
            speed: 800,
            ratio: 0.2,
            timeouts: {
                resize: 500
            }
        };
        this.options = $.extend(defaults, opts);
        this.timeouts = {
            resize: null
        };
        this.linesCreated = false;
        this.addEvent(window, "resize", "resize");
        this.getStartData("data.json", function() {
            prepareScene.prepareScene();
        });
    };
    tangent.prototype.addEvent = function(listener, element, eventName) {
        listener.addEventListener(element, this.events[eventName]);
    };
    tangent.prototype.removeEvent = function(elem, ev, eventName) {
        elem.off(ev, this.events[eventName]);
    };
    tangent.prototype.getStartData = function(dataAndEvents, $sanitize) {
        var err = this;
        ajax.get(data_json_url, {}, function(resp) {
            err.data = resp;
            $sanitize();
        });
    };
    tangent.prototype.clearStage = function(num) {
        if (this.stage) {
            this.stage.removeAllChildren();
            this.stage.update();
            this.relations = [];
            this.circles = null;
            this.lines = null;
            this.linesCreated = false;
            num();
        }
    };
    tangent.prototype.addCircles = function() {
        if (this.data) {
            var that = this;
            $.each(JSON.parse(this.data), function(item) {
                var shape = new createjs.Shape;
                shape.name = "Circle";
                shape.x = shape._x = item.x * that.ratioX;
                shape.y = shape._y = item.y * that.ratioY;
                shape.radius = shape._radius = item.radius * that.ratio;
                shape.scaleX = shape.scaleY = shape._scale = 1;
                shape.animating = false;
                shape.graphics.beginLinearGradientFill([that.options.colors.colorLightOpacity, that.options.colors.colorDarkOpacity], [1, 0], -shape._radius, 0, shape._radius, 0).setStrokeStyle(0.5).beginStroke(that.options.colors.colorLightOpacity).drawCircle(0, 0, shape._radius);
                that.stage.addChild(shape);
            });
        }
    };
    tangent.prototype.prepareScene = function() {
        var options = this;
        this.relations = [];
        this.canvas = document.getElementById("stage");
        this.stage = new createjs.Stage(this.canvas);
        this.config();
        this.addCircles();
        var step = function() {
            if (options.stage) {
                requestAnimationFrame(step);
                if (options.linesCreated) {
                    $.each(options.circles, function(item) {
                        var self = item;
                        if (!self.animating) {
                            options.animateCircle(self);
                        }
                    });
                } else {
                    options.createLines();
                }
            }
        };
        step();
    };
    tangent.prototype.createLines = function() {
        if (this.stage && !this.linesCreated) {
            var options = this;
            options.linesCreated = true;
            options.circles = $.grep(options.stage.children, function(shape) {
                return "Circle" === shape.name;
            });
            $.each(options.circles, function(item) {
                options.findTangents(item, options.circles);
            });
            options.lines = $.grep(options.stage.children, function(shape) {
                return "Line" === shape.name;
            });
        }
    };
    tangent.prototype.animateCircle = function(tangent) {
        if (tangent) {
            tangent.animating = true;
            var that = this;
            var scale = that.options.ratio * tangent._radius;
            tangent.animationParameters = {
                scale: that.getRandomNumber(-that.options.scale.min, that.options.scale.max, that.options.fractionalDigits),
                x: that.getRandomNumber(-that.options.positions.x.min * scale, that.options.positions.x.max * scale, that.options.fractionalDigits),
                y: that.getRandomNumber(-that.options.positions.y.min * scale, that.options.positions.x.min * scale, that.options.fractionalDigits)
            };
            tangent.animation = createjs.Tween.get(tangent, {
                override: true
            }).to({
                x: tangent._x + tangent.animationParameters.x,
                y: tangent._y + tangent.animationParameters.y,
                radius: tangent._radius + tangent._radius * tangent.animationParameters.scale,
                scaleX: tangent._scale + tangent.animationParameters.scale,
                scaleY: tangent._scale + tangent.animationParameters.scale
            }, scale * that.options.speed, that.options.easing).call(function() {
                tangent.animation = createjs.Tween.get(tangent, {
                    override: true
                }).to({
                    x: tangent._x - tangent.animationParameters.x,
                    y: tangent._y - tangent.animationParameters.y,
                    radius: tangent._radius - tangent._radius * tangent.animationParameters.scale,
                    scaleX: tangent._scale - tangent.animationParameters.scale,
                    scaleY: tangent._scale - tangent.animationParameters.scale
                }, scale * that.options.speed, that.options.easing).call(that.tweenComplete);
            });
            if (that.options.animationPaused) {
                tangent.animation.setPaused(true);
            }
        }
    };
    tangent.prototype.pauseAnimation = function() {
        if (this.circles) {
            $.each(this.circles, function() {
                this.animation.setPaused(true);
            });
        }
    };
    tangent.prototype.resumeAnimation = function() {
        if (this.circles) {
            $.each(this.circles, function() {
                this.animation.setPaused(false);
            });
        }
    };
    tangent.prototype.tweenComplete = function(tangent) {
        if (tangent.target) {
            tangent.target.animating = false;
        }
    };
    tangent.prototype.getRandomNumber = function(min, max, doubleQuotedValue) {
        if (min && max) {
            var value = doubleQuotedValue || 0;
            return 0 == value ? parseInt((Math.random() * (max - min) + min).toFixed(value)) : parseFloat((Math.random() * (max - min) + min).toFixed(value));
        }
    };
    tangent.prototype.getTangents = function(p2x, x2, v11, p1x, x1, c2) {
        if (p2x && (x2 && (v11 && (p1x && (x1 && c2))))) {
            var elem = this;
            var val = parseFloat(((p2x - p1x) * (p2x - p1x) + (x2 - x1) * (x2 - x1)).toFixed(elem.options.fractionalDigits));
            var min = parseFloat(Math.sqrt(val));
            var t = parseFloat(((p1x - p2x) / min).toFixed(elem.options.fractionalDigits));
            var g = parseFloat(((x1 - x2) / min).toFixed(elem.options.fractionalDigits));
            var c = [];
            var eventName = 0;
            var c1 = 1;
            for (; c1 >= -1; c1 -= 2) {
                var r = parseFloat(((v11 - c1 * c2) / min).toFixed(elem.options.fractionalDigits));
                var docHeight = parseFloat((r * r).toFixed(elem.options.fractionalDigits));
                var z = parseFloat(Math.sqrt(Math.max(0, 1 - docHeight)));
                if (docHeight > 1) {
                    return c;
                }
                var y = 1;
                for (; y >= -1; y -= 2) {
                    var c3 = parseFloat((t * r + y * z * g).toFixed(elem.options.fractionalDigits));
                    var s3 = parseFloat((g * r - y * z * t).toFixed(elem.options.fractionalDigits));
                    c[eventName] = [];
                    c[eventName].push(parseFloat((p2x + v11 * c3).toFixed(elem.options.fractionalDigits)));
                    c[eventName].push(parseFloat((x2 + v11 * s3).toFixed(elem.options.fractionalDigits)));
                    c[eventName].push(parseFloat((p1x + c1 * c2 * c3).toFixed(elem.options.fractionalDigits)));
                    c[eventName].push(parseFloat((x1 + c1 * c2 * s3).toFixed(elem.options.fractionalDigits)));
                    eventName++;
                }
            }
            return c;
        }
    };
    tangent.prototype.findTangents = function(target, action) {
        if (target && action) {
            var context = this;
            var center = {
                x: target.x,
                y: target.y
            };
            var y = target.radius;
            $.each(action, function(item) {
                var that = item;
                if (!(item.id === target.id || $.grep(context.relations, function(e) {
                            return e.child_id === target.id && e.parent_id === that.id;
                        }).length > 0)) {
                    var pos = {
                        x: item.x,
                        y: item.y
                    };
                    var radius = item.radius;
                    var g = context.getTangents(center.x, center.y, y, pos.x, pos.y, radius);
                    if (g.length) {
                        context.relations.push({
                            child_id: item.id,
                            parent_id: target.id
                        });
                        $.each(g, function(val, index) {
                            var info = new createjs.Shape;
                            info.name = "Line";
                            info.lineIndex = index;
                            info.parents = [];
                            info.parents.push({
                                start: target.id,
                                end: that.id
                            });
                            context.stage.addChild(info);
                        });
                    }
                }
            });
        }
    };
    tangent.prototype.updateTangents = function(tangent) {
        if (this.lines && tangent) {
            var context = this;
            var geometry = $.grep(context.circles, function(ignores) {
                return ignores.id === tangent.parents[0].start;
            })[0];
            var area = $.grep(context.circles, function(selection) {
                return selection.id === tangent.parents[0].end;
            })[0];
            var allTangents = context.getTangents(geometry.x, geometry.y, geometry.radius, area.x, area.y, area.radius);
            if (tangent.graphics.clear(), allTangents[tangent.lineIndex]) {
                var z0 = allTangents[tangent.lineIndex][2] - allTangents[tangent.lineIndex][0];
                var z1 = allTangents[tangent.lineIndex][3] - allTangents[tangent.lineIndex][1];
                var version = parseFloat(Math.sqrt(z0 * z0 + z1 * z1).toFixed(context.options.fractionalDigits));
                var beginLinearGradientStroke = Math.max(0, Math.min(0, 1 - version / 1E3));
                tangent.graphics.setStrokeStyle(0.5).beginLinearGradientStroke([context.options.colors.colorLightOpacity, context.options.colors.colorDark], [1, beginLinearGradientStroke], 0, 0, allTangents[tangent.lineIndex][2], allTangents[tangent.lineIndex][3]).moveTo(allTangents[tangent.lineIndex][0], allTangents[tangent.lineIndex][1]).lineTo(allTangents[tangent.lineIndex][2], allTangents[tangent.lineIndex][3]);
            }
        }
    };
    tangent.prototype.tick = function(millis) {
        if (Tangents.stage) {
            if (Tangents.lines) {
                $.each(Tangents.lines, function(item) {
                    Tangents.updateTangents(item);
                });
                Tangents.stage.update(millis);
            }
        }
    };
    if ($(".canvas").length > 0) {
        window.Tangents = new tangent;
    }
}(), function() {
    if ($(".canvas").length > 0) {
        Tangents.initialize({
            animationPaused: _isMobile()
        });
    }
}();