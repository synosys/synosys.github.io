(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const html = require('nanohtml')
const loadData = require('./src/load-data.js')
const createChart = require('./src/chart.js')
const { config, getDate } = require('./src/config.js')

loadData(`contactindex-data/data/cx_state_processed.csv?${Math.floor(Math.random() * 1000)}`, (d) => {
    initChart(d)
})

function initChart({ data, dates }) {
    const state = { dataset: 'k_std_', sync: false }
    const test = data[0]

    const container = html`<div style="display:flex; flex-wrap:wrap; overflow-y:auto; overflow-x: hidden; height:calc(100% - 40px);"></div>`
    const buttons = ['k_std_', 'k_'].map((key, i) => html`<div class="button ${key === state.dataset ? 'selected' : ''}" onclick=${() => updateDataset(key, i)}>${config[key].label}</div>`)
    const toggle = html`<input style="margin-left:20px;" type="checkbox" id="sync" name="sync" checked=${state.sync} onchange=${(e) => { setYSync(e.target.checked)}}>`
    const header = html`
        <div style="display:flex;align-items:center;height:40px"> 
            <div class="title">${config.title}</div> 
            ${buttons}
            ${toggle}
            <label>${config.syncLabel}</label>
        </div>`

    let w = Math.max(window.innerWidth / 4, 200) - 20
    let h = 200
    let testSync = uPlot.sync("test")
    const charts = data.map((land, i) => {
        const div = document.createElement('div')
        div.style.width = `${w}px`
        const series = [dates, land.data['k_std_'], land.data['k_std__7davg']]
        const chart = createChart(series, {
            w: w, 
            h: h, 
            parent: container, 
            sync: testSync, 
            label: land.label, 
            index: i, 
            onCursorUpdate: i == 0 ? (i) => {
                updateLegends(i)
            } : () => { },
            onSelectUpdate: i == data.length - 1 ? (i) => {
                //updateLegends(i)
              //  console.log('update selection')
                updateYRange(i)
            } : () => { }
        })
        testSync.sub(chart)
        window.chart = chart
        return chart
    })


    function updateDataset(key, index) {
        const { color, transparentColor } = config[key]

        state.dataset = key
        buttons.forEach((button) => {
            button.classList.remove("selected")
            button.style.backgroundColor = ''
        })
        buttons[index].classList.add("selected")
        buttons[index].style.backgroundColor = transparentColor
        // console.log('header', header)
        charts.forEach((chart, i) => {
            const d = data[i]
            chart.setData([dates, d.data[key], d.data[`${key}_7davg`]])
            chart.updateColor(color, transparentColor)
         //   console.log(chart.scales.y.max)
        })
       // console.log(charts)
    }

    function setYSync(val) {
        state.sync = val
        updateYRange()
    }

    // calculate max y-value of all charts
    function updateYRange() {
       // console.log(charts[0].series[0].idxs, charts[0])
       
        setTimeout(() => {
            const range = charts[0].series[0].idxs
            const start = range[0]
            const end = range[1]
            let overallMax = 0
            let overallMin = 1000
            if(state.sync === true) {
                charts.forEach((chart) => {
                    const d = chart.data[2]
                    let max = d[start]
                    let min = d[start]
                    let i = start
                    while(i <= end) {
                        if(min === null) min = d[i]
                        if(d[i] < min) min = d[i]
                        if(d[i] > max) max = d[i]
                        i++
                    }
                //   console.log('max', max)
                    if(max > overallMax) overallMax = max
                    if(min < overallMin) overallMin = min
                })
                overallMax += 2 // padding
                if(overallMin > 2) overallMin -= 2
                overallMin = 0
                charts.forEach((chart) => {
               
                chart.updateYRange(overallMin, overallMax)
                chart.setScale('y', {min: overallMin, max: overallMax})
            //    chart.scales.y.range(chart, 0, overallMax)
                })
            } else {
                console.log('autoscaling', start, end)

                charts.forEach((chart) => {
                    const d = chart.data[2]
                    let max = d[start]
                    let min = d[start]
               //     console.log(min, 'min', chart)
                    let i = start
                    while(i <= end) {
                        if(min === null) min = d[i]
                        if(d[i] > max) max = d[i]
                        if(d[i] < min) min = d[i]
                        i++
                    }
                    max += 2
                    if(min > 2) min -= 2
                    chart.updateYRange(min, max)
                    chart.setScale('y', {min: min, max: max})
                    //  chart.scales.y.range(chart, min, max)

                })
            }
        }, 50)
    }
    function updateLegends(i, d = 1) {
       // console.log('updating', i)
      // console.log(charts[0])
        const date = getDate(true, charts[0].data[0][i])
        charts.forEach((chart) => {
            //console.log(chart.scales.y.max)
            chart.updateLegend(i, date)
        })
    }

    function updateSize() {
        let w = 200
        let sw = window.innerWidth
        if (sw < 600) {
            w = sw / 2 - 20
        } else if (sw < 700) {
            w = sw / 3 - 15
        } else {
            w = sw / 4 - 20
        }
        let h = 180
        charts.forEach((chart, i) => {
            chart.updateSize(w, h)
        })
    }

    window.addEventListener('resize', () => {
        updateSize()
    })

    const main = html`<div style="height:100%;position:absolute">
    ${header}
    ${container}
    </div>`

    document.body.appendChild(main)

    updateDataset('k_std_', 0)
    updateSize()
}


},{"./src/chart.js":10,"./src/config.js":11,"./src/load-data.js":12,"nanohtml":6}],2:[function(require,module,exports){
module.exports = attributeToProperty

var transform = {
  'class': 'className',
  'for': 'htmlFor',
  'http-equiv': 'httpEquiv'
}

function attributeToProperty (h) {
  return function (tagName, attrs, children) {
    for (var attr in attrs) {
      if (attr in transform) {
        attrs[transform[attr]] = attrs[attr]
        delete attrs[attr]
      }
    }
    return h(tagName, attrs, children)
  }
}

},{}],3:[function(require,module,exports){
var attrToProp = require('hyperscript-attribute-to-property')

var VAR = 0, TEXT = 1, OPEN = 2, CLOSE = 3, ATTR = 4
var ATTR_KEY = 5, ATTR_KEY_W = 6
var ATTR_VALUE_W = 7, ATTR_VALUE = 8
var ATTR_VALUE_SQ = 9, ATTR_VALUE_DQ = 10
var ATTR_EQ = 11, ATTR_BREAK = 12
var COMMENT = 13

module.exports = function (h, opts) {
  if (!opts) opts = {}
  var concat = opts.concat || function (a, b) {
    return String(a) + String(b)
  }
  if (opts.attrToProp !== false) {
    h = attrToProp(h)
  }

  return function (strings) {
    var state = TEXT, reg = ''
    var arglen = arguments.length
    var parts = []

    for (var i = 0; i < strings.length; i++) {
      if (i < arglen - 1) {
        var arg = arguments[i+1]
        var p = parse(strings[i])
        var xstate = state
        if (xstate === ATTR_VALUE_DQ) xstate = ATTR_VALUE
        if (xstate === ATTR_VALUE_SQ) xstate = ATTR_VALUE
        if (xstate === ATTR_VALUE_W) xstate = ATTR_VALUE
        if (xstate === ATTR) xstate = ATTR_KEY
        if (xstate === OPEN) {
          if (reg === '/') {
            p.push([ OPEN, '/', arg ])
            reg = ''
          } else {
            p.push([ OPEN, arg ])
          }
        } else if (xstate === COMMENT && opts.comments) {
          reg += String(arg)
        } else if (xstate !== COMMENT) {
          p.push([ VAR, xstate, arg ])
        }
        parts.push.apply(parts, p)
      } else parts.push.apply(parts, parse(strings[i]))
    }

    var tree = [null,{},[]]
    var stack = [[tree,-1]]
    for (var i = 0; i < parts.length; i++) {
      var cur = stack[stack.length-1][0]
      var p = parts[i], s = p[0]
      if (s === OPEN && /^\//.test(p[1])) {
        var ix = stack[stack.length-1][1]
        if (stack.length > 1) {
          stack.pop()
          stack[stack.length-1][0][2][ix] = h(
            cur[0], cur[1], cur[2].length ? cur[2] : undefined
          )
        }
      } else if (s === OPEN) {
        var c = [p[1],{},[]]
        cur[2].push(c)
        stack.push([c,cur[2].length-1])
      } else if (s === ATTR_KEY || (s === VAR && p[1] === ATTR_KEY)) {
        var key = ''
        var copyKey
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_KEY) {
            key = concat(key, parts[i][1])
          } else if (parts[i][0] === VAR && parts[i][1] === ATTR_KEY) {
            if (typeof parts[i][2] === 'object' && !key) {
              for (copyKey in parts[i][2]) {
                if (parts[i][2].hasOwnProperty(copyKey) && !cur[1][copyKey]) {
                  cur[1][copyKey] = parts[i][2][copyKey]
                }
              }
            } else {
              key = concat(key, parts[i][2])
            }
          } else break
        }
        if (parts[i][0] === ATTR_EQ) i++
        var j = i
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_VALUE || parts[i][0] === ATTR_KEY) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][1])
            else parts[i][1]==="" || (cur[1][key] = concat(cur[1][key], parts[i][1]));
          } else if (parts[i][0] === VAR
          && (parts[i][1] === ATTR_VALUE || parts[i][1] === ATTR_KEY)) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][2])
            else parts[i][2]==="" || (cur[1][key] = concat(cur[1][key], parts[i][2]));
          } else {
            if (key.length && !cur[1][key] && i === j
            && (parts[i][0] === CLOSE || parts[i][0] === ATTR_BREAK)) {
              // https://html.spec.whatwg.org/multipage/infrastructure.html#boolean-attributes
              // empty string is falsy, not well behaved value in browser
              cur[1][key] = key.toLowerCase()
            }
            if (parts[i][0] === CLOSE) {
              i--
            }
            break
          }
        }
      } else if (s === ATTR_KEY) {
        cur[1][p[1]] = true
      } else if (s === VAR && p[1] === ATTR_KEY) {
        cur[1][p[2]] = true
      } else if (s === CLOSE) {
        if (selfClosing(cur[0]) && stack.length) {
          var ix = stack[stack.length-1][1]
          stack.pop()
          stack[stack.length-1][0][2][ix] = h(
            cur[0], cur[1], cur[2].length ? cur[2] : undefined
          )
        }
      } else if (s === VAR && p[1] === TEXT) {
        if (p[2] === undefined || p[2] === null) p[2] = ''
        else if (!p[2]) p[2] = concat('', p[2])
        if (Array.isArray(p[2][0])) {
          cur[2].push.apply(cur[2], p[2])
        } else {
          cur[2].push(p[2])
        }
      } else if (s === TEXT) {
        cur[2].push(p[1])
      } else if (s === ATTR_EQ || s === ATTR_BREAK) {
        // no-op
      } else {
        throw new Error('unhandled: ' + s)
      }
    }

    if (tree[2].length > 1 && /^\s*$/.test(tree[2][0])) {
      tree[2].shift()
    }

    if (tree[2].length > 2
    || (tree[2].length === 2 && /\S/.test(tree[2][1]))) {
      if (opts.createFragment) return opts.createFragment(tree[2])
      throw new Error(
        'multiple root elements must be wrapped in an enclosing tag'
      )
    }
    if (Array.isArray(tree[2][0]) && typeof tree[2][0][0] === 'string'
    && Array.isArray(tree[2][0][2])) {
      tree[2][0] = h(tree[2][0][0], tree[2][0][1], tree[2][0][2])
    }
    return tree[2][0]

    function parse (str) {
      var res = []
      if (state === ATTR_VALUE_W) state = ATTR
      for (var i = 0; i < str.length; i++) {
        var c = str.charAt(i)
        if (state === TEXT && c === '<') {
          if (reg.length) res.push([TEXT, reg])
          reg = ''
          state = OPEN
        } else if (c === '>' && !quot(state) && state !== COMMENT) {
          if (state === OPEN && reg.length) {
            res.push([OPEN,reg])
          } else if (state === ATTR_KEY) {
            res.push([ATTR_KEY,reg])
          } else if (state === ATTR_VALUE && reg.length) {
            res.push([ATTR_VALUE,reg])
          }
          res.push([CLOSE])
          reg = ''
          state = TEXT
        } else if (state === COMMENT && /-$/.test(reg) && c === '-') {
          if (opts.comments) {
            res.push([ATTR_VALUE,reg.substr(0, reg.length - 1)])
          }
          reg = ''
          state = TEXT
        } else if (state === OPEN && /^!--$/.test(reg)) {
          if (opts.comments) {
            res.push([OPEN, reg],[ATTR_KEY,'comment'],[ATTR_EQ])
          }
          reg = c
          state = COMMENT
        } else if (state === TEXT || state === COMMENT) {
          reg += c
        } else if (state === OPEN && c === '/' && reg.length) {
          // no-op, self closing tag without a space <br/>
        } else if (state === OPEN && /\s/.test(c)) {
          if (reg.length) {
            res.push([OPEN, reg])
          }
          reg = ''
          state = ATTR
        } else if (state === OPEN) {
          reg += c
        } else if (state === ATTR && /[^\s"'=/]/.test(c)) {
          state = ATTR_KEY
          reg = c
        } else if (state === ATTR && /\s/.test(c)) {
          if (reg.length) res.push([ATTR_KEY,reg])
          res.push([ATTR_BREAK])
        } else if (state === ATTR_KEY && /\s/.test(c)) {
          res.push([ATTR_KEY,reg])
          reg = ''
          state = ATTR_KEY_W
        } else if (state === ATTR_KEY && c === '=') {
          res.push([ATTR_KEY,reg],[ATTR_EQ])
          reg = ''
          state = ATTR_VALUE_W
        } else if (state === ATTR_KEY) {
          reg += c
        } else if ((state === ATTR_KEY_W || state === ATTR) && c === '=') {
          res.push([ATTR_EQ])
          state = ATTR_VALUE_W
        } else if ((state === ATTR_KEY_W || state === ATTR) && !/\s/.test(c)) {
          res.push([ATTR_BREAK])
          if (/[\w-]/.test(c)) {
            reg += c
            state = ATTR_KEY
          } else state = ATTR
        } else if (state === ATTR_VALUE_W && c === '"') {
          state = ATTR_VALUE_DQ
        } else if (state === ATTR_VALUE_W && c === "'") {
          state = ATTR_VALUE_SQ
        } else if (state === ATTR_VALUE_DQ && c === '"') {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE_SQ && c === "'") {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE_W && !/\s/.test(c)) {
          state = ATTR_VALUE
          i--
        } else if (state === ATTR_VALUE && /\s/.test(c)) {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE || state === ATTR_VALUE_SQ
        || state === ATTR_VALUE_DQ) {
          reg += c
        }
      }
      if (state === TEXT && reg.length) {
        res.push([TEXT,reg])
        reg = ''
      } else if (state === ATTR_VALUE && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_VALUE_DQ && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_VALUE_SQ && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_KEY) {
        res.push([ATTR_KEY,reg])
        reg = ''
      }
      return res
    }
  }

  function strfn (x) {
    if (typeof x === 'function') return x
    else if (typeof x === 'string') return x
    else if (x && typeof x === 'object') return x
    else if (x === null || x === undefined) return x
    else return concat('', x)
  }
}

