"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/web-streams-polyfill/dist/ponyfill.es2018.js
var require_ponyfill_es2018 = __commonJS({
  "node_modules/web-streams-polyfill/dist/ponyfill.es2018.js"(exports2, module2) {
    (function(global2, factory) {
      typeof exports2 === "object" && typeof module2 !== "undefined" ? factory(exports2) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global2 = typeof globalThis !== "undefined" ? globalThis : global2 || self, factory(global2.WebStreamsPolyfill = {}));
    })(exports2, (function(exports3) {
      "use strict";
      function noop2() {
        return void 0;
      }
      function typeIsObject(x2) {
        return typeof x2 === "object" && x2 !== null || typeof x2 === "function";
      }
      const rethrowAssertionErrorRejection = noop2;
      function setFunctionName(fn, name) {
        try {
          Object.defineProperty(fn, "name", {
            value: name,
            configurable: true
          });
        } catch (_a2) {
        }
      }
      const originalPromise = Promise;
      const originalPromiseThen = Promise.prototype.then;
      const originalPromiseReject = Promise.reject.bind(originalPromise);
      function newPromise(executor) {
        return new originalPromise(executor);
      }
      function promiseResolvedWith(value) {
        return newPromise((resolve) => resolve(value));
      }
      function promiseRejectedWith(reason) {
        return originalPromiseReject(reason);
      }
      function PerformPromiseThen(promise, onFulfilled, onRejected) {
        return originalPromiseThen.call(promise, onFulfilled, onRejected);
      }
      function uponPromise(promise, onFulfilled, onRejected) {
        PerformPromiseThen(PerformPromiseThen(promise, onFulfilled, onRejected), void 0, rethrowAssertionErrorRejection);
      }
      function uponFulfillment(promise, onFulfilled) {
        uponPromise(promise, onFulfilled);
      }
      function uponRejection(promise, onRejected) {
        uponPromise(promise, void 0, onRejected);
      }
      function transformPromiseWith(promise, fulfillmentHandler, rejectionHandler) {
        return PerformPromiseThen(promise, fulfillmentHandler, rejectionHandler);
      }
      function setPromiseIsHandledToTrue(promise) {
        PerformPromiseThen(promise, void 0, rethrowAssertionErrorRejection);
      }
      let _queueMicrotask = (callback) => {
        if (typeof queueMicrotask === "function") {
          _queueMicrotask = queueMicrotask;
        } else {
          const resolvedPromise = promiseResolvedWith(void 0);
          _queueMicrotask = (cb) => PerformPromiseThen(resolvedPromise, cb);
        }
        return _queueMicrotask(callback);
      };
      function reflectCall(F2, V, args) {
        if (typeof F2 !== "function") {
          throw new TypeError("Argument is not a function");
        }
        return Function.prototype.apply.call(F2, V, args);
      }
      function promiseCall(F2, V, args) {
        try {
          return promiseResolvedWith(reflectCall(F2, V, args));
        } catch (value) {
          return promiseRejectedWith(value);
        }
      }
      const QUEUE_MAX_ARRAY_SIZE = 16384;
      class SimpleQueue {
        constructor() {
          this._cursor = 0;
          this._size = 0;
          this._front = {
            _elements: [],
            _next: void 0
          };
          this._back = this._front;
          this._cursor = 0;
          this._size = 0;
        }
        get length() {
          return this._size;
        }
        // For exception safety, this method is structured in order:
        // 1. Read state
        // 2. Calculate required state mutations
        // 3. Perform state mutations
        push(element) {
          const oldBack = this._back;
          let newBack = oldBack;
          if (oldBack._elements.length === QUEUE_MAX_ARRAY_SIZE - 1) {
            newBack = {
              _elements: [],
              _next: void 0
            };
          }
          oldBack._elements.push(element);
          if (newBack !== oldBack) {
            this._back = newBack;
            oldBack._next = newBack;
          }
          ++this._size;
        }
        // Like push(), shift() follows the read -> calculate -> mutate pattern for
        // exception safety.
        shift() {
          const oldFront = this._front;
          let newFront = oldFront;
          const oldCursor = this._cursor;
          let newCursor = oldCursor + 1;
          const elements = oldFront._elements;
          const element = elements[oldCursor];
          if (newCursor === QUEUE_MAX_ARRAY_SIZE) {
            newFront = oldFront._next;
            newCursor = 0;
          }
          --this._size;
          this._cursor = newCursor;
          if (oldFront !== newFront) {
            this._front = newFront;
          }
          elements[oldCursor] = void 0;
          return element;
        }
        // The tricky thing about forEach() is that it can be called
        // re-entrantly. The queue may be mutated inside the callback. It is easy to
        // see that push() within the callback has no negative effects since the end
        // of the queue is checked for on every iteration. If shift() is called
        // repeatedly within the callback then the next iteration may return an
        // element that has been removed. In this case the callback will be called
        // with undefined values until we either "catch up" with elements that still
        // exist or reach the back of the queue.
        forEach(callback) {
          let i2 = this._cursor;
          let node = this._front;
          let elements = node._elements;
          while (i2 !== elements.length || node._next !== void 0) {
            if (i2 === elements.length) {
              node = node._next;
              elements = node._elements;
              i2 = 0;
              if (elements.length === 0) {
                break;
              }
            }
            callback(elements[i2]);
            ++i2;
          }
        }
        // Return the element that would be returned if shift() was called now,
        // without modifying the queue.
        peek() {
          const front = this._front;
          const cursor = this._cursor;
          return front._elements[cursor];
        }
      }
      const AbortSteps = /* @__PURE__ */ Symbol("[[AbortSteps]]");
      const ErrorSteps = /* @__PURE__ */ Symbol("[[ErrorSteps]]");
      const CancelSteps = /* @__PURE__ */ Symbol("[[CancelSteps]]");
      const PullSteps = /* @__PURE__ */ Symbol("[[PullSteps]]");
      const ReleaseSteps = /* @__PURE__ */ Symbol("[[ReleaseSteps]]");
      function ReadableStreamReaderGenericInitialize(reader, stream) {
        reader._ownerReadableStream = stream;
        stream._reader = reader;
        if (stream._state === "readable") {
          defaultReaderClosedPromiseInitialize(reader);
        } else if (stream._state === "closed") {
          defaultReaderClosedPromiseInitializeAsResolved(reader);
        } else {
          defaultReaderClosedPromiseInitializeAsRejected(reader, stream._storedError);
        }
      }
      function ReadableStreamReaderGenericCancel(reader, reason) {
        const stream = reader._ownerReadableStream;
        return ReadableStreamCancel(stream, reason);
      }
      function ReadableStreamReaderGenericRelease(reader) {
        const stream = reader._ownerReadableStream;
        if (stream._state === "readable") {
          defaultReaderClosedPromiseReject(reader, new TypeError(`Reader was released and can no longer be used to monitor the stream's closedness`));
        } else {
          defaultReaderClosedPromiseResetToRejected(reader, new TypeError(`Reader was released and can no longer be used to monitor the stream's closedness`));
        }
        stream._readableStreamController[ReleaseSteps]();
        stream._reader = void 0;
        reader._ownerReadableStream = void 0;
      }
      function readerLockException(name) {
        return new TypeError("Cannot " + name + " a stream using a released reader");
      }
      function defaultReaderClosedPromiseInitialize(reader) {
        reader._closedPromise = newPromise((resolve, reject) => {
          reader._closedPromise_resolve = resolve;
          reader._closedPromise_reject = reject;
        });
      }
      function defaultReaderClosedPromiseInitializeAsRejected(reader, reason) {
        defaultReaderClosedPromiseInitialize(reader);
        defaultReaderClosedPromiseReject(reader, reason);
      }
      function defaultReaderClosedPromiseInitializeAsResolved(reader) {
        defaultReaderClosedPromiseInitialize(reader);
        defaultReaderClosedPromiseResolve(reader);
      }
      function defaultReaderClosedPromiseReject(reader, reason) {
        if (reader._closedPromise_reject === void 0) {
          return;
        }
        setPromiseIsHandledToTrue(reader._closedPromise);
        reader._closedPromise_reject(reason);
        reader._closedPromise_resolve = void 0;
        reader._closedPromise_reject = void 0;
      }
      function defaultReaderClosedPromiseResetToRejected(reader, reason) {
        defaultReaderClosedPromiseInitializeAsRejected(reader, reason);
      }
      function defaultReaderClosedPromiseResolve(reader) {
        if (reader._closedPromise_resolve === void 0) {
          return;
        }
        reader._closedPromise_resolve(void 0);
        reader._closedPromise_resolve = void 0;
        reader._closedPromise_reject = void 0;
      }
      const NumberIsFinite = Number.isFinite || function(x2) {
        return typeof x2 === "number" && isFinite(x2);
      };
      const MathTrunc = Math.trunc || function(v) {
        return v < 0 ? Math.ceil(v) : Math.floor(v);
      };
      function isDictionary(x2) {
        return typeof x2 === "object" || typeof x2 === "function";
      }
      function assertDictionary(obj, context) {
        if (obj !== void 0 && !isDictionary(obj)) {
          throw new TypeError(`${context} is not an object.`);
        }
      }
      function assertFunction(x2, context) {
        if (typeof x2 !== "function") {
          throw new TypeError(`${context} is not a function.`);
        }
      }
      function isObject(x2) {
        return typeof x2 === "object" && x2 !== null || typeof x2 === "function";
      }
      function assertObject(x2, context) {
        if (!isObject(x2)) {
          throw new TypeError(`${context} is not an object.`);
        }
      }
      function assertRequiredArgument(x2, position, context) {
        if (x2 === void 0) {
          throw new TypeError(`Parameter ${position} is required in '${context}'.`);
        }
      }
      function assertRequiredField(x2, field, context) {
        if (x2 === void 0) {
          throw new TypeError(`${field} is required in '${context}'.`);
        }
      }
      function convertUnrestrictedDouble(value) {
        return Number(value);
      }
      function censorNegativeZero(x2) {
        return x2 === 0 ? 0 : x2;
      }
      function integerPart(x2) {
        return censorNegativeZero(MathTrunc(x2));
      }
      function convertUnsignedLongLongWithEnforceRange(value, context) {
        const lowerBound = 0;
        const upperBound = Number.MAX_SAFE_INTEGER;
        let x2 = Number(value);
        x2 = censorNegativeZero(x2);
        if (!NumberIsFinite(x2)) {
          throw new TypeError(`${context} is not a finite number`);
        }
        x2 = integerPart(x2);
        if (x2 < lowerBound || x2 > upperBound) {
          throw new TypeError(`${context} is outside the accepted range of ${lowerBound} to ${upperBound}, inclusive`);
        }
        if (!NumberIsFinite(x2) || x2 === 0) {
          return 0;
        }
        return x2;
      }
      function assertReadableStream(x2, context) {
        if (!IsReadableStream(x2)) {
          throw new TypeError(`${context} is not a ReadableStream.`);
        }
      }
      function AcquireReadableStreamDefaultReader(stream) {
        return new ReadableStreamDefaultReader(stream);
      }
      function ReadableStreamAddReadRequest(stream, readRequest) {
        stream._reader._readRequests.push(readRequest);
      }
      function ReadableStreamFulfillReadRequest(stream, chunk, done) {
        const reader = stream._reader;
        const readRequest = reader._readRequests.shift();
        if (done) {
          readRequest._closeSteps();
        } else {
          readRequest._chunkSteps(chunk);
        }
      }
      function ReadableStreamGetNumReadRequests(stream) {
        return stream._reader._readRequests.length;
      }
      function ReadableStreamHasDefaultReader(stream) {
        const reader = stream._reader;
        if (reader === void 0) {
          return false;
        }
        if (!IsReadableStreamDefaultReader(reader)) {
          return false;
        }
        return true;
      }
      class ReadableStreamDefaultReader {
        constructor(stream) {
          assertRequiredArgument(stream, 1, "ReadableStreamDefaultReader");
          assertReadableStream(stream, "First parameter");
          if (IsReadableStreamLocked(stream)) {
            throw new TypeError("This stream has already been locked for exclusive reading by another reader");
          }
          ReadableStreamReaderGenericInitialize(this, stream);
          this._readRequests = new SimpleQueue();
        }
        /**
         * Returns a promise that will be fulfilled when the stream becomes closed,
         * or rejected if the stream ever errors or the reader's lock is released before the stream finishes closing.
         */
        get closed() {
          if (!IsReadableStreamDefaultReader(this)) {
            return promiseRejectedWith(defaultReaderBrandCheckException("closed"));
          }
          return this._closedPromise;
        }
        /**
         * If the reader is active, behaves the same as {@link ReadableStream.cancel | stream.cancel(reason)}.
         */
        cancel(reason = void 0) {
          if (!IsReadableStreamDefaultReader(this)) {
            return promiseRejectedWith(defaultReaderBrandCheckException("cancel"));
          }
          if (this._ownerReadableStream === void 0) {
            return promiseRejectedWith(readerLockException("cancel"));
          }
          return ReadableStreamReaderGenericCancel(this, reason);
        }
        /**
         * Returns a promise that allows access to the next chunk from the stream's internal queue, if available.
         *
         * If reading a chunk causes the queue to become empty, more data will be pulled from the underlying source.
         */
        read() {
          if (!IsReadableStreamDefaultReader(this)) {
            return promiseRejectedWith(defaultReaderBrandCheckException("read"));
          }
          if (this._ownerReadableStream === void 0) {
            return promiseRejectedWith(readerLockException("read from"));
          }
          let resolvePromise;
          let rejectPromise;
          const promise = newPromise((resolve, reject) => {
            resolvePromise = resolve;
            rejectPromise = reject;
          });
          const readRequest = {
            _chunkSteps: (chunk) => resolvePromise({ value: chunk, done: false }),
            _closeSteps: () => resolvePromise({ value: void 0, done: true }),
            _errorSteps: (e2) => rejectPromise(e2)
          };
          ReadableStreamDefaultReaderRead(this, readRequest);
          return promise;
        }
        /**
         * Releases the reader's lock on the corresponding stream. After the lock is released, the reader is no longer active.
         * If the associated stream is errored when the lock is released, the reader will appear errored in the same way
         * from now on; otherwise, the reader will appear closed.
         *
         * A reader's lock cannot be released while it still has a pending read request, i.e., if a promise returned by
         * the reader's {@link ReadableStreamDefaultReader.read | read()} method has not yet been settled. Attempting to
         * do so will throw a `TypeError` and leave the reader locked to the stream.
         */
        releaseLock() {
          if (!IsReadableStreamDefaultReader(this)) {
            throw defaultReaderBrandCheckException("releaseLock");
          }
          if (this._ownerReadableStream === void 0) {
            return;
          }
          ReadableStreamDefaultReaderRelease(this);
        }
      }
      Object.defineProperties(ReadableStreamDefaultReader.prototype, {
        cancel: { enumerable: true },
        read: { enumerable: true },
        releaseLock: { enumerable: true },
        closed: { enumerable: true }
      });
      setFunctionName(ReadableStreamDefaultReader.prototype.cancel, "cancel");
      setFunctionName(ReadableStreamDefaultReader.prototype.read, "read");
      setFunctionName(ReadableStreamDefaultReader.prototype.releaseLock, "releaseLock");
      if (typeof Symbol.toStringTag === "symbol") {
        Object.defineProperty(ReadableStreamDefaultReader.prototype, Symbol.toStringTag, {
          value: "ReadableStreamDefaultReader",
          configurable: true
        });
      }
      function IsReadableStreamDefaultReader(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_readRequests")) {
          return false;
        }
        return x2 instanceof ReadableStreamDefaultReader;
      }
      function ReadableStreamDefaultReaderRead(reader, readRequest) {
        const stream = reader._ownerReadableStream;
        stream._disturbed = true;
        if (stream._state === "closed") {
          readRequest._closeSteps();
        } else if (stream._state === "errored") {
          readRequest._errorSteps(stream._storedError);
        } else {
          stream._readableStreamController[PullSteps](readRequest);
        }
      }
      function ReadableStreamDefaultReaderRelease(reader) {
        ReadableStreamReaderGenericRelease(reader);
        const e2 = new TypeError("Reader was released");
        ReadableStreamDefaultReaderErrorReadRequests(reader, e2);
      }
      function ReadableStreamDefaultReaderErrorReadRequests(reader, e2) {
        const readRequests = reader._readRequests;
        reader._readRequests = new SimpleQueue();
        readRequests.forEach((readRequest) => {
          readRequest._errorSteps(e2);
        });
      }
      function defaultReaderBrandCheckException(name) {
        return new TypeError(`ReadableStreamDefaultReader.prototype.${name} can only be used on a ReadableStreamDefaultReader`);
      }
      const AsyncIteratorPrototype = Object.getPrototypeOf(Object.getPrototypeOf(async function* () {
      }).prototype);
      class ReadableStreamAsyncIteratorImpl {
        constructor(reader, preventCancel) {
          this._ongoingPromise = void 0;
          this._isFinished = false;
          this._reader = reader;
          this._preventCancel = preventCancel;
        }
        next() {
          const nextSteps = () => this._nextSteps();
          this._ongoingPromise = this._ongoingPromise ? transformPromiseWith(this._ongoingPromise, nextSteps, nextSteps) : nextSteps();
          return this._ongoingPromise;
        }
        return(value) {
          const returnSteps = () => this._returnSteps(value);
          return this._ongoingPromise ? transformPromiseWith(this._ongoingPromise, returnSteps, returnSteps) : returnSteps();
        }
        _nextSteps() {
          if (this._isFinished) {
            return Promise.resolve({ value: void 0, done: true });
          }
          const reader = this._reader;
          let resolvePromise;
          let rejectPromise;
          const promise = newPromise((resolve, reject) => {
            resolvePromise = resolve;
            rejectPromise = reject;
          });
          const readRequest = {
            _chunkSteps: (chunk) => {
              this._ongoingPromise = void 0;
              _queueMicrotask(() => resolvePromise({ value: chunk, done: false }));
            },
            _closeSteps: () => {
              this._ongoingPromise = void 0;
              this._isFinished = true;
              ReadableStreamReaderGenericRelease(reader);
              resolvePromise({ value: void 0, done: true });
            },
            _errorSteps: (reason) => {
              this._ongoingPromise = void 0;
              this._isFinished = true;
              ReadableStreamReaderGenericRelease(reader);
              rejectPromise(reason);
            }
          };
          ReadableStreamDefaultReaderRead(reader, readRequest);
          return promise;
        }
        _returnSteps(value) {
          if (this._isFinished) {
            return Promise.resolve({ value, done: true });
          }
          this._isFinished = true;
          const reader = this._reader;
          if (!this._preventCancel) {
            const result = ReadableStreamReaderGenericCancel(reader, value);
            ReadableStreamReaderGenericRelease(reader);
            return transformPromiseWith(result, () => ({ value, done: true }));
          }
          ReadableStreamReaderGenericRelease(reader);
          return promiseResolvedWith({ value, done: true });
        }
      }
      const ReadableStreamAsyncIteratorPrototype = {
        next() {
          if (!IsReadableStreamAsyncIterator(this)) {
            return promiseRejectedWith(streamAsyncIteratorBrandCheckException("next"));
          }
          return this._asyncIteratorImpl.next();
        },
        return(value) {
          if (!IsReadableStreamAsyncIterator(this)) {
            return promiseRejectedWith(streamAsyncIteratorBrandCheckException("return"));
          }
          return this._asyncIteratorImpl.return(value);
        }
      };
      Object.setPrototypeOf(ReadableStreamAsyncIteratorPrototype, AsyncIteratorPrototype);
      function AcquireReadableStreamAsyncIterator(stream, preventCancel) {
        const reader = AcquireReadableStreamDefaultReader(stream);
        const impl = new ReadableStreamAsyncIteratorImpl(reader, preventCancel);
        const iterator = Object.create(ReadableStreamAsyncIteratorPrototype);
        iterator._asyncIteratorImpl = impl;
        return iterator;
      }
      function IsReadableStreamAsyncIterator(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_asyncIteratorImpl")) {
          return false;
        }
        try {
          return x2._asyncIteratorImpl instanceof ReadableStreamAsyncIteratorImpl;
        } catch (_a2) {
          return false;
        }
      }
      function streamAsyncIteratorBrandCheckException(name) {
        return new TypeError(`ReadableStreamAsyncIterator.${name} can only be used on a ReadableSteamAsyncIterator`);
      }
      const NumberIsNaN = Number.isNaN || function(x2) {
        return x2 !== x2;
      };
      var _a, _b, _c;
      function CreateArrayFromList(elements) {
        return elements.slice();
      }
      function CopyDataBlockBytes(dest, destOffset, src, srcOffset, n) {
        new Uint8Array(dest).set(new Uint8Array(src, srcOffset, n), destOffset);
      }
      let TransferArrayBuffer = (O) => {
        if (typeof O.transfer === "function") {
          TransferArrayBuffer = (buffer) => buffer.transfer();
        } else if (typeof structuredClone === "function") {
          TransferArrayBuffer = (buffer) => structuredClone(buffer, { transfer: [buffer] });
        } else {
          TransferArrayBuffer = (buffer) => buffer;
        }
        return TransferArrayBuffer(O);
      };
      let IsDetachedBuffer = (O) => {
        if (typeof O.detached === "boolean") {
          IsDetachedBuffer = (buffer) => buffer.detached;
        } else {
          IsDetachedBuffer = (buffer) => buffer.byteLength === 0;
        }
        return IsDetachedBuffer(O);
      };
      function ArrayBufferSlice(buffer, begin, end) {
        if (buffer.slice) {
          return buffer.slice(begin, end);
        }
        const length = end - begin;
        const slice = new ArrayBuffer(length);
        CopyDataBlockBytes(slice, 0, buffer, begin, length);
        return slice;
      }
      function GetMethod(receiver, prop) {
        const func = receiver[prop];
        if (func === void 0 || func === null) {
          return void 0;
        }
        if (typeof func !== "function") {
          throw new TypeError(`${String(prop)} is not a function`);
        }
        return func;
      }
      function CreateAsyncFromSyncIterator(syncIteratorRecord) {
        const syncIterable = {
          [Symbol.iterator]: () => syncIteratorRecord.iterator
        };
        const asyncIterator = (async function* () {
          return yield* syncIterable;
        })();
        const nextMethod = asyncIterator.next;
        return { iterator: asyncIterator, nextMethod, done: false };
      }
      const SymbolAsyncIterator = (_c = (_a = Symbol.asyncIterator) !== null && _a !== void 0 ? _a : (_b = Symbol.for) === null || _b === void 0 ? void 0 : _b.call(Symbol, "Symbol.asyncIterator")) !== null && _c !== void 0 ? _c : "@@asyncIterator";
      function GetIterator(obj, hint = "sync", method) {
        if (method === void 0) {
          if (hint === "async") {
            method = GetMethod(obj, SymbolAsyncIterator);
            if (method === void 0) {
              const syncMethod = GetMethod(obj, Symbol.iterator);
              const syncIteratorRecord = GetIterator(obj, "sync", syncMethod);
              return CreateAsyncFromSyncIterator(syncIteratorRecord);
            }
          } else {
            method = GetMethod(obj, Symbol.iterator);
          }
        }
        if (method === void 0) {
          throw new TypeError("The object is not iterable");
        }
        const iterator = reflectCall(method, obj, []);
        if (!typeIsObject(iterator)) {
          throw new TypeError("The iterator method must return an object");
        }
        const nextMethod = iterator.next;
        return { iterator, nextMethod, done: false };
      }
      function IteratorNext(iteratorRecord) {
        const result = reflectCall(iteratorRecord.nextMethod, iteratorRecord.iterator, []);
        if (!typeIsObject(result)) {
          throw new TypeError("The iterator.next() method must return an object");
        }
        return result;
      }
      function IteratorComplete(iterResult) {
        return Boolean(iterResult.done);
      }
      function IteratorValue(iterResult) {
        return iterResult.value;
      }
      function IsNonNegativeNumber(v) {
        if (typeof v !== "number") {
          return false;
        }
        if (NumberIsNaN(v)) {
          return false;
        }
        if (v < 0) {
          return false;
        }
        return true;
      }
      function CloneAsUint8Array(O) {
        const buffer = ArrayBufferSlice(O.buffer, O.byteOffset, O.byteOffset + O.byteLength);
        return new Uint8Array(buffer);
      }
      function DequeueValue(container) {
        const pair = container._queue.shift();
        container._queueTotalSize -= pair.size;
        if (container._queueTotalSize < 0) {
          container._queueTotalSize = 0;
        }
        return pair.value;
      }
      function EnqueueValueWithSize(container, value, size) {
        if (!IsNonNegativeNumber(size) || size === Infinity) {
          throw new RangeError("Size must be a finite, non-NaN, non-negative number.");
        }
        container._queue.push({ value, size });
        container._queueTotalSize += size;
      }
      function PeekQueueValue(container) {
        const pair = container._queue.peek();
        return pair.value;
      }
      function ResetQueue(container) {
        container._queue = new SimpleQueue();
        container._queueTotalSize = 0;
      }
      function isDataViewConstructor(ctor) {
        return ctor === DataView;
      }
      function isDataView(view) {
        return isDataViewConstructor(view.constructor);
      }
      function arrayBufferViewElementSize(ctor) {
        if (isDataViewConstructor(ctor)) {
          return 1;
        }
        return ctor.BYTES_PER_ELEMENT;
      }
      class ReadableStreamBYOBRequest {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        /**
         * Returns the view for writing in to, or `null` if the BYOB request has already been responded to.
         */
        get view() {
          if (!IsReadableStreamBYOBRequest(this)) {
            throw byobRequestBrandCheckException("view");
          }
          return this._view;
        }
        respond(bytesWritten) {
          if (!IsReadableStreamBYOBRequest(this)) {
            throw byobRequestBrandCheckException("respond");
          }
          assertRequiredArgument(bytesWritten, 1, "respond");
          bytesWritten = convertUnsignedLongLongWithEnforceRange(bytesWritten, "First parameter");
          if (this._associatedReadableByteStreamController === void 0) {
            throw new TypeError("This BYOB request has been invalidated");
          }
          if (IsDetachedBuffer(this._view.buffer)) {
            throw new TypeError(`The BYOB request's buffer has been detached and so cannot be used as a response`);
          }
          ReadableByteStreamControllerRespond(this._associatedReadableByteStreamController, bytesWritten);
        }
        respondWithNewView(view) {
          if (!IsReadableStreamBYOBRequest(this)) {
            throw byobRequestBrandCheckException("respondWithNewView");
          }
          assertRequiredArgument(view, 1, "respondWithNewView");
          if (!ArrayBuffer.isView(view)) {
            throw new TypeError("You can only respond with array buffer views");
          }
          if (this._associatedReadableByteStreamController === void 0) {
            throw new TypeError("This BYOB request has been invalidated");
          }
          if (IsDetachedBuffer(view.buffer)) {
            throw new TypeError("The given view's buffer has been detached and so cannot be used as a response");
          }
          ReadableByteStreamControllerRespondWithNewView(this._associatedReadableByteStreamController, view);
        }
      }
      Object.defineProperties(ReadableStreamBYOBRequest.prototype, {
        respond: { enumerable: true },
        respondWithNewView: { enumerable: true },
        view: { enumerable: true }
      });
      setFunctionName(ReadableStreamBYOBRequest.prototype.respond, "respond");
      setFunctionName(ReadableStreamBYOBRequest.prototype.respondWithNewView, "respondWithNewView");
      if (typeof Symbol.toStringTag === "symbol") {
        Object.defineProperty(ReadableStreamBYOBRequest.prototype, Symbol.toStringTag, {
          value: "ReadableStreamBYOBRequest",
          configurable: true
        });
      }
      class ReadableByteStreamController {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        /**
         * Returns the current BYOB pull request, or `null` if there isn't one.
         */
        get byobRequest() {
          if (!IsReadableByteStreamController(this)) {
            throw byteStreamControllerBrandCheckException("byobRequest");
          }
          return ReadableByteStreamControllerGetBYOBRequest(this);
        }
        /**
         * Returns the desired size to fill the controlled stream's internal queue. It can be negative, if the queue is
         * over-full. An underlying byte source ought to use this information to determine when and how to apply backpressure.
         */
        get desiredSize() {
          if (!IsReadableByteStreamController(this)) {
            throw byteStreamControllerBrandCheckException("desiredSize");
          }
          return ReadableByteStreamControllerGetDesiredSize(this);
        }
        /**
         * Closes the controlled readable stream. Consumers will still be able to read any previously-enqueued chunks from
         * the stream, but once those are read, the stream will become closed.
         */
        close() {
          if (!IsReadableByteStreamController(this)) {
            throw byteStreamControllerBrandCheckException("close");
          }
          if (this._closeRequested) {
            throw new TypeError("The stream has already been closed; do not close it again!");
          }
          const state = this._controlledReadableByteStream._state;
          if (state !== "readable") {
            throw new TypeError(`The stream (in ${state} state) is not in the readable state and cannot be closed`);
          }
          ReadableByteStreamControllerClose(this);
        }
        enqueue(chunk) {
          if (!IsReadableByteStreamController(this)) {
            throw byteStreamControllerBrandCheckException("enqueue");
          }
          assertRequiredArgument(chunk, 1, "enqueue");
          if (!ArrayBuffer.isView(chunk)) {
            throw new TypeError("chunk must be an array buffer view");
          }
          if (chunk.byteLength === 0) {
            throw new TypeError("chunk must have non-zero byteLength");
          }
          if (chunk.buffer.byteLength === 0) {
            throw new TypeError(`chunk's buffer must have non-zero byteLength`);
          }
          if (this._closeRequested) {
            throw new TypeError("stream is closed or draining");
          }
          const state = this._controlledReadableByteStream._state;
          if (state !== "readable") {
            throw new TypeError(`The stream (in ${state} state) is not in the readable state and cannot be enqueued to`);
          }
          ReadableByteStreamControllerEnqueue(this, chunk);
        }
        /**
         * Errors the controlled readable stream, making all future interactions with it fail with the given error `e`.
         */
        error(e2 = void 0) {
          if (!IsReadableByteStreamController(this)) {
            throw byteStreamControllerBrandCheckException("error");
          }
          ReadableByteStreamControllerError(this, e2);
        }
        /** @internal */
        [CancelSteps](reason) {
          ReadableByteStreamControllerClearPendingPullIntos(this);
          ResetQueue(this);
          const result = this._cancelAlgorithm(reason);
          ReadableByteStreamControllerClearAlgorithms(this);
          return result;
        }
        /** @internal */
        [PullSteps](readRequest) {
          const stream = this._controlledReadableByteStream;
          if (this._queueTotalSize > 0) {
            ReadableByteStreamControllerFillReadRequestFromQueue(this, readRequest);
            return;
          }
          const autoAllocateChunkSize = this._autoAllocateChunkSize;
          if (autoAllocateChunkSize !== void 0) {
            let buffer;
            try {
              buffer = new ArrayBuffer(autoAllocateChunkSize);
            } catch (bufferE) {
              readRequest._errorSteps(bufferE);
              return;
            }
            const pullIntoDescriptor = {
              buffer,
              bufferByteLength: autoAllocateChunkSize,
              byteOffset: 0,
              byteLength: autoAllocateChunkSize,
              bytesFilled: 0,
              minimumFill: 1,
              elementSize: 1,
              viewConstructor: Uint8Array,
              readerType: "default"
            };
            this._pendingPullIntos.push(pullIntoDescriptor);
          }
          ReadableStreamAddReadRequest(stream, readRequest);
          ReadableByteStreamControllerCallPullIfNeeded(this);
        }
        /** @internal */
        [ReleaseSteps]() {
          if (this._pendingPullIntos.length > 0) {
            const firstPullInto = this._pendingPullIntos.peek();
            firstPullInto.readerType = "none";
            this._pendingPullIntos = new SimpleQueue();
            this._pendingPullIntos.push(firstPullInto);
          }
        }
      }
      Object.defineProperties(ReadableByteStreamController.prototype, {
        close: { enumerable: true },
        enqueue: { enumerable: true },
        error: { enumerable: true },
        byobRequest: { enumerable: true },
        desiredSize: { enumerable: true }
      });
      setFunctionName(ReadableByteStreamController.prototype.close, "close");
      setFunctionName(ReadableByteStreamController.prototype.enqueue, "enqueue");
      setFunctionName(ReadableByteStreamController.prototype.error, "error");
      if (typeof Symbol.toStringTag === "symbol") {
        Object.defineProperty(ReadableByteStreamController.prototype, Symbol.toStringTag, {
          value: "ReadableByteStreamController",
          configurable: true
        });
      }
      function IsReadableByteStreamController(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_controlledReadableByteStream")) {
          return false;
        }
        return x2 instanceof ReadableByteStreamController;
      }
      function IsReadableStreamBYOBRequest(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_associatedReadableByteStreamController")) {
          return false;
        }
        return x2 instanceof ReadableStreamBYOBRequest;
      }
      function ReadableByteStreamControllerCallPullIfNeeded(controller) {
        const shouldPull = ReadableByteStreamControllerShouldCallPull(controller);
        if (!shouldPull) {
          return;
        }
        if (controller._pulling) {
          controller._pullAgain = true;
          return;
        }
        controller._pulling = true;
        const pullPromise = controller._pullAlgorithm();
        uponPromise(pullPromise, () => {
          controller._pulling = false;
          if (controller._pullAgain) {
            controller._pullAgain = false;
            ReadableByteStreamControllerCallPullIfNeeded(controller);
          }
          return null;
        }, (e2) => {
          ReadableByteStreamControllerError(controller, e2);
          return null;
        });
      }
      function ReadableByteStreamControllerClearPendingPullIntos(controller) {
        ReadableByteStreamControllerInvalidateBYOBRequest(controller);
        controller._pendingPullIntos = new SimpleQueue();
      }
      function ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor) {
        let done = false;
        if (stream._state === "closed") {
          done = true;
        }
        const filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
        if (pullIntoDescriptor.readerType === "default") {
          ReadableStreamFulfillReadRequest(stream, filledView, done);
        } else {
          ReadableStreamFulfillReadIntoRequest(stream, filledView, done);
        }
      }
      function ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor) {
        const bytesFilled = pullIntoDescriptor.bytesFilled;
        const elementSize = pullIntoDescriptor.elementSize;
        return new pullIntoDescriptor.viewConstructor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, bytesFilled / elementSize);
      }
      function ReadableByteStreamControllerEnqueueChunkToQueue(controller, buffer, byteOffset, byteLength) {
        controller._queue.push({ buffer, byteOffset, byteLength });
        controller._queueTotalSize += byteLength;
      }
      function ReadableByteStreamControllerEnqueueClonedChunkToQueue(controller, buffer, byteOffset, byteLength) {
        let clonedChunk;
        try {
          clonedChunk = ArrayBufferSlice(buffer, byteOffset, byteOffset + byteLength);
        } catch (cloneE) {
          ReadableByteStreamControllerError(controller, cloneE);
          throw cloneE;
        }
        ReadableByteStreamControllerEnqueueChunkToQueue(controller, clonedChunk, 0, byteLength);
      }
      function ReadableByteStreamControllerEnqueueDetachedPullIntoToQueue(controller, firstDescriptor) {
        if (firstDescriptor.bytesFilled > 0) {
          ReadableByteStreamControllerEnqueueClonedChunkToQueue(controller, firstDescriptor.buffer, firstDescriptor.byteOffset, firstDescriptor.bytesFilled);
        }
        ReadableByteStreamControllerShiftPendingPullInto(controller);
      }
      function ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor) {
        const maxBytesToCopy = Math.min(controller._queueTotalSize, pullIntoDescriptor.byteLength - pullIntoDescriptor.bytesFilled);
        const maxBytesFilled = pullIntoDescriptor.bytesFilled + maxBytesToCopy;
        let totalBytesToCopyRemaining = maxBytesToCopy;
        let ready = false;
        const remainderBytes = maxBytesFilled % pullIntoDescriptor.elementSize;
        const maxAlignedBytes = maxBytesFilled - remainderBytes;
        if (maxAlignedBytes >= pullIntoDescriptor.minimumFill) {
          totalBytesToCopyRemaining = maxAlignedBytes - pullIntoDescriptor.bytesFilled;
          ready = true;
        }
        const queue = controller._queue;
        while (totalBytesToCopyRemaining > 0) {
          const headOfQueue = queue.peek();
          const bytesToCopy = Math.min(totalBytesToCopyRemaining, headOfQueue.byteLength);
          const destStart = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
          CopyDataBlockBytes(pullIntoDescriptor.buffer, destStart, headOfQueue.buffer, headOfQueue.byteOffset, bytesToCopy);
          if (headOfQueue.byteLength === bytesToCopy) {
            queue.shift();
          } else {
            headOfQueue.byteOffset += bytesToCopy;
            headOfQueue.byteLength -= bytesToCopy;
          }
          controller._queueTotalSize -= bytesToCopy;
          ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesToCopy, pullIntoDescriptor);
          totalBytesToCopyRemaining -= bytesToCopy;
        }
        return ready;
      }
      function ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, size, pullIntoDescriptor) {
        pullIntoDescriptor.bytesFilled += size;
      }
      function ReadableByteStreamControllerHandleQueueDrain(controller) {
        if (controller._queueTotalSize === 0 && controller._closeRequested) {
          ReadableByteStreamControllerClearAlgorithms(controller);
          ReadableStreamClose(controller._controlledReadableByteStream);
        } else {
          ReadableByteStreamControllerCallPullIfNeeded(controller);
        }
      }
      function ReadableByteStreamControllerInvalidateBYOBRequest(controller) {
        if (controller._byobRequest === null) {
          return;
        }
        controller._byobRequest._associatedReadableByteStreamController = void 0;
        controller._byobRequest._view = null;
        controller._byobRequest = null;
      }
      function ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller) {
        while (controller._pendingPullIntos.length > 0) {
          if (controller._queueTotalSize === 0) {
            return;
          }
          const pullIntoDescriptor = controller._pendingPullIntos.peek();
          if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor)) {
            ReadableByteStreamControllerShiftPendingPullInto(controller);
            ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableByteStream, pullIntoDescriptor);
          }
        }
      }
      function ReadableByteStreamControllerProcessReadRequestsUsingQueue(controller) {
        const reader = controller._controlledReadableByteStream._reader;
        while (reader._readRequests.length > 0) {
          if (controller._queueTotalSize === 0) {
            return;
          }
          const readRequest = reader._readRequests.shift();
          ReadableByteStreamControllerFillReadRequestFromQueue(controller, readRequest);
        }
      }
      function ReadableByteStreamControllerPullInto(controller, view, min, readIntoRequest) {
        const stream = controller._controlledReadableByteStream;
        const ctor = view.constructor;
        const elementSize = arrayBufferViewElementSize(ctor);
        const { byteOffset, byteLength } = view;
        const minimumFill = min * elementSize;
        let buffer;
        try {
          buffer = TransferArrayBuffer(view.buffer);
        } catch (e2) {
          readIntoRequest._errorSteps(e2);
          return;
        }
        const pullIntoDescriptor = {
          buffer,
          bufferByteLength: buffer.byteLength,
          byteOffset,
          byteLength,
          bytesFilled: 0,
          minimumFill,
          elementSize,
          viewConstructor: ctor,
          readerType: "byob"
        };
        if (controller._pendingPullIntos.length > 0) {
          controller._pendingPullIntos.push(pullIntoDescriptor);
          ReadableStreamAddReadIntoRequest(stream, readIntoRequest);
          return;
        }
        if (stream._state === "closed") {
          const emptyView = new ctor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, 0);
          readIntoRequest._closeSteps(emptyView);
          return;
        }
        if (controller._queueTotalSize > 0) {
          if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor)) {
            const filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
            ReadableByteStreamControllerHandleQueueDrain(controller);
            readIntoRequest._chunkSteps(filledView);
            return;
          }
          if (controller._closeRequested) {
            const e2 = new TypeError("Insufficient bytes to fill elements in the given buffer");
            ReadableByteStreamControllerError(controller, e2);
            readIntoRequest._errorSteps(e2);
            return;
          }
        }
        controller._pendingPullIntos.push(pullIntoDescriptor);
        ReadableStreamAddReadIntoRequest(stream, readIntoRequest);
        ReadableByteStreamControllerCallPullIfNeeded(controller);
      }
      function ReadableByteStreamControllerRespondInClosedState(controller, firstDescriptor) {
        if (firstDescriptor.readerType === "none") {
          ReadableByteStreamControllerShiftPendingPullInto(controller);
        }
        const stream = controller._controlledReadableByteStream;
        if (ReadableStreamHasBYOBReader(stream)) {
          while (ReadableStreamGetNumReadIntoRequests(stream) > 0) {
            const pullIntoDescriptor = ReadableByteStreamControllerShiftPendingPullInto(controller);
            ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor);
          }
        }
      }
      function ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, pullIntoDescriptor) {
        ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesWritten, pullIntoDescriptor);
        if (pullIntoDescriptor.readerType === "none") {
          ReadableByteStreamControllerEnqueueDetachedPullIntoToQueue(controller, pullIntoDescriptor);
          ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
          return;
        }
        if (pullIntoDescriptor.bytesFilled < pullIntoDescriptor.minimumFill) {
          return;
        }
        ReadableByteStreamControllerShiftPendingPullInto(controller);
        const remainderSize = pullIntoDescriptor.bytesFilled % pullIntoDescriptor.elementSize;
        if (remainderSize > 0) {
          const end = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
          ReadableByteStreamControllerEnqueueClonedChunkToQueue(controller, pullIntoDescriptor.buffer, end - remainderSize, remainderSize);
        }
        pullIntoDescriptor.bytesFilled -= remainderSize;
        ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableByteStream, pullIntoDescriptor);
        ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
      }
      function ReadableByteStreamControllerRespondInternal(controller, bytesWritten) {
        const firstDescriptor = controller._pendingPullIntos.peek();
        ReadableByteStreamControllerInvalidateBYOBRequest(controller);
        const state = controller._controlledReadableByteStream._state;
        if (state === "closed") {
          ReadableByteStreamControllerRespondInClosedState(controller, firstDescriptor);
        } else {
          ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, firstDescriptor);
        }
        ReadableByteStreamControllerCallPullIfNeeded(controller);
      }
      function ReadableByteStreamControllerShiftPendingPullInto(controller) {
        const descriptor = controller._pendingPullIntos.shift();
        return descriptor;
      }
      function ReadableByteStreamControllerShouldCallPull(controller) {
        const stream = controller._controlledReadableByteStream;
        if (stream._state !== "readable") {
          return false;
        }
        if (controller._closeRequested) {
          return false;
        }
        if (!controller._started) {
          return false;
        }
        if (ReadableStreamHasDefaultReader(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
          return true;
        }
        if (ReadableStreamHasBYOBReader(stream) && ReadableStreamGetNumReadIntoRequests(stream) > 0) {
          return true;
        }
        const desiredSize = ReadableByteStreamControllerGetDesiredSize(controller);
        if (desiredSize > 0) {
          return true;
        }
        return false;
      }
      function ReadableByteStreamControllerClearAlgorithms(controller) {
        controller._pullAlgorithm = void 0;
        controller._cancelAlgorithm = void 0;
      }
      function ReadableByteStreamControllerClose(controller) {
        const stream = controller._controlledReadableByteStream;
        if (controller._closeRequested || stream._state !== "readable") {
          return;
        }
        if (controller._queueTotalSize > 0) {
          controller._closeRequested = true;
          return;
        }
        if (controller._pendingPullIntos.length > 0) {
          const firstPendingPullInto = controller._pendingPullIntos.peek();
          if (firstPendingPullInto.bytesFilled % firstPendingPullInto.elementSize !== 0) {
            const e2 = new TypeError("Insufficient bytes to fill elements in the given buffer");
            ReadableByteStreamControllerError(controller, e2);
            throw e2;
          }
        }
        ReadableByteStreamControllerClearAlgorithms(controller);
        ReadableStreamClose(stream);
      }
      function ReadableByteStreamControllerEnqueue(controller, chunk) {
        const stream = controller._controlledReadableByteStream;
        if (controller._closeRequested || stream._state !== "readable") {
          return;
        }
        const { buffer, byteOffset, byteLength } = chunk;
        if (IsDetachedBuffer(buffer)) {
          throw new TypeError("chunk's buffer is detached and so cannot be enqueued");
        }
        const transferredBuffer = TransferArrayBuffer(buffer);
        if (controller._pendingPullIntos.length > 0) {
          const firstPendingPullInto = controller._pendingPullIntos.peek();
          if (IsDetachedBuffer(firstPendingPullInto.buffer)) {
            throw new TypeError("The BYOB request's buffer has been detached and so cannot be filled with an enqueued chunk");
          }
          ReadableByteStreamControllerInvalidateBYOBRequest(controller);
          firstPendingPullInto.buffer = TransferArrayBuffer(firstPendingPullInto.buffer);
          if (firstPendingPullInto.readerType === "none") {
            ReadableByteStreamControllerEnqueueDetachedPullIntoToQueue(controller, firstPendingPullInto);
          }
        }
        if (ReadableStreamHasDefaultReader(stream)) {
          ReadableByteStreamControllerProcessReadRequestsUsingQueue(controller);
          if (ReadableStreamGetNumReadRequests(stream) === 0) {
            ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
          } else {
            if (controller._pendingPullIntos.length > 0) {
              ReadableByteStreamControllerShiftPendingPullInto(controller);
            }
            const transferredView = new Uint8Array(transferredBuffer, byteOffset, byteLength);
            ReadableStreamFulfillReadRequest(stream, transferredView, false);
          }
        } else if (ReadableStreamHasBYOBReader(stream)) {
          ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
          ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
        } else {
          ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
        }
        ReadableByteStreamControllerCallPullIfNeeded(controller);
      }
      function ReadableByteStreamControllerError(controller, e2) {
        const stream = controller._controlledReadableByteStream;
        if (stream._state !== "readable") {
          return;
        }
        ReadableByteStreamControllerClearPendingPullIntos(controller);
        ResetQueue(controller);
        ReadableByteStreamControllerClearAlgorithms(controller);
        ReadableStreamError(stream, e2);
      }
      function ReadableByteStreamControllerFillReadRequestFromQueue(controller, readRequest) {
        const entry = controller._queue.shift();
        controller._queueTotalSize -= entry.byteLength;
        ReadableByteStreamControllerHandleQueueDrain(controller);
        const view = new Uint8Array(entry.buffer, entry.byteOffset, entry.byteLength);
        readRequest._chunkSteps(view);
      }
      function ReadableByteStreamControllerGetBYOBRequest(controller) {
        if (controller._byobRequest === null && controller._pendingPullIntos.length > 0) {
          const firstDescriptor = controller._pendingPullIntos.peek();
          const view = new Uint8Array(firstDescriptor.buffer, firstDescriptor.byteOffset + firstDescriptor.bytesFilled, firstDescriptor.byteLength - firstDescriptor.bytesFilled);
          const byobRequest = Object.create(ReadableStreamBYOBRequest.prototype);
          SetUpReadableStreamBYOBRequest(byobRequest, controller, view);
          controller._byobRequest = byobRequest;
        }
        return controller._byobRequest;
      }
      function ReadableByteStreamControllerGetDesiredSize(controller) {
        const state = controller._controlledReadableByteStream._state;
        if (state === "errored") {
          return null;
        }
        if (state === "closed") {
          return 0;
        }
        return controller._strategyHWM - controller._queueTotalSize;
      }
      function ReadableByteStreamControllerRespond(controller, bytesWritten) {
        const firstDescriptor = controller._pendingPullIntos.peek();
        const state = controller._controlledReadableByteStream._state;
        if (state === "closed") {
          if (bytesWritten !== 0) {
            throw new TypeError("bytesWritten must be 0 when calling respond() on a closed stream");
          }
        } else {
          if (bytesWritten === 0) {
            throw new TypeError("bytesWritten must be greater than 0 when calling respond() on a readable stream");
          }
          if (firstDescriptor.bytesFilled + bytesWritten > firstDescriptor.byteLength) {
            throw new RangeError("bytesWritten out of range");
          }
        }
        firstDescriptor.buffer = TransferArrayBuffer(firstDescriptor.buffer);
        ReadableByteStreamControllerRespondInternal(controller, bytesWritten);
      }
      function ReadableByteStreamControllerRespondWithNewView(controller, view) {
        const firstDescriptor = controller._pendingPullIntos.peek();
        const state = controller._controlledReadableByteStream._state;
        if (state === "closed") {
          if (view.byteLength !== 0) {
            throw new TypeError("The view's length must be 0 when calling respondWithNewView() on a closed stream");
          }
        } else {
          if (view.byteLength === 0) {
            throw new TypeError("The view's length must be greater than 0 when calling respondWithNewView() on a readable stream");
          }
        }
        if (firstDescriptor.byteOffset + firstDescriptor.bytesFilled !== view.byteOffset) {
          throw new RangeError("The region specified by view does not match byobRequest");
        }
        if (firstDescriptor.bufferByteLength !== view.buffer.byteLength) {
          throw new RangeError("The buffer of view has different capacity than byobRequest");
        }
        if (firstDescriptor.bytesFilled + view.byteLength > firstDescriptor.byteLength) {
          throw new RangeError("The region specified by view is larger than byobRequest");
        }
        const viewByteLength = view.byteLength;
        firstDescriptor.buffer = TransferArrayBuffer(view.buffer);
        ReadableByteStreamControllerRespondInternal(controller, viewByteLength);
      }
      function SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize) {
        controller._controlledReadableByteStream = stream;
        controller._pullAgain = false;
        controller._pulling = false;
        controller._byobRequest = null;
        controller._queue = controller._queueTotalSize = void 0;
        ResetQueue(controller);
        controller._closeRequested = false;
        controller._started = false;
        controller._strategyHWM = highWaterMark;
        controller._pullAlgorithm = pullAlgorithm;
        controller._cancelAlgorithm = cancelAlgorithm;
        controller._autoAllocateChunkSize = autoAllocateChunkSize;
        controller._pendingPullIntos = new SimpleQueue();
        stream._readableStreamController = controller;
        const startResult = startAlgorithm();
        uponPromise(promiseResolvedWith(startResult), () => {
          controller._started = true;
          ReadableByteStreamControllerCallPullIfNeeded(controller);
          return null;
        }, (r2) => {
          ReadableByteStreamControllerError(controller, r2);
          return null;
        });
      }
      function SetUpReadableByteStreamControllerFromUnderlyingSource(stream, underlyingByteSource, highWaterMark) {
        const controller = Object.create(ReadableByteStreamController.prototype);
        let startAlgorithm;
        let pullAlgorithm;
        let cancelAlgorithm;
        if (underlyingByteSource.start !== void 0) {
          startAlgorithm = () => underlyingByteSource.start(controller);
        } else {
          startAlgorithm = () => void 0;
        }
        if (underlyingByteSource.pull !== void 0) {
          pullAlgorithm = () => underlyingByteSource.pull(controller);
        } else {
          pullAlgorithm = () => promiseResolvedWith(void 0);
        }
        if (underlyingByteSource.cancel !== void 0) {
          cancelAlgorithm = (reason) => underlyingByteSource.cancel(reason);
        } else {
          cancelAlgorithm = () => promiseResolvedWith(void 0);
        }
        const autoAllocateChunkSize = underlyingByteSource.autoAllocateChunkSize;
        if (autoAllocateChunkSize === 0) {
          throw new TypeError("autoAllocateChunkSize must be greater than 0");
        }
        SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize);
      }
      function SetUpReadableStreamBYOBRequest(request, controller, view) {
        request._associatedReadableByteStreamController = controller;
        request._view = view;
      }
      function byobRequestBrandCheckException(name) {
        return new TypeError(`ReadableStreamBYOBRequest.prototype.${name} can only be used on a ReadableStreamBYOBRequest`);
      }
      function byteStreamControllerBrandCheckException(name) {
        return new TypeError(`ReadableByteStreamController.prototype.${name} can only be used on a ReadableByteStreamController`);
      }
      function convertReaderOptions(options, context) {
        assertDictionary(options, context);
        const mode = options === null || options === void 0 ? void 0 : options.mode;
        return {
          mode: mode === void 0 ? void 0 : convertReadableStreamReaderMode(mode, `${context} has member 'mode' that`)
        };
      }
      function convertReadableStreamReaderMode(mode, context) {
        mode = `${mode}`;
        if (mode !== "byob") {
          throw new TypeError(`${context} '${mode}' is not a valid enumeration value for ReadableStreamReaderMode`);
        }
        return mode;
      }
      function convertByobReadOptions(options, context) {
        var _a2;
        assertDictionary(options, context);
        const min = (_a2 = options === null || options === void 0 ? void 0 : options.min) !== null && _a2 !== void 0 ? _a2 : 1;
        return {
          min: convertUnsignedLongLongWithEnforceRange(min, `${context} has member 'min' that`)
        };
      }
      function AcquireReadableStreamBYOBReader(stream) {
        return new ReadableStreamBYOBReader(stream);
      }
      function ReadableStreamAddReadIntoRequest(stream, readIntoRequest) {
        stream._reader._readIntoRequests.push(readIntoRequest);
      }
      function ReadableStreamFulfillReadIntoRequest(stream, chunk, done) {
        const reader = stream._reader;
        const readIntoRequest = reader._readIntoRequests.shift();
        if (done) {
          readIntoRequest._closeSteps(chunk);
        } else {
          readIntoRequest._chunkSteps(chunk);
        }
      }
      function ReadableStreamGetNumReadIntoRequests(stream) {
        return stream._reader._readIntoRequests.length;
      }
      function ReadableStreamHasBYOBReader(stream) {
        const reader = stream._reader;
        if (reader === void 0) {
          return false;
        }
        if (!IsReadableStreamBYOBReader(reader)) {
          return false;
        }
        return true;
      }
      class ReadableStreamBYOBReader {
        constructor(stream) {
          assertRequiredArgument(stream, 1, "ReadableStreamBYOBReader");
          assertReadableStream(stream, "First parameter");
          if (IsReadableStreamLocked(stream)) {
            throw new TypeError("This stream has already been locked for exclusive reading by another reader");
          }
          if (!IsReadableByteStreamController(stream._readableStreamController)) {
            throw new TypeError("Cannot construct a ReadableStreamBYOBReader for a stream not constructed with a byte source");
          }
          ReadableStreamReaderGenericInitialize(this, stream);
          this._readIntoRequests = new SimpleQueue();
        }
        /**
         * Returns a promise that will be fulfilled when the stream becomes closed, or rejected if the stream ever errors or
         * the reader's lock is released before the stream finishes closing.
         */
        get closed() {
          if (!IsReadableStreamBYOBReader(this)) {
            return promiseRejectedWith(byobReaderBrandCheckException("closed"));
          }
          return this._closedPromise;
        }
        /**
         * If the reader is active, behaves the same as {@link ReadableStream.cancel | stream.cancel(reason)}.
         */
        cancel(reason = void 0) {
          if (!IsReadableStreamBYOBReader(this)) {
            return promiseRejectedWith(byobReaderBrandCheckException("cancel"));
          }
          if (this._ownerReadableStream === void 0) {
            return promiseRejectedWith(readerLockException("cancel"));
          }
          return ReadableStreamReaderGenericCancel(this, reason);
        }
        read(view, rawOptions = {}) {
          if (!IsReadableStreamBYOBReader(this)) {
            return promiseRejectedWith(byobReaderBrandCheckException("read"));
          }
          if (!ArrayBuffer.isView(view)) {
            return promiseRejectedWith(new TypeError("view must be an array buffer view"));
          }
          if (view.byteLength === 0) {
            return promiseRejectedWith(new TypeError("view must have non-zero byteLength"));
          }
          if (view.buffer.byteLength === 0) {
            return promiseRejectedWith(new TypeError(`view's buffer must have non-zero byteLength`));
          }
          if (IsDetachedBuffer(view.buffer)) {
            return promiseRejectedWith(new TypeError("view's buffer has been detached"));
          }
          let options;
          try {
            options = convertByobReadOptions(rawOptions, "options");
          } catch (e2) {
            return promiseRejectedWith(e2);
          }
          const min = options.min;
          if (min === 0) {
            return promiseRejectedWith(new TypeError("options.min must be greater than 0"));
          }
          if (!isDataView(view)) {
            if (min > view.length) {
              return promiseRejectedWith(new RangeError("options.min must be less than or equal to view's length"));
            }
          } else if (min > view.byteLength) {
            return promiseRejectedWith(new RangeError("options.min must be less than or equal to view's byteLength"));
          }
          if (this._ownerReadableStream === void 0) {
            return promiseRejectedWith(readerLockException("read from"));
          }
          let resolvePromise;
          let rejectPromise;
          const promise = newPromise((resolve, reject) => {
            resolvePromise = resolve;
            rejectPromise = reject;
          });
          const readIntoRequest = {
            _chunkSteps: (chunk) => resolvePromise({ value: chunk, done: false }),
            _closeSteps: (chunk) => resolvePromise({ value: chunk, done: true }),
            _errorSteps: (e2) => rejectPromise(e2)
          };
          ReadableStreamBYOBReaderRead(this, view, min, readIntoRequest);
          return promise;
        }
        /**
         * Releases the reader's lock on the corresponding stream. After the lock is released, the reader is no longer active.
         * If the associated stream is errored when the lock is released, the reader will appear errored in the same way
         * from now on; otherwise, the reader will appear closed.
         *
         * A reader's lock cannot be released while it still has a pending read request, i.e., if a promise returned by
         * the reader's {@link ReadableStreamBYOBReader.read | read()} method has not yet been settled. Attempting to
         * do so will throw a `TypeError` and leave the reader locked to the stream.
         */
        releaseLock() {
          if (!IsReadableStreamBYOBReader(this)) {
            throw byobReaderBrandCheckException("releaseLock");
          }
          if (this._ownerReadableStream === void 0) {
            return;
          }
          ReadableStreamBYOBReaderRelease(this);
        }
      }
      Object.defineProperties(ReadableStreamBYOBReader.prototype, {
        cancel: { enumerable: true },
        read: { enumerable: true },
        releaseLock: { enumerable: true },
        closed: { enumerable: true }
      });
      setFunctionName(ReadableStreamBYOBReader.prototype.cancel, "cancel");
      setFunctionName(ReadableStreamBYOBReader.prototype.read, "read");
      setFunctionName(ReadableStreamBYOBReader.prototype.releaseLock, "releaseLock");
      if (typeof Symbol.toStringTag === "symbol") {
        Object.defineProperty(ReadableStreamBYOBReader.prototype, Symbol.toStringTag, {
          value: "ReadableStreamBYOBReader",
          configurable: true
        });
      }
      function IsReadableStreamBYOBReader(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_readIntoRequests")) {
          return false;
        }
        return x2 instanceof ReadableStreamBYOBReader;
      }
      function ReadableStreamBYOBReaderRead(reader, view, min, readIntoRequest) {
        const stream = reader._ownerReadableStream;
        stream._disturbed = true;
        if (stream._state === "errored") {
          readIntoRequest._errorSteps(stream._storedError);
        } else {
          ReadableByteStreamControllerPullInto(stream._readableStreamController, view, min, readIntoRequest);
        }
      }
      function ReadableStreamBYOBReaderRelease(reader) {
        ReadableStreamReaderGenericRelease(reader);
        const e2 = new TypeError("Reader was released");
        ReadableStreamBYOBReaderErrorReadIntoRequests(reader, e2);
      }
      function ReadableStreamBYOBReaderErrorReadIntoRequests(reader, e2) {
        const readIntoRequests = reader._readIntoRequests;
        reader._readIntoRequests = new SimpleQueue();
        readIntoRequests.forEach((readIntoRequest) => {
          readIntoRequest._errorSteps(e2);
        });
      }
      function byobReaderBrandCheckException(name) {
        return new TypeError(`ReadableStreamBYOBReader.prototype.${name} can only be used on a ReadableStreamBYOBReader`);
      }
      function ExtractHighWaterMark(strategy, defaultHWM) {
        const { highWaterMark } = strategy;
        if (highWaterMark === void 0) {
          return defaultHWM;
        }
        if (NumberIsNaN(highWaterMark) || highWaterMark < 0) {
          throw new RangeError("Invalid highWaterMark");
        }
        return highWaterMark;
      }
      function ExtractSizeAlgorithm(strategy) {
        const { size } = strategy;
        if (!size) {
          return () => 1;
        }
        return size;
      }
      function convertQueuingStrategy(init, context) {
        assertDictionary(init, context);
        const highWaterMark = init === null || init === void 0 ? void 0 : init.highWaterMark;
        const size = init === null || init === void 0 ? void 0 : init.size;
        return {
          highWaterMark: highWaterMark === void 0 ? void 0 : convertUnrestrictedDouble(highWaterMark),
          size: size === void 0 ? void 0 : convertQueuingStrategySize(size, `${context} has member 'size' that`)
        };
      }
      function convertQueuingStrategySize(fn, context) {
        assertFunction(fn, context);
        return (chunk) => convertUnrestrictedDouble(fn(chunk));
      }
      function convertUnderlyingSink(original, context) {
        assertDictionary(original, context);
        const abort = original === null || original === void 0 ? void 0 : original.abort;
        const close = original === null || original === void 0 ? void 0 : original.close;
        const start = original === null || original === void 0 ? void 0 : original.start;
        const type = original === null || original === void 0 ? void 0 : original.type;
        const write = original === null || original === void 0 ? void 0 : original.write;
        return {
          abort: abort === void 0 ? void 0 : convertUnderlyingSinkAbortCallback(abort, original, `${context} has member 'abort' that`),
          close: close === void 0 ? void 0 : convertUnderlyingSinkCloseCallback(close, original, `${context} has member 'close' that`),
          start: start === void 0 ? void 0 : convertUnderlyingSinkStartCallback(start, original, `${context} has member 'start' that`),
          write: write === void 0 ? void 0 : convertUnderlyingSinkWriteCallback(write, original, `${context} has member 'write' that`),
          type
        };
      }
      function convertUnderlyingSinkAbortCallback(fn, original, context) {
        assertFunction(fn, context);
        return (reason) => promiseCall(fn, original, [reason]);
      }
      function convertUnderlyingSinkCloseCallback(fn, original, context) {
        assertFunction(fn, context);
        return () => promiseCall(fn, original, []);
      }
      function convertUnderlyingSinkStartCallback(fn, original, context) {
        assertFunction(fn, context);
        return (controller) => reflectCall(fn, original, [controller]);
      }
      function convertUnderlyingSinkWriteCallback(fn, original, context) {
        assertFunction(fn, context);
        return (chunk, controller) => promiseCall(fn, original, [chunk, controller]);
      }
      function assertWritableStream(x2, context) {
        if (!IsWritableStream(x2)) {
          throw new TypeError(`${context} is not a WritableStream.`);
        }
      }
      function isAbortSignal2(value) {
        if (typeof value !== "object" || value === null) {
          return false;
        }
        try {
          return typeof value.aborted === "boolean";
        } catch (_a2) {
          return false;
        }
      }
      const supportsAbortController = typeof AbortController === "function";
      function createAbortController() {
        if (supportsAbortController) {
          return new AbortController();
        }
        return void 0;
      }
      class WritableStream {
        constructor(rawUnderlyingSink = {}, rawStrategy = {}) {
          if (rawUnderlyingSink === void 0) {
            rawUnderlyingSink = null;
          } else {
            assertObject(rawUnderlyingSink, "First parameter");
          }
          const strategy = convertQueuingStrategy(rawStrategy, "Second parameter");
          const underlyingSink = convertUnderlyingSink(rawUnderlyingSink, "First parameter");
          InitializeWritableStream(this);
          const type = underlyingSink.type;
          if (type !== void 0) {
            throw new RangeError("Invalid type is specified");
          }
          const sizeAlgorithm = ExtractSizeAlgorithm(strategy);
          const highWaterMark = ExtractHighWaterMark(strategy, 1);
          SetUpWritableStreamDefaultControllerFromUnderlyingSink(this, underlyingSink, highWaterMark, sizeAlgorithm);
        }
        /**
         * Returns whether or not the writable stream is locked to a writer.
         */
        get locked() {
          if (!IsWritableStream(this)) {
            throw streamBrandCheckException$2("locked");
          }
          return IsWritableStreamLocked(this);
        }
        /**
         * Aborts the stream, signaling that the producer can no longer successfully write to the stream and it is to be
         * immediately moved to an errored state, with any queued-up writes discarded. This will also execute any abort
         * mechanism of the underlying sink.
         *
         * The returned promise will fulfill if the stream shuts down successfully, or reject if the underlying sink signaled
         * that there was an error doing so. Additionally, it will reject with a `TypeError` (without attempting to cancel
         * the stream) if the stream is currently locked.
         */
        abort(reason = void 0) {
          if (!IsWritableStream(this)) {
            return promiseRejectedWith(streamBrandCheckException$2("abort"));
          }
          if (IsWritableStreamLocked(this)) {
            return promiseRejectedWith(new TypeError("Cannot abort a stream that already has a writer"));
          }
          return WritableStreamAbort(this, reason);
        }
        /**
         * Closes the stream. The underlying sink will finish processing any previously-written chunks, before invoking its
         * close behavior. During this time any further attempts to write will fail (without erroring the stream).
         *
         * The method returns a promise that will fulfill if all remaining chunks are successfully written and the stream
         * successfully closes, or rejects if an error is encountered during this process. Additionally, it will reject with
         * a `TypeError` (without attempting to cancel the stream) if the stream is currently locked.
         */
        close() {
          if (!IsWritableStream(this)) {
            return promiseRejectedWith(streamBrandCheckException$2("close"));
          }
          if (IsWritableStreamLocked(this)) {
            return promiseRejectedWith(new TypeError("Cannot close a stream that already has a writer"));
          }
          if (WritableStreamCloseQueuedOrInFlight(this)) {
            return promiseRejectedWith(new TypeError("Cannot close an already-closing stream"));
          }
          return WritableStreamClose(this);
        }
        /**
         * Creates a {@link WritableStreamDefaultWriter | writer} and locks the stream to the new writer. While the stream
         * is locked, no other writer can be acquired until this one is released.
         *
         * This functionality is especially useful for creating abstractions that desire the ability to write to a stream
         * without interruption or interleaving. By getting a writer for the stream, you can ensure nobody else can write at
         * the same time, which would cause the resulting written data to be unpredictable and probably useless.
         */
        getWriter() {
          if (!IsWritableStream(this)) {
            throw streamBrandCheckException$2("getWriter");
          }
          return AcquireWritableStreamDefaultWriter(this);
        }
      }
      Object.defineProperties(WritableStream.prototype, {
        abort: { enumerable: true },
        close: { enumerable: true },
        getWriter: { enumerable: true },
        locked: { enumerable: true }
      });
      setFunctionName(WritableStream.prototype.abort, "abort");
      setFunctionName(WritableStream.prototype.close, "close");
      setFunctionName(WritableStream.prototype.getWriter, "getWriter");
      if (typeof Symbol.toStringTag === "symbol") {
        Object.defineProperty(WritableStream.prototype, Symbol.toStringTag, {
          value: "WritableStream",
          configurable: true
        });
      }
      function AcquireWritableStreamDefaultWriter(stream) {
        return new WritableStreamDefaultWriter(stream);
      }
      function CreateWritableStream(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark = 1, sizeAlgorithm = () => 1) {
        const stream = Object.create(WritableStream.prototype);
        InitializeWritableStream(stream);
        const controller = Object.create(WritableStreamDefaultController.prototype);
        SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
        return stream;
      }
      function InitializeWritableStream(stream) {
        stream._state = "writable";
        stream._storedError = void 0;
        stream._writer = void 0;
        stream._writableStreamController = void 0;
        stream._writeRequests = new SimpleQueue();
        stream._inFlightWriteRequest = void 0;
        stream._closeRequest = void 0;
        stream._inFlightCloseRequest = void 0;
        stream._pendingAbortRequest = void 0;
        stream._backpressure = false;
      }
      function IsWritableStream(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_writableStreamController")) {
          return false;
        }
        return x2 instanceof WritableStream;
      }
      function IsWritableStreamLocked(stream) {
        if (stream._writer === void 0) {
          return false;
        }
        return true;
      }
      function WritableStreamAbort(stream, reason) {
        var _a2;
        if (stream._state === "closed" || stream._state === "errored") {
          return promiseResolvedWith(void 0);
        }
        stream._writableStreamController._abortReason = reason;
        (_a2 = stream._writableStreamController._abortController) === null || _a2 === void 0 ? void 0 : _a2.abort(reason);
        const state = stream._state;
        if (state === "closed" || state === "errored") {
          return promiseResolvedWith(void 0);
        }
        if (stream._pendingAbortRequest !== void 0) {
          return stream._pendingAbortRequest._promise;
        }
        let wasAlreadyErroring = false;
        if (state === "erroring") {
          wasAlreadyErroring = true;
          reason = void 0;
        }
        const promise = newPromise((resolve, reject) => {
          stream._pendingAbortRequest = {
            _promise: void 0,
            _resolve: resolve,
            _reject: reject,
            _reason: reason,
            _wasAlreadyErroring: wasAlreadyErroring
          };
        });
        stream._pendingAbortRequest._promise = promise;
        if (!wasAlreadyErroring) {
          WritableStreamStartErroring(stream, reason);
        }
        return promise;
      }
      function WritableStreamClose(stream) {
        const state = stream._state;
        if (state === "closed" || state === "errored") {
          return promiseRejectedWith(new TypeError(`The stream (in ${state} state) is not in the writable state and cannot be closed`));
        }
        const promise = newPromise((resolve, reject) => {
          const closeRequest = {
            _resolve: resolve,
            _reject: reject
          };
          stream._closeRequest = closeRequest;
        });
        const writer = stream._writer;
        if (writer !== void 0 && stream._backpressure && state === "writable") {
          defaultWriterReadyPromiseResolve(writer);
        }
        WritableStreamDefaultControllerClose(stream._writableStreamController);
        return promise;
      }
      function WritableStreamAddWriteRequest(stream) {
        const promise = newPromise((resolve, reject) => {
          const writeRequest = {
            _resolve: resolve,
            _reject: reject
          };
          stream._writeRequests.push(writeRequest);
        });
        return promise;
      }
      function WritableStreamDealWithRejection(stream, error) {
        const state = stream._state;
        if (state === "writable") {
          WritableStreamStartErroring(stream, error);
          return;
        }
        WritableStreamFinishErroring(stream);
      }
      function WritableStreamStartErroring(stream, reason) {
        const controller = stream._writableStreamController;
        stream._state = "erroring";
        stream._storedError = reason;
        const writer = stream._writer;
        if (writer !== void 0) {
          WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, reason);
        }
        if (!WritableStreamHasOperationMarkedInFlight(stream) && controller._started) {
          WritableStreamFinishErroring(stream);
        }
      }
      function WritableStreamFinishErroring(stream) {
        stream._state = "errored";
        stream._writableStreamController[ErrorSteps]();
        const storedError = stream._storedError;
        stream._writeRequests.forEach((writeRequest) => {
          writeRequest._reject(storedError);
        });
        stream._writeRequests = new SimpleQueue();
        if (stream._pendingAbortRequest === void 0) {
          WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
          return;
        }
        const abortRequest = stream._pendingAbortRequest;
        stream._pendingAbortRequest = void 0;
        if (abortRequest._wasAlreadyErroring) {
          abortRequest._reject(storedError);
          WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
          return;
        }
        const promise = stream._writableStreamController[AbortSteps](abortRequest._reason);
        uponPromise(promise, () => {
          abortRequest._resolve();
          WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
          return null;
        }, (reason) => {
          abortRequest._reject(reason);
          WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
          return null;
        });
      }
      function WritableStreamFinishInFlightWrite(stream) {
        stream._inFlightWriteRequest._resolve(void 0);
        stream._inFlightWriteRequest = void 0;
      }
      function WritableStreamFinishInFlightWriteWithError(stream, error) {
        stream._inFlightWriteRequest._reject(error);
        stream._inFlightWriteRequest = void 0;
        WritableStreamDealWithRejection(stream, error);
      }
      function WritableStreamFinishInFlightClose(stream) {
        stream._inFlightCloseRequest._resolve(void 0);
        stream._inFlightCloseRequest = void 0;
        const state = stream._state;
        if (state === "erroring") {
          stream._storedError = void 0;
          if (stream._pendingAbortRequest !== void 0) {
            stream._pendingAbortRequest._resolve();
            stream._pendingAbortRequest = void 0;
          }
        }
        stream._state = "closed";
        const writer = stream._writer;
        if (writer !== void 0) {
          defaultWriterClosedPromiseResolve(writer);
        }
      }
      function WritableStreamFinishInFlightCloseWithError(stream, error) {
        stream._inFlightCloseRequest._reject(error);
        stream._inFlightCloseRequest = void 0;
        if (stream._pendingAbortRequest !== void 0) {
          stream._pendingAbortRequest._reject(error);
          stream._pendingAbortRequest = void 0;
        }
        WritableStreamDealWithRejection(stream, error);
      }
      function WritableStreamCloseQueuedOrInFlight(stream) {
        if (stream._closeRequest === void 0 && stream._inFlightCloseRequest === void 0) {
          return false;
        }
        return true;
      }
      function WritableStreamHasOperationMarkedInFlight(stream) {
        if (stream._inFlightWriteRequest === void 0 && stream._inFlightCloseRequest === void 0) {
          return false;
        }
        return true;
      }
      function WritableStreamMarkCloseRequestInFlight(stream) {
        stream._inFlightCloseRequest = stream._closeRequest;
        stream._closeRequest = void 0;
      }
      function WritableStreamMarkFirstWriteRequestInFlight(stream) {
        stream._inFlightWriteRequest = stream._writeRequests.shift();
      }
      function WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream) {
        if (stream._closeRequest !== void 0) {
          stream._closeRequest._reject(stream._storedError);
          stream._closeRequest = void 0;
        }
        const writer = stream._writer;
        if (writer !== void 0) {
          defaultWriterClosedPromiseReject(writer, stream._storedError);
        }
      }
      function WritableStreamUpdateBackpressure(stream, backpressure) {
        const writer = stream._writer;
        if (writer !== void 0 && backpressure !== stream._backpressure) {
          if (backpressure) {
            defaultWriterReadyPromiseReset(writer);
          } else {
            defaultWriterReadyPromiseResolve(writer);
          }
        }
        stream._backpressure = backpressure;
      }
      class WritableStreamDefaultWriter {
        constructor(stream) {
          assertRequiredArgument(stream, 1, "WritableStreamDefaultWriter");
          assertWritableStream(stream, "First parameter");
          if (IsWritableStreamLocked(stream)) {
            throw new TypeError("This stream has already been locked for exclusive writing by another writer");
          }
          this._ownerWritableStream = stream;
          stream._writer = this;
          const state = stream._state;
          if (state === "writable") {
            if (!WritableStreamCloseQueuedOrInFlight(stream) && stream._backpressure) {
              defaultWriterReadyPromiseInitialize(this);
            } else {
              defaultWriterReadyPromiseInitializeAsResolved(this);
            }
            defaultWriterClosedPromiseInitialize(this);
          } else if (state === "erroring") {
            defaultWriterReadyPromiseInitializeAsRejected(this, stream._storedError);
            defaultWriterClosedPromiseInitialize(this);
          } else if (state === "closed") {
            defaultWriterReadyPromiseInitializeAsResolved(this);
            defaultWriterClosedPromiseInitializeAsResolved(this);
          } else {
            const storedError = stream._storedError;
            defaultWriterReadyPromiseInitializeAsRejected(this, storedError);
            defaultWriterClosedPromiseInitializeAsRejected(this, storedError);
          }
        }
        /**
         * Returns a promise that will be fulfilled when the stream becomes closed, or rejected if the stream ever errors or
         * the writer’s lock is released before the stream finishes closing.
         */
        get closed() {
          if (!IsWritableStreamDefaultWriter(this)) {
            return promiseRejectedWith(defaultWriterBrandCheckException("closed"));
          }
          return this._closedPromise;
        }
        /**
         * Returns the desired size to fill the stream’s internal queue. It can be negative, if the queue is over-full.
         * A producer can use this information to determine the right amount of data to write.
         *
         * It will be `null` if the stream cannot be successfully written to (due to either being errored, or having an abort
         * queued up). It will return zero if the stream is closed. And the getter will throw an exception if invoked when
         * the writer’s lock is released.
         */
        get desiredSize() {
          if (!IsWritableStreamDefaultWriter(this)) {
            throw defaultWriterBrandCheckException("desiredSize");
          }
          if (this._ownerWritableStream === void 0) {
            throw defaultWriterLockException("desiredSize");
          }
          return WritableStreamDefaultWriterGetDesiredSize(this);
        }
        /**
         * Returns a promise that will be fulfilled when the desired size to fill the stream’s internal queue transitions
         * from non-positive to positive, signaling that it is no longer applying backpressure. Once the desired size dips
         * back to zero or below, the getter will return a new promise that stays pending until the next transition.
         *
         * If the stream becomes errored or aborted, or the writer’s lock is released, the returned promise will become
         * rejected.
         */
        get ready() {
          if (!IsWritableStreamDefaultWriter(this)) {
            return promiseRejectedWith(defaultWriterBrandCheckException("ready"));
          }
          return this._readyPromise;
        }
        /**
         * If the reader is active, behaves the same as {@link WritableStream.abort | stream.abort(reason)}.
         */
        abort(reason = void 0) {
          if (!IsWritableStreamDefaultWriter(this)) {
            return promiseRejectedWith(defaultWriterBrandCheckException("abort"));
          }
          if (this._ownerWritableStream === void 0) {
            return promiseRejectedWith(defaultWriterLockException("abort"));
          }
          return WritableStreamDefaultWriterAbort(this, reason);
        }
        /**
         * If the reader is active, behaves the same as {@link WritableStream.close | stream.close()}.
         */
        close() {
          if (!IsWritableStreamDefaultWriter(this)) {
            return promiseRejectedWith(defaultWriterBrandCheckException("close"));
          }
          const stream = this._ownerWritableStream;
          if (stream === void 0) {
            return promiseRejectedWith(defaultWriterLockException("close"));
          }
          if (WritableStreamCloseQueuedOrInFlight(stream)) {
            return promiseRejectedWith(new TypeError("Cannot close an already-closing stream"));
          }
          return WritableStreamDefaultWriterClose(this);
        }
        /**
         * Releases the writer’s lock on the corresponding stream. After the lock is released, the writer is no longer active.
         * If the associated stream is errored when the lock is released, the writer will appear errored in the same way from
         * now on; otherwise, the writer will appear closed.
         *
         * Note that the lock can still be released even if some ongoing writes have not yet finished (i.e. even if the
         * promises returned from previous calls to {@link WritableStreamDefaultWriter.write | write()} have not yet settled).
         * It’s not necessary to hold the lock on the writer for the duration of the write; the lock instead simply prevents
         * other producers from writing in an interleaved manner.
         */
        releaseLock() {
          if (!IsWritableStreamDefaultWriter(this)) {
            throw defaultWriterBrandCheckException("releaseLock");
          }
          const stream = this._ownerWritableStream;
          if (stream === void 0) {
            return;
          }
          WritableStreamDefaultWriterRelease(this);
        }
        write(chunk = void 0) {
          if (!IsWritableStreamDefaultWriter(this)) {
            return promiseRejectedWith(defaultWriterBrandCheckException("write"));
          }
          if (this._ownerWritableStream === void 0) {
            return promiseRejectedWith(defaultWriterLockException("write to"));
          }
          return WritableStreamDefaultWriterWrite(this, chunk);
        }
      }
      Object.defineProperties(WritableStreamDefaultWriter.prototype, {
        abort: { enumerable: true },
        close: { enumerable: true },
        releaseLock: { enumerable: true },
        write: { enumerable: true },
        closed: { enumerable: true },
        desiredSize: { enumerable: true },
        ready: { enumerable: true }
      });
      setFunctionName(WritableStreamDefaultWriter.prototype.abort, "abort");
      setFunctionName(WritableStreamDefaultWriter.prototype.close, "close");
      setFunctionName(WritableStreamDefaultWriter.prototype.releaseLock, "releaseLock");
      setFunctionName(WritableStreamDefaultWriter.prototype.write, "write");
      if (typeof Symbol.toStringTag === "symbol") {
        Object.defineProperty(WritableStreamDefaultWriter.prototype, Symbol.toStringTag, {
          value: "WritableStreamDefaultWriter",
          configurable: true
        });
      }
      function IsWritableStreamDefaultWriter(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_ownerWritableStream")) {
          return false;
        }
        return x2 instanceof WritableStreamDefaultWriter;
      }
      function WritableStreamDefaultWriterAbort(writer, reason) {
        const stream = writer._ownerWritableStream;
        return WritableStreamAbort(stream, reason);
      }
      function WritableStreamDefaultWriterClose(writer) {
        const stream = writer._ownerWritableStream;
        return WritableStreamClose(stream);
      }
      function WritableStreamDefaultWriterCloseWithErrorPropagation(writer) {
        const stream = writer._ownerWritableStream;
        const state = stream._state;
        if (WritableStreamCloseQueuedOrInFlight(stream) || state === "closed") {
          return promiseResolvedWith(void 0);
        }
        if (state === "errored") {
          return promiseRejectedWith(stream._storedError);
        }
        return WritableStreamDefaultWriterClose(writer);
      }
      function WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, error) {
        if (writer._closedPromiseState === "pending") {
          defaultWriterClosedPromiseReject(writer, error);
        } else {
          defaultWriterClosedPromiseResetToRejected(writer, error);
        }
      }
      function WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, error) {
        if (writer._readyPromiseState === "pending") {
          defaultWriterReadyPromiseReject(writer, error);
        } else {
          defaultWriterReadyPromiseResetToRejected(writer, error);
        }
      }
      function WritableStreamDefaultWriterGetDesiredSize(writer) {
        const stream = writer._ownerWritableStream;
        const state = stream._state;
        if (state === "errored" || state === "erroring") {
          return null;
        }
        if (state === "closed") {
          return 0;
        }
        return WritableStreamDefaultControllerGetDesiredSize(stream._writableStreamController);
      }
      function WritableStreamDefaultWriterRelease(writer) {
        const stream = writer._ownerWritableStream;
        const releasedError = new TypeError(`Writer was released and can no longer be used to monitor the stream's closedness`);
        WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, releasedError);
        WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, releasedError);
        stream._writer = void 0;
        writer._ownerWritableStream = void 0;
      }
      function WritableStreamDefaultWriterWrite(writer, chunk) {
        const stream = writer._ownerWritableStream;
        const controller = stream._writableStreamController;
        const chunkSize = WritableStreamDefaultControllerGetChunkSize(controller, chunk);
        if (stream !== writer._ownerWritableStream) {
          return promiseRejectedWith(defaultWriterLockException("write to"));
        }
        const state = stream._state;
        if (state === "errored") {
          return promiseRejectedWith(stream._storedError);
        }
        if (WritableStreamCloseQueuedOrInFlight(stream) || state === "closed") {
          return promiseRejectedWith(new TypeError("The stream is closing or closed and cannot be written to"));
        }
        if (state === "erroring") {
          return promiseRejectedWith(stream._storedError);
        }
        const promise = WritableStreamAddWriteRequest(stream);
        WritableStreamDefaultControllerWrite(controller, chunk, chunkSize);
        return promise;
      }
      const closeSentinel = {};
      class WritableStreamDefaultController {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        /**
         * The reason which was passed to `WritableStream.abort(reason)` when the stream was aborted.
         *
         * @deprecated
         *  This property has been removed from the specification, see https://github.com/whatwg/streams/pull/1177.
         *  Use {@link WritableStreamDefaultController.signal}'s `reason` instead.
         */
        get abortReason() {
          if (!IsWritableStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException$2("abortReason");
          }
          return this._abortReason;
        }
        /**
         * An `AbortSignal` that can be used to abort the pending write or close operation when the stream is aborted.
         */
        get signal() {
          if (!IsWritableStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException$2("signal");
          }
          if (this._abortController === void 0) {
            throw new TypeError("WritableStreamDefaultController.prototype.signal is not supported");
          }
          return this._abortController.signal;
        }
        /**
         * Closes the controlled writable stream, making all future interactions with it fail with the given error `e`.
         *
         * This method is rarely used, since usually it suffices to return a rejected promise from one of the underlying
         * sink's methods. However, it can be useful for suddenly shutting down a stream in response to an event outside the
         * normal lifecycle of interactions with the underlying sink.
         */
        error(e2 = void 0) {
          if (!IsWritableStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException$2("error");
          }
          const state = this._controlledWritableStream._state;
          if (state !== "writable") {
            return;
          }
          WritableStreamDefaultControllerError(this, e2);
        }
        /** @internal */
        [AbortSteps](reason) {
          const result = this._abortAlgorithm(reason);
          WritableStreamDefaultControllerClearAlgorithms(this);
          return result;
        }
        /** @internal */
        [ErrorSteps]() {
          ResetQueue(this);
        }
      }
      Object.defineProperties(WritableStreamDefaultController.prototype, {
        abortReason: { enumerable: true },
        signal: { enumerable: true },
        error: { enumerable: true }
      });
      if (typeof Symbol.toStringTag === "symbol") {
        Object.defineProperty(WritableStreamDefaultController.prototype, Symbol.toStringTag, {
          value: "WritableStreamDefaultController",
          configurable: true
        });
      }
      function IsWritableStreamDefaultController(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_controlledWritableStream")) {
          return false;
        }
        return x2 instanceof WritableStreamDefaultController;
      }
      function SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm) {
        controller._controlledWritableStream = stream;
        stream._writableStreamController = controller;
        controller._queue = void 0;
        controller._queueTotalSize = void 0;
        ResetQueue(controller);
        controller._abortReason = void 0;
        controller._abortController = createAbortController();
        controller._started = false;
        controller._strategySizeAlgorithm = sizeAlgorithm;
        controller._strategyHWM = highWaterMark;
        controller._writeAlgorithm = writeAlgorithm;
        controller._closeAlgorithm = closeAlgorithm;
        controller._abortAlgorithm = abortAlgorithm;
        const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
        WritableStreamUpdateBackpressure(stream, backpressure);
        const startResult = startAlgorithm();
        const startPromise = promiseResolvedWith(startResult);
        uponPromise(startPromise, () => {
          controller._started = true;
          WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
          return null;
        }, (r2) => {
          controller._started = true;
          WritableStreamDealWithRejection(stream, r2);
          return null;
        });
      }
      function SetUpWritableStreamDefaultControllerFromUnderlyingSink(stream, underlyingSink, highWaterMark, sizeAlgorithm) {
        const controller = Object.create(WritableStreamDefaultController.prototype);
        let startAlgorithm;
        let writeAlgorithm;
        let closeAlgorithm;
        let abortAlgorithm;
        if (underlyingSink.start !== void 0) {
          startAlgorithm = () => underlyingSink.start(controller);
        } else {
          startAlgorithm = () => void 0;
        }
        if (underlyingSink.write !== void 0) {
          writeAlgorithm = (chunk) => underlyingSink.write(chunk, controller);
        } else {
          writeAlgorithm = () => promiseResolvedWith(void 0);
        }
        if (underlyingSink.close !== void 0) {
          closeAlgorithm = () => underlyingSink.close();
        } else {
          closeAlgorithm = () => promiseResolvedWith(void 0);
        }
        if (underlyingSink.abort !== void 0) {
          abortAlgorithm = (reason) => underlyingSink.abort(reason);
        } else {
          abortAlgorithm = () => promiseResolvedWith(void 0);
        }
        SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
      }
      function WritableStreamDefaultControllerClearAlgorithms(controller) {
        controller._writeAlgorithm = void 0;
        controller._closeAlgorithm = void 0;
        controller._abortAlgorithm = void 0;
        controller._strategySizeAlgorithm = void 0;
      }
      function WritableStreamDefaultControllerClose(controller) {
        EnqueueValueWithSize(controller, closeSentinel, 0);
        WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
      }
      function WritableStreamDefaultControllerGetChunkSize(controller, chunk) {
        try {
          return controller._strategySizeAlgorithm(chunk);
        } catch (chunkSizeE) {
          WritableStreamDefaultControllerErrorIfNeeded(controller, chunkSizeE);
          return 1;
        }
      }
      function WritableStreamDefaultControllerGetDesiredSize(controller) {
        return controller._strategyHWM - controller._queueTotalSize;
      }
      function WritableStreamDefaultControllerWrite(controller, chunk, chunkSize) {
        try {
          EnqueueValueWithSize(controller, chunk, chunkSize);
        } catch (enqueueE) {
          WritableStreamDefaultControllerErrorIfNeeded(controller, enqueueE);
          return;
        }
        const stream = controller._controlledWritableStream;
        if (!WritableStreamCloseQueuedOrInFlight(stream) && stream._state === "writable") {
          const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
          WritableStreamUpdateBackpressure(stream, backpressure);
        }
        WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
      }
      function WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller) {
        const stream = controller._controlledWritableStream;
        if (!controller._started) {
          return;
        }
        if (stream._inFlightWriteRequest !== void 0) {
          return;
        }
        const state = stream._state;
        if (state === "erroring") {
          WritableStreamFinishErroring(stream);
          return;
        }
        if (controller._queue.length === 0) {
          return;
        }
        const value = PeekQueueValue(controller);
        if (value === closeSentinel) {
          WritableStreamDefaultControllerProcessClose(controller);
        } else {
          WritableStreamDefaultControllerProcessWrite(controller, value);
        }
      }
      function WritableStreamDefaultControllerErrorIfNeeded(controller, error) {
        if (controller._controlledWritableStream._state === "writable") {
          WritableStreamDefaultControllerError(controller, error);
        }
      }
      function WritableStreamDefaultControllerProcessClose(controller) {
        const stream = controller._controlledWritableStream;
        WritableStreamMarkCloseRequestInFlight(stream);
        DequeueValue(controller);
        const sinkClosePromise = controller._closeAlgorithm();
        WritableStreamDefaultControllerClearAlgorithms(controller);
        uponPromise(sinkClosePromise, () => {
          WritableStreamFinishInFlightClose(stream);
          return null;
        }, (reason) => {
          WritableStreamFinishInFlightCloseWithError(stream, reason);
          return null;
        });
      }
      function WritableStreamDefaultControllerProcessWrite(controller, chunk) {
        const stream = controller._controlledWritableStream;
        WritableStreamMarkFirstWriteRequestInFlight(stream);
        const sinkWritePromise = controller._writeAlgorithm(chunk);
        uponPromise(sinkWritePromise, () => {
          WritableStreamFinishInFlightWrite(stream);
          const state = stream._state;
          DequeueValue(controller);
          if (!WritableStreamCloseQueuedOrInFlight(stream) && state === "writable") {
            const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
            WritableStreamUpdateBackpressure(stream, backpressure);
          }
          WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
          return null;
        }, (reason) => {
          if (stream._state === "writable") {
            WritableStreamDefaultControllerClearAlgorithms(controller);
          }
          WritableStreamFinishInFlightWriteWithError(stream, reason);
          return null;
        });
      }
      function WritableStreamDefaultControllerGetBackpressure(controller) {
        const desiredSize = WritableStreamDefaultControllerGetDesiredSize(controller);
        return desiredSize <= 0;
      }
      function WritableStreamDefaultControllerError(controller, error) {
        const stream = controller._controlledWritableStream;
        WritableStreamDefaultControllerClearAlgorithms(controller);
        WritableStreamStartErroring(stream, error);
      }
      function streamBrandCheckException$2(name) {
        return new TypeError(`WritableStream.prototype.${name} can only be used on a WritableStream`);
      }
      function defaultControllerBrandCheckException$2(name) {
        return new TypeError(`WritableStreamDefaultController.prototype.${name} can only be used on a WritableStreamDefaultController`);
      }
      function defaultWriterBrandCheckException(name) {
        return new TypeError(`WritableStreamDefaultWriter.prototype.${name} can only be used on a WritableStreamDefaultWriter`);
      }
      function defaultWriterLockException(name) {
        return new TypeError("Cannot " + name + " a stream using a released writer");
      }
      function defaultWriterClosedPromiseInitialize(writer) {
        writer._closedPromise = newPromise((resolve, reject) => {
          writer._closedPromise_resolve = resolve;
          writer._closedPromise_reject = reject;
          writer._closedPromiseState = "pending";
        });
      }
      function defaultWriterClosedPromiseInitializeAsRejected(writer, reason) {
        defaultWriterClosedPromiseInitialize(writer);
        defaultWriterClosedPromiseReject(writer, reason);
      }
      function defaultWriterClosedPromiseInitializeAsResolved(writer) {
        defaultWriterClosedPromiseInitialize(writer);
        defaultWriterClosedPromiseResolve(writer);
      }
      function defaultWriterClosedPromiseReject(writer, reason) {
        if (writer._closedPromise_reject === void 0) {
          return;
        }
        setPromiseIsHandledToTrue(writer._closedPromise);
        writer._closedPromise_reject(reason);
        writer._closedPromise_resolve = void 0;
        writer._closedPromise_reject = void 0;
        writer._closedPromiseState = "rejected";
      }
      function defaultWriterClosedPromiseResetToRejected(writer, reason) {
        defaultWriterClosedPromiseInitializeAsRejected(writer, reason);
      }
      function defaultWriterClosedPromiseResolve(writer) {
        if (writer._closedPromise_resolve === void 0) {
          return;
        }
        writer._closedPromise_resolve(void 0);
        writer._closedPromise_resolve = void 0;
        writer._closedPromise_reject = void 0;
        writer._closedPromiseState = "resolved";
      }
      function defaultWriterReadyPromiseInitialize(writer) {
        writer._readyPromise = newPromise((resolve, reject) => {
          writer._readyPromise_resolve = resolve;
          writer._readyPromise_reject = reject;
        });
        writer._readyPromiseState = "pending";
      }
      function defaultWriterReadyPromiseInitializeAsRejected(writer, reason) {
        defaultWriterReadyPromiseInitialize(writer);
        defaultWriterReadyPromiseReject(writer, reason);
      }
      function defaultWriterReadyPromiseInitializeAsResolved(writer) {
        defaultWriterReadyPromiseInitialize(writer);
        defaultWriterReadyPromiseResolve(writer);
      }
      function defaultWriterReadyPromiseReject(writer, reason) {
        if (writer._readyPromise_reject === void 0) {
          return;
        }
        setPromiseIsHandledToTrue(writer._readyPromise);
        writer._readyPromise_reject(reason);
        writer._readyPromise_resolve = void 0;
        writer._readyPromise_reject = void 0;
        writer._readyPromiseState = "rejected";
      }
      function defaultWriterReadyPromiseReset(writer) {
        defaultWriterReadyPromiseInitialize(writer);
      }
      function defaultWriterReadyPromiseResetToRejected(writer, reason) {
        defaultWriterReadyPromiseInitializeAsRejected(writer, reason);
      }
      function defaultWriterReadyPromiseResolve(writer) {
        if (writer._readyPromise_resolve === void 0) {
          return;
        }
        writer._readyPromise_resolve(void 0);
        writer._readyPromise_resolve = void 0;
        writer._readyPromise_reject = void 0;
        writer._readyPromiseState = "fulfilled";
      }
      function getGlobals() {
        if (typeof globalThis !== "undefined") {
          return globalThis;
        } else if (typeof self !== "undefined") {
          return self;
        } else if (typeof global !== "undefined") {
          return global;
        }
        return void 0;
      }
      const globals = getGlobals();
      function isDOMExceptionConstructor(ctor) {
        if (!(typeof ctor === "function" || typeof ctor === "object")) {
          return false;
        }
        if (ctor.name !== "DOMException") {
          return false;
        }
        try {
          new ctor();
          return true;
        } catch (_a2) {
          return false;
        }
      }
      function getFromGlobal() {
        const ctor = globals === null || globals === void 0 ? void 0 : globals.DOMException;
        return isDOMExceptionConstructor(ctor) ? ctor : void 0;
      }
      function createPolyfill() {
        const ctor = function DOMException3(message, name) {
          this.message = message || "";
          this.name = name || "Error";
          if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
          }
        };
        setFunctionName(ctor, "DOMException");
        ctor.prototype = Object.create(Error.prototype);
        Object.defineProperty(ctor.prototype, "constructor", { value: ctor, writable: true, configurable: true });
        return ctor;
      }
      const DOMException2 = getFromGlobal() || createPolyfill();
      function ReadableStreamPipeTo(source, dest, preventClose, preventAbort, preventCancel, signal) {
        const reader = AcquireReadableStreamDefaultReader(source);
        const writer = AcquireWritableStreamDefaultWriter(dest);
        source._disturbed = true;
        let shuttingDown = false;
        let currentWrite = promiseResolvedWith(void 0);
        return newPromise((resolve, reject) => {
          let abortAlgorithm;
          if (signal !== void 0) {
            abortAlgorithm = () => {
              const error = signal.reason !== void 0 ? signal.reason : new DOMException2("Aborted", "AbortError");
              const actions = [];
              if (!preventAbort) {
                actions.push(() => {
                  if (dest._state === "writable") {
                    return WritableStreamAbort(dest, error);
                  }
                  return promiseResolvedWith(void 0);
                });
              }
              if (!preventCancel) {
                actions.push(() => {
                  if (source._state === "readable") {
                    return ReadableStreamCancel(source, error);
                  }
                  return promiseResolvedWith(void 0);
                });
              }
              shutdownWithAction(() => Promise.all(actions.map((action) => action())), true, error);
            };
            if (signal.aborted) {
              abortAlgorithm();
              return;
            }
            signal.addEventListener("abort", abortAlgorithm);
          }
          function pipeLoop() {
            return newPromise((resolveLoop, rejectLoop) => {
              function next(done) {
                if (done) {
                  resolveLoop();
                } else {
                  PerformPromiseThen(pipeStep(), next, rejectLoop);
                }
              }
              next(false);
            });
          }
          function pipeStep() {
            if (shuttingDown) {
              return promiseResolvedWith(true);
            }
            return PerformPromiseThen(writer._readyPromise, () => {
              return newPromise((resolveRead, rejectRead) => {
                ReadableStreamDefaultReaderRead(reader, {
                  _chunkSteps: (chunk) => {
                    currentWrite = PerformPromiseThen(WritableStreamDefaultWriterWrite(writer, chunk), void 0, noop2);
                    resolveRead(false);
                  },
                  _closeSteps: () => resolveRead(true),
                  _errorSteps: rejectRead
                });
              });
            });
          }
          isOrBecomesErrored(source, reader._closedPromise, (storedError) => {
            if (!preventAbort) {
              shutdownWithAction(() => WritableStreamAbort(dest, storedError), true, storedError);
            } else {
              shutdown(true, storedError);
            }
            return null;
          });
          isOrBecomesErrored(dest, writer._closedPromise, (storedError) => {
            if (!preventCancel) {
              shutdownWithAction(() => ReadableStreamCancel(source, storedError), true, storedError);
            } else {
              shutdown(true, storedError);
            }
            return null;
          });
          isOrBecomesClosed(source, reader._closedPromise, () => {
            if (!preventClose) {
              shutdownWithAction(() => WritableStreamDefaultWriterCloseWithErrorPropagation(writer));
            } else {
              shutdown();
            }
            return null;
          });
          if (WritableStreamCloseQueuedOrInFlight(dest) || dest._state === "closed") {
            const destClosed = new TypeError("the destination writable stream closed before all data could be piped to it");
            if (!preventCancel) {
              shutdownWithAction(() => ReadableStreamCancel(source, destClosed), true, destClosed);
            } else {
              shutdown(true, destClosed);
            }
          }
          setPromiseIsHandledToTrue(pipeLoop());
          function waitForWritesToFinish() {
            const oldCurrentWrite = currentWrite;
            return PerformPromiseThen(currentWrite, () => oldCurrentWrite !== currentWrite ? waitForWritesToFinish() : void 0);
          }
          function isOrBecomesErrored(stream, promise, action) {
            if (stream._state === "errored") {
              action(stream._storedError);
            } else {
              uponRejection(promise, action);
            }
          }
          function isOrBecomesClosed(stream, promise, action) {
            if (stream._state === "closed") {
              action();
            } else {
              uponFulfillment(promise, action);
            }
          }
          function shutdownWithAction(action, originalIsError, originalError) {
            if (shuttingDown) {
              return;
            }
            shuttingDown = true;
            if (dest._state === "writable" && !WritableStreamCloseQueuedOrInFlight(dest)) {
              uponFulfillment(waitForWritesToFinish(), doTheRest);
            } else {
              doTheRest();
            }
            function doTheRest() {
              uponPromise(action(), () => finalize(originalIsError, originalError), (newError) => finalize(true, newError));
              return null;
            }
          }
          function shutdown(isError, error) {
            if (shuttingDown) {
              return;
            }
            shuttingDown = true;
            if (dest._state === "writable" && !WritableStreamCloseQueuedOrInFlight(dest)) {
              uponFulfillment(waitForWritesToFinish(), () => finalize(isError, error));
            } else {
              finalize(isError, error);
            }
          }
          function finalize(isError, error) {
            WritableStreamDefaultWriterRelease(writer);
            ReadableStreamReaderGenericRelease(reader);
            if (signal !== void 0) {
              signal.removeEventListener("abort", abortAlgorithm);
            }
            if (isError) {
              reject(error);
            } else {
              resolve(void 0);
            }
            return null;
          }
        });
      }
      class ReadableStreamDefaultController {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        /**
         * Returns the desired size to fill the controlled stream's internal queue. It can be negative, if the queue is
         * over-full. An underlying source ought to use this information to determine when and how to apply backpressure.
         */
        get desiredSize() {
          if (!IsReadableStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException$1("desiredSize");
          }
          return ReadableStreamDefaultControllerGetDesiredSize(this);
        }
        /**
         * Closes the controlled readable stream. Consumers will still be able to read any previously-enqueued chunks from
         * the stream, but once those are read, the stream will become closed.
         */
        close() {
          if (!IsReadableStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException$1("close");
          }
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(this)) {
            throw new TypeError("The stream is not in a state that permits close");
          }
          ReadableStreamDefaultControllerClose(this);
        }
        enqueue(chunk = void 0) {
          if (!IsReadableStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException$1("enqueue");
          }
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(this)) {
            throw new TypeError("The stream is not in a state that permits enqueue");
          }
          return ReadableStreamDefaultControllerEnqueue(this, chunk);
        }
        /**
         * Errors the controlled readable stream, making all future interactions with it fail with the given error `e`.
         */
        error(e2 = void 0) {
          if (!IsReadableStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException$1("error");
          }
          ReadableStreamDefaultControllerError(this, e2);
        }
        /** @internal */
        [CancelSteps](reason) {
          ResetQueue(this);
          const result = this._cancelAlgorithm(reason);
          ReadableStreamDefaultControllerClearAlgorithms(this);
          return result;
        }
        /** @internal */
        [PullSteps](readRequest) {
          const stream = this._controlledReadableStream;
          if (this._queue.length > 0) {
            const chunk = DequeueValue(this);
            if (this._closeRequested && this._queue.length === 0) {
              ReadableStreamDefaultControllerClearAlgorithms(this);
              ReadableStreamClose(stream);
            } else {
              ReadableStreamDefaultControllerCallPullIfNeeded(this);
            }
            readRequest._chunkSteps(chunk);
          } else {
            ReadableStreamAddReadRequest(stream, readRequest);
            ReadableStreamDefaultControllerCallPullIfNeeded(this);
          }
        }
        /** @internal */
        [ReleaseSteps]() {
        }
      }
      Object.defineProperties(ReadableStreamDefaultController.prototype, {
        close: { enumerable: true },
        enqueue: { enumerable: true },
        error: { enumerable: true },
        desiredSize: { enumerable: true }
      });
      setFunctionName(ReadableStreamDefaultController.prototype.close, "close");
      setFunctionName(ReadableStreamDefaultController.prototype.enqueue, "enqueue");
      setFunctionName(ReadableStreamDefaultController.prototype.error, "error");
      if (typeof Symbol.toStringTag === "symbol") {
        Object.defineProperty(ReadableStreamDefaultController.prototype, Symbol.toStringTag, {
          value: "ReadableStreamDefaultController",
          configurable: true
        });
      }
      function IsReadableStreamDefaultController(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_controlledReadableStream")) {
          return false;
        }
        return x2 instanceof ReadableStreamDefaultController;
      }
      function ReadableStreamDefaultControllerCallPullIfNeeded(controller) {
        const shouldPull = ReadableStreamDefaultControllerShouldCallPull(controller);
        if (!shouldPull) {
          return;
        }
        if (controller._pulling) {
          controller._pullAgain = true;
          return;
        }
        controller._pulling = true;
        const pullPromise = controller._pullAlgorithm();
        uponPromise(pullPromise, () => {
          controller._pulling = false;
          if (controller._pullAgain) {
            controller._pullAgain = false;
            ReadableStreamDefaultControllerCallPullIfNeeded(controller);
          }
          return null;
        }, (e2) => {
          ReadableStreamDefaultControllerError(controller, e2);
          return null;
        });
      }
      function ReadableStreamDefaultControllerShouldCallPull(controller) {
        const stream = controller._controlledReadableStream;
        if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
          return false;
        }
        if (!controller._started) {
          return false;
        }
        if (IsReadableStreamLocked(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
          return true;
        }
        const desiredSize = ReadableStreamDefaultControllerGetDesiredSize(controller);
        if (desiredSize > 0) {
          return true;
        }
        return false;
      }
      function ReadableStreamDefaultControllerClearAlgorithms(controller) {
        controller._pullAlgorithm = void 0;
        controller._cancelAlgorithm = void 0;
        controller._strategySizeAlgorithm = void 0;
      }
      function ReadableStreamDefaultControllerClose(controller) {
        if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
          return;
        }
        const stream = controller._controlledReadableStream;
        controller._closeRequested = true;
        if (controller._queue.length === 0) {
          ReadableStreamDefaultControllerClearAlgorithms(controller);
          ReadableStreamClose(stream);
        }
      }
      function ReadableStreamDefaultControllerEnqueue(controller, chunk) {
        if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
          return;
        }
        const stream = controller._controlledReadableStream;
        if (IsReadableStreamLocked(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
          ReadableStreamFulfillReadRequest(stream, chunk, false);
        } else {
          let chunkSize;
          try {
            chunkSize = controller._strategySizeAlgorithm(chunk);
          } catch (chunkSizeE) {
            ReadableStreamDefaultControllerError(controller, chunkSizeE);
            throw chunkSizeE;
          }
          try {
            EnqueueValueWithSize(controller, chunk, chunkSize);
          } catch (enqueueE) {
            ReadableStreamDefaultControllerError(controller, enqueueE);
            throw enqueueE;
          }
        }
        ReadableStreamDefaultControllerCallPullIfNeeded(controller);
      }
      function ReadableStreamDefaultControllerError(controller, e2) {
        const stream = controller._controlledReadableStream;
        if (stream._state !== "readable") {
          return;
        }
        ResetQueue(controller);
        ReadableStreamDefaultControllerClearAlgorithms(controller);
        ReadableStreamError(stream, e2);
      }
      function ReadableStreamDefaultControllerGetDesiredSize(controller) {
        const state = controller._controlledReadableStream._state;
        if (state === "errored") {
          return null;
        }
        if (state === "closed") {
          return 0;
        }
        return controller._strategyHWM - controller._queueTotalSize;
      }
      function ReadableStreamDefaultControllerHasBackpressure(controller) {
        if (ReadableStreamDefaultControllerShouldCallPull(controller)) {
          return false;
        }
        return true;
      }
      function ReadableStreamDefaultControllerCanCloseOrEnqueue(controller) {
        const state = controller._controlledReadableStream._state;
        if (!controller._closeRequested && state === "readable") {
          return true;
        }
        return false;
      }
      function SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm) {
        controller._controlledReadableStream = stream;
        controller._queue = void 0;
        controller._queueTotalSize = void 0;
        ResetQueue(controller);
        controller._started = false;
        controller._closeRequested = false;
        controller._pullAgain = false;
        controller._pulling = false;
        controller._strategySizeAlgorithm = sizeAlgorithm;
        controller._strategyHWM = highWaterMark;
        controller._pullAlgorithm = pullAlgorithm;
        controller._cancelAlgorithm = cancelAlgorithm;
        stream._readableStreamController = controller;
        const startResult = startAlgorithm();
        uponPromise(promiseResolvedWith(startResult), () => {
          controller._started = true;
          ReadableStreamDefaultControllerCallPullIfNeeded(controller);
          return null;
        }, (r2) => {
          ReadableStreamDefaultControllerError(controller, r2);
          return null;
        });
      }
      function SetUpReadableStreamDefaultControllerFromUnderlyingSource(stream, underlyingSource, highWaterMark, sizeAlgorithm) {
        const controller = Object.create(ReadableStreamDefaultController.prototype);
        let startAlgorithm;
        let pullAlgorithm;
        let cancelAlgorithm;
        if (underlyingSource.start !== void 0) {
          startAlgorithm = () => underlyingSource.start(controller);
        } else {
          startAlgorithm = () => void 0;
        }
        if (underlyingSource.pull !== void 0) {
          pullAlgorithm = () => underlyingSource.pull(controller);
        } else {
          pullAlgorithm = () => promiseResolvedWith(void 0);
        }
        if (underlyingSource.cancel !== void 0) {
          cancelAlgorithm = (reason) => underlyingSource.cancel(reason);
        } else {
          cancelAlgorithm = () => promiseResolvedWith(void 0);
        }
        SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm);
      }
      function defaultControllerBrandCheckException$1(name) {
        return new TypeError(`ReadableStreamDefaultController.prototype.${name} can only be used on a ReadableStreamDefaultController`);
      }
      function ReadableStreamTee(stream, cloneForBranch2) {
        if (IsReadableByteStreamController(stream._readableStreamController)) {
          return ReadableByteStreamTee(stream);
        }
        return ReadableStreamDefaultTee(stream);
      }
      function ReadableStreamDefaultTee(stream, cloneForBranch2) {
        const reader = AcquireReadableStreamDefaultReader(stream);
        let reading = false;
        let readAgain = false;
        let canceled1 = false;
        let canceled2 = false;
        let reason1;
        let reason2;
        let branch1;
        let branch2;
        let resolveCancelPromise;
        const cancelPromise = newPromise((resolve) => {
          resolveCancelPromise = resolve;
        });
        function pullAlgorithm() {
          if (reading) {
            readAgain = true;
            return promiseResolvedWith(void 0);
          }
          reading = true;
          const readRequest = {
            _chunkSteps: (chunk) => {
              _queueMicrotask(() => {
                readAgain = false;
                const chunk1 = chunk;
                const chunk2 = chunk;
                if (!canceled1) {
                  ReadableStreamDefaultControllerEnqueue(branch1._readableStreamController, chunk1);
                }
                if (!canceled2) {
                  ReadableStreamDefaultControllerEnqueue(branch2._readableStreamController, chunk2);
                }
                reading = false;
                if (readAgain) {
                  pullAlgorithm();
                }
              });
            },
            _closeSteps: () => {
              reading = false;
              if (!canceled1) {
                ReadableStreamDefaultControllerClose(branch1._readableStreamController);
              }
              if (!canceled2) {
                ReadableStreamDefaultControllerClose(branch2._readableStreamController);
              }
              if (!canceled1 || !canceled2) {
                resolveCancelPromise(void 0);
              }
            },
            _errorSteps: () => {
              reading = false;
            }
          };
          ReadableStreamDefaultReaderRead(reader, readRequest);
          return promiseResolvedWith(void 0);
        }
        function cancel1Algorithm(reason) {
          canceled1 = true;
          reason1 = reason;
          if (canceled2) {
            const compositeReason = CreateArrayFromList([reason1, reason2]);
            const cancelResult = ReadableStreamCancel(stream, compositeReason);
            resolveCancelPromise(cancelResult);
          }
          return cancelPromise;
        }
        function cancel2Algorithm(reason) {
          canceled2 = true;
          reason2 = reason;
          if (canceled1) {
            const compositeReason = CreateArrayFromList([reason1, reason2]);
            const cancelResult = ReadableStreamCancel(stream, compositeReason);
            resolveCancelPromise(cancelResult);
          }
          return cancelPromise;
        }
        function startAlgorithm() {
        }
        branch1 = CreateReadableStream(startAlgorithm, pullAlgorithm, cancel1Algorithm);
        branch2 = CreateReadableStream(startAlgorithm, pullAlgorithm, cancel2Algorithm);
        uponRejection(reader._closedPromise, (r2) => {
          ReadableStreamDefaultControllerError(branch1._readableStreamController, r2);
          ReadableStreamDefaultControllerError(branch2._readableStreamController, r2);
          if (!canceled1 || !canceled2) {
            resolveCancelPromise(void 0);
          }
          return null;
        });
        return [branch1, branch2];
      }
      function ReadableByteStreamTee(stream) {
        let reader = AcquireReadableStreamDefaultReader(stream);
        let reading = false;
        let readAgainForBranch1 = false;
        let readAgainForBranch2 = false;
        let canceled1 = false;
        let canceled2 = false;
        let reason1;
        let reason2;
        let branch1;
        let branch2;
        let resolveCancelPromise;
        const cancelPromise = newPromise((resolve) => {
          resolveCancelPromise = resolve;
        });
        function forwardReaderError(thisReader) {
          uponRejection(thisReader._closedPromise, (r2) => {
            if (thisReader !== reader) {
              return null;
            }
            ReadableByteStreamControllerError(branch1._readableStreamController, r2);
            ReadableByteStreamControllerError(branch2._readableStreamController, r2);
            if (!canceled1 || !canceled2) {
              resolveCancelPromise(void 0);
            }
            return null;
          });
        }
        function pullWithDefaultReader() {
          if (IsReadableStreamBYOBReader(reader)) {
            ReadableStreamReaderGenericRelease(reader);
            reader = AcquireReadableStreamDefaultReader(stream);
            forwardReaderError(reader);
          }
          const readRequest = {
            _chunkSteps: (chunk) => {
              _queueMicrotask(() => {
                readAgainForBranch1 = false;
                readAgainForBranch2 = false;
                const chunk1 = chunk;
                let chunk2 = chunk;
                if (!canceled1 && !canceled2) {
                  try {
                    chunk2 = CloneAsUint8Array(chunk);
                  } catch (cloneE) {
                    ReadableByteStreamControllerError(branch1._readableStreamController, cloneE);
                    ReadableByteStreamControllerError(branch2._readableStreamController, cloneE);
                    resolveCancelPromise(ReadableStreamCancel(stream, cloneE));
                    return;
                  }
                }
                if (!canceled1) {
                  ReadableByteStreamControllerEnqueue(branch1._readableStreamController, chunk1);
                }
                if (!canceled2) {
                  ReadableByteStreamControllerEnqueue(branch2._readableStreamController, chunk2);
                }
                reading = false;
                if (readAgainForBranch1) {
                  pull1Algorithm();
                } else if (readAgainForBranch2) {
                  pull2Algorithm();
                }
              });
            },
            _closeSteps: () => {
              reading = false;
              if (!canceled1) {
                ReadableByteStreamControllerClose(branch1._readableStreamController);
              }
              if (!canceled2) {
                ReadableByteStreamControllerClose(branch2._readableStreamController);
              }
              if (branch1._readableStreamController._pendingPullIntos.length > 0) {
                ReadableByteStreamControllerRespond(branch1._readableStreamController, 0);
              }
              if (branch2._readableStreamController._pendingPullIntos.length > 0) {
                ReadableByteStreamControllerRespond(branch2._readableStreamController, 0);
              }
              if (!canceled1 || !canceled2) {
                resolveCancelPromise(void 0);
              }
            },
            _errorSteps: () => {
              reading = false;
            }
          };
          ReadableStreamDefaultReaderRead(reader, readRequest);
        }
        function pullWithBYOBReader(view, forBranch2) {
          if (IsReadableStreamDefaultReader(reader)) {
            ReadableStreamReaderGenericRelease(reader);
            reader = AcquireReadableStreamBYOBReader(stream);
            forwardReaderError(reader);
          }
          const byobBranch = forBranch2 ? branch2 : branch1;
          const otherBranch = forBranch2 ? branch1 : branch2;
          const readIntoRequest = {
            _chunkSteps: (chunk) => {
              _queueMicrotask(() => {
                readAgainForBranch1 = false;
                readAgainForBranch2 = false;
                const byobCanceled = forBranch2 ? canceled2 : canceled1;
                const otherCanceled = forBranch2 ? canceled1 : canceled2;
                if (!otherCanceled) {
                  let clonedChunk;
                  try {
                    clonedChunk = CloneAsUint8Array(chunk);
                  } catch (cloneE) {
                    ReadableByteStreamControllerError(byobBranch._readableStreamController, cloneE);
                    ReadableByteStreamControllerError(otherBranch._readableStreamController, cloneE);
                    resolveCancelPromise(ReadableStreamCancel(stream, cloneE));
                    return;
                  }
                  if (!byobCanceled) {
                    ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                  }
                  ReadableByteStreamControllerEnqueue(otherBranch._readableStreamController, clonedChunk);
                } else if (!byobCanceled) {
                  ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                }
                reading = false;
                if (readAgainForBranch1) {
                  pull1Algorithm();
                } else if (readAgainForBranch2) {
                  pull2Algorithm();
                }
              });
            },
            _closeSteps: (chunk) => {
              reading = false;
              const byobCanceled = forBranch2 ? canceled2 : canceled1;
              const otherCanceled = forBranch2 ? canceled1 : canceled2;
              if (!byobCanceled) {
                ReadableByteStreamControllerClose(byobBranch._readableStreamController);
              }
              if (!otherCanceled) {
                ReadableByteStreamControllerClose(otherBranch._readableStreamController);
              }
              if (chunk !== void 0) {
                if (!byobCanceled) {
                  ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                }
                if (!otherCanceled && otherBranch._readableStreamController._pendingPullIntos.length > 0) {
                  ReadableByteStreamControllerRespond(otherBranch._readableStreamController, 0);
                }
              }
              if (!byobCanceled || !otherCanceled) {
                resolveCancelPromise(void 0);
              }
            },
            _errorSteps: () => {
              reading = false;
            }
          };
          ReadableStreamBYOBReaderRead(reader, view, 1, readIntoRequest);
        }
        function pull1Algorithm() {
          if (reading) {
            readAgainForBranch1 = true;
            return promiseResolvedWith(void 0);
          }
          reading = true;
          const byobRequest = ReadableByteStreamControllerGetBYOBRequest(branch1._readableStreamController);
          if (byobRequest === null) {
            pullWithDefaultReader();
          } else {
            pullWithBYOBReader(byobRequest._view, false);
          }
          return promiseResolvedWith(void 0);
        }
        function pull2Algorithm() {
          if (reading) {
            readAgainForBranch2 = true;
            return promiseResolvedWith(void 0);
          }
          reading = true;
          const byobRequest = ReadableByteStreamControllerGetBYOBRequest(branch2._readableStreamController);
          if (byobRequest === null) {
            pullWithDefaultReader();
          } else {
            pullWithBYOBReader(byobRequest._view, true);
          }
          return promiseResolvedWith(void 0);
        }
        function cancel1Algorithm(reason) {
          canceled1 = true;
          reason1 = reason;
          if (canceled2) {
            const compositeReason = CreateArrayFromList([reason1, reason2]);
            const cancelResult = ReadableStreamCancel(stream, compositeReason);
            resolveCancelPromise(cancelResult);
          }
          return cancelPromise;
        }
        function cancel2Algorithm(reason) {
          canceled2 = true;
          reason2 = reason;
          if (canceled1) {
            const compositeReason = CreateArrayFromList([reason1, reason2]);
            const cancelResult = ReadableStreamCancel(stream, compositeReason);
            resolveCancelPromise(cancelResult);
          }
          return cancelPromise;
        }
        function startAlgorithm() {
          return;
        }
        branch1 = CreateReadableByteStream(startAlgorithm, pull1Algorithm, cancel1Algorithm);
        branch2 = CreateReadableByteStream(startAlgorithm, pull2Algorithm, cancel2Algorithm);
        forwardReaderError(reader);
        return [branch1, branch2];
      }
      function isReadableStreamLike(stream) {
        return typeIsObject(stream) && typeof stream.getReader !== "undefined";
      }
      function ReadableStreamFrom(source) {
        if (isReadableStreamLike(source)) {
          return ReadableStreamFromDefaultReader(source.getReader());
        }
        return ReadableStreamFromIterable(source);
      }
      function ReadableStreamFromIterable(asyncIterable) {
        let stream;
        const iteratorRecord = GetIterator(asyncIterable, "async");
        const startAlgorithm = noop2;
        function pullAlgorithm() {
          let nextResult;
          try {
            nextResult = IteratorNext(iteratorRecord);
          } catch (e2) {
            return promiseRejectedWith(e2);
          }
          const nextPromise = promiseResolvedWith(nextResult);
          return transformPromiseWith(nextPromise, (iterResult) => {
            if (!typeIsObject(iterResult)) {
              throw new TypeError("The promise returned by the iterator.next() method must fulfill with an object");
            }
            const done = IteratorComplete(iterResult);
            if (done) {
              ReadableStreamDefaultControllerClose(stream._readableStreamController);
            } else {
              const value = IteratorValue(iterResult);
              ReadableStreamDefaultControllerEnqueue(stream._readableStreamController, value);
            }
          });
        }
        function cancelAlgorithm(reason) {
          const iterator = iteratorRecord.iterator;
          let returnMethod;
          try {
            returnMethod = GetMethod(iterator, "return");
          } catch (e2) {
            return promiseRejectedWith(e2);
          }
          if (returnMethod === void 0) {
            return promiseResolvedWith(void 0);
          }
          let returnResult;
          try {
            returnResult = reflectCall(returnMethod, iterator, [reason]);
          } catch (e2) {
            return promiseRejectedWith(e2);
          }
          const returnPromise = promiseResolvedWith(returnResult);
          return transformPromiseWith(returnPromise, (iterResult) => {
            if (!typeIsObject(iterResult)) {
              throw new TypeError("The promise returned by the iterator.return() method must fulfill with an object");
            }
            return void 0;
          });
        }
        stream = CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, 0);
        return stream;
      }
      function ReadableStreamFromDefaultReader(reader) {
        let stream;
        const startAlgorithm = noop2;
        function pullAlgorithm() {
          let readPromise;
          try {
            readPromise = reader.read();
          } catch (e2) {
            return promiseRejectedWith(e2);
          }
          return transformPromiseWith(readPromise, (readResult) => {
            if (!typeIsObject(readResult)) {
              throw new TypeError("The promise returned by the reader.read() method must fulfill with an object");
            }
            if (readResult.done) {
              ReadableStreamDefaultControllerClose(stream._readableStreamController);
            } else {
              const value = readResult.value;
              ReadableStreamDefaultControllerEnqueue(stream._readableStreamController, value);
            }
          });
        }
        function cancelAlgorithm(reason) {
          try {
            return promiseResolvedWith(reader.cancel(reason));
          } catch (e2) {
            return promiseRejectedWith(e2);
          }
        }
        stream = CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, 0);
        return stream;
      }
      function convertUnderlyingDefaultOrByteSource(source, context) {
        assertDictionary(source, context);
        const original = source;
        const autoAllocateChunkSize = original === null || original === void 0 ? void 0 : original.autoAllocateChunkSize;
        const cancel = original === null || original === void 0 ? void 0 : original.cancel;
        const pull = original === null || original === void 0 ? void 0 : original.pull;
        const start = original === null || original === void 0 ? void 0 : original.start;
        const type = original === null || original === void 0 ? void 0 : original.type;
        return {
          autoAllocateChunkSize: autoAllocateChunkSize === void 0 ? void 0 : convertUnsignedLongLongWithEnforceRange(autoAllocateChunkSize, `${context} has member 'autoAllocateChunkSize' that`),
          cancel: cancel === void 0 ? void 0 : convertUnderlyingSourceCancelCallback(cancel, original, `${context} has member 'cancel' that`),
          pull: pull === void 0 ? void 0 : convertUnderlyingSourcePullCallback(pull, original, `${context} has member 'pull' that`),
          start: start === void 0 ? void 0 : convertUnderlyingSourceStartCallback(start, original, `${context} has member 'start' that`),
          type: type === void 0 ? void 0 : convertReadableStreamType(type, `${context} has member 'type' that`)
        };
      }
      function convertUnderlyingSourceCancelCallback(fn, original, context) {
        assertFunction(fn, context);
        return (reason) => promiseCall(fn, original, [reason]);
      }
      function convertUnderlyingSourcePullCallback(fn, original, context) {
        assertFunction(fn, context);
        return (controller) => promiseCall(fn, original, [controller]);
      }
      function convertUnderlyingSourceStartCallback(fn, original, context) {
        assertFunction(fn, context);
        return (controller) => reflectCall(fn, original, [controller]);
      }
      function convertReadableStreamType(type, context) {
        type = `${type}`;
        if (type !== "bytes") {
          throw new TypeError(`${context} '${type}' is not a valid enumeration value for ReadableStreamType`);
        }
        return type;
      }
      function convertIteratorOptions(options, context) {
        assertDictionary(options, context);
        const preventCancel = options === null || options === void 0 ? void 0 : options.preventCancel;
        return { preventCancel: Boolean(preventCancel) };
      }
      function convertPipeOptions(options, context) {
        assertDictionary(options, context);
        const preventAbort = options === null || options === void 0 ? void 0 : options.preventAbort;
        const preventCancel = options === null || options === void 0 ? void 0 : options.preventCancel;
        const preventClose = options === null || options === void 0 ? void 0 : options.preventClose;
        const signal = options === null || options === void 0 ? void 0 : options.signal;
        if (signal !== void 0) {
          assertAbortSignal(signal, `${context} has member 'signal' that`);
        }
        return {
          preventAbort: Boolean(preventAbort),
          preventCancel: Boolean(preventCancel),
          preventClose: Boolean(preventClose),
          signal
        };
      }
      function assertAbortSignal(signal, context) {
        if (!isAbortSignal2(signal)) {
          throw new TypeError(`${context} is not an AbortSignal.`);
        }
      }
      function convertReadableWritablePair(pair, context) {
        assertDictionary(pair, context);
        const readable = pair === null || pair === void 0 ? void 0 : pair.readable;
        assertRequiredField(readable, "readable", "ReadableWritablePair");
        assertReadableStream(readable, `${context} has member 'readable' that`);
        const writable = pair === null || pair === void 0 ? void 0 : pair.writable;
        assertRequiredField(writable, "writable", "ReadableWritablePair");
        assertWritableStream(writable, `${context} has member 'writable' that`);
        return { readable, writable };
      }
      class ReadableStream2 {
        constructor(rawUnderlyingSource = {}, rawStrategy = {}) {
          if (rawUnderlyingSource === void 0) {
            rawUnderlyingSource = null;
          } else {
            assertObject(rawUnderlyingSource, "First parameter");
          }
          const strategy = convertQueuingStrategy(rawStrategy, "Second parameter");
          const underlyingSource = convertUnderlyingDefaultOrByteSource(rawUnderlyingSource, "First parameter");
          InitializeReadableStream(this);
          if (underlyingSource.type === "bytes") {
            if (strategy.size !== void 0) {
              throw new RangeError("The strategy for a byte stream cannot have a size function");
            }
            const highWaterMark = ExtractHighWaterMark(strategy, 0);
            SetUpReadableByteStreamControllerFromUnderlyingSource(this, underlyingSource, highWaterMark);
          } else {
            const sizeAlgorithm = ExtractSizeAlgorithm(strategy);
            const highWaterMark = ExtractHighWaterMark(strategy, 1);
            SetUpReadableStreamDefaultControllerFromUnderlyingSource(this, underlyingSource, highWaterMark, sizeAlgorithm);
          }
        }
        /**
         * Whether or not the readable stream is locked to a {@link ReadableStreamDefaultReader | reader}.
         */
        get locked() {
          if (!IsReadableStream(this)) {
            throw streamBrandCheckException$1("locked");
          }
          return IsReadableStreamLocked(this);
        }
        /**
         * Cancels the stream, signaling a loss of interest in the stream by a consumer.
         *
         * The supplied `reason` argument will be given to the underlying source's {@link UnderlyingSource.cancel | cancel()}
         * method, which might or might not use it.
         */
        cancel(reason = void 0) {
          if (!IsReadableStream(this)) {
            return promiseRejectedWith(streamBrandCheckException$1("cancel"));
          }
          if (IsReadableStreamLocked(this)) {
            return promiseRejectedWith(new TypeError("Cannot cancel a stream that already has a reader"));
          }
          return ReadableStreamCancel(this, reason);
        }
        getReader(rawOptions = void 0) {
          if (!IsReadableStream(this)) {
            throw streamBrandCheckException$1("getReader");
          }
          const options = convertReaderOptions(rawOptions, "First parameter");
          if (options.mode === void 0) {
            return AcquireReadableStreamDefaultReader(this);
          }
          return AcquireReadableStreamBYOBReader(this);
        }
        pipeThrough(rawTransform, rawOptions = {}) {
          if (!IsReadableStream(this)) {
            throw streamBrandCheckException$1("pipeThrough");
          }
          assertRequiredArgument(rawTransform, 1, "pipeThrough");
          const transform = convertReadableWritablePair(rawTransform, "First parameter");
          const options = convertPipeOptions(rawOptions, "Second parameter");
          if (IsReadableStreamLocked(this)) {
            throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked ReadableStream");
          }
          if (IsWritableStreamLocked(transform.writable)) {
            throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked WritableStream");
          }
          const promise = ReadableStreamPipeTo(this, transform.writable, options.preventClose, options.preventAbort, options.preventCancel, options.signal);
          setPromiseIsHandledToTrue(promise);
          return transform.readable;
        }
        pipeTo(destination, rawOptions = {}) {
          if (!IsReadableStream(this)) {
            return promiseRejectedWith(streamBrandCheckException$1("pipeTo"));
          }
          if (destination === void 0) {
            return promiseRejectedWith(`Parameter 1 is required in 'pipeTo'.`);
          }
          if (!IsWritableStream(destination)) {
            return promiseRejectedWith(new TypeError(`ReadableStream.prototype.pipeTo's first argument must be a WritableStream`));
          }
          let options;
          try {
            options = convertPipeOptions(rawOptions, "Second parameter");
          } catch (e2) {
            return promiseRejectedWith(e2);
          }
          if (IsReadableStreamLocked(this)) {
            return promiseRejectedWith(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked ReadableStream"));
          }
          if (IsWritableStreamLocked(destination)) {
            return promiseRejectedWith(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked WritableStream"));
          }
          return ReadableStreamPipeTo(this, destination, options.preventClose, options.preventAbort, options.preventCancel, options.signal);
        }
        /**
         * Tees this readable stream, returning a two-element array containing the two resulting branches as
         * new {@link ReadableStream} instances.
         *
         * Teeing a stream will lock it, preventing any other consumer from acquiring a reader.
         * To cancel the stream, cancel both of the resulting branches; a composite cancellation reason will then be
         * propagated to the stream's underlying source.
         *
         * Note that the chunks seen in each branch will be the same object. If the chunks are not immutable,
         * this could allow interference between the two branches.
         */
        tee() {
          if (!IsReadableStream(this)) {
            throw streamBrandCheckException$1("tee");
          }
          const branches = ReadableStreamTee(this);
          return CreateArrayFromList(branches);
        }
        values(rawOptions = void 0) {
          if (!IsReadableStream(this)) {
            throw streamBrandCheckException$1("values");
          }
          const options = convertIteratorOptions(rawOptions, "First parameter");
          return AcquireReadableStreamAsyncIterator(this, options.preventCancel);
        }
        [SymbolAsyncIterator](options) {
          return this.values(options);
        }
        /**
         * Creates a new ReadableStream wrapping the provided iterable or async iterable.
         *
         * This can be used to adapt various kinds of objects into a readable stream,
         * such as an array, an async generator, or a Node.js readable stream.
         */
        static from(asyncIterable) {
          return ReadableStreamFrom(asyncIterable);
        }
      }
      Object.defineProperties(ReadableStream2, {
        from: { enumerable: true }
      });
      Object.defineProperties(ReadableStream2.prototype, {
        cancel: { enumerable: true },
        getReader: { enumerable: true },
        pipeThrough: { enumerable: true },
        pipeTo: { enumerable: true },
        tee: { enumerable: true },
        values: { enumerable: true },
        locked: { enumerable: true }
      });
      setFunctionName(ReadableStream2.from, "from");
      setFunctionName(ReadableStream2.prototype.cancel, "cancel");
      setFunctionName(ReadableStream2.prototype.getReader, "getReader");
      setFunctionName(ReadableStream2.prototype.pipeThrough, "pipeThrough");
      setFunctionName(ReadableStream2.prototype.pipeTo, "pipeTo");
      setFunctionName(ReadableStream2.prototype.tee, "tee");
      setFunctionName(ReadableStream2.prototype.values, "values");
      if (typeof Symbol.toStringTag === "symbol") {
        Object.defineProperty(ReadableStream2.prototype, Symbol.toStringTag, {
          value: "ReadableStream",
          configurable: true
        });
      }
      Object.defineProperty(ReadableStream2.prototype, SymbolAsyncIterator, {
        value: ReadableStream2.prototype.values,
        writable: true,
        configurable: true
      });
      function CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark = 1, sizeAlgorithm = () => 1) {
        const stream = Object.create(ReadableStream2.prototype);
        InitializeReadableStream(stream);
        const controller = Object.create(ReadableStreamDefaultController.prototype);
        SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm);
        return stream;
      }
      function CreateReadableByteStream(startAlgorithm, pullAlgorithm, cancelAlgorithm) {
        const stream = Object.create(ReadableStream2.prototype);
        InitializeReadableStream(stream);
        const controller = Object.create(ReadableByteStreamController.prototype);
        SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, 0, void 0);
        return stream;
      }
      function InitializeReadableStream(stream) {
        stream._state = "readable";
        stream._reader = void 0;
        stream._storedError = void 0;
        stream._disturbed = false;
      }
      function IsReadableStream(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_readableStreamController")) {
          return false;
        }
        return x2 instanceof ReadableStream2;
      }
      function IsReadableStreamLocked(stream) {
        if (stream._reader === void 0) {
          return false;
        }
        return true;
      }
      function ReadableStreamCancel(stream, reason) {
        stream._disturbed = true;
        if (stream._state === "closed") {
          return promiseResolvedWith(void 0);
        }
        if (stream._state === "errored") {
          return promiseRejectedWith(stream._storedError);
        }
        ReadableStreamClose(stream);
        const reader = stream._reader;
        if (reader !== void 0 && IsReadableStreamBYOBReader(reader)) {
          const readIntoRequests = reader._readIntoRequests;
          reader._readIntoRequests = new SimpleQueue();
          readIntoRequests.forEach((readIntoRequest) => {
            readIntoRequest._closeSteps(void 0);
          });
        }
        const sourceCancelPromise = stream._readableStreamController[CancelSteps](reason);
        return transformPromiseWith(sourceCancelPromise, noop2);
      }
      function ReadableStreamClose(stream) {
        stream._state = "closed";
        const reader = stream._reader;
        if (reader === void 0) {
          return;
        }
        defaultReaderClosedPromiseResolve(reader);
        if (IsReadableStreamDefaultReader(reader)) {
          const readRequests = reader._readRequests;
          reader._readRequests = new SimpleQueue();
          readRequests.forEach((readRequest) => {
            readRequest._closeSteps();
          });
        }
      }
      function ReadableStreamError(stream, e2) {
        stream._state = "errored";
        stream._storedError = e2;
        const reader = stream._reader;
        if (reader === void 0) {
          return;
        }
        defaultReaderClosedPromiseReject(reader, e2);
        if (IsReadableStreamDefaultReader(reader)) {
          ReadableStreamDefaultReaderErrorReadRequests(reader, e2);
        } else {
          ReadableStreamBYOBReaderErrorReadIntoRequests(reader, e2);
        }
      }
      function streamBrandCheckException$1(name) {
        return new TypeError(`ReadableStream.prototype.${name} can only be used on a ReadableStream`);
      }
      function convertQueuingStrategyInit(init, context) {
        assertDictionary(init, context);
        const highWaterMark = init === null || init === void 0 ? void 0 : init.highWaterMark;
        assertRequiredField(highWaterMark, "highWaterMark", "QueuingStrategyInit");
        return {
          highWaterMark: convertUnrestrictedDouble(highWaterMark)
        };
      }
      const byteLengthSizeFunction = (chunk) => {
        return chunk.byteLength;
      };
      setFunctionName(byteLengthSizeFunction, "size");
      class ByteLengthQueuingStrategy {
        constructor(options) {
          assertRequiredArgument(options, 1, "ByteLengthQueuingStrategy");
          options = convertQueuingStrategyInit(options, "First parameter");
          this._byteLengthQueuingStrategyHighWaterMark = options.highWaterMark;
        }
        /**
         * Returns the high water mark provided to the constructor.
         */
        get highWaterMark() {
          if (!IsByteLengthQueuingStrategy(this)) {
            throw byteLengthBrandCheckException("highWaterMark");
          }
          return this._byteLengthQueuingStrategyHighWaterMark;
        }
        /**
         * Measures the size of `chunk` by returning the value of its `byteLength` property.
         */
        get size() {
          if (!IsByteLengthQueuingStrategy(this)) {
            throw byteLengthBrandCheckException("size");
          }
          return byteLengthSizeFunction;
        }
      }
      Object.defineProperties(ByteLengthQueuingStrategy.prototype, {
        highWaterMark: { enumerable: true },
        size: { enumerable: true }
      });
      if (typeof Symbol.toStringTag === "symbol") {
        Object.defineProperty(ByteLengthQueuingStrategy.prototype, Symbol.toStringTag, {
          value: "ByteLengthQueuingStrategy",
          configurable: true
        });
      }
      function byteLengthBrandCheckException(name) {
        return new TypeError(`ByteLengthQueuingStrategy.prototype.${name} can only be used on a ByteLengthQueuingStrategy`);
      }
      function IsByteLengthQueuingStrategy(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_byteLengthQueuingStrategyHighWaterMark")) {
          return false;
        }
        return x2 instanceof ByteLengthQueuingStrategy;
      }
      const countSizeFunction = () => {
        return 1;
      };
      setFunctionName(countSizeFunction, "size");
      class CountQueuingStrategy {
        constructor(options) {
          assertRequiredArgument(options, 1, "CountQueuingStrategy");
          options = convertQueuingStrategyInit(options, "First parameter");
          this._countQueuingStrategyHighWaterMark = options.highWaterMark;
        }
        /**
         * Returns the high water mark provided to the constructor.
         */
        get highWaterMark() {
          if (!IsCountQueuingStrategy(this)) {
            throw countBrandCheckException("highWaterMark");
          }
          return this._countQueuingStrategyHighWaterMark;
        }
        /**
         * Measures the size of `chunk` by always returning 1.
         * This ensures that the total queue size is a count of the number of chunks in the queue.
         */
        get size() {
          if (!IsCountQueuingStrategy(this)) {
            throw countBrandCheckException("size");
          }
          return countSizeFunction;
        }
      }
      Object.defineProperties(CountQueuingStrategy.prototype, {
        highWaterMark: { enumerable: true },
        size: { enumerable: true }
      });
      if (typeof Symbol.toStringTag === "symbol") {
        Object.defineProperty(CountQueuingStrategy.prototype, Symbol.toStringTag, {
          value: "CountQueuingStrategy",
          configurable: true
        });
      }
      function countBrandCheckException(name) {
        return new TypeError(`CountQueuingStrategy.prototype.${name} can only be used on a CountQueuingStrategy`);
      }
      function IsCountQueuingStrategy(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_countQueuingStrategyHighWaterMark")) {
          return false;
        }
        return x2 instanceof CountQueuingStrategy;
      }
      function convertTransformer(original, context) {
        assertDictionary(original, context);
        const cancel = original === null || original === void 0 ? void 0 : original.cancel;
        const flush = original === null || original === void 0 ? void 0 : original.flush;
        const readableType = original === null || original === void 0 ? void 0 : original.readableType;
        const start = original === null || original === void 0 ? void 0 : original.start;
        const transform = original === null || original === void 0 ? void 0 : original.transform;
        const writableType = original === null || original === void 0 ? void 0 : original.writableType;
        return {
          cancel: cancel === void 0 ? void 0 : convertTransformerCancelCallback(cancel, original, `${context} has member 'cancel' that`),
          flush: flush === void 0 ? void 0 : convertTransformerFlushCallback(flush, original, `${context} has member 'flush' that`),
          readableType,
          start: start === void 0 ? void 0 : convertTransformerStartCallback(start, original, `${context} has member 'start' that`),
          transform: transform === void 0 ? void 0 : convertTransformerTransformCallback(transform, original, `${context} has member 'transform' that`),
          writableType
        };
      }
      function convertTransformerFlushCallback(fn, original, context) {
        assertFunction(fn, context);
        return (controller) => promiseCall(fn, original, [controller]);
      }
      function convertTransformerStartCallback(fn, original, context) {
        assertFunction(fn, context);
        return (controller) => reflectCall(fn, original, [controller]);
      }
      function convertTransformerTransformCallback(fn, original, context) {
        assertFunction(fn, context);
        return (chunk, controller) => promiseCall(fn, original, [chunk, controller]);
      }
      function convertTransformerCancelCallback(fn, original, context) {
        assertFunction(fn, context);
        return (reason) => promiseCall(fn, original, [reason]);
      }
      class TransformStream {
        constructor(rawTransformer = {}, rawWritableStrategy = {}, rawReadableStrategy = {}) {
          if (rawTransformer === void 0) {
            rawTransformer = null;
          }
          const writableStrategy = convertQueuingStrategy(rawWritableStrategy, "Second parameter");
          const readableStrategy = convertQueuingStrategy(rawReadableStrategy, "Third parameter");
          const transformer = convertTransformer(rawTransformer, "First parameter");
          if (transformer.readableType !== void 0) {
            throw new RangeError("Invalid readableType specified");
          }
          if (transformer.writableType !== void 0) {
            throw new RangeError("Invalid writableType specified");
          }
          const readableHighWaterMark = ExtractHighWaterMark(readableStrategy, 0);
          const readableSizeAlgorithm = ExtractSizeAlgorithm(readableStrategy);
          const writableHighWaterMark = ExtractHighWaterMark(writableStrategy, 1);
          const writableSizeAlgorithm = ExtractSizeAlgorithm(writableStrategy);
          let startPromise_resolve;
          const startPromise = newPromise((resolve) => {
            startPromise_resolve = resolve;
          });
          InitializeTransformStream(this, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm);
          SetUpTransformStreamDefaultControllerFromTransformer(this, transformer);
          if (transformer.start !== void 0) {
            startPromise_resolve(transformer.start(this._transformStreamController));
          } else {
            startPromise_resolve(void 0);
          }
        }
        /**
         * The readable side of the transform stream.
         */
        get readable() {
          if (!IsTransformStream(this)) {
            throw streamBrandCheckException("readable");
          }
          return this._readable;
        }
        /**
         * The writable side of the transform stream.
         */
        get writable() {
          if (!IsTransformStream(this)) {
            throw streamBrandCheckException("writable");
          }
          return this._writable;
        }
      }
      Object.defineProperties(TransformStream.prototype, {
        readable: { enumerable: true },
        writable: { enumerable: true }
      });
      if (typeof Symbol.toStringTag === "symbol") {
        Object.defineProperty(TransformStream.prototype, Symbol.toStringTag, {
          value: "TransformStream",
          configurable: true
        });
      }
      function InitializeTransformStream(stream, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm) {
        function startAlgorithm() {
          return startPromise;
        }
        function writeAlgorithm(chunk) {
          return TransformStreamDefaultSinkWriteAlgorithm(stream, chunk);
        }
        function abortAlgorithm(reason) {
          return TransformStreamDefaultSinkAbortAlgorithm(stream, reason);
        }
        function closeAlgorithm() {
          return TransformStreamDefaultSinkCloseAlgorithm(stream);
        }
        stream._writable = CreateWritableStream(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, writableHighWaterMark, writableSizeAlgorithm);
        function pullAlgorithm() {
          return TransformStreamDefaultSourcePullAlgorithm(stream);
        }
        function cancelAlgorithm(reason) {
          return TransformStreamDefaultSourceCancelAlgorithm(stream, reason);
        }
        stream._readable = CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, readableHighWaterMark, readableSizeAlgorithm);
        stream._backpressure = void 0;
        stream._backpressureChangePromise = void 0;
        stream._backpressureChangePromise_resolve = void 0;
        TransformStreamSetBackpressure(stream, true);
        stream._transformStreamController = void 0;
      }
      function IsTransformStream(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_transformStreamController")) {
          return false;
        }
        return x2 instanceof TransformStream;
      }
      function TransformStreamError(stream, e2) {
        ReadableStreamDefaultControllerError(stream._readable._readableStreamController, e2);
        TransformStreamErrorWritableAndUnblockWrite(stream, e2);
      }
      function TransformStreamErrorWritableAndUnblockWrite(stream, e2) {
        TransformStreamDefaultControllerClearAlgorithms(stream._transformStreamController);
        WritableStreamDefaultControllerErrorIfNeeded(stream._writable._writableStreamController, e2);
        TransformStreamUnblockWrite(stream);
      }
      function TransformStreamUnblockWrite(stream) {
        if (stream._backpressure) {
          TransformStreamSetBackpressure(stream, false);
        }
      }
      function TransformStreamSetBackpressure(stream, backpressure) {
        if (stream._backpressureChangePromise !== void 0) {
          stream._backpressureChangePromise_resolve();
        }
        stream._backpressureChangePromise = newPromise((resolve) => {
          stream._backpressureChangePromise_resolve = resolve;
        });
        stream._backpressure = backpressure;
      }
      class TransformStreamDefaultController {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        /**
         * Returns the desired size to fill the readable side’s internal queue. It can be negative, if the queue is over-full.
         */
        get desiredSize() {
          if (!IsTransformStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException("desiredSize");
          }
          const readableController = this._controlledTransformStream._readable._readableStreamController;
          return ReadableStreamDefaultControllerGetDesiredSize(readableController);
        }
        enqueue(chunk = void 0) {
          if (!IsTransformStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException("enqueue");
          }
          TransformStreamDefaultControllerEnqueue(this, chunk);
        }
        /**
         * Errors both the readable side and the writable side of the controlled transform stream, making all future
         * interactions with it fail with the given error `e`. Any chunks queued for transformation will be discarded.
         */
        error(reason = void 0) {
          if (!IsTransformStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException("error");
          }
          TransformStreamDefaultControllerError(this, reason);
        }
        /**
         * Closes the readable side and errors the writable side of the controlled transform stream. This is useful when the
         * transformer only needs to consume a portion of the chunks written to the writable side.
         */
        terminate() {
          if (!IsTransformStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException("terminate");
          }
          TransformStreamDefaultControllerTerminate(this);
        }
      }
      Object.defineProperties(TransformStreamDefaultController.prototype, {
        enqueue: { enumerable: true },
        error: { enumerable: true },
        terminate: { enumerable: true },
        desiredSize: { enumerable: true }
      });
      setFunctionName(TransformStreamDefaultController.prototype.enqueue, "enqueue");
      setFunctionName(TransformStreamDefaultController.prototype.error, "error");
      setFunctionName(TransformStreamDefaultController.prototype.terminate, "terminate");
      if (typeof Symbol.toStringTag === "symbol") {
        Object.defineProperty(TransformStreamDefaultController.prototype, Symbol.toStringTag, {
          value: "TransformStreamDefaultController",
          configurable: true
        });
      }
      function IsTransformStreamDefaultController(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_controlledTransformStream")) {
          return false;
        }
        return x2 instanceof TransformStreamDefaultController;
      }
      function SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm, cancelAlgorithm) {
        controller._controlledTransformStream = stream;
        stream._transformStreamController = controller;
        controller._transformAlgorithm = transformAlgorithm;
        controller._flushAlgorithm = flushAlgorithm;
        controller._cancelAlgorithm = cancelAlgorithm;
        controller._finishPromise = void 0;
        controller._finishPromise_resolve = void 0;
        controller._finishPromise_reject = void 0;
      }
      function SetUpTransformStreamDefaultControllerFromTransformer(stream, transformer) {
        const controller = Object.create(TransformStreamDefaultController.prototype);
        let transformAlgorithm;
        let flushAlgorithm;
        let cancelAlgorithm;
        if (transformer.transform !== void 0) {
          transformAlgorithm = (chunk) => transformer.transform(chunk, controller);
        } else {
          transformAlgorithm = (chunk) => {
            try {
              TransformStreamDefaultControllerEnqueue(controller, chunk);
              return promiseResolvedWith(void 0);
            } catch (transformResultE) {
              return promiseRejectedWith(transformResultE);
            }
          };
        }
        if (transformer.flush !== void 0) {
          flushAlgorithm = () => transformer.flush(controller);
        } else {
          flushAlgorithm = () => promiseResolvedWith(void 0);
        }
        if (transformer.cancel !== void 0) {
          cancelAlgorithm = (reason) => transformer.cancel(reason);
        } else {
          cancelAlgorithm = () => promiseResolvedWith(void 0);
        }
        SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm, cancelAlgorithm);
      }
      function TransformStreamDefaultControllerClearAlgorithms(controller) {
        controller._transformAlgorithm = void 0;
        controller._flushAlgorithm = void 0;
        controller._cancelAlgorithm = void 0;
      }
      function TransformStreamDefaultControllerEnqueue(controller, chunk) {
        const stream = controller._controlledTransformStream;
        const readableController = stream._readable._readableStreamController;
        if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(readableController)) {
          throw new TypeError("Readable side is not in a state that permits enqueue");
        }
        try {
          ReadableStreamDefaultControllerEnqueue(readableController, chunk);
        } catch (e2) {
          TransformStreamErrorWritableAndUnblockWrite(stream, e2);
          throw stream._readable._storedError;
        }
        const backpressure = ReadableStreamDefaultControllerHasBackpressure(readableController);
        if (backpressure !== stream._backpressure) {
          TransformStreamSetBackpressure(stream, true);
        }
      }
      function TransformStreamDefaultControllerError(controller, e2) {
        TransformStreamError(controller._controlledTransformStream, e2);
      }
      function TransformStreamDefaultControllerPerformTransform(controller, chunk) {
        const transformPromise = controller._transformAlgorithm(chunk);
        return transformPromiseWith(transformPromise, void 0, (r2) => {
          TransformStreamError(controller._controlledTransformStream, r2);
          throw r2;
        });
      }
      function TransformStreamDefaultControllerTerminate(controller) {
        const stream = controller._controlledTransformStream;
        const readableController = stream._readable._readableStreamController;
        ReadableStreamDefaultControllerClose(readableController);
        const error = new TypeError("TransformStream terminated");
        TransformStreamErrorWritableAndUnblockWrite(stream, error);
      }
      function TransformStreamDefaultSinkWriteAlgorithm(stream, chunk) {
        const controller = stream._transformStreamController;
        if (stream._backpressure) {
          const backpressureChangePromise = stream._backpressureChangePromise;
          return transformPromiseWith(backpressureChangePromise, () => {
            const writable = stream._writable;
            const state = writable._state;
            if (state === "erroring") {
              throw writable._storedError;
            }
            return TransformStreamDefaultControllerPerformTransform(controller, chunk);
          });
        }
        return TransformStreamDefaultControllerPerformTransform(controller, chunk);
      }
      function TransformStreamDefaultSinkAbortAlgorithm(stream, reason) {
        const controller = stream._transformStreamController;
        if (controller._finishPromise !== void 0) {
          return controller._finishPromise;
        }
        const readable = stream._readable;
        controller._finishPromise = newPromise((resolve, reject) => {
          controller._finishPromise_resolve = resolve;
          controller._finishPromise_reject = reject;
        });
        const cancelPromise = controller._cancelAlgorithm(reason);
        TransformStreamDefaultControllerClearAlgorithms(controller);
        uponPromise(cancelPromise, () => {
          if (readable._state === "errored") {
            defaultControllerFinishPromiseReject(controller, readable._storedError);
          } else {
            ReadableStreamDefaultControllerError(readable._readableStreamController, reason);
            defaultControllerFinishPromiseResolve(controller);
          }
          return null;
        }, (r2) => {
          ReadableStreamDefaultControllerError(readable._readableStreamController, r2);
          defaultControllerFinishPromiseReject(controller, r2);
          return null;
        });
        return controller._finishPromise;
      }
      function TransformStreamDefaultSinkCloseAlgorithm(stream) {
        const controller = stream._transformStreamController;
        if (controller._finishPromise !== void 0) {
          return controller._finishPromise;
        }
        const readable = stream._readable;
        controller._finishPromise = newPromise((resolve, reject) => {
          controller._finishPromise_resolve = resolve;
          controller._finishPromise_reject = reject;
        });
        const flushPromise = controller._flushAlgorithm();
        TransformStreamDefaultControllerClearAlgorithms(controller);
        uponPromise(flushPromise, () => {
          if (readable._state === "errored") {
            defaultControllerFinishPromiseReject(controller, readable._storedError);
          } else {
            ReadableStreamDefaultControllerClose(readable._readableStreamController);
            defaultControllerFinishPromiseResolve(controller);
          }
          return null;
        }, (r2) => {
          ReadableStreamDefaultControllerError(readable._readableStreamController, r2);
          defaultControllerFinishPromiseReject(controller, r2);
          return null;
        });
        return controller._finishPromise;
      }
      function TransformStreamDefaultSourcePullAlgorithm(stream) {
        TransformStreamSetBackpressure(stream, false);
        return stream._backpressureChangePromise;
      }
      function TransformStreamDefaultSourceCancelAlgorithm(stream, reason) {
        const controller = stream._transformStreamController;
        if (controller._finishPromise !== void 0) {
          return controller._finishPromise;
        }
        const writable = stream._writable;
        controller._finishPromise = newPromise((resolve, reject) => {
          controller._finishPromise_resolve = resolve;
          controller._finishPromise_reject = reject;
        });
        const cancelPromise = controller._cancelAlgorithm(reason);
        TransformStreamDefaultControllerClearAlgorithms(controller);
        uponPromise(cancelPromise, () => {
          if (writable._state === "errored") {
            defaultControllerFinishPromiseReject(controller, writable._storedError);
          } else {
            WritableStreamDefaultControllerErrorIfNeeded(writable._writableStreamController, reason);
            TransformStreamUnblockWrite(stream);
            defaultControllerFinishPromiseResolve(controller);
          }
          return null;
        }, (r2) => {
          WritableStreamDefaultControllerErrorIfNeeded(writable._writableStreamController, r2);
          TransformStreamUnblockWrite(stream);
          defaultControllerFinishPromiseReject(controller, r2);
          return null;
        });
        return controller._finishPromise;
      }
      function defaultControllerBrandCheckException(name) {
        return new TypeError(`TransformStreamDefaultController.prototype.${name} can only be used on a TransformStreamDefaultController`);
      }
      function defaultControllerFinishPromiseResolve(controller) {
        if (controller._finishPromise_resolve === void 0) {
          return;
        }
        controller._finishPromise_resolve();
        controller._finishPromise_resolve = void 0;
        controller._finishPromise_reject = void 0;
      }
      function defaultControllerFinishPromiseReject(controller, reason) {
        if (controller._finishPromise_reject === void 0) {
          return;
        }
        setPromiseIsHandledToTrue(controller._finishPromise);
        controller._finishPromise_reject(reason);
        controller._finishPromise_resolve = void 0;
        controller._finishPromise_reject = void 0;
      }
      function streamBrandCheckException(name) {
        return new TypeError(`TransformStream.prototype.${name} can only be used on a TransformStream`);
      }
      exports3.ByteLengthQueuingStrategy = ByteLengthQueuingStrategy;
      exports3.CountQueuingStrategy = CountQueuingStrategy;
      exports3.ReadableByteStreamController = ReadableByteStreamController;
      exports3.ReadableStream = ReadableStream2;
      exports3.ReadableStreamBYOBReader = ReadableStreamBYOBReader;
      exports3.ReadableStreamBYOBRequest = ReadableStreamBYOBRequest;
      exports3.ReadableStreamDefaultController = ReadableStreamDefaultController;
      exports3.ReadableStreamDefaultReader = ReadableStreamDefaultReader;
      exports3.TransformStream = TransformStream;
      exports3.TransformStreamDefaultController = TransformStreamDefaultController;
      exports3.WritableStream = WritableStream;
      exports3.WritableStreamDefaultController = WritableStreamDefaultController;
      exports3.WritableStreamDefaultWriter = WritableStreamDefaultWriter;
    }));
  }
});

// node_modules/fetch-blob/streams.cjs
var require_streams = __commonJS({
  "node_modules/fetch-blob/streams.cjs"() {
    var POOL_SIZE2 = 65536;
    if (!globalThis.ReadableStream) {
      try {
        const process2 = require("node:process");
        const { emitWarning } = process2;
        try {
          process2.emitWarning = () => {
          };
          Object.assign(globalThis, require("node:stream/web"));
          process2.emitWarning = emitWarning;
        } catch (error) {
          process2.emitWarning = emitWarning;
          throw error;
        }
      } catch (error) {
        Object.assign(globalThis, require_ponyfill_es2018());
      }
    }
    try {
      const { Blob: Blob3 } = require("buffer");
      if (Blob3 && !Blob3.prototype.stream) {
        Blob3.prototype.stream = function name(params) {
          let position = 0;
          const blob = this;
          return new ReadableStream({
            type: "bytes",
            async pull(ctrl) {
              const chunk = blob.slice(position, Math.min(blob.size, position + POOL_SIZE2));
              const buffer = await chunk.arrayBuffer();
              position += buffer.byteLength;
              ctrl.enqueue(new Uint8Array(buffer));
              if (position === blob.size) {
                ctrl.close();
              }
            }
          });
        };
      }
    } catch (error) {
    }
  }
});

// node_modules/fetch-blob/index.js
async function* toIterator(parts, clone2 = true) {
  for (const part of parts) {
    if ("stream" in part) {
      yield* (
        /** @type {AsyncIterableIterator<Uint8Array>} */
        part.stream()
      );
    } else if (ArrayBuffer.isView(part)) {
      if (clone2) {
        let position = part.byteOffset;
        const end = part.byteOffset + part.byteLength;
        while (position !== end) {
          const size = Math.min(end - position, POOL_SIZE);
          const chunk = part.buffer.slice(position, position + size);
          position += chunk.byteLength;
          yield new Uint8Array(chunk);
        }
      } else {
        yield part;
      }
    } else {
      let position = 0, b = (
        /** @type {Blob} */
        part
      );
      while (position !== b.size) {
        const chunk = b.slice(position, Math.min(b.size, position + POOL_SIZE));
        const buffer = await chunk.arrayBuffer();
        position += buffer.byteLength;
        yield new Uint8Array(buffer);
      }
    }
  }
}
var import_streams, POOL_SIZE, _Blob, Blob2, fetch_blob_default;
var init_fetch_blob = __esm({
  "node_modules/fetch-blob/index.js"() {
    import_streams = __toESM(require_streams(), 1);
    POOL_SIZE = 65536;
    _Blob = class Blob {
      /** @type {Array.<(Blob|Uint8Array)>} */
      #parts = [];
      #type = "";
      #size = 0;
      #endings = "transparent";
      /**
       * The Blob() constructor returns a new Blob object. The content
       * of the blob consists of the concatenation of the values given
       * in the parameter array.
       *
       * @param {*} blobParts
       * @param {{ type?: string, endings?: string }} [options]
       */
      constructor(blobParts = [], options = {}) {
        if (typeof blobParts !== "object" || blobParts === null) {
          throw new TypeError("Failed to construct 'Blob': The provided value cannot be converted to a sequence.");
        }
        if (typeof blobParts[Symbol.iterator] !== "function") {
          throw new TypeError("Failed to construct 'Blob': The object must have a callable @@iterator property.");
        }
        if (typeof options !== "object" && typeof options !== "function") {
          throw new TypeError("Failed to construct 'Blob': parameter 2 cannot convert to dictionary.");
        }
        if (options === null) options = {};
        const encoder = new TextEncoder();
        for (const element of blobParts) {
          let part;
          if (ArrayBuffer.isView(element)) {
            part = new Uint8Array(element.buffer.slice(element.byteOffset, element.byteOffset + element.byteLength));
          } else if (element instanceof ArrayBuffer) {
            part = new Uint8Array(element.slice(0));
          } else if (element instanceof Blob) {
            part = element;
          } else {
            part = encoder.encode(`${element}`);
          }
          this.#size += ArrayBuffer.isView(part) ? part.byteLength : part.size;
          this.#parts.push(part);
        }
        this.#endings = `${options.endings === void 0 ? "transparent" : options.endings}`;
        const type = options.type === void 0 ? "" : String(options.type);
        this.#type = /^[\x20-\x7E]*$/.test(type) ? type : "";
      }
      /**
       * The Blob interface's size property returns the
       * size of the Blob in bytes.
       */
      get size() {
        return this.#size;
      }
      /**
       * The type property of a Blob object returns the MIME type of the file.
       */
      get type() {
        return this.#type;
      }
      /**
       * The text() method in the Blob interface returns a Promise
       * that resolves with a string containing the contents of
       * the blob, interpreted as UTF-8.
       *
       * @return {Promise<string>}
       */
      async text() {
        const decoder = new TextDecoder();
        let str = "";
        for await (const part of toIterator(this.#parts, false)) {
          str += decoder.decode(part, { stream: true });
        }
        str += decoder.decode();
        return str;
      }
      /**
       * The arrayBuffer() method in the Blob interface returns a
       * Promise that resolves with the contents of the blob as
       * binary data contained in an ArrayBuffer.
       *
       * @return {Promise<ArrayBuffer>}
       */
      async arrayBuffer() {
        const data = new Uint8Array(this.size);
        let offset = 0;
        for await (const chunk of toIterator(this.#parts, false)) {
          data.set(chunk, offset);
          offset += chunk.length;
        }
        return data.buffer;
      }
      stream() {
        const it = toIterator(this.#parts, true);
        return new globalThis.ReadableStream({
          // @ts-ignore
          type: "bytes",
          async pull(ctrl) {
            const chunk = await it.next();
            chunk.done ? ctrl.close() : ctrl.enqueue(chunk.value);
          },
          async cancel() {
            await it.return();
          }
        });
      }
      /**
       * The Blob interface's slice() method creates and returns a
       * new Blob object which contains data from a subset of the
       * blob on which it's called.
       *
       * @param {number} [start]
       * @param {number} [end]
       * @param {string} [type]
       */
      slice(start = 0, end = this.size, type = "") {
        const { size } = this;
        let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
        let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
        const span = Math.max(relativeEnd - relativeStart, 0);
        const parts = this.#parts;
        const blobParts = [];
        let added = 0;
        for (const part of parts) {
          if (added >= span) {
            break;
          }
          const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
          if (relativeStart && size2 <= relativeStart) {
            relativeStart -= size2;
            relativeEnd -= size2;
          } else {
            let chunk;
            if (ArrayBuffer.isView(part)) {
              chunk = part.subarray(relativeStart, Math.min(size2, relativeEnd));
              added += chunk.byteLength;
            } else {
              chunk = part.slice(relativeStart, Math.min(size2, relativeEnd));
              added += chunk.size;
            }
            relativeEnd -= size2;
            blobParts.push(chunk);
            relativeStart = 0;
          }
        }
        const blob = new Blob([], { type: String(type).toLowerCase() });
        blob.#size = span;
        blob.#parts = blobParts;
        return blob;
      }
      get [Symbol.toStringTag]() {
        return "Blob";
      }
      static [Symbol.hasInstance](object) {
        return object && typeof object === "object" && typeof object.constructor === "function" && (typeof object.stream === "function" || typeof object.arrayBuffer === "function") && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
      }
    };
    Object.defineProperties(_Blob.prototype, {
      size: { enumerable: true },
      type: { enumerable: true },
      slice: { enumerable: true }
    });
    Blob2 = _Blob;
    fetch_blob_default = Blob2;
  }
});

// node_modules/fetch-blob/file.js
var _File, File2, file_default;
var init_file = __esm({
  "node_modules/fetch-blob/file.js"() {
    init_fetch_blob();
    _File = class File extends fetch_blob_default {
      #lastModified = 0;
      #name = "";
      /**
       * @param {*[]} fileBits
       * @param {string} fileName
       * @param {{lastModified?: number, type?: string}} options
       */
      // @ts-ignore
      constructor(fileBits, fileName, options = {}) {
        if (arguments.length < 2) {
          throw new TypeError(`Failed to construct 'File': 2 arguments required, but only ${arguments.length} present.`);
        }
        super(fileBits, options);
        if (options === null) options = {};
        const lastModified = options.lastModified === void 0 ? Date.now() : Number(options.lastModified);
        if (!Number.isNaN(lastModified)) {
          this.#lastModified = lastModified;
        }
        this.#name = String(fileName);
      }
      get name() {
        return this.#name;
      }
      get lastModified() {
        return this.#lastModified;
      }
      get [Symbol.toStringTag]() {
        return "File";
      }
      static [Symbol.hasInstance](object) {
        return !!object && object instanceof fetch_blob_default && /^(File)$/.test(object[Symbol.toStringTag]);
      }
    };
    File2 = _File;
    file_default = File2;
  }
});

// node_modules/formdata-polyfill/esm.min.js
function formDataToBlob(F2, B = fetch_blob_default) {
  var b = `${r()}${r()}`.replace(/\./g, "").slice(-28).padStart(32, "-"), c = [], p = `--${b}\r
Content-Disposition: form-data; name="`;
  F2.forEach((v, n) => typeof v == "string" ? c.push(p + e(n) + `"\r
\r
${v.replace(/\r(?!\n)|(?<!\r)\n/g, "\r\n")}\r
`) : c.push(p + e(n) + `"; filename="${e(v.name, 1)}"\r
Content-Type: ${v.type || "application/octet-stream"}\r
\r
`, v, "\r\n"));
  c.push(`--${b}--`);
  return new B(c, { type: "multipart/form-data; boundary=" + b });
}
var t, i, h, r, m, f, e, x, FormData;
var init_esm_min = __esm({
  "node_modules/formdata-polyfill/esm.min.js"() {
    init_fetch_blob();
    init_file();
    ({ toStringTag: t, iterator: i, hasInstance: h } = Symbol);
    r = Math.random;
    m = "append,set,get,getAll,delete,keys,values,entries,forEach,constructor".split(",");
    f = (a, b, c) => (a += "", /^(Blob|File)$/.test(b && b[t]) ? [(c = c !== void 0 ? c + "" : b[t] == "File" ? b.name : "blob", a), b.name !== c || b[t] == "blob" ? new file_default([b], c, b) : b] : [a, b + ""]);
    e = (c, f3) => (f3 ? c : c.replace(/\r?\n|\r/g, "\r\n")).replace(/\n/g, "%0A").replace(/\r/g, "%0D").replace(/"/g, "%22");
    x = (n, a, e2) => {
      if (a.length < e2) {
        throw new TypeError(`Failed to execute '${n}' on 'FormData': ${e2} arguments required, but only ${a.length} present.`);
      }
    };
    FormData = class FormData2 {
      #d = [];
      constructor(...a) {
        if (a.length) throw new TypeError(`Failed to construct 'FormData': parameter 1 is not of type 'HTMLFormElement'.`);
      }
      get [t]() {
        return "FormData";
      }
      [i]() {
        return this.entries();
      }
      static [h](o) {
        return o && typeof o === "object" && o[t] === "FormData" && !m.some((m2) => typeof o[m2] != "function");
      }
      append(...a) {
        x("append", arguments, 2);
        this.#d.push(f(...a));
      }
      delete(a) {
        x("delete", arguments, 1);
        a += "";
        this.#d = this.#d.filter(([b]) => b !== a);
      }
      get(a) {
        x("get", arguments, 1);
        a += "";
        for (var b = this.#d, l = b.length, c = 0; c < l; c++) if (b[c][0] === a) return b[c][1];
        return null;
      }
      getAll(a, b) {
        x("getAll", arguments, 1);
        b = [];
        a += "";
        this.#d.forEach((c) => c[0] === a && b.push(c[1]));
        return b;
      }
      has(a) {
        x("has", arguments, 1);
        a += "";
        return this.#d.some((b) => b[0] === a);
      }
      forEach(a, b) {
        x("forEach", arguments, 1);
        for (var [c, d] of this) a.call(b, d, c, this);
      }
      set(...a) {
        x("set", arguments, 2);
        var b = [], c = true;
        a = f(...a);
        this.#d.forEach((d) => {
          d[0] === a[0] ? c && (c = !b.push(a)) : b.push(d);
        });
        c && b.push(a);
        this.#d = b;
      }
      *entries() {
        yield* this.#d;
      }
      *keys() {
        for (var [a] of this) yield a;
      }
      *values() {
        for (var [, a] of this) yield a;
      }
    };
  }
});

// node_modules/node-domexception/index.js
var require_node_domexception = __commonJS({
  "node_modules/node-domexception/index.js"(exports2, module2) {
    if (!globalThis.DOMException) {
      try {
        const { MessageChannel } = require("worker_threads"), port = new MessageChannel().port1, ab = new ArrayBuffer();
        port.postMessage(ab, [ab, ab]);
      } catch (err) {
        err.constructor.name === "DOMException" && (globalThis.DOMException = err.constructor);
      }
    }
    module2.exports = globalThis.DOMException;
  }
});

// node_modules/fetch-blob/from.js
var import_node_fs, import_node_domexception, stat;
var init_from = __esm({
  "node_modules/fetch-blob/from.js"() {
    import_node_fs = require("node:fs");
    import_node_domexception = __toESM(require_node_domexception(), 1);
    init_file();
    init_fetch_blob();
    ({ stat } = import_node_fs.promises);
  }
});

// node_modules/node-fetch/src/utils/multipart-parser.js
var multipart_parser_exports = {};
__export(multipart_parser_exports, {
  toFormData: () => toFormData
});
function _fileName(headerValue) {
  const m2 = headerValue.match(/\bfilename=("(.*?)"|([^()<>@,;:\\"/[\]?={}\s\t]+))($|;\s)/i);
  if (!m2) {
    return;
  }
  const match = m2[2] || m2[3] || "";
  let filename = match.slice(match.lastIndexOf("\\") + 1);
  filename = filename.replace(/%22/g, '"');
  filename = filename.replace(/&#(\d{4});/g, (m3, code) => {
    return String.fromCharCode(code);
  });
  return filename;
}
async function toFormData(Body2, ct) {
  if (!/multipart/i.test(ct)) {
    throw new TypeError("Failed to fetch");
  }
  const m2 = ct.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  if (!m2) {
    throw new TypeError("no or bad content-type header, no multipart boundary");
  }
  const parser = new MultipartParser(m2[1] || m2[2]);
  let headerField;
  let headerValue;
  let entryValue;
  let entryName;
  let contentType;
  let filename;
  const entryChunks = [];
  const formData = new FormData();
  const onPartData = (ui8a) => {
    entryValue += decoder.decode(ui8a, { stream: true });
  };
  const appendToFile = (ui8a) => {
    entryChunks.push(ui8a);
  };
  const appendFileToFormData = () => {
    const file = new file_default(entryChunks, filename, { type: contentType });
    formData.append(entryName, file);
  };
  const appendEntryToFormData = () => {
    formData.append(entryName, entryValue);
  };
  const decoder = new TextDecoder("utf-8");
  decoder.decode();
  parser.onPartBegin = function() {
    parser.onPartData = onPartData;
    parser.onPartEnd = appendEntryToFormData;
    headerField = "";
    headerValue = "";
    entryValue = "";
    entryName = "";
    contentType = "";
    filename = null;
    entryChunks.length = 0;
  };
  parser.onHeaderField = function(ui8a) {
    headerField += decoder.decode(ui8a, { stream: true });
  };
  parser.onHeaderValue = function(ui8a) {
    headerValue += decoder.decode(ui8a, { stream: true });
  };
  parser.onHeaderEnd = function() {
    headerValue += decoder.decode();
    headerField = headerField.toLowerCase();
    if (headerField === "content-disposition") {
      const m3 = headerValue.match(/\bname=("([^"]*)"|([^()<>@,;:\\"/[\]?={}\s\t]+))/i);
      if (m3) {
        entryName = m3[2] || m3[3] || "";
      }
      filename = _fileName(headerValue);
      if (filename) {
        parser.onPartData = appendToFile;
        parser.onPartEnd = appendFileToFormData;
      }
    } else if (headerField === "content-type") {
      contentType = headerValue;
    }
    headerValue = "";
    headerField = "";
  };
  for await (const chunk of Body2) {
    parser.write(chunk);
  }
  parser.end();
  return formData;
}
var s, S, f2, F, LF, CR, SPACE, HYPHEN, COLON, A, Z, lower, noop, MultipartParser;
var init_multipart_parser = __esm({
  "node_modules/node-fetch/src/utils/multipart-parser.js"() {
    init_from();
    init_esm_min();
    s = 0;
    S = {
      START_BOUNDARY: s++,
      HEADER_FIELD_START: s++,
      HEADER_FIELD: s++,
      HEADER_VALUE_START: s++,
      HEADER_VALUE: s++,
      HEADER_VALUE_ALMOST_DONE: s++,
      HEADERS_ALMOST_DONE: s++,
      PART_DATA_START: s++,
      PART_DATA: s++,
      END: s++
    };
    f2 = 1;
    F = {
      PART_BOUNDARY: f2,
      LAST_BOUNDARY: f2 *= 2
    };
    LF = 10;
    CR = 13;
    SPACE = 32;
    HYPHEN = 45;
    COLON = 58;
    A = 97;
    Z = 122;
    lower = (c) => c | 32;
    noop = () => {
    };
    MultipartParser = class {
      /**
       * @param {string} boundary
       */
      constructor(boundary) {
        this.index = 0;
        this.flags = 0;
        this.onHeaderEnd = noop;
        this.onHeaderField = noop;
        this.onHeadersEnd = noop;
        this.onHeaderValue = noop;
        this.onPartBegin = noop;
        this.onPartData = noop;
        this.onPartEnd = noop;
        this.boundaryChars = {};
        boundary = "\r\n--" + boundary;
        const ui8a = new Uint8Array(boundary.length);
        for (let i2 = 0; i2 < boundary.length; i2++) {
          ui8a[i2] = boundary.charCodeAt(i2);
          this.boundaryChars[ui8a[i2]] = true;
        }
        this.boundary = ui8a;
        this.lookbehind = new Uint8Array(this.boundary.length + 8);
        this.state = S.START_BOUNDARY;
      }
      /**
       * @param {Uint8Array} data
       */
      write(data) {
        let i2 = 0;
        const length_ = data.length;
        let previousIndex = this.index;
        let { lookbehind, boundary, boundaryChars, index, state, flags } = this;
        const boundaryLength = this.boundary.length;
        const boundaryEnd = boundaryLength - 1;
        const bufferLength = data.length;
        let c;
        let cl;
        const mark = (name) => {
          this[name + "Mark"] = i2;
        };
        const clear = (name) => {
          delete this[name + "Mark"];
        };
        const callback = (callbackSymbol, start, end, ui8a) => {
          if (start === void 0 || start !== end) {
            this[callbackSymbol](ui8a && ui8a.subarray(start, end));
          }
        };
        const dataCallback = (name, clear2) => {
          const markSymbol = name + "Mark";
          if (!(markSymbol in this)) {
            return;
          }
          if (clear2) {
            callback(name, this[markSymbol], i2, data);
            delete this[markSymbol];
          } else {
            callback(name, this[markSymbol], data.length, data);
            this[markSymbol] = 0;
          }
        };
        for (i2 = 0; i2 < length_; i2++) {
          c = data[i2];
          switch (state) {
            case S.START_BOUNDARY:
              if (index === boundary.length - 2) {
                if (c === HYPHEN) {
                  flags |= F.LAST_BOUNDARY;
                } else if (c !== CR) {
                  return;
                }
                index++;
                break;
              } else if (index - 1 === boundary.length - 2) {
                if (flags & F.LAST_BOUNDARY && c === HYPHEN) {
                  state = S.END;
                  flags = 0;
                } else if (!(flags & F.LAST_BOUNDARY) && c === LF) {
                  index = 0;
                  callback("onPartBegin");
                  state = S.HEADER_FIELD_START;
                } else {
                  return;
                }
                break;
              }
              if (c !== boundary[index + 2]) {
                index = -2;
              }
              if (c === boundary[index + 2]) {
                index++;
              }
              break;
            case S.HEADER_FIELD_START:
              state = S.HEADER_FIELD;
              mark("onHeaderField");
              index = 0;
            // falls through
            case S.HEADER_FIELD:
              if (c === CR) {
                clear("onHeaderField");
                state = S.HEADERS_ALMOST_DONE;
                break;
              }
              index++;
              if (c === HYPHEN) {
                break;
              }
              if (c === COLON) {
                if (index === 1) {
                  return;
                }
                dataCallback("onHeaderField", true);
                state = S.HEADER_VALUE_START;
                break;
              }
              cl = lower(c);
              if (cl < A || cl > Z) {
                return;
              }
              break;
            case S.HEADER_VALUE_START:
              if (c === SPACE) {
                break;
              }
              mark("onHeaderValue");
              state = S.HEADER_VALUE;
            // falls through
            case S.HEADER_VALUE:
              if (c === CR) {
                dataCallback("onHeaderValue", true);
                callback("onHeaderEnd");
                state = S.HEADER_VALUE_ALMOST_DONE;
              }
              break;
            case S.HEADER_VALUE_ALMOST_DONE:
              if (c !== LF) {
                return;
              }
              state = S.HEADER_FIELD_START;
              break;
            case S.HEADERS_ALMOST_DONE:
              if (c !== LF) {
                return;
              }
              callback("onHeadersEnd");
              state = S.PART_DATA_START;
              break;
            case S.PART_DATA_START:
              state = S.PART_DATA;
              mark("onPartData");
            // falls through
            case S.PART_DATA:
              previousIndex = index;
              if (index === 0) {
                i2 += boundaryEnd;
                while (i2 < bufferLength && !(data[i2] in boundaryChars)) {
                  i2 += boundaryLength;
                }
                i2 -= boundaryEnd;
                c = data[i2];
              }
              if (index < boundary.length) {
                if (boundary[index] === c) {
                  if (index === 0) {
                    dataCallback("onPartData", true);
                  }
                  index++;
                } else {
                  index = 0;
                }
              } else if (index === boundary.length) {
                index++;
                if (c === CR) {
                  flags |= F.PART_BOUNDARY;
                } else if (c === HYPHEN) {
                  flags |= F.LAST_BOUNDARY;
                } else {
                  index = 0;
                }
              } else if (index - 1 === boundary.length) {
                if (flags & F.PART_BOUNDARY) {
                  index = 0;
                  if (c === LF) {
                    flags &= ~F.PART_BOUNDARY;
                    callback("onPartEnd");
                    callback("onPartBegin");
                    state = S.HEADER_FIELD_START;
                    break;
                  }
                } else if (flags & F.LAST_BOUNDARY) {
                  if (c === HYPHEN) {
                    callback("onPartEnd");
                    state = S.END;
                    flags = 0;
                  } else {
                    index = 0;
                  }
                } else {
                  index = 0;
                }
              }
              if (index > 0) {
                lookbehind[index - 1] = c;
              } else if (previousIndex > 0) {
                const _lookbehind = new Uint8Array(lookbehind.buffer, lookbehind.byteOffset, lookbehind.byteLength);
                callback("onPartData", 0, previousIndex, _lookbehind);
                previousIndex = 0;
                mark("onPartData");
                i2--;
              }
              break;
            case S.END:
              break;
            default:
              throw new Error(`Unexpected state entered: ${state}`);
          }
        }
        dataCallback("onHeaderField");
        dataCallback("onHeaderValue");
        dataCallback("onPartData");
        this.index = index;
        this.state = state;
        this.flags = flags;
      }
      end() {
        if (this.state === S.HEADER_FIELD_START && this.index === 0 || this.state === S.PART_DATA && this.index === this.boundary.length) {
          this.onPartEnd();
        } else if (this.state !== S.END) {
          throw new Error("MultipartParser.end(): stream ended unexpectedly");
        }
      }
    };
  }
});

// src/control.tsx
var control_exports = {};
__export(control_exports, {
  default: () => Command
});
module.exports = __toCommonJS(control_exports);
var import_api = require("@raycast/api");
var import_react = require("react");

// node_modules/node-fetch/src/index.js
var import_node_http2 = __toESM(require("node:http"), 1);
var import_node_https = __toESM(require("node:https"), 1);
var import_node_zlib = __toESM(require("node:zlib"), 1);
var import_node_stream2 = __toESM(require("node:stream"), 1);
var import_node_buffer2 = require("node:buffer");

// node_modules/data-uri-to-buffer/dist/index.js
function dataUriToBuffer(uri) {
  if (!/^data:/i.test(uri)) {
    throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  }
  uri = uri.replace(/\r?\n/g, "");
  const firstComma = uri.indexOf(",");
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError("malformed data: URI");
  }
  const meta = uri.substring(5, firstComma).split(";");
  let charset = "";
  let base64 = false;
  const type = meta[0] || "text/plain";
  let typeFull = type;
  for (let i2 = 1; i2 < meta.length; i2++) {
    if (meta[i2] === "base64") {
      base64 = true;
    } else if (meta[i2]) {
      typeFull += `;${meta[i2]}`;
      if (meta[i2].indexOf("charset=") === 0) {
        charset = meta[i2].substring(8);
      }
    }
  }
  if (!meta[0] && !charset.length) {
    typeFull += ";charset=US-ASCII";
    charset = "US-ASCII";
  }
  const encoding = base64 ? "base64" : "ascii";
  const data = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data, encoding);
  buffer.type = type;
  buffer.typeFull = typeFull;
  buffer.charset = charset;
  return buffer;
}
var dist_default = dataUriToBuffer;

// node_modules/node-fetch/src/body.js
var import_node_stream = __toESM(require("node:stream"), 1);
var import_node_util = require("node:util");
var import_node_buffer = require("node:buffer");
init_fetch_blob();
init_esm_min();

// node_modules/node-fetch/src/errors/base.js
var FetchBaseError = class extends Error {
  constructor(message, type) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.type = type;
  }
  get name() {
    return this.constructor.name;
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
};

// node_modules/node-fetch/src/errors/fetch-error.js
var FetchError = class extends FetchBaseError {
  /**
   * @param  {string} message -      Error message for human
   * @param  {string} [type] -        Error type for machine
   * @param  {SystemError} [systemError] - For Node.js system error
   */
  constructor(message, type, systemError) {
    super(message, type);
    if (systemError) {
      this.code = this.errno = systemError.code;
      this.erroredSysCall = systemError.syscall;
    }
  }
};

// node_modules/node-fetch/src/utils/is.js
var NAME = Symbol.toStringTag;
var isURLSearchParameters = (object) => {
  return typeof object === "object" && typeof object.append === "function" && typeof object.delete === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.has === "function" && typeof object.set === "function" && typeof object.sort === "function" && object[NAME] === "URLSearchParams";
};
var isBlob = (object) => {
  return object && typeof object === "object" && typeof object.arrayBuffer === "function" && typeof object.type === "string" && typeof object.stream === "function" && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[NAME]);
};
var isAbortSignal = (object) => {
  return typeof object === "object" && (object[NAME] === "AbortSignal" || object[NAME] === "EventTarget");
};
var isDomainOrSubdomain = (destination, original) => {
  const orig = new URL(original).hostname;
  const dest = new URL(destination).hostname;
  return orig === dest || orig.endsWith(`.${dest}`);
};
var isSameProtocol = (destination, original) => {
  const orig = new URL(original).protocol;
  const dest = new URL(destination).protocol;
  return orig === dest;
};

// node_modules/node-fetch/src/body.js
var pipeline = (0, import_node_util.promisify)(import_node_stream.default.pipeline);
var INTERNALS = /* @__PURE__ */ Symbol("Body internals");
var Body = class {
  constructor(body, {
    size = 0
  } = {}) {
    let boundary = null;
    if (body === null) {
      body = null;
    } else if (isURLSearchParameters(body)) {
      body = import_node_buffer.Buffer.from(body.toString());
    } else if (isBlob(body)) {
    } else if (import_node_buffer.Buffer.isBuffer(body)) {
    } else if (import_node_util.types.isAnyArrayBuffer(body)) {
      body = import_node_buffer.Buffer.from(body);
    } else if (ArrayBuffer.isView(body)) {
      body = import_node_buffer.Buffer.from(body.buffer, body.byteOffset, body.byteLength);
    } else if (body instanceof import_node_stream.default) {
    } else if (body instanceof FormData) {
      body = formDataToBlob(body);
      boundary = body.type.split("=")[1];
    } else {
      body = import_node_buffer.Buffer.from(String(body));
    }
    let stream = body;
    if (import_node_buffer.Buffer.isBuffer(body)) {
      stream = import_node_stream.default.Readable.from(body);
    } else if (isBlob(body)) {
      stream = import_node_stream.default.Readable.from(body.stream());
    }
    this[INTERNALS] = {
      body,
      stream,
      boundary,
      disturbed: false,
      error: null
    };
    this.size = size;
    if (body instanceof import_node_stream.default) {
      body.on("error", (error_) => {
        const error = error_ instanceof FetchBaseError ? error_ : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${error_.message}`, "system", error_);
        this[INTERNALS].error = error;
      });
    }
  }
  get body() {
    return this[INTERNALS].stream;
  }
  get bodyUsed() {
    return this[INTERNALS].disturbed;
  }
  /**
   * Decode response as ArrayBuffer
   *
   * @return  Promise
   */
  async arrayBuffer() {
    const { buffer, byteOffset, byteLength } = await consumeBody(this);
    return buffer.slice(byteOffset, byteOffset + byteLength);
  }
  async formData() {
    const ct = this.headers.get("content-type");
    if (ct.startsWith("application/x-www-form-urlencoded")) {
      const formData = new FormData();
      const parameters = new URLSearchParams(await this.text());
      for (const [name, value] of parameters) {
        formData.append(name, value);
      }
      return formData;
    }
    const { toFormData: toFormData2 } = await Promise.resolve().then(() => (init_multipart_parser(), multipart_parser_exports));
    return toFormData2(this.body, ct);
  }
  /**
   * Return raw response as Blob
   *
   * @return Promise
   */
  async blob() {
    const ct = this.headers && this.headers.get("content-type") || this[INTERNALS].body && this[INTERNALS].body.type || "";
    const buf = await this.arrayBuffer();
    return new fetch_blob_default([buf], {
      type: ct
    });
  }
  /**
   * Decode response as json
   *
   * @return  Promise
   */
  async json() {
    const text = await this.text();
    return JSON.parse(text);
  }
  /**
   * Decode response as text
   *
   * @return  Promise
   */
  async text() {
    const buffer = await consumeBody(this);
    return new TextDecoder().decode(buffer);
  }
  /**
   * Decode response as buffer (non-spec api)
   *
   * @return  Promise
   */
  buffer() {
    return consumeBody(this);
  }
};
Body.prototype.buffer = (0, import_node_util.deprecate)(Body.prototype.buffer, "Please use 'response.arrayBuffer()' instead of 'response.buffer()'", "node-fetch#buffer");
Object.defineProperties(Body.prototype, {
  body: { enumerable: true },
  bodyUsed: { enumerable: true },
  arrayBuffer: { enumerable: true },
  blob: { enumerable: true },
  json: { enumerable: true },
  text: { enumerable: true },
  data: { get: (0, import_node_util.deprecate)(
    () => {
    },
    "data doesn't exist, use json(), text(), arrayBuffer(), or body instead",
    "https://github.com/node-fetch/node-fetch/issues/1000 (response)"
  ) }
});
async function consumeBody(data) {
  if (data[INTERNALS].disturbed) {
    throw new TypeError(`body used already for: ${data.url}`);
  }
  data[INTERNALS].disturbed = true;
  if (data[INTERNALS].error) {
    throw data[INTERNALS].error;
  }
  const { body } = data;
  if (body === null) {
    return import_node_buffer.Buffer.alloc(0);
  }
  if (!(body instanceof import_node_stream.default)) {
    return import_node_buffer.Buffer.alloc(0);
  }
  const accum = [];
  let accumBytes = 0;
  try {
    for await (const chunk of body) {
      if (data.size > 0 && accumBytes + chunk.length > data.size) {
        const error = new FetchError(`content size at ${data.url} over limit: ${data.size}`, "max-size");
        body.destroy(error);
        throw error;
      }
      accumBytes += chunk.length;
      accum.push(chunk);
    }
  } catch (error) {
    const error_ = error instanceof FetchBaseError ? error : new FetchError(`Invalid response body while trying to fetch ${data.url}: ${error.message}`, "system", error);
    throw error_;
  }
  if (body.readableEnded === true || body._readableState.ended === true) {
    try {
      if (accum.every((c) => typeof c === "string")) {
        return import_node_buffer.Buffer.from(accum.join(""));
      }
      return import_node_buffer.Buffer.concat(accum, accumBytes);
    } catch (error) {
      throw new FetchError(`Could not create Buffer from response body for ${data.url}: ${error.message}`, "system", error);
    }
  } else {
    throw new FetchError(`Premature close of server response while trying to fetch ${data.url}`);
  }
}
var clone = (instance, highWaterMark) => {
  let p1;
  let p2;
  let { body } = instance[INTERNALS];
  if (instance.bodyUsed) {
    throw new Error("cannot clone body after it is used");
  }
  if (body instanceof import_node_stream.default && typeof body.getBoundary !== "function") {
    p1 = new import_node_stream.PassThrough({ highWaterMark });
    p2 = new import_node_stream.PassThrough({ highWaterMark });
    body.pipe(p1);
    body.pipe(p2);
    instance[INTERNALS].stream = p1;
    body = p2;
  }
  return body;
};
var getNonSpecFormDataBoundary = (0, import_node_util.deprecate)(
  (body) => body.getBoundary(),
  "form-data doesn't follow the spec and requires special treatment. Use alternative package",
  "https://github.com/node-fetch/node-fetch/issues/1167"
);
var extractContentType = (body, request) => {
  if (body === null) {
    return null;
  }
  if (typeof body === "string") {
    return "text/plain;charset=UTF-8";
  }
  if (isURLSearchParameters(body)) {
    return "application/x-www-form-urlencoded;charset=UTF-8";
  }
  if (isBlob(body)) {
    return body.type || null;
  }
  if (import_node_buffer.Buffer.isBuffer(body) || import_node_util.types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
    return null;
  }
  if (body instanceof FormData) {
    return `multipart/form-data; boundary=${request[INTERNALS].boundary}`;
  }
  if (body && typeof body.getBoundary === "function") {
    return `multipart/form-data;boundary=${getNonSpecFormDataBoundary(body)}`;
  }
  if (body instanceof import_node_stream.default) {
    return null;
  }
  return "text/plain;charset=UTF-8";
};
var getTotalBytes = (request) => {
  const { body } = request[INTERNALS];
  if (body === null) {
    return 0;
  }
  if (isBlob(body)) {
    return body.size;
  }
  if (import_node_buffer.Buffer.isBuffer(body)) {
    return body.length;
  }
  if (body && typeof body.getLengthSync === "function") {
    return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
  }
  return null;
};
var writeToStream = async (dest, { body }) => {
  if (body === null) {
    dest.end();
  } else {
    await pipeline(body, dest);
  }
};

// node_modules/node-fetch/src/headers.js
var import_node_util2 = require("node:util");
var import_node_http = __toESM(require("node:http"), 1);
var validateHeaderName = typeof import_node_http.default.validateHeaderName === "function" ? import_node_http.default.validateHeaderName : (name) => {
  if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
    const error = new TypeError(`Header name must be a valid HTTP token [${name}]`);
    Object.defineProperty(error, "code", { value: "ERR_INVALID_HTTP_TOKEN" });
    throw error;
  }
};
var validateHeaderValue = typeof import_node_http.default.validateHeaderValue === "function" ? import_node_http.default.validateHeaderValue : (name, value) => {
  if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
    const error = new TypeError(`Invalid character in header content ["${name}"]`);
    Object.defineProperty(error, "code", { value: "ERR_INVALID_CHAR" });
    throw error;
  }
};
var Headers = class _Headers extends URLSearchParams {
  /**
   * Headers class
   *
   * @constructor
   * @param {HeadersInit} [init] - Response headers
   */
  constructor(init) {
    let result = [];
    if (init instanceof _Headers) {
      const raw = init.raw();
      for (const [name, values] of Object.entries(raw)) {
        result.push(...values.map((value) => [name, value]));
      }
    } else if (init == null) {
    } else if (typeof init === "object" && !import_node_util2.types.isBoxedPrimitive(init)) {
      const method = init[Symbol.iterator];
      if (method == null) {
        result.push(...Object.entries(init));
      } else {
        if (typeof method !== "function") {
          throw new TypeError("Header pairs must be iterable");
        }
        result = [...init].map((pair) => {
          if (typeof pair !== "object" || import_node_util2.types.isBoxedPrimitive(pair)) {
            throw new TypeError("Each header pair must be an iterable object");
          }
          return [...pair];
        }).map((pair) => {
          if (pair.length !== 2) {
            throw new TypeError("Each header pair must be a name/value tuple");
          }
          return [...pair];
        });
      }
    } else {
      throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
    }
    result = result.length > 0 ? result.map(([name, value]) => {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return [String(name).toLowerCase(), String(value)];
    }) : void 0;
    super(result);
    return new Proxy(this, {
      get(target, p, receiver) {
        switch (p) {
          case "append":
          case "set":
            return (name, value) => {
              validateHeaderName(name);
              validateHeaderValue(name, String(value));
              return URLSearchParams.prototype[p].call(
                target,
                String(name).toLowerCase(),
                String(value)
              );
            };
          case "delete":
          case "has":
          case "getAll":
            return (name) => {
              validateHeaderName(name);
              return URLSearchParams.prototype[p].call(
                target,
                String(name).toLowerCase()
              );
            };
          case "keys":
            return () => {
              target.sort();
              return new Set(URLSearchParams.prototype.keys.call(target)).keys();
            };
          default:
            return Reflect.get(target, p, receiver);
        }
      }
    });
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
  toString() {
    return Object.prototype.toString.call(this);
  }
  get(name) {
    const values = this.getAll(name);
    if (values.length === 0) {
      return null;
    }
    let value = values.join(", ");
    if (/^content-encoding$/i.test(name)) {
      value = value.toLowerCase();
    }
    return value;
  }
  forEach(callback, thisArg = void 0) {
    for (const name of this.keys()) {
      Reflect.apply(callback, thisArg, [this.get(name), name, this]);
    }
  }
  *values() {
    for (const name of this.keys()) {
      yield this.get(name);
    }
  }
  /**
   * @type {() => IterableIterator<[string, string]>}
   */
  *entries() {
    for (const name of this.keys()) {
      yield [name, this.get(name)];
    }
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  /**
   * Node-fetch non-spec method
   * returning all headers and their values as array
   * @returns {Record<string, string[]>}
   */
  raw() {
    return [...this.keys()].reduce((result, key) => {
      result[key] = this.getAll(key);
      return result;
    }, {});
  }
  /**
   * For better console.log(headers) and also to convert Headers into Node.js Request compatible format
   */
  [/* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom")]() {
    return [...this.keys()].reduce((result, key) => {
      const values = this.getAll(key);
      if (key === "host") {
        result[key] = values[0];
      } else {
        result[key] = values.length > 1 ? values : values[0];
      }
      return result;
    }, {});
  }
};
Object.defineProperties(
  Headers.prototype,
  ["get", "entries", "forEach", "values"].reduce((result, property) => {
    result[property] = { enumerable: true };
    return result;
  }, {})
);
function fromRawHeaders(headers = []) {
  return new Headers(
    headers.reduce((result, value, index, array) => {
      if (index % 2 === 0) {
        result.push(array.slice(index, index + 2));
      }
      return result;
    }, []).filter(([name, value]) => {
      try {
        validateHeaderName(name);
        validateHeaderValue(name, String(value));
        return true;
      } catch {
        return false;
      }
    })
  );
}

// node_modules/node-fetch/src/utils/is-redirect.js
var redirectStatus = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
var isRedirect = (code) => {
  return redirectStatus.has(code);
};

// node_modules/node-fetch/src/response.js
var INTERNALS2 = /* @__PURE__ */ Symbol("Response internals");
var Response = class _Response extends Body {
  constructor(body = null, options = {}) {
    super(body, options);
    const status = options.status != null ? options.status : 200;
    const headers = new Headers(options.headers);
    if (body !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(body, this);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    this[INTERNALS2] = {
      type: "default",
      url: options.url,
      status,
      statusText: options.statusText || "",
      headers,
      counter: options.counter,
      highWaterMark: options.highWaterMark
    };
  }
  get type() {
    return this[INTERNALS2].type;
  }
  get url() {
    return this[INTERNALS2].url || "";
  }
  get status() {
    return this[INTERNALS2].status;
  }
  /**
   * Convenience property representing if the request ended normally
   */
  get ok() {
    return this[INTERNALS2].status >= 200 && this[INTERNALS2].status < 300;
  }
  get redirected() {
    return this[INTERNALS2].counter > 0;
  }
  get statusText() {
    return this[INTERNALS2].statusText;
  }
  get headers() {
    return this[INTERNALS2].headers;
  }
  get highWaterMark() {
    return this[INTERNALS2].highWaterMark;
  }
  /**
   * Clone this response
   *
   * @return  Response
   */
  clone() {
    return new _Response(clone(this, this.highWaterMark), {
      type: this.type,
      url: this.url,
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
      ok: this.ok,
      redirected: this.redirected,
      size: this.size,
      highWaterMark: this.highWaterMark
    });
  }
  /**
   * @param {string} url    The URL that the new response is to originate from.
   * @param {number} status An optional status code for the response (e.g., 302.)
   * @returns {Response}    A Response object.
   */
  static redirect(url, status = 302) {
    if (!isRedirect(status)) {
      throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
    }
    return new _Response(null, {
      headers: {
        location: new URL(url).toString()
      },
      status
    });
  }
  static error() {
    const response = new _Response(null, { status: 0, statusText: "" });
    response[INTERNALS2].type = "error";
    return response;
  }
  static json(data = void 0, init = {}) {
    const body = JSON.stringify(data);
    if (body === void 0) {
      throw new TypeError("data is not JSON serializable");
    }
    const headers = new Headers(init && init.headers);
    if (!headers.has("content-type")) {
      headers.set("content-type", "application/json");
    }
    return new _Response(body, {
      ...init,
      headers
    });
  }
  get [Symbol.toStringTag]() {
    return "Response";
  }
};
Object.defineProperties(Response.prototype, {
  type: { enumerable: true },
  url: { enumerable: true },
  status: { enumerable: true },
  ok: { enumerable: true },
  redirected: { enumerable: true },
  statusText: { enumerable: true },
  headers: { enumerable: true },
  clone: { enumerable: true }
});

// node_modules/node-fetch/src/request.js
var import_node_url = require("node:url");
var import_node_util3 = require("node:util");

// node_modules/node-fetch/src/utils/get-search.js
var getSearch = (parsedURL) => {
  if (parsedURL.search) {
    return parsedURL.search;
  }
  const lastOffset = parsedURL.href.length - 1;
  const hash = parsedURL.hash || (parsedURL.href[lastOffset] === "#" ? "#" : "");
  return parsedURL.href[lastOffset - hash.length] === "?" ? "?" : "";
};

// node_modules/node-fetch/src/utils/referrer.js
var import_node_net = require("node:net");
function stripURLForUseAsAReferrer(url, originOnly = false) {
  if (url == null) {
    return "no-referrer";
  }
  url = new URL(url);
  if (/^(about|blob|data):$/.test(url.protocol)) {
    return "no-referrer";
  }
  url.username = "";
  url.password = "";
  url.hash = "";
  if (originOnly) {
    url.pathname = "";
    url.search = "";
  }
  return url;
}
var ReferrerPolicy = /* @__PURE__ */ new Set([
  "",
  "no-referrer",
  "no-referrer-when-downgrade",
  "same-origin",
  "origin",
  "strict-origin",
  "origin-when-cross-origin",
  "strict-origin-when-cross-origin",
  "unsafe-url"
]);
var DEFAULT_REFERRER_POLICY = "strict-origin-when-cross-origin";
function validateReferrerPolicy(referrerPolicy) {
  if (!ReferrerPolicy.has(referrerPolicy)) {
    throw new TypeError(`Invalid referrerPolicy: ${referrerPolicy}`);
  }
  return referrerPolicy;
}
function isOriginPotentiallyTrustworthy(url) {
  if (/^(http|ws)s:$/.test(url.protocol)) {
    return true;
  }
  const hostIp = url.host.replace(/(^\[)|(]$)/g, "");
  const hostIPVersion = (0, import_node_net.isIP)(hostIp);
  if (hostIPVersion === 4 && /^127\./.test(hostIp)) {
    return true;
  }
  if (hostIPVersion === 6 && /^(((0+:){7})|(::(0+:){0,6}))0*1$/.test(hostIp)) {
    return true;
  }
  if (url.host === "localhost" || url.host.endsWith(".localhost")) {
    return false;
  }
  if (url.protocol === "file:") {
    return true;
  }
  return false;
}
function isUrlPotentiallyTrustworthy(url) {
  if (/^about:(blank|srcdoc)$/.test(url)) {
    return true;
  }
  if (url.protocol === "data:") {
    return true;
  }
  if (/^(blob|filesystem):$/.test(url.protocol)) {
    return true;
  }
  return isOriginPotentiallyTrustworthy(url);
}
function determineRequestsReferrer(request, { referrerURLCallback, referrerOriginCallback } = {}) {
  if (request.referrer === "no-referrer" || request.referrerPolicy === "") {
    return null;
  }
  const policy = request.referrerPolicy;
  if (request.referrer === "about:client") {
    return "no-referrer";
  }
  const referrerSource = request.referrer;
  let referrerURL = stripURLForUseAsAReferrer(referrerSource);
  let referrerOrigin = stripURLForUseAsAReferrer(referrerSource, true);
  if (referrerURL.toString().length > 4096) {
    referrerURL = referrerOrigin;
  }
  if (referrerURLCallback) {
    referrerURL = referrerURLCallback(referrerURL);
  }
  if (referrerOriginCallback) {
    referrerOrigin = referrerOriginCallback(referrerOrigin);
  }
  const currentURL = new URL(request.url);
  switch (policy) {
    case "no-referrer":
      return "no-referrer";
    case "origin":
      return referrerOrigin;
    case "unsafe-url":
      return referrerURL;
    case "strict-origin":
      if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
        return "no-referrer";
      }
      return referrerOrigin.toString();
    case "strict-origin-when-cross-origin":
      if (referrerURL.origin === currentURL.origin) {
        return referrerURL;
      }
      if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
        return "no-referrer";
      }
      return referrerOrigin;
    case "same-origin":
      if (referrerURL.origin === currentURL.origin) {
        return referrerURL;
      }
      return "no-referrer";
    case "origin-when-cross-origin":
      if (referrerURL.origin === currentURL.origin) {
        return referrerURL;
      }
      return referrerOrigin;
    case "no-referrer-when-downgrade":
      if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
        return "no-referrer";
      }
      return referrerURL;
    default:
      throw new TypeError(`Invalid referrerPolicy: ${policy}`);
  }
}
function parseReferrerPolicyFromHeader(headers) {
  const policyTokens = (headers.get("referrer-policy") || "").split(/[,\s]+/);
  let policy = "";
  for (const token of policyTokens) {
    if (token && ReferrerPolicy.has(token)) {
      policy = token;
    }
  }
  return policy;
}

// node_modules/node-fetch/src/request.js
var INTERNALS3 = /* @__PURE__ */ Symbol("Request internals");
var isRequest = (object) => {
  return typeof object === "object" && typeof object[INTERNALS3] === "object";
};
var doBadDataWarn = (0, import_node_util3.deprecate)(
  () => {
  },
  ".data is not a valid RequestInit property, use .body instead",
  "https://github.com/node-fetch/node-fetch/issues/1000 (request)"
);
var Request = class _Request extends Body {
  constructor(input, init = {}) {
    let parsedURL;
    if (isRequest(input)) {
      parsedURL = new URL(input.url);
    } else {
      parsedURL = new URL(input);
      input = {};
    }
    if (parsedURL.username !== "" || parsedURL.password !== "") {
      throw new TypeError(`${parsedURL} is an url with embedded credentials.`);
    }
    let method = init.method || input.method || "GET";
    if (/^(delete|get|head|options|post|put)$/i.test(method)) {
      method = method.toUpperCase();
    }
    if (!isRequest(init) && "data" in init) {
      doBadDataWarn();
    }
    if ((init.body != null || isRequest(input) && input.body !== null) && (method === "GET" || method === "HEAD")) {
      throw new TypeError("Request with GET/HEAD method cannot have body");
    }
    const inputBody = init.body ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;
    super(inputBody, {
      size: init.size || input.size || 0
    });
    const headers = new Headers(init.headers || input.headers || {});
    if (inputBody !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(inputBody, this);
      if (contentType) {
        headers.set("Content-Type", contentType);
      }
    }
    let signal = isRequest(input) ? input.signal : null;
    if ("signal" in init) {
      signal = init.signal;
    }
    if (signal != null && !isAbortSignal(signal)) {
      throw new TypeError("Expected signal to be an instanceof AbortSignal or EventTarget");
    }
    let referrer = init.referrer == null ? input.referrer : init.referrer;
    if (referrer === "") {
      referrer = "no-referrer";
    } else if (referrer) {
      const parsedReferrer = new URL(referrer);
      referrer = /^about:(\/\/)?client$/.test(parsedReferrer) ? "client" : parsedReferrer;
    } else {
      referrer = void 0;
    }
    this[INTERNALS3] = {
      method,
      redirect: init.redirect || input.redirect || "follow",
      headers,
      parsedURL,
      signal,
      referrer
    };
    this.follow = init.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init.follow;
    this.compress = init.compress === void 0 ? input.compress === void 0 ? true : input.compress : init.compress;
    this.counter = init.counter || input.counter || 0;
    this.agent = init.agent || input.agent;
    this.highWaterMark = init.highWaterMark || input.highWaterMark || 16384;
    this.insecureHTTPParser = init.insecureHTTPParser || input.insecureHTTPParser || false;
    this.referrerPolicy = init.referrerPolicy || input.referrerPolicy || "";
  }
  /** @returns {string} */
  get method() {
    return this[INTERNALS3].method;
  }
  /** @returns {string} */
  get url() {
    return (0, import_node_url.format)(this[INTERNALS3].parsedURL);
  }
  /** @returns {Headers} */
  get headers() {
    return this[INTERNALS3].headers;
  }
  get redirect() {
    return this[INTERNALS3].redirect;
  }
  /** @returns {AbortSignal} */
  get signal() {
    return this[INTERNALS3].signal;
  }
  // https://fetch.spec.whatwg.org/#dom-request-referrer
  get referrer() {
    if (this[INTERNALS3].referrer === "no-referrer") {
      return "";
    }
    if (this[INTERNALS3].referrer === "client") {
      return "about:client";
    }
    if (this[INTERNALS3].referrer) {
      return this[INTERNALS3].referrer.toString();
    }
    return void 0;
  }
  get referrerPolicy() {
    return this[INTERNALS3].referrerPolicy;
  }
  set referrerPolicy(referrerPolicy) {
    this[INTERNALS3].referrerPolicy = validateReferrerPolicy(referrerPolicy);
  }
  /**
   * Clone this request
   *
   * @return  Request
   */
  clone() {
    return new _Request(this);
  }
  get [Symbol.toStringTag]() {
    return "Request";
  }
};
Object.defineProperties(Request.prototype, {
  method: { enumerable: true },
  url: { enumerable: true },
  headers: { enumerable: true },
  redirect: { enumerable: true },
  clone: { enumerable: true },
  signal: { enumerable: true },
  referrer: { enumerable: true },
  referrerPolicy: { enumerable: true }
});
var getNodeRequestOptions = (request) => {
  const { parsedURL } = request[INTERNALS3];
  const headers = new Headers(request[INTERNALS3].headers);
  if (!headers.has("Accept")) {
    headers.set("Accept", "*/*");
  }
  let contentLengthValue = null;
  if (request.body === null && /^(post|put)$/i.test(request.method)) {
    contentLengthValue = "0";
  }
  if (request.body !== null) {
    const totalBytes = getTotalBytes(request);
    if (typeof totalBytes === "number" && !Number.isNaN(totalBytes)) {
      contentLengthValue = String(totalBytes);
    }
  }
  if (contentLengthValue) {
    headers.set("Content-Length", contentLengthValue);
  }
  if (request.referrerPolicy === "") {
    request.referrerPolicy = DEFAULT_REFERRER_POLICY;
  }
  if (request.referrer && request.referrer !== "no-referrer") {
    request[INTERNALS3].referrer = determineRequestsReferrer(request);
  } else {
    request[INTERNALS3].referrer = "no-referrer";
  }
  if (request[INTERNALS3].referrer instanceof URL) {
    headers.set("Referer", request.referrer);
  }
  if (!headers.has("User-Agent")) {
    headers.set("User-Agent", "node-fetch");
  }
  if (request.compress && !headers.has("Accept-Encoding")) {
    headers.set("Accept-Encoding", "gzip, deflate, br");
  }
  let { agent } = request;
  if (typeof agent === "function") {
    agent = agent(parsedURL);
  }
  const search = getSearch(parsedURL);
  const options = {
    // Overwrite search to retain trailing ? (issue #776)
    path: parsedURL.pathname + search,
    // The following options are not expressed in the URL
    method: request.method,
    headers: headers[/* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom")](),
    insecureHTTPParser: request.insecureHTTPParser,
    agent
  };
  return {
    /** @type {URL} */
    parsedURL,
    options
  };
};

// node_modules/node-fetch/src/errors/abort-error.js
var AbortError = class extends FetchBaseError {
  constructor(message, type = "aborted") {
    super(message, type);
  }
};

// node_modules/node-fetch/src/index.js
init_esm_min();
init_from();
var supportedSchemas = /* @__PURE__ */ new Set(["data:", "http:", "https:"]);
async function fetch(url, options_) {
  return new Promise((resolve, reject) => {
    const request = new Request(url, options_);
    const { parsedURL, options } = getNodeRequestOptions(request);
    if (!supportedSchemas.has(parsedURL.protocol)) {
      throw new TypeError(`node-fetch cannot load ${url}. URL scheme "${parsedURL.protocol.replace(/:$/, "")}" is not supported.`);
    }
    if (parsedURL.protocol === "data:") {
      const data = dist_default(request.url);
      const response2 = new Response(data, { headers: { "Content-Type": data.typeFull } });
      resolve(response2);
      return;
    }
    const send = (parsedURL.protocol === "https:" ? import_node_https.default : import_node_http2.default).request;
    const { signal } = request;
    let response = null;
    const abort = () => {
      const error = new AbortError("The operation was aborted.");
      reject(error);
      if (request.body && request.body instanceof import_node_stream2.default.Readable) {
        request.body.destroy(error);
      }
      if (!response || !response.body) {
        return;
      }
      response.body.emit("error", error);
    };
    if (signal && signal.aborted) {
      abort();
      return;
    }
    const abortAndFinalize = () => {
      abort();
      finalize();
    };
    const request_ = send(parsedURL.toString(), options);
    if (signal) {
      signal.addEventListener("abort", abortAndFinalize);
    }
    const finalize = () => {
      request_.abort();
      if (signal) {
        signal.removeEventListener("abort", abortAndFinalize);
      }
    };
    request_.on("error", (error) => {
      reject(new FetchError(`request to ${request.url} failed, reason: ${error.message}`, "system", error));
      finalize();
    });
    fixResponseChunkedTransferBadEnding(request_, (error) => {
      if (response && response.body) {
        response.body.destroy(error);
      }
    });
    if (process.version < "v14") {
      request_.on("socket", (s2) => {
        let endedWithEventsCount;
        s2.prependListener("end", () => {
          endedWithEventsCount = s2._eventsCount;
        });
        s2.prependListener("close", (hadError) => {
          if (response && endedWithEventsCount < s2._eventsCount && !hadError) {
            const error = new Error("Premature close");
            error.code = "ERR_STREAM_PREMATURE_CLOSE";
            response.body.emit("error", error);
          }
        });
      });
    }
    request_.on("response", (response_) => {
      request_.setTimeout(0);
      const headers = fromRawHeaders(response_.rawHeaders);
      if (isRedirect(response_.statusCode)) {
        const location = headers.get("Location");
        let locationURL = null;
        try {
          locationURL = location === null ? null : new URL(location, request.url);
        } catch {
          if (request.redirect !== "manual") {
            reject(new FetchError(`uri requested responds with an invalid redirect URL: ${location}`, "invalid-redirect"));
            finalize();
            return;
          }
        }
        switch (request.redirect) {
          case "error":
            reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
            finalize();
            return;
          case "manual":
            break;
          case "follow": {
            if (locationURL === null) {
              break;
            }
            if (request.counter >= request.follow) {
              reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
              finalize();
              return;
            }
            const requestOptions = {
              headers: new Headers(request.headers),
              follow: request.follow,
              counter: request.counter + 1,
              agent: request.agent,
              compress: request.compress,
              method: request.method,
              body: clone(request),
              signal: request.signal,
              size: request.size,
              referrer: request.referrer,
              referrerPolicy: request.referrerPolicy
            };
            if (!isDomainOrSubdomain(request.url, locationURL) || !isSameProtocol(request.url, locationURL)) {
              for (const name of ["authorization", "www-authenticate", "cookie", "cookie2"]) {
                requestOptions.headers.delete(name);
              }
            }
            if (response_.statusCode !== 303 && request.body && options_.body instanceof import_node_stream2.default.Readable) {
              reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
              finalize();
              return;
            }
            if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === "POST") {
              requestOptions.method = "GET";
              requestOptions.body = void 0;
              requestOptions.headers.delete("content-length");
            }
            const responseReferrerPolicy = parseReferrerPolicyFromHeader(headers);
            if (responseReferrerPolicy) {
              requestOptions.referrerPolicy = responseReferrerPolicy;
            }
            resolve(fetch(new Request(locationURL, requestOptions)));
            finalize();
            return;
          }
          default:
            return reject(new TypeError(`Redirect option '${request.redirect}' is not a valid value of RequestRedirect`));
        }
      }
      if (signal) {
        response_.once("end", () => {
          signal.removeEventListener("abort", abortAndFinalize);
        });
      }
      let body = (0, import_node_stream2.pipeline)(response_, new import_node_stream2.PassThrough(), (error) => {
        if (error) {
          reject(error);
        }
      });
      if (process.version < "v12.10") {
        response_.on("aborted", abortAndFinalize);
      }
      const responseOptions = {
        url: request.url,
        status: response_.statusCode,
        statusText: response_.statusMessage,
        headers,
        size: request.size,
        counter: request.counter,
        highWaterMark: request.highWaterMark
      };
      const codings = headers.get("Content-Encoding");
      if (!request.compress || request.method === "HEAD" || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
        response = new Response(body, responseOptions);
        resolve(response);
        return;
      }
      const zlibOptions = {
        flush: import_node_zlib.default.Z_SYNC_FLUSH,
        finishFlush: import_node_zlib.default.Z_SYNC_FLUSH
      };
      if (codings === "gzip" || codings === "x-gzip") {
        body = (0, import_node_stream2.pipeline)(body, import_node_zlib.default.createGunzip(zlibOptions), (error) => {
          if (error) {
            reject(error);
          }
        });
        response = new Response(body, responseOptions);
        resolve(response);
        return;
      }
      if (codings === "deflate" || codings === "x-deflate") {
        const raw = (0, import_node_stream2.pipeline)(response_, new import_node_stream2.PassThrough(), (error) => {
          if (error) {
            reject(error);
          }
        });
        raw.once("data", (chunk) => {
          if ((chunk[0] & 15) === 8) {
            body = (0, import_node_stream2.pipeline)(body, import_node_zlib.default.createInflate(), (error) => {
              if (error) {
                reject(error);
              }
            });
          } else {
            body = (0, import_node_stream2.pipeline)(body, import_node_zlib.default.createInflateRaw(), (error) => {
              if (error) {
                reject(error);
              }
            });
          }
          response = new Response(body, responseOptions);
          resolve(response);
        });
        raw.once("end", () => {
          if (!response) {
            response = new Response(body, responseOptions);
            resolve(response);
          }
        });
        return;
      }
      if (codings === "br") {
        body = (0, import_node_stream2.pipeline)(body, import_node_zlib.default.createBrotliDecompress(), (error) => {
          if (error) {
            reject(error);
          }
        });
        response = new Response(body, responseOptions);
        resolve(response);
        return;
      }
      response = new Response(body, responseOptions);
      resolve(response);
    });
    writeToStream(request_, request).catch(reject);
  });
}
function fixResponseChunkedTransferBadEnding(request, errorCallback) {
  const LAST_CHUNK = import_node_buffer2.Buffer.from("0\r\n\r\n");
  let isChunkedTransfer = false;
  let properLastChunkReceived = false;
  let previousChunk;
  request.on("response", (response) => {
    const { headers } = response;
    isChunkedTransfer = headers["transfer-encoding"] === "chunked" && !headers["content-length"];
  });
  request.on("socket", (socket) => {
    const onSocketClose = () => {
      if (isChunkedTransfer && !properLastChunkReceived) {
        const error = new Error("Premature close");
        error.code = "ERR_STREAM_PREMATURE_CLOSE";
        errorCallback(error);
      }
    };
    const onData = (buf) => {
      properLastChunkReceived = import_node_buffer2.Buffer.compare(buf.slice(-5), LAST_CHUNK) === 0;
      if (!properLastChunkReceived && previousChunk) {
        properLastChunkReceived = import_node_buffer2.Buffer.compare(previousChunk.slice(-3), LAST_CHUNK.slice(0, 3)) === 0 && import_node_buffer2.Buffer.compare(buf.slice(-2), LAST_CHUNK.slice(3)) === 0;
      }
      previousChunk = buf;
    };
    socket.prependListener("close", onSocketClose);
    socket.on("data", onData);
    request.on("close", () => {
      socket.removeListener("close", onSocketClose);
      socket.removeListener("data", onData);
    });
  });
}

// src/control.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function Command() {
  const [state, setState] = (0, import_react.useState)(null);
  const [isLoading, setIsLoading] = (0, import_react.useState)(true);
  const [error, setError] = (0, import_react.useState)(null);
  async function refresh() {
    try {
      const res = await fetch("http://127.0.0.1:3030/status");
      const data = await res.json();
      setState(data);
      setError(null);
    } catch (e2) {
      setError("Hub Offline");
    } finally {
      setIsLoading(false);
    }
  }
  (0, import_react.useEffect)(() => {
    refresh();
    const timer = setInterval(refresh, 1e4);
    return () => clearInterval(timer);
  }, []);
  async function runAction(name, endpoint) {
    (0, import_api.showToast)({ style: import_api.Toast.Style.Animated, title: `Pulsing: ${name}...` });
    try {
      const res = await fetch(`http://127.0.0.1:3030${endpoint}`);
      if (!res.ok) throw new Error("Failed");
      (0, import_api.showToast)({ style: import_api.Toast.Style.Success, title: `Confirmed: ${name}` });
      setTimeout(refresh, 500);
    } catch (e2) {
      (0, import_api.showToast)({ style: import_api.Toast.Style.Failure, title: "Action Failed", message: "Hub Offline" });
    }
  }
  const acStatus = (state?.stats?.ac?.status || "off").toUpperCase();
  const ltStatus = (state?.stats?.light?.status || "off").toUpperCase();
  const acColor = acStatus === "ON" ? import_api.Color.Green : import_api.Color.Red;
  const ltColor = ltStatus === "ON" ? import_api.Color.Green : import_api.Color.Red;
  const getUptimeStr = (secs) => {
    const h2 = Math.floor(secs / 3600);
    const m2 = Math.floor(secs % 3600 / 60);
    return `${h2}h ${m2}m`;
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_api.List, { isLoading, searchBarPlaceholder: "Precision Control Center...", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_api.List.Section, { title: "Gravity Scenes (Intents)", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_api.List.Item,
        {
          icon: import_api.Icon.Video,
          title: "TV TIME",
          subtitle: "Dim Purple & AC Cool",
          actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.ActionPanel, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.Action, { title: "Activate", icon: import_api.Icon.Video, onAction: () => runAction("TV", "/scene/tv") }) })
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_api.List.Item,
        {
          icon: import_api.Icon.ComputerSpeaker,
          title: "WORK MODE",
          subtitle: "Bright White & AC Fan",
          actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.ActionPanel, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.Action, { title: "Activate", icon: import_api.Icon.ComputerSpeaker, onAction: () => runAction("Work", "/scene/work") }) })
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_api.List.Item,
        {
          icon: import_api.Icon.House,
          title: "BACK HOME",
          subtitle: "Warm Welcome",
          actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.ActionPanel, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.Action, { title: "Activate", icon: import_api.Icon.House, onAction: () => runAction("HOME", "/scene/home") }) })
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_api.List.Section, { title: "Precision Hardware Control", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_api.List.Item,
        {
          icon: import_api.Icon.Wind,
          title: "Panasonic AC Controller",
          subtitle: acStatus === "ON" ? `Running for ${state?.ac_duration || "0m"}` : "Standby",
          accessories: [{ text: acStatus, color: acColor }],
          actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_api.ActionPanel, { title: "AC Precision Pulse", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.Action, { icon: import_api.Icon.ChevronDown, title: "Temperature DOWN", onAction: () => runAction("Temp Down", "/control/temp?dir=down") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.Action, { icon: import_api.Icon.ChevronUp, title: "Temperature UP", shortcut: { modifiers: ["cmd"], key: "enter" }, onAction: () => runAction("Temp Up", "/control/temp?dir=up") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_api.ActionPanel.Section, { title: "Climate Precision", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.Action, { icon: import_api.Icon.Video, title: "TV Mode (Cool & Quiet)", onAction: () => runAction("TV AC", "/control/ac_tv") }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.Action, { icon: import_api.Icon.Power, title: "Toggle Power", shortcut: { modifiers: ["cmd"], key: "t" }, onAction: () => runAction("AC", acStatus === "ON" ? "/control/ac/off" : "/control/ac/on") }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.Action, { icon: import_api.Icon.Snowflake, title: "Cool Mode", onAction: () => runAction("Cool", "/control/ac/mode?mode=cool") }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.Action, { icon: import_api.Icon.Repeat, title: "Vertical Swing", onAction: () => runAction("Swing", "/control/ac/swing") }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.Action, { icon: import_api.Icon.Bolt, title: "Powerful Mode", onAction: () => runAction("Powerful", "/control/ac/powerful?ps=on") })
            ] })
          ] })
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_api.List.Item,
        {
          icon: import_api.Icon.Sun,
          title: "Wiz Lighting Hub",
          subtitle: ltStatus === "ON" ? `Running for ${state?.light_duration || "1h 32m"}` : "Standby",
          accessories: [{ text: ltStatus, color: ltColor }],
          actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_api.ActionPanel, { title: "Light Tactical Pulse", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.Action, { icon: import_api.Icon.Minus, title: "Brightness DOWN", onAction: () => runAction("Bright Down", "/control/brightness?dir=down") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.Action, { icon: import_api.Icon.Plus, title: "Brightness UP", shortcut: { modifiers: ["cmd"], key: "enter" }, onAction: () => runAction("Bright Up", "/control/brightness?dir=up") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_api.ActionPanel.Section, { title: "Atmospheric Controls", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.Action, { icon: import_api.Icon.Video, title: "TV Mode (Dim to 10%)", onAction: () => runAction("TV Lights", "/control/bulb_tv") }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.Action, { icon: import_api.Icon.Power, title: "Toggle Power", shortcut: { modifiers: ["cmd"], key: "l" }, onAction: () => runAction("Lights", ltStatus === "ON" ? "/control/bulb_off" : "/control/bulb_on") }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.Action, { icon: import_api.Icon.Star, title: "Aura Sync (Media)", onAction: () => runAction("Aura", "/control/aura/toggle") }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.Action, { icon: import_api.Icon.Circle, title: "Warm White", onAction: () => runAction("Warm", "/control/bulb/color?temp=2700") })
            ] })
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_api.List.Section, { title: "Sovereignty Dashboard", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_api.List.Item,
        {
          icon: import_api.Icon.Bolt,
          title: "PGVCL Energy Pulse",
          subtitle: `Actual: \u20B9${state?.pgvcl?.bill || "--"} (${state?.pgvcl?.units || "--"}U) | Today: \u20B9${state?.estimatedPgBill || "0"} (${state?.units || "0"}U)`,
          accessories: [{ text: "\u26A1 BILLING ACTIVE" }],
          actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.ActionPanel, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.Action, { icon: import_api.Icon.Cloud, title: "Sync Vault", onAction: () => runAction("Vault Sync", "/archive/sync") }) })
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_api.List.Item,
        {
          icon: import_api.Icon.Tray,
          title: "Archive Intelligence",
          subtitle: `Vault Velocity: HIGH | ${state?.stats?.archiveCount || "41K+"} fragments`,
          accessories: [{ text: error ? "HUB OFFLINE" : "\u{1F575}\uFE0F HOARDING ACTIVE", color: error ? import_api.Color.Red : void 0 }],
          actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.ActionPanel, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.Action, { icon: import_api.Icon.Repeat, title: "Restart All Backend Services", onAction: () => runAction("HUB RESET", "/control/restart") }) })
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_api.List.Item,
        {
          icon: import_api.Icon.Sun,
          title: "SolisCloud Solar Intel",
          subtitle: `${state?.solis?.today || "--"} kWh Today | ${state?.solis?.current || "--"} kW Now`,
          accessories: [{ text: state?.solis?.status || "OPTIMAL" }],
          actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.ActionPanel, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.Action.Push, { icon: import_api.Icon.QuestionMark, title: "How to Setup SolisCloud", target: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SolisSetupGuide, {}) }) })
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_api.List.Item,
        {
          icon: import_api.Icon.Cloud,
          title: "Atmospheric Context",
          subtitle: `${state?.weather?.temp || "??"}\xB0C | AQI: ${state?.weather?.aqi || "??"}`,
          accessories: [{ text: `\u{1F307} ${state?.weather?.sunset || "--"} | \u{1F305} ${state?.weather?.sunrise || "--"}` }]
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.List.Section, { title: "System Telemetry", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_api.List.Item,
      {
        icon: import_api.Icon.Heartbeat,
        title: "Sovereign Pulse",
        subtitle: `Hub: ${getUptimeStr(state?.uptime || 0)} | Archive: ONLINE`,
        accessories: [{ text: error ? "OFFLINE" : "HEALTHY", color: error ? import_api.Color.Red : import_api.Color.Green }],
        actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.ActionPanel, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.Action, { icon: import_api.Icon.Repeat, title: "Re-Pulse All Services", onAction: () => runAction("REBUILD", "/control/restart") }) })
      }
    ) })
  ] });
}
function SolisSetupGuide() {
  const guide = `
# SolisCloud API Activation Guide \u2600\uFE0F\u{1F4E8}

Looking at your dashboard, it seems the **API Management** menu is currently hidden. This is common for personal accounts and requires a one-time activation from their side.

### \u{1F6D1} **Step 1: Apply for Access** (Mandatory)
According to Solis documentation, you must first contact their technical support to "Verify and Activate" API access for your account:
- **Email**: \`ussupport@solisinv.com\` (or your regional Solis support).
- **Subject**: Request for API Access Activation - Praduman Khachar
- **Content**: "Please activate the API Management portal for my account (\`pkhachar@gmail.com\`) to allow integration with my personal dashboard."

### \u{1F527} **Step 2: Activation (Once Unlocked)**
Once they reply, you will see a new **API Management** option under the **Service** tab:
1.  Go to **Service** -> **API Management**.
2.  Click **Activate Now**.
3.  Complete the Email Verification (Puzzle + Code).
4.  Copy your **KeyId** and **SecretKey**.

### \u{1F9EC} **Plant Details**
- **Plant ID**: \`1298491919450000328\`
- **Current Flow**: Currently syncing via **Session Pulse** (18.7 kWh) until your persistent keys are live.

Restart the Hub once you have the keys!
  `;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.Detail, { markdown: guide });
}
/*! Bundled license information:

web-streams-polyfill/dist/ponyfill.es2018.js:
  (**
   * @license
   * web-streams-polyfill v3.3.3
   * Copyright 2024 Mattias Buelens, Diwank Singh Tomer and other contributors.
   * This code is released under the MIT license.
   * SPDX-License-Identifier: MIT
   *)

fetch-blob/index.js:
  (*! fetch-blob. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> *)

formdata-polyfill/esm.min.js:
  (*! formdata-polyfill. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> *)

node-domexception/index.js:
  (*! node-domexception. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> *)
*/
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL2lmdHQvcmF5Y2FzdC1leHQvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy91dGlscy50cyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvaWZ0dC9yYXljYXN0LWV4dC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi9oZWxwZXJzL21pc2NlbGxhbmVvdXMudHMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL2lmdHQvcmF5Y2FzdC1leHQvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvaGVscGVycy93ZWJpZGwudHMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL2lmdHQvcmF5Y2FzdC1leHQvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvc2ltcGxlLXF1ZXVlLnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvbGliL2Fic3RyYWN0LW9wcy9pbnRlcm5hbC1tZXRob2RzLnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvbGliL3JlYWRhYmxlLXN0cmVhbS9nZW5lcmljLXJlYWRlci50cyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvaWZ0dC9yYXljYXN0LWV4dC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL3N0dWIvbnVtYmVyLWlzZmluaXRlLnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvc3R1Yi9tYXRoLXRydW5jLnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvbGliL3ZhbGlkYXRvcnMvYmFzaWMudHMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL2lmdHQvcmF5Y2FzdC1leHQvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvdmFsaWRhdG9ycy9yZWFkYWJsZS1zdHJlYW0udHMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL2lmdHQvcmF5Y2FzdC1leHQvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvcmVhZGFibGUtc3RyZWFtL2RlZmF1bHQtcmVhZGVyLnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvdGFyZ2V0L2VzMjAxOC9zdHViL2FzeW5jLWl0ZXJhdG9yLXByb3RvdHlwZS50cyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvaWZ0dC9yYXljYXN0LWV4dC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi9yZWFkYWJsZS1zdHJlYW0vYXN5bmMtaXRlcmF0b3IudHMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL2lmdHQvcmF5Y2FzdC1leHQvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9zdHViL251bWJlci1pc25hbi50cyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvaWZ0dC9yYXljYXN0LWV4dC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi9hYnN0cmFjdC1vcHMvZWNtYXNjcmlwdC50cyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvaWZ0dC9yYXljYXN0LWV4dC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi9hYnN0cmFjdC1vcHMvbWlzY2VsbGFuZW91cy50cyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvaWZ0dC9yYXljYXN0LWV4dC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi9hYnN0cmFjdC1vcHMvcXVldWUtd2l0aC1zaXplcy50cyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvaWZ0dC9yYXljYXN0LWV4dC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi9oZWxwZXJzL2FycmF5LWJ1ZmZlci12aWV3LnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvbGliL3JlYWRhYmxlLXN0cmVhbS9ieXRlLXN0cmVhbS1jb250cm9sbGVyLnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvbGliL3ZhbGlkYXRvcnMvcmVhZGVyLW9wdGlvbnMudHMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL2lmdHQvcmF5Y2FzdC1leHQvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvcmVhZGFibGUtc3RyZWFtL2J5b2ItcmVhZGVyLnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvbGliL2Fic3RyYWN0LW9wcy9xdWV1aW5nLXN0cmF0ZWd5LnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvbGliL3ZhbGlkYXRvcnMvcXVldWluZy1zdHJhdGVneS50cyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvaWZ0dC9yYXljYXN0LWV4dC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi92YWxpZGF0b3JzL3VuZGVybHlpbmctc2luay50cyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvaWZ0dC9yYXljYXN0LWV4dC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi92YWxpZGF0b3JzL3dyaXRhYmxlLXN0cmVhbS50cyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvaWZ0dC9yYXljYXN0LWV4dC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi9hYm9ydC1zaWduYWwudHMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL2lmdHQvcmF5Y2FzdC1leHQvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvd3JpdGFibGUtc3RyZWFtLnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvZ2xvYmFscy50cyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvaWZ0dC9yYXljYXN0LWV4dC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL3N0dWIvZG9tLWV4Y2VwdGlvbi50cyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvaWZ0dC9yYXljYXN0LWV4dC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi9yZWFkYWJsZS1zdHJlYW0vcGlwZS50cyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvaWZ0dC9yYXljYXN0LWV4dC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi9yZWFkYWJsZS1zdHJlYW0vZGVmYXVsdC1jb250cm9sbGVyLnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvbGliL3JlYWRhYmxlLXN0cmVhbS90ZWUudHMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL2lmdHQvcmF5Y2FzdC1leHQvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvcmVhZGFibGUtc3RyZWFtL3JlYWRhYmxlLXN0cmVhbS1saWtlLnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvbGliL3JlYWRhYmxlLXN0cmVhbS9mcm9tLnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvbGliL3ZhbGlkYXRvcnMvdW5kZXJseWluZy1zb3VyY2UudHMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL2lmdHQvcmF5Y2FzdC1leHQvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvdmFsaWRhdG9ycy9pdGVyYXRvci1vcHRpb25zLnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvbGliL3ZhbGlkYXRvcnMvcGlwZS1vcHRpb25zLnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvbGliL3ZhbGlkYXRvcnMvcmVhZGFibGUtd3JpdGFibGUtcGFpci50cyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvaWZ0dC9yYXljYXN0LWV4dC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi9yZWFkYWJsZS1zdHJlYW0udHMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL2lmdHQvcmF5Y2FzdC1leHQvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvdmFsaWRhdG9ycy9xdWV1aW5nLXN0cmF0ZWd5LWluaXQudHMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL2lmdHQvcmF5Y2FzdC1leHQvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvYnl0ZS1sZW5ndGgtcXVldWluZy1zdHJhdGVneS50cyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvaWZ0dC9yYXljYXN0LWV4dC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi9jb3VudC1xdWV1aW5nLXN0cmF0ZWd5LnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvbGliL3ZhbGlkYXRvcnMvdHJhbnNmb3JtZXIudHMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL2lmdHQvcmF5Y2FzdC1leHQvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvdHJhbnNmb3JtLXN0cmVhbS50cyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvaWZ0dC9yYXljYXN0LWV4dC9ub2RlX21vZHVsZXMvZmV0Y2gtYmxvYi9zdHJlYW1zLmNqcyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvaWZ0dC9yYXljYXN0LWV4dC9ub2RlX21vZHVsZXMvZmV0Y2gtYmxvYi9pbmRleC5qcyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvaWZ0dC9yYXljYXN0LWV4dC9ub2RlX21vZHVsZXMvZmV0Y2gtYmxvYi9maWxlLmpzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy9mb3JtZGF0YS1wb2x5ZmlsbC9lc20ubWluLmpzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy9ub2RlLWRvbWV4Y2VwdGlvbi9pbmRleC5qcyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvaWZ0dC9yYXljYXN0LWV4dC9ub2RlX21vZHVsZXMvZmV0Y2gtYmxvYi9mcm9tLmpzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy9ub2RlLWZldGNoL3NyYy91dGlscy9tdWx0aXBhcnQtcGFyc2VyLmpzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L3NyYy9jb250cm9sLnRzeCIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvaWZ0dC9yYXljYXN0LWV4dC9ub2RlX21vZHVsZXMvbm9kZS1mZXRjaC9zcmMvaW5kZXguanMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL2lmdHQvcmF5Y2FzdC1leHQvbm9kZV9tb2R1bGVzL2RhdGEtdXJpLXRvLWJ1ZmZlci9zcmMvaW5kZXgudHMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL2lmdHQvcmF5Y2FzdC1leHQvbm9kZV9tb2R1bGVzL25vZGUtZmV0Y2gvc3JjL2JvZHkuanMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL2lmdHQvcmF5Y2FzdC1leHQvbm9kZV9tb2R1bGVzL25vZGUtZmV0Y2gvc3JjL2Vycm9ycy9iYXNlLmpzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy9ub2RlLWZldGNoL3NyYy9lcnJvcnMvZmV0Y2gtZXJyb3IuanMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL2lmdHQvcmF5Y2FzdC1leHQvbm9kZV9tb2R1bGVzL25vZGUtZmV0Y2gvc3JjL3V0aWxzL2lzLmpzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy9ub2RlLWZldGNoL3NyYy9oZWFkZXJzLmpzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy9ub2RlLWZldGNoL3NyYy91dGlscy9pcy1yZWRpcmVjdC5qcyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvaWZ0dC9yYXljYXN0LWV4dC9ub2RlX21vZHVsZXMvbm9kZS1mZXRjaC9zcmMvcmVzcG9uc2UuanMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL2lmdHQvcmF5Y2FzdC1leHQvbm9kZV9tb2R1bGVzL25vZGUtZmV0Y2gvc3JjL3JlcXVlc3QuanMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL2lmdHQvcmF5Y2FzdC1leHQvbm9kZV9tb2R1bGVzL25vZGUtZmV0Y2gvc3JjL3V0aWxzL2dldC1zZWFyY2guanMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL2lmdHQvcmF5Y2FzdC1leHQvbm9kZV9tb2R1bGVzL25vZGUtZmV0Y2gvc3JjL3V0aWxzL3JlZmVycmVyLmpzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy9ub2RlLWZldGNoL3NyYy9lcnJvcnMvYWJvcnQtZXJyb3IuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImV4cG9ydCBmdW5jdGlvbiBub29wKCk6IHVuZGVmaW5lZCB7XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG4iLCAiaW1wb3J0IHsgbm9vcCB9IGZyb20gJy4uLy4uL3V0aWxzJztcbmltcG9ydCB7IEFzc2VydGlvbkVycm9yIH0gZnJvbSAnLi4vLi4vc3R1Yi9hc3NlcnQnO1xuXG5leHBvcnQgZnVuY3Rpb24gdHlwZUlzT2JqZWN0KHg6IGFueSk6IHggaXMgb2JqZWN0IHtcbiAgcmV0dXJuICh0eXBlb2YgeCA9PT0gJ29iamVjdCcgJiYgeCAhPT0gbnVsbCkgfHwgdHlwZW9mIHggPT09ICdmdW5jdGlvbic7XG59XG5cbmV4cG9ydCBjb25zdCByZXRocm93QXNzZXJ0aW9uRXJyb3JSZWplY3Rpb246IChlOiBhbnkpID0+IHZvaWQgPVxuICBERUJVRyA/IGUgPT4ge1xuICAgIC8vIFVzZWQgdGhyb3VnaG91dCB0aGUgcmVmZXJlbmNlIGltcGxlbWVudGF0aW9uLCBhcyBgLmNhdGNoKHJldGhyb3dBc3NlcnRpb25FcnJvclJlamVjdGlvbilgLCB0byBlbnN1cmUgYW55IGVycm9yc1xuICAgIC8vIGdldCBzaG93bi4gVGhlcmUgYXJlIHBsYWNlcyBpbiB0aGUgc3BlYyB3aGVyZSB3ZSBkbyBwcm9taXNlIHRyYW5zZm9ybWF0aW9ucyBhbmQgcHVycG9zZWZ1bGx5IGlnbm9yZSBvciBkb24ndFxuICAgIC8vIGV4cGVjdCBhbnkgZXJyb3JzLCBidXQgYXNzZXJ0aW9uIGVycm9ycyBhcmUgYWx3YXlzIHByb2JsZW1hdGljLlxuICAgIGlmIChlICYmIGUgaW5zdGFuY2VvZiBBc3NlcnRpb25FcnJvcikge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9LCAwKTtcbiAgICB9XG4gIH0gOiBub29wO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0RnVuY3Rpb25OYW1lKGZuOiBGdW5jdGlvbiwgbmFtZTogc3RyaW5nKTogdm9pZCB7XG4gIHRyeSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGZuLCAnbmFtZScsIHtcbiAgICAgIHZhbHVlOiBuYW1lLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gIH0gY2F0Y2gge1xuICAgIC8vIFRoaXMgcHJvcGVydHkgaXMgbm9uLWNvbmZpZ3VyYWJsZSBpbiBvbGRlciBicm93c2Vycywgc28gaWdub3JlIGlmIHRoaXMgdGhyb3dzLlxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0Z1bmN0aW9uL25hbWUjYnJvd3Nlcl9jb21wYXRpYmlsaXR5XG4gIH1cbn1cbiIsICJpbXBvcnQgeyByZXRocm93QXNzZXJ0aW9uRXJyb3JSZWplY3Rpb24gfSBmcm9tICcuL21pc2NlbGxhbmVvdXMnO1xuaW1wb3J0IGFzc2VydCBmcm9tICcuLi8uLi9zdHViL2Fzc2VydCc7XG5cbmNvbnN0IG9yaWdpbmFsUHJvbWlzZSA9IFByb21pc2U7XG5jb25zdCBvcmlnaW5hbFByb21pc2VUaGVuID0gUHJvbWlzZS5wcm90b3R5cGUudGhlbjtcbmNvbnN0IG9yaWdpbmFsUHJvbWlzZVJlamVjdCA9IFByb21pc2UucmVqZWN0LmJpbmQob3JpZ2luYWxQcm9taXNlKTtcblxuLy8gaHR0cHM6Ly93ZWJpZGwuc3BlYy53aGF0d2cub3JnLyNhLW5ldy1wcm9taXNlXG5leHBvcnQgZnVuY3Rpb24gbmV3UHJvbWlzZTxUPihleGVjdXRvcjogKFxuICByZXNvbHZlOiAodmFsdWU6IFQgfCBQcm9taXNlTGlrZTxUPikgPT4gdm9pZCxcbiAgcmVqZWN0OiAocmVhc29uPzogYW55KSA9PiB2b2lkXG4pID0+IHZvaWQpOiBQcm9taXNlPFQ+IHtcbiAgcmV0dXJuIG5ldyBvcmlnaW5hbFByb21pc2UoZXhlY3V0b3IpO1xufVxuXG4vLyBodHRwczovL3dlYmlkbC5zcGVjLndoYXR3Zy5vcmcvI2EtcHJvbWlzZS1yZXNvbHZlZC13aXRoXG5leHBvcnQgZnVuY3Rpb24gcHJvbWlzZVJlc29sdmVkV2l0aDxUPih2YWx1ZTogVCB8IFByb21pc2VMaWtlPFQ+KTogUHJvbWlzZTxUPiB7XG4gIHJldHVybiBuZXdQcm9taXNlKHJlc29sdmUgPT4gcmVzb2x2ZSh2YWx1ZSkpO1xufVxuXG4vLyBodHRwczovL3dlYmlkbC5zcGVjLndoYXR3Zy5vcmcvI2EtcHJvbWlzZS1yZWplY3RlZC13aXRoXG5leHBvcnQgZnVuY3Rpb24gcHJvbWlzZVJlamVjdGVkV2l0aDxUID0gbmV2ZXI+KHJlYXNvbjogYW55KTogUHJvbWlzZTxUPiB7XG4gIHJldHVybiBvcmlnaW5hbFByb21pc2VSZWplY3QocmVhc29uKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFBlcmZvcm1Qcm9taXNlVGhlbjxULCBUUmVzdWx0MSA9IFQsIFRSZXN1bHQyID0gbmV2ZXI+KFxuICBwcm9taXNlOiBQcm9taXNlPFQ+LFxuICBvbkZ1bGZpbGxlZD86ICh2YWx1ZTogVCkgPT4gVFJlc3VsdDEgfCBQcm9taXNlTGlrZTxUUmVzdWx0MT4sXG4gIG9uUmVqZWN0ZWQ/OiAocmVhc29uOiBhbnkpID0+IFRSZXN1bHQyIHwgUHJvbWlzZUxpa2U8VFJlc3VsdDI+KTogUHJvbWlzZTxUUmVzdWx0MSB8IFRSZXN1bHQyPiB7XG4gIC8vIFRoZXJlIGRvZXNuJ3QgYXBwZWFyIHRvIGJlIGFueSB3YXkgdG8gY29ycmVjdGx5IGVtdWxhdGUgdGhlIGJlaGF2aW91ciBmcm9tIEphdmFTY3JpcHQsIHNvIHRoaXMgaXMganVzdCBhblxuICAvLyBhcHByb3hpbWF0aW9uLlxuICByZXR1cm4gb3JpZ2luYWxQcm9taXNlVGhlbi5jYWxsKHByb21pc2UsIG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKSBhcyBQcm9taXNlPFRSZXN1bHQxIHwgVFJlc3VsdDI+O1xufVxuXG4vLyBCbHVlYmlyZCBsb2dzIGEgd2FybmluZyB3aGVuIGEgcHJvbWlzZSBpcyBjcmVhdGVkIHdpdGhpbiBhIGZ1bGZpbGxtZW50IGhhbmRsZXIsIGJ1dCB0aGVuIGlzbid0IHJldHVybmVkXG4vLyBmcm9tIHRoYXQgaGFuZGxlci4gVG8gcHJldmVudCB0aGlzLCByZXR1cm4gbnVsbCBpbnN0ZWFkIG9mIHZvaWQgZnJvbSBhbGwgaGFuZGxlcnMuXG4vLyBodHRwOi8vYmx1ZWJpcmRqcy5jb20vZG9jcy93YXJuaW5nLWV4cGxhbmF0aW9ucy5odG1sI3dhcm5pbmctYS1wcm9taXNlLXdhcy1jcmVhdGVkLWluLWEtaGFuZGxlci1idXQtd2FzLW5vdC1yZXR1cm5lZC1mcm9tLWl0XG5leHBvcnQgZnVuY3Rpb24gdXBvblByb21pc2U8VD4oXG4gIHByb21pc2U6IFByb21pc2U8VD4sXG4gIG9uRnVsZmlsbGVkPzogKHZhbHVlOiBUKSA9PiBudWxsIHwgUHJvbWlzZUxpa2U8bnVsbD4sXG4gIG9uUmVqZWN0ZWQ/OiAocmVhc29uOiBhbnkpID0+IG51bGwgfCBQcm9taXNlTGlrZTxudWxsPik6IHZvaWQge1xuICBQZXJmb3JtUHJvbWlzZVRoZW4oXG4gICAgUGVyZm9ybVByb21pc2VUaGVuKHByb21pc2UsIG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKSxcbiAgICB1bmRlZmluZWQsXG4gICAgcmV0aHJvd0Fzc2VydGlvbkVycm9yUmVqZWN0aW9uXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cG9uRnVsZmlsbG1lbnQ8VD4ocHJvbWlzZTogUHJvbWlzZTxUPiwgb25GdWxmaWxsZWQ6ICh2YWx1ZTogVCkgPT4gbnVsbCB8IFByb21pc2VMaWtlPG51bGw+KTogdm9pZCB7XG4gIHVwb25Qcm9taXNlKHByb21pc2UsIG9uRnVsZmlsbGVkKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwb25SZWplY3Rpb24ocHJvbWlzZTogUHJvbWlzZTx1bmtub3duPiwgb25SZWplY3RlZDogKHJlYXNvbjogYW55KSA9PiBudWxsIHwgUHJvbWlzZUxpa2U8bnVsbD4pOiB2b2lkIHtcbiAgdXBvblByb21pc2UocHJvbWlzZSwgdW5kZWZpbmVkLCBvblJlamVjdGVkKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zZm9ybVByb21pc2VXaXRoPFQsIFRSZXN1bHQxID0gVCwgVFJlc3VsdDIgPSBuZXZlcj4oXG4gIHByb21pc2U6IFByb21pc2U8VD4sXG4gIGZ1bGZpbGxtZW50SGFuZGxlcj86ICh2YWx1ZTogVCkgPT4gVFJlc3VsdDEgfCBQcm9taXNlTGlrZTxUUmVzdWx0MT4sXG4gIHJlamVjdGlvbkhhbmRsZXI/OiAocmVhc29uOiBhbnkpID0+IFRSZXN1bHQyIHwgUHJvbWlzZUxpa2U8VFJlc3VsdDI+KTogUHJvbWlzZTxUUmVzdWx0MSB8IFRSZXN1bHQyPiB7XG4gIHJldHVybiBQZXJmb3JtUHJvbWlzZVRoZW4ocHJvbWlzZSwgZnVsZmlsbG1lbnRIYW5kbGVyLCByZWplY3Rpb25IYW5kbGVyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldFByb21pc2VJc0hhbmRsZWRUb1RydWUocHJvbWlzZTogUHJvbWlzZTx1bmtub3duPik6IHZvaWQge1xuICBQZXJmb3JtUHJvbWlzZVRoZW4ocHJvbWlzZSwgdW5kZWZpbmVkLCByZXRocm93QXNzZXJ0aW9uRXJyb3JSZWplY3Rpb24pO1xufVxuXG5sZXQgX3F1ZXVlTWljcm90YXNrOiAoY2FsbGJhY2s6ICgpID0+IHZvaWQpID0+IHZvaWQgPSBjYWxsYmFjayA9PiB7XG4gIGlmICh0eXBlb2YgcXVldWVNaWNyb3Rhc2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICBfcXVldWVNaWNyb3Rhc2sgPSBxdWV1ZU1pY3JvdGFzaztcbiAgfSBlbHNlIHtcbiAgICBjb25zdCByZXNvbHZlZFByb21pc2UgPSBwcm9taXNlUmVzb2x2ZWRXaXRoKHVuZGVmaW5lZCk7XG4gICAgX3F1ZXVlTWljcm90YXNrID0gY2IgPT4gUGVyZm9ybVByb21pc2VUaGVuKHJlc29sdmVkUHJvbWlzZSwgY2IpO1xuICB9XG4gIHJldHVybiBfcXVldWVNaWNyb3Rhc2soY2FsbGJhY2spO1xufTtcblxuZXhwb3J0IHsgX3F1ZXVlTWljcm90YXNrIGFzIHF1ZXVlTWljcm90YXNrIH07XG5cbmV4cG9ydCBmdW5jdGlvbiByZWZsZWN0Q2FsbDxULCBBIGV4dGVuZHMgYW55W10sIFI+KEY6ICh0aGlzOiBULCAuLi5mbkFyZ3M6IEEpID0+IFIsIFY6IFQsIGFyZ3M6IEEpOiBSIHtcbiAgaWYgKHR5cGVvZiBGICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgaXMgbm90IGEgZnVuY3Rpb24nKTtcbiAgfVxuICByZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmNhbGwoRiwgViwgYXJncyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9taXNlQ2FsbDxULCBBIGV4dGVuZHMgYW55W10sIFI+KEY6ICh0aGlzOiBULCAuLi5mbkFyZ3M6IEEpID0+IFIgfCBQcm9taXNlTGlrZTxSPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFY6IFQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmdzOiBBKTogUHJvbWlzZTxSPiB7XG4gIGFzc2VydCh0eXBlb2YgRiA9PT0gJ2Z1bmN0aW9uJyk7XG4gIGFzc2VydChWICE9PSB1bmRlZmluZWQpO1xuICBhc3NlcnQoQXJyYXkuaXNBcnJheShhcmdzKSk7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHByb21pc2VSZXNvbHZlZFdpdGgocmVmbGVjdENhbGwoRiwgViwgYXJncykpO1xuICB9IGNhdGNoICh2YWx1ZSkge1xuICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKHZhbHVlKTtcbiAgfVxufVxuIiwgImltcG9ydCBhc3NlcnQgZnJvbSAnLi4vc3R1Yi9hc3NlcnQnO1xuXG4vLyBPcmlnaW5hbCBmcm9tIENocm9taXVtXG4vLyBodHRwczovL2Nocm9taXVtLmdvb2dsZXNvdXJjZS5jb20vY2hyb21pdW0vc3JjLysvMGFlZTQ0MzRhNGRiYTQyYTQyYWJhZWE5YmZiYzBjZDE5NmE2M2JjMS90aGlyZF9wYXJ0eS9ibGluay9yZW5kZXJlci9jb3JlL3N0cmVhbXMvU2ltcGxlUXVldWUuanNcblxuY29uc3QgUVVFVUVfTUFYX0FSUkFZX1NJWkUgPSAxNjM4NDtcblxuaW50ZXJmYWNlIE5vZGU8VD4ge1xuICBfZWxlbWVudHM6IFRbXTtcbiAgX25leHQ6IE5vZGU8VD4gfCB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogU2ltcGxlIHF1ZXVlIHN0cnVjdHVyZS5cbiAqXG4gKiBBdm9pZHMgc2NhbGFiaWxpdHkgaXNzdWVzIHdpdGggdXNpbmcgYSBwYWNrZWQgYXJyYXkgZGlyZWN0bHkgYnkgdXNpbmdcbiAqIG11bHRpcGxlIGFycmF5cyBpbiBhIGxpbmtlZCBsaXN0IGFuZCBrZWVwaW5nIHRoZSBhcnJheSBzaXplIGJvdW5kZWQuXG4gKi9cbmV4cG9ydCBjbGFzcyBTaW1wbGVRdWV1ZTxUPiB7XG4gIHByaXZhdGUgX2Zyb250OiBOb2RlPFQ+O1xuICBwcml2YXRlIF9iYWNrOiBOb2RlPFQ+O1xuICBwcml2YXRlIF9jdXJzb3IgPSAwO1xuICBwcml2YXRlIF9zaXplID0gMDtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICAvLyBfZnJvbnQgYW5kIF9iYWNrIGFyZSBhbHdheXMgZGVmaW5lZC5cbiAgICB0aGlzLl9mcm9udCA9IHtcbiAgICAgIF9lbGVtZW50czogW10sXG4gICAgICBfbmV4dDogdW5kZWZpbmVkXG4gICAgfTtcbiAgICB0aGlzLl9iYWNrID0gdGhpcy5fZnJvbnQ7XG4gICAgLy8gVGhlIGN1cnNvciBpcyB1c2VkIHRvIGF2b2lkIGNhbGxpbmcgQXJyYXkuc2hpZnQoKS5cbiAgICAvLyBJdCBjb250YWlucyB0aGUgaW5kZXggb2YgdGhlIGZyb250IGVsZW1lbnQgb2YgdGhlIGFycmF5IGluc2lkZSB0aGVcbiAgICAvLyBmcm9udC1tb3N0IG5vZGUuIEl0IGlzIGFsd2F5cyBpbiB0aGUgcmFuZ2UgWzAsIFFVRVVFX01BWF9BUlJBWV9TSVpFKS5cbiAgICB0aGlzLl9jdXJzb3IgPSAwO1xuICAgIC8vIFdoZW4gdGhlcmUgaXMgb25seSBvbmUgbm9kZSwgc2l6ZSA9PT0gZWxlbWVudHMubGVuZ3RoIC0gY3Vyc29yLlxuICAgIHRoaXMuX3NpemUgPSAwO1xuICB9XG5cbiAgZ2V0IGxlbmd0aCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9zaXplO1xuICB9XG5cbiAgLy8gRm9yIGV4Y2VwdGlvbiBzYWZldHksIHRoaXMgbWV0aG9kIGlzIHN0cnVjdHVyZWQgaW4gb3JkZXI6XG4gIC8vIDEuIFJlYWQgc3RhdGVcbiAgLy8gMi4gQ2FsY3VsYXRlIHJlcXVpcmVkIHN0YXRlIG11dGF0aW9uc1xuICAvLyAzLiBQZXJmb3JtIHN0YXRlIG11dGF0aW9uc1xuICBwdXNoKGVsZW1lbnQ6IFQpOiB2b2lkIHtcbiAgICBjb25zdCBvbGRCYWNrID0gdGhpcy5fYmFjaztcbiAgICBsZXQgbmV3QmFjayA9IG9sZEJhY2s7XG4gICAgYXNzZXJ0KG9sZEJhY2suX25leHQgPT09IHVuZGVmaW5lZCk7XG4gICAgaWYgKG9sZEJhY2suX2VsZW1lbnRzLmxlbmd0aCA9PT0gUVVFVUVfTUFYX0FSUkFZX1NJWkUgLSAxKSB7XG4gICAgICBuZXdCYWNrID0ge1xuICAgICAgICBfZWxlbWVudHM6IFtdLFxuICAgICAgICBfbmV4dDogdW5kZWZpbmVkXG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vIHB1c2goKSBpcyB0aGUgbXV0YXRpb24gbW9zdCBsaWtlbHkgdG8gdGhyb3cgYW4gZXhjZXB0aW9uLCBzbyBpdFxuICAgIC8vIGdvZXMgZmlyc3QuXG4gICAgb2xkQmFjay5fZWxlbWVudHMucHVzaChlbGVtZW50KTtcbiAgICBpZiAobmV3QmFjayAhPT0gb2xkQmFjaykge1xuICAgICAgdGhpcy5fYmFjayA9IG5ld0JhY2s7XG4gICAgICBvbGRCYWNrLl9uZXh0ID0gbmV3QmFjaztcbiAgICB9XG4gICAgKyt0aGlzLl9zaXplO1xuICB9XG5cbiAgLy8gTGlrZSBwdXNoKCksIHNoaWZ0KCkgZm9sbG93cyB0aGUgcmVhZCAtPiBjYWxjdWxhdGUgLT4gbXV0YXRlIHBhdHRlcm4gZm9yXG4gIC8vIGV4Y2VwdGlvbiBzYWZldHkuXG4gIHNoaWZ0KCk6IFQge1xuICAgIGFzc2VydCh0aGlzLl9zaXplID4gMCk7IC8vIG11c3Qgbm90IGJlIGNhbGxlZCBvbiBhbiBlbXB0eSBxdWV1ZVxuXG4gICAgY29uc3Qgb2xkRnJvbnQgPSB0aGlzLl9mcm9udDtcbiAgICBsZXQgbmV3RnJvbnQgPSBvbGRGcm9udDtcbiAgICBjb25zdCBvbGRDdXJzb3IgPSB0aGlzLl9jdXJzb3I7XG4gICAgbGV0IG5ld0N1cnNvciA9IG9sZEN1cnNvciArIDE7XG5cbiAgICBjb25zdCBlbGVtZW50cyA9IG9sZEZyb250Ll9lbGVtZW50cztcbiAgICBjb25zdCBlbGVtZW50ID0gZWxlbWVudHNbb2xkQ3Vyc29yXTtcblxuICAgIGlmIChuZXdDdXJzb3IgPT09IFFVRVVFX01BWF9BUlJBWV9TSVpFKSB7XG4gICAgICBhc3NlcnQoZWxlbWVudHMubGVuZ3RoID09PSBRVUVVRV9NQVhfQVJSQVlfU0laRSk7XG4gICAgICBhc3NlcnQob2xkRnJvbnQuX25leHQgIT09IHVuZGVmaW5lZCk7XG4gICAgICBuZXdGcm9udCA9IG9sZEZyb250Ll9uZXh0ITtcbiAgICAgIG5ld0N1cnNvciA9IDA7XG4gICAgfVxuXG4gICAgLy8gTm8gbXV0YXRpb25zIGJlZm9yZSB0aGlzIHBvaW50LlxuICAgIC0tdGhpcy5fc2l6ZTtcbiAgICB0aGlzLl9jdXJzb3IgPSBuZXdDdXJzb3I7XG4gICAgaWYgKG9sZEZyb250ICE9PSBuZXdGcm9udCkge1xuICAgICAgdGhpcy5fZnJvbnQgPSBuZXdGcm9udDtcbiAgICB9XG5cbiAgICAvLyBQZXJtaXQgc2hpZnRlZCBlbGVtZW50IHRvIGJlIGdhcmJhZ2UgY29sbGVjdGVkLlxuICAgIGVsZW1lbnRzW29sZEN1cnNvcl0gPSB1bmRlZmluZWQhO1xuXG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH1cblxuICAvLyBUaGUgdHJpY2t5IHRoaW5nIGFib3V0IGZvckVhY2goKSBpcyB0aGF0IGl0IGNhbiBiZSBjYWxsZWRcbiAgLy8gcmUtZW50cmFudGx5LiBUaGUgcXVldWUgbWF5IGJlIG11dGF0ZWQgaW5zaWRlIHRoZSBjYWxsYmFjay4gSXQgaXMgZWFzeSB0b1xuICAvLyBzZWUgdGhhdCBwdXNoKCkgd2l0aGluIHRoZSBjYWxsYmFjayBoYXMgbm8gbmVnYXRpdmUgZWZmZWN0cyBzaW5jZSB0aGUgZW5kXG4gIC8vIG9mIHRoZSBxdWV1ZSBpcyBjaGVja2VkIGZvciBvbiBldmVyeSBpdGVyYXRpb24uIElmIHNoaWZ0KCkgaXMgY2FsbGVkXG4gIC8vIHJlcGVhdGVkbHkgd2l0aGluIHRoZSBjYWxsYmFjayB0aGVuIHRoZSBuZXh0IGl0ZXJhdGlvbiBtYXkgcmV0dXJuIGFuXG4gIC8vIGVsZW1lbnQgdGhhdCBoYXMgYmVlbiByZW1vdmVkLiBJbiB0aGlzIGNhc2UgdGhlIGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkXG4gIC8vIHdpdGggdW5kZWZpbmVkIHZhbHVlcyB1bnRpbCB3ZSBlaXRoZXIgXCJjYXRjaCB1cFwiIHdpdGggZWxlbWVudHMgdGhhdCBzdGlsbFxuICAvLyBleGlzdCBvciByZWFjaCB0aGUgYmFjayBvZiB0aGUgcXVldWUuXG4gIGZvckVhY2goY2FsbGJhY2s6IChlbGVtZW50OiBUKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgbGV0IGkgPSB0aGlzLl9jdXJzb3I7XG4gICAgbGV0IG5vZGUgPSB0aGlzLl9mcm9udDtcbiAgICBsZXQgZWxlbWVudHMgPSBub2RlLl9lbGVtZW50cztcbiAgICB3aGlsZSAoaSAhPT0gZWxlbWVudHMubGVuZ3RoIHx8IG5vZGUuX25leHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKGkgPT09IGVsZW1lbnRzLmxlbmd0aCkge1xuICAgICAgICBhc3NlcnQobm9kZS5fbmV4dCAhPT0gdW5kZWZpbmVkKTtcbiAgICAgICAgYXNzZXJ0KGkgPT09IFFVRVVFX01BWF9BUlJBWV9TSVpFKTtcbiAgICAgICAgbm9kZSA9IG5vZGUuX25leHQhO1xuICAgICAgICBlbGVtZW50cyA9IG5vZGUuX2VsZW1lbnRzO1xuICAgICAgICBpID0gMDtcbiAgICAgICAgaWYgKGVsZW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjYWxsYmFjayhlbGVtZW50c1tpXSk7XG4gICAgICArK2k7XG4gICAgfVxuICB9XG5cbiAgLy8gUmV0dXJuIHRoZSBlbGVtZW50IHRoYXQgd291bGQgYmUgcmV0dXJuZWQgaWYgc2hpZnQoKSB3YXMgY2FsbGVkIG5vdyxcbiAgLy8gd2l0aG91dCBtb2RpZnlpbmcgdGhlIHF1ZXVlLlxuICBwZWVrKCk6IFQge1xuICAgIGFzc2VydCh0aGlzLl9zaXplID4gMCk7IC8vIG11c3Qgbm90IGJlIGNhbGxlZCBvbiBhbiBlbXB0eSBxdWV1ZVxuXG4gICAgY29uc3QgZnJvbnQgPSB0aGlzLl9mcm9udDtcbiAgICBjb25zdCBjdXJzb3IgPSB0aGlzLl9jdXJzb3I7XG4gICAgcmV0dXJuIGZyb250Ll9lbGVtZW50c1tjdXJzb3JdO1xuICB9XG59XG4iLCAiZXhwb3J0IGNvbnN0IEFib3J0U3RlcHMgPSBTeW1ib2woJ1tbQWJvcnRTdGVwc11dJyk7XG5leHBvcnQgY29uc3QgRXJyb3JTdGVwcyA9IFN5bWJvbCgnW1tFcnJvclN0ZXBzXV0nKTtcbmV4cG9ydCBjb25zdCBDYW5jZWxTdGVwcyA9IFN5bWJvbCgnW1tDYW5jZWxTdGVwc11dJyk7XG5leHBvcnQgY29uc3QgUHVsbFN0ZXBzID0gU3ltYm9sKCdbW1B1bGxTdGVwc11dJyk7XG5leHBvcnQgY29uc3QgUmVsZWFzZVN0ZXBzID0gU3ltYm9sKCdbW1JlbGVhc2VTdGVwc11dJyk7XG4iLCAiaW1wb3J0IGFzc2VydCBmcm9tICcuLi8uLi9zdHViL2Fzc2VydCc7XG5pbXBvcnQgeyBSZWFkYWJsZVN0cmVhbSwgUmVhZGFibGVTdHJlYW1DYW5jZWwsIHR5cGUgUmVhZGFibGVTdHJlYW1SZWFkZXIgfSBmcm9tICcuLi9yZWFkYWJsZS1zdHJlYW0nO1xuaW1wb3J0IHsgbmV3UHJvbWlzZSwgc2V0UHJvbWlzZUlzSGFuZGxlZFRvVHJ1ZSB9IGZyb20gJy4uL2hlbHBlcnMvd2ViaWRsJztcbmltcG9ydCB7IFJlbGVhc2VTdGVwcyB9IGZyb20gJy4uL2Fic3RyYWN0LW9wcy9pbnRlcm5hbC1tZXRob2RzJztcblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtUmVhZGVyR2VuZXJpY0luaXRpYWxpemU8Uj4ocmVhZGVyOiBSZWFkYWJsZVN0cmVhbVJlYWRlcjxSPiwgc3RyZWFtOiBSZWFkYWJsZVN0cmVhbTxSPikge1xuICByZWFkZXIuX293bmVyUmVhZGFibGVTdHJlYW0gPSBzdHJlYW07XG4gIHN0cmVhbS5fcmVhZGVyID0gcmVhZGVyO1xuXG4gIGlmIChzdHJlYW0uX3N0YXRlID09PSAncmVhZGFibGUnKSB7XG4gICAgZGVmYXVsdFJlYWRlckNsb3NlZFByb21pc2VJbml0aWFsaXplKHJlYWRlcik7XG4gIH0gZWxzZSBpZiAoc3RyZWFtLl9zdGF0ZSA9PT0gJ2Nsb3NlZCcpIHtcbiAgICBkZWZhdWx0UmVhZGVyQ2xvc2VkUHJvbWlzZUluaXRpYWxpemVBc1Jlc29sdmVkKHJlYWRlcik7XG4gIH0gZWxzZSB7XG4gICAgYXNzZXJ0KHN0cmVhbS5fc3RhdGUgPT09ICdlcnJvcmVkJyk7XG5cbiAgICBkZWZhdWx0UmVhZGVyQ2xvc2VkUHJvbWlzZUluaXRpYWxpemVBc1JlamVjdGVkKHJlYWRlciwgc3RyZWFtLl9zdG9yZWRFcnJvcik7XG4gIH1cbn1cblxuLy8gQSBjbGllbnQgb2YgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyIGFuZCBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIgbWF5IHVzZSB0aGVzZSBmdW5jdGlvbnMgZGlyZWN0bHkgdG8gYnlwYXNzIHN0YXRlXG4vLyBjaGVjay5cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtUmVhZGVyR2VuZXJpY0NhbmNlbChyZWFkZXI6IFJlYWRhYmxlU3RyZWFtUmVhZGVyPGFueT4sIHJlYXNvbjogYW55KTogUHJvbWlzZTx1bmRlZmluZWQ+IHtcbiAgY29uc3Qgc3RyZWFtID0gcmVhZGVyLl9vd25lclJlYWRhYmxlU3RyZWFtO1xuICBhc3NlcnQoc3RyZWFtICE9PSB1bmRlZmluZWQpO1xuICByZXR1cm4gUmVhZGFibGVTdHJlYW1DYW5jZWwoc3RyZWFtLCByZWFzb24pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1SZWFkZXJHZW5lcmljUmVsZWFzZShyZWFkZXI6IFJlYWRhYmxlU3RyZWFtUmVhZGVyPGFueT4pIHtcbiAgY29uc3Qgc3RyZWFtID0gcmVhZGVyLl9vd25lclJlYWRhYmxlU3RyZWFtO1xuICBhc3NlcnQoc3RyZWFtICE9PSB1bmRlZmluZWQpO1xuICBhc3NlcnQoc3RyZWFtLl9yZWFkZXIgPT09IHJlYWRlcik7XG5cbiAgaWYgKHN0cmVhbS5fc3RhdGUgPT09ICdyZWFkYWJsZScpIHtcbiAgICBkZWZhdWx0UmVhZGVyQ2xvc2VkUHJvbWlzZVJlamVjdChcbiAgICAgIHJlYWRlcixcbiAgICAgIG5ldyBUeXBlRXJyb3IoYFJlYWRlciB3YXMgcmVsZWFzZWQgYW5kIGNhbiBubyBsb25nZXIgYmUgdXNlZCB0byBtb25pdG9yIHRoZSBzdHJlYW0ncyBjbG9zZWRuZXNzYCkpO1xuICB9IGVsc2Uge1xuICAgIGRlZmF1bHRSZWFkZXJDbG9zZWRQcm9taXNlUmVzZXRUb1JlamVjdGVkKFxuICAgICAgcmVhZGVyLFxuICAgICAgbmV3IFR5cGVFcnJvcihgUmVhZGVyIHdhcyByZWxlYXNlZCBhbmQgY2FuIG5vIGxvbmdlciBiZSB1c2VkIHRvIG1vbml0b3IgdGhlIHN0cmVhbSdzIGNsb3NlZG5lc3NgKSk7XG4gIH1cblxuICBzdHJlYW0uX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlcltSZWxlYXNlU3RlcHNdKCk7XG5cbiAgc3RyZWFtLl9yZWFkZXIgPSB1bmRlZmluZWQ7XG4gIHJlYWRlci5fb3duZXJSZWFkYWJsZVN0cmVhbSA9IHVuZGVmaW5lZCE7XG59XG5cbi8vIEhlbHBlciBmdW5jdGlvbnMgZm9yIHRoZSByZWFkZXJzLlxuXG5leHBvcnQgZnVuY3Rpb24gcmVhZGVyTG9ja0V4Y2VwdGlvbihuYW1lOiBzdHJpbmcpOiBUeXBlRXJyb3Ige1xuICByZXR1cm4gbmV3IFR5cGVFcnJvcignQ2Fubm90ICcgKyBuYW1lICsgJyBhIHN0cmVhbSB1c2luZyBhIHJlbGVhc2VkIHJlYWRlcicpO1xufVxuXG4vLyBIZWxwZXIgZnVuY3Rpb25zIGZvciB0aGUgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyLlxuXG5leHBvcnQgZnVuY3Rpb24gZGVmYXVsdFJlYWRlckNsb3NlZFByb21pc2VJbml0aWFsaXplKHJlYWRlcjogUmVhZGFibGVTdHJlYW1SZWFkZXI8YW55Pikge1xuICByZWFkZXIuX2Nsb3NlZFByb21pc2UgPSBuZXdQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICByZWFkZXIuX2Nsb3NlZFByb21pc2VfcmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgcmVhZGVyLl9jbG9zZWRQcm9taXNlX3JlamVjdCA9IHJlamVjdDtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWZhdWx0UmVhZGVyQ2xvc2VkUHJvbWlzZUluaXRpYWxpemVBc1JlamVjdGVkKHJlYWRlcjogUmVhZGFibGVTdHJlYW1SZWFkZXI8YW55PiwgcmVhc29uOiBhbnkpIHtcbiAgZGVmYXVsdFJlYWRlckNsb3NlZFByb21pc2VJbml0aWFsaXplKHJlYWRlcik7XG4gIGRlZmF1bHRSZWFkZXJDbG9zZWRQcm9taXNlUmVqZWN0KHJlYWRlciwgcmVhc29uKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRSZWFkZXJDbG9zZWRQcm9taXNlSW5pdGlhbGl6ZUFzUmVzb2x2ZWQocmVhZGVyOiBSZWFkYWJsZVN0cmVhbVJlYWRlcjxhbnk+KSB7XG4gIGRlZmF1bHRSZWFkZXJDbG9zZWRQcm9taXNlSW5pdGlhbGl6ZShyZWFkZXIpO1xuICBkZWZhdWx0UmVhZGVyQ2xvc2VkUHJvbWlzZVJlc29sdmUocmVhZGVyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRSZWFkZXJDbG9zZWRQcm9taXNlUmVqZWN0KHJlYWRlcjogUmVhZGFibGVTdHJlYW1SZWFkZXI8YW55PiwgcmVhc29uOiBhbnkpIHtcbiAgaWYgKHJlYWRlci5fY2xvc2VkUHJvbWlzZV9yZWplY3QgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHNldFByb21pc2VJc0hhbmRsZWRUb1RydWUocmVhZGVyLl9jbG9zZWRQcm9taXNlKTtcbiAgcmVhZGVyLl9jbG9zZWRQcm9taXNlX3JlamVjdChyZWFzb24pO1xuICByZWFkZXIuX2Nsb3NlZFByb21pc2VfcmVzb2x2ZSA9IHVuZGVmaW5lZDtcbiAgcmVhZGVyLl9jbG9zZWRQcm9taXNlX3JlamVjdCA9IHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRSZWFkZXJDbG9zZWRQcm9taXNlUmVzZXRUb1JlamVjdGVkKHJlYWRlcjogUmVhZGFibGVTdHJlYW1SZWFkZXI8YW55PiwgcmVhc29uOiBhbnkpIHtcbiAgYXNzZXJ0KHJlYWRlci5fY2xvc2VkUHJvbWlzZV9yZXNvbHZlID09PSB1bmRlZmluZWQpO1xuICBhc3NlcnQocmVhZGVyLl9jbG9zZWRQcm9taXNlX3JlamVjdCA9PT0gdW5kZWZpbmVkKTtcblxuICBkZWZhdWx0UmVhZGVyQ2xvc2VkUHJvbWlzZUluaXRpYWxpemVBc1JlamVjdGVkKHJlYWRlciwgcmVhc29uKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRSZWFkZXJDbG9zZWRQcm9taXNlUmVzb2x2ZShyZWFkZXI6IFJlYWRhYmxlU3RyZWFtUmVhZGVyPGFueT4pIHtcbiAgaWYgKHJlYWRlci5fY2xvc2VkUHJvbWlzZV9yZXNvbHZlID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICByZWFkZXIuX2Nsb3NlZFByb21pc2VfcmVzb2x2ZSh1bmRlZmluZWQpO1xuICByZWFkZXIuX2Nsb3NlZFByb21pc2VfcmVzb2x2ZSA9IHVuZGVmaW5lZDtcbiAgcmVhZGVyLl9jbG9zZWRQcm9taXNlX3JlamVjdCA9IHVuZGVmaW5lZDtcbn1cbiIsICIvLy8gPHJlZmVyZW5jZSBsaWI9XCJlczIwMTUuY29yZVwiIC8+XG5cbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL051bWJlci9pc0Zpbml0ZSNQb2x5ZmlsbFxuY29uc3QgTnVtYmVySXNGaW5pdGU6IHR5cGVvZiBOdW1iZXIuaXNGaW5pdGUgPSBOdW1iZXIuaXNGaW5pdGUgfHwgZnVuY3Rpb24gKHgpIHtcbiAgcmV0dXJuIHR5cGVvZiB4ID09PSAnbnVtYmVyJyAmJiBpc0Zpbml0ZSh4KTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IE51bWJlcklzRmluaXRlO1xuIiwgIi8vLyA8cmVmZXJlbmNlIGxpYj1cImVzMjAxNS5jb3JlXCIgLz5cblxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvTWF0aC90cnVuYyNQb2x5ZmlsbFxuY29uc3QgTWF0aFRydW5jOiB0eXBlb2YgTWF0aC50cnVuYyA9IE1hdGgudHJ1bmMgfHwgZnVuY3Rpb24gKHYpIHtcbiAgcmV0dXJuIHYgPCAwID8gTWF0aC5jZWlsKHYpIDogTWF0aC5mbG9vcih2KTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IE1hdGhUcnVuYztcbiIsICJpbXBvcnQgTnVtYmVySXNGaW5pdGUgZnJvbSAnLi4vLi4vc3R1Yi9udW1iZXItaXNmaW5pdGUnO1xuaW1wb3J0IE1hdGhUcnVuYyBmcm9tICcuLi8uLi9zdHViL21hdGgtdHJ1bmMnO1xuXG4vLyBodHRwczovL2hleWNhbS5naXRodWIuaW8vd2ViaWRsLyNpZGwtZGljdGlvbmFyaWVzXG5leHBvcnQgZnVuY3Rpb24gaXNEaWN0aW9uYXJ5KHg6IGFueSk6IHggaXMgb2JqZWN0IHwgbnVsbCB7XG4gIHJldHVybiB0eXBlb2YgeCA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIHggPT09ICdmdW5jdGlvbic7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnREaWN0aW9uYXJ5KG9iajogdW5rbm93bixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6IHN0cmluZyk6IGFzc2VydHMgb2JqIGlzIG9iamVjdCB8IG51bGwgfCB1bmRlZmluZWQge1xuICBpZiAob2JqICE9PSB1bmRlZmluZWQgJiYgIWlzRGljdGlvbmFyeShvYmopKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgJHtjb250ZXh0fSBpcyBub3QgYW4gb2JqZWN0LmApO1xuICB9XG59XG5cbmV4cG9ydCB0eXBlIEFueUZ1bmN0aW9uID0gKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnk7XG5cbi8vIGh0dHBzOi8vaGV5Y2FtLmdpdGh1Yi5pby93ZWJpZGwvI2lkbC1jYWxsYmFjay1mdW5jdGlvbnNcbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnRGdW5jdGlvbih4OiB1bmtub3duLCBjb250ZXh0OiBzdHJpbmcpOiBhc3NlcnRzIHggaXMgQW55RnVuY3Rpb24ge1xuICBpZiAodHlwZW9mIHggIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGAke2NvbnRleHR9IGlzIG5vdCBhIGZ1bmN0aW9uLmApO1xuICB9XG59XG5cbi8vIGh0dHBzOi8vaGV5Y2FtLmdpdGh1Yi5pby93ZWJpZGwvI2lkbC1vYmplY3RcbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdCh4OiBhbnkpOiB4IGlzIG9iamVjdCB7XG4gIHJldHVybiAodHlwZW9mIHggPT09ICdvYmplY3QnICYmIHggIT09IG51bGwpIHx8IHR5cGVvZiB4ID09PSAnZnVuY3Rpb24nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0T2JqZWN0KHg6IHVua25vd24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6IHN0cmluZyk6IGFzc2VydHMgeCBpcyBvYmplY3Qge1xuICBpZiAoIWlzT2JqZWN0KHgpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgJHtjb250ZXh0fSBpcyBub3QgYW4gb2JqZWN0LmApO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnRSZXF1aXJlZEFyZ3VtZW50PFQ+KHg6IFQgfCB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dDogc3RyaW5nKTogYXNzZXJ0cyB4IGlzIFQge1xuICBpZiAoeCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgUGFyYW1ldGVyICR7cG9zaXRpb259IGlzIHJlcXVpcmVkIGluICcke2NvbnRleHR9Jy5gKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0UmVxdWlyZWRGaWVsZDxUPih4OiBUIHwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQ6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6IHN0cmluZyk6IGFzc2VydHMgeCBpcyBUIHtcbiAgaWYgKHggPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYCR7ZmllbGR9IGlzIHJlcXVpcmVkIGluICcke2NvbnRleHR9Jy5gKTtcbiAgfVxufVxuXG4vLyBodHRwczovL2hleWNhbS5naXRodWIuaW8vd2ViaWRsLyNpZGwtdW5yZXN0cmljdGVkLWRvdWJsZVxuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRVbnJlc3RyaWN0ZWREb3VibGUodmFsdWU6IHVua25vd24pOiBudW1iZXIge1xuICByZXR1cm4gTnVtYmVyKHZhbHVlKTtcbn1cblxuZnVuY3Rpb24gY2Vuc29yTmVnYXRpdmVaZXJvKHg6IG51bWJlcik6IG51bWJlciB7XG4gIHJldHVybiB4ID09PSAwID8gMCA6IHg7XG59XG5cbmZ1bmN0aW9uIGludGVnZXJQYXJ0KHg6IG51bWJlcik6IG51bWJlciB7XG4gIHJldHVybiBjZW5zb3JOZWdhdGl2ZVplcm8oTWF0aFRydW5jKHgpKTtcbn1cblxuLy8gaHR0cHM6Ly9oZXljYW0uZ2l0aHViLmlvL3dlYmlkbC8jaWRsLXVuc2lnbmVkLWxvbmctbG9uZ1xuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRVbnNpZ25lZExvbmdMb25nV2l0aEVuZm9yY2VSYW5nZSh2YWx1ZTogdW5rbm93biwgY29udGV4dDogc3RyaW5nKTogbnVtYmVyIHtcbiAgY29uc3QgbG93ZXJCb3VuZCA9IDA7XG4gIGNvbnN0IHVwcGVyQm91bmQgPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcblxuICBsZXQgeCA9IE51bWJlcih2YWx1ZSk7XG4gIHggPSBjZW5zb3JOZWdhdGl2ZVplcm8oeCk7XG5cbiAgaWYgKCFOdW1iZXJJc0Zpbml0ZSh4KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYCR7Y29udGV4dH0gaXMgbm90IGEgZmluaXRlIG51bWJlcmApO1xuICB9XG5cbiAgeCA9IGludGVnZXJQYXJ0KHgpO1xuXG4gIGlmICh4IDwgbG93ZXJCb3VuZCB8fCB4ID4gdXBwZXJCb3VuZCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYCR7Y29udGV4dH0gaXMgb3V0c2lkZSB0aGUgYWNjZXB0ZWQgcmFuZ2Ugb2YgJHtsb3dlckJvdW5kfSB0byAke3VwcGVyQm91bmR9LCBpbmNsdXNpdmVgKTtcbiAgfVxuXG4gIGlmICghTnVtYmVySXNGaW5pdGUoeCkgfHwgeCA9PT0gMCkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgLy8gVE9ETyBVc2UgQmlnSW50IGlmIHN1cHBvcnRlZD9cbiAgLy8gbGV0IHhCaWdJbnQgPSBCaWdJbnQoaW50ZWdlclBhcnQoeCkpO1xuICAvLyB4QmlnSW50ID0gQmlnSW50LmFzVWludE4oNjQsIHhCaWdJbnQpO1xuICAvLyByZXR1cm4gTnVtYmVyKHhCaWdJbnQpO1xuXG4gIHJldHVybiB4O1xufVxuIiwgImltcG9ydCB7IElzUmVhZGFibGVTdHJlYW0sIFJlYWRhYmxlU3RyZWFtIH0gZnJvbSAnLi4vcmVhZGFibGUtc3RyZWFtJztcblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydFJlYWRhYmxlU3RyZWFtKHg6IHVua25vd24sIGNvbnRleHQ6IHN0cmluZyk6IGFzc2VydHMgeCBpcyBSZWFkYWJsZVN0cmVhbSB7XG4gIGlmICghSXNSZWFkYWJsZVN0cmVhbSh4KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYCR7Y29udGV4dH0gaXMgbm90IGEgUmVhZGFibGVTdHJlYW0uYCk7XG4gIH1cbn1cbiIsICJpbXBvcnQgYXNzZXJ0IGZyb20gJy4uLy4uL3N0dWIvYXNzZXJ0JztcbmltcG9ydCB7IFNpbXBsZVF1ZXVlIH0gZnJvbSAnLi4vc2ltcGxlLXF1ZXVlJztcbmltcG9ydCB7XG4gIFJlYWRhYmxlU3RyZWFtUmVhZGVyR2VuZXJpY0NhbmNlbCxcbiAgUmVhZGFibGVTdHJlYW1SZWFkZXJHZW5lcmljSW5pdGlhbGl6ZSxcbiAgUmVhZGFibGVTdHJlYW1SZWFkZXJHZW5lcmljUmVsZWFzZSxcbiAgcmVhZGVyTG9ja0V4Y2VwdGlvblxufSBmcm9tICcuL2dlbmVyaWMtcmVhZGVyJztcbmltcG9ydCB7IElzUmVhZGFibGVTdHJlYW1Mb2NrZWQsIFJlYWRhYmxlU3RyZWFtIH0gZnJvbSAnLi4vcmVhZGFibGUtc3RyZWFtJztcbmltcG9ydCB7IHNldEZ1bmN0aW9uTmFtZSwgdHlwZUlzT2JqZWN0IH0gZnJvbSAnLi4vaGVscGVycy9taXNjZWxsYW5lb3VzJztcbmltcG9ydCB7IFB1bGxTdGVwcyB9IGZyb20gJy4uL2Fic3RyYWN0LW9wcy9pbnRlcm5hbC1tZXRob2RzJztcbmltcG9ydCB7IG5ld1Byb21pc2UsIHByb21pc2VSZWplY3RlZFdpdGggfSBmcm9tICcuLi9oZWxwZXJzL3dlYmlkbCc7XG5pbXBvcnQgeyBhc3NlcnRSZXF1aXJlZEFyZ3VtZW50IH0gZnJvbSAnLi4vdmFsaWRhdG9ycy9iYXNpYyc7XG5pbXBvcnQgeyBhc3NlcnRSZWFkYWJsZVN0cmVhbSB9IGZyb20gJy4uL3ZhbGlkYXRvcnMvcmVhZGFibGUtc3RyZWFtJztcblxuLyoqXG4gKiBBIHJlc3VsdCByZXR1cm5lZCBieSB7QGxpbmsgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyLnJlYWR9LlxuICpcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IHR5cGUgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZFJlc3VsdDxUPiA9IHtcbiAgZG9uZTogZmFsc2U7XG4gIHZhbHVlOiBUO1xufSB8IHtcbiAgZG9uZTogdHJ1ZTtcbiAgdmFsdWU/OiB1bmRlZmluZWQ7XG59XG5cbi8vIEFic3RyYWN0IG9wZXJhdGlvbnMgZm9yIHRoZSBSZWFkYWJsZVN0cmVhbS5cblxuZXhwb3J0IGZ1bmN0aW9uIEFjcXVpcmVSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXI8Uj4oc3RyZWFtOiBSZWFkYWJsZVN0cmVhbSk6IFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcjxSPiB7XG4gIHJldHVybiBuZXcgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyKHN0cmVhbSk7XG59XG5cbi8vIFJlYWRhYmxlU3RyZWFtIEFQSSBleHBvc2VkIGZvciBjb250cm9sbGVycy5cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtQWRkUmVhZFJlcXVlc3Q8Uj4oc3RyZWFtOiBSZWFkYWJsZVN0cmVhbTxSPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlYWRSZXF1ZXN0OiBSZWFkUmVxdWVzdDxSPik6IHZvaWQge1xuICBhc3NlcnQoSXNSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXIoc3RyZWFtLl9yZWFkZXIpKTtcbiAgYXNzZXJ0KHN0cmVhbS5fc3RhdGUgPT09ICdyZWFkYWJsZScpO1xuXG4gIChzdHJlYW0uX3JlYWRlciEgYXMgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyPFI+KS5fcmVhZFJlcXVlc3RzLnB1c2gocmVhZFJlcXVlc3QpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1GdWxmaWxsUmVhZFJlcXVlc3Q8Uj4oc3RyZWFtOiBSZWFkYWJsZVN0cmVhbTxSPiwgY2h1bms6IFIgfCB1bmRlZmluZWQsIGRvbmU6IGJvb2xlYW4pIHtcbiAgY29uc3QgcmVhZGVyID0gc3RyZWFtLl9yZWFkZXIgYXMgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyPFI+O1xuXG4gIGFzc2VydChyZWFkZXIuX3JlYWRSZXF1ZXN0cy5sZW5ndGggPiAwKTtcblxuICBjb25zdCByZWFkUmVxdWVzdCA9IHJlYWRlci5fcmVhZFJlcXVlc3RzLnNoaWZ0KCkhO1xuICBpZiAoZG9uZSkge1xuICAgIHJlYWRSZXF1ZXN0Ll9jbG9zZVN0ZXBzKCk7XG4gIH0gZWxzZSB7XG4gICAgcmVhZFJlcXVlc3QuX2NodW5rU3RlcHMoY2h1bmshKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1HZXROdW1SZWFkUmVxdWVzdHM8Uj4oc3RyZWFtOiBSZWFkYWJsZVN0cmVhbTxSPik6IG51bWJlciB7XG4gIHJldHVybiAoc3RyZWFtLl9yZWFkZXIgYXMgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyPFI+KS5fcmVhZFJlcXVlc3RzLmxlbmd0aDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtSGFzRGVmYXVsdFJlYWRlcihzdHJlYW06IFJlYWRhYmxlU3RyZWFtKTogYm9vbGVhbiB7XG4gIGNvbnN0IHJlYWRlciA9IHN0cmVhbS5fcmVhZGVyO1xuXG4gIGlmIChyZWFkZXIgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICghSXNSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXIocmVhZGVyKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG4vLyBSZWFkZXJzXG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVhZFJlcXVlc3Q8Uj4ge1xuICBfY2h1bmtTdGVwcyhjaHVuazogUik6IHZvaWQ7XG5cbiAgX2Nsb3NlU3RlcHMoKTogdm9pZDtcblxuICBfZXJyb3JTdGVwcyhlOiBhbnkpOiB2b2lkO1xufVxuXG4vKipcbiAqIEEgZGVmYXVsdCByZWFkZXIgdmVuZGVkIGJ5IGEge0BsaW5rIFJlYWRhYmxlU3RyZWFtfS5cbiAqXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjbGFzcyBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXI8UiA9IGFueT4ge1xuICAvKiogQGludGVybmFsICovXG4gIF9vd25lclJlYWRhYmxlU3RyZWFtITogUmVhZGFibGVTdHJlYW08Uj47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2Nsb3NlZFByb21pc2UhOiBQcm9taXNlPHVuZGVmaW5lZD47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2Nsb3NlZFByb21pc2VfcmVzb2x2ZT86ICh2YWx1ZT86IHVuZGVmaW5lZCkgPT4gdm9pZDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfY2xvc2VkUHJvbWlzZV9yZWplY3Q/OiAocmVhc29uOiBhbnkpID0+IHZvaWQ7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3JlYWRSZXF1ZXN0czogU2ltcGxlUXVldWU8UmVhZFJlcXVlc3Q8Uj4+O1xuXG4gIGNvbnN0cnVjdG9yKHN0cmVhbTogUmVhZGFibGVTdHJlYW08Uj4pIHtcbiAgICBhc3NlcnRSZXF1aXJlZEFyZ3VtZW50KHN0cmVhbSwgMSwgJ1JlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcicpO1xuICAgIGFzc2VydFJlYWRhYmxlU3RyZWFtKHN0cmVhbSwgJ0ZpcnN0IHBhcmFtZXRlcicpO1xuXG4gICAgaWYgKElzUmVhZGFibGVTdHJlYW1Mb2NrZWQoc3RyZWFtKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhpcyBzdHJlYW0gaGFzIGFscmVhZHkgYmVlbiBsb2NrZWQgZm9yIGV4Y2x1c2l2ZSByZWFkaW5nIGJ5IGFub3RoZXIgcmVhZGVyJyk7XG4gICAgfVxuXG4gICAgUmVhZGFibGVTdHJlYW1SZWFkZXJHZW5lcmljSW5pdGlhbGl6ZSh0aGlzLCBzdHJlYW0pO1xuXG4gICAgdGhpcy5fcmVhZFJlcXVlc3RzID0gbmV3IFNpbXBsZVF1ZXVlKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHByb21pc2UgdGhhdCB3aWxsIGJlIGZ1bGZpbGxlZCB3aGVuIHRoZSBzdHJlYW0gYmVjb21lcyBjbG9zZWQsXG4gICAqIG9yIHJlamVjdGVkIGlmIHRoZSBzdHJlYW0gZXZlciBlcnJvcnMgb3IgdGhlIHJlYWRlcidzIGxvY2sgaXMgcmVsZWFzZWQgYmVmb3JlIHRoZSBzdHJlYW0gZmluaXNoZXMgY2xvc2luZy5cbiAgICovXG4gIGdldCBjbG9zZWQoKTogUHJvbWlzZTx1bmRlZmluZWQ+IHtcbiAgICBpZiAoIUlzUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyKHRoaXMpKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChkZWZhdWx0UmVhZGVyQnJhbmRDaGVja0V4Y2VwdGlvbignY2xvc2VkJykpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9jbG9zZWRQcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIElmIHRoZSByZWFkZXIgaXMgYWN0aXZlLCBiZWhhdmVzIHRoZSBzYW1lIGFzIHtAbGluayBSZWFkYWJsZVN0cmVhbS5jYW5jZWwgfCBzdHJlYW0uY2FuY2VsKHJlYXNvbil9LlxuICAgKi9cbiAgY2FuY2VsKHJlYXNvbjogYW55ID0gdW5kZWZpbmVkKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCFJc1JlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcih0aGlzKSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoZGVmYXVsdFJlYWRlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ2NhbmNlbCcpKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fb3duZXJSZWFkYWJsZVN0cmVhbSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChyZWFkZXJMb2NrRXhjZXB0aW9uKCdjYW5jZWwnKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFJlYWRhYmxlU3RyZWFtUmVhZGVyR2VuZXJpY0NhbmNlbCh0aGlzLCByZWFzb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBwcm9taXNlIHRoYXQgYWxsb3dzIGFjY2VzcyB0byB0aGUgbmV4dCBjaHVuayBmcm9tIHRoZSBzdHJlYW0ncyBpbnRlcm5hbCBxdWV1ZSwgaWYgYXZhaWxhYmxlLlxuICAgKlxuICAgKiBJZiByZWFkaW5nIGEgY2h1bmsgY2F1c2VzIHRoZSBxdWV1ZSB0byBiZWNvbWUgZW1wdHksIG1vcmUgZGF0YSB3aWxsIGJlIHB1bGxlZCBmcm9tIHRoZSB1bmRlcmx5aW5nIHNvdXJjZS5cbiAgICovXG4gIHJlYWQoKTogUHJvbWlzZTxSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkUmVzdWx0PFI+PiB7XG4gICAgaWYgKCFJc1JlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcih0aGlzKSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoZGVmYXVsdFJlYWRlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ3JlYWQnKSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX293bmVyUmVhZGFibGVTdHJlYW0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgocmVhZGVyTG9ja0V4Y2VwdGlvbigncmVhZCBmcm9tJykpO1xuICAgIH1cblxuICAgIGxldCByZXNvbHZlUHJvbWlzZSE6IChyZXN1bHQ6IFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRSZXN1bHQ8Uj4pID0+IHZvaWQ7XG4gICAgbGV0IHJlamVjdFByb21pc2UhOiAocmVhc29uOiBhbnkpID0+IHZvaWQ7XG4gICAgY29uc3QgcHJvbWlzZSA9IG5ld1Byb21pc2U8UmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZFJlc3VsdDxSPj4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgcmVzb2x2ZVByb21pc2UgPSByZXNvbHZlO1xuICAgICAgcmVqZWN0UHJvbWlzZSA9IHJlamVjdDtcbiAgICB9KTtcbiAgICBjb25zdCByZWFkUmVxdWVzdDogUmVhZFJlcXVlc3Q8Uj4gPSB7XG4gICAgICBfY2h1bmtTdGVwczogY2h1bmsgPT4gcmVzb2x2ZVByb21pc2UoeyB2YWx1ZTogY2h1bmssIGRvbmU6IGZhbHNlIH0pLFxuICAgICAgX2Nsb3NlU3RlcHM6ICgpID0+IHJlc29sdmVQcm9taXNlKHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9KSxcbiAgICAgIF9lcnJvclN0ZXBzOiBlID0+IHJlamVjdFByb21pc2UoZSlcbiAgICB9O1xuICAgIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlclJlYWQodGhpcywgcmVhZFJlcXVlc3QpO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbGVhc2VzIHRoZSByZWFkZXIncyBsb2NrIG9uIHRoZSBjb3JyZXNwb25kaW5nIHN0cmVhbS4gQWZ0ZXIgdGhlIGxvY2sgaXMgcmVsZWFzZWQsIHRoZSByZWFkZXIgaXMgbm8gbG9uZ2VyIGFjdGl2ZS5cbiAgICogSWYgdGhlIGFzc29jaWF0ZWQgc3RyZWFtIGlzIGVycm9yZWQgd2hlbiB0aGUgbG9jayBpcyByZWxlYXNlZCwgdGhlIHJlYWRlciB3aWxsIGFwcGVhciBlcnJvcmVkIGluIHRoZSBzYW1lIHdheVxuICAgKiBmcm9tIG5vdyBvbjsgb3RoZXJ3aXNlLCB0aGUgcmVhZGVyIHdpbGwgYXBwZWFyIGNsb3NlZC5cbiAgICpcbiAgICogQSByZWFkZXIncyBsb2NrIGNhbm5vdCBiZSByZWxlYXNlZCB3aGlsZSBpdCBzdGlsbCBoYXMgYSBwZW5kaW5nIHJlYWQgcmVxdWVzdCwgaS5lLiwgaWYgYSBwcm9taXNlIHJldHVybmVkIGJ5XG4gICAqIHRoZSByZWFkZXIncyB7QGxpbmsgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyLnJlYWQgfCByZWFkKCl9IG1ldGhvZCBoYXMgbm90IHlldCBiZWVuIHNldHRsZWQuIEF0dGVtcHRpbmcgdG9cbiAgICogZG8gc28gd2lsbCB0aHJvdyBhIGBUeXBlRXJyb3JgIGFuZCBsZWF2ZSB0aGUgcmVhZGVyIGxvY2tlZCB0byB0aGUgc3RyZWFtLlxuICAgKi9cbiAgcmVsZWFzZUxvY2soKTogdm9pZCB7XG4gICAgaWYgKCFJc1JlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcih0aGlzKSkge1xuICAgICAgdGhyb3cgZGVmYXVsdFJlYWRlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ3JlbGVhc2VMb2NrJyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX293bmVyUmVhZGFibGVTdHJlYW0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlclJlbGVhc2UodGhpcyk7XG4gIH1cbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyLnByb3RvdHlwZSwge1xuICBjYW5jZWw6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICByZWFkOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgcmVsZWFzZUxvY2s6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICBjbG9zZWQ6IHsgZW51bWVyYWJsZTogdHJ1ZSB9XG59KTtcbnNldEZ1bmN0aW9uTmFtZShSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXIucHJvdG90eXBlLmNhbmNlbCwgJ2NhbmNlbCcpO1xuc2V0RnVuY3Rpb25OYW1lKFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlci5wcm90b3R5cGUucmVhZCwgJ3JlYWQnKTtcbnNldEZ1bmN0aW9uTmFtZShSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXIucHJvdG90eXBlLnJlbGVhc2VMb2NrLCAncmVsZWFzZUxvY2snKTtcbmlmICh0eXBlb2YgU3ltYm9sLnRvU3RyaW5nVGFnID09PSAnc3ltYm9sJykge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyLnByb3RvdHlwZSwgU3ltYm9sLnRvU3RyaW5nVGFnLCB7XG4gICAgdmFsdWU6ICdSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXInLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbn1cblxuLy8gQWJzdHJhY3Qgb3BlcmF0aW9ucyBmb3IgdGhlIHJlYWRlcnMuXG5cbmV4cG9ydCBmdW5jdGlvbiBJc1JlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcjxSID0gYW55Pih4OiBhbnkpOiB4IGlzIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcjxSPiB7XG4gIGlmICghdHlwZUlzT2JqZWN0KHgpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoeCwgJ19yZWFkUmVxdWVzdHMnKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB4IGluc3RhbmNlb2YgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyUmVhZDxSPihyZWFkZXI6IFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcjxSPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlYWRSZXF1ZXN0OiBSZWFkUmVxdWVzdDxSPik6IHZvaWQge1xuICBjb25zdCBzdHJlYW0gPSByZWFkZXIuX293bmVyUmVhZGFibGVTdHJlYW07XG5cbiAgYXNzZXJ0KHN0cmVhbSAhPT0gdW5kZWZpbmVkKTtcblxuICBzdHJlYW0uX2Rpc3R1cmJlZCA9IHRydWU7XG5cbiAgaWYgKHN0cmVhbS5fc3RhdGUgPT09ICdjbG9zZWQnKSB7XG4gICAgcmVhZFJlcXVlc3QuX2Nsb3NlU3RlcHMoKTtcbiAgfSBlbHNlIGlmIChzdHJlYW0uX3N0YXRlID09PSAnZXJyb3JlZCcpIHtcbiAgICByZWFkUmVxdWVzdC5fZXJyb3JTdGVwcyhzdHJlYW0uX3N0b3JlZEVycm9yKTtcbiAgfSBlbHNlIHtcbiAgICBhc3NlcnQoc3RyZWFtLl9zdGF0ZSA9PT0gJ3JlYWRhYmxlJyk7XG4gICAgc3RyZWFtLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXJbUHVsbFN0ZXBzXShyZWFkUmVxdWVzdCBhcyBSZWFkUmVxdWVzdDxhbnk+KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyUmVsZWFzZShyZWFkZXI6IFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcikge1xuICBSZWFkYWJsZVN0cmVhbVJlYWRlckdlbmVyaWNSZWxlYXNlKHJlYWRlcik7XG4gIGNvbnN0IGUgPSBuZXcgVHlwZUVycm9yKCdSZWFkZXIgd2FzIHJlbGVhc2VkJyk7XG4gIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlckVycm9yUmVhZFJlcXVlc3RzKHJlYWRlciwgZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXJFcnJvclJlYWRSZXF1ZXN0cyhyZWFkZXI6IFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlciwgZTogYW55KSB7XG4gIGNvbnN0IHJlYWRSZXF1ZXN0cyA9IHJlYWRlci5fcmVhZFJlcXVlc3RzO1xuICByZWFkZXIuX3JlYWRSZXF1ZXN0cyA9IG5ldyBTaW1wbGVRdWV1ZSgpO1xuICByZWFkUmVxdWVzdHMuZm9yRWFjaChyZWFkUmVxdWVzdCA9PiB7XG4gICAgcmVhZFJlcXVlc3QuX2Vycm9yU3RlcHMoZSk7XG4gIH0pO1xufVxuXG4vLyBIZWxwZXIgZnVuY3Rpb25zIGZvciB0aGUgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyLlxuXG5mdW5jdGlvbiBkZWZhdWx0UmVhZGVyQnJhbmRDaGVja0V4Y2VwdGlvbihuYW1lOiBzdHJpbmcpOiBUeXBlRXJyb3Ige1xuICByZXR1cm4gbmV3IFR5cGVFcnJvcihcbiAgICBgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyLnByb3RvdHlwZS4ke25hbWV9IGNhbiBvbmx5IGJlIHVzZWQgb24gYSBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXJgKTtcbn1cbiIsICIvLy8gPHJlZmVyZW5jZSBsaWI9XCJlczIwMTguYXN5bmNpdGVyYWJsZVwiIC8+XG5cbi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1lbXB0eS1mdW5jdGlvbiAqL1xuZXhwb3J0IGNvbnN0IEFzeW5jSXRlcmF0b3JQcm90b3R5cGU6IEFzeW5jSXRlcmFibGU8YW55PiA9XG4gIE9iamVjdC5nZXRQcm90b3R5cGVPZihPYmplY3QuZ2V0UHJvdG90eXBlT2YoYXN5bmMgZnVuY3Rpb24qICgpOiBBc3luY0l0ZXJhYmxlSXRlcmF0b3I8YW55PiB7fSkucHJvdG90eXBlKTtcbiIsICIvLy8gPHJlZmVyZW5jZSBsaWI9XCJlczIwMTguYXN5bmNpdGVyYWJsZVwiIC8+XG5cbmltcG9ydCB7IFJlYWRhYmxlU3RyZWFtIH0gZnJvbSAnLi4vcmVhZGFibGUtc3RyZWFtJztcbmltcG9ydCB7XG4gIEFjcXVpcmVSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXIsXG4gIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcixcbiAgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyUmVhZCxcbiAgdHlwZSBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkUmVzdWx0LFxuICB0eXBlIFJlYWRSZXF1ZXN0XG59IGZyb20gJy4vZGVmYXVsdC1yZWFkZXInO1xuaW1wb3J0IHsgUmVhZGFibGVTdHJlYW1SZWFkZXJHZW5lcmljQ2FuY2VsLCBSZWFkYWJsZVN0cmVhbVJlYWRlckdlbmVyaWNSZWxlYXNlIH0gZnJvbSAnLi9nZW5lcmljLXJlYWRlcic7XG5pbXBvcnQgYXNzZXJ0IGZyb20gJy4uLy4uL3N0dWIvYXNzZXJ0JztcbmltcG9ydCB7IEFzeW5jSXRlcmF0b3JQcm90b3R5cGUgfSBmcm9tICdAQHRhcmdldC9zdHViL2FzeW5jLWl0ZXJhdG9yLXByb3RvdHlwZSc7XG5pbXBvcnQgeyB0eXBlSXNPYmplY3QgfSBmcm9tICcuLi9oZWxwZXJzL21pc2NlbGxhbmVvdXMnO1xuaW1wb3J0IHtcbiAgbmV3UHJvbWlzZSxcbiAgcHJvbWlzZVJlamVjdGVkV2l0aCxcbiAgcHJvbWlzZVJlc29sdmVkV2l0aCxcbiAgcXVldWVNaWNyb3Rhc2ssXG4gIHRyYW5zZm9ybVByb21pc2VXaXRoXG59IGZyb20gJy4uL2hlbHBlcnMvd2ViaWRsJztcblxuLyoqXG4gKiBBbiBhc3luYyBpdGVyYXRvciByZXR1cm5lZCBieSB7QGxpbmsgUmVhZGFibGVTdHJlYW0udmFsdWVzfS5cbiAqXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9yPFI+IGV4dGVuZHMgQXN5bmNJdGVyYWJsZUl0ZXJhdG9yPFI+IHtcbiAgbmV4dCgpOiBQcm9taXNlPEl0ZXJhdG9yUmVzdWx0PFIsIHVuZGVmaW5lZD4+O1xuXG4gIHJldHVybih2YWx1ZT86IGFueSk6IFByb21pc2U8SXRlcmF0b3JSZXN1bHQ8YW55Pj47XG59XG5cbmV4cG9ydCBjbGFzcyBSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3JJbXBsPFI+IHtcbiAgcHJpdmF0ZSByZWFkb25seSBfcmVhZGVyOiBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXI8Uj47XG4gIHByaXZhdGUgcmVhZG9ubHkgX3ByZXZlbnRDYW5jZWw6IGJvb2xlYW47XG4gIHByaXZhdGUgX29uZ29pbmdQcm9taXNlOiBQcm9taXNlPFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRSZXN1bHQ8Uj4+IHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICBwcml2YXRlIF9pc0ZpbmlzaGVkID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IocmVhZGVyOiBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXI8Uj4sIHByZXZlbnRDYW5jZWw6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9yZWFkZXIgPSByZWFkZXI7XG4gICAgdGhpcy5fcHJldmVudENhbmNlbCA9IHByZXZlbnRDYW5jZWw7XG4gIH1cblxuICBuZXh0KCk6IFByb21pc2U8UmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZFJlc3VsdDxSPj4ge1xuICAgIGNvbnN0IG5leHRTdGVwcyA9ICgpID0+IHRoaXMuX25leHRTdGVwcygpO1xuICAgIHRoaXMuX29uZ29pbmdQcm9taXNlID0gdGhpcy5fb25nb2luZ1Byb21pc2UgP1xuICAgICAgdHJhbnNmb3JtUHJvbWlzZVdpdGgodGhpcy5fb25nb2luZ1Byb21pc2UsIG5leHRTdGVwcywgbmV4dFN0ZXBzKSA6XG4gICAgICBuZXh0U3RlcHMoKTtcbiAgICByZXR1cm4gdGhpcy5fb25nb2luZ1Byb21pc2U7XG4gIH1cblxuICByZXR1cm4odmFsdWU6IGFueSk6IFByb21pc2U8UmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZFJlc3VsdDxhbnk+PiB7XG4gICAgY29uc3QgcmV0dXJuU3RlcHMgPSAoKSA9PiB0aGlzLl9yZXR1cm5TdGVwcyh2YWx1ZSk7XG4gICAgcmV0dXJuIHRoaXMuX29uZ29pbmdQcm9taXNlID9cbiAgICAgIHRyYW5zZm9ybVByb21pc2VXaXRoKHRoaXMuX29uZ29pbmdQcm9taXNlLCByZXR1cm5TdGVwcywgcmV0dXJuU3RlcHMpIDpcbiAgICAgIHJldHVyblN0ZXBzKCk7XG4gIH1cblxuICBwcml2YXRlIF9uZXh0U3RlcHMoKTogUHJvbWlzZTxSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkUmVzdWx0PFI+PiB7XG4gICAgaWYgKHRoaXMuX2lzRmluaXNoZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoeyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IHJlYWRlciA9IHRoaXMuX3JlYWRlcjtcbiAgICBhc3NlcnQocmVhZGVyLl9vd25lclJlYWRhYmxlU3RyZWFtICE9PSB1bmRlZmluZWQpO1xuXG4gICAgbGV0IHJlc29sdmVQcm9taXNlITogKHJlc3VsdDogUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZFJlc3VsdDxSPikgPT4gdm9pZDtcbiAgICBsZXQgcmVqZWN0UHJvbWlzZSE6IChyZWFzb246IGFueSkgPT4gdm9pZDtcbiAgICBjb25zdCBwcm9taXNlID0gbmV3UHJvbWlzZTxSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkUmVzdWx0PFI+PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICByZXNvbHZlUHJvbWlzZSA9IHJlc29sdmU7XG4gICAgICByZWplY3RQcm9taXNlID0gcmVqZWN0O1xuICAgIH0pO1xuICAgIGNvbnN0IHJlYWRSZXF1ZXN0OiBSZWFkUmVxdWVzdDxSPiA9IHtcbiAgICAgIF9jaHVua1N0ZXBzOiBjaHVuayA9PiB7XG4gICAgICAgIHRoaXMuX29uZ29pbmdQcm9taXNlID0gdW5kZWZpbmVkO1xuICAgICAgICAvLyBUaGlzIG5lZWRzIHRvIGJlIGRlbGF5ZWQgYnkgb25lIG1pY3JvdGFzaywgb3RoZXJ3aXNlIHdlIHN0b3AgcHVsbGluZyB0b28gZWFybHkgd2hpY2ggYnJlYWtzIGEgdGVzdC5cbiAgICAgICAgLy8gRklYTUUgSXMgdGhpcyBhIGJ1ZyBpbiB0aGUgc3BlY2lmaWNhdGlvbiwgb3IgaW4gdGhlIHRlc3Q/XG4gICAgICAgIHF1ZXVlTWljcm90YXNrKCgpID0+IHJlc29sdmVQcm9taXNlKHsgdmFsdWU6IGNodW5rLCBkb25lOiBmYWxzZSB9KSk7XG4gICAgICB9LFxuICAgICAgX2Nsb3NlU3RlcHM6ICgpID0+IHtcbiAgICAgICAgdGhpcy5fb25nb2luZ1Byb21pc2UgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuX2lzRmluaXNoZWQgPSB0cnVlO1xuICAgICAgICBSZWFkYWJsZVN0cmVhbVJlYWRlckdlbmVyaWNSZWxlYXNlKHJlYWRlcik7XG4gICAgICAgIHJlc29sdmVQcm9taXNlKHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9KTtcbiAgICAgIH0sXG4gICAgICBfZXJyb3JTdGVwczogcmVhc29uID0+IHtcbiAgICAgICAgdGhpcy5fb25nb2luZ1Byb21pc2UgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuX2lzRmluaXNoZWQgPSB0cnVlO1xuICAgICAgICBSZWFkYWJsZVN0cmVhbVJlYWRlckdlbmVyaWNSZWxlYXNlKHJlYWRlcik7XG4gICAgICAgIHJlamVjdFByb21pc2UocmVhc29uKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlclJlYWQocmVhZGVyLCByZWFkUmVxdWVzdCk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICBwcml2YXRlIF9yZXR1cm5TdGVwcyh2YWx1ZTogYW55KTogUHJvbWlzZTxSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkUmVzdWx0PGFueT4+IHtcbiAgICBpZiAodGhpcy5faXNGaW5pc2hlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7IHZhbHVlLCBkb25lOiB0cnVlIH0pO1xuICAgIH1cbiAgICB0aGlzLl9pc0ZpbmlzaGVkID0gdHJ1ZTtcblxuICAgIGNvbnN0IHJlYWRlciA9IHRoaXMuX3JlYWRlcjtcbiAgICBhc3NlcnQocmVhZGVyLl9vd25lclJlYWRhYmxlU3RyZWFtICE9PSB1bmRlZmluZWQpO1xuICAgIGFzc2VydChyZWFkZXIuX3JlYWRSZXF1ZXN0cy5sZW5ndGggPT09IDApO1xuXG4gICAgaWYgKCF0aGlzLl9wcmV2ZW50Q2FuY2VsKSB7XG4gICAgICBjb25zdCByZXN1bHQgPSBSZWFkYWJsZVN0cmVhbVJlYWRlckdlbmVyaWNDYW5jZWwocmVhZGVyLCB2YWx1ZSk7XG4gICAgICBSZWFkYWJsZVN0cmVhbVJlYWRlckdlbmVyaWNSZWxlYXNlKHJlYWRlcik7XG4gICAgICByZXR1cm4gdHJhbnNmb3JtUHJvbWlzZVdpdGgocmVzdWx0LCAoKSA9PiAoeyB2YWx1ZSwgZG9uZTogdHJ1ZSB9KSk7XG4gICAgfVxuXG4gICAgUmVhZGFibGVTdHJlYW1SZWFkZXJHZW5lcmljUmVsZWFzZShyZWFkZXIpO1xuICAgIHJldHVybiBwcm9taXNlUmVzb2x2ZWRXaXRoKHsgdmFsdWUsIGRvbmU6IHRydWUgfSk7XG4gIH1cbn1cblxuaW50ZXJmYWNlIFJlYWRhYmxlU3RyZWFtQXN5bmNJdGVyYXRvckluc3RhbmNlPFI+IGV4dGVuZHMgUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9yPFI+IHtcbiAgLyoqIEBpbnRlcmFsICovXG4gIF9hc3luY0l0ZXJhdG9ySW1wbDogUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9ySW1wbDxSPjtcblxuICBuZXh0KCk6IFByb21pc2U8SXRlcmF0b3JSZXN1bHQ8UiwgdW5kZWZpbmVkPj47XG5cbiAgcmV0dXJuKHZhbHVlPzogYW55KTogUHJvbWlzZTxJdGVyYXRvclJlc3VsdDxhbnk+Pjtcbn1cblxuY29uc3QgUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9yUHJvdG90eXBlOiBSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3JJbnN0YW5jZTxhbnk+ID0ge1xuICBuZXh0KHRoaXM6IFJlYWRhYmxlU3RyZWFtQXN5bmNJdGVyYXRvckluc3RhbmNlPGFueT4pOiBQcm9taXNlPFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRSZXN1bHQ8YW55Pj4ge1xuICAgIGlmICghSXNSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3IodGhpcykpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKHN0cmVhbUFzeW5jSXRlcmF0b3JCcmFuZENoZWNrRXhjZXB0aW9uKCduZXh0JykpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fYXN5bmNJdGVyYXRvckltcGwubmV4dCgpO1xuICB9LFxuXG4gIHJldHVybih0aGlzOiBSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3JJbnN0YW5jZTxhbnk+LCB2YWx1ZTogYW55KTogUHJvbWlzZTxSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkUmVzdWx0PGFueT4+IHtcbiAgICBpZiAoIUlzUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9yKHRoaXMpKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChzdHJlYW1Bc3luY0l0ZXJhdG9yQnJhbmRDaGVja0V4Y2VwdGlvbigncmV0dXJuJykpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fYXN5bmNJdGVyYXRvckltcGwucmV0dXJuKHZhbHVlKTtcbiAgfVxufSBhcyBhbnk7XG5PYmplY3Quc2V0UHJvdG90eXBlT2YoUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9yUHJvdG90eXBlLCBBc3luY0l0ZXJhdG9yUHJvdG90eXBlKTtcblxuLy8gQWJzdHJhY3Qgb3BlcmF0aW9ucyBmb3IgdGhlIFJlYWRhYmxlU3RyZWFtLlxuXG5leHBvcnQgZnVuY3Rpb24gQWNxdWlyZVJlYWRhYmxlU3RyZWFtQXN5bmNJdGVyYXRvcjxSPihzdHJlYW06IFJlYWRhYmxlU3RyZWFtPFI+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldmVudENhbmNlbDogYm9vbGVhbik6IFJlYWRhYmxlU3RyZWFtQXN5bmNJdGVyYXRvcjxSPiB7XG4gIGNvbnN0IHJlYWRlciA9IEFjcXVpcmVSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXI8Uj4oc3RyZWFtKTtcbiAgY29uc3QgaW1wbCA9IG5ldyBSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3JJbXBsKHJlYWRlciwgcHJldmVudENhbmNlbCk7XG4gIGNvbnN0IGl0ZXJhdG9yOiBSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3JJbnN0YW5jZTxSPiA9IE9iamVjdC5jcmVhdGUoUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9yUHJvdG90eXBlKTtcbiAgaXRlcmF0b3IuX2FzeW5jSXRlcmF0b3JJbXBsID0gaW1wbDtcbiAgcmV0dXJuIGl0ZXJhdG9yO1xufVxuXG5mdW5jdGlvbiBJc1JlYWRhYmxlU3RyZWFtQXN5bmNJdGVyYXRvcjxSID0gYW55Pih4OiBhbnkpOiB4IGlzIFJlYWRhYmxlU3RyZWFtQXN5bmNJdGVyYXRvcjxSPiB7XG4gIGlmICghdHlwZUlzT2JqZWN0KHgpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoeCwgJ19hc3luY0l0ZXJhdG9ySW1wbCcpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdHJ5IHtcbiAgICAvLyBub2luc3BlY3Rpb24gU3VzcGljaW91c1R5cGVPZkd1YXJkXG4gICAgcmV0dXJuICh4IGFzIFJlYWRhYmxlU3RyZWFtQXN5bmNJdGVyYXRvckluc3RhbmNlPGFueT4pLl9hc3luY0l0ZXJhdG9ySW1wbCBpbnN0YW5jZW9mXG4gICAgICBSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3JJbXBsO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuLy8gSGVscGVyIGZ1bmN0aW9ucyBmb3IgdGhlIFJlYWRhYmxlU3RyZWFtLlxuXG5mdW5jdGlvbiBzdHJlYW1Bc3luY0l0ZXJhdG9yQnJhbmRDaGVja0V4Y2VwdGlvbihuYW1lOiBzdHJpbmcpOiBUeXBlRXJyb3Ige1xuICByZXR1cm4gbmV3IFR5cGVFcnJvcihgUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9yLiR7bmFtZX0gY2FuIG9ubHkgYmUgdXNlZCBvbiBhIFJlYWRhYmxlU3RlYW1Bc3luY0l0ZXJhdG9yYCk7XG59XG4iLCAiLy8vIDxyZWZlcmVuY2UgbGliPVwiZXMyMDE1LmNvcmVcIiAvPlxuXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9OdW1iZXIvaXNOYU4jUG9seWZpbGxcbmNvbnN0IE51bWJlcklzTmFOOiB0eXBlb2YgTnVtYmVyLmlzTmFOID0gTnVtYmVyLmlzTmFOIHx8IGZ1bmN0aW9uICh4KSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmVcbiAgcmV0dXJuIHggIT09IHg7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBOdW1iZXJJc05hTjtcbiIsICJpbXBvcnQgeyByZWZsZWN0Q2FsbCB9IGZyb20gJ2xpYi9oZWxwZXJzL3dlYmlkbCc7XG5pbXBvcnQgeyB0eXBlSXNPYmplY3QgfSBmcm9tICcuLi9oZWxwZXJzL21pc2NlbGxhbmVvdXMnO1xuaW1wb3J0IGFzc2VydCBmcm9tICcuLi8uLi9zdHViL2Fzc2VydCc7XG5cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgaW50ZXJmYWNlIEFycmF5QnVmZmVyIHtcbiAgICByZWFkb25seSBkZXRhY2hlZDogYm9vbGVhbjtcblxuICAgIHRyYW5zZmVyKCk6IEFycmF5QnVmZmVyO1xuICB9XG5cbiAgZnVuY3Rpb24gc3RydWN0dXJlZENsb25lPFQ+KHZhbHVlOiBULCBvcHRpb25zOiB7IHRyYW5zZmVyOiBBcnJheUJ1ZmZlcltdIH0pOiBUO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQ3JlYXRlQXJyYXlGcm9tTGlzdDxUIGV4dGVuZHMgYW55W10+KGVsZW1lbnRzOiBUKTogVCB7XG4gIC8vIFdlIHVzZSBhcnJheXMgdG8gcmVwcmVzZW50IGxpc3RzLCBzbyB0aGlzIGlzIGJhc2ljYWxseSBhIG5vLW9wLlxuICAvLyBEbyBhIHNsaWNlIHRob3VnaCBqdXN0IGluIGNhc2Ugd2UgaGFwcGVuIHRvIGRlcGVuZCBvbiB0aGUgdW5pcXVlLW5lc3MuXG4gIHJldHVybiBlbGVtZW50cy5zbGljZSgpIGFzIFQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBDb3B5RGF0YUJsb2NrQnl0ZXMoZGVzdDogQXJyYXlCdWZmZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc3RPZmZzZXQ6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3JjOiBBcnJheUJ1ZmZlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3JjT2Zmc2V0OiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG46IG51bWJlcikge1xuICBuZXcgVWludDhBcnJheShkZXN0KS5zZXQobmV3IFVpbnQ4QXJyYXkoc3JjLCBzcmNPZmZzZXQsIG4pLCBkZXN0T2Zmc2V0KTtcbn1cblxuZXhwb3J0IGxldCBUcmFuc2ZlckFycmF5QnVmZmVyID0gKE86IEFycmF5QnVmZmVyKTogQXJyYXlCdWZmZXIgPT4ge1xuICBpZiAodHlwZW9mIE8udHJhbnNmZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICBUcmFuc2ZlckFycmF5QnVmZmVyID0gYnVmZmVyID0+IGJ1ZmZlci50cmFuc2ZlcigpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBzdHJ1Y3R1cmVkQ2xvbmUgPT09ICdmdW5jdGlvbicpIHtcbiAgICBUcmFuc2ZlckFycmF5QnVmZmVyID0gYnVmZmVyID0+IHN0cnVjdHVyZWRDbG9uZShidWZmZXIsIHsgdHJhbnNmZXI6IFtidWZmZXJdIH0pO1xuICB9IGVsc2Uge1xuICAgIC8vIE5vdCBpbXBsZW1lbnRlZCBjb3JyZWN0bHlcbiAgICBUcmFuc2ZlckFycmF5QnVmZmVyID0gYnVmZmVyID0+IGJ1ZmZlcjtcbiAgfVxuICByZXR1cm4gVHJhbnNmZXJBcnJheUJ1ZmZlcihPKTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBDYW5UcmFuc2ZlckFycmF5QnVmZmVyKE86IEFycmF5QnVmZmVyKTogYm9vbGVhbiB7XG4gIHJldHVybiAhSXNEZXRhY2hlZEJ1ZmZlcihPKTtcbn1cblxuZXhwb3J0IGxldCBJc0RldGFjaGVkQnVmZmVyID0gKE86IEFycmF5QnVmZmVyKTogYm9vbGVhbiA9PiB7XG4gIGlmICh0eXBlb2YgTy5kZXRhY2hlZCA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgSXNEZXRhY2hlZEJ1ZmZlciA9IGJ1ZmZlciA9PiBidWZmZXIuZGV0YWNoZWQ7XG4gIH0gZWxzZSB7XG4gICAgLy8gTm90IGltcGxlbWVudGVkIGNvcnJlY3RseVxuICAgIElzRGV0YWNoZWRCdWZmZXIgPSBidWZmZXIgPT4gYnVmZmVyLmJ5dGVMZW5ndGggPT09IDA7XG4gIH1cbiAgcmV0dXJuIElzRGV0YWNoZWRCdWZmZXIoTyk7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gQXJyYXlCdWZmZXJTbGljZShidWZmZXI6IEFycmF5QnVmZmVyLCBiZWdpbjogbnVtYmVyLCBlbmQ6IG51bWJlcik6IEFycmF5QnVmZmVyIHtcbiAgLy8gQXJyYXlCdWZmZXIucHJvdG90eXBlLnNsaWNlIGlzIG5vdCBhdmFpbGFibGUgb24gSUUxMFxuICAvLyBodHRwczovL3d3dy5jYW5pdXNlLmNvbS9tZG4tamF2YXNjcmlwdF9idWlsdGluc19hcnJheWJ1ZmZlcl9zbGljZVxuICBpZiAoYnVmZmVyLnNsaWNlKSB7XG4gICAgcmV0dXJuIGJ1ZmZlci5zbGljZShiZWdpbiwgZW5kKTtcbiAgfVxuICBjb25zdCBsZW5ndGggPSBlbmQgLSBiZWdpbjtcbiAgY29uc3Qgc2xpY2UgPSBuZXcgQXJyYXlCdWZmZXIobGVuZ3RoKTtcbiAgQ29weURhdGFCbG9ja0J5dGVzKHNsaWNlLCAwLCBidWZmZXIsIGJlZ2luLCBsZW5ndGgpO1xuICByZXR1cm4gc2xpY2U7XG59XG5cbmV4cG9ydCB0eXBlIE1ldGhvZE5hbWU8VD4gPSB7XG4gIFtQIGluIGtleW9mIFRdOiBUW1BdIGV4dGVuZHMgRnVuY3Rpb24gfCB1bmRlZmluZWQgPyBQIDogbmV2ZXI7XG59W2tleW9mIFRdO1xuXG5leHBvcnQgZnVuY3Rpb24gR2V0TWV0aG9kPFQsIEsgZXh0ZW5kcyBNZXRob2ROYW1lPFQ+PihyZWNlaXZlcjogVCwgcHJvcDogSyk6IFRbS10gfCB1bmRlZmluZWQge1xuICBjb25zdCBmdW5jID0gcmVjZWl2ZXJbcHJvcF07XG4gIGlmIChmdW5jID09PSB1bmRlZmluZWQgfHwgZnVuYyA9PT0gbnVsbCkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBmdW5jICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgJHtTdHJpbmcocHJvcCl9IGlzIG5vdCBhIGZ1bmN0aW9uYCk7XG4gIH1cbiAgcmV0dXJuIGZ1bmM7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3luY0l0ZXJhdG9yUmVjb3JkPFQ+IHtcbiAgaXRlcmF0b3I6IEl0ZXJhdG9yPFQ+LFxuICBuZXh0TWV0aG9kOiBJdGVyYXRvcjxUPlsnbmV4dCddLFxuICBkb25lOiBib29sZWFuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFzeW5jSXRlcmF0b3JSZWNvcmQ8VD4ge1xuICBpdGVyYXRvcjogQXN5bmNJdGVyYXRvcjxUPixcbiAgbmV4dE1ldGhvZDogQXN5bmNJdGVyYXRvcjxUPlsnbmV4dCddLFxuICBkb25lOiBib29sZWFuO1xufVxuXG5leHBvcnQgdHlwZSBTeW5jT3JBc3luY0l0ZXJhdG9yUmVjb3JkPFQ+ID0gU3luY0l0ZXJhdG9yUmVjb3JkPFQ+IHwgQXN5bmNJdGVyYXRvclJlY29yZDxUPjtcblxuZXhwb3J0IGZ1bmN0aW9uIENyZWF0ZUFzeW5jRnJvbVN5bmNJdGVyYXRvcjxUPihzeW5jSXRlcmF0b3JSZWNvcmQ6IFN5bmNJdGVyYXRvclJlY29yZDxUPik6IEFzeW5jSXRlcmF0b3JSZWNvcmQ8VD4ge1xuICAvLyBJbnN0ZWFkIG9mIHJlLWltcGxlbWVudGluZyBDcmVhdGVBc3luY0Zyb21TeW5jSXRlcmF0b3IgYW5kICVBc3luY0Zyb21TeW5jSXRlcmF0b3JQcm90b3R5cGUlLFxuICAvLyB3ZSB1c2UgeWllbGQqIGluc2lkZSBhbiBhc3luYyBnZW5lcmF0b3IgZnVuY3Rpb24gdG8gYWNoaWV2ZSB0aGUgc2FtZSByZXN1bHQuXG5cbiAgLy8gV3JhcCB0aGUgc3luYyBpdGVyYXRvciBpbnNpZGUgYSBzeW5jIGl0ZXJhYmxlLCBzbyB3ZSBjYW4gdXNlIGl0IHdpdGggeWllbGQqLlxuICBjb25zdCBzeW5jSXRlcmFibGUgPSB7XG4gICAgW1N5bWJvbC5pdGVyYXRvcl06ICgpID0+IHN5bmNJdGVyYXRvclJlY29yZC5pdGVyYXRvclxuICB9O1xuICAvLyBDcmVhdGUgYW4gYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIGFuZCBpbW1lZGlhdGVseSBpbnZva2UgaXQuXG4gIGNvbnN0IGFzeW5jSXRlcmF0b3IgPSAoYXN5bmMgZnVuY3Rpb24qICgpIHtcbiAgICByZXR1cm4geWllbGQqIHN5bmNJdGVyYWJsZTtcbiAgfSgpKTtcbiAgLy8gUmV0dXJuIGFzIGFuIGFzeW5jIGl0ZXJhdG9yIHJlY29yZC5cbiAgY29uc3QgbmV4dE1ldGhvZCA9IGFzeW5jSXRlcmF0b3IubmV4dDtcbiAgcmV0dXJuIHsgaXRlcmF0b3I6IGFzeW5jSXRlcmF0b3IsIG5leHRNZXRob2QsIGRvbmU6IGZhbHNlIH07XG59XG5cbi8vIEFsaWducyB3aXRoIGNvcmUtanMvbW9kdWxlcy9lcy5zeW1ib2wuYXN5bmMtaXRlcmF0b3IuanNcbmV4cG9ydCBjb25zdCBTeW1ib2xBc3luY0l0ZXJhdG9yOiAodHlwZW9mIFN5bWJvbClbJ2FzeW5jSXRlcmF0b3InXSA9XG4gIFN5bWJvbC5hc3luY0l0ZXJhdG9yID8/XG4gIFN5bWJvbC5mb3I/LignU3ltYm9sLmFzeW5jSXRlcmF0b3InKSA/P1xuICAnQEBhc3luY0l0ZXJhdG9yJztcblxuZXhwb3J0IHR5cGUgU3luY09yQXN5bmNJdGVyYWJsZTxUPiA9IEl0ZXJhYmxlPFQ+IHwgQXN5bmNJdGVyYWJsZTxUPjtcbmV4cG9ydCB0eXBlIFN5bmNPckFzeW5jSXRlcmF0b3JNZXRob2Q8VD4gPSAoKSA9PiAoSXRlcmF0b3I8VD4gfCBBc3luY0l0ZXJhdG9yPFQ+KTtcblxuZnVuY3Rpb24gR2V0SXRlcmF0b3I8VD4oXG4gIG9iajogU3luY09yQXN5bmNJdGVyYWJsZTxUPixcbiAgaGludDogJ2FzeW5jJyxcbiAgbWV0aG9kPzogU3luY09yQXN5bmNJdGVyYXRvck1ldGhvZDxUPlxuKTogQXN5bmNJdGVyYXRvclJlY29yZDxUPjtcbmZ1bmN0aW9uIEdldEl0ZXJhdG9yPFQ+KFxuICBvYmo6IEl0ZXJhYmxlPFQ+LFxuICBoaW50OiAnc3luYycsXG4gIG1ldGhvZD86IFN5bmNPckFzeW5jSXRlcmF0b3JNZXRob2Q8VD5cbik6IFN5bmNJdGVyYXRvclJlY29yZDxUPjtcbmZ1bmN0aW9uIEdldEl0ZXJhdG9yPFQ+KFxuICBvYmo6IFN5bmNPckFzeW5jSXRlcmFibGU8VD4sXG4gIGhpbnQgPSAnc3luYycsXG4gIG1ldGhvZD86IFN5bmNPckFzeW5jSXRlcmF0b3JNZXRob2Q8VD5cbik6IFN5bmNPckFzeW5jSXRlcmF0b3JSZWNvcmQ8VD4ge1xuICBhc3NlcnQoaGludCA9PT0gJ3N5bmMnIHx8IGhpbnQgPT09ICdhc3luYycpO1xuICBpZiAobWV0aG9kID09PSB1bmRlZmluZWQpIHtcbiAgICBpZiAoaGludCA9PT0gJ2FzeW5jJykge1xuICAgICAgbWV0aG9kID0gR2V0TWV0aG9kKG9iaiBhcyBBc3luY0l0ZXJhYmxlPFQ+LCBTeW1ib2xBc3luY0l0ZXJhdG9yKTtcbiAgICAgIGlmIChtZXRob2QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb25zdCBzeW5jTWV0aG9kID0gR2V0TWV0aG9kKG9iaiBhcyBJdGVyYWJsZTxUPiwgU3ltYm9sLml0ZXJhdG9yKTtcbiAgICAgICAgY29uc3Qgc3luY0l0ZXJhdG9yUmVjb3JkID0gR2V0SXRlcmF0b3Iob2JqIGFzIEl0ZXJhYmxlPFQ+LCAnc3luYycsIHN5bmNNZXRob2QpO1xuICAgICAgICByZXR1cm4gQ3JlYXRlQXN5bmNGcm9tU3luY0l0ZXJhdG9yKHN5bmNJdGVyYXRvclJlY29yZCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG1ldGhvZCA9IEdldE1ldGhvZChvYmogYXMgSXRlcmFibGU8VD4sIFN5bWJvbC5pdGVyYXRvcik7XG4gICAgfVxuICB9XG4gIGlmIChtZXRob2QgPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBvYmplY3QgaXMgbm90IGl0ZXJhYmxlJyk7XG4gIH1cbiAgY29uc3QgaXRlcmF0b3IgPSByZWZsZWN0Q2FsbChtZXRob2QsIG9iaiwgW10pO1xuICBpZiAoIXR5cGVJc09iamVjdChpdGVyYXRvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgaXRlcmF0b3IgbWV0aG9kIG11c3QgcmV0dXJuIGFuIG9iamVjdCcpO1xuICB9XG4gIGNvbnN0IG5leHRNZXRob2QgPSBpdGVyYXRvci5uZXh0O1xuICByZXR1cm4geyBpdGVyYXRvciwgbmV4dE1ldGhvZCwgZG9uZTogZmFsc2UgfSBhcyBTeW5jT3JBc3luY0l0ZXJhdG9yUmVjb3JkPFQ+O1xufVxuXG5leHBvcnQgeyBHZXRJdGVyYXRvciB9O1xuXG5leHBvcnQgZnVuY3Rpb24gSXRlcmF0b3JOZXh0PFQ+KGl0ZXJhdG9yUmVjb3JkOiBBc3luY0l0ZXJhdG9yUmVjb3JkPFQ+KTogUHJvbWlzZTxJdGVyYXRvclJlc3VsdDxUPj4ge1xuICBjb25zdCByZXN1bHQgPSByZWZsZWN0Q2FsbChpdGVyYXRvclJlY29yZC5uZXh0TWV0aG9kLCBpdGVyYXRvclJlY29yZC5pdGVyYXRvciwgW10pO1xuICBpZiAoIXR5cGVJc09iamVjdChyZXN1bHQpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIGl0ZXJhdG9yLm5leHQoKSBtZXRob2QgbXVzdCByZXR1cm4gYW4gb2JqZWN0Jyk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEl0ZXJhdG9yQ29tcGxldGU8VFJldHVybj4oXG4gIGl0ZXJSZXN1bHQ6IEl0ZXJhdG9yUmVzdWx0PHVua25vd24sIFRSZXR1cm4+XG4pOiBpdGVyUmVzdWx0IGlzIEl0ZXJhdG9yUmV0dXJuUmVzdWx0PFRSZXR1cm4+IHtcbiAgYXNzZXJ0KHR5cGVJc09iamVjdChpdGVyUmVzdWx0KSk7XG4gIHJldHVybiBCb29sZWFuKGl0ZXJSZXN1bHQuZG9uZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBJdGVyYXRvclZhbHVlPFQ+KGl0ZXJSZXN1bHQ6IEl0ZXJhdG9yWWllbGRSZXN1bHQ8VD4pOiBUIHtcbiAgYXNzZXJ0KHR5cGVJc09iamVjdChpdGVyUmVzdWx0KSk7XG4gIHJldHVybiBpdGVyUmVzdWx0LnZhbHVlO1xufVxuIiwgImltcG9ydCBOdW1iZXJJc05hTiBmcm9tICcuLi8uLi9zdHViL251bWJlci1pc25hbic7XG5pbXBvcnQgeyBBcnJheUJ1ZmZlclNsaWNlIH0gZnJvbSAnLi9lY21hc2NyaXB0JztcbmltcG9ydCB0eXBlIHsgTm9uU2hhcmVkIH0gZnJvbSAnLi4vaGVscGVycy9hcnJheS1idWZmZXItdmlldyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBJc05vbk5lZ2F0aXZlTnVtYmVyKHY6IG51bWJlcik6IGJvb2xlYW4ge1xuICBpZiAodHlwZW9mIHYgIT09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKE51bWJlcklzTmFOKHYpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKHYgPCAwKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBDbG9uZUFzVWludDhBcnJheShPOiBOb25TaGFyZWQ8QXJyYXlCdWZmZXJWaWV3Pik6IE5vblNoYXJlZDxVaW50OEFycmF5PiB7XG4gIGNvbnN0IGJ1ZmZlciA9IEFycmF5QnVmZmVyU2xpY2UoTy5idWZmZXIsIE8uYnl0ZU9mZnNldCwgTy5ieXRlT2Zmc2V0ICsgTy5ieXRlTGVuZ3RoKTtcbiAgcmV0dXJuIG5ldyBVaW50OEFycmF5KGJ1ZmZlcikgYXMgTm9uU2hhcmVkPFVpbnQ4QXJyYXk+O1xufVxuIiwgImltcG9ydCBhc3NlcnQgZnJvbSAnLi4vLi4vc3R1Yi9hc3NlcnQnO1xuaW1wb3J0IHsgU2ltcGxlUXVldWUgfSBmcm9tICcuLi9zaW1wbGUtcXVldWUnO1xuaW1wb3J0IHsgSXNOb25OZWdhdGl2ZU51bWJlciB9IGZyb20gJy4vbWlzY2VsbGFuZW91cyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUXVldWVDb250YWluZXI8VD4ge1xuICBfcXVldWU6IFNpbXBsZVF1ZXVlPFQ+O1xuICBfcXVldWVUb3RhbFNpemU6IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBRdWV1ZVBhaXI8VD4ge1xuICB2YWx1ZTogVDtcbiAgc2l6ZTogbnVtYmVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gRGVxdWV1ZVZhbHVlPFQ+KGNvbnRhaW5lcjogUXVldWVDb250YWluZXI8UXVldWVQYWlyPFQ+Pik6IFQge1xuICBhc3NlcnQoJ19xdWV1ZScgaW4gY29udGFpbmVyICYmICdfcXVldWVUb3RhbFNpemUnIGluIGNvbnRhaW5lcik7XG4gIGFzc2VydChjb250YWluZXIuX3F1ZXVlLmxlbmd0aCA+IDApO1xuXG4gIGNvbnN0IHBhaXIgPSBjb250YWluZXIuX3F1ZXVlLnNoaWZ0KCkhO1xuICBjb250YWluZXIuX3F1ZXVlVG90YWxTaXplIC09IHBhaXIuc2l6ZTtcbiAgaWYgKGNvbnRhaW5lci5fcXVldWVUb3RhbFNpemUgPCAwKSB7XG4gICAgY29udGFpbmVyLl9xdWV1ZVRvdGFsU2l6ZSA9IDA7XG4gIH1cblxuICByZXR1cm4gcGFpci52YWx1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEVucXVldWVWYWx1ZVdpdGhTaXplPFQ+KGNvbnRhaW5lcjogUXVldWVDb250YWluZXI8UXVldWVQYWlyPFQ+PiwgdmFsdWU6IFQsIHNpemU6IG51bWJlcikge1xuICBhc3NlcnQoJ19xdWV1ZScgaW4gY29udGFpbmVyICYmICdfcXVldWVUb3RhbFNpemUnIGluIGNvbnRhaW5lcik7XG5cbiAgaWYgKCFJc05vbk5lZ2F0aXZlTnVtYmVyKHNpemUpIHx8IHNpemUgPT09IEluZmluaXR5KSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1NpemUgbXVzdCBiZSBhIGZpbml0ZSwgbm9uLU5hTiwgbm9uLW5lZ2F0aXZlIG51bWJlci4nKTtcbiAgfVxuXG4gIGNvbnRhaW5lci5fcXVldWUucHVzaCh7IHZhbHVlLCBzaXplIH0pO1xuICBjb250YWluZXIuX3F1ZXVlVG90YWxTaXplICs9IHNpemU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBQZWVrUXVldWVWYWx1ZTxUPihjb250YWluZXI6IFF1ZXVlQ29udGFpbmVyPFF1ZXVlUGFpcjxUPj4pOiBUIHtcbiAgYXNzZXJ0KCdfcXVldWUnIGluIGNvbnRhaW5lciAmJiAnX3F1ZXVlVG90YWxTaXplJyBpbiBjb250YWluZXIpO1xuICBhc3NlcnQoY29udGFpbmVyLl9xdWV1ZS5sZW5ndGggPiAwKTtcblxuICBjb25zdCBwYWlyID0gY29udGFpbmVyLl9xdWV1ZS5wZWVrKCk7XG4gIHJldHVybiBwYWlyLnZhbHVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVzZXRRdWV1ZTxUPihjb250YWluZXI6IFF1ZXVlQ29udGFpbmVyPFQ+KSB7XG4gIGFzc2VydCgnX3F1ZXVlJyBpbiBjb250YWluZXIgJiYgJ19xdWV1ZVRvdGFsU2l6ZScgaW4gY29udGFpbmVyKTtcblxuICBjb250YWluZXIuX3F1ZXVlID0gbmV3IFNpbXBsZVF1ZXVlPFQ+KCk7XG4gIGNvbnRhaW5lci5fcXVldWVUb3RhbFNpemUgPSAwO1xufVxuIiwgImV4cG9ydCB0eXBlIFR5cGVkQXJyYXkgPVxuICB8IEludDhBcnJheVxuICB8IFVpbnQ4QXJyYXlcbiAgfCBVaW50OENsYW1wZWRBcnJheVxuICB8IEludDE2QXJyYXlcbiAgfCBVaW50MTZBcnJheVxuICB8IEludDMyQXJyYXlcbiAgfCBVaW50MzJBcnJheVxuICB8IEZsb2F0MzJBcnJheVxuICB8IEZsb2F0NjRBcnJheTtcblxuZXhwb3J0IHR5cGUgTm9uU2hhcmVkPFQgZXh0ZW5kcyBBcnJheUJ1ZmZlclZpZXc+ID0gVCAmIHtcbiAgYnVmZmVyOiBBcnJheUJ1ZmZlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBcnJheUJ1ZmZlclZpZXdDb25zdHJ1Y3RvcjxUIGV4dGVuZHMgQXJyYXlCdWZmZXJWaWV3ID0gQXJyYXlCdWZmZXJWaWV3PiB7XG4gIG5ldyhidWZmZXI6IEFycmF5QnVmZmVyLCBieXRlT2Zmc2V0OiBudW1iZXIsIGxlbmd0aD86IG51bWJlcik6IFQ7XG5cbiAgcmVhZG9ubHkgcHJvdG90eXBlOiBUO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFR5cGVkQXJyYXlDb25zdHJ1Y3RvcjxUIGV4dGVuZHMgVHlwZWRBcnJheSA9IFR5cGVkQXJyYXk+IGV4dGVuZHMgQXJyYXlCdWZmZXJWaWV3Q29uc3RydWN0b3I8VD4ge1xuICByZWFkb25seSBCWVRFU19QRVJfRUxFTUVOVDogbnVtYmVyO1xufVxuXG5leHBvcnQgdHlwZSBEYXRhVmlld0NvbnN0cnVjdG9yID0gQXJyYXlCdWZmZXJWaWV3Q29uc3RydWN0b3I8RGF0YVZpZXc+O1xuXG5mdW5jdGlvbiBpc0RhdGFWaWV3Q29uc3RydWN0b3IoY3RvcjogRnVuY3Rpb24pOiBjdG9yIGlzIERhdGFWaWV3Q29uc3RydWN0b3Ige1xuICByZXR1cm4gY3RvciA9PT0gRGF0YVZpZXc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RhdGFWaWV3KHZpZXc6IEFycmF5QnVmZmVyVmlldyk6IHZpZXcgaXMgRGF0YVZpZXcge1xuICByZXR1cm4gaXNEYXRhVmlld0NvbnN0cnVjdG9yKHZpZXcuY29uc3RydWN0b3IpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXJyYXlCdWZmZXJWaWV3RWxlbWVudFNpemU8VCBleHRlbmRzIEFycmF5QnVmZmVyVmlldz4oY3RvcjogQXJyYXlCdWZmZXJWaWV3Q29uc3RydWN0b3I8VD4pOiBudW1iZXIge1xuICBpZiAoaXNEYXRhVmlld0NvbnN0cnVjdG9yKGN0b3IpKSB7XG4gICAgcmV0dXJuIDE7XG4gIH1cbiAgcmV0dXJuIChjdG9yIGFzIHVua25vd24gYXMgVHlwZWRBcnJheUNvbnN0cnVjdG9yKS5CWVRFU19QRVJfRUxFTUVOVDtcbn1cbiIsICJpbXBvcnQgYXNzZXJ0IGZyb20gJy4uLy4uL3N0dWIvYXNzZXJ0JztcbmltcG9ydCB7IFNpbXBsZVF1ZXVlIH0gZnJvbSAnLi4vc2ltcGxlLXF1ZXVlJztcbmltcG9ydCB7IFJlc2V0UXVldWUgfSBmcm9tICcuLi9hYnN0cmFjdC1vcHMvcXVldWUtd2l0aC1zaXplcyc7XG5pbXBvcnQge1xuICBJc1JlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcixcbiAgUmVhZGFibGVTdHJlYW1BZGRSZWFkUmVxdWVzdCxcbiAgUmVhZGFibGVTdHJlYW1GdWxmaWxsUmVhZFJlcXVlc3QsXG4gIFJlYWRhYmxlU3RyZWFtR2V0TnVtUmVhZFJlcXVlc3RzLFxuICBSZWFkYWJsZVN0cmVhbUhhc0RlZmF1bHRSZWFkZXIsXG4gIHR5cGUgUmVhZFJlcXVlc3Rcbn0gZnJvbSAnLi9kZWZhdWx0LXJlYWRlcic7XG5pbXBvcnQge1xuICBSZWFkYWJsZVN0cmVhbUFkZFJlYWRJbnRvUmVxdWVzdCxcbiAgUmVhZGFibGVTdHJlYW1GdWxmaWxsUmVhZEludG9SZXF1ZXN0LFxuICBSZWFkYWJsZVN0cmVhbUdldE51bVJlYWRJbnRvUmVxdWVzdHMsXG4gIFJlYWRhYmxlU3RyZWFtSGFzQllPQlJlYWRlcixcbiAgdHlwZSBSZWFkSW50b1JlcXVlc3Rcbn0gZnJvbSAnLi9ieW9iLXJlYWRlcic7XG5pbXBvcnQgTnVtYmVySXNJbnRlZ2VyIGZyb20gJy4uLy4uL3N0dWIvbnVtYmVyLWlzaW50ZWdlcic7XG5pbXBvcnQge1xuICBJc1JlYWRhYmxlU3RyZWFtTG9ja2VkLFxuICB0eXBlIFJlYWRhYmxlQnl0ZVN0cmVhbSxcbiAgUmVhZGFibGVTdHJlYW1DbG9zZSxcbiAgUmVhZGFibGVTdHJlYW1FcnJvclxufSBmcm9tICcuLi9yZWFkYWJsZS1zdHJlYW0nO1xuaW1wb3J0IHR5cGUgeyBWYWxpZGF0ZWRVbmRlcmx5aW5nQnl0ZVNvdXJjZSB9IGZyb20gJy4vdW5kZXJseWluZy1zb3VyY2UnO1xuaW1wb3J0IHsgc2V0RnVuY3Rpb25OYW1lLCB0eXBlSXNPYmplY3QgfSBmcm9tICcuLi9oZWxwZXJzL21pc2NlbGxhbmVvdXMnO1xuaW1wb3J0IHtcbiAgQXJyYXlCdWZmZXJTbGljZSxcbiAgQ2FuVHJhbnNmZXJBcnJheUJ1ZmZlcixcbiAgQ29weURhdGFCbG9ja0J5dGVzLFxuICBJc0RldGFjaGVkQnVmZmVyLFxuICBUcmFuc2ZlckFycmF5QnVmZmVyXG59IGZyb20gJy4uL2Fic3RyYWN0LW9wcy9lY21hc2NyaXB0JztcbmltcG9ydCB7IENhbmNlbFN0ZXBzLCBQdWxsU3RlcHMsIFJlbGVhc2VTdGVwcyB9IGZyb20gJy4uL2Fic3RyYWN0LW9wcy9pbnRlcm5hbC1tZXRob2RzJztcbmltcG9ydCB7IHByb21pc2VSZXNvbHZlZFdpdGgsIHVwb25Qcm9taXNlIH0gZnJvbSAnLi4vaGVscGVycy93ZWJpZGwnO1xuaW1wb3J0IHsgYXNzZXJ0UmVxdWlyZWRBcmd1bWVudCwgY29udmVydFVuc2lnbmVkTG9uZ0xvbmdXaXRoRW5mb3JjZVJhbmdlIH0gZnJvbSAnLi4vdmFsaWRhdG9ycy9iYXNpYyc7XG5pbXBvcnQge1xuICB0eXBlIEFycmF5QnVmZmVyVmlld0NvbnN0cnVjdG9yLFxuICBhcnJheUJ1ZmZlclZpZXdFbGVtZW50U2l6ZSxcbiAgdHlwZSBOb25TaGFyZWQsXG4gIHR5cGUgVHlwZWRBcnJheUNvbnN0cnVjdG9yXG59IGZyb20gJy4uL2hlbHBlcnMvYXJyYXktYnVmZmVyLXZpZXcnO1xuXG4vKipcbiAqIEEgcHVsbC1pbnRvIHJlcXVlc3QgaW4gYSB7QGxpbmsgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcn0uXG4gKlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY2xhc3MgUmVhZGFibGVTdHJlYW1CWU9CUmVxdWVzdCB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2Fzc29jaWF0ZWRSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyITogUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfdmlldyE6IE5vblNoYXJlZDxBcnJheUJ1ZmZlclZpZXc+IHwgbnVsbDtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0lsbGVnYWwgY29uc3RydWN0b3InKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB2aWV3IGZvciB3cml0aW5nIGluIHRvLCBvciBgbnVsbGAgaWYgdGhlIEJZT0IgcmVxdWVzdCBoYXMgYWxyZWFkeSBiZWVuIHJlc3BvbmRlZCB0by5cbiAgICovXG4gIGdldCB2aWV3KCk6IEFycmF5QnVmZmVyVmlldyB8IG51bGwge1xuICAgIGlmICghSXNSZWFkYWJsZVN0cmVhbUJZT0JSZXF1ZXN0KHRoaXMpKSB7XG4gICAgICB0aHJvdyBieW9iUmVxdWVzdEJyYW5kQ2hlY2tFeGNlcHRpb24oJ3ZpZXcnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fdmlldztcbiAgfVxuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgdG8gdGhlIGFzc29jaWF0ZWQgcmVhZGFibGUgYnl0ZSBzdHJlYW0gdGhhdCBgYnl0ZXNXcml0dGVuYCBieXRlcyB3ZXJlIHdyaXR0ZW4gaW50b1xuICAgKiB7QGxpbmsgUmVhZGFibGVTdHJlYW1CWU9CUmVxdWVzdC52aWV3IHwgdmlld30sIGNhdXNpbmcgdGhlIHJlc3VsdCBiZSBzdXJmYWNlZCB0byB0aGUgY29uc3VtZXIuXG4gICAqXG4gICAqIEFmdGVyIHRoaXMgbWV0aG9kIGlzIGNhbGxlZCwge0BsaW5rIFJlYWRhYmxlU3RyZWFtQllPQlJlcXVlc3QudmlldyB8IHZpZXd9IHdpbGwgYmUgdHJhbnNmZXJyZWQgYW5kIG5vIGxvbmdlclxuICAgKiBtb2RpZmlhYmxlLlxuICAgKi9cbiAgcmVzcG9uZChieXRlc1dyaXR0ZW46IG51bWJlcik6IHZvaWQ7XG4gIHJlc3BvbmQoYnl0ZXNXcml0dGVuOiBudW1iZXIgfCB1bmRlZmluZWQpOiB2b2lkIHtcbiAgICBpZiAoIUlzUmVhZGFibGVTdHJlYW1CWU9CUmVxdWVzdCh0aGlzKSkge1xuICAgICAgdGhyb3cgYnlvYlJlcXVlc3RCcmFuZENoZWNrRXhjZXB0aW9uKCdyZXNwb25kJyk7XG4gICAgfVxuICAgIGFzc2VydFJlcXVpcmVkQXJndW1lbnQoYnl0ZXNXcml0dGVuLCAxLCAncmVzcG9uZCcpO1xuICAgIGJ5dGVzV3JpdHRlbiA9IGNvbnZlcnRVbnNpZ25lZExvbmdMb25nV2l0aEVuZm9yY2VSYW5nZShieXRlc1dyaXR0ZW4sICdGaXJzdCBwYXJhbWV0ZXInKTtcblxuICAgIGlmICh0aGlzLl9hc3NvY2lhdGVkUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGlzIEJZT0IgcmVxdWVzdCBoYXMgYmVlbiBpbnZhbGlkYXRlZCcpO1xuICAgIH1cblxuICAgIGlmIChJc0RldGFjaGVkQnVmZmVyKHRoaXMuX3ZpZXchLmJ1ZmZlcikpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYFRoZSBCWU9CIHJlcXVlc3QncyBidWZmZXIgaGFzIGJlZW4gZGV0YWNoZWQgYW5kIHNvIGNhbm5vdCBiZSB1c2VkIGFzIGEgcmVzcG9uc2VgKTtcbiAgICB9XG5cbiAgICBhc3NlcnQodGhpcy5fdmlldyEuYnl0ZUxlbmd0aCA+IDApO1xuICAgIGFzc2VydCh0aGlzLl92aWV3IS5idWZmZXIuYnl0ZUxlbmd0aCA+IDApO1xuXG4gICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclJlc3BvbmQodGhpcy5fYXNzb2NpYXRlZFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIsIGJ5dGVzV3JpdHRlbik7XG4gIH1cblxuICAvKipcbiAgICogSW5kaWNhdGVzIHRvIHRoZSBhc3NvY2lhdGVkIHJlYWRhYmxlIGJ5dGUgc3RyZWFtIHRoYXQgaW5zdGVhZCBvZiB3cml0aW5nIGludG9cbiAgICoge0BsaW5rIFJlYWRhYmxlU3RyZWFtQllPQlJlcXVlc3QudmlldyB8IHZpZXd9LCB0aGUgdW5kZXJseWluZyBieXRlIHNvdXJjZSBpcyBwcm92aWRpbmcgYSBuZXcgYEFycmF5QnVmZmVyVmlld2AsXG4gICAqIHdoaWNoIHdpbGwgYmUgZ2l2ZW4gdG8gdGhlIGNvbnN1bWVyIG9mIHRoZSByZWFkYWJsZSBieXRlIHN0cmVhbS5cbiAgICpcbiAgICogQWZ0ZXIgdGhpcyBtZXRob2QgaXMgY2FsbGVkLCBgdmlld2Agd2lsbCBiZSB0cmFuc2ZlcnJlZCBhbmQgbm8gbG9uZ2VyIG1vZGlmaWFibGUuXG4gICAqL1xuICByZXNwb25kV2l0aE5ld1ZpZXcodmlldzogQXJyYXlCdWZmZXJWaWV3KTogdm9pZDtcbiAgcmVzcG9uZFdpdGhOZXdWaWV3KHZpZXc6IE5vblNoYXJlZDxBcnJheUJ1ZmZlclZpZXc+KTogdm9pZCB7XG4gICAgaWYgKCFJc1JlYWRhYmxlU3RyZWFtQllPQlJlcXVlc3QodGhpcykpIHtcbiAgICAgIHRocm93IGJ5b2JSZXF1ZXN0QnJhbmRDaGVja0V4Y2VwdGlvbigncmVzcG9uZFdpdGhOZXdWaWV3Jyk7XG4gICAgfVxuICAgIGFzc2VydFJlcXVpcmVkQXJndW1lbnQodmlldywgMSwgJ3Jlc3BvbmRXaXRoTmV3VmlldycpO1xuXG4gICAgaWYgKCFBcnJheUJ1ZmZlci5pc1ZpZXcodmlldykpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1lvdSBjYW4gb25seSByZXNwb25kIHdpdGggYXJyYXkgYnVmZmVyIHZpZXdzJyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2Fzc29jaWF0ZWRSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoaXMgQllPQiByZXF1ZXN0IGhhcyBiZWVuIGludmFsaWRhdGVkJyk7XG4gICAgfVxuXG4gICAgaWYgKElzRGV0YWNoZWRCdWZmZXIodmlldy5idWZmZXIpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgZ2l2ZW4gdmlld1xcJ3MgYnVmZmVyIGhhcyBiZWVuIGRldGFjaGVkIGFuZCBzbyBjYW5ub3QgYmUgdXNlZCBhcyBhIHJlc3BvbnNlJyk7XG4gICAgfVxuXG4gICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclJlc3BvbmRXaXRoTmV3Vmlldyh0aGlzLl9hc3NvY2lhdGVkUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlciwgdmlldyk7XG4gIH1cbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoUmVhZGFibGVTdHJlYW1CWU9CUmVxdWVzdC5wcm90b3R5cGUsIHtcbiAgcmVzcG9uZDogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIHJlc3BvbmRXaXRoTmV3VmlldzogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIHZpZXc6IHsgZW51bWVyYWJsZTogdHJ1ZSB9XG59KTtcbnNldEZ1bmN0aW9uTmFtZShSZWFkYWJsZVN0cmVhbUJZT0JSZXF1ZXN0LnByb3RvdHlwZS5yZXNwb25kLCAncmVzcG9uZCcpO1xuc2V0RnVuY3Rpb25OYW1lKFJlYWRhYmxlU3RyZWFtQllPQlJlcXVlc3QucHJvdG90eXBlLnJlc3BvbmRXaXRoTmV3VmlldywgJ3Jlc3BvbmRXaXRoTmV3VmlldycpO1xuaWYgKHR5cGVvZiBTeW1ib2wudG9TdHJpbmdUYWcgPT09ICdzeW1ib2wnKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSZWFkYWJsZVN0cmVhbUJZT0JSZXF1ZXN0LnByb3RvdHlwZSwgU3ltYm9sLnRvU3RyaW5nVGFnLCB7XG4gICAgdmFsdWU6ICdSZWFkYWJsZVN0cmVhbUJZT0JSZXF1ZXN0JyxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG59XG5cbmludGVyZmFjZSBCeXRlUXVldWVFbGVtZW50IHtcbiAgYnVmZmVyOiBBcnJheUJ1ZmZlcjtcbiAgYnl0ZU9mZnNldDogbnVtYmVyO1xuICBieXRlTGVuZ3RoOiBudW1iZXI7XG59XG5cbnR5cGUgUHVsbEludG9EZXNjcmlwdG9yPFQgZXh0ZW5kcyBOb25TaGFyZWQ8QXJyYXlCdWZmZXJWaWV3PiA9IE5vblNoYXJlZDxBcnJheUJ1ZmZlclZpZXc+PiA9XG4gIERlZmF1bHRQdWxsSW50b0Rlc2NyaXB0b3JcbiAgfCBCWU9CUHVsbEludG9EZXNjcmlwdG9yPFQ+O1xuXG5pbnRlcmZhY2UgRGVmYXVsdFB1bGxJbnRvRGVzY3JpcHRvciB7XG4gIGJ1ZmZlcjogQXJyYXlCdWZmZXI7XG4gIGJ1ZmZlckJ5dGVMZW5ndGg6IG51bWJlcjtcbiAgYnl0ZU9mZnNldDogbnVtYmVyO1xuICBieXRlTGVuZ3RoOiBudW1iZXI7XG4gIGJ5dGVzRmlsbGVkOiBudW1iZXI7XG4gIG1pbmltdW1GaWxsOiBudW1iZXI7XG4gIGVsZW1lbnRTaXplOiBudW1iZXI7XG4gIHZpZXdDb25zdHJ1Y3RvcjogVHlwZWRBcnJheUNvbnN0cnVjdG9yPFVpbnQ4QXJyYXk+O1xuICByZWFkZXJUeXBlOiAnZGVmYXVsdCcgfCAnbm9uZSc7XG59XG5cbmludGVyZmFjZSBCWU9CUHVsbEludG9EZXNjcmlwdG9yPFQgZXh0ZW5kcyBOb25TaGFyZWQ8QXJyYXlCdWZmZXJWaWV3PiA9IE5vblNoYXJlZDxBcnJheUJ1ZmZlclZpZXc+PiB7XG4gIGJ1ZmZlcjogQXJyYXlCdWZmZXI7XG4gIGJ1ZmZlckJ5dGVMZW5ndGg6IG51bWJlcjtcbiAgYnl0ZU9mZnNldDogbnVtYmVyO1xuICBieXRlTGVuZ3RoOiBudW1iZXI7XG4gIGJ5dGVzRmlsbGVkOiBudW1iZXI7XG4gIG1pbmltdW1GaWxsOiBudW1iZXI7XG4gIGVsZW1lbnRTaXplOiBudW1iZXI7XG4gIHZpZXdDb25zdHJ1Y3RvcjogQXJyYXlCdWZmZXJWaWV3Q29uc3RydWN0b3I8VD47XG4gIHJlYWRlclR5cGU6ICdieW9iJyB8ICdub25lJztcbn1cblxuLyoqXG4gKiBBbGxvd3MgY29udHJvbCBvZiBhIHtAbGluayBSZWFkYWJsZVN0cmVhbSB8IHJlYWRhYmxlIGJ5dGUgc3RyZWFtfSdzIHN0YXRlIGFuZCBpbnRlcm5hbCBxdWV1ZS5cbiAqXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjbGFzcyBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyIHtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfY29udHJvbGxlZFJlYWRhYmxlQnl0ZVN0cmVhbSE6IFJlYWRhYmxlQnl0ZVN0cmVhbTtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcXVldWUhOiBTaW1wbGVRdWV1ZTxCeXRlUXVldWVFbGVtZW50PjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcXVldWVUb3RhbFNpemUhOiBudW1iZXI7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3N0YXJ0ZWQhOiBib29sZWFuO1xuICAvKiogQGludGVybmFsICovXG4gIF9jbG9zZVJlcXVlc3RlZCE6IGJvb2xlYW47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3B1bGxBZ2FpbiE6IGJvb2xlYW47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3B1bGxpbmcgITogYm9vbGVhbjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfc3RyYXRlZ3lIV00hOiBudW1iZXI7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3B1bGxBbGdvcml0aG0hOiAoKSA9PiBQcm9taXNlPHZvaWQ+O1xuICAvKiogQGludGVybmFsICovXG4gIF9jYW5jZWxBbGdvcml0aG0hOiAocmVhc29uOiBhbnkpID0+IFByb21pc2U8dm9pZD47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2F1dG9BbGxvY2F0ZUNodW5rU2l6ZTogbnVtYmVyIHwgdW5kZWZpbmVkO1xuICAvKiogQGludGVybmFsICovXG4gIF9ieW9iUmVxdWVzdDogUmVhZGFibGVTdHJlYW1CWU9CUmVxdWVzdCB8IG51bGw7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3BlbmRpbmdQdWxsSW50b3MhOiBTaW1wbGVRdWV1ZTxQdWxsSW50b0Rlc2NyaXB0b3I+O1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IoKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSWxsZWdhbCBjb25zdHJ1Y3RvcicpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGN1cnJlbnQgQllPQiBwdWxsIHJlcXVlc3QsIG9yIGBudWxsYCBpZiB0aGVyZSBpc24ndCBvbmUuXG4gICAqL1xuICBnZXQgYnlvYlJlcXVlc3QoKTogUmVhZGFibGVTdHJlYW1CWU9CUmVxdWVzdCB8IG51bGwge1xuICAgIGlmICghSXNSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyKHRoaXMpKSB7XG4gICAgICB0aHJvdyBieXRlU3RyZWFtQ29udHJvbGxlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ2J5b2JSZXF1ZXN0Jyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJHZXRCWU9CUmVxdWVzdCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBkZXNpcmVkIHNpemUgdG8gZmlsbCB0aGUgY29udHJvbGxlZCBzdHJlYW0ncyBpbnRlcm5hbCBxdWV1ZS4gSXQgY2FuIGJlIG5lZ2F0aXZlLCBpZiB0aGUgcXVldWUgaXNcbiAgICogb3Zlci1mdWxsLiBBbiB1bmRlcmx5aW5nIGJ5dGUgc291cmNlIG91Z2h0IHRvIHVzZSB0aGlzIGluZm9ybWF0aW9uIHRvIGRldGVybWluZSB3aGVuIGFuZCBob3cgdG8gYXBwbHkgYmFja3ByZXNzdXJlLlxuICAgKi9cbiAgZ2V0IGRlc2lyZWRTaXplKCk6IG51bWJlciB8IG51bGwge1xuICAgIGlmICghSXNSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyKHRoaXMpKSB7XG4gICAgICB0aHJvdyBieXRlU3RyZWFtQ29udHJvbGxlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ2Rlc2lyZWRTaXplJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJHZXREZXNpcmVkU2l6ZSh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbG9zZXMgdGhlIGNvbnRyb2xsZWQgcmVhZGFibGUgc3RyZWFtLiBDb25zdW1lcnMgd2lsbCBzdGlsbCBiZSBhYmxlIHRvIHJlYWQgYW55IHByZXZpb3VzbHktZW5xdWV1ZWQgY2h1bmtzIGZyb21cbiAgICogdGhlIHN0cmVhbSwgYnV0IG9uY2UgdGhvc2UgYXJlIHJlYWQsIHRoZSBzdHJlYW0gd2lsbCBiZWNvbWUgY2xvc2VkLlxuICAgKi9cbiAgY2xvc2UoKTogdm9pZCB7XG4gICAgaWYgKCFJc1JlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIodGhpcykpIHtcbiAgICAgIHRocm93IGJ5dGVTdHJlYW1Db250cm9sbGVyQnJhbmRDaGVja0V4Y2VwdGlvbignY2xvc2UnKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fY2xvc2VSZXF1ZXN0ZWQpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBzdHJlYW0gaGFzIGFscmVhZHkgYmVlbiBjbG9zZWQ7IGRvIG5vdCBjbG9zZSBpdCBhZ2FpbiEnKTtcbiAgICB9XG5cbiAgICBjb25zdCBzdGF0ZSA9IHRoaXMuX2NvbnRyb2xsZWRSZWFkYWJsZUJ5dGVTdHJlYW0uX3N0YXRlO1xuICAgIGlmIChzdGF0ZSAhPT0gJ3JlYWRhYmxlJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgVGhlIHN0cmVhbSAoaW4gJHtzdGF0ZX0gc3RhdGUpIGlzIG5vdCBpbiB0aGUgcmVhZGFibGUgc3RhdGUgYW5kIGNhbm5vdCBiZSBjbG9zZWRgKTtcbiAgICB9XG5cbiAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyQ2xvc2UodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogRW5xdWV1ZXMgdGhlIGdpdmVuIGNodW5rIGNodW5rIGluIHRoZSBjb250cm9sbGVkIHJlYWRhYmxlIHN0cmVhbS5cbiAgICogVGhlIGNodW5rIGhhcyB0byBiZSBhbiBgQXJyYXlCdWZmZXJWaWV3YCBpbnN0YW5jZSwgb3IgZWxzZSBhIGBUeXBlRXJyb3JgIHdpbGwgYmUgdGhyb3duLlxuICAgKi9cbiAgZW5xdWV1ZShjaHVuazogQXJyYXlCdWZmZXJWaWV3KTogdm9pZDtcbiAgZW5xdWV1ZShjaHVuazogTm9uU2hhcmVkPEFycmF5QnVmZmVyVmlldz4pOiB2b2lkIHtcbiAgICBpZiAoIUlzUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcih0aGlzKSkge1xuICAgICAgdGhyb3cgYnl0ZVN0cmVhbUNvbnRyb2xsZXJCcmFuZENoZWNrRXhjZXB0aW9uKCdlbnF1ZXVlJyk7XG4gICAgfVxuXG4gICAgYXNzZXJ0UmVxdWlyZWRBcmd1bWVudChjaHVuaywgMSwgJ2VucXVldWUnKTtcbiAgICBpZiAoIUFycmF5QnVmZmVyLmlzVmlldyhjaHVuaykpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2NodW5rIG11c3QgYmUgYW4gYXJyYXkgYnVmZmVyIHZpZXcnKTtcbiAgICB9XG4gICAgaWYgKGNodW5rLmJ5dGVMZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2NodW5rIG11c3QgaGF2ZSBub24temVybyBieXRlTGVuZ3RoJyk7XG4gICAgfVxuICAgIGlmIChjaHVuay5idWZmZXIuYnl0ZUxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgY2h1bmsncyBidWZmZXIgbXVzdCBoYXZlIG5vbi16ZXJvIGJ5dGVMZW5ndGhgKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fY2xvc2VSZXF1ZXN0ZWQpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3N0cmVhbSBpcyBjbG9zZWQgb3IgZHJhaW5pbmcnKTtcbiAgICB9XG5cbiAgICBjb25zdCBzdGF0ZSA9IHRoaXMuX2NvbnRyb2xsZWRSZWFkYWJsZUJ5dGVTdHJlYW0uX3N0YXRlO1xuICAgIGlmIChzdGF0ZSAhPT0gJ3JlYWRhYmxlJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgVGhlIHN0cmVhbSAoaW4gJHtzdGF0ZX0gc3RhdGUpIGlzIG5vdCBpbiB0aGUgcmVhZGFibGUgc3RhdGUgYW5kIGNhbm5vdCBiZSBlbnF1ZXVlZCB0b2ApO1xuICAgIH1cblxuICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJFbnF1ZXVlKHRoaXMsIGNodW5rKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFcnJvcnMgdGhlIGNvbnRyb2xsZWQgcmVhZGFibGUgc3RyZWFtLCBtYWtpbmcgYWxsIGZ1dHVyZSBpbnRlcmFjdGlvbnMgd2l0aCBpdCBmYWlsIHdpdGggdGhlIGdpdmVuIGVycm9yIGBlYC5cbiAgICovXG4gIGVycm9yKGU6IGFueSA9IHVuZGVmaW5lZCk6IHZvaWQge1xuICAgIGlmICghSXNSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyKHRoaXMpKSB7XG4gICAgICB0aHJvdyBieXRlU3RyZWFtQ29udHJvbGxlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ2Vycm9yJyk7XG4gICAgfVxuXG4gICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVycm9yKHRoaXMsIGUpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBbQ2FuY2VsU3RlcHNdKHJlYXNvbjogYW55KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckNsZWFyUGVuZGluZ1B1bGxJbnRvcyh0aGlzKTtcblxuICAgIFJlc2V0UXVldWUodGhpcyk7XG5cbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLl9jYW5jZWxBbGdvcml0aG0ocmVhc29uKTtcbiAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyQ2xlYXJBbGdvcml0aG1zKHRoaXMpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIFtQdWxsU3RlcHNdKHJlYWRSZXF1ZXN0OiBSZWFkUmVxdWVzdDxOb25TaGFyZWQ8VWludDhBcnJheT4+KTogdm9pZCB7XG4gICAgY29uc3Qgc3RyZWFtID0gdGhpcy5fY29udHJvbGxlZFJlYWRhYmxlQnl0ZVN0cmVhbTtcbiAgICBhc3NlcnQoUmVhZGFibGVTdHJlYW1IYXNEZWZhdWx0UmVhZGVyKHN0cmVhbSkpO1xuXG4gICAgaWYgKHRoaXMuX3F1ZXVlVG90YWxTaXplID4gMCkge1xuICAgICAgYXNzZXJ0KFJlYWRhYmxlU3RyZWFtR2V0TnVtUmVhZFJlcXVlc3RzKHN0cmVhbSkgPT09IDApO1xuXG4gICAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRmlsbFJlYWRSZXF1ZXN0RnJvbVF1ZXVlKHRoaXMsIHJlYWRSZXF1ZXN0KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBhdXRvQWxsb2NhdGVDaHVua1NpemUgPSB0aGlzLl9hdXRvQWxsb2NhdGVDaHVua1NpemU7XG4gICAgaWYgKGF1dG9BbGxvY2F0ZUNodW5rU2l6ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBsZXQgYnVmZmVyOiBBcnJheUJ1ZmZlcjtcbiAgICAgIHRyeSB7XG4gICAgICAgIGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcihhdXRvQWxsb2NhdGVDaHVua1NpemUpO1xuICAgICAgfSBjYXRjaCAoYnVmZmVyRSkge1xuICAgICAgICByZWFkUmVxdWVzdC5fZXJyb3JTdGVwcyhidWZmZXJFKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBwdWxsSW50b0Rlc2NyaXB0b3I6IERlZmF1bHRQdWxsSW50b0Rlc2NyaXB0b3IgPSB7XG4gICAgICAgIGJ1ZmZlcixcbiAgICAgICAgYnVmZmVyQnl0ZUxlbmd0aDogYXV0b0FsbG9jYXRlQ2h1bmtTaXplLFxuICAgICAgICBieXRlT2Zmc2V0OiAwLFxuICAgICAgICBieXRlTGVuZ3RoOiBhdXRvQWxsb2NhdGVDaHVua1NpemUsXG4gICAgICAgIGJ5dGVzRmlsbGVkOiAwLFxuICAgICAgICBtaW5pbXVtRmlsbDogMSxcbiAgICAgICAgZWxlbWVudFNpemU6IDEsXG4gICAgICAgIHZpZXdDb25zdHJ1Y3RvcjogVWludDhBcnJheSxcbiAgICAgICAgcmVhZGVyVHlwZTogJ2RlZmF1bHQnXG4gICAgICB9O1xuXG4gICAgICB0aGlzLl9wZW5kaW5nUHVsbEludG9zLnB1c2gocHVsbEludG9EZXNjcmlwdG9yKTtcbiAgICB9XG5cbiAgICBSZWFkYWJsZVN0cmVhbUFkZFJlYWRSZXF1ZXN0KHN0cmVhbSwgcmVhZFJlcXVlc3QpO1xuICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJDYWxsUHVsbElmTmVlZGVkKHRoaXMpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBbUmVsZWFzZVN0ZXBzXSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fcGVuZGluZ1B1bGxJbnRvcy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBmaXJzdFB1bGxJbnRvID0gdGhpcy5fcGVuZGluZ1B1bGxJbnRvcy5wZWVrKCk7XG4gICAgICBmaXJzdFB1bGxJbnRvLnJlYWRlclR5cGUgPSAnbm9uZSc7XG5cbiAgICAgIHRoaXMuX3BlbmRpbmdQdWxsSW50b3MgPSBuZXcgU2ltcGxlUXVldWUoKTtcbiAgICAgIHRoaXMuX3BlbmRpbmdQdWxsSW50b3MucHVzaChmaXJzdFB1bGxJbnRvKTtcbiAgICB9XG4gIH1cbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlci5wcm90b3R5cGUsIHtcbiAgY2xvc2U6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICBlbnF1ZXVlOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgZXJyb3I6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICBieW9iUmVxdWVzdDogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIGRlc2lyZWRTaXplOiB7IGVudW1lcmFibGU6IHRydWUgfVxufSk7XG5zZXRGdW5jdGlvbk5hbWUoUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlci5wcm90b3R5cGUuY2xvc2UsICdjbG9zZScpO1xuc2V0RnVuY3Rpb25OYW1lKFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIucHJvdG90eXBlLmVucXVldWUsICdlbnF1ZXVlJyk7XG5zZXRGdW5jdGlvbk5hbWUoUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlci5wcm90b3R5cGUuZXJyb3IsICdlcnJvcicpO1xuaWYgKHR5cGVvZiBTeW1ib2wudG9TdHJpbmdUYWcgPT09ICdzeW1ib2wnKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyLnByb3RvdHlwZSwgU3ltYm9sLnRvU3RyaW5nVGFnLCB7XG4gICAgdmFsdWU6ICdSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyJyxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG59XG5cbi8vIEFic3RyYWN0IG9wZXJhdGlvbnMgZm9yIHRoZSBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyLlxuXG5leHBvcnQgZnVuY3Rpb24gSXNSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyKHg6IGFueSk6IHggaXMgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlciB7XG4gIGlmICghdHlwZUlzT2JqZWN0KHgpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoeCwgJ19jb250cm9sbGVkUmVhZGFibGVCeXRlU3RyZWFtJykpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4geCBpbnN0YW5jZW9mIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXI7XG59XG5cbmZ1bmN0aW9uIElzUmVhZGFibGVTdHJlYW1CWU9CUmVxdWVzdCh4OiBhbnkpOiB4IGlzIFJlYWRhYmxlU3RyZWFtQllPQlJlcXVlc3Qge1xuICBpZiAoIXR5cGVJc09iamVjdCh4KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHgsICdfYXNzb2NpYXRlZFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXInKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB4IGluc3RhbmNlb2YgUmVhZGFibGVTdHJlYW1CWU9CUmVxdWVzdDtcbn1cblxuZnVuY3Rpb24gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckNhbGxQdWxsSWZOZWVkZWQoY29udHJvbGxlcjogUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcik6IHZvaWQge1xuICBjb25zdCBzaG91bGRQdWxsID0gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclNob3VsZENhbGxQdWxsKGNvbnRyb2xsZXIpO1xuICBpZiAoIXNob3VsZFB1bGwpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoY29udHJvbGxlci5fcHVsbGluZykge1xuICAgIGNvbnRyb2xsZXIuX3B1bGxBZ2FpbiA9IHRydWU7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgYXNzZXJ0KCFjb250cm9sbGVyLl9wdWxsQWdhaW4pO1xuXG4gIGNvbnRyb2xsZXIuX3B1bGxpbmcgPSB0cnVlO1xuXG4gIC8vIFRPRE86IFRlc3QgY29udHJvbGxlciBhcmd1bWVudFxuICBjb25zdCBwdWxsUHJvbWlzZSA9IGNvbnRyb2xsZXIuX3B1bGxBbGdvcml0aG0oKTtcbiAgdXBvblByb21pc2UoXG4gICAgcHVsbFByb21pc2UsXG4gICAgKCkgPT4ge1xuICAgICAgY29udHJvbGxlci5fcHVsbGluZyA9IGZhbHNlO1xuXG4gICAgICBpZiAoY29udHJvbGxlci5fcHVsbEFnYWluKSB7XG4gICAgICAgIGNvbnRyb2xsZXIuX3B1bGxBZ2FpbiA9IGZhbHNlO1xuICAgICAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyQ2FsbFB1bGxJZk5lZWRlZChjb250cm9sbGVyKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcbiAgICBlID0+IHtcbiAgICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJFcnJvcihjb250cm9sbGVyLCBlKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgKTtcbn1cblxuZnVuY3Rpb24gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckNsZWFyUGVuZGluZ1B1bGxJbnRvcyhjb250cm9sbGVyOiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyKSB7XG4gIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJJbnZhbGlkYXRlQllPQlJlcXVlc3QoY29udHJvbGxlcik7XG4gIGNvbnRyb2xsZXIuX3BlbmRpbmdQdWxsSW50b3MgPSBuZXcgU2ltcGxlUXVldWUoKTtcbn1cblxuZnVuY3Rpb24gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckNvbW1pdFB1bGxJbnRvRGVzY3JpcHRvcjxUIGV4dGVuZHMgTm9uU2hhcmVkPEFycmF5QnVmZmVyVmlldz4+KFxuICBzdHJlYW06IFJlYWRhYmxlQnl0ZVN0cmVhbSxcbiAgcHVsbEludG9EZXNjcmlwdG9yOiBQdWxsSW50b0Rlc2NyaXB0b3I8VD5cbikge1xuICBhc3NlcnQoc3RyZWFtLl9zdGF0ZSAhPT0gJ2Vycm9yZWQnKTtcbiAgYXNzZXJ0KHB1bGxJbnRvRGVzY3JpcHRvci5yZWFkZXJUeXBlICE9PSAnbm9uZScpO1xuXG4gIGxldCBkb25lID0gZmFsc2U7XG4gIGlmIChzdHJlYW0uX3N0YXRlID09PSAnY2xvc2VkJykge1xuICAgIGFzc2VydChwdWxsSW50b0Rlc2NyaXB0b3IuYnl0ZXNGaWxsZWQgJSBwdWxsSW50b0Rlc2NyaXB0b3IuZWxlbWVudFNpemUgPT09IDApO1xuICAgIGRvbmUgPSB0cnVlO1xuICB9XG5cbiAgY29uc3QgZmlsbGVkVmlldyA9IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJDb252ZXJ0UHVsbEludG9EZXNjcmlwdG9yPFQ+KHB1bGxJbnRvRGVzY3JpcHRvcik7XG4gIGlmIChwdWxsSW50b0Rlc2NyaXB0b3IucmVhZGVyVHlwZSA9PT0gJ2RlZmF1bHQnKSB7XG4gICAgUmVhZGFibGVTdHJlYW1GdWxmaWxsUmVhZFJlcXVlc3Qoc3RyZWFtLCBmaWxsZWRWaWV3IGFzIHVua25vd24gYXMgTm9uU2hhcmVkPFVpbnQ4QXJyYXk+LCBkb25lKTtcbiAgfSBlbHNlIHtcbiAgICBhc3NlcnQocHVsbEludG9EZXNjcmlwdG9yLnJlYWRlclR5cGUgPT09ICdieW9iJyk7XG4gICAgUmVhZGFibGVTdHJlYW1GdWxmaWxsUmVhZEludG9SZXF1ZXN0KHN0cmVhbSwgZmlsbGVkVmlldywgZG9uZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckNvbnZlcnRQdWxsSW50b0Rlc2NyaXB0b3I8VCBleHRlbmRzIE5vblNoYXJlZDxBcnJheUJ1ZmZlclZpZXc+PihcbiAgcHVsbEludG9EZXNjcmlwdG9yOiBQdWxsSW50b0Rlc2NyaXB0b3I8VD5cbik6IFQge1xuICBjb25zdCBieXRlc0ZpbGxlZCA9IHB1bGxJbnRvRGVzY3JpcHRvci5ieXRlc0ZpbGxlZDtcbiAgY29uc3QgZWxlbWVudFNpemUgPSBwdWxsSW50b0Rlc2NyaXB0b3IuZWxlbWVudFNpemU7XG5cbiAgYXNzZXJ0KGJ5dGVzRmlsbGVkIDw9IHB1bGxJbnRvRGVzY3JpcHRvci5ieXRlTGVuZ3RoKTtcbiAgYXNzZXJ0KGJ5dGVzRmlsbGVkICUgZWxlbWVudFNpemUgPT09IDApO1xuXG4gIHJldHVybiBuZXcgcHVsbEludG9EZXNjcmlwdG9yLnZpZXdDb25zdHJ1Y3RvcihcbiAgICBwdWxsSW50b0Rlc2NyaXB0b3IuYnVmZmVyLCBwdWxsSW50b0Rlc2NyaXB0b3IuYnl0ZU9mZnNldCwgYnl0ZXNGaWxsZWQgLyBlbGVtZW50U2l6ZSkgYXMgVDtcbn1cblxuZnVuY3Rpb24gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVucXVldWVDaHVua1RvUXVldWUoY29udHJvbGxlcjogUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlcjogQXJyYXlCdWZmZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBieXRlT2Zmc2V0OiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBieXRlTGVuZ3RoOiBudW1iZXIpIHtcbiAgY29udHJvbGxlci5fcXVldWUucHVzaCh7IGJ1ZmZlciwgYnl0ZU9mZnNldCwgYnl0ZUxlbmd0aCB9KTtcbiAgY29udHJvbGxlci5fcXVldWVUb3RhbFNpemUgKz0gYnl0ZUxlbmd0aDtcbn1cblxuZnVuY3Rpb24gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVucXVldWVDbG9uZWRDaHVua1RvUXVldWUoY29udHJvbGxlcjogUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlcjogQXJyYXlCdWZmZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBieXRlT2Zmc2V0OiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBieXRlTGVuZ3RoOiBudW1iZXIpIHtcbiAgbGV0IGNsb25lZENodW5rO1xuICB0cnkge1xuICAgIGNsb25lZENodW5rID0gQXJyYXlCdWZmZXJTbGljZShidWZmZXIsIGJ5dGVPZmZzZXQsIGJ5dGVPZmZzZXQgKyBieXRlTGVuZ3RoKTtcbiAgfSBjYXRjaCAoY2xvbmVFKSB7XG4gICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVycm9yKGNvbnRyb2xsZXIsIGNsb25lRSk7XG4gICAgdGhyb3cgY2xvbmVFO1xuICB9XG4gIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJFbnF1ZXVlQ2h1bmtUb1F1ZXVlKGNvbnRyb2xsZXIsIGNsb25lZENodW5rLCAwLCBieXRlTGVuZ3RoKTtcbn1cblxuZnVuY3Rpb24gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVucXVldWVEZXRhY2hlZFB1bGxJbnRvVG9RdWV1ZShjb250cm9sbGVyOiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaXJzdERlc2NyaXB0b3I6IFB1bGxJbnRvRGVzY3JpcHRvcikge1xuICBhc3NlcnQoZmlyc3REZXNjcmlwdG9yLnJlYWRlclR5cGUgPT09ICdub25lJyk7XG4gIGlmIChmaXJzdERlc2NyaXB0b3IuYnl0ZXNGaWxsZWQgPiAwKSB7XG4gICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVucXVldWVDbG9uZWRDaHVua1RvUXVldWUoXG4gICAgICBjb250cm9sbGVyLFxuICAgICAgZmlyc3REZXNjcmlwdG9yLmJ1ZmZlcixcbiAgICAgIGZpcnN0RGVzY3JpcHRvci5ieXRlT2Zmc2V0LFxuICAgICAgZmlyc3REZXNjcmlwdG9yLmJ5dGVzRmlsbGVkXG4gICAgKTtcbiAgfVxuICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyU2hpZnRQZW5kaW5nUHVsbEludG8oY29udHJvbGxlcik7XG59XG5cbmZ1bmN0aW9uIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJGaWxsUHVsbEludG9EZXNjcmlwdG9yRnJvbVF1ZXVlKGNvbnRyb2xsZXI6IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwdWxsSW50b0Rlc2NyaXB0b3I6IFB1bGxJbnRvRGVzY3JpcHRvcikge1xuICBjb25zdCBtYXhCeXRlc1RvQ29weSA9IE1hdGgubWluKGNvbnRyb2xsZXIuX3F1ZXVlVG90YWxTaXplLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHB1bGxJbnRvRGVzY3JpcHRvci5ieXRlTGVuZ3RoIC0gcHVsbEludG9EZXNjcmlwdG9yLmJ5dGVzRmlsbGVkKTtcbiAgY29uc3QgbWF4Qnl0ZXNGaWxsZWQgPSBwdWxsSW50b0Rlc2NyaXB0b3IuYnl0ZXNGaWxsZWQgKyBtYXhCeXRlc1RvQ29weTtcblxuICBsZXQgdG90YWxCeXRlc1RvQ29weVJlbWFpbmluZyA9IG1heEJ5dGVzVG9Db3B5O1xuICBsZXQgcmVhZHkgPSBmYWxzZTtcbiAgYXNzZXJ0KHB1bGxJbnRvRGVzY3JpcHRvci5ieXRlc0ZpbGxlZCA8IHB1bGxJbnRvRGVzY3JpcHRvci5taW5pbXVtRmlsbCk7XG4gIGNvbnN0IHJlbWFpbmRlckJ5dGVzID0gbWF4Qnl0ZXNGaWxsZWQgJSBwdWxsSW50b0Rlc2NyaXB0b3IuZWxlbWVudFNpemU7XG4gIGNvbnN0IG1heEFsaWduZWRCeXRlcyA9IG1heEJ5dGVzRmlsbGVkIC0gcmVtYWluZGVyQnl0ZXM7XG4gIC8vIEEgZGVzY3JpcHRvciBmb3IgYSByZWFkKCkgcmVxdWVzdCB0aGF0IGlzIG5vdCB5ZXQgZmlsbGVkIHVwIHRvIGl0cyBtaW5pbXVtIGxlbmd0aCB3aWxsIHN0YXkgYXQgdGhlIGhlYWRcbiAgLy8gb2YgdGhlIHF1ZXVlLCBzbyB0aGUgdW5kZXJseWluZyBzb3VyY2UgY2FuIGtlZXAgZmlsbGluZyBpdC5cbiAgaWYgKG1heEFsaWduZWRCeXRlcyA+PSBwdWxsSW50b0Rlc2NyaXB0b3IubWluaW11bUZpbGwpIHtcbiAgICB0b3RhbEJ5dGVzVG9Db3B5UmVtYWluaW5nID0gbWF4QWxpZ25lZEJ5dGVzIC0gcHVsbEludG9EZXNjcmlwdG9yLmJ5dGVzRmlsbGVkO1xuICAgIHJlYWR5ID0gdHJ1ZTtcbiAgfVxuXG4gIGNvbnN0IHF1ZXVlID0gY29udHJvbGxlci5fcXVldWU7XG5cbiAgd2hpbGUgKHRvdGFsQnl0ZXNUb0NvcHlSZW1haW5pbmcgPiAwKSB7XG4gICAgY29uc3QgaGVhZE9mUXVldWUgPSBxdWV1ZS5wZWVrKCk7XG5cbiAgICBjb25zdCBieXRlc1RvQ29weSA9IE1hdGgubWluKHRvdGFsQnl0ZXNUb0NvcHlSZW1haW5pbmcsIGhlYWRPZlF1ZXVlLmJ5dGVMZW5ndGgpO1xuXG4gICAgY29uc3QgZGVzdFN0YXJ0ID0gcHVsbEludG9EZXNjcmlwdG9yLmJ5dGVPZmZzZXQgKyBwdWxsSW50b0Rlc2NyaXB0b3IuYnl0ZXNGaWxsZWQ7XG4gICAgQ29weURhdGFCbG9ja0J5dGVzKHB1bGxJbnRvRGVzY3JpcHRvci5idWZmZXIsIGRlc3RTdGFydCwgaGVhZE9mUXVldWUuYnVmZmVyLCBoZWFkT2ZRdWV1ZS5ieXRlT2Zmc2V0LCBieXRlc1RvQ29weSk7XG5cbiAgICBpZiAoaGVhZE9mUXVldWUuYnl0ZUxlbmd0aCA9PT0gYnl0ZXNUb0NvcHkpIHtcbiAgICAgIHF1ZXVlLnNoaWZ0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhlYWRPZlF1ZXVlLmJ5dGVPZmZzZXQgKz0gYnl0ZXNUb0NvcHk7XG4gICAgICBoZWFkT2ZRdWV1ZS5ieXRlTGVuZ3RoIC09IGJ5dGVzVG9Db3B5O1xuICAgIH1cbiAgICBjb250cm9sbGVyLl9xdWV1ZVRvdGFsU2l6ZSAtPSBieXRlc1RvQ29weTtcblxuICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJGaWxsSGVhZFB1bGxJbnRvRGVzY3JpcHRvcihjb250cm9sbGVyLCBieXRlc1RvQ29weSwgcHVsbEludG9EZXNjcmlwdG9yKTtcblxuICAgIHRvdGFsQnl0ZXNUb0NvcHlSZW1haW5pbmcgLT0gYnl0ZXNUb0NvcHk7XG4gIH1cblxuICBpZiAoIXJlYWR5KSB7XG4gICAgYXNzZXJ0KGNvbnRyb2xsZXIuX3F1ZXVlVG90YWxTaXplID09PSAwKTtcbiAgICBhc3NlcnQocHVsbEludG9EZXNjcmlwdG9yLmJ5dGVzRmlsbGVkID4gMCk7XG4gICAgYXNzZXJ0KHB1bGxJbnRvRGVzY3JpcHRvci5ieXRlc0ZpbGxlZCA8IHB1bGxJbnRvRGVzY3JpcHRvci5taW5pbXVtRmlsbCk7XG4gIH1cblxuICByZXR1cm4gcmVhZHk7XG59XG5cbmZ1bmN0aW9uIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJGaWxsSGVhZFB1bGxJbnRvRGVzY3JpcHRvcihjb250cm9sbGVyOiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpemU6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwdWxsSW50b0Rlc2NyaXB0b3I6IFB1bGxJbnRvRGVzY3JpcHRvcikge1xuICBhc3NlcnQoY29udHJvbGxlci5fcGVuZGluZ1B1bGxJbnRvcy5sZW5ndGggPT09IDAgfHwgY29udHJvbGxlci5fcGVuZGluZ1B1bGxJbnRvcy5wZWVrKCkgPT09IHB1bGxJbnRvRGVzY3JpcHRvcik7XG4gIGFzc2VydChjb250cm9sbGVyLl9ieW9iUmVxdWVzdCA9PT0gbnVsbCk7XG4gIHB1bGxJbnRvRGVzY3JpcHRvci5ieXRlc0ZpbGxlZCArPSBzaXplO1xufVxuXG5mdW5jdGlvbiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVySGFuZGxlUXVldWVEcmFpbihjb250cm9sbGVyOiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyKSB7XG4gIGFzc2VydChjb250cm9sbGVyLl9jb250cm9sbGVkUmVhZGFibGVCeXRlU3RyZWFtLl9zdGF0ZSA9PT0gJ3JlYWRhYmxlJyk7XG5cbiAgaWYgKGNvbnRyb2xsZXIuX3F1ZXVlVG90YWxTaXplID09PSAwICYmIGNvbnRyb2xsZXIuX2Nsb3NlUmVxdWVzdGVkKSB7XG4gICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckNsZWFyQWxnb3JpdGhtcyhjb250cm9sbGVyKTtcbiAgICBSZWFkYWJsZVN0cmVhbUNsb3NlKGNvbnRyb2xsZXIuX2NvbnRyb2xsZWRSZWFkYWJsZUJ5dGVTdHJlYW0pO1xuICB9IGVsc2Uge1xuICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJDYWxsUHVsbElmTmVlZGVkKGNvbnRyb2xsZXIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJJbnZhbGlkYXRlQllPQlJlcXVlc3QoY29udHJvbGxlcjogUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcikge1xuICBpZiAoY29udHJvbGxlci5fYnlvYlJlcXVlc3QgPT09IG51bGwpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb250cm9sbGVyLl9ieW9iUmVxdWVzdC5fYXNzb2NpYXRlZFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIgPSB1bmRlZmluZWQhO1xuICBjb250cm9sbGVyLl9ieW9iUmVxdWVzdC5fdmlldyA9IG51bGwhO1xuICBjb250cm9sbGVyLl9ieW9iUmVxdWVzdCA9IG51bGw7XG59XG5cbmZ1bmN0aW9uIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJQcm9jZXNzUHVsbEludG9EZXNjcmlwdG9yc1VzaW5nUXVldWUoY29udHJvbGxlcjogUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcikge1xuICBhc3NlcnQoIWNvbnRyb2xsZXIuX2Nsb3NlUmVxdWVzdGVkKTtcblxuICB3aGlsZSAoY29udHJvbGxlci5fcGVuZGluZ1B1bGxJbnRvcy5sZW5ndGggPiAwKSB7XG4gICAgaWYgKGNvbnRyb2xsZXIuX3F1ZXVlVG90YWxTaXplID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcHVsbEludG9EZXNjcmlwdG9yID0gY29udHJvbGxlci5fcGVuZGluZ1B1bGxJbnRvcy5wZWVrKCk7XG4gICAgYXNzZXJ0KHB1bGxJbnRvRGVzY3JpcHRvci5yZWFkZXJUeXBlICE9PSAnbm9uZScpO1xuXG4gICAgaWYgKFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJGaWxsUHVsbEludG9EZXNjcmlwdG9yRnJvbVF1ZXVlKGNvbnRyb2xsZXIsIHB1bGxJbnRvRGVzY3JpcHRvcikpIHtcbiAgICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJTaGlmdFBlbmRpbmdQdWxsSW50byhjb250cm9sbGVyKTtcblxuICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckNvbW1pdFB1bGxJbnRvRGVzY3JpcHRvcihcbiAgICAgICAgY29udHJvbGxlci5fY29udHJvbGxlZFJlYWRhYmxlQnl0ZVN0cmVhbSxcbiAgICAgICAgcHVsbEludG9EZXNjcmlwdG9yXG4gICAgICApO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyUHJvY2Vzc1JlYWRSZXF1ZXN0c1VzaW5nUXVldWUoY29udHJvbGxlcjogUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcikge1xuICBjb25zdCByZWFkZXIgPSBjb250cm9sbGVyLl9jb250cm9sbGVkUmVhZGFibGVCeXRlU3RyZWFtLl9yZWFkZXI7XG4gIGFzc2VydChJc1JlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcihyZWFkZXIpKTtcbiAgd2hpbGUgKHJlYWRlci5fcmVhZFJlcXVlc3RzLmxlbmd0aCA+IDApIHtcbiAgICBpZiAoY29udHJvbGxlci5fcXVldWVUb3RhbFNpemUgPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgcmVhZFJlcXVlc3QgPSByZWFkZXIuX3JlYWRSZXF1ZXN0cy5zaGlmdCgpO1xuICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJGaWxsUmVhZFJlcXVlc3RGcm9tUXVldWUoY29udHJvbGxlciwgcmVhZFJlcXVlc3QpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyUHVsbEludG88VCBleHRlbmRzIE5vblNoYXJlZDxBcnJheUJ1ZmZlclZpZXc+PihcbiAgY29udHJvbGxlcjogUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcixcbiAgdmlldzogVCxcbiAgbWluOiBudW1iZXIsXG4gIHJlYWRJbnRvUmVxdWVzdDogUmVhZEludG9SZXF1ZXN0PFQ+XG4pOiB2b2lkIHtcbiAgY29uc3Qgc3RyZWFtID0gY29udHJvbGxlci5fY29udHJvbGxlZFJlYWRhYmxlQnl0ZVN0cmVhbTtcblxuICBjb25zdCBjdG9yID0gdmlldy5jb25zdHJ1Y3RvciBhcyBBcnJheUJ1ZmZlclZpZXdDb25zdHJ1Y3RvcjxUPjtcbiAgY29uc3QgZWxlbWVudFNpemUgPSBhcnJheUJ1ZmZlclZpZXdFbGVtZW50U2l6ZShjdG9yKTtcblxuICBjb25zdCB7IGJ5dGVPZmZzZXQsIGJ5dGVMZW5ndGggfSA9IHZpZXc7XG5cbiAgY29uc3QgbWluaW11bUZpbGwgPSBtaW4gKiBlbGVtZW50U2l6ZTtcbiAgYXNzZXJ0KG1pbmltdW1GaWxsID49IGVsZW1lbnRTaXplICYmIG1pbmltdW1GaWxsIDw9IGJ5dGVMZW5ndGgpO1xuICBhc3NlcnQobWluaW11bUZpbGwgJSBlbGVtZW50U2l6ZSA9PT0gMCk7XG5cbiAgbGV0IGJ1ZmZlcjogQXJyYXlCdWZmZXI7XG4gIHRyeSB7XG4gICAgYnVmZmVyID0gVHJhbnNmZXJBcnJheUJ1ZmZlcih2aWV3LmJ1ZmZlcik7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZWFkSW50b1JlcXVlc3QuX2Vycm9yU3RlcHMoZSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgcHVsbEludG9EZXNjcmlwdG9yOiBCWU9CUHVsbEludG9EZXNjcmlwdG9yPFQ+ID0ge1xuICAgIGJ1ZmZlcixcbiAgICBidWZmZXJCeXRlTGVuZ3RoOiBidWZmZXIuYnl0ZUxlbmd0aCxcbiAgICBieXRlT2Zmc2V0LFxuICAgIGJ5dGVMZW5ndGgsXG4gICAgYnl0ZXNGaWxsZWQ6IDAsXG4gICAgbWluaW11bUZpbGwsXG4gICAgZWxlbWVudFNpemUsXG4gICAgdmlld0NvbnN0cnVjdG9yOiBjdG9yLFxuICAgIHJlYWRlclR5cGU6ICdieW9iJ1xuICB9O1xuXG4gIGlmIChjb250cm9sbGVyLl9wZW5kaW5nUHVsbEludG9zLmxlbmd0aCA+IDApIHtcbiAgICBjb250cm9sbGVyLl9wZW5kaW5nUHVsbEludG9zLnB1c2gocHVsbEludG9EZXNjcmlwdG9yKTtcblxuICAgIC8vIE5vIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJDYWxsUHVsbElmTmVlZGVkKCkgY2FsbCBzaW5jZTpcbiAgICAvLyAtIE5vIGNoYW5nZSBoYXBwZW5zIG9uIGRlc2lyZWRTaXplXG4gICAgLy8gLSBUaGUgc291cmNlIGhhcyBhbHJlYWR5IGJlZW4gbm90aWZpZWQgb2YgdGhhdCB0aGVyZSdzIGF0IGxlYXN0IDEgcGVuZGluZyByZWFkKHZpZXcpXG5cbiAgICBSZWFkYWJsZVN0cmVhbUFkZFJlYWRJbnRvUmVxdWVzdChzdHJlYW0sIHJlYWRJbnRvUmVxdWVzdCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKHN0cmVhbS5fc3RhdGUgPT09ICdjbG9zZWQnKSB7XG4gICAgY29uc3QgZW1wdHlWaWV3ID0gbmV3IGN0b3IocHVsbEludG9EZXNjcmlwdG9yLmJ1ZmZlciwgcHVsbEludG9EZXNjcmlwdG9yLmJ5dGVPZmZzZXQsIDApO1xuICAgIHJlYWRJbnRvUmVxdWVzdC5fY2xvc2VTdGVwcyhlbXB0eVZpZXcpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChjb250cm9sbGVyLl9xdWV1ZVRvdGFsU2l6ZSA+IDApIHtcbiAgICBpZiAoUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckZpbGxQdWxsSW50b0Rlc2NyaXB0b3JGcm9tUXVldWUoY29udHJvbGxlciwgcHVsbEludG9EZXNjcmlwdG9yKSkge1xuICAgICAgY29uc3QgZmlsbGVkVmlldyA9IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJDb252ZXJ0UHVsbEludG9EZXNjcmlwdG9yPFQ+KHB1bGxJbnRvRGVzY3JpcHRvcik7XG5cbiAgICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJIYW5kbGVRdWV1ZURyYWluKGNvbnRyb2xsZXIpO1xuXG4gICAgICByZWFkSW50b1JlcXVlc3QuX2NodW5rU3RlcHMoZmlsbGVkVmlldyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGNvbnRyb2xsZXIuX2Nsb3NlUmVxdWVzdGVkKSB7XG4gICAgICBjb25zdCBlID0gbmV3IFR5cGVFcnJvcignSW5zdWZmaWNpZW50IGJ5dGVzIHRvIGZpbGwgZWxlbWVudHMgaW4gdGhlIGdpdmVuIGJ1ZmZlcicpO1xuICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVycm9yKGNvbnRyb2xsZXIsIGUpO1xuXG4gICAgICByZWFkSW50b1JlcXVlc3QuX2Vycm9yU3RlcHMoZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgY29udHJvbGxlci5fcGVuZGluZ1B1bGxJbnRvcy5wdXNoKHB1bGxJbnRvRGVzY3JpcHRvcik7XG5cbiAgUmVhZGFibGVTdHJlYW1BZGRSZWFkSW50b1JlcXVlc3Q8VD4oc3RyZWFtLCByZWFkSW50b1JlcXVlc3QpO1xuICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyQ2FsbFB1bGxJZk5lZWRlZChjb250cm9sbGVyKTtcbn1cblxuZnVuY3Rpb24gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclJlc3BvbmRJbkNsb3NlZFN0YXRlKGNvbnRyb2xsZXI6IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3REZXNjcmlwdG9yOiBQdWxsSW50b0Rlc2NyaXB0b3IpIHtcbiAgYXNzZXJ0KGZpcnN0RGVzY3JpcHRvci5ieXRlc0ZpbGxlZCAlIGZpcnN0RGVzY3JpcHRvci5lbGVtZW50U2l6ZSA9PT0gMCk7XG5cbiAgaWYgKGZpcnN0RGVzY3JpcHRvci5yZWFkZXJUeXBlID09PSAnbm9uZScpIHtcbiAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyU2hpZnRQZW5kaW5nUHVsbEludG8oY29udHJvbGxlcik7XG4gIH1cblxuICBjb25zdCBzdHJlYW0gPSBjb250cm9sbGVyLl9jb250cm9sbGVkUmVhZGFibGVCeXRlU3RyZWFtO1xuICBpZiAoUmVhZGFibGVTdHJlYW1IYXNCWU9CUmVhZGVyKHN0cmVhbSkpIHtcbiAgICB3aGlsZSAoUmVhZGFibGVTdHJlYW1HZXROdW1SZWFkSW50b1JlcXVlc3RzKHN0cmVhbSkgPiAwKSB7XG4gICAgICBjb25zdCBwdWxsSW50b0Rlc2NyaXB0b3IgPSBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyU2hpZnRQZW5kaW5nUHVsbEludG8oY29udHJvbGxlcik7XG4gICAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyQ29tbWl0UHVsbEludG9EZXNjcmlwdG9yKHN0cmVhbSwgcHVsbEludG9EZXNjcmlwdG9yKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclJlc3BvbmRJblJlYWRhYmxlU3RhdGUoY29udHJvbGxlcjogUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ5dGVzV3JpdHRlbjogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHVsbEludG9EZXNjcmlwdG9yOiBQdWxsSW50b0Rlc2NyaXB0b3IpIHtcbiAgYXNzZXJ0KHB1bGxJbnRvRGVzY3JpcHRvci5ieXRlc0ZpbGxlZCArIGJ5dGVzV3JpdHRlbiA8PSBwdWxsSW50b0Rlc2NyaXB0b3IuYnl0ZUxlbmd0aCk7XG5cbiAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckZpbGxIZWFkUHVsbEludG9EZXNjcmlwdG9yKGNvbnRyb2xsZXIsIGJ5dGVzV3JpdHRlbiwgcHVsbEludG9EZXNjcmlwdG9yKTtcblxuICBpZiAocHVsbEludG9EZXNjcmlwdG9yLnJlYWRlclR5cGUgPT09ICdub25lJykge1xuICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJFbnF1ZXVlRGV0YWNoZWRQdWxsSW50b1RvUXVldWUoY29udHJvbGxlciwgcHVsbEludG9EZXNjcmlwdG9yKTtcbiAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyUHJvY2Vzc1B1bGxJbnRvRGVzY3JpcHRvcnNVc2luZ1F1ZXVlKGNvbnRyb2xsZXIpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChwdWxsSW50b0Rlc2NyaXB0b3IuYnl0ZXNGaWxsZWQgPCBwdWxsSW50b0Rlc2NyaXB0b3IubWluaW11bUZpbGwpIHtcbiAgICAvLyBBIGRlc2NyaXB0b3IgZm9yIGEgcmVhZCgpIHJlcXVlc3QgdGhhdCBpcyBub3QgeWV0IGZpbGxlZCB1cCB0byBpdHMgbWluaW11bSBsZW5ndGggd2lsbCBzdGF5IGF0IHRoZSBoZWFkXG4gICAgLy8gb2YgdGhlIHF1ZXVlLCBzbyB0aGUgdW5kZXJseWluZyBzb3VyY2UgY2FuIGtlZXAgZmlsbGluZyBpdC5cbiAgICByZXR1cm47XG4gIH1cblxuICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyU2hpZnRQZW5kaW5nUHVsbEludG8oY29udHJvbGxlcik7XG5cbiAgY29uc3QgcmVtYWluZGVyU2l6ZSA9IHB1bGxJbnRvRGVzY3JpcHRvci5ieXRlc0ZpbGxlZCAlIHB1bGxJbnRvRGVzY3JpcHRvci5lbGVtZW50U2l6ZTtcbiAgaWYgKHJlbWFpbmRlclNpemUgPiAwKSB7XG4gICAgY29uc3QgZW5kID0gcHVsbEludG9EZXNjcmlwdG9yLmJ5dGVPZmZzZXQgKyBwdWxsSW50b0Rlc2NyaXB0b3IuYnl0ZXNGaWxsZWQ7XG4gICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVucXVldWVDbG9uZWRDaHVua1RvUXVldWUoXG4gICAgICBjb250cm9sbGVyLFxuICAgICAgcHVsbEludG9EZXNjcmlwdG9yLmJ1ZmZlcixcbiAgICAgIGVuZCAtIHJlbWFpbmRlclNpemUsXG4gICAgICByZW1haW5kZXJTaXplXG4gICAgKTtcbiAgfVxuXG4gIHB1bGxJbnRvRGVzY3JpcHRvci5ieXRlc0ZpbGxlZCAtPSByZW1haW5kZXJTaXplO1xuICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyQ29tbWl0UHVsbEludG9EZXNjcmlwdG9yKGNvbnRyb2xsZXIuX2NvbnRyb2xsZWRSZWFkYWJsZUJ5dGVTdHJlYW0sIHB1bGxJbnRvRGVzY3JpcHRvcik7XG5cbiAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclByb2Nlc3NQdWxsSW50b0Rlc2NyaXB0b3JzVXNpbmdRdWV1ZShjb250cm9sbGVyKTtcbn1cblxuZnVuY3Rpb24gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclJlc3BvbmRJbnRlcm5hbChjb250cm9sbGVyOiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyLCBieXRlc1dyaXR0ZW46IG51bWJlcikge1xuICBjb25zdCBmaXJzdERlc2NyaXB0b3IgPSBjb250cm9sbGVyLl9wZW5kaW5nUHVsbEludG9zLnBlZWsoKTtcbiAgYXNzZXJ0KENhblRyYW5zZmVyQXJyYXlCdWZmZXIoZmlyc3REZXNjcmlwdG9yLmJ1ZmZlcikpO1xuXG4gIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJJbnZhbGlkYXRlQllPQlJlcXVlc3QoY29udHJvbGxlcik7XG5cbiAgY29uc3Qgc3RhdGUgPSBjb250cm9sbGVyLl9jb250cm9sbGVkUmVhZGFibGVCeXRlU3RyZWFtLl9zdGF0ZTtcbiAgaWYgKHN0YXRlID09PSAnY2xvc2VkJykge1xuICAgIGFzc2VydChieXRlc1dyaXR0ZW4gPT09IDApO1xuICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJSZXNwb25kSW5DbG9zZWRTdGF0ZShjb250cm9sbGVyLCBmaXJzdERlc2NyaXB0b3IpO1xuICB9IGVsc2Uge1xuICAgIGFzc2VydChzdGF0ZSA9PT0gJ3JlYWRhYmxlJyk7XG4gICAgYXNzZXJ0KGJ5dGVzV3JpdHRlbiA+IDApO1xuICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJSZXNwb25kSW5SZWFkYWJsZVN0YXRlKGNvbnRyb2xsZXIsIGJ5dGVzV3JpdHRlbiwgZmlyc3REZXNjcmlwdG9yKTtcbiAgfVxuXG4gIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJDYWxsUHVsbElmTmVlZGVkKGNvbnRyb2xsZXIpO1xufVxuXG5mdW5jdGlvbiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyU2hpZnRQZW5kaW5nUHVsbEludG8oXG4gIGNvbnRyb2xsZXI6IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJcbik6IFB1bGxJbnRvRGVzY3JpcHRvciB7XG4gIGFzc2VydChjb250cm9sbGVyLl9ieW9iUmVxdWVzdCA9PT0gbnVsbCk7XG4gIGNvbnN0IGRlc2NyaXB0b3IgPSBjb250cm9sbGVyLl9wZW5kaW5nUHVsbEludG9zLnNoaWZ0KCkhO1xuICByZXR1cm4gZGVzY3JpcHRvcjtcbn1cblxuZnVuY3Rpb24gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclNob3VsZENhbGxQdWxsKGNvbnRyb2xsZXI6IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIpOiBib29sZWFuIHtcbiAgY29uc3Qgc3RyZWFtID0gY29udHJvbGxlci5fY29udHJvbGxlZFJlYWRhYmxlQnl0ZVN0cmVhbTtcblxuICBpZiAoc3RyZWFtLl9zdGF0ZSAhPT0gJ3JlYWRhYmxlJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChjb250cm9sbGVyLl9jbG9zZVJlcXVlc3RlZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICghY29udHJvbGxlci5fc3RhcnRlZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChSZWFkYWJsZVN0cmVhbUhhc0RlZmF1bHRSZWFkZXIoc3RyZWFtKSAmJiBSZWFkYWJsZVN0cmVhbUdldE51bVJlYWRSZXF1ZXN0cyhzdHJlYW0pID4gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKFJlYWRhYmxlU3RyZWFtSGFzQllPQlJlYWRlcihzdHJlYW0pICYmIFJlYWRhYmxlU3RyZWFtR2V0TnVtUmVhZEludG9SZXF1ZXN0cyhzdHJlYW0pID4gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgY29uc3QgZGVzaXJlZFNpemUgPSBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyR2V0RGVzaXJlZFNpemUoY29udHJvbGxlcik7XG4gIGFzc2VydChkZXNpcmVkU2l6ZSAhPT0gbnVsbCk7XG4gIGlmIChkZXNpcmVkU2l6ZSEgPiAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJDbGVhckFsZ29yaXRobXMoY29udHJvbGxlcjogUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcikge1xuICBjb250cm9sbGVyLl9wdWxsQWxnb3JpdGhtID0gdW5kZWZpbmVkITtcbiAgY29udHJvbGxlci5fY2FuY2VsQWxnb3JpdGhtID0gdW5kZWZpbmVkITtcbn1cblxuLy8gQSBjbGllbnQgb2YgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlciBtYXkgdXNlIHRoZXNlIGZ1bmN0aW9ucyBkaXJlY3RseSB0byBieXBhc3Mgc3RhdGUgY2hlY2suXG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyQ2xvc2UoY29udHJvbGxlcjogUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcikge1xuICBjb25zdCBzdHJlYW0gPSBjb250cm9sbGVyLl9jb250cm9sbGVkUmVhZGFibGVCeXRlU3RyZWFtO1xuXG4gIGlmIChjb250cm9sbGVyLl9jbG9zZVJlcXVlc3RlZCB8fCBzdHJlYW0uX3N0YXRlICE9PSAncmVhZGFibGUnKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGNvbnRyb2xsZXIuX3F1ZXVlVG90YWxTaXplID4gMCkge1xuICAgIGNvbnRyb2xsZXIuX2Nsb3NlUmVxdWVzdGVkID0gdHJ1ZTtcblxuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChjb250cm9sbGVyLl9wZW5kaW5nUHVsbEludG9zLmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCBmaXJzdFBlbmRpbmdQdWxsSW50byA9IGNvbnRyb2xsZXIuX3BlbmRpbmdQdWxsSW50b3MucGVlaygpO1xuICAgIGlmIChmaXJzdFBlbmRpbmdQdWxsSW50by5ieXRlc0ZpbGxlZCAlIGZpcnN0UGVuZGluZ1B1bGxJbnRvLmVsZW1lbnRTaXplICE9PSAwKSB7XG4gICAgICBjb25zdCBlID0gbmV3IFR5cGVFcnJvcignSW5zdWZmaWNpZW50IGJ5dGVzIHRvIGZpbGwgZWxlbWVudHMgaW4gdGhlIGdpdmVuIGJ1ZmZlcicpO1xuICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVycm9yKGNvbnRyb2xsZXIsIGUpO1xuXG4gICAgICB0aHJvdyBlO1xuICAgIH1cbiAgfVxuXG4gIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJDbGVhckFsZ29yaXRobXMoY29udHJvbGxlcik7XG4gIFJlYWRhYmxlU3RyZWFtQ2xvc2Uoc3RyZWFtKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJFbnF1ZXVlKFxuICBjb250cm9sbGVyOiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyLFxuICBjaHVuazogTm9uU2hhcmVkPEFycmF5QnVmZmVyVmlldz5cbikge1xuICBjb25zdCBzdHJlYW0gPSBjb250cm9sbGVyLl9jb250cm9sbGVkUmVhZGFibGVCeXRlU3RyZWFtO1xuXG4gIGlmIChjb250cm9sbGVyLl9jbG9zZVJlcXVlc3RlZCB8fCBzdHJlYW0uX3N0YXRlICE9PSAncmVhZGFibGUnKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgeyBidWZmZXIsIGJ5dGVPZmZzZXQsIGJ5dGVMZW5ndGggfSA9IGNodW5rO1xuICBpZiAoSXNEZXRhY2hlZEJ1ZmZlcihidWZmZXIpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignY2h1bmtcXCdzIGJ1ZmZlciBpcyBkZXRhY2hlZCBhbmQgc28gY2Fubm90IGJlIGVucXVldWVkJyk7XG4gIH1cbiAgY29uc3QgdHJhbnNmZXJyZWRCdWZmZXIgPSBUcmFuc2ZlckFycmF5QnVmZmVyKGJ1ZmZlcik7XG5cbiAgaWYgKGNvbnRyb2xsZXIuX3BlbmRpbmdQdWxsSW50b3MubGVuZ3RoID4gMCkge1xuICAgIGNvbnN0IGZpcnN0UGVuZGluZ1B1bGxJbnRvID0gY29udHJvbGxlci5fcGVuZGluZ1B1bGxJbnRvcy5wZWVrKCk7XG4gICAgaWYgKElzRGV0YWNoZWRCdWZmZXIoZmlyc3RQZW5kaW5nUHVsbEludG8uYnVmZmVyKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgJ1RoZSBCWU9CIHJlcXVlc3RcXCdzIGJ1ZmZlciBoYXMgYmVlbiBkZXRhY2hlZCBhbmQgc28gY2Fubm90IGJlIGZpbGxlZCB3aXRoIGFuIGVucXVldWVkIGNodW5rJ1xuICAgICAgKTtcbiAgICB9XG4gICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckludmFsaWRhdGVCWU9CUmVxdWVzdChjb250cm9sbGVyKTtcbiAgICBmaXJzdFBlbmRpbmdQdWxsSW50by5idWZmZXIgPSBUcmFuc2ZlckFycmF5QnVmZmVyKGZpcnN0UGVuZGluZ1B1bGxJbnRvLmJ1ZmZlcik7XG4gICAgaWYgKGZpcnN0UGVuZGluZ1B1bGxJbnRvLnJlYWRlclR5cGUgPT09ICdub25lJykge1xuICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVucXVldWVEZXRhY2hlZFB1bGxJbnRvVG9RdWV1ZShjb250cm9sbGVyLCBmaXJzdFBlbmRpbmdQdWxsSW50byk7XG4gICAgfVxuICB9XG5cbiAgaWYgKFJlYWRhYmxlU3RyZWFtSGFzRGVmYXVsdFJlYWRlcihzdHJlYW0pKSB7XG4gICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclByb2Nlc3NSZWFkUmVxdWVzdHNVc2luZ1F1ZXVlKGNvbnRyb2xsZXIpO1xuICAgIGlmIChSZWFkYWJsZVN0cmVhbUdldE51bVJlYWRSZXF1ZXN0cyhzdHJlYW0pID09PSAwKSB7XG4gICAgICBhc3NlcnQoY29udHJvbGxlci5fcGVuZGluZ1B1bGxJbnRvcy5sZW5ndGggPT09IDApO1xuICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVucXVldWVDaHVua1RvUXVldWUoY29udHJvbGxlciwgdHJhbnNmZXJyZWRCdWZmZXIsIGJ5dGVPZmZzZXQsIGJ5dGVMZW5ndGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhc3NlcnQoY29udHJvbGxlci5fcXVldWUubGVuZ3RoID09PSAwKTtcbiAgICAgIGlmIChjb250cm9sbGVyLl9wZW5kaW5nUHVsbEludG9zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYXNzZXJ0KGNvbnRyb2xsZXIuX3BlbmRpbmdQdWxsSW50b3MucGVlaygpLnJlYWRlclR5cGUgPT09ICdkZWZhdWx0Jyk7XG4gICAgICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJTaGlmdFBlbmRpbmdQdWxsSW50byhjb250cm9sbGVyKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHRyYW5zZmVycmVkVmlldyA9IG5ldyBVaW50OEFycmF5KHRyYW5zZmVycmVkQnVmZmVyLCBieXRlT2Zmc2V0LCBieXRlTGVuZ3RoKTtcbiAgICAgIFJlYWRhYmxlU3RyZWFtRnVsZmlsbFJlYWRSZXF1ZXN0KHN0cmVhbSwgdHJhbnNmZXJyZWRWaWV3IGFzIE5vblNoYXJlZDxVaW50OEFycmF5PiwgZmFsc2UpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChSZWFkYWJsZVN0cmVhbUhhc0JZT0JSZWFkZXIoc3RyZWFtKSkge1xuICAgIC8vIFRPRE86IElkZWFsbHkgaW4gdGhpcyBicmFuY2ggZGV0YWNoaW5nIHNob3VsZCBoYXBwZW4gb25seSBpZiB0aGUgYnVmZmVyIGlzIG5vdCBjb25zdW1lZCBmdWxseS5cbiAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRW5xdWV1ZUNodW5rVG9RdWV1ZShjb250cm9sbGVyLCB0cmFuc2ZlcnJlZEJ1ZmZlciwgYnl0ZU9mZnNldCwgYnl0ZUxlbmd0aCk7XG4gICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclByb2Nlc3NQdWxsSW50b0Rlc2NyaXB0b3JzVXNpbmdRdWV1ZShjb250cm9sbGVyKTtcbiAgfSBlbHNlIHtcbiAgICBhc3NlcnQoIUlzUmVhZGFibGVTdHJlYW1Mb2NrZWQoc3RyZWFtKSk7XG4gICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVucXVldWVDaHVua1RvUXVldWUoY29udHJvbGxlciwgdHJhbnNmZXJyZWRCdWZmZXIsIGJ5dGVPZmZzZXQsIGJ5dGVMZW5ndGgpO1xuICB9XG5cbiAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckNhbGxQdWxsSWZOZWVkZWQoY29udHJvbGxlcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRXJyb3IoY29udHJvbGxlcjogUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlciwgZTogYW55KSB7XG4gIGNvbnN0IHN0cmVhbSA9IGNvbnRyb2xsZXIuX2NvbnRyb2xsZWRSZWFkYWJsZUJ5dGVTdHJlYW07XG5cbiAgaWYgKHN0cmVhbS5fc3RhdGUgIT09ICdyZWFkYWJsZScpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyQ2xlYXJQZW5kaW5nUHVsbEludG9zKGNvbnRyb2xsZXIpO1xuXG4gIFJlc2V0UXVldWUoY29udHJvbGxlcik7XG4gIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJDbGVhckFsZ29yaXRobXMoY29udHJvbGxlcik7XG4gIFJlYWRhYmxlU3RyZWFtRXJyb3Ioc3RyZWFtLCBlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJGaWxsUmVhZFJlcXVlc3RGcm9tUXVldWUoXG4gIGNvbnRyb2xsZXI6IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIsXG4gIHJlYWRSZXF1ZXN0OiBSZWFkUmVxdWVzdDxOb25TaGFyZWQ8VWludDhBcnJheT4+XG4pIHtcbiAgYXNzZXJ0KGNvbnRyb2xsZXIuX3F1ZXVlVG90YWxTaXplID4gMCk7XG5cbiAgY29uc3QgZW50cnkgPSBjb250cm9sbGVyLl9xdWV1ZS5zaGlmdCgpO1xuICBjb250cm9sbGVyLl9xdWV1ZVRvdGFsU2l6ZSAtPSBlbnRyeS5ieXRlTGVuZ3RoO1xuXG4gIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJIYW5kbGVRdWV1ZURyYWluKGNvbnRyb2xsZXIpO1xuXG4gIGNvbnN0IHZpZXcgPSBuZXcgVWludDhBcnJheShlbnRyeS5idWZmZXIsIGVudHJ5LmJ5dGVPZmZzZXQsIGVudHJ5LmJ5dGVMZW5ndGgpO1xuICByZWFkUmVxdWVzdC5fY2h1bmtTdGVwcyh2aWV3IGFzIE5vblNoYXJlZDxVaW50OEFycmF5Pik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyR2V0QllPQlJlcXVlc3QoXG4gIGNvbnRyb2xsZXI6IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJcbik6IFJlYWRhYmxlU3RyZWFtQllPQlJlcXVlc3QgfCBudWxsIHtcbiAgaWYgKGNvbnRyb2xsZXIuX2J5b2JSZXF1ZXN0ID09PSBudWxsICYmIGNvbnRyb2xsZXIuX3BlbmRpbmdQdWxsSW50b3MubGVuZ3RoID4gMCkge1xuICAgIGNvbnN0IGZpcnN0RGVzY3JpcHRvciA9IGNvbnRyb2xsZXIuX3BlbmRpbmdQdWxsSW50b3MucGVlaygpO1xuICAgIGNvbnN0IHZpZXcgPSBuZXcgVWludDhBcnJheShmaXJzdERlc2NyaXB0b3IuYnVmZmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaXJzdERlc2NyaXB0b3IuYnl0ZU9mZnNldCArIGZpcnN0RGVzY3JpcHRvci5ieXRlc0ZpbGxlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3REZXNjcmlwdG9yLmJ5dGVMZW5ndGggLSBmaXJzdERlc2NyaXB0b3IuYnl0ZXNGaWxsZWQpO1xuXG4gICAgY29uc3QgYnlvYlJlcXVlc3Q6IFJlYWRhYmxlU3RyZWFtQllPQlJlcXVlc3QgPSBPYmplY3QuY3JlYXRlKFJlYWRhYmxlU3RyZWFtQllPQlJlcXVlc3QucHJvdG90eXBlKTtcbiAgICBTZXRVcFJlYWRhYmxlU3RyZWFtQllPQlJlcXVlc3QoYnlvYlJlcXVlc3QsIGNvbnRyb2xsZXIsIHZpZXcgYXMgTm9uU2hhcmVkPFVpbnQ4QXJyYXk+KTtcbiAgICBjb250cm9sbGVyLl9ieW9iUmVxdWVzdCA9IGJ5b2JSZXF1ZXN0O1xuICB9XG4gIHJldHVybiBjb250cm9sbGVyLl9ieW9iUmVxdWVzdDtcbn1cblxuZnVuY3Rpb24gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckdldERlc2lyZWRTaXplKGNvbnRyb2xsZXI6IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIpOiBudW1iZXIgfCBudWxsIHtcbiAgY29uc3Qgc3RhdGUgPSBjb250cm9sbGVyLl9jb250cm9sbGVkUmVhZGFibGVCeXRlU3RyZWFtLl9zdGF0ZTtcblxuICBpZiAoc3RhdGUgPT09ICdlcnJvcmVkJykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGlmIChzdGF0ZSA9PT0gJ2Nsb3NlZCcpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIHJldHVybiBjb250cm9sbGVyLl9zdHJhdGVneUhXTSAtIGNvbnRyb2xsZXIuX3F1ZXVlVG90YWxTaXplO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclJlc3BvbmQoY29udHJvbGxlcjogUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlciwgYnl0ZXNXcml0dGVuOiBudW1iZXIpIHtcbiAgYXNzZXJ0KGNvbnRyb2xsZXIuX3BlbmRpbmdQdWxsSW50b3MubGVuZ3RoID4gMCk7XG5cbiAgY29uc3QgZmlyc3REZXNjcmlwdG9yID0gY29udHJvbGxlci5fcGVuZGluZ1B1bGxJbnRvcy5wZWVrKCk7XG4gIGNvbnN0IHN0YXRlID0gY29udHJvbGxlci5fY29udHJvbGxlZFJlYWRhYmxlQnl0ZVN0cmVhbS5fc3RhdGU7XG5cbiAgaWYgKHN0YXRlID09PSAnY2xvc2VkJykge1xuICAgIGlmIChieXRlc1dyaXR0ZW4gIT09IDApIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2J5dGVzV3JpdHRlbiBtdXN0IGJlIDAgd2hlbiBjYWxsaW5nIHJlc3BvbmQoKSBvbiBhIGNsb3NlZCBzdHJlYW0nKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgYXNzZXJ0KHN0YXRlID09PSAncmVhZGFibGUnKTtcbiAgICBpZiAoYnl0ZXNXcml0dGVuID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdieXRlc1dyaXR0ZW4gbXVzdCBiZSBncmVhdGVyIHRoYW4gMCB3aGVuIGNhbGxpbmcgcmVzcG9uZCgpIG9uIGEgcmVhZGFibGUgc3RyZWFtJyk7XG4gICAgfVxuICAgIGlmIChmaXJzdERlc2NyaXB0b3IuYnl0ZXNGaWxsZWQgKyBieXRlc1dyaXR0ZW4gPiBmaXJzdERlc2NyaXB0b3IuYnl0ZUxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ2J5dGVzV3JpdHRlbiBvdXQgb2YgcmFuZ2UnKTtcbiAgICB9XG4gIH1cblxuICBmaXJzdERlc2NyaXB0b3IuYnVmZmVyID0gVHJhbnNmZXJBcnJheUJ1ZmZlcihmaXJzdERlc2NyaXB0b3IuYnVmZmVyKTtcblxuICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyUmVzcG9uZEludGVybmFsKGNvbnRyb2xsZXIsIGJ5dGVzV3JpdHRlbik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyUmVzcG9uZFdpdGhOZXdWaWV3KGNvbnRyb2xsZXI6IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aWV3OiBOb25TaGFyZWQ8QXJyYXlCdWZmZXJWaWV3Pikge1xuICBhc3NlcnQoY29udHJvbGxlci5fcGVuZGluZ1B1bGxJbnRvcy5sZW5ndGggPiAwKTtcbiAgYXNzZXJ0KCFJc0RldGFjaGVkQnVmZmVyKHZpZXcuYnVmZmVyKSk7XG5cbiAgY29uc3QgZmlyc3REZXNjcmlwdG9yID0gY29udHJvbGxlci5fcGVuZGluZ1B1bGxJbnRvcy5wZWVrKCk7XG4gIGNvbnN0IHN0YXRlID0gY29udHJvbGxlci5fY29udHJvbGxlZFJlYWRhYmxlQnl0ZVN0cmVhbS5fc3RhdGU7XG5cbiAgaWYgKHN0YXRlID09PSAnY2xvc2VkJykge1xuICAgIGlmICh2aWV3LmJ5dGVMZW5ndGggIT09IDApIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSB2aWV3XFwncyBsZW5ndGggbXVzdCBiZSAwIHdoZW4gY2FsbGluZyByZXNwb25kV2l0aE5ld1ZpZXcoKSBvbiBhIGNsb3NlZCBzdHJlYW0nKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgYXNzZXJ0KHN0YXRlID09PSAncmVhZGFibGUnKTtcbiAgICBpZiAodmlldy5ieXRlTGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICAnVGhlIHZpZXdcXCdzIGxlbmd0aCBtdXN0IGJlIGdyZWF0ZXIgdGhhbiAwIHdoZW4gY2FsbGluZyByZXNwb25kV2l0aE5ld1ZpZXcoKSBvbiBhIHJlYWRhYmxlIHN0cmVhbSdcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgaWYgKGZpcnN0RGVzY3JpcHRvci5ieXRlT2Zmc2V0ICsgZmlyc3REZXNjcmlwdG9yLmJ5dGVzRmlsbGVkICE9PSB2aWV3LmJ5dGVPZmZzZXQpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVGhlIHJlZ2lvbiBzcGVjaWZpZWQgYnkgdmlldyBkb2VzIG5vdCBtYXRjaCBieW9iUmVxdWVzdCcpO1xuICB9XG4gIGlmIChmaXJzdERlc2NyaXB0b3IuYnVmZmVyQnl0ZUxlbmd0aCAhPT0gdmlldy5idWZmZXIuYnl0ZUxlbmd0aCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdUaGUgYnVmZmVyIG9mIHZpZXcgaGFzIGRpZmZlcmVudCBjYXBhY2l0eSB0aGFuIGJ5b2JSZXF1ZXN0Jyk7XG4gIH1cbiAgaWYgKGZpcnN0RGVzY3JpcHRvci5ieXRlc0ZpbGxlZCArIHZpZXcuYnl0ZUxlbmd0aCA+IGZpcnN0RGVzY3JpcHRvci5ieXRlTGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RoZSByZWdpb24gc3BlY2lmaWVkIGJ5IHZpZXcgaXMgbGFyZ2VyIHRoYW4gYnlvYlJlcXVlc3QnKTtcbiAgfVxuXG4gIGNvbnN0IHZpZXdCeXRlTGVuZ3RoID0gdmlldy5ieXRlTGVuZ3RoO1xuICBmaXJzdERlc2NyaXB0b3IuYnVmZmVyID0gVHJhbnNmZXJBcnJheUJ1ZmZlcih2aWV3LmJ1ZmZlcik7XG4gIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJSZXNwb25kSW50ZXJuYWwoY29udHJvbGxlciwgdmlld0J5dGVMZW5ndGgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gU2V0VXBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyKHN0cmVhbTogUmVhZGFibGVCeXRlU3RyZWFtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydEFsZ29yaXRobTogKCkgPT4gdm9pZCB8IFByb21pc2VMaWtlPHZvaWQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwdWxsQWxnb3JpdGhtOiAoKSA9PiBQcm9taXNlPHZvaWQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5jZWxBbGdvcml0aG06IChyZWFzb246IGFueSkgPT4gUHJvbWlzZTx2b2lkPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGlnaFdhdGVyTWFyazogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdXRvQWxsb2NhdGVDaHVua1NpemU6IG51bWJlciB8IHVuZGVmaW5lZCkge1xuICBhc3NlcnQoc3RyZWFtLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIgPT09IHVuZGVmaW5lZCk7XG4gIGlmIChhdXRvQWxsb2NhdGVDaHVua1NpemUgIT09IHVuZGVmaW5lZCkge1xuICAgIGFzc2VydChOdW1iZXJJc0ludGVnZXIoYXV0b0FsbG9jYXRlQ2h1bmtTaXplKSk7XG4gICAgYXNzZXJ0KGF1dG9BbGxvY2F0ZUNodW5rU2l6ZSA+IDApO1xuICB9XG5cbiAgY29udHJvbGxlci5fY29udHJvbGxlZFJlYWRhYmxlQnl0ZVN0cmVhbSA9IHN0cmVhbTtcblxuICBjb250cm9sbGVyLl9wdWxsQWdhaW4gPSBmYWxzZTtcbiAgY29udHJvbGxlci5fcHVsbGluZyA9IGZhbHNlO1xuXG4gIGNvbnRyb2xsZXIuX2J5b2JSZXF1ZXN0ID0gbnVsbDtcblxuICAvLyBOZWVkIHRvIHNldCB0aGUgc2xvdHMgc28gdGhhdCB0aGUgYXNzZXJ0IGRvZXNuJ3QgZmlyZS4gSW4gdGhlIHNwZWMgdGhlIHNsb3RzIGFscmVhZHkgZXhpc3QgaW1wbGljaXRseS5cbiAgY29udHJvbGxlci5fcXVldWUgPSBjb250cm9sbGVyLl9xdWV1ZVRvdGFsU2l6ZSA9IHVuZGVmaW5lZCE7XG4gIFJlc2V0UXVldWUoY29udHJvbGxlcik7XG5cbiAgY29udHJvbGxlci5fY2xvc2VSZXF1ZXN0ZWQgPSBmYWxzZTtcbiAgY29udHJvbGxlci5fc3RhcnRlZCA9IGZhbHNlO1xuXG4gIGNvbnRyb2xsZXIuX3N0cmF0ZWd5SFdNID0gaGlnaFdhdGVyTWFyaztcblxuICBjb250cm9sbGVyLl9wdWxsQWxnb3JpdGhtID0gcHVsbEFsZ29yaXRobTtcbiAgY29udHJvbGxlci5fY2FuY2VsQWxnb3JpdGhtID0gY2FuY2VsQWxnb3JpdGhtO1xuXG4gIGNvbnRyb2xsZXIuX2F1dG9BbGxvY2F0ZUNodW5rU2l6ZSA9IGF1dG9BbGxvY2F0ZUNodW5rU2l6ZTtcblxuICBjb250cm9sbGVyLl9wZW5kaW5nUHVsbEludG9zID0gbmV3IFNpbXBsZVF1ZXVlKCk7XG5cbiAgc3RyZWFtLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIgPSBjb250cm9sbGVyO1xuXG4gIGNvbnN0IHN0YXJ0UmVzdWx0ID0gc3RhcnRBbGdvcml0aG0oKTtcbiAgdXBvblByb21pc2UoXG4gICAgcHJvbWlzZVJlc29sdmVkV2l0aChzdGFydFJlc3VsdCksXG4gICAgKCkgPT4ge1xuICAgICAgY29udHJvbGxlci5fc3RhcnRlZCA9IHRydWU7XG5cbiAgICAgIGFzc2VydCghY29udHJvbGxlci5fcHVsbGluZyk7XG4gICAgICBhc3NlcnQoIWNvbnRyb2xsZXIuX3B1bGxBZ2Fpbik7XG5cbiAgICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJDYWxsUHVsbElmTmVlZGVkKGNvbnRyb2xsZXIpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcbiAgICByID0+IHtcbiAgICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJFcnJvcihjb250cm9sbGVyLCByKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFNldFVwUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckZyb21VbmRlcmx5aW5nU291cmNlKFxuICBzdHJlYW06IFJlYWRhYmxlQnl0ZVN0cmVhbSxcbiAgdW5kZXJseWluZ0J5dGVTb3VyY2U6IFZhbGlkYXRlZFVuZGVybHlpbmdCeXRlU291cmNlLFxuICBoaWdoV2F0ZXJNYXJrOiBudW1iZXJcbikge1xuICBjb25zdCBjb250cm9sbGVyOiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyID0gT2JqZWN0LmNyZWF0ZShSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyLnByb3RvdHlwZSk7XG5cbiAgbGV0IHN0YXJ0QWxnb3JpdGhtOiAoKSA9PiB2b2lkIHwgUHJvbWlzZUxpa2U8dm9pZD47XG4gIGxldCBwdWxsQWxnb3JpdGhtOiAoKSA9PiBQcm9taXNlPHZvaWQ+O1xuICBsZXQgY2FuY2VsQWxnb3JpdGhtOiAocmVhc29uOiBhbnkpID0+IFByb21pc2U8dm9pZD47XG5cbiAgaWYgKHVuZGVybHlpbmdCeXRlU291cmNlLnN0YXJ0ICE9PSB1bmRlZmluZWQpIHtcbiAgICBzdGFydEFsZ29yaXRobSA9ICgpID0+IHVuZGVybHlpbmdCeXRlU291cmNlLnN0YXJ0IShjb250cm9sbGVyKTtcbiAgfSBlbHNlIHtcbiAgICBzdGFydEFsZ29yaXRobSA9ICgpID0+IHVuZGVmaW5lZDtcbiAgfVxuICBpZiAodW5kZXJseWluZ0J5dGVTb3VyY2UucHVsbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcHVsbEFsZ29yaXRobSA9ICgpID0+IHVuZGVybHlpbmdCeXRlU291cmNlLnB1bGwhKGNvbnRyb2xsZXIpO1xuICB9IGVsc2Uge1xuICAgIHB1bGxBbGdvcml0aG0gPSAoKSA9PiBwcm9taXNlUmVzb2x2ZWRXaXRoKHVuZGVmaW5lZCk7XG4gIH1cbiAgaWYgKHVuZGVybHlpbmdCeXRlU291cmNlLmNhbmNlbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgY2FuY2VsQWxnb3JpdGhtID0gcmVhc29uID0+IHVuZGVybHlpbmdCeXRlU291cmNlLmNhbmNlbCEocmVhc29uKTtcbiAgfSBlbHNlIHtcbiAgICBjYW5jZWxBbGdvcml0aG0gPSAoKSA9PiBwcm9taXNlUmVzb2x2ZWRXaXRoKHVuZGVmaW5lZCk7XG4gIH1cblxuICBjb25zdCBhdXRvQWxsb2NhdGVDaHVua1NpemUgPSB1bmRlcmx5aW5nQnl0ZVNvdXJjZS5hdXRvQWxsb2NhdGVDaHVua1NpemU7XG4gIGlmIChhdXRvQWxsb2NhdGVDaHVua1NpemUgPT09IDApIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdhdXRvQWxsb2NhdGVDaHVua1NpemUgbXVzdCBiZSBncmVhdGVyIHRoYW4gMCcpO1xuICB9XG5cbiAgU2V0VXBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyKFxuICAgIHN0cmVhbSwgY29udHJvbGxlciwgc3RhcnRBbGdvcml0aG0sIHB1bGxBbGdvcml0aG0sIGNhbmNlbEFsZ29yaXRobSwgaGlnaFdhdGVyTWFyaywgYXV0b0FsbG9jYXRlQ2h1bmtTaXplXG4gICk7XG59XG5cbmZ1bmN0aW9uIFNldFVwUmVhZGFibGVTdHJlYW1CWU9CUmVxdWVzdChyZXF1ZXN0OiBSZWFkYWJsZVN0cmVhbUJZT0JSZXF1ZXN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlldzogTm9uU2hhcmVkPEFycmF5QnVmZmVyVmlldz4pIHtcbiAgYXNzZXJ0KElzUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcihjb250cm9sbGVyKSk7XG4gIGFzc2VydCh0eXBlb2YgdmlldyA9PT0gJ29iamVjdCcpO1xuICBhc3NlcnQoQXJyYXlCdWZmZXIuaXNWaWV3KHZpZXcpKTtcbiAgYXNzZXJ0KCFJc0RldGFjaGVkQnVmZmVyKHZpZXcuYnVmZmVyKSk7XG4gIHJlcXVlc3QuX2Fzc29jaWF0ZWRSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyID0gY29udHJvbGxlcjtcbiAgcmVxdWVzdC5fdmlldyA9IHZpZXc7XG59XG5cbi8vIEhlbHBlciBmdW5jdGlvbnMgZm9yIHRoZSBSZWFkYWJsZVN0cmVhbUJZT0JSZXF1ZXN0LlxuXG5mdW5jdGlvbiBieW9iUmVxdWVzdEJyYW5kQ2hlY2tFeGNlcHRpb24obmFtZTogc3RyaW5nKTogVHlwZUVycm9yIHtcbiAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoXG4gICAgYFJlYWRhYmxlU3RyZWFtQllPQlJlcXVlc3QucHJvdG90eXBlLiR7bmFtZX0gY2FuIG9ubHkgYmUgdXNlZCBvbiBhIFJlYWRhYmxlU3RyZWFtQllPQlJlcXVlc3RgKTtcbn1cblxuLy8gSGVscGVyIGZ1bmN0aW9ucyBmb3IgdGhlIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIuXG5cbmZ1bmN0aW9uIGJ5dGVTdHJlYW1Db250cm9sbGVyQnJhbmRDaGVja0V4Y2VwdGlvbihuYW1lOiBzdHJpbmcpOiBUeXBlRXJyb3Ige1xuICByZXR1cm4gbmV3IFR5cGVFcnJvcihcbiAgICBgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlci5wcm90b3R5cGUuJHtuYW1lfSBjYW4gb25seSBiZSB1c2VkIG9uIGEgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcmApO1xufVxuIiwgImltcG9ydCB7IGFzc2VydERpY3Rpb25hcnksIGNvbnZlcnRVbnNpZ25lZExvbmdMb25nV2l0aEVuZm9yY2VSYW5nZSB9IGZyb20gJy4vYmFzaWMnO1xuaW1wb3J0IHR5cGUge1xuICBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXJSZWFkT3B0aW9ucyxcbiAgUmVhZGFibGVTdHJlYW1HZXRSZWFkZXJPcHRpb25zLFxuICBWYWxpZGF0ZWRSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXJSZWFkT3B0aW9uc1xufSBmcm9tICcuLi9yZWFkYWJsZS1zdHJlYW0vcmVhZGVyLW9wdGlvbnMnO1xuXG5leHBvcnQgZnVuY3Rpb24gY29udmVydFJlYWRlck9wdGlvbnMob3B0aW9uczogUmVhZGFibGVTdHJlYW1HZXRSZWFkZXJPcHRpb25zIHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiBzdHJpbmcpOiBSZWFkYWJsZVN0cmVhbUdldFJlYWRlck9wdGlvbnMge1xuICBhc3NlcnREaWN0aW9uYXJ5KG9wdGlvbnMsIGNvbnRleHQpO1xuICBjb25zdCBtb2RlID0gb3B0aW9ucz8ubW9kZTtcbiAgcmV0dXJuIHtcbiAgICBtb2RlOiBtb2RlID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWQgOiBjb252ZXJ0UmVhZGFibGVTdHJlYW1SZWFkZXJNb2RlKG1vZGUsIGAke2NvbnRleHR9IGhhcyBtZW1iZXIgJ21vZGUnIHRoYXRgKVxuICB9O1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0UmVhZGFibGVTdHJlYW1SZWFkZXJNb2RlKG1vZGU6IHN0cmluZywgY29udGV4dDogc3RyaW5nKTogJ2J5b2InIHtcbiAgbW9kZSA9IGAke21vZGV9YDtcbiAgaWYgKG1vZGUgIT09ICdieW9iJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYCR7Y29udGV4dH0gJyR7bW9kZX0nIGlzIG5vdCBhIHZhbGlkIGVudW1lcmF0aW9uIHZhbHVlIGZvciBSZWFkYWJsZVN0cmVhbVJlYWRlck1vZGVgKTtcbiAgfVxuICByZXR1cm4gbW9kZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRCeW9iUmVhZE9wdGlvbnMoXG4gIG9wdGlvbnM6IFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlclJlYWRPcHRpb25zIHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgY29udGV4dDogc3RyaW5nXG4pOiBWYWxpZGF0ZWRSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXJSZWFkT3B0aW9ucyB7XG4gIGFzc2VydERpY3Rpb25hcnkob3B0aW9ucywgY29udGV4dCk7XG4gIGNvbnN0IG1pbiA9IG9wdGlvbnM/Lm1pbiA/PyAxO1xuICByZXR1cm4ge1xuICAgIG1pbjogY29udmVydFVuc2lnbmVkTG9uZ0xvbmdXaXRoRW5mb3JjZVJhbmdlKFxuICAgICAgbWluLFxuICAgICAgYCR7Y29udGV4dH0gaGFzIG1lbWJlciAnbWluJyB0aGF0YFxuICAgIClcbiAgfTtcbn1cbiIsICJpbXBvcnQgYXNzZXJ0IGZyb20gJy4uLy4uL3N0dWIvYXNzZXJ0JztcbmltcG9ydCB7IFNpbXBsZVF1ZXVlIH0gZnJvbSAnLi4vc2ltcGxlLXF1ZXVlJztcbmltcG9ydCB7XG4gIFJlYWRhYmxlU3RyZWFtUmVhZGVyR2VuZXJpY0NhbmNlbCxcbiAgUmVhZGFibGVTdHJlYW1SZWFkZXJHZW5lcmljSW5pdGlhbGl6ZSxcbiAgUmVhZGFibGVTdHJlYW1SZWFkZXJHZW5lcmljUmVsZWFzZSxcbiAgcmVhZGVyTG9ja0V4Y2VwdGlvblxufSBmcm9tICcuL2dlbmVyaWMtcmVhZGVyJztcbmltcG9ydCB7IElzUmVhZGFibGVTdHJlYW1Mb2NrZWQsIHR5cGUgUmVhZGFibGVCeXRlU3RyZWFtLCB0eXBlIFJlYWRhYmxlU3RyZWFtIH0gZnJvbSAnLi4vcmVhZGFibGUtc3RyZWFtJztcbmltcG9ydCB7XG4gIElzUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcixcbiAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcixcbiAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclB1bGxJbnRvXG59IGZyb20gJy4vYnl0ZS1zdHJlYW0tY29udHJvbGxlcic7XG5pbXBvcnQgeyBzZXRGdW5jdGlvbk5hbWUsIHR5cGVJc09iamVjdCB9IGZyb20gJy4uL2hlbHBlcnMvbWlzY2VsbGFuZW91cyc7XG5pbXBvcnQgeyBuZXdQcm9taXNlLCBwcm9taXNlUmVqZWN0ZWRXaXRoIH0gZnJvbSAnLi4vaGVscGVycy93ZWJpZGwnO1xuaW1wb3J0IHsgYXNzZXJ0UmVxdWlyZWRBcmd1bWVudCB9IGZyb20gJy4uL3ZhbGlkYXRvcnMvYmFzaWMnO1xuaW1wb3J0IHsgYXNzZXJ0UmVhZGFibGVTdHJlYW0gfSBmcm9tICcuLi92YWxpZGF0b3JzL3JlYWRhYmxlLXN0cmVhbSc7XG5pbXBvcnQgeyBJc0RldGFjaGVkQnVmZmVyIH0gZnJvbSAnLi4vYWJzdHJhY3Qtb3BzL2VjbWFzY3JpcHQnO1xuaW1wb3J0IHR5cGUge1xuICBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXJSZWFkT3B0aW9ucyxcbiAgVmFsaWRhdGVkUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyUmVhZE9wdGlvbnNcbn0gZnJvbSAnLi9yZWFkZXItb3B0aW9ucyc7XG5pbXBvcnQgeyBjb252ZXJ0QnlvYlJlYWRPcHRpb25zIH0gZnJvbSAnLi4vdmFsaWRhdG9ycy9yZWFkZXItb3B0aW9ucyc7XG5pbXBvcnQgeyBpc0RhdGFWaWV3LCB0eXBlIE5vblNoYXJlZCwgdHlwZSBUeXBlZEFycmF5IH0gZnJvbSAnLi4vaGVscGVycy9hcnJheS1idWZmZXItdmlldyc7XG5cbi8qKlxuICogQSByZXN1bHQgcmV0dXJuZWQgYnkge0BsaW5rIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlci5yZWFkfS5cbiAqXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCB0eXBlIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRSZXN1bHQ8VCBleHRlbmRzIEFycmF5QnVmZmVyVmlldz4gPSB7XG4gIGRvbmU6IGZhbHNlO1xuICB2YWx1ZTogVDtcbn0gfCB7XG4gIGRvbmU6IHRydWU7XG4gIHZhbHVlOiBUIHwgdW5kZWZpbmVkO1xufTtcblxuLy8gQWJzdHJhY3Qgb3BlcmF0aW9ucyBmb3IgdGhlIFJlYWRhYmxlU3RyZWFtLlxuXG5leHBvcnQgZnVuY3Rpb24gQWNxdWlyZVJlYWRhYmxlU3RyZWFtQllPQlJlYWRlcihzdHJlYW06IFJlYWRhYmxlQnl0ZVN0cmVhbSk6IFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlciB7XG4gIHJldHVybiBuZXcgUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyKHN0cmVhbSBhcyBSZWFkYWJsZVN0cmVhbTxVaW50OEFycmF5Pik7XG59XG5cbi8vIFJlYWRhYmxlU3RyZWFtIEFQSSBleHBvc2VkIGZvciBjb250cm9sbGVycy5cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtQWRkUmVhZEludG9SZXF1ZXN0PFQgZXh0ZW5kcyBOb25TaGFyZWQ8QXJyYXlCdWZmZXJWaWV3Pj4oXG4gIHN0cmVhbTogUmVhZGFibGVCeXRlU3RyZWFtLFxuICByZWFkSW50b1JlcXVlc3Q6IFJlYWRJbnRvUmVxdWVzdDxUPlxuKTogdm9pZCB7XG4gIGFzc2VydChJc1JlYWRhYmxlU3RyZWFtQllPQlJlYWRlcihzdHJlYW0uX3JlYWRlcikpO1xuICBhc3NlcnQoc3RyZWFtLl9zdGF0ZSA9PT0gJ3JlYWRhYmxlJyB8fCBzdHJlYW0uX3N0YXRlID09PSAnY2xvc2VkJyk7XG5cbiAgKHN0cmVhbS5fcmVhZGVyISBhcyBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIpLl9yZWFkSW50b1JlcXVlc3RzLnB1c2gocmVhZEludG9SZXF1ZXN0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtRnVsZmlsbFJlYWRJbnRvUmVxdWVzdChzdHJlYW06IFJlYWRhYmxlQnl0ZVN0cmVhbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2h1bms6IEFycmF5QnVmZmVyVmlldyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9uZTogYm9vbGVhbikge1xuICBjb25zdCByZWFkZXIgPSBzdHJlYW0uX3JlYWRlciBhcyBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXI7XG5cbiAgYXNzZXJ0KHJlYWRlci5fcmVhZEludG9SZXF1ZXN0cy5sZW5ndGggPiAwKTtcblxuICBjb25zdCByZWFkSW50b1JlcXVlc3QgPSByZWFkZXIuX3JlYWRJbnRvUmVxdWVzdHMuc2hpZnQoKSE7XG4gIGlmIChkb25lKSB7XG4gICAgcmVhZEludG9SZXF1ZXN0Ll9jbG9zZVN0ZXBzKGNodW5rKTtcbiAgfSBlbHNlIHtcbiAgICByZWFkSW50b1JlcXVlc3QuX2NodW5rU3RlcHMoY2h1bmspO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZVN0cmVhbUdldE51bVJlYWRJbnRvUmVxdWVzdHMoc3RyZWFtOiBSZWFkYWJsZUJ5dGVTdHJlYW0pOiBudW1iZXIge1xuICByZXR1cm4gKHN0cmVhbS5fcmVhZGVyIGFzIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlcikuX3JlYWRJbnRvUmVxdWVzdHMubGVuZ3RoO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1IYXNCWU9CUmVhZGVyKHN0cmVhbTogUmVhZGFibGVCeXRlU3RyZWFtKTogYm9vbGVhbiB7XG4gIGNvbnN0IHJlYWRlciA9IHN0cmVhbS5fcmVhZGVyO1xuXG4gIGlmIChyZWFkZXIgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICghSXNSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIocmVhZGVyKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG4vLyBSZWFkZXJzXG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVhZEludG9SZXF1ZXN0PFQgZXh0ZW5kcyBOb25TaGFyZWQ8QXJyYXlCdWZmZXJWaWV3Pj4ge1xuICBfY2h1bmtTdGVwcyhjaHVuazogVCk6IHZvaWQ7XG5cbiAgX2Nsb3NlU3RlcHMoY2h1bms6IFQgfCB1bmRlZmluZWQpOiB2b2lkO1xuXG4gIF9lcnJvclN0ZXBzKGU6IGFueSk6IHZvaWQ7XG59XG5cbi8qKlxuICogQSBCWU9CIHJlYWRlciB2ZW5kZWQgYnkgYSB7QGxpbmsgUmVhZGFibGVTdHJlYW19LlxuICpcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNsYXNzIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlciB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX293bmVyUmVhZGFibGVTdHJlYW0hOiBSZWFkYWJsZUJ5dGVTdHJlYW07XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2Nsb3NlZFByb21pc2UhOiBQcm9taXNlPHVuZGVmaW5lZD47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2Nsb3NlZFByb21pc2VfcmVzb2x2ZT86ICh2YWx1ZT86IHVuZGVmaW5lZCkgPT4gdm9pZDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfY2xvc2VkUHJvbWlzZV9yZWplY3Q/OiAocmVhc29uOiBhbnkpID0+IHZvaWQ7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3JlYWRJbnRvUmVxdWVzdHM6IFNpbXBsZVF1ZXVlPFJlYWRJbnRvUmVxdWVzdDxhbnk+PjtcblxuICBjb25zdHJ1Y3RvcihzdHJlYW06IFJlYWRhYmxlU3RyZWFtPFVpbnQ4QXJyYXk+KSB7XG4gICAgYXNzZXJ0UmVxdWlyZWRBcmd1bWVudChzdHJlYW0sIDEsICdSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXInKTtcbiAgICBhc3NlcnRSZWFkYWJsZVN0cmVhbShzdHJlYW0sICdGaXJzdCBwYXJhbWV0ZXInKTtcblxuICAgIGlmIChJc1JlYWRhYmxlU3RyZWFtTG9ja2VkKHN0cmVhbSkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoaXMgc3RyZWFtIGhhcyBhbHJlYWR5IGJlZW4gbG9ja2VkIGZvciBleGNsdXNpdmUgcmVhZGluZyBieSBhbm90aGVyIHJlYWRlcicpO1xuICAgIH1cblxuICAgIGlmICghSXNSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyKHN0cmVhbS5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNvbnN0cnVjdCBhIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlciBmb3IgYSBzdHJlYW0gbm90IGNvbnN0cnVjdGVkIHdpdGggYSBieXRlICcgK1xuICAgICAgICAnc291cmNlJyk7XG4gICAgfVxuXG4gICAgUmVhZGFibGVTdHJlYW1SZWFkZXJHZW5lcmljSW5pdGlhbGl6ZSh0aGlzLCBzdHJlYW0pO1xuXG4gICAgdGhpcy5fcmVhZEludG9SZXF1ZXN0cyA9IG5ldyBTaW1wbGVRdWV1ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBwcm9taXNlIHRoYXQgd2lsbCBiZSBmdWxmaWxsZWQgd2hlbiB0aGUgc3RyZWFtIGJlY29tZXMgY2xvc2VkLCBvciByZWplY3RlZCBpZiB0aGUgc3RyZWFtIGV2ZXIgZXJyb3JzIG9yXG4gICAqIHRoZSByZWFkZXIncyBsb2NrIGlzIHJlbGVhc2VkIGJlZm9yZSB0aGUgc3RyZWFtIGZpbmlzaGVzIGNsb3NpbmcuXG4gICAqL1xuICBnZXQgY2xvc2VkKCk6IFByb21pc2U8dW5kZWZpbmVkPiB7XG4gICAgaWYgKCFJc1JlYWRhYmxlU3RyZWFtQllPQlJlYWRlcih0aGlzKSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoYnlvYlJlYWRlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ2Nsb3NlZCcpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fY2xvc2VkUHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJZiB0aGUgcmVhZGVyIGlzIGFjdGl2ZSwgYmVoYXZlcyB0aGUgc2FtZSBhcyB7QGxpbmsgUmVhZGFibGVTdHJlYW0uY2FuY2VsIHwgc3RyZWFtLmNhbmNlbChyZWFzb24pfS5cbiAgICovXG4gIGNhbmNlbChyZWFzb246IGFueSA9IHVuZGVmaW5lZCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghSXNSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIodGhpcykpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKGJ5b2JSZWFkZXJCcmFuZENoZWNrRXhjZXB0aW9uKCdjYW5jZWwnKSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX293bmVyUmVhZGFibGVTdHJlYW0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgocmVhZGVyTG9ja0V4Y2VwdGlvbignY2FuY2VsJykpO1xuICAgIH1cblxuICAgIHJldHVybiBSZWFkYWJsZVN0cmVhbVJlYWRlckdlbmVyaWNDYW5jZWwodGhpcywgcmVhc29uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRlbXB0cyB0byByZWFkcyBieXRlcyBpbnRvIHZpZXcsIGFuZCByZXR1cm5zIGEgcHJvbWlzZSByZXNvbHZlZCB3aXRoIHRoZSByZXN1bHQuXG4gICAqXG4gICAqIElmIHJlYWRpbmcgYSBjaHVuayBjYXVzZXMgdGhlIHF1ZXVlIHRvIGJlY29tZSBlbXB0eSwgbW9yZSBkYXRhIHdpbGwgYmUgcHVsbGVkIGZyb20gdGhlIHVuZGVybHlpbmcgc291cmNlLlxuICAgKi9cbiAgcmVhZDxUIGV4dGVuZHMgQXJyYXlCdWZmZXJWaWV3PihcbiAgICB2aWV3OiBULFxuICAgIG9wdGlvbnM/OiBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXJSZWFkT3B0aW9uc1xuICApOiBQcm9taXNlPFJlYWRhYmxlU3RyZWFtQllPQlJlYWRSZXN1bHQ8VD4+O1xuICByZWFkPFQgZXh0ZW5kcyBOb25TaGFyZWQ8QXJyYXlCdWZmZXJWaWV3Pj4oXG4gICAgdmlldzogVCxcbiAgICByYXdPcHRpb25zOiBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXJSZWFkT3B0aW9ucyB8IG51bGwgfCB1bmRlZmluZWQgPSB7fVxuICApOiBQcm9taXNlPFJlYWRhYmxlU3RyZWFtQllPQlJlYWRSZXN1bHQ8VD4+IHtcbiAgICBpZiAoIUlzUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyKHRoaXMpKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChieW9iUmVhZGVyQnJhbmRDaGVja0V4Y2VwdGlvbigncmVhZCcpKTtcbiAgICB9XG5cbiAgICBpZiAoIUFycmF5QnVmZmVyLmlzVmlldyh2aWV3KSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgobmV3IFR5cGVFcnJvcigndmlldyBtdXN0IGJlIGFuIGFycmF5IGJ1ZmZlciB2aWV3JykpO1xuICAgIH1cbiAgICBpZiAodmlldy5ieXRlTGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChuZXcgVHlwZUVycm9yKCd2aWV3IG11c3QgaGF2ZSBub24temVybyBieXRlTGVuZ3RoJykpO1xuICAgIH1cbiAgICBpZiAodmlldy5idWZmZXIuYnl0ZUxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgobmV3IFR5cGVFcnJvcihgdmlldydzIGJ1ZmZlciBtdXN0IGhhdmUgbm9uLXplcm8gYnl0ZUxlbmd0aGApKTtcbiAgICB9XG4gICAgaWYgKElzRGV0YWNoZWRCdWZmZXIodmlldy5idWZmZXIpKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChuZXcgVHlwZUVycm9yKCd2aWV3XFwncyBidWZmZXIgaGFzIGJlZW4gZGV0YWNoZWQnKSk7XG4gICAgfVxuXG4gICAgbGV0IG9wdGlvbnM6IFZhbGlkYXRlZFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlclJlYWRPcHRpb25zO1xuICAgIHRyeSB7XG4gICAgICBvcHRpb25zID0gY29udmVydEJ5b2JSZWFkT3B0aW9ucyhyYXdPcHRpb25zLCAnb3B0aW9ucycpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKGUpO1xuICAgIH1cbiAgICBjb25zdCBtaW4gPSBvcHRpb25zLm1pbjtcbiAgICBpZiAobWluID09PSAwKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChuZXcgVHlwZUVycm9yKCdvcHRpb25zLm1pbiBtdXN0IGJlIGdyZWF0ZXIgdGhhbiAwJykpO1xuICAgIH1cbiAgICBpZiAoIWlzRGF0YVZpZXcodmlldykpIHtcbiAgICAgIGlmIChtaW4gPiAodmlldyBhcyB1bmtub3duIGFzIFR5cGVkQXJyYXkpLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChuZXcgUmFuZ2VFcnJvcignb3B0aW9ucy5taW4gbXVzdCBiZSBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gdmlld1xcJ3MgbGVuZ3RoJykpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAobWluID4gdmlldy5ieXRlTGVuZ3RoKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChuZXcgUmFuZ2VFcnJvcignb3B0aW9ucy5taW4gbXVzdCBiZSBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gdmlld1xcJ3MgYnl0ZUxlbmd0aCcpKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fb3duZXJSZWFkYWJsZVN0cmVhbSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChyZWFkZXJMb2NrRXhjZXB0aW9uKCdyZWFkIGZyb20nKSk7XG4gICAgfVxuXG4gICAgbGV0IHJlc29sdmVQcm9taXNlITogKHJlc3VsdDogUmVhZGFibGVTdHJlYW1CWU9CUmVhZFJlc3VsdDxUPikgPT4gdm9pZDtcbiAgICBsZXQgcmVqZWN0UHJvbWlzZSE6IChyZWFzb246IGFueSkgPT4gdm9pZDtcbiAgICBjb25zdCBwcm9taXNlID0gbmV3UHJvbWlzZTxSZWFkYWJsZVN0cmVhbUJZT0JSZWFkUmVzdWx0PFQ+PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICByZXNvbHZlUHJvbWlzZSA9IHJlc29sdmU7XG4gICAgICByZWplY3RQcm9taXNlID0gcmVqZWN0O1xuICAgIH0pO1xuICAgIGNvbnN0IHJlYWRJbnRvUmVxdWVzdDogUmVhZEludG9SZXF1ZXN0PFQ+ID0ge1xuICAgICAgX2NodW5rU3RlcHM6IGNodW5rID0+IHJlc29sdmVQcm9taXNlKHsgdmFsdWU6IGNodW5rLCBkb25lOiBmYWxzZSB9KSxcbiAgICAgIF9jbG9zZVN0ZXBzOiBjaHVuayA9PiByZXNvbHZlUHJvbWlzZSh7IHZhbHVlOiBjaHVuaywgZG9uZTogdHJ1ZSB9KSxcbiAgICAgIF9lcnJvclN0ZXBzOiBlID0+IHJlamVjdFByb21pc2UoZSlcbiAgICB9O1xuICAgIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlclJlYWQodGhpcywgdmlldywgbWluLCByZWFkSW50b1JlcXVlc3QpO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbGVhc2VzIHRoZSByZWFkZXIncyBsb2NrIG9uIHRoZSBjb3JyZXNwb25kaW5nIHN0cmVhbS4gQWZ0ZXIgdGhlIGxvY2sgaXMgcmVsZWFzZWQsIHRoZSByZWFkZXIgaXMgbm8gbG9uZ2VyIGFjdGl2ZS5cbiAgICogSWYgdGhlIGFzc29jaWF0ZWQgc3RyZWFtIGlzIGVycm9yZWQgd2hlbiB0aGUgbG9jayBpcyByZWxlYXNlZCwgdGhlIHJlYWRlciB3aWxsIGFwcGVhciBlcnJvcmVkIGluIHRoZSBzYW1lIHdheVxuICAgKiBmcm9tIG5vdyBvbjsgb3RoZXJ3aXNlLCB0aGUgcmVhZGVyIHdpbGwgYXBwZWFyIGNsb3NlZC5cbiAgICpcbiAgICogQSByZWFkZXIncyBsb2NrIGNhbm5vdCBiZSByZWxlYXNlZCB3aGlsZSBpdCBzdGlsbCBoYXMgYSBwZW5kaW5nIHJlYWQgcmVxdWVzdCwgaS5lLiwgaWYgYSBwcm9taXNlIHJldHVybmVkIGJ5XG4gICAqIHRoZSByZWFkZXIncyB7QGxpbmsgUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyLnJlYWQgfCByZWFkKCl9IG1ldGhvZCBoYXMgbm90IHlldCBiZWVuIHNldHRsZWQuIEF0dGVtcHRpbmcgdG9cbiAgICogZG8gc28gd2lsbCB0aHJvdyBhIGBUeXBlRXJyb3JgIGFuZCBsZWF2ZSB0aGUgcmVhZGVyIGxvY2tlZCB0byB0aGUgc3RyZWFtLlxuICAgKi9cbiAgcmVsZWFzZUxvY2soKTogdm9pZCB7XG4gICAgaWYgKCFJc1JlYWRhYmxlU3RyZWFtQllPQlJlYWRlcih0aGlzKSkge1xuICAgICAgdGhyb3cgYnlvYlJlYWRlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ3JlbGVhc2VMb2NrJyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX293bmVyUmVhZGFibGVTdHJlYW0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlclJlbGVhc2UodGhpcyk7XG4gIH1cbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyLnByb3RvdHlwZSwge1xuICBjYW5jZWw6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICByZWFkOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgcmVsZWFzZUxvY2s6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICBjbG9zZWQ6IHsgZW51bWVyYWJsZTogdHJ1ZSB9XG59KTtcbnNldEZ1bmN0aW9uTmFtZShSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIucHJvdG90eXBlLmNhbmNlbCwgJ2NhbmNlbCcpO1xuc2V0RnVuY3Rpb25OYW1lKFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlci5wcm90b3R5cGUucmVhZCwgJ3JlYWQnKTtcbnNldEZ1bmN0aW9uTmFtZShSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIucHJvdG90eXBlLnJlbGVhc2VMb2NrLCAncmVsZWFzZUxvY2snKTtcbmlmICh0eXBlb2YgU3ltYm9sLnRvU3RyaW5nVGFnID09PSAnc3ltYm9sJykge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyLnByb3RvdHlwZSwgU3ltYm9sLnRvU3RyaW5nVGFnLCB7XG4gICAgdmFsdWU6ICdSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXInLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbn1cblxuLy8gQWJzdHJhY3Qgb3BlcmF0aW9ucyBmb3IgdGhlIHJlYWRlcnMuXG5cbmV4cG9ydCBmdW5jdGlvbiBJc1JlYWRhYmxlU3RyZWFtQllPQlJlYWRlcih4OiBhbnkpOiB4IGlzIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlciB7XG4gIGlmICghdHlwZUlzT2JqZWN0KHgpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoeCwgJ19yZWFkSW50b1JlcXVlc3RzJykpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4geCBpbnN0YW5jZW9mIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlclJlYWQ8VCBleHRlbmRzIE5vblNoYXJlZDxBcnJheUJ1ZmZlclZpZXc+PihcbiAgcmVhZGVyOiBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIsXG4gIHZpZXc6IFQsXG4gIG1pbjogbnVtYmVyLFxuICByZWFkSW50b1JlcXVlc3Q6IFJlYWRJbnRvUmVxdWVzdDxUPlxuKTogdm9pZCB7XG4gIGNvbnN0IHN0cmVhbSA9IHJlYWRlci5fb3duZXJSZWFkYWJsZVN0cmVhbTtcblxuICBhc3NlcnQoc3RyZWFtICE9PSB1bmRlZmluZWQpO1xuXG4gIHN0cmVhbS5fZGlzdHVyYmVkID0gdHJ1ZTtcblxuICBpZiAoc3RyZWFtLl9zdGF0ZSA9PT0gJ2Vycm9yZWQnKSB7XG4gICAgcmVhZEludG9SZXF1ZXN0Ll9lcnJvclN0ZXBzKHN0cmVhbS5fc3RvcmVkRXJyb3IpO1xuICB9IGVsc2Uge1xuICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJQdWxsSW50byhcbiAgICAgIHN0cmVhbS5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyIGFzIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIsXG4gICAgICB2aWV3LFxuICAgICAgbWluLFxuICAgICAgcmVhZEludG9SZXF1ZXN0XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyUmVsZWFzZShyZWFkZXI6IFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlcikge1xuICBSZWFkYWJsZVN0cmVhbVJlYWRlckdlbmVyaWNSZWxlYXNlKHJlYWRlcik7XG4gIGNvbnN0IGUgPSBuZXcgVHlwZUVycm9yKCdSZWFkZXIgd2FzIHJlbGVhc2VkJyk7XG4gIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlckVycm9yUmVhZEludG9SZXF1ZXN0cyhyZWFkZXIsIGUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyRXJyb3JSZWFkSW50b1JlcXVlc3RzKHJlYWRlcjogUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyLCBlOiBhbnkpIHtcbiAgY29uc3QgcmVhZEludG9SZXF1ZXN0cyA9IHJlYWRlci5fcmVhZEludG9SZXF1ZXN0cztcbiAgcmVhZGVyLl9yZWFkSW50b1JlcXVlc3RzID0gbmV3IFNpbXBsZVF1ZXVlKCk7XG4gIHJlYWRJbnRvUmVxdWVzdHMuZm9yRWFjaChyZWFkSW50b1JlcXVlc3QgPT4ge1xuICAgIHJlYWRJbnRvUmVxdWVzdC5fZXJyb3JTdGVwcyhlKTtcbiAgfSk7XG59XG5cbi8vIEhlbHBlciBmdW5jdGlvbnMgZm9yIHRoZSBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIuXG5cbmZ1bmN0aW9uIGJ5b2JSZWFkZXJCcmFuZENoZWNrRXhjZXB0aW9uKG5hbWU6IHN0cmluZyk6IFR5cGVFcnJvciB7XG4gIHJldHVybiBuZXcgVHlwZUVycm9yKFxuICAgIGBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIucHJvdG90eXBlLiR7bmFtZX0gY2FuIG9ubHkgYmUgdXNlZCBvbiBhIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlcmApO1xufVxuIiwgImltcG9ydCB0eXBlIHsgUXVldWluZ1N0cmF0ZWd5LCBRdWV1aW5nU3RyYXRlZ3lTaXplQ2FsbGJhY2sgfSBmcm9tICcuLi9xdWV1aW5nLXN0cmF0ZWd5JztcbmltcG9ydCBOdW1iZXJJc05hTiBmcm9tICcuLi8uLi9zdHViL251bWJlci1pc25hbic7XG5cbmV4cG9ydCBmdW5jdGlvbiBFeHRyYWN0SGlnaFdhdGVyTWFyayhzdHJhdGVneTogUXVldWluZ1N0cmF0ZWd5LCBkZWZhdWx0SFdNOiBudW1iZXIpOiBudW1iZXIge1xuICBjb25zdCB7IGhpZ2hXYXRlck1hcmsgfSA9IHN0cmF0ZWd5O1xuXG4gIGlmIChoaWdoV2F0ZXJNYXJrID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gZGVmYXVsdEhXTTtcbiAgfVxuXG4gIGlmIChOdW1iZXJJc05hTihoaWdoV2F0ZXJNYXJrKSB8fCBoaWdoV2F0ZXJNYXJrIDwgMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbnZhbGlkIGhpZ2hXYXRlck1hcmsnKTtcbiAgfVxuXG4gIHJldHVybiBoaWdoV2F0ZXJNYXJrO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gRXh0cmFjdFNpemVBbGdvcml0aG08VD4oc3RyYXRlZ3k6IFF1ZXVpbmdTdHJhdGVneTxUPik6IFF1ZXVpbmdTdHJhdGVneVNpemVDYWxsYmFjazxUPiB7XG4gIGNvbnN0IHsgc2l6ZSB9ID0gc3RyYXRlZ3k7XG5cbiAgaWYgKCFzaXplKSB7XG4gICAgcmV0dXJuICgpID0+IDE7XG4gIH1cblxuICByZXR1cm4gc2l6ZTtcbn1cbiIsICJpbXBvcnQgdHlwZSB7IFF1ZXVpbmdTdHJhdGVneSwgUXVldWluZ1N0cmF0ZWd5U2l6ZUNhbGxiYWNrIH0gZnJvbSAnLi4vcXVldWluZy1zdHJhdGVneSc7XG5pbXBvcnQgeyBhc3NlcnREaWN0aW9uYXJ5LCBhc3NlcnRGdW5jdGlvbiwgY29udmVydFVucmVzdHJpY3RlZERvdWJsZSB9IGZyb20gJy4vYmFzaWMnO1xuXG5leHBvcnQgZnVuY3Rpb24gY29udmVydFF1ZXVpbmdTdHJhdGVneTxUPihpbml0OiBRdWV1aW5nU3RyYXRlZ3k8VD4gfCBudWxsIHwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dDogc3RyaW5nKTogUXVldWluZ1N0cmF0ZWd5PFQ+IHtcbiAgYXNzZXJ0RGljdGlvbmFyeShpbml0LCBjb250ZXh0KTtcbiAgY29uc3QgaGlnaFdhdGVyTWFyayA9IGluaXQ/LmhpZ2hXYXRlck1hcms7XG4gIGNvbnN0IHNpemUgPSBpbml0Py5zaXplO1xuICByZXR1cm4ge1xuICAgIGhpZ2hXYXRlck1hcms6IGhpZ2hXYXRlck1hcmsgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZCA6IGNvbnZlcnRVbnJlc3RyaWN0ZWREb3VibGUoaGlnaFdhdGVyTWFyayksXG4gICAgc2l6ZTogc2l6ZSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogY29udmVydFF1ZXVpbmdTdHJhdGVneVNpemUoc2l6ZSwgYCR7Y29udGV4dH0gaGFzIG1lbWJlciAnc2l6ZScgdGhhdGApXG4gIH07XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRRdWV1aW5nU3RyYXRlZ3lTaXplPFQ+KGZuOiBRdWV1aW5nU3RyYXRlZ3lTaXplQ2FsbGJhY2s8VD4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiBzdHJpbmcpOiBRdWV1aW5nU3RyYXRlZ3lTaXplQ2FsbGJhY2s8VD4ge1xuICBhc3NlcnRGdW5jdGlvbihmbiwgY29udGV4dCk7XG4gIHJldHVybiBjaHVuayA9PiBjb252ZXJ0VW5yZXN0cmljdGVkRG91YmxlKGZuKGNodW5rKSk7XG59XG4iLCAiaW1wb3J0IHsgYXNzZXJ0RGljdGlvbmFyeSwgYXNzZXJ0RnVuY3Rpb24gfSBmcm9tICcuL2Jhc2ljJztcbmltcG9ydCB7IHByb21pc2VDYWxsLCByZWZsZWN0Q2FsbCB9IGZyb20gJy4uL2hlbHBlcnMvd2ViaWRsJztcbmltcG9ydCB0eXBlIHtcbiAgVW5kZXJseWluZ1NpbmssXG4gIFVuZGVybHlpbmdTaW5rQWJvcnRDYWxsYmFjayxcbiAgVW5kZXJseWluZ1NpbmtDbG9zZUNhbGxiYWNrLFxuICBVbmRlcmx5aW5nU2lua1N0YXJ0Q2FsbGJhY2ssXG4gIFVuZGVybHlpbmdTaW5rV3JpdGVDYWxsYmFjayxcbiAgVmFsaWRhdGVkVW5kZXJseWluZ1Npbmtcbn0gZnJvbSAnLi4vd3JpdGFibGUtc3RyZWFtL3VuZGVybHlpbmctc2luayc7XG5pbXBvcnQgeyBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyIH0gZnJvbSAnLi4vd3JpdGFibGUtc3RyZWFtJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRVbmRlcmx5aW5nU2luazxXPihvcmlnaW5hbDogVW5kZXJseWluZ1Npbms8Vz4gfCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiBzdHJpbmcpOiBWYWxpZGF0ZWRVbmRlcmx5aW5nU2luazxXPiB7XG4gIGFzc2VydERpY3Rpb25hcnkob3JpZ2luYWwsIGNvbnRleHQpO1xuICBjb25zdCBhYm9ydCA9IG9yaWdpbmFsPy5hYm9ydDtcbiAgY29uc3QgY2xvc2UgPSBvcmlnaW5hbD8uY2xvc2U7XG4gIGNvbnN0IHN0YXJ0ID0gb3JpZ2luYWw/LnN0YXJ0O1xuICBjb25zdCB0eXBlID0gb3JpZ2luYWw/LnR5cGU7XG4gIGNvbnN0IHdyaXRlID0gb3JpZ2luYWw/LndyaXRlO1xuICByZXR1cm4ge1xuICAgIGFib3J0OiBhYm9ydCA9PT0gdW5kZWZpbmVkID9cbiAgICAgIHVuZGVmaW5lZCA6XG4gICAgICBjb252ZXJ0VW5kZXJseWluZ1NpbmtBYm9ydENhbGxiYWNrKGFib3J0LCBvcmlnaW5hbCEsIGAke2NvbnRleHR9IGhhcyBtZW1iZXIgJ2Fib3J0JyB0aGF0YCksXG4gICAgY2xvc2U6IGNsb3NlID09PSB1bmRlZmluZWQgP1xuICAgICAgdW5kZWZpbmVkIDpcbiAgICAgIGNvbnZlcnRVbmRlcmx5aW5nU2lua0Nsb3NlQ2FsbGJhY2soY2xvc2UsIG9yaWdpbmFsISwgYCR7Y29udGV4dH0gaGFzIG1lbWJlciAnY2xvc2UnIHRoYXRgKSxcbiAgICBzdGFydDogc3RhcnQgPT09IHVuZGVmaW5lZCA/XG4gICAgICB1bmRlZmluZWQgOlxuICAgICAgY29udmVydFVuZGVybHlpbmdTaW5rU3RhcnRDYWxsYmFjayhzdGFydCwgb3JpZ2luYWwhLCBgJHtjb250ZXh0fSBoYXMgbWVtYmVyICdzdGFydCcgdGhhdGApLFxuICAgIHdyaXRlOiB3cml0ZSA9PT0gdW5kZWZpbmVkID9cbiAgICAgIHVuZGVmaW5lZCA6XG4gICAgICBjb252ZXJ0VW5kZXJseWluZ1NpbmtXcml0ZUNhbGxiYWNrKHdyaXRlLCBvcmlnaW5hbCEsIGAke2NvbnRleHR9IGhhcyBtZW1iZXIgJ3dyaXRlJyB0aGF0YCksXG4gICAgdHlwZVxuICB9O1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0VW5kZXJseWluZ1NpbmtBYm9ydENhbGxiYWNrKFxuICBmbjogVW5kZXJseWluZ1NpbmtBYm9ydENhbGxiYWNrLFxuICBvcmlnaW5hbDogVW5kZXJseWluZ1NpbmssXG4gIGNvbnRleHQ6IHN0cmluZ1xuKTogKHJlYXNvbjogYW55KSA9PiBQcm9taXNlPHZvaWQ+IHtcbiAgYXNzZXJ0RnVuY3Rpb24oZm4sIGNvbnRleHQpO1xuICByZXR1cm4gKHJlYXNvbjogYW55KSA9PiBwcm9taXNlQ2FsbChmbiwgb3JpZ2luYWwsIFtyZWFzb25dKTtcbn1cblxuZnVuY3Rpb24gY29udmVydFVuZGVybHlpbmdTaW5rQ2xvc2VDYWxsYmFjayhcbiAgZm46IFVuZGVybHlpbmdTaW5rQ2xvc2VDYWxsYmFjayxcbiAgb3JpZ2luYWw6IFVuZGVybHlpbmdTaW5rLFxuICBjb250ZXh0OiBzdHJpbmdcbik6ICgpID0+IFByb21pc2U8dm9pZD4ge1xuICBhc3NlcnRGdW5jdGlvbihmbiwgY29udGV4dCk7XG4gIHJldHVybiAoKSA9PiBwcm9taXNlQ2FsbChmbiwgb3JpZ2luYWwsIFtdKTtcbn1cblxuZnVuY3Rpb24gY29udmVydFVuZGVybHlpbmdTaW5rU3RhcnRDYWxsYmFjayhcbiAgZm46IFVuZGVybHlpbmdTaW5rU3RhcnRDYWxsYmFjayxcbiAgb3JpZ2luYWw6IFVuZGVybHlpbmdTaW5rLFxuICBjb250ZXh0OiBzdHJpbmdcbik6IFVuZGVybHlpbmdTaW5rU3RhcnRDYWxsYmFjayB7XG4gIGFzc2VydEZ1bmN0aW9uKGZuLCBjb250ZXh0KTtcbiAgcmV0dXJuIChjb250cm9sbGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyKSA9PiByZWZsZWN0Q2FsbChmbiwgb3JpZ2luYWwsIFtjb250cm9sbGVyXSk7XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRVbmRlcmx5aW5nU2lua1dyaXRlQ2FsbGJhY2s8Vz4oXG4gIGZuOiBVbmRlcmx5aW5nU2lua1dyaXRlQ2FsbGJhY2s8Vz4sXG4gIG9yaWdpbmFsOiBVbmRlcmx5aW5nU2luazxXPixcbiAgY29udGV4dDogc3RyaW5nXG4pOiAoY2h1bms6IFcsIGNvbnRyb2xsZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIpID0+IFByb21pc2U8dm9pZD4ge1xuICBhc3NlcnRGdW5jdGlvbihmbiwgY29udGV4dCk7XG4gIHJldHVybiAoY2h1bms6IFcsIGNvbnRyb2xsZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIpID0+IHByb21pc2VDYWxsKGZuLCBvcmlnaW5hbCwgW2NodW5rLCBjb250cm9sbGVyXSk7XG59XG4iLCAiaW1wb3J0IHsgSXNXcml0YWJsZVN0cmVhbSwgV3JpdGFibGVTdHJlYW0gfSBmcm9tICcuLi93cml0YWJsZS1zdHJlYW0nO1xuXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0V3JpdGFibGVTdHJlYW0oeDogdW5rbm93biwgY29udGV4dDogc3RyaW5nKTogYXNzZXJ0cyB4IGlzIFdyaXRhYmxlU3RyZWFtIHtcbiAgaWYgKCFJc1dyaXRhYmxlU3RyZWFtKHgpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgJHtjb250ZXh0fSBpcyBub3QgYSBXcml0YWJsZVN0cmVhbS5gKTtcbiAgfVxufVxuIiwgIi8qKlxuICogQSBzaWduYWwgb2JqZWN0IHRoYXQgYWxsb3dzIHlvdSB0byBjb21tdW5pY2F0ZSB3aXRoIGEgcmVxdWVzdCBhbmQgYWJvcnQgaXQgaWYgcmVxdWlyZWRcbiAqIHZpYSBpdHMgYXNzb2NpYXRlZCBgQWJvcnRDb250cm9sbGVyYCBvYmplY3QuXG4gKlxuICogQHJlbWFya3NcbiAqICAgVGhpcyBpbnRlcmZhY2UgaXMgY29tcGF0aWJsZSB3aXRoIHRoZSBgQWJvcnRTaWduYWxgIGludGVyZmFjZSBkZWZpbmVkIGluIFR5cGVTY3JpcHQncyBET00gdHlwZXMuXG4gKiAgIEl0IGlzIHJlZGVmaW5lZCBoZXJlLCBzbyBpdCBjYW4gYmUgcG9seWZpbGxlZCB3aXRob3V0IGEgRE9NLCBmb3IgZXhhbXBsZSB3aXRoXG4gKiAgIHtAbGluayBodHRwczovL3d3dy5ucG1qcy5jb20vcGFja2FnZS9hYm9ydGNvbnRyb2xsZXItcG9seWZpbGwgfCBhYm9ydGNvbnRyb2xsZXItcG9seWZpbGx9IGluIGEgTm9kZSBlbnZpcm9ubWVudC5cbiAqXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQWJvcnRTaWduYWwge1xuICAvKipcbiAgICogV2hldGhlciB0aGUgcmVxdWVzdCBpcyBhYm9ydGVkLlxuICAgKi9cbiAgcmVhZG9ubHkgYWJvcnRlZDogYm9vbGVhbjtcblxuICAvKipcbiAgICogSWYgYWJvcnRlZCwgcmV0dXJucyB0aGUgcmVhc29uIGZvciBhYm9ydGluZy5cbiAgICovXG4gIHJlYWRvbmx5IHJlYXNvbj86IGFueTtcblxuICAvKipcbiAgICogQWRkIGFuIGV2ZW50IGxpc3RlbmVyIHRvIGJlIHRyaWdnZXJlZCB3aGVuIHRoaXMgc2lnbmFsIGJlY29tZXMgYWJvcnRlZC5cbiAgICovXG4gIGFkZEV2ZW50TGlzdGVuZXIodHlwZTogJ2Fib3J0JywgbGlzdGVuZXI6ICgpID0+IHZvaWQpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBSZW1vdmUgYW4gZXZlbnQgbGlzdGVuZXIgdGhhdCB3YXMgcHJldmlvdXNseSBhZGRlZCB3aXRoIHtAbGluayBBYm9ydFNpZ25hbC5hZGRFdmVudExpc3RlbmVyfS5cbiAgICovXG4gIHJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZTogJ2Fib3J0JywgbGlzdGVuZXI6ICgpID0+IHZvaWQpOiB2b2lkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNBYm9ydFNpZ25hbCh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIEFib3J0U2lnbmFsIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcgfHwgdmFsdWUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdHJ5IHtcbiAgICByZXR1cm4gdHlwZW9mICh2YWx1ZSBhcyBBYm9ydFNpZ25hbCkuYWJvcnRlZCA9PT0gJ2Jvb2xlYW4nO1xuICB9IGNhdGNoIHtcbiAgICAvLyBBYm9ydFNpZ25hbC5wcm90b3R5cGUuYWJvcnRlZCB0aHJvd3MgaWYgaXRzIGJyYW5kIGNoZWNrIGZhaWxzXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbi8qKlxuICogQSBjb250cm9sbGVyIG9iamVjdCB0aGF0IGFsbG93cyB5b3UgdG8gYWJvcnQgYW4gYEFib3J0U2lnbmFsYCB3aGVuIGRlc2lyZWQuXG4gKlxuICogQHJlbWFya3NcbiAqICAgVGhpcyBpbnRlcmZhY2UgaXMgY29tcGF0aWJsZSB3aXRoIHRoZSBgQWJvcnRDb250cm9sbGVyYCBpbnRlcmZhY2UgZGVmaW5lZCBpbiBUeXBlU2NyaXB0J3MgRE9NIHR5cGVzLlxuICogICBJdCBpcyByZWRlZmluZWQgaGVyZSwgc28gaXQgY2FuIGJlIHBvbHlmaWxsZWQgd2l0aG91dCBhIERPTSwgZm9yIGV4YW1wbGUgd2l0aFxuICogICB7QGxpbmsgaHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2UvYWJvcnRjb250cm9sbGVyLXBvbHlmaWxsIHwgYWJvcnRjb250cm9sbGVyLXBvbHlmaWxsfSBpbiBhIE5vZGUgZW52aXJvbm1lbnQuXG4gKlxuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQWJvcnRDb250cm9sbGVyIHtcbiAgcmVhZG9ubHkgc2lnbmFsOiBBYm9ydFNpZ25hbDtcblxuICBhYm9ydChyZWFzb24/OiBhbnkpOiB2b2lkO1xufVxuXG5pbnRlcmZhY2UgQWJvcnRDb250cm9sbGVyQ29uc3RydWN0b3Ige1xuICBuZXcoKTogQWJvcnRDb250cm9sbGVyO1xufVxuXG5jb25zdCBzdXBwb3J0c0Fib3J0Q29udHJvbGxlciA9IHR5cGVvZiAoQWJvcnRDb250cm9sbGVyIGFzIGFueSkgPT09ICdmdW5jdGlvbic7XG5cbi8qKlxuICogQ29uc3RydWN0IGEgbmV3IEFib3J0Q29udHJvbGxlciwgaWYgc3VwcG9ydGVkIGJ5IHRoZSBwbGF0Zm9ybS5cbiAqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUFib3J0Q29udHJvbGxlcigpOiBBYm9ydENvbnRyb2xsZXIgfCB1bmRlZmluZWQge1xuICBpZiAoc3VwcG9ydHNBYm9ydENvbnRyb2xsZXIpIHtcbiAgICByZXR1cm4gbmV3IChBYm9ydENvbnRyb2xsZXIgYXMgQWJvcnRDb250cm9sbGVyQ29uc3RydWN0b3IpKCk7XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cbiIsICJpbXBvcnQgYXNzZXJ0IGZyb20gJy4uL3N0dWIvYXNzZXJ0JztcbmltcG9ydCB7XG4gIG5ld1Byb21pc2UsXG4gIHByb21pc2VSZWplY3RlZFdpdGgsXG4gIHByb21pc2VSZXNvbHZlZFdpdGgsXG4gIHNldFByb21pc2VJc0hhbmRsZWRUb1RydWUsXG4gIHVwb25Qcm9taXNlXG59IGZyb20gJy4vaGVscGVycy93ZWJpZGwnO1xuaW1wb3J0IHtcbiAgRGVxdWV1ZVZhbHVlLFxuICBFbnF1ZXVlVmFsdWVXaXRoU2l6ZSxcbiAgUGVla1F1ZXVlVmFsdWUsXG4gIHR5cGUgUXVldWVQYWlyLFxuICBSZXNldFF1ZXVlXG59IGZyb20gJy4vYWJzdHJhY3Qtb3BzL3F1ZXVlLXdpdGgtc2l6ZXMnO1xuaW1wb3J0IHR5cGUgeyBRdWV1aW5nU3RyYXRlZ3ksIFF1ZXVpbmdTdHJhdGVneVNpemVDYWxsYmFjayB9IGZyb20gJy4vcXVldWluZy1zdHJhdGVneSc7XG5pbXBvcnQgeyBTaW1wbGVRdWV1ZSB9IGZyb20gJy4vc2ltcGxlLXF1ZXVlJztcbmltcG9ydCB7IHNldEZ1bmN0aW9uTmFtZSwgdHlwZUlzT2JqZWN0IH0gZnJvbSAnLi9oZWxwZXJzL21pc2NlbGxhbmVvdXMnO1xuaW1wb3J0IHsgQWJvcnRTdGVwcywgRXJyb3JTdGVwcyB9IGZyb20gJy4vYWJzdHJhY3Qtb3BzL2ludGVybmFsLW1ldGhvZHMnO1xuaW1wb3J0IHsgSXNOb25OZWdhdGl2ZU51bWJlciB9IGZyb20gJy4vYWJzdHJhY3Qtb3BzL21pc2NlbGxhbmVvdXMnO1xuaW1wb3J0IHsgRXh0cmFjdEhpZ2hXYXRlck1hcmssIEV4dHJhY3RTaXplQWxnb3JpdGhtIH0gZnJvbSAnLi9hYnN0cmFjdC1vcHMvcXVldWluZy1zdHJhdGVneSc7XG5pbXBvcnQgeyBjb252ZXJ0UXVldWluZ1N0cmF0ZWd5IH0gZnJvbSAnLi92YWxpZGF0b3JzL3F1ZXVpbmctc3RyYXRlZ3knO1xuaW1wb3J0IHR5cGUge1xuICBVbmRlcmx5aW5nU2luayxcbiAgVW5kZXJseWluZ1NpbmtBYm9ydENhbGxiYWNrLFxuICBVbmRlcmx5aW5nU2lua0Nsb3NlQ2FsbGJhY2ssXG4gIFVuZGVybHlpbmdTaW5rU3RhcnRDYWxsYmFjayxcbiAgVW5kZXJseWluZ1NpbmtXcml0ZUNhbGxiYWNrLFxuICBWYWxpZGF0ZWRVbmRlcmx5aW5nU2lua1xufSBmcm9tICcuL3dyaXRhYmxlLXN0cmVhbS91bmRlcmx5aW5nLXNpbmsnO1xuaW1wb3J0IHsgYXNzZXJ0T2JqZWN0LCBhc3NlcnRSZXF1aXJlZEFyZ3VtZW50IH0gZnJvbSAnLi92YWxpZGF0b3JzL2Jhc2ljJztcbmltcG9ydCB7IGNvbnZlcnRVbmRlcmx5aW5nU2luayB9IGZyb20gJy4vdmFsaWRhdG9ycy91bmRlcmx5aW5nLXNpbmsnO1xuaW1wb3J0IHsgYXNzZXJ0V3JpdGFibGVTdHJlYW0gfSBmcm9tICcuL3ZhbGlkYXRvcnMvd3JpdGFibGUtc3RyZWFtJztcbmltcG9ydCB7IHR5cGUgQWJvcnRDb250cm9sbGVyLCB0eXBlIEFib3J0U2lnbmFsLCBjcmVhdGVBYm9ydENvbnRyb2xsZXIgfSBmcm9tICcuL2Fib3J0LXNpZ25hbCc7XG5cbnR5cGUgV3JpdGFibGVTdHJlYW1TdGF0ZSA9ICd3cml0YWJsZScgfCAnY2xvc2VkJyB8ICdlcnJvcmluZycgfCAnZXJyb3JlZCc7XG5cbmludGVyZmFjZSBXcml0ZU9yQ2xvc2VSZXF1ZXN0IHtcbiAgX3Jlc29sdmU6ICh2YWx1ZT86IHVuZGVmaW5lZCkgPT4gdm9pZDtcbiAgX3JlamVjdDogKHJlYXNvbjogYW55KSA9PiB2b2lkO1xufVxuXG50eXBlIFdyaXRlUmVxdWVzdCA9IFdyaXRlT3JDbG9zZVJlcXVlc3Q7XG50eXBlIENsb3NlUmVxdWVzdCA9IFdyaXRlT3JDbG9zZVJlcXVlc3Q7XG5cbmludGVyZmFjZSBQZW5kaW5nQWJvcnRSZXF1ZXN0IHtcbiAgX3Byb21pc2U6IFByb21pc2U8dW5kZWZpbmVkPjtcbiAgX3Jlc29sdmU6ICh2YWx1ZT86IHVuZGVmaW5lZCkgPT4gdm9pZDtcbiAgX3JlamVjdDogKHJlYXNvbjogYW55KSA9PiB2b2lkO1xuICBfcmVhc29uOiBhbnk7XG4gIF93YXNBbHJlYWR5RXJyb3Jpbmc6IGJvb2xlYW47XG59XG5cbi8qKlxuICogQSB3cml0YWJsZSBzdHJlYW0gcmVwcmVzZW50cyBhIGRlc3RpbmF0aW9uIGZvciBkYXRhLCBpbnRvIHdoaWNoIHlvdSBjYW4gd3JpdGUuXG4gKlxuICogQHB1YmxpY1xuICovXG5jbGFzcyBXcml0YWJsZVN0cmVhbTxXID0gYW55PiB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3N0YXRlITogV3JpdGFibGVTdHJlYW1TdGF0ZTtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfc3RvcmVkRXJyb3I6IGFueTtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfd3JpdGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXI8Vz4gfCB1bmRlZmluZWQ7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3dyaXRhYmxlU3RyZWFtQ29udHJvbGxlciE6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8Vz47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3dyaXRlUmVxdWVzdHMhOiBTaW1wbGVRdWV1ZTxXcml0ZVJlcXVlc3Q+O1xuICAvKiogQGludGVybmFsICovXG4gIF9pbkZsaWdodFdyaXRlUmVxdWVzdDogV3JpdGVSZXF1ZXN0IHwgdW5kZWZpbmVkO1xuICAvKiogQGludGVybmFsICovXG4gIF9jbG9zZVJlcXVlc3Q6IENsb3NlUmVxdWVzdCB8IHVuZGVmaW5lZDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfaW5GbGlnaHRDbG9zZVJlcXVlc3Q6IENsb3NlUmVxdWVzdCB8IHVuZGVmaW5lZDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcGVuZGluZ0Fib3J0UmVxdWVzdDogUGVuZGluZ0Fib3J0UmVxdWVzdCB8IHVuZGVmaW5lZDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfYmFja3ByZXNzdXJlITogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3Rvcih1bmRlcmx5aW5nU2luaz86IFVuZGVybHlpbmdTaW5rPFc+LCBzdHJhdGVneT86IFF1ZXVpbmdTdHJhdGVneTxXPik7XG4gIGNvbnN0cnVjdG9yKHJhd1VuZGVybHlpbmdTaW5rOiBVbmRlcmx5aW5nU2luazxXPiB8IG51bGwgfCB1bmRlZmluZWQgPSB7fSxcbiAgICAgICAgICAgICAgcmF3U3RyYXRlZ3k6IFF1ZXVpbmdTdHJhdGVneTxXPiB8IG51bGwgfCB1bmRlZmluZWQgPSB7fSkge1xuICAgIGlmIChyYXdVbmRlcmx5aW5nU2luayA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByYXdVbmRlcmx5aW5nU2luayA9IG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFzc2VydE9iamVjdChyYXdVbmRlcmx5aW5nU2luaywgJ0ZpcnN0IHBhcmFtZXRlcicpO1xuICAgIH1cblxuICAgIGNvbnN0IHN0cmF0ZWd5ID0gY29udmVydFF1ZXVpbmdTdHJhdGVneShyYXdTdHJhdGVneSwgJ1NlY29uZCBwYXJhbWV0ZXInKTtcbiAgICBjb25zdCB1bmRlcmx5aW5nU2luayA9IGNvbnZlcnRVbmRlcmx5aW5nU2luayhyYXdVbmRlcmx5aW5nU2luaywgJ0ZpcnN0IHBhcmFtZXRlcicpO1xuXG4gICAgSW5pdGlhbGl6ZVdyaXRhYmxlU3RyZWFtKHRoaXMpO1xuXG4gICAgY29uc3QgdHlwZSA9IHVuZGVybHlpbmdTaW5rLnR5cGU7XG4gICAgaWYgKHR5cGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0ludmFsaWQgdHlwZSBpcyBzcGVjaWZpZWQnKTtcbiAgICB9XG5cbiAgICBjb25zdCBzaXplQWxnb3JpdGhtID0gRXh0cmFjdFNpemVBbGdvcml0aG0oc3RyYXRlZ3kpO1xuICAgIGNvbnN0IGhpZ2hXYXRlck1hcmsgPSBFeHRyYWN0SGlnaFdhdGVyTWFyayhzdHJhdGVneSwgMSk7XG5cbiAgICBTZXRVcFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJGcm9tVW5kZXJseWluZ1NpbmsodGhpcywgdW5kZXJseWluZ1NpbmssIGhpZ2hXYXRlck1hcmssIHNpemVBbGdvcml0aG0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgd2hldGhlciBvciBub3QgdGhlIHdyaXRhYmxlIHN0cmVhbSBpcyBsb2NrZWQgdG8gYSB3cml0ZXIuXG4gICAqL1xuICBnZXQgbG9ja2VkKCk6IGJvb2xlYW4ge1xuICAgIGlmICghSXNXcml0YWJsZVN0cmVhbSh0aGlzKSkge1xuICAgICAgdGhyb3cgc3RyZWFtQnJhbmRDaGVja0V4Y2VwdGlvbignbG9ja2VkJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIElzV3JpdGFibGVTdHJlYW1Mb2NrZWQodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogQWJvcnRzIHRoZSBzdHJlYW0sIHNpZ25hbGluZyB0aGF0IHRoZSBwcm9kdWNlciBjYW4gbm8gbG9uZ2VyIHN1Y2Nlc3NmdWxseSB3cml0ZSB0byB0aGUgc3RyZWFtIGFuZCBpdCBpcyB0byBiZVxuICAgKiBpbW1lZGlhdGVseSBtb3ZlZCB0byBhbiBlcnJvcmVkIHN0YXRlLCB3aXRoIGFueSBxdWV1ZWQtdXAgd3JpdGVzIGRpc2NhcmRlZC4gVGhpcyB3aWxsIGFsc28gZXhlY3V0ZSBhbnkgYWJvcnRcbiAgICogbWVjaGFuaXNtIG9mIHRoZSB1bmRlcmx5aW5nIHNpbmsuXG4gICAqXG4gICAqIFRoZSByZXR1cm5lZCBwcm9taXNlIHdpbGwgZnVsZmlsbCBpZiB0aGUgc3RyZWFtIHNodXRzIGRvd24gc3VjY2Vzc2Z1bGx5LCBvciByZWplY3QgaWYgdGhlIHVuZGVybHlpbmcgc2luayBzaWduYWxlZFxuICAgKiB0aGF0IHRoZXJlIHdhcyBhbiBlcnJvciBkb2luZyBzby4gQWRkaXRpb25hbGx5LCBpdCB3aWxsIHJlamVjdCB3aXRoIGEgYFR5cGVFcnJvcmAgKHdpdGhvdXQgYXR0ZW1wdGluZyB0byBjYW5jZWxcbiAgICogdGhlIHN0cmVhbSkgaWYgdGhlIHN0cmVhbSBpcyBjdXJyZW50bHkgbG9ja2VkLlxuICAgKi9cbiAgYWJvcnQocmVhc29uOiBhbnkgPSB1bmRlZmluZWQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIUlzV3JpdGFibGVTdHJlYW0odGhpcykpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKHN0cmVhbUJyYW5kQ2hlY2tFeGNlcHRpb24oJ2Fib3J0JykpO1xuICAgIH1cblxuICAgIGlmIChJc1dyaXRhYmxlU3RyZWFtTG9ja2VkKHRoaXMpKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChuZXcgVHlwZUVycm9yKCdDYW5ub3QgYWJvcnQgYSBzdHJlYW0gdGhhdCBhbHJlYWR5IGhhcyBhIHdyaXRlcicpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gV3JpdGFibGVTdHJlYW1BYm9ydCh0aGlzLCByZWFzb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIENsb3NlcyB0aGUgc3RyZWFtLiBUaGUgdW5kZXJseWluZyBzaW5rIHdpbGwgZmluaXNoIHByb2Nlc3NpbmcgYW55IHByZXZpb3VzbHktd3JpdHRlbiBjaHVua3MsIGJlZm9yZSBpbnZva2luZyBpdHNcbiAgICogY2xvc2UgYmVoYXZpb3IuIER1cmluZyB0aGlzIHRpbWUgYW55IGZ1cnRoZXIgYXR0ZW1wdHMgdG8gd3JpdGUgd2lsbCBmYWlsICh3aXRob3V0IGVycm9yaW5nIHRoZSBzdHJlYW0pLlxuICAgKlxuICAgKiBUaGUgbWV0aG9kIHJldHVybnMgYSBwcm9taXNlIHRoYXQgd2lsbCBmdWxmaWxsIGlmIGFsbCByZW1haW5pbmcgY2h1bmtzIGFyZSBzdWNjZXNzZnVsbHkgd3JpdHRlbiBhbmQgdGhlIHN0cmVhbVxuICAgKiBzdWNjZXNzZnVsbHkgY2xvc2VzLCBvciByZWplY3RzIGlmIGFuIGVycm9yIGlzIGVuY291bnRlcmVkIGR1cmluZyB0aGlzIHByb2Nlc3MuIEFkZGl0aW9uYWxseSwgaXQgd2lsbCByZWplY3Qgd2l0aFxuICAgKiBhIGBUeXBlRXJyb3JgICh3aXRob3V0IGF0dGVtcHRpbmcgdG8gY2FuY2VsIHRoZSBzdHJlYW0pIGlmIHRoZSBzdHJlYW0gaXMgY3VycmVudGx5IGxvY2tlZC5cbiAgICovXG4gIGNsb3NlKCkge1xuICAgIGlmICghSXNXcml0YWJsZVN0cmVhbSh0aGlzKSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoc3RyZWFtQnJhbmRDaGVja0V4Y2VwdGlvbignY2xvc2UnKSk7XG4gICAgfVxuXG4gICAgaWYgKElzV3JpdGFibGVTdHJlYW1Mb2NrZWQodGhpcykpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjbG9zZSBhIHN0cmVhbSB0aGF0IGFscmVhZHkgaGFzIGEgd3JpdGVyJykpO1xuICAgIH1cblxuICAgIGlmIChXcml0YWJsZVN0cmVhbUNsb3NlUXVldWVkT3JJbkZsaWdodCh0aGlzKSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgobmV3IFR5cGVFcnJvcignQ2Fubm90IGNsb3NlIGFuIGFscmVhZHktY2xvc2luZyBzdHJlYW0nKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFdyaXRhYmxlU3RyZWFtQ2xvc2UodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIHtAbGluayBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIgfCB3cml0ZXJ9IGFuZCBsb2NrcyB0aGUgc3RyZWFtIHRvIHRoZSBuZXcgd3JpdGVyLiBXaGlsZSB0aGUgc3RyZWFtXG4gICAqIGlzIGxvY2tlZCwgbm8gb3RoZXIgd3JpdGVyIGNhbiBiZSBhY3F1aXJlZCB1bnRpbCB0aGlzIG9uZSBpcyByZWxlYXNlZC5cbiAgICpcbiAgICogVGhpcyBmdW5jdGlvbmFsaXR5IGlzIGVzcGVjaWFsbHkgdXNlZnVsIGZvciBjcmVhdGluZyBhYnN0cmFjdGlvbnMgdGhhdCBkZXNpcmUgdGhlIGFiaWxpdHkgdG8gd3JpdGUgdG8gYSBzdHJlYW1cbiAgICogd2l0aG91dCBpbnRlcnJ1cHRpb24gb3IgaW50ZXJsZWF2aW5nLiBCeSBnZXR0aW5nIGEgd3JpdGVyIGZvciB0aGUgc3RyZWFtLCB5b3UgY2FuIGVuc3VyZSBub2JvZHkgZWxzZSBjYW4gd3JpdGUgYXRcbiAgICogdGhlIHNhbWUgdGltZSwgd2hpY2ggd291bGQgY2F1c2UgdGhlIHJlc3VsdGluZyB3cml0dGVuIGRhdGEgdG8gYmUgdW5wcmVkaWN0YWJsZSBhbmQgcHJvYmFibHkgdXNlbGVzcy5cbiAgICovXG4gIGdldFdyaXRlcigpOiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXI8Vz4ge1xuICAgIGlmICghSXNXcml0YWJsZVN0cmVhbSh0aGlzKSkge1xuICAgICAgdGhyb3cgc3RyZWFtQnJhbmRDaGVja0V4Y2VwdGlvbignZ2V0V3JpdGVyJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIEFjcXVpcmVXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIodGhpcyk7XG4gIH1cbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoV3JpdGFibGVTdHJlYW0ucHJvdG90eXBlLCB7XG4gIGFib3J0OiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgY2xvc2U6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICBnZXRXcml0ZXI6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICBsb2NrZWQ6IHsgZW51bWVyYWJsZTogdHJ1ZSB9XG59KTtcbnNldEZ1bmN0aW9uTmFtZShXcml0YWJsZVN0cmVhbS5wcm90b3R5cGUuYWJvcnQsICdhYm9ydCcpO1xuc2V0RnVuY3Rpb25OYW1lKFdyaXRhYmxlU3RyZWFtLnByb3RvdHlwZS5jbG9zZSwgJ2Nsb3NlJyk7XG5zZXRGdW5jdGlvbk5hbWUoV3JpdGFibGVTdHJlYW0ucHJvdG90eXBlLmdldFdyaXRlciwgJ2dldFdyaXRlcicpO1xuaWYgKHR5cGVvZiBTeW1ib2wudG9TdHJpbmdUYWcgPT09ICdzeW1ib2wnKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShXcml0YWJsZVN0cmVhbS5wcm90b3R5cGUsIFN5bWJvbC50b1N0cmluZ1RhZywge1xuICAgIHZhbHVlOiAnV3JpdGFibGVTdHJlYW0nLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbn1cblxuZXhwb3J0IHtcbiAgQWNxdWlyZVdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcixcbiAgQ3JlYXRlV3JpdGFibGVTdHJlYW0sXG4gIElzV3JpdGFibGVTdHJlYW0sXG4gIElzV3JpdGFibGVTdHJlYW1Mb2NrZWQsXG4gIFdyaXRhYmxlU3RyZWFtLFxuICBXcml0YWJsZVN0cmVhbUFib3J0LFxuICBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRXJyb3JJZk5lZWRlZCxcbiAgV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyQ2xvc2VXaXRoRXJyb3JQcm9wYWdhdGlvbixcbiAgV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyUmVsZWFzZSxcbiAgV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyV3JpdGUsXG4gIFdyaXRhYmxlU3RyZWFtQ2xvc2VRdWV1ZWRPckluRmxpZ2h0XG59O1xuXG5leHBvcnQgdHlwZSB7XG4gIFVuZGVybHlpbmdTaW5rLFxuICBVbmRlcmx5aW5nU2lua1N0YXJ0Q2FsbGJhY2ssXG4gIFVuZGVybHlpbmdTaW5rV3JpdGVDYWxsYmFjayxcbiAgVW5kZXJseWluZ1NpbmtDbG9zZUNhbGxiYWNrLFxuICBVbmRlcmx5aW5nU2lua0Fib3J0Q2FsbGJhY2tcbn07XG5cbi8vIEFic3RyYWN0IG9wZXJhdGlvbnMgZm9yIHRoZSBXcml0YWJsZVN0cmVhbS5cblxuZnVuY3Rpb24gQWNxdWlyZVdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcjxXPihzdHJlYW06IFdyaXRhYmxlU3RyZWFtPFc+KTogV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyPFc+IHtcbiAgcmV0dXJuIG5ldyBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIoc3RyZWFtKTtcbn1cblxuLy8gVGhyb3dzIGlmIGFuZCBvbmx5IGlmIHN0YXJ0QWxnb3JpdGhtIHRocm93cy5cbmZ1bmN0aW9uIENyZWF0ZVdyaXRhYmxlU3RyZWFtPFc+KHN0YXJ0QWxnb3JpdGhtOiAoKSA9PiB2b2lkIHwgUHJvbWlzZUxpa2U8dm9pZD4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3cml0ZUFsZ29yaXRobTogKGNodW5rOiBXKSA9PiBQcm9taXNlPHZvaWQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2VBbGdvcml0aG06ICgpID0+IFByb21pc2U8dm9pZD4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhYm9ydEFsZ29yaXRobTogKHJlYXNvbjogYW55KSA9PiBQcm9taXNlPHZvaWQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGlnaFdhdGVyTWFyayA9IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaXplQWxnb3JpdGhtOiBRdWV1aW5nU3RyYXRlZ3lTaXplQ2FsbGJhY2s8Vz4gPSAoKSA9PiAxKSB7XG4gIGFzc2VydChJc05vbk5lZ2F0aXZlTnVtYmVyKGhpZ2hXYXRlck1hcmspKTtcblxuICBjb25zdCBzdHJlYW06IFdyaXRhYmxlU3RyZWFtPFc+ID0gT2JqZWN0LmNyZWF0ZShXcml0YWJsZVN0cmVhbS5wcm90b3R5cGUpO1xuICBJbml0aWFsaXplV3JpdGFibGVTdHJlYW0oc3RyZWFtKTtcblxuICBjb25zdCBjb250cm9sbGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyPFc+ID0gT2JqZWN0LmNyZWF0ZShXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyLnByb3RvdHlwZSk7XG5cbiAgU2V0VXBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyKHN0cmVhbSwgY29udHJvbGxlciwgc3RhcnRBbGdvcml0aG0sIHdyaXRlQWxnb3JpdGhtLCBjbG9zZUFsZ29yaXRobSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFib3J0QWxnb3JpdGhtLCBoaWdoV2F0ZXJNYXJrLCBzaXplQWxnb3JpdGhtKTtcbiAgcmV0dXJuIHN0cmVhbTtcbn1cblxuZnVuY3Rpb24gSW5pdGlhbGl6ZVdyaXRhYmxlU3RyZWFtPFc+KHN0cmVhbTogV3JpdGFibGVTdHJlYW08Vz4pIHtcbiAgc3RyZWFtLl9zdGF0ZSA9ICd3cml0YWJsZSc7XG5cbiAgLy8gVGhlIGVycm9yIHRoYXQgd2lsbCBiZSByZXBvcnRlZCBieSBuZXcgbWV0aG9kIGNhbGxzIG9uY2UgdGhlIHN0YXRlIGJlY29tZXMgZXJyb3JlZC4gT25seSBzZXQgd2hlbiBbW3N0YXRlXV0gaXNcbiAgLy8gJ2Vycm9yaW5nJyBvciAnZXJyb3JlZCcuIE1heSBiZSBzZXQgdG8gYW4gdW5kZWZpbmVkIHZhbHVlLlxuICBzdHJlYW0uX3N0b3JlZEVycm9yID0gdW5kZWZpbmVkO1xuXG4gIHN0cmVhbS5fd3JpdGVyID0gdW5kZWZpbmVkO1xuXG4gIC8vIEluaXRpYWxpemUgdG8gdW5kZWZpbmVkIGZpcnN0IGJlY2F1c2UgdGhlIGNvbnN0cnVjdG9yIG9mIHRoZSBjb250cm9sbGVyIGNoZWNrcyB0aGlzXG4gIC8vIHZhcmlhYmxlIHRvIHZhbGlkYXRlIHRoZSBjYWxsZXIuXG4gIHN0cmVhbS5fd3JpdGFibGVTdHJlYW1Db250cm9sbGVyID0gdW5kZWZpbmVkITtcblxuICAvLyBUaGlzIHF1ZXVlIGlzIHBsYWNlZCBoZXJlIGluc3RlYWQgb2YgdGhlIHdyaXRlciBjbGFzcyBpbiBvcmRlciB0byBhbGxvdyBmb3IgcGFzc2luZyBhIHdyaXRlciB0byB0aGUgbmV4dCBkYXRhXG4gIC8vIHByb2R1Y2VyIHdpdGhvdXQgd2FpdGluZyBmb3IgdGhlIHF1ZXVlZCB3cml0ZXMgdG8gZmluaXNoLlxuICBzdHJlYW0uX3dyaXRlUmVxdWVzdHMgPSBuZXcgU2ltcGxlUXVldWUoKTtcblxuICAvLyBXcml0ZSByZXF1ZXN0cyBhcmUgcmVtb3ZlZCBmcm9tIF93cml0ZVJlcXVlc3RzIHdoZW4gd3JpdGUoKSBpcyBjYWxsZWQgb24gdGhlIHVuZGVybHlpbmcgc2luay4gVGhpcyBwcmV2ZW50c1xuICAvLyB0aGVtIGZyb20gYmVpbmcgZXJyb25lb3VzbHkgcmVqZWN0ZWQgb24gZXJyb3IuIElmIGEgd3JpdGUoKSBjYWxsIGlzIGluLWZsaWdodCwgdGhlIHJlcXVlc3QgaXMgc3RvcmVkIGhlcmUuXG4gIHN0cmVhbS5faW5GbGlnaHRXcml0ZVJlcXVlc3QgPSB1bmRlZmluZWQ7XG5cbiAgLy8gVGhlIHByb21pc2UgdGhhdCB3YXMgcmV0dXJuZWQgZnJvbSB3cml0ZXIuY2xvc2UoKS4gU3RvcmVkIGhlcmUgYmVjYXVzZSBpdCBtYXkgYmUgZnVsZmlsbGVkIGFmdGVyIHRoZSB3cml0ZXJcbiAgLy8gaGFzIGJlZW4gZGV0YWNoZWQuXG4gIHN0cmVhbS5fY2xvc2VSZXF1ZXN0ID0gdW5kZWZpbmVkO1xuXG4gIC8vIENsb3NlIHJlcXVlc3QgaXMgcmVtb3ZlZCBmcm9tIF9jbG9zZVJlcXVlc3Qgd2hlbiBjbG9zZSgpIGlzIGNhbGxlZCBvbiB0aGUgdW5kZXJseWluZyBzaW5rLiBUaGlzIHByZXZlbnRzIGl0XG4gIC8vIGZyb20gYmVpbmcgZXJyb25lb3VzbHkgcmVqZWN0ZWQgb24gZXJyb3IuIElmIGEgY2xvc2UoKSBjYWxsIGlzIGluLWZsaWdodCwgdGhlIHJlcXVlc3QgaXMgc3RvcmVkIGhlcmUuXG4gIHN0cmVhbS5faW5GbGlnaHRDbG9zZVJlcXVlc3QgPSB1bmRlZmluZWQ7XG5cbiAgLy8gVGhlIHByb21pc2UgdGhhdCB3YXMgcmV0dXJuZWQgZnJvbSB3cml0ZXIuYWJvcnQoKS4gVGhpcyBtYXkgYWxzbyBiZSBmdWxmaWxsZWQgYWZ0ZXIgdGhlIHdyaXRlciBoYXMgZGV0YWNoZWQuXG4gIHN0cmVhbS5fcGVuZGluZ0Fib3J0UmVxdWVzdCA9IHVuZGVmaW5lZDtcblxuICAvLyBUaGUgYmFja3ByZXNzdXJlIHNpZ25hbCBzZXQgYnkgdGhlIGNvbnRyb2xsZXIuXG4gIHN0cmVhbS5fYmFja3ByZXNzdXJlID0gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIElzV3JpdGFibGVTdHJlYW0oeDogdW5rbm93bik6IHggaXMgV3JpdGFibGVTdHJlYW0ge1xuICBpZiAoIXR5cGVJc09iamVjdCh4KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHgsICdfd3JpdGFibGVTdHJlYW1Db250cm9sbGVyJykpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4geCBpbnN0YW5jZW9mIFdyaXRhYmxlU3RyZWFtO1xufVxuXG5mdW5jdGlvbiBJc1dyaXRhYmxlU3RyZWFtTG9ja2VkKHN0cmVhbTogV3JpdGFibGVTdHJlYW0pOiBib29sZWFuIHtcbiAgYXNzZXJ0KElzV3JpdGFibGVTdHJlYW0oc3RyZWFtKSk7XG5cbiAgaWYgKHN0cmVhbS5fd3JpdGVyID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gV3JpdGFibGVTdHJlYW1BYm9ydChzdHJlYW06IFdyaXRhYmxlU3RyZWFtLCByZWFzb246IGFueSk6IFByb21pc2U8dW5kZWZpbmVkPiB7XG4gIGlmIChzdHJlYW0uX3N0YXRlID09PSAnY2xvc2VkJyB8fCBzdHJlYW0uX3N0YXRlID09PSAnZXJyb3JlZCcpIHtcbiAgICByZXR1cm4gcHJvbWlzZVJlc29sdmVkV2l0aCh1bmRlZmluZWQpO1xuICB9XG4gIHN0cmVhbS5fd3JpdGFibGVTdHJlYW1Db250cm9sbGVyLl9hYm9ydFJlYXNvbiA9IHJlYXNvbjtcbiAgc3RyZWFtLl93cml0YWJsZVN0cmVhbUNvbnRyb2xsZXIuX2Fib3J0Q29udHJvbGxlcj8uYWJvcnQocmVhc29uKTtcblxuICAvLyBUeXBlU2NyaXB0IG5hcnJvd3MgdGhlIHR5cGUgb2YgYHN0cmVhbS5fc3RhdGVgIGRvd24gdG8gJ3dyaXRhYmxlJyB8ICdlcnJvcmluZycsXG4gIC8vIGJ1dCBpdCBkb2Vzbid0IGtub3cgdGhhdCBzaWduYWxpbmcgYWJvcnQgcnVucyBhdXRob3IgY29kZSB0aGF0IG1pZ2h0IGhhdmUgY2hhbmdlZCB0aGUgc3RhdGUuXG4gIC8vIFdpZGVuIHRoZSB0eXBlIGFnYWluIGJ5IGNhc3RpbmcgdG8gV3JpdGFibGVTdHJlYW1TdGF0ZS5cbiAgY29uc3Qgc3RhdGUgPSBzdHJlYW0uX3N0YXRlIGFzIFdyaXRhYmxlU3RyZWFtU3RhdGU7XG5cbiAgaWYgKHN0YXRlID09PSAnY2xvc2VkJyB8fCBzdGF0ZSA9PT0gJ2Vycm9yZWQnKSB7XG4gICAgcmV0dXJuIHByb21pc2VSZXNvbHZlZFdpdGgodW5kZWZpbmVkKTtcbiAgfVxuICBpZiAoc3RyZWFtLl9wZW5kaW5nQWJvcnRSZXF1ZXN0ICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gc3RyZWFtLl9wZW5kaW5nQWJvcnRSZXF1ZXN0Ll9wcm9taXNlO1xuICB9XG5cbiAgYXNzZXJ0KHN0YXRlID09PSAnd3JpdGFibGUnIHx8IHN0YXRlID09PSAnZXJyb3JpbmcnKTtcblxuICBsZXQgd2FzQWxyZWFkeUVycm9yaW5nID0gZmFsc2U7XG4gIGlmIChzdGF0ZSA9PT0gJ2Vycm9yaW5nJykge1xuICAgIHdhc0FscmVhZHlFcnJvcmluZyA9IHRydWU7XG4gICAgLy8gcmVhc29uIHdpbGwgbm90IGJlIHVzZWQsIHNvIGRvbid0IGtlZXAgYSByZWZlcmVuY2UgdG8gaXQuXG4gICAgcmVhc29uID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgY29uc3QgcHJvbWlzZSA9IG5ld1Byb21pc2U8dW5kZWZpbmVkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgc3RyZWFtLl9wZW5kaW5nQWJvcnRSZXF1ZXN0ID0ge1xuICAgICAgX3Byb21pc2U6IHVuZGVmaW5lZCEsXG4gICAgICBfcmVzb2x2ZTogcmVzb2x2ZSxcbiAgICAgIF9yZWplY3Q6IHJlamVjdCxcbiAgICAgIF9yZWFzb246IHJlYXNvbixcbiAgICAgIF93YXNBbHJlYWR5RXJyb3Jpbmc6IHdhc0FscmVhZHlFcnJvcmluZ1xuICAgIH07XG4gIH0pO1xuICBzdHJlYW0uX3BlbmRpbmdBYm9ydFJlcXVlc3QhLl9wcm9taXNlID0gcHJvbWlzZTtcblxuICBpZiAoIXdhc0FscmVhZHlFcnJvcmluZykge1xuICAgIFdyaXRhYmxlU3RyZWFtU3RhcnRFcnJvcmluZyhzdHJlYW0sIHJlYXNvbik7XG4gIH1cblxuICByZXR1cm4gcHJvbWlzZTtcbn1cblxuZnVuY3Rpb24gV3JpdGFibGVTdHJlYW1DbG9zZShzdHJlYW06IFdyaXRhYmxlU3RyZWFtPGFueT4pOiBQcm9taXNlPHVuZGVmaW5lZD4ge1xuICBjb25zdCBzdGF0ZSA9IHN0cmVhbS5fc3RhdGU7XG4gIGlmIChzdGF0ZSA9PT0gJ2Nsb3NlZCcgfHwgc3RhdGUgPT09ICdlcnJvcmVkJykge1xuICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKG5ldyBUeXBlRXJyb3IoXG4gICAgICBgVGhlIHN0cmVhbSAoaW4gJHtzdGF0ZX0gc3RhdGUpIGlzIG5vdCBpbiB0aGUgd3JpdGFibGUgc3RhdGUgYW5kIGNhbm5vdCBiZSBjbG9zZWRgKSk7XG4gIH1cblxuICBhc3NlcnQoc3RhdGUgPT09ICd3cml0YWJsZScgfHwgc3RhdGUgPT09ICdlcnJvcmluZycpO1xuICBhc3NlcnQoIVdyaXRhYmxlU3RyZWFtQ2xvc2VRdWV1ZWRPckluRmxpZ2h0KHN0cmVhbSkpO1xuXG4gIGNvbnN0IHByb21pc2UgPSBuZXdQcm9taXNlPHVuZGVmaW5lZD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IGNsb3NlUmVxdWVzdDogQ2xvc2VSZXF1ZXN0ID0ge1xuICAgICAgX3Jlc29sdmU6IHJlc29sdmUsXG4gICAgICBfcmVqZWN0OiByZWplY3RcbiAgICB9O1xuXG4gICAgc3RyZWFtLl9jbG9zZVJlcXVlc3QgPSBjbG9zZVJlcXVlc3Q7XG4gIH0pO1xuXG4gIGNvbnN0IHdyaXRlciA9IHN0cmVhbS5fd3JpdGVyO1xuICBpZiAod3JpdGVyICE9PSB1bmRlZmluZWQgJiYgc3RyZWFtLl9iYWNrcHJlc3N1cmUgJiYgc3RhdGUgPT09ICd3cml0YWJsZScpIHtcbiAgICBkZWZhdWx0V3JpdGVyUmVhZHlQcm9taXNlUmVzb2x2ZSh3cml0ZXIpO1xuICB9XG5cbiAgV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNsb3NlKHN0cmVhbS5fd3JpdGFibGVTdHJlYW1Db250cm9sbGVyKTtcblxuICByZXR1cm4gcHJvbWlzZTtcbn1cblxuLy8gV3JpdGFibGVTdHJlYW0gQVBJIGV4cG9zZWQgZm9yIGNvbnRyb2xsZXJzLlxuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbUFkZFdyaXRlUmVxdWVzdChzdHJlYW06IFdyaXRhYmxlU3RyZWFtKTogUHJvbWlzZTx1bmRlZmluZWQ+IHtcbiAgYXNzZXJ0KElzV3JpdGFibGVTdHJlYW1Mb2NrZWQoc3RyZWFtKSk7XG4gIGFzc2VydChzdHJlYW0uX3N0YXRlID09PSAnd3JpdGFibGUnKTtcblxuICBjb25zdCBwcm9taXNlID0gbmV3UHJvbWlzZTx1bmRlZmluZWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCB3cml0ZVJlcXVlc3Q6IFdyaXRlUmVxdWVzdCA9IHtcbiAgICAgIF9yZXNvbHZlOiByZXNvbHZlLFxuICAgICAgX3JlamVjdDogcmVqZWN0XG4gICAgfTtcblxuICAgIHN0cmVhbS5fd3JpdGVSZXF1ZXN0cy5wdXNoKHdyaXRlUmVxdWVzdCk7XG4gIH0pO1xuXG4gIHJldHVybiBwcm9taXNlO1xufVxuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbURlYWxXaXRoUmVqZWN0aW9uKHN0cmVhbTogV3JpdGFibGVTdHJlYW0sIGVycm9yOiBhbnkpIHtcbiAgY29uc3Qgc3RhdGUgPSBzdHJlYW0uX3N0YXRlO1xuXG4gIGlmIChzdGF0ZSA9PT0gJ3dyaXRhYmxlJykge1xuICAgIFdyaXRhYmxlU3RyZWFtU3RhcnRFcnJvcmluZyhzdHJlYW0sIGVycm9yKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBhc3NlcnQoc3RhdGUgPT09ICdlcnJvcmluZycpO1xuICBXcml0YWJsZVN0cmVhbUZpbmlzaEVycm9yaW5nKHN0cmVhbSk7XG59XG5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtU3RhcnRFcnJvcmluZyhzdHJlYW06IFdyaXRhYmxlU3RyZWFtLCByZWFzb246IGFueSkge1xuICBhc3NlcnQoc3RyZWFtLl9zdG9yZWRFcnJvciA9PT0gdW5kZWZpbmVkKTtcbiAgYXNzZXJ0KHN0cmVhbS5fc3RhdGUgPT09ICd3cml0YWJsZScpO1xuXG4gIGNvbnN0IGNvbnRyb2xsZXIgPSBzdHJlYW0uX3dyaXRhYmxlU3RyZWFtQ29udHJvbGxlcjtcbiAgYXNzZXJ0KGNvbnRyb2xsZXIgIT09IHVuZGVmaW5lZCk7XG5cbiAgc3RyZWFtLl9zdGF0ZSA9ICdlcnJvcmluZyc7XG4gIHN0cmVhbS5fc3RvcmVkRXJyb3IgPSByZWFzb247XG4gIGNvbnN0IHdyaXRlciA9IHN0cmVhbS5fd3JpdGVyO1xuICBpZiAod3JpdGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXJFbnN1cmVSZWFkeVByb21pc2VSZWplY3RlZCh3cml0ZXIsIHJlYXNvbik7XG4gIH1cblxuICBpZiAoIVdyaXRhYmxlU3RyZWFtSGFzT3BlcmF0aW9uTWFya2VkSW5GbGlnaHQoc3RyZWFtKSAmJiBjb250cm9sbGVyLl9zdGFydGVkKSB7XG4gICAgV3JpdGFibGVTdHJlYW1GaW5pc2hFcnJvcmluZyhzdHJlYW0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtRmluaXNoRXJyb3Jpbmcoc3RyZWFtOiBXcml0YWJsZVN0cmVhbSkge1xuICBhc3NlcnQoc3RyZWFtLl9zdGF0ZSA9PT0gJ2Vycm9yaW5nJyk7XG4gIGFzc2VydCghV3JpdGFibGVTdHJlYW1IYXNPcGVyYXRpb25NYXJrZWRJbkZsaWdodChzdHJlYW0pKTtcbiAgc3RyZWFtLl9zdGF0ZSA9ICdlcnJvcmVkJztcbiAgc3RyZWFtLl93cml0YWJsZVN0cmVhbUNvbnRyb2xsZXJbRXJyb3JTdGVwc10oKTtcblxuICBjb25zdCBzdG9yZWRFcnJvciA9IHN0cmVhbS5fc3RvcmVkRXJyb3I7XG4gIHN0cmVhbS5fd3JpdGVSZXF1ZXN0cy5mb3JFYWNoKHdyaXRlUmVxdWVzdCA9PiB7XG4gICAgd3JpdGVSZXF1ZXN0Ll9yZWplY3Qoc3RvcmVkRXJyb3IpO1xuICB9KTtcbiAgc3RyZWFtLl93cml0ZVJlcXVlc3RzID0gbmV3IFNpbXBsZVF1ZXVlKCk7XG5cbiAgaWYgKHN0cmVhbS5fcGVuZGluZ0Fib3J0UmVxdWVzdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgV3JpdGFibGVTdHJlYW1SZWplY3RDbG9zZUFuZENsb3NlZFByb21pc2VJZk5lZWRlZChzdHJlYW0pO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGFib3J0UmVxdWVzdCA9IHN0cmVhbS5fcGVuZGluZ0Fib3J0UmVxdWVzdDtcbiAgc3RyZWFtLl9wZW5kaW5nQWJvcnRSZXF1ZXN0ID0gdW5kZWZpbmVkO1xuXG4gIGlmIChhYm9ydFJlcXVlc3QuX3dhc0FscmVhZHlFcnJvcmluZykge1xuICAgIGFib3J0UmVxdWVzdC5fcmVqZWN0KHN0b3JlZEVycm9yKTtcbiAgICBXcml0YWJsZVN0cmVhbVJlamVjdENsb3NlQW5kQ2xvc2VkUHJvbWlzZUlmTmVlZGVkKHN0cmVhbSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgcHJvbWlzZSA9IHN0cmVhbS5fd3JpdGFibGVTdHJlYW1Db250cm9sbGVyW0Fib3J0U3RlcHNdKGFib3J0UmVxdWVzdC5fcmVhc29uKTtcbiAgdXBvblByb21pc2UoXG4gICAgcHJvbWlzZSxcbiAgICAoKSA9PiB7XG4gICAgICBhYm9ydFJlcXVlc3QuX3Jlc29sdmUoKTtcbiAgICAgIFdyaXRhYmxlU3RyZWFtUmVqZWN0Q2xvc2VBbmRDbG9zZWRQcm9taXNlSWZOZWVkZWQoc3RyZWFtKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgKHJlYXNvbjogYW55KSA9PiB7XG4gICAgICBhYm9ydFJlcXVlc3QuX3JlamVjdChyZWFzb24pO1xuICAgICAgV3JpdGFibGVTdHJlYW1SZWplY3RDbG9zZUFuZENsb3NlZFByb21pc2VJZk5lZWRlZChzdHJlYW0pO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtRmluaXNoSW5GbGlnaHRXcml0ZShzdHJlYW06IFdyaXRhYmxlU3RyZWFtKSB7XG4gIGFzc2VydChzdHJlYW0uX2luRmxpZ2h0V3JpdGVSZXF1ZXN0ICE9PSB1bmRlZmluZWQpO1xuICBzdHJlYW0uX2luRmxpZ2h0V3JpdGVSZXF1ZXN0IS5fcmVzb2x2ZSh1bmRlZmluZWQpO1xuICBzdHJlYW0uX2luRmxpZ2h0V3JpdGVSZXF1ZXN0ID0gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbUZpbmlzaEluRmxpZ2h0V3JpdGVXaXRoRXJyb3Ioc3RyZWFtOiBXcml0YWJsZVN0cmVhbSwgZXJyb3I6IGFueSkge1xuICBhc3NlcnQoc3RyZWFtLl9pbkZsaWdodFdyaXRlUmVxdWVzdCAhPT0gdW5kZWZpbmVkKTtcbiAgc3RyZWFtLl9pbkZsaWdodFdyaXRlUmVxdWVzdCEuX3JlamVjdChlcnJvcik7XG4gIHN0cmVhbS5faW5GbGlnaHRXcml0ZVJlcXVlc3QgPSB1bmRlZmluZWQ7XG5cbiAgYXNzZXJ0KHN0cmVhbS5fc3RhdGUgPT09ICd3cml0YWJsZScgfHwgc3RyZWFtLl9zdGF0ZSA9PT0gJ2Vycm9yaW5nJyk7XG5cbiAgV3JpdGFibGVTdHJlYW1EZWFsV2l0aFJlamVjdGlvbihzdHJlYW0sIGVycm9yKTtcbn1cblxuZnVuY3Rpb24gV3JpdGFibGVTdHJlYW1GaW5pc2hJbkZsaWdodENsb3NlKHN0cmVhbTogV3JpdGFibGVTdHJlYW0pIHtcbiAgYXNzZXJ0KHN0cmVhbS5faW5GbGlnaHRDbG9zZVJlcXVlc3QgIT09IHVuZGVmaW5lZCk7XG4gIHN0cmVhbS5faW5GbGlnaHRDbG9zZVJlcXVlc3QhLl9yZXNvbHZlKHVuZGVmaW5lZCk7XG4gIHN0cmVhbS5faW5GbGlnaHRDbG9zZVJlcXVlc3QgPSB1bmRlZmluZWQ7XG5cbiAgY29uc3Qgc3RhdGUgPSBzdHJlYW0uX3N0YXRlO1xuXG4gIGFzc2VydChzdGF0ZSA9PT0gJ3dyaXRhYmxlJyB8fCBzdGF0ZSA9PT0gJ2Vycm9yaW5nJyk7XG5cbiAgaWYgKHN0YXRlID09PSAnZXJyb3JpbmcnKSB7XG4gICAgLy8gVGhlIGVycm9yIHdhcyB0b28gbGF0ZSB0byBkbyBhbnl0aGluZywgc28gaXQgaXMgaWdub3JlZC5cbiAgICBzdHJlYW0uX3N0b3JlZEVycm9yID0gdW5kZWZpbmVkO1xuICAgIGlmIChzdHJlYW0uX3BlbmRpbmdBYm9ydFJlcXVlc3QgIT09IHVuZGVmaW5lZCkge1xuICAgICAgc3RyZWFtLl9wZW5kaW5nQWJvcnRSZXF1ZXN0Ll9yZXNvbHZlKCk7XG4gICAgICBzdHJlYW0uX3BlbmRpbmdBYm9ydFJlcXVlc3QgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgc3RyZWFtLl9zdGF0ZSA9ICdjbG9zZWQnO1xuXG4gIGNvbnN0IHdyaXRlciA9IHN0cmVhbS5fd3JpdGVyO1xuICBpZiAod3JpdGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICBkZWZhdWx0V3JpdGVyQ2xvc2VkUHJvbWlzZVJlc29sdmUod3JpdGVyKTtcbiAgfVxuXG4gIGFzc2VydChzdHJlYW0uX3BlbmRpbmdBYm9ydFJlcXVlc3QgPT09IHVuZGVmaW5lZCk7XG4gIGFzc2VydChzdHJlYW0uX3N0b3JlZEVycm9yID09PSB1bmRlZmluZWQpO1xufVxuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbUZpbmlzaEluRmxpZ2h0Q2xvc2VXaXRoRXJyb3Ioc3RyZWFtOiBXcml0YWJsZVN0cmVhbSwgZXJyb3I6IGFueSkge1xuICBhc3NlcnQoc3RyZWFtLl9pbkZsaWdodENsb3NlUmVxdWVzdCAhPT0gdW5kZWZpbmVkKTtcbiAgc3RyZWFtLl9pbkZsaWdodENsb3NlUmVxdWVzdCEuX3JlamVjdChlcnJvcik7XG4gIHN0cmVhbS5faW5GbGlnaHRDbG9zZVJlcXVlc3QgPSB1bmRlZmluZWQ7XG5cbiAgYXNzZXJ0KHN0cmVhbS5fc3RhdGUgPT09ICd3cml0YWJsZScgfHwgc3RyZWFtLl9zdGF0ZSA9PT0gJ2Vycm9yaW5nJyk7XG5cbiAgLy8gTmV2ZXIgZXhlY3V0ZSBzaW5rIGFib3J0KCkgYWZ0ZXIgc2luayBjbG9zZSgpLlxuICBpZiAoc3RyZWFtLl9wZW5kaW5nQWJvcnRSZXF1ZXN0ICE9PSB1bmRlZmluZWQpIHtcbiAgICBzdHJlYW0uX3BlbmRpbmdBYm9ydFJlcXVlc3QuX3JlamVjdChlcnJvcik7XG4gICAgc3RyZWFtLl9wZW5kaW5nQWJvcnRSZXF1ZXN0ID0gdW5kZWZpbmVkO1xuICB9XG4gIFdyaXRhYmxlU3RyZWFtRGVhbFdpdGhSZWplY3Rpb24oc3RyZWFtLCBlcnJvcik7XG59XG5cbi8vIFRPRE8ocmljZWEpOiBGaXggYWxwaGFiZXRpY2FsIG9yZGVyLlxuZnVuY3Rpb24gV3JpdGFibGVTdHJlYW1DbG9zZVF1ZXVlZE9ySW5GbGlnaHQoc3RyZWFtOiBXcml0YWJsZVN0cmVhbSk6IGJvb2xlYW4ge1xuICBpZiAoc3RyZWFtLl9jbG9zZVJlcXVlc3QgPT09IHVuZGVmaW5lZCAmJiBzdHJlYW0uX2luRmxpZ2h0Q2xvc2VSZXF1ZXN0ID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gV3JpdGFibGVTdHJlYW1IYXNPcGVyYXRpb25NYXJrZWRJbkZsaWdodChzdHJlYW06IFdyaXRhYmxlU3RyZWFtKTogYm9vbGVhbiB7XG4gIGlmIChzdHJlYW0uX2luRmxpZ2h0V3JpdGVSZXF1ZXN0ID09PSB1bmRlZmluZWQgJiYgc3RyZWFtLl9pbkZsaWdodENsb3NlUmVxdWVzdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtTWFya0Nsb3NlUmVxdWVzdEluRmxpZ2h0KHN0cmVhbTogV3JpdGFibGVTdHJlYW0pIHtcbiAgYXNzZXJ0KHN0cmVhbS5faW5GbGlnaHRDbG9zZVJlcXVlc3QgPT09IHVuZGVmaW5lZCk7XG4gIGFzc2VydChzdHJlYW0uX2Nsb3NlUmVxdWVzdCAhPT0gdW5kZWZpbmVkKTtcbiAgc3RyZWFtLl9pbkZsaWdodENsb3NlUmVxdWVzdCA9IHN0cmVhbS5fY2xvc2VSZXF1ZXN0O1xuICBzdHJlYW0uX2Nsb3NlUmVxdWVzdCA9IHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gV3JpdGFibGVTdHJlYW1NYXJrRmlyc3RXcml0ZVJlcXVlc3RJbkZsaWdodChzdHJlYW06IFdyaXRhYmxlU3RyZWFtKSB7XG4gIGFzc2VydChzdHJlYW0uX2luRmxpZ2h0V3JpdGVSZXF1ZXN0ID09PSB1bmRlZmluZWQpO1xuICBhc3NlcnQoc3RyZWFtLl93cml0ZVJlcXVlc3RzLmxlbmd0aCAhPT0gMCk7XG4gIHN0cmVhbS5faW5GbGlnaHRXcml0ZVJlcXVlc3QgPSBzdHJlYW0uX3dyaXRlUmVxdWVzdHMuc2hpZnQoKTtcbn1cblxuZnVuY3Rpb24gV3JpdGFibGVTdHJlYW1SZWplY3RDbG9zZUFuZENsb3NlZFByb21pc2VJZk5lZWRlZChzdHJlYW06IFdyaXRhYmxlU3RyZWFtKSB7XG4gIGFzc2VydChzdHJlYW0uX3N0YXRlID09PSAnZXJyb3JlZCcpO1xuICBpZiAoc3RyZWFtLl9jbG9zZVJlcXVlc3QgIT09IHVuZGVmaW5lZCkge1xuICAgIGFzc2VydChzdHJlYW0uX2luRmxpZ2h0Q2xvc2VSZXF1ZXN0ID09PSB1bmRlZmluZWQpO1xuXG4gICAgc3RyZWFtLl9jbG9zZVJlcXVlc3QuX3JlamVjdChzdHJlYW0uX3N0b3JlZEVycm9yKTtcbiAgICBzdHJlYW0uX2Nsb3NlUmVxdWVzdCA9IHVuZGVmaW5lZDtcbiAgfVxuICBjb25zdCB3cml0ZXIgPSBzdHJlYW0uX3dyaXRlcjtcbiAgaWYgKHdyaXRlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgZGVmYXVsdFdyaXRlckNsb3NlZFByb21pc2VSZWplY3Qod3JpdGVyLCBzdHJlYW0uX3N0b3JlZEVycm9yKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbVVwZGF0ZUJhY2twcmVzc3VyZShzdHJlYW06IFdyaXRhYmxlU3RyZWFtLCBiYWNrcHJlc3N1cmU6IGJvb2xlYW4pIHtcbiAgYXNzZXJ0KHN0cmVhbS5fc3RhdGUgPT09ICd3cml0YWJsZScpO1xuICBhc3NlcnQoIVdyaXRhYmxlU3RyZWFtQ2xvc2VRdWV1ZWRPckluRmxpZ2h0KHN0cmVhbSkpO1xuXG4gIGNvbnN0IHdyaXRlciA9IHN0cmVhbS5fd3JpdGVyO1xuICBpZiAod3JpdGVyICE9PSB1bmRlZmluZWQgJiYgYmFja3ByZXNzdXJlICE9PSBzdHJlYW0uX2JhY2twcmVzc3VyZSkge1xuICAgIGlmIChiYWNrcHJlc3N1cmUpIHtcbiAgICAgIGRlZmF1bHRXcml0ZXJSZWFkeVByb21pc2VSZXNldCh3cml0ZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhc3NlcnQoIWJhY2twcmVzc3VyZSk7XG5cbiAgICAgIGRlZmF1bHRXcml0ZXJSZWFkeVByb21pc2VSZXNvbHZlKHdyaXRlcik7XG4gICAgfVxuICB9XG5cbiAgc3RyZWFtLl9iYWNrcHJlc3N1cmUgPSBiYWNrcHJlc3N1cmU7XG59XG5cbi8qKlxuICogQSBkZWZhdWx0IHdyaXRlciB2ZW5kZWQgYnkgYSB7QGxpbmsgV3JpdGFibGVTdHJlYW19LlxuICpcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNsYXNzIFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcjxXID0gYW55PiB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX293bmVyV3JpdGFibGVTdHJlYW06IFdyaXRhYmxlU3RyZWFtPFc+O1xuICAvKiogQGludGVybmFsICovXG4gIF9jbG9zZWRQcm9taXNlITogUHJvbWlzZTx1bmRlZmluZWQ+O1xuICAvKiogQGludGVybmFsICovXG4gIF9jbG9zZWRQcm9taXNlX3Jlc29sdmU/OiAodmFsdWU/OiB1bmRlZmluZWQpID0+IHZvaWQ7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2Nsb3NlZFByb21pc2VfcmVqZWN0PzogKHJlYXNvbjogYW55KSA9PiB2b2lkO1xuICAvKiogQGludGVybmFsICovXG4gIF9jbG9zZWRQcm9taXNlU3RhdGUhOiAncGVuZGluZycgfCAncmVzb2x2ZWQnIHwgJ3JlamVjdGVkJztcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcmVhZHlQcm9taXNlITogUHJvbWlzZTx1bmRlZmluZWQ+O1xuICAvKiogQGludGVybmFsICovXG4gIF9yZWFkeVByb21pc2VfcmVzb2x2ZT86ICh2YWx1ZT86IHVuZGVmaW5lZCkgPT4gdm9pZDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcmVhZHlQcm9taXNlX3JlamVjdD86IChyZWFzb246IGFueSkgPT4gdm9pZDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcmVhZHlQcm9taXNlU3RhdGUhOiAncGVuZGluZycgfCAnZnVsZmlsbGVkJyB8ICdyZWplY3RlZCc7XG5cbiAgY29uc3RydWN0b3Ioc3RyZWFtOiBXcml0YWJsZVN0cmVhbTxXPikge1xuICAgIGFzc2VydFJlcXVpcmVkQXJndW1lbnQoc3RyZWFtLCAxLCAnV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyJyk7XG4gICAgYXNzZXJ0V3JpdGFibGVTdHJlYW0oc3RyZWFtLCAnRmlyc3QgcGFyYW1ldGVyJyk7XG5cbiAgICBpZiAoSXNXcml0YWJsZVN0cmVhbUxvY2tlZChzdHJlYW0pKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGlzIHN0cmVhbSBoYXMgYWxyZWFkeSBiZWVuIGxvY2tlZCBmb3IgZXhjbHVzaXZlIHdyaXRpbmcgYnkgYW5vdGhlciB3cml0ZXInKTtcbiAgICB9XG5cbiAgICB0aGlzLl9vd25lcldyaXRhYmxlU3RyZWFtID0gc3RyZWFtO1xuICAgIHN0cmVhbS5fd3JpdGVyID0gdGhpcztcblxuICAgIGNvbnN0IHN0YXRlID0gc3RyZWFtLl9zdGF0ZTtcblxuICAgIGlmIChzdGF0ZSA9PT0gJ3dyaXRhYmxlJykge1xuICAgICAgaWYgKCFXcml0YWJsZVN0cmVhbUNsb3NlUXVldWVkT3JJbkZsaWdodChzdHJlYW0pICYmIHN0cmVhbS5fYmFja3ByZXNzdXJlKSB7XG4gICAgICAgIGRlZmF1bHRXcml0ZXJSZWFkeVByb21pc2VJbml0aWFsaXplKHRoaXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGVmYXVsdFdyaXRlclJlYWR5UHJvbWlzZUluaXRpYWxpemVBc1Jlc29sdmVkKHRoaXMpO1xuICAgICAgfVxuXG4gICAgICBkZWZhdWx0V3JpdGVyQ2xvc2VkUHJvbWlzZUluaXRpYWxpemUodGhpcyk7XG4gICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gJ2Vycm9yaW5nJykge1xuICAgICAgZGVmYXVsdFdyaXRlclJlYWR5UHJvbWlzZUluaXRpYWxpemVBc1JlamVjdGVkKHRoaXMsIHN0cmVhbS5fc3RvcmVkRXJyb3IpO1xuICAgICAgZGVmYXVsdFdyaXRlckNsb3NlZFByb21pc2VJbml0aWFsaXplKHRoaXMpO1xuICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09ICdjbG9zZWQnKSB7XG4gICAgICBkZWZhdWx0V3JpdGVyUmVhZHlQcm9taXNlSW5pdGlhbGl6ZUFzUmVzb2x2ZWQodGhpcyk7XG4gICAgICBkZWZhdWx0V3JpdGVyQ2xvc2VkUHJvbWlzZUluaXRpYWxpemVBc1Jlc29sdmVkKHRoaXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhc3NlcnQoc3RhdGUgPT09ICdlcnJvcmVkJyk7XG5cbiAgICAgIGNvbnN0IHN0b3JlZEVycm9yID0gc3RyZWFtLl9zdG9yZWRFcnJvcjtcbiAgICAgIGRlZmF1bHRXcml0ZXJSZWFkeVByb21pc2VJbml0aWFsaXplQXNSZWplY3RlZCh0aGlzLCBzdG9yZWRFcnJvcik7XG4gICAgICBkZWZhdWx0V3JpdGVyQ2xvc2VkUHJvbWlzZUluaXRpYWxpemVBc1JlamVjdGVkKHRoaXMsIHN0b3JlZEVycm9yKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHByb21pc2UgdGhhdCB3aWxsIGJlIGZ1bGZpbGxlZCB3aGVuIHRoZSBzdHJlYW0gYmVjb21lcyBjbG9zZWQsIG9yIHJlamVjdGVkIGlmIHRoZSBzdHJlYW0gZXZlciBlcnJvcnMgb3JcbiAgICogdGhlIHdyaXRlcuKAmXMgbG9jayBpcyByZWxlYXNlZCBiZWZvcmUgdGhlIHN0cmVhbSBmaW5pc2hlcyBjbG9zaW5nLlxuICAgKi9cbiAgZ2V0IGNsb3NlZCgpOiBQcm9taXNlPHVuZGVmaW5lZD4ge1xuICAgIGlmICghSXNXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIodGhpcykpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKGRlZmF1bHRXcml0ZXJCcmFuZENoZWNrRXhjZXB0aW9uKCdjbG9zZWQnKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2Nsb3NlZFByb21pc2U7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZGVzaXJlZCBzaXplIHRvIGZpbGwgdGhlIHN0cmVhbeKAmXMgaW50ZXJuYWwgcXVldWUuIEl0IGNhbiBiZSBuZWdhdGl2ZSwgaWYgdGhlIHF1ZXVlIGlzIG92ZXItZnVsbC5cbiAgICogQSBwcm9kdWNlciBjYW4gdXNlIHRoaXMgaW5mb3JtYXRpb24gdG8gZGV0ZXJtaW5lIHRoZSByaWdodCBhbW91bnQgb2YgZGF0YSB0byB3cml0ZS5cbiAgICpcbiAgICogSXQgd2lsbCBiZSBgbnVsbGAgaWYgdGhlIHN0cmVhbSBjYW5ub3QgYmUgc3VjY2Vzc2Z1bGx5IHdyaXR0ZW4gdG8gKGR1ZSB0byBlaXRoZXIgYmVpbmcgZXJyb3JlZCwgb3IgaGF2aW5nIGFuIGFib3J0XG4gICAqIHF1ZXVlZCB1cCkuIEl0IHdpbGwgcmV0dXJuIHplcm8gaWYgdGhlIHN0cmVhbSBpcyBjbG9zZWQuIEFuZCB0aGUgZ2V0dGVyIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGludm9rZWQgd2hlblxuICAgKiB0aGUgd3JpdGVy4oCZcyBsb2NrIGlzIHJlbGVhc2VkLlxuICAgKi9cbiAgZ2V0IGRlc2lyZWRTaXplKCk6IG51bWJlciB8IG51bGwge1xuICAgIGlmICghSXNXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIodGhpcykpIHtcbiAgICAgIHRocm93IGRlZmF1bHRXcml0ZXJCcmFuZENoZWNrRXhjZXB0aW9uKCdkZXNpcmVkU2l6ZScpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9vd25lcldyaXRhYmxlU3RyZWFtID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IGRlZmF1bHRXcml0ZXJMb2NrRXhjZXB0aW9uKCdkZXNpcmVkU2l6ZScpO1xuICAgIH1cblxuICAgIHJldHVybiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXJHZXREZXNpcmVkU2l6ZSh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHdpbGwgYmUgZnVsZmlsbGVkIHdoZW4gdGhlIGRlc2lyZWQgc2l6ZSB0byBmaWxsIHRoZSBzdHJlYW3igJlzIGludGVybmFsIHF1ZXVlIHRyYW5zaXRpb25zXG4gICAqIGZyb20gbm9uLXBvc2l0aXZlIHRvIHBvc2l0aXZlLCBzaWduYWxpbmcgdGhhdCBpdCBpcyBubyBsb25nZXIgYXBwbHlpbmcgYmFja3ByZXNzdXJlLiBPbmNlIHRoZSBkZXNpcmVkIHNpemUgZGlwc1xuICAgKiBiYWNrIHRvIHplcm8gb3IgYmVsb3csIHRoZSBnZXR0ZXIgd2lsbCByZXR1cm4gYSBuZXcgcHJvbWlzZSB0aGF0IHN0YXlzIHBlbmRpbmcgdW50aWwgdGhlIG5leHQgdHJhbnNpdGlvbi5cbiAgICpcbiAgICogSWYgdGhlIHN0cmVhbSBiZWNvbWVzIGVycm9yZWQgb3IgYWJvcnRlZCwgb3IgdGhlIHdyaXRlcuKAmXMgbG9jayBpcyByZWxlYXNlZCwgdGhlIHJldHVybmVkIHByb21pc2Ugd2lsbCBiZWNvbWVcbiAgICogcmVqZWN0ZWQuXG4gICAqL1xuICBnZXQgcmVhZHkoKTogUHJvbWlzZTx1bmRlZmluZWQ+IHtcbiAgICBpZiAoIUlzV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyKHRoaXMpKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChkZWZhdWx0V3JpdGVyQnJhbmRDaGVja0V4Y2VwdGlvbigncmVhZHknKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3JlYWR5UHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJZiB0aGUgcmVhZGVyIGlzIGFjdGl2ZSwgYmVoYXZlcyB0aGUgc2FtZSBhcyB7QGxpbmsgV3JpdGFibGVTdHJlYW0uYWJvcnQgfCBzdHJlYW0uYWJvcnQocmVhc29uKX0uXG4gICAqL1xuICBhYm9ydChyZWFzb246IGFueSA9IHVuZGVmaW5lZCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghSXNXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIodGhpcykpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKGRlZmF1bHRXcml0ZXJCcmFuZENoZWNrRXhjZXB0aW9uKCdhYm9ydCcpKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fb3duZXJXcml0YWJsZVN0cmVhbSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChkZWZhdWx0V3JpdGVyTG9ja0V4Y2VwdGlvbignYWJvcnQnKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlckFib3J0KHRoaXMsIHJlYXNvbik7XG4gIH1cblxuICAvKipcbiAgICogSWYgdGhlIHJlYWRlciBpcyBhY3RpdmUsIGJlaGF2ZXMgdGhlIHNhbWUgYXMge0BsaW5rIFdyaXRhYmxlU3RyZWFtLmNsb3NlIHwgc3RyZWFtLmNsb3NlKCl9LlxuICAgKi9cbiAgY2xvc2UoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCFJc1dyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcih0aGlzKSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoZGVmYXVsdFdyaXRlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ2Nsb3NlJykpO1xuICAgIH1cblxuICAgIGNvbnN0IHN0cmVhbSA9IHRoaXMuX293bmVyV3JpdGFibGVTdHJlYW07XG5cbiAgICBpZiAoc3RyZWFtID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKGRlZmF1bHRXcml0ZXJMb2NrRXhjZXB0aW9uKCdjbG9zZScpKTtcbiAgICB9XG5cbiAgICBpZiAoV3JpdGFibGVTdHJlYW1DbG9zZVF1ZXVlZE9ySW5GbGlnaHQoc3RyZWFtKSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgobmV3IFR5cGVFcnJvcignQ2Fubm90IGNsb3NlIGFuIGFscmVhZHktY2xvc2luZyBzdHJlYW0nKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlckNsb3NlKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbGVhc2VzIHRoZSB3cml0ZXLigJlzIGxvY2sgb24gdGhlIGNvcnJlc3BvbmRpbmcgc3RyZWFtLiBBZnRlciB0aGUgbG9jayBpcyByZWxlYXNlZCwgdGhlIHdyaXRlciBpcyBubyBsb25nZXIgYWN0aXZlLlxuICAgKiBJZiB0aGUgYXNzb2NpYXRlZCBzdHJlYW0gaXMgZXJyb3JlZCB3aGVuIHRoZSBsb2NrIGlzIHJlbGVhc2VkLCB0aGUgd3JpdGVyIHdpbGwgYXBwZWFyIGVycm9yZWQgaW4gdGhlIHNhbWUgd2F5IGZyb21cbiAgICogbm93IG9uOyBvdGhlcndpc2UsIHRoZSB3cml0ZXIgd2lsbCBhcHBlYXIgY2xvc2VkLlxuICAgKlxuICAgKiBOb3RlIHRoYXQgdGhlIGxvY2sgY2FuIHN0aWxsIGJlIHJlbGVhc2VkIGV2ZW4gaWYgc29tZSBvbmdvaW5nIHdyaXRlcyBoYXZlIG5vdCB5ZXQgZmluaXNoZWQgKGkuZS4gZXZlbiBpZiB0aGVcbiAgICogcHJvbWlzZXMgcmV0dXJuZWQgZnJvbSBwcmV2aW91cyBjYWxscyB0byB7QGxpbmsgV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyLndyaXRlIHwgd3JpdGUoKX0gaGF2ZSBub3QgeWV0IHNldHRsZWQpLlxuICAgKiBJdOKAmXMgbm90IG5lY2Vzc2FyeSB0byBob2xkIHRoZSBsb2NrIG9uIHRoZSB3cml0ZXIgZm9yIHRoZSBkdXJhdGlvbiBvZiB0aGUgd3JpdGU7IHRoZSBsb2NrIGluc3RlYWQgc2ltcGx5IHByZXZlbnRzXG4gICAqIG90aGVyIHByb2R1Y2VycyBmcm9tIHdyaXRpbmcgaW4gYW4gaW50ZXJsZWF2ZWQgbWFubmVyLlxuICAgKi9cbiAgcmVsZWFzZUxvY2soKTogdm9pZCB7XG4gICAgaWYgKCFJc1dyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcih0aGlzKSkge1xuICAgICAgdGhyb3cgZGVmYXVsdFdyaXRlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ3JlbGVhc2VMb2NrJyk7XG4gICAgfVxuXG4gICAgY29uc3Qgc3RyZWFtID0gdGhpcy5fb3duZXJXcml0YWJsZVN0cmVhbTtcblxuICAgIGlmIChzdHJlYW0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGFzc2VydChzdHJlYW0uX3dyaXRlciAhPT0gdW5kZWZpbmVkKTtcblxuICAgIFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlclJlbGVhc2UodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogV3JpdGVzIHRoZSBnaXZlbiBjaHVuayB0byB0aGUgd3JpdGFibGUgc3RyZWFtLCBieSB3YWl0aW5nIHVudGlsIGFueSBwcmV2aW91cyB3cml0ZXMgaGF2ZSBmaW5pc2hlZCBzdWNjZXNzZnVsbHksXG4gICAqIGFuZCB0aGVuIHNlbmRpbmcgdGhlIGNodW5rIHRvIHRoZSB1bmRlcmx5aW5nIHNpbmsncyB7QGxpbmsgVW5kZXJseWluZ1Npbmsud3JpdGUgfCB3cml0ZSgpfSBtZXRob2QuIEl0IHdpbGwgcmV0dXJuXG4gICAqIGEgcHJvbWlzZSB0aGF0IGZ1bGZpbGxzIHdpdGggdW5kZWZpbmVkIHVwb24gYSBzdWNjZXNzZnVsIHdyaXRlLCBvciByZWplY3RzIGlmIHRoZSB3cml0ZSBmYWlscyBvciBzdHJlYW0gYmVjb21lc1xuICAgKiBlcnJvcmVkIGJlZm9yZSB0aGUgd3JpdGluZyBwcm9jZXNzIGlzIGluaXRpYXRlZC5cbiAgICpcbiAgICogTm90ZSB0aGF0IHdoYXQgXCJzdWNjZXNzXCIgbWVhbnMgaXMgdXAgdG8gdGhlIHVuZGVybHlpbmcgc2luazsgaXQgbWlnaHQgaW5kaWNhdGUgc2ltcGx5IHRoYXQgdGhlIGNodW5rIGhhcyBiZWVuXG4gICAqIGFjY2VwdGVkLCBhbmQgbm90IG5lY2Vzc2FyaWx5IHRoYXQgaXQgaXMgc2FmZWx5IHNhdmVkIHRvIGl0cyB1bHRpbWF0ZSBkZXN0aW5hdGlvbi5cbiAgICovXG4gIHdyaXRlKGNodW5rOiBXKTogUHJvbWlzZTx2b2lkPjtcbiAgd3JpdGUoY2h1bms6IFcgPSB1bmRlZmluZWQhKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCFJc1dyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcih0aGlzKSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoZGVmYXVsdFdyaXRlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ3dyaXRlJykpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9vd25lcldyaXRhYmxlU3RyZWFtID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKGRlZmF1bHRXcml0ZXJMb2NrRXhjZXB0aW9uKCd3cml0ZSB0bycpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyV3JpdGUodGhpcywgY2h1bmspO1xuICB9XG59XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlci5wcm90b3R5cGUsIHtcbiAgYWJvcnQ6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICBjbG9zZTogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIHJlbGVhc2VMb2NrOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgd3JpdGU6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICBjbG9zZWQ6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICBkZXNpcmVkU2l6ZTogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIHJlYWR5OiB7IGVudW1lcmFibGU6IHRydWUgfVxufSk7XG5zZXRGdW5jdGlvbk5hbWUoV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyLnByb3RvdHlwZS5hYm9ydCwgJ2Fib3J0Jyk7XG5zZXRGdW5jdGlvbk5hbWUoV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyLnByb3RvdHlwZS5jbG9zZSwgJ2Nsb3NlJyk7XG5zZXRGdW5jdGlvbk5hbWUoV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyLnByb3RvdHlwZS5yZWxlYXNlTG9jaywgJ3JlbGVhc2VMb2NrJyk7XG5zZXRGdW5jdGlvbk5hbWUoV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyLnByb3RvdHlwZS53cml0ZSwgJ3dyaXRlJyk7XG5pZiAodHlwZW9mIFN5bWJvbC50b1N0cmluZ1RhZyA9PT0gJ3N5bWJvbCcpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlci5wcm90b3R5cGUsIFN5bWJvbC50b1N0cmluZ1RhZywge1xuICAgIHZhbHVlOiAnV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyJyxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG59XG5cbi8vIEFic3RyYWN0IG9wZXJhdGlvbnMgZm9yIHRoZSBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIuXG5cbmZ1bmN0aW9uIElzV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyPFcgPSBhbnk+KHg6IGFueSk6IHggaXMgV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyPFc+IHtcbiAgaWYgKCF0eXBlSXNPYmplY3QoeCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh4LCAnX293bmVyV3JpdGFibGVTdHJlYW0nKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB4IGluc3RhbmNlb2YgV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyO1xufVxuXG4vLyBBIGNsaWVudCBvZiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIgbWF5IHVzZSB0aGVzZSBmdW5jdGlvbnMgZGlyZWN0bHkgdG8gYnlwYXNzIHN0YXRlIGNoZWNrLlxuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXJBYm9ydCh3cml0ZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlciwgcmVhc29uOiBhbnkpIHtcbiAgY29uc3Qgc3RyZWFtID0gd3JpdGVyLl9vd25lcldyaXRhYmxlU3RyZWFtO1xuXG4gIGFzc2VydChzdHJlYW0gIT09IHVuZGVmaW5lZCk7XG5cbiAgcmV0dXJuIFdyaXRhYmxlU3RyZWFtQWJvcnQoc3RyZWFtLCByZWFzb24pO1xufVxuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXJDbG9zZSh3cml0ZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcik6IFByb21pc2U8dW5kZWZpbmVkPiB7XG4gIGNvbnN0IHN0cmVhbSA9IHdyaXRlci5fb3duZXJXcml0YWJsZVN0cmVhbTtcblxuICBhc3NlcnQoc3RyZWFtICE9PSB1bmRlZmluZWQpO1xuXG4gIHJldHVybiBXcml0YWJsZVN0cmVhbUNsb3NlKHN0cmVhbSk7XG59XG5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlckNsb3NlV2l0aEVycm9yUHJvcGFnYXRpb24od3JpdGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIpOiBQcm9taXNlPHVuZGVmaW5lZD4ge1xuICBjb25zdCBzdHJlYW0gPSB3cml0ZXIuX293bmVyV3JpdGFibGVTdHJlYW07XG5cbiAgYXNzZXJ0KHN0cmVhbSAhPT0gdW5kZWZpbmVkKTtcblxuICBjb25zdCBzdGF0ZSA9IHN0cmVhbS5fc3RhdGU7XG4gIGlmIChXcml0YWJsZVN0cmVhbUNsb3NlUXVldWVkT3JJbkZsaWdodChzdHJlYW0pIHx8IHN0YXRlID09PSAnY2xvc2VkJykge1xuICAgIHJldHVybiBwcm9taXNlUmVzb2x2ZWRXaXRoKHVuZGVmaW5lZCk7XG4gIH1cblxuICBpZiAoc3RhdGUgPT09ICdlcnJvcmVkJykge1xuICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKHN0cmVhbS5fc3RvcmVkRXJyb3IpO1xuICB9XG5cbiAgYXNzZXJ0KHN0YXRlID09PSAnd3JpdGFibGUnIHx8IHN0YXRlID09PSAnZXJyb3JpbmcnKTtcblxuICByZXR1cm4gV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyQ2xvc2Uod3JpdGVyKTtcbn1cblxuZnVuY3Rpb24gV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyRW5zdXJlQ2xvc2VkUHJvbWlzZVJlamVjdGVkKHdyaXRlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyLCBlcnJvcjogYW55KSB7XG4gIGlmICh3cml0ZXIuX2Nsb3NlZFByb21pc2VTdGF0ZSA9PT0gJ3BlbmRpbmcnKSB7XG4gICAgZGVmYXVsdFdyaXRlckNsb3NlZFByb21pc2VSZWplY3Qod3JpdGVyLCBlcnJvcik7XG4gIH0gZWxzZSB7XG4gICAgZGVmYXVsdFdyaXRlckNsb3NlZFByb21pc2VSZXNldFRvUmVqZWN0ZWQod3JpdGVyLCBlcnJvcik7XG4gIH1cbn1cblxuZnVuY3Rpb24gV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyRW5zdXJlUmVhZHlQcm9taXNlUmVqZWN0ZWQod3JpdGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIsIGVycm9yOiBhbnkpIHtcbiAgaWYgKHdyaXRlci5fcmVhZHlQcm9taXNlU3RhdGUgPT09ICdwZW5kaW5nJykge1xuICAgIGRlZmF1bHRXcml0ZXJSZWFkeVByb21pc2VSZWplY3Qod3JpdGVyLCBlcnJvcik7XG4gIH0gZWxzZSB7XG4gICAgZGVmYXVsdFdyaXRlclJlYWR5UHJvbWlzZVJlc2V0VG9SZWplY3RlZCh3cml0ZXIsIGVycm9yKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXJHZXREZXNpcmVkU2l6ZSh3cml0ZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcik6IG51bWJlciB8IG51bGwge1xuICBjb25zdCBzdHJlYW0gPSB3cml0ZXIuX293bmVyV3JpdGFibGVTdHJlYW07XG4gIGNvbnN0IHN0YXRlID0gc3RyZWFtLl9zdGF0ZTtcblxuICBpZiAoc3RhdGUgPT09ICdlcnJvcmVkJyB8fCBzdGF0ZSA9PT0gJ2Vycm9yaW5nJykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKHN0YXRlID09PSAnY2xvc2VkJykge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgcmV0dXJuIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJHZXREZXNpcmVkU2l6ZShzdHJlYW0uX3dyaXRhYmxlU3RyZWFtQ29udHJvbGxlcik7XG59XG5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlclJlbGVhc2Uod3JpdGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIpIHtcbiAgY29uc3Qgc3RyZWFtID0gd3JpdGVyLl9vd25lcldyaXRhYmxlU3RyZWFtO1xuICBhc3NlcnQoc3RyZWFtICE9PSB1bmRlZmluZWQpO1xuICBhc3NlcnQoc3RyZWFtLl93cml0ZXIgPT09IHdyaXRlcik7XG5cbiAgY29uc3QgcmVsZWFzZWRFcnJvciA9IG5ldyBUeXBlRXJyb3IoXG4gICAgYFdyaXRlciB3YXMgcmVsZWFzZWQgYW5kIGNhbiBubyBsb25nZXIgYmUgdXNlZCB0byBtb25pdG9yIHRoZSBzdHJlYW0ncyBjbG9zZWRuZXNzYCk7XG5cbiAgV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyRW5zdXJlUmVhZHlQcm9taXNlUmVqZWN0ZWQod3JpdGVyLCByZWxlYXNlZEVycm9yKTtcblxuICAvLyBUaGUgc3RhdGUgdHJhbnNpdGlvbnMgdG8gXCJlcnJvcmVkXCIgYmVmb3JlIHRoZSBzaW5rIGFib3J0KCkgbWV0aG9kIHJ1bnMsIGJ1dCB0aGUgd3JpdGVyLmNsb3NlZCBwcm9taXNlIGlzIG5vdFxuICAvLyByZWplY3RlZCB1bnRpbCBhZnRlcndhcmRzLiBUaGlzIG1lYW5zIHRoYXQgc2ltcGx5IHRlc3Rpbmcgc3RhdGUgd2lsbCBub3Qgd29yay5cbiAgV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyRW5zdXJlQ2xvc2VkUHJvbWlzZVJlamVjdGVkKHdyaXRlciwgcmVsZWFzZWRFcnJvcik7XG5cbiAgc3RyZWFtLl93cml0ZXIgPSB1bmRlZmluZWQ7XG4gIHdyaXRlci5fb3duZXJXcml0YWJsZVN0cmVhbSA9IHVuZGVmaW5lZCE7XG59XG5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcldyaXRlPFc+KHdyaXRlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyPFc+LCBjaHVuazogVyk6IFByb21pc2U8dW5kZWZpbmVkPiB7XG4gIGNvbnN0IHN0cmVhbSA9IHdyaXRlci5fb3duZXJXcml0YWJsZVN0cmVhbTtcblxuICBhc3NlcnQoc3RyZWFtICE9PSB1bmRlZmluZWQpO1xuXG4gIGNvbnN0IGNvbnRyb2xsZXIgPSBzdHJlYW0uX3dyaXRhYmxlU3RyZWFtQ29udHJvbGxlcjtcblxuICBjb25zdCBjaHVua1NpemUgPSBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyR2V0Q2h1bmtTaXplKGNvbnRyb2xsZXIsIGNodW5rKTtcblxuICBpZiAoc3RyZWFtICE9PSB3cml0ZXIuX293bmVyV3JpdGFibGVTdHJlYW0pIHtcbiAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChkZWZhdWx0V3JpdGVyTG9ja0V4Y2VwdGlvbignd3JpdGUgdG8nKSk7XG4gIH1cblxuICBjb25zdCBzdGF0ZSA9IHN0cmVhbS5fc3RhdGU7XG4gIGlmIChzdGF0ZSA9PT0gJ2Vycm9yZWQnKSB7XG4gICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoc3RyZWFtLl9zdG9yZWRFcnJvcik7XG4gIH1cbiAgaWYgKFdyaXRhYmxlU3RyZWFtQ2xvc2VRdWV1ZWRPckluRmxpZ2h0KHN0cmVhbSkgfHwgc3RhdGUgPT09ICdjbG9zZWQnKSB7XG4gICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgobmV3IFR5cGVFcnJvcignVGhlIHN0cmVhbSBpcyBjbG9zaW5nIG9yIGNsb3NlZCBhbmQgY2Fubm90IGJlIHdyaXR0ZW4gdG8nKSk7XG4gIH1cbiAgaWYgKHN0YXRlID09PSAnZXJyb3JpbmcnKSB7XG4gICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoc3RyZWFtLl9zdG9yZWRFcnJvcik7XG4gIH1cblxuICBhc3NlcnQoc3RhdGUgPT09ICd3cml0YWJsZScpO1xuXG4gIGNvbnN0IHByb21pc2UgPSBXcml0YWJsZVN0cmVhbUFkZFdyaXRlUmVxdWVzdChzdHJlYW0pO1xuXG4gIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJXcml0ZShjb250cm9sbGVyLCBjaHVuaywgY2h1bmtTaXplKTtcblxuICByZXR1cm4gcHJvbWlzZTtcbn1cblxuY29uc3QgY2xvc2VTZW50aW5lbDogdW5pcXVlIHN5bWJvbCA9IHt9IGFzIGFueTtcblxudHlwZSBRdWV1ZVJlY29yZDxXPiA9IFcgfCB0eXBlb2YgY2xvc2VTZW50aW5lbDtcblxuLyoqXG4gKiBBbGxvd3MgY29udHJvbCBvZiBhIHtAbGluayBXcml0YWJsZVN0cmVhbSB8IHdyaXRhYmxlIHN0cmVhbX0ncyBzdGF0ZSBhbmQgaW50ZXJuYWwgcXVldWUuXG4gKlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY2xhc3MgV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxXID0gYW55PiB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2NvbnRyb2xsZWRXcml0YWJsZVN0cmVhbSE6IFdyaXRhYmxlU3RyZWFtPFc+O1xuICAvKiogQGludGVybmFsICovXG4gIF9xdWV1ZSE6IFNpbXBsZVF1ZXVlPFF1ZXVlUGFpcjxRdWV1ZVJlY29yZDxXPj4+O1xuICAvKiogQGludGVybmFsICovXG4gIF9xdWV1ZVRvdGFsU2l6ZSE6IG51bWJlcjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfYWJvcnRSZWFzb246IGFueTtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfYWJvcnRDb250cm9sbGVyOiBBYm9ydENvbnRyb2xsZXIgfCB1bmRlZmluZWQ7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3N0YXJ0ZWQhOiBib29sZWFuO1xuICAvKiogQGludGVybmFsICovXG4gIF9zdHJhdGVneVNpemVBbGdvcml0aG0hOiBRdWV1aW5nU3RyYXRlZ3lTaXplQ2FsbGJhY2s8Vz47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3N0cmF0ZWd5SFdNITogbnVtYmVyO1xuICAvKiogQGludGVybmFsICovXG4gIF93cml0ZUFsZ29yaXRobSE6IChjaHVuazogVykgPT4gUHJvbWlzZTx2b2lkPjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfY2xvc2VBbGdvcml0aG0hOiAoKSA9PiBQcm9taXNlPHZvaWQ+O1xuICAvKiogQGludGVybmFsICovXG4gIF9hYm9ydEFsZ29yaXRobSE6IChyZWFzb246IGFueSkgPT4gUHJvbWlzZTx2b2lkPjtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0lsbGVnYWwgY29uc3RydWN0b3InKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgcmVhc29uIHdoaWNoIHdhcyBwYXNzZWQgdG8gYFdyaXRhYmxlU3RyZWFtLmFib3J0KHJlYXNvbilgIHdoZW4gdGhlIHN0cmVhbSB3YXMgYWJvcnRlZC5cbiAgICpcbiAgICogQGRlcHJlY2F0ZWRcbiAgICogIFRoaXMgcHJvcGVydHkgaGFzIGJlZW4gcmVtb3ZlZCBmcm9tIHRoZSBzcGVjaWZpY2F0aW9uLCBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3doYXR3Zy9zdHJlYW1zL3B1bGwvMTE3Ny5cbiAgICogIFVzZSB7QGxpbmsgV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlci5zaWduYWx9J3MgYHJlYXNvbmAgaW5zdGVhZC5cbiAgICovXG4gIGdldCBhYm9ydFJlYXNvbigpOiBhbnkge1xuICAgIGlmICghSXNXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyKHRoaXMpKSB7XG4gICAgICB0aHJvdyBkZWZhdWx0Q29udHJvbGxlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ2Fib3J0UmVhc29uJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9hYm9ydFJlYXNvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbiBgQWJvcnRTaWduYWxgIHRoYXQgY2FuIGJlIHVzZWQgdG8gYWJvcnQgdGhlIHBlbmRpbmcgd3JpdGUgb3IgY2xvc2Ugb3BlcmF0aW9uIHdoZW4gdGhlIHN0cmVhbSBpcyBhYm9ydGVkLlxuICAgKi9cbiAgZ2V0IHNpZ25hbCgpOiBBYm9ydFNpZ25hbCB7XG4gICAgaWYgKCFJc1dyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIodGhpcykpIHtcbiAgICAgIHRocm93IGRlZmF1bHRDb250cm9sbGVyQnJhbmRDaGVja0V4Y2VwdGlvbignc2lnbmFsJyk7XG4gICAgfVxuICAgIGlmICh0aGlzLl9hYm9ydENvbnRyb2xsZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gT2xkZXIgYnJvd3NlcnMgb3Igb2xkZXIgTm9kZSB2ZXJzaW9ucyBtYXkgbm90IHN1cHBvcnQgYEFib3J0Q29udHJvbGxlcmAgb3IgYEFib3J0U2lnbmFsYC5cbiAgICAgIC8vIFdlIGRvbid0IHdhbnQgdG8gYnVuZGxlIGFuZCBzaGlwIGFuIGBBYm9ydENvbnRyb2xsZXJgIHBvbHlmaWxsIHRvZ2V0aGVyIHdpdGggb3VyIHBvbHlmaWxsLFxuICAgICAgLy8gc28gaW5zdGVhZCB3ZSBvbmx5IGltcGxlbWVudCBzdXBwb3J0IGZvciBgc2lnbmFsYCBpZiB3ZSBmaW5kIGEgZ2xvYmFsIGBBYm9ydENvbnRyb2xsZXJgIGNvbnN0cnVjdG9yLlxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlci5wcm90b3R5cGUuc2lnbmFsIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2Fib3J0Q29udHJvbGxlci5zaWduYWw7XG4gIH1cblxuICAvKipcbiAgICogQ2xvc2VzIHRoZSBjb250cm9sbGVkIHdyaXRhYmxlIHN0cmVhbSwgbWFraW5nIGFsbCBmdXR1cmUgaW50ZXJhY3Rpb25zIHdpdGggaXQgZmFpbCB3aXRoIHRoZSBnaXZlbiBlcnJvciBgZWAuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGlzIHJhcmVseSB1c2VkLCBzaW5jZSB1c3VhbGx5IGl0IHN1ZmZpY2VzIHRvIHJldHVybiBhIHJlamVjdGVkIHByb21pc2UgZnJvbSBvbmUgb2YgdGhlIHVuZGVybHlpbmdcbiAgICogc2luaydzIG1ldGhvZHMuIEhvd2V2ZXIsIGl0IGNhbiBiZSB1c2VmdWwgZm9yIHN1ZGRlbmx5IHNodXR0aW5nIGRvd24gYSBzdHJlYW0gaW4gcmVzcG9uc2UgdG8gYW4gZXZlbnQgb3V0c2lkZSB0aGVcbiAgICogbm9ybWFsIGxpZmVjeWNsZSBvZiBpbnRlcmFjdGlvbnMgd2l0aCB0aGUgdW5kZXJseWluZyBzaW5rLlxuICAgKi9cbiAgZXJyb3IoZTogYW55ID0gdW5kZWZpbmVkKTogdm9pZCB7XG4gICAgaWYgKCFJc1dyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIodGhpcykpIHtcbiAgICAgIHRocm93IGRlZmF1bHRDb250cm9sbGVyQnJhbmRDaGVja0V4Y2VwdGlvbignZXJyb3InKTtcbiAgICB9XG4gICAgY29uc3Qgc3RhdGUgPSB0aGlzLl9jb250cm9sbGVkV3JpdGFibGVTdHJlYW0uX3N0YXRlO1xuICAgIGlmIChzdGF0ZSAhPT0gJ3dyaXRhYmxlJykge1xuICAgICAgLy8gVGhlIHN0cmVhbSBpcyBjbG9zZWQsIGVycm9yZWQgb3Igd2lsbCBiZSBzb29uLiBUaGUgc2luayBjYW4ndCBkbyBhbnl0aGluZyB1c2VmdWwgaWYgaXQgZ2V0cyBhbiBlcnJvciBoZXJlLCBzb1xuICAgICAgLy8ganVzdCB0cmVhdCBpdCBhcyBhIG5vLW9wLlxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFcnJvcih0aGlzLCBlKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgW0Fib3J0U3RlcHNdKHJlYXNvbjogYW55KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5fYWJvcnRBbGdvcml0aG0ocmVhc29uKTtcbiAgICBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2xlYXJBbGdvcml0aG1zKHRoaXMpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIFtFcnJvclN0ZXBzXSgpIHtcbiAgICBSZXNldFF1ZXVlKHRoaXMpO1xuICB9XG59XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIucHJvdG90eXBlLCB7XG4gIGFib3J0UmVhc29uOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgc2lnbmFsOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgZXJyb3I6IHsgZW51bWVyYWJsZTogdHJ1ZSB9XG59KTtcbmlmICh0eXBlb2YgU3ltYm9sLnRvU3RyaW5nVGFnID09PSAnc3ltYm9sJykge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlci5wcm90b3R5cGUsIFN5bWJvbC50b1N0cmluZ1RhZywge1xuICAgIHZhbHVlOiAnV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcicsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xufVxuXG4vLyBBYnN0cmFjdCBvcGVyYXRpb25zIGltcGxlbWVudGluZyBpbnRlcmZhY2UgcmVxdWlyZWQgYnkgdGhlIFdyaXRhYmxlU3RyZWFtLlxuXG5mdW5jdGlvbiBJc1dyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIoeDogYW55KTogeCBpcyBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyPGFueT4ge1xuICBpZiAoIXR5cGVJc09iamVjdCh4KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHgsICdfY29udHJvbGxlZFdyaXRhYmxlU3RyZWFtJykpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4geCBpbnN0YW5jZW9mIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI7XG59XG5cbmZ1bmN0aW9uIFNldFVwV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxXPihzdHJlYW06IFdyaXRhYmxlU3RyZWFtPFc+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8Vz4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRBbGdvcml0aG06ICgpID0+IHZvaWQgfCBQcm9taXNlTGlrZTx2b2lkPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3cml0ZUFsZ29yaXRobTogKGNodW5rOiBXKSA9PiBQcm9taXNlPHZvaWQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsb3NlQWxnb3JpdGhtOiAoKSA9PiBQcm9taXNlPHZvaWQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFib3J0QWxnb3JpdGhtOiAocmVhc29uOiBhbnkpID0+IFByb21pc2U8dm9pZD4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGlnaFdhdGVyTWFyazogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpemVBbGdvcml0aG06IFF1ZXVpbmdTdHJhdGVneVNpemVDYWxsYmFjazxXPikge1xuICBhc3NlcnQoSXNXcml0YWJsZVN0cmVhbShzdHJlYW0pKTtcbiAgYXNzZXJ0KHN0cmVhbS5fd3JpdGFibGVTdHJlYW1Db250cm9sbGVyID09PSB1bmRlZmluZWQpO1xuXG4gIGNvbnRyb2xsZXIuX2NvbnRyb2xsZWRXcml0YWJsZVN0cmVhbSA9IHN0cmVhbTtcbiAgc3RyZWFtLl93cml0YWJsZVN0cmVhbUNvbnRyb2xsZXIgPSBjb250cm9sbGVyO1xuXG4gIC8vIE5lZWQgdG8gc2V0IHRoZSBzbG90cyBzbyB0aGF0IHRoZSBhc3NlcnQgZG9lc24ndCBmaXJlLiBJbiB0aGUgc3BlYyB0aGUgc2xvdHMgYWxyZWFkeSBleGlzdCBpbXBsaWNpdGx5LlxuICBjb250cm9sbGVyLl9xdWV1ZSA9IHVuZGVmaW5lZCE7XG4gIGNvbnRyb2xsZXIuX3F1ZXVlVG90YWxTaXplID0gdW5kZWZpbmVkITtcbiAgUmVzZXRRdWV1ZShjb250cm9sbGVyKTtcblxuICBjb250cm9sbGVyLl9hYm9ydFJlYXNvbiA9IHVuZGVmaW5lZDtcbiAgY29udHJvbGxlci5fYWJvcnRDb250cm9sbGVyID0gY3JlYXRlQWJvcnRDb250cm9sbGVyKCk7XG4gIGNvbnRyb2xsZXIuX3N0YXJ0ZWQgPSBmYWxzZTtcblxuICBjb250cm9sbGVyLl9zdHJhdGVneVNpemVBbGdvcml0aG0gPSBzaXplQWxnb3JpdGhtO1xuICBjb250cm9sbGVyLl9zdHJhdGVneUhXTSA9IGhpZ2hXYXRlck1hcms7XG5cbiAgY29udHJvbGxlci5fd3JpdGVBbGdvcml0aG0gPSB3cml0ZUFsZ29yaXRobTtcbiAgY29udHJvbGxlci5fY2xvc2VBbGdvcml0aG0gPSBjbG9zZUFsZ29yaXRobTtcbiAgY29udHJvbGxlci5fYWJvcnRBbGdvcml0aG0gPSBhYm9ydEFsZ29yaXRobTtcblxuICBjb25zdCBiYWNrcHJlc3N1cmUgPSBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyR2V0QmFja3ByZXNzdXJlKGNvbnRyb2xsZXIpO1xuICBXcml0YWJsZVN0cmVhbVVwZGF0ZUJhY2twcmVzc3VyZShzdHJlYW0sIGJhY2twcmVzc3VyZSk7XG5cbiAgY29uc3Qgc3RhcnRSZXN1bHQgPSBzdGFydEFsZ29yaXRobSgpO1xuICBjb25zdCBzdGFydFByb21pc2UgPSBwcm9taXNlUmVzb2x2ZWRXaXRoKHN0YXJ0UmVzdWx0KTtcbiAgdXBvblByb21pc2UoXG4gICAgc3RhcnRQcm9taXNlLFxuICAgICgpID0+IHtcbiAgICAgIGFzc2VydChzdHJlYW0uX3N0YXRlID09PSAnd3JpdGFibGUnIHx8IHN0cmVhbS5fc3RhdGUgPT09ICdlcnJvcmluZycpO1xuICAgICAgY29udHJvbGxlci5fc3RhcnRlZCA9IHRydWU7XG4gICAgICBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQWR2YW5jZVF1ZXVlSWZOZWVkZWQoY29udHJvbGxlcik7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIHIgPT4ge1xuICAgICAgYXNzZXJ0KHN0cmVhbS5fc3RhdGUgPT09ICd3cml0YWJsZScgfHwgc3RyZWFtLl9zdGF0ZSA9PT0gJ2Vycm9yaW5nJyk7XG4gICAgICBjb250cm9sbGVyLl9zdGFydGVkID0gdHJ1ZTtcbiAgICAgIFdyaXRhYmxlU3RyZWFtRGVhbFdpdGhSZWplY3Rpb24oc3RyZWFtLCByKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgKTtcbn1cblxuZnVuY3Rpb24gU2V0VXBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRnJvbVVuZGVybHlpbmdTaW5rPFc+KHN0cmVhbTogV3JpdGFibGVTdHJlYW08Vz4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5kZXJseWluZ1Npbms6IFZhbGlkYXRlZFVuZGVybHlpbmdTaW5rPFc+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhpZ2hXYXRlck1hcms6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaXplQWxnb3JpdGhtOiBRdWV1aW5nU3RyYXRlZ3lTaXplQ2FsbGJhY2s8Vz4pIHtcbiAgY29uc3QgY29udHJvbGxlciA9IE9iamVjdC5jcmVhdGUoV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlci5wcm90b3R5cGUpO1xuXG4gIGxldCBzdGFydEFsZ29yaXRobTogKCkgPT4gdm9pZCB8IFByb21pc2VMaWtlPHZvaWQ+O1xuICBsZXQgd3JpdGVBbGdvcml0aG06IChjaHVuazogVykgPT4gUHJvbWlzZTx2b2lkPjtcbiAgbGV0IGNsb3NlQWxnb3JpdGhtOiAoKSA9PiBQcm9taXNlPHZvaWQ+O1xuICBsZXQgYWJvcnRBbGdvcml0aG06IChyZWFzb246IGFueSkgPT4gUHJvbWlzZTx2b2lkPjtcblxuICBpZiAodW5kZXJseWluZ1Npbmsuc3RhcnQgIT09IHVuZGVmaW5lZCkge1xuICAgIHN0YXJ0QWxnb3JpdGhtID0gKCkgPT4gdW5kZXJseWluZ1Npbmsuc3RhcnQhKGNvbnRyb2xsZXIpO1xuICB9IGVsc2Uge1xuICAgIHN0YXJ0QWxnb3JpdGhtID0gKCkgPT4gdW5kZWZpbmVkO1xuICB9XG4gIGlmICh1bmRlcmx5aW5nU2luay53cml0ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgd3JpdGVBbGdvcml0aG0gPSBjaHVuayA9PiB1bmRlcmx5aW5nU2luay53cml0ZSEoY2h1bmssIGNvbnRyb2xsZXIpO1xuICB9IGVsc2Uge1xuICAgIHdyaXRlQWxnb3JpdGhtID0gKCkgPT4gcHJvbWlzZVJlc29sdmVkV2l0aCh1bmRlZmluZWQpO1xuICB9XG4gIGlmICh1bmRlcmx5aW5nU2luay5jbG9zZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgY2xvc2VBbGdvcml0aG0gPSAoKSA9PiB1bmRlcmx5aW5nU2luay5jbG9zZSEoKTtcbiAgfSBlbHNlIHtcbiAgICBjbG9zZUFsZ29yaXRobSA9ICgpID0+IHByb21pc2VSZXNvbHZlZFdpdGgodW5kZWZpbmVkKTtcbiAgfVxuICBpZiAodW5kZXJseWluZ1NpbmsuYWJvcnQgIT09IHVuZGVmaW5lZCkge1xuICAgIGFib3J0QWxnb3JpdGhtID0gcmVhc29uID0+IHVuZGVybHlpbmdTaW5rLmFib3J0IShyZWFzb24pO1xuICB9IGVsc2Uge1xuICAgIGFib3J0QWxnb3JpdGhtID0gKCkgPT4gcHJvbWlzZVJlc29sdmVkV2l0aCh1bmRlZmluZWQpO1xuICB9XG5cbiAgU2V0VXBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyKFxuICAgIHN0cmVhbSwgY29udHJvbGxlciwgc3RhcnRBbGdvcml0aG0sIHdyaXRlQWxnb3JpdGhtLCBjbG9zZUFsZ29yaXRobSwgYWJvcnRBbGdvcml0aG0sIGhpZ2hXYXRlck1hcmssIHNpemVBbGdvcml0aG1cbiAgKTtcbn1cblxuLy8gQ2xlYXJBbGdvcml0aG1zIG1heSBiZSBjYWxsZWQgdHdpY2UuIEVycm9yaW5nIHRoZSBzYW1lIHN0cmVhbSBpbiBtdWx0aXBsZSB3YXlzIHdpbGwgb2Z0ZW4gcmVzdWx0IGluIHJlZHVuZGFudCBjYWxscy5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDbGVhckFsZ29yaXRobXMoY29udHJvbGxlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxhbnk+KSB7XG4gIGNvbnRyb2xsZXIuX3dyaXRlQWxnb3JpdGhtID0gdW5kZWZpbmVkITtcbiAgY29udHJvbGxlci5fY2xvc2VBbGdvcml0aG0gPSB1bmRlZmluZWQhO1xuICBjb250cm9sbGVyLl9hYm9ydEFsZ29yaXRobSA9IHVuZGVmaW5lZCE7XG4gIGNvbnRyb2xsZXIuX3N0cmF0ZWd5U2l6ZUFsZ29yaXRobSA9IHVuZGVmaW5lZCE7XG59XG5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDbG9zZTxXPihjb250cm9sbGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyPFc+KSB7XG4gIEVucXVldWVWYWx1ZVdpdGhTaXplKGNvbnRyb2xsZXIsIGNsb3NlU2VudGluZWwsIDApO1xuICBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQWR2YW5jZVF1ZXVlSWZOZWVkZWQoY29udHJvbGxlcik7XG59XG5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJHZXRDaHVua1NpemU8Vz4oY29udHJvbGxlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxXPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2h1bms6IFcpOiBudW1iZXIge1xuICB0cnkge1xuICAgIHJldHVybiBjb250cm9sbGVyLl9zdHJhdGVneVNpemVBbGdvcml0aG0oY2h1bmspO1xuICB9IGNhdGNoIChjaHVua1NpemVFKSB7XG4gICAgV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVycm9ySWZOZWVkZWQoY29udHJvbGxlciwgY2h1bmtTaXplRSk7XG4gICAgcmV0dXJuIDE7XG4gIH1cbn1cblxuZnVuY3Rpb24gV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckdldERlc2lyZWRTaXplKGNvbnRyb2xsZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8YW55Pik6IG51bWJlciB7XG4gIHJldHVybiBjb250cm9sbGVyLl9zdHJhdGVneUhXTSAtIGNvbnRyb2xsZXIuX3F1ZXVlVG90YWxTaXplO1xufVxuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyV3JpdGU8Vz4oY29udHJvbGxlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxXPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaHVuazogVyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaHVua1NpemU6IG51bWJlcikge1xuICB0cnkge1xuICAgIEVucXVldWVWYWx1ZVdpdGhTaXplKGNvbnRyb2xsZXIsIGNodW5rLCBjaHVua1NpemUpO1xuICB9IGNhdGNoIChlbnF1ZXVlRSkge1xuICAgIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFcnJvcklmTmVlZGVkKGNvbnRyb2xsZXIsIGVucXVldWVFKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBzdHJlYW0gPSBjb250cm9sbGVyLl9jb250cm9sbGVkV3JpdGFibGVTdHJlYW07XG4gIGlmICghV3JpdGFibGVTdHJlYW1DbG9zZVF1ZXVlZE9ySW5GbGlnaHQoc3RyZWFtKSAmJiBzdHJlYW0uX3N0YXRlID09PSAnd3JpdGFibGUnKSB7XG4gICAgY29uc3QgYmFja3ByZXNzdXJlID0gV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckdldEJhY2twcmVzc3VyZShjb250cm9sbGVyKTtcbiAgICBXcml0YWJsZVN0cmVhbVVwZGF0ZUJhY2twcmVzc3VyZShzdHJlYW0sIGJhY2twcmVzc3VyZSk7XG4gIH1cblxuICBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQWR2YW5jZVF1ZXVlSWZOZWVkZWQoY29udHJvbGxlcik7XG59XG5cbi8vIEFic3RyYWN0IG9wZXJhdGlvbnMgZm9yIHRoZSBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyLlxuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQWR2YW5jZVF1ZXVlSWZOZWVkZWQ8Vz4oY29udHJvbGxlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxXPikge1xuICBjb25zdCBzdHJlYW0gPSBjb250cm9sbGVyLl9jb250cm9sbGVkV3JpdGFibGVTdHJlYW07XG5cbiAgaWYgKCFjb250cm9sbGVyLl9zdGFydGVkKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKHN0cmVhbS5faW5GbGlnaHRXcml0ZVJlcXVlc3QgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHN0YXRlID0gc3RyZWFtLl9zdGF0ZTtcbiAgYXNzZXJ0KHN0YXRlICE9PSAnY2xvc2VkJyAmJiBzdGF0ZSAhPT0gJ2Vycm9yZWQnKTtcbiAgaWYgKHN0YXRlID09PSAnZXJyb3JpbmcnKSB7XG4gICAgV3JpdGFibGVTdHJlYW1GaW5pc2hFcnJvcmluZyhzdHJlYW0pO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChjb250cm9sbGVyLl9xdWV1ZS5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCB2YWx1ZSA9IFBlZWtRdWV1ZVZhbHVlKGNvbnRyb2xsZXIpO1xuICBpZiAodmFsdWUgPT09IGNsb3NlU2VudGluZWwpIHtcbiAgICBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyUHJvY2Vzc0Nsb3NlKGNvbnRyb2xsZXIpO1xuICB9IGVsc2Uge1xuICAgIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJQcm9jZXNzV3JpdGUoY29udHJvbGxlciwgdmFsdWUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFcnJvcklmTmVlZGVkKGNvbnRyb2xsZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8YW55PiwgZXJyb3I6IGFueSkge1xuICBpZiAoY29udHJvbGxlci5fY29udHJvbGxlZFdyaXRhYmxlU3RyZWFtLl9zdGF0ZSA9PT0gJ3dyaXRhYmxlJykge1xuICAgIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFcnJvcihjb250cm9sbGVyLCBlcnJvcik7XG4gIH1cbn1cblxuZnVuY3Rpb24gV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlclByb2Nlc3NDbG9zZShjb250cm9sbGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyPGFueT4pIHtcbiAgY29uc3Qgc3RyZWFtID0gY29udHJvbGxlci5fY29udHJvbGxlZFdyaXRhYmxlU3RyZWFtO1xuXG4gIFdyaXRhYmxlU3RyZWFtTWFya0Nsb3NlUmVxdWVzdEluRmxpZ2h0KHN0cmVhbSk7XG5cbiAgRGVxdWV1ZVZhbHVlKGNvbnRyb2xsZXIpO1xuICBhc3NlcnQoY29udHJvbGxlci5fcXVldWUubGVuZ3RoID09PSAwKTtcblxuICBjb25zdCBzaW5rQ2xvc2VQcm9taXNlID0gY29udHJvbGxlci5fY2xvc2VBbGdvcml0aG0oKTtcbiAgV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNsZWFyQWxnb3JpdGhtcyhjb250cm9sbGVyKTtcbiAgdXBvblByb21pc2UoXG4gICAgc2lua0Nsb3NlUHJvbWlzZSxcbiAgICAoKSA9PiB7XG4gICAgICBXcml0YWJsZVN0cmVhbUZpbmlzaEluRmxpZ2h0Q2xvc2Uoc3RyZWFtKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgcmVhc29uID0+IHtcbiAgICAgIFdyaXRhYmxlU3RyZWFtRmluaXNoSW5GbGlnaHRDbG9zZVdpdGhFcnJvcihzdHJlYW0sIHJlYXNvbik7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICk7XG59XG5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJQcm9jZXNzV3JpdGU8Vz4oY29udHJvbGxlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxXPiwgY2h1bms6IFcpIHtcbiAgY29uc3Qgc3RyZWFtID0gY29udHJvbGxlci5fY29udHJvbGxlZFdyaXRhYmxlU3RyZWFtO1xuXG4gIFdyaXRhYmxlU3RyZWFtTWFya0ZpcnN0V3JpdGVSZXF1ZXN0SW5GbGlnaHQoc3RyZWFtKTtcblxuICBjb25zdCBzaW5rV3JpdGVQcm9taXNlID0gY29udHJvbGxlci5fd3JpdGVBbGdvcml0aG0oY2h1bmspO1xuICB1cG9uUHJvbWlzZShcbiAgICBzaW5rV3JpdGVQcm9taXNlLFxuICAgICgpID0+IHtcbiAgICAgIFdyaXRhYmxlU3RyZWFtRmluaXNoSW5GbGlnaHRXcml0ZShzdHJlYW0pO1xuXG4gICAgICBjb25zdCBzdGF0ZSA9IHN0cmVhbS5fc3RhdGU7XG4gICAgICBhc3NlcnQoc3RhdGUgPT09ICd3cml0YWJsZScgfHwgc3RhdGUgPT09ICdlcnJvcmluZycpO1xuXG4gICAgICBEZXF1ZXVlVmFsdWUoY29udHJvbGxlcik7XG5cbiAgICAgIGlmICghV3JpdGFibGVTdHJlYW1DbG9zZVF1ZXVlZE9ySW5GbGlnaHQoc3RyZWFtKSAmJiBzdGF0ZSA9PT0gJ3dyaXRhYmxlJykge1xuICAgICAgICBjb25zdCBiYWNrcHJlc3N1cmUgPSBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyR2V0QmFja3ByZXNzdXJlKGNvbnRyb2xsZXIpO1xuICAgICAgICBXcml0YWJsZVN0cmVhbVVwZGF0ZUJhY2twcmVzc3VyZShzdHJlYW0sIGJhY2twcmVzc3VyZSk7XG4gICAgICB9XG5cbiAgICAgIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJBZHZhbmNlUXVldWVJZk5lZWRlZChjb250cm9sbGVyKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgcmVhc29uID0+IHtcbiAgICAgIGlmIChzdHJlYW0uX3N0YXRlID09PSAnd3JpdGFibGUnKSB7XG4gICAgICAgIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDbGVhckFsZ29yaXRobXMoY29udHJvbGxlcik7XG4gICAgICB9XG4gICAgICBXcml0YWJsZVN0cmVhbUZpbmlzaEluRmxpZ2h0V3JpdGVXaXRoRXJyb3Ioc3RyZWFtLCByZWFzb24pO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICApO1xufVxuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyR2V0QmFja3ByZXNzdXJlKGNvbnRyb2xsZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8YW55Pik6IGJvb2xlYW4ge1xuICBjb25zdCBkZXNpcmVkU2l6ZSA9IFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJHZXREZXNpcmVkU2l6ZShjb250cm9sbGVyKTtcbiAgcmV0dXJuIGRlc2lyZWRTaXplIDw9IDA7XG59XG5cbi8vIEEgY2xpZW50IG9mIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIgbWF5IHVzZSB0aGVzZSBmdW5jdGlvbnMgZGlyZWN0bHkgdG8gYnlwYXNzIHN0YXRlIGNoZWNrLlxuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRXJyb3IoY29udHJvbGxlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxhbnk+LCBlcnJvcjogYW55KSB7XG4gIGNvbnN0IHN0cmVhbSA9IGNvbnRyb2xsZXIuX2NvbnRyb2xsZWRXcml0YWJsZVN0cmVhbTtcblxuICBhc3NlcnQoc3RyZWFtLl9zdGF0ZSA9PT0gJ3dyaXRhYmxlJyk7XG5cbiAgV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNsZWFyQWxnb3JpdGhtcyhjb250cm9sbGVyKTtcbiAgV3JpdGFibGVTdHJlYW1TdGFydEVycm9yaW5nKHN0cmVhbSwgZXJyb3IpO1xufVxuXG4vLyBIZWxwZXIgZnVuY3Rpb25zIGZvciB0aGUgV3JpdGFibGVTdHJlYW0uXG5cbmZ1bmN0aW9uIHN0cmVhbUJyYW5kQ2hlY2tFeGNlcHRpb24obmFtZTogc3RyaW5nKTogVHlwZUVycm9yIHtcbiAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoYFdyaXRhYmxlU3RyZWFtLnByb3RvdHlwZS4ke25hbWV9IGNhbiBvbmx5IGJlIHVzZWQgb24gYSBXcml0YWJsZVN0cmVhbWApO1xufVxuXG4vLyBIZWxwZXIgZnVuY3Rpb25zIGZvciB0aGUgV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlci5cblxuZnVuY3Rpb24gZGVmYXVsdENvbnRyb2xsZXJCcmFuZENoZWNrRXhjZXB0aW9uKG5hbWU6IHN0cmluZyk6IFR5cGVFcnJvciB7XG4gIHJldHVybiBuZXcgVHlwZUVycm9yKFxuICAgIGBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyLnByb3RvdHlwZS4ke25hbWV9IGNhbiBvbmx5IGJlIHVzZWQgb24gYSBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyYCk7XG59XG5cblxuLy8gSGVscGVyIGZ1bmN0aW9ucyBmb3IgdGhlIFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlci5cblxuZnVuY3Rpb24gZGVmYXVsdFdyaXRlckJyYW5kQ2hlY2tFeGNlcHRpb24obmFtZTogc3RyaW5nKTogVHlwZUVycm9yIHtcbiAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoXG4gICAgYFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlci5wcm90b3R5cGUuJHtuYW1lfSBjYW4gb25seSBiZSB1c2VkIG9uIGEgV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyYCk7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRXcml0ZXJMb2NrRXhjZXB0aW9uKG5hbWU6IHN0cmluZyk6IFR5cGVFcnJvciB7XG4gIHJldHVybiBuZXcgVHlwZUVycm9yKCdDYW5ub3QgJyArIG5hbWUgKyAnIGEgc3RyZWFtIHVzaW5nIGEgcmVsZWFzZWQgd3JpdGVyJyk7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRXcml0ZXJDbG9zZWRQcm9taXNlSW5pdGlhbGl6ZSh3cml0ZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcikge1xuICB3cml0ZXIuX2Nsb3NlZFByb21pc2UgPSBuZXdQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICB3cml0ZXIuX2Nsb3NlZFByb21pc2VfcmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgd3JpdGVyLl9jbG9zZWRQcm9taXNlX3JlamVjdCA9IHJlamVjdDtcbiAgICB3cml0ZXIuX2Nsb3NlZFByb21pc2VTdGF0ZSA9ICdwZW5kaW5nJztcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRXcml0ZXJDbG9zZWRQcm9taXNlSW5pdGlhbGl6ZUFzUmVqZWN0ZWQod3JpdGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIsIHJlYXNvbjogYW55KSB7XG4gIGRlZmF1bHRXcml0ZXJDbG9zZWRQcm9taXNlSW5pdGlhbGl6ZSh3cml0ZXIpO1xuICBkZWZhdWx0V3JpdGVyQ2xvc2VkUHJvbWlzZVJlamVjdCh3cml0ZXIsIHJlYXNvbik7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRXcml0ZXJDbG9zZWRQcm9taXNlSW5pdGlhbGl6ZUFzUmVzb2x2ZWQod3JpdGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIpIHtcbiAgZGVmYXVsdFdyaXRlckNsb3NlZFByb21pc2VJbml0aWFsaXplKHdyaXRlcik7XG4gIGRlZmF1bHRXcml0ZXJDbG9zZWRQcm9taXNlUmVzb2x2ZSh3cml0ZXIpO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0V3JpdGVyQ2xvc2VkUHJvbWlzZVJlamVjdCh3cml0ZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlciwgcmVhc29uOiBhbnkpIHtcbiAgaWYgKHdyaXRlci5fY2xvc2VkUHJvbWlzZV9yZWplY3QgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybjtcbiAgfVxuICBhc3NlcnQod3JpdGVyLl9jbG9zZWRQcm9taXNlU3RhdGUgPT09ICdwZW5kaW5nJyk7XG5cbiAgc2V0UHJvbWlzZUlzSGFuZGxlZFRvVHJ1ZSh3cml0ZXIuX2Nsb3NlZFByb21pc2UpO1xuICB3cml0ZXIuX2Nsb3NlZFByb21pc2VfcmVqZWN0KHJlYXNvbik7XG4gIHdyaXRlci5fY2xvc2VkUHJvbWlzZV9yZXNvbHZlID0gdW5kZWZpbmVkO1xuICB3cml0ZXIuX2Nsb3NlZFByb21pc2VfcmVqZWN0ID0gdW5kZWZpbmVkO1xuICB3cml0ZXIuX2Nsb3NlZFByb21pc2VTdGF0ZSA9ICdyZWplY3RlZCc7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRXcml0ZXJDbG9zZWRQcm9taXNlUmVzZXRUb1JlamVjdGVkKHdyaXRlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyLCByZWFzb246IGFueSkge1xuICBhc3NlcnQod3JpdGVyLl9jbG9zZWRQcm9taXNlX3Jlc29sdmUgPT09IHVuZGVmaW5lZCk7XG4gIGFzc2VydCh3cml0ZXIuX2Nsb3NlZFByb21pc2VfcmVqZWN0ID09PSB1bmRlZmluZWQpO1xuICBhc3NlcnQod3JpdGVyLl9jbG9zZWRQcm9taXNlU3RhdGUgIT09ICdwZW5kaW5nJyk7XG5cbiAgZGVmYXVsdFdyaXRlckNsb3NlZFByb21pc2VJbml0aWFsaXplQXNSZWplY3RlZCh3cml0ZXIsIHJlYXNvbik7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRXcml0ZXJDbG9zZWRQcm9taXNlUmVzb2x2ZSh3cml0ZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcikge1xuICBpZiAod3JpdGVyLl9jbG9zZWRQcm9taXNlX3Jlc29sdmUgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybjtcbiAgfVxuICBhc3NlcnQod3JpdGVyLl9jbG9zZWRQcm9taXNlU3RhdGUgPT09ICdwZW5kaW5nJyk7XG5cbiAgd3JpdGVyLl9jbG9zZWRQcm9taXNlX3Jlc29sdmUodW5kZWZpbmVkKTtcbiAgd3JpdGVyLl9jbG9zZWRQcm9taXNlX3Jlc29sdmUgPSB1bmRlZmluZWQ7XG4gIHdyaXRlci5fY2xvc2VkUHJvbWlzZV9yZWplY3QgPSB1bmRlZmluZWQ7XG4gIHdyaXRlci5fY2xvc2VkUHJvbWlzZVN0YXRlID0gJ3Jlc29sdmVkJztcbn1cblxuZnVuY3Rpb24gZGVmYXVsdFdyaXRlclJlYWR5UHJvbWlzZUluaXRpYWxpemUod3JpdGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIpIHtcbiAgd3JpdGVyLl9yZWFkeVByb21pc2UgPSBuZXdQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICB3cml0ZXIuX3JlYWR5UHJvbWlzZV9yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICB3cml0ZXIuX3JlYWR5UHJvbWlzZV9yZWplY3QgPSByZWplY3Q7XG4gIH0pO1xuICB3cml0ZXIuX3JlYWR5UHJvbWlzZVN0YXRlID0gJ3BlbmRpbmcnO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0V3JpdGVyUmVhZHlQcm9taXNlSW5pdGlhbGl6ZUFzUmVqZWN0ZWQod3JpdGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIsIHJlYXNvbjogYW55KSB7XG4gIGRlZmF1bHRXcml0ZXJSZWFkeVByb21pc2VJbml0aWFsaXplKHdyaXRlcik7XG4gIGRlZmF1bHRXcml0ZXJSZWFkeVByb21pc2VSZWplY3Qod3JpdGVyLCByZWFzb24pO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0V3JpdGVyUmVhZHlQcm9taXNlSW5pdGlhbGl6ZUFzUmVzb2x2ZWQod3JpdGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIpIHtcbiAgZGVmYXVsdFdyaXRlclJlYWR5UHJvbWlzZUluaXRpYWxpemUod3JpdGVyKTtcbiAgZGVmYXVsdFdyaXRlclJlYWR5UHJvbWlzZVJlc29sdmUod3JpdGVyKTtcbn1cblxuZnVuY3Rpb24gZGVmYXVsdFdyaXRlclJlYWR5UHJvbWlzZVJlamVjdCh3cml0ZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlciwgcmVhc29uOiBhbnkpIHtcbiAgaWYgKHdyaXRlci5fcmVhZHlQcm9taXNlX3JlamVjdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgc2V0UHJvbWlzZUlzSGFuZGxlZFRvVHJ1ZSh3cml0ZXIuX3JlYWR5UHJvbWlzZSk7XG4gIHdyaXRlci5fcmVhZHlQcm9taXNlX3JlamVjdChyZWFzb24pO1xuICB3cml0ZXIuX3JlYWR5UHJvbWlzZV9yZXNvbHZlID0gdW5kZWZpbmVkO1xuICB3cml0ZXIuX3JlYWR5UHJvbWlzZV9yZWplY3QgPSB1bmRlZmluZWQ7XG4gIHdyaXRlci5fcmVhZHlQcm9taXNlU3RhdGUgPSAncmVqZWN0ZWQnO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0V3JpdGVyUmVhZHlQcm9taXNlUmVzZXQod3JpdGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIpIHtcbiAgYXNzZXJ0KHdyaXRlci5fcmVhZHlQcm9taXNlX3Jlc29sdmUgPT09IHVuZGVmaW5lZCk7XG4gIGFzc2VydCh3cml0ZXIuX3JlYWR5UHJvbWlzZV9yZWplY3QgPT09IHVuZGVmaW5lZCk7XG5cbiAgZGVmYXVsdFdyaXRlclJlYWR5UHJvbWlzZUluaXRpYWxpemUod3JpdGVyKTtcbn1cblxuZnVuY3Rpb24gZGVmYXVsdFdyaXRlclJlYWR5UHJvbWlzZVJlc2V0VG9SZWplY3RlZCh3cml0ZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlciwgcmVhc29uOiBhbnkpIHtcbiAgYXNzZXJ0KHdyaXRlci5fcmVhZHlQcm9taXNlX3Jlc29sdmUgPT09IHVuZGVmaW5lZCk7XG4gIGFzc2VydCh3cml0ZXIuX3JlYWR5UHJvbWlzZV9yZWplY3QgPT09IHVuZGVmaW5lZCk7XG5cbiAgZGVmYXVsdFdyaXRlclJlYWR5UHJvbWlzZUluaXRpYWxpemVBc1JlamVjdGVkKHdyaXRlciwgcmVhc29uKTtcbn1cblxuZnVuY3Rpb24gZGVmYXVsdFdyaXRlclJlYWR5UHJvbWlzZVJlc29sdmUod3JpdGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIpIHtcbiAgaWYgKHdyaXRlci5fcmVhZHlQcm9taXNlX3Jlc29sdmUgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHdyaXRlci5fcmVhZHlQcm9taXNlX3Jlc29sdmUodW5kZWZpbmVkKTtcbiAgd3JpdGVyLl9yZWFkeVByb21pc2VfcmVzb2x2ZSA9IHVuZGVmaW5lZDtcbiAgd3JpdGVyLl9yZWFkeVByb21pc2VfcmVqZWN0ID0gdW5kZWZpbmVkO1xuICB3cml0ZXIuX3JlYWR5UHJvbWlzZVN0YXRlID0gJ2Z1bGZpbGxlZCc7XG59XG4iLCAiLy8vIDxyZWZlcmVuY2UgbGliPVwiZG9tXCIgLz5cblxuZnVuY3Rpb24gZ2V0R2xvYmFscygpOiB0eXBlb2YgZ2xvYmFsVGhpcyB8IHVuZGVmaW5lZCB7XG4gIGlmICh0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gZ2xvYmFsVGhpcztcbiAgfSBlbHNlIGlmICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gc2VsZjtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBnbG9iYWw7XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGNvbnN0IGdsb2JhbHMgPSBnZXRHbG9iYWxzKCk7XG4iLCAiLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJub2RlXCIgLz5cbmltcG9ydCB7IGdsb2JhbHMgfSBmcm9tICcuLi9nbG9iYWxzJztcbmltcG9ydCB7IHNldEZ1bmN0aW9uTmFtZSB9IGZyb20gJy4uL2xpYi9oZWxwZXJzL21pc2NlbGxhbmVvdXMnO1xuXG5pbnRlcmZhY2UgRE9NRXhjZXB0aW9uIGV4dGVuZHMgRXJyb3Ige1xuICBuYW1lOiBzdHJpbmc7XG4gIG1lc3NhZ2U6IHN0cmluZztcbn1cblxudHlwZSBET01FeGNlcHRpb25Db25zdHJ1Y3RvciA9IG5ldyAobWVzc2FnZT86IHN0cmluZywgbmFtZT86IHN0cmluZykgPT4gRE9NRXhjZXB0aW9uO1xuXG5mdW5jdGlvbiBpc0RPTUV4Y2VwdGlvbkNvbnN0cnVjdG9yKGN0b3I6IHVua25vd24pOiBjdG9yIGlzIERPTUV4Y2VwdGlvbkNvbnN0cnVjdG9yIHtcbiAgaWYgKCEodHlwZW9mIGN0b3IgPT09ICdmdW5jdGlvbicgfHwgdHlwZW9mIGN0b3IgPT09ICdvYmplY3QnKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoKGN0b3IgYXMgRE9NRXhjZXB0aW9uQ29uc3RydWN0b3IpLm5hbWUgIT09ICdET01FeGNlcHRpb24nKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHRyeSB7XG4gICAgbmV3IChjdG9yIGFzIERPTUV4Y2VwdGlvbkNvbnN0cnVjdG9yKSgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuLyoqXG4gKiBTdXBwb3J0OlxuICogLSBXZWIgYnJvd3NlcnNcbiAqIC0gTm9kZSAxOCBhbmQgaGlnaGVyIChodHRwczovL2dpdGh1Yi5jb20vbm9kZWpzL25vZGUvY29tbWl0L2U0YjFmYjVlNjQyMmMxZmYxNTEyMzRiYjlkZTc5MmQ0NWRkODhkODcpXG4gKi9cbmZ1bmN0aW9uIGdldEZyb21HbG9iYWwoKTogRE9NRXhjZXB0aW9uQ29uc3RydWN0b3IgfCB1bmRlZmluZWQge1xuICBjb25zdCBjdG9yID0gZ2xvYmFscz8uRE9NRXhjZXB0aW9uO1xuICByZXR1cm4gaXNET01FeGNlcHRpb25Db25zdHJ1Y3RvcihjdG9yKSA/IGN0b3IgOiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogU3VwcG9ydDpcbiAqIC0gQWxsIHBsYXRmb3Jtc1xuICovXG5mdW5jdGlvbiBjcmVhdGVQb2x5ZmlsbCgpOiBET01FeGNlcHRpb25Db25zdHJ1Y3RvciB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tc2hhZG93XG4gIGNvbnN0IGN0b3IgPSBmdW5jdGlvbiBET01FeGNlcHRpb24odGhpczogRE9NRXhjZXB0aW9uLCBtZXNzYWdlPzogc3RyaW5nLCBuYW1lPzogc3RyaW5nKSB7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZSB8fCAnJztcbiAgICB0aGlzLm5hbWUgPSBuYW1lIHx8ICdFcnJvcic7XG4gICAgaWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKSB7XG4gICAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCB0aGlzLmNvbnN0cnVjdG9yKTtcbiAgICB9XG4gIH0gYXMgYW55O1xuICBzZXRGdW5jdGlvbk5hbWUoY3RvciwgJ0RPTUV4Y2VwdGlvbicpO1xuICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlKTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGN0b3IucHJvdG90eXBlLCAnY29uc3RydWN0b3InLCB7IHZhbHVlOiBjdG9yLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0pO1xuICByZXR1cm4gY3Rvcjtcbn1cblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1yZWRlY2xhcmVcbmNvbnN0IERPTUV4Y2VwdGlvbjogRE9NRXhjZXB0aW9uQ29uc3RydWN0b3IgPSBnZXRGcm9tR2xvYmFsKCkgfHwgY3JlYXRlUG9seWZpbGwoKTtcblxuZXhwb3J0IHsgRE9NRXhjZXB0aW9uIH07XG4iLCAiaW1wb3J0IHsgSXNSZWFkYWJsZVN0cmVhbSwgSXNSZWFkYWJsZVN0cmVhbUxvY2tlZCwgUmVhZGFibGVTdHJlYW0sIFJlYWRhYmxlU3RyZWFtQ2FuY2VsIH0gZnJvbSAnLi4vcmVhZGFibGUtc3RyZWFtJztcbmltcG9ydCB7IEFjcXVpcmVSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXIsIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlclJlYWQgfSBmcm9tICcuL2RlZmF1bHQtcmVhZGVyJztcbmltcG9ydCB7IFJlYWRhYmxlU3RyZWFtUmVhZGVyR2VuZXJpY1JlbGVhc2UgfSBmcm9tICcuL2dlbmVyaWMtcmVhZGVyJztcbmltcG9ydCB7XG4gIEFjcXVpcmVXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIsXG4gIElzV3JpdGFibGVTdHJlYW0sXG4gIElzV3JpdGFibGVTdHJlYW1Mb2NrZWQsXG4gIFdyaXRhYmxlU3RyZWFtLFxuICBXcml0YWJsZVN0cmVhbUFib3J0LFxuICBXcml0YWJsZVN0cmVhbUNsb3NlUXVldWVkT3JJbkZsaWdodCxcbiAgV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyQ2xvc2VXaXRoRXJyb3JQcm9wYWdhdGlvbixcbiAgV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyUmVsZWFzZSxcbiAgV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyV3JpdGVcbn0gZnJvbSAnLi4vd3JpdGFibGUtc3RyZWFtJztcbmltcG9ydCBhc3NlcnQgZnJvbSAnLi4vLi4vc3R1Yi9hc3NlcnQnO1xuaW1wb3J0IHtcbiAgbmV3UHJvbWlzZSxcbiAgUGVyZm9ybVByb21pc2VUaGVuLFxuICBwcm9taXNlUmVzb2x2ZWRXaXRoLFxuICBzZXRQcm9taXNlSXNIYW5kbGVkVG9UcnVlLFxuICB1cG9uRnVsZmlsbG1lbnQsXG4gIHVwb25Qcm9taXNlLFxuICB1cG9uUmVqZWN0aW9uXG59IGZyb20gJy4uL2hlbHBlcnMvd2ViaWRsJztcbmltcG9ydCB7IG5vb3AgfSBmcm9tICcuLi8uLi91dGlscyc7XG5pbXBvcnQgeyB0eXBlIEFib3J0U2lnbmFsLCBpc0Fib3J0U2lnbmFsIH0gZnJvbSAnLi4vYWJvcnQtc2lnbmFsJztcbmltcG9ydCB7IERPTUV4Y2VwdGlvbiB9IGZyb20gJy4uLy4uL3N0dWIvZG9tLWV4Y2VwdGlvbic7XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZVN0cmVhbVBpcGVUbzxUPihzb3VyY2U6IFJlYWRhYmxlU3RyZWFtPFQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc3Q6IFdyaXRhYmxlU3RyZWFtPFQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXZlbnRDbG9zZTogYm9vbGVhbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2ZW50QWJvcnQ6IGJvb2xlYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldmVudENhbmNlbDogYm9vbGVhbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaWduYWw6IEFib3J0U2lnbmFsIHwgdW5kZWZpbmVkKTogUHJvbWlzZTx1bmRlZmluZWQ+IHtcbiAgYXNzZXJ0KElzUmVhZGFibGVTdHJlYW0oc291cmNlKSk7XG4gIGFzc2VydChJc1dyaXRhYmxlU3RyZWFtKGRlc3QpKTtcbiAgYXNzZXJ0KHR5cGVvZiBwcmV2ZW50Q2xvc2UgPT09ICdib29sZWFuJyk7XG4gIGFzc2VydCh0eXBlb2YgcHJldmVudEFib3J0ID09PSAnYm9vbGVhbicpO1xuICBhc3NlcnQodHlwZW9mIHByZXZlbnRDYW5jZWwgPT09ICdib29sZWFuJyk7XG4gIGFzc2VydChzaWduYWwgPT09IHVuZGVmaW5lZCB8fCBpc0Fib3J0U2lnbmFsKHNpZ25hbCkpO1xuICBhc3NlcnQoIUlzUmVhZGFibGVTdHJlYW1Mb2NrZWQoc291cmNlKSk7XG4gIGFzc2VydCghSXNXcml0YWJsZVN0cmVhbUxvY2tlZChkZXN0KSk7XG5cbiAgY29uc3QgcmVhZGVyID0gQWNxdWlyZVJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcjxUPihzb3VyY2UpO1xuICBjb25zdCB3cml0ZXIgPSBBY3F1aXJlV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyPFQ+KGRlc3QpO1xuXG4gIHNvdXJjZS5fZGlzdHVyYmVkID0gdHJ1ZTtcblxuICBsZXQgc2h1dHRpbmdEb3duID0gZmFsc2U7XG5cbiAgLy8gVGhpcyBpcyB1c2VkIHRvIGtlZXAgdHJhY2sgb2YgdGhlIHNwZWMncyByZXF1aXJlbWVudCB0aGF0IHdlIHdhaXQgZm9yIG9uZ29pbmcgd3JpdGVzIGR1cmluZyBzaHV0ZG93bi5cbiAgbGV0IGN1cnJlbnRXcml0ZSA9IHByb21pc2VSZXNvbHZlZFdpdGg8dm9pZD4odW5kZWZpbmVkKTtcblxuICByZXR1cm4gbmV3UHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgbGV0IGFib3J0QWxnb3JpdGhtOiAoKSA9PiB2b2lkO1xuICAgIGlmIChzaWduYWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgYWJvcnRBbGdvcml0aG0gPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGVycm9yID0gc2lnbmFsLnJlYXNvbiAhPT0gdW5kZWZpbmVkID8gc2lnbmFsLnJlYXNvbiA6IG5ldyBET01FeGNlcHRpb24oJ0Fib3J0ZWQnLCAnQWJvcnRFcnJvcicpO1xuICAgICAgICBjb25zdCBhY3Rpb25zOiBBcnJheTwoKSA9PiBQcm9taXNlPHZvaWQ+PiA9IFtdO1xuICAgICAgICBpZiAoIXByZXZlbnRBYm9ydCkge1xuICAgICAgICAgIGFjdGlvbnMucHVzaCgoKSA9PiB7XG4gICAgICAgICAgICBpZiAoZGVzdC5fc3RhdGUgPT09ICd3cml0YWJsZScpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFdyaXRhYmxlU3RyZWFtQWJvcnQoZGVzdCwgZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2VSZXNvbHZlZFdpdGgodW5kZWZpbmVkKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXByZXZlbnRDYW5jZWwpIHtcbiAgICAgICAgICBhY3Rpb25zLnB1c2goKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHNvdXJjZS5fc3RhdGUgPT09ICdyZWFkYWJsZScpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFJlYWRhYmxlU3RyZWFtQ2FuY2VsKHNvdXJjZSwgZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2VSZXNvbHZlZFdpdGgodW5kZWZpbmVkKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBzaHV0ZG93bldpdGhBY3Rpb24oKCkgPT4gUHJvbWlzZS5hbGwoYWN0aW9ucy5tYXAoYWN0aW9uID0+IGFjdGlvbigpKSksIHRydWUsIGVycm9yKTtcbiAgICAgIH07XG5cbiAgICAgIGlmIChzaWduYWwuYWJvcnRlZCkge1xuICAgICAgICBhYm9ydEFsZ29yaXRobSgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHNpZ25hbC5hZGRFdmVudExpc3RlbmVyKCdhYm9ydCcsIGFib3J0QWxnb3JpdGhtKTtcbiAgICB9XG5cbiAgICAvLyBVc2luZyByZWFkZXIgYW5kIHdyaXRlciwgcmVhZCBhbGwgY2h1bmtzIGZyb20gdGhpcyBhbmQgd3JpdGUgdGhlbSB0byBkZXN0XG4gICAgLy8gLSBCYWNrcHJlc3N1cmUgbXVzdCBiZSBlbmZvcmNlZFxuICAgIC8vIC0gU2h1dGRvd24gbXVzdCBzdG9wIGFsbCBhY3Rpdml0eVxuICAgIGZ1bmN0aW9uIHBpcGVMb29wKCkge1xuICAgICAgcmV0dXJuIG5ld1Byb21pc2U8dm9pZD4oKHJlc29sdmVMb29wLCByZWplY3RMb29wKSA9PiB7XG4gICAgICAgIGZ1bmN0aW9uIG5leHQoZG9uZTogYm9vbGVhbikge1xuICAgICAgICAgIGlmIChkb25lKSB7XG4gICAgICAgICAgICByZXNvbHZlTG9vcCgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBVc2UgYFBlcmZvcm1Qcm9taXNlVGhlbmAgaW5zdGVhZCBvZiBgdXBvblByb21pc2VgIHRvIGF2b2lkXG4gICAgICAgICAgICAvLyBhZGRpbmcgdW5uZWNlc3NhcnkgYC5jYXRjaChyZXRocm93QXNzZXJ0aW9uRXJyb3JSZWplY3Rpb24pYCBoYW5kbGVyc1xuICAgICAgICAgICAgUGVyZm9ybVByb21pc2VUaGVuKHBpcGVTdGVwKCksIG5leHQsIHJlamVjdExvb3ApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIG5leHQoZmFsc2UpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGlwZVN0ZXAoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICBpZiAoc2h1dHRpbmdEb3duKSB7XG4gICAgICAgIHJldHVybiBwcm9taXNlUmVzb2x2ZWRXaXRoKHRydWUpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gUGVyZm9ybVByb21pc2VUaGVuKHdyaXRlci5fcmVhZHlQcm9taXNlLCAoKSA9PiB7XG4gICAgICAgIHJldHVybiBuZXdQcm9taXNlPGJvb2xlYW4+KChyZXNvbHZlUmVhZCwgcmVqZWN0UmVhZCkgPT4ge1xuICAgICAgICAgIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlclJlYWQoXG4gICAgICAgICAgICByZWFkZXIsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIF9jaHVua1N0ZXBzOiBjaHVuayA9PiB7XG4gICAgICAgICAgICAgICAgY3VycmVudFdyaXRlID0gUGVyZm9ybVByb21pc2VUaGVuKFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcldyaXRlKHdyaXRlciwgY2h1bmspLCB1bmRlZmluZWQsIG5vb3ApO1xuICAgICAgICAgICAgICAgIHJlc29sdmVSZWFkKGZhbHNlKTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgX2Nsb3NlU3RlcHM6ICgpID0+IHJlc29sdmVSZWFkKHRydWUpLFxuICAgICAgICAgICAgICBfZXJyb3JTdGVwczogcmVqZWN0UmVhZFxuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gRXJyb3JzIG11c3QgYmUgcHJvcGFnYXRlZCBmb3J3YXJkXG4gICAgaXNPckJlY29tZXNFcnJvcmVkKHNvdXJjZSwgcmVhZGVyLl9jbG9zZWRQcm9taXNlLCBzdG9yZWRFcnJvciA9PiB7XG4gICAgICBpZiAoIXByZXZlbnRBYm9ydCkge1xuICAgICAgICBzaHV0ZG93bldpdGhBY3Rpb24oKCkgPT4gV3JpdGFibGVTdHJlYW1BYm9ydChkZXN0LCBzdG9yZWRFcnJvciksIHRydWUsIHN0b3JlZEVycm9yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNodXRkb3duKHRydWUsIHN0b3JlZEVycm9yKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0pO1xuXG4gICAgLy8gRXJyb3JzIG11c3QgYmUgcHJvcGFnYXRlZCBiYWNrd2FyZFxuICAgIGlzT3JCZWNvbWVzRXJyb3JlZChkZXN0LCB3cml0ZXIuX2Nsb3NlZFByb21pc2UsIHN0b3JlZEVycm9yID0+IHtcbiAgICAgIGlmICghcHJldmVudENhbmNlbCkge1xuICAgICAgICBzaHV0ZG93bldpdGhBY3Rpb24oKCkgPT4gUmVhZGFibGVTdHJlYW1DYW5jZWwoc291cmNlLCBzdG9yZWRFcnJvciksIHRydWUsIHN0b3JlZEVycm9yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNodXRkb3duKHRydWUsIHN0b3JlZEVycm9yKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0pO1xuXG4gICAgLy8gQ2xvc2luZyBtdXN0IGJlIHByb3BhZ2F0ZWQgZm9yd2FyZFxuICAgIGlzT3JCZWNvbWVzQ2xvc2VkKHNvdXJjZSwgcmVhZGVyLl9jbG9zZWRQcm9taXNlLCAoKSA9PiB7XG4gICAgICBpZiAoIXByZXZlbnRDbG9zZSkge1xuICAgICAgICBzaHV0ZG93bldpdGhBY3Rpb24oKCkgPT4gV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyQ2xvc2VXaXRoRXJyb3JQcm9wYWdhdGlvbih3cml0ZXIpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNodXRkb3duKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9KTtcblxuICAgIC8vIENsb3NpbmcgbXVzdCBiZSBwcm9wYWdhdGVkIGJhY2t3YXJkXG4gICAgaWYgKFdyaXRhYmxlU3RyZWFtQ2xvc2VRdWV1ZWRPckluRmxpZ2h0KGRlc3QpIHx8IGRlc3QuX3N0YXRlID09PSAnY2xvc2VkJykge1xuICAgICAgY29uc3QgZGVzdENsb3NlZCA9IG5ldyBUeXBlRXJyb3IoJ3RoZSBkZXN0aW5hdGlvbiB3cml0YWJsZSBzdHJlYW0gY2xvc2VkIGJlZm9yZSBhbGwgZGF0YSBjb3VsZCBiZSBwaXBlZCB0byBpdCcpO1xuXG4gICAgICBpZiAoIXByZXZlbnRDYW5jZWwpIHtcbiAgICAgICAgc2h1dGRvd25XaXRoQWN0aW9uKCgpID0+IFJlYWRhYmxlU3RyZWFtQ2FuY2VsKHNvdXJjZSwgZGVzdENsb3NlZCksIHRydWUsIGRlc3RDbG9zZWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2h1dGRvd24odHJ1ZSwgZGVzdENsb3NlZCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2V0UHJvbWlzZUlzSGFuZGxlZFRvVHJ1ZShwaXBlTG9vcCgpKTtcblxuICAgIGZ1bmN0aW9uIHdhaXRGb3JXcml0ZXNUb0ZpbmlzaCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgIC8vIEFub3RoZXIgd3JpdGUgbWF5IGhhdmUgc3RhcnRlZCB3aGlsZSB3ZSB3ZXJlIHdhaXRpbmcgb24gdGhpcyBjdXJyZW50V3JpdGUsIHNvIHdlIGhhdmUgdG8gYmUgc3VyZSB0byB3YWl0XG4gICAgICAvLyBmb3IgdGhhdCB0b28uXG4gICAgICBjb25zdCBvbGRDdXJyZW50V3JpdGUgPSBjdXJyZW50V3JpdGU7XG4gICAgICByZXR1cm4gUGVyZm9ybVByb21pc2VUaGVuKFxuICAgICAgICBjdXJyZW50V3JpdGUsXG4gICAgICAgICgpID0+IG9sZEN1cnJlbnRXcml0ZSAhPT0gY3VycmVudFdyaXRlID8gd2FpdEZvcldyaXRlc1RvRmluaXNoKCkgOiB1bmRlZmluZWRcbiAgICAgICk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNPckJlY29tZXNFcnJvcmVkKHN0cmVhbTogUmVhZGFibGVTdHJlYW0gfCBXcml0YWJsZVN0cmVhbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZTogUHJvbWlzZTx2b2lkPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiAocmVhc29uOiBhbnkpID0+IG51bGwpIHtcbiAgICAgIGlmIChzdHJlYW0uX3N0YXRlID09PSAnZXJyb3JlZCcpIHtcbiAgICAgICAgYWN0aW9uKHN0cmVhbS5fc3RvcmVkRXJyb3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdXBvblJlamVjdGlvbihwcm9taXNlLCBhY3Rpb24pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzT3JCZWNvbWVzQ2xvc2VkKHN0cmVhbTogUmVhZGFibGVTdHJlYW0gfCBXcml0YWJsZVN0cmVhbSwgcHJvbWlzZTogUHJvbWlzZTx2b2lkPiwgYWN0aW9uOiAoKSA9PiBudWxsKSB7XG4gICAgICBpZiAoc3RyZWFtLl9zdGF0ZSA9PT0gJ2Nsb3NlZCcpIHtcbiAgICAgICAgYWN0aW9uKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB1cG9uRnVsZmlsbG1lbnQocHJvbWlzZSwgYWN0aW9uKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzaHV0ZG93bldpdGhBY3Rpb24oYWN0aW9uOiAoKSA9PiBQcm9taXNlPHVua25vd24+LCBvcmlnaW5hbElzRXJyb3I/OiBib29sZWFuLCBvcmlnaW5hbEVycm9yPzogYW55KSB7XG4gICAgICBpZiAoc2h1dHRpbmdEb3duKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHNodXR0aW5nRG93biA9IHRydWU7XG5cbiAgICAgIGlmIChkZXN0Ll9zdGF0ZSA9PT0gJ3dyaXRhYmxlJyAmJiAhV3JpdGFibGVTdHJlYW1DbG9zZVF1ZXVlZE9ySW5GbGlnaHQoZGVzdCkpIHtcbiAgICAgICAgdXBvbkZ1bGZpbGxtZW50KHdhaXRGb3JXcml0ZXNUb0ZpbmlzaCgpLCBkb1RoZVJlc3QpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZG9UaGVSZXN0KCk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGRvVGhlUmVzdCgpOiBudWxsIHtcbiAgICAgICAgdXBvblByb21pc2UoXG4gICAgICAgICAgYWN0aW9uKCksXG4gICAgICAgICAgKCkgPT4gZmluYWxpemUob3JpZ2luYWxJc0Vycm9yLCBvcmlnaW5hbEVycm9yKSxcbiAgICAgICAgICBuZXdFcnJvciA9PiBmaW5hbGl6ZSh0cnVlLCBuZXdFcnJvcilcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2h1dGRvd24oaXNFcnJvcj86IGJvb2xlYW4sIGVycm9yPzogYW55KSB7XG4gICAgICBpZiAoc2h1dHRpbmdEb3duKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHNodXR0aW5nRG93biA9IHRydWU7XG5cbiAgICAgIGlmIChkZXN0Ll9zdGF0ZSA9PT0gJ3dyaXRhYmxlJyAmJiAhV3JpdGFibGVTdHJlYW1DbG9zZVF1ZXVlZE9ySW5GbGlnaHQoZGVzdCkpIHtcbiAgICAgICAgdXBvbkZ1bGZpbGxtZW50KHdhaXRGb3JXcml0ZXNUb0ZpbmlzaCgpLCAoKSA9PiBmaW5hbGl6ZShpc0Vycm9yLCBlcnJvcikpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZmluYWxpemUoaXNFcnJvciwgZXJyb3IpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbmFsaXplKGlzRXJyb3I/OiBib29sZWFuLCBlcnJvcj86IGFueSk6IG51bGwge1xuICAgICAgV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyUmVsZWFzZSh3cml0ZXIpO1xuICAgICAgUmVhZGFibGVTdHJlYW1SZWFkZXJHZW5lcmljUmVsZWFzZShyZWFkZXIpO1xuXG4gICAgICBpZiAoc2lnbmFsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgc2lnbmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Fib3J0JywgYWJvcnRBbGdvcml0aG0pO1xuICAgICAgfVxuICAgICAgaWYgKGlzRXJyb3IpIHtcbiAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc29sdmUodW5kZWZpbmVkKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9KTtcbn1cbiIsICJpbXBvcnQgdHlwZSB7IFF1ZXVpbmdTdHJhdGVneVNpemVDYWxsYmFjayB9IGZyb20gJy4uL3F1ZXVpbmctc3RyYXRlZ3knO1xuaW1wb3J0IGFzc2VydCBmcm9tICcuLi8uLi9zdHViL2Fzc2VydCc7XG5pbXBvcnQgeyBEZXF1ZXVlVmFsdWUsIEVucXVldWVWYWx1ZVdpdGhTaXplLCB0eXBlIFF1ZXVlUGFpciwgUmVzZXRRdWV1ZSB9IGZyb20gJy4uL2Fic3RyYWN0LW9wcy9xdWV1ZS13aXRoLXNpemVzJztcbmltcG9ydCB7XG4gIFJlYWRhYmxlU3RyZWFtQWRkUmVhZFJlcXVlc3QsXG4gIFJlYWRhYmxlU3RyZWFtRnVsZmlsbFJlYWRSZXF1ZXN0LFxuICBSZWFkYWJsZVN0cmVhbUdldE51bVJlYWRSZXF1ZXN0cyxcbiAgdHlwZSBSZWFkUmVxdWVzdFxufSBmcm9tICcuL2RlZmF1bHQtcmVhZGVyJztcbmltcG9ydCB7IFNpbXBsZVF1ZXVlIH0gZnJvbSAnLi4vc2ltcGxlLXF1ZXVlJztcbmltcG9ydCB7IElzUmVhZGFibGVTdHJlYW1Mb2NrZWQsIFJlYWRhYmxlU3RyZWFtLCBSZWFkYWJsZVN0cmVhbUNsb3NlLCBSZWFkYWJsZVN0cmVhbUVycm9yIH0gZnJvbSAnLi4vcmVhZGFibGUtc3RyZWFtJztcbmltcG9ydCB0eXBlIHsgVmFsaWRhdGVkVW5kZXJseWluZ1NvdXJjZSB9IGZyb20gJy4vdW5kZXJseWluZy1zb3VyY2UnO1xuaW1wb3J0IHsgc2V0RnVuY3Rpb25OYW1lLCB0eXBlSXNPYmplY3QgfSBmcm9tICcuLi9oZWxwZXJzL21pc2NlbGxhbmVvdXMnO1xuaW1wb3J0IHsgQ2FuY2VsU3RlcHMsIFB1bGxTdGVwcywgUmVsZWFzZVN0ZXBzIH0gZnJvbSAnLi4vYWJzdHJhY3Qtb3BzL2ludGVybmFsLW1ldGhvZHMnO1xuaW1wb3J0IHsgcHJvbWlzZVJlc29sdmVkV2l0aCwgdXBvblByb21pc2UgfSBmcm9tICcuLi9oZWxwZXJzL3dlYmlkbCc7XG5cbi8qKlxuICogQWxsb3dzIGNvbnRyb2wgb2YgYSB7QGxpbmsgUmVhZGFibGVTdHJlYW0gfCByZWFkYWJsZSBzdHJlYW19J3Mgc3RhdGUgYW5kIGludGVybmFsIHF1ZXVlLlxuICpcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNsYXNzIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8Uj4ge1xuICAvKiogQGludGVybmFsICovXG4gIF9jb250cm9sbGVkUmVhZGFibGVTdHJlYW0hOiBSZWFkYWJsZVN0cmVhbTxSPjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcXVldWUhOiBTaW1wbGVRdWV1ZTxRdWV1ZVBhaXI8Uj4+O1xuICAvKiogQGludGVybmFsICovXG4gIF9xdWV1ZVRvdGFsU2l6ZSE6IG51bWJlcjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfc3RhcnRlZCE6IGJvb2xlYW47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2Nsb3NlUmVxdWVzdGVkITogYm9vbGVhbjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcHVsbEFnYWluITogYm9vbGVhbjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcHVsbGluZyAhOiBib29sZWFuO1xuICAvKiogQGludGVybmFsICovXG4gIF9zdHJhdGVneVNpemVBbGdvcml0aG0hOiBRdWV1aW5nU3RyYXRlZ3lTaXplQ2FsbGJhY2s8Uj47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3N0cmF0ZWd5SFdNITogbnVtYmVyO1xuICAvKiogQGludGVybmFsICovXG4gIF9wdWxsQWxnb3JpdGhtITogKCkgPT4gUHJvbWlzZTx2b2lkPjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfY2FuY2VsQWxnb3JpdGhtITogKHJlYXNvbjogYW55KSA9PiBQcm9taXNlPHZvaWQ+O1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IoKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSWxsZWdhbCBjb25zdHJ1Y3RvcicpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGRlc2lyZWQgc2l6ZSB0byBmaWxsIHRoZSBjb250cm9sbGVkIHN0cmVhbSdzIGludGVybmFsIHF1ZXVlLiBJdCBjYW4gYmUgbmVnYXRpdmUsIGlmIHRoZSBxdWV1ZSBpc1xuICAgKiBvdmVyLWZ1bGwuIEFuIHVuZGVybHlpbmcgc291cmNlIG91Z2h0IHRvIHVzZSB0aGlzIGluZm9ybWF0aW9uIHRvIGRldGVybWluZSB3aGVuIGFuZCBob3cgdG8gYXBwbHkgYmFja3ByZXNzdXJlLlxuICAgKi9cbiAgZ2V0IGRlc2lyZWRTaXplKCk6IG51bWJlciB8IG51bGwge1xuICAgIGlmICghSXNSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyKHRoaXMpKSB7XG4gICAgICB0aHJvdyBkZWZhdWx0Q29udHJvbGxlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ2Rlc2lyZWRTaXplJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJHZXREZXNpcmVkU2l6ZSh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbG9zZXMgdGhlIGNvbnRyb2xsZWQgcmVhZGFibGUgc3RyZWFtLiBDb25zdW1lcnMgd2lsbCBzdGlsbCBiZSBhYmxlIHRvIHJlYWQgYW55IHByZXZpb3VzbHktZW5xdWV1ZWQgY2h1bmtzIGZyb21cbiAgICogdGhlIHN0cmVhbSwgYnV0IG9uY2UgdGhvc2UgYXJlIHJlYWQsIHRoZSBzdHJlYW0gd2lsbCBiZWNvbWUgY2xvc2VkLlxuICAgKi9cbiAgY2xvc2UoKTogdm9pZCB7XG4gICAgaWYgKCFJc1JlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIodGhpcykpIHtcbiAgICAgIHRocm93IGRlZmF1bHRDb250cm9sbGVyQnJhbmRDaGVja0V4Y2VwdGlvbignY2xvc2UnKTtcbiAgICB9XG5cbiAgICBpZiAoIVJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDYW5DbG9zZU9yRW5xdWV1ZSh0aGlzKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIHN0cmVhbSBpcyBub3QgaW4gYSBzdGF0ZSB0aGF0IHBlcm1pdHMgY2xvc2UnKTtcbiAgICB9XG5cbiAgICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2xvc2UodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogRW5xdWV1ZXMgdGhlIGdpdmVuIGNodW5rIGBjaHVua2AgaW4gdGhlIGNvbnRyb2xsZWQgcmVhZGFibGUgc3RyZWFtLlxuICAgKi9cbiAgZW5xdWV1ZShjaHVuazogUik6IHZvaWQ7XG4gIGVucXVldWUoY2h1bms6IFIgPSB1bmRlZmluZWQhKTogdm9pZCB7XG4gICAgaWYgKCFJc1JlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIodGhpcykpIHtcbiAgICAgIHRocm93IGRlZmF1bHRDb250cm9sbGVyQnJhbmRDaGVja0V4Y2VwdGlvbignZW5xdWV1ZScpO1xuICAgIH1cblxuICAgIGlmICghUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNhbkNsb3NlT3JFbnF1ZXVlKHRoaXMpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgc3RyZWFtIGlzIG5vdCBpbiBhIHN0YXRlIHRoYXQgcGVybWl0cyBlbnF1ZXVlJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFbnF1ZXVlKHRoaXMsIGNodW5rKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFcnJvcnMgdGhlIGNvbnRyb2xsZWQgcmVhZGFibGUgc3RyZWFtLCBtYWtpbmcgYWxsIGZ1dHVyZSBpbnRlcmFjdGlvbnMgd2l0aCBpdCBmYWlsIHdpdGggdGhlIGdpdmVuIGVycm9yIGBlYC5cbiAgICovXG4gIGVycm9yKGU6IGFueSA9IHVuZGVmaW5lZCk6IHZvaWQge1xuICAgIGlmICghSXNSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyKHRoaXMpKSB7XG4gICAgICB0aHJvdyBkZWZhdWx0Q29udHJvbGxlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ2Vycm9yJyk7XG4gICAgfVxuXG4gICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVycm9yKHRoaXMsIGUpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBbQ2FuY2VsU3RlcHNdKHJlYXNvbjogYW55KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgUmVzZXRRdWV1ZSh0aGlzKTtcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLl9jYW5jZWxBbGdvcml0aG0ocmVhc29uKTtcbiAgICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2xlYXJBbGdvcml0aG1zKHRoaXMpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIFtQdWxsU3RlcHNdKHJlYWRSZXF1ZXN0OiBSZWFkUmVxdWVzdDxSPik6IHZvaWQge1xuICAgIGNvbnN0IHN0cmVhbSA9IHRoaXMuX2NvbnRyb2xsZWRSZWFkYWJsZVN0cmVhbTtcblxuICAgIGlmICh0aGlzLl9xdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBjaHVuayA9IERlcXVldWVWYWx1ZSh0aGlzKTtcblxuICAgICAgaWYgKHRoaXMuX2Nsb3NlUmVxdWVzdGVkICYmIHRoaXMuX3F1ZXVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2xlYXJBbGdvcml0aG1zKHRoaXMpO1xuICAgICAgICBSZWFkYWJsZVN0cmVhbUNsb3NlKHN0cmVhbSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2FsbFB1bGxJZk5lZWRlZCh0aGlzKTtcbiAgICAgIH1cblxuICAgICAgcmVhZFJlcXVlc3QuX2NodW5rU3RlcHMoY2h1bmspO1xuICAgIH0gZWxzZSB7XG4gICAgICBSZWFkYWJsZVN0cmVhbUFkZFJlYWRSZXF1ZXN0KHN0cmVhbSwgcmVhZFJlcXVlc3QpO1xuICAgICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNhbGxQdWxsSWZOZWVkZWQodGhpcyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBbUmVsZWFzZVN0ZXBzXSgpOiB2b2lkIHtcbiAgICAvLyBEbyBub3RoaW5nLlxuICB9XG59XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIucHJvdG90eXBlLCB7XG4gIGNsb3NlOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgZW5xdWV1ZTogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIGVycm9yOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgZGVzaXJlZFNpemU6IHsgZW51bWVyYWJsZTogdHJ1ZSB9XG59KTtcbnNldEZ1bmN0aW9uTmFtZShSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyLnByb3RvdHlwZS5jbG9zZSwgJ2Nsb3NlJyk7XG5zZXRGdW5jdGlvbk5hbWUoUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlci5wcm90b3R5cGUuZW5xdWV1ZSwgJ2VucXVldWUnKTtcbnNldEZ1bmN0aW9uTmFtZShSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyLnByb3RvdHlwZS5lcnJvciwgJ2Vycm9yJyk7XG5pZiAodHlwZW9mIFN5bWJvbC50b1N0cmluZ1RhZyA9PT0gJ3N5bWJvbCcpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIucHJvdG90eXBlLCBTeW1ib2wudG9TdHJpbmdUYWcsIHtcbiAgICB2YWx1ZTogJ1JlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXInLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbn1cblxuLy8gQWJzdHJhY3Qgb3BlcmF0aW9ucyBmb3IgdGhlIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIuXG5cbmZ1bmN0aW9uIElzUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxSID0gYW55Pih4OiBhbnkpOiB4IGlzIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8Uj4ge1xuICBpZiAoIXR5cGVJc09iamVjdCh4KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHgsICdfY29udHJvbGxlZFJlYWRhYmxlU3RyZWFtJykpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4geCBpbnN0YW5jZW9mIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI7XG59XG5cbmZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDYWxsUHVsbElmTmVlZGVkKGNvbnRyb2xsZXI6IFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8YW55Pik6IHZvaWQge1xuICBjb25zdCBzaG91bGRQdWxsID0gUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlclNob3VsZENhbGxQdWxsKGNvbnRyb2xsZXIpO1xuICBpZiAoIXNob3VsZFB1bGwpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoY29udHJvbGxlci5fcHVsbGluZykge1xuICAgIGNvbnRyb2xsZXIuX3B1bGxBZ2FpbiA9IHRydWU7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgYXNzZXJ0KCFjb250cm9sbGVyLl9wdWxsQWdhaW4pO1xuXG4gIGNvbnRyb2xsZXIuX3B1bGxpbmcgPSB0cnVlO1xuXG4gIGNvbnN0IHB1bGxQcm9taXNlID0gY29udHJvbGxlci5fcHVsbEFsZ29yaXRobSgpO1xuICB1cG9uUHJvbWlzZShcbiAgICBwdWxsUHJvbWlzZSxcbiAgICAoKSA9PiB7XG4gICAgICBjb250cm9sbGVyLl9wdWxsaW5nID0gZmFsc2U7XG5cbiAgICAgIGlmIChjb250cm9sbGVyLl9wdWxsQWdhaW4pIHtcbiAgICAgICAgY29udHJvbGxlci5fcHVsbEFnYWluID0gZmFsc2U7XG4gICAgICAgIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDYWxsUHVsbElmTmVlZGVkKGNvbnRyb2xsZXIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIGUgPT4ge1xuICAgICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVycm9yKGNvbnRyb2xsZXIsIGUpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICApO1xufVxuXG5mdW5jdGlvbiBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyU2hvdWxkQ2FsbFB1bGwoY29udHJvbGxlcjogUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxhbnk+KTogYm9vbGVhbiB7XG4gIGNvbnN0IHN0cmVhbSA9IGNvbnRyb2xsZXIuX2NvbnRyb2xsZWRSZWFkYWJsZVN0cmVhbTtcblxuICBpZiAoIVJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDYW5DbG9zZU9yRW5xdWV1ZShjb250cm9sbGVyKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICghY29udHJvbGxlci5fc3RhcnRlZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChJc1JlYWRhYmxlU3RyZWFtTG9ja2VkKHN0cmVhbSkgJiYgUmVhZGFibGVTdHJlYW1HZXROdW1SZWFkUmVxdWVzdHMoc3RyZWFtKSA+IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGNvbnN0IGRlc2lyZWRTaXplID0gUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckdldERlc2lyZWRTaXplKGNvbnRyb2xsZXIpO1xuICBhc3NlcnQoZGVzaXJlZFNpemUgIT09IG51bGwpO1xuICBpZiAoZGVzaXJlZFNpemUhID4gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2xlYXJBbGdvcml0aG1zKGNvbnRyb2xsZXI6IFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8YW55Pikge1xuICBjb250cm9sbGVyLl9wdWxsQWxnb3JpdGhtID0gdW5kZWZpbmVkITtcbiAgY29udHJvbGxlci5fY2FuY2VsQWxnb3JpdGhtID0gdW5kZWZpbmVkITtcbiAgY29udHJvbGxlci5fc3RyYXRlZ3lTaXplQWxnb3JpdGhtID0gdW5kZWZpbmVkITtcbn1cblxuLy8gQSBjbGllbnQgb2YgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlciBtYXkgdXNlIHRoZXNlIGZ1bmN0aW9ucyBkaXJlY3RseSB0byBieXBhc3Mgc3RhdGUgY2hlY2suXG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2xvc2UoY29udHJvbGxlcjogUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxhbnk+KSB7XG4gIGlmICghUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNhbkNsb3NlT3JFbnF1ZXVlKGNvbnRyb2xsZXIpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3Qgc3RyZWFtID0gY29udHJvbGxlci5fY29udHJvbGxlZFJlYWRhYmxlU3RyZWFtO1xuXG4gIGNvbnRyb2xsZXIuX2Nsb3NlUmVxdWVzdGVkID0gdHJ1ZTtcblxuICBpZiAoY29udHJvbGxlci5fcXVldWUubGVuZ3RoID09PSAwKSB7XG4gICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNsZWFyQWxnb3JpdGhtcyhjb250cm9sbGVyKTtcbiAgICBSZWFkYWJsZVN0cmVhbUNsb3NlKHN0cmVhbSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFbnF1ZXVlPFI+KFxuICBjb250cm9sbGVyOiBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyPFI+LFxuICBjaHVuazogUlxuKTogdm9pZCB7XG4gIGlmICghUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNhbkNsb3NlT3JFbnF1ZXVlKGNvbnRyb2xsZXIpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3Qgc3RyZWFtID0gY29udHJvbGxlci5fY29udHJvbGxlZFJlYWRhYmxlU3RyZWFtO1xuXG4gIGlmIChJc1JlYWRhYmxlU3RyZWFtTG9ja2VkKHN0cmVhbSkgJiYgUmVhZGFibGVTdHJlYW1HZXROdW1SZWFkUmVxdWVzdHMoc3RyZWFtKSA+IDApIHtcbiAgICBSZWFkYWJsZVN0cmVhbUZ1bGZpbGxSZWFkUmVxdWVzdChzdHJlYW0sIGNodW5rLCBmYWxzZSk7XG4gIH0gZWxzZSB7XG4gICAgbGV0IGNodW5rU2l6ZTtcbiAgICB0cnkge1xuICAgICAgY2h1bmtTaXplID0gY29udHJvbGxlci5fc3RyYXRlZ3lTaXplQWxnb3JpdGhtKGNodW5rKTtcbiAgICB9IGNhdGNoIChjaHVua1NpemVFKSB7XG4gICAgICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRXJyb3IoY29udHJvbGxlciwgY2h1bmtTaXplRSk7XG4gICAgICB0aHJvdyBjaHVua1NpemVFO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBFbnF1ZXVlVmFsdWVXaXRoU2l6ZShjb250cm9sbGVyLCBjaHVuaywgY2h1bmtTaXplKTtcbiAgICB9IGNhdGNoIChlbnF1ZXVlRSkge1xuICAgICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVycm9yKGNvbnRyb2xsZXIsIGVucXVldWVFKTtcbiAgICAgIHRocm93IGVucXVldWVFO1xuICAgIH1cbiAgfVxuXG4gIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDYWxsUHVsbElmTmVlZGVkKGNvbnRyb2xsZXIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVycm9yKGNvbnRyb2xsZXI6IFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8YW55PiwgZTogYW55KSB7XG4gIGNvbnN0IHN0cmVhbSA9IGNvbnRyb2xsZXIuX2NvbnRyb2xsZWRSZWFkYWJsZVN0cmVhbTtcblxuICBpZiAoc3RyZWFtLl9zdGF0ZSAhPT0gJ3JlYWRhYmxlJykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIFJlc2V0UXVldWUoY29udHJvbGxlcik7XG5cbiAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNsZWFyQWxnb3JpdGhtcyhjb250cm9sbGVyKTtcbiAgUmVhZGFibGVTdHJlYW1FcnJvcihzdHJlYW0sIGUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckdldERlc2lyZWRTaXplKFxuICBjb250cm9sbGVyOiBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyPGFueT5cbik6IG51bWJlciB8IG51bGwge1xuICBjb25zdCBzdGF0ZSA9IGNvbnRyb2xsZXIuX2NvbnRyb2xsZWRSZWFkYWJsZVN0cmVhbS5fc3RhdGU7XG5cbiAgaWYgKHN0YXRlID09PSAnZXJyb3JlZCcpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBpZiAoc3RhdGUgPT09ICdjbG9zZWQnKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICByZXR1cm4gY29udHJvbGxlci5fc3RyYXRlZ3lIV00gLSBjb250cm9sbGVyLl9xdWV1ZVRvdGFsU2l6ZTtcbn1cblxuLy8gVGhpcyBpcyB1c2VkIGluIHRoZSBpbXBsZW1lbnRhdGlvbiBvZiBUcmFuc2Zvcm1TdHJlYW0uXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckhhc0JhY2twcmVzc3VyZShcbiAgY29udHJvbGxlcjogUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxhbnk+XG4pOiBib29sZWFuIHtcbiAgaWYgKFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJTaG91bGRDYWxsUHVsbChjb250cm9sbGVyKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNhbkNsb3NlT3JFbnF1ZXVlKFxuICBjb250cm9sbGVyOiBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyPGFueT5cbik6IGJvb2xlYW4ge1xuICBjb25zdCBzdGF0ZSA9IGNvbnRyb2xsZXIuX2NvbnRyb2xsZWRSZWFkYWJsZVN0cmVhbS5fc3RhdGU7XG5cbiAgaWYgKCFjb250cm9sbGVyLl9jbG9zZVJlcXVlc3RlZCAmJiBzdGF0ZSA9PT0gJ3JlYWRhYmxlJykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gU2V0VXBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyPFI+KHN0cmVhbTogUmVhZGFibGVTdHJlYW08Uj4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8Uj4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0QWxnb3JpdGhtOiAoKSA9PiB2b2lkIHwgUHJvbWlzZUxpa2U8dm9pZD4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHB1bGxBbGdvcml0aG06ICgpID0+IFByb21pc2U8dm9pZD4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbmNlbEFsZ29yaXRobTogKHJlYXNvbjogYW55KSA9PiBQcm9taXNlPHZvaWQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoaWdoV2F0ZXJNYXJrOiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpemVBbGdvcml0aG06IFF1ZXVpbmdTdHJhdGVneVNpemVDYWxsYmFjazxSPikge1xuICBhc3NlcnQoc3RyZWFtLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIgPT09IHVuZGVmaW5lZCk7XG5cbiAgY29udHJvbGxlci5fY29udHJvbGxlZFJlYWRhYmxlU3RyZWFtID0gc3RyZWFtO1xuXG4gIGNvbnRyb2xsZXIuX3F1ZXVlID0gdW5kZWZpbmVkITtcbiAgY29udHJvbGxlci5fcXVldWVUb3RhbFNpemUgPSB1bmRlZmluZWQhO1xuICBSZXNldFF1ZXVlKGNvbnRyb2xsZXIpO1xuXG4gIGNvbnRyb2xsZXIuX3N0YXJ0ZWQgPSBmYWxzZTtcbiAgY29udHJvbGxlci5fY2xvc2VSZXF1ZXN0ZWQgPSBmYWxzZTtcbiAgY29udHJvbGxlci5fcHVsbEFnYWluID0gZmFsc2U7XG4gIGNvbnRyb2xsZXIuX3B1bGxpbmcgPSBmYWxzZTtcblxuICBjb250cm9sbGVyLl9zdHJhdGVneVNpemVBbGdvcml0aG0gPSBzaXplQWxnb3JpdGhtO1xuICBjb250cm9sbGVyLl9zdHJhdGVneUhXTSA9IGhpZ2hXYXRlck1hcms7XG5cbiAgY29udHJvbGxlci5fcHVsbEFsZ29yaXRobSA9IHB1bGxBbGdvcml0aG07XG4gIGNvbnRyb2xsZXIuX2NhbmNlbEFsZ29yaXRobSA9IGNhbmNlbEFsZ29yaXRobTtcblxuICBzdHJlYW0uX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlciA9IGNvbnRyb2xsZXI7XG5cbiAgY29uc3Qgc3RhcnRSZXN1bHQgPSBzdGFydEFsZ29yaXRobSgpO1xuICB1cG9uUHJvbWlzZShcbiAgICBwcm9taXNlUmVzb2x2ZWRXaXRoKHN0YXJ0UmVzdWx0KSxcbiAgICAoKSA9PiB7XG4gICAgICBjb250cm9sbGVyLl9zdGFydGVkID0gdHJ1ZTtcblxuICAgICAgYXNzZXJ0KCFjb250cm9sbGVyLl9wdWxsaW5nKTtcbiAgICAgIGFzc2VydCghY29udHJvbGxlci5fcHVsbEFnYWluKTtcblxuICAgICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNhbGxQdWxsSWZOZWVkZWQoY29udHJvbGxlcik7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIHIgPT4ge1xuICAgICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVycm9yKGNvbnRyb2xsZXIsIHIpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gU2V0VXBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRnJvbVVuZGVybHlpbmdTb3VyY2U8Uj4oXG4gIHN0cmVhbTogUmVhZGFibGVTdHJlYW08Uj4sXG4gIHVuZGVybHlpbmdTb3VyY2U6IFZhbGlkYXRlZFVuZGVybHlpbmdTb3VyY2U8Uj4sXG4gIGhpZ2hXYXRlck1hcms6IG51bWJlcixcbiAgc2l6ZUFsZ29yaXRobTogUXVldWluZ1N0cmF0ZWd5U2l6ZUNhbGxiYWNrPFI+XG4pIHtcbiAgY29uc3QgY29udHJvbGxlcjogUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxSPiA9IE9iamVjdC5jcmVhdGUoUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlci5wcm90b3R5cGUpO1xuXG4gIGxldCBzdGFydEFsZ29yaXRobTogKCkgPT4gdm9pZCB8IFByb21pc2VMaWtlPHZvaWQ+O1xuICBsZXQgcHVsbEFsZ29yaXRobTogKCkgPT4gUHJvbWlzZTx2b2lkPjtcbiAgbGV0IGNhbmNlbEFsZ29yaXRobTogKHJlYXNvbjogYW55KSA9PiBQcm9taXNlPHZvaWQ+O1xuXG4gIGlmICh1bmRlcmx5aW5nU291cmNlLnN0YXJ0ICE9PSB1bmRlZmluZWQpIHtcbiAgICBzdGFydEFsZ29yaXRobSA9ICgpID0+IHVuZGVybHlpbmdTb3VyY2Uuc3RhcnQhKGNvbnRyb2xsZXIpO1xuICB9IGVsc2Uge1xuICAgIHN0YXJ0QWxnb3JpdGhtID0gKCkgPT4gdW5kZWZpbmVkO1xuICB9XG4gIGlmICh1bmRlcmx5aW5nU291cmNlLnB1bGwgIT09IHVuZGVmaW5lZCkge1xuICAgIHB1bGxBbGdvcml0aG0gPSAoKSA9PiB1bmRlcmx5aW5nU291cmNlLnB1bGwhKGNvbnRyb2xsZXIpO1xuICB9IGVsc2Uge1xuICAgIHB1bGxBbGdvcml0aG0gPSAoKSA9PiBwcm9taXNlUmVzb2x2ZWRXaXRoKHVuZGVmaW5lZCk7XG4gIH1cbiAgaWYgKHVuZGVybHlpbmdTb3VyY2UuY2FuY2VsICE9PSB1bmRlZmluZWQpIHtcbiAgICBjYW5jZWxBbGdvcml0aG0gPSByZWFzb24gPT4gdW5kZXJseWluZ1NvdXJjZS5jYW5jZWwhKHJlYXNvbik7XG4gIH0gZWxzZSB7XG4gICAgY2FuY2VsQWxnb3JpdGhtID0gKCkgPT4gcHJvbWlzZVJlc29sdmVkV2l0aCh1bmRlZmluZWQpO1xuICB9XG5cbiAgU2V0VXBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyKFxuICAgIHN0cmVhbSwgY29udHJvbGxlciwgc3RhcnRBbGdvcml0aG0sIHB1bGxBbGdvcml0aG0sIGNhbmNlbEFsZ29yaXRobSwgaGlnaFdhdGVyTWFyaywgc2l6ZUFsZ29yaXRobVxuICApO1xufVxuXG4vLyBIZWxwZXIgZnVuY3Rpb25zIGZvciB0aGUgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlci5cblxuZnVuY3Rpb24gZGVmYXVsdENvbnRyb2xsZXJCcmFuZENoZWNrRXhjZXB0aW9uKG5hbWU6IHN0cmluZyk6IFR5cGVFcnJvciB7XG4gIHJldHVybiBuZXcgVHlwZUVycm9yKFxuICAgIGBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyLnByb3RvdHlwZS4ke25hbWV9IGNhbiBvbmx5IGJlIHVzZWQgb24gYSBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyYCk7XG59XG4iLCAiaW1wb3J0IHtcbiAgQ3JlYXRlUmVhZGFibGVCeXRlU3RyZWFtLFxuICBDcmVhdGVSZWFkYWJsZVN0cmVhbSxcbiAgdHlwZSBEZWZhdWx0UmVhZGFibGVTdHJlYW0sXG4gIElzUmVhZGFibGVTdHJlYW0sXG4gIHR5cGUgUmVhZGFibGVCeXRlU3RyZWFtLFxuICBSZWFkYWJsZVN0cmVhbSxcbiAgUmVhZGFibGVTdHJlYW1DYW5jZWwsXG4gIHR5cGUgUmVhZGFibGVTdHJlYW1SZWFkZXJcbn0gZnJvbSAnLi4vcmVhZGFibGUtc3RyZWFtJztcbmltcG9ydCB7IFJlYWRhYmxlU3RyZWFtUmVhZGVyR2VuZXJpY1JlbGVhc2UgfSBmcm9tICcuL2dlbmVyaWMtcmVhZGVyJztcbmltcG9ydCB7XG4gIEFjcXVpcmVSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXIsXG4gIElzUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyLFxuICBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXJSZWFkLFxuICB0eXBlIFJlYWRSZXF1ZXN0XG59IGZyb20gJy4vZGVmYXVsdC1yZWFkZXInO1xuaW1wb3J0IHtcbiAgQWNxdWlyZVJlYWRhYmxlU3RyZWFtQllPQlJlYWRlcixcbiAgSXNSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIsXG4gIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlclJlYWQsXG4gIHR5cGUgUmVhZEludG9SZXF1ZXN0XG59IGZyb20gJy4vYnlvYi1yZWFkZXInO1xuaW1wb3J0IGFzc2VydCBmcm9tICcuLi8uLi9zdHViL2Fzc2VydCc7XG5pbXBvcnQgeyBuZXdQcm9taXNlLCBwcm9taXNlUmVzb2x2ZWRXaXRoLCBxdWV1ZU1pY3JvdGFzaywgdXBvblJlamVjdGlvbiB9IGZyb20gJy4uL2hlbHBlcnMvd2ViaWRsJztcbmltcG9ydCB7XG4gIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDbG9zZSxcbiAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVucXVldWUsXG4gIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFcnJvclxufSBmcm9tICcuL2RlZmF1bHQtY29udHJvbGxlcic7XG5pbXBvcnQge1xuICBJc1JlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIsXG4gIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJDbG9zZSxcbiAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVucXVldWUsXG4gIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJFcnJvcixcbiAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckdldEJZT0JSZXF1ZXN0LFxuICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyUmVzcG9uZCxcbiAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclJlc3BvbmRXaXRoTmV3Vmlld1xufSBmcm9tICcuL2J5dGUtc3RyZWFtLWNvbnRyb2xsZXInO1xuaW1wb3J0IHsgQ3JlYXRlQXJyYXlGcm9tTGlzdCB9IGZyb20gJy4uL2Fic3RyYWN0LW9wcy9lY21hc2NyaXB0JztcbmltcG9ydCB7IENsb25lQXNVaW50OEFycmF5IH0gZnJvbSAnLi4vYWJzdHJhY3Qtb3BzL21pc2NlbGxhbmVvdXMnO1xuaW1wb3J0IHR5cGUgeyBOb25TaGFyZWQgfSBmcm9tICcuLi9oZWxwZXJzL2FycmF5LWJ1ZmZlci12aWV3JztcblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtVGVlPFI+KHN0cmVhbTogUmVhZGFibGVTdHJlYW08Uj4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xvbmVGb3JCcmFuY2gyOiBib29sZWFuKTogW1JlYWRhYmxlU3RyZWFtPFI+LCBSZWFkYWJsZVN0cmVhbTxSPl0ge1xuICBhc3NlcnQoSXNSZWFkYWJsZVN0cmVhbShzdHJlYW0pKTtcbiAgYXNzZXJ0KHR5cGVvZiBjbG9uZUZvckJyYW5jaDIgPT09ICdib29sZWFuJyk7XG4gIGlmIChJc1JlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIoc3RyZWFtLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIpKSB7XG4gICAgcmV0dXJuIFJlYWRhYmxlQnl0ZVN0cmVhbVRlZShzdHJlYW0gYXMgdW5rbm93biBhcyBSZWFkYWJsZUJ5dGVTdHJlYW0pIGFzXG4gICAgICB1bmtub3duIGFzIFtSZWFkYWJsZVN0cmVhbTxSPiwgUmVhZGFibGVTdHJlYW08Uj5dO1xuICB9XG4gIHJldHVybiBSZWFkYWJsZVN0cmVhbURlZmF1bHRUZWUoc3RyZWFtLCBjbG9uZUZvckJyYW5jaDIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1EZWZhdWx0VGVlPFI+KFxuICBzdHJlYW06IFJlYWRhYmxlU3RyZWFtPFI+LFxuICBjbG9uZUZvckJyYW5jaDI6IGJvb2xlYW5cbik6IFtEZWZhdWx0UmVhZGFibGVTdHJlYW08Uj4sIERlZmF1bHRSZWFkYWJsZVN0cmVhbTxSPl0ge1xuICBhc3NlcnQoSXNSZWFkYWJsZVN0cmVhbShzdHJlYW0pKTtcbiAgYXNzZXJ0KHR5cGVvZiBjbG9uZUZvckJyYW5jaDIgPT09ICdib29sZWFuJyk7XG5cbiAgY29uc3QgcmVhZGVyID0gQWNxdWlyZVJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcjxSPihzdHJlYW0pO1xuXG4gIGxldCByZWFkaW5nID0gZmFsc2U7XG4gIGxldCByZWFkQWdhaW4gPSBmYWxzZTtcbiAgbGV0IGNhbmNlbGVkMSA9IGZhbHNlO1xuICBsZXQgY2FuY2VsZWQyID0gZmFsc2U7XG4gIGxldCByZWFzb24xOiBhbnk7XG4gIGxldCByZWFzb24yOiBhbnk7XG4gIGxldCBicmFuY2gxOiBEZWZhdWx0UmVhZGFibGVTdHJlYW08Uj47XG4gIGxldCBicmFuY2gyOiBEZWZhdWx0UmVhZGFibGVTdHJlYW08Uj47XG5cbiAgbGV0IHJlc29sdmVDYW5jZWxQcm9taXNlOiAodmFsdWU6IHVuZGVmaW5lZCB8IFByb21pc2U8dW5kZWZpbmVkPikgPT4gdm9pZDtcbiAgY29uc3QgY2FuY2VsUHJvbWlzZSA9IG5ld1Byb21pc2U8dW5kZWZpbmVkPihyZXNvbHZlID0+IHtcbiAgICByZXNvbHZlQ2FuY2VsUHJvbWlzZSA9IHJlc29sdmU7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHB1bGxBbGdvcml0aG0oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKHJlYWRpbmcpIHtcbiAgICAgIHJlYWRBZ2FpbiA9IHRydWU7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlc29sdmVkV2l0aCh1bmRlZmluZWQpO1xuICAgIH1cblxuICAgIHJlYWRpbmcgPSB0cnVlO1xuXG4gICAgY29uc3QgcmVhZFJlcXVlc3Q6IFJlYWRSZXF1ZXN0PFI+ID0ge1xuICAgICAgX2NodW5rU3RlcHM6IGNodW5rID0+IHtcbiAgICAgICAgLy8gVGhpcyBuZWVkcyB0byBiZSBkZWxheWVkIGEgbWljcm90YXNrIGJlY2F1c2UgaXQgdGFrZXMgYXQgbGVhc3QgYSBtaWNyb3Rhc2sgdG8gZGV0ZWN0IGVycm9ycyAodXNpbmdcbiAgICAgICAgLy8gcmVhZGVyLl9jbG9zZWRQcm9taXNlIGJlbG93KSwgYW5kIHdlIHdhbnQgZXJyb3JzIGluIHN0cmVhbSB0byBlcnJvciBib3RoIGJyYW5jaGVzIGltbWVkaWF0ZWx5LiBXZSBjYW5ub3QgbGV0XG4gICAgICAgIC8vIHN1Y2Nlc3NmdWwgc3luY2hyb25vdXNseS1hdmFpbGFibGUgcmVhZHMgZ2V0IGFoZWFkIG9mIGFzeW5jaHJvbm91c2x5LWF2YWlsYWJsZSBlcnJvcnMuXG4gICAgICAgIHF1ZXVlTWljcm90YXNrKCgpID0+IHtcbiAgICAgICAgICByZWFkQWdhaW4gPSBmYWxzZTtcbiAgICAgICAgICBjb25zdCBjaHVuazEgPSBjaHVuaztcbiAgICAgICAgICBjb25zdCBjaHVuazIgPSBjaHVuaztcblxuICAgICAgICAgIC8vIFRoZXJlIGlzIG5vIHdheSB0byBhY2Nlc3MgdGhlIGNsb25pbmcgY29kZSByaWdodCBub3cgaW4gdGhlIHJlZmVyZW5jZSBpbXBsZW1lbnRhdGlvbi5cbiAgICAgICAgICAvLyBJZiB3ZSBhZGQgb25lIHRoZW4gd2UnbGwgbmVlZCBhbiBpbXBsZW1lbnRhdGlvbiBmb3Igc2VyaWFsaXphYmxlIG9iamVjdHMuXG4gICAgICAgICAgLy8gaWYgKCFjYW5jZWxlZDIgJiYgY2xvbmVGb3JCcmFuY2gyKSB7XG4gICAgICAgICAgLy8gICBjaHVuazIgPSBTdHJ1Y3R1cmVkRGVzZXJpYWxpemUoU3RydWN0dXJlZFNlcmlhbGl6ZShjaHVuazIpKTtcbiAgICAgICAgICAvLyB9XG5cbiAgICAgICAgICBpZiAoIWNhbmNlbGVkMSkge1xuICAgICAgICAgICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVucXVldWUoYnJhbmNoMS5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyLCBjaHVuazEpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIWNhbmNlbGVkMikge1xuICAgICAgICAgICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVucXVldWUoYnJhbmNoMi5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyLCBjaHVuazIpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICBpZiAocmVhZEFnYWluKSB7XG4gICAgICAgICAgICBwdWxsQWxnb3JpdGhtKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBfY2xvc2VTdGVwczogKCkgPT4ge1xuICAgICAgICByZWFkaW5nID0gZmFsc2U7XG4gICAgICAgIGlmICghY2FuY2VsZWQxKSB7XG4gICAgICAgICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNsb3NlKGJyYW5jaDEuX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFjYW5jZWxlZDIpIHtcbiAgICAgICAgICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2xvc2UoYnJhbmNoMi5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghY2FuY2VsZWQxIHx8ICFjYW5jZWxlZDIpIHtcbiAgICAgICAgICByZXNvbHZlQ2FuY2VsUHJvbWlzZSh1bmRlZmluZWQpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgX2Vycm9yU3RlcHM6ICgpID0+IHtcbiAgICAgICAgcmVhZGluZyA9IGZhbHNlO1xuICAgICAgfVxuICAgIH07XG4gICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyUmVhZChyZWFkZXIsIHJlYWRSZXF1ZXN0KTtcblxuICAgIHJldHVybiBwcm9taXNlUmVzb2x2ZWRXaXRoKHVuZGVmaW5lZCk7XG4gIH1cblxuICBmdW5jdGlvbiBjYW5jZWwxQWxnb3JpdGhtKHJlYXNvbjogYW55KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY2FuY2VsZWQxID0gdHJ1ZTtcbiAgICByZWFzb24xID0gcmVhc29uO1xuICAgIGlmIChjYW5jZWxlZDIpIHtcbiAgICAgIGNvbnN0IGNvbXBvc2l0ZVJlYXNvbiA9IENyZWF0ZUFycmF5RnJvbUxpc3QoW3JlYXNvbjEsIHJlYXNvbjJdKTtcbiAgICAgIGNvbnN0IGNhbmNlbFJlc3VsdCA9IFJlYWRhYmxlU3RyZWFtQ2FuY2VsKHN0cmVhbSwgY29tcG9zaXRlUmVhc29uKTtcbiAgICAgIHJlc29sdmVDYW5jZWxQcm9taXNlKGNhbmNlbFJlc3VsdCk7XG4gICAgfVxuICAgIHJldHVybiBjYW5jZWxQcm9taXNlO1xuICB9XG5cbiAgZnVuY3Rpb24gY2FuY2VsMkFsZ29yaXRobShyZWFzb246IGFueSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNhbmNlbGVkMiA9IHRydWU7XG4gICAgcmVhc29uMiA9IHJlYXNvbjtcbiAgICBpZiAoY2FuY2VsZWQxKSB7XG4gICAgICBjb25zdCBjb21wb3NpdGVSZWFzb24gPSBDcmVhdGVBcnJheUZyb21MaXN0KFtyZWFzb24xLCByZWFzb24yXSk7XG4gICAgICBjb25zdCBjYW5jZWxSZXN1bHQgPSBSZWFkYWJsZVN0cmVhbUNhbmNlbChzdHJlYW0sIGNvbXBvc2l0ZVJlYXNvbik7XG4gICAgICByZXNvbHZlQ2FuY2VsUHJvbWlzZShjYW5jZWxSZXN1bHQpO1xuICAgIH1cbiAgICByZXR1cm4gY2FuY2VsUHJvbWlzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0YXJ0QWxnb3JpdGhtKCkge1xuICAgIC8vIGRvIG5vdGhpbmdcbiAgfVxuXG4gIGJyYW5jaDEgPSBDcmVhdGVSZWFkYWJsZVN0cmVhbShzdGFydEFsZ29yaXRobSwgcHVsbEFsZ29yaXRobSwgY2FuY2VsMUFsZ29yaXRobSk7XG4gIGJyYW5jaDIgPSBDcmVhdGVSZWFkYWJsZVN0cmVhbShzdGFydEFsZ29yaXRobSwgcHVsbEFsZ29yaXRobSwgY2FuY2VsMkFsZ29yaXRobSk7XG5cbiAgdXBvblJlamVjdGlvbihyZWFkZXIuX2Nsb3NlZFByb21pc2UsIChyOiBhbnkpID0+IHtcbiAgICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRXJyb3IoYnJhbmNoMS5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyLCByKTtcbiAgICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRXJyb3IoYnJhbmNoMi5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyLCByKTtcbiAgICBpZiAoIWNhbmNlbGVkMSB8fCAhY2FuY2VsZWQyKSB7XG4gICAgICByZXNvbHZlQ2FuY2VsUHJvbWlzZSh1bmRlZmluZWQpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfSk7XG5cbiAgcmV0dXJuIFticmFuY2gxLCBicmFuY2gyXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlQnl0ZVN0cmVhbVRlZShzdHJlYW06IFJlYWRhYmxlQnl0ZVN0cmVhbSk6IFtSZWFkYWJsZUJ5dGVTdHJlYW0sIFJlYWRhYmxlQnl0ZVN0cmVhbV0ge1xuICBhc3NlcnQoSXNSZWFkYWJsZVN0cmVhbShzdHJlYW0pKTtcbiAgYXNzZXJ0KElzUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcihzdHJlYW0uX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlcikpO1xuXG4gIGxldCByZWFkZXI6IFJlYWRhYmxlU3RyZWFtUmVhZGVyPE5vblNoYXJlZDxVaW50OEFycmF5Pj4gPSBBY3F1aXJlUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyKHN0cmVhbSk7XG4gIGxldCByZWFkaW5nID0gZmFsc2U7XG4gIGxldCByZWFkQWdhaW5Gb3JCcmFuY2gxID0gZmFsc2U7XG4gIGxldCByZWFkQWdhaW5Gb3JCcmFuY2gyID0gZmFsc2U7XG4gIGxldCBjYW5jZWxlZDEgPSBmYWxzZTtcbiAgbGV0IGNhbmNlbGVkMiA9IGZhbHNlO1xuICBsZXQgcmVhc29uMTogYW55O1xuICBsZXQgcmVhc29uMjogYW55O1xuICBsZXQgYnJhbmNoMTogUmVhZGFibGVCeXRlU3RyZWFtO1xuICBsZXQgYnJhbmNoMjogUmVhZGFibGVCeXRlU3RyZWFtO1xuXG4gIGxldCByZXNvbHZlQ2FuY2VsUHJvbWlzZTogKHZhbHVlOiB1bmRlZmluZWQgfCBQcm9taXNlPHVuZGVmaW5lZD4pID0+IHZvaWQ7XG4gIGNvbnN0IGNhbmNlbFByb21pc2UgPSBuZXdQcm9taXNlPHZvaWQ+KHJlc29sdmUgPT4ge1xuICAgIHJlc29sdmVDYW5jZWxQcm9taXNlID0gcmVzb2x2ZTtcbiAgfSk7XG5cbiAgZnVuY3Rpb24gZm9yd2FyZFJlYWRlckVycm9yKHRoaXNSZWFkZXI6IFJlYWRhYmxlU3RyZWFtUmVhZGVyPE5vblNoYXJlZDxVaW50OEFycmF5Pj4pIHtcbiAgICB1cG9uUmVqZWN0aW9uKHRoaXNSZWFkZXIuX2Nsb3NlZFByb21pc2UsIHIgPT4ge1xuICAgICAgaWYgKHRoaXNSZWFkZXIgIT09IHJlYWRlcikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJFcnJvcihicmFuY2gxLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIsIHIpO1xuICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVycm9yKGJyYW5jaDIuX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlciwgcik7XG4gICAgICBpZiAoIWNhbmNlbGVkMSB8fCAhY2FuY2VsZWQyKSB7XG4gICAgICAgIHJlc29sdmVDYW5jZWxQcm9taXNlKHVuZGVmaW5lZCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHB1bGxXaXRoRGVmYXVsdFJlYWRlcigpIHtcbiAgICBpZiAoSXNSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIocmVhZGVyKSkge1xuICAgICAgYXNzZXJ0KHJlYWRlci5fcmVhZEludG9SZXF1ZXN0cy5sZW5ndGggPT09IDApO1xuICAgICAgUmVhZGFibGVTdHJlYW1SZWFkZXJHZW5lcmljUmVsZWFzZShyZWFkZXIpO1xuXG4gICAgICByZWFkZXIgPSBBY3F1aXJlUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyKHN0cmVhbSk7XG4gICAgICBmb3J3YXJkUmVhZGVyRXJyb3IocmVhZGVyKTtcbiAgICB9XG5cbiAgICBjb25zdCByZWFkUmVxdWVzdDogUmVhZFJlcXVlc3Q8Tm9uU2hhcmVkPFVpbnQ4QXJyYXk+PiA9IHtcbiAgICAgIF9jaHVua1N0ZXBzOiBjaHVuayA9PiB7XG4gICAgICAgIC8vIFRoaXMgbmVlZHMgdG8gYmUgZGVsYXllZCBhIG1pY3JvdGFzayBiZWNhdXNlIGl0IHRha2VzIGF0IGxlYXN0IGEgbWljcm90YXNrIHRvIGRldGVjdCBlcnJvcnMgKHVzaW5nXG4gICAgICAgIC8vIHJlYWRlci5fY2xvc2VkUHJvbWlzZSBiZWxvdyksIGFuZCB3ZSB3YW50IGVycm9ycyBpbiBzdHJlYW0gdG8gZXJyb3IgYm90aCBicmFuY2hlcyBpbW1lZGlhdGVseS4gV2UgY2Fubm90IGxldFxuICAgICAgICAvLyBzdWNjZXNzZnVsIHN5bmNocm9ub3VzbHktYXZhaWxhYmxlIHJlYWRzIGdldCBhaGVhZCBvZiBhc3luY2hyb25vdXNseS1hdmFpbGFibGUgZXJyb3JzLlxuICAgICAgICBxdWV1ZU1pY3JvdGFzaygoKSA9PiB7XG4gICAgICAgICAgcmVhZEFnYWluRm9yQnJhbmNoMSA9IGZhbHNlO1xuICAgICAgICAgIHJlYWRBZ2FpbkZvckJyYW5jaDIgPSBmYWxzZTtcblxuICAgICAgICAgIGNvbnN0IGNodW5rMSA9IGNodW5rO1xuICAgICAgICAgIGxldCBjaHVuazIgPSBjaHVuaztcbiAgICAgICAgICBpZiAoIWNhbmNlbGVkMSAmJiAhY2FuY2VsZWQyKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBjaHVuazIgPSBDbG9uZUFzVWludDhBcnJheShjaHVuayk7XG4gICAgICAgICAgICB9IGNhdGNoIChjbG9uZUUpIHtcbiAgICAgICAgICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVycm9yKGJyYW5jaDEuX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlciwgY2xvbmVFKTtcbiAgICAgICAgICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVycm9yKGJyYW5jaDIuX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlciwgY2xvbmVFKTtcbiAgICAgICAgICAgICAgcmVzb2x2ZUNhbmNlbFByb21pc2UoUmVhZGFibGVTdHJlYW1DYW5jZWwoc3RyZWFtLCBjbG9uZUUpKTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghY2FuY2VsZWQxKSB7XG4gICAgICAgICAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRW5xdWV1ZShicmFuY2gxLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIsIGNodW5rMSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghY2FuY2VsZWQyKSB7XG4gICAgICAgICAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRW5xdWV1ZShicmFuY2gyLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIsIGNodW5rMik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVhZGluZyA9IGZhbHNlO1xuICAgICAgICAgIGlmIChyZWFkQWdhaW5Gb3JCcmFuY2gxKSB7XG4gICAgICAgICAgICBwdWxsMUFsZ29yaXRobSgpO1xuICAgICAgICAgIH0gZWxzZSBpZiAocmVhZEFnYWluRm9yQnJhbmNoMikge1xuICAgICAgICAgICAgcHVsbDJBbGdvcml0aG0oKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIF9jbG9zZVN0ZXBzOiAoKSA9PiB7XG4gICAgICAgIHJlYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgaWYgKCFjYW5jZWxlZDEpIHtcbiAgICAgICAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyQ2xvc2UoYnJhbmNoMS5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWNhbmNlbGVkMikge1xuICAgICAgICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJDbG9zZShicmFuY2gyLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChicmFuY2gxLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIuX3BlbmRpbmdQdWxsSW50b3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJSZXNwb25kKGJyYW5jaDEuX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlciwgMCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJyYW5jaDIuX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlci5fcGVuZGluZ1B1bGxJbnRvcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclJlc3BvbmQoYnJhbmNoMi5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyLCAwKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWNhbmNlbGVkMSB8fCAhY2FuY2VsZWQyKSB7XG4gICAgICAgICAgcmVzb2x2ZUNhbmNlbFByb21pc2UodW5kZWZpbmVkKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIF9lcnJvclN0ZXBzOiAoKSA9PiB7XG4gICAgICAgIHJlYWRpbmcgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9O1xuICAgIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlclJlYWQocmVhZGVyLCByZWFkUmVxdWVzdCk7XG4gIH1cblxuICBmdW5jdGlvbiBwdWxsV2l0aEJZT0JSZWFkZXIodmlldzogTm9uU2hhcmVkPEFycmF5QnVmZmVyVmlldz4sIGZvckJyYW5jaDI6IGJvb2xlYW4pIHtcbiAgICBpZiAoSXNSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXI8Tm9uU2hhcmVkPFVpbnQ4QXJyYXk+PihyZWFkZXIpKSB7XG4gICAgICBhc3NlcnQocmVhZGVyLl9yZWFkUmVxdWVzdHMubGVuZ3RoID09PSAwKTtcbiAgICAgIFJlYWRhYmxlU3RyZWFtUmVhZGVyR2VuZXJpY1JlbGVhc2UocmVhZGVyKTtcblxuICAgICAgcmVhZGVyID0gQWNxdWlyZVJlYWRhYmxlU3RyZWFtQllPQlJlYWRlcihzdHJlYW0pO1xuICAgICAgZm9yd2FyZFJlYWRlckVycm9yKHJlYWRlcik7XG4gICAgfVxuXG4gICAgY29uc3QgYnlvYkJyYW5jaCA9IGZvckJyYW5jaDIgPyBicmFuY2gyIDogYnJhbmNoMTtcbiAgICBjb25zdCBvdGhlckJyYW5jaCA9IGZvckJyYW5jaDIgPyBicmFuY2gxIDogYnJhbmNoMjtcblxuICAgIGNvbnN0IHJlYWRJbnRvUmVxdWVzdDogUmVhZEludG9SZXF1ZXN0PE5vblNoYXJlZDxBcnJheUJ1ZmZlclZpZXc+PiA9IHtcbiAgICAgIF9jaHVua1N0ZXBzOiBjaHVuayA9PiB7XG4gICAgICAgIC8vIFRoaXMgbmVlZHMgdG8gYmUgZGVsYXllZCBhIG1pY3JvdGFzayBiZWNhdXNlIGl0IHRha2VzIGF0IGxlYXN0IGEgbWljcm90YXNrIHRvIGRldGVjdCBlcnJvcnMgKHVzaW5nXG4gICAgICAgIC8vIHJlYWRlci5fY2xvc2VkUHJvbWlzZSBiZWxvdyksIGFuZCB3ZSB3YW50IGVycm9ycyBpbiBzdHJlYW0gdG8gZXJyb3IgYm90aCBicmFuY2hlcyBpbW1lZGlhdGVseS4gV2UgY2Fubm90IGxldFxuICAgICAgICAvLyBzdWNjZXNzZnVsIHN5bmNocm9ub3VzbHktYXZhaWxhYmxlIHJlYWRzIGdldCBhaGVhZCBvZiBhc3luY2hyb25vdXNseS1hdmFpbGFibGUgZXJyb3JzLlxuICAgICAgICBxdWV1ZU1pY3JvdGFzaygoKSA9PiB7XG4gICAgICAgICAgcmVhZEFnYWluRm9yQnJhbmNoMSA9IGZhbHNlO1xuICAgICAgICAgIHJlYWRBZ2FpbkZvckJyYW5jaDIgPSBmYWxzZTtcblxuICAgICAgICAgIGNvbnN0IGJ5b2JDYW5jZWxlZCA9IGZvckJyYW5jaDIgPyBjYW5jZWxlZDIgOiBjYW5jZWxlZDE7XG4gICAgICAgICAgY29uc3Qgb3RoZXJDYW5jZWxlZCA9IGZvckJyYW5jaDIgPyBjYW5jZWxlZDEgOiBjYW5jZWxlZDI7XG5cbiAgICAgICAgICBpZiAoIW90aGVyQ2FuY2VsZWQpIHtcbiAgICAgICAgICAgIGxldCBjbG9uZWRDaHVuaztcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGNsb25lZENodW5rID0gQ2xvbmVBc1VpbnQ4QXJyYXkoY2h1bmspO1xuICAgICAgICAgICAgfSBjYXRjaCAoY2xvbmVFKSB7XG4gICAgICAgICAgICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJFcnJvcihieW9iQnJhbmNoLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIsIGNsb25lRSk7XG4gICAgICAgICAgICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJFcnJvcihvdGhlckJyYW5jaC5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyLCBjbG9uZUUpO1xuICAgICAgICAgICAgICByZXNvbHZlQ2FuY2VsUHJvbWlzZShSZWFkYWJsZVN0cmVhbUNhbmNlbChzdHJlYW0sIGNsb25lRSkpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWJ5b2JDYW5jZWxlZCkge1xuICAgICAgICAgICAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyUmVzcG9uZFdpdGhOZXdWaWV3KGJ5b2JCcmFuY2guX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlciwgY2h1bmspO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVucXVldWUob3RoZXJCcmFuY2guX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlciwgY2xvbmVkQ2h1bmspO1xuICAgICAgICAgIH0gZWxzZSBpZiAoIWJ5b2JDYW5jZWxlZCkge1xuICAgICAgICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclJlc3BvbmRXaXRoTmV3VmlldyhieW9iQnJhbmNoLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIsIGNodW5rKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZWFkaW5nID0gZmFsc2U7XG4gICAgICAgICAgaWYgKHJlYWRBZ2FpbkZvckJyYW5jaDEpIHtcbiAgICAgICAgICAgIHB1bGwxQWxnb3JpdGhtKCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChyZWFkQWdhaW5Gb3JCcmFuY2gyKSB7XG4gICAgICAgICAgICBwdWxsMkFsZ29yaXRobSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgX2Nsb3NlU3RlcHM6IGNodW5rID0+IHtcbiAgICAgICAgcmVhZGluZyA9IGZhbHNlO1xuXG4gICAgICAgIGNvbnN0IGJ5b2JDYW5jZWxlZCA9IGZvckJyYW5jaDIgPyBjYW5jZWxlZDIgOiBjYW5jZWxlZDE7XG4gICAgICAgIGNvbnN0IG90aGVyQ2FuY2VsZWQgPSBmb3JCcmFuY2gyID8gY2FuY2VsZWQxIDogY2FuY2VsZWQyO1xuXG4gICAgICAgIGlmICghYnlvYkNhbmNlbGVkKSB7XG4gICAgICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckNsb3NlKGJ5b2JCcmFuY2guX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFvdGhlckNhbmNlbGVkKSB7XG4gICAgICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckNsb3NlKG90aGVyQnJhbmNoLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNodW5rICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBhc3NlcnQoY2h1bmsuYnl0ZUxlbmd0aCA9PT0gMCk7XG5cbiAgICAgICAgICBpZiAoIWJ5b2JDYW5jZWxlZCkge1xuICAgICAgICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclJlc3BvbmRXaXRoTmV3VmlldyhieW9iQnJhbmNoLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIsIGNodW5rKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFvdGhlckNhbmNlbGVkICYmIG90aGVyQnJhbmNoLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIuX3BlbmRpbmdQdWxsSW50b3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclJlc3BvbmQob3RoZXJCcmFuY2guX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlciwgMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFieW9iQ2FuY2VsZWQgfHwgIW90aGVyQ2FuY2VsZWQpIHtcbiAgICAgICAgICByZXNvbHZlQ2FuY2VsUHJvbWlzZSh1bmRlZmluZWQpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgX2Vycm9yU3RlcHM6ICgpID0+IHtcbiAgICAgICAgcmVhZGluZyA9IGZhbHNlO1xuICAgICAgfVxuICAgIH07XG4gICAgUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyUmVhZChyZWFkZXIsIHZpZXcsIDEsIHJlYWRJbnRvUmVxdWVzdCk7XG4gIH1cblxuICBmdW5jdGlvbiBwdWxsMUFsZ29yaXRobSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAocmVhZGluZykge1xuICAgICAgcmVhZEFnYWluRm9yQnJhbmNoMSA9IHRydWU7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlc29sdmVkV2l0aCh1bmRlZmluZWQpO1xuICAgIH1cblxuICAgIHJlYWRpbmcgPSB0cnVlO1xuXG4gICAgY29uc3QgYnlvYlJlcXVlc3QgPSBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyR2V0QllPQlJlcXVlc3QoYnJhbmNoMS5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyKTtcbiAgICBpZiAoYnlvYlJlcXVlc3QgPT09IG51bGwpIHtcbiAgICAgIHB1bGxXaXRoRGVmYXVsdFJlYWRlcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwdWxsV2l0aEJZT0JSZWFkZXIoYnlvYlJlcXVlc3QuX3ZpZXchLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHByb21pc2VSZXNvbHZlZFdpdGgodW5kZWZpbmVkKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHB1bGwyQWxnb3JpdGhtKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmIChyZWFkaW5nKSB7XG4gICAgICByZWFkQWdhaW5Gb3JCcmFuY2gyID0gdHJ1ZTtcbiAgICAgIHJldHVybiBwcm9taXNlUmVzb2x2ZWRXaXRoKHVuZGVmaW5lZCk7XG4gICAgfVxuXG4gICAgcmVhZGluZyA9IHRydWU7XG5cbiAgICBjb25zdCBieW9iUmVxdWVzdCA9IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJHZXRCWU9CUmVxdWVzdChicmFuY2gyLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIpO1xuICAgIGlmIChieW9iUmVxdWVzdCA9PT0gbnVsbCkge1xuICAgICAgcHVsbFdpdGhEZWZhdWx0UmVhZGVyKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHB1bGxXaXRoQllPQlJlYWRlcihieW9iUmVxdWVzdC5fdmlldyEsIHRydWUpO1xuICAgIH1cblxuICAgIHJldHVybiBwcm9taXNlUmVzb2x2ZWRXaXRoKHVuZGVmaW5lZCk7XG4gIH1cblxuICBmdW5jdGlvbiBjYW5jZWwxQWxnb3JpdGhtKHJlYXNvbjogYW55KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY2FuY2VsZWQxID0gdHJ1ZTtcbiAgICByZWFzb24xID0gcmVhc29uO1xuICAgIGlmIChjYW5jZWxlZDIpIHtcbiAgICAgIGNvbnN0IGNvbXBvc2l0ZVJlYXNvbiA9IENyZWF0ZUFycmF5RnJvbUxpc3QoW3JlYXNvbjEsIHJlYXNvbjJdKTtcbiAgICAgIGNvbnN0IGNhbmNlbFJlc3VsdCA9IFJlYWRhYmxlU3RyZWFtQ2FuY2VsKHN0cmVhbSwgY29tcG9zaXRlUmVhc29uKTtcbiAgICAgIHJlc29sdmVDYW5jZWxQcm9taXNlKGNhbmNlbFJlc3VsdCk7XG4gICAgfVxuICAgIHJldHVybiBjYW5jZWxQcm9taXNlO1xuICB9XG5cbiAgZnVuY3Rpb24gY2FuY2VsMkFsZ29yaXRobShyZWFzb246IGFueSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNhbmNlbGVkMiA9IHRydWU7XG4gICAgcmVhc29uMiA9IHJlYXNvbjtcbiAgICBpZiAoY2FuY2VsZWQxKSB7XG4gICAgICBjb25zdCBjb21wb3NpdGVSZWFzb24gPSBDcmVhdGVBcnJheUZyb21MaXN0KFtyZWFzb24xLCByZWFzb24yXSk7XG4gICAgICBjb25zdCBjYW5jZWxSZXN1bHQgPSBSZWFkYWJsZVN0cmVhbUNhbmNlbChzdHJlYW0sIGNvbXBvc2l0ZVJlYXNvbik7XG4gICAgICByZXNvbHZlQ2FuY2VsUHJvbWlzZShjYW5jZWxSZXN1bHQpO1xuICAgIH1cbiAgICByZXR1cm4gY2FuY2VsUHJvbWlzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0YXJ0QWxnb3JpdGhtKCk6IHZvaWQge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGJyYW5jaDEgPSBDcmVhdGVSZWFkYWJsZUJ5dGVTdHJlYW0oc3RhcnRBbGdvcml0aG0sIHB1bGwxQWxnb3JpdGhtLCBjYW5jZWwxQWxnb3JpdGhtKTtcbiAgYnJhbmNoMiA9IENyZWF0ZVJlYWRhYmxlQnl0ZVN0cmVhbShzdGFydEFsZ29yaXRobSwgcHVsbDJBbGdvcml0aG0sIGNhbmNlbDJBbGdvcml0aG0pO1xuXG4gIGZvcndhcmRSZWFkZXJFcnJvcihyZWFkZXIpO1xuXG4gIHJldHVybiBbYnJhbmNoMSwgYnJhbmNoMl07XG59XG4iLCAiaW1wb3J0IHsgdHlwZUlzT2JqZWN0IH0gZnJvbSAnLi4vaGVscGVycy9taXNjZWxsYW5lb3VzJztcbmltcG9ydCB0eXBlIHsgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZFJlc3VsdCB9IGZyb20gJy4vZGVmYXVsdC1yZWFkZXInO1xuXG4vKipcbiAqIEEgY29tbW9uIGludGVyZmFjZSBmb3IgYSBgUmVhZGFkYWJsZVN0cmVhbWAgaW1wbGVtZW50YXRpb24uXG4gKlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgaW50ZXJmYWNlIFJlYWRhYmxlU3RyZWFtTGlrZTxSID0gYW55PiB7XG4gIHJlYWRvbmx5IGxvY2tlZDogYm9vbGVhbjtcblxuICBnZXRSZWFkZXIoKTogUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyTGlrZTxSPjtcbn1cblxuLyoqXG4gKiBBIGNvbW1vbiBpbnRlcmZhY2UgZm9yIGEgYFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcmAgaW1wbGVtZW50YXRpb24uXG4gKlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgaW50ZXJmYWNlIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlckxpa2U8UiA9IGFueT4ge1xuICByZWFkb25seSBjbG9zZWQ6IFByb21pc2U8dW5kZWZpbmVkPjtcblxuICBjYW5jZWwocmVhc29uPzogYW55KTogUHJvbWlzZTx2b2lkPjtcblxuICByZWFkKCk6IFByb21pc2U8UmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZFJlc3VsdDxSPj47XG5cbiAgcmVsZWFzZUxvY2soKTogdm9pZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUmVhZGFibGVTdHJlYW1MaWtlPFI+KHN0cmVhbTogdW5rbm93bik6IHN0cmVhbSBpcyBSZWFkYWJsZVN0cmVhbUxpa2U8Uj4ge1xuICByZXR1cm4gdHlwZUlzT2JqZWN0KHN0cmVhbSkgJiYgdHlwZW9mIChzdHJlYW0gYXMgUmVhZGFibGVTdHJlYW1MaWtlPFI+KS5nZXRSZWFkZXIgIT09ICd1bmRlZmluZWQnO1xufVxuIiwgImltcG9ydCB7IENyZWF0ZVJlYWRhYmxlU3RyZWFtLCB0eXBlIERlZmF1bHRSZWFkYWJsZVN0cmVhbSB9IGZyb20gJy4uL3JlYWRhYmxlLXN0cmVhbSc7XG5pbXBvcnQge1xuICBpc1JlYWRhYmxlU3RyZWFtTGlrZSxcbiAgdHlwZSBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXJMaWtlLFxuICB0eXBlIFJlYWRhYmxlU3RyZWFtTGlrZVxufSBmcm9tICcuL3JlYWRhYmxlLXN0cmVhbS1saWtlJztcbmltcG9ydCB7IFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDbG9zZSwgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVucXVldWUgfSBmcm9tICcuL2RlZmF1bHQtY29udHJvbGxlcic7XG5pbXBvcnQgeyBHZXRJdGVyYXRvciwgR2V0TWV0aG9kLCBJdGVyYXRvckNvbXBsZXRlLCBJdGVyYXRvck5leHQsIEl0ZXJhdG9yVmFsdWUgfSBmcm9tICcuLi9hYnN0cmFjdC1vcHMvZWNtYXNjcmlwdCc7XG5pbXBvcnQgeyBwcm9taXNlUmVqZWN0ZWRXaXRoLCBwcm9taXNlUmVzb2x2ZWRXaXRoLCByZWZsZWN0Q2FsbCwgdHJhbnNmb3JtUHJvbWlzZVdpdGggfSBmcm9tICcuLi9oZWxwZXJzL3dlYmlkbCc7XG5pbXBvcnQgeyB0eXBlSXNPYmplY3QgfSBmcm9tICcuLi9oZWxwZXJzL21pc2NlbGxhbmVvdXMnO1xuaW1wb3J0IHsgbm9vcCB9IGZyb20gJy4uLy4uL3V0aWxzJztcblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtRnJvbTxSPihcbiAgc291cmNlOiBJdGVyYWJsZTxSPiB8IEFzeW5jSXRlcmFibGU8Uj4gfCBSZWFkYWJsZVN0cmVhbUxpa2U8Uj5cbik6IERlZmF1bHRSZWFkYWJsZVN0cmVhbTxSPiB7XG4gIGlmIChpc1JlYWRhYmxlU3RyZWFtTGlrZShzb3VyY2UpKSB7XG4gICAgcmV0dXJuIFJlYWRhYmxlU3RyZWFtRnJvbURlZmF1bHRSZWFkZXIoc291cmNlLmdldFJlYWRlcigpKTtcbiAgfVxuICByZXR1cm4gUmVhZGFibGVTdHJlYW1Gcm9tSXRlcmFibGUoc291cmNlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtRnJvbUl0ZXJhYmxlPFI+KGFzeW5jSXRlcmFibGU6IEl0ZXJhYmxlPFI+IHwgQXN5bmNJdGVyYWJsZTxSPik6IERlZmF1bHRSZWFkYWJsZVN0cmVhbTxSPiB7XG4gIGxldCBzdHJlYW06IERlZmF1bHRSZWFkYWJsZVN0cmVhbTxSPjtcbiAgY29uc3QgaXRlcmF0b3JSZWNvcmQgPSBHZXRJdGVyYXRvcihhc3luY0l0ZXJhYmxlLCAnYXN5bmMnKTtcblxuICBjb25zdCBzdGFydEFsZ29yaXRobSA9IG5vb3A7XG5cbiAgZnVuY3Rpb24gcHVsbEFsZ29yaXRobSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBsZXQgbmV4dFJlc3VsdDtcbiAgICB0cnkge1xuICAgICAgbmV4dFJlc3VsdCA9IEl0ZXJhdG9yTmV4dChpdGVyYXRvclJlY29yZCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoZSk7XG4gICAgfVxuICAgIGNvbnN0IG5leHRQcm9taXNlID0gcHJvbWlzZVJlc29sdmVkV2l0aChuZXh0UmVzdWx0KTtcbiAgICByZXR1cm4gdHJhbnNmb3JtUHJvbWlzZVdpdGgobmV4dFByb21pc2UsIGl0ZXJSZXN1bHQgPT4ge1xuICAgICAgaWYgKCF0eXBlSXNPYmplY3QoaXRlclJlc3VsdCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIHByb21pc2UgcmV0dXJuZWQgYnkgdGhlIGl0ZXJhdG9yLm5leHQoKSBtZXRob2QgbXVzdCBmdWxmaWxsIHdpdGggYW4gb2JqZWN0Jyk7XG4gICAgICB9XG4gICAgICBjb25zdCBkb25lID0gSXRlcmF0b3JDb21wbGV0ZShpdGVyUmVzdWx0KTtcbiAgICAgIGlmIChkb25lKSB7XG4gICAgICAgIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDbG9zZShzdHJlYW0uX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IEl0ZXJhdG9yVmFsdWUoaXRlclJlc3VsdCk7XG4gICAgICAgIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFbnF1ZXVlKHN0cmVhbS5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBjYW5jZWxBbGdvcml0aG0ocmVhc29uOiBhbnkpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBpdGVyYXRvciA9IGl0ZXJhdG9yUmVjb3JkLml0ZXJhdG9yO1xuICAgIGxldCByZXR1cm5NZXRob2Q6ICh0eXBlb2YgaXRlcmF0b3IpWydyZXR1cm4nXSB8IHVuZGVmaW5lZDtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuTWV0aG9kID0gR2V0TWV0aG9kKGl0ZXJhdG9yLCAncmV0dXJuJyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoZSk7XG4gICAgfVxuICAgIGlmIChyZXR1cm5NZXRob2QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZXNvbHZlZFdpdGgodW5kZWZpbmVkKTtcbiAgICB9XG4gICAgbGV0IHJldHVyblJlc3VsdDogSXRlcmF0b3JSZXN1bHQ8Uj4gfCBQcm9taXNlPEl0ZXJhdG9yUmVzdWx0PFI+PjtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuUmVzdWx0ID0gcmVmbGVjdENhbGwocmV0dXJuTWV0aG9kLCBpdGVyYXRvciwgW3JlYXNvbl0pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKGUpO1xuICAgIH1cbiAgICBjb25zdCByZXR1cm5Qcm9taXNlID0gcHJvbWlzZVJlc29sdmVkV2l0aChyZXR1cm5SZXN1bHQpO1xuICAgIHJldHVybiB0cmFuc2Zvcm1Qcm9taXNlV2l0aChyZXR1cm5Qcm9taXNlLCBpdGVyUmVzdWx0ID0+IHtcbiAgICAgIGlmICghdHlwZUlzT2JqZWN0KGl0ZXJSZXN1bHQpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBwcm9taXNlIHJldHVybmVkIGJ5IHRoZSBpdGVyYXRvci5yZXR1cm4oKSBtZXRob2QgbXVzdCBmdWxmaWxsIHdpdGggYW4gb2JqZWN0Jyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0pO1xuICB9XG5cbiAgc3RyZWFtID0gQ3JlYXRlUmVhZGFibGVTdHJlYW0oc3RhcnRBbGdvcml0aG0sIHB1bGxBbGdvcml0aG0sIGNhbmNlbEFsZ29yaXRobSwgMCk7XG4gIHJldHVybiBzdHJlYW07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZVN0cmVhbUZyb21EZWZhdWx0UmVhZGVyPFI+KFxuICByZWFkZXI6IFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlckxpa2U8Uj5cbik6IERlZmF1bHRSZWFkYWJsZVN0cmVhbTxSPiB7XG4gIGxldCBzdHJlYW06IERlZmF1bHRSZWFkYWJsZVN0cmVhbTxSPjtcblxuICBjb25zdCBzdGFydEFsZ29yaXRobSA9IG5vb3A7XG5cbiAgZnVuY3Rpb24gcHVsbEFsZ29yaXRobSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBsZXQgcmVhZFByb21pc2U7XG4gICAgdHJ5IHtcbiAgICAgIHJlYWRQcm9taXNlID0gcmVhZGVyLnJlYWQoKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChlKTtcbiAgICB9XG4gICAgcmV0dXJuIHRyYW5zZm9ybVByb21pc2VXaXRoKHJlYWRQcm9taXNlLCByZWFkUmVzdWx0ID0+IHtcbiAgICAgIGlmICghdHlwZUlzT2JqZWN0KHJlYWRSZXN1bHQpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBwcm9taXNlIHJldHVybmVkIGJ5IHRoZSByZWFkZXIucmVhZCgpIG1ldGhvZCBtdXN0IGZ1bGZpbGwgd2l0aCBhbiBvYmplY3QnKTtcbiAgICAgIH1cbiAgICAgIGlmIChyZWFkUmVzdWx0LmRvbmUpIHtcbiAgICAgICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNsb3NlKHN0cmVhbS5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gcmVhZFJlc3VsdC52YWx1ZTtcbiAgICAgICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVucXVldWUoc3RyZWFtLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIsIHZhbHVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbmNlbEFsZ29yaXRobShyZWFzb246IGFueSk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlc29sdmVkV2l0aChyZWFkZXIuY2FuY2VsKHJlYXNvbikpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKGUpO1xuICAgIH1cbiAgfVxuXG4gIHN0cmVhbSA9IENyZWF0ZVJlYWRhYmxlU3RyZWFtKHN0YXJ0QWxnb3JpdGhtLCBwdWxsQWxnb3JpdGhtLCBjYW5jZWxBbGdvcml0aG0sIDApO1xuICByZXR1cm4gc3RyZWFtO1xufVxuIiwgImltcG9ydCB7IGFzc2VydERpY3Rpb25hcnksIGFzc2VydEZ1bmN0aW9uLCBjb252ZXJ0VW5zaWduZWRMb25nTG9uZ1dpdGhFbmZvcmNlUmFuZ2UgfSBmcm9tICcuL2Jhc2ljJztcbmltcG9ydCB0eXBlIHtcbiAgUmVhZGFibGVTdHJlYW1Db250cm9sbGVyLFxuICBVbmRlcmx5aW5nQnl0ZVNvdXJjZSxcbiAgVW5kZXJseWluZ0RlZmF1bHRPckJ5dGVTb3VyY2UsXG4gIFVuZGVybHlpbmdEZWZhdWx0T3JCeXRlU291cmNlUHVsbENhbGxiYWNrLFxuICBVbmRlcmx5aW5nRGVmYXVsdE9yQnl0ZVNvdXJjZVN0YXJ0Q2FsbGJhY2ssXG4gIFVuZGVybHlpbmdTb3VyY2UsXG4gIFVuZGVybHlpbmdTb3VyY2VDYW5jZWxDYWxsYmFjayxcbiAgVmFsaWRhdGVkVW5kZXJseWluZ0RlZmF1bHRPckJ5dGVTb3VyY2Vcbn0gZnJvbSAnLi4vcmVhZGFibGUtc3RyZWFtL3VuZGVybHlpbmctc291cmNlJztcbmltcG9ydCB7IHByb21pc2VDYWxsLCByZWZsZWN0Q2FsbCB9IGZyb20gJy4uL2hlbHBlcnMvd2ViaWRsJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRVbmRlcmx5aW5nRGVmYXVsdE9yQnl0ZVNvdXJjZTxSPihcbiAgc291cmNlOiBVbmRlcmx5aW5nU291cmNlPFI+IHwgVW5kZXJseWluZ0J5dGVTb3VyY2UgfCBudWxsLFxuICBjb250ZXh0OiBzdHJpbmdcbik6IFZhbGlkYXRlZFVuZGVybHlpbmdEZWZhdWx0T3JCeXRlU291cmNlPFI+IHtcbiAgYXNzZXJ0RGljdGlvbmFyeShzb3VyY2UsIGNvbnRleHQpO1xuICBjb25zdCBvcmlnaW5hbCA9IHNvdXJjZSBhcyAoVW5kZXJseWluZ0RlZmF1bHRPckJ5dGVTb3VyY2U8Uj4gfCBudWxsKTtcbiAgY29uc3QgYXV0b0FsbG9jYXRlQ2h1bmtTaXplID0gb3JpZ2luYWw/LmF1dG9BbGxvY2F0ZUNodW5rU2l6ZTtcbiAgY29uc3QgY2FuY2VsID0gb3JpZ2luYWw/LmNhbmNlbDtcbiAgY29uc3QgcHVsbCA9IG9yaWdpbmFsPy5wdWxsO1xuICBjb25zdCBzdGFydCA9IG9yaWdpbmFsPy5zdGFydDtcbiAgY29uc3QgdHlwZSA9IG9yaWdpbmFsPy50eXBlO1xuICByZXR1cm4ge1xuICAgIGF1dG9BbGxvY2F0ZUNodW5rU2l6ZTogYXV0b0FsbG9jYXRlQ2h1bmtTaXplID09PSB1bmRlZmluZWQgP1xuICAgICAgdW5kZWZpbmVkIDpcbiAgICAgIGNvbnZlcnRVbnNpZ25lZExvbmdMb25nV2l0aEVuZm9yY2VSYW5nZShcbiAgICAgICAgYXV0b0FsbG9jYXRlQ2h1bmtTaXplLFxuICAgICAgICBgJHtjb250ZXh0fSBoYXMgbWVtYmVyICdhdXRvQWxsb2NhdGVDaHVua1NpemUnIHRoYXRgXG4gICAgICApLFxuICAgIGNhbmNlbDogY2FuY2VsID09PSB1bmRlZmluZWQgP1xuICAgICAgdW5kZWZpbmVkIDpcbiAgICAgIGNvbnZlcnRVbmRlcmx5aW5nU291cmNlQ2FuY2VsQ2FsbGJhY2soY2FuY2VsLCBvcmlnaW5hbCEsIGAke2NvbnRleHR9IGhhcyBtZW1iZXIgJ2NhbmNlbCcgdGhhdGApLFxuICAgIHB1bGw6IHB1bGwgPT09IHVuZGVmaW5lZCA/XG4gICAgICB1bmRlZmluZWQgOlxuICAgICAgY29udmVydFVuZGVybHlpbmdTb3VyY2VQdWxsQ2FsbGJhY2socHVsbCwgb3JpZ2luYWwhLCBgJHtjb250ZXh0fSBoYXMgbWVtYmVyICdwdWxsJyB0aGF0YCksXG4gICAgc3RhcnQ6IHN0YXJ0ID09PSB1bmRlZmluZWQgP1xuICAgICAgdW5kZWZpbmVkIDpcbiAgICAgIGNvbnZlcnRVbmRlcmx5aW5nU291cmNlU3RhcnRDYWxsYmFjayhzdGFydCwgb3JpZ2luYWwhLCBgJHtjb250ZXh0fSBoYXMgbWVtYmVyICdzdGFydCcgdGhhdGApLFxuICAgIHR5cGU6IHR5cGUgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZCA6IGNvbnZlcnRSZWFkYWJsZVN0cmVhbVR5cGUodHlwZSwgYCR7Y29udGV4dH0gaGFzIG1lbWJlciAndHlwZScgdGhhdGApXG4gIH07XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRVbmRlcmx5aW5nU291cmNlQ2FuY2VsQ2FsbGJhY2soXG4gIGZuOiBVbmRlcmx5aW5nU291cmNlQ2FuY2VsQ2FsbGJhY2ssXG4gIG9yaWdpbmFsOiBVbmRlcmx5aW5nRGVmYXVsdE9yQnl0ZVNvdXJjZSxcbiAgY29udGV4dDogc3RyaW5nXG4pOiAocmVhc29uOiBhbnkpID0+IFByb21pc2U8dm9pZD4ge1xuICBhc3NlcnRGdW5jdGlvbihmbiwgY29udGV4dCk7XG4gIHJldHVybiAocmVhc29uOiBhbnkpID0+IHByb21pc2VDYWxsKGZuLCBvcmlnaW5hbCwgW3JlYXNvbl0pO1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0VW5kZXJseWluZ1NvdXJjZVB1bGxDYWxsYmFjazxSPihcbiAgZm46IFVuZGVybHlpbmdEZWZhdWx0T3JCeXRlU291cmNlUHVsbENhbGxiYWNrPFI+LFxuICBvcmlnaW5hbDogVW5kZXJseWluZ0RlZmF1bHRPckJ5dGVTb3VyY2U8Uj4sXG4gIGNvbnRleHQ6IHN0cmluZ1xuKTogKGNvbnRyb2xsZXI6IFJlYWRhYmxlU3RyZWFtQ29udHJvbGxlcjxSPikgPT4gUHJvbWlzZTx2b2lkPiB7XG4gIGFzc2VydEZ1bmN0aW9uKGZuLCBjb250ZXh0KTtcbiAgcmV0dXJuIChjb250cm9sbGVyOiBSZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXI8Uj4pID0+IHByb21pc2VDYWxsKGZuLCBvcmlnaW5hbCwgW2NvbnRyb2xsZXJdKTtcbn1cblxuZnVuY3Rpb24gY29udmVydFVuZGVybHlpbmdTb3VyY2VTdGFydENhbGxiYWNrPFI+KFxuICBmbjogVW5kZXJseWluZ0RlZmF1bHRPckJ5dGVTb3VyY2VTdGFydENhbGxiYWNrPFI+LFxuICBvcmlnaW5hbDogVW5kZXJseWluZ0RlZmF1bHRPckJ5dGVTb3VyY2U8Uj4sXG4gIGNvbnRleHQ6IHN0cmluZ1xuKTogVW5kZXJseWluZ0RlZmF1bHRPckJ5dGVTb3VyY2VTdGFydENhbGxiYWNrPFI+IHtcbiAgYXNzZXJ0RnVuY3Rpb24oZm4sIGNvbnRleHQpO1xuICByZXR1cm4gKGNvbnRyb2xsZXI6IFJlYWRhYmxlU3RyZWFtQ29udHJvbGxlcjxSPikgPT4gcmVmbGVjdENhbGwoZm4sIG9yaWdpbmFsLCBbY29udHJvbGxlcl0pO1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0UmVhZGFibGVTdHJlYW1UeXBlKHR5cGU6IHN0cmluZywgY29udGV4dDogc3RyaW5nKTogJ2J5dGVzJyB7XG4gIHR5cGUgPSBgJHt0eXBlfWA7XG4gIGlmICh0eXBlICE9PSAnYnl0ZXMnKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgJHtjb250ZXh0fSAnJHt0eXBlfScgaXMgbm90IGEgdmFsaWQgZW51bWVyYXRpb24gdmFsdWUgZm9yIFJlYWRhYmxlU3RyZWFtVHlwZWApO1xuICB9XG4gIHJldHVybiB0eXBlO1xufVxuIiwgImltcG9ydCB7IGFzc2VydERpY3Rpb25hcnkgfSBmcm9tICcuL2Jhc2ljJztcbmltcG9ydCB0eXBlIHtcbiAgUmVhZGFibGVTdHJlYW1JdGVyYXRvck9wdGlvbnMsXG4gIFZhbGlkYXRlZFJlYWRhYmxlU3RyZWFtSXRlcmF0b3JPcHRpb25zXG59IGZyb20gJy4uL3JlYWRhYmxlLXN0cmVhbS9pdGVyYXRvci1vcHRpb25zJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRJdGVyYXRvck9wdGlvbnMob3B0aW9uczogUmVhZGFibGVTdHJlYW1JdGVyYXRvck9wdGlvbnMgfCBudWxsIHwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dDogc3RyaW5nKTogVmFsaWRhdGVkUmVhZGFibGVTdHJlYW1JdGVyYXRvck9wdGlvbnMge1xuICBhc3NlcnREaWN0aW9uYXJ5KG9wdGlvbnMsIGNvbnRleHQpO1xuICBjb25zdCBwcmV2ZW50Q2FuY2VsID0gb3B0aW9ucz8ucHJldmVudENhbmNlbDtcbiAgcmV0dXJuIHsgcHJldmVudENhbmNlbDogQm9vbGVhbihwcmV2ZW50Q2FuY2VsKSB9O1xufVxuIiwgImltcG9ydCB7IGFzc2VydERpY3Rpb25hcnkgfSBmcm9tICcuL2Jhc2ljJztcbmltcG9ydCB0eXBlIHsgU3RyZWFtUGlwZU9wdGlvbnMsIFZhbGlkYXRlZFN0cmVhbVBpcGVPcHRpb25zIH0gZnJvbSAnLi4vcmVhZGFibGUtc3RyZWFtL3BpcGUtb3B0aW9ucyc7XG5pbXBvcnQgeyB0eXBlIEFib3J0U2lnbmFsLCBpc0Fib3J0U2lnbmFsIH0gZnJvbSAnLi4vYWJvcnQtc2lnbmFsJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRQaXBlT3B0aW9ucyhvcHRpb25zOiBTdHJlYW1QaXBlT3B0aW9ucyB8IG51bGwgfCB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6IHN0cmluZyk6IFZhbGlkYXRlZFN0cmVhbVBpcGVPcHRpb25zIHtcbiAgYXNzZXJ0RGljdGlvbmFyeShvcHRpb25zLCBjb250ZXh0KTtcbiAgY29uc3QgcHJldmVudEFib3J0ID0gb3B0aW9ucz8ucHJldmVudEFib3J0O1xuICBjb25zdCBwcmV2ZW50Q2FuY2VsID0gb3B0aW9ucz8ucHJldmVudENhbmNlbDtcbiAgY29uc3QgcHJldmVudENsb3NlID0gb3B0aW9ucz8ucHJldmVudENsb3NlO1xuICBjb25zdCBzaWduYWwgPSBvcHRpb25zPy5zaWduYWw7XG4gIGlmIChzaWduYWwgIT09IHVuZGVmaW5lZCkge1xuICAgIGFzc2VydEFib3J0U2lnbmFsKHNpZ25hbCwgYCR7Y29udGV4dH0gaGFzIG1lbWJlciAnc2lnbmFsJyB0aGF0YCk7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBwcmV2ZW50QWJvcnQ6IEJvb2xlYW4ocHJldmVudEFib3J0KSxcbiAgICBwcmV2ZW50Q2FuY2VsOiBCb29sZWFuKHByZXZlbnRDYW5jZWwpLFxuICAgIHByZXZlbnRDbG9zZTogQm9vbGVhbihwcmV2ZW50Q2xvc2UpLFxuICAgIHNpZ25hbFxuICB9O1xufVxuXG5mdW5jdGlvbiBhc3NlcnRBYm9ydFNpZ25hbChzaWduYWw6IHVua25vd24sIGNvbnRleHQ6IHN0cmluZyk6IGFzc2VydHMgc2lnbmFsIGlzIEFib3J0U2lnbmFsIHtcbiAgaWYgKCFpc0Fib3J0U2lnbmFsKHNpZ25hbCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGAke2NvbnRleHR9IGlzIG5vdCBhbiBBYm9ydFNpZ25hbC5gKTtcbiAgfVxufVxuIiwgImltcG9ydCB7IGFzc2VydERpY3Rpb25hcnksIGFzc2VydFJlcXVpcmVkRmllbGQgfSBmcm9tICcuL2Jhc2ljJztcbmltcG9ydCB7IFJlYWRhYmxlU3RyZWFtIH0gZnJvbSAnLi4vcmVhZGFibGUtc3RyZWFtJztcbmltcG9ydCB7IFdyaXRhYmxlU3RyZWFtIH0gZnJvbSAnLi4vd3JpdGFibGUtc3RyZWFtJztcbmltcG9ydCB7IGFzc2VydFJlYWRhYmxlU3RyZWFtIH0gZnJvbSAnLi9yZWFkYWJsZS1zdHJlYW0nO1xuaW1wb3J0IHsgYXNzZXJ0V3JpdGFibGVTdHJlYW0gfSBmcm9tICcuL3dyaXRhYmxlLXN0cmVhbSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0UmVhZGFibGVXcml0YWJsZVBhaXI8UlMgZXh0ZW5kcyBSZWFkYWJsZVN0cmVhbSwgV1MgZXh0ZW5kcyBXcml0YWJsZVN0cmVhbT4oXG4gIHBhaXI6IHsgcmVhZGFibGU6IFJTOyB3cml0YWJsZTogV1MgfSB8IG51bGwgfCB1bmRlZmluZWQsXG4gIGNvbnRleHQ6IHN0cmluZ1xuKTogeyByZWFkYWJsZTogUlM7IHdyaXRhYmxlOiBXUyB9IHtcbiAgYXNzZXJ0RGljdGlvbmFyeShwYWlyLCBjb250ZXh0KTtcblxuICBjb25zdCByZWFkYWJsZSA9IHBhaXI/LnJlYWRhYmxlO1xuICBhc3NlcnRSZXF1aXJlZEZpZWxkKHJlYWRhYmxlLCAncmVhZGFibGUnLCAnUmVhZGFibGVXcml0YWJsZVBhaXInKTtcbiAgYXNzZXJ0UmVhZGFibGVTdHJlYW0ocmVhZGFibGUsIGAke2NvbnRleHR9IGhhcyBtZW1iZXIgJ3JlYWRhYmxlJyB0aGF0YCk7XG5cbiAgY29uc3Qgd3JpdGFibGUgPSBwYWlyPy53cml0YWJsZTtcbiAgYXNzZXJ0UmVxdWlyZWRGaWVsZCh3cml0YWJsZSwgJ3dyaXRhYmxlJywgJ1JlYWRhYmxlV3JpdGFibGVQYWlyJyk7XG4gIGFzc2VydFdyaXRhYmxlU3RyZWFtKHdyaXRhYmxlLCBgJHtjb250ZXh0fSBoYXMgbWVtYmVyICd3cml0YWJsZScgdGhhdGApO1xuXG4gIHJldHVybiB7IHJlYWRhYmxlLCB3cml0YWJsZSB9O1xufVxuIiwgImltcG9ydCBhc3NlcnQgZnJvbSAnLi4vc3R1Yi9hc3NlcnQnO1xuaW1wb3J0IHtcbiAgcHJvbWlzZVJlamVjdGVkV2l0aCxcbiAgcHJvbWlzZVJlc29sdmVkV2l0aCxcbiAgc2V0UHJvbWlzZUlzSGFuZGxlZFRvVHJ1ZSxcbiAgdHJhbnNmb3JtUHJvbWlzZVdpdGhcbn0gZnJvbSAnLi9oZWxwZXJzL3dlYmlkbCc7XG5pbXBvcnQgdHlwZSB7IFF1ZXVpbmdTdHJhdGVneSwgUXVldWluZ1N0cmF0ZWd5U2l6ZUNhbGxiYWNrIH0gZnJvbSAnLi9xdWV1aW5nLXN0cmF0ZWd5JztcbmltcG9ydCB7IEFjcXVpcmVSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3IsIHR5cGUgUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9yIH0gZnJvbSAnLi9yZWFkYWJsZS1zdHJlYW0vYXN5bmMtaXRlcmF0b3InO1xuaW1wb3J0IHsgZGVmYXVsdFJlYWRlckNsb3NlZFByb21pc2VSZWplY3QsIGRlZmF1bHRSZWFkZXJDbG9zZWRQcm9taXNlUmVzb2x2ZSB9IGZyb20gJy4vcmVhZGFibGUtc3RyZWFtL2dlbmVyaWMtcmVhZGVyJztcbmltcG9ydCB7XG4gIEFjcXVpcmVSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXIsXG4gIElzUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyLFxuICBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXIsXG4gIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlckVycm9yUmVhZFJlcXVlc3RzLFxuICB0eXBlIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRSZXN1bHRcbn0gZnJvbSAnLi9yZWFkYWJsZS1zdHJlYW0vZGVmYXVsdC1yZWFkZXInO1xuaW1wb3J0IHtcbiAgQWNxdWlyZVJlYWRhYmxlU3RyZWFtQllPQlJlYWRlcixcbiAgSXNSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIsXG4gIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlcixcbiAgUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyRXJyb3JSZWFkSW50b1JlcXVlc3RzLFxuICB0eXBlIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRSZXN1bHRcbn0gZnJvbSAnLi9yZWFkYWJsZS1zdHJlYW0vYnlvYi1yZWFkZXInO1xuaW1wb3J0IHsgUmVhZGFibGVTdHJlYW1QaXBlVG8gfSBmcm9tICcuL3JlYWRhYmxlLXN0cmVhbS9waXBlJztcbmltcG9ydCB7IFJlYWRhYmxlU3RyZWFtVGVlIH0gZnJvbSAnLi9yZWFkYWJsZS1zdHJlYW0vdGVlJztcbmltcG9ydCB7IFJlYWRhYmxlU3RyZWFtRnJvbSB9IGZyb20gJy4vcmVhZGFibGUtc3RyZWFtL2Zyb20nO1xuaW1wb3J0IHsgSXNXcml0YWJsZVN0cmVhbSwgSXNXcml0YWJsZVN0cmVhbUxvY2tlZCwgV3JpdGFibGVTdHJlYW0gfSBmcm9tICcuL3dyaXRhYmxlLXN0cmVhbSc7XG5pbXBvcnQgeyBTaW1wbGVRdWV1ZSB9IGZyb20gJy4vc2ltcGxlLXF1ZXVlJztcbmltcG9ydCB7XG4gIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIsXG4gIFJlYWRhYmxlU3RyZWFtQllPQlJlcXVlc3QsXG4gIFNldFVwUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcixcbiAgU2V0VXBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRnJvbVVuZGVybHlpbmdTb3VyY2Vcbn0gZnJvbSAnLi9yZWFkYWJsZS1zdHJlYW0vYnl0ZS1zdHJlYW0tY29udHJvbGxlcic7XG5pbXBvcnQge1xuICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyLFxuICBTZXRVcFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIsXG4gIFNldFVwUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckZyb21VbmRlcmx5aW5nU291cmNlXG59IGZyb20gJy4vcmVhZGFibGUtc3RyZWFtL2RlZmF1bHQtY29udHJvbGxlcic7XG5pbXBvcnQgdHlwZSB7XG4gIFVuZGVybHlpbmdCeXRlU291cmNlLFxuICBVbmRlcmx5aW5nQnl0ZVNvdXJjZVB1bGxDYWxsYmFjayxcbiAgVW5kZXJseWluZ0J5dGVTb3VyY2VTdGFydENhbGxiYWNrLFxuICBVbmRlcmx5aW5nU291cmNlLFxuICBVbmRlcmx5aW5nU291cmNlQ2FuY2VsQ2FsbGJhY2ssXG4gIFVuZGVybHlpbmdTb3VyY2VQdWxsQ2FsbGJhY2ssXG4gIFVuZGVybHlpbmdTb3VyY2VTdGFydENhbGxiYWNrXG59IGZyb20gJy4vcmVhZGFibGUtc3RyZWFtL3VuZGVybHlpbmctc291cmNlJztcbmltcG9ydCB7IG5vb3AgfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgeyBzZXRGdW5jdGlvbk5hbWUsIHR5cGVJc09iamVjdCB9IGZyb20gJy4vaGVscGVycy9taXNjZWxsYW5lb3VzJztcbmltcG9ydCB7IENyZWF0ZUFycmF5RnJvbUxpc3QsIFN5bWJvbEFzeW5jSXRlcmF0b3IgfSBmcm9tICcuL2Fic3RyYWN0LW9wcy9lY21hc2NyaXB0JztcbmltcG9ydCB7IENhbmNlbFN0ZXBzIH0gZnJvbSAnLi9hYnN0cmFjdC1vcHMvaW50ZXJuYWwtbWV0aG9kcyc7XG5pbXBvcnQgeyBJc05vbk5lZ2F0aXZlTnVtYmVyIH0gZnJvbSAnLi9hYnN0cmFjdC1vcHMvbWlzY2VsbGFuZW91cyc7XG5pbXBvcnQgeyBhc3NlcnRPYmplY3QsIGFzc2VydFJlcXVpcmVkQXJndW1lbnQgfSBmcm9tICcuL3ZhbGlkYXRvcnMvYmFzaWMnO1xuaW1wb3J0IHsgY29udmVydFF1ZXVpbmdTdHJhdGVneSB9IGZyb20gJy4vdmFsaWRhdG9ycy9xdWV1aW5nLXN0cmF0ZWd5JztcbmltcG9ydCB7IEV4dHJhY3RIaWdoV2F0ZXJNYXJrLCBFeHRyYWN0U2l6ZUFsZ29yaXRobSB9IGZyb20gJy4vYWJzdHJhY3Qtb3BzL3F1ZXVpbmctc3RyYXRlZ3knO1xuaW1wb3J0IHsgY29udmVydFVuZGVybHlpbmdEZWZhdWx0T3JCeXRlU291cmNlIH0gZnJvbSAnLi92YWxpZGF0b3JzL3VuZGVybHlpbmctc291cmNlJztcbmltcG9ydCB0eXBlIHtcbiAgUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyUmVhZE9wdGlvbnMsXG4gIFJlYWRhYmxlU3RyZWFtR2V0UmVhZGVyT3B0aW9uc1xufSBmcm9tICcuL3JlYWRhYmxlLXN0cmVhbS9yZWFkZXItb3B0aW9ucyc7XG5pbXBvcnQgeyBjb252ZXJ0UmVhZGVyT3B0aW9ucyB9IGZyb20gJy4vdmFsaWRhdG9ycy9yZWFkZXItb3B0aW9ucyc7XG5pbXBvcnQgdHlwZSB7IFN0cmVhbVBpcGVPcHRpb25zLCBWYWxpZGF0ZWRTdHJlYW1QaXBlT3B0aW9ucyB9IGZyb20gJy4vcmVhZGFibGUtc3RyZWFtL3BpcGUtb3B0aW9ucyc7XG5pbXBvcnQgdHlwZSB7IFJlYWRhYmxlU3RyZWFtSXRlcmF0b3JPcHRpb25zIH0gZnJvbSAnLi9yZWFkYWJsZS1zdHJlYW0vaXRlcmF0b3Itb3B0aW9ucyc7XG5pbXBvcnQgeyBjb252ZXJ0SXRlcmF0b3JPcHRpb25zIH0gZnJvbSAnLi92YWxpZGF0b3JzL2l0ZXJhdG9yLW9wdGlvbnMnO1xuaW1wb3J0IHsgY29udmVydFBpcGVPcHRpb25zIH0gZnJvbSAnLi92YWxpZGF0b3JzL3BpcGUtb3B0aW9ucyc7XG5pbXBvcnQgdHlwZSB7IFJlYWRhYmxlV3JpdGFibGVQYWlyIH0gZnJvbSAnLi9yZWFkYWJsZS1zdHJlYW0vcmVhZGFibGUtd3JpdGFibGUtcGFpcic7XG5pbXBvcnQgeyBjb252ZXJ0UmVhZGFibGVXcml0YWJsZVBhaXIgfSBmcm9tICcuL3ZhbGlkYXRvcnMvcmVhZGFibGUtd3JpdGFibGUtcGFpcic7XG5pbXBvcnQgdHlwZSB7IFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlckxpa2UsIFJlYWRhYmxlU3RyZWFtTGlrZSB9IGZyb20gJy4vcmVhZGFibGUtc3RyZWFtL3JlYWRhYmxlLXN0cmVhbS1saWtlJztcbmltcG9ydCB0eXBlIHsgTm9uU2hhcmVkIH0gZnJvbSAnLi9oZWxwZXJzL2FycmF5LWJ1ZmZlci12aWV3JztcblxuZXhwb3J0IHR5cGUgRGVmYXVsdFJlYWRhYmxlU3RyZWFtPFIgPSBhbnk+ID0gUmVhZGFibGVTdHJlYW08Uj4gJiB7XG4gIF9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXI6IFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8Uj5cbn07XG5cbmV4cG9ydCB0eXBlIFJlYWRhYmxlQnl0ZVN0cmVhbSA9IFJlYWRhYmxlU3RyZWFtPE5vblNoYXJlZDxVaW50OEFycmF5Pj4gJiB7XG4gIF9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXI6IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJcbn07XG5cbnR5cGUgUmVhZGFibGVTdHJlYW1TdGF0ZSA9ICdyZWFkYWJsZScgfCAnY2xvc2VkJyB8ICdlcnJvcmVkJztcblxuLyoqXG4gKiBBIHJlYWRhYmxlIHN0cmVhbSByZXByZXNlbnRzIGEgc291cmNlIG9mIGRhdGEsIGZyb20gd2hpY2ggeW91IGNhbiByZWFkLlxuICpcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNsYXNzIFJlYWRhYmxlU3RyZWFtPFIgPSBhbnk+IGltcGxlbWVudHMgQXN5bmNJdGVyYWJsZTxSPiB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3N0YXRlITogUmVhZGFibGVTdHJlYW1TdGF0ZTtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcmVhZGVyOiBSZWFkYWJsZVN0cmVhbVJlYWRlcjxSPiB8IHVuZGVmaW5lZDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfc3RvcmVkRXJyb3I6IGFueTtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfZGlzdHVyYmVkITogYm9vbGVhbjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcmVhZGFibGVTdHJlYW1Db250cm9sbGVyITogUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxSPiB8IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXI7XG5cbiAgY29uc3RydWN0b3IodW5kZXJseWluZ1NvdXJjZTogVW5kZXJseWluZ0J5dGVTb3VyY2UsIHN0cmF0ZWd5PzogeyBoaWdoV2F0ZXJNYXJrPzogbnVtYmVyOyBzaXplPzogdW5kZWZpbmVkIH0pO1xuICBjb25zdHJ1Y3Rvcih1bmRlcmx5aW5nU291cmNlPzogVW5kZXJseWluZ1NvdXJjZTxSPiwgc3RyYXRlZ3k/OiBRdWV1aW5nU3RyYXRlZ3k8Uj4pO1xuICBjb25zdHJ1Y3RvcihyYXdVbmRlcmx5aW5nU291cmNlOiBVbmRlcmx5aW5nU291cmNlPFI+IHwgVW5kZXJseWluZ0J5dGVTb3VyY2UgfCBudWxsIHwgdW5kZWZpbmVkID0ge30sXG4gICAgICAgICAgICAgIHJhd1N0cmF0ZWd5OiBRdWV1aW5nU3RyYXRlZ3k8Uj4gfCBudWxsIHwgdW5kZWZpbmVkID0ge30pIHtcbiAgICBpZiAocmF3VW5kZXJseWluZ1NvdXJjZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByYXdVbmRlcmx5aW5nU291cmNlID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgYXNzZXJ0T2JqZWN0KHJhd1VuZGVybHlpbmdTb3VyY2UsICdGaXJzdCBwYXJhbWV0ZXInKTtcbiAgICB9XG5cbiAgICBjb25zdCBzdHJhdGVneSA9IGNvbnZlcnRRdWV1aW5nU3RyYXRlZ3kocmF3U3RyYXRlZ3ksICdTZWNvbmQgcGFyYW1ldGVyJyk7XG4gICAgY29uc3QgdW5kZXJseWluZ1NvdXJjZSA9IGNvbnZlcnRVbmRlcmx5aW5nRGVmYXVsdE9yQnl0ZVNvdXJjZShyYXdVbmRlcmx5aW5nU291cmNlLCAnRmlyc3QgcGFyYW1ldGVyJyk7XG5cbiAgICBJbml0aWFsaXplUmVhZGFibGVTdHJlYW0odGhpcyk7XG5cbiAgICBpZiAodW5kZXJseWluZ1NvdXJjZS50eXBlID09PSAnYnl0ZXMnKSB7XG4gICAgICBpZiAoc3RyYXRlZ3kuc2l6ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdUaGUgc3RyYXRlZ3kgZm9yIGEgYnl0ZSBzdHJlYW0gY2Fubm90IGhhdmUgYSBzaXplIGZ1bmN0aW9uJyk7XG4gICAgICB9XG4gICAgICBjb25zdCBoaWdoV2F0ZXJNYXJrID0gRXh0cmFjdEhpZ2hXYXRlck1hcmsoc3RyYXRlZ3ksIDApO1xuICAgICAgU2V0VXBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRnJvbVVuZGVybHlpbmdTb3VyY2UoXG4gICAgICAgIHRoaXMgYXMgdW5rbm93biBhcyBSZWFkYWJsZUJ5dGVTdHJlYW0sXG4gICAgICAgIHVuZGVybHlpbmdTb3VyY2UsXG4gICAgICAgIGhpZ2hXYXRlck1hcmtcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFzc2VydCh1bmRlcmx5aW5nU291cmNlLnR5cGUgPT09IHVuZGVmaW5lZCk7XG4gICAgICBjb25zdCBzaXplQWxnb3JpdGhtID0gRXh0cmFjdFNpemVBbGdvcml0aG0oc3RyYXRlZ3kpO1xuICAgICAgY29uc3QgaGlnaFdhdGVyTWFyayA9IEV4dHJhY3RIaWdoV2F0ZXJNYXJrKHN0cmF0ZWd5LCAxKTtcbiAgICAgIFNldFVwUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckZyb21VbmRlcmx5aW5nU291cmNlKFxuICAgICAgICB0aGlzLFxuICAgICAgICB1bmRlcmx5aW5nU291cmNlLFxuICAgICAgICBoaWdoV2F0ZXJNYXJrLFxuICAgICAgICBzaXplQWxnb3JpdGhtXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIG9yIG5vdCB0aGUgcmVhZGFibGUgc3RyZWFtIGlzIGxvY2tlZCB0byBhIHtAbGluayBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXIgfCByZWFkZXJ9LlxuICAgKi9cbiAgZ2V0IGxvY2tlZCgpOiBib29sZWFuIHtcbiAgICBpZiAoIUlzUmVhZGFibGVTdHJlYW0odGhpcykpIHtcbiAgICAgIHRocm93IHN0cmVhbUJyYW5kQ2hlY2tFeGNlcHRpb24oJ2xvY2tlZCcpO1xuICAgIH1cblxuICAgIHJldHVybiBJc1JlYWRhYmxlU3RyZWFtTG9ja2VkKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbmNlbHMgdGhlIHN0cmVhbSwgc2lnbmFsaW5nIGEgbG9zcyBvZiBpbnRlcmVzdCBpbiB0aGUgc3RyZWFtIGJ5IGEgY29uc3VtZXIuXG4gICAqXG4gICAqIFRoZSBzdXBwbGllZCBgcmVhc29uYCBhcmd1bWVudCB3aWxsIGJlIGdpdmVuIHRvIHRoZSB1bmRlcmx5aW5nIHNvdXJjZSdzIHtAbGluayBVbmRlcmx5aW5nU291cmNlLmNhbmNlbCB8IGNhbmNlbCgpfVxuICAgKiBtZXRob2QsIHdoaWNoIG1pZ2h0IG9yIG1pZ2h0IG5vdCB1c2UgaXQuXG4gICAqL1xuICBjYW5jZWwocmVhc29uOiBhbnkgPSB1bmRlZmluZWQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIUlzUmVhZGFibGVTdHJlYW0odGhpcykpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKHN0cmVhbUJyYW5kQ2hlY2tFeGNlcHRpb24oJ2NhbmNlbCcpKTtcbiAgICB9XG5cbiAgICBpZiAoSXNSZWFkYWJsZVN0cmVhbUxvY2tlZCh0aGlzKSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgobmV3IFR5cGVFcnJvcignQ2Fubm90IGNhbmNlbCBhIHN0cmVhbSB0aGF0IGFscmVhZHkgaGFzIGEgcmVhZGVyJykpO1xuICAgIH1cblxuICAgIHJldHVybiBSZWFkYWJsZVN0cmVhbUNhbmNlbCh0aGlzLCByZWFzb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSB7QGxpbmsgUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyfSBhbmQgbG9ja3MgdGhlIHN0cmVhbSB0byB0aGUgbmV3IHJlYWRlci5cbiAgICpcbiAgICogVGhpcyBjYWxsIGJlaGF2ZXMgdGhlIHNhbWUgd2F5IGFzIHRoZSBuby1hcmd1bWVudCB2YXJpYW50LCBleGNlcHQgdGhhdCBpdCBvbmx5IHdvcmtzIG9uIHJlYWRhYmxlIGJ5dGUgc3RyZWFtcyxcbiAgICogaS5lLiBzdHJlYW1zIHdoaWNoIHdlcmUgY29uc3RydWN0ZWQgc3BlY2lmaWNhbGx5IHdpdGggdGhlIGFiaWxpdHkgdG8gaGFuZGxlIFwiYnJpbmcgeW91ciBvd24gYnVmZmVyXCIgcmVhZGluZy5cbiAgICogVGhlIHJldHVybmVkIEJZT0IgcmVhZGVyIHByb3ZpZGVzIHRoZSBhYmlsaXR5IHRvIGRpcmVjdGx5IHJlYWQgaW5kaXZpZHVhbCBjaHVua3MgZnJvbSB0aGUgc3RyZWFtIHZpYSBpdHNcbiAgICoge0BsaW5rIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlci5yZWFkIHwgcmVhZCgpfSBtZXRob2QsIGludG8gZGV2ZWxvcGVyLXN1cHBsaWVkIGJ1ZmZlcnMsIGFsbG93aW5nIG1vcmUgcHJlY2lzZVxuICAgKiBjb250cm9sIG92ZXIgYWxsb2NhdGlvbi5cbiAgICovXG4gIGdldFJlYWRlcih7IG1vZGUgfTogeyBtb2RlOiAnYnlvYicgfSk6IFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlcjtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSB7QGxpbmsgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyfSBhbmQgbG9ja3MgdGhlIHN0cmVhbSB0byB0aGUgbmV3IHJlYWRlci5cbiAgICogV2hpbGUgdGhlIHN0cmVhbSBpcyBsb2NrZWQsIG5vIG90aGVyIHJlYWRlciBjYW4gYmUgYWNxdWlyZWQgdW50aWwgdGhpcyBvbmUgaXMgcmVsZWFzZWQuXG4gICAqXG4gICAqIFRoaXMgZnVuY3Rpb25hbGl0eSBpcyBlc3BlY2lhbGx5IHVzZWZ1bCBmb3IgY3JlYXRpbmcgYWJzdHJhY3Rpb25zIHRoYXQgZGVzaXJlIHRoZSBhYmlsaXR5IHRvIGNvbnN1bWUgYSBzdHJlYW1cbiAgICogaW4gaXRzIGVudGlyZXR5LiBCeSBnZXR0aW5nIGEgcmVhZGVyIGZvciB0aGUgc3RyZWFtLCB5b3UgY2FuIGVuc3VyZSBub2JvZHkgZWxzZSBjYW4gaW50ZXJsZWF2ZSByZWFkcyB3aXRoIHlvdXJzXG4gICAqIG9yIGNhbmNlbCB0aGUgc3RyZWFtLCB3aGljaCB3b3VsZCBpbnRlcmZlcmUgd2l0aCB5b3VyIGFic3RyYWN0aW9uLlxuICAgKi9cbiAgZ2V0UmVhZGVyKCk6IFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcjxSPjtcbiAgZ2V0UmVhZGVyKFxuICAgIHJhd09wdGlvbnM6IFJlYWRhYmxlU3RyZWFtR2V0UmVhZGVyT3B0aW9ucyB8IG51bGwgfCB1bmRlZmluZWQgPSB1bmRlZmluZWRcbiAgKTogUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyPFI+IHwgUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyIHtcbiAgICBpZiAoIUlzUmVhZGFibGVTdHJlYW0odGhpcykpIHtcbiAgICAgIHRocm93IHN0cmVhbUJyYW5kQ2hlY2tFeGNlcHRpb24oJ2dldFJlYWRlcicpO1xuICAgIH1cblxuICAgIGNvbnN0IG9wdGlvbnMgPSBjb252ZXJ0UmVhZGVyT3B0aW9ucyhyYXdPcHRpb25zLCAnRmlyc3QgcGFyYW1ldGVyJyk7XG5cbiAgICBpZiAob3B0aW9ucy5tb2RlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBBY3F1aXJlUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyKHRoaXMpO1xuICAgIH1cblxuICAgIGFzc2VydChvcHRpb25zLm1vZGUgPT09ICdieW9iJyk7XG4gICAgcmV0dXJuIEFjcXVpcmVSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIodGhpcyBhcyB1bmtub3duIGFzIFJlYWRhYmxlQnl0ZVN0cmVhbSk7XG4gIH1cblxuICAvKipcbiAgICogUHJvdmlkZXMgYSBjb252ZW5pZW50LCBjaGFpbmFibGUgd2F5IG9mIHBpcGluZyB0aGlzIHJlYWRhYmxlIHN0cmVhbSB0aHJvdWdoIGEgdHJhbnNmb3JtIHN0cmVhbVxuICAgKiAob3IgYW55IG90aGVyIGB7IHdyaXRhYmxlLCByZWFkYWJsZSB9YCBwYWlyKS4gSXQgc2ltcGx5IHtAbGluayBSZWFkYWJsZVN0cmVhbS5waXBlVG8gfCBwaXBlc30gdGhlIHN0cmVhbVxuICAgKiBpbnRvIHRoZSB3cml0YWJsZSBzaWRlIG9mIHRoZSBzdXBwbGllZCBwYWlyLCBhbmQgcmV0dXJucyB0aGUgcmVhZGFibGUgc2lkZSBmb3IgZnVydGhlciB1c2UuXG4gICAqXG4gICAqIFBpcGluZyBhIHN0cmVhbSB3aWxsIGxvY2sgaXQgZm9yIHRoZSBkdXJhdGlvbiBvZiB0aGUgcGlwZSwgcHJldmVudGluZyBhbnkgb3RoZXIgY29uc3VtZXIgZnJvbSBhY3F1aXJpbmcgYSByZWFkZXIuXG4gICAqL1xuICBwaXBlVGhyb3VnaDxSUyBleHRlbmRzIFJlYWRhYmxlU3RyZWFtPihcbiAgICB0cmFuc2Zvcm06IHsgcmVhZGFibGU6IFJTOyB3cml0YWJsZTogV3JpdGFibGVTdHJlYW08Uj4gfSxcbiAgICBvcHRpb25zPzogU3RyZWFtUGlwZU9wdGlvbnNcbiAgKTogUlM7XG4gIHBpcGVUaHJvdWdoPFJTIGV4dGVuZHMgUmVhZGFibGVTdHJlYW0+KFxuICAgIHJhd1RyYW5zZm9ybTogeyByZWFkYWJsZTogUlM7IHdyaXRhYmxlOiBXcml0YWJsZVN0cmVhbTxSPiB9IHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgICByYXdPcHRpb25zOiBTdHJlYW1QaXBlT3B0aW9ucyB8IG51bGwgfCB1bmRlZmluZWQgPSB7fVxuICApOiBSUyB7XG4gICAgaWYgKCFJc1JlYWRhYmxlU3RyZWFtKHRoaXMpKSB7XG4gICAgICB0aHJvdyBzdHJlYW1CcmFuZENoZWNrRXhjZXB0aW9uKCdwaXBlVGhyb3VnaCcpO1xuICAgIH1cbiAgICBhc3NlcnRSZXF1aXJlZEFyZ3VtZW50KHJhd1RyYW5zZm9ybSwgMSwgJ3BpcGVUaHJvdWdoJyk7XG5cbiAgICBjb25zdCB0cmFuc2Zvcm0gPSBjb252ZXJ0UmVhZGFibGVXcml0YWJsZVBhaXIocmF3VHJhbnNmb3JtLCAnRmlyc3QgcGFyYW1ldGVyJyk7XG4gICAgY29uc3Qgb3B0aW9ucyA9IGNvbnZlcnRQaXBlT3B0aW9ucyhyYXdPcHRpb25zLCAnU2Vjb25kIHBhcmFtZXRlcicpO1xuXG4gICAgaWYgKElzUmVhZGFibGVTdHJlYW1Mb2NrZWQodGhpcykpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1JlYWRhYmxlU3RyZWFtLnByb3RvdHlwZS5waXBlVGhyb3VnaCBjYW5ub3QgYmUgdXNlZCBvbiBhIGxvY2tlZCBSZWFkYWJsZVN0cmVhbScpO1xuICAgIH1cbiAgICBpZiAoSXNXcml0YWJsZVN0cmVhbUxvY2tlZCh0cmFuc2Zvcm0ud3JpdGFibGUpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdSZWFkYWJsZVN0cmVhbS5wcm90b3R5cGUucGlwZVRocm91Z2ggY2Fubm90IGJlIHVzZWQgb24gYSBsb2NrZWQgV3JpdGFibGVTdHJlYW0nKTtcbiAgICB9XG5cbiAgICBjb25zdCBwcm9taXNlID0gUmVhZGFibGVTdHJlYW1QaXBlVG8oXG4gICAgICB0aGlzLCB0cmFuc2Zvcm0ud3JpdGFibGUsIG9wdGlvbnMucHJldmVudENsb3NlLCBvcHRpb25zLnByZXZlbnRBYm9ydCwgb3B0aW9ucy5wcmV2ZW50Q2FuY2VsLCBvcHRpb25zLnNpZ25hbFxuICAgICk7XG5cbiAgICBzZXRQcm9taXNlSXNIYW5kbGVkVG9UcnVlKHByb21pc2UpO1xuXG4gICAgcmV0dXJuIHRyYW5zZm9ybS5yZWFkYWJsZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQaXBlcyB0aGlzIHJlYWRhYmxlIHN0cmVhbSB0byBhIGdpdmVuIHdyaXRhYmxlIHN0cmVhbS4gVGhlIHdheSBpbiB3aGljaCB0aGUgcGlwaW5nIHByb2Nlc3MgYmVoYXZlcyB1bmRlclxuICAgKiB2YXJpb3VzIGVycm9yIGNvbmRpdGlvbnMgY2FuIGJlIGN1c3RvbWl6ZWQgd2l0aCBhIG51bWJlciBvZiBwYXNzZWQgb3B0aW9ucy4gSXQgcmV0dXJucyBhIHByb21pc2UgdGhhdCBmdWxmaWxsc1xuICAgKiB3aGVuIHRoZSBwaXBpbmcgcHJvY2VzcyBjb21wbGV0ZXMgc3VjY2Vzc2Z1bGx5LCBvciByZWplY3RzIGlmIGFueSBlcnJvcnMgd2VyZSBlbmNvdW50ZXJlZC5cbiAgICpcbiAgICogUGlwaW5nIGEgc3RyZWFtIHdpbGwgbG9jayBpdCBmb3IgdGhlIGR1cmF0aW9uIG9mIHRoZSBwaXBlLCBwcmV2ZW50aW5nIGFueSBvdGhlciBjb25zdW1lciBmcm9tIGFjcXVpcmluZyBhIHJlYWRlci5cbiAgICovXG4gIHBpcGVUbyhkZXN0aW5hdGlvbjogV3JpdGFibGVTdHJlYW08Uj4sIG9wdGlvbnM/OiBTdHJlYW1QaXBlT3B0aW9ucyk6IFByb21pc2U8dm9pZD47XG4gIHBpcGVUbyhkZXN0aW5hdGlvbjogV3JpdGFibGVTdHJlYW08Uj4gfCBudWxsIHwgdW5kZWZpbmVkLFxuICAgICAgICAgcmF3T3B0aW9uczogU3RyZWFtUGlwZU9wdGlvbnMgfCBudWxsIHwgdW5kZWZpbmVkID0ge30pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIUlzUmVhZGFibGVTdHJlYW0odGhpcykpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKHN0cmVhbUJyYW5kQ2hlY2tFeGNlcHRpb24oJ3BpcGVUbycpKTtcbiAgICB9XG5cbiAgICBpZiAoZGVzdGluYXRpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoYFBhcmFtZXRlciAxIGlzIHJlcXVpcmVkIGluICdwaXBlVG8nLmApO1xuICAgIH1cbiAgICBpZiAoIUlzV3JpdGFibGVTdHJlYW0oZGVzdGluYXRpb24pKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChcbiAgICAgICAgbmV3IFR5cGVFcnJvcihgUmVhZGFibGVTdHJlYW0ucHJvdG90eXBlLnBpcGVUbydzIGZpcnN0IGFyZ3VtZW50IG11c3QgYmUgYSBXcml0YWJsZVN0cmVhbWApXG4gICAgICApO1xuICAgIH1cblxuICAgIGxldCBvcHRpb25zOiBWYWxpZGF0ZWRTdHJlYW1QaXBlT3B0aW9ucztcbiAgICB0cnkge1xuICAgICAgb3B0aW9ucyA9IGNvbnZlcnRQaXBlT3B0aW9ucyhyYXdPcHRpb25zLCAnU2Vjb25kIHBhcmFtZXRlcicpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKGUpO1xuICAgIH1cblxuICAgIGlmIChJc1JlYWRhYmxlU3RyZWFtTG9ja2VkKHRoaXMpKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChcbiAgICAgICAgbmV3IFR5cGVFcnJvcignUmVhZGFibGVTdHJlYW0ucHJvdG90eXBlLnBpcGVUbyBjYW5ub3QgYmUgdXNlZCBvbiBhIGxvY2tlZCBSZWFkYWJsZVN0cmVhbScpXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAoSXNXcml0YWJsZVN0cmVhbUxvY2tlZChkZXN0aW5hdGlvbikpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKFxuICAgICAgICBuZXcgVHlwZUVycm9yKCdSZWFkYWJsZVN0cmVhbS5wcm90b3R5cGUucGlwZVRvIGNhbm5vdCBiZSB1c2VkIG9uIGEgbG9ja2VkIFdyaXRhYmxlU3RyZWFtJylcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFJlYWRhYmxlU3RyZWFtUGlwZVRvPFI+KFxuICAgICAgdGhpcywgZGVzdGluYXRpb24sIG9wdGlvbnMucHJldmVudENsb3NlLCBvcHRpb25zLnByZXZlbnRBYm9ydCwgb3B0aW9ucy5wcmV2ZW50Q2FuY2VsLCBvcHRpb25zLnNpZ25hbFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogVGVlcyB0aGlzIHJlYWRhYmxlIHN0cmVhbSwgcmV0dXJuaW5nIGEgdHdvLWVsZW1lbnQgYXJyYXkgY29udGFpbmluZyB0aGUgdHdvIHJlc3VsdGluZyBicmFuY2hlcyBhc1xuICAgKiBuZXcge0BsaW5rIFJlYWRhYmxlU3RyZWFtfSBpbnN0YW5jZXMuXG4gICAqXG4gICAqIFRlZWluZyBhIHN0cmVhbSB3aWxsIGxvY2sgaXQsIHByZXZlbnRpbmcgYW55IG90aGVyIGNvbnN1bWVyIGZyb20gYWNxdWlyaW5nIGEgcmVhZGVyLlxuICAgKiBUbyBjYW5jZWwgdGhlIHN0cmVhbSwgY2FuY2VsIGJvdGggb2YgdGhlIHJlc3VsdGluZyBicmFuY2hlczsgYSBjb21wb3NpdGUgY2FuY2VsbGF0aW9uIHJlYXNvbiB3aWxsIHRoZW4gYmVcbiAgICogcHJvcGFnYXRlZCB0byB0aGUgc3RyZWFtJ3MgdW5kZXJseWluZyBzb3VyY2UuXG4gICAqXG4gICAqIE5vdGUgdGhhdCB0aGUgY2h1bmtzIHNlZW4gaW4gZWFjaCBicmFuY2ggd2lsbCBiZSB0aGUgc2FtZSBvYmplY3QuIElmIHRoZSBjaHVua3MgYXJlIG5vdCBpbW11dGFibGUsXG4gICAqIHRoaXMgY291bGQgYWxsb3cgaW50ZXJmZXJlbmNlIGJldHdlZW4gdGhlIHR3byBicmFuY2hlcy5cbiAgICovXG4gIHRlZSgpOiBbUmVhZGFibGVTdHJlYW08Uj4sIFJlYWRhYmxlU3RyZWFtPFI+XSB7XG4gICAgaWYgKCFJc1JlYWRhYmxlU3RyZWFtKHRoaXMpKSB7XG4gICAgICB0aHJvdyBzdHJlYW1CcmFuZENoZWNrRXhjZXB0aW9uKCd0ZWUnKTtcbiAgICB9XG5cbiAgICBjb25zdCBicmFuY2hlcyA9IFJlYWRhYmxlU3RyZWFtVGVlKHRoaXMsIGZhbHNlKTtcbiAgICByZXR1cm4gQ3JlYXRlQXJyYXlGcm9tTGlzdChicmFuY2hlcyk7XG4gIH1cblxuICAvKipcbiAgICogQXN5bmNocm9ub3VzbHkgaXRlcmF0ZXMgb3ZlciB0aGUgY2h1bmtzIGluIHRoZSBzdHJlYW0ncyBpbnRlcm5hbCBxdWV1ZS5cbiAgICpcbiAgICogQXN5bmNocm9ub3VzbHkgaXRlcmF0aW5nIG92ZXIgdGhlIHN0cmVhbSB3aWxsIGxvY2sgaXQsIHByZXZlbnRpbmcgYW55IG90aGVyIGNvbnN1bWVyIGZyb20gYWNxdWlyaW5nIGEgcmVhZGVyLlxuICAgKiBUaGUgbG9jayB3aWxsIGJlIHJlbGVhc2VkIGlmIHRoZSBhc3luYyBpdGVyYXRvcidzIHtAbGluayBSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3IucmV0dXJuIHwgcmV0dXJuKCl9IG1ldGhvZFxuICAgKiBpcyBjYWxsZWQsIGUuZy4gYnkgYnJlYWtpbmcgb3V0IG9mIHRoZSBsb29wLlxuICAgKlxuICAgKiBCeSBkZWZhdWx0LCBjYWxsaW5nIHRoZSBhc3luYyBpdGVyYXRvcidzIHtAbGluayBSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3IucmV0dXJuIHwgcmV0dXJuKCl9IG1ldGhvZCB3aWxsIGFsc29cbiAgICogY2FuY2VsIHRoZSBzdHJlYW0uIFRvIHByZXZlbnQgdGhpcywgdXNlIHRoZSBzdHJlYW0ncyB7QGxpbmsgUmVhZGFibGVTdHJlYW0udmFsdWVzIHwgdmFsdWVzKCl9IG1ldGhvZCwgcGFzc2luZ1xuICAgKiBgdHJ1ZWAgZm9yIHRoZSBgcHJldmVudENhbmNlbGAgb3B0aW9uLlxuICAgKi9cbiAgdmFsdWVzKG9wdGlvbnM/OiBSZWFkYWJsZVN0cmVhbUl0ZXJhdG9yT3B0aW9ucyk6IFJlYWRhYmxlU3RyZWFtQXN5bmNJdGVyYXRvcjxSPjtcbiAgdmFsdWVzKHJhd09wdGlvbnM6IFJlYWRhYmxlU3RyZWFtSXRlcmF0b3JPcHRpb25zIHwgbnVsbCB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZCk6IFJlYWRhYmxlU3RyZWFtQXN5bmNJdGVyYXRvcjxSPiB7XG4gICAgaWYgKCFJc1JlYWRhYmxlU3RyZWFtKHRoaXMpKSB7XG4gICAgICB0aHJvdyBzdHJlYW1CcmFuZENoZWNrRXhjZXB0aW9uKCd2YWx1ZXMnKTtcbiAgICB9XG5cbiAgICBjb25zdCBvcHRpb25zID0gY29udmVydEl0ZXJhdG9yT3B0aW9ucyhyYXdPcHRpb25zLCAnRmlyc3QgcGFyYW1ldGVyJyk7XG4gICAgcmV0dXJuIEFjcXVpcmVSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3I8Uj4odGhpcywgb3B0aW9ucy5wcmV2ZW50Q2FuY2VsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB7QGluaGVyaXREb2MgUmVhZGFibGVTdHJlYW0udmFsdWVzfVxuICAgKi9cbiAgW1N5bWJvbC5hc3luY0l0ZXJhdG9yXShvcHRpb25zPzogUmVhZGFibGVTdHJlYW1JdGVyYXRvck9wdGlvbnMpOiBSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3I8Uj47XG5cbiAgW1N5bWJvbEFzeW5jSXRlcmF0b3JdKG9wdGlvbnM/OiBSZWFkYWJsZVN0cmVhbUl0ZXJhdG9yT3B0aW9ucyk6IFJlYWRhYmxlU3RyZWFtQXN5bmNJdGVyYXRvcjxSPiB7XG4gICAgLy8gU3R1YiBpbXBsZW1lbnRhdGlvbiwgb3ZlcnJpZGRlbiBiZWxvd1xuICAgIHJldHVybiB0aGlzLnZhbHVlcyhvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IFJlYWRhYmxlU3RyZWFtIHdyYXBwaW5nIHRoZSBwcm92aWRlZCBpdGVyYWJsZSBvciBhc3luYyBpdGVyYWJsZS5cbiAgICpcbiAgICogVGhpcyBjYW4gYmUgdXNlZCB0byBhZGFwdCB2YXJpb3VzIGtpbmRzIG9mIG9iamVjdHMgaW50byBhIHJlYWRhYmxlIHN0cmVhbSxcbiAgICogc3VjaCBhcyBhbiBhcnJheSwgYW4gYXN5bmMgZ2VuZXJhdG9yLCBvciBhIE5vZGUuanMgcmVhZGFibGUgc3RyZWFtLlxuICAgKi9cbiAgc3RhdGljIGZyb208Uj4oYXN5bmNJdGVyYWJsZTogSXRlcmFibGU8Uj4gfCBBc3luY0l0ZXJhYmxlPFI+IHwgUmVhZGFibGVTdHJlYW1MaWtlPFI+KTogUmVhZGFibGVTdHJlYW08Uj4ge1xuICAgIHJldHVybiBSZWFkYWJsZVN0cmVhbUZyb20oYXN5bmNJdGVyYWJsZSk7XG4gIH1cbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoUmVhZGFibGVTdHJlYW0sIHtcbiAgZnJvbTogeyBlbnVtZXJhYmxlOiB0cnVlIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoUmVhZGFibGVTdHJlYW0ucHJvdG90eXBlLCB7XG4gIGNhbmNlbDogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIGdldFJlYWRlcjogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIHBpcGVUaHJvdWdoOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgcGlwZVRvOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgdGVlOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgdmFsdWVzOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgbG9ja2VkOiB7IGVudW1lcmFibGU6IHRydWUgfVxufSk7XG5zZXRGdW5jdGlvbk5hbWUoUmVhZGFibGVTdHJlYW0uZnJvbSwgJ2Zyb20nKTtcbnNldEZ1bmN0aW9uTmFtZShSZWFkYWJsZVN0cmVhbS5wcm90b3R5cGUuY2FuY2VsLCAnY2FuY2VsJyk7XG5zZXRGdW5jdGlvbk5hbWUoUmVhZGFibGVTdHJlYW0ucHJvdG90eXBlLmdldFJlYWRlciwgJ2dldFJlYWRlcicpO1xuc2V0RnVuY3Rpb25OYW1lKFJlYWRhYmxlU3RyZWFtLnByb3RvdHlwZS5waXBlVGhyb3VnaCwgJ3BpcGVUaHJvdWdoJyk7XG5zZXRGdW5jdGlvbk5hbWUoUmVhZGFibGVTdHJlYW0ucHJvdG90eXBlLnBpcGVUbywgJ3BpcGVUbycpO1xuc2V0RnVuY3Rpb25OYW1lKFJlYWRhYmxlU3RyZWFtLnByb3RvdHlwZS50ZWUsICd0ZWUnKTtcbnNldEZ1bmN0aW9uTmFtZShSZWFkYWJsZVN0cmVhbS5wcm90b3R5cGUudmFsdWVzLCAndmFsdWVzJyk7XG5pZiAodHlwZW9mIFN5bWJvbC50b1N0cmluZ1RhZyA9PT0gJ3N5bWJvbCcpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJlYWRhYmxlU3RyZWFtLnByb3RvdHlwZSwgU3ltYm9sLnRvU3RyaW5nVGFnLCB7XG4gICAgdmFsdWU6ICdSZWFkYWJsZVN0cmVhbScsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xufVxuT2JqZWN0LmRlZmluZVByb3BlcnR5KFJlYWRhYmxlU3RyZWFtLnByb3RvdHlwZSwgU3ltYm9sQXN5bmNJdGVyYXRvciwge1xuICB2YWx1ZTogUmVhZGFibGVTdHJlYW0ucHJvdG90eXBlLnZhbHVlcyxcbiAgd3JpdGFibGU6IHRydWUsXG4gIGNvbmZpZ3VyYWJsZTogdHJ1ZVxufSk7XG5cbmV4cG9ydCB0eXBlIHtcbiAgUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9yLFxuICBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkUmVzdWx0LFxuICBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkUmVzdWx0LFxuICBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXJSZWFkT3B0aW9ucyxcbiAgVW5kZXJseWluZ0J5dGVTb3VyY2UsXG4gIFVuZGVybHlpbmdTb3VyY2UsXG4gIFVuZGVybHlpbmdTb3VyY2VTdGFydENhbGxiYWNrLFxuICBVbmRlcmx5aW5nU291cmNlUHVsbENhbGxiYWNrLFxuICBVbmRlcmx5aW5nU291cmNlQ2FuY2VsQ2FsbGJhY2ssXG4gIFVuZGVybHlpbmdCeXRlU291cmNlU3RhcnRDYWxsYmFjayxcbiAgVW5kZXJseWluZ0J5dGVTb3VyY2VQdWxsQ2FsbGJhY2ssXG4gIFN0cmVhbVBpcGVPcHRpb25zLFxuICBSZWFkYWJsZVdyaXRhYmxlUGFpcixcbiAgUmVhZGFibGVTdHJlYW1JdGVyYXRvck9wdGlvbnMsXG4gIFJlYWRhYmxlU3RyZWFtTGlrZSxcbiAgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyTGlrZVxufTtcblxuLy8gQWJzdHJhY3Qgb3BlcmF0aW9ucyBmb3IgdGhlIFJlYWRhYmxlU3RyZWFtLlxuXG4vLyBUaHJvd3MgaWYgYW5kIG9ubHkgaWYgc3RhcnRBbGdvcml0aG0gdGhyb3dzLlxuZXhwb3J0IGZ1bmN0aW9uIENyZWF0ZVJlYWRhYmxlU3RyZWFtPFI+KFxuICBzdGFydEFsZ29yaXRobTogKCkgPT4gdm9pZCB8IFByb21pc2VMaWtlPHZvaWQ+LFxuICBwdWxsQWxnb3JpdGhtOiAoKSA9PiBQcm9taXNlPHZvaWQ+LFxuICBjYW5jZWxBbGdvcml0aG06IChyZWFzb246IGFueSkgPT4gUHJvbWlzZTx2b2lkPixcbiAgaGlnaFdhdGVyTWFyayA9IDEsXG4gIHNpemVBbGdvcml0aG06IFF1ZXVpbmdTdHJhdGVneVNpemVDYWxsYmFjazxSPiA9ICgpID0+IDFcbik6IERlZmF1bHRSZWFkYWJsZVN0cmVhbTxSPiB7XG4gIGFzc2VydChJc05vbk5lZ2F0aXZlTnVtYmVyKGhpZ2hXYXRlck1hcmspKTtcblxuICBjb25zdCBzdHJlYW06IERlZmF1bHRSZWFkYWJsZVN0cmVhbTxSPiA9IE9iamVjdC5jcmVhdGUoUmVhZGFibGVTdHJlYW0ucHJvdG90eXBlKTtcbiAgSW5pdGlhbGl6ZVJlYWRhYmxlU3RyZWFtKHN0cmVhbSk7XG5cbiAgY29uc3QgY29udHJvbGxlcjogUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxSPiA9IE9iamVjdC5jcmVhdGUoUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlci5wcm90b3R5cGUpO1xuICBTZXRVcFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIoXG4gICAgc3RyZWFtLCBjb250cm9sbGVyLCBzdGFydEFsZ29yaXRobSwgcHVsbEFsZ29yaXRobSwgY2FuY2VsQWxnb3JpdGhtLCBoaWdoV2F0ZXJNYXJrLCBzaXplQWxnb3JpdGhtXG4gICk7XG5cbiAgcmV0dXJuIHN0cmVhbTtcbn1cblxuLy8gVGhyb3dzIGlmIGFuZCBvbmx5IGlmIHN0YXJ0QWxnb3JpdGhtIHRocm93cy5cbmV4cG9ydCBmdW5jdGlvbiBDcmVhdGVSZWFkYWJsZUJ5dGVTdHJlYW0oXG4gIHN0YXJ0QWxnb3JpdGhtOiAoKSA9PiB2b2lkIHwgUHJvbWlzZUxpa2U8dm9pZD4sXG4gIHB1bGxBbGdvcml0aG06ICgpID0+IFByb21pc2U8dm9pZD4sXG4gIGNhbmNlbEFsZ29yaXRobTogKHJlYXNvbjogYW55KSA9PiBQcm9taXNlPHZvaWQ+XG4pOiBSZWFkYWJsZUJ5dGVTdHJlYW0ge1xuICBjb25zdCBzdHJlYW06IFJlYWRhYmxlQnl0ZVN0cmVhbSA9IE9iamVjdC5jcmVhdGUoUmVhZGFibGVTdHJlYW0ucHJvdG90eXBlKTtcbiAgSW5pdGlhbGl6ZVJlYWRhYmxlU3RyZWFtKHN0cmVhbSk7XG5cbiAgY29uc3QgY29udHJvbGxlcjogUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlciA9IE9iamVjdC5jcmVhdGUoUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlci5wcm90b3R5cGUpO1xuICBTZXRVcFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIoc3RyZWFtLCBjb250cm9sbGVyLCBzdGFydEFsZ29yaXRobSwgcHVsbEFsZ29yaXRobSwgY2FuY2VsQWxnb3JpdGhtLCAwLCB1bmRlZmluZWQpO1xuXG4gIHJldHVybiBzdHJlYW07XG59XG5cbmZ1bmN0aW9uIEluaXRpYWxpemVSZWFkYWJsZVN0cmVhbShzdHJlYW06IFJlYWRhYmxlU3RyZWFtKSB7XG4gIHN0cmVhbS5fc3RhdGUgPSAncmVhZGFibGUnO1xuICBzdHJlYW0uX3JlYWRlciA9IHVuZGVmaW5lZDtcbiAgc3RyZWFtLl9zdG9yZWRFcnJvciA9IHVuZGVmaW5lZDtcbiAgc3RyZWFtLl9kaXN0dXJiZWQgPSBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIElzUmVhZGFibGVTdHJlYW0oeDogdW5rbm93bik6IHggaXMgUmVhZGFibGVTdHJlYW0ge1xuICBpZiAoIXR5cGVJc09iamVjdCh4KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHgsICdfcmVhZGFibGVTdHJlYW1Db250cm9sbGVyJykpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4geCBpbnN0YW5jZW9mIFJlYWRhYmxlU3RyZWFtO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gSXNSZWFkYWJsZVN0cmVhbURpc3R1cmJlZChzdHJlYW06IFJlYWRhYmxlU3RyZWFtKTogYm9vbGVhbiB7XG4gIGFzc2VydChJc1JlYWRhYmxlU3RyZWFtKHN0cmVhbSkpO1xuXG4gIHJldHVybiBzdHJlYW0uX2Rpc3R1cmJlZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIElzUmVhZGFibGVTdHJlYW1Mb2NrZWQoc3RyZWFtOiBSZWFkYWJsZVN0cmVhbSk6IGJvb2xlYW4ge1xuICBhc3NlcnQoSXNSZWFkYWJsZVN0cmVhbShzdHJlYW0pKTtcblxuICBpZiAoc3RyZWFtLl9yZWFkZXIgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG4vLyBSZWFkYWJsZVN0cmVhbSBBUEkgZXhwb3NlZCBmb3IgY29udHJvbGxlcnMuXG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZVN0cmVhbUNhbmNlbDxSPihzdHJlYW06IFJlYWRhYmxlU3RyZWFtPFI+LCByZWFzb246IGFueSk6IFByb21pc2U8dW5kZWZpbmVkPiB7XG4gIHN0cmVhbS5fZGlzdHVyYmVkID0gdHJ1ZTtcblxuICBpZiAoc3RyZWFtLl9zdGF0ZSA9PT0gJ2Nsb3NlZCcpIHtcbiAgICByZXR1cm4gcHJvbWlzZVJlc29sdmVkV2l0aCh1bmRlZmluZWQpO1xuICB9XG4gIGlmIChzdHJlYW0uX3N0YXRlID09PSAnZXJyb3JlZCcpIHtcbiAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChzdHJlYW0uX3N0b3JlZEVycm9yKTtcbiAgfVxuXG4gIFJlYWRhYmxlU3RyZWFtQ2xvc2Uoc3RyZWFtKTtcblxuICBjb25zdCByZWFkZXIgPSBzdHJlYW0uX3JlYWRlcjtcbiAgaWYgKHJlYWRlciAhPT0gdW5kZWZpbmVkICYmIElzUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyKHJlYWRlcikpIHtcbiAgICBjb25zdCByZWFkSW50b1JlcXVlc3RzID0gcmVhZGVyLl9yZWFkSW50b1JlcXVlc3RzO1xuICAgIHJlYWRlci5fcmVhZEludG9SZXF1ZXN0cyA9IG5ldyBTaW1wbGVRdWV1ZSgpO1xuICAgIHJlYWRJbnRvUmVxdWVzdHMuZm9yRWFjaChyZWFkSW50b1JlcXVlc3QgPT4ge1xuICAgICAgcmVhZEludG9SZXF1ZXN0Ll9jbG9zZVN0ZXBzKHVuZGVmaW5lZCk7XG4gICAgfSk7XG4gIH1cblxuICBjb25zdCBzb3VyY2VDYW5jZWxQcm9taXNlID0gc3RyZWFtLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXJbQ2FuY2VsU3RlcHNdKHJlYXNvbik7XG4gIHJldHVybiB0cmFuc2Zvcm1Qcm9taXNlV2l0aChzb3VyY2VDYW5jZWxQcm9taXNlLCBub29wKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtQ2xvc2U8Uj4oc3RyZWFtOiBSZWFkYWJsZVN0cmVhbTxSPik6IHZvaWQge1xuICBhc3NlcnQoc3RyZWFtLl9zdGF0ZSA9PT0gJ3JlYWRhYmxlJyk7XG5cbiAgc3RyZWFtLl9zdGF0ZSA9ICdjbG9zZWQnO1xuXG4gIGNvbnN0IHJlYWRlciA9IHN0cmVhbS5fcmVhZGVyO1xuXG4gIGlmIChyZWFkZXIgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGRlZmF1bHRSZWFkZXJDbG9zZWRQcm9taXNlUmVzb2x2ZShyZWFkZXIpO1xuXG4gIGlmIChJc1JlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcjxSPihyZWFkZXIpKSB7XG4gICAgY29uc3QgcmVhZFJlcXVlc3RzID0gcmVhZGVyLl9yZWFkUmVxdWVzdHM7XG4gICAgcmVhZGVyLl9yZWFkUmVxdWVzdHMgPSBuZXcgU2ltcGxlUXVldWUoKTtcbiAgICByZWFkUmVxdWVzdHMuZm9yRWFjaChyZWFkUmVxdWVzdCA9PiB7XG4gICAgICByZWFkUmVxdWVzdC5fY2xvc2VTdGVwcygpO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZVN0cmVhbUVycm9yPFI+KHN0cmVhbTogUmVhZGFibGVTdHJlYW08Uj4sIGU6IGFueSk6IHZvaWQge1xuICBhc3NlcnQoSXNSZWFkYWJsZVN0cmVhbShzdHJlYW0pKTtcbiAgYXNzZXJ0KHN0cmVhbS5fc3RhdGUgPT09ICdyZWFkYWJsZScpO1xuXG4gIHN0cmVhbS5fc3RhdGUgPSAnZXJyb3JlZCc7XG4gIHN0cmVhbS5fc3RvcmVkRXJyb3IgPSBlO1xuXG4gIGNvbnN0IHJlYWRlciA9IHN0cmVhbS5fcmVhZGVyO1xuXG4gIGlmIChyZWFkZXIgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGRlZmF1bHRSZWFkZXJDbG9zZWRQcm9taXNlUmVqZWN0KHJlYWRlciwgZSk7XG5cbiAgaWYgKElzUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyPFI+KHJlYWRlcikpIHtcbiAgICBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXJFcnJvclJlYWRSZXF1ZXN0cyhyZWFkZXIsIGUpO1xuICB9IGVsc2Uge1xuICAgIGFzc2VydChJc1JlYWRhYmxlU3RyZWFtQllPQlJlYWRlcihyZWFkZXIpKTtcbiAgICBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXJFcnJvclJlYWRJbnRvUmVxdWVzdHMocmVhZGVyLCBlKTtcbiAgfVxufVxuXG4vLyBSZWFkZXJzXG5cbmV4cG9ydCB0eXBlIFJlYWRhYmxlU3RyZWFtUmVhZGVyPFI+ID0gUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyPFI+IHwgUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyO1xuXG5leHBvcnQge1xuICBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXIsXG4gIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlclxufTtcblxuLy8gQ29udHJvbGxlcnNcblxuZXhwb3J0IHtcbiAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcixcbiAgUmVhZGFibGVTdHJlYW1CWU9CUmVxdWVzdCxcbiAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclxufTtcblxuLy8gSGVscGVyIGZ1bmN0aW9ucyBmb3IgdGhlIFJlYWRhYmxlU3RyZWFtLlxuXG5mdW5jdGlvbiBzdHJlYW1CcmFuZENoZWNrRXhjZXB0aW9uKG5hbWU6IHN0cmluZyk6IFR5cGVFcnJvciB7XG4gIHJldHVybiBuZXcgVHlwZUVycm9yKGBSZWFkYWJsZVN0cmVhbS5wcm90b3R5cGUuJHtuYW1lfSBjYW4gb25seSBiZSB1c2VkIG9uIGEgUmVhZGFibGVTdHJlYW1gKTtcbn1cbiIsICJpbXBvcnQgdHlwZSB7IFF1ZXVpbmdTdHJhdGVneUluaXQgfSBmcm9tICcuLi9xdWV1aW5nLXN0cmF0ZWd5JztcbmltcG9ydCB7IGFzc2VydERpY3Rpb25hcnksIGFzc2VydFJlcXVpcmVkRmllbGQsIGNvbnZlcnRVbnJlc3RyaWN0ZWREb3VibGUgfSBmcm9tICcuL2Jhc2ljJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRRdWV1aW5nU3RyYXRlZ3lJbml0KGluaXQ6IFF1ZXVpbmdTdHJhdGVneUluaXQgfCBudWxsIHwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6IHN0cmluZyk6IFF1ZXVpbmdTdHJhdGVneUluaXQge1xuICBhc3NlcnREaWN0aW9uYXJ5KGluaXQsIGNvbnRleHQpO1xuICBjb25zdCBoaWdoV2F0ZXJNYXJrID0gaW5pdD8uaGlnaFdhdGVyTWFyaztcbiAgYXNzZXJ0UmVxdWlyZWRGaWVsZChoaWdoV2F0ZXJNYXJrLCAnaGlnaFdhdGVyTWFyaycsICdRdWV1aW5nU3RyYXRlZ3lJbml0Jyk7XG4gIHJldHVybiB7XG4gICAgaGlnaFdhdGVyTWFyazogY29udmVydFVucmVzdHJpY3RlZERvdWJsZShoaWdoV2F0ZXJNYXJrKVxuICB9O1xufVxuIiwgImltcG9ydCB0eXBlIHsgUXVldWluZ1N0cmF0ZWd5LCBRdWV1aW5nU3RyYXRlZ3lJbml0IH0gZnJvbSAnLi9xdWV1aW5nLXN0cmF0ZWd5JztcbmltcG9ydCB7IHNldEZ1bmN0aW9uTmFtZSwgdHlwZUlzT2JqZWN0IH0gZnJvbSAnLi9oZWxwZXJzL21pc2NlbGxhbmVvdXMnO1xuaW1wb3J0IHsgYXNzZXJ0UmVxdWlyZWRBcmd1bWVudCB9IGZyb20gJy4vdmFsaWRhdG9ycy9iYXNpYyc7XG5pbXBvcnQgeyBjb252ZXJ0UXVldWluZ1N0cmF0ZWd5SW5pdCB9IGZyb20gJy4vdmFsaWRhdG9ycy9xdWV1aW5nLXN0cmF0ZWd5LWluaXQnO1xuXG4vLyBUaGUgc2l6ZSBmdW5jdGlvbiBtdXN0IG5vdCBoYXZlIGEgcHJvdG90eXBlIHByb3BlcnR5IG5vciBiZSBhIGNvbnN0cnVjdG9yXG5jb25zdCBieXRlTGVuZ3RoU2l6ZUZ1bmN0aW9uID0gKGNodW5rOiBBcnJheUJ1ZmZlclZpZXcpOiBudW1iZXIgPT4ge1xuICByZXR1cm4gY2h1bmsuYnl0ZUxlbmd0aDtcbn07XG5zZXRGdW5jdGlvbk5hbWUoYnl0ZUxlbmd0aFNpemVGdW5jdGlvbiwgJ3NpemUnKTtcblxuLyoqXG4gKiBBIHF1ZXVpbmcgc3RyYXRlZ3kgdGhhdCBjb3VudHMgdGhlIG51bWJlciBvZiBieXRlcyBpbiBlYWNoIGNodW5rLlxuICpcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnl0ZUxlbmd0aFF1ZXVpbmdTdHJhdGVneSBpbXBsZW1lbnRzIFF1ZXVpbmdTdHJhdGVneTxBcnJheUJ1ZmZlclZpZXc+IHtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICByZWFkb25seSBfYnl0ZUxlbmd0aFF1ZXVpbmdTdHJhdGVneUhpZ2hXYXRlck1hcms6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBRdWV1aW5nU3RyYXRlZ3lJbml0KSB7XG4gICAgYXNzZXJ0UmVxdWlyZWRBcmd1bWVudChvcHRpb25zLCAxLCAnQnl0ZUxlbmd0aFF1ZXVpbmdTdHJhdGVneScpO1xuICAgIG9wdGlvbnMgPSBjb252ZXJ0UXVldWluZ1N0cmF0ZWd5SW5pdChvcHRpb25zLCAnRmlyc3QgcGFyYW1ldGVyJyk7XG4gICAgdGhpcy5fYnl0ZUxlbmd0aFF1ZXVpbmdTdHJhdGVneUhpZ2hXYXRlck1hcmsgPSBvcHRpb25zLmhpZ2hXYXRlck1hcms7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaGlnaCB3YXRlciBtYXJrIHByb3ZpZGVkIHRvIHRoZSBjb25zdHJ1Y3Rvci5cbiAgICovXG4gIGdldCBoaWdoV2F0ZXJNYXJrKCk6IG51bWJlciB7XG4gICAgaWYgKCFJc0J5dGVMZW5ndGhRdWV1aW5nU3RyYXRlZ3kodGhpcykpIHtcbiAgICAgIHRocm93IGJ5dGVMZW5ndGhCcmFuZENoZWNrRXhjZXB0aW9uKCdoaWdoV2F0ZXJNYXJrJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9ieXRlTGVuZ3RoUXVldWluZ1N0cmF0ZWd5SGlnaFdhdGVyTWFyaztcbiAgfVxuXG4gIC8qKlxuICAgKiBNZWFzdXJlcyB0aGUgc2l6ZSBvZiBgY2h1bmtgIGJ5IHJldHVybmluZyB0aGUgdmFsdWUgb2YgaXRzIGBieXRlTGVuZ3RoYCBwcm9wZXJ0eS5cbiAgICovXG4gIGdldCBzaXplKCk6IChjaHVuazogQXJyYXlCdWZmZXJWaWV3KSA9PiBudW1iZXIge1xuICAgIGlmICghSXNCeXRlTGVuZ3RoUXVldWluZ1N0cmF0ZWd5KHRoaXMpKSB7XG4gICAgICB0aHJvdyBieXRlTGVuZ3RoQnJhbmRDaGVja0V4Y2VwdGlvbignc2l6ZScpO1xuICAgIH1cbiAgICByZXR1cm4gYnl0ZUxlbmd0aFNpemVGdW5jdGlvbjtcbiAgfVxufVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyhCeXRlTGVuZ3RoUXVldWluZ1N0cmF0ZWd5LnByb3RvdHlwZSwge1xuICBoaWdoV2F0ZXJNYXJrOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgc2l6ZTogeyBlbnVtZXJhYmxlOiB0cnVlIH1cbn0pO1xuaWYgKHR5cGVvZiBTeW1ib2wudG9TdHJpbmdUYWcgPT09ICdzeW1ib2wnKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShCeXRlTGVuZ3RoUXVldWluZ1N0cmF0ZWd5LnByb3RvdHlwZSwgU3ltYm9sLnRvU3RyaW5nVGFnLCB7XG4gICAgdmFsdWU6ICdCeXRlTGVuZ3RoUXVldWluZ1N0cmF0ZWd5JyxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG59XG5cbi8vIEhlbHBlciBmdW5jdGlvbnMgZm9yIHRoZSBCeXRlTGVuZ3RoUXVldWluZ1N0cmF0ZWd5LlxuXG5mdW5jdGlvbiBieXRlTGVuZ3RoQnJhbmRDaGVja0V4Y2VwdGlvbihuYW1lOiBzdHJpbmcpOiBUeXBlRXJyb3Ige1xuICByZXR1cm4gbmV3IFR5cGVFcnJvcihgQnl0ZUxlbmd0aFF1ZXVpbmdTdHJhdGVneS5wcm90b3R5cGUuJHtuYW1lfSBjYW4gb25seSBiZSB1c2VkIG9uIGEgQnl0ZUxlbmd0aFF1ZXVpbmdTdHJhdGVneWApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gSXNCeXRlTGVuZ3RoUXVldWluZ1N0cmF0ZWd5KHg6IGFueSk6IHggaXMgQnl0ZUxlbmd0aFF1ZXVpbmdTdHJhdGVneSB7XG4gIGlmICghdHlwZUlzT2JqZWN0KHgpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoeCwgJ19ieXRlTGVuZ3RoUXVldWluZ1N0cmF0ZWd5SGlnaFdhdGVyTWFyaycpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHggaW5zdGFuY2VvZiBCeXRlTGVuZ3RoUXVldWluZ1N0cmF0ZWd5O1xufVxuIiwgImltcG9ydCB0eXBlIHsgUXVldWluZ1N0cmF0ZWd5LCBRdWV1aW5nU3RyYXRlZ3lJbml0IH0gZnJvbSAnLi9xdWV1aW5nLXN0cmF0ZWd5JztcbmltcG9ydCB7IHNldEZ1bmN0aW9uTmFtZSwgdHlwZUlzT2JqZWN0IH0gZnJvbSAnLi9oZWxwZXJzL21pc2NlbGxhbmVvdXMnO1xuaW1wb3J0IHsgYXNzZXJ0UmVxdWlyZWRBcmd1bWVudCB9IGZyb20gJy4vdmFsaWRhdG9ycy9iYXNpYyc7XG5pbXBvcnQgeyBjb252ZXJ0UXVldWluZ1N0cmF0ZWd5SW5pdCB9IGZyb20gJy4vdmFsaWRhdG9ycy9xdWV1aW5nLXN0cmF0ZWd5LWluaXQnO1xuXG4vLyBUaGUgc2l6ZSBmdW5jdGlvbiBtdXN0IG5vdCBoYXZlIGEgcHJvdG90eXBlIHByb3BlcnR5IG5vciBiZSBhIGNvbnN0cnVjdG9yXG5jb25zdCBjb3VudFNpemVGdW5jdGlvbiA9ICgpOiAxID0+IHtcbiAgcmV0dXJuIDE7XG59O1xuc2V0RnVuY3Rpb25OYW1lKGNvdW50U2l6ZUZ1bmN0aW9uLCAnc2l6ZScpO1xuXG4vKipcbiAqIEEgcXVldWluZyBzdHJhdGVneSB0aGF0IGNvdW50cyB0aGUgbnVtYmVyIG9mIGNodW5rcy5cbiAqXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvdW50UXVldWluZ1N0cmF0ZWd5IGltcGxlbWVudHMgUXVldWluZ1N0cmF0ZWd5PGFueT4ge1xuICAvKiogQGludGVybmFsICovXG4gIHJlYWRvbmx5IF9jb3VudFF1ZXVpbmdTdHJhdGVneUhpZ2hXYXRlck1hcmshOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9uczogUXVldWluZ1N0cmF0ZWd5SW5pdCkge1xuICAgIGFzc2VydFJlcXVpcmVkQXJndW1lbnQob3B0aW9ucywgMSwgJ0NvdW50UXVldWluZ1N0cmF0ZWd5Jyk7XG4gICAgb3B0aW9ucyA9IGNvbnZlcnRRdWV1aW5nU3RyYXRlZ3lJbml0KG9wdGlvbnMsICdGaXJzdCBwYXJhbWV0ZXInKTtcbiAgICB0aGlzLl9jb3VudFF1ZXVpbmdTdHJhdGVneUhpZ2hXYXRlck1hcmsgPSBvcHRpb25zLmhpZ2hXYXRlck1hcms7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaGlnaCB3YXRlciBtYXJrIHByb3ZpZGVkIHRvIHRoZSBjb25zdHJ1Y3Rvci5cbiAgICovXG4gIGdldCBoaWdoV2F0ZXJNYXJrKCk6IG51bWJlciB7XG4gICAgaWYgKCFJc0NvdW50UXVldWluZ1N0cmF0ZWd5KHRoaXMpKSB7XG4gICAgICB0aHJvdyBjb3VudEJyYW5kQ2hlY2tFeGNlcHRpb24oJ2hpZ2hXYXRlck1hcmsnKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2NvdW50UXVldWluZ1N0cmF0ZWd5SGlnaFdhdGVyTWFyaztcbiAgfVxuXG4gIC8qKlxuICAgKiBNZWFzdXJlcyB0aGUgc2l6ZSBvZiBgY2h1bmtgIGJ5IGFsd2F5cyByZXR1cm5pbmcgMS5cbiAgICogVGhpcyBlbnN1cmVzIHRoYXQgdGhlIHRvdGFsIHF1ZXVlIHNpemUgaXMgYSBjb3VudCBvZiB0aGUgbnVtYmVyIG9mIGNodW5rcyBpbiB0aGUgcXVldWUuXG4gICAqL1xuICBnZXQgc2l6ZSgpOiAoY2h1bms6IGFueSkgPT4gMSB7XG4gICAgaWYgKCFJc0NvdW50UXVldWluZ1N0cmF0ZWd5KHRoaXMpKSB7XG4gICAgICB0aHJvdyBjb3VudEJyYW5kQ2hlY2tFeGNlcHRpb24oJ3NpemUnKTtcbiAgICB9XG4gICAgcmV0dXJuIGNvdW50U2l6ZUZ1bmN0aW9uO1xuICB9XG59XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKENvdW50UXVldWluZ1N0cmF0ZWd5LnByb3RvdHlwZSwge1xuICBoaWdoV2F0ZXJNYXJrOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgc2l6ZTogeyBlbnVtZXJhYmxlOiB0cnVlIH1cbn0pO1xuaWYgKHR5cGVvZiBTeW1ib2wudG9TdHJpbmdUYWcgPT09ICdzeW1ib2wnKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDb3VudFF1ZXVpbmdTdHJhdGVneS5wcm90b3R5cGUsIFN5bWJvbC50b1N0cmluZ1RhZywge1xuICAgIHZhbHVlOiAnQ291bnRRdWV1aW5nU3RyYXRlZ3knLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbn1cblxuLy8gSGVscGVyIGZ1bmN0aW9ucyBmb3IgdGhlIENvdW50UXVldWluZ1N0cmF0ZWd5LlxuXG5mdW5jdGlvbiBjb3VudEJyYW5kQ2hlY2tFeGNlcHRpb24obmFtZTogc3RyaW5nKTogVHlwZUVycm9yIHtcbiAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoYENvdW50UXVldWluZ1N0cmF0ZWd5LnByb3RvdHlwZS4ke25hbWV9IGNhbiBvbmx5IGJlIHVzZWQgb24gYSBDb3VudFF1ZXVpbmdTdHJhdGVneWApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gSXNDb3VudFF1ZXVpbmdTdHJhdGVneSh4OiBhbnkpOiB4IGlzIENvdW50UXVldWluZ1N0cmF0ZWd5IHtcbiAgaWYgKCF0eXBlSXNPYmplY3QoeCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh4LCAnX2NvdW50UXVldWluZ1N0cmF0ZWd5SGlnaFdhdGVyTWFyaycpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHggaW5zdGFuY2VvZiBDb3VudFF1ZXVpbmdTdHJhdGVneTtcbn1cbiIsICJpbXBvcnQgeyBhc3NlcnREaWN0aW9uYXJ5LCBhc3NlcnRGdW5jdGlvbiB9IGZyb20gJy4vYmFzaWMnO1xuaW1wb3J0IHsgcHJvbWlzZUNhbGwsIHJlZmxlY3RDYWxsIH0gZnJvbSAnLi4vaGVscGVycy93ZWJpZGwnO1xuaW1wb3J0IHR5cGUge1xuICBUcmFuc2Zvcm1lcixcbiAgVHJhbnNmb3JtZXJDYW5jZWxDYWxsYmFjayxcbiAgVHJhbnNmb3JtZXJGbHVzaENhbGxiYWNrLFxuICBUcmFuc2Zvcm1lclN0YXJ0Q2FsbGJhY2ssXG4gIFRyYW5zZm9ybWVyVHJhbnNmb3JtQ2FsbGJhY2ssXG4gIFZhbGlkYXRlZFRyYW5zZm9ybWVyXG59IGZyb20gJy4uL3RyYW5zZm9ybS1zdHJlYW0vdHJhbnNmb3JtZXInO1xuaW1wb3J0IHsgVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIgfSBmcm9tICcuLi90cmFuc2Zvcm0tc3RyZWFtJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRUcmFuc2Zvcm1lcjxJLCBPPihvcmlnaW5hbDogVHJhbnNmb3JtZXI8SSwgTz4gfCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiBzdHJpbmcpOiBWYWxpZGF0ZWRUcmFuc2Zvcm1lcjxJLCBPPiB7XG4gIGFzc2VydERpY3Rpb25hcnkob3JpZ2luYWwsIGNvbnRleHQpO1xuICBjb25zdCBjYW5jZWwgPSBvcmlnaW5hbD8uY2FuY2VsO1xuICBjb25zdCBmbHVzaCA9IG9yaWdpbmFsPy5mbHVzaDtcbiAgY29uc3QgcmVhZGFibGVUeXBlID0gb3JpZ2luYWw/LnJlYWRhYmxlVHlwZTtcbiAgY29uc3Qgc3RhcnQgPSBvcmlnaW5hbD8uc3RhcnQ7XG4gIGNvbnN0IHRyYW5zZm9ybSA9IG9yaWdpbmFsPy50cmFuc2Zvcm07XG4gIGNvbnN0IHdyaXRhYmxlVHlwZSA9IG9yaWdpbmFsPy53cml0YWJsZVR5cGU7XG4gIHJldHVybiB7XG4gICAgY2FuY2VsOiBjYW5jZWwgPT09IHVuZGVmaW5lZCA/XG4gICAgICB1bmRlZmluZWQgOlxuICAgICAgY29udmVydFRyYW5zZm9ybWVyQ2FuY2VsQ2FsbGJhY2soY2FuY2VsLCBvcmlnaW5hbCEsIGAke2NvbnRleHR9IGhhcyBtZW1iZXIgJ2NhbmNlbCcgdGhhdGApLFxuICAgIGZsdXNoOiBmbHVzaCA9PT0gdW5kZWZpbmVkID9cbiAgICAgIHVuZGVmaW5lZCA6XG4gICAgICBjb252ZXJ0VHJhbnNmb3JtZXJGbHVzaENhbGxiYWNrKGZsdXNoLCBvcmlnaW5hbCEsIGAke2NvbnRleHR9IGhhcyBtZW1iZXIgJ2ZsdXNoJyB0aGF0YCksXG4gICAgcmVhZGFibGVUeXBlLFxuICAgIHN0YXJ0OiBzdGFydCA9PT0gdW5kZWZpbmVkID9cbiAgICAgIHVuZGVmaW5lZCA6XG4gICAgICBjb252ZXJ0VHJhbnNmb3JtZXJTdGFydENhbGxiYWNrKHN0YXJ0LCBvcmlnaW5hbCEsIGAke2NvbnRleHR9IGhhcyBtZW1iZXIgJ3N0YXJ0JyB0aGF0YCksXG4gICAgdHJhbnNmb3JtOiB0cmFuc2Zvcm0gPT09IHVuZGVmaW5lZCA/XG4gICAgICB1bmRlZmluZWQgOlxuICAgICAgY29udmVydFRyYW5zZm9ybWVyVHJhbnNmb3JtQ2FsbGJhY2sodHJhbnNmb3JtLCBvcmlnaW5hbCEsIGAke2NvbnRleHR9IGhhcyBtZW1iZXIgJ3RyYW5zZm9ybScgdGhhdGApLFxuICAgIHdyaXRhYmxlVHlwZVxuICB9O1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0VHJhbnNmb3JtZXJGbHVzaENhbGxiYWNrPEksIE8+KFxuICBmbjogVHJhbnNmb3JtZXJGbHVzaENhbGxiYWNrPE8+LFxuICBvcmlnaW5hbDogVHJhbnNmb3JtZXI8SSwgTz4sXG4gIGNvbnRleHQ6IHN0cmluZ1xuKTogKGNvbnRyb2xsZXI6IFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyPE8+KSA9PiBQcm9taXNlPHZvaWQ+IHtcbiAgYXNzZXJ0RnVuY3Rpb24oZm4sIGNvbnRleHQpO1xuICByZXR1cm4gKGNvbnRyb2xsZXI6IFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyPE8+KSA9PiBwcm9taXNlQ2FsbChmbiwgb3JpZ2luYWwsIFtjb250cm9sbGVyXSk7XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRUcmFuc2Zvcm1lclN0YXJ0Q2FsbGJhY2s8SSwgTz4oXG4gIGZuOiBUcmFuc2Zvcm1lclN0YXJ0Q2FsbGJhY2s8Tz4sXG4gIG9yaWdpbmFsOiBUcmFuc2Zvcm1lcjxJLCBPPixcbiAgY29udGV4dDogc3RyaW5nXG4pOiBUcmFuc2Zvcm1lclN0YXJ0Q2FsbGJhY2s8Tz4ge1xuICBhc3NlcnRGdW5jdGlvbihmbiwgY29udGV4dCk7XG4gIHJldHVybiAoY29udHJvbGxlcjogVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8Tz4pID0+IHJlZmxlY3RDYWxsKGZuLCBvcmlnaW5hbCwgW2NvbnRyb2xsZXJdKTtcbn1cblxuZnVuY3Rpb24gY29udmVydFRyYW5zZm9ybWVyVHJhbnNmb3JtQ2FsbGJhY2s8SSwgTz4oXG4gIGZuOiBUcmFuc2Zvcm1lclRyYW5zZm9ybUNhbGxiYWNrPEksIE8+LFxuICBvcmlnaW5hbDogVHJhbnNmb3JtZXI8SSwgTz4sXG4gIGNvbnRleHQ6IHN0cmluZ1xuKTogKGNodW5rOiBJLCBjb250cm9sbGVyOiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxPPikgPT4gUHJvbWlzZTx2b2lkPiB7XG4gIGFzc2VydEZ1bmN0aW9uKGZuLCBjb250ZXh0KTtcbiAgcmV0dXJuIChjaHVuazogSSwgY29udHJvbGxlcjogVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8Tz4pID0+IHByb21pc2VDYWxsKGZuLCBvcmlnaW5hbCwgW2NodW5rLCBjb250cm9sbGVyXSk7XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRUcmFuc2Zvcm1lckNhbmNlbENhbGxiYWNrPEksIE8+KFxuICBmbjogVHJhbnNmb3JtZXJDYW5jZWxDYWxsYmFjayxcbiAgb3JpZ2luYWw6IFRyYW5zZm9ybWVyPEksIE8+LFxuICBjb250ZXh0OiBzdHJpbmdcbik6IChyZWFzb246IGFueSkgPT4gUHJvbWlzZTx2b2lkPiB7XG4gIGFzc2VydEZ1bmN0aW9uKGZuLCBjb250ZXh0KTtcbiAgcmV0dXJuIChyZWFzb246IGFueSkgPT4gcHJvbWlzZUNhbGwoZm4sIG9yaWdpbmFsLCBbcmVhc29uXSk7XG59XG4iLCAiaW1wb3J0IGFzc2VydCBmcm9tICcuLi9zdHViL2Fzc2VydCc7XG5pbXBvcnQge1xuICBuZXdQcm9taXNlLFxuICBwcm9taXNlUmVqZWN0ZWRXaXRoLFxuICBwcm9taXNlUmVzb2x2ZWRXaXRoLFxuICBzZXRQcm9taXNlSXNIYW5kbGVkVG9UcnVlLFxuICB0cmFuc2Zvcm1Qcm9taXNlV2l0aCxcbiAgdXBvblByb21pc2Vcbn0gZnJvbSAnLi9oZWxwZXJzL3dlYmlkbCc7XG5pbXBvcnQgeyBDcmVhdGVSZWFkYWJsZVN0cmVhbSwgdHlwZSBEZWZhdWx0UmVhZGFibGVTdHJlYW0sIFJlYWRhYmxlU3RyZWFtIH0gZnJvbSAnLi9yZWFkYWJsZS1zdHJlYW0nO1xuaW1wb3J0IHtcbiAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNhbkNsb3NlT3JFbnF1ZXVlLFxuICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2xvc2UsXG4gIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFbnF1ZXVlLFxuICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRXJyb3IsXG4gIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJHZXREZXNpcmVkU2l6ZSxcbiAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckhhc0JhY2twcmVzc3VyZVxufSBmcm9tICcuL3JlYWRhYmxlLXN0cmVhbS9kZWZhdWx0LWNvbnRyb2xsZXInO1xuaW1wb3J0IHR5cGUgeyBRdWV1aW5nU3RyYXRlZ3ksIFF1ZXVpbmdTdHJhdGVneVNpemVDYWxsYmFjayB9IGZyb20gJy4vcXVldWluZy1zdHJhdGVneSc7XG5pbXBvcnQgeyBDcmVhdGVXcml0YWJsZVN0cmVhbSwgV3JpdGFibGVTdHJlYW0sIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFcnJvcklmTmVlZGVkIH0gZnJvbSAnLi93cml0YWJsZS1zdHJlYW0nO1xuaW1wb3J0IHsgc2V0RnVuY3Rpb25OYW1lLCB0eXBlSXNPYmplY3QgfSBmcm9tICcuL2hlbHBlcnMvbWlzY2VsbGFuZW91cyc7XG5pbXBvcnQgeyBJc05vbk5lZ2F0aXZlTnVtYmVyIH0gZnJvbSAnLi9hYnN0cmFjdC1vcHMvbWlzY2VsbGFuZW91cyc7XG5pbXBvcnQgeyBjb252ZXJ0UXVldWluZ1N0cmF0ZWd5IH0gZnJvbSAnLi92YWxpZGF0b3JzL3F1ZXVpbmctc3RyYXRlZ3knO1xuaW1wb3J0IHsgRXh0cmFjdEhpZ2hXYXRlck1hcmssIEV4dHJhY3RTaXplQWxnb3JpdGhtIH0gZnJvbSAnLi9hYnN0cmFjdC1vcHMvcXVldWluZy1zdHJhdGVneSc7XG5pbXBvcnQgdHlwZSB7XG4gIFRyYW5zZm9ybWVyLFxuICBUcmFuc2Zvcm1lckNhbmNlbENhbGxiYWNrLFxuICBUcmFuc2Zvcm1lckZsdXNoQ2FsbGJhY2ssXG4gIFRyYW5zZm9ybWVyU3RhcnRDYWxsYmFjayxcbiAgVHJhbnNmb3JtZXJUcmFuc2Zvcm1DYWxsYmFjayxcbiAgVmFsaWRhdGVkVHJhbnNmb3JtZXJcbn0gZnJvbSAnLi90cmFuc2Zvcm0tc3RyZWFtL3RyYW5zZm9ybWVyJztcbmltcG9ydCB7IGNvbnZlcnRUcmFuc2Zvcm1lciB9IGZyb20gJy4vdmFsaWRhdG9ycy90cmFuc2Zvcm1lcic7XG5cbi8vIENsYXNzIFRyYW5zZm9ybVN0cmVhbVxuXG4vKipcbiAqIEEgdHJhbnNmb3JtIHN0cmVhbSBjb25zaXN0cyBvZiBhIHBhaXIgb2Ygc3RyZWFtczogYSB7QGxpbmsgV3JpdGFibGVTdHJlYW0gfCB3cml0YWJsZSBzdHJlYW19LFxuICoga25vd24gYXMgaXRzIHdyaXRhYmxlIHNpZGUsIGFuZCBhIHtAbGluayBSZWFkYWJsZVN0cmVhbSB8IHJlYWRhYmxlIHN0cmVhbX0sIGtub3duIGFzIGl0cyByZWFkYWJsZSBzaWRlLlxuICogSW4gYSBtYW5uZXIgc3BlY2lmaWMgdG8gdGhlIHRyYW5zZm9ybSBzdHJlYW0gaW4gcXVlc3Rpb24sIHdyaXRlcyB0byB0aGUgd3JpdGFibGUgc2lkZSByZXN1bHQgaW4gbmV3IGRhdGEgYmVpbmdcbiAqIG1hZGUgYXZhaWxhYmxlIGZvciByZWFkaW5nIGZyb20gdGhlIHJlYWRhYmxlIHNpZGUuXG4gKlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY2xhc3MgVHJhbnNmb3JtU3RyZWFtPEkgPSBhbnksIE8gPSBhbnk+IHtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfd3JpdGFibGUhOiBXcml0YWJsZVN0cmVhbTxJPjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcmVhZGFibGUhOiBEZWZhdWx0UmVhZGFibGVTdHJlYW08Tz47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2JhY2twcmVzc3VyZSE6IGJvb2xlYW47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2JhY2twcmVzc3VyZUNoYW5nZVByb21pc2UhOiBQcm9taXNlPHZvaWQ+O1xuICAvKiogQGludGVybmFsICovXG4gIF9iYWNrcHJlc3N1cmVDaGFuZ2VQcm9taXNlX3Jlc29sdmUhOiAoKSA9PiB2b2lkO1xuICAvKiogQGludGVybmFsICovXG4gIF90cmFuc2Zvcm1TdHJlYW1Db250cm9sbGVyITogVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8Tz47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgdHJhbnNmb3JtZXI/OiBUcmFuc2Zvcm1lcjxJLCBPPixcbiAgICB3cml0YWJsZVN0cmF0ZWd5PzogUXVldWluZ1N0cmF0ZWd5PEk+LFxuICAgIHJlYWRhYmxlU3RyYXRlZ3k/OiBRdWV1aW5nU3RyYXRlZ3k8Tz5cbiAgKTtcbiAgY29uc3RydWN0b3IocmF3VHJhbnNmb3JtZXI6IFRyYW5zZm9ybWVyPEksIE8+IHwgbnVsbCB8IHVuZGVmaW5lZCA9IHt9LFxuICAgICAgICAgICAgICByYXdXcml0YWJsZVN0cmF0ZWd5OiBRdWV1aW5nU3RyYXRlZ3k8ST4gfCBudWxsIHwgdW5kZWZpbmVkID0ge30sXG4gICAgICAgICAgICAgIHJhd1JlYWRhYmxlU3RyYXRlZ3k6IFF1ZXVpbmdTdHJhdGVneTxPPiB8IG51bGwgfCB1bmRlZmluZWQgPSB7fSkge1xuICAgIGlmIChyYXdUcmFuc2Zvcm1lciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByYXdUcmFuc2Zvcm1lciA9IG51bGw7XG4gICAgfVxuXG4gICAgY29uc3Qgd3JpdGFibGVTdHJhdGVneSA9IGNvbnZlcnRRdWV1aW5nU3RyYXRlZ3kocmF3V3JpdGFibGVTdHJhdGVneSwgJ1NlY29uZCBwYXJhbWV0ZXInKTtcbiAgICBjb25zdCByZWFkYWJsZVN0cmF0ZWd5ID0gY29udmVydFF1ZXVpbmdTdHJhdGVneShyYXdSZWFkYWJsZVN0cmF0ZWd5LCAnVGhpcmQgcGFyYW1ldGVyJyk7XG5cbiAgICBjb25zdCB0cmFuc2Zvcm1lciA9IGNvbnZlcnRUcmFuc2Zvcm1lcihyYXdUcmFuc2Zvcm1lciwgJ0ZpcnN0IHBhcmFtZXRlcicpO1xuICAgIGlmICh0cmFuc2Zvcm1lci5yZWFkYWJsZVR5cGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0ludmFsaWQgcmVhZGFibGVUeXBlIHNwZWNpZmllZCcpO1xuICAgIH1cbiAgICBpZiAodHJhbnNmb3JtZXIud3JpdGFibGVUeXBlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbnZhbGlkIHdyaXRhYmxlVHlwZSBzcGVjaWZpZWQnKTtcbiAgICB9XG5cbiAgICBjb25zdCByZWFkYWJsZUhpZ2hXYXRlck1hcmsgPSBFeHRyYWN0SGlnaFdhdGVyTWFyayhyZWFkYWJsZVN0cmF0ZWd5LCAwKTtcbiAgICBjb25zdCByZWFkYWJsZVNpemVBbGdvcml0aG0gPSBFeHRyYWN0U2l6ZUFsZ29yaXRobShyZWFkYWJsZVN0cmF0ZWd5KTtcbiAgICBjb25zdCB3cml0YWJsZUhpZ2hXYXRlck1hcmsgPSBFeHRyYWN0SGlnaFdhdGVyTWFyayh3cml0YWJsZVN0cmF0ZWd5LCAxKTtcbiAgICBjb25zdCB3cml0YWJsZVNpemVBbGdvcml0aG0gPSBFeHRyYWN0U2l6ZUFsZ29yaXRobSh3cml0YWJsZVN0cmF0ZWd5KTtcblxuICAgIGxldCBzdGFydFByb21pc2VfcmVzb2x2ZSE6ICh2YWx1ZTogdm9pZCB8IFByb21pc2VMaWtlPHZvaWQ+KSA9PiB2b2lkO1xuICAgIGNvbnN0IHN0YXJ0UHJvbWlzZSA9IG5ld1Byb21pc2U8dm9pZD4ocmVzb2x2ZSA9PiB7XG4gICAgICBzdGFydFByb21pc2VfcmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgfSk7XG5cbiAgICBJbml0aWFsaXplVHJhbnNmb3JtU3RyZWFtKFxuICAgICAgdGhpcywgc3RhcnRQcm9taXNlLCB3cml0YWJsZUhpZ2hXYXRlck1hcmssIHdyaXRhYmxlU2l6ZUFsZ29yaXRobSwgcmVhZGFibGVIaWdoV2F0ZXJNYXJrLCByZWFkYWJsZVNpemVBbGdvcml0aG1cbiAgICApO1xuICAgIFNldFVwVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJGcm9tVHJhbnNmb3JtZXIodGhpcywgdHJhbnNmb3JtZXIpO1xuXG4gICAgaWYgKHRyYW5zZm9ybWVyLnN0YXJ0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHN0YXJ0UHJvbWlzZV9yZXNvbHZlKHRyYW5zZm9ybWVyLnN0YXJ0KHRoaXMuX3RyYW5zZm9ybVN0cmVhbUNvbnRyb2xsZXIpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhcnRQcm9taXNlX3Jlc29sdmUodW5kZWZpbmVkKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhlIHJlYWRhYmxlIHNpZGUgb2YgdGhlIHRyYW5zZm9ybSBzdHJlYW0uXG4gICAqL1xuICBnZXQgcmVhZGFibGUoKTogUmVhZGFibGVTdHJlYW08Tz4ge1xuICAgIGlmICghSXNUcmFuc2Zvcm1TdHJlYW0odGhpcykpIHtcbiAgICAgIHRocm93IHN0cmVhbUJyYW5kQ2hlY2tFeGNlcHRpb24oJ3JlYWRhYmxlJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3JlYWRhYmxlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSB3cml0YWJsZSBzaWRlIG9mIHRoZSB0cmFuc2Zvcm0gc3RyZWFtLlxuICAgKi9cbiAgZ2V0IHdyaXRhYmxlKCk6IFdyaXRhYmxlU3RyZWFtPEk+IHtcbiAgICBpZiAoIUlzVHJhbnNmb3JtU3RyZWFtKHRoaXMpKSB7XG4gICAgICB0aHJvdyBzdHJlYW1CcmFuZENoZWNrRXhjZXB0aW9uKCd3cml0YWJsZScpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl93cml0YWJsZTtcbiAgfVxufVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyhUcmFuc2Zvcm1TdHJlYW0ucHJvdG90eXBlLCB7XG4gIHJlYWRhYmxlOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgd3JpdGFibGU6IHsgZW51bWVyYWJsZTogdHJ1ZSB9XG59KTtcbmlmICh0eXBlb2YgU3ltYm9sLnRvU3RyaW5nVGFnID09PSAnc3ltYm9sJykge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVHJhbnNmb3JtU3RyZWFtLnByb3RvdHlwZSwgU3ltYm9sLnRvU3RyaW5nVGFnLCB7XG4gICAgdmFsdWU6ICdUcmFuc2Zvcm1TdHJlYW0nLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbn1cblxuZXhwb3J0IHR5cGUge1xuICBUcmFuc2Zvcm1lcixcbiAgVHJhbnNmb3JtZXJDYW5jZWxDYWxsYmFjayxcbiAgVHJhbnNmb3JtZXJTdGFydENhbGxiYWNrLFxuICBUcmFuc2Zvcm1lckZsdXNoQ2FsbGJhY2ssXG4gIFRyYW5zZm9ybWVyVHJhbnNmb3JtQ2FsbGJhY2tcbn07XG5cbi8vIFRyYW5zZm9ybSBTdHJlYW0gQWJzdHJhY3QgT3BlcmF0aW9uc1xuXG5leHBvcnQgZnVuY3Rpb24gQ3JlYXRlVHJhbnNmb3JtU3RyZWFtPEksIE8+KHN0YXJ0QWxnb3JpdGhtOiAoKSA9PiB2b2lkIHwgUHJvbWlzZUxpa2U8dm9pZD4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybUFsZ29yaXRobTogKGNodW5rOiBJKSA9PiBQcm9taXNlPHZvaWQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbHVzaEFsZ29yaXRobTogKCkgPT4gUHJvbWlzZTx2b2lkPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuY2VsQWxnb3JpdGhtOiAocmVhc29uOiBhbnkpID0+IFByb21pc2U8dm9pZD4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdyaXRhYmxlSGlnaFdhdGVyTWFyayA9IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdyaXRhYmxlU2l6ZUFsZ29yaXRobTogUXVldWluZ1N0cmF0ZWd5U2l6ZUNhbGxiYWNrPEk+ID0gKCkgPT4gMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVhZGFibGVIaWdoV2F0ZXJNYXJrID0gMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVhZGFibGVTaXplQWxnb3JpdGhtOiBRdWV1aW5nU3RyYXRlZ3lTaXplQ2FsbGJhY2s8Tz4gPSAoKSA9PiAxKSB7XG4gIGFzc2VydChJc05vbk5lZ2F0aXZlTnVtYmVyKHdyaXRhYmxlSGlnaFdhdGVyTWFyaykpO1xuICBhc3NlcnQoSXNOb25OZWdhdGl2ZU51bWJlcihyZWFkYWJsZUhpZ2hXYXRlck1hcmspKTtcblxuICBjb25zdCBzdHJlYW06IFRyYW5zZm9ybVN0cmVhbTxJLCBPPiA9IE9iamVjdC5jcmVhdGUoVHJhbnNmb3JtU3RyZWFtLnByb3RvdHlwZSk7XG5cbiAgbGV0IHN0YXJ0UHJvbWlzZV9yZXNvbHZlITogKHZhbHVlOiB2b2lkIHwgUHJvbWlzZUxpa2U8dm9pZD4pID0+IHZvaWQ7XG4gIGNvbnN0IHN0YXJ0UHJvbWlzZSA9IG5ld1Byb21pc2U8dm9pZD4ocmVzb2x2ZSA9PiB7XG4gICAgc3RhcnRQcm9taXNlX3Jlc29sdmUgPSByZXNvbHZlO1xuICB9KTtcblxuICBJbml0aWFsaXplVHJhbnNmb3JtU3RyZWFtKHN0cmVhbSwgc3RhcnRQcm9taXNlLCB3cml0YWJsZUhpZ2hXYXRlck1hcmssIHdyaXRhYmxlU2l6ZUFsZ29yaXRobSwgcmVhZGFibGVIaWdoV2F0ZXJNYXJrLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlYWRhYmxlU2l6ZUFsZ29yaXRobSk7XG5cbiAgY29uc3QgY29udHJvbGxlcjogVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8Tz4gPSBPYmplY3QuY3JlYXRlKFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyLnByb3RvdHlwZSk7XG5cbiAgU2V0VXBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlcihzdHJlYW0sIGNvbnRyb2xsZXIsIHRyYW5zZm9ybUFsZ29yaXRobSwgZmx1c2hBbGdvcml0aG0sIGNhbmNlbEFsZ29yaXRobSk7XG5cbiAgY29uc3Qgc3RhcnRSZXN1bHQgPSBzdGFydEFsZ29yaXRobSgpO1xuICBzdGFydFByb21pc2VfcmVzb2x2ZShzdGFydFJlc3VsdCk7XG4gIHJldHVybiBzdHJlYW07XG59XG5cbmZ1bmN0aW9uIEluaXRpYWxpemVUcmFuc2Zvcm1TdHJlYW08SSwgTz4oc3RyZWFtOiBUcmFuc2Zvcm1TdHJlYW08SSwgTz4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0UHJvbWlzZTogUHJvbWlzZTx2b2lkPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd3JpdGFibGVIaWdoV2F0ZXJNYXJrOiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdyaXRhYmxlU2l6ZUFsZ29yaXRobTogUXVldWluZ1N0cmF0ZWd5U2l6ZUNhbGxiYWNrPEk+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWFkYWJsZUhpZ2hXYXRlck1hcms6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVhZGFibGVTaXplQWxnb3JpdGhtOiBRdWV1aW5nU3RyYXRlZ3lTaXplQ2FsbGJhY2s8Tz4pIHtcbiAgZnVuY3Rpb24gc3RhcnRBbGdvcml0aG0oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHN0YXJ0UHJvbWlzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHdyaXRlQWxnb3JpdGhtKGNodW5rOiBJKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIFRyYW5zZm9ybVN0cmVhbURlZmF1bHRTaW5rV3JpdGVBbGdvcml0aG0oc3RyZWFtLCBjaHVuayk7XG4gIH1cblxuICBmdW5jdGlvbiBhYm9ydEFsZ29yaXRobShyZWFzb246IGFueSk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0U2lua0Fib3J0QWxnb3JpdGhtKHN0cmVhbSwgcmVhc29uKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsb3NlQWxnb3JpdGhtKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0U2lua0Nsb3NlQWxnb3JpdGhtKHN0cmVhbSk7XG4gIH1cblxuICBzdHJlYW0uX3dyaXRhYmxlID0gQ3JlYXRlV3JpdGFibGVTdHJlYW0oc3RhcnRBbGdvcml0aG0sIHdyaXRlQWxnb3JpdGhtLCBjbG9zZUFsZ29yaXRobSwgYWJvcnRBbGdvcml0aG0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3cml0YWJsZUhpZ2hXYXRlck1hcmssIHdyaXRhYmxlU2l6ZUFsZ29yaXRobSk7XG5cbiAgZnVuY3Rpb24gcHVsbEFsZ29yaXRobSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gVHJhbnNmb3JtU3RyZWFtRGVmYXVsdFNvdXJjZVB1bGxBbGdvcml0aG0oc3RyZWFtKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbmNlbEFsZ29yaXRobShyZWFzb246IGFueSk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0U291cmNlQ2FuY2VsQWxnb3JpdGhtKHN0cmVhbSwgcmVhc29uKTtcbiAgfVxuXG4gIHN0cmVhbS5fcmVhZGFibGUgPSBDcmVhdGVSZWFkYWJsZVN0cmVhbShzdGFydEFsZ29yaXRobSwgcHVsbEFsZ29yaXRobSwgY2FuY2VsQWxnb3JpdGhtLCByZWFkYWJsZUhpZ2hXYXRlck1hcmssXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWFkYWJsZVNpemVBbGdvcml0aG0pO1xuXG4gIC8vIFRoZSBbW2JhY2twcmVzc3VyZV1dIHNsb3QgaXMgc2V0IHRvIHVuZGVmaW5lZCBzbyB0aGF0IGl0IGNhbiBiZSBpbml0aWFsaXNlZCBieSBUcmFuc2Zvcm1TdHJlYW1TZXRCYWNrcHJlc3N1cmUuXG4gIHN0cmVhbS5fYmFja3ByZXNzdXJlID0gdW5kZWZpbmVkITtcbiAgc3RyZWFtLl9iYWNrcHJlc3N1cmVDaGFuZ2VQcm9taXNlID0gdW5kZWZpbmVkITtcbiAgc3RyZWFtLl9iYWNrcHJlc3N1cmVDaGFuZ2VQcm9taXNlX3Jlc29sdmUgPSB1bmRlZmluZWQhO1xuICBUcmFuc2Zvcm1TdHJlYW1TZXRCYWNrcHJlc3N1cmUoc3RyZWFtLCB0cnVlKTtcblxuICBzdHJlYW0uX3RyYW5zZm9ybVN0cmVhbUNvbnRyb2xsZXIgPSB1bmRlZmluZWQhO1xufVxuXG5mdW5jdGlvbiBJc1RyYW5zZm9ybVN0cmVhbSh4OiB1bmtub3duKTogeCBpcyBUcmFuc2Zvcm1TdHJlYW0ge1xuICBpZiAoIXR5cGVJc09iamVjdCh4KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHgsICdfdHJhbnNmb3JtU3RyZWFtQ29udHJvbGxlcicpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHggaW5zdGFuY2VvZiBUcmFuc2Zvcm1TdHJlYW07XG59XG5cbi8vIFRoaXMgaXMgYSBuby1vcCBpZiBib3RoIHNpZGVzIGFyZSBhbHJlYWR5IGVycm9yZWQuXG5mdW5jdGlvbiBUcmFuc2Zvcm1TdHJlYW1FcnJvcihzdHJlYW06IFRyYW5zZm9ybVN0cmVhbSwgZTogYW55KSB7XG4gIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFcnJvcihzdHJlYW0uX3JlYWRhYmxlLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIsIGUpO1xuICBUcmFuc2Zvcm1TdHJlYW1FcnJvcldyaXRhYmxlQW5kVW5ibG9ja1dyaXRlKHN0cmVhbSwgZSk7XG59XG5cbmZ1bmN0aW9uIFRyYW5zZm9ybVN0cmVhbUVycm9yV3JpdGFibGVBbmRVbmJsb2NrV3JpdGUoc3RyZWFtOiBUcmFuc2Zvcm1TdHJlYW0sIGU6IGFueSkge1xuICBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlckNsZWFyQWxnb3JpdGhtcyhzdHJlYW0uX3RyYW5zZm9ybVN0cmVhbUNvbnRyb2xsZXIpO1xuICBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRXJyb3JJZk5lZWRlZChzdHJlYW0uX3dyaXRhYmxlLl93cml0YWJsZVN0cmVhbUNvbnRyb2xsZXIsIGUpO1xuICBUcmFuc2Zvcm1TdHJlYW1VbmJsb2NrV3JpdGUoc3RyZWFtKTtcbn1cblxuZnVuY3Rpb24gVHJhbnNmb3JtU3RyZWFtVW5ibG9ja1dyaXRlKHN0cmVhbTogVHJhbnNmb3JtU3RyZWFtKSB7XG4gIGlmIChzdHJlYW0uX2JhY2twcmVzc3VyZSkge1xuICAgIC8vIFByZXRlbmQgdGhhdCBwdWxsKCkgd2FzIGNhbGxlZCB0byBwZXJtaXQgYW55IHBlbmRpbmcgd3JpdGUoKSBjYWxscyB0byBjb21wbGV0ZS4gVHJhbnNmb3JtU3RyZWFtU2V0QmFja3ByZXNzdXJlKClcbiAgICAvLyBjYW5ub3QgYmUgY2FsbGVkIGZyb20gZW5xdWV1ZSgpIG9yIHB1bGwoKSBvbmNlIHRoZSBSZWFkYWJsZVN0cmVhbSBpcyBlcnJvcmVkLCBzbyB0aGlzIHdpbGwgd2lsbCBiZSB0aGUgZmluYWwgdGltZVxuICAgIC8vIF9iYWNrcHJlc3N1cmUgaXMgc2V0LlxuICAgIFRyYW5zZm9ybVN0cmVhbVNldEJhY2twcmVzc3VyZShzdHJlYW0sIGZhbHNlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBUcmFuc2Zvcm1TdHJlYW1TZXRCYWNrcHJlc3N1cmUoc3RyZWFtOiBUcmFuc2Zvcm1TdHJlYW0sIGJhY2twcmVzc3VyZTogYm9vbGVhbikge1xuICAvLyBQYXNzZXMgYWxzbyB3aGVuIGNhbGxlZCBkdXJpbmcgY29uc3RydWN0aW9uLlxuICBhc3NlcnQoc3RyZWFtLl9iYWNrcHJlc3N1cmUgIT09IGJhY2twcmVzc3VyZSk7XG5cbiAgaWYgKHN0cmVhbS5fYmFja3ByZXNzdXJlQ2hhbmdlUHJvbWlzZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgc3RyZWFtLl9iYWNrcHJlc3N1cmVDaGFuZ2VQcm9taXNlX3Jlc29sdmUoKTtcbiAgfVxuXG4gIHN0cmVhbS5fYmFja3ByZXNzdXJlQ2hhbmdlUHJvbWlzZSA9IG5ld1Byb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgc3RyZWFtLl9iYWNrcHJlc3N1cmVDaGFuZ2VQcm9taXNlX3Jlc29sdmUgPSByZXNvbHZlO1xuICB9KTtcblxuICBzdHJlYW0uX2JhY2twcmVzc3VyZSA9IGJhY2twcmVzc3VyZTtcbn1cblxuLy8gQ2xhc3MgVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJcblxuLyoqXG4gKiBBbGxvd3MgY29udHJvbCBvZiB0aGUge0BsaW5rIFJlYWRhYmxlU3RyZWFtfSBhbmQge0BsaW5rIFdyaXRhYmxlU3RyZWFtfSBvZiB0aGUgYXNzb2NpYXRlZCB7QGxpbmsgVHJhbnNmb3JtU3RyZWFtfS5cbiAqXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjbGFzcyBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxPPiB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2NvbnRyb2xsZWRUcmFuc2Zvcm1TdHJlYW06IFRyYW5zZm9ybVN0cmVhbTxhbnksIE8+O1xuICAvKiogQGludGVybmFsICovXG4gIF9maW5pc2hQcm9taXNlOiBQcm9taXNlPHVuZGVmaW5lZD4gfCB1bmRlZmluZWQ7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2ZpbmlzaFByb21pc2VfcmVzb2x2ZT86ICh2YWx1ZT86IHVuZGVmaW5lZCkgPT4gdm9pZDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfZmluaXNoUHJvbWlzZV9yZWplY3Q/OiAocmVhc29uOiBhbnkpID0+IHZvaWQ7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3RyYW5zZm9ybUFsZ29yaXRobTogKGNodW5rOiBhbnkpID0+IFByb21pc2U8dm9pZD47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2ZsdXNoQWxnb3JpdGhtOiAoKSA9PiBQcm9taXNlPHZvaWQ+O1xuICAvKiogQGludGVybmFsICovXG4gIF9jYW5jZWxBbGdvcml0aG06IChyZWFzb246IGFueSkgPT4gUHJvbWlzZTx2b2lkPjtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0lsbGVnYWwgY29uc3RydWN0b3InKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBkZXNpcmVkIHNpemUgdG8gZmlsbCB0aGUgcmVhZGFibGUgc2lkZeKAmXMgaW50ZXJuYWwgcXVldWUuIEl0IGNhbiBiZSBuZWdhdGl2ZSwgaWYgdGhlIHF1ZXVlIGlzIG92ZXItZnVsbC5cbiAgICovXG4gIGdldCBkZXNpcmVkU2l6ZSgpOiBudW1iZXIgfCBudWxsIHtcbiAgICBpZiAoIUlzVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIodGhpcykpIHtcbiAgICAgIHRocm93IGRlZmF1bHRDb250cm9sbGVyQnJhbmRDaGVja0V4Y2VwdGlvbignZGVzaXJlZFNpemUnKTtcbiAgICB9XG5cbiAgICBjb25zdCByZWFkYWJsZUNvbnRyb2xsZXIgPSB0aGlzLl9jb250cm9sbGVkVHJhbnNmb3JtU3RyZWFtLl9yZWFkYWJsZS5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyO1xuICAgIHJldHVybiBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyR2V0RGVzaXJlZFNpemUocmVhZGFibGVDb250cm9sbGVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbnF1ZXVlcyB0aGUgZ2l2ZW4gY2h1bmsgYGNodW5rYCBpbiB0aGUgcmVhZGFibGUgc2lkZSBvZiB0aGUgY29udHJvbGxlZCB0cmFuc2Zvcm0gc3RyZWFtLlxuICAgKi9cbiAgZW5xdWV1ZShjaHVuazogTyk6IHZvaWQ7XG4gIGVucXVldWUoY2h1bms6IE8gPSB1bmRlZmluZWQhKTogdm9pZCB7XG4gICAgaWYgKCFJc1RyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyKHRoaXMpKSB7XG4gICAgICB0aHJvdyBkZWZhdWx0Q29udHJvbGxlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ2VucXVldWUnKTtcbiAgICB9XG5cbiAgICBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlckVucXVldWUodGhpcywgY2h1bmspO1xuICB9XG5cbiAgLyoqXG4gICAqIEVycm9ycyBib3RoIHRoZSByZWFkYWJsZSBzaWRlIGFuZCB0aGUgd3JpdGFibGUgc2lkZSBvZiB0aGUgY29udHJvbGxlZCB0cmFuc2Zvcm0gc3RyZWFtLCBtYWtpbmcgYWxsIGZ1dHVyZVxuICAgKiBpbnRlcmFjdGlvbnMgd2l0aCBpdCBmYWlsIHdpdGggdGhlIGdpdmVuIGVycm9yIGBlYC4gQW55IGNodW5rcyBxdWV1ZWQgZm9yIHRyYW5zZm9ybWF0aW9uIHdpbGwgYmUgZGlzY2FyZGVkLlxuICAgKi9cbiAgZXJyb3IocmVhc29uOiBhbnkgPSB1bmRlZmluZWQpOiB2b2lkIHtcbiAgICBpZiAoIUlzVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIodGhpcykpIHtcbiAgICAgIHRocm93IGRlZmF1bHRDb250cm9sbGVyQnJhbmRDaGVja0V4Y2VwdGlvbignZXJyb3InKTtcbiAgICB9XG5cbiAgICBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlckVycm9yKHRoaXMsIHJlYXNvbik7XG4gIH1cblxuICAvKipcbiAgICogQ2xvc2VzIHRoZSByZWFkYWJsZSBzaWRlIGFuZCBlcnJvcnMgdGhlIHdyaXRhYmxlIHNpZGUgb2YgdGhlIGNvbnRyb2xsZWQgdHJhbnNmb3JtIHN0cmVhbS4gVGhpcyBpcyB1c2VmdWwgd2hlbiB0aGVcbiAgICogdHJhbnNmb3JtZXIgb25seSBuZWVkcyB0byBjb25zdW1lIGEgcG9ydGlvbiBvZiB0aGUgY2h1bmtzIHdyaXR0ZW4gdG8gdGhlIHdyaXRhYmxlIHNpZGUuXG4gICAqL1xuICB0ZXJtaW5hdGUoKTogdm9pZCB7XG4gICAgaWYgKCFJc1RyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyKHRoaXMpKSB7XG4gICAgICB0aHJvdyBkZWZhdWx0Q29udHJvbGxlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ3Rlcm1pbmF0ZScpO1xuICAgIH1cblxuICAgIFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyVGVybWluYXRlKHRoaXMpO1xuICB9XG59XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyLnByb3RvdHlwZSwge1xuICBlbnF1ZXVlOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgZXJyb3I6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICB0ZXJtaW5hdGU6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICBkZXNpcmVkU2l6ZTogeyBlbnVtZXJhYmxlOiB0cnVlIH1cbn0pO1xuc2V0RnVuY3Rpb25OYW1lKFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyLnByb3RvdHlwZS5lbnF1ZXVlLCAnZW5xdWV1ZScpO1xuc2V0RnVuY3Rpb25OYW1lKFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyLnByb3RvdHlwZS5lcnJvciwgJ2Vycm9yJyk7XG5zZXRGdW5jdGlvbk5hbWUoVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIucHJvdG90eXBlLnRlcm1pbmF0ZSwgJ3Rlcm1pbmF0ZScpO1xuaWYgKHR5cGVvZiBTeW1ib2wudG9TdHJpbmdUYWcgPT09ICdzeW1ib2wnKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlci5wcm90b3R5cGUsIFN5bWJvbC50b1N0cmluZ1RhZywge1xuICAgIHZhbHVlOiAnVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXInLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbn1cblxuLy8gVHJhbnNmb3JtIFN0cmVhbSBEZWZhdWx0IENvbnRyb2xsZXIgQWJzdHJhY3QgT3BlcmF0aW9uc1xuXG5mdW5jdGlvbiBJc1RyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyPE8gPSBhbnk+KHg6IGFueSk6IHggaXMgVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8Tz4ge1xuICBpZiAoIXR5cGVJc09iamVjdCh4KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHgsICdfY29udHJvbGxlZFRyYW5zZm9ybVN0cmVhbScpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHggaW5zdGFuY2VvZiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlcjtcbn1cblxuZnVuY3Rpb24gU2V0VXBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxJLCBPPihzdHJlYW06IFRyYW5zZm9ybVN0cmVhbTxJLCBPPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8Tz4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybUFsZ29yaXRobTogKGNodW5rOiBJKSA9PiBQcm9taXNlPHZvaWQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbHVzaEFsZ29yaXRobTogKCkgPT4gUHJvbWlzZTx2b2lkPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuY2VsQWxnb3JpdGhtOiAocmVhc29uOiBhbnkpID0+IFByb21pc2U8dm9pZD4pIHtcbiAgYXNzZXJ0KElzVHJhbnNmb3JtU3RyZWFtKHN0cmVhbSkpO1xuICBhc3NlcnQoc3RyZWFtLl90cmFuc2Zvcm1TdHJlYW1Db250cm9sbGVyID09PSB1bmRlZmluZWQpO1xuXG4gIGNvbnRyb2xsZXIuX2NvbnRyb2xsZWRUcmFuc2Zvcm1TdHJlYW0gPSBzdHJlYW07XG4gIHN0cmVhbS5fdHJhbnNmb3JtU3RyZWFtQ29udHJvbGxlciA9IGNvbnRyb2xsZXI7XG5cbiAgY29udHJvbGxlci5fdHJhbnNmb3JtQWxnb3JpdGhtID0gdHJhbnNmb3JtQWxnb3JpdGhtO1xuICBjb250cm9sbGVyLl9mbHVzaEFsZ29yaXRobSA9IGZsdXNoQWxnb3JpdGhtO1xuICBjb250cm9sbGVyLl9jYW5jZWxBbGdvcml0aG0gPSBjYW5jZWxBbGdvcml0aG07XG5cbiAgY29udHJvbGxlci5fZmluaXNoUHJvbWlzZSA9IHVuZGVmaW5lZDtcbiAgY29udHJvbGxlci5fZmluaXNoUHJvbWlzZV9yZXNvbHZlID0gdW5kZWZpbmVkO1xuICBjb250cm9sbGVyLl9maW5pc2hQcm9taXNlX3JlamVjdCA9IHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gU2V0VXBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlckZyb21UcmFuc2Zvcm1lcjxJLCBPPihzdHJlYW06IFRyYW5zZm9ybVN0cmVhbTxJLCBPPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtZXI6IFZhbGlkYXRlZFRyYW5zZm9ybWVyPEksIE8+KSB7XG4gIGNvbnN0IGNvbnRyb2xsZXI6IFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyPE8+ID0gT2JqZWN0LmNyZWF0ZShUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlci5wcm90b3R5cGUpO1xuXG4gIGxldCB0cmFuc2Zvcm1BbGdvcml0aG06IChjaHVuazogSSkgPT4gUHJvbWlzZTx2b2lkPjtcbiAgbGV0IGZsdXNoQWxnb3JpdGhtOiAoKSA9PiBQcm9taXNlPHZvaWQ+O1xuICBsZXQgY2FuY2VsQWxnb3JpdGhtOiAocmVhc29uOiBhbnkpID0+IFByb21pc2U8dm9pZD47XG5cbiAgaWYgKHRyYW5zZm9ybWVyLnRyYW5zZm9ybSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdHJhbnNmb3JtQWxnb3JpdGhtID0gY2h1bmsgPT4gdHJhbnNmb3JtZXIudHJhbnNmb3JtIShjaHVuaywgY29udHJvbGxlcik7XG4gIH0gZWxzZSB7XG4gICAgdHJhbnNmb3JtQWxnb3JpdGhtID0gY2h1bmsgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFbnF1ZXVlKGNvbnRyb2xsZXIsIGNodW5rIGFzIHVua25vd24gYXMgTyk7XG4gICAgICAgIHJldHVybiBwcm9taXNlUmVzb2x2ZWRXaXRoKHVuZGVmaW5lZCk7XG4gICAgICB9IGNhdGNoICh0cmFuc2Zvcm1SZXN1bHRFKSB7XG4gICAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKHRyYW5zZm9ybVJlc3VsdEUpO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBpZiAodHJhbnNmb3JtZXIuZmx1c2ggIT09IHVuZGVmaW5lZCkge1xuICAgIGZsdXNoQWxnb3JpdGhtID0gKCkgPT4gdHJhbnNmb3JtZXIuZmx1c2ghKGNvbnRyb2xsZXIpO1xuICB9IGVsc2Uge1xuICAgIGZsdXNoQWxnb3JpdGhtID0gKCkgPT4gcHJvbWlzZVJlc29sdmVkV2l0aCh1bmRlZmluZWQpO1xuICB9XG5cbiAgaWYgKHRyYW5zZm9ybWVyLmNhbmNlbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgY2FuY2VsQWxnb3JpdGhtID0gcmVhc29uID0+IHRyYW5zZm9ybWVyLmNhbmNlbCEocmVhc29uKTtcbiAgfSBlbHNlIHtcbiAgICBjYW5jZWxBbGdvcml0aG0gPSAoKSA9PiBwcm9taXNlUmVzb2x2ZWRXaXRoKHVuZGVmaW5lZCk7XG4gIH1cblxuICBTZXRVcFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyKHN0cmVhbSwgY29udHJvbGxlciwgdHJhbnNmb3JtQWxnb3JpdGhtLCBmbHVzaEFsZ29yaXRobSwgY2FuY2VsQWxnb3JpdGhtKTtcbn1cblxuZnVuY3Rpb24gVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDbGVhckFsZ29yaXRobXMoY29udHJvbGxlcjogVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8YW55Pikge1xuICBjb250cm9sbGVyLl90cmFuc2Zvcm1BbGdvcml0aG0gPSB1bmRlZmluZWQhO1xuICBjb250cm9sbGVyLl9mbHVzaEFsZ29yaXRobSA9IHVuZGVmaW5lZCE7XG4gIGNvbnRyb2xsZXIuX2NhbmNlbEFsZ29yaXRobSA9IHVuZGVmaW5lZCE7XG59XG5cbmZ1bmN0aW9uIFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyRW5xdWV1ZTxPPihjb250cm9sbGVyOiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxPPiwgY2h1bms6IE8pIHtcbiAgY29uc3Qgc3RyZWFtID0gY29udHJvbGxlci5fY29udHJvbGxlZFRyYW5zZm9ybVN0cmVhbTtcbiAgY29uc3QgcmVhZGFibGVDb250cm9sbGVyID0gc3RyZWFtLl9yZWFkYWJsZS5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyO1xuICBpZiAoIVJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDYW5DbG9zZU9yRW5xdWV1ZShyZWFkYWJsZUNvbnRyb2xsZXIpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignUmVhZGFibGUgc2lkZSBpcyBub3QgaW4gYSBzdGF0ZSB0aGF0IHBlcm1pdHMgZW5xdWV1ZScpO1xuICB9XG5cbiAgLy8gV2UgdGhyb3R0bGUgdHJhbnNmb3JtIGludm9jYXRpb25zIGJhc2VkIG9uIHRoZSBiYWNrcHJlc3N1cmUgb2YgdGhlIFJlYWRhYmxlU3RyZWFtLCBidXQgd2Ugc3RpbGxcbiAgLy8gYWNjZXB0IFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyRW5xdWV1ZSgpIGNhbGxzLlxuXG4gIHRyeSB7XG4gICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVucXVldWUocmVhZGFibGVDb250cm9sbGVyLCBjaHVuayk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyBUaGlzIGhhcHBlbnMgd2hlbiByZWFkYWJsZVN0cmF0ZWd5LnNpemUoKSB0aHJvd3MuXG4gICAgVHJhbnNmb3JtU3RyZWFtRXJyb3JXcml0YWJsZUFuZFVuYmxvY2tXcml0ZShzdHJlYW0sIGUpO1xuXG4gICAgdGhyb3cgc3RyZWFtLl9yZWFkYWJsZS5fc3RvcmVkRXJyb3I7XG4gIH1cblxuICBjb25zdCBiYWNrcHJlc3N1cmUgPSBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVySGFzQmFja3ByZXNzdXJlKHJlYWRhYmxlQ29udHJvbGxlcik7XG4gIGlmIChiYWNrcHJlc3N1cmUgIT09IHN0cmVhbS5fYmFja3ByZXNzdXJlKSB7XG4gICAgYXNzZXJ0KGJhY2twcmVzc3VyZSk7XG4gICAgVHJhbnNmb3JtU3RyZWFtU2V0QmFja3ByZXNzdXJlKHN0cmVhbSwgdHJ1ZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFcnJvcihjb250cm9sbGVyOiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxhbnk+LCBlOiBhbnkpIHtcbiAgVHJhbnNmb3JtU3RyZWFtRXJyb3IoY29udHJvbGxlci5fY29udHJvbGxlZFRyYW5zZm9ybVN0cmVhbSwgZSk7XG59XG5cbmZ1bmN0aW9uIFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyUGVyZm9ybVRyYW5zZm9ybTxJLCBPPihjb250cm9sbGVyOiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxPPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaHVuazogSSkge1xuICBjb25zdCB0cmFuc2Zvcm1Qcm9taXNlID0gY29udHJvbGxlci5fdHJhbnNmb3JtQWxnb3JpdGhtKGNodW5rKTtcbiAgcmV0dXJuIHRyYW5zZm9ybVByb21pc2VXaXRoKHRyYW5zZm9ybVByb21pc2UsIHVuZGVmaW5lZCwgciA9PiB7XG4gICAgVHJhbnNmb3JtU3RyZWFtRXJyb3IoY29udHJvbGxlci5fY29udHJvbGxlZFRyYW5zZm9ybVN0cmVhbSwgcik7XG4gICAgdGhyb3cgcjtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyVGVybWluYXRlPE8+KGNvbnRyb2xsZXI6IFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyPE8+KSB7XG4gIGNvbnN0IHN0cmVhbSA9IGNvbnRyb2xsZXIuX2NvbnRyb2xsZWRUcmFuc2Zvcm1TdHJlYW07XG4gIGNvbnN0IHJlYWRhYmxlQ29udHJvbGxlciA9IHN0cmVhbS5fcmVhZGFibGUuX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlcjtcblxuICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2xvc2UocmVhZGFibGVDb250cm9sbGVyKTtcblxuICBjb25zdCBlcnJvciA9IG5ldyBUeXBlRXJyb3IoJ1RyYW5zZm9ybVN0cmVhbSB0ZXJtaW5hdGVkJyk7XG4gIFRyYW5zZm9ybVN0cmVhbUVycm9yV3JpdGFibGVBbmRVbmJsb2NrV3JpdGUoc3RyZWFtLCBlcnJvcik7XG59XG5cbi8vIFRyYW5zZm9ybVN0cmVhbURlZmF1bHRTaW5rIEFsZ29yaXRobXNcblxuZnVuY3Rpb24gVHJhbnNmb3JtU3RyZWFtRGVmYXVsdFNpbmtXcml0ZUFsZ29yaXRobTxJLCBPPihzdHJlYW06IFRyYW5zZm9ybVN0cmVhbTxJLCBPPiwgY2h1bms6IEkpOiBQcm9taXNlPHZvaWQ+IHtcbiAgYXNzZXJ0KHN0cmVhbS5fd3JpdGFibGUuX3N0YXRlID09PSAnd3JpdGFibGUnKTtcblxuICBjb25zdCBjb250cm9sbGVyID0gc3RyZWFtLl90cmFuc2Zvcm1TdHJlYW1Db250cm9sbGVyO1xuXG4gIGlmIChzdHJlYW0uX2JhY2twcmVzc3VyZSkge1xuICAgIGNvbnN0IGJhY2twcmVzc3VyZUNoYW5nZVByb21pc2UgPSBzdHJlYW0uX2JhY2twcmVzc3VyZUNoYW5nZVByb21pc2U7XG4gICAgYXNzZXJ0KGJhY2twcmVzc3VyZUNoYW5nZVByb21pc2UgIT09IHVuZGVmaW5lZCk7XG4gICAgcmV0dXJuIHRyYW5zZm9ybVByb21pc2VXaXRoKGJhY2twcmVzc3VyZUNoYW5nZVByb21pc2UsICgpID0+IHtcbiAgICAgIGNvbnN0IHdyaXRhYmxlID0gc3RyZWFtLl93cml0YWJsZTtcbiAgICAgIGNvbnN0IHN0YXRlID0gd3JpdGFibGUuX3N0YXRlO1xuICAgICAgaWYgKHN0YXRlID09PSAnZXJyb3JpbmcnKSB7XG4gICAgICAgIHRocm93IHdyaXRhYmxlLl9zdG9yZWRFcnJvcjtcbiAgICAgIH1cbiAgICAgIGFzc2VydChzdGF0ZSA9PT0gJ3dyaXRhYmxlJyk7XG4gICAgICByZXR1cm4gVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJQZXJmb3JtVHJhbnNmb3JtPEksIE8+KGNvbnRyb2xsZXIsIGNodW5rKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlclBlcmZvcm1UcmFuc2Zvcm08SSwgTz4oY29udHJvbGxlciwgY2h1bmspO1xufVxuXG5mdW5jdGlvbiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0U2lua0Fib3J0QWxnb3JpdGhtPEksIE8+KHN0cmVhbTogVHJhbnNmb3JtU3RyZWFtPEksIE8+LCByZWFzb246IGFueSk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBjb250cm9sbGVyID0gc3RyZWFtLl90cmFuc2Zvcm1TdHJlYW1Db250cm9sbGVyO1xuICBpZiAoY29udHJvbGxlci5fZmluaXNoUHJvbWlzZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGNvbnRyb2xsZXIuX2ZpbmlzaFByb21pc2U7XG4gIH1cblxuICAvLyBzdHJlYW0uX3JlYWRhYmxlIGNhbm5vdCBjaGFuZ2UgYWZ0ZXIgY29uc3RydWN0aW9uLCBzbyBjYWNoaW5nIGl0IGFjcm9zcyBhIGNhbGwgdG8gdXNlciBjb2RlIGlzIHNhZmUuXG4gIGNvbnN0IHJlYWRhYmxlID0gc3RyZWFtLl9yZWFkYWJsZTtcblxuICAvLyBBc3NpZ24gdGhlIF9maW5pc2hQcm9taXNlIG5vdyBzbyB0aGF0IGlmIF9jYW5jZWxBbGdvcml0aG0gY2FsbHMgcmVhZGFibGUuY2FuY2VsKCkgaW50ZXJuYWxseSxcbiAgLy8gd2UgZG9uJ3QgcnVuIHRoZSBfY2FuY2VsQWxnb3JpdGhtIGFnYWluLlxuICBjb250cm9sbGVyLl9maW5pc2hQcm9taXNlID0gbmV3UHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29udHJvbGxlci5fZmluaXNoUHJvbWlzZV9yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICBjb250cm9sbGVyLl9maW5pc2hQcm9taXNlX3JlamVjdCA9IHJlamVjdDtcbiAgfSk7XG5cbiAgY29uc3QgY2FuY2VsUHJvbWlzZSA9IGNvbnRyb2xsZXIuX2NhbmNlbEFsZ29yaXRobShyZWFzb24pO1xuICBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlckNsZWFyQWxnb3JpdGhtcyhjb250cm9sbGVyKTtcblxuICB1cG9uUHJvbWlzZShjYW5jZWxQcm9taXNlLCAoKSA9PiB7XG4gICAgaWYgKHJlYWRhYmxlLl9zdGF0ZSA9PT0gJ2Vycm9yZWQnKSB7XG4gICAgICBkZWZhdWx0Q29udHJvbGxlckZpbmlzaFByb21pc2VSZWplY3QoY29udHJvbGxlciwgcmVhZGFibGUuX3N0b3JlZEVycm9yKTtcbiAgICB9IGVsc2Uge1xuICAgICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVycm9yKHJlYWRhYmxlLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIsIHJlYXNvbik7XG4gICAgICBkZWZhdWx0Q29udHJvbGxlckZpbmlzaFByb21pc2VSZXNvbHZlKGNvbnRyb2xsZXIpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfSwgciA9PiB7XG4gICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVycm9yKHJlYWRhYmxlLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIsIHIpO1xuICAgIGRlZmF1bHRDb250cm9sbGVyRmluaXNoUHJvbWlzZVJlamVjdChjb250cm9sbGVyLCByKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfSk7XG5cbiAgcmV0dXJuIGNvbnRyb2xsZXIuX2ZpbmlzaFByb21pc2U7XG59XG5cbmZ1bmN0aW9uIFRyYW5zZm9ybVN0cmVhbURlZmF1bHRTaW5rQ2xvc2VBbGdvcml0aG08SSwgTz4oc3RyZWFtOiBUcmFuc2Zvcm1TdHJlYW08SSwgTz4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgY29udHJvbGxlciA9IHN0cmVhbS5fdHJhbnNmb3JtU3RyZWFtQ29udHJvbGxlcjtcbiAgaWYgKGNvbnRyb2xsZXIuX2ZpbmlzaFByb21pc2UgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBjb250cm9sbGVyLl9maW5pc2hQcm9taXNlO1xuICB9XG5cbiAgLy8gc3RyZWFtLl9yZWFkYWJsZSBjYW5ub3QgY2hhbmdlIGFmdGVyIGNvbnN0cnVjdGlvbiwgc28gY2FjaGluZyBpdCBhY3Jvc3MgYSBjYWxsIHRvIHVzZXIgY29kZSBpcyBzYWZlLlxuICBjb25zdCByZWFkYWJsZSA9IHN0cmVhbS5fcmVhZGFibGU7XG5cbiAgLy8gQXNzaWduIHRoZSBfZmluaXNoUHJvbWlzZSBub3cgc28gdGhhdCBpZiBfZmx1c2hBbGdvcml0aG0gY2FsbHMgcmVhZGFibGUuY2FuY2VsKCkgaW50ZXJuYWxseSxcbiAgLy8gd2UgZG9uJ3QgYWxzbyBydW4gdGhlIF9jYW5jZWxBbGdvcml0aG0uXG4gIGNvbnRyb2xsZXIuX2ZpbmlzaFByb21pc2UgPSBuZXdQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb250cm9sbGVyLl9maW5pc2hQcm9taXNlX3Jlc29sdmUgPSByZXNvbHZlO1xuICAgIGNvbnRyb2xsZXIuX2ZpbmlzaFByb21pc2VfcmVqZWN0ID0gcmVqZWN0O1xuICB9KTtcblxuICBjb25zdCBmbHVzaFByb21pc2UgPSBjb250cm9sbGVyLl9mbHVzaEFsZ29yaXRobSgpO1xuICBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlckNsZWFyQWxnb3JpdGhtcyhjb250cm9sbGVyKTtcblxuICB1cG9uUHJvbWlzZShmbHVzaFByb21pc2UsICgpID0+IHtcbiAgICBpZiAocmVhZGFibGUuX3N0YXRlID09PSAnZXJyb3JlZCcpIHtcbiAgICAgIGRlZmF1bHRDb250cm9sbGVyRmluaXNoUHJvbWlzZVJlamVjdChjb250cm9sbGVyLCByZWFkYWJsZS5fc3RvcmVkRXJyb3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2xvc2UocmVhZGFibGUuX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlcik7XG4gICAgICBkZWZhdWx0Q29udHJvbGxlckZpbmlzaFByb21pc2VSZXNvbHZlKGNvbnRyb2xsZXIpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfSwgciA9PiB7XG4gICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVycm9yKHJlYWRhYmxlLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIsIHIpO1xuICAgIGRlZmF1bHRDb250cm9sbGVyRmluaXNoUHJvbWlzZVJlamVjdChjb250cm9sbGVyLCByKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfSk7XG5cbiAgcmV0dXJuIGNvbnRyb2xsZXIuX2ZpbmlzaFByb21pc2U7XG59XG5cbi8vIFRyYW5zZm9ybVN0cmVhbURlZmF1bHRTb3VyY2UgQWxnb3JpdGhtc1xuXG5mdW5jdGlvbiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0U291cmNlUHVsbEFsZ29yaXRobShzdHJlYW06IFRyYW5zZm9ybVN0cmVhbSk6IFByb21pc2U8dm9pZD4ge1xuICAvLyBJbnZhcmlhbnQuIEVuZm9yY2VkIGJ5IHRoZSBwcm9taXNlcyByZXR1cm5lZCBieSBzdGFydCgpIGFuZCBwdWxsKCkuXG4gIGFzc2VydChzdHJlYW0uX2JhY2twcmVzc3VyZSk7XG5cbiAgYXNzZXJ0KHN0cmVhbS5fYmFja3ByZXNzdXJlQ2hhbmdlUHJvbWlzZSAhPT0gdW5kZWZpbmVkKTtcblxuICBUcmFuc2Zvcm1TdHJlYW1TZXRCYWNrcHJlc3N1cmUoc3RyZWFtLCBmYWxzZSk7XG5cbiAgLy8gUHJldmVudCB0aGUgbmV4dCBwdWxsKCkgY2FsbCB1bnRpbCB0aGVyZSBpcyBiYWNrcHJlc3N1cmUuXG4gIHJldHVybiBzdHJlYW0uX2JhY2twcmVzc3VyZUNoYW5nZVByb21pc2U7XG59XG5cbmZ1bmN0aW9uIFRyYW5zZm9ybVN0cmVhbURlZmF1bHRTb3VyY2VDYW5jZWxBbGdvcml0aG08SSwgTz4oc3RyZWFtOiBUcmFuc2Zvcm1TdHJlYW08SSwgTz4sIHJlYXNvbjogYW55KTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGNvbnRyb2xsZXIgPSBzdHJlYW0uX3RyYW5zZm9ybVN0cmVhbUNvbnRyb2xsZXI7XG4gIGlmIChjb250cm9sbGVyLl9maW5pc2hQcm9taXNlICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gY29udHJvbGxlci5fZmluaXNoUHJvbWlzZTtcbiAgfVxuXG4gIC8vIHN0cmVhbS5fd3JpdGFibGUgY2Fubm90IGNoYW5nZSBhZnRlciBjb25zdHJ1Y3Rpb24sIHNvIGNhY2hpbmcgaXQgYWNyb3NzIGEgY2FsbCB0byB1c2VyIGNvZGUgaXMgc2FmZS5cbiAgY29uc3Qgd3JpdGFibGUgPSBzdHJlYW0uX3dyaXRhYmxlO1xuXG4gIC8vIEFzc2lnbiB0aGUgX2ZpbmlzaFByb21pc2Ugbm93IHNvIHRoYXQgaWYgX2ZsdXNoQWxnb3JpdGhtIGNhbGxzIHdyaXRhYmxlLmFib3J0KCkgb3JcbiAgLy8gd3JpdGFibGUuY2FuY2VsKCkgaW50ZXJuYWxseSwgd2UgZG9uJ3QgcnVuIHRoZSBfY2FuY2VsQWxnb3JpdGhtIGFnYWluLCBvciBhbHNvIHJ1biB0aGVcbiAgLy8gX2ZsdXNoQWxnb3JpdGhtLlxuICBjb250cm9sbGVyLl9maW5pc2hQcm9taXNlID0gbmV3UHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29udHJvbGxlci5fZmluaXNoUHJvbWlzZV9yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICBjb250cm9sbGVyLl9maW5pc2hQcm9taXNlX3JlamVjdCA9IHJlamVjdDtcbiAgfSk7XG5cbiAgY29uc3QgY2FuY2VsUHJvbWlzZSA9IGNvbnRyb2xsZXIuX2NhbmNlbEFsZ29yaXRobShyZWFzb24pO1xuICBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlckNsZWFyQWxnb3JpdGhtcyhjb250cm9sbGVyKTtcblxuICB1cG9uUHJvbWlzZShjYW5jZWxQcm9taXNlLCAoKSA9PiB7XG4gICAgaWYgKHdyaXRhYmxlLl9zdGF0ZSA9PT0gJ2Vycm9yZWQnKSB7XG4gICAgICBkZWZhdWx0Q29udHJvbGxlckZpbmlzaFByb21pc2VSZWplY3QoY29udHJvbGxlciwgd3JpdGFibGUuX3N0b3JlZEVycm9yKTtcbiAgICB9IGVsc2Uge1xuICAgICAgV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVycm9ySWZOZWVkZWQod3JpdGFibGUuX3dyaXRhYmxlU3RyZWFtQ29udHJvbGxlciwgcmVhc29uKTtcbiAgICAgIFRyYW5zZm9ybVN0cmVhbVVuYmxvY2tXcml0ZShzdHJlYW0pO1xuICAgICAgZGVmYXVsdENvbnRyb2xsZXJGaW5pc2hQcm9taXNlUmVzb2x2ZShjb250cm9sbGVyKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH0sIHIgPT4ge1xuICAgIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFcnJvcklmTmVlZGVkKHdyaXRhYmxlLl93cml0YWJsZVN0cmVhbUNvbnRyb2xsZXIsIHIpO1xuICAgIFRyYW5zZm9ybVN0cmVhbVVuYmxvY2tXcml0ZShzdHJlYW0pO1xuICAgIGRlZmF1bHRDb250cm9sbGVyRmluaXNoUHJvbWlzZVJlamVjdChjb250cm9sbGVyLCByKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfSk7XG5cbiAgcmV0dXJuIGNvbnRyb2xsZXIuX2ZpbmlzaFByb21pc2U7XG59XG5cbi8vIEhlbHBlciBmdW5jdGlvbnMgZm9yIHRoZSBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlci5cblxuZnVuY3Rpb24gZGVmYXVsdENvbnRyb2xsZXJCcmFuZENoZWNrRXhjZXB0aW9uKG5hbWU6IHN0cmluZyk6IFR5cGVFcnJvciB7XG4gIHJldHVybiBuZXcgVHlwZUVycm9yKFxuICAgIGBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlci5wcm90b3R5cGUuJHtuYW1lfSBjYW4gb25seSBiZSB1c2VkIG9uIGEgVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRDb250cm9sbGVyRmluaXNoUHJvbWlzZVJlc29sdmUoY29udHJvbGxlcjogVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8YW55Pikge1xuICBpZiAoY29udHJvbGxlci5fZmluaXNoUHJvbWlzZV9yZXNvbHZlID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb250cm9sbGVyLl9maW5pc2hQcm9taXNlX3Jlc29sdmUoKTtcbiAgY29udHJvbGxlci5fZmluaXNoUHJvbWlzZV9yZXNvbHZlID0gdW5kZWZpbmVkO1xuICBjb250cm9sbGVyLl9maW5pc2hQcm9taXNlX3JlamVjdCA9IHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRDb250cm9sbGVyRmluaXNoUHJvbWlzZVJlamVjdChjb250cm9sbGVyOiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxhbnk+LCByZWFzb246IGFueSkge1xuICBpZiAoY29udHJvbGxlci5fZmluaXNoUHJvbWlzZV9yZWplY3QgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHNldFByb21pc2VJc0hhbmRsZWRUb1RydWUoY29udHJvbGxlci5fZmluaXNoUHJvbWlzZSEpO1xuICBjb250cm9sbGVyLl9maW5pc2hQcm9taXNlX3JlamVjdChyZWFzb24pO1xuICBjb250cm9sbGVyLl9maW5pc2hQcm9taXNlX3Jlc29sdmUgPSB1bmRlZmluZWQ7XG4gIGNvbnRyb2xsZXIuX2ZpbmlzaFByb21pc2VfcmVqZWN0ID0gdW5kZWZpbmVkO1xufVxuXG4vLyBIZWxwZXIgZnVuY3Rpb25zIGZvciB0aGUgVHJhbnNmb3JtU3RyZWFtLlxuXG5mdW5jdGlvbiBzdHJlYW1CcmFuZENoZWNrRXhjZXB0aW9uKG5hbWU6IHN0cmluZyk6IFR5cGVFcnJvciB7XG4gIHJldHVybiBuZXcgVHlwZUVycm9yKFxuICAgIGBUcmFuc2Zvcm1TdHJlYW0ucHJvdG90eXBlLiR7bmFtZX0gY2FuIG9ubHkgYmUgdXNlZCBvbiBhIFRyYW5zZm9ybVN0cmVhbWApO1xufVxuIiwgIi8qIGM4IGlnbm9yZSBzdGFydCAqL1xuLy8gNjQgS2lCIChzYW1lIHNpemUgY2hyb21lIHNsaWNlIHRoZWlycyBibG9iIGludG8gVWludDhhcnJheSdzKVxuY29uc3QgUE9PTF9TSVpFID0gNjU1MzZcblxuaWYgKCFnbG9iYWxUaGlzLlJlYWRhYmxlU3RyZWFtKSB7XG4gIC8vIGBub2RlOnN0cmVhbS93ZWJgIGdvdCBpbnRyb2R1Y2VkIGluIHYxNi41LjAgYXMgZXhwZXJpbWVudGFsXG4gIC8vIGFuZCBpdCdzIHByZWZlcnJlZCBvdmVyIHRoZSBwb2x5ZmlsbGVkIHZlcnNpb24uIFNvIHdlIGFsc29cbiAgLy8gc3VwcHJlc3MgdGhlIHdhcm5pbmcgdGhhdCBnZXRzIGVtaXR0ZWQgYnkgTm9kZUpTIGZvciB1c2luZyBpdC5cbiAgdHJ5IHtcbiAgICBjb25zdCBwcm9jZXNzID0gcmVxdWlyZSgnbm9kZTpwcm9jZXNzJylcbiAgICBjb25zdCB7IGVtaXRXYXJuaW5nIH0gPSBwcm9jZXNzXG4gICAgdHJ5IHtcbiAgICAgIHByb2Nlc3MuZW1pdFdhcm5pbmcgPSAoKSA9PiB7fVxuICAgICAgT2JqZWN0LmFzc2lnbihnbG9iYWxUaGlzLCByZXF1aXJlKCdub2RlOnN0cmVhbS93ZWInKSlcbiAgICAgIHByb2Nlc3MuZW1pdFdhcm5pbmcgPSBlbWl0V2FybmluZ1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBwcm9jZXNzLmVtaXRXYXJuaW5nID0gZW1pdFdhcm5pbmdcbiAgICAgIHRocm93IGVycm9yXG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIC8vIGZhbGxiYWNrIHRvIHBvbHlmaWxsIGltcGxlbWVudGF0aW9uXG4gICAgT2JqZWN0LmFzc2lnbihnbG9iYWxUaGlzLCByZXF1aXJlKCd3ZWItc3RyZWFtcy1wb2x5ZmlsbC9kaXN0L3BvbnlmaWxsLmVzMjAxOC5qcycpKVxuICB9XG59XG5cbnRyeSB7XG4gIC8vIERvbid0IHVzZSBub2RlOiBwcmVmaXggZm9yIHRoaXMsIHJlcXVpcmUrbm9kZTogaXMgbm90IHN1cHBvcnRlZCB1bnRpbCBub2RlIHYxNC4xNFxuICAvLyBPbmx5IGBpbXBvcnQoKWAgY2FuIHVzZSBwcmVmaXggaW4gMTIuMjAgYW5kIGxhdGVyXG4gIGNvbnN0IHsgQmxvYiB9ID0gcmVxdWlyZSgnYnVmZmVyJylcbiAgaWYgKEJsb2IgJiYgIUJsb2IucHJvdG90eXBlLnN0cmVhbSkge1xuICAgIEJsb2IucHJvdG90eXBlLnN0cmVhbSA9IGZ1bmN0aW9uIG5hbWUgKHBhcmFtcykge1xuICAgICAgbGV0IHBvc2l0aW9uID0gMFxuICAgICAgY29uc3QgYmxvYiA9IHRoaXNcblxuICAgICAgcmV0dXJuIG5ldyBSZWFkYWJsZVN0cmVhbSh7XG4gICAgICAgIHR5cGU6ICdieXRlcycsXG4gICAgICAgIGFzeW5jIHB1bGwgKGN0cmwpIHtcbiAgICAgICAgICBjb25zdCBjaHVuayA9IGJsb2Iuc2xpY2UocG9zaXRpb24sIE1hdGgubWluKGJsb2Iuc2l6ZSwgcG9zaXRpb24gKyBQT09MX1NJWkUpKVxuICAgICAgICAgIGNvbnN0IGJ1ZmZlciA9IGF3YWl0IGNodW5rLmFycmF5QnVmZmVyKClcbiAgICAgICAgICBwb3NpdGlvbiArPSBidWZmZXIuYnl0ZUxlbmd0aFxuICAgICAgICAgIGN0cmwuZW5xdWV1ZShuZXcgVWludDhBcnJheShidWZmZXIpKVxuXG4gICAgICAgICAgaWYgKHBvc2l0aW9uID09PSBibG9iLnNpemUpIHtcbiAgICAgICAgICAgIGN0cmwuY2xvc2UoKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cbn0gY2F0Y2ggKGVycm9yKSB7fVxuLyogYzggaWdub3JlIGVuZCAqL1xuIiwgIi8qISBmZXRjaC1ibG9iLiBNSVQgTGljZW5zZS4gSmltbXkgV1x1MDBFNHJ0aW5nIDxodHRwczovL2ppbW15LndhcnRpbmcuc2Uvb3BlbnNvdXJjZT4gKi9cblxuLy8gVE9ETyAoamltbXl3YXJ0aW5nKTogaW4gdGhlIGZlYXR1cmUgdXNlIGNvbmRpdGlvbmFsIGxvYWRpbmcgd2l0aCB0b3AgbGV2ZWwgYXdhaXQgKHJlcXVpcmVzIDE0LngpXG4vLyBOb2RlIGhhcyByZWNlbnRseSBhZGRlZCB3aGF0d2cgc3RyZWFtIGludG8gY29yZVxuXG5pbXBvcnQgJy4vc3RyZWFtcy5janMnXG5cbi8vIDY0IEtpQiAoc2FtZSBzaXplIGNocm9tZSBzbGljZSB0aGVpcnMgYmxvYiBpbnRvIFVpbnQ4YXJyYXkncylcbmNvbnN0IFBPT0xfU0laRSA9IDY1NTM2XG5cbi8qKiBAcGFyYW0geyhCbG9iIHwgVWludDhBcnJheSlbXX0gcGFydHMgKi9cbmFzeW5jIGZ1bmN0aW9uICogdG9JdGVyYXRvciAocGFydHMsIGNsb25lID0gdHJ1ZSkge1xuICBmb3IgKGNvbnN0IHBhcnQgb2YgcGFydHMpIHtcbiAgICBpZiAoJ3N0cmVhbScgaW4gcGFydCkge1xuICAgICAgeWllbGQgKiAoLyoqIEB0eXBlIHtBc3luY0l0ZXJhYmxlSXRlcmF0b3I8VWludDhBcnJheT59ICovIChwYXJ0LnN0cmVhbSgpKSlcbiAgICB9IGVsc2UgaWYgKEFycmF5QnVmZmVyLmlzVmlldyhwYXJ0KSkge1xuICAgICAgaWYgKGNsb25lKSB7XG4gICAgICAgIGxldCBwb3NpdGlvbiA9IHBhcnQuYnl0ZU9mZnNldFxuICAgICAgICBjb25zdCBlbmQgPSBwYXJ0LmJ5dGVPZmZzZXQgKyBwYXJ0LmJ5dGVMZW5ndGhcbiAgICAgICAgd2hpbGUgKHBvc2l0aW9uICE9PSBlbmQpIHtcbiAgICAgICAgICBjb25zdCBzaXplID0gTWF0aC5taW4oZW5kIC0gcG9zaXRpb24sIFBPT0xfU0laRSlcbiAgICAgICAgICBjb25zdCBjaHVuayA9IHBhcnQuYnVmZmVyLnNsaWNlKHBvc2l0aW9uLCBwb3NpdGlvbiArIHNpemUpXG4gICAgICAgICAgcG9zaXRpb24gKz0gY2h1bmsuYnl0ZUxlbmd0aFxuICAgICAgICAgIHlpZWxkIG5ldyBVaW50OEFycmF5KGNodW5rKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB5aWVsZCBwYXJ0XG4gICAgICB9XG4gICAgLyogYzggaWdub3JlIG5leHQgMTAgKi9cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRm9yIGJsb2JzIHRoYXQgaGF2ZSBhcnJheUJ1ZmZlciBidXQgbm8gc3RyZWFtIG1ldGhvZCAobm9kZXMgYnVmZmVyLkJsb2IpXG4gICAgICBsZXQgcG9zaXRpb24gPSAwLCBiID0gKC8qKiBAdHlwZSB7QmxvYn0gKi8gKHBhcnQpKVxuICAgICAgd2hpbGUgKHBvc2l0aW9uICE9PSBiLnNpemUpIHtcbiAgICAgICAgY29uc3QgY2h1bmsgPSBiLnNsaWNlKHBvc2l0aW9uLCBNYXRoLm1pbihiLnNpemUsIHBvc2l0aW9uICsgUE9PTF9TSVpFKSlcbiAgICAgICAgY29uc3QgYnVmZmVyID0gYXdhaXQgY2h1bmsuYXJyYXlCdWZmZXIoKVxuICAgICAgICBwb3NpdGlvbiArPSBidWZmZXIuYnl0ZUxlbmd0aFxuICAgICAgICB5aWVsZCBuZXcgVWludDhBcnJheShidWZmZXIpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmNvbnN0IF9CbG9iID0gY2xhc3MgQmxvYiB7XG4gIC8qKiBAdHlwZSB7QXJyYXkuPChCbG9ifFVpbnQ4QXJyYXkpPn0gKi9cbiAgI3BhcnRzID0gW11cbiAgI3R5cGUgPSAnJ1xuICAjc2l6ZSA9IDBcbiAgI2VuZGluZ3MgPSAndHJhbnNwYXJlbnQnXG5cbiAgLyoqXG4gICAqIFRoZSBCbG9iKCkgY29uc3RydWN0b3IgcmV0dXJucyBhIG5ldyBCbG9iIG9iamVjdC4gVGhlIGNvbnRlbnRcbiAgICogb2YgdGhlIGJsb2IgY29uc2lzdHMgb2YgdGhlIGNvbmNhdGVuYXRpb24gb2YgdGhlIHZhbHVlcyBnaXZlblxuICAgKiBpbiB0aGUgcGFyYW1ldGVyIGFycmF5LlxuICAgKlxuICAgKiBAcGFyYW0geyp9IGJsb2JQYXJ0c1xuICAgKiBAcGFyYW0ge3sgdHlwZT86IHN0cmluZywgZW5kaW5ncz86IHN0cmluZyB9fSBbb3B0aW9uc11cbiAgICovXG4gIGNvbnN0cnVjdG9yIChibG9iUGFydHMgPSBbXSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgaWYgKHR5cGVvZiBibG9iUGFydHMgIT09ICdvYmplY3QnIHx8IGJsb2JQYXJ0cyA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRmFpbGVkIHRvIGNvbnN0cnVjdCBcXCdCbG9iXFwnOiBUaGUgcHJvdmlkZWQgdmFsdWUgY2Fubm90IGJlIGNvbnZlcnRlZCB0byBhIHNlcXVlbmNlLicpXG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBibG9iUGFydHNbU3ltYm9sLml0ZXJhdG9yXSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRmFpbGVkIHRvIGNvbnN0cnVjdCBcXCdCbG9iXFwnOiBUaGUgb2JqZWN0IG11c3QgaGF2ZSBhIGNhbGxhYmxlIEBAaXRlcmF0b3IgcHJvcGVydHkuJylcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMgIT09ICdvYmplY3QnICYmIHR5cGVvZiBvcHRpb25zICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdGYWlsZWQgdG8gY29uc3RydWN0IFxcJ0Jsb2JcXCc6IHBhcmFtZXRlciAyIGNhbm5vdCBjb252ZXJ0IHRvIGRpY3Rpb25hcnkuJylcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucyA9PT0gbnVsbCkgb3B0aW9ucyA9IHt9XG5cbiAgICBjb25zdCBlbmNvZGVyID0gbmV3IFRleHRFbmNvZGVyKClcbiAgICBmb3IgKGNvbnN0IGVsZW1lbnQgb2YgYmxvYlBhcnRzKSB7XG4gICAgICBsZXQgcGFydFxuICAgICAgaWYgKEFycmF5QnVmZmVyLmlzVmlldyhlbGVtZW50KSkge1xuICAgICAgICBwYXJ0ID0gbmV3IFVpbnQ4QXJyYXkoZWxlbWVudC5idWZmZXIuc2xpY2UoZWxlbWVudC5ieXRlT2Zmc2V0LCBlbGVtZW50LmJ5dGVPZmZzZXQgKyBlbGVtZW50LmJ5dGVMZW5ndGgpKVxuICAgICAgfSBlbHNlIGlmIChlbGVtZW50IGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICAgICAgcGFydCA9IG5ldyBVaW50OEFycmF5KGVsZW1lbnQuc2xpY2UoMCkpXG4gICAgICB9IGVsc2UgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBCbG9iKSB7XG4gICAgICAgIHBhcnQgPSBlbGVtZW50XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJ0ID0gZW5jb2Rlci5lbmNvZGUoYCR7ZWxlbWVudH1gKVxuICAgICAgfVxuXG4gICAgICB0aGlzLiNzaXplICs9IEFycmF5QnVmZmVyLmlzVmlldyhwYXJ0KSA/IHBhcnQuYnl0ZUxlbmd0aCA6IHBhcnQuc2l6ZVxuICAgICAgdGhpcy4jcGFydHMucHVzaChwYXJ0KVxuICAgIH1cblxuICAgIHRoaXMuI2VuZGluZ3MgPSBgJHtvcHRpb25zLmVuZGluZ3MgPT09IHVuZGVmaW5lZCA/ICd0cmFuc3BhcmVudCcgOiBvcHRpb25zLmVuZGluZ3N9YFxuICAgIGNvbnN0IHR5cGUgPSBvcHRpb25zLnR5cGUgPT09IHVuZGVmaW5lZCA/ICcnIDogU3RyaW5nKG9wdGlvbnMudHlwZSlcbiAgICB0aGlzLiN0eXBlID0gL15bXFx4MjAtXFx4N0VdKiQvLnRlc3QodHlwZSkgPyB0eXBlIDogJydcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgQmxvYiBpbnRlcmZhY2UncyBzaXplIHByb3BlcnR5IHJldHVybnMgdGhlXG4gICAqIHNpemUgb2YgdGhlIEJsb2IgaW4gYnl0ZXMuXG4gICAqL1xuICBnZXQgc2l6ZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3NpemVcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgdHlwZSBwcm9wZXJ0eSBvZiBhIEJsb2Igb2JqZWN0IHJldHVybnMgdGhlIE1JTUUgdHlwZSBvZiB0aGUgZmlsZS5cbiAgICovXG4gIGdldCB0eXBlICgpIHtcbiAgICByZXR1cm4gdGhpcy4jdHlwZVxuICB9XG5cbiAgLyoqXG4gICAqIFRoZSB0ZXh0KCkgbWV0aG9kIGluIHRoZSBCbG9iIGludGVyZmFjZSByZXR1cm5zIGEgUHJvbWlzZVxuICAgKiB0aGF0IHJlc29sdmVzIHdpdGggYSBzdHJpbmcgY29udGFpbmluZyB0aGUgY29udGVudHMgb2ZcbiAgICogdGhlIGJsb2IsIGludGVycHJldGVkIGFzIFVURi04LlxuICAgKlxuICAgKiBAcmV0dXJuIHtQcm9taXNlPHN0cmluZz59XG4gICAqL1xuICBhc3luYyB0ZXh0ICgpIHtcbiAgICAvLyBNb3JlIG9wdGltaXplZCB0aGFuIHVzaW5nIHRoaXMuYXJyYXlCdWZmZXIoKVxuICAgIC8vIHRoYXQgcmVxdWlyZXMgdHdpY2UgYXMgbXVjaCByYW1cbiAgICBjb25zdCBkZWNvZGVyID0gbmV3IFRleHREZWNvZGVyKClcbiAgICBsZXQgc3RyID0gJydcbiAgICBmb3IgYXdhaXQgKGNvbnN0IHBhcnQgb2YgdG9JdGVyYXRvcih0aGlzLiNwYXJ0cywgZmFsc2UpKSB7XG4gICAgICBzdHIgKz0gZGVjb2Rlci5kZWNvZGUocGFydCwgeyBzdHJlYW06IHRydWUgfSlcbiAgICB9XG4gICAgLy8gUmVtYWluaW5nXG4gICAgc3RyICs9IGRlY29kZXIuZGVjb2RlKClcbiAgICByZXR1cm4gc3RyXG4gIH1cblxuICAvKipcbiAgICogVGhlIGFycmF5QnVmZmVyKCkgbWV0aG9kIGluIHRoZSBCbG9iIGludGVyZmFjZSByZXR1cm5zIGFcbiAgICogUHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggdGhlIGNvbnRlbnRzIG9mIHRoZSBibG9iIGFzXG4gICAqIGJpbmFyeSBkYXRhIGNvbnRhaW5lZCBpbiBhbiBBcnJheUJ1ZmZlci5cbiAgICpcbiAgICogQHJldHVybiB7UHJvbWlzZTxBcnJheUJ1ZmZlcj59XG4gICAqL1xuICBhc3luYyBhcnJheUJ1ZmZlciAoKSB7XG4gICAgLy8gRWFzaWVyIHdheS4uLiBKdXN0IGEgdW5uZWNlc3Nhcnkgb3ZlcmhlYWRcbiAgICAvLyBjb25zdCB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5zaXplKTtcbiAgICAvLyBhd2FpdCB0aGlzLnN0cmVhbSgpLmdldFJlYWRlcih7bW9kZTogJ2J5b2InfSkucmVhZCh2aWV3KTtcbiAgICAvLyByZXR1cm4gdmlldy5idWZmZXI7XG5cbiAgICBjb25zdCBkYXRhID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5zaXplKVxuICAgIGxldCBvZmZzZXQgPSAwXG4gICAgZm9yIGF3YWl0IChjb25zdCBjaHVuayBvZiB0b0l0ZXJhdG9yKHRoaXMuI3BhcnRzLCBmYWxzZSkpIHtcbiAgICAgIGRhdGEuc2V0KGNodW5rLCBvZmZzZXQpXG4gICAgICBvZmZzZXQgKz0gY2h1bmsubGVuZ3RoXG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGEuYnVmZmVyXG4gIH1cblxuICBzdHJlYW0gKCkge1xuICAgIGNvbnN0IGl0ID0gdG9JdGVyYXRvcih0aGlzLiNwYXJ0cywgdHJ1ZSlcblxuICAgIHJldHVybiBuZXcgZ2xvYmFsVGhpcy5SZWFkYWJsZVN0cmVhbSh7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICB0eXBlOiAnYnl0ZXMnLFxuICAgICAgYXN5bmMgcHVsbCAoY3RybCkge1xuICAgICAgICBjb25zdCBjaHVuayA9IGF3YWl0IGl0Lm5leHQoKVxuICAgICAgICBjaHVuay5kb25lID8gY3RybC5jbG9zZSgpIDogY3RybC5lbnF1ZXVlKGNodW5rLnZhbHVlKVxuICAgICAgfSxcblxuICAgICAgYXN5bmMgY2FuY2VsICgpIHtcbiAgICAgICAgYXdhaXQgaXQucmV0dXJuKClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBCbG9iIGludGVyZmFjZSdzIHNsaWNlKCkgbWV0aG9kIGNyZWF0ZXMgYW5kIHJldHVybnMgYVxuICAgKiBuZXcgQmxvYiBvYmplY3Qgd2hpY2ggY29udGFpbnMgZGF0YSBmcm9tIGEgc3Vic2V0IG9mIHRoZVxuICAgKiBibG9iIG9uIHdoaWNoIGl0J3MgY2FsbGVkLlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0XVxuICAgKiBAcGFyYW0ge251bWJlcn0gW2VuZF1cbiAgICogQHBhcmFtIHtzdHJpbmd9IFt0eXBlXVxuICAgKi9cbiAgc2xpY2UgKHN0YXJ0ID0gMCwgZW5kID0gdGhpcy5zaXplLCB0eXBlID0gJycpIHtcbiAgICBjb25zdCB7IHNpemUgfSA9IHRoaXNcblxuICAgIGxldCByZWxhdGl2ZVN0YXJ0ID0gc3RhcnQgPCAwID8gTWF0aC5tYXgoc2l6ZSArIHN0YXJ0LCAwKSA6IE1hdGgubWluKHN0YXJ0LCBzaXplKVxuICAgIGxldCByZWxhdGl2ZUVuZCA9IGVuZCA8IDAgPyBNYXRoLm1heChzaXplICsgZW5kLCAwKSA6IE1hdGgubWluKGVuZCwgc2l6ZSlcblxuICAgIGNvbnN0IHNwYW4gPSBNYXRoLm1heChyZWxhdGl2ZUVuZCAtIHJlbGF0aXZlU3RhcnQsIDApXG4gICAgY29uc3QgcGFydHMgPSB0aGlzLiNwYXJ0c1xuICAgIGNvbnN0IGJsb2JQYXJ0cyA9IFtdXG4gICAgbGV0IGFkZGVkID0gMFxuXG4gICAgZm9yIChjb25zdCBwYXJ0IG9mIHBhcnRzKSB7XG4gICAgICAvLyBkb24ndCBhZGQgdGhlIG92ZXJmbG93IHRvIG5ldyBibG9iUGFydHNcbiAgICAgIGlmIChhZGRlZCA+PSBzcGFuKSB7XG4gICAgICAgIGJyZWFrXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHNpemUgPSBBcnJheUJ1ZmZlci5pc1ZpZXcocGFydCkgPyBwYXJ0LmJ5dGVMZW5ndGggOiBwYXJ0LnNpemVcbiAgICAgIGlmIChyZWxhdGl2ZVN0YXJ0ICYmIHNpemUgPD0gcmVsYXRpdmVTdGFydCkge1xuICAgICAgICAvLyBTa2lwIHRoZSBiZWdpbm5pbmcgYW5kIGNoYW5nZSB0aGUgcmVsYXRpdmVcbiAgICAgICAgLy8gc3RhcnQgJiBlbmQgcG9zaXRpb24gYXMgd2Ugc2tpcCB0aGUgdW53YW50ZWQgcGFydHNcbiAgICAgICAgcmVsYXRpdmVTdGFydCAtPSBzaXplXG4gICAgICAgIHJlbGF0aXZlRW5kIC09IHNpemVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBjaHVua1xuICAgICAgICBpZiAoQXJyYXlCdWZmZXIuaXNWaWV3KHBhcnQpKSB7XG4gICAgICAgICAgY2h1bmsgPSBwYXJ0LnN1YmFycmF5KHJlbGF0aXZlU3RhcnQsIE1hdGgubWluKHNpemUsIHJlbGF0aXZlRW5kKSlcbiAgICAgICAgICBhZGRlZCArPSBjaHVuay5ieXRlTGVuZ3RoXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2h1bmsgPSBwYXJ0LnNsaWNlKHJlbGF0aXZlU3RhcnQsIE1hdGgubWluKHNpemUsIHJlbGF0aXZlRW5kKSlcbiAgICAgICAgICBhZGRlZCArPSBjaHVuay5zaXplXG4gICAgICAgIH1cbiAgICAgICAgcmVsYXRpdmVFbmQgLT0gc2l6ZVxuICAgICAgICBibG9iUGFydHMucHVzaChjaHVuaylcbiAgICAgICAgcmVsYXRpdmVTdGFydCA9IDAgLy8gQWxsIG5leHQgc2VxdWVudGlhbCBwYXJ0cyBzaG91bGQgc3RhcnQgYXQgMFxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGJsb2IgPSBuZXcgQmxvYihbXSwgeyB0eXBlOiBTdHJpbmcodHlwZSkudG9Mb3dlckNhc2UoKSB9KVxuICAgIGJsb2IuI3NpemUgPSBzcGFuXG4gICAgYmxvYi4jcGFydHMgPSBibG9iUGFydHNcblxuICAgIHJldHVybiBibG9iXG4gIH1cblxuICBnZXQgW1N5bWJvbC50b1N0cmluZ1RhZ10gKCkge1xuICAgIHJldHVybiAnQmxvYidcbiAgfVxuXG4gIHN0YXRpYyBbU3ltYm9sLmhhc0luc3RhbmNlXSAob2JqZWN0KSB7XG4gICAgcmV0dXJuIChcbiAgICAgIG9iamVjdCAmJlxuICAgICAgdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiZcbiAgICAgIHR5cGVvZiBvYmplY3QuY29uc3RydWN0b3IgPT09ICdmdW5jdGlvbicgJiZcbiAgICAgIChcbiAgICAgICAgdHlwZW9mIG9iamVjdC5zdHJlYW0gPT09ICdmdW5jdGlvbicgfHxcbiAgICAgICAgdHlwZW9mIG9iamVjdC5hcnJheUJ1ZmZlciA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgKSAmJlxuICAgICAgL14oQmxvYnxGaWxlKSQvLnRlc3Qob2JqZWN0W1N5bWJvbC50b1N0cmluZ1RhZ10pXG4gICAgKVxuICB9XG59XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKF9CbG9iLnByb3RvdHlwZSwge1xuICBzaXplOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgdHlwZTogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIHNsaWNlOiB7IGVudW1lcmFibGU6IHRydWUgfVxufSlcblxuLyoqIEB0eXBlIHt0eXBlb2YgZ2xvYmFsVGhpcy5CbG9ifSAqL1xuZXhwb3J0IGNvbnN0IEJsb2IgPSBfQmxvYlxuZXhwb3J0IGRlZmF1bHQgQmxvYlxuIiwgImltcG9ydCBCbG9iIGZyb20gJy4vaW5kZXguanMnXG5cbmNvbnN0IF9GaWxlID0gY2xhc3MgRmlsZSBleHRlbmRzIEJsb2Ige1xuICAjbGFzdE1vZGlmaWVkID0gMFxuICAjbmFtZSA9ICcnXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7KltdfSBmaWxlQml0c1xuICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZU5hbWVcbiAgICogQHBhcmFtIHt7bGFzdE1vZGlmaWVkPzogbnVtYmVyLCB0eXBlPzogc3RyaW5nfX0gb3B0aW9uc1xuICAgKi8vLyBAdHMtaWdub3JlXG4gIGNvbnN0cnVjdG9yIChmaWxlQml0cywgZmlsZU5hbWUsIG9wdGlvbnMgPSB7fSkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgRmFpbGVkIHRvIGNvbnN0cnVjdCAnRmlsZSc6IDIgYXJndW1lbnRzIHJlcXVpcmVkLCBidXQgb25seSAke2FyZ3VtZW50cy5sZW5ndGh9IHByZXNlbnQuYClcbiAgICB9XG4gICAgc3VwZXIoZmlsZUJpdHMsIG9wdGlvbnMpXG5cbiAgICBpZiAob3B0aW9ucyA9PT0gbnVsbCkgb3B0aW9ucyA9IHt9XG5cbiAgICAvLyBTaW11bGF0ZSBXZWJJREwgdHlwZSBjYXN0aW5nIGZvciBOYU4gdmFsdWUgaW4gbGFzdE1vZGlmaWVkIG9wdGlvbi5cbiAgICBjb25zdCBsYXN0TW9kaWZpZWQgPSBvcHRpb25zLmxhc3RNb2RpZmllZCA9PT0gdW5kZWZpbmVkID8gRGF0ZS5ub3coKSA6IE51bWJlcihvcHRpb25zLmxhc3RNb2RpZmllZClcbiAgICBpZiAoIU51bWJlci5pc05hTihsYXN0TW9kaWZpZWQpKSB7XG4gICAgICB0aGlzLiNsYXN0TW9kaWZpZWQgPSBsYXN0TW9kaWZpZWRcbiAgICB9XG5cbiAgICB0aGlzLiNuYW1lID0gU3RyaW5nKGZpbGVOYW1lKVxuICB9XG5cbiAgZ2V0IG5hbWUgKCkge1xuICAgIHJldHVybiB0aGlzLiNuYW1lXG4gIH1cblxuICBnZXQgbGFzdE1vZGlmaWVkICgpIHtcbiAgICByZXR1cm4gdGhpcy4jbGFzdE1vZGlmaWVkXG4gIH1cblxuICBnZXQgW1N5bWJvbC50b1N0cmluZ1RhZ10gKCkge1xuICAgIHJldHVybiAnRmlsZSdcbiAgfVxuXG4gIHN0YXRpYyBbU3ltYm9sLmhhc0luc3RhbmNlXSAob2JqZWN0KSB7XG4gICAgcmV0dXJuICEhb2JqZWN0ICYmIG9iamVjdCBpbnN0YW5jZW9mIEJsb2IgJiZcbiAgICAgIC9eKEZpbGUpJC8udGVzdChvYmplY3RbU3ltYm9sLnRvU3RyaW5nVGFnXSlcbiAgfVxufVxuXG4vKiogQHR5cGUge3R5cGVvZiBnbG9iYWxUaGlzLkZpbGV9ICovLy8gQHRzLWlnbm9yZVxuZXhwb3J0IGNvbnN0IEZpbGUgPSBfRmlsZVxuZXhwb3J0IGRlZmF1bHQgRmlsZVxuIiwgIi8qISBmb3JtZGF0YS1wb2x5ZmlsbC4gTUlUIExpY2Vuc2UuIEppbW15IFdcdTAwRTRydGluZyA8aHR0cHM6Ly9qaW1teS53YXJ0aW5nLnNlL29wZW5zb3VyY2U+ICovXG5cbmltcG9ydCBDIGZyb20gJ2ZldGNoLWJsb2InXG5pbXBvcnQgRiBmcm9tICdmZXRjaC1ibG9iL2ZpbGUuanMnXG5cbnZhciB7dG9TdHJpbmdUYWc6dCxpdGVyYXRvcjppLGhhc0luc3RhbmNlOmh9PVN5bWJvbCxcbnI9TWF0aC5yYW5kb20sXG5tPSdhcHBlbmQsc2V0LGdldCxnZXRBbGwsZGVsZXRlLGtleXMsdmFsdWVzLGVudHJpZXMsZm9yRWFjaCxjb25zdHJ1Y3Rvcicuc3BsaXQoJywnKSxcbmY9KGEsYixjKT0+KGErPScnLC9eKEJsb2J8RmlsZSkkLy50ZXN0KGIgJiYgYlt0XSk/WyhjPWMhPT12b2lkIDA/YysnJzpiW3RdPT0nRmlsZSc/Yi5uYW1lOidibG9iJyxhKSxiLm5hbWUhPT1jfHxiW3RdPT0nYmxvYic/bmV3IEYoW2JdLGMsYik6Yl06W2EsYisnJ10pLFxuZT0oYyxmKT0+KGY/YzpjLnJlcGxhY2UoL1xccj9cXG58XFxyL2csJ1xcclxcbicpKS5yZXBsYWNlKC9cXG4vZywnJTBBJykucmVwbGFjZSgvXFxyL2csJyUwRCcpLnJlcGxhY2UoL1wiL2csJyUyMicpLFxueD0obiwgYSwgZSk9PntpZihhLmxlbmd0aDxlKXt0aHJvdyBuZXcgVHlwZUVycm9yKGBGYWlsZWQgdG8gZXhlY3V0ZSAnJHtufScgb24gJ0Zvcm1EYXRhJzogJHtlfSBhcmd1bWVudHMgcmVxdWlyZWQsIGJ1dCBvbmx5ICR7YS5sZW5ndGh9IHByZXNlbnQuYCl9fVxuXG5leHBvcnQgY29uc3QgRmlsZSA9IEZcblxuLyoqIEB0eXBlIHt0eXBlb2YgZ2xvYmFsVGhpcy5Gb3JtRGF0YX0gKi9cbmV4cG9ydCBjb25zdCBGb3JtRGF0YSA9IGNsYXNzIEZvcm1EYXRhIHtcbiNkPVtdO1xuY29uc3RydWN0b3IoLi4uYSl7aWYoYS5sZW5ndGgpdGhyb3cgbmV3IFR5cGVFcnJvcihgRmFpbGVkIHRvIGNvbnN0cnVjdCAnRm9ybURhdGEnOiBwYXJhbWV0ZXIgMSBpcyBub3Qgb2YgdHlwZSAnSFRNTEZvcm1FbGVtZW50Jy5gKX1cbmdldCBbdF0oKSB7cmV0dXJuICdGb3JtRGF0YSd9XG5baV0oKXtyZXR1cm4gdGhpcy5lbnRyaWVzKCl9XG5zdGF0aWMgW2hdKG8pIHtyZXR1cm4gbyYmdHlwZW9mIG89PT0nb2JqZWN0JyYmb1t0XT09PSdGb3JtRGF0YScmJiFtLnNvbWUobT0+dHlwZW9mIG9bbV0hPSdmdW5jdGlvbicpfVxuYXBwZW5kKC4uLmEpe3goJ2FwcGVuZCcsYXJndW1lbnRzLDIpO3RoaXMuI2QucHVzaChmKC4uLmEpKX1cbmRlbGV0ZShhKXt4KCdkZWxldGUnLGFyZ3VtZW50cywxKTthKz0nJzt0aGlzLiNkPXRoaXMuI2QuZmlsdGVyKChbYl0pPT5iIT09YSl9XG5nZXQoYSl7eCgnZ2V0Jyxhcmd1bWVudHMsMSk7YSs9Jyc7Zm9yKHZhciBiPXRoaXMuI2QsbD1iLmxlbmd0aCxjPTA7YzxsO2MrKylpZihiW2NdWzBdPT09YSlyZXR1cm4gYltjXVsxXTtyZXR1cm4gbnVsbH1cbmdldEFsbChhLGIpe3goJ2dldEFsbCcsYXJndW1lbnRzLDEpO2I9W107YSs9Jyc7dGhpcy4jZC5mb3JFYWNoKGM9PmNbMF09PT1hJiZiLnB1c2goY1sxXSkpO3JldHVybiBifVxuaGFzKGEpe3goJ2hhcycsYXJndW1lbnRzLDEpO2ErPScnO3JldHVybiB0aGlzLiNkLnNvbWUoYj0+YlswXT09PWEpfVxuZm9yRWFjaChhLGIpe3goJ2ZvckVhY2gnLGFyZ3VtZW50cywxKTtmb3IodmFyIFtjLGRdb2YgdGhpcylhLmNhbGwoYixkLGMsdGhpcyl9XG5zZXQoLi4uYSl7eCgnc2V0Jyxhcmd1bWVudHMsMik7dmFyIGI9W10sYz0hMDthPWYoLi4uYSk7dGhpcy4jZC5mb3JFYWNoKGQ9PntkWzBdPT09YVswXT9jJiYoYz0hYi5wdXNoKGEpKTpiLnB1c2goZCl9KTtjJiZiLnB1c2goYSk7dGhpcy4jZD1ifVxuKmVudHJpZXMoKXt5aWVsZCp0aGlzLiNkfVxuKmtleXMoKXtmb3IodmFyW2Fdb2YgdGhpcyl5aWVsZCBhfVxuKnZhbHVlcygpe2Zvcih2YXJbLGFdb2YgdGhpcyl5aWVsZCBhfX1cblxuLyoqIEBwYXJhbSB7Rm9ybURhdGF9IEYgKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JtRGF0YVRvQmxvYiAoRixCPUMpe1xudmFyIGI9YCR7cigpfSR7cigpfWAucmVwbGFjZSgvXFwuL2csICcnKS5zbGljZSgtMjgpLnBhZFN0YXJ0KDMyLCAnLScpLGM9W10scD1gLS0ke2J9XFxyXFxuQ29udGVudC1EaXNwb3NpdGlvbjogZm9ybS1kYXRhOyBuYW1lPVwiYFxuRi5mb3JFYWNoKCh2LG4pPT50eXBlb2Ygdj09J3N0cmluZydcbj9jLnB1c2gocCtlKG4pK2BcIlxcclxcblxcclxcbiR7di5yZXBsYWNlKC9cXHIoPyFcXG4pfCg/PCFcXHIpXFxuL2csICdcXHJcXG4nKX1cXHJcXG5gKVxuOmMucHVzaChwK2UobikrYFwiOyBmaWxlbmFtZT1cIiR7ZSh2Lm5hbWUsIDEpfVwiXFxyXFxuQ29udGVudC1UeXBlOiAke3YudHlwZXx8XCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIn1cXHJcXG5cXHJcXG5gLCB2LCAnXFxyXFxuJykpXG5jLnB1c2goYC0tJHtifS0tYClcbnJldHVybiBuZXcgQihjLHt0eXBlOlwibXVsdGlwYXJ0L2Zvcm0tZGF0YTsgYm91bmRhcnk9XCIrYn0pfVxuIiwgIi8qISBub2RlLWRvbWV4Y2VwdGlvbi4gTUlUIExpY2Vuc2UuIEppbW15IFdcdTAwRTRydGluZyA8aHR0cHM6Ly9qaW1teS53YXJ0aW5nLnNlL29wZW5zb3VyY2U+ICovXG5cbmlmICghZ2xvYmFsVGhpcy5ET01FeGNlcHRpb24pIHtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IE1lc3NhZ2VDaGFubmVsIH0gPSByZXF1aXJlKCd3b3JrZXJfdGhyZWFkcycpLFxuICAgIHBvcnQgPSBuZXcgTWVzc2FnZUNoYW5uZWwoKS5wb3J0MSxcbiAgICBhYiA9IG5ldyBBcnJheUJ1ZmZlcigpXG4gICAgcG9ydC5wb3N0TWVzc2FnZShhYiwgW2FiLCBhYl0pXG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGVyci5jb25zdHJ1Y3Rvci5uYW1lID09PSAnRE9NRXhjZXB0aW9uJyAmJiAoXG4gICAgICBnbG9iYWxUaGlzLkRPTUV4Y2VwdGlvbiA9IGVyci5jb25zdHJ1Y3RvclxuICAgIClcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdsb2JhbFRoaXMuRE9NRXhjZXB0aW9uXG4iLCAiaW1wb3J0IHsgc3RhdFN5bmMsIGNyZWF0ZVJlYWRTdHJlYW0sIHByb21pc2VzIGFzIGZzIH0gZnJvbSAnbm9kZTpmcydcbmltcG9ydCB7IGJhc2VuYW1lIH0gZnJvbSAnbm9kZTpwYXRoJ1xuaW1wb3J0IERPTUV4Y2VwdGlvbiBmcm9tICdub2RlLWRvbWV4Y2VwdGlvbidcblxuaW1wb3J0IEZpbGUgZnJvbSAnLi9maWxlLmpzJ1xuaW1wb3J0IEJsb2IgZnJvbSAnLi9pbmRleC5qcydcblxuY29uc3QgeyBzdGF0IH0gPSBmc1xuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIGZpbGVwYXRoIG9uIHRoZSBkaXNrXG4gKiBAcGFyYW0ge3N0cmluZ30gW3R5cGVdIG1pbWV0eXBlIHRvIHVzZVxuICovXG5jb25zdCBibG9iRnJvbVN5bmMgPSAocGF0aCwgdHlwZSkgPT4gZnJvbUJsb2Ioc3RhdFN5bmMocGF0aCksIHBhdGgsIHR5cGUpXG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggZmlsZXBhdGggb24gdGhlIGRpc2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBbdHlwZV0gbWltZXR5cGUgdG8gdXNlXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxCbG9iPn1cbiAqL1xuY29uc3QgYmxvYkZyb20gPSAocGF0aCwgdHlwZSkgPT4gc3RhdChwYXRoKS50aGVuKHN0YXQgPT4gZnJvbUJsb2Ioc3RhdCwgcGF0aCwgdHlwZSkpXG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggZmlsZXBhdGggb24gdGhlIGRpc2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBbdHlwZV0gbWltZXR5cGUgdG8gdXNlXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxGaWxlPn1cbiAqL1xuY29uc3QgZmlsZUZyb20gPSAocGF0aCwgdHlwZSkgPT4gc3RhdChwYXRoKS50aGVuKHN0YXQgPT4gZnJvbUZpbGUoc3RhdCwgcGF0aCwgdHlwZSkpXG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggZmlsZXBhdGggb24gdGhlIGRpc2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBbdHlwZV0gbWltZXR5cGUgdG8gdXNlXG4gKi9cbmNvbnN0IGZpbGVGcm9tU3luYyA9IChwYXRoLCB0eXBlKSA9PiBmcm9tRmlsZShzdGF0U3luYyhwYXRoKSwgcGF0aCwgdHlwZSlcblxuLy8gQHRzLWlnbm9yZVxuY29uc3QgZnJvbUJsb2IgPSAoc3RhdCwgcGF0aCwgdHlwZSA9ICcnKSA9PiBuZXcgQmxvYihbbmV3IEJsb2JEYXRhSXRlbSh7XG4gIHBhdGgsXG4gIHNpemU6IHN0YXQuc2l6ZSxcbiAgbGFzdE1vZGlmaWVkOiBzdGF0Lm10aW1lTXMsXG4gIHN0YXJ0OiAwXG59KV0sIHsgdHlwZSB9KVxuXG4vLyBAdHMtaWdub3JlXG5jb25zdCBmcm9tRmlsZSA9IChzdGF0LCBwYXRoLCB0eXBlID0gJycpID0+IG5ldyBGaWxlKFtuZXcgQmxvYkRhdGFJdGVtKHtcbiAgcGF0aCxcbiAgc2l6ZTogc3RhdC5zaXplLFxuICBsYXN0TW9kaWZpZWQ6IHN0YXQubXRpbWVNcyxcbiAgc3RhcnQ6IDBcbn0pXSwgYmFzZW5hbWUocGF0aCksIHsgdHlwZSwgbGFzdE1vZGlmaWVkOiBzdGF0Lm10aW1lTXMgfSlcblxuLyoqXG4gKiBUaGlzIGlzIGEgYmxvYiBiYWNrZWQgdXAgYnkgYSBmaWxlIG9uIHRoZSBkaXNrXG4gKiB3aXRoIG1pbml1bSByZXF1aXJlbWVudC4gSXRzIHdyYXBwZWQgYXJvdW5kIGEgQmxvYiBhcyBhIGJsb2JQYXJ0XG4gKiBzbyB5b3UgaGF2ZSBubyBkaXJlY3QgYWNjZXNzIHRvIHRoaXMuXG4gKlxuICogQHByaXZhdGVcbiAqL1xuY2xhc3MgQmxvYkRhdGFJdGVtIHtcbiAgI3BhdGhcbiAgI3N0YXJ0XG5cbiAgY29uc3RydWN0b3IgKG9wdGlvbnMpIHtcbiAgICB0aGlzLiNwYXRoID0gb3B0aW9ucy5wYXRoXG4gICAgdGhpcy4jc3RhcnQgPSBvcHRpb25zLnN0YXJ0XG4gICAgdGhpcy5zaXplID0gb3B0aW9ucy5zaXplXG4gICAgdGhpcy5sYXN0TW9kaWZpZWQgPSBvcHRpb25zLmxhc3RNb2RpZmllZFxuICB9XG5cbiAgLyoqXG4gICAqIFNsaWNpbmcgYXJndW1lbnRzIGlzIGZpcnN0IHZhbGlkYXRlZCBhbmQgZm9ybWF0dGVkXG4gICAqIHRvIG5vdCBiZSBvdXQgb2YgcmFuZ2UgYnkgQmxvYi5wcm90b3R5cGUuc2xpY2VcbiAgICovXG4gIHNsaWNlIChzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIG5ldyBCbG9iRGF0YUl0ZW0oe1xuICAgICAgcGF0aDogdGhpcy4jcGF0aCxcbiAgICAgIGxhc3RNb2RpZmllZDogdGhpcy5sYXN0TW9kaWZpZWQsXG4gICAgICBzaXplOiBlbmQgLSBzdGFydCxcbiAgICAgIHN0YXJ0OiB0aGlzLiNzdGFydCArIHN0YXJ0XG4gICAgfSlcbiAgfVxuXG4gIGFzeW5jICogc3RyZWFtICgpIHtcbiAgICBjb25zdCB7IG10aW1lTXMgfSA9IGF3YWl0IHN0YXQodGhpcy4jcGF0aClcbiAgICBpZiAobXRpbWVNcyA+IHRoaXMubGFzdE1vZGlmaWVkKSB7XG4gICAgICB0aHJvdyBuZXcgRE9NRXhjZXB0aW9uKCdUaGUgcmVxdWVzdGVkIGZpbGUgY291bGQgbm90IGJlIHJlYWQsIHR5cGljYWxseSBkdWUgdG8gcGVybWlzc2lvbiBwcm9ibGVtcyB0aGF0IGhhdmUgb2NjdXJyZWQgYWZ0ZXIgYSByZWZlcmVuY2UgdG8gYSBmaWxlIHdhcyBhY3F1aXJlZC4nLCAnTm90UmVhZGFibGVFcnJvcicpXG4gICAgfVxuICAgIHlpZWxkICogY3JlYXRlUmVhZFN0cmVhbSh0aGlzLiNwYXRoLCB7XG4gICAgICBzdGFydDogdGhpcy4jc3RhcnQsXG4gICAgICBlbmQ6IHRoaXMuI3N0YXJ0ICsgdGhpcy5zaXplIC0gMVxuICAgIH0pXG4gIH1cblxuICBnZXQgW1N5bWJvbC50b1N0cmluZ1RhZ10gKCkge1xuICAgIHJldHVybiAnQmxvYidcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBibG9iRnJvbVN5bmNcbmV4cG9ydCB7IEZpbGUsIEJsb2IsIGJsb2JGcm9tLCBibG9iRnJvbVN5bmMsIGZpbGVGcm9tLCBmaWxlRnJvbVN5bmMgfVxuIiwgImltcG9ydCB7RmlsZX0gZnJvbSAnZmV0Y2gtYmxvYi9mcm9tLmpzJztcbmltcG9ydCB7Rm9ybURhdGF9IGZyb20gJ2Zvcm1kYXRhLXBvbHlmaWxsL2VzbS5taW4uanMnO1xuXG5sZXQgcyA9IDA7XG5jb25zdCBTID0ge1xuXHRTVEFSVF9CT1VOREFSWTogcysrLFxuXHRIRUFERVJfRklFTERfU1RBUlQ6IHMrKyxcblx0SEVBREVSX0ZJRUxEOiBzKyssXG5cdEhFQURFUl9WQUxVRV9TVEFSVDogcysrLFxuXHRIRUFERVJfVkFMVUU6IHMrKyxcblx0SEVBREVSX1ZBTFVFX0FMTU9TVF9ET05FOiBzKyssXG5cdEhFQURFUlNfQUxNT1NUX0RPTkU6IHMrKyxcblx0UEFSVF9EQVRBX1NUQVJUOiBzKyssXG5cdFBBUlRfREFUQTogcysrLFxuXHRFTkQ6IHMrK1xufTtcblxubGV0IGYgPSAxO1xuY29uc3QgRiA9IHtcblx0UEFSVF9CT1VOREFSWTogZixcblx0TEFTVF9CT1VOREFSWTogZiAqPSAyXG59O1xuXG5jb25zdCBMRiA9IDEwO1xuY29uc3QgQ1IgPSAxMztcbmNvbnN0IFNQQUNFID0gMzI7XG5jb25zdCBIWVBIRU4gPSA0NTtcbmNvbnN0IENPTE9OID0gNTg7XG5jb25zdCBBID0gOTc7XG5jb25zdCBaID0gMTIyO1xuXG5jb25zdCBsb3dlciA9IGMgPT4gYyB8IDB4MjA7XG5cbmNvbnN0IG5vb3AgPSAoKSA9PiB7fTtcblxuY2xhc3MgTXVsdGlwYXJ0UGFyc2VyIHtcblx0LyoqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBib3VuZGFyeVxuXHQgKi9cblx0Y29uc3RydWN0b3IoYm91bmRhcnkpIHtcblx0XHR0aGlzLmluZGV4ID0gMDtcblx0XHR0aGlzLmZsYWdzID0gMDtcblxuXHRcdHRoaXMub25IZWFkZXJFbmQgPSBub29wO1xuXHRcdHRoaXMub25IZWFkZXJGaWVsZCA9IG5vb3A7XG5cdFx0dGhpcy5vbkhlYWRlcnNFbmQgPSBub29wO1xuXHRcdHRoaXMub25IZWFkZXJWYWx1ZSA9IG5vb3A7XG5cdFx0dGhpcy5vblBhcnRCZWdpbiA9IG5vb3A7XG5cdFx0dGhpcy5vblBhcnREYXRhID0gbm9vcDtcblx0XHR0aGlzLm9uUGFydEVuZCA9IG5vb3A7XG5cblx0XHR0aGlzLmJvdW5kYXJ5Q2hhcnMgPSB7fTtcblxuXHRcdGJvdW5kYXJ5ID0gJ1xcclxcbi0tJyArIGJvdW5kYXJ5O1xuXHRcdGNvbnN0IHVpOGEgPSBuZXcgVWludDhBcnJheShib3VuZGFyeS5sZW5ndGgpO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYm91bmRhcnkubGVuZ3RoOyBpKyspIHtcblx0XHRcdHVpOGFbaV0gPSBib3VuZGFyeS5jaGFyQ29kZUF0KGkpO1xuXHRcdFx0dGhpcy5ib3VuZGFyeUNoYXJzW3VpOGFbaV1dID0gdHJ1ZTtcblx0XHR9XG5cblx0XHR0aGlzLmJvdW5kYXJ5ID0gdWk4YTtcblx0XHR0aGlzLmxvb2tiZWhpbmQgPSBuZXcgVWludDhBcnJheSh0aGlzLmJvdW5kYXJ5Lmxlbmd0aCArIDgpO1xuXHRcdHRoaXMuc3RhdGUgPSBTLlNUQVJUX0JPVU5EQVJZO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwYXJhbSB7VWludDhBcnJheX0gZGF0YVxuXHQgKi9cblx0d3JpdGUoZGF0YSkge1xuXHRcdGxldCBpID0gMDtcblx0XHRjb25zdCBsZW5ndGhfID0gZGF0YS5sZW5ndGg7XG5cdFx0bGV0IHByZXZpb3VzSW5kZXggPSB0aGlzLmluZGV4O1xuXHRcdGxldCB7bG9va2JlaGluZCwgYm91bmRhcnksIGJvdW5kYXJ5Q2hhcnMsIGluZGV4LCBzdGF0ZSwgZmxhZ3N9ID0gdGhpcztcblx0XHRjb25zdCBib3VuZGFyeUxlbmd0aCA9IHRoaXMuYm91bmRhcnkubGVuZ3RoO1xuXHRcdGNvbnN0IGJvdW5kYXJ5RW5kID0gYm91bmRhcnlMZW5ndGggLSAxO1xuXHRcdGNvbnN0IGJ1ZmZlckxlbmd0aCA9IGRhdGEubGVuZ3RoO1xuXHRcdGxldCBjO1xuXHRcdGxldCBjbDtcblxuXHRcdGNvbnN0IG1hcmsgPSBuYW1lID0+IHtcblx0XHRcdHRoaXNbbmFtZSArICdNYXJrJ10gPSBpO1xuXHRcdH07XG5cblx0XHRjb25zdCBjbGVhciA9IG5hbWUgPT4ge1xuXHRcdFx0ZGVsZXRlIHRoaXNbbmFtZSArICdNYXJrJ107XG5cdFx0fTtcblxuXHRcdGNvbnN0IGNhbGxiYWNrID0gKGNhbGxiYWNrU3ltYm9sLCBzdGFydCwgZW5kLCB1aThhKSA9PiB7XG5cdFx0XHRpZiAoc3RhcnQgPT09IHVuZGVmaW5lZCB8fCBzdGFydCAhPT0gZW5kKSB7XG5cdFx0XHRcdHRoaXNbY2FsbGJhY2tTeW1ib2xdKHVpOGEgJiYgdWk4YS5zdWJhcnJheShzdGFydCwgZW5kKSk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdGNvbnN0IGRhdGFDYWxsYmFjayA9IChuYW1lLCBjbGVhcikgPT4ge1xuXHRcdFx0Y29uc3QgbWFya1N5bWJvbCA9IG5hbWUgKyAnTWFyayc7XG5cdFx0XHRpZiAoIShtYXJrU3ltYm9sIGluIHRoaXMpKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGNsZWFyKSB7XG5cdFx0XHRcdGNhbGxiYWNrKG5hbWUsIHRoaXNbbWFya1N5bWJvbF0sIGksIGRhdGEpO1xuXHRcdFx0XHRkZWxldGUgdGhpc1ttYXJrU3ltYm9sXTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNhbGxiYWNrKG5hbWUsIHRoaXNbbWFya1N5bWJvbF0sIGRhdGEubGVuZ3RoLCBkYXRhKTtcblx0XHRcdFx0dGhpc1ttYXJrU3ltYm9sXSA9IDA7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdGZvciAoaSA9IDA7IGkgPCBsZW5ndGhfOyBpKyspIHtcblx0XHRcdGMgPSBkYXRhW2ldO1xuXG5cdFx0XHRzd2l0Y2ggKHN0YXRlKSB7XG5cdFx0XHRcdGNhc2UgUy5TVEFSVF9CT1VOREFSWTpcblx0XHRcdFx0XHRpZiAoaW5kZXggPT09IGJvdW5kYXJ5Lmxlbmd0aCAtIDIpIHtcblx0XHRcdFx0XHRcdGlmIChjID09PSBIWVBIRU4pIHtcblx0XHRcdFx0XHRcdFx0ZmxhZ3MgfD0gRi5MQVNUX0JPVU5EQVJZO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChjICE9PSBDUikge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGluZGV4Kys7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGluZGV4IC0gMSA9PT0gYm91bmRhcnkubGVuZ3RoIC0gMikge1xuXHRcdFx0XHRcdFx0aWYgKGZsYWdzICYgRi5MQVNUX0JPVU5EQVJZICYmIGMgPT09IEhZUEhFTikge1xuXHRcdFx0XHRcdFx0XHRzdGF0ZSA9IFMuRU5EO1xuXHRcdFx0XHRcdFx0XHRmbGFncyA9IDA7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCEoZmxhZ3MgJiBGLkxBU1RfQk9VTkRBUlkpICYmIGMgPT09IExGKSB7XG5cdFx0XHRcdFx0XHRcdGluZGV4ID0gMDtcblx0XHRcdFx0XHRcdFx0Y2FsbGJhY2soJ29uUGFydEJlZ2luJyk7XG5cdFx0XHRcdFx0XHRcdHN0YXRlID0gUy5IRUFERVJfRklFTERfU1RBUlQ7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChjICE9PSBib3VuZGFyeVtpbmRleCArIDJdKSB7XG5cdFx0XHRcdFx0XHRpbmRleCA9IC0yO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChjID09PSBib3VuZGFyeVtpbmRleCArIDJdKSB7XG5cdFx0XHRcdFx0XHRpbmRleCsrO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFMuSEVBREVSX0ZJRUxEX1NUQVJUOlxuXHRcdFx0XHRcdHN0YXRlID0gUy5IRUFERVJfRklFTEQ7XG5cdFx0XHRcdFx0bWFyaygnb25IZWFkZXJGaWVsZCcpO1xuXHRcdFx0XHRcdGluZGV4ID0gMDtcblx0XHRcdFx0XHQvLyBmYWxscyB0aHJvdWdoXG5cdFx0XHRcdGNhc2UgUy5IRUFERVJfRklFTEQ6XG5cdFx0XHRcdFx0aWYgKGMgPT09IENSKSB7XG5cdFx0XHRcdFx0XHRjbGVhcignb25IZWFkZXJGaWVsZCcpO1xuXHRcdFx0XHRcdFx0c3RhdGUgPSBTLkhFQURFUlNfQUxNT1NUX0RPTkU7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpbmRleCsrO1xuXHRcdFx0XHRcdGlmIChjID09PSBIWVBIRU4pIHtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChjID09PSBDT0xPTikge1xuXHRcdFx0XHRcdFx0aWYgKGluZGV4ID09PSAxKSB7XG5cdFx0XHRcdFx0XHRcdC8vIGVtcHR5IGhlYWRlciBmaWVsZFxuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGRhdGFDYWxsYmFjaygnb25IZWFkZXJGaWVsZCcsIHRydWUpO1xuXHRcdFx0XHRcdFx0c3RhdGUgPSBTLkhFQURFUl9WQUxVRV9TVEFSVDtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGNsID0gbG93ZXIoYyk7XG5cdFx0XHRcdFx0aWYgKGNsIDwgQSB8fCBjbCA+IFopIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBTLkhFQURFUl9WQUxVRV9TVEFSVDpcblx0XHRcdFx0XHRpZiAoYyA9PT0gU1BBQ0UpIHtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdG1hcmsoJ29uSGVhZGVyVmFsdWUnKTtcblx0XHRcdFx0XHRzdGF0ZSA9IFMuSEVBREVSX1ZBTFVFO1xuXHRcdFx0XHRcdC8vIGZhbGxzIHRocm91Z2hcblx0XHRcdFx0Y2FzZSBTLkhFQURFUl9WQUxVRTpcblx0XHRcdFx0XHRpZiAoYyA9PT0gQ1IpIHtcblx0XHRcdFx0XHRcdGRhdGFDYWxsYmFjaygnb25IZWFkZXJWYWx1ZScsIHRydWUpO1xuXHRcdFx0XHRcdFx0Y2FsbGJhY2soJ29uSGVhZGVyRW5kJyk7XG5cdFx0XHRcdFx0XHRzdGF0ZSA9IFMuSEVBREVSX1ZBTFVFX0FMTU9TVF9ET05FO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFMuSEVBREVSX1ZBTFVFX0FMTU9TVF9ET05FOlxuXHRcdFx0XHRcdGlmIChjICE9PSBMRikge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHN0YXRlID0gUy5IRUFERVJfRklFTERfU1RBUlQ7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgUy5IRUFERVJTX0FMTU9TVF9ET05FOlxuXHRcdFx0XHRcdGlmIChjICE9PSBMRikge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGNhbGxiYWNrKCdvbkhlYWRlcnNFbmQnKTtcblx0XHRcdFx0XHRzdGF0ZSA9IFMuUEFSVF9EQVRBX1NUQVJUO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFMuUEFSVF9EQVRBX1NUQVJUOlxuXHRcdFx0XHRcdHN0YXRlID0gUy5QQVJUX0RBVEE7XG5cdFx0XHRcdFx0bWFyaygnb25QYXJ0RGF0YScpO1xuXHRcdFx0XHRcdC8vIGZhbGxzIHRocm91Z2hcblx0XHRcdFx0Y2FzZSBTLlBBUlRfREFUQTpcblx0XHRcdFx0XHRwcmV2aW91c0luZGV4ID0gaW5kZXg7XG5cblx0XHRcdFx0XHRpZiAoaW5kZXggPT09IDApIHtcblx0XHRcdFx0XHRcdC8vIGJveWVyLW1vb3JlIGRlcnJpdmVkIGFsZ29yaXRobSB0byBzYWZlbHkgc2tpcCBub24tYm91bmRhcnkgZGF0YVxuXHRcdFx0XHRcdFx0aSArPSBib3VuZGFyeUVuZDtcblx0XHRcdFx0XHRcdHdoaWxlIChpIDwgYnVmZmVyTGVuZ3RoICYmICEoZGF0YVtpXSBpbiBib3VuZGFyeUNoYXJzKSkge1xuXHRcdFx0XHRcdFx0XHRpICs9IGJvdW5kYXJ5TGVuZ3RoO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpIC09IGJvdW5kYXJ5RW5kO1xuXHRcdFx0XHRcdFx0YyA9IGRhdGFbaV07XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKGluZGV4IDwgYm91bmRhcnkubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRpZiAoYm91bmRhcnlbaW5kZXhdID09PSBjKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChpbmRleCA9PT0gMCkge1xuXHRcdFx0XHRcdFx0XHRcdGRhdGFDYWxsYmFjaygnb25QYXJ0RGF0YScsIHRydWUpO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0aW5kZXgrKztcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGluZGV4ID0gMDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2UgaWYgKGluZGV4ID09PSBib3VuZGFyeS5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdGluZGV4Kys7XG5cdFx0XHRcdFx0XHRpZiAoYyA9PT0gQ1IpIHtcblx0XHRcdFx0XHRcdFx0Ly8gQ1IgPSBwYXJ0IGJvdW5kYXJ5XG5cdFx0XHRcdFx0XHRcdGZsYWdzIHw9IEYuUEFSVF9CT1VOREFSWTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYyA9PT0gSFlQSEVOKSB7XG5cdFx0XHRcdFx0XHRcdC8vIEhZUEhFTiA9IGVuZCBib3VuZGFyeVxuXHRcdFx0XHRcdFx0XHRmbGFncyB8PSBGLkxBU1RfQk9VTkRBUlk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRpbmRleCA9IDA7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChpbmRleCAtIDEgPT09IGJvdW5kYXJ5Lmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0aWYgKGZsYWdzICYgRi5QQVJUX0JPVU5EQVJZKSB7XG5cdFx0XHRcdFx0XHRcdGluZGV4ID0gMDtcblx0XHRcdFx0XHRcdFx0aWYgKGMgPT09IExGKSB7XG5cdFx0XHRcdFx0XHRcdFx0Ly8gdW5zZXQgdGhlIFBBUlRfQk9VTkRBUlkgZmxhZ1xuXHRcdFx0XHRcdFx0XHRcdGZsYWdzICY9IH5GLlBBUlRfQk9VTkRBUlk7XG5cdFx0XHRcdFx0XHRcdFx0Y2FsbGJhY2soJ29uUGFydEVuZCcpO1xuXHRcdFx0XHRcdFx0XHRcdGNhbGxiYWNrKCdvblBhcnRCZWdpbicpO1xuXHRcdFx0XHRcdFx0XHRcdHN0YXRlID0gUy5IRUFERVJfRklFTERfU1RBUlQ7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoZmxhZ3MgJiBGLkxBU1RfQk9VTkRBUlkpIHtcblx0XHRcdFx0XHRcdFx0aWYgKGMgPT09IEhZUEhFTikge1xuXHRcdFx0XHRcdFx0XHRcdGNhbGxiYWNrKCdvblBhcnRFbmQnKTtcblx0XHRcdFx0XHRcdFx0XHRzdGF0ZSA9IFMuRU5EO1xuXHRcdFx0XHRcdFx0XHRcdGZsYWdzID0gMDtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRpbmRleCA9IDA7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGluZGV4ID0gMDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoaW5kZXggPiAwKSB7XG5cdFx0XHRcdFx0XHQvLyB3aGVuIG1hdGNoaW5nIGEgcG9zc2libGUgYm91bmRhcnksIGtlZXAgYSBsb29rYmVoaW5kIHJlZmVyZW5jZVxuXHRcdFx0XHRcdFx0Ly8gaW4gY2FzZSBpdCB0dXJucyBvdXQgdG8gYmUgYSBmYWxzZSBsZWFkXG5cdFx0XHRcdFx0XHRsb29rYmVoaW5kW2luZGV4IC0gMV0gPSBjO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAocHJldmlvdXNJbmRleCA+IDApIHtcblx0XHRcdFx0XHRcdC8vIGlmIG91ciBib3VuZGFyeSB0dXJuZWQgb3V0IHRvIGJlIHJ1YmJpc2gsIHRoZSBjYXB0dXJlZCBsb29rYmVoaW5kXG5cdFx0XHRcdFx0XHQvLyBiZWxvbmdzIHRvIHBhcnREYXRhXG5cdFx0XHRcdFx0XHRjb25zdCBfbG9va2JlaGluZCA9IG5ldyBVaW50OEFycmF5KGxvb2tiZWhpbmQuYnVmZmVyLCBsb29rYmVoaW5kLmJ5dGVPZmZzZXQsIGxvb2tiZWhpbmQuYnl0ZUxlbmd0aCk7XG5cdFx0XHRcdFx0XHRjYWxsYmFjaygnb25QYXJ0RGF0YScsIDAsIHByZXZpb3VzSW5kZXgsIF9sb29rYmVoaW5kKTtcblx0XHRcdFx0XHRcdHByZXZpb3VzSW5kZXggPSAwO1xuXHRcdFx0XHRcdFx0bWFyaygnb25QYXJ0RGF0YScpO1xuXG5cdFx0XHRcdFx0XHQvLyByZWNvbnNpZGVyIHRoZSBjdXJyZW50IGNoYXJhY3RlciBldmVuIHNvIGl0IGludGVycnVwdGVkIHRoZSBzZXF1ZW5jZVxuXHRcdFx0XHRcdFx0Ly8gaXQgY291bGQgYmUgdGhlIGJlZ2lubmluZyBvZiBhIG5ldyBzZXF1ZW5jZVxuXHRcdFx0XHRcdFx0aS0tO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFMuRU5EOlxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5leHBlY3RlZCBzdGF0ZSBlbnRlcmVkOiAke3N0YXRlfWApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGRhdGFDYWxsYmFjaygnb25IZWFkZXJGaWVsZCcpO1xuXHRcdGRhdGFDYWxsYmFjaygnb25IZWFkZXJWYWx1ZScpO1xuXHRcdGRhdGFDYWxsYmFjaygnb25QYXJ0RGF0YScpO1xuXG5cdFx0Ly8gVXBkYXRlIHByb3BlcnRpZXMgZm9yIHRoZSBuZXh0IGNhbGxcblx0XHR0aGlzLmluZGV4ID0gaW5kZXg7XG5cdFx0dGhpcy5zdGF0ZSA9IHN0YXRlO1xuXHRcdHRoaXMuZmxhZ3MgPSBmbGFncztcblx0fVxuXG5cdGVuZCgpIHtcblx0XHRpZiAoKHRoaXMuc3RhdGUgPT09IFMuSEVBREVSX0ZJRUxEX1NUQVJUICYmIHRoaXMuaW5kZXggPT09IDApIHx8XG5cdFx0XHQodGhpcy5zdGF0ZSA9PT0gUy5QQVJUX0RBVEEgJiYgdGhpcy5pbmRleCA9PT0gdGhpcy5ib3VuZGFyeS5sZW5ndGgpKSB7XG5cdFx0XHR0aGlzLm9uUGFydEVuZCgpO1xuXHRcdH0gZWxzZSBpZiAodGhpcy5zdGF0ZSAhPT0gUy5FTkQpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignTXVsdGlwYXJ0UGFyc2VyLmVuZCgpOiBzdHJlYW0gZW5kZWQgdW5leHBlY3RlZGx5Jyk7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIF9maWxlTmFtZShoZWFkZXJWYWx1ZSkge1xuXHQvLyBtYXRjaGVzIGVpdGhlciBhIHF1b3RlZC1zdHJpbmcgb3IgYSB0b2tlbiAoUkZDIDI2MTYgc2VjdGlvbiAxOS41LjEpXG5cdGNvbnN0IG0gPSBoZWFkZXJWYWx1ZS5tYXRjaCgvXFxiZmlsZW5hbWU9KFwiKC4qPylcInwoW14oKTw+QCw7OlxcXFxcIi9bXFxdPz17fVxcc1xcdF0rKSkoJHw7XFxzKS9pKTtcblx0aWYgKCFtKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Y29uc3QgbWF0Y2ggPSBtWzJdIHx8IG1bM10gfHwgJyc7XG5cdGxldCBmaWxlbmFtZSA9IG1hdGNoLnNsaWNlKG1hdGNoLmxhc3RJbmRleE9mKCdcXFxcJykgKyAxKTtcblx0ZmlsZW5hbWUgPSBmaWxlbmFtZS5yZXBsYWNlKC8lMjIvZywgJ1wiJyk7XG5cdGZpbGVuYW1lID0gZmlsZW5hbWUucmVwbGFjZSgvJiMoXFxkezR9KTsvZywgKG0sIGNvZGUpID0+IHtcblx0XHRyZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShjb2RlKTtcblx0fSk7XG5cdHJldHVybiBmaWxlbmFtZTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRvRm9ybURhdGEoQm9keSwgY3QpIHtcblx0aWYgKCEvbXVsdGlwYXJ0L2kudGVzdChjdCkpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdGYWlsZWQgdG8gZmV0Y2gnKTtcblx0fVxuXG5cdGNvbnN0IG0gPSBjdC5tYXRjaCgvYm91bmRhcnk9KD86XCIoW15cIl0rKVwifChbXjtdKykpL2kpO1xuXG5cdGlmICghbSkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ25vIG9yIGJhZCBjb250ZW50LXR5cGUgaGVhZGVyLCBubyBtdWx0aXBhcnQgYm91bmRhcnknKTtcblx0fVxuXG5cdGNvbnN0IHBhcnNlciA9IG5ldyBNdWx0aXBhcnRQYXJzZXIobVsxXSB8fCBtWzJdKTtcblxuXHRsZXQgaGVhZGVyRmllbGQ7XG5cdGxldCBoZWFkZXJWYWx1ZTtcblx0bGV0IGVudHJ5VmFsdWU7XG5cdGxldCBlbnRyeU5hbWU7XG5cdGxldCBjb250ZW50VHlwZTtcblx0bGV0IGZpbGVuYW1lO1xuXHRjb25zdCBlbnRyeUNodW5rcyA9IFtdO1xuXHRjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuXG5cdGNvbnN0IG9uUGFydERhdGEgPSB1aThhID0+IHtcblx0XHRlbnRyeVZhbHVlICs9IGRlY29kZXIuZGVjb2RlKHVpOGEsIHtzdHJlYW06IHRydWV9KTtcblx0fTtcblxuXHRjb25zdCBhcHBlbmRUb0ZpbGUgPSB1aThhID0+IHtcblx0XHRlbnRyeUNodW5rcy5wdXNoKHVpOGEpO1xuXHR9O1xuXG5cdGNvbnN0IGFwcGVuZEZpbGVUb0Zvcm1EYXRhID0gKCkgPT4ge1xuXHRcdGNvbnN0IGZpbGUgPSBuZXcgRmlsZShlbnRyeUNodW5rcywgZmlsZW5hbWUsIHt0eXBlOiBjb250ZW50VHlwZX0pO1xuXHRcdGZvcm1EYXRhLmFwcGVuZChlbnRyeU5hbWUsIGZpbGUpO1xuXHR9O1xuXG5cdGNvbnN0IGFwcGVuZEVudHJ5VG9Gb3JtRGF0YSA9ICgpID0+IHtcblx0XHRmb3JtRGF0YS5hcHBlbmQoZW50cnlOYW1lLCBlbnRyeVZhbHVlKTtcblx0fTtcblxuXHRjb25zdCBkZWNvZGVyID0gbmV3IFRleHREZWNvZGVyKCd1dGYtOCcpO1xuXHRkZWNvZGVyLmRlY29kZSgpO1xuXG5cdHBhcnNlci5vblBhcnRCZWdpbiA9IGZ1bmN0aW9uICgpIHtcblx0XHRwYXJzZXIub25QYXJ0RGF0YSA9IG9uUGFydERhdGE7XG5cdFx0cGFyc2VyLm9uUGFydEVuZCA9IGFwcGVuZEVudHJ5VG9Gb3JtRGF0YTtcblxuXHRcdGhlYWRlckZpZWxkID0gJyc7XG5cdFx0aGVhZGVyVmFsdWUgPSAnJztcblx0XHRlbnRyeVZhbHVlID0gJyc7XG5cdFx0ZW50cnlOYW1lID0gJyc7XG5cdFx0Y29udGVudFR5cGUgPSAnJztcblx0XHRmaWxlbmFtZSA9IG51bGw7XG5cdFx0ZW50cnlDaHVua3MubGVuZ3RoID0gMDtcblx0fTtcblxuXHRwYXJzZXIub25IZWFkZXJGaWVsZCA9IGZ1bmN0aW9uICh1aThhKSB7XG5cdFx0aGVhZGVyRmllbGQgKz0gZGVjb2Rlci5kZWNvZGUodWk4YSwge3N0cmVhbTogdHJ1ZX0pO1xuXHR9O1xuXG5cdHBhcnNlci5vbkhlYWRlclZhbHVlID0gZnVuY3Rpb24gKHVpOGEpIHtcblx0XHRoZWFkZXJWYWx1ZSArPSBkZWNvZGVyLmRlY29kZSh1aThhLCB7c3RyZWFtOiB0cnVlfSk7XG5cdH07XG5cblx0cGFyc2VyLm9uSGVhZGVyRW5kID0gZnVuY3Rpb24gKCkge1xuXHRcdGhlYWRlclZhbHVlICs9IGRlY29kZXIuZGVjb2RlKCk7XG5cdFx0aGVhZGVyRmllbGQgPSBoZWFkZXJGaWVsZC50b0xvd2VyQ2FzZSgpO1xuXG5cdFx0aWYgKGhlYWRlckZpZWxkID09PSAnY29udGVudC1kaXNwb3NpdGlvbicpIHtcblx0XHRcdC8vIG1hdGNoZXMgZWl0aGVyIGEgcXVvdGVkLXN0cmluZyBvciBhIHRva2VuIChSRkMgMjYxNiBzZWN0aW9uIDE5LjUuMSlcblx0XHRcdGNvbnN0IG0gPSBoZWFkZXJWYWx1ZS5tYXRjaCgvXFxibmFtZT0oXCIoW15cIl0qKVwifChbXigpPD5ALDs6XFxcXFwiL1tcXF0/PXt9XFxzXFx0XSspKS9pKTtcblxuXHRcdFx0aWYgKG0pIHtcblx0XHRcdFx0ZW50cnlOYW1lID0gbVsyXSB8fCBtWzNdIHx8ICcnO1xuXHRcdFx0fVxuXG5cdFx0XHRmaWxlbmFtZSA9IF9maWxlTmFtZShoZWFkZXJWYWx1ZSk7XG5cblx0XHRcdGlmIChmaWxlbmFtZSkge1xuXHRcdFx0XHRwYXJzZXIub25QYXJ0RGF0YSA9IGFwcGVuZFRvRmlsZTtcblx0XHRcdFx0cGFyc2VyLm9uUGFydEVuZCA9IGFwcGVuZEZpbGVUb0Zvcm1EYXRhO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoaGVhZGVyRmllbGQgPT09ICdjb250ZW50LXR5cGUnKSB7XG5cdFx0XHRjb250ZW50VHlwZSA9IGhlYWRlclZhbHVlO1xuXHRcdH1cblxuXHRcdGhlYWRlclZhbHVlID0gJyc7XG5cdFx0aGVhZGVyRmllbGQgPSAnJztcblx0fTtcblxuXHRmb3IgYXdhaXQgKGNvbnN0IGNodW5rIG9mIEJvZHkpIHtcblx0XHRwYXJzZXIud3JpdGUoY2h1bmspO1xuXHR9XG5cblx0cGFyc2VyLmVuZCgpO1xuXG5cdHJldHVybiBmb3JtRGF0YTtcbn1cbiIsICJpbXBvcnQgeyBMaXN0LCBBY3Rpb25QYW5lbCwgQWN0aW9uLCBzaG93VG9hc3QsIFRvYXN0LCBJY29uLCBDb2xvciwgS2V5Ym9hcmQsIERldGFpbCB9IGZyb20gXCJAcmF5Y2FzdC9hcGlcIjtcbmltcG9ydCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBmZXRjaCBmcm9tIFwibm9kZS1mZXRjaFwiO1xuXG5pbnRlcmZhY2UgSHViU3RhdGUge1xuICBvbmxpbmU6IGJvb2xlYW47XG4gIHVwdGltZTogbnVtYmVyO1xuICBhdXRvQWM6IGJvb2xlYW47XG4gIGF1dG9MaWdodDogYm9vbGVhbjtcbiAgYWNfZHVyYXRpb246IHN0cmluZztcbiAgbGlnaHRfZHVyYXRpb246IHN0cmluZztcbiAgdW5pdHM6IHN0cmluZztcbiAgZXN0aW1hdGVkUGdCaWxsOiBudW1iZXI7XG4gIG1lZGlhQXVyYTogYm9vbGVhbjtcbiAgc29saXM/OiB7IHRvZGF5OiBzdHJpbmc7IGN1cnJlbnQ6IHN0cmluZzsgYmF0dGVyeTogc3RyaW5nOyBzdGF0dXM6IHN0cmluZyB9O1xuICB3ZWF0aGVyPzogeyB0ZW1wOiBudW1iZXI7IGh1bWlkaXR5OiBudW1iZXI7IGNvbmRpdGlvbjogc3RyaW5nOyBhcWk6IG51bWJlcjsgc3VucmlzZTogc3RyaW5nOyBzdW5zZXQ6IHN0cmluZyB9O1xuICBzdGF0cz86IHsgYWM/OiB7IHN0YXR1czogc3RyaW5nIH07IGxpZ2h0PzogeyBzdGF0dXM6IHN0cmluZyB9OyBhcmNoaXZlQ291bnQ/OiBudW1iZXIgfTtcbiAgcGd2Y2w/OiB7IHVuaXRzOiBzdHJpbmc7IGJpbGw6IHN0cmluZyB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDb21tYW5kKCkge1xuICBjb25zdCBbc3RhdGUsIHNldFN0YXRlXSA9IHVzZVN0YXRlPEh1YlN0YXRlIHwgbnVsbD4obnVsbCk7XG4gIGNvbnN0IFtpc0xvYWRpbmcsIHNldElzTG9hZGluZ10gPSB1c2VTdGF0ZSh0cnVlKTtcbiAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSB1c2VTdGF0ZTxzdHJpbmcgfCBudWxsPihudWxsKTtcblxuICBhc3luYyBmdW5jdGlvbiByZWZyZXNoKCkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaChcImh0dHA6Ly8xMjcuMC4wLjE6MzAzMC9zdGF0dXNcIik7XG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzLmpzb24oKTtcbiAgICAgIHNldFN0YXRlKGRhdGEgYXMgSHViU3RhdGUpO1xuICAgICAgc2V0RXJyb3IobnVsbCk7XG4gICAgfSBjYXRjaCAoZSkgeyBcbiAgICAgIHNldEVycm9yKFwiSHViIE9mZmxpbmVcIik7XG4gICAgfVxuICAgIGZpbmFsbHkgeyBzZXRJc0xvYWRpbmcoZmFsc2UpOyB9XG4gIH1cblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHJlZnJlc2goKTtcbiAgICBjb25zdCB0aW1lciA9IHNldEludGVydmFsKHJlZnJlc2gsIDEwMDAwKTtcbiAgICByZXR1cm4gKCkgPT4gY2xlYXJJbnRlcnZhbCh0aW1lcik7XG4gIH0sIFtdKTtcblxuICBhc3luYyBmdW5jdGlvbiBydW5BY3Rpb24obmFtZTogc3RyaW5nLCBlbmRwb2ludDogc3RyaW5nKSB7XG4gICAgc2hvd1RvYXN0KHsgc3R5bGU6IFRvYXN0LlN0eWxlLkFuaW1hdGVkLCB0aXRsZTogYFB1bHNpbmc6ICR7bmFtZX0uLi5gIH0pO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaChgaHR0cDovLzEyNy4wLjAuMTozMDMwJHtlbmRwb2ludH1gKTtcbiAgICAgIGlmICghcmVzLm9rKSB0aHJvdyBuZXcgRXJyb3IoXCJGYWlsZWRcIik7XG4gICAgICBzaG93VG9hc3QoeyBzdHlsZTogVG9hc3QuU3R5bGUuU3VjY2VzcywgdGl0bGU6IGBDb25maXJtZWQ6ICR7bmFtZX1gIH0pO1xuICAgICAgc2V0VGltZW91dChyZWZyZXNoLCA1MDApO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHNob3dUb2FzdCh7IHN0eWxlOiBUb2FzdC5TdHlsZS5GYWlsdXJlLCB0aXRsZTogXCJBY3Rpb24gRmFpbGVkXCIsIG1lc3NhZ2U6IFwiSHViIE9mZmxpbmVcIiB9KTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBhY1N0YXR1cyA9IChzdGF0ZT8uc3RhdHM/LmFjPy5zdGF0dXMgfHwgJ29mZicpLnRvVXBwZXJDYXNlKCk7XG4gIGNvbnN0IGx0U3RhdHVzID0gKHN0YXRlPy5zdGF0cz8ubGlnaHQ/LnN0YXR1cyB8fCAnb2ZmJykudG9VcHBlckNhc2UoKTtcbiAgY29uc3QgYWNDb2xvciA9IGFjU3RhdHVzID09PSAnT04nID8gQ29sb3IuR3JlZW4gOiBDb2xvci5SZWQ7XG4gIGNvbnN0IGx0Q29sb3IgPSBsdFN0YXR1cyA9PT0gJ09OJyA/IENvbG9yLkdyZWVuIDogQ29sb3IuUmVkO1xuXG4gIGNvbnN0IGdldFVwdGltZVN0ciA9IChzZWNzOiBudW1iZXIpID0+IHtcbiAgICBjb25zdCBoID0gTWF0aC5mbG9vcihzZWNzIC8gMzYwMCk7XG4gICAgY29uc3QgbSA9IE1hdGguZmxvb3IoKHNlY3MgJSAzNjAwKSAvIDYwKTtcbiAgICByZXR1cm4gYCR7aH1oICR7bX1tYDtcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxMaXN0IGlzTG9hZGluZz17aXNMb2FkaW5nfSBzZWFyY2hCYXJQbGFjZWhvbGRlcj1cIlByZWNpc2lvbiBDb250cm9sIENlbnRlci4uLlwiPlxuICAgICAgXG4gICAgICA8TGlzdC5TZWN0aW9uIHRpdGxlPVwiR3Jhdml0eSBTY2VuZXMgKEludGVudHMpXCI+XG4gICAgICAgIDxMaXN0Lkl0ZW1cbiAgICAgICAgICBpY29uPXtJY29uLlZpZGVvfVxuICAgICAgICAgIHRpdGxlPVwiVFYgVElNRVwiXG4gICAgICAgICAgc3VidGl0bGU9XCJEaW0gUHVycGxlICYgQUMgQ29vbFwiXG4gICAgICAgICAgYWN0aW9ucz17PEFjdGlvblBhbmVsPjxBY3Rpb24gdGl0bGU9XCJBY3RpdmF0ZVwiIGljb249e0ljb24uVmlkZW99IG9uQWN0aW9uPXsoKSA9PiBydW5BY3Rpb24oXCJUVlwiLCBcIi9zY2VuZS90dlwiKX0gLz48L0FjdGlvblBhbmVsPn1cbiAgICAgICAgLz5cbiAgICAgICAgPExpc3QuSXRlbVxuICAgICAgICAgIGljb249e0ljb24uQ29tcHV0ZXJTcGVha2VyfVxuICAgICAgICAgIHRpdGxlPVwiV09SSyBNT0RFXCJcbiAgICAgICAgICBzdWJ0aXRsZT1cIkJyaWdodCBXaGl0ZSAmIEFDIEZhblwiXG4gICAgICAgICAgYWN0aW9ucz17PEFjdGlvblBhbmVsPjxBY3Rpb24gdGl0bGU9XCJBY3RpdmF0ZVwiIGljb249e0ljb24uQ29tcHV0ZXJTcGVha2VyfSBvbkFjdGlvbj17KCkgPT4gcnVuQWN0aW9uKFwiV29ya1wiLCBcIi9zY2VuZS93b3JrXCIpfSAvPjwvQWN0aW9uUGFuZWw+fVxuICAgICAgICAvPlxuICAgICAgICA8TGlzdC5JdGVtXG4gICAgICAgICAgaWNvbj17SWNvbi5Ib3VzZX1cbiAgICAgICAgICB0aXRsZT1cIkJBQ0sgSE9NRVwiXG4gICAgICAgICAgc3VidGl0bGU9XCJXYXJtIFdlbGNvbWVcIlxuICAgICAgICAgIGFjdGlvbnM9ezxBY3Rpb25QYW5lbD48QWN0aW9uIHRpdGxlPVwiQWN0aXZhdGVcIiBpY29uPXtJY29uLkhvdXNlfSBvbkFjdGlvbj17KCkgPT4gcnVuQWN0aW9uKFwiSE9NRVwiLCBcIi9zY2VuZS9ob21lXCIpfSAvPjwvQWN0aW9uUGFuZWw+fVxuICAgICAgICAvPlxuICAgICAgPC9MaXN0LlNlY3Rpb24+XG5cbiAgICAgIDxMaXN0LlNlY3Rpb24gdGl0bGU9XCJQcmVjaXNpb24gSGFyZHdhcmUgQ29udHJvbFwiPlxuICAgICAgICA8TGlzdC5JdGVtXG4gICAgICAgICAgaWNvbj17SWNvbi5XaW5kfVxuICAgICAgICAgIHRpdGxlPVwiUGFuYXNvbmljIEFDIENvbnRyb2xsZXJcIlxuICAgICAgICAgIHN1YnRpdGxlPXthY1N0YXR1cyA9PT0gJ09OJyA/IGBSdW5uaW5nIGZvciAke3N0YXRlPy5hY19kdXJhdGlvbiB8fCAnMG0nfWAgOiBcIlN0YW5kYnlcIn1cbiAgICAgICAgICBhY2Nlc3Nvcmllcz17W3sgdGV4dDogYWNTdGF0dXMsIGNvbG9yOiBhY0NvbG9yIH1dfVxuICAgICAgICAgIGFjdGlvbnM9e1xuICAgICAgICAgICAgPEFjdGlvblBhbmVsIHRpdGxlPVwiQUMgUHJlY2lzaW9uIFB1bHNlXCI+XG4gICAgICAgICAgICAgIDxBY3Rpb24gaWNvbj17SWNvbi5DaGV2cm9uRG93bn0gdGl0bGU9XCJUZW1wZXJhdHVyZSBET1dOXCIgb25BY3Rpb249eygpID0+IHJ1bkFjdGlvbihcIlRlbXAgRG93blwiLCBcIi9jb250cm9sL3RlbXA/ZGlyPWRvd25cIil9IC8+XG4gICAgICAgICAgICAgIDxBY3Rpb24gaWNvbj17SWNvbi5DaGV2cm9uVXB9IHRpdGxlPVwiVGVtcGVyYXR1cmUgVVBcIiBzaG9ydGN1dD17eyBtb2RpZmllcnM6IFtcImNtZFwiXSwga2V5OiBcImVudGVyXCIgfX0gb25BY3Rpb249eygpID0+IHJ1bkFjdGlvbihcIlRlbXAgVXBcIiwgXCIvY29udHJvbC90ZW1wP2Rpcj11cFwiKX0gLz5cbiAgICAgICAgICAgICAgPEFjdGlvblBhbmVsLlNlY3Rpb24gdGl0bGU9XCJDbGltYXRlIFByZWNpc2lvblwiPlxuICAgICAgICAgICAgICAgIDxBY3Rpb24gaWNvbj17SWNvbi5WaWRlb30gdGl0bGU9XCJUViBNb2RlIChDb29sICYgUXVpZXQpXCIgb25BY3Rpb249eygpID0+IHJ1bkFjdGlvbihcIlRWIEFDXCIsIFwiL2NvbnRyb2wvYWNfdHZcIil9IC8+XG4gICAgICAgICAgICAgICAgPEFjdGlvbiBpY29uPXtJY29uLlBvd2VyfSB0aXRsZT1cIlRvZ2dsZSBQb3dlclwiIHNob3J0Y3V0PXt7IG1vZGlmaWVyczogW1wiY21kXCJdLCBrZXk6IFwidFwiIH19IG9uQWN0aW9uPXsoKSA9PiBydW5BY3Rpb24oXCJBQ1wiLCBhY1N0YXR1cyA9PT0gJ09OJyA/IFwiL2NvbnRyb2wvYWMvb2ZmXCIgOiBcIi9jb250cm9sL2FjL29uXCIpfSAvPlxuICAgICAgICAgICAgICAgIDxBY3Rpb24gaWNvbj17SWNvbi5Tbm93Zmxha2V9IHRpdGxlPVwiQ29vbCBNb2RlXCIgb25BY3Rpb249eygpID0+IHJ1bkFjdGlvbihcIkNvb2xcIiwgXCIvY29udHJvbC9hYy9tb2RlP21vZGU9Y29vbFwiKX0gLz5cbiAgICAgICAgICAgICAgICA8QWN0aW9uIGljb249e0ljb24uUmVwZWF0fSB0aXRsZT1cIlZlcnRpY2FsIFN3aW5nXCIgb25BY3Rpb249eygpID0+IHJ1bkFjdGlvbihcIlN3aW5nXCIsIFwiL2NvbnRyb2wvYWMvc3dpbmdcIil9IC8+XG4gICAgICAgICAgICAgICAgPEFjdGlvbiBpY29uPXtJY29uLkJvbHR9IHRpdGxlPVwiUG93ZXJmdWwgTW9kZVwiIG9uQWN0aW9uPXsoKSA9PiBydW5BY3Rpb24oXCJQb3dlcmZ1bFwiLCBcIi9jb250cm9sL2FjL3Bvd2VyZnVsP3BzPW9uXCIpfSAvPlxuICAgICAgICAgICAgICA8L0FjdGlvblBhbmVsLlNlY3Rpb24+XG4gICAgICAgICAgICA8L0FjdGlvblBhbmVsPlxuICAgICAgICAgIH1cbiAgICAgICAgLz5cbiAgICAgICAgPExpc3QuSXRlbVxuICAgICAgICAgIGljb249e0ljb24uU3VufVxuICAgICAgICAgIHRpdGxlPVwiV2l6IExpZ2h0aW5nIEh1YlwiXG4gICAgICAgICAgc3VidGl0bGU9e2x0U3RhdHVzID09PSAnT04nID8gYFJ1bm5pbmcgZm9yICR7c3RhdGU/LmxpZ2h0X2R1cmF0aW9uIHx8ICcxaCAzMm0nfWAgOiBcIlN0YW5kYnlcIn1cbiAgICAgICAgICBhY2Nlc3Nvcmllcz17W3sgdGV4dDogbHRTdGF0dXMsIGNvbG9yOiBsdENvbG9yIH1dfVxuICAgICAgICAgIGFjdGlvbnM9e1xuICAgICAgICAgICAgPEFjdGlvblBhbmVsIHRpdGxlPVwiTGlnaHQgVGFjdGljYWwgUHVsc2VcIj5cbiAgICAgICAgICAgICAgPEFjdGlvbiBpY29uPXtJY29uLk1pbnVzfSB0aXRsZT1cIkJyaWdodG5lc3MgRE9XTlwiIG9uQWN0aW9uPXsoKSA9PiBydW5BY3Rpb24oXCJCcmlnaHQgRG93blwiLCBcIi9jb250cm9sL2JyaWdodG5lc3M/ZGlyPWRvd25cIil9IC8+XG4gICAgICAgICAgICAgIDxBY3Rpb24gaWNvbj17SWNvbi5QbHVzfSB0aXRsZT1cIkJyaWdodG5lc3MgVVBcIiBzaG9ydGN1dD17eyBtb2RpZmllcnM6IFtcImNtZFwiXSwga2V5OiBcImVudGVyXCIgfX0gb25BY3Rpb249eygpID0+IHJ1bkFjdGlvbihcIkJyaWdodCBVcFwiLCBcIi9jb250cm9sL2JyaWdodG5lc3M/ZGlyPXVwXCIpfSAvPlxuICAgICAgICAgICAgICA8QWN0aW9uUGFuZWwuU2VjdGlvbiB0aXRsZT1cIkF0bW9zcGhlcmljIENvbnRyb2xzXCI+XG4gICAgICAgICAgICAgICAgPEFjdGlvbiBpY29uPXtJY29uLlZpZGVvfSB0aXRsZT1cIlRWIE1vZGUgKERpbSB0byAxMCUpXCIgb25BY3Rpb249eygpID0+IHJ1bkFjdGlvbihcIlRWIExpZ2h0c1wiLCBcIi9jb250cm9sL2J1bGJfdHZcIil9IC8+XG4gICAgICAgICAgICAgICAgPEFjdGlvbiBpY29uPXtJY29uLlBvd2VyfSB0aXRsZT1cIlRvZ2dsZSBQb3dlclwiIHNob3J0Y3V0PXt7IG1vZGlmaWVyczogW1wiY21kXCJdLCBrZXk6IFwibFwiIH19IG9uQWN0aW9uPXsoKSA9PiBydW5BY3Rpb24oXCJMaWdodHNcIiwgbHRTdGF0dXMgPT09ICdPTicgPyBcIi9jb250cm9sL2J1bGJfb2ZmXCIgOiBcIi9jb250cm9sL2J1bGJfb25cIil9IC8+XG4gICAgICAgICAgICAgICAgPEFjdGlvbiBpY29uPXtJY29uLlN0YXJ9IHRpdGxlPVwiQXVyYSBTeW5jIChNZWRpYSlcIiBvbkFjdGlvbj17KCkgPT4gcnVuQWN0aW9uKFwiQXVyYVwiLCBcIi9jb250cm9sL2F1cmEvdG9nZ2xlXCIpfSAvPlxuICAgICAgICAgICAgICAgIDxBY3Rpb24gaWNvbj17SWNvbi5DaXJjbGV9IHRpdGxlPVwiV2FybSBXaGl0ZVwiIG9uQWN0aW9uPXsoKSA9PiBydW5BY3Rpb24oXCJXYXJtXCIsIFwiL2NvbnRyb2wvYnVsYi9jb2xvcj90ZW1wPTI3MDBcIil9IC8+XG4gICAgICAgICAgICAgIDwvQWN0aW9uUGFuZWwuU2VjdGlvbj5cbiAgICAgICAgICAgIDwvQWN0aW9uUGFuZWw+XG4gICAgICAgICAgfVxuICAgICAgICAvPlxuICAgICAgPC9MaXN0LlNlY3Rpb24+XG5cbiAgICAgIDxMaXN0LlNlY3Rpb24gdGl0bGU9XCJTb3ZlcmVpZ250eSBEYXNoYm9hcmRcIj5cbiAgICAgICAgPExpc3QuSXRlbVxuICAgICAgICAgIGljb249e0ljb24uQm9sdH1cbiAgICAgICAgICB0aXRsZT1cIlBHVkNMIEVuZXJneSBQdWxzZVwiXG4gICAgICAgICAgc3VidGl0bGU9e2BBY3R1YWw6IFx1MjBCOSR7c3RhdGU/LnBndmNsPy5iaWxsIHx8ICctLSd9ICgke3N0YXRlPy5wZ3ZjbD8udW5pdHMgfHwgJy0tJ31VKSB8IFRvZGF5OiBcdTIwQjkke3N0YXRlPy5lc3RpbWF0ZWRQZ0JpbGwgfHwgJzAnfSAoJHtzdGF0ZT8udW5pdHMgfHwgJzAnfVUpYH1cbiAgICAgICAgICBhY2Nlc3Nvcmllcz17W3sgdGV4dDogXCJcdTI2QTEgQklMTElORyBBQ1RJVkVcIiB9XX1cbiAgICAgICAgICBhY3Rpb25zPXs8QWN0aW9uUGFuZWw+PEFjdGlvbiBpY29uPXtJY29uLkNsb3VkfSB0aXRsZT1cIlN5bmMgVmF1bHRcIiBvbkFjdGlvbj17KCkgPT4gcnVuQWN0aW9uKFwiVmF1bHQgU3luY1wiLCBcIi9hcmNoaXZlL3N5bmNcIil9IC8+PC9BY3Rpb25QYW5lbD59XG4gICAgICAgIC8+XG4gICAgICAgIDxMaXN0Lkl0ZW1cbiAgICAgICAgICBpY29uPXtJY29uLlRyYXl9XG4gICAgICAgICAgdGl0bGU9XCJBcmNoaXZlIEludGVsbGlnZW5jZVwiXG4gICAgICAgICAgc3VidGl0bGU9e2BWYXVsdCBWZWxvY2l0eTogSElHSCB8ICR7c3RhdGU/LnN0YXRzPy5hcmNoaXZlQ291bnQgfHwgJzQxSysnfSBmcmFnbWVudHNgfVxuICAgICAgICAgIGFjY2Vzc29yaWVzPXtbeyB0ZXh0OiBlcnJvciA/IFwiSFVCIE9GRkxJTkVcIiA6IFwiXHVEODNEXHVERDc1XHVGRTBGIEhPQVJESU5HIEFDVElWRVwiLCBjb2xvcjogZXJyb3IgPyBDb2xvci5SZWQgOiB1bmRlZmluZWQgfV19XG4gICAgICAgICAgYWN0aW9ucz17XG4gICAgICAgICAgICA8QWN0aW9uUGFuZWw+XG4gICAgICAgICAgICAgIDxBY3Rpb24gaWNvbj17SWNvbi5SZXBlYXR9IHRpdGxlPVwiUmVzdGFydCBBbGwgQmFja2VuZCBTZXJ2aWNlc1wiIG9uQWN0aW9uPXsoKSA9PiBydW5BY3Rpb24oXCJIVUIgUkVTRVRcIiwgXCIvY29udHJvbC9yZXN0YXJ0XCIpfSAvPlxuICAgICAgICAgICAgPC9BY3Rpb25QYW5lbD5cbiAgICAgICAgICB9XG4gICAgICAgIC8+XG4gICAgICAgIDxMaXN0Lkl0ZW1cbiAgICAgICAgICBpY29uPXtJY29uLlN1bn1cbiAgICAgICAgICB0aXRsZT1cIlNvbGlzQ2xvdWQgU29sYXIgSW50ZWxcIlxuICAgICAgICAgIHN1YnRpdGxlPXtgJHtzdGF0ZT8uc29saXM/LnRvZGF5IHx8ICctLSd9IGtXaCBUb2RheSB8ICR7c3RhdGU/LnNvbGlzPy5jdXJyZW50IHx8ICctLSd9IGtXIE5vd2B9XG4gICAgICAgICAgYWNjZXNzb3JpZXM9e1t7IHRleHQ6IHN0YXRlPy5zb2xpcz8uc3RhdHVzIHx8IFwiT1BUSU1BTFwiIH1dfVxuICAgICAgICAgIGFjdGlvbnM9e1xuICAgICAgICAgICAgPEFjdGlvblBhbmVsPlxuICAgICAgICAgICAgICA8QWN0aW9uLlB1c2ggaWNvbj17SWNvbi5RdWVzdGlvbk1hcmt9IHRpdGxlPVwiSG93IHRvIFNldHVwIFNvbGlzQ2xvdWRcIiB0YXJnZXQ9ezxTb2xpc1NldHVwR3VpZGUgLz59IC8+XG4gICAgICAgICAgICA8L0FjdGlvblBhbmVsPlxuICAgICAgICAgIH1cbiAgICAgICAgLz5cbiAgICAgICAgPExpc3QuSXRlbVxuICAgICAgICAgIGljb249e0ljb24uQ2xvdWR9XG4gICAgICAgICAgdGl0bGU9XCJBdG1vc3BoZXJpYyBDb250ZXh0XCJcbiAgICAgICAgICBzdWJ0aXRsZT17YCR7c3RhdGU/LndlYXRoZXI/LnRlbXAgfHwgJz8/J31cdTAwQjBDIHwgQVFJOiAke3N0YXRlPy53ZWF0aGVyPy5hcWkgfHwgJz8/J31gfVxuICAgICAgICAgIGFjY2Vzc29yaWVzPXtbeyB0ZXh0OiBgXHVEODNDXHVERjA3ICR7c3RhdGU/LndlYXRoZXI/LnN1bnNldCB8fCAnLS0nfSB8IFx1RDgzQ1x1REYwNSAke3N0YXRlPy53ZWF0aGVyPy5zdW5yaXNlIHx8ICctLSd9YCB9XX1cbiAgICAgICAgLz5cbiAgICAgIDwvTGlzdC5TZWN0aW9uPlxuXG4gICAgICA8TGlzdC5TZWN0aW9uIHRpdGxlPVwiU3lzdGVtIFRlbGVtZXRyeVwiPlxuICAgICAgICA8TGlzdC5JdGVtXG4gICAgICAgICAgaWNvbj17SWNvbi5IZWFydGJlYXR9XG4gICAgICAgICAgdGl0bGU9XCJTb3ZlcmVpZ24gUHVsc2VcIlxuICAgICAgICAgIHN1YnRpdGxlPXtgSHViOiAke2dldFVwdGltZVN0cihzdGF0ZT8udXB0aW1lIHx8IDApfSB8IEFyY2hpdmU6IE9OTElORWB9XG4gICAgICAgICAgYWNjZXNzb3JpZXM9e1t7IHRleHQ6IGVycm9yID8gXCJPRkZMSU5FXCIgOiBcIkhFQUxUSFlcIiwgY29sb3I6IGVycm9yID8gQ29sb3IuUmVkIDogQ29sb3IuR3JlZW4gfV19XG4gICAgICAgICAgYWN0aW9ucz17PEFjdGlvblBhbmVsPjxBY3Rpb24gaWNvbj17SWNvbi5SZXBlYXR9IHRpdGxlPVwiUmUtUHVsc2UgQWxsIFNlcnZpY2VzXCIgb25BY3Rpb249eygpID0+IHJ1bkFjdGlvbihcIlJFQlVJTERcIiwgXCIvY29udHJvbC9yZXN0YXJ0XCIpfSAvPjwvQWN0aW9uUGFuZWw+fVxuICAgICAgICAvPlxuICAgICAgPC9MaXN0LlNlY3Rpb24+XG4gICAgPC9MaXN0PlxuICApO1xufVxuXG5mdW5jdGlvbiBTb2xpc1NldHVwR3VpZGUoKSB7XG4gIGNvbnN0IGd1aWRlID0gYFxuIyBTb2xpc0Nsb3VkIEFQSSBBY3RpdmF0aW9uIEd1aWRlIFx1MjYwMFx1RkUwRlx1RDgzRFx1RENFOFxuXG5Mb29raW5nIGF0IHlvdXIgZGFzaGJvYXJkLCBpdCBzZWVtcyB0aGUgKipBUEkgTWFuYWdlbWVudCoqIG1lbnUgaXMgY3VycmVudGx5IGhpZGRlbi4gVGhpcyBpcyBjb21tb24gZm9yIHBlcnNvbmFsIGFjY291bnRzIGFuZCByZXF1aXJlcyBhIG9uZS10aW1lIGFjdGl2YXRpb24gZnJvbSB0aGVpciBzaWRlLlxuXG4jIyMgXHVEODNEXHVERUQxICoqU3RlcCAxOiBBcHBseSBmb3IgQWNjZXNzKiogKE1hbmRhdG9yeSlcbkFjY29yZGluZyB0byBTb2xpcyBkb2N1bWVudGF0aW9uLCB5b3UgbXVzdCBmaXJzdCBjb250YWN0IHRoZWlyIHRlY2huaWNhbCBzdXBwb3J0IHRvIFwiVmVyaWZ5IGFuZCBBY3RpdmF0ZVwiIEFQSSBhY2Nlc3MgZm9yIHlvdXIgYWNjb3VudDpcbi0gKipFbWFpbCoqOiBcXGB1c3N1cHBvcnRAc29saXNpbnYuY29tXFxgIChvciB5b3VyIHJlZ2lvbmFsIFNvbGlzIHN1cHBvcnQpLlxuLSAqKlN1YmplY3QqKjogUmVxdWVzdCBmb3IgQVBJIEFjY2VzcyBBY3RpdmF0aW9uIC0gUHJhZHVtYW4gS2hhY2hhclxuLSAqKkNvbnRlbnQqKjogXCJQbGVhc2UgYWN0aXZhdGUgdGhlIEFQSSBNYW5hZ2VtZW50IHBvcnRhbCBmb3IgbXkgYWNjb3VudCAoXFxgcGtoYWNoYXJAZ21haWwuY29tXFxgKSB0byBhbGxvdyBpbnRlZ3JhdGlvbiB3aXRoIG15IHBlcnNvbmFsIGRhc2hib2FyZC5cIlxuXG4jIyMgXHVEODNEXHVERDI3ICoqU3RlcCAyOiBBY3RpdmF0aW9uIChPbmNlIFVubG9ja2VkKSoqXG5PbmNlIHRoZXkgcmVwbHksIHlvdSB3aWxsIHNlZSBhIG5ldyAqKkFQSSBNYW5hZ2VtZW50Kiogb3B0aW9uIHVuZGVyIHRoZSAqKlNlcnZpY2UqKiB0YWI6XG4xLiAgR28gdG8gKipTZXJ2aWNlKiogLT4gKipBUEkgTWFuYWdlbWVudCoqLlxuMi4gIENsaWNrICoqQWN0aXZhdGUgTm93KiouXG4zLiAgQ29tcGxldGUgdGhlIEVtYWlsIFZlcmlmaWNhdGlvbiAoUHV6emxlICsgQ29kZSkuXG40LiAgQ29weSB5b3VyICoqS2V5SWQqKiBhbmQgKipTZWNyZXRLZXkqKi5cblxuIyMjIFx1RDgzRVx1RERFQyAqKlBsYW50IERldGFpbHMqKlxuLSAqKlBsYW50IElEKio6IFxcYDEyOTg0OTE5MTk0NTAwMDAzMjhcXGBcbi0gKipDdXJyZW50IEZsb3cqKjogQ3VycmVudGx5IHN5bmNpbmcgdmlhICoqU2Vzc2lvbiBQdWxzZSoqICgxOC43IGtXaCkgdW50aWwgeW91ciBwZXJzaXN0ZW50IGtleXMgYXJlIGxpdmUuXG5cblJlc3RhcnQgdGhlIEh1YiBvbmNlIHlvdSBoYXZlIHRoZSBrZXlzIVxuICBgO1xuICByZXR1cm4gPERldGFpbCBtYXJrZG93bj17Z3VpZGV9IC8+O1xufVxuIiwgIi8qKlxuICogSW5kZXguanNcbiAqXG4gKiBhIHJlcXVlc3QgQVBJIGNvbXBhdGlibGUgd2l0aCB3aW5kb3cuZmV0Y2hcbiAqXG4gKiBBbGwgc3BlYyBhbGdvcml0aG0gc3RlcCBudW1iZXJzIGFyZSBiYXNlZCBvbiBodHRwczovL2ZldGNoLnNwZWMud2hhdHdnLm9yZy9jb21taXQtc25hcHNob3RzL2FlNzE2ODIyY2IzYTYxODQzMjI2Y2QwOTBlZWZjNjU4OTQ0NmMxZDIvLlxuICovXG5cbmltcG9ydCBodHRwIGZyb20gJ25vZGU6aHR0cCc7XG5pbXBvcnQgaHR0cHMgZnJvbSAnbm9kZTpodHRwcyc7XG5pbXBvcnQgemxpYiBmcm9tICdub2RlOnpsaWInO1xuaW1wb3J0IFN0cmVhbSwge1Bhc3NUaHJvdWdoLCBwaXBlbGluZSBhcyBwdW1wfSBmcm9tICdub2RlOnN0cmVhbSc7XG5pbXBvcnQge0J1ZmZlcn0gZnJvbSAnbm9kZTpidWZmZXInO1xuXG5pbXBvcnQgZGF0YVVyaVRvQnVmZmVyIGZyb20gJ2RhdGEtdXJpLXRvLWJ1ZmZlcic7XG5cbmltcG9ydCB7d3JpdGVUb1N0cmVhbSwgY2xvbmV9IGZyb20gJy4vYm9keS5qcyc7XG5pbXBvcnQgUmVzcG9uc2UgZnJvbSAnLi9yZXNwb25zZS5qcyc7XG5pbXBvcnQgSGVhZGVycywge2Zyb21SYXdIZWFkZXJzfSBmcm9tICcuL2hlYWRlcnMuanMnO1xuaW1wb3J0IFJlcXVlc3QsIHtnZXROb2RlUmVxdWVzdE9wdGlvbnN9IGZyb20gJy4vcmVxdWVzdC5qcyc7XG5pbXBvcnQge0ZldGNoRXJyb3J9IGZyb20gJy4vZXJyb3JzL2ZldGNoLWVycm9yLmpzJztcbmltcG9ydCB7QWJvcnRFcnJvcn0gZnJvbSAnLi9lcnJvcnMvYWJvcnQtZXJyb3IuanMnO1xuaW1wb3J0IHtpc1JlZGlyZWN0fSBmcm9tICcuL3V0aWxzL2lzLXJlZGlyZWN0LmpzJztcbmltcG9ydCB7Rm9ybURhdGF9IGZyb20gJ2Zvcm1kYXRhLXBvbHlmaWxsL2VzbS5taW4uanMnO1xuaW1wb3J0IHtpc0RvbWFpbk9yU3ViZG9tYWluLCBpc1NhbWVQcm90b2NvbH0gZnJvbSAnLi91dGlscy9pcy5qcyc7XG5pbXBvcnQge3BhcnNlUmVmZXJyZXJQb2xpY3lGcm9tSGVhZGVyfSBmcm9tICcuL3V0aWxzL3JlZmVycmVyLmpzJztcbmltcG9ydCB7XG5cdEJsb2IsXG5cdEZpbGUsXG5cdGZpbGVGcm9tU3luYyxcblx0ZmlsZUZyb20sXG5cdGJsb2JGcm9tU3luYyxcblx0YmxvYkZyb21cbn0gZnJvbSAnZmV0Y2gtYmxvYi9mcm9tLmpzJztcblxuZXhwb3J0IHtGb3JtRGF0YSwgSGVhZGVycywgUmVxdWVzdCwgUmVzcG9uc2UsIEZldGNoRXJyb3IsIEFib3J0RXJyb3IsIGlzUmVkaXJlY3R9O1xuZXhwb3J0IHtCbG9iLCBGaWxlLCBmaWxlRnJvbVN5bmMsIGZpbGVGcm9tLCBibG9iRnJvbVN5bmMsIGJsb2JGcm9tfTtcblxuY29uc3Qgc3VwcG9ydGVkU2NoZW1hcyA9IG5ldyBTZXQoWydkYXRhOicsICdodHRwOicsICdodHRwczonXSk7XG5cbi8qKlxuICogRmV0Y2ggZnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0gICB7c3RyaW5nIHwgVVJMIHwgaW1wb3J0KCcuL3JlcXVlc3QnKS5kZWZhdWx0fSB1cmwgLSBBYnNvbHV0ZSB1cmwgb3IgUmVxdWVzdCBpbnN0YW5jZVxuICogQHBhcmFtICAgeyp9IFtvcHRpb25zX10gLSBGZXRjaCBvcHRpb25zXG4gKiBAcmV0dXJuICB7UHJvbWlzZTxpbXBvcnQoJy4vcmVzcG9uc2UnKS5kZWZhdWx0Pn1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gZmV0Y2godXJsLCBvcHRpb25zXykge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdC8vIEJ1aWxkIHJlcXVlc3Qgb2JqZWN0XG5cdFx0Y29uc3QgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KHVybCwgb3B0aW9uc18pO1xuXHRcdGNvbnN0IHtwYXJzZWRVUkwsIG9wdGlvbnN9ID0gZ2V0Tm9kZVJlcXVlc3RPcHRpb25zKHJlcXVlc3QpO1xuXHRcdGlmICghc3VwcG9ydGVkU2NoZW1hcy5oYXMocGFyc2VkVVJMLnByb3RvY29sKSkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihgbm9kZS1mZXRjaCBjYW5ub3QgbG9hZCAke3VybH0uIFVSTCBzY2hlbWUgXCIke3BhcnNlZFVSTC5wcm90b2NvbC5yZXBsYWNlKC86JC8sICcnKX1cIiBpcyBub3Qgc3VwcG9ydGVkLmApO1xuXHRcdH1cblxuXHRcdGlmIChwYXJzZWRVUkwucHJvdG9jb2wgPT09ICdkYXRhOicpIHtcblx0XHRcdGNvbnN0IGRhdGEgPSBkYXRhVXJpVG9CdWZmZXIocmVxdWVzdC51cmwpO1xuXHRcdFx0Y29uc3QgcmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UoZGF0YSwge2hlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogZGF0YS50eXBlRnVsbH19KTtcblx0XHRcdHJlc29sdmUocmVzcG9uc2UpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIFdyYXAgaHR0cC5yZXF1ZXN0IGludG8gZmV0Y2hcblx0XHRjb25zdCBzZW5kID0gKHBhcnNlZFVSTC5wcm90b2NvbCA9PT0gJ2h0dHBzOicgPyBodHRwcyA6IGh0dHApLnJlcXVlc3Q7XG5cdFx0Y29uc3Qge3NpZ25hbH0gPSByZXF1ZXN0O1xuXHRcdGxldCByZXNwb25zZSA9IG51bGw7XG5cblx0XHRjb25zdCBhYm9ydCA9ICgpID0+IHtcblx0XHRcdGNvbnN0IGVycm9yID0gbmV3IEFib3J0RXJyb3IoJ1RoZSBvcGVyYXRpb24gd2FzIGFib3J0ZWQuJyk7XG5cdFx0XHRyZWplY3QoZXJyb3IpO1xuXHRcdFx0aWYgKHJlcXVlc3QuYm9keSAmJiByZXF1ZXN0LmJvZHkgaW5zdGFuY2VvZiBTdHJlYW0uUmVhZGFibGUpIHtcblx0XHRcdFx0cmVxdWVzdC5ib2R5LmRlc3Ryb3koZXJyb3IpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIXJlc3BvbnNlIHx8ICFyZXNwb25zZS5ib2R5KSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0cmVzcG9uc2UuYm9keS5lbWl0KCdlcnJvcicsIGVycm9yKTtcblx0XHR9O1xuXG5cdFx0aWYgKHNpZ25hbCAmJiBzaWduYWwuYWJvcnRlZCkge1xuXHRcdFx0YWJvcnQoKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBhYm9ydEFuZEZpbmFsaXplID0gKCkgPT4ge1xuXHRcdFx0YWJvcnQoKTtcblx0XHRcdGZpbmFsaXplKCk7XG5cdFx0fTtcblxuXHRcdC8vIFNlbmQgcmVxdWVzdFxuXHRcdGNvbnN0IHJlcXVlc3RfID0gc2VuZChwYXJzZWRVUkwudG9TdHJpbmcoKSwgb3B0aW9ucyk7XG5cblx0XHRpZiAoc2lnbmFsKSB7XG5cdFx0XHRzaWduYWwuYWRkRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBhYm9ydEFuZEZpbmFsaXplKTtcblx0XHR9XG5cblx0XHRjb25zdCBmaW5hbGl6ZSA9ICgpID0+IHtcblx0XHRcdHJlcXVlc3RfLmFib3J0KCk7XG5cdFx0XHRpZiAoc2lnbmFsKSB7XG5cdFx0XHRcdHNpZ25hbC5yZW1vdmVFdmVudExpc3RlbmVyKCdhYm9ydCcsIGFib3J0QW5kRmluYWxpemUpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRyZXF1ZXN0Xy5vbignZXJyb3InLCBlcnJvciA9PiB7XG5cdFx0XHRyZWplY3QobmV3IEZldGNoRXJyb3IoYHJlcXVlc3QgdG8gJHtyZXF1ZXN0LnVybH0gZmFpbGVkLCByZWFzb246ICR7ZXJyb3IubWVzc2FnZX1gLCAnc3lzdGVtJywgZXJyb3IpKTtcblx0XHRcdGZpbmFsaXplKCk7XG5cdFx0fSk7XG5cblx0XHRmaXhSZXNwb25zZUNodW5rZWRUcmFuc2ZlckJhZEVuZGluZyhyZXF1ZXN0XywgZXJyb3IgPT4ge1xuXHRcdFx0aWYgKHJlc3BvbnNlICYmIHJlc3BvbnNlLmJvZHkpIHtcblx0XHRcdFx0cmVzcG9uc2UuYm9keS5kZXN0cm95KGVycm9yKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdC8qIGM4IGlnbm9yZSBuZXh0IDE4ICovXG5cdFx0aWYgKHByb2Nlc3MudmVyc2lvbiA8ICd2MTQnKSB7XG5cdFx0XHQvLyBCZWZvcmUgTm9kZS5qcyAxNCwgcGlwZWxpbmUoKSBkb2VzIG5vdCBmdWxseSBzdXBwb3J0IGFzeW5jIGl0ZXJhdG9ycyBhbmQgZG9lcyBub3QgYWx3YXlzXG5cdFx0XHQvLyBwcm9wZXJseSBoYW5kbGUgd2hlbiB0aGUgc29ja2V0IGNsb3NlL2VuZCBldmVudHMgYXJlIG91dCBvZiBvcmRlci5cblx0XHRcdHJlcXVlc3RfLm9uKCdzb2NrZXQnLCBzID0+IHtcblx0XHRcdFx0bGV0IGVuZGVkV2l0aEV2ZW50c0NvdW50O1xuXHRcdFx0XHRzLnByZXBlbmRMaXN0ZW5lcignZW5kJywgKCkgPT4ge1xuXHRcdFx0XHRcdGVuZGVkV2l0aEV2ZW50c0NvdW50ID0gcy5fZXZlbnRzQ291bnQ7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRzLnByZXBlbmRMaXN0ZW5lcignY2xvc2UnLCBoYWRFcnJvciA9PiB7XG5cdFx0XHRcdFx0Ly8gaWYgZW5kIGhhcHBlbmVkIGJlZm9yZSBjbG9zZSBidXQgdGhlIHNvY2tldCBkaWRuJ3QgZW1pdCBhbiBlcnJvciwgZG8gaXQgbm93XG5cdFx0XHRcdFx0aWYgKHJlc3BvbnNlICYmIGVuZGVkV2l0aEV2ZW50c0NvdW50IDwgcy5fZXZlbnRzQ291bnQgJiYgIWhhZEVycm9yKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBlcnJvciA9IG5ldyBFcnJvcignUHJlbWF0dXJlIGNsb3NlJyk7XG5cdFx0XHRcdFx0XHRlcnJvci5jb2RlID0gJ0VSUl9TVFJFQU1fUFJFTUFUVVJFX0NMT1NFJztcblx0XHRcdFx0XHRcdHJlc3BvbnNlLmJvZHkuZW1pdCgnZXJyb3InLCBlcnJvcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHJlcXVlc3RfLm9uKCdyZXNwb25zZScsIHJlc3BvbnNlXyA9PiB7XG5cdFx0XHRyZXF1ZXN0Xy5zZXRUaW1lb3V0KDApO1xuXHRcdFx0Y29uc3QgaGVhZGVycyA9IGZyb21SYXdIZWFkZXJzKHJlc3BvbnNlXy5yYXdIZWFkZXJzKTtcblxuXHRcdFx0Ly8gSFRUUCBmZXRjaCBzdGVwIDVcblx0XHRcdGlmIChpc1JlZGlyZWN0KHJlc3BvbnNlXy5zdGF0dXNDb2RlKSkge1xuXHRcdFx0XHQvLyBIVFRQIGZldGNoIHN0ZXAgNS4yXG5cdFx0XHRcdGNvbnN0IGxvY2F0aW9uID0gaGVhZGVycy5nZXQoJ0xvY2F0aW9uJyk7XG5cblx0XHRcdFx0Ly8gSFRUUCBmZXRjaCBzdGVwIDUuM1xuXHRcdFx0XHRsZXQgbG9jYXRpb25VUkwgPSBudWxsO1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGxvY2F0aW9uVVJMID0gbG9jYXRpb24gPT09IG51bGwgPyBudWxsIDogbmV3IFVSTChsb2NhdGlvbiwgcmVxdWVzdC51cmwpO1xuXHRcdFx0XHR9IGNhdGNoIHtcblx0XHRcdFx0XHQvLyBlcnJvciBoZXJlIGNhbiBvbmx5IGJlIGludmFsaWQgVVJMIGluIExvY2F0aW9uOiBoZWFkZXJcblx0XHRcdFx0XHQvLyBkbyBub3QgdGhyb3cgd2hlbiBvcHRpb25zLnJlZGlyZWN0ID09IG1hbnVhbFxuXHRcdFx0XHRcdC8vIGxldCB0aGUgdXNlciBleHRyYWN0IHRoZSBlcnJvcm5lb3VzIHJlZGlyZWN0IFVSTFxuXHRcdFx0XHRcdGlmIChyZXF1ZXN0LnJlZGlyZWN0ICE9PSAnbWFudWFsJykge1xuXHRcdFx0XHRcdFx0cmVqZWN0KG5ldyBGZXRjaEVycm9yKGB1cmkgcmVxdWVzdGVkIHJlc3BvbmRzIHdpdGggYW4gaW52YWxpZCByZWRpcmVjdCBVUkw6ICR7bG9jYXRpb259YCwgJ2ludmFsaWQtcmVkaXJlY3QnKSk7XG5cdFx0XHRcdFx0XHRmaW5hbGl6ZSgpO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEhUVFAgZmV0Y2ggc3RlcCA1LjVcblx0XHRcdFx0c3dpdGNoIChyZXF1ZXN0LnJlZGlyZWN0KSB7XG5cdFx0XHRcdFx0Y2FzZSAnZXJyb3InOlxuXHRcdFx0XHRcdFx0cmVqZWN0KG5ldyBGZXRjaEVycm9yKGB1cmkgcmVxdWVzdGVkIHJlc3BvbmRzIHdpdGggYSByZWRpcmVjdCwgcmVkaXJlY3QgbW9kZSBpcyBzZXQgdG8gZXJyb3I6ICR7cmVxdWVzdC51cmx9YCwgJ25vLXJlZGlyZWN0JykpO1xuXHRcdFx0XHRcdFx0ZmluYWxpemUoKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRjYXNlICdtYW51YWwnOlxuXHRcdFx0XHRcdFx0Ly8gTm90aGluZyB0byBkb1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAnZm9sbG93Jzoge1xuXHRcdFx0XHRcdFx0Ly8gSFRUUC1yZWRpcmVjdCBmZXRjaCBzdGVwIDJcblx0XHRcdFx0XHRcdGlmIChsb2NhdGlvblVSTCA9PT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Ly8gSFRUUC1yZWRpcmVjdCBmZXRjaCBzdGVwIDVcblx0XHRcdFx0XHRcdGlmIChyZXF1ZXN0LmNvdW50ZXIgPj0gcmVxdWVzdC5mb2xsb3cpIHtcblx0XHRcdFx0XHRcdFx0cmVqZWN0KG5ldyBGZXRjaEVycm9yKGBtYXhpbXVtIHJlZGlyZWN0IHJlYWNoZWQgYXQ6ICR7cmVxdWVzdC51cmx9YCwgJ21heC1yZWRpcmVjdCcpKTtcblx0XHRcdFx0XHRcdFx0ZmluYWxpemUoKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBIVFRQLXJlZGlyZWN0IGZldGNoIHN0ZXAgNiAoY291bnRlciBpbmNyZW1lbnQpXG5cdFx0XHRcdFx0XHQvLyBDcmVhdGUgYSBuZXcgUmVxdWVzdCBvYmplY3QuXG5cdFx0XHRcdFx0XHRjb25zdCByZXF1ZXN0T3B0aW9ucyA9IHtcblx0XHRcdFx0XHRcdFx0aGVhZGVyczogbmV3IEhlYWRlcnMocmVxdWVzdC5oZWFkZXJzKSxcblx0XHRcdFx0XHRcdFx0Zm9sbG93OiByZXF1ZXN0LmZvbGxvdyxcblx0XHRcdFx0XHRcdFx0Y291bnRlcjogcmVxdWVzdC5jb3VudGVyICsgMSxcblx0XHRcdFx0XHRcdFx0YWdlbnQ6IHJlcXVlc3QuYWdlbnQsXG5cdFx0XHRcdFx0XHRcdGNvbXByZXNzOiByZXF1ZXN0LmNvbXByZXNzLFxuXHRcdFx0XHRcdFx0XHRtZXRob2Q6IHJlcXVlc3QubWV0aG9kLFxuXHRcdFx0XHRcdFx0XHRib2R5OiBjbG9uZShyZXF1ZXN0KSxcblx0XHRcdFx0XHRcdFx0c2lnbmFsOiByZXF1ZXN0LnNpZ25hbCxcblx0XHRcdFx0XHRcdFx0c2l6ZTogcmVxdWVzdC5zaXplLFxuXHRcdFx0XHRcdFx0XHRyZWZlcnJlcjogcmVxdWVzdC5yZWZlcnJlcixcblx0XHRcdFx0XHRcdFx0cmVmZXJyZXJQb2xpY3k6IHJlcXVlc3QucmVmZXJyZXJQb2xpY3lcblx0XHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRcdC8vIHdoZW4gZm9yd2FyZGluZyBzZW5zaXRpdmUgaGVhZGVycyBsaWtlIFwiQXV0aG9yaXphdGlvblwiLFxuXHRcdFx0XHRcdFx0Ly8gXCJXV1ctQXV0aGVudGljYXRlXCIsIGFuZCBcIkNvb2tpZVwiIHRvIHVudHJ1c3RlZCB0YXJnZXRzLFxuXHRcdFx0XHRcdFx0Ly8gaGVhZGVycyB3aWxsIGJlIGlnbm9yZWQgd2hlbiBmb2xsb3dpbmcgYSByZWRpcmVjdCB0byBhIGRvbWFpblxuXHRcdFx0XHRcdFx0Ly8gdGhhdCBpcyBub3QgYSBzdWJkb21haW4gbWF0Y2ggb3IgZXhhY3QgbWF0Y2ggb2YgdGhlIGluaXRpYWwgZG9tYWluLlxuXHRcdFx0XHRcdFx0Ly8gRm9yIGV4YW1wbGUsIGEgcmVkaXJlY3QgZnJvbSBcImZvby5jb21cIiB0byBlaXRoZXIgXCJmb28uY29tXCIgb3IgXCJzdWIuZm9vLmNvbVwiXG5cdFx0XHRcdFx0XHQvLyB3aWxsIGZvcndhcmQgdGhlIHNlbnNpdGl2ZSBoZWFkZXJzLCBidXQgYSByZWRpcmVjdCB0byBcImJhci5jb21cIiB3aWxsIG5vdC5cblx0XHRcdFx0XHRcdC8vIGhlYWRlcnMgd2lsbCBhbHNvIGJlIGlnbm9yZWQgd2hlbiBmb2xsb3dpbmcgYSByZWRpcmVjdCB0byBhIGRvbWFpbiB1c2luZ1xuXHRcdFx0XHRcdFx0Ly8gYSBkaWZmZXJlbnQgcHJvdG9jb2wuIEZvciBleGFtcGxlLCBhIHJlZGlyZWN0IGZyb20gXCJodHRwczovL2Zvby5jb21cIiB0byBcImh0dHA6Ly9mb28uY29tXCJcblx0XHRcdFx0XHRcdC8vIHdpbGwgbm90IGZvcndhcmQgdGhlIHNlbnNpdGl2ZSBoZWFkZXJzXG5cdFx0XHRcdFx0XHRpZiAoIWlzRG9tYWluT3JTdWJkb21haW4ocmVxdWVzdC51cmwsIGxvY2F0aW9uVVJMKSB8fCAhaXNTYW1lUHJvdG9jb2wocmVxdWVzdC51cmwsIGxvY2F0aW9uVVJMKSkge1xuXHRcdFx0XHRcdFx0XHRmb3IgKGNvbnN0IG5hbWUgb2YgWydhdXRob3JpemF0aW9uJywgJ3d3dy1hdXRoZW50aWNhdGUnLCAnY29va2llJywgJ2Nvb2tpZTInXSkge1xuXHRcdFx0XHRcdFx0XHRcdHJlcXVlc3RPcHRpb25zLmhlYWRlcnMuZGVsZXRlKG5hbWUpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIEhUVFAtcmVkaXJlY3QgZmV0Y2ggc3RlcCA5XG5cdFx0XHRcdFx0XHRpZiAocmVzcG9uc2VfLnN0YXR1c0NvZGUgIT09IDMwMyAmJiByZXF1ZXN0LmJvZHkgJiYgb3B0aW9uc18uYm9keSBpbnN0YW5jZW9mIFN0cmVhbS5SZWFkYWJsZSkge1xuXHRcdFx0XHRcdFx0XHRyZWplY3QobmV3IEZldGNoRXJyb3IoJ0Nhbm5vdCBmb2xsb3cgcmVkaXJlY3Qgd2l0aCBib2R5IGJlaW5nIGEgcmVhZGFibGUgc3RyZWFtJywgJ3Vuc3VwcG9ydGVkLXJlZGlyZWN0JykpO1xuXHRcdFx0XHRcdFx0XHRmaW5hbGl6ZSgpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIEhUVFAtcmVkaXJlY3QgZmV0Y2ggc3RlcCAxMVxuXHRcdFx0XHRcdFx0aWYgKHJlc3BvbnNlXy5zdGF0dXNDb2RlID09PSAzMDMgfHwgKChyZXNwb25zZV8uc3RhdHVzQ29kZSA9PT0gMzAxIHx8IHJlc3BvbnNlXy5zdGF0dXNDb2RlID09PSAzMDIpICYmIHJlcXVlc3QubWV0aG9kID09PSAnUE9TVCcpKSB7XG5cdFx0XHRcdFx0XHRcdHJlcXVlc3RPcHRpb25zLm1ldGhvZCA9ICdHRVQnO1xuXHRcdFx0XHRcdFx0XHRyZXF1ZXN0T3B0aW9ucy5ib2R5ID0gdW5kZWZpbmVkO1xuXHRcdFx0XHRcdFx0XHRyZXF1ZXN0T3B0aW9ucy5oZWFkZXJzLmRlbGV0ZSgnY29udGVudC1sZW5ndGgnKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Ly8gSFRUUC1yZWRpcmVjdCBmZXRjaCBzdGVwIDE0XG5cdFx0XHRcdFx0XHRjb25zdCByZXNwb25zZVJlZmVycmVyUG9saWN5ID0gcGFyc2VSZWZlcnJlclBvbGljeUZyb21IZWFkZXIoaGVhZGVycyk7XG5cdFx0XHRcdFx0XHRpZiAocmVzcG9uc2VSZWZlcnJlclBvbGljeSkge1xuXHRcdFx0XHRcdFx0XHRyZXF1ZXN0T3B0aW9ucy5yZWZlcnJlclBvbGljeSA9IHJlc3BvbnNlUmVmZXJyZXJQb2xpY3k7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIEhUVFAtcmVkaXJlY3QgZmV0Y2ggc3RlcCAxNVxuXHRcdFx0XHRcdFx0cmVzb2x2ZShmZXRjaChuZXcgUmVxdWVzdChsb2NhdGlvblVSTCwgcmVxdWVzdE9wdGlvbnMpKSk7XG5cdFx0XHRcdFx0XHRmaW5hbGl6ZSgpO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRyZXR1cm4gcmVqZWN0KG5ldyBUeXBlRXJyb3IoYFJlZGlyZWN0IG9wdGlvbiAnJHtyZXF1ZXN0LnJlZGlyZWN0fScgaXMgbm90IGEgdmFsaWQgdmFsdWUgb2YgUmVxdWVzdFJlZGlyZWN0YCkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIFByZXBhcmUgcmVzcG9uc2Vcblx0XHRcdGlmIChzaWduYWwpIHtcblx0XHRcdFx0cmVzcG9uc2VfLm9uY2UoJ2VuZCcsICgpID0+IHtcblx0XHRcdFx0XHRzaWduYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBhYm9ydEFuZEZpbmFsaXplKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdGxldCBib2R5ID0gcHVtcChyZXNwb25zZV8sIG5ldyBQYXNzVGhyb3VnaCgpLCBlcnJvciA9PiB7XG5cdFx0XHRcdGlmIChlcnJvcikge1xuXHRcdFx0XHRcdHJlamVjdChlcnJvcik7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0Ly8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9ub2RlanMvbm9kZS9wdWxsLzI5Mzc2XG5cdFx0XHQvKiBjOCBpZ25vcmUgbmV4dCAzICovXG5cdFx0XHRpZiAocHJvY2Vzcy52ZXJzaW9uIDwgJ3YxMi4xMCcpIHtcblx0XHRcdFx0cmVzcG9uc2VfLm9uKCdhYm9ydGVkJywgYWJvcnRBbmRGaW5hbGl6ZSk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHJlc3BvbnNlT3B0aW9ucyA9IHtcblx0XHRcdFx0dXJsOiByZXF1ZXN0LnVybCxcblx0XHRcdFx0c3RhdHVzOiByZXNwb25zZV8uc3RhdHVzQ29kZSxcblx0XHRcdFx0c3RhdHVzVGV4dDogcmVzcG9uc2VfLnN0YXR1c01lc3NhZ2UsXG5cdFx0XHRcdGhlYWRlcnMsXG5cdFx0XHRcdHNpemU6IHJlcXVlc3Quc2l6ZSxcblx0XHRcdFx0Y291bnRlcjogcmVxdWVzdC5jb3VudGVyLFxuXHRcdFx0XHRoaWdoV2F0ZXJNYXJrOiByZXF1ZXN0LmhpZ2hXYXRlck1hcmtcblx0XHRcdH07XG5cblx0XHRcdC8vIEhUVFAtbmV0d29yayBmZXRjaCBzdGVwIDEyLjEuMS4zXG5cdFx0XHRjb25zdCBjb2RpbmdzID0gaGVhZGVycy5nZXQoJ0NvbnRlbnQtRW5jb2RpbmcnKTtcblxuXHRcdFx0Ly8gSFRUUC1uZXR3b3JrIGZldGNoIHN0ZXAgMTIuMS4xLjQ6IGhhbmRsZSBjb250ZW50IGNvZGluZ3NcblxuXHRcdFx0Ly8gaW4gZm9sbG93aW5nIHNjZW5hcmlvcyB3ZSBpZ25vcmUgY29tcHJlc3Npb24gc3VwcG9ydFxuXHRcdFx0Ly8gMS4gY29tcHJlc3Npb24gc3VwcG9ydCBpcyBkaXNhYmxlZFxuXHRcdFx0Ly8gMi4gSEVBRCByZXF1ZXN0XG5cdFx0XHQvLyAzLiBubyBDb250ZW50LUVuY29kaW5nIGhlYWRlclxuXHRcdFx0Ly8gNC4gbm8gY29udGVudCByZXNwb25zZSAoMjA0KVxuXHRcdFx0Ly8gNS4gY29udGVudCBub3QgbW9kaWZpZWQgcmVzcG9uc2UgKDMwNClcblx0XHRcdGlmICghcmVxdWVzdC5jb21wcmVzcyB8fCByZXF1ZXN0Lm1ldGhvZCA9PT0gJ0hFQUQnIHx8IGNvZGluZ3MgPT09IG51bGwgfHwgcmVzcG9uc2VfLnN0YXR1c0NvZGUgPT09IDIwNCB8fCByZXNwb25zZV8uc3RhdHVzQ29kZSA9PT0gMzA0KSB7XG5cdFx0XHRcdHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKGJvZHksIHJlc3BvbnNlT3B0aW9ucyk7XG5cdFx0XHRcdHJlc29sdmUocmVzcG9uc2UpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIEZvciBOb2RlIHY2K1xuXHRcdFx0Ly8gQmUgbGVzcyBzdHJpY3Qgd2hlbiBkZWNvZGluZyBjb21wcmVzc2VkIHJlc3BvbnNlcywgc2luY2Ugc29tZXRpbWVzXG5cdFx0XHQvLyBzZXJ2ZXJzIHNlbmQgc2xpZ2h0bHkgaW52YWxpZCByZXNwb25zZXMgdGhhdCBhcmUgc3RpbGwgYWNjZXB0ZWRcblx0XHRcdC8vIGJ5IGNvbW1vbiBicm93c2Vycy5cblx0XHRcdC8vIEFsd2F5cyB1c2luZyBaX1NZTkNfRkxVU0ggaXMgd2hhdCBjVVJMIGRvZXMuXG5cdFx0XHRjb25zdCB6bGliT3B0aW9ucyA9IHtcblx0XHRcdFx0Zmx1c2g6IHpsaWIuWl9TWU5DX0ZMVVNILFxuXHRcdFx0XHRmaW5pc2hGbHVzaDogemxpYi5aX1NZTkNfRkxVU0hcblx0XHRcdH07XG5cblx0XHRcdC8vIEZvciBnemlwXG5cdFx0XHRpZiAoY29kaW5ncyA9PT0gJ2d6aXAnIHx8IGNvZGluZ3MgPT09ICd4LWd6aXAnKSB7XG5cdFx0XHRcdGJvZHkgPSBwdW1wKGJvZHksIHpsaWIuY3JlYXRlR3VuemlwKHpsaWJPcHRpb25zKSwgZXJyb3IgPT4ge1xuXHRcdFx0XHRcdGlmIChlcnJvcikge1xuXHRcdFx0XHRcdFx0cmVqZWN0KGVycm9yKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRyZXNwb25zZSA9IG5ldyBSZXNwb25zZShib2R5LCByZXNwb25zZU9wdGlvbnMpO1xuXHRcdFx0XHRyZXNvbHZlKHJlc3BvbnNlKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBGb3IgZGVmbGF0ZVxuXHRcdFx0aWYgKGNvZGluZ3MgPT09ICdkZWZsYXRlJyB8fCBjb2RpbmdzID09PSAneC1kZWZsYXRlJykge1xuXHRcdFx0XHQvLyBIYW5kbGUgdGhlIGluZmFtb3VzIHJhdyBkZWZsYXRlIHJlc3BvbnNlIGZyb20gb2xkIHNlcnZlcnNcblx0XHRcdFx0Ly8gYSBoYWNrIGZvciBvbGQgSUlTIGFuZCBBcGFjaGUgc2VydmVyc1xuXHRcdFx0XHRjb25zdCByYXcgPSBwdW1wKHJlc3BvbnNlXywgbmV3IFBhc3NUaHJvdWdoKCksIGVycm9yID0+IHtcblx0XHRcdFx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdFx0XHRcdHJlamVjdChlcnJvcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0cmF3Lm9uY2UoJ2RhdGEnLCBjaHVuayA9PiB7XG5cdFx0XHRcdFx0Ly8gU2VlIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzc1MTk4Mjhcblx0XHRcdFx0XHRpZiAoKGNodW5rWzBdICYgMHgwRikgPT09IDB4MDgpIHtcblx0XHRcdFx0XHRcdGJvZHkgPSBwdW1wKGJvZHksIHpsaWIuY3JlYXRlSW5mbGF0ZSgpLCBlcnJvciA9PiB7XG5cdFx0XHRcdFx0XHRcdGlmIChlcnJvcikge1xuXHRcdFx0XHRcdFx0XHRcdHJlamVjdChlcnJvcik7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRib2R5ID0gcHVtcChib2R5LCB6bGliLmNyZWF0ZUluZmxhdGVSYXcoKSwgZXJyb3IgPT4ge1xuXHRcdFx0XHRcdFx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdFx0XHRcdFx0XHRyZWplY3QoZXJyb3IpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXNwb25zZSA9IG5ldyBSZXNwb25zZShib2R5LCByZXNwb25zZU9wdGlvbnMpO1xuXHRcdFx0XHRcdHJlc29sdmUocmVzcG9uc2UpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0cmF3Lm9uY2UoJ2VuZCcsICgpID0+IHtcblx0XHRcdFx0XHQvLyBTb21lIG9sZCBJSVMgc2VydmVycyByZXR1cm4gemVyby1sZW5ndGggT0sgZGVmbGF0ZSByZXNwb25zZXMsIHNvXG5cdFx0XHRcdFx0Ly8gJ2RhdGEnIGlzIG5ldmVyIGVtaXR0ZWQuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vbm9kZS1mZXRjaC9ub2RlLWZldGNoL3B1bGwvOTAzXG5cdFx0XHRcdFx0aWYgKCFyZXNwb25zZSkge1xuXHRcdFx0XHRcdFx0cmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UoYm9keSwgcmVzcG9uc2VPcHRpb25zKTtcblx0XHRcdFx0XHRcdHJlc29sdmUocmVzcG9uc2UpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gRm9yIGJyXG5cdFx0XHRpZiAoY29kaW5ncyA9PT0gJ2JyJykge1xuXHRcdFx0XHRib2R5ID0gcHVtcChib2R5LCB6bGliLmNyZWF0ZUJyb3RsaURlY29tcHJlc3MoKSwgZXJyb3IgPT4ge1xuXHRcdFx0XHRcdGlmIChlcnJvcikge1xuXHRcdFx0XHRcdFx0cmVqZWN0KGVycm9yKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRyZXNwb25zZSA9IG5ldyBSZXNwb25zZShib2R5LCByZXNwb25zZU9wdGlvbnMpO1xuXHRcdFx0XHRyZXNvbHZlKHJlc3BvbnNlKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBPdGhlcndpc2UsIHVzZSByZXNwb25zZSBhcy1pc1xuXHRcdFx0cmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UoYm9keSwgcmVzcG9uc2VPcHRpb25zKTtcblx0XHRcdHJlc29sdmUocmVzcG9uc2UpO1xuXHRcdH0pO1xuXG5cdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHByb21pc2UvcHJlZmVyLWF3YWl0LXRvLXRoZW5cblx0XHR3cml0ZVRvU3RyZWFtKHJlcXVlc3RfLCByZXF1ZXN0KS5jYXRjaChyZWplY3QpO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gZml4UmVzcG9uc2VDaHVua2VkVHJhbnNmZXJCYWRFbmRpbmcocmVxdWVzdCwgZXJyb3JDYWxsYmFjaykge1xuXHRjb25zdCBMQVNUX0NIVU5LID0gQnVmZmVyLmZyb20oJzBcXHJcXG5cXHJcXG4nKTtcblxuXHRsZXQgaXNDaHVua2VkVHJhbnNmZXIgPSBmYWxzZTtcblx0bGV0IHByb3Blckxhc3RDaHVua1JlY2VpdmVkID0gZmFsc2U7XG5cdGxldCBwcmV2aW91c0NodW5rO1xuXG5cdHJlcXVlc3Qub24oJ3Jlc3BvbnNlJywgcmVzcG9uc2UgPT4ge1xuXHRcdGNvbnN0IHtoZWFkZXJzfSA9IHJlc3BvbnNlO1xuXHRcdGlzQ2h1bmtlZFRyYW5zZmVyID0gaGVhZGVyc1sndHJhbnNmZXItZW5jb2RpbmcnXSA9PT0gJ2NodW5rZWQnICYmICFoZWFkZXJzWydjb250ZW50LWxlbmd0aCddO1xuXHR9KTtcblxuXHRyZXF1ZXN0Lm9uKCdzb2NrZXQnLCBzb2NrZXQgPT4ge1xuXHRcdGNvbnN0IG9uU29ja2V0Q2xvc2UgPSAoKSA9PiB7XG5cdFx0XHRpZiAoaXNDaHVua2VkVHJhbnNmZXIgJiYgIXByb3Blckxhc3RDaHVua1JlY2VpdmVkKSB7XG5cdFx0XHRcdGNvbnN0IGVycm9yID0gbmV3IEVycm9yKCdQcmVtYXR1cmUgY2xvc2UnKTtcblx0XHRcdFx0ZXJyb3IuY29kZSA9ICdFUlJfU1RSRUFNX1BSRU1BVFVSRV9DTE9TRSc7XG5cdFx0XHRcdGVycm9yQ2FsbGJhY2soZXJyb3IpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRjb25zdCBvbkRhdGEgPSBidWYgPT4ge1xuXHRcdFx0cHJvcGVyTGFzdENodW5rUmVjZWl2ZWQgPSBCdWZmZXIuY29tcGFyZShidWYuc2xpY2UoLTUpLCBMQVNUX0NIVU5LKSA9PT0gMDtcblxuXHRcdFx0Ly8gU29tZXRpbWVzIGZpbmFsIDAtbGVuZ3RoIGNodW5rIGFuZCBlbmQgb2YgbWVzc2FnZSBjb2RlIGFyZSBpbiBzZXBhcmF0ZSBwYWNrZXRzXG5cdFx0XHRpZiAoIXByb3Blckxhc3RDaHVua1JlY2VpdmVkICYmIHByZXZpb3VzQ2h1bmspIHtcblx0XHRcdFx0cHJvcGVyTGFzdENodW5rUmVjZWl2ZWQgPSAoXG5cdFx0XHRcdFx0QnVmZmVyLmNvbXBhcmUocHJldmlvdXNDaHVuay5zbGljZSgtMyksIExBU1RfQ0hVTksuc2xpY2UoMCwgMykpID09PSAwICYmXG5cdFx0XHRcdFx0QnVmZmVyLmNvbXBhcmUoYnVmLnNsaWNlKC0yKSwgTEFTVF9DSFVOSy5zbGljZSgzKSkgPT09IDBcblx0XHRcdFx0KTtcblx0XHRcdH1cblxuXHRcdFx0cHJldmlvdXNDaHVuayA9IGJ1Zjtcblx0XHR9O1xuXG5cdFx0c29ja2V0LnByZXBlbmRMaXN0ZW5lcignY2xvc2UnLCBvblNvY2tldENsb3NlKTtcblx0XHRzb2NrZXQub24oJ2RhdGEnLCBvbkRhdGEpO1xuXG5cdFx0cmVxdWVzdC5vbignY2xvc2UnLCAoKSA9PiB7XG5cdFx0XHRzb2NrZXQucmVtb3ZlTGlzdGVuZXIoJ2Nsb3NlJywgb25Tb2NrZXRDbG9zZSk7XG5cdFx0XHRzb2NrZXQucmVtb3ZlTGlzdGVuZXIoJ2RhdGEnLCBvbkRhdGEpO1xuXHRcdH0pO1xuXHR9KTtcbn1cbiIsICJleHBvcnQgaW50ZXJmYWNlIE1pbWVCdWZmZXIgZXh0ZW5kcyBCdWZmZXIge1xuXHR0eXBlOiBzdHJpbmc7XG5cdHR5cGVGdWxsOiBzdHJpbmc7XG5cdGNoYXJzZXQ6IHN0cmluZztcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgYEJ1ZmZlcmAgaW5zdGFuY2UgZnJvbSB0aGUgZ2l2ZW4gZGF0YSBVUkkgYHVyaWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVyaSBEYXRhIFVSSSB0byB0dXJuIGludG8gYSBCdWZmZXIgaW5zdGFuY2VcbiAqIEByZXR1cm5zIHtCdWZmZXJ9IEJ1ZmZlciBpbnN0YW5jZSBmcm9tIERhdGEgVVJJXG4gKiBAYXBpIHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gZGF0YVVyaVRvQnVmZmVyKHVyaTogc3RyaW5nKTogTWltZUJ1ZmZlciB7XG5cdGlmICghL15kYXRhOi9pLnRlc3QodXJpKSkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoXG5cdFx0XHQnYHVyaWAgZG9lcyBub3QgYXBwZWFyIHRvIGJlIGEgRGF0YSBVUkkgKG11c3QgYmVnaW4gd2l0aCBcImRhdGE6XCIpJ1xuXHRcdCk7XG5cdH1cblxuXHQvLyBzdHJpcCBuZXdsaW5lc1xuXHR1cmkgPSB1cmkucmVwbGFjZSgvXFxyP1xcbi9nLCAnJyk7XG5cblx0Ly8gc3BsaXQgdGhlIFVSSSB1cCBpbnRvIHRoZSBcIm1ldGFkYXRhXCIgYW5kIHRoZSBcImRhdGFcIiBwb3J0aW9uc1xuXHRjb25zdCBmaXJzdENvbW1hID0gdXJpLmluZGV4T2YoJywnKTtcblx0aWYgKGZpcnN0Q29tbWEgPT09IC0xIHx8IGZpcnN0Q29tbWEgPD0gNCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ21hbGZvcm1lZCBkYXRhOiBVUkknKTtcblx0fVxuXG5cdC8vIHJlbW92ZSB0aGUgXCJkYXRhOlwiIHNjaGVtZSBhbmQgcGFyc2UgdGhlIG1ldGFkYXRhXG5cdGNvbnN0IG1ldGEgPSB1cmkuc3Vic3RyaW5nKDUsIGZpcnN0Q29tbWEpLnNwbGl0KCc7Jyk7XG5cblx0bGV0IGNoYXJzZXQgPSAnJztcblx0bGV0IGJhc2U2NCA9IGZhbHNlO1xuXHRjb25zdCB0eXBlID0gbWV0YVswXSB8fCAndGV4dC9wbGFpbic7XG5cdGxldCB0eXBlRnVsbCA9IHR5cGU7XG5cdGZvciAobGV0IGkgPSAxOyBpIDwgbWV0YS5sZW5ndGg7IGkrKykge1xuXHRcdGlmIChtZXRhW2ldID09PSAnYmFzZTY0Jykge1xuXHRcdFx0YmFzZTY0ID0gdHJ1ZTtcblx0XHR9IGVsc2UgaWYobWV0YVtpXSkge1xuXHRcdFx0dHlwZUZ1bGwgKz0gYDskeyAgbWV0YVtpXX1gO1xuXHRcdFx0aWYgKG1ldGFbaV0uaW5kZXhPZignY2hhcnNldD0nKSA9PT0gMCkge1xuXHRcdFx0XHRjaGFyc2V0ID0gbWV0YVtpXS5zdWJzdHJpbmcoOCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdC8vIGRlZmF1bHRzIHRvIFVTLUFTQ0lJIG9ubHkgaWYgdHlwZSBpcyBub3QgcHJvdmlkZWRcblx0aWYgKCFtZXRhWzBdICYmICFjaGFyc2V0Lmxlbmd0aCkge1xuXHRcdHR5cGVGdWxsICs9ICc7Y2hhcnNldD1VUy1BU0NJSSc7XG5cdFx0Y2hhcnNldCA9ICdVUy1BU0NJSSc7XG5cdH1cblxuXHQvLyBnZXQgdGhlIGVuY29kZWQgZGF0YSBwb3J0aW9uIGFuZCBkZWNvZGUgVVJJLWVuY29kZWQgY2hhcnNcblx0Y29uc3QgZW5jb2RpbmcgPSBiYXNlNjQgPyAnYmFzZTY0JyA6ICdhc2NpaSc7XG5cdGNvbnN0IGRhdGEgPSB1bmVzY2FwZSh1cmkuc3Vic3RyaW5nKGZpcnN0Q29tbWEgKyAxKSk7XG5cdGNvbnN0IGJ1ZmZlciA9IEJ1ZmZlci5mcm9tKGRhdGEsIGVuY29kaW5nKSBhcyBNaW1lQnVmZmVyO1xuXG5cdC8vIHNldCBgLnR5cGVgIGFuZCBgLnR5cGVGdWxsYCBwcm9wZXJ0aWVzIHRvIE1JTUUgdHlwZVxuXHRidWZmZXIudHlwZSA9IHR5cGU7XG5cdGJ1ZmZlci50eXBlRnVsbCA9IHR5cGVGdWxsO1xuXG5cdC8vIHNldCB0aGUgYC5jaGFyc2V0YCBwcm9wZXJ0eVxuXHRidWZmZXIuY2hhcnNldCA9IGNoYXJzZXQ7XG5cblx0cmV0dXJuIGJ1ZmZlcjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZGF0YVVyaVRvQnVmZmVyO1xuIiwgIlxuLyoqXG4gKiBCb2R5LmpzXG4gKlxuICogQm9keSBpbnRlcmZhY2UgcHJvdmlkZXMgY29tbW9uIG1ldGhvZHMgZm9yIFJlcXVlc3QgYW5kIFJlc3BvbnNlXG4gKi9cblxuaW1wb3J0IFN0cmVhbSwge1Bhc3NUaHJvdWdofSBmcm9tICdub2RlOnN0cmVhbSc7XG5pbXBvcnQge3R5cGVzLCBkZXByZWNhdGUsIHByb21pc2lmeX0gZnJvbSAnbm9kZTp1dGlsJztcbmltcG9ydCB7QnVmZmVyfSBmcm9tICdub2RlOmJ1ZmZlcic7XG5cbmltcG9ydCBCbG9iIGZyb20gJ2ZldGNoLWJsb2InO1xuaW1wb3J0IHtGb3JtRGF0YSwgZm9ybURhdGFUb0Jsb2J9IGZyb20gJ2Zvcm1kYXRhLXBvbHlmaWxsL2VzbS5taW4uanMnO1xuXG5pbXBvcnQge0ZldGNoRXJyb3J9IGZyb20gJy4vZXJyb3JzL2ZldGNoLWVycm9yLmpzJztcbmltcG9ydCB7RmV0Y2hCYXNlRXJyb3J9IGZyb20gJy4vZXJyb3JzL2Jhc2UuanMnO1xuaW1wb3J0IHtpc0Jsb2IsIGlzVVJMU2VhcmNoUGFyYW1ldGVyc30gZnJvbSAnLi91dGlscy9pcy5qcyc7XG5cbmNvbnN0IHBpcGVsaW5lID0gcHJvbWlzaWZ5KFN0cmVhbS5waXBlbGluZSk7XG5jb25zdCBJTlRFUk5BTFMgPSBTeW1ib2woJ0JvZHkgaW50ZXJuYWxzJyk7XG5cbi8qKlxuICogQm9keSBtaXhpblxuICpcbiAqIFJlZjogaHR0cHM6Ly9mZXRjaC5zcGVjLndoYXR3Zy5vcmcvI2JvZHlcbiAqXG4gKiBAcGFyYW0gICBTdHJlYW0gIGJvZHkgIFJlYWRhYmxlIHN0cmVhbVxuICogQHBhcmFtICAgT2JqZWN0ICBvcHRzICBSZXNwb25zZSBvcHRpb25zXG4gKiBAcmV0dXJuICBWb2lkXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJvZHkge1xuXHRjb25zdHJ1Y3Rvcihib2R5LCB7XG5cdFx0c2l6ZSA9IDBcblx0fSA9IHt9KSB7XG5cdFx0bGV0IGJvdW5kYXJ5ID0gbnVsbDtcblxuXHRcdGlmIChib2R5ID09PSBudWxsKSB7XG5cdFx0XHQvLyBCb2R5IGlzIHVuZGVmaW5lZCBvciBudWxsXG5cdFx0XHRib2R5ID0gbnVsbDtcblx0XHR9IGVsc2UgaWYgKGlzVVJMU2VhcmNoUGFyYW1ldGVycyhib2R5KSkge1xuXHRcdFx0Ly8gQm9keSBpcyBhIFVSTFNlYXJjaFBhcmFtc1xuXHRcdFx0Ym9keSA9IEJ1ZmZlci5mcm9tKGJvZHkudG9TdHJpbmcoKSk7XG5cdFx0fSBlbHNlIGlmIChpc0Jsb2IoYm9keSkpIHtcblx0XHRcdC8vIEJvZHkgaXMgYmxvYlxuXHRcdH0gZWxzZSBpZiAoQnVmZmVyLmlzQnVmZmVyKGJvZHkpKSB7XG5cdFx0XHQvLyBCb2R5IGlzIEJ1ZmZlclxuXHRcdH0gZWxzZSBpZiAodHlwZXMuaXNBbnlBcnJheUJ1ZmZlcihib2R5KSkge1xuXHRcdFx0Ly8gQm9keSBpcyBBcnJheUJ1ZmZlclxuXHRcdFx0Ym9keSA9IEJ1ZmZlci5mcm9tKGJvZHkpO1xuXHRcdH0gZWxzZSBpZiAoQXJyYXlCdWZmZXIuaXNWaWV3KGJvZHkpKSB7XG5cdFx0XHQvLyBCb2R5IGlzIEFycmF5QnVmZmVyVmlld1xuXHRcdFx0Ym9keSA9IEJ1ZmZlci5mcm9tKGJvZHkuYnVmZmVyLCBib2R5LmJ5dGVPZmZzZXQsIGJvZHkuYnl0ZUxlbmd0aCk7XG5cdFx0fSBlbHNlIGlmIChib2R5IGluc3RhbmNlb2YgU3RyZWFtKSB7XG5cdFx0XHQvLyBCb2R5IGlzIHN0cmVhbVxuXHRcdH0gZWxzZSBpZiAoYm9keSBpbnN0YW5jZW9mIEZvcm1EYXRhKSB7XG5cdFx0XHQvLyBCb2R5IGlzIEZvcm1EYXRhXG5cdFx0XHRib2R5ID0gZm9ybURhdGFUb0Jsb2IoYm9keSk7XG5cdFx0XHRib3VuZGFyeSA9IGJvZHkudHlwZS5zcGxpdCgnPScpWzFdO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBOb25lIG9mIHRoZSBhYm92ZVxuXHRcdFx0Ly8gY29lcmNlIHRvIHN0cmluZyB0aGVuIGJ1ZmZlclxuXHRcdFx0Ym9keSA9IEJ1ZmZlci5mcm9tKFN0cmluZyhib2R5KSk7XG5cdFx0fVxuXG5cdFx0bGV0IHN0cmVhbSA9IGJvZHk7XG5cblx0XHRpZiAoQnVmZmVyLmlzQnVmZmVyKGJvZHkpKSB7XG5cdFx0XHRzdHJlYW0gPSBTdHJlYW0uUmVhZGFibGUuZnJvbShib2R5KTtcblx0XHR9IGVsc2UgaWYgKGlzQmxvYihib2R5KSkge1xuXHRcdFx0c3RyZWFtID0gU3RyZWFtLlJlYWRhYmxlLmZyb20oYm9keS5zdHJlYW0oKSk7XG5cdFx0fVxuXG5cdFx0dGhpc1tJTlRFUk5BTFNdID0ge1xuXHRcdFx0Ym9keSxcblx0XHRcdHN0cmVhbSxcblx0XHRcdGJvdW5kYXJ5LFxuXHRcdFx0ZGlzdHVyYmVkOiBmYWxzZSxcblx0XHRcdGVycm9yOiBudWxsXG5cdFx0fTtcblx0XHR0aGlzLnNpemUgPSBzaXplO1xuXG5cdFx0aWYgKGJvZHkgaW5zdGFuY2VvZiBTdHJlYW0pIHtcblx0XHRcdGJvZHkub24oJ2Vycm9yJywgZXJyb3JfID0+IHtcblx0XHRcdFx0Y29uc3QgZXJyb3IgPSBlcnJvcl8gaW5zdGFuY2VvZiBGZXRjaEJhc2VFcnJvciA/XG5cdFx0XHRcdFx0ZXJyb3JfIDpcblx0XHRcdFx0XHRuZXcgRmV0Y2hFcnJvcihgSW52YWxpZCByZXNwb25zZSBib2R5IHdoaWxlIHRyeWluZyB0byBmZXRjaCAke3RoaXMudXJsfTogJHtlcnJvcl8ubWVzc2FnZX1gLCAnc3lzdGVtJywgZXJyb3JfKTtcblx0XHRcdFx0dGhpc1tJTlRFUk5BTFNdLmVycm9yID0gZXJyb3I7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHRnZXQgYm9keSgpIHtcblx0XHRyZXR1cm4gdGhpc1tJTlRFUk5BTFNdLnN0cmVhbTtcblx0fVxuXG5cdGdldCBib2R5VXNlZCgpIHtcblx0XHRyZXR1cm4gdGhpc1tJTlRFUk5BTFNdLmRpc3R1cmJlZDtcblx0fVxuXG5cdC8qKlxuXHQgKiBEZWNvZGUgcmVzcG9uc2UgYXMgQXJyYXlCdWZmZXJcblx0ICpcblx0ICogQHJldHVybiAgUHJvbWlzZVxuXHQgKi9cblx0YXN5bmMgYXJyYXlCdWZmZXIoKSB7XG5cdFx0Y29uc3Qge2J1ZmZlciwgYnl0ZU9mZnNldCwgYnl0ZUxlbmd0aH0gPSBhd2FpdCBjb25zdW1lQm9keSh0aGlzKTtcblx0XHRyZXR1cm4gYnVmZmVyLnNsaWNlKGJ5dGVPZmZzZXQsIGJ5dGVPZmZzZXQgKyBieXRlTGVuZ3RoKTtcblx0fVxuXG5cdGFzeW5jIGZvcm1EYXRhKCkge1xuXHRcdGNvbnN0IGN0ID0gdGhpcy5oZWFkZXJzLmdldCgnY29udGVudC10eXBlJyk7XG5cblx0XHRpZiAoY3Quc3RhcnRzV2l0aCgnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJykpIHtcblx0XHRcdGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG5cdFx0XHRjb25zdCBwYXJhbWV0ZXJzID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhhd2FpdCB0aGlzLnRleHQoKSk7XG5cblx0XHRcdGZvciAoY29uc3QgW25hbWUsIHZhbHVlXSBvZiBwYXJhbWV0ZXJzKSB7XG5cdFx0XHRcdGZvcm1EYXRhLmFwcGVuZChuYW1lLCB2YWx1ZSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBmb3JtRGF0YTtcblx0XHR9XG5cblx0XHRjb25zdCB7dG9Gb3JtRGF0YX0gPSBhd2FpdCBpbXBvcnQoJy4vdXRpbHMvbXVsdGlwYXJ0LXBhcnNlci5qcycpO1xuXHRcdHJldHVybiB0b0Zvcm1EYXRhKHRoaXMuYm9keSwgY3QpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybiByYXcgcmVzcG9uc2UgYXMgQmxvYlxuXHQgKlxuXHQgKiBAcmV0dXJuIFByb21pc2Vcblx0ICovXG5cdGFzeW5jIGJsb2IoKSB7XG5cdFx0Y29uc3QgY3QgPSAodGhpcy5oZWFkZXJzICYmIHRoaXMuaGVhZGVycy5nZXQoJ2NvbnRlbnQtdHlwZScpKSB8fCAodGhpc1tJTlRFUk5BTFNdLmJvZHkgJiYgdGhpc1tJTlRFUk5BTFNdLmJvZHkudHlwZSkgfHwgJyc7XG5cdFx0Y29uc3QgYnVmID0gYXdhaXQgdGhpcy5hcnJheUJ1ZmZlcigpO1xuXG5cdFx0cmV0dXJuIG5ldyBCbG9iKFtidWZdLCB7XG5cdFx0XHR0eXBlOiBjdFxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIERlY29kZSByZXNwb25zZSBhcyBqc29uXG5cdCAqXG5cdCAqIEByZXR1cm4gIFByb21pc2Vcblx0ICovXG5cdGFzeW5jIGpzb24oKSB7XG5cdFx0Y29uc3QgdGV4dCA9IGF3YWl0IHRoaXMudGV4dCgpO1xuXHRcdHJldHVybiBKU09OLnBhcnNlKHRleHQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIERlY29kZSByZXNwb25zZSBhcyB0ZXh0XG5cdCAqXG5cdCAqIEByZXR1cm4gIFByb21pc2Vcblx0ICovXG5cdGFzeW5jIHRleHQoKSB7XG5cdFx0Y29uc3QgYnVmZmVyID0gYXdhaXQgY29uc3VtZUJvZHkodGhpcyk7XG5cdFx0cmV0dXJuIG5ldyBUZXh0RGVjb2RlcigpLmRlY29kZShidWZmZXIpO1xuXHR9XG5cblx0LyoqXG5cdCAqIERlY29kZSByZXNwb25zZSBhcyBidWZmZXIgKG5vbi1zcGVjIGFwaSlcblx0ICpcblx0ICogQHJldHVybiAgUHJvbWlzZVxuXHQgKi9cblx0YnVmZmVyKCkge1xuXHRcdHJldHVybiBjb25zdW1lQm9keSh0aGlzKTtcblx0fVxufVxuXG5Cb2R5LnByb3RvdHlwZS5idWZmZXIgPSBkZXByZWNhdGUoQm9keS5wcm90b3R5cGUuYnVmZmVyLCAnUGxlYXNlIHVzZSBcXCdyZXNwb25zZS5hcnJheUJ1ZmZlcigpXFwnIGluc3RlYWQgb2YgXFwncmVzcG9uc2UuYnVmZmVyKClcXCcnLCAnbm9kZS1mZXRjaCNidWZmZXInKTtcblxuLy8gSW4gYnJvd3NlcnMsIGFsbCBwcm9wZXJ0aWVzIGFyZSBlbnVtZXJhYmxlLlxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoQm9keS5wcm90b3R5cGUsIHtcblx0Ym9keToge2VudW1lcmFibGU6IHRydWV9LFxuXHRib2R5VXNlZDoge2VudW1lcmFibGU6IHRydWV9LFxuXHRhcnJheUJ1ZmZlcjoge2VudW1lcmFibGU6IHRydWV9LFxuXHRibG9iOiB7ZW51bWVyYWJsZTogdHJ1ZX0sXG5cdGpzb246IHtlbnVtZXJhYmxlOiB0cnVlfSxcblx0dGV4dDoge2VudW1lcmFibGU6IHRydWV9LFxuXHRkYXRhOiB7Z2V0OiBkZXByZWNhdGUoKCkgPT4ge30sXG5cdFx0J2RhdGEgZG9lc25cXCd0IGV4aXN0LCB1c2UganNvbigpLCB0ZXh0KCksIGFycmF5QnVmZmVyKCksIG9yIGJvZHkgaW5zdGVhZCcsXG5cdFx0J2h0dHBzOi8vZ2l0aHViLmNvbS9ub2RlLWZldGNoL25vZGUtZmV0Y2gvaXNzdWVzLzEwMDAgKHJlc3BvbnNlKScpfVxufSk7XG5cbi8qKlxuICogQ29uc3VtZSBhbmQgY29udmVydCBhbiBlbnRpcmUgQm9keSB0byBhIEJ1ZmZlci5cbiAqXG4gKiBSZWY6IGh0dHBzOi8vZmV0Y2guc3BlYy53aGF0d2cub3JnLyNjb25jZXB0LWJvZHktY29uc3VtZS1ib2R5XG4gKlxuICogQHJldHVybiBQcm9taXNlXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGNvbnN1bWVCb2R5KGRhdGEpIHtcblx0aWYgKGRhdGFbSU5URVJOQUxTXS5kaXN0dXJiZWQpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKGBib2R5IHVzZWQgYWxyZWFkeSBmb3I6ICR7ZGF0YS51cmx9YCk7XG5cdH1cblxuXHRkYXRhW0lOVEVSTkFMU10uZGlzdHVyYmVkID0gdHJ1ZTtcblxuXHRpZiAoZGF0YVtJTlRFUk5BTFNdLmVycm9yKSB7XG5cdFx0dGhyb3cgZGF0YVtJTlRFUk5BTFNdLmVycm9yO1xuXHR9XG5cblx0Y29uc3Qge2JvZHl9ID0gZGF0YTtcblxuXHQvLyBCb2R5IGlzIG51bGxcblx0aWYgKGJvZHkgPT09IG51bGwpIHtcblx0XHRyZXR1cm4gQnVmZmVyLmFsbG9jKDApO1xuXHR9XG5cblx0LyogYzggaWdub3JlIG5leHQgMyAqL1xuXHRpZiAoIShib2R5IGluc3RhbmNlb2YgU3RyZWFtKSkge1xuXHRcdHJldHVybiBCdWZmZXIuYWxsb2MoMCk7XG5cdH1cblxuXHQvLyBCb2R5IGlzIHN0cmVhbVxuXHQvLyBnZXQgcmVhZHkgdG8gYWN0dWFsbHkgY29uc3VtZSB0aGUgYm9keVxuXHRjb25zdCBhY2N1bSA9IFtdO1xuXHRsZXQgYWNjdW1CeXRlcyA9IDA7XG5cblx0dHJ5IHtcblx0XHRmb3IgYXdhaXQgKGNvbnN0IGNodW5rIG9mIGJvZHkpIHtcblx0XHRcdGlmIChkYXRhLnNpemUgPiAwICYmIGFjY3VtQnl0ZXMgKyBjaHVuay5sZW5ndGggPiBkYXRhLnNpemUpIHtcblx0XHRcdFx0Y29uc3QgZXJyb3IgPSBuZXcgRmV0Y2hFcnJvcihgY29udGVudCBzaXplIGF0ICR7ZGF0YS51cmx9IG92ZXIgbGltaXQ6ICR7ZGF0YS5zaXplfWAsICdtYXgtc2l6ZScpO1xuXHRcdFx0XHRib2R5LmRlc3Ryb3koZXJyb3IpO1xuXHRcdFx0XHR0aHJvdyBlcnJvcjtcblx0XHRcdH1cblxuXHRcdFx0YWNjdW1CeXRlcyArPSBjaHVuay5sZW5ndGg7XG5cdFx0XHRhY2N1bS5wdXNoKGNodW5rKTtcblx0XHR9XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc3QgZXJyb3JfID0gZXJyb3IgaW5zdGFuY2VvZiBGZXRjaEJhc2VFcnJvciA/IGVycm9yIDogbmV3IEZldGNoRXJyb3IoYEludmFsaWQgcmVzcG9uc2UgYm9keSB3aGlsZSB0cnlpbmcgdG8gZmV0Y2ggJHtkYXRhLnVybH06ICR7ZXJyb3IubWVzc2FnZX1gLCAnc3lzdGVtJywgZXJyb3IpO1xuXHRcdHRocm93IGVycm9yXztcblx0fVxuXG5cdGlmIChib2R5LnJlYWRhYmxlRW5kZWQgPT09IHRydWUgfHwgYm9keS5fcmVhZGFibGVTdGF0ZS5lbmRlZCA9PT0gdHJ1ZSkge1xuXHRcdHRyeSB7XG5cdFx0XHRpZiAoYWNjdW0uZXZlcnkoYyA9PiB0eXBlb2YgYyA9PT0gJ3N0cmluZycpKSB7XG5cdFx0XHRcdHJldHVybiBCdWZmZXIuZnJvbShhY2N1bS5qb2luKCcnKSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBCdWZmZXIuY29uY2F0KGFjY3VtLCBhY2N1bUJ5dGVzKTtcblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0dGhyb3cgbmV3IEZldGNoRXJyb3IoYENvdWxkIG5vdCBjcmVhdGUgQnVmZmVyIGZyb20gcmVzcG9uc2UgYm9keSBmb3IgJHtkYXRhLnVybH06ICR7ZXJyb3IubWVzc2FnZX1gLCAnc3lzdGVtJywgZXJyb3IpO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHR0aHJvdyBuZXcgRmV0Y2hFcnJvcihgUHJlbWF0dXJlIGNsb3NlIG9mIHNlcnZlciByZXNwb25zZSB3aGlsZSB0cnlpbmcgdG8gZmV0Y2ggJHtkYXRhLnVybH1gKTtcblx0fVxufVxuXG4vKipcbiAqIENsb25lIGJvZHkgZ2l2ZW4gUmVzL1JlcSBpbnN0YW5jZVxuICpcbiAqIEBwYXJhbSAgIE1peGVkICAgaW5zdGFuY2UgICAgICAgUmVzcG9uc2Ugb3IgUmVxdWVzdCBpbnN0YW5jZVxuICogQHBhcmFtICAgU3RyaW5nICBoaWdoV2F0ZXJNYXJrICBoaWdoV2F0ZXJNYXJrIGZvciBib3RoIFBhc3NUaHJvdWdoIGJvZHkgc3RyZWFtc1xuICogQHJldHVybiAgTWl4ZWRcbiAqL1xuZXhwb3J0IGNvbnN0IGNsb25lID0gKGluc3RhbmNlLCBoaWdoV2F0ZXJNYXJrKSA9PiB7XG5cdGxldCBwMTtcblx0bGV0IHAyO1xuXHRsZXQge2JvZHl9ID0gaW5zdGFuY2VbSU5URVJOQUxTXTtcblxuXHQvLyBEb24ndCBhbGxvdyBjbG9uaW5nIGEgdXNlZCBib2R5XG5cdGlmIChpbnN0YW5jZS5ib2R5VXNlZCkge1xuXHRcdHRocm93IG5ldyBFcnJvcignY2Fubm90IGNsb25lIGJvZHkgYWZ0ZXIgaXQgaXMgdXNlZCcpO1xuXHR9XG5cblx0Ly8gQ2hlY2sgdGhhdCBib2R5IGlzIGEgc3RyZWFtIGFuZCBub3QgZm9ybS1kYXRhIG9iamVjdFxuXHQvLyBub3RlOiB3ZSBjYW4ndCBjbG9uZSB0aGUgZm9ybS1kYXRhIG9iamVjdCB3aXRob3V0IGhhdmluZyBpdCBhcyBhIGRlcGVuZGVuY3lcblx0aWYgKChib2R5IGluc3RhbmNlb2YgU3RyZWFtKSAmJiAodHlwZW9mIGJvZHkuZ2V0Qm91bmRhcnkgIT09ICdmdW5jdGlvbicpKSB7XG5cdFx0Ly8gVGVlIGluc3RhbmNlIGJvZHlcblx0XHRwMSA9IG5ldyBQYXNzVGhyb3VnaCh7aGlnaFdhdGVyTWFya30pO1xuXHRcdHAyID0gbmV3IFBhc3NUaHJvdWdoKHtoaWdoV2F0ZXJNYXJrfSk7XG5cdFx0Ym9keS5waXBlKHAxKTtcblx0XHRib2R5LnBpcGUocDIpO1xuXHRcdC8vIFNldCBpbnN0YW5jZSBib2R5IHRvIHRlZWQgYm9keSBhbmQgcmV0dXJuIHRoZSBvdGhlciB0ZWVkIGJvZHlcblx0XHRpbnN0YW5jZVtJTlRFUk5BTFNdLnN0cmVhbSA9IHAxO1xuXHRcdGJvZHkgPSBwMjtcblx0fVxuXG5cdHJldHVybiBib2R5O1xufTtcblxuY29uc3QgZ2V0Tm9uU3BlY0Zvcm1EYXRhQm91bmRhcnkgPSBkZXByZWNhdGUoXG5cdGJvZHkgPT4gYm9keS5nZXRCb3VuZGFyeSgpLFxuXHQnZm9ybS1kYXRhIGRvZXNuXFwndCBmb2xsb3cgdGhlIHNwZWMgYW5kIHJlcXVpcmVzIHNwZWNpYWwgdHJlYXRtZW50LiBVc2UgYWx0ZXJuYXRpdmUgcGFja2FnZScsXG5cdCdodHRwczovL2dpdGh1Yi5jb20vbm9kZS1mZXRjaC9ub2RlLWZldGNoL2lzc3Vlcy8xMTY3J1xuKTtcblxuLyoqXG4gKiBQZXJmb3JtcyB0aGUgb3BlcmF0aW9uIFwiZXh0cmFjdCBhIGBDb250ZW50LVR5cGVgIHZhbHVlIGZyb20gfG9iamVjdHxcIiBhc1xuICogc3BlY2lmaWVkIGluIHRoZSBzcGVjaWZpY2F0aW9uOlxuICogaHR0cHM6Ly9mZXRjaC5zcGVjLndoYXR3Zy5vcmcvI2NvbmNlcHQtYm9keWluaXQtZXh0cmFjdFxuICpcbiAqIFRoaXMgZnVuY3Rpb24gYXNzdW1lcyB0aGF0IGluc3RhbmNlLmJvZHkgaXMgcHJlc2VudC5cbiAqXG4gKiBAcGFyYW0ge2FueX0gYm9keSBBbnkgb3B0aW9ucy5ib2R5IGlucHV0XG4gKiBAcmV0dXJucyB7c3RyaW5nIHwgbnVsbH1cbiAqL1xuZXhwb3J0IGNvbnN0IGV4dHJhY3RDb250ZW50VHlwZSA9IChib2R5LCByZXF1ZXN0KSA9PiB7XG5cdC8vIEJvZHkgaXMgbnVsbCBvciB1bmRlZmluZWRcblx0aWYgKGJvZHkgPT09IG51bGwpIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdC8vIEJvZHkgaXMgc3RyaW5nXG5cdGlmICh0eXBlb2YgYm9keSA9PT0gJ3N0cmluZycpIHtcblx0XHRyZXR1cm4gJ3RleHQvcGxhaW47Y2hhcnNldD1VVEYtOCc7XG5cdH1cblxuXHQvLyBCb2R5IGlzIGEgVVJMU2VhcmNoUGFyYW1zXG5cdGlmIChpc1VSTFNlYXJjaFBhcmFtZXRlcnMoYm9keSkpIHtcblx0XHRyZXR1cm4gJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDtjaGFyc2V0PVVURi04Jztcblx0fVxuXG5cdC8vIEJvZHkgaXMgYmxvYlxuXHRpZiAoaXNCbG9iKGJvZHkpKSB7XG5cdFx0cmV0dXJuIGJvZHkudHlwZSB8fCBudWxsO1xuXHR9XG5cblx0Ly8gQm9keSBpcyBhIEJ1ZmZlciAoQnVmZmVyLCBBcnJheUJ1ZmZlciBvciBBcnJheUJ1ZmZlclZpZXcpXG5cdGlmIChCdWZmZXIuaXNCdWZmZXIoYm9keSkgfHwgdHlwZXMuaXNBbnlBcnJheUJ1ZmZlcihib2R5KSB8fCBBcnJheUJ1ZmZlci5pc1ZpZXcoYm9keSkpIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdGlmIChib2R5IGluc3RhbmNlb2YgRm9ybURhdGEpIHtcblx0XHRyZXR1cm4gYG11bHRpcGFydC9mb3JtLWRhdGE7IGJvdW5kYXJ5PSR7cmVxdWVzdFtJTlRFUk5BTFNdLmJvdW5kYXJ5fWA7XG5cdH1cblxuXHQvLyBEZXRlY3QgZm9ybSBkYXRhIGlucHV0IGZyb20gZm9ybS1kYXRhIG1vZHVsZVxuXHRpZiAoYm9keSAmJiB0eXBlb2YgYm9keS5nZXRCb3VuZGFyeSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdHJldHVybiBgbXVsdGlwYXJ0L2Zvcm0tZGF0YTtib3VuZGFyeT0ke2dldE5vblNwZWNGb3JtRGF0YUJvdW5kYXJ5KGJvZHkpfWA7XG5cdH1cblxuXHQvLyBCb2R5IGlzIHN0cmVhbSAtIGNhbid0IHJlYWxseSBkbyBtdWNoIGFib3V0IHRoaXNcblx0aWYgKGJvZHkgaW5zdGFuY2VvZiBTdHJlYW0pIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdC8vIEJvZHkgY29uc3RydWN0b3IgZGVmYXVsdHMgb3RoZXIgdGhpbmdzIHRvIHN0cmluZ1xuXHRyZXR1cm4gJ3RleHQvcGxhaW47Y2hhcnNldD1VVEYtOCc7XG59O1xuXG4vKipcbiAqIFRoZSBGZXRjaCBTdGFuZGFyZCB0cmVhdHMgdGhpcyBhcyBpZiBcInRvdGFsIGJ5dGVzXCIgaXMgYSBwcm9wZXJ0eSBvbiB0aGUgYm9keS5cbiAqIEZvciB1cywgd2UgaGF2ZSB0byBleHBsaWNpdGx5IGdldCBpdCB3aXRoIGEgZnVuY3Rpb24uXG4gKlxuICogcmVmOiBodHRwczovL2ZldGNoLnNwZWMud2hhdHdnLm9yZy8jY29uY2VwdC1ib2R5LXRvdGFsLWJ5dGVzXG4gKlxuICogQHBhcmFtIHthbnl9IG9iai5ib2R5IEJvZHkgb2JqZWN0IGZyb20gdGhlIEJvZHkgaW5zdGFuY2UuXG4gKiBAcmV0dXJucyB7bnVtYmVyIHwgbnVsbH1cbiAqL1xuZXhwb3J0IGNvbnN0IGdldFRvdGFsQnl0ZXMgPSByZXF1ZXN0ID0+IHtcblx0Y29uc3Qge2JvZHl9ID0gcmVxdWVzdFtJTlRFUk5BTFNdO1xuXG5cdC8vIEJvZHkgaXMgbnVsbCBvciB1bmRlZmluZWRcblx0aWYgKGJvZHkgPT09IG51bGwpIHtcblx0XHRyZXR1cm4gMDtcblx0fVxuXG5cdC8vIEJvZHkgaXMgQmxvYlxuXHRpZiAoaXNCbG9iKGJvZHkpKSB7XG5cdFx0cmV0dXJuIGJvZHkuc2l6ZTtcblx0fVxuXG5cdC8vIEJvZHkgaXMgQnVmZmVyXG5cdGlmIChCdWZmZXIuaXNCdWZmZXIoYm9keSkpIHtcblx0XHRyZXR1cm4gYm9keS5sZW5ndGg7XG5cdH1cblxuXHQvLyBEZXRlY3QgZm9ybSBkYXRhIGlucHV0IGZyb20gZm9ybS1kYXRhIG1vZHVsZVxuXHRpZiAoYm9keSAmJiB0eXBlb2YgYm9keS5nZXRMZW5ndGhTeW5jID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0cmV0dXJuIGJvZHkuaGFzS25vd25MZW5ndGggJiYgYm9keS5oYXNLbm93bkxlbmd0aCgpID8gYm9keS5nZXRMZW5ndGhTeW5jKCkgOiBudWxsO1xuXHR9XG5cblx0Ly8gQm9keSBpcyBzdHJlYW1cblx0cmV0dXJuIG51bGw7XG59O1xuXG4vKipcbiAqIFdyaXRlIGEgQm9keSB0byBhIE5vZGUuanMgV3JpdGFibGVTdHJlYW0gKGUuZy4gaHR0cC5SZXF1ZXN0KSBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtTdHJlYW0uV3JpdGFibGV9IGRlc3QgVGhlIHN0cmVhbSB0byB3cml0ZSB0by5cbiAqIEBwYXJhbSBvYmouYm9keSBCb2R5IG9iamVjdCBmcm9tIHRoZSBCb2R5IGluc3RhbmNlLlxuICogQHJldHVybnMge1Byb21pc2U8dm9pZD59XG4gKi9cbmV4cG9ydCBjb25zdCB3cml0ZVRvU3RyZWFtID0gYXN5bmMgKGRlc3QsIHtib2R5fSkgPT4ge1xuXHRpZiAoYm9keSA9PT0gbnVsbCkge1xuXHRcdC8vIEJvZHkgaXMgbnVsbFxuXHRcdGRlc3QuZW5kKCk7XG5cdH0gZWxzZSB7XG5cdFx0Ly8gQm9keSBpcyBzdHJlYW1cblx0XHRhd2FpdCBwaXBlbGluZShib2R5LCBkZXN0KTtcblx0fVxufTtcbiIsICJleHBvcnQgY2xhc3MgRmV0Y2hCYXNlRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG5cdGNvbnN0cnVjdG9yKG1lc3NhZ2UsIHR5cGUpIHtcblx0XHRzdXBlcihtZXNzYWdlKTtcblx0XHQvLyBIaWRlIGN1c3RvbSBlcnJvciBpbXBsZW1lbnRhdGlvbiBkZXRhaWxzIGZyb20gZW5kLXVzZXJzXG5cdFx0RXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgdGhpcy5jb25zdHJ1Y3Rvcik7XG5cblx0XHR0aGlzLnR5cGUgPSB0eXBlO1xuXHR9XG5cblx0Z2V0IG5hbWUoKSB7XG5cdFx0cmV0dXJuIHRoaXMuY29uc3RydWN0b3IubmFtZTtcblx0fVxuXG5cdGdldCBbU3ltYm9sLnRvU3RyaW5nVGFnXSgpIHtcblx0XHRyZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5uYW1lO1xuXHR9XG59XG4iLCAiXG5pbXBvcnQge0ZldGNoQmFzZUVycm9yfSBmcm9tICcuL2Jhc2UuanMnO1xuXG4vKipcbiAqIEB0eXBlZGVmIHt7IGFkZHJlc3M/OiBzdHJpbmcsIGNvZGU6IHN0cmluZywgZGVzdD86IHN0cmluZywgZXJybm86IG51bWJlciwgaW5mbz86IG9iamVjdCwgbWVzc2FnZTogc3RyaW5nLCBwYXRoPzogc3RyaW5nLCBwb3J0PzogbnVtYmVyLCBzeXNjYWxsOiBzdHJpbmd9fSBTeXN0ZW1FcnJvclxuKi9cblxuLyoqXG4gKiBGZXRjaEVycm9yIGludGVyZmFjZSBmb3Igb3BlcmF0aW9uYWwgZXJyb3JzXG4gKi9cbmV4cG9ydCBjbGFzcyBGZXRjaEVycm9yIGV4dGVuZHMgRmV0Y2hCYXNlRXJyb3Ige1xuXHQvKipcblx0ICogQHBhcmFtICB7c3RyaW5nfSBtZXNzYWdlIC0gICAgICBFcnJvciBtZXNzYWdlIGZvciBodW1hblxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IFt0eXBlXSAtICAgICAgICBFcnJvciB0eXBlIGZvciBtYWNoaW5lXG5cdCAqIEBwYXJhbSAge1N5c3RlbUVycm9yfSBbc3lzdGVtRXJyb3JdIC0gRm9yIE5vZGUuanMgc3lzdGVtIGVycm9yXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcihtZXNzYWdlLCB0eXBlLCBzeXN0ZW1FcnJvcikge1xuXHRcdHN1cGVyKG1lc3NhZ2UsIHR5cGUpO1xuXHRcdC8vIFdoZW4gZXJyLnR5cGUgaXMgYHN5c3RlbWAsIGVyci5lcnJvcmVkU3lzQ2FsbCBjb250YWlucyBzeXN0ZW0gZXJyb3IgYW5kIGVyci5jb2RlIGNvbnRhaW5zIHN5c3RlbSBlcnJvciBjb2RlXG5cdFx0aWYgKHN5c3RlbUVycm9yKSB7XG5cdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbXVsdGktYXNzaWduXG5cdFx0XHR0aGlzLmNvZGUgPSB0aGlzLmVycm5vID0gc3lzdGVtRXJyb3IuY29kZTtcblx0XHRcdHRoaXMuZXJyb3JlZFN5c0NhbGwgPSBzeXN0ZW1FcnJvci5zeXNjYWxsO1xuXHRcdH1cblx0fVxufVxuIiwgIi8qKlxuICogSXMuanNcbiAqXG4gKiBPYmplY3QgdHlwZSBjaGVja3MuXG4gKi9cblxuY29uc3QgTkFNRSA9IFN5bWJvbC50b1N0cmluZ1RhZztcblxuLyoqXG4gKiBDaGVjayBpZiBgb2JqYCBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3RcbiAqIHJlZjogaHR0cHM6Ly9naXRodWIuY29tL25vZGUtZmV0Y2gvbm9kZS1mZXRjaC9pc3N1ZXMvMjk2I2lzc3VlY29tbWVudC0zMDc1OTgxNDNcbiAqIEBwYXJhbSB7Kn0gb2JqZWN0IC0gT2JqZWN0IHRvIGNoZWNrIGZvclxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGNvbnN0IGlzVVJMU2VhcmNoUGFyYW1ldGVycyA9IG9iamVjdCA9PiB7XG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiZcblx0XHR0eXBlb2Ygb2JqZWN0LmFwcGVuZCA9PT0gJ2Z1bmN0aW9uJyAmJlxuXHRcdHR5cGVvZiBvYmplY3QuZGVsZXRlID09PSAnZnVuY3Rpb24nICYmXG5cdFx0dHlwZW9mIG9iamVjdC5nZXQgPT09ICdmdW5jdGlvbicgJiZcblx0XHR0eXBlb2Ygb2JqZWN0LmdldEFsbCA9PT0gJ2Z1bmN0aW9uJyAmJlxuXHRcdHR5cGVvZiBvYmplY3QuaGFzID09PSAnZnVuY3Rpb24nICYmXG5cdFx0dHlwZW9mIG9iamVjdC5zZXQgPT09ICdmdW5jdGlvbicgJiZcblx0XHR0eXBlb2Ygb2JqZWN0LnNvcnQgPT09ICdmdW5jdGlvbicgJiZcblx0XHRvYmplY3RbTkFNRV0gPT09ICdVUkxTZWFyY2hQYXJhbXMnXG5cdCk7XG59O1xuXG4vKipcbiAqIENoZWNrIGlmIGBvYmplY3RgIGlzIGEgVzNDIGBCbG9iYCBvYmplY3QgKHdoaWNoIGBGaWxlYCBpbmhlcml0cyBmcm9tKVxuICogQHBhcmFtIHsqfSBvYmplY3QgLSBPYmplY3QgdG8gY2hlY2sgZm9yXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5leHBvcnQgY29uc3QgaXNCbG9iID0gb2JqZWN0ID0+IHtcblx0cmV0dXJuIChcblx0XHRvYmplY3QgJiZcblx0XHR0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJlxuXHRcdHR5cGVvZiBvYmplY3QuYXJyYXlCdWZmZXIgPT09ICdmdW5jdGlvbicgJiZcblx0XHR0eXBlb2Ygb2JqZWN0LnR5cGUgPT09ICdzdHJpbmcnICYmXG5cdFx0dHlwZW9mIG9iamVjdC5zdHJlYW0gPT09ICdmdW5jdGlvbicgJiZcblx0XHR0eXBlb2Ygb2JqZWN0LmNvbnN0cnVjdG9yID09PSAnZnVuY3Rpb24nICYmXG5cdFx0L14oQmxvYnxGaWxlKSQvLnRlc3Qob2JqZWN0W05BTUVdKVxuXHQpO1xufTtcblxuLyoqXG4gKiBDaGVjayBpZiBgb2JqYCBpcyBhbiBpbnN0YW5jZSBvZiBBYm9ydFNpZ25hbC5cbiAqIEBwYXJhbSB7Kn0gb2JqZWN0IC0gT2JqZWN0IHRvIGNoZWNrIGZvclxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGNvbnN0IGlzQWJvcnRTaWduYWwgPSBvYmplY3QgPT4ge1xuXHRyZXR1cm4gKFxuXHRcdHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmIChcblx0XHRcdG9iamVjdFtOQU1FXSA9PT0gJ0Fib3J0U2lnbmFsJyB8fFxuXHRcdFx0b2JqZWN0W05BTUVdID09PSAnRXZlbnRUYXJnZXQnXG5cdFx0KVxuXHQpO1xufTtcblxuLyoqXG4gKiBpc0RvbWFpbk9yU3ViZG9tYWluIHJlcG9ydHMgd2hldGhlciBzdWIgaXMgYSBzdWJkb21haW4gKG9yIGV4YWN0IG1hdGNoKSBvZlxuICogdGhlIHBhcmVudCBkb21haW4uXG4gKlxuICogQm90aCBkb21haW5zIG11c3QgYWxyZWFkeSBiZSBpbiBjYW5vbmljYWwgZm9ybS5cbiAqIEBwYXJhbSB7c3RyaW5nfFVSTH0gb3JpZ2luYWxcbiAqIEBwYXJhbSB7c3RyaW5nfFVSTH0gZGVzdGluYXRpb25cbiAqL1xuZXhwb3J0IGNvbnN0IGlzRG9tYWluT3JTdWJkb21haW4gPSAoZGVzdGluYXRpb24sIG9yaWdpbmFsKSA9PiB7XG5cdGNvbnN0IG9yaWcgPSBuZXcgVVJMKG9yaWdpbmFsKS5ob3N0bmFtZTtcblx0Y29uc3QgZGVzdCA9IG5ldyBVUkwoZGVzdGluYXRpb24pLmhvc3RuYW1lO1xuXG5cdHJldHVybiBvcmlnID09PSBkZXN0IHx8IG9yaWcuZW5kc1dpdGgoYC4ke2Rlc3R9YCk7XG59O1xuXG4vKipcbiAqIGlzU2FtZVByb3RvY29sIHJlcG9ydHMgd2hldGhlciB0aGUgdHdvIHByb3ZpZGVkIFVSTHMgdXNlIHRoZSBzYW1lIHByb3RvY29sLlxuICpcbiAqIEJvdGggZG9tYWlucyBtdXN0IGFscmVhZHkgYmUgaW4gY2Fub25pY2FsIGZvcm0uXG4gKiBAcGFyYW0ge3N0cmluZ3xVUkx9IG9yaWdpbmFsXG4gKiBAcGFyYW0ge3N0cmluZ3xVUkx9IGRlc3RpbmF0aW9uXG4gKi9cbmV4cG9ydCBjb25zdCBpc1NhbWVQcm90b2NvbCA9IChkZXN0aW5hdGlvbiwgb3JpZ2luYWwpID0+IHtcblx0Y29uc3Qgb3JpZyA9IG5ldyBVUkwob3JpZ2luYWwpLnByb3RvY29sO1xuXHRjb25zdCBkZXN0ID0gbmV3IFVSTChkZXN0aW5hdGlvbikucHJvdG9jb2w7XG5cblx0cmV0dXJuIG9yaWcgPT09IGRlc3Q7XG59O1xuIiwgIi8qKlxuICogSGVhZGVycy5qc1xuICpcbiAqIEhlYWRlcnMgY2xhc3Mgb2ZmZXJzIGNvbnZlbmllbnQgaGVscGVyc1xuICovXG5cbmltcG9ydCB7dHlwZXN9IGZyb20gJ25vZGU6dXRpbCc7XG5pbXBvcnQgaHR0cCBmcm9tICdub2RlOmh0dHAnO1xuXG4vKiBjOCBpZ25vcmUgbmV4dCA5ICovXG5jb25zdCB2YWxpZGF0ZUhlYWRlck5hbWUgPSB0eXBlb2YgaHR0cC52YWxpZGF0ZUhlYWRlck5hbWUgPT09ICdmdW5jdGlvbicgP1xuXHRodHRwLnZhbGlkYXRlSGVhZGVyTmFtZSA6XG5cdG5hbWUgPT4ge1xuXHRcdGlmICghL15bXFxeYFxcLVxcdyEjJCUmJyorLnx+XSskLy50ZXN0KG5hbWUpKSB7XG5cdFx0XHRjb25zdCBlcnJvciA9IG5ldyBUeXBlRXJyb3IoYEhlYWRlciBuYW1lIG11c3QgYmUgYSB2YWxpZCBIVFRQIHRva2VuIFske25hbWV9XWApO1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGVycm9yLCAnY29kZScsIHt2YWx1ZTogJ0VSUl9JTlZBTElEX0hUVFBfVE9LRU4nfSk7XG5cdFx0XHR0aHJvdyBlcnJvcjtcblx0XHR9XG5cdH07XG5cbi8qIGM4IGlnbm9yZSBuZXh0IDkgKi9cbmNvbnN0IHZhbGlkYXRlSGVhZGVyVmFsdWUgPSB0eXBlb2YgaHR0cC52YWxpZGF0ZUhlYWRlclZhbHVlID09PSAnZnVuY3Rpb24nID9cblx0aHR0cC52YWxpZGF0ZUhlYWRlclZhbHVlIDpcblx0KG5hbWUsIHZhbHVlKSA9PiB7XG5cdFx0aWYgKC9bXlxcdFxcdTAwMjAtXFx1MDA3RVxcdTAwODAtXFx1MDBGRl0vLnRlc3QodmFsdWUpKSB7XG5cdFx0XHRjb25zdCBlcnJvciA9IG5ldyBUeXBlRXJyb3IoYEludmFsaWQgY2hhcmFjdGVyIGluIGhlYWRlciBjb250ZW50IFtcIiR7bmFtZX1cIl1gKTtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlcnJvciwgJ2NvZGUnLCB7dmFsdWU6ICdFUlJfSU5WQUxJRF9DSEFSJ30pO1xuXHRcdFx0dGhyb3cgZXJyb3I7XG5cdFx0fVxuXHR9O1xuXG4vKipcbiAqIEB0eXBlZGVmIHtIZWFkZXJzIHwgUmVjb3JkPHN0cmluZywgc3RyaW5nPiB8IEl0ZXJhYmxlPHJlYWRvbmx5IFtzdHJpbmcsIHN0cmluZ10+IHwgSXRlcmFibGU8SXRlcmFibGU8c3RyaW5nPj59IEhlYWRlcnNJbml0XG4gKi9cblxuLyoqXG4gKiBUaGlzIEZldGNoIEFQSSBpbnRlcmZhY2UgYWxsb3dzIHlvdSB0byBwZXJmb3JtIHZhcmlvdXMgYWN0aW9ucyBvbiBIVFRQIHJlcXVlc3QgYW5kIHJlc3BvbnNlIGhlYWRlcnMuXG4gKiBUaGVzZSBhY3Rpb25zIGluY2x1ZGUgcmV0cmlldmluZywgc2V0dGluZywgYWRkaW5nIHRvLCBhbmQgcmVtb3ZpbmcuXG4gKiBBIEhlYWRlcnMgb2JqZWN0IGhhcyBhbiBhc3NvY2lhdGVkIGhlYWRlciBsaXN0LCB3aGljaCBpcyBpbml0aWFsbHkgZW1wdHkgYW5kIGNvbnNpc3RzIG9mIHplcm8gb3IgbW9yZSBuYW1lIGFuZCB2YWx1ZSBwYWlycy5cbiAqIFlvdSBjYW4gYWRkIHRvIHRoaXMgdXNpbmcgbWV0aG9kcyBsaWtlIGFwcGVuZCgpIChzZWUgRXhhbXBsZXMuKVxuICogSW4gYWxsIG1ldGhvZHMgb2YgdGhpcyBpbnRlcmZhY2UsIGhlYWRlciBuYW1lcyBhcmUgbWF0Y2hlZCBieSBjYXNlLWluc2Vuc2l0aXZlIGJ5dGUgc2VxdWVuY2UuXG4gKlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIZWFkZXJzIGV4dGVuZHMgVVJMU2VhcmNoUGFyYW1zIHtcblx0LyoqXG5cdCAqIEhlYWRlcnMgY2xhc3Ncblx0ICpcblx0ICogQGNvbnN0cnVjdG9yXG5cdCAqIEBwYXJhbSB7SGVhZGVyc0luaXR9IFtpbml0XSAtIFJlc3BvbnNlIGhlYWRlcnNcblx0ICovXG5cdGNvbnN0cnVjdG9yKGluaXQpIHtcblx0XHQvLyBWYWxpZGF0ZSBhbmQgbm9ybWFsaXplIGluaXQgb2JqZWN0IGluIFtuYW1lLCB2YWx1ZShzKV1bXVxuXHRcdC8qKiBAdHlwZSB7c3RyaW5nW11bXX0gKi9cblx0XHRsZXQgcmVzdWx0ID0gW107XG5cdFx0aWYgKGluaXQgaW5zdGFuY2VvZiBIZWFkZXJzKSB7XG5cdFx0XHRjb25zdCByYXcgPSBpbml0LnJhdygpO1xuXHRcdFx0Zm9yIChjb25zdCBbbmFtZSwgdmFsdWVzXSBvZiBPYmplY3QuZW50cmllcyhyYXcpKSB7XG5cdFx0XHRcdHJlc3VsdC5wdXNoKC4uLnZhbHVlcy5tYXAodmFsdWUgPT4gW25hbWUsIHZhbHVlXSkpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoaW5pdCA9PSBudWxsKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tZXEtbnVsbCwgZXFlcWVxXG5cdFx0XHQvLyBObyBvcFxuXHRcdH0gZWxzZSBpZiAodHlwZW9mIGluaXQgPT09ICdvYmplY3QnICYmICF0eXBlcy5pc0JveGVkUHJpbWl0aXZlKGluaXQpKSB7XG5cdFx0XHRjb25zdCBtZXRob2QgPSBpbml0W1N5bWJvbC5pdGVyYXRvcl07XG5cdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZXEtbnVsbCwgZXFlcWVxXG5cdFx0XHRpZiAobWV0aG9kID09IG51bGwpIHtcblx0XHRcdFx0Ly8gUmVjb3JkPEJ5dGVTdHJpbmcsIEJ5dGVTdHJpbmc+XG5cdFx0XHRcdHJlc3VsdC5wdXNoKC4uLk9iamVjdC5lbnRyaWVzKGluaXQpKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICh0eXBlb2YgbWV0aG9kICE9PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignSGVhZGVyIHBhaXJzIG11c3QgYmUgaXRlcmFibGUnKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFNlcXVlbmNlPHNlcXVlbmNlPEJ5dGVTdHJpbmc+PlxuXHRcdFx0XHQvLyBOb3RlOiBwZXIgc3BlYyB3ZSBoYXZlIHRvIGZpcnN0IGV4aGF1c3QgdGhlIGxpc3RzIHRoZW4gcHJvY2VzcyB0aGVtXG5cdFx0XHRcdHJlc3VsdCA9IFsuLi5pbml0XVxuXHRcdFx0XHRcdC5tYXAocGFpciA9PiB7XG5cdFx0XHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0XHRcdHR5cGVvZiBwYWlyICE9PSAnb2JqZWN0JyB8fCB0eXBlcy5pc0JveGVkUHJpbWl0aXZlKHBhaXIpXG5cdFx0XHRcdFx0XHQpIHtcblx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignRWFjaCBoZWFkZXIgcGFpciBtdXN0IGJlIGFuIGl0ZXJhYmxlIG9iamVjdCcpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRyZXR1cm4gWy4uLnBhaXJdO1xuXHRcdFx0XHRcdH0pLm1hcChwYWlyID0+IHtcblx0XHRcdFx0XHRcdGlmIChwYWlyLmxlbmd0aCAhPT0gMikge1xuXHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdFYWNoIGhlYWRlciBwYWlyIG11c3QgYmUgYSBuYW1lL3ZhbHVlIHR1cGxlJyk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHJldHVybiBbLi4ucGFpcl07XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ0ZhaWxlZCB0byBjb25zdHJ1Y3QgXFwnSGVhZGVyc1xcJzogVGhlIHByb3ZpZGVkIHZhbHVlIGlzIG5vdCBvZiB0eXBlIFxcJyhzZXF1ZW5jZTxzZXF1ZW5jZTxCeXRlU3RyaW5nPj4gb3IgcmVjb3JkPEJ5dGVTdHJpbmcsIEJ5dGVTdHJpbmc+KScpO1xuXHRcdH1cblxuXHRcdC8vIFZhbGlkYXRlIGFuZCBsb3dlcmNhc2Vcblx0XHRyZXN1bHQgPVxuXHRcdFx0cmVzdWx0Lmxlbmd0aCA+IDAgP1xuXHRcdFx0XHRyZXN1bHQubWFwKChbbmFtZSwgdmFsdWVdKSA9PiB7XG5cdFx0XHRcdFx0dmFsaWRhdGVIZWFkZXJOYW1lKG5hbWUpO1xuXHRcdFx0XHRcdHZhbGlkYXRlSGVhZGVyVmFsdWUobmFtZSwgU3RyaW5nKHZhbHVlKSk7XG5cdFx0XHRcdFx0cmV0dXJuIFtTdHJpbmcobmFtZSkudG9Mb3dlckNhc2UoKSwgU3RyaW5nKHZhbHVlKV07XG5cdFx0XHRcdH0pIDpcblx0XHRcdFx0dW5kZWZpbmVkO1xuXG5cdFx0c3VwZXIocmVzdWx0KTtcblxuXHRcdC8vIFJldHVybmluZyBhIFByb3h5IHRoYXQgd2lsbCBsb3dlcmNhc2Uga2V5IG5hbWVzLCB2YWxpZGF0ZSBwYXJhbWV0ZXJzIGFuZCBzb3J0IGtleXNcblx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RydWN0b3ItcmV0dXJuXG5cdFx0cmV0dXJuIG5ldyBQcm94eSh0aGlzLCB7XG5cdFx0XHRnZXQodGFyZ2V0LCBwLCByZWNlaXZlcikge1xuXHRcdFx0XHRzd2l0Y2ggKHApIHtcblx0XHRcdFx0XHRjYXNlICdhcHBlbmQnOlxuXHRcdFx0XHRcdGNhc2UgJ3NldCc6XG5cdFx0XHRcdFx0XHRyZXR1cm4gKG5hbWUsIHZhbHVlKSA9PiB7XG5cdFx0XHRcdFx0XHRcdHZhbGlkYXRlSGVhZGVyTmFtZShuYW1lKTtcblx0XHRcdFx0XHRcdFx0dmFsaWRhdGVIZWFkZXJWYWx1ZShuYW1lLCBTdHJpbmcodmFsdWUpKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIFVSTFNlYXJjaFBhcmFtcy5wcm90b3R5cGVbcF0uY2FsbChcblx0XHRcdFx0XHRcdFx0XHR0YXJnZXQsXG5cdFx0XHRcdFx0XHRcdFx0U3RyaW5nKG5hbWUpLnRvTG93ZXJDYXNlKCksXG5cdFx0XHRcdFx0XHRcdFx0U3RyaW5nKHZhbHVlKVxuXHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdGNhc2UgJ2RlbGV0ZSc6XG5cdFx0XHRcdFx0Y2FzZSAnaGFzJzpcblx0XHRcdFx0XHRjYXNlICdnZXRBbGwnOlxuXHRcdFx0XHRcdFx0cmV0dXJuIG5hbWUgPT4ge1xuXHRcdFx0XHRcdFx0XHR2YWxpZGF0ZUhlYWRlck5hbWUobmFtZSk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBVUkxTZWFyY2hQYXJhbXMucHJvdG90eXBlW3BdLmNhbGwoXG5cdFx0XHRcdFx0XHRcdFx0dGFyZ2V0LFxuXHRcdFx0XHRcdFx0XHRcdFN0cmluZyhuYW1lKS50b0xvd2VyQ2FzZSgpXG5cdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0Y2FzZSAna2V5cyc6XG5cdFx0XHRcdFx0XHRyZXR1cm4gKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHR0YXJnZXQuc29ydCgpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gbmV3IFNldChVUkxTZWFyY2hQYXJhbXMucHJvdG90eXBlLmtleXMuY2FsbCh0YXJnZXQpKS5rZXlzKCk7XG5cdFx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdHJldHVybiBSZWZsZWN0LmdldCh0YXJnZXQsIHAsIHJlY2VpdmVyKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdC8qIGM4IGlnbm9yZSBuZXh0ICovXG5cdH1cblxuXHRnZXQgW1N5bWJvbC50b1N0cmluZ1RhZ10oKSB7XG5cdFx0cmV0dXJuIHRoaXMuY29uc3RydWN0b3IubmFtZTtcblx0fVxuXG5cdHRvU3RyaW5nKCkge1xuXHRcdHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodGhpcyk7XG5cdH1cblxuXHRnZXQobmFtZSkge1xuXHRcdGNvbnN0IHZhbHVlcyA9IHRoaXMuZ2V0QWxsKG5hbWUpO1xuXHRcdGlmICh2YWx1ZXMubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cblx0XHRsZXQgdmFsdWUgPSB2YWx1ZXMuam9pbignLCAnKTtcblx0XHRpZiAoL15jb250ZW50LWVuY29kaW5nJC9pLnRlc3QobmFtZSkpIHtcblx0XHRcdHZhbHVlID0gdmFsdWUudG9Mb3dlckNhc2UoKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdmFsdWU7XG5cdH1cblxuXHRmb3JFYWNoKGNhbGxiYWNrLCB0aGlzQXJnID0gdW5kZWZpbmVkKSB7XG5cdFx0Zm9yIChjb25zdCBuYW1lIG9mIHRoaXMua2V5cygpKSB7XG5cdFx0XHRSZWZsZWN0LmFwcGx5KGNhbGxiYWNrLCB0aGlzQXJnLCBbdGhpcy5nZXQobmFtZSksIG5hbWUsIHRoaXNdKTtcblx0XHR9XG5cdH1cblxuXHQqIHZhbHVlcygpIHtcblx0XHRmb3IgKGNvbnN0IG5hbWUgb2YgdGhpcy5rZXlzKCkpIHtcblx0XHRcdHlpZWxkIHRoaXMuZ2V0KG5hbWUpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBAdHlwZSB7KCkgPT4gSXRlcmFibGVJdGVyYXRvcjxbc3RyaW5nLCBzdHJpbmddPn1cblx0ICovXG5cdCogZW50cmllcygpIHtcblx0XHRmb3IgKGNvbnN0IG5hbWUgb2YgdGhpcy5rZXlzKCkpIHtcblx0XHRcdHlpZWxkIFtuYW1lLCB0aGlzLmdldChuYW1lKV07XG5cdFx0fVxuXHR9XG5cblx0W1N5bWJvbC5pdGVyYXRvcl0oKSB7XG5cdFx0cmV0dXJuIHRoaXMuZW50cmllcygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIE5vZGUtZmV0Y2ggbm9uLXNwZWMgbWV0aG9kXG5cdCAqIHJldHVybmluZyBhbGwgaGVhZGVycyBhbmQgdGhlaXIgdmFsdWVzIGFzIGFycmF5XG5cdCAqIEByZXR1cm5zIHtSZWNvcmQ8c3RyaW5nLCBzdHJpbmdbXT59XG5cdCAqL1xuXHRyYXcoKSB7XG5cdFx0cmV0dXJuIFsuLi50aGlzLmtleXMoKV0ucmVkdWNlKChyZXN1bHQsIGtleSkgPT4ge1xuXHRcdFx0cmVzdWx0W2tleV0gPSB0aGlzLmdldEFsbChrZXkpO1xuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9LCB7fSk7XG5cdH1cblxuXHQvKipcblx0ICogRm9yIGJldHRlciBjb25zb2xlLmxvZyhoZWFkZXJzKSBhbmQgYWxzbyB0byBjb252ZXJ0IEhlYWRlcnMgaW50byBOb2RlLmpzIFJlcXVlc3QgY29tcGF0aWJsZSBmb3JtYXRcblx0ICovXG5cdFtTeW1ib2wuZm9yKCdub2RlanMudXRpbC5pbnNwZWN0LmN1c3RvbScpXSgpIHtcblx0XHRyZXR1cm4gWy4uLnRoaXMua2V5cygpXS5yZWR1Y2UoKHJlc3VsdCwga2V5KSA9PiB7XG5cdFx0XHRjb25zdCB2YWx1ZXMgPSB0aGlzLmdldEFsbChrZXkpO1xuXHRcdFx0Ly8gSHR0cC5yZXF1ZXN0KCkgb25seSBzdXBwb3J0cyBzdHJpbmcgYXMgSG9zdCBoZWFkZXIuXG5cdFx0XHQvLyBUaGlzIGhhY2sgbWFrZXMgc3BlY2lmeWluZyBjdXN0b20gSG9zdCBoZWFkZXIgcG9zc2libGUuXG5cdFx0XHRpZiAoa2V5ID09PSAnaG9zdCcpIHtcblx0XHRcdFx0cmVzdWx0W2tleV0gPSB2YWx1ZXNbMF07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXN1bHRba2V5XSA9IHZhbHVlcy5sZW5ndGggPiAxID8gdmFsdWVzIDogdmFsdWVzWzBdO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH0sIHt9KTtcblx0fVxufVxuXG4vKipcbiAqIFJlLXNoYXBpbmcgb2JqZWN0IGZvciBXZWIgSURMIHRlc3RzXG4gKiBPbmx5IG5lZWQgdG8gZG8gaXQgZm9yIG92ZXJyaWRkZW4gbWV0aG9kc1xuICovXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyhcblx0SGVhZGVycy5wcm90b3R5cGUsXG5cdFsnZ2V0JywgJ2VudHJpZXMnLCAnZm9yRWFjaCcsICd2YWx1ZXMnXS5yZWR1Y2UoKHJlc3VsdCwgcHJvcGVydHkpID0+IHtcblx0XHRyZXN1bHRbcHJvcGVydHldID0ge2VudW1lcmFibGU6IHRydWV9O1xuXHRcdHJldHVybiByZXN1bHQ7XG5cdH0sIHt9KVxuKTtcblxuLyoqXG4gKiBDcmVhdGUgYSBIZWFkZXJzIG9iamVjdCBmcm9tIGFuIGh0dHAuSW5jb21pbmdNZXNzYWdlLnJhd0hlYWRlcnMsIGlnbm9yaW5nIHRob3NlIHRoYXQgZG9cbiAqIG5vdCBjb25mb3JtIHRvIEhUVFAgZ3JhbW1hciBwcm9kdWN0aW9ucy5cbiAqIEBwYXJhbSB7aW1wb3J0KCdodHRwJykuSW5jb21pbmdNZXNzYWdlWydyYXdIZWFkZXJzJ119IGhlYWRlcnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZyb21SYXdIZWFkZXJzKGhlYWRlcnMgPSBbXSkge1xuXHRyZXR1cm4gbmV3IEhlYWRlcnMoXG5cdFx0aGVhZGVyc1xuXHRcdFx0Ly8gU3BsaXQgaW50byBwYWlyc1xuXHRcdFx0LnJlZHVjZSgocmVzdWx0LCB2YWx1ZSwgaW5kZXgsIGFycmF5KSA9PiB7XG5cdFx0XHRcdGlmIChpbmRleCAlIDIgPT09IDApIHtcblx0XHRcdFx0XHRyZXN1bHQucHVzaChhcnJheS5zbGljZShpbmRleCwgaW5kZXggKyAyKSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fSwgW10pXG5cdFx0XHQuZmlsdGVyKChbbmFtZSwgdmFsdWVdKSA9PiB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0dmFsaWRhdGVIZWFkZXJOYW1lKG5hbWUpO1xuXHRcdFx0XHRcdHZhbGlkYXRlSGVhZGVyVmFsdWUobmFtZSwgU3RyaW5nKHZhbHVlKSk7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH0gY2F0Y2gge1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fSlcblxuXHQpO1xufVxuIiwgImNvbnN0IHJlZGlyZWN0U3RhdHVzID0gbmV3IFNldChbMzAxLCAzMDIsIDMwMywgMzA3LCAzMDhdKTtcblxuLyoqXG4gKiBSZWRpcmVjdCBjb2RlIG1hdGNoaW5nXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IGNvZGUgLSBTdGF0dXMgY29kZVxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGNvbnN0IGlzUmVkaXJlY3QgPSBjb2RlID0+IHtcblx0cmV0dXJuIHJlZGlyZWN0U3RhdHVzLmhhcyhjb2RlKTtcbn07XG4iLCAiLyoqXG4gKiBSZXNwb25zZS5qc1xuICpcbiAqIFJlc3BvbnNlIGNsYXNzIHByb3ZpZGVzIGNvbnRlbnQgZGVjb2RpbmdcbiAqL1xuXG5pbXBvcnQgSGVhZGVycyBmcm9tICcuL2hlYWRlcnMuanMnO1xuaW1wb3J0IEJvZHksIHtjbG9uZSwgZXh0cmFjdENvbnRlbnRUeXBlfSBmcm9tICcuL2JvZHkuanMnO1xuaW1wb3J0IHtpc1JlZGlyZWN0fSBmcm9tICcuL3V0aWxzL2lzLXJlZGlyZWN0LmpzJztcblxuY29uc3QgSU5URVJOQUxTID0gU3ltYm9sKCdSZXNwb25zZSBpbnRlcm5hbHMnKTtcblxuLyoqXG4gKiBSZXNwb25zZSBjbGFzc1xuICpcbiAqIFJlZjogaHR0cHM6Ly9mZXRjaC5zcGVjLndoYXR3Zy5vcmcvI3Jlc3BvbnNlLWNsYXNzXG4gKlxuICogQHBhcmFtICAgU3RyZWFtICBib2R5ICBSZWFkYWJsZSBzdHJlYW1cbiAqIEBwYXJhbSAgIE9iamVjdCAgb3B0cyAgUmVzcG9uc2Ugb3B0aW9uc1xuICogQHJldHVybiAgVm9pZFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZXNwb25zZSBleHRlbmRzIEJvZHkge1xuXHRjb25zdHJ1Y3Rvcihib2R5ID0gbnVsbCwgb3B0aW9ucyA9IHt9KSB7XG5cdFx0c3VwZXIoYm9keSwgb3B0aW9ucyk7XG5cblx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZXEtbnVsbCwgZXFlcWVxLCBuby1uZWdhdGVkLWNvbmRpdGlvblxuXHRcdGNvbnN0IHN0YXR1cyA9IG9wdGlvbnMuc3RhdHVzICE9IG51bGwgPyBvcHRpb25zLnN0YXR1cyA6IDIwMDtcblxuXHRcdGNvbnN0IGhlYWRlcnMgPSBuZXcgSGVhZGVycyhvcHRpb25zLmhlYWRlcnMpO1xuXG5cdFx0aWYgKGJvZHkgIT09IG51bGwgJiYgIWhlYWRlcnMuaGFzKCdDb250ZW50LVR5cGUnKSkge1xuXHRcdFx0Y29uc3QgY29udGVudFR5cGUgPSBleHRyYWN0Q29udGVudFR5cGUoYm9keSwgdGhpcyk7XG5cdFx0XHRpZiAoY29udGVudFR5cGUpIHtcblx0XHRcdFx0aGVhZGVycy5hcHBlbmQoJ0NvbnRlbnQtVHlwZScsIGNvbnRlbnRUeXBlKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzW0lOVEVSTkFMU10gPSB7XG5cdFx0XHR0eXBlOiAnZGVmYXVsdCcsXG5cdFx0XHR1cmw6IG9wdGlvbnMudXJsLFxuXHRcdFx0c3RhdHVzLFxuXHRcdFx0c3RhdHVzVGV4dDogb3B0aW9ucy5zdGF0dXNUZXh0IHx8ICcnLFxuXHRcdFx0aGVhZGVycyxcblx0XHRcdGNvdW50ZXI6IG9wdGlvbnMuY291bnRlcixcblx0XHRcdGhpZ2hXYXRlck1hcms6IG9wdGlvbnMuaGlnaFdhdGVyTWFya1xuXHRcdH07XG5cdH1cblxuXHRnZXQgdHlwZSgpIHtcblx0XHRyZXR1cm4gdGhpc1tJTlRFUk5BTFNdLnR5cGU7XG5cdH1cblxuXHRnZXQgdXJsKCkge1xuXHRcdHJldHVybiB0aGlzW0lOVEVSTkFMU10udXJsIHx8ICcnO1xuXHR9XG5cblx0Z2V0IHN0YXR1cygpIHtcblx0XHRyZXR1cm4gdGhpc1tJTlRFUk5BTFNdLnN0YXR1cztcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZW5pZW5jZSBwcm9wZXJ0eSByZXByZXNlbnRpbmcgaWYgdGhlIHJlcXVlc3QgZW5kZWQgbm9ybWFsbHlcblx0ICovXG5cdGdldCBvaygpIHtcblx0XHRyZXR1cm4gdGhpc1tJTlRFUk5BTFNdLnN0YXR1cyA+PSAyMDAgJiYgdGhpc1tJTlRFUk5BTFNdLnN0YXR1cyA8IDMwMDtcblx0fVxuXG5cdGdldCByZWRpcmVjdGVkKCkge1xuXHRcdHJldHVybiB0aGlzW0lOVEVSTkFMU10uY291bnRlciA+IDA7XG5cdH1cblxuXHRnZXQgc3RhdHVzVGV4dCgpIHtcblx0XHRyZXR1cm4gdGhpc1tJTlRFUk5BTFNdLnN0YXR1c1RleHQ7XG5cdH1cblxuXHRnZXQgaGVhZGVycygpIHtcblx0XHRyZXR1cm4gdGhpc1tJTlRFUk5BTFNdLmhlYWRlcnM7XG5cdH1cblxuXHRnZXQgaGlnaFdhdGVyTWFyaygpIHtcblx0XHRyZXR1cm4gdGhpc1tJTlRFUk5BTFNdLmhpZ2hXYXRlck1hcms7XG5cdH1cblxuXHQvKipcblx0ICogQ2xvbmUgdGhpcyByZXNwb25zZVxuXHQgKlxuXHQgKiBAcmV0dXJuICBSZXNwb25zZVxuXHQgKi9cblx0Y2xvbmUoKSB7XG5cdFx0cmV0dXJuIG5ldyBSZXNwb25zZShjbG9uZSh0aGlzLCB0aGlzLmhpZ2hXYXRlck1hcmspLCB7XG5cdFx0XHR0eXBlOiB0aGlzLnR5cGUsXG5cdFx0XHR1cmw6IHRoaXMudXJsLFxuXHRcdFx0c3RhdHVzOiB0aGlzLnN0YXR1cyxcblx0XHRcdHN0YXR1c1RleHQ6IHRoaXMuc3RhdHVzVGV4dCxcblx0XHRcdGhlYWRlcnM6IHRoaXMuaGVhZGVycyxcblx0XHRcdG9rOiB0aGlzLm9rLFxuXHRcdFx0cmVkaXJlY3RlZDogdGhpcy5yZWRpcmVjdGVkLFxuXHRcdFx0c2l6ZTogdGhpcy5zaXplLFxuXHRcdFx0aGlnaFdhdGVyTWFyazogdGhpcy5oaWdoV2F0ZXJNYXJrXG5cdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogQHBhcmFtIHtzdHJpbmd9IHVybCAgICBUaGUgVVJMIHRoYXQgdGhlIG5ldyByZXNwb25zZSBpcyB0byBvcmlnaW5hdGUgZnJvbS5cblx0ICogQHBhcmFtIHtudW1iZXJ9IHN0YXR1cyBBbiBvcHRpb25hbCBzdGF0dXMgY29kZSBmb3IgdGhlIHJlc3BvbnNlIChlLmcuLCAzMDIuKVxuXHQgKiBAcmV0dXJucyB7UmVzcG9uc2V9ICAgIEEgUmVzcG9uc2Ugb2JqZWN0LlxuXHQgKi9cblx0c3RhdGljIHJlZGlyZWN0KHVybCwgc3RhdHVzID0gMzAyKSB7XG5cdFx0aWYgKCFpc1JlZGlyZWN0KHN0YXR1cykpIHtcblx0XHRcdHRocm93IG5ldyBSYW5nZUVycm9yKCdGYWlsZWQgdG8gZXhlY3V0ZSBcInJlZGlyZWN0XCIgb24gXCJyZXNwb25zZVwiOiBJbnZhbGlkIHN0YXR1cyBjb2RlJyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG5ldyBSZXNwb25zZShudWxsLCB7XG5cdFx0XHRoZWFkZXJzOiB7XG5cdFx0XHRcdGxvY2F0aW9uOiBuZXcgVVJMKHVybCkudG9TdHJpbmcoKVxuXHRcdFx0fSxcblx0XHRcdHN0YXR1c1xuXHRcdH0pO1xuXHR9XG5cblx0c3RhdGljIGVycm9yKCkge1xuXHRcdGNvbnN0IHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKG51bGwsIHtzdGF0dXM6IDAsIHN0YXR1c1RleHQ6ICcnfSk7XG5cdFx0cmVzcG9uc2VbSU5URVJOQUxTXS50eXBlID0gJ2Vycm9yJztcblx0XHRyZXR1cm4gcmVzcG9uc2U7XG5cdH1cblxuXHRzdGF0aWMganNvbihkYXRhID0gdW5kZWZpbmVkLCBpbml0ID0ge30pIHtcblx0XHRjb25zdCBib2R5ID0gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XG5cblx0XHRpZiAoYm9keSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdkYXRhIGlzIG5vdCBKU09OIHNlcmlhbGl6YWJsZScpO1xuXHRcdH1cblxuXHRcdGNvbnN0IGhlYWRlcnMgPSBuZXcgSGVhZGVycyhpbml0ICYmIGluaXQuaGVhZGVycyk7XG5cblx0XHRpZiAoIWhlYWRlcnMuaGFzKCdjb250ZW50LXR5cGUnKSkge1xuXHRcdFx0aGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG5ldyBSZXNwb25zZShib2R5LCB7XG5cdFx0XHQuLi5pbml0LFxuXHRcdFx0aGVhZGVyc1xuXHRcdH0pO1xuXHR9XG5cblx0Z2V0IFtTeW1ib2wudG9TdHJpbmdUYWddKCkge1xuXHRcdHJldHVybiAnUmVzcG9uc2UnO1xuXHR9XG59XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFJlc3BvbnNlLnByb3RvdHlwZSwge1xuXHR0eXBlOiB7ZW51bWVyYWJsZTogdHJ1ZX0sXG5cdHVybDoge2VudW1lcmFibGU6IHRydWV9LFxuXHRzdGF0dXM6IHtlbnVtZXJhYmxlOiB0cnVlfSxcblx0b2s6IHtlbnVtZXJhYmxlOiB0cnVlfSxcblx0cmVkaXJlY3RlZDoge2VudW1lcmFibGU6IHRydWV9LFxuXHRzdGF0dXNUZXh0OiB7ZW51bWVyYWJsZTogdHJ1ZX0sXG5cdGhlYWRlcnM6IHtlbnVtZXJhYmxlOiB0cnVlfSxcblx0Y2xvbmU6IHtlbnVtZXJhYmxlOiB0cnVlfVxufSk7XG4iLCAiLyoqXG4gKiBSZXF1ZXN0LmpzXG4gKlxuICogUmVxdWVzdCBjbGFzcyBjb250YWlucyBzZXJ2ZXIgb25seSBvcHRpb25zXG4gKlxuICogQWxsIHNwZWMgYWxnb3JpdGhtIHN0ZXAgbnVtYmVycyBhcmUgYmFzZWQgb24gaHR0cHM6Ly9mZXRjaC5zcGVjLndoYXR3Zy5vcmcvY29tbWl0LXNuYXBzaG90cy9hZTcxNjgyMmNiM2E2MTg0MzIyNmNkMDkwZWVmYzY1ODk0NDZjMWQyLy5cbiAqL1xuXG5pbXBvcnQge2Zvcm1hdCBhcyBmb3JtYXRVcmx9IGZyb20gJ25vZGU6dXJsJztcbmltcG9ydCB7ZGVwcmVjYXRlfSBmcm9tICdub2RlOnV0aWwnO1xuaW1wb3J0IEhlYWRlcnMgZnJvbSAnLi9oZWFkZXJzLmpzJztcbmltcG9ydCBCb2R5LCB7Y2xvbmUsIGV4dHJhY3RDb250ZW50VHlwZSwgZ2V0VG90YWxCeXRlc30gZnJvbSAnLi9ib2R5LmpzJztcbmltcG9ydCB7aXNBYm9ydFNpZ25hbH0gZnJvbSAnLi91dGlscy9pcy5qcyc7XG5pbXBvcnQge2dldFNlYXJjaH0gZnJvbSAnLi91dGlscy9nZXQtc2VhcmNoLmpzJztcbmltcG9ydCB7XG5cdHZhbGlkYXRlUmVmZXJyZXJQb2xpY3ksIGRldGVybWluZVJlcXVlc3RzUmVmZXJyZXIsIERFRkFVTFRfUkVGRVJSRVJfUE9MSUNZXG59IGZyb20gJy4vdXRpbHMvcmVmZXJyZXIuanMnO1xuXG5jb25zdCBJTlRFUk5BTFMgPSBTeW1ib2woJ1JlcXVlc3QgaW50ZXJuYWxzJyk7XG5cbi8qKlxuICogQ2hlY2sgaWYgYG9iamAgaXMgYW4gaW5zdGFuY2Ugb2YgUmVxdWVzdC5cbiAqXG4gKiBAcGFyYW0gIHsqfSBvYmplY3RcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmNvbnN0IGlzUmVxdWVzdCA9IG9iamVjdCA9PiB7XG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiZcblx0XHR0eXBlb2Ygb2JqZWN0W0lOVEVSTkFMU10gPT09ICdvYmplY3QnXG5cdCk7XG59O1xuXG5jb25zdCBkb0JhZERhdGFXYXJuID0gZGVwcmVjYXRlKCgpID0+IHt9LFxuXHQnLmRhdGEgaXMgbm90IGEgdmFsaWQgUmVxdWVzdEluaXQgcHJvcGVydHksIHVzZSAuYm9keSBpbnN0ZWFkJyxcblx0J2h0dHBzOi8vZ2l0aHViLmNvbS9ub2RlLWZldGNoL25vZGUtZmV0Y2gvaXNzdWVzLzEwMDAgKHJlcXVlc3QpJyk7XG5cbi8qKlxuICogUmVxdWVzdCBjbGFzc1xuICpcbiAqIFJlZjogaHR0cHM6Ly9mZXRjaC5zcGVjLndoYXR3Zy5vcmcvI3JlcXVlc3QtY2xhc3NcbiAqXG4gKiBAcGFyYW0gICBNaXhlZCAgIGlucHV0ICBVcmwgb3IgUmVxdWVzdCBpbnN0YW5jZVxuICogQHBhcmFtICAgT2JqZWN0ICBpbml0ICAgQ3VzdG9tIG9wdGlvbnNcbiAqIEByZXR1cm4gIFZvaWRcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVxdWVzdCBleHRlbmRzIEJvZHkge1xuXHRjb25zdHJ1Y3RvcihpbnB1dCwgaW5pdCA9IHt9KSB7XG5cdFx0bGV0IHBhcnNlZFVSTDtcblxuXHRcdC8vIE5vcm1hbGl6ZSBpbnB1dCBhbmQgZm9yY2UgVVJMIHRvIGJlIGVuY29kZWQgYXMgVVRGLTggKGh0dHBzOi8vZ2l0aHViLmNvbS9ub2RlLWZldGNoL25vZGUtZmV0Y2gvaXNzdWVzLzI0NSlcblx0XHRpZiAoaXNSZXF1ZXN0KGlucHV0KSkge1xuXHRcdFx0cGFyc2VkVVJMID0gbmV3IFVSTChpbnB1dC51cmwpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRwYXJzZWRVUkwgPSBuZXcgVVJMKGlucHV0KTtcblx0XHRcdGlucHV0ID0ge307XG5cdFx0fVxuXG5cdFx0aWYgKHBhcnNlZFVSTC51c2VybmFtZSAhPT0gJycgfHwgcGFyc2VkVVJMLnBhc3N3b3JkICE9PSAnJykge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihgJHtwYXJzZWRVUkx9IGlzIGFuIHVybCB3aXRoIGVtYmVkZGVkIGNyZWRlbnRpYWxzLmApO1xuXHRcdH1cblxuXHRcdGxldCBtZXRob2QgPSBpbml0Lm1ldGhvZCB8fCBpbnB1dC5tZXRob2QgfHwgJ0dFVCc7XG5cdFx0aWYgKC9eKGRlbGV0ZXxnZXR8aGVhZHxvcHRpb25zfHBvc3R8cHV0KSQvaS50ZXN0KG1ldGhvZCkpIHtcblx0XHRcdG1ldGhvZCA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpO1xuXHRcdH1cblxuXHRcdGlmICghaXNSZXF1ZXN0KGluaXQpICYmICdkYXRhJyBpbiBpbml0KSB7XG5cdFx0XHRkb0JhZERhdGFXYXJuKCk7XG5cdFx0fVxuXG5cdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWVxLW51bGwsIGVxZXFlcVxuXHRcdGlmICgoaW5pdC5ib2R5ICE9IG51bGwgfHwgKGlzUmVxdWVzdChpbnB1dCkgJiYgaW5wdXQuYm9keSAhPT0gbnVsbCkpICYmXG5cdFx0XHQobWV0aG9kID09PSAnR0VUJyB8fCBtZXRob2QgPT09ICdIRUFEJykpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ1JlcXVlc3Qgd2l0aCBHRVQvSEVBRCBtZXRob2QgY2Fubm90IGhhdmUgYm9keScpO1xuXHRcdH1cblxuXHRcdGNvbnN0IGlucHV0Qm9keSA9IGluaXQuYm9keSA/XG5cdFx0XHRpbml0LmJvZHkgOlxuXHRcdFx0KGlzUmVxdWVzdChpbnB1dCkgJiYgaW5wdXQuYm9keSAhPT0gbnVsbCA/XG5cdFx0XHRcdGNsb25lKGlucHV0KSA6XG5cdFx0XHRcdG51bGwpO1xuXG5cdFx0c3VwZXIoaW5wdXRCb2R5LCB7XG5cdFx0XHRzaXplOiBpbml0LnNpemUgfHwgaW5wdXQuc2l6ZSB8fCAwXG5cdFx0fSk7XG5cblx0XHRjb25zdCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoaW5pdC5oZWFkZXJzIHx8IGlucHV0LmhlYWRlcnMgfHwge30pO1xuXG5cdFx0aWYgKGlucHV0Qm9keSAhPT0gbnVsbCAmJiAhaGVhZGVycy5oYXMoJ0NvbnRlbnQtVHlwZScpKSB7XG5cdFx0XHRjb25zdCBjb250ZW50VHlwZSA9IGV4dHJhY3RDb250ZW50VHlwZShpbnB1dEJvZHksIHRoaXMpO1xuXHRcdFx0aWYgKGNvbnRlbnRUeXBlKSB7XG5cdFx0XHRcdGhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCBjb250ZW50VHlwZSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0bGV0IHNpZ25hbCA9IGlzUmVxdWVzdChpbnB1dCkgP1xuXHRcdFx0aW5wdXQuc2lnbmFsIDpcblx0XHRcdG51bGw7XG5cdFx0aWYgKCdzaWduYWwnIGluIGluaXQpIHtcblx0XHRcdHNpZ25hbCA9IGluaXQuc2lnbmFsO1xuXHRcdH1cblxuXHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1lcS1udWxsLCBlcWVxZXFcblx0XHRpZiAoc2lnbmFsICE9IG51bGwgJiYgIWlzQWJvcnRTaWduYWwoc2lnbmFsKSkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgc2lnbmFsIHRvIGJlIGFuIGluc3RhbmNlb2YgQWJvcnRTaWduYWwgb3IgRXZlbnRUYXJnZXQnKTtcblx0XHR9XG5cblx0XHQvLyBcdTAwQTc1LjQsIFJlcXVlc3QgY29uc3RydWN0b3Igc3RlcHMsIHN0ZXAgMTUuMVxuXHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1lcS1udWxsLCBlcWVxZXFcblx0XHRsZXQgcmVmZXJyZXIgPSBpbml0LnJlZmVycmVyID09IG51bGwgPyBpbnB1dC5yZWZlcnJlciA6IGluaXQucmVmZXJyZXI7XG5cdFx0aWYgKHJlZmVycmVyID09PSAnJykge1xuXHRcdFx0Ly8gXHUwMEE3NS40LCBSZXF1ZXN0IGNvbnN0cnVjdG9yIHN0ZXBzLCBzdGVwIDE1LjJcblx0XHRcdHJlZmVycmVyID0gJ25vLXJlZmVycmVyJztcblx0XHR9IGVsc2UgaWYgKHJlZmVycmVyKSB7XG5cdFx0XHQvLyBcdTAwQTc1LjQsIFJlcXVlc3QgY29uc3RydWN0b3Igc3RlcHMsIHN0ZXAgMTUuMy4xLCAxNS4zLjJcblx0XHRcdGNvbnN0IHBhcnNlZFJlZmVycmVyID0gbmV3IFVSTChyZWZlcnJlcik7XG5cdFx0XHQvLyBcdTAwQTc1LjQsIFJlcXVlc3QgY29uc3RydWN0b3Igc3RlcHMsIHN0ZXAgMTUuMy4zLCAxNS4zLjRcblx0XHRcdHJlZmVycmVyID0gL15hYm91dDooXFwvXFwvKT9jbGllbnQkLy50ZXN0KHBhcnNlZFJlZmVycmVyKSA/ICdjbGllbnQnIDogcGFyc2VkUmVmZXJyZXI7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlZmVycmVyID0gdW5kZWZpbmVkO1xuXHRcdH1cblxuXHRcdHRoaXNbSU5URVJOQUxTXSA9IHtcblx0XHRcdG1ldGhvZCxcblx0XHRcdHJlZGlyZWN0OiBpbml0LnJlZGlyZWN0IHx8IGlucHV0LnJlZGlyZWN0IHx8ICdmb2xsb3cnLFxuXHRcdFx0aGVhZGVycyxcblx0XHRcdHBhcnNlZFVSTCxcblx0XHRcdHNpZ25hbCxcblx0XHRcdHJlZmVycmVyXG5cdFx0fTtcblxuXHRcdC8vIE5vZGUtZmV0Y2gtb25seSBvcHRpb25zXG5cdFx0dGhpcy5mb2xsb3cgPSBpbml0LmZvbGxvdyA9PT0gdW5kZWZpbmVkID8gKGlucHV0LmZvbGxvdyA9PT0gdW5kZWZpbmVkID8gMjAgOiBpbnB1dC5mb2xsb3cpIDogaW5pdC5mb2xsb3c7XG5cdFx0dGhpcy5jb21wcmVzcyA9IGluaXQuY29tcHJlc3MgPT09IHVuZGVmaW5lZCA/IChpbnB1dC5jb21wcmVzcyA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IGlucHV0LmNvbXByZXNzKSA6IGluaXQuY29tcHJlc3M7XG5cdFx0dGhpcy5jb3VudGVyID0gaW5pdC5jb3VudGVyIHx8IGlucHV0LmNvdW50ZXIgfHwgMDtcblx0XHR0aGlzLmFnZW50ID0gaW5pdC5hZ2VudCB8fCBpbnB1dC5hZ2VudDtcblx0XHR0aGlzLmhpZ2hXYXRlck1hcmsgPSBpbml0LmhpZ2hXYXRlck1hcmsgfHwgaW5wdXQuaGlnaFdhdGVyTWFyayB8fCAxNjM4NDtcblx0XHR0aGlzLmluc2VjdXJlSFRUUFBhcnNlciA9IGluaXQuaW5zZWN1cmVIVFRQUGFyc2VyIHx8IGlucHV0Lmluc2VjdXJlSFRUUFBhcnNlciB8fCBmYWxzZTtcblxuXHRcdC8vIFx1MDBBNzUuNCwgUmVxdWVzdCBjb25zdHJ1Y3RvciBzdGVwcywgc3RlcCAxNi5cblx0XHQvLyBEZWZhdWx0IGlzIGVtcHR5IHN0cmluZyBwZXIgaHR0cHM6Ly9mZXRjaC5zcGVjLndoYXR3Zy5vcmcvI2NvbmNlcHQtcmVxdWVzdC1yZWZlcnJlci1wb2xpY3lcblx0XHR0aGlzLnJlZmVycmVyUG9saWN5ID0gaW5pdC5yZWZlcnJlclBvbGljeSB8fCBpbnB1dC5yZWZlcnJlclBvbGljeSB8fCAnJztcblx0fVxuXG5cdC8qKiBAcmV0dXJucyB7c3RyaW5nfSAqL1xuXHRnZXQgbWV0aG9kKCkge1xuXHRcdHJldHVybiB0aGlzW0lOVEVSTkFMU10ubWV0aG9kO1xuXHR9XG5cblx0LyoqIEByZXR1cm5zIHtzdHJpbmd9ICovXG5cdGdldCB1cmwoKSB7XG5cdFx0cmV0dXJuIGZvcm1hdFVybCh0aGlzW0lOVEVSTkFMU10ucGFyc2VkVVJMKTtcblx0fVxuXG5cdC8qKiBAcmV0dXJucyB7SGVhZGVyc30gKi9cblx0Z2V0IGhlYWRlcnMoKSB7XG5cdFx0cmV0dXJuIHRoaXNbSU5URVJOQUxTXS5oZWFkZXJzO1xuXHR9XG5cblx0Z2V0IHJlZGlyZWN0KCkge1xuXHRcdHJldHVybiB0aGlzW0lOVEVSTkFMU10ucmVkaXJlY3Q7XG5cdH1cblxuXHQvKiogQHJldHVybnMge0Fib3J0U2lnbmFsfSAqL1xuXHRnZXQgc2lnbmFsKCkge1xuXHRcdHJldHVybiB0aGlzW0lOVEVSTkFMU10uc2lnbmFsO1xuXHR9XG5cblx0Ly8gaHR0cHM6Ly9mZXRjaC5zcGVjLndoYXR3Zy5vcmcvI2RvbS1yZXF1ZXN0LXJlZmVycmVyXG5cdGdldCByZWZlcnJlcigpIHtcblx0XHRpZiAodGhpc1tJTlRFUk5BTFNdLnJlZmVycmVyID09PSAnbm8tcmVmZXJyZXInKSB7XG5cdFx0XHRyZXR1cm4gJyc7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXNbSU5URVJOQUxTXS5yZWZlcnJlciA9PT0gJ2NsaWVudCcpIHtcblx0XHRcdHJldHVybiAnYWJvdXQ6Y2xpZW50Jztcblx0XHR9XG5cblx0XHRpZiAodGhpc1tJTlRFUk5BTFNdLnJlZmVycmVyKSB7XG5cdFx0XHRyZXR1cm4gdGhpc1tJTlRFUk5BTFNdLnJlZmVycmVyLnRvU3RyaW5nKCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0fVxuXG5cdGdldCByZWZlcnJlclBvbGljeSgpIHtcblx0XHRyZXR1cm4gdGhpc1tJTlRFUk5BTFNdLnJlZmVycmVyUG9saWN5O1xuXHR9XG5cblx0c2V0IHJlZmVycmVyUG9saWN5KHJlZmVycmVyUG9saWN5KSB7XG5cdFx0dGhpc1tJTlRFUk5BTFNdLnJlZmVycmVyUG9saWN5ID0gdmFsaWRhdGVSZWZlcnJlclBvbGljeShyZWZlcnJlclBvbGljeSk7XG5cdH1cblxuXHQvKipcblx0ICogQ2xvbmUgdGhpcyByZXF1ZXN0XG5cdCAqXG5cdCAqIEByZXR1cm4gIFJlcXVlc3Rcblx0ICovXG5cdGNsb25lKCkge1xuXHRcdHJldHVybiBuZXcgUmVxdWVzdCh0aGlzKTtcblx0fVxuXG5cdGdldCBbU3ltYm9sLnRvU3RyaW5nVGFnXSgpIHtcblx0XHRyZXR1cm4gJ1JlcXVlc3QnO1xuXHR9XG59XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFJlcXVlc3QucHJvdG90eXBlLCB7XG5cdG1ldGhvZDoge2VudW1lcmFibGU6IHRydWV9LFxuXHR1cmw6IHtlbnVtZXJhYmxlOiB0cnVlfSxcblx0aGVhZGVyczoge2VudW1lcmFibGU6IHRydWV9LFxuXHRyZWRpcmVjdDoge2VudW1lcmFibGU6IHRydWV9LFxuXHRjbG9uZToge2VudW1lcmFibGU6IHRydWV9LFxuXHRzaWduYWw6IHtlbnVtZXJhYmxlOiB0cnVlfSxcblx0cmVmZXJyZXI6IHtlbnVtZXJhYmxlOiB0cnVlfSxcblx0cmVmZXJyZXJQb2xpY3k6IHtlbnVtZXJhYmxlOiB0cnVlfVxufSk7XG5cbi8qKlxuICogQ29udmVydCBhIFJlcXVlc3QgdG8gTm9kZS5qcyBodHRwIHJlcXVlc3Qgb3B0aW9ucy5cbiAqXG4gKiBAcGFyYW0ge1JlcXVlc3R9IHJlcXVlc3QgLSBBIFJlcXVlc3QgaW5zdGFuY2VcbiAqIEByZXR1cm4gVGhlIG9wdGlvbnMgb2JqZWN0IHRvIGJlIHBhc3NlZCB0byBodHRwLnJlcXVlc3RcbiAqL1xuZXhwb3J0IGNvbnN0IGdldE5vZGVSZXF1ZXN0T3B0aW9ucyA9IHJlcXVlc3QgPT4ge1xuXHRjb25zdCB7cGFyc2VkVVJMfSA9IHJlcXVlc3RbSU5URVJOQUxTXTtcblx0Y29uc3QgaGVhZGVycyA9IG5ldyBIZWFkZXJzKHJlcXVlc3RbSU5URVJOQUxTXS5oZWFkZXJzKTtcblxuXHQvLyBGZXRjaCBzdGVwIDEuM1xuXHRpZiAoIWhlYWRlcnMuaGFzKCdBY2NlcHQnKSkge1xuXHRcdGhlYWRlcnMuc2V0KCdBY2NlcHQnLCAnKi8qJyk7XG5cdH1cblxuXHQvLyBIVFRQLW5ldHdvcmstb3ItY2FjaGUgZmV0Y2ggc3RlcHMgMi40LTIuN1xuXHRsZXQgY29udGVudExlbmd0aFZhbHVlID0gbnVsbDtcblx0aWYgKHJlcXVlc3QuYm9keSA9PT0gbnVsbCAmJiAvXihwb3N0fHB1dCkkL2kudGVzdChyZXF1ZXN0Lm1ldGhvZCkpIHtcblx0XHRjb250ZW50TGVuZ3RoVmFsdWUgPSAnMCc7XG5cdH1cblxuXHRpZiAocmVxdWVzdC5ib2R5ICE9PSBudWxsKSB7XG5cdFx0Y29uc3QgdG90YWxCeXRlcyA9IGdldFRvdGFsQnl0ZXMocmVxdWVzdCk7XG5cdFx0Ly8gU2V0IENvbnRlbnQtTGVuZ3RoIGlmIHRvdGFsQnl0ZXMgaXMgYSBudW1iZXIgKHRoYXQgaXMgbm90IE5hTilcblx0XHRpZiAodHlwZW9mIHRvdGFsQnl0ZXMgPT09ICdudW1iZXInICYmICFOdW1iZXIuaXNOYU4odG90YWxCeXRlcykpIHtcblx0XHRcdGNvbnRlbnRMZW5ndGhWYWx1ZSA9IFN0cmluZyh0b3RhbEJ5dGVzKTtcblx0XHR9XG5cdH1cblxuXHRpZiAoY29udGVudExlbmd0aFZhbHVlKSB7XG5cdFx0aGVhZGVycy5zZXQoJ0NvbnRlbnQtTGVuZ3RoJywgY29udGVudExlbmd0aFZhbHVlKTtcblx0fVxuXG5cdC8vIDQuMS4gTWFpbiBmZXRjaCwgc3RlcCAyLjZcblx0Ly8gPiBJZiByZXF1ZXN0J3MgcmVmZXJyZXIgcG9saWN5IGlzIHRoZSBlbXB0eSBzdHJpbmcsIHRoZW4gc2V0IHJlcXVlc3QncyByZWZlcnJlciBwb2xpY3kgdG8gdGhlXG5cdC8vID4gZGVmYXVsdCByZWZlcnJlciBwb2xpY3kuXG5cdGlmIChyZXF1ZXN0LnJlZmVycmVyUG9saWN5ID09PSAnJykge1xuXHRcdHJlcXVlc3QucmVmZXJyZXJQb2xpY3kgPSBERUZBVUxUX1JFRkVSUkVSX1BPTElDWTtcblx0fVxuXG5cdC8vIDQuMS4gTWFpbiBmZXRjaCwgc3RlcCAyLjdcblx0Ly8gPiBJZiByZXF1ZXN0J3MgcmVmZXJyZXIgaXMgbm90IFwibm8tcmVmZXJyZXJcIiwgc2V0IHJlcXVlc3QncyByZWZlcnJlciB0byB0aGUgcmVzdWx0IG9mIGludm9raW5nXG5cdC8vID4gZGV0ZXJtaW5lIHJlcXVlc3QncyByZWZlcnJlci5cblx0aWYgKHJlcXVlc3QucmVmZXJyZXIgJiYgcmVxdWVzdC5yZWZlcnJlciAhPT0gJ25vLXJlZmVycmVyJykge1xuXHRcdHJlcXVlc3RbSU5URVJOQUxTXS5yZWZlcnJlciA9IGRldGVybWluZVJlcXVlc3RzUmVmZXJyZXIocmVxdWVzdCk7XG5cdH0gZWxzZSB7XG5cdFx0cmVxdWVzdFtJTlRFUk5BTFNdLnJlZmVycmVyID0gJ25vLXJlZmVycmVyJztcblx0fVxuXG5cdC8vIDQuNS4gSFRUUC1uZXR3b3JrLW9yLWNhY2hlIGZldGNoLCBzdGVwIDYuOVxuXHQvLyA+IElmIGh0dHBSZXF1ZXN0J3MgcmVmZXJyZXIgaXMgYSBVUkwsIHRoZW4gYXBwZW5kIGBSZWZlcmVyYC9odHRwUmVxdWVzdCdzIHJlZmVycmVyLCBzZXJpYWxpemVkXG5cdC8vID4gIGFuZCBpc29tb3JwaGljIGVuY29kZWQsIHRvIGh0dHBSZXF1ZXN0J3MgaGVhZGVyIGxpc3QuXG5cdGlmIChyZXF1ZXN0W0lOVEVSTkFMU10ucmVmZXJyZXIgaW5zdGFuY2VvZiBVUkwpIHtcblx0XHRoZWFkZXJzLnNldCgnUmVmZXJlcicsIHJlcXVlc3QucmVmZXJyZXIpO1xuXHR9XG5cblx0Ly8gSFRUUC1uZXR3b3JrLW9yLWNhY2hlIGZldGNoIHN0ZXAgMi4xMVxuXHRpZiAoIWhlYWRlcnMuaGFzKCdVc2VyLUFnZW50JykpIHtcblx0XHRoZWFkZXJzLnNldCgnVXNlci1BZ2VudCcsICdub2RlLWZldGNoJyk7XG5cdH1cblxuXHQvLyBIVFRQLW5ldHdvcmstb3ItY2FjaGUgZmV0Y2ggc3RlcCAyLjE1XG5cdGlmIChyZXF1ZXN0LmNvbXByZXNzICYmICFoZWFkZXJzLmhhcygnQWNjZXB0LUVuY29kaW5nJykpIHtcblx0XHRoZWFkZXJzLnNldCgnQWNjZXB0LUVuY29kaW5nJywgJ2d6aXAsIGRlZmxhdGUsIGJyJyk7XG5cdH1cblxuXHRsZXQge2FnZW50fSA9IHJlcXVlc3Q7XG5cdGlmICh0eXBlb2YgYWdlbnQgPT09ICdmdW5jdGlvbicpIHtcblx0XHRhZ2VudCA9IGFnZW50KHBhcnNlZFVSTCk7XG5cdH1cblxuXHQvLyBIVFRQLW5ldHdvcmsgZmV0Y2ggc3RlcCA0LjJcblx0Ly8gY2h1bmtlZCBlbmNvZGluZyBpcyBoYW5kbGVkIGJ5IE5vZGUuanNcblxuXHRjb25zdCBzZWFyY2ggPSBnZXRTZWFyY2gocGFyc2VkVVJMKTtcblxuXHQvLyBQYXNzIHRoZSBmdWxsIFVSTCBkaXJlY3RseSB0byByZXF1ZXN0KCksIGJ1dCBvdmVyd3JpdGUgdGhlIGZvbGxvd2luZ1xuXHQvLyBvcHRpb25zOlxuXHRjb25zdCBvcHRpb25zID0ge1xuXHRcdC8vIE92ZXJ3cml0ZSBzZWFyY2ggdG8gcmV0YWluIHRyYWlsaW5nID8gKGlzc3VlICM3NzYpXG5cdFx0cGF0aDogcGFyc2VkVVJMLnBhdGhuYW1lICsgc2VhcmNoLFxuXHRcdC8vIFRoZSBmb2xsb3dpbmcgb3B0aW9ucyBhcmUgbm90IGV4cHJlc3NlZCBpbiB0aGUgVVJMXG5cdFx0bWV0aG9kOiByZXF1ZXN0Lm1ldGhvZCxcblx0XHRoZWFkZXJzOiBoZWFkZXJzW1N5bWJvbC5mb3IoJ25vZGVqcy51dGlsLmluc3BlY3QuY3VzdG9tJyldKCksXG5cdFx0aW5zZWN1cmVIVFRQUGFyc2VyOiByZXF1ZXN0Lmluc2VjdXJlSFRUUFBhcnNlcixcblx0XHRhZ2VudFxuXHR9O1xuXG5cdHJldHVybiB7XG5cdFx0LyoqIEB0eXBlIHtVUkx9ICovXG5cdFx0cGFyc2VkVVJMLFxuXHRcdG9wdGlvbnNcblx0fTtcbn07XG4iLCAiZXhwb3J0IGNvbnN0IGdldFNlYXJjaCA9IHBhcnNlZFVSTCA9PiB7XG5cdGlmIChwYXJzZWRVUkwuc2VhcmNoKSB7XG5cdFx0cmV0dXJuIHBhcnNlZFVSTC5zZWFyY2g7XG5cdH1cblxuXHRjb25zdCBsYXN0T2Zmc2V0ID0gcGFyc2VkVVJMLmhyZWYubGVuZ3RoIC0gMTtcblx0Y29uc3QgaGFzaCA9IHBhcnNlZFVSTC5oYXNoIHx8IChwYXJzZWRVUkwuaHJlZltsYXN0T2Zmc2V0XSA9PT0gJyMnID8gJyMnIDogJycpO1xuXHRyZXR1cm4gcGFyc2VkVVJMLmhyZWZbbGFzdE9mZnNldCAtIGhhc2gubGVuZ3RoXSA9PT0gJz8nID8gJz8nIDogJyc7XG59O1xuIiwgImltcG9ydCB7aXNJUH0gZnJvbSAnbm9kZTpuZXQnO1xuXG4vKipcbiAqIEBleHRlcm5hbCBVUkxcbiAqIEBzZWUge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9VUkx8VVJMfVxuICovXG5cbi8qKlxuICogQG1vZHVsZSB1dGlscy9yZWZlcnJlclxuICogQHByaXZhdGVcbiAqL1xuXG4vKipcbiAqIEBzZWUge0BsaW5rIGh0dHBzOi8vdzNjLmdpdGh1Yi5pby93ZWJhcHBzZWMtcmVmZXJyZXItcG9saWN5LyNzdHJpcC11cmx8UmVmZXJyZXIgUG9saWN5IFx1MDBBNzguNC4gU3RyaXAgdXJsIGZvciB1c2UgYXMgYSByZWZlcnJlcn1cbiAqIEBwYXJhbSB7c3RyaW5nfSBVUkxcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29yaWdpbk9ubHk9ZmFsc2VdXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdHJpcFVSTEZvclVzZUFzQVJlZmVycmVyKHVybCwgb3JpZ2luT25seSA9IGZhbHNlKSB7XG5cdC8vIDEuIElmIHVybCBpcyBudWxsLCByZXR1cm4gbm8gcmVmZXJyZXIuXG5cdGlmICh1cmwgPT0gbnVsbCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWVxLW51bGwsIGVxZXFlcVxuXHRcdHJldHVybiAnbm8tcmVmZXJyZXInO1xuXHR9XG5cblx0dXJsID0gbmV3IFVSTCh1cmwpO1xuXG5cdC8vIDIuIElmIHVybCdzIHNjaGVtZSBpcyBhIGxvY2FsIHNjaGVtZSwgdGhlbiByZXR1cm4gbm8gcmVmZXJyZXIuXG5cdGlmICgvXihhYm91dHxibG9ifGRhdGEpOiQvLnRlc3QodXJsLnByb3RvY29sKSkge1xuXHRcdHJldHVybiAnbm8tcmVmZXJyZXInO1xuXHR9XG5cblx0Ly8gMy4gU2V0IHVybCdzIHVzZXJuYW1lIHRvIHRoZSBlbXB0eSBzdHJpbmcuXG5cdHVybC51c2VybmFtZSA9ICcnO1xuXG5cdC8vIDQuIFNldCB1cmwncyBwYXNzd29yZCB0byBudWxsLlxuXHQvLyBOb3RlOiBgbnVsbGAgYXBwZWFycyB0byBiZSBhIG1pc3Rha2UgYXMgdGhpcyBhY3R1YWxseSByZXN1bHRzIGluIHRoZSBwYXNzd29yZCBiZWluZyBgXCJudWxsXCJgLlxuXHR1cmwucGFzc3dvcmQgPSAnJztcblxuXHQvLyA1LiBTZXQgdXJsJ3MgZnJhZ21lbnQgdG8gbnVsbC5cblx0Ly8gTm90ZTogYG51bGxgIGFwcGVhcnMgdG8gYmUgYSBtaXN0YWtlIGFzIHRoaXMgYWN0dWFsbHkgcmVzdWx0cyBpbiB0aGUgZnJhZ21lbnQgYmVpbmcgYFwiI251bGxcImAuXG5cdHVybC5oYXNoID0gJyc7XG5cblx0Ly8gNi4gSWYgdGhlIG9yaWdpbi1vbmx5IGZsYWcgaXMgdHJ1ZSwgdGhlbjpcblx0aWYgKG9yaWdpbk9ubHkpIHtcblx0XHQvLyA2LjEuIFNldCB1cmwncyBwYXRoIHRvIG51bGwuXG5cdFx0Ly8gTm90ZTogYG51bGxgIGFwcGVhcnMgdG8gYmUgYSBtaXN0YWtlIGFzIHRoaXMgYWN0dWFsbHkgcmVzdWx0cyBpbiB0aGUgcGF0aCBiZWluZyBgXCIvbnVsbFwiYC5cblx0XHR1cmwucGF0aG5hbWUgPSAnJztcblxuXHRcdC8vIDYuMi4gU2V0IHVybCdzIHF1ZXJ5IHRvIG51bGwuXG5cdFx0Ly8gTm90ZTogYG51bGxgIGFwcGVhcnMgdG8gYmUgYSBtaXN0YWtlIGFzIHRoaXMgYWN0dWFsbHkgcmVzdWx0cyBpbiB0aGUgcXVlcnkgYmVpbmcgYFwiP251bGxcImAuXG5cdFx0dXJsLnNlYXJjaCA9ICcnO1xuXHR9XG5cblx0Ly8gNy4gUmV0dXJuIHVybC5cblx0cmV0dXJuIHVybDtcbn1cblxuLyoqXG4gKiBAc2VlIHtAbGluayBodHRwczovL3czYy5naXRodWIuaW8vd2ViYXBwc2VjLXJlZmVycmVyLXBvbGljeS8jZW51bWRlZi1yZWZlcnJlcnBvbGljeXxlbnVtIFJlZmVycmVyUG9saWN5fVxuICovXG5leHBvcnQgY29uc3QgUmVmZXJyZXJQb2xpY3kgPSBuZXcgU2V0KFtcblx0JycsXG5cdCduby1yZWZlcnJlcicsXG5cdCduby1yZWZlcnJlci13aGVuLWRvd25ncmFkZScsXG5cdCdzYW1lLW9yaWdpbicsXG5cdCdvcmlnaW4nLFxuXHQnc3RyaWN0LW9yaWdpbicsXG5cdCdvcmlnaW4td2hlbi1jcm9zcy1vcmlnaW4nLFxuXHQnc3RyaWN0LW9yaWdpbi13aGVuLWNyb3NzLW9yaWdpbicsXG5cdCd1bnNhZmUtdXJsJ1xuXSk7XG5cbi8qKlxuICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93M2MuZ2l0aHViLmlvL3dlYmFwcHNlYy1yZWZlcnJlci1wb2xpY3kvI2RlZmF1bHQtcmVmZXJyZXItcG9saWN5fGRlZmF1bHQgcmVmZXJyZXIgcG9saWN5fVxuICovXG5leHBvcnQgY29uc3QgREVGQVVMVF9SRUZFUlJFUl9QT0xJQ1kgPSAnc3RyaWN0LW9yaWdpbi13aGVuLWNyb3NzLW9yaWdpbic7XG5cbi8qKlxuICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93M2MuZ2l0aHViLmlvL3dlYmFwcHNlYy1yZWZlcnJlci1wb2xpY3kvI3JlZmVycmVyLXBvbGljaWVzfFJlZmVycmVyIFBvbGljeSBcdTAwQTczLiBSZWZlcnJlciBQb2xpY2llc31cbiAqIEBwYXJhbSB7c3RyaW5nfSByZWZlcnJlclBvbGljeVxuICogQHJldHVybnMge3N0cmluZ30gcmVmZXJyZXJQb2xpY3lcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlUmVmZXJyZXJQb2xpY3kocmVmZXJyZXJQb2xpY3kpIHtcblx0aWYgKCFSZWZlcnJlclBvbGljeS5oYXMocmVmZXJyZXJQb2xpY3kpKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihgSW52YWxpZCByZWZlcnJlclBvbGljeTogJHtyZWZlcnJlclBvbGljeX1gKTtcblx0fVxuXG5cdHJldHVybiByZWZlcnJlclBvbGljeTtcbn1cblxuLyoqXG4gKiBAc2VlIHtAbGluayBodHRwczovL3czYy5naXRodWIuaW8vd2ViYXBwc2VjLXNlY3VyZS1jb250ZXh0cy8jaXMtb3JpZ2luLXRydXN0d29ydGh5fFJlZmVycmVyIFBvbGljeSBcdTAwQTczLjIuIElzIG9yaWdpbiBwb3RlbnRpYWxseSB0cnVzdHdvcnRoeT99XG4gKiBAcGFyYW0ge2V4dGVybmFsOlVSTH0gdXJsXG4gKiBAcmV0dXJucyBgdHJ1ZWA6IFwiUG90ZW50aWFsbHkgVHJ1c3R3b3J0aHlcIiwgYGZhbHNlYDogXCJOb3QgVHJ1c3R3b3J0aHlcIlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNPcmlnaW5Qb3RlbnRpYWxseVRydXN0d29ydGh5KHVybCkge1xuXHQvLyAxLiBJZiBvcmlnaW4gaXMgYW4gb3BhcXVlIG9yaWdpbiwgcmV0dXJuIFwiTm90IFRydXN0d29ydGh5XCIuXG5cdC8vIE5vdCBhcHBsaWNhYmxlXG5cblx0Ly8gMi4gQXNzZXJ0OiBvcmlnaW4gaXMgYSB0dXBsZSBvcmlnaW4uXG5cdC8vIE5vdCBmb3IgaW1wbGVtZW50YXRpb25zXG5cblx0Ly8gMy4gSWYgb3JpZ2luJ3Mgc2NoZW1lIGlzIGVpdGhlciBcImh0dHBzXCIgb3IgXCJ3c3NcIiwgcmV0dXJuIFwiUG90ZW50aWFsbHkgVHJ1c3R3b3J0aHlcIi5cblx0aWYgKC9eKGh0dHB8d3MpczokLy50ZXN0KHVybC5wcm90b2NvbCkpIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdC8vIDQuIElmIG9yaWdpbidzIGhvc3QgY29tcG9uZW50IG1hdGNoZXMgb25lIG9mIHRoZSBDSURSIG5vdGF0aW9ucyAxMjcuMC4wLjAvOCBvciA6OjEvMTI4IFtSRkM0NjMyXSwgcmV0dXJuIFwiUG90ZW50aWFsbHkgVHJ1c3R3b3J0aHlcIi5cblx0Y29uc3QgaG9zdElwID0gdXJsLmhvc3QucmVwbGFjZSgvKF5cXFspfChdJCkvZywgJycpO1xuXHRjb25zdCBob3N0SVBWZXJzaW9uID0gaXNJUChob3N0SXApO1xuXG5cdGlmIChob3N0SVBWZXJzaW9uID09PSA0ICYmIC9eMTI3XFwuLy50ZXN0KGhvc3RJcCkpIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdGlmIChob3N0SVBWZXJzaW9uID09PSA2ICYmIC9eKCgoMCs6KXs3fSl8KDo6KDArOil7MCw2fSkpMCoxJC8udGVzdChob3N0SXApKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvLyA1LiBJZiBvcmlnaW4ncyBob3N0IGNvbXBvbmVudCBpcyBcImxvY2FsaG9zdFwiIG9yIGZhbGxzIHdpdGhpbiBcIi5sb2NhbGhvc3RcIiwgYW5kIHRoZSB1c2VyIGFnZW50IGNvbmZvcm1zIHRvIHRoZSBuYW1lIHJlc29sdXRpb24gcnVsZXMgaW4gW2xldC1sb2NhbGhvc3QtYmUtbG9jYWxob3N0XSwgcmV0dXJuIFwiUG90ZW50aWFsbHkgVHJ1c3R3b3J0aHlcIi5cblx0Ly8gV2UgYXJlIHJldHVybmluZyBGQUxTRSBoZXJlIGJlY2F1c2Ugd2UgY2Fubm90IGVuc3VyZSBjb25mb3JtYW5jZSB0b1xuXHQvLyBsZXQtbG9jYWxob3N0LWJlLWxvYWxob3N0IChodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvZHJhZnQtd2VzdC1sZXQtbG9jYWxob3N0LWJlLWxvY2FsaG9zdClcblx0aWYgKHVybC5ob3N0ID09PSAnbG9jYWxob3N0JyB8fCB1cmwuaG9zdC5lbmRzV2l0aCgnLmxvY2FsaG9zdCcpKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0Ly8gNi4gSWYgb3JpZ2luJ3Mgc2NoZW1lIGNvbXBvbmVudCBpcyBmaWxlLCByZXR1cm4gXCJQb3RlbnRpYWxseSBUcnVzdHdvcnRoeVwiLlxuXHRpZiAodXJsLnByb3RvY29sID09PSAnZmlsZTonKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvLyA3LiBJZiBvcmlnaW4ncyBzY2hlbWUgY29tcG9uZW50IGlzIG9uZSB3aGljaCB0aGUgdXNlciBhZ2VudCBjb25zaWRlcnMgdG8gYmUgYXV0aGVudGljYXRlZCwgcmV0dXJuIFwiUG90ZW50aWFsbHkgVHJ1c3R3b3J0aHlcIi5cblx0Ly8gTm90IHN1cHBvcnRlZFxuXG5cdC8vIDguIElmIG9yaWdpbiBoYXMgYmVlbiBjb25maWd1cmVkIGFzIGEgdHJ1c3R3b3J0aHkgb3JpZ2luLCByZXR1cm4gXCJQb3RlbnRpYWxseSBUcnVzdHdvcnRoeVwiLlxuXHQvLyBOb3Qgc3VwcG9ydGVkXG5cblx0Ly8gOS4gUmV0dXJuIFwiTm90IFRydXN0d29ydGh5XCIuXG5cdHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBAc2VlIHtAbGluayBodHRwczovL3czYy5naXRodWIuaW8vd2ViYXBwc2VjLXNlY3VyZS1jb250ZXh0cy8jaXMtdXJsLXRydXN0d29ydGh5fFJlZmVycmVyIFBvbGljeSBcdTAwQTczLjMuIElzIHVybCBwb3RlbnRpYWxseSB0cnVzdHdvcnRoeT99XG4gKiBAcGFyYW0ge2V4dGVybmFsOlVSTH0gdXJsXG4gKiBAcmV0dXJucyBgdHJ1ZWA6IFwiUG90ZW50aWFsbHkgVHJ1c3R3b3J0aHlcIiwgYGZhbHNlYDogXCJOb3QgVHJ1c3R3b3J0aHlcIlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNVcmxQb3RlbnRpYWxseVRydXN0d29ydGh5KHVybCkge1xuXHQvLyAxLiBJZiB1cmwgaXMgXCJhYm91dDpibGFua1wiIG9yIFwiYWJvdXQ6c3JjZG9jXCIsIHJldHVybiBcIlBvdGVudGlhbGx5IFRydXN0d29ydGh5XCIuXG5cdGlmICgvXmFib3V0OihibGFua3xzcmNkb2MpJC8udGVzdCh1cmwpKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvLyAyLiBJZiB1cmwncyBzY2hlbWUgaXMgXCJkYXRhXCIsIHJldHVybiBcIlBvdGVudGlhbGx5IFRydXN0d29ydGh5XCIuXG5cdGlmICh1cmwucHJvdG9jb2wgPT09ICdkYXRhOicpIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdC8vIE5vdGU6IFRoZSBvcmlnaW4gb2YgYmxvYjogYW5kIGZpbGVzeXN0ZW06IFVSTHMgaXMgdGhlIG9yaWdpbiBvZiB0aGUgY29udGV4dCBpbiB3aGljaCB0aGV5IHdlcmVcblx0Ly8gY3JlYXRlZC4gVGhlcmVmb3JlLCBibG9icyBjcmVhdGVkIGluIGEgdHJ1c3R3b3J0aHkgb3JpZ2luIHdpbGwgdGhlbXNlbHZlcyBiZSBwb3RlbnRpYWxseVxuXHQvLyB0cnVzdHdvcnRoeS5cblx0aWYgKC9eKGJsb2J8ZmlsZXN5c3RlbSk6JC8udGVzdCh1cmwucHJvdG9jb2wpKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvLyAzLiBSZXR1cm4gdGhlIHJlc3VsdCBvZiBleGVjdXRpbmcgXHUwMEE3My4yIElzIG9yaWdpbiBwb3RlbnRpYWxseSB0cnVzdHdvcnRoeT8gb24gdXJsJ3Mgb3JpZ2luLlxuXHRyZXR1cm4gaXNPcmlnaW5Qb3RlbnRpYWxseVRydXN0d29ydGh5KHVybCk7XG59XG5cbi8qKlxuICogTW9kaWZpZXMgdGhlIHJlZmVycmVyVVJMIHRvIGVuZm9yY2UgYW55IGV4dHJhIHNlY3VyaXR5IHBvbGljeSBjb25zaWRlcmF0aW9ucy5cbiAqIEBzZWUge0BsaW5rIGh0dHBzOi8vdzNjLmdpdGh1Yi5pby93ZWJhcHBzZWMtcmVmZXJyZXItcG9saWN5LyNkZXRlcm1pbmUtcmVxdWVzdHMtcmVmZXJyZXJ8UmVmZXJyZXIgUG9saWN5IFx1MDBBNzguMy4gRGV0ZXJtaW5lIHJlcXVlc3QncyBSZWZlcnJlcn0sIHN0ZXAgN1xuICogQGNhbGxiYWNrIG1vZHVsZTp1dGlscy9yZWZlcnJlcn5yZWZlcnJlclVSTENhbGxiYWNrXG4gKiBAcGFyYW0ge2V4dGVybmFsOlVSTH0gcmVmZXJyZXJVUkxcbiAqIEByZXR1cm5zIHtleHRlcm5hbDpVUkx9IG1vZGlmaWVkIHJlZmVycmVyVVJMXG4gKi9cblxuLyoqXG4gKiBNb2RpZmllcyB0aGUgcmVmZXJyZXJPcmlnaW4gdG8gZW5mb3JjZSBhbnkgZXh0cmEgc2VjdXJpdHkgcG9saWN5IGNvbnNpZGVyYXRpb25zLlxuICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93M2MuZ2l0aHViLmlvL3dlYmFwcHNlYy1yZWZlcnJlci1wb2xpY3kvI2RldGVybWluZS1yZXF1ZXN0cy1yZWZlcnJlcnxSZWZlcnJlciBQb2xpY3kgXHUwMEE3OC4zLiBEZXRlcm1pbmUgcmVxdWVzdCdzIFJlZmVycmVyfSwgc3RlcCA3XG4gKiBAY2FsbGJhY2sgbW9kdWxlOnV0aWxzL3JlZmVycmVyfnJlZmVycmVyT3JpZ2luQ2FsbGJhY2tcbiAqIEBwYXJhbSB7ZXh0ZXJuYWw6VVJMfSByZWZlcnJlck9yaWdpblxuICogQHJldHVybnMge2V4dGVybmFsOlVSTH0gbW9kaWZpZWQgcmVmZXJyZXJPcmlnaW5cbiAqL1xuXG4vKipcbiAqIEBzZWUge0BsaW5rIGh0dHBzOi8vdzNjLmdpdGh1Yi5pby93ZWJhcHBzZWMtcmVmZXJyZXItcG9saWN5LyNkZXRlcm1pbmUtcmVxdWVzdHMtcmVmZXJyZXJ8UmVmZXJyZXIgUG9saWN5IFx1MDBBNzguMy4gRGV0ZXJtaW5lIHJlcXVlc3QncyBSZWZlcnJlcn1cbiAqIEBwYXJhbSB7UmVxdWVzdH0gcmVxdWVzdFxuICogQHBhcmFtIHtvYmplY3R9IG9cbiAqIEBwYXJhbSB7bW9kdWxlOnV0aWxzL3JlZmVycmVyfnJlZmVycmVyVVJMQ2FsbGJhY2t9IG8ucmVmZXJyZXJVUkxDYWxsYmFja1xuICogQHBhcmFtIHttb2R1bGU6dXRpbHMvcmVmZXJyZXJ+cmVmZXJyZXJPcmlnaW5DYWxsYmFja30gby5yZWZlcnJlck9yaWdpbkNhbGxiYWNrXG4gKiBAcmV0dXJucyB7ZXh0ZXJuYWw6VVJMfSBSZXF1ZXN0J3MgcmVmZXJyZXJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRldGVybWluZVJlcXVlc3RzUmVmZXJyZXIocmVxdWVzdCwge3JlZmVycmVyVVJMQ2FsbGJhY2ssIHJlZmVycmVyT3JpZ2luQ2FsbGJhY2t9ID0ge30pIHtcblx0Ly8gVGhlcmUgYXJlIDIgbm90ZXMgaW4gdGhlIHNwZWNpZmljYXRpb24gYWJvdXQgaW52YWxpZCBwcmUtY29uZGl0aW9ucy4gIFdlIHJldHVybiBudWxsLCBoZXJlLCBmb3Jcblx0Ly8gdGhlc2UgY2FzZXM6XG5cdC8vID4gTm90ZTogSWYgcmVxdWVzdCdzIHJlZmVycmVyIGlzIFwibm8tcmVmZXJyZXJcIiwgRmV0Y2ggd2lsbCBub3QgY2FsbCBpbnRvIHRoaXMgYWxnb3JpdGhtLlxuXHQvLyA+IE5vdGU6IElmIHJlcXVlc3QncyByZWZlcnJlciBwb2xpY3kgaXMgdGhlIGVtcHR5IHN0cmluZywgRmV0Y2ggd2lsbCBub3QgY2FsbCBpbnRvIHRoaXNcblx0Ly8gPiBhbGdvcml0aG0uXG5cdGlmIChyZXF1ZXN0LnJlZmVycmVyID09PSAnbm8tcmVmZXJyZXInIHx8IHJlcXVlc3QucmVmZXJyZXJQb2xpY3kgPT09ICcnKSB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHQvLyAxLiBMZXQgcG9saWN5IGJlIHJlcXVlc3QncyBhc3NvY2lhdGVkIHJlZmVycmVyIHBvbGljeS5cblx0Y29uc3QgcG9saWN5ID0gcmVxdWVzdC5yZWZlcnJlclBvbGljeTtcblxuXHQvLyAyLiBMZXQgZW52aXJvbm1lbnQgYmUgcmVxdWVzdCdzIGNsaWVudC5cblx0Ly8gbm90IGFwcGxpY2FibGUgdG8gbm9kZS5qc1xuXG5cdC8vIDMuIFN3aXRjaCBvbiByZXF1ZXN0J3MgcmVmZXJyZXI6XG5cdGlmIChyZXF1ZXN0LnJlZmVycmVyID09PSAnYWJvdXQ6Y2xpZW50Jykge1xuXHRcdHJldHVybiAnbm8tcmVmZXJyZXInO1xuXHR9XG5cblx0Ly8gXCJhIFVSTFwiOiBMZXQgcmVmZXJyZXJTb3VyY2UgYmUgcmVxdWVzdCdzIHJlZmVycmVyLlxuXHRjb25zdCByZWZlcnJlclNvdXJjZSA9IHJlcXVlc3QucmVmZXJyZXI7XG5cblx0Ly8gNC4gTGV0IHJlcXVlc3QncyByZWZlcnJlclVSTCBiZSB0aGUgcmVzdWx0IG9mIHN0cmlwcGluZyByZWZlcnJlclNvdXJjZSBmb3IgdXNlIGFzIGEgcmVmZXJyZXIuXG5cdGxldCByZWZlcnJlclVSTCA9IHN0cmlwVVJMRm9yVXNlQXNBUmVmZXJyZXIocmVmZXJyZXJTb3VyY2UpO1xuXG5cdC8vIDUuIExldCByZWZlcnJlck9yaWdpbiBiZSB0aGUgcmVzdWx0IG9mIHN0cmlwcGluZyByZWZlcnJlclNvdXJjZSBmb3IgdXNlIGFzIGEgcmVmZXJyZXIsIHdpdGggdGhlXG5cdC8vICAgIG9yaWdpbi1vbmx5IGZsYWcgc2V0IHRvIHRydWUuXG5cdGxldCByZWZlcnJlck9yaWdpbiA9IHN0cmlwVVJMRm9yVXNlQXNBUmVmZXJyZXIocmVmZXJyZXJTb3VyY2UsIHRydWUpO1xuXG5cdC8vIDYuIElmIHRoZSByZXN1bHQgb2Ygc2VyaWFsaXppbmcgcmVmZXJyZXJVUkwgaXMgYSBzdHJpbmcgd2hvc2UgbGVuZ3RoIGlzIGdyZWF0ZXIgdGhhbiA0MDk2LCBzZXRcblx0Ly8gICAgcmVmZXJyZXJVUkwgdG8gcmVmZXJyZXJPcmlnaW4uXG5cdGlmIChyZWZlcnJlclVSTC50b1N0cmluZygpLmxlbmd0aCA+IDQwOTYpIHtcblx0XHRyZWZlcnJlclVSTCA9IHJlZmVycmVyT3JpZ2luO1xuXHR9XG5cblx0Ly8gNy4gVGhlIHVzZXIgYWdlbnQgTUFZIGFsdGVyIHJlZmVycmVyVVJMIG9yIHJlZmVycmVyT3JpZ2luIGF0IHRoaXMgcG9pbnQgdG8gZW5mb3JjZSBhcmJpdHJhcnlcblx0Ly8gICAgcG9saWN5IGNvbnNpZGVyYXRpb25zIGluIHRoZSBpbnRlcmVzdHMgb2YgbWluaW1pemluZyBkYXRhIGxlYWthZ2UuIEZvciBleGFtcGxlLCB0aGUgdXNlclxuXHQvLyAgICBhZ2VudCBjb3VsZCBzdHJpcCB0aGUgVVJMIGRvd24gdG8gYW4gb3JpZ2luLCBtb2RpZnkgaXRzIGhvc3QsIHJlcGxhY2UgaXQgd2l0aCBhbiBlbXB0eVxuXHQvLyAgICBzdHJpbmcsIGV0Yy5cblx0aWYgKHJlZmVycmVyVVJMQ2FsbGJhY2spIHtcblx0XHRyZWZlcnJlclVSTCA9IHJlZmVycmVyVVJMQ2FsbGJhY2socmVmZXJyZXJVUkwpO1xuXHR9XG5cblx0aWYgKHJlZmVycmVyT3JpZ2luQ2FsbGJhY2spIHtcblx0XHRyZWZlcnJlck9yaWdpbiA9IHJlZmVycmVyT3JpZ2luQ2FsbGJhY2socmVmZXJyZXJPcmlnaW4pO1xuXHR9XG5cblx0Ly8gOC5FeGVjdXRlIHRoZSBzdGF0ZW1lbnRzIGNvcnJlc3BvbmRpbmcgdG8gdGhlIHZhbHVlIG9mIHBvbGljeTpcblx0Y29uc3QgY3VycmVudFVSTCA9IG5ldyBVUkwocmVxdWVzdC51cmwpO1xuXG5cdHN3aXRjaCAocG9saWN5KSB7XG5cdFx0Y2FzZSAnbm8tcmVmZXJyZXInOlxuXHRcdFx0cmV0dXJuICduby1yZWZlcnJlcic7XG5cblx0XHRjYXNlICdvcmlnaW4nOlxuXHRcdFx0cmV0dXJuIHJlZmVycmVyT3JpZ2luO1xuXG5cdFx0Y2FzZSAndW5zYWZlLXVybCc6XG5cdFx0XHRyZXR1cm4gcmVmZXJyZXJVUkw7XG5cblx0XHRjYXNlICdzdHJpY3Qtb3JpZ2luJzpcblx0XHRcdC8vIDEuIElmIHJlZmVycmVyVVJMIGlzIGEgcG90ZW50aWFsbHkgdHJ1c3R3b3J0aHkgVVJMIGFuZCByZXF1ZXN0J3MgY3VycmVudCBVUkwgaXMgbm90IGFcblx0XHRcdC8vICAgIHBvdGVudGlhbGx5IHRydXN0d29ydGh5IFVSTCwgdGhlbiByZXR1cm4gbm8gcmVmZXJyZXIuXG5cdFx0XHRpZiAoaXNVcmxQb3RlbnRpYWxseVRydXN0d29ydGh5KHJlZmVycmVyVVJMKSAmJiAhaXNVcmxQb3RlbnRpYWxseVRydXN0d29ydGh5KGN1cnJlbnRVUkwpKSB7XG5cdFx0XHRcdHJldHVybiAnbm8tcmVmZXJyZXInO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyAyLiBSZXR1cm4gcmVmZXJyZXJPcmlnaW4uXG5cdFx0XHRyZXR1cm4gcmVmZXJyZXJPcmlnaW4udG9TdHJpbmcoKTtcblxuXHRcdGNhc2UgJ3N0cmljdC1vcmlnaW4td2hlbi1jcm9zcy1vcmlnaW4nOlxuXHRcdFx0Ly8gMS4gSWYgdGhlIG9yaWdpbiBvZiByZWZlcnJlclVSTCBhbmQgdGhlIG9yaWdpbiBvZiByZXF1ZXN0J3MgY3VycmVudCBVUkwgYXJlIHRoZSBzYW1lLCB0aGVuXG5cdFx0XHQvLyAgICByZXR1cm4gcmVmZXJyZXJVUkwuXG5cdFx0XHRpZiAocmVmZXJyZXJVUkwub3JpZ2luID09PSBjdXJyZW50VVJMLm9yaWdpbikge1xuXHRcdFx0XHRyZXR1cm4gcmVmZXJyZXJVUkw7XG5cdFx0XHR9XG5cblx0XHRcdC8vIDIuIElmIHJlZmVycmVyVVJMIGlzIGEgcG90ZW50aWFsbHkgdHJ1c3R3b3J0aHkgVVJMIGFuZCByZXF1ZXN0J3MgY3VycmVudCBVUkwgaXMgbm90IGFcblx0XHRcdC8vICAgIHBvdGVudGlhbGx5IHRydXN0d29ydGh5IFVSTCwgdGhlbiByZXR1cm4gbm8gcmVmZXJyZXIuXG5cdFx0XHRpZiAoaXNVcmxQb3RlbnRpYWxseVRydXN0d29ydGh5KHJlZmVycmVyVVJMKSAmJiAhaXNVcmxQb3RlbnRpYWxseVRydXN0d29ydGh5KGN1cnJlbnRVUkwpKSB7XG5cdFx0XHRcdHJldHVybiAnbm8tcmVmZXJyZXInO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyAzLiBSZXR1cm4gcmVmZXJyZXJPcmlnaW4uXG5cdFx0XHRyZXR1cm4gcmVmZXJyZXJPcmlnaW47XG5cblx0XHRjYXNlICdzYW1lLW9yaWdpbic6XG5cdFx0XHQvLyAxLiBJZiB0aGUgb3JpZ2luIG9mIHJlZmVycmVyVVJMIGFuZCB0aGUgb3JpZ2luIG9mIHJlcXVlc3QncyBjdXJyZW50IFVSTCBhcmUgdGhlIHNhbWUsIHRoZW5cblx0XHRcdC8vICAgIHJldHVybiByZWZlcnJlclVSTC5cblx0XHRcdGlmIChyZWZlcnJlclVSTC5vcmlnaW4gPT09IGN1cnJlbnRVUkwub3JpZ2luKSB7XG5cdFx0XHRcdHJldHVybiByZWZlcnJlclVSTDtcblx0XHRcdH1cblxuXHRcdFx0Ly8gMi4gUmV0dXJuIG5vIHJlZmVycmVyLlxuXHRcdFx0cmV0dXJuICduby1yZWZlcnJlcic7XG5cblx0XHRjYXNlICdvcmlnaW4td2hlbi1jcm9zcy1vcmlnaW4nOlxuXHRcdFx0Ly8gMS4gSWYgdGhlIG9yaWdpbiBvZiByZWZlcnJlclVSTCBhbmQgdGhlIG9yaWdpbiBvZiByZXF1ZXN0J3MgY3VycmVudCBVUkwgYXJlIHRoZSBzYW1lLCB0aGVuXG5cdFx0XHQvLyAgICByZXR1cm4gcmVmZXJyZXJVUkwuXG5cdFx0XHRpZiAocmVmZXJyZXJVUkwub3JpZ2luID09PSBjdXJyZW50VVJMLm9yaWdpbikge1xuXHRcdFx0XHRyZXR1cm4gcmVmZXJyZXJVUkw7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFJldHVybiByZWZlcnJlck9yaWdpbi5cblx0XHRcdHJldHVybiByZWZlcnJlck9yaWdpbjtcblxuXHRcdGNhc2UgJ25vLXJlZmVycmVyLXdoZW4tZG93bmdyYWRlJzpcblx0XHRcdC8vIDEuIElmIHJlZmVycmVyVVJMIGlzIGEgcG90ZW50aWFsbHkgdHJ1c3R3b3J0aHkgVVJMIGFuZCByZXF1ZXN0J3MgY3VycmVudCBVUkwgaXMgbm90IGFcblx0XHRcdC8vICAgIHBvdGVudGlhbGx5IHRydXN0d29ydGh5IFVSTCwgdGhlbiByZXR1cm4gbm8gcmVmZXJyZXIuXG5cdFx0XHRpZiAoaXNVcmxQb3RlbnRpYWxseVRydXN0d29ydGh5KHJlZmVycmVyVVJMKSAmJiAhaXNVcmxQb3RlbnRpYWxseVRydXN0d29ydGh5KGN1cnJlbnRVUkwpKSB7XG5cdFx0XHRcdHJldHVybiAnbm8tcmVmZXJyZXInO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyAyLiBSZXR1cm4gcmVmZXJyZXJVUkwuXG5cdFx0XHRyZXR1cm4gcmVmZXJyZXJVUkw7XG5cblx0XHRkZWZhdWx0OlxuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihgSW52YWxpZCByZWZlcnJlclBvbGljeTogJHtwb2xpY3l9YCk7XG5cdH1cbn1cblxuLyoqXG4gKiBAc2VlIHtAbGluayBodHRwczovL3czYy5naXRodWIuaW8vd2ViYXBwc2VjLXJlZmVycmVyLXBvbGljeS8jcGFyc2UtcmVmZXJyZXItcG9saWN5LWZyb20taGVhZGVyfFJlZmVycmVyIFBvbGljeSBcdTAwQTc4LjEuIFBhcnNlIGEgcmVmZXJyZXIgcG9saWN5IGZyb20gYSBSZWZlcnJlci1Qb2xpY3kgaGVhZGVyfVxuICogQHBhcmFtIHtIZWFkZXJzfSBoZWFkZXJzIFJlc3BvbnNlIGhlYWRlcnNcbiAqIEByZXR1cm5zIHtzdHJpbmd9IHBvbGljeVxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VSZWZlcnJlclBvbGljeUZyb21IZWFkZXIoaGVhZGVycykge1xuXHQvLyAxLiBMZXQgcG9saWN5LXRva2VucyBiZSB0aGUgcmVzdWx0IG9mIGV4dHJhY3RpbmcgaGVhZGVyIGxpc3QgdmFsdWVzIGdpdmVuIGBSZWZlcnJlci1Qb2xpY3lgXG5cdC8vICAgIGFuZCByZXNwb25zZVx1MjAxOXMgaGVhZGVyIGxpc3QuXG5cdGNvbnN0IHBvbGljeVRva2VucyA9IChoZWFkZXJzLmdldCgncmVmZXJyZXItcG9saWN5JykgfHwgJycpLnNwbGl0KC9bLFxcc10rLyk7XG5cblx0Ly8gMi4gTGV0IHBvbGljeSBiZSB0aGUgZW1wdHkgc3RyaW5nLlxuXHRsZXQgcG9saWN5ID0gJyc7XG5cblx0Ly8gMy4gRm9yIGVhY2ggdG9rZW4gaW4gcG9saWN5LXRva2VucywgaWYgdG9rZW4gaXMgYSByZWZlcnJlciBwb2xpY3kgYW5kIHRva2VuIGlzIG5vdCB0aGUgZW1wdHlcblx0Ly8gICAgc3RyaW5nLCB0aGVuIHNldCBwb2xpY3kgdG8gdG9rZW4uXG5cdC8vIE5vdGU6IFRoaXMgYWxnb3JpdGhtIGxvb3BzIG92ZXIgbXVsdGlwbGUgcG9saWN5IHZhbHVlcyB0byBhbGxvdyBkZXBsb3ltZW50IG9mIG5ldyBwb2xpY3lcblx0Ly8gdmFsdWVzIHdpdGggZmFsbGJhY2tzIGZvciBvbGRlciB1c2VyIGFnZW50cywgYXMgZGVzY3JpYmVkIGluIFx1MDBBNyAxMS4xIFVua25vd24gUG9saWN5IFZhbHVlcy5cblx0Zm9yIChjb25zdCB0b2tlbiBvZiBwb2xpY3lUb2tlbnMpIHtcblx0XHRpZiAodG9rZW4gJiYgUmVmZXJyZXJQb2xpY3kuaGFzKHRva2VuKSkge1xuXHRcdFx0cG9saWN5ID0gdG9rZW47XG5cdFx0fVxuXHR9XG5cblx0Ly8gNC4gUmV0dXJuIHBvbGljeS5cblx0cmV0dXJuIHBvbGljeTtcbn1cbiIsICJpbXBvcnQge0ZldGNoQmFzZUVycm9yfSBmcm9tICcuL2Jhc2UuanMnO1xuXG4vKipcbiAqIEFib3J0RXJyb3IgaW50ZXJmYWNlIGZvciBjYW5jZWxsZWQgcmVxdWVzdHNcbiAqL1xuZXhwb3J0IGNsYXNzIEFib3J0RXJyb3IgZXh0ZW5kcyBGZXRjaEJhc2VFcnJvciB7XG5cdGNvbnN0cnVjdG9yKG1lc3NhZ2UsIHR5cGUgPSAnYWJvcnRlZCcpIHtcblx0XHRzdXBlcihtZXNzYWdlLCB0eXBlKTtcblx0fVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2VBQWdCQSxRQUFJO0FBQ2xCLGVBQU87TUFDVDtBQ0NNLGVBQVUsYUFBYUMsSUFBTTtBQUNqQyxlQUFRLE9BQU9BLE9BQU0sWUFBWUEsT0FBTSxRQUFTLE9BQU9BLE9BQU07TUFDL0Q7QUFFTyxZQUFNLGlDQVVQRDtBQUVVLGVBQUEsZ0JBQWdCLElBQWMsTUFBWTtBQUN4RCxZQUFJO0FBQ0YsaUJBQU8sZUFBZSxJQUFJLFFBQVE7WUFDaEMsT0FBTztZQUNQLGNBQWM7VUFDZixDQUFBO2lCQUNERSxLQUFNOztNQUlWO0FDMUJBLFlBQU0sa0JBQWtCO0FBQ3hCLFlBQU0s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QU87QUFDbEM7IiwKICAibmFtZXMiOiBbIm5vb3AiLCAieCIsICJfYSIsICJGIiwgImkiLCAiZSIsICJxdWV1ZU1pY3JvdGFzayIsICJyIiwgImlzQWJvcnRTaWduYWwiLCAic3RyZWFtQnJhbmRDaGVja0V4Y2VwdGlvbiIsICJkZWZhdWx0Q29udHJvbGxlckJyYW5kQ2hlY2tFeGNlcHRpb24iLCAiRE9NRXhjZXB0aW9uIiwgIlJlYWRhYmxlU3RyZWFtIiwgIlBPT0xfU0laRSIsICJwcm9jZXNzIiwgIkJsb2IiLCAiY2xvbmUiLCAiQmxvYiIsICJzaXplIiwgIkZpbGUiLCAiRiIsICJmIiwgImUiLCAiRm9ybURhdGEiLCAibSIsICJleHBvcnRzIiwgIm1vZHVsZSIsICJmcyIsICJtIiwgIkJvZHkiLCAiZiIsICJpIiwgImNsZWFyIiwgImltcG9ydF9ub2RlX2h0dHAiLCAiaW1wb3J0X25vZGVfc3RyZWFtIiwgImltcG9ydF9ub2RlX2J1ZmZlciIsICJpIiwgIlN0cmVhbSIsICJ0b0Zvcm1EYXRhIiwgImltcG9ydF9ub2RlX3V0aWwiLCAiaHR0cCIsICJJTlRFUk5BTFMiLCAiaW1wb3J0X25vZGVfdXRpbCIsICJJTlRFUk5BTFMiLCAiZm9ybWF0VXJsIiwgInJlc3BvbnNlIiwgImh0dHBzIiwgImh0dHAiLCAiU3RyZWFtIiwgInMiLCAicHVtcCIsICJ6bGliIiwgImUiLCAiaCIsICJtIl0KfQo=
