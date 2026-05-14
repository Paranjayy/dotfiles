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

// src/stats.tsx
var stats_exports = {};
__export(stats_exports, {
  default: () => Command
});
module.exports = __toCommonJS(stats_exports);
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

// src/stats.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function Command() {
  const [data, setData] = (0, import_react.useState)(null);
  const [isLoading, setIsLoading] = (0, import_react.useState)(true);
  (0, import_react.useEffect)(() => {
    async function fetchStats() {
      try {
        const response = await fetch("http://localhost:3030/status");
        const json = await response.json();
        setData(json);
      } catch (e2) {
        console.error(e2);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);
  const markdown = data ? `
# \u{1F30C} Gravity Hub Dashboard

### \u2744\uFE0F Climate
- **AC Status**: ${data.stats.ac?.status?.toUpperCase() || "OFF"}
- **Current Load**: ${data.stats.acMinutes || 0} mins
- **Billing Units**: ${data.units || 0} kWh

### \u{1F4A1} Illumination
- **Lights**: ${data.stats.light?.status?.toUpperCase() || "OFF"}
- **Session Duration**: ${data.stats.lightMinutes || 0} mins

### \u2699\uFE0F System Health
- **Uptime**: ${Math.floor(data.uptime / 3600)}h ${Math.floor(data.uptime % 3600 / 60)}m
- **Spotify**: ${data.spotify || "Idle"}
- **Network**: ${data.jitter ? data.jitter > 150 ? "\u26A0\uFE0F Jittery" : "\u2705 Stable" : "Unknown"}
` : "# \u274C Hub Offline";
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_api.Detail,
    {
      isLoading,
      markdown,
      metadata: data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_api.Detail.Metadata, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.Detail.Metadata.Label, { title: "Platform", icon: import_api.Icon.Computer, text: data.platform }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.Detail.Metadata.Label, { title: "Network Jitter", icon: import_api.Icon.Globe, text: `${data.jitter?.toFixed(0) || 0}ms` }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.Detail.Metadata.TagList, { title: "Power Status", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_api.Detail.Metadata.TagList.Item,
          {
            text: data.battery?.isPlugged ? "Multi-Source" : "Battery",
            color: data.battery?.isPlugged ? import_api.Color.Green : import_api.Color.Yellow
          }
        ) })
      ] })
    }
  );
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL2lmdHQvcmF5Y2FzdC1leHQvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy91dGlscy50cyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvaWZ0dC9yYXljYXN0LWV4dC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi9oZWxwZXJzL21pc2NlbGxhbmVvdXMudHMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL2lmdHQvcmF5Y2FzdC1leHQvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvaGVscGVycy93ZWJpZGwudHMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL2lmdHQvcmF5Y2FzdC1leHQvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvc2ltcGxlLXF1ZXVlLnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvbGliL2Fic3RyYWN0LW9wcy9pbnRlcm5hbC1tZXRob2RzLnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvbGliL3JlYWRhYmxlLXN0cmVhbS9nZW5lcmljLXJlYWRlci50cyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvaWZ0dC9yYXljYXN0LWV4dC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL3N0dWIvbnVtYmVyLWlzZmluaXRlLnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvc3R1Yi9tYXRoLXRydW5jLnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvbGliL3ZhbGlkYXRvcnMvYmFzaWMudHMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL2lmdHQvcmF5Y2FzdC1leHQvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvdmFsaWRhdG9ycy9yZWFkYWJsZS1zdHJlYW0udHMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL2lmdHQvcmF5Y2FzdC1leHQvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvcmVhZGFibGUtc3RyZWFtL2RlZmF1bHQtcmVhZGVyLnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvdGFyZ2V0L2VzMjAxOC9zdHViL2FzeW5jLWl0ZXJhdG9yLXByb3RvdHlwZS50cyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvaWZ0dC9yYXljYXN0LWV4dC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi9yZWFkYWJsZS1zdHJlYW0vYXN5bmMtaXRlcmF0b3IudHMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL2lmdHQvcmF5Y2FzdC1leHQvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9zdHViL251bWJlci1pc25hbi50cyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvaWZ0dC9yYXljYXN0LWV4dC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi9hYnN0cmFjdC1vcHMvZWNtYXNjcmlwdC50cyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvaWZ0dC9yYXljYXN0LWV4dC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi9hYnN0cmFjdC1vcHMvbWlzY2VsbGFuZW91cy50cyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvaWZ0dC9yYXljYXN0LWV4dC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi9hYnN0cmFjdC1vcHMvcXVldWUtd2l0aC1zaXplcy50cyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvaWZ0dC9yYXljYXN0LWV4dC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi9oZWxwZXJzL2FycmF5LWJ1ZmZlci12aWV3LnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvbGliL3JlYWRhYmxlLXN0cmVhbS9ieXRlLXN0cmVhbS1jb250cm9sbGVyLnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvbGliL3ZhbGlkYXRvcnMvcmVhZGVyLW9wdGlvbnMudHMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL2lmdHQvcmF5Y2FzdC1leHQvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvcmVhZGFibGUtc3RyZWFtL2J5b2ItcmVhZGVyLnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvbGliL2Fic3RyYWN0LW9wcy9xdWV1aW5nLXN0cmF0ZWd5LnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvbGliL3ZhbGlkYXRvcnMvcXVldWluZy1zdHJhdGVneS50cyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvaWZ0dC9yYXljYXN0LWV4dC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi92YWxpZGF0b3JzL3VuZGVybHlpbmctc2luay50cyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvaWZ0dC9yYXljYXN0LWV4dC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi92YWxpZGF0b3JzL3dyaXRhYmxlLXN0cmVhbS50cyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvaWZ0dC9yYXljYXN0LWV4dC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi9hYm9ydC1zaWduYWwudHMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL2lmdHQvcmF5Y2FzdC1leHQvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvd3JpdGFibGUtc3RyZWFtLnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvZ2xvYmFscy50cyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvaWZ0dC9yYXljYXN0LWV4dC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL3N0dWIvZG9tLWV4Y2VwdGlvbi50cyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvaWZ0dC9yYXljYXN0LWV4dC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi9yZWFkYWJsZS1zdHJlYW0vcGlwZS50cyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvaWZ0dC9yYXljYXN0LWV4dC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi9yZWFkYWJsZS1zdHJlYW0vZGVmYXVsdC1jb250cm9sbGVyLnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvbGliL3JlYWRhYmxlLXN0cmVhbS90ZWUudHMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL2lmdHQvcmF5Y2FzdC1leHQvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvcmVhZGFibGUtc3RyZWFtL3JlYWRhYmxlLXN0cmVhbS1saWtlLnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvbGliL3JlYWRhYmxlLXN0cmVhbS9mcm9tLnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvbGliL3ZhbGlkYXRvcnMvdW5kZXJseWluZy1zb3VyY2UudHMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL2lmdHQvcmF5Y2FzdC1leHQvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvdmFsaWRhdG9ycy9pdGVyYXRvci1vcHRpb25zLnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvbGliL3ZhbGlkYXRvcnMvcGlwZS1vcHRpb25zLnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvbGliL3ZhbGlkYXRvcnMvcmVhZGFibGUtd3JpdGFibGUtcGFpci50cyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvaWZ0dC9yYXljYXN0LWV4dC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi9yZWFkYWJsZS1zdHJlYW0udHMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL2lmdHQvcmF5Y2FzdC1leHQvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvdmFsaWRhdG9ycy9xdWV1aW5nLXN0cmF0ZWd5LWluaXQudHMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL2lmdHQvcmF5Y2FzdC1leHQvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvYnl0ZS1sZW5ndGgtcXVldWluZy1zdHJhdGVneS50cyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvaWZ0dC9yYXljYXN0LWV4dC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi9jb3VudC1xdWV1aW5nLXN0cmF0ZWd5LnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvbGliL3ZhbGlkYXRvcnMvdHJhbnNmb3JtZXIudHMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL2lmdHQvcmF5Y2FzdC1leHQvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvdHJhbnNmb3JtLXN0cmVhbS50cyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvaWZ0dC9yYXljYXN0LWV4dC9ub2RlX21vZHVsZXMvZmV0Y2gtYmxvYi9zdHJlYW1zLmNqcyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvaWZ0dC9yYXljYXN0LWV4dC9ub2RlX21vZHVsZXMvZmV0Y2gtYmxvYi9pbmRleC5qcyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvaWZ0dC9yYXljYXN0LWV4dC9ub2RlX21vZHVsZXMvZmV0Y2gtYmxvYi9maWxlLmpzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy9mb3JtZGF0YS1wb2x5ZmlsbC9lc20ubWluLmpzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy9ub2RlLWRvbWV4Y2VwdGlvbi9pbmRleC5qcyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvaWZ0dC9yYXljYXN0LWV4dC9ub2RlX21vZHVsZXMvZmV0Y2gtYmxvYi9mcm9tLmpzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy9ub2RlLWZldGNoL3NyYy91dGlscy9tdWx0aXBhcnQtcGFyc2VyLmpzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L3NyYy9zdGF0cy50c3giLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL2lmdHQvcmF5Y2FzdC1leHQvbm9kZV9tb2R1bGVzL25vZGUtZmV0Y2gvc3JjL2luZGV4LmpzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy9kYXRhLXVyaS10by1idWZmZXIvc3JjL2luZGV4LnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy9ub2RlLWZldGNoL3NyYy9ib2R5LmpzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy9ub2RlLWZldGNoL3NyYy9lcnJvcnMvYmFzZS5qcyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvaWZ0dC9yYXljYXN0LWV4dC9ub2RlX21vZHVsZXMvbm9kZS1mZXRjaC9zcmMvZXJyb3JzL2ZldGNoLWVycm9yLmpzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy9ub2RlLWZldGNoL3NyYy91dGlscy9pcy5qcyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvaWZ0dC9yYXljYXN0LWV4dC9ub2RlX21vZHVsZXMvbm9kZS1mZXRjaC9zcmMvaGVhZGVycy5qcyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvaWZ0dC9yYXljYXN0LWV4dC9ub2RlX21vZHVsZXMvbm9kZS1mZXRjaC9zcmMvdXRpbHMvaXMtcmVkaXJlY3QuanMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL2lmdHQvcmF5Y2FzdC1leHQvbm9kZV9tb2R1bGVzL25vZGUtZmV0Y2gvc3JjL3Jlc3BvbnNlLmpzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy9ub2RlLWZldGNoL3NyYy9yZXF1ZXN0LmpzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy9ub2RlLWZldGNoL3NyYy91dGlscy9nZXQtc2VhcmNoLmpzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9pZnR0L3JheWNhc3QtZXh0L25vZGVfbW9kdWxlcy9ub2RlLWZldGNoL3NyYy91dGlscy9yZWZlcnJlci5qcyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvaWZ0dC9yYXljYXN0LWV4dC9ub2RlX21vZHVsZXMvbm9kZS1mZXRjaC9zcmMvZXJyb3JzL2Fib3J0LWVycm9yLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJleHBvcnQgZnVuY3Rpb24gbm9vcCgpOiB1bmRlZmluZWQge1xuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuIiwgImltcG9ydCB7IG5vb3AgfSBmcm9tICcuLi8uLi91dGlscyc7XG5pbXBvcnQgeyBBc3NlcnRpb25FcnJvciB9IGZyb20gJy4uLy4uL3N0dWIvYXNzZXJ0JztcblxuZXhwb3J0IGZ1bmN0aW9uIHR5cGVJc09iamVjdCh4OiBhbnkpOiB4IGlzIG9iamVjdCB7XG4gIHJldHVybiAodHlwZW9mIHggPT09ICdvYmplY3QnICYmIHggIT09IG51bGwpIHx8IHR5cGVvZiB4ID09PSAnZnVuY3Rpb24nO1xufVxuXG5leHBvcnQgY29uc3QgcmV0aHJvd0Fzc2VydGlvbkVycm9yUmVqZWN0aW9uOiAoZTogYW55KSA9PiB2b2lkID1cbiAgREVCVUcgPyBlID0+IHtcbiAgICAvLyBVc2VkIHRocm91Z2hvdXQgdGhlIHJlZmVyZW5jZSBpbXBsZW1lbnRhdGlvbiwgYXMgYC5jYXRjaChyZXRocm93QXNzZXJ0aW9uRXJyb3JSZWplY3Rpb24pYCwgdG8gZW5zdXJlIGFueSBlcnJvcnNcbiAgICAvLyBnZXQgc2hvd24uIFRoZXJlIGFyZSBwbGFjZXMgaW4gdGhlIHNwZWMgd2hlcmUgd2UgZG8gcHJvbWlzZSB0cmFuc2Zvcm1hdGlvbnMgYW5kIHB1cnBvc2VmdWxseSBpZ25vcmUgb3IgZG9uJ3RcbiAgICAvLyBleHBlY3QgYW55IGVycm9ycywgYnV0IGFzc2VydGlvbiBlcnJvcnMgYXJlIGFsd2F5cyBwcm9ibGVtYXRpYy5cbiAgICBpZiAoZSAmJiBlIGluc3RhbmNlb2YgQXNzZXJ0aW9uRXJyb3IpIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfSwgMCk7XG4gICAgfVxuICB9IDogbm9vcDtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldEZ1bmN0aW9uTmFtZShmbjogRnVuY3Rpb24sIG5hbWU6IHN0cmluZyk6IHZvaWQge1xuICB0cnkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmbiwgJ25hbWUnLCB7XG4gICAgICB2YWx1ZTogbmFtZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICB9IGNhdGNoIHtcbiAgICAvLyBUaGlzIHByb3BlcnR5IGlzIG5vbi1jb25maWd1cmFibGUgaW4gb2xkZXIgYnJvd3NlcnMsIHNvIGlnbm9yZSBpZiB0aGlzIHRocm93cy5cbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9GdW5jdGlvbi9uYW1lI2Jyb3dzZXJfY29tcGF0aWJpbGl0eVxuICB9XG59XG4iLCAiaW1wb3J0IHsgcmV0aHJvd0Fzc2VydGlvbkVycm9yUmVqZWN0aW9uIH0gZnJvbSAnLi9taXNjZWxsYW5lb3VzJztcbmltcG9ydCBhc3NlcnQgZnJvbSAnLi4vLi4vc3R1Yi9hc3NlcnQnO1xuXG5jb25zdCBvcmlnaW5hbFByb21pc2UgPSBQcm9taXNlO1xuY29uc3Qgb3JpZ2luYWxQcm9taXNlVGhlbiA9IFByb21pc2UucHJvdG90eXBlLnRoZW47XG5jb25zdCBvcmlnaW5hbFByb21pc2VSZWplY3QgPSBQcm9taXNlLnJlamVjdC5iaW5kKG9yaWdpbmFsUHJvbWlzZSk7XG5cbi8vIGh0dHBzOi8vd2ViaWRsLnNwZWMud2hhdHdnLm9yZy8jYS1uZXctcHJvbWlzZVxuZXhwb3J0IGZ1bmN0aW9uIG5ld1Byb21pc2U8VD4oZXhlY3V0b3I6IChcbiAgcmVzb2x2ZTogKHZhbHVlOiBUIHwgUHJvbWlzZUxpa2U8VD4pID0+IHZvaWQsXG4gIHJlamVjdDogKHJlYXNvbj86IGFueSkgPT4gdm9pZFxuKSA9PiB2b2lkKTogUHJvbWlzZTxUPiB7XG4gIHJldHVybiBuZXcgb3JpZ2luYWxQcm9taXNlKGV4ZWN1dG9yKTtcbn1cblxuLy8gaHR0cHM6Ly93ZWJpZGwuc3BlYy53aGF0d2cub3JnLyNhLXByb21pc2UtcmVzb2x2ZWQtd2l0aFxuZXhwb3J0IGZ1bmN0aW9uIHByb21pc2VSZXNvbHZlZFdpdGg8VD4odmFsdWU6IFQgfCBQcm9taXNlTGlrZTxUPik6IFByb21pc2U8VD4ge1xuICByZXR1cm4gbmV3UHJvbWlzZShyZXNvbHZlID0+IHJlc29sdmUodmFsdWUpKTtcbn1cblxuLy8gaHR0cHM6Ly93ZWJpZGwuc3BlYy53aGF0d2cub3JnLyNhLXByb21pc2UtcmVqZWN0ZWQtd2l0aFxuZXhwb3J0IGZ1bmN0aW9uIHByb21pc2VSZWplY3RlZFdpdGg8VCA9IG5ldmVyPihyZWFzb246IGFueSk6IFByb21pc2U8VD4ge1xuICByZXR1cm4gb3JpZ2luYWxQcm9taXNlUmVqZWN0KHJlYXNvbik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBQZXJmb3JtUHJvbWlzZVRoZW48VCwgVFJlc3VsdDEgPSBULCBUUmVzdWx0MiA9IG5ldmVyPihcbiAgcHJvbWlzZTogUHJvbWlzZTxUPixcbiAgb25GdWxmaWxsZWQ/OiAodmFsdWU6IFQpID0+IFRSZXN1bHQxIHwgUHJvbWlzZUxpa2U8VFJlc3VsdDE+LFxuICBvblJlamVjdGVkPzogKHJlYXNvbjogYW55KSA9PiBUUmVzdWx0MiB8IFByb21pc2VMaWtlPFRSZXN1bHQyPik6IFByb21pc2U8VFJlc3VsdDEgfCBUUmVzdWx0Mj4ge1xuICAvLyBUaGVyZSBkb2Vzbid0IGFwcGVhciB0byBiZSBhbnkgd2F5IHRvIGNvcnJlY3RseSBlbXVsYXRlIHRoZSBiZWhhdmlvdXIgZnJvbSBKYXZhU2NyaXB0LCBzbyB0aGlzIGlzIGp1c3QgYW5cbiAgLy8gYXBwcm94aW1hdGlvbi5cbiAgcmV0dXJuIG9yaWdpbmFsUHJvbWlzZVRoZW4uY2FsbChwcm9taXNlLCBvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCkgYXMgUHJvbWlzZTxUUmVzdWx0MSB8IFRSZXN1bHQyPjtcbn1cblxuLy8gQmx1ZWJpcmQgbG9ncyBhIHdhcm5pbmcgd2hlbiBhIHByb21pc2UgaXMgY3JlYXRlZCB3aXRoaW4gYSBmdWxmaWxsbWVudCBoYW5kbGVyLCBidXQgdGhlbiBpc24ndCByZXR1cm5lZFxuLy8gZnJvbSB0aGF0IGhhbmRsZXIuIFRvIHByZXZlbnQgdGhpcywgcmV0dXJuIG51bGwgaW5zdGVhZCBvZiB2b2lkIGZyb20gYWxsIGhhbmRsZXJzLlxuLy8gaHR0cDovL2JsdWViaXJkanMuY29tL2RvY3Mvd2FybmluZy1leHBsYW5hdGlvbnMuaHRtbCN3YXJuaW5nLWEtcHJvbWlzZS13YXMtY3JlYXRlZC1pbi1hLWhhbmRsZXItYnV0LXdhcy1ub3QtcmV0dXJuZWQtZnJvbS1pdFxuZXhwb3J0IGZ1bmN0aW9uIHVwb25Qcm9taXNlPFQ+KFxuICBwcm9taXNlOiBQcm9taXNlPFQ+LFxuICBvbkZ1bGZpbGxlZD86ICh2YWx1ZTogVCkgPT4gbnVsbCB8IFByb21pc2VMaWtlPG51bGw+LFxuICBvblJlamVjdGVkPzogKHJlYXNvbjogYW55KSA9PiBudWxsIHwgUHJvbWlzZUxpa2U8bnVsbD4pOiB2b2lkIHtcbiAgUGVyZm9ybVByb21pc2VUaGVuKFxuICAgIFBlcmZvcm1Qcm9taXNlVGhlbihwcm9taXNlLCBvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCksXG4gICAgdW5kZWZpbmVkLFxuICAgIHJldGhyb3dBc3NlcnRpb25FcnJvclJlamVjdGlvblxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBvbkZ1bGZpbGxtZW50PFQ+KHByb21pc2U6IFByb21pc2U8VD4sIG9uRnVsZmlsbGVkOiAodmFsdWU6IFQpID0+IG51bGwgfCBQcm9taXNlTGlrZTxudWxsPik6IHZvaWQge1xuICB1cG9uUHJvbWlzZShwcm9taXNlLCBvbkZ1bGZpbGxlZCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cG9uUmVqZWN0aW9uKHByb21pc2U6IFByb21pc2U8dW5rbm93bj4sIG9uUmVqZWN0ZWQ6IChyZWFzb246IGFueSkgPT4gbnVsbCB8IFByb21pc2VMaWtlPG51bGw+KTogdm9pZCB7XG4gIHVwb25Qcm9taXNlKHByb21pc2UsIHVuZGVmaW5lZCwgb25SZWplY3RlZCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0cmFuc2Zvcm1Qcm9taXNlV2l0aDxULCBUUmVzdWx0MSA9IFQsIFRSZXN1bHQyID0gbmV2ZXI+KFxuICBwcm9taXNlOiBQcm9taXNlPFQ+LFxuICBmdWxmaWxsbWVudEhhbmRsZXI/OiAodmFsdWU6IFQpID0+IFRSZXN1bHQxIHwgUHJvbWlzZUxpa2U8VFJlc3VsdDE+LFxuICByZWplY3Rpb25IYW5kbGVyPzogKHJlYXNvbjogYW55KSA9PiBUUmVzdWx0MiB8IFByb21pc2VMaWtlPFRSZXN1bHQyPik6IFByb21pc2U8VFJlc3VsdDEgfCBUUmVzdWx0Mj4ge1xuICByZXR1cm4gUGVyZm9ybVByb21pc2VUaGVuKHByb21pc2UsIGZ1bGZpbGxtZW50SGFuZGxlciwgcmVqZWN0aW9uSGFuZGxlcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRQcm9taXNlSXNIYW5kbGVkVG9UcnVlKHByb21pc2U6IFByb21pc2U8dW5rbm93bj4pOiB2b2lkIHtcbiAgUGVyZm9ybVByb21pc2VUaGVuKHByb21pc2UsIHVuZGVmaW5lZCwgcmV0aHJvd0Fzc2VydGlvbkVycm9yUmVqZWN0aW9uKTtcbn1cblxubGV0IF9xdWV1ZU1pY3JvdGFzazogKGNhbGxiYWNrOiAoKSA9PiB2b2lkKSA9PiB2b2lkID0gY2FsbGJhY2sgPT4ge1xuICBpZiAodHlwZW9mIHF1ZXVlTWljcm90YXNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgX3F1ZXVlTWljcm90YXNrID0gcXVldWVNaWNyb3Rhc2s7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgcmVzb2x2ZWRQcm9taXNlID0gcHJvbWlzZVJlc29sdmVkV2l0aCh1bmRlZmluZWQpO1xuICAgIF9xdWV1ZU1pY3JvdGFzayA9IGNiID0+IFBlcmZvcm1Qcm9taXNlVGhlbihyZXNvbHZlZFByb21pc2UsIGNiKTtcbiAgfVxuICByZXR1cm4gX3F1ZXVlTWljcm90YXNrKGNhbGxiYWNrKTtcbn07XG5cbmV4cG9ydCB7IF9xdWV1ZU1pY3JvdGFzayBhcyBxdWV1ZU1pY3JvdGFzayB9O1xuXG5leHBvcnQgZnVuY3Rpb24gcmVmbGVjdENhbGw8VCwgQSBleHRlbmRzIGFueVtdLCBSPihGOiAodGhpczogVCwgLi4uZm5BcmdzOiBBKSA9PiBSLCBWOiBULCBhcmdzOiBBKTogUiB7XG4gIGlmICh0eXBlb2YgRiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IGlzIG5vdCBhIGZ1bmN0aW9uJyk7XG4gIH1cbiAgcmV0dXJuIEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseS5jYWxsKEYsIFYsIGFyZ3MpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvbWlzZUNhbGw8VCwgQSBleHRlbmRzIGFueVtdLCBSPihGOiAodGhpczogVCwgLi4uZm5BcmdzOiBBKSA9PiBSIHwgUHJvbWlzZUxpa2U8Uj4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBWOiBULFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJnczogQSk6IFByb21pc2U8Uj4ge1xuICBhc3NlcnQodHlwZW9mIEYgPT09ICdmdW5jdGlvbicpO1xuICBhc3NlcnQoViAhPT0gdW5kZWZpbmVkKTtcbiAgYXNzZXJ0KEFycmF5LmlzQXJyYXkoYXJncykpO1xuICB0cnkge1xuICAgIHJldHVybiBwcm9taXNlUmVzb2x2ZWRXaXRoKHJlZmxlY3RDYWxsKEYsIFYsIGFyZ3MpKTtcbiAgfSBjYXRjaCAodmFsdWUpIHtcbiAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aCh2YWx1ZSk7XG4gIH1cbn1cbiIsICJpbXBvcnQgYXNzZXJ0IGZyb20gJy4uL3N0dWIvYXNzZXJ0JztcblxuLy8gT3JpZ2luYWwgZnJvbSBDaHJvbWl1bVxuLy8gaHR0cHM6Ly9jaHJvbWl1bS5nb29nbGVzb3VyY2UuY29tL2Nocm9taXVtL3NyYy8rLzBhZWU0NDM0YTRkYmE0MmE0MmFiYWVhOWJmYmMwY2QxOTZhNjNiYzEvdGhpcmRfcGFydHkvYmxpbmsvcmVuZGVyZXIvY29yZS9zdHJlYW1zL1NpbXBsZVF1ZXVlLmpzXG5cbmNvbnN0IFFVRVVFX01BWF9BUlJBWV9TSVpFID0gMTYzODQ7XG5cbmludGVyZmFjZSBOb2RlPFQ+IHtcbiAgX2VsZW1lbnRzOiBUW107XG4gIF9uZXh0OiBOb2RlPFQ+IHwgdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIFNpbXBsZSBxdWV1ZSBzdHJ1Y3R1cmUuXG4gKlxuICogQXZvaWRzIHNjYWxhYmlsaXR5IGlzc3VlcyB3aXRoIHVzaW5nIGEgcGFja2VkIGFycmF5IGRpcmVjdGx5IGJ5IHVzaW5nXG4gKiBtdWx0aXBsZSBhcnJheXMgaW4gYSBsaW5rZWQgbGlzdCBhbmQga2VlcGluZyB0aGUgYXJyYXkgc2l6ZSBib3VuZGVkLlxuICovXG5leHBvcnQgY2xhc3MgU2ltcGxlUXVldWU8VD4ge1xuICBwcml2YXRlIF9mcm9udDogTm9kZTxUPjtcbiAgcHJpdmF0ZSBfYmFjazogTm9kZTxUPjtcbiAgcHJpdmF0ZSBfY3Vyc29yID0gMDtcbiAgcHJpdmF0ZSBfc2l6ZSA9IDA7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgLy8gX2Zyb250IGFuZCBfYmFjayBhcmUgYWx3YXlzIGRlZmluZWQuXG4gICAgdGhpcy5fZnJvbnQgPSB7XG4gICAgICBfZWxlbWVudHM6IFtdLFxuICAgICAgX25leHQ6IHVuZGVmaW5lZFxuICAgIH07XG4gICAgdGhpcy5fYmFjayA9IHRoaXMuX2Zyb250O1xuICAgIC8vIFRoZSBjdXJzb3IgaXMgdXNlZCB0byBhdm9pZCBjYWxsaW5nIEFycmF5LnNoaWZ0KCkuXG4gICAgLy8gSXQgY29udGFpbnMgdGhlIGluZGV4IG9mIHRoZSBmcm9udCBlbGVtZW50IG9mIHRoZSBhcnJheSBpbnNpZGUgdGhlXG4gICAgLy8gZnJvbnQtbW9zdCBub2RlLiBJdCBpcyBhbHdheXMgaW4gdGhlIHJhbmdlIFswLCBRVUVVRV9NQVhfQVJSQVlfU0laRSkuXG4gICAgdGhpcy5fY3Vyc29yID0gMDtcbiAgICAvLyBXaGVuIHRoZXJlIGlzIG9ubHkgb25lIG5vZGUsIHNpemUgPT09IGVsZW1lbnRzLmxlbmd0aCAtIGN1cnNvci5cbiAgICB0aGlzLl9zaXplID0gMDtcbiAgfVxuXG4gIGdldCBsZW5ndGgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fc2l6ZTtcbiAgfVxuXG4gIC8vIEZvciBleGNlcHRpb24gc2FmZXR5LCB0aGlzIG1ldGhvZCBpcyBzdHJ1Y3R1cmVkIGluIG9yZGVyOlxuICAvLyAxLiBSZWFkIHN0YXRlXG4gIC8vIDIuIENhbGN1bGF0ZSByZXF1aXJlZCBzdGF0ZSBtdXRhdGlvbnNcbiAgLy8gMy4gUGVyZm9ybSBzdGF0ZSBtdXRhdGlvbnNcbiAgcHVzaChlbGVtZW50OiBUKTogdm9pZCB7XG4gICAgY29uc3Qgb2xkQmFjayA9IHRoaXMuX2JhY2s7XG4gICAgbGV0IG5ld0JhY2sgPSBvbGRCYWNrO1xuICAgIGFzc2VydChvbGRCYWNrLl9uZXh0ID09PSB1bmRlZmluZWQpO1xuICAgIGlmIChvbGRCYWNrLl9lbGVtZW50cy5sZW5ndGggPT09IFFVRVVFX01BWF9BUlJBWV9TSVpFIC0gMSkge1xuICAgICAgbmV3QmFjayA9IHtcbiAgICAgICAgX2VsZW1lbnRzOiBbXSxcbiAgICAgICAgX25leHQ6IHVuZGVmaW5lZFxuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBwdXNoKCkgaXMgdGhlIG11dGF0aW9uIG1vc3QgbGlrZWx5IHRvIHRocm93IGFuIGV4Y2VwdGlvbiwgc28gaXRcbiAgICAvLyBnb2VzIGZpcnN0LlxuICAgIG9sZEJhY2suX2VsZW1lbnRzLnB1c2goZWxlbWVudCk7XG4gICAgaWYgKG5ld0JhY2sgIT09IG9sZEJhY2spIHtcbiAgICAgIHRoaXMuX2JhY2sgPSBuZXdCYWNrO1xuICAgICAgb2xkQmFjay5fbmV4dCA9IG5ld0JhY2s7XG4gICAgfVxuICAgICsrdGhpcy5fc2l6ZTtcbiAgfVxuXG4gIC8vIExpa2UgcHVzaCgpLCBzaGlmdCgpIGZvbGxvd3MgdGhlIHJlYWQgLT4gY2FsY3VsYXRlIC0+IG11dGF0ZSBwYXR0ZXJuIGZvclxuICAvLyBleGNlcHRpb24gc2FmZXR5LlxuICBzaGlmdCgpOiBUIHtcbiAgICBhc3NlcnQodGhpcy5fc2l6ZSA+IDApOyAvLyBtdXN0IG5vdCBiZSBjYWxsZWQgb24gYW4gZW1wdHkgcXVldWVcblxuICAgIGNvbnN0IG9sZEZyb250ID0gdGhpcy5fZnJvbnQ7XG4gICAgbGV0IG5ld0Zyb250ID0gb2xkRnJvbnQ7XG4gICAgY29uc3Qgb2xkQ3Vyc29yID0gdGhpcy5fY3Vyc29yO1xuICAgIGxldCBuZXdDdXJzb3IgPSBvbGRDdXJzb3IgKyAxO1xuXG4gICAgY29uc3QgZWxlbWVudHMgPSBvbGRGcm9udC5fZWxlbWVudHM7XG4gICAgY29uc3QgZWxlbWVudCA9IGVsZW1lbnRzW29sZEN1cnNvcl07XG5cbiAgICBpZiAobmV3Q3Vyc29yID09PSBRVUVVRV9NQVhfQVJSQVlfU0laRSkge1xuICAgICAgYXNzZXJ0KGVsZW1lbnRzLmxlbmd0aCA9PT0gUVVFVUVfTUFYX0FSUkFZX1NJWkUpO1xuICAgICAgYXNzZXJ0KG9sZEZyb250Ll9uZXh0ICE9PSB1bmRlZmluZWQpO1xuICAgICAgbmV3RnJvbnQgPSBvbGRGcm9udC5fbmV4dCE7XG4gICAgICBuZXdDdXJzb3IgPSAwO1xuICAgIH1cblxuICAgIC8vIE5vIG11dGF0aW9ucyBiZWZvcmUgdGhpcyBwb2ludC5cbiAgICAtLXRoaXMuX3NpemU7XG4gICAgdGhpcy5fY3Vyc29yID0gbmV3Q3Vyc29yO1xuICAgIGlmIChvbGRGcm9udCAhPT0gbmV3RnJvbnQpIHtcbiAgICAgIHRoaXMuX2Zyb250ID0gbmV3RnJvbnQ7XG4gICAgfVxuXG4gICAgLy8gUGVybWl0IHNoaWZ0ZWQgZWxlbWVudCB0byBiZSBnYXJiYWdlIGNvbGxlY3RlZC5cbiAgICBlbGVtZW50c1tvbGRDdXJzb3JdID0gdW5kZWZpbmVkITtcblxuICAgIHJldHVybiBlbGVtZW50O1xuICB9XG5cbiAgLy8gVGhlIHRyaWNreSB0aGluZyBhYm91dCBmb3JFYWNoKCkgaXMgdGhhdCBpdCBjYW4gYmUgY2FsbGVkXG4gIC8vIHJlLWVudHJhbnRseS4gVGhlIHF1ZXVlIG1heSBiZSBtdXRhdGVkIGluc2lkZSB0aGUgY2FsbGJhY2suIEl0IGlzIGVhc3kgdG9cbiAgLy8gc2VlIHRoYXQgcHVzaCgpIHdpdGhpbiB0aGUgY2FsbGJhY2sgaGFzIG5vIG5lZ2F0aXZlIGVmZmVjdHMgc2luY2UgdGhlIGVuZFxuICAvLyBvZiB0aGUgcXVldWUgaXMgY2hlY2tlZCBmb3Igb24gZXZlcnkgaXRlcmF0aW9uLiBJZiBzaGlmdCgpIGlzIGNhbGxlZFxuICAvLyByZXBlYXRlZGx5IHdpdGhpbiB0aGUgY2FsbGJhY2sgdGhlbiB0aGUgbmV4dCBpdGVyYXRpb24gbWF5IHJldHVybiBhblxuICAvLyBlbGVtZW50IHRoYXQgaGFzIGJlZW4gcmVtb3ZlZC4gSW4gdGhpcyBjYXNlIHRoZSBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZFxuICAvLyB3aXRoIHVuZGVmaW5lZCB2YWx1ZXMgdW50aWwgd2UgZWl0aGVyIFwiY2F0Y2ggdXBcIiB3aXRoIGVsZW1lbnRzIHRoYXQgc3RpbGxcbiAgLy8gZXhpc3Qgb3IgcmVhY2ggdGhlIGJhY2sgb2YgdGhlIHF1ZXVlLlxuICBmb3JFYWNoKGNhbGxiYWNrOiAoZWxlbWVudDogVCkgPT4gdm9pZCk6IHZvaWQge1xuICAgIGxldCBpID0gdGhpcy5fY3Vyc29yO1xuICAgIGxldCBub2RlID0gdGhpcy5fZnJvbnQ7XG4gICAgbGV0IGVsZW1lbnRzID0gbm9kZS5fZWxlbWVudHM7XG4gICAgd2hpbGUgKGkgIT09IGVsZW1lbnRzLmxlbmd0aCB8fCBub2RlLl9uZXh0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmIChpID09PSBlbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgYXNzZXJ0KG5vZGUuX25leHQgIT09IHVuZGVmaW5lZCk7XG4gICAgICAgIGFzc2VydChpID09PSBRVUVVRV9NQVhfQVJSQVlfU0laRSk7XG4gICAgICAgIG5vZGUgPSBub2RlLl9uZXh0ITtcbiAgICAgICAgZWxlbWVudHMgPSBub2RlLl9lbGVtZW50cztcbiAgICAgICAgaSA9IDA7XG4gICAgICAgIGlmIChlbGVtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY2FsbGJhY2soZWxlbWVudHNbaV0pO1xuICAgICAgKytpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFJldHVybiB0aGUgZWxlbWVudCB0aGF0IHdvdWxkIGJlIHJldHVybmVkIGlmIHNoaWZ0KCkgd2FzIGNhbGxlZCBub3csXG4gIC8vIHdpdGhvdXQgbW9kaWZ5aW5nIHRoZSBxdWV1ZS5cbiAgcGVlaygpOiBUIHtcbiAgICBhc3NlcnQodGhpcy5fc2l6ZSA+IDApOyAvLyBtdXN0IG5vdCBiZSBjYWxsZWQgb24gYW4gZW1wdHkgcXVldWVcblxuICAgIGNvbnN0IGZyb250ID0gdGhpcy5fZnJvbnQ7XG4gICAgY29uc3QgY3Vyc29yID0gdGhpcy5fY3Vyc29yO1xuICAgIHJldHVybiBmcm9udC5fZWxlbWVudHNbY3Vyc29yXTtcbiAgfVxufVxuIiwgImV4cG9ydCBjb25zdCBBYm9ydFN0ZXBzID0gU3ltYm9sKCdbW0Fib3J0U3RlcHNdXScpO1xuZXhwb3J0IGNvbnN0IEVycm9yU3RlcHMgPSBTeW1ib2woJ1tbRXJyb3JTdGVwc11dJyk7XG5leHBvcnQgY29uc3QgQ2FuY2VsU3RlcHMgPSBTeW1ib2woJ1tbQ2FuY2VsU3RlcHNdXScpO1xuZXhwb3J0IGNvbnN0IFB1bGxTdGVwcyA9IFN5bWJvbCgnW1tQdWxsU3RlcHNdXScpO1xuZXhwb3J0IGNvbnN0IFJlbGVhc2VTdGVwcyA9IFN5bWJvbCgnW1tSZWxlYXNlU3RlcHNdXScpO1xuIiwgImltcG9ydCBhc3NlcnQgZnJvbSAnLi4vLi4vc3R1Yi9hc3NlcnQnO1xuaW1wb3J0IHsgUmVhZGFibGVTdHJlYW0sIFJlYWRhYmxlU3RyZWFtQ2FuY2VsLCB0eXBlIFJlYWRhYmxlU3RyZWFtUmVhZGVyIH0gZnJvbSAnLi4vcmVhZGFibGUtc3RyZWFtJztcbmltcG9ydCB7IG5ld1Byb21pc2UsIHNldFByb21pc2VJc0hhbmRsZWRUb1RydWUgfSBmcm9tICcuLi9oZWxwZXJzL3dlYmlkbCc7XG5pbXBvcnQgeyBSZWxlYXNlU3RlcHMgfSBmcm9tICcuLi9hYnN0cmFjdC1vcHMvaW50ZXJuYWwtbWV0aG9kcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZVN0cmVhbVJlYWRlckdlbmVyaWNJbml0aWFsaXplPFI+KHJlYWRlcjogUmVhZGFibGVTdHJlYW1SZWFkZXI8Uj4sIHN0cmVhbTogUmVhZGFibGVTdHJlYW08Uj4pIHtcbiAgcmVhZGVyLl9vd25lclJlYWRhYmxlU3RyZWFtID0gc3RyZWFtO1xuICBzdHJlYW0uX3JlYWRlciA9IHJlYWRlcjtcblxuICBpZiAoc3RyZWFtLl9zdGF0ZSA9PT0gJ3JlYWRhYmxlJykge1xuICAgIGRlZmF1bHRSZWFkZXJDbG9zZWRQcm9taXNlSW5pdGlhbGl6ZShyZWFkZXIpO1xuICB9IGVsc2UgaWYgKHN0cmVhbS5fc3RhdGUgPT09ICdjbG9zZWQnKSB7XG4gICAgZGVmYXVsdFJlYWRlckNsb3NlZFByb21pc2VJbml0aWFsaXplQXNSZXNvbHZlZChyZWFkZXIpO1xuICB9IGVsc2Uge1xuICAgIGFzc2VydChzdHJlYW0uX3N0YXRlID09PSAnZXJyb3JlZCcpO1xuXG4gICAgZGVmYXVsdFJlYWRlckNsb3NlZFByb21pc2VJbml0aWFsaXplQXNSZWplY3RlZChyZWFkZXIsIHN0cmVhbS5fc3RvcmVkRXJyb3IpO1xuICB9XG59XG5cbi8vIEEgY2xpZW50IG9mIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlciBhbmQgUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyIG1heSB1c2UgdGhlc2UgZnVuY3Rpb25zIGRpcmVjdGx5IHRvIGJ5cGFzcyBzdGF0ZVxuLy8gY2hlY2suXG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZVN0cmVhbVJlYWRlckdlbmVyaWNDYW5jZWwocmVhZGVyOiBSZWFkYWJsZVN0cmVhbVJlYWRlcjxhbnk+LCByZWFzb246IGFueSk6IFByb21pc2U8dW5kZWZpbmVkPiB7XG4gIGNvbnN0IHN0cmVhbSA9IHJlYWRlci5fb3duZXJSZWFkYWJsZVN0cmVhbTtcbiAgYXNzZXJ0KHN0cmVhbSAhPT0gdW5kZWZpbmVkKTtcbiAgcmV0dXJuIFJlYWRhYmxlU3RyZWFtQ2FuY2VsKHN0cmVhbSwgcmVhc29uKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtUmVhZGVyR2VuZXJpY1JlbGVhc2UocmVhZGVyOiBSZWFkYWJsZVN0cmVhbVJlYWRlcjxhbnk+KSB7XG4gIGNvbnN0IHN0cmVhbSA9IHJlYWRlci5fb3duZXJSZWFkYWJsZVN0cmVhbTtcbiAgYXNzZXJ0KHN0cmVhbSAhPT0gdW5kZWZpbmVkKTtcbiAgYXNzZXJ0KHN0cmVhbS5fcmVhZGVyID09PSByZWFkZXIpO1xuXG4gIGlmIChzdHJlYW0uX3N0YXRlID09PSAncmVhZGFibGUnKSB7XG4gICAgZGVmYXVsdFJlYWRlckNsb3NlZFByb21pc2VSZWplY3QoXG4gICAgICByZWFkZXIsXG4gICAgICBuZXcgVHlwZUVycm9yKGBSZWFkZXIgd2FzIHJlbGVhc2VkIGFuZCBjYW4gbm8gbG9uZ2VyIGJlIHVzZWQgdG8gbW9uaXRvciB0aGUgc3RyZWFtJ3MgY2xvc2VkbmVzc2ApKTtcbiAgfSBlbHNlIHtcbiAgICBkZWZhdWx0UmVhZGVyQ2xvc2VkUHJvbWlzZVJlc2V0VG9SZWplY3RlZChcbiAgICAgIHJlYWRlcixcbiAgICAgIG5ldyBUeXBlRXJyb3IoYFJlYWRlciB3YXMgcmVsZWFzZWQgYW5kIGNhbiBubyBsb25nZXIgYmUgdXNlZCB0byBtb25pdG9yIHRoZSBzdHJlYW0ncyBjbG9zZWRuZXNzYCkpO1xuICB9XG5cbiAgc3RyZWFtLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXJbUmVsZWFzZVN0ZXBzXSgpO1xuXG4gIHN0cmVhbS5fcmVhZGVyID0gdW5kZWZpbmVkO1xuICByZWFkZXIuX293bmVyUmVhZGFibGVTdHJlYW0gPSB1bmRlZmluZWQhO1xufVxuXG4vLyBIZWxwZXIgZnVuY3Rpb25zIGZvciB0aGUgcmVhZGVycy5cblxuZXhwb3J0IGZ1bmN0aW9uIHJlYWRlckxvY2tFeGNlcHRpb24obmFtZTogc3RyaW5nKTogVHlwZUVycm9yIHtcbiAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCAnICsgbmFtZSArICcgYSBzdHJlYW0gdXNpbmcgYSByZWxlYXNlZCByZWFkZXInKTtcbn1cblxuLy8gSGVscGVyIGZ1bmN0aW9ucyBmb3IgdGhlIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlci5cblxuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRSZWFkZXJDbG9zZWRQcm9taXNlSW5pdGlhbGl6ZShyZWFkZXI6IFJlYWRhYmxlU3RyZWFtUmVhZGVyPGFueT4pIHtcbiAgcmVhZGVyLl9jbG9zZWRQcm9taXNlID0gbmV3UHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgcmVhZGVyLl9jbG9zZWRQcm9taXNlX3Jlc29sdmUgPSByZXNvbHZlO1xuICAgIHJlYWRlci5fY2xvc2VkUHJvbWlzZV9yZWplY3QgPSByZWplY3Q7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVmYXVsdFJlYWRlckNsb3NlZFByb21pc2VJbml0aWFsaXplQXNSZWplY3RlZChyZWFkZXI6IFJlYWRhYmxlU3RyZWFtUmVhZGVyPGFueT4sIHJlYXNvbjogYW55KSB7XG4gIGRlZmF1bHRSZWFkZXJDbG9zZWRQcm9taXNlSW5pdGlhbGl6ZShyZWFkZXIpO1xuICBkZWZhdWx0UmVhZGVyQ2xvc2VkUHJvbWlzZVJlamVjdChyZWFkZXIsIHJlYXNvbik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWZhdWx0UmVhZGVyQ2xvc2VkUHJvbWlzZUluaXRpYWxpemVBc1Jlc29sdmVkKHJlYWRlcjogUmVhZGFibGVTdHJlYW1SZWFkZXI8YW55Pikge1xuICBkZWZhdWx0UmVhZGVyQ2xvc2VkUHJvbWlzZUluaXRpYWxpemUocmVhZGVyKTtcbiAgZGVmYXVsdFJlYWRlckNsb3NlZFByb21pc2VSZXNvbHZlKHJlYWRlcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWZhdWx0UmVhZGVyQ2xvc2VkUHJvbWlzZVJlamVjdChyZWFkZXI6IFJlYWRhYmxlU3RyZWFtUmVhZGVyPGFueT4sIHJlYXNvbjogYW55KSB7XG4gIGlmIChyZWFkZXIuX2Nsb3NlZFByb21pc2VfcmVqZWN0ID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBzZXRQcm9taXNlSXNIYW5kbGVkVG9UcnVlKHJlYWRlci5fY2xvc2VkUHJvbWlzZSk7XG4gIHJlYWRlci5fY2xvc2VkUHJvbWlzZV9yZWplY3QocmVhc29uKTtcbiAgcmVhZGVyLl9jbG9zZWRQcm9taXNlX3Jlc29sdmUgPSB1bmRlZmluZWQ7XG4gIHJlYWRlci5fY2xvc2VkUHJvbWlzZV9yZWplY3QgPSB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWZhdWx0UmVhZGVyQ2xvc2VkUHJvbWlzZVJlc2V0VG9SZWplY3RlZChyZWFkZXI6IFJlYWRhYmxlU3RyZWFtUmVhZGVyPGFueT4sIHJlYXNvbjogYW55KSB7XG4gIGFzc2VydChyZWFkZXIuX2Nsb3NlZFByb21pc2VfcmVzb2x2ZSA9PT0gdW5kZWZpbmVkKTtcbiAgYXNzZXJ0KHJlYWRlci5fY2xvc2VkUHJvbWlzZV9yZWplY3QgPT09IHVuZGVmaW5lZCk7XG5cbiAgZGVmYXVsdFJlYWRlckNsb3NlZFByb21pc2VJbml0aWFsaXplQXNSZWplY3RlZChyZWFkZXIsIHJlYXNvbik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWZhdWx0UmVhZGVyQ2xvc2VkUHJvbWlzZVJlc29sdmUocmVhZGVyOiBSZWFkYWJsZVN0cmVhbVJlYWRlcjxhbnk+KSB7XG4gIGlmIChyZWFkZXIuX2Nsb3NlZFByb21pc2VfcmVzb2x2ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcmVhZGVyLl9jbG9zZWRQcm9taXNlX3Jlc29sdmUodW5kZWZpbmVkKTtcbiAgcmVhZGVyLl9jbG9zZWRQcm9taXNlX3Jlc29sdmUgPSB1bmRlZmluZWQ7XG4gIHJlYWRlci5fY2xvc2VkUHJvbWlzZV9yZWplY3QgPSB1bmRlZmluZWQ7XG59XG4iLCAiLy8vIDxyZWZlcmVuY2UgbGliPVwiZXMyMDE1LmNvcmVcIiAvPlxuXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9OdW1iZXIvaXNGaW5pdGUjUG9seWZpbGxcbmNvbnN0IE51bWJlcklzRmluaXRlOiB0eXBlb2YgTnVtYmVyLmlzRmluaXRlID0gTnVtYmVyLmlzRmluaXRlIHx8IGZ1bmN0aW9uICh4KSB7XG4gIHJldHVybiB0eXBlb2YgeCA9PT0gJ251bWJlcicgJiYgaXNGaW5pdGUoeCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBOdW1iZXJJc0Zpbml0ZTtcbiIsICIvLy8gPHJlZmVyZW5jZSBsaWI9XCJlczIwMTUuY29yZVwiIC8+XG5cbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL01hdGgvdHJ1bmMjUG9seWZpbGxcbmNvbnN0IE1hdGhUcnVuYzogdHlwZW9mIE1hdGgudHJ1bmMgPSBNYXRoLnRydW5jIHx8IGZ1bmN0aW9uICh2KSB7XG4gIHJldHVybiB2IDwgMCA/IE1hdGguY2VpbCh2KSA6IE1hdGguZmxvb3Iodik7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBNYXRoVHJ1bmM7XG4iLCAiaW1wb3J0IE51bWJlcklzRmluaXRlIGZyb20gJy4uLy4uL3N0dWIvbnVtYmVyLWlzZmluaXRlJztcbmltcG9ydCBNYXRoVHJ1bmMgZnJvbSAnLi4vLi4vc3R1Yi9tYXRoLXRydW5jJztcblxuLy8gaHR0cHM6Ly9oZXljYW0uZ2l0aHViLmlvL3dlYmlkbC8jaWRsLWRpY3Rpb25hcmllc1xuZXhwb3J0IGZ1bmN0aW9uIGlzRGljdGlvbmFyeSh4OiBhbnkpOiB4IGlzIG9iamVjdCB8IG51bGwge1xuICByZXR1cm4gdHlwZW9mIHggPT09ICdvYmplY3QnIHx8IHR5cGVvZiB4ID09PSAnZnVuY3Rpb24nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0RGljdGlvbmFyeShvYmo6IHVua25vd24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiBzdHJpbmcpOiBhc3NlcnRzIG9iaiBpcyBvYmplY3QgfCBudWxsIHwgdW5kZWZpbmVkIHtcbiAgaWYgKG9iaiAhPT0gdW5kZWZpbmVkICYmICFpc0RpY3Rpb25hcnkob2JqKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYCR7Y29udGV4dH0gaXMgbm90IGFuIG9iamVjdC5gKTtcbiAgfVxufVxuXG5leHBvcnQgdHlwZSBBbnlGdW5jdGlvbiA9ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55O1xuXG4vLyBodHRwczovL2hleWNhbS5naXRodWIuaW8vd2ViaWRsLyNpZGwtY2FsbGJhY2stZnVuY3Rpb25zXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0RnVuY3Rpb24oeDogdW5rbm93biwgY29udGV4dDogc3RyaW5nKTogYXNzZXJ0cyB4IGlzIEFueUZ1bmN0aW9uIHtcbiAgaWYgKHR5cGVvZiB4ICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgJHtjb250ZXh0fSBpcyBub3QgYSBmdW5jdGlvbi5gKTtcbiAgfVxufVxuXG4vLyBodHRwczovL2hleWNhbS5naXRodWIuaW8vd2ViaWRsLyNpZGwtb2JqZWN0XG5leHBvcnQgZnVuY3Rpb24gaXNPYmplY3QoeDogYW55KTogeCBpcyBvYmplY3Qge1xuICByZXR1cm4gKHR5cGVvZiB4ID09PSAnb2JqZWN0JyAmJiB4ICE9PSBudWxsKSB8fCB0eXBlb2YgeCA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydE9iamVjdCh4OiB1bmtub3duLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiBzdHJpbmcpOiBhc3NlcnRzIHggaXMgb2JqZWN0IHtcbiAgaWYgKCFpc09iamVjdCh4KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYCR7Y29udGV4dH0gaXMgbm90IGFuIG9iamVjdC5gKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0UmVxdWlyZWRBcmd1bWVudDxUPih4OiBUIHwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6IHN0cmluZyk6IGFzc2VydHMgeCBpcyBUIHtcbiAgaWYgKHggPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYFBhcmFtZXRlciAke3Bvc2l0aW9ufSBpcyByZXF1aXJlZCBpbiAnJHtjb250ZXh0fScuYCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydFJlcXVpcmVkRmllbGQ8VD4oeDogVCB8IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiBzdHJpbmcpOiBhc3NlcnRzIHggaXMgVCB7XG4gIGlmICh4ID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGAke2ZpZWxkfSBpcyByZXF1aXJlZCBpbiAnJHtjb250ZXh0fScuYCk7XG4gIH1cbn1cblxuLy8gaHR0cHM6Ly9oZXljYW0uZ2l0aHViLmlvL3dlYmlkbC8jaWRsLXVucmVzdHJpY3RlZC1kb3VibGVcbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0VW5yZXN0cmljdGVkRG91YmxlKHZhbHVlOiB1bmtub3duKTogbnVtYmVyIHtcbiAgcmV0dXJuIE51bWJlcih2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIGNlbnNvck5lZ2F0aXZlWmVybyh4OiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4geCA9PT0gMCA/IDAgOiB4O1xufVxuXG5mdW5jdGlvbiBpbnRlZ2VyUGFydCh4OiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gY2Vuc29yTmVnYXRpdmVaZXJvKE1hdGhUcnVuYyh4KSk7XG59XG5cbi8vIGh0dHBzOi8vaGV5Y2FtLmdpdGh1Yi5pby93ZWJpZGwvI2lkbC11bnNpZ25lZC1sb25nLWxvbmdcbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0VW5zaWduZWRMb25nTG9uZ1dpdGhFbmZvcmNlUmFuZ2UodmFsdWU6IHVua25vd24sIGNvbnRleHQ6IHN0cmluZyk6IG51bWJlciB7XG4gIGNvbnN0IGxvd2VyQm91bmQgPSAwO1xuICBjb25zdCB1cHBlckJvdW5kID0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG5cbiAgbGV0IHggPSBOdW1iZXIodmFsdWUpO1xuICB4ID0gY2Vuc29yTmVnYXRpdmVaZXJvKHgpO1xuXG4gIGlmICghTnVtYmVySXNGaW5pdGUoeCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGAke2NvbnRleHR9IGlzIG5vdCBhIGZpbml0ZSBudW1iZXJgKTtcbiAgfVxuXG4gIHggPSBpbnRlZ2VyUGFydCh4KTtcblxuICBpZiAoeCA8IGxvd2VyQm91bmQgfHwgeCA+IHVwcGVyQm91bmQpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGAke2NvbnRleHR9IGlzIG91dHNpZGUgdGhlIGFjY2VwdGVkIHJhbmdlIG9mICR7bG93ZXJCb3VuZH0gdG8gJHt1cHBlckJvdW5kfSwgaW5jbHVzaXZlYCk7XG4gIH1cblxuICBpZiAoIU51bWJlcklzRmluaXRlKHgpIHx8IHggPT09IDApIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIC8vIFRPRE8gVXNlIEJpZ0ludCBpZiBzdXBwb3J0ZWQ/XG4gIC8vIGxldCB4QmlnSW50ID0gQmlnSW50KGludGVnZXJQYXJ0KHgpKTtcbiAgLy8geEJpZ0ludCA9IEJpZ0ludC5hc1VpbnROKDY0LCB4QmlnSW50KTtcbiAgLy8gcmV0dXJuIE51bWJlcih4QmlnSW50KTtcblxuICByZXR1cm4geDtcbn1cbiIsICJpbXBvcnQgeyBJc1JlYWRhYmxlU3RyZWFtLCBSZWFkYWJsZVN0cmVhbSB9IGZyb20gJy4uL3JlYWRhYmxlLXN0cmVhbSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnRSZWFkYWJsZVN0cmVhbSh4OiB1bmtub3duLCBjb250ZXh0OiBzdHJpbmcpOiBhc3NlcnRzIHggaXMgUmVhZGFibGVTdHJlYW0ge1xuICBpZiAoIUlzUmVhZGFibGVTdHJlYW0oeCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGAke2NvbnRleHR9IGlzIG5vdCBhIFJlYWRhYmxlU3RyZWFtLmApO1xuICB9XG59XG4iLCAiaW1wb3J0IGFzc2VydCBmcm9tICcuLi8uLi9zdHViL2Fzc2VydCc7XG5pbXBvcnQgeyBTaW1wbGVRdWV1ZSB9IGZyb20gJy4uL3NpbXBsZS1xdWV1ZSc7XG5pbXBvcnQge1xuICBSZWFkYWJsZVN0cmVhbVJlYWRlckdlbmVyaWNDYW5jZWwsXG4gIFJlYWRhYmxlU3RyZWFtUmVhZGVyR2VuZXJpY0luaXRpYWxpemUsXG4gIFJlYWRhYmxlU3RyZWFtUmVhZGVyR2VuZXJpY1JlbGVhc2UsXG4gIHJlYWRlckxvY2tFeGNlcHRpb25cbn0gZnJvbSAnLi9nZW5lcmljLXJlYWRlcic7XG5pbXBvcnQgeyBJc1JlYWRhYmxlU3RyZWFtTG9ja2VkLCBSZWFkYWJsZVN0cmVhbSB9IGZyb20gJy4uL3JlYWRhYmxlLXN0cmVhbSc7XG5pbXBvcnQgeyBzZXRGdW5jdGlvbk5hbWUsIHR5cGVJc09iamVjdCB9IGZyb20gJy4uL2hlbHBlcnMvbWlzY2VsbGFuZW91cyc7XG5pbXBvcnQgeyBQdWxsU3RlcHMgfSBmcm9tICcuLi9hYnN0cmFjdC1vcHMvaW50ZXJuYWwtbWV0aG9kcyc7XG5pbXBvcnQgeyBuZXdQcm9taXNlLCBwcm9taXNlUmVqZWN0ZWRXaXRoIH0gZnJvbSAnLi4vaGVscGVycy93ZWJpZGwnO1xuaW1wb3J0IHsgYXNzZXJ0UmVxdWlyZWRBcmd1bWVudCB9IGZyb20gJy4uL3ZhbGlkYXRvcnMvYmFzaWMnO1xuaW1wb3J0IHsgYXNzZXJ0UmVhZGFibGVTdHJlYW0gfSBmcm9tICcuLi92YWxpZGF0b3JzL3JlYWRhYmxlLXN0cmVhbSc7XG5cbi8qKlxuICogQSByZXN1bHQgcmV0dXJuZWQgYnkge0BsaW5rIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlci5yZWFkfS5cbiAqXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCB0eXBlIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRSZXN1bHQ8VD4gPSB7XG4gIGRvbmU6IGZhbHNlO1xuICB2YWx1ZTogVDtcbn0gfCB7XG4gIGRvbmU6IHRydWU7XG4gIHZhbHVlPzogdW5kZWZpbmVkO1xufVxuXG4vLyBBYnN0cmFjdCBvcGVyYXRpb25zIGZvciB0aGUgUmVhZGFibGVTdHJlYW0uXG5cbmV4cG9ydCBmdW5jdGlvbiBBY3F1aXJlUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyPFI+KHN0cmVhbTogUmVhZGFibGVTdHJlYW0pOiBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXI8Uj4ge1xuICByZXR1cm4gbmV3IFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcihzdHJlYW0pO1xufVxuXG4vLyBSZWFkYWJsZVN0cmVhbSBBUEkgZXhwb3NlZCBmb3IgY29udHJvbGxlcnMuXG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZVN0cmVhbUFkZFJlYWRSZXF1ZXN0PFI+KHN0cmVhbTogUmVhZGFibGVTdHJlYW08Uj4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWFkUmVxdWVzdDogUmVhZFJlcXVlc3Q8Uj4pOiB2b2lkIHtcbiAgYXNzZXJ0KElzUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyKHN0cmVhbS5fcmVhZGVyKSk7XG4gIGFzc2VydChzdHJlYW0uX3N0YXRlID09PSAncmVhZGFibGUnKTtcblxuICAoc3RyZWFtLl9yZWFkZXIhIGFzIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcjxSPikuX3JlYWRSZXF1ZXN0cy5wdXNoKHJlYWRSZXF1ZXN0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtRnVsZmlsbFJlYWRSZXF1ZXN0PFI+KHN0cmVhbTogUmVhZGFibGVTdHJlYW08Uj4sIGNodW5rOiBSIHwgdW5kZWZpbmVkLCBkb25lOiBib29sZWFuKSB7XG4gIGNvbnN0IHJlYWRlciA9IHN0cmVhbS5fcmVhZGVyIGFzIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcjxSPjtcblxuICBhc3NlcnQocmVhZGVyLl9yZWFkUmVxdWVzdHMubGVuZ3RoID4gMCk7XG5cbiAgY29uc3QgcmVhZFJlcXVlc3QgPSByZWFkZXIuX3JlYWRSZXF1ZXN0cy5zaGlmdCgpITtcbiAgaWYgKGRvbmUpIHtcbiAgICByZWFkUmVxdWVzdC5fY2xvc2VTdGVwcygpO1xuICB9IGVsc2Uge1xuICAgIHJlYWRSZXF1ZXN0Ll9jaHVua1N0ZXBzKGNodW5rISk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtR2V0TnVtUmVhZFJlcXVlc3RzPFI+KHN0cmVhbTogUmVhZGFibGVTdHJlYW08Uj4pOiBudW1iZXIge1xuICByZXR1cm4gKHN0cmVhbS5fcmVhZGVyIGFzIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcjxSPikuX3JlYWRSZXF1ZXN0cy5sZW5ndGg7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZVN0cmVhbUhhc0RlZmF1bHRSZWFkZXIoc3RyZWFtOiBSZWFkYWJsZVN0cmVhbSk6IGJvb2xlYW4ge1xuICBjb25zdCByZWFkZXIgPSBzdHJlYW0uX3JlYWRlcjtcblxuICBpZiAocmVhZGVyID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoIUlzUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyKHJlYWRlcikpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLy8gUmVhZGVyc1xuXG5leHBvcnQgaW50ZXJmYWNlIFJlYWRSZXF1ZXN0PFI+IHtcbiAgX2NodW5rU3RlcHMoY2h1bms6IFIpOiB2b2lkO1xuXG4gIF9jbG9zZVN0ZXBzKCk6IHZvaWQ7XG5cbiAgX2Vycm9yU3RlcHMoZTogYW55KTogdm9pZDtcbn1cblxuLyoqXG4gKiBBIGRlZmF1bHQgcmVhZGVyIHZlbmRlZCBieSBhIHtAbGluayBSZWFkYWJsZVN0cmVhbX0uXG4gKlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY2xhc3MgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyPFIgPSBhbnk+IHtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfb3duZXJSZWFkYWJsZVN0cmVhbSE6IFJlYWRhYmxlU3RyZWFtPFI+O1xuICAvKiogQGludGVybmFsICovXG4gIF9jbG9zZWRQcm9taXNlITogUHJvbWlzZTx1bmRlZmluZWQ+O1xuICAvKiogQGludGVybmFsICovXG4gIF9jbG9zZWRQcm9taXNlX3Jlc29sdmU/OiAodmFsdWU/OiB1bmRlZmluZWQpID0+IHZvaWQ7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2Nsb3NlZFByb21pc2VfcmVqZWN0PzogKHJlYXNvbjogYW55KSA9PiB2b2lkO1xuICAvKiogQGludGVybmFsICovXG4gIF9yZWFkUmVxdWVzdHM6IFNpbXBsZVF1ZXVlPFJlYWRSZXF1ZXN0PFI+PjtcblxuICBjb25zdHJ1Y3RvcihzdHJlYW06IFJlYWRhYmxlU3RyZWFtPFI+KSB7XG4gICAgYXNzZXJ0UmVxdWlyZWRBcmd1bWVudChzdHJlYW0sIDEsICdSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXInKTtcbiAgICBhc3NlcnRSZWFkYWJsZVN0cmVhbShzdHJlYW0sICdGaXJzdCBwYXJhbWV0ZXInKTtcblxuICAgIGlmIChJc1JlYWRhYmxlU3RyZWFtTG9ja2VkKHN0cmVhbSkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoaXMgc3RyZWFtIGhhcyBhbHJlYWR5IGJlZW4gbG9ja2VkIGZvciBleGNsdXNpdmUgcmVhZGluZyBieSBhbm90aGVyIHJlYWRlcicpO1xuICAgIH1cblxuICAgIFJlYWRhYmxlU3RyZWFtUmVhZGVyR2VuZXJpY0luaXRpYWxpemUodGhpcywgc3RyZWFtKTtcblxuICAgIHRoaXMuX3JlYWRSZXF1ZXN0cyA9IG5ldyBTaW1wbGVRdWV1ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBwcm9taXNlIHRoYXQgd2lsbCBiZSBmdWxmaWxsZWQgd2hlbiB0aGUgc3RyZWFtIGJlY29tZXMgY2xvc2VkLFxuICAgKiBvciByZWplY3RlZCBpZiB0aGUgc3RyZWFtIGV2ZXIgZXJyb3JzIG9yIHRoZSByZWFkZXIncyBsb2NrIGlzIHJlbGVhc2VkIGJlZm9yZSB0aGUgc3RyZWFtIGZpbmlzaGVzIGNsb3NpbmcuXG4gICAqL1xuICBnZXQgY2xvc2VkKCk6IFByb21pc2U8dW5kZWZpbmVkPiB7XG4gICAgaWYgKCFJc1JlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcih0aGlzKSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoZGVmYXVsdFJlYWRlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ2Nsb3NlZCcpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fY2xvc2VkUHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJZiB0aGUgcmVhZGVyIGlzIGFjdGl2ZSwgYmVoYXZlcyB0aGUgc2FtZSBhcyB7QGxpbmsgUmVhZGFibGVTdHJlYW0uY2FuY2VsIHwgc3RyZWFtLmNhbmNlbChyZWFzb24pfS5cbiAgICovXG4gIGNhbmNlbChyZWFzb246IGFueSA9IHVuZGVmaW5lZCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghSXNSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXIodGhpcykpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKGRlZmF1bHRSZWFkZXJCcmFuZENoZWNrRXhjZXB0aW9uKCdjYW5jZWwnKSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX293bmVyUmVhZGFibGVTdHJlYW0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgocmVhZGVyTG9ja0V4Y2VwdGlvbignY2FuY2VsJykpO1xuICAgIH1cblxuICAgIHJldHVybiBSZWFkYWJsZVN0cmVhbVJlYWRlckdlbmVyaWNDYW5jZWwodGhpcywgcmVhc29uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IGFsbG93cyBhY2Nlc3MgdG8gdGhlIG5leHQgY2h1bmsgZnJvbSB0aGUgc3RyZWFtJ3MgaW50ZXJuYWwgcXVldWUsIGlmIGF2YWlsYWJsZS5cbiAgICpcbiAgICogSWYgcmVhZGluZyBhIGNodW5rIGNhdXNlcyB0aGUgcXVldWUgdG8gYmVjb21lIGVtcHR5LCBtb3JlIGRhdGEgd2lsbCBiZSBwdWxsZWQgZnJvbSB0aGUgdW5kZXJseWluZyBzb3VyY2UuXG4gICAqL1xuICByZWFkKCk6IFByb21pc2U8UmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZFJlc3VsdDxSPj4ge1xuICAgIGlmICghSXNSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXIodGhpcykpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKGRlZmF1bHRSZWFkZXJCcmFuZENoZWNrRXhjZXB0aW9uKCdyZWFkJykpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9vd25lclJlYWRhYmxlU3RyZWFtID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKHJlYWRlckxvY2tFeGNlcHRpb24oJ3JlYWQgZnJvbScpKTtcbiAgICB9XG5cbiAgICBsZXQgcmVzb2x2ZVByb21pc2UhOiAocmVzdWx0OiBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkUmVzdWx0PFI+KSA9PiB2b2lkO1xuICAgIGxldCByZWplY3RQcm9taXNlITogKHJlYXNvbjogYW55KSA9PiB2b2lkO1xuICAgIGNvbnN0IHByb21pc2UgPSBuZXdQcm9taXNlPFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRSZXN1bHQ8Uj4+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHJlc29sdmVQcm9taXNlID0gcmVzb2x2ZTtcbiAgICAgIHJlamVjdFByb21pc2UgPSByZWplY3Q7XG4gICAgfSk7XG4gICAgY29uc3QgcmVhZFJlcXVlc3Q6IFJlYWRSZXF1ZXN0PFI+ID0ge1xuICAgICAgX2NodW5rU3RlcHM6IGNodW5rID0+IHJlc29sdmVQcm9taXNlKHsgdmFsdWU6IGNodW5rLCBkb25lOiBmYWxzZSB9KSxcbiAgICAgIF9jbG9zZVN0ZXBzOiAoKSA9PiByZXNvbHZlUHJvbWlzZSh7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfSksXG4gICAgICBfZXJyb3JTdGVwczogZSA9PiByZWplY3RQcm9taXNlKGUpXG4gICAgfTtcbiAgICBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXJSZWFkKHRoaXMsIHJlYWRSZXF1ZXN0KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWxlYXNlcyB0aGUgcmVhZGVyJ3MgbG9jayBvbiB0aGUgY29ycmVzcG9uZGluZyBzdHJlYW0uIEFmdGVyIHRoZSBsb2NrIGlzIHJlbGVhc2VkLCB0aGUgcmVhZGVyIGlzIG5vIGxvbmdlciBhY3RpdmUuXG4gICAqIElmIHRoZSBhc3NvY2lhdGVkIHN0cmVhbSBpcyBlcnJvcmVkIHdoZW4gdGhlIGxvY2sgaXMgcmVsZWFzZWQsIHRoZSByZWFkZXIgd2lsbCBhcHBlYXIgZXJyb3JlZCBpbiB0aGUgc2FtZSB3YXlcbiAgICogZnJvbSBub3cgb247IG90aGVyd2lzZSwgdGhlIHJlYWRlciB3aWxsIGFwcGVhciBjbG9zZWQuXG4gICAqXG4gICAqIEEgcmVhZGVyJ3MgbG9jayBjYW5ub3QgYmUgcmVsZWFzZWQgd2hpbGUgaXQgc3RpbGwgaGFzIGEgcGVuZGluZyByZWFkIHJlcXVlc3QsIGkuZS4sIGlmIGEgcHJvbWlzZSByZXR1cm5lZCBieVxuICAgKiB0aGUgcmVhZGVyJ3Mge0BsaW5rIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlci5yZWFkIHwgcmVhZCgpfSBtZXRob2QgaGFzIG5vdCB5ZXQgYmVlbiBzZXR0bGVkLiBBdHRlbXB0aW5nIHRvXG4gICAqIGRvIHNvIHdpbGwgdGhyb3cgYSBgVHlwZUVycm9yYCBhbmQgbGVhdmUgdGhlIHJlYWRlciBsb2NrZWQgdG8gdGhlIHN0cmVhbS5cbiAgICovXG4gIHJlbGVhc2VMb2NrKCk6IHZvaWQge1xuICAgIGlmICghSXNSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXIodGhpcykpIHtcbiAgICAgIHRocm93IGRlZmF1bHRSZWFkZXJCcmFuZENoZWNrRXhjZXB0aW9uKCdyZWxlYXNlTG9jaycpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9vd25lclJlYWRhYmxlU3RyZWFtID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXJSZWxlYXNlKHRoaXMpO1xuICB9XG59XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlci5wcm90b3R5cGUsIHtcbiAgY2FuY2VsOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgcmVhZDogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIHJlbGVhc2VMb2NrOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgY2xvc2VkOiB7IGVudW1lcmFibGU6IHRydWUgfVxufSk7XG5zZXRGdW5jdGlvbk5hbWUoUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyLnByb3RvdHlwZS5jYW5jZWwsICdjYW5jZWwnKTtcbnNldEZ1bmN0aW9uTmFtZShSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXIucHJvdG90eXBlLnJlYWQsICdyZWFkJyk7XG5zZXRGdW5jdGlvbk5hbWUoUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyLnByb3RvdHlwZS5yZWxlYXNlTG9jaywgJ3JlbGVhc2VMb2NrJyk7XG5pZiAodHlwZW9mIFN5bWJvbC50b1N0cmluZ1RhZyA9PT0gJ3N5bWJvbCcpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlci5wcm90b3R5cGUsIFN5bWJvbC50b1N0cmluZ1RhZywge1xuICAgIHZhbHVlOiAnUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyJyxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG59XG5cbi8vIEFic3RyYWN0IG9wZXJhdGlvbnMgZm9yIHRoZSByZWFkZXJzLlxuXG5leHBvcnQgZnVuY3Rpb24gSXNSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXI8UiA9IGFueT4oeDogYW55KTogeCBpcyBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXI8Uj4ge1xuICBpZiAoIXR5cGVJc09iamVjdCh4KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHgsICdfcmVhZFJlcXVlc3RzJykpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4geCBpbnN0YW5jZW9mIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlclJlYWQ8Uj4ocmVhZGVyOiBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXI8Uj4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWFkUmVxdWVzdDogUmVhZFJlcXVlc3Q8Uj4pOiB2b2lkIHtcbiAgY29uc3Qgc3RyZWFtID0gcmVhZGVyLl9vd25lclJlYWRhYmxlU3RyZWFtO1xuXG4gIGFzc2VydChzdHJlYW0gIT09IHVuZGVmaW5lZCk7XG5cbiAgc3RyZWFtLl9kaXN0dXJiZWQgPSB0cnVlO1xuXG4gIGlmIChzdHJlYW0uX3N0YXRlID09PSAnY2xvc2VkJykge1xuICAgIHJlYWRSZXF1ZXN0Ll9jbG9zZVN0ZXBzKCk7XG4gIH0gZWxzZSBpZiAoc3RyZWFtLl9zdGF0ZSA9PT0gJ2Vycm9yZWQnKSB7XG4gICAgcmVhZFJlcXVlc3QuX2Vycm9yU3RlcHMoc3RyZWFtLl9zdG9yZWRFcnJvcik7XG4gIH0gZWxzZSB7XG4gICAgYXNzZXJ0KHN0cmVhbS5fc3RhdGUgPT09ICdyZWFkYWJsZScpO1xuICAgIHN0cmVhbS5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyW1B1bGxTdGVwc10ocmVhZFJlcXVlc3QgYXMgUmVhZFJlcXVlc3Q8YW55Pik7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlclJlbGVhc2UocmVhZGVyOiBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXIpIHtcbiAgUmVhZGFibGVTdHJlYW1SZWFkZXJHZW5lcmljUmVsZWFzZShyZWFkZXIpO1xuICBjb25zdCBlID0gbmV3IFR5cGVFcnJvcignUmVhZGVyIHdhcyByZWxlYXNlZCcpO1xuICBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXJFcnJvclJlYWRSZXF1ZXN0cyhyZWFkZXIsIGUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyRXJyb3JSZWFkUmVxdWVzdHMocmVhZGVyOiBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXIsIGU6IGFueSkge1xuICBjb25zdCByZWFkUmVxdWVzdHMgPSByZWFkZXIuX3JlYWRSZXF1ZXN0cztcbiAgcmVhZGVyLl9yZWFkUmVxdWVzdHMgPSBuZXcgU2ltcGxlUXVldWUoKTtcbiAgcmVhZFJlcXVlc3RzLmZvckVhY2gocmVhZFJlcXVlc3QgPT4ge1xuICAgIHJlYWRSZXF1ZXN0Ll9lcnJvclN0ZXBzKGUpO1xuICB9KTtcbn1cblxuLy8gSGVscGVyIGZ1bmN0aW9ucyBmb3IgdGhlIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlci5cblxuZnVuY3Rpb24gZGVmYXVsdFJlYWRlckJyYW5kQ2hlY2tFeGNlcHRpb24obmFtZTogc3RyaW5nKTogVHlwZUVycm9yIHtcbiAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoXG4gICAgYFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlci5wcm90b3R5cGUuJHtuYW1lfSBjYW4gb25seSBiZSB1c2VkIG9uIGEgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyYCk7XG59XG4iLCAiLy8vIDxyZWZlcmVuY2UgbGliPVwiZXMyMDE4LmFzeW5jaXRlcmFibGVcIiAvPlxuXG4vKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZW1wdHktZnVuY3Rpb24gKi9cbmV4cG9ydCBjb25zdCBBc3luY0l0ZXJhdG9yUHJvdG90eXBlOiBBc3luY0l0ZXJhYmxlPGFueT4gPVxuICBPYmplY3QuZ2V0UHJvdG90eXBlT2YoT2JqZWN0LmdldFByb3RvdHlwZU9mKGFzeW5jIGZ1bmN0aW9uKiAoKTogQXN5bmNJdGVyYWJsZUl0ZXJhdG9yPGFueT4ge30pLnByb3RvdHlwZSk7XG4iLCAiLy8vIDxyZWZlcmVuY2UgbGliPVwiZXMyMDE4LmFzeW5jaXRlcmFibGVcIiAvPlxuXG5pbXBvcnQgeyBSZWFkYWJsZVN0cmVhbSB9IGZyb20gJy4uL3JlYWRhYmxlLXN0cmVhbSc7XG5pbXBvcnQge1xuICBBY3F1aXJlUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyLFxuICBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXIsXG4gIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlclJlYWQsXG4gIHR5cGUgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZFJlc3VsdCxcbiAgdHlwZSBSZWFkUmVxdWVzdFxufSBmcm9tICcuL2RlZmF1bHQtcmVhZGVyJztcbmltcG9ydCB7IFJlYWRhYmxlU3RyZWFtUmVhZGVyR2VuZXJpY0NhbmNlbCwgUmVhZGFibGVTdHJlYW1SZWFkZXJHZW5lcmljUmVsZWFzZSB9IGZyb20gJy4vZ2VuZXJpYy1yZWFkZXInO1xuaW1wb3J0IGFzc2VydCBmcm9tICcuLi8uLi9zdHViL2Fzc2VydCc7XG5pbXBvcnQgeyBBc3luY0l0ZXJhdG9yUHJvdG90eXBlIH0gZnJvbSAnQEB0YXJnZXQvc3R1Yi9hc3luYy1pdGVyYXRvci1wcm90b3R5cGUnO1xuaW1wb3J0IHsgdHlwZUlzT2JqZWN0IH0gZnJvbSAnLi4vaGVscGVycy9taXNjZWxsYW5lb3VzJztcbmltcG9ydCB7XG4gIG5ld1Byb21pc2UsXG4gIHByb21pc2VSZWplY3RlZFdpdGgsXG4gIHByb21pc2VSZXNvbHZlZFdpdGgsXG4gIHF1ZXVlTWljcm90YXNrLFxuICB0cmFuc2Zvcm1Qcm9taXNlV2l0aFxufSBmcm9tICcuLi9oZWxwZXJzL3dlYmlkbCc7XG5cbi8qKlxuICogQW4gYXN5bmMgaXRlcmF0b3IgcmV0dXJuZWQgYnkge0BsaW5rIFJlYWRhYmxlU3RyZWFtLnZhbHVlc30uXG4gKlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgaW50ZXJmYWNlIFJlYWRhYmxlU3RyZWFtQXN5bmNJdGVyYXRvcjxSPiBleHRlbmRzIEFzeW5jSXRlcmFibGVJdGVyYXRvcjxSPiB7XG4gIG5leHQoKTogUHJvbWlzZTxJdGVyYXRvclJlc3VsdDxSLCB1bmRlZmluZWQ+PjtcblxuICByZXR1cm4odmFsdWU/OiBhbnkpOiBQcm9taXNlPEl0ZXJhdG9yUmVzdWx0PGFueT4+O1xufVxuXG5leHBvcnQgY2xhc3MgUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9ySW1wbDxSPiB7XG4gIHByaXZhdGUgcmVhZG9ubHkgX3JlYWRlcjogUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyPFI+O1xuICBwcml2YXRlIHJlYWRvbmx5IF9wcmV2ZW50Q2FuY2VsOiBib29sZWFuO1xuICBwcml2YXRlIF9vbmdvaW5nUHJvbWlzZTogUHJvbWlzZTxSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkUmVzdWx0PFI+PiB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgcHJpdmF0ZSBfaXNGaW5pc2hlZCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHJlYWRlcjogUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyPFI+LCBwcmV2ZW50Q2FuY2VsOiBib29sZWFuKSB7XG4gICAgdGhpcy5fcmVhZGVyID0gcmVhZGVyO1xuICAgIHRoaXMuX3ByZXZlbnRDYW5jZWwgPSBwcmV2ZW50Q2FuY2VsO1xuICB9XG5cbiAgbmV4dCgpOiBQcm9taXNlPFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRSZXN1bHQ8Uj4+IHtcbiAgICBjb25zdCBuZXh0U3RlcHMgPSAoKSA9PiB0aGlzLl9uZXh0U3RlcHMoKTtcbiAgICB0aGlzLl9vbmdvaW5nUHJvbWlzZSA9IHRoaXMuX29uZ29pbmdQcm9taXNlID9cbiAgICAgIHRyYW5zZm9ybVByb21pc2VXaXRoKHRoaXMuX29uZ29pbmdQcm9taXNlLCBuZXh0U3RlcHMsIG5leHRTdGVwcykgOlxuICAgICAgbmV4dFN0ZXBzKCk7XG4gICAgcmV0dXJuIHRoaXMuX29uZ29pbmdQcm9taXNlO1xuICB9XG5cbiAgcmV0dXJuKHZhbHVlOiBhbnkpOiBQcm9taXNlPFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRSZXN1bHQ8YW55Pj4ge1xuICAgIGNvbnN0IHJldHVyblN0ZXBzID0gKCkgPT4gdGhpcy5fcmV0dXJuU3RlcHModmFsdWUpO1xuICAgIHJldHVybiB0aGlzLl9vbmdvaW5nUHJvbWlzZSA/XG4gICAgICB0cmFuc2Zvcm1Qcm9taXNlV2l0aCh0aGlzLl9vbmdvaW5nUHJvbWlzZSwgcmV0dXJuU3RlcHMsIHJldHVyblN0ZXBzKSA6XG4gICAgICByZXR1cm5TdGVwcygpO1xuICB9XG5cbiAgcHJpdmF0ZSBfbmV4dFN0ZXBzKCk6IFByb21pc2U8UmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZFJlc3VsdDxSPj4ge1xuICAgIGlmICh0aGlzLl9pc0ZpbmlzaGVkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9KTtcbiAgICB9XG5cbiAgICBjb25zdCByZWFkZXIgPSB0aGlzLl9yZWFkZXI7XG4gICAgYXNzZXJ0KHJlYWRlci5fb3duZXJSZWFkYWJsZVN0cmVhbSAhPT0gdW5kZWZpbmVkKTtcblxuICAgIGxldCByZXNvbHZlUHJvbWlzZSE6IChyZXN1bHQ6IFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRSZXN1bHQ8Uj4pID0+IHZvaWQ7XG4gICAgbGV0IHJlamVjdFByb21pc2UhOiAocmVhc29uOiBhbnkpID0+IHZvaWQ7XG4gICAgY29uc3QgcHJvbWlzZSA9IG5ld1Byb21pc2U8UmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZFJlc3VsdDxSPj4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgcmVzb2x2ZVByb21pc2UgPSByZXNvbHZlO1xuICAgICAgcmVqZWN0UHJvbWlzZSA9IHJlamVjdDtcbiAgICB9KTtcbiAgICBjb25zdCByZWFkUmVxdWVzdDogUmVhZFJlcXVlc3Q8Uj4gPSB7XG4gICAgICBfY2h1bmtTdGVwczogY2h1bmsgPT4ge1xuICAgICAgICB0aGlzLl9vbmdvaW5nUHJvbWlzZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgLy8gVGhpcyBuZWVkcyB0byBiZSBkZWxheWVkIGJ5IG9uZSBtaWNyb3Rhc2ssIG90aGVyd2lzZSB3ZSBzdG9wIHB1bGxpbmcgdG9vIGVhcmx5IHdoaWNoIGJyZWFrcyBhIHRlc3QuXG4gICAgICAgIC8vIEZJWE1FIElzIHRoaXMgYSBidWcgaW4gdGhlIHNwZWNpZmljYXRpb24sIG9yIGluIHRoZSB0ZXN0P1xuICAgICAgICBxdWV1ZU1pY3JvdGFzaygoKSA9PiByZXNvbHZlUHJvbWlzZSh7IHZhbHVlOiBjaHVuaywgZG9uZTogZmFsc2UgfSkpO1xuICAgICAgfSxcbiAgICAgIF9jbG9zZVN0ZXBzOiAoKSA9PiB7XG4gICAgICAgIHRoaXMuX29uZ29pbmdQcm9taXNlID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLl9pc0ZpbmlzaGVkID0gdHJ1ZTtcbiAgICAgICAgUmVhZGFibGVTdHJlYW1SZWFkZXJHZW5lcmljUmVsZWFzZShyZWFkZXIpO1xuICAgICAgICByZXNvbHZlUHJvbWlzZSh7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfSk7XG4gICAgICB9LFxuICAgICAgX2Vycm9yU3RlcHM6IHJlYXNvbiA9PiB7XG4gICAgICAgIHRoaXMuX29uZ29pbmdQcm9taXNlID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLl9pc0ZpbmlzaGVkID0gdHJ1ZTtcbiAgICAgICAgUmVhZGFibGVTdHJlYW1SZWFkZXJHZW5lcmljUmVsZWFzZShyZWFkZXIpO1xuICAgICAgICByZWplY3RQcm9taXNlKHJlYXNvbik7XG4gICAgICB9XG4gICAgfTtcbiAgICBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXJSZWFkKHJlYWRlciwgcmVhZFJlcXVlc3QpO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgcHJpdmF0ZSBfcmV0dXJuU3RlcHModmFsdWU6IGFueSk6IFByb21pc2U8UmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZFJlc3VsdDxhbnk+PiB7XG4gICAgaWYgKHRoaXMuX2lzRmluaXNoZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoeyB2YWx1ZSwgZG9uZTogdHJ1ZSB9KTtcbiAgICB9XG4gICAgdGhpcy5faXNGaW5pc2hlZCA9IHRydWU7XG5cbiAgICBjb25zdCByZWFkZXIgPSB0aGlzLl9yZWFkZXI7XG4gICAgYXNzZXJ0KHJlYWRlci5fb3duZXJSZWFkYWJsZVN0cmVhbSAhPT0gdW5kZWZpbmVkKTtcbiAgICBhc3NlcnQocmVhZGVyLl9yZWFkUmVxdWVzdHMubGVuZ3RoID09PSAwKTtcblxuICAgIGlmICghdGhpcy5fcHJldmVudENhbmNlbCkge1xuICAgICAgY29uc3QgcmVzdWx0ID0gUmVhZGFibGVTdHJlYW1SZWFkZXJHZW5lcmljQ2FuY2VsKHJlYWRlciwgdmFsdWUpO1xuICAgICAgUmVhZGFibGVTdHJlYW1SZWFkZXJHZW5lcmljUmVsZWFzZShyZWFkZXIpO1xuICAgICAgcmV0dXJuIHRyYW5zZm9ybVByb21pc2VXaXRoKHJlc3VsdCwgKCkgPT4gKHsgdmFsdWUsIGRvbmU6IHRydWUgfSkpO1xuICAgIH1cblxuICAgIFJlYWRhYmxlU3RyZWFtUmVhZGVyR2VuZXJpY1JlbGVhc2UocmVhZGVyKTtcbiAgICByZXR1cm4gcHJvbWlzZVJlc29sdmVkV2l0aCh7IHZhbHVlLCBkb25lOiB0cnVlIH0pO1xuICB9XG59XG5cbmludGVyZmFjZSBSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3JJbnN0YW5jZTxSPiBleHRlbmRzIFJlYWRhYmxlU3RyZWFtQXN5bmNJdGVyYXRvcjxSPiB7XG4gIC8qKiBAaW50ZXJhbCAqL1xuICBfYXN5bmNJdGVyYXRvckltcGw6IFJlYWRhYmxlU3RyZWFtQXN5bmNJdGVyYXRvckltcGw8Uj47XG5cbiAgbmV4dCgpOiBQcm9taXNlPEl0ZXJhdG9yUmVzdWx0PFIsIHVuZGVmaW5lZD4+O1xuXG4gIHJldHVybih2YWx1ZT86IGFueSk6IFByb21pc2U8SXRlcmF0b3JSZXN1bHQ8YW55Pj47XG59XG5cbmNvbnN0IFJlYWRhYmxlU3RyZWFtQXN5bmNJdGVyYXRvclByb3RvdHlwZTogUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9ySW5zdGFuY2U8YW55PiA9IHtcbiAgbmV4dCh0aGlzOiBSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3JJbnN0YW5jZTxhbnk+KTogUHJvbWlzZTxSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkUmVzdWx0PGFueT4+IHtcbiAgICBpZiAoIUlzUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9yKHRoaXMpKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChzdHJlYW1Bc3luY0l0ZXJhdG9yQnJhbmRDaGVja0V4Y2VwdGlvbignbmV4dCcpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2FzeW5jSXRlcmF0b3JJbXBsLm5leHQoKTtcbiAgfSxcblxuICByZXR1cm4odGhpczogUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9ySW5zdGFuY2U8YW55PiwgdmFsdWU6IGFueSk6IFByb21pc2U8UmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZFJlc3VsdDxhbnk+PiB7XG4gICAgaWYgKCFJc1JlYWRhYmxlU3RyZWFtQXN5bmNJdGVyYXRvcih0aGlzKSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoc3RyZWFtQXN5bmNJdGVyYXRvckJyYW5kQ2hlY2tFeGNlcHRpb24oJ3JldHVybicpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2FzeW5jSXRlcmF0b3JJbXBsLnJldHVybih2YWx1ZSk7XG4gIH1cbn0gYXMgYW55O1xuT2JqZWN0LnNldFByb3RvdHlwZU9mKFJlYWRhYmxlU3RyZWFtQXN5bmNJdGVyYXRvclByb3RvdHlwZSwgQXN5bmNJdGVyYXRvclByb3RvdHlwZSk7XG5cbi8vIEFic3RyYWN0IG9wZXJhdGlvbnMgZm9yIHRoZSBSZWFkYWJsZVN0cmVhbS5cblxuZXhwb3J0IGZ1bmN0aW9uIEFjcXVpcmVSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3I8Uj4oc3RyZWFtOiBSZWFkYWJsZVN0cmVhbTxSPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXZlbnRDYW5jZWw6IGJvb2xlYW4pOiBSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3I8Uj4ge1xuICBjb25zdCByZWFkZXIgPSBBY3F1aXJlUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyPFI+KHN0cmVhbSk7XG4gIGNvbnN0IGltcGwgPSBuZXcgUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9ySW1wbChyZWFkZXIsIHByZXZlbnRDYW5jZWwpO1xuICBjb25zdCBpdGVyYXRvcjogUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9ySW5zdGFuY2U8Uj4gPSBPYmplY3QuY3JlYXRlKFJlYWRhYmxlU3RyZWFtQXN5bmNJdGVyYXRvclByb3RvdHlwZSk7XG4gIGl0ZXJhdG9yLl9hc3luY0l0ZXJhdG9ySW1wbCA9IGltcGw7XG4gIHJldHVybiBpdGVyYXRvcjtcbn1cblxuZnVuY3Rpb24gSXNSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3I8UiA9IGFueT4oeDogYW55KTogeCBpcyBSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3I8Uj4ge1xuICBpZiAoIXR5cGVJc09iamVjdCh4KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHgsICdfYXN5bmNJdGVyYXRvckltcGwnKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgLy8gbm9pbnNwZWN0aW9uIFN1c3BpY2lvdXNUeXBlT2ZHdWFyZFxuICAgIHJldHVybiAoeCBhcyBSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3JJbnN0YW5jZTxhbnk+KS5fYXN5bmNJdGVyYXRvckltcGwgaW5zdGFuY2VvZlxuICAgICAgUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9ySW1wbDtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbi8vIEhlbHBlciBmdW5jdGlvbnMgZm9yIHRoZSBSZWFkYWJsZVN0cmVhbS5cblxuZnVuY3Rpb24gc3RyZWFtQXN5bmNJdGVyYXRvckJyYW5kQ2hlY2tFeGNlcHRpb24obmFtZTogc3RyaW5nKTogVHlwZUVycm9yIHtcbiAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoYFJlYWRhYmxlU3RyZWFtQXN5bmNJdGVyYXRvci4ke25hbWV9IGNhbiBvbmx5IGJlIHVzZWQgb24gYSBSZWFkYWJsZVN0ZWFtQXN5bmNJdGVyYXRvcmApO1xufVxuIiwgIi8vLyA8cmVmZXJlbmNlIGxpYj1cImVzMjAxNS5jb3JlXCIgLz5cblxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvTnVtYmVyL2lzTmFOI1BvbHlmaWxsXG5jb25zdCBOdW1iZXJJc05hTjogdHlwZW9mIE51bWJlci5pc05hTiA9IE51bWJlci5pc05hTiB8fCBmdW5jdGlvbiAoeCkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlXG4gIHJldHVybiB4ICE9PSB4O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgTnVtYmVySXNOYU47XG4iLCAiaW1wb3J0IHsgcmVmbGVjdENhbGwgfSBmcm9tICdsaWIvaGVscGVycy93ZWJpZGwnO1xuaW1wb3J0IHsgdHlwZUlzT2JqZWN0IH0gZnJvbSAnLi4vaGVscGVycy9taXNjZWxsYW5lb3VzJztcbmltcG9ydCBhc3NlcnQgZnJvbSAnLi4vLi4vc3R1Yi9hc3NlcnQnO1xuXG5kZWNsYXJlIGdsb2JhbCB7XG4gIGludGVyZmFjZSBBcnJheUJ1ZmZlciB7XG4gICAgcmVhZG9ubHkgZGV0YWNoZWQ6IGJvb2xlYW47XG5cbiAgICB0cmFuc2ZlcigpOiBBcnJheUJ1ZmZlcjtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0cnVjdHVyZWRDbG9uZTxUPih2YWx1ZTogVCwgb3B0aW9uczogeyB0cmFuc2ZlcjogQXJyYXlCdWZmZXJbXSB9KTogVDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIENyZWF0ZUFycmF5RnJvbUxpc3Q8VCBleHRlbmRzIGFueVtdPihlbGVtZW50czogVCk6IFQge1xuICAvLyBXZSB1c2UgYXJyYXlzIHRvIHJlcHJlc2VudCBsaXN0cywgc28gdGhpcyBpcyBiYXNpY2FsbHkgYSBuby1vcC5cbiAgLy8gRG8gYSBzbGljZSB0aG91Z2gganVzdCBpbiBjYXNlIHdlIGhhcHBlbiB0byBkZXBlbmQgb24gdGhlIHVuaXF1ZS1uZXNzLlxuICByZXR1cm4gZWxlbWVudHMuc2xpY2UoKSBhcyBUO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQ29weURhdGFCbG9ja0J5dGVzKGRlc3Q6IEFycmF5QnVmZmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXN0T2Zmc2V0OiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyYzogQXJyYXlCdWZmZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyY09mZnNldDogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuOiBudW1iZXIpIHtcbiAgbmV3IFVpbnQ4QXJyYXkoZGVzdCkuc2V0KG5ldyBVaW50OEFycmF5KHNyYywgc3JjT2Zmc2V0LCBuKSwgZGVzdE9mZnNldCk7XG59XG5cbmV4cG9ydCBsZXQgVHJhbnNmZXJBcnJheUJ1ZmZlciA9IChPOiBBcnJheUJ1ZmZlcik6IEFycmF5QnVmZmVyID0+IHtcbiAgaWYgKHR5cGVvZiBPLnRyYW5zZmVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgVHJhbnNmZXJBcnJheUJ1ZmZlciA9IGJ1ZmZlciA9PiBidWZmZXIudHJhbnNmZXIoKTtcbiAgfSBlbHNlIGlmICh0eXBlb2Ygc3RydWN0dXJlZENsb25lID09PSAnZnVuY3Rpb24nKSB7XG4gICAgVHJhbnNmZXJBcnJheUJ1ZmZlciA9IGJ1ZmZlciA9PiBzdHJ1Y3R1cmVkQ2xvbmUoYnVmZmVyLCB7IHRyYW5zZmVyOiBbYnVmZmVyXSB9KTtcbiAgfSBlbHNlIHtcbiAgICAvLyBOb3QgaW1wbGVtZW50ZWQgY29ycmVjdGx5XG4gICAgVHJhbnNmZXJBcnJheUJ1ZmZlciA9IGJ1ZmZlciA9PiBidWZmZXI7XG4gIH1cbiAgcmV0dXJuIFRyYW5zZmVyQXJyYXlCdWZmZXIoTyk7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gQ2FuVHJhbnNmZXJBcnJheUJ1ZmZlcihPOiBBcnJheUJ1ZmZlcik6IGJvb2xlYW4ge1xuICByZXR1cm4gIUlzRGV0YWNoZWRCdWZmZXIoTyk7XG59XG5cbmV4cG9ydCBsZXQgSXNEZXRhY2hlZEJ1ZmZlciA9IChPOiBBcnJheUJ1ZmZlcik6IGJvb2xlYW4gPT4ge1xuICBpZiAodHlwZW9mIE8uZGV0YWNoZWQgPT09ICdib29sZWFuJykge1xuICAgIElzRGV0YWNoZWRCdWZmZXIgPSBidWZmZXIgPT4gYnVmZmVyLmRldGFjaGVkO1xuICB9IGVsc2Uge1xuICAgIC8vIE5vdCBpbXBsZW1lbnRlZCBjb3JyZWN0bHlcbiAgICBJc0RldGFjaGVkQnVmZmVyID0gYnVmZmVyID0+IGJ1ZmZlci5ieXRlTGVuZ3RoID09PSAwO1xuICB9XG4gIHJldHVybiBJc0RldGFjaGVkQnVmZmVyKE8pO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIEFycmF5QnVmZmVyU2xpY2UoYnVmZmVyOiBBcnJheUJ1ZmZlciwgYmVnaW46IG51bWJlciwgZW5kOiBudW1iZXIpOiBBcnJheUJ1ZmZlciB7XG4gIC8vIEFycmF5QnVmZmVyLnByb3RvdHlwZS5zbGljZSBpcyBub3QgYXZhaWxhYmxlIG9uIElFMTBcbiAgLy8gaHR0cHM6Ly93d3cuY2FuaXVzZS5jb20vbWRuLWphdmFzY3JpcHRfYnVpbHRpbnNfYXJyYXlidWZmZXJfc2xpY2VcbiAgaWYgKGJ1ZmZlci5zbGljZSkge1xuICAgIHJldHVybiBidWZmZXIuc2xpY2UoYmVnaW4sIGVuZCk7XG4gIH1cbiAgY29uc3QgbGVuZ3RoID0gZW5kIC0gYmVnaW47XG4gIGNvbnN0IHNsaWNlID0gbmV3IEFycmF5QnVmZmVyKGxlbmd0aCk7XG4gIENvcHlEYXRhQmxvY2tCeXRlcyhzbGljZSwgMCwgYnVmZmVyLCBiZWdpbiwgbGVuZ3RoKTtcbiAgcmV0dXJuIHNsaWNlO1xufVxuXG5leHBvcnQgdHlwZSBNZXRob2ROYW1lPFQ+ID0ge1xuICBbUCBpbiBrZXlvZiBUXTogVFtQXSBleHRlbmRzIEZ1bmN0aW9uIHwgdW5kZWZpbmVkID8gUCA6IG5ldmVyO1xufVtrZXlvZiBUXTtcblxuZXhwb3J0IGZ1bmN0aW9uIEdldE1ldGhvZDxULCBLIGV4dGVuZHMgTWV0aG9kTmFtZTxUPj4ocmVjZWl2ZXI6IFQsIHByb3A6IEspOiBUW0tdIHwgdW5kZWZpbmVkIHtcbiAgY29uc3QgZnVuYyA9IHJlY2VpdmVyW3Byb3BdO1xuICBpZiAoZnVuYyA9PT0gdW5kZWZpbmVkIHx8IGZ1bmMgPT09IG51bGwpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIGlmICh0eXBlb2YgZnVuYyAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYCR7U3RyaW5nKHByb3ApfSBpcyBub3QgYSBmdW5jdGlvbmApO1xuICB9XG4gIHJldHVybiBmdW5jO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFN5bmNJdGVyYXRvclJlY29yZDxUPiB7XG4gIGl0ZXJhdG9yOiBJdGVyYXRvcjxUPixcbiAgbmV4dE1ldGhvZDogSXRlcmF0b3I8VD5bJ25leHQnXSxcbiAgZG9uZTogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBc3luY0l0ZXJhdG9yUmVjb3JkPFQ+IHtcbiAgaXRlcmF0b3I6IEFzeW5jSXRlcmF0b3I8VD4sXG4gIG5leHRNZXRob2Q6IEFzeW5jSXRlcmF0b3I8VD5bJ25leHQnXSxcbiAgZG9uZTogYm9vbGVhbjtcbn1cblxuZXhwb3J0IHR5cGUgU3luY09yQXN5bmNJdGVyYXRvclJlY29yZDxUPiA9IFN5bmNJdGVyYXRvclJlY29yZDxUPiB8IEFzeW5jSXRlcmF0b3JSZWNvcmQ8VD47XG5cbmV4cG9ydCBmdW5jdGlvbiBDcmVhdGVBc3luY0Zyb21TeW5jSXRlcmF0b3I8VD4oc3luY0l0ZXJhdG9yUmVjb3JkOiBTeW5jSXRlcmF0b3JSZWNvcmQ8VD4pOiBBc3luY0l0ZXJhdG9yUmVjb3JkPFQ+IHtcbiAgLy8gSW5zdGVhZCBvZiByZS1pbXBsZW1lbnRpbmcgQ3JlYXRlQXN5bmNGcm9tU3luY0l0ZXJhdG9yIGFuZCAlQXN5bmNGcm9tU3luY0l0ZXJhdG9yUHJvdG90eXBlJSxcbiAgLy8gd2UgdXNlIHlpZWxkKiBpbnNpZGUgYW4gYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIHRvIGFjaGlldmUgdGhlIHNhbWUgcmVzdWx0LlxuXG4gIC8vIFdyYXAgdGhlIHN5bmMgaXRlcmF0b3IgaW5zaWRlIGEgc3luYyBpdGVyYWJsZSwgc28gd2UgY2FuIHVzZSBpdCB3aXRoIHlpZWxkKi5cbiAgY29uc3Qgc3luY0l0ZXJhYmxlID0ge1xuICAgIFtTeW1ib2wuaXRlcmF0b3JdOiAoKSA9PiBzeW5jSXRlcmF0b3JSZWNvcmQuaXRlcmF0b3JcbiAgfTtcbiAgLy8gQ3JlYXRlIGFuIGFzeW5jIGdlbmVyYXRvciBmdW5jdGlvbiBhbmQgaW1tZWRpYXRlbHkgaW52b2tlIGl0LlxuICBjb25zdCBhc3luY0l0ZXJhdG9yID0gKGFzeW5jIGZ1bmN0aW9uKiAoKSB7XG4gICAgcmV0dXJuIHlpZWxkKiBzeW5jSXRlcmFibGU7XG4gIH0oKSk7XG4gIC8vIFJldHVybiBhcyBhbiBhc3luYyBpdGVyYXRvciByZWNvcmQuXG4gIGNvbnN0IG5leHRNZXRob2QgPSBhc3luY0l0ZXJhdG9yLm5leHQ7XG4gIHJldHVybiB7IGl0ZXJhdG9yOiBhc3luY0l0ZXJhdG9yLCBuZXh0TWV0aG9kLCBkb25lOiBmYWxzZSB9O1xufVxuXG4vLyBBbGlnbnMgd2l0aCBjb3JlLWpzL21vZHVsZXMvZXMuc3ltYm9sLmFzeW5jLWl0ZXJhdG9yLmpzXG5leHBvcnQgY29uc3QgU3ltYm9sQXN5bmNJdGVyYXRvcjogKHR5cGVvZiBTeW1ib2wpWydhc3luY0l0ZXJhdG9yJ10gPVxuICBTeW1ib2wuYXN5bmNJdGVyYXRvciA/P1xuICBTeW1ib2wuZm9yPy4oJ1N5bWJvbC5hc3luY0l0ZXJhdG9yJykgPz9cbiAgJ0BAYXN5bmNJdGVyYXRvcic7XG5cbmV4cG9ydCB0eXBlIFN5bmNPckFzeW5jSXRlcmFibGU8VD4gPSBJdGVyYWJsZTxUPiB8IEFzeW5jSXRlcmFibGU8VD47XG5leHBvcnQgdHlwZSBTeW5jT3JBc3luY0l0ZXJhdG9yTWV0aG9kPFQ+ID0gKCkgPT4gKEl0ZXJhdG9yPFQ+IHwgQXN5bmNJdGVyYXRvcjxUPik7XG5cbmZ1bmN0aW9uIEdldEl0ZXJhdG9yPFQ+KFxuICBvYmo6IFN5bmNPckFzeW5jSXRlcmFibGU8VD4sXG4gIGhpbnQ6ICdhc3luYycsXG4gIG1ldGhvZD86IFN5bmNPckFzeW5jSXRlcmF0b3JNZXRob2Q8VD5cbik6IEFzeW5jSXRlcmF0b3JSZWNvcmQ8VD47XG5mdW5jdGlvbiBHZXRJdGVyYXRvcjxUPihcbiAgb2JqOiBJdGVyYWJsZTxUPixcbiAgaGludDogJ3N5bmMnLFxuICBtZXRob2Q/OiBTeW5jT3JBc3luY0l0ZXJhdG9yTWV0aG9kPFQ+XG4pOiBTeW5jSXRlcmF0b3JSZWNvcmQ8VD47XG5mdW5jdGlvbiBHZXRJdGVyYXRvcjxUPihcbiAgb2JqOiBTeW5jT3JBc3luY0l0ZXJhYmxlPFQ+LFxuICBoaW50ID0gJ3N5bmMnLFxuICBtZXRob2Q/OiBTeW5jT3JBc3luY0l0ZXJhdG9yTWV0aG9kPFQ+XG4pOiBTeW5jT3JBc3luY0l0ZXJhdG9yUmVjb3JkPFQ+IHtcbiAgYXNzZXJ0KGhpbnQgPT09ICdzeW5jJyB8fCBoaW50ID09PSAnYXN5bmMnKTtcbiAgaWYgKG1ldGhvZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgaWYgKGhpbnQgPT09ICdhc3luYycpIHtcbiAgICAgIG1ldGhvZCA9IEdldE1ldGhvZChvYmogYXMgQXN5bmNJdGVyYWJsZTxUPiwgU3ltYm9sQXN5bmNJdGVyYXRvcik7XG4gICAgICBpZiAobWV0aG9kID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc3Qgc3luY01ldGhvZCA9IEdldE1ldGhvZChvYmogYXMgSXRlcmFibGU8VD4sIFN5bWJvbC5pdGVyYXRvcik7XG4gICAgICAgIGNvbnN0IHN5bmNJdGVyYXRvclJlY29yZCA9IEdldEl0ZXJhdG9yKG9iaiBhcyBJdGVyYWJsZTxUPiwgJ3N5bmMnLCBzeW5jTWV0aG9kKTtcbiAgICAgICAgcmV0dXJuIENyZWF0ZUFzeW5jRnJvbVN5bmNJdGVyYXRvcihzeW5jSXRlcmF0b3JSZWNvcmQpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBtZXRob2QgPSBHZXRNZXRob2Qob2JqIGFzIEl0ZXJhYmxlPFQ+LCBTeW1ib2wuaXRlcmF0b3IpO1xuICAgIH1cbiAgfVxuICBpZiAobWV0aG9kID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgb2JqZWN0IGlzIG5vdCBpdGVyYWJsZScpO1xuICB9XG4gIGNvbnN0IGl0ZXJhdG9yID0gcmVmbGVjdENhbGwobWV0aG9kLCBvYmosIFtdKTtcbiAgaWYgKCF0eXBlSXNPYmplY3QoaXRlcmF0b3IpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIGl0ZXJhdG9yIG1ldGhvZCBtdXN0IHJldHVybiBhbiBvYmplY3QnKTtcbiAgfVxuICBjb25zdCBuZXh0TWV0aG9kID0gaXRlcmF0b3IubmV4dDtcbiAgcmV0dXJuIHsgaXRlcmF0b3IsIG5leHRNZXRob2QsIGRvbmU6IGZhbHNlIH0gYXMgU3luY09yQXN5bmNJdGVyYXRvclJlY29yZDxUPjtcbn1cblxuZXhwb3J0IHsgR2V0SXRlcmF0b3IgfTtcblxuZXhwb3J0IGZ1bmN0aW9uIEl0ZXJhdG9yTmV4dDxUPihpdGVyYXRvclJlY29yZDogQXN5bmNJdGVyYXRvclJlY29yZDxUPik6IFByb21pc2U8SXRlcmF0b3JSZXN1bHQ8VD4+IHtcbiAgY29uc3QgcmVzdWx0ID0gcmVmbGVjdENhbGwoaXRlcmF0b3JSZWNvcmQubmV4dE1ldGhvZCwgaXRlcmF0b3JSZWNvcmQuaXRlcmF0b3IsIFtdKTtcbiAgaWYgKCF0eXBlSXNPYmplY3QocmVzdWx0KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBpdGVyYXRvci5uZXh0KCkgbWV0aG9kIG11c3QgcmV0dXJuIGFuIG9iamVjdCcpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBJdGVyYXRvckNvbXBsZXRlPFRSZXR1cm4+KFxuICBpdGVyUmVzdWx0OiBJdGVyYXRvclJlc3VsdDx1bmtub3duLCBUUmV0dXJuPlxuKTogaXRlclJlc3VsdCBpcyBJdGVyYXRvclJldHVyblJlc3VsdDxUUmV0dXJuPiB7XG4gIGFzc2VydCh0eXBlSXNPYmplY3QoaXRlclJlc3VsdCkpO1xuICByZXR1cm4gQm9vbGVhbihpdGVyUmVzdWx0LmRvbmUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gSXRlcmF0b3JWYWx1ZTxUPihpdGVyUmVzdWx0OiBJdGVyYXRvcllpZWxkUmVzdWx0PFQ+KTogVCB7XG4gIGFzc2VydCh0eXBlSXNPYmplY3QoaXRlclJlc3VsdCkpO1xuICByZXR1cm4gaXRlclJlc3VsdC52YWx1ZTtcbn1cbiIsICJpbXBvcnQgTnVtYmVySXNOYU4gZnJvbSAnLi4vLi4vc3R1Yi9udW1iZXItaXNuYW4nO1xuaW1wb3J0IHsgQXJyYXlCdWZmZXJTbGljZSB9IGZyb20gJy4vZWNtYXNjcmlwdCc7XG5pbXBvcnQgdHlwZSB7IE5vblNoYXJlZCB9IGZyb20gJy4uL2hlbHBlcnMvYXJyYXktYnVmZmVyLXZpZXcnO1xuXG5leHBvcnQgZnVuY3Rpb24gSXNOb25OZWdhdGl2ZU51bWJlcih2OiBudW1iZXIpOiBib29sZWFuIHtcbiAgaWYgKHR5cGVvZiB2ICE9PSAnbnVtYmVyJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChOdW1iZXJJc05hTih2KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICh2IDwgMCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQ2xvbmVBc1VpbnQ4QXJyYXkoTzogTm9uU2hhcmVkPEFycmF5QnVmZmVyVmlldz4pOiBOb25TaGFyZWQ8VWludDhBcnJheT4ge1xuICBjb25zdCBidWZmZXIgPSBBcnJheUJ1ZmZlclNsaWNlKE8uYnVmZmVyLCBPLmJ5dGVPZmZzZXQsIE8uYnl0ZU9mZnNldCArIE8uYnl0ZUxlbmd0aCk7XG4gIHJldHVybiBuZXcgVWludDhBcnJheShidWZmZXIpIGFzIE5vblNoYXJlZDxVaW50OEFycmF5Pjtcbn1cbiIsICJpbXBvcnQgYXNzZXJ0IGZyb20gJy4uLy4uL3N0dWIvYXNzZXJ0JztcbmltcG9ydCB7IFNpbXBsZVF1ZXVlIH0gZnJvbSAnLi4vc2ltcGxlLXF1ZXVlJztcbmltcG9ydCB7IElzTm9uTmVnYXRpdmVOdW1iZXIgfSBmcm9tICcuL21pc2NlbGxhbmVvdXMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFF1ZXVlQ29udGFpbmVyPFQ+IHtcbiAgX3F1ZXVlOiBTaW1wbGVRdWV1ZTxUPjtcbiAgX3F1ZXVlVG90YWxTaXplOiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUXVldWVQYWlyPFQ+IHtcbiAgdmFsdWU6IFQ7XG4gIHNpemU6IG51bWJlcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIERlcXVldWVWYWx1ZTxUPihjb250YWluZXI6IFF1ZXVlQ29udGFpbmVyPFF1ZXVlUGFpcjxUPj4pOiBUIHtcbiAgYXNzZXJ0KCdfcXVldWUnIGluIGNvbnRhaW5lciAmJiAnX3F1ZXVlVG90YWxTaXplJyBpbiBjb250YWluZXIpO1xuICBhc3NlcnQoY29udGFpbmVyLl9xdWV1ZS5sZW5ndGggPiAwKTtcblxuICBjb25zdCBwYWlyID0gY29udGFpbmVyLl9xdWV1ZS5zaGlmdCgpITtcbiAgY29udGFpbmVyLl9xdWV1ZVRvdGFsU2l6ZSAtPSBwYWlyLnNpemU7XG4gIGlmIChjb250YWluZXIuX3F1ZXVlVG90YWxTaXplIDwgMCkge1xuICAgIGNvbnRhaW5lci5fcXVldWVUb3RhbFNpemUgPSAwO1xuICB9XG5cbiAgcmV0dXJuIHBhaXIudmFsdWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBFbnF1ZXVlVmFsdWVXaXRoU2l6ZTxUPihjb250YWluZXI6IFF1ZXVlQ29udGFpbmVyPFF1ZXVlUGFpcjxUPj4sIHZhbHVlOiBULCBzaXplOiBudW1iZXIpIHtcbiAgYXNzZXJ0KCdfcXVldWUnIGluIGNvbnRhaW5lciAmJiAnX3F1ZXVlVG90YWxTaXplJyBpbiBjb250YWluZXIpO1xuXG4gIGlmICghSXNOb25OZWdhdGl2ZU51bWJlcihzaXplKSB8fCBzaXplID09PSBJbmZpbml0eSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdTaXplIG11c3QgYmUgYSBmaW5pdGUsIG5vbi1OYU4sIG5vbi1uZWdhdGl2ZSBudW1iZXIuJyk7XG4gIH1cblxuICBjb250YWluZXIuX3F1ZXVlLnB1c2goeyB2YWx1ZSwgc2l6ZSB9KTtcbiAgY29udGFpbmVyLl9xdWV1ZVRvdGFsU2l6ZSArPSBzaXplO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUGVla1F1ZXVlVmFsdWU8VD4oY29udGFpbmVyOiBRdWV1ZUNvbnRhaW5lcjxRdWV1ZVBhaXI8VD4+KTogVCB7XG4gIGFzc2VydCgnX3F1ZXVlJyBpbiBjb250YWluZXIgJiYgJ19xdWV1ZVRvdGFsU2l6ZScgaW4gY29udGFpbmVyKTtcbiAgYXNzZXJ0KGNvbnRhaW5lci5fcXVldWUubGVuZ3RoID4gMCk7XG5cbiAgY29uc3QgcGFpciA9IGNvbnRhaW5lci5fcXVldWUucGVlaygpO1xuICByZXR1cm4gcGFpci52YWx1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlc2V0UXVldWU8VD4oY29udGFpbmVyOiBRdWV1ZUNvbnRhaW5lcjxUPikge1xuICBhc3NlcnQoJ19xdWV1ZScgaW4gY29udGFpbmVyICYmICdfcXVldWVUb3RhbFNpemUnIGluIGNvbnRhaW5lcik7XG5cbiAgY29udGFpbmVyLl9xdWV1ZSA9IG5ldyBTaW1wbGVRdWV1ZTxUPigpO1xuICBjb250YWluZXIuX3F1ZXVlVG90YWxTaXplID0gMDtcbn1cbiIsICJleHBvcnQgdHlwZSBUeXBlZEFycmF5ID1cbiAgfCBJbnQ4QXJyYXlcbiAgfCBVaW50OEFycmF5XG4gIHwgVWludDhDbGFtcGVkQXJyYXlcbiAgfCBJbnQxNkFycmF5XG4gIHwgVWludDE2QXJyYXlcbiAgfCBJbnQzMkFycmF5XG4gIHwgVWludDMyQXJyYXlcbiAgfCBGbG9hdDMyQXJyYXlcbiAgfCBGbG9hdDY0QXJyYXk7XG5cbmV4cG9ydCB0eXBlIE5vblNoYXJlZDxUIGV4dGVuZHMgQXJyYXlCdWZmZXJWaWV3PiA9IFQgJiB7XG4gIGJ1ZmZlcjogQXJyYXlCdWZmZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXJyYXlCdWZmZXJWaWV3Q29uc3RydWN0b3I8VCBleHRlbmRzIEFycmF5QnVmZmVyVmlldyA9IEFycmF5QnVmZmVyVmlldz4ge1xuICBuZXcoYnVmZmVyOiBBcnJheUJ1ZmZlciwgYnl0ZU9mZnNldDogbnVtYmVyLCBsZW5ndGg/OiBudW1iZXIpOiBUO1xuXG4gIHJlYWRvbmx5IHByb3RvdHlwZTogVDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBUeXBlZEFycmF5Q29uc3RydWN0b3I8VCBleHRlbmRzIFR5cGVkQXJyYXkgPSBUeXBlZEFycmF5PiBleHRlbmRzIEFycmF5QnVmZmVyVmlld0NvbnN0cnVjdG9yPFQ+IHtcbiAgcmVhZG9ubHkgQllURVNfUEVSX0VMRU1FTlQ6IG51bWJlcjtcbn1cblxuZXhwb3J0IHR5cGUgRGF0YVZpZXdDb25zdHJ1Y3RvciA9IEFycmF5QnVmZmVyVmlld0NvbnN0cnVjdG9yPERhdGFWaWV3PjtcblxuZnVuY3Rpb24gaXNEYXRhVmlld0NvbnN0cnVjdG9yKGN0b3I6IEZ1bmN0aW9uKTogY3RvciBpcyBEYXRhVmlld0NvbnN0cnVjdG9yIHtcbiAgcmV0dXJuIGN0b3IgPT09IERhdGFWaWV3O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNEYXRhVmlldyh2aWV3OiBBcnJheUJ1ZmZlclZpZXcpOiB2aWV3IGlzIERhdGFWaWV3IHtcbiAgcmV0dXJuIGlzRGF0YVZpZXdDb25zdHJ1Y3Rvcih2aWV3LmNvbnN0cnVjdG9yKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFycmF5QnVmZmVyVmlld0VsZW1lbnRTaXplPFQgZXh0ZW5kcyBBcnJheUJ1ZmZlclZpZXc+KGN0b3I6IEFycmF5QnVmZmVyVmlld0NvbnN0cnVjdG9yPFQ+KTogbnVtYmVyIHtcbiAgaWYgKGlzRGF0YVZpZXdDb25zdHJ1Y3RvcihjdG9yKSkge1xuICAgIHJldHVybiAxO1xuICB9XG4gIHJldHVybiAoY3RvciBhcyB1bmtub3duIGFzIFR5cGVkQXJyYXlDb25zdHJ1Y3RvcikuQllURVNfUEVSX0VMRU1FTlQ7XG59XG4iLCAiaW1wb3J0IGFzc2VydCBmcm9tICcuLi8uLi9zdHViL2Fzc2VydCc7XG5pbXBvcnQgeyBTaW1wbGVRdWV1ZSB9IGZyb20gJy4uL3NpbXBsZS1xdWV1ZSc7XG5pbXBvcnQgeyBSZXNldFF1ZXVlIH0gZnJvbSAnLi4vYWJzdHJhY3Qtb3BzL3F1ZXVlLXdpdGgtc2l6ZXMnO1xuaW1wb3J0IHtcbiAgSXNSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXIsXG4gIFJlYWRhYmxlU3RyZWFtQWRkUmVhZFJlcXVlc3QsXG4gIFJlYWRhYmxlU3RyZWFtRnVsZmlsbFJlYWRSZXF1ZXN0LFxuICBSZWFkYWJsZVN0cmVhbUdldE51bVJlYWRSZXF1ZXN0cyxcbiAgUmVhZGFibGVTdHJlYW1IYXNEZWZhdWx0UmVhZGVyLFxuICB0eXBlIFJlYWRSZXF1ZXN0XG59IGZyb20gJy4vZGVmYXVsdC1yZWFkZXInO1xuaW1wb3J0IHtcbiAgUmVhZGFibGVTdHJlYW1BZGRSZWFkSW50b1JlcXVlc3QsXG4gIFJlYWRhYmxlU3RyZWFtRnVsZmlsbFJlYWRJbnRvUmVxdWVzdCxcbiAgUmVhZGFibGVTdHJlYW1HZXROdW1SZWFkSW50b1JlcXVlc3RzLFxuICBSZWFkYWJsZVN0cmVhbUhhc0JZT0JSZWFkZXIsXG4gIHR5cGUgUmVhZEludG9SZXF1ZXN0XG59IGZyb20gJy4vYnlvYi1yZWFkZXInO1xuaW1wb3J0IE51bWJlcklzSW50ZWdlciBmcm9tICcuLi8uLi9zdHViL251bWJlci1pc2ludGVnZXInO1xuaW1wb3J0IHtcbiAgSXNSZWFkYWJsZVN0cmVhbUxvY2tlZCxcbiAgdHlwZSBSZWFkYWJsZUJ5dGVTdHJlYW0sXG4gIFJlYWRhYmxlU3RyZWFtQ2xvc2UsXG4gIFJlYWRhYmxlU3RyZWFtRXJyb3Jcbn0gZnJvbSAnLi4vcmVhZGFibGUtc3RyZWFtJztcbmltcG9ydCB0eXBlIHsgVmFsaWRhdGVkVW5kZXJseWluZ0J5dGVTb3VyY2UgfSBmcm9tICcuL3VuZGVybHlpbmctc291cmNlJztcbmltcG9ydCB7IHNldEZ1bmN0aW9uTmFtZSwgdHlwZUlzT2JqZWN0IH0gZnJvbSAnLi4vaGVscGVycy9taXNjZWxsYW5lb3VzJztcbmltcG9ydCB7XG4gIEFycmF5QnVmZmVyU2xpY2UsXG4gIENhblRyYW5zZmVyQXJyYXlCdWZmZXIsXG4gIENvcHlEYXRhQmxvY2tCeXRlcyxcbiAgSXNEZXRhY2hlZEJ1ZmZlcixcbiAgVHJhbnNmZXJBcnJheUJ1ZmZlclxufSBmcm9tICcuLi9hYnN0cmFjdC1vcHMvZWNtYXNjcmlwdCc7XG5pbXBvcnQgeyBDYW5jZWxTdGVwcywgUHVsbFN0ZXBzLCBSZWxlYXNlU3RlcHMgfSBmcm9tICcuLi9hYnN0cmFjdC1vcHMvaW50ZXJuYWwtbWV0aG9kcyc7XG5pbXBvcnQgeyBwcm9taXNlUmVzb2x2ZWRXaXRoLCB1cG9uUHJvbWlzZSB9IGZyb20gJy4uL2hlbHBlcnMvd2ViaWRsJztcbmltcG9ydCB7IGFzc2VydFJlcXVpcmVkQXJndW1lbnQsIGNvbnZlcnRVbnNpZ25lZExvbmdMb25nV2l0aEVuZm9yY2VSYW5nZSB9IGZyb20gJy4uL3ZhbGlkYXRvcnMvYmFzaWMnO1xuaW1wb3J0IHtcbiAgdHlwZSBBcnJheUJ1ZmZlclZpZXdDb25zdHJ1Y3RvcixcbiAgYXJyYXlCdWZmZXJWaWV3RWxlbWVudFNpemUsXG4gIHR5cGUgTm9uU2hhcmVkLFxuICB0eXBlIFR5cGVkQXJyYXlDb25zdHJ1Y3RvclxufSBmcm9tICcuLi9oZWxwZXJzL2FycmF5LWJ1ZmZlci12aWV3JztcblxuLyoqXG4gKiBBIHB1bGwtaW50byByZXF1ZXN0IGluIGEge0BsaW5rIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJ9LlxuICpcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNsYXNzIFJlYWRhYmxlU3RyZWFtQllPQlJlcXVlc3Qge1xuICAvKiogQGludGVybmFsICovXG4gIF9hc3NvY2lhdGVkUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlciE6IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXI7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3ZpZXchOiBOb25TaGFyZWQ8QXJyYXlCdWZmZXJWaWV3PiB8IG51bGw7XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbGxlZ2FsIGNvbnN0cnVjdG9yJyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdmlldyBmb3Igd3JpdGluZyBpbiB0bywgb3IgYG51bGxgIGlmIHRoZSBCWU9CIHJlcXVlc3QgaGFzIGFscmVhZHkgYmVlbiByZXNwb25kZWQgdG8uXG4gICAqL1xuICBnZXQgdmlldygpOiBBcnJheUJ1ZmZlclZpZXcgfCBudWxsIHtcbiAgICBpZiAoIUlzUmVhZGFibGVTdHJlYW1CWU9CUmVxdWVzdCh0aGlzKSkge1xuICAgICAgdGhyb3cgYnlvYlJlcXVlc3RCcmFuZENoZWNrRXhjZXB0aW9uKCd2aWV3Jyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3ZpZXc7XG4gIH1cblxuICAvKipcbiAgICogSW5kaWNhdGVzIHRvIHRoZSBhc3NvY2lhdGVkIHJlYWRhYmxlIGJ5dGUgc3RyZWFtIHRoYXQgYGJ5dGVzV3JpdHRlbmAgYnl0ZXMgd2VyZSB3cml0dGVuIGludG9cbiAgICoge0BsaW5rIFJlYWRhYmxlU3RyZWFtQllPQlJlcXVlc3QudmlldyB8IHZpZXd9LCBjYXVzaW5nIHRoZSByZXN1bHQgYmUgc3VyZmFjZWQgdG8gdGhlIGNvbnN1bWVyLlxuICAgKlxuICAgKiBBZnRlciB0aGlzIG1ldGhvZCBpcyBjYWxsZWQsIHtAbGluayBSZWFkYWJsZVN0cmVhbUJZT0JSZXF1ZXN0LnZpZXcgfCB2aWV3fSB3aWxsIGJlIHRyYW5zZmVycmVkIGFuZCBubyBsb25nZXJcbiAgICogbW9kaWZpYWJsZS5cbiAgICovXG4gIHJlc3BvbmQoYnl0ZXNXcml0dGVuOiBudW1iZXIpOiB2b2lkO1xuICByZXNwb25kKGJ5dGVzV3JpdHRlbjogbnVtYmVyIHwgdW5kZWZpbmVkKTogdm9pZCB7XG4gICAgaWYgKCFJc1JlYWRhYmxlU3RyZWFtQllPQlJlcXVlc3QodGhpcykpIHtcbiAgICAgIHRocm93IGJ5b2JSZXF1ZXN0QnJhbmRDaGVja0V4Y2VwdGlvbigncmVzcG9uZCcpO1xuICAgIH1cbiAgICBhc3NlcnRSZXF1aXJlZEFyZ3VtZW50KGJ5dGVzV3JpdHRlbiwgMSwgJ3Jlc3BvbmQnKTtcbiAgICBieXRlc1dyaXR0ZW4gPSBjb252ZXJ0VW5zaWduZWRMb25nTG9uZ1dpdGhFbmZvcmNlUmFuZ2UoYnl0ZXNXcml0dGVuLCAnRmlyc3QgcGFyYW1ldGVyJyk7XG5cbiAgICBpZiAodGhpcy5fYXNzb2NpYXRlZFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhpcyBCWU9CIHJlcXVlc3QgaGFzIGJlZW4gaW52YWxpZGF0ZWQnKTtcbiAgICB9XG5cbiAgICBpZiAoSXNEZXRhY2hlZEJ1ZmZlcih0aGlzLl92aWV3IS5idWZmZXIpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBUaGUgQllPQiByZXF1ZXN0J3MgYnVmZmVyIGhhcyBiZWVuIGRldGFjaGVkIGFuZCBzbyBjYW5ub3QgYmUgdXNlZCBhcyBhIHJlc3BvbnNlYCk7XG4gICAgfVxuXG4gICAgYXNzZXJ0KHRoaXMuX3ZpZXchLmJ5dGVMZW5ndGggPiAwKTtcbiAgICBhc3NlcnQodGhpcy5fdmlldyEuYnVmZmVyLmJ5dGVMZW5ndGggPiAwKTtcblxuICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJSZXNwb25kKHRoaXMuX2Fzc29jaWF0ZWRSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyLCBieXRlc1dyaXR0ZW4pO1xuICB9XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyB0byB0aGUgYXNzb2NpYXRlZCByZWFkYWJsZSBieXRlIHN0cmVhbSB0aGF0IGluc3RlYWQgb2Ygd3JpdGluZyBpbnRvXG4gICAqIHtAbGluayBSZWFkYWJsZVN0cmVhbUJZT0JSZXF1ZXN0LnZpZXcgfCB2aWV3fSwgdGhlIHVuZGVybHlpbmcgYnl0ZSBzb3VyY2UgaXMgcHJvdmlkaW5nIGEgbmV3IGBBcnJheUJ1ZmZlclZpZXdgLFxuICAgKiB3aGljaCB3aWxsIGJlIGdpdmVuIHRvIHRoZSBjb25zdW1lciBvZiB0aGUgcmVhZGFibGUgYnl0ZSBzdHJlYW0uXG4gICAqXG4gICAqIEFmdGVyIHRoaXMgbWV0aG9kIGlzIGNhbGxlZCwgYHZpZXdgIHdpbGwgYmUgdHJhbnNmZXJyZWQgYW5kIG5vIGxvbmdlciBtb2RpZmlhYmxlLlxuICAgKi9cbiAgcmVzcG9uZFdpdGhOZXdWaWV3KHZpZXc6IEFycmF5QnVmZmVyVmlldyk6IHZvaWQ7XG4gIHJlc3BvbmRXaXRoTmV3Vmlldyh2aWV3OiBOb25TaGFyZWQ8QXJyYXlCdWZmZXJWaWV3Pik6IHZvaWQge1xuICAgIGlmICghSXNSZWFkYWJsZVN0cmVhbUJZT0JSZXF1ZXN0KHRoaXMpKSB7XG4gICAgICB0aHJvdyBieW9iUmVxdWVzdEJyYW5kQ2hlY2tFeGNlcHRpb24oJ3Jlc3BvbmRXaXRoTmV3VmlldycpO1xuICAgIH1cbiAgICBhc3NlcnRSZXF1aXJlZEFyZ3VtZW50KHZpZXcsIDEsICdyZXNwb25kV2l0aE5ld1ZpZXcnKTtcblxuICAgIGlmICghQXJyYXlCdWZmZXIuaXNWaWV3KHZpZXcpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdZb3UgY2FuIG9ubHkgcmVzcG9uZCB3aXRoIGFycmF5IGJ1ZmZlciB2aWV3cycpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9hc3NvY2lhdGVkUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGlzIEJZT0IgcmVxdWVzdCBoYXMgYmVlbiBpbnZhbGlkYXRlZCcpO1xuICAgIH1cblxuICAgIGlmIChJc0RldGFjaGVkQnVmZmVyKHZpZXcuYnVmZmVyKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIGdpdmVuIHZpZXdcXCdzIGJ1ZmZlciBoYXMgYmVlbiBkZXRhY2hlZCBhbmQgc28gY2Fubm90IGJlIHVzZWQgYXMgYSByZXNwb25zZScpO1xuICAgIH1cblxuICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJSZXNwb25kV2l0aE5ld1ZpZXcodGhpcy5fYXNzb2NpYXRlZFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIsIHZpZXcpO1xuICB9XG59XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFJlYWRhYmxlU3RyZWFtQllPQlJlcXVlc3QucHJvdG90eXBlLCB7XG4gIHJlc3BvbmQ6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICByZXNwb25kV2l0aE5ld1ZpZXc6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICB2aWV3OiB7IGVudW1lcmFibGU6IHRydWUgfVxufSk7XG5zZXRGdW5jdGlvbk5hbWUoUmVhZGFibGVTdHJlYW1CWU9CUmVxdWVzdC5wcm90b3R5cGUucmVzcG9uZCwgJ3Jlc3BvbmQnKTtcbnNldEZ1bmN0aW9uTmFtZShSZWFkYWJsZVN0cmVhbUJZT0JSZXF1ZXN0LnByb3RvdHlwZS5yZXNwb25kV2l0aE5ld1ZpZXcsICdyZXNwb25kV2l0aE5ld1ZpZXcnKTtcbmlmICh0eXBlb2YgU3ltYm9sLnRvU3RyaW5nVGFnID09PSAnc3ltYm9sJykge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUmVhZGFibGVTdHJlYW1CWU9CUmVxdWVzdC5wcm90b3R5cGUsIFN5bWJvbC50b1N0cmluZ1RhZywge1xuICAgIHZhbHVlOiAnUmVhZGFibGVTdHJlYW1CWU9CUmVxdWVzdCcsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xufVxuXG5pbnRlcmZhY2UgQnl0ZVF1ZXVlRWxlbWVudCB7XG4gIGJ1ZmZlcjogQXJyYXlCdWZmZXI7XG4gIGJ5dGVPZmZzZXQ6IG51bWJlcjtcbiAgYnl0ZUxlbmd0aDogbnVtYmVyO1xufVxuXG50eXBlIFB1bGxJbnRvRGVzY3JpcHRvcjxUIGV4dGVuZHMgTm9uU2hhcmVkPEFycmF5QnVmZmVyVmlldz4gPSBOb25TaGFyZWQ8QXJyYXlCdWZmZXJWaWV3Pj4gPVxuICBEZWZhdWx0UHVsbEludG9EZXNjcmlwdG9yXG4gIHwgQllPQlB1bGxJbnRvRGVzY3JpcHRvcjxUPjtcblxuaW50ZXJmYWNlIERlZmF1bHRQdWxsSW50b0Rlc2NyaXB0b3Ige1xuICBidWZmZXI6IEFycmF5QnVmZmVyO1xuICBidWZmZXJCeXRlTGVuZ3RoOiBudW1iZXI7XG4gIGJ5dGVPZmZzZXQ6IG51bWJlcjtcbiAgYnl0ZUxlbmd0aDogbnVtYmVyO1xuICBieXRlc0ZpbGxlZDogbnVtYmVyO1xuICBtaW5pbXVtRmlsbDogbnVtYmVyO1xuICBlbGVtZW50U2l6ZTogbnVtYmVyO1xuICB2aWV3Q29uc3RydWN0b3I6IFR5cGVkQXJyYXlDb25zdHJ1Y3RvcjxVaW50OEFycmF5PjtcbiAgcmVhZGVyVHlwZTogJ2RlZmF1bHQnIHwgJ25vbmUnO1xufVxuXG5pbnRlcmZhY2UgQllPQlB1bGxJbnRvRGVzY3JpcHRvcjxUIGV4dGVuZHMgTm9uU2hhcmVkPEFycmF5QnVmZmVyVmlldz4gPSBOb25TaGFyZWQ8QXJyYXlCdWZmZXJWaWV3Pj4ge1xuICBidWZmZXI6IEFycmF5QnVmZmVyO1xuICBidWZmZXJCeXRlTGVuZ3RoOiBudW1iZXI7XG4gIGJ5dGVPZmZzZXQ6IG51bWJlcjtcbiAgYnl0ZUxlbmd0aDogbnVtYmVyO1xuICBieXRlc0ZpbGxlZDogbnVtYmVyO1xuICBtaW5pbXVtRmlsbDogbnVtYmVyO1xuICBlbGVtZW50U2l6ZTogbnVtYmVyO1xuICB2aWV3Q29uc3RydWN0b3I6IEFycmF5QnVmZmVyVmlld0NvbnN0cnVjdG9yPFQ+O1xuICByZWFkZXJUeXBlOiAnYnlvYicgfCAnbm9uZSc7XG59XG5cbi8qKlxuICogQWxsb3dzIGNvbnRyb2wgb2YgYSB7QGxpbmsgUmVhZGFibGVTdHJlYW0gfCByZWFkYWJsZSBieXRlIHN0cmVhbX0ncyBzdGF0ZSBhbmQgaW50ZXJuYWwgcXVldWUuXG4gKlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY2xhc3MgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlciB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2NvbnRyb2xsZWRSZWFkYWJsZUJ5dGVTdHJlYW0hOiBSZWFkYWJsZUJ5dGVTdHJlYW07XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3F1ZXVlITogU2ltcGxlUXVldWU8Qnl0ZVF1ZXVlRWxlbWVudD47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3F1ZXVlVG90YWxTaXplITogbnVtYmVyO1xuICAvKiogQGludGVybmFsICovXG4gIF9zdGFydGVkITogYm9vbGVhbjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfY2xvc2VSZXF1ZXN0ZWQhOiBib29sZWFuO1xuICAvKiogQGludGVybmFsICovXG4gIF9wdWxsQWdhaW4hOiBib29sZWFuO1xuICAvKiogQGludGVybmFsICovXG4gIF9wdWxsaW5nICE6IGJvb2xlYW47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3N0cmF0ZWd5SFdNITogbnVtYmVyO1xuICAvKiogQGludGVybmFsICovXG4gIF9wdWxsQWxnb3JpdGhtITogKCkgPT4gUHJvbWlzZTx2b2lkPjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfY2FuY2VsQWxnb3JpdGhtITogKHJlYXNvbjogYW55KSA9PiBQcm9taXNlPHZvaWQ+O1xuICAvKiogQGludGVybmFsICovXG4gIF9hdXRvQWxsb2NhdGVDaHVua1NpemU6IG51bWJlciB8IHVuZGVmaW5lZDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfYnlvYlJlcXVlc3Q6IFJlYWRhYmxlU3RyZWFtQllPQlJlcXVlc3QgfCBudWxsO1xuICAvKiogQGludGVybmFsICovXG4gIF9wZW5kaW5nUHVsbEludG9zITogU2ltcGxlUXVldWU8UHVsbEludG9EZXNjcmlwdG9yPjtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0lsbGVnYWwgY29uc3RydWN0b3InKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBjdXJyZW50IEJZT0IgcHVsbCByZXF1ZXN0LCBvciBgbnVsbGAgaWYgdGhlcmUgaXNuJ3Qgb25lLlxuICAgKi9cbiAgZ2V0IGJ5b2JSZXF1ZXN0KCk6IFJlYWRhYmxlU3RyZWFtQllPQlJlcXVlc3QgfCBudWxsIHtcbiAgICBpZiAoIUlzUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcih0aGlzKSkge1xuICAgICAgdGhyb3cgYnl0ZVN0cmVhbUNvbnRyb2xsZXJCcmFuZENoZWNrRXhjZXB0aW9uKCdieW9iUmVxdWVzdCcpO1xuICAgIH1cblxuICAgIHJldHVybiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyR2V0QllPQlJlcXVlc3QodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZGVzaXJlZCBzaXplIHRvIGZpbGwgdGhlIGNvbnRyb2xsZWQgc3RyZWFtJ3MgaW50ZXJuYWwgcXVldWUuIEl0IGNhbiBiZSBuZWdhdGl2ZSwgaWYgdGhlIHF1ZXVlIGlzXG4gICAqIG92ZXItZnVsbC4gQW4gdW5kZXJseWluZyBieXRlIHNvdXJjZSBvdWdodCB0byB1c2UgdGhpcyBpbmZvcm1hdGlvbiB0byBkZXRlcm1pbmUgd2hlbiBhbmQgaG93IHRvIGFwcGx5IGJhY2twcmVzc3VyZS5cbiAgICovXG4gIGdldCBkZXNpcmVkU2l6ZSgpOiBudW1iZXIgfCBudWxsIHtcbiAgICBpZiAoIUlzUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcih0aGlzKSkge1xuICAgICAgdGhyb3cgYnl0ZVN0cmVhbUNvbnRyb2xsZXJCcmFuZENoZWNrRXhjZXB0aW9uKCdkZXNpcmVkU2l6ZScpO1xuICAgIH1cblxuICAgIHJldHVybiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyR2V0RGVzaXJlZFNpemUodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogQ2xvc2VzIHRoZSBjb250cm9sbGVkIHJlYWRhYmxlIHN0cmVhbS4gQ29uc3VtZXJzIHdpbGwgc3RpbGwgYmUgYWJsZSB0byByZWFkIGFueSBwcmV2aW91c2x5LWVucXVldWVkIGNodW5rcyBmcm9tXG4gICAqIHRoZSBzdHJlYW0sIGJ1dCBvbmNlIHRob3NlIGFyZSByZWFkLCB0aGUgc3RyZWFtIHdpbGwgYmVjb21lIGNsb3NlZC5cbiAgICovXG4gIGNsb3NlKCk6IHZvaWQge1xuICAgIGlmICghSXNSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyKHRoaXMpKSB7XG4gICAgICB0aHJvdyBieXRlU3RyZWFtQ29udHJvbGxlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ2Nsb3NlJyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2Nsb3NlUmVxdWVzdGVkKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgc3RyZWFtIGhhcyBhbHJlYWR5IGJlZW4gY2xvc2VkOyBkbyBub3QgY2xvc2UgaXQgYWdhaW4hJyk7XG4gICAgfVxuXG4gICAgY29uc3Qgc3RhdGUgPSB0aGlzLl9jb250cm9sbGVkUmVhZGFibGVCeXRlU3RyZWFtLl9zdGF0ZTtcbiAgICBpZiAoc3RhdGUgIT09ICdyZWFkYWJsZScpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYFRoZSBzdHJlYW0gKGluICR7c3RhdGV9IHN0YXRlKSBpcyBub3QgaW4gdGhlIHJlYWRhYmxlIHN0YXRlIGFuZCBjYW5ub3QgYmUgY2xvc2VkYCk7XG4gICAgfVxuXG4gICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckNsb3NlKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEVucXVldWVzIHRoZSBnaXZlbiBjaHVuayBjaHVuayBpbiB0aGUgY29udHJvbGxlZCByZWFkYWJsZSBzdHJlYW0uXG4gICAqIFRoZSBjaHVuayBoYXMgdG8gYmUgYW4gYEFycmF5QnVmZmVyVmlld2AgaW5zdGFuY2UsIG9yIGVsc2UgYSBgVHlwZUVycm9yYCB3aWxsIGJlIHRocm93bi5cbiAgICovXG4gIGVucXVldWUoY2h1bms6IEFycmF5QnVmZmVyVmlldyk6IHZvaWQ7XG4gIGVucXVldWUoY2h1bms6IE5vblNoYXJlZDxBcnJheUJ1ZmZlclZpZXc+KTogdm9pZCB7XG4gICAgaWYgKCFJc1JlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIodGhpcykpIHtcbiAgICAgIHRocm93IGJ5dGVTdHJlYW1Db250cm9sbGVyQnJhbmRDaGVja0V4Y2VwdGlvbignZW5xdWV1ZScpO1xuICAgIH1cblxuICAgIGFzc2VydFJlcXVpcmVkQXJndW1lbnQoY2h1bmssIDEsICdlbnF1ZXVlJyk7XG4gICAgaWYgKCFBcnJheUJ1ZmZlci5pc1ZpZXcoY2h1bmspKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdjaHVuayBtdXN0IGJlIGFuIGFycmF5IGJ1ZmZlciB2aWV3Jyk7XG4gICAgfVxuICAgIGlmIChjaHVuay5ieXRlTGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdjaHVuayBtdXN0IGhhdmUgbm9uLXplcm8gYnl0ZUxlbmd0aCcpO1xuICAgIH1cbiAgICBpZiAoY2h1bmsuYnVmZmVyLmJ5dGVMZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYGNodW5rJ3MgYnVmZmVyIG11c3QgaGF2ZSBub24temVybyBieXRlTGVuZ3RoYCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2Nsb3NlUmVxdWVzdGVkKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdzdHJlYW0gaXMgY2xvc2VkIG9yIGRyYWluaW5nJyk7XG4gICAgfVxuXG4gICAgY29uc3Qgc3RhdGUgPSB0aGlzLl9jb250cm9sbGVkUmVhZGFibGVCeXRlU3RyZWFtLl9zdGF0ZTtcbiAgICBpZiAoc3RhdGUgIT09ICdyZWFkYWJsZScpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYFRoZSBzdHJlYW0gKGluICR7c3RhdGV9IHN0YXRlKSBpcyBub3QgaW4gdGhlIHJlYWRhYmxlIHN0YXRlIGFuZCBjYW5ub3QgYmUgZW5xdWV1ZWQgdG9gKTtcbiAgICB9XG5cbiAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRW5xdWV1ZSh0aGlzLCBjaHVuayk7XG4gIH1cblxuICAvKipcbiAgICogRXJyb3JzIHRoZSBjb250cm9sbGVkIHJlYWRhYmxlIHN0cmVhbSwgbWFraW5nIGFsbCBmdXR1cmUgaW50ZXJhY3Rpb25zIHdpdGggaXQgZmFpbCB3aXRoIHRoZSBnaXZlbiBlcnJvciBgZWAuXG4gICAqL1xuICBlcnJvcihlOiBhbnkgPSB1bmRlZmluZWQpOiB2b2lkIHtcbiAgICBpZiAoIUlzUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcih0aGlzKSkge1xuICAgICAgdGhyb3cgYnl0ZVN0cmVhbUNvbnRyb2xsZXJCcmFuZENoZWNrRXhjZXB0aW9uKCdlcnJvcicpO1xuICAgIH1cblxuICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJFcnJvcih0aGlzLCBlKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgW0NhbmNlbFN0ZXBzXShyZWFzb246IGFueSk6IFByb21pc2U8dm9pZD4ge1xuICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJDbGVhclBlbmRpbmdQdWxsSW50b3ModGhpcyk7XG5cbiAgICBSZXNldFF1ZXVlKHRoaXMpO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5fY2FuY2VsQWxnb3JpdGhtKHJlYXNvbik7XG4gICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckNsZWFyQWxnb3JpdGhtcyh0aGlzKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBbUHVsbFN0ZXBzXShyZWFkUmVxdWVzdDogUmVhZFJlcXVlc3Q8Tm9uU2hhcmVkPFVpbnQ4QXJyYXk+Pik6IHZvaWQge1xuICAgIGNvbnN0IHN0cmVhbSA9IHRoaXMuX2NvbnRyb2xsZWRSZWFkYWJsZUJ5dGVTdHJlYW07XG4gICAgYXNzZXJ0KFJlYWRhYmxlU3RyZWFtSGFzRGVmYXVsdFJlYWRlcihzdHJlYW0pKTtcblxuICAgIGlmICh0aGlzLl9xdWV1ZVRvdGFsU2l6ZSA+IDApIHtcbiAgICAgIGFzc2VydChSZWFkYWJsZVN0cmVhbUdldE51bVJlYWRSZXF1ZXN0cyhzdHJlYW0pID09PSAwKTtcblxuICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckZpbGxSZWFkUmVxdWVzdEZyb21RdWV1ZSh0aGlzLCByZWFkUmVxdWVzdCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgYXV0b0FsbG9jYXRlQ2h1bmtTaXplID0gdGhpcy5fYXV0b0FsbG9jYXRlQ2h1bmtTaXplO1xuICAgIGlmIChhdXRvQWxsb2NhdGVDaHVua1NpemUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgbGV0IGJ1ZmZlcjogQXJyYXlCdWZmZXI7XG4gICAgICB0cnkge1xuICAgICAgICBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoYXV0b0FsbG9jYXRlQ2h1bmtTaXplKTtcbiAgICAgIH0gY2F0Y2ggKGJ1ZmZlckUpIHtcbiAgICAgICAgcmVhZFJlcXVlc3QuX2Vycm9yU3RlcHMoYnVmZmVyRSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcHVsbEludG9EZXNjcmlwdG9yOiBEZWZhdWx0UHVsbEludG9EZXNjcmlwdG9yID0ge1xuICAgICAgICBidWZmZXIsXG4gICAgICAgIGJ1ZmZlckJ5dGVMZW5ndGg6IGF1dG9BbGxvY2F0ZUNodW5rU2l6ZSxcbiAgICAgICAgYnl0ZU9mZnNldDogMCxcbiAgICAgICAgYnl0ZUxlbmd0aDogYXV0b0FsbG9jYXRlQ2h1bmtTaXplLFxuICAgICAgICBieXRlc0ZpbGxlZDogMCxcbiAgICAgICAgbWluaW11bUZpbGw6IDEsXG4gICAgICAgIGVsZW1lbnRTaXplOiAxLFxuICAgICAgICB2aWV3Q29uc3RydWN0b3I6IFVpbnQ4QXJyYXksXG4gICAgICAgIHJlYWRlclR5cGU6ICdkZWZhdWx0J1xuICAgICAgfTtcblxuICAgICAgdGhpcy5fcGVuZGluZ1B1bGxJbnRvcy5wdXNoKHB1bGxJbnRvRGVzY3JpcHRvcik7XG4gICAgfVxuXG4gICAgUmVhZGFibGVTdHJlYW1BZGRSZWFkUmVxdWVzdChzdHJlYW0sIHJlYWRSZXF1ZXN0KTtcbiAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyQ2FsbFB1bGxJZk5lZWRlZCh0aGlzKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgW1JlbGVhc2VTdGVwc10oKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX3BlbmRpbmdQdWxsSW50b3MubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgZmlyc3RQdWxsSW50byA9IHRoaXMuX3BlbmRpbmdQdWxsSW50b3MucGVlaygpO1xuICAgICAgZmlyc3RQdWxsSW50by5yZWFkZXJUeXBlID0gJ25vbmUnO1xuXG4gICAgICB0aGlzLl9wZW5kaW5nUHVsbEludG9zID0gbmV3IFNpbXBsZVF1ZXVlKCk7XG4gICAgICB0aGlzLl9wZW5kaW5nUHVsbEludG9zLnB1c2goZmlyc3RQdWxsSW50byk7XG4gICAgfVxuICB9XG59XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIucHJvdG90eXBlLCB7XG4gIGNsb3NlOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgZW5xdWV1ZTogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIGVycm9yOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgYnlvYlJlcXVlc3Q6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICBkZXNpcmVkU2l6ZTogeyBlbnVtZXJhYmxlOiB0cnVlIH1cbn0pO1xuc2V0RnVuY3Rpb25OYW1lKFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIucHJvdG90eXBlLmNsb3NlLCAnY2xvc2UnKTtcbnNldEZ1bmN0aW9uTmFtZShSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyLnByb3RvdHlwZS5lbnF1ZXVlLCAnZW5xdWV1ZScpO1xuc2V0RnVuY3Rpb25OYW1lKFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIucHJvdG90eXBlLmVycm9yLCAnZXJyb3InKTtcbmlmICh0eXBlb2YgU3ltYm9sLnRvU3RyaW5nVGFnID09PSAnc3ltYm9sJykge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlci5wcm90b3R5cGUsIFN5bWJvbC50b1N0cmluZ1RhZywge1xuICAgIHZhbHVlOiAnUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcicsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xufVxuXG4vLyBBYnN0cmFjdCBvcGVyYXRpb25zIGZvciB0aGUgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlci5cblxuZXhwb3J0IGZ1bmN0aW9uIElzUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcih4OiBhbnkpOiB4IGlzIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIge1xuICBpZiAoIXR5cGVJc09iamVjdCh4KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHgsICdfY29udHJvbGxlZFJlYWRhYmxlQnl0ZVN0cmVhbScpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHggaW5zdGFuY2VvZiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyO1xufVxuXG5mdW5jdGlvbiBJc1JlYWRhYmxlU3RyZWFtQllPQlJlcXVlc3QoeDogYW55KTogeCBpcyBSZWFkYWJsZVN0cmVhbUJZT0JSZXF1ZXN0IHtcbiAgaWYgKCF0eXBlSXNPYmplY3QoeCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh4LCAnX2Fzc29jaWF0ZWRSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyJykpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4geCBpbnN0YW5jZW9mIFJlYWRhYmxlU3RyZWFtQllPQlJlcXVlc3Q7XG59XG5cbmZ1bmN0aW9uIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJDYWxsUHVsbElmTmVlZGVkKGNvbnRyb2xsZXI6IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIpOiB2b2lkIHtcbiAgY29uc3Qgc2hvdWxkUHVsbCA9IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJTaG91bGRDYWxsUHVsbChjb250cm9sbGVyKTtcbiAgaWYgKCFzaG91bGRQdWxsKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGNvbnRyb2xsZXIuX3B1bGxpbmcpIHtcbiAgICBjb250cm9sbGVyLl9wdWxsQWdhaW4gPSB0cnVlO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGFzc2VydCghY29udHJvbGxlci5fcHVsbEFnYWluKTtcblxuICBjb250cm9sbGVyLl9wdWxsaW5nID0gdHJ1ZTtcblxuICAvLyBUT0RPOiBUZXN0IGNvbnRyb2xsZXIgYXJndW1lbnRcbiAgY29uc3QgcHVsbFByb21pc2UgPSBjb250cm9sbGVyLl9wdWxsQWxnb3JpdGhtKCk7XG4gIHVwb25Qcm9taXNlKFxuICAgIHB1bGxQcm9taXNlLFxuICAgICgpID0+IHtcbiAgICAgIGNvbnRyb2xsZXIuX3B1bGxpbmcgPSBmYWxzZTtcblxuICAgICAgaWYgKGNvbnRyb2xsZXIuX3B1bGxBZ2Fpbikge1xuICAgICAgICBjb250cm9sbGVyLl9wdWxsQWdhaW4gPSBmYWxzZTtcbiAgICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckNhbGxQdWxsSWZOZWVkZWQoY29udHJvbGxlcik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgZSA9PiB7XG4gICAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRXJyb3IoY29udHJvbGxlciwgZSk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICk7XG59XG5cbmZ1bmN0aW9uIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJDbGVhclBlbmRpbmdQdWxsSW50b3MoY29udHJvbGxlcjogUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcikge1xuICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVySW52YWxpZGF0ZUJZT0JSZXF1ZXN0KGNvbnRyb2xsZXIpO1xuICBjb250cm9sbGVyLl9wZW5kaW5nUHVsbEludG9zID0gbmV3IFNpbXBsZVF1ZXVlKCk7XG59XG5cbmZ1bmN0aW9uIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJDb21taXRQdWxsSW50b0Rlc2NyaXB0b3I8VCBleHRlbmRzIE5vblNoYXJlZDxBcnJheUJ1ZmZlclZpZXc+PihcbiAgc3RyZWFtOiBSZWFkYWJsZUJ5dGVTdHJlYW0sXG4gIHB1bGxJbnRvRGVzY3JpcHRvcjogUHVsbEludG9EZXNjcmlwdG9yPFQ+XG4pIHtcbiAgYXNzZXJ0KHN0cmVhbS5fc3RhdGUgIT09ICdlcnJvcmVkJyk7XG4gIGFzc2VydChwdWxsSW50b0Rlc2NyaXB0b3IucmVhZGVyVHlwZSAhPT0gJ25vbmUnKTtcblxuICBsZXQgZG9uZSA9IGZhbHNlO1xuICBpZiAoc3RyZWFtLl9zdGF0ZSA9PT0gJ2Nsb3NlZCcpIHtcbiAgICBhc3NlcnQocHVsbEludG9EZXNjcmlwdG9yLmJ5dGVzRmlsbGVkICUgcHVsbEludG9EZXNjcmlwdG9yLmVsZW1lbnRTaXplID09PSAwKTtcbiAgICBkb25lID0gdHJ1ZTtcbiAgfVxuXG4gIGNvbnN0IGZpbGxlZFZpZXcgPSBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyQ29udmVydFB1bGxJbnRvRGVzY3JpcHRvcjxUPihwdWxsSW50b0Rlc2NyaXB0b3IpO1xuICBpZiAocHVsbEludG9EZXNjcmlwdG9yLnJlYWRlclR5cGUgPT09ICdkZWZhdWx0Jykge1xuICAgIFJlYWRhYmxlU3RyZWFtRnVsZmlsbFJlYWRSZXF1ZXN0KHN0cmVhbSwgZmlsbGVkVmlldyBhcyB1bmtub3duIGFzIE5vblNoYXJlZDxVaW50OEFycmF5PiwgZG9uZSk7XG4gIH0gZWxzZSB7XG4gICAgYXNzZXJ0KHB1bGxJbnRvRGVzY3JpcHRvci5yZWFkZXJUeXBlID09PSAnYnlvYicpO1xuICAgIFJlYWRhYmxlU3RyZWFtRnVsZmlsbFJlYWRJbnRvUmVxdWVzdChzdHJlYW0sIGZpbGxlZFZpZXcsIGRvbmUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJDb252ZXJ0UHVsbEludG9EZXNjcmlwdG9yPFQgZXh0ZW5kcyBOb25TaGFyZWQ8QXJyYXlCdWZmZXJWaWV3Pj4oXG4gIHB1bGxJbnRvRGVzY3JpcHRvcjogUHVsbEludG9EZXNjcmlwdG9yPFQ+XG4pOiBUIHtcbiAgY29uc3QgYnl0ZXNGaWxsZWQgPSBwdWxsSW50b0Rlc2NyaXB0b3IuYnl0ZXNGaWxsZWQ7XG4gIGNvbnN0IGVsZW1lbnRTaXplID0gcHVsbEludG9EZXNjcmlwdG9yLmVsZW1lbnRTaXplO1xuXG4gIGFzc2VydChieXRlc0ZpbGxlZCA8PSBwdWxsSW50b0Rlc2NyaXB0b3IuYnl0ZUxlbmd0aCk7XG4gIGFzc2VydChieXRlc0ZpbGxlZCAlIGVsZW1lbnRTaXplID09PSAwKTtcblxuICByZXR1cm4gbmV3IHB1bGxJbnRvRGVzY3JpcHRvci52aWV3Q29uc3RydWN0b3IoXG4gICAgcHVsbEludG9EZXNjcmlwdG9yLmJ1ZmZlciwgcHVsbEludG9EZXNjcmlwdG9yLmJ5dGVPZmZzZXQsIGJ5dGVzRmlsbGVkIC8gZWxlbWVudFNpemUpIGFzIFQ7XG59XG5cbmZ1bmN0aW9uIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJFbnF1ZXVlQ2h1bmtUb1F1ZXVlKGNvbnRyb2xsZXI6IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWZmZXI6IEFycmF5QnVmZmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnl0ZU9mZnNldDogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnl0ZUxlbmd0aDogbnVtYmVyKSB7XG4gIGNvbnRyb2xsZXIuX3F1ZXVlLnB1c2goeyBidWZmZXIsIGJ5dGVPZmZzZXQsIGJ5dGVMZW5ndGggfSk7XG4gIGNvbnRyb2xsZXIuX3F1ZXVlVG90YWxTaXplICs9IGJ5dGVMZW5ndGg7XG59XG5cbmZ1bmN0aW9uIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJFbnF1ZXVlQ2xvbmVkQ2h1bmtUb1F1ZXVlKGNvbnRyb2xsZXI6IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWZmZXI6IEFycmF5QnVmZmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnl0ZU9mZnNldDogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnl0ZUxlbmd0aDogbnVtYmVyKSB7XG4gIGxldCBjbG9uZWRDaHVuaztcbiAgdHJ5IHtcbiAgICBjbG9uZWRDaHVuayA9IEFycmF5QnVmZmVyU2xpY2UoYnVmZmVyLCBieXRlT2Zmc2V0LCBieXRlT2Zmc2V0ICsgYnl0ZUxlbmd0aCk7XG4gIH0gY2F0Y2ggKGNsb25lRSkge1xuICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJFcnJvcihjb250cm9sbGVyLCBjbG9uZUUpO1xuICAgIHRocm93IGNsb25lRTtcbiAgfVxuICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRW5xdWV1ZUNodW5rVG9RdWV1ZShjb250cm9sbGVyLCBjbG9uZWRDaHVuaywgMCwgYnl0ZUxlbmd0aCk7XG59XG5cbmZ1bmN0aW9uIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJFbnF1ZXVlRGV0YWNoZWRQdWxsSW50b1RvUXVldWUoY29udHJvbGxlcjogUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3REZXNjcmlwdG9yOiBQdWxsSW50b0Rlc2NyaXB0b3IpIHtcbiAgYXNzZXJ0KGZpcnN0RGVzY3JpcHRvci5yZWFkZXJUeXBlID09PSAnbm9uZScpO1xuICBpZiAoZmlyc3REZXNjcmlwdG9yLmJ5dGVzRmlsbGVkID4gMCkge1xuICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJFbnF1ZXVlQ2xvbmVkQ2h1bmtUb1F1ZXVlKFxuICAgICAgY29udHJvbGxlcixcbiAgICAgIGZpcnN0RGVzY3JpcHRvci5idWZmZXIsXG4gICAgICBmaXJzdERlc2NyaXB0b3IuYnl0ZU9mZnNldCxcbiAgICAgIGZpcnN0RGVzY3JpcHRvci5ieXRlc0ZpbGxlZFxuICAgICk7XG4gIH1cbiAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclNoaWZ0UGVuZGluZ1B1bGxJbnRvKGNvbnRyb2xsZXIpO1xufVxuXG5mdW5jdGlvbiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRmlsbFB1bGxJbnRvRGVzY3JpcHRvckZyb21RdWV1ZShjb250cm9sbGVyOiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHVsbEludG9EZXNjcmlwdG9yOiBQdWxsSW50b0Rlc2NyaXB0b3IpIHtcbiAgY29uc3QgbWF4Qnl0ZXNUb0NvcHkgPSBNYXRoLm1pbihjb250cm9sbGVyLl9xdWV1ZVRvdGFsU2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwdWxsSW50b0Rlc2NyaXB0b3IuYnl0ZUxlbmd0aCAtIHB1bGxJbnRvRGVzY3JpcHRvci5ieXRlc0ZpbGxlZCk7XG4gIGNvbnN0IG1heEJ5dGVzRmlsbGVkID0gcHVsbEludG9EZXNjcmlwdG9yLmJ5dGVzRmlsbGVkICsgbWF4Qnl0ZXNUb0NvcHk7XG5cbiAgbGV0IHRvdGFsQnl0ZXNUb0NvcHlSZW1haW5pbmcgPSBtYXhCeXRlc1RvQ29weTtcbiAgbGV0IHJlYWR5ID0gZmFsc2U7XG4gIGFzc2VydChwdWxsSW50b0Rlc2NyaXB0b3IuYnl0ZXNGaWxsZWQgPCBwdWxsSW50b0Rlc2NyaXB0b3IubWluaW11bUZpbGwpO1xuICBjb25zdCByZW1haW5kZXJCeXRlcyA9IG1heEJ5dGVzRmlsbGVkICUgcHVsbEludG9EZXNjcmlwdG9yLmVsZW1lbnRTaXplO1xuICBjb25zdCBtYXhBbGlnbmVkQnl0ZXMgPSBtYXhCeXRlc0ZpbGxlZCAtIHJlbWFpbmRlckJ5dGVzO1xuICAvLyBBIGRlc2NyaXB0b3IgZm9yIGEgcmVhZCgpIHJlcXVlc3QgdGhhdCBpcyBub3QgeWV0IGZpbGxlZCB1cCB0byBpdHMgbWluaW11bSBsZW5ndGggd2lsbCBzdGF5IGF0IHRoZSBoZWFkXG4gIC8vIG9mIHRoZSBxdWV1ZSwgc28gdGhlIHVuZGVybHlpbmcgc291cmNlIGNhbiBrZWVwIGZpbGxpbmcgaXQuXG4gIGlmIChtYXhBbGlnbmVkQnl0ZXMgPj0gcHVsbEludG9EZXNjcmlwdG9yLm1pbmltdW1GaWxsKSB7XG4gICAgdG90YWxCeXRlc1RvQ29weVJlbWFpbmluZyA9IG1heEFsaWduZWRCeXRlcyAtIHB1bGxJbnRvRGVzY3JpcHRvci5ieXRlc0ZpbGxlZDtcbiAgICByZWFkeSA9IHRydWU7XG4gIH1cblxuICBjb25zdCBxdWV1ZSA9IGNvbnRyb2xsZXIuX3F1ZXVlO1xuXG4gIHdoaWxlICh0b3RhbEJ5dGVzVG9Db3B5UmVtYWluaW5nID4gMCkge1xuICAgIGNvbnN0IGhlYWRPZlF1ZXVlID0gcXVldWUucGVlaygpO1xuXG4gICAgY29uc3QgYnl0ZXNUb0NvcHkgPSBNYXRoLm1pbih0b3RhbEJ5dGVzVG9Db3B5UmVtYWluaW5nLCBoZWFkT2ZRdWV1ZS5ieXRlTGVuZ3RoKTtcblxuICAgIGNvbnN0IGRlc3RTdGFydCA9IHB1bGxJbnRvRGVzY3JpcHRvci5ieXRlT2Zmc2V0ICsgcHVsbEludG9EZXNjcmlwdG9yLmJ5dGVzRmlsbGVkO1xuICAgIENvcHlEYXRhQmxvY2tCeXRlcyhwdWxsSW50b0Rlc2NyaXB0b3IuYnVmZmVyLCBkZXN0U3RhcnQsIGhlYWRPZlF1ZXVlLmJ1ZmZlciwgaGVhZE9mUXVldWUuYnl0ZU9mZnNldCwgYnl0ZXNUb0NvcHkpO1xuXG4gICAgaWYgKGhlYWRPZlF1ZXVlLmJ5dGVMZW5ndGggPT09IGJ5dGVzVG9Db3B5KSB7XG4gICAgICBxdWV1ZS5zaGlmdCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBoZWFkT2ZRdWV1ZS5ieXRlT2Zmc2V0ICs9IGJ5dGVzVG9Db3B5O1xuICAgICAgaGVhZE9mUXVldWUuYnl0ZUxlbmd0aCAtPSBieXRlc1RvQ29weTtcbiAgICB9XG4gICAgY29udHJvbGxlci5fcXVldWVUb3RhbFNpemUgLT0gYnl0ZXNUb0NvcHk7XG5cbiAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRmlsbEhlYWRQdWxsSW50b0Rlc2NyaXB0b3IoY29udHJvbGxlciwgYnl0ZXNUb0NvcHksIHB1bGxJbnRvRGVzY3JpcHRvcik7XG5cbiAgICB0b3RhbEJ5dGVzVG9Db3B5UmVtYWluaW5nIC09IGJ5dGVzVG9Db3B5O1xuICB9XG5cbiAgaWYgKCFyZWFkeSkge1xuICAgIGFzc2VydChjb250cm9sbGVyLl9xdWV1ZVRvdGFsU2l6ZSA9PT0gMCk7XG4gICAgYXNzZXJ0KHB1bGxJbnRvRGVzY3JpcHRvci5ieXRlc0ZpbGxlZCA+IDApO1xuICAgIGFzc2VydChwdWxsSW50b0Rlc2NyaXB0b3IuYnl0ZXNGaWxsZWQgPCBwdWxsSW50b0Rlc2NyaXB0b3IubWluaW11bUZpbGwpO1xuICB9XG5cbiAgcmV0dXJuIHJlYWR5O1xufVxuXG5mdW5jdGlvbiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRmlsbEhlYWRQdWxsSW50b0Rlc2NyaXB0b3IoY29udHJvbGxlcjogUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaXplOiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHVsbEludG9EZXNjcmlwdG9yOiBQdWxsSW50b0Rlc2NyaXB0b3IpIHtcbiAgYXNzZXJ0KGNvbnRyb2xsZXIuX3BlbmRpbmdQdWxsSW50b3MubGVuZ3RoID09PSAwIHx8IGNvbnRyb2xsZXIuX3BlbmRpbmdQdWxsSW50b3MucGVlaygpID09PSBwdWxsSW50b0Rlc2NyaXB0b3IpO1xuICBhc3NlcnQoY29udHJvbGxlci5fYnlvYlJlcXVlc3QgPT09IG51bGwpO1xuICBwdWxsSW50b0Rlc2NyaXB0b3IuYnl0ZXNGaWxsZWQgKz0gc2l6ZTtcbn1cblxuZnVuY3Rpb24gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckhhbmRsZVF1ZXVlRHJhaW4oY29udHJvbGxlcjogUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcikge1xuICBhc3NlcnQoY29udHJvbGxlci5fY29udHJvbGxlZFJlYWRhYmxlQnl0ZVN0cmVhbS5fc3RhdGUgPT09ICdyZWFkYWJsZScpO1xuXG4gIGlmIChjb250cm9sbGVyLl9xdWV1ZVRvdGFsU2l6ZSA9PT0gMCAmJiBjb250cm9sbGVyLl9jbG9zZVJlcXVlc3RlZCkge1xuICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJDbGVhckFsZ29yaXRobXMoY29udHJvbGxlcik7XG4gICAgUmVhZGFibGVTdHJlYW1DbG9zZShjb250cm9sbGVyLl9jb250cm9sbGVkUmVhZGFibGVCeXRlU3RyZWFtKTtcbiAgfSBlbHNlIHtcbiAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyQ2FsbFB1bGxJZk5lZWRlZChjb250cm9sbGVyKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVySW52YWxpZGF0ZUJZT0JSZXF1ZXN0KGNvbnRyb2xsZXI6IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIpIHtcbiAgaWYgKGNvbnRyb2xsZXIuX2J5b2JSZXF1ZXN0ID09PSBudWxsKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29udHJvbGxlci5fYnlvYlJlcXVlc3QuX2Fzc29jaWF0ZWRSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyID0gdW5kZWZpbmVkITtcbiAgY29udHJvbGxlci5fYnlvYlJlcXVlc3QuX3ZpZXcgPSBudWxsITtcbiAgY29udHJvbGxlci5fYnlvYlJlcXVlc3QgPSBudWxsO1xufVxuXG5mdW5jdGlvbiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyUHJvY2Vzc1B1bGxJbnRvRGVzY3JpcHRvcnNVc2luZ1F1ZXVlKGNvbnRyb2xsZXI6IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIpIHtcbiAgYXNzZXJ0KCFjb250cm9sbGVyLl9jbG9zZVJlcXVlc3RlZCk7XG5cbiAgd2hpbGUgKGNvbnRyb2xsZXIuX3BlbmRpbmdQdWxsSW50b3MubGVuZ3RoID4gMCkge1xuICAgIGlmIChjb250cm9sbGVyLl9xdWV1ZVRvdGFsU2l6ZSA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHB1bGxJbnRvRGVzY3JpcHRvciA9IGNvbnRyb2xsZXIuX3BlbmRpbmdQdWxsSW50b3MucGVlaygpO1xuICAgIGFzc2VydChwdWxsSW50b0Rlc2NyaXB0b3IucmVhZGVyVHlwZSAhPT0gJ25vbmUnKTtcblxuICAgIGlmIChSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRmlsbFB1bGxJbnRvRGVzY3JpcHRvckZyb21RdWV1ZShjb250cm9sbGVyLCBwdWxsSW50b0Rlc2NyaXB0b3IpKSB7XG4gICAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyU2hpZnRQZW5kaW5nUHVsbEludG8oY29udHJvbGxlcik7XG5cbiAgICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJDb21taXRQdWxsSW50b0Rlc2NyaXB0b3IoXG4gICAgICAgIGNvbnRyb2xsZXIuX2NvbnRyb2xsZWRSZWFkYWJsZUJ5dGVTdHJlYW0sXG4gICAgICAgIHB1bGxJbnRvRGVzY3JpcHRvclxuICAgICAgKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclByb2Nlc3NSZWFkUmVxdWVzdHNVc2luZ1F1ZXVlKGNvbnRyb2xsZXI6IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIpIHtcbiAgY29uc3QgcmVhZGVyID0gY29udHJvbGxlci5fY29udHJvbGxlZFJlYWRhYmxlQnl0ZVN0cmVhbS5fcmVhZGVyO1xuICBhc3NlcnQoSXNSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXIocmVhZGVyKSk7XG4gIHdoaWxlIChyZWFkZXIuX3JlYWRSZXF1ZXN0cy5sZW5ndGggPiAwKSB7XG4gICAgaWYgKGNvbnRyb2xsZXIuX3F1ZXVlVG90YWxTaXplID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHJlYWRSZXF1ZXN0ID0gcmVhZGVyLl9yZWFkUmVxdWVzdHMuc2hpZnQoKTtcbiAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRmlsbFJlYWRSZXF1ZXN0RnJvbVF1ZXVlKGNvbnRyb2xsZXIsIHJlYWRSZXF1ZXN0KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclB1bGxJbnRvPFQgZXh0ZW5kcyBOb25TaGFyZWQ8QXJyYXlCdWZmZXJWaWV3Pj4oXG4gIGNvbnRyb2xsZXI6IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIsXG4gIHZpZXc6IFQsXG4gIG1pbjogbnVtYmVyLFxuICByZWFkSW50b1JlcXVlc3Q6IFJlYWRJbnRvUmVxdWVzdDxUPlxuKTogdm9pZCB7XG4gIGNvbnN0IHN0cmVhbSA9IGNvbnRyb2xsZXIuX2NvbnRyb2xsZWRSZWFkYWJsZUJ5dGVTdHJlYW07XG5cbiAgY29uc3QgY3RvciA9IHZpZXcuY29uc3RydWN0b3IgYXMgQXJyYXlCdWZmZXJWaWV3Q29uc3RydWN0b3I8VD47XG4gIGNvbnN0IGVsZW1lbnRTaXplID0gYXJyYXlCdWZmZXJWaWV3RWxlbWVudFNpemUoY3Rvcik7XG5cbiAgY29uc3QgeyBieXRlT2Zmc2V0LCBieXRlTGVuZ3RoIH0gPSB2aWV3O1xuXG4gIGNvbnN0IG1pbmltdW1GaWxsID0gbWluICogZWxlbWVudFNpemU7XG4gIGFzc2VydChtaW5pbXVtRmlsbCA+PSBlbGVtZW50U2l6ZSAmJiBtaW5pbXVtRmlsbCA8PSBieXRlTGVuZ3RoKTtcbiAgYXNzZXJ0KG1pbmltdW1GaWxsICUgZWxlbWVudFNpemUgPT09IDApO1xuXG4gIGxldCBidWZmZXI6IEFycmF5QnVmZmVyO1xuICB0cnkge1xuICAgIGJ1ZmZlciA9IFRyYW5zZmVyQXJyYXlCdWZmZXIodmlldy5idWZmZXIpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmVhZEludG9SZXF1ZXN0Ll9lcnJvclN0ZXBzKGUpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHB1bGxJbnRvRGVzY3JpcHRvcjogQllPQlB1bGxJbnRvRGVzY3JpcHRvcjxUPiA9IHtcbiAgICBidWZmZXIsXG4gICAgYnVmZmVyQnl0ZUxlbmd0aDogYnVmZmVyLmJ5dGVMZW5ndGgsXG4gICAgYnl0ZU9mZnNldCxcbiAgICBieXRlTGVuZ3RoLFxuICAgIGJ5dGVzRmlsbGVkOiAwLFxuICAgIG1pbmltdW1GaWxsLFxuICAgIGVsZW1lbnRTaXplLFxuICAgIHZpZXdDb25zdHJ1Y3RvcjogY3RvcixcbiAgICByZWFkZXJUeXBlOiAnYnlvYidcbiAgfTtcblxuICBpZiAoY29udHJvbGxlci5fcGVuZGluZ1B1bGxJbnRvcy5sZW5ndGggPiAwKSB7XG4gICAgY29udHJvbGxlci5fcGVuZGluZ1B1bGxJbnRvcy5wdXNoKHB1bGxJbnRvRGVzY3JpcHRvcik7XG5cbiAgICAvLyBObyBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyQ2FsbFB1bGxJZk5lZWRlZCgpIGNhbGwgc2luY2U6XG4gICAgLy8gLSBObyBjaGFuZ2UgaGFwcGVucyBvbiBkZXNpcmVkU2l6ZVxuICAgIC8vIC0gVGhlIHNvdXJjZSBoYXMgYWxyZWFkeSBiZWVuIG5vdGlmaWVkIG9mIHRoYXQgdGhlcmUncyBhdCBsZWFzdCAxIHBlbmRpbmcgcmVhZCh2aWV3KVxuXG4gICAgUmVhZGFibGVTdHJlYW1BZGRSZWFkSW50b1JlcXVlc3Qoc3RyZWFtLCByZWFkSW50b1JlcXVlc3QpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChzdHJlYW0uX3N0YXRlID09PSAnY2xvc2VkJykge1xuICAgIGNvbnN0IGVtcHR5VmlldyA9IG5ldyBjdG9yKHB1bGxJbnRvRGVzY3JpcHRvci5idWZmZXIsIHB1bGxJbnRvRGVzY3JpcHRvci5ieXRlT2Zmc2V0LCAwKTtcbiAgICByZWFkSW50b1JlcXVlc3QuX2Nsb3NlU3RlcHMoZW1wdHlWaWV3KTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoY29udHJvbGxlci5fcXVldWVUb3RhbFNpemUgPiAwKSB7XG4gICAgaWYgKFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJGaWxsUHVsbEludG9EZXNjcmlwdG9yRnJvbVF1ZXVlKGNvbnRyb2xsZXIsIHB1bGxJbnRvRGVzY3JpcHRvcikpIHtcbiAgICAgIGNvbnN0IGZpbGxlZFZpZXcgPSBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyQ29udmVydFB1bGxJbnRvRGVzY3JpcHRvcjxUPihwdWxsSW50b0Rlc2NyaXB0b3IpO1xuXG4gICAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVySGFuZGxlUXVldWVEcmFpbihjb250cm9sbGVyKTtcblxuICAgICAgcmVhZEludG9SZXF1ZXN0Ll9jaHVua1N0ZXBzKGZpbGxlZFZpZXcpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChjb250cm9sbGVyLl9jbG9zZVJlcXVlc3RlZCkge1xuICAgICAgY29uc3QgZSA9IG5ldyBUeXBlRXJyb3IoJ0luc3VmZmljaWVudCBieXRlcyB0byBmaWxsIGVsZW1lbnRzIGluIHRoZSBnaXZlbiBidWZmZXInKTtcbiAgICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJFcnJvcihjb250cm9sbGVyLCBlKTtcblxuICAgICAgcmVhZEludG9SZXF1ZXN0Ll9lcnJvclN0ZXBzKGUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuXG4gIGNvbnRyb2xsZXIuX3BlbmRpbmdQdWxsSW50b3MucHVzaChwdWxsSW50b0Rlc2NyaXB0b3IpO1xuXG4gIFJlYWRhYmxlU3RyZWFtQWRkUmVhZEludG9SZXF1ZXN0PFQ+KHN0cmVhbSwgcmVhZEludG9SZXF1ZXN0KTtcbiAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckNhbGxQdWxsSWZOZWVkZWQoY29udHJvbGxlcik7XG59XG5cbmZ1bmN0aW9uIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJSZXNwb25kSW5DbG9zZWRTdGF0ZShjb250cm9sbGVyOiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0RGVzY3JpcHRvcjogUHVsbEludG9EZXNjcmlwdG9yKSB7XG4gIGFzc2VydChmaXJzdERlc2NyaXB0b3IuYnl0ZXNGaWxsZWQgJSBmaXJzdERlc2NyaXB0b3IuZWxlbWVudFNpemUgPT09IDApO1xuXG4gIGlmIChmaXJzdERlc2NyaXB0b3IucmVhZGVyVHlwZSA9PT0gJ25vbmUnKSB7XG4gICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclNoaWZ0UGVuZGluZ1B1bGxJbnRvKGNvbnRyb2xsZXIpO1xuICB9XG5cbiAgY29uc3Qgc3RyZWFtID0gY29udHJvbGxlci5fY29udHJvbGxlZFJlYWRhYmxlQnl0ZVN0cmVhbTtcbiAgaWYgKFJlYWRhYmxlU3RyZWFtSGFzQllPQlJlYWRlcihzdHJlYW0pKSB7XG4gICAgd2hpbGUgKFJlYWRhYmxlU3RyZWFtR2V0TnVtUmVhZEludG9SZXF1ZXN0cyhzdHJlYW0pID4gMCkge1xuICAgICAgY29uc3QgcHVsbEludG9EZXNjcmlwdG9yID0gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclNoaWZ0UGVuZGluZ1B1bGxJbnRvKGNvbnRyb2xsZXIpO1xuICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckNvbW1pdFB1bGxJbnRvRGVzY3JpcHRvcihzdHJlYW0sIHB1bGxJbnRvRGVzY3JpcHRvcik7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJSZXNwb25kSW5SZWFkYWJsZVN0YXRlKGNvbnRyb2xsZXI6IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBieXRlc1dyaXR0ZW46IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHB1bGxJbnRvRGVzY3JpcHRvcjogUHVsbEludG9EZXNjcmlwdG9yKSB7XG4gIGFzc2VydChwdWxsSW50b0Rlc2NyaXB0b3IuYnl0ZXNGaWxsZWQgKyBieXRlc1dyaXR0ZW4gPD0gcHVsbEludG9EZXNjcmlwdG9yLmJ5dGVMZW5ndGgpO1xuXG4gIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJGaWxsSGVhZFB1bGxJbnRvRGVzY3JpcHRvcihjb250cm9sbGVyLCBieXRlc1dyaXR0ZW4sIHB1bGxJbnRvRGVzY3JpcHRvcik7XG5cbiAgaWYgKHB1bGxJbnRvRGVzY3JpcHRvci5yZWFkZXJUeXBlID09PSAnbm9uZScpIHtcbiAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRW5xdWV1ZURldGFjaGVkUHVsbEludG9Ub1F1ZXVlKGNvbnRyb2xsZXIsIHB1bGxJbnRvRGVzY3JpcHRvcik7XG4gICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclByb2Nlc3NQdWxsSW50b0Rlc2NyaXB0b3JzVXNpbmdRdWV1ZShjb250cm9sbGVyKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAocHVsbEludG9EZXNjcmlwdG9yLmJ5dGVzRmlsbGVkIDwgcHVsbEludG9EZXNjcmlwdG9yLm1pbmltdW1GaWxsKSB7XG4gICAgLy8gQSBkZXNjcmlwdG9yIGZvciBhIHJlYWQoKSByZXF1ZXN0IHRoYXQgaXMgbm90IHlldCBmaWxsZWQgdXAgdG8gaXRzIG1pbmltdW0gbGVuZ3RoIHdpbGwgc3RheSBhdCB0aGUgaGVhZFxuICAgIC8vIG9mIHRoZSBxdWV1ZSwgc28gdGhlIHVuZGVybHlpbmcgc291cmNlIGNhbiBrZWVwIGZpbGxpbmcgaXQuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclNoaWZ0UGVuZGluZ1B1bGxJbnRvKGNvbnRyb2xsZXIpO1xuXG4gIGNvbnN0IHJlbWFpbmRlclNpemUgPSBwdWxsSW50b0Rlc2NyaXB0b3IuYnl0ZXNGaWxsZWQgJSBwdWxsSW50b0Rlc2NyaXB0b3IuZWxlbWVudFNpemU7XG4gIGlmIChyZW1haW5kZXJTaXplID4gMCkge1xuICAgIGNvbnN0IGVuZCA9IHB1bGxJbnRvRGVzY3JpcHRvci5ieXRlT2Zmc2V0ICsgcHVsbEludG9EZXNjcmlwdG9yLmJ5dGVzRmlsbGVkO1xuICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJFbnF1ZXVlQ2xvbmVkQ2h1bmtUb1F1ZXVlKFxuICAgICAgY29udHJvbGxlcixcbiAgICAgIHB1bGxJbnRvRGVzY3JpcHRvci5idWZmZXIsXG4gICAgICBlbmQgLSByZW1haW5kZXJTaXplLFxuICAgICAgcmVtYWluZGVyU2l6ZVxuICAgICk7XG4gIH1cblxuICBwdWxsSW50b0Rlc2NyaXB0b3IuYnl0ZXNGaWxsZWQgLT0gcmVtYWluZGVyU2l6ZTtcbiAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckNvbW1pdFB1bGxJbnRvRGVzY3JpcHRvcihjb250cm9sbGVyLl9jb250cm9sbGVkUmVhZGFibGVCeXRlU3RyZWFtLCBwdWxsSW50b0Rlc2NyaXB0b3IpO1xuXG4gIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJQcm9jZXNzUHVsbEludG9EZXNjcmlwdG9yc1VzaW5nUXVldWUoY29udHJvbGxlcik7XG59XG5cbmZ1bmN0aW9uIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJSZXNwb25kSW50ZXJuYWwoY29udHJvbGxlcjogUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlciwgYnl0ZXNXcml0dGVuOiBudW1iZXIpIHtcbiAgY29uc3QgZmlyc3REZXNjcmlwdG9yID0gY29udHJvbGxlci5fcGVuZGluZ1B1bGxJbnRvcy5wZWVrKCk7XG4gIGFzc2VydChDYW5UcmFuc2ZlckFycmF5QnVmZmVyKGZpcnN0RGVzY3JpcHRvci5idWZmZXIpKTtcblxuICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVySW52YWxpZGF0ZUJZT0JSZXF1ZXN0KGNvbnRyb2xsZXIpO1xuXG4gIGNvbnN0IHN0YXRlID0gY29udHJvbGxlci5fY29udHJvbGxlZFJlYWRhYmxlQnl0ZVN0cmVhbS5fc3RhdGU7XG4gIGlmIChzdGF0ZSA9PT0gJ2Nsb3NlZCcpIHtcbiAgICBhc3NlcnQoYnl0ZXNXcml0dGVuID09PSAwKTtcbiAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyUmVzcG9uZEluQ2xvc2VkU3RhdGUoY29udHJvbGxlciwgZmlyc3REZXNjcmlwdG9yKTtcbiAgfSBlbHNlIHtcbiAgICBhc3NlcnQoc3RhdGUgPT09ICdyZWFkYWJsZScpO1xuICAgIGFzc2VydChieXRlc1dyaXR0ZW4gPiAwKTtcbiAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyUmVzcG9uZEluUmVhZGFibGVTdGF0ZShjb250cm9sbGVyLCBieXRlc1dyaXR0ZW4sIGZpcnN0RGVzY3JpcHRvcik7XG4gIH1cblxuICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyQ2FsbFB1bGxJZk5lZWRlZChjb250cm9sbGVyKTtcbn1cblxuZnVuY3Rpb24gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclNoaWZ0UGVuZGluZ1B1bGxJbnRvKFxuICBjb250cm9sbGVyOiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyXG4pOiBQdWxsSW50b0Rlc2NyaXB0b3Ige1xuICBhc3NlcnQoY29udHJvbGxlci5fYnlvYlJlcXVlc3QgPT09IG51bGwpO1xuICBjb25zdCBkZXNjcmlwdG9yID0gY29udHJvbGxlci5fcGVuZGluZ1B1bGxJbnRvcy5zaGlmdCgpITtcbiAgcmV0dXJuIGRlc2NyaXB0b3I7XG59XG5cbmZ1bmN0aW9uIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJTaG91bGRDYWxsUHVsbChjb250cm9sbGVyOiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyKTogYm9vbGVhbiB7XG4gIGNvbnN0IHN0cmVhbSA9IGNvbnRyb2xsZXIuX2NvbnRyb2xsZWRSZWFkYWJsZUJ5dGVTdHJlYW07XG5cbiAgaWYgKHN0cmVhbS5fc3RhdGUgIT09ICdyZWFkYWJsZScpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoY29udHJvbGxlci5fY2xvc2VSZXF1ZXN0ZWQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoIWNvbnRyb2xsZXIuX3N0YXJ0ZWQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoUmVhZGFibGVTdHJlYW1IYXNEZWZhdWx0UmVhZGVyKHN0cmVhbSkgJiYgUmVhZGFibGVTdHJlYW1HZXROdW1SZWFkUmVxdWVzdHMoc3RyZWFtKSA+IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmIChSZWFkYWJsZVN0cmVhbUhhc0JZT0JSZWFkZXIoc3RyZWFtKSAmJiBSZWFkYWJsZVN0cmVhbUdldE51bVJlYWRJbnRvUmVxdWVzdHMoc3RyZWFtKSA+IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGNvbnN0IGRlc2lyZWRTaXplID0gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckdldERlc2lyZWRTaXplKGNvbnRyb2xsZXIpO1xuICBhc3NlcnQoZGVzaXJlZFNpemUgIT09IG51bGwpO1xuICBpZiAoZGVzaXJlZFNpemUhID4gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyQ2xlYXJBbGdvcml0aG1zKGNvbnRyb2xsZXI6IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIpIHtcbiAgY29udHJvbGxlci5fcHVsbEFsZ29yaXRobSA9IHVuZGVmaW5lZCE7XG4gIGNvbnRyb2xsZXIuX2NhbmNlbEFsZ29yaXRobSA9IHVuZGVmaW5lZCE7XG59XG5cbi8vIEEgY2xpZW50IG9mIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIgbWF5IHVzZSB0aGVzZSBmdW5jdGlvbnMgZGlyZWN0bHkgdG8gYnlwYXNzIHN0YXRlIGNoZWNrLlxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckNsb3NlKGNvbnRyb2xsZXI6IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIpIHtcbiAgY29uc3Qgc3RyZWFtID0gY29udHJvbGxlci5fY29udHJvbGxlZFJlYWRhYmxlQnl0ZVN0cmVhbTtcblxuICBpZiAoY29udHJvbGxlci5fY2xvc2VSZXF1ZXN0ZWQgfHwgc3RyZWFtLl9zdGF0ZSAhPT0gJ3JlYWRhYmxlJykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChjb250cm9sbGVyLl9xdWV1ZVRvdGFsU2l6ZSA+IDApIHtcbiAgICBjb250cm9sbGVyLl9jbG9zZVJlcXVlc3RlZCA9IHRydWU7XG5cbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoY29udHJvbGxlci5fcGVuZGluZ1B1bGxJbnRvcy5sZW5ndGggPiAwKSB7XG4gICAgY29uc3QgZmlyc3RQZW5kaW5nUHVsbEludG8gPSBjb250cm9sbGVyLl9wZW5kaW5nUHVsbEludG9zLnBlZWsoKTtcbiAgICBpZiAoZmlyc3RQZW5kaW5nUHVsbEludG8uYnl0ZXNGaWxsZWQgJSBmaXJzdFBlbmRpbmdQdWxsSW50by5lbGVtZW50U2l6ZSAhPT0gMCkge1xuICAgICAgY29uc3QgZSA9IG5ldyBUeXBlRXJyb3IoJ0luc3VmZmljaWVudCBieXRlcyB0byBmaWxsIGVsZW1lbnRzIGluIHRoZSBnaXZlbiBidWZmZXInKTtcbiAgICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJFcnJvcihjb250cm9sbGVyLCBlKTtcblxuICAgICAgdGhyb3cgZTtcbiAgICB9XG4gIH1cblxuICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyQ2xlYXJBbGdvcml0aG1zKGNvbnRyb2xsZXIpO1xuICBSZWFkYWJsZVN0cmVhbUNsb3NlKHN0cmVhbSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRW5xdWV1ZShcbiAgY29udHJvbGxlcjogUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcixcbiAgY2h1bms6IE5vblNoYXJlZDxBcnJheUJ1ZmZlclZpZXc+XG4pIHtcbiAgY29uc3Qgc3RyZWFtID0gY29udHJvbGxlci5fY29udHJvbGxlZFJlYWRhYmxlQnl0ZVN0cmVhbTtcblxuICBpZiAoY29udHJvbGxlci5fY2xvc2VSZXF1ZXN0ZWQgfHwgc3RyZWFtLl9zdGF0ZSAhPT0gJ3JlYWRhYmxlJykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHsgYnVmZmVyLCBieXRlT2Zmc2V0LCBieXRlTGVuZ3RoIH0gPSBjaHVuaztcbiAgaWYgKElzRGV0YWNoZWRCdWZmZXIoYnVmZmVyKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2NodW5rXFwncyBidWZmZXIgaXMgZGV0YWNoZWQgYW5kIHNvIGNhbm5vdCBiZSBlbnF1ZXVlZCcpO1xuICB9XG4gIGNvbnN0IHRyYW5zZmVycmVkQnVmZmVyID0gVHJhbnNmZXJBcnJheUJ1ZmZlcihidWZmZXIpO1xuXG4gIGlmIChjb250cm9sbGVyLl9wZW5kaW5nUHVsbEludG9zLmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCBmaXJzdFBlbmRpbmdQdWxsSW50byA9IGNvbnRyb2xsZXIuX3BlbmRpbmdQdWxsSW50b3MucGVlaygpO1xuICAgIGlmIChJc0RldGFjaGVkQnVmZmVyKGZpcnN0UGVuZGluZ1B1bGxJbnRvLmJ1ZmZlcikpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICdUaGUgQllPQiByZXF1ZXN0XFwncyBidWZmZXIgaGFzIGJlZW4gZGV0YWNoZWQgYW5kIHNvIGNhbm5vdCBiZSBmaWxsZWQgd2l0aCBhbiBlbnF1ZXVlZCBjaHVuaydcbiAgICAgICk7XG4gICAgfVxuICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJJbnZhbGlkYXRlQllPQlJlcXVlc3QoY29udHJvbGxlcik7XG4gICAgZmlyc3RQZW5kaW5nUHVsbEludG8uYnVmZmVyID0gVHJhbnNmZXJBcnJheUJ1ZmZlcihmaXJzdFBlbmRpbmdQdWxsSW50by5idWZmZXIpO1xuICAgIGlmIChmaXJzdFBlbmRpbmdQdWxsSW50by5yZWFkZXJUeXBlID09PSAnbm9uZScpIHtcbiAgICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJFbnF1ZXVlRGV0YWNoZWRQdWxsSW50b1RvUXVldWUoY29udHJvbGxlciwgZmlyc3RQZW5kaW5nUHVsbEludG8pO1xuICAgIH1cbiAgfVxuXG4gIGlmIChSZWFkYWJsZVN0cmVhbUhhc0RlZmF1bHRSZWFkZXIoc3RyZWFtKSkge1xuICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJQcm9jZXNzUmVhZFJlcXVlc3RzVXNpbmdRdWV1ZShjb250cm9sbGVyKTtcbiAgICBpZiAoUmVhZGFibGVTdHJlYW1HZXROdW1SZWFkUmVxdWVzdHMoc3RyZWFtKSA9PT0gMCkge1xuICAgICAgYXNzZXJ0KGNvbnRyb2xsZXIuX3BlbmRpbmdQdWxsSW50b3MubGVuZ3RoID09PSAwKTtcbiAgICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJFbnF1ZXVlQ2h1bmtUb1F1ZXVlKGNvbnRyb2xsZXIsIHRyYW5zZmVycmVkQnVmZmVyLCBieXRlT2Zmc2V0LCBieXRlTGVuZ3RoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXNzZXJ0KGNvbnRyb2xsZXIuX3F1ZXVlLmxlbmd0aCA9PT0gMCk7XG4gICAgICBpZiAoY29udHJvbGxlci5fcGVuZGluZ1B1bGxJbnRvcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGFzc2VydChjb250cm9sbGVyLl9wZW5kaW5nUHVsbEludG9zLnBlZWsoKS5yZWFkZXJUeXBlID09PSAnZGVmYXVsdCcpO1xuICAgICAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyU2hpZnRQZW5kaW5nUHVsbEludG8oY29udHJvbGxlcik7XG4gICAgICB9XG4gICAgICBjb25zdCB0cmFuc2ZlcnJlZFZpZXcgPSBuZXcgVWludDhBcnJheSh0cmFuc2ZlcnJlZEJ1ZmZlciwgYnl0ZU9mZnNldCwgYnl0ZUxlbmd0aCk7XG4gICAgICBSZWFkYWJsZVN0cmVhbUZ1bGZpbGxSZWFkUmVxdWVzdChzdHJlYW0sIHRyYW5zZmVycmVkVmlldyBhcyBOb25TaGFyZWQ8VWludDhBcnJheT4sIGZhbHNlKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoUmVhZGFibGVTdHJlYW1IYXNCWU9CUmVhZGVyKHN0cmVhbSkpIHtcbiAgICAvLyBUT0RPOiBJZGVhbGx5IGluIHRoaXMgYnJhbmNoIGRldGFjaGluZyBzaG91bGQgaGFwcGVuIG9ubHkgaWYgdGhlIGJ1ZmZlciBpcyBub3QgY29uc3VtZWQgZnVsbHkuXG4gICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVucXVldWVDaHVua1RvUXVldWUoY29udHJvbGxlciwgdHJhbnNmZXJyZWRCdWZmZXIsIGJ5dGVPZmZzZXQsIGJ5dGVMZW5ndGgpO1xuICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJQcm9jZXNzUHVsbEludG9EZXNjcmlwdG9yc1VzaW5nUXVldWUoY29udHJvbGxlcik7XG4gIH0gZWxzZSB7XG4gICAgYXNzZXJ0KCFJc1JlYWRhYmxlU3RyZWFtTG9ja2VkKHN0cmVhbSkpO1xuICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJFbnF1ZXVlQ2h1bmtUb1F1ZXVlKGNvbnRyb2xsZXIsIHRyYW5zZmVycmVkQnVmZmVyLCBieXRlT2Zmc2V0LCBieXRlTGVuZ3RoKTtcbiAgfVxuXG4gIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJDYWxsUHVsbElmTmVlZGVkKGNvbnRyb2xsZXIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVycm9yKGNvbnRyb2xsZXI6IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIsIGU6IGFueSkge1xuICBjb25zdCBzdHJlYW0gPSBjb250cm9sbGVyLl9jb250cm9sbGVkUmVhZGFibGVCeXRlU3RyZWFtO1xuXG4gIGlmIChzdHJlYW0uX3N0YXRlICE9PSAncmVhZGFibGUnKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckNsZWFyUGVuZGluZ1B1bGxJbnRvcyhjb250cm9sbGVyKTtcblxuICBSZXNldFF1ZXVlKGNvbnRyb2xsZXIpO1xuICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyQ2xlYXJBbGdvcml0aG1zKGNvbnRyb2xsZXIpO1xuICBSZWFkYWJsZVN0cmVhbUVycm9yKHN0cmVhbSwgZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRmlsbFJlYWRSZXF1ZXN0RnJvbVF1ZXVlKFxuICBjb250cm9sbGVyOiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyLFxuICByZWFkUmVxdWVzdDogUmVhZFJlcXVlc3Q8Tm9uU2hhcmVkPFVpbnQ4QXJyYXk+PlxuKSB7XG4gIGFzc2VydChjb250cm9sbGVyLl9xdWV1ZVRvdGFsU2l6ZSA+IDApO1xuXG4gIGNvbnN0IGVudHJ5ID0gY29udHJvbGxlci5fcXVldWUuc2hpZnQoKTtcbiAgY29udHJvbGxlci5fcXVldWVUb3RhbFNpemUgLT0gZW50cnkuYnl0ZUxlbmd0aDtcblxuICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVySGFuZGxlUXVldWVEcmFpbihjb250cm9sbGVyKTtcblxuICBjb25zdCB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkoZW50cnkuYnVmZmVyLCBlbnRyeS5ieXRlT2Zmc2V0LCBlbnRyeS5ieXRlTGVuZ3RoKTtcbiAgcmVhZFJlcXVlc3QuX2NodW5rU3RlcHModmlldyBhcyBOb25TaGFyZWQ8VWludDhBcnJheT4pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckdldEJZT0JSZXF1ZXN0KFxuICBjb250cm9sbGVyOiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyXG4pOiBSZWFkYWJsZVN0cmVhbUJZT0JSZXF1ZXN0IHwgbnVsbCB7XG4gIGlmIChjb250cm9sbGVyLl9ieW9iUmVxdWVzdCA9PT0gbnVsbCAmJiBjb250cm9sbGVyLl9wZW5kaW5nUHVsbEludG9zLmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCBmaXJzdERlc2NyaXB0b3IgPSBjb250cm9sbGVyLl9wZW5kaW5nUHVsbEludG9zLnBlZWsoKTtcbiAgICBjb25zdCB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkoZmlyc3REZXNjcmlwdG9yLmJ1ZmZlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3REZXNjcmlwdG9yLmJ5dGVPZmZzZXQgKyBmaXJzdERlc2NyaXB0b3IuYnl0ZXNGaWxsZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0RGVzY3JpcHRvci5ieXRlTGVuZ3RoIC0gZmlyc3REZXNjcmlwdG9yLmJ5dGVzRmlsbGVkKTtcblxuICAgIGNvbnN0IGJ5b2JSZXF1ZXN0OiBSZWFkYWJsZVN0cmVhbUJZT0JSZXF1ZXN0ID0gT2JqZWN0LmNyZWF0ZShSZWFkYWJsZVN0cmVhbUJZT0JSZXF1ZXN0LnByb3RvdHlwZSk7XG4gICAgU2V0VXBSZWFkYWJsZVN0cmVhbUJZT0JSZXF1ZXN0KGJ5b2JSZXF1ZXN0LCBjb250cm9sbGVyLCB2aWV3IGFzIE5vblNoYXJlZDxVaW50OEFycmF5Pik7XG4gICAgY29udHJvbGxlci5fYnlvYlJlcXVlc3QgPSBieW9iUmVxdWVzdDtcbiAgfVxuICByZXR1cm4gY29udHJvbGxlci5fYnlvYlJlcXVlc3Q7XG59XG5cbmZ1bmN0aW9uIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJHZXREZXNpcmVkU2l6ZShjb250cm9sbGVyOiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyKTogbnVtYmVyIHwgbnVsbCB7XG4gIGNvbnN0IHN0YXRlID0gY29udHJvbGxlci5fY29udHJvbGxlZFJlYWRhYmxlQnl0ZVN0cmVhbS5fc3RhdGU7XG5cbiAgaWYgKHN0YXRlID09PSAnZXJyb3JlZCcpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBpZiAoc3RhdGUgPT09ICdjbG9zZWQnKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICByZXR1cm4gY29udHJvbGxlci5fc3RyYXRlZ3lIV00gLSBjb250cm9sbGVyLl9xdWV1ZVRvdGFsU2l6ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJSZXNwb25kKGNvbnRyb2xsZXI6IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIsIGJ5dGVzV3JpdHRlbjogbnVtYmVyKSB7XG4gIGFzc2VydChjb250cm9sbGVyLl9wZW5kaW5nUHVsbEludG9zLmxlbmd0aCA+IDApO1xuXG4gIGNvbnN0IGZpcnN0RGVzY3JpcHRvciA9IGNvbnRyb2xsZXIuX3BlbmRpbmdQdWxsSW50b3MucGVlaygpO1xuICBjb25zdCBzdGF0ZSA9IGNvbnRyb2xsZXIuX2NvbnRyb2xsZWRSZWFkYWJsZUJ5dGVTdHJlYW0uX3N0YXRlO1xuXG4gIGlmIChzdGF0ZSA9PT0gJ2Nsb3NlZCcpIHtcbiAgICBpZiAoYnl0ZXNXcml0dGVuICE9PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdieXRlc1dyaXR0ZW4gbXVzdCBiZSAwIHdoZW4gY2FsbGluZyByZXNwb25kKCkgb24gYSBjbG9zZWQgc3RyZWFtJyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGFzc2VydChzdGF0ZSA9PT0gJ3JlYWRhYmxlJyk7XG4gICAgaWYgKGJ5dGVzV3JpdHRlbiA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignYnl0ZXNXcml0dGVuIG11c3QgYmUgZ3JlYXRlciB0aGFuIDAgd2hlbiBjYWxsaW5nIHJlc3BvbmQoKSBvbiBhIHJlYWRhYmxlIHN0cmVhbScpO1xuICAgIH1cbiAgICBpZiAoZmlyc3REZXNjcmlwdG9yLmJ5dGVzRmlsbGVkICsgYnl0ZXNXcml0dGVuID4gZmlyc3REZXNjcmlwdG9yLmJ5dGVMZW5ndGgpIHtcbiAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdieXRlc1dyaXR0ZW4gb3V0IG9mIHJhbmdlJyk7XG4gICAgfVxuICB9XG5cbiAgZmlyc3REZXNjcmlwdG9yLmJ1ZmZlciA9IFRyYW5zZmVyQXJyYXlCdWZmZXIoZmlyc3REZXNjcmlwdG9yLmJ1ZmZlcik7XG5cbiAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclJlc3BvbmRJbnRlcm5hbChjb250cm9sbGVyLCBieXRlc1dyaXR0ZW4pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclJlc3BvbmRXaXRoTmV3Vmlldyhjb250cm9sbGVyOiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlldzogTm9uU2hhcmVkPEFycmF5QnVmZmVyVmlldz4pIHtcbiAgYXNzZXJ0KGNvbnRyb2xsZXIuX3BlbmRpbmdQdWxsSW50b3MubGVuZ3RoID4gMCk7XG4gIGFzc2VydCghSXNEZXRhY2hlZEJ1ZmZlcih2aWV3LmJ1ZmZlcikpO1xuXG4gIGNvbnN0IGZpcnN0RGVzY3JpcHRvciA9IGNvbnRyb2xsZXIuX3BlbmRpbmdQdWxsSW50b3MucGVlaygpO1xuICBjb25zdCBzdGF0ZSA9IGNvbnRyb2xsZXIuX2NvbnRyb2xsZWRSZWFkYWJsZUJ5dGVTdHJlYW0uX3N0YXRlO1xuXG4gIGlmIChzdGF0ZSA9PT0gJ2Nsb3NlZCcpIHtcbiAgICBpZiAodmlldy5ieXRlTGVuZ3RoICE9PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgdmlld1xcJ3MgbGVuZ3RoIG11c3QgYmUgMCB3aGVuIGNhbGxpbmcgcmVzcG9uZFdpdGhOZXdWaWV3KCkgb24gYSBjbG9zZWQgc3RyZWFtJyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGFzc2VydChzdGF0ZSA9PT0gJ3JlYWRhYmxlJyk7XG4gICAgaWYgKHZpZXcuYnl0ZUxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgJ1RoZSB2aWV3XFwncyBsZW5ndGggbXVzdCBiZSBncmVhdGVyIHRoYW4gMCB3aGVuIGNhbGxpbmcgcmVzcG9uZFdpdGhOZXdWaWV3KCkgb24gYSByZWFkYWJsZSBzdHJlYW0nXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIGlmIChmaXJzdERlc2NyaXB0b3IuYnl0ZU9mZnNldCArIGZpcnN0RGVzY3JpcHRvci5ieXRlc0ZpbGxlZCAhPT0gdmlldy5ieXRlT2Zmc2V0KSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RoZSByZWdpb24gc3BlY2lmaWVkIGJ5IHZpZXcgZG9lcyBub3QgbWF0Y2ggYnlvYlJlcXVlc3QnKTtcbiAgfVxuICBpZiAoZmlyc3REZXNjcmlwdG9yLmJ1ZmZlckJ5dGVMZW5ndGggIT09IHZpZXcuYnVmZmVyLmJ5dGVMZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVGhlIGJ1ZmZlciBvZiB2aWV3IGhhcyBkaWZmZXJlbnQgY2FwYWNpdHkgdGhhbiBieW9iUmVxdWVzdCcpO1xuICB9XG4gIGlmIChmaXJzdERlc2NyaXB0b3IuYnl0ZXNGaWxsZWQgKyB2aWV3LmJ5dGVMZW5ndGggPiBmaXJzdERlc2NyaXB0b3IuYnl0ZUxlbmd0aCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdUaGUgcmVnaW9uIHNwZWNpZmllZCBieSB2aWV3IGlzIGxhcmdlciB0aGFuIGJ5b2JSZXF1ZXN0Jyk7XG4gIH1cblxuICBjb25zdCB2aWV3Qnl0ZUxlbmd0aCA9IHZpZXcuYnl0ZUxlbmd0aDtcbiAgZmlyc3REZXNjcmlwdG9yLmJ1ZmZlciA9IFRyYW5zZmVyQXJyYXlCdWZmZXIodmlldy5idWZmZXIpO1xuICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyUmVzcG9uZEludGVybmFsKGNvbnRyb2xsZXIsIHZpZXdCeXRlTGVuZ3RoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFNldFVwUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcihzdHJlYW06IFJlYWRhYmxlQnl0ZVN0cmVhbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRBbGdvcml0aG06ICgpID0+IHZvaWQgfCBQcm9taXNlTGlrZTx2b2lkPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHVsbEFsZ29yaXRobTogKCkgPT4gUHJvbWlzZTx2b2lkPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuY2VsQWxnb3JpdGhtOiAocmVhc29uOiBhbnkpID0+IFByb21pc2U8dm9pZD4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhpZ2hXYXRlck1hcms6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXV0b0FsbG9jYXRlQ2h1bmtTaXplOiBudW1iZXIgfCB1bmRlZmluZWQpIHtcbiAgYXNzZXJ0KHN0cmVhbS5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyID09PSB1bmRlZmluZWQpO1xuICBpZiAoYXV0b0FsbG9jYXRlQ2h1bmtTaXplICE9PSB1bmRlZmluZWQpIHtcbiAgICBhc3NlcnQoTnVtYmVySXNJbnRlZ2VyKGF1dG9BbGxvY2F0ZUNodW5rU2l6ZSkpO1xuICAgIGFzc2VydChhdXRvQWxsb2NhdGVDaHVua1NpemUgPiAwKTtcbiAgfVxuXG4gIGNvbnRyb2xsZXIuX2NvbnRyb2xsZWRSZWFkYWJsZUJ5dGVTdHJlYW0gPSBzdHJlYW07XG5cbiAgY29udHJvbGxlci5fcHVsbEFnYWluID0gZmFsc2U7XG4gIGNvbnRyb2xsZXIuX3B1bGxpbmcgPSBmYWxzZTtcblxuICBjb250cm9sbGVyLl9ieW9iUmVxdWVzdCA9IG51bGw7XG5cbiAgLy8gTmVlZCB0byBzZXQgdGhlIHNsb3RzIHNvIHRoYXQgdGhlIGFzc2VydCBkb2Vzbid0IGZpcmUuIEluIHRoZSBzcGVjIHRoZSBzbG90cyBhbHJlYWR5IGV4aXN0IGltcGxpY2l0bHkuXG4gIGNvbnRyb2xsZXIuX3F1ZXVlID0gY29udHJvbGxlci5fcXVldWVUb3RhbFNpemUgPSB1bmRlZmluZWQhO1xuICBSZXNldFF1ZXVlKGNvbnRyb2xsZXIpO1xuXG4gIGNvbnRyb2xsZXIuX2Nsb3NlUmVxdWVzdGVkID0gZmFsc2U7XG4gIGNvbnRyb2xsZXIuX3N0YXJ0ZWQgPSBmYWxzZTtcblxuICBjb250cm9sbGVyLl9zdHJhdGVneUhXTSA9IGhpZ2hXYXRlck1hcms7XG5cbiAgY29udHJvbGxlci5fcHVsbEFsZ29yaXRobSA9IHB1bGxBbGdvcml0aG07XG4gIGNvbnRyb2xsZXIuX2NhbmNlbEFsZ29yaXRobSA9IGNhbmNlbEFsZ29yaXRobTtcblxuICBjb250cm9sbGVyLl9hdXRvQWxsb2NhdGVDaHVua1NpemUgPSBhdXRvQWxsb2NhdGVDaHVua1NpemU7XG5cbiAgY29udHJvbGxlci5fcGVuZGluZ1B1bGxJbnRvcyA9IG5ldyBTaW1wbGVRdWV1ZSgpO1xuXG4gIHN0cmVhbS5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyID0gY29udHJvbGxlcjtcblxuICBjb25zdCBzdGFydFJlc3VsdCA9IHN0YXJ0QWxnb3JpdGhtKCk7XG4gIHVwb25Qcm9taXNlKFxuICAgIHByb21pc2VSZXNvbHZlZFdpdGgoc3RhcnRSZXN1bHQpLFxuICAgICgpID0+IHtcbiAgICAgIGNvbnRyb2xsZXIuX3N0YXJ0ZWQgPSB0cnVlO1xuXG4gICAgICBhc3NlcnQoIWNvbnRyb2xsZXIuX3B1bGxpbmcpO1xuICAgICAgYXNzZXJ0KCFjb250cm9sbGVyLl9wdWxsQWdhaW4pO1xuXG4gICAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyQ2FsbFB1bGxJZk5lZWRlZChjb250cm9sbGVyKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgciA9PiB7XG4gICAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRXJyb3IoY29udHJvbGxlciwgcik7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBTZXRVcFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJGcm9tVW5kZXJseWluZ1NvdXJjZShcbiAgc3RyZWFtOiBSZWFkYWJsZUJ5dGVTdHJlYW0sXG4gIHVuZGVybHlpbmdCeXRlU291cmNlOiBWYWxpZGF0ZWRVbmRlcmx5aW5nQnl0ZVNvdXJjZSxcbiAgaGlnaFdhdGVyTWFyazogbnVtYmVyXG4pIHtcbiAgY29uc3QgY29udHJvbGxlcjogUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlciA9IE9iamVjdC5jcmVhdGUoUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlci5wcm90b3R5cGUpO1xuXG4gIGxldCBzdGFydEFsZ29yaXRobTogKCkgPT4gdm9pZCB8IFByb21pc2VMaWtlPHZvaWQ+O1xuICBsZXQgcHVsbEFsZ29yaXRobTogKCkgPT4gUHJvbWlzZTx2b2lkPjtcbiAgbGV0IGNhbmNlbEFsZ29yaXRobTogKHJlYXNvbjogYW55KSA9PiBQcm9taXNlPHZvaWQ+O1xuXG4gIGlmICh1bmRlcmx5aW5nQnl0ZVNvdXJjZS5zdGFydCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgc3RhcnRBbGdvcml0aG0gPSAoKSA9PiB1bmRlcmx5aW5nQnl0ZVNvdXJjZS5zdGFydCEoY29udHJvbGxlcik7XG4gIH0gZWxzZSB7XG4gICAgc3RhcnRBbGdvcml0aG0gPSAoKSA9PiB1bmRlZmluZWQ7XG4gIH1cbiAgaWYgKHVuZGVybHlpbmdCeXRlU291cmNlLnB1bGwgIT09IHVuZGVmaW5lZCkge1xuICAgIHB1bGxBbGdvcml0aG0gPSAoKSA9PiB1bmRlcmx5aW5nQnl0ZVNvdXJjZS5wdWxsIShjb250cm9sbGVyKTtcbiAgfSBlbHNlIHtcbiAgICBwdWxsQWxnb3JpdGhtID0gKCkgPT4gcHJvbWlzZVJlc29sdmVkV2l0aCh1bmRlZmluZWQpO1xuICB9XG4gIGlmICh1bmRlcmx5aW5nQnl0ZVNvdXJjZS5jYW5jZWwgIT09IHVuZGVmaW5lZCkge1xuICAgIGNhbmNlbEFsZ29yaXRobSA9IHJlYXNvbiA9PiB1bmRlcmx5aW5nQnl0ZVNvdXJjZS5jYW5jZWwhKHJlYXNvbik7XG4gIH0gZWxzZSB7XG4gICAgY2FuY2VsQWxnb3JpdGhtID0gKCkgPT4gcHJvbWlzZVJlc29sdmVkV2l0aCh1bmRlZmluZWQpO1xuICB9XG5cbiAgY29uc3QgYXV0b0FsbG9jYXRlQ2h1bmtTaXplID0gdW5kZXJseWluZ0J5dGVTb3VyY2UuYXV0b0FsbG9jYXRlQ2h1bmtTaXplO1xuICBpZiAoYXV0b0FsbG9jYXRlQ2h1bmtTaXplID09PSAwKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignYXV0b0FsbG9jYXRlQ2h1bmtTaXplIG11c3QgYmUgZ3JlYXRlciB0aGFuIDAnKTtcbiAgfVxuXG4gIFNldFVwUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcihcbiAgICBzdHJlYW0sIGNvbnRyb2xsZXIsIHN0YXJ0QWxnb3JpdGhtLCBwdWxsQWxnb3JpdGhtLCBjYW5jZWxBbGdvcml0aG0sIGhpZ2hXYXRlck1hcmssIGF1dG9BbGxvY2F0ZUNodW5rU2l6ZVxuICApO1xufVxuXG5mdW5jdGlvbiBTZXRVcFJlYWRhYmxlU3RyZWFtQllPQlJlcXVlc3QocmVxdWVzdDogUmVhZGFibGVTdHJlYW1CWU9CUmVxdWVzdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXc6IE5vblNoYXJlZDxBcnJheUJ1ZmZlclZpZXc+KSB7XG4gIGFzc2VydChJc1JlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIoY29udHJvbGxlcikpO1xuICBhc3NlcnQodHlwZW9mIHZpZXcgPT09ICdvYmplY3QnKTtcbiAgYXNzZXJ0KEFycmF5QnVmZmVyLmlzVmlldyh2aWV3KSk7XG4gIGFzc2VydCghSXNEZXRhY2hlZEJ1ZmZlcih2aWV3LmJ1ZmZlcikpO1xuICByZXF1ZXN0Ll9hc3NvY2lhdGVkUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlciA9IGNvbnRyb2xsZXI7XG4gIHJlcXVlc3QuX3ZpZXcgPSB2aWV3O1xufVxuXG4vLyBIZWxwZXIgZnVuY3Rpb25zIGZvciB0aGUgUmVhZGFibGVTdHJlYW1CWU9CUmVxdWVzdC5cblxuZnVuY3Rpb24gYnlvYlJlcXVlc3RCcmFuZENoZWNrRXhjZXB0aW9uKG5hbWU6IHN0cmluZyk6IFR5cGVFcnJvciB7XG4gIHJldHVybiBuZXcgVHlwZUVycm9yKFxuICAgIGBSZWFkYWJsZVN0cmVhbUJZT0JSZXF1ZXN0LnByb3RvdHlwZS4ke25hbWV9IGNhbiBvbmx5IGJlIHVzZWQgb24gYSBSZWFkYWJsZVN0cmVhbUJZT0JSZXF1ZXN0YCk7XG59XG5cbi8vIEhlbHBlciBmdW5jdGlvbnMgZm9yIHRoZSBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyLlxuXG5mdW5jdGlvbiBieXRlU3RyZWFtQ29udHJvbGxlckJyYW5kQ2hlY2tFeGNlcHRpb24obmFtZTogc3RyaW5nKTogVHlwZUVycm9yIHtcbiAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoXG4gICAgYFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIucHJvdG90eXBlLiR7bmFtZX0gY2FuIG9ubHkgYmUgdXNlZCBvbiBhIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJgKTtcbn1cbiIsICJpbXBvcnQgeyBhc3NlcnREaWN0aW9uYXJ5LCBjb252ZXJ0VW5zaWduZWRMb25nTG9uZ1dpdGhFbmZvcmNlUmFuZ2UgfSBmcm9tICcuL2Jhc2ljJztcbmltcG9ydCB0eXBlIHtcbiAgUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyUmVhZE9wdGlvbnMsXG4gIFJlYWRhYmxlU3RyZWFtR2V0UmVhZGVyT3B0aW9ucyxcbiAgVmFsaWRhdGVkUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyUmVhZE9wdGlvbnNcbn0gZnJvbSAnLi4vcmVhZGFibGUtc3RyZWFtL3JlYWRlci1vcHRpb25zJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRSZWFkZXJPcHRpb25zKG9wdGlvbnM6IFJlYWRhYmxlU3RyZWFtR2V0UmVhZGVyT3B0aW9ucyB8IG51bGwgfCB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dDogc3RyaW5nKTogUmVhZGFibGVTdHJlYW1HZXRSZWFkZXJPcHRpb25zIHtcbiAgYXNzZXJ0RGljdGlvbmFyeShvcHRpb25zLCBjb250ZXh0KTtcbiAgY29uc3QgbW9kZSA9IG9wdGlvbnM/Lm1vZGU7XG4gIHJldHVybiB7XG4gICAgbW9kZTogbW9kZSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogY29udmVydFJlYWRhYmxlU3RyZWFtUmVhZGVyTW9kZShtb2RlLCBgJHtjb250ZXh0fSBoYXMgbWVtYmVyICdtb2RlJyB0aGF0YClcbiAgfTtcbn1cblxuZnVuY3Rpb24gY29udmVydFJlYWRhYmxlU3RyZWFtUmVhZGVyTW9kZShtb2RlOiBzdHJpbmcsIGNvbnRleHQ6IHN0cmluZyk6ICdieW9iJyB7XG4gIG1vZGUgPSBgJHttb2RlfWA7XG4gIGlmIChtb2RlICE9PSAnYnlvYicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGAke2NvbnRleHR9ICcke21vZGV9JyBpcyBub3QgYSB2YWxpZCBlbnVtZXJhdGlvbiB2YWx1ZSBmb3IgUmVhZGFibGVTdHJlYW1SZWFkZXJNb2RlYCk7XG4gIH1cbiAgcmV0dXJuIG1vZGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0QnlvYlJlYWRPcHRpb25zKFxuICBvcHRpb25zOiBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXJSZWFkT3B0aW9ucyB8IG51bGwgfCB1bmRlZmluZWQsXG4gIGNvbnRleHQ6IHN0cmluZ1xuKTogVmFsaWRhdGVkUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyUmVhZE9wdGlvbnMge1xuICBhc3NlcnREaWN0aW9uYXJ5KG9wdGlvbnMsIGNvbnRleHQpO1xuICBjb25zdCBtaW4gPSBvcHRpb25zPy5taW4gPz8gMTtcbiAgcmV0dXJuIHtcbiAgICBtaW46IGNvbnZlcnRVbnNpZ25lZExvbmdMb25nV2l0aEVuZm9yY2VSYW5nZShcbiAgICAgIG1pbixcbiAgICAgIGAke2NvbnRleHR9IGhhcyBtZW1iZXIgJ21pbicgdGhhdGBcbiAgICApXG4gIH07XG59XG4iLCAiaW1wb3J0IGFzc2VydCBmcm9tICcuLi8uLi9zdHViL2Fzc2VydCc7XG5pbXBvcnQgeyBTaW1wbGVRdWV1ZSB9IGZyb20gJy4uL3NpbXBsZS1xdWV1ZSc7XG5pbXBvcnQge1xuICBSZWFkYWJsZVN0cmVhbVJlYWRlckdlbmVyaWNDYW5jZWwsXG4gIFJlYWRhYmxlU3RyZWFtUmVhZGVyR2VuZXJpY0luaXRpYWxpemUsXG4gIFJlYWRhYmxlU3RyZWFtUmVhZGVyR2VuZXJpY1JlbGVhc2UsXG4gIHJlYWRlckxvY2tFeGNlcHRpb25cbn0gZnJvbSAnLi9nZW5lcmljLXJlYWRlcic7XG5pbXBvcnQgeyBJc1JlYWRhYmxlU3RyZWFtTG9ja2VkLCB0eXBlIFJlYWRhYmxlQnl0ZVN0cmVhbSwgdHlwZSBSZWFkYWJsZVN0cmVhbSB9IGZyb20gJy4uL3JlYWRhYmxlLXN0cmVhbSc7XG5pbXBvcnQge1xuICBJc1JlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIsXG4gIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIsXG4gIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJQdWxsSW50b1xufSBmcm9tICcuL2J5dGUtc3RyZWFtLWNvbnRyb2xsZXInO1xuaW1wb3J0IHsgc2V0RnVuY3Rpb25OYW1lLCB0eXBlSXNPYmplY3QgfSBmcm9tICcuLi9oZWxwZXJzL21pc2NlbGxhbmVvdXMnO1xuaW1wb3J0IHsgbmV3UHJvbWlzZSwgcHJvbWlzZVJlamVjdGVkV2l0aCB9IGZyb20gJy4uL2hlbHBlcnMvd2ViaWRsJztcbmltcG9ydCB7IGFzc2VydFJlcXVpcmVkQXJndW1lbnQgfSBmcm9tICcuLi92YWxpZGF0b3JzL2Jhc2ljJztcbmltcG9ydCB7IGFzc2VydFJlYWRhYmxlU3RyZWFtIH0gZnJvbSAnLi4vdmFsaWRhdG9ycy9yZWFkYWJsZS1zdHJlYW0nO1xuaW1wb3J0IHsgSXNEZXRhY2hlZEJ1ZmZlciB9IGZyb20gJy4uL2Fic3RyYWN0LW9wcy9lY21hc2NyaXB0JztcbmltcG9ydCB0eXBlIHtcbiAgUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyUmVhZE9wdGlvbnMsXG4gIFZhbGlkYXRlZFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlclJlYWRPcHRpb25zXG59IGZyb20gJy4vcmVhZGVyLW9wdGlvbnMnO1xuaW1wb3J0IHsgY29udmVydEJ5b2JSZWFkT3B0aW9ucyB9IGZyb20gJy4uL3ZhbGlkYXRvcnMvcmVhZGVyLW9wdGlvbnMnO1xuaW1wb3J0IHsgaXNEYXRhVmlldywgdHlwZSBOb25TaGFyZWQsIHR5cGUgVHlwZWRBcnJheSB9IGZyb20gJy4uL2hlbHBlcnMvYXJyYXktYnVmZmVyLXZpZXcnO1xuXG4vKipcbiAqIEEgcmVzdWx0IHJldHVybmVkIGJ5IHtAbGluayBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIucmVhZH0uXG4gKlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgdHlwZSBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkUmVzdWx0PFQgZXh0ZW5kcyBBcnJheUJ1ZmZlclZpZXc+ID0ge1xuICBkb25lOiBmYWxzZTtcbiAgdmFsdWU6IFQ7XG59IHwge1xuICBkb25lOiB0cnVlO1xuICB2YWx1ZTogVCB8IHVuZGVmaW5lZDtcbn07XG5cbi8vIEFic3RyYWN0IG9wZXJhdGlvbnMgZm9yIHRoZSBSZWFkYWJsZVN0cmVhbS5cblxuZXhwb3J0IGZ1bmN0aW9uIEFjcXVpcmVSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIoc3RyZWFtOiBSZWFkYWJsZUJ5dGVTdHJlYW0pOiBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIge1xuICByZXR1cm4gbmV3IFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlcihzdHJlYW0gYXMgUmVhZGFibGVTdHJlYW08VWludDhBcnJheT4pO1xufVxuXG4vLyBSZWFkYWJsZVN0cmVhbSBBUEkgZXhwb3NlZCBmb3IgY29udHJvbGxlcnMuXG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZVN0cmVhbUFkZFJlYWRJbnRvUmVxdWVzdDxUIGV4dGVuZHMgTm9uU2hhcmVkPEFycmF5QnVmZmVyVmlldz4+KFxuICBzdHJlYW06IFJlYWRhYmxlQnl0ZVN0cmVhbSxcbiAgcmVhZEludG9SZXF1ZXN0OiBSZWFkSW50b1JlcXVlc3Q8VD5cbik6IHZvaWQge1xuICBhc3NlcnQoSXNSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIoc3RyZWFtLl9yZWFkZXIpKTtcbiAgYXNzZXJ0KHN0cmVhbS5fc3RhdGUgPT09ICdyZWFkYWJsZScgfHwgc3RyZWFtLl9zdGF0ZSA9PT0gJ2Nsb3NlZCcpO1xuXG4gIChzdHJlYW0uX3JlYWRlciEgYXMgUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyKS5fcmVhZEludG9SZXF1ZXN0cy5wdXNoKHJlYWRJbnRvUmVxdWVzdCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZVN0cmVhbUZ1bGZpbGxSZWFkSW50b1JlcXVlc3Qoc3RyZWFtOiBSZWFkYWJsZUJ5dGVTdHJlYW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNodW5rOiBBcnJheUJ1ZmZlclZpZXcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvbmU6IGJvb2xlYW4pIHtcbiAgY29uc3QgcmVhZGVyID0gc3RyZWFtLl9yZWFkZXIgYXMgUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyO1xuXG4gIGFzc2VydChyZWFkZXIuX3JlYWRJbnRvUmVxdWVzdHMubGVuZ3RoID4gMCk7XG5cbiAgY29uc3QgcmVhZEludG9SZXF1ZXN0ID0gcmVhZGVyLl9yZWFkSW50b1JlcXVlc3RzLnNoaWZ0KCkhO1xuICBpZiAoZG9uZSkge1xuICAgIHJlYWRJbnRvUmVxdWVzdC5fY2xvc2VTdGVwcyhjaHVuayk7XG4gIH0gZWxzZSB7XG4gICAgcmVhZEludG9SZXF1ZXN0Ll9jaHVua1N0ZXBzKGNodW5rKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1HZXROdW1SZWFkSW50b1JlcXVlc3RzKHN0cmVhbTogUmVhZGFibGVCeXRlU3RyZWFtKTogbnVtYmVyIHtcbiAgcmV0dXJuIChzdHJlYW0uX3JlYWRlciBhcyBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIpLl9yZWFkSW50b1JlcXVlc3RzLmxlbmd0aDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtSGFzQllPQlJlYWRlcihzdHJlYW06IFJlYWRhYmxlQnl0ZVN0cmVhbSk6IGJvb2xlYW4ge1xuICBjb25zdCByZWFkZXIgPSBzdHJlYW0uX3JlYWRlcjtcblxuICBpZiAocmVhZGVyID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoIUlzUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyKHJlYWRlcikpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLy8gUmVhZGVyc1xuXG5leHBvcnQgaW50ZXJmYWNlIFJlYWRJbnRvUmVxdWVzdDxUIGV4dGVuZHMgTm9uU2hhcmVkPEFycmF5QnVmZmVyVmlldz4+IHtcbiAgX2NodW5rU3RlcHMoY2h1bms6IFQpOiB2b2lkO1xuXG4gIF9jbG9zZVN0ZXBzKGNodW5rOiBUIHwgdW5kZWZpbmVkKTogdm9pZDtcblxuICBfZXJyb3JTdGVwcyhlOiBhbnkpOiB2b2lkO1xufVxuXG4vKipcbiAqIEEgQllPQiByZWFkZXIgdmVuZGVkIGJ5IGEge0BsaW5rIFJlYWRhYmxlU3RyZWFtfS5cbiAqXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjbGFzcyBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIge1xuICAvKiogQGludGVybmFsICovXG4gIF9vd25lclJlYWRhYmxlU3RyZWFtITogUmVhZGFibGVCeXRlU3RyZWFtO1xuICAvKiogQGludGVybmFsICovXG4gIF9jbG9zZWRQcm9taXNlITogUHJvbWlzZTx1bmRlZmluZWQ+O1xuICAvKiogQGludGVybmFsICovXG4gIF9jbG9zZWRQcm9taXNlX3Jlc29sdmU/OiAodmFsdWU/OiB1bmRlZmluZWQpID0+IHZvaWQ7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2Nsb3NlZFByb21pc2VfcmVqZWN0PzogKHJlYXNvbjogYW55KSA9PiB2b2lkO1xuICAvKiogQGludGVybmFsICovXG4gIF9yZWFkSW50b1JlcXVlc3RzOiBTaW1wbGVRdWV1ZTxSZWFkSW50b1JlcXVlc3Q8YW55Pj47XG5cbiAgY29uc3RydWN0b3Ioc3RyZWFtOiBSZWFkYWJsZVN0cmVhbTxVaW50OEFycmF5Pikge1xuICAgIGFzc2VydFJlcXVpcmVkQXJndW1lbnQoc3RyZWFtLCAxLCAnUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyJyk7XG4gICAgYXNzZXJ0UmVhZGFibGVTdHJlYW0oc3RyZWFtLCAnRmlyc3QgcGFyYW1ldGVyJyk7XG5cbiAgICBpZiAoSXNSZWFkYWJsZVN0cmVhbUxvY2tlZChzdHJlYW0pKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGlzIHN0cmVhbSBoYXMgYWxyZWFkeSBiZWVuIGxvY2tlZCBmb3IgZXhjbHVzaXZlIHJlYWRpbmcgYnkgYW5vdGhlciByZWFkZXInKTtcbiAgICB9XG5cbiAgICBpZiAoIUlzUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcihzdHJlYW0uX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlcikpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjb25zdHJ1Y3QgYSBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIgZm9yIGEgc3RyZWFtIG5vdCBjb25zdHJ1Y3RlZCB3aXRoIGEgYnl0ZSAnICtcbiAgICAgICAgJ3NvdXJjZScpO1xuICAgIH1cblxuICAgIFJlYWRhYmxlU3RyZWFtUmVhZGVyR2VuZXJpY0luaXRpYWxpemUodGhpcywgc3RyZWFtKTtcblxuICAgIHRoaXMuX3JlYWRJbnRvUmVxdWVzdHMgPSBuZXcgU2ltcGxlUXVldWUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHdpbGwgYmUgZnVsZmlsbGVkIHdoZW4gdGhlIHN0cmVhbSBiZWNvbWVzIGNsb3NlZCwgb3IgcmVqZWN0ZWQgaWYgdGhlIHN0cmVhbSBldmVyIGVycm9ycyBvclxuICAgKiB0aGUgcmVhZGVyJ3MgbG9jayBpcyByZWxlYXNlZCBiZWZvcmUgdGhlIHN0cmVhbSBmaW5pc2hlcyBjbG9zaW5nLlxuICAgKi9cbiAgZ2V0IGNsb3NlZCgpOiBQcm9taXNlPHVuZGVmaW5lZD4ge1xuICAgIGlmICghSXNSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIodGhpcykpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKGJ5b2JSZWFkZXJCcmFuZENoZWNrRXhjZXB0aW9uKCdjbG9zZWQnKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2Nsb3NlZFByb21pc2U7XG4gIH1cblxuICAvKipcbiAgICogSWYgdGhlIHJlYWRlciBpcyBhY3RpdmUsIGJlaGF2ZXMgdGhlIHNhbWUgYXMge0BsaW5rIFJlYWRhYmxlU3RyZWFtLmNhbmNlbCB8IHN0cmVhbS5jYW5jZWwocmVhc29uKX0uXG4gICAqL1xuICBjYW5jZWwocmVhc29uOiBhbnkgPSB1bmRlZmluZWQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIUlzUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyKHRoaXMpKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChieW9iUmVhZGVyQnJhbmRDaGVja0V4Y2VwdGlvbignY2FuY2VsJykpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9vd25lclJlYWRhYmxlU3RyZWFtID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKHJlYWRlckxvY2tFeGNlcHRpb24oJ2NhbmNlbCcpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gUmVhZGFibGVTdHJlYW1SZWFkZXJHZW5lcmljQ2FuY2VsKHRoaXMsIHJlYXNvbik7XG4gIH1cblxuICAvKipcbiAgICogQXR0ZW1wdHMgdG8gcmVhZHMgYnl0ZXMgaW50byB2aWV3LCBhbmQgcmV0dXJucyBhIHByb21pc2UgcmVzb2x2ZWQgd2l0aCB0aGUgcmVzdWx0LlxuICAgKlxuICAgKiBJZiByZWFkaW5nIGEgY2h1bmsgY2F1c2VzIHRoZSBxdWV1ZSB0byBiZWNvbWUgZW1wdHksIG1vcmUgZGF0YSB3aWxsIGJlIHB1bGxlZCBmcm9tIHRoZSB1bmRlcmx5aW5nIHNvdXJjZS5cbiAgICovXG4gIHJlYWQ8VCBleHRlbmRzIEFycmF5QnVmZmVyVmlldz4oXG4gICAgdmlldzogVCxcbiAgICBvcHRpb25zPzogUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyUmVhZE9wdGlvbnNcbiAgKTogUHJvbWlzZTxSZWFkYWJsZVN0cmVhbUJZT0JSZWFkUmVzdWx0PFQ+PjtcbiAgcmVhZDxUIGV4dGVuZHMgTm9uU2hhcmVkPEFycmF5QnVmZmVyVmlldz4+KFxuICAgIHZpZXc6IFQsXG4gICAgcmF3T3B0aW9uczogUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyUmVhZE9wdGlvbnMgfCBudWxsIHwgdW5kZWZpbmVkID0ge31cbiAgKTogUHJvbWlzZTxSZWFkYWJsZVN0cmVhbUJZT0JSZWFkUmVzdWx0PFQ+PiB7XG4gICAgaWYgKCFJc1JlYWRhYmxlU3RyZWFtQllPQlJlYWRlcih0aGlzKSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoYnlvYlJlYWRlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ3JlYWQnKSk7XG4gICAgfVxuXG4gICAgaWYgKCFBcnJheUJ1ZmZlci5pc1ZpZXcodmlldykpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKG5ldyBUeXBlRXJyb3IoJ3ZpZXcgbXVzdCBiZSBhbiBhcnJheSBidWZmZXIgdmlldycpKTtcbiAgICB9XG4gICAgaWYgKHZpZXcuYnl0ZUxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgobmV3IFR5cGVFcnJvcigndmlldyBtdXN0IGhhdmUgbm9uLXplcm8gYnl0ZUxlbmd0aCcpKTtcbiAgICB9XG4gICAgaWYgKHZpZXcuYnVmZmVyLmJ5dGVMZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKG5ldyBUeXBlRXJyb3IoYHZpZXcncyBidWZmZXIgbXVzdCBoYXZlIG5vbi16ZXJvIGJ5dGVMZW5ndGhgKSk7XG4gICAgfVxuICAgIGlmIChJc0RldGFjaGVkQnVmZmVyKHZpZXcuYnVmZmVyKSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgobmV3IFR5cGVFcnJvcigndmlld1xcJ3MgYnVmZmVyIGhhcyBiZWVuIGRldGFjaGVkJykpO1xuICAgIH1cblxuICAgIGxldCBvcHRpb25zOiBWYWxpZGF0ZWRSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXJSZWFkT3B0aW9ucztcbiAgICB0cnkge1xuICAgICAgb3B0aW9ucyA9IGNvbnZlcnRCeW9iUmVhZE9wdGlvbnMocmF3T3B0aW9ucywgJ29wdGlvbnMnKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChlKTtcbiAgICB9XG4gICAgY29uc3QgbWluID0gb3B0aW9ucy5taW47XG4gICAgaWYgKG1pbiA9PT0gMCkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgobmV3IFR5cGVFcnJvcignb3B0aW9ucy5taW4gbXVzdCBiZSBncmVhdGVyIHRoYW4gMCcpKTtcbiAgICB9XG4gICAgaWYgKCFpc0RhdGFWaWV3KHZpZXcpKSB7XG4gICAgICBpZiAobWluID4gKHZpZXcgYXMgdW5rbm93biBhcyBUeXBlZEFycmF5KS5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgobmV3IFJhbmdlRXJyb3IoJ29wdGlvbnMubWluIG11c3QgYmUgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIHZpZXdcXCdzIGxlbmd0aCcpKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG1pbiA+IHZpZXcuYnl0ZUxlbmd0aCkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgobmV3IFJhbmdlRXJyb3IoJ29wdGlvbnMubWluIG11c3QgYmUgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIHZpZXdcXCdzIGJ5dGVMZW5ndGgnKSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX293bmVyUmVhZGFibGVTdHJlYW0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgocmVhZGVyTG9ja0V4Y2VwdGlvbigncmVhZCBmcm9tJykpO1xuICAgIH1cblxuICAgIGxldCByZXNvbHZlUHJvbWlzZSE6IChyZXN1bHQ6IFJlYWRhYmxlU3RyZWFtQllPQlJlYWRSZXN1bHQ8VD4pID0+IHZvaWQ7XG4gICAgbGV0IHJlamVjdFByb21pc2UhOiAocmVhc29uOiBhbnkpID0+IHZvaWQ7XG4gICAgY29uc3QgcHJvbWlzZSA9IG5ld1Byb21pc2U8UmVhZGFibGVTdHJlYW1CWU9CUmVhZFJlc3VsdDxUPj4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgcmVzb2x2ZVByb21pc2UgPSByZXNvbHZlO1xuICAgICAgcmVqZWN0UHJvbWlzZSA9IHJlamVjdDtcbiAgICB9KTtcbiAgICBjb25zdCByZWFkSW50b1JlcXVlc3Q6IFJlYWRJbnRvUmVxdWVzdDxUPiA9IHtcbiAgICAgIF9jaHVua1N0ZXBzOiBjaHVuayA9PiByZXNvbHZlUHJvbWlzZSh7IHZhbHVlOiBjaHVuaywgZG9uZTogZmFsc2UgfSksXG4gICAgICBfY2xvc2VTdGVwczogY2h1bmsgPT4gcmVzb2x2ZVByb21pc2UoeyB2YWx1ZTogY2h1bmssIGRvbmU6IHRydWUgfSksXG4gICAgICBfZXJyb3JTdGVwczogZSA9PiByZWplY3RQcm9taXNlKGUpXG4gICAgfTtcbiAgICBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXJSZWFkKHRoaXMsIHZpZXcsIG1pbiwgcmVhZEludG9SZXF1ZXN0KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWxlYXNlcyB0aGUgcmVhZGVyJ3MgbG9jayBvbiB0aGUgY29ycmVzcG9uZGluZyBzdHJlYW0uIEFmdGVyIHRoZSBsb2NrIGlzIHJlbGVhc2VkLCB0aGUgcmVhZGVyIGlzIG5vIGxvbmdlciBhY3RpdmUuXG4gICAqIElmIHRoZSBhc3NvY2lhdGVkIHN0cmVhbSBpcyBlcnJvcmVkIHdoZW4gdGhlIGxvY2sgaXMgcmVsZWFzZWQsIHRoZSByZWFkZXIgd2lsbCBhcHBlYXIgZXJyb3JlZCBpbiB0aGUgc2FtZSB3YXlcbiAgICogZnJvbSBub3cgb247IG90aGVyd2lzZSwgdGhlIHJlYWRlciB3aWxsIGFwcGVhciBjbG9zZWQuXG4gICAqXG4gICAqIEEgcmVhZGVyJ3MgbG9jayBjYW5ub3QgYmUgcmVsZWFzZWQgd2hpbGUgaXQgc3RpbGwgaGFzIGEgcGVuZGluZyByZWFkIHJlcXVlc3QsIGkuZS4sIGlmIGEgcHJvbWlzZSByZXR1cm5lZCBieVxuICAgKiB0aGUgcmVhZGVyJ3Mge0BsaW5rIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlci5yZWFkIHwgcmVhZCgpfSBtZXRob2QgaGFzIG5vdCB5ZXQgYmVlbiBzZXR0bGVkLiBBdHRlbXB0aW5nIHRvXG4gICAqIGRvIHNvIHdpbGwgdGhyb3cgYSBgVHlwZUVycm9yYCBhbmQgbGVhdmUgdGhlIHJlYWRlciBsb2NrZWQgdG8gdGhlIHN0cmVhbS5cbiAgICovXG4gIHJlbGVhc2VMb2NrKCk6IHZvaWQge1xuICAgIGlmICghSXNSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIodGhpcykpIHtcbiAgICAgIHRocm93IGJ5b2JSZWFkZXJCcmFuZENoZWNrRXhjZXB0aW9uKCdyZWxlYXNlTG9jaycpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9vd25lclJlYWRhYmxlU3RyZWFtID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXJSZWxlYXNlKHRoaXMpO1xuICB9XG59XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlci5wcm90b3R5cGUsIHtcbiAgY2FuY2VsOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgcmVhZDogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIHJlbGVhc2VMb2NrOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgY2xvc2VkOiB7IGVudW1lcmFibGU6IHRydWUgfVxufSk7XG5zZXRGdW5jdGlvbk5hbWUoUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyLnByb3RvdHlwZS5jYW5jZWwsICdjYW5jZWwnKTtcbnNldEZ1bmN0aW9uTmFtZShSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIucHJvdG90eXBlLnJlYWQsICdyZWFkJyk7XG5zZXRGdW5jdGlvbk5hbWUoUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyLnByb3RvdHlwZS5yZWxlYXNlTG9jaywgJ3JlbGVhc2VMb2NrJyk7XG5pZiAodHlwZW9mIFN5bWJvbC50b1N0cmluZ1RhZyA9PT0gJ3N5bWJvbCcpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlci5wcm90b3R5cGUsIFN5bWJvbC50b1N0cmluZ1RhZywge1xuICAgIHZhbHVlOiAnUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyJyxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG59XG5cbi8vIEFic3RyYWN0IG9wZXJhdGlvbnMgZm9yIHRoZSByZWFkZXJzLlxuXG5leHBvcnQgZnVuY3Rpb24gSXNSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIoeDogYW55KTogeCBpcyBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIge1xuICBpZiAoIXR5cGVJc09iamVjdCh4KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHgsICdfcmVhZEludG9SZXF1ZXN0cycpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHggaW5zdGFuY2VvZiBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXJSZWFkPFQgZXh0ZW5kcyBOb25TaGFyZWQ8QXJyYXlCdWZmZXJWaWV3Pj4oXG4gIHJlYWRlcjogUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyLFxuICB2aWV3OiBULFxuICBtaW46IG51bWJlcixcbiAgcmVhZEludG9SZXF1ZXN0OiBSZWFkSW50b1JlcXVlc3Q8VD5cbik6IHZvaWQge1xuICBjb25zdCBzdHJlYW0gPSByZWFkZXIuX293bmVyUmVhZGFibGVTdHJlYW07XG5cbiAgYXNzZXJ0KHN0cmVhbSAhPT0gdW5kZWZpbmVkKTtcblxuICBzdHJlYW0uX2Rpc3R1cmJlZCA9IHRydWU7XG5cbiAgaWYgKHN0cmVhbS5fc3RhdGUgPT09ICdlcnJvcmVkJykge1xuICAgIHJlYWRJbnRvUmVxdWVzdC5fZXJyb3JTdGVwcyhzdHJlYW0uX3N0b3JlZEVycm9yKTtcbiAgfSBlbHNlIHtcbiAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyUHVsbEludG8oXG4gICAgICBzdHJlYW0uX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlciBhcyBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyLFxuICAgICAgdmlldyxcbiAgICAgIG1pbixcbiAgICAgIHJlYWRJbnRvUmVxdWVzdFxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlclJlbGVhc2UocmVhZGVyOiBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIpIHtcbiAgUmVhZGFibGVTdHJlYW1SZWFkZXJHZW5lcmljUmVsZWFzZShyZWFkZXIpO1xuICBjb25zdCBlID0gbmV3IFR5cGVFcnJvcignUmVhZGVyIHdhcyByZWxlYXNlZCcpO1xuICBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXJFcnJvclJlYWRJbnRvUmVxdWVzdHMocmVhZGVyLCBlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlckVycm9yUmVhZEludG9SZXF1ZXN0cyhyZWFkZXI6IFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlciwgZTogYW55KSB7XG4gIGNvbnN0IHJlYWRJbnRvUmVxdWVzdHMgPSByZWFkZXIuX3JlYWRJbnRvUmVxdWVzdHM7XG4gIHJlYWRlci5fcmVhZEludG9SZXF1ZXN0cyA9IG5ldyBTaW1wbGVRdWV1ZSgpO1xuICByZWFkSW50b1JlcXVlc3RzLmZvckVhY2gocmVhZEludG9SZXF1ZXN0ID0+IHtcbiAgICByZWFkSW50b1JlcXVlc3QuX2Vycm9yU3RlcHMoZSk7XG4gIH0pO1xufVxuXG4vLyBIZWxwZXIgZnVuY3Rpb25zIGZvciB0aGUgUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyLlxuXG5mdW5jdGlvbiBieW9iUmVhZGVyQnJhbmRDaGVja0V4Y2VwdGlvbihuYW1lOiBzdHJpbmcpOiBUeXBlRXJyb3Ige1xuICByZXR1cm4gbmV3IFR5cGVFcnJvcihcbiAgICBgUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyLnByb3RvdHlwZS4ke25hbWV9IGNhbiBvbmx5IGJlIHVzZWQgb24gYSBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXJgKTtcbn1cbiIsICJpbXBvcnQgdHlwZSB7IFF1ZXVpbmdTdHJhdGVneSwgUXVldWluZ1N0cmF0ZWd5U2l6ZUNhbGxiYWNrIH0gZnJvbSAnLi4vcXVldWluZy1zdHJhdGVneSc7XG5pbXBvcnQgTnVtYmVySXNOYU4gZnJvbSAnLi4vLi4vc3R1Yi9udW1iZXItaXNuYW4nO1xuXG5leHBvcnQgZnVuY3Rpb24gRXh0cmFjdEhpZ2hXYXRlck1hcmsoc3RyYXRlZ3k6IFF1ZXVpbmdTdHJhdGVneSwgZGVmYXVsdEhXTTogbnVtYmVyKTogbnVtYmVyIHtcbiAgY29uc3QgeyBoaWdoV2F0ZXJNYXJrIH0gPSBzdHJhdGVneTtcblxuICBpZiAoaGlnaFdhdGVyTWFyayA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRIV007XG4gIH1cblxuICBpZiAoTnVtYmVySXNOYU4oaGlnaFdhdGVyTWFyaykgfHwgaGlnaFdhdGVyTWFyayA8IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW52YWxpZCBoaWdoV2F0ZXJNYXJrJyk7XG4gIH1cblxuICByZXR1cm4gaGlnaFdhdGVyTWFyaztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEV4dHJhY3RTaXplQWxnb3JpdGhtPFQ+KHN0cmF0ZWd5OiBRdWV1aW5nU3RyYXRlZ3k8VD4pOiBRdWV1aW5nU3RyYXRlZ3lTaXplQ2FsbGJhY2s8VD4ge1xuICBjb25zdCB7IHNpemUgfSA9IHN0cmF0ZWd5O1xuXG4gIGlmICghc2l6ZSkge1xuICAgIHJldHVybiAoKSA9PiAxO1xuICB9XG5cbiAgcmV0dXJuIHNpemU7XG59XG4iLCAiaW1wb3J0IHR5cGUgeyBRdWV1aW5nU3RyYXRlZ3ksIFF1ZXVpbmdTdHJhdGVneVNpemVDYWxsYmFjayB9IGZyb20gJy4uL3F1ZXVpbmctc3RyYXRlZ3knO1xuaW1wb3J0IHsgYXNzZXJ0RGljdGlvbmFyeSwgYXNzZXJ0RnVuY3Rpb24sIGNvbnZlcnRVbnJlc3RyaWN0ZWREb3VibGUgfSBmcm9tICcuL2Jhc2ljJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRRdWV1aW5nU3RyYXRlZ3k8VD4oaW5pdDogUXVldWluZ1N0cmF0ZWd5PFQ+IHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6IHN0cmluZyk6IFF1ZXVpbmdTdHJhdGVneTxUPiB7XG4gIGFzc2VydERpY3Rpb25hcnkoaW5pdCwgY29udGV4dCk7XG4gIGNvbnN0IGhpZ2hXYXRlck1hcmsgPSBpbml0Py5oaWdoV2F0ZXJNYXJrO1xuICBjb25zdCBzaXplID0gaW5pdD8uc2l6ZTtcbiAgcmV0dXJuIHtcbiAgICBoaWdoV2F0ZXJNYXJrOiBoaWdoV2F0ZXJNYXJrID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWQgOiBjb252ZXJ0VW5yZXN0cmljdGVkRG91YmxlKGhpZ2hXYXRlck1hcmspLFxuICAgIHNpemU6IHNpemUgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZCA6IGNvbnZlcnRRdWV1aW5nU3RyYXRlZ3lTaXplKHNpemUsIGAke2NvbnRleHR9IGhhcyBtZW1iZXIgJ3NpemUnIHRoYXRgKVxuICB9O1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0UXVldWluZ1N0cmF0ZWd5U2l6ZTxUPihmbjogUXVldWluZ1N0cmF0ZWd5U2l6ZUNhbGxiYWNrPFQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dDogc3RyaW5nKTogUXVldWluZ1N0cmF0ZWd5U2l6ZUNhbGxiYWNrPFQ+IHtcbiAgYXNzZXJ0RnVuY3Rpb24oZm4sIGNvbnRleHQpO1xuICByZXR1cm4gY2h1bmsgPT4gY29udmVydFVucmVzdHJpY3RlZERvdWJsZShmbihjaHVuaykpO1xufVxuIiwgImltcG9ydCB7IGFzc2VydERpY3Rpb25hcnksIGFzc2VydEZ1bmN0aW9uIH0gZnJvbSAnLi9iYXNpYyc7XG5pbXBvcnQgeyBwcm9taXNlQ2FsbCwgcmVmbGVjdENhbGwgfSBmcm9tICcuLi9oZWxwZXJzL3dlYmlkbCc7XG5pbXBvcnQgdHlwZSB7XG4gIFVuZGVybHlpbmdTaW5rLFxuICBVbmRlcmx5aW5nU2lua0Fib3J0Q2FsbGJhY2ssXG4gIFVuZGVybHlpbmdTaW5rQ2xvc2VDYWxsYmFjayxcbiAgVW5kZXJseWluZ1NpbmtTdGFydENhbGxiYWNrLFxuICBVbmRlcmx5aW5nU2lua1dyaXRlQ2FsbGJhY2ssXG4gIFZhbGlkYXRlZFVuZGVybHlpbmdTaW5rXG59IGZyb20gJy4uL3dyaXRhYmxlLXN0cmVhbS91bmRlcmx5aW5nLXNpbmsnO1xuaW1wb3J0IHsgV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlciB9IGZyb20gJy4uL3dyaXRhYmxlLXN0cmVhbSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0VW5kZXJseWluZ1Npbms8Vz4ob3JpZ2luYWw6IFVuZGVybHlpbmdTaW5rPFc+IHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dDogc3RyaW5nKTogVmFsaWRhdGVkVW5kZXJseWluZ1Npbms8Vz4ge1xuICBhc3NlcnREaWN0aW9uYXJ5KG9yaWdpbmFsLCBjb250ZXh0KTtcbiAgY29uc3QgYWJvcnQgPSBvcmlnaW5hbD8uYWJvcnQ7XG4gIGNvbnN0IGNsb3NlID0gb3JpZ2luYWw/LmNsb3NlO1xuICBjb25zdCBzdGFydCA9IG9yaWdpbmFsPy5zdGFydDtcbiAgY29uc3QgdHlwZSA9IG9yaWdpbmFsPy50eXBlO1xuICBjb25zdCB3cml0ZSA9IG9yaWdpbmFsPy53cml0ZTtcbiAgcmV0dXJuIHtcbiAgICBhYm9ydDogYWJvcnQgPT09IHVuZGVmaW5lZCA/XG4gICAgICB1bmRlZmluZWQgOlxuICAgICAgY29udmVydFVuZGVybHlpbmdTaW5rQWJvcnRDYWxsYmFjayhhYm9ydCwgb3JpZ2luYWwhLCBgJHtjb250ZXh0fSBoYXMgbWVtYmVyICdhYm9ydCcgdGhhdGApLFxuICAgIGNsb3NlOiBjbG9zZSA9PT0gdW5kZWZpbmVkID9cbiAgICAgIHVuZGVmaW5lZCA6XG4gICAgICBjb252ZXJ0VW5kZXJseWluZ1NpbmtDbG9zZUNhbGxiYWNrKGNsb3NlLCBvcmlnaW5hbCEsIGAke2NvbnRleHR9IGhhcyBtZW1iZXIgJ2Nsb3NlJyB0aGF0YCksXG4gICAgc3RhcnQ6IHN0YXJ0ID09PSB1bmRlZmluZWQgP1xuICAgICAgdW5kZWZpbmVkIDpcbiAgICAgIGNvbnZlcnRVbmRlcmx5aW5nU2lua1N0YXJ0Q2FsbGJhY2soc3RhcnQsIG9yaWdpbmFsISwgYCR7Y29udGV4dH0gaGFzIG1lbWJlciAnc3RhcnQnIHRoYXRgKSxcbiAgICB3cml0ZTogd3JpdGUgPT09IHVuZGVmaW5lZCA/XG4gICAgICB1bmRlZmluZWQgOlxuICAgICAgY29udmVydFVuZGVybHlpbmdTaW5rV3JpdGVDYWxsYmFjayh3cml0ZSwgb3JpZ2luYWwhLCBgJHtjb250ZXh0fSBoYXMgbWVtYmVyICd3cml0ZScgdGhhdGApLFxuICAgIHR5cGVcbiAgfTtcbn1cblxuZnVuY3Rpb24gY29udmVydFVuZGVybHlpbmdTaW5rQWJvcnRDYWxsYmFjayhcbiAgZm46IFVuZGVybHlpbmdTaW5rQWJvcnRDYWxsYmFjayxcbiAgb3JpZ2luYWw6IFVuZGVybHlpbmdTaW5rLFxuICBjb250ZXh0OiBzdHJpbmdcbik6IChyZWFzb246IGFueSkgPT4gUHJvbWlzZTx2b2lkPiB7XG4gIGFzc2VydEZ1bmN0aW9uKGZuLCBjb250ZXh0KTtcbiAgcmV0dXJuIChyZWFzb246IGFueSkgPT4gcHJvbWlzZUNhbGwoZm4sIG9yaWdpbmFsLCBbcmVhc29uXSk7XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRVbmRlcmx5aW5nU2lua0Nsb3NlQ2FsbGJhY2soXG4gIGZuOiBVbmRlcmx5aW5nU2lua0Nsb3NlQ2FsbGJhY2ssXG4gIG9yaWdpbmFsOiBVbmRlcmx5aW5nU2luayxcbiAgY29udGV4dDogc3RyaW5nXG4pOiAoKSA9PiBQcm9taXNlPHZvaWQ+IHtcbiAgYXNzZXJ0RnVuY3Rpb24oZm4sIGNvbnRleHQpO1xuICByZXR1cm4gKCkgPT4gcHJvbWlzZUNhbGwoZm4sIG9yaWdpbmFsLCBbXSk7XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRVbmRlcmx5aW5nU2lua1N0YXJ0Q2FsbGJhY2soXG4gIGZuOiBVbmRlcmx5aW5nU2lua1N0YXJ0Q2FsbGJhY2ssXG4gIG9yaWdpbmFsOiBVbmRlcmx5aW5nU2luayxcbiAgY29udGV4dDogc3RyaW5nXG4pOiBVbmRlcmx5aW5nU2lua1N0YXJ0Q2FsbGJhY2sge1xuICBhc3NlcnRGdW5jdGlvbihmbiwgY29udGV4dCk7XG4gIHJldHVybiAoY29udHJvbGxlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcikgPT4gcmVmbGVjdENhbGwoZm4sIG9yaWdpbmFsLCBbY29udHJvbGxlcl0pO1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0VW5kZXJseWluZ1NpbmtXcml0ZUNhbGxiYWNrPFc+KFxuICBmbjogVW5kZXJseWluZ1NpbmtXcml0ZUNhbGxiYWNrPFc+LFxuICBvcmlnaW5hbDogVW5kZXJseWluZ1Npbms8Vz4sXG4gIGNvbnRleHQ6IHN0cmluZ1xuKTogKGNodW5rOiBXLCBjb250cm9sbGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyKSA9PiBQcm9taXNlPHZvaWQ+IHtcbiAgYXNzZXJ0RnVuY3Rpb24oZm4sIGNvbnRleHQpO1xuICByZXR1cm4gKGNodW5rOiBXLCBjb250cm9sbGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyKSA9PiBwcm9taXNlQ2FsbChmbiwgb3JpZ2luYWwsIFtjaHVuaywgY29udHJvbGxlcl0pO1xufVxuIiwgImltcG9ydCB7IElzV3JpdGFibGVTdHJlYW0sIFdyaXRhYmxlU3RyZWFtIH0gZnJvbSAnLi4vd3JpdGFibGUtc3RyZWFtJztcblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydFdyaXRhYmxlU3RyZWFtKHg6IHVua25vd24sIGNvbnRleHQ6IHN0cmluZyk6IGFzc2VydHMgeCBpcyBXcml0YWJsZVN0cmVhbSB7XG4gIGlmICghSXNXcml0YWJsZVN0cmVhbSh4KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYCR7Y29udGV4dH0gaXMgbm90IGEgV3JpdGFibGVTdHJlYW0uYCk7XG4gIH1cbn1cbiIsICIvKipcbiAqIEEgc2lnbmFsIG9iamVjdCB0aGF0IGFsbG93cyB5b3UgdG8gY29tbXVuaWNhdGUgd2l0aCBhIHJlcXVlc3QgYW5kIGFib3J0IGl0IGlmIHJlcXVpcmVkXG4gKiB2aWEgaXRzIGFzc29jaWF0ZWQgYEFib3J0Q29udHJvbGxlcmAgb2JqZWN0LlxuICpcbiAqIEByZW1hcmtzXG4gKiAgIFRoaXMgaW50ZXJmYWNlIGlzIGNvbXBhdGlibGUgd2l0aCB0aGUgYEFib3J0U2lnbmFsYCBpbnRlcmZhY2UgZGVmaW5lZCBpbiBUeXBlU2NyaXB0J3MgRE9NIHR5cGVzLlxuICogICBJdCBpcyByZWRlZmluZWQgaGVyZSwgc28gaXQgY2FuIGJlIHBvbHlmaWxsZWQgd2l0aG91dCBhIERPTSwgZm9yIGV4YW1wbGUgd2l0aFxuICogICB7QGxpbmsgaHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2UvYWJvcnRjb250cm9sbGVyLXBvbHlmaWxsIHwgYWJvcnRjb250cm9sbGVyLXBvbHlmaWxsfSBpbiBhIE5vZGUgZW52aXJvbm1lbnQuXG4gKlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgaW50ZXJmYWNlIEFib3J0U2lnbmFsIHtcbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIHJlcXVlc3QgaXMgYWJvcnRlZC5cbiAgICovXG4gIHJlYWRvbmx5IGFib3J0ZWQ6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIElmIGFib3J0ZWQsIHJldHVybnMgdGhlIHJlYXNvbiBmb3IgYWJvcnRpbmcuXG4gICAqL1xuICByZWFkb25seSByZWFzb24/OiBhbnk7XG5cbiAgLyoqXG4gICAqIEFkZCBhbiBldmVudCBsaXN0ZW5lciB0byBiZSB0cmlnZ2VyZWQgd2hlbiB0aGlzIHNpZ25hbCBiZWNvbWVzIGFib3J0ZWQuXG4gICAqL1xuICBhZGRFdmVudExpc3RlbmVyKHR5cGU6ICdhYm9ydCcsIGxpc3RlbmVyOiAoKSA9PiB2b2lkKTogdm9pZDtcblxuICAvKipcbiAgICogUmVtb3ZlIGFuIGV2ZW50IGxpc3RlbmVyIHRoYXQgd2FzIHByZXZpb3VzbHkgYWRkZWQgd2l0aCB7QGxpbmsgQWJvcnRTaWduYWwuYWRkRXZlbnRMaXN0ZW5lcn0uXG4gICAqL1xuICByZW1vdmVFdmVudExpc3RlbmVyKHR5cGU6ICdhYm9ydCcsIGxpc3RlbmVyOiAoKSA9PiB2b2lkKTogdm9pZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQWJvcnRTaWduYWwodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBBYm9ydFNpZ25hbCB7XG4gIGlmICh0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnIHx8IHZhbHVlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHRyeSB7XG4gICAgcmV0dXJuIHR5cGVvZiAodmFsdWUgYXMgQWJvcnRTaWduYWwpLmFib3J0ZWQgPT09ICdib29sZWFuJztcbiAgfSBjYXRjaCB7XG4gICAgLy8gQWJvcnRTaWduYWwucHJvdG90eXBlLmFib3J0ZWQgdGhyb3dzIGlmIGl0cyBicmFuZCBjaGVjayBmYWlsc1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG4vKipcbiAqIEEgY29udHJvbGxlciBvYmplY3QgdGhhdCBhbGxvd3MgeW91IHRvIGFib3J0IGFuIGBBYm9ydFNpZ25hbGAgd2hlbiBkZXNpcmVkLlxuICpcbiAqIEByZW1hcmtzXG4gKiAgIFRoaXMgaW50ZXJmYWNlIGlzIGNvbXBhdGlibGUgd2l0aCB0aGUgYEFib3J0Q29udHJvbGxlcmAgaW50ZXJmYWNlIGRlZmluZWQgaW4gVHlwZVNjcmlwdCdzIERPTSB0eXBlcy5cbiAqICAgSXQgaXMgcmVkZWZpbmVkIGhlcmUsIHNvIGl0IGNhbiBiZSBwb2x5ZmlsbGVkIHdpdGhvdXQgYSBET00sIGZvciBleGFtcGxlIHdpdGhcbiAqICAge0BsaW5rIGh0dHBzOi8vd3d3Lm5wbWpzLmNvbS9wYWNrYWdlL2Fib3J0Y29udHJvbGxlci1wb2x5ZmlsbCB8IGFib3J0Y29udHJvbGxlci1wb2x5ZmlsbH0gaW4gYSBOb2RlIGVudmlyb25tZW50LlxuICpcbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFib3J0Q29udHJvbGxlciB7XG4gIHJlYWRvbmx5IHNpZ25hbDogQWJvcnRTaWduYWw7XG5cbiAgYWJvcnQocmVhc29uPzogYW55KTogdm9pZDtcbn1cblxuaW50ZXJmYWNlIEFib3J0Q29udHJvbGxlckNvbnN0cnVjdG9yIHtcbiAgbmV3KCk6IEFib3J0Q29udHJvbGxlcjtcbn1cblxuY29uc3Qgc3VwcG9ydHNBYm9ydENvbnRyb2xsZXIgPSB0eXBlb2YgKEFib3J0Q29udHJvbGxlciBhcyBhbnkpID09PSAnZnVuY3Rpb24nO1xuXG4vKipcbiAqIENvbnN0cnVjdCBhIG5ldyBBYm9ydENvbnRyb2xsZXIsIGlmIHN1cHBvcnRlZCBieSB0aGUgcGxhdGZvcm0uXG4gKlxuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVBYm9ydENvbnRyb2xsZXIoKTogQWJvcnRDb250cm9sbGVyIHwgdW5kZWZpbmVkIHtcbiAgaWYgKHN1cHBvcnRzQWJvcnRDb250cm9sbGVyKSB7XG4gICAgcmV0dXJuIG5ldyAoQWJvcnRDb250cm9sbGVyIGFzIEFib3J0Q29udHJvbGxlckNvbnN0cnVjdG9yKSgpO1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG4iLCAiaW1wb3J0IGFzc2VydCBmcm9tICcuLi9zdHViL2Fzc2VydCc7XG5pbXBvcnQge1xuICBuZXdQcm9taXNlLFxuICBwcm9taXNlUmVqZWN0ZWRXaXRoLFxuICBwcm9taXNlUmVzb2x2ZWRXaXRoLFxuICBzZXRQcm9taXNlSXNIYW5kbGVkVG9UcnVlLFxuICB1cG9uUHJvbWlzZVxufSBmcm9tICcuL2hlbHBlcnMvd2ViaWRsJztcbmltcG9ydCB7XG4gIERlcXVldWVWYWx1ZSxcbiAgRW5xdWV1ZVZhbHVlV2l0aFNpemUsXG4gIFBlZWtRdWV1ZVZhbHVlLFxuICB0eXBlIFF1ZXVlUGFpcixcbiAgUmVzZXRRdWV1ZVxufSBmcm9tICcuL2Fic3RyYWN0LW9wcy9xdWV1ZS13aXRoLXNpemVzJztcbmltcG9ydCB0eXBlIHsgUXVldWluZ1N0cmF0ZWd5LCBRdWV1aW5nU3RyYXRlZ3lTaXplQ2FsbGJhY2sgfSBmcm9tICcuL3F1ZXVpbmctc3RyYXRlZ3knO1xuaW1wb3J0IHsgU2ltcGxlUXVldWUgfSBmcm9tICcuL3NpbXBsZS1xdWV1ZSc7XG5pbXBvcnQgeyBzZXRGdW5jdGlvbk5hbWUsIHR5cGVJc09iamVjdCB9IGZyb20gJy4vaGVscGVycy9taXNjZWxsYW5lb3VzJztcbmltcG9ydCB7IEFib3J0U3RlcHMsIEVycm9yU3RlcHMgfSBmcm9tICcuL2Fic3RyYWN0LW9wcy9pbnRlcm5hbC1tZXRob2RzJztcbmltcG9ydCB7IElzTm9uTmVnYXRpdmVOdW1iZXIgfSBmcm9tICcuL2Fic3RyYWN0LW9wcy9taXNjZWxsYW5lb3VzJztcbmltcG9ydCB7IEV4dHJhY3RIaWdoV2F0ZXJNYXJrLCBFeHRyYWN0U2l6ZUFsZ29yaXRobSB9IGZyb20gJy4vYWJzdHJhY3Qtb3BzL3F1ZXVpbmctc3RyYXRlZ3knO1xuaW1wb3J0IHsgY29udmVydFF1ZXVpbmdTdHJhdGVneSB9IGZyb20gJy4vdmFsaWRhdG9ycy9xdWV1aW5nLXN0cmF0ZWd5JztcbmltcG9ydCB0eXBlIHtcbiAgVW5kZXJseWluZ1NpbmssXG4gIFVuZGVybHlpbmdTaW5rQWJvcnRDYWxsYmFjayxcbiAgVW5kZXJseWluZ1NpbmtDbG9zZUNhbGxiYWNrLFxuICBVbmRlcmx5aW5nU2lua1N0YXJ0Q2FsbGJhY2ssXG4gIFVuZGVybHlpbmdTaW5rV3JpdGVDYWxsYmFjayxcbiAgVmFsaWRhdGVkVW5kZXJseWluZ1Npbmtcbn0gZnJvbSAnLi93cml0YWJsZS1zdHJlYW0vdW5kZXJseWluZy1zaW5rJztcbmltcG9ydCB7IGFzc2VydE9iamVjdCwgYXNzZXJ0UmVxdWlyZWRBcmd1bWVudCB9IGZyb20gJy4vdmFsaWRhdG9ycy9iYXNpYyc7XG5pbXBvcnQgeyBjb252ZXJ0VW5kZXJseWluZ1NpbmsgfSBmcm9tICcuL3ZhbGlkYXRvcnMvdW5kZXJseWluZy1zaW5rJztcbmltcG9ydCB7IGFzc2VydFdyaXRhYmxlU3RyZWFtIH0gZnJvbSAnLi92YWxpZGF0b3JzL3dyaXRhYmxlLXN0cmVhbSc7XG5pbXBvcnQgeyB0eXBlIEFib3J0Q29udHJvbGxlciwgdHlwZSBBYm9ydFNpZ25hbCwgY3JlYXRlQWJvcnRDb250cm9sbGVyIH0gZnJvbSAnLi9hYm9ydC1zaWduYWwnO1xuXG50eXBlIFdyaXRhYmxlU3RyZWFtU3RhdGUgPSAnd3JpdGFibGUnIHwgJ2Nsb3NlZCcgfCAnZXJyb3JpbmcnIHwgJ2Vycm9yZWQnO1xuXG5pbnRlcmZhY2UgV3JpdGVPckNsb3NlUmVxdWVzdCB7XG4gIF9yZXNvbHZlOiAodmFsdWU/OiB1bmRlZmluZWQpID0+IHZvaWQ7XG4gIF9yZWplY3Q6IChyZWFzb246IGFueSkgPT4gdm9pZDtcbn1cblxudHlwZSBXcml0ZVJlcXVlc3QgPSBXcml0ZU9yQ2xvc2VSZXF1ZXN0O1xudHlwZSBDbG9zZVJlcXVlc3QgPSBXcml0ZU9yQ2xvc2VSZXF1ZXN0O1xuXG5pbnRlcmZhY2UgUGVuZGluZ0Fib3J0UmVxdWVzdCB7XG4gIF9wcm9taXNlOiBQcm9taXNlPHVuZGVmaW5lZD47XG4gIF9yZXNvbHZlOiAodmFsdWU/OiB1bmRlZmluZWQpID0+IHZvaWQ7XG4gIF9yZWplY3Q6IChyZWFzb246IGFueSkgPT4gdm9pZDtcbiAgX3JlYXNvbjogYW55O1xuICBfd2FzQWxyZWFkeUVycm9yaW5nOiBib29sZWFuO1xufVxuXG4vKipcbiAqIEEgd3JpdGFibGUgc3RyZWFtIHJlcHJlc2VudHMgYSBkZXN0aW5hdGlvbiBmb3IgZGF0YSwgaW50byB3aGljaCB5b3UgY2FuIHdyaXRlLlxuICpcbiAqIEBwdWJsaWNcbiAqL1xuY2xhc3MgV3JpdGFibGVTdHJlYW08VyA9IGFueT4ge1xuICAvKiogQGludGVybmFsICovXG4gIF9zdGF0ZSE6IFdyaXRhYmxlU3RyZWFtU3RhdGU7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3N0b3JlZEVycm9yOiBhbnk7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3dyaXRlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyPFc+IHwgdW5kZWZpbmVkO1xuICAvKiogQGludGVybmFsICovXG4gIF93cml0YWJsZVN0cmVhbUNvbnRyb2xsZXIhOiBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyPFc+O1xuICAvKiogQGludGVybmFsICovXG4gIF93cml0ZVJlcXVlc3RzITogU2ltcGxlUXVldWU8V3JpdGVSZXF1ZXN0PjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfaW5GbGlnaHRXcml0ZVJlcXVlc3Q6IFdyaXRlUmVxdWVzdCB8IHVuZGVmaW5lZDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfY2xvc2VSZXF1ZXN0OiBDbG9zZVJlcXVlc3QgfCB1bmRlZmluZWQ7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2luRmxpZ2h0Q2xvc2VSZXF1ZXN0OiBDbG9zZVJlcXVlc3QgfCB1bmRlZmluZWQ7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3BlbmRpbmdBYm9ydFJlcXVlc3Q6IFBlbmRpbmdBYm9ydFJlcXVlc3QgfCB1bmRlZmluZWQ7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2JhY2twcmVzc3VyZSE6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IodW5kZXJseWluZ1Npbms/OiBVbmRlcmx5aW5nU2luazxXPiwgc3RyYXRlZ3k/OiBRdWV1aW5nU3RyYXRlZ3k8Vz4pO1xuICBjb25zdHJ1Y3RvcihyYXdVbmRlcmx5aW5nU2luazogVW5kZXJseWluZ1Npbms8Vz4gfCBudWxsIHwgdW5kZWZpbmVkID0ge30sXG4gICAgICAgICAgICAgIHJhd1N0cmF0ZWd5OiBRdWV1aW5nU3RyYXRlZ3k8Vz4gfCBudWxsIHwgdW5kZWZpbmVkID0ge30pIHtcbiAgICBpZiAocmF3VW5kZXJseWluZ1NpbmsgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmF3VW5kZXJseWluZ1NpbmsgPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICBhc3NlcnRPYmplY3QocmF3VW5kZXJseWluZ1NpbmssICdGaXJzdCBwYXJhbWV0ZXInKTtcbiAgICB9XG5cbiAgICBjb25zdCBzdHJhdGVneSA9IGNvbnZlcnRRdWV1aW5nU3RyYXRlZ3kocmF3U3RyYXRlZ3ksICdTZWNvbmQgcGFyYW1ldGVyJyk7XG4gICAgY29uc3QgdW5kZXJseWluZ1NpbmsgPSBjb252ZXJ0VW5kZXJseWluZ1NpbmsocmF3VW5kZXJseWluZ1NpbmssICdGaXJzdCBwYXJhbWV0ZXInKTtcblxuICAgIEluaXRpYWxpemVXcml0YWJsZVN0cmVhbSh0aGlzKTtcblxuICAgIGNvbnN0IHR5cGUgPSB1bmRlcmx5aW5nU2luay50eXBlO1xuICAgIGlmICh0eXBlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbnZhbGlkIHR5cGUgaXMgc3BlY2lmaWVkJyk7XG4gICAgfVxuXG4gICAgY29uc3Qgc2l6ZUFsZ29yaXRobSA9IEV4dHJhY3RTaXplQWxnb3JpdGhtKHN0cmF0ZWd5KTtcbiAgICBjb25zdCBoaWdoV2F0ZXJNYXJrID0gRXh0cmFjdEhpZ2hXYXRlck1hcmsoc3RyYXRlZ3ksIDEpO1xuXG4gICAgU2V0VXBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRnJvbVVuZGVybHlpbmdTaW5rKHRoaXMsIHVuZGVybHlpbmdTaW5rLCBoaWdoV2F0ZXJNYXJrLCBzaXplQWxnb3JpdGhtKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoZSB3cml0YWJsZSBzdHJlYW0gaXMgbG9ja2VkIHRvIGEgd3JpdGVyLlxuICAgKi9cbiAgZ2V0IGxvY2tlZCgpOiBib29sZWFuIHtcbiAgICBpZiAoIUlzV3JpdGFibGVTdHJlYW0odGhpcykpIHtcbiAgICAgIHRocm93IHN0cmVhbUJyYW5kQ2hlY2tFeGNlcHRpb24oJ2xvY2tlZCcpO1xuICAgIH1cblxuICAgIHJldHVybiBJc1dyaXRhYmxlU3RyZWFtTG9ja2VkKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFib3J0cyB0aGUgc3RyZWFtLCBzaWduYWxpbmcgdGhhdCB0aGUgcHJvZHVjZXIgY2FuIG5vIGxvbmdlciBzdWNjZXNzZnVsbHkgd3JpdGUgdG8gdGhlIHN0cmVhbSBhbmQgaXQgaXMgdG8gYmVcbiAgICogaW1tZWRpYXRlbHkgbW92ZWQgdG8gYW4gZXJyb3JlZCBzdGF0ZSwgd2l0aCBhbnkgcXVldWVkLXVwIHdyaXRlcyBkaXNjYXJkZWQuIFRoaXMgd2lsbCBhbHNvIGV4ZWN1dGUgYW55IGFib3J0XG4gICAqIG1lY2hhbmlzbSBvZiB0aGUgdW5kZXJseWluZyBzaW5rLlxuICAgKlxuICAgKiBUaGUgcmV0dXJuZWQgcHJvbWlzZSB3aWxsIGZ1bGZpbGwgaWYgdGhlIHN0cmVhbSBzaHV0cyBkb3duIHN1Y2Nlc3NmdWxseSwgb3IgcmVqZWN0IGlmIHRoZSB1bmRlcmx5aW5nIHNpbmsgc2lnbmFsZWRcbiAgICogdGhhdCB0aGVyZSB3YXMgYW4gZXJyb3IgZG9pbmcgc28uIEFkZGl0aW9uYWxseSwgaXQgd2lsbCByZWplY3Qgd2l0aCBhIGBUeXBlRXJyb3JgICh3aXRob3V0IGF0dGVtcHRpbmcgdG8gY2FuY2VsXG4gICAqIHRoZSBzdHJlYW0pIGlmIHRoZSBzdHJlYW0gaXMgY3VycmVudGx5IGxvY2tlZC5cbiAgICovXG4gIGFib3J0KHJlYXNvbjogYW55ID0gdW5kZWZpbmVkKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCFJc1dyaXRhYmxlU3RyZWFtKHRoaXMpKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChzdHJlYW1CcmFuZENoZWNrRXhjZXB0aW9uKCdhYm9ydCcpKTtcbiAgICB9XG5cbiAgICBpZiAoSXNXcml0YWJsZVN0cmVhbUxvY2tlZCh0aGlzKSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgobmV3IFR5cGVFcnJvcignQ2Fubm90IGFib3J0IGEgc3RyZWFtIHRoYXQgYWxyZWFkeSBoYXMgYSB3cml0ZXInKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFdyaXRhYmxlU3RyZWFtQWJvcnQodGhpcywgcmVhc29uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbG9zZXMgdGhlIHN0cmVhbS4gVGhlIHVuZGVybHlpbmcgc2luayB3aWxsIGZpbmlzaCBwcm9jZXNzaW5nIGFueSBwcmV2aW91c2x5LXdyaXR0ZW4gY2h1bmtzLCBiZWZvcmUgaW52b2tpbmcgaXRzXG4gICAqIGNsb3NlIGJlaGF2aW9yLiBEdXJpbmcgdGhpcyB0aW1lIGFueSBmdXJ0aGVyIGF0dGVtcHRzIHRvIHdyaXRlIHdpbGwgZmFpbCAod2l0aG91dCBlcnJvcmluZyB0aGUgc3RyZWFtKS5cbiAgICpcbiAgICogVGhlIG1ldGhvZCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHdpbGwgZnVsZmlsbCBpZiBhbGwgcmVtYWluaW5nIGNodW5rcyBhcmUgc3VjY2Vzc2Z1bGx5IHdyaXR0ZW4gYW5kIHRoZSBzdHJlYW1cbiAgICogc3VjY2Vzc2Z1bGx5IGNsb3Nlcywgb3IgcmVqZWN0cyBpZiBhbiBlcnJvciBpcyBlbmNvdW50ZXJlZCBkdXJpbmcgdGhpcyBwcm9jZXNzLiBBZGRpdGlvbmFsbHksIGl0IHdpbGwgcmVqZWN0IHdpdGhcbiAgICogYSBgVHlwZUVycm9yYCAod2l0aG91dCBhdHRlbXB0aW5nIHRvIGNhbmNlbCB0aGUgc3RyZWFtKSBpZiB0aGUgc3RyZWFtIGlzIGN1cnJlbnRseSBsb2NrZWQuXG4gICAqL1xuICBjbG9zZSgpIHtcbiAgICBpZiAoIUlzV3JpdGFibGVTdHJlYW0odGhpcykpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKHN0cmVhbUJyYW5kQ2hlY2tFeGNlcHRpb24oJ2Nsb3NlJykpO1xuICAgIH1cblxuICAgIGlmIChJc1dyaXRhYmxlU3RyZWFtTG9ja2VkKHRoaXMpKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChuZXcgVHlwZUVycm9yKCdDYW5ub3QgY2xvc2UgYSBzdHJlYW0gdGhhdCBhbHJlYWR5IGhhcyBhIHdyaXRlcicpKTtcbiAgICB9XG5cbiAgICBpZiAoV3JpdGFibGVTdHJlYW1DbG9zZVF1ZXVlZE9ySW5GbGlnaHQodGhpcykpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjbG9zZSBhbiBhbHJlYWR5LWNsb3Npbmcgc3RyZWFtJykpO1xuICAgIH1cblxuICAgIHJldHVybiBXcml0YWJsZVN0cmVhbUNsb3NlKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSB7QGxpbmsgV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyIHwgd3JpdGVyfSBhbmQgbG9ja3MgdGhlIHN0cmVhbSB0byB0aGUgbmV3IHdyaXRlci4gV2hpbGUgdGhlIHN0cmVhbVxuICAgKiBpcyBsb2NrZWQsIG5vIG90aGVyIHdyaXRlciBjYW4gYmUgYWNxdWlyZWQgdW50aWwgdGhpcyBvbmUgaXMgcmVsZWFzZWQuXG4gICAqXG4gICAqIFRoaXMgZnVuY3Rpb25hbGl0eSBpcyBlc3BlY2lhbGx5IHVzZWZ1bCBmb3IgY3JlYXRpbmcgYWJzdHJhY3Rpb25zIHRoYXQgZGVzaXJlIHRoZSBhYmlsaXR5IHRvIHdyaXRlIHRvIGEgc3RyZWFtXG4gICAqIHdpdGhvdXQgaW50ZXJydXB0aW9uIG9yIGludGVybGVhdmluZy4gQnkgZ2V0dGluZyBhIHdyaXRlciBmb3IgdGhlIHN0cmVhbSwgeW91IGNhbiBlbnN1cmUgbm9ib2R5IGVsc2UgY2FuIHdyaXRlIGF0XG4gICAqIHRoZSBzYW1lIHRpbWUsIHdoaWNoIHdvdWxkIGNhdXNlIHRoZSByZXN1bHRpbmcgd3JpdHRlbiBkYXRhIHRvIGJlIHVucHJlZGljdGFibGUgYW5kIHByb2JhYmx5IHVzZWxlc3MuXG4gICAqL1xuICBnZXRXcml0ZXIoKTogV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyPFc+IHtcbiAgICBpZiAoIUlzV3JpdGFibGVTdHJlYW0odGhpcykpIHtcbiAgICAgIHRocm93IHN0cmVhbUJyYW5kQ2hlY2tFeGNlcHRpb24oJ2dldFdyaXRlcicpO1xuICAgIH1cblxuICAgIHJldHVybiBBY3F1aXJlV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyKHRoaXMpO1xuICB9XG59XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFdyaXRhYmxlU3RyZWFtLnByb3RvdHlwZSwge1xuICBhYm9ydDogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIGNsb3NlOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgZ2V0V3JpdGVyOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgbG9ja2VkOiB7IGVudW1lcmFibGU6IHRydWUgfVxufSk7XG5zZXRGdW5jdGlvbk5hbWUoV3JpdGFibGVTdHJlYW0ucHJvdG90eXBlLmFib3J0LCAnYWJvcnQnKTtcbnNldEZ1bmN0aW9uTmFtZShXcml0YWJsZVN0cmVhbS5wcm90b3R5cGUuY2xvc2UsICdjbG9zZScpO1xuc2V0RnVuY3Rpb25OYW1lKFdyaXRhYmxlU3RyZWFtLnByb3RvdHlwZS5nZXRXcml0ZXIsICdnZXRXcml0ZXInKTtcbmlmICh0eXBlb2YgU3ltYm9sLnRvU3RyaW5nVGFnID09PSAnc3ltYm9sJykge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoV3JpdGFibGVTdHJlYW0ucHJvdG90eXBlLCBTeW1ib2wudG9TdHJpbmdUYWcsIHtcbiAgICB2YWx1ZTogJ1dyaXRhYmxlU3RyZWFtJyxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG59XG5cbmV4cG9ydCB7XG4gIEFjcXVpcmVXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIsXG4gIENyZWF0ZVdyaXRhYmxlU3RyZWFtLFxuICBJc1dyaXRhYmxlU3RyZWFtLFxuICBJc1dyaXRhYmxlU3RyZWFtTG9ja2VkLFxuICBXcml0YWJsZVN0cmVhbSxcbiAgV3JpdGFibGVTdHJlYW1BYm9ydCxcbiAgV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVycm9ySWZOZWVkZWQsXG4gIFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlckNsb3NlV2l0aEVycm9yUHJvcGFnYXRpb24sXG4gIFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlclJlbGVhc2UsXG4gIFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcldyaXRlLFxuICBXcml0YWJsZVN0cmVhbUNsb3NlUXVldWVkT3JJbkZsaWdodFxufTtcblxuZXhwb3J0IHR5cGUge1xuICBVbmRlcmx5aW5nU2luayxcbiAgVW5kZXJseWluZ1NpbmtTdGFydENhbGxiYWNrLFxuICBVbmRlcmx5aW5nU2lua1dyaXRlQ2FsbGJhY2ssXG4gIFVuZGVybHlpbmdTaW5rQ2xvc2VDYWxsYmFjayxcbiAgVW5kZXJseWluZ1NpbmtBYm9ydENhbGxiYWNrXG59O1xuXG4vLyBBYnN0cmFjdCBvcGVyYXRpb25zIGZvciB0aGUgV3JpdGFibGVTdHJlYW0uXG5cbmZ1bmN0aW9uIEFjcXVpcmVXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXI8Vz4oc3RyZWFtOiBXcml0YWJsZVN0cmVhbTxXPik6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcjxXPiB7XG4gIHJldHVybiBuZXcgV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyKHN0cmVhbSk7XG59XG5cbi8vIFRocm93cyBpZiBhbmQgb25seSBpZiBzdGFydEFsZ29yaXRobSB0aHJvd3MuXG5mdW5jdGlvbiBDcmVhdGVXcml0YWJsZVN0cmVhbTxXPihzdGFydEFsZ29yaXRobTogKCkgPT4gdm9pZCB8IFByb21pc2VMaWtlPHZvaWQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd3JpdGVBbGdvcml0aG06IChjaHVuazogVykgPT4gUHJvbWlzZTx2b2lkPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsb3NlQWxnb3JpdGhtOiAoKSA9PiBQcm9taXNlPHZvaWQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWJvcnRBbGdvcml0aG06IChyZWFzb246IGFueSkgPT4gUHJvbWlzZTx2b2lkPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhpZ2hXYXRlck1hcmsgPSAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZUFsZ29yaXRobTogUXVldWluZ1N0cmF0ZWd5U2l6ZUNhbGxiYWNrPFc+ID0gKCkgPT4gMSkge1xuICBhc3NlcnQoSXNOb25OZWdhdGl2ZU51bWJlcihoaWdoV2F0ZXJNYXJrKSk7XG5cbiAgY29uc3Qgc3RyZWFtOiBXcml0YWJsZVN0cmVhbTxXPiA9IE9iamVjdC5jcmVhdGUoV3JpdGFibGVTdHJlYW0ucHJvdG90eXBlKTtcbiAgSW5pdGlhbGl6ZVdyaXRhYmxlU3RyZWFtKHN0cmVhbSk7XG5cbiAgY29uc3QgY29udHJvbGxlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxXPiA9IE9iamVjdC5jcmVhdGUoV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlci5wcm90b3R5cGUpO1xuXG4gIFNldFVwV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcihzdHJlYW0sIGNvbnRyb2xsZXIsIHN0YXJ0QWxnb3JpdGhtLCB3cml0ZUFsZ29yaXRobSwgY2xvc2VBbGdvcml0aG0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhYm9ydEFsZ29yaXRobSwgaGlnaFdhdGVyTWFyaywgc2l6ZUFsZ29yaXRobSk7XG4gIHJldHVybiBzdHJlYW07XG59XG5cbmZ1bmN0aW9uIEluaXRpYWxpemVXcml0YWJsZVN0cmVhbTxXPihzdHJlYW06IFdyaXRhYmxlU3RyZWFtPFc+KSB7XG4gIHN0cmVhbS5fc3RhdGUgPSAnd3JpdGFibGUnO1xuXG4gIC8vIFRoZSBlcnJvciB0aGF0IHdpbGwgYmUgcmVwb3J0ZWQgYnkgbmV3IG1ldGhvZCBjYWxscyBvbmNlIHRoZSBzdGF0ZSBiZWNvbWVzIGVycm9yZWQuIE9ubHkgc2V0IHdoZW4gW1tzdGF0ZV1dIGlzXG4gIC8vICdlcnJvcmluZycgb3IgJ2Vycm9yZWQnLiBNYXkgYmUgc2V0IHRvIGFuIHVuZGVmaW5lZCB2YWx1ZS5cbiAgc3RyZWFtLl9zdG9yZWRFcnJvciA9IHVuZGVmaW5lZDtcblxuICBzdHJlYW0uX3dyaXRlciA9IHVuZGVmaW5lZDtcblxuICAvLyBJbml0aWFsaXplIHRvIHVuZGVmaW5lZCBmaXJzdCBiZWNhdXNlIHRoZSBjb25zdHJ1Y3RvciBvZiB0aGUgY29udHJvbGxlciBjaGVja3MgdGhpc1xuICAvLyB2YXJpYWJsZSB0byB2YWxpZGF0ZSB0aGUgY2FsbGVyLlxuICBzdHJlYW0uX3dyaXRhYmxlU3RyZWFtQ29udHJvbGxlciA9IHVuZGVmaW5lZCE7XG5cbiAgLy8gVGhpcyBxdWV1ZSBpcyBwbGFjZWQgaGVyZSBpbnN0ZWFkIG9mIHRoZSB3cml0ZXIgY2xhc3MgaW4gb3JkZXIgdG8gYWxsb3cgZm9yIHBhc3NpbmcgYSB3cml0ZXIgdG8gdGhlIG5leHQgZGF0YVxuICAvLyBwcm9kdWNlciB3aXRob3V0IHdhaXRpbmcgZm9yIHRoZSBxdWV1ZWQgd3JpdGVzIHRvIGZpbmlzaC5cbiAgc3RyZWFtLl93cml0ZVJlcXVlc3RzID0gbmV3IFNpbXBsZVF1ZXVlKCk7XG5cbiAgLy8gV3JpdGUgcmVxdWVzdHMgYXJlIHJlbW92ZWQgZnJvbSBfd3JpdGVSZXF1ZXN0cyB3aGVuIHdyaXRlKCkgaXMgY2FsbGVkIG9uIHRoZSB1bmRlcmx5aW5nIHNpbmsuIFRoaXMgcHJldmVudHNcbiAgLy8gdGhlbSBmcm9tIGJlaW5nIGVycm9uZW91c2x5IHJlamVjdGVkIG9uIGVycm9yLiBJZiBhIHdyaXRlKCkgY2FsbCBpcyBpbi1mbGlnaHQsIHRoZSByZXF1ZXN0IGlzIHN0b3JlZCBoZXJlLlxuICBzdHJlYW0uX2luRmxpZ2h0V3JpdGVSZXF1ZXN0ID0gdW5kZWZpbmVkO1xuXG4gIC8vIFRoZSBwcm9taXNlIHRoYXQgd2FzIHJldHVybmVkIGZyb20gd3JpdGVyLmNsb3NlKCkuIFN0b3JlZCBoZXJlIGJlY2F1c2UgaXQgbWF5IGJlIGZ1bGZpbGxlZCBhZnRlciB0aGUgd3JpdGVyXG4gIC8vIGhhcyBiZWVuIGRldGFjaGVkLlxuICBzdHJlYW0uX2Nsb3NlUmVxdWVzdCA9IHVuZGVmaW5lZDtcblxuICAvLyBDbG9zZSByZXF1ZXN0IGlzIHJlbW92ZWQgZnJvbSBfY2xvc2VSZXF1ZXN0IHdoZW4gY2xvc2UoKSBpcyBjYWxsZWQgb24gdGhlIHVuZGVybHlpbmcgc2luay4gVGhpcyBwcmV2ZW50cyBpdFxuICAvLyBmcm9tIGJlaW5nIGVycm9uZW91c2x5IHJlamVjdGVkIG9uIGVycm9yLiBJZiBhIGNsb3NlKCkgY2FsbCBpcyBpbi1mbGlnaHQsIHRoZSByZXF1ZXN0IGlzIHN0b3JlZCBoZXJlLlxuICBzdHJlYW0uX2luRmxpZ2h0Q2xvc2VSZXF1ZXN0ID0gdW5kZWZpbmVkO1xuXG4gIC8vIFRoZSBwcm9taXNlIHRoYXQgd2FzIHJldHVybmVkIGZyb20gd3JpdGVyLmFib3J0KCkuIFRoaXMgbWF5IGFsc28gYmUgZnVsZmlsbGVkIGFmdGVyIHRoZSB3cml0ZXIgaGFzIGRldGFjaGVkLlxuICBzdHJlYW0uX3BlbmRpbmdBYm9ydFJlcXVlc3QgPSB1bmRlZmluZWQ7XG5cbiAgLy8gVGhlIGJhY2twcmVzc3VyZSBzaWduYWwgc2V0IGJ5IHRoZSBjb250cm9sbGVyLlxuICBzdHJlYW0uX2JhY2twcmVzc3VyZSA9IGZhbHNlO1xufVxuXG5mdW5jdGlvbiBJc1dyaXRhYmxlU3RyZWFtKHg6IHVua25vd24pOiB4IGlzIFdyaXRhYmxlU3RyZWFtIHtcbiAgaWYgKCF0eXBlSXNPYmplY3QoeCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh4LCAnX3dyaXRhYmxlU3RyZWFtQ29udHJvbGxlcicpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHggaW5zdGFuY2VvZiBXcml0YWJsZVN0cmVhbTtcbn1cblxuZnVuY3Rpb24gSXNXcml0YWJsZVN0cmVhbUxvY2tlZChzdHJlYW06IFdyaXRhYmxlU3RyZWFtKTogYm9vbGVhbiB7XG4gIGFzc2VydChJc1dyaXRhYmxlU3RyZWFtKHN0cmVhbSkpO1xuXG4gIGlmIChzdHJlYW0uX3dyaXRlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtQWJvcnQoc3RyZWFtOiBXcml0YWJsZVN0cmVhbSwgcmVhc29uOiBhbnkpOiBQcm9taXNlPHVuZGVmaW5lZD4ge1xuICBpZiAoc3RyZWFtLl9zdGF0ZSA9PT0gJ2Nsb3NlZCcgfHwgc3RyZWFtLl9zdGF0ZSA9PT0gJ2Vycm9yZWQnKSB7XG4gICAgcmV0dXJuIHByb21pc2VSZXNvbHZlZFdpdGgodW5kZWZpbmVkKTtcbiAgfVxuICBzdHJlYW0uX3dyaXRhYmxlU3RyZWFtQ29udHJvbGxlci5fYWJvcnRSZWFzb24gPSByZWFzb247XG4gIHN0cmVhbS5fd3JpdGFibGVTdHJlYW1Db250cm9sbGVyLl9hYm9ydENvbnRyb2xsZXI/LmFib3J0KHJlYXNvbik7XG5cbiAgLy8gVHlwZVNjcmlwdCBuYXJyb3dzIHRoZSB0eXBlIG9mIGBzdHJlYW0uX3N0YXRlYCBkb3duIHRvICd3cml0YWJsZScgfCAnZXJyb3JpbmcnLFxuICAvLyBidXQgaXQgZG9lc24ndCBrbm93IHRoYXQgc2lnbmFsaW5nIGFib3J0IHJ1bnMgYXV0aG9yIGNvZGUgdGhhdCBtaWdodCBoYXZlIGNoYW5nZWQgdGhlIHN0YXRlLlxuICAvLyBXaWRlbiB0aGUgdHlwZSBhZ2FpbiBieSBjYXN0aW5nIHRvIFdyaXRhYmxlU3RyZWFtU3RhdGUuXG4gIGNvbnN0IHN0YXRlID0gc3RyZWFtLl9zdGF0ZSBhcyBXcml0YWJsZVN0cmVhbVN0YXRlO1xuXG4gIGlmIChzdGF0ZSA9PT0gJ2Nsb3NlZCcgfHwgc3RhdGUgPT09ICdlcnJvcmVkJykge1xuICAgIHJldHVybiBwcm9taXNlUmVzb2x2ZWRXaXRoKHVuZGVmaW5lZCk7XG4gIH1cbiAgaWYgKHN0cmVhbS5fcGVuZGluZ0Fib3J0UmVxdWVzdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHN0cmVhbS5fcGVuZGluZ0Fib3J0UmVxdWVzdC5fcHJvbWlzZTtcbiAgfVxuXG4gIGFzc2VydChzdGF0ZSA9PT0gJ3dyaXRhYmxlJyB8fCBzdGF0ZSA9PT0gJ2Vycm9yaW5nJyk7XG5cbiAgbGV0IHdhc0FscmVhZHlFcnJvcmluZyA9IGZhbHNlO1xuICBpZiAoc3RhdGUgPT09ICdlcnJvcmluZycpIHtcbiAgICB3YXNBbHJlYWR5RXJyb3JpbmcgPSB0cnVlO1xuICAgIC8vIHJlYXNvbiB3aWxsIG5vdCBiZSB1c2VkLCBzbyBkb24ndCBrZWVwIGEgcmVmZXJlbmNlIHRvIGl0LlxuICAgIHJlYXNvbiA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGNvbnN0IHByb21pc2UgPSBuZXdQcm9taXNlPHVuZGVmaW5lZD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHN0cmVhbS5fcGVuZGluZ0Fib3J0UmVxdWVzdCA9IHtcbiAgICAgIF9wcm9taXNlOiB1bmRlZmluZWQhLFxuICAgICAgX3Jlc29sdmU6IHJlc29sdmUsXG4gICAgICBfcmVqZWN0OiByZWplY3QsXG4gICAgICBfcmVhc29uOiByZWFzb24sXG4gICAgICBfd2FzQWxyZWFkeUVycm9yaW5nOiB3YXNBbHJlYWR5RXJyb3JpbmdcbiAgICB9O1xuICB9KTtcbiAgc3RyZWFtLl9wZW5kaW5nQWJvcnRSZXF1ZXN0IS5fcHJvbWlzZSA9IHByb21pc2U7XG5cbiAgaWYgKCF3YXNBbHJlYWR5RXJyb3JpbmcpIHtcbiAgICBXcml0YWJsZVN0cmVhbVN0YXJ0RXJyb3Jpbmcoc3RyZWFtLCByZWFzb24pO1xuICB9XG5cbiAgcmV0dXJuIHByb21pc2U7XG59XG5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtQ2xvc2Uoc3RyZWFtOiBXcml0YWJsZVN0cmVhbTxhbnk+KTogUHJvbWlzZTx1bmRlZmluZWQ+IHtcbiAgY29uc3Qgc3RhdGUgPSBzdHJlYW0uX3N0YXRlO1xuICBpZiAoc3RhdGUgPT09ICdjbG9zZWQnIHx8IHN0YXRlID09PSAnZXJyb3JlZCcpIHtcbiAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChuZXcgVHlwZUVycm9yKFxuICAgICAgYFRoZSBzdHJlYW0gKGluICR7c3RhdGV9IHN0YXRlKSBpcyBub3QgaW4gdGhlIHdyaXRhYmxlIHN0YXRlIGFuZCBjYW5ub3QgYmUgY2xvc2VkYCkpO1xuICB9XG5cbiAgYXNzZXJ0KHN0YXRlID09PSAnd3JpdGFibGUnIHx8IHN0YXRlID09PSAnZXJyb3JpbmcnKTtcbiAgYXNzZXJ0KCFXcml0YWJsZVN0cmVhbUNsb3NlUXVldWVkT3JJbkZsaWdodChzdHJlYW0pKTtcblxuICBjb25zdCBwcm9taXNlID0gbmV3UHJvbWlzZTx1bmRlZmluZWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCBjbG9zZVJlcXVlc3Q6IENsb3NlUmVxdWVzdCA9IHtcbiAgICAgIF9yZXNvbHZlOiByZXNvbHZlLFxuICAgICAgX3JlamVjdDogcmVqZWN0XG4gICAgfTtcblxuICAgIHN0cmVhbS5fY2xvc2VSZXF1ZXN0ID0gY2xvc2VSZXF1ZXN0O1xuICB9KTtcblxuICBjb25zdCB3cml0ZXIgPSBzdHJlYW0uX3dyaXRlcjtcbiAgaWYgKHdyaXRlciAhPT0gdW5kZWZpbmVkICYmIHN0cmVhbS5fYmFja3ByZXNzdXJlICYmIHN0YXRlID09PSAnd3JpdGFibGUnKSB7XG4gICAgZGVmYXVsdFdyaXRlclJlYWR5UHJvbWlzZVJlc29sdmUod3JpdGVyKTtcbiAgfVxuXG4gIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDbG9zZShzdHJlYW0uX3dyaXRhYmxlU3RyZWFtQ29udHJvbGxlcik7XG5cbiAgcmV0dXJuIHByb21pc2U7XG59XG5cbi8vIFdyaXRhYmxlU3RyZWFtIEFQSSBleHBvc2VkIGZvciBjb250cm9sbGVycy5cblxuZnVuY3Rpb24gV3JpdGFibGVTdHJlYW1BZGRXcml0ZVJlcXVlc3Qoc3RyZWFtOiBXcml0YWJsZVN0cmVhbSk6IFByb21pc2U8dW5kZWZpbmVkPiB7XG4gIGFzc2VydChJc1dyaXRhYmxlU3RyZWFtTG9ja2VkKHN0cmVhbSkpO1xuICBhc3NlcnQoc3RyZWFtLl9zdGF0ZSA9PT0gJ3dyaXRhYmxlJyk7XG5cbiAgY29uc3QgcHJvbWlzZSA9IG5ld1Byb21pc2U8dW5kZWZpbmVkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3Qgd3JpdGVSZXF1ZXN0OiBXcml0ZVJlcXVlc3QgPSB7XG4gICAgICBfcmVzb2x2ZTogcmVzb2x2ZSxcbiAgICAgIF9yZWplY3Q6IHJlamVjdFxuICAgIH07XG5cbiAgICBzdHJlYW0uX3dyaXRlUmVxdWVzdHMucHVzaCh3cml0ZVJlcXVlc3QpO1xuICB9KTtcblxuICByZXR1cm4gcHJvbWlzZTtcbn1cblxuZnVuY3Rpb24gV3JpdGFibGVTdHJlYW1EZWFsV2l0aFJlamVjdGlvbihzdHJlYW06IFdyaXRhYmxlU3RyZWFtLCBlcnJvcjogYW55KSB7XG4gIGNvbnN0IHN0YXRlID0gc3RyZWFtLl9zdGF0ZTtcblxuICBpZiAoc3RhdGUgPT09ICd3cml0YWJsZScpIHtcbiAgICBXcml0YWJsZVN0cmVhbVN0YXJ0RXJyb3Jpbmcoc3RyZWFtLCBlcnJvcik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgYXNzZXJ0KHN0YXRlID09PSAnZXJyb3JpbmcnKTtcbiAgV3JpdGFibGVTdHJlYW1GaW5pc2hFcnJvcmluZyhzdHJlYW0pO1xufVxuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbVN0YXJ0RXJyb3Jpbmcoc3RyZWFtOiBXcml0YWJsZVN0cmVhbSwgcmVhc29uOiBhbnkpIHtcbiAgYXNzZXJ0KHN0cmVhbS5fc3RvcmVkRXJyb3IgPT09IHVuZGVmaW5lZCk7XG4gIGFzc2VydChzdHJlYW0uX3N0YXRlID09PSAnd3JpdGFibGUnKTtcblxuICBjb25zdCBjb250cm9sbGVyID0gc3RyZWFtLl93cml0YWJsZVN0cmVhbUNvbnRyb2xsZXI7XG4gIGFzc2VydChjb250cm9sbGVyICE9PSB1bmRlZmluZWQpO1xuXG4gIHN0cmVhbS5fc3RhdGUgPSAnZXJyb3JpbmcnO1xuICBzdHJlYW0uX3N0b3JlZEVycm9yID0gcmVhc29uO1xuICBjb25zdCB3cml0ZXIgPSBzdHJlYW0uX3dyaXRlcjtcbiAgaWYgKHdyaXRlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyRW5zdXJlUmVhZHlQcm9taXNlUmVqZWN0ZWQod3JpdGVyLCByZWFzb24pO1xuICB9XG5cbiAgaWYgKCFXcml0YWJsZVN0cmVhbUhhc09wZXJhdGlvbk1hcmtlZEluRmxpZ2h0KHN0cmVhbSkgJiYgY29udHJvbGxlci5fc3RhcnRlZCkge1xuICAgIFdyaXRhYmxlU3RyZWFtRmluaXNoRXJyb3Jpbmcoc3RyZWFtKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbUZpbmlzaEVycm9yaW5nKHN0cmVhbTogV3JpdGFibGVTdHJlYW0pIHtcbiAgYXNzZXJ0KHN0cmVhbS5fc3RhdGUgPT09ICdlcnJvcmluZycpO1xuICBhc3NlcnQoIVdyaXRhYmxlU3RyZWFtSGFzT3BlcmF0aW9uTWFya2VkSW5GbGlnaHQoc3RyZWFtKSk7XG4gIHN0cmVhbS5fc3RhdGUgPSAnZXJyb3JlZCc7XG4gIHN0cmVhbS5fd3JpdGFibGVTdHJlYW1Db250cm9sbGVyW0Vycm9yU3RlcHNdKCk7XG5cbiAgY29uc3Qgc3RvcmVkRXJyb3IgPSBzdHJlYW0uX3N0b3JlZEVycm9yO1xuICBzdHJlYW0uX3dyaXRlUmVxdWVzdHMuZm9yRWFjaCh3cml0ZVJlcXVlc3QgPT4ge1xuICAgIHdyaXRlUmVxdWVzdC5fcmVqZWN0KHN0b3JlZEVycm9yKTtcbiAgfSk7XG4gIHN0cmVhbS5fd3JpdGVSZXF1ZXN0cyA9IG5ldyBTaW1wbGVRdWV1ZSgpO1xuXG4gIGlmIChzdHJlYW0uX3BlbmRpbmdBYm9ydFJlcXVlc3QgPT09IHVuZGVmaW5lZCkge1xuICAgIFdyaXRhYmxlU3RyZWFtUmVqZWN0Q2xvc2VBbmRDbG9zZWRQcm9taXNlSWZOZWVkZWQoc3RyZWFtKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBhYm9ydFJlcXVlc3QgPSBzdHJlYW0uX3BlbmRpbmdBYm9ydFJlcXVlc3Q7XG4gIHN0cmVhbS5fcGVuZGluZ0Fib3J0UmVxdWVzdCA9IHVuZGVmaW5lZDtcblxuICBpZiAoYWJvcnRSZXF1ZXN0Ll93YXNBbHJlYWR5RXJyb3JpbmcpIHtcbiAgICBhYm9ydFJlcXVlc3QuX3JlamVjdChzdG9yZWRFcnJvcik7XG4gICAgV3JpdGFibGVTdHJlYW1SZWplY3RDbG9zZUFuZENsb3NlZFByb21pc2VJZk5lZWRlZChzdHJlYW0pO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHByb21pc2UgPSBzdHJlYW0uX3dyaXRhYmxlU3RyZWFtQ29udHJvbGxlcltBYm9ydFN0ZXBzXShhYm9ydFJlcXVlc3QuX3JlYXNvbik7XG4gIHVwb25Qcm9taXNlKFxuICAgIHByb21pc2UsXG4gICAgKCkgPT4ge1xuICAgICAgYWJvcnRSZXF1ZXN0Ll9yZXNvbHZlKCk7XG4gICAgICBXcml0YWJsZVN0cmVhbVJlamVjdENsb3NlQW5kQ2xvc2VkUHJvbWlzZUlmTmVlZGVkKHN0cmVhbSk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIChyZWFzb246IGFueSkgPT4ge1xuICAgICAgYWJvcnRSZXF1ZXN0Ll9yZWplY3QocmVhc29uKTtcbiAgICAgIFdyaXRhYmxlU3RyZWFtUmVqZWN0Q2xvc2VBbmRDbG9zZWRQcm9taXNlSWZOZWVkZWQoc3RyZWFtKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbUZpbmlzaEluRmxpZ2h0V3JpdGUoc3RyZWFtOiBXcml0YWJsZVN0cmVhbSkge1xuICBhc3NlcnQoc3RyZWFtLl9pbkZsaWdodFdyaXRlUmVxdWVzdCAhPT0gdW5kZWZpbmVkKTtcbiAgc3RyZWFtLl9pbkZsaWdodFdyaXRlUmVxdWVzdCEuX3Jlc29sdmUodW5kZWZpbmVkKTtcbiAgc3RyZWFtLl9pbkZsaWdodFdyaXRlUmVxdWVzdCA9IHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gV3JpdGFibGVTdHJlYW1GaW5pc2hJbkZsaWdodFdyaXRlV2l0aEVycm9yKHN0cmVhbTogV3JpdGFibGVTdHJlYW0sIGVycm9yOiBhbnkpIHtcbiAgYXNzZXJ0KHN0cmVhbS5faW5GbGlnaHRXcml0ZVJlcXVlc3QgIT09IHVuZGVmaW5lZCk7XG4gIHN0cmVhbS5faW5GbGlnaHRXcml0ZVJlcXVlc3QhLl9yZWplY3QoZXJyb3IpO1xuICBzdHJlYW0uX2luRmxpZ2h0V3JpdGVSZXF1ZXN0ID0gdW5kZWZpbmVkO1xuXG4gIGFzc2VydChzdHJlYW0uX3N0YXRlID09PSAnd3JpdGFibGUnIHx8IHN0cmVhbS5fc3RhdGUgPT09ICdlcnJvcmluZycpO1xuXG4gIFdyaXRhYmxlU3RyZWFtRGVhbFdpdGhSZWplY3Rpb24oc3RyZWFtLCBlcnJvcik7XG59XG5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtRmluaXNoSW5GbGlnaHRDbG9zZShzdHJlYW06IFdyaXRhYmxlU3RyZWFtKSB7XG4gIGFzc2VydChzdHJlYW0uX2luRmxpZ2h0Q2xvc2VSZXF1ZXN0ICE9PSB1bmRlZmluZWQpO1xuICBzdHJlYW0uX2luRmxpZ2h0Q2xvc2VSZXF1ZXN0IS5fcmVzb2x2ZSh1bmRlZmluZWQpO1xuICBzdHJlYW0uX2luRmxpZ2h0Q2xvc2VSZXF1ZXN0ID0gdW5kZWZpbmVkO1xuXG4gIGNvbnN0IHN0YXRlID0gc3RyZWFtLl9zdGF0ZTtcblxuICBhc3NlcnQoc3RhdGUgPT09ICd3cml0YWJsZScgfHwgc3RhdGUgPT09ICdlcnJvcmluZycpO1xuXG4gIGlmIChzdGF0ZSA9PT0gJ2Vycm9yaW5nJykge1xuICAgIC8vIFRoZSBlcnJvciB3YXMgdG9vIGxhdGUgdG8gZG8gYW55dGhpbmcsIHNvIGl0IGlzIGlnbm9yZWQuXG4gICAgc3RyZWFtLl9zdG9yZWRFcnJvciA9IHVuZGVmaW5lZDtcbiAgICBpZiAoc3RyZWFtLl9wZW5kaW5nQWJvcnRSZXF1ZXN0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHN0cmVhbS5fcGVuZGluZ0Fib3J0UmVxdWVzdC5fcmVzb2x2ZSgpO1xuICAgICAgc3RyZWFtLl9wZW5kaW5nQWJvcnRSZXF1ZXN0ID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIHN0cmVhbS5fc3RhdGUgPSAnY2xvc2VkJztcblxuICBjb25zdCB3cml0ZXIgPSBzdHJlYW0uX3dyaXRlcjtcbiAgaWYgKHdyaXRlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgZGVmYXVsdFdyaXRlckNsb3NlZFByb21pc2VSZXNvbHZlKHdyaXRlcik7XG4gIH1cblxuICBhc3NlcnQoc3RyZWFtLl9wZW5kaW5nQWJvcnRSZXF1ZXN0ID09PSB1bmRlZmluZWQpO1xuICBhc3NlcnQoc3RyZWFtLl9zdG9yZWRFcnJvciA9PT0gdW5kZWZpbmVkKTtcbn1cblxuZnVuY3Rpb24gV3JpdGFibGVTdHJlYW1GaW5pc2hJbkZsaWdodENsb3NlV2l0aEVycm9yKHN0cmVhbTogV3JpdGFibGVTdHJlYW0sIGVycm9yOiBhbnkpIHtcbiAgYXNzZXJ0KHN0cmVhbS5faW5GbGlnaHRDbG9zZVJlcXVlc3QgIT09IHVuZGVmaW5lZCk7XG4gIHN0cmVhbS5faW5GbGlnaHRDbG9zZVJlcXVlc3QhLl9yZWplY3QoZXJyb3IpO1xuICBzdHJlYW0uX2luRmxpZ2h0Q2xvc2VSZXF1ZXN0ID0gdW5kZWZpbmVkO1xuXG4gIGFzc2VydChzdHJlYW0uX3N0YXRlID09PSAnd3JpdGFibGUnIHx8IHN0cmVhbS5fc3RhdGUgPT09ICdlcnJvcmluZycpO1xuXG4gIC8vIE5ldmVyIGV4ZWN1dGUgc2luayBhYm9ydCgpIGFmdGVyIHNpbmsgY2xvc2UoKS5cbiAgaWYgKHN0cmVhbS5fcGVuZGluZ0Fib3J0UmVxdWVzdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgc3RyZWFtLl9wZW5kaW5nQWJvcnRSZXF1ZXN0Ll9yZWplY3QoZXJyb3IpO1xuICAgIHN0cmVhbS5fcGVuZGluZ0Fib3J0UmVxdWVzdCA9IHVuZGVmaW5lZDtcbiAgfVxuICBXcml0YWJsZVN0cmVhbURlYWxXaXRoUmVqZWN0aW9uKHN0cmVhbSwgZXJyb3IpO1xufVxuXG4vLyBUT0RPKHJpY2VhKTogRml4IGFscGhhYmV0aWNhbCBvcmRlci5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtQ2xvc2VRdWV1ZWRPckluRmxpZ2h0KHN0cmVhbTogV3JpdGFibGVTdHJlYW0pOiBib29sZWFuIHtcbiAgaWYgKHN0cmVhbS5fY2xvc2VSZXF1ZXN0ID09PSB1bmRlZmluZWQgJiYgc3RyZWFtLl9pbkZsaWdodENsb3NlUmVxdWVzdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtSGFzT3BlcmF0aW9uTWFya2VkSW5GbGlnaHQoc3RyZWFtOiBXcml0YWJsZVN0cmVhbSk6IGJvb2xlYW4ge1xuICBpZiAoc3RyZWFtLl9pbkZsaWdodFdyaXRlUmVxdWVzdCA9PT0gdW5kZWZpbmVkICYmIHN0cmVhbS5faW5GbGlnaHRDbG9zZVJlcXVlc3QgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbU1hcmtDbG9zZVJlcXVlc3RJbkZsaWdodChzdHJlYW06IFdyaXRhYmxlU3RyZWFtKSB7XG4gIGFzc2VydChzdHJlYW0uX2luRmxpZ2h0Q2xvc2VSZXF1ZXN0ID09PSB1bmRlZmluZWQpO1xuICBhc3NlcnQoc3RyZWFtLl9jbG9zZVJlcXVlc3QgIT09IHVuZGVmaW5lZCk7XG4gIHN0cmVhbS5faW5GbGlnaHRDbG9zZVJlcXVlc3QgPSBzdHJlYW0uX2Nsb3NlUmVxdWVzdDtcbiAgc3RyZWFtLl9jbG9zZVJlcXVlc3QgPSB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtTWFya0ZpcnN0V3JpdGVSZXF1ZXN0SW5GbGlnaHQoc3RyZWFtOiBXcml0YWJsZVN0cmVhbSkge1xuICBhc3NlcnQoc3RyZWFtLl9pbkZsaWdodFdyaXRlUmVxdWVzdCA9PT0gdW5kZWZpbmVkKTtcbiAgYXNzZXJ0KHN0cmVhbS5fd3JpdGVSZXF1ZXN0cy5sZW5ndGggIT09IDApO1xuICBzdHJlYW0uX2luRmxpZ2h0V3JpdGVSZXF1ZXN0ID0gc3RyZWFtLl93cml0ZVJlcXVlc3RzLnNoaWZ0KCk7XG59XG5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtUmVqZWN0Q2xvc2VBbmRDbG9zZWRQcm9taXNlSWZOZWVkZWQoc3RyZWFtOiBXcml0YWJsZVN0cmVhbSkge1xuICBhc3NlcnQoc3RyZWFtLl9zdGF0ZSA9PT0gJ2Vycm9yZWQnKTtcbiAgaWYgKHN0cmVhbS5fY2xvc2VSZXF1ZXN0ICE9PSB1bmRlZmluZWQpIHtcbiAgICBhc3NlcnQoc3RyZWFtLl9pbkZsaWdodENsb3NlUmVxdWVzdCA9PT0gdW5kZWZpbmVkKTtcblxuICAgIHN0cmVhbS5fY2xvc2VSZXF1ZXN0Ll9yZWplY3Qoc3RyZWFtLl9zdG9yZWRFcnJvcik7XG4gICAgc3RyZWFtLl9jbG9zZVJlcXVlc3QgPSB1bmRlZmluZWQ7XG4gIH1cbiAgY29uc3Qgd3JpdGVyID0gc3RyZWFtLl93cml0ZXI7XG4gIGlmICh3cml0ZXIgIT09IHVuZGVmaW5lZCkge1xuICAgIGRlZmF1bHRXcml0ZXJDbG9zZWRQcm9taXNlUmVqZWN0KHdyaXRlciwgc3RyZWFtLl9zdG9yZWRFcnJvcik7XG4gIH1cbn1cblxuZnVuY3Rpb24gV3JpdGFibGVTdHJlYW1VcGRhdGVCYWNrcHJlc3N1cmUoc3RyZWFtOiBXcml0YWJsZVN0cmVhbSwgYmFja3ByZXNzdXJlOiBib29sZWFuKSB7XG4gIGFzc2VydChzdHJlYW0uX3N0YXRlID09PSAnd3JpdGFibGUnKTtcbiAgYXNzZXJ0KCFXcml0YWJsZVN0cmVhbUNsb3NlUXVldWVkT3JJbkZsaWdodChzdHJlYW0pKTtcblxuICBjb25zdCB3cml0ZXIgPSBzdHJlYW0uX3dyaXRlcjtcbiAgaWYgKHdyaXRlciAhPT0gdW5kZWZpbmVkICYmIGJhY2twcmVzc3VyZSAhPT0gc3RyZWFtLl9iYWNrcHJlc3N1cmUpIHtcbiAgICBpZiAoYmFja3ByZXNzdXJlKSB7XG4gICAgICBkZWZhdWx0V3JpdGVyUmVhZHlQcm9taXNlUmVzZXQod3JpdGVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXNzZXJ0KCFiYWNrcHJlc3N1cmUpO1xuXG4gICAgICBkZWZhdWx0V3JpdGVyUmVhZHlQcm9taXNlUmVzb2x2ZSh3cml0ZXIpO1xuICAgIH1cbiAgfVxuXG4gIHN0cmVhbS5fYmFja3ByZXNzdXJlID0gYmFja3ByZXNzdXJlO1xufVxuXG4vKipcbiAqIEEgZGVmYXVsdCB3cml0ZXIgdmVuZGVkIGJ5IGEge0BsaW5rIFdyaXRhYmxlU3RyZWFtfS5cbiAqXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjbGFzcyBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXI8VyA9IGFueT4ge1xuICAvKiogQGludGVybmFsICovXG4gIF9vd25lcldyaXRhYmxlU3RyZWFtOiBXcml0YWJsZVN0cmVhbTxXPjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfY2xvc2VkUHJvbWlzZSE6IFByb21pc2U8dW5kZWZpbmVkPjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfY2xvc2VkUHJvbWlzZV9yZXNvbHZlPzogKHZhbHVlPzogdW5kZWZpbmVkKSA9PiB2b2lkO1xuICAvKiogQGludGVybmFsICovXG4gIF9jbG9zZWRQcm9taXNlX3JlamVjdD86IChyZWFzb246IGFueSkgPT4gdm9pZDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfY2xvc2VkUHJvbWlzZVN0YXRlITogJ3BlbmRpbmcnIHwgJ3Jlc29sdmVkJyB8ICdyZWplY3RlZCc7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3JlYWR5UHJvbWlzZSE6IFByb21pc2U8dW5kZWZpbmVkPjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcmVhZHlQcm9taXNlX3Jlc29sdmU/OiAodmFsdWU/OiB1bmRlZmluZWQpID0+IHZvaWQ7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3JlYWR5UHJvbWlzZV9yZWplY3Q/OiAocmVhc29uOiBhbnkpID0+IHZvaWQ7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3JlYWR5UHJvbWlzZVN0YXRlITogJ3BlbmRpbmcnIHwgJ2Z1bGZpbGxlZCcgfCAncmVqZWN0ZWQnO1xuXG4gIGNvbnN0cnVjdG9yKHN0cmVhbTogV3JpdGFibGVTdHJlYW08Vz4pIHtcbiAgICBhc3NlcnRSZXF1aXJlZEFyZ3VtZW50KHN0cmVhbSwgMSwgJ1dyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcicpO1xuICAgIGFzc2VydFdyaXRhYmxlU3RyZWFtKHN0cmVhbSwgJ0ZpcnN0IHBhcmFtZXRlcicpO1xuXG4gICAgaWYgKElzV3JpdGFibGVTdHJlYW1Mb2NrZWQoc3RyZWFtKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhpcyBzdHJlYW0gaGFzIGFscmVhZHkgYmVlbiBsb2NrZWQgZm9yIGV4Y2x1c2l2ZSB3cml0aW5nIGJ5IGFub3RoZXIgd3JpdGVyJyk7XG4gICAgfVxuXG4gICAgdGhpcy5fb3duZXJXcml0YWJsZVN0cmVhbSA9IHN0cmVhbTtcbiAgICBzdHJlYW0uX3dyaXRlciA9IHRoaXM7XG5cbiAgICBjb25zdCBzdGF0ZSA9IHN0cmVhbS5fc3RhdGU7XG5cbiAgICBpZiAoc3RhdGUgPT09ICd3cml0YWJsZScpIHtcbiAgICAgIGlmICghV3JpdGFibGVTdHJlYW1DbG9zZVF1ZXVlZE9ySW5GbGlnaHQoc3RyZWFtKSAmJiBzdHJlYW0uX2JhY2twcmVzc3VyZSkge1xuICAgICAgICBkZWZhdWx0V3JpdGVyUmVhZHlQcm9taXNlSW5pdGlhbGl6ZSh0aGlzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlZmF1bHRXcml0ZXJSZWFkeVByb21pc2VJbml0aWFsaXplQXNSZXNvbHZlZCh0aGlzKTtcbiAgICAgIH1cblxuICAgICAgZGVmYXVsdFdyaXRlckNsb3NlZFByb21pc2VJbml0aWFsaXplKHRoaXMpO1xuICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09ICdlcnJvcmluZycpIHtcbiAgICAgIGRlZmF1bHRXcml0ZXJSZWFkeVByb21pc2VJbml0aWFsaXplQXNSZWplY3RlZCh0aGlzLCBzdHJlYW0uX3N0b3JlZEVycm9yKTtcbiAgICAgIGRlZmF1bHRXcml0ZXJDbG9zZWRQcm9taXNlSW5pdGlhbGl6ZSh0aGlzKTtcbiAgICB9IGVsc2UgaWYgKHN0YXRlID09PSAnY2xvc2VkJykge1xuICAgICAgZGVmYXVsdFdyaXRlclJlYWR5UHJvbWlzZUluaXRpYWxpemVBc1Jlc29sdmVkKHRoaXMpO1xuICAgICAgZGVmYXVsdFdyaXRlckNsb3NlZFByb21pc2VJbml0aWFsaXplQXNSZXNvbHZlZCh0aGlzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXNzZXJ0KHN0YXRlID09PSAnZXJyb3JlZCcpO1xuXG4gICAgICBjb25zdCBzdG9yZWRFcnJvciA9IHN0cmVhbS5fc3RvcmVkRXJyb3I7XG4gICAgICBkZWZhdWx0V3JpdGVyUmVhZHlQcm9taXNlSW5pdGlhbGl6ZUFzUmVqZWN0ZWQodGhpcywgc3RvcmVkRXJyb3IpO1xuICAgICAgZGVmYXVsdFdyaXRlckNsb3NlZFByb21pc2VJbml0aWFsaXplQXNSZWplY3RlZCh0aGlzLCBzdG9yZWRFcnJvcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBwcm9taXNlIHRoYXQgd2lsbCBiZSBmdWxmaWxsZWQgd2hlbiB0aGUgc3RyZWFtIGJlY29tZXMgY2xvc2VkLCBvciByZWplY3RlZCBpZiB0aGUgc3RyZWFtIGV2ZXIgZXJyb3JzIG9yXG4gICAqIHRoZSB3cml0ZXLigJlzIGxvY2sgaXMgcmVsZWFzZWQgYmVmb3JlIHRoZSBzdHJlYW0gZmluaXNoZXMgY2xvc2luZy5cbiAgICovXG4gIGdldCBjbG9zZWQoKTogUHJvbWlzZTx1bmRlZmluZWQ+IHtcbiAgICBpZiAoIUlzV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyKHRoaXMpKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChkZWZhdWx0V3JpdGVyQnJhbmRDaGVja0V4Y2VwdGlvbignY2xvc2VkJykpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9jbG9zZWRQcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGRlc2lyZWQgc2l6ZSB0byBmaWxsIHRoZSBzdHJlYW3igJlzIGludGVybmFsIHF1ZXVlLiBJdCBjYW4gYmUgbmVnYXRpdmUsIGlmIHRoZSBxdWV1ZSBpcyBvdmVyLWZ1bGwuXG4gICAqIEEgcHJvZHVjZXIgY2FuIHVzZSB0aGlzIGluZm9ybWF0aW9uIHRvIGRldGVybWluZSB0aGUgcmlnaHQgYW1vdW50IG9mIGRhdGEgdG8gd3JpdGUuXG4gICAqXG4gICAqIEl0IHdpbGwgYmUgYG51bGxgIGlmIHRoZSBzdHJlYW0gY2Fubm90IGJlIHN1Y2Nlc3NmdWxseSB3cml0dGVuIHRvIChkdWUgdG8gZWl0aGVyIGJlaW5nIGVycm9yZWQsIG9yIGhhdmluZyBhbiBhYm9ydFxuICAgKiBxdWV1ZWQgdXApLiBJdCB3aWxsIHJldHVybiB6ZXJvIGlmIHRoZSBzdHJlYW0gaXMgY2xvc2VkLiBBbmQgdGhlIGdldHRlciB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBpbnZva2VkIHdoZW5cbiAgICogdGhlIHdyaXRlcuKAmXMgbG9jayBpcyByZWxlYXNlZC5cbiAgICovXG4gIGdldCBkZXNpcmVkU2l6ZSgpOiBudW1iZXIgfCBudWxsIHtcbiAgICBpZiAoIUlzV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyKHRoaXMpKSB7XG4gICAgICB0aHJvdyBkZWZhdWx0V3JpdGVyQnJhbmRDaGVja0V4Y2VwdGlvbignZGVzaXJlZFNpemUnKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fb3duZXJXcml0YWJsZVN0cmVhbSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBkZWZhdWx0V3JpdGVyTG9ja0V4Y2VwdGlvbignZGVzaXJlZFNpemUnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyR2V0RGVzaXJlZFNpemUodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHByb21pc2UgdGhhdCB3aWxsIGJlIGZ1bGZpbGxlZCB3aGVuIHRoZSBkZXNpcmVkIHNpemUgdG8gZmlsbCB0aGUgc3RyZWFt4oCZcyBpbnRlcm5hbCBxdWV1ZSB0cmFuc2l0aW9uc1xuICAgKiBmcm9tIG5vbi1wb3NpdGl2ZSB0byBwb3NpdGl2ZSwgc2lnbmFsaW5nIHRoYXQgaXQgaXMgbm8gbG9uZ2VyIGFwcGx5aW5nIGJhY2twcmVzc3VyZS4gT25jZSB0aGUgZGVzaXJlZCBzaXplIGRpcHNcbiAgICogYmFjayB0byB6ZXJvIG9yIGJlbG93LCB0aGUgZ2V0dGVyIHdpbGwgcmV0dXJuIGEgbmV3IHByb21pc2UgdGhhdCBzdGF5cyBwZW5kaW5nIHVudGlsIHRoZSBuZXh0IHRyYW5zaXRpb24uXG4gICAqXG4gICAqIElmIHRoZSBzdHJlYW0gYmVjb21lcyBlcnJvcmVkIG9yIGFib3J0ZWQsIG9yIHRoZSB3cml0ZXLigJlzIGxvY2sgaXMgcmVsZWFzZWQsIHRoZSByZXR1cm5lZCBwcm9taXNlIHdpbGwgYmVjb21lXG4gICAqIHJlamVjdGVkLlxuICAgKi9cbiAgZ2V0IHJlYWR5KCk6IFByb21pc2U8dW5kZWZpbmVkPiB7XG4gICAgaWYgKCFJc1dyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcih0aGlzKSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoZGVmYXVsdFdyaXRlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ3JlYWR5JykpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9yZWFkeVByb21pc2U7XG4gIH1cblxuICAvKipcbiAgICogSWYgdGhlIHJlYWRlciBpcyBhY3RpdmUsIGJlaGF2ZXMgdGhlIHNhbWUgYXMge0BsaW5rIFdyaXRhYmxlU3RyZWFtLmFib3J0IHwgc3RyZWFtLmFib3J0KHJlYXNvbil9LlxuICAgKi9cbiAgYWJvcnQocmVhc29uOiBhbnkgPSB1bmRlZmluZWQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIUlzV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyKHRoaXMpKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChkZWZhdWx0V3JpdGVyQnJhbmRDaGVja0V4Y2VwdGlvbignYWJvcnQnKSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX293bmVyV3JpdGFibGVTdHJlYW0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoZGVmYXVsdFdyaXRlckxvY2tFeGNlcHRpb24oJ2Fib3J0JykpO1xuICAgIH1cblxuICAgIHJldHVybiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXJBYm9ydCh0aGlzLCByZWFzb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIElmIHRoZSByZWFkZXIgaXMgYWN0aXZlLCBiZWhhdmVzIHRoZSBzYW1lIGFzIHtAbGluayBXcml0YWJsZVN0cmVhbS5jbG9zZSB8IHN0cmVhbS5jbG9zZSgpfS5cbiAgICovXG4gIGNsb3NlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghSXNXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIodGhpcykpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKGRlZmF1bHRXcml0ZXJCcmFuZENoZWNrRXhjZXB0aW9uKCdjbG9zZScpKTtcbiAgICB9XG5cbiAgICBjb25zdCBzdHJlYW0gPSB0aGlzLl9vd25lcldyaXRhYmxlU3RyZWFtO1xuXG4gICAgaWYgKHN0cmVhbSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChkZWZhdWx0V3JpdGVyTG9ja0V4Y2VwdGlvbignY2xvc2UnKSk7XG4gICAgfVxuXG4gICAgaWYgKFdyaXRhYmxlU3RyZWFtQ2xvc2VRdWV1ZWRPckluRmxpZ2h0KHN0cmVhbSkpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjbG9zZSBhbiBhbHJlYWR5LWNsb3Npbmcgc3RyZWFtJykpO1xuICAgIH1cblxuICAgIHJldHVybiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXJDbG9zZSh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWxlYXNlcyB0aGUgd3JpdGVy4oCZcyBsb2NrIG9uIHRoZSBjb3JyZXNwb25kaW5nIHN0cmVhbS4gQWZ0ZXIgdGhlIGxvY2sgaXMgcmVsZWFzZWQsIHRoZSB3cml0ZXIgaXMgbm8gbG9uZ2VyIGFjdGl2ZS5cbiAgICogSWYgdGhlIGFzc29jaWF0ZWQgc3RyZWFtIGlzIGVycm9yZWQgd2hlbiB0aGUgbG9jayBpcyByZWxlYXNlZCwgdGhlIHdyaXRlciB3aWxsIGFwcGVhciBlcnJvcmVkIGluIHRoZSBzYW1lIHdheSBmcm9tXG4gICAqIG5vdyBvbjsgb3RoZXJ3aXNlLCB0aGUgd3JpdGVyIHdpbGwgYXBwZWFyIGNsb3NlZC5cbiAgICpcbiAgICogTm90ZSB0aGF0IHRoZSBsb2NrIGNhbiBzdGlsbCBiZSByZWxlYXNlZCBldmVuIGlmIHNvbWUgb25nb2luZyB3cml0ZXMgaGF2ZSBub3QgeWV0IGZpbmlzaGVkIChpLmUuIGV2ZW4gaWYgdGhlXG4gICAqIHByb21pc2VzIHJldHVybmVkIGZyb20gcHJldmlvdXMgY2FsbHMgdG8ge0BsaW5rIFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlci53cml0ZSB8IHdyaXRlKCl9IGhhdmUgbm90IHlldCBzZXR0bGVkKS5cbiAgICogSXTigJlzIG5vdCBuZWNlc3NhcnkgdG8gaG9sZCB0aGUgbG9jayBvbiB0aGUgd3JpdGVyIGZvciB0aGUgZHVyYXRpb24gb2YgdGhlIHdyaXRlOyB0aGUgbG9jayBpbnN0ZWFkIHNpbXBseSBwcmV2ZW50c1xuICAgKiBvdGhlciBwcm9kdWNlcnMgZnJvbSB3cml0aW5nIGluIGFuIGludGVybGVhdmVkIG1hbm5lci5cbiAgICovXG4gIHJlbGVhc2VMb2NrKCk6IHZvaWQge1xuICAgIGlmICghSXNXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIodGhpcykpIHtcbiAgICAgIHRocm93IGRlZmF1bHRXcml0ZXJCcmFuZENoZWNrRXhjZXB0aW9uKCdyZWxlYXNlTG9jaycpO1xuICAgIH1cblxuICAgIGNvbnN0IHN0cmVhbSA9IHRoaXMuX293bmVyV3JpdGFibGVTdHJlYW07XG5cbiAgICBpZiAoc3RyZWFtID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBhc3NlcnQoc3RyZWFtLl93cml0ZXIgIT09IHVuZGVmaW5lZCk7XG5cbiAgICBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXJSZWxlYXNlKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFdyaXRlcyB0aGUgZ2l2ZW4gY2h1bmsgdG8gdGhlIHdyaXRhYmxlIHN0cmVhbSwgYnkgd2FpdGluZyB1bnRpbCBhbnkgcHJldmlvdXMgd3JpdGVzIGhhdmUgZmluaXNoZWQgc3VjY2Vzc2Z1bGx5LFxuICAgKiBhbmQgdGhlbiBzZW5kaW5nIHRoZSBjaHVuayB0byB0aGUgdW5kZXJseWluZyBzaW5rJ3Mge0BsaW5rIFVuZGVybHlpbmdTaW5rLndyaXRlIHwgd3JpdGUoKX0gbWV0aG9kLiBJdCB3aWxsIHJldHVyblxuICAgKiBhIHByb21pc2UgdGhhdCBmdWxmaWxscyB3aXRoIHVuZGVmaW5lZCB1cG9uIGEgc3VjY2Vzc2Z1bCB3cml0ZSwgb3IgcmVqZWN0cyBpZiB0aGUgd3JpdGUgZmFpbHMgb3Igc3RyZWFtIGJlY29tZXNcbiAgICogZXJyb3JlZCBiZWZvcmUgdGhlIHdyaXRpbmcgcHJvY2VzcyBpcyBpbml0aWF0ZWQuXG4gICAqXG4gICAqIE5vdGUgdGhhdCB3aGF0IFwic3VjY2Vzc1wiIG1lYW5zIGlzIHVwIHRvIHRoZSB1bmRlcmx5aW5nIHNpbms7IGl0IG1pZ2h0IGluZGljYXRlIHNpbXBseSB0aGF0IHRoZSBjaHVuayBoYXMgYmVlblxuICAgKiBhY2NlcHRlZCwgYW5kIG5vdCBuZWNlc3NhcmlseSB0aGF0IGl0IGlzIHNhZmVseSBzYXZlZCB0byBpdHMgdWx0aW1hdGUgZGVzdGluYXRpb24uXG4gICAqL1xuICB3cml0ZShjaHVuazogVyk6IFByb21pc2U8dm9pZD47XG4gIHdyaXRlKGNodW5rOiBXID0gdW5kZWZpbmVkISk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghSXNXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIodGhpcykpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKGRlZmF1bHRXcml0ZXJCcmFuZENoZWNrRXhjZXB0aW9uKCd3cml0ZScpKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fb3duZXJXcml0YWJsZVN0cmVhbSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChkZWZhdWx0V3JpdGVyTG9ja0V4Y2VwdGlvbignd3JpdGUgdG8nKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcldyaXRlKHRoaXMsIGNodW5rKTtcbiAgfVxufVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyhXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIucHJvdG90eXBlLCB7XG4gIGFib3J0OiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgY2xvc2U6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICByZWxlYXNlTG9jazogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIHdyaXRlOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgY2xvc2VkOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgZGVzaXJlZFNpemU6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICByZWFkeTogeyBlbnVtZXJhYmxlOiB0cnVlIH1cbn0pO1xuc2V0RnVuY3Rpb25OYW1lKFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlci5wcm90b3R5cGUuYWJvcnQsICdhYm9ydCcpO1xuc2V0RnVuY3Rpb25OYW1lKFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlci5wcm90b3R5cGUuY2xvc2UsICdjbG9zZScpO1xuc2V0RnVuY3Rpb25OYW1lKFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlci5wcm90b3R5cGUucmVsZWFzZUxvY2ssICdyZWxlYXNlTG9jaycpO1xuc2V0RnVuY3Rpb25OYW1lKFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlci5wcm90b3R5cGUud3JpdGUsICd3cml0ZScpO1xuaWYgKHR5cGVvZiBTeW1ib2wudG9TdHJpbmdUYWcgPT09ICdzeW1ib2wnKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIucHJvdG90eXBlLCBTeW1ib2wudG9TdHJpbmdUYWcsIHtcbiAgICB2YWx1ZTogJ1dyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcicsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xufVxuXG4vLyBBYnN0cmFjdCBvcGVyYXRpb25zIGZvciB0aGUgV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyLlxuXG5mdW5jdGlvbiBJc1dyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcjxXID0gYW55Pih4OiBhbnkpOiB4IGlzIFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcjxXPiB7XG4gIGlmICghdHlwZUlzT2JqZWN0KHgpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoeCwgJ19vd25lcldyaXRhYmxlU3RyZWFtJykpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4geCBpbnN0YW5jZW9mIFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcjtcbn1cblxuLy8gQSBjbGllbnQgb2YgV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyIG1heSB1c2UgdGhlc2UgZnVuY3Rpb25zIGRpcmVjdGx5IHRvIGJ5cGFzcyBzdGF0ZSBjaGVjay5cblxuZnVuY3Rpb24gV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyQWJvcnQod3JpdGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIsIHJlYXNvbjogYW55KSB7XG4gIGNvbnN0IHN0cmVhbSA9IHdyaXRlci5fb3duZXJXcml0YWJsZVN0cmVhbTtcblxuICBhc3NlcnQoc3RyZWFtICE9PSB1bmRlZmluZWQpO1xuXG4gIHJldHVybiBXcml0YWJsZVN0cmVhbUFib3J0KHN0cmVhbSwgcmVhc29uKTtcbn1cblxuZnVuY3Rpb24gV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyQ2xvc2Uod3JpdGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIpOiBQcm9taXNlPHVuZGVmaW5lZD4ge1xuICBjb25zdCBzdHJlYW0gPSB3cml0ZXIuX293bmVyV3JpdGFibGVTdHJlYW07XG5cbiAgYXNzZXJ0KHN0cmVhbSAhPT0gdW5kZWZpbmVkKTtcblxuICByZXR1cm4gV3JpdGFibGVTdHJlYW1DbG9zZShzdHJlYW0pO1xufVxuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXJDbG9zZVdpdGhFcnJvclByb3BhZ2F0aW9uKHdyaXRlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyKTogUHJvbWlzZTx1bmRlZmluZWQ+IHtcbiAgY29uc3Qgc3RyZWFtID0gd3JpdGVyLl9vd25lcldyaXRhYmxlU3RyZWFtO1xuXG4gIGFzc2VydChzdHJlYW0gIT09IHVuZGVmaW5lZCk7XG5cbiAgY29uc3Qgc3RhdGUgPSBzdHJlYW0uX3N0YXRlO1xuICBpZiAoV3JpdGFibGVTdHJlYW1DbG9zZVF1ZXVlZE9ySW5GbGlnaHQoc3RyZWFtKSB8fCBzdGF0ZSA9PT0gJ2Nsb3NlZCcpIHtcbiAgICByZXR1cm4gcHJvbWlzZVJlc29sdmVkV2l0aCh1bmRlZmluZWQpO1xuICB9XG5cbiAgaWYgKHN0YXRlID09PSAnZXJyb3JlZCcpIHtcbiAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChzdHJlYW0uX3N0b3JlZEVycm9yKTtcbiAgfVxuXG4gIGFzc2VydChzdGF0ZSA9PT0gJ3dyaXRhYmxlJyB8fCBzdGF0ZSA9PT0gJ2Vycm9yaW5nJyk7XG5cbiAgcmV0dXJuIFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlckNsb3NlKHdyaXRlcik7XG59XG5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlckVuc3VyZUNsb3NlZFByb21pc2VSZWplY3RlZCh3cml0ZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlciwgZXJyb3I6IGFueSkge1xuICBpZiAod3JpdGVyLl9jbG9zZWRQcm9taXNlU3RhdGUgPT09ICdwZW5kaW5nJykge1xuICAgIGRlZmF1bHRXcml0ZXJDbG9zZWRQcm9taXNlUmVqZWN0KHdyaXRlciwgZXJyb3IpO1xuICB9IGVsc2Uge1xuICAgIGRlZmF1bHRXcml0ZXJDbG9zZWRQcm9taXNlUmVzZXRUb1JlamVjdGVkKHdyaXRlciwgZXJyb3IpO1xuICB9XG59XG5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlckVuc3VyZVJlYWR5UHJvbWlzZVJlamVjdGVkKHdyaXRlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyLCBlcnJvcjogYW55KSB7XG4gIGlmICh3cml0ZXIuX3JlYWR5UHJvbWlzZVN0YXRlID09PSAncGVuZGluZycpIHtcbiAgICBkZWZhdWx0V3JpdGVyUmVhZHlQcm9taXNlUmVqZWN0KHdyaXRlciwgZXJyb3IpO1xuICB9IGVsc2Uge1xuICAgIGRlZmF1bHRXcml0ZXJSZWFkeVByb21pc2VSZXNldFRvUmVqZWN0ZWQod3JpdGVyLCBlcnJvcik7XG4gIH1cbn1cblxuZnVuY3Rpb24gV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyR2V0RGVzaXJlZFNpemUod3JpdGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIpOiBudW1iZXIgfCBudWxsIHtcbiAgY29uc3Qgc3RyZWFtID0gd3JpdGVyLl9vd25lcldyaXRhYmxlU3RyZWFtO1xuICBjb25zdCBzdGF0ZSA9IHN0cmVhbS5fc3RhdGU7XG5cbiAgaWYgKHN0YXRlID09PSAnZXJyb3JlZCcgfHwgc3RhdGUgPT09ICdlcnJvcmluZycpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmIChzdGF0ZSA9PT0gJ2Nsb3NlZCcpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIHJldHVybiBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyR2V0RGVzaXJlZFNpemUoc3RyZWFtLl93cml0YWJsZVN0cmVhbUNvbnRyb2xsZXIpO1xufVxuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXJSZWxlYXNlKHdyaXRlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyKSB7XG4gIGNvbnN0IHN0cmVhbSA9IHdyaXRlci5fb3duZXJXcml0YWJsZVN0cmVhbTtcbiAgYXNzZXJ0KHN0cmVhbSAhPT0gdW5kZWZpbmVkKTtcbiAgYXNzZXJ0KHN0cmVhbS5fd3JpdGVyID09PSB3cml0ZXIpO1xuXG4gIGNvbnN0IHJlbGVhc2VkRXJyb3IgPSBuZXcgVHlwZUVycm9yKFxuICAgIGBXcml0ZXIgd2FzIHJlbGVhc2VkIGFuZCBjYW4gbm8gbG9uZ2VyIGJlIHVzZWQgdG8gbW9uaXRvciB0aGUgc3RyZWFtJ3MgY2xvc2VkbmVzc2ApO1xuXG4gIFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlckVuc3VyZVJlYWR5UHJvbWlzZVJlamVjdGVkKHdyaXRlciwgcmVsZWFzZWRFcnJvcik7XG5cbiAgLy8gVGhlIHN0YXRlIHRyYW5zaXRpb25zIHRvIFwiZXJyb3JlZFwiIGJlZm9yZSB0aGUgc2luayBhYm9ydCgpIG1ldGhvZCBydW5zLCBidXQgdGhlIHdyaXRlci5jbG9zZWQgcHJvbWlzZSBpcyBub3RcbiAgLy8gcmVqZWN0ZWQgdW50aWwgYWZ0ZXJ3YXJkcy4gVGhpcyBtZWFucyB0aGF0IHNpbXBseSB0ZXN0aW5nIHN0YXRlIHdpbGwgbm90IHdvcmsuXG4gIFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlckVuc3VyZUNsb3NlZFByb21pc2VSZWplY3RlZCh3cml0ZXIsIHJlbGVhc2VkRXJyb3IpO1xuXG4gIHN0cmVhbS5fd3JpdGVyID0gdW5kZWZpbmVkO1xuICB3cml0ZXIuX293bmVyV3JpdGFibGVTdHJlYW0gPSB1bmRlZmluZWQhO1xufVxuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXJXcml0ZTxXPih3cml0ZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcjxXPiwgY2h1bms6IFcpOiBQcm9taXNlPHVuZGVmaW5lZD4ge1xuICBjb25zdCBzdHJlYW0gPSB3cml0ZXIuX293bmVyV3JpdGFibGVTdHJlYW07XG5cbiAgYXNzZXJ0KHN0cmVhbSAhPT0gdW5kZWZpbmVkKTtcblxuICBjb25zdCBjb250cm9sbGVyID0gc3RyZWFtLl93cml0YWJsZVN0cmVhbUNvbnRyb2xsZXI7XG5cbiAgY29uc3QgY2h1bmtTaXplID0gV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckdldENodW5rU2l6ZShjb250cm9sbGVyLCBjaHVuayk7XG5cbiAgaWYgKHN0cmVhbSAhPT0gd3JpdGVyLl9vd25lcldyaXRhYmxlU3RyZWFtKSB7XG4gICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoZGVmYXVsdFdyaXRlckxvY2tFeGNlcHRpb24oJ3dyaXRlIHRvJykpO1xuICB9XG5cbiAgY29uc3Qgc3RhdGUgPSBzdHJlYW0uX3N0YXRlO1xuICBpZiAoc3RhdGUgPT09ICdlcnJvcmVkJykge1xuICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKHN0cmVhbS5fc3RvcmVkRXJyb3IpO1xuICB9XG4gIGlmIChXcml0YWJsZVN0cmVhbUNsb3NlUXVldWVkT3JJbkZsaWdodChzdHJlYW0pIHx8IHN0YXRlID09PSAnY2xvc2VkJykge1xuICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKG5ldyBUeXBlRXJyb3IoJ1RoZSBzdHJlYW0gaXMgY2xvc2luZyBvciBjbG9zZWQgYW5kIGNhbm5vdCBiZSB3cml0dGVuIHRvJykpO1xuICB9XG4gIGlmIChzdGF0ZSA9PT0gJ2Vycm9yaW5nJykge1xuICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKHN0cmVhbS5fc3RvcmVkRXJyb3IpO1xuICB9XG5cbiAgYXNzZXJ0KHN0YXRlID09PSAnd3JpdGFibGUnKTtcblxuICBjb25zdCBwcm9taXNlID0gV3JpdGFibGVTdHJlYW1BZGRXcml0ZVJlcXVlc3Qoc3RyZWFtKTtcblxuICBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyV3JpdGUoY29udHJvbGxlciwgY2h1bmssIGNodW5rU2l6ZSk7XG5cbiAgcmV0dXJuIHByb21pc2U7XG59XG5cbmNvbnN0IGNsb3NlU2VudGluZWw6IHVuaXF1ZSBzeW1ib2wgPSB7fSBhcyBhbnk7XG5cbnR5cGUgUXVldWVSZWNvcmQ8Vz4gPSBXIHwgdHlwZW9mIGNsb3NlU2VudGluZWw7XG5cbi8qKlxuICogQWxsb3dzIGNvbnRyb2wgb2YgYSB7QGxpbmsgV3JpdGFibGVTdHJlYW0gfCB3cml0YWJsZSBzdHJlYW19J3Mgc3RhdGUgYW5kIGludGVybmFsIHF1ZXVlLlxuICpcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNsYXNzIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8VyA9IGFueT4ge1xuICAvKiogQGludGVybmFsICovXG4gIF9jb250cm9sbGVkV3JpdGFibGVTdHJlYW0hOiBXcml0YWJsZVN0cmVhbTxXPjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcXVldWUhOiBTaW1wbGVRdWV1ZTxRdWV1ZVBhaXI8UXVldWVSZWNvcmQ8Vz4+PjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcXVldWVUb3RhbFNpemUhOiBudW1iZXI7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2Fib3J0UmVhc29uOiBhbnk7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2Fib3J0Q29udHJvbGxlcjogQWJvcnRDb250cm9sbGVyIHwgdW5kZWZpbmVkO1xuICAvKiogQGludGVybmFsICovXG4gIF9zdGFydGVkITogYm9vbGVhbjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfc3RyYXRlZ3lTaXplQWxnb3JpdGhtITogUXVldWluZ1N0cmF0ZWd5U2l6ZUNhbGxiYWNrPFc+O1xuICAvKiogQGludGVybmFsICovXG4gIF9zdHJhdGVneUhXTSE6IG51bWJlcjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfd3JpdGVBbGdvcml0aG0hOiAoY2h1bms6IFcpID0+IFByb21pc2U8dm9pZD47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2Nsb3NlQWxnb3JpdGhtITogKCkgPT4gUHJvbWlzZTx2b2lkPjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfYWJvcnRBbGdvcml0aG0hOiAocmVhc29uOiBhbnkpID0+IFByb21pc2U8dm9pZD47XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbGxlZ2FsIGNvbnN0cnVjdG9yJyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHJlYXNvbiB3aGljaCB3YXMgcGFzc2VkIHRvIGBXcml0YWJsZVN0cmVhbS5hYm9ydChyZWFzb24pYCB3aGVuIHRoZSBzdHJlYW0gd2FzIGFib3J0ZWQuXG4gICAqXG4gICAqIEBkZXByZWNhdGVkXG4gICAqICBUaGlzIHByb3BlcnR5IGhhcyBiZWVuIHJlbW92ZWQgZnJvbSB0aGUgc3BlY2lmaWNhdGlvbiwgc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS93aGF0d2cvc3RyZWFtcy9wdWxsLzExNzcuXG4gICAqICBVc2Uge0BsaW5rIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIuc2lnbmFsfSdzIGByZWFzb25gIGluc3RlYWQuXG4gICAqL1xuICBnZXQgYWJvcnRSZWFzb24oKTogYW55IHtcbiAgICBpZiAoIUlzV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcih0aGlzKSkge1xuICAgICAgdGhyb3cgZGVmYXVsdENvbnRyb2xsZXJCcmFuZENoZWNrRXhjZXB0aW9uKCdhYm9ydFJlYXNvbicpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fYWJvcnRSZWFzb247XG4gIH1cblxuICAvKipcbiAgICogQW4gYEFib3J0U2lnbmFsYCB0aGF0IGNhbiBiZSB1c2VkIHRvIGFib3J0IHRoZSBwZW5kaW5nIHdyaXRlIG9yIGNsb3NlIG9wZXJhdGlvbiB3aGVuIHRoZSBzdHJlYW0gaXMgYWJvcnRlZC5cbiAgICovXG4gIGdldCBzaWduYWwoKTogQWJvcnRTaWduYWwge1xuICAgIGlmICghSXNXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyKHRoaXMpKSB7XG4gICAgICB0aHJvdyBkZWZhdWx0Q29udHJvbGxlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ3NpZ25hbCcpO1xuICAgIH1cbiAgICBpZiAodGhpcy5fYWJvcnRDb250cm9sbGVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIE9sZGVyIGJyb3dzZXJzIG9yIG9sZGVyIE5vZGUgdmVyc2lvbnMgbWF5IG5vdCBzdXBwb3J0IGBBYm9ydENvbnRyb2xsZXJgIG9yIGBBYm9ydFNpZ25hbGAuXG4gICAgICAvLyBXZSBkb24ndCB3YW50IHRvIGJ1bmRsZSBhbmQgc2hpcCBhbiBgQWJvcnRDb250cm9sbGVyYCBwb2x5ZmlsbCB0b2dldGhlciB3aXRoIG91ciBwb2x5ZmlsbCxcbiAgICAgIC8vIHNvIGluc3RlYWQgd2Ugb25seSBpbXBsZW1lbnQgc3VwcG9ydCBmb3IgYHNpZ25hbGAgaWYgd2UgZmluZCBhIGdsb2JhbCBgQWJvcnRDb250cm9sbGVyYCBjb25zdHJ1Y3Rvci5cbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1dyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIucHJvdG90eXBlLnNpZ25hbCBpcyBub3Qgc3VwcG9ydGVkJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9hYm9ydENvbnRyb2xsZXIuc2lnbmFsO1xuICB9XG5cbiAgLyoqXG4gICAqIENsb3NlcyB0aGUgY29udHJvbGxlZCB3cml0YWJsZSBzdHJlYW0sIG1ha2luZyBhbGwgZnV0dXJlIGludGVyYWN0aW9ucyB3aXRoIGl0IGZhaWwgd2l0aCB0aGUgZ2l2ZW4gZXJyb3IgYGVgLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBpcyByYXJlbHkgdXNlZCwgc2luY2UgdXN1YWxseSBpdCBzdWZmaWNlcyB0byByZXR1cm4gYSByZWplY3RlZCBwcm9taXNlIGZyb20gb25lIG9mIHRoZSB1bmRlcmx5aW5nXG4gICAqIHNpbmsncyBtZXRob2RzLiBIb3dldmVyLCBpdCBjYW4gYmUgdXNlZnVsIGZvciBzdWRkZW5seSBzaHV0dGluZyBkb3duIGEgc3RyZWFtIGluIHJlc3BvbnNlIHRvIGFuIGV2ZW50IG91dHNpZGUgdGhlXG4gICAqIG5vcm1hbCBsaWZlY3ljbGUgb2YgaW50ZXJhY3Rpb25zIHdpdGggdGhlIHVuZGVybHlpbmcgc2luay5cbiAgICovXG4gIGVycm9yKGU6IGFueSA9IHVuZGVmaW5lZCk6IHZvaWQge1xuICAgIGlmICghSXNXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyKHRoaXMpKSB7XG4gICAgICB0aHJvdyBkZWZhdWx0Q29udHJvbGxlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ2Vycm9yJyk7XG4gICAgfVxuICAgIGNvbnN0IHN0YXRlID0gdGhpcy5fY29udHJvbGxlZFdyaXRhYmxlU3RyZWFtLl9zdGF0ZTtcbiAgICBpZiAoc3RhdGUgIT09ICd3cml0YWJsZScpIHtcbiAgICAgIC8vIFRoZSBzdHJlYW0gaXMgY2xvc2VkLCBlcnJvcmVkIG9yIHdpbGwgYmUgc29vbi4gVGhlIHNpbmsgY2FuJ3QgZG8gYW55dGhpbmcgdXNlZnVsIGlmIGl0IGdldHMgYW4gZXJyb3IgaGVyZSwgc29cbiAgICAgIC8vIGp1c3QgdHJlYXQgaXQgYXMgYSBuby1vcC5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRXJyb3IodGhpcywgZSk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIFtBYm9ydFN0ZXBzXShyZWFzb246IGFueSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuX2Fib3J0QWxnb3JpdGhtKHJlYXNvbik7XG4gICAgV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNsZWFyQWxnb3JpdGhtcyh0aGlzKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBbRXJyb3JTdGVwc10oKSB7XG4gICAgUmVzZXRRdWV1ZSh0aGlzKTtcbiAgfVxufVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyhXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyLnByb3RvdHlwZSwge1xuICBhYm9ydFJlYXNvbjogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIHNpZ25hbDogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIGVycm9yOiB7IGVudW1lcmFibGU6IHRydWUgfVxufSk7XG5pZiAodHlwZW9mIFN5bWJvbC50b1N0cmluZ1RhZyA9PT0gJ3N5bWJvbCcpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIucHJvdG90eXBlLCBTeW1ib2wudG9TdHJpbmdUYWcsIHtcbiAgICB2YWx1ZTogJ1dyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXInLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbn1cblxuLy8gQWJzdHJhY3Qgb3BlcmF0aW9ucyBpbXBsZW1lbnRpbmcgaW50ZXJmYWNlIHJlcXVpcmVkIGJ5IHRoZSBXcml0YWJsZVN0cmVhbS5cblxuZnVuY3Rpb24gSXNXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyKHg6IGFueSk6IHggaXMgV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxhbnk+IHtcbiAgaWYgKCF0eXBlSXNPYmplY3QoeCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh4LCAnX2NvbnRyb2xsZWRXcml0YWJsZVN0cmVhbScpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHggaW5zdGFuY2VvZiBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyO1xufVxuXG5mdW5jdGlvbiBTZXRVcFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8Vz4oc3RyZWFtOiBXcml0YWJsZVN0cmVhbTxXPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyPFc+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0QWxnb3JpdGhtOiAoKSA9PiB2b2lkIHwgUHJvbWlzZUxpa2U8dm9pZD4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd3JpdGVBbGdvcml0aG06IChjaHVuazogVykgPT4gUHJvbWlzZTx2b2lkPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9zZUFsZ29yaXRobTogKCkgPT4gUHJvbWlzZTx2b2lkPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhYm9ydEFsZ29yaXRobTogKHJlYXNvbjogYW55KSA9PiBQcm9taXNlPHZvaWQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhpZ2hXYXRlck1hcms6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaXplQWxnb3JpdGhtOiBRdWV1aW5nU3RyYXRlZ3lTaXplQ2FsbGJhY2s8Vz4pIHtcbiAgYXNzZXJ0KElzV3JpdGFibGVTdHJlYW0oc3RyZWFtKSk7XG4gIGFzc2VydChzdHJlYW0uX3dyaXRhYmxlU3RyZWFtQ29udHJvbGxlciA9PT0gdW5kZWZpbmVkKTtcblxuICBjb250cm9sbGVyLl9jb250cm9sbGVkV3JpdGFibGVTdHJlYW0gPSBzdHJlYW07XG4gIHN0cmVhbS5fd3JpdGFibGVTdHJlYW1Db250cm9sbGVyID0gY29udHJvbGxlcjtcblxuICAvLyBOZWVkIHRvIHNldCB0aGUgc2xvdHMgc28gdGhhdCB0aGUgYXNzZXJ0IGRvZXNuJ3QgZmlyZS4gSW4gdGhlIHNwZWMgdGhlIHNsb3RzIGFscmVhZHkgZXhpc3QgaW1wbGljaXRseS5cbiAgY29udHJvbGxlci5fcXVldWUgPSB1bmRlZmluZWQhO1xuICBjb250cm9sbGVyLl9xdWV1ZVRvdGFsU2l6ZSA9IHVuZGVmaW5lZCE7XG4gIFJlc2V0UXVldWUoY29udHJvbGxlcik7XG5cbiAgY29udHJvbGxlci5fYWJvcnRSZWFzb24gPSB1bmRlZmluZWQ7XG4gIGNvbnRyb2xsZXIuX2Fib3J0Q29udHJvbGxlciA9IGNyZWF0ZUFib3J0Q29udHJvbGxlcigpO1xuICBjb250cm9sbGVyLl9zdGFydGVkID0gZmFsc2U7XG5cbiAgY29udHJvbGxlci5fc3RyYXRlZ3lTaXplQWxnb3JpdGhtID0gc2l6ZUFsZ29yaXRobTtcbiAgY29udHJvbGxlci5fc3RyYXRlZ3lIV00gPSBoaWdoV2F0ZXJNYXJrO1xuXG4gIGNvbnRyb2xsZXIuX3dyaXRlQWxnb3JpdGhtID0gd3JpdGVBbGdvcml0aG07XG4gIGNvbnRyb2xsZXIuX2Nsb3NlQWxnb3JpdGhtID0gY2xvc2VBbGdvcml0aG07XG4gIGNvbnRyb2xsZXIuX2Fib3J0QWxnb3JpdGhtID0gYWJvcnRBbGdvcml0aG07XG5cbiAgY29uc3QgYmFja3ByZXNzdXJlID0gV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckdldEJhY2twcmVzc3VyZShjb250cm9sbGVyKTtcbiAgV3JpdGFibGVTdHJlYW1VcGRhdGVCYWNrcHJlc3N1cmUoc3RyZWFtLCBiYWNrcHJlc3N1cmUpO1xuXG4gIGNvbnN0IHN0YXJ0UmVzdWx0ID0gc3RhcnRBbGdvcml0aG0oKTtcbiAgY29uc3Qgc3RhcnRQcm9taXNlID0gcHJvbWlzZVJlc29sdmVkV2l0aChzdGFydFJlc3VsdCk7XG4gIHVwb25Qcm9taXNlKFxuICAgIHN0YXJ0UHJvbWlzZSxcbiAgICAoKSA9PiB7XG4gICAgICBhc3NlcnQoc3RyZWFtLl9zdGF0ZSA9PT0gJ3dyaXRhYmxlJyB8fCBzdHJlYW0uX3N0YXRlID09PSAnZXJyb3JpbmcnKTtcbiAgICAgIGNvbnRyb2xsZXIuX3N0YXJ0ZWQgPSB0cnVlO1xuICAgICAgV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckFkdmFuY2VRdWV1ZUlmTmVlZGVkKGNvbnRyb2xsZXIpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcbiAgICByID0+IHtcbiAgICAgIGFzc2VydChzdHJlYW0uX3N0YXRlID09PSAnd3JpdGFibGUnIHx8IHN0cmVhbS5fc3RhdGUgPT09ICdlcnJvcmluZycpO1xuICAgICAgY29udHJvbGxlci5fc3RhcnRlZCA9IHRydWU7XG4gICAgICBXcml0YWJsZVN0cmVhbURlYWxXaXRoUmVqZWN0aW9uKHN0cmVhbSwgcik7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICk7XG59XG5cbmZ1bmN0aW9uIFNldFVwV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckZyb21VbmRlcmx5aW5nU2luazxXPihzdHJlYW06IFdyaXRhYmxlU3RyZWFtPFc+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuZGVybHlpbmdTaW5rOiBWYWxpZGF0ZWRVbmRlcmx5aW5nU2luazxXPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoaWdoV2F0ZXJNYXJrOiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZUFsZ29yaXRobTogUXVldWluZ1N0cmF0ZWd5U2l6ZUNhbGxiYWNrPFc+KSB7XG4gIGNvbnN0IGNvbnRyb2xsZXIgPSBPYmplY3QuY3JlYXRlKFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIucHJvdG90eXBlKTtcblxuICBsZXQgc3RhcnRBbGdvcml0aG06ICgpID0+IHZvaWQgfCBQcm9taXNlTGlrZTx2b2lkPjtcbiAgbGV0IHdyaXRlQWxnb3JpdGhtOiAoY2h1bms6IFcpID0+IFByb21pc2U8dm9pZD47XG4gIGxldCBjbG9zZUFsZ29yaXRobTogKCkgPT4gUHJvbWlzZTx2b2lkPjtcbiAgbGV0IGFib3J0QWxnb3JpdGhtOiAocmVhc29uOiBhbnkpID0+IFByb21pc2U8dm9pZD47XG5cbiAgaWYgKHVuZGVybHlpbmdTaW5rLnN0YXJ0ICE9PSB1bmRlZmluZWQpIHtcbiAgICBzdGFydEFsZ29yaXRobSA9ICgpID0+IHVuZGVybHlpbmdTaW5rLnN0YXJ0IShjb250cm9sbGVyKTtcbiAgfSBlbHNlIHtcbiAgICBzdGFydEFsZ29yaXRobSA9ICgpID0+IHVuZGVmaW5lZDtcbiAgfVxuICBpZiAodW5kZXJseWluZ1Npbmsud3JpdGUgIT09IHVuZGVmaW5lZCkge1xuICAgIHdyaXRlQWxnb3JpdGhtID0gY2h1bmsgPT4gdW5kZXJseWluZ1Npbmsud3JpdGUhKGNodW5rLCBjb250cm9sbGVyKTtcbiAgfSBlbHNlIHtcbiAgICB3cml0ZUFsZ29yaXRobSA9ICgpID0+IHByb21pc2VSZXNvbHZlZFdpdGgodW5kZWZpbmVkKTtcbiAgfVxuICBpZiAodW5kZXJseWluZ1NpbmsuY2xvc2UgIT09IHVuZGVmaW5lZCkge1xuICAgIGNsb3NlQWxnb3JpdGhtID0gKCkgPT4gdW5kZXJseWluZ1NpbmsuY2xvc2UhKCk7XG4gIH0gZWxzZSB7XG4gICAgY2xvc2VBbGdvcml0aG0gPSAoKSA9PiBwcm9taXNlUmVzb2x2ZWRXaXRoKHVuZGVmaW5lZCk7XG4gIH1cbiAgaWYgKHVuZGVybHlpbmdTaW5rLmFib3J0ICE9PSB1bmRlZmluZWQpIHtcbiAgICBhYm9ydEFsZ29yaXRobSA9IHJlYXNvbiA9PiB1bmRlcmx5aW5nU2luay5hYm9ydCEocmVhc29uKTtcbiAgfSBlbHNlIHtcbiAgICBhYm9ydEFsZ29yaXRobSA9ICgpID0+IHByb21pc2VSZXNvbHZlZFdpdGgodW5kZWZpbmVkKTtcbiAgfVxuXG4gIFNldFVwV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcihcbiAgICBzdHJlYW0sIGNvbnRyb2xsZXIsIHN0YXJ0QWxnb3JpdGhtLCB3cml0ZUFsZ29yaXRobSwgY2xvc2VBbGdvcml0aG0sIGFib3J0QWxnb3JpdGhtLCBoaWdoV2F0ZXJNYXJrLCBzaXplQWxnb3JpdGhtXG4gICk7XG59XG5cbi8vIENsZWFyQWxnb3JpdGhtcyBtYXkgYmUgY2FsbGVkIHR3aWNlLiBFcnJvcmluZyB0aGUgc2FtZSBzdHJlYW0gaW4gbXVsdGlwbGUgd2F5cyB3aWxsIG9mdGVuIHJlc3VsdCBpbiByZWR1bmRhbnQgY2FsbHMuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2xlYXJBbGdvcml0aG1zKGNvbnRyb2xsZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8YW55Pikge1xuICBjb250cm9sbGVyLl93cml0ZUFsZ29yaXRobSA9IHVuZGVmaW5lZCE7XG4gIGNvbnRyb2xsZXIuX2Nsb3NlQWxnb3JpdGhtID0gdW5kZWZpbmVkITtcbiAgY29udHJvbGxlci5fYWJvcnRBbGdvcml0aG0gPSB1bmRlZmluZWQhO1xuICBjb250cm9sbGVyLl9zdHJhdGVneVNpemVBbGdvcml0aG0gPSB1bmRlZmluZWQhO1xufVxuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2xvc2U8Vz4oY29udHJvbGxlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxXPikge1xuICBFbnF1ZXVlVmFsdWVXaXRoU2l6ZShjb250cm9sbGVyLCBjbG9zZVNlbnRpbmVsLCAwKTtcbiAgV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckFkdmFuY2VRdWV1ZUlmTmVlZGVkKGNvbnRyb2xsZXIpO1xufVxuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyR2V0Q2h1bmtTaXplPFc+KGNvbnRyb2xsZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8Vz4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNodW5rOiBXKTogbnVtYmVyIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gY29udHJvbGxlci5fc3RyYXRlZ3lTaXplQWxnb3JpdGhtKGNodW5rKTtcbiAgfSBjYXRjaCAoY2h1bmtTaXplRSkge1xuICAgIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFcnJvcklmTmVlZGVkKGNvbnRyb2xsZXIsIGNodW5rU2l6ZUUpO1xuICAgIHJldHVybiAxO1xuICB9XG59XG5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJHZXREZXNpcmVkU2l6ZShjb250cm9sbGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyPGFueT4pOiBudW1iZXIge1xuICByZXR1cm4gY29udHJvbGxlci5fc3RyYXRlZ3lIV00gLSBjb250cm9sbGVyLl9xdWV1ZVRvdGFsU2l6ZTtcbn1cblxuZnVuY3Rpb24gV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcldyaXRlPFc+KGNvbnRyb2xsZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8Vz4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2h1bms6IFcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2h1bmtTaXplOiBudW1iZXIpIHtcbiAgdHJ5IHtcbiAgICBFbnF1ZXVlVmFsdWVXaXRoU2l6ZShjb250cm9sbGVyLCBjaHVuaywgY2h1bmtTaXplKTtcbiAgfSBjYXRjaCAoZW5xdWV1ZUUpIHtcbiAgICBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRXJyb3JJZk5lZWRlZChjb250cm9sbGVyLCBlbnF1ZXVlRSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3Qgc3RyZWFtID0gY29udHJvbGxlci5fY29udHJvbGxlZFdyaXRhYmxlU3RyZWFtO1xuICBpZiAoIVdyaXRhYmxlU3RyZWFtQ2xvc2VRdWV1ZWRPckluRmxpZ2h0KHN0cmVhbSkgJiYgc3RyZWFtLl9zdGF0ZSA9PT0gJ3dyaXRhYmxlJykge1xuICAgIGNvbnN0IGJhY2twcmVzc3VyZSA9IFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJHZXRCYWNrcHJlc3N1cmUoY29udHJvbGxlcik7XG4gICAgV3JpdGFibGVTdHJlYW1VcGRhdGVCYWNrcHJlc3N1cmUoc3RyZWFtLCBiYWNrcHJlc3N1cmUpO1xuICB9XG5cbiAgV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckFkdmFuY2VRdWV1ZUlmTmVlZGVkKGNvbnRyb2xsZXIpO1xufVxuXG4vLyBBYnN0cmFjdCBvcGVyYXRpb25zIGZvciB0aGUgV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlci5cblxuZnVuY3Rpb24gV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckFkdmFuY2VRdWV1ZUlmTmVlZGVkPFc+KGNvbnRyb2xsZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8Vz4pIHtcbiAgY29uc3Qgc3RyZWFtID0gY29udHJvbGxlci5fY29udHJvbGxlZFdyaXRhYmxlU3RyZWFtO1xuXG4gIGlmICghY29udHJvbGxlci5fc3RhcnRlZCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChzdHJlYW0uX2luRmxpZ2h0V3JpdGVSZXF1ZXN0ICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBzdGF0ZSA9IHN0cmVhbS5fc3RhdGU7XG4gIGFzc2VydChzdGF0ZSAhPT0gJ2Nsb3NlZCcgJiYgc3RhdGUgIT09ICdlcnJvcmVkJyk7XG4gIGlmIChzdGF0ZSA9PT0gJ2Vycm9yaW5nJykge1xuICAgIFdyaXRhYmxlU3RyZWFtRmluaXNoRXJyb3Jpbmcoc3RyZWFtKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoY29udHJvbGxlci5fcXVldWUubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgdmFsdWUgPSBQZWVrUXVldWVWYWx1ZShjb250cm9sbGVyKTtcbiAgaWYgKHZhbHVlID09PSBjbG9zZVNlbnRpbmVsKSB7XG4gICAgV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlclByb2Nlc3NDbG9zZShjb250cm9sbGVyKTtcbiAgfSBlbHNlIHtcbiAgICBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyUHJvY2Vzc1dyaXRlKGNvbnRyb2xsZXIsIHZhbHVlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRXJyb3JJZk5lZWRlZChjb250cm9sbGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyPGFueT4sIGVycm9yOiBhbnkpIHtcbiAgaWYgKGNvbnRyb2xsZXIuX2NvbnRyb2xsZWRXcml0YWJsZVN0cmVhbS5fc3RhdGUgPT09ICd3cml0YWJsZScpIHtcbiAgICBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRXJyb3IoY29udHJvbGxlciwgZXJyb3IpO1xuICB9XG59XG5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJQcm9jZXNzQ2xvc2UoY29udHJvbGxlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxhbnk+KSB7XG4gIGNvbnN0IHN0cmVhbSA9IGNvbnRyb2xsZXIuX2NvbnRyb2xsZWRXcml0YWJsZVN0cmVhbTtcblxuICBXcml0YWJsZVN0cmVhbU1hcmtDbG9zZVJlcXVlc3RJbkZsaWdodChzdHJlYW0pO1xuXG4gIERlcXVldWVWYWx1ZShjb250cm9sbGVyKTtcbiAgYXNzZXJ0KGNvbnRyb2xsZXIuX3F1ZXVlLmxlbmd0aCA9PT0gMCk7XG5cbiAgY29uc3Qgc2lua0Nsb3NlUHJvbWlzZSA9IGNvbnRyb2xsZXIuX2Nsb3NlQWxnb3JpdGhtKCk7XG4gIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDbGVhckFsZ29yaXRobXMoY29udHJvbGxlcik7XG4gIHVwb25Qcm9taXNlKFxuICAgIHNpbmtDbG9zZVByb21pc2UsXG4gICAgKCkgPT4ge1xuICAgICAgV3JpdGFibGVTdHJlYW1GaW5pc2hJbkZsaWdodENsb3NlKHN0cmVhbSk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIHJlYXNvbiA9PiB7XG4gICAgICBXcml0YWJsZVN0cmVhbUZpbmlzaEluRmxpZ2h0Q2xvc2VXaXRoRXJyb3Ioc3RyZWFtLCByZWFzb24pO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICApO1xufVxuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyUHJvY2Vzc1dyaXRlPFc+KGNvbnRyb2xsZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8Vz4sIGNodW5rOiBXKSB7XG4gIGNvbnN0IHN0cmVhbSA9IGNvbnRyb2xsZXIuX2NvbnRyb2xsZWRXcml0YWJsZVN0cmVhbTtcblxuICBXcml0YWJsZVN0cmVhbU1hcmtGaXJzdFdyaXRlUmVxdWVzdEluRmxpZ2h0KHN0cmVhbSk7XG5cbiAgY29uc3Qgc2lua1dyaXRlUHJvbWlzZSA9IGNvbnRyb2xsZXIuX3dyaXRlQWxnb3JpdGhtKGNodW5rKTtcbiAgdXBvblByb21pc2UoXG4gICAgc2lua1dyaXRlUHJvbWlzZSxcbiAgICAoKSA9PiB7XG4gICAgICBXcml0YWJsZVN0cmVhbUZpbmlzaEluRmxpZ2h0V3JpdGUoc3RyZWFtKTtcblxuICAgICAgY29uc3Qgc3RhdGUgPSBzdHJlYW0uX3N0YXRlO1xuICAgICAgYXNzZXJ0KHN0YXRlID09PSAnd3JpdGFibGUnIHx8IHN0YXRlID09PSAnZXJyb3JpbmcnKTtcblxuICAgICAgRGVxdWV1ZVZhbHVlKGNvbnRyb2xsZXIpO1xuXG4gICAgICBpZiAoIVdyaXRhYmxlU3RyZWFtQ2xvc2VRdWV1ZWRPckluRmxpZ2h0KHN0cmVhbSkgJiYgc3RhdGUgPT09ICd3cml0YWJsZScpIHtcbiAgICAgICAgY29uc3QgYmFja3ByZXNzdXJlID0gV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckdldEJhY2twcmVzc3VyZShjb250cm9sbGVyKTtcbiAgICAgICAgV3JpdGFibGVTdHJlYW1VcGRhdGVCYWNrcHJlc3N1cmUoc3RyZWFtLCBiYWNrcHJlc3N1cmUpO1xuICAgICAgfVxuXG4gICAgICBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQWR2YW5jZVF1ZXVlSWZOZWVkZWQoY29udHJvbGxlcik7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIHJlYXNvbiA9PiB7XG4gICAgICBpZiAoc3RyZWFtLl9zdGF0ZSA9PT0gJ3dyaXRhYmxlJykge1xuICAgICAgICBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2xlYXJBbGdvcml0aG1zKGNvbnRyb2xsZXIpO1xuICAgICAgfVxuICAgICAgV3JpdGFibGVTdHJlYW1GaW5pc2hJbkZsaWdodFdyaXRlV2l0aEVycm9yKHN0cmVhbSwgcmVhc29uKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgKTtcbn1cblxuZnVuY3Rpb24gV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckdldEJhY2twcmVzc3VyZShjb250cm9sbGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyPGFueT4pOiBib29sZWFuIHtcbiAgY29uc3QgZGVzaXJlZFNpemUgPSBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyR2V0RGVzaXJlZFNpemUoY29udHJvbGxlcik7XG4gIHJldHVybiBkZXNpcmVkU2l6ZSA8PSAwO1xufVxuXG4vLyBBIGNsaWVudCBvZiBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyIG1heSB1c2UgdGhlc2UgZnVuY3Rpb25zIGRpcmVjdGx5IHRvIGJ5cGFzcyBzdGF0ZSBjaGVjay5cblxuZnVuY3Rpb24gV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVycm9yKGNvbnRyb2xsZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8YW55PiwgZXJyb3I6IGFueSkge1xuICBjb25zdCBzdHJlYW0gPSBjb250cm9sbGVyLl9jb250cm9sbGVkV3JpdGFibGVTdHJlYW07XG5cbiAgYXNzZXJ0KHN0cmVhbS5fc3RhdGUgPT09ICd3cml0YWJsZScpO1xuXG4gIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDbGVhckFsZ29yaXRobXMoY29udHJvbGxlcik7XG4gIFdyaXRhYmxlU3RyZWFtU3RhcnRFcnJvcmluZyhzdHJlYW0sIGVycm9yKTtcbn1cblxuLy8gSGVscGVyIGZ1bmN0aW9ucyBmb3IgdGhlIFdyaXRhYmxlU3RyZWFtLlxuXG5mdW5jdGlvbiBzdHJlYW1CcmFuZENoZWNrRXhjZXB0aW9uKG5hbWU6IHN0cmluZyk6IFR5cGVFcnJvciB7XG4gIHJldHVybiBuZXcgVHlwZUVycm9yKGBXcml0YWJsZVN0cmVhbS5wcm90b3R5cGUuJHtuYW1lfSBjYW4gb25seSBiZSB1c2VkIG9uIGEgV3JpdGFibGVTdHJlYW1gKTtcbn1cblxuLy8gSGVscGVyIGZ1bmN0aW9ucyBmb3IgdGhlIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIuXG5cbmZ1bmN0aW9uIGRlZmF1bHRDb250cm9sbGVyQnJhbmRDaGVja0V4Y2VwdGlvbihuYW1lOiBzdHJpbmcpOiBUeXBlRXJyb3Ige1xuICByZXR1cm4gbmV3IFR5cGVFcnJvcihcbiAgICBgV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlci5wcm90b3R5cGUuJHtuYW1lfSBjYW4gb25seSBiZSB1c2VkIG9uIGEgV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcmApO1xufVxuXG5cbi8vIEhlbHBlciBmdW5jdGlvbnMgZm9yIHRoZSBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIuXG5cbmZ1bmN0aW9uIGRlZmF1bHRXcml0ZXJCcmFuZENoZWNrRXhjZXB0aW9uKG5hbWU6IHN0cmluZyk6IFR5cGVFcnJvciB7XG4gIHJldHVybiBuZXcgVHlwZUVycm9yKFxuICAgIGBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIucHJvdG90eXBlLiR7bmFtZX0gY2FuIG9ubHkgYmUgdXNlZCBvbiBhIFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcmApO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0V3JpdGVyTG9ja0V4Y2VwdGlvbihuYW1lOiBzdHJpbmcpOiBUeXBlRXJyb3Ige1xuICByZXR1cm4gbmV3IFR5cGVFcnJvcignQ2Fubm90ICcgKyBuYW1lICsgJyBhIHN0cmVhbSB1c2luZyBhIHJlbGVhc2VkIHdyaXRlcicpO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0V3JpdGVyQ2xvc2VkUHJvbWlzZUluaXRpYWxpemUod3JpdGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIpIHtcbiAgd3JpdGVyLl9jbG9zZWRQcm9taXNlID0gbmV3UHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgd3JpdGVyLl9jbG9zZWRQcm9taXNlX3Jlc29sdmUgPSByZXNvbHZlO1xuICAgIHdyaXRlci5fY2xvc2VkUHJvbWlzZV9yZWplY3QgPSByZWplY3Q7XG4gICAgd3JpdGVyLl9jbG9zZWRQcm9taXNlU3RhdGUgPSAncGVuZGluZyc7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0V3JpdGVyQ2xvc2VkUHJvbWlzZUluaXRpYWxpemVBc1JlamVjdGVkKHdyaXRlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyLCByZWFzb246IGFueSkge1xuICBkZWZhdWx0V3JpdGVyQ2xvc2VkUHJvbWlzZUluaXRpYWxpemUod3JpdGVyKTtcbiAgZGVmYXVsdFdyaXRlckNsb3NlZFByb21pc2VSZWplY3Qod3JpdGVyLCByZWFzb24pO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0V3JpdGVyQ2xvc2VkUHJvbWlzZUluaXRpYWxpemVBc1Jlc29sdmVkKHdyaXRlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyKSB7XG4gIGRlZmF1bHRXcml0ZXJDbG9zZWRQcm9taXNlSW5pdGlhbGl6ZSh3cml0ZXIpO1xuICBkZWZhdWx0V3JpdGVyQ2xvc2VkUHJvbWlzZVJlc29sdmUod3JpdGVyKTtcbn1cblxuZnVuY3Rpb24gZGVmYXVsdFdyaXRlckNsb3NlZFByb21pc2VSZWplY3Qod3JpdGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIsIHJlYXNvbjogYW55KSB7XG4gIGlmICh3cml0ZXIuX2Nsb3NlZFByb21pc2VfcmVqZWN0ID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgYXNzZXJ0KHdyaXRlci5fY2xvc2VkUHJvbWlzZVN0YXRlID09PSAncGVuZGluZycpO1xuXG4gIHNldFByb21pc2VJc0hhbmRsZWRUb1RydWUod3JpdGVyLl9jbG9zZWRQcm9taXNlKTtcbiAgd3JpdGVyLl9jbG9zZWRQcm9taXNlX3JlamVjdChyZWFzb24pO1xuICB3cml0ZXIuX2Nsb3NlZFByb21pc2VfcmVzb2x2ZSA9IHVuZGVmaW5lZDtcbiAgd3JpdGVyLl9jbG9zZWRQcm9taXNlX3JlamVjdCA9IHVuZGVmaW5lZDtcbiAgd3JpdGVyLl9jbG9zZWRQcm9taXNlU3RhdGUgPSAncmVqZWN0ZWQnO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0V3JpdGVyQ2xvc2VkUHJvbWlzZVJlc2V0VG9SZWplY3RlZCh3cml0ZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlciwgcmVhc29uOiBhbnkpIHtcbiAgYXNzZXJ0KHdyaXRlci5fY2xvc2VkUHJvbWlzZV9yZXNvbHZlID09PSB1bmRlZmluZWQpO1xuICBhc3NlcnQod3JpdGVyLl9jbG9zZWRQcm9taXNlX3JlamVjdCA9PT0gdW5kZWZpbmVkKTtcbiAgYXNzZXJ0KHdyaXRlci5fY2xvc2VkUHJvbWlzZVN0YXRlICE9PSAncGVuZGluZycpO1xuXG4gIGRlZmF1bHRXcml0ZXJDbG9zZWRQcm9taXNlSW5pdGlhbGl6ZUFzUmVqZWN0ZWQod3JpdGVyLCByZWFzb24pO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0V3JpdGVyQ2xvc2VkUHJvbWlzZVJlc29sdmUod3JpdGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIpIHtcbiAgaWYgKHdyaXRlci5fY2xvc2VkUHJvbWlzZV9yZXNvbHZlID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgYXNzZXJ0KHdyaXRlci5fY2xvc2VkUHJvbWlzZVN0YXRlID09PSAncGVuZGluZycpO1xuXG4gIHdyaXRlci5fY2xvc2VkUHJvbWlzZV9yZXNvbHZlKHVuZGVmaW5lZCk7XG4gIHdyaXRlci5fY2xvc2VkUHJvbWlzZV9yZXNvbHZlID0gdW5kZWZpbmVkO1xuICB3cml0ZXIuX2Nsb3NlZFByb21pc2VfcmVqZWN0ID0gdW5kZWZpbmVkO1xuICB3cml0ZXIuX2Nsb3NlZFByb21pc2VTdGF0ZSA9ICdyZXNvbHZlZCc7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRXcml0ZXJSZWFkeVByb21pc2VJbml0aWFsaXplKHdyaXRlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyKSB7XG4gIHdyaXRlci5fcmVhZHlQcm9taXNlID0gbmV3UHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgd3JpdGVyLl9yZWFkeVByb21pc2VfcmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgd3JpdGVyLl9yZWFkeVByb21pc2VfcmVqZWN0ID0gcmVqZWN0O1xuICB9KTtcbiAgd3JpdGVyLl9yZWFkeVByb21pc2VTdGF0ZSA9ICdwZW5kaW5nJztcbn1cblxuZnVuY3Rpb24gZGVmYXVsdFdyaXRlclJlYWR5UHJvbWlzZUluaXRpYWxpemVBc1JlamVjdGVkKHdyaXRlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyLCByZWFzb246IGFueSkge1xuICBkZWZhdWx0V3JpdGVyUmVhZHlQcm9taXNlSW5pdGlhbGl6ZSh3cml0ZXIpO1xuICBkZWZhdWx0V3JpdGVyUmVhZHlQcm9taXNlUmVqZWN0KHdyaXRlciwgcmVhc29uKTtcbn1cblxuZnVuY3Rpb24gZGVmYXVsdFdyaXRlclJlYWR5UHJvbWlzZUluaXRpYWxpemVBc1Jlc29sdmVkKHdyaXRlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyKSB7XG4gIGRlZmF1bHRXcml0ZXJSZWFkeVByb21pc2VJbml0aWFsaXplKHdyaXRlcik7XG4gIGRlZmF1bHRXcml0ZXJSZWFkeVByb21pc2VSZXNvbHZlKHdyaXRlcik7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRXcml0ZXJSZWFkeVByb21pc2VSZWplY3Qod3JpdGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIsIHJlYXNvbjogYW55KSB7XG4gIGlmICh3cml0ZXIuX3JlYWR5UHJvbWlzZV9yZWplY3QgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHNldFByb21pc2VJc0hhbmRsZWRUb1RydWUod3JpdGVyLl9yZWFkeVByb21pc2UpO1xuICB3cml0ZXIuX3JlYWR5UHJvbWlzZV9yZWplY3QocmVhc29uKTtcbiAgd3JpdGVyLl9yZWFkeVByb21pc2VfcmVzb2x2ZSA9IHVuZGVmaW5lZDtcbiAgd3JpdGVyLl9yZWFkeVByb21pc2VfcmVqZWN0ID0gdW5kZWZpbmVkO1xuICB3cml0ZXIuX3JlYWR5UHJvbWlzZVN0YXRlID0gJ3JlamVjdGVkJztcbn1cblxuZnVuY3Rpb24gZGVmYXVsdFdyaXRlclJlYWR5UHJvbWlzZVJlc2V0KHdyaXRlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyKSB7XG4gIGFzc2VydCh3cml0ZXIuX3JlYWR5UHJvbWlzZV9yZXNvbHZlID09PSB1bmRlZmluZWQpO1xuICBhc3NlcnQod3JpdGVyLl9yZWFkeVByb21pc2VfcmVqZWN0ID09PSB1bmRlZmluZWQpO1xuXG4gIGRlZmF1bHRXcml0ZXJSZWFkeVByb21pc2VJbml0aWFsaXplKHdyaXRlcik7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRXcml0ZXJSZWFkeVByb21pc2VSZXNldFRvUmVqZWN0ZWQod3JpdGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIsIHJlYXNvbjogYW55KSB7XG4gIGFzc2VydCh3cml0ZXIuX3JlYWR5UHJvbWlzZV9yZXNvbHZlID09PSB1bmRlZmluZWQpO1xuICBhc3NlcnQod3JpdGVyLl9yZWFkeVByb21pc2VfcmVqZWN0ID09PSB1bmRlZmluZWQpO1xuXG4gIGRlZmF1bHRXcml0ZXJSZWFkeVByb21pc2VJbml0aWFsaXplQXNSZWplY3RlZCh3cml0ZXIsIHJlYXNvbik7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRXcml0ZXJSZWFkeVByb21pc2VSZXNvbHZlKHdyaXRlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyKSB7XG4gIGlmICh3cml0ZXIuX3JlYWR5UHJvbWlzZV9yZXNvbHZlID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB3cml0ZXIuX3JlYWR5UHJvbWlzZV9yZXNvbHZlKHVuZGVmaW5lZCk7XG4gIHdyaXRlci5fcmVhZHlQcm9taXNlX3Jlc29sdmUgPSB1bmRlZmluZWQ7XG4gIHdyaXRlci5fcmVhZHlQcm9taXNlX3JlamVjdCA9IHVuZGVmaW5lZDtcbiAgd3JpdGVyLl9yZWFkeVByb21pc2VTdGF0ZSA9ICdmdWxmaWxsZWQnO1xufVxuIiwgIi8vLyA8cmVmZXJlbmNlIGxpYj1cImRvbVwiIC8+XG5cbmZ1bmN0aW9uIGdldEdsb2JhbHMoKTogdHlwZW9mIGdsb2JhbFRoaXMgfCB1bmRlZmluZWQge1xuICBpZiAodHlwZW9mIGdsb2JhbFRoaXMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIGdsb2JhbFRoaXM7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIHNlbGY7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gZ2xvYmFsO1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBjb25zdCBnbG9iYWxzID0gZ2V0R2xvYmFscygpO1xuIiwgIi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwibm9kZVwiIC8+XG5pbXBvcnQgeyBnbG9iYWxzIH0gZnJvbSAnLi4vZ2xvYmFscyc7XG5pbXBvcnQgeyBzZXRGdW5jdGlvbk5hbWUgfSBmcm9tICcuLi9saWIvaGVscGVycy9taXNjZWxsYW5lb3VzJztcblxuaW50ZXJmYWNlIERPTUV4Y2VwdGlvbiBleHRlbmRzIEVycm9yIHtcbiAgbmFtZTogc3RyaW5nO1xuICBtZXNzYWdlOiBzdHJpbmc7XG59XG5cbnR5cGUgRE9NRXhjZXB0aW9uQ29uc3RydWN0b3IgPSBuZXcgKG1lc3NhZ2U/OiBzdHJpbmcsIG5hbWU/OiBzdHJpbmcpID0+IERPTUV4Y2VwdGlvbjtcblxuZnVuY3Rpb24gaXNET01FeGNlcHRpb25Db25zdHJ1Y3RvcihjdG9yOiB1bmtub3duKTogY3RvciBpcyBET01FeGNlcHRpb25Db25zdHJ1Y3RvciB7XG4gIGlmICghKHR5cGVvZiBjdG9yID09PSAnZnVuY3Rpb24nIHx8IHR5cGVvZiBjdG9yID09PSAnb2JqZWN0JykpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKChjdG9yIGFzIERPTUV4Y2VwdGlvbkNvbnN0cnVjdG9yKS5uYW1lICE9PSAnRE9NRXhjZXB0aW9uJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB0cnkge1xuICAgIG5ldyAoY3RvciBhcyBET01FeGNlcHRpb25Db25zdHJ1Y3RvcikoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbi8qKlxuICogU3VwcG9ydDpcbiAqIC0gV2ViIGJyb3dzZXJzXG4gKiAtIE5vZGUgMTggYW5kIGhpZ2hlciAoaHR0cHM6Ly9naXRodWIuY29tL25vZGVqcy9ub2RlL2NvbW1pdC9lNGIxZmI1ZTY0MjJjMWZmMTUxMjM0YmI5ZGU3OTJkNDVkZDg4ZDg3KVxuICovXG5mdW5jdGlvbiBnZXRGcm9tR2xvYmFsKCk6IERPTUV4Y2VwdGlvbkNvbnN0cnVjdG9yIHwgdW5kZWZpbmVkIHtcbiAgY29uc3QgY3RvciA9IGdsb2JhbHM/LkRPTUV4Y2VwdGlvbjtcbiAgcmV0dXJuIGlzRE9NRXhjZXB0aW9uQ29uc3RydWN0b3IoY3RvcikgPyBjdG9yIDogdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIFN1cHBvcnQ6XG4gKiAtIEFsbCBwbGF0Zm9ybXNcbiAqL1xuZnVuY3Rpb24gY3JlYXRlUG9seWZpbGwoKTogRE9NRXhjZXB0aW9uQ29uc3RydWN0b3Ige1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXNoYWRvd1xuICBjb25zdCBjdG9yID0gZnVuY3Rpb24gRE9NRXhjZXB0aW9uKHRoaXM6IERPTUV4Y2VwdGlvbiwgbWVzc2FnZT86IHN0cmluZywgbmFtZT86IHN0cmluZykge1xuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2UgfHwgJyc7XG4gICAgdGhpcy5uYW1lID0gbmFtZSB8fCAnRXJyb3InO1xuICAgIGlmIChFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSkge1xuICAgICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgdGhpcy5jb25zdHJ1Y3Rvcik7XG4gICAgfVxuICB9IGFzIGFueTtcbiAgc2V0RnVuY3Rpb25OYW1lKGN0b3IsICdET01FeGNlcHRpb24nKTtcbiAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSk7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjdG9yLnByb3RvdHlwZSwgJ2NvbnN0cnVjdG9yJywgeyB2YWx1ZTogY3Rvciwgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9KTtcbiAgcmV0dXJuIGN0b3I7XG59XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVkZWNsYXJlXG5jb25zdCBET01FeGNlcHRpb246IERPTUV4Y2VwdGlvbkNvbnN0cnVjdG9yID0gZ2V0RnJvbUdsb2JhbCgpIHx8IGNyZWF0ZVBvbHlmaWxsKCk7XG5cbmV4cG9ydCB7IERPTUV4Y2VwdGlvbiB9O1xuIiwgImltcG9ydCB7IElzUmVhZGFibGVTdHJlYW0sIElzUmVhZGFibGVTdHJlYW1Mb2NrZWQsIFJlYWRhYmxlU3RyZWFtLCBSZWFkYWJsZVN0cmVhbUNhbmNlbCB9IGZyb20gJy4uL3JlYWRhYmxlLXN0cmVhbSc7XG5pbXBvcnQgeyBBY3F1aXJlUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyLCBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXJSZWFkIH0gZnJvbSAnLi9kZWZhdWx0LXJlYWRlcic7XG5pbXBvcnQgeyBSZWFkYWJsZVN0cmVhbVJlYWRlckdlbmVyaWNSZWxlYXNlIH0gZnJvbSAnLi9nZW5lcmljLXJlYWRlcic7XG5pbXBvcnQge1xuICBBY3F1aXJlV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyLFxuICBJc1dyaXRhYmxlU3RyZWFtLFxuICBJc1dyaXRhYmxlU3RyZWFtTG9ja2VkLFxuICBXcml0YWJsZVN0cmVhbSxcbiAgV3JpdGFibGVTdHJlYW1BYm9ydCxcbiAgV3JpdGFibGVTdHJlYW1DbG9zZVF1ZXVlZE9ySW5GbGlnaHQsXG4gIFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlckNsb3NlV2l0aEVycm9yUHJvcGFnYXRpb24sXG4gIFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlclJlbGVhc2UsXG4gIFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcldyaXRlXG59IGZyb20gJy4uL3dyaXRhYmxlLXN0cmVhbSc7XG5pbXBvcnQgYXNzZXJ0IGZyb20gJy4uLy4uL3N0dWIvYXNzZXJ0JztcbmltcG9ydCB7XG4gIG5ld1Byb21pc2UsXG4gIFBlcmZvcm1Qcm9taXNlVGhlbixcbiAgcHJvbWlzZVJlc29sdmVkV2l0aCxcbiAgc2V0UHJvbWlzZUlzSGFuZGxlZFRvVHJ1ZSxcbiAgdXBvbkZ1bGZpbGxtZW50LFxuICB1cG9uUHJvbWlzZSxcbiAgdXBvblJlamVjdGlvblxufSBmcm9tICcuLi9oZWxwZXJzL3dlYmlkbCc7XG5pbXBvcnQgeyBub29wIH0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuaW1wb3J0IHsgdHlwZSBBYm9ydFNpZ25hbCwgaXNBYm9ydFNpZ25hbCB9IGZyb20gJy4uL2Fib3J0LXNpZ25hbCc7XG5pbXBvcnQgeyBET01FeGNlcHRpb24gfSBmcm9tICcuLi8uLi9zdHViL2RvbS1leGNlcHRpb24nO1xuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1QaXBlVG88VD4oc291cmNlOiBSZWFkYWJsZVN0cmVhbTxUPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXN0OiBXcml0YWJsZVN0cmVhbTxUPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2ZW50Q2xvc2U6IGJvb2xlYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldmVudEFib3J0OiBib29sZWFuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXZlbnRDYW5jZWw6IGJvb2xlYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2lnbmFsOiBBYm9ydFNpZ25hbCB8IHVuZGVmaW5lZCk6IFByb21pc2U8dW5kZWZpbmVkPiB7XG4gIGFzc2VydChJc1JlYWRhYmxlU3RyZWFtKHNvdXJjZSkpO1xuICBhc3NlcnQoSXNXcml0YWJsZVN0cmVhbShkZXN0KSk7XG4gIGFzc2VydCh0eXBlb2YgcHJldmVudENsb3NlID09PSAnYm9vbGVhbicpO1xuICBhc3NlcnQodHlwZW9mIHByZXZlbnRBYm9ydCA9PT0gJ2Jvb2xlYW4nKTtcbiAgYXNzZXJ0KHR5cGVvZiBwcmV2ZW50Q2FuY2VsID09PSAnYm9vbGVhbicpO1xuICBhc3NlcnQoc2lnbmFsID09PSB1bmRlZmluZWQgfHwgaXNBYm9ydFNpZ25hbChzaWduYWwpKTtcbiAgYXNzZXJ0KCFJc1JlYWRhYmxlU3RyZWFtTG9ja2VkKHNvdXJjZSkpO1xuICBhc3NlcnQoIUlzV3JpdGFibGVTdHJlYW1Mb2NrZWQoZGVzdCkpO1xuXG4gIGNvbnN0IHJlYWRlciA9IEFjcXVpcmVSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXI8VD4oc291cmNlKTtcbiAgY29uc3Qgd3JpdGVyID0gQWNxdWlyZVdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcjxUPihkZXN0KTtcblxuICBzb3VyY2UuX2Rpc3R1cmJlZCA9IHRydWU7XG5cbiAgbGV0IHNodXR0aW5nRG93biA9IGZhbHNlO1xuXG4gIC8vIFRoaXMgaXMgdXNlZCB0byBrZWVwIHRyYWNrIG9mIHRoZSBzcGVjJ3MgcmVxdWlyZW1lbnQgdGhhdCB3ZSB3YWl0IGZvciBvbmdvaW5nIHdyaXRlcyBkdXJpbmcgc2h1dGRvd24uXG4gIGxldCBjdXJyZW50V3JpdGUgPSBwcm9taXNlUmVzb2x2ZWRXaXRoPHZvaWQ+KHVuZGVmaW5lZCk7XG5cbiAgcmV0dXJuIG5ld1Byb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGxldCBhYm9ydEFsZ29yaXRobTogKCkgPT4gdm9pZDtcbiAgICBpZiAoc2lnbmFsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGFib3J0QWxnb3JpdGhtID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBlcnJvciA9IHNpZ25hbC5yZWFzb24gIT09IHVuZGVmaW5lZCA/IHNpZ25hbC5yZWFzb24gOiBuZXcgRE9NRXhjZXB0aW9uKCdBYm9ydGVkJywgJ0Fib3J0RXJyb3InKTtcbiAgICAgICAgY29uc3QgYWN0aW9uczogQXJyYXk8KCkgPT4gUHJvbWlzZTx2b2lkPj4gPSBbXTtcbiAgICAgICAgaWYgKCFwcmV2ZW50QWJvcnQpIHtcbiAgICAgICAgICBhY3Rpb25zLnB1c2goKCkgPT4ge1xuICAgICAgICAgICAgaWYgKGRlc3QuX3N0YXRlID09PSAnd3JpdGFibGUnKSB7XG4gICAgICAgICAgICAgIHJldHVybiBXcml0YWJsZVN0cmVhbUFib3J0KGRlc3QsIGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlUmVzb2x2ZWRXaXRoKHVuZGVmaW5lZCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFwcmV2ZW50Q2FuY2VsKSB7XG4gICAgICAgICAgYWN0aW9ucy5wdXNoKCgpID0+IHtcbiAgICAgICAgICAgIGlmIChzb3VyY2UuX3N0YXRlID09PSAncmVhZGFibGUnKSB7XG4gICAgICAgICAgICAgIHJldHVybiBSZWFkYWJsZVN0cmVhbUNhbmNlbChzb3VyY2UsIGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlUmVzb2x2ZWRXaXRoKHVuZGVmaW5lZCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgc2h1dGRvd25XaXRoQWN0aW9uKCgpID0+IFByb21pc2UuYWxsKGFjdGlvbnMubWFwKGFjdGlvbiA9PiBhY3Rpb24oKSkpLCB0cnVlLCBlcnJvcik7XG4gICAgICB9O1xuXG4gICAgICBpZiAoc2lnbmFsLmFib3J0ZWQpIHtcbiAgICAgICAgYWJvcnRBbGdvcml0aG0oKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBzaWduYWwuYWRkRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBhYm9ydEFsZ29yaXRobSk7XG4gICAgfVxuXG4gICAgLy8gVXNpbmcgcmVhZGVyIGFuZCB3cml0ZXIsIHJlYWQgYWxsIGNodW5rcyBmcm9tIHRoaXMgYW5kIHdyaXRlIHRoZW0gdG8gZGVzdFxuICAgIC8vIC0gQmFja3ByZXNzdXJlIG11c3QgYmUgZW5mb3JjZWRcbiAgICAvLyAtIFNodXRkb3duIG11c3Qgc3RvcCBhbGwgYWN0aXZpdHlcbiAgICBmdW5jdGlvbiBwaXBlTG9vcCgpIHtcbiAgICAgIHJldHVybiBuZXdQcm9taXNlPHZvaWQ+KChyZXNvbHZlTG9vcCwgcmVqZWN0TG9vcCkgPT4ge1xuICAgICAgICBmdW5jdGlvbiBuZXh0KGRvbmU6IGJvb2xlYW4pIHtcbiAgICAgICAgICBpZiAoZG9uZSkge1xuICAgICAgICAgICAgcmVzb2x2ZUxvb3AoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gVXNlIGBQZXJmb3JtUHJvbWlzZVRoZW5gIGluc3RlYWQgb2YgYHVwb25Qcm9taXNlYCB0byBhdm9pZFxuICAgICAgICAgICAgLy8gYWRkaW5nIHVubmVjZXNzYXJ5IGAuY2F0Y2gocmV0aHJvd0Fzc2VydGlvbkVycm9yUmVqZWN0aW9uKWAgaGFuZGxlcnNcbiAgICAgICAgICAgIFBlcmZvcm1Qcm9taXNlVGhlbihwaXBlU3RlcCgpLCBuZXh0LCByZWplY3RMb29wKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBuZXh0KGZhbHNlKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBpcGVTdGVwKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgaWYgKHNodXR0aW5nRG93bikge1xuICAgICAgICByZXR1cm4gcHJvbWlzZVJlc29sdmVkV2l0aCh0cnVlKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIFBlcmZvcm1Qcm9taXNlVGhlbih3cml0ZXIuX3JlYWR5UHJvbWlzZSwgKCkgPT4ge1xuICAgICAgICByZXR1cm4gbmV3UHJvbWlzZTxib29sZWFuPigocmVzb2x2ZVJlYWQsIHJlamVjdFJlYWQpID0+IHtcbiAgICAgICAgICBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXJSZWFkKFxuICAgICAgICAgICAgcmVhZGVyLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBfY2h1bmtTdGVwczogY2h1bmsgPT4ge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRXcml0ZSA9IFBlcmZvcm1Qcm9taXNlVGhlbihXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXJXcml0ZSh3cml0ZXIsIGNodW5rKSwgdW5kZWZpbmVkLCBub29wKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlUmVhZChmYWxzZSk7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF9jbG9zZVN0ZXBzOiAoKSA9PiByZXNvbHZlUmVhZCh0cnVlKSxcbiAgICAgICAgICAgICAgX2Vycm9yU3RlcHM6IHJlamVjdFJlYWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEVycm9ycyBtdXN0IGJlIHByb3BhZ2F0ZWQgZm9yd2FyZFxuICAgIGlzT3JCZWNvbWVzRXJyb3JlZChzb3VyY2UsIHJlYWRlci5fY2xvc2VkUHJvbWlzZSwgc3RvcmVkRXJyb3IgPT4ge1xuICAgICAgaWYgKCFwcmV2ZW50QWJvcnQpIHtcbiAgICAgICAgc2h1dGRvd25XaXRoQWN0aW9uKCgpID0+IFdyaXRhYmxlU3RyZWFtQWJvcnQoZGVzdCwgc3RvcmVkRXJyb3IpLCB0cnVlLCBzdG9yZWRFcnJvcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzaHV0ZG93bih0cnVlLCBzdG9yZWRFcnJvcik7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9KTtcblxuICAgIC8vIEVycm9ycyBtdXN0IGJlIHByb3BhZ2F0ZWQgYmFja3dhcmRcbiAgICBpc09yQmVjb21lc0Vycm9yZWQoZGVzdCwgd3JpdGVyLl9jbG9zZWRQcm9taXNlLCBzdG9yZWRFcnJvciA9PiB7XG4gICAgICBpZiAoIXByZXZlbnRDYW5jZWwpIHtcbiAgICAgICAgc2h1dGRvd25XaXRoQWN0aW9uKCgpID0+IFJlYWRhYmxlU3RyZWFtQ2FuY2VsKHNvdXJjZSwgc3RvcmVkRXJyb3IpLCB0cnVlLCBzdG9yZWRFcnJvcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzaHV0ZG93bih0cnVlLCBzdG9yZWRFcnJvcik7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9KTtcblxuICAgIC8vIENsb3NpbmcgbXVzdCBiZSBwcm9wYWdhdGVkIGZvcndhcmRcbiAgICBpc09yQmVjb21lc0Nsb3NlZChzb3VyY2UsIHJlYWRlci5fY2xvc2VkUHJvbWlzZSwgKCkgPT4ge1xuICAgICAgaWYgKCFwcmV2ZW50Q2xvc2UpIHtcbiAgICAgICAgc2h1dGRvd25XaXRoQWN0aW9uKCgpID0+IFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlckNsb3NlV2l0aEVycm9yUHJvcGFnYXRpb24od3JpdGVyKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzaHV0ZG93bigpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSk7XG5cbiAgICAvLyBDbG9zaW5nIG11c3QgYmUgcHJvcGFnYXRlZCBiYWNrd2FyZFxuICAgIGlmIChXcml0YWJsZVN0cmVhbUNsb3NlUXVldWVkT3JJbkZsaWdodChkZXN0KSB8fCBkZXN0Ll9zdGF0ZSA9PT0gJ2Nsb3NlZCcpIHtcbiAgICAgIGNvbnN0IGRlc3RDbG9zZWQgPSBuZXcgVHlwZUVycm9yKCd0aGUgZGVzdGluYXRpb24gd3JpdGFibGUgc3RyZWFtIGNsb3NlZCBiZWZvcmUgYWxsIGRhdGEgY291bGQgYmUgcGlwZWQgdG8gaXQnKTtcblxuICAgICAgaWYgKCFwcmV2ZW50Q2FuY2VsKSB7XG4gICAgICAgIHNodXRkb3duV2l0aEFjdGlvbigoKSA9PiBSZWFkYWJsZVN0cmVhbUNhbmNlbChzb3VyY2UsIGRlc3RDbG9zZWQpLCB0cnVlLCBkZXN0Q2xvc2VkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNodXRkb3duKHRydWUsIGRlc3RDbG9zZWQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNldFByb21pc2VJc0hhbmRsZWRUb1RydWUocGlwZUxvb3AoKSk7XG5cbiAgICBmdW5jdGlvbiB3YWl0Rm9yV3JpdGVzVG9GaW5pc2goKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAvLyBBbm90aGVyIHdyaXRlIG1heSBoYXZlIHN0YXJ0ZWQgd2hpbGUgd2Ugd2VyZSB3YWl0aW5nIG9uIHRoaXMgY3VycmVudFdyaXRlLCBzbyB3ZSBoYXZlIHRvIGJlIHN1cmUgdG8gd2FpdFxuICAgICAgLy8gZm9yIHRoYXQgdG9vLlxuICAgICAgY29uc3Qgb2xkQ3VycmVudFdyaXRlID0gY3VycmVudFdyaXRlO1xuICAgICAgcmV0dXJuIFBlcmZvcm1Qcm9taXNlVGhlbihcbiAgICAgICAgY3VycmVudFdyaXRlLFxuICAgICAgICAoKSA9PiBvbGRDdXJyZW50V3JpdGUgIT09IGN1cnJlbnRXcml0ZSA/IHdhaXRGb3JXcml0ZXNUb0ZpbmlzaCgpIDogdW5kZWZpbmVkXG4gICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzT3JCZWNvbWVzRXJyb3JlZChzdHJlYW06IFJlYWRhYmxlU3RyZWFtIHwgV3JpdGFibGVTdHJlYW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2U6IFByb21pc2U8dm9pZD4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbjogKHJlYXNvbjogYW55KSA9PiBudWxsKSB7XG4gICAgICBpZiAoc3RyZWFtLl9zdGF0ZSA9PT0gJ2Vycm9yZWQnKSB7XG4gICAgICAgIGFjdGlvbihzdHJlYW0uX3N0b3JlZEVycm9yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHVwb25SZWplY3Rpb24ocHJvbWlzZSwgYWN0aW9uKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc09yQmVjb21lc0Nsb3NlZChzdHJlYW06IFJlYWRhYmxlU3RyZWFtIHwgV3JpdGFibGVTdHJlYW0sIHByb21pc2U6IFByb21pc2U8dm9pZD4sIGFjdGlvbjogKCkgPT4gbnVsbCkge1xuICAgICAgaWYgKHN0cmVhbS5fc3RhdGUgPT09ICdjbG9zZWQnKSB7XG4gICAgICAgIGFjdGlvbigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdXBvbkZ1bGZpbGxtZW50KHByb21pc2UsIGFjdGlvbik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2h1dGRvd25XaXRoQWN0aW9uKGFjdGlvbjogKCkgPT4gUHJvbWlzZTx1bmtub3duPiwgb3JpZ2luYWxJc0Vycm9yPzogYm9vbGVhbiwgb3JpZ2luYWxFcnJvcj86IGFueSkge1xuICAgICAgaWYgKHNodXR0aW5nRG93bikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBzaHV0dGluZ0Rvd24gPSB0cnVlO1xuXG4gICAgICBpZiAoZGVzdC5fc3RhdGUgPT09ICd3cml0YWJsZScgJiYgIVdyaXRhYmxlU3RyZWFtQ2xvc2VRdWV1ZWRPckluRmxpZ2h0KGRlc3QpKSB7XG4gICAgICAgIHVwb25GdWxmaWxsbWVudCh3YWl0Rm9yV3JpdGVzVG9GaW5pc2goKSwgZG9UaGVSZXN0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRvVGhlUmVzdCgpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBkb1RoZVJlc3QoKTogbnVsbCB7XG4gICAgICAgIHVwb25Qcm9taXNlKFxuICAgICAgICAgIGFjdGlvbigpLFxuICAgICAgICAgICgpID0+IGZpbmFsaXplKG9yaWdpbmFsSXNFcnJvciwgb3JpZ2luYWxFcnJvciksXG4gICAgICAgICAgbmV3RXJyb3IgPT4gZmluYWxpemUodHJ1ZSwgbmV3RXJyb3IpXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNodXRkb3duKGlzRXJyb3I/OiBib29sZWFuLCBlcnJvcj86IGFueSkge1xuICAgICAgaWYgKHNodXR0aW5nRG93bikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBzaHV0dGluZ0Rvd24gPSB0cnVlO1xuXG4gICAgICBpZiAoZGVzdC5fc3RhdGUgPT09ICd3cml0YWJsZScgJiYgIVdyaXRhYmxlU3RyZWFtQ2xvc2VRdWV1ZWRPckluRmxpZ2h0KGRlc3QpKSB7XG4gICAgICAgIHVwb25GdWxmaWxsbWVudCh3YWl0Rm9yV3JpdGVzVG9GaW5pc2goKSwgKCkgPT4gZmluYWxpemUoaXNFcnJvciwgZXJyb3IpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZpbmFsaXplKGlzRXJyb3IsIGVycm9yKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaW5hbGl6ZShpc0Vycm9yPzogYm9vbGVhbiwgZXJyb3I/OiBhbnkpOiBudWxsIHtcbiAgICAgIFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlclJlbGVhc2Uod3JpdGVyKTtcbiAgICAgIFJlYWRhYmxlU3RyZWFtUmVhZGVyR2VuZXJpY1JlbGVhc2UocmVhZGVyKTtcblxuICAgICAgaWYgKHNpZ25hbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHNpZ25hbC5yZW1vdmVFdmVudExpc3RlbmVyKCdhYm9ydCcsIGFib3J0QWxnb3JpdGhtKTtcbiAgICAgIH1cbiAgICAgIGlmIChpc0Vycm9yKSB7XG4gICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNvbHZlKHVuZGVmaW5lZCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfSk7XG59XG4iLCAiaW1wb3J0IHR5cGUgeyBRdWV1aW5nU3RyYXRlZ3lTaXplQ2FsbGJhY2sgfSBmcm9tICcuLi9xdWV1aW5nLXN0cmF0ZWd5JztcbmltcG9ydCBhc3NlcnQgZnJvbSAnLi4vLi4vc3R1Yi9hc3NlcnQnO1xuaW1wb3J0IHsgRGVxdWV1ZVZhbHVlLCBFbnF1ZXVlVmFsdWVXaXRoU2l6ZSwgdHlwZSBRdWV1ZVBhaXIsIFJlc2V0UXVldWUgfSBmcm9tICcuLi9hYnN0cmFjdC1vcHMvcXVldWUtd2l0aC1zaXplcyc7XG5pbXBvcnQge1xuICBSZWFkYWJsZVN0cmVhbUFkZFJlYWRSZXF1ZXN0LFxuICBSZWFkYWJsZVN0cmVhbUZ1bGZpbGxSZWFkUmVxdWVzdCxcbiAgUmVhZGFibGVTdHJlYW1HZXROdW1SZWFkUmVxdWVzdHMsXG4gIHR5cGUgUmVhZFJlcXVlc3Rcbn0gZnJvbSAnLi9kZWZhdWx0LXJlYWRlcic7XG5pbXBvcnQgeyBTaW1wbGVRdWV1ZSB9IGZyb20gJy4uL3NpbXBsZS1xdWV1ZSc7XG5pbXBvcnQgeyBJc1JlYWRhYmxlU3RyZWFtTG9ja2VkLCBSZWFkYWJsZVN0cmVhbSwgUmVhZGFibGVTdHJlYW1DbG9zZSwgUmVhZGFibGVTdHJlYW1FcnJvciB9IGZyb20gJy4uL3JlYWRhYmxlLXN0cmVhbSc7XG5pbXBvcnQgdHlwZSB7IFZhbGlkYXRlZFVuZGVybHlpbmdTb3VyY2UgfSBmcm9tICcuL3VuZGVybHlpbmctc291cmNlJztcbmltcG9ydCB7IHNldEZ1bmN0aW9uTmFtZSwgdHlwZUlzT2JqZWN0IH0gZnJvbSAnLi4vaGVscGVycy9taXNjZWxsYW5lb3VzJztcbmltcG9ydCB7IENhbmNlbFN0ZXBzLCBQdWxsU3RlcHMsIFJlbGVhc2VTdGVwcyB9IGZyb20gJy4uL2Fic3RyYWN0LW9wcy9pbnRlcm5hbC1tZXRob2RzJztcbmltcG9ydCB7IHByb21pc2VSZXNvbHZlZFdpdGgsIHVwb25Qcm9taXNlIH0gZnJvbSAnLi4vaGVscGVycy93ZWJpZGwnO1xuXG4vKipcbiAqIEFsbG93cyBjb250cm9sIG9mIGEge0BsaW5rIFJlYWRhYmxlU3RyZWFtIHwgcmVhZGFibGUgc3RyZWFtfSdzIHN0YXRlIGFuZCBpbnRlcm5hbCBxdWV1ZS5cbiAqXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjbGFzcyBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyPFI+IHtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfY29udHJvbGxlZFJlYWRhYmxlU3RyZWFtITogUmVhZGFibGVTdHJlYW08Uj47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3F1ZXVlITogU2ltcGxlUXVldWU8UXVldWVQYWlyPFI+PjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcXVldWVUb3RhbFNpemUhOiBudW1iZXI7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3N0YXJ0ZWQhOiBib29sZWFuO1xuICAvKiogQGludGVybmFsICovXG4gIF9jbG9zZVJlcXVlc3RlZCE6IGJvb2xlYW47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3B1bGxBZ2FpbiE6IGJvb2xlYW47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3B1bGxpbmcgITogYm9vbGVhbjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfc3RyYXRlZ3lTaXplQWxnb3JpdGhtITogUXVldWluZ1N0cmF0ZWd5U2l6ZUNhbGxiYWNrPFI+O1xuICAvKiogQGludGVybmFsICovXG4gIF9zdHJhdGVneUhXTSE6IG51bWJlcjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcHVsbEFsZ29yaXRobSE6ICgpID0+IFByb21pc2U8dm9pZD47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2NhbmNlbEFsZ29yaXRobSE6IChyZWFzb246IGFueSkgPT4gUHJvbWlzZTx2b2lkPjtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0lsbGVnYWwgY29uc3RydWN0b3InKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBkZXNpcmVkIHNpemUgdG8gZmlsbCB0aGUgY29udHJvbGxlZCBzdHJlYW0ncyBpbnRlcm5hbCBxdWV1ZS4gSXQgY2FuIGJlIG5lZ2F0aXZlLCBpZiB0aGUgcXVldWUgaXNcbiAgICogb3Zlci1mdWxsLiBBbiB1bmRlcmx5aW5nIHNvdXJjZSBvdWdodCB0byB1c2UgdGhpcyBpbmZvcm1hdGlvbiB0byBkZXRlcm1pbmUgd2hlbiBhbmQgaG93IHRvIGFwcGx5IGJhY2twcmVzc3VyZS5cbiAgICovXG4gIGdldCBkZXNpcmVkU2l6ZSgpOiBudW1iZXIgfCBudWxsIHtcbiAgICBpZiAoIUlzUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcih0aGlzKSkge1xuICAgICAgdGhyb3cgZGVmYXVsdENvbnRyb2xsZXJCcmFuZENoZWNrRXhjZXB0aW9uKCdkZXNpcmVkU2l6ZScpO1xuICAgIH1cblxuICAgIHJldHVybiBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyR2V0RGVzaXJlZFNpemUodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogQ2xvc2VzIHRoZSBjb250cm9sbGVkIHJlYWRhYmxlIHN0cmVhbS4gQ29uc3VtZXJzIHdpbGwgc3RpbGwgYmUgYWJsZSB0byByZWFkIGFueSBwcmV2aW91c2x5LWVucXVldWVkIGNodW5rcyBmcm9tXG4gICAqIHRoZSBzdHJlYW0sIGJ1dCBvbmNlIHRob3NlIGFyZSByZWFkLCB0aGUgc3RyZWFtIHdpbGwgYmVjb21lIGNsb3NlZC5cbiAgICovXG4gIGNsb3NlKCk6IHZvaWQge1xuICAgIGlmICghSXNSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyKHRoaXMpKSB7XG4gICAgICB0aHJvdyBkZWZhdWx0Q29udHJvbGxlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ2Nsb3NlJyk7XG4gICAgfVxuXG4gICAgaWYgKCFSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2FuQ2xvc2VPckVucXVldWUodGhpcykpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBzdHJlYW0gaXMgbm90IGluIGEgc3RhdGUgdGhhdCBwZXJtaXRzIGNsb3NlJyk7XG4gICAgfVxuXG4gICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNsb3NlKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEVucXVldWVzIHRoZSBnaXZlbiBjaHVuayBgY2h1bmtgIGluIHRoZSBjb250cm9sbGVkIHJlYWRhYmxlIHN0cmVhbS5cbiAgICovXG4gIGVucXVldWUoY2h1bms6IFIpOiB2b2lkO1xuICBlbnF1ZXVlKGNodW5rOiBSID0gdW5kZWZpbmVkISk6IHZvaWQge1xuICAgIGlmICghSXNSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyKHRoaXMpKSB7XG4gICAgICB0aHJvdyBkZWZhdWx0Q29udHJvbGxlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ2VucXVldWUnKTtcbiAgICB9XG5cbiAgICBpZiAoIVJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDYW5DbG9zZU9yRW5xdWV1ZSh0aGlzKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIHN0cmVhbSBpcyBub3QgaW4gYSBzdGF0ZSB0aGF0IHBlcm1pdHMgZW5xdWV1ZScpO1xuICAgIH1cblxuICAgIHJldHVybiBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRW5xdWV1ZSh0aGlzLCBjaHVuayk7XG4gIH1cblxuICAvKipcbiAgICogRXJyb3JzIHRoZSBjb250cm9sbGVkIHJlYWRhYmxlIHN0cmVhbSwgbWFraW5nIGFsbCBmdXR1cmUgaW50ZXJhY3Rpb25zIHdpdGggaXQgZmFpbCB3aXRoIHRoZSBnaXZlbiBlcnJvciBgZWAuXG4gICAqL1xuICBlcnJvcihlOiBhbnkgPSB1bmRlZmluZWQpOiB2b2lkIHtcbiAgICBpZiAoIUlzUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcih0aGlzKSkge1xuICAgICAgdGhyb3cgZGVmYXVsdENvbnRyb2xsZXJCcmFuZENoZWNrRXhjZXB0aW9uKCdlcnJvcicpO1xuICAgIH1cblxuICAgIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFcnJvcih0aGlzLCBlKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgW0NhbmNlbFN0ZXBzXShyZWFzb246IGFueSk6IFByb21pc2U8dm9pZD4ge1xuICAgIFJlc2V0UXVldWUodGhpcyk7XG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5fY2FuY2VsQWxnb3JpdGhtKHJlYXNvbik7XG4gICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNsZWFyQWxnb3JpdGhtcyh0aGlzKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBbUHVsbFN0ZXBzXShyZWFkUmVxdWVzdDogUmVhZFJlcXVlc3Q8Uj4pOiB2b2lkIHtcbiAgICBjb25zdCBzdHJlYW0gPSB0aGlzLl9jb250cm9sbGVkUmVhZGFibGVTdHJlYW07XG5cbiAgICBpZiAodGhpcy5fcXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgY2h1bmsgPSBEZXF1ZXVlVmFsdWUodGhpcyk7XG5cbiAgICAgIGlmICh0aGlzLl9jbG9zZVJlcXVlc3RlZCAmJiB0aGlzLl9xdWV1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNsZWFyQWxnb3JpdGhtcyh0aGlzKTtcbiAgICAgICAgUmVhZGFibGVTdHJlYW1DbG9zZShzdHJlYW0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNhbGxQdWxsSWZOZWVkZWQodGhpcyk7XG4gICAgICB9XG5cbiAgICAgIHJlYWRSZXF1ZXN0Ll9jaHVua1N0ZXBzKGNodW5rKTtcbiAgICB9IGVsc2Uge1xuICAgICAgUmVhZGFibGVTdHJlYW1BZGRSZWFkUmVxdWVzdChzdHJlYW0sIHJlYWRSZXF1ZXN0KTtcbiAgICAgIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDYWxsUHVsbElmTmVlZGVkKHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgW1JlbGVhc2VTdGVwc10oKTogdm9pZCB7XG4gICAgLy8gRG8gbm90aGluZy5cbiAgfVxufVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyhSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyLnByb3RvdHlwZSwge1xuICBjbG9zZTogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIGVucXVldWU6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICBlcnJvcjogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIGRlc2lyZWRTaXplOiB7IGVudW1lcmFibGU6IHRydWUgfVxufSk7XG5zZXRGdW5jdGlvbk5hbWUoUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlci5wcm90b3R5cGUuY2xvc2UsICdjbG9zZScpO1xuc2V0RnVuY3Rpb25OYW1lKFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIucHJvdG90eXBlLmVucXVldWUsICdlbnF1ZXVlJyk7XG5zZXRGdW5jdGlvbk5hbWUoUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlci5wcm90b3R5cGUuZXJyb3IsICdlcnJvcicpO1xuaWYgKHR5cGVvZiBTeW1ib2wudG9TdHJpbmdUYWcgPT09ICdzeW1ib2wnKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyLnByb3RvdHlwZSwgU3ltYm9sLnRvU3RyaW5nVGFnLCB7XG4gICAgdmFsdWU6ICdSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyJyxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG59XG5cbi8vIEFic3RyYWN0IG9wZXJhdGlvbnMgZm9yIHRoZSBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyLlxuXG5mdW5jdGlvbiBJc1JlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8UiA9IGFueT4oeDogYW55KTogeCBpcyBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyPFI+IHtcbiAgaWYgKCF0eXBlSXNPYmplY3QoeCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh4LCAnX2NvbnRyb2xsZWRSZWFkYWJsZVN0cmVhbScpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHggaW5zdGFuY2VvZiBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyO1xufVxuXG5mdW5jdGlvbiBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2FsbFB1bGxJZk5lZWRlZChjb250cm9sbGVyOiBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyPGFueT4pOiB2b2lkIHtcbiAgY29uc3Qgc2hvdWxkUHVsbCA9IFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJTaG91bGRDYWxsUHVsbChjb250cm9sbGVyKTtcbiAgaWYgKCFzaG91bGRQdWxsKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGNvbnRyb2xsZXIuX3B1bGxpbmcpIHtcbiAgICBjb250cm9sbGVyLl9wdWxsQWdhaW4gPSB0cnVlO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGFzc2VydCghY29udHJvbGxlci5fcHVsbEFnYWluKTtcblxuICBjb250cm9sbGVyLl9wdWxsaW5nID0gdHJ1ZTtcblxuICBjb25zdCBwdWxsUHJvbWlzZSA9IGNvbnRyb2xsZXIuX3B1bGxBbGdvcml0aG0oKTtcbiAgdXBvblByb21pc2UoXG4gICAgcHVsbFByb21pc2UsXG4gICAgKCkgPT4ge1xuICAgICAgY29udHJvbGxlci5fcHVsbGluZyA9IGZhbHNlO1xuXG4gICAgICBpZiAoY29udHJvbGxlci5fcHVsbEFnYWluKSB7XG4gICAgICAgIGNvbnRyb2xsZXIuX3B1bGxBZ2FpbiA9IGZhbHNlO1xuICAgICAgICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2FsbFB1bGxJZk5lZWRlZChjb250cm9sbGVyKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcbiAgICBlID0+IHtcbiAgICAgIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFcnJvcihjb250cm9sbGVyLCBlKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgKTtcbn1cblxuZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlclNob3VsZENhbGxQdWxsKGNvbnRyb2xsZXI6IFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8YW55Pik6IGJvb2xlYW4ge1xuICBjb25zdCBzdHJlYW0gPSBjb250cm9sbGVyLl9jb250cm9sbGVkUmVhZGFibGVTdHJlYW07XG5cbiAgaWYgKCFSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2FuQ2xvc2VPckVucXVldWUoY29udHJvbGxlcikpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoIWNvbnRyb2xsZXIuX3N0YXJ0ZWQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoSXNSZWFkYWJsZVN0cmVhbUxvY2tlZChzdHJlYW0pICYmIFJlYWRhYmxlU3RyZWFtR2V0TnVtUmVhZFJlcXVlc3RzKHN0cmVhbSkgPiAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBjb25zdCBkZXNpcmVkU2l6ZSA9IFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJHZXREZXNpcmVkU2l6ZShjb250cm9sbGVyKTtcbiAgYXNzZXJ0KGRlc2lyZWRTaXplICE9PSBudWxsKTtcbiAgaWYgKGRlc2lyZWRTaXplISA+IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNsZWFyQWxnb3JpdGhtcyhjb250cm9sbGVyOiBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyPGFueT4pIHtcbiAgY29udHJvbGxlci5fcHVsbEFsZ29yaXRobSA9IHVuZGVmaW5lZCE7XG4gIGNvbnRyb2xsZXIuX2NhbmNlbEFsZ29yaXRobSA9IHVuZGVmaW5lZCE7XG4gIGNvbnRyb2xsZXIuX3N0cmF0ZWd5U2l6ZUFsZ29yaXRobSA9IHVuZGVmaW5lZCE7XG59XG5cbi8vIEEgY2xpZW50IG9mIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIgbWF5IHVzZSB0aGVzZSBmdW5jdGlvbnMgZGlyZWN0bHkgdG8gYnlwYXNzIHN0YXRlIGNoZWNrLlxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNsb3NlKGNvbnRyb2xsZXI6IFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8YW55Pikge1xuICBpZiAoIVJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDYW5DbG9zZU9yRW5xdWV1ZShjb250cm9sbGVyKSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHN0cmVhbSA9IGNvbnRyb2xsZXIuX2NvbnRyb2xsZWRSZWFkYWJsZVN0cmVhbTtcblxuICBjb250cm9sbGVyLl9jbG9zZVJlcXVlc3RlZCA9IHRydWU7XG5cbiAgaWYgKGNvbnRyb2xsZXIuX3F1ZXVlLmxlbmd0aCA9PT0gMCkge1xuICAgIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDbGVhckFsZ29yaXRobXMoY29udHJvbGxlcik7XG4gICAgUmVhZGFibGVTdHJlYW1DbG9zZShzdHJlYW0pO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRW5xdWV1ZTxSPihcbiAgY29udHJvbGxlcjogUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxSPixcbiAgY2h1bms6IFJcbik6IHZvaWQge1xuICBpZiAoIVJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDYW5DbG9zZU9yRW5xdWV1ZShjb250cm9sbGVyKSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHN0cmVhbSA9IGNvbnRyb2xsZXIuX2NvbnRyb2xsZWRSZWFkYWJsZVN0cmVhbTtcblxuICBpZiAoSXNSZWFkYWJsZVN0cmVhbUxvY2tlZChzdHJlYW0pICYmIFJlYWRhYmxlU3RyZWFtR2V0TnVtUmVhZFJlcXVlc3RzKHN0cmVhbSkgPiAwKSB7XG4gICAgUmVhZGFibGVTdHJlYW1GdWxmaWxsUmVhZFJlcXVlc3Qoc3RyZWFtLCBjaHVuaywgZmFsc2UpO1xuICB9IGVsc2Uge1xuICAgIGxldCBjaHVua1NpemU7XG4gICAgdHJ5IHtcbiAgICAgIGNodW5rU2l6ZSA9IGNvbnRyb2xsZXIuX3N0cmF0ZWd5U2l6ZUFsZ29yaXRobShjaHVuayk7XG4gICAgfSBjYXRjaCAoY2h1bmtTaXplRSkge1xuICAgICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVycm9yKGNvbnRyb2xsZXIsIGNodW5rU2l6ZUUpO1xuICAgICAgdGhyb3cgY2h1bmtTaXplRTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgRW5xdWV1ZVZhbHVlV2l0aFNpemUoY29udHJvbGxlciwgY2h1bmssIGNodW5rU2l6ZSk7XG4gICAgfSBjYXRjaCAoZW5xdWV1ZUUpIHtcbiAgICAgIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFcnJvcihjb250cm9sbGVyLCBlbnF1ZXVlRSk7XG4gICAgICB0aHJvdyBlbnF1ZXVlRTtcbiAgICB9XG4gIH1cblxuICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2FsbFB1bGxJZk5lZWRlZChjb250cm9sbGVyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFcnJvcihjb250cm9sbGVyOiBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyPGFueT4sIGU6IGFueSkge1xuICBjb25zdCBzdHJlYW0gPSBjb250cm9sbGVyLl9jb250cm9sbGVkUmVhZGFibGVTdHJlYW07XG5cbiAgaWYgKHN0cmVhbS5fc3RhdGUgIT09ICdyZWFkYWJsZScpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBSZXNldFF1ZXVlKGNvbnRyb2xsZXIpO1xuXG4gIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDbGVhckFsZ29yaXRobXMoY29udHJvbGxlcik7XG4gIFJlYWRhYmxlU3RyZWFtRXJyb3Ioc3RyZWFtLCBlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJHZXREZXNpcmVkU2l6ZShcbiAgY29udHJvbGxlcjogUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxhbnk+XG4pOiBudW1iZXIgfCBudWxsIHtcbiAgY29uc3Qgc3RhdGUgPSBjb250cm9sbGVyLl9jb250cm9sbGVkUmVhZGFibGVTdHJlYW0uX3N0YXRlO1xuXG4gIGlmIChzdGF0ZSA9PT0gJ2Vycm9yZWQnKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgaWYgKHN0YXRlID09PSAnY2xvc2VkJykge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgcmV0dXJuIGNvbnRyb2xsZXIuX3N0cmF0ZWd5SFdNIC0gY29udHJvbGxlci5fcXVldWVUb3RhbFNpemU7XG59XG5cbi8vIFRoaXMgaXMgdXNlZCBpbiB0aGUgaW1wbGVtZW50YXRpb24gb2YgVHJhbnNmb3JtU3RyZWFtLlxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJIYXNCYWNrcHJlc3N1cmUoXG4gIGNvbnRyb2xsZXI6IFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8YW55PlxuKTogYm9vbGVhbiB7XG4gIGlmIChSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyU2hvdWxkQ2FsbFB1bGwoY29udHJvbGxlcikpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDYW5DbG9zZU9yRW5xdWV1ZShcbiAgY29udHJvbGxlcjogUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxhbnk+XG4pOiBib29sZWFuIHtcbiAgY29uc3Qgc3RhdGUgPSBjb250cm9sbGVyLl9jb250cm9sbGVkUmVhZGFibGVTdHJlYW0uX3N0YXRlO1xuXG4gIGlmICghY29udHJvbGxlci5fY2xvc2VSZXF1ZXN0ZWQgJiYgc3RhdGUgPT09ICdyZWFkYWJsZScpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFNldFVwUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxSPihzdHJlYW06IFJlYWRhYmxlU3RyZWFtPFI+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyPFI+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydEFsZ29yaXRobTogKCkgPT4gdm9pZCB8IFByb21pc2VMaWtlPHZvaWQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwdWxsQWxnb3JpdGhtOiAoKSA9PiBQcm9taXNlPHZvaWQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5jZWxBbGdvcml0aG06IChyZWFzb246IGFueSkgPT4gUHJvbWlzZTx2b2lkPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGlnaFdhdGVyTWFyazogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaXplQWxnb3JpdGhtOiBRdWV1aW5nU3RyYXRlZ3lTaXplQ2FsbGJhY2s8Uj4pIHtcbiAgYXNzZXJ0KHN0cmVhbS5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyID09PSB1bmRlZmluZWQpO1xuXG4gIGNvbnRyb2xsZXIuX2NvbnRyb2xsZWRSZWFkYWJsZVN0cmVhbSA9IHN0cmVhbTtcblxuICBjb250cm9sbGVyLl9xdWV1ZSA9IHVuZGVmaW5lZCE7XG4gIGNvbnRyb2xsZXIuX3F1ZXVlVG90YWxTaXplID0gdW5kZWZpbmVkITtcbiAgUmVzZXRRdWV1ZShjb250cm9sbGVyKTtcblxuICBjb250cm9sbGVyLl9zdGFydGVkID0gZmFsc2U7XG4gIGNvbnRyb2xsZXIuX2Nsb3NlUmVxdWVzdGVkID0gZmFsc2U7XG4gIGNvbnRyb2xsZXIuX3B1bGxBZ2FpbiA9IGZhbHNlO1xuICBjb250cm9sbGVyLl9wdWxsaW5nID0gZmFsc2U7XG5cbiAgY29udHJvbGxlci5fc3RyYXRlZ3lTaXplQWxnb3JpdGhtID0gc2l6ZUFsZ29yaXRobTtcbiAgY29udHJvbGxlci5fc3RyYXRlZ3lIV00gPSBoaWdoV2F0ZXJNYXJrO1xuXG4gIGNvbnRyb2xsZXIuX3B1bGxBbGdvcml0aG0gPSBwdWxsQWxnb3JpdGhtO1xuICBjb250cm9sbGVyLl9jYW5jZWxBbGdvcml0aG0gPSBjYW5jZWxBbGdvcml0aG07XG5cbiAgc3RyZWFtLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIgPSBjb250cm9sbGVyO1xuXG4gIGNvbnN0IHN0YXJ0UmVzdWx0ID0gc3RhcnRBbGdvcml0aG0oKTtcbiAgdXBvblByb21pc2UoXG4gICAgcHJvbWlzZVJlc29sdmVkV2l0aChzdGFydFJlc3VsdCksXG4gICAgKCkgPT4ge1xuICAgICAgY29udHJvbGxlci5fc3RhcnRlZCA9IHRydWU7XG5cbiAgICAgIGFzc2VydCghY29udHJvbGxlci5fcHVsbGluZyk7XG4gICAgICBhc3NlcnQoIWNvbnRyb2xsZXIuX3B1bGxBZ2Fpbik7XG5cbiAgICAgIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDYWxsUHVsbElmTmVlZGVkKGNvbnRyb2xsZXIpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcbiAgICByID0+IHtcbiAgICAgIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFcnJvcihjb250cm9sbGVyLCByKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFNldFVwUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckZyb21VbmRlcmx5aW5nU291cmNlPFI+KFxuICBzdHJlYW06IFJlYWRhYmxlU3RyZWFtPFI+LFxuICB1bmRlcmx5aW5nU291cmNlOiBWYWxpZGF0ZWRVbmRlcmx5aW5nU291cmNlPFI+LFxuICBoaWdoV2F0ZXJNYXJrOiBudW1iZXIsXG4gIHNpemVBbGdvcml0aG06IFF1ZXVpbmdTdHJhdGVneVNpemVDYWxsYmFjazxSPlxuKSB7XG4gIGNvbnN0IGNvbnRyb2xsZXI6IFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8Uj4gPSBPYmplY3QuY3JlYXRlKFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIucHJvdG90eXBlKTtcblxuICBsZXQgc3RhcnRBbGdvcml0aG06ICgpID0+IHZvaWQgfCBQcm9taXNlTGlrZTx2b2lkPjtcbiAgbGV0IHB1bGxBbGdvcml0aG06ICgpID0+IFByb21pc2U8dm9pZD47XG4gIGxldCBjYW5jZWxBbGdvcml0aG06IChyZWFzb246IGFueSkgPT4gUHJvbWlzZTx2b2lkPjtcblxuICBpZiAodW5kZXJseWluZ1NvdXJjZS5zdGFydCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgc3RhcnRBbGdvcml0aG0gPSAoKSA9PiB1bmRlcmx5aW5nU291cmNlLnN0YXJ0IShjb250cm9sbGVyKTtcbiAgfSBlbHNlIHtcbiAgICBzdGFydEFsZ29yaXRobSA9ICgpID0+IHVuZGVmaW5lZDtcbiAgfVxuICBpZiAodW5kZXJseWluZ1NvdXJjZS5wdWxsICE9PSB1bmRlZmluZWQpIHtcbiAgICBwdWxsQWxnb3JpdGhtID0gKCkgPT4gdW5kZXJseWluZ1NvdXJjZS5wdWxsIShjb250cm9sbGVyKTtcbiAgfSBlbHNlIHtcbiAgICBwdWxsQWxnb3JpdGhtID0gKCkgPT4gcHJvbWlzZVJlc29sdmVkV2l0aCh1bmRlZmluZWQpO1xuICB9XG4gIGlmICh1bmRlcmx5aW5nU291cmNlLmNhbmNlbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgY2FuY2VsQWxnb3JpdGhtID0gcmVhc29uID0+IHVuZGVybHlpbmdTb3VyY2UuY2FuY2VsIShyZWFzb24pO1xuICB9IGVsc2Uge1xuICAgIGNhbmNlbEFsZ29yaXRobSA9ICgpID0+IHByb21pc2VSZXNvbHZlZFdpdGgodW5kZWZpbmVkKTtcbiAgfVxuXG4gIFNldFVwUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcihcbiAgICBzdHJlYW0sIGNvbnRyb2xsZXIsIHN0YXJ0QWxnb3JpdGhtLCBwdWxsQWxnb3JpdGhtLCBjYW5jZWxBbGdvcml0aG0sIGhpZ2hXYXRlck1hcmssIHNpemVBbGdvcml0aG1cbiAgKTtcbn1cblxuLy8gSGVscGVyIGZ1bmN0aW9ucyBmb3IgdGhlIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIuXG5cbmZ1bmN0aW9uIGRlZmF1bHRDb250cm9sbGVyQnJhbmRDaGVja0V4Y2VwdGlvbihuYW1lOiBzdHJpbmcpOiBUeXBlRXJyb3Ige1xuICByZXR1cm4gbmV3IFR5cGVFcnJvcihcbiAgICBgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlci5wcm90b3R5cGUuJHtuYW1lfSBjYW4gb25seSBiZSB1c2VkIG9uIGEgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcmApO1xufVxuIiwgImltcG9ydCB7XG4gIENyZWF0ZVJlYWRhYmxlQnl0ZVN0cmVhbSxcbiAgQ3JlYXRlUmVhZGFibGVTdHJlYW0sXG4gIHR5cGUgRGVmYXVsdFJlYWRhYmxlU3RyZWFtLFxuICBJc1JlYWRhYmxlU3RyZWFtLFxuICB0eXBlIFJlYWRhYmxlQnl0ZVN0cmVhbSxcbiAgUmVhZGFibGVTdHJlYW0sXG4gIFJlYWRhYmxlU3RyZWFtQ2FuY2VsLFxuICB0eXBlIFJlYWRhYmxlU3RyZWFtUmVhZGVyXG59IGZyb20gJy4uL3JlYWRhYmxlLXN0cmVhbSc7XG5pbXBvcnQgeyBSZWFkYWJsZVN0cmVhbVJlYWRlckdlbmVyaWNSZWxlYXNlIH0gZnJvbSAnLi9nZW5lcmljLXJlYWRlcic7XG5pbXBvcnQge1xuICBBY3F1aXJlUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyLFxuICBJc1JlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcixcbiAgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyUmVhZCxcbiAgdHlwZSBSZWFkUmVxdWVzdFxufSBmcm9tICcuL2RlZmF1bHQtcmVhZGVyJztcbmltcG9ydCB7XG4gIEFjcXVpcmVSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIsXG4gIElzUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyLFxuICBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXJSZWFkLFxuICB0eXBlIFJlYWRJbnRvUmVxdWVzdFxufSBmcm9tICcuL2J5b2ItcmVhZGVyJztcbmltcG9ydCBhc3NlcnQgZnJvbSAnLi4vLi4vc3R1Yi9hc3NlcnQnO1xuaW1wb3J0IHsgbmV3UHJvbWlzZSwgcHJvbWlzZVJlc29sdmVkV2l0aCwgcXVldWVNaWNyb3Rhc2ssIHVwb25SZWplY3Rpb24gfSBmcm9tICcuLi9oZWxwZXJzL3dlYmlkbCc7XG5pbXBvcnQge1xuICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2xvc2UsXG4gIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFbnF1ZXVlLFxuICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRXJyb3Jcbn0gZnJvbSAnLi9kZWZhdWx0LWNvbnRyb2xsZXInO1xuaW1wb3J0IHtcbiAgSXNSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyLFxuICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyQ2xvc2UsXG4gIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJFbnF1ZXVlLFxuICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRXJyb3IsXG4gIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJHZXRCWU9CUmVxdWVzdCxcbiAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclJlc3BvbmQsXG4gIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJSZXNwb25kV2l0aE5ld1ZpZXdcbn0gZnJvbSAnLi9ieXRlLXN0cmVhbS1jb250cm9sbGVyJztcbmltcG9ydCB7IENyZWF0ZUFycmF5RnJvbUxpc3QgfSBmcm9tICcuLi9hYnN0cmFjdC1vcHMvZWNtYXNjcmlwdCc7XG5pbXBvcnQgeyBDbG9uZUFzVWludDhBcnJheSB9IGZyb20gJy4uL2Fic3RyYWN0LW9wcy9taXNjZWxsYW5lb3VzJztcbmltcG9ydCB0eXBlIHsgTm9uU2hhcmVkIH0gZnJvbSAnLi4vaGVscGVycy9hcnJheS1idWZmZXItdmlldyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZVN0cmVhbVRlZTxSPihzdHJlYW06IFJlYWRhYmxlU3RyZWFtPFI+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsb25lRm9yQnJhbmNoMjogYm9vbGVhbik6IFtSZWFkYWJsZVN0cmVhbTxSPiwgUmVhZGFibGVTdHJlYW08Uj5dIHtcbiAgYXNzZXJ0KElzUmVhZGFibGVTdHJlYW0oc3RyZWFtKSk7XG4gIGFzc2VydCh0eXBlb2YgY2xvbmVGb3JCcmFuY2gyID09PSAnYm9vbGVhbicpO1xuICBpZiAoSXNSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyKHN0cmVhbS5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyKSkge1xuICAgIHJldHVybiBSZWFkYWJsZUJ5dGVTdHJlYW1UZWUoc3RyZWFtIGFzIHVua25vd24gYXMgUmVhZGFibGVCeXRlU3RyZWFtKSBhc1xuICAgICAgdW5rbm93biBhcyBbUmVhZGFibGVTdHJlYW08Uj4sIFJlYWRhYmxlU3RyZWFtPFI+XTtcbiAgfVxuICByZXR1cm4gUmVhZGFibGVTdHJlYW1EZWZhdWx0VGVlKHN0cmVhbSwgY2xvbmVGb3JCcmFuY2gyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFRlZTxSPihcbiAgc3RyZWFtOiBSZWFkYWJsZVN0cmVhbTxSPixcbiAgY2xvbmVGb3JCcmFuY2gyOiBib29sZWFuXG4pOiBbRGVmYXVsdFJlYWRhYmxlU3RyZWFtPFI+LCBEZWZhdWx0UmVhZGFibGVTdHJlYW08Uj5dIHtcbiAgYXNzZXJ0KElzUmVhZGFibGVTdHJlYW0oc3RyZWFtKSk7XG4gIGFzc2VydCh0eXBlb2YgY2xvbmVGb3JCcmFuY2gyID09PSAnYm9vbGVhbicpO1xuXG4gIGNvbnN0IHJlYWRlciA9IEFjcXVpcmVSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXI8Uj4oc3RyZWFtKTtcblxuICBsZXQgcmVhZGluZyA9IGZhbHNlO1xuICBsZXQgcmVhZEFnYWluID0gZmFsc2U7XG4gIGxldCBjYW5jZWxlZDEgPSBmYWxzZTtcbiAgbGV0IGNhbmNlbGVkMiA9IGZhbHNlO1xuICBsZXQgcmVhc29uMTogYW55O1xuICBsZXQgcmVhc29uMjogYW55O1xuICBsZXQgYnJhbmNoMTogRGVmYXVsdFJlYWRhYmxlU3RyZWFtPFI+O1xuICBsZXQgYnJhbmNoMjogRGVmYXVsdFJlYWRhYmxlU3RyZWFtPFI+O1xuXG4gIGxldCByZXNvbHZlQ2FuY2VsUHJvbWlzZTogKHZhbHVlOiB1bmRlZmluZWQgfCBQcm9taXNlPHVuZGVmaW5lZD4pID0+IHZvaWQ7XG4gIGNvbnN0IGNhbmNlbFByb21pc2UgPSBuZXdQcm9taXNlPHVuZGVmaW5lZD4ocmVzb2x2ZSA9PiB7XG4gICAgcmVzb2x2ZUNhbmNlbFByb21pc2UgPSByZXNvbHZlO1xuICB9KTtcblxuICBmdW5jdGlvbiBwdWxsQWxnb3JpdGhtKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmIChyZWFkaW5nKSB7XG4gICAgICByZWFkQWdhaW4gPSB0cnVlO1xuICAgICAgcmV0dXJuIHByb21pc2VSZXNvbHZlZFdpdGgodW5kZWZpbmVkKTtcbiAgICB9XG5cbiAgICByZWFkaW5nID0gdHJ1ZTtcblxuICAgIGNvbnN0IHJlYWRSZXF1ZXN0OiBSZWFkUmVxdWVzdDxSPiA9IHtcbiAgICAgIF9jaHVua1N0ZXBzOiBjaHVuayA9PiB7XG4gICAgICAgIC8vIFRoaXMgbmVlZHMgdG8gYmUgZGVsYXllZCBhIG1pY3JvdGFzayBiZWNhdXNlIGl0IHRha2VzIGF0IGxlYXN0IGEgbWljcm90YXNrIHRvIGRldGVjdCBlcnJvcnMgKHVzaW5nXG4gICAgICAgIC8vIHJlYWRlci5fY2xvc2VkUHJvbWlzZSBiZWxvdyksIGFuZCB3ZSB3YW50IGVycm9ycyBpbiBzdHJlYW0gdG8gZXJyb3IgYm90aCBicmFuY2hlcyBpbW1lZGlhdGVseS4gV2UgY2Fubm90IGxldFxuICAgICAgICAvLyBzdWNjZXNzZnVsIHN5bmNocm9ub3VzbHktYXZhaWxhYmxlIHJlYWRzIGdldCBhaGVhZCBvZiBhc3luY2hyb25vdXNseS1hdmFpbGFibGUgZXJyb3JzLlxuICAgICAgICBxdWV1ZU1pY3JvdGFzaygoKSA9PiB7XG4gICAgICAgICAgcmVhZEFnYWluID0gZmFsc2U7XG4gICAgICAgICAgY29uc3QgY2h1bmsxID0gY2h1bms7XG4gICAgICAgICAgY29uc3QgY2h1bmsyID0gY2h1bms7XG5cbiAgICAgICAgICAvLyBUaGVyZSBpcyBubyB3YXkgdG8gYWNjZXNzIHRoZSBjbG9uaW5nIGNvZGUgcmlnaHQgbm93IGluIHRoZSByZWZlcmVuY2UgaW1wbGVtZW50YXRpb24uXG4gICAgICAgICAgLy8gSWYgd2UgYWRkIG9uZSB0aGVuIHdlJ2xsIG5lZWQgYW4gaW1wbGVtZW50YXRpb24gZm9yIHNlcmlhbGl6YWJsZSBvYmplY3RzLlxuICAgICAgICAgIC8vIGlmICghY2FuY2VsZWQyICYmIGNsb25lRm9yQnJhbmNoMikge1xuICAgICAgICAgIC8vICAgY2h1bmsyID0gU3RydWN0dXJlZERlc2VyaWFsaXplKFN0cnVjdHVyZWRTZXJpYWxpemUoY2h1bmsyKSk7XG4gICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgaWYgKCFjYW5jZWxlZDEpIHtcbiAgICAgICAgICAgIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFbnF1ZXVlKGJyYW5jaDEuX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlciwgY2h1bmsxKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFjYW5jZWxlZDIpIHtcbiAgICAgICAgICAgIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFbnF1ZXVlKGJyYW5jaDIuX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlciwgY2h1bmsyKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZWFkaW5nID0gZmFsc2U7XG4gICAgICAgICAgaWYgKHJlYWRBZ2Fpbikge1xuICAgICAgICAgICAgcHVsbEFsZ29yaXRobSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgX2Nsb3NlU3RlcHM6ICgpID0+IHtcbiAgICAgICAgcmVhZGluZyA9IGZhbHNlO1xuICAgICAgICBpZiAoIWNhbmNlbGVkMSkge1xuICAgICAgICAgIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDbG9zZShicmFuY2gxLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghY2FuY2VsZWQyKSB7XG4gICAgICAgICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNsb3NlKGJyYW5jaDIuX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlcik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWNhbmNlbGVkMSB8fCAhY2FuY2VsZWQyKSB7XG4gICAgICAgICAgcmVzb2x2ZUNhbmNlbFByb21pc2UodW5kZWZpbmVkKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIF9lcnJvclN0ZXBzOiAoKSA9PiB7XG4gICAgICAgIHJlYWRpbmcgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9O1xuICAgIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlclJlYWQocmVhZGVyLCByZWFkUmVxdWVzdCk7XG5cbiAgICByZXR1cm4gcHJvbWlzZVJlc29sdmVkV2l0aCh1bmRlZmluZWQpO1xuICB9XG5cbiAgZnVuY3Rpb24gY2FuY2VsMUFsZ29yaXRobShyZWFzb246IGFueSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNhbmNlbGVkMSA9IHRydWU7XG4gICAgcmVhc29uMSA9IHJlYXNvbjtcbiAgICBpZiAoY2FuY2VsZWQyKSB7XG4gICAgICBjb25zdCBjb21wb3NpdGVSZWFzb24gPSBDcmVhdGVBcnJheUZyb21MaXN0KFtyZWFzb24xLCByZWFzb24yXSk7XG4gICAgICBjb25zdCBjYW5jZWxSZXN1bHQgPSBSZWFkYWJsZVN0cmVhbUNhbmNlbChzdHJlYW0sIGNvbXBvc2l0ZVJlYXNvbik7XG4gICAgICByZXNvbHZlQ2FuY2VsUHJvbWlzZShjYW5jZWxSZXN1bHQpO1xuICAgIH1cbiAgICByZXR1cm4gY2FuY2VsUHJvbWlzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbmNlbDJBbGdvcml0aG0ocmVhc29uOiBhbnkpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjYW5jZWxlZDIgPSB0cnVlO1xuICAgIHJlYXNvbjIgPSByZWFzb247XG4gICAgaWYgKGNhbmNlbGVkMSkge1xuICAgICAgY29uc3QgY29tcG9zaXRlUmVhc29uID0gQ3JlYXRlQXJyYXlGcm9tTGlzdChbcmVhc29uMSwgcmVhc29uMl0pO1xuICAgICAgY29uc3QgY2FuY2VsUmVzdWx0ID0gUmVhZGFibGVTdHJlYW1DYW5jZWwoc3RyZWFtLCBjb21wb3NpdGVSZWFzb24pO1xuICAgICAgcmVzb2x2ZUNhbmNlbFByb21pc2UoY2FuY2VsUmVzdWx0KTtcbiAgICB9XG4gICAgcmV0dXJuIGNhbmNlbFByb21pc2U7XG4gIH1cblxuICBmdW5jdGlvbiBzdGFydEFsZ29yaXRobSgpIHtcbiAgICAvLyBkbyBub3RoaW5nXG4gIH1cblxuICBicmFuY2gxID0gQ3JlYXRlUmVhZGFibGVTdHJlYW0oc3RhcnRBbGdvcml0aG0sIHB1bGxBbGdvcml0aG0sIGNhbmNlbDFBbGdvcml0aG0pO1xuICBicmFuY2gyID0gQ3JlYXRlUmVhZGFibGVTdHJlYW0oc3RhcnRBbGdvcml0aG0sIHB1bGxBbGdvcml0aG0sIGNhbmNlbDJBbGdvcml0aG0pO1xuXG4gIHVwb25SZWplY3Rpb24ocmVhZGVyLl9jbG9zZWRQcm9taXNlLCAocjogYW55KSA9PiB7XG4gICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVycm9yKGJyYW5jaDEuX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlciwgcik7XG4gICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVycm9yKGJyYW5jaDIuX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlciwgcik7XG4gICAgaWYgKCFjYW5jZWxlZDEgfHwgIWNhbmNlbGVkMikge1xuICAgICAgcmVzb2x2ZUNhbmNlbFByb21pc2UodW5kZWZpbmVkKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH0pO1xuXG4gIHJldHVybiBbYnJhbmNoMSwgYnJhbmNoMl07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZUJ5dGVTdHJlYW1UZWUoc3RyZWFtOiBSZWFkYWJsZUJ5dGVTdHJlYW0pOiBbUmVhZGFibGVCeXRlU3RyZWFtLCBSZWFkYWJsZUJ5dGVTdHJlYW1dIHtcbiAgYXNzZXJ0KElzUmVhZGFibGVTdHJlYW0oc3RyZWFtKSk7XG4gIGFzc2VydChJc1JlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIoc3RyZWFtLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIpKTtcblxuICBsZXQgcmVhZGVyOiBSZWFkYWJsZVN0cmVhbVJlYWRlcjxOb25TaGFyZWQ8VWludDhBcnJheT4+ID0gQWNxdWlyZVJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcihzdHJlYW0pO1xuICBsZXQgcmVhZGluZyA9IGZhbHNlO1xuICBsZXQgcmVhZEFnYWluRm9yQnJhbmNoMSA9IGZhbHNlO1xuICBsZXQgcmVhZEFnYWluRm9yQnJhbmNoMiA9IGZhbHNlO1xuICBsZXQgY2FuY2VsZWQxID0gZmFsc2U7XG4gIGxldCBjYW5jZWxlZDIgPSBmYWxzZTtcbiAgbGV0IHJlYXNvbjE6IGFueTtcbiAgbGV0IHJlYXNvbjI6IGFueTtcbiAgbGV0IGJyYW5jaDE6IFJlYWRhYmxlQnl0ZVN0cmVhbTtcbiAgbGV0IGJyYW5jaDI6IFJlYWRhYmxlQnl0ZVN0cmVhbTtcblxuICBsZXQgcmVzb2x2ZUNhbmNlbFByb21pc2U6ICh2YWx1ZTogdW5kZWZpbmVkIHwgUHJvbWlzZTx1bmRlZmluZWQ+KSA9PiB2b2lkO1xuICBjb25zdCBjYW5jZWxQcm9taXNlID0gbmV3UHJvbWlzZTx2b2lkPihyZXNvbHZlID0+IHtcbiAgICByZXNvbHZlQ2FuY2VsUHJvbWlzZSA9IHJlc29sdmU7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIGZvcndhcmRSZWFkZXJFcnJvcih0aGlzUmVhZGVyOiBSZWFkYWJsZVN0cmVhbVJlYWRlcjxOb25TaGFyZWQ8VWludDhBcnJheT4+KSB7XG4gICAgdXBvblJlamVjdGlvbih0aGlzUmVhZGVyLl9jbG9zZWRQcm9taXNlLCByID0+IHtcbiAgICAgIGlmICh0aGlzUmVhZGVyICE9PSByZWFkZXIpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRXJyb3IoYnJhbmNoMS5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyLCByKTtcbiAgICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJFcnJvcihicmFuY2gyLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIsIHIpO1xuICAgICAgaWYgKCFjYW5jZWxlZDEgfHwgIWNhbmNlbGVkMikge1xuICAgICAgICByZXNvbHZlQ2FuY2VsUHJvbWlzZSh1bmRlZmluZWQpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBwdWxsV2l0aERlZmF1bHRSZWFkZXIoKSB7XG4gICAgaWYgKElzUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyKHJlYWRlcikpIHtcbiAgICAgIGFzc2VydChyZWFkZXIuX3JlYWRJbnRvUmVxdWVzdHMubGVuZ3RoID09PSAwKTtcbiAgICAgIFJlYWRhYmxlU3RyZWFtUmVhZGVyR2VuZXJpY1JlbGVhc2UocmVhZGVyKTtcblxuICAgICAgcmVhZGVyID0gQWNxdWlyZVJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcihzdHJlYW0pO1xuICAgICAgZm9yd2FyZFJlYWRlckVycm9yKHJlYWRlcik7XG4gICAgfVxuXG4gICAgY29uc3QgcmVhZFJlcXVlc3Q6IFJlYWRSZXF1ZXN0PE5vblNoYXJlZDxVaW50OEFycmF5Pj4gPSB7XG4gICAgICBfY2h1bmtTdGVwczogY2h1bmsgPT4ge1xuICAgICAgICAvLyBUaGlzIG5lZWRzIHRvIGJlIGRlbGF5ZWQgYSBtaWNyb3Rhc2sgYmVjYXVzZSBpdCB0YWtlcyBhdCBsZWFzdCBhIG1pY3JvdGFzayB0byBkZXRlY3QgZXJyb3JzICh1c2luZ1xuICAgICAgICAvLyByZWFkZXIuX2Nsb3NlZFByb21pc2UgYmVsb3cpLCBhbmQgd2Ugd2FudCBlcnJvcnMgaW4gc3RyZWFtIHRvIGVycm9yIGJvdGggYnJhbmNoZXMgaW1tZWRpYXRlbHkuIFdlIGNhbm5vdCBsZXRcbiAgICAgICAgLy8gc3VjY2Vzc2Z1bCBzeW5jaHJvbm91c2x5LWF2YWlsYWJsZSByZWFkcyBnZXQgYWhlYWQgb2YgYXN5bmNocm9ub3VzbHktYXZhaWxhYmxlIGVycm9ycy5cbiAgICAgICAgcXVldWVNaWNyb3Rhc2soKCkgPT4ge1xuICAgICAgICAgIHJlYWRBZ2FpbkZvckJyYW5jaDEgPSBmYWxzZTtcbiAgICAgICAgICByZWFkQWdhaW5Gb3JCcmFuY2gyID0gZmFsc2U7XG5cbiAgICAgICAgICBjb25zdCBjaHVuazEgPSBjaHVuaztcbiAgICAgICAgICBsZXQgY2h1bmsyID0gY2h1bms7XG4gICAgICAgICAgaWYgKCFjYW5jZWxlZDEgJiYgIWNhbmNlbGVkMikge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgY2h1bmsyID0gQ2xvbmVBc1VpbnQ4QXJyYXkoY2h1bmspO1xuICAgICAgICAgICAgfSBjYXRjaCAoY2xvbmVFKSB7XG4gICAgICAgICAgICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJFcnJvcihicmFuY2gxLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIsIGNsb25lRSk7XG4gICAgICAgICAgICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJFcnJvcihicmFuY2gyLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIsIGNsb25lRSk7XG4gICAgICAgICAgICAgIHJlc29sdmVDYW5jZWxQcm9taXNlKFJlYWRhYmxlU3RyZWFtQ2FuY2VsKHN0cmVhbSwgY2xvbmVFKSk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIWNhbmNlbGVkMSkge1xuICAgICAgICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVucXVldWUoYnJhbmNoMS5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyLCBjaHVuazEpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIWNhbmNlbGVkMikge1xuICAgICAgICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVucXVldWUoYnJhbmNoMi5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyLCBjaHVuazIpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICBpZiAocmVhZEFnYWluRm9yQnJhbmNoMSkge1xuICAgICAgICAgICAgcHVsbDFBbGdvcml0aG0oKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHJlYWRBZ2FpbkZvckJyYW5jaDIpIHtcbiAgICAgICAgICAgIHB1bGwyQWxnb3JpdGhtKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBfY2xvc2VTdGVwczogKCkgPT4ge1xuICAgICAgICByZWFkaW5nID0gZmFsc2U7XG4gICAgICAgIGlmICghY2FuY2VsZWQxKSB7XG4gICAgICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckNsb3NlKGJyYW5jaDEuX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFjYW5jZWxlZDIpIHtcbiAgICAgICAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyQ2xvc2UoYnJhbmNoMi5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYnJhbmNoMS5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyLl9wZW5kaW5nUHVsbEludG9zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyUmVzcG9uZChicmFuY2gxLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIsIDApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChicmFuY2gyLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIuX3BlbmRpbmdQdWxsSW50b3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJSZXNwb25kKGJyYW5jaDIuX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlciwgMCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFjYW5jZWxlZDEgfHwgIWNhbmNlbGVkMikge1xuICAgICAgICAgIHJlc29sdmVDYW5jZWxQcm9taXNlKHVuZGVmaW5lZCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBfZXJyb3JTdGVwczogKCkgPT4ge1xuICAgICAgICByZWFkaW5nID0gZmFsc2U7XG4gICAgICB9XG4gICAgfTtcbiAgICBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXJSZWFkKHJlYWRlciwgcmVhZFJlcXVlc3QpO1xuICB9XG5cbiAgZnVuY3Rpb24gcHVsbFdpdGhCWU9CUmVhZGVyKHZpZXc6IE5vblNoYXJlZDxBcnJheUJ1ZmZlclZpZXc+LCBmb3JCcmFuY2gyOiBib29sZWFuKSB7XG4gICAgaWYgKElzUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyPE5vblNoYXJlZDxVaW50OEFycmF5Pj4ocmVhZGVyKSkge1xuICAgICAgYXNzZXJ0KHJlYWRlci5fcmVhZFJlcXVlc3RzLmxlbmd0aCA9PT0gMCk7XG4gICAgICBSZWFkYWJsZVN0cmVhbVJlYWRlckdlbmVyaWNSZWxlYXNlKHJlYWRlcik7XG5cbiAgICAgIHJlYWRlciA9IEFjcXVpcmVSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIoc3RyZWFtKTtcbiAgICAgIGZvcndhcmRSZWFkZXJFcnJvcihyZWFkZXIpO1xuICAgIH1cblxuICAgIGNvbnN0IGJ5b2JCcmFuY2ggPSBmb3JCcmFuY2gyID8gYnJhbmNoMiA6IGJyYW5jaDE7XG4gICAgY29uc3Qgb3RoZXJCcmFuY2ggPSBmb3JCcmFuY2gyID8gYnJhbmNoMSA6IGJyYW5jaDI7XG5cbiAgICBjb25zdCByZWFkSW50b1JlcXVlc3Q6IFJlYWRJbnRvUmVxdWVzdDxOb25TaGFyZWQ8QXJyYXlCdWZmZXJWaWV3Pj4gPSB7XG4gICAgICBfY2h1bmtTdGVwczogY2h1bmsgPT4ge1xuICAgICAgICAvLyBUaGlzIG5lZWRzIHRvIGJlIGRlbGF5ZWQgYSBtaWNyb3Rhc2sgYmVjYXVzZSBpdCB0YWtlcyBhdCBsZWFzdCBhIG1pY3JvdGFzayB0byBkZXRlY3QgZXJyb3JzICh1c2luZ1xuICAgICAgICAvLyByZWFkZXIuX2Nsb3NlZFByb21pc2UgYmVsb3cpLCBhbmQgd2Ugd2FudCBlcnJvcnMgaW4gc3RyZWFtIHRvIGVycm9yIGJvdGggYnJhbmNoZXMgaW1tZWRpYXRlbHkuIFdlIGNhbm5vdCBsZXRcbiAgICAgICAgLy8gc3VjY2Vzc2Z1bCBzeW5jaHJvbm91c2x5LWF2YWlsYWJsZSByZWFkcyBnZXQgYWhlYWQgb2YgYXN5bmNocm9ub3VzbHktYXZhaWxhYmxlIGVycm9ycy5cbiAgICAgICAgcXVldWVNaWNyb3Rhc2soKCkgPT4ge1xuICAgICAgICAgIHJlYWRBZ2FpbkZvckJyYW5jaDEgPSBmYWxzZTtcbiAgICAgICAgICByZWFkQWdhaW5Gb3JCcmFuY2gyID0gZmFsc2U7XG5cbiAgICAgICAgICBjb25zdCBieW9iQ2FuY2VsZWQgPSBmb3JCcmFuY2gyID8gY2FuY2VsZWQyIDogY2FuY2VsZWQxO1xuICAgICAgICAgIGNvbnN0IG90aGVyQ2FuY2VsZWQgPSBmb3JCcmFuY2gyID8gY2FuY2VsZWQxIDogY2FuY2VsZWQyO1xuXG4gICAgICAgICAgaWYgKCFvdGhlckNhbmNlbGVkKSB7XG4gICAgICAgICAgICBsZXQgY2xvbmVkQ2h1bms7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBjbG9uZWRDaHVuayA9IENsb25lQXNVaW50OEFycmF5KGNodW5rKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGNsb25lRSkge1xuICAgICAgICAgICAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRXJyb3IoYnlvYkJyYW5jaC5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyLCBjbG9uZUUpO1xuICAgICAgICAgICAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRXJyb3Iob3RoZXJCcmFuY2guX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlciwgY2xvbmVFKTtcbiAgICAgICAgICAgICAgcmVzb2x2ZUNhbmNlbFByb21pc2UoUmVhZGFibGVTdHJlYW1DYW5jZWwoc3RyZWFtLCBjbG9uZUUpKTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFieW9iQ2FuY2VsZWQpIHtcbiAgICAgICAgICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclJlc3BvbmRXaXRoTmV3VmlldyhieW9iQnJhbmNoLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIsIGNodW5rKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJFbnF1ZXVlKG90aGVyQnJhbmNoLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIsIGNsb25lZENodW5rKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKCFieW9iQ2FuY2VsZWQpIHtcbiAgICAgICAgICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJSZXNwb25kV2l0aE5ld1ZpZXcoYnlvYkJyYW5jaC5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyLCBjaHVuayk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVhZGluZyA9IGZhbHNlO1xuICAgICAgICAgIGlmIChyZWFkQWdhaW5Gb3JCcmFuY2gxKSB7XG4gICAgICAgICAgICBwdWxsMUFsZ29yaXRobSgpO1xuICAgICAgICAgIH0gZWxzZSBpZiAocmVhZEFnYWluRm9yQnJhbmNoMikge1xuICAgICAgICAgICAgcHVsbDJBbGdvcml0aG0oKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIF9jbG9zZVN0ZXBzOiBjaHVuayA9PiB7XG4gICAgICAgIHJlYWRpbmcgPSBmYWxzZTtcblxuICAgICAgICBjb25zdCBieW9iQ2FuY2VsZWQgPSBmb3JCcmFuY2gyID8gY2FuY2VsZWQyIDogY2FuY2VsZWQxO1xuICAgICAgICBjb25zdCBvdGhlckNhbmNlbGVkID0gZm9yQnJhbmNoMiA/IGNhbmNlbGVkMSA6IGNhbmNlbGVkMjtcblxuICAgICAgICBpZiAoIWJ5b2JDYW5jZWxlZCkge1xuICAgICAgICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJDbG9zZShieW9iQnJhbmNoLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghb3RoZXJDYW5jZWxlZCkge1xuICAgICAgICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJDbG9zZShvdGhlckJyYW5jaC5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjaHVuayAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgYXNzZXJ0KGNodW5rLmJ5dGVMZW5ndGggPT09IDApO1xuXG4gICAgICAgICAgaWYgKCFieW9iQ2FuY2VsZWQpIHtcbiAgICAgICAgICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJSZXNwb25kV2l0aE5ld1ZpZXcoYnlvYkJyYW5jaC5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyLCBjaHVuayk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghb3RoZXJDYW5jZWxlZCAmJiBvdGhlckJyYW5jaC5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyLl9wZW5kaW5nUHVsbEludG9zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJSZXNwb25kKG90aGVyQnJhbmNoLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIsIDApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghYnlvYkNhbmNlbGVkIHx8ICFvdGhlckNhbmNlbGVkKSB7XG4gICAgICAgICAgcmVzb2x2ZUNhbmNlbFByb21pc2UodW5kZWZpbmVkKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIF9lcnJvclN0ZXBzOiAoKSA9PiB7XG4gICAgICAgIHJlYWRpbmcgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9O1xuICAgIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlclJlYWQocmVhZGVyLCB2aWV3LCAxLCByZWFkSW50b1JlcXVlc3QpO1xuICB9XG5cbiAgZnVuY3Rpb24gcHVsbDFBbGdvcml0aG0oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKHJlYWRpbmcpIHtcbiAgICAgIHJlYWRBZ2FpbkZvckJyYW5jaDEgPSB0cnVlO1xuICAgICAgcmV0dXJuIHByb21pc2VSZXNvbHZlZFdpdGgodW5kZWZpbmVkKTtcbiAgICB9XG5cbiAgICByZWFkaW5nID0gdHJ1ZTtcblxuICAgIGNvbnN0IGJ5b2JSZXF1ZXN0ID0gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckdldEJZT0JSZXF1ZXN0KGJyYW5jaDEuX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlcik7XG4gICAgaWYgKGJ5b2JSZXF1ZXN0ID09PSBudWxsKSB7XG4gICAgICBwdWxsV2l0aERlZmF1bHRSZWFkZXIoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHVsbFdpdGhCWU9CUmVhZGVyKGJ5b2JSZXF1ZXN0Ll92aWV3ISwgZmFsc2UpO1xuICAgIH1cblxuICAgIHJldHVybiBwcm9taXNlUmVzb2x2ZWRXaXRoKHVuZGVmaW5lZCk7XG4gIH1cblxuICBmdW5jdGlvbiBwdWxsMkFsZ29yaXRobSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAocmVhZGluZykge1xuICAgICAgcmVhZEFnYWluRm9yQnJhbmNoMiA9IHRydWU7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlc29sdmVkV2l0aCh1bmRlZmluZWQpO1xuICAgIH1cblxuICAgIHJlYWRpbmcgPSB0cnVlO1xuXG4gICAgY29uc3QgYnlvYlJlcXVlc3QgPSBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyR2V0QllPQlJlcXVlc3QoYnJhbmNoMi5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyKTtcbiAgICBpZiAoYnlvYlJlcXVlc3QgPT09IG51bGwpIHtcbiAgICAgIHB1bGxXaXRoRGVmYXVsdFJlYWRlcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwdWxsV2l0aEJZT0JSZWFkZXIoYnlvYlJlcXVlc3QuX3ZpZXchLCB0cnVlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcHJvbWlzZVJlc29sdmVkV2l0aCh1bmRlZmluZWQpO1xuICB9XG5cbiAgZnVuY3Rpb24gY2FuY2VsMUFsZ29yaXRobShyZWFzb246IGFueSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNhbmNlbGVkMSA9IHRydWU7XG4gICAgcmVhc29uMSA9IHJlYXNvbjtcbiAgICBpZiAoY2FuY2VsZWQyKSB7XG4gICAgICBjb25zdCBjb21wb3NpdGVSZWFzb24gPSBDcmVhdGVBcnJheUZyb21MaXN0KFtyZWFzb24xLCByZWFzb24yXSk7XG4gICAgICBjb25zdCBjYW5jZWxSZXN1bHQgPSBSZWFkYWJsZVN0cmVhbUNhbmNlbChzdHJlYW0sIGNvbXBvc2l0ZVJlYXNvbik7XG4gICAgICByZXNvbHZlQ2FuY2VsUHJvbWlzZShjYW5jZWxSZXN1bHQpO1xuICAgIH1cbiAgICByZXR1cm4gY2FuY2VsUHJvbWlzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbmNlbDJBbGdvcml0aG0ocmVhc29uOiBhbnkpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjYW5jZWxlZDIgPSB0cnVlO1xuICAgIHJlYXNvbjIgPSByZWFzb247XG4gICAgaWYgKGNhbmNlbGVkMSkge1xuICAgICAgY29uc3QgY29tcG9zaXRlUmVhc29uID0gQ3JlYXRlQXJyYXlGcm9tTGlzdChbcmVhc29uMSwgcmVhc29uMl0pO1xuICAgICAgY29uc3QgY2FuY2VsUmVzdWx0ID0gUmVhZGFibGVTdHJlYW1DYW5jZWwoc3RyZWFtLCBjb21wb3NpdGVSZWFzb24pO1xuICAgICAgcmVzb2x2ZUNhbmNlbFByb21pc2UoY2FuY2VsUmVzdWx0KTtcbiAgICB9XG4gICAgcmV0dXJuIGNhbmNlbFByb21pc2U7XG4gIH1cblxuICBmdW5jdGlvbiBzdGFydEFsZ29yaXRobSgpOiB2b2lkIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBicmFuY2gxID0gQ3JlYXRlUmVhZGFibGVCeXRlU3RyZWFtKHN0YXJ0QWxnb3JpdGhtLCBwdWxsMUFsZ29yaXRobSwgY2FuY2VsMUFsZ29yaXRobSk7XG4gIGJyYW5jaDIgPSBDcmVhdGVSZWFkYWJsZUJ5dGVTdHJlYW0oc3RhcnRBbGdvcml0aG0sIHB1bGwyQWxnb3JpdGhtLCBjYW5jZWwyQWxnb3JpdGhtKTtcblxuICBmb3J3YXJkUmVhZGVyRXJyb3IocmVhZGVyKTtcblxuICByZXR1cm4gW2JyYW5jaDEsIGJyYW5jaDJdO1xufVxuIiwgImltcG9ydCB7IHR5cGVJc09iamVjdCB9IGZyb20gJy4uL2hlbHBlcnMvbWlzY2VsbGFuZW91cyc7XG5pbXBvcnQgdHlwZSB7IFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRSZXN1bHQgfSBmcm9tICcuL2RlZmF1bHQtcmVhZGVyJztcblxuLyoqXG4gKiBBIGNvbW1vbiBpbnRlcmZhY2UgZm9yIGEgYFJlYWRhZGFibGVTdHJlYW1gIGltcGxlbWVudGF0aW9uLlxuICpcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSZWFkYWJsZVN0cmVhbUxpa2U8UiA9IGFueT4ge1xuICByZWFkb25seSBsb2NrZWQ6IGJvb2xlYW47XG5cbiAgZ2V0UmVhZGVyKCk6IFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlckxpa2U8Uj47XG59XG5cbi8qKlxuICogQSBjb21tb24gaW50ZXJmYWNlIGZvciBhIGBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXJgIGltcGxlbWVudGF0aW9uLlxuICpcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXJMaWtlPFIgPSBhbnk+IHtcbiAgcmVhZG9ubHkgY2xvc2VkOiBQcm9taXNlPHVuZGVmaW5lZD47XG5cbiAgY2FuY2VsKHJlYXNvbj86IGFueSk6IFByb21pc2U8dm9pZD47XG5cbiAgcmVhZCgpOiBQcm9taXNlPFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRSZXN1bHQ8Uj4+O1xuXG4gIHJlbGVhc2VMb2NrKCk6IHZvaWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1JlYWRhYmxlU3RyZWFtTGlrZTxSPihzdHJlYW06IHVua25vd24pOiBzdHJlYW0gaXMgUmVhZGFibGVTdHJlYW1MaWtlPFI+IHtcbiAgcmV0dXJuIHR5cGVJc09iamVjdChzdHJlYW0pICYmIHR5cGVvZiAoc3RyZWFtIGFzIFJlYWRhYmxlU3RyZWFtTGlrZTxSPikuZ2V0UmVhZGVyICE9PSAndW5kZWZpbmVkJztcbn1cbiIsICJpbXBvcnQgeyBDcmVhdGVSZWFkYWJsZVN0cmVhbSwgdHlwZSBEZWZhdWx0UmVhZGFibGVTdHJlYW0gfSBmcm9tICcuLi9yZWFkYWJsZS1zdHJlYW0nO1xuaW1wb3J0IHtcbiAgaXNSZWFkYWJsZVN0cmVhbUxpa2UsXG4gIHR5cGUgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyTGlrZSxcbiAgdHlwZSBSZWFkYWJsZVN0cmVhbUxpa2Vcbn0gZnJvbSAnLi9yZWFkYWJsZS1zdHJlYW0tbGlrZSc7XG5pbXBvcnQgeyBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2xvc2UsIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFbnF1ZXVlIH0gZnJvbSAnLi9kZWZhdWx0LWNvbnRyb2xsZXInO1xuaW1wb3J0IHsgR2V0SXRlcmF0b3IsIEdldE1ldGhvZCwgSXRlcmF0b3JDb21wbGV0ZSwgSXRlcmF0b3JOZXh0LCBJdGVyYXRvclZhbHVlIH0gZnJvbSAnLi4vYWJzdHJhY3Qtb3BzL2VjbWFzY3JpcHQnO1xuaW1wb3J0IHsgcHJvbWlzZVJlamVjdGVkV2l0aCwgcHJvbWlzZVJlc29sdmVkV2l0aCwgcmVmbGVjdENhbGwsIHRyYW5zZm9ybVByb21pc2VXaXRoIH0gZnJvbSAnLi4vaGVscGVycy93ZWJpZGwnO1xuaW1wb3J0IHsgdHlwZUlzT2JqZWN0IH0gZnJvbSAnLi4vaGVscGVycy9taXNjZWxsYW5lb3VzJztcbmltcG9ydCB7IG5vb3AgfSBmcm9tICcuLi8uLi91dGlscyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZVN0cmVhbUZyb208Uj4oXG4gIHNvdXJjZTogSXRlcmFibGU8Uj4gfCBBc3luY0l0ZXJhYmxlPFI+IHwgUmVhZGFibGVTdHJlYW1MaWtlPFI+XG4pOiBEZWZhdWx0UmVhZGFibGVTdHJlYW08Uj4ge1xuICBpZiAoaXNSZWFkYWJsZVN0cmVhbUxpa2Uoc291cmNlKSkge1xuICAgIHJldHVybiBSZWFkYWJsZVN0cmVhbUZyb21EZWZhdWx0UmVhZGVyKHNvdXJjZS5nZXRSZWFkZXIoKSk7XG4gIH1cbiAgcmV0dXJuIFJlYWRhYmxlU3RyZWFtRnJvbUl0ZXJhYmxlKHNvdXJjZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZVN0cmVhbUZyb21JdGVyYWJsZTxSPihhc3luY0l0ZXJhYmxlOiBJdGVyYWJsZTxSPiB8IEFzeW5jSXRlcmFibGU8Uj4pOiBEZWZhdWx0UmVhZGFibGVTdHJlYW08Uj4ge1xuICBsZXQgc3RyZWFtOiBEZWZhdWx0UmVhZGFibGVTdHJlYW08Uj47XG4gIGNvbnN0IGl0ZXJhdG9yUmVjb3JkID0gR2V0SXRlcmF0b3IoYXN5bmNJdGVyYWJsZSwgJ2FzeW5jJyk7XG5cbiAgY29uc3Qgc3RhcnRBbGdvcml0aG0gPSBub29wO1xuXG4gIGZ1bmN0aW9uIHB1bGxBbGdvcml0aG0oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgbGV0IG5leHRSZXN1bHQ7XG4gICAgdHJ5IHtcbiAgICAgIG5leHRSZXN1bHQgPSBJdGVyYXRvck5leHQoaXRlcmF0b3JSZWNvcmQpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKGUpO1xuICAgIH1cbiAgICBjb25zdCBuZXh0UHJvbWlzZSA9IHByb21pc2VSZXNvbHZlZFdpdGgobmV4dFJlc3VsdCk7XG4gICAgcmV0dXJuIHRyYW5zZm9ybVByb21pc2VXaXRoKG5leHRQcm9taXNlLCBpdGVyUmVzdWx0ID0+IHtcbiAgICAgIGlmICghdHlwZUlzT2JqZWN0KGl0ZXJSZXN1bHQpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBwcm9taXNlIHJldHVybmVkIGJ5IHRoZSBpdGVyYXRvci5uZXh0KCkgbWV0aG9kIG11c3QgZnVsZmlsbCB3aXRoIGFuIG9iamVjdCcpO1xuICAgICAgfVxuICAgICAgY29uc3QgZG9uZSA9IEl0ZXJhdG9yQ29tcGxldGUoaXRlclJlc3VsdCk7XG4gICAgICBpZiAoZG9uZSkge1xuICAgICAgICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2xvc2Uoc3RyZWFtLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBJdGVyYXRvclZhbHVlKGl0ZXJSZXN1bHQpO1xuICAgICAgICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRW5xdWV1ZShzdHJlYW0uX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlciwgdmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gY2FuY2VsQWxnb3JpdGhtKHJlYXNvbjogYW55KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgaXRlcmF0b3IgPSBpdGVyYXRvclJlY29yZC5pdGVyYXRvcjtcbiAgICBsZXQgcmV0dXJuTWV0aG9kOiAodHlwZW9mIGl0ZXJhdG9yKVsncmV0dXJuJ10gfCB1bmRlZmluZWQ7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybk1ldGhvZCA9IEdldE1ldGhvZChpdGVyYXRvciwgJ3JldHVybicpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKGUpO1xuICAgIH1cbiAgICBpZiAocmV0dXJuTWV0aG9kID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVzb2x2ZWRXaXRoKHVuZGVmaW5lZCk7XG4gICAgfVxuICAgIGxldCByZXR1cm5SZXN1bHQ6IEl0ZXJhdG9yUmVzdWx0PFI+IHwgUHJvbWlzZTxJdGVyYXRvclJlc3VsdDxSPj47XG4gICAgdHJ5IHtcbiAgICAgIHJldHVyblJlc3VsdCA9IHJlZmxlY3RDYWxsKHJldHVybk1ldGhvZCwgaXRlcmF0b3IsIFtyZWFzb25dKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChlKTtcbiAgICB9XG4gICAgY29uc3QgcmV0dXJuUHJvbWlzZSA9IHByb21pc2VSZXNvbHZlZFdpdGgocmV0dXJuUmVzdWx0KTtcbiAgICByZXR1cm4gdHJhbnNmb3JtUHJvbWlzZVdpdGgocmV0dXJuUHJvbWlzZSwgaXRlclJlc3VsdCA9PiB7XG4gICAgICBpZiAoIXR5cGVJc09iamVjdChpdGVyUmVzdWx0KSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgcHJvbWlzZSByZXR1cm5lZCBieSB0aGUgaXRlcmF0b3IucmV0dXJuKCkgbWV0aG9kIG11c3QgZnVsZmlsbCB3aXRoIGFuIG9iamVjdCcpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9KTtcbiAgfVxuXG4gIHN0cmVhbSA9IENyZWF0ZVJlYWRhYmxlU3RyZWFtKHN0YXJ0QWxnb3JpdGhtLCBwdWxsQWxnb3JpdGhtLCBjYW5jZWxBbGdvcml0aG0sIDApO1xuICByZXR1cm4gc3RyZWFtO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1Gcm9tRGVmYXVsdFJlYWRlcjxSPihcbiAgcmVhZGVyOiBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXJMaWtlPFI+XG4pOiBEZWZhdWx0UmVhZGFibGVTdHJlYW08Uj4ge1xuICBsZXQgc3RyZWFtOiBEZWZhdWx0UmVhZGFibGVTdHJlYW08Uj47XG5cbiAgY29uc3Qgc3RhcnRBbGdvcml0aG0gPSBub29wO1xuXG4gIGZ1bmN0aW9uIHB1bGxBbGdvcml0aG0oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgbGV0IHJlYWRQcm9taXNlO1xuICAgIHRyeSB7XG4gICAgICByZWFkUHJvbWlzZSA9IHJlYWRlci5yZWFkKCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoZSk7XG4gICAgfVxuICAgIHJldHVybiB0cmFuc2Zvcm1Qcm9taXNlV2l0aChyZWFkUHJvbWlzZSwgcmVhZFJlc3VsdCA9PiB7XG4gICAgICBpZiAoIXR5cGVJc09iamVjdChyZWFkUmVzdWx0KSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgcHJvbWlzZSByZXR1cm5lZCBieSB0aGUgcmVhZGVyLnJlYWQoKSBtZXRob2QgbXVzdCBmdWxmaWxsIHdpdGggYW4gb2JqZWN0Jyk7XG4gICAgICB9XG4gICAgICBpZiAocmVhZFJlc3VsdC5kb25lKSB7XG4gICAgICAgIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDbG9zZShzdHJlYW0uX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHJlYWRSZXN1bHQudmFsdWU7XG4gICAgICAgIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFbnF1ZXVlKHN0cmVhbS5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBjYW5jZWxBbGdvcml0aG0ocmVhc29uOiBhbnkpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZXNvbHZlZFdpdGgocmVhZGVyLmNhbmNlbChyZWFzb24pKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChlKTtcbiAgICB9XG4gIH1cblxuICBzdHJlYW0gPSBDcmVhdGVSZWFkYWJsZVN0cmVhbShzdGFydEFsZ29yaXRobSwgcHVsbEFsZ29yaXRobSwgY2FuY2VsQWxnb3JpdGhtLCAwKTtcbiAgcmV0dXJuIHN0cmVhbTtcbn1cbiIsICJpbXBvcnQgeyBhc3NlcnREaWN0aW9uYXJ5LCBhc3NlcnRGdW5jdGlvbiwgY29udmVydFVuc2lnbmVkTG9uZ0xvbmdXaXRoRW5mb3JjZVJhbmdlIH0gZnJvbSAnLi9iYXNpYyc7XG5pbXBvcnQgdHlwZSB7XG4gIFJlYWRhYmxlU3RyZWFtQ29udHJvbGxlcixcbiAgVW5kZXJseWluZ0J5dGVTb3VyY2UsXG4gIFVuZGVybHlpbmdEZWZhdWx0T3JCeXRlU291cmNlLFxuICBVbmRlcmx5aW5nRGVmYXVsdE9yQnl0ZVNvdXJjZVB1bGxDYWxsYmFjayxcbiAgVW5kZXJseWluZ0RlZmF1bHRPckJ5dGVTb3VyY2VTdGFydENhbGxiYWNrLFxuICBVbmRlcmx5aW5nU291cmNlLFxuICBVbmRlcmx5aW5nU291cmNlQ2FuY2VsQ2FsbGJhY2ssXG4gIFZhbGlkYXRlZFVuZGVybHlpbmdEZWZhdWx0T3JCeXRlU291cmNlXG59IGZyb20gJy4uL3JlYWRhYmxlLXN0cmVhbS91bmRlcmx5aW5nLXNvdXJjZSc7XG5pbXBvcnQgeyBwcm9taXNlQ2FsbCwgcmVmbGVjdENhbGwgfSBmcm9tICcuLi9oZWxwZXJzL3dlYmlkbCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0VW5kZXJseWluZ0RlZmF1bHRPckJ5dGVTb3VyY2U8Uj4oXG4gIHNvdXJjZTogVW5kZXJseWluZ1NvdXJjZTxSPiB8IFVuZGVybHlpbmdCeXRlU291cmNlIHwgbnVsbCxcbiAgY29udGV4dDogc3RyaW5nXG4pOiBWYWxpZGF0ZWRVbmRlcmx5aW5nRGVmYXVsdE9yQnl0ZVNvdXJjZTxSPiB7XG4gIGFzc2VydERpY3Rpb25hcnkoc291cmNlLCBjb250ZXh0KTtcbiAgY29uc3Qgb3JpZ2luYWwgPSBzb3VyY2UgYXMgKFVuZGVybHlpbmdEZWZhdWx0T3JCeXRlU291cmNlPFI+IHwgbnVsbCk7XG4gIGNvbnN0IGF1dG9BbGxvY2F0ZUNodW5rU2l6ZSA9IG9yaWdpbmFsPy5hdXRvQWxsb2NhdGVDaHVua1NpemU7XG4gIGNvbnN0IGNhbmNlbCA9IG9yaWdpbmFsPy5jYW5jZWw7XG4gIGNvbnN0IHB1bGwgPSBvcmlnaW5hbD8ucHVsbDtcbiAgY29uc3Qgc3RhcnQgPSBvcmlnaW5hbD8uc3RhcnQ7XG4gIGNvbnN0IHR5cGUgPSBvcmlnaW5hbD8udHlwZTtcbiAgcmV0dXJuIHtcbiAgICBhdXRvQWxsb2NhdGVDaHVua1NpemU6IGF1dG9BbGxvY2F0ZUNodW5rU2l6ZSA9PT0gdW5kZWZpbmVkID9cbiAgICAgIHVuZGVmaW5lZCA6XG4gICAgICBjb252ZXJ0VW5zaWduZWRMb25nTG9uZ1dpdGhFbmZvcmNlUmFuZ2UoXG4gICAgICAgIGF1dG9BbGxvY2F0ZUNodW5rU2l6ZSxcbiAgICAgICAgYCR7Y29udGV4dH0gaGFzIG1lbWJlciAnYXV0b0FsbG9jYXRlQ2h1bmtTaXplJyB0aGF0YFxuICAgICAgKSxcbiAgICBjYW5jZWw6IGNhbmNlbCA9PT0gdW5kZWZpbmVkID9cbiAgICAgIHVuZGVmaW5lZCA6XG4gICAgICBjb252ZXJ0VW5kZXJseWluZ1NvdXJjZUNhbmNlbENhbGxiYWNrKGNhbmNlbCwgb3JpZ2luYWwhLCBgJHtjb250ZXh0fSBoYXMgbWVtYmVyICdjYW5jZWwnIHRoYXRgKSxcbiAgICBwdWxsOiBwdWxsID09PSB1bmRlZmluZWQgP1xuICAgICAgdW5kZWZpbmVkIDpcbiAgICAgIGNvbnZlcnRVbmRlcmx5aW5nU291cmNlUHVsbENhbGxiYWNrKHB1bGwsIG9yaWdpbmFsISwgYCR7Y29udGV4dH0gaGFzIG1lbWJlciAncHVsbCcgdGhhdGApLFxuICAgIHN0YXJ0OiBzdGFydCA9PT0gdW5kZWZpbmVkID9cbiAgICAgIHVuZGVmaW5lZCA6XG4gICAgICBjb252ZXJ0VW5kZXJseWluZ1NvdXJjZVN0YXJ0Q2FsbGJhY2soc3RhcnQsIG9yaWdpbmFsISwgYCR7Y29udGV4dH0gaGFzIG1lbWJlciAnc3RhcnQnIHRoYXRgKSxcbiAgICB0eXBlOiB0eXBlID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWQgOiBjb252ZXJ0UmVhZGFibGVTdHJlYW1UeXBlKHR5cGUsIGAke2NvbnRleHR9IGhhcyBtZW1iZXIgJ3R5cGUnIHRoYXRgKVxuICB9O1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0VW5kZXJseWluZ1NvdXJjZUNhbmNlbENhbGxiYWNrKFxuICBmbjogVW5kZXJseWluZ1NvdXJjZUNhbmNlbENhbGxiYWNrLFxuICBvcmlnaW5hbDogVW5kZXJseWluZ0RlZmF1bHRPckJ5dGVTb3VyY2UsXG4gIGNvbnRleHQ6IHN0cmluZ1xuKTogKHJlYXNvbjogYW55KSA9PiBQcm9taXNlPHZvaWQ+IHtcbiAgYXNzZXJ0RnVuY3Rpb24oZm4sIGNvbnRleHQpO1xuICByZXR1cm4gKHJlYXNvbjogYW55KSA9PiBwcm9taXNlQ2FsbChmbiwgb3JpZ2luYWwsIFtyZWFzb25dKTtcbn1cblxuZnVuY3Rpb24gY29udmVydFVuZGVybHlpbmdTb3VyY2VQdWxsQ2FsbGJhY2s8Uj4oXG4gIGZuOiBVbmRlcmx5aW5nRGVmYXVsdE9yQnl0ZVNvdXJjZVB1bGxDYWxsYmFjazxSPixcbiAgb3JpZ2luYWw6IFVuZGVybHlpbmdEZWZhdWx0T3JCeXRlU291cmNlPFI+LFxuICBjb250ZXh0OiBzdHJpbmdcbik6IChjb250cm9sbGVyOiBSZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXI8Uj4pID0+IFByb21pc2U8dm9pZD4ge1xuICBhc3NlcnRGdW5jdGlvbihmbiwgY29udGV4dCk7XG4gIHJldHVybiAoY29udHJvbGxlcjogUmVhZGFibGVTdHJlYW1Db250cm9sbGVyPFI+KSA9PiBwcm9taXNlQ2FsbChmbiwgb3JpZ2luYWwsIFtjb250cm9sbGVyXSk7XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRVbmRlcmx5aW5nU291cmNlU3RhcnRDYWxsYmFjazxSPihcbiAgZm46IFVuZGVybHlpbmdEZWZhdWx0T3JCeXRlU291cmNlU3RhcnRDYWxsYmFjazxSPixcbiAgb3JpZ2luYWw6IFVuZGVybHlpbmdEZWZhdWx0T3JCeXRlU291cmNlPFI+LFxuICBjb250ZXh0OiBzdHJpbmdcbik6IFVuZGVybHlpbmdEZWZhdWx0T3JCeXRlU291cmNlU3RhcnRDYWxsYmFjazxSPiB7XG4gIGFzc2VydEZ1bmN0aW9uKGZuLCBjb250ZXh0KTtcbiAgcmV0dXJuIChjb250cm9sbGVyOiBSZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXI8Uj4pID0+IHJlZmxlY3RDYWxsKGZuLCBvcmlnaW5hbCwgW2NvbnRyb2xsZXJdKTtcbn1cblxuZnVuY3Rpb24gY29udmVydFJlYWRhYmxlU3RyZWFtVHlwZSh0eXBlOiBzdHJpbmcsIGNvbnRleHQ6IHN0cmluZyk6ICdieXRlcycge1xuICB0eXBlID0gYCR7dHlwZX1gO1xuICBpZiAodHlwZSAhPT0gJ2J5dGVzJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYCR7Y29udGV4dH0gJyR7dHlwZX0nIGlzIG5vdCBhIHZhbGlkIGVudW1lcmF0aW9uIHZhbHVlIGZvciBSZWFkYWJsZVN0cmVhbVR5cGVgKTtcbiAgfVxuICByZXR1cm4gdHlwZTtcbn1cbiIsICJpbXBvcnQgeyBhc3NlcnREaWN0aW9uYXJ5IH0gZnJvbSAnLi9iYXNpYyc7XG5pbXBvcnQgdHlwZSB7XG4gIFJlYWRhYmxlU3RyZWFtSXRlcmF0b3JPcHRpb25zLFxuICBWYWxpZGF0ZWRSZWFkYWJsZVN0cmVhbUl0ZXJhdG9yT3B0aW9uc1xufSBmcm9tICcuLi9yZWFkYWJsZS1zdHJlYW0vaXRlcmF0b3Itb3B0aW9ucyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0SXRlcmF0b3JPcHRpb25zKG9wdGlvbnM6IFJlYWRhYmxlU3RyZWFtSXRlcmF0b3JPcHRpb25zIHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6IHN0cmluZyk6IFZhbGlkYXRlZFJlYWRhYmxlU3RyZWFtSXRlcmF0b3JPcHRpb25zIHtcbiAgYXNzZXJ0RGljdGlvbmFyeShvcHRpb25zLCBjb250ZXh0KTtcbiAgY29uc3QgcHJldmVudENhbmNlbCA9IG9wdGlvbnM/LnByZXZlbnRDYW5jZWw7XG4gIHJldHVybiB7IHByZXZlbnRDYW5jZWw6IEJvb2xlYW4ocHJldmVudENhbmNlbCkgfTtcbn1cbiIsICJpbXBvcnQgeyBhc3NlcnREaWN0aW9uYXJ5IH0gZnJvbSAnLi9iYXNpYyc7XG5pbXBvcnQgdHlwZSB7IFN0cmVhbVBpcGVPcHRpb25zLCBWYWxpZGF0ZWRTdHJlYW1QaXBlT3B0aW9ucyB9IGZyb20gJy4uL3JlYWRhYmxlLXN0cmVhbS9waXBlLW9wdGlvbnMnO1xuaW1wb3J0IHsgdHlwZSBBYm9ydFNpZ25hbCwgaXNBYm9ydFNpZ25hbCB9IGZyb20gJy4uL2Fib3J0LXNpZ25hbCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0UGlwZU9wdGlvbnMob3B0aW9uczogU3RyZWFtUGlwZU9wdGlvbnMgfCBudWxsIHwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiBzdHJpbmcpOiBWYWxpZGF0ZWRTdHJlYW1QaXBlT3B0aW9ucyB7XG4gIGFzc2VydERpY3Rpb25hcnkob3B0aW9ucywgY29udGV4dCk7XG4gIGNvbnN0IHByZXZlbnRBYm9ydCA9IG9wdGlvbnM/LnByZXZlbnRBYm9ydDtcbiAgY29uc3QgcHJldmVudENhbmNlbCA9IG9wdGlvbnM/LnByZXZlbnRDYW5jZWw7XG4gIGNvbnN0IHByZXZlbnRDbG9zZSA9IG9wdGlvbnM/LnByZXZlbnRDbG9zZTtcbiAgY29uc3Qgc2lnbmFsID0gb3B0aW9ucz8uc2lnbmFsO1xuICBpZiAoc2lnbmFsICE9PSB1bmRlZmluZWQpIHtcbiAgICBhc3NlcnRBYm9ydFNpZ25hbChzaWduYWwsIGAke2NvbnRleHR9IGhhcyBtZW1iZXIgJ3NpZ25hbCcgdGhhdGApO1xuICB9XG4gIHJldHVybiB7XG4gICAgcHJldmVudEFib3J0OiBCb29sZWFuKHByZXZlbnRBYm9ydCksXG4gICAgcHJldmVudENhbmNlbDogQm9vbGVhbihwcmV2ZW50Q2FuY2VsKSxcbiAgICBwcmV2ZW50Q2xvc2U6IEJvb2xlYW4ocHJldmVudENsb3NlKSxcbiAgICBzaWduYWxcbiAgfTtcbn1cblxuZnVuY3Rpb24gYXNzZXJ0QWJvcnRTaWduYWwoc2lnbmFsOiB1bmtub3duLCBjb250ZXh0OiBzdHJpbmcpOiBhc3NlcnRzIHNpZ25hbCBpcyBBYm9ydFNpZ25hbCB7XG4gIGlmICghaXNBYm9ydFNpZ25hbChzaWduYWwpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgJHtjb250ZXh0fSBpcyBub3QgYW4gQWJvcnRTaWduYWwuYCk7XG4gIH1cbn1cbiIsICJpbXBvcnQgeyBhc3NlcnREaWN0aW9uYXJ5LCBhc3NlcnRSZXF1aXJlZEZpZWxkIH0gZnJvbSAnLi9iYXNpYyc7XG5pbXBvcnQgeyBSZWFkYWJsZVN0cmVhbSB9IGZyb20gJy4uL3JlYWRhYmxlLXN0cmVhbSc7XG5pbXBvcnQgeyBXcml0YWJsZVN0cmVhbSB9IGZyb20gJy4uL3dyaXRhYmxlLXN0cmVhbSc7XG5pbXBvcnQgeyBhc3NlcnRSZWFkYWJsZVN0cmVhbSB9IGZyb20gJy4vcmVhZGFibGUtc3RyZWFtJztcbmltcG9ydCB7IGFzc2VydFdyaXRhYmxlU3RyZWFtIH0gZnJvbSAnLi93cml0YWJsZS1zdHJlYW0nO1xuXG5leHBvcnQgZnVuY3Rpb24gY29udmVydFJlYWRhYmxlV3JpdGFibGVQYWlyPFJTIGV4dGVuZHMgUmVhZGFibGVTdHJlYW0sIFdTIGV4dGVuZHMgV3JpdGFibGVTdHJlYW0+KFxuICBwYWlyOiB7IHJlYWRhYmxlOiBSUzsgd3JpdGFibGU6IFdTIH0gfCBudWxsIHwgdW5kZWZpbmVkLFxuICBjb250ZXh0OiBzdHJpbmdcbik6IHsgcmVhZGFibGU6IFJTOyB3cml0YWJsZTogV1MgfSB7XG4gIGFzc2VydERpY3Rpb25hcnkocGFpciwgY29udGV4dCk7XG5cbiAgY29uc3QgcmVhZGFibGUgPSBwYWlyPy5yZWFkYWJsZTtcbiAgYXNzZXJ0UmVxdWlyZWRGaWVsZChyZWFkYWJsZSwgJ3JlYWRhYmxlJywgJ1JlYWRhYmxlV3JpdGFibGVQYWlyJyk7XG4gIGFzc2VydFJlYWRhYmxlU3RyZWFtKHJlYWRhYmxlLCBgJHtjb250ZXh0fSBoYXMgbWVtYmVyICdyZWFkYWJsZScgdGhhdGApO1xuXG4gIGNvbnN0IHdyaXRhYmxlID0gcGFpcj8ud3JpdGFibGU7XG4gIGFzc2VydFJlcXVpcmVkRmllbGQod3JpdGFibGUsICd3cml0YWJsZScsICdSZWFkYWJsZVdyaXRhYmxlUGFpcicpO1xuICBhc3NlcnRXcml0YWJsZVN0cmVhbSh3cml0YWJsZSwgYCR7Y29udGV4dH0gaGFzIG1lbWJlciAnd3JpdGFibGUnIHRoYXRgKTtcblxuICByZXR1cm4geyByZWFkYWJsZSwgd3JpdGFibGUgfTtcbn1cbiIsICJpbXBvcnQgYXNzZXJ0IGZyb20gJy4uL3N0dWIvYXNzZXJ0JztcbmltcG9ydCB7XG4gIHByb21pc2VSZWplY3RlZFdpdGgsXG4gIHByb21pc2VSZXNvbHZlZFdpdGgsXG4gIHNldFByb21pc2VJc0hhbmRsZWRUb1RydWUsXG4gIHRyYW5zZm9ybVByb21pc2VXaXRoXG59IGZyb20gJy4vaGVscGVycy93ZWJpZGwnO1xuaW1wb3J0IHR5cGUgeyBRdWV1aW5nU3RyYXRlZ3ksIFF1ZXVpbmdTdHJhdGVneVNpemVDYWxsYmFjayB9IGZyb20gJy4vcXVldWluZy1zdHJhdGVneSc7XG5pbXBvcnQgeyBBY3F1aXJlUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9yLCB0eXBlIFJlYWRhYmxlU3RyZWFtQXN5bmNJdGVyYXRvciB9IGZyb20gJy4vcmVhZGFibGUtc3RyZWFtL2FzeW5jLWl0ZXJhdG9yJztcbmltcG9ydCB7IGRlZmF1bHRSZWFkZXJDbG9zZWRQcm9taXNlUmVqZWN0LCBkZWZhdWx0UmVhZGVyQ2xvc2VkUHJvbWlzZVJlc29sdmUgfSBmcm9tICcuL3JlYWRhYmxlLXN0cmVhbS9nZW5lcmljLXJlYWRlcic7XG5pbXBvcnQge1xuICBBY3F1aXJlUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyLFxuICBJc1JlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcixcbiAgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyLFxuICBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXJFcnJvclJlYWRSZXF1ZXN0cyxcbiAgdHlwZSBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkUmVzdWx0XG59IGZyb20gJy4vcmVhZGFibGUtc3RyZWFtL2RlZmF1bHQtcmVhZGVyJztcbmltcG9ydCB7XG4gIEFjcXVpcmVSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIsXG4gIElzUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyLFxuICBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIsXG4gIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlckVycm9yUmVhZEludG9SZXF1ZXN0cyxcbiAgdHlwZSBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkUmVzdWx0XG59IGZyb20gJy4vcmVhZGFibGUtc3RyZWFtL2J5b2ItcmVhZGVyJztcbmltcG9ydCB7IFJlYWRhYmxlU3RyZWFtUGlwZVRvIH0gZnJvbSAnLi9yZWFkYWJsZS1zdHJlYW0vcGlwZSc7XG5pbXBvcnQgeyBSZWFkYWJsZVN0cmVhbVRlZSB9IGZyb20gJy4vcmVhZGFibGUtc3RyZWFtL3RlZSc7XG5pbXBvcnQgeyBSZWFkYWJsZVN0cmVhbUZyb20gfSBmcm9tICcuL3JlYWRhYmxlLXN0cmVhbS9mcm9tJztcbmltcG9ydCB7IElzV3JpdGFibGVTdHJlYW0sIElzV3JpdGFibGVTdHJlYW1Mb2NrZWQsIFdyaXRhYmxlU3RyZWFtIH0gZnJvbSAnLi93cml0YWJsZS1zdHJlYW0nO1xuaW1wb3J0IHsgU2ltcGxlUXVldWUgfSBmcm9tICcuL3NpbXBsZS1xdWV1ZSc7XG5pbXBvcnQge1xuICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyLFxuICBSZWFkYWJsZVN0cmVhbUJZT0JSZXF1ZXN0LFxuICBTZXRVcFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIsXG4gIFNldFVwUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckZyb21VbmRlcmx5aW5nU291cmNlXG59IGZyb20gJy4vcmVhZGFibGUtc3RyZWFtL2J5dGUtc3RyZWFtLWNvbnRyb2xsZXInO1xuaW1wb3J0IHtcbiAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcixcbiAgU2V0VXBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyLFxuICBTZXRVcFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJGcm9tVW5kZXJseWluZ1NvdXJjZVxufSBmcm9tICcuL3JlYWRhYmxlLXN0cmVhbS9kZWZhdWx0LWNvbnRyb2xsZXInO1xuaW1wb3J0IHR5cGUge1xuICBVbmRlcmx5aW5nQnl0ZVNvdXJjZSxcbiAgVW5kZXJseWluZ0J5dGVTb3VyY2VQdWxsQ2FsbGJhY2ssXG4gIFVuZGVybHlpbmdCeXRlU291cmNlU3RhcnRDYWxsYmFjayxcbiAgVW5kZXJseWluZ1NvdXJjZSxcbiAgVW5kZXJseWluZ1NvdXJjZUNhbmNlbENhbGxiYWNrLFxuICBVbmRlcmx5aW5nU291cmNlUHVsbENhbGxiYWNrLFxuICBVbmRlcmx5aW5nU291cmNlU3RhcnRDYWxsYmFja1xufSBmcm9tICcuL3JlYWRhYmxlLXN0cmVhbS91bmRlcmx5aW5nLXNvdXJjZSc7XG5pbXBvcnQgeyBub29wIH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHsgc2V0RnVuY3Rpb25OYW1lLCB0eXBlSXNPYmplY3QgfSBmcm9tICcuL2hlbHBlcnMvbWlzY2VsbGFuZW91cyc7XG5pbXBvcnQgeyBDcmVhdGVBcnJheUZyb21MaXN0LCBTeW1ib2xBc3luY0l0ZXJhdG9yIH0gZnJvbSAnLi9hYnN0cmFjdC1vcHMvZWNtYXNjcmlwdCc7XG5pbXBvcnQgeyBDYW5jZWxTdGVwcyB9IGZyb20gJy4vYWJzdHJhY3Qtb3BzL2ludGVybmFsLW1ldGhvZHMnO1xuaW1wb3J0IHsgSXNOb25OZWdhdGl2ZU51bWJlciB9IGZyb20gJy4vYWJzdHJhY3Qtb3BzL21pc2NlbGxhbmVvdXMnO1xuaW1wb3J0IHsgYXNzZXJ0T2JqZWN0LCBhc3NlcnRSZXF1aXJlZEFyZ3VtZW50IH0gZnJvbSAnLi92YWxpZGF0b3JzL2Jhc2ljJztcbmltcG9ydCB7IGNvbnZlcnRRdWV1aW5nU3RyYXRlZ3kgfSBmcm9tICcuL3ZhbGlkYXRvcnMvcXVldWluZy1zdHJhdGVneSc7XG5pbXBvcnQgeyBFeHRyYWN0SGlnaFdhdGVyTWFyaywgRXh0cmFjdFNpemVBbGdvcml0aG0gfSBmcm9tICcuL2Fic3RyYWN0LW9wcy9xdWV1aW5nLXN0cmF0ZWd5JztcbmltcG9ydCB7IGNvbnZlcnRVbmRlcmx5aW5nRGVmYXVsdE9yQnl0ZVNvdXJjZSB9IGZyb20gJy4vdmFsaWRhdG9ycy91bmRlcmx5aW5nLXNvdXJjZSc7XG5pbXBvcnQgdHlwZSB7XG4gIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlclJlYWRPcHRpb25zLFxuICBSZWFkYWJsZVN0cmVhbUdldFJlYWRlck9wdGlvbnNcbn0gZnJvbSAnLi9yZWFkYWJsZS1zdHJlYW0vcmVhZGVyLW9wdGlvbnMnO1xuaW1wb3J0IHsgY29udmVydFJlYWRlck9wdGlvbnMgfSBmcm9tICcuL3ZhbGlkYXRvcnMvcmVhZGVyLW9wdGlvbnMnO1xuaW1wb3J0IHR5cGUgeyBTdHJlYW1QaXBlT3B0aW9ucywgVmFsaWRhdGVkU3RyZWFtUGlwZU9wdGlvbnMgfSBmcm9tICcuL3JlYWRhYmxlLXN0cmVhbS9waXBlLW9wdGlvbnMnO1xuaW1wb3J0IHR5cGUgeyBSZWFkYWJsZVN0cmVhbUl0ZXJhdG9yT3B0aW9ucyB9IGZyb20gJy4vcmVhZGFibGUtc3RyZWFtL2l0ZXJhdG9yLW9wdGlvbnMnO1xuaW1wb3J0IHsgY29udmVydEl0ZXJhdG9yT3B0aW9ucyB9IGZyb20gJy4vdmFsaWRhdG9ycy9pdGVyYXRvci1vcHRpb25zJztcbmltcG9ydCB7IGNvbnZlcnRQaXBlT3B0aW9ucyB9IGZyb20gJy4vdmFsaWRhdG9ycy9waXBlLW9wdGlvbnMnO1xuaW1wb3J0IHR5cGUgeyBSZWFkYWJsZVdyaXRhYmxlUGFpciB9IGZyb20gJy4vcmVhZGFibGUtc3RyZWFtL3JlYWRhYmxlLXdyaXRhYmxlLXBhaXInO1xuaW1wb3J0IHsgY29udmVydFJlYWRhYmxlV3JpdGFibGVQYWlyIH0gZnJvbSAnLi92YWxpZGF0b3JzL3JlYWRhYmxlLXdyaXRhYmxlLXBhaXInO1xuaW1wb3J0IHR5cGUgeyBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXJMaWtlLCBSZWFkYWJsZVN0cmVhbUxpa2UgfSBmcm9tICcuL3JlYWRhYmxlLXN0cmVhbS9yZWFkYWJsZS1zdHJlYW0tbGlrZSc7XG5pbXBvcnQgdHlwZSB7IE5vblNoYXJlZCB9IGZyb20gJy4vaGVscGVycy9hcnJheS1idWZmZXItdmlldyc7XG5cbmV4cG9ydCB0eXBlIERlZmF1bHRSZWFkYWJsZVN0cmVhbTxSID0gYW55PiA9IFJlYWRhYmxlU3RyZWFtPFI+ICYge1xuICBfcmVhZGFibGVTdHJlYW1Db250cm9sbGVyOiBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyPFI+XG59O1xuXG5leHBvcnQgdHlwZSBSZWFkYWJsZUJ5dGVTdHJlYW0gPSBSZWFkYWJsZVN0cmVhbTxOb25TaGFyZWQ8VWludDhBcnJheT4+ICYge1xuICBfcmVhZGFibGVTdHJlYW1Db250cm9sbGVyOiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyXG59O1xuXG50eXBlIFJlYWRhYmxlU3RyZWFtU3RhdGUgPSAncmVhZGFibGUnIHwgJ2Nsb3NlZCcgfCAnZXJyb3JlZCc7XG5cbi8qKlxuICogQSByZWFkYWJsZSBzdHJlYW0gcmVwcmVzZW50cyBhIHNvdXJjZSBvZiBkYXRhLCBmcm9tIHdoaWNoIHlvdSBjYW4gcmVhZC5cbiAqXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjbGFzcyBSZWFkYWJsZVN0cmVhbTxSID0gYW55PiBpbXBsZW1lbnRzIEFzeW5jSXRlcmFibGU8Uj4ge1xuICAvKiogQGludGVybmFsICovXG4gIF9zdGF0ZSE6IFJlYWRhYmxlU3RyZWFtU3RhdGU7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3JlYWRlcjogUmVhZGFibGVTdHJlYW1SZWFkZXI8Uj4gfCB1bmRlZmluZWQ7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3N0b3JlZEVycm9yOiBhbnk7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2Rpc3R1cmJlZCE6IGJvb2xlYW47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlciE6IFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8Uj4gfCBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyO1xuXG4gIGNvbnN0cnVjdG9yKHVuZGVybHlpbmdTb3VyY2U6IFVuZGVybHlpbmdCeXRlU291cmNlLCBzdHJhdGVneT86IHsgaGlnaFdhdGVyTWFyaz86IG51bWJlcjsgc2l6ZT86IHVuZGVmaW5lZCB9KTtcbiAgY29uc3RydWN0b3IodW5kZXJseWluZ1NvdXJjZT86IFVuZGVybHlpbmdTb3VyY2U8Uj4sIHN0cmF0ZWd5PzogUXVldWluZ1N0cmF0ZWd5PFI+KTtcbiAgY29uc3RydWN0b3IocmF3VW5kZXJseWluZ1NvdXJjZTogVW5kZXJseWluZ1NvdXJjZTxSPiB8IFVuZGVybHlpbmdCeXRlU291cmNlIHwgbnVsbCB8IHVuZGVmaW5lZCA9IHt9LFxuICAgICAgICAgICAgICByYXdTdHJhdGVneTogUXVldWluZ1N0cmF0ZWd5PFI+IHwgbnVsbCB8IHVuZGVmaW5lZCA9IHt9KSB7XG4gICAgaWYgKHJhd1VuZGVybHlpbmdTb3VyY2UgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmF3VW5kZXJseWluZ1NvdXJjZSA9IG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFzc2VydE9iamVjdChyYXdVbmRlcmx5aW5nU291cmNlLCAnRmlyc3QgcGFyYW1ldGVyJyk7XG4gICAgfVxuXG4gICAgY29uc3Qgc3RyYXRlZ3kgPSBjb252ZXJ0UXVldWluZ1N0cmF0ZWd5KHJhd1N0cmF0ZWd5LCAnU2Vjb25kIHBhcmFtZXRlcicpO1xuICAgIGNvbnN0IHVuZGVybHlpbmdTb3VyY2UgPSBjb252ZXJ0VW5kZXJseWluZ0RlZmF1bHRPckJ5dGVTb3VyY2UocmF3VW5kZXJseWluZ1NvdXJjZSwgJ0ZpcnN0IHBhcmFtZXRlcicpO1xuXG4gICAgSW5pdGlhbGl6ZVJlYWRhYmxlU3RyZWFtKHRoaXMpO1xuXG4gICAgaWYgKHVuZGVybHlpbmdTb3VyY2UudHlwZSA9PT0gJ2J5dGVzJykge1xuICAgICAgaWYgKHN0cmF0ZWd5LnNpemUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVGhlIHN0cmF0ZWd5IGZvciBhIGJ5dGUgc3RyZWFtIGNhbm5vdCBoYXZlIGEgc2l6ZSBmdW5jdGlvbicpO1xuICAgICAgfVxuICAgICAgY29uc3QgaGlnaFdhdGVyTWFyayA9IEV4dHJhY3RIaWdoV2F0ZXJNYXJrKHN0cmF0ZWd5LCAwKTtcbiAgICAgIFNldFVwUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckZyb21VbmRlcmx5aW5nU291cmNlKFxuICAgICAgICB0aGlzIGFzIHVua25vd24gYXMgUmVhZGFibGVCeXRlU3RyZWFtLFxuICAgICAgICB1bmRlcmx5aW5nU291cmNlLFxuICAgICAgICBoaWdoV2F0ZXJNYXJrXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBhc3NlcnQodW5kZXJseWluZ1NvdXJjZS50eXBlID09PSB1bmRlZmluZWQpO1xuICAgICAgY29uc3Qgc2l6ZUFsZ29yaXRobSA9IEV4dHJhY3RTaXplQWxnb3JpdGhtKHN0cmF0ZWd5KTtcbiAgICAgIGNvbnN0IGhpZ2hXYXRlck1hcmsgPSBFeHRyYWN0SGlnaFdhdGVyTWFyayhzdHJhdGVneSwgMSk7XG4gICAgICBTZXRVcFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJGcm9tVW5kZXJseWluZ1NvdXJjZShcbiAgICAgICAgdGhpcyxcbiAgICAgICAgdW5kZXJseWluZ1NvdXJjZSxcbiAgICAgICAgaGlnaFdhdGVyTWFyayxcbiAgICAgICAgc2l6ZUFsZ29yaXRobVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogV2hldGhlciBvciBub3QgdGhlIHJlYWRhYmxlIHN0cmVhbSBpcyBsb2NrZWQgdG8gYSB7QGxpbmsgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyIHwgcmVhZGVyfS5cbiAgICovXG4gIGdldCBsb2NrZWQoKTogYm9vbGVhbiB7XG4gICAgaWYgKCFJc1JlYWRhYmxlU3RyZWFtKHRoaXMpKSB7XG4gICAgICB0aHJvdyBzdHJlYW1CcmFuZENoZWNrRXhjZXB0aW9uKCdsb2NrZWQnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gSXNSZWFkYWJsZVN0cmVhbUxvY2tlZCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYW5jZWxzIHRoZSBzdHJlYW0sIHNpZ25hbGluZyBhIGxvc3Mgb2YgaW50ZXJlc3QgaW4gdGhlIHN0cmVhbSBieSBhIGNvbnN1bWVyLlxuICAgKlxuICAgKiBUaGUgc3VwcGxpZWQgYHJlYXNvbmAgYXJndW1lbnQgd2lsbCBiZSBnaXZlbiB0byB0aGUgdW5kZXJseWluZyBzb3VyY2UncyB7QGxpbmsgVW5kZXJseWluZ1NvdXJjZS5jYW5jZWwgfCBjYW5jZWwoKX1cbiAgICogbWV0aG9kLCB3aGljaCBtaWdodCBvciBtaWdodCBub3QgdXNlIGl0LlxuICAgKi9cbiAgY2FuY2VsKHJlYXNvbjogYW55ID0gdW5kZWZpbmVkKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCFJc1JlYWRhYmxlU3RyZWFtKHRoaXMpKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChzdHJlYW1CcmFuZENoZWNrRXhjZXB0aW9uKCdjYW5jZWwnKSk7XG4gICAgfVxuXG4gICAgaWYgKElzUmVhZGFibGVTdHJlYW1Mb2NrZWQodGhpcykpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjYW5jZWwgYSBzdHJlYW0gdGhhdCBhbHJlYWR5IGhhcyBhIHJlYWRlcicpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gUmVhZGFibGVTdHJlYW1DYW5jZWwodGhpcywgcmVhc29uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEge0BsaW5rIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlcn0gYW5kIGxvY2tzIHRoZSBzdHJlYW0gdG8gdGhlIG5ldyByZWFkZXIuXG4gICAqXG4gICAqIFRoaXMgY2FsbCBiZWhhdmVzIHRoZSBzYW1lIHdheSBhcyB0aGUgbm8tYXJndW1lbnQgdmFyaWFudCwgZXhjZXB0IHRoYXQgaXQgb25seSB3b3JrcyBvbiByZWFkYWJsZSBieXRlIHN0cmVhbXMsXG4gICAqIGkuZS4gc3RyZWFtcyB3aGljaCB3ZXJlIGNvbnN0cnVjdGVkIHNwZWNpZmljYWxseSB3aXRoIHRoZSBhYmlsaXR5IHRvIGhhbmRsZSBcImJyaW5nIHlvdXIgb3duIGJ1ZmZlclwiIHJlYWRpbmcuXG4gICAqIFRoZSByZXR1cm5lZCBCWU9CIHJlYWRlciBwcm92aWRlcyB0aGUgYWJpbGl0eSB0byBkaXJlY3RseSByZWFkIGluZGl2aWR1YWwgY2h1bmtzIGZyb20gdGhlIHN0cmVhbSB2aWEgaXRzXG4gICAqIHtAbGluayBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIucmVhZCB8IHJlYWQoKX0gbWV0aG9kLCBpbnRvIGRldmVsb3Blci1zdXBwbGllZCBidWZmZXJzLCBhbGxvd2luZyBtb3JlIHByZWNpc2VcbiAgICogY29udHJvbCBvdmVyIGFsbG9jYXRpb24uXG4gICAqL1xuICBnZXRSZWFkZXIoeyBtb2RlIH06IHsgbW9kZTogJ2J5b2InIH0pOiBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXI7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEge0BsaW5rIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcn0gYW5kIGxvY2tzIHRoZSBzdHJlYW0gdG8gdGhlIG5ldyByZWFkZXIuXG4gICAqIFdoaWxlIHRoZSBzdHJlYW0gaXMgbG9ja2VkLCBubyBvdGhlciByZWFkZXIgY2FuIGJlIGFjcXVpcmVkIHVudGlsIHRoaXMgb25lIGlzIHJlbGVhc2VkLlxuICAgKlxuICAgKiBUaGlzIGZ1bmN0aW9uYWxpdHkgaXMgZXNwZWNpYWxseSB1c2VmdWwgZm9yIGNyZWF0aW5nIGFic3RyYWN0aW9ucyB0aGF0IGRlc2lyZSB0aGUgYWJpbGl0eSB0byBjb25zdW1lIGEgc3RyZWFtXG4gICAqIGluIGl0cyBlbnRpcmV0eS4gQnkgZ2V0dGluZyBhIHJlYWRlciBmb3IgdGhlIHN0cmVhbSwgeW91IGNhbiBlbnN1cmUgbm9ib2R5IGVsc2UgY2FuIGludGVybGVhdmUgcmVhZHMgd2l0aCB5b3Vyc1xuICAgKiBvciBjYW5jZWwgdGhlIHN0cmVhbSwgd2hpY2ggd291bGQgaW50ZXJmZXJlIHdpdGggeW91ciBhYnN0cmFjdGlvbi5cbiAgICovXG4gIGdldFJlYWRlcigpOiBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXI8Uj47XG4gIGdldFJlYWRlcihcbiAgICByYXdPcHRpb25zOiBSZWFkYWJsZVN0cmVhbUdldFJlYWRlck9wdGlvbnMgfCBudWxsIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkXG4gICk6IFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcjxSPiB8IFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlciB7XG4gICAgaWYgKCFJc1JlYWRhYmxlU3RyZWFtKHRoaXMpKSB7XG4gICAgICB0aHJvdyBzdHJlYW1CcmFuZENoZWNrRXhjZXB0aW9uKCdnZXRSZWFkZXInKTtcbiAgICB9XG5cbiAgICBjb25zdCBvcHRpb25zID0gY29udmVydFJlYWRlck9wdGlvbnMocmF3T3B0aW9ucywgJ0ZpcnN0IHBhcmFtZXRlcicpO1xuXG4gICAgaWYgKG9wdGlvbnMubW9kZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gQWNxdWlyZVJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcih0aGlzKTtcbiAgICB9XG5cbiAgICBhc3NlcnQob3B0aW9ucy5tb2RlID09PSAnYnlvYicpO1xuICAgIHJldHVybiBBY3F1aXJlUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyKHRoaXMgYXMgdW5rbm93biBhcyBSZWFkYWJsZUJ5dGVTdHJlYW0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFByb3ZpZGVzIGEgY29udmVuaWVudCwgY2hhaW5hYmxlIHdheSBvZiBwaXBpbmcgdGhpcyByZWFkYWJsZSBzdHJlYW0gdGhyb3VnaCBhIHRyYW5zZm9ybSBzdHJlYW1cbiAgICogKG9yIGFueSBvdGhlciBgeyB3cml0YWJsZSwgcmVhZGFibGUgfWAgcGFpcikuIEl0IHNpbXBseSB7QGxpbmsgUmVhZGFibGVTdHJlYW0ucGlwZVRvIHwgcGlwZXN9IHRoZSBzdHJlYW1cbiAgICogaW50byB0aGUgd3JpdGFibGUgc2lkZSBvZiB0aGUgc3VwcGxpZWQgcGFpciwgYW5kIHJldHVybnMgdGhlIHJlYWRhYmxlIHNpZGUgZm9yIGZ1cnRoZXIgdXNlLlxuICAgKlxuICAgKiBQaXBpbmcgYSBzdHJlYW0gd2lsbCBsb2NrIGl0IGZvciB0aGUgZHVyYXRpb24gb2YgdGhlIHBpcGUsIHByZXZlbnRpbmcgYW55IG90aGVyIGNvbnN1bWVyIGZyb20gYWNxdWlyaW5nIGEgcmVhZGVyLlxuICAgKi9cbiAgcGlwZVRocm91Z2g8UlMgZXh0ZW5kcyBSZWFkYWJsZVN0cmVhbT4oXG4gICAgdHJhbnNmb3JtOiB7IHJlYWRhYmxlOiBSUzsgd3JpdGFibGU6IFdyaXRhYmxlU3RyZWFtPFI+IH0sXG4gICAgb3B0aW9ucz86IFN0cmVhbVBpcGVPcHRpb25zXG4gICk6IFJTO1xuICBwaXBlVGhyb3VnaDxSUyBleHRlbmRzIFJlYWRhYmxlU3RyZWFtPihcbiAgICByYXdUcmFuc2Zvcm06IHsgcmVhZGFibGU6IFJTOyB3cml0YWJsZTogV3JpdGFibGVTdHJlYW08Uj4gfSB8IG51bGwgfCB1bmRlZmluZWQsXG4gICAgcmF3T3B0aW9uczogU3RyZWFtUGlwZU9wdGlvbnMgfCBudWxsIHwgdW5kZWZpbmVkID0ge31cbiAgKTogUlMge1xuICAgIGlmICghSXNSZWFkYWJsZVN0cmVhbSh0aGlzKSkge1xuICAgICAgdGhyb3cgc3RyZWFtQnJhbmRDaGVja0V4Y2VwdGlvbigncGlwZVRocm91Z2gnKTtcbiAgICB9XG4gICAgYXNzZXJ0UmVxdWlyZWRBcmd1bWVudChyYXdUcmFuc2Zvcm0sIDEsICdwaXBlVGhyb3VnaCcpO1xuXG4gICAgY29uc3QgdHJhbnNmb3JtID0gY29udmVydFJlYWRhYmxlV3JpdGFibGVQYWlyKHJhd1RyYW5zZm9ybSwgJ0ZpcnN0IHBhcmFtZXRlcicpO1xuICAgIGNvbnN0IG9wdGlvbnMgPSBjb252ZXJ0UGlwZU9wdGlvbnMocmF3T3B0aW9ucywgJ1NlY29uZCBwYXJhbWV0ZXInKTtcblxuICAgIGlmIChJc1JlYWRhYmxlU3RyZWFtTG9ja2VkKHRoaXMpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdSZWFkYWJsZVN0cmVhbS5wcm90b3R5cGUucGlwZVRocm91Z2ggY2Fubm90IGJlIHVzZWQgb24gYSBsb2NrZWQgUmVhZGFibGVTdHJlYW0nKTtcbiAgICB9XG4gICAgaWYgKElzV3JpdGFibGVTdHJlYW1Mb2NrZWQodHJhbnNmb3JtLndyaXRhYmxlKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignUmVhZGFibGVTdHJlYW0ucHJvdG90eXBlLnBpcGVUaHJvdWdoIGNhbm5vdCBiZSB1c2VkIG9uIGEgbG9ja2VkIFdyaXRhYmxlU3RyZWFtJyk7XG4gICAgfVxuXG4gICAgY29uc3QgcHJvbWlzZSA9IFJlYWRhYmxlU3RyZWFtUGlwZVRvKFxuICAgICAgdGhpcywgdHJhbnNmb3JtLndyaXRhYmxlLCBvcHRpb25zLnByZXZlbnRDbG9zZSwgb3B0aW9ucy5wcmV2ZW50QWJvcnQsIG9wdGlvbnMucHJldmVudENhbmNlbCwgb3B0aW9ucy5zaWduYWxcbiAgICApO1xuXG4gICAgc2V0UHJvbWlzZUlzSGFuZGxlZFRvVHJ1ZShwcm9taXNlKTtcblxuICAgIHJldHVybiB0cmFuc2Zvcm0ucmVhZGFibGU7XG4gIH1cblxuICAvKipcbiAgICogUGlwZXMgdGhpcyByZWFkYWJsZSBzdHJlYW0gdG8gYSBnaXZlbiB3cml0YWJsZSBzdHJlYW0uIFRoZSB3YXkgaW4gd2hpY2ggdGhlIHBpcGluZyBwcm9jZXNzIGJlaGF2ZXMgdW5kZXJcbiAgICogdmFyaW91cyBlcnJvciBjb25kaXRpb25zIGNhbiBiZSBjdXN0b21pemVkIHdpdGggYSBudW1iZXIgb2YgcGFzc2VkIG9wdGlvbnMuIEl0IHJldHVybnMgYSBwcm9taXNlIHRoYXQgZnVsZmlsbHNcbiAgICogd2hlbiB0aGUgcGlwaW5nIHByb2Nlc3MgY29tcGxldGVzIHN1Y2Nlc3NmdWxseSwgb3IgcmVqZWN0cyBpZiBhbnkgZXJyb3JzIHdlcmUgZW5jb3VudGVyZWQuXG4gICAqXG4gICAqIFBpcGluZyBhIHN0cmVhbSB3aWxsIGxvY2sgaXQgZm9yIHRoZSBkdXJhdGlvbiBvZiB0aGUgcGlwZSwgcHJldmVudGluZyBhbnkgb3RoZXIgY29uc3VtZXIgZnJvbSBhY3F1aXJpbmcgYSByZWFkZXIuXG4gICAqL1xuICBwaXBlVG8oZGVzdGluYXRpb246IFdyaXRhYmxlU3RyZWFtPFI+LCBvcHRpb25zPzogU3RyZWFtUGlwZU9wdGlvbnMpOiBQcm9taXNlPHZvaWQ+O1xuICBwaXBlVG8oZGVzdGluYXRpb246IFdyaXRhYmxlU3RyZWFtPFI+IHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgICAgICAgIHJhd09wdGlvbnM6IFN0cmVhbVBpcGVPcHRpb25zIHwgbnVsbCB8IHVuZGVmaW5lZCA9IHt9KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCFJc1JlYWRhYmxlU3RyZWFtKHRoaXMpKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChzdHJlYW1CcmFuZENoZWNrRXhjZXB0aW9uKCdwaXBlVG8nKSk7XG4gICAgfVxuXG4gICAgaWYgKGRlc3RpbmF0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKGBQYXJhbWV0ZXIgMSBpcyByZXF1aXJlZCBpbiAncGlwZVRvJy5gKTtcbiAgICB9XG4gICAgaWYgKCFJc1dyaXRhYmxlU3RyZWFtKGRlc3RpbmF0aW9uKSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoXG4gICAgICAgIG5ldyBUeXBlRXJyb3IoYFJlYWRhYmxlU3RyZWFtLnByb3RvdHlwZS5waXBlVG8ncyBmaXJzdCBhcmd1bWVudCBtdXN0IGJlIGEgV3JpdGFibGVTdHJlYW1gKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBsZXQgb3B0aW9uczogVmFsaWRhdGVkU3RyZWFtUGlwZU9wdGlvbnM7XG4gICAgdHJ5IHtcbiAgICAgIG9wdGlvbnMgPSBjb252ZXJ0UGlwZU9wdGlvbnMocmF3T3B0aW9ucywgJ1NlY29uZCBwYXJhbWV0ZXInKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChlKTtcbiAgICB9XG5cbiAgICBpZiAoSXNSZWFkYWJsZVN0cmVhbUxvY2tlZCh0aGlzKSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoXG4gICAgICAgIG5ldyBUeXBlRXJyb3IoJ1JlYWRhYmxlU3RyZWFtLnByb3RvdHlwZS5waXBlVG8gY2Fubm90IGJlIHVzZWQgb24gYSBsb2NrZWQgUmVhZGFibGVTdHJlYW0nKVxuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKElzV3JpdGFibGVTdHJlYW1Mb2NrZWQoZGVzdGluYXRpb24pKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChcbiAgICAgICAgbmV3IFR5cGVFcnJvcignUmVhZGFibGVTdHJlYW0ucHJvdG90eXBlLnBpcGVUbyBjYW5ub3QgYmUgdXNlZCBvbiBhIGxvY2tlZCBXcml0YWJsZVN0cmVhbScpXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBSZWFkYWJsZVN0cmVhbVBpcGVUbzxSPihcbiAgICAgIHRoaXMsIGRlc3RpbmF0aW9uLCBvcHRpb25zLnByZXZlbnRDbG9zZSwgb3B0aW9ucy5wcmV2ZW50QWJvcnQsIG9wdGlvbnMucHJldmVudENhbmNlbCwgb3B0aW9ucy5zaWduYWxcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFRlZXMgdGhpcyByZWFkYWJsZSBzdHJlYW0sIHJldHVybmluZyBhIHR3by1lbGVtZW50IGFycmF5IGNvbnRhaW5pbmcgdGhlIHR3byByZXN1bHRpbmcgYnJhbmNoZXMgYXNcbiAgICogbmV3IHtAbGluayBSZWFkYWJsZVN0cmVhbX0gaW5zdGFuY2VzLlxuICAgKlxuICAgKiBUZWVpbmcgYSBzdHJlYW0gd2lsbCBsb2NrIGl0LCBwcmV2ZW50aW5nIGFueSBvdGhlciBjb25zdW1lciBmcm9tIGFjcXVpcmluZyBhIHJlYWRlci5cbiAgICogVG8gY2FuY2VsIHRoZSBzdHJlYW0sIGNhbmNlbCBib3RoIG9mIHRoZSByZXN1bHRpbmcgYnJhbmNoZXM7IGEgY29tcG9zaXRlIGNhbmNlbGxhdGlvbiByZWFzb24gd2lsbCB0aGVuIGJlXG4gICAqIHByb3BhZ2F0ZWQgdG8gdGhlIHN0cmVhbSdzIHVuZGVybHlpbmcgc291cmNlLlxuICAgKlxuICAgKiBOb3RlIHRoYXQgdGhlIGNodW5rcyBzZWVuIGluIGVhY2ggYnJhbmNoIHdpbGwgYmUgdGhlIHNhbWUgb2JqZWN0LiBJZiB0aGUgY2h1bmtzIGFyZSBub3QgaW1tdXRhYmxlLFxuICAgKiB0aGlzIGNvdWxkIGFsbG93IGludGVyZmVyZW5jZSBiZXR3ZWVuIHRoZSB0d28gYnJhbmNoZXMuXG4gICAqL1xuICB0ZWUoKTogW1JlYWRhYmxlU3RyZWFtPFI+LCBSZWFkYWJsZVN0cmVhbTxSPl0ge1xuICAgIGlmICghSXNSZWFkYWJsZVN0cmVhbSh0aGlzKSkge1xuICAgICAgdGhyb3cgc3RyZWFtQnJhbmRDaGVja0V4Y2VwdGlvbigndGVlJyk7XG4gICAgfVxuXG4gICAgY29uc3QgYnJhbmNoZXMgPSBSZWFkYWJsZVN0cmVhbVRlZSh0aGlzLCBmYWxzZSk7XG4gICAgcmV0dXJuIENyZWF0ZUFycmF5RnJvbUxpc3QoYnJhbmNoZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFzeW5jaHJvbm91c2x5IGl0ZXJhdGVzIG92ZXIgdGhlIGNodW5rcyBpbiB0aGUgc3RyZWFtJ3MgaW50ZXJuYWwgcXVldWUuXG4gICAqXG4gICAqIEFzeW5jaHJvbm91c2x5IGl0ZXJhdGluZyBvdmVyIHRoZSBzdHJlYW0gd2lsbCBsb2NrIGl0LCBwcmV2ZW50aW5nIGFueSBvdGhlciBjb25zdW1lciBmcm9tIGFjcXVpcmluZyBhIHJlYWRlci5cbiAgICogVGhlIGxvY2sgd2lsbCBiZSByZWxlYXNlZCBpZiB0aGUgYXN5bmMgaXRlcmF0b3IncyB7QGxpbmsgUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9yLnJldHVybiB8IHJldHVybigpfSBtZXRob2RcbiAgICogaXMgY2FsbGVkLCBlLmcuIGJ5IGJyZWFraW5nIG91dCBvZiB0aGUgbG9vcC5cbiAgICpcbiAgICogQnkgZGVmYXVsdCwgY2FsbGluZyB0aGUgYXN5bmMgaXRlcmF0b3IncyB7QGxpbmsgUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9yLnJldHVybiB8IHJldHVybigpfSBtZXRob2Qgd2lsbCBhbHNvXG4gICAqIGNhbmNlbCB0aGUgc3RyZWFtLiBUbyBwcmV2ZW50IHRoaXMsIHVzZSB0aGUgc3RyZWFtJ3Mge0BsaW5rIFJlYWRhYmxlU3RyZWFtLnZhbHVlcyB8IHZhbHVlcygpfSBtZXRob2QsIHBhc3NpbmdcbiAgICogYHRydWVgIGZvciB0aGUgYHByZXZlbnRDYW5jZWxgIG9wdGlvbi5cbiAgICovXG4gIHZhbHVlcyhvcHRpb25zPzogUmVhZGFibGVTdHJlYW1JdGVyYXRvck9wdGlvbnMpOiBSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3I8Uj47XG4gIHZhbHVlcyhyYXdPcHRpb25zOiBSZWFkYWJsZVN0cmVhbUl0ZXJhdG9yT3B0aW9ucyB8IG51bGwgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQpOiBSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3I8Uj4ge1xuICAgIGlmICghSXNSZWFkYWJsZVN0cmVhbSh0aGlzKSkge1xuICAgICAgdGhyb3cgc3RyZWFtQnJhbmRDaGVja0V4Y2VwdGlvbigndmFsdWVzJyk7XG4gICAgfVxuXG4gICAgY29uc3Qgb3B0aW9ucyA9IGNvbnZlcnRJdGVyYXRvck9wdGlvbnMocmF3T3B0aW9ucywgJ0ZpcnN0IHBhcmFtZXRlcicpO1xuICAgIHJldHVybiBBY3F1aXJlUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9yPFI+KHRoaXMsIG9wdGlvbnMucHJldmVudENhbmNlbCk7XG4gIH1cblxuICAvKipcbiAgICoge0Bpbmhlcml0RG9jIFJlYWRhYmxlU3RyZWFtLnZhbHVlc31cbiAgICovXG4gIFtTeW1ib2wuYXN5bmNJdGVyYXRvcl0ob3B0aW9ucz86IFJlYWRhYmxlU3RyZWFtSXRlcmF0b3JPcHRpb25zKTogUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9yPFI+O1xuXG4gIFtTeW1ib2xBc3luY0l0ZXJhdG9yXShvcHRpb25zPzogUmVhZGFibGVTdHJlYW1JdGVyYXRvck9wdGlvbnMpOiBSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3I8Uj4ge1xuICAgIC8vIFN0dWIgaW1wbGVtZW50YXRpb24sIG92ZXJyaWRkZW4gYmVsb3dcbiAgICByZXR1cm4gdGhpcy52YWx1ZXMob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBSZWFkYWJsZVN0cmVhbSB3cmFwcGluZyB0aGUgcHJvdmlkZWQgaXRlcmFibGUgb3IgYXN5bmMgaXRlcmFibGUuXG4gICAqXG4gICAqIFRoaXMgY2FuIGJlIHVzZWQgdG8gYWRhcHQgdmFyaW91cyBraW5kcyBvZiBvYmplY3RzIGludG8gYSByZWFkYWJsZSBzdHJlYW0sXG4gICAqIHN1Y2ggYXMgYW4gYXJyYXksIGFuIGFzeW5jIGdlbmVyYXRvciwgb3IgYSBOb2RlLmpzIHJlYWRhYmxlIHN0cmVhbS5cbiAgICovXG4gIHN0YXRpYyBmcm9tPFI+KGFzeW5jSXRlcmFibGU6IEl0ZXJhYmxlPFI+IHwgQXN5bmNJdGVyYWJsZTxSPiB8IFJlYWRhYmxlU3RyZWFtTGlrZTxSPik6IFJlYWRhYmxlU3RyZWFtPFI+IHtcbiAgICByZXR1cm4gUmVhZGFibGVTdHJlYW1Gcm9tKGFzeW5jSXRlcmFibGUpO1xuICB9XG59XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFJlYWRhYmxlU3RyZWFtLCB7XG4gIGZyb206IHsgZW51bWVyYWJsZTogdHJ1ZSB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFJlYWRhYmxlU3RyZWFtLnByb3RvdHlwZSwge1xuICBjYW5jZWw6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICBnZXRSZWFkZXI6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICBwaXBlVGhyb3VnaDogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIHBpcGVUbzogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIHRlZTogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIHZhbHVlczogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIGxvY2tlZDogeyBlbnVtZXJhYmxlOiB0cnVlIH1cbn0pO1xuc2V0RnVuY3Rpb25OYW1lKFJlYWRhYmxlU3RyZWFtLmZyb20sICdmcm9tJyk7XG5zZXRGdW5jdGlvbk5hbWUoUmVhZGFibGVTdHJlYW0ucHJvdG90eXBlLmNhbmNlbCwgJ2NhbmNlbCcpO1xuc2V0RnVuY3Rpb25OYW1lKFJlYWRhYmxlU3RyZWFtLnByb3RvdHlwZS5nZXRSZWFkZXIsICdnZXRSZWFkZXInKTtcbnNldEZ1bmN0aW9uTmFtZShSZWFkYWJsZVN0cmVhbS5wcm90b3R5cGUucGlwZVRocm91Z2gsICdwaXBlVGhyb3VnaCcpO1xuc2V0RnVuY3Rpb25OYW1lKFJlYWRhYmxlU3RyZWFtLnByb3RvdHlwZS5waXBlVG8sICdwaXBlVG8nKTtcbnNldEZ1bmN0aW9uTmFtZShSZWFkYWJsZVN0cmVhbS5wcm90b3R5cGUudGVlLCAndGVlJyk7XG5zZXRGdW5jdGlvbk5hbWUoUmVhZGFibGVTdHJlYW0ucHJvdG90eXBlLnZhbHVlcywgJ3ZhbHVlcycpO1xuaWYgKHR5cGVvZiBTeW1ib2wudG9TdHJpbmdUYWcgPT09ICdzeW1ib2wnKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSZWFkYWJsZVN0cmVhbS5wcm90b3R5cGUsIFN5bWJvbC50b1N0cmluZ1RhZywge1xuICAgIHZhbHVlOiAnUmVhZGFibGVTdHJlYW0nLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbn1cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShSZWFkYWJsZVN0cmVhbS5wcm90b3R5cGUsIFN5bWJvbEFzeW5jSXRlcmF0b3IsIHtcbiAgdmFsdWU6IFJlYWRhYmxlU3RyZWFtLnByb3RvdHlwZS52YWx1ZXMsXG4gIHdyaXRhYmxlOiB0cnVlLFxuICBjb25maWd1cmFibGU6IHRydWVcbn0pO1xuXG5leHBvcnQgdHlwZSB7XG4gIFJlYWRhYmxlU3RyZWFtQXN5bmNJdGVyYXRvcixcbiAgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZFJlc3VsdCxcbiAgUmVhZGFibGVTdHJlYW1CWU9CUmVhZFJlc3VsdCxcbiAgUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyUmVhZE9wdGlvbnMsXG4gIFVuZGVybHlpbmdCeXRlU291cmNlLFxuICBVbmRlcmx5aW5nU291cmNlLFxuICBVbmRlcmx5aW5nU291cmNlU3RhcnRDYWxsYmFjayxcbiAgVW5kZXJseWluZ1NvdXJjZVB1bGxDYWxsYmFjayxcbiAgVW5kZXJseWluZ1NvdXJjZUNhbmNlbENhbGxiYWNrLFxuICBVbmRlcmx5aW5nQnl0ZVNvdXJjZVN0YXJ0Q2FsbGJhY2ssXG4gIFVuZGVybHlpbmdCeXRlU291cmNlUHVsbENhbGxiYWNrLFxuICBTdHJlYW1QaXBlT3B0aW9ucyxcbiAgUmVhZGFibGVXcml0YWJsZVBhaXIsXG4gIFJlYWRhYmxlU3RyZWFtSXRlcmF0b3JPcHRpb25zLFxuICBSZWFkYWJsZVN0cmVhbUxpa2UsXG4gIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlckxpa2Vcbn07XG5cbi8vIEFic3RyYWN0IG9wZXJhdGlvbnMgZm9yIHRoZSBSZWFkYWJsZVN0cmVhbS5cblxuLy8gVGhyb3dzIGlmIGFuZCBvbmx5IGlmIHN0YXJ0QWxnb3JpdGhtIHRocm93cy5cbmV4cG9ydCBmdW5jdGlvbiBDcmVhdGVSZWFkYWJsZVN0cmVhbTxSPihcbiAgc3RhcnRBbGdvcml0aG06ICgpID0+IHZvaWQgfCBQcm9taXNlTGlrZTx2b2lkPixcbiAgcHVsbEFsZ29yaXRobTogKCkgPT4gUHJvbWlzZTx2b2lkPixcbiAgY2FuY2VsQWxnb3JpdGhtOiAocmVhc29uOiBhbnkpID0+IFByb21pc2U8dm9pZD4sXG4gIGhpZ2hXYXRlck1hcmsgPSAxLFxuICBzaXplQWxnb3JpdGhtOiBRdWV1aW5nU3RyYXRlZ3lTaXplQ2FsbGJhY2s8Uj4gPSAoKSA9PiAxXG4pOiBEZWZhdWx0UmVhZGFibGVTdHJlYW08Uj4ge1xuICBhc3NlcnQoSXNOb25OZWdhdGl2ZU51bWJlcihoaWdoV2F0ZXJNYXJrKSk7XG5cbiAgY29uc3Qgc3RyZWFtOiBEZWZhdWx0UmVhZGFibGVTdHJlYW08Uj4gPSBPYmplY3QuY3JlYXRlKFJlYWRhYmxlU3RyZWFtLnByb3RvdHlwZSk7XG4gIEluaXRpYWxpemVSZWFkYWJsZVN0cmVhbShzdHJlYW0pO1xuXG4gIGNvbnN0IGNvbnRyb2xsZXI6IFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8Uj4gPSBPYmplY3QuY3JlYXRlKFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIucHJvdG90eXBlKTtcbiAgU2V0VXBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyKFxuICAgIHN0cmVhbSwgY29udHJvbGxlciwgc3RhcnRBbGdvcml0aG0sIHB1bGxBbGdvcml0aG0sIGNhbmNlbEFsZ29yaXRobSwgaGlnaFdhdGVyTWFyaywgc2l6ZUFsZ29yaXRobVxuICApO1xuXG4gIHJldHVybiBzdHJlYW07XG59XG5cbi8vIFRocm93cyBpZiBhbmQgb25seSBpZiBzdGFydEFsZ29yaXRobSB0aHJvd3MuXG5leHBvcnQgZnVuY3Rpb24gQ3JlYXRlUmVhZGFibGVCeXRlU3RyZWFtKFxuICBzdGFydEFsZ29yaXRobTogKCkgPT4gdm9pZCB8IFByb21pc2VMaWtlPHZvaWQ+LFxuICBwdWxsQWxnb3JpdGhtOiAoKSA9PiBQcm9taXNlPHZvaWQ+LFxuICBjYW5jZWxBbGdvcml0aG06IChyZWFzb246IGFueSkgPT4gUHJvbWlzZTx2b2lkPlxuKTogUmVhZGFibGVCeXRlU3RyZWFtIHtcbiAgY29uc3Qgc3RyZWFtOiBSZWFkYWJsZUJ5dGVTdHJlYW0gPSBPYmplY3QuY3JlYXRlKFJlYWRhYmxlU3RyZWFtLnByb3RvdHlwZSk7XG4gIEluaXRpYWxpemVSZWFkYWJsZVN0cmVhbShzdHJlYW0pO1xuXG4gIGNvbnN0IGNvbnRyb2xsZXI6IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIgPSBPYmplY3QuY3JlYXRlKFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIucHJvdG90eXBlKTtcbiAgU2V0VXBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyKHN0cmVhbSwgY29udHJvbGxlciwgc3RhcnRBbGdvcml0aG0sIHB1bGxBbGdvcml0aG0sIGNhbmNlbEFsZ29yaXRobSwgMCwgdW5kZWZpbmVkKTtcblxuICByZXR1cm4gc3RyZWFtO1xufVxuXG5mdW5jdGlvbiBJbml0aWFsaXplUmVhZGFibGVTdHJlYW0oc3RyZWFtOiBSZWFkYWJsZVN0cmVhbSkge1xuICBzdHJlYW0uX3N0YXRlID0gJ3JlYWRhYmxlJztcbiAgc3RyZWFtLl9yZWFkZXIgPSB1bmRlZmluZWQ7XG4gIHN0cmVhbS5fc3RvcmVkRXJyb3IgPSB1bmRlZmluZWQ7XG4gIHN0cmVhbS5fZGlzdHVyYmVkID0gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBJc1JlYWRhYmxlU3RyZWFtKHg6IHVua25vd24pOiB4IGlzIFJlYWRhYmxlU3RyZWFtIHtcbiAgaWYgKCF0eXBlSXNPYmplY3QoeCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh4LCAnX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlcicpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHggaW5zdGFuY2VvZiBSZWFkYWJsZVN0cmVhbTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIElzUmVhZGFibGVTdHJlYW1EaXN0dXJiZWQoc3RyZWFtOiBSZWFkYWJsZVN0cmVhbSk6IGJvb2xlYW4ge1xuICBhc3NlcnQoSXNSZWFkYWJsZVN0cmVhbShzdHJlYW0pKTtcblxuICByZXR1cm4gc3RyZWFtLl9kaXN0dXJiZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBJc1JlYWRhYmxlU3RyZWFtTG9ja2VkKHN0cmVhbTogUmVhZGFibGVTdHJlYW0pOiBib29sZWFuIHtcbiAgYXNzZXJ0KElzUmVhZGFibGVTdHJlYW0oc3RyZWFtKSk7XG5cbiAgaWYgKHN0cmVhbS5fcmVhZGVyID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLy8gUmVhZGFibGVTdHJlYW0gQVBJIGV4cG9zZWQgZm9yIGNvbnRyb2xsZXJzLlxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1DYW5jZWw8Uj4oc3RyZWFtOiBSZWFkYWJsZVN0cmVhbTxSPiwgcmVhc29uOiBhbnkpOiBQcm9taXNlPHVuZGVmaW5lZD4ge1xuICBzdHJlYW0uX2Rpc3R1cmJlZCA9IHRydWU7XG5cbiAgaWYgKHN0cmVhbS5fc3RhdGUgPT09ICdjbG9zZWQnKSB7XG4gICAgcmV0dXJuIHByb21pc2VSZXNvbHZlZFdpdGgodW5kZWZpbmVkKTtcbiAgfVxuICBpZiAoc3RyZWFtLl9zdGF0ZSA9PT0gJ2Vycm9yZWQnKSB7XG4gICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoc3RyZWFtLl9zdG9yZWRFcnJvcik7XG4gIH1cblxuICBSZWFkYWJsZVN0cmVhbUNsb3NlKHN0cmVhbSk7XG5cbiAgY29uc3QgcmVhZGVyID0gc3RyZWFtLl9yZWFkZXI7XG4gIGlmIChyZWFkZXIgIT09IHVuZGVmaW5lZCAmJiBJc1JlYWRhYmxlU3RyZWFtQllPQlJlYWRlcihyZWFkZXIpKSB7XG4gICAgY29uc3QgcmVhZEludG9SZXF1ZXN0cyA9IHJlYWRlci5fcmVhZEludG9SZXF1ZXN0cztcbiAgICByZWFkZXIuX3JlYWRJbnRvUmVxdWVzdHMgPSBuZXcgU2ltcGxlUXVldWUoKTtcbiAgICByZWFkSW50b1JlcXVlc3RzLmZvckVhY2gocmVhZEludG9SZXF1ZXN0ID0+IHtcbiAgICAgIHJlYWRJbnRvUmVxdWVzdC5fY2xvc2VTdGVwcyh1bmRlZmluZWQpO1xuICAgIH0pO1xuICB9XG5cbiAgY29uc3Qgc291cmNlQ2FuY2VsUHJvbWlzZSA9IHN0cmVhbS5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyW0NhbmNlbFN0ZXBzXShyZWFzb24pO1xuICByZXR1cm4gdHJhbnNmb3JtUHJvbWlzZVdpdGgoc291cmNlQ2FuY2VsUHJvbWlzZSwgbm9vcCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZVN0cmVhbUNsb3NlPFI+KHN0cmVhbTogUmVhZGFibGVTdHJlYW08Uj4pOiB2b2lkIHtcbiAgYXNzZXJ0KHN0cmVhbS5fc3RhdGUgPT09ICdyZWFkYWJsZScpO1xuXG4gIHN0cmVhbS5fc3RhdGUgPSAnY2xvc2VkJztcblxuICBjb25zdCByZWFkZXIgPSBzdHJlYW0uX3JlYWRlcjtcblxuICBpZiAocmVhZGVyID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBkZWZhdWx0UmVhZGVyQ2xvc2VkUHJvbWlzZVJlc29sdmUocmVhZGVyKTtcblxuICBpZiAoSXNSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXI8Uj4ocmVhZGVyKSkge1xuICAgIGNvbnN0IHJlYWRSZXF1ZXN0cyA9IHJlYWRlci5fcmVhZFJlcXVlc3RzO1xuICAgIHJlYWRlci5fcmVhZFJlcXVlc3RzID0gbmV3IFNpbXBsZVF1ZXVlKCk7XG4gICAgcmVhZFJlcXVlc3RzLmZvckVhY2gocmVhZFJlcXVlc3QgPT4ge1xuICAgICAgcmVhZFJlcXVlc3QuX2Nsb3NlU3RlcHMoKTtcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1FcnJvcjxSPihzdHJlYW06IFJlYWRhYmxlU3RyZWFtPFI+LCBlOiBhbnkpOiB2b2lkIHtcbiAgYXNzZXJ0KElzUmVhZGFibGVTdHJlYW0oc3RyZWFtKSk7XG4gIGFzc2VydChzdHJlYW0uX3N0YXRlID09PSAncmVhZGFibGUnKTtcblxuICBzdHJlYW0uX3N0YXRlID0gJ2Vycm9yZWQnO1xuICBzdHJlYW0uX3N0b3JlZEVycm9yID0gZTtcblxuICBjb25zdCByZWFkZXIgPSBzdHJlYW0uX3JlYWRlcjtcblxuICBpZiAocmVhZGVyID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBkZWZhdWx0UmVhZGVyQ2xvc2VkUHJvbWlzZVJlamVjdChyZWFkZXIsIGUpO1xuXG4gIGlmIChJc1JlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcjxSPihyZWFkZXIpKSB7XG4gICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyRXJyb3JSZWFkUmVxdWVzdHMocmVhZGVyLCBlKTtcbiAgfSBlbHNlIHtcbiAgICBhc3NlcnQoSXNSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIocmVhZGVyKSk7XG4gICAgUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyRXJyb3JSZWFkSW50b1JlcXVlc3RzKHJlYWRlciwgZSk7XG4gIH1cbn1cblxuLy8gUmVhZGVyc1xuXG5leHBvcnQgdHlwZSBSZWFkYWJsZVN0cmVhbVJlYWRlcjxSPiA9IFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcjxSPiB8IFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlcjtcblxuZXhwb3J0IHtcbiAgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyLFxuICBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXJcbn07XG5cbi8vIENvbnRyb2xsZXJzXG5cbmV4cG9ydCB7XG4gIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIsXG4gIFJlYWRhYmxlU3RyZWFtQllPQlJlcXVlc3QsXG4gIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJcbn07XG5cbi8vIEhlbHBlciBmdW5jdGlvbnMgZm9yIHRoZSBSZWFkYWJsZVN0cmVhbS5cblxuZnVuY3Rpb24gc3RyZWFtQnJhbmRDaGVja0V4Y2VwdGlvbihuYW1lOiBzdHJpbmcpOiBUeXBlRXJyb3Ige1xuICByZXR1cm4gbmV3IFR5cGVFcnJvcihgUmVhZGFibGVTdHJlYW0ucHJvdG90eXBlLiR7bmFtZX0gY2FuIG9ubHkgYmUgdXNlZCBvbiBhIFJlYWRhYmxlU3RyZWFtYCk7XG59XG4iLCAiaW1wb3J0IHR5cGUgeyBRdWV1aW5nU3RyYXRlZ3lJbml0IH0gZnJvbSAnLi4vcXVldWluZy1zdHJhdGVneSc7XG5pbXBvcnQgeyBhc3NlcnREaWN0aW9uYXJ5LCBhc3NlcnRSZXF1aXJlZEZpZWxkLCBjb252ZXJ0VW5yZXN0cmljdGVkRG91YmxlIH0gZnJvbSAnLi9iYXNpYyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0UXVldWluZ1N0cmF0ZWd5SW5pdChpbml0OiBRdWV1aW5nU3RyYXRlZ3lJbml0IHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiBzdHJpbmcpOiBRdWV1aW5nU3RyYXRlZ3lJbml0IHtcbiAgYXNzZXJ0RGljdGlvbmFyeShpbml0LCBjb250ZXh0KTtcbiAgY29uc3QgaGlnaFdhdGVyTWFyayA9IGluaXQ/LmhpZ2hXYXRlck1hcms7XG4gIGFzc2VydFJlcXVpcmVkRmllbGQoaGlnaFdhdGVyTWFyaywgJ2hpZ2hXYXRlck1hcmsnLCAnUXVldWluZ1N0cmF0ZWd5SW5pdCcpO1xuICByZXR1cm4ge1xuICAgIGhpZ2hXYXRlck1hcms6IGNvbnZlcnRVbnJlc3RyaWN0ZWREb3VibGUoaGlnaFdhdGVyTWFyaylcbiAgfTtcbn1cbiIsICJpbXBvcnQgdHlwZSB7IFF1ZXVpbmdTdHJhdGVneSwgUXVldWluZ1N0cmF0ZWd5SW5pdCB9IGZyb20gJy4vcXVldWluZy1zdHJhdGVneSc7XG5pbXBvcnQgeyBzZXRGdW5jdGlvbk5hbWUsIHR5cGVJc09iamVjdCB9IGZyb20gJy4vaGVscGVycy9taXNjZWxsYW5lb3VzJztcbmltcG9ydCB7IGFzc2VydFJlcXVpcmVkQXJndW1lbnQgfSBmcm9tICcuL3ZhbGlkYXRvcnMvYmFzaWMnO1xuaW1wb3J0IHsgY29udmVydFF1ZXVpbmdTdHJhdGVneUluaXQgfSBmcm9tICcuL3ZhbGlkYXRvcnMvcXVldWluZy1zdHJhdGVneS1pbml0JztcblxuLy8gVGhlIHNpemUgZnVuY3Rpb24gbXVzdCBub3QgaGF2ZSBhIHByb3RvdHlwZSBwcm9wZXJ0eSBub3IgYmUgYSBjb25zdHJ1Y3RvclxuY29uc3QgYnl0ZUxlbmd0aFNpemVGdW5jdGlvbiA9IChjaHVuazogQXJyYXlCdWZmZXJWaWV3KTogbnVtYmVyID0+IHtcbiAgcmV0dXJuIGNodW5rLmJ5dGVMZW5ndGg7XG59O1xuc2V0RnVuY3Rpb25OYW1lKGJ5dGVMZW5ndGhTaXplRnVuY3Rpb24sICdzaXplJyk7XG5cbi8qKlxuICogQSBxdWV1aW5nIHN0cmF0ZWd5IHRoYXQgY291bnRzIHRoZSBudW1iZXIgb2YgYnl0ZXMgaW4gZWFjaCBjaHVuay5cbiAqXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJ5dGVMZW5ndGhRdWV1aW5nU3RyYXRlZ3kgaW1wbGVtZW50cyBRdWV1aW5nU3RyYXRlZ3k8QXJyYXlCdWZmZXJWaWV3PiB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcmVhZG9ubHkgX2J5dGVMZW5ndGhRdWV1aW5nU3RyYXRlZ3lIaWdoV2F0ZXJNYXJrOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9uczogUXVldWluZ1N0cmF0ZWd5SW5pdCkge1xuICAgIGFzc2VydFJlcXVpcmVkQXJndW1lbnQob3B0aW9ucywgMSwgJ0J5dGVMZW5ndGhRdWV1aW5nU3RyYXRlZ3knKTtcbiAgICBvcHRpb25zID0gY29udmVydFF1ZXVpbmdTdHJhdGVneUluaXQob3B0aW9ucywgJ0ZpcnN0IHBhcmFtZXRlcicpO1xuICAgIHRoaXMuX2J5dGVMZW5ndGhRdWV1aW5nU3RyYXRlZ3lIaWdoV2F0ZXJNYXJrID0gb3B0aW9ucy5oaWdoV2F0ZXJNYXJrO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGhpZ2ggd2F0ZXIgbWFyayBwcm92aWRlZCB0byB0aGUgY29uc3RydWN0b3IuXG4gICAqL1xuICBnZXQgaGlnaFdhdGVyTWFyaygpOiBudW1iZXIge1xuICAgIGlmICghSXNCeXRlTGVuZ3RoUXVldWluZ1N0cmF0ZWd5KHRoaXMpKSB7XG4gICAgICB0aHJvdyBieXRlTGVuZ3RoQnJhbmRDaGVja0V4Y2VwdGlvbignaGlnaFdhdGVyTWFyaycpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fYnl0ZUxlbmd0aFF1ZXVpbmdTdHJhdGVneUhpZ2hXYXRlck1hcms7XG4gIH1cblxuICAvKipcbiAgICogTWVhc3VyZXMgdGhlIHNpemUgb2YgYGNodW5rYCBieSByZXR1cm5pbmcgdGhlIHZhbHVlIG9mIGl0cyBgYnl0ZUxlbmd0aGAgcHJvcGVydHkuXG4gICAqL1xuICBnZXQgc2l6ZSgpOiAoY2h1bms6IEFycmF5QnVmZmVyVmlldykgPT4gbnVtYmVyIHtcbiAgICBpZiAoIUlzQnl0ZUxlbmd0aFF1ZXVpbmdTdHJhdGVneSh0aGlzKSkge1xuICAgICAgdGhyb3cgYnl0ZUxlbmd0aEJyYW5kQ2hlY2tFeGNlcHRpb24oJ3NpemUnKTtcbiAgICB9XG4gICAgcmV0dXJuIGJ5dGVMZW5ndGhTaXplRnVuY3Rpb247XG4gIH1cbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoQnl0ZUxlbmd0aFF1ZXVpbmdTdHJhdGVneS5wcm90b3R5cGUsIHtcbiAgaGlnaFdhdGVyTWFyazogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIHNpemU6IHsgZW51bWVyYWJsZTogdHJ1ZSB9XG59KTtcbmlmICh0eXBlb2YgU3ltYm9sLnRvU3RyaW5nVGFnID09PSAnc3ltYm9sJykge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQnl0ZUxlbmd0aFF1ZXVpbmdTdHJhdGVneS5wcm90b3R5cGUsIFN5bWJvbC50b1N0cmluZ1RhZywge1xuICAgIHZhbHVlOiAnQnl0ZUxlbmd0aFF1ZXVpbmdTdHJhdGVneScsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xufVxuXG4vLyBIZWxwZXIgZnVuY3Rpb25zIGZvciB0aGUgQnl0ZUxlbmd0aFF1ZXVpbmdTdHJhdGVneS5cblxuZnVuY3Rpb24gYnl0ZUxlbmd0aEJyYW5kQ2hlY2tFeGNlcHRpb24obmFtZTogc3RyaW5nKTogVHlwZUVycm9yIHtcbiAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoYEJ5dGVMZW5ndGhRdWV1aW5nU3RyYXRlZ3kucHJvdG90eXBlLiR7bmFtZX0gY2FuIG9ubHkgYmUgdXNlZCBvbiBhIEJ5dGVMZW5ndGhRdWV1aW5nU3RyYXRlZ3lgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIElzQnl0ZUxlbmd0aFF1ZXVpbmdTdHJhdGVneSh4OiBhbnkpOiB4IGlzIEJ5dGVMZW5ndGhRdWV1aW5nU3RyYXRlZ3kge1xuICBpZiAoIXR5cGVJc09iamVjdCh4KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHgsICdfYnl0ZUxlbmd0aFF1ZXVpbmdTdHJhdGVneUhpZ2hXYXRlck1hcmsnKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB4IGluc3RhbmNlb2YgQnl0ZUxlbmd0aFF1ZXVpbmdTdHJhdGVneTtcbn1cbiIsICJpbXBvcnQgdHlwZSB7IFF1ZXVpbmdTdHJhdGVneSwgUXVldWluZ1N0cmF0ZWd5SW5pdCB9IGZyb20gJy4vcXVldWluZy1zdHJhdGVneSc7XG5pbXBvcnQgeyBzZXRGdW5jdGlvbk5hbWUsIHR5cGVJc09iamVjdCB9IGZyb20gJy4vaGVscGVycy9taXNjZWxsYW5lb3VzJztcbmltcG9ydCB7IGFzc2VydFJlcXVpcmVkQXJndW1lbnQgfSBmcm9tICcuL3ZhbGlkYXRvcnMvYmFzaWMnO1xuaW1wb3J0IHsgY29udmVydFF1ZXVpbmdTdHJhdGVneUluaXQgfSBmcm9tICcuL3ZhbGlkYXRvcnMvcXVldWluZy1zdHJhdGVneS1pbml0JztcblxuLy8gVGhlIHNpemUgZnVuY3Rpb24gbXVzdCBub3QgaGF2ZSBhIHByb3RvdHlwZSBwcm9wZXJ0eSBub3IgYmUgYSBjb25zdHJ1Y3RvclxuY29uc3QgY291bnRTaXplRnVuY3Rpb24gPSAoKTogMSA9PiB7XG4gIHJldHVybiAxO1xufTtcbnNldEZ1bmN0aW9uTmFtZShjb3VudFNpemVGdW5jdGlvbiwgJ3NpemUnKTtcblxuLyoqXG4gKiBBIHF1ZXVpbmcgc3RyYXRlZ3kgdGhhdCBjb3VudHMgdGhlIG51bWJlciBvZiBjaHVua3MuXG4gKlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb3VudFF1ZXVpbmdTdHJhdGVneSBpbXBsZW1lbnRzIFF1ZXVpbmdTdHJhdGVneTxhbnk+IHtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICByZWFkb25seSBfY291bnRRdWV1aW5nU3RyYXRlZ3lIaWdoV2F0ZXJNYXJrITogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IFF1ZXVpbmdTdHJhdGVneUluaXQpIHtcbiAgICBhc3NlcnRSZXF1aXJlZEFyZ3VtZW50KG9wdGlvbnMsIDEsICdDb3VudFF1ZXVpbmdTdHJhdGVneScpO1xuICAgIG9wdGlvbnMgPSBjb252ZXJ0UXVldWluZ1N0cmF0ZWd5SW5pdChvcHRpb25zLCAnRmlyc3QgcGFyYW1ldGVyJyk7XG4gICAgdGhpcy5fY291bnRRdWV1aW5nU3RyYXRlZ3lIaWdoV2F0ZXJNYXJrID0gb3B0aW9ucy5oaWdoV2F0ZXJNYXJrO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGhpZ2ggd2F0ZXIgbWFyayBwcm92aWRlZCB0byB0aGUgY29uc3RydWN0b3IuXG4gICAqL1xuICBnZXQgaGlnaFdhdGVyTWFyaygpOiBudW1iZXIge1xuICAgIGlmICghSXNDb3VudFF1ZXVpbmdTdHJhdGVneSh0aGlzKSkge1xuICAgICAgdGhyb3cgY291bnRCcmFuZENoZWNrRXhjZXB0aW9uKCdoaWdoV2F0ZXJNYXJrJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9jb3VudFF1ZXVpbmdTdHJhdGVneUhpZ2hXYXRlck1hcms7XG4gIH1cblxuICAvKipcbiAgICogTWVhc3VyZXMgdGhlIHNpemUgb2YgYGNodW5rYCBieSBhbHdheXMgcmV0dXJuaW5nIDEuXG4gICAqIFRoaXMgZW5zdXJlcyB0aGF0IHRoZSB0b3RhbCBxdWV1ZSBzaXplIGlzIGEgY291bnQgb2YgdGhlIG51bWJlciBvZiBjaHVua3MgaW4gdGhlIHF1ZXVlLlxuICAgKi9cbiAgZ2V0IHNpemUoKTogKGNodW5rOiBhbnkpID0+IDEge1xuICAgIGlmICghSXNDb3VudFF1ZXVpbmdTdHJhdGVneSh0aGlzKSkge1xuICAgICAgdGhyb3cgY291bnRCcmFuZENoZWNrRXhjZXB0aW9uKCdzaXplJyk7XG4gICAgfVxuICAgIHJldHVybiBjb3VudFNpemVGdW5jdGlvbjtcbiAgfVxufVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyhDb3VudFF1ZXVpbmdTdHJhdGVneS5wcm90b3R5cGUsIHtcbiAgaGlnaFdhdGVyTWFyazogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIHNpemU6IHsgZW51bWVyYWJsZTogdHJ1ZSB9XG59KTtcbmlmICh0eXBlb2YgU3ltYm9sLnRvU3RyaW5nVGFnID09PSAnc3ltYm9sJykge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQ291bnRRdWV1aW5nU3RyYXRlZ3kucHJvdG90eXBlLCBTeW1ib2wudG9TdHJpbmdUYWcsIHtcbiAgICB2YWx1ZTogJ0NvdW50UXVldWluZ1N0cmF0ZWd5JyxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG59XG5cbi8vIEhlbHBlciBmdW5jdGlvbnMgZm9yIHRoZSBDb3VudFF1ZXVpbmdTdHJhdGVneS5cblxuZnVuY3Rpb24gY291bnRCcmFuZENoZWNrRXhjZXB0aW9uKG5hbWU6IHN0cmluZyk6IFR5cGVFcnJvciB7XG4gIHJldHVybiBuZXcgVHlwZUVycm9yKGBDb3VudFF1ZXVpbmdTdHJhdGVneS5wcm90b3R5cGUuJHtuYW1lfSBjYW4gb25seSBiZSB1c2VkIG9uIGEgQ291bnRRdWV1aW5nU3RyYXRlZ3lgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIElzQ291bnRRdWV1aW5nU3RyYXRlZ3koeDogYW55KTogeCBpcyBDb3VudFF1ZXVpbmdTdHJhdGVneSB7XG4gIGlmICghdHlwZUlzT2JqZWN0KHgpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoeCwgJ19jb3VudFF1ZXVpbmdTdHJhdGVneUhpZ2hXYXRlck1hcmsnKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB4IGluc3RhbmNlb2YgQ291bnRRdWV1aW5nU3RyYXRlZ3k7XG59XG4iLCAiaW1wb3J0IHsgYXNzZXJ0RGljdGlvbmFyeSwgYXNzZXJ0RnVuY3Rpb24gfSBmcm9tICcuL2Jhc2ljJztcbmltcG9ydCB7IHByb21pc2VDYWxsLCByZWZsZWN0Q2FsbCB9IGZyb20gJy4uL2hlbHBlcnMvd2ViaWRsJztcbmltcG9ydCB0eXBlIHtcbiAgVHJhbnNmb3JtZXIsXG4gIFRyYW5zZm9ybWVyQ2FuY2VsQ2FsbGJhY2ssXG4gIFRyYW5zZm9ybWVyRmx1c2hDYWxsYmFjayxcbiAgVHJhbnNmb3JtZXJTdGFydENhbGxiYWNrLFxuICBUcmFuc2Zvcm1lclRyYW5zZm9ybUNhbGxiYWNrLFxuICBWYWxpZGF0ZWRUcmFuc2Zvcm1lclxufSBmcm9tICcuLi90cmFuc2Zvcm0tc3RyZWFtL3RyYW5zZm9ybWVyJztcbmltcG9ydCB7IFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyIH0gZnJvbSAnLi4vdHJhbnNmb3JtLXN0cmVhbSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0VHJhbnNmb3JtZXI8SSwgTz4ob3JpZ2luYWw6IFRyYW5zZm9ybWVyPEksIE8+IHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dDogc3RyaW5nKTogVmFsaWRhdGVkVHJhbnNmb3JtZXI8SSwgTz4ge1xuICBhc3NlcnREaWN0aW9uYXJ5KG9yaWdpbmFsLCBjb250ZXh0KTtcbiAgY29uc3QgY2FuY2VsID0gb3JpZ2luYWw/LmNhbmNlbDtcbiAgY29uc3QgZmx1c2ggPSBvcmlnaW5hbD8uZmx1c2g7XG4gIGNvbnN0IHJlYWRhYmxlVHlwZSA9IG9yaWdpbmFsPy5yZWFkYWJsZVR5cGU7XG4gIGNvbnN0IHN0YXJ0ID0gb3JpZ2luYWw/LnN0YXJ0O1xuICBjb25zdCB0cmFuc2Zvcm0gPSBvcmlnaW5hbD8udHJhbnNmb3JtO1xuICBjb25zdCB3cml0YWJsZVR5cGUgPSBvcmlnaW5hbD8ud3JpdGFibGVUeXBlO1xuICByZXR1cm4ge1xuICAgIGNhbmNlbDogY2FuY2VsID09PSB1bmRlZmluZWQgP1xuICAgICAgdW5kZWZpbmVkIDpcbiAgICAgIGNvbnZlcnRUcmFuc2Zvcm1lckNhbmNlbENhbGxiYWNrKGNhbmNlbCwgb3JpZ2luYWwhLCBgJHtjb250ZXh0fSBoYXMgbWVtYmVyICdjYW5jZWwnIHRoYXRgKSxcbiAgICBmbHVzaDogZmx1c2ggPT09IHVuZGVmaW5lZCA/XG4gICAgICB1bmRlZmluZWQgOlxuICAgICAgY29udmVydFRyYW5zZm9ybWVyRmx1c2hDYWxsYmFjayhmbHVzaCwgb3JpZ2luYWwhLCBgJHtjb250ZXh0fSBoYXMgbWVtYmVyICdmbHVzaCcgdGhhdGApLFxuICAgIHJlYWRhYmxlVHlwZSxcbiAgICBzdGFydDogc3RhcnQgPT09IHVuZGVmaW5lZCA/XG4gICAgICB1bmRlZmluZWQgOlxuICAgICAgY29udmVydFRyYW5zZm9ybWVyU3RhcnRDYWxsYmFjayhzdGFydCwgb3JpZ2luYWwhLCBgJHtjb250ZXh0fSBoYXMgbWVtYmVyICdzdGFydCcgdGhhdGApLFxuICAgIHRyYW5zZm9ybTogdHJhbnNmb3JtID09PSB1bmRlZmluZWQgP1xuICAgICAgdW5kZWZpbmVkIDpcbiAgICAgIGNvbnZlcnRUcmFuc2Zvcm1lclRyYW5zZm9ybUNhbGxiYWNrKHRyYW5zZm9ybSwgb3JpZ2luYWwhLCBgJHtjb250ZXh0fSBoYXMgbWVtYmVyICd0cmFuc2Zvcm0nIHRoYXRgKSxcbiAgICB3cml0YWJsZVR5cGVcbiAgfTtcbn1cblxuZnVuY3Rpb24gY29udmVydFRyYW5zZm9ybWVyRmx1c2hDYWxsYmFjazxJLCBPPihcbiAgZm46IFRyYW5zZm9ybWVyRmx1c2hDYWxsYmFjazxPPixcbiAgb3JpZ2luYWw6IFRyYW5zZm9ybWVyPEksIE8+LFxuICBjb250ZXh0OiBzdHJpbmdcbik6IChjb250cm9sbGVyOiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxPPikgPT4gUHJvbWlzZTx2b2lkPiB7XG4gIGFzc2VydEZ1bmN0aW9uKGZuLCBjb250ZXh0KTtcbiAgcmV0dXJuIChjb250cm9sbGVyOiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxPPikgPT4gcHJvbWlzZUNhbGwoZm4sIG9yaWdpbmFsLCBbY29udHJvbGxlcl0pO1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0VHJhbnNmb3JtZXJTdGFydENhbGxiYWNrPEksIE8+KFxuICBmbjogVHJhbnNmb3JtZXJTdGFydENhbGxiYWNrPE8+LFxuICBvcmlnaW5hbDogVHJhbnNmb3JtZXI8SSwgTz4sXG4gIGNvbnRleHQ6IHN0cmluZ1xuKTogVHJhbnNmb3JtZXJTdGFydENhbGxiYWNrPE8+IHtcbiAgYXNzZXJ0RnVuY3Rpb24oZm4sIGNvbnRleHQpO1xuICByZXR1cm4gKGNvbnRyb2xsZXI6IFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyPE8+KSA9PiByZWZsZWN0Q2FsbChmbiwgb3JpZ2luYWwsIFtjb250cm9sbGVyXSk7XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRUcmFuc2Zvcm1lclRyYW5zZm9ybUNhbGxiYWNrPEksIE8+KFxuICBmbjogVHJhbnNmb3JtZXJUcmFuc2Zvcm1DYWxsYmFjazxJLCBPPixcbiAgb3JpZ2luYWw6IFRyYW5zZm9ybWVyPEksIE8+LFxuICBjb250ZXh0OiBzdHJpbmdcbik6IChjaHVuazogSSwgY29udHJvbGxlcjogVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8Tz4pID0+IFByb21pc2U8dm9pZD4ge1xuICBhc3NlcnRGdW5jdGlvbihmbiwgY29udGV4dCk7XG4gIHJldHVybiAoY2h1bms6IEksIGNvbnRyb2xsZXI6IFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyPE8+KSA9PiBwcm9taXNlQ2FsbChmbiwgb3JpZ2luYWwsIFtjaHVuaywgY29udHJvbGxlcl0pO1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0VHJhbnNmb3JtZXJDYW5jZWxDYWxsYmFjazxJLCBPPihcbiAgZm46IFRyYW5zZm9ybWVyQ2FuY2VsQ2FsbGJhY2ssXG4gIG9yaWdpbmFsOiBUcmFuc2Zvcm1lcjxJLCBPPixcbiAgY29udGV4dDogc3RyaW5nXG4pOiAocmVhc29uOiBhbnkpID0+IFByb21pc2U8dm9pZD4ge1xuICBhc3NlcnRGdW5jdGlvbihmbiwgY29udGV4dCk7XG4gIHJldHVybiAocmVhc29uOiBhbnkpID0+IHByb21pc2VDYWxsKGZuLCBvcmlnaW5hbCwgW3JlYXNvbl0pO1xufVxuIiwgImltcG9ydCBhc3NlcnQgZnJvbSAnLi4vc3R1Yi9hc3NlcnQnO1xuaW1wb3J0IHtcbiAgbmV3UHJvbWlzZSxcbiAgcHJvbWlzZVJlamVjdGVkV2l0aCxcbiAgcHJvbWlzZVJlc29sdmVkV2l0aCxcbiAgc2V0UHJvbWlzZUlzSGFuZGxlZFRvVHJ1ZSxcbiAgdHJhbnNmb3JtUHJvbWlzZVdpdGgsXG4gIHVwb25Qcm9taXNlXG59IGZyb20gJy4vaGVscGVycy93ZWJpZGwnO1xuaW1wb3J0IHsgQ3JlYXRlUmVhZGFibGVTdHJlYW0sIHR5cGUgRGVmYXVsdFJlYWRhYmxlU3RyZWFtLCBSZWFkYWJsZVN0cmVhbSB9IGZyb20gJy4vcmVhZGFibGUtc3RyZWFtJztcbmltcG9ydCB7XG4gIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDYW5DbG9zZU9yRW5xdWV1ZSxcbiAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNsb3NlLFxuICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRW5xdWV1ZSxcbiAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVycm9yLFxuICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyR2V0RGVzaXJlZFNpemUsXG4gIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJIYXNCYWNrcHJlc3N1cmVcbn0gZnJvbSAnLi9yZWFkYWJsZS1zdHJlYW0vZGVmYXVsdC1jb250cm9sbGVyJztcbmltcG9ydCB0eXBlIHsgUXVldWluZ1N0cmF0ZWd5LCBRdWV1aW5nU3RyYXRlZ3lTaXplQ2FsbGJhY2sgfSBmcm9tICcuL3F1ZXVpbmctc3RyYXRlZ3knO1xuaW1wb3J0IHsgQ3JlYXRlV3JpdGFibGVTdHJlYW0sIFdyaXRhYmxlU3RyZWFtLCBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRXJyb3JJZk5lZWRlZCB9IGZyb20gJy4vd3JpdGFibGUtc3RyZWFtJztcbmltcG9ydCB7IHNldEZ1bmN0aW9uTmFtZSwgdHlwZUlzT2JqZWN0IH0gZnJvbSAnLi9oZWxwZXJzL21pc2NlbGxhbmVvdXMnO1xuaW1wb3J0IHsgSXNOb25OZWdhdGl2ZU51bWJlciB9IGZyb20gJy4vYWJzdHJhY3Qtb3BzL21pc2NlbGxhbmVvdXMnO1xuaW1wb3J0IHsgY29udmVydFF1ZXVpbmdTdHJhdGVneSB9IGZyb20gJy4vdmFsaWRhdG9ycy9xdWV1aW5nLXN0cmF0ZWd5JztcbmltcG9ydCB7IEV4dHJhY3RIaWdoV2F0ZXJNYXJrLCBFeHRyYWN0U2l6ZUFsZ29yaXRobSB9IGZyb20gJy4vYWJzdHJhY3Qtb3BzL3F1ZXVpbmctc3RyYXRlZ3knO1xuaW1wb3J0IHR5cGUge1xuICBUcmFuc2Zvcm1lcixcbiAgVHJhbnNmb3JtZXJDYW5jZWxDYWxsYmFjayxcbiAgVHJhbnNmb3JtZXJGbHVzaENhbGxiYWNrLFxuICBUcmFuc2Zvcm1lclN0YXJ0Q2FsbGJhY2ssXG4gIFRyYW5zZm9ybWVyVHJhbnNmb3JtQ2FsbGJhY2ssXG4gIFZhbGlkYXRlZFRyYW5zZm9ybWVyXG59IGZyb20gJy4vdHJhbnNmb3JtLXN0cmVhbS90cmFuc2Zvcm1lcic7XG5pbXBvcnQgeyBjb252ZXJ0VHJhbnNmb3JtZXIgfSBmcm9tICcuL3ZhbGlkYXRvcnMvdHJhbnNmb3JtZXInO1xuXG4vLyBDbGFzcyBUcmFuc2Zvcm1TdHJlYW1cblxuLyoqXG4gKiBBIHRyYW5zZm9ybSBzdHJlYW0gY29uc2lzdHMgb2YgYSBwYWlyIG9mIHN0cmVhbXM6IGEge0BsaW5rIFdyaXRhYmxlU3RyZWFtIHwgd3JpdGFibGUgc3RyZWFtfSxcbiAqIGtub3duIGFzIGl0cyB3cml0YWJsZSBzaWRlLCBhbmQgYSB7QGxpbmsgUmVhZGFibGVTdHJlYW0gfCByZWFkYWJsZSBzdHJlYW19LCBrbm93biBhcyBpdHMgcmVhZGFibGUgc2lkZS5cbiAqIEluIGEgbWFubmVyIHNwZWNpZmljIHRvIHRoZSB0cmFuc2Zvcm0gc3RyZWFtIGluIHF1ZXN0aW9uLCB3cml0ZXMgdG8gdGhlIHdyaXRhYmxlIHNpZGUgcmVzdWx0IGluIG5ldyBkYXRhIGJlaW5nXG4gKiBtYWRlIGF2YWlsYWJsZSBmb3IgcmVhZGluZyBmcm9tIHRoZSByZWFkYWJsZSBzaWRlLlxuICpcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNsYXNzIFRyYW5zZm9ybVN0cmVhbTxJID0gYW55LCBPID0gYW55PiB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3dyaXRhYmxlITogV3JpdGFibGVTdHJlYW08ST47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3JlYWRhYmxlITogRGVmYXVsdFJlYWRhYmxlU3RyZWFtPE8+O1xuICAvKiogQGludGVybmFsICovXG4gIF9iYWNrcHJlc3N1cmUhOiBib29sZWFuO1xuICAvKiogQGludGVybmFsICovXG4gIF9iYWNrcHJlc3N1cmVDaGFuZ2VQcm9taXNlITogUHJvbWlzZTx2b2lkPjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfYmFja3ByZXNzdXJlQ2hhbmdlUHJvbWlzZV9yZXNvbHZlITogKCkgPT4gdm9pZDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfdHJhbnNmb3JtU3RyZWFtQ29udHJvbGxlciE6IFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyPE8+O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHRyYW5zZm9ybWVyPzogVHJhbnNmb3JtZXI8SSwgTz4sXG4gICAgd3JpdGFibGVTdHJhdGVneT86IFF1ZXVpbmdTdHJhdGVneTxJPixcbiAgICByZWFkYWJsZVN0cmF0ZWd5PzogUXVldWluZ1N0cmF0ZWd5PE8+XG4gICk7XG4gIGNvbnN0cnVjdG9yKHJhd1RyYW5zZm9ybWVyOiBUcmFuc2Zvcm1lcjxJLCBPPiB8IG51bGwgfCB1bmRlZmluZWQgPSB7fSxcbiAgICAgICAgICAgICAgcmF3V3JpdGFibGVTdHJhdGVneTogUXVldWluZ1N0cmF0ZWd5PEk+IHwgbnVsbCB8IHVuZGVmaW5lZCA9IHt9LFxuICAgICAgICAgICAgICByYXdSZWFkYWJsZVN0cmF0ZWd5OiBRdWV1aW5nU3RyYXRlZ3k8Tz4gfCBudWxsIHwgdW5kZWZpbmVkID0ge30pIHtcbiAgICBpZiAocmF3VHJhbnNmb3JtZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmF3VHJhbnNmb3JtZXIgPSBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHdyaXRhYmxlU3RyYXRlZ3kgPSBjb252ZXJ0UXVldWluZ1N0cmF0ZWd5KHJhd1dyaXRhYmxlU3RyYXRlZ3ksICdTZWNvbmQgcGFyYW1ldGVyJyk7XG4gICAgY29uc3QgcmVhZGFibGVTdHJhdGVneSA9IGNvbnZlcnRRdWV1aW5nU3RyYXRlZ3kocmF3UmVhZGFibGVTdHJhdGVneSwgJ1RoaXJkIHBhcmFtZXRlcicpO1xuXG4gICAgY29uc3QgdHJhbnNmb3JtZXIgPSBjb252ZXJ0VHJhbnNmb3JtZXIocmF3VHJhbnNmb3JtZXIsICdGaXJzdCBwYXJhbWV0ZXInKTtcbiAgICBpZiAodHJhbnNmb3JtZXIucmVhZGFibGVUeXBlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbnZhbGlkIHJlYWRhYmxlVHlwZSBzcGVjaWZpZWQnKTtcbiAgICB9XG4gICAgaWYgKHRyYW5zZm9ybWVyLndyaXRhYmxlVHlwZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW52YWxpZCB3cml0YWJsZVR5cGUgc3BlY2lmaWVkJyk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVhZGFibGVIaWdoV2F0ZXJNYXJrID0gRXh0cmFjdEhpZ2hXYXRlck1hcmsocmVhZGFibGVTdHJhdGVneSwgMCk7XG4gICAgY29uc3QgcmVhZGFibGVTaXplQWxnb3JpdGhtID0gRXh0cmFjdFNpemVBbGdvcml0aG0ocmVhZGFibGVTdHJhdGVneSk7XG4gICAgY29uc3Qgd3JpdGFibGVIaWdoV2F0ZXJNYXJrID0gRXh0cmFjdEhpZ2hXYXRlck1hcmsod3JpdGFibGVTdHJhdGVneSwgMSk7XG4gICAgY29uc3Qgd3JpdGFibGVTaXplQWxnb3JpdGhtID0gRXh0cmFjdFNpemVBbGdvcml0aG0od3JpdGFibGVTdHJhdGVneSk7XG5cbiAgICBsZXQgc3RhcnRQcm9taXNlX3Jlc29sdmUhOiAodmFsdWU6IHZvaWQgfCBQcm9taXNlTGlrZTx2b2lkPikgPT4gdm9pZDtcbiAgICBjb25zdCBzdGFydFByb21pc2UgPSBuZXdQcm9taXNlPHZvaWQ+KHJlc29sdmUgPT4ge1xuICAgICAgc3RhcnRQcm9taXNlX3Jlc29sdmUgPSByZXNvbHZlO1xuICAgIH0pO1xuXG4gICAgSW5pdGlhbGl6ZVRyYW5zZm9ybVN0cmVhbShcbiAgICAgIHRoaXMsIHN0YXJ0UHJvbWlzZSwgd3JpdGFibGVIaWdoV2F0ZXJNYXJrLCB3cml0YWJsZVNpemVBbGdvcml0aG0sIHJlYWRhYmxlSGlnaFdhdGVyTWFyaywgcmVhZGFibGVTaXplQWxnb3JpdGhtXG4gICAgKTtcbiAgICBTZXRVcFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyRnJvbVRyYW5zZm9ybWVyKHRoaXMsIHRyYW5zZm9ybWVyKTtcblxuICAgIGlmICh0cmFuc2Zvcm1lci5zdGFydCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBzdGFydFByb21pc2VfcmVzb2x2ZSh0cmFuc2Zvcm1lci5zdGFydCh0aGlzLl90cmFuc2Zvcm1TdHJlYW1Db250cm9sbGVyKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXJ0UHJvbWlzZV9yZXNvbHZlKHVuZGVmaW5lZCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoZSByZWFkYWJsZSBzaWRlIG9mIHRoZSB0cmFuc2Zvcm0gc3RyZWFtLlxuICAgKi9cbiAgZ2V0IHJlYWRhYmxlKCk6IFJlYWRhYmxlU3RyZWFtPE8+IHtcbiAgICBpZiAoIUlzVHJhbnNmb3JtU3RyZWFtKHRoaXMpKSB7XG4gICAgICB0aHJvdyBzdHJlYW1CcmFuZENoZWNrRXhjZXB0aW9uKCdyZWFkYWJsZScpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9yZWFkYWJsZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgd3JpdGFibGUgc2lkZSBvZiB0aGUgdHJhbnNmb3JtIHN0cmVhbS5cbiAgICovXG4gIGdldCB3cml0YWJsZSgpOiBXcml0YWJsZVN0cmVhbTxJPiB7XG4gICAgaWYgKCFJc1RyYW5zZm9ybVN0cmVhbSh0aGlzKSkge1xuICAgICAgdGhyb3cgc3RyZWFtQnJhbmRDaGVja0V4Y2VwdGlvbignd3JpdGFibGUnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fd3JpdGFibGU7XG4gIH1cbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoVHJhbnNmb3JtU3RyZWFtLnByb3RvdHlwZSwge1xuICByZWFkYWJsZTogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIHdyaXRhYmxlOiB7IGVudW1lcmFibGU6IHRydWUgfVxufSk7XG5pZiAodHlwZW9mIFN5bWJvbC50b1N0cmluZ1RhZyA9PT0gJ3N5bWJvbCcpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFRyYW5zZm9ybVN0cmVhbS5wcm90b3R5cGUsIFN5bWJvbC50b1N0cmluZ1RhZywge1xuICAgIHZhbHVlOiAnVHJhbnNmb3JtU3RyZWFtJyxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG59XG5cbmV4cG9ydCB0eXBlIHtcbiAgVHJhbnNmb3JtZXIsXG4gIFRyYW5zZm9ybWVyQ2FuY2VsQ2FsbGJhY2ssXG4gIFRyYW5zZm9ybWVyU3RhcnRDYWxsYmFjayxcbiAgVHJhbnNmb3JtZXJGbHVzaENhbGxiYWNrLFxuICBUcmFuc2Zvcm1lclRyYW5zZm9ybUNhbGxiYWNrXG59O1xuXG4vLyBUcmFuc2Zvcm0gU3RyZWFtIEFic3RyYWN0IE9wZXJhdGlvbnNcblxuZXhwb3J0IGZ1bmN0aW9uIENyZWF0ZVRyYW5zZm9ybVN0cmVhbTxJLCBPPihzdGFydEFsZ29yaXRobTogKCkgPT4gdm9pZCB8IFByb21pc2VMaWtlPHZvaWQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1BbGdvcml0aG06IChjaHVuazogSSkgPT4gUHJvbWlzZTx2b2lkPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmx1c2hBbGdvcml0aG06ICgpID0+IFByb21pc2U8dm9pZD4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbmNlbEFsZ29yaXRobTogKHJlYXNvbjogYW55KSA9PiBQcm9taXNlPHZvaWQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3cml0YWJsZUhpZ2hXYXRlck1hcmsgPSAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3cml0YWJsZVNpemVBbGdvcml0aG06IFF1ZXVpbmdTdHJhdGVneVNpemVDYWxsYmFjazxJPiA9ICgpID0+IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlYWRhYmxlSGlnaFdhdGVyTWFyayA9IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlYWRhYmxlU2l6ZUFsZ29yaXRobTogUXVldWluZ1N0cmF0ZWd5U2l6ZUNhbGxiYWNrPE8+ID0gKCkgPT4gMSkge1xuICBhc3NlcnQoSXNOb25OZWdhdGl2ZU51bWJlcih3cml0YWJsZUhpZ2hXYXRlck1hcmspKTtcbiAgYXNzZXJ0KElzTm9uTmVnYXRpdmVOdW1iZXIocmVhZGFibGVIaWdoV2F0ZXJNYXJrKSk7XG5cbiAgY29uc3Qgc3RyZWFtOiBUcmFuc2Zvcm1TdHJlYW08SSwgTz4gPSBPYmplY3QuY3JlYXRlKFRyYW5zZm9ybVN0cmVhbS5wcm90b3R5cGUpO1xuXG4gIGxldCBzdGFydFByb21pc2VfcmVzb2x2ZSE6ICh2YWx1ZTogdm9pZCB8IFByb21pc2VMaWtlPHZvaWQ+KSA9PiB2b2lkO1xuICBjb25zdCBzdGFydFByb21pc2UgPSBuZXdQcm9taXNlPHZvaWQ+KHJlc29sdmUgPT4ge1xuICAgIHN0YXJ0UHJvbWlzZV9yZXNvbHZlID0gcmVzb2x2ZTtcbiAgfSk7XG5cbiAgSW5pdGlhbGl6ZVRyYW5zZm9ybVN0cmVhbShzdHJlYW0sIHN0YXJ0UHJvbWlzZSwgd3JpdGFibGVIaWdoV2F0ZXJNYXJrLCB3cml0YWJsZVNpemVBbGdvcml0aG0sIHJlYWRhYmxlSGlnaFdhdGVyTWFyayxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWFkYWJsZVNpemVBbGdvcml0aG0pO1xuXG4gIGNvbnN0IGNvbnRyb2xsZXI6IFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyPE8+ID0gT2JqZWN0LmNyZWF0ZShUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlci5wcm90b3R5cGUpO1xuXG4gIFNldFVwVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIoc3RyZWFtLCBjb250cm9sbGVyLCB0cmFuc2Zvcm1BbGdvcml0aG0sIGZsdXNoQWxnb3JpdGhtLCBjYW5jZWxBbGdvcml0aG0pO1xuXG4gIGNvbnN0IHN0YXJ0UmVzdWx0ID0gc3RhcnRBbGdvcml0aG0oKTtcbiAgc3RhcnRQcm9taXNlX3Jlc29sdmUoc3RhcnRSZXN1bHQpO1xuICByZXR1cm4gc3RyZWFtO1xufVxuXG5mdW5jdGlvbiBJbml0aWFsaXplVHJhbnNmb3JtU3RyZWFtPEksIE8+KHN0cmVhbTogVHJhbnNmb3JtU3RyZWFtPEksIE8+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFByb21pc2U6IFByb21pc2U8dm9pZD4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdyaXRhYmxlSGlnaFdhdGVyTWFyazogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3cml0YWJsZVNpemVBbGdvcml0aG06IFF1ZXVpbmdTdHJhdGVneVNpemVDYWxsYmFjazxJPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVhZGFibGVIaWdoV2F0ZXJNYXJrOiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlYWRhYmxlU2l6ZUFsZ29yaXRobTogUXVldWluZ1N0cmF0ZWd5U2l6ZUNhbGxiYWNrPE8+KSB7XG4gIGZ1bmN0aW9uIHN0YXJ0QWxnb3JpdGhtKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiBzdGFydFByb21pc2U7XG4gIH1cblxuICBmdW5jdGlvbiB3cml0ZUFsZ29yaXRobShjaHVuazogSSk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0U2lua1dyaXRlQWxnb3JpdGhtKHN0cmVhbSwgY2h1bmspO1xuICB9XG5cbiAgZnVuY3Rpb24gYWJvcnRBbGdvcml0aG0ocmVhc29uOiBhbnkpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gVHJhbnNmb3JtU3RyZWFtRGVmYXVsdFNpbmtBYm9ydEFsZ29yaXRobShzdHJlYW0sIHJlYXNvbik7XG4gIH1cblxuICBmdW5jdGlvbiBjbG9zZUFsZ29yaXRobSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gVHJhbnNmb3JtU3RyZWFtRGVmYXVsdFNpbmtDbG9zZUFsZ29yaXRobShzdHJlYW0pO1xuICB9XG5cbiAgc3RyZWFtLl93cml0YWJsZSA9IENyZWF0ZVdyaXRhYmxlU3RyZWFtKHN0YXJ0QWxnb3JpdGhtLCB3cml0ZUFsZ29yaXRobSwgY2xvc2VBbGdvcml0aG0sIGFib3J0QWxnb3JpdGhtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd3JpdGFibGVIaWdoV2F0ZXJNYXJrLCB3cml0YWJsZVNpemVBbGdvcml0aG0pO1xuXG4gIGZ1bmN0aW9uIHB1bGxBbGdvcml0aG0oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIFRyYW5zZm9ybVN0cmVhbURlZmF1bHRTb3VyY2VQdWxsQWxnb3JpdGhtKHN0cmVhbSk7XG4gIH1cblxuICBmdW5jdGlvbiBjYW5jZWxBbGdvcml0aG0ocmVhc29uOiBhbnkpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gVHJhbnNmb3JtU3RyZWFtRGVmYXVsdFNvdXJjZUNhbmNlbEFsZ29yaXRobShzdHJlYW0sIHJlYXNvbik7XG4gIH1cblxuICBzdHJlYW0uX3JlYWRhYmxlID0gQ3JlYXRlUmVhZGFibGVTdHJlYW0oc3RhcnRBbGdvcml0aG0sIHB1bGxBbGdvcml0aG0sIGNhbmNlbEFsZ29yaXRobSwgcmVhZGFibGVIaWdoV2F0ZXJNYXJrLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVhZGFibGVTaXplQWxnb3JpdGhtKTtcblxuICAvLyBUaGUgW1tiYWNrcHJlc3N1cmVdXSBzbG90IGlzIHNldCB0byB1bmRlZmluZWQgc28gdGhhdCBpdCBjYW4gYmUgaW5pdGlhbGlzZWQgYnkgVHJhbnNmb3JtU3RyZWFtU2V0QmFja3ByZXNzdXJlLlxuICBzdHJlYW0uX2JhY2twcmVzc3VyZSA9IHVuZGVmaW5lZCE7XG4gIHN0cmVhbS5fYmFja3ByZXNzdXJlQ2hhbmdlUHJvbWlzZSA9IHVuZGVmaW5lZCE7XG4gIHN0cmVhbS5fYmFja3ByZXNzdXJlQ2hhbmdlUHJvbWlzZV9yZXNvbHZlID0gdW5kZWZpbmVkITtcbiAgVHJhbnNmb3JtU3RyZWFtU2V0QmFja3ByZXNzdXJlKHN0cmVhbSwgdHJ1ZSk7XG5cbiAgc3RyZWFtLl90cmFuc2Zvcm1TdHJlYW1Db250cm9sbGVyID0gdW5kZWZpbmVkITtcbn1cblxuZnVuY3Rpb24gSXNUcmFuc2Zvcm1TdHJlYW0oeDogdW5rbm93bik6IHggaXMgVHJhbnNmb3JtU3RyZWFtIHtcbiAgaWYgKCF0eXBlSXNPYmplY3QoeCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh4LCAnX3RyYW5zZm9ybVN0cmVhbUNvbnRyb2xsZXInKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB4IGluc3RhbmNlb2YgVHJhbnNmb3JtU3RyZWFtO1xufVxuXG4vLyBUaGlzIGlzIGEgbm8tb3AgaWYgYm90aCBzaWRlcyBhcmUgYWxyZWFkeSBlcnJvcmVkLlxuZnVuY3Rpb24gVHJhbnNmb3JtU3RyZWFtRXJyb3Ioc3RyZWFtOiBUcmFuc2Zvcm1TdHJlYW0sIGU6IGFueSkge1xuICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRXJyb3Ioc3RyZWFtLl9yZWFkYWJsZS5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyLCBlKTtcbiAgVHJhbnNmb3JtU3RyZWFtRXJyb3JXcml0YWJsZUFuZFVuYmxvY2tXcml0ZShzdHJlYW0sIGUpO1xufVxuXG5mdW5jdGlvbiBUcmFuc2Zvcm1TdHJlYW1FcnJvcldyaXRhYmxlQW5kVW5ibG9ja1dyaXRlKHN0cmVhbTogVHJhbnNmb3JtU3RyZWFtLCBlOiBhbnkpIHtcbiAgVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDbGVhckFsZ29yaXRobXMoc3RyZWFtLl90cmFuc2Zvcm1TdHJlYW1Db250cm9sbGVyKTtcbiAgV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVycm9ySWZOZWVkZWQoc3RyZWFtLl93cml0YWJsZS5fd3JpdGFibGVTdHJlYW1Db250cm9sbGVyLCBlKTtcbiAgVHJhbnNmb3JtU3RyZWFtVW5ibG9ja1dyaXRlKHN0cmVhbSk7XG59XG5cbmZ1bmN0aW9uIFRyYW5zZm9ybVN0cmVhbVVuYmxvY2tXcml0ZShzdHJlYW06IFRyYW5zZm9ybVN0cmVhbSkge1xuICBpZiAoc3RyZWFtLl9iYWNrcHJlc3N1cmUpIHtcbiAgICAvLyBQcmV0ZW5kIHRoYXQgcHVsbCgpIHdhcyBjYWxsZWQgdG8gcGVybWl0IGFueSBwZW5kaW5nIHdyaXRlKCkgY2FsbHMgdG8gY29tcGxldGUuIFRyYW5zZm9ybVN0cmVhbVNldEJhY2twcmVzc3VyZSgpXG4gICAgLy8gY2Fubm90IGJlIGNhbGxlZCBmcm9tIGVucXVldWUoKSBvciBwdWxsKCkgb25jZSB0aGUgUmVhZGFibGVTdHJlYW0gaXMgZXJyb3JlZCwgc28gdGhpcyB3aWxsIHdpbGwgYmUgdGhlIGZpbmFsIHRpbWVcbiAgICAvLyBfYmFja3ByZXNzdXJlIGlzIHNldC5cbiAgICBUcmFuc2Zvcm1TdHJlYW1TZXRCYWNrcHJlc3N1cmUoc3RyZWFtLCBmYWxzZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gVHJhbnNmb3JtU3RyZWFtU2V0QmFja3ByZXNzdXJlKHN0cmVhbTogVHJhbnNmb3JtU3RyZWFtLCBiYWNrcHJlc3N1cmU6IGJvb2xlYW4pIHtcbiAgLy8gUGFzc2VzIGFsc28gd2hlbiBjYWxsZWQgZHVyaW5nIGNvbnN0cnVjdGlvbi5cbiAgYXNzZXJ0KHN0cmVhbS5fYmFja3ByZXNzdXJlICE9PSBiYWNrcHJlc3N1cmUpO1xuXG4gIGlmIChzdHJlYW0uX2JhY2twcmVzc3VyZUNoYW5nZVByb21pc2UgIT09IHVuZGVmaW5lZCkge1xuICAgIHN0cmVhbS5fYmFja3ByZXNzdXJlQ2hhbmdlUHJvbWlzZV9yZXNvbHZlKCk7XG4gIH1cblxuICBzdHJlYW0uX2JhY2twcmVzc3VyZUNoYW5nZVByb21pc2UgPSBuZXdQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgIHN0cmVhbS5fYmFja3ByZXNzdXJlQ2hhbmdlUHJvbWlzZV9yZXNvbHZlID0gcmVzb2x2ZTtcbiAgfSk7XG5cbiAgc3RyZWFtLl9iYWNrcHJlc3N1cmUgPSBiYWNrcHJlc3N1cmU7XG59XG5cbi8vIENsYXNzIFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyXG5cbi8qKlxuICogQWxsb3dzIGNvbnRyb2wgb2YgdGhlIHtAbGluayBSZWFkYWJsZVN0cmVhbX0gYW5kIHtAbGluayBXcml0YWJsZVN0cmVhbX0gb2YgdGhlIGFzc29jaWF0ZWQge0BsaW5rIFRyYW5zZm9ybVN0cmVhbX0uXG4gKlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY2xhc3MgVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8Tz4ge1xuICAvKiogQGludGVybmFsICovXG4gIF9jb250cm9sbGVkVHJhbnNmb3JtU3RyZWFtOiBUcmFuc2Zvcm1TdHJlYW08YW55LCBPPjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfZmluaXNoUHJvbWlzZTogUHJvbWlzZTx1bmRlZmluZWQ+IHwgdW5kZWZpbmVkO1xuICAvKiogQGludGVybmFsICovXG4gIF9maW5pc2hQcm9taXNlX3Jlc29sdmU/OiAodmFsdWU/OiB1bmRlZmluZWQpID0+IHZvaWQ7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2ZpbmlzaFByb21pc2VfcmVqZWN0PzogKHJlYXNvbjogYW55KSA9PiB2b2lkO1xuICAvKiogQGludGVybmFsICovXG4gIF90cmFuc2Zvcm1BbGdvcml0aG06IChjaHVuazogYW55KSA9PiBQcm9taXNlPHZvaWQ+O1xuICAvKiogQGludGVybmFsICovXG4gIF9mbHVzaEFsZ29yaXRobTogKCkgPT4gUHJvbWlzZTx2b2lkPjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfY2FuY2VsQWxnb3JpdGhtOiAocmVhc29uOiBhbnkpID0+IFByb21pc2U8dm9pZD47XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbGxlZ2FsIGNvbnN0cnVjdG9yJyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZGVzaXJlZCBzaXplIHRvIGZpbGwgdGhlIHJlYWRhYmxlIHNpZGXigJlzIGludGVybmFsIHF1ZXVlLiBJdCBjYW4gYmUgbmVnYXRpdmUsIGlmIHRoZSBxdWV1ZSBpcyBvdmVyLWZ1bGwuXG4gICAqL1xuICBnZXQgZGVzaXJlZFNpemUoKTogbnVtYmVyIHwgbnVsbCB7XG4gICAgaWYgKCFJc1RyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyKHRoaXMpKSB7XG4gICAgICB0aHJvdyBkZWZhdWx0Q29udHJvbGxlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ2Rlc2lyZWRTaXplJyk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVhZGFibGVDb250cm9sbGVyID0gdGhpcy5fY29udHJvbGxlZFRyYW5zZm9ybVN0cmVhbS5fcmVhZGFibGUuX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlcjtcbiAgICByZXR1cm4gUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckdldERlc2lyZWRTaXplKHJlYWRhYmxlQ29udHJvbGxlcik7XG4gIH1cblxuICAvKipcbiAgICogRW5xdWV1ZXMgdGhlIGdpdmVuIGNodW5rIGBjaHVua2AgaW4gdGhlIHJlYWRhYmxlIHNpZGUgb2YgdGhlIGNvbnRyb2xsZWQgdHJhbnNmb3JtIHN0cmVhbS5cbiAgICovXG4gIGVucXVldWUoY2h1bms6IE8pOiB2b2lkO1xuICBlbnF1ZXVlKGNodW5rOiBPID0gdW5kZWZpbmVkISk6IHZvaWQge1xuICAgIGlmICghSXNUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlcih0aGlzKSkge1xuICAgICAgdGhyb3cgZGVmYXVsdENvbnRyb2xsZXJCcmFuZENoZWNrRXhjZXB0aW9uKCdlbnF1ZXVlJyk7XG4gICAgfVxuXG4gICAgVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFbnF1ZXVlKHRoaXMsIGNodW5rKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFcnJvcnMgYm90aCB0aGUgcmVhZGFibGUgc2lkZSBhbmQgdGhlIHdyaXRhYmxlIHNpZGUgb2YgdGhlIGNvbnRyb2xsZWQgdHJhbnNmb3JtIHN0cmVhbSwgbWFraW5nIGFsbCBmdXR1cmVcbiAgICogaW50ZXJhY3Rpb25zIHdpdGggaXQgZmFpbCB3aXRoIHRoZSBnaXZlbiBlcnJvciBgZWAuIEFueSBjaHVua3MgcXVldWVkIGZvciB0cmFuc2Zvcm1hdGlvbiB3aWxsIGJlIGRpc2NhcmRlZC5cbiAgICovXG4gIGVycm9yKHJlYXNvbjogYW55ID0gdW5kZWZpbmVkKTogdm9pZCB7XG4gICAgaWYgKCFJc1RyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyKHRoaXMpKSB7XG4gICAgICB0aHJvdyBkZWZhdWx0Q29udHJvbGxlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ2Vycm9yJyk7XG4gICAgfVxuXG4gICAgVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFcnJvcih0aGlzLCByZWFzb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIENsb3NlcyB0aGUgcmVhZGFibGUgc2lkZSBhbmQgZXJyb3JzIHRoZSB3cml0YWJsZSBzaWRlIG9mIHRoZSBjb250cm9sbGVkIHRyYW5zZm9ybSBzdHJlYW0uIFRoaXMgaXMgdXNlZnVsIHdoZW4gdGhlXG4gICAqIHRyYW5zZm9ybWVyIG9ubHkgbmVlZHMgdG8gY29uc3VtZSBhIHBvcnRpb24gb2YgdGhlIGNodW5rcyB3cml0dGVuIHRvIHRoZSB3cml0YWJsZSBzaWRlLlxuICAgKi9cbiAgdGVybWluYXRlKCk6IHZvaWQge1xuICAgIGlmICghSXNUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlcih0aGlzKSkge1xuICAgICAgdGhyb3cgZGVmYXVsdENvbnRyb2xsZXJCcmFuZENoZWNrRXhjZXB0aW9uKCd0ZXJtaW5hdGUnKTtcbiAgICB9XG5cbiAgICBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlclRlcm1pbmF0ZSh0aGlzKTtcbiAgfVxufVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyhUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlci5wcm90b3R5cGUsIHtcbiAgZW5xdWV1ZTogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIGVycm9yOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgdGVybWluYXRlOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgZGVzaXJlZFNpemU6IHsgZW51bWVyYWJsZTogdHJ1ZSB9XG59KTtcbnNldEZ1bmN0aW9uTmFtZShUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlci5wcm90b3R5cGUuZW5xdWV1ZSwgJ2VucXVldWUnKTtcbnNldEZ1bmN0aW9uTmFtZShUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlci5wcm90b3R5cGUuZXJyb3IsICdlcnJvcicpO1xuc2V0RnVuY3Rpb25OYW1lKFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyLnByb3RvdHlwZS50ZXJtaW5hdGUsICd0ZXJtaW5hdGUnKTtcbmlmICh0eXBlb2YgU3ltYm9sLnRvU3RyaW5nVGFnID09PSAnc3ltYm9sJykge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIucHJvdG90eXBlLCBTeW1ib2wudG9TdHJpbmdUYWcsIHtcbiAgICB2YWx1ZTogJ1RyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyJyxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG59XG5cbi8vIFRyYW5zZm9ybSBTdHJlYW0gRGVmYXVsdCBDb250cm9sbGVyIEFic3RyYWN0IE9wZXJhdGlvbnNcblxuZnVuY3Rpb24gSXNUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxPID0gYW55Pih4OiBhbnkpOiB4IGlzIFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyPE8+IHtcbiAgaWYgKCF0eXBlSXNPYmplY3QoeCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh4LCAnX2NvbnRyb2xsZWRUcmFuc2Zvcm1TdHJlYW0nKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB4IGluc3RhbmNlb2YgVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI7XG59XG5cbmZ1bmN0aW9uIFNldFVwVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8SSwgTz4oc3RyZWFtOiBUcmFuc2Zvcm1TdHJlYW08SSwgTz4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyPE8+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1BbGdvcml0aG06IChjaHVuazogSSkgPT4gUHJvbWlzZTx2b2lkPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmx1c2hBbGdvcml0aG06ICgpID0+IFByb21pc2U8dm9pZD4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbmNlbEFsZ29yaXRobTogKHJlYXNvbjogYW55KSA9PiBQcm9taXNlPHZvaWQ+KSB7XG4gIGFzc2VydChJc1RyYW5zZm9ybVN0cmVhbShzdHJlYW0pKTtcbiAgYXNzZXJ0KHN0cmVhbS5fdHJhbnNmb3JtU3RyZWFtQ29udHJvbGxlciA9PT0gdW5kZWZpbmVkKTtcblxuICBjb250cm9sbGVyLl9jb250cm9sbGVkVHJhbnNmb3JtU3RyZWFtID0gc3RyZWFtO1xuICBzdHJlYW0uX3RyYW5zZm9ybVN0cmVhbUNvbnRyb2xsZXIgPSBjb250cm9sbGVyO1xuXG4gIGNvbnRyb2xsZXIuX3RyYW5zZm9ybUFsZ29yaXRobSA9IHRyYW5zZm9ybUFsZ29yaXRobTtcbiAgY29udHJvbGxlci5fZmx1c2hBbGdvcml0aG0gPSBmbHVzaEFsZ29yaXRobTtcbiAgY29udHJvbGxlci5fY2FuY2VsQWxnb3JpdGhtID0gY2FuY2VsQWxnb3JpdGhtO1xuXG4gIGNvbnRyb2xsZXIuX2ZpbmlzaFByb21pc2UgPSB1bmRlZmluZWQ7XG4gIGNvbnRyb2xsZXIuX2ZpbmlzaFByb21pc2VfcmVzb2x2ZSA9IHVuZGVmaW5lZDtcbiAgY29udHJvbGxlci5fZmluaXNoUHJvbWlzZV9yZWplY3QgPSB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIFNldFVwVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJGcm9tVHJhbnNmb3JtZXI8SSwgTz4oc3RyZWFtOiBUcmFuc2Zvcm1TdHJlYW08SSwgTz4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybWVyOiBWYWxpZGF0ZWRUcmFuc2Zvcm1lcjxJLCBPPikge1xuICBjb25zdCBjb250cm9sbGVyOiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxPPiA9IE9iamVjdC5jcmVhdGUoVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIucHJvdG90eXBlKTtcblxuICBsZXQgdHJhbnNmb3JtQWxnb3JpdGhtOiAoY2h1bms6IEkpID0+IFByb21pc2U8dm9pZD47XG4gIGxldCBmbHVzaEFsZ29yaXRobTogKCkgPT4gUHJvbWlzZTx2b2lkPjtcbiAgbGV0IGNhbmNlbEFsZ29yaXRobTogKHJlYXNvbjogYW55KSA9PiBQcm9taXNlPHZvaWQ+O1xuXG4gIGlmICh0cmFuc2Zvcm1lci50cmFuc2Zvcm0gIT09IHVuZGVmaW5lZCkge1xuICAgIHRyYW5zZm9ybUFsZ29yaXRobSA9IGNodW5rID0+IHRyYW5zZm9ybWVyLnRyYW5zZm9ybSEoY2h1bmssIGNvbnRyb2xsZXIpO1xuICB9IGVsc2Uge1xuICAgIHRyYW5zZm9ybUFsZ29yaXRobSA9IGNodW5rID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyRW5xdWV1ZShjb250cm9sbGVyLCBjaHVuayBhcyB1bmtub3duIGFzIE8pO1xuICAgICAgICByZXR1cm4gcHJvbWlzZVJlc29sdmVkV2l0aCh1bmRlZmluZWQpO1xuICAgICAgfSBjYXRjaCAodHJhbnNmb3JtUmVzdWx0RSkge1xuICAgICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aCh0cmFuc2Zvcm1SZXN1bHRFKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgaWYgKHRyYW5zZm9ybWVyLmZsdXNoICE9PSB1bmRlZmluZWQpIHtcbiAgICBmbHVzaEFsZ29yaXRobSA9ICgpID0+IHRyYW5zZm9ybWVyLmZsdXNoIShjb250cm9sbGVyKTtcbiAgfSBlbHNlIHtcbiAgICBmbHVzaEFsZ29yaXRobSA9ICgpID0+IHByb21pc2VSZXNvbHZlZFdpdGgodW5kZWZpbmVkKTtcbiAgfVxuXG4gIGlmICh0cmFuc2Zvcm1lci5jYW5jZWwgIT09IHVuZGVmaW5lZCkge1xuICAgIGNhbmNlbEFsZ29yaXRobSA9IHJlYXNvbiA9PiB0cmFuc2Zvcm1lci5jYW5jZWwhKHJlYXNvbik7XG4gIH0gZWxzZSB7XG4gICAgY2FuY2VsQWxnb3JpdGhtID0gKCkgPT4gcHJvbWlzZVJlc29sdmVkV2l0aCh1bmRlZmluZWQpO1xuICB9XG5cbiAgU2V0VXBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlcihzdHJlYW0sIGNvbnRyb2xsZXIsIHRyYW5zZm9ybUFsZ29yaXRobSwgZmx1c2hBbGdvcml0aG0sIGNhbmNlbEFsZ29yaXRobSk7XG59XG5cbmZ1bmN0aW9uIFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2xlYXJBbGdvcml0aG1zKGNvbnRyb2xsZXI6IFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyPGFueT4pIHtcbiAgY29udHJvbGxlci5fdHJhbnNmb3JtQWxnb3JpdGhtID0gdW5kZWZpbmVkITtcbiAgY29udHJvbGxlci5fZmx1c2hBbGdvcml0aG0gPSB1bmRlZmluZWQhO1xuICBjb250cm9sbGVyLl9jYW5jZWxBbGdvcml0aG0gPSB1bmRlZmluZWQhO1xufVxuXG5mdW5jdGlvbiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlckVucXVldWU8Tz4oY29udHJvbGxlcjogVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8Tz4sIGNodW5rOiBPKSB7XG4gIGNvbnN0IHN0cmVhbSA9IGNvbnRyb2xsZXIuX2NvbnRyb2xsZWRUcmFuc2Zvcm1TdHJlYW07XG4gIGNvbnN0IHJlYWRhYmxlQ29udHJvbGxlciA9IHN0cmVhbS5fcmVhZGFibGUuX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlcjtcbiAgaWYgKCFSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2FuQ2xvc2VPckVucXVldWUocmVhZGFibGVDb250cm9sbGVyKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1JlYWRhYmxlIHNpZGUgaXMgbm90IGluIGEgc3RhdGUgdGhhdCBwZXJtaXRzIGVucXVldWUnKTtcbiAgfVxuXG4gIC8vIFdlIHRocm90dGxlIHRyYW5zZm9ybSBpbnZvY2F0aW9ucyBiYXNlZCBvbiB0aGUgYmFja3ByZXNzdXJlIG9mIHRoZSBSZWFkYWJsZVN0cmVhbSwgYnV0IHdlIHN0aWxsXG4gIC8vIGFjY2VwdCBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlckVucXVldWUoKSBjYWxscy5cblxuICB0cnkge1xuICAgIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFbnF1ZXVlKHJlYWRhYmxlQ29udHJvbGxlciwgY2h1bmspO1xuICB9IGNhdGNoIChlKSB7XG4gICAgLy8gVGhpcyBoYXBwZW5zIHdoZW4gcmVhZGFibGVTdHJhdGVneS5zaXplKCkgdGhyb3dzLlxuICAgIFRyYW5zZm9ybVN0cmVhbUVycm9yV3JpdGFibGVBbmRVbmJsb2NrV3JpdGUoc3RyZWFtLCBlKTtcblxuICAgIHRocm93IHN0cmVhbS5fcmVhZGFibGUuX3N0b3JlZEVycm9yO1xuICB9XG5cbiAgY29uc3QgYmFja3ByZXNzdXJlID0gUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckhhc0JhY2twcmVzc3VyZShyZWFkYWJsZUNvbnRyb2xsZXIpO1xuICBpZiAoYmFja3ByZXNzdXJlICE9PSBzdHJlYW0uX2JhY2twcmVzc3VyZSkge1xuICAgIGFzc2VydChiYWNrcHJlc3N1cmUpO1xuICAgIFRyYW5zZm9ybVN0cmVhbVNldEJhY2twcmVzc3VyZShzdHJlYW0sIHRydWUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyRXJyb3IoY29udHJvbGxlcjogVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8YW55PiwgZTogYW55KSB7XG4gIFRyYW5zZm9ybVN0cmVhbUVycm9yKGNvbnRyb2xsZXIuX2NvbnRyb2xsZWRUcmFuc2Zvcm1TdHJlYW0sIGUpO1xufVxuXG5mdW5jdGlvbiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlclBlcmZvcm1UcmFuc2Zvcm08SSwgTz4oY29udHJvbGxlcjogVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8Tz4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2h1bms6IEkpIHtcbiAgY29uc3QgdHJhbnNmb3JtUHJvbWlzZSA9IGNvbnRyb2xsZXIuX3RyYW5zZm9ybUFsZ29yaXRobShjaHVuayk7XG4gIHJldHVybiB0cmFuc2Zvcm1Qcm9taXNlV2l0aCh0cmFuc2Zvcm1Qcm9taXNlLCB1bmRlZmluZWQsIHIgPT4ge1xuICAgIFRyYW5zZm9ybVN0cmVhbUVycm9yKGNvbnRyb2xsZXIuX2NvbnRyb2xsZWRUcmFuc2Zvcm1TdHJlYW0sIHIpO1xuICAgIHRocm93IHI7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlclRlcm1pbmF0ZTxPPihjb250cm9sbGVyOiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxPPikge1xuICBjb25zdCBzdHJlYW0gPSBjb250cm9sbGVyLl9jb250cm9sbGVkVHJhbnNmb3JtU3RyZWFtO1xuICBjb25zdCByZWFkYWJsZUNvbnRyb2xsZXIgPSBzdHJlYW0uX3JlYWRhYmxlLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXI7XG5cbiAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNsb3NlKHJlYWRhYmxlQ29udHJvbGxlcik7XG5cbiAgY29uc3QgZXJyb3IgPSBuZXcgVHlwZUVycm9yKCdUcmFuc2Zvcm1TdHJlYW0gdGVybWluYXRlZCcpO1xuICBUcmFuc2Zvcm1TdHJlYW1FcnJvcldyaXRhYmxlQW5kVW5ibG9ja1dyaXRlKHN0cmVhbSwgZXJyb3IpO1xufVxuXG4vLyBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0U2luayBBbGdvcml0aG1zXG5cbmZ1bmN0aW9uIFRyYW5zZm9ybVN0cmVhbURlZmF1bHRTaW5rV3JpdGVBbGdvcml0aG08SSwgTz4oc3RyZWFtOiBUcmFuc2Zvcm1TdHJlYW08SSwgTz4sIGNodW5rOiBJKTogUHJvbWlzZTx2b2lkPiB7XG4gIGFzc2VydChzdHJlYW0uX3dyaXRhYmxlLl9zdGF0ZSA9PT0gJ3dyaXRhYmxlJyk7XG5cbiAgY29uc3QgY29udHJvbGxlciA9IHN0cmVhbS5fdHJhbnNmb3JtU3RyZWFtQ29udHJvbGxlcjtcblxuICBpZiAoc3RyZWFtLl9iYWNrcHJlc3N1cmUpIHtcbiAgICBjb25zdCBiYWNrcHJlc3N1cmVDaGFuZ2VQcm9taXNlID0gc3RyZWFtLl9iYWNrcHJlc3N1cmVDaGFuZ2VQcm9taXNlO1xuICAgIGFzc2VydChiYWNrcHJlc3N1cmVDaGFuZ2VQcm9taXNlICE9PSB1bmRlZmluZWQpO1xuICAgIHJldHVybiB0cmFuc2Zvcm1Qcm9taXNlV2l0aChiYWNrcHJlc3N1cmVDaGFuZ2VQcm9taXNlLCAoKSA9PiB7XG4gICAgICBjb25zdCB3cml0YWJsZSA9IHN0cmVhbS5fd3JpdGFibGU7XG4gICAgICBjb25zdCBzdGF0ZSA9IHdyaXRhYmxlLl9zdGF0ZTtcbiAgICAgIGlmIChzdGF0ZSA9PT0gJ2Vycm9yaW5nJykge1xuICAgICAgICB0aHJvdyB3cml0YWJsZS5fc3RvcmVkRXJyb3I7XG4gICAgICB9XG4gICAgICBhc3NlcnQoc3RhdGUgPT09ICd3cml0YWJsZScpO1xuICAgICAgcmV0dXJuIFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyUGVyZm9ybVRyYW5zZm9ybTxJLCBPPihjb250cm9sbGVyLCBjaHVuayk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJQZXJmb3JtVHJhbnNmb3JtPEksIE8+KGNvbnRyb2xsZXIsIGNodW5rKTtcbn1cblxuZnVuY3Rpb24gVHJhbnNmb3JtU3RyZWFtRGVmYXVsdFNpbmtBYm9ydEFsZ29yaXRobTxJLCBPPihzdHJlYW06IFRyYW5zZm9ybVN0cmVhbTxJLCBPPiwgcmVhc29uOiBhbnkpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgY29udHJvbGxlciA9IHN0cmVhbS5fdHJhbnNmb3JtU3RyZWFtQ29udHJvbGxlcjtcbiAgaWYgKGNvbnRyb2xsZXIuX2ZpbmlzaFByb21pc2UgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBjb250cm9sbGVyLl9maW5pc2hQcm9taXNlO1xuICB9XG5cbiAgLy8gc3RyZWFtLl9yZWFkYWJsZSBjYW5ub3QgY2hhbmdlIGFmdGVyIGNvbnN0cnVjdGlvbiwgc28gY2FjaGluZyBpdCBhY3Jvc3MgYSBjYWxsIHRvIHVzZXIgY29kZSBpcyBzYWZlLlxuICBjb25zdCByZWFkYWJsZSA9IHN0cmVhbS5fcmVhZGFibGU7XG5cbiAgLy8gQXNzaWduIHRoZSBfZmluaXNoUHJvbWlzZSBub3cgc28gdGhhdCBpZiBfY2FuY2VsQWxnb3JpdGhtIGNhbGxzIHJlYWRhYmxlLmNhbmNlbCgpIGludGVybmFsbHksXG4gIC8vIHdlIGRvbid0IHJ1biB0aGUgX2NhbmNlbEFsZ29yaXRobSBhZ2Fpbi5cbiAgY29udHJvbGxlci5fZmluaXNoUHJvbWlzZSA9IG5ld1Byb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnRyb2xsZXIuX2ZpbmlzaFByb21pc2VfcmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgY29udHJvbGxlci5fZmluaXNoUHJvbWlzZV9yZWplY3QgPSByZWplY3Q7XG4gIH0pO1xuXG4gIGNvbnN0IGNhbmNlbFByb21pc2UgPSBjb250cm9sbGVyLl9jYW5jZWxBbGdvcml0aG0ocmVhc29uKTtcbiAgVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDbGVhckFsZ29yaXRobXMoY29udHJvbGxlcik7XG5cbiAgdXBvblByb21pc2UoY2FuY2VsUHJvbWlzZSwgKCkgPT4ge1xuICAgIGlmIChyZWFkYWJsZS5fc3RhdGUgPT09ICdlcnJvcmVkJykge1xuICAgICAgZGVmYXVsdENvbnRyb2xsZXJGaW5pc2hQcm9taXNlUmVqZWN0KGNvbnRyb2xsZXIsIHJlYWRhYmxlLl9zdG9yZWRFcnJvcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFcnJvcihyZWFkYWJsZS5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyLCByZWFzb24pO1xuICAgICAgZGVmYXVsdENvbnRyb2xsZXJGaW5pc2hQcm9taXNlUmVzb2x2ZShjb250cm9sbGVyKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH0sIHIgPT4ge1xuICAgIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFcnJvcihyZWFkYWJsZS5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyLCByKTtcbiAgICBkZWZhdWx0Q29udHJvbGxlckZpbmlzaFByb21pc2VSZWplY3QoY29udHJvbGxlciwgcik7XG4gICAgcmV0dXJuIG51bGw7XG4gIH0pO1xuXG4gIHJldHVybiBjb250cm9sbGVyLl9maW5pc2hQcm9taXNlO1xufVxuXG5mdW5jdGlvbiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0U2lua0Nsb3NlQWxnb3JpdGhtPEksIE8+KHN0cmVhbTogVHJhbnNmb3JtU3RyZWFtPEksIE8+KTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGNvbnRyb2xsZXIgPSBzdHJlYW0uX3RyYW5zZm9ybVN0cmVhbUNvbnRyb2xsZXI7XG4gIGlmIChjb250cm9sbGVyLl9maW5pc2hQcm9taXNlICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gY29udHJvbGxlci5fZmluaXNoUHJvbWlzZTtcbiAgfVxuXG4gIC8vIHN0cmVhbS5fcmVhZGFibGUgY2Fubm90IGNoYW5nZSBhZnRlciBjb25zdHJ1Y3Rpb24sIHNvIGNhY2hpbmcgaXQgYWNyb3NzIGEgY2FsbCB0byB1c2VyIGNvZGUgaXMgc2FmZS5cbiAgY29uc3QgcmVhZGFibGUgPSBzdHJlYW0uX3JlYWRhYmxlO1xuXG4gIC8vIEFzc2lnbiB0aGUgX2ZpbmlzaFByb21pc2Ugbm93IHNvIHRoYXQgaWYgX2ZsdXNoQWxnb3JpdGhtIGNhbGxzIHJlYWRhYmxlLmNhbmNlbCgpIGludGVybmFsbHksXG4gIC8vIHdlIGRvbid0IGFsc28gcnVuIHRoZSBfY2FuY2VsQWxnb3JpdGhtLlxuICBjb250cm9sbGVyLl9maW5pc2hQcm9taXNlID0gbmV3UHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29udHJvbGxlci5fZmluaXNoUHJvbWlzZV9yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICBjb250cm9sbGVyLl9maW5pc2hQcm9taXNlX3JlamVjdCA9IHJlamVjdDtcbiAgfSk7XG5cbiAgY29uc3QgZmx1c2hQcm9taXNlID0gY29udHJvbGxlci5fZmx1c2hBbGdvcml0aG0oKTtcbiAgVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDbGVhckFsZ29yaXRobXMoY29udHJvbGxlcik7XG5cbiAgdXBvblByb21pc2UoZmx1c2hQcm9taXNlLCAoKSA9PiB7XG4gICAgaWYgKHJlYWRhYmxlLl9zdGF0ZSA9PT0gJ2Vycm9yZWQnKSB7XG4gICAgICBkZWZhdWx0Q29udHJvbGxlckZpbmlzaFByb21pc2VSZWplY3QoY29udHJvbGxlciwgcmVhZGFibGUuX3N0b3JlZEVycm9yKTtcbiAgICB9IGVsc2Uge1xuICAgICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNsb3NlKHJlYWRhYmxlLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIpO1xuICAgICAgZGVmYXVsdENvbnRyb2xsZXJGaW5pc2hQcm9taXNlUmVzb2x2ZShjb250cm9sbGVyKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH0sIHIgPT4ge1xuICAgIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFcnJvcihyZWFkYWJsZS5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyLCByKTtcbiAgICBkZWZhdWx0Q29udHJvbGxlckZpbmlzaFByb21pc2VSZWplY3QoY29udHJvbGxlciwgcik7XG4gICAgcmV0dXJuIG51bGw7XG4gIH0pO1xuXG4gIHJldHVybiBjb250cm9sbGVyLl9maW5pc2hQcm9taXNlO1xufVxuXG4vLyBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0U291cmNlIEFsZ29yaXRobXNcblxuZnVuY3Rpb24gVHJhbnNmb3JtU3RyZWFtRGVmYXVsdFNvdXJjZVB1bGxBbGdvcml0aG0oc3RyZWFtOiBUcmFuc2Zvcm1TdHJlYW0pOiBQcm9taXNlPHZvaWQ+IHtcbiAgLy8gSW52YXJpYW50LiBFbmZvcmNlZCBieSB0aGUgcHJvbWlzZXMgcmV0dXJuZWQgYnkgc3RhcnQoKSBhbmQgcHVsbCgpLlxuICBhc3NlcnQoc3RyZWFtLl9iYWNrcHJlc3N1cmUpO1xuXG4gIGFzc2VydChzdHJlYW0uX2JhY2twcmVzc3VyZUNoYW5nZVByb21pc2UgIT09IHVuZGVmaW5lZCk7XG5cbiAgVHJhbnNmb3JtU3RyZWFtU2V0QmFja3ByZXNzdXJlKHN0cmVhbSwgZmFsc2UpO1xuXG4gIC8vIFByZXZlbnQgdGhlIG5leHQgcHVsbCgpIGNhbGwgdW50aWwgdGhlcmUgaXMgYmFja3ByZXNzdXJlLlxuICByZXR1cm4gc3RyZWFtLl9iYWNrcHJlc3N1cmVDaGFuZ2VQcm9taXNlO1xufVxuXG5mdW5jdGlvbiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0U291cmNlQ2FuY2VsQWxnb3JpdGhtPEksIE8+KHN0cmVhbTogVHJhbnNmb3JtU3RyZWFtPEksIE8+LCByZWFzb246IGFueSk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBjb250cm9sbGVyID0gc3RyZWFtLl90cmFuc2Zvcm1TdHJlYW1Db250cm9sbGVyO1xuICBpZiAoY29udHJvbGxlci5fZmluaXNoUHJvbWlzZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGNvbnRyb2xsZXIuX2ZpbmlzaFByb21pc2U7XG4gIH1cblxuICAvLyBzdHJlYW0uX3dyaXRhYmxlIGNhbm5vdCBjaGFuZ2UgYWZ0ZXIgY29uc3RydWN0aW9uLCBzbyBjYWNoaW5nIGl0IGFjcm9zcyBhIGNhbGwgdG8gdXNlciBjb2RlIGlzIHNhZmUuXG4gIGNvbnN0IHdyaXRhYmxlID0gc3RyZWFtLl93cml0YWJsZTtcblxuICAvLyBBc3NpZ24gdGhlIF9maW5pc2hQcm9taXNlIG5vdyBzbyB0aGF0IGlmIF9mbHVzaEFsZ29yaXRobSBjYWxscyB3cml0YWJsZS5hYm9ydCgpIG9yXG4gIC8vIHdyaXRhYmxlLmNhbmNlbCgpIGludGVybmFsbHksIHdlIGRvbid0IHJ1biB0aGUgX2NhbmNlbEFsZ29yaXRobSBhZ2Fpbiwgb3IgYWxzbyBydW4gdGhlXG4gIC8vIF9mbHVzaEFsZ29yaXRobS5cbiAgY29udHJvbGxlci5fZmluaXNoUHJvbWlzZSA9IG5ld1Byb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnRyb2xsZXIuX2ZpbmlzaFByb21pc2VfcmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgY29udHJvbGxlci5fZmluaXNoUHJvbWlzZV9yZWplY3QgPSByZWplY3Q7XG4gIH0pO1xuXG4gIGNvbnN0IGNhbmNlbFByb21pc2UgPSBjb250cm9sbGVyLl9jYW5jZWxBbGdvcml0aG0ocmVhc29uKTtcbiAgVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDbGVhckFsZ29yaXRobXMoY29udHJvbGxlcik7XG5cbiAgdXBvblByb21pc2UoY2FuY2VsUHJvbWlzZSwgKCkgPT4ge1xuICAgIGlmICh3cml0YWJsZS5fc3RhdGUgPT09ICdlcnJvcmVkJykge1xuICAgICAgZGVmYXVsdENvbnRyb2xsZXJGaW5pc2hQcm9taXNlUmVqZWN0KGNvbnRyb2xsZXIsIHdyaXRhYmxlLl9zdG9yZWRFcnJvcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFcnJvcklmTmVlZGVkKHdyaXRhYmxlLl93cml0YWJsZVN0cmVhbUNvbnRyb2xsZXIsIHJlYXNvbik7XG4gICAgICBUcmFuc2Zvcm1TdHJlYW1VbmJsb2NrV3JpdGUoc3RyZWFtKTtcbiAgICAgIGRlZmF1bHRDb250cm9sbGVyRmluaXNoUHJvbWlzZVJlc29sdmUoY29udHJvbGxlcik7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9LCByID0+IHtcbiAgICBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRXJyb3JJZk5lZWRlZCh3cml0YWJsZS5fd3JpdGFibGVTdHJlYW1Db250cm9sbGVyLCByKTtcbiAgICBUcmFuc2Zvcm1TdHJlYW1VbmJsb2NrV3JpdGUoc3RyZWFtKTtcbiAgICBkZWZhdWx0Q29udHJvbGxlckZpbmlzaFByb21pc2VSZWplY3QoY29udHJvbGxlciwgcik7XG4gICAgcmV0dXJuIG51bGw7XG4gIH0pO1xuXG4gIHJldHVybiBjb250cm9sbGVyLl9maW5pc2hQcm9taXNlO1xufVxuXG4vLyBIZWxwZXIgZnVuY3Rpb25zIGZvciB0aGUgVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIuXG5cbmZ1bmN0aW9uIGRlZmF1bHRDb250cm9sbGVyQnJhbmRDaGVja0V4Y2VwdGlvbihuYW1lOiBzdHJpbmcpOiBUeXBlRXJyb3Ige1xuICByZXR1cm4gbmV3IFR5cGVFcnJvcihcbiAgICBgVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIucHJvdG90eXBlLiR7bmFtZX0gY2FuIG9ubHkgYmUgdXNlZCBvbiBhIFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyYCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWZhdWx0Q29udHJvbGxlckZpbmlzaFByb21pc2VSZXNvbHZlKGNvbnRyb2xsZXI6IFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyPGFueT4pIHtcbiAgaWYgKGNvbnRyb2xsZXIuX2ZpbmlzaFByb21pc2VfcmVzb2x2ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29udHJvbGxlci5fZmluaXNoUHJvbWlzZV9yZXNvbHZlKCk7XG4gIGNvbnRyb2xsZXIuX2ZpbmlzaFByb21pc2VfcmVzb2x2ZSA9IHVuZGVmaW5lZDtcbiAgY29udHJvbGxlci5fZmluaXNoUHJvbWlzZV9yZWplY3QgPSB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWZhdWx0Q29udHJvbGxlckZpbmlzaFByb21pc2VSZWplY3QoY29udHJvbGxlcjogVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8YW55PiwgcmVhc29uOiBhbnkpIHtcbiAgaWYgKGNvbnRyb2xsZXIuX2ZpbmlzaFByb21pc2VfcmVqZWN0ID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBzZXRQcm9taXNlSXNIYW5kbGVkVG9UcnVlKGNvbnRyb2xsZXIuX2ZpbmlzaFByb21pc2UhKTtcbiAgY29udHJvbGxlci5fZmluaXNoUHJvbWlzZV9yZWplY3QocmVhc29uKTtcbiAgY29udHJvbGxlci5fZmluaXNoUHJvbWlzZV9yZXNvbHZlID0gdW5kZWZpbmVkO1xuICBjb250cm9sbGVyLl9maW5pc2hQcm9taXNlX3JlamVjdCA9IHVuZGVmaW5lZDtcbn1cblxuLy8gSGVscGVyIGZ1bmN0aW9ucyBmb3IgdGhlIFRyYW5zZm9ybVN0cmVhbS5cblxuZnVuY3Rpb24gc3RyZWFtQnJhbmRDaGVja0V4Y2VwdGlvbihuYW1lOiBzdHJpbmcpOiBUeXBlRXJyb3Ige1xuICByZXR1cm4gbmV3IFR5cGVFcnJvcihcbiAgICBgVHJhbnNmb3JtU3RyZWFtLnByb3RvdHlwZS4ke25hbWV9IGNhbiBvbmx5IGJlIHVzZWQgb24gYSBUcmFuc2Zvcm1TdHJlYW1gKTtcbn1cbiIsICIvKiBjOCBpZ25vcmUgc3RhcnQgKi9cbi8vIDY0IEtpQiAoc2FtZSBzaXplIGNocm9tZSBzbGljZSB0aGVpcnMgYmxvYiBpbnRvIFVpbnQ4YXJyYXkncylcbmNvbnN0IFBPT0xfU0laRSA9IDY1NTM2XG5cbmlmICghZ2xvYmFsVGhpcy5SZWFkYWJsZVN0cmVhbSkge1xuICAvLyBgbm9kZTpzdHJlYW0vd2ViYCBnb3QgaW50cm9kdWNlZCBpbiB2MTYuNS4wIGFzIGV4cGVyaW1lbnRhbFxuICAvLyBhbmQgaXQncyBwcmVmZXJyZWQgb3ZlciB0aGUgcG9seWZpbGxlZCB2ZXJzaW9uLiBTbyB3ZSBhbHNvXG4gIC8vIHN1cHByZXNzIHRoZSB3YXJuaW5nIHRoYXQgZ2V0cyBlbWl0dGVkIGJ5IE5vZGVKUyBmb3IgdXNpbmcgaXQuXG4gIHRyeSB7XG4gICAgY29uc3QgcHJvY2VzcyA9IHJlcXVpcmUoJ25vZGU6cHJvY2VzcycpXG4gICAgY29uc3QgeyBlbWl0V2FybmluZyB9ID0gcHJvY2Vzc1xuICAgIHRyeSB7XG4gICAgICBwcm9jZXNzLmVtaXRXYXJuaW5nID0gKCkgPT4ge31cbiAgICAgIE9iamVjdC5hc3NpZ24oZ2xvYmFsVGhpcywgcmVxdWlyZSgnbm9kZTpzdHJlYW0vd2ViJykpXG4gICAgICBwcm9jZXNzLmVtaXRXYXJuaW5nID0gZW1pdFdhcm5pbmdcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcHJvY2Vzcy5lbWl0V2FybmluZyA9IGVtaXRXYXJuaW5nXG4gICAgICB0aHJvdyBlcnJvclxuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAvLyBmYWxsYmFjayB0byBwb2x5ZmlsbCBpbXBsZW1lbnRhdGlvblxuICAgIE9iamVjdC5hc3NpZ24oZ2xvYmFsVGhpcywgcmVxdWlyZSgnd2ViLXN0cmVhbXMtcG9seWZpbGwvZGlzdC9wb255ZmlsbC5lczIwMTguanMnKSlcbiAgfVxufVxuXG50cnkge1xuICAvLyBEb24ndCB1c2Ugbm9kZTogcHJlZml4IGZvciB0aGlzLCByZXF1aXJlK25vZGU6IGlzIG5vdCBzdXBwb3J0ZWQgdW50aWwgbm9kZSB2MTQuMTRcbiAgLy8gT25seSBgaW1wb3J0KClgIGNhbiB1c2UgcHJlZml4IGluIDEyLjIwIGFuZCBsYXRlclxuICBjb25zdCB7IEJsb2IgfSA9IHJlcXVpcmUoJ2J1ZmZlcicpXG4gIGlmIChCbG9iICYmICFCbG9iLnByb3RvdHlwZS5zdHJlYW0pIHtcbiAgICBCbG9iLnByb3RvdHlwZS5zdHJlYW0gPSBmdW5jdGlvbiBuYW1lIChwYXJhbXMpIHtcbiAgICAgIGxldCBwb3NpdGlvbiA9IDBcbiAgICAgIGNvbnN0IGJsb2IgPSB0aGlzXG5cbiAgICAgIHJldHVybiBuZXcgUmVhZGFibGVTdHJlYW0oe1xuICAgICAgICB0eXBlOiAnYnl0ZXMnLFxuICAgICAgICBhc3luYyBwdWxsIChjdHJsKSB7XG4gICAgICAgICAgY29uc3QgY2h1bmsgPSBibG9iLnNsaWNlKHBvc2l0aW9uLCBNYXRoLm1pbihibG9iLnNpemUsIHBvc2l0aW9uICsgUE9PTF9TSVpFKSlcbiAgICAgICAgICBjb25zdCBidWZmZXIgPSBhd2FpdCBjaHVuay5hcnJheUJ1ZmZlcigpXG4gICAgICAgICAgcG9zaXRpb24gKz0gYnVmZmVyLmJ5dGVMZW5ndGhcbiAgICAgICAgICBjdHJsLmVucXVldWUobmV3IFVpbnQ4QXJyYXkoYnVmZmVyKSlcblxuICAgICAgICAgIGlmIChwb3NpdGlvbiA9PT0gYmxvYi5zaXplKSB7XG4gICAgICAgICAgICBjdHJsLmNsb3NlKClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9XG59IGNhdGNoIChlcnJvcikge31cbi8qIGM4IGlnbm9yZSBlbmQgKi9cbiIsICIvKiEgZmV0Y2gtYmxvYi4gTUlUIExpY2Vuc2UuIEppbW15IFdcdTAwRTRydGluZyA8aHR0cHM6Ly9qaW1teS53YXJ0aW5nLnNlL29wZW5zb3VyY2U+ICovXG5cbi8vIFRPRE8gKGppbW15d2FydGluZyk6IGluIHRoZSBmZWF0dXJlIHVzZSBjb25kaXRpb25hbCBsb2FkaW5nIHdpdGggdG9wIGxldmVsIGF3YWl0IChyZXF1aXJlcyAxNC54KVxuLy8gTm9kZSBoYXMgcmVjZW50bHkgYWRkZWQgd2hhdHdnIHN0cmVhbSBpbnRvIGNvcmVcblxuaW1wb3J0ICcuL3N0cmVhbXMuY2pzJ1xuXG4vLyA2NCBLaUIgKHNhbWUgc2l6ZSBjaHJvbWUgc2xpY2UgdGhlaXJzIGJsb2IgaW50byBVaW50OGFycmF5J3MpXG5jb25zdCBQT09MX1NJWkUgPSA2NTUzNlxuXG4vKiogQHBhcmFtIHsoQmxvYiB8IFVpbnQ4QXJyYXkpW119IHBhcnRzICovXG5hc3luYyBmdW5jdGlvbiAqIHRvSXRlcmF0b3IgKHBhcnRzLCBjbG9uZSA9IHRydWUpIHtcbiAgZm9yIChjb25zdCBwYXJ0IG9mIHBhcnRzKSB7XG4gICAgaWYgKCdzdHJlYW0nIGluIHBhcnQpIHtcbiAgICAgIHlpZWxkICogKC8qKiBAdHlwZSB7QXN5bmNJdGVyYWJsZUl0ZXJhdG9yPFVpbnQ4QXJyYXk+fSAqLyAocGFydC5zdHJlYW0oKSkpXG4gICAgfSBlbHNlIGlmIChBcnJheUJ1ZmZlci5pc1ZpZXcocGFydCkpIHtcbiAgICAgIGlmIChjbG9uZSkge1xuICAgICAgICBsZXQgcG9zaXRpb24gPSBwYXJ0LmJ5dGVPZmZzZXRcbiAgICAgICAgY29uc3QgZW5kID0gcGFydC5ieXRlT2Zmc2V0ICsgcGFydC5ieXRlTGVuZ3RoXG4gICAgICAgIHdoaWxlIChwb3NpdGlvbiAhPT0gZW5kKSB7XG4gICAgICAgICAgY29uc3Qgc2l6ZSA9IE1hdGgubWluKGVuZCAtIHBvc2l0aW9uLCBQT09MX1NJWkUpXG4gICAgICAgICAgY29uc3QgY2h1bmsgPSBwYXJ0LmJ1ZmZlci5zbGljZShwb3NpdGlvbiwgcG9zaXRpb24gKyBzaXplKVxuICAgICAgICAgIHBvc2l0aW9uICs9IGNodW5rLmJ5dGVMZW5ndGhcbiAgICAgICAgICB5aWVsZCBuZXcgVWludDhBcnJheShjaHVuaylcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgeWllbGQgcGFydFxuICAgICAgfVxuICAgIC8qIGM4IGlnbm9yZSBuZXh0IDEwICovXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEZvciBibG9icyB0aGF0IGhhdmUgYXJyYXlCdWZmZXIgYnV0IG5vIHN0cmVhbSBtZXRob2QgKG5vZGVzIGJ1ZmZlci5CbG9iKVxuICAgICAgbGV0IHBvc2l0aW9uID0gMCwgYiA9ICgvKiogQHR5cGUge0Jsb2J9ICovIChwYXJ0KSlcbiAgICAgIHdoaWxlIChwb3NpdGlvbiAhPT0gYi5zaXplKSB7XG4gICAgICAgIGNvbnN0IGNodW5rID0gYi5zbGljZShwb3NpdGlvbiwgTWF0aC5taW4oYi5zaXplLCBwb3NpdGlvbiArIFBPT0xfU0laRSkpXG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IGF3YWl0IGNodW5rLmFycmF5QnVmZmVyKClcbiAgICAgICAgcG9zaXRpb24gKz0gYnVmZmVyLmJ5dGVMZW5ndGhcbiAgICAgICAgeWllbGQgbmV3IFVpbnQ4QXJyYXkoYnVmZmVyKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5jb25zdCBfQmxvYiA9IGNsYXNzIEJsb2Ige1xuICAvKiogQHR5cGUge0FycmF5LjwoQmxvYnxVaW50OEFycmF5KT59ICovXG4gICNwYXJ0cyA9IFtdXG4gICN0eXBlID0gJydcbiAgI3NpemUgPSAwXG4gICNlbmRpbmdzID0gJ3RyYW5zcGFyZW50J1xuXG4gIC8qKlxuICAgKiBUaGUgQmxvYigpIGNvbnN0cnVjdG9yIHJldHVybnMgYSBuZXcgQmxvYiBvYmplY3QuIFRoZSBjb250ZW50XG4gICAqIG9mIHRoZSBibG9iIGNvbnNpc3RzIG9mIHRoZSBjb25jYXRlbmF0aW9uIG9mIHRoZSB2YWx1ZXMgZ2l2ZW5cbiAgICogaW4gdGhlIHBhcmFtZXRlciBhcnJheS5cbiAgICpcbiAgICogQHBhcmFtIHsqfSBibG9iUGFydHNcbiAgICogQHBhcmFtIHt7IHR5cGU/OiBzdHJpbmcsIGVuZGluZ3M/OiBzdHJpbmcgfX0gW29wdGlvbnNdXG4gICAqL1xuICBjb25zdHJ1Y3RvciAoYmxvYlBhcnRzID0gW10sIG9wdGlvbnMgPSB7fSkge1xuICAgIGlmICh0eXBlb2YgYmxvYlBhcnRzICE9PSAnb2JqZWN0JyB8fCBibG9iUGFydHMgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ZhaWxlZCB0byBjb25zdHJ1Y3QgXFwnQmxvYlxcJzogVGhlIHByb3ZpZGVkIHZhbHVlIGNhbm5vdCBiZSBjb252ZXJ0ZWQgdG8gYSBzZXF1ZW5jZS4nKVxuICAgIH1cblxuICAgIGlmICh0eXBlb2YgYmxvYlBhcnRzW1N5bWJvbC5pdGVyYXRvcl0gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ZhaWxlZCB0byBjb25zdHJ1Y3QgXFwnQmxvYlxcJzogVGhlIG9iamVjdCBtdXN0IGhhdmUgYSBjYWxsYWJsZSBAQGl0ZXJhdG9yIHByb3BlcnR5LicpXG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBvcHRpb25zICE9PSAnb2JqZWN0JyAmJiB0eXBlb2Ygb3B0aW9ucyAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRmFpbGVkIHRvIGNvbnN0cnVjdCBcXCdCbG9iXFwnOiBwYXJhbWV0ZXIgMiBjYW5ub3QgY29udmVydCB0byBkaWN0aW9uYXJ5LicpXG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMgPT09IG51bGwpIG9wdGlvbnMgPSB7fVxuXG4gICAgY29uc3QgZW5jb2RlciA9IG5ldyBUZXh0RW5jb2RlcigpXG4gICAgZm9yIChjb25zdCBlbGVtZW50IG9mIGJsb2JQYXJ0cykge1xuICAgICAgbGV0IHBhcnRcbiAgICAgIGlmIChBcnJheUJ1ZmZlci5pc1ZpZXcoZWxlbWVudCkpIHtcbiAgICAgICAgcGFydCA9IG5ldyBVaW50OEFycmF5KGVsZW1lbnQuYnVmZmVyLnNsaWNlKGVsZW1lbnQuYnl0ZU9mZnNldCwgZWxlbWVudC5ieXRlT2Zmc2V0ICsgZWxlbWVudC5ieXRlTGVuZ3RoKSlcbiAgICAgIH0gZWxzZSBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XG4gICAgICAgIHBhcnQgPSBuZXcgVWludDhBcnJheShlbGVtZW50LnNsaWNlKDApKVxuICAgICAgfSBlbHNlIGlmIChlbGVtZW50IGluc3RhbmNlb2YgQmxvYikge1xuICAgICAgICBwYXJ0ID0gZWxlbWVudFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFydCA9IGVuY29kZXIuZW5jb2RlKGAke2VsZW1lbnR9YClcbiAgICAgIH1cblxuICAgICAgdGhpcy4jc2l6ZSArPSBBcnJheUJ1ZmZlci5pc1ZpZXcocGFydCkgPyBwYXJ0LmJ5dGVMZW5ndGggOiBwYXJ0LnNpemVcbiAgICAgIHRoaXMuI3BhcnRzLnB1c2gocGFydClcbiAgICB9XG5cbiAgICB0aGlzLiNlbmRpbmdzID0gYCR7b3B0aW9ucy5lbmRpbmdzID09PSB1bmRlZmluZWQgPyAndHJhbnNwYXJlbnQnIDogb3B0aW9ucy5lbmRpbmdzfWBcbiAgICBjb25zdCB0eXBlID0gb3B0aW9ucy50eXBlID09PSB1bmRlZmluZWQgPyAnJyA6IFN0cmluZyhvcHRpb25zLnR5cGUpXG4gICAgdGhpcy4jdHlwZSA9IC9eW1xceDIwLVxceDdFXSokLy50ZXN0KHR5cGUpID8gdHlwZSA6ICcnXG4gIH1cblxuICAvKipcbiAgICogVGhlIEJsb2IgaW50ZXJmYWNlJ3Mgc2l6ZSBwcm9wZXJ0eSByZXR1cm5zIHRoZVxuICAgKiBzaXplIG9mIHRoZSBCbG9iIGluIGJ5dGVzLlxuICAgKi9cbiAgZ2V0IHNpemUgKCkge1xuICAgIHJldHVybiB0aGlzLiNzaXplXG4gIH1cblxuICAvKipcbiAgICogVGhlIHR5cGUgcHJvcGVydHkgb2YgYSBCbG9iIG9iamVjdCByZXR1cm5zIHRoZSBNSU1FIHR5cGUgb2YgdGhlIGZpbGUuXG4gICAqL1xuICBnZXQgdHlwZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3R5cGVcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgdGV4dCgpIG1ldGhvZCBpbiB0aGUgQmxvYiBpbnRlcmZhY2UgcmV0dXJucyBhIFByb21pc2VcbiAgICogdGhhdCByZXNvbHZlcyB3aXRoIGEgc3RyaW5nIGNvbnRhaW5pbmcgdGhlIGNvbnRlbnRzIG9mXG4gICAqIHRoZSBibG9iLCBpbnRlcnByZXRlZCBhcyBVVEYtOC5cbiAgICpcbiAgICogQHJldHVybiB7UHJvbWlzZTxzdHJpbmc+fVxuICAgKi9cbiAgYXN5bmMgdGV4dCAoKSB7XG4gICAgLy8gTW9yZSBvcHRpbWl6ZWQgdGhhbiB1c2luZyB0aGlzLmFycmF5QnVmZmVyKClcbiAgICAvLyB0aGF0IHJlcXVpcmVzIHR3aWNlIGFzIG11Y2ggcmFtXG4gICAgY29uc3QgZGVjb2RlciA9IG5ldyBUZXh0RGVjb2RlcigpXG4gICAgbGV0IHN0ciA9ICcnXG4gICAgZm9yIGF3YWl0IChjb25zdCBwYXJ0IG9mIHRvSXRlcmF0b3IodGhpcy4jcGFydHMsIGZhbHNlKSkge1xuICAgICAgc3RyICs9IGRlY29kZXIuZGVjb2RlKHBhcnQsIHsgc3RyZWFtOiB0cnVlIH0pXG4gICAgfVxuICAgIC8vIFJlbWFpbmluZ1xuICAgIHN0ciArPSBkZWNvZGVyLmRlY29kZSgpXG4gICAgcmV0dXJuIHN0clxuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBhcnJheUJ1ZmZlcigpIG1ldGhvZCBpbiB0aGUgQmxvYiBpbnRlcmZhY2UgcmV0dXJucyBhXG4gICAqIFByb21pc2UgdGhhdCByZXNvbHZlcyB3aXRoIHRoZSBjb250ZW50cyBvZiB0aGUgYmxvYiBhc1xuICAgKiBiaW5hcnkgZGF0YSBjb250YWluZWQgaW4gYW4gQXJyYXlCdWZmZXIuXG4gICAqXG4gICAqIEByZXR1cm4ge1Byb21pc2U8QXJyYXlCdWZmZXI+fVxuICAgKi9cbiAgYXN5bmMgYXJyYXlCdWZmZXIgKCkge1xuICAgIC8vIEVhc2llciB3YXkuLi4gSnVzdCBhIHVubmVjZXNzYXJ5IG92ZXJoZWFkXG4gICAgLy8gY29uc3QgdmlldyA9IG5ldyBVaW50OEFycmF5KHRoaXMuc2l6ZSk7XG4gICAgLy8gYXdhaXQgdGhpcy5zdHJlYW0oKS5nZXRSZWFkZXIoe21vZGU6ICdieW9iJ30pLnJlYWQodmlldyk7XG4gICAgLy8gcmV0dXJuIHZpZXcuYnVmZmVyO1xuXG4gICAgY29uc3QgZGF0YSA9IG5ldyBVaW50OEFycmF5KHRoaXMuc2l6ZSlcbiAgICBsZXQgb2Zmc2V0ID0gMFxuICAgIGZvciBhd2FpdCAoY29uc3QgY2h1bmsgb2YgdG9JdGVyYXRvcih0aGlzLiNwYXJ0cywgZmFsc2UpKSB7XG4gICAgICBkYXRhLnNldChjaHVuaywgb2Zmc2V0KVxuICAgICAgb2Zmc2V0ICs9IGNodW5rLmxlbmd0aFxuICAgIH1cblxuICAgIHJldHVybiBkYXRhLmJ1ZmZlclxuICB9XG5cbiAgc3RyZWFtICgpIHtcbiAgICBjb25zdCBpdCA9IHRvSXRlcmF0b3IodGhpcy4jcGFydHMsIHRydWUpXG5cbiAgICByZXR1cm4gbmV3IGdsb2JhbFRoaXMuUmVhZGFibGVTdHJlYW0oe1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgdHlwZTogJ2J5dGVzJyxcbiAgICAgIGFzeW5jIHB1bGwgKGN0cmwpIHtcbiAgICAgICAgY29uc3QgY2h1bmsgPSBhd2FpdCBpdC5uZXh0KClcbiAgICAgICAgY2h1bmsuZG9uZSA/IGN0cmwuY2xvc2UoKSA6IGN0cmwuZW5xdWV1ZShjaHVuay52YWx1ZSlcbiAgICAgIH0sXG5cbiAgICAgIGFzeW5jIGNhbmNlbCAoKSB7XG4gICAgICAgIGF3YWl0IGl0LnJldHVybigpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgQmxvYiBpbnRlcmZhY2UncyBzbGljZSgpIG1ldGhvZCBjcmVhdGVzIGFuZCByZXR1cm5zIGFcbiAgICogbmV3IEJsb2Igb2JqZWN0IHdoaWNoIGNvbnRhaW5zIGRhdGEgZnJvbSBhIHN1YnNldCBvZiB0aGVcbiAgICogYmxvYiBvbiB3aGljaCBpdCdzIGNhbGxlZC5cbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IFtzdGFydF1cbiAgICogQHBhcmFtIHtudW1iZXJ9IFtlbmRdXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbdHlwZV1cbiAgICovXG4gIHNsaWNlIChzdGFydCA9IDAsIGVuZCA9IHRoaXMuc2l6ZSwgdHlwZSA9ICcnKSB7XG4gICAgY29uc3QgeyBzaXplIH0gPSB0aGlzXG5cbiAgICBsZXQgcmVsYXRpdmVTdGFydCA9IHN0YXJ0IDwgMCA/IE1hdGgubWF4KHNpemUgKyBzdGFydCwgMCkgOiBNYXRoLm1pbihzdGFydCwgc2l6ZSlcbiAgICBsZXQgcmVsYXRpdmVFbmQgPSBlbmQgPCAwID8gTWF0aC5tYXgoc2l6ZSArIGVuZCwgMCkgOiBNYXRoLm1pbihlbmQsIHNpemUpXG5cbiAgICBjb25zdCBzcGFuID0gTWF0aC5tYXgocmVsYXRpdmVFbmQgLSByZWxhdGl2ZVN0YXJ0LCAwKVxuICAgIGNvbnN0IHBhcnRzID0gdGhpcy4jcGFydHNcbiAgICBjb25zdCBibG9iUGFydHMgPSBbXVxuICAgIGxldCBhZGRlZCA9IDBcblxuICAgIGZvciAoY29uc3QgcGFydCBvZiBwYXJ0cykge1xuICAgICAgLy8gZG9uJ3QgYWRkIHRoZSBvdmVyZmxvdyB0byBuZXcgYmxvYlBhcnRzXG4gICAgICBpZiAoYWRkZWQgPj0gc3Bhbikge1xuICAgICAgICBicmVha1xuICAgICAgfVxuXG4gICAgICBjb25zdCBzaXplID0gQXJyYXlCdWZmZXIuaXNWaWV3KHBhcnQpID8gcGFydC5ieXRlTGVuZ3RoIDogcGFydC5zaXplXG4gICAgICBpZiAocmVsYXRpdmVTdGFydCAmJiBzaXplIDw9IHJlbGF0aXZlU3RhcnQpIHtcbiAgICAgICAgLy8gU2tpcCB0aGUgYmVnaW5uaW5nIGFuZCBjaGFuZ2UgdGhlIHJlbGF0aXZlXG4gICAgICAgIC8vIHN0YXJ0ICYgZW5kIHBvc2l0aW9uIGFzIHdlIHNraXAgdGhlIHVud2FudGVkIHBhcnRzXG4gICAgICAgIHJlbGF0aXZlU3RhcnQgLT0gc2l6ZVxuICAgICAgICByZWxhdGl2ZUVuZCAtPSBzaXplXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgY2h1bmtcbiAgICAgICAgaWYgKEFycmF5QnVmZmVyLmlzVmlldyhwYXJ0KSkge1xuICAgICAgICAgIGNodW5rID0gcGFydC5zdWJhcnJheShyZWxhdGl2ZVN0YXJ0LCBNYXRoLm1pbihzaXplLCByZWxhdGl2ZUVuZCkpXG4gICAgICAgICAgYWRkZWQgKz0gY2h1bmsuYnl0ZUxlbmd0aFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNodW5rID0gcGFydC5zbGljZShyZWxhdGl2ZVN0YXJ0LCBNYXRoLm1pbihzaXplLCByZWxhdGl2ZUVuZCkpXG4gICAgICAgICAgYWRkZWQgKz0gY2h1bmsuc2l6ZVxuICAgICAgICB9XG4gICAgICAgIHJlbGF0aXZlRW5kIC09IHNpemVcbiAgICAgICAgYmxvYlBhcnRzLnB1c2goY2h1bmspXG4gICAgICAgIHJlbGF0aXZlU3RhcnQgPSAwIC8vIEFsbCBuZXh0IHNlcXVlbnRpYWwgcGFydHMgc2hvdWxkIHN0YXJ0IGF0IDBcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBibG9iID0gbmV3IEJsb2IoW10sIHsgdHlwZTogU3RyaW5nKHR5cGUpLnRvTG93ZXJDYXNlKCkgfSlcbiAgICBibG9iLiNzaXplID0gc3BhblxuICAgIGJsb2IuI3BhcnRzID0gYmxvYlBhcnRzXG5cbiAgICByZXR1cm4gYmxvYlxuICB9XG5cbiAgZ2V0IFtTeW1ib2wudG9TdHJpbmdUYWddICgpIHtcbiAgICByZXR1cm4gJ0Jsb2InXG4gIH1cblxuICBzdGF0aWMgW1N5bWJvbC5oYXNJbnN0YW5jZV0gKG9iamVjdCkge1xuICAgIHJldHVybiAoXG4gICAgICBvYmplY3QgJiZcbiAgICAgIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmXG4gICAgICB0eXBlb2Ygb2JqZWN0LmNvbnN0cnVjdG9yID09PSAnZnVuY3Rpb24nICYmXG4gICAgICAoXG4gICAgICAgIHR5cGVvZiBvYmplY3Quc3RyZWFtID09PSAnZnVuY3Rpb24nIHx8XG4gICAgICAgIHR5cGVvZiBvYmplY3QuYXJyYXlCdWZmZXIgPT09ICdmdW5jdGlvbidcbiAgICAgICkgJiZcbiAgICAgIC9eKEJsb2J8RmlsZSkkLy50ZXN0KG9iamVjdFtTeW1ib2wudG9TdHJpbmdUYWddKVxuICAgIClcbiAgfVxufVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyhfQmxvYi5wcm90b3R5cGUsIHtcbiAgc2l6ZTogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIHR5cGU6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICBzbGljZTogeyBlbnVtZXJhYmxlOiB0cnVlIH1cbn0pXG5cbi8qKiBAdHlwZSB7dHlwZW9mIGdsb2JhbFRoaXMuQmxvYn0gKi9cbmV4cG9ydCBjb25zdCBCbG9iID0gX0Jsb2JcbmV4cG9ydCBkZWZhdWx0IEJsb2JcbiIsICJpbXBvcnQgQmxvYiBmcm9tICcuL2luZGV4LmpzJ1xuXG5jb25zdCBfRmlsZSA9IGNsYXNzIEZpbGUgZXh0ZW5kcyBCbG9iIHtcbiAgI2xhc3RNb2RpZmllZCA9IDBcbiAgI25hbWUgPSAnJ1xuXG4gIC8qKlxuICAgKiBAcGFyYW0geypbXX0gZmlsZUJpdHNcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZpbGVOYW1lXG4gICAqIEBwYXJhbSB7e2xhc3RNb2RpZmllZD86IG51bWJlciwgdHlwZT86IHN0cmluZ319IG9wdGlvbnNcbiAgICovLy8gQHRzLWlnbm9yZVxuICBjb25zdHJ1Y3RvciAoZmlsZUJpdHMsIGZpbGVOYW1lLCBvcHRpb25zID0ge30pIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYEZhaWxlZCB0byBjb25zdHJ1Y3QgJ0ZpbGUnOiAyIGFyZ3VtZW50cyByZXF1aXJlZCwgYnV0IG9ubHkgJHthcmd1bWVudHMubGVuZ3RofSBwcmVzZW50LmApXG4gICAgfVxuICAgIHN1cGVyKGZpbGVCaXRzLCBvcHRpb25zKVxuXG4gICAgaWYgKG9wdGlvbnMgPT09IG51bGwpIG9wdGlvbnMgPSB7fVxuXG4gICAgLy8gU2ltdWxhdGUgV2ViSURMIHR5cGUgY2FzdGluZyBmb3IgTmFOIHZhbHVlIGluIGxhc3RNb2RpZmllZCBvcHRpb24uXG4gICAgY29uc3QgbGFzdE1vZGlmaWVkID0gb3B0aW9ucy5sYXN0TW9kaWZpZWQgPT09IHVuZGVmaW5lZCA/IERhdGUubm93KCkgOiBOdW1iZXIob3B0aW9ucy5sYXN0TW9kaWZpZWQpXG4gICAgaWYgKCFOdW1iZXIuaXNOYU4obGFzdE1vZGlmaWVkKSkge1xuICAgICAgdGhpcy4jbGFzdE1vZGlmaWVkID0gbGFzdE1vZGlmaWVkXG4gICAgfVxuXG4gICAgdGhpcy4jbmFtZSA9IFN0cmluZyhmaWxlTmFtZSlcbiAgfVxuXG4gIGdldCBuYW1lICgpIHtcbiAgICByZXR1cm4gdGhpcy4jbmFtZVxuICB9XG5cbiAgZ2V0IGxhc3RNb2RpZmllZCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xhc3RNb2RpZmllZFxuICB9XG5cbiAgZ2V0IFtTeW1ib2wudG9TdHJpbmdUYWddICgpIHtcbiAgICByZXR1cm4gJ0ZpbGUnXG4gIH1cblxuICBzdGF0aWMgW1N5bWJvbC5oYXNJbnN0YW5jZV0gKG9iamVjdCkge1xuICAgIHJldHVybiAhIW9iamVjdCAmJiBvYmplY3QgaW5zdGFuY2VvZiBCbG9iICYmXG4gICAgICAvXihGaWxlKSQvLnRlc3Qob2JqZWN0W1N5bWJvbC50b1N0cmluZ1RhZ10pXG4gIH1cbn1cblxuLyoqIEB0eXBlIHt0eXBlb2YgZ2xvYmFsVGhpcy5GaWxlfSAqLy8vIEB0cy1pZ25vcmVcbmV4cG9ydCBjb25zdCBGaWxlID0gX0ZpbGVcbmV4cG9ydCBkZWZhdWx0IEZpbGVcbiIsICIvKiEgZm9ybWRhdGEtcG9seWZpbGwuIE1JVCBMaWNlbnNlLiBKaW1teSBXXHUwMEU0cnRpbmcgPGh0dHBzOi8vamltbXkud2FydGluZy5zZS9vcGVuc291cmNlPiAqL1xuXG5pbXBvcnQgQyBmcm9tICdmZXRjaC1ibG9iJ1xuaW1wb3J0IEYgZnJvbSAnZmV0Y2gtYmxvYi9maWxlLmpzJ1xuXG52YXIge3RvU3RyaW5nVGFnOnQsaXRlcmF0b3I6aSxoYXNJbnN0YW5jZTpofT1TeW1ib2wsXG5yPU1hdGgucmFuZG9tLFxubT0nYXBwZW5kLHNldCxnZXQsZ2V0QWxsLGRlbGV0ZSxrZXlzLHZhbHVlcyxlbnRyaWVzLGZvckVhY2gsY29uc3RydWN0b3InLnNwbGl0KCcsJyksXG5mPShhLGIsYyk9PihhKz0nJywvXihCbG9ifEZpbGUpJC8udGVzdChiICYmIGJbdF0pP1soYz1jIT09dm9pZCAwP2MrJyc6Ylt0XT09J0ZpbGUnP2IubmFtZTonYmxvYicsYSksYi5uYW1lIT09Y3x8Ylt0XT09J2Jsb2InP25ldyBGKFtiXSxjLGIpOmJdOlthLGIrJyddKSxcbmU9KGMsZik9PihmP2M6Yy5yZXBsYWNlKC9cXHI/XFxufFxcci9nLCdcXHJcXG4nKSkucmVwbGFjZSgvXFxuL2csJyUwQScpLnJlcGxhY2UoL1xcci9nLCclMEQnKS5yZXBsYWNlKC9cIi9nLCclMjInKSxcbng9KG4sIGEsIGUpPT57aWYoYS5sZW5ndGg8ZSl7dGhyb3cgbmV3IFR5cGVFcnJvcihgRmFpbGVkIHRvIGV4ZWN1dGUgJyR7bn0nIG9uICdGb3JtRGF0YSc6ICR7ZX0gYXJndW1lbnRzIHJlcXVpcmVkLCBidXQgb25seSAke2EubGVuZ3RofSBwcmVzZW50LmApfX1cblxuZXhwb3J0IGNvbnN0IEZpbGUgPSBGXG5cbi8qKiBAdHlwZSB7dHlwZW9mIGdsb2JhbFRoaXMuRm9ybURhdGF9ICovXG5leHBvcnQgY29uc3QgRm9ybURhdGEgPSBjbGFzcyBGb3JtRGF0YSB7XG4jZD1bXTtcbmNvbnN0cnVjdG9yKC4uLmEpe2lmKGEubGVuZ3RoKXRocm93IG5ldyBUeXBlRXJyb3IoYEZhaWxlZCB0byBjb25zdHJ1Y3QgJ0Zvcm1EYXRhJzogcGFyYW1ldGVyIDEgaXMgbm90IG9mIHR5cGUgJ0hUTUxGb3JtRWxlbWVudCcuYCl9XG5nZXQgW3RdKCkge3JldHVybiAnRm9ybURhdGEnfVxuW2ldKCl7cmV0dXJuIHRoaXMuZW50cmllcygpfVxuc3RhdGljIFtoXShvKSB7cmV0dXJuIG8mJnR5cGVvZiBvPT09J29iamVjdCcmJm9bdF09PT0nRm9ybURhdGEnJiYhbS5zb21lKG09PnR5cGVvZiBvW21dIT0nZnVuY3Rpb24nKX1cbmFwcGVuZCguLi5hKXt4KCdhcHBlbmQnLGFyZ3VtZW50cywyKTt0aGlzLiNkLnB1c2goZiguLi5hKSl9XG5kZWxldGUoYSl7eCgnZGVsZXRlJyxhcmd1bWVudHMsMSk7YSs9Jyc7dGhpcy4jZD10aGlzLiNkLmZpbHRlcigoW2JdKT0+YiE9PWEpfVxuZ2V0KGEpe3goJ2dldCcsYXJndW1lbnRzLDEpO2ErPScnO2Zvcih2YXIgYj10aGlzLiNkLGw9Yi5sZW5ndGgsYz0wO2M8bDtjKyspaWYoYltjXVswXT09PWEpcmV0dXJuIGJbY11bMV07cmV0dXJuIG51bGx9XG5nZXRBbGwoYSxiKXt4KCdnZXRBbGwnLGFyZ3VtZW50cywxKTtiPVtdO2ErPScnO3RoaXMuI2QuZm9yRWFjaChjPT5jWzBdPT09YSYmYi5wdXNoKGNbMV0pKTtyZXR1cm4gYn1cbmhhcyhhKXt4KCdoYXMnLGFyZ3VtZW50cywxKTthKz0nJztyZXR1cm4gdGhpcy4jZC5zb21lKGI9PmJbMF09PT1hKX1cbmZvckVhY2goYSxiKXt4KCdmb3JFYWNoJyxhcmd1bWVudHMsMSk7Zm9yKHZhciBbYyxkXW9mIHRoaXMpYS5jYWxsKGIsZCxjLHRoaXMpfVxuc2V0KC4uLmEpe3goJ3NldCcsYXJndW1lbnRzLDIpO3ZhciBiPVtdLGM9ITA7YT1mKC4uLmEpO3RoaXMuI2QuZm9yRWFjaChkPT57ZFswXT09PWFbMF0/YyYmKGM9IWIucHVzaChhKSk6Yi5wdXNoKGQpfSk7YyYmYi5wdXNoKGEpO3RoaXMuI2Q9Yn1cbiplbnRyaWVzKCl7eWllbGQqdGhpcy4jZH1cbiprZXlzKCl7Zm9yKHZhclthXW9mIHRoaXMpeWllbGQgYX1cbip2YWx1ZXMoKXtmb3IodmFyWyxhXW9mIHRoaXMpeWllbGQgYX19XG5cbi8qKiBAcGFyYW0ge0Zvcm1EYXRhfSBGICovXG5leHBvcnQgZnVuY3Rpb24gZm9ybURhdGFUb0Jsb2IgKEYsQj1DKXtcbnZhciBiPWAke3IoKX0ke3IoKX1gLnJlcGxhY2UoL1xcLi9nLCAnJykuc2xpY2UoLTI4KS5wYWRTdGFydCgzMiwgJy0nKSxjPVtdLHA9YC0tJHtifVxcclxcbkNvbnRlbnQtRGlzcG9zaXRpb246IGZvcm0tZGF0YTsgbmFtZT1cImBcbkYuZm9yRWFjaCgodixuKT0+dHlwZW9mIHY9PSdzdHJpbmcnXG4/Yy5wdXNoKHArZShuKStgXCJcXHJcXG5cXHJcXG4ke3YucmVwbGFjZSgvXFxyKD8hXFxuKXwoPzwhXFxyKVxcbi9nLCAnXFxyXFxuJyl9XFxyXFxuYClcbjpjLnB1c2gocCtlKG4pK2BcIjsgZmlsZW5hbWU9XCIke2Uodi5uYW1lLCAxKX1cIlxcclxcbkNvbnRlbnQtVHlwZTogJHt2LnR5cGV8fFwiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtXCJ9XFxyXFxuXFxyXFxuYCwgdiwgJ1xcclxcbicpKVxuYy5wdXNoKGAtLSR7Yn0tLWApXG5yZXR1cm4gbmV3IEIoYyx7dHlwZTpcIm11bHRpcGFydC9mb3JtLWRhdGE7IGJvdW5kYXJ5PVwiK2J9KX1cbiIsICIvKiEgbm9kZS1kb21leGNlcHRpb24uIE1JVCBMaWNlbnNlLiBKaW1teSBXXHUwMEU0cnRpbmcgPGh0dHBzOi8vamltbXkud2FydGluZy5zZS9vcGVuc291cmNlPiAqL1xuXG5pZiAoIWdsb2JhbFRoaXMuRE9NRXhjZXB0aW9uKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgeyBNZXNzYWdlQ2hhbm5lbCB9ID0gcmVxdWlyZSgnd29ya2VyX3RocmVhZHMnKSxcbiAgICBwb3J0ID0gbmV3IE1lc3NhZ2VDaGFubmVsKCkucG9ydDEsXG4gICAgYWIgPSBuZXcgQXJyYXlCdWZmZXIoKVxuICAgIHBvcnQucG9zdE1lc3NhZ2UoYWIsIFthYiwgYWJdKVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBlcnIuY29uc3RydWN0b3IubmFtZSA9PT0gJ0RPTUV4Y2VwdGlvbicgJiYgKFxuICAgICAgZ2xvYmFsVGhpcy5ET01FeGNlcHRpb24gPSBlcnIuY29uc3RydWN0b3JcbiAgICApXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnbG9iYWxUaGlzLkRPTUV4Y2VwdGlvblxuIiwgImltcG9ydCB7IHN0YXRTeW5jLCBjcmVhdGVSZWFkU3RyZWFtLCBwcm9taXNlcyBhcyBmcyB9IGZyb20gJ25vZGU6ZnMnXG5pbXBvcnQgeyBiYXNlbmFtZSB9IGZyb20gJ25vZGU6cGF0aCdcbmltcG9ydCBET01FeGNlcHRpb24gZnJvbSAnbm9kZS1kb21leGNlcHRpb24nXG5cbmltcG9ydCBGaWxlIGZyb20gJy4vZmlsZS5qcydcbmltcG9ydCBCbG9iIGZyb20gJy4vaW5kZXguanMnXG5cbmNvbnN0IHsgc3RhdCB9ID0gZnNcblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCBmaWxlcGF0aCBvbiB0aGUgZGlza1xuICogQHBhcmFtIHtzdHJpbmd9IFt0eXBlXSBtaW1ldHlwZSB0byB1c2VcbiAqL1xuY29uc3QgYmxvYkZyb21TeW5jID0gKHBhdGgsIHR5cGUpID0+IGZyb21CbG9iKHN0YXRTeW5jKHBhdGgpLCBwYXRoLCB0eXBlKVxuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIGZpbGVwYXRoIG9uIHRoZSBkaXNrXG4gKiBAcGFyYW0ge3N0cmluZ30gW3R5cGVdIG1pbWV0eXBlIHRvIHVzZVxuICogQHJldHVybnMge1Byb21pc2U8QmxvYj59XG4gKi9cbmNvbnN0IGJsb2JGcm9tID0gKHBhdGgsIHR5cGUpID0+IHN0YXQocGF0aCkudGhlbihzdGF0ID0+IGZyb21CbG9iKHN0YXQsIHBhdGgsIHR5cGUpKVxuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIGZpbGVwYXRoIG9uIHRoZSBkaXNrXG4gKiBAcGFyYW0ge3N0cmluZ30gW3R5cGVdIG1pbWV0eXBlIHRvIHVzZVxuICogQHJldHVybnMge1Byb21pc2U8RmlsZT59XG4gKi9cbmNvbnN0IGZpbGVGcm9tID0gKHBhdGgsIHR5cGUpID0+IHN0YXQocGF0aCkudGhlbihzdGF0ID0+IGZyb21GaWxlKHN0YXQsIHBhdGgsIHR5cGUpKVxuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIGZpbGVwYXRoIG9uIHRoZSBkaXNrXG4gKiBAcGFyYW0ge3N0cmluZ30gW3R5cGVdIG1pbWV0eXBlIHRvIHVzZVxuICovXG5jb25zdCBmaWxlRnJvbVN5bmMgPSAocGF0aCwgdHlwZSkgPT4gZnJvbUZpbGUoc3RhdFN5bmMocGF0aCksIHBhdGgsIHR5cGUpXG5cbi8vIEB0cy1pZ25vcmVcbmNvbnN0IGZyb21CbG9iID0gKHN0YXQsIHBhdGgsIHR5cGUgPSAnJykgPT4gbmV3IEJsb2IoW25ldyBCbG9iRGF0YUl0ZW0oe1xuICBwYXRoLFxuICBzaXplOiBzdGF0LnNpemUsXG4gIGxhc3RNb2RpZmllZDogc3RhdC5tdGltZU1zLFxuICBzdGFydDogMFxufSldLCB7IHR5cGUgfSlcblxuLy8gQHRzLWlnbm9yZVxuY29uc3QgZnJvbUZpbGUgPSAoc3RhdCwgcGF0aCwgdHlwZSA9ICcnKSA9PiBuZXcgRmlsZShbbmV3IEJsb2JEYXRhSXRlbSh7XG4gIHBhdGgsXG4gIHNpemU6IHN0YXQuc2l6ZSxcbiAgbGFzdE1vZGlmaWVkOiBzdGF0Lm10aW1lTXMsXG4gIHN0YXJ0OiAwXG59KV0sIGJhc2VuYW1lKHBhdGgpLCB7IHR5cGUsIGxhc3RNb2RpZmllZDogc3RhdC5tdGltZU1zIH0pXG5cbi8qKlxuICogVGhpcyBpcyBhIGJsb2IgYmFja2VkIHVwIGJ5IGEgZmlsZSBvbiB0aGUgZGlza1xuICogd2l0aCBtaW5pdW0gcmVxdWlyZW1lbnQuIEl0cyB3cmFwcGVkIGFyb3VuZCBhIEJsb2IgYXMgYSBibG9iUGFydFxuICogc28geW91IGhhdmUgbm8gZGlyZWN0IGFjY2VzcyB0byB0aGlzLlxuICpcbiAqIEBwcml2YXRlXG4gKi9cbmNsYXNzIEJsb2JEYXRhSXRlbSB7XG4gICNwYXRoXG4gICNzdGFydFxuXG4gIGNvbnN0cnVjdG9yIChvcHRpb25zKSB7XG4gICAgdGhpcy4jcGF0aCA9IG9wdGlvbnMucGF0aFxuICAgIHRoaXMuI3N0YXJ0ID0gb3B0aW9ucy5zdGFydFxuICAgIHRoaXMuc2l6ZSA9IG9wdGlvbnMuc2l6ZVxuICAgIHRoaXMubGFzdE1vZGlmaWVkID0gb3B0aW9ucy5sYXN0TW9kaWZpZWRcbiAgfVxuXG4gIC8qKlxuICAgKiBTbGljaW5nIGFyZ3VtZW50cyBpcyBmaXJzdCB2YWxpZGF0ZWQgYW5kIGZvcm1hdHRlZFxuICAgKiB0byBub3QgYmUgb3V0IG9mIHJhbmdlIGJ5IEJsb2IucHJvdG90eXBlLnNsaWNlXG4gICAqL1xuICBzbGljZSAoc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiBuZXcgQmxvYkRhdGFJdGVtKHtcbiAgICAgIHBhdGg6IHRoaXMuI3BhdGgsXG4gICAgICBsYXN0TW9kaWZpZWQ6IHRoaXMubGFzdE1vZGlmaWVkLFxuICAgICAgc2l6ZTogZW5kIC0gc3RhcnQsXG4gICAgICBzdGFydDogdGhpcy4jc3RhcnQgKyBzdGFydFxuICAgIH0pXG4gIH1cblxuICBhc3luYyAqIHN0cmVhbSAoKSB7XG4gICAgY29uc3QgeyBtdGltZU1zIH0gPSBhd2FpdCBzdGF0KHRoaXMuI3BhdGgpXG4gICAgaWYgKG10aW1lTXMgPiB0aGlzLmxhc3RNb2RpZmllZCkge1xuICAgICAgdGhyb3cgbmV3IERPTUV4Y2VwdGlvbignVGhlIHJlcXVlc3RlZCBmaWxlIGNvdWxkIG5vdCBiZSByZWFkLCB0eXBpY2FsbHkgZHVlIHRvIHBlcm1pc3Npb24gcHJvYmxlbXMgdGhhdCBoYXZlIG9jY3VycmVkIGFmdGVyIGEgcmVmZXJlbmNlIHRvIGEgZmlsZSB3YXMgYWNxdWlyZWQuJywgJ05vdFJlYWRhYmxlRXJyb3InKVxuICAgIH1cbiAgICB5aWVsZCAqIGNyZWF0ZVJlYWRTdHJlYW0odGhpcy4jcGF0aCwge1xuICAgICAgc3RhcnQ6IHRoaXMuI3N0YXJ0LFxuICAgICAgZW5kOiB0aGlzLiNzdGFydCArIHRoaXMuc2l6ZSAtIDFcbiAgICB9KVxuICB9XG5cbiAgZ2V0IFtTeW1ib2wudG9TdHJpbmdUYWddICgpIHtcbiAgICByZXR1cm4gJ0Jsb2InXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgYmxvYkZyb21TeW5jXG5leHBvcnQgeyBGaWxlLCBCbG9iLCBibG9iRnJvbSwgYmxvYkZyb21TeW5jLCBmaWxlRnJvbSwgZmlsZUZyb21TeW5jIH1cbiIsICJpbXBvcnQge0ZpbGV9IGZyb20gJ2ZldGNoLWJsb2IvZnJvbS5qcyc7XG5pbXBvcnQge0Zvcm1EYXRhfSBmcm9tICdmb3JtZGF0YS1wb2x5ZmlsbC9lc20ubWluLmpzJztcblxubGV0IHMgPSAwO1xuY29uc3QgUyA9IHtcblx0U1RBUlRfQk9VTkRBUlk6IHMrKyxcblx0SEVBREVSX0ZJRUxEX1NUQVJUOiBzKyssXG5cdEhFQURFUl9GSUVMRDogcysrLFxuXHRIRUFERVJfVkFMVUVfU1RBUlQ6IHMrKyxcblx0SEVBREVSX1ZBTFVFOiBzKyssXG5cdEhFQURFUl9WQUxVRV9BTE1PU1RfRE9ORTogcysrLFxuXHRIRUFERVJTX0FMTU9TVF9ET05FOiBzKyssXG5cdFBBUlRfREFUQV9TVEFSVDogcysrLFxuXHRQQVJUX0RBVEE6IHMrKyxcblx0RU5EOiBzKytcbn07XG5cbmxldCBmID0gMTtcbmNvbnN0IEYgPSB7XG5cdFBBUlRfQk9VTkRBUlk6IGYsXG5cdExBU1RfQk9VTkRBUlk6IGYgKj0gMlxufTtcblxuY29uc3QgTEYgPSAxMDtcbmNvbnN0IENSID0gMTM7XG5jb25zdCBTUEFDRSA9IDMyO1xuY29uc3QgSFlQSEVOID0gNDU7XG5jb25zdCBDT0xPTiA9IDU4O1xuY29uc3QgQSA9IDk3O1xuY29uc3QgWiA9IDEyMjtcblxuY29uc3QgbG93ZXIgPSBjID0+IGMgfCAweDIwO1xuXG5jb25zdCBub29wID0gKCkgPT4ge307XG5cbmNsYXNzIE11bHRpcGFydFBhcnNlciB7XG5cdC8qKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gYm91bmRhcnlcblx0ICovXG5cdGNvbnN0cnVjdG9yKGJvdW5kYXJ5KSB7XG5cdFx0dGhpcy5pbmRleCA9IDA7XG5cdFx0dGhpcy5mbGFncyA9IDA7XG5cblx0XHR0aGlzLm9uSGVhZGVyRW5kID0gbm9vcDtcblx0XHR0aGlzLm9uSGVhZGVyRmllbGQgPSBub29wO1xuXHRcdHRoaXMub25IZWFkZXJzRW5kID0gbm9vcDtcblx0XHR0aGlzLm9uSGVhZGVyVmFsdWUgPSBub29wO1xuXHRcdHRoaXMub25QYXJ0QmVnaW4gPSBub29wO1xuXHRcdHRoaXMub25QYXJ0RGF0YSA9IG5vb3A7XG5cdFx0dGhpcy5vblBhcnRFbmQgPSBub29wO1xuXG5cdFx0dGhpcy5ib3VuZGFyeUNoYXJzID0ge307XG5cblx0XHRib3VuZGFyeSA9ICdcXHJcXG4tLScgKyBib3VuZGFyeTtcblx0XHRjb25zdCB1aThhID0gbmV3IFVpbnQ4QXJyYXkoYm91bmRhcnkubGVuZ3RoKTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGJvdW5kYXJ5Lmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR1aThhW2ldID0gYm91bmRhcnkuY2hhckNvZGVBdChpKTtcblx0XHRcdHRoaXMuYm91bmRhcnlDaGFyc1t1aThhW2ldXSA9IHRydWU7XG5cdFx0fVxuXG5cdFx0dGhpcy5ib3VuZGFyeSA9IHVpOGE7XG5cdFx0dGhpcy5sb29rYmVoaW5kID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5ib3VuZGFyeS5sZW5ndGggKyA4KTtcblx0XHR0aGlzLnN0YXRlID0gUy5TVEFSVF9CT1VOREFSWTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcGFyYW0ge1VpbnQ4QXJyYXl9IGRhdGFcblx0ICovXG5cdHdyaXRlKGRhdGEpIHtcblx0XHRsZXQgaSA9IDA7XG5cdFx0Y29uc3QgbGVuZ3RoXyA9IGRhdGEubGVuZ3RoO1xuXHRcdGxldCBwcmV2aW91c0luZGV4ID0gdGhpcy5pbmRleDtcblx0XHRsZXQge2xvb2tiZWhpbmQsIGJvdW5kYXJ5LCBib3VuZGFyeUNoYXJzLCBpbmRleCwgc3RhdGUsIGZsYWdzfSA9IHRoaXM7XG5cdFx0Y29uc3QgYm91bmRhcnlMZW5ndGggPSB0aGlzLmJvdW5kYXJ5Lmxlbmd0aDtcblx0XHRjb25zdCBib3VuZGFyeUVuZCA9IGJvdW5kYXJ5TGVuZ3RoIC0gMTtcblx0XHRjb25zdCBidWZmZXJMZW5ndGggPSBkYXRhLmxlbmd0aDtcblx0XHRsZXQgYztcblx0XHRsZXQgY2w7XG5cblx0XHRjb25zdCBtYXJrID0gbmFtZSA9PiB7XG5cdFx0XHR0aGlzW25hbWUgKyAnTWFyayddID0gaTtcblx0XHR9O1xuXG5cdFx0Y29uc3QgY2xlYXIgPSBuYW1lID0+IHtcblx0XHRcdGRlbGV0ZSB0aGlzW25hbWUgKyAnTWFyayddO1xuXHRcdH07XG5cblx0XHRjb25zdCBjYWxsYmFjayA9IChjYWxsYmFja1N5bWJvbCwgc3RhcnQsIGVuZCwgdWk4YSkgPT4ge1xuXHRcdFx0aWYgKHN0YXJ0ID09PSB1bmRlZmluZWQgfHwgc3RhcnQgIT09IGVuZCkge1xuXHRcdFx0XHR0aGlzW2NhbGxiYWNrU3ltYm9sXSh1aThhICYmIHVpOGEuc3ViYXJyYXkoc3RhcnQsIGVuZCkpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRjb25zdCBkYXRhQ2FsbGJhY2sgPSAobmFtZSwgY2xlYXIpID0+IHtcblx0XHRcdGNvbnN0IG1hcmtTeW1ib2wgPSBuYW1lICsgJ01hcmsnO1xuXHRcdFx0aWYgKCEobWFya1N5bWJvbCBpbiB0aGlzKSkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmIChjbGVhcikge1xuXHRcdFx0XHRjYWxsYmFjayhuYW1lLCB0aGlzW21hcmtTeW1ib2xdLCBpLCBkYXRhKTtcblx0XHRcdFx0ZGVsZXRlIHRoaXNbbWFya1N5bWJvbF07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjYWxsYmFjayhuYW1lLCB0aGlzW21hcmtTeW1ib2xdLCBkYXRhLmxlbmd0aCwgZGF0YSk7XG5cdFx0XHRcdHRoaXNbbWFya1N5bWJvbF0gPSAwO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoXzsgaSsrKSB7XG5cdFx0XHRjID0gZGF0YVtpXTtcblxuXHRcdFx0c3dpdGNoIChzdGF0ZSkge1xuXHRcdFx0XHRjYXNlIFMuU1RBUlRfQk9VTkRBUlk6XG5cdFx0XHRcdFx0aWYgKGluZGV4ID09PSBib3VuZGFyeS5sZW5ndGggLSAyKSB7XG5cdFx0XHRcdFx0XHRpZiAoYyA9PT0gSFlQSEVOKSB7XG5cdFx0XHRcdFx0XHRcdGZsYWdzIHw9IEYuTEFTVF9CT1VOREFSWTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYyAhPT0gQ1IpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpbmRleCsrO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChpbmRleCAtIDEgPT09IGJvdW5kYXJ5Lmxlbmd0aCAtIDIpIHtcblx0XHRcdFx0XHRcdGlmIChmbGFncyAmIEYuTEFTVF9CT1VOREFSWSAmJiBjID09PSBIWVBIRU4pIHtcblx0XHRcdFx0XHRcdFx0c3RhdGUgPSBTLkVORDtcblx0XHRcdFx0XHRcdFx0ZmxhZ3MgPSAwO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICghKGZsYWdzICYgRi5MQVNUX0JPVU5EQVJZKSAmJiBjID09PSBMRikge1xuXHRcdFx0XHRcdFx0XHRpbmRleCA9IDA7XG5cdFx0XHRcdFx0XHRcdGNhbGxiYWNrKCdvblBhcnRCZWdpbicpO1xuXHRcdFx0XHRcdFx0XHRzdGF0ZSA9IFMuSEVBREVSX0ZJRUxEX1NUQVJUO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoYyAhPT0gYm91bmRhcnlbaW5kZXggKyAyXSkge1xuXHRcdFx0XHRcdFx0aW5kZXggPSAtMjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoYyA9PT0gYm91bmRhcnlbaW5kZXggKyAyXSkge1xuXHRcdFx0XHRcdFx0aW5kZXgrKztcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBTLkhFQURFUl9GSUVMRF9TVEFSVDpcblx0XHRcdFx0XHRzdGF0ZSA9IFMuSEVBREVSX0ZJRUxEO1xuXHRcdFx0XHRcdG1hcmsoJ29uSGVhZGVyRmllbGQnKTtcblx0XHRcdFx0XHRpbmRleCA9IDA7XG5cdFx0XHRcdFx0Ly8gZmFsbHMgdGhyb3VnaFxuXHRcdFx0XHRjYXNlIFMuSEVBREVSX0ZJRUxEOlxuXHRcdFx0XHRcdGlmIChjID09PSBDUikge1xuXHRcdFx0XHRcdFx0Y2xlYXIoJ29uSGVhZGVyRmllbGQnKTtcblx0XHRcdFx0XHRcdHN0YXRlID0gUy5IRUFERVJTX0FMTU9TVF9ET05FO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aW5kZXgrKztcblx0XHRcdFx0XHRpZiAoYyA9PT0gSFlQSEVOKSB7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoYyA9PT0gQ09MT04pIHtcblx0XHRcdFx0XHRcdGlmIChpbmRleCA9PT0gMSkge1xuXHRcdFx0XHRcdFx0XHQvLyBlbXB0eSBoZWFkZXIgZmllbGRcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRkYXRhQ2FsbGJhY2soJ29uSGVhZGVyRmllbGQnLCB0cnVlKTtcblx0XHRcdFx0XHRcdHN0YXRlID0gUy5IRUFERVJfVkFMVUVfU1RBUlQ7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRjbCA9IGxvd2VyKGMpO1xuXHRcdFx0XHRcdGlmIChjbCA8IEEgfHwgY2wgPiBaKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgUy5IRUFERVJfVkFMVUVfU1RBUlQ6XG5cdFx0XHRcdFx0aWYgKGMgPT09IFNQQUNFKSB7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRtYXJrKCdvbkhlYWRlclZhbHVlJyk7XG5cdFx0XHRcdFx0c3RhdGUgPSBTLkhFQURFUl9WQUxVRTtcblx0XHRcdFx0XHQvLyBmYWxscyB0aHJvdWdoXG5cdFx0XHRcdGNhc2UgUy5IRUFERVJfVkFMVUU6XG5cdFx0XHRcdFx0aWYgKGMgPT09IENSKSB7XG5cdFx0XHRcdFx0XHRkYXRhQ2FsbGJhY2soJ29uSGVhZGVyVmFsdWUnLCB0cnVlKTtcblx0XHRcdFx0XHRcdGNhbGxiYWNrKCdvbkhlYWRlckVuZCcpO1xuXHRcdFx0XHRcdFx0c3RhdGUgPSBTLkhFQURFUl9WQUxVRV9BTE1PU1RfRE9ORTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBTLkhFQURFUl9WQUxVRV9BTE1PU1RfRE9ORTpcblx0XHRcdFx0XHRpZiAoYyAhPT0gTEYpIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRzdGF0ZSA9IFMuSEVBREVSX0ZJRUxEX1NUQVJUO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFMuSEVBREVSU19BTE1PU1RfRE9ORTpcblx0XHRcdFx0XHRpZiAoYyAhPT0gTEYpIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRjYWxsYmFjaygnb25IZWFkZXJzRW5kJyk7XG5cdFx0XHRcdFx0c3RhdGUgPSBTLlBBUlRfREFUQV9TVEFSVDtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBTLlBBUlRfREFUQV9TVEFSVDpcblx0XHRcdFx0XHRzdGF0ZSA9IFMuUEFSVF9EQVRBO1xuXHRcdFx0XHRcdG1hcmsoJ29uUGFydERhdGEnKTtcblx0XHRcdFx0XHQvLyBmYWxscyB0aHJvdWdoXG5cdFx0XHRcdGNhc2UgUy5QQVJUX0RBVEE6XG5cdFx0XHRcdFx0cHJldmlvdXNJbmRleCA9IGluZGV4O1xuXG5cdFx0XHRcdFx0aWYgKGluZGV4ID09PSAwKSB7XG5cdFx0XHRcdFx0XHQvLyBib3llci1tb29yZSBkZXJyaXZlZCBhbGdvcml0aG0gdG8gc2FmZWx5IHNraXAgbm9uLWJvdW5kYXJ5IGRhdGFcblx0XHRcdFx0XHRcdGkgKz0gYm91bmRhcnlFbmQ7XG5cdFx0XHRcdFx0XHR3aGlsZSAoaSA8IGJ1ZmZlckxlbmd0aCAmJiAhKGRhdGFbaV0gaW4gYm91bmRhcnlDaGFycykpIHtcblx0XHRcdFx0XHRcdFx0aSArPSBib3VuZGFyeUxlbmd0aDtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aSAtPSBib3VuZGFyeUVuZDtcblx0XHRcdFx0XHRcdGMgPSBkYXRhW2ldO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChpbmRleCA8IGJvdW5kYXJ5Lmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0aWYgKGJvdW5kYXJ5W2luZGV4XSA9PT0gYykge1xuXHRcdFx0XHRcdFx0XHRpZiAoaW5kZXggPT09IDApIHtcblx0XHRcdFx0XHRcdFx0XHRkYXRhQ2FsbGJhY2soJ29uUGFydERhdGEnLCB0cnVlKTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdGluZGV4Kys7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRpbmRleCA9IDA7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChpbmRleCA9PT0gYm91bmRhcnkubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRpbmRleCsrO1xuXHRcdFx0XHRcdFx0aWYgKGMgPT09IENSKSB7XG5cdFx0XHRcdFx0XHRcdC8vIENSID0gcGFydCBib3VuZGFyeVxuXHRcdFx0XHRcdFx0XHRmbGFncyB8PSBGLlBBUlRfQk9VTkRBUlk7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGMgPT09IEhZUEhFTikge1xuXHRcdFx0XHRcdFx0XHQvLyBIWVBIRU4gPSBlbmQgYm91bmRhcnlcblx0XHRcdFx0XHRcdFx0ZmxhZ3MgfD0gRi5MQVNUX0JPVU5EQVJZO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0aW5kZXggPSAwO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoaW5kZXggLSAxID09PSBib3VuZGFyeS5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdGlmIChmbGFncyAmIEYuUEFSVF9CT1VOREFSWSkge1xuXHRcdFx0XHRcdFx0XHRpbmRleCA9IDA7XG5cdFx0XHRcdFx0XHRcdGlmIChjID09PSBMRikge1xuXHRcdFx0XHRcdFx0XHRcdC8vIHVuc2V0IHRoZSBQQVJUX0JPVU5EQVJZIGZsYWdcblx0XHRcdFx0XHRcdFx0XHRmbGFncyAmPSB+Ri5QQVJUX0JPVU5EQVJZO1xuXHRcdFx0XHRcdFx0XHRcdGNhbGxiYWNrKCdvblBhcnRFbmQnKTtcblx0XHRcdFx0XHRcdFx0XHRjYWxsYmFjaygnb25QYXJ0QmVnaW4nKTtcblx0XHRcdFx0XHRcdFx0XHRzdGF0ZSA9IFMuSEVBREVSX0ZJRUxEX1NUQVJUO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGZsYWdzICYgRi5MQVNUX0JPVU5EQVJZKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChjID09PSBIWVBIRU4pIHtcblx0XHRcdFx0XHRcdFx0XHRjYWxsYmFjaygnb25QYXJ0RW5kJyk7XG5cdFx0XHRcdFx0XHRcdFx0c3RhdGUgPSBTLkVORDtcblx0XHRcdFx0XHRcdFx0XHRmbGFncyA9IDA7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0aW5kZXggPSAwO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRpbmRleCA9IDA7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKGluZGV4ID4gMCkge1xuXHRcdFx0XHRcdFx0Ly8gd2hlbiBtYXRjaGluZyBhIHBvc3NpYmxlIGJvdW5kYXJ5LCBrZWVwIGEgbG9va2JlaGluZCByZWZlcmVuY2Vcblx0XHRcdFx0XHRcdC8vIGluIGNhc2UgaXQgdHVybnMgb3V0IHRvIGJlIGEgZmFsc2UgbGVhZFxuXHRcdFx0XHRcdFx0bG9va2JlaGluZFtpbmRleCAtIDFdID0gYztcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHByZXZpb3VzSW5kZXggPiAwKSB7XG5cdFx0XHRcdFx0XHQvLyBpZiBvdXIgYm91bmRhcnkgdHVybmVkIG91dCB0byBiZSBydWJiaXNoLCB0aGUgY2FwdHVyZWQgbG9va2JlaGluZFxuXHRcdFx0XHRcdFx0Ly8gYmVsb25ncyB0byBwYXJ0RGF0YVxuXHRcdFx0XHRcdFx0Y29uc3QgX2xvb2tiZWhpbmQgPSBuZXcgVWludDhBcnJheShsb29rYmVoaW5kLmJ1ZmZlciwgbG9va2JlaGluZC5ieXRlT2Zmc2V0LCBsb29rYmVoaW5kLmJ5dGVMZW5ndGgpO1xuXHRcdFx0XHRcdFx0Y2FsbGJhY2soJ29uUGFydERhdGEnLCAwLCBwcmV2aW91c0luZGV4LCBfbG9va2JlaGluZCk7XG5cdFx0XHRcdFx0XHRwcmV2aW91c0luZGV4ID0gMDtcblx0XHRcdFx0XHRcdG1hcmsoJ29uUGFydERhdGEnKTtcblxuXHRcdFx0XHRcdFx0Ly8gcmVjb25zaWRlciB0aGUgY3VycmVudCBjaGFyYWN0ZXIgZXZlbiBzbyBpdCBpbnRlcnJ1cHRlZCB0aGUgc2VxdWVuY2Vcblx0XHRcdFx0XHRcdC8vIGl0IGNvdWxkIGJlIHRoZSBiZWdpbm5pbmcgb2YgYSBuZXcgc2VxdWVuY2Vcblx0XHRcdFx0XHRcdGktLTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBTLkVORDpcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuZXhwZWN0ZWQgc3RhdGUgZW50ZXJlZDogJHtzdGF0ZX1gKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRkYXRhQ2FsbGJhY2soJ29uSGVhZGVyRmllbGQnKTtcblx0XHRkYXRhQ2FsbGJhY2soJ29uSGVhZGVyVmFsdWUnKTtcblx0XHRkYXRhQ2FsbGJhY2soJ29uUGFydERhdGEnKTtcblxuXHRcdC8vIFVwZGF0ZSBwcm9wZXJ0aWVzIGZvciB0aGUgbmV4dCBjYWxsXG5cdFx0dGhpcy5pbmRleCA9IGluZGV4O1xuXHRcdHRoaXMuc3RhdGUgPSBzdGF0ZTtcblx0XHR0aGlzLmZsYWdzID0gZmxhZ3M7XG5cdH1cblxuXHRlbmQoKSB7XG5cdFx0aWYgKCh0aGlzLnN0YXRlID09PSBTLkhFQURFUl9GSUVMRF9TVEFSVCAmJiB0aGlzLmluZGV4ID09PSAwKSB8fFxuXHRcdFx0KHRoaXMuc3RhdGUgPT09IFMuUEFSVF9EQVRBICYmIHRoaXMuaW5kZXggPT09IHRoaXMuYm91bmRhcnkubGVuZ3RoKSkge1xuXHRcdFx0dGhpcy5vblBhcnRFbmQoKTtcblx0XHR9IGVsc2UgaWYgKHRoaXMuc3RhdGUgIT09IFMuRU5EKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ011bHRpcGFydFBhcnNlci5lbmQoKTogc3RyZWFtIGVuZGVkIHVuZXhwZWN0ZWRseScpO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBfZmlsZU5hbWUoaGVhZGVyVmFsdWUpIHtcblx0Ly8gbWF0Y2hlcyBlaXRoZXIgYSBxdW90ZWQtc3RyaW5nIG9yIGEgdG9rZW4gKFJGQyAyNjE2IHNlY3Rpb24gMTkuNS4xKVxuXHRjb25zdCBtID0gaGVhZGVyVmFsdWUubWF0Y2goL1xcYmZpbGVuYW1lPShcIiguKj8pXCJ8KFteKCk8PkAsOzpcXFxcXCIvW1xcXT89e31cXHNcXHRdKykpKCR8O1xccykvaSk7XG5cdGlmICghbSkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGNvbnN0IG1hdGNoID0gbVsyXSB8fCBtWzNdIHx8ICcnO1xuXHRsZXQgZmlsZW5hbWUgPSBtYXRjaC5zbGljZShtYXRjaC5sYXN0SW5kZXhPZignXFxcXCcpICsgMSk7XG5cdGZpbGVuYW1lID0gZmlsZW5hbWUucmVwbGFjZSgvJTIyL2csICdcIicpO1xuXHRmaWxlbmFtZSA9IGZpbGVuYW1lLnJlcGxhY2UoLyYjKFxcZHs0fSk7L2csIChtLCBjb2RlKSA9PiB7XG5cdFx0cmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoY29kZSk7XG5cdH0pO1xuXHRyZXR1cm4gZmlsZW5hbWU7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0b0Zvcm1EYXRhKEJvZHksIGN0KSB7XG5cdGlmICghL211bHRpcGFydC9pLnRlc3QoY3QpKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignRmFpbGVkIHRvIGZldGNoJyk7XG5cdH1cblxuXHRjb25zdCBtID0gY3QubWF0Y2goL2JvdW5kYXJ5PSg/OlwiKFteXCJdKylcInwoW147XSspKS9pKTtcblxuXHRpZiAoIW0pIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdubyBvciBiYWQgY29udGVudC10eXBlIGhlYWRlciwgbm8gbXVsdGlwYXJ0IGJvdW5kYXJ5Jyk7XG5cdH1cblxuXHRjb25zdCBwYXJzZXIgPSBuZXcgTXVsdGlwYXJ0UGFyc2VyKG1bMV0gfHwgbVsyXSk7XG5cblx0bGV0IGhlYWRlckZpZWxkO1xuXHRsZXQgaGVhZGVyVmFsdWU7XG5cdGxldCBlbnRyeVZhbHVlO1xuXHRsZXQgZW50cnlOYW1lO1xuXHRsZXQgY29udGVudFR5cGU7XG5cdGxldCBmaWxlbmFtZTtcblx0Y29uc3QgZW50cnlDaHVua3MgPSBbXTtcblx0Y29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcblxuXHRjb25zdCBvblBhcnREYXRhID0gdWk4YSA9PiB7XG5cdFx0ZW50cnlWYWx1ZSArPSBkZWNvZGVyLmRlY29kZSh1aThhLCB7c3RyZWFtOiB0cnVlfSk7XG5cdH07XG5cblx0Y29uc3QgYXBwZW5kVG9GaWxlID0gdWk4YSA9PiB7XG5cdFx0ZW50cnlDaHVua3MucHVzaCh1aThhKTtcblx0fTtcblxuXHRjb25zdCBhcHBlbmRGaWxlVG9Gb3JtRGF0YSA9ICgpID0+IHtcblx0XHRjb25zdCBmaWxlID0gbmV3IEZpbGUoZW50cnlDaHVua3MsIGZpbGVuYW1lLCB7dHlwZTogY29udGVudFR5cGV9KTtcblx0XHRmb3JtRGF0YS5hcHBlbmQoZW50cnlOYW1lLCBmaWxlKTtcblx0fTtcblxuXHRjb25zdCBhcHBlbmRFbnRyeVRvRm9ybURhdGEgPSAoKSA9PiB7XG5cdFx0Zm9ybURhdGEuYXBwZW5kKGVudHJ5TmFtZSwgZW50cnlWYWx1ZSk7XG5cdH07XG5cblx0Y29uc3QgZGVjb2RlciA9IG5ldyBUZXh0RGVjb2RlcigndXRmLTgnKTtcblx0ZGVjb2Rlci5kZWNvZGUoKTtcblxuXHRwYXJzZXIub25QYXJ0QmVnaW4gPSBmdW5jdGlvbiAoKSB7XG5cdFx0cGFyc2VyLm9uUGFydERhdGEgPSBvblBhcnREYXRhO1xuXHRcdHBhcnNlci5vblBhcnRFbmQgPSBhcHBlbmRFbnRyeVRvRm9ybURhdGE7XG5cblx0XHRoZWFkZXJGaWVsZCA9ICcnO1xuXHRcdGhlYWRlclZhbHVlID0gJyc7XG5cdFx0ZW50cnlWYWx1ZSA9ICcnO1xuXHRcdGVudHJ5TmFtZSA9ICcnO1xuXHRcdGNvbnRlbnRUeXBlID0gJyc7XG5cdFx0ZmlsZW5hbWUgPSBudWxsO1xuXHRcdGVudHJ5Q2h1bmtzLmxlbmd0aCA9IDA7XG5cdH07XG5cblx0cGFyc2VyLm9uSGVhZGVyRmllbGQgPSBmdW5jdGlvbiAodWk4YSkge1xuXHRcdGhlYWRlckZpZWxkICs9IGRlY29kZXIuZGVjb2RlKHVpOGEsIHtzdHJlYW06IHRydWV9KTtcblx0fTtcblxuXHRwYXJzZXIub25IZWFkZXJWYWx1ZSA9IGZ1bmN0aW9uICh1aThhKSB7XG5cdFx0aGVhZGVyVmFsdWUgKz0gZGVjb2Rlci5kZWNvZGUodWk4YSwge3N0cmVhbTogdHJ1ZX0pO1xuXHR9O1xuXG5cdHBhcnNlci5vbkhlYWRlckVuZCA9IGZ1bmN0aW9uICgpIHtcblx0XHRoZWFkZXJWYWx1ZSArPSBkZWNvZGVyLmRlY29kZSgpO1xuXHRcdGhlYWRlckZpZWxkID0gaGVhZGVyRmllbGQudG9Mb3dlckNhc2UoKTtcblxuXHRcdGlmIChoZWFkZXJGaWVsZCA9PT0gJ2NvbnRlbnQtZGlzcG9zaXRpb24nKSB7XG5cdFx0XHQvLyBtYXRjaGVzIGVpdGhlciBhIHF1b3RlZC1zdHJpbmcgb3IgYSB0b2tlbiAoUkZDIDI2MTYgc2VjdGlvbiAxOS41LjEpXG5cdFx0XHRjb25zdCBtID0gaGVhZGVyVmFsdWUubWF0Y2goL1xcYm5hbWU9KFwiKFteXCJdKilcInwoW14oKTw+QCw7OlxcXFxcIi9bXFxdPz17fVxcc1xcdF0rKSkvaSk7XG5cblx0XHRcdGlmIChtKSB7XG5cdFx0XHRcdGVudHJ5TmFtZSA9IG1bMl0gfHwgbVszXSB8fCAnJztcblx0XHRcdH1cblxuXHRcdFx0ZmlsZW5hbWUgPSBfZmlsZU5hbWUoaGVhZGVyVmFsdWUpO1xuXG5cdFx0XHRpZiAoZmlsZW5hbWUpIHtcblx0XHRcdFx0cGFyc2VyLm9uUGFydERhdGEgPSBhcHBlbmRUb0ZpbGU7XG5cdFx0XHRcdHBhcnNlci5vblBhcnRFbmQgPSBhcHBlbmRGaWxlVG9Gb3JtRGF0YTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKGhlYWRlckZpZWxkID09PSAnY29udGVudC10eXBlJykge1xuXHRcdFx0Y29udGVudFR5cGUgPSBoZWFkZXJWYWx1ZTtcblx0XHR9XG5cblx0XHRoZWFkZXJWYWx1ZSA9ICcnO1xuXHRcdGhlYWRlckZpZWxkID0gJyc7XG5cdH07XG5cblx0Zm9yIGF3YWl0IChjb25zdCBjaHVuayBvZiBCb2R5KSB7XG5cdFx0cGFyc2VyLndyaXRlKGNodW5rKTtcblx0fVxuXG5cdHBhcnNlci5lbmQoKTtcblxuXHRyZXR1cm4gZm9ybURhdGE7XG59XG4iLCAiaW1wb3J0IHsgRGV0YWlsLCBJY29uLCBDb2xvciB9IGZyb20gXCJAcmF5Y2FzdC9hcGlcIjtcbmltcG9ydCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBmZXRjaCBmcm9tIFwibm9kZS1mZXRjaFwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDb21tYW5kKCkge1xuICBjb25zdCBbZGF0YSwgc2V0RGF0YV0gPSB1c2VTdGF0ZTxhbnk+KG51bGwpO1xuICBjb25zdCBbaXNMb2FkaW5nLCBzZXRJc0xvYWRpbmddID0gdXNlU3RhdGUodHJ1ZSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBhc3luYyBmdW5jdGlvbiBmZXRjaFN0YXRzKCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcImh0dHA6Ly9sb2NhbGhvc3Q6MzAzMC9zdGF0dXNcIik7XG4gICAgICAgIGNvbnN0IGpzb24gPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgIHNldERhdGEoanNvbik7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBzZXRJc0xvYWRpbmcoZmFsc2UpO1xuICAgICAgfVxuICAgIH1cbiAgICBmZXRjaFN0YXRzKCk7XG4gIH0sIFtdKTtcblxuICBjb25zdCBtYXJrZG93biA9IGRhdGEgPyBgXG4jIFx1RDgzQ1x1REYwQyBHcmF2aXR5IEh1YiBEYXNoYm9hcmRcblxuIyMjIFx1Mjc0NFx1RkUwRiBDbGltYXRlXG4tICoqQUMgU3RhdHVzKio6ICR7ZGF0YS5zdGF0cy5hYz8uc3RhdHVzPy50b1VwcGVyQ2FzZSgpIHx8ICdPRkYnfVxuLSAqKkN1cnJlbnQgTG9hZCoqOiAke2RhdGEuc3RhdHMuYWNNaW51dGVzIHx8IDB9IG1pbnNcbi0gKipCaWxsaW5nIFVuaXRzKio6ICR7ZGF0YS51bml0cyB8fCAwfSBrV2hcblxuIyMjIFx1RDgzRFx1RENBMSBJbGx1bWluYXRpb25cbi0gKipMaWdodHMqKjogJHtkYXRhLnN0YXRzLmxpZ2h0Py5zdGF0dXM/LnRvVXBwZXJDYXNlKCkgfHwgJ09GRid9XG4tICoqU2Vzc2lvbiBEdXJhdGlvbioqOiAke2RhdGEuc3RhdHMubGlnaHRNaW51dGVzIHx8IDB9IG1pbnNcblxuIyMjIFx1MjY5OVx1RkUwRiBTeXN0ZW0gSGVhbHRoXG4tICoqVXB0aW1lKio6ICR7TWF0aC5mbG9vcihkYXRhLnVwdGltZSAvIDM2MDApfWggJHtNYXRoLmZsb29yKChkYXRhLnVwdGltZSAlIDM2MDApIC8gNjApfW1cbi0gKipTcG90aWZ5Kio6ICR7ZGF0YS5zcG90aWZ5IHx8ICdJZGxlJ31cbi0gKipOZXR3b3JrKio6ICR7ZGF0YS5qaXR0ZXIgPyAoZGF0YS5qaXR0ZXIgPiAxNTAgPyAnXHUyNkEwXHVGRTBGIEppdHRlcnknIDogJ1x1MjcwNSBTdGFibGUnKSA6ICdVbmtub3duJ31cbmAgOiBcIiMgXHUyNzRDIEh1YiBPZmZsaW5lXCI7XG5cbiAgcmV0dXJuIChcbiAgICA8RGV0YWlsXG4gICAgICBpc0xvYWRpbmc9e2lzTG9hZGluZ31cbiAgICAgIG1hcmtkb3duPXttYXJrZG93bn1cbiAgICAgIG1ldGFkYXRhPXtcbiAgICAgICAgZGF0YSAmJiAoXG4gICAgICAgICAgPERldGFpbC5NZXRhZGF0YT5cbiAgICAgICAgICAgIDxEZXRhaWwuTWV0YWRhdGEuTGFiZWwgdGl0bGU9XCJQbGF0Zm9ybVwiIGljb249e0ljb24uQ29tcHV0ZXJ9IHRleHQ9e2RhdGEucGxhdGZvcm19IC8+XG4gICAgICAgICAgICA8RGV0YWlsLk1ldGFkYXRhLkxhYmVsIHRpdGxlPVwiTmV0d29yayBKaXR0ZXJcIiBpY29uPXtJY29uLkdsb2JlfSB0ZXh0PXtgJHtkYXRhLmppdHRlcj8udG9GaXhlZCgwKSB8fCAwfW1zYH0gLz5cbiAgICAgICAgICAgIDxEZXRhaWwuTWV0YWRhdGEuVGFnTGlzdCB0aXRsZT1cIlBvd2VyIFN0YXR1c1wiPlxuICAgICAgICAgICAgICA8RGV0YWlsLk1ldGFkYXRhLlRhZ0xpc3QuSXRlbSBcbiAgICAgICAgICAgICAgICAgdGV4dD17ZGF0YS5iYXR0ZXJ5Py5pc1BsdWdnZWQgPyBcIk11bHRpLVNvdXJjZVwiIDogXCJCYXR0ZXJ5XCJ9IFxuICAgICAgICAgICAgICAgICBjb2xvcj17ZGF0YS5iYXR0ZXJ5Py5pc1BsdWdnZWQgPyBDb2xvci5HcmVlbiA6IENvbG9yLlllbGxvd30gXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L0RldGFpbC5NZXRhZGF0YS5UYWdMaXN0PlxuICAgICAgICAgIDwvRGV0YWlsLk1ldGFkYXRhPlxuICAgICAgICApXG4gICAgICB9XG4gICAgLz5cbiAgKTtcbn1cbiIsICIvKipcbiAqIEluZGV4LmpzXG4gKlxuICogYSByZXF1ZXN0IEFQSSBjb21wYXRpYmxlIHdpdGggd2luZG93LmZldGNoXG4gKlxuICogQWxsIHNwZWMgYWxnb3JpdGhtIHN0ZXAgbnVtYmVycyBhcmUgYmFzZWQgb24gaHR0cHM6Ly9mZXRjaC5zcGVjLndoYXR3Zy5vcmcvY29tbWl0LXNuYXBzaG90cy9hZTcxNjgyMmNiM2E2MTg0MzIyNmNkMDkwZWVmYzY1ODk0NDZjMWQyLy5cbiAqL1xuXG5pbXBvcnQgaHR0cCBmcm9tICdub2RlOmh0dHAnO1xuaW1wb3J0IGh0dHBzIGZyb20gJ25vZGU6aHR0cHMnO1xuaW1wb3J0IHpsaWIgZnJvbSAnbm9kZTp6bGliJztcbmltcG9ydCBTdHJlYW0sIHtQYXNzVGhyb3VnaCwgcGlwZWxpbmUgYXMgcHVtcH0gZnJvbSAnbm9kZTpzdHJlYW0nO1xuaW1wb3J0IHtCdWZmZXJ9IGZyb20gJ25vZGU6YnVmZmVyJztcblxuaW1wb3J0IGRhdGFVcmlUb0J1ZmZlciBmcm9tICdkYXRhLXVyaS10by1idWZmZXInO1xuXG5pbXBvcnQge3dyaXRlVG9TdHJlYW0sIGNsb25lfSBmcm9tICcuL2JvZHkuanMnO1xuaW1wb3J0IFJlc3BvbnNlIGZyb20gJy4vcmVzcG9uc2UuanMnO1xuaW1wb3J0IEhlYWRlcnMsIHtmcm9tUmF3SGVhZGVyc30gZnJvbSAnLi9oZWFkZXJzLmpzJztcbmltcG9ydCBSZXF1ZXN0LCB7Z2V0Tm9kZVJlcXVlc3RPcHRpb25zfSBmcm9tICcuL3JlcXVlc3QuanMnO1xuaW1wb3J0IHtGZXRjaEVycm9yfSBmcm9tICcuL2Vycm9ycy9mZXRjaC1lcnJvci5qcyc7XG5pbXBvcnQge0Fib3J0RXJyb3J9IGZyb20gJy4vZXJyb3JzL2Fib3J0LWVycm9yLmpzJztcbmltcG9ydCB7aXNSZWRpcmVjdH0gZnJvbSAnLi91dGlscy9pcy1yZWRpcmVjdC5qcyc7XG5pbXBvcnQge0Zvcm1EYXRhfSBmcm9tICdmb3JtZGF0YS1wb2x5ZmlsbC9lc20ubWluLmpzJztcbmltcG9ydCB7aXNEb21haW5PclN1YmRvbWFpbiwgaXNTYW1lUHJvdG9jb2x9IGZyb20gJy4vdXRpbHMvaXMuanMnO1xuaW1wb3J0IHtwYXJzZVJlZmVycmVyUG9saWN5RnJvbUhlYWRlcn0gZnJvbSAnLi91dGlscy9yZWZlcnJlci5qcyc7XG5pbXBvcnQge1xuXHRCbG9iLFxuXHRGaWxlLFxuXHRmaWxlRnJvbVN5bmMsXG5cdGZpbGVGcm9tLFxuXHRibG9iRnJvbVN5bmMsXG5cdGJsb2JGcm9tXG59IGZyb20gJ2ZldGNoLWJsb2IvZnJvbS5qcyc7XG5cbmV4cG9ydCB7Rm9ybURhdGEsIEhlYWRlcnMsIFJlcXVlc3QsIFJlc3BvbnNlLCBGZXRjaEVycm9yLCBBYm9ydEVycm9yLCBpc1JlZGlyZWN0fTtcbmV4cG9ydCB7QmxvYiwgRmlsZSwgZmlsZUZyb21TeW5jLCBmaWxlRnJvbSwgYmxvYkZyb21TeW5jLCBibG9iRnJvbX07XG5cbmNvbnN0IHN1cHBvcnRlZFNjaGVtYXMgPSBuZXcgU2V0KFsnZGF0YTonLCAnaHR0cDonLCAnaHR0cHM6J10pO1xuXG4vKipcbiAqIEZldGNoIGZ1bmN0aW9uXG4gKlxuICogQHBhcmFtICAge3N0cmluZyB8IFVSTCB8IGltcG9ydCgnLi9yZXF1ZXN0JykuZGVmYXVsdH0gdXJsIC0gQWJzb2x1dGUgdXJsIG9yIFJlcXVlc3QgaW5zdGFuY2VcbiAqIEBwYXJhbSAgIHsqfSBbb3B0aW9uc19dIC0gRmV0Y2ggb3B0aW9uc1xuICogQHJldHVybiAge1Byb21pc2U8aW1wb3J0KCcuL3Jlc3BvbnNlJykuZGVmYXVsdD59XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGZldGNoKHVybCwgb3B0aW9uc18pIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHQvLyBCdWlsZCByZXF1ZXN0IG9iamVjdFxuXHRcdGNvbnN0IHJlcXVlc3QgPSBuZXcgUmVxdWVzdCh1cmwsIG9wdGlvbnNfKTtcblx0XHRjb25zdCB7cGFyc2VkVVJMLCBvcHRpb25zfSA9IGdldE5vZGVSZXF1ZXN0T3B0aW9ucyhyZXF1ZXN0KTtcblx0XHRpZiAoIXN1cHBvcnRlZFNjaGVtYXMuaGFzKHBhcnNlZFVSTC5wcm90b2NvbCkpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoYG5vZGUtZmV0Y2ggY2Fubm90IGxvYWQgJHt1cmx9LiBVUkwgc2NoZW1lIFwiJHtwYXJzZWRVUkwucHJvdG9jb2wucmVwbGFjZSgvOiQvLCAnJyl9XCIgaXMgbm90IHN1cHBvcnRlZC5gKTtcblx0XHR9XG5cblx0XHRpZiAocGFyc2VkVVJMLnByb3RvY29sID09PSAnZGF0YTonKSB7XG5cdFx0XHRjb25zdCBkYXRhID0gZGF0YVVyaVRvQnVmZmVyKHJlcXVlc3QudXJsKTtcblx0XHRcdGNvbnN0IHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKGRhdGEsIHtoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6IGRhdGEudHlwZUZ1bGx9fSk7XG5cdFx0XHRyZXNvbHZlKHJlc3BvbnNlKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBXcmFwIGh0dHAucmVxdWVzdCBpbnRvIGZldGNoXG5cdFx0Y29uc3Qgc2VuZCA9IChwYXJzZWRVUkwucHJvdG9jb2wgPT09ICdodHRwczonID8gaHR0cHMgOiBodHRwKS5yZXF1ZXN0O1xuXHRcdGNvbnN0IHtzaWduYWx9ID0gcmVxdWVzdDtcblx0XHRsZXQgcmVzcG9uc2UgPSBudWxsO1xuXG5cdFx0Y29uc3QgYWJvcnQgPSAoKSA9PiB7XG5cdFx0XHRjb25zdCBlcnJvciA9IG5ldyBBYm9ydEVycm9yKCdUaGUgb3BlcmF0aW9uIHdhcyBhYm9ydGVkLicpO1xuXHRcdFx0cmVqZWN0KGVycm9yKTtcblx0XHRcdGlmIChyZXF1ZXN0LmJvZHkgJiYgcmVxdWVzdC5ib2R5IGluc3RhbmNlb2YgU3RyZWFtLlJlYWRhYmxlKSB7XG5cdFx0XHRcdHJlcXVlc3QuYm9keS5kZXN0cm95KGVycm9yKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCFyZXNwb25zZSB8fCAhcmVzcG9uc2UuYm9keSkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHJlc3BvbnNlLmJvZHkuZW1pdCgnZXJyb3InLCBlcnJvcik7XG5cdFx0fTtcblxuXHRcdGlmIChzaWduYWwgJiYgc2lnbmFsLmFib3J0ZWQpIHtcblx0XHRcdGFib3J0KCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgYWJvcnRBbmRGaW5hbGl6ZSA9ICgpID0+IHtcblx0XHRcdGFib3J0KCk7XG5cdFx0XHRmaW5hbGl6ZSgpO1xuXHRcdH07XG5cblx0XHQvLyBTZW5kIHJlcXVlc3Rcblx0XHRjb25zdCByZXF1ZXN0XyA9IHNlbmQocGFyc2VkVVJMLnRvU3RyaW5nKCksIG9wdGlvbnMpO1xuXG5cdFx0aWYgKHNpZ25hbCkge1xuXHRcdFx0c2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Fib3J0JywgYWJvcnRBbmRGaW5hbGl6ZSk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgZmluYWxpemUgPSAoKSA9PiB7XG5cdFx0XHRyZXF1ZXN0Xy5hYm9ydCgpO1xuXHRcdFx0aWYgKHNpZ25hbCkge1xuXHRcdFx0XHRzaWduYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBhYm9ydEFuZEZpbmFsaXplKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0cmVxdWVzdF8ub24oJ2Vycm9yJywgZXJyb3IgPT4ge1xuXHRcdFx0cmVqZWN0KG5ldyBGZXRjaEVycm9yKGByZXF1ZXN0IHRvICR7cmVxdWVzdC51cmx9IGZhaWxlZCwgcmVhc29uOiAke2Vycm9yLm1lc3NhZ2V9YCwgJ3N5c3RlbScsIGVycm9yKSk7XG5cdFx0XHRmaW5hbGl6ZSgpO1xuXHRcdH0pO1xuXG5cdFx0Zml4UmVzcG9uc2VDaHVua2VkVHJhbnNmZXJCYWRFbmRpbmcocmVxdWVzdF8sIGVycm9yID0+IHtcblx0XHRcdGlmIChyZXNwb25zZSAmJiByZXNwb25zZS5ib2R5KSB7XG5cdFx0XHRcdHJlc3BvbnNlLmJvZHkuZGVzdHJveShlcnJvcik7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHQvKiBjOCBpZ25vcmUgbmV4dCAxOCAqL1xuXHRcdGlmIChwcm9jZXNzLnZlcnNpb24gPCAndjE0Jykge1xuXHRcdFx0Ly8gQmVmb3JlIE5vZGUuanMgMTQsIHBpcGVsaW5lKCkgZG9lcyBub3QgZnVsbHkgc3VwcG9ydCBhc3luYyBpdGVyYXRvcnMgYW5kIGRvZXMgbm90IGFsd2F5c1xuXHRcdFx0Ly8gcHJvcGVybHkgaGFuZGxlIHdoZW4gdGhlIHNvY2tldCBjbG9zZS9lbmQgZXZlbnRzIGFyZSBvdXQgb2Ygb3JkZXIuXG5cdFx0XHRyZXF1ZXN0Xy5vbignc29ja2V0JywgcyA9PiB7XG5cdFx0XHRcdGxldCBlbmRlZFdpdGhFdmVudHNDb3VudDtcblx0XHRcdFx0cy5wcmVwZW5kTGlzdGVuZXIoJ2VuZCcsICgpID0+IHtcblx0XHRcdFx0XHRlbmRlZFdpdGhFdmVudHNDb3VudCA9IHMuX2V2ZW50c0NvdW50O1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0cy5wcmVwZW5kTGlzdGVuZXIoJ2Nsb3NlJywgaGFkRXJyb3IgPT4ge1xuXHRcdFx0XHRcdC8vIGlmIGVuZCBoYXBwZW5lZCBiZWZvcmUgY2xvc2UgYnV0IHRoZSBzb2NrZXQgZGlkbid0IGVtaXQgYW4gZXJyb3IsIGRvIGl0IG5vd1xuXHRcdFx0XHRcdGlmIChyZXNwb25zZSAmJiBlbmRlZFdpdGhFdmVudHNDb3VudCA8IHMuX2V2ZW50c0NvdW50ICYmICFoYWRFcnJvcikge1xuXHRcdFx0XHRcdFx0Y29uc3QgZXJyb3IgPSBuZXcgRXJyb3IoJ1ByZW1hdHVyZSBjbG9zZScpO1xuXHRcdFx0XHRcdFx0ZXJyb3IuY29kZSA9ICdFUlJfU1RSRUFNX1BSRU1BVFVSRV9DTE9TRSc7XG5cdFx0XHRcdFx0XHRyZXNwb25zZS5ib2R5LmVtaXQoJ2Vycm9yJywgZXJyb3IpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRyZXF1ZXN0Xy5vbigncmVzcG9uc2UnLCByZXNwb25zZV8gPT4ge1xuXHRcdFx0cmVxdWVzdF8uc2V0VGltZW91dCgwKTtcblx0XHRcdGNvbnN0IGhlYWRlcnMgPSBmcm9tUmF3SGVhZGVycyhyZXNwb25zZV8ucmF3SGVhZGVycyk7XG5cblx0XHRcdC8vIEhUVFAgZmV0Y2ggc3RlcCA1XG5cdFx0XHRpZiAoaXNSZWRpcmVjdChyZXNwb25zZV8uc3RhdHVzQ29kZSkpIHtcblx0XHRcdFx0Ly8gSFRUUCBmZXRjaCBzdGVwIDUuMlxuXHRcdFx0XHRjb25zdCBsb2NhdGlvbiA9IGhlYWRlcnMuZ2V0KCdMb2NhdGlvbicpO1xuXG5cdFx0XHRcdC8vIEhUVFAgZmV0Y2ggc3RlcCA1LjNcblx0XHRcdFx0bGV0IGxvY2F0aW9uVVJMID0gbnVsbDtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRsb2NhdGlvblVSTCA9IGxvY2F0aW9uID09PSBudWxsID8gbnVsbCA6IG5ldyBVUkwobG9jYXRpb24sIHJlcXVlc3QudXJsKTtcblx0XHRcdFx0fSBjYXRjaCB7XG5cdFx0XHRcdFx0Ly8gZXJyb3IgaGVyZSBjYW4gb25seSBiZSBpbnZhbGlkIFVSTCBpbiBMb2NhdGlvbjogaGVhZGVyXG5cdFx0XHRcdFx0Ly8gZG8gbm90IHRocm93IHdoZW4gb3B0aW9ucy5yZWRpcmVjdCA9PSBtYW51YWxcblx0XHRcdFx0XHQvLyBsZXQgdGhlIHVzZXIgZXh0cmFjdCB0aGUgZXJyb3JuZW91cyByZWRpcmVjdCBVUkxcblx0XHRcdFx0XHRpZiAocmVxdWVzdC5yZWRpcmVjdCAhPT0gJ21hbnVhbCcpIHtcblx0XHRcdFx0XHRcdHJlamVjdChuZXcgRmV0Y2hFcnJvcihgdXJpIHJlcXVlc3RlZCByZXNwb25kcyB3aXRoIGFuIGludmFsaWQgcmVkaXJlY3QgVVJMOiAke2xvY2F0aW9ufWAsICdpbnZhbGlkLXJlZGlyZWN0JykpO1xuXHRcdFx0XHRcdFx0ZmluYWxpemUoKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBIVFRQIGZldGNoIHN0ZXAgNS41XG5cdFx0XHRcdHN3aXRjaCAocmVxdWVzdC5yZWRpcmVjdCkge1xuXHRcdFx0XHRcdGNhc2UgJ2Vycm9yJzpcblx0XHRcdFx0XHRcdHJlamVjdChuZXcgRmV0Y2hFcnJvcihgdXJpIHJlcXVlc3RlZCByZXNwb25kcyB3aXRoIGEgcmVkaXJlY3QsIHJlZGlyZWN0IG1vZGUgaXMgc2V0IHRvIGVycm9yOiAke3JlcXVlc3QudXJsfWAsICduby1yZWRpcmVjdCcpKTtcblx0XHRcdFx0XHRcdGZpbmFsaXplKCk7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0Y2FzZSAnbWFudWFsJzpcblx0XHRcdFx0XHRcdC8vIE5vdGhpbmcgdG8gZG9cblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgJ2ZvbGxvdyc6IHtcblx0XHRcdFx0XHRcdC8vIEhUVFAtcmVkaXJlY3QgZmV0Y2ggc3RlcCAyXG5cdFx0XHRcdFx0XHRpZiAobG9jYXRpb25VUkwgPT09IG51bGwpIHtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIEhUVFAtcmVkaXJlY3QgZmV0Y2ggc3RlcCA1XG5cdFx0XHRcdFx0XHRpZiAocmVxdWVzdC5jb3VudGVyID49IHJlcXVlc3QuZm9sbG93KSB7XG5cdFx0XHRcdFx0XHRcdHJlamVjdChuZXcgRmV0Y2hFcnJvcihgbWF4aW11bSByZWRpcmVjdCByZWFjaGVkIGF0OiAke3JlcXVlc3QudXJsfWAsICdtYXgtcmVkaXJlY3QnKSk7XG5cdFx0XHRcdFx0XHRcdGZpbmFsaXplKCk7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Ly8gSFRUUC1yZWRpcmVjdCBmZXRjaCBzdGVwIDYgKGNvdW50ZXIgaW5jcmVtZW50KVxuXHRcdFx0XHRcdFx0Ly8gQ3JlYXRlIGEgbmV3IFJlcXVlc3Qgb2JqZWN0LlxuXHRcdFx0XHRcdFx0Y29uc3QgcmVxdWVzdE9wdGlvbnMgPSB7XG5cdFx0XHRcdFx0XHRcdGhlYWRlcnM6IG5ldyBIZWFkZXJzKHJlcXVlc3QuaGVhZGVycyksXG5cdFx0XHRcdFx0XHRcdGZvbGxvdzogcmVxdWVzdC5mb2xsb3csXG5cdFx0XHRcdFx0XHRcdGNvdW50ZXI6IHJlcXVlc3QuY291bnRlciArIDEsXG5cdFx0XHRcdFx0XHRcdGFnZW50OiByZXF1ZXN0LmFnZW50LFxuXHRcdFx0XHRcdFx0XHRjb21wcmVzczogcmVxdWVzdC5jb21wcmVzcyxcblx0XHRcdFx0XHRcdFx0bWV0aG9kOiByZXF1ZXN0Lm1ldGhvZCxcblx0XHRcdFx0XHRcdFx0Ym9keTogY2xvbmUocmVxdWVzdCksXG5cdFx0XHRcdFx0XHRcdHNpZ25hbDogcmVxdWVzdC5zaWduYWwsXG5cdFx0XHRcdFx0XHRcdHNpemU6IHJlcXVlc3Quc2l6ZSxcblx0XHRcdFx0XHRcdFx0cmVmZXJyZXI6IHJlcXVlc3QucmVmZXJyZXIsXG5cdFx0XHRcdFx0XHRcdHJlZmVycmVyUG9saWN5OiByZXF1ZXN0LnJlZmVycmVyUG9saWN5XG5cdFx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0XHQvLyB3aGVuIGZvcndhcmRpbmcgc2Vuc2l0aXZlIGhlYWRlcnMgbGlrZSBcIkF1dGhvcml6YXRpb25cIixcblx0XHRcdFx0XHRcdC8vIFwiV1dXLUF1dGhlbnRpY2F0ZVwiLCBhbmQgXCJDb29raWVcIiB0byB1bnRydXN0ZWQgdGFyZ2V0cyxcblx0XHRcdFx0XHRcdC8vIGhlYWRlcnMgd2lsbCBiZSBpZ25vcmVkIHdoZW4gZm9sbG93aW5nIGEgcmVkaXJlY3QgdG8gYSBkb21haW5cblx0XHRcdFx0XHRcdC8vIHRoYXQgaXMgbm90IGEgc3ViZG9tYWluIG1hdGNoIG9yIGV4YWN0IG1hdGNoIG9mIHRoZSBpbml0aWFsIGRvbWFpbi5cblx0XHRcdFx0XHRcdC8vIEZvciBleGFtcGxlLCBhIHJlZGlyZWN0IGZyb20gXCJmb28uY29tXCIgdG8gZWl0aGVyIFwiZm9vLmNvbVwiIG9yIFwic3ViLmZvby5jb21cIlxuXHRcdFx0XHRcdFx0Ly8gd2lsbCBmb3J3YXJkIHRoZSBzZW5zaXRpdmUgaGVhZGVycywgYnV0IGEgcmVkaXJlY3QgdG8gXCJiYXIuY29tXCIgd2lsbCBub3QuXG5cdFx0XHRcdFx0XHQvLyBoZWFkZXJzIHdpbGwgYWxzbyBiZSBpZ25vcmVkIHdoZW4gZm9sbG93aW5nIGEgcmVkaXJlY3QgdG8gYSBkb21haW4gdXNpbmdcblx0XHRcdFx0XHRcdC8vIGEgZGlmZmVyZW50IHByb3RvY29sLiBGb3IgZXhhbXBsZSwgYSByZWRpcmVjdCBmcm9tIFwiaHR0cHM6Ly9mb28uY29tXCIgdG8gXCJodHRwOi8vZm9vLmNvbVwiXG5cdFx0XHRcdFx0XHQvLyB3aWxsIG5vdCBmb3J3YXJkIHRoZSBzZW5zaXRpdmUgaGVhZGVyc1xuXHRcdFx0XHRcdFx0aWYgKCFpc0RvbWFpbk9yU3ViZG9tYWluKHJlcXVlc3QudXJsLCBsb2NhdGlvblVSTCkgfHwgIWlzU2FtZVByb3RvY29sKHJlcXVlc3QudXJsLCBsb2NhdGlvblVSTCkpIHtcblx0XHRcdFx0XHRcdFx0Zm9yIChjb25zdCBuYW1lIG9mIFsnYXV0aG9yaXphdGlvbicsICd3d3ctYXV0aGVudGljYXRlJywgJ2Nvb2tpZScsICdjb29raWUyJ10pIHtcblx0XHRcdFx0XHRcdFx0XHRyZXF1ZXN0T3B0aW9ucy5oZWFkZXJzLmRlbGV0ZShuYW1lKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBIVFRQLXJlZGlyZWN0IGZldGNoIHN0ZXAgOVxuXHRcdFx0XHRcdFx0aWYgKHJlc3BvbnNlXy5zdGF0dXNDb2RlICE9PSAzMDMgJiYgcmVxdWVzdC5ib2R5ICYmIG9wdGlvbnNfLmJvZHkgaW5zdGFuY2VvZiBTdHJlYW0uUmVhZGFibGUpIHtcblx0XHRcdFx0XHRcdFx0cmVqZWN0KG5ldyBGZXRjaEVycm9yKCdDYW5ub3QgZm9sbG93IHJlZGlyZWN0IHdpdGggYm9keSBiZWluZyBhIHJlYWRhYmxlIHN0cmVhbScsICd1bnN1cHBvcnRlZC1yZWRpcmVjdCcpKTtcblx0XHRcdFx0XHRcdFx0ZmluYWxpemUoKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBIVFRQLXJlZGlyZWN0IGZldGNoIHN0ZXAgMTFcblx0XHRcdFx0XHRcdGlmIChyZXNwb25zZV8uc3RhdHVzQ29kZSA9PT0gMzAzIHx8ICgocmVzcG9uc2VfLnN0YXR1c0NvZGUgPT09IDMwMSB8fCByZXNwb25zZV8uc3RhdHVzQ29kZSA9PT0gMzAyKSAmJiByZXF1ZXN0Lm1ldGhvZCA9PT0gJ1BPU1QnKSkge1xuXHRcdFx0XHRcdFx0XHRyZXF1ZXN0T3B0aW9ucy5tZXRob2QgPSAnR0VUJztcblx0XHRcdFx0XHRcdFx0cmVxdWVzdE9wdGlvbnMuYm9keSA9IHVuZGVmaW5lZDtcblx0XHRcdFx0XHRcdFx0cmVxdWVzdE9wdGlvbnMuaGVhZGVycy5kZWxldGUoJ2NvbnRlbnQtbGVuZ3RoJyk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIEhUVFAtcmVkaXJlY3QgZmV0Y2ggc3RlcCAxNFxuXHRcdFx0XHRcdFx0Y29uc3QgcmVzcG9uc2VSZWZlcnJlclBvbGljeSA9IHBhcnNlUmVmZXJyZXJQb2xpY3lGcm9tSGVhZGVyKGhlYWRlcnMpO1xuXHRcdFx0XHRcdFx0aWYgKHJlc3BvbnNlUmVmZXJyZXJQb2xpY3kpIHtcblx0XHRcdFx0XHRcdFx0cmVxdWVzdE9wdGlvbnMucmVmZXJyZXJQb2xpY3kgPSByZXNwb25zZVJlZmVycmVyUG9saWN5O1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBIVFRQLXJlZGlyZWN0IGZldGNoIHN0ZXAgMTVcblx0XHRcdFx0XHRcdHJlc29sdmUoZmV0Y2gobmV3IFJlcXVlc3QobG9jYXRpb25VUkwsIHJlcXVlc3RPcHRpb25zKSkpO1xuXHRcdFx0XHRcdFx0ZmluYWxpemUoKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0cmV0dXJuIHJlamVjdChuZXcgVHlwZUVycm9yKGBSZWRpcmVjdCBvcHRpb24gJyR7cmVxdWVzdC5yZWRpcmVjdH0nIGlzIG5vdCBhIHZhbGlkIHZhbHVlIG9mIFJlcXVlc3RSZWRpcmVjdGApKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBQcmVwYXJlIHJlc3BvbnNlXG5cdFx0XHRpZiAoc2lnbmFsKSB7XG5cdFx0XHRcdHJlc3BvbnNlXy5vbmNlKCdlbmQnLCAoKSA9PiB7XG5cdFx0XHRcdFx0c2lnbmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Fib3J0JywgYWJvcnRBbmRGaW5hbGl6ZSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgYm9keSA9IHB1bXAocmVzcG9uc2VfLCBuZXcgUGFzc1Rocm91Z2goKSwgZXJyb3IgPT4ge1xuXHRcdFx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdFx0XHRyZWplY3QoZXJyb3IpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vbm9kZWpzL25vZGUvcHVsbC8yOTM3NlxuXHRcdFx0LyogYzggaWdub3JlIG5leHQgMyAqL1xuXHRcdFx0aWYgKHByb2Nlc3MudmVyc2lvbiA8ICd2MTIuMTAnKSB7XG5cdFx0XHRcdHJlc3BvbnNlXy5vbignYWJvcnRlZCcsIGFib3J0QW5kRmluYWxpemUpO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCByZXNwb25zZU9wdGlvbnMgPSB7XG5cdFx0XHRcdHVybDogcmVxdWVzdC51cmwsXG5cdFx0XHRcdHN0YXR1czogcmVzcG9uc2VfLnN0YXR1c0NvZGUsXG5cdFx0XHRcdHN0YXR1c1RleHQ6IHJlc3BvbnNlXy5zdGF0dXNNZXNzYWdlLFxuXHRcdFx0XHRoZWFkZXJzLFxuXHRcdFx0XHRzaXplOiByZXF1ZXN0LnNpemUsXG5cdFx0XHRcdGNvdW50ZXI6IHJlcXVlc3QuY291bnRlcixcblx0XHRcdFx0aGlnaFdhdGVyTWFyazogcmVxdWVzdC5oaWdoV2F0ZXJNYXJrXG5cdFx0XHR9O1xuXG5cdFx0XHQvLyBIVFRQLW5ldHdvcmsgZmV0Y2ggc3RlcCAxMi4xLjEuM1xuXHRcdFx0Y29uc3QgY29kaW5ncyA9IGhlYWRlcnMuZ2V0KCdDb250ZW50LUVuY29kaW5nJyk7XG5cblx0XHRcdC8vIEhUVFAtbmV0d29yayBmZXRjaCBzdGVwIDEyLjEuMS40OiBoYW5kbGUgY29udGVudCBjb2RpbmdzXG5cblx0XHRcdC8vIGluIGZvbGxvd2luZyBzY2VuYXJpb3Mgd2UgaWdub3JlIGNvbXByZXNzaW9uIHN1cHBvcnRcblx0XHRcdC8vIDEuIGNvbXByZXNzaW9uIHN1cHBvcnQgaXMgZGlzYWJsZWRcblx0XHRcdC8vIDIuIEhFQUQgcmVxdWVzdFxuXHRcdFx0Ly8gMy4gbm8gQ29udGVudC1FbmNvZGluZyBoZWFkZXJcblx0XHRcdC8vIDQuIG5vIGNvbnRlbnQgcmVzcG9uc2UgKDIwNClcblx0XHRcdC8vIDUuIGNvbnRlbnQgbm90IG1vZGlmaWVkIHJlc3BvbnNlICgzMDQpXG5cdFx0XHRpZiAoIXJlcXVlc3QuY29tcHJlc3MgfHwgcmVxdWVzdC5tZXRob2QgPT09ICdIRUFEJyB8fCBjb2RpbmdzID09PSBudWxsIHx8IHJlc3BvbnNlXy5zdGF0dXNDb2RlID09PSAyMDQgfHwgcmVzcG9uc2VfLnN0YXR1c0NvZGUgPT09IDMwNCkge1xuXHRcdFx0XHRyZXNwb25zZSA9IG5ldyBSZXNwb25zZShib2R5LCByZXNwb25zZU9wdGlvbnMpO1xuXHRcdFx0XHRyZXNvbHZlKHJlc3BvbnNlKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBGb3IgTm9kZSB2Nitcblx0XHRcdC8vIEJlIGxlc3Mgc3RyaWN0IHdoZW4gZGVjb2RpbmcgY29tcHJlc3NlZCByZXNwb25zZXMsIHNpbmNlIHNvbWV0aW1lc1xuXHRcdFx0Ly8gc2VydmVycyBzZW5kIHNsaWdodGx5IGludmFsaWQgcmVzcG9uc2VzIHRoYXQgYXJlIHN0aWxsIGFjY2VwdGVkXG5cdFx0XHQvLyBieSBjb21tb24gYnJvd3NlcnMuXG5cdFx0XHQvLyBBbHdheXMgdXNpbmcgWl9TWU5DX0ZMVVNIIGlzIHdoYXQgY1VSTCBkb2VzLlxuXHRcdFx0Y29uc3QgemxpYk9wdGlvbnMgPSB7XG5cdFx0XHRcdGZsdXNoOiB6bGliLlpfU1lOQ19GTFVTSCxcblx0XHRcdFx0ZmluaXNoRmx1c2g6IHpsaWIuWl9TWU5DX0ZMVVNIXG5cdFx0XHR9O1xuXG5cdFx0XHQvLyBGb3IgZ3ppcFxuXHRcdFx0aWYgKGNvZGluZ3MgPT09ICdnemlwJyB8fCBjb2RpbmdzID09PSAneC1nemlwJykge1xuXHRcdFx0XHRib2R5ID0gcHVtcChib2R5LCB6bGliLmNyZWF0ZUd1bnppcCh6bGliT3B0aW9ucyksIGVycm9yID0+IHtcblx0XHRcdFx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdFx0XHRcdHJlamVjdChlcnJvcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0cmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UoYm9keSwgcmVzcG9uc2VPcHRpb25zKTtcblx0XHRcdFx0cmVzb2x2ZShyZXNwb25zZSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gRm9yIGRlZmxhdGVcblx0XHRcdGlmIChjb2RpbmdzID09PSAnZGVmbGF0ZScgfHwgY29kaW5ncyA9PT0gJ3gtZGVmbGF0ZScpIHtcblx0XHRcdFx0Ly8gSGFuZGxlIHRoZSBpbmZhbW91cyByYXcgZGVmbGF0ZSByZXNwb25zZSBmcm9tIG9sZCBzZXJ2ZXJzXG5cdFx0XHRcdC8vIGEgaGFjayBmb3Igb2xkIElJUyBhbmQgQXBhY2hlIHNlcnZlcnNcblx0XHRcdFx0Y29uc3QgcmF3ID0gcHVtcChyZXNwb25zZV8sIG5ldyBQYXNzVGhyb3VnaCgpLCBlcnJvciA9PiB7XG5cdFx0XHRcdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRcdFx0XHRyZWplY3QoZXJyb3IpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdHJhdy5vbmNlKCdkYXRhJywgY2h1bmsgPT4ge1xuXHRcdFx0XHRcdC8vIFNlZSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzM3NTE5ODI4XG5cdFx0XHRcdFx0aWYgKChjaHVua1swXSAmIDB4MEYpID09PSAweDA4KSB7XG5cdFx0XHRcdFx0XHRib2R5ID0gcHVtcChib2R5LCB6bGliLmNyZWF0ZUluZmxhdGUoKSwgZXJyb3IgPT4ge1xuXHRcdFx0XHRcdFx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdFx0XHRcdFx0XHRyZWplY3QoZXJyb3IpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ym9keSA9IHB1bXAoYm9keSwgemxpYi5jcmVhdGVJbmZsYXRlUmF3KCksIGVycm9yID0+IHtcblx0XHRcdFx0XHRcdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmVqZWN0KGVycm9yKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UoYm9keSwgcmVzcG9uc2VPcHRpb25zKTtcblx0XHRcdFx0XHRyZXNvbHZlKHJlc3BvbnNlKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHJhdy5vbmNlKCdlbmQnLCAoKSA9PiB7XG5cdFx0XHRcdFx0Ly8gU29tZSBvbGQgSUlTIHNlcnZlcnMgcmV0dXJuIHplcm8tbGVuZ3RoIE9LIGRlZmxhdGUgcmVzcG9uc2VzLCBzb1xuXHRcdFx0XHRcdC8vICdkYXRhJyBpcyBuZXZlciBlbWl0dGVkLiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL25vZGUtZmV0Y2gvbm9kZS1mZXRjaC9wdWxsLzkwM1xuXHRcdFx0XHRcdGlmICghcmVzcG9uc2UpIHtcblx0XHRcdFx0XHRcdHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKGJvZHksIHJlc3BvbnNlT3B0aW9ucyk7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKHJlc3BvbnNlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIEZvciBiclxuXHRcdFx0aWYgKGNvZGluZ3MgPT09ICdicicpIHtcblx0XHRcdFx0Ym9keSA9IHB1bXAoYm9keSwgemxpYi5jcmVhdGVCcm90bGlEZWNvbXByZXNzKCksIGVycm9yID0+IHtcblx0XHRcdFx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdFx0XHRcdHJlamVjdChlcnJvcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0cmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UoYm9keSwgcmVzcG9uc2VPcHRpb25zKTtcblx0XHRcdFx0cmVzb2x2ZShyZXNwb25zZSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gT3RoZXJ3aXNlLCB1c2UgcmVzcG9uc2UgYXMtaXNcblx0XHRcdHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKGJvZHksIHJlc3BvbnNlT3B0aW9ucyk7XG5cdFx0XHRyZXNvbHZlKHJlc3BvbnNlKTtcblx0XHR9KTtcblxuXHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBwcm9taXNlL3ByZWZlci1hd2FpdC10by10aGVuXG5cdFx0d3JpdGVUb1N0cmVhbShyZXF1ZXN0XywgcmVxdWVzdCkuY2F0Y2gocmVqZWN0KTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIGZpeFJlc3BvbnNlQ2h1bmtlZFRyYW5zZmVyQmFkRW5kaW5nKHJlcXVlc3QsIGVycm9yQ2FsbGJhY2spIHtcblx0Y29uc3QgTEFTVF9DSFVOSyA9IEJ1ZmZlci5mcm9tKCcwXFxyXFxuXFxyXFxuJyk7XG5cblx0bGV0IGlzQ2h1bmtlZFRyYW5zZmVyID0gZmFsc2U7XG5cdGxldCBwcm9wZXJMYXN0Q2h1bmtSZWNlaXZlZCA9IGZhbHNlO1xuXHRsZXQgcHJldmlvdXNDaHVuaztcblxuXHRyZXF1ZXN0Lm9uKCdyZXNwb25zZScsIHJlc3BvbnNlID0+IHtcblx0XHRjb25zdCB7aGVhZGVyc30gPSByZXNwb25zZTtcblx0XHRpc0NodW5rZWRUcmFuc2ZlciA9IGhlYWRlcnNbJ3RyYW5zZmVyLWVuY29kaW5nJ10gPT09ICdjaHVua2VkJyAmJiAhaGVhZGVyc1snY29udGVudC1sZW5ndGgnXTtcblx0fSk7XG5cblx0cmVxdWVzdC5vbignc29ja2V0Jywgc29ja2V0ID0+IHtcblx0XHRjb25zdCBvblNvY2tldENsb3NlID0gKCkgPT4ge1xuXHRcdFx0aWYgKGlzQ2h1bmtlZFRyYW5zZmVyICYmICFwcm9wZXJMYXN0Q2h1bmtSZWNlaXZlZCkge1xuXHRcdFx0XHRjb25zdCBlcnJvciA9IG5ldyBFcnJvcignUHJlbWF0dXJlIGNsb3NlJyk7XG5cdFx0XHRcdGVycm9yLmNvZGUgPSAnRVJSX1NUUkVBTV9QUkVNQVRVUkVfQ0xPU0UnO1xuXHRcdFx0XHRlcnJvckNhbGxiYWNrKGVycm9yKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0Y29uc3Qgb25EYXRhID0gYnVmID0+IHtcblx0XHRcdHByb3Blckxhc3RDaHVua1JlY2VpdmVkID0gQnVmZmVyLmNvbXBhcmUoYnVmLnNsaWNlKC01KSwgTEFTVF9DSFVOSykgPT09IDA7XG5cblx0XHRcdC8vIFNvbWV0aW1lcyBmaW5hbCAwLWxlbmd0aCBjaHVuayBhbmQgZW5kIG9mIG1lc3NhZ2UgY29kZSBhcmUgaW4gc2VwYXJhdGUgcGFja2V0c1xuXHRcdFx0aWYgKCFwcm9wZXJMYXN0Q2h1bmtSZWNlaXZlZCAmJiBwcmV2aW91c0NodW5rKSB7XG5cdFx0XHRcdHByb3Blckxhc3RDaHVua1JlY2VpdmVkID0gKFxuXHRcdFx0XHRcdEJ1ZmZlci5jb21wYXJlKHByZXZpb3VzQ2h1bmsuc2xpY2UoLTMpLCBMQVNUX0NIVU5LLnNsaWNlKDAsIDMpKSA9PT0gMCAmJlxuXHRcdFx0XHRcdEJ1ZmZlci5jb21wYXJlKGJ1Zi5zbGljZSgtMiksIExBU1RfQ0hVTksuc2xpY2UoMykpID09PSAwXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cblx0XHRcdHByZXZpb3VzQ2h1bmsgPSBidWY7XG5cdFx0fTtcblxuXHRcdHNvY2tldC5wcmVwZW5kTGlzdGVuZXIoJ2Nsb3NlJywgb25Tb2NrZXRDbG9zZSk7XG5cdFx0c29ja2V0Lm9uKCdkYXRhJywgb25EYXRhKTtcblxuXHRcdHJlcXVlc3Qub24oJ2Nsb3NlJywgKCkgPT4ge1xuXHRcdFx0c29ja2V0LnJlbW92ZUxpc3RlbmVyKCdjbG9zZScsIG9uU29ja2V0Q2xvc2UpO1xuXHRcdFx0c29ja2V0LnJlbW92ZUxpc3RlbmVyKCdkYXRhJywgb25EYXRhKTtcblx0XHR9KTtcblx0fSk7XG59XG4iLCAiZXhwb3J0IGludGVyZmFjZSBNaW1lQnVmZmVyIGV4dGVuZHMgQnVmZmVyIHtcblx0dHlwZTogc3RyaW5nO1xuXHR0eXBlRnVsbDogc3RyaW5nO1xuXHRjaGFyc2V0OiBzdHJpbmc7XG59XG5cbi8qKlxuICogUmV0dXJucyBhIGBCdWZmZXJgIGluc3RhbmNlIGZyb20gdGhlIGdpdmVuIGRhdGEgVVJJIGB1cmlgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmkgRGF0YSBVUkkgdG8gdHVybiBpbnRvIGEgQnVmZmVyIGluc3RhbmNlXG4gKiBAcmV0dXJucyB7QnVmZmVyfSBCdWZmZXIgaW5zdGFuY2UgZnJvbSBEYXRhIFVSSVxuICogQGFwaSBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRhdGFVcmlUb0J1ZmZlcih1cmk6IHN0cmluZyk6IE1pbWVCdWZmZXIge1xuXHRpZiAoIS9eZGF0YTovaS50ZXN0KHVyaSkpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKFxuXHRcdFx0J2B1cmlgIGRvZXMgbm90IGFwcGVhciB0byBiZSBhIERhdGEgVVJJIChtdXN0IGJlZ2luIHdpdGggXCJkYXRhOlwiKSdcblx0XHQpO1xuXHR9XG5cblx0Ly8gc3RyaXAgbmV3bGluZXNcblx0dXJpID0gdXJpLnJlcGxhY2UoL1xccj9cXG4vZywgJycpO1xuXG5cdC8vIHNwbGl0IHRoZSBVUkkgdXAgaW50byB0aGUgXCJtZXRhZGF0YVwiIGFuZCB0aGUgXCJkYXRhXCIgcG9ydGlvbnNcblx0Y29uc3QgZmlyc3RDb21tYSA9IHVyaS5pbmRleE9mKCcsJyk7XG5cdGlmIChmaXJzdENvbW1hID09PSAtMSB8fCBmaXJzdENvbW1hIDw9IDQpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdtYWxmb3JtZWQgZGF0YTogVVJJJyk7XG5cdH1cblxuXHQvLyByZW1vdmUgdGhlIFwiZGF0YTpcIiBzY2hlbWUgYW5kIHBhcnNlIHRoZSBtZXRhZGF0YVxuXHRjb25zdCBtZXRhID0gdXJpLnN1YnN0cmluZyg1LCBmaXJzdENvbW1hKS5zcGxpdCgnOycpO1xuXG5cdGxldCBjaGFyc2V0ID0gJyc7XG5cdGxldCBiYXNlNjQgPSBmYWxzZTtcblx0Y29uc3QgdHlwZSA9IG1ldGFbMF0gfHwgJ3RleHQvcGxhaW4nO1xuXHRsZXQgdHlwZUZ1bGwgPSB0eXBlO1xuXHRmb3IgKGxldCBpID0gMTsgaSA8IG1ldGEubGVuZ3RoOyBpKyspIHtcblx0XHRpZiAobWV0YVtpXSA9PT0gJ2Jhc2U2NCcpIHtcblx0XHRcdGJhc2U2NCA9IHRydWU7XG5cdFx0fSBlbHNlIGlmKG1ldGFbaV0pIHtcblx0XHRcdHR5cGVGdWxsICs9IGA7JHsgIG1ldGFbaV19YDtcblx0XHRcdGlmIChtZXRhW2ldLmluZGV4T2YoJ2NoYXJzZXQ9JykgPT09IDApIHtcblx0XHRcdFx0Y2hhcnNldCA9IG1ldGFbaV0uc3Vic3RyaW5nKDgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHQvLyBkZWZhdWx0cyB0byBVUy1BU0NJSSBvbmx5IGlmIHR5cGUgaXMgbm90IHByb3ZpZGVkXG5cdGlmICghbWV0YVswXSAmJiAhY2hhcnNldC5sZW5ndGgpIHtcblx0XHR0eXBlRnVsbCArPSAnO2NoYXJzZXQ9VVMtQVNDSUknO1xuXHRcdGNoYXJzZXQgPSAnVVMtQVNDSUknO1xuXHR9XG5cblx0Ly8gZ2V0IHRoZSBlbmNvZGVkIGRhdGEgcG9ydGlvbiBhbmQgZGVjb2RlIFVSSS1lbmNvZGVkIGNoYXJzXG5cdGNvbnN0IGVuY29kaW5nID0gYmFzZTY0ID8gJ2Jhc2U2NCcgOiAnYXNjaWknO1xuXHRjb25zdCBkYXRhID0gdW5lc2NhcGUodXJpLnN1YnN0cmluZyhmaXJzdENvbW1hICsgMSkpO1xuXHRjb25zdCBidWZmZXIgPSBCdWZmZXIuZnJvbShkYXRhLCBlbmNvZGluZykgYXMgTWltZUJ1ZmZlcjtcblxuXHQvLyBzZXQgYC50eXBlYCBhbmQgYC50eXBlRnVsbGAgcHJvcGVydGllcyB0byBNSU1FIHR5cGVcblx0YnVmZmVyLnR5cGUgPSB0eXBlO1xuXHRidWZmZXIudHlwZUZ1bGwgPSB0eXBlRnVsbDtcblxuXHQvLyBzZXQgdGhlIGAuY2hhcnNldGAgcHJvcGVydHlcblx0YnVmZmVyLmNoYXJzZXQgPSBjaGFyc2V0O1xuXG5cdHJldHVybiBidWZmZXI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGRhdGFVcmlUb0J1ZmZlcjtcbiIsICJcbi8qKlxuICogQm9keS5qc1xuICpcbiAqIEJvZHkgaW50ZXJmYWNlIHByb3ZpZGVzIGNvbW1vbiBtZXRob2RzIGZvciBSZXF1ZXN0IGFuZCBSZXNwb25zZVxuICovXG5cbmltcG9ydCBTdHJlYW0sIHtQYXNzVGhyb3VnaH0gZnJvbSAnbm9kZTpzdHJlYW0nO1xuaW1wb3J0IHt0eXBlcywgZGVwcmVjYXRlLCBwcm9taXNpZnl9IGZyb20gJ25vZGU6dXRpbCc7XG5pbXBvcnQge0J1ZmZlcn0gZnJvbSAnbm9kZTpidWZmZXInO1xuXG5pbXBvcnQgQmxvYiBmcm9tICdmZXRjaC1ibG9iJztcbmltcG9ydCB7Rm9ybURhdGEsIGZvcm1EYXRhVG9CbG9ifSBmcm9tICdmb3JtZGF0YS1wb2x5ZmlsbC9lc20ubWluLmpzJztcblxuaW1wb3J0IHtGZXRjaEVycm9yfSBmcm9tICcuL2Vycm9ycy9mZXRjaC1lcnJvci5qcyc7XG5pbXBvcnQge0ZldGNoQmFzZUVycm9yfSBmcm9tICcuL2Vycm9ycy9iYXNlLmpzJztcbmltcG9ydCB7aXNCbG9iLCBpc1VSTFNlYXJjaFBhcmFtZXRlcnN9IGZyb20gJy4vdXRpbHMvaXMuanMnO1xuXG5jb25zdCBwaXBlbGluZSA9IHByb21pc2lmeShTdHJlYW0ucGlwZWxpbmUpO1xuY29uc3QgSU5URVJOQUxTID0gU3ltYm9sKCdCb2R5IGludGVybmFscycpO1xuXG4vKipcbiAqIEJvZHkgbWl4aW5cbiAqXG4gKiBSZWY6IGh0dHBzOi8vZmV0Y2guc3BlYy53aGF0d2cub3JnLyNib2R5XG4gKlxuICogQHBhcmFtICAgU3RyZWFtICBib2R5ICBSZWFkYWJsZSBzdHJlYW1cbiAqIEBwYXJhbSAgIE9iamVjdCAgb3B0cyAgUmVzcG9uc2Ugb3B0aW9uc1xuICogQHJldHVybiAgVm9pZFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCb2R5IHtcblx0Y29uc3RydWN0b3IoYm9keSwge1xuXHRcdHNpemUgPSAwXG5cdH0gPSB7fSkge1xuXHRcdGxldCBib3VuZGFyeSA9IG51bGw7XG5cblx0XHRpZiAoYm9keSA9PT0gbnVsbCkge1xuXHRcdFx0Ly8gQm9keSBpcyB1bmRlZmluZWQgb3IgbnVsbFxuXHRcdFx0Ym9keSA9IG51bGw7XG5cdFx0fSBlbHNlIGlmIChpc1VSTFNlYXJjaFBhcmFtZXRlcnMoYm9keSkpIHtcblx0XHRcdC8vIEJvZHkgaXMgYSBVUkxTZWFyY2hQYXJhbXNcblx0XHRcdGJvZHkgPSBCdWZmZXIuZnJvbShib2R5LnRvU3RyaW5nKCkpO1xuXHRcdH0gZWxzZSBpZiAoaXNCbG9iKGJvZHkpKSB7XG5cdFx0XHQvLyBCb2R5IGlzIGJsb2Jcblx0XHR9IGVsc2UgaWYgKEJ1ZmZlci5pc0J1ZmZlcihib2R5KSkge1xuXHRcdFx0Ly8gQm9keSBpcyBCdWZmZXJcblx0XHR9IGVsc2UgaWYgKHR5cGVzLmlzQW55QXJyYXlCdWZmZXIoYm9keSkpIHtcblx0XHRcdC8vIEJvZHkgaXMgQXJyYXlCdWZmZXJcblx0XHRcdGJvZHkgPSBCdWZmZXIuZnJvbShib2R5KTtcblx0XHR9IGVsc2UgaWYgKEFycmF5QnVmZmVyLmlzVmlldyhib2R5KSkge1xuXHRcdFx0Ly8gQm9keSBpcyBBcnJheUJ1ZmZlclZpZXdcblx0XHRcdGJvZHkgPSBCdWZmZXIuZnJvbShib2R5LmJ1ZmZlciwgYm9keS5ieXRlT2Zmc2V0LCBib2R5LmJ5dGVMZW5ndGgpO1xuXHRcdH0gZWxzZSBpZiAoYm9keSBpbnN0YW5jZW9mIFN0cmVhbSkge1xuXHRcdFx0Ly8gQm9keSBpcyBzdHJlYW1cblx0XHR9IGVsc2UgaWYgKGJvZHkgaW5zdGFuY2VvZiBGb3JtRGF0YSkge1xuXHRcdFx0Ly8gQm9keSBpcyBGb3JtRGF0YVxuXHRcdFx0Ym9keSA9IGZvcm1EYXRhVG9CbG9iKGJvZHkpO1xuXHRcdFx0Ym91bmRhcnkgPSBib2R5LnR5cGUuc3BsaXQoJz0nKVsxXTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gTm9uZSBvZiB0aGUgYWJvdmVcblx0XHRcdC8vIGNvZXJjZSB0byBzdHJpbmcgdGhlbiBidWZmZXJcblx0XHRcdGJvZHkgPSBCdWZmZXIuZnJvbShTdHJpbmcoYm9keSkpO1xuXHRcdH1cblxuXHRcdGxldCBzdHJlYW0gPSBib2R5O1xuXG5cdFx0aWYgKEJ1ZmZlci5pc0J1ZmZlcihib2R5KSkge1xuXHRcdFx0c3RyZWFtID0gU3RyZWFtLlJlYWRhYmxlLmZyb20oYm9keSk7XG5cdFx0fSBlbHNlIGlmIChpc0Jsb2IoYm9keSkpIHtcblx0XHRcdHN0cmVhbSA9IFN0cmVhbS5SZWFkYWJsZS5mcm9tKGJvZHkuc3RyZWFtKCkpO1xuXHRcdH1cblxuXHRcdHRoaXNbSU5URVJOQUxTXSA9IHtcblx0XHRcdGJvZHksXG5cdFx0XHRzdHJlYW0sXG5cdFx0XHRib3VuZGFyeSxcblx0XHRcdGRpc3R1cmJlZDogZmFsc2UsXG5cdFx0XHRlcnJvcjogbnVsbFxuXHRcdH07XG5cdFx0dGhpcy5zaXplID0gc2l6ZTtcblxuXHRcdGlmIChib2R5IGluc3RhbmNlb2YgU3RyZWFtKSB7XG5cdFx0XHRib2R5Lm9uKCdlcnJvcicsIGVycm9yXyA9PiB7XG5cdFx0XHRcdGNvbnN0IGVycm9yID0gZXJyb3JfIGluc3RhbmNlb2YgRmV0Y2hCYXNlRXJyb3IgP1xuXHRcdFx0XHRcdGVycm9yXyA6XG5cdFx0XHRcdFx0bmV3IEZldGNoRXJyb3IoYEludmFsaWQgcmVzcG9uc2UgYm9keSB3aGlsZSB0cnlpbmcgdG8gZmV0Y2ggJHt0aGlzLnVybH06ICR7ZXJyb3JfLm1lc3NhZ2V9YCwgJ3N5c3RlbScsIGVycm9yXyk7XG5cdFx0XHRcdHRoaXNbSU5URVJOQUxTXS5lcnJvciA9IGVycm9yO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0Z2V0IGJvZHkoKSB7XG5cdFx0cmV0dXJuIHRoaXNbSU5URVJOQUxTXS5zdHJlYW07XG5cdH1cblxuXHRnZXQgYm9keVVzZWQoKSB7XG5cdFx0cmV0dXJuIHRoaXNbSU5URVJOQUxTXS5kaXN0dXJiZWQ7XG5cdH1cblxuXHQvKipcblx0ICogRGVjb2RlIHJlc3BvbnNlIGFzIEFycmF5QnVmZmVyXG5cdCAqXG5cdCAqIEByZXR1cm4gIFByb21pc2Vcblx0ICovXG5cdGFzeW5jIGFycmF5QnVmZmVyKCkge1xuXHRcdGNvbnN0IHtidWZmZXIsIGJ5dGVPZmZzZXQsIGJ5dGVMZW5ndGh9ID0gYXdhaXQgY29uc3VtZUJvZHkodGhpcyk7XG5cdFx0cmV0dXJuIGJ1ZmZlci5zbGljZShieXRlT2Zmc2V0LCBieXRlT2Zmc2V0ICsgYnl0ZUxlbmd0aCk7XG5cdH1cblxuXHRhc3luYyBmb3JtRGF0YSgpIHtcblx0XHRjb25zdCBjdCA9IHRoaXMuaGVhZGVycy5nZXQoJ2NvbnRlbnQtdHlwZScpO1xuXG5cdFx0aWYgKGN0LnN0YXJ0c1dpdGgoJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpKSB7XG5cdFx0XHRjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuXHRcdFx0Y29uc3QgcGFyYW1ldGVycyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoYXdhaXQgdGhpcy50ZXh0KCkpO1xuXG5cdFx0XHRmb3IgKGNvbnN0IFtuYW1lLCB2YWx1ZV0gb2YgcGFyYW1ldGVycykge1xuXHRcdFx0XHRmb3JtRGF0YS5hcHBlbmQobmFtZSwgdmFsdWUpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZm9ybURhdGE7XG5cdFx0fVxuXG5cdFx0Y29uc3Qge3RvRm9ybURhdGF9ID0gYXdhaXQgaW1wb3J0KCcuL3V0aWxzL211bHRpcGFydC1wYXJzZXIuanMnKTtcblx0XHRyZXR1cm4gdG9Gb3JtRGF0YSh0aGlzLmJvZHksIGN0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm4gcmF3IHJlc3BvbnNlIGFzIEJsb2Jcblx0ICpcblx0ICogQHJldHVybiBQcm9taXNlXG5cdCAqL1xuXHRhc3luYyBibG9iKCkge1xuXHRcdGNvbnN0IGN0ID0gKHRoaXMuaGVhZGVycyAmJiB0aGlzLmhlYWRlcnMuZ2V0KCdjb250ZW50LXR5cGUnKSkgfHwgKHRoaXNbSU5URVJOQUxTXS5ib2R5ICYmIHRoaXNbSU5URVJOQUxTXS5ib2R5LnR5cGUpIHx8ICcnO1xuXHRcdGNvbnN0IGJ1ZiA9IGF3YWl0IHRoaXMuYXJyYXlCdWZmZXIoKTtcblxuXHRcdHJldHVybiBuZXcgQmxvYihbYnVmXSwge1xuXHRcdFx0dHlwZTogY3Rcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBEZWNvZGUgcmVzcG9uc2UgYXMganNvblxuXHQgKlxuXHQgKiBAcmV0dXJuICBQcm9taXNlXG5cdCAqL1xuXHRhc3luYyBqc29uKCkge1xuXHRcdGNvbnN0IHRleHQgPSBhd2FpdCB0aGlzLnRleHQoKTtcblx0XHRyZXR1cm4gSlNPTi5wYXJzZSh0ZXh0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBEZWNvZGUgcmVzcG9uc2UgYXMgdGV4dFxuXHQgKlxuXHQgKiBAcmV0dXJuICBQcm9taXNlXG5cdCAqL1xuXHRhc3luYyB0ZXh0KCkge1xuXHRcdGNvbnN0IGJ1ZmZlciA9IGF3YWl0IGNvbnN1bWVCb2R5KHRoaXMpO1xuXHRcdHJldHVybiBuZXcgVGV4dERlY29kZXIoKS5kZWNvZGUoYnVmZmVyKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBEZWNvZGUgcmVzcG9uc2UgYXMgYnVmZmVyIChub24tc3BlYyBhcGkpXG5cdCAqXG5cdCAqIEByZXR1cm4gIFByb21pc2Vcblx0ICovXG5cdGJ1ZmZlcigpIHtcblx0XHRyZXR1cm4gY29uc3VtZUJvZHkodGhpcyk7XG5cdH1cbn1cblxuQm9keS5wcm90b3R5cGUuYnVmZmVyID0gZGVwcmVjYXRlKEJvZHkucHJvdG90eXBlLmJ1ZmZlciwgJ1BsZWFzZSB1c2UgXFwncmVzcG9uc2UuYXJyYXlCdWZmZXIoKVxcJyBpbnN0ZWFkIG9mIFxcJ3Jlc3BvbnNlLmJ1ZmZlcigpXFwnJywgJ25vZGUtZmV0Y2gjYnVmZmVyJyk7XG5cbi8vIEluIGJyb3dzZXJzLCBhbGwgcHJvcGVydGllcyBhcmUgZW51bWVyYWJsZS5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKEJvZHkucHJvdG90eXBlLCB7XG5cdGJvZHk6IHtlbnVtZXJhYmxlOiB0cnVlfSxcblx0Ym9keVVzZWQ6IHtlbnVtZXJhYmxlOiB0cnVlfSxcblx0YXJyYXlCdWZmZXI6IHtlbnVtZXJhYmxlOiB0cnVlfSxcblx0YmxvYjoge2VudW1lcmFibGU6IHRydWV9LFxuXHRqc29uOiB7ZW51bWVyYWJsZTogdHJ1ZX0sXG5cdHRleHQ6IHtlbnVtZXJhYmxlOiB0cnVlfSxcblx0ZGF0YToge2dldDogZGVwcmVjYXRlKCgpID0+IHt9LFxuXHRcdCdkYXRhIGRvZXNuXFwndCBleGlzdCwgdXNlIGpzb24oKSwgdGV4dCgpLCBhcnJheUJ1ZmZlcigpLCBvciBib2R5IGluc3RlYWQnLFxuXHRcdCdodHRwczovL2dpdGh1Yi5jb20vbm9kZS1mZXRjaC9ub2RlLWZldGNoL2lzc3Vlcy8xMDAwIChyZXNwb25zZSknKX1cbn0pO1xuXG4vKipcbiAqIENvbnN1bWUgYW5kIGNvbnZlcnQgYW4gZW50aXJlIEJvZHkgdG8gYSBCdWZmZXIuXG4gKlxuICogUmVmOiBodHRwczovL2ZldGNoLnNwZWMud2hhdHdnLm9yZy8jY29uY2VwdC1ib2R5LWNvbnN1bWUtYm9keVxuICpcbiAqIEByZXR1cm4gUHJvbWlzZVxuICovXG5hc3luYyBmdW5jdGlvbiBjb25zdW1lQm9keShkYXRhKSB7XG5cdGlmIChkYXRhW0lOVEVSTkFMU10uZGlzdHVyYmVkKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihgYm9keSB1c2VkIGFscmVhZHkgZm9yOiAke2RhdGEudXJsfWApO1xuXHR9XG5cblx0ZGF0YVtJTlRFUk5BTFNdLmRpc3R1cmJlZCA9IHRydWU7XG5cblx0aWYgKGRhdGFbSU5URVJOQUxTXS5lcnJvcikge1xuXHRcdHRocm93IGRhdGFbSU5URVJOQUxTXS5lcnJvcjtcblx0fVxuXG5cdGNvbnN0IHtib2R5fSA9IGRhdGE7XG5cblx0Ly8gQm9keSBpcyBudWxsXG5cdGlmIChib2R5ID09PSBudWxsKSB7XG5cdFx0cmV0dXJuIEJ1ZmZlci5hbGxvYygwKTtcblx0fVxuXG5cdC8qIGM4IGlnbm9yZSBuZXh0IDMgKi9cblx0aWYgKCEoYm9keSBpbnN0YW5jZW9mIFN0cmVhbSkpIHtcblx0XHRyZXR1cm4gQnVmZmVyLmFsbG9jKDApO1xuXHR9XG5cblx0Ly8gQm9keSBpcyBzdHJlYW1cblx0Ly8gZ2V0IHJlYWR5IHRvIGFjdHVhbGx5IGNvbnN1bWUgdGhlIGJvZHlcblx0Y29uc3QgYWNjdW0gPSBbXTtcblx0bGV0IGFjY3VtQnl0ZXMgPSAwO1xuXG5cdHRyeSB7XG5cdFx0Zm9yIGF3YWl0IChjb25zdCBjaHVuayBvZiBib2R5KSB7XG5cdFx0XHRpZiAoZGF0YS5zaXplID4gMCAmJiBhY2N1bUJ5dGVzICsgY2h1bmsubGVuZ3RoID4gZGF0YS5zaXplKSB7XG5cdFx0XHRcdGNvbnN0IGVycm9yID0gbmV3IEZldGNoRXJyb3IoYGNvbnRlbnQgc2l6ZSBhdCAke2RhdGEudXJsfSBvdmVyIGxpbWl0OiAke2RhdGEuc2l6ZX1gLCAnbWF4LXNpemUnKTtcblx0XHRcdFx0Ym9keS5kZXN0cm95KGVycm9yKTtcblx0XHRcdFx0dGhyb3cgZXJyb3I7XG5cdFx0XHR9XG5cblx0XHRcdGFjY3VtQnl0ZXMgKz0gY2h1bmsubGVuZ3RoO1xuXHRcdFx0YWNjdW0ucHVzaChjaHVuayk7XG5cdFx0fVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnN0IGVycm9yXyA9IGVycm9yIGluc3RhbmNlb2YgRmV0Y2hCYXNlRXJyb3IgPyBlcnJvciA6IG5ldyBGZXRjaEVycm9yKGBJbnZhbGlkIHJlc3BvbnNlIGJvZHkgd2hpbGUgdHJ5aW5nIHRvIGZldGNoICR7ZGF0YS51cmx9OiAke2Vycm9yLm1lc3NhZ2V9YCwgJ3N5c3RlbScsIGVycm9yKTtcblx0XHR0aHJvdyBlcnJvcl87XG5cdH1cblxuXHRpZiAoYm9keS5yZWFkYWJsZUVuZGVkID09PSB0cnVlIHx8IGJvZHkuX3JlYWRhYmxlU3RhdGUuZW5kZWQgPT09IHRydWUpIHtcblx0XHR0cnkge1xuXHRcdFx0aWYgKGFjY3VtLmV2ZXJ5KGMgPT4gdHlwZW9mIGMgPT09ICdzdHJpbmcnKSkge1xuXHRcdFx0XHRyZXR1cm4gQnVmZmVyLmZyb20oYWNjdW0uam9pbignJykpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gQnVmZmVyLmNvbmNhdChhY2N1bSwgYWNjdW1CeXRlcyk7XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdHRocm93IG5ldyBGZXRjaEVycm9yKGBDb3VsZCBub3QgY3JlYXRlIEJ1ZmZlciBmcm9tIHJlc3BvbnNlIGJvZHkgZm9yICR7ZGF0YS51cmx9OiAke2Vycm9yLm1lc3NhZ2V9YCwgJ3N5c3RlbScsIGVycm9yKTtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0dGhyb3cgbmV3IEZldGNoRXJyb3IoYFByZW1hdHVyZSBjbG9zZSBvZiBzZXJ2ZXIgcmVzcG9uc2Ugd2hpbGUgdHJ5aW5nIHRvIGZldGNoICR7ZGF0YS51cmx9YCk7XG5cdH1cbn1cblxuLyoqXG4gKiBDbG9uZSBib2R5IGdpdmVuIFJlcy9SZXEgaW5zdGFuY2VcbiAqXG4gKiBAcGFyYW0gICBNaXhlZCAgIGluc3RhbmNlICAgICAgIFJlc3BvbnNlIG9yIFJlcXVlc3QgaW5zdGFuY2VcbiAqIEBwYXJhbSAgIFN0cmluZyAgaGlnaFdhdGVyTWFyayAgaGlnaFdhdGVyTWFyayBmb3IgYm90aCBQYXNzVGhyb3VnaCBib2R5IHN0cmVhbXNcbiAqIEByZXR1cm4gIE1peGVkXG4gKi9cbmV4cG9ydCBjb25zdCBjbG9uZSA9IChpbnN0YW5jZSwgaGlnaFdhdGVyTWFyaykgPT4ge1xuXHRsZXQgcDE7XG5cdGxldCBwMjtcblx0bGV0IHtib2R5fSA9IGluc3RhbmNlW0lOVEVSTkFMU107XG5cblx0Ly8gRG9uJ3QgYWxsb3cgY2xvbmluZyBhIHVzZWQgYm9keVxuXHRpZiAoaW5zdGFuY2UuYm9keVVzZWQpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ2Nhbm5vdCBjbG9uZSBib2R5IGFmdGVyIGl0IGlzIHVzZWQnKTtcblx0fVxuXG5cdC8vIENoZWNrIHRoYXQgYm9keSBpcyBhIHN0cmVhbSBhbmQgbm90IGZvcm0tZGF0YSBvYmplY3Rcblx0Ly8gbm90ZTogd2UgY2FuJ3QgY2xvbmUgdGhlIGZvcm0tZGF0YSBvYmplY3Qgd2l0aG91dCBoYXZpbmcgaXQgYXMgYSBkZXBlbmRlbmN5XG5cdGlmICgoYm9keSBpbnN0YW5jZW9mIFN0cmVhbSkgJiYgKHR5cGVvZiBib2R5LmdldEJvdW5kYXJ5ICE9PSAnZnVuY3Rpb24nKSkge1xuXHRcdC8vIFRlZSBpbnN0YW5jZSBib2R5XG5cdFx0cDEgPSBuZXcgUGFzc1Rocm91Z2goe2hpZ2hXYXRlck1hcmt9KTtcblx0XHRwMiA9IG5ldyBQYXNzVGhyb3VnaCh7aGlnaFdhdGVyTWFya30pO1xuXHRcdGJvZHkucGlwZShwMSk7XG5cdFx0Ym9keS5waXBlKHAyKTtcblx0XHQvLyBTZXQgaW5zdGFuY2UgYm9keSB0byB0ZWVkIGJvZHkgYW5kIHJldHVybiB0aGUgb3RoZXIgdGVlZCBib2R5XG5cdFx0aW5zdGFuY2VbSU5URVJOQUxTXS5zdHJlYW0gPSBwMTtcblx0XHRib2R5ID0gcDI7XG5cdH1cblxuXHRyZXR1cm4gYm9keTtcbn07XG5cbmNvbnN0IGdldE5vblNwZWNGb3JtRGF0YUJvdW5kYXJ5ID0gZGVwcmVjYXRlKFxuXHRib2R5ID0+IGJvZHkuZ2V0Qm91bmRhcnkoKSxcblx0J2Zvcm0tZGF0YSBkb2VzblxcJ3QgZm9sbG93IHRoZSBzcGVjIGFuZCByZXF1aXJlcyBzcGVjaWFsIHRyZWF0bWVudC4gVXNlIGFsdGVybmF0aXZlIHBhY2thZ2UnLFxuXHQnaHR0cHM6Ly9naXRodWIuY29tL25vZGUtZmV0Y2gvbm9kZS1mZXRjaC9pc3N1ZXMvMTE2Nydcbik7XG5cbi8qKlxuICogUGVyZm9ybXMgdGhlIG9wZXJhdGlvbiBcImV4dHJhY3QgYSBgQ29udGVudC1UeXBlYCB2YWx1ZSBmcm9tIHxvYmplY3R8XCIgYXNcbiAqIHNwZWNpZmllZCBpbiB0aGUgc3BlY2lmaWNhdGlvbjpcbiAqIGh0dHBzOi8vZmV0Y2guc3BlYy53aGF0d2cub3JnLyNjb25jZXB0LWJvZHlpbml0LWV4dHJhY3RcbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIGFzc3VtZXMgdGhhdCBpbnN0YW5jZS5ib2R5IGlzIHByZXNlbnQuXG4gKlxuICogQHBhcmFtIHthbnl9IGJvZHkgQW55IG9wdGlvbnMuYm9keSBpbnB1dFxuICogQHJldHVybnMge3N0cmluZyB8IG51bGx9XG4gKi9cbmV4cG9ydCBjb25zdCBleHRyYWN0Q29udGVudFR5cGUgPSAoYm9keSwgcmVxdWVzdCkgPT4ge1xuXHQvLyBCb2R5IGlzIG51bGwgb3IgdW5kZWZpbmVkXG5cdGlmIChib2R5ID09PSBudWxsKSB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHQvLyBCb2R5IGlzIHN0cmluZ1xuXHRpZiAodHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnKSB7XG5cdFx0cmV0dXJuICd0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLTgnO1xuXHR9XG5cblx0Ly8gQm9keSBpcyBhIFVSTFNlYXJjaFBhcmFtc1xuXHRpZiAoaXNVUkxTZWFyY2hQYXJhbWV0ZXJzKGJvZHkpKSB7XG5cdFx0cmV0dXJuICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7Y2hhcnNldD1VVEYtOCc7XG5cdH1cblxuXHQvLyBCb2R5IGlzIGJsb2Jcblx0aWYgKGlzQmxvYihib2R5KSkge1xuXHRcdHJldHVybiBib2R5LnR5cGUgfHwgbnVsbDtcblx0fVxuXG5cdC8vIEJvZHkgaXMgYSBCdWZmZXIgKEJ1ZmZlciwgQXJyYXlCdWZmZXIgb3IgQXJyYXlCdWZmZXJWaWV3KVxuXHRpZiAoQnVmZmVyLmlzQnVmZmVyKGJvZHkpIHx8IHR5cGVzLmlzQW55QXJyYXlCdWZmZXIoYm9keSkgfHwgQXJyYXlCdWZmZXIuaXNWaWV3KGJvZHkpKSB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHRpZiAoYm9keSBpbnN0YW5jZW9mIEZvcm1EYXRhKSB7XG5cdFx0cmV0dXJuIGBtdWx0aXBhcnQvZm9ybS1kYXRhOyBib3VuZGFyeT0ke3JlcXVlc3RbSU5URVJOQUxTXS5ib3VuZGFyeX1gO1xuXHR9XG5cblx0Ly8gRGV0ZWN0IGZvcm0gZGF0YSBpbnB1dCBmcm9tIGZvcm0tZGF0YSBtb2R1bGVcblx0aWYgKGJvZHkgJiYgdHlwZW9mIGJvZHkuZ2V0Qm91bmRhcnkgPT09ICdmdW5jdGlvbicpIHtcblx0XHRyZXR1cm4gYG11bHRpcGFydC9mb3JtLWRhdGE7Ym91bmRhcnk9JHtnZXROb25TcGVjRm9ybURhdGFCb3VuZGFyeShib2R5KX1gO1xuXHR9XG5cblx0Ly8gQm9keSBpcyBzdHJlYW0gLSBjYW4ndCByZWFsbHkgZG8gbXVjaCBhYm91dCB0aGlzXG5cdGlmIChib2R5IGluc3RhbmNlb2YgU3RyZWFtKSB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHQvLyBCb2R5IGNvbnN0cnVjdG9yIGRlZmF1bHRzIG90aGVyIHRoaW5ncyB0byBzdHJpbmdcblx0cmV0dXJuICd0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLTgnO1xufTtcblxuLyoqXG4gKiBUaGUgRmV0Y2ggU3RhbmRhcmQgdHJlYXRzIHRoaXMgYXMgaWYgXCJ0b3RhbCBieXRlc1wiIGlzIGEgcHJvcGVydHkgb24gdGhlIGJvZHkuXG4gKiBGb3IgdXMsIHdlIGhhdmUgdG8gZXhwbGljaXRseSBnZXQgaXQgd2l0aCBhIGZ1bmN0aW9uLlxuICpcbiAqIHJlZjogaHR0cHM6Ly9mZXRjaC5zcGVjLndoYXR3Zy5vcmcvI2NvbmNlcHQtYm9keS10b3RhbC1ieXRlc1xuICpcbiAqIEBwYXJhbSB7YW55fSBvYmouYm9keSBCb2R5IG9iamVjdCBmcm9tIHRoZSBCb2R5IGluc3RhbmNlLlxuICogQHJldHVybnMge251bWJlciB8IG51bGx9XG4gKi9cbmV4cG9ydCBjb25zdCBnZXRUb3RhbEJ5dGVzID0gcmVxdWVzdCA9PiB7XG5cdGNvbnN0IHtib2R5fSA9IHJlcXVlc3RbSU5URVJOQUxTXTtcblxuXHQvLyBCb2R5IGlzIG51bGwgb3IgdW5kZWZpbmVkXG5cdGlmIChib2R5ID09PSBudWxsKSB7XG5cdFx0cmV0dXJuIDA7XG5cdH1cblxuXHQvLyBCb2R5IGlzIEJsb2Jcblx0aWYgKGlzQmxvYihib2R5KSkge1xuXHRcdHJldHVybiBib2R5LnNpemU7XG5cdH1cblxuXHQvLyBCb2R5IGlzIEJ1ZmZlclxuXHRpZiAoQnVmZmVyLmlzQnVmZmVyKGJvZHkpKSB7XG5cdFx0cmV0dXJuIGJvZHkubGVuZ3RoO1xuXHR9XG5cblx0Ly8gRGV0ZWN0IGZvcm0gZGF0YSBpbnB1dCBmcm9tIGZvcm0tZGF0YSBtb2R1bGVcblx0aWYgKGJvZHkgJiYgdHlwZW9mIGJvZHkuZ2V0TGVuZ3RoU3luYyA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdHJldHVybiBib2R5Lmhhc0tub3duTGVuZ3RoICYmIGJvZHkuaGFzS25vd25MZW5ndGgoKSA/IGJvZHkuZ2V0TGVuZ3RoU3luYygpIDogbnVsbDtcblx0fVxuXG5cdC8vIEJvZHkgaXMgc3RyZWFtXG5cdHJldHVybiBudWxsO1xufTtcblxuLyoqXG4gKiBXcml0ZSBhIEJvZHkgdG8gYSBOb2RlLmpzIFdyaXRhYmxlU3RyZWFtIChlLmcuIGh0dHAuUmVxdWVzdCkgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7U3RyZWFtLldyaXRhYmxlfSBkZXN0IFRoZSBzdHJlYW0gdG8gd3JpdGUgdG8uXG4gKiBAcGFyYW0gb2JqLmJvZHkgQm9keSBvYmplY3QgZnJvbSB0aGUgQm9keSBpbnN0YW5jZS5cbiAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fVxuICovXG5leHBvcnQgY29uc3Qgd3JpdGVUb1N0cmVhbSA9IGFzeW5jIChkZXN0LCB7Ym9keX0pID0+IHtcblx0aWYgKGJvZHkgPT09IG51bGwpIHtcblx0XHQvLyBCb2R5IGlzIG51bGxcblx0XHRkZXN0LmVuZCgpO1xuXHR9IGVsc2Uge1xuXHRcdC8vIEJvZHkgaXMgc3RyZWFtXG5cdFx0YXdhaXQgcGlwZWxpbmUoYm9keSwgZGVzdCk7XG5cdH1cbn07XG4iLCAiZXhwb3J0IGNsYXNzIEZldGNoQmFzZUVycm9yIGV4dGVuZHMgRXJyb3Ige1xuXHRjb25zdHJ1Y3RvcihtZXNzYWdlLCB0eXBlKSB7XG5cdFx0c3VwZXIobWVzc2FnZSk7XG5cdFx0Ly8gSGlkZSBjdXN0b20gZXJyb3IgaW1wbGVtZW50YXRpb24gZGV0YWlscyBmcm9tIGVuZC11c2Vyc1xuXHRcdEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIHRoaXMuY29uc3RydWN0b3IpO1xuXG5cdFx0dGhpcy50eXBlID0gdHlwZTtcblx0fVxuXG5cdGdldCBuYW1lKCkge1xuXHRcdHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLm5hbWU7XG5cdH1cblxuXHRnZXQgW1N5bWJvbC50b1N0cmluZ1RhZ10oKSB7XG5cdFx0cmV0dXJuIHRoaXMuY29uc3RydWN0b3IubmFtZTtcblx0fVxufVxuIiwgIlxuaW1wb3J0IHtGZXRjaEJhc2VFcnJvcn0gZnJvbSAnLi9iYXNlLmpzJztcblxuLyoqXG4gKiBAdHlwZWRlZiB7eyBhZGRyZXNzPzogc3RyaW5nLCBjb2RlOiBzdHJpbmcsIGRlc3Q/OiBzdHJpbmcsIGVycm5vOiBudW1iZXIsIGluZm8/OiBvYmplY3QsIG1lc3NhZ2U6IHN0cmluZywgcGF0aD86IHN0cmluZywgcG9ydD86IG51bWJlciwgc3lzY2FsbDogc3RyaW5nfX0gU3lzdGVtRXJyb3JcbiovXG5cbi8qKlxuICogRmV0Y2hFcnJvciBpbnRlcmZhY2UgZm9yIG9wZXJhdGlvbmFsIGVycm9yc1xuICovXG5leHBvcnQgY2xhc3MgRmV0Y2hFcnJvciBleHRlbmRzIEZldGNoQmFzZUVycm9yIHtcblx0LyoqXG5cdCAqIEBwYXJhbSAge3N0cmluZ30gbWVzc2FnZSAtICAgICAgRXJyb3IgbWVzc2FnZSBmb3IgaHVtYW5cblx0ICogQHBhcmFtICB7c3RyaW5nfSBbdHlwZV0gLSAgICAgICAgRXJyb3IgdHlwZSBmb3IgbWFjaGluZVxuXHQgKiBAcGFyYW0gIHtTeXN0ZW1FcnJvcn0gW3N5c3RlbUVycm9yXSAtIEZvciBOb2RlLmpzIHN5c3RlbSBlcnJvclxuXHQgKi9cblx0Y29uc3RydWN0b3IobWVzc2FnZSwgdHlwZSwgc3lzdGVtRXJyb3IpIHtcblx0XHRzdXBlcihtZXNzYWdlLCB0eXBlKTtcblx0XHQvLyBXaGVuIGVyci50eXBlIGlzIGBzeXN0ZW1gLCBlcnIuZXJyb3JlZFN5c0NhbGwgY29udGFpbnMgc3lzdGVtIGVycm9yIGFuZCBlcnIuY29kZSBjb250YWlucyBzeXN0ZW0gZXJyb3IgY29kZVxuXHRcdGlmIChzeXN0ZW1FcnJvcikge1xuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW11bHRpLWFzc2lnblxuXHRcdFx0dGhpcy5jb2RlID0gdGhpcy5lcnJubyA9IHN5c3RlbUVycm9yLmNvZGU7XG5cdFx0XHR0aGlzLmVycm9yZWRTeXNDYWxsID0gc3lzdGVtRXJyb3Iuc3lzY2FsbDtcblx0XHR9XG5cdH1cbn1cbiIsICIvKipcbiAqIElzLmpzXG4gKlxuICogT2JqZWN0IHR5cGUgY2hlY2tzLlxuICovXG5cbmNvbnN0IE5BTUUgPSBTeW1ib2wudG9TdHJpbmdUYWc7XG5cbi8qKlxuICogQ2hlY2sgaWYgYG9iamAgaXMgYSBVUkxTZWFyY2hQYXJhbXMgb2JqZWN0XG4gKiByZWY6IGh0dHBzOi8vZ2l0aHViLmNvbS9ub2RlLWZldGNoL25vZGUtZmV0Y2gvaXNzdWVzLzI5NiNpc3N1ZWNvbW1lbnQtMzA3NTk4MTQzXG4gKiBAcGFyYW0geyp9IG9iamVjdCAtIE9iamVjdCB0byBjaGVjayBmb3JcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBjb25zdCBpc1VSTFNlYXJjaFBhcmFtZXRlcnMgPSBvYmplY3QgPT4ge1xuXHRyZXR1cm4gKFxuXHRcdHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmXG5cdFx0dHlwZW9mIG9iamVjdC5hcHBlbmQgPT09ICdmdW5jdGlvbicgJiZcblx0XHR0eXBlb2Ygb2JqZWN0LmRlbGV0ZSA9PT0gJ2Z1bmN0aW9uJyAmJlxuXHRcdHR5cGVvZiBvYmplY3QuZ2V0ID09PSAnZnVuY3Rpb24nICYmXG5cdFx0dHlwZW9mIG9iamVjdC5nZXRBbGwgPT09ICdmdW5jdGlvbicgJiZcblx0XHR0eXBlb2Ygb2JqZWN0LmhhcyA9PT0gJ2Z1bmN0aW9uJyAmJlxuXHRcdHR5cGVvZiBvYmplY3Quc2V0ID09PSAnZnVuY3Rpb24nICYmXG5cdFx0dHlwZW9mIG9iamVjdC5zb3J0ID09PSAnZnVuY3Rpb24nICYmXG5cdFx0b2JqZWN0W05BTUVdID09PSAnVVJMU2VhcmNoUGFyYW1zJ1xuXHQpO1xufTtcblxuLyoqXG4gKiBDaGVjayBpZiBgb2JqZWN0YCBpcyBhIFczQyBgQmxvYmAgb2JqZWN0ICh3aGljaCBgRmlsZWAgaW5oZXJpdHMgZnJvbSlcbiAqIEBwYXJhbSB7Kn0gb2JqZWN0IC0gT2JqZWN0IHRvIGNoZWNrIGZvclxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGNvbnN0IGlzQmxvYiA9IG9iamVjdCA9PiB7XG5cdHJldHVybiAoXG5cdFx0b2JqZWN0ICYmXG5cdFx0dHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiZcblx0XHR0eXBlb2Ygb2JqZWN0LmFycmF5QnVmZmVyID09PSAnZnVuY3Rpb24nICYmXG5cdFx0dHlwZW9mIG9iamVjdC50eXBlID09PSAnc3RyaW5nJyAmJlxuXHRcdHR5cGVvZiBvYmplY3Quc3RyZWFtID09PSAnZnVuY3Rpb24nICYmXG5cdFx0dHlwZW9mIG9iamVjdC5jb25zdHJ1Y3RvciA9PT0gJ2Z1bmN0aW9uJyAmJlxuXHRcdC9eKEJsb2J8RmlsZSkkLy50ZXN0KG9iamVjdFtOQU1FXSlcblx0KTtcbn07XG5cbi8qKlxuICogQ2hlY2sgaWYgYG9iamAgaXMgYW4gaW5zdGFuY2Ugb2YgQWJvcnRTaWduYWwuXG4gKiBAcGFyYW0geyp9IG9iamVjdCAtIE9iamVjdCB0byBjaGVjayBmb3JcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBjb25zdCBpc0Fib3J0U2lnbmFsID0gb2JqZWN0ID0+IHtcblx0cmV0dXJuIChcblx0XHR0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJiAoXG5cdFx0XHRvYmplY3RbTkFNRV0gPT09ICdBYm9ydFNpZ25hbCcgfHxcblx0XHRcdG9iamVjdFtOQU1FXSA9PT0gJ0V2ZW50VGFyZ2V0J1xuXHRcdClcblx0KTtcbn07XG5cbi8qKlxuICogaXNEb21haW5PclN1YmRvbWFpbiByZXBvcnRzIHdoZXRoZXIgc3ViIGlzIGEgc3ViZG9tYWluIChvciBleGFjdCBtYXRjaCkgb2ZcbiAqIHRoZSBwYXJlbnQgZG9tYWluLlxuICpcbiAqIEJvdGggZG9tYWlucyBtdXN0IGFscmVhZHkgYmUgaW4gY2Fub25pY2FsIGZvcm0uXG4gKiBAcGFyYW0ge3N0cmluZ3xVUkx9IG9yaWdpbmFsXG4gKiBAcGFyYW0ge3N0cmluZ3xVUkx9IGRlc3RpbmF0aW9uXG4gKi9cbmV4cG9ydCBjb25zdCBpc0RvbWFpbk9yU3ViZG9tYWluID0gKGRlc3RpbmF0aW9uLCBvcmlnaW5hbCkgPT4ge1xuXHRjb25zdCBvcmlnID0gbmV3IFVSTChvcmlnaW5hbCkuaG9zdG5hbWU7XG5cdGNvbnN0IGRlc3QgPSBuZXcgVVJMKGRlc3RpbmF0aW9uKS5ob3N0bmFtZTtcblxuXHRyZXR1cm4gb3JpZyA9PT0gZGVzdCB8fCBvcmlnLmVuZHNXaXRoKGAuJHtkZXN0fWApO1xufTtcblxuLyoqXG4gKiBpc1NhbWVQcm90b2NvbCByZXBvcnRzIHdoZXRoZXIgdGhlIHR3byBwcm92aWRlZCBVUkxzIHVzZSB0aGUgc2FtZSBwcm90b2NvbC5cbiAqXG4gKiBCb3RoIGRvbWFpbnMgbXVzdCBhbHJlYWR5IGJlIGluIGNhbm9uaWNhbCBmb3JtLlxuICogQHBhcmFtIHtzdHJpbmd8VVJMfSBvcmlnaW5hbFxuICogQHBhcmFtIHtzdHJpbmd8VVJMfSBkZXN0aW5hdGlvblxuICovXG5leHBvcnQgY29uc3QgaXNTYW1lUHJvdG9jb2wgPSAoZGVzdGluYXRpb24sIG9yaWdpbmFsKSA9PiB7XG5cdGNvbnN0IG9yaWcgPSBuZXcgVVJMKG9yaWdpbmFsKS5wcm90b2NvbDtcblx0Y29uc3QgZGVzdCA9IG5ldyBVUkwoZGVzdGluYXRpb24pLnByb3RvY29sO1xuXG5cdHJldHVybiBvcmlnID09PSBkZXN0O1xufTtcbiIsICIvKipcbiAqIEhlYWRlcnMuanNcbiAqXG4gKiBIZWFkZXJzIGNsYXNzIG9mZmVycyBjb252ZW5pZW50IGhlbHBlcnNcbiAqL1xuXG5pbXBvcnQge3R5cGVzfSBmcm9tICdub2RlOnV0aWwnO1xuaW1wb3J0IGh0dHAgZnJvbSAnbm9kZTpodHRwJztcblxuLyogYzggaWdub3JlIG5leHQgOSAqL1xuY29uc3QgdmFsaWRhdGVIZWFkZXJOYW1lID0gdHlwZW9mIGh0dHAudmFsaWRhdGVIZWFkZXJOYW1lID09PSAnZnVuY3Rpb24nID9cblx0aHR0cC52YWxpZGF0ZUhlYWRlck5hbWUgOlxuXHRuYW1lID0+IHtcblx0XHRpZiAoIS9eW1xcXmBcXC1cXHchIyQlJicqKy58fl0rJC8udGVzdChuYW1lKSkge1xuXHRcdFx0Y29uc3QgZXJyb3IgPSBuZXcgVHlwZUVycm9yKGBIZWFkZXIgbmFtZSBtdXN0IGJlIGEgdmFsaWQgSFRUUCB0b2tlbiBbJHtuYW1lfV1gKTtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlcnJvciwgJ2NvZGUnLCB7dmFsdWU6ICdFUlJfSU5WQUxJRF9IVFRQX1RPS0VOJ30pO1xuXHRcdFx0dGhyb3cgZXJyb3I7XG5cdFx0fVxuXHR9O1xuXG4vKiBjOCBpZ25vcmUgbmV4dCA5ICovXG5jb25zdCB2YWxpZGF0ZUhlYWRlclZhbHVlID0gdHlwZW9mIGh0dHAudmFsaWRhdGVIZWFkZXJWYWx1ZSA9PT0gJ2Z1bmN0aW9uJyA/XG5cdGh0dHAudmFsaWRhdGVIZWFkZXJWYWx1ZSA6XG5cdChuYW1lLCB2YWx1ZSkgPT4ge1xuXHRcdGlmICgvW15cXHRcXHUwMDIwLVxcdTAwN0VcXHUwMDgwLVxcdTAwRkZdLy50ZXN0KHZhbHVlKSkge1xuXHRcdFx0Y29uc3QgZXJyb3IgPSBuZXcgVHlwZUVycm9yKGBJbnZhbGlkIGNoYXJhY3RlciBpbiBoZWFkZXIgY29udGVudCBbXCIke25hbWV9XCJdYCk7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXJyb3IsICdjb2RlJywge3ZhbHVlOiAnRVJSX0lOVkFMSURfQ0hBUid9KTtcblx0XHRcdHRocm93IGVycm9yO1xuXHRcdH1cblx0fTtcblxuLyoqXG4gKiBAdHlwZWRlZiB7SGVhZGVycyB8IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfCBJdGVyYWJsZTxyZWFkb25seSBbc3RyaW5nLCBzdHJpbmddPiB8IEl0ZXJhYmxlPEl0ZXJhYmxlPHN0cmluZz4+fSBIZWFkZXJzSW5pdFxuICovXG5cbi8qKlxuICogVGhpcyBGZXRjaCBBUEkgaW50ZXJmYWNlIGFsbG93cyB5b3UgdG8gcGVyZm9ybSB2YXJpb3VzIGFjdGlvbnMgb24gSFRUUCByZXF1ZXN0IGFuZCByZXNwb25zZSBoZWFkZXJzLlxuICogVGhlc2UgYWN0aW9ucyBpbmNsdWRlIHJldHJpZXZpbmcsIHNldHRpbmcsIGFkZGluZyB0bywgYW5kIHJlbW92aW5nLlxuICogQSBIZWFkZXJzIG9iamVjdCBoYXMgYW4gYXNzb2NpYXRlZCBoZWFkZXIgbGlzdCwgd2hpY2ggaXMgaW5pdGlhbGx5IGVtcHR5IGFuZCBjb25zaXN0cyBvZiB6ZXJvIG9yIG1vcmUgbmFtZSBhbmQgdmFsdWUgcGFpcnMuXG4gKiBZb3UgY2FuIGFkZCB0byB0aGlzIHVzaW5nIG1ldGhvZHMgbGlrZSBhcHBlbmQoKSAoc2VlIEV4YW1wbGVzLilcbiAqIEluIGFsbCBtZXRob2RzIG9mIHRoaXMgaW50ZXJmYWNlLCBoZWFkZXIgbmFtZXMgYXJlIG1hdGNoZWQgYnkgY2FzZS1pbnNlbnNpdGl2ZSBieXRlIHNlcXVlbmNlLlxuICpcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGVhZGVycyBleHRlbmRzIFVSTFNlYXJjaFBhcmFtcyB7XG5cdC8qKlxuXHQgKiBIZWFkZXJzIGNsYXNzXG5cdCAqXG5cdCAqIEBjb25zdHJ1Y3RvclxuXHQgKiBAcGFyYW0ge0hlYWRlcnNJbml0fSBbaW5pdF0gLSBSZXNwb25zZSBoZWFkZXJzXG5cdCAqL1xuXHRjb25zdHJ1Y3Rvcihpbml0KSB7XG5cdFx0Ly8gVmFsaWRhdGUgYW5kIG5vcm1hbGl6ZSBpbml0IG9iamVjdCBpbiBbbmFtZSwgdmFsdWUocyldW11cblx0XHQvKiogQHR5cGUge3N0cmluZ1tdW119ICovXG5cdFx0bGV0IHJlc3VsdCA9IFtdO1xuXHRcdGlmIChpbml0IGluc3RhbmNlb2YgSGVhZGVycykge1xuXHRcdFx0Y29uc3QgcmF3ID0gaW5pdC5yYXcoKTtcblx0XHRcdGZvciAoY29uc3QgW25hbWUsIHZhbHVlc10gb2YgT2JqZWN0LmVudHJpZXMocmF3KSkge1xuXHRcdFx0XHRyZXN1bHQucHVzaCguLi52YWx1ZXMubWFwKHZhbHVlID0+IFtuYW1lLCB2YWx1ZV0pKTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKGluaXQgPT0gbnVsbCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWVxLW51bGwsIGVxZXFlcVxuXHRcdFx0Ly8gTm8gb3Bcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBpbml0ID09PSAnb2JqZWN0JyAmJiAhdHlwZXMuaXNCb3hlZFByaW1pdGl2ZShpbml0KSkge1xuXHRcdFx0Y29uc3QgbWV0aG9kID0gaW5pdFtTeW1ib2wuaXRlcmF0b3JdO1xuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWVxLW51bGwsIGVxZXFlcVxuXHRcdFx0aWYgKG1ldGhvZCA9PSBudWxsKSB7XG5cdFx0XHRcdC8vIFJlY29yZDxCeXRlU3RyaW5nLCBCeXRlU3RyaW5nPlxuXHRcdFx0XHRyZXN1bHQucHVzaCguLi5PYmplY3QuZW50cmllcyhpbml0KSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAodHlwZW9mIG1ldGhvZCAhPT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ0hlYWRlciBwYWlycyBtdXN0IGJlIGl0ZXJhYmxlJyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBTZXF1ZW5jZTxzZXF1ZW5jZTxCeXRlU3RyaW5nPj5cblx0XHRcdFx0Ly8gTm90ZTogcGVyIHNwZWMgd2UgaGF2ZSB0byBmaXJzdCBleGhhdXN0IHRoZSBsaXN0cyB0aGVuIHByb2Nlc3MgdGhlbVxuXHRcdFx0XHRyZXN1bHQgPSBbLi4uaW5pdF1cblx0XHRcdFx0XHQubWFwKHBhaXIgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0XHR0eXBlb2YgcGFpciAhPT0gJ29iamVjdCcgfHwgdHlwZXMuaXNCb3hlZFByaW1pdGl2ZShwYWlyKVxuXHRcdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ0VhY2ggaGVhZGVyIHBhaXIgbXVzdCBiZSBhbiBpdGVyYWJsZSBvYmplY3QnKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0cmV0dXJuIFsuLi5wYWlyXTtcblx0XHRcdFx0XHR9KS5tYXAocGFpciA9PiB7XG5cdFx0XHRcdFx0XHRpZiAocGFpci5sZW5ndGggIT09IDIpIHtcblx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignRWFjaCBoZWFkZXIgcGFpciBtdXN0IGJlIGEgbmFtZS92YWx1ZSB0dXBsZScpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRyZXR1cm4gWy4uLnBhaXJdO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdGYWlsZWQgdG8gY29uc3RydWN0IFxcJ0hlYWRlcnNcXCc6IFRoZSBwcm92aWRlZCB2YWx1ZSBpcyBub3Qgb2YgdHlwZSBcXCcoc2VxdWVuY2U8c2VxdWVuY2U8Qnl0ZVN0cmluZz4+IG9yIHJlY29yZDxCeXRlU3RyaW5nLCBCeXRlU3RyaW5nPiknKTtcblx0XHR9XG5cblx0XHQvLyBWYWxpZGF0ZSBhbmQgbG93ZXJjYXNlXG5cdFx0cmVzdWx0ID1cblx0XHRcdHJlc3VsdC5sZW5ndGggPiAwID9cblx0XHRcdFx0cmVzdWx0Lm1hcCgoW25hbWUsIHZhbHVlXSkgPT4ge1xuXHRcdFx0XHRcdHZhbGlkYXRlSGVhZGVyTmFtZShuYW1lKTtcblx0XHRcdFx0XHR2YWxpZGF0ZUhlYWRlclZhbHVlKG5hbWUsIFN0cmluZyh2YWx1ZSkpO1xuXHRcdFx0XHRcdHJldHVybiBbU3RyaW5nKG5hbWUpLnRvTG93ZXJDYXNlKCksIFN0cmluZyh2YWx1ZSldO1xuXHRcdFx0XHR9KSA6XG5cdFx0XHRcdHVuZGVmaW5lZDtcblxuXHRcdHN1cGVyKHJlc3VsdCk7XG5cblx0XHQvLyBSZXR1cm5pbmcgYSBQcm94eSB0aGF0IHdpbGwgbG93ZXJjYXNlIGtleSBuYW1lcywgdmFsaWRhdGUgcGFyYW1ldGVycyBhbmQgc29ydCBrZXlzXG5cdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0cnVjdG9yLXJldHVyblxuXHRcdHJldHVybiBuZXcgUHJveHkodGhpcywge1xuXHRcdFx0Z2V0KHRhcmdldCwgcCwgcmVjZWl2ZXIpIHtcblx0XHRcdFx0c3dpdGNoIChwKSB7XG5cdFx0XHRcdFx0Y2FzZSAnYXBwZW5kJzpcblx0XHRcdFx0XHRjYXNlICdzZXQnOlxuXHRcdFx0XHRcdFx0cmV0dXJuIChuYW1lLCB2YWx1ZSkgPT4ge1xuXHRcdFx0XHRcdFx0XHR2YWxpZGF0ZUhlYWRlck5hbWUobmFtZSk7XG5cdFx0XHRcdFx0XHRcdHZhbGlkYXRlSGVhZGVyVmFsdWUobmFtZSwgU3RyaW5nKHZhbHVlKSk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBVUkxTZWFyY2hQYXJhbXMucHJvdG90eXBlW3BdLmNhbGwoXG5cdFx0XHRcdFx0XHRcdFx0dGFyZ2V0LFxuXHRcdFx0XHRcdFx0XHRcdFN0cmluZyhuYW1lKS50b0xvd2VyQ2FzZSgpLFxuXHRcdFx0XHRcdFx0XHRcdFN0cmluZyh2YWx1ZSlcblx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRjYXNlICdkZWxldGUnOlxuXHRcdFx0XHRcdGNhc2UgJ2hhcyc6XG5cdFx0XHRcdFx0Y2FzZSAnZ2V0QWxsJzpcblx0XHRcdFx0XHRcdHJldHVybiBuYW1lID0+IHtcblx0XHRcdFx0XHRcdFx0dmFsaWRhdGVIZWFkZXJOYW1lKG5hbWUpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gVVJMU2VhcmNoUGFyYW1zLnByb3RvdHlwZVtwXS5jYWxsKFxuXHRcdFx0XHRcdFx0XHRcdHRhcmdldCxcblx0XHRcdFx0XHRcdFx0XHRTdHJpbmcobmFtZSkudG9Mb3dlckNhc2UoKVxuXHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdGNhc2UgJ2tleXMnOlxuXHRcdFx0XHRcdFx0cmV0dXJuICgpID0+IHtcblx0XHRcdFx0XHRcdFx0dGFyZ2V0LnNvcnQoKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIG5ldyBTZXQoVVJMU2VhcmNoUGFyYW1zLnByb3RvdHlwZS5rZXlzLmNhbGwodGFyZ2V0KSkua2V5cygpO1xuXHRcdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRyZXR1cm4gUmVmbGVjdC5nZXQodGFyZ2V0LCBwLCByZWNlaXZlcik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0XHQvKiBjOCBpZ25vcmUgbmV4dCAqL1xuXHR9XG5cblx0Z2V0IFtTeW1ib2wudG9TdHJpbmdUYWddKCkge1xuXHRcdHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLm5hbWU7XG5cdH1cblxuXHR0b1N0cmluZygpIHtcblx0XHRyZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHRoaXMpO1xuXHR9XG5cblx0Z2V0KG5hbWUpIHtcblx0XHRjb25zdCB2YWx1ZXMgPSB0aGlzLmdldEFsbChuYW1lKTtcblx0XHRpZiAodmFsdWVzLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXG5cdFx0bGV0IHZhbHVlID0gdmFsdWVzLmpvaW4oJywgJyk7XG5cdFx0aWYgKC9eY29udGVudC1lbmNvZGluZyQvaS50ZXN0KG5hbWUpKSB7XG5cdFx0XHR2YWx1ZSA9IHZhbHVlLnRvTG93ZXJDYXNlKCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHZhbHVlO1xuXHR9XG5cblx0Zm9yRWFjaChjYWxsYmFjaywgdGhpc0FyZyA9IHVuZGVmaW5lZCkge1xuXHRcdGZvciAoY29uc3QgbmFtZSBvZiB0aGlzLmtleXMoKSkge1xuXHRcdFx0UmVmbGVjdC5hcHBseShjYWxsYmFjaywgdGhpc0FyZywgW3RoaXMuZ2V0KG5hbWUpLCBuYW1lLCB0aGlzXSk7XG5cdFx0fVxuXHR9XG5cblx0KiB2YWx1ZXMoKSB7XG5cdFx0Zm9yIChjb25zdCBuYW1lIG9mIHRoaXMua2V5cygpKSB7XG5cdFx0XHR5aWVsZCB0aGlzLmdldChuYW1lKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQHR5cGUgeygpID0+IEl0ZXJhYmxlSXRlcmF0b3I8W3N0cmluZywgc3RyaW5nXT59XG5cdCAqL1xuXHQqIGVudHJpZXMoKSB7XG5cdFx0Zm9yIChjb25zdCBuYW1lIG9mIHRoaXMua2V5cygpKSB7XG5cdFx0XHR5aWVsZCBbbmFtZSwgdGhpcy5nZXQobmFtZSldO1xuXHRcdH1cblx0fVxuXG5cdFtTeW1ib2wuaXRlcmF0b3JdKCkge1xuXHRcdHJldHVybiB0aGlzLmVudHJpZXMoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBOb2RlLWZldGNoIG5vbi1zcGVjIG1ldGhvZFxuXHQgKiByZXR1cm5pbmcgYWxsIGhlYWRlcnMgYW5kIHRoZWlyIHZhbHVlcyBhcyBhcnJheVxuXHQgKiBAcmV0dXJucyB7UmVjb3JkPHN0cmluZywgc3RyaW5nW10+fVxuXHQgKi9cblx0cmF3KCkge1xuXHRcdHJldHVybiBbLi4udGhpcy5rZXlzKCldLnJlZHVjZSgocmVzdWx0LCBrZXkpID0+IHtcblx0XHRcdHJlc3VsdFtrZXldID0gdGhpcy5nZXRBbGwoa2V5KTtcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fSwge30pO1xuXHR9XG5cblx0LyoqXG5cdCAqIEZvciBiZXR0ZXIgY29uc29sZS5sb2coaGVhZGVycykgYW5kIGFsc28gdG8gY29udmVydCBIZWFkZXJzIGludG8gTm9kZS5qcyBSZXF1ZXN0IGNvbXBhdGlibGUgZm9ybWF0XG5cdCAqL1xuXHRbU3ltYm9sLmZvcignbm9kZWpzLnV0aWwuaW5zcGVjdC5jdXN0b20nKV0oKSB7XG5cdFx0cmV0dXJuIFsuLi50aGlzLmtleXMoKV0ucmVkdWNlKChyZXN1bHQsIGtleSkgPT4ge1xuXHRcdFx0Y29uc3QgdmFsdWVzID0gdGhpcy5nZXRBbGwoa2V5KTtcblx0XHRcdC8vIEh0dHAucmVxdWVzdCgpIG9ubHkgc3VwcG9ydHMgc3RyaW5nIGFzIEhvc3QgaGVhZGVyLlxuXHRcdFx0Ly8gVGhpcyBoYWNrIG1ha2VzIHNwZWNpZnlpbmcgY3VzdG9tIEhvc3QgaGVhZGVyIHBvc3NpYmxlLlxuXHRcdFx0aWYgKGtleSA9PT0gJ2hvc3QnKSB7XG5cdFx0XHRcdHJlc3VsdFtrZXldID0gdmFsdWVzWzBdO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmVzdWx0W2tleV0gPSB2YWx1ZXMubGVuZ3RoID4gMSA/IHZhbHVlcyA6IHZhbHVlc1swXTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9LCB7fSk7XG5cdH1cbn1cblxuLyoqXG4gKiBSZS1zaGFwaW5nIG9iamVjdCBmb3IgV2ViIElETCB0ZXN0c1xuICogT25seSBuZWVkIHRvIGRvIGl0IGZvciBvdmVycmlkZGVuIG1ldGhvZHNcbiAqL1xuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoXG5cdEhlYWRlcnMucHJvdG90eXBlLFxuXHRbJ2dldCcsICdlbnRyaWVzJywgJ2ZvckVhY2gnLCAndmFsdWVzJ10ucmVkdWNlKChyZXN1bHQsIHByb3BlcnR5KSA9PiB7XG5cdFx0cmVzdWx0W3Byb3BlcnR5XSA9IHtlbnVtZXJhYmxlOiB0cnVlfTtcblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9LCB7fSlcbik7XG5cbi8qKlxuICogQ3JlYXRlIGEgSGVhZGVycyBvYmplY3QgZnJvbSBhbiBodHRwLkluY29taW5nTWVzc2FnZS5yYXdIZWFkZXJzLCBpZ25vcmluZyB0aG9zZSB0aGF0IGRvXG4gKiBub3QgY29uZm9ybSB0byBIVFRQIGdyYW1tYXIgcHJvZHVjdGlvbnMuXG4gKiBAcGFyYW0ge2ltcG9ydCgnaHR0cCcpLkluY29taW5nTWVzc2FnZVsncmF3SGVhZGVycyddfSBoZWFkZXJzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmcm9tUmF3SGVhZGVycyhoZWFkZXJzID0gW10pIHtcblx0cmV0dXJuIG5ldyBIZWFkZXJzKFxuXHRcdGhlYWRlcnNcblx0XHRcdC8vIFNwbGl0IGludG8gcGFpcnNcblx0XHRcdC5yZWR1Y2UoKHJlc3VsdCwgdmFsdWUsIGluZGV4LCBhcnJheSkgPT4ge1xuXHRcdFx0XHRpZiAoaW5kZXggJSAyID09PSAwKSB7XG5cdFx0XHRcdFx0cmVzdWx0LnB1c2goYXJyYXkuc2xpY2UoaW5kZXgsIGluZGV4ICsgMikpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH0sIFtdKVxuXHRcdFx0LmZpbHRlcigoW25hbWUsIHZhbHVlXSkgPT4ge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdHZhbGlkYXRlSGVhZGVyTmFtZShuYW1lKTtcblx0XHRcdFx0XHR2YWxpZGF0ZUhlYWRlclZhbHVlKG5hbWUsIFN0cmluZyh2YWx1ZSkpO1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9IGNhdGNoIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cblx0KTtcbn1cbiIsICJjb25zdCByZWRpcmVjdFN0YXR1cyA9IG5ldyBTZXQoWzMwMSwgMzAyLCAzMDMsIDMwNywgMzA4XSk7XG5cbi8qKlxuICogUmVkaXJlY3QgY29kZSBtYXRjaGluZ1xuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBjb2RlIC0gU3RhdHVzIGNvZGVcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBjb25zdCBpc1JlZGlyZWN0ID0gY29kZSA9PiB7XG5cdHJldHVybiByZWRpcmVjdFN0YXR1cy5oYXMoY29kZSk7XG59O1xuIiwgIi8qKlxuICogUmVzcG9uc2UuanNcbiAqXG4gKiBSZXNwb25zZSBjbGFzcyBwcm92aWRlcyBjb250ZW50IGRlY29kaW5nXG4gKi9cblxuaW1wb3J0IEhlYWRlcnMgZnJvbSAnLi9oZWFkZXJzLmpzJztcbmltcG9ydCBCb2R5LCB7Y2xvbmUsIGV4dHJhY3RDb250ZW50VHlwZX0gZnJvbSAnLi9ib2R5LmpzJztcbmltcG9ydCB7aXNSZWRpcmVjdH0gZnJvbSAnLi91dGlscy9pcy1yZWRpcmVjdC5qcyc7XG5cbmNvbnN0IElOVEVSTkFMUyA9IFN5bWJvbCgnUmVzcG9uc2UgaW50ZXJuYWxzJyk7XG5cbi8qKlxuICogUmVzcG9uc2UgY2xhc3NcbiAqXG4gKiBSZWY6IGh0dHBzOi8vZmV0Y2guc3BlYy53aGF0d2cub3JnLyNyZXNwb25zZS1jbGFzc1xuICpcbiAqIEBwYXJhbSAgIFN0cmVhbSAgYm9keSAgUmVhZGFibGUgc3RyZWFtXG4gKiBAcGFyYW0gICBPYmplY3QgIG9wdHMgIFJlc3BvbnNlIG9wdGlvbnNcbiAqIEByZXR1cm4gIFZvaWRcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVzcG9uc2UgZXh0ZW5kcyBCb2R5IHtcblx0Y29uc3RydWN0b3IoYm9keSA9IG51bGwsIG9wdGlvbnMgPSB7fSkge1xuXHRcdHN1cGVyKGJvZHksIG9wdGlvbnMpO1xuXG5cdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWVxLW51bGwsIGVxZXFlcSwgbm8tbmVnYXRlZC1jb25kaXRpb25cblx0XHRjb25zdCBzdGF0dXMgPSBvcHRpb25zLnN0YXR1cyAhPSBudWxsID8gb3B0aW9ucy5zdGF0dXMgOiAyMDA7XG5cblx0XHRjb25zdCBoZWFkZXJzID0gbmV3IEhlYWRlcnMob3B0aW9ucy5oZWFkZXJzKTtcblxuXHRcdGlmIChib2R5ICE9PSBudWxsICYmICFoZWFkZXJzLmhhcygnQ29udGVudC1UeXBlJykpIHtcblx0XHRcdGNvbnN0IGNvbnRlbnRUeXBlID0gZXh0cmFjdENvbnRlbnRUeXBlKGJvZHksIHRoaXMpO1xuXHRcdFx0aWYgKGNvbnRlbnRUeXBlKSB7XG5cdFx0XHRcdGhlYWRlcnMuYXBwZW5kKCdDb250ZW50LVR5cGUnLCBjb250ZW50VHlwZSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpc1tJTlRFUk5BTFNdID0ge1xuXHRcdFx0dHlwZTogJ2RlZmF1bHQnLFxuXHRcdFx0dXJsOiBvcHRpb25zLnVybCxcblx0XHRcdHN0YXR1cyxcblx0XHRcdHN0YXR1c1RleHQ6IG9wdGlvbnMuc3RhdHVzVGV4dCB8fCAnJyxcblx0XHRcdGhlYWRlcnMsXG5cdFx0XHRjb3VudGVyOiBvcHRpb25zLmNvdW50ZXIsXG5cdFx0XHRoaWdoV2F0ZXJNYXJrOiBvcHRpb25zLmhpZ2hXYXRlck1hcmtcblx0XHR9O1xuXHR9XG5cblx0Z2V0IHR5cGUoKSB7XG5cdFx0cmV0dXJuIHRoaXNbSU5URVJOQUxTXS50eXBlO1xuXHR9XG5cblx0Z2V0IHVybCgpIHtcblx0XHRyZXR1cm4gdGhpc1tJTlRFUk5BTFNdLnVybCB8fCAnJztcblx0fVxuXG5cdGdldCBzdGF0dXMoKSB7XG5cdFx0cmV0dXJuIHRoaXNbSU5URVJOQUxTXS5zdGF0dXM7XG5cdH1cblxuXHQvKipcblx0ICogQ29udmVuaWVuY2UgcHJvcGVydHkgcmVwcmVzZW50aW5nIGlmIHRoZSByZXF1ZXN0IGVuZGVkIG5vcm1hbGx5XG5cdCAqL1xuXHRnZXQgb2soKSB7XG5cdFx0cmV0dXJuIHRoaXNbSU5URVJOQUxTXS5zdGF0dXMgPj0gMjAwICYmIHRoaXNbSU5URVJOQUxTXS5zdGF0dXMgPCAzMDA7XG5cdH1cblxuXHRnZXQgcmVkaXJlY3RlZCgpIHtcblx0XHRyZXR1cm4gdGhpc1tJTlRFUk5BTFNdLmNvdW50ZXIgPiAwO1xuXHR9XG5cblx0Z2V0IHN0YXR1c1RleHQoKSB7XG5cdFx0cmV0dXJuIHRoaXNbSU5URVJOQUxTXS5zdGF0dXNUZXh0O1xuXHR9XG5cblx0Z2V0IGhlYWRlcnMoKSB7XG5cdFx0cmV0dXJuIHRoaXNbSU5URVJOQUxTXS5oZWFkZXJzO1xuXHR9XG5cblx0Z2V0IGhpZ2hXYXRlck1hcmsoKSB7XG5cdFx0cmV0dXJuIHRoaXNbSU5URVJOQUxTXS5oaWdoV2F0ZXJNYXJrO1xuXHR9XG5cblx0LyoqXG5cdCAqIENsb25lIHRoaXMgcmVzcG9uc2Vcblx0ICpcblx0ICogQHJldHVybiAgUmVzcG9uc2Vcblx0ICovXG5cdGNsb25lKCkge1xuXHRcdHJldHVybiBuZXcgUmVzcG9uc2UoY2xvbmUodGhpcywgdGhpcy5oaWdoV2F0ZXJNYXJrKSwge1xuXHRcdFx0dHlwZTogdGhpcy50eXBlLFxuXHRcdFx0dXJsOiB0aGlzLnVybCxcblx0XHRcdHN0YXR1czogdGhpcy5zdGF0dXMsXG5cdFx0XHRzdGF0dXNUZXh0OiB0aGlzLnN0YXR1c1RleHQsXG5cdFx0XHRoZWFkZXJzOiB0aGlzLmhlYWRlcnMsXG5cdFx0XHRvazogdGhpcy5vayxcblx0XHRcdHJlZGlyZWN0ZWQ6IHRoaXMucmVkaXJlY3RlZCxcblx0XHRcdHNpemU6IHRoaXMuc2l6ZSxcblx0XHRcdGhpZ2hXYXRlck1hcms6IHRoaXMuaGlnaFdhdGVyTWFya1xuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgICAgVGhlIFVSTCB0aGF0IHRoZSBuZXcgcmVzcG9uc2UgaXMgdG8gb3JpZ2luYXRlIGZyb20uXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBzdGF0dXMgQW4gb3B0aW9uYWwgc3RhdHVzIGNvZGUgZm9yIHRoZSByZXNwb25zZSAoZS5nLiwgMzAyLilcblx0ICogQHJldHVybnMge1Jlc3BvbnNlfSAgICBBIFJlc3BvbnNlIG9iamVjdC5cblx0ICovXG5cdHN0YXRpYyByZWRpcmVjdCh1cmwsIHN0YXR1cyA9IDMwMikge1xuXHRcdGlmICghaXNSZWRpcmVjdChzdGF0dXMpKSB7XG5cdFx0XHR0aHJvdyBuZXcgUmFuZ2VFcnJvcignRmFpbGVkIHRvIGV4ZWN1dGUgXCJyZWRpcmVjdFwiIG9uIFwicmVzcG9uc2VcIjogSW52YWxpZCBzdGF0dXMgY29kZScpO1xuXHRcdH1cblxuXHRcdHJldHVybiBuZXcgUmVzcG9uc2UobnVsbCwge1xuXHRcdFx0aGVhZGVyczoge1xuXHRcdFx0XHRsb2NhdGlvbjogbmV3IFVSTCh1cmwpLnRvU3RyaW5nKClcblx0XHRcdH0sXG5cdFx0XHRzdGF0dXNcblx0XHR9KTtcblx0fVxuXG5cdHN0YXRpYyBlcnJvcigpIHtcblx0XHRjb25zdCByZXNwb25zZSA9IG5ldyBSZXNwb25zZShudWxsLCB7c3RhdHVzOiAwLCBzdGF0dXNUZXh0OiAnJ30pO1xuXHRcdHJlc3BvbnNlW0lOVEVSTkFMU10udHlwZSA9ICdlcnJvcic7XG5cdFx0cmV0dXJuIHJlc3BvbnNlO1xuXHR9XG5cblx0c3RhdGljIGpzb24oZGF0YSA9IHVuZGVmaW5lZCwgaW5pdCA9IHt9KSB7XG5cdFx0Y29uc3QgYm9keSA9IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuXG5cdFx0aWYgKGJvZHkgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignZGF0YSBpcyBub3QgSlNPTiBzZXJpYWxpemFibGUnKTtcblx0XHR9XG5cblx0XHRjb25zdCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoaW5pdCAmJiBpbml0LmhlYWRlcnMpO1xuXG5cdFx0aWYgKCFoZWFkZXJzLmhhcygnY29udGVudC10eXBlJykpIHtcblx0XHRcdGhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuXHRcdH1cblxuXHRcdHJldHVybiBuZXcgUmVzcG9uc2UoYm9keSwge1xuXHRcdFx0Li4uaW5pdCxcblx0XHRcdGhlYWRlcnNcblx0XHR9KTtcblx0fVxuXG5cdGdldCBbU3ltYm9sLnRvU3RyaW5nVGFnXSgpIHtcblx0XHRyZXR1cm4gJ1Jlc3BvbnNlJztcblx0fVxufVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyhSZXNwb25zZS5wcm90b3R5cGUsIHtcblx0dHlwZToge2VudW1lcmFibGU6IHRydWV9LFxuXHR1cmw6IHtlbnVtZXJhYmxlOiB0cnVlfSxcblx0c3RhdHVzOiB7ZW51bWVyYWJsZTogdHJ1ZX0sXG5cdG9rOiB7ZW51bWVyYWJsZTogdHJ1ZX0sXG5cdHJlZGlyZWN0ZWQ6IHtlbnVtZXJhYmxlOiB0cnVlfSxcblx0c3RhdHVzVGV4dDoge2VudW1lcmFibGU6IHRydWV9LFxuXHRoZWFkZXJzOiB7ZW51bWVyYWJsZTogdHJ1ZX0sXG5cdGNsb25lOiB7ZW51bWVyYWJsZTogdHJ1ZX1cbn0pO1xuIiwgIi8qKlxuICogUmVxdWVzdC5qc1xuICpcbiAqIFJlcXVlc3QgY2xhc3MgY29udGFpbnMgc2VydmVyIG9ubHkgb3B0aW9uc1xuICpcbiAqIEFsbCBzcGVjIGFsZ29yaXRobSBzdGVwIG51bWJlcnMgYXJlIGJhc2VkIG9uIGh0dHBzOi8vZmV0Y2guc3BlYy53aGF0d2cub3JnL2NvbW1pdC1zbmFwc2hvdHMvYWU3MTY4MjJjYjNhNjE4NDMyMjZjZDA5MGVlZmM2NTg5NDQ2YzFkMi8uXG4gKi9cblxuaW1wb3J0IHtmb3JtYXQgYXMgZm9ybWF0VXJsfSBmcm9tICdub2RlOnVybCc7XG5pbXBvcnQge2RlcHJlY2F0ZX0gZnJvbSAnbm9kZTp1dGlsJztcbmltcG9ydCBIZWFkZXJzIGZyb20gJy4vaGVhZGVycy5qcyc7XG5pbXBvcnQgQm9keSwge2Nsb25lLCBleHRyYWN0Q29udGVudFR5cGUsIGdldFRvdGFsQnl0ZXN9IGZyb20gJy4vYm9keS5qcyc7XG5pbXBvcnQge2lzQWJvcnRTaWduYWx9IGZyb20gJy4vdXRpbHMvaXMuanMnO1xuaW1wb3J0IHtnZXRTZWFyY2h9IGZyb20gJy4vdXRpbHMvZ2V0LXNlYXJjaC5qcyc7XG5pbXBvcnQge1xuXHR2YWxpZGF0ZVJlZmVycmVyUG9saWN5LCBkZXRlcm1pbmVSZXF1ZXN0c1JlZmVycmVyLCBERUZBVUxUX1JFRkVSUkVSX1BPTElDWVxufSBmcm9tICcuL3V0aWxzL3JlZmVycmVyLmpzJztcblxuY29uc3QgSU5URVJOQUxTID0gU3ltYm9sKCdSZXF1ZXN0IGludGVybmFscycpO1xuXG4vKipcbiAqIENoZWNrIGlmIGBvYmpgIGlzIGFuIGluc3RhbmNlIG9mIFJlcXVlc3QuXG4gKlxuICogQHBhcmFtICB7Kn0gb2JqZWN0XG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5jb25zdCBpc1JlcXVlc3QgPSBvYmplY3QgPT4ge1xuXHRyZXR1cm4gKFxuXHRcdHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmXG5cdFx0dHlwZW9mIG9iamVjdFtJTlRFUk5BTFNdID09PSAnb2JqZWN0J1xuXHQpO1xufTtcblxuY29uc3QgZG9CYWREYXRhV2FybiA9IGRlcHJlY2F0ZSgoKSA9PiB7fSxcblx0Jy5kYXRhIGlzIG5vdCBhIHZhbGlkIFJlcXVlc3RJbml0IHByb3BlcnR5LCB1c2UgLmJvZHkgaW5zdGVhZCcsXG5cdCdodHRwczovL2dpdGh1Yi5jb20vbm9kZS1mZXRjaC9ub2RlLWZldGNoL2lzc3Vlcy8xMDAwIChyZXF1ZXN0KScpO1xuXG4vKipcbiAqIFJlcXVlc3QgY2xhc3NcbiAqXG4gKiBSZWY6IGh0dHBzOi8vZmV0Y2guc3BlYy53aGF0d2cub3JnLyNyZXF1ZXN0LWNsYXNzXG4gKlxuICogQHBhcmFtICAgTWl4ZWQgICBpbnB1dCAgVXJsIG9yIFJlcXVlc3QgaW5zdGFuY2VcbiAqIEBwYXJhbSAgIE9iamVjdCAgaW5pdCAgIEN1c3RvbSBvcHRpb25zXG4gKiBAcmV0dXJuICBWb2lkXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlcXVlc3QgZXh0ZW5kcyBCb2R5IHtcblx0Y29uc3RydWN0b3IoaW5wdXQsIGluaXQgPSB7fSkge1xuXHRcdGxldCBwYXJzZWRVUkw7XG5cblx0XHQvLyBOb3JtYWxpemUgaW5wdXQgYW5kIGZvcmNlIFVSTCB0byBiZSBlbmNvZGVkIGFzIFVURi04IChodHRwczovL2dpdGh1Yi5jb20vbm9kZS1mZXRjaC9ub2RlLWZldGNoL2lzc3Vlcy8yNDUpXG5cdFx0aWYgKGlzUmVxdWVzdChpbnB1dCkpIHtcblx0XHRcdHBhcnNlZFVSTCA9IG5ldyBVUkwoaW5wdXQudXJsKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cGFyc2VkVVJMID0gbmV3IFVSTChpbnB1dCk7XG5cdFx0XHRpbnB1dCA9IHt9O1xuXHRcdH1cblxuXHRcdGlmIChwYXJzZWRVUkwudXNlcm5hbWUgIT09ICcnIHx8IHBhcnNlZFVSTC5wYXNzd29yZCAhPT0gJycpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoYCR7cGFyc2VkVVJMfSBpcyBhbiB1cmwgd2l0aCBlbWJlZGRlZCBjcmVkZW50aWFscy5gKTtcblx0XHR9XG5cblx0XHRsZXQgbWV0aG9kID0gaW5pdC5tZXRob2QgfHwgaW5wdXQubWV0aG9kIHx8ICdHRVQnO1xuXHRcdGlmICgvXihkZWxldGV8Z2V0fGhlYWR8b3B0aW9uc3xwb3N0fHB1dCkkL2kudGVzdChtZXRob2QpKSB7XG5cdFx0XHRtZXRob2QgPSBtZXRob2QudG9VcHBlckNhc2UoKTtcblx0XHR9XG5cblx0XHRpZiAoIWlzUmVxdWVzdChpbml0KSAmJiAnZGF0YScgaW4gaW5pdCkge1xuXHRcdFx0ZG9CYWREYXRhV2FybigpO1xuXHRcdH1cblxuXHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1lcS1udWxsLCBlcWVxZXFcblx0XHRpZiAoKGluaXQuYm9keSAhPSBudWxsIHx8IChpc1JlcXVlc3QoaW5wdXQpICYmIGlucHV0LmJvZHkgIT09IG51bGwpKSAmJlxuXHRcdFx0KG1ldGhvZCA9PT0gJ0dFVCcgfHwgbWV0aG9kID09PSAnSEVBRCcpKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdSZXF1ZXN0IHdpdGggR0VUL0hFQUQgbWV0aG9kIGNhbm5vdCBoYXZlIGJvZHknKTtcblx0XHR9XG5cblx0XHRjb25zdCBpbnB1dEJvZHkgPSBpbml0LmJvZHkgP1xuXHRcdFx0aW5pdC5ib2R5IDpcblx0XHRcdChpc1JlcXVlc3QoaW5wdXQpICYmIGlucHV0LmJvZHkgIT09IG51bGwgP1xuXHRcdFx0XHRjbG9uZShpbnB1dCkgOlxuXHRcdFx0XHRudWxsKTtcblxuXHRcdHN1cGVyKGlucHV0Qm9keSwge1xuXHRcdFx0c2l6ZTogaW5pdC5zaXplIHx8IGlucHV0LnNpemUgfHwgMFxuXHRcdH0pO1xuXG5cdFx0Y29uc3QgaGVhZGVycyA9IG5ldyBIZWFkZXJzKGluaXQuaGVhZGVycyB8fCBpbnB1dC5oZWFkZXJzIHx8IHt9KTtcblxuXHRcdGlmIChpbnB1dEJvZHkgIT09IG51bGwgJiYgIWhlYWRlcnMuaGFzKCdDb250ZW50LVR5cGUnKSkge1xuXHRcdFx0Y29uc3QgY29udGVudFR5cGUgPSBleHRyYWN0Q29udGVudFR5cGUoaW5wdXRCb2R5LCB0aGlzKTtcblx0XHRcdGlmIChjb250ZW50VHlwZSkge1xuXHRcdFx0XHRoZWFkZXJzLnNldCgnQ29udGVudC1UeXBlJywgY29udGVudFR5cGUpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGxldCBzaWduYWwgPSBpc1JlcXVlc3QoaW5wdXQpID9cblx0XHRcdGlucHV0LnNpZ25hbCA6XG5cdFx0XHRudWxsO1xuXHRcdGlmICgnc2lnbmFsJyBpbiBpbml0KSB7XG5cdFx0XHRzaWduYWwgPSBpbml0LnNpZ25hbDtcblx0XHR9XG5cblx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZXEtbnVsbCwgZXFlcWVxXG5cdFx0aWYgKHNpZ25hbCAhPSBudWxsICYmICFpc0Fib3J0U2lnbmFsKHNpZ25hbCkpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIHNpZ25hbCB0byBiZSBhbiBpbnN0YW5jZW9mIEFib3J0U2lnbmFsIG9yIEV2ZW50VGFyZ2V0Jyk7XG5cdFx0fVxuXG5cdFx0Ly8gXHUwMEE3NS40LCBSZXF1ZXN0IGNvbnN0cnVjdG9yIHN0ZXBzLCBzdGVwIDE1LjFcblx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZXEtbnVsbCwgZXFlcWVxXG5cdFx0bGV0IHJlZmVycmVyID0gaW5pdC5yZWZlcnJlciA9PSBudWxsID8gaW5wdXQucmVmZXJyZXIgOiBpbml0LnJlZmVycmVyO1xuXHRcdGlmIChyZWZlcnJlciA9PT0gJycpIHtcblx0XHRcdC8vIFx1MDBBNzUuNCwgUmVxdWVzdCBjb25zdHJ1Y3RvciBzdGVwcywgc3RlcCAxNS4yXG5cdFx0XHRyZWZlcnJlciA9ICduby1yZWZlcnJlcic7XG5cdFx0fSBlbHNlIGlmIChyZWZlcnJlcikge1xuXHRcdFx0Ly8gXHUwMEE3NS40LCBSZXF1ZXN0IGNvbnN0cnVjdG9yIHN0ZXBzLCBzdGVwIDE1LjMuMSwgMTUuMy4yXG5cdFx0XHRjb25zdCBwYXJzZWRSZWZlcnJlciA9IG5ldyBVUkwocmVmZXJyZXIpO1xuXHRcdFx0Ly8gXHUwMEE3NS40LCBSZXF1ZXN0IGNvbnN0cnVjdG9yIHN0ZXBzLCBzdGVwIDE1LjMuMywgMTUuMy40XG5cdFx0XHRyZWZlcnJlciA9IC9eYWJvdXQ6KFxcL1xcLyk/Y2xpZW50JC8udGVzdChwYXJzZWRSZWZlcnJlcikgPyAnY2xpZW50JyA6IHBhcnNlZFJlZmVycmVyO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZWZlcnJlciA9IHVuZGVmaW5lZDtcblx0XHR9XG5cblx0XHR0aGlzW0lOVEVSTkFMU10gPSB7XG5cdFx0XHRtZXRob2QsXG5cdFx0XHRyZWRpcmVjdDogaW5pdC5yZWRpcmVjdCB8fCBpbnB1dC5yZWRpcmVjdCB8fCAnZm9sbG93Jyxcblx0XHRcdGhlYWRlcnMsXG5cdFx0XHRwYXJzZWRVUkwsXG5cdFx0XHRzaWduYWwsXG5cdFx0XHRyZWZlcnJlclxuXHRcdH07XG5cblx0XHQvLyBOb2RlLWZldGNoLW9ubHkgb3B0aW9uc1xuXHRcdHRoaXMuZm9sbG93ID0gaW5pdC5mb2xsb3cgPT09IHVuZGVmaW5lZCA/IChpbnB1dC5mb2xsb3cgPT09IHVuZGVmaW5lZCA/IDIwIDogaW5wdXQuZm9sbG93KSA6IGluaXQuZm9sbG93O1xuXHRcdHRoaXMuY29tcHJlc3MgPSBpbml0LmNvbXByZXNzID09PSB1bmRlZmluZWQgPyAoaW5wdXQuY29tcHJlc3MgPT09IHVuZGVmaW5lZCA/IHRydWUgOiBpbnB1dC5jb21wcmVzcykgOiBpbml0LmNvbXByZXNzO1xuXHRcdHRoaXMuY291bnRlciA9IGluaXQuY291bnRlciB8fCBpbnB1dC5jb3VudGVyIHx8IDA7XG5cdFx0dGhpcy5hZ2VudCA9IGluaXQuYWdlbnQgfHwgaW5wdXQuYWdlbnQ7XG5cdFx0dGhpcy5oaWdoV2F0ZXJNYXJrID0gaW5pdC5oaWdoV2F0ZXJNYXJrIHx8IGlucHV0LmhpZ2hXYXRlck1hcmsgfHwgMTYzODQ7XG5cdFx0dGhpcy5pbnNlY3VyZUhUVFBQYXJzZXIgPSBpbml0Lmluc2VjdXJlSFRUUFBhcnNlciB8fCBpbnB1dC5pbnNlY3VyZUhUVFBQYXJzZXIgfHwgZmFsc2U7XG5cblx0XHQvLyBcdTAwQTc1LjQsIFJlcXVlc3QgY29uc3RydWN0b3Igc3RlcHMsIHN0ZXAgMTYuXG5cdFx0Ly8gRGVmYXVsdCBpcyBlbXB0eSBzdHJpbmcgcGVyIGh0dHBzOi8vZmV0Y2guc3BlYy53aGF0d2cub3JnLyNjb25jZXB0LXJlcXVlc3QtcmVmZXJyZXItcG9saWN5XG5cdFx0dGhpcy5yZWZlcnJlclBvbGljeSA9IGluaXQucmVmZXJyZXJQb2xpY3kgfHwgaW5wdXQucmVmZXJyZXJQb2xpY3kgfHwgJyc7XG5cdH1cblxuXHQvKiogQHJldHVybnMge3N0cmluZ30gKi9cblx0Z2V0IG1ldGhvZCgpIHtcblx0XHRyZXR1cm4gdGhpc1tJTlRFUk5BTFNdLm1ldGhvZDtcblx0fVxuXG5cdC8qKiBAcmV0dXJucyB7c3RyaW5nfSAqL1xuXHRnZXQgdXJsKCkge1xuXHRcdHJldHVybiBmb3JtYXRVcmwodGhpc1tJTlRFUk5BTFNdLnBhcnNlZFVSTCk7XG5cdH1cblxuXHQvKiogQHJldHVybnMge0hlYWRlcnN9ICovXG5cdGdldCBoZWFkZXJzKCkge1xuXHRcdHJldHVybiB0aGlzW0lOVEVSTkFMU10uaGVhZGVycztcblx0fVxuXG5cdGdldCByZWRpcmVjdCgpIHtcblx0XHRyZXR1cm4gdGhpc1tJTlRFUk5BTFNdLnJlZGlyZWN0O1xuXHR9XG5cblx0LyoqIEByZXR1cm5zIHtBYm9ydFNpZ25hbH0gKi9cblx0Z2V0IHNpZ25hbCgpIHtcblx0XHRyZXR1cm4gdGhpc1tJTlRFUk5BTFNdLnNpZ25hbDtcblx0fVxuXG5cdC8vIGh0dHBzOi8vZmV0Y2guc3BlYy53aGF0d2cub3JnLyNkb20tcmVxdWVzdC1yZWZlcnJlclxuXHRnZXQgcmVmZXJyZXIoKSB7XG5cdFx0aWYgKHRoaXNbSU5URVJOQUxTXS5yZWZlcnJlciA9PT0gJ25vLXJlZmVycmVyJykge1xuXHRcdFx0cmV0dXJuICcnO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzW0lOVEVSTkFMU10ucmVmZXJyZXIgPT09ICdjbGllbnQnKSB7XG5cdFx0XHRyZXR1cm4gJ2Fib3V0OmNsaWVudCc7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXNbSU5URVJOQUxTXS5yZWZlcnJlcikge1xuXHRcdFx0cmV0dXJuIHRoaXNbSU5URVJOQUxTXS5yZWZlcnJlci50b1N0cmluZygpO1xuXHRcdH1cblxuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdH1cblxuXHRnZXQgcmVmZXJyZXJQb2xpY3koKSB7XG5cdFx0cmV0dXJuIHRoaXNbSU5URVJOQUxTXS5yZWZlcnJlclBvbGljeTtcblx0fVxuXG5cdHNldCByZWZlcnJlclBvbGljeShyZWZlcnJlclBvbGljeSkge1xuXHRcdHRoaXNbSU5URVJOQUxTXS5yZWZlcnJlclBvbGljeSA9IHZhbGlkYXRlUmVmZXJyZXJQb2xpY3kocmVmZXJyZXJQb2xpY3kpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENsb25lIHRoaXMgcmVxdWVzdFxuXHQgKlxuXHQgKiBAcmV0dXJuICBSZXF1ZXN0XG5cdCAqL1xuXHRjbG9uZSgpIHtcblx0XHRyZXR1cm4gbmV3IFJlcXVlc3QodGhpcyk7XG5cdH1cblxuXHRnZXQgW1N5bWJvbC50b1N0cmluZ1RhZ10oKSB7XG5cdFx0cmV0dXJuICdSZXF1ZXN0Jztcblx0fVxufVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyhSZXF1ZXN0LnByb3RvdHlwZSwge1xuXHRtZXRob2Q6IHtlbnVtZXJhYmxlOiB0cnVlfSxcblx0dXJsOiB7ZW51bWVyYWJsZTogdHJ1ZX0sXG5cdGhlYWRlcnM6IHtlbnVtZXJhYmxlOiB0cnVlfSxcblx0cmVkaXJlY3Q6IHtlbnVtZXJhYmxlOiB0cnVlfSxcblx0Y2xvbmU6IHtlbnVtZXJhYmxlOiB0cnVlfSxcblx0c2lnbmFsOiB7ZW51bWVyYWJsZTogdHJ1ZX0sXG5cdHJlZmVycmVyOiB7ZW51bWVyYWJsZTogdHJ1ZX0sXG5cdHJlZmVycmVyUG9saWN5OiB7ZW51bWVyYWJsZTogdHJ1ZX1cbn0pO1xuXG4vKipcbiAqIENvbnZlcnQgYSBSZXF1ZXN0IHRvIE5vZGUuanMgaHR0cCByZXF1ZXN0IG9wdGlvbnMuXG4gKlxuICogQHBhcmFtIHtSZXF1ZXN0fSByZXF1ZXN0IC0gQSBSZXF1ZXN0IGluc3RhbmNlXG4gKiBAcmV0dXJuIFRoZSBvcHRpb25zIG9iamVjdCB0byBiZSBwYXNzZWQgdG8gaHR0cC5yZXF1ZXN0XG4gKi9cbmV4cG9ydCBjb25zdCBnZXROb2RlUmVxdWVzdE9wdGlvbnMgPSByZXF1ZXN0ID0+IHtcblx0Y29uc3Qge3BhcnNlZFVSTH0gPSByZXF1ZXN0W0lOVEVSTkFMU107XG5cdGNvbnN0IGhlYWRlcnMgPSBuZXcgSGVhZGVycyhyZXF1ZXN0W0lOVEVSTkFMU10uaGVhZGVycyk7XG5cblx0Ly8gRmV0Y2ggc3RlcCAxLjNcblx0aWYgKCFoZWFkZXJzLmhhcygnQWNjZXB0JykpIHtcblx0XHRoZWFkZXJzLnNldCgnQWNjZXB0JywgJyovKicpO1xuXHR9XG5cblx0Ly8gSFRUUC1uZXR3b3JrLW9yLWNhY2hlIGZldGNoIHN0ZXBzIDIuNC0yLjdcblx0bGV0IGNvbnRlbnRMZW5ndGhWYWx1ZSA9IG51bGw7XG5cdGlmIChyZXF1ZXN0LmJvZHkgPT09IG51bGwgJiYgL14ocG9zdHxwdXQpJC9pLnRlc3QocmVxdWVzdC5tZXRob2QpKSB7XG5cdFx0Y29udGVudExlbmd0aFZhbHVlID0gJzAnO1xuXHR9XG5cblx0aWYgKHJlcXVlc3QuYm9keSAhPT0gbnVsbCkge1xuXHRcdGNvbnN0IHRvdGFsQnl0ZXMgPSBnZXRUb3RhbEJ5dGVzKHJlcXVlc3QpO1xuXHRcdC8vIFNldCBDb250ZW50LUxlbmd0aCBpZiB0b3RhbEJ5dGVzIGlzIGEgbnVtYmVyICh0aGF0IGlzIG5vdCBOYU4pXG5cdFx0aWYgKHR5cGVvZiB0b3RhbEJ5dGVzID09PSAnbnVtYmVyJyAmJiAhTnVtYmVyLmlzTmFOKHRvdGFsQnl0ZXMpKSB7XG5cdFx0XHRjb250ZW50TGVuZ3RoVmFsdWUgPSBTdHJpbmcodG90YWxCeXRlcyk7XG5cdFx0fVxuXHR9XG5cblx0aWYgKGNvbnRlbnRMZW5ndGhWYWx1ZSkge1xuXHRcdGhlYWRlcnMuc2V0KCdDb250ZW50LUxlbmd0aCcsIGNvbnRlbnRMZW5ndGhWYWx1ZSk7XG5cdH1cblxuXHQvLyA0LjEuIE1haW4gZmV0Y2gsIHN0ZXAgMi42XG5cdC8vID4gSWYgcmVxdWVzdCdzIHJlZmVycmVyIHBvbGljeSBpcyB0aGUgZW1wdHkgc3RyaW5nLCB0aGVuIHNldCByZXF1ZXN0J3MgcmVmZXJyZXIgcG9saWN5IHRvIHRoZVxuXHQvLyA+IGRlZmF1bHQgcmVmZXJyZXIgcG9saWN5LlxuXHRpZiAocmVxdWVzdC5yZWZlcnJlclBvbGljeSA9PT0gJycpIHtcblx0XHRyZXF1ZXN0LnJlZmVycmVyUG9saWN5ID0gREVGQVVMVF9SRUZFUlJFUl9QT0xJQ1k7XG5cdH1cblxuXHQvLyA0LjEuIE1haW4gZmV0Y2gsIHN0ZXAgMi43XG5cdC8vID4gSWYgcmVxdWVzdCdzIHJlZmVycmVyIGlzIG5vdCBcIm5vLXJlZmVycmVyXCIsIHNldCByZXF1ZXN0J3MgcmVmZXJyZXIgdG8gdGhlIHJlc3VsdCBvZiBpbnZva2luZ1xuXHQvLyA+IGRldGVybWluZSByZXF1ZXN0J3MgcmVmZXJyZXIuXG5cdGlmIChyZXF1ZXN0LnJlZmVycmVyICYmIHJlcXVlc3QucmVmZXJyZXIgIT09ICduby1yZWZlcnJlcicpIHtcblx0XHRyZXF1ZXN0W0lOVEVSTkFMU10ucmVmZXJyZXIgPSBkZXRlcm1pbmVSZXF1ZXN0c1JlZmVycmVyKHJlcXVlc3QpO1xuXHR9IGVsc2Uge1xuXHRcdHJlcXVlc3RbSU5URVJOQUxTXS5yZWZlcnJlciA9ICduby1yZWZlcnJlcic7XG5cdH1cblxuXHQvLyA0LjUuIEhUVFAtbmV0d29yay1vci1jYWNoZSBmZXRjaCwgc3RlcCA2Ljlcblx0Ly8gPiBJZiBodHRwUmVxdWVzdCdzIHJlZmVycmVyIGlzIGEgVVJMLCB0aGVuIGFwcGVuZCBgUmVmZXJlcmAvaHR0cFJlcXVlc3QncyByZWZlcnJlciwgc2VyaWFsaXplZFxuXHQvLyA+ICBhbmQgaXNvbW9ycGhpYyBlbmNvZGVkLCB0byBodHRwUmVxdWVzdCdzIGhlYWRlciBsaXN0LlxuXHRpZiAocmVxdWVzdFtJTlRFUk5BTFNdLnJlZmVycmVyIGluc3RhbmNlb2YgVVJMKSB7XG5cdFx0aGVhZGVycy5zZXQoJ1JlZmVyZXInLCByZXF1ZXN0LnJlZmVycmVyKTtcblx0fVxuXG5cdC8vIEhUVFAtbmV0d29yay1vci1jYWNoZSBmZXRjaCBzdGVwIDIuMTFcblx0aWYgKCFoZWFkZXJzLmhhcygnVXNlci1BZ2VudCcpKSB7XG5cdFx0aGVhZGVycy5zZXQoJ1VzZXItQWdlbnQnLCAnbm9kZS1mZXRjaCcpO1xuXHR9XG5cblx0Ly8gSFRUUC1uZXR3b3JrLW9yLWNhY2hlIGZldGNoIHN0ZXAgMi4xNVxuXHRpZiAocmVxdWVzdC5jb21wcmVzcyAmJiAhaGVhZGVycy5oYXMoJ0FjY2VwdC1FbmNvZGluZycpKSB7XG5cdFx0aGVhZGVycy5zZXQoJ0FjY2VwdC1FbmNvZGluZycsICdnemlwLCBkZWZsYXRlLCBicicpO1xuXHR9XG5cblx0bGV0IHthZ2VudH0gPSByZXF1ZXN0O1xuXHRpZiAodHlwZW9mIGFnZW50ID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0YWdlbnQgPSBhZ2VudChwYXJzZWRVUkwpO1xuXHR9XG5cblx0Ly8gSFRUUC1uZXR3b3JrIGZldGNoIHN0ZXAgNC4yXG5cdC8vIGNodW5rZWQgZW5jb2RpbmcgaXMgaGFuZGxlZCBieSBOb2RlLmpzXG5cblx0Y29uc3Qgc2VhcmNoID0gZ2V0U2VhcmNoKHBhcnNlZFVSTCk7XG5cblx0Ly8gUGFzcyB0aGUgZnVsbCBVUkwgZGlyZWN0bHkgdG8gcmVxdWVzdCgpLCBidXQgb3ZlcndyaXRlIHRoZSBmb2xsb3dpbmdcblx0Ly8gb3B0aW9uczpcblx0Y29uc3Qgb3B0aW9ucyA9IHtcblx0XHQvLyBPdmVyd3JpdGUgc2VhcmNoIHRvIHJldGFpbiB0cmFpbGluZyA/IChpc3N1ZSAjNzc2KVxuXHRcdHBhdGg6IHBhcnNlZFVSTC5wYXRobmFtZSArIHNlYXJjaCxcblx0XHQvLyBUaGUgZm9sbG93aW5nIG9wdGlvbnMgYXJlIG5vdCBleHByZXNzZWQgaW4gdGhlIFVSTFxuXHRcdG1ldGhvZDogcmVxdWVzdC5tZXRob2QsXG5cdFx0aGVhZGVyczogaGVhZGVyc1tTeW1ib2wuZm9yKCdub2RlanMudXRpbC5pbnNwZWN0LmN1c3RvbScpXSgpLFxuXHRcdGluc2VjdXJlSFRUUFBhcnNlcjogcmVxdWVzdC5pbnNlY3VyZUhUVFBQYXJzZXIsXG5cdFx0YWdlbnRcblx0fTtcblxuXHRyZXR1cm4ge1xuXHRcdC8qKiBAdHlwZSB7VVJMfSAqL1xuXHRcdHBhcnNlZFVSTCxcblx0XHRvcHRpb25zXG5cdH07XG59O1xuIiwgImV4cG9ydCBjb25zdCBnZXRTZWFyY2ggPSBwYXJzZWRVUkwgPT4ge1xuXHRpZiAocGFyc2VkVVJMLnNlYXJjaCkge1xuXHRcdHJldHVybiBwYXJzZWRVUkwuc2VhcmNoO1xuXHR9XG5cblx0Y29uc3QgbGFzdE9mZnNldCA9IHBhcnNlZFVSTC5ocmVmLmxlbmd0aCAtIDE7XG5cdGNvbnN0IGhhc2ggPSBwYXJzZWRVUkwuaGFzaCB8fCAocGFyc2VkVVJMLmhyZWZbbGFzdE9mZnNldF0gPT09ICcjJyA/ICcjJyA6ICcnKTtcblx0cmV0dXJuIHBhcnNlZFVSTC5ocmVmW2xhc3RPZmZzZXQgLSBoYXNoLmxlbmd0aF0gPT09ICc/JyA/ICc/JyA6ICcnO1xufTtcbiIsICJpbXBvcnQge2lzSVB9IGZyb20gJ25vZGU6bmV0JztcblxuLyoqXG4gKiBAZXh0ZXJuYWwgVVJMXG4gKiBAc2VlIHtAbGluayBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvVVJMfFVSTH1cbiAqL1xuXG4vKipcbiAqIEBtb2R1bGUgdXRpbHMvcmVmZXJyZXJcbiAqIEBwcml2YXRlXG4gKi9cblxuLyoqXG4gKiBAc2VlIHtAbGluayBodHRwczovL3czYy5naXRodWIuaW8vd2ViYXBwc2VjLXJlZmVycmVyLXBvbGljeS8jc3RyaXAtdXJsfFJlZmVycmVyIFBvbGljeSBcdTAwQTc4LjQuIFN0cmlwIHVybCBmb3IgdXNlIGFzIGEgcmVmZXJyZXJ9XG4gKiBAcGFyYW0ge3N0cmluZ30gVVJMXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcmlnaW5Pbmx5PWZhbHNlXVxuICovXG5leHBvcnQgZnVuY3Rpb24gc3RyaXBVUkxGb3JVc2VBc0FSZWZlcnJlcih1cmwsIG9yaWdpbk9ubHkgPSBmYWxzZSkge1xuXHQvLyAxLiBJZiB1cmwgaXMgbnVsbCwgcmV0dXJuIG5vIHJlZmVycmVyLlxuXHRpZiAodXJsID09IG51bGwpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1lcS1udWxsLCBlcWVxZXFcblx0XHRyZXR1cm4gJ25vLXJlZmVycmVyJztcblx0fVxuXG5cdHVybCA9IG5ldyBVUkwodXJsKTtcblxuXHQvLyAyLiBJZiB1cmwncyBzY2hlbWUgaXMgYSBsb2NhbCBzY2hlbWUsIHRoZW4gcmV0dXJuIG5vIHJlZmVycmVyLlxuXHRpZiAoL14oYWJvdXR8YmxvYnxkYXRhKTokLy50ZXN0KHVybC5wcm90b2NvbCkpIHtcblx0XHRyZXR1cm4gJ25vLXJlZmVycmVyJztcblx0fVxuXG5cdC8vIDMuIFNldCB1cmwncyB1c2VybmFtZSB0byB0aGUgZW1wdHkgc3RyaW5nLlxuXHR1cmwudXNlcm5hbWUgPSAnJztcblxuXHQvLyA0LiBTZXQgdXJsJ3MgcGFzc3dvcmQgdG8gbnVsbC5cblx0Ly8gTm90ZTogYG51bGxgIGFwcGVhcnMgdG8gYmUgYSBtaXN0YWtlIGFzIHRoaXMgYWN0dWFsbHkgcmVzdWx0cyBpbiB0aGUgcGFzc3dvcmQgYmVpbmcgYFwibnVsbFwiYC5cblx0dXJsLnBhc3N3b3JkID0gJyc7XG5cblx0Ly8gNS4gU2V0IHVybCdzIGZyYWdtZW50IHRvIG51bGwuXG5cdC8vIE5vdGU6IGBudWxsYCBhcHBlYXJzIHRvIGJlIGEgbWlzdGFrZSBhcyB0aGlzIGFjdHVhbGx5IHJlc3VsdHMgaW4gdGhlIGZyYWdtZW50IGJlaW5nIGBcIiNudWxsXCJgLlxuXHR1cmwuaGFzaCA9ICcnO1xuXG5cdC8vIDYuIElmIHRoZSBvcmlnaW4tb25seSBmbGFnIGlzIHRydWUsIHRoZW46XG5cdGlmIChvcmlnaW5Pbmx5KSB7XG5cdFx0Ly8gNi4xLiBTZXQgdXJsJ3MgcGF0aCB0byBudWxsLlxuXHRcdC8vIE5vdGU6IGBudWxsYCBhcHBlYXJzIHRvIGJlIGEgbWlzdGFrZSBhcyB0aGlzIGFjdHVhbGx5IHJlc3VsdHMgaW4gdGhlIHBhdGggYmVpbmcgYFwiL251bGxcImAuXG5cdFx0dXJsLnBhdGhuYW1lID0gJyc7XG5cblx0XHQvLyA2LjIuIFNldCB1cmwncyBxdWVyeSB0byBudWxsLlxuXHRcdC8vIE5vdGU6IGBudWxsYCBhcHBlYXJzIHRvIGJlIGEgbWlzdGFrZSBhcyB0aGlzIGFjdHVhbGx5IHJlc3VsdHMgaW4gdGhlIHF1ZXJ5IGJlaW5nIGBcIj9udWxsXCJgLlxuXHRcdHVybC5zZWFyY2ggPSAnJztcblx0fVxuXG5cdC8vIDcuIFJldHVybiB1cmwuXG5cdHJldHVybiB1cmw7XG59XG5cbi8qKlxuICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93M2MuZ2l0aHViLmlvL3dlYmFwcHNlYy1yZWZlcnJlci1wb2xpY3kvI2VudW1kZWYtcmVmZXJyZXJwb2xpY3l8ZW51bSBSZWZlcnJlclBvbGljeX1cbiAqL1xuZXhwb3J0IGNvbnN0IFJlZmVycmVyUG9saWN5ID0gbmV3IFNldChbXG5cdCcnLFxuXHQnbm8tcmVmZXJyZXInLFxuXHQnbm8tcmVmZXJyZXItd2hlbi1kb3duZ3JhZGUnLFxuXHQnc2FtZS1vcmlnaW4nLFxuXHQnb3JpZ2luJyxcblx0J3N0cmljdC1vcmlnaW4nLFxuXHQnb3JpZ2luLXdoZW4tY3Jvc3Mtb3JpZ2luJyxcblx0J3N0cmljdC1vcmlnaW4td2hlbi1jcm9zcy1vcmlnaW4nLFxuXHQndW5zYWZlLXVybCdcbl0pO1xuXG4vKipcbiAqIEBzZWUge0BsaW5rIGh0dHBzOi8vdzNjLmdpdGh1Yi5pby93ZWJhcHBzZWMtcmVmZXJyZXItcG9saWN5LyNkZWZhdWx0LXJlZmVycmVyLXBvbGljeXxkZWZhdWx0IHJlZmVycmVyIHBvbGljeX1cbiAqL1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfUkVGRVJSRVJfUE9MSUNZID0gJ3N0cmljdC1vcmlnaW4td2hlbi1jcm9zcy1vcmlnaW4nO1xuXG4vKipcbiAqIEBzZWUge0BsaW5rIGh0dHBzOi8vdzNjLmdpdGh1Yi5pby93ZWJhcHBzZWMtcmVmZXJyZXItcG9saWN5LyNyZWZlcnJlci1wb2xpY2llc3xSZWZlcnJlciBQb2xpY3kgXHUwMEE3My4gUmVmZXJyZXIgUG9saWNpZXN9XG4gKiBAcGFyYW0ge3N0cmluZ30gcmVmZXJyZXJQb2xpY3lcbiAqIEByZXR1cm5zIHtzdHJpbmd9IHJlZmVycmVyUG9saWN5XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZVJlZmVycmVyUG9saWN5KHJlZmVycmVyUG9saWN5KSB7XG5cdGlmICghUmVmZXJyZXJQb2xpY3kuaGFzKHJlZmVycmVyUG9saWN5KSkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoYEludmFsaWQgcmVmZXJyZXJQb2xpY3k6ICR7cmVmZXJyZXJQb2xpY3l9YCk7XG5cdH1cblxuXHRyZXR1cm4gcmVmZXJyZXJQb2xpY3k7XG59XG5cbi8qKlxuICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93M2MuZ2l0aHViLmlvL3dlYmFwcHNlYy1zZWN1cmUtY29udGV4dHMvI2lzLW9yaWdpbi10cnVzdHdvcnRoeXxSZWZlcnJlciBQb2xpY3kgXHUwMEE3My4yLiBJcyBvcmlnaW4gcG90ZW50aWFsbHkgdHJ1c3R3b3J0aHk/fVxuICogQHBhcmFtIHtleHRlcm5hbDpVUkx9IHVybFxuICogQHJldHVybnMgYHRydWVgOiBcIlBvdGVudGlhbGx5IFRydXN0d29ydGh5XCIsIGBmYWxzZWA6IFwiTm90IFRydXN0d29ydGh5XCJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzT3JpZ2luUG90ZW50aWFsbHlUcnVzdHdvcnRoeSh1cmwpIHtcblx0Ly8gMS4gSWYgb3JpZ2luIGlzIGFuIG9wYXF1ZSBvcmlnaW4sIHJldHVybiBcIk5vdCBUcnVzdHdvcnRoeVwiLlxuXHQvLyBOb3QgYXBwbGljYWJsZVxuXG5cdC8vIDIuIEFzc2VydDogb3JpZ2luIGlzIGEgdHVwbGUgb3JpZ2luLlxuXHQvLyBOb3QgZm9yIGltcGxlbWVudGF0aW9uc1xuXG5cdC8vIDMuIElmIG9yaWdpbidzIHNjaGVtZSBpcyBlaXRoZXIgXCJodHRwc1wiIG9yIFwid3NzXCIsIHJldHVybiBcIlBvdGVudGlhbGx5IFRydXN0d29ydGh5XCIuXG5cdGlmICgvXihodHRwfHdzKXM6JC8udGVzdCh1cmwucHJvdG9jb2wpKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvLyA0LiBJZiBvcmlnaW4ncyBob3N0IGNvbXBvbmVudCBtYXRjaGVzIG9uZSBvZiB0aGUgQ0lEUiBub3RhdGlvbnMgMTI3LjAuMC4wLzggb3IgOjoxLzEyOCBbUkZDNDYzMl0sIHJldHVybiBcIlBvdGVudGlhbGx5IFRydXN0d29ydGh5XCIuXG5cdGNvbnN0IGhvc3RJcCA9IHVybC5ob3N0LnJlcGxhY2UoLyheXFxbKXwoXSQpL2csICcnKTtcblx0Y29uc3QgaG9zdElQVmVyc2lvbiA9IGlzSVAoaG9zdElwKTtcblxuXHRpZiAoaG9zdElQVmVyc2lvbiA9PT0gNCAmJiAvXjEyN1xcLi8udGVzdChob3N0SXApKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRpZiAoaG9zdElQVmVyc2lvbiA9PT0gNiAmJiAvXigoKDArOil7N30pfCg6OigwKzopezAsNn0pKTAqMSQvLnRlc3QoaG9zdElwKSkge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0Ly8gNS4gSWYgb3JpZ2luJ3MgaG9zdCBjb21wb25lbnQgaXMgXCJsb2NhbGhvc3RcIiBvciBmYWxscyB3aXRoaW4gXCIubG9jYWxob3N0XCIsIGFuZCB0aGUgdXNlciBhZ2VudCBjb25mb3JtcyB0byB0aGUgbmFtZSByZXNvbHV0aW9uIHJ1bGVzIGluIFtsZXQtbG9jYWxob3N0LWJlLWxvY2FsaG9zdF0sIHJldHVybiBcIlBvdGVudGlhbGx5IFRydXN0d29ydGh5XCIuXG5cdC8vIFdlIGFyZSByZXR1cm5pbmcgRkFMU0UgaGVyZSBiZWNhdXNlIHdlIGNhbm5vdCBlbnN1cmUgY29uZm9ybWFuY2UgdG9cblx0Ly8gbGV0LWxvY2FsaG9zdC1iZS1sb2FsaG9zdCAoaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL2RyYWZ0LXdlc3QtbGV0LWxvY2FsaG9zdC1iZS1sb2NhbGhvc3QpXG5cdGlmICh1cmwuaG9zdCA9PT0gJ2xvY2FsaG9zdCcgfHwgdXJsLmhvc3QuZW5kc1dpdGgoJy5sb2NhbGhvc3QnKSkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8vIDYuIElmIG9yaWdpbidzIHNjaGVtZSBjb21wb25lbnQgaXMgZmlsZSwgcmV0dXJuIFwiUG90ZW50aWFsbHkgVHJ1c3R3b3J0aHlcIi5cblx0aWYgKHVybC5wcm90b2NvbCA9PT0gJ2ZpbGU6Jykge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0Ly8gNy4gSWYgb3JpZ2luJ3Mgc2NoZW1lIGNvbXBvbmVudCBpcyBvbmUgd2hpY2ggdGhlIHVzZXIgYWdlbnQgY29uc2lkZXJzIHRvIGJlIGF1dGhlbnRpY2F0ZWQsIHJldHVybiBcIlBvdGVudGlhbGx5IFRydXN0d29ydGh5XCIuXG5cdC8vIE5vdCBzdXBwb3J0ZWRcblxuXHQvLyA4LiBJZiBvcmlnaW4gaGFzIGJlZW4gY29uZmlndXJlZCBhcyBhIHRydXN0d29ydGh5IG9yaWdpbiwgcmV0dXJuIFwiUG90ZW50aWFsbHkgVHJ1c3R3b3J0aHlcIi5cblx0Ly8gTm90IHN1cHBvcnRlZFxuXG5cdC8vIDkuIFJldHVybiBcIk5vdCBUcnVzdHdvcnRoeVwiLlxuXHRyZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93M2MuZ2l0aHViLmlvL3dlYmFwcHNlYy1zZWN1cmUtY29udGV4dHMvI2lzLXVybC10cnVzdHdvcnRoeXxSZWZlcnJlciBQb2xpY3kgXHUwMEE3My4zLiBJcyB1cmwgcG90ZW50aWFsbHkgdHJ1c3R3b3J0aHk/fVxuICogQHBhcmFtIHtleHRlcm5hbDpVUkx9IHVybFxuICogQHJldHVybnMgYHRydWVgOiBcIlBvdGVudGlhbGx5IFRydXN0d29ydGh5XCIsIGBmYWxzZWA6IFwiTm90IFRydXN0d29ydGh5XCJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzVXJsUG90ZW50aWFsbHlUcnVzdHdvcnRoeSh1cmwpIHtcblx0Ly8gMS4gSWYgdXJsIGlzIFwiYWJvdXQ6YmxhbmtcIiBvciBcImFib3V0OnNyY2RvY1wiLCByZXR1cm4gXCJQb3RlbnRpYWxseSBUcnVzdHdvcnRoeVwiLlxuXHRpZiAoL15hYm91dDooYmxhbmt8c3JjZG9jKSQvLnRlc3QodXJsKSkge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0Ly8gMi4gSWYgdXJsJ3Mgc2NoZW1lIGlzIFwiZGF0YVwiLCByZXR1cm4gXCJQb3RlbnRpYWxseSBUcnVzdHdvcnRoeVwiLlxuXHRpZiAodXJsLnByb3RvY29sID09PSAnZGF0YTonKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvLyBOb3RlOiBUaGUgb3JpZ2luIG9mIGJsb2I6IGFuZCBmaWxlc3lzdGVtOiBVUkxzIGlzIHRoZSBvcmlnaW4gb2YgdGhlIGNvbnRleHQgaW4gd2hpY2ggdGhleSB3ZXJlXG5cdC8vIGNyZWF0ZWQuIFRoZXJlZm9yZSwgYmxvYnMgY3JlYXRlZCBpbiBhIHRydXN0d29ydGh5IG9yaWdpbiB3aWxsIHRoZW1zZWx2ZXMgYmUgcG90ZW50aWFsbHlcblx0Ly8gdHJ1c3R3b3J0aHkuXG5cdGlmICgvXihibG9ifGZpbGVzeXN0ZW0pOiQvLnRlc3QodXJsLnByb3RvY29sKSkge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0Ly8gMy4gUmV0dXJuIHRoZSByZXN1bHQgb2YgZXhlY3V0aW5nIFx1MDBBNzMuMiBJcyBvcmlnaW4gcG90ZW50aWFsbHkgdHJ1c3R3b3J0aHk/IG9uIHVybCdzIG9yaWdpbi5cblx0cmV0dXJuIGlzT3JpZ2luUG90ZW50aWFsbHlUcnVzdHdvcnRoeSh1cmwpO1xufVxuXG4vKipcbiAqIE1vZGlmaWVzIHRoZSByZWZlcnJlclVSTCB0byBlbmZvcmNlIGFueSBleHRyYSBzZWN1cml0eSBwb2xpY3kgY29uc2lkZXJhdGlvbnMuXG4gKiBAc2VlIHtAbGluayBodHRwczovL3czYy5naXRodWIuaW8vd2ViYXBwc2VjLXJlZmVycmVyLXBvbGljeS8jZGV0ZXJtaW5lLXJlcXVlc3RzLXJlZmVycmVyfFJlZmVycmVyIFBvbGljeSBcdTAwQTc4LjMuIERldGVybWluZSByZXF1ZXN0J3MgUmVmZXJyZXJ9LCBzdGVwIDdcbiAqIEBjYWxsYmFjayBtb2R1bGU6dXRpbHMvcmVmZXJyZXJ+cmVmZXJyZXJVUkxDYWxsYmFja1xuICogQHBhcmFtIHtleHRlcm5hbDpVUkx9IHJlZmVycmVyVVJMXG4gKiBAcmV0dXJucyB7ZXh0ZXJuYWw6VVJMfSBtb2RpZmllZCByZWZlcnJlclVSTFxuICovXG5cbi8qKlxuICogTW9kaWZpZXMgdGhlIHJlZmVycmVyT3JpZ2luIHRvIGVuZm9yY2UgYW55IGV4dHJhIHNlY3VyaXR5IHBvbGljeSBjb25zaWRlcmF0aW9ucy5cbiAqIEBzZWUge0BsaW5rIGh0dHBzOi8vdzNjLmdpdGh1Yi5pby93ZWJhcHBzZWMtcmVmZXJyZXItcG9saWN5LyNkZXRlcm1pbmUtcmVxdWVzdHMtcmVmZXJyZXJ8UmVmZXJyZXIgUG9saWN5IFx1MDBBNzguMy4gRGV0ZXJtaW5lIHJlcXVlc3QncyBSZWZlcnJlcn0sIHN0ZXAgN1xuICogQGNhbGxiYWNrIG1vZHVsZTp1dGlscy9yZWZlcnJlcn5yZWZlcnJlck9yaWdpbkNhbGxiYWNrXG4gKiBAcGFyYW0ge2V4dGVybmFsOlVSTH0gcmVmZXJyZXJPcmlnaW5cbiAqIEByZXR1cm5zIHtleHRlcm5hbDpVUkx9IG1vZGlmaWVkIHJlZmVycmVyT3JpZ2luXG4gKi9cblxuLyoqXG4gKiBAc2VlIHtAbGluayBodHRwczovL3czYy5naXRodWIuaW8vd2ViYXBwc2VjLXJlZmVycmVyLXBvbGljeS8jZGV0ZXJtaW5lLXJlcXVlc3RzLXJlZmVycmVyfFJlZmVycmVyIFBvbGljeSBcdTAwQTc4LjMuIERldGVybWluZSByZXF1ZXN0J3MgUmVmZXJyZXJ9XG4gKiBAcGFyYW0ge1JlcXVlc3R9IHJlcXVlc3RcbiAqIEBwYXJhbSB7b2JqZWN0fSBvXG4gKiBAcGFyYW0ge21vZHVsZTp1dGlscy9yZWZlcnJlcn5yZWZlcnJlclVSTENhbGxiYWNrfSBvLnJlZmVycmVyVVJMQ2FsbGJhY2tcbiAqIEBwYXJhbSB7bW9kdWxlOnV0aWxzL3JlZmVycmVyfnJlZmVycmVyT3JpZ2luQ2FsbGJhY2t9IG8ucmVmZXJyZXJPcmlnaW5DYWxsYmFja1xuICogQHJldHVybnMge2V4dGVybmFsOlVSTH0gUmVxdWVzdCdzIHJlZmVycmVyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZXRlcm1pbmVSZXF1ZXN0c1JlZmVycmVyKHJlcXVlc3QsIHtyZWZlcnJlclVSTENhbGxiYWNrLCByZWZlcnJlck9yaWdpbkNhbGxiYWNrfSA9IHt9KSB7XG5cdC8vIFRoZXJlIGFyZSAyIG5vdGVzIGluIHRoZSBzcGVjaWZpY2F0aW9uIGFib3V0IGludmFsaWQgcHJlLWNvbmRpdGlvbnMuICBXZSByZXR1cm4gbnVsbCwgaGVyZSwgZm9yXG5cdC8vIHRoZXNlIGNhc2VzOlxuXHQvLyA+IE5vdGU6IElmIHJlcXVlc3QncyByZWZlcnJlciBpcyBcIm5vLXJlZmVycmVyXCIsIEZldGNoIHdpbGwgbm90IGNhbGwgaW50byB0aGlzIGFsZ29yaXRobS5cblx0Ly8gPiBOb3RlOiBJZiByZXF1ZXN0J3MgcmVmZXJyZXIgcG9saWN5IGlzIHRoZSBlbXB0eSBzdHJpbmcsIEZldGNoIHdpbGwgbm90IGNhbGwgaW50byB0aGlzXG5cdC8vID4gYWxnb3JpdGhtLlxuXHRpZiAocmVxdWVzdC5yZWZlcnJlciA9PT0gJ25vLXJlZmVycmVyJyB8fCByZXF1ZXN0LnJlZmVycmVyUG9saWN5ID09PSAnJykge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0Ly8gMS4gTGV0IHBvbGljeSBiZSByZXF1ZXN0J3MgYXNzb2NpYXRlZCByZWZlcnJlciBwb2xpY3kuXG5cdGNvbnN0IHBvbGljeSA9IHJlcXVlc3QucmVmZXJyZXJQb2xpY3k7XG5cblx0Ly8gMi4gTGV0IGVudmlyb25tZW50IGJlIHJlcXVlc3QncyBjbGllbnQuXG5cdC8vIG5vdCBhcHBsaWNhYmxlIHRvIG5vZGUuanNcblxuXHQvLyAzLiBTd2l0Y2ggb24gcmVxdWVzdCdzIHJlZmVycmVyOlxuXHRpZiAocmVxdWVzdC5yZWZlcnJlciA9PT0gJ2Fib3V0OmNsaWVudCcpIHtcblx0XHRyZXR1cm4gJ25vLXJlZmVycmVyJztcblx0fVxuXG5cdC8vIFwiYSBVUkxcIjogTGV0IHJlZmVycmVyU291cmNlIGJlIHJlcXVlc3QncyByZWZlcnJlci5cblx0Y29uc3QgcmVmZXJyZXJTb3VyY2UgPSByZXF1ZXN0LnJlZmVycmVyO1xuXG5cdC8vIDQuIExldCByZXF1ZXN0J3MgcmVmZXJyZXJVUkwgYmUgdGhlIHJlc3VsdCBvZiBzdHJpcHBpbmcgcmVmZXJyZXJTb3VyY2UgZm9yIHVzZSBhcyBhIHJlZmVycmVyLlxuXHRsZXQgcmVmZXJyZXJVUkwgPSBzdHJpcFVSTEZvclVzZUFzQVJlZmVycmVyKHJlZmVycmVyU291cmNlKTtcblxuXHQvLyA1LiBMZXQgcmVmZXJyZXJPcmlnaW4gYmUgdGhlIHJlc3VsdCBvZiBzdHJpcHBpbmcgcmVmZXJyZXJTb3VyY2UgZm9yIHVzZSBhcyBhIHJlZmVycmVyLCB3aXRoIHRoZVxuXHQvLyAgICBvcmlnaW4tb25seSBmbGFnIHNldCB0byB0cnVlLlxuXHRsZXQgcmVmZXJyZXJPcmlnaW4gPSBzdHJpcFVSTEZvclVzZUFzQVJlZmVycmVyKHJlZmVycmVyU291cmNlLCB0cnVlKTtcblxuXHQvLyA2LiBJZiB0aGUgcmVzdWx0IG9mIHNlcmlhbGl6aW5nIHJlZmVycmVyVVJMIGlzIGEgc3RyaW5nIHdob3NlIGxlbmd0aCBpcyBncmVhdGVyIHRoYW4gNDA5Niwgc2V0XG5cdC8vICAgIHJlZmVycmVyVVJMIHRvIHJlZmVycmVyT3JpZ2luLlxuXHRpZiAocmVmZXJyZXJVUkwudG9TdHJpbmcoKS5sZW5ndGggPiA0MDk2KSB7XG5cdFx0cmVmZXJyZXJVUkwgPSByZWZlcnJlck9yaWdpbjtcblx0fVxuXG5cdC8vIDcuIFRoZSB1c2VyIGFnZW50IE1BWSBhbHRlciByZWZlcnJlclVSTCBvciByZWZlcnJlck9yaWdpbiBhdCB0aGlzIHBvaW50IHRvIGVuZm9yY2UgYXJiaXRyYXJ5XG5cdC8vICAgIHBvbGljeSBjb25zaWRlcmF0aW9ucyBpbiB0aGUgaW50ZXJlc3RzIG9mIG1pbmltaXppbmcgZGF0YSBsZWFrYWdlLiBGb3IgZXhhbXBsZSwgdGhlIHVzZXJcblx0Ly8gICAgYWdlbnQgY291bGQgc3RyaXAgdGhlIFVSTCBkb3duIHRvIGFuIG9yaWdpbiwgbW9kaWZ5IGl0cyBob3N0LCByZXBsYWNlIGl0IHdpdGggYW4gZW1wdHlcblx0Ly8gICAgc3RyaW5nLCBldGMuXG5cdGlmIChyZWZlcnJlclVSTENhbGxiYWNrKSB7XG5cdFx0cmVmZXJyZXJVUkwgPSByZWZlcnJlclVSTENhbGxiYWNrKHJlZmVycmVyVVJMKTtcblx0fVxuXG5cdGlmIChyZWZlcnJlck9yaWdpbkNhbGxiYWNrKSB7XG5cdFx0cmVmZXJyZXJPcmlnaW4gPSByZWZlcnJlck9yaWdpbkNhbGxiYWNrKHJlZmVycmVyT3JpZ2luKTtcblx0fVxuXG5cdC8vIDguRXhlY3V0ZSB0aGUgc3RhdGVtZW50cyBjb3JyZXNwb25kaW5nIHRvIHRoZSB2YWx1ZSBvZiBwb2xpY3k6XG5cdGNvbnN0IGN1cnJlbnRVUkwgPSBuZXcgVVJMKHJlcXVlc3QudXJsKTtcblxuXHRzd2l0Y2ggKHBvbGljeSkge1xuXHRcdGNhc2UgJ25vLXJlZmVycmVyJzpcblx0XHRcdHJldHVybiAnbm8tcmVmZXJyZXInO1xuXG5cdFx0Y2FzZSAnb3JpZ2luJzpcblx0XHRcdHJldHVybiByZWZlcnJlck9yaWdpbjtcblxuXHRcdGNhc2UgJ3Vuc2FmZS11cmwnOlxuXHRcdFx0cmV0dXJuIHJlZmVycmVyVVJMO1xuXG5cdFx0Y2FzZSAnc3RyaWN0LW9yaWdpbic6XG5cdFx0XHQvLyAxLiBJZiByZWZlcnJlclVSTCBpcyBhIHBvdGVudGlhbGx5IHRydXN0d29ydGh5IFVSTCBhbmQgcmVxdWVzdCdzIGN1cnJlbnQgVVJMIGlzIG5vdCBhXG5cdFx0XHQvLyAgICBwb3RlbnRpYWxseSB0cnVzdHdvcnRoeSBVUkwsIHRoZW4gcmV0dXJuIG5vIHJlZmVycmVyLlxuXHRcdFx0aWYgKGlzVXJsUG90ZW50aWFsbHlUcnVzdHdvcnRoeShyZWZlcnJlclVSTCkgJiYgIWlzVXJsUG90ZW50aWFsbHlUcnVzdHdvcnRoeShjdXJyZW50VVJMKSkge1xuXHRcdFx0XHRyZXR1cm4gJ25vLXJlZmVycmVyJztcblx0XHRcdH1cblxuXHRcdFx0Ly8gMi4gUmV0dXJuIHJlZmVycmVyT3JpZ2luLlxuXHRcdFx0cmV0dXJuIHJlZmVycmVyT3JpZ2luLnRvU3RyaW5nKCk7XG5cblx0XHRjYXNlICdzdHJpY3Qtb3JpZ2luLXdoZW4tY3Jvc3Mtb3JpZ2luJzpcblx0XHRcdC8vIDEuIElmIHRoZSBvcmlnaW4gb2YgcmVmZXJyZXJVUkwgYW5kIHRoZSBvcmlnaW4gb2YgcmVxdWVzdCdzIGN1cnJlbnQgVVJMIGFyZSB0aGUgc2FtZSwgdGhlblxuXHRcdFx0Ly8gICAgcmV0dXJuIHJlZmVycmVyVVJMLlxuXHRcdFx0aWYgKHJlZmVycmVyVVJMLm9yaWdpbiA9PT0gY3VycmVudFVSTC5vcmlnaW4pIHtcblx0XHRcdFx0cmV0dXJuIHJlZmVycmVyVVJMO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyAyLiBJZiByZWZlcnJlclVSTCBpcyBhIHBvdGVudGlhbGx5IHRydXN0d29ydGh5IFVSTCBhbmQgcmVxdWVzdCdzIGN1cnJlbnQgVVJMIGlzIG5vdCBhXG5cdFx0XHQvLyAgICBwb3RlbnRpYWxseSB0cnVzdHdvcnRoeSBVUkwsIHRoZW4gcmV0dXJuIG5vIHJlZmVycmVyLlxuXHRcdFx0aWYgKGlzVXJsUG90ZW50aWFsbHlUcnVzdHdvcnRoeShyZWZlcnJlclVSTCkgJiYgIWlzVXJsUG90ZW50aWFsbHlUcnVzdHdvcnRoeShjdXJyZW50VVJMKSkge1xuXHRcdFx0XHRyZXR1cm4gJ25vLXJlZmVycmVyJztcblx0XHRcdH1cblxuXHRcdFx0Ly8gMy4gUmV0dXJuIHJlZmVycmVyT3JpZ2luLlxuXHRcdFx0cmV0dXJuIHJlZmVycmVyT3JpZ2luO1xuXG5cdFx0Y2FzZSAnc2FtZS1vcmlnaW4nOlxuXHRcdFx0Ly8gMS4gSWYgdGhlIG9yaWdpbiBvZiByZWZlcnJlclVSTCBhbmQgdGhlIG9yaWdpbiBvZiByZXF1ZXN0J3MgY3VycmVudCBVUkwgYXJlIHRoZSBzYW1lLCB0aGVuXG5cdFx0XHQvLyAgICByZXR1cm4gcmVmZXJyZXJVUkwuXG5cdFx0XHRpZiAocmVmZXJyZXJVUkwub3JpZ2luID09PSBjdXJyZW50VVJMLm9yaWdpbikge1xuXHRcdFx0XHRyZXR1cm4gcmVmZXJyZXJVUkw7XG5cdFx0XHR9XG5cblx0XHRcdC8vIDIuIFJldHVybiBubyByZWZlcnJlci5cblx0XHRcdHJldHVybiAnbm8tcmVmZXJyZXInO1xuXG5cdFx0Y2FzZSAnb3JpZ2luLXdoZW4tY3Jvc3Mtb3JpZ2luJzpcblx0XHRcdC8vIDEuIElmIHRoZSBvcmlnaW4gb2YgcmVmZXJyZXJVUkwgYW5kIHRoZSBvcmlnaW4gb2YgcmVxdWVzdCdzIGN1cnJlbnQgVVJMIGFyZSB0aGUgc2FtZSwgdGhlblxuXHRcdFx0Ly8gICAgcmV0dXJuIHJlZmVycmVyVVJMLlxuXHRcdFx0aWYgKHJlZmVycmVyVVJMLm9yaWdpbiA9PT0gY3VycmVudFVSTC5vcmlnaW4pIHtcblx0XHRcdFx0cmV0dXJuIHJlZmVycmVyVVJMO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBSZXR1cm4gcmVmZXJyZXJPcmlnaW4uXG5cdFx0XHRyZXR1cm4gcmVmZXJyZXJPcmlnaW47XG5cblx0XHRjYXNlICduby1yZWZlcnJlci13aGVuLWRvd25ncmFkZSc6XG5cdFx0XHQvLyAxLiBJZiByZWZlcnJlclVSTCBpcyBhIHBvdGVudGlhbGx5IHRydXN0d29ydGh5IFVSTCBhbmQgcmVxdWVzdCdzIGN1cnJlbnQgVVJMIGlzIG5vdCBhXG5cdFx0XHQvLyAgICBwb3RlbnRpYWxseSB0cnVzdHdvcnRoeSBVUkwsIHRoZW4gcmV0dXJuIG5vIHJlZmVycmVyLlxuXHRcdFx0aWYgKGlzVXJsUG90ZW50aWFsbHlUcnVzdHdvcnRoeShyZWZlcnJlclVSTCkgJiYgIWlzVXJsUG90ZW50aWFsbHlUcnVzdHdvcnRoeShjdXJyZW50VVJMKSkge1xuXHRcdFx0XHRyZXR1cm4gJ25vLXJlZmVycmVyJztcblx0XHRcdH1cblxuXHRcdFx0Ly8gMi4gUmV0dXJuIHJlZmVycmVyVVJMLlxuXHRcdFx0cmV0dXJuIHJlZmVycmVyVVJMO1xuXG5cdFx0ZGVmYXVsdDpcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoYEludmFsaWQgcmVmZXJyZXJQb2xpY3k6ICR7cG9saWN5fWApO1xuXHR9XG59XG5cbi8qKlxuICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93M2MuZ2l0aHViLmlvL3dlYmFwcHNlYy1yZWZlcnJlci1wb2xpY3kvI3BhcnNlLXJlZmVycmVyLXBvbGljeS1mcm9tLWhlYWRlcnxSZWZlcnJlciBQb2xpY3kgXHUwMEE3OC4xLiBQYXJzZSBhIHJlZmVycmVyIHBvbGljeSBmcm9tIGEgUmVmZXJyZXItUG9saWN5IGhlYWRlcn1cbiAqIEBwYXJhbSB7SGVhZGVyc30gaGVhZGVycyBSZXNwb25zZSBoZWFkZXJzXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBwb2xpY3lcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlUmVmZXJyZXJQb2xpY3lGcm9tSGVhZGVyKGhlYWRlcnMpIHtcblx0Ly8gMS4gTGV0IHBvbGljeS10b2tlbnMgYmUgdGhlIHJlc3VsdCBvZiBleHRyYWN0aW5nIGhlYWRlciBsaXN0IHZhbHVlcyBnaXZlbiBgUmVmZXJyZXItUG9saWN5YFxuXHQvLyAgICBhbmQgcmVzcG9uc2VcdTIwMTlzIGhlYWRlciBsaXN0LlxuXHRjb25zdCBwb2xpY3lUb2tlbnMgPSAoaGVhZGVycy5nZXQoJ3JlZmVycmVyLXBvbGljeScpIHx8ICcnKS5zcGxpdCgvWyxcXHNdKy8pO1xuXG5cdC8vIDIuIExldCBwb2xpY3kgYmUgdGhlIGVtcHR5IHN0cmluZy5cblx0bGV0IHBvbGljeSA9ICcnO1xuXG5cdC8vIDMuIEZvciBlYWNoIHRva2VuIGluIHBvbGljeS10b2tlbnMsIGlmIHRva2VuIGlzIGEgcmVmZXJyZXIgcG9saWN5IGFuZCB0b2tlbiBpcyBub3QgdGhlIGVtcHR5XG5cdC8vICAgIHN0cmluZywgdGhlbiBzZXQgcG9saWN5IHRvIHRva2VuLlxuXHQvLyBOb3RlOiBUaGlzIGFsZ29yaXRobSBsb29wcyBvdmVyIG11bHRpcGxlIHBvbGljeSB2YWx1ZXMgdG8gYWxsb3cgZGVwbG95bWVudCBvZiBuZXcgcG9saWN5XG5cdC8vIHZhbHVlcyB3aXRoIGZhbGxiYWNrcyBmb3Igb2xkZXIgdXNlciBhZ2VudHMsIGFzIGRlc2NyaWJlZCBpbiBcdTAwQTcgMTEuMSBVbmtub3duIFBvbGljeSBWYWx1ZXMuXG5cdGZvciAoY29uc3QgdG9rZW4gb2YgcG9saWN5VG9rZW5zKSB7XG5cdFx0aWYgKHRva2VuICYmIFJlZmVycmVyUG9saWN5Lmhhcyh0b2tlbikpIHtcblx0XHRcdHBvbGljeSA9IHRva2VuO1xuXHRcdH1cblx0fVxuXG5cdC8vIDQuIFJldHVybiBwb2xpY3kuXG5cdHJldHVybiBwb2xpY3k7XG59XG4iLCAiaW1wb3J0IHtGZXRjaEJhc2VFcnJvcn0gZnJvbSAnLi9iYXNlLmpzJztcblxuLyoqXG4gKiBBYm9ydEVycm9yIGludGVyZmFjZSBmb3IgY2FuY2VsbGVkIHJlcXVlc3RzXG4gKi9cbmV4cG9ydCBjbGFzcyBBYm9ydEVycm9yIGV4dGVuZHMgRmV0Y2hCYXNlRXJyb3Ige1xuXHRjb25zdHJ1Y3RvcihtZXNzYWdlLCB0eXBlID0gJ2Fib3J0ZWQnKSB7XG5cdFx0c3VwZXIobWVzc2FnZSwgdHlwZSk7XG5cdH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztlQUFnQkEsUUFBSTtBQUNsQixlQUFPO01BQ1Q7QUNDTSxlQUFVLGFBQWFDLElBQU07QUFDakMsZUFBUSxPQUFPQSxPQUFNLFlBQVlBLE9BQU0sUUFBUyxPQUFPQSxPQUFNO01BQy9EO0FBRU8sWUFBTSxpQ0FVUEQ7QUFFVSxlQUFBLGdCQUFnQixJQUFjLE1BQVk7QUFDeEQsWUFBSTtBQUNGLGlCQUFPLGVBQWUsSUFBSSxRQUFRO1lBQ2hDLE9BQU87WUFDUCxjQUFjO1VBQ2YsQ0FBQTtpQkFDREUsS0FBTTs7TUFJVjtBQzFCQSxZQUFNLGtCQUFrQjtBQUN4QixZQUFNLHNCQUFzQixRQUFRLFVBQVU7QUFDOUMsWUFBTSx3QkFBd0IsUUFBUSxPQUFPLEtBQUssZUFBZTtBQUczRCxlQUFVLFdBQWMsVUFHckI7QUFDUCxlQUFPLElBQUksZ0JBQWdCLFFBQVE7TUFDckM7QUFHTSxlQUFVLG9CQUF1QixPQUF5QjtBQUM5RCxlQUFPLFdBQVcsYUFBVyxRQUFRLEtBQUssQ0FBQztNQUM3QztBQUdNLGVBQVUsb0JBQStCLFFBQVc7QUFDeEQsZUFBTyxzQkFBc0IsTUFBTTtNQUNyQztlQUVnQixtQkFDZCxTQUNBLGFBQ0EsWUFBOEQ7QUFHOUQsZUFBTyxvQkFBb0IsS0FB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QkFDeEIsS0FBSyxTQUFTLENBQUM7QUFBQTtBQUFBO0FBQUEsZ0JBR3RCLEtBQUssTUFBTSxPQUFPLFFBQVEsWUFBWSxLQUFLLEtBQUs7QUFBQSwwQkFDdEMsS0FBSyxNQUFNLGdCQUFnQixDQUFDO0FBQUE7QUFBQTtBQUFBLGdCQUd0QyxLQUFLLE1BQU0sS0FBSyxTQUFTLElBQUksQ0FBQyxLQUFLLEtBQUssTUFBTyxLQUFLLFNBQVMsT0FBUSxFQUFFLENBQUM7QUFBQSxpQkFDdkUsS0FBSyxXQUFXLE1BQU07QUFBQSxpQkFDdEIsS0FBSyxTQUFVLEtBQUssU0FBUyxNQUFNLHlCQUFlLGtCQUFjLFNBQVM7QUFBQSxJQUN0RjtBQUVGLFNBQ0U7QUFBQSxJQUFDO0FBQUE7QUFBQSxNQUNDO0FBQUEsTUFDQTtBQUFBLE1BQ0EsVUFDRSxRQUNFLDZDQUFDLGtCQUFPLFVBQVAsRUFDQztBQUFBLG9EQUFDLGtCQUFPLFNBQVMsT0FBaEIsRUFBc0IsT0FBTSxZQUFXLE1BQU0sZ0JBQUssVUFBVSxNQUFNLEtBQUssVUFBVTtBQUFBLFFBQ2xGLDRDQUFDLGtCQUFPLFNBQVMsT0FBaEIsRUFBc0IsT0FBTSxrQkFBaUIsTUFBTSxnQkFBSyxPQUFPLE1BQU0sR0FBRyxLQUFLLFFBQVEsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNO0FBQUEsUUFDM0csNENBQUMsa0JBQU8sU0FBUyxTQUFoQixFQUF3QixPQUFNLGdCQUM3QjtBQUFBLFVBQUMsa0JBQU8sU0FBUyxRQUFRO0FBQUEsVUFBeEI7QUFBQSxZQUNFLE1BQU0sS0FBSyxTQUFTLFlBQVksaUJBQWlCO0FBQUEsWUFDakQsT0FBTyxLQUFLLFNBQVMsWUFBWSxpQkFBTSxRQUFRLGlCQUFNO0FBQUE7QUFBQSxRQUN4RCxHQUNGO0FBQUEsU0FDRjtBQUFBO0FBQUEsRUFHTjtBQUVKOyIsCiAgIm5hbWVzIjogWyJub29wIiwgIngiLCAiX2EiLCAiRiIsICJpIiwgImUiLCAicXVldWVNaWNyb3Rhc2siLCAiciIsICJpc0Fib3J0U2lnbmFsIiwgInN0cmVhbUJyYW5kQ2hlY2tFeGNlcHRpb24iLCAiZGVmYXVsdENvbnRyb2xsZXJCcmFuZENoZWNrRXhjZXB0aW9uIiwgIkRPTUV4Y2VwdGlvbiIsICJSZWFkYWJsZVN0cmVhbSIsICJQT09MX1NJWkUiLCAicHJvY2VzcyIsICJCbG9iIiwgImNsb25lIiwgIkJsb2IiLCAic2l6ZSIsICJGaWxlIiwgIkYiLCAiZiIsICJlIiwgIkZvcm1EYXRhIiwgIm0iLCAiZXhwb3J0cyIsICJtb2R1bGUiLCAiZnMiLCAibSIsICJCb2R5IiwgImYiLCAiaSIsICJjbGVhciIsICJpbXBvcnRfbm9kZV9odHRwIiwgImltcG9ydF9ub2RlX3N0cmVhbSIsICJpbXBvcnRfbm9kZV9idWZmZXIiLCAiaSIsICJTdHJlYW0iLCAidG9Gb3JtRGF0YSIsICJpbXBvcnRfbm9kZV91dGlsIiwgImh0dHAiLCAiSU5URVJOQUxTIiwgImltcG9ydF9ub2RlX3V0aWwiLCAiSU5URVJOQUxTIiwgImZvcm1hdFVybCIsICJyZXNwb25zZSIsICJodHRwcyIsICJodHRwIiwgIlN0cmVhbSIsICJzIiwgInB1bXAiLCAiemxpYiIsICJlIl0KfQo=