function quot (state) {
  return state === ATTR_VALUE_SQ || state === ATTR_VALUE_DQ
}

var closeRE = RegExp('^(' + [
  'area', 'base', 'basefont', 'bgsound', 'br', 'col', 'command', 'embed',
  'frame', 'hr', 'img', 'input', 'isindex', 'keygen', 'link', 'meta', 'param',
  'source', 'track', 'wbr', '!--',
  // SVG TAGS
  'animate', 'animateTransform', 'circle', 'cursor', 'desc', 'ellipse',
  'feBlend', 'feColorMatrix', 'feComposite',
  'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap',
  'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR',
  'feGaussianBlur', 'feImage', 'feMergeNode', 'feMorphology',
  'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile',
  'feTurbulence', 'font-face-format', 'font-face-name', 'font-face-uri',
  'glyph', 'glyphRef', 'hkern', 'image', 'line', 'missing-glyph', 'mpath',
  'path', 'polygon', 'polyline', 'rect', 'set', 'stop', 'tref', 'use', 'view',
  'vkern'
].join('|') + ')(?:[\.#][a-zA-Z0-9\u007F-\uFFFF_:-]+)*$')
function selfClosing (tag) { return closeRE.test(tag) }

},{"hyperscript-attribute-to-property":2}],4:[function(require,module,exports){
'use strict'

var trailingNewlineRegex = /\n[\s]+$/
var leadingNewlineRegex = /^\n[\s]+/
var trailingSpaceRegex = /[\s]+$/
var leadingSpaceRegex = /^[\s]+/
var multiSpaceRegex = /[\n\s]+/g

var TEXT_TAGS = [
  'a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'data', 'dfn', 'em', 'i',
  'kbd', 'mark', 'q', 'rp', 'rt', 'rtc', 'ruby', 's', 'amp', 'small', 'span',
  'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr'
]

var VERBATIM_TAGS = [
  'code', 'pre', 'textarea'
]

module.exports = function appendChild (el, childs) {
  if (!Array.isArray(childs)) return

  var nodeName = el.nodeName.toLowerCase()

  var hadText = false
  var value, leader

  for (var i = 0, len = childs.length; i < len; i++) {
    var node = childs[i]
    if (Array.isArray(node)) {
      appendChild(el, node)
      continue
    }

    if (typeof node === 'number' ||
      typeof node === 'boolean' ||
      typeof node === 'function' ||
      node instanceof Date ||
      node instanceof RegExp) {
      node = node.toString()
    }

    var lastChild = el.childNodes[el.childNodes.length - 1]

    // Iterate over text nodes
    if (typeof node === 'string') {
      hadText = true

      // If we already had text, append to the existing text
      if (lastChild && lastChild.nodeName === '#text') {
        lastChild.nodeValue += node

      // We didn't have a text node yet, create one
      } else {
        node = el.ownerDocument.createTextNode(node)
        el.appendChild(node)
        lastChild = node
      }

      // If this is the last of the child nodes, make sure we close it out
      // right
      if (i === len - 1) {
        hadText = false
        // Trim the child text nodes if the current node isn't a
        // node where whitespace matters.
        if (TEXT_TAGS.indexOf(nodeName) === -1 &&
          VERBATIM_TAGS.indexOf(nodeName) === -1) {
          value = lastChild.nodeValue
            .replace(leadingNewlineRegex, '')
            .replace(trailingSpaceRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')
          if (value === '') {
            el.removeChild(lastChild)
          } else {
            lastChild.nodeValue = value
          }
        } else if (VERBATIM_TAGS.indexOf(nodeName) === -1) {
          // The very first node in the list should not have leading
          // whitespace. Sibling text nodes should have whitespace if there
          // was any.
          leader = i === 0 ? '' : ' '
          value = lastChild.nodeValue
            .replace(leadingNewlineRegex, leader)
            .replace(leadingSpaceRegex, ' ')
            .replace(trailingSpaceRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')
          lastChild.nodeValue = value
        }
      }

    // Iterate over DOM nodes
    } else if (node && node.nodeType) {
      // If the last node was a text node, make sure it is properly closed out
      if (hadText) {
        hadText = false

        // Trim the child text nodes if the current node isn't a
        // text node or a code node
        if (TEXT_TAGS.indexOf(nodeName) === -1 &&
          VERBATIM_TAGS.indexOf(nodeName) === -1) {
          value = lastChild.nodeValue
            .replace(leadingNewlineRegex, '')
            .replace(trailingNewlineRegex, ' ')
            .replace(multiSpaceRegex, ' ')

          // Remove empty text nodes, append otherwise
          if (value === '') {
            el.removeChild(lastChild)
          } else {
            lastChild.nodeValue = value
          }
        // Trim the child nodes but preserve the appropriate whitespace
        } else if (VERBATIM_TAGS.indexOf(nodeName) === -1) {
          value = lastChild.nodeValue
            .replace(leadingSpaceRegex, ' ')
            .replace(leadingNewlineRegex, '')
            .replace(trailingNewlineRegex, ' ')
            .replace(multiSpaceRegex, ' ')
          lastChild.nodeValue = value
        }
      }

      // Store the last nodename
      var _nodeName = node.nodeName
      if (_nodeName) nodeName = _nodeName.toLowerCase()

      // Append the node to the DOM
      el.appendChild(node)
    }
  }
}

},{}],5:[function(require,module,exports){
'use strict'

module.exports = [
  'async', 'autofocus', 'autoplay', 'checked', 'controls', 'default',
  'defaultchecked', 'defer', 'disabled', 'formnovalidate', 'hidden',
  'ismap', 'loop', 'multiple', 'muted', 'novalidate', 'open', 'playsinline',
  'readonly', 'required', 'reversed', 'selected'
]

},{}],6:[function(require,module,exports){
module.exports = require('./dom')(document)

},{"./dom":8}],7:[function(require,module,exports){
'use strict'

module.exports = [
  'indeterminate'
]

},{}],8:[function(require,module,exports){
'use strict'

var hyperx = require('hyperx')
var appendChild = require('./append-child')
var SVG_TAGS = require('./svg-tags')
var BOOL_PROPS = require('./bool-props')
// Props that need to be set directly rather than with el.setAttribute()
var DIRECT_PROPS = require('./direct-props')

var SVGNS = 'http://www.w3.org/2000/svg'
var XLINKNS = 'http://www.w3.org/1999/xlink'

var COMMENT_TAG = '!--'

module.exports = function (document) {
  function nanoHtmlCreateElement (tag, props, children) {
    var el

    // If an svg tag, it needs a namespace
    if (SVG_TAGS.indexOf(tag) !== -1) {
      props.namespace = SVGNS
    }

    // If we are using a namespace
    var ns = false
    if (props.namespace) {
      ns = props.namespace
      delete props.namespace
    }

    // If we are extending a builtin element
    var isCustomElement = false
    if (props.is) {
      isCustomElement = props.is
      delete props.is
    }

    // Create the element
    if (ns) {
      if (isCustomElement) {
        el = document.createElementNS(ns, tag, { is: isCustomElement })
      } else {
        el = document.createElementNS(ns, tag)
      }
    } else if (tag === COMMENT_TAG) {
      return document.createComment(props.comment)
    } else if (isCustomElement) {
      el = document.createElement(tag, { is: isCustomElement })
    } else {
      el = document.createElement(tag)
    }

    // Create the properties
    for (var p in props) {
      if (props.hasOwnProperty(p)) {
        var key = p.toLowerCase()
        var val = props[p]
        // Normalize className
        if (key === 'classname') {
          key = 'class'
          p = 'class'
        }
        // The for attribute gets transformed to htmlFor, but we just set as for
        if (p === 'htmlFor') {
          p = 'for'
        }
        // If a property is boolean, set itself to the key
        if (BOOL_PROPS.indexOf(key) !== -1) {
          if (String(val) === 'true') val = key
          else if (String(val) === 'false') continue
        }
        // If a property prefers being set directly vs setAttribute
        if (key.slice(0, 2) === 'on' || DIRECT_PROPS.indexOf(key) !== -1) {
          el[p] = val
        } else {
          if (ns) {
            if (p === 'xlink:href') {
              el.setAttributeNS(XLINKNS, p, val)
            } else if (/^xmlns($|:)/i.test(p)) {
              // skip xmlns definitions
            } else {
              el.setAttributeNS(null, p, val)
            }
          } else {
            el.setAttribute(p, val)
          }
        }
      }
    }

    appendChild(el, children)
    return el
  }

  function createFragment (nodes) {
    var fragment = document.createDocumentFragment()
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i] == null) continue
      if (Array.isArray(nodes[i])) {
        fragment.appendChild(createFragment(nodes[i]))
      } else {
        if (typeof nodes[i] === 'string') nodes[i] = document.createTextNode(nodes[i])
        fragment.appendChild(nodes[i])
      }
    }
    return fragment
  }

  var exports = hyperx(nanoHtmlCreateElement, {
    comments: true,
    createFragment: createFragment
  })
  exports.default = exports
  exports.createComment = nanoHtmlCreateElement
  return exports
}

},{"./append-child":4,"./bool-props":5,"./direct-props":7,"./svg-tags":9,"hyperx":3}],9:[function(require,module,exports){
'use strict'

module.exports = [
  'svg', 'altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor',
  'animateMotion', 'animateTransform', 'circle', 'clipPath', 'color-profile',
  'cursor', 'defs', 'desc', 'ellipse', 'feBlend', 'feColorMatrix',
  'feComponentTransfer', 'feComposite', 'feConvolveMatrix',
  'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood',
  'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage',
  'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight',
  'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence', 'filter',
  'font', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src',
  'font-face-uri', 'foreignObject', 'g', 'glyph', 'glyphRef', 'hkern', 'image',
  'line', 'linearGradient', 'marker', 'mask', 'metadata', 'missing-glyph',
  'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect',
  'set', 'stop', 'switch', 'symbol', 'text', 'textPath', 'title', 'tref',
  'tspan', 'use', 'view', 'vkern'
]

},{}],10:[function(require,module,exports){
const { config, locale, getVal, getDate, dateNames } = require('./config.js')
const html = require('nanohtml')

module.exports = generateChart



function generateChart(_data, { w, h, parent, sync, label, index, onSelectUpdate, onCursorUpdate = () => {}}) {
    const matchSyncKeys = (own, ext) => own == ext;
    let { color, transparentColor }  = config['k_std_']
    const innerContainer = html`<div style="margin-left:-20px;margin-top:-8px;margin-bottom:-8px;"></div>`
   // const legendInfo = html`<div></div>`
   const date = html`<div style="flex:1;text-align:right;margin-right:10px;/*font-size:1em*/"></div>`
   const data = html`<div style="color:${config['k_std_'].color};font-weight:bold;"></div>`
   let yMax = 30
   let yMin = 0

   // calculate initial r
  // const d = 0
    const fullChart = html`<div style="padding:5px;width:${w}px;">
        <div style="font-weight:bold">${label}</div>
        <div style="width:100%;display:flex;font-size:0.8em;justify-content:space-between;padding-right:10px;height:10px">${data}${date}</div>
        ${innerContainer}
    </div>`
    parent.appendChild(fullChart)

    function upDownFilter(type) {
        return syncedUpDown || (type != "mouseup" && type != "mousedown");
    }
    let opts = {
        title: "",
        id: "chart1",
        class: "my-chart",
        width: w+25,
        height: h-30,
        fmtDate: tpl => uPlot.fmtDate(tpl, dateNames),
        plugins: [
            testPlugin(onCursorUpdate)
          //  tooltipsPlugin(),
        ],
        hooks: {
            //setSelect
            // setScale
            // init: [ onSelectUpdate ],
            setData: [onSelectUpdate],
            // syncRect: [onSelectUpdate],
            // setSelect: [ onSelectUpdate ],
            setScale: [ onSelectUpdate ]
        },
        legend: { show: false },
        cursor: {
            y: false,
            //lock: true,
            points: {
                size: (u, seriesIdx) => seriesIdx == 1 || seriesIdx == 4 ? 0 : 10,
                width: (u, seriesIdx) => seriesIdx == 1 || seriesIdx == 4 ? 0 : 2
            },
            sync: {
                key: sync.key,
                setSeries: true,
                match: [matchSyncKeys, matchSyncKeys],
            }
        },
        series: [
            {  value: getDate, label: 'date'},
            { label: 'Raw Contact Index', width: 1.4, stroke: () => transparentColor, /*dash: [10, 5],*/ value: getVal },
            { label: config['k_std_'].label, stroke: () => color, width: 2, value: getVal },
        ],
        axes: [
            {
                scale: 'x', grid: { show: false },
                labelFont: "10px Helvetica Neue, Arial",
                font: '10px Helvetica Neue, Arial',
                values: [
                    // tick incr          default           year                             month    day                        hour     min                sec       mode
                    [3600 * 24 * 365, "{YYYY}", null, null, null, null, null, null, 1],
                    [3600 * 24 * 28, "{MMM}", "\n{YYYY}", null, null, null, null, null, 1],
                    [3600 * 24, "{DD}.{MM}", "\n{YYYY}", null, null, null, null, null, 1],
                    [3600, "", "\n{DD}.{MM}.{YYYY}", null, "\n{DD}.{MM}", null, null, null, 1],
                    // [60,                "{h}:{mm}{aa}",   "\n{M}/{D}/{YY}",                null,    "\n{M}/{D}",               null,    null,              null,        1],
                    // [1,                 ":{ss}",          "\n{M}/{D}/{YY} {h}:{mm}{aa}",   null,    "\n{M}/{D} {h}:{mm}{aa}",  null,    "\n{h}:{mm}{aa}",  null,        1],
                    // [0.001,             ":{ss}.{fff}",    "\n{M}/{D}/{YY} {h}:{mm}{aa}",   null,    "\n{M}/{D} {h}:{mm}{aa}",  null,    "\n{h}:{mm}{aa}",  null,        1],
                ],
            },
            {
                show: true,
                scale: 'y',
                font: '10px Helvetica Neue, Arial',
                labelFont: "bold 10px Helvetica Neue, Arial",
                // gap: 2,
                space: 20,
                grid: {
                    dash: [3, 6],
                    stroke: '#000',
                    width: 0.5
                },
            }
        ],
        scales: {
            y: {
                // auto: false,
                range: (u, dataMin, dataMax) => {
                //    return [0, Math.min(dataMax, 120)]
                 //  return [0, yMax]
                 //console.log('setting', yMin, yMax)
                  return [yMin, yMax]
                }
            }

        }
    };

    let uplot = new uPlot(opts, _data, innerContainer);
   // console.log('uPlot', uplot)
    // uPlot.setData
    uplot.updateColor = (_color = "#f00", _transparentColor) => {
        data.style.color = _color
        color = _color
        transparentColor = _transparentColor
    }

    uplot.updateYRange = (min = 0, max = 100) => {
        yMin = min
        yMax = max
       // console.log('updated', yMin, yMax)

    }

    uplot.updateSize = (w, h) => {
        fullChart.style.width = `${w}px`
        uplot.setSize({
            width: w+45,
            height: h-30
        })
    }

    uplot.updateLegend = (index, d) => {
        data.innerHTML = getVal(null, uplot.data[2][index])
        date.innerHTML = d
    }

    return uplot
}

/* Tooltip */

function testPlugin(onUpdate) {
    function init(u, opts, data){

    }

    function setCursor(u) {
        onUpdate(u.cursor.idx)
    }
    return {
        hooks: {
            init,
            setCursor
        },
    };
}

},{"./config.js":11,"nanohtml":6}],11:[function(require,module,exports){
/* Locale formatting */
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const locale = urlParams.get('lang') === 'en' ? 'en-CA' : 'de-DE'

// english and german version of state names. key (used in data table): [english, german]
const statesLookup = {
    "Baden-Wuerttemberg": ["Baden-Württemberg",	"Baden-Württemberg"],
    "Bayern": ["Bavaria", " Bayern"],
    "Berlin": ["Berlin", "Berlin"],
    "Brandenburg": ["Brandenburg", "Brandenburg"],
    "Bremen": ["Bremen", "Bremen"],
    "Hamburg": ["Hamburg", "Hamburg"],
    "Hessen": ["Hesse", "Hessen"],
    "Mecklenburg-Vorpommern": ["Mecklenburg-Western Pomerania", "Mecklenburg-Vorpommern"],
    "Niedersachsen": ["Lower Saxony", "Niedersachsen"],
    "Nordrhein-Westfalen": ["North Rhine-Westphalia", "Nordrhein-Westfalen"],
    "Rheinland-Pfalz": ["Rhineland-Palatine", "Rheinland-Pfalz"],
    "Saarland": ["Saarland", "Saarland"],
    "Sachsen": ["Saxony", "Sachsen"],
    "Sachsen-Anhalt": ["Saxony-Anhalt", "Sachsen-Anhalt"],
    "Schleswig-Holstein": ["Schleswig-Holstein", "Schleswig-Holstein"],
    "Thueringen": ["Thuringia", "Thüringen"]
}

const states = Object.keys(statesLookup)

const lookupIndex = locale == 'en-CA'? 0 : 1
const stateLabels = states.map((state) => statesLookup[state][lookupIndex])
// Baden-Württemberg	Baden-Württemberg
// Bavaria	Bayern
// Berlin	Berlin
// Brandenburg	Brandenburg	
// Bremen	Bremen
// Hamburg	Hamburg
// Hesse	Hessen	
// Lower Saxony	Niedersachsen	
// Mecklenburg-Western Pomerania	
// North Rhine-Westphalia	Nordrhein-Westfalen (NRW)	
// Rhineland-Palatinate	Rheinland-Pfalz	Mainz
// Saarland	Saarland
// Saxony	Sachsen	
// Saxony-Anhalt	Sachsen-Anhalt
// Schleswig-Holstein	Schleswig-Holstein
// Thuringia	Thüringen

const dateNames = locale == 'de-DE' ? {
    MMMM: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
    MMM: ["Jan", "Feb", "Mrz", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
    WWWW: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
    WWW: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
} : null

const numFormat = new Intl.NumberFormat(locale, { maximumSignificantDigits: 4 })

const getVal = (u, val) => val ? numFormat.format(val) : ''

const getDate = (val, t) => t ? new Date(t * 1000).toLocaleDateString(locale, { month: 'long', day: 'numeric', year: 'numeric' }) : ''

const config = {
    title: locale == 'en-CA' ? 'Number of Contacts' : 'Anzahl an Kontakten',
    syncLabel: locale == 'en-CA' ? 'align y-axis': 'gleiche y-Achse',
    'CX': {
        label: locale == 'en-CA' ? 'Contact Index' : 'Kontaktindex',
        color: 'teal',
        transparentColor: 'rgba(0, 128, 128, 0.5)'
    },
    'k_std_': {
        label: locale == 'en-CA' ? 'Standard Deviation' : 'Standardabweichung',
        color: 'teal',
        transparentColor: 'rgba(0, 128, 128, 0.3)'
    },
    'k_': {
        label: locale == 'en-CA' ? 'Average' : 'Mittelwert',
        color: '#eb822d',
        transparentColor: 'rgba(235, 130, 45, 0.3)'
        // color: 'rgba(255, 0, 0, 0.5)'
    }
    // 'k_7davg': {
    //     label: locale == 'en-CA' ? 'Average Contacts' : 'Durchschnittliche Kontakte',
    //     color: '#eb822d'
    // }
}

module.exports = {
    config: config,
    locale: locale,
    getVal: getVal,
    getDate: getDate,
    dateNames: dateNames,
    states: states,
    stateLabels: stateLabels
}

},{}],12:[function(require,module,exports){
/* parse CSV */
const { states, stateLabels } = require('./config.js')

const transformArray = (data) => {

    const timeseries = {}
    Object.keys(data[0]).forEach((key) => {
        timeseries[key] = data.map((d) => d[key])
    })
    return timeseries
}

const groupByState = (timeseries) => {
    return states.map(
        (state) => Object.entries(timeseries).filter(
            ([key, value]) => {
                if(key.indexOf(state) > -1) {
                    if(state !== "Sachsen") {
                        return true
                    } else {
                        if(key.indexOf("Anhalt") < 0) return true
                    }
                } 
                return false
            }
        )
    )
    .map((stateArray, i) => {
       //     console.log('stateArray', stateArray)
            const dataArrays = {}
            stateArray.forEach(([key, series]) => {
               // console.log(key, series)
                const dataType = key.replace(states[i], '')
                dataArrays[dataType] = series
            })
            return { name: states[i], data: dataArrays, label: stateLabels[i] }
    })
}
const loadData = (url, callback) => {
    Papa.parse(url, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: (file) => {
            file.data = file.data.filter((d) => d.date && d.date !== null)
            const data = transformArray(file.data)
            const dates = data.date.map((datestring, i) => Date.parse(datestring) / 1000)
          //  console.log('transforming', data)
            const stateSeries = groupByState(data)
          //  console.log(stateSeries)
            callback({
                data: stateSeries,
                dates: dates
            })
            //generateChart([dates, /*data['k'],*/ data['k_std'], data['k_std_7davg'], data['k_7davg'], data['k']])
        }
    })
}

module.exports = loadData
},{"./config.js":11}]},{},[1]);
