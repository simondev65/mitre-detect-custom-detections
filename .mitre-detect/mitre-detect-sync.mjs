#!/usr/bin/env node
// mitre-detect-sync: bundled from cribl-mitre-detect (tools/mitre-detect-sync). Apache-2.0.
import { createRequire as __cr } from 'node:module'; const require = __cr(import.meta.url);
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../packages/core/node_modules/yaml/dist/nodes/identity.js
var require_identity = __commonJS({
  "../../packages/core/node_modules/yaml/dist/nodes/identity.js"(exports) {
    "use strict";
    var ALIAS = /* @__PURE__ */ Symbol.for("yaml.alias");
    var DOC = /* @__PURE__ */ Symbol.for("yaml.document");
    var MAP = /* @__PURE__ */ Symbol.for("yaml.map");
    var PAIR = /* @__PURE__ */ Symbol.for("yaml.pair");
    var SCALAR = /* @__PURE__ */ Symbol.for("yaml.scalar");
    var SEQ = /* @__PURE__ */ Symbol.for("yaml.seq");
    var NODE_TYPE = /* @__PURE__ */ Symbol.for("yaml.node.type");
    var isAlias = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === ALIAS;
    var isDocument = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === DOC;
    var isMap2 = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === MAP;
    var isPair = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === PAIR;
    var isScalar = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SCALAR;
    var isSeq = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SEQ;
    function isCollection(node) {
      if (node && typeof node === "object")
        switch (node[NODE_TYPE]) {
          case MAP:
          case SEQ:
            return true;
        }
      return false;
    }
    function isNode(node) {
      if (node && typeof node === "object")
        switch (node[NODE_TYPE]) {
          case ALIAS:
          case MAP:
          case SCALAR:
          case SEQ:
            return true;
        }
      return false;
    }
    var hasAnchor = (node) => (isScalar(node) || isCollection(node)) && !!node.anchor;
    exports.ALIAS = ALIAS;
    exports.DOC = DOC;
    exports.MAP = MAP;
    exports.NODE_TYPE = NODE_TYPE;
    exports.PAIR = PAIR;
    exports.SCALAR = SCALAR;
    exports.SEQ = SEQ;
    exports.hasAnchor = hasAnchor;
    exports.isAlias = isAlias;
    exports.isCollection = isCollection;
    exports.isDocument = isDocument;
    exports.isMap = isMap2;
    exports.isNode = isNode;
    exports.isPair = isPair;
    exports.isScalar = isScalar;
    exports.isSeq = isSeq;
  }
});

// ../../packages/core/node_modules/yaml/dist/visit.js
var require_visit = __commonJS({
  "../../packages/core/node_modules/yaml/dist/visit.js"(exports) {
    "use strict";
    var identity = require_identity();
    var BREAK = /* @__PURE__ */ Symbol("break visit");
    var SKIP = /* @__PURE__ */ Symbol("skip children");
    var REMOVE = /* @__PURE__ */ Symbol("remove node");
    function visit(node, visitor) {
      const visitor_ = initVisitor(visitor);
      if (identity.isDocument(node)) {
        const cd = visit_(null, node.contents, visitor_, Object.freeze([node]));
        if (cd === REMOVE)
          node.contents = null;
      } else
        visit_(null, node, visitor_, Object.freeze([]));
    }
    visit.BREAK = BREAK;
    visit.SKIP = SKIP;
    visit.REMOVE = REMOVE;
    function visit_(key, node, visitor, path3) {
      const ctrl = callVisitor(key, node, visitor, path3);
      if (identity.isNode(ctrl) || identity.isPair(ctrl)) {
        replaceNode(key, path3, ctrl);
        return visit_(key, ctrl, visitor, path3);
      }
      if (typeof ctrl !== "symbol") {
        if (identity.isCollection(node)) {
          path3 = Object.freeze(path3.concat(node));
          for (let i = 0; i < node.items.length; ++i) {
            const ci = visit_(i, node.items[i], visitor, path3);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              node.items.splice(i, 1);
              i -= 1;
            }
          }
        } else if (identity.isPair(node)) {
          path3 = Object.freeze(path3.concat(node));
          const ck = visit_("key", node.key, visitor, path3);
          if (ck === BREAK)
            return BREAK;
          else if (ck === REMOVE)
            node.key = null;
          const cv = visit_("value", node.value, visitor, path3);
          if (cv === BREAK)
            return BREAK;
          else if (cv === REMOVE)
            node.value = null;
        }
      }
      return ctrl;
    }
    async function visitAsync(node, visitor) {
      const visitor_ = initVisitor(visitor);
      if (identity.isDocument(node)) {
        const cd = await visitAsync_(null, node.contents, visitor_, Object.freeze([node]));
        if (cd === REMOVE)
          node.contents = null;
      } else
        await visitAsync_(null, node, visitor_, Object.freeze([]));
    }
    visitAsync.BREAK = BREAK;
    visitAsync.SKIP = SKIP;
    visitAsync.REMOVE = REMOVE;
    async function visitAsync_(key, node, visitor, path3) {
      const ctrl = await callVisitor(key, node, visitor, path3);
      if (identity.isNode(ctrl) || identity.isPair(ctrl)) {
        replaceNode(key, path3, ctrl);
        return visitAsync_(key, ctrl, visitor, path3);
      }
      if (typeof ctrl !== "symbol") {
        if (identity.isCollection(node)) {
          path3 = Object.freeze(path3.concat(node));
          for (let i = 0; i < node.items.length; ++i) {
            const ci = await visitAsync_(i, node.items[i], visitor, path3);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              node.items.splice(i, 1);
              i -= 1;
            }
          }
        } else if (identity.isPair(node)) {
          path3 = Object.freeze(path3.concat(node));
          const ck = await visitAsync_("key", node.key, visitor, path3);
          if (ck === BREAK)
            return BREAK;
          else if (ck === REMOVE)
            node.key = null;
          const cv = await visitAsync_("value", node.value, visitor, path3);
          if (cv === BREAK)
            return BREAK;
          else if (cv === REMOVE)
            node.value = null;
        }
      }
      return ctrl;
    }
    function initVisitor(visitor) {
      if (typeof visitor === "object" && (visitor.Collection || visitor.Node || visitor.Value)) {
        return Object.assign({
          Alias: visitor.Node,
          Map: visitor.Node,
          Scalar: visitor.Node,
          Seq: visitor.Node
        }, visitor.Value && {
          Map: visitor.Value,
          Scalar: visitor.Value,
          Seq: visitor.Value
        }, visitor.Collection && {
          Map: visitor.Collection,
          Seq: visitor.Collection
        }, visitor);
      }
      return visitor;
    }
    function callVisitor(key, node, visitor, path3) {
      if (typeof visitor === "function")
        return visitor(key, node, path3);
      if (identity.isMap(node))
        return visitor.Map?.(key, node, path3);
      if (identity.isSeq(node))
        return visitor.Seq?.(key, node, path3);
      if (identity.isPair(node))
        return visitor.Pair?.(key, node, path3);
      if (identity.isScalar(node))
        return visitor.Scalar?.(key, node, path3);
      if (identity.isAlias(node))
        return visitor.Alias?.(key, node, path3);
      return void 0;
    }
    function replaceNode(key, path3, node) {
      const parent = path3[path3.length - 1];
      if (identity.isCollection(parent)) {
        parent.items[key] = node;
      } else if (identity.isPair(parent)) {
        if (key === "key")
          parent.key = node;
        else
          parent.value = node;
      } else if (identity.isDocument(parent)) {
        parent.contents = node;
      } else {
        const pt = identity.isAlias(parent) ? "alias" : "scalar";
        throw new Error(`Cannot replace node with ${pt} parent`);
      }
    }
    exports.visit = visit;
    exports.visitAsync = visitAsync;
  }
});

// ../../packages/core/node_modules/yaml/dist/doc/directives.js
var require_directives = __commonJS({
  "../../packages/core/node_modules/yaml/dist/doc/directives.js"(exports) {
    "use strict";
    var identity = require_identity();
    var visit = require_visit();
    var escapeChars = {
      "!": "%21",
      ",": "%2C",
      "[": "%5B",
      "]": "%5D",
      "{": "%7B",
      "}": "%7D"
    };
    var escapeTagName = (tn) => tn.replace(/[!,[\]{}]/g, (ch) => escapeChars[ch]);
    var Directives = class _Directives {
      constructor(yaml, tags) {
        this.docStart = null;
        this.docEnd = false;
        this.yaml = Object.assign({}, _Directives.defaultYaml, yaml);
        this.tags = Object.assign({}, _Directives.defaultTags, tags);
      }
      clone() {
        const copy = new _Directives(this.yaml, this.tags);
        copy.docStart = this.docStart;
        return copy;
      }
      /**
       * During parsing, get a Directives instance for the current document and
       * update the stream state according to the current version's spec.
       */
      atDocument() {
        const res = new _Directives(this.yaml, this.tags);
        switch (this.yaml.version) {
          case "1.1":
            this.atNextDocument = true;
            break;
          case "1.2":
            this.atNextDocument = false;
            this.yaml = {
              explicit: _Directives.defaultYaml.explicit,
              version: "1.2"
            };
            this.tags = Object.assign({}, _Directives.defaultTags);
            break;
        }
        return res;
      }
      /**
       * @param onError - May be called even if the action was successful
       * @returns `true` on success
       */
      add(line, onError) {
        if (this.atNextDocument) {
          this.yaml = { explicit: _Directives.defaultYaml.explicit, version: "1.1" };
          this.tags = Object.assign({}, _Directives.defaultTags);
          this.atNextDocument = false;
        }
        const parts = line.trim().split(/[ \t]+/);
        const name = parts.shift();
        switch (name) {
          case "%TAG": {
            if (parts.length !== 2) {
              onError(0, "%TAG directive should contain exactly two parts");
              if (parts.length < 2)
                return false;
            }
            const [handle, prefix] = parts;
            this.tags[handle] = prefix;
            return true;
          }
          case "%YAML": {
            this.yaml.explicit = true;
            if (parts.length !== 1) {
              onError(0, "%YAML directive should contain exactly one part");
              return false;
            }
            const [version] = parts;
            if (version === "1.1" || version === "1.2") {
              this.yaml.version = version;
              return true;
            } else {
              const isValid = /^\d+\.\d+$/.test(version);
              onError(6, `Unsupported YAML version ${version}`, isValid);
              return false;
            }
          }
          default:
            onError(0, `Unknown directive ${name}`, true);
            return false;
        }
      }
      /**
       * Resolves a tag, matching handles to those defined in %TAG directives.
       *
       * @returns Resolved tag, which may also be the non-specific tag `'!'` or a
       *   `'!local'` tag, or `null` if unresolvable.
       */
      tagName(source, onError) {
        if (source === "!")
          return "!";
        if (source[0] !== "!") {
          onError(`Not a valid tag: ${source}`);
          return null;
        }
        if (source[1] === "<") {
          const verbatim = source.slice(2, -1);
          if (verbatim === "!" || verbatim === "!!") {
            onError(`Verbatim tags aren't resolved, so ${source} is invalid.`);
            return null;
          }
          if (source[source.length - 1] !== ">")
            onError("Verbatim tags must end with a >");
          return verbatim;
        }
        const [, handle, suffix] = source.match(/^(.*!)([^!]*)$/s);
        if (!suffix)
          onError(`The ${source} tag has no suffix`);
        const prefix = this.tags[handle];
        if (prefix) {
          try {
            return prefix + decodeURIComponent(suffix);
          } catch (error) {
            onError(String(error));
            return null;
          }
        }
        if (handle === "!")
          return source;
        onError(`Could not resolve tag: ${source}`);
        return null;
      }
      /**
       * Given a fully resolved tag, returns its printable string form,
       * taking into account current tag prefixes and defaults.
       */
      tagString(tag) {
        for (const [handle, prefix] of Object.entries(this.tags)) {
          if (tag.startsWith(prefix))
            return handle + escapeTagName(tag.substring(prefix.length));
        }
        return tag[0] === "!" ? tag : `!<${tag}>`;
      }
      toString(doc) {
        const lines = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [];
        const tagEntries = Object.entries(this.tags);
        let tagNames;
        if (doc && tagEntries.length > 0 && identity.isNode(doc.contents)) {
          const tags = {};
          visit.visit(doc.contents, (_key, node) => {
            if (identity.isNode(node) && node.tag)
              tags[node.tag] = true;
          });
          tagNames = Object.keys(tags);
        } else
          tagNames = [];
        for (const [handle, prefix] of tagEntries) {
          if (handle === "!!" && prefix === "tag:yaml.org,2002:")
            continue;
          if (!doc || tagNames.some((tn) => tn.startsWith(prefix)))
            lines.push(`%TAG ${handle} ${prefix}`);
        }
        return lines.join("\n");
      }
    };
    Directives.defaultYaml = { explicit: false, version: "1.2" };
    Directives.defaultTags = { "!!": "tag:yaml.org,2002:" };
    exports.Directives = Directives;
  }
});

// ../../packages/core/node_modules/yaml/dist/doc/anchors.js
var require_anchors = __commonJS({
  "../../packages/core/node_modules/yaml/dist/doc/anchors.js"(exports) {
    "use strict";
    var identity = require_identity();
    var visit = require_visit();
    function anchorIsValid(anchor) {
      if (/[\x00-\x19\s,[\]{}]/.test(anchor)) {
        const sa = JSON.stringify(anchor);
        const msg = `Anchor must not contain whitespace or control characters: ${sa}`;
        throw new Error(msg);
      }
      return true;
    }
    function anchorNames(root) {
      const anchors = /* @__PURE__ */ new Set();
      visit.visit(root, {
        Value(_key, node) {
          if (node.anchor)
            anchors.add(node.anchor);
        }
      });
      return anchors;
    }
    function findNewAnchor(prefix, exclude) {
      for (let i = 1; true; ++i) {
        const name = `${prefix}${i}`;
        if (!exclude.has(name))
          return name;
      }
    }
    function createNodeAnchors(doc, prefix) {
      const aliasObjects = [];
      const sourceObjects = /* @__PURE__ */ new Map();
      let prevAnchors = null;
      return {
        onAnchor: (source) => {
          aliasObjects.push(source);
          prevAnchors ?? (prevAnchors = anchorNames(doc));
          const anchor = findNewAnchor(prefix, prevAnchors);
          prevAnchors.add(anchor);
          return anchor;
        },
        /**
         * With circular references, the source node is only resolved after all
         * of its child nodes are. This is why anchors are set only after all of
         * the nodes have been created.
         */
        setAnchors: () => {
          for (const source of aliasObjects) {
            const ref = sourceObjects.get(source);
            if (typeof ref === "object" && ref.anchor && (identity.isScalar(ref.node) || identity.isCollection(ref.node))) {
              ref.node.anchor = ref.anchor;
            } else {
              const error = new Error("Failed to resolve repeated object (this should not happen)");
              error.source = source;
              throw error;
            }
          }
        },
        sourceObjects
      };
    }
    exports.anchorIsValid = anchorIsValid;
    exports.anchorNames = anchorNames;
    exports.createNodeAnchors = createNodeAnchors;
    exports.findNewAnchor = findNewAnchor;
  }
});

// ../../packages/core/node_modules/yaml/dist/doc/applyReviver.js
var require_applyReviver = __commonJS({
  "../../packages/core/node_modules/yaml/dist/doc/applyReviver.js"(exports) {
    "use strict";
    function applyReviver(reviver, obj, key, val) {
      if (val && typeof val === "object") {
        if (Array.isArray(val)) {
          for (let i = 0, len = val.length; i < len; ++i) {
            const v0 = val[i];
            const v1 = applyReviver(reviver, val, String(i), v0);
            if (v1 === void 0)
              delete val[i];
            else if (v1 !== v0)
              val[i] = v1;
          }
        } else if (val instanceof Map) {
          for (const k of Array.from(val.keys())) {
            const v0 = val.get(k);
            const v1 = applyReviver(reviver, val, k, v0);
            if (v1 === void 0)
              val.delete(k);
            else if (v1 !== v0)
              val.set(k, v1);
          }
        } else if (val instanceof Set) {
          for (const v0 of Array.from(val)) {
            const v1 = applyReviver(reviver, val, v0, v0);
            if (v1 === void 0)
              val.delete(v0);
            else if (v1 !== v0) {
              val.delete(v0);
              val.add(v1);
            }
          }
        } else {
          for (const [k, v0] of Object.entries(val)) {
            const v1 = applyReviver(reviver, val, k, v0);
            if (v1 === void 0)
              delete val[k];
            else if (v1 !== v0)
              val[k] = v1;
          }
        }
      }
      return reviver.call(obj, key, val);
    }
    exports.applyReviver = applyReviver;
  }
});

// ../../packages/core/node_modules/yaml/dist/nodes/toJS.js
var require_toJS = __commonJS({
  "../../packages/core/node_modules/yaml/dist/nodes/toJS.js"(exports) {
    "use strict";
    var identity = require_identity();
    function toJS(value, arg, ctx) {
      if (Array.isArray(value))
        return value.map((v, i) => toJS(v, String(i), ctx));
      if (value && typeof value.toJSON === "function") {
        if (!ctx || !identity.hasAnchor(value))
          return value.toJSON(arg, ctx);
        const data = { aliasCount: 0, count: 1, res: void 0 };
        ctx.anchors.set(value, data);
        ctx.onCreate = (res2) => {
          data.res = res2;
          delete ctx.onCreate;
        };
        const res = value.toJSON(arg, ctx);
        if (ctx.onCreate)
          ctx.onCreate(res);
        return res;
      }
      if (typeof value === "bigint" && !ctx?.keep)
        return Number(value);
      return value;
    }
    exports.toJS = toJS;
  }
});

// ../../packages/core/node_modules/yaml/dist/nodes/Node.js
var require_Node = __commonJS({
  "../../packages/core/node_modules/yaml/dist/nodes/Node.js"(exports) {
    "use strict";
    var applyReviver = require_applyReviver();
    var identity = require_identity();
    var toJS = require_toJS();
    var NodeBase = class {
      constructor(type) {
        Object.defineProperty(this, identity.NODE_TYPE, { value: type });
      }
      /** Create a copy of this node.  */
      clone() {
        const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /** A plain JavaScript representation of this node. */
      toJS(doc, { mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
        if (!identity.isDocument(doc))
          throw new TypeError("A document argument is required");
        const ctx = {
          anchors: /* @__PURE__ */ new Map(),
          doc,
          keep: true,
          mapAsMap: mapAsMap === true,
          mapKeyWarned: false,
          maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
        };
        const res = toJS.toJS(this, "", ctx);
        if (typeof onAnchor === "function")
          for (const { count, res: res2 } of ctx.anchors.values())
            onAnchor(res2, count);
        return typeof reviver === "function" ? applyReviver.applyReviver(reviver, { "": res }, "", res) : res;
      }
    };
    exports.NodeBase = NodeBase;
  }
});

// ../../packages/core/node_modules/yaml/dist/nodes/Alias.js
var require_Alias = __commonJS({
  "../../packages/core/node_modules/yaml/dist/nodes/Alias.js"(exports) {
    "use strict";
    var anchors = require_anchors();
    var visit = require_visit();
    var identity = require_identity();
    var Node = require_Node();
    var toJS = require_toJS();
    var Alias = class extends Node.NodeBase {
      constructor(source) {
        super(identity.ALIAS);
        this.source = source;
        Object.defineProperty(this, "tag", {
          set() {
            throw new Error("Alias nodes cannot have tags");
          }
        });
      }
      /**
       * Resolve the value of this alias within `doc`, finding the last
       * instance of the `source` anchor before this node.
       */
      resolve(doc, ctx) {
        if (ctx?.maxAliasCount === 0)
          throw new ReferenceError("Alias resolution is disabled");
        let nodes;
        if (ctx?.aliasResolveCache) {
          nodes = ctx.aliasResolveCache;
        } else {
          nodes = [];
          visit.visit(doc, {
            Node: (_key, node) => {
              if (identity.isAlias(node) || identity.hasAnchor(node))
                nodes.push(node);
            }
          });
          if (ctx)
            ctx.aliasResolveCache = nodes;
        }
        let found = void 0;
        for (const node of nodes) {
          if (node === this)
            break;
          if (node.anchor === this.source)
            found = node;
        }
        if (found && ctx) {
          const { anchors: anchors2, doc: doc2, maxAliasCount } = ctx;
          let data = anchors2.get(found);
          if (!data) {
            toJS.toJS(found, null, ctx);
            data = anchors2.get(found);
          }
          if (data?.res === void 0) {
            const msg = "This should not happen: Alias anchor was not resolved?";
            throw new ReferenceError(msg);
          }
          if (maxAliasCount >= 0) {
            data.count += 1;
            if (data.aliasCount === 0)
              data.aliasCount = getAliasCount(doc2, found, anchors2);
            if (data.count * data.aliasCount > maxAliasCount) {
              const msg = "Excessive alias count indicates a resource exhaustion attack";
              throw new ReferenceError(msg);
            }
          }
        }
        return found;
      }
      toJSON(_arg, ctx) {
        if (!ctx)
          return { source: this.source };
        const source = this.resolve(ctx.doc, ctx);
        if (!source) {
          const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
          throw new ReferenceError(msg);
        }
        return ctx.anchors.get(source).res;
      }
      toString(ctx, _onComment, _onChompKeep) {
        const src = `*${this.source}`;
        if (ctx) {
          anchors.anchorIsValid(this.source);
          if (ctx.options.verifyAliasOrder && !ctx.anchors.has(this.source)) {
            const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
            throw new Error(msg);
          }
          if (ctx.implicitKey)
            return `${src} `;
        }
        return src;
      }
    };
    function getAliasCount(doc, node, anchors2) {
      if (identity.isAlias(node)) {
        const source = node.resolve(doc);
        const anchor = anchors2 && source && anchors2.get(source);
        return anchor ? anchor.count * anchor.aliasCount : 0;
      } else if (identity.isCollection(node)) {
        let count = 0;
        for (const item of node.items) {
          const c = getAliasCount(doc, item, anchors2);
          if (c > count)
            count = c;
        }
        return count;
      } else if (identity.isPair(node)) {
        const kc = getAliasCount(doc, node.key, anchors2);
        const vc = getAliasCount(doc, node.value, anchors2);
        return Math.max(kc, vc);
      }
      return 1;
    }
    exports.Alias = Alias;
  }
});

// ../../packages/core/node_modules/yaml/dist/nodes/Scalar.js
var require_Scalar = __commonJS({
  "../../packages/core/node_modules/yaml/dist/nodes/Scalar.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Node = require_Node();
    var toJS = require_toJS();
    var isScalarValue = (value) => !value || typeof value !== "function" && typeof value !== "object";
    var Scalar = class extends Node.NodeBase {
      constructor(value) {
        super(identity.SCALAR);
        this.value = value;
      }
      toJSON(arg, ctx) {
        return ctx?.keep ? this.value : toJS.toJS(this.value, arg, ctx);
      }
      toString() {
        return String(this.value);
      }
    };
    Scalar.BLOCK_FOLDED = "BLOCK_FOLDED";
    Scalar.BLOCK_LITERAL = "BLOCK_LITERAL";
    Scalar.PLAIN = "PLAIN";
    Scalar.QUOTE_DOUBLE = "QUOTE_DOUBLE";
    Scalar.QUOTE_SINGLE = "QUOTE_SINGLE";
    exports.Scalar = Scalar;
    exports.isScalarValue = isScalarValue;
  }
});

// ../../packages/core/node_modules/yaml/dist/doc/createNode.js
var require_createNode = __commonJS({
  "../../packages/core/node_modules/yaml/dist/doc/createNode.js"(exports) {
    "use strict";
    var Alias = require_Alias();
    var identity = require_identity();
    var Scalar = require_Scalar();
    var defaultTagPrefix = "tag:yaml.org,2002:";
    function findTagObject(value, tagName, tags) {
      if (tagName) {
        const match = tags.filter((t) => t.tag === tagName);
        const tagObj = match.find((t) => !t.format) ?? match[0];
        if (!tagObj)
          throw new Error(`Tag ${tagName} not found`);
        return tagObj;
      }
      return tags.find((t) => t.identify?.(value) && !t.format);
    }
    function createNode(value, tagName, ctx) {
      if (identity.isDocument(value))
        value = value.contents;
      if (identity.isNode(value))
        return value;
      if (identity.isPair(value)) {
        const map = ctx.schema[identity.MAP].createNode?.(ctx.schema, null, ctx);
        map.items.push(value);
        return map;
      }
      if (value instanceof String || value instanceof Number || value instanceof Boolean || typeof BigInt !== "undefined" && value instanceof BigInt) {
        value = value.valueOf();
      }
      const { aliasDuplicateObjects, onAnchor, onTagObj, schema, sourceObjects } = ctx;
      let ref = void 0;
      if (aliasDuplicateObjects && value && typeof value === "object") {
        ref = sourceObjects.get(value);
        if (ref) {
          ref.anchor ?? (ref.anchor = onAnchor(value));
          return new Alias.Alias(ref.anchor);
        } else {
          ref = { anchor: null, node: null };
          sourceObjects.set(value, ref);
        }
      }
      if (tagName?.startsWith("!!"))
        tagName = defaultTagPrefix + tagName.slice(2);
      let tagObj = findTagObject(value, tagName, schema.tags);
      if (!tagObj) {
        if (value && typeof value.toJSON === "function") {
          value = value.toJSON();
        }
        if (!value || typeof value !== "object") {
          const node2 = new Scalar.Scalar(value);
          if (ref)
            ref.node = node2;
          return node2;
        }
        tagObj = value instanceof Map ? schema[identity.MAP] : Symbol.iterator in Object(value) ? schema[identity.SEQ] : schema[identity.MAP];
      }
      if (onTagObj) {
        onTagObj(tagObj);
        delete ctx.onTagObj;
      }
      const node = tagObj?.createNode ? tagObj.createNode(ctx.schema, value, ctx) : typeof tagObj?.nodeClass?.from === "function" ? tagObj.nodeClass.from(ctx.schema, value, ctx) : new Scalar.Scalar(value);
      if (tagName)
        node.tag = tagName;
      else if (!tagObj.default)
        node.tag = tagObj.tag;
      if (ref)
        ref.node = node;
      return node;
    }
    exports.createNode = createNode;
  }
});

// ../../packages/core/node_modules/yaml/dist/nodes/Collection.js
var require_Collection = __commonJS({
  "../../packages/core/node_modules/yaml/dist/nodes/Collection.js"(exports) {
    "use strict";
    var createNode = require_createNode();
    var identity = require_identity();
    var Node = require_Node();
    function collectionFromPath(schema, path3, value) {
      let v = value;
      for (let i = path3.length - 1; i >= 0; --i) {
        const k = path3[i];
        if (typeof k === "number" && Number.isInteger(k) && k >= 0) {
          const a = [];
          a[k] = v;
          v = a;
        } else {
          v = /* @__PURE__ */ new Map([[k, v]]);
        }
      }
      return createNode.createNode(v, void 0, {
        aliasDuplicateObjects: false,
        keepUndefined: false,
        onAnchor: () => {
          throw new Error("This should not happen, please report a bug.");
        },
        schema,
        sourceObjects: /* @__PURE__ */ new Map()
      });
    }
    var isEmptyPath = (path3) => path3 == null || typeof path3 === "object" && !!path3[Symbol.iterator]().next().done;
    var Collection = class extends Node.NodeBase {
      constructor(type, schema) {
        super(type);
        Object.defineProperty(this, "schema", {
          value: schema,
          configurable: true,
          enumerable: false,
          writable: true
        });
      }
      /**
       * Create a copy of this collection.
       *
       * @param schema - If defined, overwrites the original's schema
       */
      clone(schema) {
        const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        if (schema)
          copy.schema = schema;
        copy.items = copy.items.map((it) => identity.isNode(it) || identity.isPair(it) ? it.clone(schema) : it);
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /**
       * Adds a value to the collection. For `!!map` and `!!omap` the value must
       * be a Pair instance or a `{ key, value }` object, which may not have a key
       * that already exists in the map.
       */
      addIn(path3, value) {
        if (isEmptyPath(path3))
          this.add(value);
        else {
          const [key, ...rest] = path3;
          const node = this.get(key, true);
          if (identity.isCollection(node))
            node.addIn(rest, value);
          else if (node === void 0 && this.schema)
            this.set(key, collectionFromPath(this.schema, rest, value));
          else
            throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
        }
      }
      /**
       * Removes a value from the collection.
       * @returns `true` if the item was found and removed.
       */
      deleteIn(path3) {
        const [key, ...rest] = path3;
        if (rest.length === 0)
          return this.delete(key);
        const node = this.get(key, true);
        if (identity.isCollection(node))
          return node.deleteIn(rest);
        else
          throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
      }
      /**
       * Returns item at `key`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      getIn(path3, keepScalar) {
        const [key, ...rest] = path3;
        const node = this.get(key, true);
        if (rest.length === 0)
          return !keepScalar && identity.isScalar(node) ? node.value : node;
        else
          return identity.isCollection(node) ? node.getIn(rest, keepScalar) : void 0;
      }
      hasAllNullValues(allowScalar) {
        return this.items.every((node) => {
          if (!identity.isPair(node))
            return false;
          const n = node.value;
          return n == null || allowScalar && identity.isScalar(n) && n.value == null && !n.commentBefore && !n.comment && !n.tag;
        });
      }
      /**
       * Checks if the collection includes a value with the key `key`.
       */
      hasIn(path3) {
        const [key, ...rest] = path3;
        if (rest.length === 0)
          return this.has(key);
        const node = this.get(key, true);
        return identity.isCollection(node) ? node.hasIn(rest) : false;
      }
      /**
       * Sets a value in this collection. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      setIn(path3, value) {
        const [key, ...rest] = path3;
        if (rest.length === 0) {
          this.set(key, value);
        } else {
          const node = this.get(key, true);
          if (identity.isCollection(node))
            node.setIn(rest, value);
          else if (node === void 0 && this.schema)
            this.set(key, collectionFromPath(this.schema, rest, value));
          else
            throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
        }
      }
    };
    exports.Collection = Collection;
    exports.collectionFromPath = collectionFromPath;
    exports.isEmptyPath = isEmptyPath;
  }
});

// ../../packages/core/node_modules/yaml/dist/stringify/stringifyComment.js
var require_stringifyComment = __commonJS({
  "../../packages/core/node_modules/yaml/dist/stringify/stringifyComment.js"(exports) {
    "use strict";
    var stringifyComment = (str) => str.replace(/^(?!$)(?: $)?/gm, "#");
    function indentComment(comment, indent) {
      if (/^\n+$/.test(comment))
        return comment.substring(1);
      return indent ? comment.replace(/^(?! *$)/gm, indent) : comment;
    }
    var lineComment = (str, indent, comment) => str.endsWith("\n") ? indentComment(comment, indent) : comment.includes("\n") ? "\n" + indentComment(comment, indent) : (str.endsWith(" ") ? "" : " ") + comment;
    exports.indentComment = indentComment;
    exports.lineComment = lineComment;
    exports.stringifyComment = stringifyComment;
  }
});

// ../../packages/core/node_modules/yaml/dist/stringify/foldFlowLines.js
var require_foldFlowLines = __commonJS({
  "../../packages/core/node_modules/yaml/dist/stringify/foldFlowLines.js"(exports) {
    "use strict";
    var FOLD_FLOW = "flow";
    var FOLD_BLOCK = "block";
    var FOLD_QUOTED = "quoted";
    function foldFlowLines(text, indent, mode = "flow", { indentAtStart, lineWidth = 80, minContentWidth = 20, onFold, onOverflow } = {}) {
      if (!lineWidth || lineWidth < 0)
        return text;
      if (lineWidth < minContentWidth)
        minContentWidth = 0;
      const endStep = Math.max(1 + minContentWidth, 1 + lineWidth - indent.length);
      if (text.length <= endStep)
        return text;
      const folds = [];
      const escapedFolds = {};
      let end = lineWidth - indent.length;
      if (typeof indentAtStart === "number") {
        if (indentAtStart > lineWidth - Math.max(2, minContentWidth))
          folds.push(0);
        else
          end = lineWidth - indentAtStart;
      }
      let split = void 0;
      let prev = void 0;
      let overflow = false;
      let i = -1;
      let escStart = -1;
      let escEnd = -1;
      if (mode === FOLD_BLOCK) {
        i = consumeMoreIndentedLines(text, i, indent.length);
        if (i !== -1)
          end = i + endStep;
      }
      for (let ch; ch = text[i += 1]; ) {
        if (mode === FOLD_QUOTED && ch === "\\") {
          escStart = i;
          switch (text[i + 1]) {
            case "x":
              i += 3;
              break;
            case "u":
              i += 5;
              break;
            case "U":
              i += 9;
              break;
            default:
              i += 1;
          }
          escEnd = i;
        }
        if (ch === "\n") {
          if (mode === FOLD_BLOCK)
            i = consumeMoreIndentedLines(text, i, indent.length);
          end = i + indent.length + endStep;
          split = void 0;
        } else {
          if (ch === " " && prev && prev !== " " && prev !== "\n" && prev !== "	") {
            const next = text[i + 1];
            if (next && next !== " " && next !== "\n" && next !== "	")
              split = i;
          }
          if (i >= end) {
            if (split) {
              folds.push(split);
              end = split + endStep;
              split = void 0;
            } else if (mode === FOLD_QUOTED) {
              while (prev === " " || prev === "	") {
                prev = ch;
                ch = text[i += 1];
                overflow = true;
              }
              const j = i > escEnd + 1 ? i - 2 : escStart - 1;
              if (escapedFolds[j])
                return text;
              folds.push(j);
              escapedFolds[j] = true;
              end = j + endStep;
              split = void 0;
            } else {
              overflow = true;
            }
          }
        }
        prev = ch;
      }
      if (overflow && onOverflow)
        onOverflow();
      if (folds.length === 0)
        return text;
      if (onFold)
        onFold();
      let res = text.slice(0, folds[0]);
      for (let i2 = 0; i2 < folds.length; ++i2) {
        const fold = folds[i2];
        const end2 = folds[i2 + 1] || text.length;
        if (fold === 0)
          res = `
${indent}${text.slice(0, end2)}`;
        else {
          if (mode === FOLD_QUOTED && escapedFolds[fold])
            res += `${text[fold]}\\`;
          res += `
${indent}${text.slice(fold + 1, end2)}`;
        }
      }
      return res;
    }
    function consumeMoreIndentedLines(text, i, indent) {
      let end = i;
      let start = i + 1;
      let ch = text[start];
      while (ch === " " || ch === "	") {
        if (i < start + indent) {
          ch = text[++i];
        } else {
          do {
            ch = text[++i];
          } while (ch && ch !== "\n");
          end = i;
          start = i + 1;
          ch = text[start];
        }
      }
      return end;
    }
    exports.FOLD_BLOCK = FOLD_BLOCK;
    exports.FOLD_FLOW = FOLD_FLOW;
    exports.FOLD_QUOTED = FOLD_QUOTED;
    exports.foldFlowLines = foldFlowLines;
  }
});

// ../../packages/core/node_modules/yaml/dist/stringify/stringifyString.js
var require_stringifyString = __commonJS({
  "../../packages/core/node_modules/yaml/dist/stringify/stringifyString.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var foldFlowLines = require_foldFlowLines();
    var getFoldOptions = (ctx, isBlock) => ({
      indentAtStart: isBlock ? ctx.indent.length : ctx.indentAtStart,
      lineWidth: ctx.options.lineWidth,
      minContentWidth: ctx.options.minContentWidth
    });
    var containsDocumentMarker = (str) => /^(%|---|\.\.\.)/m.test(str);
    function lineLengthOverLimit(str, lineWidth, indentLength) {
      if (!lineWidth || lineWidth < 0)
        return false;
      const limit = lineWidth - indentLength;
      const strLen = str.length;
      if (strLen <= limit)
        return false;
      for (let i = 0, start = 0; i < strLen; ++i) {
        if (str[i] === "\n") {
          if (i - start > limit)
            return true;
          start = i + 1;
          if (strLen - start <= limit)
            return false;
        }
      }
      return true;
    }
    function doubleQuotedString(value, ctx) {
      const json = JSON.stringify(value);
      if (ctx.options.doubleQuotedAsJSON)
        return json;
      const { implicitKey } = ctx;
      const minMultiLineLength = ctx.options.doubleQuotedMinMultiLineLength;
      const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
      let str = "";
      let start = 0;
      for (let i = 0, ch = json[i]; ch; ch = json[++i]) {
        if (ch === " " && json[i + 1] === "\\" && json[i + 2] === "n") {
          str += json.slice(start, i) + "\\ ";
          i += 1;
          start = i;
          ch = "\\";
        }
        if (ch === "\\")
          switch (json[i + 1]) {
            case "u":
              {
                str += json.slice(start, i);
                const code = json.substr(i + 2, 4);
                switch (code) {
                  case "0000":
                    str += "\\0";
                    break;
                  case "0007":
                    str += "\\a";
                    break;
                  case "000b":
                    str += "\\v";
                    break;
                  case "001b":
                    str += "\\e";
                    break;
                  case "0085":
                    str += "\\N";
                    break;
                  case "00a0":
                    str += "\\_";
                    break;
                  case "2028":
                    str += "\\L";
                    break;
                  case "2029":
                    str += "\\P";
                    break;
                  default:
                    if (code.substr(0, 2) === "00")
                      str += "\\x" + code.substr(2);
                    else
                      str += json.substr(i, 6);
                }
                i += 5;
                start = i + 1;
              }
              break;
            case "n":
              if (implicitKey || json[i + 2] === '"' || json.length < minMultiLineLength) {
                i += 1;
              } else {
                str += json.slice(start, i) + "\n\n";
                while (json[i + 2] === "\\" && json[i + 3] === "n" && json[i + 4] !== '"') {
                  str += "\n";
                  i += 2;
                }
                str += indent;
                if (json[i + 2] === " ")
                  str += "\\";
                i += 1;
                start = i + 1;
              }
              break;
            default:
              i += 1;
          }
      }
      str = start ? str + json.slice(start) : json;
      return implicitKey ? str : foldFlowLines.foldFlowLines(str, indent, foldFlowLines.FOLD_QUOTED, getFoldOptions(ctx, false));
    }
    function singleQuotedString(value, ctx) {
      if (ctx.options.singleQuote === false || ctx.implicitKey && value.includes("\n") || /[ \t]\n|\n[ \t]/.test(value))
        return doubleQuotedString(value, ctx);
      const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
      const res = "'" + value.replace(/'/g, "''").replace(/\n+/g, `$&
${indent}`) + "'";
      return ctx.implicitKey ? res : foldFlowLines.foldFlowLines(res, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx, false));
    }
    function quotedString(value, ctx) {
      const { singleQuote } = ctx.options;
      let qs;
      if (singleQuote === false)
        qs = doubleQuotedString;
      else {
        const hasDouble = value.includes('"');
        const hasSingle = value.includes("'");
        if (hasDouble && !hasSingle)
          qs = singleQuotedString;
        else if (hasSingle && !hasDouble)
          qs = doubleQuotedString;
        else
          qs = singleQuote ? singleQuotedString : doubleQuotedString;
      }
      return qs(value, ctx);
    }
    var blockEndNewlines;
    try {
      blockEndNewlines = new RegExp("(^|(?<!\n))\n+(?!\n|$)", "g");
    } catch {
      blockEndNewlines = /\n+(?!\n|$)/g;
    }
    function blockString({ comment, type, value }, ctx, onComment, onChompKeep) {
      const { blockQuote, commentString, lineWidth } = ctx.options;
      if (!blockQuote || /\n[\t ]+$/.test(value)) {
        return quotedString(value, ctx);
      }
      const indent = ctx.indent || (ctx.forceBlockIndent || containsDocumentMarker(value) ? "  " : "");
      const literal = blockQuote === "literal" ? true : blockQuote === "folded" || type === Scalar.Scalar.BLOCK_FOLDED ? false : type === Scalar.Scalar.BLOCK_LITERAL ? true : !lineLengthOverLimit(value, lineWidth, indent.length);
      if (!value)
        return literal ? "|\n" : ">\n";
      let chomp;
      let endStart;
      for (endStart = value.length; endStart > 0; --endStart) {
        const ch = value[endStart - 1];
        if (ch !== "\n" && ch !== "	" && ch !== " ")
          break;
      }
      let end = value.substring(endStart);
      const endNlPos = end.indexOf("\n");
      if (endNlPos === -1) {
        chomp = "-";
      } else if (value === end || endNlPos !== end.length - 1) {
        chomp = "+";
        if (onChompKeep)
          onChompKeep();
      } else {
        chomp = "";
      }
      if (end) {
        value = value.slice(0, -end.length);
        if (end[end.length - 1] === "\n")
          end = end.slice(0, -1);
        end = end.replace(blockEndNewlines, `$&${indent}`);
      }
      let startWithSpace = false;
      let startEnd;
      let startNlPos = -1;
      for (startEnd = 0; startEnd < value.length; ++startEnd) {
        const ch = value[startEnd];
        if (ch === " ")
          startWithSpace = true;
        else if (ch === "\n")
          startNlPos = startEnd;
        else
          break;
      }
      let start = value.substring(0, startNlPos < startEnd ? startNlPos + 1 : startEnd);
      if (start) {
        value = value.substring(start.length);
        start = start.replace(/\n+/g, `$&${indent}`);
      }
      const indentSize = indent ? "2" : "1";
      let header = (startWithSpace ? indentSize : "") + chomp;
      if (comment) {
        header += " " + commentString(comment.replace(/ ?[\r\n]+/g, " "));
        if (onComment)
          onComment();
      }
      if (!literal) {
        const foldedValue = value.replace(/\n+/g, "\n$&").replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2").replace(/\n+/g, `$&${indent}`);
        let literalFallback = false;
        const foldOptions = getFoldOptions(ctx, true);
        if (blockQuote !== "folded" && type !== Scalar.Scalar.BLOCK_FOLDED) {
          foldOptions.onOverflow = () => {
            literalFallback = true;
          };
        }
        const body = foldFlowLines.foldFlowLines(`${start}${foldedValue}${end}`, indent, foldFlowLines.FOLD_BLOCK, foldOptions);
        if (!literalFallback)
          return `>${header}
${indent}${body}`;
      }
      value = value.replace(/\n+/g, `$&${indent}`);
      return `|${header}
${indent}${start}${value}${end}`;
    }
    function plainString(item, ctx, onComment, onChompKeep) {
      const { type, value } = item;
      const { actualString, implicitKey, indent, indentStep, inFlow } = ctx;
      if (implicitKey && value.includes("\n") || inFlow && /[[\]{},]/.test(value)) {
        return quotedString(value, ctx);
      }
      if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(value)) {
        return implicitKey || inFlow || !value.includes("\n") ? quotedString(value, ctx) : blockString(item, ctx, onComment, onChompKeep);
      }
      if (!implicitKey && !inFlow && type !== Scalar.Scalar.PLAIN && value.includes("\n")) {
        return blockString(item, ctx, onComment, onChompKeep);
      }
      if (containsDocumentMarker(value)) {
        if (indent === "") {
          ctx.forceBlockIndent = true;
          return blockString(item, ctx, onComment, onChompKeep);
        } else if (implicitKey && indent === indentStep) {
          return quotedString(value, ctx);
        }
      }
      const str = value.replace(/\n+/g, `$&
${indent}`);
      if (actualString) {
        const test = (tag) => tag.default && tag.tag !== "tag:yaml.org,2002:str" && tag.test?.test(str);
        const { compat, tags } = ctx.doc.schema;
        if (tags.some(test) || compat?.some(test))
          return quotedString(value, ctx);
      }
      return implicitKey ? str : foldFlowLines.foldFlowLines(str, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx, false));
    }
    function stringifyString(item, ctx, onComment, onChompKeep) {
      const { implicitKey, inFlow } = ctx;
      const ss = typeof item.value === "string" ? item : Object.assign({}, item, { value: String(item.value) });
      let { type } = item;
      if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
        if (/[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(ss.value))
          type = Scalar.Scalar.QUOTE_DOUBLE;
      }
      const _stringify = (_type) => {
        switch (_type) {
          case Scalar.Scalar.BLOCK_FOLDED:
          case Scalar.Scalar.BLOCK_LITERAL:
            return implicitKey || inFlow ? quotedString(ss.value, ctx) : blockString(ss, ctx, onComment, onChompKeep);
          case Scalar.Scalar.QUOTE_DOUBLE:
            return doubleQuotedString(ss.value, ctx);
          case Scalar.Scalar.QUOTE_SINGLE:
            return singleQuotedString(ss.value, ctx);
          case Scalar.Scalar.PLAIN:
            return plainString(ss, ctx, onComment, onChompKeep);
          default:
            return null;
        }
      };
      let res = _stringify(type);
      if (res === null) {
        const { defaultKeyType, defaultStringType } = ctx.options;
        const t = implicitKey && defaultKeyType || defaultStringType;
        res = _stringify(t);
        if (res === null)
          throw new Error(`Unsupported default string type ${t}`);
      }
      return res;
    }
    exports.stringifyString = stringifyString;
  }
});

// ../../packages/core/node_modules/yaml/dist/stringify/stringify.js
var require_stringify = __commonJS({
  "../../packages/core/node_modules/yaml/dist/stringify/stringify.js"(exports) {
    "use strict";
    var anchors = require_anchors();
    var identity = require_identity();
    var stringifyComment = require_stringifyComment();
    var stringifyString = require_stringifyString();
    function createStringifyContext(doc, options) {
      const opt = Object.assign({
        blockQuote: true,
        commentString: stringifyComment.stringifyComment,
        defaultKeyType: null,
        defaultStringType: "PLAIN",
        directives: null,
        doubleQuotedAsJSON: false,
        doubleQuotedMinMultiLineLength: 40,
        falseStr: "false",
        flowCollectionPadding: true,
        indentSeq: true,
        lineWidth: 80,
        minContentWidth: 20,
        nullStr: "null",
        simpleKeys: false,
        singleQuote: null,
        trailingComma: false,
        trueStr: "true",
        verifyAliasOrder: true
      }, doc.schema.toStringOptions, options);
      let inFlow;
      switch (opt.collectionStyle) {
        case "block":
          inFlow = false;
          break;
        case "flow":
          inFlow = true;
          break;
        default:
          inFlow = null;
      }
      return {
        anchors: /* @__PURE__ */ new Set(),
        doc,
        flowCollectionPadding: opt.flowCollectionPadding ? " " : "",
        indent: "",
        indentStep: typeof opt.indent === "number" ? " ".repeat(opt.indent) : "  ",
        inFlow,
        options: opt
      };
    }
    function getTagObject(tags, item) {
      if (item.tag) {
        const match = tags.filter((t) => t.tag === item.tag);
        if (match.length > 0)
          return match.find((t) => t.format === item.format) ?? match[0];
      }
      let tagObj = void 0;
      let obj;
      if (identity.isScalar(item)) {
        obj = item.value;
        let match = tags.filter((t) => t.identify?.(obj));
        if (match.length > 1) {
          const testMatch = match.filter((t) => t.test);
          if (testMatch.length > 0)
            match = testMatch;
        }
        tagObj = match.find((t) => t.format === item.format) ?? match.find((t) => !t.format);
      } else {
        obj = item;
        tagObj = tags.find((t) => t.nodeClass && obj instanceof t.nodeClass);
      }
      if (!tagObj) {
        const name = obj?.constructor?.name ?? (obj === null ? "null" : typeof obj);
        throw new Error(`Tag not resolved for ${name} value`);
      }
      return tagObj;
    }
    function stringifyProps(node, tagObj, { anchors: anchors$1, doc }) {
      if (!doc.directives)
        return "";
      const props = [];
      const anchor = (identity.isScalar(node) || identity.isCollection(node)) && node.anchor;
      if (anchor && anchors.anchorIsValid(anchor)) {
        anchors$1.add(anchor);
        props.push(`&${anchor}`);
      }
      const tag = node.tag ?? (tagObj.default ? null : tagObj.tag);
      if (tag)
        props.push(doc.directives.tagString(tag));
      return props.join(" ");
    }
    function stringify(item, ctx, onComment, onChompKeep) {
      if (identity.isPair(item))
        return item.toString(ctx, onComment, onChompKeep);
      if (identity.isAlias(item)) {
        if (ctx.doc.directives)
          return item.toString(ctx);
        if (ctx.resolvedAliases?.has(item)) {
          throw new TypeError(`Cannot stringify circular structure without alias nodes`);
        } else {
          if (ctx.resolvedAliases)
            ctx.resolvedAliases.add(item);
          else
            ctx.resolvedAliases = /* @__PURE__ */ new Set([item]);
          item = item.resolve(ctx.doc);
        }
      }
      let tagObj = void 0;
      const node = identity.isNode(item) ? item : ctx.doc.createNode(item, { onTagObj: (o2) => tagObj = o2 });
      tagObj ?? (tagObj = getTagObject(ctx.doc.schema.tags, node));
      const props = stringifyProps(node, tagObj, ctx);
      if (props.length > 0)
        ctx.indentAtStart = (ctx.indentAtStart ?? 0) + props.length + 1;
      const str = typeof tagObj.stringify === "function" ? tagObj.stringify(node, ctx, onComment, onChompKeep) : identity.isScalar(node) ? stringifyString.stringifyString(node, ctx, onComment, onChompKeep) : node.toString(ctx, onComment, onChompKeep);
      if (!props)
        return str;
      return identity.isScalar(node) || str[0] === "{" || str[0] === "[" ? `${props} ${str}` : `${props}
${ctx.indent}${str}`;
    }
    exports.createStringifyContext = createStringifyContext;
    exports.stringify = stringify;
  }
});

// ../../packages/core/node_modules/yaml/dist/stringify/stringifyPair.js
var require_stringifyPair = __commonJS({
  "../../packages/core/node_modules/yaml/dist/stringify/stringifyPair.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var stringify = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyPair({ key, value }, ctx, onComment, onChompKeep) {
      const { allNullValues, doc, indent, indentStep, options: { commentString, indentSeq, simpleKeys } } = ctx;
      let keyComment = identity.isNode(key) && key.comment || null;
      if (simpleKeys) {
        if (keyComment) {
          throw new Error("With simple keys, key nodes cannot have comments");
        }
        if (identity.isCollection(key) || !identity.isNode(key) && typeof key === "object") {
          const msg = "With simple keys, collection cannot be used as a key value";
          throw new Error(msg);
        }
      }
      let explicitKey = !simpleKeys && (!key || keyComment && value == null && !ctx.inFlow || identity.isCollection(key) || (identity.isScalar(key) ? key.type === Scalar.Scalar.BLOCK_FOLDED || key.type === Scalar.Scalar.BLOCK_LITERAL : typeof key === "object"));
      ctx = Object.assign({}, ctx, {
        allNullValues: false,
        implicitKey: !explicitKey && (simpleKeys || !allNullValues),
        indent: indent + indentStep
      });
      let keyCommentDone = false;
      let chompKeep = false;
      let str = stringify.stringify(key, ctx, () => keyCommentDone = true, () => chompKeep = true);
      if (!explicitKey && !ctx.inFlow && str.length > 1024) {
        if (simpleKeys)
          throw new Error("With simple keys, single line scalar must not span more than 1024 characters");
        explicitKey = true;
      }
      if (ctx.inFlow) {
        if (allNullValues || value == null) {
          if (keyCommentDone && onComment)
            onComment();
          return str === "" ? "?" : explicitKey ? `? ${str}` : str;
        }
      } else if (allNullValues && !simpleKeys || value == null && explicitKey) {
        str = `? ${str}`;
        if (keyComment && !keyCommentDone) {
          str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
        } else if (chompKeep && onChompKeep)
          onChompKeep();
        return str;
      }
      if (keyCommentDone)
        keyComment = null;
      if (explicitKey) {
        if (keyComment)
          str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
        str = `? ${str}
${indent}:`;
      } else {
        str = `${str}:`;
        if (keyComment)
          str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
      }
      let vsb, vcb, valueComment;
      if (identity.isNode(value)) {
        vsb = !!value.spaceBefore;
        vcb = value.commentBefore;
        valueComment = value.comment;
      } else {
        vsb = false;
        vcb = null;
        valueComment = null;
        if (value && typeof value === "object")
          value = doc.createNode(value);
      }
      ctx.implicitKey = false;
      if (!explicitKey && !keyComment && identity.isScalar(value))
        ctx.indentAtStart = str.length + 1;
      chompKeep = false;
      if (!indentSeq && indentStep.length >= 2 && !ctx.inFlow && !explicitKey && identity.isSeq(value) && !value.flow && !value.tag && !value.anchor) {
        ctx.indent = ctx.indent.substring(2);
      }
      let valueCommentDone = false;
      const valueStr = stringify.stringify(value, ctx, () => valueCommentDone = true, () => chompKeep = true);
      let ws = " ";
      if (keyComment || vsb || vcb) {
        ws = vsb ? "\n" : "";
        if (vcb) {
          const cs = commentString(vcb);
          ws += `
${stringifyComment.indentComment(cs, ctx.indent)}`;
        }
        if (valueStr === "" && !ctx.inFlow) {
          if (ws === "\n" && valueComment)
            ws = "\n\n";
        } else {
          ws += `
${ctx.indent}`;
        }
      } else if (!explicitKey && identity.isCollection(value)) {
        const vs0 = valueStr[0];
        const nl0 = valueStr.indexOf("\n");
        const hasNewline = nl0 !== -1;
        const flow = ctx.inFlow ?? value.flow ?? value.items.length === 0;
        if (hasNewline || !flow) {
          let hasPropsLine = false;
          if (hasNewline && (vs0 === "&" || vs0 === "!")) {
            let sp0 = valueStr.indexOf(" ");
            if (vs0 === "&" && sp0 !== -1 && sp0 < nl0 && valueStr[sp0 + 1] === "!") {
              sp0 = valueStr.indexOf(" ", sp0 + 1);
            }
            if (sp0 === -1 || nl0 < sp0)
              hasPropsLine = true;
          }
          if (!hasPropsLine)
            ws = `
${ctx.indent}`;
        }
      } else if (valueStr === "" || valueStr[0] === "\n") {
        ws = "";
      }
      str += ws + valueStr;
      if (ctx.inFlow) {
        if (valueCommentDone && onComment)
          onComment();
      } else if (valueComment && !valueCommentDone) {
        str += stringifyComment.lineComment(str, ctx.indent, commentString(valueComment));
      } else if (chompKeep && onChompKeep) {
        onChompKeep();
      }
      return str;
    }
    exports.stringifyPair = stringifyPair;
  }
});

// ../../packages/core/node_modules/yaml/dist/log.js
var require_log = __commonJS({
  "../../packages/core/node_modules/yaml/dist/log.js"(exports) {
    "use strict";
    var node_process = __require("process");
    function debug(logLevel, ...messages) {
      if (logLevel === "debug")
        console.log(...messages);
    }
    function warn(logLevel, warning) {
      if (logLevel === "debug" || logLevel === "warn") {
        if (typeof node_process.emitWarning === "function")
          node_process.emitWarning(warning);
        else
          console.warn(warning);
      }
    }
    exports.debug = debug;
    exports.warn = warn;
  }
});

// ../../packages/core/node_modules/yaml/dist/schema/yaml-1.1/merge.js
var require_merge = __commonJS({
  "../../packages/core/node_modules/yaml/dist/schema/yaml-1.1/merge.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var MERGE_KEY = "<<";
    var merge = {
      identify: (value) => value === MERGE_KEY || typeof value === "symbol" && value.description === MERGE_KEY,
      default: "key",
      tag: "tag:yaml.org,2002:merge",
      test: /^<<$/,
      resolve: () => Object.assign(new Scalar.Scalar(Symbol(MERGE_KEY)), {
        addToJSMap: addMergeToJSMap
      }),
      stringify: () => MERGE_KEY
    };
    var isMergeKey = (ctx, key) => (merge.identify(key) || identity.isScalar(key) && (!key.type || key.type === Scalar.Scalar.PLAIN) && merge.identify(key.value)) && ctx?.doc.schema.tags.some((tag) => tag.tag === merge.tag && tag.default);
    function addMergeToJSMap(ctx, map, value) {
      const source = resolveAliasValue(ctx, value);
      if (identity.isSeq(source))
        for (const it of source.items)
          mergeValue(ctx, map, it);
      else if (Array.isArray(source))
        for (const it of source)
          mergeValue(ctx, map, it);
      else
        mergeValue(ctx, map, source);
    }
    function mergeValue(ctx, map, value) {
      const source = resolveAliasValue(ctx, value);
      if (!identity.isMap(source))
        throw new Error("Merge sources must be maps or map aliases");
      const srcMap = source.toJSON(null, ctx, Map);
      for (const [key, value2] of srcMap) {
        if (map instanceof Map) {
          if (!map.has(key))
            map.set(key, value2);
        } else if (map instanceof Set) {
          map.add(key);
        } else if (!Object.prototype.hasOwnProperty.call(map, key)) {
          Object.defineProperty(map, key, {
            value: value2,
            writable: true,
            enumerable: true,
            configurable: true
          });
        }
      }
      return map;
    }
    function resolveAliasValue(ctx, value) {
      return ctx && identity.isAlias(value) ? value.resolve(ctx.doc, ctx) : value;
    }
    exports.addMergeToJSMap = addMergeToJSMap;
    exports.isMergeKey = isMergeKey;
    exports.merge = merge;
  }
});

// ../../packages/core/node_modules/yaml/dist/nodes/addPairToJSMap.js
var require_addPairToJSMap = __commonJS({
  "../../packages/core/node_modules/yaml/dist/nodes/addPairToJSMap.js"(exports) {
    "use strict";
    var log = require_log();
    var merge = require_merge();
    var stringify = require_stringify();
    var identity = require_identity();
    var toJS = require_toJS();
    function addPairToJSMap(ctx, map, { key, value }) {
      if (identity.isNode(key) && key.addToJSMap)
        key.addToJSMap(ctx, map, value);
      else if (merge.isMergeKey(ctx, key))
        merge.addMergeToJSMap(ctx, map, value);
      else {
        const jsKey = toJS.toJS(key, "", ctx);
        if (map instanceof Map) {
          map.set(jsKey, toJS.toJS(value, jsKey, ctx));
        } else if (map instanceof Set) {
          map.add(jsKey);
        } else {
          const stringKey = stringifyKey(key, jsKey, ctx);
          const jsValue = toJS.toJS(value, stringKey, ctx);
          if (stringKey in map)
            Object.defineProperty(map, stringKey, {
              value: jsValue,
              writable: true,
              enumerable: true,
              configurable: true
            });
          else
            map[stringKey] = jsValue;
        }
      }
      return map;
    }
    function stringifyKey(key, jsKey, ctx) {
      if (jsKey === null)
        return "";
      if (typeof jsKey !== "object")
        return String(jsKey);
      if (identity.isNode(key) && ctx?.doc) {
        const strCtx = stringify.createStringifyContext(ctx.doc, {});
        strCtx.anchors = /* @__PURE__ */ new Set();
        for (const node of ctx.anchors.keys())
          strCtx.anchors.add(node.anchor);
        strCtx.inFlow = true;
        strCtx.inStringifyKey = true;
        const strKey = key.toString(strCtx);
        if (!ctx.mapKeyWarned) {
          let jsonStr = JSON.stringify(strKey);
          if (jsonStr.length > 40)
            jsonStr = jsonStr.substring(0, 36) + '..."';
          log.warn(ctx.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${jsonStr}. Set mapAsMap: true to use object keys.`);
          ctx.mapKeyWarned = true;
        }
        return strKey;
      }
      return JSON.stringify(jsKey);
    }
    exports.addPairToJSMap = addPairToJSMap;
  }
});

// ../../packages/core/node_modules/yaml/dist/nodes/Pair.js
var require_Pair = __commonJS({
  "../../packages/core/node_modules/yaml/dist/nodes/Pair.js"(exports) {
    "use strict";
    var createNode = require_createNode();
    var stringifyPair = require_stringifyPair();
    var addPairToJSMap = require_addPairToJSMap();
    var identity = require_identity();
    function createPair(key, value, ctx) {
      const k = createNode.createNode(key, void 0, ctx);
      const v = createNode.createNode(value, void 0, ctx);
      return new Pair(k, v);
    }
    var Pair = class _Pair {
      constructor(key, value = null) {
        Object.defineProperty(this, identity.NODE_TYPE, { value: identity.PAIR });
        this.key = key;
        this.value = value;
      }
      clone(schema) {
        let { key, value } = this;
        if (identity.isNode(key))
          key = key.clone(schema);
        if (identity.isNode(value))
          value = value.clone(schema);
        return new _Pair(key, value);
      }
      toJSON(_, ctx) {
        const pair = ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
        return addPairToJSMap.addPairToJSMap(ctx, pair, this);
      }
      toString(ctx, onComment, onChompKeep) {
        return ctx?.doc ? stringifyPair.stringifyPair(this, ctx, onComment, onChompKeep) : JSON.stringify(this);
      }
    };
    exports.Pair = Pair;
    exports.createPair = createPair;
  }
});

// ../../packages/core/node_modules/yaml/dist/stringify/stringifyCollection.js
var require_stringifyCollection = __commonJS({
  "../../packages/core/node_modules/yaml/dist/stringify/stringifyCollection.js"(exports) {
    "use strict";
    var identity = require_identity();
    var stringify = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyCollection(collection, ctx, options) {
      const flow = ctx.inFlow ?? collection.flow;
      const stringify2 = flow ? stringifyFlowCollection : stringifyBlockCollection;
      return stringify2(collection, ctx, options);
    }
    function stringifyBlockCollection({ comment, items }, ctx, { blockItemPrefix, flowChars, itemIndent, onChompKeep, onComment }) {
      const { indent, options: { commentString } } = ctx;
      const itemCtx = Object.assign({}, ctx, { indent: itemIndent, type: null });
      let chompKeep = false;
      const lines = [];
      for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        let comment2 = null;
        if (identity.isNode(item)) {
          if (!chompKeep && item.spaceBefore)
            lines.push("");
          addCommentBefore(ctx, lines, item.commentBefore, chompKeep);
          if (item.comment)
            comment2 = item.comment;
        } else if (identity.isPair(item)) {
          const ik = identity.isNode(item.key) ? item.key : null;
          if (ik) {
            if (!chompKeep && ik.spaceBefore)
              lines.push("");
            addCommentBefore(ctx, lines, ik.commentBefore, chompKeep);
          }
        }
        chompKeep = false;
        let str2 = stringify.stringify(item, itemCtx, () => comment2 = null, () => chompKeep = true);
        if (comment2)
          str2 += stringifyComment.lineComment(str2, itemIndent, commentString(comment2));
        if (chompKeep && comment2)
          chompKeep = false;
        lines.push(blockItemPrefix + str2);
      }
      let str;
      if (lines.length === 0) {
        str = flowChars.start + flowChars.end;
      } else {
        str = lines[0];
        for (let i = 1; i < lines.length; ++i) {
          const line = lines[i];
          str += line ? `
${indent}${line}` : "\n";
        }
      }
      if (comment) {
        str += "\n" + stringifyComment.indentComment(commentString(comment), indent);
        if (onComment)
          onComment();
      } else if (chompKeep && onChompKeep)
        onChompKeep();
      return str;
    }
    function stringifyFlowCollection({ items }, ctx, { flowChars, itemIndent }) {
      const { indent, indentStep, flowCollectionPadding: fcPadding, options: { commentString } } = ctx;
      itemIndent += indentStep;
      const itemCtx = Object.assign({}, ctx, {
        indent: itemIndent,
        inFlow: true,
        type: null
      });
      let reqNewline = false;
      let linesAtValue = 0;
      const lines = [];
      for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        let comment = null;
        if (identity.isNode(item)) {
          if (item.spaceBefore)
            lines.push("");
          addCommentBefore(ctx, lines, item.commentBefore, false);
          if (item.comment)
            comment = item.comment;
        } else if (identity.isPair(item)) {
          const ik = identity.isNode(item.key) ? item.key : null;
          if (ik) {
            if (ik.spaceBefore)
              lines.push("");
            addCommentBefore(ctx, lines, ik.commentBefore, false);
            if (ik.comment)
              reqNewline = true;
          }
          const iv = identity.isNode(item.value) ? item.value : null;
          if (iv) {
            if (iv.comment)
              comment = iv.comment;
            if (iv.commentBefore)
              reqNewline = true;
          } else if (item.value == null && ik?.comment) {
            comment = ik.comment;
          }
        }
        if (comment)
          reqNewline = true;
        let str = stringify.stringify(item, itemCtx, () => comment = null);
        reqNewline || (reqNewline = lines.length > linesAtValue || str.includes("\n"));
        if (i < items.length - 1) {
          str += ",";
        } else if (ctx.options.trailingComma) {
          if (ctx.options.lineWidth > 0) {
            reqNewline || (reqNewline = lines.reduce((sum, line) => sum + line.length + 2, 2) + (str.length + 2) > ctx.options.lineWidth);
          }
          if (reqNewline) {
            str += ",";
          }
        }
        if (comment)
          str += stringifyComment.lineComment(str, itemIndent, commentString(comment));
        lines.push(str);
        linesAtValue = lines.length;
      }
      const { start, end } = flowChars;
      if (lines.length === 0) {
        return start + end;
      } else {
        if (!reqNewline) {
          const len = lines.reduce((sum, line) => sum + line.length + 2, 2);
          reqNewline = ctx.options.lineWidth > 0 && len > ctx.options.lineWidth;
        }
        if (reqNewline) {
          let str = start;
          for (const line of lines)
            str += line ? `
${indentStep}${indent}${line}` : "\n";
          return `${str}
${indent}${end}`;
        } else {
          return `${start}${fcPadding}${lines.join(" ")}${fcPadding}${end}`;
        }
      }
    }
    function addCommentBefore({ indent, options: { commentString } }, lines, comment, chompKeep) {
      if (comment && chompKeep)
        comment = comment.replace(/^\n+/, "");
      if (comment) {
        const ic = stringifyComment.indentComment(commentString(comment), indent);
        lines.push(ic.trimStart());
      }
    }
    exports.stringifyCollection = stringifyCollection;
  }
});

// ../../packages/core/node_modules/yaml/dist/nodes/YAMLMap.js
var require_YAMLMap = __commonJS({
  "../../packages/core/node_modules/yaml/dist/nodes/YAMLMap.js"(exports) {
    "use strict";
    var stringifyCollection = require_stringifyCollection();
    var addPairToJSMap = require_addPairToJSMap();
    var Collection = require_Collection();
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    function findPair(items, key) {
      const k = identity.isScalar(key) ? key.value : key;
      for (const it of items) {
        if (identity.isPair(it)) {
          if (it.key === key || it.key === k)
            return it;
          if (identity.isScalar(it.key) && it.key.value === k)
            return it;
        }
      }
      return void 0;
    }
    var YAMLMap = class extends Collection.Collection {
      static get tagName() {
        return "tag:yaml.org,2002:map";
      }
      constructor(schema) {
        super(identity.MAP, schema);
        this.items = [];
      }
      /**
       * A generic collection parsing method that can be extended
       * to other node classes that inherit from YAMLMap
       */
      static from(schema, obj, ctx) {
        const { keepUndefined, replacer } = ctx;
        const map = new this(schema);
        const add = (key, value) => {
          if (typeof replacer === "function")
            value = replacer.call(obj, key, value);
          else if (Array.isArray(replacer) && !replacer.includes(key))
            return;
          if (value !== void 0 || keepUndefined)
            map.items.push(Pair.createPair(key, value, ctx));
        };
        if (obj instanceof Map) {
          for (const [key, value] of obj)
            add(key, value);
        } else if (obj && typeof obj === "object") {
          for (const key of Object.keys(obj))
            add(key, obj[key]);
        }
        if (typeof schema.sortMapEntries === "function") {
          map.items.sort(schema.sortMapEntries);
        }
        return map;
      }
      /**
       * Adds a value to the collection.
       *
       * @param overwrite - If not set `true`, using a key that is already in the
       *   collection will throw. Otherwise, overwrites the previous value.
       */
      add(pair, overwrite) {
        let _pair;
        if (identity.isPair(pair))
          _pair = pair;
        else if (!pair || typeof pair !== "object" || !("key" in pair)) {
          _pair = new Pair.Pair(pair, pair?.value);
        } else
          _pair = new Pair.Pair(pair.key, pair.value);
        const prev = findPair(this.items, _pair.key);
        const sortEntries = this.schema?.sortMapEntries;
        if (prev) {
          if (!overwrite)
            throw new Error(`Key ${_pair.key} already set`);
          if (identity.isScalar(prev.value) && Scalar.isScalarValue(_pair.value))
            prev.value.value = _pair.value;
          else
            prev.value = _pair.value;
        } else if (sortEntries) {
          const i = this.items.findIndex((item) => sortEntries(_pair, item) < 0);
          if (i === -1)
            this.items.push(_pair);
          else
            this.items.splice(i, 0, _pair);
        } else {
          this.items.push(_pair);
        }
      }
      delete(key) {
        const it = findPair(this.items, key);
        if (!it)
          return false;
        const del = this.items.splice(this.items.indexOf(it), 1);
        return del.length > 0;
      }
      get(key, keepScalar) {
        const it = findPair(this.items, key);
        const node = it?.value;
        return (!keepScalar && identity.isScalar(node) ? node.value : node) ?? void 0;
      }
      has(key) {
        return !!findPair(this.items, key);
      }
      set(key, value) {
        this.add(new Pair.Pair(key, value), true);
      }
      /**
       * @param ctx - Conversion context, originally set in Document#toJS()
       * @param {Class} Type - If set, forces the returned collection type
       * @returns Instance of Type, Map, or Object
       */
      toJSON(_, ctx, Type) {
        const map = Type ? new Type() : ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
        if (ctx?.onCreate)
          ctx.onCreate(map);
        for (const item of this.items)
          addPairToJSMap.addPairToJSMap(ctx, map, item);
        return map;
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        for (const item of this.items) {
          if (!identity.isPair(item))
            throw new Error(`Map items must all be pairs; found ${JSON.stringify(item)} instead`);
        }
        if (!ctx.allNullValues && this.hasAllNullValues(false))
          ctx = Object.assign({}, ctx, { allNullValues: true });
        return stringifyCollection.stringifyCollection(this, ctx, {
          blockItemPrefix: "",
          flowChars: { start: "{", end: "}" },
          itemIndent: ctx.indent || "",
          onChompKeep,
          onComment
        });
      }
    };
    exports.YAMLMap = YAMLMap;
    exports.findPair = findPair;
  }
});

// ../../packages/core/node_modules/yaml/dist/schema/common/map.js
var require_map = __commonJS({
  "../../packages/core/node_modules/yaml/dist/schema/common/map.js"(exports) {
    "use strict";
    var identity = require_identity();
    var YAMLMap = require_YAMLMap();
    var map = {
      collection: "map",
      default: true,
      nodeClass: YAMLMap.YAMLMap,
      tag: "tag:yaml.org,2002:map",
      resolve(map2, onError) {
        if (!identity.isMap(map2))
          onError("Expected a mapping for this tag");
        return map2;
      },
      createNode: (schema, obj, ctx) => YAMLMap.YAMLMap.from(schema, obj, ctx)
    };
    exports.map = map;
  }
});

// ../../packages/core/node_modules/yaml/dist/nodes/YAMLSeq.js
var require_YAMLSeq = __commonJS({
  "../../packages/core/node_modules/yaml/dist/nodes/YAMLSeq.js"(exports) {
    "use strict";
    var createNode = require_createNode();
    var stringifyCollection = require_stringifyCollection();
    var Collection = require_Collection();
    var identity = require_identity();
    var Scalar = require_Scalar();
    var toJS = require_toJS();
    var YAMLSeq = class extends Collection.Collection {
      static get tagName() {
        return "tag:yaml.org,2002:seq";
      }
      constructor(schema) {
        super(identity.SEQ, schema);
        this.items = [];
      }
      add(value) {
        this.items.push(value);
      }
      /**
       * Removes a value from the collection.
       *
       * `key` must contain a representation of an integer for this to succeed.
       * It may be wrapped in a `Scalar`.
       *
       * @returns `true` if the item was found and removed.
       */
      delete(key) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          return false;
        const del = this.items.splice(idx, 1);
        return del.length > 0;
      }
      get(key, keepScalar) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          return void 0;
        const it = this.items[idx];
        return !keepScalar && identity.isScalar(it) ? it.value : it;
      }
      /**
       * Checks if the collection includes a value with the key `key`.
       *
       * `key` must contain a representation of an integer for this to succeed.
       * It may be wrapped in a `Scalar`.
       */
      has(key) {
        const idx = asItemIndex(key);
        return typeof idx === "number" && idx < this.items.length;
      }
      /**
       * Sets a value in this collection. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       *
       * If `key` does not contain a representation of an integer, this will throw.
       * It may be wrapped in a `Scalar`.
       */
      set(key, value) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          throw new Error(`Expected a valid index, not ${key}.`);
        const prev = this.items[idx];
        if (identity.isScalar(prev) && Scalar.isScalarValue(value))
          prev.value = value;
        else
          this.items[idx] = value;
      }
      toJSON(_, ctx) {
        const seq2 = [];
        if (ctx?.onCreate)
          ctx.onCreate(seq2);
        let i = 0;
        for (const item of this.items)
          seq2.push(toJS.toJS(item, String(i++), ctx));
        return seq2;
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        return stringifyCollection.stringifyCollection(this, ctx, {
          blockItemPrefix: "- ",
          flowChars: { start: "[", end: "]" },
          itemIndent: (ctx.indent || "") + "  ",
          onChompKeep,
          onComment
        });
      }
      static from(schema, obj, ctx) {
        const { replacer } = ctx;
        const seq2 = new this(schema);
        if (obj && Symbol.iterator in Object(obj)) {
          let i = 0;
          for (let it of obj) {
            if (typeof replacer === "function") {
              const key = obj instanceof Set ? it : String(i++);
              it = replacer.call(obj, key, it);
            }
            seq2.items.push(createNode.createNode(it, void 0, ctx));
          }
        }
        return seq2;
      }
    };
    function asItemIndex(key) {
      let idx = identity.isScalar(key) ? key.value : key;
      if (idx && typeof idx === "string")
        idx = Number(idx);
      return typeof idx === "number" && Number.isInteger(idx) && idx >= 0 ? idx : null;
    }
    exports.YAMLSeq = YAMLSeq;
  }
});

// ../../packages/core/node_modules/yaml/dist/schema/common/seq.js
var require_seq = __commonJS({
  "../../packages/core/node_modules/yaml/dist/schema/common/seq.js"(exports) {
    "use strict";
    var identity = require_identity();
    var YAMLSeq = require_YAMLSeq();
    var seq2 = {
      collection: "seq",
      default: true,
      nodeClass: YAMLSeq.YAMLSeq,
      tag: "tag:yaml.org,2002:seq",
      resolve(seq3, onError) {
        if (!identity.isSeq(seq3))
          onError("Expected a sequence for this tag");
        return seq3;
      },
      createNode: (schema, obj, ctx) => YAMLSeq.YAMLSeq.from(schema, obj, ctx)
    };
    exports.seq = seq2;
  }
});

// ../../packages/core/node_modules/yaml/dist/schema/common/string.js
var require_string = __commonJS({
  "../../packages/core/node_modules/yaml/dist/schema/common/string.js"(exports) {
    "use strict";
    var stringifyString = require_stringifyString();
    var string = {
      identify: (value) => typeof value === "string",
      default: true,
      tag: "tag:yaml.org,2002:str",
      resolve: (str) => str,
      stringify(item, ctx, onComment, onChompKeep) {
        ctx = Object.assign({ actualString: true }, ctx);
        return stringifyString.stringifyString(item, ctx, onComment, onChompKeep);
      }
    };
    exports.string = string;
  }
});

// ../../packages/core/node_modules/yaml/dist/schema/common/null.js
var require_null = __commonJS({
  "../../packages/core/node_modules/yaml/dist/schema/common/null.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var nullTag = {
      identify: (value) => value == null,
      createNode: () => new Scalar.Scalar(null),
      default: true,
      tag: "tag:yaml.org,2002:null",
      test: /^(?:~|[Nn]ull|NULL)?$/,
      resolve: () => new Scalar.Scalar(null),
      stringify: ({ source }, ctx) => typeof source === "string" && nullTag.test.test(source) ? source : ctx.options.nullStr
    };
    exports.nullTag = nullTag;
  }
});

// ../../packages/core/node_modules/yaml/dist/schema/core/bool.js
var require_bool = __commonJS({
  "../../packages/core/node_modules/yaml/dist/schema/core/bool.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var boolTag = {
      identify: (value) => typeof value === "boolean",
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
      resolve: (str) => new Scalar.Scalar(str[0] === "t" || str[0] === "T"),
      stringify({ source, value }, ctx) {
        if (source && boolTag.test.test(source)) {
          const sv = source[0] === "t" || source[0] === "T";
          if (value === sv)
            return source;
        }
        return value ? ctx.options.trueStr : ctx.options.falseStr;
      }
    };
    exports.boolTag = boolTag;
  }
});

// ../../packages/core/node_modules/yaml/dist/stringify/stringifyNumber.js
var require_stringifyNumber = __commonJS({
  "../../packages/core/node_modules/yaml/dist/stringify/stringifyNumber.js"(exports) {
    "use strict";
    function stringifyNumber({ format, minFractionDigits, tag, value }) {
      if (typeof value === "bigint")
        return String(value);
      const num = typeof value === "number" ? value : Number(value);
      if (!isFinite(num))
        return isNaN(num) ? ".nan" : num < 0 ? "-.inf" : ".inf";
      let n = Object.is(value, -0) ? "-0" : JSON.stringify(value);
      if (!format && minFractionDigits && (!tag || tag === "tag:yaml.org,2002:float") && /^-?\d/.test(n) && !n.includes("e")) {
        let i = n.indexOf(".");
        if (i < 0) {
          i = n.length;
          n += ".";
        }
        let d = minFractionDigits - (n.length - i - 1);
        while (d-- > 0)
          n += "0";
      }
      return n;
    }
    exports.stringifyNumber = stringifyNumber;
  }
});

// ../../packages/core/node_modules/yaml/dist/schema/core/float.js
var require_float = __commonJS({
  "../../packages/core/node_modules/yaml/dist/schema/core/float.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var stringifyNumber = require_stringifyNumber();
    var floatNaN = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: stringifyNumber.stringifyNumber
    };
    var floatExp = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
      resolve: (str) => parseFloat(str),
      stringify(node) {
        const num = Number(node.value);
        return isFinite(num) ? num.toExponential() : stringifyNumber.stringifyNumber(node);
      }
    };
    var float = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
      resolve(str) {
        const node = new Scalar.Scalar(parseFloat(str));
        const dot = str.indexOf(".");
        if (dot !== -1 && str[str.length - 1] === "0")
          node.minFractionDigits = str.length - dot - 1;
        return node;
      },
      stringify: stringifyNumber.stringifyNumber
    };
    exports.float = float;
    exports.floatExp = floatExp;
    exports.floatNaN = floatNaN;
  }
});

// ../../packages/core/node_modules/yaml/dist/schema/core/int.js
var require_int = __commonJS({
  "../../packages/core/node_modules/yaml/dist/schema/core/int.js"(exports) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    var intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
    var intResolve = (str, offset, radix, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str.substring(offset), radix);
    function intStringify(node, radix, prefix) {
      const { value } = node;
      if (intIdentify(value) && value >= 0)
        return prefix + value.toString(radix);
      return stringifyNumber.stringifyNumber(node);
    }
    var intOct = {
      identify: (value) => intIdentify(value) && value >= 0,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^0o[0-7]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 8, opt),
      stringify: (node) => intStringify(node, 8, "0o")
    };
    var int = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
      stringify: stringifyNumber.stringifyNumber
    };
    var intHex = {
      identify: (value) => intIdentify(value) && value >= 0,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^0x[0-9a-fA-F]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
      stringify: (node) => intStringify(node, 16, "0x")
    };
    exports.int = int;
    exports.intHex = intHex;
    exports.intOct = intOct;
  }
});

// ../../packages/core/node_modules/yaml/dist/schema/core/schema.js
var require_schema = __commonJS({
  "../../packages/core/node_modules/yaml/dist/schema/core/schema.js"(exports) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq2 = require_seq();
    var string = require_string();
    var bool = require_bool();
    var float = require_float();
    var int = require_int();
    var schema = [
      map.map,
      seq2.seq,
      string.string,
      _null.nullTag,
      bool.boolTag,
      int.intOct,
      int.int,
      int.intHex,
      float.floatNaN,
      float.floatExp,
      float.float
    ];
    exports.schema = schema;
  }
});

// ../../packages/core/node_modules/yaml/dist/schema/json/schema.js
var require_schema2 = __commonJS({
  "../../packages/core/node_modules/yaml/dist/schema/json/schema.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var map = require_map();
    var seq2 = require_seq();
    function intIdentify(value) {
      return typeof value === "bigint" || Number.isInteger(value);
    }
    var stringifyJSON = ({ value }) => JSON.stringify(value);
    var jsonScalars = [
      {
        identify: (value) => typeof value === "string",
        default: true,
        tag: "tag:yaml.org,2002:str",
        resolve: (str) => str,
        stringify: stringifyJSON
      },
      {
        identify: (value) => value == null,
        createNode: () => new Scalar.Scalar(null),
        default: true,
        tag: "tag:yaml.org,2002:null",
        test: /^null$/,
        resolve: () => null,
        stringify: stringifyJSON
      },
      {
        identify: (value) => typeof value === "boolean",
        default: true,
        tag: "tag:yaml.org,2002:bool",
        test: /^true$|^false$/,
        resolve: (str) => str === "true",
        stringify: stringifyJSON
      },
      {
        identify: intIdentify,
        default: true,
        tag: "tag:yaml.org,2002:int",
        test: /^-?(?:0|[1-9][0-9]*)$/,
        resolve: (str, _onError, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str, 10),
        stringify: ({ value }) => intIdentify(value) ? value.toString() : JSON.stringify(value)
      },
      {
        identify: (value) => typeof value === "number",
        default: true,
        tag: "tag:yaml.org,2002:float",
        test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
        resolve: (str) => parseFloat(str),
        stringify: stringifyJSON
      }
    ];
    var jsonError = {
      default: true,
      tag: "",
      test: /^/,
      resolve(str, onError) {
        onError(`Unresolved plain scalar ${JSON.stringify(str)}`);
        return str;
      }
    };
    var schema = [map.map, seq2.seq].concat(jsonScalars, jsonError);
    exports.schema = schema;
  }
});

// ../../packages/core/node_modules/yaml/dist/schema/yaml-1.1/binary.js
var require_binary = __commonJS({
  "../../packages/core/node_modules/yaml/dist/schema/yaml-1.1/binary.js"(exports) {
    "use strict";
    var node_buffer = __require("buffer");
    var Scalar = require_Scalar();
    var stringifyString = require_stringifyString();
    var binary = {
      identify: (value) => value instanceof Uint8Array,
      // Buffer inherits from Uint8Array
      default: false,
      tag: "tag:yaml.org,2002:binary",
      /**
       * Returns a Buffer in node and an Uint8Array in browsers
       *
       * To use the resulting buffer as an image, you'll want to do something like:
       *
       *   const blob = new Blob([buffer], { type: 'image/jpeg' })
       *   document.querySelector('#photo').src = URL.createObjectURL(blob)
       */
      resolve(src, onError) {
        if (typeof node_buffer.Buffer === "function") {
          return node_buffer.Buffer.from(src, "base64");
        } else if (typeof atob === "function") {
          const str = atob(src.replace(/[\n\r]/g, ""));
          const buffer = new Uint8Array(str.length);
          for (let i = 0; i < str.length; ++i)
            buffer[i] = str.charCodeAt(i);
          return buffer;
        } else {
          onError("This environment does not support reading binary tags; either Buffer or atob is required");
          return src;
        }
      },
      stringify({ comment, type, value }, ctx, onComment, onChompKeep) {
        if (!value)
          return "";
        const buf = value;
        let str;
        if (typeof node_buffer.Buffer === "function") {
          str = buf instanceof node_buffer.Buffer ? buf.toString("base64") : node_buffer.Buffer.from(buf.buffer).toString("base64");
        } else if (typeof btoa === "function") {
          let s = "";
          for (let i = 0; i < buf.length; ++i)
            s += String.fromCharCode(buf[i]);
          str = btoa(s);
        } else {
          throw new Error("This environment does not support writing binary tags; either Buffer or btoa is required");
        }
        type ?? (type = Scalar.Scalar.BLOCK_LITERAL);
        if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
          const lineWidth = Math.max(ctx.options.lineWidth - ctx.indent.length, ctx.options.minContentWidth);
          const n = Math.ceil(str.length / lineWidth);
          const lines = new Array(n);
          for (let i = 0, o2 = 0; i < n; ++i, o2 += lineWidth) {
            lines[i] = str.substr(o2, lineWidth);
          }
          str = lines.join(type === Scalar.Scalar.BLOCK_LITERAL ? "\n" : " ");
        }
        return stringifyString.stringifyString({ comment, type, value: str }, ctx, onComment, onChompKeep);
      }
    };
    exports.binary = binary;
  }
});

// ../../packages/core/node_modules/yaml/dist/schema/yaml-1.1/pairs.js
var require_pairs = __commonJS({
  "../../packages/core/node_modules/yaml/dist/schema/yaml-1.1/pairs.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    var YAMLSeq = require_YAMLSeq();
    function resolvePairs(seq2, onError) {
      if (identity.isSeq(seq2)) {
        for (let i = 0; i < seq2.items.length; ++i) {
          let item = seq2.items[i];
          if (identity.isPair(item))
            continue;
          else if (identity.isMap(item)) {
            if (item.items.length > 1)
              onError("Each pair must have its own sequence indicator");
            const pair = item.items[0] || new Pair.Pair(new Scalar.Scalar(null));
            if (item.commentBefore)
              pair.key.commentBefore = pair.key.commentBefore ? `${item.commentBefore}
${pair.key.commentBefore}` : item.commentBefore;
            if (item.comment) {
              const cn = pair.value ?? pair.key;
              cn.comment = cn.comment ? `${item.comment}
${cn.comment}` : item.comment;
            }
            item = pair;
          }
          seq2.items[i] = identity.isPair(item) ? item : new Pair.Pair(item);
        }
      } else
        onError("Expected a sequence for this tag");
      return seq2;
    }
    function createPairs(schema, iterable, ctx) {
      const { replacer } = ctx;
      const pairs2 = new YAMLSeq.YAMLSeq(schema);
      pairs2.tag = "tag:yaml.org,2002:pairs";
      let i = 0;
      if (iterable && Symbol.iterator in Object(iterable))
        for (let it of iterable) {
          if (typeof replacer === "function")
            it = replacer.call(iterable, String(i++), it);
          let key, value;
          if (Array.isArray(it)) {
            if (it.length === 2) {
              key = it[0];
              value = it[1];
            } else
              throw new TypeError(`Expected [key, value] tuple: ${it}`);
          } else if (it && it instanceof Object) {
            const keys = Object.keys(it);
            if (keys.length === 1) {
              key = keys[0];
              value = it[key];
            } else {
              throw new TypeError(`Expected tuple with one key, not ${keys.length} keys`);
            }
          } else {
            key = it;
          }
          pairs2.items.push(Pair.createPair(key, value, ctx));
        }
      return pairs2;
    }
    var pairs = {
      collection: "seq",
      default: false,
      tag: "tag:yaml.org,2002:pairs",
      resolve: resolvePairs,
      createNode: createPairs
    };
    exports.createPairs = createPairs;
    exports.pairs = pairs;
    exports.resolvePairs = resolvePairs;
  }
});

// ../../packages/core/node_modules/yaml/dist/schema/yaml-1.1/omap.js
var require_omap = __commonJS({
  "../../packages/core/node_modules/yaml/dist/schema/yaml-1.1/omap.js"(exports) {
    "use strict";
    var identity = require_identity();
    var toJS = require_toJS();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var pairs = require_pairs();
    var YAMLOMap = class _YAMLOMap extends YAMLSeq.YAMLSeq {
      constructor() {
        super();
        this.add = YAMLMap.YAMLMap.prototype.add.bind(this);
        this.delete = YAMLMap.YAMLMap.prototype.delete.bind(this);
        this.get = YAMLMap.YAMLMap.prototype.get.bind(this);
        this.has = YAMLMap.YAMLMap.prototype.has.bind(this);
        this.set = YAMLMap.YAMLMap.prototype.set.bind(this);
        this.tag = _YAMLOMap.tag;
      }
      /**
       * If `ctx` is given, the return type is actually `Map<unknown, unknown>`,
       * but TypeScript won't allow widening the signature of a child method.
       */
      toJSON(_, ctx) {
        if (!ctx)
          return super.toJSON(_);
        const map = /* @__PURE__ */ new Map();
        if (ctx?.onCreate)
          ctx.onCreate(map);
        for (const pair of this.items) {
          let key, value;
          if (identity.isPair(pair)) {
            key = toJS.toJS(pair.key, "", ctx);
            value = toJS.toJS(pair.value, key, ctx);
          } else {
            key = toJS.toJS(pair, "", ctx);
          }
          if (map.has(key))
            throw new Error("Ordered maps must not include duplicate keys");
          map.set(key, value);
        }
        return map;
      }
      static from(schema, iterable, ctx) {
        const pairs$1 = pairs.createPairs(schema, iterable, ctx);
        const omap2 = new this();
        omap2.items = pairs$1.items;
        return omap2;
      }
    };
    YAMLOMap.tag = "tag:yaml.org,2002:omap";
    var omap = {
      collection: "seq",
      identify: (value) => value instanceof Map,
      nodeClass: YAMLOMap,
      default: false,
      tag: "tag:yaml.org,2002:omap",
      resolve(seq2, onError) {
        const pairs$1 = pairs.resolvePairs(seq2, onError);
        const seenKeys = [];
        for (const { key } of pairs$1.items) {
          if (identity.isScalar(key)) {
            if (seenKeys.includes(key.value)) {
              onError(`Ordered maps must not include duplicate keys: ${key.value}`);
            } else {
              seenKeys.push(key.value);
            }
          }
        }
        return Object.assign(new YAMLOMap(), pairs$1);
      },
      createNode: (schema, iterable, ctx) => YAMLOMap.from(schema, iterable, ctx)
    };
    exports.YAMLOMap = YAMLOMap;
    exports.omap = omap;
  }
});

// ../../packages/core/node_modules/yaml/dist/schema/yaml-1.1/bool.js
var require_bool2 = __commonJS({
  "../../packages/core/node_modules/yaml/dist/schema/yaml-1.1/bool.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    function boolStringify({ value, source }, ctx) {
      const boolObj = value ? trueTag : falseTag;
      if (source && boolObj.test.test(source))
        return source;
      return value ? ctx.options.trueStr : ctx.options.falseStr;
    }
    var trueTag = {
      identify: (value) => value === true,
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
      resolve: () => new Scalar.Scalar(true),
      stringify: boolStringify
    };
    var falseTag = {
      identify: (value) => value === false,
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
      resolve: () => new Scalar.Scalar(false),
      stringify: boolStringify
    };
    exports.falseTag = falseTag;
    exports.trueTag = trueTag;
  }
});

// ../../packages/core/node_modules/yaml/dist/schema/yaml-1.1/float.js
var require_float2 = __commonJS({
  "../../packages/core/node_modules/yaml/dist/schema/yaml-1.1/float.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var stringifyNumber = require_stringifyNumber();
    var floatNaN = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: stringifyNumber.stringifyNumber
    };
    var floatExp = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
      resolve: (str) => parseFloat(str.replace(/_/g, "")),
      stringify(node) {
        const num = Number(node.value);
        return isFinite(num) ? num.toExponential() : stringifyNumber.stringifyNumber(node);
      }
    };
    var float = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
      resolve(str) {
        const node = new Scalar.Scalar(parseFloat(str.replace(/_/g, "")));
        const dot = str.indexOf(".");
        if (dot !== -1) {
          const f = str.substring(dot + 1).replace(/_/g, "");
          if (f[f.length - 1] === "0")
            node.minFractionDigits = f.length;
        }
        return node;
      },
      stringify: stringifyNumber.stringifyNumber
    };
    exports.float = float;
    exports.floatExp = floatExp;
    exports.floatNaN = floatNaN;
  }
});

// ../../packages/core/node_modules/yaml/dist/schema/yaml-1.1/int.js
var require_int2 = __commonJS({
  "../../packages/core/node_modules/yaml/dist/schema/yaml-1.1/int.js"(exports) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    var intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
    function intResolve(str, offset, radix, { intAsBigInt }) {
      const sign = str[0];
      if (sign === "-" || sign === "+")
        offset += 1;
      str = str.substring(offset).replace(/_/g, "");
      if (intAsBigInt) {
        switch (radix) {
          case 2:
            str = `0b${str}`;
            break;
          case 8:
            str = `0o${str}`;
            break;
          case 16:
            str = `0x${str}`;
            break;
        }
        const n2 = BigInt(str);
        return sign === "-" ? BigInt(-1) * n2 : n2;
      }
      const n = parseInt(str, radix);
      return sign === "-" ? -1 * n : n;
    }
    function intStringify(node, radix, prefix) {
      const { value } = node;
      if (intIdentify(value)) {
        const str = value.toString(radix);
        return value < 0 ? "-" + prefix + str.substr(1) : prefix + str;
      }
      return stringifyNumber.stringifyNumber(node);
    }
    var intBin = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "BIN",
      test: /^[-+]?0b[0-1_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 2, opt),
      stringify: (node) => intStringify(node, 2, "0b")
    };
    var intOct = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^[-+]?0[0-7_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 1, 8, opt),
      stringify: (node) => intStringify(node, 8, "0")
    };
    var int = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9][0-9_]*$/,
      resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
      stringify: stringifyNumber.stringifyNumber
    };
    var intHex = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^[-+]?0x[0-9a-fA-F_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
      stringify: (node) => intStringify(node, 16, "0x")
    };
    exports.int = int;
    exports.intBin = intBin;
    exports.intHex = intHex;
    exports.intOct = intOct;
  }
});

// ../../packages/core/node_modules/yaml/dist/schema/yaml-1.1/set.js
var require_set = __commonJS({
  "../../packages/core/node_modules/yaml/dist/schema/yaml-1.1/set.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var YAMLSet = class _YAMLSet extends YAMLMap.YAMLMap {
      constructor(schema) {
        super(schema);
        this.tag = _YAMLSet.tag;
      }
      add(key) {
        let pair;
        if (identity.isPair(key))
          pair = key;
        else if (key && typeof key === "object" && "key" in key && "value" in key && key.value === null)
          pair = new Pair.Pair(key.key, null);
        else
          pair = new Pair.Pair(key, null);
        const prev = YAMLMap.findPair(this.items, pair.key);
        if (!prev)
          this.items.push(pair);
      }
      /**
       * If `keepPair` is `true`, returns the Pair matching `key`.
       * Otherwise, returns the value of that Pair's key.
       */
      get(key, keepPair) {
        const pair = YAMLMap.findPair(this.items, key);
        return !keepPair && identity.isPair(pair) ? identity.isScalar(pair.key) ? pair.key.value : pair.key : pair;
      }
      set(key, value) {
        if (typeof value !== "boolean")
          throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof value}`);
        const prev = YAMLMap.findPair(this.items, key);
        if (prev && !value) {
          this.items.splice(this.items.indexOf(prev), 1);
        } else if (!prev && value) {
          this.items.push(new Pair.Pair(key));
        }
      }
      toJSON(_, ctx) {
        return super.toJSON(_, ctx, Set);
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        if (this.hasAllNullValues(true))
          return super.toString(Object.assign({}, ctx, { allNullValues: true }), onComment, onChompKeep);
        else
          throw new Error("Set items must all have null values");
      }
      static from(schema, iterable, ctx) {
        const { replacer } = ctx;
        const set2 = new this(schema);
        if (iterable && Symbol.iterator in Object(iterable))
          for (let value of iterable) {
            if (typeof replacer === "function")
              value = replacer.call(iterable, value, value);
            set2.items.push(Pair.createPair(value, null, ctx));
          }
        return set2;
      }
    };
    YAMLSet.tag = "tag:yaml.org,2002:set";
    var set = {
      collection: "map",
      identify: (value) => value instanceof Set,
      nodeClass: YAMLSet,
      default: false,
      tag: "tag:yaml.org,2002:set",
      createNode: (schema, iterable, ctx) => YAMLSet.from(schema, iterable, ctx),
      resolve(map, onError) {
        if (identity.isMap(map)) {
          if (map.hasAllNullValues(true))
            return Object.assign(new YAMLSet(), map);
          else
            onError("Set items must all have null values");
        } else
          onError("Expected a mapping for this tag");
        return map;
      }
    };
    exports.YAMLSet = YAMLSet;
    exports.set = set;
  }
});

// ../../packages/core/node_modules/yaml/dist/schema/yaml-1.1/timestamp.js
var require_timestamp = __commonJS({
  "../../packages/core/node_modules/yaml/dist/schema/yaml-1.1/timestamp.js"(exports) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    function parseSexagesimal(str, asBigInt) {
      const sign = str[0];
      const parts = sign === "-" || sign === "+" ? str.substring(1) : str;
      const num = (n) => asBigInt ? BigInt(n) : Number(n);
      const res = parts.replace(/_/g, "").split(":").reduce((res2, p) => res2 * num(60) + num(p), num(0));
      return sign === "-" ? num(-1) * res : res;
    }
    function stringifySexagesimal(node) {
      let { value } = node;
      let num = (n) => n;
      if (typeof value === "bigint")
        num = (n) => BigInt(n);
      else if (isNaN(value) || !isFinite(value))
        return stringifyNumber.stringifyNumber(node);
      let sign = "";
      if (value < 0) {
        sign = "-";
        value *= num(-1);
      }
      const _60 = num(60);
      const parts = [value % _60];
      if (value < 60) {
        parts.unshift(0);
      } else {
        value = (value - parts[0]) / _60;
        parts.unshift(value % _60);
        if (value >= 60) {
          value = (value - parts[0]) / _60;
          parts.unshift(value);
        }
      }
      return sign + parts.map((n) => String(n).padStart(2, "0")).join(":").replace(/000000\d*$/, "");
    }
    var intTime = {
      identify: (value) => typeof value === "bigint" || Number.isInteger(value),
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
      resolve: (str, _onError, { intAsBigInt }) => parseSexagesimal(str, intAsBigInt),
      stringify: stringifySexagesimal
    };
    var floatTime = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
      resolve: (str) => parseSexagesimal(str, false),
      stringify: stringifySexagesimal
    };
    var timestamp = {
      identify: (value) => value instanceof Date,
      default: true,
      tag: "tag:yaml.org,2002:timestamp",
      // If the time zone is omitted, the timestamp is assumed to be specified in UTC. The time part
      // may be omitted altogether, resulting in a date format. In such a case, the time part is
      // assumed to be 00:00:00Z (start of day, UTC).
      test: RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$"),
      resolve(str) {
        const match = str.match(timestamp.test);
        if (!match)
          throw new Error("!!timestamp expects a date, starting with yyyy-mm-dd");
        const [, year, month, day, hour, minute, second] = match.map(Number);
        const millisec = match[7] ? Number((match[7] + "00").substr(1, 3)) : 0;
        let date = Date.UTC(year, month - 1, day, hour || 0, minute || 0, second || 0, millisec);
        const tz = match[8];
        if (tz && tz !== "Z") {
          let d = parseSexagesimal(tz, false);
          if (Math.abs(d) < 30)
            d *= 60;
          date -= 6e4 * d;
        }
        return new Date(date);
      },
      stringify: ({ value }) => value?.toISOString().replace(/(T00:00:00)?\.000Z$/, "") ?? ""
    };
    exports.floatTime = floatTime;
    exports.intTime = intTime;
    exports.timestamp = timestamp;
  }
});

// ../../packages/core/node_modules/yaml/dist/schema/yaml-1.1/schema.js
var require_schema3 = __commonJS({
  "../../packages/core/node_modules/yaml/dist/schema/yaml-1.1/schema.js"(exports) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq2 = require_seq();
    var string = require_string();
    var binary = require_binary();
    var bool = require_bool2();
    var float = require_float2();
    var int = require_int2();
    var merge = require_merge();
    var omap = require_omap();
    var pairs = require_pairs();
    var set = require_set();
    var timestamp = require_timestamp();
    var schema = [
      map.map,
      seq2.seq,
      string.string,
      _null.nullTag,
      bool.trueTag,
      bool.falseTag,
      int.intBin,
      int.intOct,
      int.int,
      int.intHex,
      float.floatNaN,
      float.floatExp,
      float.float,
      binary.binary,
      merge.merge,
      omap.omap,
      pairs.pairs,
      set.set,
      timestamp.intTime,
      timestamp.floatTime,
      timestamp.timestamp
    ];
    exports.schema = schema;
  }
});

// ../../packages/core/node_modules/yaml/dist/schema/tags.js
var require_tags = __commonJS({
  "../../packages/core/node_modules/yaml/dist/schema/tags.js"(exports) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq2 = require_seq();
    var string = require_string();
    var bool = require_bool();
    var float = require_float();
    var int = require_int();
    var schema = require_schema();
    var schema$1 = require_schema2();
    var binary = require_binary();
    var merge = require_merge();
    var omap = require_omap();
    var pairs = require_pairs();
    var schema$2 = require_schema3();
    var set = require_set();
    var timestamp = require_timestamp();
    var schemas = /* @__PURE__ */ new Map([
      ["core", schema.schema],
      ["failsafe", [map.map, seq2.seq, string.string]],
      ["json", schema$1.schema],
      ["yaml11", schema$2.schema],
      ["yaml-1.1", schema$2.schema]
    ]);
    var tagsByName = {
      binary: binary.binary,
      bool: bool.boolTag,
      float: float.float,
      floatExp: float.floatExp,
      floatNaN: float.floatNaN,
      floatTime: timestamp.floatTime,
      int: int.int,
      intHex: int.intHex,
      intOct: int.intOct,
      intTime: timestamp.intTime,
      map: map.map,
      merge: merge.merge,
      null: _null.nullTag,
      omap: omap.omap,
      pairs: pairs.pairs,
      seq: seq2.seq,
      set: set.set,
      timestamp: timestamp.timestamp
    };
    var coreKnownTags = {
      "tag:yaml.org,2002:binary": binary.binary,
      "tag:yaml.org,2002:merge": merge.merge,
      "tag:yaml.org,2002:omap": omap.omap,
      "tag:yaml.org,2002:pairs": pairs.pairs,
      "tag:yaml.org,2002:set": set.set,
      "tag:yaml.org,2002:timestamp": timestamp.timestamp
    };
    function getTags(customTags, schemaName, addMergeTag) {
      const schemaTags = schemas.get(schemaName);
      if (schemaTags && !customTags) {
        return addMergeTag && !schemaTags.includes(merge.merge) ? schemaTags.concat(merge.merge) : schemaTags.slice();
      }
      let tags = schemaTags;
      if (!tags) {
        if (Array.isArray(customTags))
          tags = [];
        else {
          const keys = Array.from(schemas.keys()).filter((key) => key !== "yaml11").map((key) => JSON.stringify(key)).join(", ");
          throw new Error(`Unknown schema "${schemaName}"; use one of ${keys} or define customTags array`);
        }
      }
      if (Array.isArray(customTags)) {
        for (const tag of customTags)
          tags = tags.concat(tag);
      } else if (typeof customTags === "function") {
        tags = customTags(tags.slice());
      }
      if (addMergeTag)
        tags = tags.concat(merge.merge);
      return tags.reduce((tags2, tag) => {
        const tagObj = typeof tag === "string" ? tagsByName[tag] : tag;
        if (!tagObj) {
          const tagName = JSON.stringify(tag);
          const keys = Object.keys(tagsByName).map((key) => JSON.stringify(key)).join(", ");
          throw new Error(`Unknown custom tag ${tagName}; use one of ${keys}`);
        }
        if (!tags2.includes(tagObj))
          tags2.push(tagObj);
        return tags2;
      }, []);
    }
    exports.coreKnownTags = coreKnownTags;
    exports.getTags = getTags;
  }
});

// ../../packages/core/node_modules/yaml/dist/schema/Schema.js
var require_Schema = __commonJS({
  "../../packages/core/node_modules/yaml/dist/schema/Schema.js"(exports) {
    "use strict";
    var identity = require_identity();
    var map = require_map();
    var seq2 = require_seq();
    var string = require_string();
    var tags = require_tags();
    var sortMapEntriesByKey = (a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
    var Schema = class _Schema {
      constructor({ compat, customTags, merge, resolveKnownTags, schema, sortMapEntries, toStringDefaults }) {
        this.compat = Array.isArray(compat) ? tags.getTags(compat, "compat") : compat ? tags.getTags(null, compat) : null;
        this.name = typeof schema === "string" && schema || "core";
        this.knownTags = resolveKnownTags ? tags.coreKnownTags : {};
        this.tags = tags.getTags(customTags, this.name, merge);
        this.toStringOptions = toStringDefaults ?? null;
        Object.defineProperty(this, identity.MAP, { value: map.map });
        Object.defineProperty(this, identity.SCALAR, { value: string.string });
        Object.defineProperty(this, identity.SEQ, { value: seq2.seq });
        this.sortMapEntries = typeof sortMapEntries === "function" ? sortMapEntries : sortMapEntries === true ? sortMapEntriesByKey : null;
      }
      clone() {
        const copy = Object.create(_Schema.prototype, Object.getOwnPropertyDescriptors(this));
        copy.tags = this.tags.slice();
        return copy;
      }
    };
    exports.Schema = Schema;
  }
});

// ../../packages/core/node_modules/yaml/dist/stringify/stringifyDocument.js
var require_stringifyDocument = __commonJS({
  "../../packages/core/node_modules/yaml/dist/stringify/stringifyDocument.js"(exports) {
    "use strict";
    var identity = require_identity();
    var stringify = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyDocument(doc, options) {
      const lines = [];
      let hasDirectives = options.directives === true;
      if (options.directives !== false && doc.directives) {
        const dir = doc.directives.toString(doc);
        if (dir) {
          lines.push(dir);
          hasDirectives = true;
        } else if (doc.directives.docStart)
          hasDirectives = true;
      }
      if (hasDirectives)
        lines.push("---");
      const ctx = stringify.createStringifyContext(doc, options);
      const { commentString } = ctx.options;
      if (doc.commentBefore) {
        if (lines.length !== 1)
          lines.unshift("");
        const cs = commentString(doc.commentBefore);
        lines.unshift(stringifyComment.indentComment(cs, ""));
      }
      let chompKeep = false;
      let contentComment = null;
      if (doc.contents) {
        if (identity.isNode(doc.contents)) {
          if (doc.contents.spaceBefore && hasDirectives)
            lines.push("");
          if (doc.contents.commentBefore) {
            const cs = commentString(doc.contents.commentBefore);
            lines.push(stringifyComment.indentComment(cs, ""));
          }
          ctx.forceBlockIndent = !!doc.comment;
          contentComment = doc.contents.comment;
        }
        const onChompKeep = contentComment ? void 0 : () => chompKeep = true;
        let body = stringify.stringify(doc.contents, ctx, () => contentComment = null, onChompKeep);
        if (contentComment)
          body += stringifyComment.lineComment(body, "", commentString(contentComment));
        if ((body[0] === "|" || body[0] === ">") && lines[lines.length - 1] === "---") {
          lines[lines.length - 1] = `--- ${body}`;
        } else
          lines.push(body);
      } else {
        lines.push(stringify.stringify(doc.contents, ctx));
      }
      if (doc.directives?.docEnd) {
        if (doc.comment) {
          const cs = commentString(doc.comment);
          if (cs.includes("\n")) {
            lines.push("...");
            lines.push(stringifyComment.indentComment(cs, ""));
          } else {
            lines.push(`... ${cs}`);
          }
        } else {
          lines.push("...");
        }
      } else {
        let dc = doc.comment;
        if (dc && chompKeep)
          dc = dc.replace(/^\n+/, "");
        if (dc) {
          if ((!chompKeep || contentComment) && lines[lines.length - 1] !== "")
            lines.push("");
          lines.push(stringifyComment.indentComment(commentString(dc), ""));
        }
      }
      return lines.join("\n") + "\n";
    }
    exports.stringifyDocument = stringifyDocument;
  }
});

// ../../packages/core/node_modules/yaml/dist/doc/Document.js
var require_Document = __commonJS({
  "../../packages/core/node_modules/yaml/dist/doc/Document.js"(exports) {
    "use strict";
    var Alias = require_Alias();
    var Collection = require_Collection();
    var identity = require_identity();
    var Pair = require_Pair();
    var toJS = require_toJS();
    var Schema = require_Schema();
    var stringifyDocument = require_stringifyDocument();
    var anchors = require_anchors();
    var applyReviver = require_applyReviver();
    var createNode = require_createNode();
    var directives = require_directives();
    var Document = class _Document {
      constructor(value, replacer, options) {
        this.commentBefore = null;
        this.comment = null;
        this.errors = [];
        this.warnings = [];
        Object.defineProperty(this, identity.NODE_TYPE, { value: identity.DOC });
        let _replacer = null;
        if (typeof replacer === "function" || Array.isArray(replacer)) {
          _replacer = replacer;
        } else if (options === void 0 && replacer) {
          options = replacer;
          replacer = void 0;
        }
        const opt = Object.assign({
          intAsBigInt: false,
          keepSourceTokens: false,
          logLevel: "warn",
          prettyErrors: true,
          strict: true,
          stringKeys: false,
          uniqueKeys: true,
          version: "1.2"
        }, options);
        this.options = opt;
        let { version } = opt;
        if (options?._directives) {
          this.directives = options._directives.atDocument();
          if (this.directives.yaml.explicit)
            version = this.directives.yaml.version;
        } else
          this.directives = new directives.Directives({ version });
        this.setSchema(version, options);
        this.contents = value === void 0 ? null : this.createNode(value, _replacer, options);
      }
      /**
       * Create a deep copy of this Document and its contents.
       *
       * Custom Node values that inherit from `Object` still refer to their original instances.
       */
      clone() {
        const copy = Object.create(_Document.prototype, {
          [identity.NODE_TYPE]: { value: identity.DOC }
        });
        copy.commentBefore = this.commentBefore;
        copy.comment = this.comment;
        copy.errors = this.errors.slice();
        copy.warnings = this.warnings.slice();
        copy.options = Object.assign({}, this.options);
        if (this.directives)
          copy.directives = this.directives.clone();
        copy.schema = this.schema.clone();
        copy.contents = identity.isNode(this.contents) ? this.contents.clone(copy.schema) : this.contents;
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /** Adds a value to the document. */
      add(value) {
        if (assertCollection(this.contents))
          this.contents.add(value);
      }
      /** Adds a value to the document. */
      addIn(path3, value) {
        if (assertCollection(this.contents))
          this.contents.addIn(path3, value);
      }
      /**
       * Create a new `Alias` node, ensuring that the target `node` has the required anchor.
       *
       * If `node` already has an anchor, `name` is ignored.
       * Otherwise, the `node.anchor` value will be set to `name`,
       * or if an anchor with that name is already present in the document,
       * `name` will be used as a prefix for a new unique anchor.
       * If `name` is undefined, the generated anchor will use 'a' as a prefix.
       */
      createAlias(node, name) {
        if (!node.anchor) {
          const prev = anchors.anchorNames(this);
          node.anchor = // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          !name || prev.has(name) ? anchors.findNewAnchor(name || "a", prev) : name;
        }
        return new Alias.Alias(node.anchor);
      }
      createNode(value, replacer, options) {
        let _replacer = void 0;
        if (typeof replacer === "function") {
          value = replacer.call({ "": value }, "", value);
          _replacer = replacer;
        } else if (Array.isArray(replacer)) {
          const keyToStr = (v) => typeof v === "number" || v instanceof String || v instanceof Number;
          const asStr = replacer.filter(keyToStr).map(String);
          if (asStr.length > 0)
            replacer = replacer.concat(asStr);
          _replacer = replacer;
        } else if (options === void 0 && replacer) {
          options = replacer;
          replacer = void 0;
        }
        const { aliasDuplicateObjects, anchorPrefix, flow, keepUndefined, onTagObj, tag } = options ?? {};
        const { onAnchor, setAnchors, sourceObjects } = anchors.createNodeAnchors(
          this,
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          anchorPrefix || "a"
        );
        const ctx = {
          aliasDuplicateObjects: aliasDuplicateObjects ?? true,
          keepUndefined: keepUndefined ?? false,
          onAnchor,
          onTagObj,
          replacer: _replacer,
          schema: this.schema,
          sourceObjects
        };
        const node = createNode.createNode(value, tag, ctx);
        if (flow && identity.isCollection(node))
          node.flow = true;
        setAnchors();
        return node;
      }
      /**
       * Convert a key and a value into a `Pair` using the current schema,
       * recursively wrapping all values as `Scalar` or `Collection` nodes.
       */
      createPair(key, value, options = {}) {
        const k = this.createNode(key, null, options);
        const v = this.createNode(value, null, options);
        return new Pair.Pair(k, v);
      }
      /**
       * Removes a value from the document.
       * @returns `true` if the item was found and removed.
       */
      delete(key) {
        return assertCollection(this.contents) ? this.contents.delete(key) : false;
      }
      /**
       * Removes a value from the document.
       * @returns `true` if the item was found and removed.
       */
      deleteIn(path3) {
        if (Collection.isEmptyPath(path3)) {
          if (this.contents == null)
            return false;
          this.contents = null;
          return true;
        }
        return assertCollection(this.contents) ? this.contents.deleteIn(path3) : false;
      }
      /**
       * Returns item at `key`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      get(key, keepScalar) {
        return identity.isCollection(this.contents) ? this.contents.get(key, keepScalar) : void 0;
      }
      /**
       * Returns item at `path`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      getIn(path3, keepScalar) {
        if (Collection.isEmptyPath(path3))
          return !keepScalar && identity.isScalar(this.contents) ? this.contents.value : this.contents;
        return identity.isCollection(this.contents) ? this.contents.getIn(path3, keepScalar) : void 0;
      }
      /**
       * Checks if the document includes a value with the key `key`.
       */
      has(key) {
        return identity.isCollection(this.contents) ? this.contents.has(key) : false;
      }
      /**
       * Checks if the document includes a value at `path`.
       */
      hasIn(path3) {
        if (Collection.isEmptyPath(path3))
          return this.contents !== void 0;
        return identity.isCollection(this.contents) ? this.contents.hasIn(path3) : false;
      }
      /**
       * Sets a value in this document. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      set(key, value) {
        if (this.contents == null) {
          this.contents = Collection.collectionFromPath(this.schema, [key], value);
        } else if (assertCollection(this.contents)) {
          this.contents.set(key, value);
        }
      }
      /**
       * Sets a value in this document. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      setIn(path3, value) {
        if (Collection.isEmptyPath(path3)) {
          this.contents = value;
        } else if (this.contents == null) {
          this.contents = Collection.collectionFromPath(this.schema, Array.from(path3), value);
        } else if (assertCollection(this.contents)) {
          this.contents.setIn(path3, value);
        }
      }
      /**
       * Change the YAML version and schema used by the document.
       * A `null` version disables support for directives, explicit tags, anchors, and aliases.
       * It also requires the `schema` option to be given as a `Schema` instance value.
       *
       * Overrides all previously set schema options.
       */
      setSchema(version, options = {}) {
        if (typeof version === "number")
          version = String(version);
        let opt;
        switch (version) {
          case "1.1":
            if (this.directives)
              this.directives.yaml.version = "1.1";
            else
              this.directives = new directives.Directives({ version: "1.1" });
            opt = { resolveKnownTags: false, schema: "yaml-1.1" };
            break;
          case "1.2":
          case "next":
            if (this.directives)
              this.directives.yaml.version = version;
            else
              this.directives = new directives.Directives({ version });
            opt = { resolveKnownTags: true, schema: "core" };
            break;
          case null:
            if (this.directives)
              delete this.directives;
            opt = null;
            break;
          default: {
            const sv = JSON.stringify(version);
            throw new Error(`Expected '1.1', '1.2' or null as first argument, but found: ${sv}`);
          }
        }
        if (options.schema instanceof Object)
          this.schema = options.schema;
        else if (opt)
          this.schema = new Schema.Schema(Object.assign(opt, options));
        else
          throw new Error(`With a null YAML version, the { schema: Schema } option is required`);
      }
      // json & jsonArg are only used from toJSON()
      toJS({ json, jsonArg, mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
        const ctx = {
          anchors: /* @__PURE__ */ new Map(),
          doc: this,
          keep: !json,
          mapAsMap: mapAsMap === true,
          mapKeyWarned: false,
          maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
        };
        const res = toJS.toJS(this.contents, jsonArg ?? "", ctx);
        if (typeof onAnchor === "function")
          for (const { count, res: res2 } of ctx.anchors.values())
            onAnchor(res2, count);
        return typeof reviver === "function" ? applyReviver.applyReviver(reviver, { "": res }, "", res) : res;
      }
      /**
       * A JSON representation of the document `contents`.
       *
       * @param jsonArg Used by `JSON.stringify` to indicate the array index or
       *   property name.
       */
      toJSON(jsonArg, onAnchor) {
        return this.toJS({ json: true, jsonArg, mapAsMap: false, onAnchor });
      }
      /** A YAML representation of the document. */
      toString(options = {}) {
        if (this.errors.length > 0)
          throw new Error("Document with errors cannot be stringified");
        if ("indent" in options && (!Number.isInteger(options.indent) || Number(options.indent) <= 0)) {
          const s = JSON.stringify(options.indent);
          throw new Error(`"indent" option must be a positive integer, not ${s}`);
        }
        return stringifyDocument.stringifyDocument(this, options);
      }
    };
    function assertCollection(contents) {
      if (identity.isCollection(contents))
        return true;
      throw new Error("Expected a YAML collection as document contents");
    }
    exports.Document = Document;
  }
});

// ../../packages/core/node_modules/yaml/dist/errors.js
var require_errors = __commonJS({
  "../../packages/core/node_modules/yaml/dist/errors.js"(exports) {
    "use strict";
    var YAMLError = class extends Error {
      constructor(name, pos, code, message) {
        super();
        this.name = name;
        this.code = code;
        this.message = message;
        this.pos = pos;
      }
    };
    var YAMLParseError = class extends YAMLError {
      constructor(pos, code, message) {
        super("YAMLParseError", pos, code, message);
      }
    };
    var YAMLWarning = class extends YAMLError {
      constructor(pos, code, message) {
        super("YAMLWarning", pos, code, message);
      }
    };
    var prettifyError = (src, lc) => (error) => {
      if (error.pos[0] === -1)
        return;
      error.linePos = error.pos.map((pos) => lc.linePos(pos));
      const { line, col } = error.linePos[0];
      error.message += ` at line ${line}, column ${col}`;
      let ci = col - 1;
      let lineStr = src.substring(lc.lineStarts[line - 1], lc.lineStarts[line]).replace(/[\n\r]+$/, "");
      if (ci >= 60 && lineStr.length > 80) {
        const trimStart = Math.min(ci - 39, lineStr.length - 79);
        lineStr = "\u2026" + lineStr.substring(trimStart);
        ci -= trimStart - 1;
      }
      if (lineStr.length > 80)
        lineStr = lineStr.substring(0, 79) + "\u2026";
      if (line > 1 && /^ *$/.test(lineStr.substring(0, ci))) {
        let prev = src.substring(lc.lineStarts[line - 2], lc.lineStarts[line - 1]);
        if (prev.length > 80)
          prev = prev.substring(0, 79) + "\u2026\n";
        lineStr = prev + lineStr;
      }
      if (/[^ ]/.test(lineStr)) {
        let count = 1;
        const end = error.linePos[1];
        if (end?.line === line && end.col > col) {
          count = Math.max(1, Math.min(end.col - col, 80 - ci));
        }
        const pointer = " ".repeat(ci) + "^".repeat(count);
        error.message += `:

${lineStr}
${pointer}
`;
      }
    };
    exports.YAMLError = YAMLError;
    exports.YAMLParseError = YAMLParseError;
    exports.YAMLWarning = YAMLWarning;
    exports.prettifyError = prettifyError;
  }
});

// ../../packages/core/node_modules/yaml/dist/compose/resolve-props.js
var require_resolve_props = __commonJS({
  "../../packages/core/node_modules/yaml/dist/compose/resolve-props.js"(exports) {
    "use strict";
    function resolveProps(tokens, { flow, indicator, next, offset, onError, parentIndent, startOnNewline }) {
      let spaceBefore = false;
      let atNewline = startOnNewline;
      let hasSpace = startOnNewline;
      let comment = "";
      let commentSep = "";
      let hasNewline = false;
      let reqSpace = false;
      let tab = null;
      let anchor = null;
      let tag = null;
      let newlineAfterProp = null;
      let comma = null;
      let found = null;
      let start = null;
      for (const token2 of tokens) {
        if (reqSpace) {
          if (token2.type !== "space" && token2.type !== "newline" && token2.type !== "comma")
            onError(token2.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
          reqSpace = false;
        }
        if (tab) {
          if (atNewline && token2.type !== "comment" && token2.type !== "newline") {
            onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
          }
          tab = null;
        }
        switch (token2.type) {
          case "space":
            if (!flow && (indicator !== "doc-start" || next?.type !== "flow-collection") && token2.source.includes("	")) {
              tab = token2;
            }
            hasSpace = true;
            break;
          case "comment": {
            if (!hasSpace)
              onError(token2, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
            const cb = token2.source.substring(1) || " ";
            if (!comment)
              comment = cb;
            else
              comment += commentSep + cb;
            commentSep = "";
            atNewline = false;
            break;
          }
          case "newline":
            if (atNewline) {
              if (comment)
                comment += token2.source;
              else if (!found || indicator !== "seq-item-ind")
                spaceBefore = true;
            } else
              commentSep += token2.source;
            atNewline = true;
            hasNewline = true;
            if (anchor || tag)
              newlineAfterProp = token2;
            hasSpace = true;
            break;
          case "anchor":
            if (anchor)
              onError(token2, "MULTIPLE_ANCHORS", "A node can have at most one anchor");
            if (token2.source.endsWith(":"))
              onError(token2.offset + token2.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", true);
            anchor = token2;
            start ?? (start = token2.offset);
            atNewline = false;
            hasSpace = false;
            reqSpace = true;
            break;
          case "tag": {
            if (tag)
              onError(token2, "MULTIPLE_TAGS", "A node can have at most one tag");
            tag = token2;
            start ?? (start = token2.offset);
            atNewline = false;
            hasSpace = false;
            reqSpace = true;
            break;
          }
          case indicator:
            if (anchor || tag)
              onError(token2, "BAD_PROP_ORDER", `Anchors and tags must be after the ${token2.source} indicator`);
            if (found)
              onError(token2, "UNEXPECTED_TOKEN", `Unexpected ${token2.source} in ${flow ?? "collection"}`);
            found = token2;
            atNewline = indicator === "seq-item-ind" || indicator === "explicit-key-ind";
            hasSpace = false;
            break;
          case "comma":
            if (flow) {
              if (comma)
                onError(token2, "UNEXPECTED_TOKEN", `Unexpected , in ${flow}`);
              comma = token2;
              atNewline = false;
              hasSpace = false;
              break;
            }
          // else fallthrough
          default:
            onError(token2, "UNEXPECTED_TOKEN", `Unexpected ${token2.type} token`);
            atNewline = false;
            hasSpace = false;
        }
      }
      const last = tokens[tokens.length - 1];
      const end = last ? last.offset + last.source.length : offset;
      if (reqSpace && next && next.type !== "space" && next.type !== "newline" && next.type !== "comma" && (next.type !== "scalar" || next.source !== "")) {
        onError(next.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
      }
      if (tab && (atNewline && tab.indent <= parentIndent || next?.type === "block-map" || next?.type === "block-seq"))
        onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
      return {
        comma,
        found,
        spaceBefore,
        comment,
        hasNewline,
        anchor,
        tag,
        newlineAfterProp,
        end,
        start: start ?? end
      };
    }
    exports.resolveProps = resolveProps;
  }
});

// ../../packages/core/node_modules/yaml/dist/compose/util-contains-newline.js
var require_util_contains_newline = __commonJS({
  "../../packages/core/node_modules/yaml/dist/compose/util-contains-newline.js"(exports) {
    "use strict";
    function containsNewline(key) {
      if (!key)
        return null;
      switch (key.type) {
        case "alias":
        case "scalar":
        case "double-quoted-scalar":
        case "single-quoted-scalar":
          if (key.source.includes("\n"))
            return true;
          if (key.end) {
            for (const st of key.end)
              if (st.type === "newline")
                return true;
          }
          return false;
        case "flow-collection":
          for (const it of key.items) {
            for (const st of it.start)
              if (st.type === "newline")
                return true;
            if (it.sep) {
              for (const st of it.sep)
                if (st.type === "newline")
                  return true;
            }
            if (containsNewline(it.key) || containsNewline(it.value))
              return true;
          }
          return false;
        default:
          return true;
      }
    }
    exports.containsNewline = containsNewline;
  }
});

// ../../packages/core/node_modules/yaml/dist/compose/util-flow-indent-check.js
var require_util_flow_indent_check = __commonJS({
  "../../packages/core/node_modules/yaml/dist/compose/util-flow-indent-check.js"(exports) {
    "use strict";
    var utilContainsNewline = require_util_contains_newline();
    function flowIndentCheck(indent, fc, onError) {
      if (fc?.type === "flow-collection") {
        const end = fc.end[0];
        if (end.indent === indent && (end.source === "]" || end.source === "}") && utilContainsNewline.containsNewline(fc)) {
          const msg = "Flow end indicator should be more indented than parent";
          onError(end, "BAD_INDENT", msg, true);
        }
      }
    }
    exports.flowIndentCheck = flowIndentCheck;
  }
});

// ../../packages/core/node_modules/yaml/dist/compose/util-map-includes.js
var require_util_map_includes = __commonJS({
  "../../packages/core/node_modules/yaml/dist/compose/util-map-includes.js"(exports) {
    "use strict";
    var identity = require_identity();
    function mapIncludes(ctx, items, search) {
      const { uniqueKeys } = ctx.options;
      if (uniqueKeys === false)
        return false;
      const isEqual = typeof uniqueKeys === "function" ? uniqueKeys : (a, b) => a === b || identity.isScalar(a) && identity.isScalar(b) && a.value === b.value;
      return items.some((pair) => isEqual(pair.key, search));
    }
    exports.mapIncludes = mapIncludes;
  }
});

// ../../packages/core/node_modules/yaml/dist/compose/resolve-block-map.js
var require_resolve_block_map = __commonJS({
  "../../packages/core/node_modules/yaml/dist/compose/resolve-block-map.js"(exports) {
    "use strict";
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var resolveProps = require_resolve_props();
    var utilContainsNewline = require_util_contains_newline();
    var utilFlowIndentCheck = require_util_flow_indent_check();
    var utilMapIncludes = require_util_map_includes();
    var startColMsg = "All mapping items must start at the same column";
    function resolveBlockMap({ composeNode, composeEmptyNode }, ctx, bm, onError, tag) {
      const NodeClass = tag?.nodeClass ?? YAMLMap.YAMLMap;
      const map = new NodeClass(ctx.schema);
      if (ctx.atRoot)
        ctx.atRoot = false;
      let offset = bm.offset;
      let commentEnd = null;
      for (const collItem of bm.items) {
        const { start, key, sep, value } = collItem;
        const keyProps = resolveProps.resolveProps(start, {
          indicator: "explicit-key-ind",
          next: key ?? sep?.[0],
          offset,
          onError,
          parentIndent: bm.indent,
          startOnNewline: true
        });
        const implicitKey = !keyProps.found;
        if (implicitKey) {
          if (key) {
            if (key.type === "block-seq")
              onError(offset, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key");
            else if ("indent" in key && key.indent !== bm.indent)
              onError(offset, "BAD_INDENT", startColMsg);
          }
          if (!keyProps.anchor && !keyProps.tag && !sep) {
            commentEnd = keyProps.end;
            if (keyProps.comment) {
              if (map.comment)
                map.comment += "\n" + keyProps.comment;
              else
                map.comment = keyProps.comment;
            }
            continue;
          }
          if (keyProps.newlineAfterProp || utilContainsNewline.containsNewline(key)) {
            onError(key ?? start[start.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line");
          }
        } else if (keyProps.found?.indent !== bm.indent) {
          onError(offset, "BAD_INDENT", startColMsg);
        }
        ctx.atKey = true;
        const keyStart = keyProps.end;
        const keyNode = key ? composeNode(ctx, key, keyProps, onError) : composeEmptyNode(ctx, keyStart, start, null, keyProps, onError);
        if (ctx.schema.compat)
          utilFlowIndentCheck.flowIndentCheck(bm.indent, key, onError);
        ctx.atKey = false;
        if (utilMapIncludes.mapIncludes(ctx, map.items, keyNode))
          onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
        const valueProps = resolveProps.resolveProps(sep ?? [], {
          indicator: "map-value-ind",
          next: value,
          offset: keyNode.range[2],
          onError,
          parentIndent: bm.indent,
          startOnNewline: !key || key.type === "block-scalar"
        });
        offset = valueProps.end;
        if (valueProps.found) {
          if (implicitKey) {
            if (value?.type === "block-map" && !valueProps.hasNewline)
              onError(offset, "BLOCK_AS_IMPLICIT_KEY", "Nested mappings are not allowed in compact mappings");
            if (ctx.options.strict && keyProps.start < valueProps.found.offset - 1024)
              onError(keyNode.range, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit block mapping key");
          }
          const valueNode = value ? composeNode(ctx, value, valueProps, onError) : composeEmptyNode(ctx, offset, sep, null, valueProps, onError);
          if (ctx.schema.compat)
            utilFlowIndentCheck.flowIndentCheck(bm.indent, value, onError);
          offset = valueNode.range[2];
          const pair = new Pair.Pair(keyNode, valueNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          map.items.push(pair);
        } else {
          if (implicitKey)
            onError(keyNode.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values");
          if (valueProps.comment) {
            if (keyNode.comment)
              keyNode.comment += "\n" + valueProps.comment;
            else
              keyNode.comment = valueProps.comment;
          }
          const pair = new Pair.Pair(keyNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          map.items.push(pair);
        }
      }
      if (commentEnd && commentEnd < offset)
        onError(commentEnd, "IMPOSSIBLE", "Map comment with trailing content");
      map.range = [bm.offset, offset, commentEnd ?? offset];
      return map;
    }
    exports.resolveBlockMap = resolveBlockMap;
  }
});

// ../../packages/core/node_modules/yaml/dist/compose/resolve-block-seq.js
var require_resolve_block_seq = __commonJS({
  "../../packages/core/node_modules/yaml/dist/compose/resolve-block-seq.js"(exports) {
    "use strict";
    var YAMLSeq = require_YAMLSeq();
    var resolveProps = require_resolve_props();
    var utilFlowIndentCheck = require_util_flow_indent_check();
    function resolveBlockSeq({ composeNode, composeEmptyNode }, ctx, bs, onError, tag) {
      const NodeClass = tag?.nodeClass ?? YAMLSeq.YAMLSeq;
      const seq2 = new NodeClass(ctx.schema);
      if (ctx.atRoot)
        ctx.atRoot = false;
      if (ctx.atKey)
        ctx.atKey = false;
      let offset = bs.offset;
      let commentEnd = null;
      for (const { start, value } of bs.items) {
        const props = resolveProps.resolveProps(start, {
          indicator: "seq-item-ind",
          next: value,
          offset,
          onError,
          parentIndent: bs.indent,
          startOnNewline: true
        });
        if (!props.found) {
          if (props.anchor || props.tag || value) {
            if (value?.type === "block-seq")
              onError(props.end, "BAD_INDENT", "All sequence items must start at the same column");
            else
              onError(offset, "MISSING_CHAR", "Sequence item without - indicator");
          } else {
            commentEnd = props.end;
            if (props.comment)
              seq2.comment = props.comment;
            continue;
          }
        }
        const node = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, start, null, props, onError);
        if (ctx.schema.compat)
          utilFlowIndentCheck.flowIndentCheck(bs.indent, value, onError);
        offset = node.range[2];
        seq2.items.push(node);
      }
      seq2.range = [bs.offset, offset, commentEnd ?? offset];
      return seq2;
    }
    exports.resolveBlockSeq = resolveBlockSeq;
  }
});

// ../../packages/core/node_modules/yaml/dist/compose/resolve-end.js
var require_resolve_end = __commonJS({
  "../../packages/core/node_modules/yaml/dist/compose/resolve-end.js"(exports) {
    "use strict";
    function resolveEnd(end, offset, reqSpace, onError) {
      let comment = "";
      if (end) {
        let hasSpace = false;
        let sep = "";
        for (const token2 of end) {
          const { source, type } = token2;
          switch (type) {
            case "space":
              hasSpace = true;
              break;
            case "comment": {
              if (reqSpace && !hasSpace)
                onError(token2, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
              const cb = source.substring(1) || " ";
              if (!comment)
                comment = cb;
              else
                comment += sep + cb;
              sep = "";
              break;
            }
            case "newline":
              if (comment)
                sep += source;
              hasSpace = true;
              break;
            default:
              onError(token2, "UNEXPECTED_TOKEN", `Unexpected ${type} at node end`);
          }
          offset += source.length;
        }
      }
      return { comment, offset };
    }
    exports.resolveEnd = resolveEnd;
  }
});

// ../../packages/core/node_modules/yaml/dist/compose/resolve-flow-collection.js
var require_resolve_flow_collection = __commonJS({
  "../../packages/core/node_modules/yaml/dist/compose/resolve-flow-collection.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var resolveEnd = require_resolve_end();
    var resolveProps = require_resolve_props();
    var utilContainsNewline = require_util_contains_newline();
    var utilMapIncludes = require_util_map_includes();
    var blockMsg = "Block collections are not allowed within flow collections";
    var isBlock = (token2) => token2 && (token2.type === "block-map" || token2.type === "block-seq");
    function resolveFlowCollection({ composeNode, composeEmptyNode }, ctx, fc, onError, tag) {
      const isMap2 = fc.start.source === "{";
      const fcName = isMap2 ? "flow map" : "flow sequence";
      const NodeClass = tag?.nodeClass ?? (isMap2 ? YAMLMap.YAMLMap : YAMLSeq.YAMLSeq);
      const coll = new NodeClass(ctx.schema);
      coll.flow = true;
      const atRoot = ctx.atRoot;
      if (atRoot)
        ctx.atRoot = false;
      if (ctx.atKey)
        ctx.atKey = false;
      let offset = fc.offset + fc.start.source.length;
      for (let i = 0; i < fc.items.length; ++i) {
        const collItem = fc.items[i];
        const { start, key, sep, value } = collItem;
        const props = resolveProps.resolveProps(start, {
          flow: fcName,
          indicator: "explicit-key-ind",
          next: key ?? sep?.[0],
          offset,
          onError,
          parentIndent: fc.indent,
          startOnNewline: false
        });
        if (!props.found) {
          if (!props.anchor && !props.tag && !sep && !value) {
            if (i === 0 && props.comma)
              onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
            else if (i < fc.items.length - 1)
              onError(props.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${fcName}`);
            if (props.comment) {
              if (coll.comment)
                coll.comment += "\n" + props.comment;
              else
                coll.comment = props.comment;
            }
            offset = props.end;
            continue;
          }
          if (!isMap2 && ctx.options.strict && utilContainsNewline.containsNewline(key))
            onError(
              key,
              // checked by containsNewline()
              "MULTILINE_IMPLICIT_KEY",
              "Implicit keys of flow sequence pairs need to be on a single line"
            );
        }
        if (i === 0) {
          if (props.comma)
            onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
        } else {
          if (!props.comma)
            onError(props.start, "MISSING_CHAR", `Missing , between ${fcName} items`);
          if (props.comment) {
            let prevItemComment = "";
            loop: for (const st of start) {
              switch (st.type) {
                case "comma":
                case "space":
                  break;
                case "comment":
                  prevItemComment = st.source.substring(1);
                  break loop;
                default:
                  break loop;
              }
            }
            if (prevItemComment) {
              let prev = coll.items[coll.items.length - 1];
              if (identity.isPair(prev))
                prev = prev.value ?? prev.key;
              if (prev.comment)
                prev.comment += "\n" + prevItemComment;
              else
                prev.comment = prevItemComment;
              props.comment = props.comment.substring(prevItemComment.length + 1);
            }
          }
        }
        if (!isMap2 && !sep && !props.found) {
          const valueNode = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, sep, null, props, onError);
          coll.items.push(valueNode);
          offset = valueNode.range[2];
          if (isBlock(value))
            onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
        } else {
          ctx.atKey = true;
          const keyStart = props.end;
          const keyNode = key ? composeNode(ctx, key, props, onError) : composeEmptyNode(ctx, keyStart, start, null, props, onError);
          if (isBlock(key))
            onError(keyNode.range, "BLOCK_IN_FLOW", blockMsg);
          ctx.atKey = false;
          const valueProps = resolveProps.resolveProps(sep ?? [], {
            flow: fcName,
            indicator: "map-value-ind",
            next: value,
            offset: keyNode.range[2],
            onError,
            parentIndent: fc.indent,
            startOnNewline: false
          });
          if (valueProps.found) {
            if (!isMap2 && !props.found && ctx.options.strict) {
              if (sep)
                for (const st of sep) {
                  if (st === valueProps.found)
                    break;
                  if (st.type === "newline") {
                    onError(st, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
                    break;
                  }
                }
              if (props.start < valueProps.found.offset - 1024)
                onError(valueProps.found, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key");
            }
          } else if (value) {
            if ("source" in value && value.source?.[0] === ":")
              onError(value, "MISSING_CHAR", `Missing space after : in ${fcName}`);
            else
              onError(valueProps.start, "MISSING_CHAR", `Missing , or : between ${fcName} items`);
          }
          const valueNode = value ? composeNode(ctx, value, valueProps, onError) : valueProps.found ? composeEmptyNode(ctx, valueProps.end, sep, null, valueProps, onError) : null;
          if (valueNode) {
            if (isBlock(value))
              onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
          } else if (valueProps.comment) {
            if (keyNode.comment)
              keyNode.comment += "\n" + valueProps.comment;
            else
              keyNode.comment = valueProps.comment;
          }
          const pair = new Pair.Pair(keyNode, valueNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          if (isMap2) {
            const map = coll;
            if (utilMapIncludes.mapIncludes(ctx, map.items, keyNode))
              onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
            map.items.push(pair);
          } else {
            const map = new YAMLMap.YAMLMap(ctx.schema);
            map.flow = true;
            map.items.push(pair);
            const endRange = (valueNode ?? keyNode).range;
            map.range = [keyNode.range[0], endRange[1], endRange[2]];
            coll.items.push(map);
          }
          offset = valueNode ? valueNode.range[2] : valueProps.end;
        }
      }
      const expectedEnd = isMap2 ? "}" : "]";
      const [ce, ...ee] = fc.end;
      let cePos = offset;
      if (ce?.source === expectedEnd)
        cePos = ce.offset + ce.source.length;
      else {
        const name = fcName[0].toUpperCase() + fcName.substring(1);
        const msg = atRoot ? `${name} must end with a ${expectedEnd}` : `${name} in block collection must be sufficiently indented and end with a ${expectedEnd}`;
        onError(offset, atRoot ? "MISSING_CHAR" : "BAD_INDENT", msg);
        if (ce && ce.source.length !== 1)
          ee.unshift(ce);
      }
      if (ee.length > 0) {
        const end = resolveEnd.resolveEnd(ee, cePos, ctx.options.strict, onError);
        if (end.comment) {
          if (coll.comment)
            coll.comment += "\n" + end.comment;
          else
            coll.comment = end.comment;
        }
        coll.range = [fc.offset, cePos, end.offset];
      } else {
        coll.range = [fc.offset, cePos, cePos];
      }
      return coll;
    }
    exports.resolveFlowCollection = resolveFlowCollection;
  }
});

// ../../packages/core/node_modules/yaml/dist/compose/compose-collection.js
var require_compose_collection = __commonJS({
  "../../packages/core/node_modules/yaml/dist/compose/compose-collection.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var resolveBlockMap = require_resolve_block_map();
    var resolveBlockSeq = require_resolve_block_seq();
    var resolveFlowCollection = require_resolve_flow_collection();
    function resolveCollection(CN, ctx, token2, onError, tagName, tag) {
      const coll = token2.type === "block-map" ? resolveBlockMap.resolveBlockMap(CN, ctx, token2, onError, tag) : token2.type === "block-seq" ? resolveBlockSeq.resolveBlockSeq(CN, ctx, token2, onError, tag) : resolveFlowCollection.resolveFlowCollection(CN, ctx, token2, onError, tag);
      const Coll = coll.constructor;
      if (tagName === "!" || tagName === Coll.tagName) {
        coll.tag = Coll.tagName;
        return coll;
      }
      if (tagName)
        coll.tag = tagName;
      return coll;
    }
    function composeCollection(CN, ctx, token2, props, onError) {
      const tagToken = props.tag;
      const tagName = !tagToken ? null : ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg));
      if (token2.type === "block-seq") {
        const { anchor, newlineAfterProp: nl } = props;
        const lastProp = anchor && tagToken ? anchor.offset > tagToken.offset ? anchor : tagToken : anchor ?? tagToken;
        if (lastProp && (!nl || nl.offset < lastProp.offset)) {
          const message = "Missing newline after block sequence props";
          onError(lastProp, "MISSING_CHAR", message);
        }
      }
      const expType = token2.type === "block-map" ? "map" : token2.type === "block-seq" ? "seq" : token2.start.source === "{" ? "map" : "seq";
      if (!tagToken || !tagName || tagName === "!" || tagName === YAMLMap.YAMLMap.tagName && expType === "map" || tagName === YAMLSeq.YAMLSeq.tagName && expType === "seq") {
        return resolveCollection(CN, ctx, token2, onError, tagName);
      }
      let tag = ctx.schema.tags.find((t) => t.tag === tagName && t.collection === expType);
      if (!tag) {
        const kt = ctx.schema.knownTags[tagName];
        if (kt?.collection === expType) {
          ctx.schema.tags.push(Object.assign({}, kt, { default: false }));
          tag = kt;
        } else {
          if (kt) {
            onError(tagToken, "BAD_COLLECTION_TYPE", `${kt.tag} used for ${expType} collection, but expects ${kt.collection ?? "scalar"}`, true);
          } else {
            onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, true);
          }
          return resolveCollection(CN, ctx, token2, onError, tagName);
        }
      }
      const coll = resolveCollection(CN, ctx, token2, onError, tagName, tag);
      const res = tag.resolve?.(coll, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg), ctx.options) ?? coll;
      const node = identity.isNode(res) ? res : new Scalar.Scalar(res);
      node.range = coll.range;
      node.tag = tagName;
      if (tag?.format)
        node.format = tag.format;
      return node;
    }
    exports.composeCollection = composeCollection;
  }
});

// ../../packages/core/node_modules/yaml/dist/compose/resolve-block-scalar.js
var require_resolve_block_scalar = __commonJS({
  "../../packages/core/node_modules/yaml/dist/compose/resolve-block-scalar.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    function resolveBlockScalar(ctx, scalar, onError) {
      const start = scalar.offset;
      const header = parseBlockScalarHeader(scalar, ctx.options.strict, onError);
      if (!header)
        return { value: "", type: null, comment: "", range: [start, start, start] };
      const type = header.mode === ">" ? Scalar.Scalar.BLOCK_FOLDED : Scalar.Scalar.BLOCK_LITERAL;
      const lines = scalar.source ? splitLines(scalar.source) : [];
      let chompStart = lines.length;
      for (let i = lines.length - 1; i >= 0; --i) {
        const content = lines[i][1];
        if (content === "" || content === "\r")
          chompStart = i;
        else
          break;
      }
      if (chompStart === 0) {
        const value2 = header.chomp === "+" && lines.length > 0 ? "\n".repeat(Math.max(1, lines.length - 1)) : "";
        let end2 = start + header.length;
        if (scalar.source)
          end2 += scalar.source.length;
        return { value: value2, type, comment: header.comment, range: [start, end2, end2] };
      }
      let trimIndent = scalar.indent + header.indent;
      let offset = scalar.offset + header.length;
      let contentStart = 0;
      for (let i = 0; i < chompStart; ++i) {
        const [indent, content] = lines[i];
        if (content === "" || content === "\r") {
          if (header.indent === 0 && indent.length > trimIndent)
            trimIndent = indent.length;
        } else {
          if (indent.length < trimIndent) {
            const message = "Block scalars with more-indented leading empty lines must use an explicit indentation indicator";
            onError(offset + indent.length, "MISSING_CHAR", message);
          }
          if (header.indent === 0)
            trimIndent = indent.length;
          contentStart = i;
          if (trimIndent === 0 && !ctx.atRoot) {
            const message = "Block scalar values in collections must be indented";
            onError(offset, "BAD_INDENT", message);
          }
          break;
        }
        offset += indent.length + content.length + 1;
      }
      for (let i = lines.length - 1; i >= chompStart; --i) {
        if (lines[i][0].length > trimIndent)
          chompStart = i + 1;
      }
      let value = "";
      let sep = "";
      let prevMoreIndented = false;
      for (let i = 0; i < contentStart; ++i)
        value += lines[i][0].slice(trimIndent) + "\n";
      for (let i = contentStart; i < chompStart; ++i) {
        let [indent, content] = lines[i];
        offset += indent.length + content.length + 1;
        const crlf = content[content.length - 1] === "\r";
        if (crlf)
          content = content.slice(0, -1);
        if (content && indent.length < trimIndent) {
          const src = header.indent ? "explicit indentation indicator" : "first line";
          const message = `Block scalar lines must not be less indented than their ${src}`;
          onError(offset - content.length - (crlf ? 2 : 1), "BAD_INDENT", message);
          indent = "";
        }
        if (type === Scalar.Scalar.BLOCK_LITERAL) {
          value += sep + indent.slice(trimIndent) + content;
          sep = "\n";
        } else if (indent.length > trimIndent || content[0] === "	") {
          if (sep === " ")
            sep = "\n";
          else if (!prevMoreIndented && sep === "\n")
            sep = "\n\n";
          value += sep + indent.slice(trimIndent) + content;
          sep = "\n";
          prevMoreIndented = true;
        } else if (content === "") {
          if (sep === "\n")
            value += "\n";
          else
            sep = "\n";
        } else {
          value += sep + content;
          sep = " ";
          prevMoreIndented = false;
        }
      }
      switch (header.chomp) {
        case "-":
          break;
        case "+":
          for (let i = chompStart; i < lines.length; ++i)
            value += "\n" + lines[i][0].slice(trimIndent);
          if (value[value.length - 1] !== "\n")
            value += "\n";
          break;
        default:
          value += "\n";
      }
      const end = start + header.length + scalar.source.length;
      return { value, type, comment: header.comment, range: [start, end, end] };
    }
    function parseBlockScalarHeader({ offset, props }, strict, onError) {
      if (props[0].type !== "block-scalar-header") {
        onError(props[0], "IMPOSSIBLE", "Block scalar header not found");
        return null;
      }
      const { source } = props[0];
      const mode = source[0];
      let indent = 0;
      let chomp = "";
      let error = -1;
      for (let i = 1; i < source.length; ++i) {
        const ch = source[i];
        if (!chomp && (ch === "-" || ch === "+"))
          chomp = ch;
        else {
          const n = Number(ch);
          if (!indent && n)
            indent = n;
          else if (error === -1)
            error = offset + i;
        }
      }
      if (error !== -1)
        onError(error, "UNEXPECTED_TOKEN", `Block scalar header includes extra characters: ${source}`);
      let hasSpace = false;
      let comment = "";
      let length = source.length;
      for (let i = 1; i < props.length; ++i) {
        const token2 = props[i];
        switch (token2.type) {
          case "space":
            hasSpace = true;
          // fallthrough
          case "newline":
            length += token2.source.length;
            break;
          case "comment":
            if (strict && !hasSpace) {
              const message = "Comments must be separated from other tokens by white space characters";
              onError(token2, "MISSING_CHAR", message);
            }
            length += token2.source.length;
            comment = token2.source.substring(1);
            break;
          case "error":
            onError(token2, "UNEXPECTED_TOKEN", token2.message);
            length += token2.source.length;
            break;
          /* istanbul ignore next should not happen */
          default: {
            const message = `Unexpected token in block scalar header: ${token2.type}`;
            onError(token2, "UNEXPECTED_TOKEN", message);
            const ts = token2.source;
            if (ts && typeof ts === "string")
              length += ts.length;
          }
        }
      }
      return { mode, indent, chomp, comment, length };
    }
    function splitLines(source) {
      const split = source.split(/\n( *)/);
      const first = split[0];
      const m = first.match(/^( *)/);
      const line0 = m?.[1] ? [m[1], first.slice(m[1].length)] : ["", first];
      const lines = [line0];
      for (let i = 1; i < split.length; i += 2)
        lines.push([split[i], split[i + 1]]);
      return lines;
    }
    exports.resolveBlockScalar = resolveBlockScalar;
  }
});

// ../../packages/core/node_modules/yaml/dist/compose/resolve-flow-scalar.js
var require_resolve_flow_scalar = __commonJS({
  "../../packages/core/node_modules/yaml/dist/compose/resolve-flow-scalar.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var resolveEnd = require_resolve_end();
    function resolveFlowScalar(scalar, strict, onError) {
      const { offset, type, source, end } = scalar;
      let _type;
      let value;
      const _onError = (rel, code, msg) => onError(offset + rel, code, msg);
      switch (type) {
        case "scalar":
          _type = Scalar.Scalar.PLAIN;
          value = plainValue(source, _onError);
          break;
        case "single-quoted-scalar":
          _type = Scalar.Scalar.QUOTE_SINGLE;
          value = singleQuotedValue(source, _onError);
          break;
        case "double-quoted-scalar":
          _type = Scalar.Scalar.QUOTE_DOUBLE;
          value = doubleQuotedValue(source, _onError);
          break;
        /* istanbul ignore next should not happen */
        default:
          onError(scalar, "UNEXPECTED_TOKEN", `Expected a flow scalar value, but found: ${type}`);
          return {
            value: "",
            type: null,
            comment: "",
            range: [offset, offset + source.length, offset + source.length]
          };
      }
      const valueEnd = offset + source.length;
      const re = resolveEnd.resolveEnd(end, valueEnd, strict, onError);
      return {
        value,
        type: _type,
        comment: re.comment,
        range: [offset, valueEnd, re.offset]
      };
    }
    function plainValue(source, onError) {
      let badChar = "";
      switch (source[0]) {
        /* istanbul ignore next should not happen */
        case "	":
          badChar = "a tab character";
          break;
        case ",":
          badChar = "flow indicator character ,";
          break;
        case "%":
          badChar = "directive indicator character %";
          break;
        case "|":
        case ">": {
          badChar = `block scalar indicator ${source[0]}`;
          break;
        }
        case "@":
        case "`": {
          badChar = `reserved character ${source[0]}`;
          break;
        }
      }
      if (badChar)
        onError(0, "BAD_SCALAR_START", `Plain value cannot start with ${badChar}`);
      return unfoldLines(source);
    }
    function singleQuotedValue(source, onError) {
      if (source[source.length - 1] !== "'" || source.length === 1)
        onError(source.length, "MISSING_CHAR", "Missing closing 'quote");
      return unfoldLines(source.slice(1, -1)).replace(/''/g, "'");
    }
    function unfoldLines(source) {
      const line = /(.*?)\r?\n/sy;
      let match = line.exec(source);
      if (!match)
        return source;
      let trimEnd, trimBoth;
      try {
        trimEnd = new RegExp("(?<![ 	])[ 	]+$");
        trimBoth = new RegExp("^[ 	]+|(?<![ 	])[ 	]+$", "g");
      } catch {
        trimEnd = /[ \t]+$/;
        trimBoth = /^[ \t]+|[ \t]+$/g;
      }
      let res = match[1].replace(trimEnd, "");
      let sep = " ";
      let pos = line.lastIndex;
      while (match = line.exec(source)) {
        const lm = match[1].replace(trimBoth, "");
        if (lm === "") {
          if (sep === "\n")
            res += sep;
          else
            sep = "\n";
        } else {
          res += sep + lm;
          sep = " ";
        }
        pos = line.lastIndex;
      }
      const last = /[ \t]*(.*)/sy;
      last.lastIndex = pos;
      match = last.exec(source);
      return res + sep + (match?.[1] ?? "");
    }
    function doubleQuotedValue(source, onError) {
      let res = "";
      for (let i = 1; i < source.length - 1; ++i) {
        const ch = source[i];
        if (ch === "\r" && source[i + 1] === "\n")
          continue;
        if (ch === "\n") {
          const { fold, offset } = foldNewline(source, i);
          res += fold;
          i = offset;
        } else if (ch === "\\") {
          let next = source[++i];
          const cc = escapeCodes[next];
          if (cc)
            res += cc;
          else if (next === "\n") {
            next = source[i + 1];
            while (next === " " || next === "	")
              next = source[++i + 1];
          } else if (next === "\r" && source[i + 1] === "\n") {
            next = source[++i + 1];
            while (next === " " || next === "	")
              next = source[++i + 1];
          } else if (next === "x" || next === "u" || next === "U") {
            const length = next === "x" ? 2 : next === "u" ? 4 : 8;
            res += parseCharCode(source, i + 1, length, onError);
            i += length;
          } else {
            const raw = source.substr(i - 1, 2);
            onError(i - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
            res += raw;
          }
        } else if (ch === " " || ch === "	") {
          const wsStart = i;
          let next = source[i + 1];
          while (next === " " || next === "	")
            next = source[++i + 1];
          if (next !== "\n" && !(next === "\r" && source[i + 2] === "\n"))
            res += i > wsStart ? source.slice(wsStart, i + 1) : ch;
        } else {
          res += ch;
        }
      }
      if (source[source.length - 1] !== '"' || source.length === 1)
        onError(source.length, "MISSING_CHAR", 'Missing closing "quote');
      return res;
    }
    function foldNewline(source, offset) {
      let fold = "";
      let ch = source[offset + 1];
      while (ch === " " || ch === "	" || ch === "\n" || ch === "\r") {
        if (ch === "\r" && source[offset + 2] !== "\n")
          break;
        if (ch === "\n")
          fold += "\n";
        offset += 1;
        ch = source[offset + 1];
      }
      if (!fold)
        fold = " ";
      return { fold, offset };
    }
    var escapeCodes = {
      "0": "\0",
      // null character
      a: "\x07",
      // bell character
      b: "\b",
      // backspace
      e: "\x1B",
      // escape character
      f: "\f",
      // form feed
      n: "\n",
      // line feed
      r: "\r",
      // carriage return
      t: "	",
      // horizontal tab
      v: "\v",
      // vertical tab
      N: "\x85",
      // Unicode next line
      _: "\xA0",
      // Unicode non-breaking space
      L: "\u2028",
      // Unicode line separator
      P: "\u2029",
      // Unicode paragraph separator
      " ": " ",
      '"': '"',
      "/": "/",
      "\\": "\\",
      "	": "	"
    };
    function parseCharCode(source, offset, length, onError) {
      const cc = source.substr(offset, length);
      const ok = cc.length === length && /^[0-9a-fA-F]+$/.test(cc);
      const code = ok ? parseInt(cc, 16) : NaN;
      try {
        return String.fromCodePoint(code);
      } catch {
        const raw = source.substr(offset - 2, length + 2);
        onError(offset - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
        return raw;
      }
    }
    exports.resolveFlowScalar = resolveFlowScalar;
  }
});

// ../../packages/core/node_modules/yaml/dist/compose/compose-scalar.js
var require_compose_scalar = __commonJS({
  "../../packages/core/node_modules/yaml/dist/compose/compose-scalar.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var resolveBlockScalar = require_resolve_block_scalar();
    var resolveFlowScalar = require_resolve_flow_scalar();
    function composeScalar(ctx, token2, tagToken, onError) {
      const { value, type, comment, range } = token2.type === "block-scalar" ? resolveBlockScalar.resolveBlockScalar(ctx, token2, onError) : resolveFlowScalar.resolveFlowScalar(token2, ctx.options.strict, onError);
      const tagName = tagToken ? ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg)) : null;
      let tag;
      if (ctx.options.stringKeys && ctx.atKey) {
        tag = ctx.schema[identity.SCALAR];
      } else if (tagName)
        tag = findScalarTagByName(ctx.schema, value, tagName, tagToken, onError);
      else if (token2.type === "scalar")
        tag = findScalarTagByTest(ctx, value, token2, onError);
      else
        tag = ctx.schema[identity.SCALAR];
      let scalar;
      try {
        const res = tag.resolve(value, (msg) => onError(tagToken ?? token2, "TAG_RESOLVE_FAILED", msg), ctx.options);
        scalar = identity.isScalar(res) ? res : new Scalar.Scalar(res);
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        onError(tagToken ?? token2, "TAG_RESOLVE_FAILED", msg);
        scalar = new Scalar.Scalar(value);
      }
      scalar.range = range;
      scalar.source = value;
      if (type)
        scalar.type = type;
      if (tagName)
        scalar.tag = tagName;
      if (tag.format)
        scalar.format = tag.format;
      if (comment)
        scalar.comment = comment;
      return scalar;
    }
    function findScalarTagByName(schema, value, tagName, tagToken, onError) {
      if (tagName === "!")
        return schema[identity.SCALAR];
      const matchWithTest = [];
      for (const tag of schema.tags) {
        if (!tag.collection && tag.tag === tagName) {
          if (tag.default && tag.test)
            matchWithTest.push(tag);
          else
            return tag;
        }
      }
      for (const tag of matchWithTest)
        if (tag.test?.test(value))
          return tag;
      const kt = schema.knownTags[tagName];
      if (kt && !kt.collection) {
        schema.tags.push(Object.assign({}, kt, { default: false, test: void 0 }));
        return kt;
      }
      onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, tagName !== "tag:yaml.org,2002:str");
      return schema[identity.SCALAR];
    }
    function findScalarTagByTest({ atKey, directives, schema }, value, token2, onError) {
      const tag = schema.tags.find((tag2) => (tag2.default === true || atKey && tag2.default === "key") && tag2.test?.test(value)) || schema[identity.SCALAR];
      if (schema.compat) {
        const compat = schema.compat.find((tag2) => tag2.default && tag2.test?.test(value)) ?? schema[identity.SCALAR];
        if (tag.tag !== compat.tag) {
          const ts = directives.tagString(tag.tag);
          const cs = directives.tagString(compat.tag);
          const msg = `Value may be parsed as either ${ts} or ${cs}`;
          onError(token2, "TAG_RESOLVE_FAILED", msg, true);
        }
      }
      return tag;
    }
    exports.composeScalar = composeScalar;
  }
});

// ../../packages/core/node_modules/yaml/dist/compose/util-empty-scalar-position.js
var require_util_empty_scalar_position = __commonJS({
  "../../packages/core/node_modules/yaml/dist/compose/util-empty-scalar-position.js"(exports) {
    "use strict";
    function emptyScalarPosition(offset, before, pos) {
      if (before) {
        pos ?? (pos = before.length);
        for (let i = pos - 1; i >= 0; --i) {
          let st = before[i];
          switch (st.type) {
            case "space":
            case "comment":
            case "newline":
              offset -= st.source.length;
              continue;
          }
          st = before[++i];
          while (st?.type === "space") {
            offset += st.source.length;
            st = before[++i];
          }
          break;
        }
      }
      return offset;
    }
    exports.emptyScalarPosition = emptyScalarPosition;
  }
});

// ../../packages/core/node_modules/yaml/dist/compose/compose-node.js
var require_compose_node = __commonJS({
  "../../packages/core/node_modules/yaml/dist/compose/compose-node.js"(exports) {
    "use strict";
    var Alias = require_Alias();
    var identity = require_identity();
    var composeCollection = require_compose_collection();
    var composeScalar = require_compose_scalar();
    var resolveEnd = require_resolve_end();
    var utilEmptyScalarPosition = require_util_empty_scalar_position();
    var CN = { composeNode, composeEmptyNode };
    function composeNode(ctx, token2, props, onError) {
      const atKey = ctx.atKey;
      const { spaceBefore, comment, anchor, tag } = props;
      let node;
      let isSrcToken = true;
      switch (token2.type) {
        case "alias":
          node = composeAlias(ctx, token2, onError);
          if (anchor || tag)
            onError(token2, "ALIAS_PROPS", "An alias node must not specify any properties");
          break;
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
        case "block-scalar":
          node = composeScalar.composeScalar(ctx, token2, tag, onError);
          if (anchor)
            node.anchor = anchor.source.substring(1);
          break;
        case "block-map":
        case "block-seq":
        case "flow-collection":
          try {
            node = composeCollection.composeCollection(CN, ctx, token2, props, onError);
            if (anchor)
              node.anchor = anchor.source.substring(1);
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            onError(token2, "RESOURCE_EXHAUSTION", message);
          }
          break;
        default: {
          const message = token2.type === "error" ? token2.message : `Unsupported token (type: ${token2.type})`;
          onError(token2, "UNEXPECTED_TOKEN", message);
          isSrcToken = false;
        }
      }
      node ?? (node = composeEmptyNode(ctx, token2.offset, void 0, null, props, onError));
      if (anchor && node.anchor === "")
        onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
      if (atKey && ctx.options.stringKeys && (!identity.isScalar(node) || typeof node.value !== "string" || node.tag && node.tag !== "tag:yaml.org,2002:str")) {
        const msg = "With stringKeys, all keys must be strings";
        onError(tag ?? token2, "NON_STRING_KEY", msg);
      }
      if (spaceBefore)
        node.spaceBefore = true;
      if (comment) {
        if (token2.type === "scalar" && token2.source === "")
          node.comment = comment;
        else
          node.commentBefore = comment;
      }
      if (ctx.options.keepSourceTokens && isSrcToken)
        node.srcToken = token2;
      return node;
    }
    function composeEmptyNode(ctx, offset, before, pos, { spaceBefore, comment, anchor, tag, end }, onError) {
      const token2 = {
        type: "scalar",
        offset: utilEmptyScalarPosition.emptyScalarPosition(offset, before, pos),
        indent: -1,
        source: ""
      };
      const node = composeScalar.composeScalar(ctx, token2, tag, onError);
      if (anchor) {
        node.anchor = anchor.source.substring(1);
        if (node.anchor === "")
          onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
      }
      if (spaceBefore)
        node.spaceBefore = true;
      if (comment) {
        node.comment = comment;
        node.range[2] = end;
      }
      return node;
    }
    function composeAlias({ options }, { offset, source, end }, onError) {
      const alias = new Alias.Alias(source.substring(1));
      if (alias.source === "")
        onError(offset, "BAD_ALIAS", "Alias cannot be an empty string");
      if (alias.source.endsWith(":"))
        onError(offset + source.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", true);
      const valueEnd = offset + source.length;
      const re = resolveEnd.resolveEnd(end, valueEnd, options.strict, onError);
      alias.range = [offset, valueEnd, re.offset];
      if (re.comment)
        alias.comment = re.comment;
      return alias;
    }
    exports.composeEmptyNode = composeEmptyNode;
    exports.composeNode = composeNode;
  }
});

// ../../packages/core/node_modules/yaml/dist/compose/compose-doc.js
var require_compose_doc = __commonJS({
  "../../packages/core/node_modules/yaml/dist/compose/compose-doc.js"(exports) {
    "use strict";
    var Document = require_Document();
    var composeNode = require_compose_node();
    var resolveEnd = require_resolve_end();
    var resolveProps = require_resolve_props();
    function composeDoc(options, directives, { offset, start, value, end }, onError) {
      const opts = Object.assign({ _directives: directives }, options);
      const doc = new Document.Document(void 0, opts);
      const ctx = {
        atKey: false,
        atRoot: true,
        directives: doc.directives,
        options: doc.options,
        schema: doc.schema
      };
      const props = resolveProps.resolveProps(start, {
        indicator: "doc-start",
        next: value ?? end?.[0],
        offset,
        onError,
        parentIndent: 0,
        startOnNewline: true
      });
      if (props.found) {
        doc.directives.docStart = true;
        if (value && (value.type === "block-map" || value.type === "block-seq") && !props.hasNewline)
          onError(props.end, "MISSING_CHAR", "Block collection cannot start on same line with directives-end marker");
      }
      doc.contents = value ? composeNode.composeNode(ctx, value, props, onError) : composeNode.composeEmptyNode(ctx, props.end, start, null, props, onError);
      const contentEnd = doc.contents.range[2];
      const re = resolveEnd.resolveEnd(end, contentEnd, false, onError);
      if (re.comment)
        doc.comment = re.comment;
      doc.range = [offset, contentEnd, re.offset];
      return doc;
    }
    exports.composeDoc = composeDoc;
  }
});

// ../../packages/core/node_modules/yaml/dist/compose/composer.js
var require_composer = __commonJS({
  "../../packages/core/node_modules/yaml/dist/compose/composer.js"(exports) {
    "use strict";
    var node_process = __require("process");
    var directives = require_directives();
    var Document = require_Document();
    var errors = require_errors();
    var identity = require_identity();
    var composeDoc = require_compose_doc();
    var resolveEnd = require_resolve_end();
    function getErrorPos(src) {
      if (typeof src === "number")
        return [src, src + 1];
      if (Array.isArray(src))
        return src.length === 2 ? src : [src[0], src[1]];
      const { offset, source } = src;
      return [offset, offset + (typeof source === "string" ? source.length : 1)];
    }
    function parsePrelude(prelude) {
      let comment = "";
      let atComment = false;
      let afterEmptyLine = false;
      for (let i = 0; i < prelude.length; ++i) {
        const source = prelude[i];
        switch (source[0]) {
          case "#":
            comment += (comment === "" ? "" : afterEmptyLine ? "\n\n" : "\n") + (source.substring(1) || " ");
            atComment = true;
            afterEmptyLine = false;
            break;
          case "%":
            if (prelude[i + 1]?.[0] !== "#")
              i += 1;
            atComment = false;
            break;
          default:
            if (!atComment)
              afterEmptyLine = true;
            atComment = false;
        }
      }
      return { comment, afterEmptyLine };
    }
    var Composer = class {
      constructor(options = {}) {
        this.doc = null;
        this.atDirectives = false;
        this.prelude = [];
        this.errors = [];
        this.warnings = [];
        this.onError = (source, code, message, warning) => {
          const pos = getErrorPos(source);
          if (warning)
            this.warnings.push(new errors.YAMLWarning(pos, code, message));
          else
            this.errors.push(new errors.YAMLParseError(pos, code, message));
        };
        this.directives = new directives.Directives({ version: options.version || "1.2" });
        this.options = options;
      }
      decorate(doc, afterDoc) {
        const { comment, afterEmptyLine } = parsePrelude(this.prelude);
        if (comment) {
          const dc = doc.contents;
          if (afterDoc) {
            doc.comment = doc.comment ? `${doc.comment}
${comment}` : comment;
          } else if (afterEmptyLine || doc.directives.docStart || !dc) {
            doc.commentBefore = comment;
          } else if (identity.isCollection(dc) && !dc.flow && dc.items.length > 0) {
            let it = dc.items[0];
            if (identity.isPair(it))
              it = it.key;
            const cb = it.commentBefore;
            it.commentBefore = cb ? `${comment}
${cb}` : comment;
          } else {
            const cb = dc.commentBefore;
            dc.commentBefore = cb ? `${comment}
${cb}` : comment;
          }
        }
        if (afterDoc) {
          for (let i = 0; i < this.errors.length; ++i)
            doc.errors.push(this.errors[i]);
          for (let i = 0; i < this.warnings.length; ++i)
            doc.warnings.push(this.warnings[i]);
        } else {
          doc.errors = this.errors;
          doc.warnings = this.warnings;
        }
        this.prelude = [];
        this.errors = [];
        this.warnings = [];
      }
      /**
       * Current stream status information.
       *
       * Mostly useful at the end of input for an empty stream.
       */
      streamInfo() {
        return {
          comment: parsePrelude(this.prelude).comment,
          directives: this.directives,
          errors: this.errors,
          warnings: this.warnings
        };
      }
      /**
       * Compose tokens into documents.
       *
       * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
       * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
       */
      *compose(tokens, forceDoc = false, endOffset = -1) {
        for (const token2 of tokens)
          yield* this.next(token2);
        yield* this.end(forceDoc, endOffset);
      }
      /** Advance the composer by one CST token. */
      *next(token2) {
        if (node_process.env.LOG_STREAM)
          console.dir(token2, { depth: null });
        switch (token2.type) {
          case "directive":
            this.directives.add(token2.source, (offset, message, warning) => {
              const pos = getErrorPos(token2);
              pos[0] += offset;
              this.onError(pos, "BAD_DIRECTIVE", message, warning);
            });
            this.prelude.push(token2.source);
            this.atDirectives = true;
            break;
          case "document": {
            const doc = composeDoc.composeDoc(this.options, this.directives, token2, this.onError);
            if (this.atDirectives && !doc.directives.docStart)
              this.onError(token2, "MISSING_CHAR", "Missing directives-end/doc-start indicator line");
            this.decorate(doc, false);
            if (this.doc)
              yield this.doc;
            this.doc = doc;
            this.atDirectives = false;
            break;
          }
          case "byte-order-mark":
          case "space":
            break;
          case "comment":
          case "newline":
            this.prelude.push(token2.source);
            break;
          case "error": {
            const msg = token2.source ? `${token2.message}: ${JSON.stringify(token2.source)}` : token2.message;
            const error = new errors.YAMLParseError(getErrorPos(token2), "UNEXPECTED_TOKEN", msg);
            if (this.atDirectives || !this.doc)
              this.errors.push(error);
            else
              this.doc.errors.push(error);
            break;
          }
          case "doc-end": {
            if (!this.doc) {
              const msg = "Unexpected doc-end without preceding document";
              this.errors.push(new errors.YAMLParseError(getErrorPos(token2), "UNEXPECTED_TOKEN", msg));
              break;
            }
            this.doc.directives.docEnd = true;
            const end = resolveEnd.resolveEnd(token2.end, token2.offset + token2.source.length, this.doc.options.strict, this.onError);
            this.decorate(this.doc, true);
            if (end.comment) {
              const dc = this.doc.comment;
              this.doc.comment = dc ? `${dc}
${end.comment}` : end.comment;
            }
            this.doc.range[2] = end.offset;
            break;
          }
          default:
            this.errors.push(new errors.YAMLParseError(getErrorPos(token2), "UNEXPECTED_TOKEN", `Unsupported token ${token2.type}`));
        }
      }
      /**
       * Call at end of input to yield any remaining document.
       *
       * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
       * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
       */
      *end(forceDoc = false, endOffset = -1) {
        if (this.doc) {
          this.decorate(this.doc, true);
          yield this.doc;
          this.doc = null;
        } else if (forceDoc) {
          const opts = Object.assign({ _directives: this.directives }, this.options);
          const doc = new Document.Document(void 0, opts);
          if (this.atDirectives)
            this.onError(endOffset, "MISSING_CHAR", "Missing directives-end indicator line");
          doc.range = [0, endOffset, endOffset];
          this.decorate(doc, false);
          yield doc;
        }
      }
    };
    exports.Composer = Composer;
  }
});

// ../../packages/core/node_modules/yaml/dist/parse/cst-scalar.js
var require_cst_scalar = __commonJS({
  "../../packages/core/node_modules/yaml/dist/parse/cst-scalar.js"(exports) {
    "use strict";
    var resolveBlockScalar = require_resolve_block_scalar();
    var resolveFlowScalar = require_resolve_flow_scalar();
    var errors = require_errors();
    var stringifyString = require_stringifyString();
    function resolveAsScalar(token2, strict = true, onError) {
      if (token2) {
        const _onError = (pos, code, message) => {
          const offset = typeof pos === "number" ? pos : Array.isArray(pos) ? pos[0] : pos.offset;
          if (onError)
            onError(offset, code, message);
          else
            throw new errors.YAMLParseError([offset, offset + 1], code, message);
        };
        switch (token2.type) {
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return resolveFlowScalar.resolveFlowScalar(token2, strict, _onError);
          case "block-scalar":
            return resolveBlockScalar.resolveBlockScalar({ options: { strict } }, token2, _onError);
        }
      }
      return null;
    }
    function createScalarToken(value, context) {
      const { implicitKey = false, indent, inFlow = false, offset = -1, type = "PLAIN" } = context;
      const source = stringifyString.stringifyString({ type, value }, {
        implicitKey,
        indent: indent > 0 ? " ".repeat(indent) : "",
        inFlow,
        options: { blockQuote: true, lineWidth: -1 }
      });
      const end = context.end ?? [
        { type: "newline", offset: -1, indent, source: "\n" }
      ];
      switch (source[0]) {
        case "|":
        case ">": {
          const he = source.indexOf("\n");
          const head = source.substring(0, he);
          const body = source.substring(he + 1) + "\n";
          const props = [
            { type: "block-scalar-header", offset, indent, source: head }
          ];
          if (!addEndtoBlockProps(props, end))
            props.push({ type: "newline", offset: -1, indent, source: "\n" });
          return { type: "block-scalar", offset, indent, props, source: body };
        }
        case '"':
          return { type: "double-quoted-scalar", offset, indent, source, end };
        case "'":
          return { type: "single-quoted-scalar", offset, indent, source, end };
        default:
          return { type: "scalar", offset, indent, source, end };
      }
    }
    function setScalarValue(token2, value, context = {}) {
      let { afterKey = false, implicitKey = false, inFlow = false, type } = context;
      let indent = "indent" in token2 ? token2.indent : null;
      if (afterKey && typeof indent === "number")
        indent += 2;
      if (!type)
        switch (token2.type) {
          case "single-quoted-scalar":
            type = "QUOTE_SINGLE";
            break;
          case "double-quoted-scalar":
            type = "QUOTE_DOUBLE";
            break;
          case "block-scalar": {
            const header = token2.props[0];
            if (header.type !== "block-scalar-header")
              throw new Error("Invalid block scalar header");
            type = header.source[0] === ">" ? "BLOCK_FOLDED" : "BLOCK_LITERAL";
            break;
          }
          default:
            type = "PLAIN";
        }
      const source = stringifyString.stringifyString({ type, value }, {
        implicitKey: implicitKey || indent === null,
        indent: indent !== null && indent > 0 ? " ".repeat(indent) : "",
        inFlow,
        options: { blockQuote: true, lineWidth: -1 }
      });
      switch (source[0]) {
        case "|":
        case ">":
          setBlockScalarValue(token2, source);
          break;
        case '"':
          setFlowScalarValue(token2, source, "double-quoted-scalar");
          break;
        case "'":
          setFlowScalarValue(token2, source, "single-quoted-scalar");
          break;
        default:
          setFlowScalarValue(token2, source, "scalar");
      }
    }
    function setBlockScalarValue(token2, source) {
      const he = source.indexOf("\n");
      const head = source.substring(0, he);
      const body = source.substring(he + 1) + "\n";
      if (token2.type === "block-scalar") {
        const header = token2.props[0];
        if (header.type !== "block-scalar-header")
          throw new Error("Invalid block scalar header");
        header.source = head;
        token2.source = body;
      } else {
        const { offset } = token2;
        const indent = "indent" in token2 ? token2.indent : -1;
        const props = [
          { type: "block-scalar-header", offset, indent, source: head }
        ];
        if (!addEndtoBlockProps(props, "end" in token2 ? token2.end : void 0))
          props.push({ type: "newline", offset: -1, indent, source: "\n" });
        for (const key of Object.keys(token2))
          if (key !== "type" && key !== "offset")
            delete token2[key];
        Object.assign(token2, { type: "block-scalar", indent, props, source: body });
      }
    }
    function addEndtoBlockProps(props, end) {
      if (end)
        for (const st of end)
          switch (st.type) {
            case "space":
            case "comment":
              props.push(st);
              break;
            case "newline":
              props.push(st);
              return true;
          }
      return false;
    }
    function setFlowScalarValue(token2, source, type) {
      switch (token2.type) {
        case "scalar":
        case "double-quoted-scalar":
        case "single-quoted-scalar":
          token2.type = type;
          token2.source = source;
          break;
        case "block-scalar": {
          const end = token2.props.slice(1);
          let oa = source.length;
          if (token2.props[0].type === "block-scalar-header")
            oa -= token2.props[0].source.length;
          for (const tok of end)
            tok.offset += oa;
          delete token2.props;
          Object.assign(token2, { type, source, end });
          break;
        }
        case "block-map":
        case "block-seq": {
          const offset = token2.offset + source.length;
          const nl = { type: "newline", offset, indent: token2.indent, source: "\n" };
          delete token2.items;
          Object.assign(token2, { type, source, end: [nl] });
          break;
        }
        default: {
          const indent = "indent" in token2 ? token2.indent : -1;
          const end = "end" in token2 && Array.isArray(token2.end) ? token2.end.filter((st) => st.type === "space" || st.type === "comment" || st.type === "newline") : [];
          for (const key of Object.keys(token2))
            if (key !== "type" && key !== "offset")
              delete token2[key];
          Object.assign(token2, { type, indent, source, end });
        }
      }
    }
    exports.createScalarToken = createScalarToken;
    exports.resolveAsScalar = resolveAsScalar;
    exports.setScalarValue = setScalarValue;
  }
});

// ../../packages/core/node_modules/yaml/dist/parse/cst-stringify.js
var require_cst_stringify = __commonJS({
  "../../packages/core/node_modules/yaml/dist/parse/cst-stringify.js"(exports) {
    "use strict";
    var stringify = (cst) => "type" in cst ? stringifyToken(cst) : stringifyItem(cst);
    function stringifyToken(token2) {
      switch (token2.type) {
        case "block-scalar": {
          let res = "";
          for (const tok of token2.props)
            res += stringifyToken(tok);
          return res + token2.source;
        }
        case "block-map":
        case "block-seq": {
          let res = "";
          for (const item of token2.items)
            res += stringifyItem(item);
          return res;
        }
        case "flow-collection": {
          let res = token2.start.source;
          for (const item of token2.items)
            res += stringifyItem(item);
          for (const st of token2.end)
            res += st.source;
          return res;
        }
        case "document": {
          let res = stringifyItem(token2);
          if (token2.end)
            for (const st of token2.end)
              res += st.source;
          return res;
        }
        default: {
          let res = token2.source;
          if ("end" in token2 && token2.end)
            for (const st of token2.end)
              res += st.source;
          return res;
        }
      }
    }
    function stringifyItem({ start, key, sep, value }) {
      let res = "";
      for (const st of start)
        res += st.source;
      if (key)
        res += stringifyToken(key);
      if (sep)
        for (const st of sep)
          res += st.source;
      if (value)
        res += stringifyToken(value);
      return res;
    }
    exports.stringify = stringify;
  }
});

// ../../packages/core/node_modules/yaml/dist/parse/cst-visit.js
var require_cst_visit = __commonJS({
  "../../packages/core/node_modules/yaml/dist/parse/cst-visit.js"(exports) {
    "use strict";
    var BREAK = /* @__PURE__ */ Symbol("break visit");
    var SKIP = /* @__PURE__ */ Symbol("skip children");
    var REMOVE = /* @__PURE__ */ Symbol("remove item");
    function visit(cst, visitor) {
      if ("type" in cst && cst.type === "document")
        cst = { start: cst.start, value: cst.value };
      _visit(Object.freeze([]), cst, visitor);
    }
    visit.BREAK = BREAK;
    visit.SKIP = SKIP;
    visit.REMOVE = REMOVE;
    visit.itemAtPath = (cst, path3) => {
      let item = cst;
      for (const [field, index] of path3) {
        const tok = item?.[field];
        if (tok && "items" in tok) {
          item = tok.items[index];
        } else
          return void 0;
      }
      return item;
    };
    visit.parentCollection = (cst, path3) => {
      const parent = visit.itemAtPath(cst, path3.slice(0, -1));
      const field = path3[path3.length - 1][0];
      const coll = parent?.[field];
      if (coll && "items" in coll)
        return coll;
      throw new Error("Parent collection not found");
    };
    function _visit(path3, item, visitor) {
      let ctrl = visitor(item, path3);
      if (typeof ctrl === "symbol")
        return ctrl;
      for (const field of ["key", "value"]) {
        const token2 = item[field];
        if (token2 && "items" in token2) {
          for (let i = 0; i < token2.items.length; ++i) {
            const ci = _visit(Object.freeze(path3.concat([[field, i]])), token2.items[i], visitor);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              token2.items.splice(i, 1);
              i -= 1;
            }
          }
          if (typeof ctrl === "function" && field === "key")
            ctrl = ctrl(item, path3);
        }
      }
      return typeof ctrl === "function" ? ctrl(item, path3) : ctrl;
    }
    exports.visit = visit;
  }
});

// ../../packages/core/node_modules/yaml/dist/parse/cst.js
var require_cst = __commonJS({
  "../../packages/core/node_modules/yaml/dist/parse/cst.js"(exports) {
    "use strict";
    var cstScalar = require_cst_scalar();
    var cstStringify = require_cst_stringify();
    var cstVisit = require_cst_visit();
    var BOM = "\uFEFF";
    var DOCUMENT = "";
    var FLOW_END = "";
    var SCALAR = "";
    var isCollection = (token2) => !!token2 && "items" in token2;
    var isScalar = (token2) => !!token2 && (token2.type === "scalar" || token2.type === "single-quoted-scalar" || token2.type === "double-quoted-scalar" || token2.type === "block-scalar");
    function prettyToken(token2) {
      switch (token2) {
        case BOM:
          return "<BOM>";
        case DOCUMENT:
          return "<DOC>";
        case FLOW_END:
          return "<FLOW_END>";
        case SCALAR:
          return "<SCALAR>";
        default:
          return JSON.stringify(token2);
      }
    }
    function tokenType(source) {
      switch (source) {
        case BOM:
          return "byte-order-mark";
        case DOCUMENT:
          return "doc-mode";
        case FLOW_END:
          return "flow-error-end";
        case SCALAR:
          return "scalar";
        case "---":
          return "doc-start";
        case "...":
          return "doc-end";
        case "":
        case "\n":
        case "\r\n":
          return "newline";
        case "-":
          return "seq-item-ind";
        case "?":
          return "explicit-key-ind";
        case ":":
          return "map-value-ind";
        case "{":
          return "flow-map-start";
        case "}":
          return "flow-map-end";
        case "[":
          return "flow-seq-start";
        case "]":
          return "flow-seq-end";
        case ",":
          return "comma";
      }
      switch (source[0]) {
        case " ":
        case "	":
          return "space";
        case "#":
          return "comment";
        case "%":
          return "directive-line";
        case "*":
          return "alias";
        case "&":
          return "anchor";
        case "!":
          return "tag";
        case "'":
          return "single-quoted-scalar";
        case '"':
          return "double-quoted-scalar";
        case "|":
        case ">":
          return "block-scalar-header";
      }
      return null;
    }
    exports.createScalarToken = cstScalar.createScalarToken;
    exports.resolveAsScalar = cstScalar.resolveAsScalar;
    exports.setScalarValue = cstScalar.setScalarValue;
    exports.stringify = cstStringify.stringify;
    exports.visit = cstVisit.visit;
    exports.BOM = BOM;
    exports.DOCUMENT = DOCUMENT;
    exports.FLOW_END = FLOW_END;
    exports.SCALAR = SCALAR;
    exports.isCollection = isCollection;
    exports.isScalar = isScalar;
    exports.prettyToken = prettyToken;
    exports.tokenType = tokenType;
  }
});

// ../../packages/core/node_modules/yaml/dist/parse/lexer.js
var require_lexer = __commonJS({
  "../../packages/core/node_modules/yaml/dist/parse/lexer.js"(exports) {
    "use strict";
    var cst = require_cst();
    function isEmpty(ch) {
      switch (ch) {
        case void 0:
        case " ":
        case "\n":
        case "\r":
        case "	":
          return true;
        default:
          return false;
      }
    }
    var hexDigits = new Set("0123456789ABCDEFabcdef");
    var tagChars = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()");
    var flowIndicatorChars = new Set(",[]{}");
    var invalidAnchorChars = new Set(" ,[]{}\n\r	");
    var isNotAnchorChar = (ch) => !ch || invalidAnchorChars.has(ch);
    var Lexer = class {
      constructor() {
        this.atEnd = false;
        this.blockScalarIndent = -1;
        this.blockScalarKeep = false;
        this.buffer = "";
        this.flowKey = false;
        this.flowLevel = 0;
        this.indentNext = 0;
        this.indentValue = 0;
        this.lineEndPos = null;
        this.next = null;
        this.pos = 0;
      }
      /**
       * Generate YAML tokens from the `source` string. If `incomplete`,
       * a part of the last line may be left as a buffer for the next call.
       *
       * @returns A generator of lexical tokens
       */
      *lex(source, incomplete = false) {
        if (source) {
          if (typeof source !== "string")
            throw TypeError("source is not a string");
          this.buffer = this.buffer ? this.buffer + source : source;
          this.lineEndPos = null;
        }
        this.atEnd = !incomplete;
        let next = this.next ?? "stream";
        while (next && (incomplete || this.hasChars(1)))
          next = yield* this.parseNext(next);
      }
      atLineEnd() {
        let i = this.pos;
        let ch = this.buffer[i];
        while (ch === " " || ch === "	")
          ch = this.buffer[++i];
        if (!ch || ch === "#" || ch === "\n")
          return true;
        if (ch === "\r")
          return this.buffer[i + 1] === "\n";
        return false;
      }
      charAt(n) {
        return this.buffer[this.pos + n];
      }
      continueScalar(offset) {
        let ch = this.buffer[offset];
        if (this.indentNext > 0) {
          let indent = 0;
          while (ch === " ")
            ch = this.buffer[++indent + offset];
          if (ch === "\r") {
            const next = this.buffer[indent + offset + 1];
            if (next === "\n" || !next && !this.atEnd)
              return offset + indent + 1;
          }
          return ch === "\n" || indent >= this.indentNext || !ch && !this.atEnd ? offset + indent : -1;
        }
        if (ch === "-" || ch === ".") {
          const dt = this.buffer.substr(offset, 3);
          if ((dt === "---" || dt === "...") && isEmpty(this.buffer[offset + 3]))
            return -1;
        }
        return offset;
      }
      getLine() {
        let end = this.lineEndPos;
        if (typeof end !== "number" || end !== -1 && end < this.pos) {
          end = this.buffer.indexOf("\n", this.pos);
          this.lineEndPos = end;
        }
        if (end === -1)
          return this.atEnd ? this.buffer.substring(this.pos) : null;
        if (this.buffer[end - 1] === "\r")
          end -= 1;
        return this.buffer.substring(this.pos, end);
      }
      hasChars(n) {
        return this.pos + n <= this.buffer.length;
      }
      setNext(state) {
        this.buffer = this.buffer.substring(this.pos);
        this.pos = 0;
        this.lineEndPos = null;
        this.next = state;
        return null;
      }
      peek(n) {
        return this.buffer.substr(this.pos, n);
      }
      *parseNext(next) {
        switch (next) {
          case "stream":
            return yield* this.parseStream();
          case "line-start":
            return yield* this.parseLineStart();
          case "block-start":
            return yield* this.parseBlockStart();
          case "doc":
            return yield* this.parseDocument();
          case "flow":
            return yield* this.parseFlowCollection();
          case "quoted-scalar":
            return yield* this.parseQuotedScalar();
          case "block-scalar":
            return yield* this.parseBlockScalar();
          case "plain-scalar":
            return yield* this.parsePlainScalar();
        }
      }
      *parseStream() {
        let line = this.getLine();
        if (line === null)
          return this.setNext("stream");
        if (line[0] === cst.BOM) {
          yield* this.pushCount(1);
          line = line.substring(1);
        }
        if (line[0] === "%") {
          let dirEnd = line.length;
          let cs = line.indexOf("#");
          while (cs !== -1) {
            const ch = line[cs - 1];
            if (ch === " " || ch === "	") {
              dirEnd = cs - 1;
              break;
            } else {
              cs = line.indexOf("#", cs + 1);
            }
          }
          while (true) {
            const ch = line[dirEnd - 1];
            if (ch === " " || ch === "	")
              dirEnd -= 1;
            else
              break;
          }
          const n = (yield* this.pushCount(dirEnd)) + (yield* this.pushSpaces(true));
          yield* this.pushCount(line.length - n);
          this.pushNewline();
          return "stream";
        }
        if (this.atLineEnd()) {
          const sp = yield* this.pushSpaces(true);
          yield* this.pushCount(line.length - sp);
          yield* this.pushNewline();
          return "stream";
        }
        yield cst.DOCUMENT;
        return yield* this.parseLineStart();
      }
      *parseLineStart() {
        const ch = this.charAt(0);
        if (!ch && !this.atEnd)
          return this.setNext("line-start");
        if (ch === "-" || ch === ".") {
          if (!this.atEnd && !this.hasChars(4))
            return this.setNext("line-start");
          const s = this.peek(3);
          if ((s === "---" || s === "...") && isEmpty(this.charAt(3))) {
            yield* this.pushCount(3);
            this.indentValue = 0;
            this.indentNext = 0;
            return s === "---" ? "doc" : "stream";
          }
        }
        this.indentValue = yield* this.pushSpaces(false);
        if (this.indentNext > this.indentValue && !isEmpty(this.charAt(1)))
          this.indentNext = this.indentValue;
        return yield* this.parseBlockStart();
      }
      *parseBlockStart() {
        const [ch0, ch1] = this.peek(2);
        if (!ch1 && !this.atEnd)
          return this.setNext("block-start");
        if ((ch0 === "-" || ch0 === "?" || ch0 === ":") && isEmpty(ch1)) {
          const n = (yield* this.pushCount(1)) + (yield* this.pushSpaces(true));
          this.indentNext = this.indentValue + 1;
          this.indentValue += n;
          return "block-start";
        }
        return "doc";
      }
      *parseDocument() {
        yield* this.pushSpaces(true);
        const line = this.getLine();
        if (line === null)
          return this.setNext("doc");
        let n = yield* this.pushIndicators();
        switch (line[n]) {
          case "#":
            yield* this.pushCount(line.length - n);
          // fallthrough
          case void 0:
            yield* this.pushNewline();
            return yield* this.parseLineStart();
          case "{":
          case "[":
            yield* this.pushCount(1);
            this.flowKey = false;
            this.flowLevel = 1;
            return "flow";
          case "}":
          case "]":
            yield* this.pushCount(1);
            return "doc";
          case "*":
            yield* this.pushUntil(isNotAnchorChar);
            return "doc";
          case '"':
          case "'":
            return yield* this.parseQuotedScalar();
          case "|":
          case ">":
            n += yield* this.parseBlockScalarHeader();
            n += yield* this.pushSpaces(true);
            yield* this.pushCount(line.length - n);
            yield* this.pushNewline();
            return yield* this.parseBlockScalar();
          default:
            return yield* this.parsePlainScalar();
        }
      }
      *parseFlowCollection() {
        let nl, sp;
        let indent = -1;
        do {
          nl = yield* this.pushNewline();
          if (nl > 0) {
            sp = yield* this.pushSpaces(false);
            this.indentValue = indent = sp;
          } else {
            sp = 0;
          }
          sp += yield* this.pushSpaces(true);
        } while (nl + sp > 0);
        const line = this.getLine();
        if (line === null)
          return this.setNext("flow");
        if (indent !== -1 && indent < this.indentNext && line[0] !== "#" || indent === 0 && (line.startsWith("---") || line.startsWith("...")) && isEmpty(line[3])) {
          const atFlowEndMarker = indent === this.indentNext - 1 && this.flowLevel === 1 && (line[0] === "]" || line[0] === "}");
          if (!atFlowEndMarker) {
            this.flowLevel = 0;
            yield cst.FLOW_END;
            return yield* this.parseLineStart();
          }
        }
        let n = 0;
        while (line[n] === ",") {
          n += yield* this.pushCount(1);
          n += yield* this.pushSpaces(true);
          this.flowKey = false;
        }
        n += yield* this.pushIndicators();
        switch (line[n]) {
          case void 0:
            return "flow";
          case "#":
            yield* this.pushCount(line.length - n);
            return "flow";
          case "{":
          case "[":
            yield* this.pushCount(1);
            this.flowKey = false;
            this.flowLevel += 1;
            return "flow";
          case "}":
          case "]":
            yield* this.pushCount(1);
            this.flowKey = true;
            this.flowLevel -= 1;
            return this.flowLevel ? "flow" : "doc";
          case "*":
            yield* this.pushUntil(isNotAnchorChar);
            return "flow";
          case '"':
          case "'":
            this.flowKey = true;
            return yield* this.parseQuotedScalar();
          case ":": {
            const next = this.charAt(1);
            if (this.flowKey || isEmpty(next) || next === ",") {
              this.flowKey = false;
              yield* this.pushCount(1);
              yield* this.pushSpaces(true);
              return "flow";
            }
          }
          // fallthrough
          default:
            this.flowKey = false;
            return yield* this.parsePlainScalar();
        }
      }
      *parseQuotedScalar() {
        const quote = this.charAt(0);
        let end = this.buffer.indexOf(quote, this.pos + 1);
        if (quote === "'") {
          while (end !== -1 && this.buffer[end + 1] === "'")
            end = this.buffer.indexOf("'", end + 2);
        } else {
          while (end !== -1) {
            let n = 0;
            while (this.buffer[end - 1 - n] === "\\")
              n += 1;
            if (n % 2 === 0)
              break;
            end = this.buffer.indexOf('"', end + 1);
          }
        }
        const qb = this.buffer.substring(0, end);
        let nl = qb.indexOf("\n", this.pos);
        if (nl !== -1) {
          while (nl !== -1) {
            const cs = this.continueScalar(nl + 1);
            if (cs === -1)
              break;
            nl = qb.indexOf("\n", cs);
          }
          if (nl !== -1) {
            end = nl - (qb[nl - 1] === "\r" ? 2 : 1);
          }
        }
        if (end === -1) {
          if (!this.atEnd)
            return this.setNext("quoted-scalar");
          end = this.buffer.length;
        }
        yield* this.pushToIndex(end + 1, false);
        return this.flowLevel ? "flow" : "doc";
      }
      *parseBlockScalarHeader() {
        this.blockScalarIndent = -1;
        this.blockScalarKeep = false;
        let i = this.pos;
        while (true) {
          const ch = this.buffer[++i];
          if (ch === "+")
            this.blockScalarKeep = true;
          else if (ch > "0" && ch <= "9")
            this.blockScalarIndent = Number(ch) - 1;
          else if (ch !== "-")
            break;
        }
        return yield* this.pushUntil((ch) => isEmpty(ch) || ch === "#");
      }
      *parseBlockScalar() {
        let nl = this.pos - 1;
        let indent = 0;
        let ch;
        loop: for (let i2 = this.pos; ch = this.buffer[i2]; ++i2) {
          switch (ch) {
            case " ":
              indent += 1;
              break;
            case "\n":
              nl = i2;
              indent = 0;
              break;
            case "\r": {
              const next = this.buffer[i2 + 1];
              if (!next && !this.atEnd)
                return this.setNext("block-scalar");
              if (next === "\n")
                break;
            }
            // fallthrough
            default:
              break loop;
          }
        }
        if (!ch && !this.atEnd)
          return this.setNext("block-scalar");
        if (indent >= this.indentNext) {
          if (this.blockScalarIndent === -1)
            this.indentNext = indent;
          else {
            this.indentNext = this.blockScalarIndent + (this.indentNext === 0 ? 1 : this.indentNext);
          }
          do {
            const cs = this.continueScalar(nl + 1);
            if (cs === -1)
              break;
            nl = this.buffer.indexOf("\n", cs);
          } while (nl !== -1);
          if (nl === -1) {
            if (!this.atEnd)
              return this.setNext("block-scalar");
            nl = this.buffer.length;
          }
        }
        let i = nl + 1;
        ch = this.buffer[i];
        while (ch === " ")
          ch = this.buffer[++i];
        if (ch === "	") {
          while (ch === "	" || ch === " " || ch === "\r" || ch === "\n")
            ch = this.buffer[++i];
          nl = i - 1;
        } else if (!this.blockScalarKeep) {
          do {
            let i2 = nl - 1;
            let ch2 = this.buffer[i2];
            if (ch2 === "\r")
              ch2 = this.buffer[--i2];
            const lastChar = i2;
            while (ch2 === " ")
              ch2 = this.buffer[--i2];
            if (ch2 === "\n" && i2 >= this.pos && i2 + 1 + indent > lastChar)
              nl = i2;
            else
              break;
          } while (true);
        }
        yield cst.SCALAR;
        yield* this.pushToIndex(nl + 1, true);
        return yield* this.parseLineStart();
      }
      *parsePlainScalar() {
        const inFlow = this.flowLevel > 0;
        let end = this.pos - 1;
        let i = this.pos - 1;
        let ch;
        while (ch = this.buffer[++i]) {
          if (ch === ":") {
            const next = this.buffer[i + 1];
            if (isEmpty(next) || inFlow && flowIndicatorChars.has(next))
              break;
            end = i;
          } else if (isEmpty(ch)) {
            let next = this.buffer[i + 1];
            if (ch === "\r") {
              if (next === "\n") {
                i += 1;
                ch = "\n";
                next = this.buffer[i + 1];
              } else
                end = i;
            }
            if (next === "#" || inFlow && flowIndicatorChars.has(next))
              break;
            if (ch === "\n") {
              const cs = this.continueScalar(i + 1);
              if (cs === -1)
                break;
              i = Math.max(i, cs - 2);
            }
          } else {
            if (inFlow && flowIndicatorChars.has(ch))
              break;
            end = i;
          }
        }
        if (!ch && !this.atEnd)
          return this.setNext("plain-scalar");
        yield cst.SCALAR;
        yield* this.pushToIndex(end + 1, true);
        return inFlow ? "flow" : "doc";
      }
      *pushCount(n) {
        if (n > 0) {
          yield this.buffer.substr(this.pos, n);
          this.pos += n;
          return n;
        }
        return 0;
      }
      *pushToIndex(i, allowEmpty) {
        const s = this.buffer.slice(this.pos, i);
        if (s) {
          yield s;
          this.pos += s.length;
          return s.length;
        } else if (allowEmpty)
          yield "";
        return 0;
      }
      *pushIndicators() {
        let n = 0;
        loop: while (true) {
          switch (this.charAt(0)) {
            case "!":
              n += yield* this.pushTag();
              n += yield* this.pushSpaces(true);
              continue loop;
            case "&":
              n += yield* this.pushUntil(isNotAnchorChar);
              n += yield* this.pushSpaces(true);
              continue loop;
            case "-":
            // this is an error
            case "?":
            // this is an error outside flow collections
            case ":": {
              const inFlow = this.flowLevel > 0;
              const ch1 = this.charAt(1);
              if (isEmpty(ch1) || inFlow && flowIndicatorChars.has(ch1)) {
                if (!inFlow)
                  this.indentNext = this.indentValue + 1;
                else if (this.flowKey)
                  this.flowKey = false;
                n += yield* this.pushCount(1);
                n += yield* this.pushSpaces(true);
                continue loop;
              }
            }
          }
          break loop;
        }
        return n;
      }
      *pushTag() {
        if (this.charAt(1) === "<") {
          let i = this.pos + 2;
          let ch = this.buffer[i];
          while (!isEmpty(ch) && ch !== ">")
            ch = this.buffer[++i];
          return yield* this.pushToIndex(ch === ">" ? i + 1 : i, false);
        } else {
          let i = this.pos + 1;
          let ch = this.buffer[i];
          while (ch) {
            if (tagChars.has(ch))
              ch = this.buffer[++i];
            else if (ch === "%" && hexDigits.has(this.buffer[i + 1]) && hexDigits.has(this.buffer[i + 2])) {
              ch = this.buffer[i += 3];
            } else
              break;
          }
          return yield* this.pushToIndex(i, false);
        }
      }
      *pushNewline() {
        const ch = this.buffer[this.pos];
        if (ch === "\n")
          return yield* this.pushCount(1);
        else if (ch === "\r" && this.charAt(1) === "\n")
          return yield* this.pushCount(2);
        else
          return 0;
      }
      *pushSpaces(allowTabs) {
        let i = this.pos - 1;
        let ch;
        do {
          ch = this.buffer[++i];
        } while (ch === " " || allowTabs && ch === "	");
        const n = i - this.pos;
        if (n > 0) {
          yield this.buffer.substr(this.pos, n);
          this.pos = i;
        }
        return n;
      }
      *pushUntil(test) {
        let i = this.pos;
        let ch = this.buffer[i];
        while (!test(ch))
          ch = this.buffer[++i];
        return yield* this.pushToIndex(i, false);
      }
    };
    exports.Lexer = Lexer;
  }
});

// ../../packages/core/node_modules/yaml/dist/parse/line-counter.js
var require_line_counter = __commonJS({
  "../../packages/core/node_modules/yaml/dist/parse/line-counter.js"(exports) {
    "use strict";
    var LineCounter = class {
      constructor() {
        this.lineStarts = [];
        this.addNewLine = (offset) => this.lineStarts.push(offset);
        this.linePos = (offset) => {
          let low = 0;
          let high = this.lineStarts.length;
          while (low < high) {
            const mid = low + high >> 1;
            if (this.lineStarts[mid] < offset)
              low = mid + 1;
            else
              high = mid;
          }
          if (this.lineStarts[low] === offset)
            return { line: low + 1, col: 1 };
          if (low === 0)
            return { line: 0, col: offset };
          const start = this.lineStarts[low - 1];
          return { line: low, col: offset - start + 1 };
        };
      }
    };
    exports.LineCounter = LineCounter;
  }
});

// ../../packages/core/node_modules/yaml/dist/parse/parser.js
var require_parser = __commonJS({
  "../../packages/core/node_modules/yaml/dist/parse/parser.js"(exports) {
    "use strict";
    var node_process = __require("process");
    var cst = require_cst();
    var lexer = require_lexer();
    function includesToken(list, type) {
      for (let i = 0; i < list.length; ++i)
        if (list[i].type === type)
          return true;
      return false;
    }
    function findNonEmptyIndex(list) {
      for (let i = 0; i < list.length; ++i) {
        switch (list[i].type) {
          case "space":
          case "comment":
          case "newline":
            break;
          default:
            return i;
        }
      }
      return -1;
    }
    function isFlowToken(token2) {
      switch (token2?.type) {
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
        case "flow-collection":
          return true;
        default:
          return false;
      }
    }
    function getPrevProps(parent) {
      switch (parent.type) {
        case "document":
          return parent.start;
        case "block-map": {
          const it = parent.items[parent.items.length - 1];
          return it.sep ?? it.start;
        }
        case "block-seq":
          return parent.items[parent.items.length - 1].start;
        /* istanbul ignore next should not happen */
        default:
          return [];
      }
    }
    function getFirstKeyStartProps(prev) {
      if (prev.length === 0)
        return [];
      let i = prev.length;
      loop: while (--i >= 0) {
        switch (prev[i].type) {
          case "doc-start":
          case "explicit-key-ind":
          case "map-value-ind":
          case "seq-item-ind":
          case "newline":
            break loop;
        }
      }
      while (prev[++i]?.type === "space") {
      }
      return prev.splice(i, prev.length);
    }
    function arrayPushArray(target, source) {
      if (source.length < 1e5)
        Array.prototype.push.apply(target, source);
      else
        for (let i = 0; i < source.length; ++i)
          target.push(source[i]);
    }
    function fixFlowSeqItems(fc) {
      if (fc.start.type === "flow-seq-start") {
        for (const it of fc.items) {
          if (it.sep && !it.value && !includesToken(it.start, "explicit-key-ind") && !includesToken(it.sep, "map-value-ind")) {
            if (it.key)
              it.value = it.key;
            delete it.key;
            if (isFlowToken(it.value)) {
              if (it.value.end)
                arrayPushArray(it.value.end, it.sep);
              else
                it.value.end = it.sep;
            } else
              arrayPushArray(it.start, it.sep);
            delete it.sep;
          }
        }
      }
    }
    var Parser = class {
      /**
       * @param onNewLine - If defined, called separately with the start position of
       *   each new line (in `parse()`, including the start of input).
       */
      constructor(onNewLine) {
        this.atNewLine = true;
        this.atScalar = false;
        this.indent = 0;
        this.offset = 0;
        this.onKeyLine = false;
        this.stack = [];
        this.source = "";
        this.type = "";
        this.lexer = new lexer.Lexer();
        this.onNewLine = onNewLine;
      }
      /**
       * Parse `source` as a YAML stream.
       * If `incomplete`, a part of the last line may be left as a buffer for the next call.
       *
       * Errors are not thrown, but yielded as `{ type: 'error', message }` tokens.
       *
       * @returns A generator of tokens representing each directive, document, and other structure.
       */
      *parse(source, incomplete = false) {
        if (this.onNewLine && this.offset === 0)
          this.onNewLine(0);
        for (const lexeme of this.lexer.lex(source, incomplete))
          yield* this.next(lexeme);
        if (!incomplete)
          yield* this.end();
      }
      /**
       * Advance the parser by the `source` of one lexical token.
       */
      *next(source) {
        this.source = source;
        if (node_process.env.LOG_TOKENS)
          console.log("|", cst.prettyToken(source));
        if (this.atScalar) {
          this.atScalar = false;
          yield* this.step();
          this.offset += source.length;
          return;
        }
        const type = cst.tokenType(source);
        if (!type) {
          const message = `Not a YAML token: ${source}`;
          yield* this.pop({ type: "error", offset: this.offset, message, source });
          this.offset += source.length;
        } else if (type === "scalar") {
          this.atNewLine = false;
          this.atScalar = true;
          this.type = "scalar";
        } else {
          this.type = type;
          yield* this.step();
          switch (type) {
            case "newline":
              this.atNewLine = true;
              this.indent = 0;
              if (this.onNewLine)
                this.onNewLine(this.offset + source.length);
              break;
            case "space":
              if (this.atNewLine && source[0] === " ")
                this.indent += source.length;
              break;
            case "explicit-key-ind":
            case "map-value-ind":
            case "seq-item-ind":
              if (this.atNewLine)
                this.indent += source.length;
              break;
            case "doc-mode":
            case "flow-error-end":
              return;
            default:
              this.atNewLine = false;
          }
          this.offset += source.length;
        }
      }
      /** Call at end of input to push out any remaining constructions */
      *end() {
        while (this.stack.length > 0)
          yield* this.pop();
      }
      get sourceToken() {
        const st = {
          type: this.type,
          offset: this.offset,
          indent: this.indent,
          source: this.source
        };
        return st;
      }
      *step() {
        const top = this.peek(1);
        if (this.type === "doc-end" && top?.type !== "doc-end") {
          while (this.stack.length > 0)
            yield* this.pop();
          this.stack.push({
            type: "doc-end",
            offset: this.offset,
            source: this.source
          });
          return;
        }
        if (!top)
          return yield* this.stream();
        switch (top.type) {
          case "document":
            return yield* this.document(top);
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return yield* this.scalar(top);
          case "block-scalar":
            return yield* this.blockScalar(top);
          case "block-map":
            return yield* this.blockMap(top);
          case "block-seq":
            return yield* this.blockSequence(top);
          case "flow-collection":
            return yield* this.flowCollection(top);
          case "doc-end":
            return yield* this.documentEnd(top);
        }
        yield* this.pop();
      }
      peek(n) {
        return this.stack[this.stack.length - n];
      }
      *pop(error) {
        const token2 = error ?? this.stack.pop();
        if (!token2) {
          const message = "Tried to pop an empty stack";
          yield { type: "error", offset: this.offset, source: "", message };
        } else if (this.stack.length === 0) {
          yield token2;
        } else {
          const top = this.peek(1);
          if (token2.type === "block-scalar") {
            token2.indent = "indent" in top ? top.indent : 0;
          } else if (token2.type === "flow-collection" && top.type === "document") {
            token2.indent = 0;
          }
          if (token2.type === "flow-collection")
            fixFlowSeqItems(token2);
          switch (top.type) {
            case "document":
              top.value = token2;
              break;
            case "block-scalar":
              top.props.push(token2);
              break;
            case "block-map": {
              const it = top.items[top.items.length - 1];
              if (it.value) {
                top.items.push({ start: [], key: token2, sep: [] });
                this.onKeyLine = true;
                return;
              } else if (it.sep) {
                it.value = token2;
              } else {
                Object.assign(it, { key: token2, sep: [] });
                this.onKeyLine = !it.explicitKey;
                return;
              }
              break;
            }
            case "block-seq": {
              const it = top.items[top.items.length - 1];
              if (it.value)
                top.items.push({ start: [], value: token2 });
              else
                it.value = token2;
              break;
            }
            case "flow-collection": {
              const it = top.items[top.items.length - 1];
              if (!it || it.value)
                top.items.push({ start: [], key: token2, sep: [] });
              else if (it.sep)
                it.value = token2;
              else
                Object.assign(it, { key: token2, sep: [] });
              return;
            }
            /* istanbul ignore next should not happen */
            default:
              yield* this.pop();
              yield* this.pop(token2);
          }
          if ((top.type === "document" || top.type === "block-map" || top.type === "block-seq") && (token2.type === "block-map" || token2.type === "block-seq")) {
            const last = token2.items[token2.items.length - 1];
            if (last && !last.sep && !last.value && last.start.length > 0 && findNonEmptyIndex(last.start) === -1 && (token2.indent === 0 || last.start.every((st) => st.type !== "comment" || st.indent < token2.indent))) {
              if (top.type === "document")
                top.end = last.start;
              else
                top.items.push({ start: last.start });
              token2.items.splice(-1, 1);
            }
          }
        }
      }
      *stream() {
        switch (this.type) {
          case "directive-line":
            yield { type: "directive", offset: this.offset, source: this.source };
            return;
          case "byte-order-mark":
          case "space":
          case "comment":
          case "newline":
            yield this.sourceToken;
            return;
          case "doc-mode":
          case "doc-start": {
            const doc = {
              type: "document",
              offset: this.offset,
              start: []
            };
            if (this.type === "doc-start")
              doc.start.push(this.sourceToken);
            this.stack.push(doc);
            return;
          }
        }
        yield {
          type: "error",
          offset: this.offset,
          message: `Unexpected ${this.type} token in YAML stream`,
          source: this.source
        };
      }
      *document(doc) {
        if (doc.value)
          return yield* this.lineEnd(doc);
        switch (this.type) {
          case "doc-start": {
            if (findNonEmptyIndex(doc.start) !== -1) {
              yield* this.pop();
              yield* this.step();
            } else
              doc.start.push(this.sourceToken);
            return;
          }
          case "anchor":
          case "tag":
          case "space":
          case "comment":
          case "newline":
            doc.start.push(this.sourceToken);
            return;
        }
        const bv = this.startBlockValue(doc);
        if (bv)
          this.stack.push(bv);
        else {
          yield {
            type: "error",
            offset: this.offset,
            message: `Unexpected ${this.type} token in YAML document`,
            source: this.source
          };
        }
      }
      *scalar(scalar) {
        if (this.type === "map-value-ind") {
          const prev = getPrevProps(this.peek(2));
          const start = getFirstKeyStartProps(prev);
          let sep;
          if (scalar.end) {
            sep = scalar.end;
            sep.push(this.sourceToken);
            delete scalar.end;
          } else
            sep = [this.sourceToken];
          const map = {
            type: "block-map",
            offset: scalar.offset,
            indent: scalar.indent,
            items: [{ start, key: scalar, sep }]
          };
          this.onKeyLine = true;
          this.stack[this.stack.length - 1] = map;
        } else
          yield* this.lineEnd(scalar);
      }
      *blockScalar(scalar) {
        switch (this.type) {
          case "space":
          case "comment":
          case "newline":
            scalar.props.push(this.sourceToken);
            return;
          case "scalar":
            scalar.source = this.source;
            this.atNewLine = true;
            this.indent = 0;
            if (this.onNewLine) {
              let nl = this.source.indexOf("\n") + 1;
              while (nl !== 0) {
                this.onNewLine(this.offset + nl);
                nl = this.source.indexOf("\n", nl) + 1;
              }
            }
            yield* this.pop();
            break;
          /* istanbul ignore next should not happen */
          default:
            yield* this.pop();
            yield* this.step();
        }
      }
      *blockMap(map) {
        const it = map.items[map.items.length - 1];
        switch (this.type) {
          case "newline":
            this.onKeyLine = false;
            if (it.value) {
              const end = "end" in it.value ? it.value.end : void 0;
              const last = Array.isArray(end) ? end[end.length - 1] : void 0;
              if (last?.type === "comment")
                end?.push(this.sourceToken);
              else
                map.items.push({ start: [this.sourceToken] });
            } else if (it.sep) {
              it.sep.push(this.sourceToken);
            } else {
              it.start.push(this.sourceToken);
            }
            return;
          case "space":
          case "comment":
            if (it.value) {
              map.items.push({ start: [this.sourceToken] });
            } else if (it.sep) {
              it.sep.push(this.sourceToken);
            } else {
              if (this.atIndentedComment(it.start, map.indent)) {
                const prev = map.items[map.items.length - 2];
                const end = prev?.value?.end;
                if (Array.isArray(end)) {
                  arrayPushArray(end, it.start);
                  end.push(this.sourceToken);
                  map.items.pop();
                  return;
                }
              }
              it.start.push(this.sourceToken);
            }
            return;
        }
        if (this.indent >= map.indent) {
          const atMapIndent = !this.onKeyLine && this.indent === map.indent;
          const atNextItem = atMapIndent && (it.sep || it.explicitKey) && this.type !== "seq-item-ind";
          let start = [];
          if (atNextItem && it.sep && !it.value) {
            const nl = [];
            for (let i = 0; i < it.sep.length; ++i) {
              const st = it.sep[i];
              switch (st.type) {
                case "newline":
                  nl.push(i);
                  break;
                case "space":
                  break;
                case "comment":
                  if (st.indent > map.indent)
                    nl.length = 0;
                  break;
                default:
                  nl.length = 0;
              }
            }
            if (nl.length >= 2)
              start = it.sep.splice(nl[1]);
          }
          switch (this.type) {
            case "anchor":
            case "tag":
              if (atNextItem || it.value) {
                start.push(this.sourceToken);
                map.items.push({ start });
                this.onKeyLine = true;
              } else if (it.sep) {
                it.sep.push(this.sourceToken);
              } else {
                it.start.push(this.sourceToken);
              }
              return;
            case "explicit-key-ind":
              if (!it.sep && !it.explicitKey) {
                it.start.push(this.sourceToken);
                it.explicitKey = true;
              } else if (atNextItem || it.value) {
                start.push(this.sourceToken);
                map.items.push({ start, explicitKey: true });
              } else {
                this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start: [this.sourceToken], explicitKey: true }]
                });
              }
              this.onKeyLine = true;
              return;
            case "map-value-ind":
              if (it.explicitKey) {
                if (!it.sep) {
                  if (includesToken(it.start, "newline")) {
                    Object.assign(it, { key: null, sep: [this.sourceToken] });
                  } else {
                    const start2 = getFirstKeyStartProps(it.start);
                    this.stack.push({
                      type: "block-map",
                      offset: this.offset,
                      indent: this.indent,
                      items: [{ start: start2, key: null, sep: [this.sourceToken] }]
                    });
                  }
                } else if (it.value) {
                  map.items.push({ start: [], key: null, sep: [this.sourceToken] });
                } else if (includesToken(it.sep, "map-value-ind")) {
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start, key: null, sep: [this.sourceToken] }]
                  });
                } else if (isFlowToken(it.key) && !includesToken(it.sep, "newline")) {
                  const start2 = getFirstKeyStartProps(it.start);
                  const key = it.key;
                  const sep = it.sep;
                  sep.push(this.sourceToken);
                  delete it.key;
                  delete it.sep;
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: start2, key, sep }]
                  });
                } else if (start.length > 0) {
                  it.sep = it.sep.concat(start, this.sourceToken);
                } else {
                  it.sep.push(this.sourceToken);
                }
              } else {
                if (!it.sep) {
                  Object.assign(it, { key: null, sep: [this.sourceToken] });
                } else if (it.value || atNextItem) {
                  map.items.push({ start, key: null, sep: [this.sourceToken] });
                } else if (includesToken(it.sep, "map-value-ind")) {
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: [], key: null, sep: [this.sourceToken] }]
                  });
                } else {
                  it.sep.push(this.sourceToken);
                }
              }
              this.onKeyLine = true;
              return;
            case "alias":
            case "scalar":
            case "single-quoted-scalar":
            case "double-quoted-scalar": {
              const fs = this.flowScalar(this.type);
              if (atNextItem || it.value) {
                map.items.push({ start, key: fs, sep: [] });
                this.onKeyLine = true;
              } else if (it.sep) {
                this.stack.push(fs);
              } else {
                Object.assign(it, { key: fs, sep: [] });
                this.onKeyLine = true;
              }
              return;
            }
            default: {
              const bv = this.startBlockValue(map);
              if (bv) {
                if (bv.type === "block-seq") {
                  if (!it.explicitKey && it.sep && !includesToken(it.sep, "newline")) {
                    yield* this.pop({
                      type: "error",
                      offset: this.offset,
                      message: "Unexpected block-seq-ind on same line with key",
                      source: this.source
                    });
                    return;
                  }
                } else if (atMapIndent) {
                  map.items.push({ start });
                }
                this.stack.push(bv);
                return;
              }
            }
          }
        }
        yield* this.pop();
        yield* this.step();
      }
      *blockSequence(seq2) {
        const it = seq2.items[seq2.items.length - 1];
        switch (this.type) {
          case "newline":
            if (it.value) {
              const end = "end" in it.value ? it.value.end : void 0;
              const last = Array.isArray(end) ? end[end.length - 1] : void 0;
              if (last?.type === "comment")
                end?.push(this.sourceToken);
              else
                seq2.items.push({ start: [this.sourceToken] });
            } else
              it.start.push(this.sourceToken);
            return;
          case "space":
          case "comment":
            if (it.value)
              seq2.items.push({ start: [this.sourceToken] });
            else {
              if (this.atIndentedComment(it.start, seq2.indent)) {
                const prev = seq2.items[seq2.items.length - 2];
                const end = prev?.value?.end;
                if (Array.isArray(end)) {
                  arrayPushArray(end, it.start);
                  end.push(this.sourceToken);
                  seq2.items.pop();
                  return;
                }
              }
              it.start.push(this.sourceToken);
            }
            return;
          case "anchor":
          case "tag":
            if (it.value || this.indent <= seq2.indent)
              break;
            it.start.push(this.sourceToken);
            return;
          case "seq-item-ind":
            if (this.indent !== seq2.indent)
              break;
            if (it.value || includesToken(it.start, "seq-item-ind"))
              seq2.items.push({ start: [this.sourceToken] });
            else
              it.start.push(this.sourceToken);
            return;
        }
        if (this.indent > seq2.indent) {
          const bv = this.startBlockValue(seq2);
          if (bv) {
            this.stack.push(bv);
            return;
          }
        }
        yield* this.pop();
        yield* this.step();
      }
      *flowCollection(fc) {
        const it = fc.items[fc.items.length - 1];
        if (this.type === "flow-error-end") {
          let top;
          do {
            yield* this.pop();
            top = this.peek(1);
          } while (top?.type === "flow-collection");
        } else if (fc.end.length === 0) {
          switch (this.type) {
            case "comma":
            case "explicit-key-ind":
              if (!it || it.sep)
                fc.items.push({ start: [this.sourceToken] });
              else
                it.start.push(this.sourceToken);
              return;
            case "map-value-ind":
              if (!it || it.value)
                fc.items.push({ start: [], key: null, sep: [this.sourceToken] });
              else if (it.sep)
                it.sep.push(this.sourceToken);
              else
                Object.assign(it, { key: null, sep: [this.sourceToken] });
              return;
            case "space":
            case "comment":
            case "newline":
            case "anchor":
            case "tag":
              if (!it || it.value)
                fc.items.push({ start: [this.sourceToken] });
              else if (it.sep)
                it.sep.push(this.sourceToken);
              else
                it.start.push(this.sourceToken);
              return;
            case "alias":
            case "scalar":
            case "single-quoted-scalar":
            case "double-quoted-scalar": {
              const fs = this.flowScalar(this.type);
              if (!it || it.value)
                fc.items.push({ start: [], key: fs, sep: [] });
              else if (it.sep)
                this.stack.push(fs);
              else
                Object.assign(it, { key: fs, sep: [] });
              return;
            }
            case "flow-map-end":
            case "flow-seq-end":
              fc.end.push(this.sourceToken);
              return;
          }
          const bv = this.startBlockValue(fc);
          if (bv)
            this.stack.push(bv);
          else {
            yield* this.pop();
            yield* this.step();
          }
        } else {
          const parent = this.peek(2);
          if (parent.type === "block-map" && (this.type === "map-value-ind" && parent.indent === fc.indent || this.type === "newline" && !parent.items[parent.items.length - 1].sep)) {
            yield* this.pop();
            yield* this.step();
          } else if (this.type === "map-value-ind" && parent.type !== "flow-collection") {
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            fixFlowSeqItems(fc);
            const sep = fc.end.splice(1, fc.end.length);
            sep.push(this.sourceToken);
            const map = {
              type: "block-map",
              offset: fc.offset,
              indent: fc.indent,
              items: [{ start, key: fc, sep }]
            };
            this.onKeyLine = true;
            this.stack[this.stack.length - 1] = map;
          } else {
            yield* this.lineEnd(fc);
          }
        }
      }
      flowScalar(type) {
        if (this.onNewLine) {
          let nl = this.source.indexOf("\n") + 1;
          while (nl !== 0) {
            this.onNewLine(this.offset + nl);
            nl = this.source.indexOf("\n", nl) + 1;
          }
        }
        return {
          type,
          offset: this.offset,
          indent: this.indent,
          source: this.source
        };
      }
      startBlockValue(parent) {
        switch (this.type) {
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return this.flowScalar(this.type);
          case "block-scalar-header":
            return {
              type: "block-scalar",
              offset: this.offset,
              indent: this.indent,
              props: [this.sourceToken],
              source: ""
            };
          case "flow-map-start":
          case "flow-seq-start":
            return {
              type: "flow-collection",
              offset: this.offset,
              indent: this.indent,
              start: this.sourceToken,
              items: [],
              end: []
            };
          case "seq-item-ind":
            return {
              type: "block-seq",
              offset: this.offset,
              indent: this.indent,
              items: [{ start: [this.sourceToken] }]
            };
          case "explicit-key-ind": {
            this.onKeyLine = true;
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            start.push(this.sourceToken);
            return {
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{ start, explicitKey: true }]
            };
          }
          case "map-value-ind": {
            this.onKeyLine = true;
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            return {
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{ start, key: null, sep: [this.sourceToken] }]
            };
          }
        }
        return null;
      }
      atIndentedComment(start, indent) {
        if (this.type !== "comment")
          return false;
        if (this.indent <= indent)
          return false;
        return start.every((st) => st.type === "newline" || st.type === "space");
      }
      *documentEnd(docEnd) {
        if (this.type !== "doc-mode") {
          if (docEnd.end)
            docEnd.end.push(this.sourceToken);
          else
            docEnd.end = [this.sourceToken];
          if (this.type === "newline")
            yield* this.pop();
        }
      }
      *lineEnd(token2) {
        switch (this.type) {
          case "comma":
          case "doc-start":
          case "doc-end":
          case "flow-seq-end":
          case "flow-map-end":
          case "map-value-ind":
            yield* this.pop();
            yield* this.step();
            break;
          case "newline":
            this.onKeyLine = false;
          // fallthrough
          case "space":
          case "comment":
          default:
            if (token2.end)
              token2.end.push(this.sourceToken);
            else
              token2.end = [this.sourceToken];
            if (this.type === "newline")
              yield* this.pop();
        }
      }
    };
    exports.Parser = Parser;
  }
});

// ../../packages/core/node_modules/yaml/dist/public-api.js
var require_public_api = __commonJS({
  "../../packages/core/node_modules/yaml/dist/public-api.js"(exports) {
    "use strict";
    var composer = require_composer();
    var Document = require_Document();
    var errors = require_errors();
    var log = require_log();
    var identity = require_identity();
    var lineCounter = require_line_counter();
    var parser = require_parser();
    function parseOptions(options) {
      const prettyErrors = options.prettyErrors !== false;
      const lineCounter$1 = options.lineCounter || prettyErrors && new lineCounter.LineCounter() || null;
      return { lineCounter: lineCounter$1, prettyErrors };
    }
    function parseAllDocuments(source, options = {}) {
      const { lineCounter: lineCounter2, prettyErrors } = parseOptions(options);
      const parser$1 = new parser.Parser(lineCounter2?.addNewLine);
      const composer$1 = new composer.Composer(options);
      const docs = Array.from(composer$1.compose(parser$1.parse(source)));
      if (prettyErrors && lineCounter2)
        for (const doc of docs) {
          doc.errors.forEach(errors.prettifyError(source, lineCounter2));
          doc.warnings.forEach(errors.prettifyError(source, lineCounter2));
        }
      if (docs.length > 0)
        return docs;
      return Object.assign([], { empty: true }, composer$1.streamInfo());
    }
    function parseDocument(source, options = {}) {
      const { lineCounter: lineCounter2, prettyErrors } = parseOptions(options);
      const parser$1 = new parser.Parser(lineCounter2?.addNewLine);
      const composer$1 = new composer.Composer(options);
      let doc = null;
      for (const _doc of composer$1.compose(parser$1.parse(source), true, source.length)) {
        if (!doc)
          doc = _doc;
        else if (doc.options.logLevel !== "silent") {
          doc.errors.push(new errors.YAMLParseError(_doc.range.slice(0, 2), "MULTIPLE_DOCS", "Source contains multiple documents; please use YAML.parseAllDocuments()"));
          break;
        }
      }
      if (prettyErrors && lineCounter2) {
        doc.errors.forEach(errors.prettifyError(source, lineCounter2));
        doc.warnings.forEach(errors.prettifyError(source, lineCounter2));
      }
      return doc;
    }
    function parse2(src, reviver, options) {
      let _reviver = void 0;
      if (typeof reviver === "function") {
        _reviver = reviver;
      } else if (options === void 0 && reviver && typeof reviver === "object") {
        options = reviver;
      }
      const doc = parseDocument(src, options);
      if (!doc)
        return null;
      doc.warnings.forEach((warning) => log.warn(doc.options.logLevel, warning));
      if (doc.errors.length > 0) {
        if (doc.options.logLevel !== "silent")
          throw doc.errors[0];
        else
          doc.errors = [];
      }
      return doc.toJS(Object.assign({ reviver: _reviver }, options));
    }
    function stringify(value, replacer, options) {
      let _replacer = null;
      if (typeof replacer === "function" || Array.isArray(replacer)) {
        _replacer = replacer;
      } else if (options === void 0 && replacer) {
        options = replacer;
      }
      if (typeof options === "string")
        options = options.length;
      if (typeof options === "number") {
        const indent = Math.round(options);
        options = indent < 1 ? void 0 : indent > 8 ? { indent: 8 } : { indent };
      }
      if (value === void 0) {
        const { keepUndefined } = options ?? replacer ?? {};
        if (!keepUndefined)
          return void 0;
      }
      if (identity.isDocument(value) && !_replacer)
        return value.toString(options);
      return new Document.Document(value, _replacer, options).toString(options);
    }
    exports.parse = parse2;
    exports.parseAllDocuments = parseAllDocuments;
    exports.parseDocument = parseDocument;
    exports.stringify = stringify;
  }
});

// ../../packages/core/node_modules/yaml/dist/index.js
var require_dist = __commonJS({
  "../../packages/core/node_modules/yaml/dist/index.js"(exports) {
    "use strict";
    var composer = require_composer();
    var Document = require_Document();
    var Schema = require_Schema();
    var errors = require_errors();
    var Alias = require_Alias();
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var cst = require_cst();
    var lexer = require_lexer();
    var lineCounter = require_line_counter();
    var parser = require_parser();
    var publicApi = require_public_api();
    var visit = require_visit();
    exports.Composer = composer.Composer;
    exports.Document = Document.Document;
    exports.Schema = Schema.Schema;
    exports.YAMLError = errors.YAMLError;
    exports.YAMLParseError = errors.YAMLParseError;
    exports.YAMLWarning = errors.YAMLWarning;
    exports.Alias = Alias.Alias;
    exports.isAlias = identity.isAlias;
    exports.isCollection = identity.isCollection;
    exports.isDocument = identity.isDocument;
    exports.isMap = identity.isMap;
    exports.isNode = identity.isNode;
    exports.isPair = identity.isPair;
    exports.isScalar = identity.isScalar;
    exports.isSeq = identity.isSeq;
    exports.Pair = Pair.Pair;
    exports.Scalar = Scalar.Scalar;
    exports.YAMLMap = YAMLMap.YAMLMap;
    exports.YAMLSeq = YAMLSeq.YAMLSeq;
    exports.CST = cst;
    exports.Lexer = lexer.Lexer;
    exports.LineCounter = lineCounter.LineCounter;
    exports.Parser = parser.Parser;
    exports.parse = publicApi.parse;
    exports.parseAllDocuments = publicApi.parseAllDocuments;
    exports.parseDocument = publicApi.parseDocument;
    exports.stringify = publicApi.stringify;
    exports.visit = visit.visit;
    exports.visitAsync = visit.visitAsync;
  }
});

// ../../packages/core/node_modules/ret/dist/types/tokens.js
var require_tokens = __commonJS({
  "../../packages/core/node_modules/ret/dist/types/tokens.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../packages/core/node_modules/ret/dist/types/types.js
var require_types = __commonJS({
  "../../packages/core/node_modules/ret/dist/types/types.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.types = void 0;
    var types;
    (function(types2) {
      types2[types2["ROOT"] = 0] = "ROOT";
      types2[types2["GROUP"] = 1] = "GROUP";
      types2[types2["POSITION"] = 2] = "POSITION";
      types2[types2["SET"] = 3] = "SET";
      types2[types2["RANGE"] = 4] = "RANGE";
      types2[types2["REPETITION"] = 5] = "REPETITION";
      types2[types2["REFERENCE"] = 6] = "REFERENCE";
      types2[types2["CHAR"] = 7] = "CHAR";
    })(types = exports.types || (exports.types = {}));
  }
});

// ../../packages/core/node_modules/ret/dist/types/set-lookup.js
var require_set_lookup = __commonJS({
  "../../packages/core/node_modules/ret/dist/types/set-lookup.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../packages/core/node_modules/ret/dist/types/index.js
var require_types2 = __commonJS({
  "../../packages/core/node_modules/ret/dist/types/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o2, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o2, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    }) : (function(o2, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o2[k2] = m[k];
    }));
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_tokens(), exports);
    __exportStar(require_types(), exports);
    __exportStar(require_set_lookup(), exports);
  }
});

// ../../packages/core/node_modules/ret/dist/sets.js
var require_sets = __commonJS({
  "../../packages/core/node_modules/ret/dist/sets.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.anyChar = exports.notWhitespace = exports.whitespace = exports.notInts = exports.ints = exports.notWords = exports.words = void 0;
    var types_1 = require_types2();
    var INTS = () => [{ type: types_1.types.RANGE, from: 48, to: 57 }];
    var WORDS = () => [
      { type: types_1.types.CHAR, value: 95 },
      { type: types_1.types.RANGE, from: 97, to: 122 },
      { type: types_1.types.RANGE, from: 65, to: 90 },
      { type: types_1.types.RANGE, from: 48, to: 57 }
    ];
    var WHITESPACE = () => [
      { type: types_1.types.CHAR, value: 9 },
      { type: types_1.types.CHAR, value: 10 },
      { type: types_1.types.CHAR, value: 11 },
      { type: types_1.types.CHAR, value: 12 },
      { type: types_1.types.CHAR, value: 13 },
      { type: types_1.types.CHAR, value: 32 },
      { type: types_1.types.CHAR, value: 160 },
      { type: types_1.types.CHAR, value: 5760 },
      { type: types_1.types.RANGE, from: 8192, to: 8202 },
      { type: types_1.types.CHAR, value: 8232 },
      { type: types_1.types.CHAR, value: 8233 },
      { type: types_1.types.CHAR, value: 8239 },
      { type: types_1.types.CHAR, value: 8287 },
      { type: types_1.types.CHAR, value: 12288 },
      { type: types_1.types.CHAR, value: 65279 }
    ];
    var NOTANYCHAR = () => [
      { type: types_1.types.CHAR, value: 10 },
      { type: types_1.types.CHAR, value: 13 },
      { type: types_1.types.CHAR, value: 8232 },
      { type: types_1.types.CHAR, value: 8233 }
    ];
    exports.words = () => ({ type: types_1.types.SET, set: WORDS(), not: false });
    exports.notWords = () => ({ type: types_1.types.SET, set: WORDS(), not: true });
    exports.ints = () => ({ type: types_1.types.SET, set: INTS(), not: false });
    exports.notInts = () => ({ type: types_1.types.SET, set: INTS(), not: true });
    exports.whitespace = () => ({ type: types_1.types.SET, set: WHITESPACE(), not: false });
    exports.notWhitespace = () => ({ type: types_1.types.SET, set: WHITESPACE(), not: true });
    exports.anyChar = () => ({ type: types_1.types.SET, set: NOTANYCHAR(), not: true });
  }
});

// ../../packages/core/node_modules/ret/dist/util.js
var require_util = __commonJS({
  "../../packages/core/node_modules/ret/dist/util.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o2, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o2, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    }) : (function(o2, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o2[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o2, v) {
      Object.defineProperty(o2, "default", { enumerable: true, value: v });
    }) : function(o2, v) {
      o2["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.tokenizeClass = exports.strToChars = void 0;
    var types_1 = require_types2();
    var sets = __importStar(require_sets());
    var CTRL = "@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^ ?";
    exports.strToChars = (str) => {
      const charsRegex = /(\[\\b\])|(\\)?\\(?:u([A-F0-9]{4})|x([A-F0-9]{2})|c([@A-Z[\\\]^?])|([0tnvfr]))/g;
      return str.replace(charsRegex, (s, b, lbs, a16, b16, dctrl, eslsh) => {
        if (lbs) {
          return s;
        }
        let code = b ? 8 : a16 ? parseInt(a16, 16) : b16 ? parseInt(b16, 16) : dctrl ? CTRL.indexOf(dctrl) : {
          0: 0,
          t: 9,
          n: 10,
          v: 11,
          f: 12,
          r: 13
        }[eslsh];
        let c = String.fromCharCode(code);
        return /[[\]{}^$.|?*+()]/.test(c) ? `\\${c}` : c;
      });
    };
    exports.tokenizeClass = (str, regexpStr) => {
      var _a, _b, _c, _d, _e, _f, _g;
      let tokens = [], rs, c;
      const regexp = /\\(?:(w)|(d)|(s)|(W)|(D)|(S))|((?:(?:\\)(.)|([^\]\\]))-(((?:\\)])|(((?:\\)?([^\]])))))|(\])|(?:\\)?([^])/g;
      while ((rs = regexp.exec(str)) !== null) {
        const p = (_g = (_f = (_e = (_d = (_c = (_b = (_a = rs[1] && sets.words()) !== null && _a !== void 0 ? _a : rs[2] && sets.ints()) !== null && _b !== void 0 ? _b : rs[3] && sets.whitespace()) !== null && _c !== void 0 ? _c : rs[4] && sets.notWords()) !== null && _d !== void 0 ? _d : rs[5] && sets.notInts()) !== null && _e !== void 0 ? _e : rs[6] && sets.notWhitespace()) !== null && _f !== void 0 ? _f : rs[7] && {
          type: types_1.types.RANGE,
          from: (rs[8] || rs[9]).charCodeAt(0),
          to: (c = rs[10]).charCodeAt(c.length - 1)
        }) !== null && _g !== void 0 ? _g : (c = rs[16]) && { type: types_1.types.CHAR, value: c.charCodeAt(0) };
        if (p) {
          tokens.push(p);
        } else {
          return [tokens, regexp.lastIndex];
        }
      }
      throw new SyntaxError(`Invalid regular expression: /${regexpStr}/: Unterminated character class`);
    };
  }
});

// ../../packages/core/node_modules/ret/dist/tokenizer.js
var require_tokenizer = __commonJS({
  "../../packages/core/node_modules/ret/dist/tokenizer.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o2, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o2, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    }) : (function(o2, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o2[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o2, v) {
      Object.defineProperty(o2, "default", { enumerable: true, value: v });
    }) : function(o2, v) {
      o2["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.tokenizer = void 0;
    var util = __importStar(require_util());
    var types_1 = require_types2();
    var sets = __importStar(require_sets());
    var captureGroupFirstChar = /^[a-zA-Z_$]$/i;
    var captureGroupChars = /^[a-zA-Z0-9_$]$/i;
    var digit = /\d/;
    exports.tokenizer = (regexpStr) => {
      let i = 0, c;
      let start = { type: types_1.types.ROOT, stack: [] };
      let lastGroup = start;
      let last = start.stack;
      let groupStack = [];
      let referenceQueue = [];
      let groupCount = 0;
      const repeatErr = (col) => {
        throw new SyntaxError(`Invalid regular expression: /${regexpStr}/: Nothing to repeat at column ${col - 1}`);
      };
      let str = util.strToChars(regexpStr);
      while (i < str.length) {
        switch (c = str[i++]) {
          // Handle escaped characters, inclues a few sets.
          case "\\":
            if (i === str.length) {
              throw new SyntaxError(`Invalid regular expression: /${regexpStr}/: \\ at end of pattern`);
            }
            switch (c = str[i++]) {
              case "b":
                last.push({ type: types_1.types.POSITION, value: "b" });
                break;
              case "B":
                last.push({ type: types_1.types.POSITION, value: "B" });
                break;
              case "w":
                last.push(sets.words());
                break;
              case "W":
                last.push(sets.notWords());
                break;
              case "d":
                last.push(sets.ints());
                break;
              case "D":
                last.push(sets.notInts());
                break;
              case "s":
                last.push(sets.whitespace());
                break;
              case "S":
                last.push(sets.notWhitespace());
                break;
              default:
                if (digit.test(c)) {
                  let digits = c;
                  while (i < str.length && digit.test(str[i])) {
                    digits += str[i++];
                  }
                  let value = parseInt(digits, 10);
                  const reference = { type: types_1.types.REFERENCE, value };
                  last.push(reference);
                  referenceQueue.push({ reference, stack: last, index: last.length - 1 });
                } else {
                  last.push({ type: types_1.types.CHAR, value: c.charCodeAt(0) });
                }
            }
            break;
          // Positionals.
          case "^":
            last.push({ type: types_1.types.POSITION, value: "^" });
            break;
          case "$":
            last.push({ type: types_1.types.POSITION, value: "$" });
            break;
          // Handle custom sets.
          case "[": {
            let not;
            if (str[i] === "^") {
              not = true;
              i++;
            } else {
              not = false;
            }
            let classTokens = util.tokenizeClass(str.slice(i), regexpStr);
            i += classTokens[1];
            last.push({
              type: types_1.types.SET,
              set: classTokens[0],
              not
            });
            break;
          }
          // Class of any character except \n.
          case ".":
            last.push(sets.anyChar());
            break;
          // Push group onto stack.
          case "(": {
            let group = {
              type: types_1.types.GROUP,
              stack: [],
              remember: true
            };
            if (str[i] === "?") {
              c = str[i + 1];
              i += 2;
              if (c === "=") {
                group.followedBy = true;
                group.remember = false;
              } else if (c === "!") {
                group.notFollowedBy = true;
                group.remember = false;
              } else if (c === "<") {
                let name = "";
                if (captureGroupFirstChar.test(str[i])) {
                  name += str[i];
                  i++;
                } else {
                  throw new SyntaxError(`Invalid regular expression: /${regexpStr}/: Invalid capture group name, character '${str[i]}' after '<' at column ${i + 1}`);
                }
                while (i < str.length && captureGroupChars.test(str[i])) {
                  name += str[i];
                  i++;
                }
                if (!name) {
                  throw new SyntaxError(`Invalid regular expression: /${regexpStr}/: Invalid capture group name, character '${str[i]}' after '<' at column ${i + 1}`);
                }
                if (str[i] !== ">") {
                  throw new SyntaxError(`Invalid regular expression: /${regexpStr}/: Unclosed capture group name, expected '>', found '${str[i]}' at column ${i + 1}`);
                }
                group.name = name;
                i++;
              } else if (c === ":") {
                group.remember = false;
              } else {
                throw new SyntaxError(`Invalid regular expression: /${regexpStr}/: Invalid group, character '${c}' after '?' at column ${i - 1}`);
              }
            } else {
              groupCount += 1;
            }
            last.push(group);
            groupStack.push(lastGroup);
            lastGroup = group;
            last = group.stack;
            break;
          }
          // Pop group out of stack.
          case ")":
            if (groupStack.length === 0) {
              throw new SyntaxError(`Invalid regular expression: /${regexpStr}/: Unmatched ) at column ${i - 1}`);
            }
            lastGroup = groupStack.pop();
            last = lastGroup.options ? lastGroup.options[lastGroup.options.length - 1] : lastGroup.stack;
            break;
          // Use pipe character to give more choices.
          case "|": {
            if (!lastGroup.options) {
              lastGroup.options = [lastGroup.stack];
              delete lastGroup.stack;
            }
            let stack = [];
            lastGroup.options.push(stack);
            last = stack;
            break;
          }
          // Repetition.
          // For every repetition, remove last element from last stack
          // then insert back a RANGE object.
          // This design is chosen because there could be more than
          // one repetition symbols in a regex i.e. `a?+{2,3}`.
          case "{": {
            let rs = /^(\d+)(,(\d+)?)?\}/.exec(str.slice(i)), min, max;
            if (rs !== null) {
              if (last.length === 0) {
                repeatErr(i);
              }
              min = parseInt(rs[1], 10);
              max = rs[2] ? rs[3] ? parseInt(rs[3], 10) : Infinity : min;
              i += rs[0].length;
              last.push({
                type: types_1.types.REPETITION,
                min,
                max,
                value: last.pop()
              });
            } else {
              last.push({
                type: types_1.types.CHAR,
                value: 123
              });
            }
            break;
          }
          case "?":
            if (last.length === 0) {
              repeatErr(i);
            }
            last.push({
              type: types_1.types.REPETITION,
              min: 0,
              max: 1,
              value: last.pop()
            });
            break;
          case "+":
            if (last.length === 0) {
              repeatErr(i);
            }
            last.push({
              type: types_1.types.REPETITION,
              min: 1,
              max: Infinity,
              value: last.pop()
            });
            break;
          case "*":
            if (last.length === 0) {
              repeatErr(i);
            }
            last.push({
              type: types_1.types.REPETITION,
              min: 0,
              max: Infinity,
              value: last.pop()
            });
            break;
          // Default is a character that is not `\[](){}?+*^$`.
          default:
            last.push({
              type: types_1.types.CHAR,
              value: c.charCodeAt(0)
            });
        }
      }
      if (groupStack.length !== 0) {
        throw new SyntaxError(`Invalid regular expression: /${regexpStr}/: Unterminated group`);
      }
      updateReferences(referenceQueue, groupCount);
      return start;
    };
    function updateReferences(referenceQueue, groupCount) {
      for (const elem of referenceQueue.reverse()) {
        if (groupCount < elem.reference.value) {
          elem.reference.type = types_1.types.CHAR;
          const valueString = elem.reference.value.toString();
          elem.reference.value = parseInt(valueString, 8);
          if (!/^[0-7]+$/.test(valueString)) {
            let i = 0;
            while (valueString[i] !== "8" && valueString[i] !== "9") {
              i += 1;
            }
            if (i === 0) {
              elem.reference.value = valueString.charCodeAt(0);
              i += 1;
            } else {
              elem.reference.value = parseInt(valueString.slice(0, i), 8);
            }
            if (valueString.length > i) {
              const tail = elem.stack.splice(elem.index + 1);
              for (const char of valueString.slice(i)) {
                elem.stack.push({
                  type: types_1.types.CHAR,
                  value: char.charCodeAt(0)
                });
              }
              elem.stack.push(...tail);
            }
          }
        }
      }
    }
  }
});

// ../../packages/core/node_modules/ret/dist/sets-lookup.js
var require_sets_lookup = __commonJS({
  "../../packages/core/node_modules/ret/dist/sets-lookup.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o2, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o2, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    }) : (function(o2, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o2[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o2, v) {
      Object.defineProperty(o2, "default", { enumerable: true, value: v });
    }) : function(o2, v) {
      o2["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NOTANYCHAR = exports.WHITESPACE = exports.WORDS = exports.INTS = void 0;
    var Sets = __importStar(require_sets());
    var types_1 = require_types2();
    function setToLookup(tokens) {
      let lookup = {};
      let len = 0;
      for (const token2 of tokens) {
        if (token2.type === types_1.types.CHAR) {
          lookup[token2.value] = true;
        }
        if (token2.type === types_1.types.RANGE) {
          lookup[`${token2.from}-${token2.to}`] = true;
        }
        len += 1;
      }
      return {
        lookup: () => Object.assign({}, lookup),
        len
      };
    }
    exports.INTS = setToLookup(Sets.ints().set);
    exports.WORDS = setToLookup(Sets.words().set);
    exports.WHITESPACE = setToLookup(Sets.whitespace().set);
    exports.NOTANYCHAR = setToLookup(Sets.anyChar().set);
  }
});

// ../../packages/core/node_modules/ret/dist/write-set-tokens.js
var require_write_set_tokens = __commonJS({
  "../../packages/core/node_modules/ret/dist/write-set-tokens.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o2, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o2, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    }) : (function(o2, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o2[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o2, v) {
      Object.defineProperty(o2, "default", { enumerable: true, value: v });
    }) : function(o2, v) {
      o2["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.writeSetTokens = exports.setChar = void 0;
    var types_1 = require_types2();
    var sets = __importStar(require_sets_lookup());
    function setChar(charCode) {
      return charCode === 94 ? "\\^" : charCode === 92 ? "\\\\" : charCode === 93 ? "\\]" : charCode === 45 ? "\\-" : String.fromCharCode(charCode);
    }
    exports.setChar = setChar;
    function isSameSet(set, { lookup, len }) {
      if (len !== set.length) {
        return false;
      }
      const map = lookup();
      for (const elem of set) {
        if (elem.type === types_1.types.SET) {
          return false;
        }
        const key = elem.type === types_1.types.CHAR ? elem.value : `${elem.from}-${elem.to}`;
        if (map[key]) {
          map[key] = false;
        } else {
          return false;
        }
      }
      return true;
    }
    function writeSetTokens(set, isNested = false) {
      if (isSameSet(set.set, sets.INTS)) {
        return set.not ? "\\D" : "\\d";
      }
      if (isSameSet(set.set, sets.WORDS)) {
        return set.not ? "\\W" : "\\w";
      }
      if (set.not && isSameSet(set.set, sets.NOTANYCHAR)) {
        return ".";
      }
      if (isSameSet(set.set, sets.WHITESPACE)) {
        return set.not ? "\\S" : "\\s";
      }
      let tokenString = "";
      for (let i = 0; i < set.set.length; i++) {
        const subset = set.set[i];
        tokenString += writeSetToken(subset);
      }
      const contents = `${set.not ? "^" : ""}${tokenString}`;
      return isNested ? contents : `[${contents}]`;
    }
    exports.writeSetTokens = writeSetTokens;
    function writeSetToken(set) {
      if (set.type === types_1.types.CHAR) {
        return setChar(set.value);
      } else if (set.type === types_1.types.RANGE) {
        return `${setChar(set.from)}-${setChar(set.to)}`;
      }
      return writeSetTokens(set, true);
    }
  }
});

// ../../packages/core/node_modules/ret/dist/reconstruct.js
var require_reconstruct = __commonJS({
  "../../packages/core/node_modules/ret/dist/reconstruct.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.reconstruct = void 0;
    var types_1 = require_types2();
    var write_set_tokens_1 = require_write_set_tokens();
    var reduceStack = (stack) => stack.map(exports.reconstruct).join("");
    var createAlternate = (token2) => {
      if ("options" in token2) {
        return token2.options.map(reduceStack).join("|");
      } else if ("stack" in token2) {
        return reduceStack(token2.stack);
      } else {
        throw new Error(`options or stack must be Root or Group token`);
      }
    };
    exports.reconstruct = (token2) => {
      switch (token2.type) {
        case types_1.types.ROOT:
          return createAlternate(token2);
        case types_1.types.CHAR: {
          const c = String.fromCharCode(token2.value);
          return (/[[\\{}$^.|?*+()]/.test(c) ? "\\" : "") + c;
        }
        case types_1.types.POSITION:
          if (token2.value === "^" || token2.value === "$") {
            return token2.value;
          } else {
            return `\\${token2.value}`;
          }
        case types_1.types.REFERENCE:
          return `\\${token2.value}`;
        case types_1.types.SET:
          return write_set_tokens_1.writeSetTokens(token2);
        case types_1.types.GROUP: {
          const prefix = token2.name ? `?<${token2.name}>` : token2.remember ? "" : token2.followedBy ? "?=" : token2.notFollowedBy ? "?!" : "?:";
          return `(${prefix}${createAlternate(token2)})`;
        }
        case types_1.types.REPETITION: {
          const { min, max } = token2;
          let endWith;
          if (min === 0 && max === 1) {
            endWith = "?";
          } else if (min === 1 && max === Infinity) {
            endWith = "+";
          } else if (min === 0 && max === Infinity) {
            endWith = "*";
          } else if (max === Infinity) {
            endWith = `{${min},}`;
          } else if (min === max) {
            endWith = `{${min}}`;
          } else {
            endWith = `{${min},${max}}`;
          }
          return `${exports.reconstruct(token2.value)}${endWith}`;
        }
        case types_1.types.RANGE:
          return `${write_set_tokens_1.setChar(token2.from)}-${write_set_tokens_1.setChar(token2.to)}`;
        default:
          throw new Error(`Invalid token type ${token2}`);
      }
    };
  }
});

// ../../packages/core/node_modules/ret/dist/index.js
var require_dist2 = __commonJS({
  "../../packages/core/node_modules/ret/dist/index.js"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o2, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o2, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    }) : (function(o2, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o2[k2] = m[k];
    }));
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.types = void 0;
    var types_1 = require_types2();
    Object.defineProperty(exports, "types", { enumerable: true, get: function() {
      return types_1.types;
    } });
    __exportStar(require_tokenizer(), exports);
    __exportStar(require_reconstruct(), exports);
    var tokenizer_1 = require_tokenizer();
    var reconstruct_1 = require_reconstruct();
    __exportStar(require_types2(), exports);
    exports.default = tokenizer_1.tokenizer;
    module.exports = tokenizer_1.tokenizer;
    module.exports.types = types_1.types;
    module.exports.reconstruct = reconstruct_1.reconstruct;
  }
});

// ../../packages/core/node_modules/safe-regex2/index.js
var require_safe_regex2 = __commonJS({
  "../../packages/core/node_modules/safe-regex2/index.js"(exports, module) {
    "use strict";
    var parse2 = require_dist2();
    var { types } = require_dist2();
    function walk2(node, opts, starHeight) {
      let i;
      let ok;
      let len;
      if (node.type === types.REPETITION) {
        starHeight++;
        opts.reps++;
        if (starHeight > 1) return false;
        if (opts.reps > opts.limit) return false;
      }
      const options = node.options || node.value?.options;
      if (options) {
        for (i = 0, len = options.length; i < len; i++) {
          ok = walk2({ stack: options[i] }, opts, starHeight);
          if (!ok) return false;
        }
      }
      const stack = node.stack || node.value?.stack;
      if (!stack) return true;
      for (i = 0, len = stack.length; i < len; i++) {
        ok = walk2(stack[i], opts, starHeight);
        if (!ok) return false;
      }
      return true;
    }
    function safeRegex2(re, options) {
      const opts = {
        reps: 0,
        limit: options?.limit ?? 25
      };
      if (isRegExp(re)) re = re.source;
      else if (typeof re !== "string") re = String(re);
      try {
        return walk2(parse2(re), opts, 0);
      } catch {
        return false;
      }
    }
    function isRegExp(x) {
      return Object.prototype.toString.call(x) === "[object RegExp]";
    }
    module.exports = safeRegex2;
    module.exports.default = safeRegex2;
    module.exports.safeRegex = safeRegex2;
  }
});

// ../../packages/core/node_modules/regjsparser/parser.js
var require_parser2 = __commonJS({
  "../../packages/core/node_modules/regjsparser/parser.js"(exports, module) {
    "use strict";
    (function() {
      var fromCodePoint = String.fromCodePoint || (function() {
        var stringFromCharCode = String.fromCharCode;
        var floor = Math.floor;
        return function fromCodePoint2() {
          var MAX_SIZE = 16384;
          var codeUnits = [];
          var highSurrogate;
          var lowSurrogate;
          var index = -1;
          var length = arguments.length;
          if (!length) {
            return "";
          }
          var result = "";
          while (++index < length) {
            var codePoint = Number(arguments[index]);
            if (!isFinite(codePoint) || // `NaN`, `+Infinity`, or `-Infinity`
            codePoint < 0 || // not a valid Unicode code point
            codePoint > 1114111 || // not a valid Unicode code point
            floor(codePoint) != codePoint) {
              throw RangeError("Invalid code point: " + codePoint);
            }
            if (codePoint <= 65535) {
              codeUnits.push(codePoint);
            } else {
              codePoint -= 65536;
              highSurrogate = (codePoint >> 10) + 55296;
              lowSurrogate = codePoint % 1024 + 56320;
              codeUnits.push(highSurrogate, lowSurrogate);
            }
            if (index + 1 == length || codeUnits.length > MAX_SIZE) {
              result += stringFromCharCode.apply(null, codeUnits);
              codeUnits.length = 0;
            }
          }
          return result;
        };
      })();
      function parse2(str, flags, features) {
        if (!features) {
          features = {};
        }
        function updateRawStart(node, start) {
          node.range[0] = start;
          node.raw = str.substring(start, node.range[1]);
          return node;
        }
        function createAnchor(kind, rawLength) {
          return {
            type: "anchor",
            kind,
            range: [
              pos - rawLength,
              pos
            ],
            raw: str.substring(pos - rawLength, pos)
          };
        }
        function createValue(kind, codePoint, from, to) {
          return {
            type: "value",
            kind,
            codePoint,
            range: [from, to],
            raw: str.substring(from, to)
          };
        }
        function createEscaped(kind, codePoint, value, fromOffset) {
          fromOffset = fromOffset || 0;
          return createValue(kind, codePoint, pos - (value.length + fromOffset), pos);
        }
        function createCharacter(matches) {
          var _char = matches[0];
          var first = _char.charCodeAt(0);
          if (isUnicodeMode) {
            var second;
            if (_char.length === 1 && first >= 55296 && first <= 56319) {
              second = lookahead().charCodeAt(0);
              if (second >= 56320 && second <= 57343) {
                pos++;
                return createValue(
                  "symbol",
                  (first - 55296) * 1024 + second - 56320 + 65536,
                  pos - 2,
                  pos
                );
              }
            }
          }
          return createValue("symbol", first, pos - 1, pos);
        }
        function createDisjunction(alternatives2, from, to) {
          return {
            type: "disjunction",
            body: alternatives2,
            range: [
              from,
              to
            ],
            raw: str.substring(from, to)
          };
        }
        function createDot() {
          return {
            type: "dot",
            range: [
              pos - 1,
              pos
            ],
            raw: "."
          };
        }
        function createCharacterClassEscape(value) {
          return {
            type: "characterClassEscape",
            value,
            range: [
              pos - 2,
              pos
            ],
            raw: str.substring(pos - 2, pos)
          };
        }
        function createReference(matchIndex) {
          var start = pos - 1 - matchIndex.length;
          return {
            type: "reference",
            matchIndex: parseInt(matchIndex, 10),
            range: [
              start,
              pos
            ],
            raw: str.substring(start, pos)
          };
        }
        function createNamedReference(name) {
          var start = name.range[0] - 3;
          return {
            type: "reference",
            name,
            range: [
              start,
              pos
            ],
            raw: str.substring(start, pos)
          };
        }
        function createGroup(behavior, disjunction, from, to) {
          return {
            type: "group",
            behavior,
            body: disjunction,
            range: [
              from,
              to
            ],
            raw: str.substring(from, to)
          };
        }
        function createQuantifier(min, max, from, to, symbol) {
          if (to == null) {
            from = pos - 1;
            to = pos;
          }
          return {
            type: "quantifier",
            min,
            max,
            greedy: true,
            body: null,
            // set later on
            symbol,
            range: [
              from,
              to
            ],
            raw: str.substring(from, to)
          };
        }
        function createAlternative(terms, from, to) {
          return {
            type: "alternative",
            body: terms,
            range: [
              from,
              to
            ],
            raw: str.substring(from, to)
          };
        }
        function createCharacterClass(contents, negative, from, to) {
          return {
            type: "characterClass",
            kind: contents.kind,
            body: contents.body,
            negative,
            range: [
              from,
              to
            ],
            raw: str.substring(from, to)
          };
        }
        function createClassRange(min, max, from, to) {
          if (min.codePoint > max.codePoint) {
            bail("invalid range in character class", min.raw + "-" + max.raw, from, to);
          }
          return {
            type: "characterClassRange",
            min,
            max,
            range: [
              from,
              to
            ],
            raw: str.substring(from, to)
          };
        }
        function createClassStrings(strings2, from, to) {
          return {
            type: "classStrings",
            strings: strings2,
            range: [from, to],
            raw: str.substring(from, to)
          };
        }
        function createClassString(characters, from, to) {
          return {
            type: "classString",
            characters,
            range: [from, to],
            raw: str.substring(from, to)
          };
        }
        function flattenBody(body) {
          if (body.type === "alternative") {
            return body.body;
          } else {
            return [body];
          }
        }
        function incr(amount) {
          amount = amount || 1;
          pos += amount;
        }
        function consume(amount) {
          var res = str.substring(pos, pos += amount);
          return res;
        }
        function skip(value) {
          if (!match(value)) {
            bail("character", value);
          }
        }
        function match(value) {
          var len = value.length;
          if (str.substring(pos, pos + len) === value) {
            incr(len);
            return value;
          }
        }
        function matchOne(value) {
          if (str[pos] === value) {
            pos++;
            return value;
          }
        }
        function lookahead() {
          return str[pos];
        }
        function currentOne(value) {
          return str[pos] === value;
        }
        function current(value) {
          var len = value.length;
          return str.substring(pos, pos + len) === value;
        }
        function next(value) {
          return str[pos + 1] === value;
        }
        function matchReg(regExp) {
          var subStr = str.substring(pos);
          var res = subStr.match(regExp);
          if (res) {
            pos += res[0].length;
          }
          return res;
        }
        function parseDisjunction() {
          var res = [], from = pos;
          res.push(parseAlternative());
          while (matchOne("|")) {
            res.push(parseAlternative());
          }
          if (res.length === 1) {
            return res[0];
          }
          return createDisjunction(res, from, pos);
        }
        function parseAlternative() {
          var res = [], from = pos;
          var term;
          while (term = parseTerm()) {
            res.push(term);
          }
          if (res.length === 1) {
            return res[0];
          }
          return createAlternative(res, from, pos);
        }
        function parseTerm() {
          if (pos >= str.length || currentOne("|") || currentOne(")")) {
            return null;
          }
          var assertion = parseAssertion();
          var quantifier;
          if (assertion) {
            var pos_backup = pos;
            quantifier = parseQuantifier() || false;
            if (quantifier) {
              if (!isUnicodeMode && assertion.type === "group") {
                quantifier.body = flattenBody(assertion);
                updateRawStart(quantifier, assertion.range[0]);
                return quantifier;
              }
              pos = pos_backup;
              bail("Expected atom");
            }
            return assertion;
          }
          var atom2 = parseAtomAndExtendedAtom();
          if (!atom2) {
            pos_backup = pos;
            quantifier = parseQuantifier() || false;
            if (quantifier) {
              pos = pos_backup;
              bail("Expected atom");
            }
            if (!isUnicodeMode && matchOne("{")) {
              atom2 = createCharacter("{");
            } else {
              bail("Expected atom");
            }
          }
          quantifier = parseQuantifier() || false;
          if (quantifier) {
            var type = atom2.type, behavior = atom2.behavior;
            if (type === "group" && (behavior === "negativeLookbehind" || behavior === "lookbehind")) {
              bail(
                "Invalid quantifier",
                "",
                quantifier.range[0],
                quantifier.range[1]
              );
            }
            quantifier.body = flattenBody(atom2);
            updateRawStart(quantifier, atom2.range[0]);
            return quantifier;
          }
          return atom2;
        }
        function parseGroup(matchA, typeA, matchB, typeB) {
          var type, from = pos;
          if (match(matchA)) {
            type = typeA;
          } else if (match(matchB)) {
            type = typeB;
          } else {
            return false;
          }
          return finishGroup(type, from);
        }
        function finishGroup(type, from) {
          var body = parseDisjunction();
          if (!body) {
            bail("Expected disjunction");
          }
          skip(")");
          var group = createGroup(type, flattenBody(body), from, pos);
          if (type == "normal") {
            if (firstIteration) {
              closedCaptureCounter++;
            }
          }
          return group;
        }
        function parseAssertion() {
          switch (lookahead()) {
            case "^":
              incr();
              return createAnchor(
                "start",
                1
                /* rawLength */
              );
            case "$":
              incr();
              return createAnchor(
                "end",
                1
                /* rawLength */
              );
            case "\\": {
              if (next("b")) {
                incr(2);
                return createAnchor(
                  "boundary",
                  2
                  /* rawLength */
                );
              } else if (next("B")) {
                incr(2);
                return createAnchor(
                  "not-boundary",
                  2
                  /* rawLength */
                );
              }
              break;
            }
            case "(":
              return parseGroup("(?=", "lookahead", "(?!", "negativeLookahead");
            default:
              return;
          }
        }
        function parseQuantifier() {
          var res, from = pos;
          var quantifier;
          var min, max;
          switch (lookahead()) {
            case "*":
              incr();
              quantifier = createQuantifier(0, void 0, void 0, void 0, "*");
              break;
            case "+":
              incr();
              quantifier = createQuantifier(1, void 0, void 0, void 0, "+");
              break;
            case "?":
              incr();
              quantifier = createQuantifier(0, 1, void 0, void 0, "?");
              break;
            case "{": {
              if (res = matchReg(/^\{(\d+)\}/)) {
                min = parseInt(res[1], 10);
                quantifier = createQuantifier(min, min, from, pos);
              } else if (res = matchReg(/^\{(\d+),\}/)) {
                min = parseInt(res[1], 10);
                quantifier = createQuantifier(min, void 0, from, pos);
              } else if (res = matchReg(/^\{(\d+),(\d+)\}/)) {
                min = parseInt(res[1], 10);
                max = parseInt(res[2], 10);
                if (min > max) {
                  bail("numbers out of order in {} quantifier", "", from, pos);
                }
                quantifier = createQuantifier(min, max, from, pos);
              }
              if (min && !Number.isSafeInteger(min) || max && !Number.isSafeInteger(max)) {
                bail("iterations outside JS safe integer range in quantifier", "", from, pos);
              }
            }
          }
          if (quantifier) {
            if (matchOne("?")) {
              quantifier.greedy = false;
              quantifier.range[1] += 1;
            }
          }
          return quantifier;
        }
        function parseAtomAndExtendedAtom() {
          var res;
          switch (res = lookahead()) {
            case ".":
              incr();
              return createDot();
            case "\\": {
              incr();
              res = parseAtomEscape();
              if (!res) {
                if (!isUnicodeMode && lookahead() == "c") {
                  return createValue("symbol", 92, pos - 1, pos);
                }
                bail("atomEscape");
              }
              return res;
            }
            case "[":
              return parseCharacterClass();
            case "(": {
              if (features.lookbehind && (res = parseGroup("(?<=", "lookbehind", "(?<!", "negativeLookbehind"))) {
                return res;
              } else if (features.namedGroups && match("(?<")) {
                var name = parseIdentifier();
                skip(">");
                var group = finishGroup("normal", name.range[0] - 3);
                group.name = name;
                return group;
              } else if (features.modifiers && current("(?") && str[pos + 2] != ":") {
                return parseModifiersGroup();
              } else {
                return parseGroup("(?:", "ignore", "(", "normal");
              }
            }
            case "]":
            case "}":
              if (!isUnicodeMode) {
                incr();
                return createCharacter(res);
              }
              break;
            case "^":
            case "$":
            case "*":
            case "+":
            case "?":
            case "{":
            case ")":
            case "|":
              break;
            default:
              incr();
              return createCharacter(res);
          }
        }
        function parseModifiersGroup() {
          function hasDupChar(str2) {
            var i = 0;
            while (i < str2.length) {
              if (str2.indexOf(str2[i], i + 1) != -1) {
                return true;
              }
              i++;
            }
            return false;
          }
          var from = pos;
          incr(2);
          var enablingFlags = matchReg(/^[sim]+/);
          var disablingFlags;
          if (matchOne("-") && lookahead() !== ":") {
            disablingFlags = matchReg(/^[sim]+/);
            if (!disablingFlags) {
              bail("Invalid flags for modifiers group");
            }
          } else if (!enablingFlags) {
            bail("Invalid flags for modifiers group");
          }
          enablingFlags = enablingFlags ? enablingFlags[0] : "";
          disablingFlags = disablingFlags ? disablingFlags[0] : "";
          var flags2 = enablingFlags + disablingFlags;
          if (flags2.length > 3 || hasDupChar(flags2)) {
            bail("flags cannot be duplicated for modifiers group");
          }
          if (!matchOne(":")) {
            bail("Invalid flags for modifiers group");
          }
          var modifiersGroup = finishGroup("ignore", from);
          modifiersGroup.modifierFlags = {
            enabling: enablingFlags,
            disabling: disablingFlags
          };
          return modifiersGroup;
        }
        function parseUnicodeSurrogatePairEscape(firstEscape, isUnicodeMode2) {
          if (isUnicodeMode2) {
            var first, second;
            if (firstEscape.kind == "unicodeEscape" && (first = firstEscape.codePoint) >= 55296 && first <= 56319 && currentOne("\\") && next("u")) {
              var prevPos = pos;
              pos++;
              var secondEscape = parseClassEscape();
              if (secondEscape.kind == "unicodeEscape" && (second = secondEscape.codePoint) >= 56320 && second <= 57343) {
                firstEscape.kind = "unicodeCodePointEscape";
                firstEscape.codePoint = (first - 55296) * 1024 + second - 56320 + 65536;
                firstEscape.range[1] = pos;
                firstEscape.raw = str.substring(firstEscape.range[0], pos);
              } else {
                pos = prevPos;
              }
            }
          }
          return firstEscape;
        }
        function parseClassEscape() {
          return parseAtomEscape(true);
        }
        function parseAtomEscape(insideCharacterClass) {
          var res, from = pos, ch;
          switch (ch = lookahead()) {
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
              return parseDecimalEscape(insideCharacterClass);
            case "B": {
              if (insideCharacterClass) {
                bail("\\B not possible inside of CharacterClass", "", from);
                break;
              } else {
                return parseIdentityEscape();
              }
            }
            case "b": {
              if (insideCharacterClass) {
                incr();
                return createEscaped("singleEscape", 8, "\\b");
              } else {
                return parseIdentityEscape();
              }
            }
            case "c": {
              if (insideCharacterClass) {
                if (!isUnicodeMode && (res = matchReg(/^c(\d)/))) {
                  return createEscaped("controlLetter", res[1].charCodeAt(0) % 32, res[1], 2);
                } else if (!isUnicodeMode && match("c_")) {
                  return createEscaped("controlLetter", 31, "_", 2);
                }
              }
              return parseCharacterEscape();
            }
            // CharacterClassEscape ::
            //      d
            //      D
            //      s
            //      S
            //      w
            //      W
            case "d":
            case "D":
            case "w":
            case "W":
            case "s":
            case "S":
              incr();
              return createCharacterClassEscape(ch);
            case "k":
              return parseNamedReference() || parseIdentityEscape();
            case "p":
            case "P":
              return parseUnicodePropertyEscape() || parseIdentityEscape();
            case "-": {
              if (insideCharacterClass && isUnicodeMode) {
                incr();
                return createEscaped("singleEscape", 45, "\\-");
              }
              return parseIdentityEscape();
            }
            default:
              return parseCharacterEscape();
          }
        }
        function parseDecimalEscape(insideCharacterClass) {
          var res, match2, from = pos;
          if (res = matchReg(/^(?!0)\d+/)) {
            match2 = res[0];
            var refIdx = parseInt(match2, 10);
            if (refIdx <= closedCaptureCounter && !insideCharacterClass) {
              return createReference(match2);
            } else {
              backrefDenied.push(refIdx);
              if (firstIteration) {
                shouldReparse = true;
              } else {
                bailOctalEscapeIfUnicode(from, pos);
              }
              incr(-match2.length);
              if (res = matchReg(/^[0-7]{1,3}/)) {
                return createEscaped("octal", parseInt(res[0], 8), res[0], 1);
              } else {
                var start = pos;
                res = createCharacter(matchReg(/^[89]/));
                return updateRawStart(res, start - 1);
              }
            }
          } else if (res = matchReg(/^[0-7]{1,3}/)) {
            match2 = res[0];
            if (match2 !== "0" || /\d/.test(lookahead())) {
              bailOctalEscapeIfUnicode(from, pos);
            }
            if (/^0{1,3}$/.test(match2)) {
              return createEscaped("null", 0, "0", match2.length);
            } else {
              return createEscaped("octal", parseInt(match2, 8), match2, 1);
            }
          }
          return false;
        }
        function bailOctalEscapeIfUnicode(from, pos2) {
          if (isUnicodeMode) {
            bail("Invalid decimal escape in unicode mode", null, from, pos2);
          }
        }
        function parseUnicodePropertyEscape() {
          var res, from = pos;
          if (features.unicodePropertyEscape && isUnicodeMode && (res = matchReg(/^([pP])\{([^}]+)\}/))) {
            return {
              type: "unicodePropertyEscape",
              negative: res[1] === "P",
              value: res[2],
              range: [from - 1, pos],
              raw: str.substring(from - 1, pos)
            };
          }
          return false;
        }
        function parseNamedReference() {
          if (features.namedGroups && matchReg(/^k<(?=.*?>)/)) {
            var name = parseIdentifier();
            skip(">");
            return createNamedReference(name);
          }
        }
        function parseRegExpUnicodeEscapeSequence(isUnicodeMode2) {
          var res;
          if (res = matchReg(/^u([0-9a-fA-F]{4})/)) {
            return parseUnicodeSurrogatePairEscape(
              createEscaped("unicodeEscape", parseInt(res[1], 16), res[1], 2),
              isUnicodeMode2
            );
          } else if (isUnicodeMode2 && (res = matchReg(/^u\{([0-9a-fA-F]+)\}/))) {
            return createEscaped("unicodeCodePointEscape", parseInt(res[1], 16), res[1], 4);
          }
        }
        function parseCharacterEscape() {
          var res;
          var from = pos;
          switch (lookahead()) {
            case "t":
              incr();
              return createEscaped("singleEscape", 9, "\\t");
            case "n":
              incr();
              return createEscaped("singleEscape", 10, "\\n");
            case "v":
              incr();
              return createEscaped("singleEscape", 11, "\\v");
            case "f":
              incr();
              return createEscaped("singleEscape", 12, "\\f");
            case "r":
              incr();
              return createEscaped("singleEscape", 13, "\\r");
            case "c":
              if (res = matchReg(/^c([a-zA-Z])/)) {
                return createEscaped("controlLetter", res[1].charCodeAt(0) % 32, res[1], 2);
              }
              break;
            case "0":
              if (matchReg(/^0(?!\d)/)) {
                return createEscaped("null", 0, "0", 1);
              }
              break;
            case "x":
              if (res = matchReg(/^x([0-9a-fA-F]{2})/)) {
                return createEscaped("hexadecimalEscape", parseInt(res[1], 16), res[1], 2);
              }
              break;
            case "u":
              if (res = parseRegExpUnicodeEscapeSequence(isUnicodeMode)) {
                if (!res || res.codePoint > 1114111) {
                  bail("Invalid escape sequence", null, from, pos);
                }
                return res;
              }
              break;
          }
          return parseIdentityEscape();
        }
        function parseIdentifierAtom(check) {
          var ch = lookahead();
          var from = pos;
          if (ch === "\\") {
            incr();
            var esc = parseRegExpUnicodeEscapeSequence(true);
            if (!esc || !check(esc.codePoint)) {
              bail("Invalid escape sequence", null, from, pos);
            }
            return fromCodePoint(esc.codePoint);
          }
          var code = ch.charCodeAt(0);
          if (code >= 55296 && code <= 56319) {
            ch += str[pos + 1];
            var second = ch.charCodeAt(1);
            if (second >= 56320 && second <= 57343) {
              code = (code - 55296) * 1024 + second - 56320 + 65536;
            }
          }
          if (!check(code)) return;
          incr();
          if (code > 65535) incr();
          return ch;
        }
        function parseIdentifier() {
          var start = pos;
          var res = parseIdentifierAtom(isIdentifierStart);
          if (!res) {
            bail("Invalid identifier");
          }
          var ch;
          while (ch = parseIdentifierAtom(isIdentifierPart)) {
            res += ch;
          }
          return {
            type: "identifier",
            value: res,
            range: [start, pos],
            raw: str.substring(start, pos)
          };
        }
        function isIdentifierStart(ch) {
          var NonAsciiIdentifierStart = /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0558\u0559\u0560-\u0588\u058B\u058C\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088F\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5C\u0C5D\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDC-\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C8A\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u208F-\u209F\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7DD\uA7E2\uA7F1-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB6C\uAB6D\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC\uDDC0-\uDDF3\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBF]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD40-\uDD59\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDD00-\uDD23\uDD4A-\uDD65\uDD6F-\uDD85\uDE80-\uDEA9\uDEB0\uDEB1\uDEC2-\uDEC7\uDED9-\uDEEE\uDF00-\uDF1C\uDF27\uDF30-\uDF45\uDF70-\uDF81\uDFB0-\uDFC4\uDFE0-\uDFF6]|\uD804[\uDC03-\uDC37\uDC71\uDC72\uDC75\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD44\uDD47\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE3F\uDE40\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61\uDF80-\uDF89\uDF8B\uDF8E\uDF90-\uDFB5\uDFB7\uDFD1\uDFD3]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC5F-\uDC61\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDEB8\uDF00-\uDF1A\uDF40-\uDF46]|\uD806[\uDC00-\uDC2B\uDCA0-\uDCDF\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDD3F\uDD41\uDDA0-\uDDA7\uDDAA-\uDDD0\uDDE1\uDDE3\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE89\uDE9D\uDEB0-\uDEF8\uDF0A\uDFC0-\uDFE0]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDDB0-\uDDDB\uDDF1\uDEE0-\uDEF2\uDF02\uDF04-\uDF10\uDF12-\uDF33\uDFB0]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6F\uDC75-\uDD43\uDD50-\uDE86]|\uD80B[\uDF90-\uDFF0]|[\uD80C\uD80E\uD80F\uD81C-\uD822\uD840-\uD868\uD86A-\uD86D\uD86F-\uD872\uD874-\uD879\uD880-\uD883\uD885-\uD88C\uD8B4-\uD8BE][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2F\uDC41-\uDC46\uDC60-\uDFFF]|\uD810[\uDC00-\uDFFA]|\uD811[\uDC00-\uDE46]|\uD818[\uDD00-\uDD1D]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE70-\uDEBE\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDD40-\uDD6C\uDE40-\uDE7F\uDEA0-\uDEB8\uDEBB-\uDED3\uDF00-\uDF4A\uDF50\uDF93-\uDF9F\uDFE0\uDFE1\uDFE3\uDFF2-\uDFF6]|\uD823[\uDC00-\uDCDA\uDCFF-\uDD20\uDD80-\uDDF2\uDE00-\uDFFF]|\uD824[\uDC00-\uDD91\uDDA0-\uDDD2]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00-\uDD28\uDD32\uDD50-\uDD52\uDD55\uDD64-\uDD68\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA6\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD837[\uDF00-\uDF81\uDF90-\uDF96\uDFCD-\uDFFF]|\uD838[\uDC30-\uDC6D\uDD00-\uDD2C\uDD37-\uDD3D\uDD4E\uDE90-\uDEAD\uDEC0-\uDEEB]|\uD839[\uDCD0-\uDCEB\uDDD0-\uDDED\uDDF0\uDEC0-\uDEDE\uDEE0-\uDEE2\uDEE4\uDEE5\uDEE7-\uDEED\uDEF0-\uDEF4\uDEFE\uDEFF\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43\uDD4B]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86E[\uDC00-\uDC1E\uDC20-\uDFFF]|\uD873[\uDC00-\uDEAD\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0\uDFF0-\uDFFF]|\uD87B[\uDC00-\uDE5D]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A\uDF50-\uDFFF]|\uD88D[\uDC00-\uDC79]|\uD8BF[\uDC00-\uDC3F]/;
          return ch === 36 || ch === 95 || // $ (dollar) and _ (underscore)
          ch >= 65 && ch <= 90 || // A..Z
          ch >= 97 && ch <= 122 || // a..z
          ch >= 128 && NonAsciiIdentifierStart.test(fromCodePoint(ch));
        }
        function isIdentifierPart(ch) {
          var NonAsciiIdentifierPartOnly = /[\xB7\u0300-\u036F\u0387\u0483-\u0487\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7-\u05C9\u0610-\u061A\u064B-\u0669\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u06F0-\u06F9\u0711\u0730-\u074A\u07A6-\u07B0\u07C0-\u07C9\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u0897-\u089F\u08CA-\u08E1\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0966-\u096F\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u09E6-\u09EF\u09FE\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A66-\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0AE6-\u0AEF\u0AFA-\u0AFF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B53-\u0B57\u0B62\u0B63\u0B66-\u0B6F\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0BE6-\u0BEF\u0C00-\u0C04\u0C3C\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0CE6-\u0CEF\u0CF3\u0D00-\u0D03\u0D3B\u0D3C\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D66-\u0D6F\u0D81-\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0E50-\u0E59\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECE\u0ED0-\u0ED9\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1040-\u1049\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F-\u109D\u135D-\u135F\u1369-\u1371\u1712-\u1715\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u17E0-\u17E9\u180B-\u180D\u180F-\u1819\u18A9\u1920-\u192B\u1930-\u193B\u1946-\u194F\u19D0-\u19DA\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AB0-\u1ABD\u1ABF-\u1AF0\u1B00-\u1B04\u1B34-\u1B44\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BB0-\u1BB9\u1BE6-\u1BF3\u1C24-\u1C37\u1C40-\u1C49\u1C50-\u1C59\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF4\u1CF7-\u1CF9\u1DC0-\u1DFF\u200C\u200D\u203F\u2040\u2054\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\u30FB\uA620-\uA629\uA66F\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA82C\uA880\uA881\uA8B4-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F1\uA8FF-\uA909\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9D0-\uA9D9\uA9E5\uA9F0-\uA9F9\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA50-\uAA59\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uABF0-\uABF9\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFF10-\uFF19\uFF3F\uFF65]|\uD800[\uDDFD\uDEE0\uDF76-\uDF7A]|\uD801[\uDCA0-\uDCA9]|\uD802[\uDE01-\uDE03\uDE05\uDE06\uDE0C-\uDE0F\uDE38-\uDE3A\uDE3F\uDEE5\uDEE6]|\uD803[\uDD24-\uDD27\uDD30-\uDD39\uDD40-\uDD49\uDD69-\uDD6D\uDEAB\uDEAC\uDECB-\uDECF\uDEF0-\uDEFF\uDF46-\uDF50\uDF82-\uDF85]|\uD804[\uDC00-\uDC02\uDC38-\uDC46\uDC66-\uDC70\uDC73\uDC74\uDC7F-\uDC82\uDCB0-\uDCBA\uDCC2\uDCF0-\uDCF9\uDD00-\uDD02\uDD27-\uDD34\uDD36-\uDD3F\uDD45\uDD46\uDD73\uDD80-\uDD82\uDDB3-\uDDC0\uDDC9-\uDDCC\uDDCE-\uDDD9\uDE2C-\uDE37\uDE3E\uDE41\uDEDF-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF3B\uDF3C\uDF3E-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF57\uDF62\uDF63\uDF66-\uDF6C\uDF70-\uDF74\uDFB8-\uDFC0\uDFC2\uDFC5\uDFC7-\uDFCA\uDFCC-\uDFD0\uDFD2\uDFE1\uDFE2]|\uD805[\uDC35-\uDC46\uDC50-\uDC59\uDC5E\uDCB0-\uDCC3\uDCD0-\uDCD9\uDDAF-\uDDB5\uDDB8-\uDDC0\uDDDC\uDDDD\uDE30-\uDE40\uDE50-\uDE59\uDEAB-\uDEB7\uDEC0-\uDEC9\uDED0-\uDEE3\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDC2C-\uDC3A\uDCE0-\uDCE9\uDD30-\uDD35\uDD37\uDD38\uDD3B-\uDD3E\uDD40\uDD42\uDD43\uDD50-\uDD59\uDDD1-\uDDD7\uDDDA-\uDDE0\uDDE4\uDE01-\uDE0A\uDE33-\uDE39\uDE3B-\uDE3E\uDE47\uDE51-\uDE5B\uDE8A-\uDE99\uDF60-\uDF67\uDFF0-\uDFF9]|\uD807[\uDC2F-\uDC36\uDC38-\uDC3F\uDC50-\uDC59\uDC92-\uDCA7\uDCA9-\uDCB6\uDD31-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD45\uDD47\uDD50-\uDD59\uDD8A-\uDD8E\uDD90\uDD91\uDD93-\uDD97\uDDA0-\uDDA9\uDDE0-\uDDE9\uDDF0\uDEF3-\uDEF6\uDF00\uDF01\uDF03\uDF34-\uDF3A\uDF3E-\uDF42\uDF50-\uDF5A]|\uD80D[\uDC40\uDC47-\uDC55]|\uD818[\uDD1E-\uDD39]|\uD81A[\uDE60-\uDE69\uDEC0-\uDEC9\uDEF0-\uDEF4\uDF30-\uDF36\uDF50-\uDF59]|\uD81B[\uDD70-\uDD79\uDF4F\uDF51-\uDF87\uDF8F-\uDF92\uDFE4\uDFF0\uDFF1]|\uD82F[\uDC9D\uDC9E]|\uD833[\uDCF0-\uDCF9\uDF00-\uDF2D\uDF30-\uDF46]|\uD834[\uDD27\uDD28\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44\uDE50-\uDE52\uDE5B\uDE5C\uDE5F\uDE80\uDE81]|\uD835[\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A\uDC8F\uDD30-\uDD36\uDD40-\uDD49\uDEAE\uDEEC-\uDEF9]|\uD839[\uDCEC-\uDCF9\uDDEE\uDDEF\uDDF1-\uDDFA\uDEE3\uDEE6\uDEEE\uDEEF\uDEF5]|\uD83A[\uDCD0-\uDCD6\uDD44-\uDD4A\uDD50-\uDD59]|\uD83E[\uDFF0-\uDFF9]|\uDB40[\uDD00-\uDDEF]/;
          return isIdentifierStart(ch) || ch >= 48 && ch <= 57 || // 0..9
          ch >= 128 && NonAsciiIdentifierPartOnly.test(fromCodePoint(ch));
        }
        function parseIdentityEscape() {
          var tmp;
          var l = lookahead();
          if (isUnicodeMode && /[\^$.*+?()\\[\]{}|/]/.test(l) || !isUnicodeMode && l !== "c") {
            if (l === "k" && features.lookbehind) {
              return null;
            }
            tmp = consume(1);
            return createEscaped("identifier", tmp.charCodeAt(0), tmp, 1);
          }
          return null;
        }
        function parseCharacterClass() {
          var res, from = pos;
          if (match("[^")) {
            res = parseClassContents();
            skip("]");
            return createCharacterClass(res, true, from, pos);
          } else if (matchOne("[")) {
            res = parseClassContents();
            skip("]");
            return createCharacterClass(res, false, from, pos);
          }
          return null;
        }
        function parseClassContents() {
          var res;
          if (currentOne("]")) {
            return { kind: "union", body: [] };
          } else if (hasUnicodeSetFlag) {
            return parseClassSetExpression();
          } else {
            res = parseNonemptyClassRanges();
            if (!res) {
              bail("nonEmptyClassRanges");
            }
            return { kind: "union", body: res };
          }
        }
        function parseNonemptyClassRanges() {
          var contents = [], rangeIndexes = [];
          var atom2, atomTo, dash, range, i, j;
          do {
            atom2 = parseClassAtom();
            if (!atom2) {
              bail("classAtom");
            }
            if (currentOne("-") && !next("]")) {
              incr();
              dash = createCharacter("-");
              atomTo = parseClassAtom();
              if (!atomTo) {
                bail("classAtom");
              }
              rangeIndexes.push(contents.length);
              contents.push({ atom: atom2, dash, atomTo, from: atom2.range[0], to: pos });
            } else {
              contents.push(atom2);
            }
          } while (!currentOne("]"));
          for (i = rangeIndexes.length - 1; i >= 0; i--) {
            range = contents[rangeIndexes[i]];
            if (!("codePoint" in range.atom) || !("codePoint" in range.atomTo)) {
              if (!isUnicodeMode) {
                contents[rangeIndexes[i]] = [range.atom, range.dash, range.atomTo];
              } else {
                bail("invalid character class");
              }
            } else {
              contents[rangeIndexes[i]] = createClassRange(range.atom, range.atomTo, range.from, range.to);
            }
          }
          var res = [];
          for (i = 0; i < contents.length; i++) {
            var contentsItem = contents[i];
            if (Array.isArray(contentsItem)) {
              for (j = 0; j < contentsItem.length; j++) {
                res.push(contentsItem[j]);
              }
            } else {
              res.push(contentsItem);
            }
          }
          return res;
        }
        function parseClassAtom() {
          if (matchOne("-")) {
            return createCharacter("-");
          } else {
            return parseClassAtomNoDash();
          }
        }
        function parseClassAtomNoDash() {
          var res;
          switch (res = lookahead()) {
            case "\\": {
              incr();
              res = parseClassEscape();
              if (!res) {
                if (!isUnicodeMode && lookahead() == "c") {
                  return createCharacter("\\");
                }
                bail("classEscape");
              }
              return parseUnicodeSurrogatePairEscape(res, isUnicodeMode);
            }
            case "]":
            case "-":
              break;
            default:
              incr();
              return createCharacter(res);
          }
        }
        function parseClassSetExpression() {
          var body = [];
          var kind;
          var operand = parseClassSetOperand(
            /* allowRanges*/
            true
          );
          body.push(operand);
          if (operand.type === "characterClassRange") {
            kind = "union";
          } else if (currentOne("&")) {
            kind = "intersection";
          } else if (currentOne("-")) {
            kind = "subtraction";
          } else {
            kind = "union";
          }
          while (!currentOne("]")) {
            if (kind === "intersection") {
              skip("&");
              skip("&");
              if (currentOne("&")) {
                bail("&& cannot be followed by &. Wrap it in brackets: &&[&].");
              }
            } else if (kind === "subtraction") {
              skip("-");
              skip("-");
            }
            operand = parseClassSetOperand(
              /* allowRanges*/
              kind === "union"
            );
            body.push(operand);
          }
          return { kind, body };
        }
        function parseClassSetOperand(allowRanges) {
          var from = pos;
          var start, res;
          if (matchOne("\\")) {
            if (match("q{")) {
              return parseClassStringDisjunction();
            } else if (res = parseClassEscape()) {
              start = res;
            } else if (res = parseClassSetCharacterEscapedHelper()) {
              return res;
            } else {
              bail("Invalid escape", "\\" + lookahead(), from);
            }
          } else if (res = parseClassSetCharacterUnescapedHelper()) {
            start = res;
          } else if (res = parseCharacterClass()) {
            return res;
          } else {
            bail("Invalid character", lookahead());
          }
          if (allowRanges && currentOne("-") && !next("-")) {
            incr();
            if (res = parseClassSetCharacter()) {
              return createClassRange(start, res, from, pos);
            }
            bail("Invalid range end", lookahead());
          }
          return start;
        }
        function parseClassSetCharacter() {
          if (matchOne("\\")) {
            var res, from = pos;
            if (res = parseClassSetCharacterEscapedHelper()) {
              return res;
            } else {
              bail("Invalid escape", "\\" + lookahead(), from);
            }
          }
          return parseClassSetCharacterUnescapedHelper();
        }
        function parseClassSetCharacterUnescapedHelper() {
          var res;
          if (matchReg(/^(?:&&|!!|##|\$\$|%%|\*\*|\+\+|,,|\.\.|::|;;|<<|==|>>|\?\?|@@|\^\^|``|~~)/)) {
            bail("Invalid set operation in character class");
          }
          if (res = matchReg(/^[^()[\]{}/\-\\|]/)) {
            return createCharacter(res);
          }
        }
        function parseClassSetCharacterEscapedHelper() {
          var res;
          if (matchOne("b")) {
            return createEscaped("singleEscape", 8, "\\b");
          } else if (matchOne("B")) {
            bail("\\B not possible inside of ClassContents", "", pos - 2);
          } else if (res = matchReg(/^[&\-!#%,:;<=>@`~]/)) {
            return createEscaped("identifier", res[0].codePointAt(0), res[0]);
          } else if (res = parseCharacterEscape()) {
            return res;
          } else {
            return null;
          }
        }
        function parseClassStringDisjunction() {
          var from = pos - 3;
          var res = [];
          do {
            res.push(parseClassString());
          } while (matchOne("|"));
          skip("}");
          return createClassStrings(res, from, pos);
        }
        function parseClassString() {
          var res = [], from = pos;
          var char;
          while (char = parseClassSetCharacter()) {
            res.push(char);
          }
          return createClassString(res, from, pos);
        }
        function bail(message, details, from, to) {
          from = from == null ? pos : from;
          to = to == null ? from : to;
          var contextStart = Math.max(0, from - 10);
          var contextEnd = Math.min(to + 10, str.length);
          var context = "    " + str.substring(contextStart, contextEnd);
          var pointer = "    " + new Array(from - contextStart + 1).join(" ") + "^";
          throw SyntaxError(message + " at position " + from + (details ? ": " + details : "") + "\n" + context + "\n" + pointer);
        }
        var backrefDenied = [];
        var closedCaptureCounter = 0;
        var firstIteration = true;
        var shouldReparse = false;
        var hasUnicodeFlag = (flags || "").indexOf("u") !== -1;
        var hasUnicodeSetFlag = (flags || "").indexOf("v") !== -1;
        var isUnicodeMode = hasUnicodeFlag || hasUnicodeSetFlag;
        var pos = 0;
        if (hasUnicodeSetFlag && !features.unicodeSet) {
          throw new Error('The "v" flag is only supported when the .unicodeSet option is enabled.');
        }
        if (hasUnicodeFlag && hasUnicodeSetFlag) {
          throw new Error('The "u" and "v" flags are mutually exclusive.');
        }
        str = String(str);
        if (str === "") {
          str = "(?:)";
        }
        var result = parseDisjunction();
        if (result.range[1] !== str.length) {
          bail("Could not parse entire input - got stuck", "", result.range[1]);
        }
        shouldReparse = shouldReparse || backrefDenied.some(function(ref) {
          return ref <= closedCaptureCounter;
        });
        if (shouldReparse) {
          pos = 0;
          firstIteration = false;
          return parseDisjunction();
        }
        return result;
      }
      var regjsparser2 = {
        parse: parse2
      };
      if (typeof module !== "undefined" && module.exports) {
        module.exports = regjsparser2;
      } else {
        window.regjsparser = regjsparser2;
      }
    })();
  }
});

// src/cli.ts
import { readFile as readFile2 } from "node:fs/promises";
import path2 from "node:path";
import { parseArgs } from "node:util";

// ../../app/src/data/attack-enterprise.json
var attack_enterprise_default = { version: "19.1", fetched: "2026-10-12", tactics: [{ id: "TA0043", name: "Reconnaissance", short: "reconnaissance" }, { id: "TA0042", name: "Resource Development", short: "resource-development" }, { id: "TA0001", name: "Initial Access", short: "initial-access" }, { id: "TA0002", name: "Execution", short: "execution" }, { id: "TA0003", name: "Persistence", short: "persistence" }, { id: "TA0004", name: "Privilege Escalation", short: "privilege-escalation" }, { id: "TA0005", name: "Stealth", short: "stealth" }, { id: "TA0112", name: "Defense Impairment", short: "defense-impairment" }, { id: "TA0006", name: "Credential Access", short: "credential-access" }, { id: "TA0007", name: "Discovery", short: "discovery" }, { id: "TA0008", name: "Lateral Movement", short: "lateral-movement" }, { id: "TA0009", name: "Collection", short: "collection" }, { id: "TA0011", name: "Command and Control", short: "command-and-control" }, { id: "TA0010", name: "Exfiltration", short: "exfiltration" }, { id: "TA0040", name: "Impact", short: "impact" }], techniques: [{ id: "T1001", name: "Data Obfuscation", tactics: ["TA0011"], platforms: ["ESXi", "Linux", "macOS", "Windows"], desc: "Adversaries may obfuscate command and control traffic to make it more difficult to detect." }, { id: "T1001.001", name: "Junk Data", tactics: ["TA0011"], parent: "T1001", platforms: ["ESXi", "Linux", "macOS", "Windows"], desc: "Adversaries may add junk data to protocols used for command and control to make detection more difficult." }, { id: "T1001.002", name: "Steganography", tactics: ["TA0011"], parent: "T1001", platforms: ["Linux", "macOS", "Windows", "ESXi"], desc: "Adversaries may use steganographic techniques to hide command and control traffic to make detection efforts more difficult." }, { id: "T1001.003", name: "Protocol or Service Impersonation", tactics: ["TA0011"], parent: "T1001", platforms: ["ESXi", "Linux", "macOS", "Windows"], desc: "Adversaries may impersonate legitimate protocols or web service traffic to disguise command and control activity and thwart analysis efforts." }, { id: "T1003", name: "OS Credential Dumping", tactics: ["TA0006"], platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may attempt to dump credentials to obtain account login and credential material, normally in the form of a hash or a clear text password." }, { id: "T1003.001", name: "LSASS Memory", tactics: ["TA0006"], parent: "T1003", platforms: ["Windows"], desc: "Adversaries may attempt to access credential material stored in the process memory of the Local Security Authority Subsystem Service (LSASS)." }, { id: "T1003.002", name: "Security Account Manager", tactics: ["TA0006"], parent: "T1003", platforms: ["Windows"], desc: "Adversaries may attempt to extract credential material from the Security Account Manager (SAM) database either through in-memory techniques or through the Windows Registry where the SAM database is stored." }, { id: "T1003.003", name: "NTDS", tactics: ["TA0006"], parent: "T1003", platforms: ["Windows"], desc: "Adversaries may attempt to access or create a copy of the Active Directory domain database in order to steal credential information, as well as obtain other information about domain members such as devices, users, and access rights." }, { id: "T1003.004", name: "LSA Secrets", tactics: ["TA0006"], parent: "T1003", platforms: ["Windows"], desc: "Adversaries with SYSTEM access to a host may attempt to access Local Security Authority (LSA) secrets, which can contain a variety of different credential materials, such as credentials for service accounts." }, { id: "T1003.005", name: "Cached Domain Credentials", tactics: ["TA0006"], parent: "T1003", platforms: ["Windows", "Linux"], desc: "Adversaries may attempt to access cached domain credentials used to allow authentication to occur in the event a domain controller is unavailable." }, { id: "T1003.006", name: "DCSync", tactics: ["TA0006"], parent: "T1003", platforms: ["Windows"], desc: "Adversaries may attempt to access credentials and other sensitive information by abusing a Windows Domain Controller's application programming interface (API) to simulate the replication process from a remote domain controller using a technique called DCSync." }, { id: "T1003.007", name: "Proc Filesystem", tactics: ["TA0006"], parent: "T1003", platforms: ["Linux"], desc: "Adversaries may gather credentials from the proc filesystem or `/proc`." }, { id: "T1003.008", name: "/etc/passwd and /etc/shadow", tactics: ["TA0006"], parent: "T1003", platforms: ["Linux"], desc: "Adversaries may attempt to dump the contents of /etc/passwd and /etc/shadow to enable offline password cracking." }, { id: "T1005", name: "Data from Local System", tactics: ["TA0009"], platforms: ["ESXi", "Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may search local system sources, such as file systems, configuration files, local databases, virtual machine files, or process memory, to find files of interest and sensitive data prior to Exfiltration." }, { id: "T1006", name: "Direct Volume Access", tactics: ["TA0005"], platforms: ["Network Devices", "Windows"], desc: "Adversaries may directly access a volume to bypass file access controls and file system monitoring." }, { id: "T1007", name: "System Service Discovery", tactics: ["TA0007"], platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may try to gather information about registered local system services." }, { id: "T1008", name: "Fallback Channels", tactics: ["TA0011"], platforms: ["ESXi", "Linux", "macOS", "Windows"], desc: "Adversaries may use fallback or alternate communication channels if the primary channel is compromised or inaccessible in order to maintain reliable command and control and to avoid data transfer thresholds." }, { id: "T1010", name: "Application Window Discovery", tactics: ["TA0007"], platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may attempt to get a listing of open application windows." }, { id: "T1011", name: "Exfiltration Over Other Network Medium", tactics: ["TA0010"], platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may attempt to exfiltrate data over a different network medium than the command and control channel." }, { id: "T1011.001", name: "Exfiltration Over Bluetooth", tactics: ["TA0010"], parent: "T1011", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may attempt to exfiltrate data over Bluetooth rather than the command and control channel." }, { id: "T1012", name: "Query Registry", tactics: ["TA0007"], platforms: ["Windows"], desc: "Adversaries may interact with the Windows Registry to gather information about the system, configuration, and installed software." }, { id: "T1014", name: "Rootkit", tactics: ["TA0005"], platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may use rootkits to hide the presence of programs, files, network connections, services, drivers, and other system components." }, { id: "T1016", name: "System Network Configuration Discovery", tactics: ["TA0007"], platforms: ["ESXi", "Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may look for details about the network configuration and settings, such as IP and/or MAC addresses, of systems they access or through information discovery of remote systems." }, { id: "T1016.001", name: "Internet Connection Discovery", tactics: ["TA0007"], parent: "T1016", platforms: ["Windows", "Linux", "macOS", "ESXi"], desc: "Adversaries may check for Internet connectivity on compromised systems." }, { id: "T1016.002", name: "Wi-Fi Discovery", tactics: ["TA0007"], parent: "T1016", platforms: ["Linux", "Windows", "macOS"], desc: "Adversaries may search for information about Wi-Fi networks, such as network names and passwords, on compromised systems." }, { id: "T1018", name: "Remote System Discovery", tactics: ["TA0007"], platforms: ["ESXi", "Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may attempt to get a listing of other systems by IP address, hostname, or other logical identifier on a network that may be used for Lateral Movement from the current system." }, { id: "T1020", name: "Automated Exfiltration", tactics: ["TA0010"], platforms: ["Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may exfiltrate data, such as sensitive documents, through the use of automated processing after being gathered during Collection." }, { id: "T1020.001", name: "Traffic Duplication", tactics: ["TA0010"], parent: "T1020", platforms: ["Network Devices", "IaaS"], desc: "Adversaries may leverage traffic mirroring in order to automate data exfiltration over compromised infrastructure." }, { id: "T1021", name: "Remote Services", tactics: ["TA0008"], platforms: ["Linux", "macOS", "Windows", "IaaS", "ESXi"], desc: "Adversaries may use Valid Accounts to log into a service that accepts remote connections, such as telnet, SSH, and VNC." }, { id: "T1021.001", name: "Remote Desktop Protocol", tactics: ["TA0008"], parent: "T1021", platforms: ["Windows"], desc: "Adversaries may use Valid Accounts to log into a computer using the Remote Desktop Protocol (RDP)." }, { id: "T1021.002", name: "SMB/Windows Admin Shares", tactics: ["TA0008"], parent: "T1021", platforms: ["Windows"], desc: "Adversaries may use Valid Accounts to interact with a remote network share using Server Message Block (SMB)." }, { id: "T1021.003", name: "Distributed Component Object Model", tactics: ["TA0008"], parent: "T1021", platforms: ["Windows"], desc: "Adversaries may use Valid Accounts to interact with remote machines by taking advantage of Distributed Component Object Model (DCOM)." }, { id: "T1021.004", name: "SSH", tactics: ["TA0008"], parent: "T1021", platforms: ["ESXi", "Linux", "macOS"], desc: "Adversaries may use Valid Accounts to log into remote machines using Secure Shell (SSH)." }, { id: "T1021.005", name: "VNC", tactics: ["TA0008"], parent: "T1021", platforms: ["Linux", "Windows", "macOS"], desc: "Adversaries may use Valid Accounts to remotely control machines using Virtual Network Computing (VNC)." }, { id: "T1021.006", name: "Windows Remote Management", tactics: ["TA0008"], parent: "T1021", platforms: ["Windows"], desc: "Adversaries may use Valid Accounts to interact with remote systems using Windows Remote Management (WinRM)." }, { id: "T1021.007", name: "Cloud Services", tactics: ["TA0008"], parent: "T1021", platforms: ["IaaS", "Identity Provider", "Office Suite", "SaaS"], desc: "Adversaries may log into accessible cloud services within a compromised environment using Valid Accounts that are synchronized with or federated to on-premises user identities." }, { id: "T1021.008", name: "Direct Cloud VM Connections", tactics: ["TA0008"], parent: "T1021", platforms: ["IaaS"], desc: "Adversaries may leverage Valid Accounts to log directly into accessible cloud hosted compute infrastructure through cloud native methods." }, { id: "T1025", name: "Data from Removable Media", tactics: ["TA0009"], platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may search connected removable media on computers they have compromised to find files of interest." }, { id: "T1027", name: "Obfuscated Files or Information", tactics: ["TA0005"], platforms: ["ESXi", "Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may attempt to make an executable or file difficult to discover or analyze by encrypting, encoding, or otherwise obfuscating its contents on the system or in transit." }, { id: "T1027.001", name: "Binary Padding", tactics: ["TA0005"], parent: "T1027", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may use binary padding to add junk data and change the on-disk representation of malware." }, { id: "T1027.002", name: "Software Packing", tactics: ["TA0005"], parent: "T1027", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may perform software packing or virtual machine software protection to conceal their code." }, { id: "T1027.003", name: "Steganography", tactics: ["TA0005"], parent: "T1027", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may use steganography techniques in order to prevent the detection of hidden information." }, { id: "T1027.004", name: "Compile After Delivery", tactics: ["TA0005"], parent: "T1027", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may attempt to make payloads difficult to discover and analyze by delivering files to victims as uncompiled code." }, { id: "T1027.005", name: "Indicator Removal from Tools", tactics: ["TA0005"], parent: "T1027", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may remove indicators from tools if they believe their malicious tool was detected, quarantined, or otherwise curtailed." }, { id: "T1027.006", name: "HTML Smuggling", tactics: ["TA0005"], parent: "T1027", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may smuggle data and files past content filters by hiding malicious payloads inside of seemingly benign HTML files." }, { id: "T1027.007", name: "Dynamic API Resolution", tactics: ["TA0005"], parent: "T1027", platforms: ["Windows"], desc: "Adversaries may obfuscate then dynamically resolve API functions called by their malware in order to conceal malicious functionalities and impair defensive analysis." }, { id: "T1027.008", name: "Stripped Payloads", tactics: ["TA0005"], parent: "T1027", platforms: ["Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may attempt to make a payload difficult to analyze by removing symbols, strings, and other human readable information." }, { id: "T1027.009", name: "Embedded Payloads", tactics: ["TA0005"], parent: "T1027", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may embed payloads within other files to conceal malicious content from defenses." }, { id: "T1027.010", name: "Command Obfuscation", tactics: ["TA0005"], parent: "T1027", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may obfuscate content during command execution to impede detection." }, { id: "T1027.011", name: "Fileless Storage", tactics: ["TA0005"], parent: "T1027", platforms: ["Linux", "Windows"], desc: 'Adversaries may store data in "fileless" formats to conceal malicious activity from defenses.' }, { id: "T1027.012", name: "LNK Icon Smuggling", tactics: ["TA0005"], parent: "T1027", platforms: ["Windows"], desc: "Adversaries may smuggle commands to download malicious payloads past content filters by hiding them within otherwise seemingly benign windows shortcut files." }, { id: "T1027.013", name: "Encrypted/Encoded File", tactics: ["TA0005"], parent: "T1027", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may encrypt or encode files to obfuscate strings, bytes, and other specific patterns to impede detection." }, { id: "T1027.014", name: "Polymorphic Code", tactics: ["TA0005"], parent: "T1027", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may utilize polymorphic code (also known as metamorphic or mutating code) to evade detection." }, { id: "T1027.015", name: "Compression", tactics: ["TA0005"], parent: "T1027", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may use compression to obfuscate their payloads or files." }, { id: "T1027.016", name: "Junk Code Insertion", tactics: ["TA0005"], parent: "T1027", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may use junk code / dead code to obfuscate a malware\u2019s functionality." }, { id: "T1027.017", name: "SVG Smuggling", tactics: ["TA0005"], parent: "T1027", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may smuggle data and files past content filters by hiding malicious payloads inside of seemingly benign SVG files." }, { id: "T1027.018", name: "Invisible Unicode", tactics: ["TA0005"], parent: "T1027", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may abuse invisible or non-printing Unicode characters to conceal malicious content within files, scripts, or text." }, { id: "T1029", name: "Scheduled Transfer", tactics: ["TA0010"], platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may schedule data exfiltration to be performed only at certain times of day or at certain intervals." }, { id: "T1030", name: "Data Transfer Size Limits", tactics: ["TA0010"], platforms: ["Linux", "macOS", "Windows", "ESXi"], desc: "An adversary may exfiltrate data in fixed size chunks instead of whole files or limit packet sizes below certain thresholds." }, { id: "T1033", name: "System Owner/User Discovery", tactics: ["TA0007"], platforms: ["Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may attempt to identify the primary user, currently logged in user, set of users that commonly uses a system, or whether a user is actively using the system." }, { id: "T1036", name: "Masquerading", tactics: ["TA0005"], platforms: ["Containers", "ESXi", "Linux", "macOS", "Windows"], desc: "Adversaries may attempt to manipulate features of their artifacts to make them appear legitimate or benign to users and/or security tools." }, { id: "T1036.001", name: "Invalid Code Signature", tactics: ["TA0005"], parent: "T1036", platforms: ["macOS", "Windows"], desc: "Adversaries may attempt to mimic features of valid code signatures to increase the chance of deceiving a user, analyst, or tool." }, { id: "T1036.002", name: "Right-to-Left Override", tactics: ["TA0005"], parent: "T1036", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may abuse the right-to-left override (RTLO or RLO) character (U+202E) to disguise a string and/or file name to make it appear benign." }, { id: "T1036.003", name: "Rename Legitimate Utilities", tactics: ["TA0005"], parent: "T1036", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may rename legitimate / system utilities to try to evade security mechanisms concerning the usage of those utilities." }, { id: "T1036.004", name: "Masquerade Task or Service", tactics: ["TA0005"], parent: "T1036", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may attempt to manipulate the name of a task or service to make it appear legitimate or benign." }, { id: "T1036.005", name: "Match Legitimate Resource Name or Location", tactics: ["TA0005"], parent: "T1036", platforms: ["Containers", "ESXi", "Linux", "macOS", "Windows"], desc: "Adversaries may match or approximate the name or location of legitimate files, Registry keys, or other resources when naming/placing them." }, { id: "T1036.006", name: "Space after Filename", tactics: ["TA0005"], parent: "T1036", platforms: ["Linux", "macOS"], desc: "Adversaries can hide a program's true filetype by changing the extension of a file." }, { id: "T1036.007", name: "Double File Extension", tactics: ["TA0005"], parent: "T1036", platforms: ["Windows"], desc: "Adversaries may abuse a double extension in the filename as a means of masquerading the true file type." }, { id: "T1036.008", name: "Masquerade File Type", tactics: ["TA0005"], parent: "T1036", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may masquerade malicious payloads as legitimate files through changes to the payload's formatting, including the file\u2019s signature, extension, icon, and contents." }, { id: "T1036.009", name: "Break Process Trees", tactics: ["TA0005"], parent: "T1036", platforms: ["Linux", "macOS"], desc: "An adversary may attempt to evade process tree-based analysis by modifying executed malware's parent process ID (PPID)." }, { id: "T1036.010", name: "Masquerade Account Name", tactics: ["TA0005"], parent: "T1036", platforms: ["Containers", "IaaS", "Identity Provider", "Linux", "macOS", "Office Suite", "SaaS", "Windows"], desc: "Adversaries may match or approximate the names of legitimate accounts to make newly created ones appear benign." }, { id: "T1036.011", name: "Overwrite Process Arguments", tactics: ["TA0005"], parent: "T1036", platforms: ["Linux"], desc: "Adversaries may modify a process's in-memory arguments to change its name in order to appear as a legitimate or benign process." }, { id: "T1036.012", name: "Browser Fingerprint", tactics: ["TA0005"], parent: "T1036", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may attempt to blend in with legitimate traffic by spoofing browser and system attributes like operating system, system language, platform, user-agent string, resolution, time zone, etc." }, { id: "T1037", name: "Boot or Logon Initialization Scripts", tactics: ["TA0003", "TA0004"], platforms: ["ESXi", "Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may use scripts automatically executed at boot or logon initialization to establish persistence." }, { id: "T1037.001", name: "Logon Script (Windows)", tactics: ["TA0003", "TA0004"], parent: "T1037", platforms: ["Windows"], desc: "Adversaries may use Windows logon scripts automatically executed at logon initialization to establish persistence." }, { id: "T1037.002", name: "Login Hook", tactics: ["TA0003", "TA0004"], parent: "T1037", platforms: ["macOS"], desc: "Adversaries may use a Login Hook to establish persistence executed upon user logon." }, { id: "T1037.003", name: "Network Logon Script", tactics: ["TA0003", "TA0004"], parent: "T1037", platforms: ["Windows"], desc: "Adversaries may use network logon scripts automatically executed at logon initialization to establish persistence." }, { id: "T1037.004", name: "RC Scripts", tactics: ["TA0003", "TA0004"], parent: "T1037", platforms: ["macOS", "Linux", "Network Devices", "ESXi"], desc: "Adversaries may establish persistence by modifying RC scripts, which are executed during a Unix-like system\u2019s startup." }, { id: "T1037.005", name: "Startup Items", tactics: ["TA0003", "TA0004"], parent: "T1037", platforms: ["macOS"], desc: "Adversaries may use startup items automatically executed at boot initialization to establish persistence." }, { id: "T1039", name: "Data from Network Shared Drive", tactics: ["TA0009"], platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may search network shares on computers they have compromised to find files of interest." }, { id: "T1040", name: "Network Sniffing", tactics: ["TA0006", "TA0007"], platforms: ["IaaS", "Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may passively sniff network traffic to capture information about an environment, including authentication material passed over the network." }, { id: "T1041", name: "Exfiltration Over C2 Channel", tactics: ["TA0010"], platforms: ["ESXi", "Linux", "macOS", "Windows"], desc: "Adversaries may steal data by exfiltrating it over an existing command and control channel." }, { id: "T1046", name: "Network Service Discovery", tactics: ["TA0007"], platforms: ["Containers", "IaaS", "Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may attempt to get a listing of services running on remote hosts and local network infrastructure devices, including those that may be vulnerable to remote software exploitation." }, { id: "T1047", name: "Windows Management Instrumentation", tactics: ["TA0002"], platforms: ["Windows"], desc: "Adversaries may abuse Windows Management Instrumentation (WMI) to execute malicious commands and payloads." }, { id: "T1048", name: "Exfiltration Over Alternative Protocol", tactics: ["TA0010"], platforms: ["ESXi", "IaaS", "Linux", "macOS", "Network Devices", "Office Suite", "SaaS", "Windows"], desc: "Adversaries may steal data by exfiltrating it over a different protocol than that of the existing command and control channel." }, { id: "T1048.001", name: "Exfiltration Over Symmetric Encrypted Non-C2 Protocol", tactics: ["TA0010"], parent: "T1048", platforms: ["Linux", "macOS", "Windows", "ESXi"], desc: "Adversaries may steal data by exfiltrating it over a symmetrically encrypted network protocol other than that of the existing command and control channel." }, { id: "T1048.002", name: "Exfiltration Over Asymmetric Encrypted Non-C2 Protocol", tactics: ["TA0010"], parent: "T1048", platforms: ["ESXi", "Linux", "macOS", "Windows"], desc: "Adversaries may steal data by exfiltrating it over an asymmetrically encrypted network protocol other than that of the existing command and control channel." }, { id: "T1048.003", name: "Exfiltration Over Unencrypted Non-C2 Protocol", tactics: ["TA0010"], parent: "T1048", platforms: ["ESXi", "Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may steal data by exfiltrating it over an un-encrypted network protocol other than that of the existing command and control channel." }, { id: "T1049", name: "System Network Connections Discovery", tactics: ["TA0007"], platforms: ["ESXi", "IaaS", "Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may attempt to get a listing of network connections to or from the compromised system they are currently accessing or from remote systems by querying for information over the network." }, { id: "T1052", name: "Exfiltration Over Physical Medium", tactics: ["TA0010"], platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may attempt to exfiltrate data via a physical medium, such as a removable drive." }, { id: "T1052.001", name: "Exfiltration over USB", tactics: ["TA0010"], parent: "T1052", platforms: ["Linux", "Windows", "macOS"], desc: "Adversaries may attempt to exfiltrate data over a USB connected physical device." }, { id: "T1053", name: "Scheduled Task/Job", tactics: ["TA0002", "TA0003", "TA0004"], platforms: ["Containers", "ESXi", "Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may abuse task scheduling functionality to facilitate initial or recurring execution of malicious code." }, { id: "T1053.002", name: "At", tactics: ["TA0002", "TA0003", "TA0004"], parent: "T1053", platforms: ["Windows", "Linux", "macOS"], desc: "Adversaries may abuse the at utility to perform task scheduling for initial or recurring execution of malicious code." }, { id: "T1053.003", name: "Cron", tactics: ["TA0002", "TA0003", "TA0004"], parent: "T1053", platforms: ["Linux", "macOS", "ESXi"], desc: "Adversaries may abuse the cron utility to perform task scheduling for initial or recurring execution of malicious code." }, { id: "T1053.005", name: "Scheduled Task", tactics: ["TA0002", "TA0003", "TA0004"], parent: "T1053", platforms: ["Windows"], desc: "Adversaries may abuse the Windows Task Scheduler to perform task scheduling for initial or recurring execution of malicious code." }, { id: "T1053.006", name: "Systemd Timers", tactics: ["TA0002", "TA0003", "TA0004"], parent: "T1053", platforms: ["Linux"], desc: "Adversaries may abuse systemd timers to perform task scheduling for initial or recurring execution of malicious code." }, { id: "T1053.007", name: "Container Orchestration Job", tactics: ["TA0002", "TA0003", "TA0004"], parent: "T1053", platforms: ["Containers"], desc: "Adversaries may abuse task scheduling functionality provided by container orchestration tools such as Kubernetes to schedule deployment of containers configured to execute malicious code." }, { id: "T1055", name: "Process Injection", tactics: ["TA0005", "TA0004"], platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may inject code into processes in order to evade process-based defenses as well as possibly elevate privileges." }, { id: "T1055.001", name: "Dynamic-link Library Injection", tactics: ["TA0005", "TA0004"], parent: "T1055", platforms: ["Windows"], desc: "Adversaries may inject dynamic-link libraries (DLLs) into processes in order to evade process-based defenses as well as possibly elevate privileges." }, { id: "T1055.002", name: "Portable Executable Injection", tactics: ["TA0005", "TA0004"], parent: "T1055", platforms: ["Windows"], desc: "Adversaries may inject portable executables (PE) into processes in order to evade process-based defenses as well as possibly elevate privileges." }, { id: "T1055.003", name: "Thread Execution Hijacking", tactics: ["TA0005", "TA0004"], parent: "T1055", platforms: ["Windows"], desc: "Adversaries may inject malicious code into hijacked processes in order to evade process-based defenses as well as possibly elevate privileges." }, { id: "T1055.004", name: "Asynchronous Procedure Call", tactics: ["TA0005", "TA0004"], parent: "T1055", platforms: ["Windows"], desc: "Adversaries may inject malicious code into processes via the asynchronous procedure call (APC) queue in order to evade process-based defenses as well as possibly elevate privileges." }, { id: "T1055.005", name: "Thread Local Storage", tactics: ["TA0005", "TA0004"], parent: "T1055", platforms: ["Windows"], desc: "Adversaries may inject malicious code into processes via thread local storage (TLS) callbacks in order to evade process-based defenses as well as possibly elevate privileges." }, { id: "T1055.008", name: "Ptrace System Calls", tactics: ["TA0005", "TA0004"], parent: "T1055", platforms: ["Linux"], desc: "Adversaries may inject malicious code into processes via ptrace (process trace) system calls in order to evade process-based defenses as well as possibly elevate privileges." }, { id: "T1055.009", name: "Proc Memory", tactics: ["TA0005", "TA0004"], parent: "T1055", platforms: ["Linux"], desc: "Adversaries may inject malicious code into processes via the /proc filesystem in order to evade process-based defenses as well as possibly elevate privileges." }, { id: "T1055.011", name: "Extra Window Memory Injection", tactics: ["TA0005", "TA0004"], parent: "T1055", platforms: ["Windows"], desc: "Adversaries may inject malicious code into process via Extra Window Memory (EWM) in order to evade process-based defenses as well as possibly elevate privileges." }, { id: "T1055.012", name: "Process Hollowing", tactics: ["TA0005", "TA0004"], parent: "T1055", platforms: ["Windows"], desc: "Adversaries may inject malicious code into suspended and hollowed processes in order to evade process-based defenses." }, { id: "T1055.013", name: "Process Doppelg\xE4nging", tactics: ["TA0005", "TA0004"], parent: "T1055", platforms: ["Windows"], desc: "Adversaries may inject malicious code into process via process doppelg\xE4nging in order to evade process-based defenses as well as possibly elevate privileges." }, { id: "T1055.014", name: "VDSO Hijacking", tactics: ["TA0005", "TA0004"], parent: "T1055", platforms: ["Linux"], desc: "Adversaries may inject malicious code into processes via VDSO hijacking in order to evade process-based defenses as well as possibly elevate privileges." }, { id: "T1055.015", name: "ListPlanting", tactics: ["TA0005", "TA0004"], parent: "T1055", platforms: ["Windows"], desc: "Adversaries may abuse list-view controls to inject malicious code into hijacked processes in order to evade process-based defenses as well as possibly elevate privileges." }, { id: "T1056", name: "Input Capture", tactics: ["TA0009", "TA0006"], platforms: ["Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may use methods of capturing user input to obtain credentials or collect information." }, { id: "T1056.001", name: "Keylogging", tactics: ["TA0009", "TA0006"], parent: "T1056", platforms: ["Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may log user keystrokes to intercept credentials as the user types them." }, { id: "T1056.002", name: "GUI Input Capture", tactics: ["TA0009", "TA0006"], parent: "T1056", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may mimic common operating system GUI components to prompt users for credentials with a seemingly legitimate prompt." }, { id: "T1056.003", name: "Web Portal Capture", tactics: ["TA0009", "TA0006"], parent: "T1056", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may install code on externally facing portals, such as a VPN login page, to capture and transmit credentials of users who attempt to log into the service." }, { id: "T1056.004", name: "Credential API Hooking", tactics: ["TA0009", "TA0006"], parent: "T1056", platforms: ["Windows", "Linux", "macOS"], desc: "Adversaries may hook into Windows application programming interface (API) functions and Linux system functions to collect user credentials." }, { id: "T1057", name: "Process Discovery", tactics: ["TA0007"], platforms: ["ESXi", "Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may attempt to get information about running processes on a system." }, { id: "T1059", name: "Command and Scripting Interpreter", tactics: ["TA0002"], platforms: ["Containers", "ESXi", "IaaS", "Identity Provider", "Linux", "macOS", "Network Devices", "Office Suite", "SaaS", "Windows"], desc: "Adversaries may abuse command and script interpreters to execute commands, scripts, or binaries." }, { id: "T1059.001", name: "PowerShell", tactics: ["TA0002"], parent: "T1059", platforms: ["Windows"], desc: "Adversaries may abuse PowerShell commands and scripts for execution." }, { id: "T1059.002", name: "AppleScript", tactics: ["TA0002"], parent: "T1059", platforms: ["macOS"], desc: "Adversaries may abuse AppleScript for execution." }, { id: "T1059.003", name: "Windows Command Shell", tactics: ["TA0002"], parent: "T1059", platforms: ["Windows"], desc: "Adversaries may abuse the Windows command shell for execution." }, { id: "T1059.004", name: "Unix Shell", tactics: ["TA0002"], parent: "T1059", platforms: ["ESXi", "Linux", "macOS", "Network Devices"], desc: "Adversaries may abuse Unix shell commands and scripts for execution." }, { id: "T1059.005", name: "Visual Basic", tactics: ["TA0002"], parent: "T1059", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may abuse Visual Basic (VB) for execution." }, { id: "T1059.006", name: "Python", tactics: ["TA0002"], parent: "T1059", platforms: ["ESXi", "Linux", "macOS", "Windows"], desc: "Adversaries may abuse Python commands and scripts for execution." }, { id: "T1059.007", name: "JavaScript", tactics: ["TA0002"], parent: "T1059", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may abuse various implementations of JavaScript for execution." }, { id: "T1059.008", name: "Network Device CLI", tactics: ["TA0002"], parent: "T1059", platforms: ["Network Devices"], desc: "Adversaries may abuse scripting or built-in command line interpreters (CLI) on network devices to execute malicious command and payloads." }, { id: "T1059.009", name: "Cloud API", tactics: ["TA0002"], parent: "T1059", platforms: ["IaaS", "Identity Provider", "Office Suite", "SaaS"], desc: "Adversaries may abuse cloud APIs to execute malicious commands." }, { id: "T1059.010", name: "AutoHotKey & AutoIT", tactics: ["TA0002"], parent: "T1059", platforms: ["Windows"], desc: "Adversaries may execute commands and perform malicious tasks using AutoIT and AutoHotKey automation scripts." }, { id: "T1059.011", name: "Lua", tactics: ["TA0002"], parent: "T1059", platforms: ["Linux", "Network Devices", "Windows", "macOS"], desc: "Adversaries may abuse Lua commands and scripts for execution." }, { id: "T1059.012", name: "Hypervisor CLI", tactics: ["TA0002"], parent: "T1059", platforms: ["ESXi"], desc: "Adversaries may abuse hypervisor command line interpreters (CLIs) to execute malicious commands." }, { id: "T1059.013", name: "Container CLI/API", tactics: ["TA0002"], parent: "T1059", platforms: ["Containers"], desc: "Adversaries may abuse built-in CLI tools or API calls to execute malicious commands in containerized environments." }, { id: "T1068", name: "Exploitation for Privilege Escalation", tactics: ["TA0004"], platforms: ["Containers", "Linux", "macOS", "Windows"], desc: "Adversaries may exploit software vulnerabilities in an attempt to elevate privileges." }, { id: "T1069", name: "Permission Groups Discovery", tactics: ["TA0007"], platforms: ["Containers", "IaaS", "Identity Provider", "Linux", "macOS", "Office Suite", "SaaS", "Windows"], desc: "Adversaries may attempt to discover group and permission settings." }, { id: "T1069.001", name: "Local Groups", tactics: ["TA0007"], parent: "T1069", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may attempt to find local system groups and permission settings." }, { id: "T1069.002", name: "Domain Groups", tactics: ["TA0007"], parent: "T1069", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may attempt to find domain-level groups and permission settings." }, { id: "T1069.003", name: "Cloud Groups", tactics: ["TA0007"], parent: "T1069", platforms: ["SaaS", "IaaS", "Office Suite", "Identity Provider"], desc: "Adversaries may attempt to find cloud groups and permission settings." }, { id: "T1070", name: "Indicator Removal", tactics: ["TA0005"], platforms: ["Containers", "ESXi", "Linux", "macOS", "Network Devices", "Office Suite", "Windows"], desc: "Adversaries may selectively delete or modify artifacts generated to reduce indications of their presence and blend in with legitimate activity." }, { id: "T1070.003", name: "Clear Command History", tactics: ["TA0005"], parent: "T1070", platforms: ["ESXi", "Linux", "macOS", "Network Devices", "Windows"], desc: "In addition to clearing system logs, an adversary may clear the command history of a compromised account to conceal the actions undertaken during an intrusion." }, { id: "T1070.004", name: "File Deletion", tactics: ["TA0005"], parent: "T1070", platforms: ["ESXi", "Linux", "macOS", "Windows"], desc: "Adversaries may delete files left behind by the actions of their intrusion activity." }, { id: "T1070.005", name: "Network Share Connection Removal", tactics: ["TA0005"], parent: "T1070", platforms: ["Windows"], desc: "Adversaries may remove share connections that are no longer useful in order to clean up traces of their operation." }, { id: "T1070.006", name: "Timestomp", tactics: ["TA0005"], parent: "T1070", platforms: ["ESXi", "Linux", "macOS", "Windows"], desc: "Adversaries may modify file time attributes to hide new files or changes to existing files." }, { id: "T1070.007", name: "Clear Network Connection History and Configurations", tactics: ["TA0005"], parent: "T1070", platforms: ["Linux", "macOS", "Windows", "Network Devices"], desc: "Adversaries may clear or remove evidence of malicious network connections in order to clean up traces of their operations." }, { id: "T1070.008", name: "Clear Mailbox Data", tactics: ["TA0005"], parent: "T1070", platforms: ["Linux", "macOS", "Office Suite", "Windows"], desc: "Adversaries may modify mail and mail application data to remove evidence of their activity." }, { id: "T1070.009", name: "Clear Persistence", tactics: ["TA0005"], parent: "T1070", platforms: ["ESXi", "Linux", "macOS", "Windows"], desc: "Adversaries may clear artifacts associated with previously established persistence on a host system to remove evidence of their activity." }, { id: "T1070.010", name: "Relocate Malware", tactics: ["TA0005"], parent: "T1070", platforms: ["Linux", "macOS", "Network Devices", "Windows"], desc: "Once a payload is delivered, adversaries may reproduce copies of the same malware on the victim system to remove evidence of their presence and/or avoid defenses." }, { id: "T1071", name: "Application Layer Protocol", tactics: ["TA0011"], platforms: ["Linux", "macOS", "Windows", "Network Devices", "ESXi"], desc: "Adversaries may communicate using OSI application layer protocols to avoid detection/network filtering by blending in with existing traffic." }, { id: "T1071.001", name: "Web Protocols", tactics: ["TA0011"], parent: "T1071", platforms: ["ESXi", "Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may communicate using application layer protocols associated with web traffic to avoid detection/network filtering by blending in with existing traffic." }, { id: "T1071.002", name: "File Transfer Protocols", tactics: ["TA0011"], parent: "T1071", platforms: ["ESXi", "Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may communicate using application layer protocols associated with transferring files to avoid detection/network filtering by blending in with existing traffic." }, { id: "T1071.003", name: "Mail Protocols", tactics: ["TA0011"], parent: "T1071", platforms: ["Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may communicate using application layer protocols associated with electronic mail delivery to avoid detection/network filtering by blending in with existing traffic." }, { id: "T1071.004", name: "DNS", tactics: ["TA0011"], parent: "T1071", platforms: ["ESXi", "Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may communicate using the Domain Name System (DNS) application layer protocol to avoid detection/network filtering by blending in with existing traffic." }, { id: "T1071.005", name: "Publish/Subscribe Protocols", tactics: ["TA0011"], parent: "T1071", platforms: ["macOS", "Linux", "Windows", "Network Devices"], desc: "Adversaries may communicate using publish/subscribe (pub/sub) application layer protocols to avoid detection/network filtering by blending in with existing traffic." }, { id: "T1072", name: "Software Deployment Tools", tactics: ["TA0002", "TA0008"], platforms: ["Linux", "macOS", "Network Devices", "SaaS", "Windows"], desc: "Adversaries may gain access to and use centralized software suites installed within an enterprise to execute commands and move laterally through the network." }, { id: "T1074", name: "Data Staged", tactics: ["TA0009"], platforms: ["ESXi", "IaaS", "Linux", "macOS", "Windows"], desc: "Adversaries may stage collected data in a central location or directory prior to Exfiltration." }, { id: "T1074.001", name: "Local Data Staging", tactics: ["TA0009"], parent: "T1074", platforms: ["ESXi", "Linux", "macOS", "Windows"], desc: "Adversaries may stage collected data in a central location or directory on the local system prior to Exfiltration." }, { id: "T1074.002", name: "Remote Data Staging", tactics: ["TA0009"], parent: "T1074", platforms: ["ESXi", "IaaS", "Linux", "macOS", "Windows"], desc: "Adversaries may stage data collected from multiple systems in a central location or directory on one system prior to Exfiltration." }, { id: "T1078", name: "Valid Accounts", tactics: ["TA0005", "TA0003", "TA0004", "TA0001"], platforms: ["Containers", "ESXi", "IaaS", "Identity Provider", "Linux", "macOS", "Network Devices", "Office Suite", "SaaS", "Windows"], desc: "Adversaries may obtain and abuse credentials of existing accounts as a means of gaining Initial Access, Persistence, Privilege Escalation, or Defense Evasion." }, { id: "T1078.001", name: "Default Accounts", tactics: ["TA0005", "TA0003", "TA0004", "TA0001"], parent: "T1078", platforms: ["Containers", "ESXi", "IaaS", "Identity Provider", "Linux", "macOS", "Network Devices", "Office Suite", "SaaS", "Windows"], desc: "Adversaries may obtain and abuse credentials of a default account as a means of gaining Initial Access, Persistence, Privilege Escalation, or Defense Evasion." }, { id: "T1078.002", name: "Domain Accounts", tactics: ["TA0005", "TA0003", "TA0004", "TA0001"], parent: "T1078", platforms: ["ESXi", "Linux", "macOS", "Windows"], desc: "Adversaries may obtain and abuse credentials of a domain account as a means of gaining Initial Access, Persistence, Privilege Escalation, or Defense Evasion." }, { id: "T1078.003", name: "Local Accounts", tactics: ["TA0005", "TA0003", "TA0004", "TA0001"], parent: "T1078", platforms: ["Containers", "ESXi", "Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may obtain and abuse credentials of a local account as a means of gaining Initial Access, Persistence, Privilege Escalation, or Defense Evasion." }, { id: "T1078.004", name: "Cloud Accounts", tactics: ["TA0005", "TA0003", "TA0004", "TA0001"], parent: "T1078", platforms: ["IaaS", "Identity Provider", "Office Suite", "SaaS"], desc: "Valid accounts in cloud environments may allow adversaries to perform actions to achieve Initial Access, Persistence, Privilege Escalation, or Defense Evasion." }, { id: "T1080", name: "Taint Shared Content", tactics: ["TA0008"], platforms: ["Windows", "SaaS", "Linux", "macOS", "Office Suite"], desc: "Adversaries may deliver payloads to remote systems by adding content to shared storage locations, such as network drives or internal code repositories." }, { id: "T1082", name: "System Information Discovery", tactics: ["TA0007"], platforms: ["ESXi", "IaaS", "Linux", "macOS", "Network Devices", "Windows"], desc: "An adversary may attempt to get detailed information about the operating system and hardware, including version, patches, hotfixes, service packs, and architecture." }, { id: "T1083", name: "File and Directory Discovery", tactics: ["TA0007"], platforms: ["ESXi", "Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may enumerate files and directories or may search in specific locations of a host or network share for certain information within a file system." }, { id: "T1087", name: "Account Discovery", tactics: ["TA0007"], platforms: ["ESXi", "IaaS", "Identity Provider", "Linux", "macOS", "Office Suite", "SaaS", "Windows"], desc: "Adversaries may attempt to get a listing of valid accounts, usernames, or email addresses on a system or within a compromised environment." }, { id: "T1087.001", name: "Local Account", tactics: ["TA0007"], parent: "T1087", platforms: ["ESXi", "Linux", "macOS", "Windows"], desc: "Adversaries may attempt to get a listing of local system accounts." }, { id: "T1087.002", name: "Domain Account", tactics: ["TA0007"], parent: "T1087", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may attempt to get a listing of domain accounts." }, { id: "T1087.003", name: "Email Account", tactics: ["TA0007"], parent: "T1087", platforms: ["Windows", "Office Suite"], desc: "Adversaries may attempt to get a listing of email addresses and accounts." }, { id: "T1087.004", name: "Cloud Account", tactics: ["TA0007"], parent: "T1087", platforms: ["IaaS", "Identity Provider", "Office Suite", "SaaS"], desc: "Adversaries may attempt to get a listing of cloud accounts." }, { id: "T1090", name: "Proxy", tactics: ["TA0011"], platforms: ["ESXi", "Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may use a connection proxy to direct network traffic between systems or act as an intermediary for network communications to a command and control server to avoid direct connections to their infrastructure." }, { id: "T1090.001", name: "Internal Proxy", tactics: ["TA0011"], parent: "T1090", platforms: ["ESXi", "Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may use an internal proxy to direct command and control traffic between two or more systems in a compromised environment." }, { id: "T1090.002", name: "External Proxy", tactics: ["TA0011"], parent: "T1090", platforms: ["ESXi", "Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may use an external proxy to act as an intermediary for network communications to a command and control server to avoid direct connections to their infrastructure." }, { id: "T1090.003", name: "Multi-hop Proxy", tactics: ["TA0011"], parent: "T1090", platforms: ["ESXi", "Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may chain together multiple proxies to disguise the source of malicious traffic." }, { id: "T1090.004", name: "Domain Fronting", tactics: ["TA0011"], parent: "T1090", platforms: ["Linux", "macOS", "Windows", "ESXi"], desc: "Adversaries may take advantage of routing schemes in Content Delivery Networks (CDNs) and other services which host multiple domains to obfuscate the intended destination of HTTPS traffic or traffic tunneled through HTTPS." }, { id: "T1091", name: "Replication Through Removable Media", tactics: ["TA0008", "TA0001"], platforms: ["Windows"], desc: "Adversaries may move onto systems, possibly those on disconnected or air-gapped networks, by copying malware to removable media and taking advantage of Autorun features when the media is inserted into a system and executes." }, { id: "T1092", name: "Communication Through Removable Media", tactics: ["TA0011"], platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries can perform command and control between compromised hosts on potentially disconnected networks using removable media to transfer commands from system to system." }, { id: "T1095", name: "Non-Application Layer Protocol", tactics: ["TA0011"], platforms: ["ESXi", "Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may use an OSI non-application layer protocol for communication between host and C2 server or among infected hosts within a network." }, { id: "T1098", name: "Account Manipulation", tactics: ["TA0003", "TA0004"], platforms: ["Containers", "ESXi", "IaaS", "Identity Provider", "Linux", "macOS", "Network Devices", "Office Suite", "SaaS", "Windows"], desc: "Adversaries may manipulate accounts to maintain and/or elevate access to victim systems." }, { id: "T1098.001", name: "Additional Cloud Credentials", tactics: ["TA0003", "TA0004"], parent: "T1098", platforms: ["IaaS", "Identity Provider", "SaaS"], desc: "Adversaries may add adversary-controlled credentials to a cloud account to maintain persistent access to victim accounts and instances within the environment." }, { id: "T1098.002", name: "Additional Email Delegate Permissions", tactics: ["TA0003", "TA0004"], parent: "T1098", platforms: ["Windows", "Office Suite"], desc: "Adversaries may grant additional permission levels to maintain persistent access to an adversary-controlled email account." }, { id: "T1098.003", name: "Additional Cloud Roles", tactics: ["TA0003", "TA0004"], parent: "T1098", platforms: ["IaaS", "Identity Provider", "Office Suite", "SaaS"], desc: "An adversary may add additional roles or permissions to an adversary-controlled cloud account to maintain persistent access to a tenant." }, { id: "T1098.004", name: "SSH Authorized Keys", tactics: ["TA0003", "TA0004"], parent: "T1098", platforms: ["ESXi", "IaaS", "Linux", "macOS", "Network Devices"], desc: "Adversaries may modify the SSH authorized_keys file to maintain persistence on a victim host." }, { id: "T1098.005", name: "Device Registration", tactics: ["TA0003", "TA0004"], parent: "T1098", platforms: ["Windows", "Identity Provider"], desc: "Adversaries may register a device to an adversary-controlled account." }, { id: "T1098.006", name: "Additional Container Cluster Roles", tactics: ["TA0003", "TA0004"], parent: "T1098", platforms: ["Containers"], desc: "An adversary may add additional roles or permissions to an adversary-controlled user or service account to maintain persistent access to a container orchestration system." }, { id: "T1098.007", name: "Additional Local or Domain Groups", tactics: ["TA0003", "TA0004"], parent: "T1098", platforms: ["Windows", "macOS", "Linux"], desc: "An adversary may add additional local or domain groups to an adversary-controlled account to maintain persistent access to a system or domain." }, { id: "T1102", name: "Web Service", tactics: ["TA0011"], platforms: ["ESXi", "Linux", "macOS", "Windows"], desc: "Adversaries may use an existing, legitimate external Web service as a means for relaying data to/from a compromised system." }, { id: "T1102.001", name: "Dead Drop Resolver", tactics: ["TA0011"], parent: "T1102", platforms: ["ESXi", "Linux", "macOS", "Windows"], desc: "Adversaries may use an existing, legitimate external Web service to host information that points to additional command and control (C2) infrastructure." }, { id: "T1102.002", name: "Bidirectional Communication", tactics: ["TA0011"], parent: "T1102", platforms: ["ESXi", "Linux", "macOS", "Windows"], desc: "Adversaries may use an existing, legitimate external Web service as a means for sending commands to and receiving output from a compromised system over the Web service channel." }, { id: "T1102.003", name: "One-Way Communication", tactics: ["TA0011"], parent: "T1102", platforms: ["Linux", "macOS", "Windows", "ESXi"], desc: "Adversaries may use an existing, legitimate external Web service as a means for sending commands to a compromised system without receiving return output over the Web service channel." }, { id: "T1104", name: "Multi-Stage Channels", tactics: ["TA0011"], platforms: ["Linux", "macOS", "Windows", "ESXi"], desc: "Adversaries may create multiple stages for command and control that are employed under different conditions or for certain functions." }, { id: "T1105", name: "Ingress Tool Transfer", tactics: ["TA0011"], platforms: ["ESXi", "Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may transfer tools or other files from an external system into a compromised environment." }, { id: "T1106", name: "Native API", tactics: ["TA0002"], platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may interact with the native OS application programming interface (API) to execute behaviors." }, { id: "T1110", name: "Brute Force", tactics: ["TA0006"], platforms: ["Containers", "ESXi", "IaaS", "Identity Provider", "Linux", "macOS", "Network Devices", "Office Suite", "SaaS", "Windows"], desc: "Adversaries may use brute force techniques to gain access to accounts when passwords are unknown or when password hashes are obtained." }, { id: "T1110.001", name: "Password Guessing", tactics: ["TA0006"], parent: "T1110", platforms: ["Containers", "ESXi", "IaaS", "Identity Provider", "Linux", "macOS", "Network Devices", "Office Suite", "SaaS", "Windows"], desc: "Adversaries with no prior knowledge of legitimate credentials within the system or environment may guess passwords to attempt access to accounts." }, { id: "T1110.002", name: "Password Cracking", tactics: ["TA0006"], parent: "T1110", platforms: ["Identity Provider", "Linux", "macOS", "Network Devices", "Office Suite", "Windows"], desc: "Adversaries may use password cracking to attempt to recover usable credentials, such as plaintext passwords, when credential material such as password hashes are obtained." }, { id: "T1110.003", name: "Password Spraying", tactics: ["TA0006"], parent: "T1110", platforms: ["Containers", "ESXi", "IaaS", "Identity Provider", "Linux", "Network Devices", "Office Suite", "SaaS", "Windows", "macOS"], desc: "Adversaries may use a single or small list of commonly used passwords against many different accounts to attempt to acquire valid account credentials." }, { id: "T1110.004", name: "Credential Stuffing", tactics: ["TA0006"], parent: "T1110", platforms: ["Containers", "ESXi", "IaaS", "Identity Provider", "Linux", "macOS", "Network Devices", "Office Suite", "SaaS", "Windows"], desc: "Adversaries may use credentials obtained from breach dumps of unrelated accounts to gain access to target accounts through credential overlap." }, { id: "T1111", name: "Multi-Factor Authentication Interception", tactics: ["TA0006"], platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may target multi-factor authentication (MFA) mechanisms, (i.e., smart cards, token generators, etc.) to gain access to credentials that can be used to access systems, services, and network resources." }, { id: "T1112", name: "Modify Registry", tactics: ["TA0112", "TA0003"], platforms: ["Windows"], desc: "Adversaries may interact with the Windows Registry as part of a variety of other techniques to aid in defense evasion, persistence, and execution." }, { id: "T1113", name: "Screen Capture", tactics: ["TA0009"], platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may attempt to take screen captures of the desktop to gather information over the course of an operation." }, { id: "T1114", name: "Email Collection", tactics: ["TA0009"], platforms: ["Windows", "macOS", "Linux", "Office Suite"], desc: "Adversaries may target user email to collect sensitive information." }, { id: "T1114.001", name: "Local Email Collection", tactics: ["TA0009"], parent: "T1114", platforms: ["Windows"], desc: "Adversaries may target user email on local systems to collect sensitive information." }, { id: "T1114.002", name: "Remote Email Collection", tactics: ["TA0009"], parent: "T1114", platforms: ["Office Suite", "Windows"], desc: "Adversaries may target an Exchange server, Office 365, or Google Workspace to collect sensitive information." }, { id: "T1114.003", name: "Email Forwarding Rule", tactics: ["TA0009"], parent: "T1114", platforms: ["Linux", "macOS", "Office Suite", "Windows"], desc: "Adversaries may setup email forwarding rules to collect sensitive information." }, { id: "T1115", name: "Clipboard Data", tactics: ["TA0009"], platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may collect data stored in the clipboard from users copying information within or between applications." }, { id: "T1119", name: "Automated Collection", tactics: ["TA0009"], platforms: ["IaaS", "Linux", "macOS", "Office Suite", "SaaS", "Windows"], desc: "Once established within a system or network, an adversary may use automated techniques for collecting internal data." }, { id: "T1120", name: "Peripheral Device Discovery", tactics: ["TA0007"], platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may attempt to gather information about attached peripheral devices and components connected to a computer system." }, { id: "T1123", name: "Audio Capture", tactics: ["TA0009"], platforms: ["Linux", "macOS", "Windows"], desc: "An adversary can leverage a computer's peripheral devices (e.g., microphones and webcams) or applications (e.g., voice and video call services) to capture audio recordings for the purpose of listening into sensitive conversations to gather information." }, { id: "T1124", name: "System Time Discovery", tactics: ["TA0007"], platforms: ["ESXi", "Linux", "macOS", "Network Devices", "Windows"], desc: "An adversary may gather the system time and/or time zone settings from a local or remote system." }, { id: "T1125", name: "Video Capture", tactics: ["TA0009"], platforms: ["Linux", "macOS", "Windows"], desc: "An adversary can leverage a computer's peripheral devices (e.g., integrated cameras or webcams) or applications (e.g., video call services) to capture video recordings for the purpose of gathering information." }, { id: "T1127", name: "Trusted Developer Utilities Proxy Execution", tactics: ["TA0005", "TA0002"], platforms: ["Windows"], desc: "Adversaries may take advantage of trusted developer utilities to proxy execution of malicious payloads." }, { id: "T1127.001", name: "MSBuild", tactics: ["TA0005", "TA0002"], parent: "T1127", platforms: ["Windows"], desc: "Adversaries may use MSBuild to proxy execution of code through a trusted Windows utility." }, { id: "T1127.002", name: "ClickOnce", tactics: ["TA0005", "TA0002"], parent: "T1127", platforms: ["Windows"], desc: "Adversaries may use ClickOnce applications (.appref-ms and .application files) to proxy execution of code through a trusted Windows utility." }, { id: "T1127.003", name: "JamPlus", tactics: ["TA0005", "TA0002"], parent: "T1127", platforms: ["Windows"], desc: "Adversaries may use `JamPlus` to proxy the execution of a malicious script." }, { id: "T1129", name: "Shared Modules", tactics: ["TA0002"], platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may execute malicious payloads via loading shared modules." }, { id: "T1132", name: "Data Encoding", tactics: ["TA0011"], platforms: ["ESXi", "Linux", "macOS", "Windows"], desc: "Adversaries may encode data to make the content of command and control traffic more difficult to detect." }, { id: "T1132.001", name: "Standard Encoding", tactics: ["TA0011"], parent: "T1132", platforms: ["ESXi", "Linux", "macOS", "Windows"], desc: "Adversaries may encode data with a standard data encoding system to make the content of command and control traffic more difficult to detect." }, { id: "T1132.002", name: "Non-Standard Encoding", tactics: ["TA0011"], parent: "T1132", platforms: ["ESXi", "Linux", "macOS", "Windows"], desc: "Adversaries may encode data with a non-standard data encoding system to make the content of command and control traffic more difficult to detect." }, { id: "T1133", name: "External Remote Services", tactics: ["TA0003", "TA0001"], platforms: ["Containers", "Linux", "macOS", "Windows"], desc: "Adversaries may leverage external-facing remote services to initially access and/or persist within a network." }, { id: "T1134", name: "Access Token Manipulation", tactics: ["TA0005", "TA0004"], platforms: ["Windows"], desc: "Adversaries may modify access tokens to operate under a different user or system security context to perform actions and bypass access controls." }, { id: "T1134.001", name: "Token Impersonation/Theft", tactics: ["TA0005", "TA0004"], parent: "T1134", platforms: ["Windows"], desc: "Adversaries may duplicate then impersonate another user's existing token to escalate privileges and bypass access controls." }, { id: "T1134.002", name: "Create Process with Token", tactics: ["TA0005", "TA0004"], parent: "T1134", platforms: ["Windows"], desc: "Adversaries may create a new process with an existing token to escalate privileges and bypass access controls." }, { id: "T1134.003", name: "Make and Impersonate Token", tactics: ["TA0005", "TA0004"], parent: "T1134", platforms: ["Windows"], desc: "Adversaries may make new tokens and impersonate users to escalate privileges and bypass access controls." }, { id: "T1134.004", name: "Parent PID Spoofing", tactics: ["TA0005", "TA0004"], parent: "T1134", platforms: ["Windows"], desc: "Adversaries may spoof the parent process identifier (PPID) of a new process to evade process-monitoring defenses or to elevate privileges." }, { id: "T1134.005", name: "SID-History Injection", tactics: ["TA0005", "TA0004"], parent: "T1134", platforms: ["Windows"], desc: "Adversaries may use SID-History Injection to escalate privileges and bypass access controls." }, { id: "T1135", name: "Network Share Discovery", tactics: ["TA0007"], platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may look for folders and drives shared on remote systems as a means of identifying sources of information to gather as a precursor for Collection and to identify potential systems of interest for Lateral Movement." }, { id: "T1136", name: "Create Account", tactics: ["TA0003"], platforms: ["Windows", "IaaS", "Linux", "macOS", "Network Devices", "Containers", "SaaS", "Office Suite", "Identity Provider", "ESXi"], desc: "Adversaries may create an account to maintain access to victim systems." }, { id: "T1136.001", name: "Local Account", tactics: ["TA0003"], parent: "T1136", platforms: ["Containers", "ESXi", "Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may create a local account to maintain access to victim systems." }, { id: "T1136.002", name: "Domain Account", tactics: ["TA0003"], parent: "T1136", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may create a domain account to maintain access to victim systems." }, { id: "T1136.003", name: "Cloud Account", tactics: ["TA0003"], parent: "T1136", platforms: ["IaaS", "SaaS", "Office Suite", "Identity Provider"], desc: "Adversaries may create a cloud account to maintain access to victim systems." }, { id: "T1137", name: "Office Application Startup", tactics: ["TA0003"], platforms: ["Windows", "Office Suite"], desc: "Adversaries may leverage Microsoft Office-based applications for persistence between startups." }, { id: "T1137.001", name: "Office Template Macros", tactics: ["TA0003"], parent: "T1137", platforms: ["Office Suite", "Windows"], desc: "Adversaries may abuse Microsoft Office templates to obtain persistence on a compromised system." }, { id: "T1137.002", name: "Office Test", tactics: ["TA0003"], parent: "T1137", platforms: ["Windows", "Office Suite"], desc: 'Adversaries may abuse the Microsoft Office "Office Test" Registry key to obtain persistence on a compromised system.' }, { id: "T1137.003", name: "Outlook Forms", tactics: ["TA0003"], parent: "T1137", platforms: ["Windows", "Office Suite"], desc: "Adversaries may abuse Microsoft Outlook forms to obtain persistence on a compromised system." }, { id: "T1137.004", name: "Outlook Home Page", tactics: ["TA0003"], parent: "T1137", platforms: ["Windows", "Office Suite"], desc: "Adversaries may abuse Microsoft Outlook's Home Page feature to obtain persistence on a compromised system." }, { id: "T1137.005", name: "Outlook Rules", tactics: ["TA0003"], parent: "T1137", platforms: ["Windows", "Office Suite"], desc: "Adversaries may abuse Microsoft Outlook rules to obtain persistence on a compromised system." }, { id: "T1137.006", name: "Add-ins", tactics: ["TA0003"], parent: "T1137", platforms: ["Windows", "Office Suite"], desc: "Adversaries may abuse Microsoft Office add-ins to obtain persistence on a compromised system." }, { id: "T1140", name: "Deobfuscate/Decode Files or Information", tactics: ["TA0005"], platforms: ["ESXi", "Linux", "macOS", "Windows"], desc: "Adversaries may use Obfuscated Files or Information to hide artifacts of an intrusion from analysis." }, { id: "T1176", name: "Software Extensions", tactics: ["TA0003"], platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may abuse software extensions to establish persistent access to victim systems." }, { id: "T1176.001", name: "Browser Extensions", tactics: ["TA0003"], parent: "T1176", platforms: ["Linux", "Windows", "macOS"], desc: "Adversaries may abuse internet browser extensions to establish persistent access to victim systems." }, { id: "T1176.002", name: "IDE Extensions", tactics: ["TA0003"], parent: "T1176", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may abuse an integrated development environment (IDE) extension to establish persistent access to victim systems." }, { id: "T1185", name: "Browser Session Hijacking", tactics: ["TA0009"], platforms: ["Windows"], desc: "Adversaries may take advantage of security vulnerabilities and inherent functionality in browser software to change content, modify user-behaviors, and intercept information as part of various browser session hijacking techniques." }, { id: "T1187", name: "Forced Authentication", tactics: ["TA0006"], platforms: ["Windows"], desc: "Adversaries may gather credential material by invoking or forcing a user to automatically provide authentication information through a mechanism in which they can intercept." }, { id: "T1189", name: "Drive-by Compromise", tactics: ["TA0001"], platforms: ["Identity Provider", "Linux", "macOS", "Windows"], desc: "Adversaries may gain access to a system through a user visiting a website over the normal course of browsing." }, { id: "T1190", name: "Exploit Public-Facing Application", tactics: ["TA0001"], platforms: ["Containers", "ESXi", "IaaS", "Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may attempt to exploit a weakness in an Internet-facing host or system to initially access a network." }, { id: "T1195", name: "Supply Chain Compromise", tactics: ["TA0001"], platforms: ["Linux", "Windows", "macOS", "SaaS"], desc: "Adversaries may manipulate products or product delivery mechanisms prior to receipt by a final consumer for the purpose of data or system compromise." }, { id: "T1195.001", name: "Compromise Software Dependencies and Development Tools", tactics: ["TA0001"], parent: "T1195", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may manipulate software dependencies and development tools prior to receipt by a final consumer for the purpose of data or system compromise." }, { id: "T1195.002", name: "Compromise Software Supply Chain", tactics: ["TA0001"], parent: "T1195", platforms: ["Linux", "Windows", "macOS"], desc: "Adversaries may manipulate application software prior to receipt by a final consumer for the purpose of data or system compromise." }, { id: "T1195.003", name: "Compromise Hardware Supply Chain", tactics: ["TA0001"], parent: "T1195", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may manipulate hardware components in products prior to receipt by a final consumer for the purpose of data or system compromise." }, { id: "T1197", name: "BITS Jobs", tactics: ["TA0005", "TA0003", "TA0002"], platforms: ["Windows"], desc: "Adversaries may abuse BITS jobs to persistently execute code and perform various background tasks." }, { id: "T1199", name: "Trusted Relationship", tactics: ["TA0001"], platforms: ["IaaS", "Identity Provider", "Linux", "macOS", "Office Suite", "SaaS", "Windows"], desc: "Adversaries may breach or otherwise leverage organizations who have access to intended victims." }, { id: "T1200", name: "Hardware Additions", tactics: ["TA0001"], platforms: ["Windows", "Linux", "macOS"], desc: "Adversaries may physically introduce computer accessories, networking hardware, or other computing devices into a system or network that can be used as a vector to gain access." }, { id: "T1201", name: "Password Policy Discovery", tactics: ["TA0007"], platforms: ["Windows", "Linux", "macOS", "IaaS", "Network Devices", "Identity Provider", "SaaS", "Office Suite"], desc: "Adversaries may attempt to access detailed information about the password policy used within an enterprise network or cloud environment." }, { id: "T1202", name: "Indirect Command Execution", tactics: ["TA0005"], platforms: ["Windows"], desc: "Adversaries may abuse utilities that allow for command execution to bypass security restrictions that limit the use of command-line interpreters." }, { id: "T1203", name: "Exploitation for Client Execution", tactics: ["TA0002"], platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may exploit software vulnerabilities in client applications to execute code." }, { id: "T1204", name: "User Execution", tactics: ["TA0002"], platforms: ["Linux", "Windows", "macOS", "IaaS", "Containers"], desc: "An adversary may rely upon specific actions by a user in order to gain execution." }, { id: "T1204.001", name: "Malicious Link", tactics: ["TA0002"], parent: "T1204", platforms: ["Linux", "macOS", "Windows"], desc: "An adversary may rely upon a user clicking a malicious link in order to gain execution." }, { id: "T1204.002", name: "Malicious File", tactics: ["TA0002"], parent: "T1204", platforms: ["Linux", "macOS", "Windows"], desc: "An adversary may rely upon a user opening a malicious file in order to gain execution." }, { id: "T1204.003", name: "Malicious Image", tactics: ["TA0002"], parent: "T1204", platforms: ["IaaS", "Containers"], desc: "Adversaries may rely on a user running a malicious image to facilitate execution." }, { id: "T1204.004", name: "Malicious Copy and Paste", tactics: ["TA0002"], parent: "T1204", platforms: ["Linux", "macOS", "Windows"], desc: "An adversary may rely upon a user copying and pasting code in order to gain execution." }, { id: "T1204.005", name: "Malicious Library", tactics: ["TA0002"], parent: "T1204", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may rely on a user installing a malicious library to facilitate execution." }, { id: "T1205", name: "Traffic Signaling", tactics: ["TA0005", "TA0003", "TA0011"], platforms: ["Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may use traffic signaling to hide open ports or other malicious functionality used for persistence or command and control." }, { id: "T1205.001", name: "Port Knocking", tactics: ["TA0005", "TA0003", "TA0011"], parent: "T1205", platforms: ["Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may use port knocking to hide open ports used for persistence or command and control." }, { id: "T1205.002", name: "Socket Filters", tactics: ["TA0005", "TA0003", "TA0011"], parent: "T1205", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may attach filters to a network socket to monitor then activate backdoors used for persistence or command and control." }, { id: "T1207", name: "Rogue Domain Controller", tactics: ["TA0112"], platforms: ["Windows"], desc: "Adversaries may register a rogue Domain Controller to enable manipulation of Active Directory data." }, { id: "T1210", name: "Exploitation of Remote Services", tactics: ["TA0008"], platforms: ["Linux", "Windows", "macOS", "ESXi"], desc: "Adversaries may exploit remote services to gain unauthorized access to internal systems once inside of a network." }, { id: "T1211", name: "Exploitation for Stealth", tactics: ["TA0005"], platforms: ["Linux", "Windows", "macOS", "SaaS", "IaaS"], desc: "Adversaries may exploit vulnerabilities to evade detection by hiding activity, suppressing logging, or operating within trusted or unmonitored components." }, { id: "T1212", name: "Exploitation for Credential Access", tactics: ["TA0006"], platforms: ["Linux", "Windows", "macOS", "Identity Provider"], desc: "Adversaries may exploit software vulnerabilities in an attempt to collect credentials." }, { id: "T1213", name: "Data from Information Repositories", tactics: ["TA0009"], platforms: ["Linux", "Windows", "macOS", "SaaS", "IaaS", "Office Suite"], desc: "Adversaries may leverage information repositories to mine valuable information." }, { id: "T1213.001", name: "Confluence", tactics: ["TA0009"], parent: "T1213", platforms: ["SaaS"], desc: "Adversaries may leverage Confluence repositories to mine valuable information." }, { id: "T1213.002", name: "Sharepoint", tactics: ["TA0009"], parent: "T1213", platforms: ["Office Suite", "Windows"], desc: "Adversaries may leverage the SharePoint repository as a source to mine valuable information." }, { id: "T1213.003", name: "Code Repositories", tactics: ["TA0009"], parent: "T1213", platforms: ["SaaS"], desc: "Adversaries may leverage code repositories to collect valuable information." }, { id: "T1213.004", name: "Customer Relationship Management Software", tactics: ["TA0009"], parent: "T1213", platforms: ["SaaS"], desc: "Adversaries may leverage Customer Relationship Management (CRM) software to mine valuable information." }, { id: "T1213.005", name: "Messaging Applications", tactics: ["TA0009"], parent: "T1213", platforms: ["Office Suite", "SaaS"], desc: "Adversaries may leverage chat and messaging applications, such as Microsoft Teams, Google Chat, and Slack, to mine valuable information." }, { id: "T1213.006", name: "Databases", tactics: ["TA0009"], parent: "T1213", platforms: ["IaaS", "Linux", "macOS", "SaaS", "Windows"], desc: "Adversaries may leverage databases to mine valuable information." }, { id: "T1216", name: "System Script Proxy Execution", tactics: ["TA0005"], platforms: ["Windows"], desc: "Adversaries may use trusted scripts, often signed with certificates, to proxy the execution of malicious files." }, { id: "T1216.001", name: "PubPrn", tactics: ["TA0005"], parent: "T1216", platforms: ["Windows"], desc: "Adversaries may use PubPrn to proxy execution of malicious remote files." }, { id: "T1216.002", name: "SyncAppvPublishingServer", tactics: ["TA0005"], parent: "T1216", platforms: ["Windows"], desc: "Adversaries may abuse SyncAppvPublishingServer.vbs to proxy execution of malicious PowerShell commands." }, { id: "T1217", name: "Browser Information Discovery", tactics: ["TA0007"], platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may enumerate information about browsers to learn more about compromised environments." }, { id: "T1218", name: "System Binary Proxy Execution", tactics: ["TA0005"], platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may bypass process and/or signature-based defenses by proxying execution of malicious content with signed, or otherwise trusted, binaries." }, { id: "T1218.001", name: "Compiled HTML File", tactics: ["TA0005"], parent: "T1218", platforms: ["Windows"], desc: "Adversaries may abuse Compiled HTML files (.chm) to conceal malicious code." }, { id: "T1218.002", name: "Control Panel", tactics: ["TA0005"], parent: "T1218", platforms: ["Windows"], desc: "Adversaries may abuse control.exe to proxy execution of malicious payloads." }, { id: "T1218.003", name: "CMSTP", tactics: ["TA0005"], parent: "T1218", platforms: ["Windows"], desc: "Adversaries may abuse CMSTP to proxy execution of malicious code." }, { id: "T1218.004", name: "InstallUtil", tactics: ["TA0005"], parent: "T1218", platforms: ["Windows"], desc: "Adversaries may use InstallUtil to proxy execution of code through a trusted Windows utility." }, { id: "T1218.005", name: "Mshta", tactics: ["TA0005"], parent: "T1218", platforms: ["Windows"], desc: "Adversaries may abuse mshta.exe to proxy execution of malicious .hta files and Javascript or VBScript through a trusted Windows utility." }, { id: "T1218.007", name: "Msiexec", tactics: ["TA0005"], parent: "T1218", platforms: ["Windows"], desc: "Adversaries may abuse msiexec.exe to proxy execution of malicious payloads." }, { id: "T1218.008", name: "Odbcconf", tactics: ["TA0005"], parent: "T1218", platforms: ["Windows"], desc: "Adversaries may abuse odbcconf.exe to proxy execution of malicious payloads." }, { id: "T1218.009", name: "Regsvcs/Regasm", tactics: ["TA0005"], parent: "T1218", platforms: ["Windows"], desc: "Adversaries may abuse Regsvcs and Regasm to proxy execution of code through a trusted Windows utility." }, { id: "T1218.010", name: "Regsvr32", tactics: ["TA0005"], parent: "T1218", platforms: ["Windows"], desc: "Adversaries may abuse Regsvr32.exe to proxy execution of malicious code." }, { id: "T1218.011", name: "Rundll32", tactics: ["TA0005"], parent: "T1218", platforms: ["Windows"], desc: "Adversaries may abuse rundll32.exe to proxy execution of malicious code." }, { id: "T1218.012", name: "Verclsid", tactics: ["TA0005"], parent: "T1218", platforms: ["Windows"], desc: "Adversaries may abuse verclsid.exe to proxy execution of malicious code." }, { id: "T1218.013", name: "Mavinject", tactics: ["TA0005"], parent: "T1218", platforms: ["Windows"], desc: "Adversaries may abuse mavinject.exe to proxy execution of malicious code." }, { id: "T1218.014", name: "MMC", tactics: ["TA0005"], parent: "T1218", platforms: ["Windows"], desc: "Adversaries may abuse mmc.exe to proxy execution of malicious .msc files." }, { id: "T1218.015", name: "Electron Applications", tactics: ["TA0005"], parent: "T1218", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may abuse components of the Electron framework to execute malicious code." }, { id: "T1219", name: "Remote Access Tools", tactics: ["TA0011"], platforms: ["Linux", "macOS", "Windows"], desc: "An adversary may use legitimate remote access tools to establish an interactive command and control channel within a network." }, { id: "T1219.001", name: "IDE Tunneling", tactics: ["TA0011"], parent: "T1219", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may abuse Integrated Development Environment (IDE) software with remote development features to establish an interactive command and control channel on target systems within a network." }, { id: "T1219.002", name: "Remote Desktop Software", tactics: ["TA0011"], parent: "T1219", platforms: ["Linux", "macOS", "Windows"], desc: "An adversary may use legitimate desktop support software to establish an interactive command and control channel to target systems within networks." }, { id: "T1219.003", name: "Remote Access Hardware", tactics: ["TA0011"], parent: "T1219", platforms: ["Linux", "macOS", "Windows"], desc: "An adversary may use legitimate remote access hardware to establish an interactive command and control channel to target systems within networks." }, { id: "T1220", name: "XSL Script Processing", tactics: ["TA0005"], platforms: ["Windows"], desc: "Adversaries may bypass application control and obscure execution of code by embedding scripts inside XSL files." }, { id: "T1221", name: "Template Injection", tactics: ["TA0005"], platforms: ["Windows"], desc: "Adversaries may create or modify references in user document templates to conceal malicious code or force authentication attempts." }, { id: "T1222", name: "File and Directory Permissions Modification", tactics: ["TA0112"], platforms: ["ESXi", "Linux", "macOS", "Windows"], desc: "Adversaries may modify file or directory permissions/attributes to evade access control lists (ACLs) and access protected files." }, { id: "T1222.001", name: "Windows Permissions", tactics: ["TA0112"], parent: "T1222", platforms: ["Windows"], desc: "Adversaries may modify file or directory permissions/attributes to evade access control lists (ACLs) and access protected files." }, { id: "T1222.002", name: "Linux and Mac Permissions", tactics: ["TA0112"], parent: "T1222", platforms: ["Linux", "macOS"], desc: "Adversaries may modify file or directory permissions/attributes to evade access control lists (ACLs) and access protected files." }, { id: "T1480", name: "Execution Guardrails", tactics: ["TA0005"], platforms: ["ESXi", "Linux", "macOS", "Windows"], desc: "Adversaries may use execution guardrails to constrain execution or actions based on adversary supplied and environment specific conditions that are expected to be present on the target." }, { id: "T1480.001", name: "Environmental Keying", tactics: ["TA0005"], parent: "T1480", platforms: ["Linux", "Windows", "macOS"], desc: "Adversaries may environmentally key payloads or other features of malware to evade defenses and constraint execution to a specific target environment." }, { id: "T1480.002", name: "Mutual Exclusion", tactics: ["TA0005"], parent: "T1480", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may constrain execution or actions based on the presence of a mutex associated with malware." }, { id: "T1482", name: "Domain Trust Discovery", tactics: ["TA0007"], platforms: ["Windows"], desc: "Adversaries may attempt to gather information on domain trust relationships that may be used to identify lateral movement opportunities in Windows multi-domain/forest environments." }, { id: "T1484", name: "Domain or Tenant Policy Modification", tactics: ["TA0112", "TA0004"], platforms: ["Windows", "Identity Provider"], desc: "Adversaries may modify the configuration settings of a domain or identity tenant to evade defenses and/or escalate privileges in centrally managed environments." }, { id: "T1484.001", name: "Group Policy Modification", tactics: ["TA0112", "TA0004"], parent: "T1484", platforms: ["Windows"], desc: "Adversaries may modify Group Policy Objects (GPOs) to subvert the intended discretionary access controls for a domain, usually with the intention of escalating privileges on the domain." }, { id: "T1484.002", name: "Trust Modification", tactics: ["TA0112", "TA0004"], parent: "T1484", platforms: ["Identity Provider", "Windows"], desc: "Adversaries may add new domain trusts, modify the properties of existing domain trusts, or otherwise change the configuration of trust relationships between domains and tenants to evade defenses and/or elevate privileges.Trust details, such as whether or not user identities are federated, allow authentication and au..." }, { id: "T1485", name: "Data Destruction", tactics: ["TA0040"], platforms: ["Containers", "ESXi", "IaaS", "Linux", "macOS", "Windows"], desc: "Adversaries may destroy data and files on specific systems or in large numbers on a network to interrupt availability to systems, services, and network resources." }, { id: "T1485.001", name: "Lifecycle-Triggered Deletion", tactics: ["TA0040"], parent: "T1485", platforms: ["IaaS"], desc: "Adversaries may modify the lifecycle policies of a cloud storage bucket to destroy all objects stored within." }, { id: "T1486", name: "Data Encrypted for Impact", tactics: ["TA0040"], platforms: ["ESXi", "IaaS", "Linux", "macOS", "Windows"], desc: "Adversaries may encrypt data on target systems or on large numbers of systems in a network to interrupt availability to system and network resources." }, { id: "T1489", name: "Service Stop", tactics: ["TA0040"], platforms: ["ESXi", "IaaS", "Linux", "macOS", "Windows"], desc: "Adversaries may stop or disable services on a system to render those services unavailable to legitimate users." }, { id: "T1490", name: "Inhibit System Recovery", tactics: ["TA0040"], platforms: ["Containers", "ESXi", "IaaS", "Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may delete or remove built-in data and turn off services designed to aid in the recovery of a corrupted system to prevent recovery." }, { id: "T1491", name: "Defacement", tactics: ["TA0040"], platforms: ["Windows", "IaaS", "Linux", "macOS", "ESXi"], desc: "Adversaries may modify visual content available internally or externally to an enterprise network, thus affecting the integrity of the original content." }, { id: "T1491.001", name: "Internal Defacement", tactics: ["TA0040"], parent: "T1491", platforms: ["ESXi", "Linux", "macOS", "Windows"], desc: "An adversary may deface systems internal to an organization in an attempt to intimidate or mislead users, thus discrediting the integrity of the systems." }, { id: "T1491.002", name: "External Defacement", tactics: ["TA0040"], parent: "T1491", platforms: ["Windows", "IaaS", "Linux", "macOS"], desc: "An adversary may deface systems external to an organization in an attempt to deliver messaging, intimidate, or otherwise mislead an organization or users." }, { id: "T1495", name: "Firmware Corruption", tactics: ["TA0040"], platforms: ["Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may overwrite or corrupt the flash memory contents of system BIOS or other firmware in devices attached to a system in order to render them inoperable or unable to boot, thus denying the availability to use the devices and/or the system." }, { id: "T1496", name: "Resource Hijacking", tactics: ["TA0040"], platforms: ["Windows", "IaaS", "Linux", "macOS", "Containers", "SaaS"], desc: "Adversaries may leverage the resources of co-opted systems to complete resource-intensive tasks, which may impact system and/or hosted service availability." }, { id: "T1496.001", name: "Compute Hijacking", tactics: ["TA0040"], parent: "T1496", platforms: ["Windows", "IaaS", "Linux", "macOS", "Containers"], desc: "Adversaries may leverage the compute resources of co-opted systems to complete resource-intensive tasks, which may impact system and/or hosted service availability." }, { id: "T1496.002", name: "Bandwidth Hijacking", tactics: ["TA0040"], parent: "T1496", platforms: ["Linux", "Windows", "macOS", "IaaS", "Containers"], desc: "Adversaries may leverage the network bandwidth resources of co-opted systems to complete resource-intensive tasks, which may impact system and/or hosted service availability." }, { id: "T1496.003", name: "SMS Pumping", tactics: ["TA0040"], parent: "T1496", platforms: ["SaaS"], desc: "Adversaries may leverage messaging services for SMS pumping, which may impact system and/or hosted service availability." }, { id: "T1496.004", name: "Cloud Service Hijacking", tactics: ["TA0040"], parent: "T1496", platforms: ["SaaS"], desc: "Adversaries may leverage compromised software-as-a-service (SaaS) applications to complete resource-intensive tasks, which may impact hosted service availability." }, { id: "T1497", name: "Virtualization/Sandbox Evasion", tactics: ["TA0005", "TA0007"], platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may employ various means to detect and avoid virtualization and analysis environments." }, { id: "T1497.001", name: "System Checks", tactics: ["TA0005", "TA0007"], parent: "T1497", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may employ various system checks to detect and avoid virtualization and analysis environments." }, { id: "T1497.002", name: "User Activity Based Checks", tactics: ["TA0005", "TA0007"], parent: "T1497", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may employ various user activity checks to detect and avoid virtualization and analysis environments." }, { id: "T1497.003", name: "Time Based Checks", tactics: ["TA0005", "TA0007"], parent: "T1497", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may employ various time-based methods to detect virtualization and analysis environments, particularly those that attempt to manipulate time mechanisms to simulate longer elapses of time." }, { id: "T1498", name: "Network Denial of Service", tactics: ["TA0040"], platforms: ["Windows", "IaaS", "Linux", "macOS", "Containers"], desc: "Adversaries may perform Network Denial of Service (DoS) attacks to degrade or block the availability of targeted resources to users." }, { id: "T1498.001", name: "Direct Network Flood", tactics: ["TA0040"], parent: "T1498", platforms: ["Windows", "IaaS", "Linux", "macOS"], desc: "Adversaries may attempt to cause a denial of service (DoS) by directly sending a high-volume of network traffic to a target." }, { id: "T1498.002", name: "Reflection Amplification", tactics: ["TA0040"], parent: "T1498", platforms: ["Windows", "IaaS", "Linux", "macOS"], desc: "Adversaries may attempt to cause a denial of service (DoS) by reflecting a high-volume of network traffic to a target." }, { id: "T1499", name: "Endpoint Denial of Service", tactics: ["TA0040"], platforms: ["Windows", "Linux", "macOS", "Containers", "IaaS"], desc: "Adversaries may perform Endpoint Denial of Service (DoS) attacks to degrade or block the availability of services to users." }, { id: "T1499.001", name: "OS Exhaustion Flood", tactics: ["TA0040"], parent: "T1499", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may launch a denial of service (DoS) attack targeting an endpoint's operating system (OS)." }, { id: "T1499.002", name: "Service Exhaustion Flood", tactics: ["TA0040"], parent: "T1499", platforms: ["Windows", "IaaS", "Linux", "macOS"], desc: "Adversaries may target the different network services provided by systems to conduct a denial of service (DoS)." }, { id: "T1499.003", name: "Application Exhaustion Flood", tactics: ["TA0040"], parent: "T1499", platforms: ["Windows", "IaaS", "Linux", "macOS"], desc: "Adversaries may target resource intensive features of applications to cause a denial of service (DoS), denying availability to those applications." }, { id: "T1499.004", name: "Application or System Exploitation", tactics: ["TA0040"], parent: "T1499", platforms: ["Windows", "IaaS", "Linux", "macOS"], desc: "Adversaries may exploit software vulnerabilities that can cause an application or system to crash and deny availability to users." }, { id: "T1505", name: "Server Software Component", tactics: ["TA0003"], platforms: ["Windows", "Linux", "macOS", "Network Devices", "ESXi"], desc: "Adversaries may abuse legitimate extensible development features of servers to establish persistent access to systems." }, { id: "T1505.001", name: "SQL Stored Procedures", tactics: ["TA0003"], parent: "T1505", platforms: ["Windows", "Linux"], desc: "Adversaries may abuse SQL stored procedures to establish persistent access to systems." }, { id: "T1505.002", name: "Transport Agent", tactics: ["TA0003"], parent: "T1505", platforms: ["Linux", "Windows"], desc: "Adversaries may abuse Microsoft transport agents to establish persistent access to systems." }, { id: "T1505.003", name: "Web Shell", tactics: ["TA0003"], parent: "T1505", platforms: ["Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may backdoor web servers with web shells to establish persistent access to systems." }, { id: "T1505.004", name: "IIS Components", tactics: ["TA0003"], parent: "T1505", platforms: ["Windows"], desc: "Adversaries may install malicious components that run on Internet Information Services (IIS) web servers to establish persistence." }, { id: "T1505.005", name: "Terminal Services DLL", tactics: ["TA0003"], parent: "T1505", platforms: ["Windows"], desc: "Adversaries may abuse components of Terminal Services to enable persistent access to systems." }, { id: "T1505.006", name: "vSphere Installation Bundles", tactics: ["TA0003"], parent: "T1505", platforms: ["ESXi"], desc: "Adversaries may abuse vSphere Installation Bundles (VIBs) to establish persistent access to ESXi hypervisors." }, { id: "T1518", name: "Software Discovery", tactics: ["TA0007"], platforms: ["ESXi", "IaaS", "Linux", "macOS", "Windows"], desc: "Adversaries may attempt to get a listing of software and software versions that are installed on a system or in a cloud environment." }, { id: "T1518.001", name: "Security Software Discovery", tactics: ["TA0007"], parent: "T1518", platforms: ["IaaS", "Linux", "macOS", "Windows"], desc: "Adversaries may attempt to get a listing of security software, configurations, defensive tools, and sensors that are installed on a system or in a cloud environment." }, { id: "T1518.002", name: "Backup Software Discovery", tactics: ["TA0007"], parent: "T1518", platforms: ["Windows", "macOS", "Linux"], desc: "Adversaries may attempt to get a listing of backup software or configurations that are installed on a system." }, { id: "T1525", name: "Implant Internal Image", tactics: ["TA0003"], platforms: ["IaaS", "Containers"], desc: "Adversaries may implant cloud or container images with malicious code to establish persistence after gaining access to an environment." }, { id: "T1526", name: "Cloud Service Discovery", tactics: ["TA0007"], platforms: ["IaaS", "Identity Provider", "Office Suite", "SaaS"], desc: "An adversary may attempt to enumerate the cloud services running on a system after gaining access." }, { id: "T1528", name: "Steal Application Access Token", tactics: ["TA0006"], platforms: ["Containers", "IaaS", "Identity Provider", "Office Suite", "SaaS"], desc: "Adversaries can steal application access tokens as a means of acquiring credentials to access remote systems and resources." }, { id: "T1529", name: "System Shutdown/Reboot", tactics: ["TA0040"], platforms: ["ESXi", "Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may shutdown/reboot systems to interrupt access to, or aid in the destruction of, those systems." }, { id: "T1530", name: "Data from Cloud Storage", tactics: ["TA0009"], platforms: ["IaaS", "Office Suite", "SaaS"], desc: "Adversaries may access data from cloud storage." }, { id: "T1531", name: "Account Access Removal", tactics: ["TA0040"], platforms: ["Linux", "macOS", "Windows", "SaaS", "IaaS", "Office Suite", "ESXi"], desc: "Adversaries may interrupt availability of system and network resources by inhibiting access to accounts utilized by legitimate users." }, { id: "T1534", name: "Internal Spearphishing", tactics: ["TA0008"], platforms: ["Linux", "macOS", "Office Suite", "SaaS", "Windows"], desc: "After they already have access to accounts or systems within the environment, adversaries may use internal spearphishing to gain access to additional information or compromise other users within the same organization." }, { id: "T1535", name: "Unused/Unsupported Cloud Regions", tactics: ["TA0005"], platforms: ["IaaS"], desc: "Adversaries may create cloud instances in unused geographic service regions in order to evade detection." }, { id: "T1537", name: "Transfer Data to Cloud Account", tactics: ["TA0010"], platforms: ["IaaS", "Office Suite", "SaaS"], desc: "Adversaries may exfiltrate data by transferring the data, including through sharing/syncing and creating backups of cloud environments, to another cloud account they control on the same service." }, { id: "T1538", name: "Cloud Service Dashboard", tactics: ["TA0007"], platforms: ["IaaS", "SaaS", "Office Suite", "Identity Provider"], desc: "An adversary may use a cloud service dashboard GUI with stolen credentials to gain useful information from an operational cloud environment, such as specific services, resources, and features." }, { id: "T1539", name: "Steal Web Session Cookie", tactics: ["TA0006"], platforms: ["Linux", "macOS", "Office Suite", "SaaS", "Windows"], desc: "An adversary may steal web application or service session cookies and use them to gain access to web applications or Internet services as an authenticated user without needing credentials." }, { id: "T1542", name: "Pre-OS Boot", tactics: ["TA0005", "TA0003"], platforms: ["Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may abuse Pre-OS Boot mechanisms as a way to establish persistence on a system." }, { id: "T1542.001", name: "System Firmware", tactics: ["TA0005", "TA0003"], parent: "T1542", platforms: ["Network Devices", "Windows"], desc: "Adversaries may modify system firmware to persist on systems.The BIOS (Basic Input/Output System) and The Unified Extensible Firmware Interface (UEFI) or Extensible Firmware Interface (EFI) are examples of system firmware that operate as the software interface between the operating system and hardware of a computer." }, { id: "T1542.002", name: "Component Firmware", tactics: ["TA0005", "TA0003"], parent: "T1542", platforms: ["Windows", "Linux", "macOS"], desc: "Adversaries may modify component firmware to persist on systems." }, { id: "T1542.003", name: "Bootkit", tactics: ["TA0005", "TA0003"], parent: "T1542", platforms: ["Linux", "Windows"], desc: "Adversaries may use bootkits to persist on systems." }, { id: "T1542.004", name: "ROMMONkit", tactics: ["TA0005", "TA0003"], parent: "T1542", platforms: ["Network Devices"], desc: "Adversaries may abuse the ROM Monitor (ROMMON) by loading an unauthorized firmware with adversary code to provide persistent access and manipulate device behavior that is difficult to detect." }, { id: "T1542.005", name: "TFTP Boot", tactics: ["TA0005", "TA0003"], parent: "T1542", platforms: ["Network Devices"], desc: "Adversaries may abuse netbooting to load an unauthorized network device operating system from a Trivial File Transfer Protocol (TFTP) server." }, { id: "T1543", name: "Create or Modify System Process", tactics: ["TA0003", "TA0004"], platforms: ["Containers", "Linux", "macOS", "Windows"], desc: "Adversaries may create or modify system-level processes to repeatedly execute malicious payloads as part of persistence." }, { id: "T1543.001", name: "Launch Agent", tactics: ["TA0003", "TA0004"], parent: "T1543", platforms: ["macOS"], desc: "Adversaries may create or modify launch agents to repeatedly execute malicious payloads as part of persistence." }, { id: "T1543.002", name: "Systemd Service", tactics: ["TA0003", "TA0004"], parent: "T1543", platforms: ["Linux"], desc: "Adversaries may create or modify systemd services to repeatedly execute malicious payloads as part of persistence." }, { id: "T1543.003", name: "Windows Service", tactics: ["TA0003", "TA0004"], parent: "T1543", platforms: ["Windows"], desc: "Adversaries may create or modify Windows services to repeatedly execute malicious payloads as part of persistence." }, { id: "T1543.004", name: "Launch Daemon", tactics: ["TA0003", "TA0004"], parent: "T1543", platforms: ["macOS"], desc: "Adversaries may create or modify Launch Daemons to execute malicious payloads as part of persistence." }, { id: "T1543.005", name: "Container Service", tactics: ["TA0003", "TA0004"], parent: "T1543", platforms: ["Containers"], desc: "Adversaries may create or modify container or container cluster management tools that run as daemons, agents, or services on individual hosts." }, { id: "T1546", name: "Event Triggered Execution", tactics: ["TA0004", "TA0003"], platforms: ["Linux", "macOS", "Windows", "SaaS", "IaaS", "Office Suite"], desc: "Adversaries may establish persistence and/or elevate privileges using system mechanisms that trigger execution based on specific events." }, { id: "T1546.001", name: "Change Default File Association", tactics: ["TA0004", "TA0003"], parent: "T1546", platforms: ["Windows"], desc: "Adversaries may establish persistence by executing malicious content triggered by a file type association." }, { id: "T1546.002", name: "Screensaver", tactics: ["TA0004", "TA0003"], parent: "T1546", platforms: ["Windows"], desc: "Adversaries may establish persistence by executing malicious content triggered by user inactivity." }, { id: "T1546.003", name: "Windows Management Instrumentation Event Subscription", tactics: ["TA0004", "TA0003"], parent: "T1546", platforms: ["Windows"], desc: "Adversaries may establish persistence and elevate privileges by executing malicious content triggered by a Windows Management Instrumentation (WMI) event subscription." }, { id: "T1546.004", name: "Unix Shell Configuration Modification", tactics: ["TA0004", "TA0003"], parent: "T1546", platforms: ["Linux", "macOS"], desc: "Adversaries may establish persistence through executing malicious commands triggered by a user\u2019s shell." }, { id: "T1546.005", name: "Trap", tactics: ["TA0004", "TA0003"], parent: "T1546", platforms: ["macOS", "Linux"], desc: "Adversaries may establish persistence by executing malicious content triggered by an interrupt signal." }, { id: "T1546.006", name: "LC_LOAD_DYLIB Addition", tactics: ["TA0004", "TA0003"], parent: "T1546", platforms: ["macOS"], desc: "Adversaries may establish persistence by executing malicious content triggered by the execution of tainted binaries." }, { id: "T1546.007", name: "Netsh Helper DLL", tactics: ["TA0004", "TA0003"], parent: "T1546", platforms: ["Windows"], desc: "Adversaries may establish persistence by executing malicious content triggered by Netsh Helper DLLs." }, { id: "T1546.008", name: "Accessibility Features", tactics: ["TA0004", "TA0003"], parent: "T1546", platforms: ["Windows"], desc: "Adversaries may establish persistence and/or elevate privileges by executing malicious content triggered by accessibility features." }, { id: "T1546.009", name: "AppCert DLLs", tactics: ["TA0004", "TA0003"], parent: "T1546", platforms: ["Windows"], desc: "Adversaries may establish persistence and/or elevate privileges by executing malicious content triggered by AppCert DLLs loaded into processes." }, { id: "T1546.010", name: "AppInit DLLs", tactics: ["TA0004", "TA0003"], parent: "T1546", platforms: ["Windows"], desc: "Adversaries may establish persistence and/or elevate privileges by executing malicious content triggered by AppInit DLLs loaded into processes." }, { id: "T1546.011", name: "Application Shimming", tactics: ["TA0004", "TA0003"], parent: "T1546", platforms: ["Windows"], desc: "Adversaries may establish persistence and/or elevate privileges by executing malicious content triggered by application shims." }, { id: "T1546.012", name: "Image File Execution Options Injection", tactics: ["TA0004", "TA0003"], parent: "T1546", platforms: ["Windows"], desc: "Adversaries may establish persistence and/or elevate privileges by executing malicious content triggered by Image File Execution Options (IFEO) debuggers." }, { id: "T1546.013", name: "PowerShell Profile", tactics: ["TA0004", "TA0003"], parent: "T1546", platforms: ["Windows"], desc: "Adversaries may gain persistence and elevate privileges by executing malicious content triggered by PowerShell profiles." }, { id: "T1546.014", name: "Emond", tactics: ["TA0004", "TA0003"], parent: "T1546", platforms: ["macOS"], desc: "Adversaries may gain persistence and elevate privileges by executing malicious content triggered by the Event Monitor Daemon (emond)." }, { id: "T1546.015", name: "Component Object Model Hijacking", tactics: ["TA0004", "TA0003"], parent: "T1546", platforms: ["Windows"], desc: "Adversaries may establish persistence by executing malicious content triggered by hijacked references to Component Object Model (COM) objects." }, { id: "T1546.016", name: "Installer Packages", tactics: ["TA0004", "TA0003"], parent: "T1546", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may establish persistence and elevate privileges by using an installer to trigger the execution of malicious content." }, { id: "T1546.017", name: "Udev Rules", tactics: ["TA0003", "TA0004"], parent: "T1546", platforms: ["Linux"], desc: "Adversaries may maintain persistence through executing malicious content triggered using udev rules." }, { id: "T1546.018", name: "Python Startup Hooks", tactics: ["TA0003", "TA0004"], parent: "T1546", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may achieve persistence by leveraging Python\u2019s startup mechanisms, including path configuration (`.pth`) files and the `sitecustomize.py` or `usercustomize.py` modules." }, { id: "T1547", name: "Boot or Logon Autostart Execution", tactics: ["TA0003", "TA0004"], platforms: ["Linux", "macOS", "Windows", "Network Devices"], desc: "Adversaries may configure system settings to automatically execute a program during system boot or logon to maintain persistence or gain higher-level privileges on compromised systems." }, { id: "T1547.001", name: "Registry Run Keys / Startup Folder", tactics: ["TA0003", "TA0004"], parent: "T1547", platforms: ["Windows"], desc: "Adversaries may achieve persistence by adding a program to a startup folder or referencing it with a Registry run key." }, { id: "T1547.002", name: "Authentication Package", tactics: ["TA0003", "TA0004"], parent: "T1547", platforms: ["Windows"], desc: "Adversaries may abuse authentication packages to execute DLLs when the system boots." }, { id: "T1547.003", name: "Time Providers", tactics: ["TA0003", "TA0004"], parent: "T1547", platforms: ["Windows"], desc: "Adversaries may abuse time providers to execute DLLs when the system boots." }, { id: "T1547.004", name: "Winlogon Helper DLL", tactics: ["TA0003", "TA0004"], parent: "T1547", platforms: ["Windows"], desc: "Adversaries may abuse features of Winlogon to execute DLLs and/or executables when a user logs in." }, { id: "T1547.005", name: "Security Support Provider", tactics: ["TA0003", "TA0004"], parent: "T1547", platforms: ["Windows"], desc: "Adversaries may abuse security support providers (SSPs) to execute DLLs when the system boots." }, { id: "T1547.006", name: "Kernel Modules and Extensions", tactics: ["TA0003", "TA0004"], parent: "T1547", platforms: ["macOS", "Linux"], desc: "Adversaries may modify the kernel to automatically execute programs on system boot." }, { id: "T1547.007", name: "Re-opened Applications", tactics: ["TA0003", "TA0004"], parent: "T1547", platforms: ["macOS"], desc: "Adversaries may modify plist files to automatically run an application when a user logs in." }, { id: "T1547.008", name: "LSASS Driver", tactics: ["TA0003", "TA0004"], parent: "T1547", platforms: ["Windows"], desc: "Adversaries may modify or add LSASS drivers to obtain persistence on compromised systems." }, { id: "T1547.009", name: "Shortcut Modification", tactics: ["TA0003", "TA0004"], parent: "T1547", platforms: ["Windows"], desc: "Adversaries may create or modify shortcuts that can execute a program during system boot or user login." }, { id: "T1547.010", name: "Port Monitors", tactics: ["TA0003", "TA0004"], parent: "T1547", platforms: ["Windows"], desc: "Adversaries may use port monitors to run an adversary supplied DLL during system boot for persistence or privilege escalation." }, { id: "T1547.012", name: "Print Processors", tactics: ["TA0003", "TA0004"], parent: "T1547", platforms: ["Windows"], desc: "Adversaries may abuse print processors to run malicious DLLs during system boot for persistence and/or privilege escalation." }, { id: "T1547.013", name: "XDG Autostart Entries", tactics: ["TA0003", "TA0004"], parent: "T1547", platforms: ["Linux"], desc: "Adversaries may add or modify XDG Autostart Entries to execute malicious programs or commands when a user\u2019s desktop environment is loaded at login." }, { id: "T1547.014", name: "Active Setup", tactics: ["TA0003", "TA0004"], parent: "T1547", platforms: ["Windows"], desc: "Adversaries may achieve persistence by adding a Registry key to the Active Setup of the local machine." }, { id: "T1547.015", name: "Login Items", tactics: ["TA0003", "TA0004"], parent: "T1547", platforms: ["macOS"], desc: "Adversaries may add login items to execute upon user login to gain persistence or escalate privileges." }, { id: "T1548", name: "Abuse Elevation Control Mechanism", tactics: ["TA0004"], platforms: ["Linux", "macOS", "Windows", "IaaS", "Office Suite", "Identity Provider"], desc: "Adversaries may circumvent mechanisms designed to control privilege elevation to gain higher-level permissions." }, { id: "T1548.001", name: "Setuid and Setgid", tactics: ["TA0004"], parent: "T1548", platforms: ["Linux", "macOS"], desc: "An adversary may abuse configurations where an application has the setuid or setgid bits set in order to get code running in a different (and possibly more privileged) user\u2019s context." }, { id: "T1548.002", name: "Bypass User Account Control", tactics: ["TA0004"], parent: "T1548", platforms: ["Windows"], desc: "Adversaries may bypass UAC mechanisms to elevate process privileges on system." }, { id: "T1548.003", name: "Sudo and Sudo Caching", tactics: ["TA0004"], parent: "T1548", platforms: ["Linux", "macOS"], desc: "Adversaries may perform sudo caching and/or use the sudoers file to elevate privileges." }, { id: "T1548.004", name: "Elevated Execution with Prompt", tactics: ["TA0004"], parent: "T1548", platforms: ["macOS"], desc: "Adversaries may leverage the AuthorizationExecuteWithPrivileges API to escalate privileges by prompting the user for credentials." }, { id: "T1548.005", name: "Temporary Elevated Cloud Access", tactics: ["TA0004"], parent: "T1548", platforms: ["IaaS", "Office Suite", "Identity Provider"], desc: "Adversaries may abuse permission configurations that allow them to gain temporarily elevated access to cloud resources." }, { id: "T1548.006", name: "TCC Manipulation", tactics: ["TA0004"], parent: "T1548", platforms: ["macOS"], desc: "Adversaries can manipulate or abuse the Transparency, Consent, & Control (TCC) service or database to grant malicious executables elevated permissions." }, { id: "T1550", name: "Use Alternate Authentication Material", tactics: ["TA0008"], platforms: ["Containers", "IaaS", "Identity Provider", "Linux", "Office Suite", "SaaS", "Windows"], desc: "Adversaries may use alternate authentication material, such as password hashes, Kerberos tickets, and application access tokens, in order to move laterally within an environment and bypass normal system access controls." }, { id: "T1550.001", name: "Application Access Token", tactics: ["TA0008"], parent: "T1550", platforms: ["Containers", "IaaS", "Identity Provider", "Office Suite", "SaaS"], desc: "Adversaries may use stolen application access tokens to bypass the typical authentication process and access restricted accounts, information, or services on remote systems." }, { id: "T1550.002", name: "Pass the Hash", tactics: ["TA0008"], parent: "T1550", platforms: ["Windows"], desc: "Adversaries may \u201Cpass the hash\u201D using stolen password hashes to move laterally within an environment, bypassing normal system access controls." }, { id: "T1550.003", name: "Pass the Ticket", tactics: ["TA0008"], parent: "T1550", platforms: ["Windows"], desc: "Adversaries may \u201Cpass the ticket\u201D using stolen Kerberos tickets to move laterally within an environment, bypassing normal system access controls." }, { id: "T1550.004", name: "Web Session Cookie", tactics: ["TA0008"], parent: "T1550", platforms: ["IaaS", "Office Suite", "SaaS"], desc: "Adversaries can use stolen session cookies to authenticate to web applications and services." }, { id: "T1552", name: "Unsecured Credentials", tactics: ["TA0006"], platforms: ["Windows", "SaaS", "IaaS", "Linux", "macOS", "Containers", "Network Devices", "Office Suite", "Identity Provider"], desc: "Adversaries may search compromised systems to find and obtain insecurely stored credentials." }, { id: "T1552.001", name: "Credentials In Files", tactics: ["TA0006"], parent: "T1552", platforms: ["Containers", "IaaS", "Linux", "macOS", "Windows"], desc: "Adversaries may search local file systems and remote file shares for files containing insecurely stored credentials." }, { id: "T1552.002", name: "Credentials in Registry", tactics: ["TA0006"], parent: "T1552", platforms: ["Windows"], desc: "Adversaries may search the Registry on compromised systems for insecurely stored credentials." }, { id: "T1552.003", name: "Shell History", tactics: ["TA0006"], parent: "T1552", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may search the command history on compromised systems for insecurely stored credentials." }, { id: "T1552.004", name: "Private Keys", tactics: ["TA0006"], parent: "T1552", platforms: ["Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may search for private key certificate files on compromised systems for insecurely stored credentials." }, { id: "T1552.005", name: "Cloud Instance Metadata API", tactics: ["TA0006"], parent: "T1552", platforms: ["IaaS"], desc: "Adversaries may attempt to access the Cloud Instance Metadata API to collect credentials and other sensitive data." }, { id: "T1552.006", name: "Group Policy Preferences", tactics: ["TA0006"], parent: "T1552", platforms: ["Windows"], desc: "Adversaries may attempt to find unsecured credentials in Group Policy Preferences (GPP)." }, { id: "T1552.007", name: "Container API", tactics: ["TA0006"], parent: "T1552", platforms: ["Containers"], desc: "Adversaries may gather credentials via APIs within a containers environment." }, { id: "T1552.008", name: "Chat Messages", tactics: ["TA0006"], parent: "T1552", platforms: ["SaaS", "Office Suite"], desc: "Adversaries may directly collect unsecured credentials stored or passed through user communication services." }, { id: "T1553", name: "Subvert Trust Controls", tactics: ["TA0112"], platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may undermine security controls that will either warn users of untrusted activity or prevent execution of untrusted programs." }, { id: "T1553.001", name: "Gatekeeper Bypass", tactics: ["TA0112"], parent: "T1553", platforms: ["macOS"], desc: "Adversaries may modify file attributes and subvert Gatekeeper functionality to evade user prompts and execute untrusted programs." }, { id: "T1553.002", name: "Code Signing", tactics: ["TA0112"], parent: "T1553", platforms: ["macOS", "Windows"], desc: "Adversaries may create, acquire, or steal code signing materials to sign their malware or tools." }, { id: "T1553.003", name: "SIP and Trust Provider Hijacking", tactics: ["TA0112"], parent: "T1553", platforms: ["Windows"], desc: "Adversaries may tamper with SIP and trust provider components to mislead the operating system and application control tools when conducting signature validation checks." }, { id: "T1553.004", name: "Install Root Certificate", tactics: ["TA0112"], parent: "T1553", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may install a root certificate on a compromised system to avoid warnings when connecting to adversary controlled web servers." }, { id: "T1553.005", name: "Mark-of-the-Web Bypass", tactics: ["TA0112"], parent: "T1553", platforms: ["Windows"], desc: "Adversaries may abuse specific file formats to subvert Mark-of-the-Web (MOTW) controls." }, { id: "T1553.006", name: "Code Signing Policy Modification", tactics: ["TA0112"], parent: "T1553", platforms: ["macOS", "Windows"], desc: "Adversaries may modify code signing policies to enable execution of unsigned or self-signed code." }, { id: "T1554", name: "Compromise Host Software Binary", tactics: ["TA0003"], platforms: ["ESXi", "Linux", "macOS", "Windows"], desc: "Adversaries may modify host software binaries to establish persistent access to systems." }, { id: "T1555", name: "Credentials from Password Stores", tactics: ["TA0006"], platforms: ["IaaS", "Linux", "macOS", "Windows"], desc: "Adversaries may search for common password storage locations to obtain user credentials." }, { id: "T1555.001", name: "Keychain", tactics: ["TA0006"], parent: "T1555", platforms: ["macOS"], desc: "Adversaries may acquire credentials from Keychain." }, { id: "T1555.002", name: "Securityd Memory", tactics: ["TA0006"], parent: "T1555", platforms: ["Linux", "macOS"], desc: "An adversary with root access may gather credentials by reading `securityd`\u2019s memory." }, { id: "T1555.003", name: "Credentials from Web Browsers", tactics: ["TA0006"], parent: "T1555", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may acquire credentials from web browsers by reading files specific to the target browser." }, { id: "T1555.004", name: "Windows Credential Manager", tactics: ["TA0006"], parent: "T1555", platforms: ["Windows"], desc: "Adversaries may acquire credentials from the Windows Credential Manager." }, { id: "T1555.005", name: "Password Managers", tactics: ["TA0006"], parent: "T1555", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may acquire user credentials from third-party password managers." }, { id: "T1555.006", name: "Cloud Secrets Management Stores", tactics: ["TA0006"], parent: "T1555", platforms: ["IaaS"], desc: "Adversaries may acquire credentials from cloud-native secret management solutions such as AWS Secrets Manager, GCP Secret Manager, Azure Key Vault, and Terraform Vault." }, { id: "T1556", name: "Modify Authentication Process", tactics: ["TA0112", "TA0003", "TA0006"], platforms: ["IaaS", "Identity Provider", "Linux", "macOS", "Network Devices", "Office Suite", "SaaS", "Windows"], desc: "Adversaries may modify authentication mechanisms and processes to access user credentials or enable otherwise unwarranted access to accounts." }, { id: "T1556.001", name: "Domain Controller Authentication", tactics: ["TA0112", "TA0003", "TA0006"], parent: "T1556", platforms: ["Windows"], desc: "Adversaries may patch the authentication process on a domain controller to bypass the typical authentication mechanisms and enable access to accounts." }, { id: "T1556.002", name: "Password Filter DLL", tactics: ["TA0112", "TA0003", "TA0006"], parent: "T1556", platforms: ["Windows"], desc: "Adversaries may register malicious password filter dynamic link libraries (DLLs) into the authentication process to acquire user credentials as they are validated." }, { id: "T1556.003", name: "Pluggable Authentication Modules", tactics: ["TA0112", "TA0003", "TA0006"], parent: "T1556", platforms: ["Linux", "macOS"], desc: "Adversaries may modify pluggable authentication modules (PAM) to access user credentials or enable otherwise unwarranted access to accounts." }, { id: "T1556.004", name: "Network Device Authentication", tactics: ["TA0112", "TA0003", "TA0006"], parent: "T1556", platforms: ["Network Devices"], desc: "Adversaries may use Patch System Image to hard code a password in the operating system, thus bypassing of native authentication mechanisms for local accounts on network devices." }, { id: "T1556.005", name: "Reversible Encryption", tactics: ["TA0112", "TA0003", "TA0006"], parent: "T1556", platforms: ["Windows"], desc: "An adversary may abuse Active Directory authentication encryption properties to gain access to credentials on Windows systems." }, { id: "T1556.006", name: "Multi-Factor Authentication", tactics: ["TA0112", "TA0003", "TA0006"], parent: "T1556", platforms: ["IaaS", "Identity Provider", "Linux", "macOS", "Office Suite", "SaaS", "Windows"], desc: "Adversaries may disable or modify multi-factor authentication (MFA) mechanisms to enable persistent access to compromised accounts." }, { id: "T1556.007", name: "Hybrid Identity", tactics: ["TA0112", "TA0003", "TA0006"], parent: "T1556", platforms: ["IaaS", "Identity Provider", "Office Suite", "SaaS", "Windows"], desc: "Adversaries may patch, modify, or otherwise backdoor cloud authentication processes that are tied to on-premises user identities in order to bypass typical authentication mechanisms, access credentials, and enable persistent access to accounts." }, { id: "T1556.008", name: "Network Provider DLL", tactics: ["TA0112", "TA0003", "TA0006"], parent: "T1556", platforms: ["Windows"], desc: "Adversaries may register malicious network provider dynamic link libraries (DLLs) to capture cleartext user credentials during the authentication process." }, { id: "T1556.009", name: "Conditional Access Policies", tactics: ["TA0112", "TA0003", "TA0006"], parent: "T1556", platforms: ["IaaS", "Identity Provider"], desc: "Adversaries may disable or modify conditional access policies to enable persistent access to compromised accounts." }, { id: "T1557", name: "Adversary-in-the-Middle", tactics: ["TA0006", "TA0009"], platforms: ["Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may attempt to position themselves between two or more networked devices using an adversary-in-the-middle (AiTM) technique to support follow-on behaviors such as Network Sniffing, Transmitted Data Manipulation, or replay attacks (Exploitation for Credential Access)." }, { id: "T1557.001", name: "Name Resolution Poisoning and SMB Relay", tactics: ["TA0006", "TA0009"], parent: "T1557", platforms: ["Windows"], desc: "By responding to LLMNR/NBT-NS/mDNS network traffic, adversaries may spoof an authoritative source for name resolution to force communication with an adversary controlled system." }, { id: "T1557.002", name: "ARP Cache Poisoning", tactics: ["TA0006", "TA0009"], parent: "T1557", platforms: ["Linux", "Windows", "macOS"], desc: "Adversaries may poison Address Resolution Protocol (ARP) caches to position themselves between the communication of two or more networked devices." }, { id: "T1557.003", name: "DHCP Spoofing", tactics: ["TA0006", "TA0009"], parent: "T1557", platforms: ["Linux", "Windows", "macOS"], desc: "Adversaries may redirect network traffic to adversary-owned systems by spoofing Dynamic Host Configuration Protocol (DHCP) traffic and acting as a malicious DHCP server on the victim network." }, { id: "T1557.004", name: "Evil Twin", tactics: ["TA0006", "TA0009"], parent: "T1557", platforms: ["Network Devices"], desc: "Adversaries may host seemingly genuine Wi-Fi access points to deceive users into connecting to malicious networks as a way of supporting follow-on behaviors such as Network Sniffing, Transmitted Data Manipulation, or Input Capture." }, { id: "T1558", name: "Steal or Forge Kerberos Tickets", tactics: ["TA0006"], platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may attempt to subvert Kerberos authentication by stealing or forging Kerberos tickets to enable Pass the Ticket." }, { id: "T1558.001", name: "Golden Ticket", tactics: ["TA0006"], parent: "T1558", platforms: ["Windows"], desc: "Adversaries who have the KRBTGT account password hash may forge Kerberos ticket-granting tickets (TGT), also known as a golden ticket." }, { id: "T1558.002", name: "Silver Ticket", tactics: ["TA0006"], parent: "T1558", platforms: ["Windows"], desc: "Adversaries who have the password hash of a target service account (e.g." }, { id: "T1558.003", name: "Kerberoasting", tactics: ["TA0006"], parent: "T1558", platforms: ["Windows"], desc: "Adversaries may abuse a valid Kerberos ticket-granting ticket (TGT) or sniff network traffic to obtain a ticket-granting service (TGS) ticket that may be vulnerable to Brute Force." }, { id: "T1558.004", name: "AS-REP Roasting", tactics: ["TA0006"], parent: "T1558", platforms: ["Windows"], desc: "Adversaries may reveal credentials of accounts that have disabled Kerberos preauthentication by Password Cracking Kerberos messages." }, { id: "T1558.005", name: "Ccache Files", tactics: ["TA0006"], parent: "T1558", platforms: ["Linux", "macOS"], desc: "Adversaries may attempt to steal Kerberos tickets stored in credential cache files (or ccache)." }, { id: "T1559", name: "Inter-Process Communication", tactics: ["TA0002"], platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may abuse inter-process communication (IPC) mechanisms for local code or command execution." }, { id: "T1559.001", name: "Component Object Model", tactics: ["TA0002"], parent: "T1559", platforms: ["Windows"], desc: "Adversaries may use the Windows Component Object Model (COM) for local code execution." }, { id: "T1559.002", name: "Dynamic Data Exchange", tactics: ["TA0002"], parent: "T1559", platforms: ["Windows"], desc: "Adversaries may use Windows Dynamic Data Exchange (DDE) to execute arbitrary commands." }, { id: "T1559.003", name: "XPC Services", tactics: ["TA0002"], parent: "T1559", platforms: ["macOS"], desc: "Adversaries can provide malicious content to an XPC service daemon for local code execution." }, { id: "T1560", name: "Archive Collected Data", tactics: ["TA0009"], platforms: ["Linux", "macOS", "Windows"], desc: "An adversary may compress and/or encrypt data that is collected prior to exfiltration." }, { id: "T1560.001", name: "Archive via Utility", tactics: ["TA0009"], parent: "T1560", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may use utilities to compress and/or encrypt collected data prior to exfiltration." }, { id: "T1560.002", name: "Archive via Library", tactics: ["TA0009"], parent: "T1560", platforms: ["Linux", "macOS", "Windows"], desc: "An adversary may compress or encrypt data that is collected prior to exfiltration using 3rd party libraries." }, { id: "T1560.003", name: "Archive via Custom Method", tactics: ["TA0009"], parent: "T1560", platforms: ["Linux", "macOS", "Windows"], desc: "An adversary may compress or encrypt data that is collected prior to exfiltration using a custom method." }, { id: "T1561", name: "Disk Wipe", tactics: ["TA0040"], platforms: ["Linux", "macOS", "Windows", "Network Devices"], desc: "Adversaries may wipe or corrupt raw disk data on specific systems or in large numbers in a network to interrupt availability to system and network resources." }, { id: "T1561.001", name: "Disk Content Wipe", tactics: ["TA0040"], parent: "T1561", platforms: ["Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may erase the contents of storage devices on specific systems or in large numbers in a network to interrupt availability to system and network resources." }, { id: "T1561.002", name: "Disk Structure Wipe", tactics: ["TA0040"], parent: "T1561", platforms: ["Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may corrupt or wipe the disk data structures on a hard drive necessary to boot a system; targeting specific critical systems or in large numbers in a network to interrupt availability to system and network resources." }, { id: "T1563", name: "Remote Service Session Hijacking", tactics: ["TA0008"], platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may take control of preexisting sessions with remote services to move laterally in an environment." }, { id: "T1563.001", name: "SSH Hijacking", tactics: ["TA0008"], parent: "T1563", platforms: ["Linux", "macOS"], desc: "Adversaries may hijack a legitimate user's SSH session to move laterally within an environment." }, { id: "T1563.002", name: "RDP Hijacking", tactics: ["TA0008"], parent: "T1563", platforms: ["Windows"], desc: "Adversaries may hijack a legitimate user\u2019s remote desktop session to move laterally within an environment." }, { id: "T1564", name: "Hide Artifacts", tactics: ["TA0005"], platforms: ["ESXi", "Linux", "macOS", "Office Suite", "Windows"], desc: "Adversaries may attempt to hide artifacts associated with their behaviors to evade detection." }, { id: "T1564.001", name: "Hidden Files and Directories", tactics: ["TA0005"], parent: "T1564", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may set files and directories to be hidden to evade detection mechanisms." }, { id: "T1564.002", name: "Hidden Users", tactics: ["TA0005"], parent: "T1564", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may use hidden users to hide the presence of user accounts they create or modify." }, { id: "T1564.003", name: "Hidden Window", tactics: ["TA0005"], parent: "T1564", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may use hidden windows to conceal malicious activity from the plain sight of users." }, { id: "T1564.004", name: "NTFS File Attributes", tactics: ["TA0005"], parent: "T1564", platforms: ["Windows"], desc: "Adversaries may use NTFS file attributes to hide their malicious data in order to evade detection." }, { id: "T1564.005", name: "Hidden File System", tactics: ["TA0005"], parent: "T1564", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may use a hidden file system to conceal malicious activity from users and security tools." }, { id: "T1564.006", name: "Run Virtual Instance", tactics: ["TA0005"], parent: "T1564", platforms: ["ESXi", "Linux", "macOS", "Windows"], desc: "Adversaries may carry out malicious operations using a virtual instance to avoid detection." }, { id: "T1564.007", name: "VBA Stomping", tactics: ["TA0005"], parent: "T1564", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may hide malicious Visual Basic for Applications (VBA) payloads embedded within MS Office documents by replacing the VBA source code with benign data." }, { id: "T1564.008", name: "Email Hiding Rules", tactics: ["TA0005"], parent: "T1564", platforms: ["Windows", "Linux", "macOS", "Office Suite"], desc: "Adversaries may use email rules to hide inbound emails in a compromised user's mailbox." }, { id: "T1564.009", name: "Resource Forking", tactics: ["TA0005"], parent: "T1564", platforms: ["macOS"], desc: "Adversaries may abuse resource forks to hide malicious code or executables to evade detection and bypass security applications." }, { id: "T1564.010", name: "Process Argument Spoofing", tactics: ["TA0005"], parent: "T1564", platforms: ["Windows"], desc: "Adversaries may attempt to hide process command-line arguments by overwriting process memory." }, { id: "T1564.011", name: "Ignore Process Interrupts", tactics: ["TA0005"], parent: "T1564", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may evade defensive mechanisms by executing commands that hide from process interrupt signals." }, { id: "T1564.012", name: "File/Path Exclusions", tactics: ["TA0005"], parent: "T1564", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may attempt to hide their file-based artifacts by writing them to specific folders or file names excluded from antivirus (AV) scanning and other defensive capabilities." }, { id: "T1564.013", name: "Bind Mounts", tactics: ["TA0005"], parent: "T1564", platforms: ["Linux"], desc: "Adversaries may abuse bind mounts on file structures to hide their activity and artifacts from native utilities." }, { id: "T1564.014", name: "Extended Attributes", tactics: ["TA0005"], parent: "T1564", platforms: ["Linux", "macOS"], desc: "Adversaries may abuse extended attributes (xattrs) on macOS and Linux to hide their malicious data in order to evade detection." }, { id: "T1565", name: "Data Manipulation", tactics: ["TA0040"], platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may insert, delete, or manipulate data in order to influence external outcomes or hide activity, thus threatening the integrity of the data." }, { id: "T1565.001", name: "Stored Data Manipulation", tactics: ["TA0040"], parent: "T1565", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may insert, delete, or manipulate data at rest in order to influence external outcomes or hide activity, thus threatening the integrity of the data." }, { id: "T1565.002", name: "Transmitted Data Manipulation", tactics: ["TA0040"], parent: "T1565", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may alter data en route to storage or other systems in order to manipulate external outcomes or hide activity, thus threatening the integrity of the data." }, { id: "T1565.003", name: "Runtime Data Manipulation", tactics: ["TA0040"], parent: "T1565", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may modify systems in order to manipulate the data as it is accessed and displayed to an end user, thus threatening the integrity of the data." }, { id: "T1566", name: "Phishing", tactics: ["TA0001"], platforms: ["Identity Provider", "Linux", "macOS", "Office Suite", "SaaS", "Windows"], desc: "Adversaries may send phishing messages to gain access to victim systems." }, { id: "T1566.001", name: "Spearphishing Attachment", tactics: ["TA0001"], parent: "T1566", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may send spearphishing emails with a malicious attachment in an attempt to gain access to victim systems." }, { id: "T1566.002", name: "Spearphishing Link", tactics: ["TA0001"], parent: "T1566", platforms: ["Identity Provider", "Linux", "macOS", "Office Suite", "SaaS", "Windows"], desc: "Adversaries may send spearphishing emails with a malicious link in an attempt to gain access to victim systems." }, { id: "T1566.003", name: "Spearphishing via Service", tactics: ["TA0001"], parent: "T1566", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may send spearphishing messages via third-party services in an attempt to gain access to victim systems." }, { id: "T1566.004", name: "Spearphishing Voice", tactics: ["TA0001"], parent: "T1566", platforms: ["Linux", "macOS", "Windows", "Identity Provider"], desc: "Adversaries may use voice communications to ultimately gain access to victim systems." }, { id: "T1567", name: "Exfiltration Over Web Service", tactics: ["TA0010"], platforms: ["ESXi", "Linux", "macOS", "Office Suite", "SaaS", "Windows"], desc: "Adversaries may use an existing, legitimate external Web service to exfiltrate data rather than their primary command and control channel." }, { id: "T1567.001", name: "Exfiltration to Code Repository", tactics: ["TA0010"], parent: "T1567", platforms: ["ESXi", "Linux", "macOS", "Windows"], desc: "Adversaries may exfiltrate data to a code repository rather than over their primary command and control channel." }, { id: "T1567.002", name: "Exfiltration to Cloud Storage", tactics: ["TA0010"], parent: "T1567", platforms: ["ESXi", "Linux", "macOS", "Windows"], desc: "Adversaries may exfiltrate data to a cloud storage service rather than over their primary command and control channel." }, { id: "T1567.003", name: "Exfiltration to Text Storage Sites", tactics: ["TA0010"], parent: "T1567", platforms: ["Linux", "macOS", "Windows", "ESXi"], desc: "Adversaries may exfiltrate data to text storage sites instead of their primary command and control channel." }, { id: "T1567.004", name: "Exfiltration Over Webhook", tactics: ["TA0010"], parent: "T1567", platforms: ["ESXi", "Linux", "macOS", "Office Suite", "SaaS", "Windows"], desc: "Adversaries may exfiltrate data to a webhook endpoint rather than over their primary command and control channel." }, { id: "T1568", name: "Dynamic Resolution", tactics: ["TA0011"], platforms: ["ESXi", "Linux", "macOS", "Windows"], desc: "Adversaries may dynamically establish connections to command and control infrastructure to evade common detections and remediations." }, { id: "T1568.001", name: "Fast Flux DNS", tactics: ["TA0011"], parent: "T1568", platforms: ["Linux", "macOS", "Windows", "ESXi"], desc: "Adversaries may use Fast Flux DNS to hide a command and control channel behind an array of rapidly changing IP addresses linked to a single domain resolution." }, { id: "T1568.002", name: "Domain Generation Algorithms", tactics: ["TA0011"], parent: "T1568", platforms: ["ESXi", "Linux", "macOS", "Windows"], desc: "Adversaries may make use of Domain Generation Algorithms (DGAs) to dynamically identify a destination domain for command and control traffic rather than relying on a list of static IP addresses or domains." }, { id: "T1568.003", name: "DNS Calculation", tactics: ["TA0011"], parent: "T1568", platforms: ["ESXi", "Linux", "macOS", "Windows"], desc: "Adversaries may perform calculations on addresses returned in DNS results to determine which port and IP address to use for command and control, rather than relying on a predetermined port number or the actual returned IP address." }, { id: "T1569", name: "System Services", tactics: ["TA0002"], platforms: ["Windows", "macOS", "Linux"], desc: "Adversaries may abuse system services or daemons to execute commands or programs." }, { id: "T1569.001", name: "Launchctl", tactics: ["TA0002"], parent: "T1569", platforms: ["macOS"], desc: "Adversaries may abuse launchctl to execute commands or programs." }, { id: "T1569.002", name: "Service Execution", tactics: ["TA0002"], parent: "T1569", platforms: ["Windows"], desc: "Adversaries may abuse the Windows service control manager to execute malicious commands or payloads." }, { id: "T1569.003", name: "Systemctl", tactics: ["TA0002"], parent: "T1569", platforms: ["Linux"], desc: "Adversaries may abuse systemctl to execute commands or programs." }, { id: "T1570", name: "Lateral Tool Transfer", tactics: ["TA0008"], platforms: ["ESXi", "Linux", "macOS", "Windows"], desc: "Adversaries may transfer tools or other files between systems in a compromised environment." }, { id: "T1571", name: "Non-Standard Port", tactics: ["TA0011"], platforms: ["ESXi", "Linux", "macOS", "Windows"], desc: "Adversaries may communicate using a protocol and port pairing that are typically not associated." }, { id: "T1572", name: "Protocol Tunneling", tactics: ["TA0011"], platforms: ["ESXi", "Linux", "macOS", "Windows"], desc: "Adversaries may tunnel network communications to and from a victim system within a separate protocol to avoid detection/network filtering and/or enable access to otherwise unreachable systems." }, { id: "T1573", name: "Encrypted Channel", tactics: ["TA0011"], platforms: ["ESXi", "Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may employ an encryption algorithm to conceal command and control traffic rather than relying on any inherent protections provided by a communication protocol." }, { id: "T1573.001", name: "Symmetric Cryptography", tactics: ["TA0011"], parent: "T1573", platforms: ["ESXi", "Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may employ a known symmetric encryption algorithm to conceal command and control traffic rather than relying on any inherent protections provided by a communication protocol." }, { id: "T1573.002", name: "Asymmetric Cryptography", tactics: ["TA0011"], parent: "T1573", platforms: ["ESXi", "Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may employ a known asymmetric encryption algorithm to conceal command and control traffic rather than relying on any inherent protections provided by a communication protocol." }, { id: "T1574", name: "Hijack Execution Flow", tactics: ["TA0005", "TA0002"], platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may execute their own malicious payloads by hijacking the way operating systems run programs." }, { id: "T1574.001", name: "DLL", tactics: ["TA0005", "TA0002"], parent: "T1574", platforms: ["Windows"], desc: "Adversaries may abuse dynamic-link library files (DLLs) in order to achieve persistence, escalate privileges, and evade defenses." }, { id: "T1574.004", name: "Dylib Hijacking", tactics: ["TA0005", "TA0002"], parent: "T1574", platforms: ["macOS"], desc: "Adversaries may execute their own payloads by placing a malicious dynamic library (dylib) with an expected name in a path a victim application searches at runtime." }, { id: "T1574.005", name: "Executable Installer File Permissions Weakness", tactics: ["TA0005", "TA0002"], parent: "T1574", platforms: ["Windows"], desc: "Adversaries may execute their own malicious payloads by hijacking the binaries used by an installer." }, { id: "T1574.006", name: "Dynamic Linker Hijacking", tactics: ["TA0005", "TA0002"], parent: "T1574", platforms: ["Linux", "macOS"], desc: "Adversaries may execute their own malicious payloads by hijacking environment variables the dynamic linker uses to load shared libraries." }, { id: "T1574.007", name: "Path Interception by PATH Environment Variable", tactics: ["TA0005", "TA0002"], parent: "T1574", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may execute their own malicious payloads by hijacking environment variables used to load libraries." }, { id: "T1574.008", name: "Path Interception by Search Order Hijacking", tactics: ["TA0005", "TA0002"], parent: "T1574", platforms: ["Windows"], desc: "Adversaries may execute their own malicious payloads by hijacking the search order used to load other programs." }, { id: "T1574.009", name: "Path Interception by Unquoted Path", tactics: ["TA0005", "TA0002"], parent: "T1574", platforms: ["Windows"], desc: "Adversaries may execute their own malicious payloads by hijacking vulnerable file path references." }, { id: "T1574.010", name: "Services File Permissions Weakness", tactics: ["TA0005", "TA0002"], parent: "T1574", platforms: ["Windows"], desc: "Adversaries may execute their own malicious payloads by hijacking the binaries used by services." }, { id: "T1574.011", name: "Services Registry Permissions Weakness", tactics: ["TA0005", "TA0002"], parent: "T1574", platforms: ["Windows"], desc: "Adversaries may execute their own malicious payloads by hijacking the Registry entries used by services." }, { id: "T1574.012", name: "COR_PROFILER", tactics: ["TA0005", "TA0002"], parent: "T1574", platforms: ["Windows"], desc: "Adversaries may leverage the COR_PROFILER environment variable to hijack the execution flow of programs that load the .NET CLR." }, { id: "T1574.013", name: "KernelCallbackTable", tactics: ["TA0005", "TA0002"], parent: "T1574", platforms: ["Windows"], desc: "Adversaries may abuse the KernelCallbackTable of a process to hijack its execution flow in order to run their own payloads." }, { id: "T1574.014", name: "AppDomainManager", tactics: ["TA0005", "TA0002"], parent: "T1574", platforms: ["Windows"], desc: "Adversaries may execute their own malicious payloads by hijacking how the .NET `AppDomainManager` loads assemblies." }, { id: "T1578", name: "Modify Cloud Compute Infrastructure", tactics: ["TA0112"], platforms: ["IaaS"], desc: "An adversary may attempt to modify a cloud account's compute service infrastructure to evade defenses." }, { id: "T1578.001", name: "Create Snapshot", tactics: ["TA0112"], parent: "T1578", platforms: ["IaaS"], desc: "An adversary may create a snapshot or data backup within a cloud account to evade defenses." }, { id: "T1578.002", name: "Create Cloud Instance", tactics: ["TA0112"], parent: "T1578", platforms: ["IaaS"], desc: "An adversary may create a new instance or virtual machine (VM) within the compute service of a cloud account to evade defenses." }, { id: "T1578.003", name: "Delete Cloud Instance", tactics: ["TA0112"], parent: "T1578", platforms: ["IaaS"], desc: "An adversary may delete a cloud instance after they have performed malicious activities in an attempt to evade detection and remove evidence of their presence." }, { id: "T1578.004", name: "Revert Cloud Instance", tactics: ["TA0112"], parent: "T1578", platforms: ["IaaS"], desc: "An adversary may revert changes made to a cloud instance after they have performed malicious activities in attempt to evade detection and remove evidence of their presence." }, { id: "T1578.005", name: "Modify Cloud Compute Configurations", tactics: ["TA0112"], parent: "T1578", platforms: ["IaaS"], desc: "Adversaries may modify settings that directly affect the size, locations, and resources available to cloud compute infrastructure in order to evade defenses." }, { id: "T1580", name: "Cloud Infrastructure Discovery", tactics: ["TA0007"], platforms: ["IaaS"], desc: "An adversary may attempt to discover infrastructure and resources that are available within an infrastructure-as-a-service (IaaS) environment." }, { id: "T1583", name: "Acquire Infrastructure", tactics: ["TA0042"], platforms: ["PRE"], desc: "Adversaries may buy, lease, rent, or obtain infrastructure that can be used during targeting." }, { id: "T1583.001", name: "Domains", tactics: ["TA0042"], parent: "T1583", platforms: ["PRE"], desc: "Adversaries may acquire domains that can be used during targeting." }, { id: "T1583.002", name: "DNS Server", tactics: ["TA0042"], parent: "T1583", platforms: ["PRE"], desc: "Adversaries may set up their own Domain Name System (DNS) servers that can be used during targeting." }, { id: "T1583.003", name: "Virtual Private Server", tactics: ["TA0042"], parent: "T1583", platforms: ["PRE"], desc: "Adversaries may rent Virtual Private Servers (VPSs) that can be used during targeting." }, { id: "T1583.004", name: "Server", tactics: ["TA0042"], parent: "T1583", platforms: ["PRE"], desc: "Adversaries may buy, lease, rent, or obtain physical servers that can be used during targeting." }, { id: "T1583.005", name: "Botnet", tactics: ["TA0042"], parent: "T1583", platforms: ["PRE"], desc: "Adversaries may buy, lease, or rent a network of compromised systems that can be used during targeting." }, { id: "T1583.006", name: "Web Services", tactics: ["TA0042"], parent: "T1583", platforms: ["PRE"], desc: "Adversaries may register for web services that can be used during targeting." }, { id: "T1583.007", name: "Serverless", tactics: ["TA0042"], parent: "T1583", platforms: ["PRE"], desc: "Adversaries may purchase and configure serverless cloud infrastructure, such as Cloudflare Workers, AWS Lambda functions, or Google Apps Scripts, that can be used during targeting." }, { id: "T1583.008", name: "Malvertising", tactics: ["TA0042"], parent: "T1583", platforms: ["PRE"], desc: "Adversaries may purchase online advertisements that can be abused to distribute malware to victims." }, { id: "T1584", name: "Compromise Infrastructure", tactics: ["TA0042"], platforms: ["PRE"], desc: "Adversaries may compromise third-party infrastructure that can be used during targeting." }, { id: "T1584.001", name: "Domains", tactics: ["TA0042"], parent: "T1584", platforms: ["PRE"], desc: "Adversaries may hijack domains and/or subdomains that can be used during targeting." }, { id: "T1584.002", name: "DNS Server", tactics: ["TA0042"], parent: "T1584", platforms: ["PRE"], desc: "Adversaries may compromise third-party DNS servers that can be used during targeting." }, { id: "T1584.003", name: "Virtual Private Server", tactics: ["TA0042"], parent: "T1584", platforms: ["PRE"], desc: "Adversaries may compromise third-party Virtual Private Servers (VPSs) that can be used during targeting." }, { id: "T1584.004", name: "Server", tactics: ["TA0042"], parent: "T1584", platforms: ["PRE"], desc: "Adversaries may compromise third-party servers that can be used during targeting." }, { id: "T1584.005", name: "Botnet", tactics: ["TA0042"], parent: "T1584", platforms: ["PRE"], desc: "Adversaries may compromise numerous third-party systems to form a botnet that can be used during targeting." }, { id: "T1584.006", name: "Web Services", tactics: ["TA0042"], parent: "T1584", platforms: ["PRE"], desc: "Adversaries may compromise access to third-party web services that can be used during targeting." }, { id: "T1584.007", name: "Serverless", tactics: ["TA0042"], parent: "T1584", platforms: ["PRE"], desc: "Adversaries may compromise serverless cloud infrastructure, such as Cloudflare Workers, AWS Lambda functions, or Google Apps Scripts, that can be used during targeting." }, { id: "T1584.008", name: "Network Devices", tactics: ["TA0042"], parent: "T1584", platforms: ["PRE"], desc: "Adversaries may compromise third-party network devices that can be used during targeting." }, { id: "T1585", name: "Establish Accounts", tactics: ["TA0042"], platforms: ["PRE"], desc: "Adversaries may create and cultivate accounts with services that can be used during targeting." }, { id: "T1585.001", name: "Social Media Accounts", tactics: ["TA0042"], parent: "T1585", platforms: ["PRE"], desc: "Adversaries may create and cultivate social media accounts that can be used during targeting." }, { id: "T1585.002", name: "Email Accounts", tactics: ["TA0042"], parent: "T1585", platforms: ["PRE"], desc: "Adversaries may create email accounts that can be used during targeting." }, { id: "T1585.003", name: "Cloud Accounts", tactics: ["TA0042"], parent: "T1585", platforms: ["PRE"], desc: "Adversaries may create accounts with cloud providers that can be used during targeting." }, { id: "T1586", name: "Compromise Accounts", tactics: ["TA0042"], platforms: ["PRE"], desc: "Adversaries may compromise accounts with services that can be used during targeting." }, { id: "T1586.001", name: "Social Media Accounts", tactics: ["TA0042"], parent: "T1586", platforms: ["PRE"], desc: "Adversaries may compromise social media accounts that can be used during targeting." }, { id: "T1586.002", name: "Email Accounts", tactics: ["TA0042"], parent: "T1586", platforms: ["PRE"], desc: "Adversaries may compromise email accounts that can be used during targeting." }, { id: "T1586.003", name: "Cloud Accounts", tactics: ["TA0042"], parent: "T1586", platforms: ["PRE"], desc: "Adversaries may compromise cloud accounts that can be used during targeting." }, { id: "T1587", name: "Develop Capabilities", tactics: ["TA0042"], platforms: ["PRE"], desc: "Adversaries may build capabilities that can be used during targeting." }, { id: "T1587.001", name: "Malware", tactics: ["TA0042"], parent: "T1587", platforms: ["PRE"], desc: "Adversaries may develop malware and malware components that can be used during targeting." }, { id: "T1587.002", name: "Code Signing Certificates", tactics: ["TA0042"], parent: "T1587", platforms: ["PRE"], desc: "Adversaries may create self-signed code signing certificates that can be used during targeting." }, { id: "T1587.003", name: "Digital Certificates", tactics: ["TA0042"], parent: "T1587", platforms: ["PRE"], desc: "Adversaries may create self-signed SSL/TLS certificates that can be used during targeting." }, { id: "T1587.004", name: "Exploits", tactics: ["TA0042"], parent: "T1587", platforms: ["PRE"], desc: "Adversaries may develop exploits that can be used during targeting." }, { id: "T1588", name: "Obtain Capabilities", tactics: ["TA0042"], platforms: ["PRE"], desc: "Adversaries may buy and/or steal capabilities that can be used during targeting." }, { id: "T1588.001", name: "Malware", tactics: ["TA0042"], parent: "T1588", platforms: ["PRE"], desc: "Adversaries may buy, steal, or download malware that can be used during targeting." }, { id: "T1588.002", name: "Tool", tactics: ["TA0042"], parent: "T1588", platforms: ["PRE"], desc: "Adversaries may buy, steal, or download software tools that can be used during targeting." }, { id: "T1588.003", name: "Code Signing Certificates", tactics: ["TA0042"], parent: "T1588", platforms: ["PRE"], desc: "Adversaries may buy and/or steal code signing certificates that can be used during targeting." }, { id: "T1588.004", name: "Digital Certificates", tactics: ["TA0042"], parent: "T1588", platforms: ["PRE"], desc: "Adversaries may buy and/or steal SSL/TLS certificates that can be used during targeting." }, { id: "T1588.005", name: "Exploits", tactics: ["TA0042"], parent: "T1588", platforms: ["PRE"], desc: "Adversaries may buy, steal, or download exploits that can be used during targeting." }, { id: "T1588.006", name: "Vulnerabilities", tactics: ["TA0042"], parent: "T1588", platforms: ["PRE"], desc: "Adversaries may acquire information about vulnerabilities that can be used during targeting." }, { id: "T1588.007", name: "Artificial Intelligence", tactics: ["TA0042"], parent: "T1588", platforms: ["PRE"], desc: "Adversaries may obtain access to generative artificial intelligence tools, such as large language models (LLMs), to aid various techniques during targeting." }, { id: "T1589", name: "Gather Victim Identity Information", tactics: ["TA0043"], platforms: ["PRE"], desc: "Adversaries may gather information about the victim's identity that can be used during targeting." }, { id: "T1589.001", name: "Credentials", tactics: ["TA0043"], parent: "T1589", platforms: ["PRE"], desc: "Adversaries may gather credentials that can be used during targeting." }, { id: "T1589.002", name: "Email Addresses", tactics: ["TA0043"], parent: "T1589", platforms: ["PRE"], desc: "Adversaries may gather email addresses that can be used during targeting." }, { id: "T1589.003", name: "Employee Names", tactics: ["TA0043"], parent: "T1589", platforms: ["PRE"], desc: "Adversaries may gather employee names that can be used during targeting." }, { id: "T1590", name: "Gather Victim Network Information", tactics: ["TA0043"], platforms: ["PRE"], desc: "Adversaries may gather information about the victim's networks that can be used during targeting." }, { id: "T1590.001", name: "Domain Properties", tactics: ["TA0043"], parent: "T1590", platforms: ["PRE"], desc: "Adversaries may gather information about the victim's network domain(s) that can be used during targeting." }, { id: "T1590.002", name: "DNS", tactics: ["TA0043"], parent: "T1590", platforms: ["PRE"], desc: "Adversaries may gather information about the victim's DNS that can be used during targeting." }, { id: "T1590.003", name: "Network Trust Dependencies", tactics: ["TA0043"], parent: "T1590", platforms: ["PRE"], desc: "Adversaries may gather information about the victim's network trust dependencies that can be used during targeting." }, { id: "T1590.004", name: "Network Topology", tactics: ["TA0043"], parent: "T1590", platforms: ["PRE"], desc: "Adversaries may gather information about the victim's network topology that can be used during targeting." }, { id: "T1590.005", name: "IP Addresses", tactics: ["TA0043"], parent: "T1590", platforms: ["PRE"], desc: "Adversaries may gather the victim's IP addresses that can be used during targeting." }, { id: "T1590.006", name: "Network Security Appliances", tactics: ["TA0043"], parent: "T1590", platforms: ["PRE"], desc: "Adversaries may gather information about the victim's network security appliances that can be used during targeting." }, { id: "T1591", name: "Gather Victim Org Information", tactics: ["TA0043"], platforms: ["PRE"], desc: "Adversaries may gather information about the victim's organization that can be used during targeting." }, { id: "T1591.001", name: "Determine Physical Locations", tactics: ["TA0043"], parent: "T1591", platforms: ["PRE"], desc: "Adversaries may gather the victim's physical location(s) that can be used during targeting." }, { id: "T1591.002", name: "Business Relationships", tactics: ["TA0043"], parent: "T1591", platforms: ["PRE"], desc: "Adversaries may gather information about the victim's business relationships that can be used during targeting." }, { id: "T1591.003", name: "Identify Business Tempo", tactics: ["TA0043"], parent: "T1591", platforms: ["PRE"], desc: "Adversaries may gather information about the victim's business tempo that can be used during targeting." }, { id: "T1591.004", name: "Identify Roles", tactics: ["TA0043"], parent: "T1591", platforms: ["PRE"], desc: "Adversaries may gather information about identities and roles within the victim organization that can be used during targeting." }, { id: "T1592", name: "Gather Victim Host Information", tactics: ["TA0043"], platforms: ["PRE"], desc: "Adversaries may gather information about the victim's hosts that can be used during targeting." }, { id: "T1592.001", name: "Hardware", tactics: ["TA0043"], parent: "T1592", platforms: ["PRE"], desc: "Adversaries may gather information about the victim's host hardware that can be used during targeting." }, { id: "T1592.002", name: "Software", tactics: ["TA0043"], parent: "T1592", platforms: ["PRE"], desc: "Adversaries may gather information about the victim's host software that can be used during targeting." }, { id: "T1592.003", name: "Firmware", tactics: ["TA0043"], parent: "T1592", platforms: ["PRE"], desc: "Adversaries may gather information about the victim's host firmware that can be used during targeting." }, { id: "T1592.004", name: "Client Configurations", tactics: ["TA0043"], parent: "T1592", platforms: ["PRE"], desc: "Adversaries may gather information about the victim's client configurations that can be used during targeting." }, { id: "T1593", name: "Search Open Websites/Domains", tactics: ["TA0043"], platforms: ["PRE"], desc: "Adversaries may search freely available websites and/or domains for information about victims that can be used during targeting." }, { id: "T1593.001", name: "Social Media", tactics: ["TA0043"], parent: "T1593", platforms: ["PRE"], desc: "Adversaries may search social media for information about victims that can be used during targeting." }, { id: "T1593.002", name: "Search Engines", tactics: ["TA0043"], parent: "T1593", platforms: ["PRE"], desc: "Adversaries may use search engines to collect information about victims that can be used during targeting." }, { id: "T1593.003", name: "Code Repositories", tactics: ["TA0043"], parent: "T1593", platforms: ["PRE"], desc: "Adversaries may search public code repositories for information about victims that can be used during targeting." }, { id: "T1594", name: "Search Victim-Owned Websites", tactics: ["TA0043"], platforms: ["PRE"], desc: "Adversaries may search websites owned by the victim for information that can be used during targeting." }, { id: "T1595", name: "Active Scanning", tactics: ["TA0043"], platforms: ["PRE"], desc: "Adversaries may execute active reconnaissance scans to gather information that can be used during targeting." }, { id: "T1595.001", name: "Scanning IP Blocks", tactics: ["TA0043"], parent: "T1595", platforms: ["PRE"], desc: "Adversaries may scan victim IP blocks to gather information that can be used during targeting." }, { id: "T1595.002", name: "Vulnerability Scanning", tactics: ["TA0043"], parent: "T1595", platforms: ["PRE"], desc: "Adversaries may scan victims for vulnerabilities that can be used during targeting." }, { id: "T1595.003", name: "Wordlist Scanning", tactics: ["TA0043"], parent: "T1595", platforms: ["PRE"], desc: "Adversaries may iteratively probe infrastructure using brute-forcing and crawling techniques." }, { id: "T1596", name: "Search Open Technical Databases", tactics: ["TA0043"], platforms: ["PRE"], desc: "Adversaries may search freely available technical databases for information about victims that can be used during targeting." }, { id: "T1596.001", name: "DNS/Passive DNS", tactics: ["TA0043"], parent: "T1596", platforms: ["PRE"], desc: "Adversaries may search DNS data for information about victims that can be used during targeting." }, { id: "T1596.002", name: "WHOIS", tactics: ["TA0043"], parent: "T1596", platforms: ["PRE"], desc: "Adversaries may search public WHOIS data for information about victims that can be used during targeting." }, { id: "T1596.003", name: "Digital Certificates", tactics: ["TA0043"], parent: "T1596", platforms: ["PRE"], desc: "Adversaries may search public digital certificate data for information about victims that can be used during targeting." }, { id: "T1596.004", name: "CDNs", tactics: ["TA0043"], parent: "T1596", platforms: ["PRE"], desc: "Adversaries may search content delivery network (CDN) data about victims that can be used during targeting." }, { id: "T1596.005", name: "Scan Databases", tactics: ["TA0043"], parent: "T1596", platforms: ["PRE"], desc: "Adversaries may search within public scan databases for information about victims that can be used during targeting." }, { id: "T1597", name: "Search Closed Sources", tactics: ["TA0043"], platforms: ["PRE"], desc: "Adversaries may search and gather information about victims from closed (e.g., paid, private, or otherwise not freely available) sources that can be used during targeting." }, { id: "T1597.001", name: "Threat Intel Vendors", tactics: ["TA0043"], parent: "T1597", platforms: ["PRE"], desc: "Adversaries may search private data from threat intelligence vendors for information that can be used during targeting." }, { id: "T1597.002", name: "Purchase Technical Data", tactics: ["TA0043"], parent: "T1597", platforms: ["PRE"], desc: "Adversaries may purchase technical information about victims that can be used during targeting." }, { id: "T1598", name: "Phishing for Information", tactics: ["TA0043"], platforms: ["PRE"], desc: "Adversaries may send phishing messages to elicit sensitive information that can be used during targeting." }, { id: "T1598.001", name: "Spearphishing Service", tactics: ["TA0043"], parent: "T1598", platforms: ["PRE"], desc: "Adversaries may send spearphishing messages via third-party services to elicit sensitive information that can be used during targeting." }, { id: "T1598.002", name: "Spearphishing Attachment", tactics: ["TA0043"], parent: "T1598", platforms: ["PRE"], desc: "Adversaries may send spearphishing messages with a malicious attachment to elicit sensitive information that can be used during targeting." }, { id: "T1598.003", name: "Spearphishing Link", tactics: ["TA0043"], parent: "T1598", platforms: ["PRE"], desc: "Adversaries may send spearphishing messages with a malicious link to elicit sensitive information that can be used during targeting." }, { id: "T1598.004", name: "Spearphishing Voice", tactics: ["TA0043"], parent: "T1598", platforms: ["PRE"], desc: "Adversaries may use voice communications to elicit sensitive information that can be used during targeting." }, { id: "T1599", name: "Network Boundary Bridging", tactics: ["TA0112"], platforms: ["Network Devices"], desc: "Adversaries may bridge network boundaries by compromising perimeter network devices or internal devices responsible for network segmentation." }, { id: "T1599.001", name: "Network Address Translation Traversal", tactics: ["TA0112"], parent: "T1599", platforms: ["Network Devices"], desc: "Adversaries may bridge network boundaries by modifying a network device\u2019s Network Address Translation (NAT) configuration." }, { id: "T1600", name: "Weaken Encryption", tactics: ["TA0112"], platforms: ["Network Devices"], desc: "Adversaries may compromise a network device\u2019s encryption capability in order to bypass encryption that would otherwise protect data communications." }, { id: "T1600.001", name: "Reduce Key Space", tactics: ["TA0112"], parent: "T1600", platforms: ["Network Devices"], desc: "Adversaries may reduce the level of effort required to decrypt data transmitted over the network by reducing the cipher strength of encrypted communications." }, { id: "T1600.002", name: "Disable Crypto Hardware", tactics: ["TA0112"], parent: "T1600", platforms: ["Network Devices"], desc: "Adversaries disable a network device\u2019s dedicated hardware encryption, which may enable them to leverage weaknesses in software encryption in order to reduce the effort involved in collecting, manipulating, and exfiltrating transmitted data." }, { id: "T1601", name: "Modify System Image", tactics: ["TA0112"], platforms: ["Network Devices"], desc: "Adversaries may make changes to the operating system of embedded network devices to weaken defenses and provide new capabilities for themselves." }, { id: "T1601.001", name: "Patch System Image", tactics: ["TA0112"], parent: "T1601", platforms: ["Network Devices"], desc: "Adversaries may modify the operating system of a network device to introduce new capabilities or weaken existing defenses." }, { id: "T1601.002", name: "Downgrade System Image", tactics: ["TA0112"], parent: "T1601", platforms: ["Network Devices"], desc: "Adversaries may install an older version of the operating system of a network device to weaken security." }, { id: "T1602", name: "Data from Configuration Repository", tactics: ["TA0009"], platforms: ["Network Devices"], desc: "Adversaries may collect data related to managed devices from configuration repositories." }, { id: "T1602.001", name: "SNMP (MIB Dump)", tactics: ["TA0009"], parent: "T1602", platforms: ["Network Devices"], desc: "Adversaries may target the Management Information Base (MIB) to collect and/or mine valuable information in a network managed using Simple Network Management Protocol (SNMP)." }, { id: "T1602.002", name: "Network Device Configuration Dump", tactics: ["TA0009"], parent: "T1602", platforms: ["Network Devices"], desc: "Adversaries may access network configuration files to collect sensitive data about the device and the network." }, { id: "T1606", name: "Forge Web Credentials", tactics: ["TA0006"], platforms: ["SaaS", "Windows", "macOS", "Linux", "IaaS", "Office Suite", "Identity Provider"], desc: "Adversaries may forge credential materials that can be used to gain access to web applications or Internet services." }, { id: "T1606.001", name: "Web Cookies", tactics: ["TA0006"], parent: "T1606", platforms: ["Linux", "macOS", "Windows", "SaaS", "IaaS"], desc: "Adversaries may forge web cookies that can be used to gain access to web applications or Internet services." }, { id: "T1606.002", name: "SAML Tokens", tactics: ["TA0006"], parent: "T1606", platforms: ["SaaS", "Windows", "IaaS", "Office Suite", "Identity Provider"], desc: "An adversary may forge SAML tokens with any permissions claims and lifetimes if they possess a valid SAML token-signing certificate." }, { id: "T1608", name: "Stage Capabilities", tactics: ["TA0042"], platforms: ["PRE"], desc: "Adversaries may upload, install, or otherwise set up capabilities that can be used during targeting." }, { id: "T1608.001", name: "Upload Malware", tactics: ["TA0042"], parent: "T1608", platforms: ["PRE"], desc: "Adversaries may upload malware to third-party or adversary controlled infrastructure to make it accessible during targeting." }, { id: "T1608.002", name: "Upload Tool", tactics: ["TA0042"], parent: "T1608", platforms: ["PRE"], desc: "Adversaries may upload tools to third-party or adversary controlled infrastructure to make it accessible during targeting." }, { id: "T1608.003", name: "Install Digital Certificate", tactics: ["TA0042"], parent: "T1608", platforms: ["PRE"], desc: "Adversaries may install SSL/TLS certificates that can be used during targeting." }, { id: "T1608.004", name: "Drive-by Target", tactics: ["TA0042"], parent: "T1608", platforms: ["PRE"], desc: "Adversaries may prepare an operational environment to infect systems that visit a website over the normal course of browsing." }, { id: "T1608.005", name: "Link Target", tactics: ["TA0042"], parent: "T1608", platforms: ["PRE"], desc: "Adversaries may put in place resources that are referenced by a link that can be used during targeting." }, { id: "T1608.006", name: "SEO Poisoning", tactics: ["TA0042"], parent: "T1608", platforms: ["PRE"], desc: "Adversaries may poison mechanisms that influence search engine optimization (SEO) to further lure staged capabilities towards potential victims." }, { id: "T1609", name: "Container Administration Command", tactics: ["TA0002"], platforms: ["Containers"], desc: "Adversaries may abuse a container administration service to execute commands within a container." }, { id: "T1610", name: "Deploy Container", tactics: ["TA0002"], platforms: ["Containers"], desc: "Adversaries may deploy a container into an environment to facilitate execution or evade defenses." }, { id: "T1611", name: "Escape to Host", tactics: ["TA0004"], platforms: ["Windows", "Linux", "Containers", "ESXi"], desc: "Adversaries may break out of a container or virtualized environment to gain access to the underlying host." }, { id: "T1612", name: "Build Image on Host", tactics: ["TA0005"], platforms: ["Containers"], desc: "Adversaries may build a container image directly on a host to bypass defenses that monitor for the retrieval of malicious images from a public registry." }, { id: "T1613", name: "Container and Resource Discovery", tactics: ["TA0007"], platforms: ["Containers"], desc: "Adversaries may attempt to discover containers and other resources that are available within a containers environment." }, { id: "T1614", name: "System Location Discovery", tactics: ["TA0007"], platforms: ["IaaS", "Linux", "macOS", "Windows"], desc: "Adversaries may gather information in an attempt to calculate the geographical location of a victim host." }, { id: "T1614.001", name: "System Language Discovery", tactics: ["TA0007"], parent: "T1614", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may attempt to gather information about the system language of a victim in order to infer the geographical location of that host." }, { id: "T1615", name: "Group Policy Discovery", tactics: ["TA0007"], platforms: ["Windows"], desc: "Adversaries may gather information on Group Policy settings to identify paths for privilege escalation, security measures applied within a domain, and to discover patterns in domain objects that can be manipulated or used to blend in the environment." }, { id: "T1619", name: "Cloud Storage Object Discovery", tactics: ["TA0007"], platforms: ["IaaS"], desc: "Adversaries may enumerate objects in cloud storage infrastructure." }, { id: "T1620", name: "Reflective Code Loading", tactics: ["TA0005"], platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may reflectively load code into a process in order to conceal the execution of malicious payloads." }, { id: "T1621", name: "Multi-Factor Authentication Request Generation", tactics: ["TA0006"], platforms: ["Windows", "Linux", "macOS", "IaaS", "SaaS", "Office Suite", "Identity Provider"], desc: "Adversaries may attempt to bypass multi-factor authentication (MFA) mechanisms and gain access to accounts by generating MFA requests sent to users." }, { id: "T1622", name: "Debugger Evasion", tactics: ["TA0005", "TA0007"], platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may employ various means to detect and avoid debuggers." }, { id: "T1647", name: "Plist File Modification", tactics: ["TA0112"], platforms: ["macOS"], desc: "Adversaries may modify property list files (plist files) to enable other malicious activity, while also potentially evading and bypassing system defenses." }, { id: "T1648", name: "Serverless Execution", tactics: ["TA0002"], platforms: ["SaaS", "IaaS", "Office Suite"], desc: "Adversaries may abuse serverless computing, integration, and automation services to execute arbitrary code in cloud environments." }, { id: "T1649", name: "Steal or Forge Authentication Certificates", tactics: ["TA0006"], platforms: ["Windows", "Linux", "macOS", "Identity Provider"], desc: "Adversaries may steal or forge certificates used for authentication to access remote systems or resources." }, { id: "T1650", name: "Acquire Access", tactics: ["TA0042"], platforms: ["PRE"], desc: "Adversaries may purchase or otherwise acquire an existing access to a target system or network." }, { id: "T1651", name: "Cloud Administration Command", tactics: ["TA0002"], platforms: ["IaaS"], desc: "Adversaries may abuse cloud management services to execute commands within virtual machines." }, { id: "T1652", name: "Device Driver Discovery", tactics: ["TA0007"], platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may attempt to enumerate local device drivers on a victim host." }, { id: "T1653", name: "Power Settings", tactics: ["TA0003"], platforms: ["Windows", "Linux", "macOS", "Network Devices"], desc: "Adversaries may impair a system's ability to hibernate, reboot, or shut down in order to extend access to infected machines." }, { id: "T1654", name: "Log Enumeration", tactics: ["TA0007"], platforms: ["ESXi", "IaaS", "Linux", "macOS", "Windows"], desc: "Adversaries may enumerate system and service logs to find useful data." }, { id: "T1657", name: "Financial Theft", tactics: ["TA0040"], platforms: ["Linux", "macOS", "Office Suite", "SaaS", "Windows"], desc: "Adversaries may steal monetary resources from targets through extortion, social engineering, technical theft, or other methods aimed at their own financial gain at the expense of the availability of these resources for victims." }, { id: "T1659", name: "Content Injection", tactics: ["TA0001", "TA0011"], platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may gain access and continuously communicate with victims by injecting malicious content into systems through online network traffic." }, { id: "T1665", name: "Hide Infrastructure", tactics: ["TA0011"], platforms: ["ESXi", "Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may manipulate network traffic in order to hide and evade detection of their C2 infrastructure." }, { id: "T1666", name: "Modify Cloud Resource Hierarchy", tactics: ["TA0112"], platforms: ["IaaS"], desc: "Adversaries may attempt to modify hierarchical structures in infrastructure-as-a-service (IaaS) environments in order to evade defenses." }, { id: "T1667", name: "Email Bombing", tactics: ["TA0040"], platforms: ["Linux", "Office Suite", "Windows", "macOS"], desc: "Adversaries may flood targeted email addresses with an overwhelming volume of messages." }, { id: "T1668", name: "Exclusive Control", tactics: ["TA0003"], platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries who successfully compromise a system may attempt to maintain persistence by \u201Cclosing the door\u201D behind them \u2013 in other words, by preventing other threat actors from initially accessing or maintaining a foothold on the same system." }, { id: "T1669", name: "Wi-Fi Networks", tactics: ["TA0001"], platforms: ["Linux", "Network Devices", "Windows", "macOS"], desc: "Adversaries may gain initial access to target systems by connecting to wireless networks." }, { id: "T1671", name: "Cloud Application Integration", tactics: ["TA0003"], platforms: ["Office Suite", "SaaS"], desc: "Adversaries may achieve persistence by leveraging OAuth application integrations in a software-as-a-service environment." }, { id: "T1673", name: "Virtual Machine Discovery", tactics: ["TA0007"], platforms: ["ESXi", "Linux", "macOS", "Windows"], desc: "An adversary may attempt to enumerate running virtual machines (VMs) after gaining access to a host or hypervisor." }, { id: "T1674", name: "Input Injection", tactics: ["TA0002"], platforms: ["Windows", "macOS", "Linux"], desc: "Adversaries may simulate keystrokes on a victim\u2019s computer by various means to perform any type of action on behalf of the user, such as launching the command interpreter using keyboard shortcuts, typing an inline script to be executed, or interacting directly with a GUI-based application." }, { id: "T1675", name: "ESXi Administration Command", tactics: ["TA0002"], platforms: ["ESXi"], desc: "Adversaries may abuse ESXi administration services to execute commands on guest machines hosted within an ESXi virtual environment." }, { id: "T1677", name: "Poisoned Pipeline Execution", tactics: ["TA0002"], platforms: ["SaaS"], desc: "Adversaries may manipulate continuous integration / continuous development (CI/CD) processes by injecting malicious code into the build process." }, { id: "T1678", name: "Delay Execution", tactics: ["TA0005"], platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may employ various time-based methods to evade detection and analysis." }, { id: "T1679", name: "Selective Exclusion", tactics: ["TA0005"], platforms: ["Windows"], desc: "Adversaries may intentionally exclude certain files, folders, directories, file types, or system components from encryption or tampering during a ransomware or malicious payload execution." }, { id: "T1680", name: "Local Storage Discovery", tactics: ["TA0007"], platforms: ["ESXi", "IaaS", "Linux", "macOS", "Windows"], desc: "Adversaries may enumerate local drives, disks, and/or volumes and their attributes like total or free space and volume serial number." }, { id: "T1681", name: "Search Threat Vendor Data", tactics: ["TA0043"], platforms: ["PRE"], desc: "Threat actors may seek information/indicators from closed or open threat intelligence sources gathered about their own campaigns, as well as those conducted by other adversaries that may align with their target industries, capabilities/objectives, or other operational concerns." }, { id: "T1682", name: "Query Public AI Services", tactics: ["TA0043"], platforms: ["PRE"], desc: "Adversaries may query publicly accessible artificial intelligence (AI) services, such as large language models (LLMs), to support targeting and operations." }, { id: "T1683", name: "Generate Content", tactics: ["TA0042"], platforms: ["PRE"], desc: "Adversaries may create or generate content to support targeting and operations." }, { id: "T1683.001", name: "Written Content", tactics: ["TA0042"], parent: "T1683", platforms: ["PRE"], desc: "Adversaries may create or tailor written materials to support targeting and malicious operations." }, { id: "T1683.002", name: "Audio-Visual Content", tactics: ["TA0042"], parent: "T1683", platforms: ["PRE"], desc: "Adversaries may create or manipulate audio, image, and video content to support targeting and malicious operations." }, { id: "T1684", name: "Social Engineering", tactics: ["TA0005"], platforms: ["Linux", "macOS", "Office Suite", "SaaS", "Windows"], desc: "Adversaries may use social engineering techniques to influence users to take actions that result in unauthorized access, approval of changes, disclosure of sensitive information, or execution of adversary-supplied instructions (i.e., introduction of malicious payloads or software), while minimizing technical indicat..." }, { id: "T1684.001", name: "Impersonation", tactics: ["TA0005"], parent: "T1684", platforms: ["Linux", "macOS", "Office Suite", "SaaS", "Windows"], desc: "Adversaries may impersonate a trusted person or organization in order to persuade and trick a target into performing some action on their behalf." }, { id: "T1684.002", name: "Email Spoofing", tactics: ["TA0005"], parent: "T1684", platforms: ["Linux", "macOS", "Office Suite", "Windows"], desc: "Adversaries may fake, or spoof, a sender\u2019s identity by modifying the value of relevant email headers in order to establish contact with victims under false pretenses." }, { id: "T1685", name: "Disable or Modify Tools", tactics: ["TA0112"], platforms: ["Containers", "ESXi", "IaaS", "Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may disable, degrade, or tamper with security tools or applications (e.g., endpoint detection and response (EDR) tools, intrusion detection systems (IDS), antivirus, logging agents, sensors, etc.) to impair or reduce visibility of defensive capabilities." }, { id: "T1685.001", name: "Disable or Modify Windows Event Log", tactics: ["TA0112"], parent: "T1685", platforms: ["Windows"], desc: "Adversaries may disable or modify the Windows Event Log to limit data that can be leveraged for detections and audits." }, { id: "T1685.002", name: "Disable or Modify Cloud Log", tactics: ["TA0112"], parent: "T1685", platforms: ["IaaS", "SaaS", "Identity Provider", "Office Suite"], desc: "An adversary may disable or modify cloud logging capabilities and integrations to limit what data is collected on their activities and avoid detection." }, { id: "T1685.003", name: "Modify or Spoof Tool UI", tactics: ["TA0112"], parent: "T1685", platforms: ["Linux", "macOS", "Windows"], desc: "Adversaries may spoof or manipulate security tool user interfaces (UIs) to falsely indicate tools are functioning normally and delay detection and response." }, { id: "T1685.004", name: "Disable or Modify Linux Audit System Log", tactics: ["TA0112"], parent: "T1685", platforms: ["Linux"], desc: "Adversaries may disable or modify the Linux Audit system to hide malicious activity and avoid detection." }, { id: "T1685.005", name: "Clear Windows Event Logs", tactics: ["TA0112"], parent: "T1685", platforms: ["Windows"], desc: "Adversaries may clear Windows Event Logs to hide the activity of an intrusion." }, { id: "T1685.006", name: "Clear Linux or Mac System Logs", tactics: ["TA0112"], parent: "T1685", platforms: ["Linux", "macOS"], desc: "Adversaries may clear system logs to hide evidence of an intrusion." }, { id: "T1686", name: "Disable or Modify System Firewall", tactics: ["TA0112"], platforms: ["ESXi", "Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may disable or modify host-based or network firewalls to impair defensive mechanisms and enable further action." }, { id: "T1686.001", name: "Cloud Firewall", tactics: ["TA0112"], parent: "T1686", platforms: ["IaaS"], desc: "Adversaries may disable or modify a firewall within a cloud environment to bypass controls that limit access to cloud resources." }, { id: "T1686.002", name: "Network Device Firewall", tactics: ["TA0112"], parent: "T1686", platforms: ["Network Devices"], desc: "Adversaries may disable network device-based firewall mechanisms entirely or add, delete, or modify particular rules in order to bypass controls limiting network usage." }, { id: "T1686.003", name: "Windows Host Firewall", tactics: ["TA0112"], parent: "T1686", platforms: ["Windows"], desc: "Adversaries may disable or modify the Windows host firewall to bypass controls limiting network usage." }, { id: "T1687", name: "Exploitation for Defense Impairment", tactics: ["TA0112"], platforms: ["IaaS", "Linux", "macOS", "SaaS", "Windows"], desc: "Adversaries may exploit vulnerabilities in security software, infrastructure, or defensive components to degrade, disable, or otherwise continue to impair their ability to prevent, detect, or respond to malicious activity." }, { id: "T1688", name: "Safe Mode Boot", tactics: ["TA0112"], platforms: ["Windows"], desc: "Adversaries may abuse Windows safe mode to disable endpoint defenses." }, { id: "T1689", name: "Downgrade Attack", tactics: ["TA0112"], platforms: ["macOS", "Windows", "Linux"], desc: "Adversaries may downgrade or use a version of system features that may be outdated, vulnerable, and/or does not support updated security controls." }, { id: "T1690", name: "Prevent Command History Logging", tactics: ["TA0112"], platforms: ["ESXi", "Linux", "macOS", "Network Devices", "Windows"], desc: "Adversaries may impair command history logging to hide commands they run on a compromised system." }], revoked: { T1143: "T1564.003", T1109: "T1542.002", T1147: "T1564.002", T1042: "T1546.001", T1067: "T1542.003", T1172: "T1090.004", T1158: "T1564.001", T1169: "T1548.003", T1527: "T1550.001", T1096: "T1564.004", T1506: "T1550.004", T1118: "T1218.004", T1502: "T1134.004", T1101: "T1547.005", T1183: "T1546.012", T1184: "T1563.001", T1081: "T1552.001", "T1562.003": "T1690", T1031: "T1543.003", T1493: "T1565.002", T1128: "T1546.007", T1672: "T1684.002", "T1562.001": "T1685", T1488: "T1561.001", T1060: "T1547.001", T1142: "T1555.001", T1038: "T1574.001", T1013: "T1547.010", T1045: "T1027.002", T1208: "T1558.003", T1009: "T1027.001", T1193: "T1566.001", T1656: "T1684.001", T1100: "T1505.003", T1044: "T1574.010", T1063: "T1518.001", T1088: "T1548.002", T1084: "T1546.003", T1522: "T1552.005", "T1053.001": "T1053.002", T1085: "T1218.011", "T1070.002": "T1685.006", "T1562.009": "T1688", T1015: "T1546.008", T1215: "T1547.006", T1099: "T1070.006", "T1562.004": "T1686", T1159: "T1543.001", T1160: "T1543.004", T1024: "T1573", T1194: "T1566.003", T1168: "T1053", T1050: "T1543.003", T1058: "T1574.011", T1157: "T1574.004", T1145: "T1552.004", T1141: "T1056.002", T1186: "T1055.013", T1155: "T1059.002", T1152: "T1569.001", T1121: "T1218.009", T1514: "T1548.004", "T1562.006": "T1685", T1164: "T1547.007", "T1547.011": "T1647", T1191: "T1218.003", T1150: "T1647", T1032: "T1573", T1130: "T1553.004", T1122: "T1546.015", T1223: "T1218.001", "T1574.002": "T1574.001", T1198: "T1553.003", T1167: "T1555.002", T1562: "T1685", T1154: "T1546.005", T1065: "T1571", T1519: "T1546.014", T1181: "T1055.011", T1503: "T1555.003", T1170: "T1218.005", T1171: "T1557.001", T1177: "T1547.008", T1156: "T1546.004", "T1562.008": "T1685.002", T1035: "T1569.002", T1163: "T1037.004", T1165: "T1037.005", T1022: "T1560", T1178: "T1134.005", T1536: "T1578.004", T1089: "T1685", T1501: "T1543.002", T1028: "T1021.006", "T1562.013": "T1686.002", T1214: "T1552.002", T1192: "T1566.002", T1209: "T1547.003", T1161: "T1546.006", T1002: "T1560", T1166: "T1548.001", T1017: "T1072", T1126: "T1070.005", T1093: "T1055.012", T1004: "T1547.004", "T1562.011": "T1685.003", T1117: "T1218.010", T1077: "T1021.002", T1151: "T1036.006", T1148: "T1690", T1180: "T1546.002", T1066: "T1027.005", T1188: "T1090.003", "T1070.001": "T1685.005", T1138: "T1546.011", T1162: "T1647", T1504: "T1546.013", T1483: "T1568.002", T1073: "T1574.001", T1086: "T1059.001", "T1562.012": "T1685.004", "T1562.010": "T1689", T1131: "T1547.002", T1144: "T1553.001", T1079: "T1573", T1174: "T1556.002", T1019: "T1542.001", T1094: "T1095", T1196: "T1218.002", T1116: "T1553.002", T1146: "T1070.003", T1182: "T1546.009", T1139: "T1552.003", T1487: "T1561.002", T1103: "T1546.010", T1054: "T1685", "T1562.007": "T1686.001", T1097: "T1550.003", T1500: "T1027.004", T1107: "T1070.004", T1075: "T1550.002", T1173: "T1559.002", T1179: "T1056.004", T1492: "T1565.001", T1076: "T1021.001", T1494: "T1565.003", T1206: "T1548.003", T1023: "T1547.009", "T1562.002": "T1685.001" } };

// ../../packages/core/src/types.ts
var SEVERITIES = ["critical", "high", "medium", "low"];
var FIDELITIES = ["high", "medium", "low"];
var ACTIVATIONS = ["auto", "pinned", "disabled"];
var DEFAULT_SUPPRESSION = 300;
var RuleError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "RuleError";
  }
};

// ../../packages/core/src/attack.ts
function indexAttack(data) {
  return {
    version: data.version,
    techniques: new Map(data.techniques.map((t) => [t.id, t])),
    tactics: new Map(data.tactics.map((t) => [t.id, t.name])),
    data
  };
}

// ../../packages/core/src/csv.ts
function csvText(header, rows) {
  const cell = (v) => {
    const s = String(v);
    return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  const line = (r) => r.length === 1 && String(r[0]) === "" ? '""' : r.map(cell).join(",");
  return [header, ...rows].map(line).join("\n") + "\n";
}
function readCsv(text) {
  const out = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      out.push(row);
      row = [];
      field = "";
    } else field += ch;
  }
  if (field !== "" || row.length) {
    row.push(field);
    out.push(row);
  }
  const [header = [], ...rows] = out;
  return { header, rows };
}
function csvRecords(text) {
  const { header, rows } = readCsv(text);
  return rows.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ""])));
}

// ../../packages/core/src/yaml.ts
var import_yaml = __toESM(require_dist(), 1);
var MAX_FILE_BYTES = 1e6;
var PY = {
  true: /^(?:yes|Yes|YES|true|True|TRUE|on|On|ON)$/,
  false: /^(?:no|No|NO|false|False|FALSE|off|Off|OFF)$/,
  int: /^[-+]?(?:0|[1-9][0-9_]*)$/,
  floatExp: /^(?:[-+]?[0-9][0-9_]*\.[0-9_]*|\.[0-9_]+)[eE][-+][0-9]+$/,
  float: /^(?:[-+]?[0-9][0-9_]*\.[0-9_]*|\.[0-9_]+)$/,
  timeInt: /^[-+]?[1-9][0-9_]*(?::[0-5]?[0-9])+$/,
  // Same capture groups as the package's timestamp tag (its resolve() reads them); a date without
  // a time must have two-digit month and day.
  timestamp: /^(?=[0-9]{4}-[0-9]{2}-[0-9]{2}$|[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}(?:[Tt]|[ \t]+))([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \t]+)([0-9]{1,2}):([0-9]{2}):([0-9]{2}(\.[0-9]*)?)(?:[ \t]*(Z|[-+][0-9]{1,2}(?::[0-9]{2})?))?)?$/
};
function pyTags(tags) {
  return tags.map((t) => {
    if (typeof t !== "object" || !("test" in t) || !t.test) return t;
    const src = String(t.test);
    if (t.tag === "tag:yaml.org,2002:bool") return { ...t, test: src.includes("[Tt]rue") ? PY.true : PY.false };
    if (t.tag === "tag:yaml.org,2002:int" && !t.format) return { ...t, test: PY.int };
    if (t.tag === "tag:yaml.org,2002:int" && t.format === "TIME") return { ...t, test: PY.timeInt };
    if (t.tag === "tag:yaml.org,2002:float" && t.format === "EXP") return { ...t, test: PY.floatExp };
    if (t.tag === "tag:yaml.org,2002:float" && !t.format && !src.includes("inf")) return { ...t, test: PY.float };
    if (t.tag === "tag:yaml.org,2002:timestamp") return { ...t, test: PY.timestamp };
    return t;
  });
}
function loadYaml(text, path3 = "") {
  if (text.length > MAX_FILE_BYTES) throw new Error(`${path3}: larger than ${MAX_FILE_BYTES} bytes`);
  try {
    return (0, import_yaml.parse)(text, { version: "1.1", customTags: pyTags, uniqueKeys: false, maxAliasCount: 100, prettyErrors: true });
  } catch (e) {
    throw new Error(`${path3}: invalid YAML: ${e.message.split("\n")[0]}`);
  }
}
function pyStr(v) {
  if (v === null || v === void 0) return "None";
  if (v === true) return "True";
  if (v === false) return "False";
  if (v instanceof Date) {
    const iso = v.toISOString();
    return iso.endsWith("T00:00:00.000Z") ? iso.slice(0, 10) : iso.replace("T", " ").replace(/\.000Z$/, "").replace("Z", "");
  }
  return String(v);
}

// ../../packages/core/src/manifest.ts
var MANIFEST_FILE = "mitre-detect.yml";
var SOURCE_ID = /^[a-z0-9_]{1,24}$/;
var ManifestError = class extends Error {
  constructor(message) {
    super(`${MANIFEST_FILE}: ${message}`);
    this.name = "ManifestError";
  }
};
var strings = (v, key, dflt) => {
  if (v === void 0 || v === null) return dflt;
  const a = Array.isArray(v) ? v : [v];
  if (!a.every((x) => typeof x === "string" && x.trim())) throw new ManifestError(`${key} must be a list of strings`);
  return a.map((x) => x.trim());
};
function parseManifest(text) {
  if (text === void 0) throw new ManifestError("not found at the repository root. See examples/custom-detections/mitre-detect.yml.");
  const d = loadYaml(text, MANIFEST_FILE);
  if (!d || typeof d !== "object" || Array.isArray(d)) throw new ManifestError("must be a mapping");
  if (d.schema !== 1) throw new ManifestError(`schema must be 1 (found ${JSON.stringify(d.schema ?? null)})`);
  const id = d.source_id;
  if (typeof id !== "string" || !SOURCE_ID.test(id)) throw new ManifestError("source_id must be 1-24 lowercase letters, digits or underscores");
  const sigma = d.sigma ?? {};
  const defaults = d.defaults ?? {};
  const activation = defaults.activation ?? "auto";
  if (!ACTIVATIONS.includes(activation)) throw new ManifestError(`defaults.activation must be one of ${ACTIVATIONS.join(", ")}`);
  const supp = Number(defaults.suppression_sec ?? DEFAULT_SUPPRESSION);
  if (!Number.isInteger(supp) || supp <= 0) throw new ManifestError("defaults.suppression_sec must be a positive integer");
  if (d.license !== void 0 && typeof d.license !== "string") throw new ManifestError("license must be a string");
  return {
    schema: 1,
    source_id: id,
    include: strings(d.include, "include", ["rules/**/*.yml"]),
    exclude: strings(d.exclude, "exclude", []),
    sigma: {
      levels: strings(sigma.levels, "sigma.levels", ["medium", "high", "critical"]),
      status: strings(sigma.status, "sigma.status", ["stable", "test"])
    },
    tests: strings(d.tests, "tests", ["tests/*.yml"]),
    defaults: { activation, suppression_sec: supp },
    license: d.license ?? "",
    require_tests: d.require_tests === void 0 ? true : d.require_tests === true
  };
}
function globRegex(glob) {
  let rx = "";
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === "*" && glob[i + 1] === "*") {
      i++;
      if (glob[i + 1] === "/") {
        i++;
        rx += "(?:.*/)?";
      } else rx += ".*";
    } else if (c === "*") rx += "[^/]*";
    else if (c === "?") rx += "[^/]";
    else rx += c.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  }
  return new RegExp(`^${rx}$`);
}
var matcher = (include, exclude = []) => {
  const inc = include.map(globRegex);
  const exc = exclude.map(globRegex);
  return (path3) => inc.some((r) => r.test(path3)) && !exc.some((r) => r.test(path3));
};

// ../../packages/core/src/repo-url.ts
var RepoUrlError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "RepoUrlError";
  }
};
var providerOf = (host) => host === "github.com" ? "github" : host === "gitlab.com" ? "gitlab" : host === "bitbucket.org" ? "bitbucket" : host === "dev.azure.com" ? "azure" : "other";
var TOKEN_USER = { github: "x-access-token", gitlab: "oauth2", bitbucket: "x-token-auth", azure: "pat", other: "git" };
function parseRepoUrl(input) {
  const s = input.trim();
  if (/^git@|^ssh:\/\//i.test(s)) throw new RepoUrlError("SSH remotes are not supported: use the HTTPS clone URL.");
  if (/^http:\/\//i.test(s)) throw new RepoUrlError("Plain http is not supported: use https.");
  let u;
  try {
    u = new URL(s);
  } catch {
    throw new RepoUrlError("Not a URL. Expected https://<user>:<token>@<host>/<owner>/<repo>.git");
  }
  if (u.protocol !== "https:") throw new RepoUrlError("Only https:// clone URLs are supported.");
  if (u.search || u.hash) throw new RepoUrlError("The clone URL must not have a query string or fragment.");
  const path3 = decodeURIComponent(u.pathname).replace(/^\/+|\/+$/g, "").replace(/\.git$/, "");
  if (!path3 || !path3.includes("/")) throw new RepoUrlError("The URL has no repository path (expected <host>/<owner>/<repo>).");
  const host = u.hostname.toLowerCase();
  const provider = providerOf(host);
  const user = decodeURIComponent(u.username);
  const pass = decodeURIComponent(u.password);
  const credential = !user && !pass ? null : pass ? { user, token: pass } : { user: TOKEN_USER[provider], token: user };
  const port = u.port ? `:${u.port}` : "";
  const url = `https://${host}${port}${u.pathname.replace(/\/+$/, "")}`;
  return { repo: { url, host: host + port, hostSlug: (host + port).replace(/[^a-z0-9]+/g, "_"), path: path3, provider, webBase: `https://${host}${port}/${path3}` }, credential };
}
function fileUrl(repo, commit, file) {
  const f = file.split("/").map(encodeURIComponent).join("/");
  switch (repo.provider) {
    case "gitlab":
      return `${repo.webBase}/-/blob/${commit}/${f}`;
    case "bitbucket":
      return `${repo.webBase}/src/${commit}/${f}`;
    case "azure":
      return `${repo.webBase}?path=/${f}&version=GC${commit}`;
    default:
      return `${repo.webBase}/blob/${commit}/${f}`;
  }
}
function basicAuth(c) {
  const bytes = new TextEncoder().encode(`${c.user}:${c.token}`);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return "Basic " + btoa(bin);
}
var redact = (text) => text.replace(/(https?:\/\/)[^/@\s]+@/gi, "$1***@").replace(/(Basic|Bearer)\s+[A-Za-z0-9+/=._-]+/g, "$1 ***");

// ../../packages/core/src/native.ts
var BUCKETS = [
  ["endpoint", (c) => 1e3 <= c && c < 2e3 || 201e3 <= c && c < 202e3],
  ["identity", (c) => 3e3 <= c && c < 4e3],
  ["network", (c) => 4e3 <= c && c < 5e3],
  ["application", (c) => 6e3 <= c && c < 7e3]
];
var CUSTOM_PREFIX = "c_";
var basename = (p) => p.slice(p.lastIndexOf("/") + 1);
var imported = (r) => r.origin?.type === "sigma";
function checkAttack(r, attack2) {
  const t = attack2.techniques.get(r.technique_id);
  const v = attack2.version;
  if (!t) throw new RuleError(`${r.id}: ${r.technique_id} is not in ATT&CK v${v} (revoked or renamed?)`);
  if (r.technique_name !== t.name) throw new RuleError(`${r.id}: ${r.technique_id} is named '${t.name}' in ATT&CK v${v}`);
  if (!t.tactics.includes(r.tactic_id))
    throw new RuleError(`${r.id}: ${r.technique_id} is not under ${r.tactic_id} in ATT&CK v${v} (${t.tactics.join(", ")})`);
  if (r.tactic_name !== attack2.tactics.get(r.tactic_id))
    throw new RuleError(`${r.id}: ${r.tactic_id} is named '${attack2.tactics.get(r.tactic_id)}' in ATT&CK v${v}`);
}
function validateRule(raw, file, opts = {}) {
  const r = { ...raw };
  r._file = file;
  const rid = r.id;
  if (!rid || typeof rid !== "string" || !/^[a-z0-9_]+$/.test(rid)) throw new RuleError(`${file}: bad or missing id ${JSON.stringify(rid ?? null)}`);
  if (opts.requirePrefix && !rid.startsWith(opts.requirePrefix)) throw new RuleError(`${rid}: id must start with ${opts.requirePrefix}`);
  if (!opts.requirePrefix && rid.startsWith(CUSTOM_PREFIX)) throw new RuleError(`${rid}: ids starting with ${CUSTOM_PREFIX} are reserved for custom rules`);
  if (opts.seen) {
    if (opts.seen.has(rid)) throw new RuleError(`duplicate rule id ${rid}`);
    opts.seen.add(rid);
  }
  for (const k of ["title", "technique_id", "technique_name", "tactic_id", "tactic_name", "class_uid", "severity"])
    if (!(k in r) || r[k] === void 0) throw new RuleError(`${rid}: missing ${k}`);
  if (!/^T\d{4}(\.\d{3})?$/.test(String(r.technique_id)) || !/^TA\d{4}$/.test(String(r.tactic_id))) throw new RuleError(`${rid}: bad technique/tactic id`);
  if (opts.attack) checkAttack(r, opts.attack);
  r.fidelity ??= "medium";
  r.activation ??= "auto";
  r.suppression_sec ??= DEFAULT_SUPPRESSION;
  if (!SEVERITIES.includes(r.severity) || !FIDELITIES.includes(r.fidelity) || !ACTIVATIONS.includes(r.activation))
    throw new RuleError(`${rid}: bad severity/fidelity/activation`);
  if (!Number.isInteger(Number(r.suppression_sec)) || Number(r.suppression_sec) <= 0) throw new RuleError(`${rid}: suppression_sec must be a positive integer`);
  const classes = Array.isArray(r.class_uid) ? r.class_uid : [r.class_uid];
  const buckets = new Set(classes.flatMap((c) => BUCKETS.filter(([, fn]) => fn(c)).map(([b]) => b)));
  if (buckets.size !== 1) throw new RuleError(`${rid}: class_uid [${classes.join(", ")}] must map to exactly one bucket`);
  r._bucket = [...buckets][0];
  r._classes = classes;
  const t = r.tests ?? {};
  if (opts.requireTests !== false && !imported(r) && (!t.pos?.length || !t.neg?.length)) throw new RuleError(`${rid}: needs at least one pos and one neg test`);
  r.tests = t;
  return r;
}
function expand(flat2) {
  const out = {};
  for (const [k, v] of Object.entries(flat2)) {
    let cur = out;
    const parts = k.split(".");
    for (const p of parts.slice(0, -1)) cur = cur[p] ??= {};
    cur[parts[parts.length - 1]] = v && typeof v === "object" && !Array.isArray(v) ? expand(v) : v;
  }
  return out;
}

// ../../packages/core/src/compile.ts
var import_safe_regex2 = __toESM(require_safe_regex2(), 1);

// ../../packages/core/src/sigma/py.ts
var Skip = class extends Error {
  constructor(message) {
    super(message);
    this.name = "Skip";
  }
};
var isMap = (v) => typeof v === "object" && v !== null && !Array.isArray(v) && !(v instanceof Date);
function pyTruthy(v) {
  if (v === null || v === void 0 || v === false || v === 0 || v === "") return false;
  if (Array.isArray(v)) return v.length > 0;
  if (isMap(v)) return Object.keys(v).length > 0;
  return true;
}
function pyEq(a, b) {
  const num = (x) => typeof x === "boolean" ? Number(x) : x;
  if (typeof num(a) === "number" && typeof num(b) === "number") return num(a) === num(b);
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
    return a.every((x, i) => pyEq(x, b[i]));
  }
  if (a instanceof Date || b instanceof Date)
    return a instanceof Date && b instanceof Date && a.getTime() === b.getTime();
  if (isMap(a) || isMap(b)) {
    if (!isMap(a) || !isMap(b)) return false;
    const ka = Object.keys(a);
    if (ka.length !== Object.keys(b).length) return false;
    return ka.every((k) => Object.hasOwn(b, k) && pyEq(a[k], b[k]));
  }
  return a === b;
}
var NON_PRINTABLE = /[\p{Cc}\p{Cf}\p{Cs}\p{Co}\p{Cn}\p{Zl}\p{Zp}\p{Zs}]/u;
function pyReprStr(s) {
  const q = s.includes("'") && !s.includes('"') ? '"' : "'";
  let out = q;
  for (const ch of s) {
    if (ch === q || ch === "\\") out += "\\" + ch;
    else if (ch === "	") out += "\\t";
    else if (ch === "\n") out += "\\n";
    else if (ch === "\r") out += "\\r";
    else if (ch !== " " && NON_PRINTABLE.test(ch)) {
      const cp = ch.codePointAt(0);
      const hex = cp.toString(16);
      out += cp < 256 ? "\\x" + hex.padStart(2, "0") : cp < 65536 ? "\\u" + hex.padStart(4, "0") : "\\U" + hex.padStart(8, "0");
    } else out += ch;
  }
  return out + q;
}
function pyRepr(v) {
  if (typeof v === "string") return pyReprStr(v);
  if (Array.isArray(v)) return "[" + v.map(pyRepr).join(", ") + "]";
  if (v instanceof Date) {
    const d = v;
    const p = (n) => String(n);
    if (pyStr(d).length === 10) return `datetime.date(${d.getUTCFullYear()}, ${p(d.getUTCMonth() + 1)}, ${p(d.getUTCDate())})`;
    return `datetime.datetime(${d.getUTCFullYear()}, ${d.getUTCMonth() + 1}, ${d.getUTCDate()}, ${d.getUTCHours()}, ${d.getUTCMinutes()}${d.getUTCSeconds() ? ", " + d.getUTCSeconds() : ""})`;
  }
  if (isMap(v)) return "{" + Object.entries(v).map(([k, x]) => `${pyRepr(k)}: ${pyRepr(x)}`).join(", ") + "}";
  return pyStr(v);
}
var pyStrAny = (v) => Array.isArray(v) || isMap(v) ? pyRepr(v) : pyStr(v);
var PY_WS = "\\t\\n\\x0b\\x0c\\r\\x1c-\\x20\\x85\\xa0\\u1680\\u2000-\\u200a\\u2028\\u2029\\u202f\\u205f\\u3000";
var WS_EDGES = new RegExp(`^[${PY_WS}]+|[${PY_WS}]+$`, "g");
var pyStrip = (s) => s.replace(WS_EDGES, "");
var WORD = /[\p{L}\p{N}_]/u;
var isWordChar = (ch) => ch !== void 0 && WORD.test(ch);
var reEscape = (s) => s.replace(/[\t\n\x0b\x0c\r #$&()*+\-.?[\\\]^{|}~]/g, "\\$&");
function cmpStr(a, b) {
  if (a === b) return 0;
  const A = [...a];
  const B = [...b];
  for (let i = 0; i < Math.min(A.length, B.length); i++) {
    if (A[i] !== B[i]) return A[i].codePointAt(0) - B[i].codePointAt(0);
  }
  return A.length - B.length;
}
var lower = (s) => s.toLowerCase();

// ../../packages/core/src/sigma/condition.ts
var KEYWORDS = /* @__PURE__ */ new Set(["and", "or", "not", "of", "them"]);
var TOKEN = new RegExp(`\\(|\\)|[^${PY_WS}()]+`, "g");
function tokenize(cond) {
  return (cond.match(TOKEN) ?? []).map((t) => KEYWORDS.has(t.toLowerCase()) ? t.toLowerCase() : t);
}
function parseCondition(cond, names) {
  const toks = tokenize(cond);
  let pos = 0;
  const peek = () => pos < toks.length ? toks[pos] : null;
  const take = () => {
    const t = peek();
    pos += 1;
    return t;
  };
  const expand2 = (pattern) => {
    if (pattern === null) throw new Skip("condition ends early");
    let hits;
    if (pattern === "them") hits = names.filter((n) => !n.startsWith("_"));
    else {
      const rx = new RegExp("^" + reEscape(pattern).replaceAll("\\*", ".*") + "\\n?$");
      hits = names.filter((n) => rx.test(n));
    }
    if (!hits.length) throw new Skip(`condition pattern ${pyReprStr(pattern)} matches no selection`);
    return hits.map((n) => ["sel", n]);
  };
  const primary = () => {
    const t = take();
    if (t === null) throw new Skip("condition ends early");
    if (t === "(") {
      const x = expr();
      if (take() !== ")") throw new Skip("unbalanced parentheses in condition");
      return x;
    }
    if (t === "not") return ["not", primary()];
    if ((t === "1" || t === "all" || t === "any") && peek() === "of") {
      take();
      const items = expand2(take());
      return t === "all" ? ["and", items] : ["or", items];
    }
    if (names.includes(t)) return ["sel", t];
    throw new Skip(`unsupported condition token ${pyReprStr(t)}`);
  };
  const conj = () => {
    const items = [primary()];
    while (peek() === "and") {
      take();
      items.push(primary());
    }
    return items.length === 1 ? items[0] : ["and", items];
  };
  const expr = () => {
    const items = [conj()];
    while (peek() === "or") {
      take();
      items.push(conj());
    }
    return items.length === 1 ? items[0] : ["or", items];
  };
  if (cond.includes("|")) throw new Skip("aggregation condition (| count/near) is not single-event");
  const ast = expr();
  if (peek() !== null) throw new Skip(`trailing condition tokens ${pyRepr(toks.slice(pos))}`);
  return ast;
}

// ../../packages/core/src/sigma/values.ts
var STAR = { wild: "*" };
var isWild = (p) => typeof p !== "string";
var isStar = (p) => p !== void 0 && isWild(p) && p.wild === "*";
var WINDASH = ["-", "/", "\u2013", "\u2014", "\u2015"];
var MODIFIERS = /* @__PURE__ */ new Set(["contains", "startswith", "endswith", "re", "all", "windash", "exists", "gt", "gte", "lt", "lte", "i"]);
function sigmaParts(value) {
  const v = [...value];
  const parts = [];
  let buf = "";
  let i = 0;
  while (i < v.length) {
    const c = v[i];
    if (c === "\\" && i + 1 < v.length && "*?\\".includes(v[i + 1])) {
      buf += v[i + 1];
      i += 2;
      continue;
    }
    if (c === "*" || c === "?") {
      if (buf) {
        parts.push(buf);
        buf = "";
      }
      parts.push({ wild: c });
    } else buf += c;
    i += 1;
  }
  if (buf) parts.push(buf);
  return parts;
}
function toRegex(parts) {
  let out = "";
  for (const p of parts) {
    if (isWild(p)) out += p.wild === "*" ? "[\\s\\S]*" : "[\\s\\S]";
    else out += reEscape(lower(p));
  }
  out = out.replace(/\\([ '"])/g, "$1");
  return "^" + out + "$";
}
function classify(parts) {
  const lits = parts.filter((p) => !isWild(p));
  const wild = parts.filter(isWild);
  if (!wild.length) return ["eq", lits.join("")];
  const inner = parts.length > 2 ? parts.slice(1, -1) : [];
  if (lits.length === 1 && wild.every((w) => w.wild === "*") && !inner.some(isWild)) {
    const lead = isStar(parts[0]);
    const trail = isStar(parts[parts.length - 1]);
    if (lead && trail && parts.length === 3) return ["contains", lits[0]];
    if (lead && !trail && parts.length === 2) return ["endswith", lits[0]];
    if (trail && !lead && parts.length === 2) return ["startswith", lits[0]];
  }
  return ["re", toRegex(parts)];
}
var JS_LACKS = /\(\?[a-zA-Z]|\(\?P<|\\[AZz]|[*+?}][+]/;
function jsRegex(pattern) {
  if (pattern.startsWith("(?i)")) pattern = pattern.slice(4);
  if (JS_LACKS.test(pattern))
    throw new Skip("regex uses a construct JavaScript lacks (inline flags, \\A/\\Z, named (?P<>), possessive)");
  const p = [...pattern];
  let out = "";
  let i = 0;
  while (i < p.length) {
    if (p[i] === "\\" && i + 1 < p.length) {
      out += p[i] + p[i + 1];
      i += 2;
    } else {
      out += lower(p[i]);
      i += 1;
    }
  }
  return out;
}
function subDash(v, ch) {
  const c = [...v];
  let out = "";
  for (let i = 0; i < c.length; i++) {
    const hit = (c[i] === "-" || c[i] === "/") && !isWordChar(c[i - 1]) && isWordChar(c[i + 1]);
    out += hit ? ch : c[i];
  }
  return out;
}
function windash(values) {
  const out = [];
  for (const v of values) {
    for (const ch of WINDASH) {
      const w = subDash(v, ch);
      if (!out.includes(w)) out.push(w);
    }
  }
  return out;
}
function mergeParts(parts) {
  const out = [];
  for (const p of parts) {
    if (isWild(p)) {
      if (p.wild === "*" && isStar(out[out.length - 1])) continue;
      out.push(p);
    } else if (out.length && !isWild(out[out.length - 1])) {
      out[out.length - 1] = out[out.length - 1] + p;
    } else if (p) out.push(p);
  }
  return out;
}
function opParts(op, text) {
  return { eq: [text], contains: [STAR, text, STAR], startswith: [text, STAR], endswith: [STAR, text] }[op];
}
var one = (xs) => xs.length > 1 ? xs : xs[0];
function convertField(key, value, src) {
  const [field, ...allMods] = key.split("|");
  if (!field) throw new Skip("keyword (field-less) search");
  const unsupported = allMods.filter((m) => !MODIFIERS.has(m));
  if (unsupported.length) throw new Skip(`modifier ${unsupported.join("|")} not supported`);
  const path3 = Object.hasOwn(src.fields, field) ? src.fields[field] : "unmapped." + field;
  const values = Array.isArray(value) ? value : [value];
  if (!values.length) throw new Skip(`empty value list for ${field}`);
  const wantAll = allMods.includes("all");
  const mods = allMods.filter((m) => m !== "all" && m !== "i");
  const all = wantAll ? "|all" : "";
  if (mods.includes("exists")) return { [`${path3}|exists`]: pyTruthy(values[0]) };
  if (mods.some((m) => m === "gt" || m === "gte" || m === "lt" || m === "lte"))
    return { [`${path3}|${mods[0]}`]: values[0] };
  if (values.some((v) => v === null || v === void 0)) {
    if (values.length === 1 && !mods.length) return { [`${path3}|exists`]: false };
    throw new Skip(`null mixed with values for ${field}`);
  }
  if (values.some((v) => Array.isArray(v) || isMap(v))) throw new Skip(`nested value for ${field}`);
  if (mods.includes("re")) {
    if (mods.some((m) => m !== "re")) throw new Skip("re combined with other modifiers");
    const pats = values.map((v) => jsRegex(pyStrAny(v)));
    return { [`${path3}|re${all}`]: one(pats) };
  }
  let strs = values.map((v) => typeof v === "boolean" ? lower(pyStrAny(v)) : pyStrAny(v));
  if (mods.includes("windash")) {
    if (wantAll) throw new Skip("windash with |all");
    strs = windash(strs);
  }
  const base = mods.filter((m) => m === "contains" || m === "startswith" || m === "endswith");
  if (base.length > 1) throw new Skip("several match modifiers on one field");
  let wrapped = strs.map((s) => {
    let parts = sigmaParts(s);
    if (base[0] === "contains") parts = [STAR, ...parts, STAR];
    else if (base[0] === "startswith") parts = [...parts, STAR];
    else if (base[0] === "endswith") parts = [STAR, ...parts];
    return classify(mergeParts(parts));
  });
  let ops = new Set(wrapped.map(([op2]) => op2));
  if (ops.size > 1) {
    wrapped = wrapped.map(([op2, t]) => ["re", op2 === "re" ? t : toRegex(opParts(op2, t))]);
    ops = /* @__PURE__ */ new Set(["re"]);
  }
  const op = [...ops][0];
  let texts = wrapped.map(([, t]) => t);
  if (op === "re") texts = texts.map((t) => jsRegex(t));
  const suffix = op === "eq" ? "" : "|" + op;
  return { [`${path3}${suffix}${all}`]: one(texts) };
}

// ../../packages/core/src/sigma/logic.ts
var MAX_TERMS = 64;
function selectionBlocks(sel, src) {
  const maps = Array.isArray(sel) ? sel : [sel];
  const blocks = [];
  for (const m of maps) {
    if (!isMap(m)) throw new Skip("keyword list selection");
    const blk = {};
    for (const [k, v] of Object.entries(m)) {
      for (const [nk, nv] of Object.entries(convertField(k, v, src))) {
        if (Object.hasOwn(blk, nk)) throw new Skip(`two conditions on ${nk} in one selection`);
        blk[nk] = nv;
      }
    }
    blocks.push(blk);
  }
  return blocks;
}
function mergeBlocks(blocks) {
  const out = {};
  for (const b of blocks) {
    for (const [k, v] of Object.entries(b)) {
      if (Object.hasOwn(out, k) && !pyEq(out[k], v)) return packBlocks(blocks);
      out[k] = v;
    }
  }
  return out;
}
function packBlocks(blocks) {
  const out = [];
  for (const b of blocks) {
    const m = out.find((m2) => Object.entries(b).every(([k, v]) => !Object.hasOwn(m2, k) || pyEq(m2[k], v)));
    if (m) Object.assign(m, b);
    else out.push({ ...b });
  }
  return out;
}
function dnf(ast, sels) {
  switch (ast[0]) {
    case "sel":
      return sels.get(ast[1]).map((b) => [b]);
    case "or":
      return ast[1].flatMap((x) => dnf(x, sels));
    case "and": {
      let terms = [[]];
      for (const x of ast[1]) {
        const next = [];
        for (const a of terms) for (const b of dnf(x, sels)) next.push([...a, ...b]);
        terms = next;
        if (terms.length > MAX_TERMS) throw new Skip(`condition expands to more than ${MAX_TERMS} alternatives`);
      }
      return terms;
    }
    default:
      throw new Skip("negation inside a positive branch");
  }
}
function hasNot(ast) {
  return ast[0] === "not" || (ast[0] === "and" || ast[0] === "or") && ast[1].some(hasNot);
}
function ruleLogic(det, src) {
  if (!isMap(det)) throw new Skip("detection is not a mapping");
  let cond = det.condition;
  if (Array.isArray(cond)) {
    if (cond.length !== 1) throw new Skip("several conditions");
    cond = cond[0];
  }
  const names = Object.keys(det).filter((k) => k !== "condition" && k !== "timeframe");
  if (Object.hasOwn(det, "timeframe")) throw new Skip("timeframe (multi-event) rule");
  const sels = new Map(names.map((n) => [n, selectionBlocks(det[n], src)]));
  const ast = parseCondition(pyStrAny(cond), names);
  const factors = ast[0] === "and" ? ast[1] : [ast];
  const pos = [];
  const neg = [];
  for (const f of factors) {
    if (f[0] === "not") {
      if (hasNot(f[1])) throw new Skip("nested negation");
      neg.push(...dnf(f[1], sels).map(mergeBlocks));
    } else if (hasNot(f)) throw new Skip("negation below the top-level AND");
    else pos.push(f);
  }
  if (!pos.length) throw new Skip("condition has no positive part");
  const terms = dnf(pos.length > 1 ? ["and", pos] : pos[0], sels).map(mergeBlocks);
  return [terms, neg];
}

// ../../packages/core/src/sigma/convert.ts
var AUTH_EVENTS = /* @__PURE__ */ new Set([
  "consolelogin",
  "assumerole",
  "getsessiontoken",
  "getfederationtoken",
  "assumerolewithsaml",
  "assumerolewithwebidentity"
]);
var FIDELITY = { stable: "high", test: "medium", experimental: "low" };
var SIGMA_SOURCES = {
  windows_process_creation: {
    glob: "rules/windows/process_creation/*.yml",
    logsource: { product: "windows", category: "process_creation" },
    out: "sigma_windows_process_creation.yml",
    fields: { Image: "process.file.path", CommandLine: "process.cmd_line", ParentImage: "process.parent_process.file.path" },
    guard: { activity_id: 1, "metadata.product.vendor_name": "microsoft" },
    header: "Windows process creation (Sysmon 1, Security 4688) -> OCSF 1007 Launch."
  },
  aws_cloudtrail: {
    glob: "rules/cloud/aws/**/*.yml",
    logsource: { product: "aws", service: "cloudtrail" },
    out: "sigma_aws_cloudtrail.yml",
    fields: { eventName: "api.operation", eventSource: "api.service.name" },
    guard: { "cloud.provider": "aws" },
    header: "AWS CloudTrail -> OCSF 6003 API Activity (3002 Authentication for sign-in events)."
  }
};
var MITRE_CACHE = /* @__PURE__ */ new WeakMap();
function mitreIndex(attack2) {
  const hit = MITRE_CACHE.get(attack2);
  if (hit) return hit;
  const d = attack2.data;
  const tactics = new Map(d.tactics.map((t) => [t.short, [t]]));
  const tacticById = new Map(d.tactics.map((t) => [t.id, t]));
  const techniques = new Map(d.techniques.map((t) => [t.id, t]));
  if (!tactics.has("defense-evasion") && tactics.has("stealth"))
    tactics.set("defense-evasion", [...tactics.get("stealth"), ...tactics.get("defense-impairment") ?? []]);
  for (const [old, nu] of Object.entries(d.revoked ?? {})) {
    const t = techniques.get(nu);
    if (!techniques.has(old) && t) techniques.set(old, t);
  }
  const idx = { tactics, tacticById, techniques };
  MITRE_CACHE.set(attack2, idx);
  return idx;
}
var TECH_TAG = new RegExp("^attack\\.t\\p{Nd}{4}(\\.\\p{Nd}{3})?$", "u");
var after = (s, sep) => s.slice(s.indexOf(sep) + sep.length);
function mitre(tagsIn, attack2) {
  const { tactics, tacticById, techniques } = mitreIndex(attack2);
  const tags = tagsIn.filter((t) => typeof t === "string");
  const techs = tags.filter((t) => TECH_TAG.test(t)).map((t) => after(t, ".").toUpperCase());
  if (!techs.length) throw new Skip("no ATT&CK technique tag");
  let tech = techs.find((t) => techniques.has(t)) ?? techs.map((t) => t.split(".")[0]).find((t) => techniques.has(t));
  if (!tech) throw new Skip(`technique ${techs[0]} not in bundled ATT&CK`);
  tech = techniques.get(tech).id;
  const tagged = tags.filter((t) => t.startsWith("attack.") && tactics.has(after(t, "."))).flatMap((t) => tactics.get(after(t, ".")).map((x) => x.id));
  const allowed = techniques.get(tech).tactics;
  const tactic = tagged.find((t) => allowed.includes(t)) ?? (allowed.length ? allowed[0] : null);
  if (!tactic) throw new Skip(`technique ${tech} has no tactic`);
  return [tech, techniques.get(tech).name, tactic, tacticById.get(tactic).name];
}
function classFor(srcKey, terms) {
  if (srcKey === "windows_process_creation") return 1007;
  const ops = /* @__PURE__ */ new Set();
  for (const t of terms) {
    const found = (Array.isArray(t) ? t : [t]).filter((b) => Object.hasOwn(b, "api.operation")).map((b) => b["api.operation"]);
    const v = found.length === 1 ? found[0] : null;
    if (v === null) ops.add(null);
    else for (const x of Array.isArray(v) ? v : [v]) ops.add(String(x).toLowerCase());
  }
  if (ops.size && !ops.has(null) && [...ops].every((o2) => AUTH_EVENTS.has(o2))) return 3002;
  if ([...ops].some((o2) => o2 !== null && AUTH_EVENTS.has(o2))) throw new Skip("mixes sign-in events (OCSF 3002) with API events (6003)");
  return 6003;
}
function logsourceMatches(ls, src) {
  if (!isMap(ls)) return Object.keys(src.logsource).length === 0;
  for (const [k, v] of Object.entries(src.logsource)) if (!Object.hasOwn(ls, k) || !pyEq(ls[k], v)) return false;
  return Object.keys(ls).every((k) => Object.hasOwn(src.logsource, k) || k === "definition");
}
var logsourceOf = (doc) => pyTruthy(doc.logsource) ? doc.logsource : {};
var WS_RUN = new RegExp(`[${PY_WS}]+`, "g");
function convertDoc(doc, rel, srcKey, src, opts) {
  if (!isMap(doc) || !Object.hasOwn(doc, "detection")) throw new Skip("not a detection rule");
  const ls = logsourceOf(doc);
  if (!logsourceMatches(ls, src)) throw new Skip(`logsource ${pyRepr(ls)} is not plain ${pyRepr(src.logsource)}`);
  if (!opts.status.includes(doc.status)) throw new Skip(`filtered: status ${pyStrAny(doc.status)}`);
  if (!opts.levels.includes(doc.level)) throw new Skip(`filtered: level ${pyStrAny(doc.level)}`);
  if (!Object.hasOwn(doc, "id")) throw new Skip("rule has no id");
  if (!Object.hasOwn(doc, "title")) throw new Skip("rule has no title");
  const sid = pyStrAny(doc.id);
  const rid = opts.idPrefix + [...sid.replaceAll("-", "")].slice(0, 12).join("");
  const tags = pyTruthy(doc.tags) ? doc.tags : [];
  const [tech, techName, tactic, tacticName] = mitre(Array.isArray(tags) ? tags : [...String(tags)], opts.attack);
  const [terms, neg] = ruleLogic(doc.detection, src);
  const cls = classFor(srcKey, terms);
  const match = { ...src.guard };
  let anyOf;
  if (terms.length === 1 && !Array.isArray(terms[0])) {
    for (const [k, v] of Object.entries(terms[0])) {
      if (Object.hasOwn(match, k)) throw new Skip(`rule sets guard field ${k}`);
      match[k] = v;
    }
    anyOf = [];
  } else anyOf = terms;
  const author = pyStrip(pyStrAny(pyTruthy(doc.author) ? doc.author : "unknown").replace(WS_RUN, " "));
  const level = doc.level;
  const status = doc.status;
  const r = {
    id: rid,
    title: pyStrip(pyStrAny(doc.title)),
    technique_id: tech,
    technique_name: techName,
    tactic_id: tactic,
    tactic_name: tacticName,
    class_uid: cls,
    severity: level === "informational" ? "low" : level,
    // the pack has no informational
    fidelity: Object.hasOwn(FIDELITY, status) ? FIDELITY[status] : "low",
    match
  };
  if (anyOf.length) r.any_of = anyOf;
  if (neg.length) r.not = neg;
  const date = pyTruthy(doc.modified) ? doc.modified : pyTruthy(doc.date) ? doc.date : "";
  r.origin = {
    type: "sigma",
    id: sid,
    author,
    license: opts.license,
    url: opts.urlFor(rel),
    status,
    date: pyStrAny(date)
  };
  return r;
}
function flatBlocks(r) {
  const out = [];
  const all = [r.match ?? {}, ...r.any_of ?? [], ...r.not ?? []];
  for (const b of all) out.push(...Array.isArray(b) ? b : [b]);
  return out;
}
function regexes(r) {
  const out = /* @__PURE__ */ new Set();
  for (const blk of flatBlocks(r))
    for (const [k, vs] of Object.entries(blk))
      if (k.includes("|re")) for (const v of Array.isArray(vs) ? vs : [vs]) out.add(v);
  return out;
}
function badRegexes(rules) {
  const bad = /* @__PURE__ */ new Set();
  for (const r of rules)
    for (const x of regexes(r)) {
      try {
        new RegExp(String(x).replace(/\//g, "\\/"), "i");
      } catch {
        bad.add(x);
      }
    }
  return bad;
}
var relOf = (p) => p.replace(/^(\.\/)+/, "");
function finish(key, p, res) {
  const bad = badRegexes(p.rules);
  const keep = [];
  p.rules.forEach((r, i) => {
    if ([...regexes(r)].some((x) => bad.has(x)))
      res.skipped.push({ source: key, path: p.rels[i], reason: "regex does not compile in JavaScript" });
    else keep.push(r);
  });
  const ids = new Set(keep.map((r) => r.id));
  if (ids.size !== keep.length) throw new Error(`${key}: rule id collision; lengthen the id prefix`);
  res.bySource[key] = keep;
}
function record(e, key, path3, res) {
  if (!(e instanceof Skip)) throw e;
  if (key !== null && e.message.startsWith("filtered:")) res.filtered.push({ source: key, path: path3, reason: e.message });
  else res.skipped.push({ source: key, path: path3, reason: e.message });
}
function sourceKeys(opts) {
  const keys = opts.sources ?? Object.keys(SIGMA_SOURCES);
  for (const k of keys) if (!Object.hasOwn(SIGMA_SOURCES, k)) throw new Error(`unknown Sigma source ${k}`);
  return keys;
}
var byPath = (files) => files.map((f) => ({ ...f, path: relOf(f.path) })).sort((a, b) => cmpStr(a.path, b.path));
function isSigmaDoc(doc) {
  return isMap(doc) && Object.hasOwn(doc, "logsource") && Object.hasOwn(doc, "detection");
}
function convertSigmaRepo(files, opts) {
  const res = { bySource: {}, skipped: [], filtered: [] };
  const keys = sourceKeys(opts);
  const pending = new Map(keys.map((k) => [k, { rules: [], rels: [] }]));
  for (const f of byPath(files)) {
    let doc;
    try {
      doc = loadYaml(f.text, f.path);
    } catch (e) {
      res.skipped.push({ source: null, path: f.path, reason: e.message });
      continue;
    }
    if (!isSigmaDoc(doc)) continue;
    const ls = logsourceOf(doc);
    const key = keys.find((k) => logsourceMatches(ls, SIGMA_SOURCES[k])) ?? null;
    if (key === null) {
      res.skipped.push({ source: null, path: f.path, reason: `logsource ${pyRepr(ls)} is not supported` });
      continue;
    }
    const p = pending.get(key);
    try {
      p.rules.push(convertDoc(doc, f.path, key, SIGMA_SOURCES[key], opts));
      p.rels.push(f.path);
    } catch (e) {
      record(e, key, f.path, res);
    }
  }
  for (const key of keys) finish(key, pending.get(key), res);
  return res;
}

// ../../packages/core/src/compile.ts
var MAX_FILES = 5e3;
var MAX_REGEX_LENGTH = 1e3;
var idPrefix = (sourceId) => `${CUSTOM_PREFIX}${sourceId}_`;
function blocksOf(b) {
  if (!b) return [];
  return Array.isArray(b) ? b.flatMap((x) => blocksOf(x)) : [b];
}
function regexProblems(r) {
  const out = [];
  for (const blk of [...blocksOf(r.match), ...(r.any_of ?? []).flatMap((a) => blocksOf(a)), ...blocksOf(r.not)]) {
    for (const [k, v] of Object.entries(blk)) {
      if (!k.split("|").slice(1).some((m) => m === "re" || m === "jre")) continue;
      for (const src of (Array.isArray(v) ? v : [v]).map(String)) {
        if (src.length > MAX_REGEX_LENGTH) out.push(`${k}: regex longer than ${MAX_REGEX_LENGTH} characters`);
        else {
          try {
            new RegExp(src, "i");
          } catch (e) {
            out.push(`${k}: regex does not compile in JavaScript (${e.message})`);
            continue;
          }
          if (!(0, import_safe_regex2.default)(src)) out.push(`${k}: regex may backtrack catastrophically (nested quantifiers): ${src}`);
        }
      }
    }
  }
  return out;
}
function compileSource(input) {
  const byPath2 = new Map(input.files.map((f) => [f.path, f]));
  const manifest = parseManifest(byPath2.get(MANIFEST_FILE)?.text);
  const prefix = idPrefix(manifest.source_id);
  const link = (p) => input.repo && input.commit ? fileUrl(input.repo, input.commit, p) : p;
  const want = matcher(manifest.include, manifest.exclude);
  const isTests = matcher(manifest.tests);
  const out = { manifest, rules: [], files: /* @__PURE__ */ new Map(), skipped: [], filtered: [], errors: [] };
  const paths = [...byPath2.keys()].filter((p) => /\.ya?ml$/i.test(p) && want(p) && !isTests(p) && p !== MANIFEST_FILE).sort();
  if (paths.length > MAX_FILES) throw new RuleError(`${paths.length} rule files match include; the limit is ${MAX_FILES}`);
  const tests = /* @__PURE__ */ new Map();
  for (const p of [...byPath2.keys()].filter(isTests).sort()) {
    try {
      const d = loadYaml(byPath2.get(p).text, p);
      for (const [k, v] of Object.entries(d ?? {})) tests.set(String(k), v);
    } catch (e) {
      out.errors.push({ path: p, message: e.message });
    }
  }
  const sigmaFiles = [];
  const docs = [];
  for (const p of paths) {
    let d;
    try {
      d = loadYaml(byPath2.get(p).text, p);
    } catch (e) {
      out.errors.push({ path: p, message: e.message });
      continue;
    }
    if (isSigmaDoc(d)) sigmaFiles.push(byPath2.get(p));
    else if (d && typeof d === "object" && Array.isArray(d.rules))
      for (const r of d.rules) docs.push({ path: p, doc: { ...r, id: prefix + String(r.id ?? ""), origin: { type: "native", license: manifest.license || void 0, url: link(p) } } });
    else out.skipped.push({ path: p, message: "neither a Sigma rule (logsource + detection) nor a native rules file (rules: [...])" });
  }
  const sigma = convertSigmaRepo(sigmaFiles, {
    attack: input.attack,
    idPrefix: prefix,
    license: manifest.license,
    urlFor: link,
    levels: manifest.sigma.levels,
    status: manifest.sigma.status
  });
  for (const s of sigma.skipped) out.skipped.push({ path: s.path, message: s.reason });
  for (const s of sigma.filtered) out.filtered.push({ path: s.path, message: s.reason });
  const sigmaPath = /* @__PURE__ */ new Map();
  for (const f of sigmaFiles) {
    const d = loadYaml(f.text, f.path);
    sigmaPath.set(String(d.id), f.path);
  }
  for (const r of Object.values(sigma.bySource).flat()) {
    const sid = r.origin?.id ?? "";
    docs.push({ path: sigmaPath.get(sid) ?? "", doc: { ...r, tests: tests.get(sid) ?? r.tests } });
  }
  const seen = new Set(input.taken ?? []);
  for (const { path: path3, doc } of docs) {
    const native = doc.origin?.type === "native";
    const d = {
      ...doc,
      activation: doc.activation ?? manifest.defaults.activation,
      suppression_sec: doc.suppression_sec ?? manifest.defaults.suppression_sec,
      tests: native ? doc.tests ?? tests.get(doc.id.slice(prefix.length)) : doc.tests
    };
    try {
      const r = validateRule(d, basename(path3), { attack: input.attack, requirePrefix: prefix, seen, requireTests: false });
      if (manifest.require_tests && (!r.tests.pos?.length || !r.tests.neg?.length)) {
        out.errors.push({ path: path3, ruleId: r.id, message: `${r.id}: needs at least one pos and one neg test${native ? "" : ` (add them to ${manifest.tests[0]} under ${r.origin?.id})`}` });
        continue;
      }
      const bad = regexProblems(r);
      if (bad.length) {
        for (const m of bad) out.errors.push({ path: path3, ruleId: r.id, message: `${r.id}: ${m}` });
        continue;
      }
      out.rules.push(r);
      out.files.set(r.id, { path: path3, url: link(path3) });
    } catch (e) {
      if (!(e instanceof RuleError)) throw e;
      out.errors.push({ path: path3, ruleId: d.id, message: e.message });
    }
  }
  return out;
}

// ../../packages/core/src/regex-literals.ts
var import_regjsparser = __toESM(require_parser2(), 1);
var FEATURES = { lookbehind: true, namedGroups: true, modifiers: true };
var PyError = class extends Error {
};
var MAXREPEAT = 4294967295;
var OCT = /[0-7]/;
var DIGIT = /[0-9]/;
var HEX = /[0-9a-fA-F]/;
var LETTER = /[a-zA-Z]/;
var ESCAPES = { a: 7, b: 8, f: 12, n: 10, r: 13, t: 9, v: 11, "\\": 92 };
var cat = (c) => ({ op: "IN", set: [{ op: "CATEGORY", cat: c }] });
var CATEGORIES = {
  A: { op: "AT", at: "AT_BEGINNING_STRING" },
  b: { op: "AT", at: "AT_BOUNDARY" },
  B: { op: "AT", at: "AT_NON_BOUNDARY" },
  d: cat("DIGIT"),
  D: cat("NOT_DIGIT"),
  s: cat("SPACE"),
  S: cat("NOT_SPACE"),
  w: cat("WORD"),
  W: cat("NOT_WORD"),
  Z: { op: "AT", at: "AT_END_STRING" }
};
function eqKey(it) {
  return ["LITERAL", "NOT_LITERAL", "ANY", "AT", "IN", "GROUPREF"].includes(it.op) ? JSON.stringify(it) : null;
}
var uniq = (xs) => [...new Map(xs.map((x) => [JSON.stringify(x), x])).values()];
function getwhile(src, pos, n, re) {
  let s = "";
  while (s.length < n && pos + s.length < src.length && re.test(src[pos + s.length])) s += src[pos + s.length];
  return s;
}
function escape(st, pos, inClass) {
  const { src } = st;
  const cp = src.codePointAt(pos + 1);
  if (cp === void 0) throw new PyError("bad escape (end of pattern)");
  const c = String.fromCodePoint(cp);
  let end = pos + 1 + c.length;
  const lit = (n) => ({ item: { op: "LITERAL", c: n }, end });
  if (inClass && c in ESCAPES) return lit(ESCAPES[c]);
  if (c in CATEGORIES) {
    const code = CATEGORIES[c];
    if (!inClass) return { item: code, end };
    if (code.op === "IN") return { item: code.set[0], end };
  }
  if (c in ESCAPES) return lit(ESCAPES[c]);
  const hex = (n) => {
    const h = getwhile(src, end, n, HEX);
    if (h.length !== n) throw new PyError(`incomplete escape \\${c}${h}`);
    end += n;
    return parseInt(h, 16);
  };
  if (c === "x") return lit(hex(2));
  if (c === "u") return lit(hex(4));
  if (c === "U") {
    const n = hex(8);
    if (n > 1114111) throw new PyError("bad escape");
    return lit(n);
  }
  if (c === "N") throw new PyError("\\N{...} needs the Unicode name database");
  if (inClass && OCT.test(c)) {
    const digits = c + getwhile(src, end, 2, OCT);
    end = pos + 1 + digits.length;
    if (parseInt(digits, 8) > 255) throw new PyError("octal escape value outside of range 0-0o377");
    return lit(parseInt(digits, 8));
  }
  if (inClass && DIGIT.test(c)) throw new PyError(`bad escape \\${c}`);
  if (c === "0") {
    end += getwhile(src, end, 2, OCT).length;
    return lit(parseInt(src.slice(pos + 1, end), 8));
  }
  if (DIGIT.test(c)) {
    if (DIGIT.test(src[end] ?? "")) {
      end++;
      if (OCT.test(c) && OCT.test(src[end - 1]) && OCT.test(src[end] ?? "")) {
        end++;
        const n = parseInt(src.slice(pos + 1, end), 8);
        if (n > 255) throw new PyError("octal escape value outside of range 0-0o377");
        return lit(n);
      }
    }
    const group = parseInt(src.slice(pos + 1, end), 10);
    if (group >= st.groups) throw new PyError(`invalid group reference ${group}`);
    if (!st.closed.has(group)) throw new PyError("cannot refer to an open group");
    if (st.lookbehind !== null && group >= st.lookbehind)
      throw new PyError("cannot refer to group defined in the same lookbehind subpattern");
    return { item: { op: "GROUPREF", group }, end };
  }
  if (LETTER.test(c)) throw new PyError(`bad escape \\${c}`);
  return lit(cp);
}
function escaped(st, n, inClass) {
  const r = escape(st, n.range[0], inClass);
  if (r.end < n.range[1]) throw new PyError(`${n.raw} reads differently in Python`);
  return r;
}
function exact(st, n, inClass) {
  const { item, end } = escaped(st, n, inClass);
  if (end !== n.range[1]) throw new PyError(`${n.raw} reads differently in Python`);
  return item;
}
function readOn(nodes, i, end) {
  while (i + 1 < nodes.length && nodes[i + 1].range[1] <= end) i++;
  return i;
}
var isHigh = (n) => n?.type === "value" && n.raw.length === 1 && n.codePoint >= 55296 && n.codePoint < 56320;
var isLow = (n) => n?.type === "value" && n.raw.length === 1 && n.codePoint >= 56320 && n.codePoint < 57344;
var astral = (hi, lo) => 65536 + (hi.codePoint - 55296 << 10) + (lo.codePoint - 56320);
function charClass(st, n) {
  const toks = [];
  const bound = (v) => v.raw[0] === "\\" ? exact(st, v, true) : { op: "LITERAL", c: v.codePoint };
  for (let i = 0; i < n.body.length; i++) {
    const b = n.body[i];
    if (b.type === "characterClassRange") {
      toks.push({ item: bound(b.min), dash: false }, { item: { op: "LITERAL", c: 45 }, dash: true }, { item: bound(b.max), dash: false });
    } else if (b.raw[0] === "\\" && (b.type === "value" || b.type === "characterClassEscape")) {
      const { item, end } = escaped(st, b, true);
      i = readOn(n.body, i, end);
      if (n.body[i + 1]?.range[0] < end) throw new PyError(`${b.raw} reads differently in Python`);
      toks.push({ item, dash: false });
    } else if (b.type === "value" && isHigh(b) && isLow(n.body[i + 1])) {
      toks.push({ item: { op: "LITERAL", c: astral(b, n.body[++i]) }, dash: false });
    } else if (b.type === "value") toks.push({ item: { op: "LITERAL", c: b.codePoint }, dash: b.raw === "-" });
    else throw new PyError(`${b.raw}: not Python syntax`);
  }
  let set = [];
  for (let i = 0; i < toks.length; ) {
    const code1 = toks[i++].item;
    if (!toks[i]?.dash) {
      set.push(code1);
      continue;
    }
    i++;
    if (i === toks.length) {
      set.push(code1, { op: "LITERAL", c: 45 });
      break;
    }
    const code2 = toks[i++].item;
    if (code1.op !== "LITERAL" || code2.op !== "LITERAL" || code2.c < code1.c) throw new PyError("bad character range");
    set.push({ op: "RANGE", lo: code1.c, hi: code2.c });
  }
  set = uniq(set);
  if (set.length === 1 && set[0].op === "LITERAL") return { op: n.negative ? "NOT_LITERAL" : "LITERAL", c: set[0].c };
  return { op: "IN", set: n.negative ? [{ op: "NEGATE" }, ...set] : set };
}
function atom(st, n) {
  if (n.raw[0] === "\\") return exact(st, n, false);
  switch (n.type) {
    case "value":
      return { op: "LITERAL", c: n.codePoint };
    case "dot":
      return { op: "ANY" };
    case "anchor":
      return { op: "AT", at: n.kind === "start" ? "AT_BEGINNING" : "AT_END" };
    case "characterClass":
      return charClass(st, n);
    case "group": {
      if (n.behavior === "normal") {
        if (n.name) throw new PyError("unknown extension ?<");
        const gid = st.groups++;
        const p2 = parseSub(st, n.body);
        st.closed.add(gid);
        return { op: "SUBPATTERN", group: gid, flags: "", p: p2 };
      }
      if (n.behavior === "ignore") {
        const f = n.modifierFlags;
        return { op: "SUBPATTERN", group: null, flags: f ? `${f.enabling}-${f.disabling}` : "", p: parseSub(st, n.body) };
      }
      if (n.behavior === "lookahead" || n.behavior === "negativeLookahead") return { op: "ASSERT", p: parseSub(st, n.body) };
      const outer = st.lookbehind;
      if (outer === null) st.lookbehind = st.groups;
      const p = parseSub(st, n.body);
      if (outer === null) st.lookbehind = null;
      return { op: "ASSERT", p };
    }
    default:
      throw new PyError(`${n.raw}: not Python syntax`);
  }
}
function repeat(n, it) {
  if (n.min >= MAXREPEAT || (n.max ?? 0) >= MAXREPEAT) throw new PyError("the repetition number is too large");
  if (it.op === "AT") throw new PyError("nothing to repeat");
  const item = it.op === "SUBPATTERN" && it.group === null && !it.flags ? it.p : [it];
  return { op: n.greedy ? "MAX_REPEAT" : "MIN_REPEAT", min: n.min, max: n.max ?? MAXREPEAT, item };
}
function parseSeq(st, terms) {
  const sub = [];
  for (let i = 0; i < terms.length; i++) {
    const n = terms[i];
    const next = terms[i + 1];
    if (isHigh(n) && (isLow(next) || next?.type === "quantifier" && isLow(next.body[0]))) {
      const lo = next.type === "quantifier" ? next.body[0] : next;
      const it = { op: "LITERAL", c: astral(n, lo) };
      sub.push(next.type === "quantifier" ? repeat(next, it) : it);
      i++;
    } else if (n.type === "quantifier") sub.push(repeat(n, atom(st, n.body[0])));
    else if (n.raw[0] === "\\") {
      const { item, end } = escaped(st, n, false);
      i = readOn(terms, i, end);
      const q = terms[i + 1];
      if (q?.range[0] < end) {
        if (q.type !== "quantifier" || q.body[0].range[1] !== end) throw new PyError(`${n.raw} reads differently in Python`);
        sub.push(repeat(q, item));
        i++;
      } else sub.push(item);
    } else sub.push(atom(st, n));
  }
  return sub.flatMap((it) => it.op === "SUBPATTERN" && it.group === null && !it.flags ? it.p : [it]);
}
function parseSub(st, body) {
  const alts = body.length === 1 && body[0].type === "disjunction" ? body[0].body.map((a) => a.type === "alternative" ? a.body : [a]) : [body];
  const items = alts.map((a) => parseSeq(st, a));
  if (items.length === 1) return items[0];
  const sub = [];
  for (; ; ) {
    const k = items[0].length ? eqKey(items[0][0]) : null;
    if (k === null || items.some((it) => !it.length || eqKey(it[0]) !== k)) break;
    sub.push(items[0][0]);
    for (const it of items) it.shift();
  }
  const set = [];
  for (const it of items) {
    const x = it.length === 1 ? it[0] : null;
    if (x?.op === "LITERAL") set.push({ op: "LITERAL", c: x.c });
    else if (x?.op === "IN" && x.set[0]?.op !== "NEGATE") set.push(...x.set);
    else {
      sub.push({ op: "BRANCH", items });
      return sub;
    }
  }
  sub.push({ op: "IN", set: uniq(set) });
  return sub;
}
function pythonSpelling(src, n) {
  if (n.type === "characterClass") {
    if (n.body.length) return null;
    const at = n.range[0] + (n.negative ? 2 : 1);
    return src.slice(0, at) + "\\" + src.slice(at);
  }
  if (n.type === "value") return n.raw === "{" && /^\{,\d*\}/.test(src.slice(n.range[0])) ? src.slice(0, n.range[0] + 1) + "0" + src.slice(n.range[0] + 1) : null;
  const kids = n.type === "alternative" || n.type === "disjunction" || n.type === "group" || n.type === "quantifier" ? n.body : [];
  for (const k of kids) {
    const s = pythonSpelling(src, k);
    if (s !== null) return s;
  }
  return null;
}
function parsePython(src) {
  let tree = import_regjsparser.default.parse(src, "", FEATURES);
  for (let s = pythonSpelling(src, tree); s !== null; s = pythonSpelling(src, tree)) {
    src = s;
    tree = import_regjsparser.default.parse(src, "", FEATURES);
  }
  return parseSub({ src, groups: 1, closed: /* @__PURE__ */ new Set(), lookbehind: null }, tree.type === "alternative" ? tree.body : [tree]);
}
var OPS = { ff: "contains", tf: "startswith", ft: "endswith", tt: "eq" };
function seq(items) {
  const lits = [];
  let buf = [];
  let left = false;
  const flush = (right = false) => {
    if (buf.length) lits.push([buf.map((c) => String.fromCodePoint(c)).join("").toLowerCase(), OPS[`${left ? "t" : "f"}${right ? "t" : "f"}`]]);
    buf = [];
  };
  for (const [i, it] of items.entries()) {
    if (it.op === "LITERAL") {
      buf.push(it.c);
      continue;
    }
    if (it.op === "AT" && it.at === "AT_BEGINNING" && i === 0) {
      left = true;
      continue;
    }
    if (it.op === "AT" && (it.at === "AT_END" || it.at === "AT_END_STRING") && i === items.length - 1) {
      flush(true);
      continue;
    }
    flush();
    left = false;
    const sub = it.op === "SUBPATTERN" ? seq(it.p) : (it.op === "MAX_REPEAT" || it.op === "MIN_REPEAT") && it.min >= 1 ? seq(it.item) : null;
    if (sub && sub.length === 1) lits.push(...sub[0].map(([l]) => [l, "contains"]));
  }
  flush();
  return lits.length ? [lits] : null;
}
function alternatives(branches) {
  const alts = branches.map(seq);
  return alts.some((a) => a === null) ? null : alts.map((a) => a[0]);
}
function regexLiterals(src) {
  let items;
  try {
    items = parsePython(src);
  } catch {
    return null;
  }
  if (items.length === 1 && items[0].op === "BRANCH") return alternatives(items[0].items);
  if (items.length === 1 && items[0].op === "SUBPATTERN") {
    const inner = items[0].p;
    if (inner.length === 1 && inner[0].op === "BRANCH") return alternatives(inner[0].items);
  }
  return seq(items);
}

// ../../packages/core/src/engine-build.ts
var GRAM = 4;
var SCREEN_MIN = 3;
function pyCmp(a, b) {
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    const x = a.codePointAt(i);
    const y = b.codePointAt(j);
    if (x !== y) return x - y;
    i += x > 65535 ? 2 : 1;
    j += y > 65535 ? 2 : 1;
  }
  return a.length - i - (b.length - j);
}
var pySorted = (xs) => [...xs].sort(pyCmp);
var pyLen = (s) => [...s].length;
var lower2 = (v) => pyStr(v).toLowerCase();
var listOf = (v) => Array.isArray(v) ? v : [v];
function truthy(v) {
  if (Array.isArray(v)) return v.length > 0;
  if (v && typeof v === "object") return Object.keys(v).length > 0;
  return Boolean(v);
}
function pyInt(v) {
  if (typeof v === "number" || typeof v === "boolean") return Math.trunc(Number(v));
  if (typeof v === "string" && /^\s*[+-]?\d+\s*$/.test(v)) return parseInt(v, 10);
  throw new Error(`invalid literal for int(): ${JSON.stringify(v)}`);
}
function jsRxEscape(s) {
  return s.replace(/[\\^$.*+?()[\]{}|/]/g, "\\$&");
}
function flat(b) {
  return Array.isArray(b) ? b.flatMap(flat) : [b];
}
function parseKey(key) {
  const [path3, ...mods] = key.split("|");
  const wantAll = mods.includes("all");
  const rest = mods.filter((m) => m !== "all");
  return [path3, rest.length ? rest[0] : "eq", wantAll];
}
function compileCond(key, value) {
  const [path3, op, wantAll] = parseKey(key);
  const values = listOf(value);
  if (op === "eq" && !wantAll) return [path3, "s", "in", values.map(lower2)];
  if (["eq", "contains", "startswith", "endswith", "re", "jcontains", "jre"].includes(op)) {
    const kind = op === "jcontains" || op === "jre" ? "j" : "s";
    const base = { jcontains: "contains", jre: "re" }[op] ?? op;
    if (base === "eq") return [path3, kind, "eqall", values.map(lower2)];
    if (base === "re") return [path3, kind, wantAll ? "rxall" : "rx", values.map(pyStr), "i"];
    const lits = values.map((x) => jsRxEscape(lower2(x)));
    const wrap = (l) => base === "startswith" ? "^" + l : base === "endswith" ? l + "$" : l;
    if (wantAll) return [path3, kind, "rxall", lits.map(wrap)];
    return [path3, kind, "rx", [wrap(lits.length === 1 ? lits[0] : "(?:" + lits.join("|") + ")")]];
  }
  const num = { gt: ">", gte: ">=", lt: "<", lte: "<=" };
  if (op in num) return [path3, "v", "num", [num[op], values[0]]];
  if (op === "len_gt") return [path3, "s", "len", pyInt(values[0])];
  if (op === "exists") return [path3, "s", "ex", truthy(values[0])];
  if (op === "private") return [path3, "s", "pv", truthy(values[0])];
  throw new Error(`unhandled '${key}'`);
}
function fullTokens(lit, op) {
  const out = [];
  for (const m of lit.matchAll(/[a-z0-9]+/g)) {
    const t = m[0];
    const left = m.index > 0 || op === "eq" || op === "startswith";
    const right = m.index + t.length < lit.length || op === "eq" || op === "endswith";
    if (left && right) out.push(t);
    else if (left && t.length >= GRAM) out.push("^" + t.slice(0, GRAM));
    else if (right && t.length >= GRAM) out.push("$" + t.slice(-GRAM));
  }
  return out;
}
function regexTokens(src) {
  const alts = regexLiterals(src);
  if (!alts) return null;
  const out = alts.map((alt) => alt.flatMap(([lit, op]) => fullTokens(lit, op)));
  return out.some((ts) => !ts.length) ? null : out;
}
function anchorOptions(key, value) {
  const [path3, op, wantAll] = parseKey(key);
  const values = listOf(value);
  if (op === "re") {
    const per = values.map((v) => regexTokens(pyStr(v)));
    if (wantAll) {
      const toks = per.flatMap((p) => p && p.length === 1 ? p[0] : []);
      return toks.length ? { path: path3, perValue: [toks] } : null;
    }
    if (per.some((p) => p === null)) return null;
    return { path: path3, perValue: per.flatMap((p) => p) };
  }
  if (!["eq", "contains", "startswith", "endswith"].includes(op) || op === "eq" && wantAll) return null;
  let perValue = values.map((v) => fullTokens(lower2(v), op));
  if (op !== "eq")
    perValue = perValue.map((ts, i) => ts.length ? ts : pyLen(pyStr(values[i])) >= SCREEN_MIN ? ["~" + lower2(values[i])] : []);
  if (wantAll) {
    const toks = perValue.flat();
    return toks.length ? { path: path3, perValue: [toks] } : null;
  }
  if (perValue.some((ts) => !ts.length)) return null;
  return { path: path3, perValue };
}
var dfKey = (path3, t) => `${path3}\0${t}`;
var lessCost = (a, b) => (a[0] - b[0] || a[1] - b[1]) < 0;
function rarest(df, path3, ts) {
  const cost = (t) => [df.get(dfKey(path3, t)), -pyLen(t)];
  let best = ts[0];
  for (const t of ts.slice(1)) {
    const [a, b] = [cost(t), cost(best)];
    if (lessCost(a, b) || !lessCost(b, a) && pyCmp(t, best) < 0) best = t;
  }
  return best;
}
var entries = (blk) => Object.entries(blk);
function prefilter(term, df) {
  const out = [];
  for (const blk of term) {
    for (const [k, v] of entries(blk)) {
      const [, , wantAll] = parseKey(k);
      const o2 = anchorOptions(k, v);
      if (!o2) continue;
      if (wantAll) {
        const toks = pySorted(new Set(o2.perValue[0].filter((t) => t[0] !== "~")));
        if (toks.length) out.push([o2.path, 1, toks]);
      } else {
        const picks = new Set(o2.perValue.map((ts) => rarest(df, o2.path, ts)));
        if (![...picks].some((t) => t[0] === "~")) out.push([o2.path, 0, pySorted(picks)]);
      }
    }
  }
  return out;
}
function trieRegex(lits) {
  const root = /* @__PURE__ */ new Map();
  for (const lit of lits) {
    let node = root;
    for (const ch of lit) {
      if (!node.has(ch)) node.set(ch, /* @__PURE__ */ new Map());
      node = node.get(ch);
    }
    node.set("", /* @__PURE__ */ new Map());
  }
  const rx = (node) => {
    const parts = pySorted(node.keys()).filter((ch) => ch).map((ch) => jsRxEscape(ch) + rx(node.get(ch)));
    if (!parts.length) return "";
    const body = parts.length === 1 ? parts[0] : "(?:" + parts.join("|") + ")";
    return node.has("") ? "(?:" + body + ")?" : body;
  };
  return rx(root);
}
function termsOf(r) {
  const match = truthy(r.match) ? flat(r.match) : [];
  if (truthy(r.any_of)) return r.any_of.map((a) => [...match, ...flat(a)]);
  return [match];
}
function notsOf(r) {
  const n = r.not;
  return truthy(n) ? (Array.isArray(n) ? n : [n]).map(flat) : [];
}
function splitN(s, sep, n) {
  const parts = s.split(sep);
  return parts.length > n + 1 ? [...parts.slice(0, n), parts.slice(n).join(sep)] : parts;
}
function build(rules, opts = {}) {
  const order = (r) => [SEVERITIES.indexOf(r.severity), FIDELITIES.indexOf(r.fidelity)];
  const ranked = [...rules].sort((a, b) => {
    const [x, y] = [order(a), order(b)];
    return x[0] - y[0] || x[1] - y[1] || pyCmp(a.id, b.id);
  });
  const df = /* @__PURE__ */ new Map();
  for (const r of rules) {
    const seen = /* @__PURE__ */ new Set();
    for (const blk of termsOf(r).flat()) {
      for (const [k, v] of entries(blk)) {
        const o2 = anchorOptions(k, v);
        if (o2) for (const t of o2.perValue.flat()) seen.add(dfKey(o2.path, t));
      }
    }
    for (const x of seen) df.set(x, (df.get(x) ?? 0) + 1);
  }
  const index = /* @__PURE__ */ new Map();
  const fields = /* @__PURE__ */ new Map();
  const always = /* @__PURE__ */ new Map();
  const defs = [];
  const stats = { anchored: 0, always: 0, screened_literals: 0, index_keys: 0, max_rules_per_key: 0 };
  const addField = (c, path3) => {
    if (!fields.has(c)) fields.set(c, /* @__PURE__ */ new Set());
    fields.get(c).add(path3);
  };
  for (const [rank, r] of ranked.entries()) {
    const anchors = /* @__PURE__ */ new Map();
    let anchorable = true;
    for (const term of termsOf(r)) {
      let best = null;
      for (const blk of term) {
        for (const [k, v] of entries(blk)) {
          const o2 = anchorOptions(k, v);
          if (!o2) continue;
          const picks = o2.perValue.map((ts) => rarest(df, o2.path, ts));
          const cost = [picks.reduce((s, t) => s + df.get(dfKey(o2.path, t)), 0), -Math.min(...picks.map(pyLen))];
          if (best === null || lessCost(cost, best.cost)) best = { cost, path: o2.path, picks };
        }
      }
      if (best === null) {
        anchorable = false;
        break;
      }
      for (const t of best.picks) anchors.set(dfKey(best.path, t), [best.path, t]);
    }
    for (const c of r._classes) {
      if (anchorable) {
        for (const [path3, t] of anchors.values()) {
          const k = `${c}|${path3}|${t}`;
          if (!index.has(k)) index.set(k, []);
          index.get(k).push(r.id);
          addField(c, path3);
        }
      } else {
        if (!always.has(c)) always.set(c, []);
        always.get(c).push(r.id);
      }
    }
    stats[anchorable ? "anchored" : "always"]++;
    const pres = termsOf(r).map((term) => prefilter(term, df));
    for (const [path3] of pres.flat()) for (const c of r._classes) addField(c, path3);
    const conds = (terms) => terms.map((term) => term.flatMap((blk) => entries(blk).map(([k, v]) => compileCond(k, v))));
    defs.push([r.id, { c: r._classes, p: pres }, { r: String(rank).padStart(6, "0"), t: conds(termsOf(r)), n: conds(notsOf(r)) }]);
  }
  const screens = /* @__PURE__ */ new Map();
  for (const k of index.keys()) {
    const [c, path3, t] = splitN(k, "|", 2);
    if (t[0] !== "~") continue;
    const sk = `${c}|${path3}`;
    if (!screens.has(sk)) screens.set(sk, { c, path: path3, lits: [] });
    screens.get(sk).lits.push(t.slice(1));
  }
  for (const { c, path: path3, lits } of screens.values())
    for (const lit of lits)
      for (const p of lits) if (p !== lit && lit.startsWith(p)) index.get(`${c}|${path3}|~${lit}`).push(...index.get(`${c}|${path3}|~${p}`));
  const sfields = /* @__PURE__ */ new Map();
  for (const { c, path: path3 } of screens.values()) {
    if (!sfields.has(c)) sfields.set(c, []);
    sfields.get(c).push(path3);
  }
  stats.screened_literals = [...screens.values()].reduce((n, s) => n + s.lits.length, 0);
  const byInt = (m) => [...m].sort((a, b) => a[0] - b[0]);
  const byStr = (m) => [...m].sort((a, b) => pyCmp(a[0], b[0]));
  const rows = opts.countRow ? [["#n", String(rules.length)]] : [];
  rows.push(...byInt(always).map(([c, ids]) => [`${c}|*`, ids.join(" ")]));
  rows.push(...byStr(sfields).map(([c, fs]) => [`${c}|#sfields`, pySorted(fs).join(" ")]));
  rows.push(
    ...[...screens.values()].sort((a, b) => pyCmp(a.c, b.c) || pyCmp(a.path, b.path)).map(({ c, path: path3, lits }) => [`${c}|#screen|${path3}`, trieRegex(pySorted(lits))])
  );
  rows.push(...byInt(fields).map(([c, fs]) => [`${c}|#fields`, pySorted(fs).join(" ")]));
  rows.push(...byStr(index).map(([k, ids]) => [k, [...new Set(ids)].join(" ")]));
  stats.index_keys = index.size;
  stats.max_rules_per_key = Math.max(0, ...[...index.values()].map((v) => v.length));
  return {
    defs: csvText(["rule_id", "pre", "def"], defs.map(([rid, p, d]) => [rid, JSON.stringify(p), JSON.stringify(d)])),
    index: csvText(["key", "rules"], rows),
    stats
  };
}

// ../../packages/core/src/custom-set.ts
var CUSTOM_FILES = {
  defs: "mitre_custom_defs.csv",
  index: "mitre_custom_index.csv",
  catalog: "mitre_custom_catalog.csv",
  rules: "mitre_custom_rules.csv",
  sources: "mitre_custom_sources.csv"
};
var WRITE_ORDER = ["defs", "index", "catalog", "rules", "sources"];
var CATALOG_COLUMNS = ["rule_id", "title", "technique_id", "technique_name", "tactic_id", "tactic_name", "class_uid", "severity", "fidelity", "suppression_sec", "activation", "source_file"];
var CUSTOM_CATALOG_COLUMNS = [...CATALOG_COLUMNS, "attribution", "source_id", "source_url"];
var RULES_COLUMNS = ["rule_id", "source_id", "file", "rule"];
var SOURCES_COLUMNS = ["source_id", "url", "branch", "commit", "synced_at", "synced_by", "mode", "rules", "skipped", "filtered", "content_sha256", "compiler"];
var EMPTY_CUSTOM = {
  defs: csvText(["rule_id", "pre", "def"], []),
  index: csvText(["key", "rules"], []),
  catalog: csvText(CUSTOM_CATALOG_COLUMNS, []),
  rules: csvText(RULES_COLUMNS, []),
  sources: csvText(SOURCES_COLUMNS, [])
};
function ruleJson(r) {
  const out = {};
  for (const [k, v] of Object.entries(r)) if (!k.startsWith("_") && k !== "tests") out[k] = v;
  return JSON.stringify(out);
}
function readStoredRules(rulesCsv, catalogCsv) {
  const urls = new Map(csvRecords(catalogCsv).map((r) => [r.rule_id, r.source_url]));
  return csvRecords(rulesCsv).map((row) => ({
    rule: validateRule(JSON.parse(row.rule), row.file.slice(row.file.lastIndexOf("/") + 1), { requirePrefix: CUSTOM_PREFIX, requireTests: false }),
    sourceId: row.source_id,
    file: row.file,
    url: urls.get(row.rule_id) ?? ""
  }));
}
var readSources = (csv) => csvRecords(csv);
function attribution(s) {
  const o2 = s.rule.origin;
  if (o2?.type === "sigma") return `Sigma rule ${o2.id} by ${o2.author}, ${o2.license || "DRL-1.1"}, ${o2.url}`;
  return o2?.license ? `Rule from ${s.sourceId}, ${o2.license}, ${s.url}` : "";
}
function buildCustomSet(all, base) {
  const sorted = [...all].sort((a, b) => a.rule.id < b.rule.id ? -1 : a.rule.id > b.rule.id ? 1 : 0);
  const engine = build(
    sorted.map((s) => s.rule),
    { countRow: true }
  );
  const prevCat = new Map(csvRecords(base.catalog).map((r) => [r.rule_id, r]));
  const prevRepo = new Map(csvRecords(base.rules).map((r) => [r.rule_id, JSON.parse(r.rule)]));
  const kept = (s, col) => {
    const repo = String(s.rule[col]);
    const cur = prevCat.get(s.rule.id)?.[col];
    const was = prevRepo.get(s.rule.id)?.[col];
    return cur !== void 0 && was !== void 0 && cur !== String(was) ? cur : repo;
  };
  const catalog = csvText(
    CUSTOM_CATALOG_COLUMNS,
    sorted.map((s) => {
      const r = s.rule;
      return [r.id, r.title, r.technique_id, r.technique_name, r.tactic_id, r.tactic_name, r._classes.join(";"), r.severity, r.fidelity, kept(s, "suppression_sec"), kept(s, "activation"), r._file, attribution(s), s.sourceId, s.url];
    })
  );
  const rules = csvText(
    RULES_COLUMNS,
    sorted.map((s) => [s.rule.id, s.sourceId, s.file, ruleJson(s.rule)])
  );
  return { defs: engine.defs, index: engine.index, catalog, rules };
}
async function contentHash(l) {
  const data = new TextEncoder().encode([l.defs, l.index, l.catalog, l.rules].join("\0"));
  const d = new Uint8Array(await crypto.subtle.digest("SHA-256", data));
  return [...d].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function writeSources(rows) {
  return csvText(
    SOURCES_COLUMNS,
    [...rows].sort((a, b) => a.source_id < b.source_id ? -1 : 1).map((r) => SOURCES_COLUMNS.map((c) => r[c] ?? ""))
  );
}

// ../../packages/core/src/generated/engine.js
function runEngineStage(__e, C, STAGE, LAST) {
  var BUDGET = 8e3;
  var MAX_TOKENS = 1500;
  var GRAM2 = 4;
  var IX = C.Lookup("mitre_rule_index.csv", "key");
  var DF = C.Lookup("mitre_rule_defs.csv", "rule_id");
  var CAT = C.Lookup("mitre_rule_catalog.csv", "rule_id");
  var IP = /^[0-9a-f:.]+$/;
  var cls = Number(__e["class_uid"]);
  var it = 0;
  var memo = {};
  var cand = {};
  var tk = {};
  var ids = [];
  var truncated = false;
  var st = __e["__mitre_st"];
  function get(path3, kind) {
    var k2 = kind + path3;
    if (memo.hasOwnProperty(k2)) return memo[k2];
    var parts = path3.split(".");
    var v = __e[parts[0]];
    for (var i = 1; i < parts.length; i++) {
      it++;
      v = (v || {})[parts[i]];
    }
    var r = v;
    if (kind === "s") r = String(v == null ? "" : v).toLowerCase();
    else if (kind === "j") r = (JSON.stringify(v) || "").toLowerCase();
    memo[k2] = r;
    return r;
  }
  function add(list) {
    if (!list) return;
    var a = String(list).split(" ");
    for (var i = 0; i < a.length; i++) {
      it++;
      if (!cand.hasOwnProperty(a[i])) {
        cand[a[i]] = 1;
        ids.push(a[i]);
      }
    }
  }
  function test(cd) {
    var v = get(cd[0], cd[1]);
    var op = cd[2];
    var a = cd[3];
    var i;
    if (op === "in") return a.indexOf(v) >= 0;
    if (op === "rx" || op === "rxall") {
      var all = op === "rxall";
      for (i = 0; i < a.length; i++) {
        it++;
        if (new RegExp(a[i], cd[4] || "").test(v) !== all) return !all;
      }
      return all;
    }
    if (op === "eqall") {
      for (i = 0; i < a.length; i++) {
        it++;
        if (v !== a[i]) return false;
      }
      return true;
    }
    if (op === "num") {
      var n = Number(v);
      return a[0] === ">" ? n > a[1] : a[0] === ">=" ? n >= a[1] : a[0] === "<" ? n < a[1] : n <= a[1];
    }
    if (op === "len") return v.length > a;
    if (op === "ex") return a ? v !== "" : v === "";
    if (op === "pv") return IP.test(v) && (a ? C.Net.isPrivate(v) : !C.Net.isPrivate(v));
    return false;
  }
  function preOk(p) {
    for (var i = 0; i < p.length; i++) {
      var need = p[i][1] === 1;
      var hit2 = need;
      for (var j = 0; j < p[i][2].length; j++) {
        it++;
        if (tk.hasOwnProperty(p[i][0] + "|" + p[i][2][j]) !== need) {
          hit2 = !need;
          break;
        }
      }
      if (!hit2) return false;
    }
    return true;
  }
  function anyTerm(terms) {
    for (var t2 = 0; t2 < terms.length; t2++) {
      var ok = true;
      for (var c2 = 0; c2 < terms[t2].length && ok; c2++) {
        it++;
        ok = test(terms[t2][c2]);
      }
      if (ok) return true;
    }
    return false;
  }
  if (st) {
    ids = st.ids;
    tk = st.tk;
    truncated = st.tr;
  } else {
    add(IX.match(cls + "|*", "rules"));
    var fields = IX.match(cls + "|#fields", "rules");
    if (fields) {
      var fl = String(fields).split(" ");
      for (var f = 0; f < fl.length; f++) {
        it++;
        var s = get(fl[f], "s");
        if (s === "") continue;
        var toks = s.split(/[^a-z0-9]+/);
        if (toks.length > MAX_TOKENS) {
          truncated = true;
          toks = toks.slice(0, MAX_TOKENS);
        }
        var seen = {};
        for (var k = 0; k < toks.length && it < BUDGET; k++) {
          it++;
          var tok = toks[k];
          if (tok === "" || seen.hasOwnProperty(tok)) continue;
          seen[tok] = 1;
          var key = cls + "|" + fl[f] + "|";
          tk[fl[f] + "|" + tok] = 1;
          add(IX.match(key + tok, "rules"));
          if (tok.length >= GRAM2) {
            var pre = "^" + tok.slice(0, GRAM2);
            var suf = "$" + tok.slice(-GRAM2);
            tk[fl[f] + "|" + pre] = 1;
            tk[fl[f] + "|" + suf] = 1;
            add(IX.match(key + pre, "rules"));
            add(IX.match(key + suf, "rules"));
          }
        }
      }
      if (it >= BUDGET) truncated = true;
    }
    var sf = IX.match(cls + "|#sfields", "rules");
    if (sf) {
      var sl = String(sf).split(" ");
      for (var q = 0; q < sl.length; q++) {
        it++;
        var sv = get(sl[q], "s");
        if (sv === "") continue;
        var re = new RegExp("(?=(" + IX.match(cls + "|#screen|" + sl[q], "rules") + "))", "g");
        var hit = {};
        var mt;
        while (it < BUDGET && (mt = re.exec(sv)) !== null) {
          it++;
          re.lastIndex = mt.index + 1;
          if (hit.hasOwnProperty(mt[1])) continue;
          hit[mt[1]] = 1;
          add(IX.match(cls + "|" + sl[q] + "|~" + mt[1], "rules"));
        }
      }
      if (it >= BUDGET) truncated = true;
    }
    st = { ids, tk, tr: truncated, ci: 0, out: [] };
  }
  var out = st.out;
  for (var c = st.ci; c < ids.length && it < BUDGET; c++) {
    it++;
    var pre = DF.match(ids[c], "pre");
    if (!pre) continue;
    pre = JSON.parse(pre);
    if (pre.c.indexOf(cls) < 0) continue;
    var live = false;
    for (var t = 0; t < pre.p.length && !live; t++) live = truncated || preOk(pre.p[t]);
    if (!live) continue;
    var d = JSON.parse(DF.match(ids[c], "def"));
    if (anyTerm(d.t) && !(d.n.length && anyTerm(d.n)) && CAT.match(ids[c], "activation") != "disabled") out.push(d.r + " " + ids[c]);
  }
  __e["__mitre_it"] = Math.max(__e["__mitre_it"] || 0, it);
  if (c < ids.length && STAGE < LAST) {
    st.ci = c;
    __e["__mitre_st"] = st;
  } else {
    __e["__mitre_st"] = null;
    out.sort();
    var m = [];
    for (var o2 = 0; o2 < out.length; o2++) {
      it++;
      m.push(out[o2].slice(out[o2].indexOf(" ") + 1));
    }
    __e["__mitre_it"] = Math.max(__e["__mitre_it"], it);
    __e["__m"] = m;
    if (truncated || c < ids.length) __e["mitre_engine_truncated"] = true;
  }
}

// ../../packages/core/src/test-runner.ts
var BUILTIN_STAGES = 3;
var CUSTOM_STAGES = 2;
var NAMES = { index: "mitre_rule_index.csv", defs: "mitre_rule_defs.csv", catalog: "mitre_rule_catalog.csv" };
function isPrivate(ip) {
  const s = String(ip).toLowerCase();
  const m = s.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (m) {
    const [a, b] = [+m[1], +m[2]];
    return a === 10 || a === 127 || a === 172 && b >= 16 && b <= 31 || a === 192 && b === 168 || a === 169 && b === 254 || a === 100 && b >= 64 && b <= 127;
  }
  return s === "::1" || /^f[cd]/.test(s) || /^fe[89ab]/.test(s);
}
var RuleSet = class {
  tables = /* @__PURE__ */ new Map();
  C;
  stages;
  /**
   * `ignoreActivation`: evaluate disabled rules too. A rule's tests check its logic, so a rule
   * switched off in the app (or shipped off) must still pass them.
   */
  constructor(text, stages, opts = {}) {
    this.stages = stages;
    const key = { [NAMES.index]: "key", [NAMES.defs]: "rule_id", [NAMES.catalog]: "rule_id" };
    const src = { [NAMES.index]: text.index, [NAMES.defs]: text.defs, [NAMES.catalog]: text.catalog };
    for (const [file, csv] of Object.entries(src)) this.tables.set(file, new Map(csvRecords(csv).map((r) => [r[key[file]], r])));
    this.C = {
      Lookup: (file) => {
        const t = this.tables.get(file);
        if (!t) throw new Error(`unknown lookup ${file}`);
        const all = opts.ignoreActivation && file === NAMES.catalog;
        return { match: (v, col) => col === void 0 ? t.has(String(v)) : all && col === "activation" ? "auto" : t.get(String(v))?.[col] };
      },
      Net: { isPrivate }
    };
  }
  /** Rule ids that match `event`, most severe first, and whether evaluation was cut short. */
  run(event) {
    const e = structuredClone(event);
    for (let s = 0; s < this.stages; s++) {
      if (s > 0 && e.__mitre_st == null) break;
      runEngineStage(e, this.C, s, this.stages - 1);
    }
    return { matches: e.__m ?? [], truncated: e.mitre_engine_truncated === true, iterations: Number(e.__mitre_it ?? 0) };
  }
};
function testEvent(rule, ev, n) {
  const e = expand(ev);
  e.class_uid ??= rule._classes[0];
  (e.device ??= {}).hostname ??= `test-host-${String(n).padStart(4, "0")}`;
  return e;
}
function runTests(rules, custom, builtin) {
  const report = { passed: 0, failed: [], overlaps: [], maxIterations: 0 };
  let n = 0;
  for (const r of rules) {
    const seen = /* @__PURE__ */ new Set();
    for (const kind of ["pos", "neg"]) {
      (r.tests[kind] ?? []).forEach((ev, i) => {
        const e = testEvent(r, ev, n++);
        const out = custom.run(e);
        report.maxIterations = Math.max(report.maxIterations, out.iterations);
        const hit = out.matches.includes(r.id);
        const ok = kind === "pos" ? hit && !out.truncated : !hit;
        if (ok) report.passed++;
        else
          report.failed.push({
            ruleId: r.id,
            kind,
            index: i,
            event: ev,
            matches: out.matches,
            reason: kind === "pos" ? out.truncated ? "engine budget exhausted" : "did not match" : "matched a negative test"
          });
        if (kind === "pos" && builtin) for (const b of builtin.run(e).matches) seen.add(b);
      });
    }
    if (seen.size) report.overlaps.push({ ruleId: r.id, builtin: [...seen].sort() });
  }
  return report;
}

// ../../packages/core/src/sync.ts
var COMPILER_VERSION = "core-0.1.0";
var SyncError = class extends Error {
  constructor(message) {
    super(redact(message));
    this.name = "SyncError";
  }
};
var EMPTY_REPORT = { passed: 0, failed: [], overlaps: [], maxIterations: 0 };
function diff(before, after2) {
  const prev = new Map(before.map((s) => [s.rule.id, s]));
  const next = new Map(after2.map((s) => [s.rule.id, s]));
  const added = after2.filter((s) => !prev.has(s.rule.id)).map((s) => ({ id: s.rule.id, title: s.rule.title }));
  const removed = before.filter((s) => !next.has(s.rule.id)).map((s) => ({ id: s.rule.id, title: s.rule.title }));
  const changed = [];
  let unchanged = 0;
  for (const s of after2) {
    const p = prev.get(s.rule.id);
    if (!p) continue;
    const bare = (x) => {
      const j = JSON.parse(ruleJson(x.rule));
      if (j.origin && typeof j.origin === "object") j.origin = { ...j.origin, url: void 0 };
      return j;
    };
    const a = bare(p);
    const b = bare(s);
    const fields = [.../* @__PURE__ */ new Set([...Object.keys(a), ...Object.keys(b)])].filter((k) => JSON.stringify(a[k]) !== JSON.stringify(b[k]));
    if (p.file !== s.file) fields.push("file");
    if (fields.length) changed.push({ id: s.rule.id, title: s.rule.title, fields: fields.sort() });
    else unchanged++;
  }
  return { added, removed, changed, unchanged };
}
async function plan(p) {
  const stored = readStoredRules(p.base.rules, p.base.catalog);
  const before = stored.filter((s) => s.sourceId === p.sourceId);
  const others = stored.filter((s) => s.sourceId !== p.sourceId);
  const after2 = p.mine ?? [];
  const built = buildCustomSet([...others, ...after2], p.base);
  const hash = await contentHash(built);
  const rows = readSources(p.base.sources).filter((r) => r.source_id !== p.sourceId);
  if (p.record) rows.push({ ...p.record, rules: String(after2.length), content_sha256: hash });
  for (const r of rows) r.content_sha256 = hash;
  const next = { ...built, sources: writeSources(rows) };
  const d = diff(before, after2);
  const prevRow = readSources(p.base.sources).find((r) => r.source_id === p.sourceId);
  const sameContent = ["defs", "index", "catalog", "rules"].every((k) => next[k] === p.base[k]);
  const noop = sameContent && (p.record ? prevRow?.commit === p.record.commit && prevRow?.content_sha256 === hash : !prevRow);
  return { sourceId: p.sourceId, url: p.url, branch: p.branch, commit: p.commit, compiled: p.compiled, tests: p.tests, ...d, totalRules: others.length + after2.length, base: p.base, next, blocked: p.blocked, noop };
}
async function preview(input) {
  const builtinIds = input.builtin ? new Set(csvRecords(input.builtin.catalog).map((r) => r.rule_id)) : /* @__PURE__ */ new Set();
  const stored = readStoredRules(input.base.rules, input.base.catalog);
  const sid = parseManifest(input.files.find((f) => f.path === MANIFEST_FILE)?.text).source_id;
  const taken = /* @__PURE__ */ new Set([...builtinIds, ...stored.filter((s) => s.sourceId !== sid).map((s) => s.rule.id)]);
  const compiled = compileSource({ files: input.files, attack: input.attack, repo: input.repo, commit: input.commit, taken });
  const blocked = [];
  if (input.expectSourceId && input.expectSourceId !== sid) blocked.push(`The repo's mitre-detect.yml says source_id ${sid}, but this source is configured as ${input.expectSourceId}.`);
  if (compiled.errors.length) blocked.push(`${compiled.errors.length} rule problem(s) must be fixed in the repo.`);
  const mine = compiled.rules.map((r) => ({ rule: r, sourceId: sid, file: compiled.files.get(r.id).path, url: compiled.files.get(r.id).url }));
  const others = stored.filter((s) => s.sourceId !== sid);
  const set = buildCustomSet([...others, ...mine], input.base);
  const tests = mine.length ? runTests(compiled.rules, new RuleSet(set, CUSTOM_STAGES, { ignoreActivation: true }), input.builtin ? new RuleSet(input.builtin, BUILTIN_STAGES) : void 0) : EMPTY_REPORT;
  if (tests.failed.length) blocked.push(`${tests.failed.length} test event(s) failed.`);
  const record2 = {
    source_id: sid,
    url: input.repo.url,
    branch: input.branch,
    commit: input.commit,
    synced_at: (input.now ?? /* @__PURE__ */ new Date()).toISOString(),
    synced_by: input.actor,
    mode: input.mode,
    skipped: String(compiled.skipped.length),
    filtered: String(compiled.filtered.length),
    compiler: COMPILER_VERSION
  };
  return plan({ base: input.base, sourceId: sid, mine, record: record2, compiled, tests, url: input.repo.url, branch: input.branch, commit: input.commit, blocked });
}
async function previewRemove(sourceId, base) {
  const row = readSources(base.sources).find((r) => r.source_id === sourceId);
  return plan({ base, sourceId, mine: null, record: null, compiled: null, tests: EMPTY_REPORT, url: row?.url ?? "", branch: row?.branch ?? "", commit: row?.commit ?? "", blocked: [] });
}
async function apply(plan2, store2) {
  if (plan2.blocked.length) throw new SyncError(`Not applied: ${plan2.blocked.join(" ")}`);
  if (plan2.noop) return { written: [], noop: true };
  const res = await store2.writeCustom(plan2.next, plan2.base);
  return { written: res.filter((r) => r.changed).map((r) => r.file), noop: false };
}

// ../../packages/core/src/cribl-store.ts
var enc = encodeURIComponent;
var BUILTIN_FILES = { defs: "mitre_rule_defs.csv", index: "mitre_rule_index.csv", catalog: "mitre_rule_catalog.csv" };
var CriblLookupStore = class {
  http;
  group;
  pack;
  constructor(http, group, pack) {
    this.http = http;
    this.group = group;
    this.pack = pack;
  }
  base = () => `/m/${enc(this.group)}/p/${enc(this.pack)}/system/lookups`;
  readText(file) {
    return this.http(`${this.base()}/${enc(file)}/content?raw=1`);
  }
  /** Uploads the CSV (staged as a temp file), then points the lookup at it, keeping its metadata. */
  async writeText(file, csv) {
    const staged = JSON.parse(await this.http(`${this.base()}?filename=${enc(file)}`, { method: "PUT", headers: { "Content-Type": "text/csv" }, body: csv }));
    if (!staged.filename) throw new SyncError(`Upload of ${file} returned no staged file name`);
    const meta = JSON.parse(await this.http(`${this.base()}/${enc(file)}`)).items?.[0] ?? {};
    const body = { id: file, fileInfo: { filename: staged.filename } };
    for (const k of ["description", "tags", "mode"]) if (meta[k]) body[k] = meta[k];
    await this.http(`${this.base()}/${enc(file)}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  }
  async readCustom() {
    const parts = await Promise.all(WRITE_ORDER.map(async (k) => [k, await this.readText(CUSTOM_FILES[k])]));
    return Object.fromEntries(parts);
  }
  async readBuiltin() {
    const [defs, index, catalog] = await Promise.all([this.readText(BUILTIN_FILES.defs), this.readText(BUILTIN_FILES.index), this.readText(BUILTIN_FILES.catalog)]);
    return { defs, index, catalog };
  }
  async writeCustom(next, base) {
    const live = await this.readCustom();
    const moved = WRITE_ORDER.filter((k) => live[k] !== base[k]);
    if (moved.length)
      throw new SyncError(`${moved.map((k) => CUSTOM_FILES[k]).join(", ")} changed on the Leader since the preview. Run the preview again.`);
    const out = [];
    for (const k of WRITE_ORDER) {
      const changed = next[k] !== base[k];
      if (changed) {
        await this.writeText(CUSTOM_FILES[k], next[k]);
        const back = await this.readText(CUSTOM_FILES[k]);
        if (back !== next[k]) throw new SyncError(`${CUSTOM_FILES[k]} reads back different from what was written. Run the sync again.`);
      }
      out.push({ file: CUSTOM_FILES[k], changed });
    }
    return out;
  }
  /** Uncommitted paths in the group's config that belong to the custom lookups. */
  async pendingCustomFiles() {
    const d = JSON.parse(await this.http(`/m/${enc(this.group)}/version/status`));
    const names = Object.values(CUSTOM_FILES).map((f) => f.replace(/\.csv$/, ""));
    return (d.items?.[0]?.files ?? []).map((f) => f.path).filter((p) => p.includes(`/${this.pack}/`) && names.some((n) => p.includes(`/${n}.`)));
  }
  async commit(message, files) {
    const d = JSON.parse(
      await this.http("/version/commit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ group: this.group, message, effective: true, files }) })
    );
    const c = d.items?.[0]?.commit;
    if (!c) throw new SyncError("Commit returned no commit id (nothing to commit?)");
    return c;
  }
  async deploy(version) {
    await this.http(`/master/groups/${enc(this.group)}/deploy`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ version }) });
  }
};

// src/http.ts
var apiBase = (url) => `${url.replace(/\/+$/, "").replace(/\/api\/v1$/, "")}/api/v1`;
async function token(env2, base) {
  if (env2.CRIBL_TOKEN) return env2.CRIBL_TOKEN;
  if (env2.CRIBL_CLIENT_ID && env2.CRIBL_CLIENT_SECRET) {
    const res = await fetch(env2.CRIBL_TOKEN_URL || "https://login.cribl.cloud/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grant_type: "client_credentials", client_id: env2.CRIBL_CLIENT_ID, client_secret: env2.CRIBL_CLIENT_SECRET, audience: env2.CRIBL_AUDIENCE || "https://api.cribl.cloud" })
    });
    if (!res.ok) throw new SyncError(`Cribl token request failed (${res.status})`);
    return (await res.json()).access_token;
  }
  if (env2.CRIBL_USERNAME && env2.CRIBL_PASSWORD) {
    const res = await fetch(`${base}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: env2.CRIBL_USERNAME, password: env2.CRIBL_PASSWORD }) });
    if (!res.ok) throw new SyncError(`Cribl login failed (${res.status})`);
    return (await res.json()).token;
  }
  throw new SyncError("No Cribl credentials: set CRIBL_CLIENT_ID and CRIBL_CLIENT_SECRET (Cribl Cloud), CRIBL_TOKEN, or CRIBL_USERNAME and CRIBL_PASSWORD.");
}
async function criblHttp(env2) {
  if (!env2.CRIBL_API_URL) throw new SyncError("CRIBL_API_URL is not set (e.g. https://main-<workspace>-<org>.cribl.cloud).");
  const base = apiBase(env2.CRIBL_API_URL);
  const auth = `Bearer ${await token(env2, base)}`;
  return async (path3, init = {}) => {
    for (let attempt = 1; ; attempt++) {
      const res = await fetch(`${base}${path3}`, { method: init.method ?? "GET", headers: { Authorization: auth, ...init.headers }, body: init.body });
      const text = await res.text();
      if (res.ok) return text;
      const read = !init.method || init.method === "GET";
      if ((res.status === 429 || res.status >= 500) && attempt < 3 && (read || res.status === 429)) {
        await new Promise((r) => setTimeout(r, 500 * 2 ** attempt));
        continue;
      }
      throw new SyncError(`${init.method ?? "GET"} ${path3} failed (${res.status}): ${text.slice(0, 300)}`);
    }
  };
}

// src/node-reader.ts
import { execFile } from "node:child_process";
import { mkdtemp, readdir, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
var run = promisify(execFile);
var SKIP_DIRS = /* @__PURE__ */ new Set([".git", "node_modules", ".github"]);
var MAX_BYTES = 25e6;
async function walk(root, want) {
  const out = [];
  let total = 0;
  const visit = async (dir) => {
    for (const ent of await readdir(dir, { withFileTypes: true })) {
      const abs = path.join(dir, ent.name);
      const rel = path.relative(root, abs).split(path.sep).join("/");
      if (ent.isDirectory()) {
        if (!SKIP_DIRS.has(ent.name)) await visit(abs);
      } else if (ent.isFile() && want(rel)) {
        total += (await stat(abs)).size;
        if (total > MAX_BYTES) throw new SyncError(`Rule files exceed ${MAX_BYTES} bytes; narrow include in mitre-detect.yml`);
        out.push({ path: rel, text: await readFile(abs, "utf8") });
      }
    }
  };
  await visit(root);
  return out;
}
async function gitHead(dir) {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA;
  if (process.env.CI_COMMIT_SHA) return process.env.CI_COMMIT_SHA;
  if (process.env.BITBUCKET_COMMIT) return process.env.BITBUCKET_COMMIT;
  try {
    return (await run("git", ["-C", dir, "rev-parse", "HEAD"])).stdout.trim();
  } catch {
    return "working-tree";
  }
}
var LocalDirReader = class {
  constructor(dir) {
    this.dir = dir;
  }
  dir;
  head = () => gitHead(this.dir);
  async read(_repo, _branch, want) {
    return { commit: await gitHead(this.dir), files: await walk(this.dir, (p) => p === "mitre-detect.yml" || want(p)) };
  }
};
var GitCloneReader = class {
  constructor(credential) {
    this.credential = credential;
  }
  credential;
  env() {
    if (!this.credential) return process.env;
    return { ...process.env, GIT_TERMINAL_PROMPT: "0", GIT_CONFIG_COUNT: "1", GIT_CONFIG_KEY_0: "http.extraHeader", GIT_CONFIG_VALUE_0: `Authorization: ${basicAuth(this.credential)}` };
  }
  async git(args) {
    try {
      return (await run("git", args, { env: this.env(), maxBuffer: 16 * 1024 * 1024 })).stdout;
    } catch (e) {
      throw new SyncError(`git ${args[0]} failed: ${e.stderr?.trim() || e.message}`);
    }
  }
  async head(repo, branch2) {
    const out = await this.git(["ls-remote", "--heads", repo.url, `refs/heads/${branch2}`]);
    const sha = out.split(/\s/)[0];
    if (!sha) throw new SyncError(`Branch ${branch2} not found in ${repo.url}`);
    return sha;
  }
  async read(repo, branch2, want) {
    const dir = await mkdtemp(path.join(tmpdir(), "mitre-detect-"));
    try {
      await this.git(["clone", "--quiet", "--depth", "1", "--single-branch", "--branch", branch2, repo.url, dir]);
      return { commit: (await this.git(["-C", dir, "rev-parse", "HEAD"])).trim(), files: await walk(dir, (p) => p === "mitre-detect.yml" || want(p)) };
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  }
};

// src/cli.ts
var VERSION = "1.0.0";
var EXIT = { ok: 0, blocked: 1, conflict: 2, error: 3 };
var HELP = `mitre-detect-sync ${VERSION}

Usage:
  mitre-detect-sync check   --repo <dir> [--builtin <lookups-dir>]
  mitre-detect-sync preview (--repo <dir> | --url <clone-url>) [--branch <b>] --group <g>
  mitre-detect-sync apply   (--repo <dir> | --url <clone-url>) [--branch <b>] --group <g> [--deploy]
  mitre-detect-sync remove  --source <source_id> --group <g> [--deploy]

check never contacts Cribl. preview reads the Leader, apply writes the pack's custom lookups
and, with --deploy, commits them and deploys the group.

Options:
  --repo <dir>        a checkout of the detection repo (CI: --repo .)
  --url <url>         clone URL, https://<user>:<token>@host/owner/repo.git (or MITRE_DETECT_REPO_URL)
  --branch <b>        default: $GITHUB_REF_NAME, $CI_COMMIT_BRANCH, $BITBUCKET_BRANCH or main
  --group <g>         worker group (or CRIBL_GROUP)
  --pack <id>         default cribl-mitre-atomic-detections
  --builtin <dir>     folder with mitre_rule_{defs,index,catalog}.csv, for overlap reports in check
  --deploy            commit the custom lookups and deploy the group after apply/remove
  --message <m>       commit message
  --json              print a JSON summary instead of text
  -h, --help

Cribl credentials (preview/apply/remove): CRIBL_API_URL and either CRIBL_CLIENT_ID +
CRIBL_CLIENT_SECRET (Cribl Cloud), CRIBL_TOKEN, or CRIBL_USERNAME + CRIBL_PASSWORD.

Exit codes: 0 ok, 1 invalid rules or failed tests, 2 the Leader changed during the sync, 3 other errors.`;
var { values: o, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    repo: { type: "string" },
    url: { type: "string" },
    branch: { type: "string" },
    group: { type: "string" },
    pack: { type: "string", default: "cribl-mitre-atomic-detections" },
    source: { type: "string" },
    builtin: { type: "string" },
    deploy: { type: "boolean", default: false },
    message: { type: "string" },
    json: { type: "boolean", default: false },
    help: { type: "boolean", short: "h", default: false }
  }
});
var env = process.env;
var cmd = positionals[0];
var attack = indexAttack(attack_enterprise_default);
function repoUrl() {
  const given = o.url ?? env.MITRE_DETECT_REPO_URL;
  if (given) return parseRepoUrl(given);
  const derived = env.GITHUB_REPOSITORY ? `${env.GITHUB_SERVER_URL ?? "https://github.com"}/${env.GITHUB_REPOSITORY}` : env.CI_PROJECT_URL ?? env.BITBUCKET_GIT_HTTP_ORIGIN?.replace(/^http:/, "https:");
  return parseRepoUrl(derived ?? `https://local.invalid/${path2.basename(path2.resolve(o.repo ?? "."))}/repo`);
}
var branch = () => o.branch ?? env.GITHUB_REF_NAME ?? env.CI_COMMIT_BRANCH ?? env.BITBUCKET_BRANCH ?? "main";
function reader(credential) {
  if (o.repo) return new LocalDirReader(path2.resolve(o.repo));
  if (o.url ?? env.MITRE_DETECT_REPO_URL) return new GitCloneReader(credential);
  throw new SyncError("Give --repo <dir> or --url <clone-url>.");
}
async function store() {
  const group = o.group ?? env.CRIBL_GROUP;
  if (!group) throw new SyncError("Give --group <worker group> (or set CRIBL_GROUP).");
  return new CriblLookupStore(await criblHttp(env), group, o.pack);
}
async function localBuiltin(dir) {
  const f = (n) => readFile2(path2.join(dir, n), "utf8");
  return { defs: await f("mitre_rule_defs.csv"), index: await f("mitre_rule_index.csv"), catalog: await f("mitre_rule_catalog.csv") };
}
function summary(p) {
  return {
    source_id: p.sourceId,
    url: p.url,
    branch: p.branch,
    commit: p.commit,
    rules: p.compiled?.rules.length ?? 0,
    added: p.added.map((r) => r.id),
    changed: p.changed.map((r) => ({ id: r.id, fields: r.fields })),
    removed: p.removed.map((r) => r.id),
    unchanged: p.unchanged,
    skipped: p.compiled?.skipped ?? [],
    filtered: p.compiled?.filtered.length ?? 0,
    errors: p.compiled?.errors ?? [],
    tests: { passed: p.tests.passed, failed: p.tests.failed.map((f) => ({ rule: f.ruleId, kind: f.kind, index: f.index, reason: f.reason, matches: f.matches })) },
    overlaps: p.tests.overlaps,
    blocked: p.blocked,
    noop: p.noop
  };
}
function print(p, extra = {}) {
  if (o.json) return console.log(JSON.stringify({ ...summary(p), ...extra }, null, 2));
  const s = summary(p);
  console.log(`${s.source_id}: ${s.url} @ ${s.branch} (${s.commit.slice(0, 12)})`);
  console.log(`  ${s.rules} rules \xB7 +${s.added.length} added \xB7 ~${s.changed.length} changed \xB7 -${s.removed.length} removed \xB7 ${s.unchanged} unchanged`);
  console.log(`  tests ${s.tests.passed} passed, ${s.tests.failed.length} failed \xB7 ${s.skipped.length} skipped \xB7 ${s.filtered} filtered`);
  for (const e of s.errors) console.log(`  ERROR ${e.path ?? ""} ${e.message}`);
  for (const f of p.tests.failed) console.log(`  FAIL  ${f.ruleId} ${f.kind}#${f.index}: ${f.reason}${f.matches.length ? ` (matched ${f.matches.join(", ")})` : ""}`);
  for (const k of s.skipped) console.log(`  skip  ${k.path ?? ""}: ${k.message}`);
  for (const v of s.overlaps) console.log(`  overlap ${v.ruleId} also matches built-in ${v.builtin.join(", ")}`);
  for (const [k, v] of Object.entries(extra)) console.log(`  ${k}: ${Array.isArray(v) ? v.join(", ") || "-" : v}`);
  if (s.blocked.length) console.log(`  BLOCKED: ${s.blocked.join(" ")}`);
  else if (s.noop) console.log("  up to date: nothing to write");
}
async function deployIfAsked(st, p) {
  if (!o.deploy) return {};
  const files = await st.pendingCustomFiles();
  if (!files.length) return { deployed: "nothing to commit" };
  const id = await st.commit(o.message ?? `mitre-detect-sync: ${p.sourceId} @ ${p.commit.slice(0, 12)}`, files);
  await st.deploy(id);
  return { committed: id, deployed: st.group };
}
async function main() {
  if (o.help || !cmd) {
    console.log(HELP);
    return o.help ? EXIT.ok : EXIT.error;
  }
  if (cmd === "remove") {
    if (!o.source) throw new SyncError("Give --source <source_id>.");
    const st2 = await store();
    const p2 = await previewRemove(o.source, await st2.readCustom());
    const r2 = await apply(p2, st2);
    print(p2, { written: r2.written, ...r2.noop ? {} : await deployIfAsked(st2, p2) });
    return EXIT.ok;
  }
  if (!["check", "preview", "apply"].includes(cmd)) throw new SyncError(`Unknown command ${cmd}. See --help.`);
  const { repo, credential } = repoUrl();
  const rd = reader(credential);
  const { commit, files } = await rd.read(repo, branch(), (p2) => /\.ya?ml$/i.test(p2));
  const st = cmd === "check" ? null : await store();
  const base = st ? await st.readCustom() : EMPTY_CUSTOM;
  const builtin = st ? await st.readBuiltin().catch(() => null) : o.builtin ? await localBuiltin(o.builtin) : null;
  const p = await preview({ repo, branch: branch(), files, commit, attack, base, builtin, actor: "mitre-detect-sync", mode: "ci" });
  if (cmd !== "apply" || p.blocked.length) {
    print(p);
    return p.blocked.length ? EXIT.blocked : EXIT.ok;
  }
  const r = await apply(p, st);
  print(p, { written: r.written, ...r.noop ? {} : await deployIfAsked(st, p) });
  return EXIT.ok;
}
main().then(
  (code) => process.exit(code),
  (e) => {
    const msg = redact(e instanceof Error ? e.message : String(e));
    if (o.json) console.log(JSON.stringify({ error: msg }));
    else console.error(`error: ${msg}`);
    const known = e instanceof ManifestError || e instanceof RuleError || e instanceof RepoUrlError;
    process.exit(known ? EXIT.blocked : /changed on the Leader/.test(msg) ? EXIT.conflict : EXIT.error);
  }
);
