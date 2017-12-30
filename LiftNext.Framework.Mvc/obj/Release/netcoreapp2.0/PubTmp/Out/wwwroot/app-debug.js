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
Ext.define('Ext.draw.ContainerBase', {
    extend: Ext.panel.Panel,
    previewTitleText: 'Chart Preview',
    previewAltText: 'Chart preview',
    layout: 'container',
    addElementListener: function() {
        var me = this,
            args = arguments;
        if (me.rendered) {
            me.el.on.apply(me.el, args);
        } else {
            me.on('render', function() {
                me.el.on.apply(me.el, args);
            });
        }
    },
    removeElementListener: function() {
        var me = this,
            args = arguments;
        if (me.rendered) {
            me.el.un.apply(me.el, args);
        }
    },
    afterRender: function() {
        this.callParent(arguments);
        this.initAnimator();
    },
    getItems: function() {
        var me = this,
            items = me.items;
        if (!items || !items.isMixedCollection) {
            me.initItems();
        }
        return me.items;
    },
    onRender: function() {
        this.callParent(arguments);
        this.element = this.el;
        this.innerElement = this.body;
    },
    setItems: function(items) {
        this.items = items;
        return items;
    },
    setSurfaceSize: function(width, height) {
        this.resizeHandler({ width: width, height: height });
        this.renderFrame();
    },
    onResize: function(width, height, oldWidth, oldHeight) {
        var me = this;
        me.callParent([width, height, oldWidth, oldHeight]);
        me.handleResize({ width: width, height: height });
    },
    preview: function() {
        var image = this.getImage(),
            items;
        if (Ext.isIE8) {
            return false;
        }
        if (image.type === 'svg-markup') {
            items = { xtype: 'container', html: image.data };
        } else {
            items = {
                xtype: 'image',
                mode: 'img',
                cls: Ext.baseCSSPrefix + 'chart-image',
                alt: this.previewAltText,
                src: image.data,
                listeners: {
                    afterrender: function() {
                        var me = this,
                            img = me.imgEl.dom,
                            ratio = image.type === 'svg' ? 1 : window['devicePixelRatio'] || 1,
                            size;
                        if (!img.naturalWidth || !img.naturalHeight) {
                            img.onload = function() {
                                var width = img.naturalWidth,
                                    height = img.naturalHeight;
                                me.setWidth(Math.floor(width / ratio));
                                me.setHeight(Math.floor(height / ratio));
                            };
                        } else {
                            size = me.getSize();
                            me.setWidth(Math.floor(size.width / ratio));
                            me.setHeight(Math.floor(size.height / ratio));
                        }
                    }
                }
            };
        }
        new Ext.window.Window({ title: this.previewTitleText, closeable: true, renderTo: Ext.getBody(), autoShow: true, maximizeable: true, maximized: true, border: true, layout: { type: 'hbox', pack: 'center', align: 'middle' }, items: { xtype: 'container', items: items } });
    },
    privates: {
        getTargetEl: function() {
            return this.innerElement;
        },
        reattachToBody: function() {
            var me = this;
            if (me.pendingDetachSize) {
                me.handleResize();
            }
            me.pendingDetachSize = false;
            me.callParent();
        }
    }
});
Ext.define('Ext.draw.SurfaceBase', {
    extend: Ext.Widget,
    getOwnerBody: function() {
        return this.ownerCt.body;
    }
});
Ext.define('Ext.draw.sprite.AnimationParser', function() {
    function compute(from, to, delta) {
        return from + (to - from) * delta;
    }
    return {
        singleton: true,
        attributeRe: /^url\(#([a-zA-Z\-]+)\)$/,
        color: {
            parseInitial: function(color1, color2) {
                if (Ext.isString(color1)) {
                    color1 = Ext.util.Color.create(color1);
                }
                if (Ext.isString(color2)) {
                    color2 = Ext.util.Color.create(color2);
                }
                if (color1 && color1.isColor && (color2 && color2.isColor)) {
                    return [
                        [color1.r, color1.g, color1.b, color1.a],
                        [color2.r, color2.g, color2.b, color2.a]
                    ];
                } else {
                    return [color1 || color2, color2 || color1];
                }
            },
            compute: function(from, to, delta) {
                if (!Ext.isArray(from) || !Ext.isArray(to)) {
                    return to || from;
                } else {
                    return [compute(from[0], to[0], delta), compute(from[1], to[1], delta), compute(from[2], to[2], delta), compute(from[3], to[3], delta)];
                }
            },
            serve: function(array) {
                var color = Ext.util.Color.fly(array[0], array[1], array[2], array[3]);
                return color.toString();
            }
        },
        number: {
            parse: function(n) {
                return n === null ? null : +n;
            },
            compute: function(from, to, delta) {
                if (!Ext.isNumber(from) || !Ext.isNumber(to)) {
                    return to || from;
                } else {
                    return compute(from, to, delta);
                }
            }
        },
        angle: {
            parseInitial: function(from, to) {
                if (to - from > Math.PI) {
                    to -= Math.PI * 2;
                } else {
                    if (to - from < -Math.PI) {
                        to += Math.PI * 2;
                    }
                }
                return [from, to];
            },
            compute: function(from, to, delta) {
                if (!Ext.isNumber(from) || !Ext.isNumber(to)) {
                    return to || from;
                } else {
                    return compute(from, to, delta);
                }
            }
        },
        path: {
            parseInitial: function(from, to) {
                var fromStripes = from.toStripes(),
                    toStripes = to.toStripes(),
                    i, j, fromLength = fromStripes.length,
                    toLength = toStripes.length,
                    fromStripe, toStripe, length, lastStripe = toStripes[toLength - 1],
                    endPoint = [lastStripe[lastStripe.length - 2], lastStripe[lastStripe.length - 1]];
                for (i = fromLength; i < toLength; i++) {
                    fromStripes.push(fromStripes[fromLength - 1].slice(0));
                }
                for (i = toLength; i < fromLength; i++) {
                    toStripes.push(endPoint.slice(0));
                }
                length = fromStripes.length;
                toStripes.path = to;
                toStripes.temp = new Ext.draw.Path;
                for (i = 0; i < length; i++) {
                    fromStripe = fromStripes[i];
                    toStripe = toStripes[i];
                    fromLength = fromStripe.length;
                    toLength = toStripe.length;
                    toStripes.temp.commands.push('M');
                    for (j = toLength; j < fromLength; j += 6) {
                        toStripe.push(endPoint[0], endPoint[1], endPoint[0], endPoint[1], endPoint[0], endPoint[1]);
                    }
                    lastStripe = toStripes[toStripes.length - 1];
                    endPoint = [lastStripe[lastStripe.length - 2], lastStripe[lastStripe.length - 1]];
                    for (j = fromLength; j < toLength; j += 6) {
                        fromStripe.push(endPoint[0], endPoint[1], endPoint[0], endPoint[1], endPoint[0], endPoint[1]);
                    }
                    for (i = 0; i < toStripe.length; i++) {
                        toStripe[i] -= fromStripe[i];
                    }
                    for (i = 2; i < toStripe.length; i += 6) {
                        toStripes.temp.commands.push('C');
                    }
                }
                return [fromStripes, toStripes];
            },
            compute: function(fromStripes, toStripes, delta) {
                if (delta >= 1) {
                    return toStripes.path;
                }
                var i = 0,
                    ln = fromStripes.length,
                    j = 0,
                    ln2, from, to, temp = toStripes.temp.params,
                    pos = 0;
                for (; i < ln; i++) {
                    from = fromStripes[i];
                    to = toStripes[i];
                    ln2 = from.length;
                    for (j = 0; j < ln2; j++) {
                        temp[pos++] = to[j] * delta + from[j];
                    }
                }
                return toStripes.temp;
            }
        },
        data: {
            compute: function(from, to, delta, target) {
                var lf = from.length - 1,
                    lt = to.length - 1,
                    len = Math.max(lf, lt),
                    f, t, i;
                if (!target || target === from) {
                    target = [];
                }
                target.length = len + 1;
                for (i = 0; i <= len; i++) {
                    f = from[Math.min(i, lf)];
                    t = to[Math.min(i, lt)];
                    if (Ext.isNumber(f)) {
                        if (!Ext.isNumber(t)) {
                            t = 0;
                        }
                        target[i] = (t - f) * delta + f;
                    } else {
                        target[i] = t;
                    }
                }
                return target;
            }
        },
        text: {
            compute: function(from, to, delta) {
                return from.substr(0, Math.round(from.length * (1 - delta))) + to.substr(Math.round(to.length * (1 - delta)));
            }
        },
        limited: 'number',
        limited01: 'number'
    };
});
(function() {
    if (!Ext.global.Float32Array) {
        var Float32Array = function(array) {
            if (typeof array === 'number') {
                this.length = array;
            } else {
                if ('length' in array) {
                    this.length = array.length;
                    for (var i = 0, len = array.length; i < len; i++) {
                        this[i] = +array[i];
                    }
                }
            }
        };
        Float32Array.prototype = [];
        Ext.global.Float32Array = Float32Array;
    }
})();
Ext.define('Ext.draw.Draw', {
    singleton: true,
    radian: Math.PI / 180,
    pi2: Math.PI * 2,
    reflectFn: function(a) {
        return a;
    },
    rad: function(degrees) {
        return degrees % 360 * this.radian;
    },
    degrees: function(radian) {
        return radian / this.radian % 360;
    },
    isBBoxIntersect: function(bbox1, bbox2, padding) {
        padding = padding || 0;
        return Math.max(bbox1.x, bbox2.x) - padding > Math.min(bbox1.x + bbox1.width, bbox2.x + bbox2.width) || Math.max(bbox1.y, bbox2.y) - padding > Math.min(bbox1.y + bbox1.height, bbox2.y + bbox2.height);
    },
    isPointInBBox: function(x, y, bbox) {
        return !!bbox && x >= bbox.x && x <= bbox.x + bbox.width && y >= bbox.y && y <= bbox.y + bbox.height;
    },
    spline: function(points) {
        var i, j, ln = points.length,
            nd, d, y, ny, r = 0,
            zs = new Float32Array(points.length),
            result = new Float32Array(points.length * 3 - 2);
        zs[0] = 0;
        zs[ln - 1] = 0;
        for (i = 1; i < ln - 1; i++) {
            zs[i] = points[i + 1] + points[i - 1] - 2 * points[i] - zs[i - 1];
            r = 1 / (4 - r);
            zs[i] *= r;
        }
        for (i = ln - 2; i > 0; i--) {
            r = 3.732050807568877 + 48.248711305964385 / (-13.928203230275537 + Math.pow(0.07179676972449123, i));
            zs[i] -= zs[i + 1] * r;
        }
        ny = points[0];
        nd = ny - zs[0];
        for (i = 0, j = 0; i < ln - 1; j += 3) {
            y = ny;
            d = nd;
            i++;
            ny = points[i];
            nd = ny - zs[i];
            result[j] = y;
            result[j + 1] = (nd + 2 * d) / 3;
            result[j + 2] = (nd * 2 + d) / 3;
        }
        result[j] = ny;
        return result;
    },
    getAnchors: function(prevX, prevY, curX, curY, nextX, nextY, value) {
        value = value || 4;
        var PI = Math.PI,
            halfPI = PI / 2,
            abs = Math.abs,
            sin = Math.sin,
            cos = Math.cos,
            atan = Math.atan,
            control1Length, control2Length, control1Angle, control2Angle, control1X, control1Y, control2X, control2Y, alpha;
        control1Length = (curX - prevX) / value;
        control2Length = (nextX - curX) / value;
        if (curY >= prevY && curY >= nextY || curY <= prevY && curY <= nextY) {
            control1Angle = control2Angle = halfPI;
        } else {
            control1Angle = atan((curX - prevX) / abs(curY - prevY));
            if (prevY < curY) {
                control1Angle = PI - control1Angle;
            }
            control2Angle = atan((nextX - curX) / abs(curY - nextY));
            if (nextY < curY) {
                control2Angle = PI - control2Angle;
            }
        }
        alpha = halfPI - (control1Angle + control2Angle) % (PI * 2) / 2;
        if (alpha > halfPI) {
            alpha -= PI;
        }
        control1Angle += alpha;
        control2Angle += alpha;
        control1X = curX - control1Length * sin(control1Angle);
        control1Y = curY + control1Length * cos(control1Angle);
        control2X = curX + control2Length * sin(control2Angle);
        control2Y = curY + control2Length * cos(control2Angle);
        if (curY > prevY && control1Y < prevY || curY < prevY && control1Y > prevY) {
            control1X += abs(prevY - control1Y) * (control1X - curX) / (control1Y - curY);
            control1Y = prevY;
        }
        if (curY > nextY && control2Y < nextY || curY < nextY && control2Y > nextY) {
            control2X -= abs(nextY - control2Y) * (control2X - curX) / (control2Y - curY);
            control2Y = nextY;
        }
        return { x1: control1X, y1: control1Y, x2: control2X, y2: control2Y };
    },
    smooth: function(dataX, dataY, value) {
        var ln = dataX.length,
            prevX, prevY, curX, curY, nextX, nextY, x, y, smoothX = [],
            smoothY = [],
            i, anchors;
        for (i = 0; i < ln - 1; i++) {
            prevX = dataX[i];
            prevY = dataY[i];
            if (i === 0) {
                x = prevX;
                y = prevY;
                smoothX.push(x);
                smoothY.push(y);
                if (ln === 1) {
                    break;
                }
            }
            curX = dataX[i + 1];
            curY = dataY[i + 1];
            nextX = dataX[i + 2];
            nextY = dataY[i + 2];
            if (!(Ext.isNumber(nextX) && Ext.isNumber(nextY))) {
                smoothX.push(x, curX, curX);
                smoothY.push(y, curY, curY);
                break;
            }
            anchors = this.getAnchors(prevX, prevY, curX, curY, nextX, nextY, value);
            smoothX.push(x, anchors.x1, curX);
            smoothY.push(y, anchors.y1, curY);
            x = anchors.x2;
            y = anchors.y2;
        }
        return { smoothX: smoothX, smoothY: smoothY };
    },
    beginUpdateIOS: Ext.os.is.iOS ? function() {
        this.iosUpdateEl = Ext.getBody().createChild({ 'data-sticky': true, style: 'position: absolute; top: 0px; bottom: 0px; left: 0px; right: 0px; background: rgba(0,0,0,0.001); z-index: 100000' });
    } : Ext.emptyFn,
    endUpdateIOS: function() {
        this.iosUpdateEl = Ext.destroy(this.iosUpdateEl);
    }
});
Ext.define('Ext.draw.gradient.Gradient', {
    isGradient: true,
    config: { stops: [] },
    applyStops: function(newStops) {
        var stops = [],
            ln = newStops.length,
            i, stop, color;
        for (i = 0; i < ln; i++) {
            stop = newStops[i];
            color = stop.color;
            if (!(color && color.isColor)) {
                color = Ext.util.Color.fly(color || Ext.util.Color.NONE);
            }
            stops.push({ offset: Math.min(1, Math.max(0, 'offset' in stop ? stop.offset : stop.position || 0)), color: color.toString() });
        }
        stops.sort(function(a, b) {
            return a.offset - b.offset;
        });
        return stops;
    },
    onClassExtended: function(subClass, member) {
        if (!member.alias && member.type) {
            member.alias = 'gradient.' + member.type;
        }
    },
    constructor: function(config) {
        this.initConfig(config);
    },
    generateGradient: Ext.emptyFn
});
Ext.define('Ext.draw.gradient.GradientDefinition', {
    singleton: true,
    urlStringRe: /^url\(#([\w\-]+)\)$/,
    gradients: {},
    add: function(gradients) {
        var store = this.gradients,
            i, n, gradient;
        for (i = 0, n = gradients.length; i < n; i++) {
            gradient = gradients[i];
            if (Ext.isString(gradient.id)) {
                store[gradient.id] = gradient;
            }
        }
    },
    get: function(str) {
        var store = this.gradients,
            match = str.match(this.urlStringRe),
            gradient;
        if (match && match[1] && (gradient = store[match[1]])) {
            return gradient || str;
        }
        return str;
    }
});
Ext.define('Ext.draw.sprite.AttributeParser', {
    singleton: true,
    attributeRe: /^url\(#([a-zA-Z\-]+)\)$/,
    'default': Ext.identityFn,
    string: function(n) {
        return String(n);
    },
    number: function(n) {
        if (Ext.isNumber(+n)) {
            return n;
        }
    },
    angle: function(n) {
        if (Ext.isNumber(n)) {
            n %= Math.PI * 2;
            if (n < -Math.PI) {
                n += Math.PI * 2;
            } else {
                if (n >= Math.PI) {
                    n -= Math.PI * 2;
                }
            }
            return n;
        }
    },
    data: function(n) {
        if (Ext.isArray(n)) {
            return n.slice();
        } else {
            if (n instanceof Float32Array) {
                return new Float32Array(n);
            }
        }
    },
    bool: function(n) {
        return !!n;
    },
    color: function(n) {
        if (n && n.isColor) {
            return n.toString();
        } else {
            if (n && n.isGradient) {
                return n;
            } else {
                if (!n) {
                    return Ext.util.Color.NONE;
                } else {
                    if (Ext.isString(n)) {
                        if (n.substr(0, 3) === 'url') {
                            n = Ext.draw.gradient.GradientDefinition.get(n);
                            if (Ext.isString(n)) {
                                return n;
                            }
                        } else {
                            return Ext.util.Color.fly(n).toString();
                        }
                    }
                }
            }
        }
        if (n.type === 'linear') {
            return Ext.create('Ext.draw.gradient.Linear', n);
        } else {
            if (n.type === 'radial') {
                return Ext.create('Ext.draw.gradient.Radial', n);
            } else {
                if (n.type === 'pattern') {
                    return Ext.create('Ext.draw.gradient.Pattern', n);
                } else {
                    return Ext.util.Color.NONE;
                }
            }
        }
    },
    limited: function(low, hi) {
        return function(n) {
            n = +n;
            return Ext.isNumber(n) ? Math.min(Math.max(n, low), hi) : undefined;
        };
    },
    limited01: function(n) {
        n = +n;
        return Ext.isNumber(n) ? Math.min(Math.max(n, 0), 1) : undefined;
    },
    enums: function() {
        var enums = {},
            args = Array.prototype.slice.call(arguments, 0),
            i, ln;
        for (i = 0, ln = args.length; i < ln; i++) {
            enums[args[i]] = true;
        }
        return function(n) {
            return n in enums ? n : undefined;
        };
    }
});
Ext.define('Ext.draw.sprite.AttributeDefinition', {
    config: { defaults: { $value: {}, lazy: true }, aliases: {}, animationProcessors: {}, processors: { $value: {}, lazy: true }, dirtyTriggers: {}, triggers: {}, updaters: {} },
    inheritableStatics: { processorFactoryRe: /^(\w+)\(([\w\-,]*)\)$/ },
    spriteClass: null,
    constructor: function(config) {
        var me = this;
        me.initConfig(config);
    },
    applyDefaults: function(defaults, oldDefaults) {
        oldDefaults = Ext.apply(oldDefaults || {}, this.normalize(defaults));
        return oldDefaults;
    },
    applyAliases: function(aliases, oldAliases) {
        return Ext.apply(oldAliases || {}, aliases);
    },
    applyProcessors: function(processors, oldProcessors) {
        this.getAnimationProcessors();
        var result = oldProcessors || {},
            defaultProcessor = Ext.draw.sprite.AttributeParser,
            processorFactoryRe = this.self.processorFactoryRe,
            animationProcessors = {},
            anyAnimationProcessors, name, match, fn;
        for (name in processors) {
            fn = processors[name];
            if (typeof fn === 'string') {
                match = fn.match(processorFactoryRe);
                if (match) {
                    fn = defaultProcessor[match[1]].apply(defaultProcessor, match[2].split(','));
                } else {
                    if (defaultProcessor[fn]) {
                        animationProcessors[name] = fn;
                        anyAnimationProcessors = true;
                        fn = defaultProcessor[fn];
                    }
                }
            }
            if (!Ext.isFunction(fn)) {
                Ext.raise(this.spriteClass.$className + ": processor '" + name + "' has not been found.");
            }
            result[name] = fn;
        }
        if (anyAnimationProcessors) {
            this.setAnimationProcessors(animationProcessors);
        }
        return result;
    },
    applyAnimationProcessors: function(animationProcessors, oldAnimationProcessors) {
        var parser = Ext.draw.sprite.AnimationParser,
            name, item;
        if (!oldAnimationProcessors) {
            oldAnimationProcessors = {};
        }
        for (name in animationProcessors) {
            item = animationProcessors[name];
            if (item === 'none') {
                oldAnimationProcessors[name] = null;
            } else {
                if (Ext.isString(item) && !(name in oldAnimationProcessors)) {
                    if (item in parser) {
                        while (Ext.isString(parser[item])) {
                            item = parser[item];
                        }
                        oldAnimationProcessors[name] = parser[item];
                    }
                } else {
                    if (Ext.isObject(item)) {
                        oldAnimationProcessors[name] = item;
                    }
                }
            }
        }
        return oldAnimationProcessors;
    },
    updateDirtyTriggers: function(dirtyTriggers) {
        this.setTriggers(dirtyTriggers);
    },
    applyTriggers: function(triggers, oldTriggers) {
        if (!oldTriggers) {
            oldTriggers = {};
        }
        for (var name in triggers) {
            oldTriggers[name] = triggers[name].split(',');
        }
        return oldTriggers;
    },
    applyUpdaters: function(updaters, oldUpdaters) {
        return Ext.apply(oldUpdaters || {}, updaters);
    },
    batchedNormalize: function(batchedChanges, keepUnrecognized) {
        if (!batchedChanges) {
            return {};
        }
        var processors = this.getProcessors(),
            aliases = this.getAliases(),
            translation = batchedChanges.translation || batchedChanges.translate,
            normalized = {},
            i, ln, name, val, rotation, scaling, matrix, subVal, split;
        if ('rotation' in batchedChanges) {
            rotation = batchedChanges.rotation;
        } else {
            rotation = 'rotate' in batchedChanges ? batchedChanges.rotate : undefined;
        }
        if ('scaling' in batchedChanges) {
            scaling = batchedChanges.scaling;
        } else {
            scaling = 'scale' in batchedChanges ? batchedChanges.scale : undefined;
        }
        if (typeof scaling !== 'undefined') {
            if (Ext.isNumber(scaling)) {
                normalized.scalingX = scaling;
                normalized.scalingY = scaling;
            } else {
                if ('x' in scaling) {
                    normalized.scalingX = scaling.x;
                }
                if ('y' in scaling) {
                    normalized.scalingY = scaling.y;
                }
                if ('centerX' in scaling) {
                    normalized.scalingCenterX = scaling.centerX;
                }
                if ('centerY' in scaling) {
                    normalized.scalingCenterY = scaling.centerY;
                }
            }
        }
        if (typeof rotation !== 'undefined') {
            if (Ext.isNumber(rotation)) {
                rotation = Ext.draw.Draw.rad(rotation);
                normalized.rotationRads = rotation;
            } else {
                if ('rads' in rotation) {
                    normalized.rotationRads = rotation.rads;
                } else {
                    if ('degrees' in rotation) {
                        if (Ext.isArray(rotation.degrees)) {
                            normalized.rotationRads = Ext.Array.map(rotation.degrees, function(deg) {
                                return Ext.draw.Draw.rad(deg);
                            });
                        } else {
                            normalized.rotationRads = Ext.draw.Draw.rad(rotation.degrees);
                        }
                    }
                }
                if ('centerX' in rotation) {
                    normalized.rotationCenterX = rotation.centerX;
                }
                if ('centerY' in rotation) {
                    normalized.rotationCenterY = rotation.centerY;
                }
            }
        }
        if (typeof translation !== 'undefined') {
            if ('x' in translation) {
                normalized.translationX = translation.x;
            }
            if ('y' in translation) {
                normalized.translationY = translation.y;
            }
        }
        if ('matrix' in batchedChanges) {
            matrix = Ext.draw.Matrix.create(batchedChanges.matrix);
            split = matrix.split();
            normalized.matrix = matrix;
            normalized.rotationRads = split.rotation;
            normalized.rotationCenterX = 0;
            normalized.rotationCenterY = 0;
            normalized.scalingX = split.scaleX;
            normalized.scalingY = split.scaleY;
            normalized.scalingCenterX = 0;
            normalized.scalingCenterY = 0;
            normalized.translationX = split.translateX;
            normalized.translationY = split.translateY;
        }
        for (name in batchedChanges) {
            val = batchedChanges[name];
            if (typeof val === 'undefined') {
                continue;
            } else {
                if (Ext.isArray(val)) {
                    if (name in aliases) {
                        name = aliases[name];
                    }
                    if (name in processors) {
                        normalized[name] = [];
                        for (i = 0, ln = val.length; i < ln; i++) {
                            subVal = processors[name].call(this, val[i]);
                            if (typeof subVal !== 'undefined') {
                                normalized[name][i] = subVal;
                            }
                        }
                    } else {
                        if (keepUnrecognized) {
                            normalized[name] = val;
                        }
                    }
                } else {
                    if (name in aliases) {
                        name = aliases[name];
                    }
                    if (name in processors) {
                        val = processors[name].call(this, val);
                        if (typeof val !== 'undefined') {
                            normalized[name] = val;
                        }
                    } else {
                        if (keepUnrecognized) {
                            normalized[name] = val;
                        }
                    }
                }
            }
        }
        return normalized;
    },
    normalize: function(changes, keepUnrecognized) {
        if (!changes) {
            return {};
        }
        var processors = this.getProcessors(),
            aliases = this.getAliases(),
            translation = changes.translation || changes.translate,
            normalized = {},
            name, val, rotation, scaling, matrix, split;
        if ('rotation' in changes) {
            rotation = changes.rotation;
        } else {
            rotation = 'rotate' in changes ? changes.rotate : undefined;
        }
        if ('scaling' in changes) {
            scaling = changes.scaling;
        } else {
            scaling = 'scale' in changes ? changes.scale : undefined;
        }
        if (translation) {
            if ('x' in translation) {
                normalized.translationX = translation.x;
            }
            if ('y' in translation) {
                normalized.translationY = translation.y;
            }
        }
        if (typeof scaling !== 'undefined') {
            if (Ext.isNumber(scaling)) {
                normalized.scalingX = scaling;
                normalized.scalingY = scaling;
            } else {
                if ('x' in scaling) {
                    normalized.scalingX = scaling.x;
                }
                if ('y' in scaling) {
                    normalized.scalingY = scaling.y;
                }
                if ('centerX' in scaling) {
                    normalized.scalingCenterX = scaling.centerX;
                }
                if ('centerY' in scaling) {
                    normalized.scalingCenterY = scaling.centerY;
                }
            }
        }
        if (typeof rotation !== 'undefined') {
            if (Ext.isNumber(rotation)) {
                rotation = Ext.draw.Draw.rad(rotation);
                normalized.rotationRads = rotation;
            } else {
                if ('rads' in rotation) {
                    normalized.rotationRads = rotation.rads;
                } else {
                    if ('degrees' in rotation) {
                        normalized.rotationRads = Ext.draw.Draw.rad(rotation.degrees);
                    }
                }
                if ('centerX' in rotation) {
                    normalized.rotationCenterX = rotation.centerX;
                }
                if ('centerY' in rotation) {
                    normalized.rotationCenterY = rotation.centerY;
                }
            }
        }
        if ('matrix' in changes) {
            matrix = Ext.draw.Matrix.create(changes.matrix);
            split = matrix.split();
            normalized.matrix = matrix;
            normalized.rotationRads = split.rotation;
            normalized.rotationCenterX = 0;
            normalized.rotationCenterY = 0;
            normalized.scalingX = split.scaleX;
            normalized.scalingY = split.scaleY;
            normalized.scalingCenterX = 0;
            normalized.scalingCenterY = 0;
            normalized.translationX = split.translateX;
            normalized.translationY = split.translateY;
        }
        for (name in changes) {
            val = changes[name];
            if (typeof val === 'undefined') {
                continue;
            }
            if (name in aliases) {
                name = aliases[name];
            }
            if (name in processors) {
                val = processors[name].call(this, val);
                if (typeof val !== 'undefined') {
                    normalized[name] = val;
                }
            } else {
                if (keepUnrecognized) {
                    normalized[name] = val;
                }
            }
        }
        return normalized;
    },
    setBypassingNormalization: function(attr, modifierStack, changes) {
        return modifierStack.pushDown(attr, changes);
    },
    set: function(attr, modifierStack, changes) {
        changes = this.normalize(changes);
        return this.setBypassingNormalization(attr, modifierStack, changes);
    }
});
Ext.define('Ext.draw.Matrix', {
    isMatrix: true,
    statics: {
        createAffineMatrixFromTwoPair: function(x0, y0, x1, y1, x0p, y0p, x1p, y1p) {
            var dx = x1 - x0,
                dy = y1 - y0,
                dxp = x1p - x0p,
                dyp = y1p - y0p,
                r = 1 / (dx * dx + dy * dy),
                a = dx * dxp + dy * dyp,
                b = dxp * dy - dx * dyp,
                c = -a * x0 - b * y0,
                f = b * x0 - a * y0;
            return new this(a * r, -b * r, b * r, a * r, c * r + x0p, f * r + y0p);
        },
        createPanZoomFromTwoPair: function(x0, y0, x1, y1, x0p, y0p, x1p, y1p) {
            if (arguments.length === 2) {
                return this.createPanZoomFromTwoPair.apply(this, x0.concat(y0));
            }
            var dx = x1 - x0,
                dy = y1 - y0,
                cx = (x0 + x1) * 0.5,
                cy = (y0 + y1) * 0.5,
                dxp = x1p - x0p,
                dyp = y1p - y0p,
                cxp = (x0p + x1p) * 0.5,
                cyp = (y0p + y1p) * 0.5,
                r = dx * dx + dy * dy,
                rp = dxp * dxp + dyp * dyp,
                scale = Math.sqrt(rp / r);
            return new this(scale, 0, 0, scale, cxp - scale * cx, cyp - scale * cy);
        },
        fly: function() {
            var flyMatrix = null,
                simplefly = function(elements) {
                    flyMatrix.elements = elements;
                    return flyMatrix;
                };
            return function(elements) {
                if (!flyMatrix) {
                    flyMatrix = new Ext.draw.Matrix;
                }
                flyMatrix.elements = elements;
                Ext.draw.Matrix.fly = simplefly;
                return flyMatrix;
            };
        }(),
        create: function(mat) {
            if (mat instanceof this) {
                return mat;
            }
            return new this(mat);
        }
    },
    constructor: function(xx, xy, yx, yy, dx, dy) {
        if (xx && xx.length === 6) {
            this.elements = xx.slice();
        } else {
            if (xx !== undefined) {
                this.elements = [xx, xy, yx, yy, dx, dy];
            } else {
                this.elements = [1, 0, 0, 1, 0, 0];
            }
        }
    },
    prepend: function(xx, xy, yx, yy, dx, dy) {
        var elements = this.elements,
            xx0 = elements[0],
            xy0 = elements[1],
            yx0 = elements[2],
            yy0 = elements[3],
            dx0 = elements[4],
            dy0 = elements[5];
        elements[0] = xx * xx0 + yx * xy0;
        elements[1] = xy * xx0 + yy * xy0;
        elements[2] = xx * yx0 + yx * yy0;
        elements[3] = xy * yx0 + yy * yy0;
        elements[4] = xx * dx0 + yx * dy0 + dx;
        elements[5] = xy * dx0 + yy * dy0 + dy;
        return this;
    },
    prependMatrix: function(matrix) {
        return this.prepend.apply(this, matrix.elements);
    },
    append: function(xx, xy, yx, yy, dx, dy) {
        var elements = this.elements,
            xx0 = elements[0],
            xy0 = elements[1],
            yx0 = elements[2],
            yy0 = elements[3],
            dx0 = elements[4],
            dy0 = elements[5];
        elements[0] = xx * xx0 + xy * yx0;
        elements[1] = xx * xy0 + xy * yy0;
        elements[2] = yx * xx0 + yy * yx0;
        elements[3] = yx * xy0 + yy * yy0;
        elements[4] = dx * xx0 + dy * yx0 + dx0;
        elements[5] = dx * xy0 + dy * yy0 + dy0;
        return this;
    },
    appendMatrix: function(matrix) {
        return this.append.apply(this, matrix.elements);
    },
    set: function(xx, xy, yx, yy, dx, dy) {
        var elements = this.elements;
        elements[0] = xx;
        elements[1] = xy;
        elements[2] = yx;
        elements[3] = yy;
        elements[4] = dx;
        elements[5] = dy;
        return this;
    },
    inverse: function(target) {
        var elements = this.elements,
            a = elements[0],
            b = elements[1],
            c = elements[2],
            d = elements[3],
            e = elements[4],
            f = elements[5],
            rDim = 1 / (a * d - b * c);
        a *= rDim;
        b *= rDim;
        c *= rDim;
        d *= rDim;
        if (target) {
            target.set(d, -b, -c, a, c * f - d * e, b * e - a * f);
            return target;
        } else {
            return new Ext.draw.Matrix(d, -b, -c, a, c * f - d * e, b * e - a * f);
        }
    },
    translate: function(x, y, prepend) {
        if (prepend) {
            return this.prepend(1, 0, 0, 1, x, y);
        } else {
            return this.append(1, 0, 0, 1, x, y);
        }
    },
    scale: function(sx, sy, scx, scy, prepend) {
        var me = this;
        if (sy == null) {
            sy = sx;
        }
        if (scx === undefined) {
            scx = 0;
        }
        if (scy === undefined) {
            scy = 0;
        }
        if (prepend) {
            return me.prepend(sx, 0, 0, sy, scx - scx * sx, scy - scy * sy);
        } else {
            return me.append(sx, 0, 0, sy, scx - scx * sx, scy - scy * sy);
        }
    },
    rotate: function(angle, rcx, rcy, prepend) {
        var me = this,
            cos = Math.cos(angle),
            sin = Math.sin(angle);
        rcx = rcx || 0;
        rcy = rcy || 0;
        if (prepend) {
            return me.prepend(cos, sin, -sin, cos, rcx - cos * rcx + rcy * sin, rcy - cos * rcy - rcx * sin);
        } else {
            return me.append(cos, sin, -sin, cos, rcx - cos * rcx + rcy * sin, rcy - cos * rcy - rcx * sin);
        }
    },
    rotateFromVector: function(x, y, prepend) {
        var me = this,
            d = Math.sqrt(x * x + y * y),
            cos = x / d,
            sin = y / d;
        if (prepend) {
            return me.prepend(cos, sin, -sin, cos, 0, 0);
        } else {
            return me.append(cos, sin, -sin, cos, 0, 0);
        }
    },
    clone: function() {
        return new Ext.draw.Matrix(this.elements);
    },
    flipX: function() {
        return this.append(-1, 0, 0, 1, 0, 0);
    },
    flipY: function() {
        return this.append(1, 0, 0, -1, 0, 0);
    },
    skewX: function(angle) {
        return this.append(1, 0, Math.tan(angle), 1, 0, 0);
    },
    skewY: function(angle) {
        return this.append(1, Math.tan(angle), 0, 1, 0, 0);
    },
    shearX: function(factor) {
        return this.append(1, 0, factor, 1, 0, 0);
    },
    shearY: function(factor) {
        return this.append(1, factor, 0, 1, 0, 0);
    },
    reset: function() {
        return this.set(1, 0, 0, 1, 0, 0);
    },
    precisionCompensate: function(devicePixelRatio, comp) {
        var elements = this.elements,
            x2x = elements[0],
            x2y = elements[1],
            y2x = elements[2],
            y2y = elements[3],
            newDx = elements[4],
            newDy = elements[5],
            r = x2y * y2x - x2x * y2y;
        comp.b = devicePixelRatio * x2y / x2x;
        comp.c = devicePixelRatio * y2x / y2y;
        comp.d = devicePixelRatio;
        comp.xx = x2x / devicePixelRatio;
        comp.yy = y2y / devicePixelRatio;
        comp.dx = (newDy * x2x * y2x - newDx * x2x * y2y) / r / devicePixelRatio;
        comp.dy = (newDx * x2y * y2y - newDy * x2x * y2y) / r / devicePixelRatio;
    },
    precisionCompensateRect: function(devicePixelRatio, comp) {
        var elements = this.elements,
            x2x = elements[0],
            x2y = elements[1],
            y2x = elements[2],
            y2y = elements[3],
            newDx = elements[4],
            newDy = elements[5],
            yxOnXx = y2x / x2x;
        comp.b = devicePixelRatio * x2y / x2x;
        comp.c = devicePixelRatio * yxOnXx;
        comp.d = devicePixelRatio * y2y / x2x;
        comp.xx = x2x / devicePixelRatio;
        comp.yy = x2x / devicePixelRatio;
        comp.dx = (newDy * y2x - newDx * y2y) / (x2y * yxOnXx - y2y) / devicePixelRatio;
        comp.dy = -(newDy * x2x - newDx * x2y) / (x2y * yxOnXx - y2y) / devicePixelRatio;
    },
    x: function(x, y) {
        var elements = this.elements;
        return x * elements[0] + y * elements[2] + elements[4];
    },
    y: function(x, y) {
        var elements = this.elements;
        return x * elements[1] + y * elements[3] + elements[5];
    },
    get: function(i, j) {
        return +this.elements[i + j * 2].toFixed(4);
    },
    transformPoint: function(point) {
        var elements = this.elements,
            x, y;
        if (point.isPoint) {
            x = point.x;
            y = point.y;
        } else {
            x = point[0];
            y = point[1];
        }
        return [x * elements[0] + y * elements[2] + elements[4], x * elements[1] + y * elements[3] + elements[5]];
    },
    transformBBox: function(bbox, radius, target) {
        var elements = this.elements,
            l = bbox.x,
            t = bbox.y,
            w0 = bbox.width * 0.5,
            h0 = bbox.height * 0.5,
            xx = elements[0],
            xy = elements[1],
            yx = elements[2],
            yy = elements[3],
            cx = l + w0,
            cy = t + h0,
            w, h, scales;
        if (radius) {
            w0 -= radius;
            h0 -= radius;
            scales = [Math.sqrt(elements[0] * elements[0] + elements[2] * elements[2]), Math.sqrt(elements[1] * elements[1] + elements[3] * elements[3])];
            w = Math.abs(w0 * xx) + Math.abs(h0 * yx) + Math.abs(scales[0] * radius);
            h = Math.abs(w0 * xy) + Math.abs(h0 * yy) + Math.abs(scales[1] * radius);
        } else {
            w = Math.abs(w0 * xx) + Math.abs(h0 * yx);
            h = Math.abs(w0 * xy) + Math.abs(h0 * yy);
        }
        if (!target) {
            target = {};
        }
        target.x = cx * xx + cy * yx + elements[4] - w;
        target.y = cx * xy + cy * yy + elements[5] - h;
        target.width = w + w;
        target.height = h + h;
        return target;
    },
    transformList: function(list) {
        var elements = this.elements,
            xx = elements[0],
            yx = elements[2],
            dx = elements[4],
            xy = elements[1],
            yy = elements[3],
            dy = elements[5],
            ln = list.length,
            p, i;
        for (i = 0; i < ln; i++) {
            p = list[i];
            list[i] = [p[0] * xx + p[1] * yx + dx, p[0] * xy + p[1] * yy + dy];
        }
        return list;
    },
    isIdentity: function() {
        var elements = this.elements;
        return elements[0] === 1 && elements[1] === 0 && elements[2] === 0 && elements[3] === 1 && elements[4] === 0 && elements[5] === 0;
    },
    isEqual: function(matrix) {
        var elements = matrix && matrix.isMatrix ? matrix.elements : matrix,
            myElements = this.elements;
        return myElements[0] === elements[0] && myElements[1] === elements[1] && myElements[2] === elements[2] && myElements[3] === elements[3] && myElements[4] === elements[4] && myElements[5] === elements[5];
    },
    equals: function(matrix) {
        return this.isEqual(matrix);
    },
    toArray: function() {
        var elements = this.elements;
        return [elements[0], elements[2], elements[4], elements[1], elements[3], elements[5]];
    },
    toVerticalArray: function() {
        return this.elements.slice();
    },
    toString: function() {
        var me = this;
        return [me.get(0, 0), me.get(0, 1), me.get(1, 0), me.get(1, 1), me.get(2, 0), me.get(2, 1)].join(',');
    },
    toContext: function(ctx) {
        ctx.transform.apply(ctx, this.elements);
        return this;
    },
    toSvg: function() {
        var elements = this.elements;
        return 'matrix(' + elements[0].toFixed(9) + ',' + elements[1].toFixed(9) + ',' + elements[2].toFixed(9) + ',' + elements[3].toFixed(9) + ',' + elements[4].toFixed(9) + ',' + elements[5].toFixed(9) + ')';
    },
    getScaleX: function() {
        var elements = this.elements;
        return Math.sqrt(elements[0] * elements[0] + elements[2] * elements[2]);
    },
    getScaleY: function() {
        var elements = this.elements;
        return Math.sqrt(elements[1] * elements[1] + elements[3] * elements[3]);
    },
    getXX: function() {
        return this.elements[0];
    },
    getXY: function() {
        return this.elements[1];
    },
    getYX: function() {
        return this.elements[2];
    },
    getYY: function() {
        return this.elements[3];
    },
    getDX: function() {
        return this.elements[4];
    },
    getDY: function() {
        return this.elements[5];
    },
    split: function() {
        var el = this.elements,
            xx = el[0],
            xy = el[1],
            yy = el[3],
            out = { translateX: el[4], translateY: el[5] };
        out.rotate = out.rotation = Math.atan2(xy, xx);
        out.scaleX = xx / Math.cos(out.rotate);
        out.scaleY = yy / xx * out.scaleX;
        return out;
    }
}, function() {
    function registerName(properties, name, i) {
        properties[name] = {
            get: function() {
                return this.elements[i];
            },
            set: function(val) {
                this.elements[i] = val;
            }
        };
    }
    if (Object.defineProperties) {
        var properties = {};
        registerName(properties, 'a', 0);
        registerName(properties, 'b', 1);
        registerName(properties, 'c', 2);
        registerName(properties, 'd', 3);
        registerName(properties, 'e', 4);
        registerName(properties, 'f', 5);
        Object.defineProperties(this.prototype, properties);
    }
    this.prototype.multiply = this.prototype.appendMatrix;
});
Ext.define('Ext.draw.modifier.Modifier', {
    mixins: { observable: Ext.mixin.Observable },
    config: { lower: null, upper: null, sprite: null },
    constructor: function(config) {
        this.mixins.observable.constructor.call(this, config);
    },
    updateUpper: function(upper) {
        if (upper) {
            upper.setLower(this);
        }
    },
    updateLower: function(lower) {
        if (lower) {
            lower.setUpper(this);
        }
    },
    prepareAttributes: function(attr) {
        if (this._lower) {
            this._lower.prepareAttributes(attr);
        }
    },
    popUp: function(attributes, changes) {
        if (this._upper) {
            this._upper.popUp(attributes, changes);
        } else {
            Ext.apply(attributes, changes);
        }
    },
    pushDown: function(attr, changes) {
        if (this._lower) {
            return this._lower.pushDown(attr, changes);
        } else {
            for (var name in changes) {
                if (changes[name] === attr[name]) {
                    delete changes[name];
                }
            }
            return changes;
        }
    }
});
Ext.define('Ext.draw.modifier.Target', {
    extend: Ext.draw.modifier.Modifier,
    alias: 'modifier.target',
    statics: { uniqueId: 0 },
    prepareAttributes: function(attr) {
        if (this._lower) {
            this._lower.prepareAttributes(attr);
        }
        attr.attributeId = 'attribute-' + Ext.draw.modifier.Target.uniqueId++;
        if (!attr.hasOwnProperty('canvasAttributes')) {
            attr.bbox = { plain: { dirty: true }, transform: { dirty: true } };
            attr.dirty = true;
            attr.pendingUpdaters = {};
            attr.canvasAttributes = {};
            attr.matrix = new Ext.draw.Matrix;
            attr.inverseMatrix = new Ext.draw.Matrix;
        }
    },
    applyChanges: function(attr, changes) {
        Ext.apply(attr, changes);
        var sprite = this.getSprite(),
            pendingUpdaters = attr.pendingUpdaters,
            triggers = sprite.self.def.getTriggers(),
            updaters, instances, instance, name, hasChanges, canvasAttributes, i, j, ln;
        for (name in changes) {
            hasChanges = true;
            if (updaters = triggers[name]) {
                sprite.scheduleUpdaters(attr, updaters, [name]);
            }
            if (attr.template && changes.removeFromInstance && changes.removeFromInstance[name]) {
                delete attr[name];
            }
        }
        if (!hasChanges) {
            return;
        }
        if (pendingUpdaters.canvas) {
            canvasAttributes = pendingUpdaters.canvas;
            delete pendingUpdaters.canvas;
            for (i = 0, ln = canvasAttributes.length; i < ln; i++) {
                name = canvasAttributes[i];
                attr.canvasAttributes[name] = attr[name];
            }
        }
        if (attr.hasOwnProperty('children')) {
            instances = attr.children;
            for (i = 0, ln = instances.length; i < ln; i++) {
                instance = instances[i];
                Ext.apply(instance.pendingUpdaters, pendingUpdaters);
                if (canvasAttributes) {
                    for (j = 0; j < canvasAttributes.length; j++) {
                        name = canvasAttributes[j];
                        instance.canvasAttributes[name] = instance[name];
                    }
                }
                sprite.callUpdaters(instance);
            }
        }
        sprite.setDirty(true);
        sprite.callUpdaters(attr);
    },
    popUp: function(attr, changes) {
        this.applyChanges(attr, changes);
    },
    pushDown: function(attr, changes) {
        if (this._lower) {
            changes = this._lower.pushDown(attr, changes);
        }
        this.applyChanges(attr, changes);
        return changes;
    }
});
Ext.define('Ext.draw.TimingFunctions', function() {
    var pow = Math.pow,
        sin = Math.sin,
        cos = Math.cos,
        sqrt = Math.sqrt,
        pi = Math.PI,
        poly = ['quad', 'cube', 'quart', 'quint'],
        easings = {
            pow: function(p, x) {
                return pow(p, x || 6);
            },
            expo: function(p) {
                return pow(2, 8 * (p - 1));
            },
            circ: function(p) {
                return 1 - sqrt(1 - p * p);
            },
            sine: function(p) {
                return 1 - sin((1 - p) * pi / 2);
            },
            back: function(p, n) {
                n = n || 1.616;
                return p * p * ((n + 1) * p - n);
            },
            bounce: function(p) {
                for (var a = 0, b = 1; 1; a += b, b /= 2) {
                    if (p >= (7 - 4 * a) / 11) {
                        return b * b - pow((11 - 6 * a - 11 * p) / 4, 2);
                    }
                }
            },
            elastic: function(p, x) {
                return pow(2, 10 * --p) * cos(20 * p * pi * (x || 1) / 3);
            }
        },
        easingsMap = {},
        name, len, i;

    function createPoly(times) {
        return function(p) {
            return pow(p, times);
        };
    }

    function addEasing(name, easing) {
        easingsMap[name + 'In'] = function(pos) {
            return easing(pos);
        };
        easingsMap[name + 'Out'] = function(pos) {
            return 1 - easing(1 - pos);
        };
        easingsMap[name + 'InOut'] = function(pos) {
            return pos <= 0.5 ? easing(2 * pos) / 2 : (2 - easing(2 * (1 - pos))) / 2;
        };
    }
    for (i = 0, len = poly.length; i < len; ++i) {
        easings[poly[i]] = createPoly(i + 2);
    }
    for (name in easings) {
        addEasing(name, easings[name]);
    }
    easingsMap.linear = Ext.identityFn;
    easingsMap.easeIn = easingsMap.quadIn;
    easingsMap.easeOut = easingsMap.quadOut;
    easingsMap.easeInOut = easingsMap.quadInOut;
    return { singleton: true, easingMap: easingsMap };
}, function(Cls) {
    Ext.apply(Cls, Cls.easingMap);
});
Ext.define('Ext.draw.Animator', {
    singleton: true,
    frameCallbacks: {},
    frameCallbackId: 0,
    scheduled: 0,
    frameStartTimeOffset: Ext.now(),
    animations: [],
    running: false,
    animationTime: function() {
        return Ext.AnimationQueue.frameStartTime - this.frameStartTimeOffset;
    },
    add: function(animation) {
        var me = this;
        if (!me.contains(animation)) {
            me.animations.push(animation);
            me.ignite();
            if ('fireEvent' in animation) {
                animation.fireEvent('animationstart', animation);
            }
        }
    },
    remove: function(animation) {
        var me = this,
            animations = me.animations,
            i = 0,
            l = animations.length;
        for (; i < l; ++i) {
            if (animations[i] === animation) {
                animations.splice(i, 1);
                if ('fireEvent' in animation) {
                    animation.fireEvent('animationend', animation);
                }
                return;
            }
        }
    },
    contains: function(animation) {
        return Ext.Array.indexOf(this.animations, animation) > -1;
    },
    empty: function() {
        return this.animations.length === 0;
    },
    step: function(frameTime) {
        var me = this,
            animations = me.animations,
            animation, i = 0,
            ln = animations.length;
        for (; i < ln; i++) {
            animation = animations[i];
            animation.step(frameTime);
            if (!animation.animating) {
                animations.splice(i, 1);
                i--;
                ln--;
                if (animation.fireEvent) {
                    animation.fireEvent('animationend', animation);
                }
            }
        }
    },
    schedule: function(callback, scope) {
        scope = scope || this;
        var id = 'frameCallback' + this.frameCallbackId++;
        if (Ext.isString(callback)) {
            callback = scope[callback];
        }
        Ext.draw.Animator.frameCallbacks[id] = { fn: callback, scope: scope, once: true };
        this.scheduled++;
        Ext.draw.Animator.ignite();
        return id;
    },
    scheduleIf: function(callback, scope) {
        scope = scope || this;
        var frameCallbacks = Ext.draw.Animator.frameCallbacks,
            cb, id;
        if (Ext.isString(callback)) {
            callback = scope[callback];
        }
        for (id in frameCallbacks) {
            cb = frameCallbacks[id];
            if (cb.once && cb.fn === callback && cb.scope === scope) {
                return null;
            }
        }
        return this.schedule(callback, scope);
    },
    cancel: function(id) {
        if (Ext.draw.Animator.frameCallbacks[id] && Ext.draw.Animator.frameCallbacks[id].once) {
            this.scheduled--;
            delete Ext.draw.Animator.frameCallbacks[id];
        }
    },
    addFrameCallback: function(callback, scope) {
        scope = scope || this;
        if (Ext.isString(callback)) {
            callback = scope[callback];
        }
        var id = 'frameCallback' + this.frameCallbackId++;
        Ext.draw.Animator.frameCallbacks[id] = { fn: callback, scope: scope };
        return id;
    },
    removeFrameCallback: function(id) {
        delete Ext.draw.Animator.frameCallbacks[id];
    },
    fireFrameCallbacks: function() {
        var callbacks = this.frameCallbacks,
            id, fn, cb;
        for (id in callbacks) {
            cb = callbacks[id];
            fn = cb.fn;
            if (Ext.isString(fn)) {
                fn = cb.scope[fn];
            }
            fn.call(cb.scope);
            if (callbacks[id] && cb.once) {
                this.scheduled--;
                delete callbacks[id];
            }
        }
    },
    handleFrame: function() {
        var me = this;
        me.step(me.animationTime());
        me.fireFrameCallbacks();
        if (!me.scheduled && me.empty()) {
            Ext.AnimationQueue.stop(me.handleFrame, me);
            me.running = false;
            Ext.draw.Draw.endUpdateIOS();
        }
    },
    ignite: function() {
        if (!this.running) {
            this.running = true;
            Ext.AnimationQueue.start(this.handleFrame, this);
            Ext.draw.Draw.beginUpdateIOS();
        }
    }
});
Ext.define('Ext.draw.modifier.Animation', {
    extend: Ext.draw.modifier.Modifier,
    alias: 'modifier.animation',
    config: { easing: Ext.identityFn, duration: 0, customEasings: {}, customDurations: {} },
    constructor: function(config) {
        var me = this;
        me.anyAnimation = me.anySpecialAnimations = false;
        me.animating = 0;
        me.animatingPool = [];
        me.callParent([config]);
    },
    prepareAttributes: function(attr) {
        if (!attr.hasOwnProperty('timers')) {
            attr.animating = false;
            attr.timers = {};
            attr.animationOriginal = Ext.Object.chain(attr);
            attr.animationOriginal.prototype = attr;
        }
        if (this._lower) {
            this._lower.prepareAttributes(attr.animationOriginal);
        }
    },
    updateSprite: function(sprite) {
        this.setConfig(sprite.config.fx);
    },
    updateDuration: function(duration) {
        this.anyAnimation = duration > 0;
    },
    applyEasing: function(easing) {
        if (typeof easing === 'string') {
            easing = Ext.draw.TimingFunctions.easingMap[easing];
        }
        return easing;
    },
    applyCustomEasings: function(newEasings, oldEasings) {
        oldEasings = oldEasings || {};
        var any, key, attrs, easing, i, ln;
        for (key in newEasings) {
            any = true;
            easing = newEasings[key];
            attrs = key.split(',');
            if (typeof easing === 'string') {
                easing = Ext.draw.TimingFunctions.easingMap[easing];
            }
            for (i = 0, ln = attrs.length; i < ln; i++) {
                oldEasings[attrs[i]] = easing;
            }
        }
        if (any) {
            this.anySpecialAnimations = any;
        }
        return oldEasings;
    },
    setEasingOn: function(attrs, easing) {
        attrs = Ext.Array.from(attrs).slice();
        var customEasings = {},
            ln = attrs.length,
            i = 0;
        for (; i < ln; i++) {
            customEasings[attrs[i]] = easing;
        }
        this.setCustomEasings(customEasings);
    },
    clearEasingOn: function(attrs) {
        attrs = Ext.Array.from(attrs, true);
        var i = 0,
            ln = attrs.length;
        for (; i < ln; i++) {
            delete this._customEasings[attrs[i]];
        }
    },
    applyCustomDurations: function(newDurations, oldDurations) {
        oldDurations = oldDurations || {};
        var any, key, duration, attrs, i, ln;
        for (key in newDurations) {
            any = true;
            duration = newDurations[key];
            attrs = key.split(',');
            for (i = 0, ln = attrs.length; i < ln; i++) {
                oldDurations[attrs[i]] = duration;
            }
        }
        if (any) {
            this.anySpecialAnimations = any;
        }
        return oldDurations;
    },
    setDurationOn: function(attrs, duration) {
        attrs = Ext.Array.from(attrs).slice();
        var customDurations = {},
            i = 0,
            ln = attrs.length;
        for (; i < ln; i++) {
            customDurations[attrs[i]] = duration;
        }
        this.setCustomDurations(customDurations);
    },
    clearDurationOn: function(attrs) {
        attrs = Ext.Array.from(attrs, true);
        var i = 0,
            ln = attrs.length;
        for (; i < ln; i++) {
            delete this._customDurations[attrs[i]];
        }
    },
    setAnimating: function(attr, animating) {
        var me = this,
            pool = me.animatingPool;
        if (attr.animating !== animating) {
            attr.animating = animating;
            if (animating) {
                pool.push(attr);
                if (me.animating === 0) {
                    Ext.draw.Animator.add(me);
                }
                me.animating++;
            } else {
                for (var i = pool.length; i--;) {
                    if (pool[i] === attr) {
                        pool.splice(i, 1);
                    }
                }
                me.animating = pool.length;
            }
        }
    },
    setAttrs: function(attr, changes) {
        var me = this,
            timers = attr.timers,
            parsers = me._sprite.self.def._animationProcessors,
            defaultEasing = me._easing,
            defaultDuration = me._duration,
            customDurations = me._customDurations,
            customEasings = me._customEasings,
            anySpecial = me.anySpecialAnimations,
            any = me.anyAnimation || anySpecial,
            animationOriginal = attr.animationOriginal,
            ignite = false,
            timer, name, newValue, startValue, parser, easing, duration;
        if (!any) {
            for (name in changes) {
                if (attr[name] === changes[name]) {
                    delete changes[name];
                } else {
                    attr[name] = changes[name];
                }
                delete animationOriginal[name];
                delete timers[name];
            }
            return changes;
        } else {
            for (name in changes) {
                newValue = changes[name];
                startValue = attr[name];
                if (newValue !== startValue && startValue !== undefined && startValue !== null && (parser = parsers[name])) {
                    easing = defaultEasing;
                    duration = defaultDuration;
                    if (anySpecial) {
                        if (name in customEasings) {
                            easing = customEasings[name];
                        }
                        if (name in customDurations) {
                            duration = customDurations[name];
                        }
                    }
                    if (startValue && startValue.isGradient || newValue && newValue.isGradient) {
                        duration = 0;
                    }
                    if (duration) {
                        if (!timers[name]) {
                            timers[name] = {};
                        }
                        timer = timers[name];
                        timer.start = 0;
                        timer.easing = easing;
                        timer.duration = duration;
                        timer.compute = parser.compute;
                        timer.serve = parser.serve || Ext.identityFn;
                        timer.remove = changes.removeFromInstance && changes.removeFromInstance[name];
                        if (parser.parseInitial) {
                            var initial = parser.parseInitial(startValue, newValue);
                            timer.source = initial[0];
                            timer.target = initial[1];
                        } else {
                            if (parser.parse) {
                                timer.source = parser.parse(startValue);
                                timer.target = parser.parse(newValue);
                            } else {
                                timer.source = startValue;
                                timer.target = newValue;
                            }
                        }
                        animationOriginal[name] = newValue;
                        delete changes[name];
                        ignite = true;
                        continue;
                    } else {
                        delete animationOriginal[name];
                    }
                } else {
                    delete animationOriginal[name];
                }
                delete timers[name];
            }
        }
        if (ignite && !attr.animating) {
            me.setAnimating(attr, true);
        }
        return changes;
    },
    updateAttributes: function(attr) {
        if (!attr.animating) {
            return {};
        }
        var changes = {},
            any = false,
            timers = attr.timers,
            animationOriginal = attr.animationOriginal,
            now = Ext.draw.Animator.animationTime(),
            name, timer, delta;
        if (attr.lastUpdate === now) {
            return null;
        }
        for (name in timers) {
            timer = timers[name];
            if (!timer.start) {
                timer.start = now;
                delta = 0;
            } else {
                delta = (now - timer.start) / timer.duration;
            }
            if (delta >= 1) {
                changes[name] = animationOriginal[name];
                delete animationOriginal[name];
                if (timers[name].remove) {
                    changes.removeFromInstance = changes.removeFromInstance || {};
                    changes.removeFromInstance[name] = true;
                }
                delete timers[name];
            } else {
                changes[name] = timer.serve(timer.compute(timer.source, timer.target, timer.easing(delta), attr[name]));
                any = true;
            }
        }
        attr.lastUpdate = now;
        this.setAnimating(attr, any);
        return changes;
    },
    pushDown: function(attr, changes) {
        changes = this.callParent([attr.animationOriginal, changes]);
        return this.setAttrs(attr, changes);
    },
    popUp: function(attr, changes) {
        attr = attr.prototype;
        changes = this.setAttrs(attr, changes);
        if (this._upper) {
            return this._upper.popUp(attr, changes);
        } else {
            return Ext.apply(attr, changes);
        }
    },
    step: function(frameTime) {
        var me = this,
            pool = me.animatingPool.slice(),
            ln = pool.length,
            i = 0,
            attr, changes;
        for (; i < ln; i++) {
            attr = pool[i];
            changes = me.updateAttributes(attr);
            if (changes && me._upper) {
                me._upper.popUp(attr, changes);
            }
        }
    },
    stop: function() {
        this.step();
        var me = this,
            pool = me.animatingPool,
            i, ln;
        for (i = 0, ln = pool.length; i < ln; i++) {
            pool[i].animating = false;
        }
        me.animatingPool.length = 0;
        me.animating = 0;
        Ext.draw.Animator.remove(me);
    },
    destroy: function() {
        this.stop();
        this.callParent();
    }
});
Ext.define('Ext.draw.modifier.Highlight', {
    extend: Ext.draw.modifier.Modifier,
    alias: 'modifier.highlight',
    config: { enabled: false, highlightStyle: null },
    preFx: true,
    applyHighlightStyle: function(style, oldStyle) {
        oldStyle = oldStyle || {};
        if (this.getSprite()) {
            Ext.apply(oldStyle, this.getSprite().self.def.normalize(style));
        } else {
            Ext.apply(oldStyle, style);
        }
        return oldStyle;
    },
    prepareAttributes: function(attr) {
        if (!attr.hasOwnProperty('highlightOriginal')) {
            attr.highlighted = false;
            attr.highlightOriginal = Ext.Object.chain(attr);
            attr.highlightOriginal.prototype = attr;
            attr.highlightOriginal.removeFromInstance = {};
        }
        if (this._lower) {
            this._lower.prepareAttributes(attr.highlightOriginal);
        }
    },
    updateSprite: function(sprite, oldSprite) {
        if (sprite) {
            if (this.getHighlightStyle()) {
                this._highlightStyle = sprite.self.def.normalize(this.getHighlightStyle());
            }
            this.setHighlightStyle(sprite.config.highlight);
        }
        sprite.self.def.setConfig({ defaults: { highlighted: false }, processors: { highlighted: 'bool' } });
        this.setSprite(sprite);
    },
    filterChanges: function(attr, changes) {
        var me = this,
            highlightOriginal = attr.highlightOriginal,
            style = me.getHighlightStyle(),
            name;
        if (attr.highlighted) {
            for (name in changes) {
                if (style.hasOwnProperty(name)) {
                    highlightOriginal[name] = changes[name];
                    delete changes[name];
                }
            }
        }
        for (name in changes) {
            if (name !== 'highlighted' && highlightOriginal[name] === changes[name]) {
                delete changes[name];
            }
        }
        return changes;
    },
    pushDown: function(attr, changes) {
        var highlightStyle = this.getHighlightStyle(),
            highlightOriginal = attr.highlightOriginal,
            removeFromInstance = highlightOriginal.removeFromInstance,
            highlighted, name, tplAttr, timer;
        if (changes.hasOwnProperty('highlighted')) {
            highlighted = changes.highlighted;
            delete changes.highlighted;
            if (this._lower) {
                changes = this._lower.pushDown(highlightOriginal, changes);
            }
            changes = this.filterChanges(attr, changes);
            if (highlighted !== attr.highlighted) {
                if (highlighted) {
                    for (name in highlightStyle) {
                        if (name in changes) {
                            highlightOriginal[name] = changes[name];
                        } else {
                            tplAttr = attr.template && attr.template.ownAttr;
                            if (tplAttr && !attr.prototype.hasOwnProperty(name)) {
                                removeFromInstance[name] = true;
                                highlightOriginal[name] = tplAttr.animationOriginal[name];
                            } else {
                                timer = highlightOriginal.timers[name];
                                if (timer && timer.remove) {
                                    removeFromInstance[name] = true;
                                }
                                highlightOriginal[name] = attr[name];
                            }
                        }
                        if (highlightOriginal[name] !== highlightStyle[name]) {
                            changes[name] = highlightStyle[name];
                        }
                    }
                } else {
                    for (name in highlightStyle) {
                        if (!(name in changes)) {
                            changes[name] = highlightOriginal[name];
                        }
                        delete highlightOriginal[name];
                    }
                    changes.removeFromInstance = changes.removeFromInstance || {};
                    Ext.apply(changes.removeFromInstance, removeFromInstance);
                    highlightOriginal.removeFromInstance = {};
                }
                changes.highlighted = highlighted;
            }
        } else {
            if (this._lower) {
                changes = this._lower.pushDown(highlightOriginal, changes);
            }
            changes = this.filterChanges(attr, changes);
        }
        return changes;
    },
    popUp: function(attr, changes) {
        changes = this.filterChanges(attr, changes);
        Ext.draw.modifier.Modifier.prototype.popUp.call(this, attr, changes);
    }
});
Ext.define('Ext.draw.sprite.Sprite', {
    alias: 'sprite.sprite',
    mixins: { observable: Ext.mixin.Observable },
    isSprite: true,
    statics: { defaultHitTestOptions: { fill: true, stroke: true }, debug: false },
    inheritableStatics: {
        def: {
            processors: {
                debug: 'default',
                strokeStyle: 'color',
                fillStyle: 'color',
                strokeOpacity: 'limited01',
                fillOpacity: 'limited01',
                lineWidth: 'number',
                lineCap: 'enums(butt,round,square)',
                lineJoin: 'enums(round,bevel,miter)',
                lineDash: 'data',
                lineDashOffset: 'number',
                miterLimit: 'number',
                shadowColor: 'color',
                shadowOffsetX: 'number',
                shadowOffsetY: 'number',
                shadowBlur: 'number',
                globalAlpha: 'limited01',
                globalCompositeOperation: 'enums(source-over,destination-over,source-in,destination-in,source-out,destination-out,source-atop,destination-atop,lighter,xor,copy)',
                hidden: 'bool',
                transformFillStroke: 'bool',
                zIndex: 'number',
                translationX: 'number',
                translationY: 'number',
                rotationRads: 'number',
                rotationCenterX: 'number',
                rotationCenterY: 'number',
                scalingX: 'number',
                scalingY: 'number',
                scalingCenterX: 'number',
                scalingCenterY: 'number',
                constrainGradients: 'bool'
            },
            aliases: { 'stroke': 'strokeStyle', 'fill': 'fillStyle', 'color': 'fillStyle', 'stroke-width': 'lineWidth', 'stroke-linecap': 'lineCap', 'stroke-linejoin': 'lineJoin', 'stroke-miterlimit': 'miterLimit', 'text-anchor': 'textAlign', 'opacity': 'globalAlpha', translateX: 'translationX', translateY: 'translationY', rotateRads: 'rotationRads', rotateCenterX: 'rotationCenterX', rotateCenterY: 'rotationCenterY', scaleX: 'scalingX', scaleY: 'scalingY', scaleCenterX: 'scalingCenterX', scaleCenterY: 'scalingCenterY' },
            defaults: { hidden: false, zIndex: 0, strokeStyle: 'none', fillStyle: 'none', lineWidth: 1, lineDash: [], lineDashOffset: 0, lineCap: 'butt', lineJoin: 'miter', miterLimit: 10, shadowColor: 'none', shadowOffsetX: 0, shadowOffsetY: 0, shadowBlur: 0, globalAlpha: 1, strokeOpacity: 1, fillOpacity: 1, transformFillStroke: false, translationX: 0, translationY: 0, rotationRads: 0, rotationCenterX: null, rotationCenterY: null, scalingX: 1, scalingY: 1, scalingCenterX: null, scalingCenterY: null, constrainGradients: false },
            triggers: {
                zIndex: 'zIndex',
                globalAlpha: 'canvas',
                globalCompositeOperation: 'canvas',
                transformFillStroke: 'canvas',
                strokeStyle: 'canvas',
                fillStyle: 'canvas',
                strokeOpacity: 'canvas',
                fillOpacity: 'canvas',
                lineWidth: 'canvas',
                lineCap: 'canvas',
                lineJoin: 'canvas',
                lineDash: 'canvas',
                lineDashOffset: 'canvas',
                miterLimit: 'canvas',
                shadowColor: 'canvas',
                shadowOffsetX: 'canvas',
                shadowOffsetY: 'canvas',
                shadowBlur: 'canvas',
                translationX: 'transform',
                translationY: 'transform',
                rotationRads: 'transform',
                rotationCenterX: 'transform',
                rotationCenterY: 'transform',
                scalingX: 'transform',
                scalingY: 'transform',
                scalingCenterX: 'transform',
                scalingCenterY: 'transform',
                constrainGradients: 'canvas'
            },
            updaters: {
                bbox: 'bboxUpdater',
                zIndex: function(attr) {
                    attr.dirtyZIndex = true;
                },
                transform: function(attr) {
                    attr.dirtyTransform = true;
                    attr.bbox.transform.dirty = true;
                }
            }
        }
    },
    config: { parent: null, surface: null },
    onClassExtended: function(subClass, data) {
        var superclassCfg = subClass.superclass.self.def.initialConfig,
            ownCfg = data.inheritableStatics && data.inheritableStatics.def,
            cfg;
        if (ownCfg) {
            cfg = Ext.Object.merge({}, superclassCfg, ownCfg);
            subClass.def = new Ext.draw.sprite.AttributeDefinition(cfg);
            delete data.inheritableStatics.def;
        } else {
            subClass.def = new Ext.draw.sprite.AttributeDefinition(superclassCfg);
        }
        subClass.def.spriteClass = subClass;
    },
    constructor: function(config) {
        if (Ext.getClassName(this) === 'Ext.draw.sprite.Sprite') {
            throw 'Ext.draw.sprite.Sprite is an abstract class';
        }
        var me = this,
            attributeDefinition = me.self.def,
            defaults = attributeDefinition.getDefaults(),
            modifiers;
        config = Ext.isObject(config) ? config : {};
        me.id = config.id || Ext.id(null, 'ext-sprite-');
        me.attr = {};
        me.mixins.observable.constructor.apply(me, arguments);
        modifiers = Ext.Array.from(config.modifiers, true);
        me.prepareModifiers(modifiers);
        me.initializeAttributes();
        me.setAttributes(defaults, true);
        var processors = attributeDefinition.getProcessors();
        for (var name in config) {
            if (name in processors && me['get' + name.charAt(0).toUpperCase() + name.substr(1)]) {
                Ext.raise('The ' + me.$className + ' sprite has both a config and an attribute with the same name: ' + name + '.');
            }
        }
        me.setAttributes(config);
    },
    getDirty: function() {
        return this.attr.dirty;
    },
    setDirty: function(dirty) {
        this.attr.dirty = dirty;
        if (dirty) {
            var parent = this.getParent();
            if (parent) {
                parent.setDirty(true);
            }
        }
    },
    addModifier: function(modifier, reinitializeAttributes) {
        var me = this;
        if (!(modifier instanceof Ext.draw.modifier.Modifier)) {
            modifier = Ext.factory(modifier, null, null, 'modifier');
        }
        modifier.setSprite(me);
        if (modifier.preFx || modifier.config && modifier.config.preFx) {
            if (me.fx._lower) {
                me.fx._lower.setUpper(modifier);
            }
            modifier.setUpper(me.fx);
        } else {
            me.topModifier._lower.setUpper(modifier);
            modifier.setUpper(me.topModifier);
        }
        if (reinitializeAttributes) {
            me.initializeAttributes();
        }
        return modifier;
    },
    prepareModifiers: function(additionalModifiers) {
        var me = this,
            i, ln;
        me.topModifier = new Ext.draw.modifier.Target({ sprite: me });
        me.fx = new Ext.draw.modifier.Animation({ sprite: me });
        me.fx.setUpper(me.topModifier);
        for (i = 0, ln = additionalModifiers.length; i < ln; i++) {
            me.addModifier(additionalModifiers[i], false);
        }
    },
    getAnimation: function() {
        return this.fx;
    },
    setAnimation: function(config) {
        this.fx.setConfig(config);
    },
    initializeAttributes: function() {
        this.topModifier.prepareAttributes(this.attr);
    },
    callUpdaters: function(attr) {
        attr = attr || this.attr;
        var me = this,
            pendingUpdaters = attr.pendingUpdaters,
            updaters = me.self.def.getUpdaters(),
            any = false,
            dirty = false,
            flags, updater, fn;
        me.callUpdaters = Ext.emptyFn;
        do {
            any = false;
            for (updater in pendingUpdaters) {
                any = true;
                flags = pendingUpdaters[updater];
                delete pendingUpdaters[updater];
                fn = updaters[updater];
                if (typeof fn === 'string') {
                    fn = me[fn];
                }
                if (fn) {
                    fn.call(me, attr, flags);
                }
            }
            dirty = dirty || any;
        } while (any);
        delete me.callUpdaters;
        if (dirty) {
            me.setDirty(true);
        }
    },
    callUpdater: function(attr, updater, triggers) {
        this.scheduleUpdater(attr, updater, triggers);
        this.callUpdaters(attr);
    },
    scheduleUpdaters: function(attr, updaters, triggers) {
        var updater;
        attr = attr || this.attr;
        if (triggers) {
            for (var i = 0, ln = updaters.length; i < ln; i++) {
                updater = updaters[i];
                this.scheduleUpdater(attr, updater, triggers);
            }
        } else {
            for (updater in updaters) {
                triggers = updaters[updater];
                this.scheduleUpdater(attr, updater, triggers);
            }
        }
    },
    scheduleUpdater: function(attr, updater, triggers) {
        triggers = triggers || [];
        attr = attr || this.attr;
        var pendingUpdaters = attr.pendingUpdaters;
        if (updater in pendingUpdaters) {
            if (triggers.length) {
                pendingUpdaters[updater] = Ext.Array.merge(pendingUpdaters[updater], triggers);
            }
        } else {
            pendingUpdaters[updater] = triggers;
        }
    },
    setAttributes: function(changes, bypassNormalization, avoidCopy) {
        var me = this,
            attr = me.attr,
            normalizedChanges, name, value, obj;
        if (me.isDestroyed) {
            Ext.Error.raise('Setting attributes of a destroyed sprite.');
        }
        if (bypassNormalization) {
            if (avoidCopy) {
                me.topModifier.pushDown(attr, changes);
            } else {
                obj = {};
                for (name in changes) {
                    value = changes[name];
                    if (value !== attr[name]) {
                        obj[name] = value;
                    }
                }
                me.topModifier.pushDown(attr, obj);
            }
        } else {
            normalizedChanges = me.self.def.normalize(changes);
            me.topModifier.pushDown(attr, normalizedChanges);
        }
    },
    setAttributesBypassingNormalization: function(changes, avoidCopy) {
        return this.setAttributes(changes, true, avoidCopy);
    },
    bboxUpdater: function(attr) {
        var hasRotation = attr.rotationRads !== 0,
            hasScaling = attr.scalingX !== 1 || attr.scalingY !== 1,
            noRotationCenter = attr.rotationCenterX === null || attr.rotationCenterY === null,
            noScalingCenter = attr.scalingCenterX === null || attr.scalingCenterY === null;
        attr.bbox.plain.dirty = true;
        attr.bbox.transform.dirty = true;
        if (hasRotation && noRotationCenter || hasScaling && noScalingCenter) {
            this.scheduleUpdater(attr, 'transform');
        }
    },
    getBBox: function(isWithoutTransform) {
        var me = this,
            attr = me.attr,
            bbox = attr.bbox,
            plain = bbox.plain,
            transform = bbox.transform;
        if (plain.dirty) {
            me.updatePlainBBox(plain);
            plain.dirty = false;
        }
        if (!isWithoutTransform) {
            me.applyTransformations();
            if (transform.dirty) {
                me.updateTransformedBBox(transform, plain);
                transform.dirty = false;
            }
            return transform;
        }
        return plain;
    },
    updatePlainBBox: Ext.emptyFn,
    updateTransformedBBox: function(transform, plain) {
        this.attr.matrix.transformBBox(plain, 0, transform);
    },
    getBBoxCenter: function(isWithoutTransform) {
        var bbox = this.getBBox(isWithoutTransform);
        if (bbox) {
            return [bbox.x + bbox.width * 0.5, bbox.y + bbox.height * 0.5];
        } else {
            return [0, 0];
        }
    },
    hide: function() {
        this.attr.hidden = true;
        this.setDirty(true);
        return this;
    },
    show: function() {
        this.attr.hidden = false;
        this.setDirty(true);
        return this;
    },
    useAttributes: function(ctx, rect) {
        this.applyTransformations();
        var attr = this.attr,
            canvasAttributes = attr.canvasAttributes,
            strokeStyle = canvasAttributes.strokeStyle,
            fillStyle = canvasAttributes.fillStyle,
            lineDash = canvasAttributes.lineDash,
            lineDashOffset = canvasAttributes.lineDashOffset,
            id;
        if (strokeStyle) {
            if (strokeStyle.isGradient) {
                ctx.strokeStyle = 'black';
                ctx.strokeGradient = strokeStyle;
            } else {
                ctx.strokeGradient = false;
            }
        }
        if (fillStyle) {
            if (fillStyle.isGradient) {
                ctx.fillStyle = 'black';
                ctx.fillGradient = fillStyle;
            } else {
                ctx.fillGradient = false;
            }
        }
        if (lineDash) {
            ctx.setLineDash(lineDash);
        }
        if (Ext.isNumber(lineDashOffset) && Ext.isNumber(ctx.lineDashOffset)) {
            ctx.lineDashOffset = lineDashOffset;
        }
        for (id in canvasAttributes) {
            if (canvasAttributes[id] !== undefined && canvasAttributes[id] !== ctx[id]) {
                ctx[id] = canvasAttributes[id];
            }
        }
        this.setGradientBBox(ctx, rect);
    },
    setGradientBBox: function(ctx, rect) {
        var attr = this.attr;
        if (attr.constrainGradients) {
            ctx.setGradientBBox({ x: rect[0], y: rect[1], width: rect[2], height: rect[3] });
        } else {
            ctx.setGradientBBox(this.getBBox(attr.transformFillStroke));
        }
    },
    applyTransformations: function(force) {
        if (!force && !this.attr.dirtyTransform) {
            return;
        }
        var me = this,
            attr = me.attr,
            center = me.getBBoxCenter(true),
            centerX = center[0],
            centerY = center[1],
            tx = attr.translationX,
            ty = attr.translationY,
            sx = attr.scalingX,
            sy = attr.scalingY === null ? attr.scalingX : attr.scalingY,
            scx = attr.scalingCenterX === null ? centerX : attr.scalingCenterX,
            scy = attr.scalingCenterY === null ? centerY : attr.scalingCenterY,
            rad = attr.rotationRads,
            rcx = attr.rotationCenterX === null ? centerX : attr.rotationCenterX,
            rcy = attr.rotationCenterY === null ?
            centerY : attr.rotationCenterY,
            cos = Math.cos(rad),
            sin = Math.sin(rad),
            tx_4, ty_4;
        if (sx === 1 && sy === 1) {
            scx = 0;
            scy = 0;
        }
        if (rad === 0) {
            rcx = 0;
            rcy = 0;
        }
        tx_4 = scx * (1 - sx) - rcx;
        ty_4 = scy * (1 - sy) - rcy;
        attr.matrix.elements = [cos * sx, sin * sx, -sin * sy, cos * sy, cos * tx_4 - sin * ty_4 + rcx + tx, sin * tx_4 + cos * ty_4 + rcy + ty];
        attr.matrix.inverse(attr.inverseMatrix);
        attr.dirtyTransform = false;
        attr.bbox.transform.dirty = true;
    },
    transform: function(matrix, isSplit) {
        var attr = this.attr,
            spriteMatrix = attr.matrix,
            elements;
        if (matrix && matrix.isMatrix) {
            elements = matrix.elements;
        } else {
            elements = matrix;
        }
        if (!(Ext.isArray(elements) && elements.length === 6)) {
            Ext.raise('An instance of Ext.draw.Matrix or an array of 6 numbers is expected.');
        }
        spriteMatrix.prepend.apply(spriteMatrix, elements.slice());
        spriteMatrix.inverse(attr.inverseMatrix);
        if (isSplit) {
            this.updateTransformAttributes();
        }
        attr.dirtyTransform = false;
        attr.bbox.transform.dirty = true;
        this.setDirty(true);
        return this;
    },
    updateTransformAttributes: function() {
        var attr = this.attr,
            split = attr.matrix.split();
        attr.rotationRads = split.rotate;
        attr.rotationCenterX = 0;
        attr.rotationCenterY = 0;
        attr.scalingX = split.scaleX;
        attr.scalingY = split.scaleY;
        attr.scalingCenterX = 0;
        attr.scalingCenterY = 0;
        attr.translationX = split.translateX;
        attr.translationY = split.translateY;
    },
    resetTransform: function(isSplit) {
        var attr = this.attr;
        attr.matrix.reset();
        attr.inverseMatrix.reset();
        if (!isSplit) {
            this.updateTransformAttributes();
        }
        attr.dirtyTransform = false;
        attr.bbox.transform.dirty = true;
        this.setDirty(true);
        return this;
    },
    setTransform: function(matrix, isSplit) {
        this.resetTransform(true);
        this.transform.call(this, matrix, isSplit);
        return this;
    },
    preRender: Ext.emptyFn,
    render: Ext.emptyFn,
    renderBBox: function(surface, ctx) {
        var bbox = this.getBBox();
        ctx.beginPath();
        ctx.moveTo(bbox.x, bbox.y);
        ctx.lineTo(bbox.x + bbox.width, bbox.y);
        ctx.lineTo(bbox.x + bbox.width, bbox.y + bbox.height);
        ctx.lineTo(bbox.x, bbox.y + bbox.height);
        ctx.closePath();
        ctx.strokeStyle = 'red';
        ctx.strokeOpacity = 1;
        ctx.lineWidth = 0.5;
        ctx.stroke();
    },
    hitTest: function(point, options) {
        if (this.isVisible()) {
            var x = point[0],
                y = point[1],
                bbox = this.getBBox(),
                isBBoxHit = bbox && x >= bbox.x && x <= bbox.x + bbox.width && y >= bbox.y && y <= bbox.y + bbox.height;
            if (isBBoxHit) {
                return { sprite: this };
            }
        }
        return null;
    },
    isVisible: function() {
        var attr = this.attr,
            parent = this.getParent(),
            hasParent = parent && (parent.isSurface || parent.isVisible()),
            isSeen = hasParent && !attr.hidden && attr.globalAlpha,
            none1 = Ext.util.Color.NONE,
            none2 = Ext.util.Color.RGBA_NONE,
            hasFill = attr.fillOpacity && attr.fillStyle !== none1 && attr.fillStyle !== none2,
            hasStroke = attr.strokeOpacity && attr.strokeStyle !== none1 && attr.strokeStyle !== none2,
            result = isSeen && (hasFill || hasStroke);
        return !!result;
    },
    repaint: function() {
        var surface = this.getSurface();
        if (surface) {
            surface.renderFrame();
        }
    },
    remove: function() {
        var surface = this.getSurface();
        if (surface && surface.isSurface) {
            return surface.remove(this);
        }
        return null;
    },
    destroy: function() {
        var me = this,
            modifier = me.topModifier,
            currentModifier;
        while (modifier) {
            currentModifier = modifier;
            modifier = modifier._lower;
            currentModifier.destroy();
        }
        delete me.attr;
        me.remove();
        if (me.fireEvent('beforedestroy', me) !== false) {
            me.fireEvent('destroy', me);
        }
        me.callParent();
    }
}, function() {
    this.def = new Ext.draw.sprite.AttributeDefinition(this.def);
    this.def.spriteClass = this;
});
Ext.define('Ext.draw.Path', {
    statics: { pathRe: /,?([achlmqrstvxz]),?/gi, pathRe2: /-/gi, pathSplitRe: /\s|,/g },
    svgString: '',
    constructor: function(pathString) {
        var me = this;
        me.commands = [];
        me.params = [];
        me.cursor = null;
        me.startX = 0;
        me.startY = 0;
        if (pathString) {
            me.fromSvgString(pathString);
        }
    },
    clear: function() {
        var me = this;
        me.params.length = 0;
        me.commands.length = 0;
        me.cursor = null;
        me.startX = 0;
        me.startY = 0;
        me.dirt();
    },
    dirt: function() {
        this.svgString = '';
    },
    moveTo: function(x, y) {
        var me = this;
        if (!me.cursor) {
            me.cursor = [x, y];
        }
        me.params.push(x, y);
        me.commands.push('M');
        me.startX = x;
        me.startY = y;
        me.cursor[0] = x;
        me.cursor[1] = y;
        me.dirt();
    },
    lineTo: function(x, y) {
        var me = this;
        if (!me.cursor) {
            me.cursor = [x, y];
            me.params.push(x, y);
            me.commands.push('M');
        } else {
            me.params.push(x, y);
            me.commands.push('L');
        }
        me.cursor[0] = x;
        me.cursor[1] = y;
        me.dirt();
    },
    bezierCurveTo: function(cx1, cy1, cx2, cy2, x, y) {
        var me = this;
        if (!me.cursor) {
            me.moveTo(cx1, cy1);
        }
        me.params.push(cx1, cy1, cx2, cy2, x, y);
        me.commands.push('C');
        me.cursor[0] = x;
        me.cursor[1] = y;
        me.dirt();
    },
    quadraticCurveTo: function(cx, cy, x, y) {
        var me = this;
        if (!me.cursor) {
            me.moveTo(cx, cy);
        }
        me.bezierCurveTo((2 * cx + me.cursor[0]) / 3, (2 * cy + me.cursor[1]) / 3, (2 * cx + x) / 3, (2 * cy + y) / 3, x, y);
    },
    closePath: function() {
        var me = this;
        if (me.cursor) {
            me.cursor = null;
            me.commands.push('Z');
            me.dirt();
        }
    },
    arcTo: function(x1, y1, x2, y2, rx, ry, rotation) {
        var me = this;
        if (ry === undefined) {
            ry = rx;
        }
        if (rotation === undefined) {
            rotation = 0;
        }
        if (!me.cursor) {
            me.moveTo(x1, y1);
            return;
        }
        if (rx === 0 || ry === 0) {
            me.lineTo(x1, y1);
            return;
        }
        x2 -= x1;
        y2 -= y1;
        var x0 = me.cursor[0] - x1,
            y0 = me.cursor[1] - y1,
            area = x2 * y0 - y2 * x0,
            cos, sin, xx, yx, xy, yy, l0 = Math.sqrt(x0 * x0 + y0 * y0),
            l2 = Math.sqrt(x2 * x2 + y2 * y2),
            dist, cx, cy;
        if (area === 0) {
            me.lineTo(x1, y1);
            return;
        }
        if (ry !== rx) {
            cos = Math.cos(rotation);
            sin = Math.sin(rotation);
            xx = cos / rx;
            yx = sin / ry;
            xy = -sin / rx;
            yy = cos / ry;
            var temp = xx * x0 + yx * y0;
            y0 = xy * x0 + yy * y0;
            x0 = temp;
            temp = xx * x2 + yx * y2;
            y2 = xy * x2 + yy * y2;
            x2 = temp;
        } else {
            x0 /= rx;
            y0 /= ry;
            x2 /= rx;
            y2 /= ry;
        }
        cx = x0 * l2 + x2 * l0;
        cy = y0 * l2 + y2 * l0;
        dist = 1 / (Math.sin(Math.asin(Math.abs(area) / (l0 * l2)) * 0.5) * Math.sqrt(cx * cx + cy * cy));
        cx *= dist;
        cy *= dist;
        var k0 = (cx * x0 + cy * y0) / (x0 * x0 + y0 * y0),
            k2 = (cx * x2 + cy * y2) / (x2 * x2 + y2 * y2);
        var cosStart = x0 * k0 - cx,
            sinStart = y0 * k0 - cy,
            cosEnd = x2 * k2 - cx,
            sinEnd = y2 * k2 - cy,
            startAngle = Math.atan2(sinStart, cosStart),
            endAngle = Math.atan2(sinEnd, cosEnd);
        if (area > 0) {
            if (endAngle < startAngle) {
                endAngle += Math.PI * 2;
            }
        } else {
            if (startAngle < endAngle) {
                startAngle += Math.PI * 2;
            }
        }
        if (ry !== rx) {
            cx = cos * cx * rx - sin * cy * ry + x1;
            cy = sin * cy * ry + cos * cy * ry + y1;
            me.lineTo(cos * rx * cosStart - sin * ry * sinStart + cx, sin * rx * cosStart + cos * ry * sinStart + cy);
            me.ellipse(cx, cy, rx, ry, rotation, startAngle, endAngle, area < 0);
        } else {
            cx = cx * rx + x1;
            cy = cy * ry + y1;
            me.lineTo(rx * cosStart + cx, ry * sinStart + cy);
            me.ellipse(cx, cy, rx, ry, rotation, startAngle, endAngle, area < 0);
        }
    },
    ellipse: function(cx, cy, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise) {
        var me = this,
            params = me.params,
            start = params.length,
            count, i, j;
        if (endAngle - startAngle >= Math.PI * 2) {
            me.ellipse(cx, cy, radiusX, radiusY, rotation, startAngle, startAngle + Math.PI, anticlockwise);
            me.ellipse(cx, cy, radiusX, radiusY, rotation, startAngle + Math.PI, endAngle, anticlockwise);
            return;
        }
        if (!anticlockwise) {
            if (endAngle < startAngle) {
                endAngle += Math.PI * 2;
            }
            count = me.approximateArc(params, cx, cy, radiusX, radiusY, rotation, startAngle, endAngle);
        } else {
            if (startAngle < endAngle) {
                startAngle += Math.PI * 2;
            }
            count = me.approximateArc(params, cx, cy, radiusX, radiusY, rotation, endAngle, startAngle);
            for (i = start, j = params.length - 2; i < j; i += 2, j -= 2) {
                var temp = params[i];
                params[i] = params[j];
                params[j] = temp;
                temp = params[i + 1];
                params[i + 1] = params[j + 1];
                params[j + 1] = temp;
            }
        }
        if (!me.cursor) {
            me.cursor = [params[params.length - 2], params[params.length - 1]];
            me.commands.push('M');
        } else {
            me.cursor[0] = params[params.length - 2];
            me.cursor[1] = params[params.length - 1];
            me.commands.push('L');
        }
        for (i = 2; i < count; i += 6) {
            me.commands.push('C');
        }
        me.dirt();
    },
    arc: function(x, y, radius, startAngle, endAngle, anticlockwise) {
        this.ellipse(x, y, radius, radius, 0, startAngle, endAngle, anticlockwise);
    },
    rect: function(x, y, width, height) {
        if (width == 0 || height == 0) {
            return;
        }
        var me = this;
        me.moveTo(x, y);
        me.lineTo(x + width, y);
        me.lineTo(x + width, y + height);
        me.lineTo(x, y + height);
        me.closePath();
    },
    approximateArc: function(result, cx, cy, rx, ry, phi, theta1, theta2) {
        var cosPhi = Math.cos(phi),
            sinPhi = Math.sin(phi),
            cosTheta1 = Math.cos(theta1),
            sinTheta1 = Math.sin(theta1),
            xx = cosPhi * cosTheta1 * rx - sinPhi * sinTheta1 * ry,
            yx = -cosPhi * sinTheta1 * rx - sinPhi * cosTheta1 * ry,
            xy = sinPhi * cosTheta1 * rx + cosPhi * sinTheta1 * ry,
            yy = -sinPhi * sinTheta1 * rx + cosPhi * cosTheta1 * ry,
            rightAngle = Math.PI / 2,
            count = 2,
            exx = xx,
            eyx = yx,
            exy = xy,
            eyy = yy,
            rho = 0.547443256150549,
            temp, y1, x3, y3, x2, y2;
        theta2 -= theta1;
        if (theta2 < 0) {
            theta2 += Math.PI * 2;
        }
        result.push(xx + cx, xy + cy);
        while (theta2 >= rightAngle) {
            result.push(exx + eyx * rho + cx, exy + eyy * rho + cy, exx * rho + eyx + cx, exy * rho + eyy + cy, eyx + cx, eyy + cy);
            count += 6;
            theta2 -= rightAngle;
            temp = exx;
            exx = eyx;
            eyx = -temp;
            temp = exy;
            exy = eyy;
            eyy = -temp;
        }
        if (theta2) {
            y1 = (0.3294738052815987 + 0.012120855841304373 * theta2) * theta2;
            x3 = Math.cos(theta2);
            y3 = Math.sin(theta2);
            x2 = x3 + y1 * y3;
            y2 = y3 - y1 * x3;
            result.push(exx + eyx * y1 + cx, exy + eyy * y1 + cy, exx * x2 + eyx * y2 + cx, exy * x2 + eyy * y2 + cy, exx * x3 + eyx * y3 + cx, exy * x3 + eyy * y3 + cy);
            count += 6;
        }
        return count;
    },
    arcSvg: function(rx, ry, rotation, fA, fS, x2, y2) {
        if (rx < 0) {
            rx = -rx;
        }
        if (ry < 0) {
            ry = -ry;
        }
        var me = this,
            x1 = me.cursor[0],
            y1 = me.cursor[1],
            hdx = (x1 - x2) / 2,
            hdy = (y1 - y2) / 2,
            cosPhi = Math.cos(rotation),
            sinPhi = Math.sin(rotation),
            xp = hdx * cosPhi + hdy * sinPhi,
            yp = -hdx * sinPhi + hdy * cosPhi,
            ratX = xp / rx,
            ratY = yp / ry,
            lambda = ratX * ratX + ratY * ratY,
            cx = (x1 + x2) * 0.5,
            cy = (y1 + y2) * 0.5,
            cpx = 0,
            cpy = 0;
        if (lambda >= 1) {
            lambda = Math.sqrt(lambda);
            rx *= lambda;
            ry *= lambda;
        } else {
            lambda = Math.sqrt(1 / lambda - 1);
            if (fA === fS) {
                lambda = -lambda;
            }
            cpx = lambda * rx * ratY;
            cpy = -lambda * ry * ratX;
            cx += cosPhi * cpx - sinPhi * cpy;
            cy += sinPhi * cpx + cosPhi * cpy;
        }
        var theta1 = Math.atan2((yp - cpy) / ry, (xp - cpx) / rx),
            deltaTheta = Math.atan2((-yp - cpy) / ry, (-xp - cpx) / rx) - theta1;
        if (fS) {
            if (deltaTheta <= 0) {
                deltaTheta += Math.PI * 2;
            }
        } else {
            if (deltaTheta >= 0) {
                deltaTheta -= Math.PI * 2;
            }
        }
        me.ellipse(cx, cy, rx, ry, rotation, theta1, theta1 + deltaTheta, 1 - fS);
    },
    fromSvgString: function(pathString) {
        if (!pathString) {
            return;
        }
        var me = this,
            parts, paramCounts = { a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0, A: 7, C: 6, H: 1, L: 2, M: 2, Q: 4, S: 4, T: 2, V: 1, Z: 0 },
            lastCommand = '',
            lastControlX, lastControlY, lastX = 0,
            lastY = 0,
            part = false,
            i, partLength, relative;
        if (Ext.isString(pathString)) {
            parts = pathString.replace(Ext.draw.Path.pathRe, ' $1 ').replace(Ext.draw.Path.pathRe2, ' -').split(Ext.draw.Path.pathSplitRe);
        } else {
            if (Ext.isArray(pathString)) {
                parts = pathString.join(',').split(Ext.draw.Path.pathSplitRe);
            }
        }
        for (i = 0, partLength = 0; i < parts.length; i++) {
            if (parts[i] !== '') {
                parts[partLength++] = parts[i];
            }
        }
        parts.length = partLength;
        me.clear();
        for (i = 0; i < parts.length;) {
            lastCommand = part;
            part = parts[i];
            relative = part.toUpperCase() !== part;
            i++;
            switch (part) {
                case 'M':
                    me.moveTo(lastX = +parts[i], lastY = +parts[i + 1]);
                    i += 2;
                    while (i < partLength && !paramCounts.hasOwnProperty(parts[i])) {
                        me.lineTo(lastX = +parts[i], lastY = +parts[i + 1]);
                        i += 2;
                    }
                    break;
                case 'L':
                    me.lineTo(lastX = +parts[i], lastY = +parts[i + 1]);
                    i += 2;
                    while (i < partLength && !paramCounts.hasOwnProperty(parts[i])) {
                        me.lineTo(lastX = +parts[i], lastY = +parts[i + 1]);
                        i += 2;
                    }
                    break;
                case 'A':
                    while (i < partLength && !paramCounts.hasOwnProperty(parts[i])) {
                        me.arcSvg(+parts[i], +parts[i + 1], +parts[i + 2] * Math.PI / 180, +parts[i + 3], +parts[i + 4], lastX = +parts[i + 5], lastY = +parts[i + 6]);
                        i += 7;
                    }
                    break;
                case 'C':
                    while (i < partLength && !paramCounts.hasOwnProperty(parts[i])) {
                        me.bezierCurveTo(+parts[i], +parts[i + 1], lastControlX = +parts[i + 2], lastControlY = +parts[i + 3], lastX = +parts[i + 4], lastY = +parts[i + 5]);
                        i += 6;
                    }
                    break;
                case 'Z':
                    me.closePath();
                    break;
                case 'm':
                    me.moveTo(lastX += +parts[i], lastY += +parts[i + 1]);
                    i += 2;
                    while (i < partLength && !paramCounts.hasOwnProperty(parts[i])) {
                        me.lineTo(lastX += +parts[i], lastY += +parts[i + 1]);
                        i += 2;
                    }
                    break;
                case 'l':
                    me.lineTo(lastX += +parts[i], lastY += +parts[i + 1]);
                    i += 2;
                    while (i < partLength && !paramCounts.hasOwnProperty(parts[i])) {
                        me.lineTo(lastX += +parts[i], lastY += +parts[i + 1]);
                        i += 2;
                    }
                    break;
                case 'a':
                    while (i < partLength && !paramCounts.hasOwnProperty(parts[i])) {
                        me.arcSvg(+parts[i], +parts[i + 1], +parts[i + 2] * Math.PI / 180, +parts[i + 3], +parts[i + 4], lastX += +parts[i + 5], lastY += +parts[i + 6]);
                        i += 7;
                    }
                    break;
                case 'c':
                    while (i < partLength && !paramCounts.hasOwnProperty(parts[i])) {
                        me.bezierCurveTo(lastX + +parts[i], lastY + +parts[i + 1], lastControlX = lastX + +parts[i + 2], lastControlY = lastY + +parts[i + 3], lastX += +parts[i + 4], lastY += +parts[i + 5]);
                        i += 6;
                    }
                    break;
                case 'z':
                    me.closePath();
                    break;
                case 's':
                    if (!(lastCommand === 'c' || lastCommand === 'C' || lastCommand === 's' || lastCommand === 'S')) {
                        lastControlX = lastX;
                        lastControlY = lastY;
                    }
                    while (i < partLength && !paramCounts.hasOwnProperty(parts[i])) {
                        me.bezierCurveTo(lastX + lastX - lastControlX, lastY + lastY - lastControlY, lastControlX = lastX + +parts[i], lastControlY = lastY + +parts[i + 1], lastX += +parts[i + 2], lastY += +parts[i + 3]);
                        i += 4;
                    }
                    break;
                case 'S':
                    if (!(lastCommand === 'c' || lastCommand === 'C' || lastCommand === 's' || lastCommand === 'S')) {
                        lastControlX = lastX;
                        lastControlY = lastY;
                    }
                    while (i < partLength && !paramCounts.hasOwnProperty(parts[i])) {
                        me.bezierCurveTo(lastX + lastX - lastControlX, lastY + lastY - lastControlY, lastControlX = +parts[i], lastControlY = +parts[i + 1], lastX = +parts[i + 2], lastY = +parts[i + 3]);
                        i += 4;
                    }
                    break;
                case 'q':
                    while (i < partLength && !paramCounts.hasOwnProperty(parts[i])) {
                        me.quadraticCurveTo(lastControlX = lastX + +parts[i], lastControlY = lastY + +parts[i + 1], lastX += +parts[i + 2], lastY += +parts[i + 3]);
                        i += 4;
                    }
                    break;
                case 'Q':
                    while (i < partLength && !paramCounts.hasOwnProperty(parts[i])) {
                        me.quadraticCurveTo(lastControlX = +parts[i], lastControlY = +parts[i + 1], lastX = +parts[i + 2], lastY = +parts[i + 3]);
                        i += 4;
                    }
                    break;
                case 't':
                    if (!(lastCommand === 'q' || lastCommand === 'Q' || lastCommand === 't' || lastCommand === 'T')) {
                        lastControlX = lastX;
                        lastControlY = lastY;
                    }
                    while (i < partLength && !paramCounts.hasOwnProperty(parts[i])) {
                        me.quadraticCurveTo(lastControlX = lastX + lastX - lastControlX, lastControlY = lastY + lastY - lastControlY, lastX += +parts[i + 1], lastY += +parts[i + 2]);
                        i += 2;
                    }
                    break;
                case 'T':
                    if (!(lastCommand === 'q' || lastCommand === 'Q' || lastCommand === 't' || lastCommand === 'T')) {
                        lastControlX = lastX;
                        lastControlY = lastY;
                    }
                    while (i < partLength && !paramCounts.hasOwnProperty(parts[i])) {
                        me.quadraticCurveTo(lastControlX = lastX + lastX - lastControlX, lastControlY = lastY + lastY - lastControlY, lastX = +parts[i + 1], lastY = +parts[i + 2]);
                        i += 2;
                    }
                    break;
                case 'h':
                    while (i < partLength && !paramCounts.hasOwnProperty(parts[i])) {
                        me.lineTo(lastX += +parts[i], lastY);
                        i++;
                    }
                    break;
                case 'H':
                    while (i < partLength && !paramCounts.hasOwnProperty(parts[i])) {
                        me.lineTo(lastX = +parts[i], lastY);
                        i++;
                    }
                    break;
                case 'v':
                    while (i < partLength && !paramCounts.hasOwnProperty(parts[i])) {
                        me.lineTo(lastX, lastY += +parts[i]);
                        i++;
                    }
                    break;
                case 'V':
                    while (i < partLength && !paramCounts.hasOwnProperty(parts[i])) {
                        me.lineTo(lastX, lastY = +parts[i]);
                        i++;
                    }
                    break;
            }
        }
    },
    clone: function() {
        var me = this,
            path = new Ext.draw.Path;
        path.params = me.params.slice(0);
        path.commands = me.commands.slice(0);
        path.cursor = me.cursor ? me.cursor.slice(0) : null;
        path.startX = me.startX;
        path.startY = me.startY;
        path.svgString = me.svgString;
        return path;
    },
    transform: function(matrix) {
        if (matrix.isIdentity()) {
            return;
        }
        var xx = matrix.getXX(),
            yx = matrix.getYX(),
            dx = matrix.getDX(),
            xy = matrix.getXY(),
            yy = matrix.getYY(),
            dy = matrix.getDY(),
            params = this.params,
            i = 0,
            ln = params.length,
            x, y;
        for (; i < ln; i += 2) {
            x = params[i];
            y = params[i + 1];
            params[i] = x * xx + y * yx + dx;
            params[i + 1] = x * xy + y * yy + dy;
        }
        this.dirt();
    },
    getDimension: function(target) {
        if (!target) {
            target = {};
        }
        if (!this.commands || !this.commands.length) {
            target.x = 0;
            target.y = 0;
            target.width = 0;
            target.height = 0;
            return target;
        }
        target.left = Infinity;
        target.top = Infinity;
        target.right = -Infinity;
        target.bottom = -Infinity;
        var i = 0,
            j = 0,
            commands = this.commands,
            params = this.params,
            ln = commands.length,
            x, y;
        for (; i < ln; i++) {
            switch (commands[i]) {
                case 'M':
                case 'L':
                    x = params[j];
                    y = params[j + 1];
                    target.left = Math.min(x, target.left);
                    target.top = Math.min(y, target.top);
                    target.right = Math.max(x, target.right);
                    target.bottom = Math.max(y, target.bottom);
                    j += 2;
                    break;
                case 'C':
                    this.expandDimension(target, x, y, params[j], params[j + 1], params[j + 2], params[j + 3], x = params[j + 4], y = params[j + 5]);
                    j += 6;
                    break;
            }
        }
        target.x = target.left;
        target.y = target.top;
        target.width = target.right - target.left;
        target.height = target.bottom - target.top;
        return target;
    },
    getDimensionWithTransform: function(matrix, target) {
        if (!this.commands || !this.commands.length) {
            if (!target) {
                target = {};
            }
            target.x = 0;
            target.y = 0;
            target.width = 0;
            target.height = 0;
            return target;
        }
        target.left = Infinity;
        target.top = Infinity;
        target.right = -Infinity;
        target.bottom = -Infinity;
        var xx = matrix.getXX(),
            yx = matrix.getYX(),
            dx = matrix.getDX(),
            xy = matrix.getXY(),
            yy = matrix.getYY(),
            dy = matrix.getDY(),
            i = 0,
            j = 0,
            commands = this.commands,
            params = this.params,
            ln = commands.length,
            x, y;
        for (; i < ln; i++) {
            switch (commands[i]) {
                case 'M':
                case 'L':
                    x = params[j] * xx + params[j + 1] * yx + dx;
                    y = params[j] * xy + params[j + 1] * yy + dy;
                    target.left = Math.min(x, target.left);
                    target.top = Math.min(y, target.top);
                    target.right = Math.max(x, target.right);
                    target.bottom = Math.max(y, target.bottom);
                    j += 2;
                    break;
                case 'C':
                    this.expandDimension(target, x, y, params[j] * xx + params[j + 1] * yx + dx, params[j] * xy + params[j + 1] * yy + dy, params[j + 2] * xx + params[j + 3] * yx + dx, params[j + 2] * xy + params[j + 3] * yy + dy, x = params[j + 4] * xx + params[j + 5] * yx + dx, y = params[j + 4] * xy + params[j + 5] * yy + dy);
                    j += 6;
                    break;
            }
        }
        if (!target) {
            target = {};
        }
        target.x = target.left;
        target.y = target.top;
        target.width = target.right - target.left;
        target.height = target.bottom - target.top;
        return target;
    },
    expandDimension: function(target, x1, y1, cx1, cy1, cx2, cy2, x2, y2) {
        var me = this,
            l = target.left,
            r = target.right,
            t = target.top,
            b = target.bottom,
            dim = me.dim || (me.dim = []);
        me.curveDimension(x1, cx1, cx2, x2, dim);
        l = Math.min(l, dim[0]);
        r = Math.max(r, dim[1]);
        me.curveDimension(y1, cy1, cy2, y2, dim);
        t = Math.min(t, dim[0]);
        b = Math.max(b, dim[1]);
        target.left = l;
        target.right = r;
        target.top = t;
        target.bottom = b;
    },
    curveDimension: function(a, b, c, d, dim) {
        var qa = 3 * (-a + 3 * (b - c) + d),
            qb = 6 * (a - 2 * b + c),
            qc = -3 * (a - b),
            x, y, min = Math.min(a, d),
            max = Math.max(a, d),
            delta;
        if (qa === 0) {
            if (qb === 0) {
                dim[0] = min;
                dim[1] = max;
                return;
            } else {
                x = -qc / qb;
                if (0 < x && x < 1) {
                    y = this.interpolate(a, b, c, d, x);
                    min = Math.min(min, y);
                    max = Math.max(max, y);
                }
            }
        } else {
            delta = qb * qb - 4 * qa * qc;
            if (delta >= 0) {
                delta = Math.sqrt(delta);
                x = (delta - qb) / 2 / qa;
                if (0 < x && x < 1) {
                    y = this.interpolate(a, b, c, d, x);
                    min = Math.min(min, y);
                    max = Math.max(max, y);
                }
                if (delta > 0) {
                    x -= delta / qa;
                    if (0 < x && x < 1) {
                        y = this.interpolate(a, b, c, d, x);
                        min = Math.min(min, y);
                        max = Math.max(max, y);
                    }
                }
            }
        }
        dim[0] = min;
        dim[1] = max;
    },
    interpolate: function(a, b, c, d, t) {
        if (t === 0) {
            return a;
        }
        if (t === 1) {
            return d;
        }
        var rate = (1 - t) / t;
        return t * t * t * (d + rate * (3 * c + rate * (3 * b + rate * a)));
    },
    fromStripes: function(stripes) {
        var me = this,
            i = 0,
            ln = stripes.length,
            j, ln2, stripe;
        me.clear();
        for (; i < ln; i++) {
            stripe = stripes[i];
            me.params.push.apply(me.params, stripe);
            me.commands.push('M');
            for (j = 2, ln2 = stripe.length; j < ln2; j += 6) {
                me.commands.push('C');
            }
        }
        if (!me.cursor) {
            me.cursor = [];
        }
        me.cursor[0] = me.params[me.params.length - 2];
        me.cursor[1] = me.params[me.params.length - 1];
        me.dirt();
    },
    toStripes: function(target) {
        var stripes = target || [],
            curr, x, y, lastX, lastY, startX, startY, i, j, commands = this.commands,
            params = this.params,
            ln = commands.length;
        for (i = 0, j = 0; i < ln; i++) {
            switch (commands[i]) {
                case 'M':
                    curr = [startX = lastX = params[j++], startY = lastY = params[j++]];
                    stripes.push(curr);
                    break;
                case 'L':
                    x = params[j++];
                    y = params[j++];
                    curr.push((lastX + lastX + x) / 3, (lastY + lastY + y) / 3, (lastX + x + x) / 3, (lastY + y + y) / 3, lastX = x, lastY = y);
                    break;
                case 'C':
                    curr.push(params[j++], params[j++], params[j++], params[j++], lastX = params[j++], lastY = params[j++]);
                    break;
                case 'Z':
                    x = startX;
                    y = startY;
                    curr.push((lastX + lastX + x) / 3, (lastY + lastY + y) / 3, (lastX + x + x) / 3, (lastY + y + y) / 3, lastX = x, lastY = y);
                    break;
            }
        }
        return stripes;
    },
    updateSvgString: function() {
        var result = [],
            commands = this.commands,
            params = this.params,
            ln = commands.length,
            i = 0,
            j = 0;
        for (; i < ln; i++) {
            switch (commands[i]) {
                case 'M':
                    result.push('M' + params[j] + ',' + params[j + 1]);
                    j += 2;
                    break;
                case 'L':
                    result.push('L' + params[j] + ',' + params[j + 1]);
                    j += 2;
                    break;
                case 'C':
                    result.push('C' + params[j] + ',' + params[j + 1] + ' ' + params[j + 2] + ',' + params[j + 3] + ' ' + params[j + 4] + ',' + params[j + 5]);
                    j += 6;
                    break;
                case 'Z':
                    result.push('Z');
                    break;
            }
        }
        this.svgString = result.join('');
    },
    toString: function() {
        if (!this.svgString) {
            this.updateSvgString();
        }
        return this.svgString;
    }
});
Ext.define('Ext.draw.overrides.hittest.Path', {
    override: 'Ext.draw.Path',
    rayOrigin: { x: -10000, y: -10000 },
    isPointInPath: function(x, y) {
        var me = this,
            commands = me.commands,
            solver = Ext.draw.PathUtil,
            origin = me.rayOrigin,
            params = me.params,
            ln = commands.length,
            firstX = null,
            firstY = null,
            lastX = 0,
            lastY = 0,
            count = 0,
            i, j;
        for (i = 0, j = 0; i < ln; i++) {
            switch (commands[i]) {
                case 'M':
                    if (firstX !== null) {
                        if (solver.linesIntersection(firstX, firstY, lastX, lastY, origin.x, origin.y, x, y)) {
                            count += 1;
                        }
                    }
                    firstX = lastX = params[j];
                    firstY = lastY = params[j + 1];
                    j += 2;
                    break;
                case 'L':
                    if (solver.linesIntersection(lastX, lastY, params[j], params[j + 1], origin.x, origin.y, x, y)) {
                        count += 1;
                    }
                    lastX = params[j];
                    lastY = params[j + 1];
                    j += 2;
                    break;
                case 'C':
                    count += solver.cubicLineIntersections(lastX, params[j], params[j + 2], params[j + 4], lastY, params[j + 1], params[j + 3], params[j + 5], origin.x, origin.y, x, y).length;
                    lastX = params[j + 4];
                    lastY = params[j + 5];
                    j += 6;
                    break;
                case 'Z':
                    if (firstX !== null) {
                        if (solver.linesIntersection(firstX, firstY, lastX, lastY, origin.x, origin.y, x, y)) {
                            count += 1;
                        }
                    }
                    break;
            }
        }
        return count % 2 === 1;
    },
    isPointOnPath: function(x, y) {
        var me = this,
            commands = me.commands,
            solver = Ext.draw.PathUtil,
            params = me.params,
            ln = commands.length,
            firstX = null,
            firstY = null,
            lastX = 0,
            lastY = 0,
            i, j;
        for (i = 0, j = 0; i < ln; i++) {
            switch (commands[i]) {
                case 'M':
                    if (firstX !== null) {
                        if (solver.pointOnLine(firstX, firstY, lastX, lastY, x, y)) {
                            return true;
                        }
                    }
                    firstX = lastX = params[j];
                    firstY = lastY = params[j + 1];
                    j += 2;
                    break;
                case 'L':
                    if (solver.pointOnLine(lastX, lastY, params[j], params[j + 1], x, y)) {
                        return true;
                    }
                    lastX = params[j];
                    lastY = params[j + 1];
                    j += 2;
                    break;
                case 'C':
                    if (solver.pointOnCubic(lastX, params[j], params[j + 2], params[j + 4], lastY, params[j + 1], params[j + 3], params[j + 5], x, y)) {
                        return true;
                    }
                    lastX = params[j + 4];
                    lastY = params[j + 5];
                    j += 6;
                    break;
                case 'Z':
                    if (firstX !== null) {
                        if (solver.pointOnLine(firstX, firstY, lastX, lastY, x, y)) {
                            return true;
                        }
                    }
                    break;
            }
        }
        return false;
    },
    getSegmentIntersections: function(x1, y1, x2, y2, x3, y3, x4, y4) {
        var me = this,
            count = arguments.length,
            solver = Ext.draw.PathUtil,
            commands = me.commands,
            params = me.params,
            ln = commands.length,
            firstX = null,
            firstY = null,
            lastX = 0,
            lastY = 0,
            intersections = [],
            i, j, points;
        for (i = 0, j = 0; i < ln; i++) {
            switch (commands[i]) {
                case 'M':
                    if (firstX !== null) {
                        switch (count) {
                            case 4:
                                points = solver.linesIntersection(firstX, firstY, lastX, lastY, x1, y1, x2, y2);
                                if (points) {
                                    intersections.push(points);
                                }
                                break;
                            case 8:
                                points = solver.cubicLineIntersections(x1, x2, x3, x4, y1, y2, y3, y4, firstX, firstY, lastX, lastY);
                                intersections.push.apply(intersections, points);
                                break;
                        }
                    }
                    firstX = lastX = params[j];
                    firstY = lastY = params[j + 1];
                    j += 2;
                    break;
                case 'L':
                    switch (count) {
                        case 4:
                            points = solver.linesIntersection(lastX, lastY, params[j], params[j + 1], x1, y1, x2, y2);
                            if (points) {
                                intersections.push(points);
                            }
                            break;
                        case 8:
                            points = solver.cubicLineIntersections(x1, x2, x3, x4, y1, y2, y3, y4, lastX, lastY, params[j], params[j + 1]);
                            intersections.push.apply(intersections, points);
                            break;
                    }
                    lastX = params[j];
                    lastY = params[j + 1];
                    j += 2;
                    break;
                case 'C':
                    switch (count) {
                        case 4:
                            points = solver.cubicLineIntersections(lastX, params[j], params[j + 2], params[j + 4], lastY, params[j + 1], params[j + 3], params[j + 5], x1, y1, x2, y2);
                            intersections.push.apply(intersections, points);
                            break;
                        case 8:
                            points = solver.cubicsIntersections(lastX, params[j], params[j + 2], params[j + 4], lastY, params[j + 1], params[j + 3], params[j + 5], x1, x2, x3, x4, y1, y2, y3, y4);
                            intersections.push.apply(intersections, points);
                            break;
                    }
                    lastX = params[j + 4];
                    lastY = params[j + 5];
                    j += 6;
                    break;
                case 'Z':
                    if (firstX !== null) {
                        switch (count) {
                            case 4:
                                points = solver.linesIntersection(firstX, firstY, lastX, lastY, x1, y1, x2, y2);
                                if (points) {
                                    intersections.push(points);
                                }
                                break;
                            case 8:
                                points = solver.cubicLineIntersections(x1, x2, x3, x4, y1, y2, y3, y4, firstX, firstY, lastX, lastY);
                                intersections.push.apply(intersections, points);
                                break;
                        }
                    }
                    break;
            }
        }
        return intersections;
    },
    getIntersections: function(path) {
        var me = this,
            commands = me.commands,
            params = me.params,
            ln = commands.length,
            firstX = null,
            firstY = null,
            lastX = 0,
            lastY = 0,
            intersections = [],
            i, j, points;
        for (i = 0, j = 0; i < ln; i++) {
            switch (commands[i]) {
                case 'M':
                    if (firstX !== null) {
                        points = path.getSegmentIntersections.call(path, firstX, firstY, lastX, lastY);
                        intersections.push.apply(intersections, points);
                    }
                    firstX = lastX = params[j];
                    firstY = lastY = params[j + 1];
                    j += 2;
                    break;
                case 'L':
                    points = path.getSegmentIntersections.call(path, lastX, lastY, params[j], params[j + 1]);
                    intersections.push.apply(intersections, points);
                    lastX = params[j];
                    lastY = params[j + 1];
                    j += 2;
                    break;
                case 'C':
                    points = path.getSegmentIntersections.call(path, lastX, lastY, params[j], params[j + 1], params[j + 2], params[j + 3], params[j + 4], params[j + 5]);
                    intersections.push.apply(intersections, points);
                    lastX = params[j + 4];
                    lastY = params[j + 5];
                    j += 6;
                    break;
                case 'Z':
                    if (firstX !== null) {
                        points = path.getSegmentIntersections.call(path, firstX, firstY, lastX, lastY);
                        intersections.push.apply(intersections, points);
                    }
                    break;
            }
        }
        return intersections;
    }
});
Ext.define('Ext.draw.sprite.Path', {
    extend: Ext.draw.sprite.Sprite,
    alias: ['sprite.path', 'Ext.draw.Sprite'],
    type: 'path',
    isPath: true,
    inheritableStatics: {
        def: {
            processors: {
                path: function(n, o) {
                    if (!(n instanceof Ext.draw.Path)) {
                        n = new Ext.draw.Path(n);
                    }
                    return n;
                }
            },
            aliases: { d: 'path' },
            triggers: { path: 'bbox' },
            updaters: {
                path: function(attr) {
                    var path = attr.path;
                    if (!path || path.bindAttr !== attr) {
                        path = new Ext.draw.Path;
                        path.bindAttr = attr;
                        attr.path = path;
                    }
                    path.clear();
                    this.updatePath(path, attr);
                    this.scheduleUpdater(attr, 'bbox', ['path']);
                }
            }
        }
    },
    updatePlainBBox: function(plain) {
        if (this.attr.path) {
            this.attr.path.getDimension(plain);
        }
    },
    updateTransformedBBox: function(transform) {
        if (this.attr.path) {
            this.attr.path.getDimensionWithTransform(this.attr.matrix, transform);
        }
    },
    render: function(surface, ctx) {
        var mat = this.attr.matrix,
            attr = this.attr;
        if (!attr.path || attr.path.params.length === 0) {
            return;
        }
        mat.toContext(ctx);
        ctx.appendPath(attr.path);
        ctx.fillStroke(attr);
        var debug = attr.debug || this.statics().debug || Ext.draw.sprite.Sprite.debug;
        if (debug) {
            debug.bbox && this.renderBBox(surface, ctx);
            debug.xray && this.renderXRay(surface, ctx);
        }
    },
    renderXRay: function(surface, ctx) {
        var attr = this.attr,
            mat = attr.matrix,
            imat = attr.inverseMatrix,
            path = attr.path,
            commands = path.commands,
            params = path.params,
            ln = commands.length,
            twoPi = Math.PI * 2,
            size = 2,
            i, j;
        mat.toContext(ctx);
        ctx.beginPath();
        for (i = 0, j = 0; i < ln; i++) {
            switch (commands[i]) {
                case 'M':
                    ctx.moveTo(params[j] - size, params[j + 1] - size);
                    ctx.rect(params[j] - size, params[j + 1] - size, size * 2, size * 2);
                    j += 2;
                    break;
                case 'L':
                    ctx.moveTo(params[j] - size, params[j + 1] - size);
                    ctx.rect(params[j] - size, params[j + 1] - size, size * 2, size * 2);
                    j += 2;
                    break;
                case 'C':
                    ctx.moveTo(params[j] + size, params[j + 1]);
                    ctx.arc(params[j], params[j + 1], size, 0, twoPi, true);
                    j += 2;
                    ctx.moveTo(params[j] + size, params[j + 1]);
                    ctx.arc(params[j], params[j + 1], size, 0, twoPi, true);
                    j += 2;
                    ctx.moveTo(params[j] + size * 2, params[j + 1]);
                    ctx.rect(params[j] - size, params[j + 1] - size, size * 2, size * 2);
                    j += 2;
                    break;
                default:
            }
        }
        imat.toContext(ctx);
        ctx.strokeStyle = 'black';
        ctx.strokeOpacity = 1;
        ctx.lineWidth = 1;
        ctx.stroke();
        mat.toContext(ctx);
        ctx.beginPath();
        for (i = 0, j = 0; i < ln; i++) {
            switch (commands[i]) {
                case 'M':
                    ctx.moveTo(params[j], params[j + 1]);
                    j += 2;
                    break;
                case 'L':
                    ctx.moveTo(params[j], params[j + 1]);
                    j += 2;
                    break;
                case 'C':
                    ctx.lineTo(params[j], params[j + 1]);
                    j += 2;
                    ctx.moveTo(params[j], params[j + 1]);
                    j += 2;
                    ctx.lineTo(params[j], params[j + 1]);
                    j += 2;
                    break;
                default:
            }
        }
        imat.toContext(ctx);
        ctx.lineWidth = 0.5;
        ctx.stroke();
    },
    updatePath: function(path, attr) {}
});
Ext.define('Ext.draw.overrides.hittest.sprite.Path', {
    override: 'Ext.draw.sprite.Path',
    isPointInPath: function(x, y) {
        var attr = this.attr;
        if (attr.fillStyle === Ext.util.Color.RGBA_NONE) {
            return this.isPointOnPath(x, y);
        }
        var path = attr.path,
            matrix = attr.matrix,
            params, result;
        if (!matrix.isIdentity()) {
            params = path.params.slice(0);
            path.transform(attr.matrix);
        }
        result = path.isPointInPath(x, y);
        if (params) {
            path.params = params;
        }
        return result;
    },
    isPointOnPath: function(x, y) {
        var attr = this.attr,
            path = attr.path,
            matrix = attr.matrix,
            params, result;
        if (!matrix.isIdentity()) {
            params = path.params.slice(0);
            path.transform(attr.matrix);
        }
        result = path.isPointOnPath(x, y);
        if (params) {
            path.params = params;
        }
        return result;
    },
    hitTest: function(point, options) {
        var me = this,
            attr = me.attr,
            path = attr.path,
            matrix = attr.matrix,
            x = point[0],
            y = point[1],
            parentResult = me.callParent([point, options]),
            result = null,
            params, isFilled;
        if (!parentResult) {
            return result;
        }
        options = options || Ext.draw.sprite.Sprite.defaultHitTestOptions;
        if (!matrix.isIdentity()) {
            params = path.params.slice(0);
            path.transform(attr.matrix);
        }
        if (options.fill && options.stroke) {
            isFilled = attr.fillStyle !== Ext.util.Color.NONE && attr.fillStyle !== Ext.util.Color.RGBA_NONE;
            if (isFilled) {
                if (path.isPointInPath(x, y)) {
                    result = { sprite: me };
                }
            } else {
                if (path.isPointInPath(x, y) || path.isPointOnPath(x, y)) {
                    result = { sprite: me };
                }
            }
        } else {
            if (options.stroke && !options.fill) {
                if (path.isPointOnPath(x, y)) {
                    result = { sprite: me };
                }
            } else {
                if (options.fill && !options.stroke) {
                    if (path.isPointInPath(x, y)) {
                        result = { sprite: me };
                    }
                }
            }
        }
        if (params) {
            path.params = params;
        }
        return result;
    },
    getIntersections: function(path) {
        if (!(path.isSprite && path.isPath)) {
            return [];
        }
        var aAttr = this.attr,
            bAttr = path.attr,
            aPath = aAttr.path,
            bPath = bAttr.path,
            aMatrix = aAttr.matrix,
            bMatrix = bAttr.matrix,
            aParams, bParams, intersections;
        if (!aMatrix.isIdentity()) {
            aParams = aPath.params.slice(0);
            aPath.transform(aAttr.matrix);
        }
        if (!bMatrix.isIdentity()) {
            bParams = bPath.params.slice(0);
            bPath.transform(bAttr.matrix);
        }
        intersections = aPath.getIntersections(bPath);
        if (aParams) {
            aPath.params = aParams;
        }
        if (bParams) {
            bPath.params = bParams;
        }
        return intersections;
    }
});
Ext.define('Ext.draw.sprite.Circle', {
    extend: Ext.draw.sprite.Path,
    alias: 'sprite.circle',
    type: 'circle',
    inheritableStatics: { def: { processors: { cx: 'number', cy: 'number', r: 'number' }, aliases: { radius: 'r', x: 'cx', y: 'cy', centerX: 'cx', centerY: 'cy' }, defaults: { cx: 0, cy: 0, r: 4 }, triggers: { cx: 'path', cy: 'path', r: 'path' } } },
    updatePlainBBox: function(plain) {
        var attr = this.attr,
            cx = attr.cx,
            cy = attr.cy,
            r = attr.r;
        plain.x = cx - r;
        plain.y = cy - r;
        plain.width = r + r;
        plain.height = r + r;
    },
    updateTransformedBBox: function(transform) {
        var attr = this.attr,
            cx = attr.cx,
            cy = attr.cy,
            r = attr.r,
            matrix = attr.matrix,
            scaleX = matrix.getScaleX(),
            scaleY = matrix.getScaleY(),
            rx, ry;
        rx = scaleX * r;
        ry = scaleY * r;
        transform.x = matrix.x(cx, cy) - rx;
        transform.y = matrix.y(cx, cy) - ry;
        transform.width = rx + rx;
        transform.height = ry + ry;
    },
    updatePath: function(path, attr) {
        path.arc(attr.cx, attr.cy, attr.r, 0, Math.PI * 2, false);
    }
});
Ext.define('Ext.draw.sprite.Arc', {
    extend: Ext.draw.sprite.Circle,
    alias: 'sprite.arc',
    type: 'arc',
    inheritableStatics: { def: { processors: { startAngle: 'number', endAngle: 'number', anticlockwise: 'bool' }, aliases: { from: 'startAngle', to: 'endAngle', start: 'startAngle', end: 'endAngle' }, defaults: { startAngle: 0, endAngle: Math.PI * 2, anticlockwise: false }, triggers: { startAngle: 'path', endAngle: 'path', anticlockwise: 'path' } } },
    updatePath: function(path, attr) {
        path.arc(attr.cx, attr.cy, attr.r, attr.startAngle, attr.endAngle, attr.anticlockwise);
    }
});
Ext.define('Ext.draw.sprite.Arrow', {
    extend: Ext.draw.sprite.Path,
    alias: 'sprite.arrow',
    inheritableStatics: { def: { processors: { x: 'number', y: 'number', size: 'number' }, defaults: { x: 0, y: 0, size: 4 }, triggers: { x: 'path', y: 'path', size: 'path' } } },
    updatePath: function(path, attr) {
        var s = attr.size * 1.5,
            x = attr.x - attr.lineWidth / 2,
            y = attr.y;
        path.fromSvgString('M'.concat(x - s * 0.7, ',', y - s * 0.4, 'l', [s * 0.6, 0, 0, -s * 0.4, s, s * 0.8, -s, s * 0.8, 0, -s * 0.4, -s * 0.6, 0], 'z'));
    }
});
Ext.define('Ext.draw.sprite.Composite', {
    extend: Ext.draw.sprite.Sprite,
    alias: 'sprite.composite',
    type: 'composite',
    isComposite: true,
    config: { sprites: [] },
    constructor: function(config) {
        this.sprites = [];
        this.map = {};
        this.callParent([config]);
    },
    add: function(sprite) {
        if (!sprite) {
            return null;
        }
        if (!sprite.isSprite) {
            sprite = Ext.create('sprite.' + sprite.type, sprite);
        }
        sprite.setParent(this);
        sprite.setSurface(this.getSurface());
        var me = this,
            attr = me.attr,
            oldTransformations = sprite.applyTransformations;
        sprite.applyTransformations = function(force) {
            if (sprite.attr.dirtyTransform) {
                attr.dirtyTransform = true;
                attr.bbox.plain.dirty = true;
                attr.bbox.transform.dirty = true;
            }
            oldTransformations.call(sprite, force);
        };
        me.sprites.push(sprite);
        me.map[sprite.id] = sprite.getId();
        attr.bbox.plain.dirty = true;
        attr.bbox.transform.dirty = true;
        return sprite;
    },
    removeSprite: function(sprite, isDestroy) {
        var me = this,
            id, isOwnSprite;
        if (sprite) {
            if (sprite.charAt) {
                sprite = me.map[sprite];
            }
            if (!sprite || !sprite.isSprite) {
                return null;
            }
            if (sprite.isDestroyed || sprite.isDestroying) {
                return sprite;
            }
            id = sprite.getId();
            isOwnSprite = me.map[id];
            delete me.map[id];
            if (isDestroy) {
                sprite.destroy();
            }
            if (!isOwnSprite) {
                return sprite;
            }
            sprite.setParent(null);
            sprite.setSurface(null);
            Ext.Array.remove(me.sprites, sprite);
            me.dirtyZIndex = true;
            me.setDirty(true);
        }
        return sprite || null;
    },
    updateSurface: function(surface) {
        for (var i = 0, ln = this.sprites.length; i < ln; i++) {
            this.sprites[i].setSurface(surface);
        }
    },
    addAll: function(sprites) {
        if (sprites.isSprite || sprites.type) {
            this.add(sprites);
        } else {
            if (Ext.isArray(sprites)) {
                var i = 0;
                while (i < sprites.length) {
                    this.add(sprites[i++]);
                }
            }
        }
    },
    updatePlainBBox: function(plain) {
        var me = this,
            left = Infinity,
            right = -Infinity,
            top = Infinity,
            bottom = -Infinity,
            sprite, bbox, i, ln;
        for (i = 0, ln = me.sprites.length; i < ln; i++) {
            sprite = me.sprites[i];
            sprite.applyTransformations();
            bbox = sprite.getBBox();
            if (left > bbox.x) {
                left = bbox.x;
            }
            if (right < bbox.x + bbox.width) {
                right = bbox.x + bbox.width;
            }
            if (top > bbox.y) {
                top = bbox.y;
            }
            if (bottom < bbox.y + bbox.height) {
                bottom = bbox.y + bbox.height;
            }
        }
        plain.x = left;
        plain.y = top;
        plain.width = right - left;
        plain.height = bottom - top;
    },
    isVisible: function() {
        var attr = this.attr,
            parent = this.getParent(),
            hasParent = parent && (parent.isSurface || parent.isVisible()),
            isSeen = hasParent && !attr.hidden && attr.globalAlpha;
        return !!isSeen;
    },
    render: function(surface, ctx, rect) {
        var me = this,
            attr = me.attr,
            mat = me.attr.matrix,
            sprites = me.sprites,
            ln = sprites.length,
            i = 0;
        mat.toContext(ctx);
        for (; i < ln; i++) {
            surface.renderSprite(sprites[i], rect);
        }
        var debug = attr.debug || me.statics().debug || Ext.draw.sprite.Sprite.debug;
        if (debug) {
            attr.inverseMatrix.toContext(ctx);
            debug.bbox && me.renderBBox(surface, ctx);
        }
    },
    destroy: function() {
        var me = this,
            sprites = me.sprites,
            ln = sprites.length,
            i;
        for (i = 0; i < ln; i++) {
            sprites[i].destroy();
        }
        sprites.length = 0;
        me.callParent();
    }
});
Ext.define('Ext.draw.sprite.Cross', {
    extend: Ext.draw.sprite.Path,
    alias: 'sprite.cross',
    inheritableStatics: { def: { processors: { x: 'number', y: 'number', size: 'number' }, defaults: { x: 0, y: 0, size: 4 }, triggers: { x: 'path', y: 'path', size: 'path' } } },
    updatePath: function(path, attr) {
        var s = attr.size / 1.7,
            x = attr.x - attr.lineWidth / 2,
            y = attr.y;
        path.fromSvgString('M'.concat(x - s, ',', y, 'l', [-s, -s, s, -s, s, s, s, -s, s, s, -s, s, s, s, -s, s, -s, -s, -s, s, -s, -s, 'z']));
    }
});
Ext.define('Ext.draw.sprite.Diamond', {
    extend: Ext.draw.sprite.Path,
    alias: 'sprite.diamond',
    inheritableStatics: { def: { processors: { x: 'number', y: 'number', size: 'number' }, defaults: { x: 0, y: 0, size: 4 }, triggers: { x: 'path', y: 'path', size: 'path' } } },
    updatePath: function(path, attr) {
        var s = attr.size * 1.25,
            x = attr.x - attr.lineWidth / 2,
            y = attr.y;
        path.fromSvgString(['M', x, y - s, 'l', s, s, -s, s, -s, -s, s, -s, 'z']);
    }
});
Ext.define('Ext.draw.sprite.Ellipse', {
    extend: Ext.draw.sprite.Path,
    alias: 'sprite.ellipse',
    type: 'ellipse',
    inheritableStatics: { def: { processors: { cx: 'number', cy: 'number', rx: 'number', ry: 'number', axisRotation: 'number' }, aliases: { radius: 'r', x: 'cx', y: 'cy', centerX: 'cx', centerY: 'cy', radiusX: 'rx', radiusY: 'ry' }, defaults: { cx: 0, cy: 0, rx: 1, ry: 1, axisRotation: 0 }, triggers: { cx: 'path', cy: 'path', rx: 'path', ry: 'path', axisRotation: 'path' } } },
    updatePlainBBox: function(plain) {
        var attr = this.attr,
            cx = attr.cx,
            cy = attr.cy,
            rx = attr.rx,
            ry = attr.ry;
        plain.x = cx - rx;
        plain.y = cy - ry;
        plain.width = rx + rx;
        plain.height = ry + ry;
    },
    updateTransformedBBox: function(transform) {
        var attr = this.attr,
            cx = attr.cx,
            cy = attr.cy,
            rx = attr.rx,
            ry = attr.ry,
            rxy = ry / rx,
            matrix = attr.matrix.clone(),
            xx, xy, yx, yy, dx, dy, w, h;
        matrix.append(1, 0, 0, rxy, 0, cy * (1 - rxy));
        xx = matrix.getXX();
        yx = matrix.getYX();
        dx = matrix.getDX();
        xy = matrix.getXY();
        yy = matrix.getYY();
        dy = matrix.getDY();
        w = Math.sqrt(xx * xx + yx * yx) * rx;
        h = Math.sqrt(xy * xy + yy * yy) * rx;
        transform.x = cx * xx + cy * yx + dx - w;
        transform.y = cx * xy + cy * yy + dy - h;
        transform.width = w + w;
        transform.height = h + h;
    },
    updatePath: function(path, attr) {
        path.ellipse(attr.cx, attr.cy, attr.rx, attr.ry, attr.axisRotation, 0, Math.PI * 2, false);
    }
});
Ext.define('Ext.draw.sprite.EllipticalArc', {
    extend: Ext.draw.sprite.Ellipse,
    alias: 'sprite.ellipticalArc',
    type: 'ellipticalArc',
    inheritableStatics: { def: { processors: { startAngle: 'number', endAngle: 'number', anticlockwise: 'bool' }, aliases: { from: 'startAngle', to: 'endAngle', start: 'startAngle', end: 'endAngle' }, defaults: { startAngle: 0, endAngle: Math.PI * 2, anticlockwise: false }, triggers: { startAngle: 'path', endAngle: 'path', anticlockwise: 'path' } } },
    updatePath: function(path, attr) {
        path.ellipse(attr.cx, attr.cy, attr.rx, attr.ry, attr.axisRotation, attr.startAngle, attr.endAngle, attr.anticlockwise);
    }
});
Ext.define('Ext.draw.sprite.Rect', {
    extend: Ext.draw.sprite.Path,
    alias: 'sprite.rect',
    type: 'rect',
    inheritableStatics: { def: { processors: { x: 'number', y: 'number', width: 'number', height: 'number', radius: 'number' }, aliases: {}, triggers: { x: 'path', y: 'path', width: 'path', height: 'path', radius: 'path' }, defaults: { x: 0, y: 0, width: 8, height: 8, radius: 0 } } },
    updatePlainBBox: function(plain) {
        var attr = this.attr;
        plain.x = attr.x;
        plain.y = attr.y;
        plain.width = attr.width;
        plain.height = attr.height;
    },
    updateTransformedBBox: function(transform, plain) {
        this.attr.matrix.transformBBox(plain, this.attr.radius, transform);
    },
    updatePath: function(path, attr) {
        var x = attr.x,
            y = attr.y,
            width = attr.width,
            height = attr.height,
            radius = Math.min(attr.radius, Math.abs(height) * 0.5, Math.abs(width) * 0.5);
        if (radius === 0) {
            path.rect(x, y, width, height);
        } else {
            path.moveTo(x + radius, y);
            path.arcTo(x + width, y, x + width, y + height, radius);
            path.arcTo(x + width, y + height, x, y + height, radius);
            path.arcTo(x, y + height, x, y, radius);
            path.arcTo(x, y, x + radius, y, radius);
        }
    }
});
Ext.define('Ext.draw.sprite.Image', {
    extend: Ext.draw.sprite.Rect,
    alias: 'sprite.image',
    type: 'image',
    statics: { imageLoaders: {} },
    inheritableStatics: { def: { processors: { src: 'string' }, triggers: { src: 'src' }, updaters: { src: 'updateSource' }, defaults: { src: '', width: null, height: null } } },
    updateSurface: function(surface) {
        if (surface) {
            this.updateSource(this.attr);
        }
    },
    updateSource: function(attr) {
        var me = this,
            src = attr.src,
            surface = me.getSurface(),
            loadingStub = Ext.draw.sprite.Image.imageLoaders[src],
            width = attr.width,
            height = attr.height,
            imageLoader, i;
        if (!surface) {
            return;
        }
        if (!loadingStub) {
            imageLoader = new Image;
            loadingStub = Ext.draw.sprite.Image.imageLoaders[src] = { image: imageLoader, done: false, pendingSprites: [me], pendingSurfaces: [surface] };
            imageLoader.width = width;
            imageLoader.height = height;
            imageLoader.onload = function() {
                var item;
                if (!loadingStub.done) {
                    loadingStub.done = true;
                    for (i = 0; i < loadingStub.pendingSprites.length; i++) {
                        item = loadingStub.pendingSprites[i];
                        if (!item.destroyed) {
                            item.setDirty(true);
                        }
                    }
                    for (i = 0; i < loadingStub.pendingSurfaces.length; i++) {
                        item = loadingStub.pendingSurfaces[i];
                        if (!item.destroyed) {
                            item.renderFrame();
                        }
                    }
                }
            };
            imageLoader.src = src;
        } else {
            Ext.Array.include(loadingStub.pendingSprites, me);
            Ext.Array.include(loadingStub.pendingSurfaces, surface);
        }
    },
    render: function(surface, ctx) {
        var me = this,
            attr = me.attr,
            mat = attr.matrix,
            src = attr.src,
            x = attr.x,
            y = attr.y,
            width = attr.width,
            height = attr.height,
            loadingStub = Ext.draw.sprite.Image.imageLoaders[src],
            image;
        if (loadingStub && loadingStub.done) {
            mat.toContext(ctx);
            image = loadingStub.image;
            ctx.drawImage(image, x, y, width || (image.naturalWidth || image.width) / surface.devicePixelRatio, height || (image.naturalHeight || image.height) / surface.devicePixelRatio);
        }
        var debug = attr.debug || this.statics().debug || Ext.draw.sprite.Sprite.debug;
        if (debug) {
            debug.bbox && this.renderBBox(surface, ctx);
        }
    },
    isVisible: function() {
        var attr = this.attr,
            parent = this.getParent(),
            hasParent = parent && (parent.isSurface || parent.isVisible()),
            isSeen = hasParent && !attr.hidden && attr.globalAlpha;
        return !!isSeen;
    }
});
Ext.define('Ext.draw.sprite.Instancing', {
    extend: Ext.draw.sprite.Sprite,
    alias: 'sprite.instancing',
    type: 'instancing',
    isInstancing: true,
    config: { template: null, instances: null },
    instances: null,
    applyTemplate: function(template) {
        if (!Ext.isObject(template)) {
            Ext.raise('A template of an instancing sprite must either be ' + 'a sprite instance or a valid config object from which a template ' + 'sprite will be created.');
        } else {
            if (template.isInstancing || template.isComposite) {
                Ext.raise("Can't use an instancing or composite sprite " + 'as a template for an instancing sprite.');
            }
        }
        if (!template.isSprite) {
            if (!template.xclass && !template.type) {
                template.type = 'circle';
            }
            template = Ext.create(template.xclass || 'sprite.' + template.type, template);
        }
        var surface = template.getSurface();
        if (surface) {
            surface.remove(template);
        }
        template.setParent(this);
        return template;
    },
    updateTemplate: function(template, oldTemplate) {
        if (oldTemplate) {
            delete oldTemplate.ownAttr;
        }
        template.setSurface(this.getSurface());
        template.ownAttr = template.attr;
        this.clearAll();
    },
    updateInstances: function(instances) {
        this.clearAll();
        if (Ext.isArray(instances)) {
            for (var i = 0, ln = instances.length; i < ln; i++) {
                this.add(instances[i]);
            }
        }
    },
    updateSurface: function(surface) {
        var template = this.getTemplate();
        if (template && !template.destroyed) {
            template.setSurface(surface);
        }
    },
    get: function(index) {
        return this.instances[index];
    },
    getCount: function() {
        return this.instances.length;
    },
    clearAll: function() {
        var template = this.getTemplate();
        template.attr.children = this.instances = [];
        this.position = 0;
    },
    createInstance: function(config, bypassNormalization, avoidCopy) {
        return this.add(config, bypassNormalization, avoidCopy);
    },
    add: function(config, bypassNormalization, avoidCopy) {
        var template = this.getTemplate(),
            originalAttr = template.attr,
            attr = Ext.Object.chain(originalAttr);
        template.topModifier.prepareAttributes(attr);
        template.attr = attr;
        template.setAttributes(config, bypassNormalization, avoidCopy);
        attr.template = template;
        this.instances.push(attr);
        template.attr = originalAttr;
        this.position++;
        return attr;
    },
    getBBox: function() {
        return null;
    },
    getBBoxFor: function(index, isWithoutTransform) {
        var template = this.getTemplate(),
            originalAttr = template.attr,
            bbox;
        template.attr = this.instances[index];
        bbox = template.getBBox(isWithoutTransform);
        template.attr = originalAttr;
        return bbox;
    },
    isVisible: function() {
        var attr = this.attr,
            parent = this.getParent(),
            result;
        result = parent && parent.isSurface && !attr.hidden && attr.globalAlpha;
        return !!result;
    },
    isInstanceVisible: function(index) {
        var me = this,
            template = me.getTemplate(),
            originalAttr = template.attr,
            instances = me.instances,
            result = false;
        if (!Ext.isNumber(index) || index < 0 || index >= instances.length || !me.isVisible()) {
            return result;
        }
        template.attr = instances[index];
        result = template.isVisible(point, options);
        template.attr = originalAttr;
        return result;
    },
    render: function(surface, ctx, rect) {
        if (!this.getTemplate()) {
            Ext.raise('An instancing sprite must have a template.');
        }
        var me = this,
            template = me.getTemplate(),
            surfaceRect = surface.getRect(),
            mat = me.attr.matrix,
            originalAttr = template.attr,
            instances = me.instances,
            ln = me.position,
            i;
        mat.toContext(ctx);
        template.preRender(surface, ctx, rect);
        template.useAttributes(ctx, surfaceRect);
        for (i = 0; i < ln; i++) {
            if (instances[i].hidden) {
                continue;
            }
            ctx.save();
            template.attr = instances[i];
            template.useAttributes(ctx, surfaceRect);
            template.render(surface, ctx, rect);
            ctx.restore();
        }
        template.attr = originalAttr;
    },
    setAttributesFor: function(index, changes, bypassNormalization) {
        var template = this.getTemplate(),
            originalAttr = template.attr,
            attr = this.instances[index];
        if (!attr) {
            return;
        }
        template.attr = attr;
        if (bypassNormalization) {
            changes = Ext.apply({}, changes);
        } else {
            changes = template.self.def.normalize(changes);
        }
        template.topModifier.pushDown(attr, changes);
        template.attr = originalAttr;
    },
    destroy: function() {
        var me = this,
            template = me.getTemplate();
        me.instances = null;
        if (template) {
            template.destroy();
        }
        me.callParent();
    }
});
Ext.define('Ext.draw.overrides.hittest.sprite.Instancing', {
    override: 'Ext.draw.sprite.Instancing',
    hitTest: function(point, options) {
        var me = this,
            template = me.getTemplate(),
            originalAttr = template.attr,
            instances = me.instances,
            ln = instances.length,
            i = 0,
            result = null;
        if (!me.isVisible()) {
            return result;
        }
        for (; i < ln; i++) {
            template.attr = instances[i];
            result = template.hitTest(point, options);
            if (result) {
                result.isInstance = true;
                result.template = result.sprite;
                result.sprite = this;
                result.instance = instances[i];
                result.index = i;
                return result;
            }
        }
        template.attr = originalAttr;
        return result;
    }
});
Ext.define('Ext.draw.sprite.Line', {
    extend: Ext.draw.sprite.Sprite,
    alias: 'sprite.line',
    type: 'line',
    inheritableStatics: { def: { processors: { fromX: 'number', fromY: 'number', toX: 'number', toY: 'number' }, defaults: { fromX: 0, fromY: 0, toX: 1, toY: 1, strokeStyle: 'black' }, aliases: { x1: 'fromX', y1: 'fromY', x2: 'toX', y2: 'toY' } } },
    updateLineBBox: function(bbox, isTransform, x1, y1, x2, y2) {
        var attr = this.attr,
            matrix = attr.matrix,
            halfLineWidth = attr.lineWidth / 2,
            fromX, fromY, toX, toY, dx, dy, p;
        if (isTransform) {
            p = matrix.transformPoint([x1, y1]);
            x1 = p[0];
            y1 = p[1];
            p = matrix.transformPoint([x2, y2]);
            x2 = p[0];
            y2 = p[1];
        }
        fromX = Math.min(x1, x2);
        toX = Math.max(x1, x2);
        fromY = Math.min(y1, y2);
        toY = Math.max(y1, y2);
        var angle = Math.atan2(toX - fromX, toY - fromY),
            sin = Math.sin(angle),
            cos = Math.cos(angle),
            dx = halfLineWidth * cos,
            dy = halfLineWidth * sin;
        fromX -= dx;
        fromY -= dy;
        toX += dx;
        toY += dy;
        bbox.x = fromX;
        bbox.y = fromY;
        bbox.width = toX - fromX;
        bbox.height = toY - fromY;
    },
    updatePlainBBox: function(plain) {
        var attr = this.attr;
        this.updateLineBBox(plain, false, attr.fromX, attr.fromY, attr.toX, attr.toY);
    },
    updateTransformedBBox: function(transform, plain) {
        var attr = this.attr;
        this.updateLineBBox(transform, true, attr.fromX, attr.fromY, attr.toX, attr.toY);
    },
    render: function(surface, ctx) {
        var attr = this.attr,
            matrix = this.attr.matrix;
        matrix.toContext(ctx);
        ctx.beginPath();
        ctx.moveTo(attr.fromX, attr.fromY);
        ctx.lineTo(attr.toX, attr.toY);
        ctx.stroke();
        var debug = attr.debug || this.statics().debug || Ext.draw.sprite.Sprite.debug;
        if (debug) {
            this.attr.inverseMatrix.toContext(ctx);
            debug.bbox && this.renderBBox(surface, ctx);
        }
    }
});
Ext.define('Ext.draw.sprite.Plus', {
    extend: Ext.draw.sprite.Path,
    alias: 'sprite.plus',
    inheritableStatics: { def: { processors: { x: 'number', y: 'number', size: 'number' }, defaults: { x: 0, y: 0, size: 4 }, triggers: { x: 'path', y: 'path', size: 'path' } } },
    updatePath: function(path, attr) {
        var s = attr.size / 1.3,
            x = attr.x - attr.lineWidth / 2,
            y = attr.y;
        path.fromSvgString('M'.concat(x - s / 2, ',', y - s / 2, 'l', [0, -s, s, 0, 0, s, s, 0, 0, s, -s, 0, 0, s, -s, 0, 0, -s, -s, 0, 0, -s, 'z']));
    }
});
Ext.define('Ext.draw.sprite.Sector', {
    extend: Ext.draw.sprite.Path,
    alias: 'sprite.sector',
    type: 'sector',
    inheritableStatics: {
        def: {
            processors: { centerX: 'number', centerY: 'number', startAngle: 'number', endAngle: 'number', startRho: 'number', endRho: 'number', margin: 'number' },
            aliases: { rho: 'endRho' },
            triggers: { centerX: 'path,bbox', centerY: 'path,bbox', startAngle: 'path,bbox', endAngle: 'path,bbox', startRho: 'path,bbox', endRho: 'path,bbox', margin: 'path,bbox' },
            defaults: {
                centerX: 0,
                centerY: 0,
                startAngle: 0,
                endAngle: 0,
                startRho: 0,
                endRho: 150,
                margin: 0,
                path: 'M 0,0'
            }
        }
    },
    getMidAngle: function() {
        return this.midAngle || 0;
    },
    updatePath: function(path, attr) {
        var startAngle = Math.min(attr.startAngle, attr.endAngle),
            endAngle = Math.max(attr.startAngle, attr.endAngle),
            midAngle = this.midAngle = (startAngle + endAngle) * 0.5,
            margin = attr.margin,
            centerX = attr.centerX,
            centerY = attr.centerY,
            startRho = Math.min(attr.startRho, attr.endRho),
            endRho = Math.max(attr.startRho, attr.endRho);
        if (margin) {
            centerX += margin * Math.cos(midAngle);
            centerY += margin * Math.sin(midAngle);
        }
        path.moveTo(centerX + startRho * Math.cos(startAngle), centerY + startRho * Math.sin(startAngle));
        path.lineTo(centerX + endRho * Math.cos(startAngle), centerY + endRho * Math.sin(startAngle));
        path.arc(centerX, centerY, endRho, startAngle, endAngle, false);
        path.lineTo(centerX + startRho * Math.cos(endAngle), centerY + startRho * Math.sin(endAngle));
        path.arc(centerX, centerY, startRho, endAngle, startAngle, true);
    }
});
Ext.define('Ext.draw.sprite.Square', {
    extend: Ext.draw.sprite.Path,
    alias: 'sprite.square',
    inheritableStatics: { def: { processors: { x: 'number', y: 'number', size: 'number' }, defaults: { x: 0, y: 0, size: 4 }, triggers: { x: 'path', y: 'path', size: 'size' } } },
    updatePath: function(path, attr) {
        var size = attr.size * 1.2,
            s = size * 2,
            x = attr.x - attr.lineWidth / 2,
            y = attr.y;
        path.fromSvgString('M'.concat(x - size, ',', y - size, 'l', [s, 0, 0, s, -s, 0, 0, -s, 'z']));
    }
});
Ext.define('Ext.draw.TextMeasurer', {
    singleton: true,
    measureDiv: null,
    measureCache: {},
    precise: Ext.isIE8,
    measureDivTpl: { tag: 'div', style: { overflow: 'hidden', position: 'relative', 'float': 'left', width: 0, height: 0 }, 'data-sticky': true, children: { tag: 'div', style: { display: 'block', position: 'absolute', x: -100000, y: -100000, padding: 0, margin: 0, 'z-index': -100000, 'white-space': 'nowrap' } } },
    actualMeasureText: function(text, font) {
        var me = Ext.draw.TextMeasurer,
            measureDiv = me.measureDiv,
            FARAWAY = 100000,
            size;
        if (!measureDiv) {
            var parent = Ext.Element.create({ 'data-sticky': true, style: { 'overflow': 'hidden', 'position': 'relative', 'float': 'left', 'width': 0, 'height': 0 } });
            me.measureDiv = measureDiv = Ext.Element.create({ style: { 'position': 'absolute', 'x': FARAWAY, 'y': FARAWAY, 'z-index': -FARAWAY, 'white-space': 'nowrap', 'display': 'block', 'padding': 0, 'margin': 0 } });
            Ext.getBody().appendChild(parent);
            parent.appendChild(measureDiv);
        }
        if (font) {
            measureDiv.setStyle({ font: font, lineHeight: 'normal' });
        }
        measureDiv.setText('(' + text + ')');
        size = measureDiv.getSize();
        measureDiv.setText('()');
        size.width -= measureDiv.getSize().width;
        return size;
    },
    measureTextSingleLine: function(text, font) {
        if (this.precise) {
            return this.preciseMeasureTextSingleLine(text, font);
        }
        text = text.toString();
        var cache = this.measureCache,
            chars = text.split(''),
            width = 0,
            height = 0,
            cachedItem, charactor, i, ln, size;
        if (!cache[font]) {
            cache[font] = {};
        }
        cache = cache[font];
        if (cache[text]) {
            return cache[text];
        }
        for (i = 0, ln = chars.length; i < ln; i++) {
            charactor = chars[i];
            if (!(cachedItem = cache[charactor])) {
                size = this.actualMeasureText(charactor, font);
                cachedItem = cache[charactor] = size;
            }
            width += cachedItem.width;
            height = Math.max(height, cachedItem.height);
        }
        return cache[text] = { width: width, height: height };
    },
    preciseMeasureTextSingleLine: function(text, font) {
        text = text.toString();
        var measureDiv = this.measureDiv || (this.measureDiv = Ext.getBody().createChild(this.measureDivTpl).down('div'));
        measureDiv.setStyle({ font: font || '' });
        return Ext.util.TextMetrics.measure(measureDiv, text);
    },
    measureText: function(text, font) {
        var lines = text.split('\n'),
            ln = lines.length,
            height = 0,
            width = 0,
            line, i, sizes;
        if (ln === 1) {
            return this.measureTextSingleLine(text, font);
        }
        sizes = [];
        for (i = 0; i < ln; i++) {
            line = this.measureTextSingleLine(lines[i], font);
            sizes.push(line);
            height += line.height;
            width = Math.max(width, line.width);
        }
        return { width: width, height: height, sizes: sizes };
    }
});
Ext.define('Ext.draw.sprite.Text', function() {
    var fontSizes = { 'xx-small': true, 'x-small': true, 'small': true, 'medium': true, 'large': true, 'x-large': true, 'xx-large': true };
    var fontWeights = { normal: true, bold: true, bolder: true, lighter: true, 100: true, 200: true, 300: true, 400: true, 500: true, 600: true, 700: true, 800: true, 900: true };
    var textAlignments = { start: 'start', left: 'start', center: 'center', middle: 'center', end: 'end', right: 'end' };
    var textBaselines = { top: 'top', hanging: 'hanging', middle: 'middle', center: 'middle', alphabetic: 'alphabetic', ideographic: 'ideographic', bottom: 'bottom' };
    return {
        extend: Ext.draw.sprite.Sprite,
        alias: 'sprite.text',
        type: 'text',
        lineBreakRe: /\r?\n/g,
        statics: { debug: false, fontSizes: fontSizes, fontWeights: fontWeights, textAlignments: textAlignments, textBaselines: textBaselines },
        inheritableStatics: {
            def: {
                animationProcessors: { text: 'text' },
                processors: {
                    x: 'number',
                    y: 'number',
                    text: 'string',
                    fontSize: function(n) {
                        if (Ext.isNumber(+n)) {
                            return n + 'px';
                        } else {
                            if (n.match(Ext.dom.Element.unitRe)) {
                                return n;
                            } else {
                                if (n in fontSizes) {
                                    return n;
                                }
                            }
                        }
                    },
                    fontStyle: 'enums(,italic,oblique)',
                    fontVariant: 'enums(,small-caps)',
                    fontWeight: function(n) {
                        if (n in fontWeights) {
                            return String(n);
                        } else {
                            return '';
                        }
                    },
                    fontFamily: 'string',
                    textAlign: function(n) {
                        return textAlignments[n] || 'center';
                    },
                    textBaseline: function(n) {
                        return textBaselines[n] || 'alphabetic';
                    },
                    font: 'string',
                    debug: 'default'
                },
                aliases: { 'font-size': 'fontSize', 'font-family': 'fontFamily', 'font-weight': 'fontWeight', 'font-variant': 'fontVariant', 'text-anchor': 'textAlign' },
                defaults: { fontStyle: '', fontVariant: '', fontWeight: '', fontSize: '10px', fontFamily: 'sans-serif', font: '10px sans-serif', textBaseline: 'alphabetic', textAlign: 'start', strokeStyle: 'rgba(0, 0, 0, 0)', fillStyle: '#000', x: 0, y: 0, text: '' },
                triggers: {
                    fontStyle: 'fontX,bbox',
                    fontVariant: 'fontX,bbox',
                    fontWeight: 'fontX,bbox',
                    fontSize: 'fontX,bbox',
                    fontFamily: 'fontX,bbox',
                    font: 'font,bbox,canvas',
                    textBaseline: 'bbox',
                    textAlign: 'bbox',
                    x: 'bbox',
                    y: 'bbox',
                    text: 'bbox'
                },
                updaters: { fontX: 'makeFontShorthand', font: 'parseFontShorthand' }
            }
        },
        config: { preciseMeasurement: undefined },
        constructor: function(config) {
            if (config && config.font) {
                config = Ext.clone(config);
                for (var key in config) {
                    if (key !== 'font' && key.indexOf('font') === 0) {
                        delete config[key];
                    }
                }
            }
            Ext.draw.sprite.Sprite.prototype.constructor.call(this, config);
        },
        fontValuesMap: { 'italic': 'fontStyle', 'oblique': 'fontStyle', 'small-caps': 'fontVariant', 'bold': 'fontWeight', 'bolder': 'fontWeight', 'lighter': 'fontWeight', 100: 'fontWeight', 200: 'fontWeight', 300: 'fontWeight', 400: 'fontWeight', 500: 'fontWeight', 600: 'fontWeight', 700: 'fontWeight', 800: 'fontWeight', 900: 'fontWeight', 'xx-small': 'fontSize', 'x-small': 'fontSize', 'small': 'fontSize', 'medium': 'fontSize', 'large': 'fontSize', 'x-large': 'fontSize', 'xx-large': 'fontSize' },
        makeFontShorthand: function(attr) {
            var parts = [];
            if (attr.fontStyle) {
                parts.push(attr.fontStyle);
            }
            if (attr.fontVariant) {
                parts.push(attr.fontVariant);
            }
            if (attr.fontWeight) {
                parts.push(attr.fontWeight);
            }
            if (attr.fontSize) {
                parts.push(attr.fontSize);
            }
            if (attr.fontFamily) {
                parts.push(attr.fontFamily);
            }
            this.setAttributes({ font: parts.join(' ') }, true);
        },
        parseFontShorthand: function(attr) {
            var value = attr.font,
                ln = value.length,
                changes = {},
                dispatcher = this.fontValuesMap,
                start = 0,
                end, slashIndex, part, fontProperty;
            while (start < ln && end !== -1) {
                end = value.indexOf(' ', start);
                if (end < 0) {
                    part = value.substr(start);
                } else {
                    if (end > start) {
                        part = value.substr(start, end - start);
                    } else {
                        continue;
                    }
                }
                slashIndex = part.indexOf('/');
                if (slashIndex > 0) {
                    part = part.substr(0, slashIndex);
                } else {
                    if (slashIndex === 0) {
                        continue;
                    }
                }
                if (part !== 'normal' && part !== 'inherit') {
                    fontProperty = dispatcher[part];
                    if (fontProperty) {
                        changes[fontProperty] = part;
                    } else {
                        if (part.match(Ext.dom.Element.unitRe)) {
                            changes.fontSize = part;
                        } else {
                            changes.fontFamily = value.substr(start);
                            break;
                        }
                    }
                }
                start = end + 1;
            }
            if (!changes.fontStyle) {
                changes.fontStyle = '';
            }
            if (!changes.fontVariant) {
                changes.fontVariant = '';
            }
            if (!changes.fontWeight) {
                changes.fontWeight = '';
            }
            this.setAttributes(changes, true);
        },
        fontProperties: { fontStyle: true, fontVariant: true, fontWeight: true, fontSize: true, fontFamily: true },
        setAttributes: function(changes, bypassNormalization, avoidCopy) {
            var key, obj;
            if (changes && changes.font) {
                obj = {};
                for (key in changes) {
                    if (!(key in this.fontProperties)) {
                        obj[key] = changes[key];
                    }
                }
                changes = obj;
            }
            this.callParent([changes, bypassNormalization, avoidCopy]);
        },
        getBBox: function(isWithoutTransform) {
            var me = this,
                plain = me.attr.bbox.plain,
                surface = me.getSurface();
            if (plain.dirty) {
                me.updatePlainBBox(plain);
                plain.dirty = false;
            }
            if (surface && surface.getInherited().rtl && surface.getFlipRtlText()) {
                me.updatePlainBBox(plain, true);
            }
            return me.callParent([isWithoutTransform]);
        },
        rtlAlignments: { start: 'end', center: 'center', end: 'start' },
        updatePlainBBox: function(plain, useOldSize) {
            var me = this,
                attr = me.attr,
                x = attr.x,
                y = attr.y,
                dx = [],
                font = attr.font,
                text = attr.text,
                baseline = attr.textBaseline,
                alignment = attr.textAlign,
                precise = me.getPreciseMeasurement(),
                size, textMeasurerPrecision;
            if (useOldSize && me.oldSize) {
                size = me.oldSize;
            } else {
                textMeasurerPrecision = Ext.draw.TextMeasurer.precise;
                if (Ext.isBoolean(precise)) {
                    Ext.draw.TextMeasurer.precise = precise;
                }
                size = me.oldSize = Ext.draw.TextMeasurer.measureText(text, font);
                Ext.draw.TextMeasurer.precise = textMeasurerPrecision;
            }
            var surface = me.getSurface(),
                isRtl = surface && surface.getInherited().rtl || false,
                flipRtlText = isRtl && surface.getFlipRtlText(),
                sizes = size.sizes,
                blockHeight = size.height,
                blockWidth = size.width,
                ln = sizes ? sizes.length : 0,
                lineWidth, rect, i = 0;
            switch (baseline) {
                case 'hanging':
                case 'top':
                    break;
                case 'ideographic':
                case 'bottom':
                    y -= blockHeight;
                    break;
                case 'alphabetic':
                    y -= blockHeight * 0.8;
                    break;
                case 'middle':
                    y -= blockHeight * 0.5;
                    break;
            }
            if (flipRtlText) {
                rect = surface.getRect();
                x = rect[2] - rect[0] - x;
                alignment = me.rtlAlignments[alignment];
            }
            switch (alignment) {
                case 'start':
                    if (isRtl) {
                        for (; i < ln; i++) {
                            lineWidth = sizes[i].width;
                            dx.push(-(blockWidth - lineWidth));
                        }
                    }
                    break;
                case 'end':
                    x -= blockWidth;
                    if (isRtl) {
                        break;
                    }
                    for (; i < ln; i++) {
                        lineWidth = sizes[i].width;
                        dx.push(blockWidth - lineWidth);
                    }
                    break;
                case 'center':
                    x -= blockWidth * 0.5;
                    for (; i < ln; i++) {
                        lineWidth = sizes[i].width;
                        dx.push((isRtl ? -1 : 1) * (blockWidth - lineWidth) * 0.5);
                    }
                    break;
            }
            attr.textAlignOffsets = dx;
            plain.x = x;
            plain.y = y;
            plain.width = blockWidth;
            plain.height = blockHeight;
        },
        setText: function(text) {
            this.setAttributes({ text: text }, true);
        },
        render: function(surface, ctx, rect) {
            var me = this,
                attr = me.attr,
                mat = Ext.draw.Matrix.fly(attr.matrix.elements.slice(0)),
                bbox = me.getBBox(true),
                dx = attr.textAlignOffsets,
                none = Ext.util.Color.RGBA_NONE,
                x, y, i, lines, lineHeight;
            if (attr.text.length === 0) {
                return;
            }
            lines = attr.text.split(me.lineBreakRe);
            lineHeight = bbox.height / lines.length;
            x = attr.bbox.plain.x;
            y = attr.bbox.plain.y + lineHeight * 0.78;
            mat.toContext(ctx);
            if (surface.getInherited().rtl) {
                x += attr.bbox.plain.width;
            }
            for (i = 0; i < lines.length; i++) {
                if (ctx.fillStyle !== none) {
                    ctx.fillText(lines[i], x + (dx[i] || 0), y + lineHeight * i);
                }
                if (ctx.strokeStyle !== none) {
                    ctx.strokeText(lines[i], x + (dx[i] || 0), y + lineHeight * i);
                }
            }
            var debug = attr.debug || this.statics().debug || Ext.draw.sprite.Sprite.debug;
            if (debug) {
                this.attr.inverseMatrix.toContext(ctx);
                debug.bbox && me.renderBBox(surface, ctx);
            }
        }
    };
});
Ext.define('Ext.draw.sprite.Tick', {
    extend: Ext.draw.sprite.Line,
    alias: 'sprite.tick',
    inheritableStatics: {
        def: {
            processors: { x: 'number', y: 'number', size: 'number' },
            defaults: { x: 0, y: 0, size: 4 },
            triggers: { x: 'tick', y: 'tick', size: 'tick' },
            updaters: {
                tick: function(attr) {
                    var size = attr.size * 1.5,
                        halfLineWidth = attr.lineWidth / 2,
                        x = attr.x,
                        y = attr.y;
                    this.setAttributes({ fromX: x - halfLineWidth, fromY: y - size, toX: x - halfLineWidth, toY: y + size });
                }
            }
        }
    }
});
Ext.define('Ext.draw.sprite.Triangle', {
    extend: Ext.draw.sprite.Path,
    alias: 'sprite.triangle',
    inheritableStatics: { def: { processors: { x: 'number', y: 'number', size: 'number' }, defaults: { x: 0, y: 0, size: 4 }, triggers: { x: 'path', y: 'path', size: 'path' } } },
    updatePath: function(path, attr) {
        var s = attr.size * 2.2,
            x = attr.x,
            y = attr.y;
        path.fromSvgString('M'.concat(x, ',', y, 'm0-', s * 0.48, 'l', s * 0.5, ',', s * 0.87, '-', s, ',0z'));
    }
});
Ext.define('Ext.draw.gradient.Linear', {
    extend: Ext.draw.gradient.Gradient,
    type: 'linear',
    config: { degrees: 0, radians: 0 },
    applyRadians: function(radians, oldRadians) {
        if (Ext.isNumber(radians)) {
            return radians;
        }
        return oldRadians;
    },
    applyDegrees: function(degrees, oldDegrees) {
        if (Ext.isNumber(degrees)) {
            return degrees;
        }
        return oldDegrees;
    },
    updateRadians: function(radians) {
        this.setDegrees(Ext.draw.Draw.degrees(radians));
    },
    updateDegrees: function(degrees) {
        this.setRadians(Ext.draw.Draw.rad(degrees));
    },
    generateGradient: function(ctx, bbox) {
        var angle = this.getRadians(),
            cos = Math.cos(angle),
            sin = Math.sin(angle),
            w = bbox.width,
            h = bbox.height,
            cx = bbox.x + w * 0.5,
            cy = bbox.y + h * 0.5,
            stops = this.getStops(),
            ln = stops.length,
            gradient, l, i;
        if (Ext.isNumber(cx) && Ext.isNumber(cy) && h > 0 && w > 0) {
            l = Math.sqrt(h * h + w * w) * Math.abs(Math.cos(angle - Math.atan(h / w))) / 2;
            gradient = ctx.createLinearGradient(cx + cos * l, cy + sin * l, cx - cos * l, cy - sin * l);
            for (i = 0; i < ln; i++) {
                gradient.addColorStop(stops[i].offset, stops[i].color);
            }
            return gradient;
        }
        return Ext.util.Color.NONE;
    }
});
Ext.define('Ext.draw.gradient.Radial', {
    extend: Ext.draw.gradient.Gradient,
    type: 'radial',
    config: { start: { x: 0, y: 0, r: 0 }, end: { x: 0, y: 0, r: 1 } },
    applyStart: function(newStart, oldStart) {
        if (!oldStart) {
            return newStart;
        }
        var circle = { x: oldStart.x, y: oldStart.y, r: oldStart.r };
        if ('x' in newStart) {
            circle.x = newStart.x;
        } else {
            if ('centerX' in newStart) {
                circle.x = newStart.centerX;
            }
        }
        if ('y' in newStart) {
            circle.y = newStart.y;
        } else {
            if ('centerY' in newStart) {
                circle.y = newStart.centerY;
            }
        }
        if ('r' in newStart) {
            circle.r = newStart.r;
        } else {
            if ('radius' in newStart) {
                circle.r = newStart.radius;
            }
        }
        return circle;
    },
    applyEnd: function(newEnd, oldEnd) {
        if (!oldEnd) {
            return newEnd;
        }
        var circle = { x: oldEnd.x, y: oldEnd.y, r: oldEnd.r };
        if ('x' in newEnd) {
            circle.x = newEnd.x;
        } else {
            if ('centerX' in newEnd) {
                circle.x = newEnd.centerX;
            }
        }
        if ('y' in newEnd) {
            circle.y = newEnd.y;
        } else {
            if ('centerY' in newEnd) {
                circle.y = newEnd.centerY;
            }
        }
        if ('r' in newEnd) {
            circle.r = newEnd.r;
        } else {
            if ('radius' in newEnd) {
                circle.r = newEnd.radius;
            }
        }
        return circle;
    },
    generateGradient: function(ctx, bbox) {
        var start = this.getStart(),
            end = this.getEnd(),
            w = bbox.width * 0.5,
            h = bbox.height * 0.5,
            x = bbox.x + w,
            y = bbox.y + h,
            gradient = ctx.createRadialGradient(x + start.x * w, y + start.y * h, start.r * Math.max(w, h), x + end.x * w, y + end.y * h, end.r * Math.max(w, h)),
            stops = this.getStops(),
            ln = stops.length,
            i;
        for (i = 0; i < ln; i++) {
            gradient.addColorStop(stops[i].offset, stops[i].color);
        }
        return gradient;
    }
});
Ext.define('Ext.draw.Surface', {
    extend: Ext.draw.SurfaceBase,
    xtype: 'surface',
    devicePixelRatio: window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI,
    deprecated: {
        '5.1.0': {
            statics: {
                methods: {
                    stableSort: function(list) {
                        return Ext.Array.sort(list, function(a, b) {
                            return a.attr.zIndex - b.attr.zIndex;
                        });
                    }
                }
            }
        }
    },
    cls: Ext.baseCSSPrefix + 'surface',
    config: { rect: null, background: null, items: [], dirty: false, flipRtlText: false },
    isSurface: true,
    isPendingRenderFrame: false,
    dirtyPredecessorCount: 0,
    constructor: function(config) {
        var me = this;
        me.predecessors = [];
        me.successors = [];
        me.map = {};
        me.callParent([config]);
        me.matrix = new Ext.draw.Matrix;
        me.inverseMatrix = me.matrix.inverse();
    },
    roundPixel: function(num) {
        return Math.round(this.devicePixelRatio * num) / this.devicePixelRatio;
    },
    waitFor: function(surface) {
        var me = this,
            predecessors = me.predecessors;
        if (!Ext.Array.contains(predecessors, surface)) {
            predecessors.push(surface);
            surface.successors.push(me);
            if (surface.getDirty()) {
                me.dirtyPredecessorCount++;
            }
        }
    },
    updateDirty: function(dirty) {
        var successors = this.successors,
            ln = successors.length,
            i = 0,
            successor;
        for (; i < ln; i++) {
            successor = successors[i];
            if (dirty) {
                successor.dirtyPredecessorCount++;
                successor.setDirty(true);
            } else {
                successor.dirtyPredecessorCount--;
                if (successor.dirtyPredecessorCount === 0 && successor.isPendingRenderFrame) {
                    successor.renderFrame();
                }
            }
        }
    },
    applyBackground: function(background, oldBackground) {
        this.setDirty(true);
        if (Ext.isString(background)) {
            background = { fillStyle: background };
        }
        return Ext.factory(background, Ext.draw.sprite.Rect, oldBackground);
    },
    applyRect: function(rect, oldRect) {
        if (oldRect && rect[0] === oldRect[0] && rect[1] === oldRect[1] && rect[2] === oldRect[2] && rect[3] === oldRect[3]) {
            return;
        }
        if (Ext.isArray(rect)) {
            return [rect[0], rect[1], rect[2], rect[3]];
        } else {
            if (Ext.isObject(rect)) {
                return [rect.x || rect.left, rect.y || rect.top, rect.width || rect.right - rect.left, rect.height || rect.bottom - rect.top];
            }
        }
    },
    updateRect: function(rect) {
        var me = this,
            l = rect[0],
            t = rect[1],
            r = l + rect[2],
            b = t + rect[3],
            background = me.getBackground(),
            element = me.element;
        element.setLocalXY(Math.floor(l), Math.floor(t));
        element.setSize(Math.ceil(r - Math.floor(l)), Math.ceil(b - Math.floor(t)));
        if (background) {
            background.setAttributes({ x: 0, y: 0, width: Math.ceil(r - Math.floor(l)), height: Math.ceil(b - Math.floor(t)) });
        }
        me.setDirty(true);
    },
    resetTransform: function() {
        this.matrix.set(1, 0, 0, 1, 0, 0);
        this.inverseMatrix.set(1, 0, 0, 1, 0, 0);
        this.setDirty(true);
    },
    get: function(id) {
        return this.map[id] || this.getItems()[id];
    },
    add: function() {
        var me = this,
            args = Array.prototype.slice.call(arguments),
            argIsArray = Ext.isArray(args[0]),
            map = me.map,
            results = [],
            items, item, sprite, oldSurface, i, ln;
        items = Ext.Array.clean(argIsArray ? args[0] : args);
        if (!items.length) {
            return results;
        }
        for (i = 0, ln = items.length; i < ln; i++) {
            item = items[i];
            if (!item || item.destroyed) {
                continue;
            }
            sprite = null;
            if (item.isSprite && !map[item.getId()]) {
                sprite = item;
            } else {
                if (!map[item.id]) {
                    sprite = this.createItem(item);
                }
            }
            if (sprite) {
                map[sprite.getId()] = sprite;
                results.push(sprite);
                oldSurface = sprite.getSurface();
                if (oldSurface && oldSurface.isSurface) {
                    oldSurface.remove(sprite);
                }
                sprite.setParent(me);
                sprite.setSurface(me);
                me.onAdd(sprite);
            }
        }
        items = me.getItems();
        if (items) {
            items.push.apply(items, results);
        }
        me.dirtyZIndex = true;
        me.setDirty(true);
        if (!argIsArray && results.length === 1) {
            return results[0];
        } else {
            return results;
        }
    },
    onAdd: Ext.emptyFn,
    remove: function(sprite, isDestroy) {
        var me = this,
            destroying = me.clearing,
            id, isOwnSprite;
        if (sprite) {
            if (sprite.charAt) {
                sprite = me.map[sprite];
            }
            if (!sprite || !sprite.isSprite) {
                return null;
            }
            id = sprite.id;
            isOwnSprite = me.map[id];
            delete me.map[id];
            if (sprite.destroyed || sprite.destroying) {
                if (isOwnSprite && !destroying) {
                    Ext.Array.remove(me.getItems(), sprite);
                }
                return sprite;
            }
            if (!isOwnSprite) {
                if (isDestroy) {
                    sprite.destroy();
                }
                return sprite;
            }
            sprite.setParent(null);
            sprite.setSurface(null);
            if (isDestroy) {
                sprite.destroy();
            }
            if (!destroying) {
                Ext.Array.remove(me.getItems(), sprite);
                me.dirtyZIndex = true;
                me.setDirty(true);
            }
        }
        return sprite || null;
    },
    removeAll: function(isDestroy) {
        var me = this,
            items = me.getItems(),
            item, ln, i;
        me.clearing = !!isDestroy;
        for (i = items.length - 1; i >= 0; i--) {
            item = items[i];
            if (isDestroy) {
                item.destroy();
            } else {
                item.setParent(null);
                item.setSurface(null);
            }
        }
        me.clearing = false;
        items.length = 0;
        me.map = {};
        me.dirtyZIndex = true;
        if (!me.destroying) {
            me.setDirty(true);
        }
    },
    applyItems: function(items) {
        if (this.getItems()) {
            this.removeAll(true);
        }
        return Ext.Array.from(this.add(items));
    },
    createItem: function(config) {
        return Ext.create(config.xclass || 'sprite.' + config.type, config);
    },
    getBBox: function(sprites, isWithoutTransform) {
        sprites = Ext.Array.from(sprites);
        var left = Infinity,
            right = -Infinity,
            top = Infinity,
            bottom = -Infinity,
            ln = sprites.length,
            sprite, bbox, i;
        for (i = 0; i < ln; i++) {
            sprite = sprites[i];
            bbox = sprite.getBBox(isWithoutTransform);
            if (left > bbox.x) {
                left = bbox.x;
            }
            if (right < bbox.x + bbox.width) {
                right = bbox.x + bbox.width;
            }
            if (top > bbox.y) {
                top = bbox.y;
            }
            if (bottom < bbox.y + bbox.height) {
                bottom = bbox.y + bbox.height;
            }
        }
        return { x: left, y: top, width: right - left, height: bottom - top };
    },
    emptyRect: [0, 0, 0, 0],
    getEventXY: function(e) {
        var me = this,
            isRtl = me.getInherited().rtl,
            pageXY = e.getXY(),
            container = me.getOwnerBody(),
            xy = container.getXY(),
            rect = me.getRect() || me.emptyRect,
            result = [],
            width;
        if (isRtl) {
            width = container.getWidth();
            result[0] = xy[0] - pageXY[0] - rect[0] + width;
        } else {
            result[0] = pageXY[0] - xy[0] - rect[0];
        }
        result[1] = pageXY[1] - xy[1] - rect[1];
        return result;
    },
    clear: Ext.emptyFn,
    orderByZIndex: function() {
        var me = this,
            items = me.getItems(),
            dirtyZIndex = false,
            i, ln;
        if (me.getDirty()) {
            for (i = 0, ln = items.length; i < ln; i++) {
                if (items[i].attr.dirtyZIndex) {
                    dirtyZIndex = true;
                    break;
                }
            }
            if (dirtyZIndex) {
                Ext.Array.sort(items, function(a, b) {
                    return a.attr.zIndex - b.attr.zIndex;
                });
                this.setDirty(true);
            }
            for (i = 0, ln = items.length; i < ln; i++) {
                items[i].attr.dirtyZIndex = false;
            }
        }
    },
    repaint: function() {
        var me = this;
        me.repaint = Ext.emptyFn;
        Ext.defer(function() {
            delete me.repaint;
            me.element.repaint();
        }, 1);
    },
    renderFrame: function() {
        var me = this;
        if (!(me.element && me.getDirty() && me.getRect())) {
            return;
        }
        if (me.dirtyPredecessorCount > 0) {
            me.isPendingRenderFrame = true;
            return;
        }
        var background = me.getBackground(),
            items = me.getItems(),
            item, i, ln;
        me.orderByZIndex();
        if (me.getDirty()) {
            me.clear();
            me.clearTransform();
            if (background) {
                me.renderSprite(background);
            }
            for (i = 0, ln = items.length; i < ln; i++) {
                item = items[i];
                if (me.renderSprite(item) === false) {
                    return;
                }
                item.attr.textPositionCount = me.textPosition;
            }
            me.setDirty(false);
        }
    },
    renderSprite: Ext.emptyFn,
    clearTransform: Ext.emptyFn,
    destroy: function() {
        var me = this;
        me.destroying = true;
        me.removeAll(true);
        me.destroying = false;
        me.predecessors = me.successors = null;
        if (me.hasListeners.destroy) {
            me.fireEvent('destroy', me);
        }
        me.callParent();
    }
});
Ext.define('Ext.draw.overrides.hittest.Surface', {
    override: 'Ext.draw.Surface',
    hitTest: function(point, options) {
        var me = this,
            sprites = me.getItems(),
            i, sprite, result;
        options = options || Ext.draw.sprite.Sprite.defaultHitTestOptions;
        for (i = sprites.length - 1; i >= 0; i--) {
            sprite = sprites[i];
            if (sprite.hitTest) {
                result = sprite.hitTest(point, options);
                if (result) {
                    return result;
                }
            }
        }
        return null;
    },
    hitTestEvent: function(event, options) {
        var xy = this.getEventXY(event);
        return this.hitTest(xy, options);
    }
});
Ext.define('Ext.draw.engine.SvgContext', {
    toSave: ['strokeOpacity', 'strokeStyle', 'fillOpacity', 'fillStyle', 'globalAlpha', 'lineWidth', 'lineCap', 'lineJoin', 'lineDash', 'lineDashOffset', 'miterLimit', 'shadowOffsetX', 'shadowOffsetY', 'shadowBlur', 'shadowColor', 'globalCompositeOperation', 'position', 'fillGradient', 'strokeGradient'],
    strokeOpacity: 1,
    strokeStyle: 'none',
    fillOpacity: 1,
    fillStyle: 'none',
    lineDas: [],
    lineDashOffset: 0,
    globalAlpha: 1,
    lineWidth: 1,
    lineCap: 'butt',
    lineJoin: 'miter',
    miterLimit: 10,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowBlur: 0,
    shadowColor: 'none',
    globalCompositeOperation: 'src',
    urlStringRe: /^url\(#([\w\-]+)\)$/,
    constructor: function(SvgSurface) {
        var me = this;
        me.surface = SvgSurface;
        me.state = [];
        me.matrix = new Ext.draw.Matrix;
        me.path = null;
        me.clear();
    },
    clear: function() {
        this.group = this.surface.mainGroup;
        this.position = 0;
        this.path = null;
    },
    getElement: function(tag) {
        return this.surface.getSvgElement(this.group, tag, this.position++);
    },
    save: function() {
        var toSave = this.toSave,
            obj = {},
            group = this.getElement('g'),
            key, i;
        for (i = 0; i < toSave.length; i++) {
            key = toSave[i];
            if (key in this) {
                obj[key] = this[key];
            }
        }
        this.position = 0;
        obj.matrix = this.matrix.clone();
        this.state.push(obj);
        this.group = group;
        return group;
    },
    restore: function() {
        var toSave = this.toSave,
            obj = this.state.pop(),
            group = this.group,
            children = group.dom.childNodes,
            key, i;
        while (children.length > this.position) {
            group.last().destroy();
        }
        for (i = 0; i < toSave.length; i++) {
            key = toSave[i];
            if (key in obj) {
                this[key] = obj[key];
            } else {
                delete this[key];
            }
        }
        this.setTransform.apply(this, obj.matrix.elements);
        this.group = group.getParent();
    },
    transform: function(xx, yx, xy, yy, dx, dy) {
        if (this.path) {
            var inv = Ext.draw.Matrix.fly([xx, yx, xy, yy, dx, dy]).inverse();
            this.path.transform(inv);
        }
        this.matrix.append(xx, yx, xy, yy, dx, dy);
    },
    setTransform: function(xx, yx, xy, yy, dx, dy) {
        if (this.path) {
            this.path.transform(this.matrix);
        }
        this.matrix.reset();
        this.transform(xx, yx, xy, yy, dx, dy);
    },
    scale: function(x, y) {
        this.transform(x, 0, 0, y, 0, 0);
    },
    rotate: function(angle) {
        var xx = Math.cos(angle),
            yx = Math.sin(angle),
            xy = -Math.sin(angle),
            yy = Math.cos(angle);
        this.transform(xx, yx, xy, yy, 0, 0);
    },
    translate: function(x, y) {
        this.transform(1, 0, 0, 1, x, y);
    },
    setGradientBBox: function(bbox) {
        this.bbox = bbox;
    },
    beginPath: function() {
        this.path = new Ext.draw.Path;
    },
    moveTo: function(x, y) {
        if (!this.path) {
            this.beginPath();
        }
        this.path.moveTo(x, y);
        this.path.element = null;
    },
    lineTo: function(x, y) {
        if (!this.path) {
            this.beginPath();
        }
        this.path.lineTo(x, y);
        this.path.element = null;
    },
    rect: function(x, y, width, height) {
        this.moveTo(x, y);
        this.lineTo(x + width, y);
        this.lineTo(x + width, y + height);
        this.lineTo(x, y + height);
        this.closePath();
    },
    strokeRect: function(x, y, width, height) {
        this.beginPath();
        this.rect(x, y, width, height);
        this.stroke();
    },
    fillRect: function(x, y, width, height) {
        this.beginPath();
        this.rect(x, y, width, height);
        this.fill();
    },
    closePath: function() {
        if (!this.path) {
            this.beginPath();
        }
        this.path.closePath();
        this.path.element = null;
    },
    arcSvg: function(r1, r2, rotation, large, swipe, x2, y2) {
        if (!this.path) {
            this.beginPath();
        }
        this.path.arcSvg(r1, r2, rotation, large, swipe, x2, y2);
        this.path.element = null;
    },
    arc: function(x, y, radius, startAngle, endAngle, anticlockwise) {
        if (!this.path) {
            this.beginPath();
        }
        this.path.arc(x, y, radius, startAngle, endAngle, anticlockwise);
        this.path.element = null;
    },
    ellipse: function(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise) {
        if (!this.path) {
            this.beginPath();
        }
        this.path.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise);
        this.path.element = null;
    },
    arcTo: function(x1, y1, x2, y2, radiusX, radiusY, rotation) {
        if (!this.path) {
            this.beginPath();
        }
        this.path.arcTo(x1, y1, x2, y2, radiusX, radiusY, rotation);
        this.path.element = null;
    },
    bezierCurveTo: function(x1, y1, x2, y2, x3, y3) {
        if (!this.path) {
            this.beginPath();
        }
        this.path.bezierCurveTo(x1, y1, x2, y2, x3, y3);
        this.path.element = null;
    },
    strokeText: function(text, x, y) {
        text = String(text);
        if (this.strokeStyle) {
            var element = this.getElement('text'),
                tspan = this.surface.getSvgElement(element, 'tspan', 0);
            this.surface.setElementAttributes(element, { 'x': x, 'y': y, 'transform': this.matrix.toSvg(), 'stroke': this.strokeStyle, 'fill': 'none', 'opacity': this.globalAlpha, 'stroke-opacity': this.strokeOpacity, 'style': 'font: ' + this.font, 'stroke-dasharray': this.lineDash.join(','), 'stroke-dashoffset': this.lineDashOffset });
            if (this.lineDash.length) {
                this.surface.setElementAttributes(element, { 'stroke-dasharray': this.lineDash.join(','), 'stroke-dashoffset': this.lineDashOffset });
            }
            if (tspan.dom.firstChild) {
                tspan.dom.removeChild(tspan.dom.firstChild);
            }
            this.surface.setElementAttributes(tspan, { 'alignment-baseline': 'alphabetic' });
            tspan.dom.appendChild(document.createTextNode(Ext.String.htmlDecode(text)));
        }
    },
    fillText: function(text, x, y) {
        text = String(text);
        if (this.fillStyle) {
            var element = this.getElement('text'),
                tspan = this.surface.getSvgElement(element, 'tspan', 0);
            this.surface.setElementAttributes(element, { 'x': x, 'y': y, 'transform': this.matrix.toSvg(), 'fill': this.fillStyle, 'opacity': this.globalAlpha, 'fill-opacity': this.fillOpacity, 'style': 'font: ' + this.font });
            if (tspan.dom.firstChild) {
                tspan.dom.removeChild(tspan.dom.firstChild);
            }
            this.surface.setElementAttributes(tspan, { 'alignment-baseline': 'alphabetic' });
            tspan.dom.appendChild(document.createTextNode(Ext.String.htmlDecode(text)));
        }
    },
    drawImage: function(image, sx, sy, sw, sh, dx, dy, dw, dh) {
        var me = this,
            element = me.getElement('image'),
            x = sx,
            y = sy,
            width = typeof sw === 'undefined' ? image.width : sw,
            height = typeof sh === 'undefined' ? image.height : sh,
            viewBox = null;
        if (typeof dh !== 'undefined') {
            viewBox = sx + ' ' + sy + ' ' + sw + ' ' + sh;
            x = dx;
            y = dy;
            width = dw;
            height = dh;
        }
        element.dom.setAttributeNS('http:/' + '/www.w3.org/1999/xlink', 'href', image.src);
        me.surface.setElementAttributes(element, { viewBox: viewBox, x: x, y: y, width: width, height: height, opacity: me.globalAlpha, transform: me.matrix.toSvg() });
    },
    fill: function() {
        var me = this;
        if (!me.path) {
            return;
        }
        if (me.fillStyle) {
            var path, fillGradient = me.fillGradient,
                element = me.path.element,
                bbox = me.bbox,
                fill;
            if (!element) {
                path = me.path.toString();
                element = me.path.element = me.getElement('path');
                me.surface.setElementAttributes(element, { 'd': path, 'transform': me.matrix.toSvg() });
            }
            if (fillGradient && bbox) {
                fill = fillGradient.generateGradient(me, bbox);
            } else {
                fill = me.fillStyle;
            }
            me.surface.setElementAttributes(element, { 'fill': fill, 'fill-opacity': me.fillOpacity * me.globalAlpha });
        }
    },
    stroke: function() {
        var me = this;
        if (!me.path) {
            return;
        }
        if (me.strokeStyle) {
            var path, strokeGradient = me.strokeGradient,
                element = me.path.element,
                bbox = me.bbox,
                stroke;
            if (!element || !me.path.svgString) {
                path = me.path.toString();
                if (!path) {
                    return;
                }
                element = me.path.element = me.getElement('path');
                me.surface.setElementAttributes(element, { 'fill': 'none', 'd': path, 'transform': me.matrix.toSvg() });
            }
            if (strokeGradient && bbox) {
                stroke = strokeGradient.generateGradient(me, bbox);
            } else {
                stroke = me.strokeStyle;
            }
            me.surface.setElementAttributes(element, { 'stroke': stroke, 'stroke-linecap': me.lineCap, 'stroke-linejoin': me.lineJoin, 'stroke-width': me.lineWidth, 'stroke-opacity': me.strokeOpacity * me.globalAlpha, 'stroke-dasharray': me.lineDash.join(','), 'stroke-dashoffset': me.lineDashOffset });
            if (me.lineDash.length) {
                me.surface.setElementAttributes(element, { 'stroke-dasharray': me.lineDash.join(','), 'stroke-dashoffset': me.lineDashOffset });
            }
        }
    },
    fillStroke: function(attr, transformFillStroke) {
        var ctx = this,
            fillStyle = ctx.fillStyle,
            strokeStyle = ctx.strokeStyle,
            fillOpacity = ctx.fillOpacity,
            strokeOpacity = ctx.strokeOpacity;
        if (transformFillStroke === undefined) {
            transformFillStroke = attr.transformFillStroke;
        }
        if (!transformFillStroke) {
            attr.inverseMatrix.toContext(ctx);
        }
        if (fillStyle && fillOpacity !== 0) {
            ctx.fill();
        }
        if (strokeStyle && strokeOpacity !== 0) {
            ctx.stroke();
        }
    },
    appendPath: function(path) {
        this.path = path.clone();
    },
    setLineDash: function(lineDash) {
        this.lineDash = lineDash;
    },
    getLineDash: function() {
        return this.lineDash;
    },
    createLinearGradient: function(x0, y0, x1, y1) {
        var me = this,
            element = me.surface.getNextDef('linearGradient'),
            gradient;
        me.surface.setElementAttributes(element, { 'x1': x0, 'y1': y0, 'x2': x1, 'y2': y1, 'gradientUnits': 'userSpaceOnUse' });
        gradient = new Ext.draw.engine.SvgContext.Gradient(me, me.surface, element);
        return gradient;
    },
    createRadialGradient: function(x0, y0, r0, x1, y1, r1) {
        var me = this,
            element = me.surface.getNextDef('radialGradient'),
            gradient;
        me.surface.setElementAttributes(element, { 'fx': x0, 'fy': y0, 'cx': x1, 'cy': y1, 'r': r1, 'gradientUnits': 'userSpaceOnUse' });
        gradient = new Ext.draw.engine.SvgContext.Gradient(me, me.surface, element, r0 / r1);
        return gradient;
    }
});
Ext.define('Ext.draw.engine.SvgContext.Gradient', {
    isGradient: true,
    constructor: function(ctx, surface, element, compression) {
        var me = this;
        me.ctx = ctx;
        me.surface = surface;
        me.element = element;
        me.position = 0;
        me.compression = compression || 0;
    },
    addColorStop: function(offset, color) {
        var me = this,
            stop = me.surface.getSvgElement(me.element, 'stop', me.position++),
            compression = me.compression;
        me.surface.setElementAttributes(stop, { 'offset': (((1 - compression) * offset + compression) * 100).toFixed(2) + '%', 'stop-color': color, 'stop-opacity': Ext.util.Color.fly(color).a.toFixed(15) });
    },
    toString: function() {
        var children = this.element.dom.childNodes;
        while (children.length > this.position) {
            Ext.fly(children[children.length - 1]).destroy();
        }
        return 'url(#' + this.element.getId() + ')';
    }
});
Ext.define('Ext.draw.engine.Svg', {
    extend: Ext.draw.Surface,
    isSVG: true,
    config: { highPrecision: false },
    getElementConfig: function() {
        return { reference: 'element', style: { position: 'absolute' }, children: [{ reference: 'innerElement', style: { width: '100%', height: '100%', position: 'relative' }, children: [{ tag: 'svg', reference: 'svgElement', namespace: 'http://www.w3.org/2000/svg', width: '100%', height: '100%', version: 1.1 }] }] };
    },
    constructor: function(config) {
        var me = this;
        me.callParent([config]);
        me.mainGroup = me.createSvgNode('g');
        me.defsElement = me.createSvgNode('defs');
        me.svgElement.appendChild(me.mainGroup);
        me.svgElement.appendChild(me.defsElement);
        me.ctx = new Ext.draw.engine.SvgContext(me);
    },
    createSvgNode: function(type) {
        var node = document.createElementNS('http://www.w3.org/2000/svg', type);
        return Ext.get(node);
    },
    getSvgElement: function(group, tag, position) {
        var childNodes = group.dom.childNodes,
            length = childNodes.length,
            element;
        if (position < length) {
            element = childNodes[position];
            if (element.tagName === tag) {
                return Ext.get(element);
            } else {
                Ext.destroy(element);
            }
        } else {
            if (position > length) {
                Ext.raise('Invalid position.');
            }
        }
        element = Ext.get(this.createSvgNode(tag));
        if (position === 0) {
            group.insertFirst(element);
        } else {
            element.insertAfter(Ext.fly(childNodes[position - 1]));
        }
        element.cache = {};
        return element;
    },
    setElementAttributes: function(element, attributes) {
        var dom = element.dom,
            cache = element.cache,
            name, value;
        for (name in attributes) {
            value = attributes[name];
            if (cache[name] !== value) {
                cache[name] = value;
                dom.setAttribute(name, value);
            }
        }
    },
    getNextDef: function(tagName) {
        return this.getSvgElement(this.defsElement, tagName, this.defsPosition++);
    },
    clearTransform: function() {
        var me = this;
        me.mainGroup.set({ transform: me.matrix.toSvg() });
    },
    clear: function() {
        this.ctx.clear();
        this.removeSurplusDefs();
        this.defsPosition = 0;
    },
    removeSurplusDefs: function() {
        var defsElement = this.defsElement,
            defs = defsElement.dom.childNodes,
            ln = defs.length,
            i;
        for (i = ln - 1; i > this.defsPosition; i--) {
            defsElement.removeChild(defs[i]);
        }
    },
    renderSprite: function(sprite) {
        var me = this,
            rect = me.getRect(),
            ctx = me.ctx;
        if (sprite.attr.hidden || sprite.attr.globalAlpha === 0) {
            ctx.save();
            ctx.restore();
            return;
        }
        sprite.element = ctx.save();
        sprite.preRender(this);
        sprite.useAttributes(ctx, rect);
        if (false === sprite.render(this, ctx, [0, 0, rect[2], rect[3]])) {
            return false;
        }
        sprite.setDirty(false);
        ctx.restore();
    },
    toSVG: function(size, surfaces) {
        var className = Ext.getClassName(this),
            svg, surface, rect, i;
        svg = '\x3csvg version\x3d"1.1" baseProfile\x3d"full" xmlns\x3d"http://www.w3.org/2000/svg"' + ' width\x3d"' + size.width + '"' + ' height\x3d"' + size.height + '"\x3e';
        for (i = 0; i < surfaces.length; i++) {
            surface = surfaces[i];
            if (Ext.getClassName(surface) !== className) {
                continue;
            }
            rect = surface.getRect();
            svg += '\x3cg transform\x3d"translate(' + rect[0] + ',' + rect[1] + ')"\x3e';
            svg += this.serializeNode(surface.svgElement.dom);
            svg += '\x3c/g\x3e';
        }
        svg += '\x3c/svg\x3e';
        return svg;
    },
    flatten: function(size, surfaces) {
        var svg = '\x3c?xml version\x3d"1.0" standalone\x3d"yes"?\x3e';
        svg += this.toSVG(size, surfaces);
        return { data: 'data:image/svg+xml;utf8,' + encodeURIComponent(svg), type: 'svg' };
    },
    serializeNode: function(node) {
        var result = '',
            i, n, attr, child;
        if (node.nodeType === document.TEXT_NODE) {
            return node.nodeValue;
        }
        result += '\x3c' + node.nodeName;
        if (node.attributes.length) {
            for (i = 0, n = node.attributes.length; i < n; i++) {
                attr = node.attributes[i];
                result += ' ' + attr.name + '\x3d"' + attr.value + '"';
            }
        }
        result += '\x3e';
        if (node.childNodes && node.childNodes.length) {
            for (i = 0, n = node.childNodes.length; i < n; i++) {
                child = node.childNodes[i];
                result += this.serializeNode(child);
            }
        }
        result += '\x3c/' + node.nodeName + '\x3e';
        return result;
    },
    destroy: function() {
        var me = this;
        me.ctx.destroy();
        me.mainGroup.destroy();
        me.defsElement.destroy();
        delete me.mainGroup;
        delete me.defsElement;
        delete me.ctx;
        me.callParent();
    },
    remove: function(sprite, destroySprite) {
        if (sprite && sprite.element) {
            sprite.element.destroy();
            sprite.element = null;
        }
        this.callParent(arguments);
    }
});
Ext.draw || (Ext.draw = {});
Ext.draw.engine || (Ext.draw.engine = {});
Ext.draw.engine.excanvas = true;
if (!document.createElement('canvas').getContext) {
    (function() {
        var m = Math;
        var mr = m.round;
        var ms = m.sin;
        var mc = m.cos;
        var abs = m.abs;
        var sqrt = m.sqrt;
        var Z = 10;
        var Z2 = Z / 2;
        var IE_VERSION = +navigator.userAgent.match(/MSIE ([\d.]+)?/)[1];

        function getContext() {
            return this.context_ || (this.context_ = new CanvasRenderingContext2D_(this));
        }
        var slice = Array.prototype.slice;

        function bind(f, obj, var_args) {
            var a = slice.call(arguments, 2);
            return function() {
                return f.apply(obj, a.concat(slice.call(arguments)));
            };
        }

        function encodeHtmlAttribute(s) {
            return String(s).replace(/&/g, '\x26amp;').replace(/"/g, '\x26quot;');
        }

        function addNamespace(doc, prefix, urn) {
            Ext.onReady(function() {
                if (!doc.namespaces[prefix]) {
                    doc.namespaces.add(prefix, urn, '#default#VML');
                }
            });
        }

        function addNamespacesAndStylesheet(doc) {
            addNamespace(doc, 'g_vml_', 'urn:schemas-microsoft-com:vml');
            addNamespace(doc, 'g_o_', 'urn:schemas-microsoft-com:office:office');
            if (!doc.styleSheets['ex_canvas_']) {
                var ss = doc.createStyleSheet();
                ss.owningElement.id = 'ex_canvas_';
                ss.cssText = 'canvas{display:inline-block;overflow:hidden;' + 'text-align:left;width:300px;height:150px}';
            }
        }
        addNamespacesAndStylesheet(document);
        var G_vmlCanvasManager_ = {
            init: function(opt_doc) {
                var doc = opt_doc || document;
                doc.createElement('canvas');
                doc.attachEvent('onreadystatechange', bind(this.init_, this, doc));
            },
            init_: function(doc) {
                var els = doc.getElementsByTagName('canvas');
                for (var i = 0; i < els.length; i++) {
                    this.initElement(els[i]);
                }
            },
            initElement: function(el) {
                if (!el.getContext) {
                    el.getContext = getContext;
                    addNamespacesAndStylesheet(el.ownerDocument);
                    el.innerHTML = '';
                    el.attachEvent('onpropertychange', onPropertyChange);
                    el.attachEvent('onresize', onResize);
                    var attrs = el.attributes;
                    if (attrs.width && attrs.width.specified) {
                        el.style.width = attrs.width.nodeValue + 'px';
                    } else {
                        el.width = el.clientWidth;
                    }
                    if (attrs.height && attrs.height.specified) {
                        el.style.height = attrs.height.nodeValue + 'px';
                    } else {
                        el.height = el.clientHeight;
                    }
                }
                return el;
            }
        };

        function onPropertyChange(e) {
            var el = e.srcElement;
            switch (e.propertyName) {
                case 'width':
                    el.getContext().clearRect();
                    el.style.width = el.attributes.width.nodeValue + 'px';
                    el.firstChild.style.width = el.clientWidth + 'px';
                    break;
                case 'height':
                    el.getContext().clearRect();
                    el.style.height = el.attributes.height.nodeValue + 'px';
                    el.firstChild.style.height = el.clientHeight + 'px';
                    break;
            }
        }

        function onResize(e) {
            var el = e.srcElement;
            if (el.firstChild) {
                el.firstChild.style.width = el.clientWidth + 'px';
                el.firstChild.style.height = el.clientHeight + 'px';
            }
        }
        G_vmlCanvasManager_.init();
        var decToHex = [];
        for (var i = 0; i < 16; i++) {
            for (var j = 0; j < 16; j++) {
                decToHex[i * 16 + j] = i.toString(16) + j.toString(16);
            }
        }

        function createMatrixIdentity() {
            return [
                [1, 0, 0],
                [0, 1, 0],
                [0, 0, 1]
            ];
        }

        function matrixMultiply(m1, m2) {
            var result = createMatrixIdentity();
            for (var x = 0; x < 3; x++) {
                for (var y = 0; y < 3; y++) {
                    var sum = 0;
                    for (var z = 0; z < 3; z++) {
                        sum += m1[x][z] * m2[z][y];
                    }
                    result[x][y] = sum;
                }
            }
            return result;
        }

        function copyState(o1, o2) {
            o2.fillStyle = o1.fillStyle;
            o2.lineCap = o1.lineCap;
            o2.lineJoin = o1.lineJoin;
            o2.lineDash = o1.lineDash;
            o2.lineWidth = o1.lineWidth;
            o2.miterLimit = o1.miterLimit;
            o2.shadowBlur = o1.shadowBlur;
            o2.shadowColor = o1.shadowColor;
            o2.shadowOffsetX = o1.shadowOffsetX;
            o2.shadowOffsetY = o1.shadowOffsetY;
            o2.strokeStyle = o1.strokeStyle;
            o2.globalAlpha = o1.globalAlpha;
            o2.font = o1.font;
            o2.textAlign = o1.textAlign;
            o2.textBaseline = o1.textBaseline;
            o2.arcScaleX_ = o1.arcScaleX_;
            o2.arcScaleY_ = o1.arcScaleY_;
            o2.lineScale_ = o1.lineScale_;
        }
        var colorData = {
            aliceblue: '#F0F8FF',
            antiquewhite: '#FAEBD7',
            aquamarine: '#7FFFD4',
            azure: '#F0FFFF',
            beige: '#F5F5DC',
            bisque: '#FFE4C4',
            black: '#000000',
            blanchedalmond: '#FFEBCD',
            blueviolet: '#8A2BE2',
            brown: '#A52A2A',
            burlywood: '#DEB887',
            cadetblue: '#5F9EA0',
            chartreuse: '#7FFF00',
            chocolate: '#D2691E',
            coral: '#FF7F50',
            cornflowerblue: '#6495ED',
            cornsilk: '#FFF8DC',
            crimson: '#DC143C',
            cyan: '#00FFFF',
            darkblue: '#00008B',
            darkcyan: '#008B8B',
            darkgoldenrod: '#B8860B',
            darkgray: '#A9A9A9',
            darkgreen: '#006400',
            darkgrey: '#A9A9A9',
            darkkhaki: '#BDB76B',
            darkmagenta: '#8B008B',
            darkolivegreen: '#556B2F',
            darkorange: '#FF8C00',
            darkorchid: '#9932CC',
            darkred: '#8B0000',
            darksalmon: '#E9967A',
            darkseagreen: '#8FBC8F',
            darkslateblue: '#483D8B',
            darkslategray: '#2F4F4F',
            darkslategrey: '#2F4F4F',
            darkturquoise: '#00CED1',
            darkviolet: '#9400D3',
            deeppink: '#FF1493',
            deepskyblue: '#00BFFF',
            dimgray: '#696969',
            dimgrey: '#696969',
            dodgerblue: '#1E90FF',
            firebrick: '#B22222',
            floralwhite: '#FFFAF0',
            forestgreen: '#228B22',
            gainsboro: '#DCDCDC',
            ghostwhite: '#F8F8FF',
            gold: '#FFD700',
            goldenrod: '#DAA520',
            grey: '#808080',
            greenyellow: '#ADFF2F',
            honeydew: '#F0FFF0',
            hotpink: '#FF69B4',
            indianred: '#CD5C5C',
            indigo: '#4B0082',
            ivory: '#FFFFF0',
            khaki: '#F0E68C',
            lavender: '#E6E6FA',
            lavenderblush: '#FFF0F5',
            lawngreen: '#7CFC00',
            lemonchiffon: '#FFFACD',
            lightblue: '#ADD8E6',
            lightcoral: '#F08080',
            lightcyan: '#E0FFFF',
            lightgoldenrodyellow: '#FAFAD2',
            lightgreen: '#90EE90',
            lightgrey: '#D3D3D3',
            lightpink: '#FFB6C1',
            lightsalmon: '#FFA07A',
            lightseagreen: '#20B2AA',
            lightskyblue: '#87CEFA',
            lightslategray: '#778899',
            lightslategrey: '#778899',
            lightsteelblue: '#B0C4DE',
            lightyellow: '#FFFFE0',
            limegreen: '#32CD32',
            linen: '#FAF0E6',
            magenta: '#FF00FF',
            mediumaquamarine: '#66CDAA',
            mediumblue: '#0000CD',
            mediumorchid: '#BA55D3',
            mediumpurple: '#9370DB',
            mediumseagreen: '#3CB371',
            mediumslateblue: '#7B68EE',
            mediumspringgreen: '#00FA9A',
            mediumturquoise: '#48D1CC',
            mediumvioletred: '#C71585',
            midnightblue: '#191970',
            mintcream: '#F5FFFA',
            mistyrose: '#FFE4E1',
            moccasin: '#FFE4B5',
            navajowhite: '#FFDEAD',
            oldlace: '#FDF5E6',
            olivedrab: '#6B8E23',
            orange: '#FFA500',
            orangered: '#FF4500',
            orchid: '#DA70D6',
            palegoldenrod: '#EEE8AA',
            palegreen: '#98FB98',
            paleturquoise: '#AFEEEE',
            palevioletred: '#DB7093',
            papayawhip: '#FFEFD5',
            peachpuff: '#FFDAB9',
            peru: '#CD853F',
            pink: '#FFC0CB',
            plum: '#DDA0DD',
            powderblue: '#B0E0E6',
            rosybrown: '#BC8F8F',
            royalblue: '#4169E1',
            saddlebrown: '#8B4513',
            salmon: '#FA8072',
            sandybrown: '#F4A460',
            seagreen: '#2E8B57',
            seashell: '#FFF5EE',
            sienna: '#A0522D',
            skyblue: '#87CEEB',
            slateblue: '#6A5ACD',
            slategray: '#708090',
            slategrey: '#708090',
            snow: '#FFFAFA',
            springgreen: '#00FF7F',
            steelblue: '#4682B4',
            tan: '#D2B48C',
            thistle: '#D8BFD8',
            tomato: '#FF6347',
            turquoise: '#40E0D0',
            violet: '#EE82EE',
            wheat: '#F5DEB3',
            whitesmoke: '#F5F5F5',
            yellowgreen: '#9ACD32'
        };

        function getRgbHslContent(styleString) {
            var start = styleString.indexOf('(', 3);
            var end = styleString.indexOf(')', start + 1);
            var parts = styleString.substring(start + 1, end).split(',');
            if (parts.length != 4 || styleString.charAt(3) != 'a') {
                parts[3] = 1;
            }
            return parts;
        }

        function percent(s) {
            return parseFloat(s) / 100;
        }

        function clamp(v, min, max) {
            return Math.min(max, Math.max(min, v));
        }

        function hslToRgb(parts) {
            var r, g, b, h, s, l;
            h = parseFloat(parts[0]) / 360 % 360;
            if (h < 0) {
                h++;
            }
            s = clamp(percent(parts[1]), 0, 1);
            l = clamp(percent(parts[2]), 0, 1);
            if (s == 0) {
                r = g = b = l;
            } else {
                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                r = hueToRgb(p, q, h + 1 / 3);
                g = hueToRgb(p, q, h);
                b = hueToRgb(p, q, h - 1 / 3);
            }
            return '#' + decToHex[Math.floor(r * 255)] + decToHex[Math.floor(g * 255)] + decToHex[Math.floor(b * 255)];
        }

        function hueToRgb(m1, m2, h) {
            if (h < 0) {
                h++;
            }
            if (h > 1) {
                h--;
            }
            if (6 * h < 1) {
                return m1 + (m2 - m1) * 6 * h;
            } else {
                if (2 * h < 1) {
                    return m2;
                } else {
                    if (3 * h < 2) {
                        return m1 + (m2 - m1) * (2 / 3 - h) * 6;
                    } else {
                        return m1;
                    }
                }
            }
        }
        var processStyleCache = {};

        function processStyle(styleString) {
            if (styleString in processStyleCache) {
                return processStyleCache[styleString];
            }
            var str, alpha = 1;
            styleString = String(styleString);
            if (styleString.charAt(0) == '#') {
                str = styleString;
            } else {
                if (/^rgb/.test(styleString)) {
                    var parts = getRgbHslContent(styleString);
                    var str = '#',
                        n;
                    for (var i = 0; i < 3; i++) {
                        if (parts[i].indexOf('%') != -1) {
                            n = Math.floor(percent(parts[i]) * 255);
                        } else {
                            n = +parts[i];
                        }
                        str += decToHex[clamp(n, 0, 255)];
                    }
                    alpha = +parts[3];
                } else {
                    if (/^hsl/.test(styleString)) {
                        var parts = getRgbHslContent(styleString);
                        str = hslToRgb(parts);
                        alpha = parts[3];
                    } else {
                        str = colorData[styleString] || styleString;
                    }
                }
            }
            return processStyleCache[styleString] = { color: str, alpha: alpha };
        }
        var DEFAULT_STYLE = { style: 'normal', variant: 'normal', weight: 'normal', size: 10, family: 'sans-serif' };
        var fontStyleCache = {};

        function processFontStyle(styleString) {
            if (fontStyleCache[styleString]) {
                return fontStyleCache[styleString];
            }
            var el = document.createElement('div');
            var style = el.style;
            try {
                style.font = styleString;
            } catch (ex) {}
            return fontStyleCache[styleString] = { style: style.fontStyle || DEFAULT_STYLE.style, variant: style.fontVariant || DEFAULT_STYLE.variant, weight: style.fontWeight || DEFAULT_STYLE.weight, size: style.fontSize || DEFAULT_STYLE.size, family: style.fontFamily || DEFAULT_STYLE.family };
        }

        function getComputedStyle(style, element) {
            var computedStyle = {};
            for (var p in style) {
                computedStyle[p] = style[p];
            }
            var canvasFontSize = parseFloat(element.currentStyle.fontSize),
                fontSize = parseFloat(style.size);
            if (typeof style.size == 'number') {
                computedStyle.size = style.size;
            } else {
                if (style.size.indexOf('px') != -1) {
                    computedStyle.size = fontSize;
                } else {
                    if (style.size.indexOf('em') != -1) {
                        computedStyle.size = canvasFontSize * fontSize;
                    } else {
                        if (style.size.indexOf('%') != -1) {
                            computedStyle.size = canvasFontSize / 100 * fontSize;
                        } else {
                            if (style.size.indexOf('pt') != -1) {
                                computedStyle.size = fontSize / 0.75;
                            } else {
                                computedStyle.size = canvasFontSize;
                            }
                        }
                    }
                }
            }
            computedStyle.size *= 0.981;
            return computedStyle;
        }

        function buildStyle(style) {
            return style.style + ' ' + style.variant + ' ' + style.weight + ' ' + style.size + 'px ' + style.family;
        }
        var lineCapMap = { 'butt': 'flat', 'round': 'round' };

        function processLineCap(lineCap) {
            return lineCapMap[lineCap] || 'square';
        }

        function CanvasRenderingContext2D_(canvasElement) {
            this.m_ = createMatrixIdentity();
            this.mStack_ = [];
            this.aStack_ = [];
            this.currentPath_ = [];
            this.strokeStyle = '#000';
            this.fillStyle = '#000';
            this.lineWidth = 1;
            this.lineJoin = 'miter';
            this.lineDash = [];
            this.lineCap = 'butt';
            this.miterLimit = Z * 1;
            this.globalAlpha = 1;
            this.font = '10px sans-serif';
            this.textAlign = 'left';
            this.textBaseline = 'alphabetic';
            this.canvas = canvasElement;
            var cssText = 'width:' + canvasElement.clientWidth + 'px;height:' + canvasElement.clientHeight + 'px;overflow:hidden;position:absolute';
            var el = canvasElement.ownerDocument.createElement('div');
            el.style.cssText = cssText;
            canvasElement.appendChild(el);
            var overlayEl = el.cloneNode(false);
            overlayEl.style.backgroundColor = 'red';
            overlayEl.style.filter = 'alpha(opacity\x3d0)';
            canvasElement.appendChild(overlayEl);
            this.element_ = el;
            this.arcScaleX_ = 1;
            this.arcScaleY_ = 1;
            this.lineScale_ = 1;
        }
        var contextPrototype = CanvasRenderingContext2D_.prototype;
        contextPrototype.clearRect = function() {
            if (this.textMeasureEl_) {
                this.textMeasureEl_.removeNode(true);
                this.textMeasureEl_ = null;
            }
            this.element_.innerHTML = '';
        };
        contextPrototype.beginPath = function() {
            this.currentPath_ = [];
        };
        contextPrototype.moveTo = function(aX, aY) {
            var p = getCoords(this, aX, aY);
            this.currentPath_.push({ type: 'moveTo', x: p.x, y: p.y });
            this.currentX_ = p.x;
            this.currentY_ = p.y;
        };
        contextPrototype.lineTo = function(aX, aY) {
            var p = getCoords(this, aX, aY);
            this.currentPath_.push({ type: 'lineTo', x: p.x, y: p.y });
            this.currentX_ = p.x;
            this.currentY_ = p.y;
        };
        contextPrototype.bezierCurveTo = function(aCP1x, aCP1y, aCP2x, aCP2y, aX, aY) {
            var p = getCoords(this, aX, aY);
            var cp1 = getCoords(this, aCP1x, aCP1y);
            var cp2 = getCoords(this, aCP2x, aCP2y);
            bezierCurveTo(this, cp1, cp2, p);
        };

        function bezierCurveTo(self, cp1, cp2, p) {
            self.currentPath_.push({ type: 'bezierCurveTo', cp1x: cp1.x, cp1y: cp1.y, cp2x: cp2.x, cp2y: cp2.y, x: p.x, y: p.y });
            self.currentX_ = p.x;
            self.currentY_ = p.y;
        }
        contextPrototype.quadraticCurveTo = function(aCPx, aCPy, aX, aY) {
            var cp = getCoords(this, aCPx, aCPy);
            var p = getCoords(this, aX, aY);
            var cp1 = { x: this.currentX_ + 2 / 3 * (cp.x - this.currentX_), y: this.currentY_ + 2 / 3 * (cp.y - this.currentY_) };
            var cp2 = { x: cp1.x + (p.x - this.currentX_) / 3, y: cp1.y + (p.y - this.currentY_) / 3 };
            bezierCurveTo(this, cp1, cp2, p);
        };
        contextPrototype.arc = function(aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise) {
            aRadius *= Z;
            var arcType = aClockwise ? 'at' : 'wa';
            var xStart = aX + mc(aStartAngle) * aRadius - Z2;
            var yStart = aY + ms(aStartAngle) * aRadius - Z2;
            var xEnd = aX + mc(aEndAngle) * aRadius - Z2;
            var yEnd = aY + ms(aEndAngle) * aRadius - Z2;
            if (xStart == xEnd && !aClockwise) {
                xStart += 0.125;
            }
            var p = getCoords(this, aX, aY);
            var pStart = getCoords(this, xStart, yStart);
            var pEnd = getCoords(this, xEnd, yEnd);
            this.currentPath_.push({ type: arcType, x: p.x, y: p.y, radius: aRadius, xStart: pStart.x, yStart: pStart.y, xEnd: pEnd.x, yEnd: pEnd.y });
        };
        contextPrototype.rect = function(aX, aY, aWidth, aHeight) {
            this.moveTo(aX, aY);
            this.lineTo(aX + aWidth, aY);
            this.lineTo(aX + aWidth, aY + aHeight);
            this.lineTo(aX, aY + aHeight);
            this.closePath();
        };
        contextPrototype.strokeRect = function(aX, aY, aWidth, aHeight) {
            var oldPath = this.currentPath_;
            this.beginPath();
            this.moveTo(aX, aY);
            this.lineTo(aX + aWidth, aY);
            this.lineTo(aX + aWidth, aY + aHeight);
            this.lineTo(aX, aY + aHeight);
            this.closePath();
            this.stroke();
            this.currentPath_ = oldPath;
        };
        contextPrototype.fillRect = function(aX, aY, aWidth, aHeight) {
            var oldPath = this.currentPath_;
            this.beginPath();
            this.moveTo(aX, aY);
            this.lineTo(aX + aWidth, aY);
            this.lineTo(aX + aWidth, aY + aHeight);
            this.lineTo(aX, aY + aHeight);
            this.closePath();
            this.fill();
            this.currentPath_ = oldPath;
        };
        contextPrototype.createLinearGradient = function(aX0, aY0, aX1, aY1) {
            var gradient = new CanvasGradient_('gradient');
            gradient.x0_ = aX0;
            gradient.y0_ = aY0;
            gradient.x1_ = aX1;
            gradient.y1_ = aY1;
            return gradient;
        };
        contextPrototype.createRadialGradient = function(aX0, aY0, aR0, aX1, aY1, aR1) {
            var gradient = new CanvasGradient_('gradientradial');
            gradient.x0_ = aX0;
            gradient.y0_ = aY0;
            gradient.r0_ = aR0;
            gradient.x1_ = aX1;
            gradient.y1_ = aY1;
            gradient.r1_ = aR1;
            return gradient;
        };
        contextPrototype.drawImage = function(image, var_args) {
            var dx, dy, dw, dh, sx, sy, sw, sh;
            var oldRuntimeWidth = image.runtimeStyle.width;
            var oldRuntimeHeight = image.runtimeStyle.height;
            image.runtimeStyle.width = 'auto';
            image.runtimeStyle.height = 'auto';
            var w = image.width;
            var h = image.height;
            image.runtimeStyle.width = oldRuntimeWidth;
            image.runtimeStyle.height = oldRuntimeHeight;
            if (arguments.length == 3) {
                dx = arguments[1];
                dy = arguments[2];
                sx = sy = 0;
                sw = dw = w;
                sh = dh = h;
            } else {
                if (arguments.length == 5) {
                    dx = arguments[1];
                    dy = arguments[2];
                    dw = arguments[3];
                    dh = arguments[4];
                    sx = sy = 0;
                    sw = w;
                    sh = h;
                } else {
                    if (arguments.length == 9) {
                        sx = arguments[1];
                        sy = arguments[2];
                        sw = arguments[3];
                        sh = arguments[4];
                        dx = arguments[5];
                        dy = arguments[6];
                        dw = arguments[7];
                        dh = arguments[8];
                    } else {
                        throw Error('Invalid number of arguments');
                    }
                }
            }
            var d = getCoords(this, dx, dy);
            var vmlStr = [];
            var W = 10;
            var H = 10;
            var m = this.m_;
            vmlStr.push(' \x3cg_vml_:group', ' coordsize\x3d"', Z * W, ',', Z * H, '"', ' coordorigin\x3d"0,0"', ' style\x3d"width:', mr(W * m[0][0]), 'px;height:', mr(H * m[1][1]), 'px;position:absolute;', 'top:', mr(d.y / Z), 'px;left:', mr(d.x / Z), 'px; rotation:', mr(Math.atan(m[0][1] / m[1][1]) * 180 / Math.PI), ';');
            vmlStr.push('" \x3e', '\x3cg_vml_:image src\x3d"', image.src, '"', ' style\x3d"width:', Z * dw, 'px;', ' height:', Z * dh, 'px"', ' cropleft\x3d"', sx / w, '"', ' croptop\x3d"', sy / h, '"', ' cropright\x3d"', (w - sx - sw) / w, '"', ' cropbottom\x3d"', (h - sy - sh) / h, '"', ' /\x3e', '\x3c/g_vml_:group\x3e');
            this.element_.insertAdjacentHTML('BeforeEnd', vmlStr.join(''));
        };
        contextPrototype.setLineDash = function(lineDash) {
            if (lineDash.length === 1) {
                lineDash = lineDash.slice();
                lineDash[1] = lineDash[0];
            }
            this.lineDash = lineDash;
        };
        contextPrototype.getLineDash = function() {
            return this.lineDash;
        };
        contextPrototype.stroke = function(aFill) {
            var lineStr = [];
            var W = 10;
            var H = 10;
            lineStr.push('\x3cg_vml_:shape', ' filled\x3d"', !!aFill, '"', ' style\x3d"position:absolute;width:', W, 'px;height:', H, 'px;left:0px;top:0px;"', ' coordorigin\x3d"0,0"', ' coordsize\x3d"', Z * W, ',', Z * H, '"', ' stroked\x3d"', !aFill, '"', ' path\x3d"');
            var min = { x: null, y: null };
            var max = { x: null, y: null };
            for (var i = 0; i < this.currentPath_.length; i++) {
                var p = this.currentPath_[i];
                var c;
                switch (p.type) {
                    case 'moveTo':
                        c = p;
                        lineStr.push(' m ', mr(p.x), ',', mr(p.y));
                        break;
                    case 'lineTo':
                        lineStr.push(' l ', mr(p.x), ',', mr(p.y));
                        break;
                    case 'close':
                        lineStr.push(' x ');
                        p = null;
                        break;
                    case 'bezierCurveTo':
                        lineStr.push(' c ', mr(p.cp1x), ',', mr(p.cp1y), ',', mr(p.cp2x), ',', mr(p.cp2y), ',', mr(p.x), ',', mr(p.y));
                        break;
                    case 'at':
                    case 'wa':
                        lineStr.push(' ', p.type, ' ', mr(p.x - this.arcScaleX_ * p.radius), ',', mr(p.y - this.arcScaleY_ * p.radius), ' ', mr(p.x + this.arcScaleX_ * p.radius), ',', mr(p.y + this.arcScaleY_ * p.radius), ' ', mr(p.xStart), ',', mr(p.yStart), ' ', mr(p.xEnd), ',', mr(p.yEnd));
                        break;
                }
                if (p) {
                    if (min.x == null || p.x < min.x) {
                        min.x = p.x;
                    }
                    if (max.x == null || p.x > max.x) {
                        max.x = p.x;
                    }
                    if (min.y == null || p.y < min.y) {
                        min.y = p.y;
                    }
                    if (max.y == null || p.y > max.y) {
                        max.y = p.y;
                    }
                }
            }
            lineStr.push(' "\x3e');
            if (!aFill) {
                appendStroke(this, lineStr);
            } else {
                appendFill(this, lineStr, min, max);
            }
            lineStr.push('\x3c/g_vml_:shape\x3e');
            this.element_.insertAdjacentHTML('beforeEnd', lineStr.join(''));
        };

        function appendStroke(ctx, lineStr) {
            var a = processStyle(ctx.strokeStyle);
            var color = a.color;
            var opacity = a.alpha * ctx.globalAlpha;
            var lineWidth = ctx.lineScale_ * ctx.lineWidth;
            if (lineWidth < 1) {
                opacity *= lineWidth;
            }
            lineStr.push('\x3cg_vml_:stroke', ' opacity\x3d"', opacity, '"', ' joinstyle\x3d"', ctx.lineJoin, '"', ' dashstyle\x3d"', ctx.lineDash.join(' '), '"', ' miterlimit\x3d"', ctx.miterLimit, '"', ' endcap\x3d"', processLineCap(ctx.lineCap), '"', ' weight\x3d"', lineWidth, 'px"', ' color\x3d"', color, '" /\x3e');
        }

        function appendFill(ctx, lineStr, min, max) {
            var fillStyle = ctx.fillStyle;
            var arcScaleX = ctx.arcScaleX_;
            var arcScaleY = ctx.arcScaleY_;
            var width = max.x - min.x;
            var height = max.y - min.y;
            if (fillStyle instanceof CanvasGradient_) {
                var angle = 0;
                var focus = { x: 0, y: 0 };
                var shift = 0;
                var expansion = 1;
                if (fillStyle.type_ == 'gradient') {
                    var x0 = fillStyle.x0_ / arcScaleX;
                    var y0 = fillStyle.y0_ / arcScaleY;
                    var x1 = fillStyle.x1_ / arcScaleX;
                    var y1 = fillStyle.y1_ / arcScaleY;
                    var p0 = getCoords(ctx, x0, y0);
                    var p1 = getCoords(ctx, x1, y1);
                    var dx = p1.x - p0.x;
                    var dy = p1.y - p0.y;
                    angle = Math.atan2(dx, dy) * 180 / Math.PI;
                    if (angle < 0) {
                        angle += 360;
                    }
                    if (angle < 1.0E-6) {
                        angle = 0;
                    }
                } else {
                    var p0 = getCoords(ctx, fillStyle.x0_, fillStyle.y0_);
                    focus = { x: (p0.x - min.x) / width, y: (p0.y - min.y) / height };
                    width /= arcScaleX * Z;
                    height /= arcScaleY * Z;
                    var dimension = m.max(width, height);
                    shift = 2 * fillStyle.r0_ / dimension;
                    expansion = 2 * fillStyle.r1_ / dimension - shift;
                }
                var stops = fillStyle.colors_;
                stops.sort(function(cs1, cs2) {
                    return cs1.offset - cs2.offset;
                });
                var length = stops.length;
                var color1 = stops[0].color;
                var color2 = stops[length - 1].color;
                var opacity1 = stops[0].alpha * ctx.globalAlpha;
                var opacity2 = stops[length - 1].alpha * ctx.globalAlpha;
                var colors = [];
                for (var i = 0; i < length; i++) {
                    var stop = stops[i];
                    colors.push(stop.offset * expansion + shift + ' ' + stop.color);
                }
                lineStr.push('\x3cg_vml_:fill type\x3d"', fillStyle.type_, '"', ' method\x3d"none" focus\x3d"100%"', ' color\x3d"', color1, '"', ' color2\x3d"', color2, '"', ' colors\x3d"', colors.join(','), '"', ' opacity\x3d"', opacity2, '"', ' g_o_:opacity2\x3d"', opacity1, '"', ' angle\x3d"', angle, '"', ' focusposition\x3d"', focus.x, ',', focus.y, '" /\x3e');
            } else {
                if (fillStyle instanceof CanvasPattern_) {
                    if (width && height) {
                        var deltaLeft = -min.x;
                        var deltaTop = -min.y;
                        lineStr.push('\x3cg_vml_:fill', ' position\x3d"', deltaLeft / width * arcScaleX * arcScaleX, ',', deltaTop / height * arcScaleY * arcScaleY, '"', ' type\x3d"tile"', ' src\x3d"', fillStyle.src_, '" /\x3e');
                    }
                } else {
                    var a = processStyle(ctx.fillStyle);
                    var color = a.color;
                    var opacity = a.alpha * ctx.globalAlpha;
                    lineStr.push('\x3cg_vml_:fill color\x3d"', color, '" opacity\x3d"', opacity, '" /\x3e');
                }
            }
        }
        contextPrototype.fill = function() {
            this.$stroke(true);
        };
        contextPrototype.closePath = function() {
            this.currentPath_.push({ type: 'close' });
        };

        function getCoords(ctx, aX, aY) {
            var m = ctx.m_;
            return { x: Z * (aX * m[0][0] + aY * m[1][0] + m[2][0]) - Z2, y: Z * (aX * m[0][1] + aY * m[1][1] + m[2][1]) - Z2 };
        }
        contextPrototype.save = function() {
            var o = {};
            copyState(this, o);
            this.aStack_.push(o);
            this.mStack_.push(this.m_);
        };
        contextPrototype.restore = function() {
            if (this.aStack_.length) {
                copyState(this.aStack_.pop(), this);
                this.m_ = this.mStack_.pop();
            }
        };

        function matrixIsFinite(m) {
            return isFinite(m[0][0]) && isFinite(m[0][1]) && isFinite(m[1][0]) && isFinite(m[1][1]) && isFinite(m[2][0]) && isFinite(m[2][1]);
        }

        function setM(ctx, m, updateLineScale) {
            if (!matrixIsFinite(m)) {
                return;
            }
            ctx.m_ = m;
            if (updateLineScale) {
                var det = m[0][0] * m[1][1] - m[0][1] * m[1][0];
                ctx.lineScale_ = sqrt(abs(det));
            }
        }
        contextPrototype.translate = function(aX, aY) {
            var m1 = [
                [1, 0, 0],
                [0, 1, 0],
                [aX, aY, 1]
            ];
            setM(this, matrixMultiply(m1, this.m_), false);
        };
        contextPrototype.rotate = function(aRot) {
            var c = mc(aRot);
            var s = ms(aRot);
            var m1 = [
                [c, s, 0],
                [-s, c, 0],
                [0, 0, 1]
            ];
            setM(this, matrixMultiply(m1, this.m_), false);
        };
        contextPrototype.scale = function(aX, aY) {
            this.arcScaleX_ *= aX;
            this.arcScaleY_ *= aY;
            var m1 = [
                [aX, 0, 0],
                [0, aY, 0],
                [0, 0, 1]
            ];
            setM(this, matrixMultiply(m1, this.m_), true);
        };
        contextPrototype.transform = function(m11, m12, m21, m22, dx, dy) {
            var m1 = [
                [m11, m12, 0],
                [m21, m22, 0],
                [dx, dy, 1]
            ];
            setM(this, matrixMultiply(m1, this.m_), true);
        };
        contextPrototype.setTransform = function(m11, m12, m21, m22, dx, dy) {
            var m = [
                [m11, m12, 0],
                [m21, m22, 0],
                [dx, dy, 1]
            ];
            setM(this, m, true);
        };
        contextPrototype.drawText_ = function(text, x, y, maxWidth, stroke) {
            var m = this.m_,
                delta = 1000,
                left = 0,
                right = delta,
                offset = { x: 0, y: 0 },
                lineStr = [];
            var fontStyle = getComputedStyle(processFontStyle(this.font), this.element_);
            var fontStyleString = buildStyle(fontStyle);
            var elementStyle = this.element_.currentStyle;
            var textAlign = this.textAlign.toLowerCase();
            switch (textAlign) {
                case 'left':
                case 'center':
                case 'right':
                    break;
                case 'end':
                    textAlign = elementStyle.direction == 'ltr' ? 'right' : 'left';
                    break;
                case 'start':
                    textAlign = elementStyle.direction == 'rtl' ? 'right' : 'left';
                    break;
                default:
                    textAlign = 'left';
            }
            switch (this.textBaseline) {
                case 'hanging':
                case 'top':
                    offset.y = fontStyle.size / 1.75;
                    break;
                case 'middle':
                    break;
                default:
                case null:
                case 'alphabetic':
                case 'ideographic':
                case 'bottom':
                    offset.y = -fontStyle.size / 3;
                    break;
            }
            switch (textAlign) {
                case 'right':
                    left = delta;
                    right = 0.05;
                    break;
                case 'center':
                    left = right = delta / 2;
                    break;
            }
            var d = getCoords(this, x + offset.x, y + offset.y);
            lineStr.push('\x3cg_vml_:line from\x3d"', -left, ' 0" to\x3d"', right, ' 0.05" ', ' coordsize\x3d"100 100" coordorigin\x3d"0 0"', ' filled\x3d"', !stroke, '" stroked\x3d"', !!stroke, '" style\x3d"position:absolute;width:1px;height:1px;left:0px;top:0px;"\x3e');
            if (stroke) {
                appendStroke(this, lineStr);
            } else {
                appendFill(this, lineStr, { x: -left, y: 0 }, { x: right, y: fontStyle.size });
            }
            var skewM = m[0][0].toFixed(3) + ',' + m[1][0].toFixed(3) + ',' + m[0][1].toFixed(3) + ',' + m[1][1].toFixed(3) + ',0,0';
            var skewOffset = mr(d.x / Z) + ',' + mr(d.y / Z);
            lineStr.push('\x3cg_vml_:skew on\x3d"t" matrix\x3d"', skewM, '" ', ' offset\x3d"', skewOffset, '" origin\x3d"', left, ' 0" /\x3e', '\x3cg_vml_:path textpathok\x3d"true" /\x3e', '\x3cg_vml_:textpath on\x3d"true" string\x3d"', encodeHtmlAttribute(text), '" style\x3d"v-text-align:', textAlign, ';font:', encodeHtmlAttribute(fontStyleString), '" /\x3e\x3c/g_vml_:line\x3e');
            this.element_.insertAdjacentHTML('beforeEnd', lineStr.join(''));
        };
        contextPrototype.fillText = function(text, x, y, maxWidth) {
            this.drawText_(text, x, y, maxWidth, false);
        };
        contextPrototype.strokeText = function(text, x, y, maxWidth) {
            this.drawText_(text, x, y, maxWidth, true);
        };
        contextPrototype.measureText = function(text) {
            if (!this.textMeasureEl_) {
                var s = '\x3cspan style\x3d"position:absolute;' + 'top:-20000px;left:0;padding:0;margin:0;border:none;' + 'white-space:pre;"\x3e\x3c/span\x3e';
                this.element_.insertAdjacentHTML('beforeEnd', s);
                this.textMeasureEl_ = this.element_.lastChild;
            }
            var doc = this.element_.ownerDocument;
            this.textMeasureEl_.innerHTML = '';
            this.textMeasureEl_.style.font = this.font;
            this.textMeasureEl_.appendChild(doc.createTextNode(text));
            return { width: this.textMeasureEl_.offsetWidth };
        };
        contextPrototype.clip = function() {};
        contextPrototype.arcTo = function() {};
        contextPrototype.createPattern = function(image, repetition) {
            return new CanvasPattern_(image, repetition);
        };

        function CanvasGradient_(aType) {
            this.type_ = aType;
            this.x0_ = 0;
            this.y0_ = 0;
            this.r0_ = 0;
            this.x1_ = 0;
            this.y1_ = 0;
            this.r1_ = 0;
            this.colors_ = [];
        }
        CanvasGradient_.prototype.addColorStop = function(aOffset, aColor) {
            aColor = processStyle(aColor);
            this.colors_.push({ offset: aOffset, color: aColor.color, alpha: aColor.alpha });
        };

        function CanvasPattern_(image, repetition) {
            assertImageIsValid(image);
            switch (repetition) {
                case 'repeat':
                case null:
                case '':
                    this.repetition_ = 'repeat';
                    break;
                case 'repeat-x':
                case 'repeat-y':
                case 'no-repeat':
                    this.repetition_ = repetition;
                    break;
                default:
                    throwException('SYNTAX_ERR');
            }
            this.src_ = image.src;
            this.width_ = image.width;
            this.height_ = image.height;
        }

        function throwException(s) {
            throw new DOMException_(s);
        }

        function assertImageIsValid(img) {
            if (!img || img.nodeType != 1 || img.tagName != 'IMG') {
                throwException('TYPE_MISMATCH_ERR');
            }
            if (img.readyState != 'complete') {
                throwException('INVALID_STATE_ERR');
            }
        }

        function DOMException_(s) {
            this.code = this[s];
            this.message = s + ': DOM Exception ' + this.code;
        }
        var p = DOMException_.prototype = new Error;
        p.INDEX_SIZE_ERR = 1;
        p.DOMSTRING_SIZE_ERR = 2;
        p.HIERARCHY_REQUEST_ERR = 3;
        p.WRONG_DOCUMENT_ERR = 4;
        p.INVALID_CHARACTER_ERR = 5;
        p.NO_DATA_ALLOWED_ERR = 6;
        p.NO_MODIFICATION_ALLOWED_ERR = 7;
        p.NOT_FOUND_ERR = 8;
        p.NOT_SUPPORTED_ERR = 9;
        p.INUSE_ATTRIBUTE_ERR = 10;
        p.INVALID_STATE_ERR = 11;
        p.SYNTAX_ERR = 12;
        p.INVALID_MODIFICATION_ERR = 13;
        p.NAMESPACE_ERR = 14;
        p.INVALID_ACCESS_ERR = 15;
        p.VALIDATION_ERR = 16;
        p.TYPE_MISMATCH_ERR = 17;
        G_vmlCanvasManager = G_vmlCanvasManager_;
        CanvasRenderingContext2D = CanvasRenderingContext2D_;
        CanvasGradient = CanvasGradient_;
        CanvasPattern = CanvasPattern_;
        DOMException = DOMException_;
    })();
}
Ext.define('Ext.draw.engine.Canvas', {
    extend: Ext.draw.Surface,
    isCanvas: true,
    config: { highPrecision: false },
    statics: {
        contextOverrides: {
            setGradientBBox: function(bbox) {
                this.bbox = bbox;
            },
            fill: function() {
                var fillStyle = this.fillStyle,
                    fillGradient = this.fillGradient,
                    fillOpacity = this.fillOpacity,
                    alpha = this.globalAlpha,
                    bbox = this.bbox;
                if (fillStyle !== Ext.util.Color.RGBA_NONE && fillOpacity !== 0) {
                    if (fillGradient && bbox) {
                        this.fillStyle = fillGradient.generateGradient(this, bbox);
                    }
                    if (fillOpacity !== 1) {
                        this.globalAlpha = alpha * fillOpacity;
                    }
                    this.$fill();
                    if (fillOpacity !== 1) {
                        this.globalAlpha = alpha;
                    }
                    if (fillGradient && bbox) {
                        this.fillStyle = fillStyle;
                    }
                }
            },
            stroke: function() {
                var strokeStyle = this.strokeStyle,
                    strokeGradient = this.strokeGradient,
                    strokeOpacity = this.strokeOpacity,
                    alpha = this.globalAlpha,
                    bbox = this.bbox;
                if (strokeStyle !== Ext.util.Color.RGBA_NONE && strokeOpacity !== 0) {
                    if (strokeGradient && bbox) {
                        this.strokeStyle = strokeGradient.generateGradient(this, bbox);
                    }
                    if (strokeOpacity !== 1) {
                        this.globalAlpha = alpha * strokeOpacity;
                    }
                    this.$stroke();
                    if (strokeOpacity !== 1) {
                        this.globalAlpha = alpha;
                    }
                    if (strokeGradient && bbox) {
                        this.strokeStyle = strokeStyle;
                    }
                }
            },
            fillStroke: function(attr, transformFillStroke) {
                var ctx = this,
                    fillStyle = this.fillStyle,
                    fillOpacity = this.fillOpacity,
                    strokeStyle = this.strokeStyle,
                    strokeOpacity = this.strokeOpacity,
                    shadowColor = ctx.shadowColor,
                    shadowBlur = ctx.shadowBlur,
                    none = Ext.util.Color.RGBA_NONE;
                if (transformFillStroke === undefined) {
                    transformFillStroke = attr.transformFillStroke;
                }
                if (!transformFillStroke) {
                    attr.inverseMatrix.toContext(ctx);
                }
                if (fillStyle !== none && fillOpacity !== 0) {
                    ctx.fill();
                    ctx.shadowColor = none;
                    ctx.shadowBlur = 0;
                }
                if (strokeStyle !== none && strokeOpacity !== 0) {
                    ctx.stroke();
                }
                ctx.shadowColor = shadowColor;
                ctx.shadowBlur = shadowBlur;
            },
            setLineDash: function(dashList) {
                if (this.$setLineDash) {
                    this.$setLineDash(dashList);
                }
            },
            getLineDash: function() {
                if (this.$getLineDash) {
                    return this.$getLineDash();
                }
            },
            ellipse: function(cx, cy, rx, ry, rotation, start, end, anticlockwise) {
                var cos = Math.cos(rotation),
                    sin = Math.sin(rotation);
                this.transform(cos * rx, sin * rx, -sin * ry, cos * ry, cx, cy);
                this.arc(0, 0, 1, start, end, anticlockwise);
                this.transform(cos / rx, -sin / ry, sin / rx, cos / ry, -(cos * cx + sin * cy) / rx, (sin * cx - cos * cy) / ry);
            },
            appendPath: function(path) {
                var me = this,
                    i = 0,
                    j = 0,
                    commands = path.commands,
                    params = path.params,
                    ln = commands.length;
                me.beginPath();
                for (; i < ln; i++) {
                    switch (commands[i]) {
                        case 'M':
                            me.moveTo(params[j], params[j + 1]);
                            j += 2;
                            break;
                        case 'L':
                            me.lineTo(params[j], params[j + 1]);
                            j += 2;
                            break;
                        case 'C':
                            me.bezierCurveTo(params[j], params[j + 1], params[j + 2], params[j + 3], params[j + 4], params[j + 5]);
                            j += 6;
                            break;
                        case 'Z':
                            me.closePath();
                            break;
                    }
                }
            },
            save: function() {
                var toSave = this.toSave,
                    ln = toSave.length,
                    obj = ln && {},
                    i = 0,
                    key;
                for (; i < ln; i++) {
                    key = toSave[i];
                    if (key in this) {
                        obj[key] = this[key];
                    }
                }
                this.state.push(obj);
                this.$save();
            },
            restore: function() {
                var obj = this.state.pop(),
                    key;
                if (obj) {
                    for (key in obj) {
                        this[key] = obj[key];
                    }
                }
                this.$restore();
            }
        }
    },
    splitThreshold: 3000,
    toSave: ['fillGradient', 'strokeGradient'],
    element: { reference: 'element', children: [{ reference: 'innerElement', style: { width: '100%', height: '100%', position: 'relative' } }] },
    createCanvas: function() {
        var canvas = Ext.Element.create({ tag: 'canvas', cls: Ext.baseCSSPrefix + 'surface-canvas' });
        if (window['G_vmlCanvasManager']) {
            G_vmlCanvasManager.initElement(canvas.dom);
            this.isVML = true;
        }
        var overrides = Ext.draw.engine.Canvas.contextOverrides,
            ctx = canvas.dom.getContext('2d'),
            name;
        if (ctx.ellipse) {
            delete overrides.ellipse;
        }
        ctx.state = [];
        ctx.toSave = this.toSave;
        for (name in overrides) {
            ctx['$' + name] = ctx[name];
        }
        Ext.apply(ctx, overrides);
        if (this.getHighPrecision()) {
            this.enablePrecisionCompensation(ctx);
        } else {
            this.disablePrecisionCompensation(ctx);
        }
        this.innerElement.appendChild(canvas);
        this.canvases.push(canvas);
        this.contexts.push(ctx);
    },
    updateHighPrecision: function(highPrecision) {
        var contexts = this.contexts,
            ln = contexts.length,
            i, context;
        for (i = 0; i < ln; i++) {
            context = contexts[i];
            if (highPrecision) {
                this.enablePrecisionCompensation(context);
            } else {
                this.disablePrecisionCompensation(context);
            }
        }
    },
    precisionNames: ['rect', 'fillRect', 'strokeRect', 'clearRect', 'moveTo', 'lineTo', 'arc', 'arcTo', 'save', 'restore', 'updatePrecisionCompensate', 'setTransform', 'transform', 'scale', 'translate', 'rotate', 'quadraticCurveTo', 'bezierCurveTo', 'createLinearGradient', 'createRadialGradient', 'fillText', 'strokeText', 'drawImage'],
    disablePrecisionCompensation: function(ctx) {
        var regularOverrides = Ext.draw.engine.Canvas.contextOverrides,
            precisionOverrides = this.precisionNames,
            ln = precisionOverrides.length,
            i, name;
        for (i = 0; i < ln; i++) {
            name = precisionOverrides[i];
            if (!(name in regularOverrides)) {
                delete ctx[name];
            }
        }
        this.setDirty(true);
    },
    enablePrecisionCompensation: function(ctx) {
        var surface = this,
            xx = 1,
            yy = 1,
            dx = 0,
            dy = 0,
            matrix = new Ext.draw.Matrix,
            transStack = [],
            comp = {},
            regularOverrides = Ext.draw.engine.Canvas.contextOverrides,
            originalCtx = ctx.constructor.prototype;
        var precisionOverrides = {
            toSave: surface.toSave,
            rect: function(x, y, w, h) {
                return originalCtx.rect.call(this, x * xx + dx, y * yy + dy, w * xx, h * yy);
            },
            fillRect: function(x, y, w, h) {
                this.updatePrecisionCompensateRect();
                originalCtx.fillRect.call(this, x * xx + dx, y * yy + dy, w * xx, h * yy);
                this.updatePrecisionCompensate();
            },
            strokeRect: function(x, y, w, h) {
                this.updatePrecisionCompensateRect();
                originalCtx.strokeRect.call(this, x * xx + dx, y * yy + dy, w * xx, h * yy);
                this.updatePrecisionCompensate();
            },
            clearRect: function(x, y, w, h) {
                return originalCtx.clearRect.call(this, x * xx + dx, y * yy + dy, w * xx, h * yy);
            },
            moveTo: function(x, y) {
                return originalCtx.moveTo.call(this, x * xx + dx, y * yy + dy);
            },
            lineTo: function(x, y) {
                return originalCtx.lineTo.call(this, x * xx + dx, y * yy + dy);
            },
            arc: function(x, y, radius, startAngle, endAngle, anticlockwise) {
                this.updatePrecisionCompensateRect();
                originalCtx.arc.call(this, x * xx + dx, y * xx + dy, radius * xx, startAngle, endAngle, anticlockwise);
                this.updatePrecisionCompensate();
            },
            arcTo: function(x1, y1, x2, y2, radius) {
                this.updatePrecisionCompensateRect();
                originalCtx.arcTo.call(this, x1 * xx + dx, y1 * yy + dy, x2 * xx + dx, y2 * yy + dy, radius * xx);
                this.updatePrecisionCompensate();
            },
            save: function() {
                transStack.push(matrix);
                matrix = matrix.clone();
                regularOverrides.save.call(this);
                originalCtx.save.call(this);
            },
            restore: function() {
                matrix = transStack.pop();
                regularOverrides.restore.call(this);
                originalCtx.restore.call(this);
                this.updatePrecisionCompensate();
            },
            updatePrecisionCompensate: function() {
                matrix.precisionCompensate(surface.devicePixelRatio, comp);
                xx = comp.xx;
                yy = comp.yy;
                dx = comp.dx;
                dy = comp.dy;
                originalCtx.setTransform.call(this, surface.devicePixelRatio, comp.b, comp.c, comp.d, 0, 0);
            },
            updatePrecisionCompensateRect: function() {
                matrix.precisionCompensateRect(surface.devicePixelRatio, comp);
                xx = comp.xx;
                yy = comp.yy;
                dx = comp.dx;
                dy = comp.dy;
                originalCtx.setTransform.call(this, surface.devicePixelRatio, comp.b, comp.c, comp.d, 0, 0);
            },
            setTransform: function(x2x, x2y, y2x, y2y, newDx, newDy) {
                matrix.set(x2x, x2y, y2x, y2y, newDx, newDy);
                this.updatePrecisionCompensate();
            },
            transform: function(x2x, x2y, y2x, y2y, newDx, newDy) {
                matrix.append(x2x, x2y, y2x, y2y, newDx, newDy);
                this.updatePrecisionCompensate();
            },
            scale: function(sx, sy) {
                this.transform(sx, 0, 0, sy, 0, 0);
            },
            translate: function(dx, dy) {
                this.transform(1, 0, 0, 1, dx, dy);
            },
            rotate: function(radians) {
                var cos = Math.cos(radians),
                    sin = Math.sin(radians);
                this.transform(cos, sin, -sin, cos, 0, 0);
            },
            quadraticCurveTo: function(cx, cy, x, y) {
                originalCtx.quadraticCurveTo.call(this, cx * xx + dx, cy * yy + dy, x * xx + dx, y * yy + dy);
            },
            bezierCurveTo: function(c1x, c1y, c2x, c2y, x, y) {
                originalCtx.bezierCurveTo.call(this, c1x * xx + dx, c1y * yy + dy, c2x * xx + dx, c2y * yy + dy, x * xx + dx, y * yy + dy);
            },
            createLinearGradient: function(x0, y0, x1, y1) {
                this.updatePrecisionCompensateRect();
                var grad = originalCtx.createLinearGradient.call(this, x0 * xx + dx, y0 * yy + dy, x1 * xx + dx, y1 * yy + dy);
                this.updatePrecisionCompensate();
                return grad;
            },
            createRadialGradient: function(x0, y0, r0, x1, y1, r1) {
                this.updatePrecisionCompensateRect();
                var grad = originalCtx.createLinearGradient.call(this, x0 * xx + dx, y0 * xx + dy, r0 * xx, x1 * xx + dx, y1 * xx + dy, r1 * xx);
                this.updatePrecisionCompensate();
                return grad;
            },
            fillText: function(text, x, y, maxWidth) {
                originalCtx.setTransform.apply(this, matrix.elements);
                if (typeof maxWidth === 'undefined') {
                    originalCtx.fillText.call(this, text, x, y);
                } else {
                    originalCtx.fillText.call(this, text, x, y, maxWidth);
                }
                this.updatePrecisionCompensate();
            },
            strokeText: function(text, x, y, maxWidth) {
                originalCtx.setTransform.apply(this, matrix.elements);
                if (typeof maxWidth === 'undefined') {
                    originalCtx.strokeText.call(this, text, x, y);
                } else {
                    originalCtx.strokeText.call(this, text, x, y, maxWidth);
                }
                this.updatePrecisionCompensate();
            },
            fill: function() {
                var fillGradient = this.fillGradient,
                    bbox = this.bbox;
                this.updatePrecisionCompensateRect();
                if (fillGradient && bbox) {
                    this.fillStyle = fillGradient.generateGradient(this, bbox);
                }
                originalCtx.fill.call(this);
                this.updatePrecisionCompensate();
            },
            stroke: function() {
                var strokeGradient = this.strokeGradient,
                    bbox = this.bbox;
                this.updatePrecisionCompensateRect();
                if (strokeGradient && bbox) {
                    this.strokeStyle = strokeGradient.generateGradient(this, bbox);
                }
                originalCtx.stroke.call(this);
                this.updatePrecisionCompensate();
            },
            drawImage: function(img_elem, arg1, arg2, arg3, arg4, dst_x, dst_y, dw, dh) {
                switch (arguments.length) {
                    case 3:
                        return originalCtx.drawImage.call(this, img_elem, arg1 * xx + dx, arg2 * yy + dy);
                    case 5:
                        return originalCtx.drawImage.call(this, img_elem, arg1 * xx + dx, arg2 * yy + dy, arg3 * xx, arg4 * yy);
                    case 9:
                        return originalCtx.drawImage.call(this, img_elem, arg1, arg2, arg3, arg4, dst_x * xx + dx, dst_y * yy * dy, dw * xx, dh * yy);
                }
            }
        };
        Ext.apply(ctx, precisionOverrides);
        this.setDirty(true);
    },
    updateRect: function(rect) {
        this.callParent([rect]);
        var me = this,
            l = Math.floor(rect[0]),
            t = Math.floor(rect[1]),
            r = Math.ceil(rect[0] + rect[2]),
            b = Math.ceil(rect[1] + rect[3]),
            devicePixelRatio = me.devicePixelRatio,
            canvases = me.canvases,
            w = r - l,
            h = b - t,
            splitThreshold = Math.round(me.splitThreshold / devicePixelRatio),
            xSplits = me.xSplits = Math.ceil(w / splitThreshold),
            ySplits = me.ySplits = Math.ceil(h / splitThreshold),
            i, j, k, offsetX, offsetY, dom, width, height;
        for (j = 0, offsetY = 0; j < ySplits; j++, offsetY += splitThreshold) {
            for (i = 0, offsetX = 0; i < xSplits; i++, offsetX += splitThreshold) {
                k = j * xSplits + i;
                if (k >= canvases.length) {
                    me.createCanvas();
                }
                dom = canvases[k].dom;
                dom.style.left = offsetX + 'px';
                dom.style.top = offsetY + 'px';
                height = Math.min(splitThreshold, h - offsetY);
                if (height * devicePixelRatio !== dom.height) {
                    dom.height = height * devicePixelRatio;
                    dom.style.height = height + 'px';
                }
                width = Math.min(splitThreshold, w - offsetX);
                if (width * devicePixelRatio !== dom.width) {
                    dom.width = width * devicePixelRatio;
                    dom.style.width = width + 'px';
                }
                me.applyDefaults(me.contexts[k]);
            }
        }
        me.activeCanvases = k = xSplits * ySplits;
        while (canvases.length > k) {
            canvases.pop().destroy();
        }
        me.clear();
    },
    clearTransform: function() {
        var me = this,
            xSplits = me.xSplits,
            ySplits = me.ySplits,
            contexts = me.contexts,
            splitThreshold = me.splitThreshold,
            devicePixelRatio = me.devicePixelRatio,
            i, j, k, ctx;
        for (i = 0; i < xSplits; i++) {
            for (j = 0; j < ySplits; j++) {
                k = j * xSplits + i;
                ctx = contexts[k];
                ctx.translate(-splitThreshold * i, -splitThreshold * j);
                ctx.scale(devicePixelRatio, devicePixelRatio);
                me.matrix.toContext(ctx);
            }
        }
    },
    renderSprite: function(sprite) {
        var me = this,
            rect = me.getRect(),
            surfaceMatrix = me.matrix,
            parent = sprite.getParent(),
            matrix = Ext.draw.Matrix.fly([1, 0, 0, 1, 0, 0]),
            splitThreshold = me.splitThreshold / me.devicePixelRatio,
            xSplits = me.xSplits,
            ySplits = me.ySplits,
            offsetX, offsetY, ctx, bbox, width, height, left = 0,
            right, top = 0,
            bottom, w = rect[2],
            h = rect[3],
            i, j, k;
        while (parent && parent.isSprite) {
            matrix.prependMatrix(parent.matrix || parent.attr && parent.attr.matrix);
            parent = parent.getParent();
        }
        matrix.prependMatrix(surfaceMatrix);
        bbox = sprite.getBBox();
        if (bbox) {
            bbox = matrix.transformBBox(bbox);
        }
        sprite.preRender(me);
        if (sprite.attr.hidden || sprite.attr.globalAlpha === 0) {
            sprite.setDirty(false);
            return;
        }
        for (j = 0, offsetY = 0; j < ySplits; j++, offsetY += splitThreshold) {
            for (i = 0, offsetX = 0; i < xSplits; i++, offsetX += splitThreshold) {
                k = j * xSplits + i;
                ctx = me.contexts[k];
                width = Math.min(splitThreshold, w - offsetX);
                height = Math.min(splitThreshold, h - offsetY);
                left = offsetX;
                right = left + width;
                top = offsetY;
                bottom = top + height;
                if (bbox) {
                    if (bbox.x > right || bbox.x + bbox.width < left || bbox.y > bottom || bbox.y + bbox.height < top) {
                        continue;
                    }
                }
                ctx.save();
                sprite.useAttributes(ctx, rect);
                if (false === sprite.render(me, ctx, [left, top, width, height])) {
                    return false;
                }
                ctx.restore();
            }
        }
        sprite.setDirty(false);
    },
    flatten: function(size, surfaces) {
        var targetCanvas = document.createElement('canvas'),
            className = Ext.getClassName(this),
            ratio = this.devicePixelRatio,
            ctx = targetCanvas.getContext('2d'),
            surface, canvas, rect, i, j, xy;
        targetCanvas.width = Math.ceil(size.width * ratio);
        targetCanvas.height = Math.ceil(size.height * ratio);
        for (i = 0; i < surfaces.length; i++) {
            surface = surfaces[i];
            if (Ext.getClassName(surface) !== className) {
                continue;
            }
            rect = surface.getRect();
            for (j = 0; j < surface.canvases.length; j++) {
                canvas = surface.canvases[j];
                xy = canvas.getOffsetsTo(canvas.getParent());
                ctx.drawImage(canvas.dom, (rect[0] + xy[0]) * ratio, (rect[1] + xy[1]) * ratio);
            }
        }
        return { data: targetCanvas.toDataURL(), type: 'png' };
    },
    applyDefaults: function(ctx) {
        var none = Ext.util.Color.RGBA_NONE;
        ctx.strokeStyle = none;
        ctx.fillStyle = none;
        ctx.textAlign = 'start';
        ctx.textBaseline = 'alphabetic';
        ctx.miterLimit = 1;
    },
    clear: function() {
        var me = this,
            activeCanvases = me.activeCanvases,
            i, canvas, ctx;
        for (i = 0; i < activeCanvases; i++) {
            canvas = me.canvases[i].dom;
            ctx = me.contexts[i];
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        me.setDirty(true);
    },
    destroy: function() {
        var me = this,
            canvases = me.canvases,
            ln = canvases.length,
            i;
        for (i = 0; i < ln; i++) {
            me.contexts[i] = null;
            canvases[i].destroy();
            canvases[i] = null;
        }
        me.contexts = me.canvases = null;
        me.callParent();
    },
    privates: {
        initElement: function() {
            var me = this;
            me.callParent();
            me.canvases = [];
            me.contexts = [];
            me.activeCanvases = me.xSplits = me.ySplits = 0;
        }
    }
}, function() {
    var me = this,
        proto = me.prototype,
        splitThreshold = 1.0E10;
    if (Ext.os.is.Android4 && Ext.browser.is.Chrome) {
        splitThreshold = 3000;
    } else {
        if (Ext.is.iOS) {
            splitThreshold = 2200;
        }
    }
    proto.splitThreshold = splitThreshold;
});
Ext.define('Ext.draw.Container', {
    extend: Ext.draw.ContainerBase,
    alternateClassName: 'Ext.draw.Component',
    xtype: 'draw',
    defaultType: 'surface',
    isDrawContainer: true,
    engine: 'Ext.draw.engine.Canvas',
    config: { cls: Ext.baseCSSPrefix + 'draw-container', resizeHandler: null, sprites: null, gradients: [], touchAction: { panX: false, panY: false, pinchZoom: false, doubleTapZoom: false } },
    defaultDownloadServerUrl: 'http://svg.sencha.io',
    supportedFormats: ['png', 'pdf', 'jpeg', 'gif'],
    supportedOptions: {
        version: Ext.isNumber,
        data: Ext.isString,
        format: function(format) {
            return Ext.Array.indexOf(this.supportedFormats, format) >= 0;
        },
        filename: Ext.isString,
        width: Ext.isNumber,
        height: Ext.isNumber,
        scale: Ext.isNumber,
        pdf: Ext.isObject,
        jpeg: Ext.isObject
    },
    initAnimator: function() {
        this.frameCallbackId = Ext.draw.Animator.addFrameCallback('renderFrame', this);
    },
    applyGradients: function(gradients) {
        var result = [],
            i, n, gradient, offset;
        if (!Ext.isArray(gradients)) {
            return result;
        }
        for (i = 0, n = gradients.length; i < n; i++) {
            gradient = gradients[i];
            if (!Ext.isObject(gradient)) {
                continue;
            }
            if (typeof gradient.type !== 'string') {
                gradient.type = 'linear';
            }
            if (gradient.angle) {
                gradient.degrees = gradient.angle;
                delete gradient.angle;
            }
            if (Ext.isObject(gradient.stops)) {
                gradient.stops = function(stops) {
                    var result = [],
                        stop;
                    for (offset in stops) {
                        stop = stops[offset];
                        stop.offset = offset / 100;
                        result.push(stop);
                    }
                    return result;
                }(gradient.stops);
            }
            result.push(gradient);
        }
        Ext.draw.gradient.GradientDefinition.add(result);
        return result;
    },
    applySprites: function(sprites) {
        if (!sprites) {
            return;
        }
        sprites = Ext.Array.from(sprites);
        var ln = sprites.length,
            result = [],
            i, surface, sprite;
        for (i = 0; i < ln; i++) {
            sprite = sprites[i];
            surface = sprite.surface;
            if (!(surface && surface.isSurface)) {
                if (Ext.isString(surface)) {
                    surface = this.getSurface(surface);
                    delete sprite.surface;
                } else {
                    surface = this.getSurface('main');
                }
            }
            sprite = surface.add(sprite);
            result.push(sprite);
        }
        return result;
    },
    resizeDelay: 500,
    resizeTimerId: 0,
    handleResize: function(size, instantly) {
        var me = this,
            el = me.element,
            resizeHandler = me.getResizeHandler() || me.defaultResizeHandler,
            result;
        if (!el) {
            return;
        }
        size = size || el.getSize();
        if (!(size.width && size.height)) {
            return;
        }
        clearTimeout(me.resizeTimerId);
        if (!instantly) {
            me.resizeTimerId = Ext.defer(me.handleResize, me.resizeDelay, me, [size, true]);
            return;
        } else {
            me.resizeTimerId = 0;
        }
        me.fireEvent('bodyresize', me, size);
        result = resizeHandler.call(me, size);
        if (result !== false) {
            me.renderFrame();
        }
    },
    defaultResizeHandler: function(size) {
        this.getItems().each(function(surface) {
            surface.setRect([0, 0, size.width, size.height]);
        });
    },
    getSurface: function(id) {
        var me = this,
            surfaces = me.getItems(),
            oldCount = surfaces.getCount(),
            surface;
        surface = me.createSurface(id);
        if (surfaces.getCount() > oldCount) {
            me.handleResize(null, true);
        }
        return surface;
    },
    createSurface: function(id) {
        id = this.getId() + '-' + (id || 'main');
        var me = this,
            surfaces = me.getItems(),
            surface = surfaces.get(id);
        if (!surface) {
            surface = me.add({ xclass: me.engine, id: id });
        }
        return surface;
    },
    renderFrame: function() {
        var me = this,
            surfaces = me.getItems(),
            i, ln, item;
        for (i = 0, ln = surfaces.length; i < ln; i++) {
            item = surfaces.items[i];
            if (item.isSurface) {
                item.renderFrame();
            }
        }
    },
    getImage: function(format) {
        var size = this.innerElement.getSize(),
            surfaces = Array.prototype.slice.call(this.items.items),
            zIndexes = this.surfaceZIndexes,
            image, imageElement, i, j, surface, zIndex;
        for (j = 1; j < surfaces.length; j++) {
            surface = surfaces[j];
            zIndex = zIndexes[surface.type];
            i = j - 1;
            while (i >= 0 && zIndexes[surfaces[i].type] > zIndex) {
                surfaces[i + 1] = surfaces[i];
                i--;
            }
            surfaces[i + 1] = surface;
        }
        surface = surfaces[0];
        if ((Ext.isIE || Ext.isEdge) && surface.isSVG) {
            image = { data: surface.toSVG(size, surfaces), type: 'svg-markup' };
        } else {
            image = surface.flatten(size, surfaces);
            if (format === 'image') {
                imageElement = new Image;
                imageElement.src = image.data;
                image.data = imageElement;
                return image;
            }
            if (format === 'stream') {
                image.data = image.data.replace(/^data:image\/[^;]+/, 'data:application/octet-stream');
                return image;
            }
        }
        return image;
    },
    download: function(config) {
        var me = this,
            inputs = [],
            markup, name, value;
        if (Ext.isIE8) {
            return false;
        }
        config = Ext.apply({ version: 2, data: me.getImage().data }, config);
        for (name in config) {
            if (config.hasOwnProperty(name)) {
                value = config[name];
                if (name in me.supportedOptions) {
                    if (me.supportedOptions[name].call(me, value)) {
                        inputs.push({ tag: 'input', type: 'hidden', name: name, value: Ext.String.htmlEncode(Ext.isObject(value) ? Ext.JSON.encode(value) : value) });
                    } else {
                        Ext.log.error('Invalid value for image download option "' + name + '": ' + value);
                    }
                } else {
                    Ext.log.error('Invalid image download option: "' + name + '"');
                }
            }
        }
        markup = Ext.dom.Helper.markup({ tag: 'html', children: [{ tag: 'head' }, { tag: 'body', children: [{ tag: 'form', method: 'POST', action: config.url || me.defaultDownloadServerUrl, children: inputs }, { tag: 'script', type: 'text/javascript', children: 'document.getElementsByTagName("form")[0].submit();' }] }] });
        window.open('', 'ImageDownload_' + Date.now()).document.write(markup);
    },
    destroy: function() {
        var me = this,
            callbackId = me.frameCallbackId;
        if (callbackId) {
            Ext.draw.Animator.removeFrameCallback(callbackId);
        }
        clearTimeout(me.resizeTimerId);
        me.resizeTimerId = 0;
        me.callParent();
    }
}, function() {
    if (location.search.match('svg')) {
        Ext.draw.Container.prototype.engine = 'Ext.draw.engine.Svg';
    } else {
        if (Ext.os.is.BlackBerry && Ext.os.version.getMajor() === 10 || Ext.browser.is.AndroidStock4 && (Ext.os.version.getMinor() === 1 || Ext.os.version.getMinor() === 2 || Ext.os.version.getMinor() === 3)) {
            Ext.draw.Container.prototype.engine = 'Ext.draw.engine.Svg';
        }
    }
});
Ext.define('Ext.draw.PathUtil', function() {
    var abs = Math.abs,
        pow = Math.pow,
        cos = Math.cos,
        acos = Math.acos,
        sqrt = Math.sqrt,
        PI = Math.PI;
    return {
        singleton: true,
        cubicRoots: function(P) {
            var a = P[0],
                b = P[1],
                c = P[2],
                d = P[3];
            if (a === 0) {
                return this.quadraticRoots(b, c, d);
            }
            var A = b / a,
                B = c / a,
                C = d / a,
                Q = (3 * B - pow(A, 2)) / 9,
                R = (9 * A * B - 27 * C - 2 * pow(A, 3)) / 54,
                D = pow(Q, 3) + pow(R, 2),
                t = [],
                S, T, Im, th, i, sign = Ext.Number.sign;
            if (D >= 0) {
                S = sign(R + sqrt(D)) * pow(abs(R + sqrt(D)), 1 / 3);
                T = sign(R - sqrt(D)) * pow(abs(R - sqrt(D)), 1 / 3);
                t[0] = -A / 3 + (S + T);
                t[1] = -A / 3 - (S + T) / 2;
                t[2] = t[1];
                Im = abs(sqrt(3) * (S - T) / 2);
                if (Im !== 0) {
                    t[1] = -1;
                    t[2] = -1;
                }
            } else {
                th = acos(R / sqrt(-pow(Q, 3)));
                t[0] = 2 * sqrt(-Q) * cos(th / 3) - A / 3;
                t[1] = 2 * sqrt(-Q) * cos((th + 2 * PI) / 3) - A / 3;
                t[2] = 2 * sqrt(-Q) * cos((th + 4 * PI) / 3) - A / 3;
            }
            for (i = 0; i < 3; i++) {
                if (t[i] < 0 || t[i] > 1) {
                    t[i] = -1;
                }
            }
            return t;
        },
        quadraticRoots: function(a, b, c) {
            var D, rD, t, i;
            if (a === 0) {
                return this.linearRoot(b, c);
            }
            D = b * b - 4 * a * c;
            if (D === 0) {
                t = [-b / (2 * a)];
            } else {
                if (D > 0) {
                    rD = sqrt(D);
                    t = [(-b - rD) / (2 * a), (-b + rD) / (2 * a)];
                } else {
                    return [];
                }
            }
            for (i = 0; i < t.length; i++) {
                if (t[i] < 0 || t[i] > 1) {
                    t[i] = -1;
                }
            }
            return t;
        },
        linearRoot: function(a, b) {
            var t = -b / a;
            if (a === 0 || t < 0 || t > 1) {
                return [];
            }
            return [t];
        },
        bezierCoeffs: function(P0, P1, P2, P3) {
            var Z = [];
            Z[0] = -P0 + 3 * P1 - 3 * P2 + P3;
            Z[1] = 3 * P0 - 6 * P1 + 3 * P2;
            Z[2] = -3 * P0 + 3 * P1;
            Z[3] = P0;
            return Z;
        },
        cubicLineIntersections: function(px1, px2, px3, px4, py1, py2, py3, py4, x1, y1, x2, y2) {
            var P = [],
                intersections = [],
                A = y1 - y2,
                B = x2 - x1,
                C = x1 * (y2 - y1) - y1 * (x2 - x1),
                bx = this.bezierCoeffs(px1, px2, px3, px4),
                by = this.bezierCoeffs(py1, py2, py3, py4),
                i, r, s, t, tt, ttt, cx, cy;
            P[0] = A * bx[0] + B * by[0];
            P[1] = A * bx[1] + B * by[1];
            P[2] = A * bx[2] + B * by[2];
            P[3] = A * bx[3] + B * by[3] + C;
            r = this.cubicRoots(P);
            for (i = 0; i < r.length; i++) {
                t = r[i];
                if (t < 0 || t > 1) {
                    continue;
                }
                tt = t * t;
                ttt = tt * t;
                cx = bx[0] * ttt + bx[1] * tt + bx[2] * t + bx[3];
                cy = by[0] * ttt + by[1] * tt + by[2] * t + by[3];
                if (x2 - x1 !== 0) {
                    s = (cx - x1) / (x2 - x1);
                } else {
                    s = (cy - y1) / (y2 - y1);
                }
                if (!(s < 0 || s > 1)) {
                    intersections.push([cx, cy]);
                }
            }
            return intersections;
        },
        splitCubic: function(P1, P2, P3, P4, z) {
            var zz = z * z,
                zzz = z * zz,
                iz = z - 1,
                izz = iz * iz,
                izzz = iz * izz,
                P = zzz * P4 - 3 * zz * iz * P3 + 3 * z * izz * P2 - izzz * P1;
            return [
                [P1, z * P2 - iz * P1, zz * P3 - 2 * z * iz * P2 + izz * P1, P],
                [P, zz * P4 - 2 * z * iz * P3 + izz * P2, z * P4 - iz * P3, P4]
            ];
        },
        cubicDimension: function(a, b, c, d) {
            var qa = 3 * (-a + 3 * (b - c) + d),
                qb = 6 * (a - 2 * b + c),
                qc = -3 * (a - b),
                x, y, min = Math.min(a, d),
                max = Math.max(a, d),
                delta;
            if (qa === 0) {
                if (qb === 0) {
                    return [min, max];
                } else {
                    x = -qc / qb;
                    if (0 < x && x < 1) {
                        y = this.interpolateCubic(a, b, c, d, x);
                        min = Math.min(min, y);
                        max = Math.max(max, y);
                    }
                }
            } else {
                delta = qb * qb - 4 * qa * qc;
                if (delta >= 0) {
                    delta = sqrt(delta);
                    x = (delta - qb) / 2 / qa;
                    if (0 < x && x < 1) {
                        y = this.interpolateCubic(a, b, c, d, x);
                        min = Math.min(min, y);
                        max = Math.max(max, y);
                    }
                    if (delta > 0) {
                        x -= delta / qa;
                        if (0 < x && x < 1) {
                            y = this.interpolateCubic(a, b, c, d, x);
                            min = Math.min(min, y);
                            max = Math.max(max, y);
                        }
                    }
                }
            }
            return [min, max];
        },
        interpolateCubic: function(a, b, c, d, t) {
            if (t === 0) {
                return a;
            }
            if (t === 1) {
                return d;
            }
            var rate = (1 - t) / t;
            return t * t * t * (d + rate * (3 * c + rate * (3 * b + rate * a)));
        },
        cubicsIntersections: function(ax1, ax2, ax3, ax4, ay1, ay2, ay3, ay4, bx1, bx2, bx3, bx4, by1, by2, by3, by4) {
            var me = this,
                axDim = me.cubicDimension(ax1, ax2, ax3, ax4),
                ayDim = me.cubicDimension(ay1, ay2, ay3, ay4),
                bxDim = me.cubicDimension(bx1, bx2, bx3, bx4),
                byDim = me.cubicDimension(by1, by2, by3, by4),
                splitAx, splitAy, splitBx, splitBy, points = [];
            if (axDim[0] > bxDim[1] || axDim[1] < bxDim[0] || ayDim[0] > byDim[1] || ayDim[1] < byDim[0]) {
                return [];
            }
            if (abs(ay1 - ay2) < 1 && abs(ay3 - ay4) < 1 && abs(ax1 - ax4) < 1 && abs(ax2 - ax3) < 1 && abs(by1 - by2) < 1 && abs(by3 - by4) < 1 && abs(bx1 - bx4) < 1 && abs(bx2 - bx3) < 1) {
                return [
                    [(ax1 + ax4) * 0.5, (ay1 + ay2) * 0.5]
                ];
            }
            splitAx = me.splitCubic(ax1, ax2, ax3, ax4, 0.5);
            splitAy = me.splitCubic(ay1, ay2, ay3, ay4, 0.5);
            splitBx = me.splitCubic(bx1, bx2, bx3, bx4, 0.5);
            splitBy = me.splitCubic(by1, by2, by3, by4, 0.5);
            points.push.apply(points, me.cubicsIntersections.apply(me, splitAx[0].concat(splitAy[0], splitBx[0], splitBy[0])));
            points.push.apply(points, me.cubicsIntersections.apply(me, splitAx[0].concat(splitAy[0], splitBx[1], splitBy[1])));
            points.push.apply(points, me.cubicsIntersections.apply(me, splitAx[1].concat(splitAy[1], splitBx[0], splitBy[0])));
            points.push.apply(points, me.cubicsIntersections.apply(me, splitAx[1].concat(splitAy[1], splitBx[1], splitBy[1])));
            return points;
        },
        linesIntersection: function(x1, y1, x2, y2, x3, y3, x4, y4) {
            var d = (x2 - x1) * (y4 - y3) - (y2 - y1) * (x4 - x3),
                ua, ub;
            if (d === 0) {
                return null;
            }
            ua = ((x4 - x3) * (y1 - y3) - (x1 - x3) * (y4 - y3)) / d;
            ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / d;
            if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
                return [x1 + ua * (x2 - x1), y1 + ua * (y2 - y1)];
            }
            return null;
        },
        pointOnLine: function(x1, y1, x2, y2, x, y) {
            var t, _;
            if (abs(x2 - x1) < abs(y2 - y1)) {
                _ = x1;
                x1 = y1;
                y1 = _;
                _ = x2;
                x2 = y2;
                y2 = _;
                _ = x;
                x = y;
                y = _;
            }
            t = (x - x1) / (x2 - x1);
            if (t < 0 || t > 1) {
                return false;
            }
            return abs(y1 + t * (y2 - y1) - y) < 4;
        },
        pointOnCubic: function(px1, px2, px3, px4, py1, py2, py3, py4, x, y) {
            var me = this,
                bx = me.bezierCoeffs(px1, px2, px3, px4),
                by = me.bezierCoeffs(py1, py2, py3, py4),
                i, j, rx, ry, t;
            bx[3] -= x;
            by[3] -= y;
            rx = me.cubicRoots(bx);
            ry = me.cubicRoots(by);
            for (i = 0; i < rx.length; i++) {
                t = rx[i];
                for (j = 0; j < ry.length; j++) {
                    if (t >= 0 && t <= 1 && abs(t - ry[j]) < 0.05) {
                        return true;
                    }
                }
            }
            return false;
        }
    };
});
Ext.define('Ext.draw.overrides.hittest.All', {});
Ext.define('Ext.draw.plugin.SpriteEvents', {
    extend: Ext.plugin.Abstract,
    alias: 'plugin.spriteevents',
    mouseMoveEvents: { mousemove: true, mouseover: true, mouseout: true },
    spriteMouseMoveEvents: { spritemousemove: true, spritemouseover: true, spritemouseout: true },
    init: function(drawContainer) {
        var handleEvent = 'handleEvent';
        this.drawContainer = drawContainer;
        drawContainer.addElementListener({ click: handleEvent, dblclick: handleEvent, mousedown: handleEvent, mousemove: handleEvent, mouseup: handleEvent, mouseover: handleEvent, mouseout: handleEvent, priority: 1001, scope: this });
    },
    hasSpriteMouseMoveListeners: function() {
        var listeners = this.drawContainer.hasListeners,
            name;
        for (name in this.spriteMouseMoveEvents) {
            if (name in listeners) {
                return true;
            }
        }
        return false;
    },
    hitTestEvent: function(e) {
        var items = this.drawContainer.getItems(),
            surface, sprite, i;
        for (i = items.length - 1; i >= 0; i--) {
            surface = items.get(i);
            sprite = surface.hitTestEvent(e);
            if (sprite) {
                return sprite;
            }
        }
        return null;
    },
    handleEvent: function(e) {
        var me = this,
            drawContainer = me.drawContainer,
            isMouseMoveEvent = e.type in me.mouseMoveEvents,
            lastSprite = me.lastSprite,
            sprite;
        if (isMouseMoveEvent && !me.hasSpriteMouseMoveListeners()) {
            return;
        }
        sprite = me.hitTestEvent(e);
        if (isMouseMoveEvent && !Ext.Object.equals(sprite, lastSprite)) {
            if (lastSprite) {
                drawContainer.fireEvent('spritemouseout', lastSprite, e);
            }
            if (sprite) {
                drawContainer.fireEvent('spritemouseover', sprite, e);
            }
        }
        if (sprite) {
            drawContainer.fireEvent('sprite' + e.type, sprite, e);
        }
        me.lastSprite = sprite;
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
Ext.form.field.Base.override({
    labelSeparator: '',
    config: { trackValueChange: false },
    _firstChange: false,
    _changeEventBinding: false,
    applyTrackValueChange: function (v) {
        this.trackValueChange = v;
        this.bindTrackFieldChangeEvent();
        if (v) {
            this._oldValue = this.getValue();
        }
    },
    initComponent: function() {
        this.callParent(arguments);
        this.bindTrackFieldChangeEvent();
    },
    bindTrackFieldChangeEvent: function () {
        if (this.trackValueChange === true && this._changeEventBinding === false) {
            var me = this;
            me._changeEventBinding = true;
            me.on('blur', function(field) {
                var newValue = field.getValue();
                //console.log(field.name, field._oldValue, field.getValue());
                if (newValue !== me._oldValue && me._oldValue !== undefined) {
                    //console.log(field.name, { n: newValue, o : me._oldValue})
                    me.fireEvent('valuechangecomplete', me, newValue, me._oldValue);
                }
                me._oldValue = newValue;
            });
        }
    }
});
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
Ext.form.field.Field.override({});
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
    },
    show: function() {
        var msg = this.msg || 'loading...';
        if (msg.indexOf('loading-cube') < 1) {
            var newMsg = '\x3cdiv\x3e\x3cdiv class\x3d"loading-cube"\x3e\x3cspan\x3e\x3c/span\x3e\x3cspan\x3e\x3c/span\x3e\x3cspan\x3e\x3c/span\x3e\x3c/div\x3e\x3cdiv class\x3d"text"\x3e' + msg + '\x3c/div\x3e\x3c/div\x3e';
            this.msg = newMsg;
        }
        if (this.ownerCt && this.ownerCt.xtype === 'boundlist') {
            this.addCls('sef-loadmask-boundlist');
        }
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


Ext.onReady(function() {
    Ext.Loader.setConfig({
        enable: true,
        //disableCaching: false,
        paths: {
            "sef": "/",
            "sef.core": "/sef",
            "sef.app": '/apps',
            "Ext.draw": "/extjs/ext-draw"
        }
    });

    Ext.application({
        name: 'sef',

        extend: 'sef.core.Application',

        requires: [


            "sef.core.Application",
            "sef.core.components.CardPanel",
            "sef.core.components.SubTitle",
            "sef.core.components.bar.GridPagingToolbar",
            "sef.core.components.bar.MainTopMenubar",
            "sef.core.components.bar.MainTopbar",
            "sef.core.components.bar.SearchBar",
            "sef.core.components.bar.TreeSearchBar",
            "sef.core.components.button.ActionButton",
            "sef.core.components.form.AbstractDynamicFormPanel",
            "sef.core.components.form.BoolCombo",
            "sef.core.components.form.BoolRadioGroup",
            "sef.core.components.form.ComplexProjectForm",
            "sef.core.components.form.EnumCombo",
            "sef.core.components.form.FixedCombo",
            "sef.core.components.form.FloorField",
            "sef.core.components.form.FormPanel",
            "sef.core.components.form.FormViewModel",
            "sef.core.components.form.LookupField",
            "sef.core.components.form.ParamCombo",
            "sef.core.components.form.ParamDynamicFormPanel",
            "sef.core.components.form.RangeField",
            "sef.core.components.form.SearchField",
            "sef.core.components.grid.DataGrid",
            "sef.core.components.grid.DataGridField",
            "sef.core.components.grid.DataGridFieldCtrl",
            "sef.core.components.grid.DataGridViewTable",
            "sef.core.components.grid.EditorDataGrid",
            "sef.core.components.grid.LookupDataGrid",
            "sef.core.components.page.FormPage",
            "sef.core.components.page.FormPageCtrl",
            "sef.core.components.page.ListPage",
            "sef.core.components.page.ListPageCtrl",
            "sef.core.components.page.PageCtrl",
            "sef.core.components.tree.MainMenuTree",
            "sef.core.components.tree.PageTree",
            "sef.core.components.tree.Timeline",
            "sef.core.components.uploader.AbstractUploader",
            "sef.core.components.uploader.AbstractXhrUploader",
            "sef.core.components.uploader.Avatar",
            "sef.core.components.uploader.BrowseButton",
            "sef.core.components.uploader.ExtJsUploader",
            "sef.core.components.uploader.ItemGridPanel",
            "sef.core.components.uploader.Manager",
            "sef.core.components.uploader.StatusBar",
            "sef.core.components.uploader.UploadDialog",
            "sef.core.components.uploader.UploadPanel",
            "sef.core.components.uploader.data.Connection",
            "sef.core.components.uploader.data.Item",
            "sef.core.components.uploader.data.Queue",
            "sef.core.components.uploader.data.UploadStore",
            "sef.core.components.uploader.header.AbstractFilenameEncoder",
            "sef.core.components.uploader.header.Base64FilenameEncoder",
            "sef.core.components.window.AdvSearchDialog",
            "sef.core.components.window.BaseDialog",
            "sef.core.components.window.ChangePwdDialog",
            "sef.core.components.window.EditDialogContent",
            "sef.core.components.window.EditorDialog",
            "sef.core.components.window.EditorGridDialog",
            "sef.core.components.window.ExportDialog",
            "sef.core.components.window.ExportPanel",
            "sef.core.components.window.LockingWindow",
            "sef.core.components.window.LookupDialog",
            "sef.core.components.window.PrintDialog",
            "sef.core.components.window.UpdateLogDialog",
            "sef.core.data.ApiProxy",
            "sef.core.data.JsonWriter",
            "sef.core.data.ResultReader",
            "sef.core.data.Store",
            "sef.core.interfaces.IAppPage",
            "sef.core.interfaces.IAppPageContainer",
            "sef.core.interfaces.IAppViewport",
            "sef.core.interfaces.IDialogContent",
            "sef.core.interfaces.IFieldDisplayModeChange",
            "sef.core.model.BaseModel",
            "sef.core.model.CheckboxTreeModel",
            "sef.core.model.TreeModel",
            "sef.core.utils.Dialog",
            "sef.core.utils.Message",
            "sef.core.utils.RunningCfg",
            "sef.core.utils.Utils",
            "sef.core.view.appcontainer.AppPageContainer",
            "sef.core.view.appcontainer.TabAppContainer",
            "sef.core.view.main.Main",
            "sef.core.view.security.LoginCtrl",
            "sef.core.view.security.LoginForm",
            "sef.core.view.security.LoginWindow",
            "sef.core.view.viewport.MDIViewport",
            "sef.core.view.viewport.MDIViewportCtrl",
            "sef.core.view.viewport.TopMDIViewport",
            "sef.core.view.viewport.TopMDIViewportCtrl",
            "sef.core.view.viewport.ViewportCtrl",
            "sef.core.view.viewport.ViewportViewModel",
            "sef.core.components.flowchart.Drawer",
            "sef.core.components.flowchart.DrawerContainer",
            "sef.core.components.Progress",
            "sef.core.components.form.ComplexProjectFormSingle",
            'sef.core.components.form.ComplexProjectFormView',
            'sef.core.components.form.ReviewForm',
            "sef.core.components.window.CustomFormLayoutDialog",
            "sef.core.components.window.CustomFormLayoutDialogCtrl",
            "sef.core.view.VerticalDropZone",
            "Ext.view.DragZone"
        ]


    });

});