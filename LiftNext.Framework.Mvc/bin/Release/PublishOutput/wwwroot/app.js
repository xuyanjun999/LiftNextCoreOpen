var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.defineProperty = typeof Object.defineProperties == 'function' ? Object.defineProperty : function(target, property, descriptor) {
    descriptor = (descriptor);
    if (target == Array.prototype || target == Object.prototype) {
        return;
    }
    target[property] = descriptor.value;
};
$jscomp.getGlobal = function(maybeGlobal) {
    return typeof window != 'undefined' && window === maybeGlobal ? maybeGlobal : typeof global != 'undefined' && global != null ? global : maybeGlobal;
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.polyfill = function(target, polyfill, fromLang, toLang) {
    if (!polyfill) {
        return;
    }
    var obj = $jscomp.global;
    var split = target.split('.');
    for (var i = 0; i < split.length - 1; i++) {
        var key = split[i];
        if (!(key in obj)) {
            obj[key] = {};
        }
        obj = obj[key];
    }
    var property = split[split.length - 1];
    var orig = obj[property];
    var impl = polyfill(orig);
    if (impl == orig || impl == null) {
        return;
    }
    $jscomp.defineProperty(obj, property, { configurable: true, writable: true, value: impl });
};
$jscomp.polyfill('Array.prototype.copyWithin', function(orig) {
    if (orig) {
        return orig;
    }
    var polyfill = function(target, start, opt_end) {
        var len = this.length;
        target = Number(target);
        start = Number(start);
        opt_end = Number(opt_end != null ? opt_end : len);
        if (target < start) {
            opt_end = Math.min(opt_end, len);
            while (start < opt_end) {
                if (start in this) {
                    this[target++] = this[start++];
                } else {
                    delete this[target++];
                    start++;
                }
            }
        } else {
            opt_end = Math.min(opt_end, len + start - target);
            target += opt_end - start;
            while (opt_end > start) {
                if (--opt_end in this) {
                    this[--target] = this[opt_end];
                } else {
                    delete this[target];
                }
            }
        }
        return this;
    };
    return polyfill;
}, 'es6-impl', 'es3');
$jscomp.SYMBOL_PREFIX = 'jscomp_symbol_';
$jscomp.initSymbol = function() {
    $jscomp.initSymbol = function() {};
    if (!$jscomp.global['Symbol']) {
        $jscomp.global['Symbol'] = $jscomp.Symbol;
    }
};
$jscomp.symbolCounter_ = 0;
$jscomp.Symbol = function(opt_description) {
    return ($jscomp.SYMBOL_PREFIX + (opt_description || '') + $jscomp.symbolCounter_++);
};
$jscomp.initSymbolIterator = function() {
    $jscomp.initSymbol();
    var symbolIterator = $jscomp.global['Symbol'].iterator;
    if (!symbolIterator) {
        symbolIterator = $jscomp.global['Symbol'].iterator = $jscomp.global['Symbol']('iterator');
    }
    if (typeof Array.prototype[symbolIterator] != 'function') {
        $jscomp.defineProperty(Array.prototype, symbolIterator, {
            configurable: true,
            writable: true,
            value: function() {
                return $jscomp.arrayIterator(this);
            }
        });
    }
    $jscomp.initSymbolIterator = function() {};
};
$jscomp.arrayIterator = function(array) {
    var index = 0;
    return $jscomp.iteratorPrototype(function() {
        if (index < array.length) {
            return { done: false, value: array[index++] };
        } else {
            return { done: true };
        }
    });
};
$jscomp.iteratorPrototype = function(next) {
    $jscomp.initSymbolIterator();
    var iterator = { next: next };
    iterator[$jscomp.global['Symbol'].iterator] = function() {
        return this;
    };
    return (iterator);
};
$jscomp.iteratorFromArray = function(array, transform) {
    $jscomp.initSymbolIterator();
    if (array instanceof String) {
        array = array + '';
    }
    var i = 0;
    var iter = {
        next: function() {
            if (i < array.length) {
                var index = i++;
                return { value: transform(index, array[index]), done: false };
            }
            iter.next = function() {
                return { done: true, value: void 0 };
            };
            return iter.next();
        }
    };
    iter[Symbol.iterator] = function() {
        return iter;
    };
    return iter;
};
$jscomp.polyfill('Array.prototype.entries', function(orig) {
    if (orig) {
        return orig;
    }
    var polyfill = function() {
        return $jscomp.iteratorFromArray(this, function(i, v) {
            return [i, v];
        });
    };
    return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Array.prototype.fill', function(orig) {
    if (orig) {
        return orig;
    }
    var polyfill = function(value, opt_start, opt_end) {
        var length = this.length || 0;
        if (opt_start < 0) {
            opt_start = Math.max(0, length + (opt_start));
        }
        if (opt_end == null || opt_end > length) {
            opt_end = length;
        }
        opt_end = Number(opt_end);
        if (opt_end < 0) {
            opt_end = Math.max(0, length + opt_end);
        }
        for (var i = Number(opt_start || 0); i < opt_end; i++) {
            this[i] = value;
        }
        return this;
    };
    return polyfill;
}, 'es6-impl', 'es3');
$jscomp.findInternal = function(array, callback, thisArg) {
    if (array instanceof String) {
        array = (String(array));
    }
    var len = array.length;
    for (var i = 0; i < len; i++) {
        var value = array[i];
        if (callback.call(thisArg, value, i, array)) {
            return { i: i, v: value };
        }
    }
    return { i: -1, v: void 0 };
};
$jscomp.polyfill('Array.prototype.find', function(orig) {
    if (orig) {
        return orig;
    }
    var polyfill = function(callback, opt_thisArg) {
        return $jscomp.findInternal(this, callback, opt_thisArg).v;
    };
    return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Array.prototype.findIndex', function(orig) {
    if (orig) {
        return orig;
    }
    var polyfill = function(callback, opt_thisArg) {
        return $jscomp.findInternal(this, callback, opt_thisArg).i;
    };
    return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Array.from', function(orig) {
    if (orig) {
        return orig;
    }
    var polyfill = function(arrayLike, opt_mapFn, opt_thisArg) {
        $jscomp.initSymbolIterator();
        opt_mapFn = opt_mapFn != null ? opt_mapFn : function(x) {
            return x;
        };
        var result = [];
        var iteratorFunction = (arrayLike)[Symbol.iterator];
        if (typeof iteratorFunction == 'function') {
            arrayLike = iteratorFunction.call(arrayLike);
            var next;
            while (!(next = arrayLike.next()).done) {
                result.push(opt_mapFn.call((opt_thisArg), next.value));
            }
        } else {
            var len = arrayLike.length;
            for (var i = 0; i < len; i++) {
                result.push(opt_mapFn.call((opt_thisArg), arrayLike[i]));
            }
        }
        return result;
    };
    return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Object.is', function(orig) {
    if (orig) {
        return orig;
    }
    var polyfill = function(left, right) {
        if (left === right) {
            return left !== 0 || 1 / left === 1 / (right);
        } else {
            return left !== left && right !== right;
        }
    };
    return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Array.prototype.includes', function(orig) {
    if (orig) {
        return orig;
    }
    var includes = function(searchElement, opt_fromIndex) {
        var array = this;
        if (array instanceof String) {
            array = (String(array));
        }
        var len = array.length;
        for (var i = opt_fromIndex || 0; i < len; i++) {
            if (array[i] == searchElement || Object.is(array[i], searchElement)) {
                return true;
            }
        }
        return false;
    };
    return includes;
}, 'es7', 'es3');
$jscomp.polyfill('Array.prototype.keys', function(orig) {
    if (orig) {
        return orig;
    }
    var polyfill = function() {
        return $jscomp.iteratorFromArray(this, function(i) {
            return i;
        });
    };
    return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Array.of', function(orig) {
    if (orig) {
        return orig;
    }
    var polyfill = function(var_args) {
        return Array.from(arguments);
    };
    return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Array.prototype.values', function(orig) {
    if (orig) {
        return orig;
    }
    var polyfill = function() {
        return $jscomp.iteratorFromArray(this, function(k, v) {
            return v;
        });
    };
    return polyfill;
}, 'es6', 'es3');
$jscomp.makeIterator = function(iterable) {
    $jscomp.initSymbolIterator();
    var iteratorFunction = (iterable)[Symbol.iterator];
    return iteratorFunction ? iteratorFunction.call(iterable) : $jscomp.arrayIterator((iterable));
};
$jscomp.EXPOSE_ASYNC_EXECUTOR = true;
$jscomp.FORCE_POLYFILL_PROMISE = false;
$jscomp.polyfill('Promise', function(NativePromise) {
    if (NativePromise && !$jscomp.FORCE_POLYFILL_PROMISE) {
        return NativePromise;
    }

    function AsyncExecutor() {
        this.batch_ = null;
    }
    AsyncExecutor.prototype.asyncExecute = function(f) {
        if (this.batch_ == null) {
            this.batch_ = [];
            this.asyncExecuteBatch_();
        }
        this.batch_.push(f);
        return this;
    };
    AsyncExecutor.prototype.asyncExecuteBatch_ = function() {
        var self = this;
        this.asyncExecuteFunction(function() {
            self.executeBatch_();
        });
    };
    var nativeSetTimeout = $jscomp.global['setTimeout'];
    AsyncExecutor.prototype.asyncExecuteFunction = function(f) {
        nativeSetTimeout(f, 0);
    };
    AsyncExecutor.prototype.executeBatch_ = function() {
        while (this.batch_ && this.batch_.length) {
            var executingBatch = this.batch_;
            this.batch_ = [];
            for (var i = 0; i < executingBatch.length; ++i) {
                var f = executingBatch[i];
                delete executingBatch[i];
                try {
                    f();
                } catch (error) {
                    this.asyncThrow_(error);
                }
            }
        }
        this.batch_ = null;
    };
    AsyncExecutor.prototype.asyncThrow_ = function(exception) {
        this.asyncExecuteFunction(function() {
            throw exception;
        });
    };
    var PromiseState = { PENDING: 0, FULFILLED: 1, REJECTED: 2 };
    var PolyfillPromise = function(executor) {
        this.state_ = PromiseState.PENDING;
        this.result_ = undefined;
        this.onSettledCallbacks_ = [];
        var resolveAndReject = this.createResolveAndReject_();
        try {
            executor(resolveAndReject.resolve, resolveAndReject.reject);
        } catch (e) {
            resolveAndReject.reject(e);
        }
    };
    PolyfillPromise.prototype.createResolveAndReject_ = function() {
        var thisPromise = this;
        var alreadyCalled = false;

        function firstCallWins(method) {
            return function(x) {
                if (!alreadyCalled) {
                    alreadyCalled = true;
                    method.call(thisPromise, x);
                }
            };
        }
        return { resolve: firstCallWins(this.resolveTo_), reject: firstCallWins(this.reject_) };
    };
    PolyfillPromise.prototype.resolveTo_ = function(value) {
        if (value === this) {
            this.reject_(new TypeError('A Promise cannot resolve to itself'));
        } else {
            if (value instanceof PolyfillPromise) {
                this.settleSameAsPromise_((value));
            } else {
                if (isObject(value)) {
                    this.resolveToNonPromiseObj_((value));
                } else {
                    this.fulfill_(value);
                }
            }
        }
    };
    PolyfillPromise.prototype.resolveToNonPromiseObj_ = function(obj) {
        var thenMethod = undefined;
        try {
            thenMethod = obj.then;
        } catch (error) {
            this.reject_(error);
            return;
        }
        if (typeof thenMethod == 'function') {
            this.settleSameAsThenable_(thenMethod, (obj));
        } else {
            this.fulfill_(obj);
        }
    };

    function isObject(value) {
        switch (typeof value) {
            case 'object':
                return value != null;
            case 'function':
                return true;
            default:
                return false;
        }
    }
    PolyfillPromise.prototype.reject_ = function(reason) {
        this.settle_(PromiseState.REJECTED, reason);
    };
    PolyfillPromise.prototype.fulfill_ = function(value) {
        this.settle_(PromiseState.FULFILLED, value);
    };
    PolyfillPromise.prototype.settle_ = function(settledState, valueOrReason) {
        if (this.state_ != PromiseState.PENDING) {
            throw new Error('Cannot settle(' + settledState + ', ' + valueOrReason | '): Promise already settled in state' + this.state_);
        }
        this.state_ = settledState;
        this.result_ = valueOrReason;
        this.executeOnSettledCallbacks_();
    };
    PolyfillPromise.prototype.executeOnSettledCallbacks_ = function() {
        if (this.onSettledCallbacks_ != null) {
            var callbacks = this.onSettledCallbacks_;
            for (var i = 0; i < callbacks.length; ++i) {
                (callbacks[i]).call();
                callbacks[i] = null;
            }
            this.onSettledCallbacks_ = null;
        }
    };
    var asyncExecutor = new AsyncExecutor;
    PolyfillPromise.prototype.settleSameAsPromise_ = function(promise) {
        var methods = this.createResolveAndReject_();
        promise.callWhenSettled_(methods.resolve, methods.reject);
    };
    PolyfillPromise.prototype.settleSameAsThenable_ = function(thenMethod, thenable) {
        var methods = this.createResolveAndReject_();
        try {
            thenMethod.call(thenable, methods.resolve, methods.reject);
        } catch (error) {
            methods.reject(error);
        }
    };
    PolyfillPromise.prototype.then = function(onFulfilled, onRejected) {
        var resolveChild;
        var rejectChild;
        var childPromise = new PolyfillPromise(function(resolve, reject) {
            resolveChild = resolve;
            rejectChild = reject;
        });

        function createCallback(paramF, defaultF) {
            if (typeof paramF == 'function') {
                return function(x) {
                    try {
                        resolveChild(paramF(x));
                    } catch (error) {
                        rejectChild(error);
                    }
                };
            } else {
                return defaultF;
            }
        }
        this.callWhenSettled_(createCallback(onFulfilled, resolveChild), createCallback(onRejected, rejectChild));
        return childPromise;
    };
    PolyfillPromise.prototype['catch'] = function(onRejected) {
        return this.then(undefined, onRejected);
    };
    PolyfillPromise.prototype.callWhenSettled_ = function(onFulfilled, onRejected) {
        var thisPromise = this;

        function callback() {
            switch (thisPromise.state_) {
                case PromiseState.FULFILLED:
                    onFulfilled(thisPromise.result_);
                    break;
                case PromiseState.REJECTED:
                    onRejected(thisPromise.result_);
                    break;
                default:
                    throw new Error('Unexpected state: ' + thisPromise.state_);
            }
        }
        if (this.onSettledCallbacks_ == null) {
            asyncExecutor.asyncExecute(callback);
        } else {
            this.onSettledCallbacks_.push(function() {
                asyncExecutor.asyncExecute(callback);
            });
        }
    };
    PolyfillPromise.resolve = function(opt_value) {
        if (opt_value instanceof PolyfillPromise) {
            return opt_value;
        } else {
            return new PolyfillPromise(function(resolve, reject) {
                resolve(opt_value);
            });
        }
    };
    PolyfillPromise.reject = function(opt_reason) {
        return new PolyfillPromise(function(resolve, reject) {
            reject(opt_reason);
        });
    };
    PolyfillPromise.race = function(thenablesOrValues) {
        return new PolyfillPromise(function(resolve, reject) {
            var iterator = $jscomp.makeIterator(thenablesOrValues);
            for (var iterRec = iterator.next(); !iterRec.done; iterRec = iterator.next()) {
                PolyfillPromise.resolve(iterRec.value).callWhenSettled_(resolve, reject);
            }
        });
    };
    PolyfillPromise.all = function(thenablesOrValues) {
        var iterator = $jscomp.makeIterator(thenablesOrValues);
        var iterRec = iterator.next();
        if (iterRec.done) {
            return PolyfillPromise.resolve([]);
        } else {
            return new PolyfillPromise(function(resolveAll, rejectAll) {
                var resultsArray = [];
                var unresolvedCount = 0;

                function onFulfilled(i) {
                    return function(ithResult) {
                        resultsArray[i] = ithResult;
                        unresolvedCount--;
                        if (unresolvedCount == 0) {
                            resolveAll(resultsArray);
                        }
                    };
                }
                do {
                    resultsArray.push(undefined);
                    unresolvedCount++;
                    PolyfillPromise.resolve(iterRec.value).callWhenSettled_(onFulfilled(resultsArray.length - 1), rejectAll);
                    iterRec = iterator.next();
                } while (!iterRec.done);
            });
        }
    };
    if ($jscomp.EXPOSE_ASYNC_EXECUTOR) {
        PolyfillPromise['$jscomp$new$AsyncExecutor'] = function() {
            return new AsyncExecutor;
        };
    }
    return PolyfillPromise;
}, 'es6-impl', 'es3');
$jscomp.executeAsyncGenerator = function(generator) {
    function passValueToGenerator(value) {
        return generator.next(value);
    }

    function passErrorToGenerator(error) {
        return generator['throw'](error);
    }
    return new Promise(function(resolve, reject) {
        function handleGeneratorRecord(genRec) {
            if (genRec.done) {
                resolve(genRec.value);
            } else {
                Promise.resolve(genRec.value).then(passValueToGenerator, passErrorToGenerator).then(handleGeneratorRecord, reject);
            }
        }
        handleGeneratorRecord(generator.next());
    });
};
$jscomp.owns = function(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
};
$jscomp.polyfill('WeakMap', function(NativeWeakMap) {
    function isConformant() {
        if (!NativeWeakMap || !Object.seal) {
            return false;
        }
        try {
            var x = Object.seal({});
            var y = Object.seal({});
            var map = new(NativeWeakMap)([
                [x, 2],
                [y, 3]
            ]);
            if (map.get(x) != 2 || map.get(y) != 3) {
                return false;
            }
            map['delete'](x);
            map.set(y, 4);
            return !map.has(x) && map.get(y) == 4;
        } catch (err) {
            return false;
        }
    }
    if (isConformant()) {
        return NativeWeakMap;
    }
    var prop = '$jscomp_hidden_' + Math.random().toString().substring(2);

    function insert(target) {
        if (!$jscomp.owns(target, prop)) {
            var obj = {};
            $jscomp.defineProperty(target, prop, { value: obj });
        }
    }

    function patch(name) {
        var prev = Object[name];
        if (prev) {
            Object[name] = function(target) {
                insert(target);
                return prev(target);
            };
        }
    }
    patch('freeze');
    patch('preventExtensions');
    patch('seal');
    var index = 0;
    var PolyfillWeakMap = function(opt_iterable) {
        this.id_ = (index += Math.random() + 1).toString();
        if (opt_iterable) {
            $jscomp.initSymbol();
            $jscomp.initSymbolIterator();
            var iter = $jscomp.makeIterator(opt_iterable);
            var entry;
            while (!(entry = iter.next()).done) {
                var item = entry.value;
                this.set((item[0]), (item[1]));
            }
        }
    };
    PolyfillWeakMap.prototype.set = function(key, value) {
        insert(key);
        if (!$jscomp.owns(key, prop)) {
            throw new Error('WeakMap key fail: ' + key);
        }
        key[prop][this.id_] = value;
        return this;
    };
    PolyfillWeakMap.prototype.get = function(key) {
        return $jscomp.owns(key, prop) ? key[prop][this.id_] : undefined;
    };
    PolyfillWeakMap.prototype.has = function(key) {
        return $jscomp.owns(key, prop) && $jscomp.owns(key[prop], this.id_);
    };
    PolyfillWeakMap.prototype['delete'] = function(key) {
        if (!$jscomp.owns(key, prop) || !$jscomp.owns(key[prop], this.id_)) {
            return false;
        }
        return delete key[prop][this.id_];
    };
    return PolyfillWeakMap;
}, 'es6-impl', 'es3');
$jscomp.MapEntry = function() {
    this.previous;
    this.next;
    this.head;
    this.key;
    this.value;
};
$jscomp.ASSUME_NO_NATIVE_MAP = false;
$jscomp.polyfill('Map', function(NativeMap) {
    var isConformant = !$jscomp.ASSUME_NO_NATIVE_MAP && function() {
        if (!NativeMap || !NativeMap.prototype.entries || typeof Object.seal != 'function') {
            return false;
        }
        try {
            NativeMap = (NativeMap);
            var key = Object.seal({ x: 4 });
            var map = new NativeMap($jscomp.makeIterator([
                [key, 's']
            ]));
            if (map.get(key) != 's' || map.size != 1 || map.get({ x: 4 }) || map.set({ x: 4 }, 't') != map || map.size != 2) {
                return false;
            }
            var iter = map.entries();
            var item = iter.next();
            if (item.done || item.value[0] != key || item.value[1] != 's') {
                return false;
            }
            item = iter.next();
            if (item.done || item.value[0].x != 4 || item.value[1] != 't' || !iter.next().done) {
                return false;
            }
            return true;
        } catch (err) {
            return false;
        }
    }();
    if (isConformant) {
        return NativeMap;
    }
    $jscomp.initSymbol();
    $jscomp.initSymbolIterator();
    var idMap = new WeakMap;
    var PolyfillMap = function(opt_iterable) {
        this.data_ = {};
        this.head_ = createHead();
        this.size = 0;
        if (opt_iterable) {
            var iter = $jscomp.makeIterator(opt_iterable);
            var entry;
            while (!(entry = iter.next()).done) {
                var item = (entry).value;
                this.set((item[0]), (item[1]));
            }
        }
    };
    PolyfillMap.prototype.set = function(key, value) {
        var r = maybeGetEntry(this, key);
        if (!r.list) {
            r.list = this.data_[r.id] = [];
        }
        if (!r.entry) {
            r.entry = { next: this.head_, previous: this.head_.previous, head: this.head_, key: key, value: value };
            r.list.push(r.entry);
            this.head_.previous.next = r.entry;
            this.head_.previous = r.entry;
            this.size++;
        } else {
            r.entry.value = value;
        }
        return this;
    };
    PolyfillMap.prototype['delete'] = function(key) {
        var r = maybeGetEntry(this, key);
        if (r.entry && r.list) {
            r.list.splice(r.index, 1);
            if (!r.list.length) {
                delete this.data_[r.id];
            }
            r.entry.previous.next = r.entry.next;
            r.entry.next.previous = r.entry.previous;
            r.entry.head = null;
            this.size--;
            return true;
        }
        return false;
    };
    PolyfillMap.prototype.clear = function() {
        this.data_ = {};
        this.head_ = this.head_.previous = createHead();
        this.size = 0;
    };
    PolyfillMap.prototype.has = function(key) {
        return !!maybeGetEntry(this, key).entry;
    };
    PolyfillMap.prototype.get = function(key) {
        var entry = maybeGetEntry(this, key).entry;
        return (entry && (entry.value));
    };
    PolyfillMap.prototype.entries = function() {
        return makeIterator(this, function(entry) {
            return [entry.key, entry.value];
        });
    };
    PolyfillMap.prototype.keys = function() {
        return makeIterator(this, function(entry) {
            return entry.key;
        });
    };
    PolyfillMap.prototype.values = function() {
        return makeIterator(this, function(entry) {
            return entry.value;
        });
    };
    PolyfillMap.prototype.forEach = function(callback, opt_thisArg) {
        var iter = this.entries();
        var item;
        while (!(item = iter.next()).done) {
            var entry = item.value;
            callback.call((opt_thisArg), (entry[1]), (entry[0]), this);
        }
    };
    (PolyfillMap.prototype)[Symbol.iterator] = PolyfillMap.prototype.entries;
    var maybeGetEntry = function(map, key) {
        var id = getId(key);
        var list = map.data_[id];
        if (list && $jscomp.owns(map.data_, id)) {
            for (var index = 0; index < list.length; index++) {
                var entry = list[index];
                if (key !== key && entry.key !== entry.key || key === entry.key) {
                    return { id: id, list: list, index: index, entry: entry };
                }
            }
        }
        return { id: id, list: list, index: -1, entry: undefined };
    };
    var makeIterator = function(map, func) {
        var entry = map.head_;
        return $jscomp.iteratorPrototype(function() {
            if (entry) {
                while (entry.head != map.head_) {
                    entry = entry.previous;
                }
                while (entry.next != entry.head) {
                    entry = entry.next;
                    return { done: false, value: func(entry) };
                }
                entry = null;
            }
            return { done: true, value: void 0 };
        });
    };
    var createHead = function() {
        var head = {};
        head.previous = head.next = head.head = head;
        return head;
    };
    var mapIndex = 0;
    var getId = function(obj) {
        var type = obj && typeof obj;
        if (type == 'object' || type == 'function') {
            obj = (obj);
            if (!idMap.has(obj)) {
                var id = '' + ++mapIndex;
                idMap.set(obj, id);
                return id;
            }
            return idMap.get(obj);
        }
        return 'p_' + obj;
    };
    return PolyfillMap;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.acosh', function(orig) {
    if (orig) {
        return orig;
    }
    var polyfill = function(x) {
        x = Number(x);
        return Math.log(x + Math.sqrt(x * x - 1));
    };
    return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.asinh', function(orig) {
    if (orig) {
        return orig;
    }
    var polyfill = function(x) {
        x = Number(x);
        if (x === 0) {
            return x;
        }
        var y = Math.log(Math.abs(x) + Math.sqrt(x * x + 1));
        return x < 0 ? -y : y;
    };
    return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.log1p', function(orig) {
    if (orig) {
        return orig;
    }
    var polyfill = function(x) {
        x = Number(x);
        if (x < 0.25 && x > -0.25) {
            var y = x;
            var d = 1;
            var z = x;
            var zPrev = 0;
            var s = 1;
            while (zPrev != z) {
                y *= x;
                s *= -1;
                z = (zPrev = z) + s * y / ++d;
            }
            return z;
        }
        return Math.log(1 + x);
    };
    return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.atanh', function(orig) {
    if (orig) {
        return orig;
    }
    var log1p = Math.log1p;
    var polyfill = function(x) {
        x = Number(x);
        return (log1p(x) - log1p(-x)) / 2;
    };
    return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.cbrt', function(orig) {
    if (orig) {
        return orig;
    }
    var polyfill = function(x) {
        if (x === 0) {
            return x;
        }
        x = Number(x);
        var y = Math.pow(Math.abs(x), 1 / 3);
        return x < 0 ? -y : y;
    };
    return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.clz32', function(orig) {
    if (orig) {
        return orig;
    }
    var polyfill = function(x) {
        x = Number(x) >>> 0;
        if (x === 0) {
            return 32;
        }
        var result = 0;
        if ((x & 4294901760) === 0) {
            x <<= 16;
            result += 16;
        }
        if ((x & 4278190080) === 0) {
            x <<= 8;
            result += 8;
        }
        if ((x & 4026531840) === 0) {
            x <<= 4;
            result += 4;
        }
        if ((x & 3221225472) === 0) {
            x <<= 2;
            result += 2;
        }
        if ((x & 2147483648) === 0) {
            result++;
        }
        return result;
    };
    return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.cosh', function(orig) {
    if (orig) {
        return orig;
    }
    var exp = Math.exp;
    var polyfill = function(x) {
        x = Number(x);
        return (exp(x) + exp(-x)) / 2;
    };
    return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.expm1', function(orig) {
    if (orig) {
        return orig;
    }
    var polyfill = function(x) {
        x = Number(x);
        if (x < .25 && x > -.25) {
            var y = x;
            var d = 1;
            var z = x;
            var zPrev = 0;
            while (zPrev != z) {
                y *= x / ++d;
                z = (zPrev = z) + y;
            }
            return z;
        }
        return Math.exp(x) - 1;
    };
    return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.hypot', function(orig) {
    if (orig) {
        return orig;
    }
    var polyfill = function(x, y, var_args) {
        x = Number(x);
        y = Number(y);
        var i, z, sum;
        var max = Math.max(Math.abs(x), Math.abs(y));
        for (i = 2; i < arguments.length; i++) {
            max = Math.max(max, Math.abs(arguments[i]));
        }
        if (max > 1e100 || max < 1e-100) {
            x = x / max;
            y = y / max;
            sum = x * x + y * y;
            for (i = 2; i < arguments.length; i++) {
                z = Number(arguments[i]) / max;
                sum += z * z;
            }
            return Math.sqrt(sum) * max;
        } else {
            sum = x * x + y * y;
            for (i = 2; i < arguments.length; i++) {
                z = Number(arguments[i]);
                sum += z * z;
            }
            return Math.sqrt(sum);
        }
    };
    return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.imul', function(orig) {
    if (orig) {
        return orig;
    }
    var polyfill = function(a, b) {
        a = Number(a);
        b = Number(b);
        var ah = a >>> 16 & 65535;
        var al = a & 65535;
        var bh = b >>> 16 & 65535;
        var bl = b & 65535;
        var lh = ah * bl + al * bh << 16 >>> 0;
        return al * bl + lh | 0;
    };
    return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.log10', function(orig) {
    if (orig) {
        return orig;
    }
    var polyfill = function(x) {
        return Math.log(x) / Math.LN10;
    };
    return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.log2', function(orig) {
    if (orig) {
        return orig;
    }
    var polyfill = function(x) {
        return Math.log(x) / Math.LN2;
    };
    return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.sign', function(orig) {
    if (orig) {
        return orig;
    }
    var polyfill = function(x) {
        x = Number(x);
        return x === 0 || isNaN(x) ? x : x > 0 ? 1 : -1;
    };
    return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.sinh', function(orig) {
    if (orig) {
        return orig;
    }
    var exp = Math.exp;
    var polyfill = function(x) {
        x = Number(x);
        if (x === 0) {
            return x;
        }
        return (exp(x) - exp(-x)) / 2;
    };
    return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.tanh', function(orig) {
    if (orig) {
        return orig;
    }
    var polyfill = function(x) {
        x = Number(x);
        if (x === 0) {
            return x;
        }
        var y = Math.exp(-2 * Math.abs(x));
        var z = (1 - y) / (1 + y);
        return x < 0 ? -z : z;
    };
    return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.trunc', function(orig) {
    if (orig) {
        return orig;
    }
    var polyfill = function(x) {
        x = Number(x);
        if (isNaN(x) || x === Infinity || x === -Infinity || x === 0) {
            return x;
        }
        var y = Math.floor(Math.abs(x));
        return x < 0 ? -y : y;
    };
    return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Number.EPSILON', function(orig) {
    return Math.pow(2, -52);
}, 'es6-impl', 'es3');
$jscomp.polyfill('Number.MAX_SAFE_INTEGER', function() {
    return 9007199254740991;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Number.MIN_SAFE_INTEGER', function() {
    return -9007199254740991;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Number.isFinite', function(orig) {
    if (orig) {
        return orig;
    }
    var polyfill = function(x) {
        if (typeof x !== 'number') {
            return false;
        }
        return !isNaN(x) && x !== Infinity && x !== -Infinity;
    };
    return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Number.isInteger', function(orig) {
    if (orig) {
        return orig;
    }
    var polyfill = function(x) {
        if (!Number.isFinite(x)) {
            return false;
        }
        return x === Math.floor(x);
    };
    return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Number.isNaN', function(orig) {
    if (orig) {
        return orig;
    }
    var polyfill = function(x) {
        return typeof x === 'number' && isNaN(x);
    };
    return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Number.isSafeInteger', function(orig) {
    if (orig) {
        return orig;
    }
    var polyfill = function(x) {
        return Number.isInteger(x) && Math.abs(x) <= Number.MAX_SAFE_INTEGER;
    };
    return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Object.assign', function(orig) {
    if (orig) {
        return orig;
    }
    var polyfill = function(target, var_args) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            if (!source) {
                continue;
            }
            for (var key in source) {
                if ($jscomp.owns(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Object.entries', function(orig) {
    if (orig) {
        return orig;
    }
    var entries = function(obj) {
        var result = [];
        for (var key in obj) {
            if ($jscomp.owns(obj, key)) {
                result.push([key, obj[key]]);
            }
        }
        return result;
    };
    return entries;
}, 'es8', 'es3');
$jscomp.polyfill('Object.getOwnPropertySymbols', function(orig) {
    if (orig) {
        return orig;
    }
    return function() {
        return [];
    };
}, 'es6-impl', 'es5');
$jscomp.polyfill('Reflect.ownKeys', function(orig) {
    if (orig) {
        return orig;
    }
    var symbolPrefix = 'jscomp_symbol_';

    function isSymbol(key) {
        return key.substring(0, symbolPrefix.length) == symbolPrefix;
    }
    var polyfill = function(target) {
        var keys = [];
        var names = Object.getOwnPropertyNames(target);
        var symbols = Object.getOwnPropertySymbols(target);
        for (var i = 0; i < names.length; i++) {
            (isSymbol(names[i]) ? symbols : keys).push(names[i]);
        }
        return keys.concat(symbols);
    };
    return polyfill;
}, 'es6', 'es5');
$jscomp.polyfill('Object.getOwnPropertyDescriptors', function(orig) {
    if (orig) {
        return orig;
    }
    var getOwnPropertyDescriptors = function(obj) {
        var result = {};
        var keys = Reflect.ownKeys(obj);
        for (var i = 0; i < keys.length; i++) {
            result[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
        }
        return result;
    };
    return getOwnPropertyDescriptors;
}, 'es8', 'es5');
$jscomp.polyfill('Object.setPrototypeOf', function(orig) {
    if (orig) {
        return orig;
    }
    if (typeof ''.__proto__ != 'object') {
        return null;
    }
    var polyfill = function(target, proto) {
        target.__proto__ = proto;
        if (target.__proto__ !== proto) {
            throw new TypeError(target + ' is not extensible');
        }
        return target;
    };
    return polyfill;
}, 'es6', 'es5');
$jscomp.polyfill('Object.values', function(orig) {
    if (orig) {
        return orig;
    }
    var values = function(obj) {
        var result = [];
        for (var key in obj) {
            if ($jscomp.owns(obj, key)) {
                result.push(obj[key]);
            }
        }
        return result;
    };
    return values;
}, 'es8', 'es3');
$jscomp.polyfill('Reflect.apply', function(orig) {
    if (orig) {
        return orig;
    }
    var apply = Function.prototype.apply;
    var polyfill = function(target, thisArg, argList) {
        return apply.call(target, thisArg, argList);
    };
    return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Reflect.construct', function(orig) {
    if (orig) {
        return orig;
    }
    var polyfill = function(target, argList, opt_newTarget) {
        if (opt_newTarget === undefined) {
            opt_newTarget = target;
        }
        var proto = opt_newTarget.prototype || Object.prototype;
        var obj = Object.create(proto);
        var out = Reflect.apply(target, obj, argList);
        return out || obj;
    };
    return polyfill;
}, 'es6', 'es5');
$jscomp.polyfill('Reflect.defineProperty', function(orig) {
    if (orig) {
        return orig;
    }
    var polyfill = function(target, propertyKey, attributes) {
        try {
            Object.defineProperty(target, propertyKey, attributes);
            var desc = Object.getOwnPropertyDescriptor(target, propertyKey);
            if (!desc) {
                return false;
            }
            return desc.configurable === (attributes.configurable || false) && desc.enumerable === (attributes.enumerable || false) && ('value' in desc ? desc.value === attributes.value && desc.writable === (attributes.writable || false) : desc.get === attributes.get && desc.set === attributes.set);
        } catch (err) {
            return false;
        }
    };
    return polyfill;
}, 'es6', 'es5');
$jscomp.polyfill('Reflect.deleteProperty', function(orig) {
    if (orig) {
        return orig;
    }
    var polyfill = function(target, propertyKey) {
        if (!$jscomp.owns(target, propertyKey)) {
            return true;
        }
        try {
            return delete target[propertyKey];
        } catch (err) {
            return false;
        }
    };
    return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Reflect.getOwnPropertyDescriptor', function(orig) {
    return orig || Object.getOwnPropertyDescriptor;
}, 'es6', 'es5');
$jscomp.polyfill('Reflect.getPrototypeOf', function(orig) {
    return orig || Object.getPrototypeOf;
}, 'es6', 'es5');
$jscomp.findDescriptor = function(target, propertyKey) {
    var obj = target;
    while (obj) {
        var property = Reflect.getOwnPropertyDescriptor(obj, propertyKey);
        if (property) {
            return property;
        }
        obj = Reflect.getPrototypeOf(obj);
    }
    return undefined;
};
$jscomp.polyfill('Reflect.get', function(orig) {
    if (orig) {
        return orig;
    }
    var polyfill = function(target, propertyKey, opt_receiver) {
        if (arguments.length <= 2) {
            return target[propertyKey];
        }
        var property = $jscomp.findDescriptor(target, propertyKey);
        if (property) {
            return property.get ? property.get.call(opt_receiver) : property.value;
        }
        return undefined;
    };
    return polyfill;
}, 'es6', 'es5');
$jscomp.polyfill('Reflect.has', function(orig) {
    if (orig) {
        return orig;
    }
    var polyfill = function(target, propertyKey) {
        return propertyKey in target;
    };
    return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Reflect.isExtensible', function(orig) {
    if (orig) {
        return orig;
    }
    if (typeof Object.isExtensible == 'function') {
        return Object.isExtensible;
    }
    return function() {
        return true;
    };
}, 'es6', 'es3');
$jscomp.polyfill('Reflect.preventExtensions', function(orig) {
    if (orig) {
        return orig;
    }
    if (typeof Object.preventExtensions != 'function') {
        return function() {
            return false;
        };
    }
    var polyfill = function(target) {
        Object.preventExtensions(target);
        return !Object.isExtensible(target);
    };
    return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Reflect.set', function(orig) {
    if (orig) {
        return orig;
    }
    var polyfill = function(target, propertyKey, value, opt_receiver) {
        var property = $jscomp.findDescriptor(target, propertyKey);
        if (!property) {
            if (Reflect.isExtensible(target)) {
                target[propertyKey] = value;
                return true;
            }
            return false;
        }
        if (property.set) {
            property.set.call(arguments.length > 3 ? opt_receiver : target, value);
            return true;
        } else {
            if (property.writable && !Object.isFrozen(target)) {
                target[propertyKey] = value;
                return true;
            }
        }
        return false;
    };
    return polyfill;
}, 'es6', 'es5');
$jscomp.polyfill('Reflect.setPrototypeOf', function(orig) {
    if (orig) {
        return orig;
    }
    if (typeof ''.__proto__ != 'object') {
        return null;
    }
    var polyfill = function(target, proto) {
        try {
            target.__proto__ = proto;
            return target.__proto__ === proto;
        } catch (err) {
            return false;
        }
    };
    return polyfill;
}, 'es6', 'es5');
$jscomp.ASSUME_NO_NATIVE_SET = false;
$jscomp.polyfill('Set', function(NativeSet) {
    var isConformant = !$jscomp.ASSUME_NO_NATIVE_SET && function() {
        if (!NativeSet || !NativeSet.prototype.entries || typeof Object.seal != 'function') {
            return false;
        }
        try {
            NativeSet = (NativeSet);
            var value = Object.seal({ x: 4 });
            var set = new NativeSet($jscomp.makeIterator([value]));
            if (!set.has(value) || set.size != 1 || set.add(value) != set || set.size != 1 || set.add({ x: 4 }) != set || set.size != 2) {
                return false;
            }
            var iter = set.entries();
            var item = iter.next();
            if (item.done || item.value[0] != value || item.value[1] != value) {
                return false;
            }
            item = iter.next();
            if (item.done || item.value[0] == value || item.value[0].x != 4 || item.value[1] != item.value[0]) {
                return false;
            }
            return iter.next().done;
        } catch (err) {
            return false;
        }
    }();
    if (isConformant) {
        return NativeSet;
    }
    $jscomp.initSymbol();
    $jscomp.initSymbolIterator();
    var PolyfillSet = function(opt_iterable) {
        this.map_ = new Map;
        if (opt_iterable) {
            var iter = $jscomp.makeIterator(opt_iterable);
            var entry;
            while (!(entry = iter.next()).done) {
                var item = (entry).value;
                this.add(item);
            }
        }
        this.size = this.map_.size;
    };
    PolyfillSet.prototype.add = function(value) {
        this.map_.set(value, value);
        this.size = this.map_.size;
        return this;
    };
    PolyfillSet.prototype['delete'] = function(value) {
        var result = this.map_['delete'](value);
        this.size = this.map_.size;
        return result;
    };
    PolyfillSet.prototype.clear = function() {
        this.map_.clear();
        this.size = 0;
    };
    PolyfillSet.prototype.has = function(value) {
        return this.map_.has(value);
    };
    PolyfillSet.prototype.entries = function() {
        return this.map_.entries();
    };
    PolyfillSet.prototype.values = function() {
        return this.map_.values();
    };
    PolyfillSet.prototype.keys = PolyfillSet.prototype.values;
    (PolyfillSet.prototype)[Symbol.iterator] = PolyfillSet.prototype.values;
    PolyfillSet.prototype.forEach = function(callback, opt_thisArg) {
        var set = this;
        this.map_.forEach(function(value) {
            return callback.call((opt_thisArg), value, value, set);
        });
    };
    return PolyfillSet;
}, 'es6-impl', 'es3');
$jscomp.checkStringArgs = function(thisArg, arg, func) {
    if (thisArg == null) {
        throw new TypeError("The 'this' value for String.prototype." + func + ' must not be null or undefined');
    }
    if (arg instanceof RegExp) {
        throw new TypeError('First argument to String.prototype.' + func + ' must not be a regular expression');
    }
    return thisArg + '';
};
$jscomp.polyfill('String.prototype.codePointAt', function(orig) {
    if (orig) {
        return orig;
    }
    var polyfill = function(position) {
        var string = $jscomp.checkStringArgs(this, null, 'codePointAt');
        var size = string.length;
        position = Number(position) || 0;
        if (!(position >= 0 && position < size)) {
            return void 0;
        }
        position = position | 0;
        var first = string.charCodeAt(position);
        if (first < 55296 || first > 56319 || position + 1 === size) {
            return first;
        }
        var second = string.charCodeAt(position + 1);
        if (second < 56320 || second > 57343) {
            return first;
        }
        return (first - 55296) * 1024 + second + 9216;
    };
    return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('String.prototype.endsWith', function(orig) {
    if (orig) {
        return orig;
    }
    var polyfill = function(searchString, opt_position) {
        var string = $jscomp.checkStringArgs(this, searchString, 'endsWith');
        searchString = searchString + '';
        if (opt_position === void 0) {
            opt_position = string.length;
        }
        var i = Math.max(0, Math.min(opt_position | 0, string.length));
        var j = searchString.length;
        while (j > 0 && i > 0) {
            if (string[--i] != searchString[--j]) {
                return false;
            }
        }
        return j <= 0;
    };
    return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('String.fromCodePoint', function(orig) {
    if (orig) {
        return orig;
    }
    var polyfill = function(var_args) {
        var result = '';
        for (var i = 0; i < arguments.length; i++) {
            var code = Number(arguments[i]);
            if (code < 0 || code > 1114111 || code !== Math.floor(code)) {
                throw new RangeError('invalid_code_point ' + code);
            }
            if (code <= 65535) {
                result += String.fromCharCode(code);
            } else {
                code -= 65536;
                result += String.fromCharCode(code >>> 10 & 1023 | 55296);
                result += String.fromCharCode(code & 1023 | 56320);
            }
        }
        return result;
    };
    return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('String.prototype.includes', function(orig) {
    if (orig) {
        return orig;
    }
    var polyfill = function(searchString, opt_position) {
        var string = $jscomp.checkStringArgs(this, searchString, 'includes');
        return string.indexOf(searchString, opt_position || 0) !== -1;
    };
    return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('String.prototype.repeat', function(orig) {
    if (orig) {
        return orig;
    }
    var polyfill = function(copies) {
        var string = $jscomp.checkStringArgs(this, null, 'repeat');
        if (copies < 0 || copies > 1342177279) {
            throw new RangeError('Invalid count value');
        }
        copies = copies | 0;
        var result = '';
        while (copies) {
            if (copies & 1) {
                result += string;
            }
            if (copies >>>= 1) {
                string += string;
            }
        }
        return result;
    };
    return polyfill;
}, 'es6-impl', 'es3');
$jscomp.stringPadding = function(padString, padLength) {
    var padding = padString !== undefined ? String(padString) : ' ';
    if (!(padLength > 0) || !padding) {
        return '';
    }
    var repeats = Math.ceil(padLength / padding.length);
    return padding.repeat(repeats).substring(0, padLength);
};
$jscomp.polyfill('String.prototype.padEnd', function(orig) {
    if (orig) {
        return orig;
    }
    var padEnd = function(targetLength, opt_padString) {
        var string = $jscomp.checkStringArgs(this, null, 'padStart');
        var padLength = targetLength - string.length;
        return string + $jscomp.stringPadding(opt_padString, padLength);
    };
    return padEnd;
}, 'es8', 'es3');
$jscomp.polyfill('String.prototype.padStart', function(orig) {
    if (orig) {
        return orig;
    }
    var padStart = function(targetLength, opt_padString) {
        var string = $jscomp.checkStringArgs(this, null, 'padStart');
        var padLength = targetLength - string.length;
        return $jscomp.stringPadding(opt_padString, padLength) + string;
    };
    return padStart;
}, 'es8', 'es3');
$jscomp.polyfill('String.prototype.startsWith', function(orig) {
    if (orig) {
        return orig;
    }
    var polyfill = function(searchString, opt_position) {
        var string = $jscomp.checkStringArgs(this, searchString, 'startsWith');
        searchString = searchString + '';
        var strLen = string.length;
        var searchLen = searchString.length;
        var i = Math.max(0, Math.min((opt_position) | 0, string.length));
        var j = 0;
        while (j < searchLen && i < strLen) {
            if (string[i++] != searchString[j++]) {
                return false;
            }
        }
        return j >= searchLen;
    };
    return polyfill;
}, 'es6-impl', 'es3');
$jscomp.arrayFromIterator = function(iterator) {
    var i;
    var arr = [];
    while (!(i = iterator.next()).done) {
        arr.push(i.value);
    }
    return arr;
};
$jscomp.arrayFromIterable = function(iterable) {
    if (iterable instanceof Array) {
        return iterable;
    } else {
        return $jscomp.arrayFromIterator($jscomp.makeIterator(iterable));
    }
};
$jscomp.inherits = function(childCtor, parentCtor) {
    function tempCtor() {}
    tempCtor.prototype = parentCtor.prototype;
    childCtor.superClass_ = parentCtor.prototype;
    childCtor.prototype = new tempCtor;
    childCtor.prototype.constructor = childCtor;
    for (var p in parentCtor) {
        if (Object.defineProperties) {
            var descriptor = Object.getOwnPropertyDescriptor(parentCtor, p);
            if (descriptor) {
                Object.defineProperty(childCtor, p, descriptor);
            }
        } else {
            childCtor[p] = parentCtor[p];
        }
    }
};
$jscomp.polyfill('WeakSet', function(NativeWeakSet) {
    function isConformant() {
        if (!NativeWeakSet || !Object.seal) {
            return false;
        }
        try {
            var x = Object.seal({});
            var y = Object.seal({});
            var set = new(NativeWeakSet)([x]);
            if (!set.has(x) || set.has(y)) {
                return false;
            }
            set['delete'](x);
            set.add(y);
            return !set.has(x) && set.has(y);
        } catch (err) {
            return false;
        }
    }
    if (isConformant()) {
        return NativeWeakSet;
    }
    var PolyfillWeakSet = function(opt_iterable) {
        this.map_ = new WeakMap;
        if (opt_iterable) {
            $jscomp.initSymbol();
            $jscomp.initSymbolIterator();
            var iter = $jscomp.makeIterator(opt_iterable);
            var entry;
            while (!(entry = iter.next()).done) {
                var item = entry.value;
                this.add(item);
            }
        }
    };
    PolyfillWeakSet.prototype.add = function(elem) {
        this.map_.set(elem, true);
        return this;
    };
    PolyfillWeakSet.prototype.has = function(elem) {
        return this.map_.has(elem);
    };
    PolyfillWeakSet.prototype['delete'] = function(elem) {
        return this.map_['delete'](elem);
    };
    return PolyfillWeakSet;
}, 'es6-impl', 'es3');
try {
    if (Array.prototype.values.toString().indexOf('[native code]') == -1) {
        delete Array.prototype.values;
    }
} catch (e) {}
Ext.define('Ext.theme.neptune.Component', {
    override: 'Ext.Component',
    initComponent: function() {
        this.callParent();
        if (this.dock && this.border === undefined) {
            this.border = false;
        }
    },
    privates: {
        initStyles: function() {
            var me = this,
                hasOwnBorder = me.hasOwnProperty('border'),
                border = me.border;
            if (me.dock) {
                me.border = null;
            }
            me.callParent(arguments);
            if (hasOwnBorder) {
                me.border = border;
            } else {
                delete me.border;
            }
        }
    }
}, function() {
    Ext.namespace('Ext.theme.is').Neptune = true;
    Ext.theme.name = 'Neptune';
});
Ext.define('Ext.theme.triton.Component', { override: 'Ext.Component' }, function() {
    Ext.namespace('Ext.theme.is').Triton = true;
    Ext.theme.name = 'Triton';
});
Ext.define('Ext.theme.triton.list.TreeItem', {
    override: 'Ext.list.TreeItem',
    compatibility: Ext.isIE8,
    setFloated: function(floated, wasFloated) {
        this.callParent([floated, wasFloated]);
        this.toolElement.syncRepaint();
    }
});
Ext.define('Ext.theme.neptune.resizer.Splitter', { override: 'Ext.resizer.Splitter', size: 8 });
Ext.define('Ext.theme.triton.resizer.Splitter', { override: 'Ext.resizer.Splitter', size: 10 });
Ext.define('Ext.theme.neptune.toolbar.Toolbar', { override: 'Ext.toolbar.Toolbar', usePlainButtons: false, border: false });
Ext.define('Ext.theme.neptune.layout.component.Dock', {
    override: 'Ext.layout.component.Dock',
    noBorderClassTable: [0, Ext.baseCSSPrefix + 'noborder-l', Ext.baseCSSPrefix + 'noborder-b', Ext.baseCSSPrefix + 'noborder-bl', Ext.baseCSSPrefix + 'noborder-r', Ext.baseCSSPrefix + 'noborder-rl', Ext.baseCSSPrefix + 'noborder-rb', Ext.baseCSSPrefix + 'noborder-rbl', Ext.baseCSSPrefix + 'noborder-t', Ext.baseCSSPrefix + 'noborder-tl', Ext.baseCSSPrefix + 'noborder-tb', Ext.baseCSSPrefix + 'noborder-tbl', Ext.baseCSSPrefix +
        'noborder-tr', Ext.baseCSSPrefix + 'noborder-trl', Ext.baseCSSPrefix + 'noborder-trb', Ext.baseCSSPrefix + 'noborder-trbl'
    ],
    edgeMasks: { top: 8, right: 4, bottom: 2, left: 1 },
    handleItemBorders: function() {
        var me = this,
            edges = 0,
            maskT = 8,
            maskR = 4,
            maskB = 2,
            maskL = 1,
            owner = me.owner,
            bodyBorder = owner.bodyBorder,
            ownerBorder = owner.border,
            collapsed = me.collapsed,
            edgeMasks = me.edgeMasks,
            noBorderCls = me.noBorderClassTable,
            dockedItemsGen = owner.dockedItems.generation,
            b, borderCls, docked, edgesTouched, i, ln, item, dock, lastValue, mask, addCls, removeCls;
        if (me.initializedBorders === dockedItemsGen) {
            return;
        }
        addCls = [];
        removeCls = [];
        borderCls = me.getBorderCollapseTable();
        noBorderCls = me.getBorderClassTable ? me.getBorderClassTable() : noBorderCls;
        me.initializedBorders = dockedItemsGen;
        me.collapsed = false;
        docked = me.getDockedItems('visual');
        me.collapsed = collapsed;
        for (i = 0, ln = docked.length; i < ln; i++) {
            item = docked[i];
            if (item.ignoreBorderManagement) {
                continue;
            }
            dock = item.dock;
            mask = edgesTouched = 0;
            addCls.length = 0;
            removeCls.length = 0;
            if (dock !== 'bottom') {
                if (edges & maskT) {
                    b = item.border;
                } else {
                    b = ownerBorder;
                    if (b !== false) {
                        edgesTouched += maskT;
                    }
                }
                if (b === false) {
                    mask += maskT;
                }
            }
            if (dock !== 'left') {
                if (edges & maskR) {
                    b = item.border;
                } else {
                    b = ownerBorder;
                    if (b !== false) {
                        edgesTouched += maskR;
                    }
                }
                if (b === false) {
                    mask += maskR;
                }
            }
            if (dock !== 'top') {
                if (edges & maskB) {
                    b = item.border;
                } else {
                    b = ownerBorder;
                    if (b !== false) {
                        edgesTouched += maskB;
                    }
                }
                if (b === false) {
                    mask += maskB;
                }
            }
            if (dock !== 'right') {
                if (edges & maskL) {
                    b = item.border;
                } else {
                    b = ownerBorder;
                    if (b !== false) {
                        edgesTouched += maskL;
                    }
                }
                if (b === false) {
                    mask += maskL;
                }
            }
            if ((lastValue = item.lastBorderMask) !== mask) {
                item.lastBorderMask = mask;
                if (lastValue) {
                    removeCls[0] = noBorderCls[lastValue];
                }
                if (mask) {
                    addCls[0] = noBorderCls[mask];
                }
            }
            if ((lastValue = item.lastBorderCollapse) !== edgesTouched) {
                item.lastBorderCollapse = edgesTouched;
                if (lastValue) {
                    removeCls[removeCls.length] = borderCls[lastValue];
                }
                if (edgesTouched) {
                    addCls[addCls.length] = borderCls[edgesTouched];
                }
            }
            if (removeCls.length) {
                item.removeCls(removeCls);
            }
            if (addCls.length) {
                item.addCls(addCls);
            }
            edges |= edgeMasks[dock];
        }
        mask = edgesTouched = 0;
        addCls.length = 0;
        removeCls.length = 0;
        if (edges & maskT) {
            b = bodyBorder;
        } else {
            b = ownerBorder;
            if (b !== false) {
                edgesTouched += maskT;
            }
        }
        if (b === false) {
            mask += maskT;
        }
        if (edges & maskR) {
            b = bodyBorder;
        } else {
            b = ownerBorder;
            if (b !== false) {
                edgesTouched += maskR;
            }
        }
        if (b === false) {
            mask += maskR;
        }
        if (edges & maskB) {
            b = bodyBorder;
        } else {
            b = ownerBorder;
            if (b !== false) {
                edgesTouched += maskB;
            }
        }
        if (b === false) {
            mask += maskB;
        }
        if (edges & maskL) {
            b = bodyBorder;
        } else {
            b = ownerBorder;
            if (b !== false) {
                edgesTouched += maskL;
            }
        }
        if (b === false) {
            mask += maskL;
        }
        if ((lastValue = me.lastBodyBorderMask) !== mask) {
            me.lastBodyBorderMask = mask;
            if (lastValue) {
                removeCls[0] = noBorderCls[lastValue];
            }
            if (mask) {
                addCls[0] = noBorderCls[mask];
            }
        }
        if ((lastValue = me.lastBodyBorderCollapse) !== edgesTouched) {
            me.lastBodyBorderCollapse = edgesTouched;
            if (lastValue) {
                removeCls[removeCls.length] = borderCls[lastValue];
            }
            if (edgesTouched) {
                addCls[addCls.length] = borderCls[edgesTouched];
            }
        }
        if (removeCls.length) {
            owner.removeBodyCls(removeCls);
        }
        if (addCls.length) {
            owner.addBodyCls(addCls);
        }
    },
    onRemove: function(item) {
        var me = this,
            lastBorderMask = item.lastBorderMask,
            lastBorderCollapse = item.lastBorderCollapse;
        if (!item.destroyed && !item.ignoreBorderManagement) {
            if (lastBorderMask) {
                item.lastBorderMask = 0;
                item.removeCls(me.noBorderClassTable[lastBorderMask]);
            }
            if (lastBorderCollapse) {
                item.lastBorderCollapse = 0;
                item.removeCls(me.getBorderCollapseTable()[lastBorderCollapse]);
            }
        }
        me.callParent([item]);
    }
});
Ext.define('Ext.theme.neptune.panel.Panel', {
    override: 'Ext.panel.Panel',
    border: false,
    bodyBorder: false,
    initBorderProps: Ext.emptyFn,
    initBodyBorder: function() {
        if (this.bodyBorder !== true) {
            this.callParent();
        }
    }
});
Ext.define('Ext.theme.triton.form.field.Checkbox', {
    override: 'Ext.form.field.Checkbox',
    compatibility: Ext.isIE8,
    initComponent: function() {
        this.callParent();
        Ext.on({ show: 'onGlobalShow', scope: this });
    },
    onFocus: function(e) {
        var focusClsEl;
        this.callParent([e]);
        focusClsEl = this.getFocusClsEl();
        if (focusClsEl) {
            focusClsEl.syncRepaint();
        }
    },
    onBlur: function(e) {
        var focusClsEl;
        this.callParent([e]);
        focusClsEl = this.getFocusClsEl();
        if (focusClsEl) {
            focusClsEl.syncRepaint();
        }
    },
    onGlobalShow: function(cmp) {
        if (cmp.isAncestor(this)) {
            this.getFocusClsEl().syncRepaint();
        }
    }
});
Ext.define('Ext.theme.neptune.toolbar.Paging', { override: 'Ext.toolbar.Paging', defaultButtonUI: 'plain-toolbar', inputItemWidth: 40 });
Ext.define('Ext.theme.triton.toolbar.Paging', { override: 'Ext.toolbar.Paging', inputItemWidth: 50 });
Ext.define('Ext.theme.neptune.picker.Month', { override: 'Ext.picker.Month', measureMaxHeight: 36 });
Ext.define('Ext.theme.triton.picker.Month', { override: 'Ext.picker.Month', footerButtonUI: 'default-toolbar', calculateMonthMargin: Ext.emptyFn });
Ext.define('Ext.theme.triton.picker.Date', { override: 'Ext.picker.Date', footerButtonUI: 'default-toolbar' });
Ext.define('Ext.theme.neptune.form.field.HtmlEditor', { override: 'Ext.form.field.HtmlEditor', defaultButtonUI: 'plain-toolbar' });
Ext.define('Ext.theme.neptune.panel.Table', {
    override: 'Ext.panel.Table',
    lockableBodyBorder: true,
    initComponent: function() {
        var me = this;
        me.callParent();
        if (!me.hasOwnProperty('bodyBorder') && !me.hideHeaders && (me.lockableBodyBorder || !me.lockable)) {
            me.bodyBorder = true;
        }
    }
});
Ext.define('Ext.theme.neptune.grid.RowEditor', { override: 'Ext.grid.RowEditor', buttonUI: 'default-toolbar' });
Ext.define('Ext.theme.triton.grid.column.Column', {
    override: 'Ext.grid.column.Column',
    compatibility: Ext.isIE8,
    onTitleMouseOver: function() {
        var triggerEl = this.triggerEl;
        this.callParent(arguments);
        if (triggerEl) {
            triggerEl.syncRepaint();
        }
    }
});
Ext.define('Ext.theme.triton.grid.column.Check', {
    override: 'Ext.grid.column.Check',
    compatibility: Ext.isIE8,
    setRecordCheck: function(record, checked, cell) {
        this.callParent([record, checked, cell]);
        cell.syncRepaint();
    }
});
Ext.define('Ext.theme.neptune.grid.column.RowNumberer', { override: 'Ext.grid.column.RowNumberer', width: 25 });
Ext.define('Ext.theme.triton.grid.column.RowNumberer', { override: 'Ext.grid.column.RowNumberer', width: 32 });
Ext.define('Ext.theme.triton.menu.Item', {
    override: 'Ext.menu.Item',
    compatibility: Ext.isIE8,
    onFocus: function(e) {
        this.callParent([e]);
        this.repaintIcons();
    },
    onFocusLeave: function(e) {
        this.callParent([e]);
        this.repaintIcons();
    },
    privates: {
        repaintIcons: function() {
            var iconEl = this.iconEl,
                arrowEl = this.arrowEl,
                checkEl = this.checkEl;
            if (iconEl) {
                iconEl.syncRepaint();
            }
            if (arrowEl) {
                arrowEl.syncRepaint();
            }
            if (checkEl) {
                checkEl.syncRepaint();
            }
        }
    }
});
Ext.define('Ext.theme.neptune.menu.Separator', { override: 'Ext.menu.Separator', border: true });
Ext.define('Ext.theme.neptune.menu.Menu', { override: 'Ext.menu.Menu', showSeparator: false });
Ext.define('Ext.theme.triton.menu.Menu', {
    override: 'Ext.menu.Menu',
    compatibility: Ext.isIE8,
    afterShow: function() {
        var me = this,
            items, item, i, len;
        me.callParent(arguments);
        items = me.items.getRange();
        for (i = 0, len = items.length; i < len; i++) {
            item = items[i];
            if (item && item.repaintIcons) {
                item.repaintIcons();
            }
        }
    }
});
Ext.define('Ext.theme.triton.selection.CheckboxModel', {
    override: 'Ext.selection.CheckboxModel',
    headerWidth: 32,
    onHeaderClick: function(headerCt, header, e) {
        this.callParent([headerCt, header, e]);
        if (Ext.isIE8) {
            header.getView().ownerGrid.el.syncRepaint();
        }
    }
});
Ext.button.Button.override({
    inLoading: false,
    btnType: '',
    _lastIconCls: '',
    setLoading: function(load) {
        if (load === true) {
            this._lastIconCls = this.iconCls;
            this.setIconCls('x-fa fa-spinner fa-spin');
        } else {
            if (this._lastIconCls) {
                this.setIconCls(this._lastIconCls);
            } else {
                this.setIconCls('');
            }
        }
        this.setDisabled(load);
    },
    initComponent: function() {
        if (!Ext.isEmpty(this.btnType)) {
            var ui = 'sefu-btn-' + this.btnType;
            Ext.apply(this, { ui: ui });
        }
        return this.callParent(arguments);
    }
});
Ext.grid.CellContext.override({
    setRow: function(row) {
        if (row === null) {
            return;
        }
        this.callParent(arguments);
    }
});
Ext.grid.column.Column.override({
    initComponent: function() {
        this.callParent(arguments);
    }
});
Ext.form.field.ComboBox.override({
    simpleModelValue: false,
    setValue: function(value) {
        return this.callParent(arguments);
    },
    doSetValue: function(value, add) {
        if (value && this.simpleModelValue === true && !value.isModel) {
            this.value = value[this.valueField];
            this.setHiddenValue(value[this.valueField]);
            this.setRawValue(value[this.displayField]);
            return this;
        }
        return this.callParent(arguments);
    },
    getValue: function() {
        var v = this.value,
            rv = this.getRawValue();
        var newV = this.callParent(arguments);
        if (this.simpleModelValue === true) {
            if (newV === rv) {
                return v;
            }
        }
        return newV;
    }
});
Ext.Component.override({
    mask: function(msg, msgCls, elHeight) {
        msg = msg || 'loading...';
        var newMsg = '\x3cdiv\x3e\x3cdiv class\x3d"loading-cube"\x3e\x3cspan\x3e\x3c/span\x3e\x3cspan\x3e\x3c/span\x3e\x3cspan\x3e\x3c/span\x3e\x3c/div\x3e\x3cdiv class\x3d"text"\x3e' + msg + '\x3c/div\x3e\x3c/div\x3e';
        this.callParent([newMsg, msgCls, elHeight]);
    }
});
Ext.data.field.Field.override({
    stype: 'string',
    stypefullname: 'System',
    index: 0,
    getSType: function() {
        var type = this.getType();
        var ctype = this.stype;
        if (this.name === 'Id') {
            return 'BigInt';
        }
        if (type === 'date') {
            return 'DateTime';
        }
        if (type === 'bool') {
            return 'bool';
        }
        if (type === 'int') {
            if (Ext.isEmpty(ctype) || ctype === 'string') {
                return 'int';
            } else {
                return ctype;
            }
        }
        if (type === 'number') {
            if (Ext.isEmpty(ctype) || ctype === 'string') {
                return 'float';
            } else {
                return ctype;
            }
        }
        if (type === 'string') {
            if (Ext.isEmpty(ctype)) {
                return 'string';
            }
            return ctype;
        }
        if (type === 'auto') {
            return ctype;
        }
        return 'auto';
    },
    constructor: function(config) {
        if (config.ref && config.stype === 'asso') {
            if (!config.convert) {
                var ref = config.ref;
                config.convert = function(v, rec) {
                    var newV = rec.get(ref);
                    return newV;
                };
            }
        }
        this.callParent([config]);
    }
});
Ext.form.field.Base.override({ labelSeparator: '' });
Ext.util.Filter.override({
    getState: function() {
        var result = {};
        var v = this.getValue();
        if (!Ext.isArray(v)) {
            v = [v];
        }
        result['FieldName'] = this.config['property'];
        result['Values'] = v;
        result['FType'] = this.config.ftype;
        result['Rel'] = this.config.rel;
        result['Operator'] = this.config.operator;
        return result;
    }
});
Ext.form.Labelable.override({
    getLabelableRenderData: function() {
        var d = this.callParent(arguments);
        console.log('label.render#', d);
        return d;
    }
});
Ext.LoadMask.override({
    _renderTpl: ['\x3cdiv id\x3d"{id}-msgWrapEl" data-ref\x3d"msgWrapEl" class\x3d"{[values.$comp.msgWrapCls]}" role\x3d"presentation"\x3e', '\x3cdiv id\x3d"{id}-msgEl" data-ref\x3d"msgEl" class\x3d"{[values.$comp.msgCls]} ', Ext.baseCSSPrefix, 'mask-msg-inner {childElCls}" role\x3d"presentation"\x3e', '\x3cdiv id\x3d"{id}-msgTextEl" data-ref\x3d"msgTextEl" class\x3d"', Ext.baseCSSPrefix, 'mask-msg-text', '{childElCls}" role\x3d"presentation"\x3e\x3cdiv\x3eloading\x3c/div\x3e{msg}###\x3c/div\x3e',
        '\x3c/div\x3e', '\x3c/div\x3e'
    ],
    initComponent: function() {
        this.callParent(arguments);
    }
});
Ext.menu.Menu.override({ shadow: false, defaultWidth: 200, width: 200 });
Ext.window.MessageBox.override({
    minWidth: 320,
    ui: 'sefu-dialog',
    buttonIds: ['no', 'cancel', 'ok', 'yes'],
    OK: 4,
    YES: 8,
    NO: 1,
    CANCEL: 2,
    SUCCESS: Ext.baseCSSPrefix + 'message-box-success',
    makeButton: function(btnIdx) {
        var btn = this.callParent(arguments);
        if (btnIdx < 2) {
            btn.setUI('sefu-btn-default');
        }
        return btn;
    },
    reconfigure: function(cfg) {
        var c = this.callParent(arguments);
        this.defaultFocus = this.msgButtons[this.msgButtons.length - 1];
        return c;
    },
    initComponent: function() {
        Ext.apply(this, {});
        this.callParent(arguments);
        var layout = this.bottomTb.getLayout();
        layout.setPack('end');
        this.topContainer.padding = '10px 15px 20px 15px';
        this.bottomTb.setUI('sefu-dialog-toolbar');
    }
});
Ext.data.proxy.Server.override({
    applyEncoding: function(v) {
        if (Ext.isObject(v)) {
            return v;
        }
        return v;
    }
});
Ext.util.Sorter.override({
    serialize: function() {
        return { FieldName: this.getProperty(), Asc: this.getDirection() === 'ASC' };
    }
});
Ext.form.field.Text.override({
    _isLocked: false,
    lockField: false,
    initComponent: function() {
        if (this.allowBlank === false) {
            Ext.apply(this, { cls: 'sef-required-field' });
        }
        this.callParent(arguments);
    },
    applyTriggers: function(triggers) {
        if (this.lockField === true) {
            this._isLocked = true;
            if (!triggers) {
                triggers = {};
            }
            triggers['lock'] = { cls: 'x-fa fa-lock', scope: 'this', handler: 'setFieldLock' };
        }
        return this.callParent([triggers]);
    },
    setFieldLock: function(isLocked) {
        if (isLocked === undefined) {
            isLocked = !this._isLocked;
            this._isLocked = isLocked;
        }
        if (isLocked === true) {
            this.getTrigger('lock').show();
        } else {
            this.getTrigger('lock').hide();
        }
        this.fireEvent('fieldlockchange', this, isLocked, this.getValue());
    }
});
Ext.tree.Panel.override({
    initComponent: function() {
        this.callParent(arguments);
        if (this.columns) {
            this.columns[0].textAlign = 'left';
        }
    }
});
window.IS_IN_SENCHA_CMD = true;
Ext.Loader.setConfig({ enable: true, paths: { 'sef.app': '/apps' } });
Ext.Ajax.on('beforerequest', function(conn, options, opt) {
    if (!options.headers) {
        options.headers = {};
    }
    var dftHeader = { 'x-sef': 'true', 'ID': sef.runningCfg.getUser().ID, 'TOKEN': sef.runningCfg.getUser().Token };
    Ext.apply(options.headers, dftHeader);
    if (options.url.indexOf('.json') >= 0) {
        if (window.SEF_LIB_CFG.jsonWithPost === true) {
            options['method'] = 'POST';
        } else {
            options['method'] = 'GET';
        }
    }
});
Ext.Ajax.on('requestcomplete', function(conn, opts) {
    var reqText = opts.responseText;
    if (reqText.indexOf('"ErrorCode":401') >= 0) {
        Ext.GlobalEvents.fireEvent('userexpired');
    }
});
Ext.define('sef.core.Application', {
    extend: Ext.app.Application,
    name: 'sef',
    listen: { global: { 'userexpired': 'onUserExpired' } },
    onUserExpired: function() {
        sef.runningCfg.clearUser(true);
    },
    launch: function() {
        var me = this;
        sef.runningCfg.initCfg(function(success, msg) {
            if (success) {
                var uiMode = sef.runningCfg.getUIMode();
                sef.utils.setDocTitle(sef.runningCfg.getTitle());
                var splashId = window.SEF_LIB_CFG.splashId;
                if (splashId) {
                    Ext.get(splashId).destroy();
                }
                if (uiMode === 'l-t') {
                    me.setMainView('sef.core.view.viewport.MDIViewport');
                } else {
                    me.setMainView('sef.core.view.viewport.TopMDIViewport');
                }
            } else {
                sef.dialog.error(msg.message, 'invalid profile');
            }
        });
    }
});
Ext.define('sef.core.components.CardPanel', {
    extend: Ext.panel.Panel,
    xtype: 'sef-cardpanel',
    ui: 'sefu-cardpanel',
    border: true,
    config: { loading: null, headerLine: false },
    initComponent: function() {
        if (this.headerLine === true) {
            Ext.apply(this, { cls: 'line' });
        }
        this.callParent(arguments);
    }
});
Ext.define('sef.core.components.SubTitle', {
    extend: Ext.Component,
    xtype: 'sef-subtitle',
    config: { title: '', icon: 'fa-th-large', scale: 'normal' },
    padding: '10px 0',
    initComponent: function() {
        Ext.apply(this, { data: { title: this.title, icon: this.icon, scale: this.scale }, tpl: ['\x3cdiv class\x3d"sef-subtitle {scale}"\x3e', '\x3cdiv class\x3d"text"\x3e{title}\x3c/div\x3e', '\x3c/div\x3e'] });
        this.callParent(arguments);
    }
});
Ext.define('sef.core.components.bar.GridPagingToolbar', {
    extend: Ext.toolbar.Paging,
    xtype: 'sef-gridpagingbar',
    ui: 'sefu-gridpagingbar',
    inputItemWidth: 40,
    config: { gridTip: null, statusTip: [], showPageSizeSwitcher: true, quickSearchInPaging: true, quickSearchFields: null, keepFilterForRefresh: false },
    initComponent: function() {
        this.displayInfo = false;
        this.callParent(arguments);
        this.displayInfo = true;
    },
    doRefresh: function() {
        if (this.keepFilterForRefresh !== true) {
            this.getStore().clearFilter(true);
        }
        this.callParent(arguments);
    },
    makePageSizeOption: function() {
        var me = this;
        var sizeData = [{ name: '50/page', value: 50 }, { name: '100/page', value: 100 }];
        return { xtype: 'combo', ui: 'sefu-textfield-paging', editable: false, queryMode: 'local', displayField: 'name', valueField: 'value', width: 100, emptyText: _('PageSize'), store: Ext.create('Ext.data.Store', { data: sizeData }), listeners: { scope: me, change: me.onPageSizeChange } };
    },
    onPageSizeChange: function(cb, newPageSize) {
        var me = this,
            store = me.store;
        if (store.getPageSize() != newPageSize) {
            store.setPageSize(newPageSize);
            store.currentPage = 1;
            store.loadPage(store.currentPage);
            return true;
        }
        return false;
    },
    makeGridTip: function() {
        if (this.gridTip) {
            return this.gridTip;
        }
        if (this.statusTip) {}
        return null;
    },
    makeQuickSearch: function() {
        if (this.quickSearchInPaging === true) {
            var me = this;
            return {
                xtype: 'sef-searchfield',
                flex: 1,
                listeners: {
                    quicksearch: function(v) {
                        if (me.quickSearchFields) {
                            var q = {};
                            me.quickSearchFields.forEach(function(qf) {
                                q[qf] = v;
                            });
                            me.getStore().makeQuery(q, true);
                        }
                    }
                }
            };
        }
        return null;
    },
    getPagingItems: function() {
        var items = this.callParent(arguments);
        if (this.showPageSizeSwitcher === true) {
            items = Ext.Array.insert(items, 7, [this.makePageSizeOption(), '-']);
        }
        var newItems = [];
        var it = this.makeGridTip();
        if (it) {
            newItems.push(it);
        }
        it = this.makeQuickSearch();
        if (it) {
            newItems.push(it);
        } else {
            newItems.push('-\x3e');
        }
        newItems = newItems.concat(items);
        newItems.forEach(function(item) {
            if (!item) {
                return;
            }
            if (item.itemId === 'first' || item.itemId === 'prev' || item.itemId === 'next' || item.itemId === 'last' || item.itemId === 'refresh') {}
            if (item.itemId === 'afterTextItem') {}
            if (item.itemId === 'inputItem') {
                item.ui = 'sefu-textfield-paging';
            }
        });
        newItems = Ext.Array.insert(newItems, newItems.length - 1, [{ xtype: 'tbtext', itemId: 'displayItem' }, '-']);
        return newItems;
    }
});
Ext.define('sef.core.components.bar.MainTopMenubar', {
    extend: Ext.toolbar.Toolbar,
    xtype: 'sef-maintopmenubar',
    ui: 'sefu-maintopmenubar',
    makeUserItems: function() {
        var items = [{ ui: 'sefu-mtb-msg-button', tooltip: _('你收到的消息'), hidden: true, bind: { text: '{message_count}', hidden: '{message_count\x3c1}' } }, { ui: 'sefu-mtb-button', iconCls: 'x-fa fa-language', text: 'En', tooltip: '\bLanguage', bind: { text: '{lang}' }, handler: 'onChangeLang' }, { ui: 'sefu-mtb-button', iconCls: 'x-fa fa-th-large', tooltip: '显示模式', handler: 'onChangeUIMode' }, '-', {
            ui: 'sefu-mtb-button',
            iconCls: 'x-fa fa-user',
            bind: { text: '{user_name}' },
            margin: '0 5px 0 0',
            menu: [{ text: _('用户设置'), handler: 'onUserSetting' },
                { text: _('更改密码'), handler: 'onChangePwd' }, '-', { text: _('更新日志'), handler: 'onShowUpdateLog' }, '-', { iconCls: 'x-fa fa-sign-out', handler: 'onSignOut', text: _('退出系统') }
            ]
        }];
        return items;
    },
    makeItems: function() {
        var items = [];
        items.push({ xtype: 'tbtext', cls: 'tbtext', html: 'EAP', bind: { html: '{soft_name}' }, margin: '0 10px 0 0' });
        items.push({ text: 'SCM', ui: 'sefu-mtb-button-menu', arrowVisible: false, menu: [{ text: 'PO' }, { text: 'PR' }] });
        items.push('-\x3e');
        items = items.concat(this.makeUserItems());
        return items;
    },
    initComponent: function() {
        Ext.apply(this, { items: this.makeItems() });
        this.callParent(arguments);
    }
});
Ext.define('sef.core.components.bar.MainTopbar', {
    extend: Ext.toolbar.Toolbar,
    xtype: 'sef-maintopbar',
    ui: 'sefu-maintopbar',
    region: 'north',
    items: [{ xtype: 'tbtext', cls: 'tbtext', html: 'EAP', bind: { html: '{soft_name}' } }, '-', { xtype: 'tbtext', cls: 'tbtext webfont', html: '电梯行业高级管理平台', bind: { html: '{soft_title}' } }, '-\x3e', { xtype: 'tbtext', html: '' }, '-\x3e', { ui: 'sefu-mtb-msg-button', tooltip: _('你收到的消息'), hidden: true, bind: { text: '{message_count}', hidden: '{message_count\x3c1}' } }, {
        ui: 'sefu-mtb-button',
        iconCls: 'x-fa fa-qq',
        text: 'QQ',
        tooltip: '在线支持',
        href: 'http://wpa.qq.com/msgrd?v\x3d3\x26uin\x3d2258601695\x26site\x3dqq\x26menu\x3dyes',
        target: '_blank',
        _handler: 'onQQSupport'
    }, { ui: 'sefu-mtb-button', iconCls: 'x-fa fa-language', text: 'En', tooltip: '\bLanguage', bind: { text: '{lang}' }, handler: 'onChangeLang' }, { ui: 'sefu-mtb-button', iconCls: 'x-fa fa-th-large', tooltip: '显示模式', handler: 'onChangeUIMode' }, '-', {
        ui: 'sefu-mtb-button',
        iconCls: 'x-fa fa-user',
        bind: { text: '{user_name}' },
        margin: '0 5px 0 0',
        menu: [{ text: _('用户设置'), handler: 'onUserSetting' }, { text: _('更改密码'), handler: 'onChangePwd' }, '-', { text: _('更新日志'), handler: 'onShowUpdateLog' }, '-', { iconCls: 'x-fa fa-sign-out', handler: 'onSignOut', text: _('退出系统') }]
    }]
});
Ext.define('sef.core.components.bar.SearchBar', {
    extend: Ext.container.Container,
    xtype: 'sef-searchbar',
    cls: 'sef-searchbar',
    layout: { type: 'vbox', align: 'stretch' },
    model: null,
    searchItems: null,
    columnWidth: 0,
    labelWidth: 80,
    padding: '5 10 5 10',
    viewModel: { data: { simple_search: true } },
    makeAdvSearchItemCfg: function(field, mf) {
        var type = '';
        if (mf) {
            type = mf.type.toLowerCase();
        }
        var fc = { type: type, name: field.name };
        switch (type) {
            case 'bool':
            case 'boolean':
                fc['xtype'] = 'sef-boolcombo';
                fc['ops'] = ['\x3d\x3d', '!\x3d'];
                break;
            case 'int':
            case 'bigint':
                fc['xtype'] = 'sef-rangefield';
                fc['rtype'] = 'numberfield';
                fc['ops'] = ['\x3d\x3d', '!\x3d', '\x3e', '\x3e\x3d', '\x3c', '\x3c\x3d'];
                fc['fieldDefaults'] = { allowDecimals: false };
                break;
            case 'float':
            case 'double':
            case 'decimal':
                fc['xtype'] = 'sef-rangefield';
                fc['rtype'] = 'numberfield';
                fc['ops'] = ['\x3d\x3d', '!\x3d', '\x3e', '\x3e\x3d', '\x3c', '\x3c\x3d'];
                break;
            case 'datetime':
            case 'date':
            case 'time':
                fc['ops'] = ['\x3d\x3d', '!\x3d', '\x3e', '\x3e\x3d', '\x3c', '\x3c\x3d'];
                fc['xtype'] = 'datefield';
                break;
            case 'enum':
                fc['ops'] = ['\x3d\x3d', '!\x3d'];
                fc['xtype'] = 'sef-enumcombo';
                fc['enumType'] = mf.sassb;
                break;
            default:
                fc['ops'] = ['\x3d\x3d', '!\x3d', '\x3e', '\x3e\x3d', '\x3c', '\x3c\x3d', 'like'];
                break;
        }
        return fc;
    },
    makeOpData: function(data) {
        return Ext.Array.map(data, function(d) {
            return { display: d, value: sef.runningCfg.searchOperator[d] };
        });
    },
    makeSearchItemOps: function(field, fc) {
        var combo = {
            xtype: 'combo',
            width: 80,
            name: field.name + '__op',
            displayField: 'display',
            valueField: 'value',
            editable: false,
            listeners: {
                'afterrender': function(c) {
                    c.select(c.getStore().getAt(0));
                }
            }
        };
        var ops = field.ops || fc.ops;
        delete fc.ops;
        Ext.apply(combo, { store: Ext.create('Ext.data.Store', { fields: ['display', 'value'], data: this.makeOpData(ops) }) });
        return combo;
    },
    makeSearchItemField: function(field, fc) {
        var f = { flex: 1, xtype: 'textfield' };
        Ext.apply(f, field.xtype ? field : fc);
        return f;
    },
    makeAdvSearchItem: function(field, mf) {
        var text = field.fieldLabel;
        field.fieldLabel = '';
        var cfg = this.makeAdvSearchItemCfg(field, mf);
        var sitems = [];
        sitems.push({ xtype: 'box', html: '\x3cdiv class\x3d"sef-advsearch-label"\x3e' + text + '\x3c/div\x3e', width: 80 });
        sitems.push(this.makeSearchItemOps(field, cfg));
        sitems.push({ xtype: 'box', width: 5 });
        sitems.push(this.makeSearchItemField(field, cfg));
        return { xtype: 'fieldcontainer', layout: { type: 'hbox', align: 'stretch' }, items: sitems };
    },
    makeAdvSearchItems: function() {
        var me = this,
            items = [];
        if (!this.searchItems) {
            this.searchItems = [];
        }
        var modelMeta = sef.utils.getModelMeta(this.model);
        this.searchItems.forEach(function(f) {
            var field = null,
                mf = null;
            if (Ext.isString(f)) {
                mf = Ext.Array.findBy(modelMeta, function(mm) {
                    return mm.name === f;
                });
                if (mf) {
                    field = { fieldLabel: mf.text };
                } else {
                    field = { name: f };
                }
            } else {
                mf = Ext.Array.findBy(modelMeta, function(mm) {
                    return mm.name === f.name;
                });
                field = Ext.merge({}, f);
                Ext.applyIf(field, { fieldLabel: mf && mf.text });
            }
            if (mf) {
                Ext.applyIf(field, { name: mf.name });
            }
            items.push(me.makeAdvSearchItem(field, mf));
        });
        items.push({
            columnWidth: 1,
            xtype: 'container',
            layout: { type: 'hbox', align: 'middle', pack: 'end' },
            items: [{
                xtype: 'button',
                btnType: 'primary',
                text: _('搜  索'),
                handler: function() {
                    me.onAdvSearch();
                }
            }, {
                xtype: 'button',
                text: _('清  空'),
                btnType: 'default',
                margin: '0 0 0 5px',
                handler: function() {
                    me.onClearSearch();
                }
            }, {
                margin: '0 0 0 5px',
                xtype: 'button',
                btnType: 'link',
                text: _('简易搜索'),
                handler: function() {
                    me.switchSearchMode(true);
                }
            }]
        });
        return items;
    },
    switchSearchMode: function(forSimple) {
        this.getViewModel().setData({ simple_search: forSimple });
    },
    makeSimpleSearch: function() {
        var me = this;
        return {
            xtype: 'container',
            hidden: true,
            bind: { hidden: '{!simple_search}' },
            layout: { type: 'hbox', align: 'middle', pack: 'end' },
            items: [{ xtype: 'sef-searchfield', emptyText: _('快速查询'), minWidth: 250, listeners: { scope: me, 'quicksearch': me.onQuickSearch } }, {
                xtype: 'button',
                btnType: 'link',
                margin: '0 0 0 5px',
                text: _('高级查询'),
                hidden: !me.searchItems,
                handler: function() {
                    me.switchSearchMode(false);
                }
            }]
        };
    },
    makeAdvSearch: function() {
        var r = { xtype: 'form', itemId: 'search_form', layout: 'column', hidden: true, bind: { hidden: '{simple_search}' }, margin: '10 0 0 0', defaults: { columnWidth: this.columnWidth, margin: '0 10px 10px 0', labelSeparator: '  ', labelAlign: 'right', labelWidth: this.labelWidth }, items: this.makeAdvSearchItems() };
        return r;
    },
    makeItems: function() {
        var items = [this.makeSimpleSearch(), this.makeAdvSearch()];
        return items;
    },
    onQuickSearch: function(v) {
        this.fireEvent('search', v);
    },
    onClearSearch: function() {
        var form = this.down('#search_form');
        form.reset();
        var combs = this.query('combo');
        if (combs) {
            combs.forEach(function(c) {
                c.select(c.getStore().getAt(0));
            });
        }
    },
    onAdvSearch: function() {
        var form = this.down('#search_form').getForm();
        var searchValues = form.getFieldValues();
        var vvs = {};
        for (var sv in searchValues) {
            if (/__op$/.test(sv)) {
                var name = sv.replace('__op', '');
                if (!vvs[name]) {
                    vvs[name] = { FieldName: name, Rel: 'And' };
                }
                vvs[name]['Operator'] = searchValues[sv];
            } else {
                if (!vvs[sv]) {
                    vvs[sv] = { FieldName: sv, Rel: 'And' };
                }
                var v = searchValues[sv];
                if (v) {
                    vvs[name]['Values'] = [v];
                }
            }
        }
        var result = [];
        for (var s in vvs) {
            if (vvs[s].Values) {
                result.push(vvs[s]);
            }
        }
        this.fireEvent('search', result.length > 0 ? result : null, true);
    },
    initComponent: function() {
        if (this.searchItems && this.columnWidth <= 0) {
            if (this.searchItems.length < 6) {
                this.columnWidth = 0.5;
            } else {
                this.columnWidth = 1 / 3;
            }
        }
        Ext.apply(this, { items: this.makeItems() });
        this.callParent(arguments);
    }
});
Ext.define('sef.core.components.bar.TreeSearchBar', {
    extend: Ext.toolbar.Toolbar,
    xtype: 'sef-treesearchbar',
    cls: 'sef-treesearchbar',
    layout: { type: 'vbox', align: 'stretch' },
    config: { enableKeySearch: true, rangeSearchType: 'datefield', enableRefresh: true, keyName: 'Key', rangeName: 'Range' },
    onSearch: function() {
        var d = {};
        var f = this.down('#textSearch');
        if (f) {
            d[this.keyName] = f.getValue();
        }
        f = this.down('#rangeSearch');
        if (f) {
            d[this.rangeName] = f.getValue();
        }
        this.fireEvent('treesearch', d);
    },
    onRefresh: function() {
        this.fireEvent('treesearch', true);
    },
    initComponent: function() {
        var me = this,
            items = [];
        if (this.enableKeySearch) {
            items.push({ xtype: 'textfield', emptyText: _('关键字搜索'), margin: '0 8px 5px 0', itemId: 'textSearch' });
        }
        if (this.rangeSearchType) {
            items.push({ xtype: 'sef-rangefield', rtype: this.rangeSearchType, margin: '0 8px 5px 0', itemId: 'rangeSearch' });
        }
        var btns = {
            xtype: 'container',
            layout: { type: 'hbox', align: 'stretch', pack: 'end' },
            items: [{
                xtype: 'button',
                btnType: 'primary',
                text: _('搜索'),
                handler: function() {
                    me.onSearch();
                }
            }]
        };
        if (this.enableRefresh) {
            btns.items.push({
                xtype: 'button',
                btnType: 'flat',
                text: _('刷新'),
                margin: '0 0 0 10px',
                handler: function() {
                    me.onRefresh();
                }
            });
        }
        items.push(btns);
        Ext.apply(this, { items: items });
        this.callParent(arguments);
    }
});
Ext.define('sef.core.components.button.ActionButton', {
    extend: Ext.button.Button,
    xtype: 'sef-actionbutton',
    hidden: true,
    config: { btnType: 'default', limit: true, actionName: '', dataAction: false, dataActionName: '', alignCn: true },
    initComponent: function(cfg) {
        var _bind = null;
        if (this.config.bind) {
            _bind = Ext.merge({}, this.config.bind);
            this.config.bind = null;
            delete this.config.bind;
        }
        if (false) {}
        if (this.alignCn) {
            if (sef.utils.isCnText(this.text)) {
                var newText = Ext.String.trim(this.text);
                var source = this.text.split('');
                if (source.length === 2) {
                    newText = source.join('  ');
                } else {
                    if (source.length === 3) {}
                }
                newText = Ext.String.trim(newText);
                Ext.apply(this, { text: newText });
            }
        }
        if (this.limit === false) {
            this.hidden = false;
        }
        this.callParent(arguments);
        if (this.actionName && this.limit) {
            _bind = _bind || {};
            if (this.dataAction === true) {
                var action_expr = '{!(';
                if (this.dataActionName) {
                    action_expr += 'action_' + this.dataActionName + '_data_exist';
                } else {
                    action_expr += 'action_data_exist';
                }
                action_expr += ' \x26\x26 action_can_' + this.actionName + ')}';
                _bind['hidden'] = action_expr.toLowerCase();
            } else {
                _bind['hidden'] = '{!action_can_' + this.actionName.toLowerCase() + '}';
            }
            this.setBind(_bind);
        }
    }
});
Ext.define('sef.core.components.form.AbstractDynamicFormPanel', {
    extend: Ext.form.Panel,
    scrollable: 'y',
    bodyPadding: '0 10px 20px 10px',
    config: {},
    initComponent: function() {
        return this.callParent(arguments);
    }
});
Ext.define('sef.core.components.form.BoolCombo', {
    extend: Ext.form.field.ComboBox,
    xtype: 'sef-boolcombo',
    editable: false,
    config: { trueText: 'True', falseText: 'False', trueValue: true, falseValue: false },
    initComponent: function() {
        var data = [];
        data.push({ text: this.trueText, value: this.trueValue });
        data.push({ text: this.falseText, value: this.falseValue });
        Ext.apply(this, { displayField: 'text', valueField: 'value', store: Ext.create('Ext.data.Store', { fields: ['text', 'value'], data: data }) });
        this.callParent(arguments);
    }
});
Ext.define('sef.core.components.form.BoolRadioGroup', {
    extend: Ext.form.RadioGroup,
    xtype: 'sef-boolradiogroup',
    simpleValue: true,
    config: { trueText: 'True', falseText: 'False', trueValue: true, falseValue: false },
    initComponent: function() {
        var data = [];
        data.push({ boxLabel: this.trueText, inputValue: this.trueValue, name: this.name });
        data.push({ boxLabel: this.falseText, inputValue: this.falseValue, name: this.name });
        Ext.apply(this, { items: data });
        this.callParent(arguments);
    }
});
Ext.define('sef.core.interfaces.IFieldDisplayModeChange', {
    changeDisplayMode: function(newMode) {}
});
Ext.define('sef.core.components.form.ComplexProjectForm', {
    extend: Ext.container.Container,
    xtype: 'sef-complexprojectform',
    mixins: [sef.core.interfaces.IFieldDisplayModeChange],
    cls: 'sef-complexprojectform',
    config: {
        contextMenuAddText: '添加项目',
        contextMenuEditCodeText: '修改项目号',
        contextMenuRemoveText: '删除项目',
        contextMenuEditCodePromptText: '输入新的项目号',

        contextMenuLoadParamText: '查看参数',
        contextMenuLoadBlockText: '查看块',
        contextMenuCalcParamText: '计算参数',
        contextMenuNonstdParamText: '非标参数',
        contextMenuValidParamText: '校验参数',
        contextMenuMarkDrawText: '生成图纸',
        contextMenuDownDrawText: '下载图纸',
        contextMenuReDesignText: '重新设计',

        navTreeStoreIsLocal: true,
        navTreeUrl: '',
        navTreeCommonNodeText: '合同信息',
        projectCodePrefix: 'L',
        enableContextMenu: true,
        addUrl: '',
        changeCodeUrl: '',
        removeUrl: '',
        resultProperty: 'Result',
        contextMenuType : 'default'
    },
    privates: { _id: 0, _contextMenu: null, _menuStore: null, _formCard: null, _oriData: {}, _editMode: null, _formLoaded: false },
    changeDisplayMode: function(newMode) {
        this._editMode = newMode;
        this.updateEditMode();
    },
    updateEditMode: function() {
        if (this._formLoaded !== true) {
            return;
        }
        if (this._editMode === null || this._editMode === undefined) {
            return;
        }
        var me = this,
            forms = me.query('sef-formpanel');
        forms.forEach(function(f) {
            f.switchMode(me._editMode);
        });
    },
    showTreeContextMenu: function(rec, evt) {
        var me = this;
        if (!this._contextMenu) {
            this._contextMenu = Ext.create('Ext.menu.Menu', {
                items: this.makeTreeContextMenuItems(),
                listeners: {
                    click: function (menu, item) {
                        switch (item.itemId) {
                            case 'contextMenuAdd':
                                me.addProject(item);
                                break;
                            case 'contextMenuRemove':
                                me.removeProject(item);
                                break;
                            case 'contextMenuEdit':
                                me.editProjectCode(item);
                                break;
                            case 'contextMenuLoadParam':
                                me.loadParam(item);
                                break;
                            case 'contextMenuLoadBlock':
                                me.loadBlock(item);
                                break;
                            case 'contextMenuCalcParam':
                                me.calcParam(item);
                                break;
                            case 'contextMenuNonstdParam':
                                me.nonstdParam(item);
                                break;
                            case 'contextMenuValidParam':
                                me.validParam(item);
                                break;
                            case 'contextMenuMarkDraw':
                                me.markDraw(item);
                                break;
                            case 'contextMenuDownDraw':
                                me.downDraw(item);
                                break;
                            case 'contextMenuReDesign':
                                me.reDesign(item);
                                break;
                        }
                    }
                }
            });
        }
        evt.stopEvent();
        var section = rec.data['section'];
        var data = rec.get('Data');
        var validOp = section || data;

        this._contextMenu.items.items.forEach(function (f) {
            if (f.itemId != 'contextMenuAdd' && f.itemId != 'contextMenuReDesign') {
                f.setDisabled(!validOp);
            }
            f.sectionCode = section || data;
        });
        this._contextMenu.showAt(evt.getXY());
    },
    makeTreeContextMenuItems: function () {
        var items = [];
        if (this.contextMenuType === 'default') {
            items = [{
                text: this.contextMenuAddText,
                itemId: 'contextMenuAdd'
            }, {
                text: this.contextMenuRemoveText,
                itemId: 'contextMenuRemove'
            }, '-', {
                text: this.contextMenuEditCodeText,
                itemId: 'contextMenuEdit'
            }, '-', {
                text: this.contextMenuDownDrawText,
                itemId: 'contextMenuDownDraw'
            }];
        } else if (this.contextMenuType === 'design') {
            items = [{
                text: this.contextMenuLoadParamText,
                itemId: 'contextMenuLoadParam'
            }, {
                text: this.contextMenuLoadBlockText,
                itemId: 'contextMenuLoadBlock'
            }, '-', {
                text: this.contextMenuCalcParamText,
                itemId: 'contextMenuCalcParam'
            }, {
                text: this.contextMenuNonstdParamText,
                itemId: 'contextMenuNonstdParam'
            }, {
                text: this.contextMenuValidParamText,
                itemId: 'contextMenuValidParam'
            }, '-', {
                text: this.contextMenuMarkDrawText,
                itemId: 'contextMenuMarkDraw'
            }, {
                text: this.contextMenuDownDrawText,
                itemId: 'contextMenuDownDraw'
            }, '-', {
                text: this.contextMenuReDesignText,
                itemId: 'contextMenuReDesign'
            }];
        }
        return items;
    },
    addProject: function(item) {
        var me = this,
            lastCode = 0;
        this._menuStore.each(function(r) {
            var code = r.get('Data') || r.get('data');
            if (!code) {
                return;
            }
            var reg = new RegExp('^' + me.projectCodePrefix + '(\\d{1,3})$');
            if (reg.test(code)) {
                var ms = reg.exec(code)[1];
                var n = parseInt(ms);
                if (n > lastCode) {
                    lastCode = n;
                }
            }
        });
        lastCode++;
        var newCode = me.projectCodePrefix + lastCode;
        me.internalAddProject(item.sectionCode, newCode);
    },
    internalAddProject: function(sectionCode, code) {
        var me = this;
        this.mask('loading...');
        this._formLoaded = false;
        sef.utils.ajax({
            url: this.addUrl,
            method: 'POST',
            jsonData: { ID: me._id, Code: code, ParentCode: sectionCode, Action: 'New' },
            success: function(result, resp) {
                var result = resp[me.resultProperty];
                me.loadData(result, true);
                me.selectTreeNode(code);
                me.switchCardView(code);
                me._formLoaded = true;
                me.unmask();
            },
            failure: function(err, resp) {
                me.unmask();
                sef.dialog.error(err.message);
                console.log('failure#', err, cb);
            }
        });
    },
    removeProject: function(item) {
        var me = this,
            code = item.sectionCode;
        sef.dialog.confirm('确认删除[' + code + ']', null, function() {
            me.internalRemoveProject(code);
        });
    },
    internalRemoveProject: function(code) {
        var me = this,
            rec = this._menuStore.findRecord('Data', code);
        if (this._oriData[code]) {
            this.mask('loading...');
            sef.utils.ajax({
                url: me.removeUrl,
                method: 'POST',
                jsonData: { ID: me._id, Code: code, Action: 'Remove' },
                success: function(result, resp) {
                    var result = resp[me.resultProperty];
                    me.loadData(result, true);
                    me.selectTreeNode();
                    me._formLoaded = true;
                    me.updateEditMode();
                    me.unmask();
                },
                failure: function(err, resp) {
                    me.unmask();
                    sef.dialog.error(err.message);
                    console.log('failure#', err, cb);
                }
            });
        }
    },
    editProjectCode: function(item) {
        var me = this;
        var oldCode = item.sectionCode;
        sef.dialog.mprompt(this.contextMenuEditCodePromptText, null, function(v) {
            if (v === oldCode) {
                return;
            }
            me.internalEditCode(oldCode, v);
        }, null, oldCode);
    },
    internalEditCode: function(code, newCode) {
        var me = this;
        this._formLoaded = false;
        this.mask('loading...');
        sef.utils.ajax({
            url: me.changeCodeUrl,
            method: 'POST',
            jsonData: { ID: me._id, OldCode: code, NewCode: newCode, Action: 'EditCode' },
            success: function(result, resp) {
                var result = resp[me.resultProperty];
                me.loadData(result, true);
                me.selectTreeNode();
                me._formLoaded = true;
                me.updateEditMode();
                me.unmask();
            },
            failure: function(err, resp) {
                me.unmask();
                sef.dialog.error(err.message);
                console.log('failure#', err, cb);
            }
        });
    },

    loadParam: function (item) {
        var me = this,
            code = item.sectionCode;

        if (Ext.isFunction(this.onLoadParam)) {
            this.onLoadParam.call(this, this, this._id, code);
        }
    },

    loadBlock: function (item) {
        var me = this,
            code = item.sectionCode;

        if (Ext.isFunction(this.onLoadBlock)) {
            this.onLoadBlock.call(this, this, this._id, code);
        }
    },

    calcParam: function (item) {
        var me = this,
            code = item.sectionCode;
        sef.dialog.confirm('确认计算梯号[' + code + ']参数信息?', null, function () {
            if (Ext.isFunction(me.onCalcParam)) {
                me.onCalcParam.call(me, me, me._id, code);
            }
        });
    },

    nonstdParam: function (item) {
        var me = this,
            code = item.sectionCode;
        sef.dialog.confirm('确认计算梯号[' + code + ']非标信息?', null, function () {
            if (Ext.isFunction(me.onNonstdParam)) {
                me.onNonstdParam.call(me, me, me._id, code);
            }
        });
    },

    validParam: function (item) {
        var me = this,
            code = item.sectionCode;
        sef.dialog.confirm('确认计算梯号[' + code + ']校验信息?', null, function () {
            if (Ext.isFunction(me.onValidParam)) {
                me.onValidParam.call(me, me, me._id, code);
            }
        });
    },

    markDraw: function (item) {
        var me = this,
            code = item.sectionCode;
        sef.dialog.confirm('确认生成梯号[' + code + ']图纸?', null, function () {
            if (Ext.isFunction(me.onMarkDraw)) {
                me.onMarkDraw.call(me, me, me._id, code);
            }
        });
    },

    downDraw: function (item) {
        var me = this,
            code = item.sectionCode;
        me.onDownDraw.call(me, me, me._id, code);
    },

    reDesign: function (item) {
        var me = this,
            code = item.sectionCode;
        var msg = '确认梯号[' + code + ']重新设计?';
        if (!code) {
            msg = '确认选择梯号重新设计?';
        }
        sef.dialog.confirm(msg, null, function () {
            if (Ext.isFunction(me.onReDesign)) {
                me.onReDesign.call(me, me, me._id, code);
            }
        });
    },
    makeTree: function() {
        var me = this;
        var tree = {
            xtype: 'sef-pagetree',
            itemId: 'menuTree',
            title: false,
            collapsible: false,
            iconCls: null,
            width: 150,
            cls: 'sef-pagetree-timeline',
            listeners: {
                'rowcontextmenu': function(tree, record, tr, rowIndex, e, eOpts) {
                    if (me.enableContextMenu === true) {
                        me.showTreeContextMenu(record, e);
                    }
                },
                'beforeitemexpand': function(node) {
                    return me.processTreeNodeExpand(node);
                },
                'itemclick': function(tree, record) {
                    me.processTreeItemClick(record);
                }
            }
        };
        if (this.navTreeStoreIsLocal === true) {
            Ext.apply(tree, { store: Ext.create('Ext.data.TreeStore', { model: 'sef.core.model.TreeModel', proxy: { type: 'memory' } }) });
        } else {
            tree['url'] = this.navTreeUrl;
        }
        return tree;
    },
    processTreeNodeExpand: function(treeNode) {},
    processTreeItemClick: function(rec) {
        var code = rec.data['section'];
        var sectionIndex = rec.data['sectionIndex'];
        if (code) {
            this.switchViewSection(code, sectionIndex);
        } else {
            code = rec.get('Data');
            if (code) {
                this.switchCardView(code);
            }
        }
        if (code) {
            if (Ext.isFunction(this.onTreeNodeClick)) {
                this.onTreeNodeClick.call(this, rec, code);
            }
            this.updateTip(code, rec.data);
            this.selectCode = code;
        }
    },
    trackContainerScroll: function(x, y) {},
    switchViewSection: function(section, index) {
        this.switchCardView(section);
        return;
        var c = Ext.fly('subtitle_L1_2');
        var cc = this.down('#card_L1').getEl();
        c.scrollIntoView(cc);
    },
    switchCardView: function(code) {
        var cardId = 'card_' + code;
        var form = this._formCard.down('#' + cardId);
        if (form) {
            this._formCard.getLayout().setActiveItem(form);
        }
    },
    makeCommonItems: function(items, data) {
        if (!Ext.isArray(items)) {
            items = [items];
        }
        var cf = this.down('#commonForm');
        cf.removeAll();
        cf.add(items);
        cf.editMode = undefined;
        if (data) {
            this._oriData['common'] = data;
            this.down('#commonForm').getForm().setValues(data);
        }
    },
    makeFormContent: function() {
        var me = this;
        return { xtype: 'container', flex: 1, itemId: 'formCard', layout: { type: 'card', deferredRender: true } };
    },
    updateTip: function(code, rec) {
        this.down('#commonForm').setTitle('\x3cdiv class\x3d"text"\x3e合同信息\x26nbsp;\x26nbsp;(当前选择[' + code + ']\x3c/div\x3e');
        return;
        this.down('#headerSubTitle').setData({ title: this.navTreeCommonNodeText + '\x26nbsp;\x26nbsp;(当前选择[' + code + '])' });
    },
    makeContent: function() {
        return { xtype: 'container', cls: 'sef-main-content', flex: 1, layout: { type: 'vbox', align: 'stretch' }, items: [{ xtype: 'sef-formpanel', itemId: 'commonForm', formCode: 'common', defaults: { columnWidth: 0.25 }, collapsible: true, collapsed: true, ui: 'sefu-formpanel-coll', title: '\x3cdiv class\x3d"text"\x3e合同信息\x3c/div\x3e' }, this.makeFormContent()] };
    },
    updateMenuData: function(menus) {
        if (!menus) {
            return;
        }
        if (!Ext.isArray(menus)) {
            menus = [menus];
        }
        menus = Ext.Array.insert(menus, 0, [{ Text: this.navTreeCommonNodeText, Leaf: true }]);
        var rootCfg = { expanded: true, children: menus };
        this._menuStore.setRoot(rootCfg);
    },
    selectTreeNode: function(code) {
        var rec = null;
        if (!code) {
            rec = this._menuStore.getAt(1);
            if (rec) {
                code = rec.get('Data');
            }
        } else {
            rec = this._menuStore.findRecord('Data', code);
        }
        if (rec) {
            this.updateTip(code, rec.data);
            this.selectCode = code;
            this.down('#menuTree').setSelection(rec.getChildAt(0));
            if (Ext.isFunction(this.onTreeNodeClick)) {
                this.onTreeNodeClick.call(this, rec, code);
            }
        }
    },
    loadData: function(result, reload) {
        var me = this;
        me.mask('loading...');
        var ts = +new Date;
        this.suspendLayout = true;
        this._formLoaded = false;
        var id = result.ID;
        if (reload === true) {
            this._menuStore.getRoot().removeAll(false);
            var allF = this.query('sef-formpanel');
            var fids = [];
            allF.forEach(function(f) {
                if (!f.formCode) {
                    return;
                }
                if (f.formCode === 'common') {
                    return;
                }
                f.destroy();
                f = null;
                delete f;
            });
        }
        this._id = id;
        var menus = [];
        var items = result.Children;
        if (items.length == 0) {
            items.push({ Code: this.projectCodePrefix + '1', DataStatus: false, DataMsg: '' });
        }
        Ext.each(items, function(item) {
            menus.push({ Text: item.Code, Data: item.Code, DataID: item.ID, DataStatus: item.DataStatus, DataMsg: item.ErrorMsg });
        });
        this.updateMenuData(menus);
        var common_params = result.CommonParams;
        var common_layout = Ext.isString(result.CommonLayout) ? Ext.JSON.decode(result.CommonLayout) : result.CommonLayout;
        if (common_layout) {
            me.makeCommonItems(common_layout.Layout, common_params);
        }
        var param_layout = Ext.isString(result.ParamLayout) ? Ext.JSON.decode(result.ParamLayout) : result.ParamLayout;
        if (param_layout && items) {
            Ext.each(items, function(item) {
                me.updateSectionLayout(item, param_layout.Layout);
                me.updateFormData(item, item.Params);
                me.bindFormBlurEvent(item);
            });
        }
        me.selectTreeNode();
        me._formLoaded = true;
        me.updateEditMode();
        this.suspendLayout = false;
        this.updateLayout();
        me.unmask();
        //var ets = +new Date;
        //console.log('ComplexProjectForm.render times#', ets - ts);
    },
    updateSectionLayout: function(item, lc) {
        if (!lc) {
            return;
        }
        var me = this;
        var items = [];
        var groups = [];
        var code = item.Code;
        lc.forEach(function(l, index) {
            groups.push({ section: code, sectionIndex: index, text: l.Group, leaf: true, Text: l.Group, DataStatus: item.DataStatus, DataMsg: item.ErrorMsg, Leaf: true });
            items.push({ xtype: 'sef-subtitle', title: l.Group, itemId: 'subtitle_' + code + '_' + index, id: 'subtitle_' + code + '_' + index, columnWidth: 1 });
            items = Ext.Array.merge(items, l.Items);
        });
        var rec = this._menuStore.findRecord('Data', code);
        if (rec) {
            rec.appendChild(groups, true, true);
            rec.expand();
        }
        var cardId = 'card_' + code;
        var form = this._formCard.down('#' + cardId);
        if (form) {
            form.destroy();
            form = null;
            delete from;
        }
        if (!form) {
            this._formCard.add({ xtype: 'sef-formpanel', formCode: code, editMode: undefined, recId: item.ID, itemId: cardId, defaults: { columnWidth: 0.25 }, items: items });
        }
    },
    updateFormData: function(item, data) {
        var code = item.Code;
        this._oriData = this._oriData || {};
        this._oriData[code] = data;
        var cardId = 'card_' + code;
        var form = this._formCard.down('#' + cardId);
        if (form) {
            form.getForm().setValues(data);
            var floorfield = form.down('sef-floorfield');
            if (floorfield) {
                var tfloors = [];
                item.Floors.forEach(function(f) {
                    tfloors.push(f.FloorCode);
                });
                var index = 0;
                var tdatas = [];
                item.Floors.forEach(function(f) {
                    tdatas.push({ Index: index++, Floor: f.FloorCode, Value: f.FloorHeight, Door: f.FloorDoor });
                });
                floorfield.makeFloors({ floors: tfloors, floorData: tdatas });
            }
        }
    },
    updateCommonData: function () { },

    bindFormBlurEvent: function (item) {
        var me = this;
        var code = item.Code;
        var cardId = 'card_' + code;
        var form = this._formCard.down('#' + cardId);
        if (form) {
            form.items.items.forEach(function (f) {
                if (f.changeData) {
                    f.on('change', function (me, newValue, oldValue) {
                        if (newValue != oldValue) {
                            me.dataChanged = true;
                        } else {
                            me.dataChanged = false;
                        }
                    });
                    f.on('blur', function (field) {
                        if (field.dataChanged && Ext.isFunction(me.onFormFieldBlur)) {
                            me.onFormFieldBlur.call(field, field, form, code);
                            field.dataChanged = false;
                        }
                    });
                }
            });
        }
    },

    getValue: function() {
        var me = this,
            forms = this.query('sef-formpanel');
        var allValues = [];
        forms.forEach(function(f) {
            var v = f.getValues();
            var modified = [];
            var toChangeValues = {};
            var ov = me._oriData[f.formCode];
            if (ov) {
                for (fv in v) {
                    if (Ext.isArray(v[fv])) {
                        v[fv] = v[fv].join('');
                    }
                    if (v[fv] !== ov[fv]) {
                        modified.push(fv);
                        toChangeValues[fv] = v[fv];
                    }
                }
            } else {
                toChangeValues = v;
                for (fv in v) {
                    modified.push(fv);
                }
            }
            allValues.push({ Code: f.formCode, Values: v, Modified: modified });
        });
        return allValues;
    },
    setValue: function(code, v) {
        this.updateFormData(code, v);
    },
    initComponent: function() {
        Ext.apply(this, { layout: { type: 'hbox', align: 'stretch' }, items: [this.makeTree(), this.makeContent()] });
        this.callParent(arguments);
        var me = this;
        this.on('afterlayout', function() {
            me.mask('loading...');
            console.log('for layout doing...');
        }, null, { single: true });
        if (!this._menuStore) {
            this._menuStore = this.down('#menuTree').getStore();
        }
        this._formCard = this.down('#formCard');
        if (false && window.SEF_LIB_CFG.env === 'te') {
            var me = this;
            var reTs = 0;
            this.on('beforerender', function() {
                me.reTs = +new Date;
                console.log('complexprojectform.beforerender', me.reTs);
            });
            this.on('afterrender', function() {
                var t = +new Date;
                console.log('complexprojectform.afterrender', t, t - me.reTs + 'ms');
            });
        }
    },
    onDestroy: function() {
        this.callParent(arguments);
        if (this._contextMenu) {
            this._contextMenu.destroy();
        }
    }
});
Ext.define('sef.core.components.form.EnumCombo', {
    extend: Ext.form.field.ComboBox,
    xtype: 'sef-enumcombo',
    editable: false,
    config: { enumType: '' },
    initComponent: function() {
        var types = this.enumType.split(',');
        var enumName = types[0];
        enumName = enumName.replace(/\./g, '_');
        var data = window.sef_static_data[enumName];
        Ext.apply(this, { displayField: 'Text', valueField: 'Value', store: Ext.create('Ext.data.Store', { fields: ['Text', 'Value'], data: data }) });
        this.callParent(arguments);
    }
});
Ext.define('sef.core.components.form.FixedCombo', {
    extend: Ext.form.field.ComboBox,
    xtype: 'sef-fixedcombo',
    editable: false,
    config: { values: [''] },
    initComponent: function() {
        var data = [];
        this.values.forEach(function(f) {
            data.push({ Text: f, Value: f });
        });
        Ext.apply(this, { displayField: 'Text', valueField: 'Value', store: Ext.create('Ext.data.Store', { fields: ['Text', 'Value'], data: data }) });
        this.callParent(arguments);
    }
});
Ext.define('sef.core.components.form.FloorField', {
    extend: Ext.container.Container,
    xtype: 'sef-floorfield',
    mixins: [sef.core.interfaces.IFieldDisplayModeChange],
    cls: 'sef-floorfield',
    config: { fieldLabel: _('详细楼层'), updateButtonText: _('更新'), floorCount: 1, floorStart: -1, floorHeight: 2700, floorDoor: '', colSize: 3, floors: null, floorData: [] },
    privates: { _editMode: null },
    changeDisplayMode: function(newMode) {
        this._editMode = newMode;
        this.updateEditMode();
    },
    updateEditMode: function() {
        if (this._editMode === null || this._editMode === undefined) {
            return;
        }
        var me = this,
            forms = me.query('sef-formpanel');
    },
    makeSigleFloor: function(opt) {
        var cls = 'single-floor ';
        var colSize = opt.colSize || 2;
        var no = opt.no || opt.index;
        var index = opt.index;
        if (opt.index % colSize !== 0) {
            cls += 'inner-cell ';
        }
        if (opt.index < colSize) {
            cls += 'first-row ';
        }
        var sf = {
            xtype: 'fieldcontainer',
            itemId: 'floor_fc_' + no,
            floorNo: no,
            cls: cls,
            layout: 'hbox',
            columnWidth: 1 / colSize,
            items: [{ xtype: 'textfield', cls: 'floor', hideTrigger: true, value: no, width: 40, itemId: 'floor_' + no, name: 'NF' + index }, { xtype: 'box', cls: 'floor-text', html: 'F' }, { xtype: 'numberfield', cls: 'floor-value', hideTrigger: true, width: 60, value: 2700, itemId: 'floorvalue_' + no, name: 'DBFLR' + index }, { xtype: 'box', cls: 'floor-text', html: 'mm' }, {
                xtype: 'checkboxgroup',
                cls: 'floor-option',
                itemId: 'flooroption_' + no,
                items: [{
                    boxLabel: '前门',
                    name: 'FRD' + index,
                    inputValue: '前门有',
                    getSubmitValue: function() {
                        if (this.checked) {
                            return '前门有';
                        } else {
                            return '前门无';
                        }
                    }
                }, {
                    boxLabel: '后门',
                    name: 'FRD' + index,
                    inputValue: '后门有',
                    getSubmitValue: function() {
                        if (this.checked) {
                            return '后门有';
                        } else {
                            return '后门无';
                        }
                    }
                }],
                _flex: 1
            }]
        };
        return sf;
    },
    makeFloors: function(opt) {
        opt = opt || {};
        var me = this;
        var floors = opt.floors || this.floors;
        var data = opt.floorData || this.floorData;
        var count = opt.floorCount || this.floorCount;
        var height = opt.floorHeight || this.floorHeight;
        var door = opt.floorDoor || this.floorDoor;
        var start = opt.floorStart || this.floorStart;
        var colSize = opt.colSize || this.colSize;
        if (!floors) {
            floors = [];
            data = [];
            var index = 0;
            for (var i = 0; i < count; i++) {
                if (start + i === 0) {
                    count++;
                    continue;
                }
                floors.push(start + i);
                data.push({ Index: index++, Floor: start + i, Value: height, Door: door });
            }
        }
        var me = this,
            items = [];
        floors.forEach(function(f, index) {
            var opt = { index: index, count: floors.length, no: f, colSize: colSize };
            items.push(me.makeSigleFloor(opt));
        });
        this.suspendLayout = true;
        var fc = this.query('fieldcontainer');
        fc.forEach(function(f) {
            if (f.floorNo) {
                f.destroy();
                f = null;
                delete f;
            }
        });
        this.add(items);
        this.setValue(data);
        this.suspendLayout = false;
        this.updateLayout();
    },
    getFloorValue: function(fc) {
        var code = fc.floorNo;
        var newCode = fc.down('#floor_' + code).getValue();
        var fvalue = fc.down('#floorvalue_' + code).getValue();
        var fopt = fc.down('#flooroption_' + code).getValue();
        var door = fopt.Door || null;
        if (!Ext.isArray(door)) {
            door = [door];
        }
        var doorValue = '';
        if (door.length == 2) {
            doorValue = '前门有后门有';
        } else {
            if (door.length == 0) {
                doorValue = '前门无后门无';
            } else {
                if (door.length == 1) {
                    if (door[0] == 1) {
                        doorValue = '前门有后门无';
                    } else {
                        doorValue = '前门无后门有';
                    }
                }
            }
        }
        return { Code: code, NewCode: newCode, Value: fvalue, Door: doorValue };
    },
    getValue: function() {
        var me = this,
            fc = this.query('fieldcontainer');
        var values = [];
        fc.forEach(function(f) {
            if (f.floorNo) {
                values.push(me.getFloorValue(f));
            }
        });
        return values;
    },
    setValue: function(v) {
        this.reset();
        if (!v) {
            return;
        }
        if (!Ext.isArray(v)) {
            v = [v];
        }
        var me = this;
        v.forEach(function(fv) {
            me.setFloorValue(fv);
        });
    },
    setFloorValue: function(v) {
        var code = v.Floor;
        var value = v.Value;
        var door = v.Door;
        var index = v.Index;
        var f = this.down('#floor_' + code);
        var fvalue = this.down('#floorvalue_' + code);
        var fopt = this.down('#flooroption_' + code);
        var ds = [];
        if (door == '前门有后门无') {
            ds.push('前门有');
        } else {
            if (door == '前门无后门有') {
                ds.push('后门有');
            } else {
                if (door == '前门有后门有') {
                    ds.push('前门有');
                    ds.push('后门有');
                }
            }
        }
        f.setValue(code);
        fvalue.setValue(value);
        var str = '{FRD' + index + ':[]}';
        var v = Ext.JSON.decode(str);
        v['FRD' + index] = ds;
        fopt.setValue(v);
    },
    reset: function() {
        var me = this,
            fc = this.query('fieldcontainer');
        var values = [];
        fc.forEach(function(f) {
            if (!f.floorNo) {
                return;
            }
            var code = f.floorNo;
            var fvalue = me.down('#floorvalue_' + code);
            var fopt = me.down('#flooroption_' + code);
            fvalue.reset();
            fopt.reset();
        });
    },
    makeHeader: function() {
        return { xtype: 'container', columnWidth: 1, layout: { type: 'hbox', align: 'stretch', pack: 'start' }, items: [{ xtype: 'box', cls: 'sef-fieldlabel', html: this.fieldLabel }, { xtype: 'box', flex: 1 }, { limit: false, actionName: 'updatefloor', xtype: 'sef-actionbutton', text: this.updateButtonText }] };
    },
    initComponent: function() {
        Ext.apply(this, { padding: '10 0 0 0', layout: 'column', items: [this.makeHeader()] });
        this.callParent(arguments);
        this.makeFloors();
    }
});
Ext.define('sef.core.components.form.FormPanel', {
    extend: Ext.form.Panel,
    xtype: 'sef-formpanel',
    scrollable: 'y',
    bodyPadding: '0 10px 20px 10px',
    cls: 'sef-formpanel',
    layout: 'column',
    defaults: { columnWidth: 0.333333, margin: '0 10px 5px 10px', xtype: 'textfield', labelAlign: 'top', labelSeparator: '' },
    defaultExcludeForViewMode: 'sef-datagridfield,',
    excludeForViewMode: '',
    config: { editMode: undefined },
    updateRecord: function(rec) {
        var f = this.callParent(arguments);
        if (rec) {
            var fields = rec.getFields();
            fields.forEach(function(f) {
                if (f.stype === 'asso') {
                    var name = f.name + (window.SEF_LIB_CFG.assoFieldSplitChar || '') + 'ID';
                    var fsv = rec.get(f.name);
                    var fv = 0;
                    if (fsv) {
                        if (Ext.isObject(fsv)) {
                            fv = fsv['ID'];
                        } else {
                            fv = fsv;
                        }
                    }
                    rec.set(name, fv);
                }
            });
        }
        return f;
    },
    makeTBar: function() {
        return null;
    },
    makeBackButton: function() {
        return { xtype: 'sef-actionbutton', btnType: 'flat', iconCls: 'x-fa fa-arrow-left', tooltip: _('返回'), actionName: 'back' };
    },
    makeRecButtons: function() {
        var bars = [{ xtype: 'label', hidden: true, bind: { html: '{curRecIndex+1}/{totalRec}', hidden: '{!rec_label}' } }];
        bars.push({ xtype: 'sef-actionbutton', disabled: true, btnType: 'flat', tooltip: _('上一条'), actionName: 'rec_prev', iconCls: 'x-fa fa-angle-left', bind: { disabled: '{!rec_prev}' } });
        bars.push({ xtype: 'sef-actionbutton', btnType: 'flat', disabled: true, actionName: 'rec_next', tooltip: _('下一条'), iconCls: 'x-fa fa-angle-right', bind: { disabled: '{!rec_next}' } });
        return bars;
    },
    makeContent: function() {
        var dfts = Ext.merge({}, this.defaults);
        Ext.applyIf(dfts, { columnWidth: 0.333333, margin: '0 10px 5px 10px', xtype: 'textfield', labelAlign: 'top' });
        var c = { defaults: dfts };
        return c;
    },
    setFieldDisplayMode: function(field, mode) {
        var me = this,
            ftype = field.xtype;
        if (me.defaultExcludeForViewMode.indexOf(ftype + ',') >= 0) {
            return;
        }
        if (me.excludeForViewMode.indexOf(ftype + ',') >= 0) {
            return;
        }
        if (Ext.isFunction(field.changeDisplayMode)) {
            field.changeDisplayMode(mode);
            return;
        }
        if (field instanceof Ext.form.FieldContainer) {
            field.items.each(function(f) {
                me.setFieldDisplayMode(f, mode);
            });
            return;
        }
        if (!(field instanceof Ext.form.field.Base)) {
            return;
        }
        if (mode === 1) {
            if (field._lastDisabled === true) {
                field.setDisabled(true);
            } else {
                field.setDisabled(false);
            }
        } else {
            field._lastDisabled = field.disabled;
            field.setDisabled(true);
        }
    },
    switchMode: function(newMode) {
        if (this.editMode === false) {
            return;
        }
        if (newMode === this.editMode) {
            return;
        }
        var me = this,
            items = this.items;
        items.each(function(field, index) {
            me.setFieldDisplayMode(field, newMode);
        });
        if (newMode === 0) {
            this.addCls('sef-form-onlyview');
        } else {
            this.removeCls('sef-form-onlyview');
        }
        if (Ext.isFunction(this.onViewModeChange)) {
            this.onViewModeChange.call(this, this.editMode, newMode);
        }
        this.editMode = newMode;
    },
    makeDynamicContent: function(content, withGroup) {
        this.removeAll(true);
        this.add(content);
    },
    initComponent: function() {
        var tbar = this.makeTBar();
        if (tbar) {
            Ext.apply(this, { tbar: tbar });
        }
        Ext.apply(this, this.makeContent());
        this.on('formsuccess', function(form, rec, result) {
            if (Ext.isFunction(this.onAfterSave)) {
                this.onAfterSave.call(this, rec, result);
            }
        });
        this.callParent(arguments);
    }
});
Ext.define('sef.core.components.form.FormViewModel', {
    extend: Ext.app.ViewModel,
    alias: 'viewmodel.sefv-form',
    data: {
        action_data_exist: false,
        action_can_save: window.____DEBUG___ === true,
        action_can_copy: window.____DEBUG___ === true,
        action_can_delete: window.____DEBUG___ === true,
        action_can_edit: window.____DEBUG___ === true,
        action_can_copy: window.____DEBUG___ === true,
        action_can_print: window.____DEBUG___ === true,
        action_can_rec_next: window.____DEBUG___ === true,
        action_can_rec_prev: window.____DEBUG___ ===
            true,
        action_can_back: window.____DEBUG___ === true,
        curRecIndex: 0,
        totalRec: 0
    },
    formulas: {
        rec_label: function(get) {
            var ci = get('curRecIndex');
            var t = get('totalRec');
            return ci >= 0 && t > 0;
        },
        rec_prev: function(get) {
            var ci = get('curRecIndex');
            return ci > 0;
        },
        rec_next: function(get) {
            var ci = get('curRecIndex');
            var t = get('totalRec');
            return ci < t - 1;
        }
    }
});
Ext.define('sef.core.components.form.LookupField', {
    extend: Ext.form.field.Text,
    xtype: 'sef-lookupfield',
    mixins: [Ext.util.StoreHolder],
    editable: false,
    _dialog: null,
    _rawValue: null,
    config: { simpleValue: false, displayField: '', valueField: 'ID', quickSearch: null, columns: null, autoLoad: true, store: null },
    triggers: { clear: { cls: 'x-fa fa-times', hidden: true, handler: 'onClearClick', scope: 'this', weight: 0 }, search: { weight: 10, cls: 'x-fa fa-filter', handler: 'onSearchClick', scope: 'this' } },
    onClearClick: function() {
        var me = this;
        me.getTrigger('clear').hide();
        me.setValue('');
        me._rawValue = null;
        me.updateLayout();
        me.fireEvent('quicksearch', me.getValue());
    },
    onSearchClick: function() {
        var me = this;
        if (!this._dialog) {
            this._dialog = Ext.create('sef.core.components.window.LookupDialog', { closeAction: 'hide', quickSearch: this.quickSearch, store: me.store, columns: me.columns });
            this._dialog.on('dialogclose', function(state, result) {
                if (result.Result) {
                    var rec = result.Result[0];
                    var disp = rec.get(this.displayField);
                    var v = rec.get(this.valueField);
                    this._rawValue = v;
                    this.setValue(disp);
                    this.getTrigger('clear').show();
                } else {}
                this.updateLayout();
            }, me);
        }
        this._dialog.show();
    },
    getValue: function() {
        return this._rawValue;
    },
    setValue: function(v) {
        if (!v) {
            this._rawValue = 0;
            return;
        }
        if (!Ext.isObject(v) && this.simpleValue === true) {
            var tv = {};
            tv[this.valueField] = v;
            tv[this.displayField] = v;
            v = tv;
        }
        if (Ext.isObject(v)) {
            this._rawValue = v[this.valueField];
            return this.callParent([v[this.displayField]]);
        }
        return this.callParent([v]);
    },
    initComponent: function() {
        this.callParent(arguments);
        var me = this;
        me.on('specialkey', function(f, e) {
            if (e.getKey() == e.ENTER) {
                me.onSearchClick();
            }
        });
        this.bindStore(this.store, true);
        if (this.store) {
            this.store.setAutoLoad(this.autoLoad);
        }
    },
    onDestroy: function() {
        this.unbindStoreListeners(this.store);
        this.store.destroy();
        if (this._dialog) {
            this._dialog.destroy();
            this._dialog = null;
            delete this._dialog;
        }
        this.callParent(arguments);
    }
});
Ext.define('sef.core.components.form.ParamCombo', {
    extend: Ext.form.field.ComboBox,
    xtype: 'sef-paramcombo',
    editable: true,
    config: { url: '/GetParamOption', modelName: 'sef.app.liftnext.design.ParamModel', modelCode: null },
    listeners: {
        'expand': function(me) {
            var form = me.up('sef-formpanel');
            var ctl = form.down('#Model');
            if (ctl) {
                var id = form.recId;
                var model = ctl.getValue();
                if (!this.modelCode) {
                    this.modelCode = model;
                }
                this.store.jsonData = { ProjectItemID: id, ModelCode: model, ParamCode: me.name };
                var values = form.getForm().getValues();
                for (v in values) {
                    if (Ext.isArray(values[v])) {
                        values[v] = values[v].join('');
                    }
                }
                this.store.jsonData = Ext.merge(this.store.jsonData, values);
                this.store.reload();
                this.modelCode = model;
            }
        }
    },
    initComponent: function() {
        var me = this;
        Ext.apply(this, { displayField: 'Text', valueField: 'Text', store: { type: 'sef-store', autoLoad: false, url: me.url, model: me.modelName } });
        this.callParent(arguments);
    }
});
Ext.define('sef.core.components.form.ParamDynamicFormPanel', {
    extend: Ext.container.Container,
    xtype: 'sef-paramformpanel',
    layout: 'border',
    autoHeight: true,
    cls: 'sef-paramformpanel',
    __scrollByMenu: false,
    __catagoryMenu: null,
    __catagroySize: 0,
    config: { url: '' },
    trackContainerScroll: function(x, y) {
        if (this.__scrollByMenu === true) {
            this.__scrollByMenu = false;
            return;
        }
        var prefixName = 'subtitle_' + this.id + '_';
        var firstY, partIndex = -1;
        var p = this.down('#' + prefixName + '0'),
            el = p.getEl();
        var elB = el.getHeight();
        if (y <= elB) {
            partIndex = 0;
        } else {
            firstY = el.getBottom();
            partIndex = -1;
            for (var i = 1; i < this.__catagroySize; i++) {
                p = this.down('#' + prefixName + i);
                el = p.getEl();
                elB = el.getBottom();
                if (y + firstY <= elB) {
                    partIndex = i;
                    break;
                }
            }
            if (partIndex < 0) {
                partIndex = this.__catagroySize - 1;
            }
        }
        this.updateMenuStore(partIndex);
    },
    updateMenuStore: function(index) {
        if (this.__catagoryMenu === null) {
            this.__catagoryMenu = this.down('#catagoryMenu');
        }
        var me = this;
        this.__catagoryMenu.getStore().each(function(rec, ri) {
            var lc = rec.get('lastColor');
            if (!lc) {
                lc = 'gray';
            }
            if (lc === 'checked') {
                lc = 'gray';
            }
            if (index === ri) {
                rec.set('lastColor', rec.get('color'));
                rec.set('color', 'checked');
            } else {
                rec.set('color', lc);
            }
        });
    },
    scrollToPart: function(index) {
        this.__scrollByMenu = true;
        var prefixName = 'subtitle_' + this.id + '_';
        var dom = Ext.fly(prefixName + index);
        var id = this.down('#formpanel-container').id;
        var formDomId = Ext.get(id + '-innerCt');
        var c = this.down('#formpanel-container').getEl();
        dom.scrollIntoView(c, null, true);
        this.updateMenuStore(index);
    },
    loadForm: function() {
        var me = this;
        sef.utils.ajax({
            url: this.url,
            method: 'GET',
            success: function(result, resp) {
                me.makeFormContent(result);
            },
            failure: function(err, resp) {}
        });
    },
    getValue: function() {
        return this.getForm().getValues();
    },
    setValues: function(v) {
        return this.getForm().setValues(v);
    },
    getForm: function() {
        return this.down('#formpanel');
    },
    makeFormContent: function(result) {
        var catagory = [];
        var formResult = [];
        if (!Ext.isArray(result)) {
            return;
        }
        var me = this;
        result.forEach(function(grp, index) {
            catagory.push({ text: grp.Group, index: index, color: index === 0 ? 'checked' : 'gray' });
            grp.Index = index;
            formResult.push({ xtype: 'sef-subtitle', title: grp.Group, itemId: 'subtitle_' + me.id + '_' + index, id: 'subtitle_' + me.id + '_' + index, columnWidth: 1 });
            formResult = Ext.Array.merge(formResult, grp.Items);
        });
        this.__catagroySize = catagory.length;
        this.down('#catagoryMenu').fillData(catagory);
        this.down('#formpanel').makeDynamicContent(formResult);
        return;
        var items = [];
        result.forEach(function(grp, index) {
            items.push({ xtype: 'sef-subtitle', title: grp.Group, itemId: 'subtitle_' + me.id + '_' + index, id: 'subtitle_' + me.id + '_' + index });
            items.push({ xtype: 'box', height: 400, html: 'here is grp#' + grp.Group });
        });
        this.down('#formpanel-container').items.get(0).add(items);
    },
    makeItems: function() {
        var me = this;
        var form = { xtype: 'sef-formpanel', itemId: 'formpanel', padding: 0, scrollable: false, columnWidth: 1 };
        var fc = {
            itemId: 'formpanel-container',
            xtype: 'container',
            region: 'center',
            padding: '0 0 0 20px',
            layout: 'column',
            scrollable: 'y',
            items: form,
            onScrollEnd: function(x, y) {
                me.trackContainerScroll(x, y);
            }
        };
        return [{
            xtype: 'sef-timeline',
            itemId: 'catagoryMenu',
            region: 'west',
            listeners: {
                'itemclick': function(v, rec, item, index) {
                    me.scrollToPart(index);
                }
            }
        }, fc];
    },
    initComponent: function() {
        Ext.apply(this, { items: this.makeItems() });
        this.callParent(arguments);
        this.loadForm();
    },
    beforeRender: function() {
        this.st = +new Date;
        console.log('will beforrender', this.st);
        this.callParent(arguments);
    },
    afterRender: function() {
        this.callParent(arguments);
        console.log('will after beforrender', +new Date);
        var diff = +new Date - this.st;
        console.log('rending ts:', diff);
    }
});
Ext.define('sef.core.components.form.RangeField', {
    extend: Ext.form.FieldContainer,
    mixins: [Ext.form.field.Field],
    xtype: 'sef-rangefield',
    cls: 'sef-rangefield',
    config: { rtype: 'textfield', rname: '' },
    layout: { type: 'hbox', align: 'middle' },
    getValue: function() {
        var v = [this.down('#r1').getValue(), this.down('#r2').getValue()];
        if (v[0] && v[1]) {} else {
            v = null;
        }
        this.value = v;
        return v;
    },
    initComponent: function() {
        var items = [];
        items.push({ itemId: 'r1', name: this.rname ? this.rname + '_r1' : '', xtype: this.rtype, flex: 1 });
        items.push({ xtype: 'label', cls: 'splitter', padding: '0 2px 0 2px', text: '-' });
        items.push({ itemId: 'r2', name: this.rname ? this.rname + '_r2' : '', xtype: this.rtype, flex: 1 });
        Ext.apply(this, { items: items });
        this.callParent(arguments);
    }
});
Ext.define('sef.core.components.form.SearchField', {
    extend: Ext.form.field.Text,
    xtype: 'sef-searchfield',
    cls: 'sef-searchfield',
    emptyText: 'search',
    triggers: { clear: { cls: 'x-fa fa-times', hidden: true, handler: 'onClearClick', scope: 'this', weight: 0, tooltip: _('清除搜索条件') }, search: { weight: 10, cls: 'x-fa fa-search', handler: 'onSearchClick', scope: 'this', tooltip: _('快速查询') }, filter: { weight: 20, hidden: true, cls: 'x-fa fa-filter', handler: 'onShowAdvSearch', scope: 'this', tooltip: _('高级搜索') } },
    privates: { _dialog: null },
    config: { model: null, quickSearch: ['Name'], advSearch: ['Code', 'Name', 'Customer', 'ContractNo', 'UploadDate', { name: 'test11111', fieldLabel: 'for test', xtype: 'numberfield' }], allowCustomSearch: true, dialogWidth: 600, dialogHeight: 400 },
    onClearClick: function() {
        var me = this;
        me.getTrigger('clear').hide();
        me.setValue('');
        me.updateLayout();
        me.fireEvent('quicksearch', me.getValue());
        me.fireEvent('search', me.getValue());
    },
    onSearchClick: function() {
        var me = this;
        me.getTrigger('clear').show();
        me.updateLayout();
        me.fireEvent('quicksearch', me.getValue(), false);
        me.fireEvent('search', me.getValue(), false);
    },
    onShowAdvSearch: function() {
        var me = this;
        if (!this._dialog) {
            this._dialog = Ext.create('sef.core.components.window.AdvSearchDialog', { width: this.dialogWidth, height: this.dialogHeight, closeAction: 'hide', model: this.model, advSearch: this.advSearch, allowCustomSearch: this.allowCustomSearch });
            this._dialog.on('dialogclose', function(state, result) {
                this.fireEvent('search', result.length > 0 ? result : null, true);
            }, me);
        }
        this._dialog.show();
    },
    initComponent: function() {
        this.callParent(arguments);
        var me = this;
        me.on('specialkey', function(f, e) {
            if (e.getKey() == e.ENTER) {
                me.onSearchClick();
            }
        });
        if (me.advSearch) {
            me.getTrigger('filter').show();
            me.updateLayout();
        }
    },
    onDestroy: function() {
        if (this._dialog) {
            this._dialog.destroy();
            this._dialog = null;
            delete this._dialog;
        }
        return this.callParent(arguments);
    }
});
Ext.define('sef.core.components.grid.DataGrid', {
    extend: Ext.grid.Panel,
    xtype: 'sef-datagrid',
    config: { showIDCol: false, model: null, dataExist: '', showCheckbox: true, showPaging: true, showSummary: false, maskOnStoreLoading: true, displayMsg: '{0} - {1} of {2}', showPageSizeSwitcher: true, quickSearchInPaging: false, quickSearchFields: null, bindStoreAtInit: false, showRowNumber: true, colConfig: null, keepFilterForRefresh: false, rowediting: false },
    makePagingBar: function() {
        return { xtype: 'sef-gridpagingbar', showPageSizeSwitcher: this.showPageSizeSwitcher, keepFilterForRefresh: this.keepFilterForRefresh, displayMsg: this.displayMsg, quickSearchInPaging: this.quickSearchInPaging, quickSearchFields: this.quickSearchFields };
    },
    makeFeatures: function() {
        var features = [];
        if (this.showSummary) {
            features.push({ ftype: 'summary' });
        }
        if (features) {
            return features;
        }
        return null;
    },
    onRowEditDone: function(editor, context, opts) {},
    makePlugins: function() {
        var me = this,
            plugins = [];
        if (this.rowediting === true) {
            plugins.push({ ptype: 'rowediting', clicksToMoveEditor: 1, autoCancel: false, listeners: { scope: me, 'edit': me.onRowEditDone } });
        }
        if (plugins) {
            return plugins;
        }
        return null;
    },
    makeTBar: function() {
        return null;
    },
    makeCols: function() {
        var me = this,
            modelMeta = null;
        var model = null;
        if (this.store) {
            if (this.store.getModel) {
                model = this.store.getModel();
            } else {
                model = this.store.model;
            }
        } else {
            model = this.model;
        }
        if (model) {
            modelMeta = sef.utils.getModelMeta(model);
        } else {
            throw 'Grid必须定义store或者model';
        }
        var cols = [];
        if (this.columns) {
            this.columns.forEach(function(c, i) {
                if (Ext.isString(c)) {
                    var mc = Ext.Array.findBy(modelMeta, function(mm) {
                        return mm.name === c;
                    });
                    if (mc) {
                        cols.push(mc);
                    } else {
                        cols.push({ name: c, text: c, dataIndex: c });
                    }
                } else {
                    cols.push(Ext.merge({}, c));
                }
            });
        } else {
            modelMeta.forEach(function(mm, i) {
                if (mm.invisible !== true) {
                    if (mm.name === 'ID') {
                        if (me.showIDCol === true) {
                            cols.push(mm);
                        }
                    } else {
                        cols.push(mm);
                    }
                }
            });
        }
        cols.forEach(function(c) {
            Ext.applyIf(c, { menuDisabled: true, align: 'left', dataIndex: c['name'] });
        });
        if (this.colConfig) {
            this.colConfig.forEach(function(cc) {
                var sc = Ext.Array.findBy(cols, function(c) {
                    return c.name === cc.name;
                });
                if (sc) {
                    Ext.apply(sc, cc);
                } else {
                    var newCC = Ext.merge({}, cc);
                    Ext.applyIf(newCC, { index: 100, menuDisabled: true, align: 'left' });
                    cols.push(newCC);
                }
            });
        }
        cols = Ext.Array.sort(cols, function(c1, c2) {
            return c1.index > c2.index ? 1 : 0;
        });
        if (this.showRowNumber) {
            return [{ xtype: 'rownumberer', width: 50 }].concat(cols);
        }
        return cols;
    },
    makeGrid: function() {
        var gridConfig = { viewConfig: { enableTextSelection: true, stripeRows: false, deferEmptyText: false, loadMask: false, markDirty: false, emptyText: sef.runningCfg.get('GridEmptyText') }, columns: this.makeCols(), plugins: this.makePlugins(), features: this.makeFeatures(), tbar: this.makeTBar(), bbar: this.showPaging == true ? this.makePagingBar() : null };
        if (this.showCheckbox) {
            gridConfig['selModel'] = { type: 'checkboxmodel', checkOnly: true };
        }
        return gridConfig;
    },
    dataSelectionChange: function(selected) {
        var vm = this.getViewModel();
        if (vm) {
            var canShow = selected.length > 0;
            var vd = {};
            if (this.dataExist === 'name') {
                vd['action_' + this.name.toLowerCase() + '_data_exist'] = canShow;
            } else {
                if (this.dataExist !== false) {
                    vd['action_data_exist'] = canShow;
                }
            }
            vm.setData(vd);
        }
    },
    onRowDblClick: function(selected, rec) {},
    attachStoreEvent: function() {
        if (!this.store) {
            return;
        }
        var me = this;
        this.store.on('load', function() {
            me.maskOnStoreLoading && me.unmask();
        });
        if (me.maskOnStoreLoading) {
            this.store.on('beforeload', function(s) {
                me.mask();
            });
        }
    },
    getSelectionIDs: function() {
        var sel = this.getSelection();
        if (!sel) {
            return [];
        }
        return sel.map(function(r) {
            return r.get('ID');
        });
    },
    initComponent: function() {
        Ext.apply(this, this.makeGrid());
        this.callParent(arguments);
        var me = this;
        this.on('selectionchange', function(grid, selected, eOpts) {
            me.dataSelectionChange(selected);
            grid.getStore().Selected = selected;
        });
        this.on('rowdblclick', function(grid, rec) {
            me.onRowDblClick(grid.getSelection(), rec);
        });
        this.attachStoreEvent();
    }
});
Ext.define('sef.core.components.grid.DataGridField', {
    extend: sef.core.components.grid.DataGrid,
    mixins: [Ext.form.field.Field],
    xtype: 'sef-datagridfield',
    ui: 'sefu-dgfield',
    controller: 'sefc-dgctrl',
    iconCls: 'x-fa fa-table',
    quickSearchInPaging: true,
    showPageSizeSwitcher: false,
    border: true,
    minHeight: 300,
    dataExist: 'name',
    config: { rawTitle: false, ignoreDefaultFilter: false, assoField: null, bars: null, editor: null, dbClickToEdit: true },
    viewModel: { data: {} },
    hidden: true,
    privates: {
        _title: null,
        _iconCls: null,
        _rawValue: 0,
        DEFAULT_BUTTONS: { 'ADD': { iconCls: 'x-fa fa-plus', actionName: 'create', tooltip: _('添加') }, 'DELETE': { iconCls: 'x-fa fa-minus', actionName: 'delete', dataAction: true, tooltip: _('删除') }, 'EDIT': { iconCls: 'x-fa fa-pencil', actionName: 'edit', dataAction: true, tooltip: _('修改') } }
    },
    setValue: function(v) {
        var lv = this._rawValue;
        if (Ext.isNumber(v) && v > 0) {
            this._rawValue = v;
        } else {
            this._rawValue = 0;
        }
        if (lv != this._rawValue) {
            this.setHidden(this._rawValue < 1);
            this.updateLayout();
            if (this._rawValue > 0) {
                this.store.load();
            }
        }
    },
    getValue: function() {
        return this._rawValue;
    },
    makeTBar: function() {
        var me = this,
            _bars = [];
        if (this._title) {
            _bars.push({ xtype: 'tbtext', cls: 'sef-grid-title', html: '\x3cspan class\x3d"' + this._iconCls + '"\x3e\x3c/span\x3e' + this._title });
            _bars.push('-\x3e');
        }
        if (this.bars) {
            var abars = ['-'];
            this.bars.forEach(function(b) {
                var newB = {};
                if (Ext.isString(b)) {
                    newB = Ext.merge({}, me.DEFAULT_BUTTONS[b] || {});
                } else {
                    newB = Ext.merge({}, b);
                }
                if (newB.actionName) {
                    newB.actionName = me.name + '_' + newB.actionName;
                }
                Ext.applyIf(newB, { xtype: 'sef-actionbutton', dataAction: false, btnType: 'link', dataActionName: me.name });
                newB['isChild'] = true;
                abars.push(newB);
            });
            _bars = _bars.concat(abars);
        }
        return _bars;
    },
    onRowDblClick: function(selected, rec) {
        this.callParent(arguments);
        if (this.dbClickToEdit !== true) {
            return;
        }
        this.controller && this.controller.edit__execute(rec.id);
    },
    reload: function() {
        this.getStore().reload();
    },
    refresh: function() {
        var fReload = this.getStore().getFilters().length < 1;
        this.getStore().clearFilter();
        if (fReload) {
            this.getStore().reload();
        }
    },
    initComponent: function() {
        if (this.rawTitle !== true) {
            if (this.title || this.config.title) {
                this._title = this.title || this.config.title;
                delete this.title;
                delete this.config.title;
            }
            if (this.iconCls || this.config.iconCls) {
                this._iconCls = this.config.iconCls || this.iconCls;
                delete this.iconCls;
                delete this.config.iconCls;
            }
        }
        this.callParent(arguments);
        var me = this;
        var _additionFilterFn = this.getStore().additionFilterFn;
        this.getStore().additionFilterFn = function() {
            var q = null;
            if (Ext.isFunction(_additionFilterFn)) {
                q = _additionFilterFn.call(me, me, me.getStore());
            }
            if (this.ignoreDefaultFilter !== true) {
                if (!q) {
                    q = [];
                } else {
                    if (!Ext.isArray(q)) {
                        q = [q];
                    }
                }
                q.push({ FieldName: me.assoField, Values: [me.getValue()], Rel: 'And' });
            }
            return q;
        };
    }
});
Ext.define('sef.core.components.grid.DataGridFieldCtrl', {
    extend: Ext.app.ViewController,
    alias: 'controller.sefc-dgctrl',
    privates: {},
    control: { 'sef-actionbutton': { 'click': 'onActionButtonClick' }, '#': { beforeDestroy: 'onFieldBeforeDestroy' } },
    onActionButtonClick: function(btn) {
        var command = btn.command || btn.actionName;
        this.onExecuteCommand(command, btn);
    },
    onExecuteCommand: function(command, btn) {
        if (this.fireViewEvent('childcommand', command, btn) === false) {
            return false;
        }
        var cmdHandlerName = command.toLowerCase() + '__execute';
        var fn = this.view[cmdHandlerName];
        if (Ext.isFunction(fn)) {
            if (fn.call(this.view, btn) === false) {
                return;
            }
        }
        fn = this[cmdHandlerName];
        if (Ext.isFunction(fn)) {
            if (fn.call(this, btn) === false) {
                return;
            }
        }
        cmdHandlerName = cmdHandlerName.replace(this.view.name.toLowerCase() + '_', '');
        fn = this.view[cmdHandlerName];
        if (Ext.isFunction(fn)) {
            if (fn.call(this.view, btn) === false) {
                return;
            }
        }
        fn = this[cmdHandlerName];
        if (Ext.isFunction(fn)) {
            if (fn.call(this, btn) === false) {
                return;
            }
        }
    },
    create__execute: function() {
        if (!this.view.editor) {
            return;
        }
        var cfg = Ext.merge({}, this.view.editor);
        this.showEditDialog(cfg);
        return false;
    },
    edit__execute: function(id) {
        if (!this.view.editor) {
            return;
        }
        var cfg = Ext.merge({}, this.view.editor);
        var selId = 0;
        if (Ext.isNumber(id)) {
            selId = id;
        } else {
            selId = this.view.getSelectionIDs()[0];
        }
        cfg['recID'] = selId;
        this.showEditDialog(cfg);
        return;
    },
    showEditDialog: function(cfg) {
        Ext.applyIf(cfg, { store: this.view.store, assoField: this.view.assoField, assoFieldID: this.view.getValue() });
        var me = this,
            dialog = Ext.create('sef.core.components.window.EditorDialog', cfg);
        dialog.on('dialogclose', function(state, result) {
            if (state === 0) {
                me.view.store && me.view.store.reload();
            }
        });
        dialog.show();
    },
    internalDelete: function() {
        var selIds = this.view.getSelectionIDs();
        var me = this,
            url = '';
        if (this.view.delUrl) {
            url = this.view.delUrl;
        } else {
            url = this.view.store.getProxy().getUrl();
            if (!/\/$/.test(url)) {
                url += '/';
            }
            url += 'delete';
        }
        sef.utils.ajax({
            url: url,
            method: 'POST',
            jsonData: { IDS: selIds },
            scope: me,
            success: function(result) {
                me.view.store.reload();
            },
            failure: function(err, resp) {
                sef.dialog.error(err.message);
            }
        });
    },
    delete__execute: function(btn) {
        var me = this,
            selIds = this.view.getSelectionIDs();
        if (selIds) {
            sef.dialog.confirm(_('确认删除选中的数据?'), '', function() {
                me.internalDelete();
                if (Ext.isFunction(me.view.onAfterDelete)) {
                    me.view.onAfterDelete.call(me.view, selIds);
                }
            });
            return false;
        }
    },
    onFieldBeforeDestroy: function() {
        if (this._dialog) {
            this._dialog.destroy();
            this._dialog = null;
            delete this._dialog;
        }
    }
});
Ext.define('sef.core.components.grid.DataGridViewTable', {
    extend: Ext.view.Table,
    xtype: 'sef-datagrid-view',
    initComponent: function() {
        return this.callParent(arguments);
    }
});
Ext.define('sef.core.interfaces.IDialogContent', {
    _dialog: null,
    _dialogResult: null,
    initDialog: function(ptype) {
        if (!ptype) {
            ptype = 'sef-basedialog';
        }
        this._dialog = this.up(ptype);
        if (this._dialog) {
            var me = this;
            this._dialog.on('willclosedialog', function(d, result) {
                var r = me.makeDialogResult();
                if (!r) {
                    return false;
                }
                result = Ext.apply(result, r);
            });
        }
    },
    setDialogLoading: function(loading, cancelable) {
        if (this._dialog) {
            this._dialog.setDialogLoading(loading, cancelable);
        }
    },
    makeDialogResult: function() {
        return { Result: 1 };
    },
    closeDialog: function(status, result) {
        this._dialog && this._dialog.fireEvent('dialogcontentclose', status, result);
    }
});
Ext.define('sef.core.components.grid.EditorDataGrid', {
    extend: sef.core.components.grid.DataGrid,
    mixins: [sef.core.interfaces.IDialogContent],
    xtype: 'sef-editordatagrid',
    layout: 'fit',
    showPageSizeSwitcher: false,
    displayMsg: false,
    quickSearchFields: null,
    config: { autoReload: true, rowEditable: false },
    onRowDblClick: function(selected, rec) {
        if (this.rowEditable === true) {} else {
            this.closeDialog(true, { Result: [rec] });
        }
    },
    makeDialogResult: function() {
        var selected = this.getSelection();
        return { Result: selected };
    },
    onRowEditDone: function(editor, context, opts) {
        this.callParent(arguments);
        if (this.autoSave !== true) {
            return;
        }
        var me = this,
            rec = context.record;
        if (rec.dirty) {
            var me = this;
            this.store.sync({
                scope: me,
                success: function(batch) {
                    if (me.autoReload === true) {
                        me.getStore().reload();
                    }
                    return;
                    var exResult = batch.proxy.getReader().exResult || {};
                    var id = exResult['ID'];
                    if (Ext.isNumber(id)) {
                        this.view.setRecID(id);
                    }
                    sef.message.success(_('保存成功'));
                    this.fireViewEvent('formsuccess', this.view._rec, exResult);
                },
                failure: function(batch) {
                    var err = sef.utils.formatError(batch);
                    sef.dialog.error(err.message);
                }
            });
        }
    },
    initComponent: function() {
        if (this.rowEditable === true) {
            Ext.apply(this, { rowediting: true });
        }
        this.callParent(arguments);
        this.initDialog();
    }
});
Ext.define('sef.core.components.grid.LookupDataGrid', {
    extend: sef.core.components.grid.DataGrid,
    mixins: [sef.core.interfaces.IDialogContent],
    xtype: 'sef-lookupdatagrid',
    layout: 'fit',
    showPageSizeSwitcher: false,
    displayMsg: false,
    quickSearchFields: null,
    onRowDblClick: function(selected) {
        this.closeDialog(true, { Result: selected });
    },
    makeDialogResult: function() {
        var selected = this.getSelection();
        return { Result: selected };
    },
    initComponent: function() {
        this.callParent(arguments);
        this.initDialog();
    }
});
Ext.define('sef.core.interfaces.IAppPage', {
    _routes: null,
    onPageReady: Ext.emptyFn,
    beforeReady: function() {
        var me = this;
        if (!this.store) {
            this.store = Ext.getStore(me._pid + '_store');
        }
    },
    afterReady: function() {},
    setStamp: function(v) {
        this.stampCls = v;
        if (!this.controller) {
            return;
        }
        if (this.stampCls) {
            this.controller.makeStamp();
        } else {
            this.controller.clearStamp();
        }
    },
    setStampMessage: function(v) {
        this.controller && this.controller.setStampMessage(v);
    },
    updateRoute: function(routeObj) {
        var isChange = false;
        if (this._routes != routeObj) {
            isChange = true;
        } else {
            if (this._routes && routeObj) {
                isChange = this._routes.str !== routeObj.str;
            }
        }
        this._routes = routeObj;
        if (isChange) {
            this.onRouteChange(this._routes);
        }
    },
    updatePermission: function(p) {
        if (!p) {
            return;
        }
        var vm = this.getViewModel();
        if (!vm) {
            return;
        }
        var newP = {};
        for (var pp in p) {
            var newPP = 'action_can_' + pp;
            newP[newPP] = p[pp];
        }
        vm.setData(newP);
        newP = null;
        delete newP;
    },
    onRouteChange: function(route) {}
});
Ext.define('sef.core.components.page.FormPage', {
    extend: sef.core.components.form.FormPanel,
    mixins: [sef.core.interfaces.IAppPage],
    xtype: 'sef-formpage',
    controller: 'sefc-formpagectrl',
    config: { showMode: 'default', assoField: null, assoFieldID: 0, recID: 0, recPID: 0, bars: null, listPageName: 'list', canBack: true, canNavRec: true, enableViewMode: true },
    privates: { _rec: null, _recIndex: -1, _recTotal: 0 },
    applyRecID: function(id) {
        if (Ext.isString(id)) {
            if (/^\d{1,}$/.test(id)) {
                id = eval(id);
            } else {
                id = 0;
            }
        }
        this.recID = id;
    },
    viewModel: 'sefv-form',
    makeTBar: function() {
        var bars = null;
        if (this.bars) {
            bars = this.bars.map(function(btn) {
                if (btn === '-') {
                    return btn;
                }
                var b = Ext.merge({}, btn);
                return b;
            });
        }
        var bar = { xtype: 'toolbar', cls: 'form-toolbar', items: bars };
        if (this.canBack) {
            bar.items.push('-');
            bar.items.push(this.makeBackButton());
        }
        if (this.canNavRec) {
            bar.items.push('-\x3e');
            bar.items = bar.items.concat(this.makeRecButtons());
        }
        return bar;
    },
    onRouteChange: function(route) {
        var rid = route.qObj['id'];
        if (rid) {
            if (/^\d{1,}$/.test(rid)) {
                rid = parseInt(rid);
            }
        } else {
            rid = 0;
        }
        this.setRecID(rid);
        this.switchRecord();
        if (this.enableViewMode) {
            if (rid > 0) {
                this.switchMode(0);
            } else {
                this.switchMode(1);
            }
        }
    },
    updateNavRecInfo: function() {
        this._recIndex = -1;
        this._recTotal = 0;
        this._recTotal = this.store && this.store.getCount();
        if (this._rec && this.store) {
            this._recIndex = this.store.indexOf(this._rec);
        }
        this.getViewModel().setData({ curRecIndex: this._recIndex, totalRec: this._recTotal, action_data_exist: this.recID > 0 });
    },
    loadRecordById: function(id) {
        this.reset();
        this.switchRecord(id);
    },
    switchRecord: function(id) {
        this.updateNavRecInfo();
        var newId = false;
        if (!Ext.isNumber(id)) {
            id = this.recID;
        } else {
            newId = true;
        }
        if (this._rec && this._rec.get('ID') === this.recID) {
            if (!newId) {
                if (this._rec.store) {
                    return;
                }
            }
        }
        if (id > 0) {
            if (!this.store) {
                this._rec = null;
                this.reset();
                this.updateFormRecordInfo();
                return;
            }
            var me = this,
                url = this.store.getProxy().getReadSingleUrl(id);
            sef.utils.ajax({
                url: url,
                method: 'POST',
                jsonData: { ID: id, include: me.include || me.store.include },
                scope: me,
                success: function(result, resp) {
                    var property = window.SEF_LIB_CFG.singleReadRootProperty || 'ResultList';
                    var data = resp[property];
                    if (data && Ext.isArray(data)) {
                        data = data[0];
                    }
                    if (!data) {
                        sef.dialog.error(_('未找到指定的数据') + '#' + id);
                        return;
                    }
                    this._rec = this.store && this.store.getById(this.recID);
                    if (!this._rec) {
                        console.error('尚未支持此操作(在store中不存在记录)');
                        return;
                    }
                    for (var f in data) {
                        this._rec.set(f, data[f]);
                    }
                    this._rec.commit(true);
                    this.updateFormRecordInfo();
                },
                failure: function(err, resp) {
                    sef.dialog.error(err.message);
                }
            });
        } else {
            this.reset();
            if (this.store) {
                var model = this.store.getModel();
                this._rec = new model;
            } else {
                if (this._rec) {
                    this._rec = null;
                }
            }
            this.updateFormRecordInfo();
        }
    },
    updateFormRecordInfo: function() {
        if (this._rec) {
            if (this.assoField) {
                this._rec.set(this.assoField, this.assoFieldID);
            }
            this.loadRecord(this._rec);
        }
        if (Ext.isFunction(this.onRecordChange)) {
            this.onRecordChange.call(this, this._rec);
        }
    },
    initComponent: function() {
        this.beforeReady();
        this.callParent(arguments);
        var tree = this.down('#formTree');
        if (tree) {
            tree.on('itemclick', function(tv, rec) {
                if (Ext.isFunction(this.onTreeItemClick)) {
                    this.onTreeItemClick.call(this, tree, rec);
                }
            }, this);
        }
        if (Ext.isFunction(this.onPageReady)) {
            this.onPageReady.call(this);
        }
        if (this.showMode === 'model') {
            this.switchRecord();
        }
    }
});
Ext.define('sef.core.components.page.PageCtrl', {
    extend: Ext.app.ViewController,
    alias: 'controller.sefc-pagectrl',
    control: { '#': { 'afterrender': 'onPageAfterRender', 'beforedestroy': 'onPageBeforeDestroy' }, '*': { 'childcommand': 'onChildCommand' }, 'sef-actionbutton': { 'click': 'onActionButtonClick' } },
    makeStamp: function() {
        if (!this.view.stampCls) {
            this.clearStamp();
            return;
        }
        if (this._stamplEl) {
            return;
        }
        var el = this.view.getEl();
        this._stamplEl = new Ext.dom.Element(document.createElement('div'));
        this._stamplEl.setCls(this.view.stampCls);
        this._stamplEl.appendTo(el);
    },
    setStampMessage: function(v) {
        if (!v) {
            if (this._stampMsgEl) {
                this._stampMsgEl.destroy();
                this._stampMsgEl = null;
                delete this._stampMsgEl;
            }
            return;
        }
        if (!this._stampMsgEl) {
            var el = this.view.getEl();
            this._stampMsgEl = new Ext.dom.Element(document.createElement('div'));
            this._stampMsgEl.appendTo(el);
        }
        var cls = 'sef-page-stamper ';
        if (v.type) {
            cls += v.type;
        } else {
            cls += ' error';
        }
        this._stampMsgEl.setCls(cls);
        var html = '\x3cstrong\x3e' + (v.title || _('错误提示')) + '\x3c/strong\x3e\x3cbr /\x3e' + v.text;
        this._stampMsgEl.setHtml(html);
        var t = v.top || 0;
        var s = {};
        if (t > 0) {
            s['top'] = t + 'px';
        }
        var r = v.right | 0;
        if (r > 0) {
            s['right'] = r + 'px';
        }
        this._stampMsgEl.setStyle(s);
        console.log(s, this._stampMsgEl);
    },
    clearStamp: function() {
        if (this._stamplEl) {
            this._stamplEl.destroy();
            this._stamplEl = null;
            delete this._stamplEl;
        }
    },
    onPageAfterRender: function() {
        this.makeStamp();
        if (Ext.isFunction(this.view.onPageUIReady)) {
            this.view.onPageUIReady(this.view);
        }
    },
    onPageBeforeDestroy: function() {
        this.clearStamp();
        this.setStampMessage(null);
    },
    onChildCommand: function(child, cmd, btn) {
        return this.onExecuteCommand(cmd, btn);
    },
    onActionButtonClick: function(btn) {
        if (btn.isChild === true) {
            return false;
        }
        var command = btn.command || btn.actionName;
        this.onExecuteCommand(command, btn);
    },
    onExecuteCommand: function(command, btn) {
        var cmdHandlerName = command.toLowerCase() + '__execute';
        var fn = this.view[cmdHandlerName];
        if (Ext.isFunction(fn)) {
            if (fn.call(this.view, btn) === false) {
                return false;
            }
        }
        fn = this[cmdHandlerName];
        if (Ext.isFunction(fn)) {
            if (fn.call(this, btn) === false) {
                return false;
            }
        }
        console.log('not found#', cmdHandlerName);
    },
    switchToPage: function(q) {
        var newHash = sef.utils.encodeHash(this.view._routes, q);
        this.redirectTo(newHash);
    }
});
Ext.define('sef.core.components.page.FormPageCtrl', {
    extend: sef.core.components.page.PageCtrl,
    alias: 'controller.sefc-formpagectrl',
    control: { '#': { 'rowdblclick': 'onRowDblClick' } },
    onRowDblClick: function(grid, rec) {
        this.switchToForm({ id: rec.get('ID') });
    },
    back__execute: function() {
        this.switchToList();
    },
    isCanSave: function() {
        if (Ext.isFunction(this.view.isCanSave)) {
            return this.view.isCanSave.call(this.view);
        }
        if (this.view.editMode === 0) {
            sef.message.warning(_('请先点击编辑按钮进行编辑'));
            return false;
        }
    },
    isCanSync: function() {
        if (Ext.isFunction(this.view.isCanSync)) {
            return this.view.isCanSync.call(this.view);
        }
        if (this.view.focusModifingField) {
            this.view._rec.set(this.view.focusModifingField, +new Date);
        }
        if (this.view.store.getModifiedRecords().length < 1) {
            sef.message.warning(_('数据没有更改，不需要保存'));
            return false;
        }
    },
    save__execute: function() {
        if (this.isCanSave() === false) {
            return;
        }
        var vf = this.view.hasInvalidField();
        if (vf) {
            sef.message.error(_('当前页面的输入项有错误，请检查'));
            return false;
        }
        if (this.view.recID < 1) {
            this.view.store.add(this.view._rec);
        }
        this.view.updateRecord(this.view._rec);
        if (this.isCanSync() === false) {
            return;
        }
        if (Ext.isFunction(this.view.onBeforeSave)) {
            var rs = this.view.store.getModifiedRecords();
            if (rs) {
                var r = rs[0];
                var data = r.data;
                var toChangingData = Ext.merge({}, data);
                var f = this.view.onBeforeSave.call(this.view, toChangingData);
                if (f === false) {
                    return;
                }
                for (var tcf in toChangingData) {
                    if (toChangingData[tcf] !== data[tcf]) {
                        r.set(tcf, toChangingData[tcf]);
                    }
                }
            } else {}
        }
        this.view.mask();
        var me = this;
        this.view.store.sync({
            scope: me,
            success: function(batch) {
                var exResult = batch.proxy.getReader().exResult || {};
                var id = exResult['ID'];
                if (Ext.isNumber(id)) {
                    this.view.setRecID(id);
                    this.view._rec.setId(id);
                }
                this.view.unmask();
                this.view.updateNavRecInfo();
                if (this.view.focusReloadOnSave === true) {}
                sef.message.success(_('保存成功'));
                this.fireViewEvent('formsuccess', this.view._rec, exResult);
            },
            failure: function(batch) {
                this.view.unmask();
                var err = sef.utils.formatError(batch);
                sef.dialog.error(err.message);
                if (this.view.recID < 1) {
                    this.view.store.remove(this.view._rec);
                }
            }
        });
    },
    internalDelete: function() {
        var me = this,
            url = '';
        if (this.view.delUrl) {
            url = this.view.delUrl;
        } else {
            url = this.view.store.getProxy().getUrl();
            if (!/\/$/.test(url)) {
                url += '/';
            }
            url += 'delete';
        }
        sef.utils.ajax({
            url: url,
            method: 'POST',
            jsonData: { ID: this.view.recID },
            scope: me,
            success: function(result) {
                this.view.recID = 0;
                sef.message.success(_('删除成功'));
                this.view._rec = null;
                this.view.store.load();
                this.rec_next__execute();
                this.fireViewEvent('formsuccess');
            },
            failure: function(err, resp) {
                sef.dialog.error(err.message);
            }
        });
    },
    delete__execute: function() {
        var me = this;
        if (this.view.recID > 0) {
            sef.dialog.confirm(_('确认删除选中的数据?'), '', function() {
                me.internalDelete();
            });
            return false;
        }
    },
    edit__execute: function() {
        if (this.view.recID > 0) {
            this.view.switchMode(1);
        }
    },
    print__execute: function() {
        var me = this,
            url = '';
        if (this.view.printUrl) {
            url = this.view.printUrl;
        } else {
            url = this.view.store.getProxy().getUrl();
            if (!/\/$/.test(url)) {
                url += '/';
            }
            url += 'print';
        }
        var dialog = Ext.create('sef.core.components.window.PrintDialog', { url: url });
        dialog.on('dialogclose', function(state, result) {});
        dialog.show();
    },
    rec_prev__execute: function() {
        if (!this.view.store) {
            return;
        }
        this.view.setRecID(0);
        var index = this.view._recIndex;
        index--;
        if (index < 0) {
            index = 0;
        }
        var r = this.view.store.getAt(index);
        if (r) {
            this.view.recID = r.get('ID');
        }
        this.view.switchRecord();
    },
    rec_next__execute: function() {
        if (!this.view.store) {
            return;
        }
        this.view.setRecID(0);
        var index = this.view._recIndex;
        index++;
        if (index >= this.view._recTotal) {
            index = 0;
        }
        var r = this.view.store.getAt(index);
        if (r) {
            this.view.setRecID(r.get('ID'));
        }
        this.view.switchRecord();
    },
    switchToList: function(q) {
        if (this.view.listPageName) {
            if (!q) {
                q = {};
            }
            Ext.applyIf(q, { viewname: this.view.listPageName });
            this.switchToPage(q);
            return false;
        }
    },
    init: function() {}
});
Ext.define('sef.core.components.page.ListPage', {
    extend: sef.core.components.grid.DataGrid,
    mixins: [sef.core.interfaces.IAppPage],
    xtype: 'sef-listpage',
    controller: 'sefc-listpagectrl',
    viewModel: { data: { action_data_exist: false } },
    config: { bars: null, enableRefresh: true, editPageName: 'form', dbClickToEdit: true, onShowingToReload: true, searchConfig: { flex: 0.5, quickSearch: null, advSearch: null } },
    makeTreeBar: function() {
        if (!this.tree) {
            return null;
        }
        var tree = Ext.merge({}, this.tree);
        Ext.applyIf(tree, { itemId: 'listTree', collapsible: false });
        Ext.apply(tree, { title: null, iconCls: null });
        return tree;
    },
    makeActionBars: function() {
        var me = this,
            bars = null;
        if (this.bars) {
            bars = this.bars.map(function(btn) {
                if (btn === '-') {
                    return btn;
                }
                var b = Ext.merge({}, btn);
                return b;
            });
        }
        if (bars) {
            if (this.enableRefresh) {
                bars.push(sef.runningCfg.BUTTONS.REFRESH);
            }
            if (this.searchConfig) {
                bars.push('-\x3e');
                bars.push({ xtype: 'sef-searchfield', flex: this.searchConfig.flex || 0.5, model: this.searchConfig.model || this.store.getModel(), advSearch: this.searchConfig.advSearch, quickSearch: this.searchConfig.quickSearch, allowCustomSearch: this.searchConfig.allowCustomSearch, listeners: { 'search': me.onSearch, scope: me } });
            }
            bars.forEach(function(b) {
                b.text = _(b.text);
            });
        }
        return { xtype: 'toolbar', items: bars };
    },
    makeSearchBar: function() {
        return null;
        var me = this;
        if (!this.searchConfig) {
            return null;
        }
        if (this.searchConfig.quickSearch || this.searchConfig.advSearch) {
            return { xtype: 'sef-searchbar', searchItems: me.searchConfig.advSearch, model: me.model || me.store.getModel(), columnWidth: me.searchConfig.columnWidth || 0, listeners: { 'search': me.onSearch, scope: me } };
        }
        return null;
    },
    makeTBar: function() {
        var bar = { xtype: 'container', layout: { type: 'vbox', align: 'stretch' }, items: [this.makeActionBars(), this.makeSearchBar()] };
        return bar;
    },
    onSearch: function(v, isAdvSearch) {
        if (!v) {
            var fReload = this.store.getFilters().length < 1;
            this.store.clearFilter();
            if (fReload) {
                this.store.reload();
            }
        } else {
            var isOr = false;
            if (Ext.isString(v)) {
                if (this.searchConfig.quickSearch) {
                    var vv = {};
                    var qf = this.searchConfig.quickSearch;
                    if (Ext.isString(this.searchConfig.quickSearch)) {
                        qf = [this.searchConfig.quickSearch];
                    }
                    qf.forEach(function(q) {
                        vv[q] = v;
                    });
                    isOr = true;
                    v = vv;
                } else {
                    console.error('没有定义快速搜索项');
                    throw 'Not define QuickSearch Config';
                }
                this.store.makeQuery(v, isOr);
            }
            if (isAdvSearch === true) {
                this.store.makeQuerys(v);
            }
        }
    },
    onRouteChange: function() {
        var isLoaded = this.getStore().isLoaded();
        if (this.onShowingToReload === true && isLoaded) {
            this.getStore().reload();
        }
    },
    initComponent: function() {
        this.beforeReady();
        Ext.apply(this, { lbar: this.makeTreeBar() });
        this.callParent(arguments);
        this.updatePermission({ read: true, edit: true, 'delete': true, refresh: true, create: true, 'export': true });
        if (Ext.isFunction(this.onPageReady)) {
            this.onPageReady.call(this);
        }
        var tree = this.down('#listTree');
        if (tree) {
            tree.on('itemclick', function(tv, rec) {
                if (Ext.isFunction(this.onTreeItemClick)) {
                    this.onTreeItemClick.call(this, tree, rec);
                }
            }, this);
        }
    }
});
Ext.define('sef.core.components.page.ListPageCtrl', {
    extend: sef.core.components.page.PageCtrl,
    alias: 'controller.sefc-listpagectrl',
    control: { '#': { 'rowdblclick': 'onRowDblClick' } },
    onRowDblClick: function(grid, rec) {
        this.switchToForm({ id: rec.get('ID') });
    },
    refresh__execute: function(btn) {
        if (this.view.store) {
            this.view.store.reload();
            return false;
        }
    },
    create__execute: function(btn) {
        this.switchToForm({ id: 0 });
    },
    edit__execute: function(btn) {
        var selIds = this.view.getSelectionIDs();
        if (selIds) {
            this.switchToForm({ id: selIds[0], ids: selIds.join(',') });
            return false;
        }
    },
    internalDelete: function() {
        var selIds = this.view.getSelectionIDs();
        var me = this,
            url = '';
        if (this.view.delUrl) {
            url = this.view.delUrl;
        } else {
            url = this.view.store.getProxy().getUrl();
            if (!/\/$/.test(url)) {
                url += '/';
            }
            url += 'delete';
        }
        sef.utils.ajax({
            url: url,
            method: 'POST',
            jsonData: { IDS: selIds },
            scope: me,
            success: function(result) {
                me.view.store.reload();
            },
            failure: function(err, resp) {
                sef.dialog.error(err.message);
            }
        });
    },
    delete__execute: function(btn) {
        var me = this,
            selIds = this.view.getSelectionIDs();
        if (selIds) {
            sef.dialog.confirm(_('确认删除选中的数据?'), '', function() {
                me.internalDelete();
            });
            return false;
        }
    },
    export__execute: function(btn) {
        var me = this,
            url = '';
        if (this.view.exportUrl) {
            url = this.view.exportUrl;
        } else {
            url = this.view.store.getProxy().getUrl();
            if (!/\/$/.test(url)) {
                url += '/';
            }
            url += 'export';
        }
        var dialog = Ext.create('sef.core.components.window.ExportDialog', { url: url, store: this.view.exportStore || this.view.store });
        dialog.on('dialogclose', function(state, result) {});
        dialog.show();
    },
    switchToForm: function(q) {
        if (this.view.editPageName) {
            if (!q) {
                q = {};
            }
            Ext.applyIf(q, { viewname: this.view.editPageName });
            this.switchToPage(q);
            return false;
        }
    },
    init: function() {}
});
Ext.define('sef.core.components.tree.MainMenuTree', { extend: Ext.tree.Panel, xtype: 'sef-mainmenutree', ui: 'sefu-mainmenutree', title: _('系统菜单'), iconCls: 'x-fa fa-bars', minWidth: 200, width: 250, collapsible: true, useArrows: true, border: true, rootVisible: false, titleCollapse: false });
Ext.define('sef.core.components.tree.PageTree', {
    extend: Ext.tree.Panel,
    xtype: 'sef-pagetree',
    ui: 'sefu-pagetree',
    title: _('系统菜单'),
    iconCls: 'x-fa fa-bars',
    minWidth: 200,
    width: 250,
    collapsible: true,
    useArrows: true,
    border: true,
    rootVisible: false,
    titleCollapse: false,
    autoLoad: true,
    viewConfig: { makeDirty: false, emptyText: _('没有数据'), deferEmptyText: false },
    config: { rootText: 'All', url: '', enableCheck: false, searchMode: '' },
    makeBar: function() {
        var me = this;
        if (!this.searchMode) {
            return null;
        }
        return { xtype: 'sef-treesearchbar', _items: ['a'] };
    },
    reload: function(withRoot) {
        var root = this.getRootNode();
        if (root) {
            root.removeAll(false);
            if (this.getStore().isLoaded() === true) {
                this.getStore().reload();
            } else {
                root.expand();
            }
        }
    },
    initComponent: function() {
        var me = this,
            _autoLoad = this.autoLoad;
        this.autoLoad = false;
        if (!this.store) {
            this.store = Ext.create('Ext.data.TreeStore', { autoLoad: false, proxy: { type: 'ajax', url: this.url, paramsAsJson: true, actionMethods: { create: 'POST', read: 'POST', update: 'POST', destroy: 'POST' }, reader: { type: 'sef-jsonreader', rootProperty: window.SEF_LIB_CFG.pageTreeRootProperty || 'Result.Children' } }, model: this.enableCheck === true ? 'sef.core.model.CheckboxTreeModel' : 'sef.core.model.TreeModel' });
            this.store.on('beforeload', function(s, oper) {
                var id = oper.getId();
                var _params = Ext.merge({}, oper.getParams());
                if (id === 'root') {
                    _params['TreeNode'] = { DataID: 0 };
                } else {
                    var rec = s.getById(id);
                    var data = Ext.merge({}, rec.data);
                    var ds = {};
                    for (var d in data) {
                        if (/^[A-Z]/.test(d)) {
                            if (d !== 'Children') {
                                ds[d] = data[d];
                            }
                        }
                    }
                    _params['TreeNode'] = ds;
                }
                if (Ext.isFunction(me.onTreeWillLoad)) {
                    var exParam = me.onTreeWillLoad.call(me, me, me.getStore(), oper);
                    if (exParam) {
                        _params = Ext.merge(_params['TreeNode'], exParam);
                    }
                }
                oper.setParams(_params);
            });
            if (_autoLoad) {
                this.store.load();
            }
        }
        Ext.apply(this, { tbar: this.makeBar() });
        this.callParent(arguments);
    },
    afterRender: function() {
        this.callParent(arguments);
    }
});
Ext.define('sef.core.components.tree.Timeline', {
    extend: Ext.view.View,
    xtype: 'sef-timeline',
    cls: 'sef-timelinetree',
    tpl: ['\x3cul class\x3d"sef-timeline"\x3e', '\x3ctpl for\x3d"."\x3e', '\x3cli class\x3d"{itemCls}"\x3e', '\x3cdiv class\x3d"timeline-item-tail"\x3e\x3c/div\x3e', '\x3cdiv class\x3d"timeline-item-head timeline-item-head-gray timeline-item-head-{color}"\x3e\x3c/div\x3e', '\x3cdiv class\x3d"timeline-item-content"\x3e{text}\x3c/div\x3e', '\x3c/li\x3e', '\x3c/tpl\x3e', '\x3c/ul\x3e'],
    store: Ext.create('Ext.data.Store', { fields: ['index', 'text', 'color', 'lastColor', 'itemCls'], data: [] }),
    itemSelector: 'li',
    fillData: function(data) {
        if (Ext.isArray(data)) {
            var c = data.length;
            data.forEach(function(item, index) {
                item.color = item.color ? item.color : 'gray';
                item.itemCls = index < c - 1 ? 'timeline-item' : 'timeline-item timeline-item-last';
            });
        }
        this.getStore().loadData(data, false);
    },
    initComponent: function() {
        this.callParent(arguments);
    }
});
Ext.define('sef.core.components.tree.TreeListMenu', { extend: Ext.list.Tree, xtype: 'sef-treelistmenu', ui: 'sefu-treelistmenu' });
Ext.define('sef.core.components.uploader.AbstractUploader', {
    mixins: { observable: Ext.util.Observable },
    maxFileSize: 50000000,
    url: '',
    timeout: 60 * 1000,
    contentType: 'application/binary',
    filenameHeader: 'X-File-Name',
    sizeHeader: 'X-File-Size',
    typeHeader: 'X-File-Type',
    params: {},
    extraHeaders: {},
    filenameEncoder: null,
    filenameEncoderHeader: 'X-Filename-Encoder',
    constructor: function(config) {
        this.mixins.observable.constructor.call(this);
        this.initConfig(config);
    },
    initHeaders: function (item) {
        var headers = this.extraHeaders || {},
            filename = item.getFilename();
        var filenameEncoder = this.initFilenameEncoder();
        if (filenameEncoder) {
            filename = filenameEncoder.encode(filename);
            headers[this.filenameEncoderHeader] = filenameEncoder.getType();
        }
        headers[this.filenameHeader] = filename;
        headers[this.sizeHeader] = item.getSize();
        headers[this.typeHeader] = item.getType();
        return headers;
    },
    uploadItem: function(item) {},
    abortUpload: function() {},
    initFilenameEncoder: function() {
        if (Ext.isString(this.filenameEncoder)) {
            this.filenameEncoder = Ext.create(this.filenameEncoder);
        }
        if (Ext.isObject(this.filenameEncoder)) {
            return this.filenameEncoder;
        }
        return null;
    }
});
Ext.define('sef.core.components.uploader.AbstractXhrUploader', {
    extend: sef.core.components.uploader.AbstractUploader,
    onUploadSuccess: function(response, options, item) {
        var info = { success: true, message: '', response: response };
        if (response.responseText) {
            var responseJson = Ext.decode(response.responseText);
            if (responseJson) {
                Ext.apply(info, { success: responseJson.success, message: responseJson.message });
                var eventName = info.success ? 'uploadsuccess' : 'uploadfailure';
                this.fireEvent(eventName, item, info);
                return;
            }
        }
        this.fireEvent('uploadsuccess', item, info);
    },
    onUploadFailure: function(response, options, item) {
        var info = { success: false, message: 'http error', response: response };
        this.fireEvent('uploadfailure', item, info);
    },
    onUploadProgress: function(event, item) {
        this.fireEvent('uploadprogress', item, event);
    }
});
Ext.define('sef.core.components.window.BaseDialog', {
    extend: Ext.window.Window,
    xtype: 'sef-basedialog',
    ui: 'sefu-basedialog',
    closable: true,
    resizable: false,
    autoShow: false,
    modal: true,
    layout: 'fit',
    bodyPadding: 10,
    minWidth: 320,
    defaultFocus: 'textfield:focusable:not([hidden]):not([disabled]):not([value])',
    config: { showBar: true, okText: 'OK', cancelText: 'Cancel', dynamicContent: false },
    _dialogResult: {},
    onBeforeCloseDialog: function() {
        return true;
    },
    closeDialog: function(state, action) {
        if (action === 0 && state === 0) {
            if (this.onBeforeCloseDialog() === false) {
                return;
            }
            if (this.fireEvent('willclosedialog', this, this._dialogResult) === false) {
                return;
            }
        }
        this.fireEvent('dialogclose', state, this._dialogResult);
        this.close();
    },
    setDialogLoading: function(loading, cancelable) {
        var btn = this.down('#okBtn');
        btn && btn.setLoading(loading);
        if (cancelable === false) {
            btn = this.down('#cancelBtn');
            btn && btn.setDisabled(loading);
        }
    },
    initComponent: function() {
        var me = this;
        this._dialogResult = {};
        if (this.showBar && !this.bbar) {
            var bar = [];
            bar.push('-\x3e');
            if (this.cancelText) {
                bar.push({
                    text: this.cancelText,
                    itemId: 'cancelBtn',
                    btnType: 'default',
                    minWidth: 80,
                    handler: function() {
                        me.closeDialog(1, 0);
                    }
                });
            }
            bar.push({
                text: this.okText,
                itemId: 'okBtn',
                btnType: 'primary',
                minWidth: 80,
                handler: function() {
                    me.closeDialog(0, 0);
                }
            });
            Ext.apply(this, { bbar: { xtype: 'toolbar', items: bar, padding: 8 } });
        }
        this.on('dialogcontentclose', function(status, result) {
            this._dialogResult = result || {};
            this.closeDialog(status === true ? 0 : 1, 1);
        });
        this.on('contentload', function(isloading) {
            if (this.dynamicContent !== true) {
                return;
            }
            if (isloading === true) {
                this.mask();
            } else {
                this.unmask();
            }
        }, me);
        this.callParent(arguments);
    },
    _afterRender: function() {
        this.callParent(arguments);
        if (this.dynamicContent === true) {
            this.mask();
        }
    }
});
Ext.define('sef.core.components.uploader.data.UploadStore', { extend: Ext.data.Store, fields: [{ name: 'filename', type: 'string' }, { name: 'size', type: 'integer' }, { name: 'type', type: 'string' }, { name: 'status', type: 'string' }, { name: 'message', type: 'string' }], proxy: { type: 'memory', reader: { type: 'array', idProperty: 'filename' } } });
Ext.define('sef.core.components.uploader.ItemGridPanel', {
    extend: sef.core.components.grid.DataGrid,
    showPaging: false,
    viewConfig: { scrollOffset: 40 },
    config: { queue: null, textFilename: _('文件名'), textSize: _('大小'), textType: _('类型'), textStatus: _('状态'), textProgress: '%' },
    initComponent: function() {
        if (this.queue) {
            this.queue.on('queuechange', this.onQueueChange, this);
            this.queue.on('itemchangestatus', this.onQueueItemChangeStatus, this);
            this.queue.on('itemprogressupdate', this.onQueueItemProgressUpdate, this);
        }
        Ext.apply(this, {
            store: Ext.create('sef.core.components.uploader.data.UploadStore'),
            columns: [{ dataIndex: 'filename', header: this.textFilename, flex: 1 }, {
                dataIndex: 'size',
                header: this.textSize,
                width: 100,
                renderer: function(value) {
                    return Ext.util.Format.fileSize(value);
                }
            }, { dataIndex: 'type', header: this.textType, width: 150 }, { dataIndex: 'status', header: this.textStatus, width: 50, align: 'right', renderer: this.statusRenderer }, {
                dataIndex: 'progress',
                header: this.textProgress,
                width: 50,
                align: 'right',
                renderer: function(value) {
                    if (!value) {
                        value = 0;
                    }
                    return value + '%';
                }
            }, { dataIndex: 'message', width: 1, hidden: true }]
        });
        this.callParent(arguments);
    },
    onQueueChange: function(queue) {
        this.loadQueueItems(queue.getItems());
    },
    onQueueItemChangeStatus: function(queue, item, status) {
        this.updateStatus(item);
    },
    onQueueItemProgressUpdate: function(queue, item) {
        this.updateStatus(item);
    },
    loadQueueItems: function(items) {
        var data = [];
        var i;
        for (i = 0; i < items.length; i++) {
            data.push([items[i].getFilename(), items[i].getSize(), items[i].getType(), items[i].getStatus(), items[i].getProgressPercent()]);
        }
        this.loadStoreData(data);
    },
    loadStoreData: function(data, append) {
        this.store.loadData(data, append);
    },
    getSelectedRecords: function() {
        return this.getSelectionModel().getSelection();
    },
    updateStatus: function(item) {
        var record = this.getRecordByFilename(item.getFilename());
        if (!record) {
            return;
        }
        var itemStatus = item.getStatus();
        if (itemStatus != record.get('status')) {
            this.scrollIntoView(record);
            record.set('status', item.getStatus());
            if (item.isUploadError()) {
                record.set('tooltip', item.getUploadErrorMessage());
            }
        }
        record.set('progress', item.getProgressPercent());
        record.commit();
    },
    getRecordByFilename: function(filename) {
        var index = this.store.findExact('filename', filename);
        if (-1 == index) {
            return null;
        }
        return this.store.getAt(index);
    },
    getIndexByRecord: function(record) {
        return this.store.findExact('filename', record.get('filename'));
    },
    statusRenderer: function(value, metaData, record, rowIndex, colIndex, store) {
        var iconCls = 'ux-mu-icon-upload-' + value;
        var tooltip = record.get('tooltip');
        if (tooltip) {
            value = tooltip;
        } else {
            'upload_status_' + value;
        }
        value = '\x3cspan class\x3d"ux-mu-status-value ' + iconCls + '" data-qtip\x3d"' + value + '" /\x3e';
        return value;
    },
    scrollIntoView: function(record) {
        var index = this.getIndexByRecord(record);
        if (-1 == index) {
            return;
        }
        this.getView().focusRow(index);
        return;
        var rowEl = Ext.get(this.getView().getRow(index));
        if (!rowEl) {
            return;
        }
        var gridEl = this.getEl();
        if (rowEl.getBottom() > gridEl.getBottom()) {
            rowEl.dom.scrollIntoView(gridEl);
        }
    }
});
Ext.define('sef.core.components.uploader.Manager', {
    mixins: { observable: Ext.util.Observable },
    uploader: null,
    uploaderOptions: null,
    synchronous: true,
    filenameEncoder: null,
    DEFAULT_UPLOADER_CLASS: 'sef.core.components.uploader.ExtJsUploader',
    constructor: function(config) {
        this.mixins.observable.constructor.call(this);
        this.initConfig(config);
        if (!(this.uploader instanceof sef.core.components.uploader.AbstractUploader)) {
            var uploaderClass = this.DEFAULT_UPLOADER_CLASS;
            if (Ext.isString(this.uploader)) {
                uploaderClass = this.uploader;
            }
            var uploaderOptions = this.uploaderOptions || {};
            Ext.applyIf(uploaderOptions, { success: this.onUploadSuccess, failure: this.onUploadFailure, progress: this.onUploadProgress, filenameEncoder: this.filenameEncoder });
            this.uploader = Ext.create(uploaderClass, uploaderOptions);
        }
        this.mon(this.uploader, 'uploadsuccess', this.onUploadSuccess, this);
        this.mon(this.uploader, 'uploadfailure', this.onUploadFailure, this);
        this.mon(this.uploader, 'uploadprogress', this.onUploadProgress, this);
        Ext.apply(this, { syncQueue: null, currentQueue: null, uploadActive: false, errorCount: 0 });
    },
    uploadQueue: function(queue) {
        if (this.uploadActive) {
            return;
        }
        this.startUpload(queue);
        if (this.synchronous) {
            this.uploadQueueSync(queue);
            return;
        }
        this.uploadQueueAsync(queue);
    },
    uploadQueueSync: function(queue) {
        this.uploadNextItemSync();
    },
    uploadNextItemSync: function() {
        if (!this.uploadActive) {
            return;
        }
        var item = this.currentQueue.getFirstReadyItem();
        if (!item) {
            return;
        }
        this.uploader.uploadItem(item);
    },
    uploadQueueAsync: function(queue) {
        var i;
        var num = queue.getCount();
        for (i = 0; i < num; i++) {
            this.uploader.uploadItem(queue.getAt(i));
        }
    },
    startUpload: function(queue) {
        queue.reset();
        this.uploadActive = true;
        this.currentQueue = queue;
        this.fireEvent('beforeupload', this, queue);
    },
    finishUpload: function() {
        this.fireEvent('uploadcomplete', this, this.currentQueue, this.errorCount);
    },
    resetUpload: function() {
        this.currentQueue = null;
        this.uploadActive = false;
        this.errorCount = 0;
    },
    abortUpload: function() {
        this.uploader.abortUpload();
        this.currentQueue.recoverAfterAbort();
        this.resetUpload();
        this.fireEvent('abortupload', this, this.currentQueue);
    },
    afterItemUpload: function(item, info) {
        if (this.synchronous) {
            this.uploadNextItemSync();
        }
        if (!this.currentQueue.existUploadingItems()) {
            this.finishUpload();
        }
    },
    onUploadSuccess: function(item, info) {
        item.setUploaded();
        this.fireEvent('itemuploadsuccess', this, item, info);
        this.afterItemUpload(item, info);
    },
    onUploadFailure: function(item, info) {
        item.setUploadError(Ext.JSON.decode(info.response.responseText));
        this.fireEvent('itemuploadfailure', this, item, info);
        this.errorCount++;
        this.afterItemUpload(item, info);
    },
    onUploadProgress: function(item, event) {
        item.setProgress(event.loaded);
    }
});
Ext.define('sef.core.components.uploader.BrowseButton', {
    extend: Ext.form.field.File,
    buttonOnly: true,
    buttonText: 'Browse...',
    initComponent: function() {
        Ext.apply(this, { buttonConfig: { iconCls: this.iconCls, text: this.buttonText } });
        this.on('afterrender', function() {
            this.setMultipleInputAttribute();
        }, this);
        this.on('change', function(field, value, options) {
            var files = this.fileInputEl.dom.files;
            if (files.length) {
                this.fireEvent('fileselected', this, files);
            }
        }, this);
        this.callParent(arguments);
    },
    reset: function() {
        this.callParent(arguments);
        this.setMultipleInputAttribute();
    },
    setMultipleInputAttribute: function(inputEl) {
        inputEl = inputEl || this.fileInputEl;
        inputEl.dom.setAttribute('multiple', '1');
    }
});
Ext.define('sef.core.components.uploader.data.Item', {
    mixins: { observable: Ext.util.Observable },
    STATUS_READY: 'ready',
    STATUS_UPLOADING: 'uploading',
    STATUS_UPLOADED: 'uploaded',
    STATUS_UPLOAD_ERROR: 'uploaderror',
    progress: null,
    status: null,
    fileApiObject: null,
    uploadErrorMessage: '',
    constructor: function(config) {
        this.mixins.observable.constructor.call(this);
        this.initConfig(config);
        Ext.apply(this, { status: this.STATUS_READY, progress: 0 });
    },
    reset: function() {
        this.uploadErrorMessage = '';
        this.setStatus(this.STATUS_READY);
        this.setProgress(0);
    },
    getFileApiObject: function() {
        return this.fileApiObject;
    },
    getId: function() {
        return this.getFilename();
    },
    getName: function() {
        return this.getProperty('name');
    },
    getFilename: function() {
        return this.getName();
    },
    getSize: function() {
        return this.getProperty('size');
    },
    getType: function() {
        return this.getProperty('type');
    },
    getProperty: function(propertyName) {
        if (this.fileApiObject) {
            return this.fileApiObject[propertyName];
        }
        return null;
    },
    getProgress: function() {
        return this.progress;
    },
    getProgressPercent: function() {
        var progress = this.getProgress();
        if (!progress) {
            return 0;
        }
        var percent = Ext.util.Format.number(progress / this.getSize() * 100, '0');
        if (percent > 100) {
            percent = 100;
        }
        return percent;
    },
    setProgress: function(progress) {
        this.progress = progress;
        this.fireEvent('progressupdate', this);
    },
    getStatus: function() {
        return this.status;
    },
    setStatus: function(status) {
        this.status = status;
        this.fireEvent('changestatus', this, status);
    },
    hasStatus: function(status) {
        var itemStatus = this.getStatus();
        if (Ext.isArray(status) && Ext.Array.contains(status, itemStatus)) {
            return true;
        }
        if (itemStatus === status) {
            return true;
        }
        return false;
    },
    isReady: function() {
        return this.status == this.STATUS_READY;
    },
    isUploaded: function() {
        return this.status == this.STATUS_UPLOADED;
    },
    setUploaded: function() {
        this.setProgress(this.getSize());
        this.setStatus(this.STATUS_UPLOADED);
    },
    isUploadError: function() {
        return this.status == this.STATUS_UPLOAD_ERROR;
    },
    getUploadErrorMessage: function() {
        return this.uploadErrorMessage;
    },
    setUploadError: function(message) {
        this.uploadErrorMessage = message;
        this.setStatus(this.STATUS_UPLOAD_ERROR);
    },
    setUploading: function() {
        this.setStatus(this.STATUS_UPLOADING);
    }
});
Ext.define('sef.core.components.uploader.data.Queue', {
    extend: Ext.util.MixedCollection,
    constructor: function(config) {
        this.callParent(arguments);
        this.on('clear', function() {
            this.fireEvent('queuechange', this);
        }, this);
    },
    addFiles: function(fileList) {
        var i;
        var items = [];
        var num = fileList.length;
        if (!num) {
            return;
        }
        for (i = 0; i < num; i++) {
            items.push(this.createItem(fileList[i]));
        }
        this.addAll(items);
        this.fireEvent('multiadd', this, items);
        this.fireEvent('queuechange', this);
    },
    reset: function() {
        this.clearUploadedItems();
        this.each(function(item) {
            item.reset();
        }, this);
    },
    getItems: function() {
        return this.getRange();
    },
    getItemsByStatus: function(status) {
        var itemsByStatus = [];
        this.each(function(item, index, items) {
            if (item.hasStatus(status)) {
                itemsByStatus.push(item);
            }
        });
        return itemsByStatus;
    },
    getUploadedItems: function() {
        return this.getItemsByStatus('uploaded');
    },
    getUploadErrorItems: function() {
        return this.getItemsByStatus('uploaderror');
    },
    getUploadingItems: function() {
        return this.getItemsByStatus(['ready', 'uploading']);
    },
    existUploadingItems: function() {
        return this.getUploadingItems().length > 0;
    },
    getFirstReadyItem: function() {
        var items = this.getRange();
        var num = this.getCount();
        var i;
        for (i = 0; i < num; i++) {
            if (items[i].isReady()) {
                return items[i];
            }
        }
        return null;
    },
    clearItems: function() {
        this.clear();
    },
    clearUploadedItems: function() {
        this.removeItems(this.getUploadedItems());
    },
    removeItems: function(items) {
        var num = items.length;
        var i;
        if (!num) {
            return;
        }
        for (i = 0; i < num; i++) {
            this.remove(items[i]);
        }
        this.fireEvent('queuechange', this);
    },
    removeItemsByKey: function(itemKeys) {
        var i;
        var num = itemKeys.length;
        if (!num) {
            return;
        }
        for (i = 0; i < num; i++) {
            this.removeItemByKey(itemKeys[i]);
        }
        this.fireEvent('multiremove', this, itemKeys);
        this.fireEvent('queuechange', this);
    },
    removeItemByKey: function(key) {
        this.removeAtKey(key);
    },
    recoverAfterAbort: function() {
        this.each(function(item) {
            if (!item.isUploaded() && !item.isReady()) {
                item.reset();
            }
        });
    },
    createItem: function(file) {
        var item = Ext.create('sef.core.components.uploader.data.Item', { fileApiObject: file });
        item.on('changestatus', this.onItemChangeStatus, this);
        item.on('progressupdate', this.onItemProgressUpdate, this);
        return item;
    },
    getKey: function(item) {
        return item.getId();
    },
    onItemChangeStatus: function(item, status) {
        this.fireEvent('itemchangestatus', this, item, status);
    },
    onItemProgressUpdate: function(item) {
        this.fireEvent('itemprogressupdate', this, item);
    },
    isLast: function(item) {
        var lastItem = this.last();
        if (lastItem && item.getId() == lastItem.getId()) {
            return true;
        }
        return false;
    },
    getTotalBytes: function() {
        var bytes = 0;
        this.each(function(item, index, length) {
            bytes += item.getSize();
        }, this);
        return bytes;
    }
});
Ext.define('sef.core.components.uploader.UploadPanel', {
    extend: Ext.panel.Panel,
    config: {
        uploader: null,
        uploaderOptions: null,
        synchronous: true,
        uploadUrl: '',
        uploadParams: {},
        uploadExtraHeaders: {},
        uploadTimeout: 60000,
        filenameEncoder: null,
        textOk: 'OK',
        textUpload: _('上传'),
        textBrowse: 'Browse',
        textAbort: _('中止'),
        textRemoveSelected: _('移除文件'),
        textRemoveAll: _('移除全部'),
        textFilename: 'Filename',
        textSize: 'Size',
        textType: 'Type',
        textStatus: 'Status',
        textProgress: '%',
        selectionMessageText: 'Selected {0} file(s), {1}',
        uploadMessageText: 'Upload progress {0}% ({1} of {2} souborů)',
        buttonText: 'Browse...'
    },
    queue: null,
    grid: null,
    uploadManager: null,
    statusBar: null,
    browseButton: null,
    initComponent: function() {
        this.queue = this.initQueue();
        this.grid = Ext.create('sef.core.components.uploader.ItemGridPanel', { queue: this.queue, textFilename: this.textFilename, textSize: this.textSize, textType: this.textType, textStatus: this.textStatus, textProgress: this.textProgress, margin: '2px 0 0 0' });
        this.uploadManager = this.createUploadManager();
        this.uploadManager.on('uploadcomplete', this.onUploadComplete, this);
        this.uploadManager.on('itemuploadsuccess', this.onItemUploadSuccess, this);
        this.uploadManager.on('itemuploadfailure', this.onItemUploadFailure, this);
        Ext.apply(this, { title: this.dialogTitle, autoScroll: true, layout: 'fit', uploading: false, items: [this.grid], dockedItems: [this.getTopToolbarConfig()] });
        this.on('afterrender', function() {
            this.stateInit();
        }, this);
        this.callParent(arguments);
    },
    createUploadManager: function() {
        var uploaderOptions = this.getUploaderOptions() || {};
        Ext.applyIf(uploaderOptions, { url: this.uploadUrl, params: this.uploadParams, extraHeaders: this.uploadExtraHeaders, timeout: this.uploadTimeout });
        var uploadManager = Ext.create('sef.core.components.uploader.Manager', { uploader: this.uploader, uploaderOptions: uploaderOptions, synchronous: this.getSynchronous(), filenameEncoder: this.getFilenameEncoder() });
        return uploadManager;
    },
    getTopToolbarConfig: function() {
        this.browseButton = Ext.create('sef.core.components.uploader.BrowseButton', { itemId: 'button_browse', buttonText: this.buttonText, btnType: 'primary' });
        this.browseButton.on('fileselected', this.onFileSelection, this);
        return {
            xtype: 'toolbar',
            itemId: 'topToolbar',
            dock: 'top',
            cls: 'sef-uploadpanelgbar',
            items: [this.browseButton, '-', { itemId: 'button_upload', text: this.textUpload, iconCls: 'x-fa fa-upload', scope: this, btnType: 'danger', handler: this.onInitUpload }, '-', { itemId: 'button_abort', text: this.textAbort, iconCls: 'x-fa fa-stop', scope: this, handler: this.onAbortUpload, disabled: true }, '-\x3e', { itemId: 'button_remove_selected', text: this.textRemoveSelected, iconCls: 'x-fa fa-minus', scope: this, handler: this.onMultipleRemove },
                '-', { itemId: 'button_remove_all', text: this.textRemoveAll, iconCls: 'x-fa fa-times', scope: this, handler: this.onRemoveAll }
            ]
        };
    },
    initQueue: function() {
        var queue = Ext.create('sef.core.components.uploader.data.Queue');
        queue.on('queuechange', this.onQueueChange, this);
        return queue;
    },
    onInitUpload: function() {
        if (!this.queue.getCount()) {
            return;
        }
        this.stateUpload();
        this.startUpload();
    },
    onAbortUpload: function() {
        this.uploadManager.abortUpload();
        this.finishUpload();
        this.switchState();
    },
    onUploadComplete: function(manager, queue, errorCount) {
        this.finishUpload();
        if (errorCount) {
            this.stateQueue();
        } else {
            this.stateInit();
        }
        this.fireEvent('uploadcomplete', this, manager, queue.getUploadedItems(), errorCount, queue.getUploadErrorItems()[0].uploadErrorMessage.Message);
        manager.resetUpload();
    },
    onFileSelection: function(input, files) {
        this.queue.clearUploadedItems();
        this.queue.addFiles(files);
        this.browseButton.reset();
    },
    onQueueChange: function(queue) {
        this.updateStatusBar();
        this.switchState();
    },
    onMultipleRemove: function() {
        var records = this.grid.getSelectedRecords();
        if (!records.length) {
            return;
        }
        var keys = [];
        var i;
        var num = records.length;
        for (i = 0; i < num; i++) {
            keys.push(records[i].get('filename'));
        }
        this.queue.removeItemsByKey(keys);
    },
    onRemoveAll: function() {
        this.queue.clearItems();
    },
    onItemUploadSuccess: function(manager, item, info) {},
    onItemUploadFailure: function(manager, item, info) {},
    startUpload: function() {
        this.uploading = true;
        this.uploadManager.uploadQueue(this.queue);
    },
    finishUpload: function() {
        this.uploading = false;
    },
    isUploadActive: function() {
        return this.uploading;
    },
    updateStatusBar: function() {
        if (!this.statusBar) {
            return;
        }
        var numFiles = this.queue.getCount();
        this.statusBar.setSelectionMessage(this.queue.getCount(), this.queue.getTotalBytes());
    },
    getButton: function(itemId) {
        var topToolbar = this.getDockedComponent('topToolbar');
        if (topToolbar) {
            return topToolbar.getComponent(itemId);
        }
        return null;
    },
    switchButtons: function(info) {
        var itemId;
        for (itemId in info) {
            this.switchButton(itemId, info[itemId]);
        }
    },
    switchButton: function(itemId, on) {
        var button = this.getButton(itemId);
        if (button) {
            if (on) {
                button.enable();
            } else {
                button.disable();
            }
        }
    },
    switchState: function() {
        if (this.uploading) {
            this.stateUpload();
        } else {
            if (this.queue.getCount()) {
                this.stateQueue();
            } else {
                this.stateInit();
            }
        }
    },
    stateInit: function() {
        this.switchButtons({ 'button_browse': 1, 'button_upload': 0, 'button_abort': 0, 'button_remove_all': 1, 'button_remove_selected': 1 });
    },
    stateQueue: function() {
        this.switchButtons({ 'button_browse': 1, 'button_upload': 1, 'button_abort': 0, 'button_remove_all': 1, 'button_remove_selected': 1 });
    },
    stateUpload: function() {
        this.switchButtons({ 'button_browse': 0, 'button_upload': 0, 'button_abort': 1, 'button_remove_all': 1, 'button_remove_selected': 1 });
    }
});
Ext.define('sef.core.components.uploader.UploadDialog', {
    extend: sef.core.components.window.BaseDialog,
    width: 700,
    height: 500,
    border: 0,
    cancelText: '',
    config: { dialogTitle: _('文件上传'), iconCls: 'x-fa fa-upload', synchronous: true, uploadUrl: '', uploadParams: {}, uploadExtraHeaders: {}, uploadTimeout: 60000, textClose: 'Close' },
    initComponent: function() {
        if (!Ext.isObject(this.panel)) {
            this.panel = Ext.create('sef.core.components.uploader.UploadPanel', { synchronous: this.synchronous, scope: this.scope, uploadUrl: this.uploadUrl, uploadParams: this.uploadParams, uploadExtraHeaders: this.uploadExtraHeaders, uploadTimeout: this.uploadTimeout });
        }
        this.relayEvents(this.panel, ['uploadcomplete', 'itemuploadfailure']);
        Ext.apply(this, { title: this.dialogTitle, layout: 'fit', items: [this.panel] });
        this.callParent(arguments);
    }
});
Ext.define('sef.core.components.uploader.Avatar', {
    extend: Ext.Button,
    xtype: 'sef-avatar',
    ui: 'sefu-btn-avatar',
    config: { src: '', uploadUrl: '' },
    width: 120,
    height: 120,
    maxWidth: 120,
    minWidth: 120,
    minHeight: 120,
    iconCls: 'x-fa fa-plus',
    applySrc: function(v) {
        var el = this.getEl();
        if (el) {
            var span = el.down('.x-btn-button-sefu-btn-avatar-small');
            span.setStyle({ background: 'url(' + v + ') no-repeat', backgroundSize: '100% 100%' });
            if (v) {
                this.setIconCls('');
            } else {
                this.setIconCls('x-fa fa-plus');
            }
        }
        this.src = v;
    },
    doUpload: function() {
        var dialog = Ext.create('sef.core.components.uploader.UploadDialog', { uploadUrl: this.uploadUrl });
        dialog.on('uploadcomplete', function(up, mgr, uploadedItems, err) {});
        dialog.show();
    },
    initComponent: function() {
        this.callParent(arguments);
        this.on('click', this.doUpload, this);
    },
    afterRender: function() {
        this.callParent(arguments);
        this.applySrc(this.src);
    }
});
Ext.define('sef.core.components.uploader.data.Connection', {
    extend: Ext.data.Connection,
    progressCallback: null,
    request: function(options) {
        var progressCallback = options.progress;
        if (progressCallback) {
            this.progressCallback = progressCallback;
        }
        this.callParent(arguments);
    },
    getXhrInstance: function() {
        var xhr = this.callParent(arguments);
        if (this.progressCallback) {
            xhr.upload.onprogress = this.progressCallback;
        }
        return xhr;
    }
});
Ext.define('sef.core.components.uploader.ExtJsUploader', {
    extend: sef.core.components.uploader.AbstractXhrUploader,
    config: { method: 'POST', connection: null },
    conn: null,
    initConnection: function() {
        var conn, url = this.url;
        if (this.connection instanceof Ext.data.Connection) {
            conn = this.connection;
        } else {
            if (this.params) {
                url = Ext.urlAppend(url, Ext.urlEncode(this.params));
            }
            conn = Ext.create('sef.core.components.uploader.data.Connection', { disableCaching: true, method: this.method, url: url, timeout: this.timeout, defaultHeaders: { 'Content-Type': this.contentType, 'X-Requested-With': 'XMLHttpRequest' } });
        }
        return conn;
    },
    initHeaders: function(item) {
        var headers = this.callParent(arguments);
        headers['Content-Type'] = item.getType();
        return headers;
    },
    uploadItem: function(item) {
        var file = item.getFileApiObject();
        if (!file) {
            return;
        }
        item.setUploading();
        this.conn = this.initConnection();
        this.conn.request({ scope: this, headers: this.initHeaders(item), rawData: file, success: Ext.Function.bind(this.onUploadSuccess, this, [item], true), failure: Ext.Function.bind(this.onUploadFailure, this, [item], true), progress: Ext.Function.bind(this.onUploadProgress, this, [item], true) });
    },
    abortUpload: function() {
        if (this.conn) {
            this.suspendEvents();
            this.conn.abort();
            this.resumeEvents();
        }
    }
});
Ext.define('sef.core.components.uploader.StatusBar', {
    extend: Ext.toolbar.Toolbar,
    config: { selectionMessageText: 'Selected {0} file(s), {1}', uploadMessageText: 'Upload progress {0}% ({1} of {2} file(s))', textComponentId: 'mu-status-text' },
    initComponent: function() {
        Ext.apply(this, { items: [{ xtype: 'tbtext', itemId: this.textComponentId, text: '\x26nbsp;' }] });
        this.callParent(arguments);
    },
    setText: function(text) {
        this.getComponent(this.textComponentId).setText(text);
    },
    setSelectionMessage: function(fileCount, byteCount) {
        this.setText(Ext.String.format(this.selectionMessageText, fileCount, Ext.util.Format.fileSize(byteCount)));
    },
    setUploadMessage: function(progressPercent, uploadedFiles, totalFiles) {
        this.setText(Ext.String.format(this.uploadMessageText, progressPercent, uploadedFiles, totalFiles));
    }
});
Ext.define('sef.core.components.uploader.header.AbstractFilenameEncoder', {
    config: {},
    type: 'generic',
    encode: function(filename) {},
    getType: function() {
        return this.type;
    }
});
Ext.define('sef.core.components.uploader.header.Base64FilenameEncoder', {
    extend: sef.core.components.uploader.header.AbstractFilenameEncoder,
    config: {},
    type: 'base64',
    encode: function(filename) {
        return window.btoa(unescape(encodeURIComponent(filename)));
    }
});
Ext.define('sef.core.components.window.AdvSearchDialog', {
    extend: sef.core.components.window.BaseDialog,
    xtype: 'sef-advsearchdialog',
    title: _('高级搜索'),
    closable: false,
    width: 600,
    height: 400,
    iconCls: 'x-fa fa-filter',
    bodyPadding: 20,
    layout: { type: 'vbox', align: 'stretch' },
    scrollable: 'y',
    config: { model: null, advSearch: null, allowCustomSearch: true, labelWidth: 80 },
    okText: _('搜索'),
    cancelText: _('关闭'),
    _modelMeta: null,
    _searchingFields: [],
    _customSearchingFieldMeta: [],
    makeSearchFieldInfo: function(f) {
        var field = {},
            mf = null;
        if (Ext.isString(f)) {
            mf = Ext.Array.findBy(this._modelMeta, function(mm) {
                return mm.name === f;
            });
            if (mf) {
                field = { fieldLabel: mf.text };
            } else {
                field = { name: f };
            }
        } else {
            Ext.apply(field, f || {});
            mf = Ext.Array.findBy(this._modelMeta, function(mm) {
                return mm.name === f.name;
            });
            field = Ext.merge({}, f);
            Ext.applyIf(field, { fieldLabel: mf && mf.text });
        }
        if (mf) {
            Ext.applyIf(field, { name: mf.name });
        }
        this._searchingFields.push(field.name);
        return { field: field, meta: mf };
    },
    makeSearchItemFieldConfig: function(field, mf) {
        var type = '';
        if (mf) {
            type = mf.type.toLowerCase();
        }
        var fc = { type: type, name: field.name };
        switch (type) {
            case 'bool':
            case 'boolean':
                fc['xtype'] = 'sef-boolcombo';
                fc['ops'] = ['\x3d\x3d', '!\x3d'];
                break;
            case 'int':
            case 'bigint':
                fc['xtype'] = 'sef-rangefield';
                fc['rtype'] = 'numberfield';
                fc['rname'] = 'rangefield', fc['ops'] = ['\x3d\x3d', '!\x3d', '\x3e', '\x3e\x3d', '\x3c', '\x3c\x3d'];
                fc['fieldDefaults'] = { allowDecimals: false };
                break;
            case 'float':
            case 'double':
            case 'decimal':
                fc['xtype'] = 'sef-rangefield';
                fc['rtype'] = 'numberfield';
                fc['rname'] = 'rangefield', fc['ops'] = ['\x3d\x3d', '!\x3d', '\x3e', '\x3e\x3d', '\x3c', '\x3c\x3d'];
                break;
            case 'datetime':
            case 'date':
            case 'time':
                fc['ops'] = ['\x3d\x3d', '!\x3d', '\x3e', '\x3e\x3d', '\x3c', '\x3c\x3d'];
                fc['xtype'] = 'datefield';
                break;
            case 'enum':
                fc['ops'] = ['\x3d\x3d', '!\x3d'];
                fc['xtype'] = 'sef-enumcombo';
                fc['enumType'] = mf.sassb;
                break;
            default:
                fc['ops'] = ['\x3d\x3d', '!\x3d', 'like'];
                break;
        }
        return fc;
    },
    getSearchItemOperator: function(field, fc, notForCfg) {
        var combo = {
            xtype: 'combo',
            width: 80,
            name: field.name + '__op',
            displayField: 'display',
            valueField: 'value',
            editable: false,
            listeners: {
                'afterrender': function(c) {
                    c.select(c.getStore().getAt(0));
                }
            }
        };
        var ops = field.ops || fc.ops;
        delete fc.ops;
        if (notForCfg !== false) {
            Ext.apply(combo, { store: Ext.create('Ext.data.Store', { fields: ['display', 'value'], data: this.getOperatorData(ops) }) });
        } else {
            Ext.apply(combo, { store: { fields: ['display', 'value'], data: this.getOperatorData(ops) } });
        }
        return combo;
    },
    getOperatorData: function(data) {
        return Ext.Array.map(data, function(d) {
            return { display: d, value: sef.runningCfg.searchOperator[d] };
        });
    },
    makeSearchItemField: function(f) {
        var info = this.makeSearchFieldInfo(f);
        var field = info.field;
        var mf = info.meta;
        var text = field.fieldLabel;
        field.fieldLabel = '';
        var cfg = this.makeSearchItemFieldConfig(field, mf);
        var items = [];
        items.push({ xtype: 'box', html: '\x3cdiv class\x3d"sef-advsearch-label"\x3e' + text + '\x3c/div\x3e', width: this.labelWidth });
        items.push(this.getSearchItemOperator(field, cfg));
        items.push({ xtype: 'box', width: 5 });
        var ff = { flex: 1, xtype: 'textfield' };
        Ext.apply(ff, field.xtype ? field : cfg);
        if (ff['rname']) {
            ff['rname'] = field.name + '__range';
        }
        items.push(ff);
        return { xtype: 'fieldcontainer', layout: { type: 'hbox', align: 'stretch' }, items: items };
    },
    makeItems: function() {
        var me = this,
            items = [];
        this.advSearch.forEach(function(f) {
            items.push(me.makeSearchItemField(f));
        });
        if (me.allowCustomSearch !== false) {
            items.push({
                xtype: 'container',
                layout: { type: 'hbox', align: 'stretch' },
                items: [{ xtype: 'box', flex: 1 }, {
                    margin: '0 0 0 5px',
                    xtype: 'button',
                    btnType: 'link',
                    text: _('添加自定义搜索'),
                    handler: function() {
                        me.addCustomSearchItems();
                    }
                }]
            });
        }
        return items;
    },
    initCustomFilterFieldData: function() {
        var me = this;
        if (this._customSearchingFieldMeta.length < 1) {
            this._modelMeta.forEach(function(mf) {
                if (mf.invisible === true) {
                    return;
                }
                var searchingField = Ext.Array.findBy(me._searchingFields, function(mm) {
                    return mm === mf.name;
                });
                if (!searchingField) {
                    var field = { name: mf.name, text: mf.text };
                    var cfg = me.makeSearchItemFieldConfig(field, mf);
                    field.operator = me.getSearchItemOperator(field, cfg, false);
                    var ff = { flex: 1, xtype: 'textfield' };
                    Ext.apply(ff, field.xtype ? field : cfg);
                    field.field = ff;
                    me._customSearchingFieldMeta.push(field);
                }
            });
        }
    },
    onCustomSearchFieldChange: function(itemId, fieldName) {
        var cbOP = this.down('#' + itemId + '__op');
        cbOP.reset();
        var meta = Ext.Array.findBy(this._customSearchingFieldMeta, function(mf) {
            return mf.name === fieldName;
        });
        var data = meta.operator.store.data;
        var store = cbOP.getStore();
        store.loadData(data);
        cbOP.select(store.getAt(0));
        var fc = this.down('#' + itemId);
        var field = fc.down('#' + itemId + '__value');
        fc.suspendLayout = true;
        fc.remove(field, true);
        delete field;
        field = Ext.merge({}, meta.field);
        Ext.apply(field, { name: itemId + '__value', itemId: itemId + '__value' });
        if (field['rname']) {
            field['rname'] = itemId + '__range';
        }
        fc.add(field);
        fc.suspendLayout = false;
        fc.updateLayout();
    },
    addCustomSearchItems: function() {
        this.initCustomFilterFieldData();
        var me = this,
            itemId = Ext.id(null, 'customer_search_item');
        var fieldData = Ext.Array.map(me._customSearchingFieldMeta, function(f) {
            return { display: f.text, value: f.name };
        });
        var items = [{
            xtype: 'button',
            btnType: 'link',
            text: _('移除'),
            handler: function() {
                var form = me.down('#search_form');
                var fc = form.down('#' + itemId);
                form.suspendLayout = true;
                form.remove(fc, true);
                delete fc;
                fc = null;
                form.suspendLayout = false;
                form.updateLayout();
            }
        }, { xtype: 'box', width: 5 }, {
            xtype: 'combo',
            emptyText: _('字段'),
            width: this.labelWidth,
            displayField: 'display',
            valueField: 'value',
            editable: false,
            name: itemId + '__field',
            itemId: itemId + '__field',
            store: Ext.create('Ext.data.Store', { fields: ['display', 'value'], data: fieldData }),
            listeners: {
                'afterrender': function(c) {},
                'change': function(cb, newValue) {
                    me.onCustomSearchFieldChange(itemId, newValue);
                }
            }
        }, { xtype: 'box', width: 5 }, {
            xtype: 'combo',
            emptyText: _('操作'),
            width: 80,
            displayField: 'display',
            valueField: 'value',
            editable: false,
            name: itemId + '__op',
            itemId: itemId + '__op',
            store: Ext.create('Ext.data.Store', { fields: ['display', 'value'], proxy: { type: 'memory' }, data: [] }),
            listeners: {
                'afterrender': function(c) {},
                'change': function(cb, newValue) {}
            }
        }, { xtype: 'box', width: 5 }, { xtype: 'textfield', name: itemId + '__value', itemId: itemId + '__value', flex: 1 }];
        var form = this.down('#search_form');
        form.suspendLayout = true;
        form.add({
            xtype: 'fieldcontainer',
            itemId: itemId,
            layout: { type: 'hbox', align: 'stretch' },
            items: items,
            listeners: {
                afterrender: function() {
                    var cbField = me.down('#' + itemId + '__field');
                    cbField.select(cbField.getStore().getAt(0));
                }
            }
        });
        form.suspendLayout = false;
        form.updateLayout();
    },
    initComponent: function() {
        this._modelMeta = sef.utils.getModelMeta(this.model);
        if (!Ext.isArray(this._modelMeta)) {
            this._modelMeta = [];
        }
        this.makeItems();
        Ext.apply(this, { items: { xtype: 'form', itemId: 'search_form', layout: 'column', margin: '10 0 0 0', defaults: { columnWidth: 1, margin: '0 10px 10px 0', labelSeparator: '  ', labelAlign: 'right', labelWidth: this.labelWidth }, items: this.makeItems() } });
        this.callParent(arguments);
    },
    onBeforeCloseDialog: function() {
        var form = this.down('#search_form').getForm();
        var searchValues = form.getFieldValues();
        var vvs = {};
        console.log(searchValues);
        var customSearch = {};
        for (var sv in searchValues) {
            if (/^customer_search_item/.test(sv)) {
                var prefix = /^customer_search_item.*?__/.exec(sv)[0];
                customSearch[prefix] = {};
            }
        }
        for (sv in customSearch) {
            var op = searchValues[sv + 'op'];
            var field = searchValues[sv + 'field'];
            var value = searchValues[sv + 'value'];
            searchValues[field] = value;
            searchValues[field + '__op'] = op;
            if (searchValues.hasOwnProperty(sv + 'range_r1')) {
                var r1 = searchValues[sv + 'range_r1'];
                var r2 = searchValues[sv + 'range_r2'];
                searchValues[field + '_r1'] = r1;
                searchValues[field + '_r2'] = r2;
                delete searchValues[sv + 'range_r1'];
                delete searchValues[field];
                delete searchValues[sv + 'range_r2'];
            }
            delete searchValues[sv + 'op'];
            delete searchValues[sv + 'field'];
            delete searchValues[sv + 'value'];
        }
        for (var sv in searchValues) {
            if (/__op$/.test(sv)) {
                var name = sv.replace('__op', '');
                if (!vvs[name]) {
                    vvs[name] = { FieldName: name, Rel: 'And' };
                }
                vvs[name]['Operator'] = searchValues[sv];
            } else {
                var newSv = sv;
                if (/_r\d$/.test(sv)) {
                    newSv = sv.replace(/_r\d$/, '');
                }
                if (!vvs[newSv]) {
                    vvs[newSv] = { FieldName: newSv, Rel: 'And' };
                }
                var v = searchValues[sv];
                if (v) {
                    if (!vvs[newSv]['Values']) {
                        vvs[newSv]['Values'] = [];
                    }
                    vvs[newSv]['Values'].push(v);
                }
            }
        }
        var result = [];
        for (var s in vvs) {
            if (vvs[s].Values) {
                result.push(vvs[s]);
            }
        }
        this._dialogResult = result;
        return true;
    }
});
Ext.define('sef.core.components.window.ChangePwdDialog', {
    extend: sef.core.components.window.BaseDialog,
    xtype: 'sef-changepwddialog',
    title: _('更改密码'),
    closable: false,
    width: 400,
    height: 400,
    iconCls: 'x-fa fa-lock',
    dynamicContent: true,
    config: { url: '' },
    doChangePwd: function(data) {
        var me = this;
        sef.utils.ajax({
            url: this.url,
            method: 'POST',
            jsonData: data,
            scope: me,
            success: function(result) {
                this.setDialogLoading(false, false);
                sef.message.success(_('密码更改成功'));
                this.closeDialog(0, 1);
            },
            failure: function(err, resp) {
                this.setDialogLoading(false, false);
                sef.dialog.error(err.message);
            }
        });
        return;
    },
    onBeforeCloseDialog: function() {
        var form = this.down('#pwdForm');
        if (form.hasInvalidField()) {
            return false;
        }
        var data = form.getValues();
        if (data.NewPwd !== data.NewPwd2) {
            sef.message.error(_('两次密码不相同，请检查'));
            return false;
        }
        delete data['NewPwd2'];
        this.doChangePwd(data);
        this.setDialogLoading(true, false);
        return false;
    },
    initComponent: function() {
        Ext.apply(this, { items: { xtype: 'form', itemId: 'pwdForm', layout: { type: 'vbox', align: 'stretch' }, defaults: { xtype: 'textfield', inputType: 'password', minLength: 6, maxLength: 20, labelAlign: 'top', allowBlank: false }, items: [{ fieldLabel: _('原始密码'), name: 'OldPwd' }, { fieldLabel: _('新的密码'), name: 'NewPwd' }, { fieldLabel: _('重复新的密码'), name: 'NewPwd2' }] } });
        this.callParent(arguments);
    },
    _afterRender: function() {
        this.callParent(arguments);
        this.mask();
        this.loadLog();
    }
});
Ext.define('sef.core.components.window.EditDialogContent', {
    extend: Ext.container.Container,
    xtype: 'sef-editdialogcontent',
    mixins: [sef.core.interfaces.IDialogContent],
    layout: 'fit',
    config: { successClose: true },
    initComponent: function() {
        this.callParent(arguments);
        this.initDialog();
        var me = this;
        this.items.get(0).on('formsuccess', function(form, result) {
            if (me.successClose) {
                me.closeDialog(true, result);
            }
        });
    }
});
Ext.define('sef.core.components.window.EditorDialog', {
    extend: sef.core.components.window.BaseDialog,
    xtype: 'sef-editordialog',
    title: _('编辑窗口'),
    closable: true,
    width: '70%',
    height: '75%',
    iconCls: 'x-fa fa-cube',
    showBar: false,
    bodyPadding: 0,
    config: { assoField: null, assoFieldID: 0, recID: 0, formType: null, store: null },
    initComponent: function() {
        Ext.apply(this, { items: { xtype: 'sef-editdialogcontent', items: { xtype: this.formType, store: this.store, canBack: false, canNavRec: false, showMode: 'model', recID: this.recID, assoField: this.assoField, assoFieldID: this.assoFieldID } } });
        this.callParent(arguments);
    },
    _afterRender: function() {
        this.callParent(arguments);
        this.mask();
        this.loadLog();
    }
});
Ext.define('sef.core.components.window.EditorGridDialog', {
    extend: sef.core.components.window.BaseDialog,
    xtype: 'sef-editorgriddialog',
    closable: false,
    width: 600,
    height: 400,
    iconCls: 'x-fa fa-filter',
    bodyPadding: 0,
    config: { singleSelection: true, quickSearch: null, columns: null, store: null, rowEditable: false, autoSave: true },
    initComponent: function() {
        var title = this.title;
        if (!title) {
            title = this.rowEditable === true ? _('数据编辑') : _('数据查看');
        }
        if (this.rowEditable === true) {
            title += '\x3csmall\x3e(双击可以修改数据)\x3c/small\x3e';
        }
        Ext.apply(this, { title: title, items: { xtype: 'sef-editordatagrid', autoSave: this.autoSave, store: this.store, model: this.model, columns: this.columns, colConfig: this.colConfig, quickSearchInPaging: !!this.quickSearch, quickSearchFields: this.quickSearch, showCheckbox: !this.singleSelection, rowEditable: this.rowEditable } });
        this.callParent(arguments);
    }
});
Ext.define('sef.core.components.window.ExportDialog', {
    extend: sef.core.components.window.BaseDialog,
    xtype: 'sef-exportdialog',
    title: _('数据导出'),
    closable: false,
    width: 400,
    height: 400,
    iconCls: 'x-fa fa-download',
    config: { url: '', store: null, fileTypes: 0, prefix: 'export', defaultFileName: '', columns: [], include: [] },
    initComponent: function() {
        if (this.fileTypes < 1) {
            this.fileTypes = sef.runningCfg.FILE_TYPES.CSV | sef.runningCfg.FILE_TYPES.EXCEL | sef.runningCfg.FILE_TYPES.PDF;
        }
        if (Ext.isEmpty(this.defaultFileName)) {
            this.defaultFileName = this.prefix + '_' + Ext.Date.format(new Date, 'Ymdhisu');
        }
        if (!this.columns || this.columns.length == 0) {
            var me = this;
            var fields = this.getStore().model.getFields();
            fields.forEach(function(f) {
                if (f.name && f.stype != 'asso' && f.name != 'ID') {
                    me.columns.push(f.name);
                }
            });
        }
        Ext.apply(this, { items: { xtype: 'sef-exportpanel', store: this.store, url: this.url, fileTypes: this.fileTypes, columns: this.columns, include: this.include, defaultFileName: this.defaultFileName, scrollable: 'y' } });
        this.callParent(arguments);
    }
});
Ext.define('sef.core.components.window.ExportPanel', {
    extend: Ext.form.Panel,
    xtype: 'sef-exportpanel',
    mixins: [sef.core.interfaces.IDialogContent],
    layout: { type: 'vbox', align: 'stretch' },
    defaults: { labelAlign: 'top' },
    config: { store: null, fileTypes: 0, defaultFileName: '', columns: [], include: [] },
    makeDialogResult: function() {
        var me = this,
            result = this.getForm().getFieldValues();
        result.Export = {};
        result.Export.Columns = this.columns;
        result.Include = this.include;
        if (result.DataRange === 1) {
            var selected = this.store.Selected;
            if (selected) {
                result.Export.Ids = selected.map(function(r) {
                    return r.get('ID');
                });
            } else {
                sef.dialog.error('请选择数据行');
                return;
            }
        } else {
            var fso = [];
            var fs = this.store.getFilters();
            if (fs) {
                fs.each(function(f) {
                    fso.push(f.serialize());
                });
            }
            if (Ext.isFunction(this.store.additionFilterFn)) {
                fs = this.store.additionFilterFn();
                if (fs) {
                    fs.forEach(function(f) {
                        fso.push(f);
                    });
                }
            }
            result.Filter = fso;
        }
        sef.utils.ajax({
            url: me.url,
            method: 'POST',
            jsonData: result,
            scope: me,
            success: function(result) {
                if (result.Url) {
                    window.open(result.Url, '_blank');
                }
                me.closeDialog(true, { Url: result.Url });
            },
            failure: function(err, resp) {
                sef.dialog.error(err.message);
                me.setDialogLoading(false, false);
            }
        });
        return null;
    },
    initComponent: function() {
        var fileTypeItems = [];
        var i = 0;
        for (var c in sef.runningCfg.FILE_TYPES) {
            var sc = sef.runningCfg.FILE_TYPES[c];
            if ((sc & this.fileTypes) === sc) {
                fileTypeItems.push({ boxLabel: c, checked: i++ < 1, name: 'FileType', inputValue: sc });
            }
        }
        var items = [{ xtype: 'radiogroup', fieldLabel: _('数据范围'), vertical: true, name: 'DataRange', items: [{ boxLabel: _('当前选择的行'), checked: true, name: 'DataRange', inputValue: 1 }, { boxLabel: _('当前查询条件'), name: 'DataRange', inputValue: 2 }] }, { xtype: 'radiogroup', fieldLabel: _('文件类型'), vertical: true, name: 'FileType', items: fileTypeItems }, { xtype: 'textfield', name: 'FileName', value: this.defaultFileName, fieldLabel: _('文件名称') }];
        Ext.apply(this, { items: items });
        this.callParent(arguments);
        this.initDialog();
    }
});
Ext.define('sef.core.components.window.LockingWindow', { extend: Ext.window.Window, xtype: 'sef-lockingwindow', ui: 'sefu-lockingwindow', title: null, header: false, closable: false, resizable: false, autoShow: true, maximized: true, modal: true, layout: { type: 'vbox', align: 'center', pack: 'center' } });
Ext.define('sef.core.components.window.LookupDialog', {
    extend: sef.core.components.window.BaseDialog,
    xtype: 'sef-lookupdialog',
    title: _('选择数据'),
    closable: false,
    width: 600,
    height: 400,
    iconCls: 'x-fa fa-filter',
    bodyPadding: 0,
    config: { singleSelection: true, quickSearch: null, columns: null, store: null },
    initComponent: function() {
        Ext.apply(this, { items: { xtype: 'sef-lookupdatagrid', store: this.store, model: this.model, columns: this.columns, quickSearchInPaging: !!this.quickSearch, quickSearchFields: this.quickSearch, showCheckbox: !this.singleSelection } });
        this.callParent(arguments);
    }
});
Ext.define('sef.core.components.window.PrintDialog', {
    extend: sef.core.components.window.BaseDialog,
    xtype: 'sef-printdialog',
    title: _('打印'),
    closable: false,
    width: '80%',
    height: '80%',
    iconCls: 'x-fa fa-print',
    config: { url: '', cancelText: '', okText: _('关闭') },
    initComponent: function() {
        Ext.apply(this, { items: { xtype: 'component', layout: 'fit', autoEl: { tag: 'iframe', src: this.url, frameborder: 0, width: '100%', height: '100%' } } });
        this.callParent(arguments);
    }
});
Ext.define('sef.core.components.window.UpdateLogDialog', {
    extend: sef.core.components.window.BaseDialog,
    xtype: 'sef-updatedialog',
    title: _('更新日志'),
    closable: false,
    width: 400,
    height: 400,
    iconCls: 'x-fa fa-tag',
    dynamicContent: true,
    config: { url: '', cancelText: '', okText: _('关闭') },
    loadLog: function() {
        var me = this;
        sef.utils.ajax({
            url: this.url,
            method: 'POST',
            scope: me,
            success: function(result) {
                if (Ext.isArray(result)) {
                    result.forEach(function(r) {
                        if (r.Date) {
                            var d = Ext.Date.parse(r.Date, 'c');
                            r.Date = Ext.Date.format(d, 'm/d/Y');
                        }
                        if (r.Desc) {
                            var ds = r.Desc.split('\x3cbr/\x3e');
                            var dds = [];
                            ds.forEach(function(d) {
                                dds.push('\x3cli\x3e' + d + '\x3c/li\x3e');
                            });
                            r.Desc = '\x3cul\x3e' + dds.join('') + '\x3c/ul\x3e';
                            dds = null;
                            ds = null;
                        }
                    });
                }
                this.down('#logBox').setData(result);
                this.unmask();
            },
            failure: function(err, resp) {
                this.unmask();
            }
        });
        return;
    },
    initComponent: function() {
        Ext.apply(this, { items: { xtype: 'box', layout: 'fit', itemId: 'logBox', scrollable: 'y', data: {}, cls: 'sef-updatelog', tpl: ['\x3ctpl for\x3d"."\x3e', '\x3cdiv class\x3d"line-item"\x3e', '\x3cdiv class\x3d"ver"\x3e{Ver}\x3c/div\x3e', '\x3cdiv class\x3d"date"\x3e{Date}\x3c/div\x3e', '\x3cdiv class\x3d"desc"\x3e{Desc}\x3c/div\x3e', '\x3c/div\x3e', '\x3c/tpl\x3e'] } });
        this.callParent(arguments);
    },
    afterRender: function() {
        this.callParent(arguments);
        this.mask();
        this.loadLog();
    }
});
Ext.define('sef.core.data.ApiProxy', {
    extend: Ext.data.proxy.Rest,
    alias: 'proxy.sef-apiproxy',
    config: {
        actionMethods: { create: 'POST', read: 'POST', update: 'POST', destroy: 'POST' },
        paramsAsJson: true,
        filterParam: window.SEF_LIB_CFG.filterParam || 'Filter',
        limitParam: window.SEF_LIB_CFG.limitParam || 'Limit',
        pageParam: window.SEF_LIB_CFG.pageParam || 'Page',
        startParam: window.SEF_LIB_CFG.startParam || 'Start',
        sortParam: window.SEF_LIB_CFG.sortParam || 'Sort',
        directionParam: window.SEF_LIB_CFG.directionParam ||
            'SortDir'
    },
    reader: { type: 'sef-jsonreader' },
    writer: { type: 'sef-jsonwriter' },
    getParams: function(operation) {
        var p = this.callParent(arguments);
        if (operation.bootFilters) {
            if (!p[this.filterParam]) {
                p[this.filterParam] = [];
            }
            if (!Ext.isArray(operation.bootFilters)) {
                p[this.filterParam] = Ext.Array.merge(p[this.filterParam], [operation.bootFilters]);
            } else {
                p[this.filterParam] = Ext.Array.merge(p[this.filterParam], operation.bootFilters);
            }
        }
        return p;
    },
    buildUrl: function(request) {
        var me = this,
            operation = request.getOperation(),
            records = operation.getRecords(),
            format = me.getFormat(),
            url = me.getUrl(request),
            id, params;
        var action = operation.action;
        if (/\.json$/.test(url)) {
            url = url.replace('.json', '.' + action + '.json');
        } else {
            if (!url.match(me.slashRe)) {
                url += '/';
            }
            url += action;
        }
        if (format) {
            if (!url.match(me.periodRe)) {
                url += '.';
            }
            url += format;
        }
        request.setUrl(url);
        return url;
    },
    getReadSingleUrl: function(id) {
        var me = this,
            url = this.getUrl();
        var action = 'single';
        if (/\.json$/.test(url)) {
            url = url.replace('.json', '.' + action + '.' + id + '.json');
        } else {
            if (!url.match(me.slashRe)) {
                url += '/';
            }
            url += action + '/' + id;
        }
        return url;
    }
});
Ext.define('sef.core.data.JsonWriter', {
    extend: Ext.data.writer.Json,
    alias: 'writer.sef-jsonwriter',
    rootProperty: 'Entity',
    writeRecords: function(request, data) {
        var req = this.callParent(arguments);
        var json = req.getJsonData() || {};
        var recs = request.getRecords();
        if (recs) {
            var mo = recs[0].modified;
            var ms = [];
            for (var m in mo) {
                ms.push(m);
            }
            json['Modified'] = ms;
        }
        req.setJsonData(json);
        return req;
    }
});
Ext.define('sef.core.data.ResultReader', {
    extend: Ext.data.reader.Json,
    alias: 'reader.sef-jsonreader',
    totalProperty: window.SEF_LIB_CFG.totalProperty || 'Total',
    successProperty: window.SEF_LIB_CFG.successProperty || 'Success',
    rootProperty: window.SEF_LIB_CFG.rootProperty || 'ResultList',
    messageProperty: window.SEF_LIB_CFG.messageProperty || 'Message',
    exDataProperty: '',
    readRecordsOnFailure: false,
    exData: null,
    exResult: null,
    _read: function(resp, readOptions) {
        var data = this.callParent(arguments);
        return data;
    },
    getResponseData: function(response) {
        var d = this.callParent(arguments);
        if (!Ext.isEmpty(this.exDataProperty)) {
            if (d && d['__$isError'] !== true) {
                this.exData = d[this.exDataProperty];
            }
        }
        if (d) {
            this.exResult = d['Result'];
        }
        return d;
    }
});
Ext.define('sef.core.data.Store', {
    extend: Ext.data.Store,
    alias: 'store.sef-store',
    autoDestroy: true,
    autoLoad: false,
    remoteFilter: true,
    remoteSort: true,
    pageSize: window.SEF_LIB_CFG.pageSize || 50,
    config: { additionFilterFn: null, include: null, jsonData: null },
    getExData: function() {
        return this.getProxy().getReader().exData;
    },
    makeQuerys: function(qs, forAdd, forReload) {
        if (!Ext.isArray(qs)) {
            qs = [qs];
        }
        var filters = [];
        qs.forEach(function(q) {
            var property = q['FieldName'];
            var value = q['Values'];
            var rel = q['Rel'] || 'Or';
            var operator = q['Operator'] || 6;
            filters.push({ property: property, value: value, rel: rel, operator: operator });
        });
        if (forAdd === true) {
            this.addFilter(filters, forReload);
        } else {
            this.clearFilter(false);
            this.addFilter(filters, !(forReload !== false));
        }
    },
    makeQuery: function(qObj, isOr, forAdd, forReload) {
        if (!qObj) {
            this.clearFilter();
            return;
        }
        var filters = [];
        for (var q in qObj) {
            var qv = qObj[q];
            if (!qv) {
                continue;
            }
            filters.push({ property: q, value: qv, rel: isOr === true ? 'Or' : 'And', operator: 6 });
        }
        if (forAdd === true) {
            this.addFilter(filters, forReload);
        } else {
            this.clearFilter(false);
            this.addFilter(filters, !(forReload !== false));
        }
    },
    constructor: function(config) {
        if (!config.url) {
            var mname = config.model;
            if (mname) {
                var ma = mname = mname.split('.');
                var name = ma[ma.length - 1];
                name = name.replace(/Model$/, '');
                config.url = '/api/' + name;
            }
        }
        if (!config.proxy) {
            config.proxy = { type: 'sef-apiproxy', url: config.url };
        }
        this.callParent([config]);
        var me = this;
        this.on('beforeload', function(store, oper) {
            oper.setParams({ Include: me.include, JsonData: me.jsonData });
            if (Ext.isFunction(this.additionFilterFn)) {
                var r = this.additionFilterFn();
                if (r) {
                    oper.bootFilters = r;
                }
            }
        });
    }
});
Ext.define('sef.core.interfaces.IAppPageContainer', {
    beforeReady: function() {
        var me = this;
        if (!this.store) {
            if (this.model) {
                this.store = Ext.create('store.sef-store', { model: this.model, url: this.api, storeId: me.id + '_store', additionFilterFn: this.additionFilterFn, include: me.include, autoLoad: true });
            }
        } else {
            if (this.store.className) {
                if (!this.store.storeId) {
                    this.store.setStoreId(me.id + '_store');
                }
            } else {
                Ext.applyIf(this.store, { storeId: me.id + '_store' });
            }
        }
    },
    afterReady: function() {},
    showAppView: function(pageName) {},
    makeAppViews: function() {
        var me = this,
            _views = this.views.map(function(v) {
                var newV = Ext.merge({}, v);
                newV.itemId = me.id + '_' + v.vname;
                newV._pid = me.id;
                return newV;
            });
        var c = {};
        if (this.tree) {
            var tree = Ext.merge({}, this.tree);
            Ext.apply(tree, { region: 'west' });
            Ext.applyIf(tree, { itemId: 'mainAppTree' });
            c = { layout: 'border', items: [tree, { references: 'appc', itemId: 'appc', xtype: 'panel', region: 'center', layout: { type: 'card', deferredRender: true }, items: _views }] };
        } else {
            c = { layout: { type: 'card', deferredRender: true }, references: 'appc', items: _views };
        }
        return c;
    },
    updateRoute: function(routeObj) {
        var viewName = routeObj.viewName || this.defaultView;
        var vid = this.id + '_' + viewName;
        var view = this.down('#' + vid);
        if (view) {
            this.routeToken.qObj = Ext.merge({}, routeObj.qObj);
            this.routeToken.viewName = viewName;
            this.routeToken.str = routeObj.str;
            var lay = null;
            if (this.tree) {
                lay = this.down('#appc').getLayout();
            } else {
                lay = this.getLayout();
            }
            lay.setActiveItem(view);
            view.updateRoute && view.updateRoute(routeObj);
        }
    }
});
Ext.define('sef.core.interfaces.IAppViewport', {
    showLogin: function() {},
    _makeLayout: function() {
        return null;
    }
});
Ext.define('sef.core.model.BaseModel', { extend: Ext.data.Model, idProperty: 'ID' });
Ext.define('sef.core.model.CheckboxTreeModel', {
    extend: Ext.data.TreeModel,
    fields: [{ name: 'checked', mapping: 'Checked' }, { name: 'text', mapping: 'Text' }, { name: 'expanded', mapping: 'Expanded' }, { name: 'children', mapping: 'Children' }, { name: 'leaf', mapping: 'Leaf' }, { name: 'iconCls', mapping: 'IconCls' }, { name: 'badge', mapping: 'IsBadge' }, { name: 'path', mapping: 'Path' }, { name: 'nodeType', mapping: 'NodeType' }, { name: 'data', mapping: 'Data' }, { name: 'DataID' }, { name: 'D1' }, { name: 'D2' }, { name: 'D3' }, { name: 'D4' },
        { name: 'cls', mapping: 'Cls' }
    ]
});
Ext.define('sef.core.model.TreeModel', { extend: Ext.data.TreeModel, fields: [{ name: 'text', mapping: 'Text' }, { name: 'expanded', mapping: 'Expanded' }, { name: 'children', mapping: 'Children' }, { name: 'leaf', mapping: 'Leaf' }, { name: 'iconCls', mapping: 'IconCls' }, { name: 'badge', mapping: 'IsBadge' }, { name: 'path', mapping: 'Path' }, { name: 'nodeType', mapping: 'NodeType' }, { name: 'data', mapping: 'Data' }, { name: 'DataID' }, { name: 'D1' }, { name: 'D2' }, { name: 'D3' }, { name: 'D4' }, { name: 'cls', mapping: 'Cls' }] });
Ext.define('sef.core.utils.Dialog', {
    open: function(cfg) {},
    formatContent: function(c) {
        if (!c.list) {
            return c;
        }
        var lstMsg = [];
        c.list.forEach(function(cm) {
            lstMsg.push('\x3cdiv class\x3d"msg-line"\x3e' + cm + '\x3c/div\x3e');
        });
        return "\x3cdiv class\x3d'msg-multi-list'\x3e" + lstMsg.join('') + '\x3c/div\x3e';
    },
    show: function(cfg) {
        var me = this,
            buttons = Ext.Msg.OK;
        if (cfg.type === 'confirm') {
            buttons = Ext.Msg.YESNO;
        }
        if (cfg.type === 'prompt' || cfg.type === 'mprompt') {
            buttons = Ext.Msg.OKCANCEL;
        }
        if (Ext.isObject(cfg.message)) {
            cfg.message = this.formatContent(cfg.message);
        }
        Ext.apply(cfg, {
            title: sef.runningCfg.getTitle(),
            closable: false,
            buttons: buttons,
            fn: function(btn, value) {
                if (btn === 'ok' || btn === 'yes') {
                    if (Ext.isFunction(cfg.onOK)) {
                        cfg.onOK(value);
                    }
                } else {
                    if (Ext.isFunction(cfg.onCancel)) {
                        cfg.onCancel.call();
                    }
                }
            }
        });
        Ext.Msg.show(cfg);
    }
}, function(dlgCls) {
    var types = ['success', 'error', 'warning', 'confirm', 'info', 'prompt', 'mprompt'];
    var dlg = new dlgCls;
    if (!sef.dialog) {
        sef.dialog = {};
        types.forEach(function(t) {
            sef.dialog[t] = function(content, title, onOK, onCancel, value) {
                if (t === 'confirm') {
                    icon = 'QUESTION';
                } else {
                    icon = t;
                }
                var cfg = { type: t, prompt: t === 'prompt' || t === 'mprompt', multiline: t === 'mprompt', icon: Ext.Msg[icon.toUpperCase()], value: value, title: title, message: content, onOK: onOK, onCancel: onCancel };
                if (t === 'mprompt') {}
                return dlg.show(cfg);
            };
        });
        sef.dialog.open = function(cfg) {
            return dlg.open(cfg);
        };
    }
});
Ext.define('sef.core.utils.Message', {
    privates: { __msg_types: { success: 'fa success fa-check-circle fa-fw', error: 'fa error fa-times-circle fa-fw', warning: 'fa warning fa-exclamation-triangle fa-fw', loading: 'fa loading fa-spinner fa-spin fa-fw' } },
    Message: function(type, content, duration, onClose) {
        if (!Ext.isNumber(duration)) {
            duration = 3000;
        }
        var me = this;
        var html = Ext.String.format('\x3cdiv class\x3d"sef-message"\x3e\x3cspan class\x3d"{0}"\x3e\x3c/span\x3e\x3cspan class\x3d"content"\x3e{1}\x3c/span\x3e\x3c/div\x3e', me.__msg_types[type], content);
        var toast = Ext.toast({ minHeight: 20, shadow: false, ui: 'sefu-message-toast', cls: Ext.baseCSSPrefix + 'toast sef-toast-' + type, html: html, align: 't', slideInAnimation: 'cubic-bezier(0.08, 0.82, 0.17, 1)', slideBackAnimation: 'cubic-bezier(0.6, 0.04, 0.98, 0.34)', slideInDuration: 200, slideBackDuration: 200, autoCloseDelay: duration });
        if (Ext.isFunction(onClose)) {
            toast.on('close', function(t) {
                onClose(t);
            });
        }
        return toast;
    },
    Notification: function(type, title, desc, duration, onClose, args) {
        if (!Ext.isNumber(duration)) {
            duration = 0;
        }
        if (duration < 1) {}
        var me = this;
        var toast = null;
        var titles = {
            xtype: 'container',
            layout: { type: 'hbox', align: 'stretch' },
            items: [{ xtype: 'box', flex: 1, cls: 'notify-header', html: title }, {
                xtype: 'button',
                iconCls: 'x-fa fa-times',
                ui: 'sefu-btn-close',
                handler: function() {
                    if (Ext.isFunction(onClose)) {
                        onClose(args);
                    }
                    toast.close();
                }
            }]
        };
        var icons = null;
        if (type) {
            icons = { xtype: 'box', html: Ext.String.format('\x3cspan class\x3d"{0}"\x3e\x3c/span\x3e', me.__msg_types[type]), _width: 50 };
        }
        var contents = { xtype: 'container', flex: 1, layout: { type: 'vbox', align: 'stretch' }, items: [titles, { xtype: 'box', cls: 'notify-desc', html: desc }] };
        var items = { xtype: 'container', padding: 10, layout: { type: 'hbox', align: 'stretch' }, items: [icons, contents] };
        toast = Ext.toast({ minHeight: 20, width: 320, paddingX: 10, paddingY: 40, shadow: false, ui: 'sefu-notify-toast', items: items, align: 'tr', slideInAnimation: 'cubic-bezier(0.08, 0.82, 0.17, 1)', slideBackAnimation: 'cubic-bezier(0.6, 0.04, 0.98, 0.34)', slideInDuration: 200, slideBackDuration: 200, autoCloseDelay: duration, autoClose: duration > 1 });
        return toast;
    }
}, function(msg) {
    var myToast = new msg;
    var types = ['success', 'error', 'warning', 'loading'];
    if (!sef.message) {
        sef.message = {};
        types.forEach(function(t) {
            sef.message[t] = function(content, duration, onClose) {
                return myToast.Message(t, content, duration, onClose);
            };
        });
    }
    if (!sef.notification) {
        sef.notification = {};
        types.forEach(function(t) {
            sef.notification[t] = function(title, desc, duration, onClose, args) {
                return myToast.Notification(t, title, desc, duration, onClose, args);
            };
        });
        sef.notification.open = function(title, desc, duration, onClose) {
            return myToast.Notification('', title, desc, duration, onClose);
        };
    }
});
Ext.define('sef.core.utils.RunningCfg', {
    privates: { __storeID: '__sef__ld__', _rawData: null, _ld: null, _user: { ID: 0, Token: '', Name: '', Email: '', Code: '', CompanyId: 0 } },
    loginDialogIsShowing: false,
    FILE_TYPES: { CSV: 2, EXCEL: 4, WORD: 8, PDF: 16 },
    searchOperator: { '\x3c': 1, '\x3c\x3d': 2, '\x3e': 3, '\x3e\x3d': 4, '\x3d\x3d': 5, 'like': 6, 'in': 7, 'not in': 8, '!\x3d': 9, LessThan: 1, LessThanOrEqual: 2, GreaterThan: 3, GreaterThanOrEqual: 4, Equal: 5, Like: 6, In: 7, NotIn: 8, NotEqual: 9 },
    logicalRelOperator: {
        And: 1,
        Or: 2,
        Not: 3
    },
    BUTTONS: {
        CREATE: { text: '创建', xtype: 'sef-actionbutton', actionName: 'create', btnType: 'primary', dataAction: false },
        EDIT: { text: '编辑', xtype: 'sef-actionbutton', actionName: 'edit', btnType: 'default', dataAction: true },
        DELETE: { text: '删除', xtype: 'sef-actionbutton', actionName: 'delete', btnType: 'default', dataAction: true },
        REFRESH: { text: '刷新', command: 'refresh', xtype: 'sef-actionbutton', actionName: 'refresh', btnType: 'default', dataAction: false },
        EXPORT: {
            text: '导出',
            xtype: 'sef-actionbutton',
            actionName: 'export',
            btnType: 'default',
            dataAction: false
        },
        SAVE: { text: '保存', xtype: 'sef-actionbutton', actionName: 'save', btnType: 'primary', dataAction: false },
        EDIT_INFORM: { text: '编辑', xtype: 'sef-actionbutton', actionName: 'edit', btnType: 'default', dataAction: true },
        DEL_INFORM: { text: '删除', xtype: 'sef-actionbutton', actionName: 'delete', btnType: 'default', dataAction: true },
        PRINT: { text: '打印', xtype: 'sef-actionbutton', actionName: 'print', btnType: 'default', dataAction: true },
        COPY: {
            text: '复制',
            xtype: 'sef-actionbutton',
            actionName: 'print',
            btnType: 'default',
            dataAction: true
        }
    },
    update: function(newCfg) {
        if (!this._rawData) {
            this._rawData = window.__sg__sef_runningcfg__;
        }
        if (newCfg) {
            Ext.apply(this._rawData, newCfg);
        }
    },
    get: function(key, dftValue) {
        var v = this._rawData && this._rawData[key];
        if (v) {
            return v;
        }
        return dftValue;
    },
    getUser: function() {
        return this._user;
    },
    getLang: function() {
        var lang = this.getLocal('LANG', false) || this.get('LANG');
        return lang;
    },
    getUIMode: function() {
        var uiMode = this.getLocal('UIMode', false) || this.get('DefaultUIMode');
        return uiMode;
    },
    changeUIMode: function(newMode) {
        if (!newMode) {
            newMode = this.getUIMode() === 'l-t' ? 't-b' : 'l-t';
        }
        this.addLocal('UIMode', newMode);
    },
    changeLang: function(newLang) {
        if (!newLang) {
            newLang = this.getLang() === 'cn' ? 'en' : 'cn';
        }
        this.addLocal('LANG', newLang);
    },
    setUser: function(u) {
        if (u) {
            Ext.apply(this._user, u);
            this.addLocal('LAST_LOGIN_USER', this._user);
        }
    },
    clearUser: function(silient) {
        var id = this.getUser().ID;
        this.setUser({ ID: 0, Token: '', Name: '' });
        if (silient !== true) {
            var url = sef.runningCfg.get('LogoutApi', '/api/logout');
            sef.utils.ajax({
                url: url,
                method: 'POST',
                jsonData: { UserID: id },
                success: function() {
                    if (sef.runningCfg.loginDialogIsShowing === true) {
                        return;
                    }
                    window.location.reload();
                }
            });
        } else {
            window.location.reload();
        }
    },
    getTitle: function() {
        return this._rawData && this._rawData['Title'];
    },
    getVersion: function() {},
    addLocal: function(key, value) {
        if (Ext.isString(value)) {
            this._ld.setItem(key, value);
        } else {
            this._ld.setItem(key, Ext.JSON.encode(value));
        }
    },
    getLocal: function(key, decode) {
        var v = this._ld.getItem(key);
        if (v) {
            if (decode !== false) {
                v = Ext.JSON.decode(v);
            }
        }
        return v;
    },
    init: function() {
        this.update();
        this._ld = Ext.util.LocalStorage.get(this.__storeID);
        if (this._ld == null) {
            this._ld = new Ext.util.LocalStorage({ id: this.__storeID });
        }
        var u = this.getLocal('LAST_LOGIN_USER');
        this.setUser(u);
    },
    initCfg: function(cb) {
        var url = this._rawData.ProfileApi;
        sef.utils.ajax({
            url: url,
            method: 'GET',
            success: function(result, resp) {
                sef.runningCfg.update(result);
                cb && cb(true);
            },
            failure: function(err, resp) {
                cb && cb(false, err);
            }
        });
    }
}, function(cfgCls) {
    if (!sef.runningCfg) {
        sef.runningCfg = new cfgCls;
        sef.runningCfg.init();
    }
});
Ext.define('sef.core.utils.Utils', {
    isCnText: function(str) {
        var reg = /^[\u4E00-\u9FA5]+$/;
        return reg.test(str);
    },
    setDocTitle: function(title) {
        document.title = title;
    },
    formatError: function(errResult) {
        var err = { code: 0, message: '', source: errResult };
        if (errResult) {
            if (errResult.$className === 'Ext.data.Batch') {
                var berr = errResult.exceptions[0];
                if (Ext.isObject(berr.error)) {
                    err.code = berr.error['status'];
                    if (err.code === 404) {
                        err.message = Ext.String.format('未找到指定的服务');
                    }
                } else {
                    if (Ext.isString(berr.error)) {
                        err.message = berr.error;
                    }
                }
            } else {
                if (errResult['responseText'] && errResult['request']) {
                    err.code = errResult['status'];
                    if (err.code === 404) {
                        err.message = Ext.String.format('未找到指定的服务\n{0}', errResult.request.url);
                    }
                } else {
                    err.message = errResult.Message;
                }
            }
        }
        return err;
    },
    makeTokenHash: function(token, appendTicks) {
        if (Ext.isEmpty(token)) {
            token = '/dashboard';
        } else {
            if (/^sef\./.test(token)) {
                token = token.replace(/^sef\.app/g, '.app');
                token = token.replace(/^sef\.core/g, '.core');
                token = token.replace(/\./gi, '/');
            }
        }
        if (appendTicks === true) {
            token += '?_t\x3d' + +new Date;
        }
        return token;
    },
    decodeHash: function(hashStr) {
        var hObj = { str: hashStr, qObj: {}, appName: '', appCls: '', appId: '', viewName: '' };
        if (Ext.isEmpty(hashStr)) {
            hashArr = 'dashboard?t\x3d' + new Date;
        }
        if (/\/dashboard/.test(hashStr)) {
            var dashboard = sef.runningCfg.get('Dashboard', 'sef.app.liftnext.dashboard.DefaultDashboard');
            dashboard = dashboard.replace('sef.', '.');
            dashboard = dashboard.replace(/\./g, '/');
            hashStr = dashboard;
        }
        var hashArr = hashStr.split('?');
        hObj.appName = hashArr[0];
        if (hashArr.length > 1) {
            var qStr = hashArr[1];
            var qObj = Ext.Object.fromQueryString(qStr);
            for (var p in qObj) {
                var cp = p.toLowerCase();
                hObj.qObj[cp] = qObj[p];
            }
            delete qObj;
            qObj = null;
            hObj.viewName = hObj.qObj['viewname'];
        }
        if (/^\/app/.test(hObj.appName) || /^\/core/.test(hObj.appName)) {
            var name = hObj.appName.replace(/^\/app/, 'sef/app');
            name = name.replace(/^\/core/, 'sef.core');
            hObj.appName = name;
            hObj.appCls = name.replace(/\//g, '.');
            hObj.appId = hObj.appCls.replace(/\./g, '_').toLowerCase();
        }
        return hObj;
    },
    encodeHash: function(hashObj, qObj) {
        if (!hashObj) {
            return '';
        }
        if (Ext.isString(hashObj)) {
            var str = hashObj;
            hashObj = { str: '', qObj: {} };
            str = str.replace(/^sef\.app/, '.app');
            str = str.replace(/^sef\.core/, '.core');
            str = str.replace(/\./g, '/');
            hashObj.str = str;
        }
        var _qobj = Ext.merge({}, hashObj.qObj);
        qObj = qObj || {};
        for (var p in qObj) {
            var lp = p.toLowerCase();
            var o = {};
            o[lp] = qObj[p];
            Ext.apply(_qobj, o);
        }
        var qString = Ext.Object.toQueryString(_qobj);
        var oldStr = hashObj.str.split('?')[0];
        if (Ext.isEmpty(qString)) {
            return oldStr;
        }
        return oldStr + '?' + qString;
    },
    getModelMeta: function(model) {
        var entity = null;
        if (Ext.isString(model)) {
            entity = Ext.data.schema.Schema.instances['default'].getEntity(model);
        } else {
            entity = model;
        }
        var fields = entity.getFields();
        var metas = [];
        fields.forEach(function(f, i) {
            var ctype = f.getSType();
            var cfg = { isId: f.name === entity.idProperty, invisible: f.invisible === true, name: f.name, text: f.text || f.name, type: ctype, sassb: f.sassb, index: f.index, assoName: '' };
            if (cfg.isId) {
                cfg['type'] = 'bigint';
            }
            if (ctype === 'DateTime') {
                cfg['renderer'] = sef.utils.dateRenderer;
            }
            if (ctype === 'enum') {
                cfg['renderer'] = sef.utils.enumRenderer(f.sassb);
            }
            metas.push(cfg);
        });
        metas.sort(function(m1, m2) {
            return m1.index - m2.index;
        });
        return metas;
    },
    dateRenderer: function(v) {
        return Ext.util.Format.date(v, 'm/d/Y');
    },
    timeRenderer: function(v) {
        return Ext.util.Format.date(v, 'H:i:s');
    },
    relRenderer: function(field) {
        return function(v) {
            if (v) {
                return v[field];
            }
            return 'N/A';
        };
    },
    enumRenderer: function(enumType) {
        return function(v) {
            var types = enumType.split(',');
            var enumName = types[0];
            enumName = enumName.replace(/\./g, '_');
            var data = window.sef_static_data[enumName];
            var tv = '';
            data.forEach(function(dv) {
                if (dv.Value === v) {
                    tv = dv.Text;
                    return false;
                }
            });
            return tv;
        };
    },
    dateTimeRenderer: function(v) {
        return Ext.util.Format.date(v, 'm/d/Y H:i:s');
    },
    ajax: function(opt) {
        var cfg = Ext.merge({ method: 'POST', defaultHeaders: { 'x-sef': 'true', 'ID': sef.runningCfg.getUser().ID, 'TOKEN': sef.runningCfg.getUser().Token } }, opt);
        var success = cfg['success'];
        var failure = cfg['failure'];
        var scope = cfg['scope'];
        delete cfg['success'];
        delete cfg['failure'];
        delete cfg['scope'];
        return Ext.Ajax.request(cfg).then(function(resp, opts) {
            var o = Ext.JSON.decode(resp.responseText);
            if (o.Success === true) {
                if (success) {
                    success.call(scope, o.Result, o);
                }
            } else {
                failure && failure.call(scope, sef.utils.formatError(o));
            }
        }, function(errResp, opts) {
            if (failure) {
                failure.call(scope, sef.utils.formatError(errResp));
            }
        });
    }
}, function(cls) {
    if (!sef.utils) {
        sef.utils = new cls;
    }
});
Ext.define('sef.core.view.appcontainer.AppPageContainer', {
    extend: Ext.panel.Panel,
    xtype: 'sef-apppagecontainer',
    mixins: [sef.core.interfaces.IAppPageContainer],
    config: { closable: true, views: null, model: null, defaultView: 'list', tree: null },
    initComponent: function() {
        this.beforeReady();
        var me = this,
            c = this.makeAppViews();
        Ext.apply(this, c);
        this.callParent(arguments);
        var tree = this.down('#mainAppTree');
        if (tree) {
            tree.on('itemclick', function(tv, rec) {
                if (Ext.isFunction(this.onTreeItemClick)) {
                    this.onTreeItemClick.call(this, tree, rec);
                }
            }, this);
        }
        this.afterReady();
    },
    onRender: function() {
        this.mask(_('正在初始化...'));
        this.callParent(arguments);
    },
    afterRender: function() {
        this.unmask();
        this.callParent(arguments);
    }
});
Ext.define('sef.core.view.appcontainer.TabAppContainer', { extend: Ext.tab.Panel, xtype: 'sef-tabappcontainer', ui: 'sefu-maintabpanel', defaults: { margin: 10, layout: 'fit' } });
Ext.define('sef.core.view.main.Main', { extend: Ext.panel.Panel, xtype: 'app-main', title: 'SEF', layout: { type: 'vbox' }, items: [{ html: '中文字体' }, { flex: 1, html: '\x3cdiv class\x3d"cctv"\x3ehere is cctv\x3c/div\x3e' }] });
Ext.define('sef.core.view.security.LoginCtrl', {
    extend: Ext.app.ViewController,
    alias: 'controller.sefc-loginctrl',
    init: function() {
        var cfg = window.__sg__sef_runningcfg__;
        this.getViewModel().setData(cfg);
        var loginInfo = sef.runningCfg.getLocal('LOGIN_INFO');
        if (loginInfo) {
            this.getViewModel().setData(loginInfo);
        }
    },
    onFieldKeyDown: function(field, key) {
        if (key.getKey() === Ext.event.Event.ENTER) {
            if (field.reference === 'loginName') {
                this.lookupReference('loginPwd').focus();
            } else {
                this.onLogin(this.lookupReference('btnLogin'));
            }
        }
    },
    onLogin: function(btn) {
        var me = this,
            refs = this.getReferences();
        var loginName = refs.loginName.value;
        var loginPwd = refs.loginPwd.value;
        var withAD = refs.withAD.checked;
        var remMe = refs.rememberMe.checked;
        if (Ext.isEmpty(loginName) || Ext.isEmpty(loginPwd)) {
            sef.message.error(_('无效的用户名和密码'));
            return;
        }
        btn.setLoading(true);
        sef.utils.ajax({
            url: sef.runningCfg.get('LoginApi'),
            method: 'POST',
            paramAsJson: true,
            jsonData: { UserName: loginName, UserPwd: loginPwd, WithAD: withAD, RememberMe: remMe, UIMode: sef.runningCfg.getUIMode() },
            scope: me,
            success: function(result) {
                sef.runningCfg.setUser(result);
                sef.runningCfg.addLocal('LOGIN_INFO', { LastLoginName: loginName });
                this.fireViewEvent('loginsuccess');
            },
            failure: function(err, resp) {
                sef.dialog.error(err.message);
                btn.setLoading(false);
                console.log('login error', err);
            }
        });
        return;
        sef.dialog.error('用户密码或密码错误', 'title', function() {
            btn.setLoading(false);
        });
        return;
        sef.notification.success('系统提示', 'I will never close automatically. I will be close automatically. I will never close automatically.');
        sef.notification.error('系统提示', 'I will never close automatically. I will be close automatically. I will never close automatically.');
        sef.notification.warning('系统提示', 'I will never close automatically. I will be close automatically. I will never close automatically.');
        sef.notification.open('系统提示', 'I will never close automatically. I will be close automatically. I will never close automatically.');
        return;
        sef.message.success('hello,world,here is long text test', 4000, function(t) {
            btn.setLoading(false);
        });
        sef.message.error('here is error');
        sef.message.warning('here is warning');
    }
});
Ext.define('sef.core.view.security.LoginForm', {
    extend: Ext.container.Container,
    xtype: 'sef-loginform',
    layout: { type: 'vbox', align: 'stretch' },
    minWidth: 400,
    padding: '30px 30px 60px 30px',
    defaultFocus: 'textfield:focusable:not([hidden]):not([disabled]):not([value])',
    cls: 'sef-loginform-container',
    makeRememberMe: function() {
        return { xtype: 'container', layout: { type: 'hbox', align: 'stretch' }, margin: '0 0 12px 0', items: [{ xtype: 'checkbox', boxLabel: _('Login with AD'), flex: 1, reference: 'withAD', bind: { hidden: '{!EnableAd}' } }, { xtype: 'checkbox', reference: 'rememberMe', boxLabel: _('Remember me') }] };
    },
    makeLoginForm: function() {
        var items = [{ xtype: 'box', cls: 'loginform-logo', html: '\x3cspan class\x3d"logo"\x3e\x3c/span\x3e' }, { xtype: 'textfield', ui: 'sefu-login-field', emptyText: _('用户名'), reference: 'loginName', margin: '0 0 20px 0', bind: { value: '{LastLoginName}' }, enableKeyEvents: true, minLength: 6, listeners: { keydown: 'onFieldKeyDown' } }, { xtype: 'textfield', ui: 'sefu-login-field', inputType: 'password', reference: 'loginPwd', emptyText: _('密码'), margin: '0 0 20px 0', enableKeyEvents: true, value: '', minLength: 6, listeners: { keydown: 'onFieldKeyDown' } },
            this.makeRememberMe(), { reference: 'btnLogin', xtype: 'button', scale: 'medium', text: 'Login', handler: 'onLogin' }
        ];
        return items;
    },
    initComponent: function() {
        Ext.apply(this, { items: this.makeLoginForm() });
        return this.callParent(arguments);
    }
});
Ext.define('sef.core.view.security.LoginWindow', {
    extend: sef.core.components.window.LockingWindow,
    xtype: 'sef-loginwindow',
    cls: 'sef-loginwindow',
    border: 0,
    onEsc: Ext.emptyFn,
    defaultFocus: 'sef-loginform',
    controller: 'sefc-loginctrl',
    viewModel: { data: { LastLoginName: '' } },
    items: [{ xtype: 'box', cls: 'welcome-title', bind: { html: '{Greeting}' } }, { xtype: 'sef-loginform' }, {
        xtype: 'container',
        layout: { type: 'hbox', align: 'stretch' },
        items: [{ xtype: 'box', cls: 'language-option', html: '\x3cul\x3e\x3cli\x3e\x3ca href\x3d"#" class\x3d"current"\x3e中文\x3c/a\x3e\x3c/li\x3e\x3cli\x3e\x3ca href\x3d"#"\x3eEnglish\x3c/a\x3e\x3c/li\x3e\x3c/ul\x3e' },
            { xtype: 'box', minWidth: 180, html: '\x26nbsp;' }, { xtype: 'box', cls: 'copyright-box', html: '\x3cspan class\x3d"text"\x3ePowerd by\x3c/span\x3e \x3cspan class\x3d"logo"\x3e\x3c/span\x3e' }
        ]
    }]
});
Ext.define('sef.core.view.viewport.MDIViewport', {
    extend: Ext.container.Container,
    mixins: [sef.core.interfaces.IAppViewport],
    controller: 'sefc-mdivp',
    viewModel: 'sefv-mainvm',
    makeTopBar: function() {
        return { xtype: 'sef-maintopbar', region: 'north' };
    },
    makeSideMenuBar: function() {
        return { region: 'west', reference: 'mainMenuTree', xtype: 'sef-mainmenutree', store: Ext.create('Ext.data.TreeStore', { model: 'sef.core.model.TreeModel', proxy: { type: 'memory' } }), listeners: { itemClick: 'onMenuSelectionChange' } };
    },
    makeMdiContainer: function() {
        return { region: 'center', xtype: 'sef-tabappcontainer', reference: 'mainAppContainer', listeners: { 'beforetabchange': 'onBeforeTabChangeHandler' } };
    },
    makeLayout: function() {
        var l = { layout: 'border', items: [this.makeTopBar(), this.makeSideMenuBar(), this.makeMdiContainer()] };
        return l;
    },
    initComponent: function() {
        Ext.apply(this, this.makeLayout());
        try {
            this.callParent(arguments);
        } catch (err) {}
    }
});
Ext.define('sef.core.view.viewport.ViewportCtrl', {
    extend: Ext.app.ViewController,
    privates: { _task: null, _internalInited: false, _loadingToast: null, _appContainer: null, _existApp: null, _lastClickTabRouteId: '', _msgDelayCount: 0 },
    listen: { controller: { '#': { unmatchedroute: 'onRouteChange' } } },
    control: { '#': { afterrender: 'onViewportReady', beforeDestroy: 'onViewportBeforeDestroy' } },
    closeActiveDialog: function() {
        var curDialog = Ext.WindowManager.getActive();
        if (curDialog && curDialog.isWindow) {
            curDialog.destroy();
        }
    },
    showLoginDialog: function() {
        if (sef.runningCfg.loginDialogIsShowing === true) {
            return;
        }
        this.closeActiveDialog();
        var me = this,
            dialog = Ext.create('sef.core.view.security.LoginWindow', { width: 300, height: 300 });
        dialog.on('loginsuccess', function() {
            sef.runningCfg.loginDialogIsShowing = false;
            dialog.close();
            me.redirectTo(sef.utils.makeTokenHash('', true));
        });
        sef.runningCfg.loginDialogIsShowing = true;
        dialog.show();
    },
    onRouteChange: function(token) {
        if (sef.runningCfg.getUser().ID < 1) {
            this.showLoginDialog();
            return;
        }
        this.internalInit();
        var tObj = sef.utils.decodeHash(token);
        if (Ext.isEmpty(tObj.appCls)) {
            return;
        }
        this._loadingToast = sef.message.loading('loading app...', 10000000);
        this.switchApp(tObj);
    },
    showDashboard: function() {},
    switchApp: function(tokenObj) {
        this._existApp = this._appContainer.down('#' + tokenObj.appId);
        if (!this._existApp) {
            var me = this;
            Ext.require(tokenObj.appCls, function(loaderCls) {
                var newView = Ext.create(loaderCls, { routeId: tokenObj.appId, itemId: tokenObj.appId, routeToken: tokenObj, cls: 'sef-apppage-panel', tabConfig: { tRouteId: tokenObj.appId, listeners: { scope: me, 'click': me.onTabClickHandler, 'beforeclose': me.onTabBeforeClose } } });
                this.showApp(newView, tokenObj, true);
            }, me);
        } else {
            this.showApp(this._existApp, tokenObj, false);
        }
    },
    showApp: function(app, tokenObj, isNew) {
        var me = this;
        this.closeActiveDialog();
        if (!app.isWindow) {
            if (isNew) {
                Ext.suspendLayouts();
                this._existApp = this._appContainer.add(app);
                Ext.resumeLayouts(true);
            }
            tokenObj && this._existApp.updateRoute(tokenObj);
            this._appContainer.setActiveTab(this._existApp);
            if (this._appContainer.items.length === 1) {
                var tab = this._appContainer.getActiveTab();
                var firstEl = tab.getEl();
                if (firstEl.hasCls('x-hidden-offsets') === true) {
                    firstEl.removeCls('x-hidden-offsets');
                }
            }
        }
        this._loadingToast.close();
        this._loadingToast.destroy();
        this._loadingToast = null;
    },
    onMenuSelectionChange: function(view, node) {
        if (node.isLeaf()) {
            this.willOpenNewApp(node.get('path') || node.get('url'));
        } else {
            if (node.isExpanded()) {
                node.collapse();
            } else {
                node.expand();
            }
        }
    },
    willOpenNewApp: function(path) {
        if (this._loadingToast) {
            sef.message.error(_('当前正在加载，请稍候', 1000));
            return;
        }
        var to = path;
        if (true) {
            this.redirectTo(sef.utils.makeTokenHash(to));
        }
    },
    init: function() {},
    updateMenuTree: function() {
        var mainMenuTree = this.lookupReference('mainMenuTree');
        if (!mainMenuTree) {
            return;
        }
        var rootCfg = { expanded: true, children: sef.runningCfg.getUser().Menus };
        mainMenuTree.getStore().setRoot(rootCfg);
    },
    internalInit: function() {
        if (this._internalInited) {
            return;
        }
        this._internalInited = true;
        this.updateMenuTree();
        this._appContainer = this.getReferences().mainAppContainer;
        this.getViewModel().setData({ message_count: 0, user_name: sef.runningCfg.getUser().Name, soft_name: sef.runningCfg.get('Name'), soft_title: sef.runningCfg.get('Title'), lang: sef.runningCfg.getLang() === 'cn' ? 'En' : 'Cn' });
    },
    showMessageInfo: function(messages) {
        if (!Ext.isArray(messages)) {
            messages = [messages];
        }
        var me = this;
        messages.forEach(function(m) {
            if (m.IsNeedHandle === true) {
                sef.notification.success(_('提醒'), m.Content, null, function(args) {
                    sef.utils.ajax({ url: sef.runningCfg.get('MessageHandleApi', '/api/messagehandle'), method: 'POST', jsonData: { ID: args.ID } });
                }, { ID: m.ID });
            } else {
                sef.message.success(m.Content, sef.runningCfg.get('MessageDuration', 4000));
            }
        });
    },
    checkNewMessage: function() {
        if (this._msgDelayCount++ < 1) {
            return;
        }
        var me = this,
            url = sef.runningCfg.get('MessageApi', '/api/message');
        sef.utils.ajax({
            url: url,
            method: 'GET',
            scope: me,
            success: function(result) {
                var count = result.Count;
                if (count > 0) {
                    this.getViewModel().setData({ message_count: count });
                }
                var messages = result[window.SEF_LIB_CFG.messageApiRootProperty || 'Messages'];
                if (messages) {
                    me.showMessageInfo(messages);
                }
            },
            failure: function(err, resp) {}
        });
    },
    onBeforeTabChangeHandler: function(tabPanel, newTab, oldTab, opts) {
        if (oldTab && oldTab.tab.waitForClose === true) {
            this.redirectTo(newTab.routeToken.str);
            return false;
        }
        if (!Ext.isEmpty(this._lastClickTabRouteId)) {
            if (newTab.routeId === this._lastClickTabRouteId) {
                this._lastClickTabRouteId = '';
                this.redirectTo(newTab.routeToken.str);
                return false;
            }
        }
    },
    onTabBeforeClose: function(tab) {
        if (this._lastClickTabRouteId === tab.tRouteId) {
            this._lastClickTabRouteId = '';
        }
        tab.waitForClose = true;
    },
    onTabClickHandler: function(tab, e, opts) {
        this._lastClickTabRouteId = tab.tRouteId;
    },
    onSignOut: function() {
        var me = this;
        sef.dialog.confirm(_('确认退出系统?'), '', function() {
            sef.runningCfg.clearUser();
            me.redirectTo(sef.utils.makeTokenHash('', true));
        });
    },
    onShowUpdateLog: function() {
        var url = sef.runningCfg.get('UpdateLogUrl', '/api/updatelog/');
        var dialog = Ext.create('sef.core.components.window.UpdateLogDialog', { url: url });
        dialog.show();
    },
    onChangePwd: function() {
        var url = sef.runningCfg.get('ChangePwdApi', '/api/changepwd/');
        var dialog = Ext.create('sef.core.components.window.ChangePwdDialog', { url: url });
        dialog.show();
    },
    onChangeLang: function() {
        sef.runningCfg.changeLang();
        this.gotoHome(true);
    },
    onChangeUIMode: function() {
        sef.runningCfg.changeUIMode();
        this.gotoHome(true);
    },
    onQQSupport: function() {},
    gotoHome: function(reload) {
        if (reload === true) {
            window.location.reload();
            return;
        }
        this.redirectTo(sef.utils.makeTokenHash('', true));
    },
    onViewportReady: function() {
        this.gotoHome();
        var me = this;
        this._task = Ext.TaskManager.start({
            run: function() {
                me.checkNewMessage();
            },
            addCountToArgs: true,
            interval: sef.runningCfg.get('MessageInterval', 1) * 60 * 1000
        });
    },
    onViewportBeforeDestroy: function() {
        if (this._task) {
            this._task.destroy();
            this._task = null;
            delete this._task;
        }
    }
});
Ext.define('sef.core.view.viewport.MDIViewportCtrl', { extend: sef.core.view.viewport.ViewportCtrl, alias: 'controller.sefc-mdivp' });
Ext.define('sef.core.view.viewport.TopMDIViewport', {
    extend: Ext.panel.Panel,
    mixins: [sef.core.interfaces.IAppViewport],
    controller: 'sefc-topmdivp',
    viewModel: 'sefv-mainvm',
    cls: 'sef-topmdiviewport',
    layout: 'fit',
    makeTopBar: function() {
        return { xtype: 'sef-maintopmenubar', reference: 'maintopmenubar' };
    },
    makeMdiContainer: function() {
        return { xtype: 'sef-tabappcontainer', reference: 'mainAppContainer', listeners: { 'beforetabchange': 'onBeforeTabChangeHandler' } };
    },
    makeLayout: function() {
        var l = { tbar: this.makeTopBar(), items: this.makeMdiContainer() };
        return l;
    },
    initComponent: function() {
        Ext.apply(this, this.makeLayout());
        this.callParent(arguments);
    }
});
Ext.define('sef.core.view.viewport.TopMDIViewportCtrl', {
    extend: sef.core.view.viewport.ViewportCtrl,
    alias: 'controller.sefc-topmdivp',
    updateMenuTree: function() {
        var items = this.makeMenuItems();
        if (items) {
            var bar = this.lookupReference('maintopmenubar');
            var len = bar.items.length;
            while (len > 7) {
                var ob = bar.items.get(1);
                bar.remove(ob, { destroy: true });
                len--;
            }
            bar.insert(1, items);
        }
    },
    makeMenuItems: function() {
        var items = [];
        var menus = sef.runningCfg.getUser().Menus;
        if (!menus) {
            return null;
        }
        menus.forEach(function(m) {
            var btn = { text: m.Text, ui: 'sefu-mtb-button-menu', arrowVisible: false, path: m.Path, handler: 'onMenuBtnClick' };
            if (m.Children) {
                var cm = m.Children.map(function(mc) {
                    var _m = { text: mc.Text, path: mc.Path, handler: 'onMenuBtnClick' };
                    if (mc.Children) {
                        var ccm = mc.Children.map(function(mmc) {
                            var _ccm = { text: mmc.text, path: mmc.Path, handler: 'onMenuBtnClick' };
                            return _ccm;
                        });
                        _m.menu = ccm;
                    }
                    return _m;
                });
                btn.menu = cm;
            }
            items.push(btn);
        });
        return items;
    },
    onMenuBtnClick: function(btn) {
        if (btn.menu) {
            return;
        }
        this.willOpenNewApp(btn.path);
    }
});
Ext.define('sef.core.view.viewport.ViewportViewModel', {
    extend: Ext.app.ViewModel,
    alias: 'viewmodel.sefv-mainvm',
    data: { user_name: '', message_count: 0, lang: '' },
    formulas: {
        rec_label: function(get) {
            var ci = get('curRecIndex');
            var t = get('totalRec');
            return ci >= 0 && t > 0;
        },
        rec_prev: function(get) {
            var ci = get('curRecIndex');
            return ci > 0;
        },
        rec_next: function(get) {
            var ci = get('curRecIndex');
            var t = get('totalRec');
            return ci < t - 1;
        }
    }
});
Ext.application({ name: 'sef', extend: sef.core.Application });