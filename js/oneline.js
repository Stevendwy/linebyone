(function e(t, n, r) {
  function s(o, u) {
    if(!n[o]) {
      if(!t[o]) {
        var a = typeof require == "function" && require;
        if(!u && a) return a(o, !0);
        if(i) return i(o, !0);
        var f = new Error("Cannot find module '" + o + "'");
        throw f.code = "MODULE_NOT_FOUND", f
      }
      var l = n[o] = {
        exports: {}
      };
      t[o][0].call(l.exports, function(e) {
        var n = t[o][1][e];
        return s(n ? n : e)
      }, l, l.exports, e, t, n, r)
    }
    return n[o].exports
  }
  var i = typeof require == "function" && require;
  for(var o = 0; o < r.length; o++) s(r[o]);
  return s
})
({
  1: [function(require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    var _createClass = function() {
      function defineProperties(target, props) {
        for(var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }
      return function(Constructor, protoProps, staticProps) {
        if(protoProps) defineProperties(Constructor.prototype, protoProps);
        if(staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
      };
    }();

    function _classCallCheck(instance, Constructor) {
      if(!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    /*
      @ 事件封装
      @ object.on(event, fn) // 监听一个事件
      @ object.off(event, fn) // 取消监听
      @ object.once(event, fn) // 只监听一次事件
      @ object.dispacth(event, arg) // 触发一个事件
    */

    var Events = function() {
      function Events() {
        _classCallCheck(this, Events);
        // 定义的事件与回调
        this.defineEvent = {};
      }
      // 注册事件
      _createClass(Events, [{
        key: "register",
        value: function register(event, cb) {
          if(!this.defineEvent[event]) {
            this.defineEvent[event] = [cb];
          } else {
            this.defineEvent[event].push(cb);
          }
        }
        // 派遣事件
      }, {
        key: "dispatch",
        value: function dispatch(event, arg) {
          if(this.defineEvent[event]) {
            {
              for(var i = 0, len = this.defineEvent[event].length; i < len; ++i) {
                this.defineEvent[event][i] && this.defineEvent[event][i](arg);
              }
            }
          }
        }
        // on 监听
      }, {
        key: "on",
        value: function on(event, cb) {
          return this.register(event, cb);
        }
        // off 方法
      }, {
        key: "off",
        value: function off(event, cb) {
          var _this = this;
          if(this.defineEvent[event]) {
            if(typeof cb == "undefined") {
              delete this.defineEvent[event]; // 表示全部删除 
            } else {
              var _loop = function _loop(i, len) {
                if(cb == _this.defineEvent[event][i]) {
                  _this.defineEvent[event][i] = null; // 标记为空 - 防止dispath 长度变化 
                  // 延时删除对应事件
                  setTimeout(function() {
                    return _this.defineEvent[event].splice(i, 1);
                  }, 0);
                  return "break";
                }
              };
              // 遍历查找 
              for(var i = 0, len = this.defineEvent[event].length; i < len; ++i) {
                var _ret = _loop(i, len);
                if(_ret === "break") break;
              }
            }
          }
        }
        // once 方法，监听一次
      }, {
        key: "once",
        value: function once(event, cb) {
          var _this2 = this;
          var onceCb = function onceCb() {
            cb && cb();
            _this2.off(event, onceCb);
          };
          this.register(event, onceCb);
        }
      }]);
      return Events;
    }();
    exports.default = Events;
  }, {}],
  2: [function(require, module, exports) {
    "use strict";
    // PIXI 的扩展
    PIXI.DisplayObject.prototype.set = function(arg) {
      for(var key in arg) {
        this[key] = arg[key];
      }
    };
    // scale 属性拍平
    Object.defineProperties(PIXI.DisplayObject.prototype, {
      scaleX: {
        set: function set(value) {
          this.scale.x = value;
        },
        get: function get() {
          return this.scale.x;
        }
      },
      scaleY: {
        set: function set(value) {
          this.scale.y = value;
        },
        get: function get() {
          return this.scale.y;
        }
      },
      pivotX: {
        set: function set(value) {
          this.pivot.x = value;
        },
        get: function get() {
          return this.pivot.x;
        }
      },
      pivotY: {
        set: function set(value) {
          this.pivot.y = value;
        },
        get: function get() {
          return this.pivot.y;
        }
      },
      anchorX: {
        set: function set(value) {
          this.anchor.x = value;
        },
        get: function get() {
          return this.anchor.x;
        }
      },
      anchorY: {
        set: function set(value) {
          this.anchor.y = value;
        },
        get: function get() {
          return this.anchor.y;
        }
      }
    });

    // 获取不带描边的boudary
    {
      var dirty = Symbol("dirty");
      var getContentBox = function getContentBox() {
        if(this[dirty] == this.dirty) return;
        this[dirty] = this.dirty; // 表示已经更新
        var cp = this.clone();
        var graphicsData = cp.graphicsData;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for(var _iterator = graphicsData[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var graphics = _step.value;

            graphics.lineWidth = 0;
          }
        } catch(err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if(!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if(_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        this._cwidth = cp.width;
        this._cheight = cp.height;
      };
      Object.defineProperties(PIXI.Graphics.prototype, {
        "_cwidth": {
          writable: true,
          value: 0
        },
        "_cheight": {
          writable: true,
          value: 0
        },
        "cwidth": {
          get: function get() {
            getContentBox.call(this);
            return this._cwidth;
          }
        },
        "cheight": {
          get: function get() {
            getContentBox.call(this);
            return this._cheight;
          }
        }
      });
    }

  }, {}],
  3: [function(require, module, exports) {
    'use strict';

    var _createClass = function() {
      function defineProperties(target, props) {
        for(var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }
      return function(Constructor, protoProps, staticProps) {
        if(protoProps) defineProperties(Constructor.prototype, protoProps);
        if(staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
      };
    }();

    require('utils');
    var _Events = require('Events');
    var _Events2 = _interopRequireDefault(_Events);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }

    function _classCallCheck(instance, Constructor) {
      if(!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    var OneStroke = function() {
      function OneStroke(config) {
        _classCallCheck(this, OneStroke);
        var app = new PIXI.Application({
          width: 375,
          height: 603,
          resolution: 2,
          antialias: true,
          transparent: true,
          view: document.getElementById("canvas")
        });

        // config 挂载到 this
        var _ref = [app, app.stage, app.renderer, app.renderer.view];
        this.app = _ref[0];
        this.stage = _ref[1];
        this.renderer = _ref[2];
        this.view = _ref[3];
        this.config = config;

        // 当前关数
        this.curLevel = 0;

        // 总关数
        this.total = config.levels.length;

        // 当前线段
        this.lines = [];

        // 底图线段
        this.baseLines = [];

        // 手绘的线段
        this.strokes = [];

        // 回收站 ----- 用于存储待回退的线段与坐标
        this.recycler = [];

        // 底图端点
        this.baseVertexes = [];

        // 当前的端点坐标集合
        this.coords = [];

        // 当前有效的可连接点
        this.curValidCoords = [];

        // 已连接的线段快照 ------ 用于快速查找两点之间是否已经连接过
        this.strokedSnap = {};

        // 默认的线段颜色
        this.lineColor = config.lineColor;

        // 默认的端点颜色
        this.vertexColor = config.vertexColor;

        // 激活的端点颜色
        this.activeVertexColor = config.activeVertexColor;

        // 绘制中的线段颜色
        this.strokeColor = config.strokeColor;

        // 端点半径
        this.vertexRadius = 9;

        // 线段的厚度
        this.lineWidth = 10;

        // 当前点
        this.curVertex = null;

        // 当前坐标信息
        this.curCoord = null;

        // 当前线段
        this.curStroke = null;

        // 当前的有效点
        this.validCoords = [];

        //  当前屏幕width 与 ip6.width 的比例
        this.ratio = 375 / document.body.clientWidth;

        // view 左边界距离视窗左边界的距离
        this.viewLeft = 0;

        // 当前手指信息
        this.finger = {};

        // 默认不可以绘制
        this.canStroke = false;

        // 实例插件
//      this.plugin = new _oneStrokePlugin2.default();

        // 事件绑定 
        this.event = new _Events2.default();

        // 事件绑定 this
        this.touchstartHandle = this.touchstartHandle.bind(this);
        this.touchmoveHandle = this.touchmoveHandle.bind(this);
        this.touchendHandle = this.touchendHandle.bind(this);
        this.touchcancelHandle = this.touchendHandle;

        // 兼容非移动端
        if("ontouchstart" in document) {
          this.touchstart = "touchstart";
          this.touchmove = "touchmove";
          this.touchend = "touchend";
          this.touchcancel = "touchcancel";
        }
        // 没有 touch 事件
        else {
          this.touchstart = "mousedown";
          this.touchmove = "mousemove";
          this.touchend = "mouseup";
          // 并没有 mousecancel
          this.touchcancel = "mousecancle";
        }
        // 初始化
        this.init();
      }

      // 初始化

      _createClass(OneStroke, [{
        key: 'init',
        value: function init() {
          // 添加手指事件
          this.view.addEventListener(this.touchstart, this.touchstartHandle);
          this.view.addEventListener(this.touchmove, this.touchmoveHandle);
          this.view.addEventListener(this.touchend, this.touchendHandle);
          this.view.addEventListener(this.touchcancel, this.touchendHandle);
        }

        // 开始游戏

      }, {
        key: 'start',
        value: function start() {
          // 默认进入第一关
          this.enter(0);
        }

        // 重新开始 

      }, {
        key: 'restart',
        value: function restart() {
          // 重新进入当前关卡
          this.enter(this.curLevel);
        }

        // 销毁

      }, {
        key: 'destory',
        value: function destory() {
          this.view.removeEventListener("touchstart", this.touchstartHandle);
          this.view.removeEventListener("touchmove", this.touchmoveHandle);
          this.view.removeEventListener("touchend", this.touchendHandle);
          this.view.removeEventListener("touchcancel", this.touchendHandle);
          // 清空动画与节点
          this.clean();
        }

        // 暂停

      }, {
        key: 'pause',
        value: function pause() {
          this.app.ticker.stop();
          TweenMax.pauseAll();
        }
        // 恢复

      }, {
        key: 'resume',
        value: function resume() {
          this.app.ticker.start();
          TweenMax.resumeAll();
        }

        // gameover

      }, {
        key: 'gameover',
        value: function gameover() {
          this.event.dispatch("gameover");
        }

        // 清空

      }, {
        key: 'clean',
        value: function clean() {
          // 清空节点
          this.stage.removeChildren();
          // 清空坐标组
          this.coords.length = 0;
          // 清除当前端点与线段
          this.curStroke = this.curVertex = this.curCoord = null;
          // 清空快照
          this.strokedSnap = {};
          // 清空手绘线
          this.strokes.length = 0;
          // 清空回收站
          this.recycler.length = 0;
          // 清空动画
          TweenMax.killAll();
          // 解除锁定
          this.lock = false;
          // 默认不可以绘制
          this.canStroke = false;
        }

        // 进入对应的关卡

      }, {
        key: 'enter',
        value: function enter(index) {
          var _this = this;

          // 清空当前关卡的图形
          this.clean();
          var curLevel = this.config.levels[index];

          // 当前关卡数
          this.curLevel = index;

          // 当前是图片路径
          if(curLevel.lines === undefined && curLevel.src != undefined) {
            // 通知外部关卡载入中
            this.event.dispatch("level-loading");
            var name = curLevel.name;
            this.plugin.parse(curLevel.src).then(function(curLevel) {
              curLevel.name = name;
              _this.event.dispatch("level-loaded");
              _this.drawLevel(curLevel);
            }).catch(function(err) {
              return console.log("图片载入失败");
            });
          }
          // 当前是关卡对象
          else {
            this.drawLevel(curLevel);
          }
        }

        // 绘制当前关卡

      }, {
        key: 'drawLevel',
        value: function drawLevel(curLevel) {
          var _this2 = this;

          // 当前线段 ---- 拷贝config中的信息
          this.lines = curLevel.lines.map(function(item) {
            var newItem = Object.create(item);
            return newItem;
          });

          // 底图端点的颜色
          this.vertexColor = curLevel.vertexColor || config.vertexColor;

          // 手绘线段的颜色
          this.strokeColor = curLevel.strokeColor || this.strokeColor;

          // 激活点的颜色
          this.activeVertexColor = curLevel.activeVertexColor || this.activeVertexColor;

          // PIXI 的分辨率
          var resolution = this.renderer.resolution;

          // 收集当前端点 
          this.lines.forEach(function(item) {
            ["x1", "y1", "x2", "y2"].forEach(function(key) {
              return item[key] = item[key] / resolution;
            });
            var x1 = item.x1,
              y1 = item.y1,
              x2 = item.x2,
              y2 = item.y2;

            _this2.addCoords({
              x: x1,
              y: y1
            }, {
              x: x2,
              y: y2
            });
          });

          // 找出坐标对应的有效连接点
          this.findValidCoords();

          // 绘制底图线段
          this.drawBaseLines();

          // 绘制底图端点
          this.drawBaseVertexes();

          // 更新当前有效点（坐标）
          this.updateValidCoords();

          // 通知游戏开始
          this.event.dispatch("start", curLevel);
        }

        // 向 coords 添加端点

      }, {
        key: 'addCoords',
        value: function addCoords() {
          var _this3 = this;

          for(var _len = arguments.length, coords = Array(_len), _key = 0; _key < _len; _key++) {
            coords[_key] = arguments[_key];
          }

          coords.forEach(function(_ref2) {
            var x = _ref2.x,
              y = _ref2.y;

            for(var i = 0, len = _this3.coords.length; i < len; ++i) {
              if(_this3.coords[i].x === x && _this3.coords[i].y === y) {
                return false;
              }
            }
            _this3.coords.push({
              x: x,
              y: y
            });
          });
        }

        // 绘制底图线段

      }, {
        key: 'drawBaseLines',
        value: function drawBaseLines() {
          var _this4 = this;

          this.baseLines = this.lines.map(function(_ref3) {
            var x1 = _ref3.x1,
              y1 = _ref3.y1,
              x2 = _ref3.x2,
              y2 = _ref3.y2;

            var line = new PIXI.Graphics().lineStyle(_this4.lineWidth, _this4.lineColor, 1).moveTo(x1, y1).lineTo(x2, y2).closePath();
            _this4.stage.addChild(line);
            return line;
          });
        }

        // 绘制底图端点

      }, {
        key: 'drawBaseVertexes',
        value: function drawBaseVertexes() {
          var _this5 = this;

          this.baseVertexes = this.coords.map(function(_ref4) {
            var x = _ref4.x,
              y = _ref4.y;

            var vertex = new PIXI.Graphics().beginFill(_this5.vertexColor, 1).drawCircle(0, 0, _this5.vertexRadius);

            vertex.set({
              x: x,
              y: y
            });
            _this5.stage.addChild(vertex);
            return vertex;
          });
        }

        // touchstart

      }, {
        key: 'touchstartHandle',
        value: function touchstartHandle(e) {
          if(this.lock === true) return;
          // 移动端
          if(this.touchstart === "touchstart") {
            var _e$targetTouches$ = e.targetTouches[0],
              x = _e$targetTouches$.pageX,
              y = _e$targetTouches$.pageY;
          }
          // 非移动端
          else {
            var x = e.clientX,
              y = e.clientY;
          }

          // 修正 x
          x -= this.viewLeft;

          x *= this.ratio;
          y *= this.ratio;
          this.finger.x = x, this.finger.y = y;
          // 表示图形画了一半，继续画
          if(this.curStroke !== null) {
            this.updateLine(x, y);
            this.canStroke = true;
          }
          // 表示图形第一次绘制
          else {
            var coord = this.check(x, y);
            // 手指下没有端点
            if(coord === false) this.canStroke = false;
            // 手指下有端点
            else {
              this.canStroke = true;
              // 生成新位置的激活点
              this.addActiveVertex(coord);
              // 创建一条长度为0的手绘线段
              this.generateStroke(coord);
            }
          }
        }
        // touchmove

      }, {
        key: 'touchmoveHandle',
        value: function touchmoveHandle(e) {
          // 不能画线
          if(this.canStroke === false || this.lock === true) return;
          // 移动端
          if(this.touchstart === "touchstart") {
            var _e$targetTouches$2 = e.targetTouches[0],
              x = _e$targetTouches$2.pageX,
              y = _e$targetTouches$2.pageY;
          }
          // 非移动端
          else {
            var x = e.clientX,
              y = e.clientY;
          }
          // 修正 x
          x -= this.viewLeft;

          x *= this.ratio;
          y *= this.ratio;
          this.updateLine(x, y);
        }
        // touchend

      }, {
        key: 'touchendHandle',
        value: function touchendHandle(e) {
          // 不能画线
          if(this.canStroke === false || this.lock === true) return;
          // 没有成形的手绘线
          if(this.strokes.length === 1) {
            // 移除当前激活点
            this.removeActiveVertex();
            // 删除当前 stroke
            this.stage.removeChild(this.curStroke);
            this.curStroke = null;
            // strokes 清零
            this.strokes.length = 0;
            // recycler 清空
            this.recycler.length = 0;
            // 更新有效点
            this.updateValidCoords();
          }
          // 有成形的手绘线 ---- 将未成形的线段回退到起始点
          else {
            var points = this.curStroke.graphicsData[0].shape.points;
            points[2] = points[0];
            points[3] = points[1];
            this.curStroke.dirty++ & this.curStroke.clearDirty++;
          }
          // 重置为不可绘制
          this.canStroke = false;
        }

        // 找出坐标对应的有效连接点

      }, {
        key: 'findValidCoords',
        value: function findValidCoords() {
          var _this6 = this;

          this.coords.forEach(function(coord) {
            // 创建一个有效坐标数组 
            coord.validCoords = [];
            _this6.lines.forEach(function(_ref5) {
              var x1 = _ref5.x1,
                y1 = _ref5.y1,
                x2 = _ref5.x2,
                y2 = _ref5.y2;

              // 坐标是当前线段的起点
              if(coord.x === x1 && coord.y === y1) {
                coord.validCoords.push(_this6.findCoord(x2, y2));
              }
              // 坐标是当前线段的终点
              else if(coord.x === x2 && coord.y === y2) {
                coord.validCoords.push(_this6.findCoord(x1, y1));
              }
            });
          });
        }

        // 返回对应的坐标点 

      }, {
        key: 'findCoord',
        value: function findCoord(x, y) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for(var _iterator = this.coords[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var coord = _step.value;

              if(coord.x === x && coord.y === y) return coord;
            }
          } catch(err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if(!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if(_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          return false;
        }

        // 更新当前的有效点

      }, {
        key: 'updateValidCoords',
        value: function updateValidCoords(coord) {
          // 默认是当前所有坐标 
          if(coord === undefined) {
            this.validCoords = this.coords;
          }
          // 剔除 coord.validCoords 中无效的坐标
          else {
            for(var i = 0; i < coord.validCoords.length; ++i) {
              var validCoord = coord.validCoords[i];
              var snapKey = "stroke_from_x_" + validCoord.x + "_y_" + validCoord.y + "_to_x_" + coord.x + "_y_" + coord.y;
              // 标记当前点与当前有效点已经连线
              if(this.strokedSnap[snapKey] === true) {
                coord.validCoords[i].connected = true;
              }
              // 标记未链接
              else {
                coord.validCoords[i].connected = false;
              }
            }
            this.validCoords = coord.validCoords;
          }
          this.validCoords = coord !== undefined ? coord.validCoords : this.coords;
        }

        // 更新当前线段

      }, {
        key: 'updateLine',
        value: function updateLine() {
          var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.finger.x;
          var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.finger.y;

          var coord = this.check(x, y),
            points = this.curStroke.graphicsData[0].shape.points;
          // 手指下不存在有效点
          if(coord === false) {
            points[2] = x;
            points[3] = y;
          }
          // 手批下是有效点
          else if(coord !== this.curCoord) {
            // 两点成线
            points[2] = coord.x;
            points[3] = coord.y;
            // 从 this.lines 中删除这条线段
            for(var i = 0, len = this.lines.length; i < len; ++i) {
              var _lines$i = this.lines[i],
                x1 = _lines$i.x1,
                y1 = _lines$i.y1,
                x2 = _lines$i.x2,
                y2 = _lines$i.y2,
                isDeleted = _lines$i.isDeleted;
              // 跳过已经标记删除的线段

              if(isDeleted === true) continue;
              // 手指下的当前点
              var x3 = coord.x,
                y3 = coord.y;
              // 当前线段的起始点

              var _curCoord = this.curCoord,
                x4 = _curCoord.x,
                y4 = _curCoord.y;

              if(x1 === x3 && y1 === y3 && x2 === x4 && y2 === y4 || x1 === x4 && y1 === y4 && x2 === x3 && y2 === y3) {
                // 标记删除 
                this.lines[i].isDeleted = true;
                // 把线段与坐标回收
                this.recycler[this.recycler.length] = {
                  line: this.lines[i],
                  curCoord: this.curCoord
                };
                // this.lines.splice(i, 1); 
                break;
              }
            }

            // 未通关，生成新的线段
            if(this.lines.length > this.strokes.length) {
              // 将已经完成的线段存入快照
              var snapKeyA = "stroke_from_x_" + this.curCoord.x + "_y_" + this.curCoord.y + "_to_x_" + coord.x + "_y_" + coord.y;
              var snapKeyB = "stroke_from_x_" + coord.x + "_y_" + coord.y + "_to_x_" + this.curCoord.x + "_y_" + this.curCoord.y;
              this.strokedSnap[snapKeyA] = this.strokedSnap[snapKeyB] = true;
              // 将删除的线段
              // 删除上一次的激活点
              this.removeActiveVertex();
              // 生成新位置的激活点
              this.addActiveVertex(coord);
              // 创建新线段后 curStroke 指向会变，所以提前更新
              this.curStroke.dirty++ & this.curStroke.clearDirty++;
              // 创建一条长度为0的手绘线段
              this.generateStroke(coord);
            }
            // 通关 ----- 手绘线的数量与待画线相等
            else {
              // 删除上一次的激活点
              this.removeActiveVertex();
              // 锁定
              this.lock = true;
              this.pass();
            }
          }
          this.curStroke.dirty++ & this.curStroke.clearDirty++;
        }

        // 创建一条长度为0的手绘线段

      }, {
        key: 'generateStroke',
        value: function generateStroke(coord) {
          var x = coord.x,
            y = coord.y;

          this.curStroke = new PIXI.Graphics().lineStyle(this.lineWidth, this.strokeColor, 1).moveTo(x, y).lineTo(x, y).closePath();
          this.strokes.push(this.curStroke);
          // 添加到舞台
          this.stage.addChild(this.curStroke);
          // 设置层级
          this.stage.setChildIndex(this.curStroke, this.baseLines.length);
          // 更新有效连接点
          this.updateValidCoords(coord);
        }

        // 监测手指下是否有端点

      }, {
        key: 'check',
        value: function check(x0, y0) {
          for(var i = 0, len = this.validCoords.length; i < len; ++i) {
            var _validCoords$i = this.validCoords[i],
              x = _validCoords$i.x,
              y = _validCoords$i.y,
              connected = _validCoords$i.connected;
            // 跳过已连结的端点

            if(connected === true) continue;
            var distance = Math.sqrt(Math.pow(x - x0, 2) + Math.pow(y - y0, 2));
            // 手指在半径内 ------ 移动端适当把半径放大
            if(distance <= this.vertexRadius * 1.5) {
              return this.validCoords[i];
            }
          }
          return false;
        }
        // 激活的点 ----- 鼠标点击时的动画或关卡过关时的动画

      }, {
        key: 'addActiveVertex',
        value: function addActiveVertex(coord) {
          var vertex = new PIXI.Graphics().beginFill(this.activeVertexColor, 1).drawCircle(0, 0, this.vertexRadius);
          var x = coord.x,
            y = coord.y;

          vertex.set({
            x: x,
            y: y
          });
          // 添加到舞台
          this.stage.addChild(vertex);
          // 当前端点
          this.curVertex = vertex;
          // 当前坐标信息
          this.curCoord = coord;
          // 添加动画
          TweenMax.to(vertex, .2, {
            alpha: .4,
            scaleX: 1.6,
            scaleY: 1.6,
            yoyo: true,
            repeat: -1
          });
        }
        // 移除激活点

      }, {
        key: 'removeActiveVertex',
        value: function removeActiveVertex() {
          this.stage.removeChild(this.curVertex);
          TweenMax.killTweensOf(this.curVertex);
        }
        // 后退一步

      }, {
        key: 'rollback',
        value: function rollback() {
          // 回收器有东西并且不止一条记录
          if(this.recycler.length > 1) {
            var recyclerInfo = this.recycler.pop();
            // 删除快照
            var snapKeyA = "stroke_from_x_" + this.curCoord.x + "_y_" + this.curCoord.y + "_to_x_" + recyclerInfo.curCoord.x + "_y_" + recyclerInfo.curCoord.y;
            var snapKeyB = "stroke_from_x_" + recyclerInfo.curCoord.x + "_y_" + recyclerInfo.curCoord.y + "_to_x_" + this.curCoord.x + "_y_" + this.curCoord.y;
            this.strokedSnap[snapKeyA] = this.strokedSnap[snapKeyB] = false;
            // 移除当前激活点
            this.removeActiveVertex();
            // 重新设置激活点
            this.addActiveVertex(recyclerInfo.curCoord);
            // 标记线段未删除
            recyclerInfo.line.isDeleted = false;

            // 移除当前的手绘线
            var lastStroke = this.strokes.pop();
            this.stage.removeChild(lastStroke);
            // 重新指定当前手绘线
            this.curStroke = this.strokes[this.strokes.length - 1];
            // 线段回退到原点
            var points = this.curStroke.graphicsData[0].shape.points;
            points[2] = points[0];
            points[3] = points[1];
            this.curStroke.dirty++ & this.curStroke.clearDirty++;
            // 更新有效连接坐标
            this.updateValidCoords(this.curCoord);
          }
          // 回收器里只有一条记录
          else if(this.recycler.length === 1) {
            // 直接调用重新开始游戏
            this.restart();
          }
        }
        // 通关

      }, {
        key: 'pass',
        value: function pass() {
          var _this7 = this;

          // 清除所有的底图基点
          this.baseVertexes.forEach(function(vertex) {
            return TweenMax.to(vertex, 1, {
              scaleX: 2.5,
              scaleY: 2.5,
              alpha: 0
            });
          });
          // 清空所有的底图线段
          this.baseLines.forEach(function(line) {
            return _this7.stage.removeChild(line);
          });
          // 敲落手绘线
          this.knockStrokes(function() {
            return _this7.event.dispatch("pass");
          });
        }
        // 下一关

      }, {
        key: 'next',
        value: function next() {
          console.log(this.curLevel, this.config.levels.length - 1);
          if(this.curLevel < this.config.levels.length - 1) {
            this.enter(this.curLevel + 1);
          } else {
            this.gameover();
          }
        }
        // 上一关

      }, {
        key: 'prev',
        value: function prev() {
          if(this.curLevel > 0) {
            this.enter(this.curLevel - 1);
          }
        }
        // 敲落手绘线段

      }, {
        key: 'knockStrokes',
        value: function knockStrokes(cb) {
          var _this8 = this;

          // promises
          var promises = this.strokes.map(function(stroke) {
            return new Promise(function(resolve, reject) {
              // 设置中心点
              var _stroke$getBounds = stroke.getBounds(),
                width = _stroke$getBounds.width,
                height = _stroke$getBounds.height,
                left = _stroke$getBounds.left,
                top = _stroke$getBounds.top;

              stroke.set({
                pivotX: left + width / 2,
                pivotY: top + height / 2,
                x: stroke.x + left + width / 2,
                y: stroke.y + top + height / 2
              });
              TweenMax.to(stroke, Math.random() * .8 + 1.5, {
                delay: Math.random() * .5,
                rotation: Math.PI,
                y: _this8.view.height * 1.5,
                onComplete: function onComplete() {
                  return resolve();
                }
              });
            });
          });
          Promise.race(promises).then(function() {
            return cb();
          });
        }
      }]);

      return OneStroke;
    }();

    window.OneStroke = OneStroke;
    // 屏蔽pixijs信息
    PIXI.utils.skipHello();

  },
  {
    "Events": 1,
    "utils": 2
  }]
}, {}, [3]);