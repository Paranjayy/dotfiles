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

// src/search.tsx
var search_exports = {};
__export(search_exports, {
  default: () => Command
});
module.exports = __toCommonJS(search_exports);
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

// src/search.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function Command() {
  const [items, setItems] = (0, import_react.useState)([]);
  const [isLoading, setIsLoading] = (0, import_react.useState)(true);
  const [filter, setFilter] = (0, import_react.useState)("All");
  const [isGridView, setIsGridView] = (0, import_react.useState)(true);
  const [isShowingDetail, setIsShowingDetail] = (0, import_react.useState)(false);
  (0, import_react.useEffect)(() => {
    async function loadSettings() {
      const storedDetail = await import_api.LocalStorage.getItem("show_detail_v1");
      if (storedDetail) setIsShowingDetail(JSON.parse(storedDetail));
    }
    loadSettings();
  }, []);
  (0, import_react.useEffect)(() => {
    import_api.LocalStorage.setItem("show_detail_v1", JSON.stringify(isShowingDetail));
  }, [isShowingDetail]);
  (0, import_react.useEffect)(() => {
    async function fetchSVGs() {
      try {
        const response = await fetch("https://api.svgl.app");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setItems(data);
      } catch (error) {
        (0, import_api.showToast)({
          style: import_api.Toast.Style.Failure,
          title: "Failed to fetch SVGs",
          message: String(error)
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchSVGs();
  }, []);
  const categories = (0, import_react.useMemo)(() => {
    const cats = /* @__PURE__ */ new Set(["All"]);
    items.forEach((item) => {
      if (Array.isArray(item.category)) {
        item.category.forEach((c) => cats.add(c));
      } else if (item.category) {
        cats.add(item.category);
      }
    });
    return Array.from(cats).sort();
  }, [items]);
  const filteredItems = items.filter((item) => {
    if (filter === "All") return true;
    const itemCats = Array.isArray(item.category) ? item.category : [item.category];
    return itemCats.includes(filter);
  });
  const sections = (0, import_react.useMemo)(() => {
    if (filter !== "All") return [{ title: filter, items: filteredItems }];
    const groups = {};
    filteredItems.forEach((item) => {
      const cat = Array.isArray(item.category) ? item.category[0] : item.category || "Uncategorized";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    return Object.keys(groups).sort().map((cat) => ({ title: cat, items: groups[cat] }));
  }, [filteredItems, filter]);
  const copyRawSVG = async (url) => {
    try {
      const toast = await (0, import_api.showToast)({ style: import_api.Toast.Style.Animated, title: "Fetching SVG..." });
      const res = await fetch(url);
      const text = await res.text();
      await Clipboard.copy(text);
      toast.style = import_api.Toast.Style.Success;
      toast.title = "Copied SVG Code!";
    } catch (e2) {
      (0, import_api.showToast)({ style: import_api.Toast.Style.Failure, title: "Failed to copy SVG" });
    }
  };
  const toggleViewAction = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_api.Action,
    {
      title: isGridView ? "Switch to List View" : "Switch to Grid View",
      icon: isGridView ? import_api.Icon.List : import_api.Icon.Grid,
      onAction: () => setIsGridView(!isGridView),
      shortcut: { modifiers: ["cmd", "shift"], key: "v" }
    }
  );
  const toggleDetailAction = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_api.Action,
    {
      title: isShowingDetail ? "Hide Detail" : "Show Detail",
      icon: import_api.Icon.SidebarLeft,
      onAction: () => setIsShowingDetail(!isShowingDetail),
      shortcut: { modifiers: ["cmd", "shift"], key: "d" }
    }
  );
  const renderActions = (item, svgUrl) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_api.ActionPanel, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_api.ActionPanel.Section, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.Action.CopyToClipboard, { title: "Copy SVG URL", content: svgUrl }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.Action, { title: "Copy Raw SVG Code", icon: import_api.Icon.Code, onAction: () => copyRawSVG(svgUrl) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.Action.Paste, { title: "Paste SVG URL", content: svgUrl })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_api.ActionPanel.Section, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.Action.OpenInBrowser, { title: "Open SVGL Search", url: `https://svgl.app/?search=${encodeURIComponent(item.title)}` }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.Action.OpenInBrowser, { title: "Visit Official Website", url: item.url, icon: import_api.Icon.Globe })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_api.ActionPanel.Section, { children: [
      toggleDetailAction,
      toggleViewAction,
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.Action.CopyToClipboard, { title: "Copy Name", content: item.title, shortcut: { modifiers: ["cmd", "shift"], key: "c" } })
    ] })
  ] });
  const renderDetail = (item, svgUrl) => {
    const markdown = `
![${item.title}](${svgUrl})

## ${item.title}

| Property | Value |
| :--- | :--- |
| **Title** | ${item.title} |
| **Category** | ${Array.isArray(item.category) ? item.category.join(", ") : item.category || "General"} |
| **Official URL** | [Visit Site](${item.url}) |
| **Status** | High Fidelity Asset \u2705 |
    `;
    const GridDetail = import_api.Grid.Item.Detail || import_api.List.Item.Detail;
    if (GridDetail) {
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GridDetail, { markdown });
    }
    return null;
  };
  const accessory = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.List.Dropdown, { tooltip: "Filter by Category", storeValue: true, onChange: setFilter, children: categories.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.List.Dropdown.Item, { title: cat, value: cat }, cat)) });
  if (isGridView) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_api.Grid,
      {
        isLoading,
        searchBarPlaceholder: "Search logos in Grid View...",
        searchBarAccessory: accessory,
        columns: isShowingDetail ? 5 : 8,
        fit: import_api.Grid.Fit.Contain,
        isShowingDetail,
        children: sections.map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.Grid.Section, { title: section.title, children: section.items.map((item) => {
          const svgUrl = typeof item.route === "string" ? item.route : item.route.light;
          return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_api.Grid.Item,
            {
              title: item.title,
              content: { source: svgUrl },
              actions: renderActions(item, svgUrl),
              detail: renderDetail(item, svgUrl),
              quickLook: { path: svgUrl, title: item.title }
            },
            item.id
          );
        }) }, section.title))
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_api.List,
    {
      isLoading,
      searchBarPlaceholder: "Search logos in List View...",
      throttle: true,
      searchBarAccessory: accessory,
      isShowingDetail,
      children: sections.map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.List.Section, { title: section.title, children: section.items.map((item) => {
        const svgUrl = typeof item.route === "string" ? item.route : item.route.light;
        const detailMarkdown = `
<img src="${svgUrl}" width="200" />

## ${item.title}

| Property | Value |
| :--- | :--- |
| **Title** | ${item.title} |
| **Asset ID** | \`${item.id}\` |
| **Quality** | Vector Perfect \u{1F3AF} |
            `;
        return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_api.List.Item,
          {
            title: item.title,
            subtitle: Array.isArray(item.category) ? item.category.join(", ") : item.category,
            icon: { source: svgUrl, mask: import_api.Image.Mask.RoundedRect },
            actions: renderActions(item, svgUrl),
            quickLook: { path: svgUrl, title: item.title },
            detail: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.List.Item.Detail, { markdown: detailMarkdown })
          },
          item.id
        );
      }) }, section.title))
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL3N2Z2wtcmF5Y2FzdC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL3V0aWxzLnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9zdmdsLXJheWNhc3Qvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvaGVscGVycy9taXNjZWxsYW5lb3VzLnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9zdmdsLXJheWNhc3Qvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvaGVscGVycy93ZWJpZGwudHMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL3N2Z2wtcmF5Y2FzdC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi9zaW1wbGUtcXVldWUudHMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL3N2Z2wtcmF5Y2FzdC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi9hYnN0cmFjdC1vcHMvaW50ZXJuYWwtbWV0aG9kcy50cyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvc3ZnbC1yYXljYXN0L25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvbGliL3JlYWRhYmxlLXN0cmVhbS9nZW5lcmljLXJlYWRlci50cyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvc3ZnbC1yYXljYXN0L25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvc3R1Yi9udW1iZXItaXNmaW5pdGUudHMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL3N2Z2wtcmF5Y2FzdC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL3N0dWIvbWF0aC10cnVuYy50cyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvc3ZnbC1yYXljYXN0L25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvbGliL3ZhbGlkYXRvcnMvYmFzaWMudHMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL3N2Z2wtcmF5Y2FzdC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi92YWxpZGF0b3JzL3JlYWRhYmxlLXN0cmVhbS50cyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvc3ZnbC1yYXljYXN0L25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvbGliL3JlYWRhYmxlLXN0cmVhbS9kZWZhdWx0LXJlYWRlci50cyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvc3ZnbC1yYXljYXN0L25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvdGFyZ2V0L2VzMjAxOC9zdHViL2FzeW5jLWl0ZXJhdG9yLXByb3RvdHlwZS50cyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvc3ZnbC1yYXljYXN0L25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvbGliL3JlYWRhYmxlLXN0cmVhbS9hc3luYy1pdGVyYXRvci50cyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvc3ZnbC1yYXljYXN0L25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvc3R1Yi9udW1iZXItaXNuYW4udHMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL3N2Z2wtcmF5Y2FzdC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi9hYnN0cmFjdC1vcHMvZWNtYXNjcmlwdC50cyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvc3ZnbC1yYXljYXN0L25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvbGliL2Fic3RyYWN0LW9wcy9taXNjZWxsYW5lb3VzLnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9zdmdsLXJheWNhc3Qvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvYWJzdHJhY3Qtb3BzL3F1ZXVlLXdpdGgtc2l6ZXMudHMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL3N2Z2wtcmF5Y2FzdC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi9oZWxwZXJzL2FycmF5LWJ1ZmZlci12aWV3LnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9zdmdsLXJheWNhc3Qvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvcmVhZGFibGUtc3RyZWFtL2J5dGUtc3RyZWFtLWNvbnRyb2xsZXIudHMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL3N2Z2wtcmF5Y2FzdC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi92YWxpZGF0b3JzL3JlYWRlci1vcHRpb25zLnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9zdmdsLXJheWNhc3Qvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvcmVhZGFibGUtc3RyZWFtL2J5b2ItcmVhZGVyLnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9zdmdsLXJheWNhc3Qvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvYWJzdHJhY3Qtb3BzL3F1ZXVpbmctc3RyYXRlZ3kudHMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL3N2Z2wtcmF5Y2FzdC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi92YWxpZGF0b3JzL3F1ZXVpbmctc3RyYXRlZ3kudHMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL3N2Z2wtcmF5Y2FzdC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi92YWxpZGF0b3JzL3VuZGVybHlpbmctc2luay50cyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvc3ZnbC1yYXljYXN0L25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvbGliL3ZhbGlkYXRvcnMvd3JpdGFibGUtc3RyZWFtLnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9zdmdsLXJheWNhc3Qvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvYWJvcnQtc2lnbmFsLnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9zdmdsLXJheWNhc3Qvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvd3JpdGFibGUtc3RyZWFtLnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9zdmdsLXJheWNhc3Qvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9nbG9iYWxzLnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9zdmdsLXJheWNhc3Qvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9zdHViL2RvbS1leGNlcHRpb24udHMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL3N2Z2wtcmF5Y2FzdC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi9yZWFkYWJsZS1zdHJlYW0vcGlwZS50cyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvc3ZnbC1yYXljYXN0L25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvbGliL3JlYWRhYmxlLXN0cmVhbS9kZWZhdWx0LWNvbnRyb2xsZXIudHMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL3N2Z2wtcmF5Y2FzdC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi9yZWFkYWJsZS1zdHJlYW0vdGVlLnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9zdmdsLXJheWNhc3Qvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvcmVhZGFibGUtc3RyZWFtL3JlYWRhYmxlLXN0cmVhbS1saWtlLnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9zdmdsLXJheWNhc3Qvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvcmVhZGFibGUtc3RyZWFtL2Zyb20udHMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL3N2Z2wtcmF5Y2FzdC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi92YWxpZGF0b3JzL3VuZGVybHlpbmctc291cmNlLnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9zdmdsLXJheWNhc3Qvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvdmFsaWRhdG9ycy9pdGVyYXRvci1vcHRpb25zLnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9zdmdsLXJheWNhc3Qvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvdmFsaWRhdG9ycy9waXBlLW9wdGlvbnMudHMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL3N2Z2wtcmF5Y2FzdC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi92YWxpZGF0b3JzL3JlYWRhYmxlLXdyaXRhYmxlLXBhaXIudHMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL3N2Z2wtcmF5Y2FzdC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi9yZWFkYWJsZS1zdHJlYW0udHMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL3N2Z2wtcmF5Y2FzdC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi92YWxpZGF0b3JzL3F1ZXVpbmctc3RyYXRlZ3ktaW5pdC50cyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvc3ZnbC1yYXljYXN0L25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvbGliL2J5dGUtbGVuZ3RoLXF1ZXVpbmctc3RyYXRlZ3kudHMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL3N2Z2wtcmF5Y2FzdC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi9jb3VudC1xdWV1aW5nLXN0cmF0ZWd5LnRzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9zdmdsLXJheWNhc3Qvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvdmFsaWRhdG9ycy90cmFuc2Zvcm1lci50cyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvc3ZnbC1yYXljYXN0L25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvbGliL3RyYW5zZm9ybS1zdHJlYW0udHMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL3N2Z2wtcmF5Y2FzdC9ub2RlX21vZHVsZXMvZmV0Y2gtYmxvYi9zdHJlYW1zLmNqcyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvc3ZnbC1yYXljYXN0L25vZGVfbW9kdWxlcy9mZXRjaC1ibG9iL2luZGV4LmpzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9zdmdsLXJheWNhc3Qvbm9kZV9tb2R1bGVzL2ZldGNoLWJsb2IvZmlsZS5qcyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvc3ZnbC1yYXljYXN0L25vZGVfbW9kdWxlcy9mb3JtZGF0YS1wb2x5ZmlsbC9lc20ubWluLmpzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9zdmdsLXJheWNhc3Qvbm9kZV9tb2R1bGVzL25vZGUtZG9tZXhjZXB0aW9uL2luZGV4LmpzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9zdmdsLXJheWNhc3Qvbm9kZV9tb2R1bGVzL2ZldGNoLWJsb2IvZnJvbS5qcyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvc3ZnbC1yYXljYXN0L25vZGVfbW9kdWxlcy9ub2RlLWZldGNoL3NyYy91dGlscy9tdWx0aXBhcnQtcGFyc2VyLmpzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9zdmdsLXJheWNhc3Qvc3JjL3NlYXJjaC50c3giLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL3N2Z2wtcmF5Y2FzdC9ub2RlX21vZHVsZXMvbm9kZS1mZXRjaC9zcmMvaW5kZXguanMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL3N2Z2wtcmF5Y2FzdC9ub2RlX21vZHVsZXMvZGF0YS11cmktdG8tYnVmZmVyL3NyYy9pbmRleC50cyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvc3ZnbC1yYXljYXN0L25vZGVfbW9kdWxlcy9ub2RlLWZldGNoL3NyYy9ib2R5LmpzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9zdmdsLXJheWNhc3Qvbm9kZV9tb2R1bGVzL25vZGUtZmV0Y2gvc3JjL2Vycm9ycy9iYXNlLmpzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9zdmdsLXJheWNhc3Qvbm9kZV9tb2R1bGVzL25vZGUtZmV0Y2gvc3JjL2Vycm9ycy9mZXRjaC1lcnJvci5qcyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvc3ZnbC1yYXljYXN0L25vZGVfbW9kdWxlcy9ub2RlLWZldGNoL3NyYy91dGlscy9pcy5qcyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvc3ZnbC1yYXljYXN0L25vZGVfbW9kdWxlcy9ub2RlLWZldGNoL3NyYy9oZWFkZXJzLmpzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9zdmdsLXJheWNhc3Qvbm9kZV9tb2R1bGVzL25vZGUtZmV0Y2gvc3JjL3V0aWxzL2lzLXJlZGlyZWN0LmpzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9zdmdsLXJheWNhc3Qvbm9kZV9tb2R1bGVzL25vZGUtZmV0Y2gvc3JjL3Jlc3BvbnNlLmpzIiwgIi4uLy4uLy4uLy4uL0RldmVsb3Blci9zdmdsLXJheWNhc3Qvbm9kZV9tb2R1bGVzL25vZGUtZmV0Y2gvc3JjL3JlcXVlc3QuanMiLCAiLi4vLi4vLi4vLi4vRGV2ZWxvcGVyL3N2Z2wtcmF5Y2FzdC9ub2RlX21vZHVsZXMvbm9kZS1mZXRjaC9zcmMvdXRpbHMvZ2V0LXNlYXJjaC5qcyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvc3ZnbC1yYXljYXN0L25vZGVfbW9kdWxlcy9ub2RlLWZldGNoL3NyYy91dGlscy9yZWZlcnJlci5qcyIsICIuLi8uLi8uLi8uLi9EZXZlbG9wZXIvc3ZnbC1yYXljYXN0L25vZGVfbW9kdWxlcy9ub2RlLWZldGNoL3NyYy9lcnJvcnMvYWJvcnQtZXJyb3IuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImV4cG9ydCBmdW5jdGlvbiBub29wKCk6IHVuZGVmaW5lZCB7XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG4iLCAiaW1wb3J0IHsgbm9vcCB9IGZyb20gJy4uLy4uL3V0aWxzJztcbmltcG9ydCB7IEFzc2VydGlvbkVycm9yIH0gZnJvbSAnLi4vLi4vc3R1Yi9hc3NlcnQnO1xuXG5leHBvcnQgZnVuY3Rpb24gdHlwZUlzT2JqZWN0KHg6IGFueSk6IHggaXMgb2JqZWN0IHtcbiAgcmV0dXJuICh0eXBlb2YgeCA9PT0gJ29iamVjdCcgJiYgeCAhPT0gbnVsbCkgfHwgdHlwZW9mIHggPT09ICdmdW5jdGlvbic7XG59XG5cbmV4cG9ydCBjb25zdCByZXRocm93QXNzZXJ0aW9uRXJyb3JSZWplY3Rpb246IChlOiBhbnkpID0+IHZvaWQgPVxuICBERUJVRyA/IGUgPT4ge1xuICAgIC8vIFVzZWQgdGhyb3VnaG91dCB0aGUgcmVmZXJlbmNlIGltcGxlbWVudGF0aW9uLCBhcyBgLmNhdGNoKHJldGhyb3dBc3NlcnRpb25FcnJvclJlamVjdGlvbilgLCB0byBlbnN1cmUgYW55IGVycm9yc1xuICAgIC8vIGdldCBzaG93bi4gVGhlcmUgYXJlIHBsYWNlcyBpbiB0aGUgc3BlYyB3aGVyZSB3ZSBkbyBwcm9taXNlIHRyYW5zZm9ybWF0aW9ucyBhbmQgcHVycG9zZWZ1bGx5IGlnbm9yZSBvciBkb24ndFxuICAgIC8vIGV4cGVjdCBhbnkgZXJyb3JzLCBidXQgYXNzZXJ0aW9uIGVycm9ycyBhcmUgYWx3YXlzIHByb2JsZW1hdGljLlxuICAgIGlmIChlICYmIGUgaW5zdGFuY2VvZiBBc3NlcnRpb25FcnJvcikge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9LCAwKTtcbiAgICB9XG4gIH0gOiBub29wO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0RnVuY3Rpb25OYW1lKGZuOiBGdW5jdGlvbiwgbmFtZTogc3RyaW5nKTogdm9pZCB7XG4gIHRyeSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGZuLCAnbmFtZScsIHtcbiAgICAgIHZhbHVlOiBuYW1lLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gIH0gY2F0Y2gge1xuICAgIC8vIFRoaXMgcHJvcGVydHkgaXMgbm9uLWNvbmZpZ3VyYWJsZSBpbiBvbGRlciBicm93c2Vycywgc28gaWdub3JlIGlmIHRoaXMgdGhyb3dzLlxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0Z1bmN0aW9uL25hbWUjYnJvd3Nlcl9jb21wYXRpYmlsaXR5XG4gIH1cbn1cbiIsICJpbXBvcnQgeyByZXRocm93QXNzZXJ0aW9uRXJyb3JSZWplY3Rpb24gfSBmcm9tICcuL21pc2NlbGxhbmVvdXMnO1xuaW1wb3J0IGFzc2VydCBmcm9tICcuLi8uLi9zdHViL2Fzc2VydCc7XG5cbmNvbnN0IG9yaWdpbmFsUHJvbWlzZSA9IFByb21pc2U7XG5jb25zdCBvcmlnaW5hbFByb21pc2VUaGVuID0gUHJvbWlzZS5wcm90b3R5cGUudGhlbjtcbmNvbnN0IG9yaWdpbmFsUHJvbWlzZVJlamVjdCA9IFByb21pc2UucmVqZWN0LmJpbmQob3JpZ2luYWxQcm9taXNlKTtcblxuLy8gaHR0cHM6Ly93ZWJpZGwuc3BlYy53aGF0d2cub3JnLyNhLW5ldy1wcm9taXNlXG5leHBvcnQgZnVuY3Rpb24gbmV3UHJvbWlzZTxUPihleGVjdXRvcjogKFxuICByZXNvbHZlOiAodmFsdWU6IFQgfCBQcm9taXNlTGlrZTxUPikgPT4gdm9pZCxcbiAgcmVqZWN0OiAocmVhc29uPzogYW55KSA9PiB2b2lkXG4pID0+IHZvaWQpOiBQcm9taXNlPFQ+IHtcbiAgcmV0dXJuIG5ldyBvcmlnaW5hbFByb21pc2UoZXhlY3V0b3IpO1xufVxuXG4vLyBodHRwczovL3dlYmlkbC5zcGVjLndoYXR3Zy5vcmcvI2EtcHJvbWlzZS1yZXNvbHZlZC13aXRoXG5leHBvcnQgZnVuY3Rpb24gcHJvbWlzZVJlc29sdmVkV2l0aDxUPih2YWx1ZTogVCB8IFByb21pc2VMaWtlPFQ+KTogUHJvbWlzZTxUPiB7XG4gIHJldHVybiBuZXdQcm9taXNlKHJlc29sdmUgPT4gcmVzb2x2ZSh2YWx1ZSkpO1xufVxuXG4vLyBodHRwczovL3dlYmlkbC5zcGVjLndoYXR3Zy5vcmcvI2EtcHJvbWlzZS1yZWplY3RlZC13aXRoXG5leHBvcnQgZnVuY3Rpb24gcHJvbWlzZVJlamVjdGVkV2l0aDxUID0gbmV2ZXI+KHJlYXNvbjogYW55KTogUHJvbWlzZTxUPiB7XG4gIHJldHVybiBvcmlnaW5hbFByb21pc2VSZWplY3QocmVhc29uKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFBlcmZvcm1Qcm9taXNlVGhlbjxULCBUUmVzdWx0MSA9IFQsIFRSZXN1bHQyID0gbmV2ZXI+KFxuICBwcm9taXNlOiBQcm9taXNlPFQ+LFxuICBvbkZ1bGZpbGxlZD86ICh2YWx1ZTogVCkgPT4gVFJlc3VsdDEgfCBQcm9taXNlTGlrZTxUUmVzdWx0MT4sXG4gIG9uUmVqZWN0ZWQ/OiAocmVhc29uOiBhbnkpID0+IFRSZXN1bHQyIHwgUHJvbWlzZUxpa2U8VFJlc3VsdDI+KTogUHJvbWlzZTxUUmVzdWx0MSB8IFRSZXN1bHQyPiB7XG4gIC8vIFRoZXJlIGRvZXNuJ3QgYXBwZWFyIHRvIGJlIGFueSB3YXkgdG8gY29ycmVjdGx5IGVtdWxhdGUgdGhlIGJlaGF2aW91ciBmcm9tIEphdmFTY3JpcHQsIHNvIHRoaXMgaXMganVzdCBhblxuICAvLyBhcHByb3hpbWF0aW9uLlxuICByZXR1cm4gb3JpZ2luYWxQcm9taXNlVGhlbi5jYWxsKHByb21pc2UsIG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKSBhcyBQcm9taXNlPFRSZXN1bHQxIHwgVFJlc3VsdDI+O1xufVxuXG4vLyBCbHVlYmlyZCBsb2dzIGEgd2FybmluZyB3aGVuIGEgcHJvbWlzZSBpcyBjcmVhdGVkIHdpdGhpbiBhIGZ1bGZpbGxtZW50IGhhbmRsZXIsIGJ1dCB0aGVuIGlzbid0IHJldHVybmVkXG4vLyBmcm9tIHRoYXQgaGFuZGxlci4gVG8gcHJldmVudCB0aGlzLCByZXR1cm4gbnVsbCBpbnN0ZWFkIG9mIHZvaWQgZnJvbSBhbGwgaGFuZGxlcnMuXG4vLyBodHRwOi8vYmx1ZWJpcmRqcy5jb20vZG9jcy93YXJuaW5nLWV4cGxhbmF0aW9ucy5odG1sI3dhcm5pbmctYS1wcm9taXNlLXdhcy1jcmVhdGVkLWluLWEtaGFuZGxlci1idXQtd2FzLW5vdC1yZXR1cm5lZC1mcm9tLWl0XG5leHBvcnQgZnVuY3Rpb24gdXBvblByb21pc2U8VD4oXG4gIHByb21pc2U6IFByb21pc2U8VD4sXG4gIG9uRnVsZmlsbGVkPzogKHZhbHVlOiBUKSA9PiBudWxsIHwgUHJvbWlzZUxpa2U8bnVsbD4sXG4gIG9uUmVqZWN0ZWQ/OiAocmVhc29uOiBhbnkpID0+IG51bGwgfCBQcm9taXNlTGlrZTxudWxsPik6IHZvaWQge1xuICBQZXJmb3JtUHJvbWlzZVRoZW4oXG4gICAgUGVyZm9ybVByb21pc2VUaGVuKHByb21pc2UsIG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKSxcbiAgICB1bmRlZmluZWQsXG4gICAgcmV0aHJvd0Fzc2VydGlvbkVycm9yUmVqZWN0aW9uXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cG9uRnVsZmlsbG1lbnQ8VD4ocHJvbWlzZTogUHJvbWlzZTxUPiwgb25GdWxmaWxsZWQ6ICh2YWx1ZTogVCkgPT4gbnVsbCB8IFByb21pc2VMaWtlPG51bGw+KTogdm9pZCB7XG4gIHVwb25Qcm9taXNlKHByb21pc2UsIG9uRnVsZmlsbGVkKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwb25SZWplY3Rpb24ocHJvbWlzZTogUHJvbWlzZTx1bmtub3duPiwgb25SZWplY3RlZDogKHJlYXNvbjogYW55KSA9PiBudWxsIHwgUHJvbWlzZUxpa2U8bnVsbD4pOiB2b2lkIHtcbiAgdXBvblByb21pc2UocHJvbWlzZSwgdW5kZWZpbmVkLCBvblJlamVjdGVkKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zZm9ybVByb21pc2VXaXRoPFQsIFRSZXN1bHQxID0gVCwgVFJlc3VsdDIgPSBuZXZlcj4oXG4gIHByb21pc2U6IFByb21pc2U8VD4sXG4gIGZ1bGZpbGxtZW50SGFuZGxlcj86ICh2YWx1ZTogVCkgPT4gVFJlc3VsdDEgfCBQcm9taXNlTGlrZTxUUmVzdWx0MT4sXG4gIHJlamVjdGlvbkhhbmRsZXI/OiAocmVhc29uOiBhbnkpID0+IFRSZXN1bHQyIHwgUHJvbWlzZUxpa2U8VFJlc3VsdDI+KTogUHJvbWlzZTxUUmVzdWx0MSB8IFRSZXN1bHQyPiB7XG4gIHJldHVybiBQZXJmb3JtUHJvbWlzZVRoZW4ocHJvbWlzZSwgZnVsZmlsbG1lbnRIYW5kbGVyLCByZWplY3Rpb25IYW5kbGVyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldFByb21pc2VJc0hhbmRsZWRUb1RydWUocHJvbWlzZTogUHJvbWlzZTx1bmtub3duPik6IHZvaWQge1xuICBQZXJmb3JtUHJvbWlzZVRoZW4ocHJvbWlzZSwgdW5kZWZpbmVkLCByZXRocm93QXNzZXJ0aW9uRXJyb3JSZWplY3Rpb24pO1xufVxuXG5sZXQgX3F1ZXVlTWljcm90YXNrOiAoY2FsbGJhY2s6ICgpID0+IHZvaWQpID0+IHZvaWQgPSBjYWxsYmFjayA9PiB7XG4gIGlmICh0eXBlb2YgcXVldWVNaWNyb3Rhc2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICBfcXVldWVNaWNyb3Rhc2sgPSBxdWV1ZU1pY3JvdGFzaztcbiAgfSBlbHNlIHtcbiAgICBjb25zdCByZXNvbHZlZFByb21pc2UgPSBwcm9taXNlUmVzb2x2ZWRXaXRoKHVuZGVmaW5lZCk7XG4gICAgX3F1ZXVlTWljcm90YXNrID0gY2IgPT4gUGVyZm9ybVByb21pc2VUaGVuKHJlc29sdmVkUHJvbWlzZSwgY2IpO1xuICB9XG4gIHJldHVybiBfcXVldWVNaWNyb3Rhc2soY2FsbGJhY2spO1xufTtcblxuZXhwb3J0IHsgX3F1ZXVlTWljcm90YXNrIGFzIHF1ZXVlTWljcm90YXNrIH07XG5cbmV4cG9ydCBmdW5jdGlvbiByZWZsZWN0Q2FsbDxULCBBIGV4dGVuZHMgYW55W10sIFI+KEY6ICh0aGlzOiBULCAuLi5mbkFyZ3M6IEEpID0+IFIsIFY6IFQsIGFyZ3M6IEEpOiBSIHtcbiAgaWYgKHR5cGVvZiBGICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgaXMgbm90IGEgZnVuY3Rpb24nKTtcbiAgfVxuICByZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmNhbGwoRiwgViwgYXJncyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9taXNlQ2FsbDxULCBBIGV4dGVuZHMgYW55W10sIFI+KEY6ICh0aGlzOiBULCAuLi5mbkFyZ3M6IEEpID0+IFIgfCBQcm9taXNlTGlrZTxSPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFY6IFQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmdzOiBBKTogUHJvbWlzZTxSPiB7XG4gIGFzc2VydCh0eXBlb2YgRiA9PT0gJ2Z1bmN0aW9uJyk7XG4gIGFzc2VydChWICE9PSB1bmRlZmluZWQpO1xuICBhc3NlcnQoQXJyYXkuaXNBcnJheShhcmdzKSk7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHByb21pc2VSZXNvbHZlZFdpdGgocmVmbGVjdENhbGwoRiwgViwgYXJncykpO1xuICB9IGNhdGNoICh2YWx1ZSkge1xuICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKHZhbHVlKTtcbiAgfVxufVxuIiwgImltcG9ydCBhc3NlcnQgZnJvbSAnLi4vc3R1Yi9hc3NlcnQnO1xuXG4vLyBPcmlnaW5hbCBmcm9tIENocm9taXVtXG4vLyBodHRwczovL2Nocm9taXVtLmdvb2dsZXNvdXJjZS5jb20vY2hyb21pdW0vc3JjLysvMGFlZTQ0MzRhNGRiYTQyYTQyYWJhZWE5YmZiYzBjZDE5NmE2M2JjMS90aGlyZF9wYXJ0eS9ibGluay9yZW5kZXJlci9jb3JlL3N0cmVhbXMvU2ltcGxlUXVldWUuanNcblxuY29uc3QgUVVFVUVfTUFYX0FSUkFZX1NJWkUgPSAxNjM4NDtcblxuaW50ZXJmYWNlIE5vZGU8VD4ge1xuICBfZWxlbWVudHM6IFRbXTtcbiAgX25leHQ6IE5vZGU8VD4gfCB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogU2ltcGxlIHF1ZXVlIHN0cnVjdHVyZS5cbiAqXG4gKiBBdm9pZHMgc2NhbGFiaWxpdHkgaXNzdWVzIHdpdGggdXNpbmcgYSBwYWNrZWQgYXJyYXkgZGlyZWN0bHkgYnkgdXNpbmdcbiAqIG11bHRpcGxlIGFycmF5cyBpbiBhIGxpbmtlZCBsaXN0IGFuZCBrZWVwaW5nIHRoZSBhcnJheSBzaXplIGJvdW5kZWQuXG4gKi9cbmV4cG9ydCBjbGFzcyBTaW1wbGVRdWV1ZTxUPiB7XG4gIHByaXZhdGUgX2Zyb250OiBOb2RlPFQ+O1xuICBwcml2YXRlIF9iYWNrOiBOb2RlPFQ+O1xuICBwcml2YXRlIF9jdXJzb3IgPSAwO1xuICBwcml2YXRlIF9zaXplID0gMDtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICAvLyBfZnJvbnQgYW5kIF9iYWNrIGFyZSBhbHdheXMgZGVmaW5lZC5cbiAgICB0aGlzLl9mcm9udCA9IHtcbiAgICAgIF9lbGVtZW50czogW10sXG4gICAgICBfbmV4dDogdW5kZWZpbmVkXG4gICAgfTtcbiAgICB0aGlzLl9iYWNrID0gdGhpcy5fZnJvbnQ7XG4gICAgLy8gVGhlIGN1cnNvciBpcyB1c2VkIHRvIGF2b2lkIGNhbGxpbmcgQXJyYXkuc2hpZnQoKS5cbiAgICAvLyBJdCBjb250YWlucyB0aGUgaW5kZXggb2YgdGhlIGZyb250IGVsZW1lbnQgb2YgdGhlIGFycmF5IGluc2lkZSB0aGVcbiAgICAvLyBmcm9udC1tb3N0IG5vZGUuIEl0IGlzIGFsd2F5cyBpbiB0aGUgcmFuZ2UgWzAsIFFVRVVFX01BWF9BUlJBWV9TSVpFKS5cbiAgICB0aGlzLl9jdXJzb3IgPSAwO1xuICAgIC8vIFdoZW4gdGhlcmUgaXMgb25seSBvbmUgbm9kZSwgc2l6ZSA9PT0gZWxlbWVudHMubGVuZ3RoIC0gY3Vyc29yLlxuICAgIHRoaXMuX3NpemUgPSAwO1xuICB9XG5cbiAgZ2V0IGxlbmd0aCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9zaXplO1xuICB9XG5cbiAgLy8gRm9yIGV4Y2VwdGlvbiBzYWZldHksIHRoaXMgbWV0aG9kIGlzIHN0cnVjdHVyZWQgaW4gb3JkZXI6XG4gIC8vIDEuIFJlYWQgc3RhdGVcbiAgLy8gMi4gQ2FsY3VsYXRlIHJlcXVpcmVkIHN0YXRlIG11dGF0aW9uc1xuICAvLyAzLiBQZXJmb3JtIHN0YXRlIG11dGF0aW9uc1xuICBwdXNoKGVsZW1lbnQ6IFQpOiB2b2lkIHtcbiAgICBjb25zdCBvbGRCYWNrID0gdGhpcy5fYmFjaztcbiAgICBsZXQgbmV3QmFjayA9IG9sZEJhY2s7XG4gICAgYXNzZXJ0KG9sZEJhY2suX25leHQgPT09IHVuZGVmaW5lZCk7XG4gICAgaWYgKG9sZEJhY2suX2VsZW1lbnRzLmxlbmd0aCA9PT0gUVVFVUVfTUFYX0FSUkFZX1NJWkUgLSAxKSB7XG4gICAgICBuZXdCYWNrID0ge1xuICAgICAgICBfZWxlbWVudHM6IFtdLFxuICAgICAgICBfbmV4dDogdW5kZWZpbmVkXG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vIHB1c2goKSBpcyB0aGUgbXV0YXRpb24gbW9zdCBsaWtlbHkgdG8gdGhyb3cgYW4gZXhjZXB0aW9uLCBzbyBpdFxuICAgIC8vIGdvZXMgZmlyc3QuXG4gICAgb2xkQmFjay5fZWxlbWVudHMucHVzaChlbGVtZW50KTtcbiAgICBpZiAobmV3QmFjayAhPT0gb2xkQmFjaykge1xuICAgICAgdGhpcy5fYmFjayA9IG5ld0JhY2s7XG4gICAgICBvbGRCYWNrLl9uZXh0ID0gbmV3QmFjaztcbiAgICB9XG4gICAgKyt0aGlzLl9zaXplO1xuICB9XG5cbiAgLy8gTGlrZSBwdXNoKCksIHNoaWZ0KCkgZm9sbG93cyB0aGUgcmVhZCAtPiBjYWxjdWxhdGUgLT4gbXV0YXRlIHBhdHRlcm4gZm9yXG4gIC8vIGV4Y2VwdGlvbiBzYWZldHkuXG4gIHNoaWZ0KCk6IFQge1xuICAgIGFzc2VydCh0aGlzLl9zaXplID4gMCk7IC8vIG11c3Qgbm90IGJlIGNhbGxlZCBvbiBhbiBlbXB0eSBxdWV1ZVxuXG4gICAgY29uc3Qgb2xkRnJvbnQgPSB0aGlzLl9mcm9udDtcbiAgICBsZXQgbmV3RnJvbnQgPSBvbGRGcm9udDtcbiAgICBjb25zdCBvbGRDdXJzb3IgPSB0aGlzLl9jdXJzb3I7XG4gICAgbGV0IG5ld0N1cnNvciA9IG9sZEN1cnNvciArIDE7XG5cbiAgICBjb25zdCBlbGVtZW50cyA9IG9sZEZyb250Ll9lbGVtZW50cztcbiAgICBjb25zdCBlbGVtZW50ID0gZWxlbWVudHNbb2xkQ3Vyc29yXTtcblxuICAgIGlmIChuZXdDdXJzb3IgPT09IFFVRVVFX01BWF9BUlJBWV9TSVpFKSB7XG4gICAgICBhc3NlcnQoZWxlbWVudHMubGVuZ3RoID09PSBRVUVVRV9NQVhfQVJSQVlfU0laRSk7XG4gICAgICBhc3NlcnQob2xkRnJvbnQuX25leHQgIT09IHVuZGVmaW5lZCk7XG4gICAgICBuZXdGcm9udCA9IG9sZEZyb250Ll9uZXh0ITtcbiAgICAgIG5ld0N1cnNvciA9IDA7XG4gICAgfVxuXG4gICAgLy8gTm8gbXV0YXRpb25zIGJlZm9yZSB0aGlzIHBvaW50LlxuICAgIC0tdGhpcy5fc2l6ZTtcbiAgICB0aGlzLl9jdXJzb3IgPSBuZXdDdXJzb3I7XG4gICAgaWYgKG9sZEZyb250ICE9PSBuZXdGcm9udCkge1xuICAgICAgdGhpcy5fZnJvbnQgPSBuZXdGcm9udDtcbiAgICB9XG5cbiAgICAvLyBQZXJtaXQgc2hpZnRlZCBlbGVtZW50IHRvIGJlIGdhcmJhZ2UgY29sbGVjdGVkLlxuICAgIGVsZW1lbnRzW29sZEN1cnNvcl0gPSB1bmRlZmluZWQhO1xuXG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH1cblxuICAvLyBUaGUgdHJpY2t5IHRoaW5nIGFib3V0IGZvckVhY2goKSBpcyB0aGF0IGl0IGNhbiBiZSBjYWxsZWRcbiAgLy8gcmUtZW50cmFudGx5LiBUaGUgcXVldWUgbWF5IGJlIG11dGF0ZWQgaW5zaWRlIHRoZSBjYWxsYmFjay4gSXQgaXMgZWFzeSB0b1xuICAvLyBzZWUgdGhhdCBwdXNoKCkgd2l0aGluIHRoZSBjYWxsYmFjayBoYXMgbm8gbmVnYXRpdmUgZWZmZWN0cyBzaW5jZSB0aGUgZW5kXG4gIC8vIG9mIHRoZSBxdWV1ZSBpcyBjaGVja2VkIGZvciBvbiBldmVyeSBpdGVyYXRpb24uIElmIHNoaWZ0KCkgaXMgY2FsbGVkXG4gIC8vIHJlcGVhdGVkbHkgd2l0aGluIHRoZSBjYWxsYmFjayB0aGVuIHRoZSBuZXh0IGl0ZXJhdGlvbiBtYXkgcmV0dXJuIGFuXG4gIC8vIGVsZW1lbnQgdGhhdCBoYXMgYmVlbiByZW1vdmVkLiBJbiB0aGlzIGNhc2UgdGhlIGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkXG4gIC8vIHdpdGggdW5kZWZpbmVkIHZhbHVlcyB1bnRpbCB3ZSBlaXRoZXIgXCJjYXRjaCB1cFwiIHdpdGggZWxlbWVudHMgdGhhdCBzdGlsbFxuICAvLyBleGlzdCBvciByZWFjaCB0aGUgYmFjayBvZiB0aGUgcXVldWUuXG4gIGZvckVhY2goY2FsbGJhY2s6IChlbGVtZW50OiBUKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgbGV0IGkgPSB0aGlzLl9jdXJzb3I7XG4gICAgbGV0IG5vZGUgPSB0aGlzLl9mcm9udDtcbiAgICBsZXQgZWxlbWVudHMgPSBub2RlLl9lbGVtZW50cztcbiAgICB3aGlsZSAoaSAhPT0gZWxlbWVudHMubGVuZ3RoIHx8IG5vZGUuX25leHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKGkgPT09IGVsZW1lbnRzLmxlbmd0aCkge1xuICAgICAgICBhc3NlcnQobm9kZS5fbmV4dCAhPT0gdW5kZWZpbmVkKTtcbiAgICAgICAgYXNzZXJ0KGkgPT09IFFVRVVFX01BWF9BUlJBWV9TSVpFKTtcbiAgICAgICAgbm9kZSA9IG5vZGUuX25leHQhO1xuICAgICAgICBlbGVtZW50cyA9IG5vZGUuX2VsZW1lbnRzO1xuICAgICAgICBpID0gMDtcbiAgICAgICAgaWYgKGVsZW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjYWxsYmFjayhlbGVtZW50c1tpXSk7XG4gICAgICArK2k7XG4gICAgfVxuICB9XG5cbiAgLy8gUmV0dXJuIHRoZSBlbGVtZW50IHRoYXQgd291bGQgYmUgcmV0dXJuZWQgaWYgc2hpZnQoKSB3YXMgY2FsbGVkIG5vdyxcbiAgLy8gd2l0aG91dCBtb2RpZnlpbmcgdGhlIHF1ZXVlLlxuICBwZWVrKCk6IFQge1xuICAgIGFzc2VydCh0aGlzLl9zaXplID4gMCk7IC8vIG11c3Qgbm90IGJlIGNhbGxlZCBvbiBhbiBlbXB0eSBxdWV1ZVxuXG4gICAgY29uc3QgZnJvbnQgPSB0aGlzLl9mcm9udDtcbiAgICBjb25zdCBjdXJzb3IgPSB0aGlzLl9jdXJzb3I7XG4gICAgcmV0dXJuIGZyb250Ll9lbGVtZW50c1tjdXJzb3JdO1xuICB9XG59XG4iLCAiZXhwb3J0IGNvbnN0IEFib3J0U3RlcHMgPSBTeW1ib2woJ1tbQWJvcnRTdGVwc11dJyk7XG5leHBvcnQgY29uc3QgRXJyb3JTdGVwcyA9IFN5bWJvbCgnW1tFcnJvclN0ZXBzXV0nKTtcbmV4cG9ydCBjb25zdCBDYW5jZWxTdGVwcyA9IFN5bWJvbCgnW1tDYW5jZWxTdGVwc11dJyk7XG5leHBvcnQgY29uc3QgUHVsbFN0ZXBzID0gU3ltYm9sKCdbW1B1bGxTdGVwc11dJyk7XG5leHBvcnQgY29uc3QgUmVsZWFzZVN0ZXBzID0gU3ltYm9sKCdbW1JlbGVhc2VTdGVwc11dJyk7XG4iLCAiaW1wb3J0IGFzc2VydCBmcm9tICcuLi8uLi9zdHViL2Fzc2VydCc7XG5pbXBvcnQgeyBSZWFkYWJsZVN0cmVhbSwgUmVhZGFibGVTdHJlYW1DYW5jZWwsIHR5cGUgUmVhZGFibGVTdHJlYW1SZWFkZXIgfSBmcm9tICcuLi9yZWFkYWJsZS1zdHJlYW0nO1xuaW1wb3J0IHsgbmV3UHJvbWlzZSwgc2V0UHJvbWlzZUlzSGFuZGxlZFRvVHJ1ZSB9IGZyb20gJy4uL2hlbHBlcnMvd2ViaWRsJztcbmltcG9ydCB7IFJlbGVhc2VTdGVwcyB9IGZyb20gJy4uL2Fic3RyYWN0LW9wcy9pbnRlcm5hbC1tZXRob2RzJztcblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtUmVhZGVyR2VuZXJpY0luaXRpYWxpemU8Uj4ocmVhZGVyOiBSZWFkYWJsZVN0cmVhbVJlYWRlcjxSPiwgc3RyZWFtOiBSZWFkYWJsZVN0cmVhbTxSPikge1xuICByZWFkZXIuX293bmVyUmVhZGFibGVTdHJlYW0gPSBzdHJlYW07XG4gIHN0cmVhbS5fcmVhZGVyID0gcmVhZGVyO1xuXG4gIGlmIChzdHJlYW0uX3N0YXRlID09PSAncmVhZGFibGUnKSB7XG4gICAgZGVmYXVsdFJlYWRlckNsb3NlZFByb21pc2VJbml0aWFsaXplKHJlYWRlcik7XG4gIH0gZWxzZSBpZiAoc3RyZWFtLl9zdGF0ZSA9PT0gJ2Nsb3NlZCcpIHtcbiAgICBkZWZhdWx0UmVhZGVyQ2xvc2VkUHJvbWlzZUluaXRpYWxpemVBc1Jlc29sdmVkKHJlYWRlcik7XG4gIH0gZWxzZSB7XG4gICAgYXNzZXJ0KHN0cmVhbS5fc3RhdGUgPT09ICdlcnJvcmVkJyk7XG5cbiAgICBkZWZhdWx0UmVhZGVyQ2xvc2VkUHJvbWlzZUluaXRpYWxpemVBc1JlamVjdGVkKHJlYWRlciwgc3RyZWFtLl9zdG9yZWRFcnJvcik7XG4gIH1cbn1cblxuLy8gQSBjbGllbnQgb2YgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyIGFuZCBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIgbWF5IHVzZSB0aGVzZSBmdW5jdGlvbnMgZGlyZWN0bHkgdG8gYnlwYXNzIHN0YXRlXG4vLyBjaGVjay5cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtUmVhZGVyR2VuZXJpY0NhbmNlbChyZWFkZXI6IFJlYWRhYmxlU3RyZWFtUmVhZGVyPGFueT4sIHJlYXNvbjogYW55KTogUHJvbWlzZTx1bmRlZmluZWQ+IHtcbiAgY29uc3Qgc3RyZWFtID0gcmVhZGVyLl9vd25lclJlYWRhYmxlU3RyZWFtO1xuICBhc3NlcnQoc3RyZWFtICE9PSB1bmRlZmluZWQpO1xuICByZXR1cm4gUmVhZGFibGVTdHJlYW1DYW5jZWwoc3RyZWFtLCByZWFzb24pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1SZWFkZXJHZW5lcmljUmVsZWFzZShyZWFkZXI6IFJlYWRhYmxlU3RyZWFtUmVhZGVyPGFueT4pIHtcbiAgY29uc3Qgc3RyZWFtID0gcmVhZGVyLl9vd25lclJlYWRhYmxlU3RyZWFtO1xuICBhc3NlcnQoc3RyZWFtICE9PSB1bmRlZmluZWQpO1xuICBhc3NlcnQoc3RyZWFtLl9yZWFkZXIgPT09IHJlYWRlcik7XG5cbiAgaWYgKHN0cmVhbS5fc3RhdGUgPT09ICdyZWFkYWJsZScpIHtcbiAgICBkZWZhdWx0UmVhZGVyQ2xvc2VkUHJvbWlzZVJlamVjdChcbiAgICAgIHJlYWRlcixcbiAgICAgIG5ldyBUeXBlRXJyb3IoYFJlYWRlciB3YXMgcmVsZWFzZWQgYW5kIGNhbiBubyBsb25nZXIgYmUgdXNlZCB0byBtb25pdG9yIHRoZSBzdHJlYW0ncyBjbG9zZWRuZXNzYCkpO1xuICB9IGVsc2Uge1xuICAgIGRlZmF1bHRSZWFkZXJDbG9zZWRQcm9taXNlUmVzZXRUb1JlamVjdGVkKFxuICAgICAgcmVhZGVyLFxuICAgICAgbmV3IFR5cGVFcnJvcihgUmVhZGVyIHdhcyByZWxlYXNlZCBhbmQgY2FuIG5vIGxvbmdlciBiZSB1c2VkIHRvIG1vbml0b3IgdGhlIHN0cmVhbSdzIGNsb3NlZG5lc3NgKSk7XG4gIH1cblxuICBzdHJlYW0uX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlcltSZWxlYXNlU3RlcHNdKCk7XG5cbiAgc3RyZWFtLl9yZWFkZXIgPSB1bmRlZmluZWQ7XG4gIHJlYWRlci5fb3duZXJSZWFkYWJsZVN0cmVhbSA9IHVuZGVmaW5lZCE7XG59XG5cbi8vIEhlbHBlciBmdW5jdGlvbnMgZm9yIHRoZSByZWFkZXJzLlxuXG5leHBvcnQgZnVuY3Rpb24gcmVhZGVyTG9ja0V4Y2VwdGlvbihuYW1lOiBzdHJpbmcpOiBUeXBlRXJyb3Ige1xuICByZXR1cm4gbmV3IFR5cGVFcnJvcignQ2Fubm90ICcgKyBuYW1lICsgJyBhIHN0cmVhbSB1c2luZyBhIHJlbGVhc2VkIHJlYWRlcicpO1xufVxuXG4vLyBIZWxwZXIgZnVuY3Rpb25zIGZvciB0aGUgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyLlxuXG5leHBvcnQgZnVuY3Rpb24gZGVmYXVsdFJlYWRlckNsb3NlZFByb21pc2VJbml0aWFsaXplKHJlYWRlcjogUmVhZGFibGVTdHJlYW1SZWFkZXI8YW55Pikge1xuICByZWFkZXIuX2Nsb3NlZFByb21pc2UgPSBuZXdQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICByZWFkZXIuX2Nsb3NlZFByb21pc2VfcmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgcmVhZGVyLl9jbG9zZWRQcm9taXNlX3JlamVjdCA9IHJlamVjdDtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWZhdWx0UmVhZGVyQ2xvc2VkUHJvbWlzZUluaXRpYWxpemVBc1JlamVjdGVkKHJlYWRlcjogUmVhZGFibGVTdHJlYW1SZWFkZXI8YW55PiwgcmVhc29uOiBhbnkpIHtcbiAgZGVmYXVsdFJlYWRlckNsb3NlZFByb21pc2VJbml0aWFsaXplKHJlYWRlcik7XG4gIGRlZmF1bHRSZWFkZXJDbG9zZWRQcm9taXNlUmVqZWN0KHJlYWRlciwgcmVhc29uKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRSZWFkZXJDbG9zZWRQcm9taXNlSW5pdGlhbGl6ZUFzUmVzb2x2ZWQocmVhZGVyOiBSZWFkYWJsZVN0cmVhbVJlYWRlcjxhbnk+KSB7XG4gIGRlZmF1bHRSZWFkZXJDbG9zZWRQcm9taXNlSW5pdGlhbGl6ZShyZWFkZXIpO1xuICBkZWZhdWx0UmVhZGVyQ2xvc2VkUHJvbWlzZVJlc29sdmUocmVhZGVyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRSZWFkZXJDbG9zZWRQcm9taXNlUmVqZWN0KHJlYWRlcjogUmVhZGFibGVTdHJlYW1SZWFkZXI8YW55PiwgcmVhc29uOiBhbnkpIHtcbiAgaWYgKHJlYWRlci5fY2xvc2VkUHJvbWlzZV9yZWplY3QgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHNldFByb21pc2VJc0hhbmRsZWRUb1RydWUocmVhZGVyLl9jbG9zZWRQcm9taXNlKTtcbiAgcmVhZGVyLl9jbG9zZWRQcm9taXNlX3JlamVjdChyZWFzb24pO1xuICByZWFkZXIuX2Nsb3NlZFByb21pc2VfcmVzb2x2ZSA9IHVuZGVmaW5lZDtcbiAgcmVhZGVyLl9jbG9zZWRQcm9taXNlX3JlamVjdCA9IHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRSZWFkZXJDbG9zZWRQcm9taXNlUmVzZXRUb1JlamVjdGVkKHJlYWRlcjogUmVhZGFibGVTdHJlYW1SZWFkZXI8YW55PiwgcmVhc29uOiBhbnkpIHtcbiAgYXNzZXJ0KHJlYWRlci5fY2xvc2VkUHJvbWlzZV9yZXNvbHZlID09PSB1bmRlZmluZWQpO1xuICBhc3NlcnQocmVhZGVyLl9jbG9zZWRQcm9taXNlX3JlamVjdCA9PT0gdW5kZWZpbmVkKTtcblxuICBkZWZhdWx0UmVhZGVyQ2xvc2VkUHJvbWlzZUluaXRpYWxpemVBc1JlamVjdGVkKHJlYWRlciwgcmVhc29uKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRSZWFkZXJDbG9zZWRQcm9taXNlUmVzb2x2ZShyZWFkZXI6IFJlYWRhYmxlU3RyZWFtUmVhZGVyPGFueT4pIHtcbiAgaWYgKHJlYWRlci5fY2xvc2VkUHJvbWlzZV9yZXNvbHZlID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICByZWFkZXIuX2Nsb3NlZFByb21pc2VfcmVzb2x2ZSh1bmRlZmluZWQpO1xuICByZWFkZXIuX2Nsb3NlZFByb21pc2VfcmVzb2x2ZSA9IHVuZGVmaW5lZDtcbiAgcmVhZGVyLl9jbG9zZWRQcm9taXNlX3JlamVjdCA9IHVuZGVmaW5lZDtcbn1cbiIsICIvLy8gPHJlZmVyZW5jZSBsaWI9XCJlczIwMTUuY29yZVwiIC8+XG5cbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL051bWJlci9pc0Zpbml0ZSNQb2x5ZmlsbFxuY29uc3QgTnVtYmVySXNGaW5pdGU6IHR5cGVvZiBOdW1iZXIuaXNGaW5pdGUgPSBOdW1iZXIuaXNGaW5pdGUgfHwgZnVuY3Rpb24gKHgpIHtcbiAgcmV0dXJuIHR5cGVvZiB4ID09PSAnbnVtYmVyJyAmJiBpc0Zpbml0ZSh4KTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IE51bWJlcklzRmluaXRlO1xuIiwgIi8vLyA8cmVmZXJlbmNlIGxpYj1cImVzMjAxNS5jb3JlXCIgLz5cblxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvTWF0aC90cnVuYyNQb2x5ZmlsbFxuY29uc3QgTWF0aFRydW5jOiB0eXBlb2YgTWF0aC50cnVuYyA9IE1hdGgudHJ1bmMgfHwgZnVuY3Rpb24gKHYpIHtcbiAgcmV0dXJuIHYgPCAwID8gTWF0aC5jZWlsKHYpIDogTWF0aC5mbG9vcih2KTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IE1hdGhUcnVuYztcbiIsICJpbXBvcnQgTnVtYmVySXNGaW5pdGUgZnJvbSAnLi4vLi4vc3R1Yi9udW1iZXItaXNmaW5pdGUnO1xuaW1wb3J0IE1hdGhUcnVuYyBmcm9tICcuLi8uLi9zdHViL21hdGgtdHJ1bmMnO1xuXG4vLyBodHRwczovL2hleWNhbS5naXRodWIuaW8vd2ViaWRsLyNpZGwtZGljdGlvbmFyaWVzXG5leHBvcnQgZnVuY3Rpb24gaXNEaWN0aW9uYXJ5KHg6IGFueSk6IHggaXMgb2JqZWN0IHwgbnVsbCB7XG4gIHJldHVybiB0eXBlb2YgeCA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIHggPT09ICdmdW5jdGlvbic7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnREaWN0aW9uYXJ5KG9iajogdW5rbm93bixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6IHN0cmluZyk6IGFzc2VydHMgb2JqIGlzIG9iamVjdCB8IG51bGwgfCB1bmRlZmluZWQge1xuICBpZiAob2JqICE9PSB1bmRlZmluZWQgJiYgIWlzRGljdGlvbmFyeShvYmopKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgJHtjb250ZXh0fSBpcyBub3QgYW4gb2JqZWN0LmApO1xuICB9XG59XG5cbmV4cG9ydCB0eXBlIEFueUZ1bmN0aW9uID0gKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnk7XG5cbi8vIGh0dHBzOi8vaGV5Y2FtLmdpdGh1Yi5pby93ZWJpZGwvI2lkbC1jYWxsYmFjay1mdW5jdGlvbnNcbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnRGdW5jdGlvbih4OiB1bmtub3duLCBjb250ZXh0OiBzdHJpbmcpOiBhc3NlcnRzIHggaXMgQW55RnVuY3Rpb24ge1xuICBpZiAodHlwZW9mIHggIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGAke2NvbnRleHR9IGlzIG5vdCBhIGZ1bmN0aW9uLmApO1xuICB9XG59XG5cbi8vIGh0dHBzOi8vaGV5Y2FtLmdpdGh1Yi5pby93ZWJpZGwvI2lkbC1vYmplY3RcbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdCh4OiBhbnkpOiB4IGlzIG9iamVjdCB7XG4gIHJldHVybiAodHlwZW9mIHggPT09ICdvYmplY3QnICYmIHggIT09IG51bGwpIHx8IHR5cGVvZiB4ID09PSAnZnVuY3Rpb24nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0T2JqZWN0KHg6IHVua25vd24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6IHN0cmluZyk6IGFzc2VydHMgeCBpcyBvYmplY3Qge1xuICBpZiAoIWlzT2JqZWN0KHgpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgJHtjb250ZXh0fSBpcyBub3QgYW4gb2JqZWN0LmApO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnRSZXF1aXJlZEFyZ3VtZW50PFQ+KHg6IFQgfCB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dDogc3RyaW5nKTogYXNzZXJ0cyB4IGlzIFQge1xuICBpZiAoeCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgUGFyYW1ldGVyICR7cG9zaXRpb259IGlzIHJlcXVpcmVkIGluICcke2NvbnRleHR9Jy5gKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0UmVxdWlyZWRGaWVsZDxUPih4OiBUIHwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQ6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6IHN0cmluZyk6IGFzc2VydHMgeCBpcyBUIHtcbiAgaWYgKHggPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYCR7ZmllbGR9IGlzIHJlcXVpcmVkIGluICcke2NvbnRleHR9Jy5gKTtcbiAgfVxufVxuXG4vLyBodHRwczovL2hleWNhbS5naXRodWIuaW8vd2ViaWRsLyNpZGwtdW5yZXN0cmljdGVkLWRvdWJsZVxuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRVbnJlc3RyaWN0ZWREb3VibGUodmFsdWU6IHVua25vd24pOiBudW1iZXIge1xuICByZXR1cm4gTnVtYmVyKHZhbHVlKTtcbn1cblxuZnVuY3Rpb24gY2Vuc29yTmVnYXRpdmVaZXJvKHg6IG51bWJlcik6IG51bWJlciB7XG4gIHJldHVybiB4ID09PSAwID8gMCA6IHg7XG59XG5cbmZ1bmN0aW9uIGludGVnZXJQYXJ0KHg6IG51bWJlcik6IG51bWJlciB7XG4gIHJldHVybiBjZW5zb3JOZWdhdGl2ZVplcm8oTWF0aFRydW5jKHgpKTtcbn1cblxuLy8gaHR0cHM6Ly9oZXljYW0uZ2l0aHViLmlvL3dlYmlkbC8jaWRsLXVuc2lnbmVkLWxvbmctbG9uZ1xuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRVbnNpZ25lZExvbmdMb25nV2l0aEVuZm9yY2VSYW5nZSh2YWx1ZTogdW5rbm93biwgY29udGV4dDogc3RyaW5nKTogbnVtYmVyIHtcbiAgY29uc3QgbG93ZXJCb3VuZCA9IDA7XG4gIGNvbnN0IHVwcGVyQm91bmQgPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcblxuICBsZXQgeCA9IE51bWJlcih2YWx1ZSk7XG4gIHggPSBjZW5zb3JOZWdhdGl2ZVplcm8oeCk7XG5cbiAgaWYgKCFOdW1iZXJJc0Zpbml0ZSh4KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYCR7Y29udGV4dH0gaXMgbm90IGEgZmluaXRlIG51bWJlcmApO1xuICB9XG5cbiAgeCA9IGludGVnZXJQYXJ0KHgpO1xuXG4gIGlmICh4IDwgbG93ZXJCb3VuZCB8fCB4ID4gdXBwZXJCb3VuZCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYCR7Y29udGV4dH0gaXMgb3V0c2lkZSB0aGUgYWNjZXB0ZWQgcmFuZ2Ugb2YgJHtsb3dlckJvdW5kfSB0byAke3VwcGVyQm91bmR9LCBpbmNsdXNpdmVgKTtcbiAgfVxuXG4gIGlmICghTnVtYmVySXNGaW5pdGUoeCkgfHwgeCA9PT0gMCkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgLy8gVE9ETyBVc2UgQmlnSW50IGlmIHN1cHBvcnRlZD9cbiAgLy8gbGV0IHhCaWdJbnQgPSBCaWdJbnQoaW50ZWdlclBhcnQoeCkpO1xuICAvLyB4QmlnSW50ID0gQmlnSW50LmFzVWludE4oNjQsIHhCaWdJbnQpO1xuICAvLyByZXR1cm4gTnVtYmVyKHhCaWdJbnQpO1xuXG4gIHJldHVybiB4O1xufVxuIiwgImltcG9ydCB7IElzUmVhZGFibGVTdHJlYW0sIFJlYWRhYmxlU3RyZWFtIH0gZnJvbSAnLi4vcmVhZGFibGUtc3RyZWFtJztcblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydFJlYWRhYmxlU3RyZWFtKHg6IHVua25vd24sIGNvbnRleHQ6IHN0cmluZyk6IGFzc2VydHMgeCBpcyBSZWFkYWJsZVN0cmVhbSB7XG4gIGlmICghSXNSZWFkYWJsZVN0cmVhbSh4KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYCR7Y29udGV4dH0gaXMgbm90IGEgUmVhZGFibGVTdHJlYW0uYCk7XG4gIH1cbn1cbiIsICJpbXBvcnQgYXNzZXJ0IGZyb20gJy4uLy4uL3N0dWIvYXNzZXJ0JztcbmltcG9ydCB7IFNpbXBsZVF1ZXVlIH0gZnJvbSAnLi4vc2ltcGxlLXF1ZXVlJztcbmltcG9ydCB7XG4gIFJlYWRhYmxlU3RyZWFtUmVhZGVyR2VuZXJpY0NhbmNlbCxcbiAgUmVhZGFibGVTdHJlYW1SZWFkZXJHZW5lcmljSW5pdGlhbGl6ZSxcbiAgUmVhZGFibGVTdHJlYW1SZWFkZXJHZW5lcmljUmVsZWFzZSxcbiAgcmVhZGVyTG9ja0V4Y2VwdGlvblxufSBmcm9tICcuL2dlbmVyaWMtcmVhZGVyJztcbmltcG9ydCB7IElzUmVhZGFibGVTdHJlYW1Mb2NrZWQsIFJlYWRhYmxlU3RyZWFtIH0gZnJvbSAnLi4vcmVhZGFibGUtc3RyZWFtJztcbmltcG9ydCB7IHNldEZ1bmN0aW9uTmFtZSwgdHlwZUlzT2JqZWN0IH0gZnJvbSAnLi4vaGVscGVycy9taXNjZWxsYW5lb3VzJztcbmltcG9ydCB7IFB1bGxTdGVwcyB9IGZyb20gJy4uL2Fic3RyYWN0LW9wcy9pbnRlcm5hbC1tZXRob2RzJztcbmltcG9ydCB7IG5ld1Byb21pc2UsIHByb21pc2VSZWplY3RlZFdpdGggfSBmcm9tICcuLi9oZWxwZXJzL3dlYmlkbCc7XG5pbXBvcnQgeyBhc3NlcnRSZXF1aXJlZEFyZ3VtZW50IH0gZnJvbSAnLi4vdmFsaWRhdG9ycy9iYXNpYyc7XG5pbXBvcnQgeyBhc3NlcnRSZWFkYWJsZVN0cmVhbSB9IGZyb20gJy4uL3ZhbGlkYXRvcnMvcmVhZGFibGUtc3RyZWFtJztcblxuLyoqXG4gKiBBIHJlc3VsdCByZXR1cm5lZCBieSB7QGxpbmsgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyLnJlYWR9LlxuICpcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IHR5cGUgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZFJlc3VsdDxUPiA9IHtcbiAgZG9uZTogZmFsc2U7XG4gIHZhbHVlOiBUO1xufSB8IHtcbiAgZG9uZTogdHJ1ZTtcbiAgdmFsdWU/OiB1bmRlZmluZWQ7XG59XG5cbi8vIEFic3RyYWN0IG9wZXJhdGlvbnMgZm9yIHRoZSBSZWFkYWJsZVN0cmVhbS5cblxuZXhwb3J0IGZ1bmN0aW9uIEFjcXVpcmVSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXI8Uj4oc3RyZWFtOiBSZWFkYWJsZVN0cmVhbSk6IFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcjxSPiB7XG4gIHJldHVybiBuZXcgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyKHN0cmVhbSk7XG59XG5cbi8vIFJlYWRhYmxlU3RyZWFtIEFQSSBleHBvc2VkIGZvciBjb250cm9sbGVycy5cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtQWRkUmVhZFJlcXVlc3Q8Uj4oc3RyZWFtOiBSZWFkYWJsZVN0cmVhbTxSPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlYWRSZXF1ZXN0OiBSZWFkUmVxdWVzdDxSPik6IHZvaWQge1xuICBhc3NlcnQoSXNSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXIoc3RyZWFtLl9yZWFkZXIpKTtcbiAgYXNzZXJ0KHN0cmVhbS5fc3RhdGUgPT09ICdyZWFkYWJsZScpO1xuXG4gIChzdHJlYW0uX3JlYWRlciEgYXMgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyPFI+KS5fcmVhZFJlcXVlc3RzLnB1c2gocmVhZFJlcXVlc3QpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1GdWxmaWxsUmVhZFJlcXVlc3Q8Uj4oc3RyZWFtOiBSZWFkYWJsZVN0cmVhbTxSPiwgY2h1bms6IFIgfCB1bmRlZmluZWQsIGRvbmU6IGJvb2xlYW4pIHtcbiAgY29uc3QgcmVhZGVyID0gc3RyZWFtLl9yZWFkZXIgYXMgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyPFI+O1xuXG4gIGFzc2VydChyZWFkZXIuX3JlYWRSZXF1ZXN0cy5sZW5ndGggPiAwKTtcblxuICBjb25zdCByZWFkUmVxdWVzdCA9IHJlYWRlci5fcmVhZFJlcXVlc3RzLnNoaWZ0KCkhO1xuICBpZiAoZG9uZSkge1xuICAgIHJlYWRSZXF1ZXN0Ll9jbG9zZVN0ZXBzKCk7XG4gIH0gZWxzZSB7XG4gICAgcmVhZFJlcXVlc3QuX2NodW5rU3RlcHMoY2h1bmshKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1HZXROdW1SZWFkUmVxdWVzdHM8Uj4oc3RyZWFtOiBSZWFkYWJsZVN0cmVhbTxSPik6IG51bWJlciB7XG4gIHJldHVybiAoc3RyZWFtLl9yZWFkZXIgYXMgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyPFI+KS5fcmVhZFJlcXVlc3RzLmxlbmd0aDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtSGFzRGVmYXVsdFJlYWRlcihzdHJlYW06IFJlYWRhYmxlU3RyZWFtKTogYm9vbGVhbiB7XG4gIGNvbnN0IHJlYWRlciA9IHN0cmVhbS5fcmVhZGVyO1xuXG4gIGlmIChyZWFkZXIgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICghSXNSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXIocmVhZGVyKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG4vLyBSZWFkZXJzXG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVhZFJlcXVlc3Q8Uj4ge1xuICBfY2h1bmtTdGVwcyhjaHVuazogUik6IHZvaWQ7XG5cbiAgX2Nsb3NlU3RlcHMoKTogdm9pZDtcblxuICBfZXJyb3JTdGVwcyhlOiBhbnkpOiB2b2lkO1xufVxuXG4vKipcbiAqIEEgZGVmYXVsdCByZWFkZXIgdmVuZGVkIGJ5IGEge0BsaW5rIFJlYWRhYmxlU3RyZWFtfS5cbiAqXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjbGFzcyBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXI8UiA9IGFueT4ge1xuICAvKiogQGludGVybmFsICovXG4gIF9vd25lclJlYWRhYmxlU3RyZWFtITogUmVhZGFibGVTdHJlYW08Uj47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2Nsb3NlZFByb21pc2UhOiBQcm9taXNlPHVuZGVmaW5lZD47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2Nsb3NlZFByb21pc2VfcmVzb2x2ZT86ICh2YWx1ZT86IHVuZGVmaW5lZCkgPT4gdm9pZDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfY2xvc2VkUHJvbWlzZV9yZWplY3Q/OiAocmVhc29uOiBhbnkpID0+IHZvaWQ7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3JlYWRSZXF1ZXN0czogU2ltcGxlUXVldWU8UmVhZFJlcXVlc3Q8Uj4+O1xuXG4gIGNvbnN0cnVjdG9yKHN0cmVhbTogUmVhZGFibGVTdHJlYW08Uj4pIHtcbiAgICBhc3NlcnRSZXF1aXJlZEFyZ3VtZW50KHN0cmVhbSwgMSwgJ1JlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcicpO1xuICAgIGFzc2VydFJlYWRhYmxlU3RyZWFtKHN0cmVhbSwgJ0ZpcnN0IHBhcmFtZXRlcicpO1xuXG4gICAgaWYgKElzUmVhZGFibGVTdHJlYW1Mb2NrZWQoc3RyZWFtKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhpcyBzdHJlYW0gaGFzIGFscmVhZHkgYmVlbiBsb2NrZWQgZm9yIGV4Y2x1c2l2ZSByZWFkaW5nIGJ5IGFub3RoZXIgcmVhZGVyJyk7XG4gICAgfVxuXG4gICAgUmVhZGFibGVTdHJlYW1SZWFkZXJHZW5lcmljSW5pdGlhbGl6ZSh0aGlzLCBzdHJlYW0pO1xuXG4gICAgdGhpcy5fcmVhZFJlcXVlc3RzID0gbmV3IFNpbXBsZVF1ZXVlKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHByb21pc2UgdGhhdCB3aWxsIGJlIGZ1bGZpbGxlZCB3aGVuIHRoZSBzdHJlYW0gYmVjb21lcyBjbG9zZWQsXG4gICAqIG9yIHJlamVjdGVkIGlmIHRoZSBzdHJlYW0gZXZlciBlcnJvcnMgb3IgdGhlIHJlYWRlcidzIGxvY2sgaXMgcmVsZWFzZWQgYmVmb3JlIHRoZSBzdHJlYW0gZmluaXNoZXMgY2xvc2luZy5cbiAgICovXG4gIGdldCBjbG9zZWQoKTogUHJvbWlzZTx1bmRlZmluZWQ+IHtcbiAgICBpZiAoIUlzUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyKHRoaXMpKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChkZWZhdWx0UmVhZGVyQnJhbmRDaGVja0V4Y2VwdGlvbignY2xvc2VkJykpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9jbG9zZWRQcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIElmIHRoZSByZWFkZXIgaXMgYWN0aXZlLCBiZWhhdmVzIHRoZSBzYW1lIGFzIHtAbGluayBSZWFkYWJsZVN0cmVhbS5jYW5jZWwgfCBzdHJlYW0uY2FuY2VsKHJlYXNvbil9LlxuICAgKi9cbiAgY2FuY2VsKHJlYXNvbjogYW55ID0gdW5kZWZpbmVkKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCFJc1JlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcih0aGlzKSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoZGVmYXVsdFJlYWRlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ2NhbmNlbCcpKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fb3duZXJSZWFkYWJsZVN0cmVhbSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChyZWFkZXJMb2NrRXhjZXB0aW9uKCdjYW5jZWwnKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFJlYWRhYmxlU3RyZWFtUmVhZGVyR2VuZXJpY0NhbmNlbCh0aGlzLCByZWFzb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBwcm9taXNlIHRoYXQgYWxsb3dzIGFjY2VzcyB0byB0aGUgbmV4dCBjaHVuayBmcm9tIHRoZSBzdHJlYW0ncyBpbnRlcm5hbCBxdWV1ZSwgaWYgYXZhaWxhYmxlLlxuICAgKlxuICAgKiBJZiByZWFkaW5nIGEgY2h1bmsgY2F1c2VzIHRoZSBxdWV1ZSB0byBiZWNvbWUgZW1wdHksIG1vcmUgZGF0YSB3aWxsIGJlIHB1bGxlZCBmcm9tIHRoZSB1bmRlcmx5aW5nIHNvdXJjZS5cbiAgICovXG4gIHJlYWQoKTogUHJvbWlzZTxSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkUmVzdWx0PFI+PiB7XG4gICAgaWYgKCFJc1JlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcih0aGlzKSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoZGVmYXVsdFJlYWRlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ3JlYWQnKSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX293bmVyUmVhZGFibGVTdHJlYW0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgocmVhZGVyTG9ja0V4Y2VwdGlvbigncmVhZCBmcm9tJykpO1xuICAgIH1cblxuICAgIGxldCByZXNvbHZlUHJvbWlzZSE6IChyZXN1bHQ6IFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRSZXN1bHQ8Uj4pID0+IHZvaWQ7XG4gICAgbGV0IHJlamVjdFByb21pc2UhOiAocmVhc29uOiBhbnkpID0+IHZvaWQ7XG4gICAgY29uc3QgcHJvbWlzZSA9IG5ld1Byb21pc2U8UmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZFJlc3VsdDxSPj4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgcmVzb2x2ZVByb21pc2UgPSByZXNvbHZlO1xuICAgICAgcmVqZWN0UHJvbWlzZSA9IHJlamVjdDtcbiAgICB9KTtcbiAgICBjb25zdCByZWFkUmVxdWVzdDogUmVhZFJlcXVlc3Q8Uj4gPSB7XG4gICAgICBfY2h1bmtTdGVwczogY2h1bmsgPT4gcmVzb2x2ZVByb21pc2UoeyB2YWx1ZTogY2h1bmssIGRvbmU6IGZhbHNlIH0pLFxuICAgICAgX2Nsb3NlU3RlcHM6ICgpID0+IHJlc29sdmVQcm9taXNlKHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9KSxcbiAgICAgIF9lcnJvclN0ZXBzOiBlID0+IHJlamVjdFByb21pc2UoZSlcbiAgICB9O1xuICAgIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlclJlYWQodGhpcywgcmVhZFJlcXVlc3QpO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbGVhc2VzIHRoZSByZWFkZXIncyBsb2NrIG9uIHRoZSBjb3JyZXNwb25kaW5nIHN0cmVhbS4gQWZ0ZXIgdGhlIGxvY2sgaXMgcmVsZWFzZWQsIHRoZSByZWFkZXIgaXMgbm8gbG9uZ2VyIGFjdGl2ZS5cbiAgICogSWYgdGhlIGFzc29jaWF0ZWQgc3RyZWFtIGlzIGVycm9yZWQgd2hlbiB0aGUgbG9jayBpcyByZWxlYXNlZCwgdGhlIHJlYWRlciB3aWxsIGFwcGVhciBlcnJvcmVkIGluIHRoZSBzYW1lIHdheVxuICAgKiBmcm9tIG5vdyBvbjsgb3RoZXJ3aXNlLCB0aGUgcmVhZGVyIHdpbGwgYXBwZWFyIGNsb3NlZC5cbiAgICpcbiAgICogQSByZWFkZXIncyBsb2NrIGNhbm5vdCBiZSByZWxlYXNlZCB3aGlsZSBpdCBzdGlsbCBoYXMgYSBwZW5kaW5nIHJlYWQgcmVxdWVzdCwgaS5lLiwgaWYgYSBwcm9taXNlIHJldHVybmVkIGJ5XG4gICAqIHRoZSByZWFkZXIncyB7QGxpbmsgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyLnJlYWQgfCByZWFkKCl9IG1ldGhvZCBoYXMgbm90IHlldCBiZWVuIHNldHRsZWQuIEF0dGVtcHRpbmcgdG9cbiAgICogZG8gc28gd2lsbCB0aHJvdyBhIGBUeXBlRXJyb3JgIGFuZCBsZWF2ZSB0aGUgcmVhZGVyIGxvY2tlZCB0byB0aGUgc3RyZWFtLlxuICAgKi9cbiAgcmVsZWFzZUxvY2soKTogdm9pZCB7XG4gICAgaWYgKCFJc1JlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcih0aGlzKSkge1xuICAgICAgdGhyb3cgZGVmYXVsdFJlYWRlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ3JlbGVhc2VMb2NrJyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX293bmVyUmVhZGFibGVTdHJlYW0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlclJlbGVhc2UodGhpcyk7XG4gIH1cbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyLnByb3RvdHlwZSwge1xuICBjYW5jZWw6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICByZWFkOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgcmVsZWFzZUxvY2s6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICBjbG9zZWQ6IHsgZW51bWVyYWJsZTogdHJ1ZSB9XG59KTtcbnNldEZ1bmN0aW9uTmFtZShSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXIucHJvdG90eXBlLmNhbmNlbCwgJ2NhbmNlbCcpO1xuc2V0RnVuY3Rpb25OYW1lKFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlci5wcm90b3R5cGUucmVhZCwgJ3JlYWQnKTtcbnNldEZ1bmN0aW9uTmFtZShSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXIucHJvdG90eXBlLnJlbGVhc2VMb2NrLCAncmVsZWFzZUxvY2snKTtcbmlmICh0eXBlb2YgU3ltYm9sLnRvU3RyaW5nVGFnID09PSAnc3ltYm9sJykge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyLnByb3RvdHlwZSwgU3ltYm9sLnRvU3RyaW5nVGFnLCB7XG4gICAgdmFsdWU6ICdSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXInLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbn1cblxuLy8gQWJzdHJhY3Qgb3BlcmF0aW9ucyBmb3IgdGhlIHJlYWRlcnMuXG5cbmV4cG9ydCBmdW5jdGlvbiBJc1JlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcjxSID0gYW55Pih4OiBhbnkpOiB4IGlzIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcjxSPiB7XG4gIGlmICghdHlwZUlzT2JqZWN0KHgpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoeCwgJ19yZWFkUmVxdWVzdHMnKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB4IGluc3RhbmNlb2YgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyUmVhZDxSPihyZWFkZXI6IFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcjxSPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlYWRSZXF1ZXN0OiBSZWFkUmVxdWVzdDxSPik6IHZvaWQge1xuICBjb25zdCBzdHJlYW0gPSByZWFkZXIuX293bmVyUmVhZGFibGVTdHJlYW07XG5cbiAgYXNzZXJ0KHN0cmVhbSAhPT0gdW5kZWZpbmVkKTtcblxuICBzdHJlYW0uX2Rpc3R1cmJlZCA9IHRydWU7XG5cbiAgaWYgKHN0cmVhbS5fc3RhdGUgPT09ICdjbG9zZWQnKSB7XG4gICAgcmVhZFJlcXVlc3QuX2Nsb3NlU3RlcHMoKTtcbiAgfSBlbHNlIGlmIChzdHJlYW0uX3N0YXRlID09PSAnZXJyb3JlZCcpIHtcbiAgICByZWFkUmVxdWVzdC5fZXJyb3JTdGVwcyhzdHJlYW0uX3N0b3JlZEVycm9yKTtcbiAgfSBlbHNlIHtcbiAgICBhc3NlcnQoc3RyZWFtLl9zdGF0ZSA9PT0gJ3JlYWRhYmxlJyk7XG4gICAgc3RyZWFtLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXJbUHVsbFN0ZXBzXShyZWFkUmVxdWVzdCBhcyBSZWFkUmVxdWVzdDxhbnk+KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyUmVsZWFzZShyZWFkZXI6IFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcikge1xuICBSZWFkYWJsZVN0cmVhbVJlYWRlckdlbmVyaWNSZWxlYXNlKHJlYWRlcik7XG4gIGNvbnN0IGUgPSBuZXcgVHlwZUVycm9yKCdSZWFkZXIgd2FzIHJlbGVhc2VkJyk7XG4gIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlckVycm9yUmVhZFJlcXVlc3RzKHJlYWRlciwgZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXJFcnJvclJlYWRSZXF1ZXN0cyhyZWFkZXI6IFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlciwgZTogYW55KSB7XG4gIGNvbnN0IHJlYWRSZXF1ZXN0cyA9IHJlYWRlci5fcmVhZFJlcXVlc3RzO1xuICByZWFkZXIuX3JlYWRSZXF1ZXN0cyA9IG5ldyBTaW1wbGVRdWV1ZSgpO1xuICByZWFkUmVxdWVzdHMuZm9yRWFjaChyZWFkUmVxdWVzdCA9PiB7XG4gICAgcmVhZFJlcXVlc3QuX2Vycm9yU3RlcHMoZSk7XG4gIH0pO1xufVxuXG4vLyBIZWxwZXIgZnVuY3Rpb25zIGZvciB0aGUgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyLlxuXG5mdW5jdGlvbiBkZWZhdWx0UmVhZGVyQnJhbmRDaGVja0V4Y2VwdGlvbihuYW1lOiBzdHJpbmcpOiBUeXBlRXJyb3Ige1xuICByZXR1cm4gbmV3IFR5cGVFcnJvcihcbiAgICBgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyLnByb3RvdHlwZS4ke25hbWV9IGNhbiBvbmx5IGJlIHVzZWQgb24gYSBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXJgKTtcbn1cbiIsICIvLy8gPHJlZmVyZW5jZSBsaWI9XCJlczIwMTguYXN5bmNpdGVyYWJsZVwiIC8+XG5cbi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1lbXB0eS1mdW5jdGlvbiAqL1xuZXhwb3J0IGNvbnN0IEFzeW5jSXRlcmF0b3JQcm90b3R5cGU6IEFzeW5jSXRlcmFibGU8YW55PiA9XG4gIE9iamVjdC5nZXRQcm90b3R5cGVPZihPYmplY3QuZ2V0UHJvdG90eXBlT2YoYXN5bmMgZnVuY3Rpb24qICgpOiBBc3luY0l0ZXJhYmxlSXRlcmF0b3I8YW55PiB7fSkucHJvdG90eXBlKTtcbiIsICIvLy8gPHJlZmVyZW5jZSBsaWI9XCJlczIwMTguYXN5bmNpdGVyYWJsZVwiIC8+XG5cbmltcG9ydCB7IFJlYWRhYmxlU3RyZWFtIH0gZnJvbSAnLi4vcmVhZGFibGUtc3RyZWFtJztcbmltcG9ydCB7XG4gIEFjcXVpcmVSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXIsXG4gIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcixcbiAgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyUmVhZCxcbiAgdHlwZSBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkUmVzdWx0LFxuICB0eXBlIFJlYWRSZXF1ZXN0XG59IGZyb20gJy4vZGVmYXVsdC1yZWFkZXInO1xuaW1wb3J0IHsgUmVhZGFibGVTdHJlYW1SZWFkZXJHZW5lcmljQ2FuY2VsLCBSZWFkYWJsZVN0cmVhbVJlYWRlckdlbmVyaWNSZWxlYXNlIH0gZnJvbSAnLi9nZW5lcmljLXJlYWRlcic7XG5pbXBvcnQgYXNzZXJ0IGZyb20gJy4uLy4uL3N0dWIvYXNzZXJ0JztcbmltcG9ydCB7IEFzeW5jSXRlcmF0b3JQcm90b3R5cGUgfSBmcm9tICdAQHRhcmdldC9zdHViL2FzeW5jLWl0ZXJhdG9yLXByb3RvdHlwZSc7XG5pbXBvcnQgeyB0eXBlSXNPYmplY3QgfSBmcm9tICcuLi9oZWxwZXJzL21pc2NlbGxhbmVvdXMnO1xuaW1wb3J0IHtcbiAgbmV3UHJvbWlzZSxcbiAgcHJvbWlzZVJlamVjdGVkV2l0aCxcbiAgcHJvbWlzZVJlc29sdmVkV2l0aCxcbiAgcXVldWVNaWNyb3Rhc2ssXG4gIHRyYW5zZm9ybVByb21pc2VXaXRoXG59IGZyb20gJy4uL2hlbHBlcnMvd2ViaWRsJztcblxuLyoqXG4gKiBBbiBhc3luYyBpdGVyYXRvciByZXR1cm5lZCBieSB7QGxpbmsgUmVhZGFibGVTdHJlYW0udmFsdWVzfS5cbiAqXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9yPFI+IGV4dGVuZHMgQXN5bmNJdGVyYWJsZUl0ZXJhdG9yPFI+IHtcbiAgbmV4dCgpOiBQcm9taXNlPEl0ZXJhdG9yUmVzdWx0PFIsIHVuZGVmaW5lZD4+O1xuXG4gIHJldHVybih2YWx1ZT86IGFueSk6IFByb21pc2U8SXRlcmF0b3JSZXN1bHQ8YW55Pj47XG59XG5cbmV4cG9ydCBjbGFzcyBSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3JJbXBsPFI+IHtcbiAgcHJpdmF0ZSByZWFkb25seSBfcmVhZGVyOiBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXI8Uj47XG4gIHByaXZhdGUgcmVhZG9ubHkgX3ByZXZlbnRDYW5jZWw6IGJvb2xlYW47XG4gIHByaXZhdGUgX29uZ29pbmdQcm9taXNlOiBQcm9taXNlPFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRSZXN1bHQ8Uj4+IHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICBwcml2YXRlIF9pc0ZpbmlzaGVkID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IocmVhZGVyOiBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXI8Uj4sIHByZXZlbnRDYW5jZWw6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9yZWFkZXIgPSByZWFkZXI7XG4gICAgdGhpcy5fcHJldmVudENhbmNlbCA9IHByZXZlbnRDYW5jZWw7XG4gIH1cblxuICBuZXh0KCk6IFByb21pc2U8UmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZFJlc3VsdDxSPj4ge1xuICAgIGNvbnN0IG5leHRTdGVwcyA9ICgpID0+IHRoaXMuX25leHRTdGVwcygpO1xuICAgIHRoaXMuX29uZ29pbmdQcm9taXNlID0gdGhpcy5fb25nb2luZ1Byb21pc2UgP1xuICAgICAgdHJhbnNmb3JtUHJvbWlzZVdpdGgodGhpcy5fb25nb2luZ1Byb21pc2UsIG5leHRTdGVwcywgbmV4dFN0ZXBzKSA6XG4gICAgICBuZXh0U3RlcHMoKTtcbiAgICByZXR1cm4gdGhpcy5fb25nb2luZ1Byb21pc2U7XG4gIH1cblxuICByZXR1cm4odmFsdWU6IGFueSk6IFByb21pc2U8UmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZFJlc3VsdDxhbnk+PiB7XG4gICAgY29uc3QgcmV0dXJuU3RlcHMgPSAoKSA9PiB0aGlzLl9yZXR1cm5TdGVwcyh2YWx1ZSk7XG4gICAgcmV0dXJuIHRoaXMuX29uZ29pbmdQcm9taXNlID9cbiAgICAgIHRyYW5zZm9ybVByb21pc2VXaXRoKHRoaXMuX29uZ29pbmdQcm9taXNlLCByZXR1cm5TdGVwcywgcmV0dXJuU3RlcHMpIDpcbiAgICAgIHJldHVyblN0ZXBzKCk7XG4gIH1cblxuICBwcml2YXRlIF9uZXh0U3RlcHMoKTogUHJvbWlzZTxSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkUmVzdWx0PFI+PiB7XG4gICAgaWYgKHRoaXMuX2lzRmluaXNoZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoeyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IHJlYWRlciA9IHRoaXMuX3JlYWRlcjtcbiAgICBhc3NlcnQocmVhZGVyLl9vd25lclJlYWRhYmxlU3RyZWFtICE9PSB1bmRlZmluZWQpO1xuXG4gICAgbGV0IHJlc29sdmVQcm9taXNlITogKHJlc3VsdDogUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZFJlc3VsdDxSPikgPT4gdm9pZDtcbiAgICBsZXQgcmVqZWN0UHJvbWlzZSE6IChyZWFzb246IGFueSkgPT4gdm9pZDtcbiAgICBjb25zdCBwcm9taXNlID0gbmV3UHJvbWlzZTxSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkUmVzdWx0PFI+PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICByZXNvbHZlUHJvbWlzZSA9IHJlc29sdmU7XG4gICAgICByZWplY3RQcm9taXNlID0gcmVqZWN0O1xuICAgIH0pO1xuICAgIGNvbnN0IHJlYWRSZXF1ZXN0OiBSZWFkUmVxdWVzdDxSPiA9IHtcbiAgICAgIF9jaHVua1N0ZXBzOiBjaHVuayA9PiB7XG4gICAgICAgIHRoaXMuX29uZ29pbmdQcm9taXNlID0gdW5kZWZpbmVkO1xuICAgICAgICAvLyBUaGlzIG5lZWRzIHRvIGJlIGRlbGF5ZWQgYnkgb25lIG1pY3JvdGFzaywgb3RoZXJ3aXNlIHdlIHN0b3AgcHVsbGluZyB0b28gZWFybHkgd2hpY2ggYnJlYWtzIGEgdGVzdC5cbiAgICAgICAgLy8gRklYTUUgSXMgdGhpcyBhIGJ1ZyBpbiB0aGUgc3BlY2lmaWNhdGlvbiwgb3IgaW4gdGhlIHRlc3Q/XG4gICAgICAgIHF1ZXVlTWljcm90YXNrKCgpID0+IHJlc29sdmVQcm9taXNlKHsgdmFsdWU6IGNodW5rLCBkb25lOiBmYWxzZSB9KSk7XG4gICAgICB9LFxuICAgICAgX2Nsb3NlU3RlcHM6ICgpID0+IHtcbiAgICAgICAgdGhpcy5fb25nb2luZ1Byb21pc2UgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuX2lzRmluaXNoZWQgPSB0cnVlO1xuICAgICAgICBSZWFkYWJsZVN0cmVhbVJlYWRlckdlbmVyaWNSZWxlYXNlKHJlYWRlcik7XG4gICAgICAgIHJlc29sdmVQcm9taXNlKHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9KTtcbiAgICAgIH0sXG4gICAgICBfZXJyb3JTdGVwczogcmVhc29uID0+IHtcbiAgICAgICAgdGhpcy5fb25nb2luZ1Byb21pc2UgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuX2lzRmluaXNoZWQgPSB0cnVlO1xuICAgICAgICBSZWFkYWJsZVN0cmVhbVJlYWRlckdlbmVyaWNSZWxlYXNlKHJlYWRlcik7XG4gICAgICAgIHJlamVjdFByb21pc2UocmVhc29uKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlclJlYWQocmVhZGVyLCByZWFkUmVxdWVzdCk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICBwcml2YXRlIF9yZXR1cm5TdGVwcyh2YWx1ZTogYW55KTogUHJvbWlzZTxSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkUmVzdWx0PGFueT4+IHtcbiAgICBpZiAodGhpcy5faXNGaW5pc2hlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7IHZhbHVlLCBkb25lOiB0cnVlIH0pO1xuICAgIH1cbiAgICB0aGlzLl9pc0ZpbmlzaGVkID0gdHJ1ZTtcblxuICAgIGNvbnN0IHJlYWRlciA9IHRoaXMuX3JlYWRlcjtcbiAgICBhc3NlcnQocmVhZGVyLl9vd25lclJlYWRhYmxlU3RyZWFtICE9PSB1bmRlZmluZWQpO1xuICAgIGFzc2VydChyZWFkZXIuX3JlYWRSZXF1ZXN0cy5sZW5ndGggPT09IDApO1xuXG4gICAgaWYgKCF0aGlzLl9wcmV2ZW50Q2FuY2VsKSB7XG4gICAgICBjb25zdCByZXN1bHQgPSBSZWFkYWJsZVN0cmVhbVJlYWRlckdlbmVyaWNDYW5jZWwocmVhZGVyLCB2YWx1ZSk7XG4gICAgICBSZWFkYWJsZVN0cmVhbVJlYWRlckdlbmVyaWNSZWxlYXNlKHJlYWRlcik7XG4gICAgICByZXR1cm4gdHJhbnNmb3JtUHJvbWlzZVdpdGgocmVzdWx0LCAoKSA9PiAoeyB2YWx1ZSwgZG9uZTogdHJ1ZSB9KSk7XG4gICAgfVxuXG4gICAgUmVhZGFibGVTdHJlYW1SZWFkZXJHZW5lcmljUmVsZWFzZShyZWFkZXIpO1xuICAgIHJldHVybiBwcm9taXNlUmVzb2x2ZWRXaXRoKHsgdmFsdWUsIGRvbmU6IHRydWUgfSk7XG4gIH1cbn1cblxuaW50ZXJmYWNlIFJlYWRhYmxlU3RyZWFtQXN5bmNJdGVyYXRvckluc3RhbmNlPFI+IGV4dGVuZHMgUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9yPFI+IHtcbiAgLyoqIEBpbnRlcmFsICovXG4gIF9hc3luY0l0ZXJhdG9ySW1wbDogUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9ySW1wbDxSPjtcblxuICBuZXh0KCk6IFByb21pc2U8SXRlcmF0b3JSZXN1bHQ8UiwgdW5kZWZpbmVkPj47XG5cbiAgcmV0dXJuKHZhbHVlPzogYW55KTogUHJvbWlzZTxJdGVyYXRvclJlc3VsdDxhbnk+Pjtcbn1cblxuY29uc3QgUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9yUHJvdG90eXBlOiBSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3JJbnN0YW5jZTxhbnk+ID0ge1xuICBuZXh0KHRoaXM6IFJlYWRhYmxlU3RyZWFtQXN5bmNJdGVyYXRvckluc3RhbmNlPGFueT4pOiBQcm9taXNlPFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRSZXN1bHQ8YW55Pj4ge1xuICAgIGlmICghSXNSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3IodGhpcykpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKHN0cmVhbUFzeW5jSXRlcmF0b3JCcmFuZENoZWNrRXhjZXB0aW9uKCduZXh0JykpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fYXN5bmNJdGVyYXRvckltcGwubmV4dCgpO1xuICB9LFxuXG4gIHJldHVybih0aGlzOiBSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3JJbnN0YW5jZTxhbnk+LCB2YWx1ZTogYW55KTogUHJvbWlzZTxSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkUmVzdWx0PGFueT4+IHtcbiAgICBpZiAoIUlzUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9yKHRoaXMpKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChzdHJlYW1Bc3luY0l0ZXJhdG9yQnJhbmRDaGVja0V4Y2VwdGlvbigncmV0dXJuJykpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fYXN5bmNJdGVyYXRvckltcGwucmV0dXJuKHZhbHVlKTtcbiAgfVxufSBhcyBhbnk7XG5PYmplY3Quc2V0UHJvdG90eXBlT2YoUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9yUHJvdG90eXBlLCBBc3luY0l0ZXJhdG9yUHJvdG90eXBlKTtcblxuLy8gQWJzdHJhY3Qgb3BlcmF0aW9ucyBmb3IgdGhlIFJlYWRhYmxlU3RyZWFtLlxuXG5leHBvcnQgZnVuY3Rpb24gQWNxdWlyZVJlYWRhYmxlU3RyZWFtQXN5bmNJdGVyYXRvcjxSPihzdHJlYW06IFJlYWRhYmxlU3RyZWFtPFI+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldmVudENhbmNlbDogYm9vbGVhbik6IFJlYWRhYmxlU3RyZWFtQXN5bmNJdGVyYXRvcjxSPiB7XG4gIGNvbnN0IHJlYWRlciA9IEFjcXVpcmVSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXI8Uj4oc3RyZWFtKTtcbiAgY29uc3QgaW1wbCA9IG5ldyBSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3JJbXBsKHJlYWRlciwgcHJldmVudENhbmNlbCk7XG4gIGNvbnN0IGl0ZXJhdG9yOiBSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3JJbnN0YW5jZTxSPiA9IE9iamVjdC5jcmVhdGUoUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9yUHJvdG90eXBlKTtcbiAgaXRlcmF0b3IuX2FzeW5jSXRlcmF0b3JJbXBsID0gaW1wbDtcbiAgcmV0dXJuIGl0ZXJhdG9yO1xufVxuXG5mdW5jdGlvbiBJc1JlYWRhYmxlU3RyZWFtQXN5bmNJdGVyYXRvcjxSID0gYW55Pih4OiBhbnkpOiB4IGlzIFJlYWRhYmxlU3RyZWFtQXN5bmNJdGVyYXRvcjxSPiB7XG4gIGlmICghdHlwZUlzT2JqZWN0KHgpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoeCwgJ19hc3luY0l0ZXJhdG9ySW1wbCcpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdHJ5IHtcbiAgICAvLyBub2luc3BlY3Rpb24gU3VzcGljaW91c1R5cGVPZkd1YXJkXG4gICAgcmV0dXJuICh4IGFzIFJlYWRhYmxlU3RyZWFtQXN5bmNJdGVyYXRvckluc3RhbmNlPGFueT4pLl9hc3luY0l0ZXJhdG9ySW1wbCBpbnN0YW5jZW9mXG4gICAgICBSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3JJbXBsO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuLy8gSGVscGVyIGZ1bmN0aW9ucyBmb3IgdGhlIFJlYWRhYmxlU3RyZWFtLlxuXG5mdW5jdGlvbiBzdHJlYW1Bc3luY0l0ZXJhdG9yQnJhbmRDaGVja0V4Y2VwdGlvbihuYW1lOiBzdHJpbmcpOiBUeXBlRXJyb3Ige1xuICByZXR1cm4gbmV3IFR5cGVFcnJvcihgUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9yLiR7bmFtZX0gY2FuIG9ubHkgYmUgdXNlZCBvbiBhIFJlYWRhYmxlU3RlYW1Bc3luY0l0ZXJhdG9yYCk7XG59XG4iLCAiLy8vIDxyZWZlcmVuY2UgbGliPVwiZXMyMDE1LmNvcmVcIiAvPlxuXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9OdW1iZXIvaXNOYU4jUG9seWZpbGxcbmNvbnN0IE51bWJlcklzTmFOOiB0eXBlb2YgTnVtYmVyLmlzTmFOID0gTnVtYmVyLmlzTmFOIHx8IGZ1bmN0aW9uICh4KSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmVcbiAgcmV0dXJuIHggIT09IHg7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBOdW1iZXJJc05hTjtcbiIsICJpbXBvcnQgeyByZWZsZWN0Q2FsbCB9IGZyb20gJ2xpYi9oZWxwZXJzL3dlYmlkbCc7XG5pbXBvcnQgeyB0eXBlSXNPYmplY3QgfSBmcm9tICcuLi9oZWxwZXJzL21pc2NlbGxhbmVvdXMnO1xuaW1wb3J0IGFzc2VydCBmcm9tICcuLi8uLi9zdHViL2Fzc2VydCc7XG5cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgaW50ZXJmYWNlIEFycmF5QnVmZmVyIHtcbiAgICByZWFkb25seSBkZXRhY2hlZDogYm9vbGVhbjtcblxuICAgIHRyYW5zZmVyKCk6IEFycmF5QnVmZmVyO1xuICB9XG5cbiAgZnVuY3Rpb24gc3RydWN0dXJlZENsb25lPFQ+KHZhbHVlOiBULCBvcHRpb25zOiB7IHRyYW5zZmVyOiBBcnJheUJ1ZmZlcltdIH0pOiBUO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQ3JlYXRlQXJyYXlGcm9tTGlzdDxUIGV4dGVuZHMgYW55W10+KGVsZW1lbnRzOiBUKTogVCB7XG4gIC8vIFdlIHVzZSBhcnJheXMgdG8gcmVwcmVzZW50IGxpc3RzLCBzbyB0aGlzIGlzIGJhc2ljYWxseSBhIG5vLW9wLlxuICAvLyBEbyBhIHNsaWNlIHRob3VnaCBqdXN0IGluIGNhc2Ugd2UgaGFwcGVuIHRvIGRlcGVuZCBvbiB0aGUgdW5pcXVlLW5lc3MuXG4gIHJldHVybiBlbGVtZW50cy5zbGljZSgpIGFzIFQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBDb3B5RGF0YUJsb2NrQnl0ZXMoZGVzdDogQXJyYXlCdWZmZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc3RPZmZzZXQ6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3JjOiBBcnJheUJ1ZmZlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3JjT2Zmc2V0OiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG46IG51bWJlcikge1xuICBuZXcgVWludDhBcnJheShkZXN0KS5zZXQobmV3IFVpbnQ4QXJyYXkoc3JjLCBzcmNPZmZzZXQsIG4pLCBkZXN0T2Zmc2V0KTtcbn1cblxuZXhwb3J0IGxldCBUcmFuc2ZlckFycmF5QnVmZmVyID0gKE86IEFycmF5QnVmZmVyKTogQXJyYXlCdWZmZXIgPT4ge1xuICBpZiAodHlwZW9mIE8udHJhbnNmZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICBUcmFuc2ZlckFycmF5QnVmZmVyID0gYnVmZmVyID0+IGJ1ZmZlci50cmFuc2ZlcigpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBzdHJ1Y3R1cmVkQ2xvbmUgPT09ICdmdW5jdGlvbicpIHtcbiAgICBUcmFuc2ZlckFycmF5QnVmZmVyID0gYnVmZmVyID0+IHN0cnVjdHVyZWRDbG9uZShidWZmZXIsIHsgdHJhbnNmZXI6IFtidWZmZXJdIH0pO1xuICB9IGVsc2Uge1xuICAgIC8vIE5vdCBpbXBsZW1lbnRlZCBjb3JyZWN0bHlcbiAgICBUcmFuc2ZlckFycmF5QnVmZmVyID0gYnVmZmVyID0+IGJ1ZmZlcjtcbiAgfVxuICByZXR1cm4gVHJhbnNmZXJBcnJheUJ1ZmZlcihPKTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBDYW5UcmFuc2ZlckFycmF5QnVmZmVyKE86IEFycmF5QnVmZmVyKTogYm9vbGVhbiB7XG4gIHJldHVybiAhSXNEZXRhY2hlZEJ1ZmZlcihPKTtcbn1cblxuZXhwb3J0IGxldCBJc0RldGFjaGVkQnVmZmVyID0gKE86IEFycmF5QnVmZmVyKTogYm9vbGVhbiA9PiB7XG4gIGlmICh0eXBlb2YgTy5kZXRhY2hlZCA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgSXNEZXRhY2hlZEJ1ZmZlciA9IGJ1ZmZlciA9PiBidWZmZXIuZGV0YWNoZWQ7XG4gIH0gZWxzZSB7XG4gICAgLy8gTm90IGltcGxlbWVudGVkIGNvcnJlY3RseVxuICAgIElzRGV0YWNoZWRCdWZmZXIgPSBidWZmZXIgPT4gYnVmZmVyLmJ5dGVMZW5ndGggPT09IDA7XG4gIH1cbiAgcmV0dXJuIElzRGV0YWNoZWRCdWZmZXIoTyk7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gQXJyYXlCdWZmZXJTbGljZShidWZmZXI6IEFycmF5QnVmZmVyLCBiZWdpbjogbnVtYmVyLCBlbmQ6IG51bWJlcik6IEFycmF5QnVmZmVyIHtcbiAgLy8gQXJyYXlCdWZmZXIucHJvdG90eXBlLnNsaWNlIGlzIG5vdCBhdmFpbGFibGUgb24gSUUxMFxuICAvLyBodHRwczovL3d3dy5jYW5pdXNlLmNvbS9tZG4tamF2YXNjcmlwdF9idWlsdGluc19hcnJheWJ1ZmZlcl9zbGljZVxuICBpZiAoYnVmZmVyLnNsaWNlKSB7XG4gICAgcmV0dXJuIGJ1ZmZlci5zbGljZShiZWdpbiwgZW5kKTtcbiAgfVxuICBjb25zdCBsZW5ndGggPSBlbmQgLSBiZWdpbjtcbiAgY29uc3Qgc2xpY2UgPSBuZXcgQXJyYXlCdWZmZXIobGVuZ3RoKTtcbiAgQ29weURhdGFCbG9ja0J5dGVzKHNsaWNlLCAwLCBidWZmZXIsIGJlZ2luLCBsZW5ndGgpO1xuICByZXR1cm4gc2xpY2U7XG59XG5cbmV4cG9ydCB0eXBlIE1ldGhvZE5hbWU8VD4gPSB7XG4gIFtQIGluIGtleW9mIFRdOiBUW1BdIGV4dGVuZHMgRnVuY3Rpb24gfCB1bmRlZmluZWQgPyBQIDogbmV2ZXI7XG59W2tleW9mIFRdO1xuXG5leHBvcnQgZnVuY3Rpb24gR2V0TWV0aG9kPFQsIEsgZXh0ZW5kcyBNZXRob2ROYW1lPFQ+PihyZWNlaXZlcjogVCwgcHJvcDogSyk6IFRbS10gfCB1bmRlZmluZWQge1xuICBjb25zdCBmdW5jID0gcmVjZWl2ZXJbcHJvcF07XG4gIGlmIChmdW5jID09PSB1bmRlZmluZWQgfHwgZnVuYyA9PT0gbnVsbCkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBmdW5jICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgJHtTdHJpbmcocHJvcCl9IGlzIG5vdCBhIGZ1bmN0aW9uYCk7XG4gIH1cbiAgcmV0dXJuIGZ1bmM7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3luY0l0ZXJhdG9yUmVjb3JkPFQ+IHtcbiAgaXRlcmF0b3I6IEl0ZXJhdG9yPFQ+LFxuICBuZXh0TWV0aG9kOiBJdGVyYXRvcjxUPlsnbmV4dCddLFxuICBkb25lOiBib29sZWFuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFzeW5jSXRlcmF0b3JSZWNvcmQ8VD4ge1xuICBpdGVyYXRvcjogQXN5bmNJdGVyYXRvcjxUPixcbiAgbmV4dE1ldGhvZDogQXN5bmNJdGVyYXRvcjxUPlsnbmV4dCddLFxuICBkb25lOiBib29sZWFuO1xufVxuXG5leHBvcnQgdHlwZSBTeW5jT3JBc3luY0l0ZXJhdG9yUmVjb3JkPFQ+ID0gU3luY0l0ZXJhdG9yUmVjb3JkPFQ+IHwgQXN5bmNJdGVyYXRvclJlY29yZDxUPjtcblxuZXhwb3J0IGZ1bmN0aW9uIENyZWF0ZUFzeW5jRnJvbVN5bmNJdGVyYXRvcjxUPihzeW5jSXRlcmF0b3JSZWNvcmQ6IFN5bmNJdGVyYXRvclJlY29yZDxUPik6IEFzeW5jSXRlcmF0b3JSZWNvcmQ8VD4ge1xuICAvLyBJbnN0ZWFkIG9mIHJlLWltcGxlbWVudGluZyBDcmVhdGVBc3luY0Zyb21TeW5jSXRlcmF0b3IgYW5kICVBc3luY0Zyb21TeW5jSXRlcmF0b3JQcm90b3R5cGUlLFxuICAvLyB3ZSB1c2UgeWllbGQqIGluc2lkZSBhbiBhc3luYyBnZW5lcmF0b3IgZnVuY3Rpb24gdG8gYWNoaWV2ZSB0aGUgc2FtZSByZXN1bHQuXG5cbiAgLy8gV3JhcCB0aGUgc3luYyBpdGVyYXRvciBpbnNpZGUgYSBzeW5jIGl0ZXJhYmxlLCBzbyB3ZSBjYW4gdXNlIGl0IHdpdGggeWllbGQqLlxuICBjb25zdCBzeW5jSXRlcmFibGUgPSB7XG4gICAgW1N5bWJvbC5pdGVyYXRvcl06ICgpID0+IHN5bmNJdGVyYXRvclJlY29yZC5pdGVyYXRvclxuICB9O1xuICAvLyBDcmVhdGUgYW4gYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIGFuZCBpbW1lZGlhdGVseSBpbnZva2UgaXQuXG4gIGNvbnN0IGFzeW5jSXRlcmF0b3IgPSAoYXN5bmMgZnVuY3Rpb24qICgpIHtcbiAgICByZXR1cm4geWllbGQqIHN5bmNJdGVyYWJsZTtcbiAgfSgpKTtcbiAgLy8gUmV0dXJuIGFzIGFuIGFzeW5jIGl0ZXJhdG9yIHJlY29yZC5cbiAgY29uc3QgbmV4dE1ldGhvZCA9IGFzeW5jSXRlcmF0b3IubmV4dDtcbiAgcmV0dXJuIHsgaXRlcmF0b3I6IGFzeW5jSXRlcmF0b3IsIG5leHRNZXRob2QsIGRvbmU6IGZhbHNlIH07XG59XG5cbi8vIEFsaWducyB3aXRoIGNvcmUtanMvbW9kdWxlcy9lcy5zeW1ib2wuYXN5bmMtaXRlcmF0b3IuanNcbmV4cG9ydCBjb25zdCBTeW1ib2xBc3luY0l0ZXJhdG9yOiAodHlwZW9mIFN5bWJvbClbJ2FzeW5jSXRlcmF0b3InXSA9XG4gIFN5bWJvbC5hc3luY0l0ZXJhdG9yID8/XG4gIFN5bWJvbC5mb3I/LignU3ltYm9sLmFzeW5jSXRlcmF0b3InKSA/P1xuICAnQEBhc3luY0l0ZXJhdG9yJztcblxuZXhwb3J0IHR5cGUgU3luY09yQXN5bmNJdGVyYWJsZTxUPiA9IEl0ZXJhYmxlPFQ+IHwgQXN5bmNJdGVyYWJsZTxUPjtcbmV4cG9ydCB0eXBlIFN5bmNPckFzeW5jSXRlcmF0b3JNZXRob2Q8VD4gPSAoKSA9PiAoSXRlcmF0b3I8VD4gfCBBc3luY0l0ZXJhdG9yPFQ+KTtcblxuZnVuY3Rpb24gR2V0SXRlcmF0b3I8VD4oXG4gIG9iajogU3luY09yQXN5bmNJdGVyYWJsZTxUPixcbiAgaGludDogJ2FzeW5jJyxcbiAgbWV0aG9kPzogU3luY09yQXN5bmNJdGVyYXRvck1ldGhvZDxUPlxuKTogQXN5bmNJdGVyYXRvclJlY29yZDxUPjtcbmZ1bmN0aW9uIEdldEl0ZXJhdG9yPFQ+KFxuICBvYmo6IEl0ZXJhYmxlPFQ+LFxuICBoaW50OiAnc3luYycsXG4gIG1ldGhvZD86IFN5bmNPckFzeW5jSXRlcmF0b3JNZXRob2Q8VD5cbik6IFN5bmNJdGVyYXRvclJlY29yZDxUPjtcbmZ1bmN0aW9uIEdldEl0ZXJhdG9yPFQ+KFxuICBvYmo6IFN5bmNPckFzeW5jSXRlcmFibGU8VD4sXG4gIGhpbnQgPSAnc3luYycsXG4gIG1ldGhvZD86IFN5bmNPckFzeW5jSXRlcmF0b3JNZXRob2Q8VD5cbik6IFN5bmNPckFzeW5jSXRlcmF0b3JSZWNvcmQ8VD4ge1xuICBhc3NlcnQoaGludCA9PT0gJ3N5bmMnIHx8IGhpbnQgPT09ICdhc3luYycpO1xuICBpZiAobWV0aG9kID09PSB1bmRlZmluZWQpIHtcbiAgICBpZiAoaGludCA9PT0gJ2FzeW5jJykge1xuICAgICAgbWV0aG9kID0gR2V0TWV0aG9kKG9iaiBhcyBBc3luY0l0ZXJhYmxlPFQ+LCBTeW1ib2xBc3luY0l0ZXJhdG9yKTtcbiAgICAgIGlmIChtZXRob2QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb25zdCBzeW5jTWV0aG9kID0gR2V0TWV0aG9kKG9iaiBhcyBJdGVyYWJsZTxUPiwgU3ltYm9sLml0ZXJhdG9yKTtcbiAgICAgICAgY29uc3Qgc3luY0l0ZXJhdG9yUmVjb3JkID0gR2V0SXRlcmF0b3Iob2JqIGFzIEl0ZXJhYmxlPFQ+LCAnc3luYycsIHN5bmNNZXRob2QpO1xuICAgICAgICByZXR1cm4gQ3JlYXRlQXN5bmNGcm9tU3luY0l0ZXJhdG9yKHN5bmNJdGVyYXRvclJlY29yZCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG1ldGhvZCA9IEdldE1ldGhvZChvYmogYXMgSXRlcmFibGU8VD4sIFN5bWJvbC5pdGVyYXRvcik7XG4gICAgfVxuICB9XG4gIGlmIChtZXRob2QgPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBvYmplY3QgaXMgbm90IGl0ZXJhYmxlJyk7XG4gIH1cbiAgY29uc3QgaXRlcmF0b3IgPSByZWZsZWN0Q2FsbChtZXRob2QsIG9iaiwgW10pO1xuICBpZiAoIXR5cGVJc09iamVjdChpdGVyYXRvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgaXRlcmF0b3IgbWV0aG9kIG11c3QgcmV0dXJuIGFuIG9iamVjdCcpO1xuICB9XG4gIGNvbnN0IG5leHRNZXRob2QgPSBpdGVyYXRvci5uZXh0O1xuICByZXR1cm4geyBpdGVyYXRvciwgbmV4dE1ldGhvZCwgZG9uZTogZmFsc2UgfSBhcyBTeW5jT3JBc3luY0l0ZXJhdG9yUmVjb3JkPFQ+O1xufVxuXG5leHBvcnQgeyBHZXRJdGVyYXRvciB9O1xuXG5leHBvcnQgZnVuY3Rpb24gSXRlcmF0b3JOZXh0PFQ+KGl0ZXJhdG9yUmVjb3JkOiBBc3luY0l0ZXJhdG9yUmVjb3JkPFQ+KTogUHJvbWlzZTxJdGVyYXRvclJlc3VsdDxUPj4ge1xuICBjb25zdCByZXN1bHQgPSByZWZsZWN0Q2FsbChpdGVyYXRvclJlY29yZC5uZXh0TWV0aG9kLCBpdGVyYXRvclJlY29yZC5pdGVyYXRvciwgW10pO1xuICBpZiAoIXR5cGVJc09iamVjdChyZXN1bHQpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIGl0ZXJhdG9yLm5leHQoKSBtZXRob2QgbXVzdCByZXR1cm4gYW4gb2JqZWN0Jyk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEl0ZXJhdG9yQ29tcGxldGU8VFJldHVybj4oXG4gIGl0ZXJSZXN1bHQ6IEl0ZXJhdG9yUmVzdWx0PHVua25vd24sIFRSZXR1cm4+XG4pOiBpdGVyUmVzdWx0IGlzIEl0ZXJhdG9yUmV0dXJuUmVzdWx0PFRSZXR1cm4+IHtcbiAgYXNzZXJ0KHR5cGVJc09iamVjdChpdGVyUmVzdWx0KSk7XG4gIHJldHVybiBCb29sZWFuKGl0ZXJSZXN1bHQuZG9uZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBJdGVyYXRvclZhbHVlPFQ+KGl0ZXJSZXN1bHQ6IEl0ZXJhdG9yWWllbGRSZXN1bHQ8VD4pOiBUIHtcbiAgYXNzZXJ0KHR5cGVJc09iamVjdChpdGVyUmVzdWx0KSk7XG4gIHJldHVybiBpdGVyUmVzdWx0LnZhbHVlO1xufVxuIiwgImltcG9ydCBOdW1iZXJJc05hTiBmcm9tICcuLi8uLi9zdHViL251bWJlci1pc25hbic7XG5pbXBvcnQgeyBBcnJheUJ1ZmZlclNsaWNlIH0gZnJvbSAnLi9lY21hc2NyaXB0JztcbmltcG9ydCB0eXBlIHsgTm9uU2hhcmVkIH0gZnJvbSAnLi4vaGVscGVycy9hcnJheS1idWZmZXItdmlldyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBJc05vbk5lZ2F0aXZlTnVtYmVyKHY6IG51bWJlcik6IGJvb2xlYW4ge1xuICBpZiAodHlwZW9mIHYgIT09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKE51bWJlcklzTmFOKHYpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKHYgPCAwKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBDbG9uZUFzVWludDhBcnJheShPOiBOb25TaGFyZWQ8QXJyYXlCdWZmZXJWaWV3Pik6IE5vblNoYXJlZDxVaW50OEFycmF5PiB7XG4gIGNvbnN0IGJ1ZmZlciA9IEFycmF5QnVmZmVyU2xpY2UoTy5idWZmZXIsIE8uYnl0ZU9mZnNldCwgTy5ieXRlT2Zmc2V0ICsgTy5ieXRlTGVuZ3RoKTtcbiAgcmV0dXJuIG5ldyBVaW50OEFycmF5KGJ1ZmZlcikgYXMgTm9uU2hhcmVkPFVpbnQ4QXJyYXk+O1xufVxuIiwgImltcG9ydCBhc3NlcnQgZnJvbSAnLi4vLi4vc3R1Yi9hc3NlcnQnO1xuaW1wb3J0IHsgU2ltcGxlUXVldWUgfSBmcm9tICcuLi9zaW1wbGUtcXVldWUnO1xuaW1wb3J0IHsgSXNOb25OZWdhdGl2ZU51bWJlciB9IGZyb20gJy4vbWlzY2VsbGFuZW91cyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUXVldWVDb250YWluZXI8VD4ge1xuICBfcXVldWU6IFNpbXBsZVF1ZXVlPFQ+O1xuICBfcXVldWVUb3RhbFNpemU6IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBRdWV1ZVBhaXI8VD4ge1xuICB2YWx1ZTogVDtcbiAgc2l6ZTogbnVtYmVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gRGVxdWV1ZVZhbHVlPFQ+KGNvbnRhaW5lcjogUXVldWVDb250YWluZXI8UXVldWVQYWlyPFQ+Pik6IFQge1xuICBhc3NlcnQoJ19xdWV1ZScgaW4gY29udGFpbmVyICYmICdfcXVldWVUb3RhbFNpemUnIGluIGNvbnRhaW5lcik7XG4gIGFzc2VydChjb250YWluZXIuX3F1ZXVlLmxlbmd0aCA+IDApO1xuXG4gIGNvbnN0IHBhaXIgPSBjb250YWluZXIuX3F1ZXVlLnNoaWZ0KCkhO1xuICBjb250YWluZXIuX3F1ZXVlVG90YWxTaXplIC09IHBhaXIuc2l6ZTtcbiAgaWYgKGNvbnRhaW5lci5fcXVldWVUb3RhbFNpemUgPCAwKSB7XG4gICAgY29udGFpbmVyLl9xdWV1ZVRvdGFsU2l6ZSA9IDA7XG4gIH1cblxuICByZXR1cm4gcGFpci52YWx1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEVucXVldWVWYWx1ZVdpdGhTaXplPFQ+KGNvbnRhaW5lcjogUXVldWVDb250YWluZXI8UXVldWVQYWlyPFQ+PiwgdmFsdWU6IFQsIHNpemU6IG51bWJlcikge1xuICBhc3NlcnQoJ19xdWV1ZScgaW4gY29udGFpbmVyICYmICdfcXVldWVUb3RhbFNpemUnIGluIGNvbnRhaW5lcik7XG5cbiAgaWYgKCFJc05vbk5lZ2F0aXZlTnVtYmVyKHNpemUpIHx8IHNpemUgPT09IEluZmluaXR5KSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1NpemUgbXVzdCBiZSBhIGZpbml0ZSwgbm9uLU5hTiwgbm9uLW5lZ2F0aXZlIG51bWJlci4nKTtcbiAgfVxuXG4gIGNvbnRhaW5lci5fcXVldWUucHVzaCh7IHZhbHVlLCBzaXplIH0pO1xuICBjb250YWluZXIuX3F1ZXVlVG90YWxTaXplICs9IHNpemU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBQZWVrUXVldWVWYWx1ZTxUPihjb250YWluZXI6IFF1ZXVlQ29udGFpbmVyPFF1ZXVlUGFpcjxUPj4pOiBUIHtcbiAgYXNzZXJ0KCdfcXVldWUnIGluIGNvbnRhaW5lciAmJiAnX3F1ZXVlVG90YWxTaXplJyBpbiBjb250YWluZXIpO1xuICBhc3NlcnQoY29udGFpbmVyLl9xdWV1ZS5sZW5ndGggPiAwKTtcblxuICBjb25zdCBwYWlyID0gY29udGFpbmVyLl9xdWV1ZS5wZWVrKCk7XG4gIHJldHVybiBwYWlyLnZhbHVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVzZXRRdWV1ZTxUPihjb250YWluZXI6IFF1ZXVlQ29udGFpbmVyPFQ+KSB7XG4gIGFzc2VydCgnX3F1ZXVlJyBpbiBjb250YWluZXIgJiYgJ19xdWV1ZVRvdGFsU2l6ZScgaW4gY29udGFpbmVyKTtcblxuICBjb250YWluZXIuX3F1ZXVlID0gbmV3IFNpbXBsZVF1ZXVlPFQ+KCk7XG4gIGNvbnRhaW5lci5fcXVldWVUb3RhbFNpemUgPSAwO1xufVxuIiwgImV4cG9ydCB0eXBlIFR5cGVkQXJyYXkgPVxuICB8IEludDhBcnJheVxuICB8IFVpbnQ4QXJyYXlcbiAgfCBVaW50OENsYW1wZWRBcnJheVxuICB8IEludDE2QXJyYXlcbiAgfCBVaW50MTZBcnJheVxuICB8IEludDMyQXJyYXlcbiAgfCBVaW50MzJBcnJheVxuICB8IEZsb2F0MzJBcnJheVxuICB8IEZsb2F0NjRBcnJheTtcblxuZXhwb3J0IHR5cGUgTm9uU2hhcmVkPFQgZXh0ZW5kcyBBcnJheUJ1ZmZlclZpZXc+ID0gVCAmIHtcbiAgYnVmZmVyOiBBcnJheUJ1ZmZlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBcnJheUJ1ZmZlclZpZXdDb25zdHJ1Y3RvcjxUIGV4dGVuZHMgQXJyYXlCdWZmZXJWaWV3ID0gQXJyYXlCdWZmZXJWaWV3PiB7XG4gIG5ldyhidWZmZXI6IEFycmF5QnVmZmVyLCBieXRlT2Zmc2V0OiBudW1iZXIsIGxlbmd0aD86IG51bWJlcik6IFQ7XG5cbiAgcmVhZG9ubHkgcHJvdG90eXBlOiBUO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFR5cGVkQXJyYXlDb25zdHJ1Y3RvcjxUIGV4dGVuZHMgVHlwZWRBcnJheSA9IFR5cGVkQXJyYXk+IGV4dGVuZHMgQXJyYXlCdWZmZXJWaWV3Q29uc3RydWN0b3I8VD4ge1xuICByZWFkb25seSBCWVRFU19QRVJfRUxFTUVOVDogbnVtYmVyO1xufVxuXG5leHBvcnQgdHlwZSBEYXRhVmlld0NvbnN0cnVjdG9yID0gQXJyYXlCdWZmZXJWaWV3Q29uc3RydWN0b3I8RGF0YVZpZXc+O1xuXG5mdW5jdGlvbiBpc0RhdGFWaWV3Q29uc3RydWN0b3IoY3RvcjogRnVuY3Rpb24pOiBjdG9yIGlzIERhdGFWaWV3Q29uc3RydWN0b3Ige1xuICByZXR1cm4gY3RvciA9PT0gRGF0YVZpZXc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RhdGFWaWV3KHZpZXc6IEFycmF5QnVmZmVyVmlldyk6IHZpZXcgaXMgRGF0YVZpZXcge1xuICByZXR1cm4gaXNEYXRhVmlld0NvbnN0cnVjdG9yKHZpZXcuY29uc3RydWN0b3IpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXJyYXlCdWZmZXJWaWV3RWxlbWVudFNpemU8VCBleHRlbmRzIEFycmF5QnVmZmVyVmlldz4oY3RvcjogQXJyYXlCdWZmZXJWaWV3Q29uc3RydWN0b3I8VD4pOiBudW1iZXIge1xuICBpZiAoaXNEYXRhVmlld0NvbnN0cnVjdG9yKGN0b3IpKSB7XG4gICAgcmV0dXJuIDE7XG4gIH1cbiAgcmV0dXJuIChjdG9yIGFzIHVua25vd24gYXMgVHlwZWRBcnJheUNvbnN0cnVjdG9yKS5CWVRFU19QRVJfRUxFTUVOVDtcbn1cbiIsICJpbXBvcnQgYXNzZXJ0IGZyb20gJy4uLy4uL3N0dWIvYXNzZXJ0JztcbmltcG9ydCB7IFNpbXBsZVF1ZXVlIH0gZnJvbSAnLi4vc2ltcGxlLXF1ZXVlJztcbmltcG9ydCB7IFJlc2V0UXVldWUgfSBmcm9tICcuLi9hYnN0cmFjdC1vcHMvcXVldWUtd2l0aC1zaXplcyc7XG5pbXBvcnQge1xuICBJc1JlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcixcbiAgUmVhZGFibGVTdHJlYW1BZGRSZWFkUmVxdWVzdCxcbiAgUmVhZGFibGVTdHJlYW1GdWxmaWxsUmVhZFJlcXVlc3QsXG4gIFJlYWRhYmxlU3RyZWFtR2V0TnVtUmVhZFJlcXVlc3RzLFxuICBSZWFkYWJsZVN0cmVhbUhhc0RlZmF1bHRSZWFkZXIsXG4gIHR5cGUgUmVhZFJlcXVlc3Rcbn0gZnJvbSAnLi9kZWZhdWx0LXJlYWRlcic7XG5pbXBvcnQge1xuICBSZWFkYWJsZVN0cmVhbUFkZFJlYWRJbnRvUmVxdWVzdCxcbiAgUmVhZGFibGVTdHJlYW1GdWxmaWxsUmVhZEludG9SZXF1ZXN0LFxuICBSZWFkYWJsZVN0cmVhbUdldE51bVJlYWRJbnRvUmVxdWVzdHMsXG4gIFJlYWRhYmxlU3RyZWFtSGFzQllPQlJlYWRlcixcbiAgdHlwZSBSZWFkSW50b1JlcXVlc3Rcbn0gZnJvbSAnLi9ieW9iLXJlYWRlcic7XG5pbXBvcnQgTnVtYmVySXNJbnRlZ2VyIGZyb20gJy4uLy4uL3N0dWIvbnVtYmVyLWlzaW50ZWdlcic7XG5pbXBvcnQge1xuICBJc1JlYWRhYmxlU3RyZWFtTG9ja2VkLFxuICB0eXBlIFJlYWRhYmxlQnl0ZVN0cmVhbSxcbiAgUmVhZGFibGVTdHJlYW1DbG9zZSxcbiAgUmVhZGFibGVTdHJlYW1FcnJvclxufSBmcm9tICcuLi9yZWFkYWJsZS1zdHJlYW0nO1xuaW1wb3J0IHR5cGUgeyBWYWxpZGF0ZWRVbmRlcmx5aW5nQnl0ZVNvdXJjZSB9IGZyb20gJy4vdW5kZXJseWluZy1zb3VyY2UnO1xuaW1wb3J0IHsgc2V0RnVuY3Rpb25OYW1lLCB0eXBlSXNPYmplY3QgfSBmcm9tICcuLi9oZWxwZXJzL21pc2NlbGxhbmVvdXMnO1xuaW1wb3J0IHtcbiAgQXJyYXlCdWZmZXJTbGljZSxcbiAgQ2FuVHJhbnNmZXJBcnJheUJ1ZmZlcixcbiAgQ29weURhdGFCbG9ja0J5dGVzLFxuICBJc0RldGFjaGVkQnVmZmVyLFxuICBUcmFuc2ZlckFycmF5QnVmZmVyXG59IGZyb20gJy4uL2Fic3RyYWN0LW9wcy9lY21hc2NyaXB0JztcbmltcG9ydCB7IENhbmNlbFN0ZXBzLCBQdWxsU3RlcHMsIFJlbGVhc2VTdGVwcyB9IGZyb20gJy4uL2Fic3RyYWN0LW9wcy9pbnRlcm5hbC1tZXRob2RzJztcbmltcG9ydCB7IHByb21pc2VSZXNvbHZlZFdpdGgsIHVwb25Qcm9taXNlIH0gZnJvbSAnLi4vaGVscGVycy93ZWJpZGwnO1xuaW1wb3J0IHsgYXNzZXJ0UmVxdWlyZWRBcmd1bWVudCwgY29udmVydFVuc2lnbmVkTG9uZ0xvbmdXaXRoRW5mb3JjZVJhbmdlIH0gZnJvbSAnLi4vdmFsaWRhdG9ycy9iYXNpYyc7XG5pbXBvcnQge1xuICB0eXBlIEFycmF5QnVmZmVyVmlld0NvbnN0cnVjdG9yLFxuICBhcnJheUJ1ZmZlclZpZXdFbGVtZW50U2l6ZSxcbiAgdHlwZSBOb25TaGFyZWQsXG4gIHR5cGUgVHlwZWRBcnJheUNvbnN0cnVjdG9yXG59IGZyb20gJy4uL2hlbHBlcnMvYXJyYXktYnVmZmVyLXZpZXcnO1xuXG4vKipcbiAqIEEgcHVsbC1pbnRvIHJlcXVlc3QgaW4gYSB7QGxpbmsgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcn0uXG4gKlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY2xhc3MgUmVhZGFibGVTdHJlYW1CWU9CUmVxdWVzdCB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2Fzc29jaWF0ZWRSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyITogUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfdmlldyE6IE5vblNoYXJlZDxBcnJheUJ1ZmZlclZpZXc+IHwgbnVsbDtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0lsbGVnYWwgY29uc3RydWN0b3InKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB2aWV3IGZvciB3cml0aW5nIGluIHRvLCBvciBgbnVsbGAgaWYgdGhlIEJZT0IgcmVxdWVzdCBoYXMgYWxyZWFkeSBiZWVuIHJlc3BvbmRlZCB0by5cbiAgICovXG4gIGdldCB2aWV3KCk6IEFycmF5QnVmZmVyVmlldyB8IG51bGwge1xuICAgIGlmICghSXNSZWFkYWJsZVN0cmVhbUJZT0JSZXF1ZXN0KHRoaXMpKSB7XG4gICAgICB0aHJvdyBieW9iUmVxdWVzdEJyYW5kQ2hlY2tFeGNlcHRpb24oJ3ZpZXcnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fdmlldztcbiAgfVxuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgdG8gdGhlIGFzc29jaWF0ZWQgcmVhZGFibGUgYnl0ZSBzdHJlYW0gdGhhdCBgYnl0ZXNXcml0dGVuYCBieXRlcyB3ZXJlIHdyaXR0ZW4gaW50b1xuICAgKiB7QGxpbmsgUmVhZGFibGVTdHJlYW1CWU9CUmVxdWVzdC52aWV3IHwgdmlld30sIGNhdXNpbmcgdGhlIHJlc3VsdCBiZSBzdXJmYWNlZCB0byB0aGUgY29uc3VtZXIuXG4gICAqXG4gICAqIEFmdGVyIHRoaXMgbWV0aG9kIGlzIGNhbGxlZCwge0BsaW5rIFJlYWRhYmxlU3RyZWFtQllPQlJlcXVlc3QudmlldyB8IHZpZXd9IHdpbGwgYmUgdHJhbnNmZXJyZWQgYW5kIG5vIGxvbmdlclxuICAgKiBtb2RpZmlhYmxlLlxuICAgKi9cbiAgcmVzcG9uZChieXRlc1dyaXR0ZW46IG51bWJlcik6IHZvaWQ7XG4gIHJlc3BvbmQoYnl0ZXNXcml0dGVuOiBudW1iZXIgfCB1bmRlZmluZWQpOiB2b2lkIHtcbiAgICBpZiAoIUlzUmVhZGFibGVTdHJlYW1CWU9CUmVxdWVzdCh0aGlzKSkge1xuICAgICAgdGhyb3cgYnlvYlJlcXVlc3RCcmFuZENoZWNrRXhjZXB0aW9uKCdyZXNwb25kJyk7XG4gICAgfVxuICAgIGFzc2VydFJlcXVpcmVkQXJndW1lbnQoYnl0ZXNXcml0dGVuLCAxLCAncmVzcG9uZCcpO1xuICAgIGJ5dGVzV3JpdHRlbiA9IGNvbnZlcnRVbnNpZ25lZExvbmdMb25nV2l0aEVuZm9yY2VSYW5nZShieXRlc1dyaXR0ZW4sICdGaXJzdCBwYXJhbWV0ZXInKTtcblxuICAgIGlmICh0aGlzLl9hc3NvY2lhdGVkUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGlzIEJZT0IgcmVxdWVzdCBoYXMgYmVlbiBpbnZhbGlkYXRlZCcpO1xuICAgIH1cblxuICAgIGlmIChJc0RldGFjaGVkQnVmZmVyKHRoaXMuX3ZpZXchLmJ1ZmZlcikpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYFRoZSBCWU9CIHJlcXVlc3QncyBidWZmZXIgaGFzIGJlZW4gZGV0YWNoZWQgYW5kIHNvIGNhbm5vdCBiZSB1c2VkIGFzIGEgcmVzcG9uc2VgKTtcbiAgICB9XG5cbiAgICBhc3NlcnQodGhpcy5fdmlldyEuYnl0ZUxlbmd0aCA+IDApO1xuICAgIGFzc2VydCh0aGlzLl92aWV3IS5idWZmZXIuYnl0ZUxlbmd0aCA+IDApO1xuXG4gICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclJlc3BvbmQodGhpcy5fYXNzb2NpYXRlZFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIsIGJ5dGVzV3JpdHRlbik7XG4gIH1cblxuICAvKipcbiAgICogSW5kaWNhdGVzIHRvIHRoZSBhc3NvY2lhdGVkIHJlYWRhYmxlIGJ5dGUgc3RyZWFtIHRoYXQgaW5zdGVhZCBvZiB3cml0aW5nIGludG9cbiAgICoge0BsaW5rIFJlYWRhYmxlU3RyZWFtQllPQlJlcXVlc3QudmlldyB8IHZpZXd9LCB0aGUgdW5kZXJseWluZyBieXRlIHNvdXJjZSBpcyBwcm92aWRpbmcgYSBuZXcgYEFycmF5QnVmZmVyVmlld2AsXG4gICAqIHdoaWNoIHdpbGwgYmUgZ2l2ZW4gdG8gdGhlIGNvbnN1bWVyIG9mIHRoZSByZWFkYWJsZSBieXRlIHN0cmVhbS5cbiAgICpcbiAgICogQWZ0ZXIgdGhpcyBtZXRob2QgaXMgY2FsbGVkLCBgdmlld2Agd2lsbCBiZSB0cmFuc2ZlcnJlZCBhbmQgbm8gbG9uZ2VyIG1vZGlmaWFibGUuXG4gICAqL1xuICByZXNwb25kV2l0aE5ld1ZpZXcodmlldzogQXJyYXlCdWZmZXJWaWV3KTogdm9pZDtcbiAgcmVzcG9uZFdpdGhOZXdWaWV3KHZpZXc6IE5vblNoYXJlZDxBcnJheUJ1ZmZlclZpZXc+KTogdm9pZCB7XG4gICAgaWYgKCFJc1JlYWRhYmxlU3RyZWFtQllPQlJlcXVlc3QodGhpcykpIHtcbiAgICAgIHRocm93IGJ5b2JSZXF1ZXN0QnJhbmRDaGVja0V4Y2VwdGlvbigncmVzcG9uZFdpdGhOZXdWaWV3Jyk7XG4gICAgfVxuICAgIGFzc2VydFJlcXVpcmVkQXJndW1lbnQodmlldywgMSwgJ3Jlc3BvbmRXaXRoTmV3VmlldycpO1xuXG4gICAgaWYgKCFBcnJheUJ1ZmZlci5pc1ZpZXcodmlldykpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1lvdSBjYW4gb25seSByZXNwb25kIHdpdGggYXJyYXkgYnVmZmVyIHZpZXdzJyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2Fzc29jaWF0ZWRSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoaXMgQllPQiByZXF1ZXN0IGhhcyBiZWVuIGludmFsaWRhdGVkJyk7XG4gICAgfVxuXG4gICAgaWYgKElzRGV0YWNoZWRCdWZmZXIodmlldy5idWZmZXIpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgZ2l2ZW4gdmlld1xcJ3MgYnVmZmVyIGhhcyBiZWVuIGRldGFjaGVkIGFuZCBzbyBjYW5ub3QgYmUgdXNlZCBhcyBhIHJlc3BvbnNlJyk7XG4gICAgfVxuXG4gICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclJlc3BvbmRXaXRoTmV3Vmlldyh0aGlzLl9hc3NvY2lhdGVkUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlciwgdmlldyk7XG4gIH1cbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoUmVhZGFibGVTdHJlYW1CWU9CUmVxdWVzdC5wcm90b3R5cGUsIHtcbiAgcmVzcG9uZDogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIHJlc3BvbmRXaXRoTmV3VmlldzogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIHZpZXc6IHsgZW51bWVyYWJsZTogdHJ1ZSB9XG59KTtcbnNldEZ1bmN0aW9uTmFtZShSZWFkYWJsZVN0cmVhbUJZT0JSZXF1ZXN0LnByb3RvdHlwZS5yZXNwb25kLCAncmVzcG9uZCcpO1xuc2V0RnVuY3Rpb25OYW1lKFJlYWRhYmxlU3RyZWFtQllPQlJlcXVlc3QucHJvdG90eXBlLnJlc3BvbmRXaXRoTmV3VmlldywgJ3Jlc3BvbmRXaXRoTmV3VmlldycpO1xuaWYgKHR5cGVvZiBTeW1ib2wudG9TdHJpbmdUYWcgPT09ICdzeW1ib2wnKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSZWFkYWJsZVN0cmVhbUJZT0JSZXF1ZXN0LnByb3RvdHlwZSwgU3ltYm9sLnRvU3RyaW5nVGFnLCB7XG4gICAgdmFsdWU6ICdSZWFkYWJsZVN0cmVhbUJZT0JSZXF1ZXN0JyxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG59XG5cbmludGVyZmFjZSBCeXRlUXVldWVFbGVtZW50IHtcbiAgYnVmZmVyOiBBcnJheUJ1ZmZlcjtcbiAgYnl0ZU9mZnNldDogbnVtYmVyO1xuICBieXRlTGVuZ3RoOiBudW1iZXI7XG59XG5cbnR5cGUgUHVsbEludG9EZXNjcmlwdG9yPFQgZXh0ZW5kcyBOb25TaGFyZWQ8QXJyYXlCdWZmZXJWaWV3PiA9IE5vblNoYXJlZDxBcnJheUJ1ZmZlclZpZXc+PiA9XG4gIERlZmF1bHRQdWxsSW50b0Rlc2NyaXB0b3JcbiAgfCBCWU9CUHVsbEludG9EZXNjcmlwdG9yPFQ+O1xuXG5pbnRlcmZhY2UgRGVmYXVsdFB1bGxJbnRvRGVzY3JpcHRvciB7XG4gIGJ1ZmZlcjogQXJyYXlCdWZmZXI7XG4gIGJ1ZmZlckJ5dGVMZW5ndGg6IG51bWJlcjtcbiAgYnl0ZU9mZnNldDogbnVtYmVyO1xuICBieXRlTGVuZ3RoOiBudW1iZXI7XG4gIGJ5dGVzRmlsbGVkOiBudW1iZXI7XG4gIG1pbmltdW1GaWxsOiBudW1iZXI7XG4gIGVsZW1lbnRTaXplOiBudW1iZXI7XG4gIHZpZXdDb25zdHJ1Y3RvcjogVHlwZWRBcnJheUNvbnN0cnVjdG9yPFVpbnQ4QXJyYXk+O1xuICByZWFkZXJUeXBlOiAnZGVmYXVsdCcgfCAnbm9uZSc7XG59XG5cbmludGVyZmFjZSBCWU9CUHVsbEludG9EZXNjcmlwdG9yPFQgZXh0ZW5kcyBOb25TaGFyZWQ8QXJyYXlCdWZmZXJWaWV3PiA9IE5vblNoYXJlZDxBcnJheUJ1ZmZlclZpZXc+PiB7XG4gIGJ1ZmZlcjogQXJyYXlCdWZmZXI7XG4gIGJ1ZmZlckJ5dGVMZW5ndGg6IG51bWJlcjtcbiAgYnl0ZU9mZnNldDogbnVtYmVyO1xuICBieXRlTGVuZ3RoOiBudW1iZXI7XG4gIGJ5dGVzRmlsbGVkOiBudW1iZXI7XG4gIG1pbmltdW1GaWxsOiBudW1iZXI7XG4gIGVsZW1lbnRTaXplOiBudW1iZXI7XG4gIHZpZXdDb25zdHJ1Y3RvcjogQXJyYXlCdWZmZXJWaWV3Q29uc3RydWN0b3I8VD47XG4gIHJlYWRlclR5cGU6ICdieW9iJyB8ICdub25lJztcbn1cblxuLyoqXG4gKiBBbGxvd3MgY29udHJvbCBvZiBhIHtAbGluayBSZWFkYWJsZVN0cmVhbSB8IHJlYWRhYmxlIGJ5dGUgc3RyZWFtfSdzIHN0YXRlIGFuZCBpbnRlcm5hbCBxdWV1ZS5cbiAqXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjbGFzcyBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyIHtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfY29udHJvbGxlZFJlYWRhYmxlQnl0ZVN0cmVhbSE6IFJlYWRhYmxlQnl0ZVN0cmVhbTtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcXVldWUhOiBTaW1wbGVRdWV1ZTxCeXRlUXVldWVFbGVtZW50PjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcXVldWVUb3RhbFNpemUhOiBudW1iZXI7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3N0YXJ0ZWQhOiBib29sZWFuO1xuICAvKiogQGludGVybmFsICovXG4gIF9jbG9zZVJlcXVlc3RlZCE6IGJvb2xlYW47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3B1bGxBZ2FpbiE6IGJvb2xlYW47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3B1bGxpbmcgITogYm9vbGVhbjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfc3RyYXRlZ3lIV00hOiBudW1iZXI7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3B1bGxBbGdvcml0aG0hOiAoKSA9PiBQcm9taXNlPHZvaWQ+O1xuICAvKiogQGludGVybmFsICovXG4gIF9jYW5jZWxBbGdvcml0aG0hOiAocmVhc29uOiBhbnkpID0+IFByb21pc2U8dm9pZD47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2F1dG9BbGxvY2F0ZUNodW5rU2l6ZTogbnVtYmVyIHwgdW5kZWZpbmVkO1xuICAvKiogQGludGVybmFsICovXG4gIF9ieW9iUmVxdWVzdDogUmVhZGFibGVTdHJlYW1CWU9CUmVxdWVzdCB8IG51bGw7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3BlbmRpbmdQdWxsSW50b3MhOiBTaW1wbGVRdWV1ZTxQdWxsSW50b0Rlc2NyaXB0b3I+O1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IoKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSWxsZWdhbCBjb25zdHJ1Y3RvcicpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGN1cnJlbnQgQllPQiBwdWxsIHJlcXVlc3QsIG9yIGBudWxsYCBpZiB0aGVyZSBpc24ndCBvbmUuXG4gICAqL1xuICBnZXQgYnlvYlJlcXVlc3QoKTogUmVhZGFibGVTdHJlYW1CWU9CUmVxdWVzdCB8IG51bGwge1xuICAgIGlmICghSXNSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyKHRoaXMpKSB7XG4gICAgICB0aHJvdyBieXRlU3RyZWFtQ29udHJvbGxlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ2J5b2JSZXF1ZXN0Jyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJHZXRCWU9CUmVxdWVzdCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBkZXNpcmVkIHNpemUgdG8gZmlsbCB0aGUgY29udHJvbGxlZCBzdHJlYW0ncyBpbnRlcm5hbCBxdWV1ZS4gSXQgY2FuIGJlIG5lZ2F0aXZlLCBpZiB0aGUgcXVldWUgaXNcbiAgICogb3Zlci1mdWxsLiBBbiB1bmRlcmx5aW5nIGJ5dGUgc291cmNlIG91Z2h0IHRvIHVzZSB0aGlzIGluZm9ybWF0aW9uIHRvIGRldGVybWluZSB3aGVuIGFuZCBob3cgdG8gYXBwbHkgYmFja3ByZXNzdXJlLlxuICAgKi9cbiAgZ2V0IGRlc2lyZWRTaXplKCk6IG51bWJlciB8IG51bGwge1xuICAgIGlmICghSXNSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyKHRoaXMpKSB7XG4gICAgICB0aHJvdyBieXRlU3RyZWFtQ29udHJvbGxlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ2Rlc2lyZWRTaXplJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJHZXREZXNpcmVkU2l6ZSh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbG9zZXMgdGhlIGNvbnRyb2xsZWQgcmVhZGFibGUgc3RyZWFtLiBDb25zdW1lcnMgd2lsbCBzdGlsbCBiZSBhYmxlIHRvIHJlYWQgYW55IHByZXZpb3VzbHktZW5xdWV1ZWQgY2h1bmtzIGZyb21cbiAgICogdGhlIHN0cmVhbSwgYnV0IG9uY2UgdGhvc2UgYXJlIHJlYWQsIHRoZSBzdHJlYW0gd2lsbCBiZWNvbWUgY2xvc2VkLlxuICAgKi9cbiAgY2xvc2UoKTogdm9pZCB7XG4gICAgaWYgKCFJc1JlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIodGhpcykpIHtcbiAgICAgIHRocm93IGJ5dGVTdHJlYW1Db250cm9sbGVyQnJhbmRDaGVja0V4Y2VwdGlvbignY2xvc2UnKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fY2xvc2VSZXF1ZXN0ZWQpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBzdHJlYW0gaGFzIGFscmVhZHkgYmVlbiBjbG9zZWQ7IGRvIG5vdCBjbG9zZSBpdCBhZ2FpbiEnKTtcbiAgICB9XG5cbiAgICBjb25zdCBzdGF0ZSA9IHRoaXMuX2NvbnRyb2xsZWRSZWFkYWJsZUJ5dGVTdHJlYW0uX3N0YXRlO1xuICAgIGlmIChzdGF0ZSAhPT0gJ3JlYWRhYmxlJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgVGhlIHN0cmVhbSAoaW4gJHtzdGF0ZX0gc3RhdGUpIGlzIG5vdCBpbiB0aGUgcmVhZGFibGUgc3RhdGUgYW5kIGNhbm5vdCBiZSBjbG9zZWRgKTtcbiAgICB9XG5cbiAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyQ2xvc2UodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogRW5xdWV1ZXMgdGhlIGdpdmVuIGNodW5rIGNodW5rIGluIHRoZSBjb250cm9sbGVkIHJlYWRhYmxlIHN0cmVhbS5cbiAgICogVGhlIGNodW5rIGhhcyB0byBiZSBhbiBgQXJyYXlCdWZmZXJWaWV3YCBpbnN0YW5jZSwgb3IgZWxzZSBhIGBUeXBlRXJyb3JgIHdpbGwgYmUgdGhyb3duLlxuICAgKi9cbiAgZW5xdWV1ZShjaHVuazogQXJyYXlCdWZmZXJWaWV3KTogdm9pZDtcbiAgZW5xdWV1ZShjaHVuazogTm9uU2hhcmVkPEFycmF5QnVmZmVyVmlldz4pOiB2b2lkIHtcbiAgICBpZiAoIUlzUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcih0aGlzKSkge1xuICAgICAgdGhyb3cgYnl0ZVN0cmVhbUNvbnRyb2xsZXJCcmFuZENoZWNrRXhjZXB0aW9uKCdlbnF1ZXVlJyk7XG4gICAgfVxuXG4gICAgYXNzZXJ0UmVxdWlyZWRBcmd1bWVudChjaHVuaywgMSwgJ2VucXVldWUnKTtcbiAgICBpZiAoIUFycmF5QnVmZmVyLmlzVmlldyhjaHVuaykpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2NodW5rIG11c3QgYmUgYW4gYXJyYXkgYnVmZmVyIHZpZXcnKTtcbiAgICB9XG4gICAgaWYgKGNodW5rLmJ5dGVMZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2NodW5rIG11c3QgaGF2ZSBub24temVybyBieXRlTGVuZ3RoJyk7XG4gICAgfVxuICAgIGlmIChjaHVuay5idWZmZXIuYnl0ZUxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgY2h1bmsncyBidWZmZXIgbXVzdCBoYXZlIG5vbi16ZXJvIGJ5dGVMZW5ndGhgKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fY2xvc2VSZXF1ZXN0ZWQpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3N0cmVhbSBpcyBjbG9zZWQgb3IgZHJhaW5pbmcnKTtcbiAgICB9XG5cbiAgICBjb25zdCBzdGF0ZSA9IHRoaXMuX2NvbnRyb2xsZWRSZWFkYWJsZUJ5dGVTdHJlYW0uX3N0YXRlO1xuICAgIGlmIChzdGF0ZSAhPT0gJ3JlYWRhYmxlJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgVGhlIHN0cmVhbSAoaW4gJHtzdGF0ZX0gc3RhdGUpIGlzIG5vdCBpbiB0aGUgcmVhZGFibGUgc3RhdGUgYW5kIGNhbm5vdCBiZSBlbnF1ZXVlZCB0b2ApO1xuICAgIH1cblxuICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJFbnF1ZXVlKHRoaXMsIGNodW5rKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFcnJvcnMgdGhlIGNvbnRyb2xsZWQgcmVhZGFibGUgc3RyZWFtLCBtYWtpbmcgYWxsIGZ1dHVyZSBpbnRlcmFjdGlvbnMgd2l0aCBpdCBmYWlsIHdpdGggdGhlIGdpdmVuIGVycm9yIGBlYC5cbiAgICovXG4gIGVycm9yKGU6IGFueSA9IHVuZGVmaW5lZCk6IHZvaWQge1xuICAgIGlmICghSXNSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyKHRoaXMpKSB7XG4gICAgICB0aHJvdyBieXRlU3RyZWFtQ29udHJvbGxlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ2Vycm9yJyk7XG4gICAgfVxuXG4gICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVycm9yKHRoaXMsIGUpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBbQ2FuY2VsU3RlcHNdKHJlYXNvbjogYW55KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckNsZWFyUGVuZGluZ1B1bGxJbnRvcyh0aGlzKTtcblxuICAgIFJlc2V0UXVldWUodGhpcyk7XG5cbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLl9jYW5jZWxBbGdvcml0aG0ocmVhc29uKTtcbiAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyQ2xlYXJBbGdvcml0aG1zKHRoaXMpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIFtQdWxsU3RlcHNdKHJlYWRSZXF1ZXN0OiBSZWFkUmVxdWVzdDxOb25TaGFyZWQ8VWludDhBcnJheT4+KTogdm9pZCB7XG4gICAgY29uc3Qgc3RyZWFtID0gdGhpcy5fY29udHJvbGxlZFJlYWRhYmxlQnl0ZVN0cmVhbTtcbiAgICBhc3NlcnQoUmVhZGFibGVTdHJlYW1IYXNEZWZhdWx0UmVhZGVyKHN0cmVhbSkpO1xuXG4gICAgaWYgKHRoaXMuX3F1ZXVlVG90YWxTaXplID4gMCkge1xuICAgICAgYXNzZXJ0KFJlYWRhYmxlU3RyZWFtR2V0TnVtUmVhZFJlcXVlc3RzKHN0cmVhbSkgPT09IDApO1xuXG4gICAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRmlsbFJlYWRSZXF1ZXN0RnJvbVF1ZXVlKHRoaXMsIHJlYWRSZXF1ZXN0KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBhdXRvQWxsb2NhdGVDaHVua1NpemUgPSB0aGlzLl9hdXRvQWxsb2NhdGVDaHVua1NpemU7XG4gICAgaWYgKGF1dG9BbGxvY2F0ZUNodW5rU2l6ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBsZXQgYnVmZmVyOiBBcnJheUJ1ZmZlcjtcbiAgICAgIHRyeSB7XG4gICAgICAgIGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcihhdXRvQWxsb2NhdGVDaHVua1NpemUpO1xuICAgICAgfSBjYXRjaCAoYnVmZmVyRSkge1xuICAgICAgICByZWFkUmVxdWVzdC5fZXJyb3JTdGVwcyhidWZmZXJFKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBwdWxsSW50b0Rlc2NyaXB0b3I6IERlZmF1bHRQdWxsSW50b0Rlc2NyaXB0b3IgPSB7XG4gICAgICAgIGJ1ZmZlcixcbiAgICAgICAgYnVmZmVyQnl0ZUxlbmd0aDogYXV0b0FsbG9jYXRlQ2h1bmtTaXplLFxuICAgICAgICBieXRlT2Zmc2V0OiAwLFxuICAgICAgICBieXRlTGVuZ3RoOiBhdXRvQWxsb2NhdGVDaHVua1NpemUsXG4gICAgICAgIGJ5dGVzRmlsbGVkOiAwLFxuICAgICAgICBtaW5pbXVtRmlsbDogMSxcbiAgICAgICAgZWxlbWVudFNpemU6IDEsXG4gICAgICAgIHZpZXdDb25zdHJ1Y3RvcjogVWludDhBcnJheSxcbiAgICAgICAgcmVhZGVyVHlwZTogJ2RlZmF1bHQnXG4gICAgICB9O1xuXG4gICAgICB0aGlzLl9wZW5kaW5nUHVsbEludG9zLnB1c2gocHVsbEludG9EZXNjcmlwdG9yKTtcbiAgICB9XG5cbiAgICBSZWFkYWJsZVN0cmVhbUFkZFJlYWRSZXF1ZXN0KHN0cmVhbSwgcmVhZFJlcXVlc3QpO1xuICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJDYWxsUHVsbElmTmVlZGVkKHRoaXMpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBbUmVsZWFzZVN0ZXBzXSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fcGVuZGluZ1B1bGxJbnRvcy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBmaXJzdFB1bGxJbnRvID0gdGhpcy5fcGVuZGluZ1B1bGxJbnRvcy5wZWVrKCk7XG4gICAgICBmaXJzdFB1bGxJbnRvLnJlYWRlclR5cGUgPSAnbm9uZSc7XG5cbiAgICAgIHRoaXMuX3BlbmRpbmdQdWxsSW50b3MgPSBuZXcgU2ltcGxlUXVldWUoKTtcbiAgICAgIHRoaXMuX3BlbmRpbmdQdWxsSW50b3MucHVzaChmaXJzdFB1bGxJbnRvKTtcbiAgICB9XG4gIH1cbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlci5wcm90b3R5cGUsIHtcbiAgY2xvc2U6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICBlbnF1ZXVlOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgZXJyb3I6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICBieW9iUmVxdWVzdDogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIGRlc2lyZWRTaXplOiB7IGVudW1lcmFibGU6IHRydWUgfVxufSk7XG5zZXRGdW5jdGlvbk5hbWUoUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlci5wcm90b3R5cGUuY2xvc2UsICdjbG9zZScpO1xuc2V0RnVuY3Rpb25OYW1lKFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIucHJvdG90eXBlLmVucXVldWUsICdlbnF1ZXVlJyk7XG5zZXRGdW5jdGlvbk5hbWUoUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlci5wcm90b3R5cGUuZXJyb3IsICdlcnJvcicpO1xuaWYgKHR5cGVvZiBTeW1ib2wudG9TdHJpbmdUYWcgPT09ICdzeW1ib2wnKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyLnByb3RvdHlwZSwgU3ltYm9sLnRvU3RyaW5nVGFnLCB7XG4gICAgdmFsdWU6ICdSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyJyxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG59XG5cbi8vIEFic3RyYWN0IG9wZXJhdGlvbnMgZm9yIHRoZSBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyLlxuXG5leHBvcnQgZnVuY3Rpb24gSXNSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyKHg6IGFueSk6IHggaXMgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlciB7XG4gIGlmICghdHlwZUlzT2JqZWN0KHgpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoeCwgJ19jb250cm9sbGVkUmVhZGFibGVCeXRlU3RyZWFtJykpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4geCBpbnN0YW5jZW9mIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXI7XG59XG5cbmZ1bmN0aW9uIElzUmVhZGFibGVTdHJlYW1CWU9CUmVxdWVzdCh4OiBhbnkpOiB4IGlzIFJlYWRhYmxlU3RyZWFtQllPQlJlcXVlc3Qge1xuICBpZiAoIXR5cGVJc09iamVjdCh4KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHgsICdfYXNzb2NpYXRlZFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXInKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB4IGluc3RhbmNlb2YgUmVhZGFibGVTdHJlYW1CWU9CUmVxdWVzdDtcbn1cblxuZnVuY3Rpb24gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckNhbGxQdWxsSWZOZWVkZWQoY29udHJvbGxlcjogUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcik6IHZvaWQge1xuICBjb25zdCBzaG91bGRQdWxsID0gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclNob3VsZENhbGxQdWxsKGNvbnRyb2xsZXIpO1xuICBpZiAoIXNob3VsZFB1bGwpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoY29udHJvbGxlci5fcHVsbGluZykge1xuICAgIGNvbnRyb2xsZXIuX3B1bGxBZ2FpbiA9IHRydWU7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgYXNzZXJ0KCFjb250cm9sbGVyLl9wdWxsQWdhaW4pO1xuXG4gIGNvbnRyb2xsZXIuX3B1bGxpbmcgPSB0cnVlO1xuXG4gIC8vIFRPRE86IFRlc3QgY29udHJvbGxlciBhcmd1bWVudFxuICBjb25zdCBwdWxsUHJvbWlzZSA9IGNvbnRyb2xsZXIuX3B1bGxBbGdvcml0aG0oKTtcbiAgdXBvblByb21pc2UoXG4gICAgcHVsbFByb21pc2UsXG4gICAgKCkgPT4ge1xuICAgICAgY29udHJvbGxlci5fcHVsbGluZyA9IGZhbHNlO1xuXG4gICAgICBpZiAoY29udHJvbGxlci5fcHVsbEFnYWluKSB7XG4gICAgICAgIGNvbnRyb2xsZXIuX3B1bGxBZ2FpbiA9IGZhbHNlO1xuICAgICAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyQ2FsbFB1bGxJZk5lZWRlZChjb250cm9sbGVyKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcbiAgICBlID0+IHtcbiAgICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJFcnJvcihjb250cm9sbGVyLCBlKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgKTtcbn1cblxuZnVuY3Rpb24gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckNsZWFyUGVuZGluZ1B1bGxJbnRvcyhjb250cm9sbGVyOiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyKSB7XG4gIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJJbnZhbGlkYXRlQllPQlJlcXVlc3QoY29udHJvbGxlcik7XG4gIGNvbnRyb2xsZXIuX3BlbmRpbmdQdWxsSW50b3MgPSBuZXcgU2ltcGxlUXVldWUoKTtcbn1cblxuZnVuY3Rpb24gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckNvbW1pdFB1bGxJbnRvRGVzY3JpcHRvcjxUIGV4dGVuZHMgTm9uU2hhcmVkPEFycmF5QnVmZmVyVmlldz4+KFxuICBzdHJlYW06IFJlYWRhYmxlQnl0ZVN0cmVhbSxcbiAgcHVsbEludG9EZXNjcmlwdG9yOiBQdWxsSW50b0Rlc2NyaXB0b3I8VD5cbikge1xuICBhc3NlcnQoc3RyZWFtLl9zdGF0ZSAhPT0gJ2Vycm9yZWQnKTtcbiAgYXNzZXJ0KHB1bGxJbnRvRGVzY3JpcHRvci5yZWFkZXJUeXBlICE9PSAnbm9uZScpO1xuXG4gIGxldCBkb25lID0gZmFsc2U7XG4gIGlmIChzdHJlYW0uX3N0YXRlID09PSAnY2xvc2VkJykge1xuICAgIGFzc2VydChwdWxsSW50b0Rlc2NyaXB0b3IuYnl0ZXNGaWxsZWQgJSBwdWxsSW50b0Rlc2NyaXB0b3IuZWxlbWVudFNpemUgPT09IDApO1xuICAgIGRvbmUgPSB0cnVlO1xuICB9XG5cbiAgY29uc3QgZmlsbGVkVmlldyA9IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJDb252ZXJ0UHVsbEludG9EZXNjcmlwdG9yPFQ+KHB1bGxJbnRvRGVzY3JpcHRvcik7XG4gIGlmIChwdWxsSW50b0Rlc2NyaXB0b3IucmVhZGVyVHlwZSA9PT0gJ2RlZmF1bHQnKSB7XG4gICAgUmVhZGFibGVTdHJlYW1GdWxmaWxsUmVhZFJlcXVlc3Qoc3RyZWFtLCBmaWxsZWRWaWV3IGFzIHVua25vd24gYXMgTm9uU2hhcmVkPFVpbnQ4QXJyYXk+LCBkb25lKTtcbiAgfSBlbHNlIHtcbiAgICBhc3NlcnQocHVsbEludG9EZXNjcmlwdG9yLnJlYWRlclR5cGUgPT09ICdieW9iJyk7XG4gICAgUmVhZGFibGVTdHJlYW1GdWxmaWxsUmVhZEludG9SZXF1ZXN0KHN0cmVhbSwgZmlsbGVkVmlldywgZG9uZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckNvbnZlcnRQdWxsSW50b0Rlc2NyaXB0b3I8VCBleHRlbmRzIE5vblNoYXJlZDxBcnJheUJ1ZmZlclZpZXc+PihcbiAgcHVsbEludG9EZXNjcmlwdG9yOiBQdWxsSW50b0Rlc2NyaXB0b3I8VD5cbik6IFQge1xuICBjb25zdCBieXRlc0ZpbGxlZCA9IHB1bGxJbnRvRGVzY3JpcHRvci5ieXRlc0ZpbGxlZDtcbiAgY29uc3QgZWxlbWVudFNpemUgPSBwdWxsSW50b0Rlc2NyaXB0b3IuZWxlbWVudFNpemU7XG5cbiAgYXNzZXJ0KGJ5dGVzRmlsbGVkIDw9IHB1bGxJbnRvRGVzY3JpcHRvci5ieXRlTGVuZ3RoKTtcbiAgYXNzZXJ0KGJ5dGVzRmlsbGVkICUgZWxlbWVudFNpemUgPT09IDApO1xuXG4gIHJldHVybiBuZXcgcHVsbEludG9EZXNjcmlwdG9yLnZpZXdDb25zdHJ1Y3RvcihcbiAgICBwdWxsSW50b0Rlc2NyaXB0b3IuYnVmZmVyLCBwdWxsSW50b0Rlc2NyaXB0b3IuYnl0ZU9mZnNldCwgYnl0ZXNGaWxsZWQgLyBlbGVtZW50U2l6ZSkgYXMgVDtcbn1cblxuZnVuY3Rpb24gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVucXVldWVDaHVua1RvUXVldWUoY29udHJvbGxlcjogUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlcjogQXJyYXlCdWZmZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBieXRlT2Zmc2V0OiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBieXRlTGVuZ3RoOiBudW1iZXIpIHtcbiAgY29udHJvbGxlci5fcXVldWUucHVzaCh7IGJ1ZmZlciwgYnl0ZU9mZnNldCwgYnl0ZUxlbmd0aCB9KTtcbiAgY29udHJvbGxlci5fcXVldWVUb3RhbFNpemUgKz0gYnl0ZUxlbmd0aDtcbn1cblxuZnVuY3Rpb24gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVucXVldWVDbG9uZWRDaHVua1RvUXVldWUoY29udHJvbGxlcjogUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlcjogQXJyYXlCdWZmZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBieXRlT2Zmc2V0OiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBieXRlTGVuZ3RoOiBudW1iZXIpIHtcbiAgbGV0IGNsb25lZENodW5rO1xuICB0cnkge1xuICAgIGNsb25lZENodW5rID0gQXJyYXlCdWZmZXJTbGljZShidWZmZXIsIGJ5dGVPZmZzZXQsIGJ5dGVPZmZzZXQgKyBieXRlTGVuZ3RoKTtcbiAgfSBjYXRjaCAoY2xvbmVFKSB7XG4gICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVycm9yKGNvbnRyb2xsZXIsIGNsb25lRSk7XG4gICAgdGhyb3cgY2xvbmVFO1xuICB9XG4gIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJFbnF1ZXVlQ2h1bmtUb1F1ZXVlKGNvbnRyb2xsZXIsIGNsb25lZENodW5rLCAwLCBieXRlTGVuZ3RoKTtcbn1cblxuZnVuY3Rpb24gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVucXVldWVEZXRhY2hlZFB1bGxJbnRvVG9RdWV1ZShjb250cm9sbGVyOiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaXJzdERlc2NyaXB0b3I6IFB1bGxJbnRvRGVzY3JpcHRvcikge1xuICBhc3NlcnQoZmlyc3REZXNjcmlwdG9yLnJlYWRlclR5cGUgPT09ICdub25lJyk7XG4gIGlmIChmaXJzdERlc2NyaXB0b3IuYnl0ZXNGaWxsZWQgPiAwKSB7XG4gICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVucXVldWVDbG9uZWRDaHVua1RvUXVldWUoXG4gICAgICBjb250cm9sbGVyLFxuICAgICAgZmlyc3REZXNjcmlwdG9yLmJ1ZmZlcixcbiAgICAgIGZpcnN0RGVzY3JpcHRvci5ieXRlT2Zmc2V0LFxuICAgICAgZmlyc3REZXNjcmlwdG9yLmJ5dGVzRmlsbGVkXG4gICAgKTtcbiAgfVxuICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyU2hpZnRQZW5kaW5nUHVsbEludG8oY29udHJvbGxlcik7XG59XG5cbmZ1bmN0aW9uIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJGaWxsUHVsbEludG9EZXNjcmlwdG9yRnJvbVF1ZXVlKGNvbnRyb2xsZXI6IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwdWxsSW50b0Rlc2NyaXB0b3I6IFB1bGxJbnRvRGVzY3JpcHRvcikge1xuICBjb25zdCBtYXhCeXRlc1RvQ29weSA9IE1hdGgubWluKGNvbnRyb2xsZXIuX3F1ZXVlVG90YWxTaXplLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHB1bGxJbnRvRGVzY3JpcHRvci5ieXRlTGVuZ3RoIC0gcHVsbEludG9EZXNjcmlwdG9yLmJ5dGVzRmlsbGVkKTtcbiAgY29uc3QgbWF4Qnl0ZXNGaWxsZWQgPSBwdWxsSW50b0Rlc2NyaXB0b3IuYnl0ZXNGaWxsZWQgKyBtYXhCeXRlc1RvQ29weTtcblxuICBsZXQgdG90YWxCeXRlc1RvQ29weVJlbWFpbmluZyA9IG1heEJ5dGVzVG9Db3B5O1xuICBsZXQgcmVhZHkgPSBmYWxzZTtcbiAgYXNzZXJ0KHB1bGxJbnRvRGVzY3JpcHRvci5ieXRlc0ZpbGxlZCA8IHB1bGxJbnRvRGVzY3JpcHRvci5taW5pbXVtRmlsbCk7XG4gIGNvbnN0IHJlbWFpbmRlckJ5dGVzID0gbWF4Qnl0ZXNGaWxsZWQgJSBwdWxsSW50b0Rlc2NyaXB0b3IuZWxlbWVudFNpemU7XG4gIGNvbnN0IG1heEFsaWduZWRCeXRlcyA9IG1heEJ5dGVzRmlsbGVkIC0gcmVtYWluZGVyQnl0ZXM7XG4gIC8vIEEgZGVzY3JpcHRvciBmb3IgYSByZWFkKCkgcmVxdWVzdCB0aGF0IGlzIG5vdCB5ZXQgZmlsbGVkIHVwIHRvIGl0cyBtaW5pbXVtIGxlbmd0aCB3aWxsIHN0YXkgYXQgdGhlIGhlYWRcbiAgLy8gb2YgdGhlIHF1ZXVlLCBzbyB0aGUgdW5kZXJseWluZyBzb3VyY2UgY2FuIGtlZXAgZmlsbGluZyBpdC5cbiAgaWYgKG1heEFsaWduZWRCeXRlcyA+PSBwdWxsSW50b0Rlc2NyaXB0b3IubWluaW11bUZpbGwpIHtcbiAgICB0b3RhbEJ5dGVzVG9Db3B5UmVtYWluaW5nID0gbWF4QWxpZ25lZEJ5dGVzIC0gcHVsbEludG9EZXNjcmlwdG9yLmJ5dGVzRmlsbGVkO1xuICAgIHJlYWR5ID0gdHJ1ZTtcbiAgfVxuXG4gIGNvbnN0IHF1ZXVlID0gY29udHJvbGxlci5fcXVldWU7XG5cbiAgd2hpbGUgKHRvdGFsQnl0ZXNUb0NvcHlSZW1haW5pbmcgPiAwKSB7XG4gICAgY29uc3QgaGVhZE9mUXVldWUgPSBxdWV1ZS5wZWVrKCk7XG5cbiAgICBjb25zdCBieXRlc1RvQ29weSA9IE1hdGgubWluKHRvdGFsQnl0ZXNUb0NvcHlSZW1haW5pbmcsIGhlYWRPZlF1ZXVlLmJ5dGVMZW5ndGgpO1xuXG4gICAgY29uc3QgZGVzdFN0YXJ0ID0gcHVsbEludG9EZXNjcmlwdG9yLmJ5dGVPZmZzZXQgKyBwdWxsSW50b0Rlc2NyaXB0b3IuYnl0ZXNGaWxsZWQ7XG4gICAgQ29weURhdGFCbG9ja0J5dGVzKHB1bGxJbnRvRGVzY3JpcHRvci5idWZmZXIsIGRlc3RTdGFydCwgaGVhZE9mUXVldWUuYnVmZmVyLCBoZWFkT2ZRdWV1ZS5ieXRlT2Zmc2V0LCBieXRlc1RvQ29weSk7XG5cbiAgICBpZiAoaGVhZE9mUXVldWUuYnl0ZUxlbmd0aCA9PT0gYnl0ZXNUb0NvcHkpIHtcbiAgICAgIHF1ZXVlLnNoaWZ0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhlYWRPZlF1ZXVlLmJ5dGVPZmZzZXQgKz0gYnl0ZXNUb0NvcHk7XG4gICAgICBoZWFkT2ZRdWV1ZS5ieXRlTGVuZ3RoIC09IGJ5dGVzVG9Db3B5O1xuICAgIH1cbiAgICBjb250cm9sbGVyLl9xdWV1ZVRvdGFsU2l6ZSAtPSBieXRlc1RvQ29weTtcblxuICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJGaWxsSGVhZFB1bGxJbnRvRGVzY3JpcHRvcihjb250cm9sbGVyLCBieXRlc1RvQ29weSwgcHVsbEludG9EZXNjcmlwdG9yKTtcblxuICAgIHRvdGFsQnl0ZXNUb0NvcHlSZW1haW5pbmcgLT0gYnl0ZXNUb0NvcHk7XG4gIH1cblxuICBpZiAoIXJlYWR5KSB7XG4gICAgYXNzZXJ0KGNvbnRyb2xsZXIuX3F1ZXVlVG90YWxTaXplID09PSAwKTtcbiAgICBhc3NlcnQocHVsbEludG9EZXNjcmlwdG9yLmJ5dGVzRmlsbGVkID4gMCk7XG4gICAgYXNzZXJ0KHB1bGxJbnRvRGVzY3JpcHRvci5ieXRlc0ZpbGxlZCA8IHB1bGxJbnRvRGVzY3JpcHRvci5taW5pbXVtRmlsbCk7XG4gIH1cblxuICByZXR1cm4gcmVhZHk7XG59XG5cbmZ1bmN0aW9uIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJGaWxsSGVhZFB1bGxJbnRvRGVzY3JpcHRvcihjb250cm9sbGVyOiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpemU6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwdWxsSW50b0Rlc2NyaXB0b3I6IFB1bGxJbnRvRGVzY3JpcHRvcikge1xuICBhc3NlcnQoY29udHJvbGxlci5fcGVuZGluZ1B1bGxJbnRvcy5sZW5ndGggPT09IDAgfHwgY29udHJvbGxlci5fcGVuZGluZ1B1bGxJbnRvcy5wZWVrKCkgPT09IHB1bGxJbnRvRGVzY3JpcHRvcik7XG4gIGFzc2VydChjb250cm9sbGVyLl9ieW9iUmVxdWVzdCA9PT0gbnVsbCk7XG4gIHB1bGxJbnRvRGVzY3JpcHRvci5ieXRlc0ZpbGxlZCArPSBzaXplO1xufVxuXG5mdW5jdGlvbiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVySGFuZGxlUXVldWVEcmFpbihjb250cm9sbGVyOiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyKSB7XG4gIGFzc2VydChjb250cm9sbGVyLl9jb250cm9sbGVkUmVhZGFibGVCeXRlU3RyZWFtLl9zdGF0ZSA9PT0gJ3JlYWRhYmxlJyk7XG5cbiAgaWYgKGNvbnRyb2xsZXIuX3F1ZXVlVG90YWxTaXplID09PSAwICYmIGNvbnRyb2xsZXIuX2Nsb3NlUmVxdWVzdGVkKSB7XG4gICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckNsZWFyQWxnb3JpdGhtcyhjb250cm9sbGVyKTtcbiAgICBSZWFkYWJsZVN0cmVhbUNsb3NlKGNvbnRyb2xsZXIuX2NvbnRyb2xsZWRSZWFkYWJsZUJ5dGVTdHJlYW0pO1xuICB9IGVsc2Uge1xuICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJDYWxsUHVsbElmTmVlZGVkKGNvbnRyb2xsZXIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJJbnZhbGlkYXRlQllPQlJlcXVlc3QoY29udHJvbGxlcjogUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcikge1xuICBpZiAoY29udHJvbGxlci5fYnlvYlJlcXVlc3QgPT09IG51bGwpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb250cm9sbGVyLl9ieW9iUmVxdWVzdC5fYXNzb2NpYXRlZFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIgPSB1bmRlZmluZWQhO1xuICBjb250cm9sbGVyLl9ieW9iUmVxdWVzdC5fdmlldyA9IG51bGwhO1xuICBjb250cm9sbGVyLl9ieW9iUmVxdWVzdCA9IG51bGw7XG59XG5cbmZ1bmN0aW9uIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJQcm9jZXNzUHVsbEludG9EZXNjcmlwdG9yc1VzaW5nUXVldWUoY29udHJvbGxlcjogUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcikge1xuICBhc3NlcnQoIWNvbnRyb2xsZXIuX2Nsb3NlUmVxdWVzdGVkKTtcblxuICB3aGlsZSAoY29udHJvbGxlci5fcGVuZGluZ1B1bGxJbnRvcy5sZW5ndGggPiAwKSB7XG4gICAgaWYgKGNvbnRyb2xsZXIuX3F1ZXVlVG90YWxTaXplID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcHVsbEludG9EZXNjcmlwdG9yID0gY29udHJvbGxlci5fcGVuZGluZ1B1bGxJbnRvcy5wZWVrKCk7XG4gICAgYXNzZXJ0KHB1bGxJbnRvRGVzY3JpcHRvci5yZWFkZXJUeXBlICE9PSAnbm9uZScpO1xuXG4gICAgaWYgKFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJGaWxsUHVsbEludG9EZXNjcmlwdG9yRnJvbVF1ZXVlKGNvbnRyb2xsZXIsIHB1bGxJbnRvRGVzY3JpcHRvcikpIHtcbiAgICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJTaGlmdFBlbmRpbmdQdWxsSW50byhjb250cm9sbGVyKTtcblxuICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckNvbW1pdFB1bGxJbnRvRGVzY3JpcHRvcihcbiAgICAgICAgY29udHJvbGxlci5fY29udHJvbGxlZFJlYWRhYmxlQnl0ZVN0cmVhbSxcbiAgICAgICAgcHVsbEludG9EZXNjcmlwdG9yXG4gICAgICApO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyUHJvY2Vzc1JlYWRSZXF1ZXN0c1VzaW5nUXVldWUoY29udHJvbGxlcjogUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcikge1xuICBjb25zdCByZWFkZXIgPSBjb250cm9sbGVyLl9jb250cm9sbGVkUmVhZGFibGVCeXRlU3RyZWFtLl9yZWFkZXI7XG4gIGFzc2VydChJc1JlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcihyZWFkZXIpKTtcbiAgd2hpbGUgKHJlYWRlci5fcmVhZFJlcXVlc3RzLmxlbmd0aCA+IDApIHtcbiAgICBpZiAoY29udHJvbGxlci5fcXVldWVUb3RhbFNpemUgPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgcmVhZFJlcXVlc3QgPSByZWFkZXIuX3JlYWRSZXF1ZXN0cy5zaGlmdCgpO1xuICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJGaWxsUmVhZFJlcXVlc3RGcm9tUXVldWUoY29udHJvbGxlciwgcmVhZFJlcXVlc3QpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyUHVsbEludG88VCBleHRlbmRzIE5vblNoYXJlZDxBcnJheUJ1ZmZlclZpZXc+PihcbiAgY29udHJvbGxlcjogUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcixcbiAgdmlldzogVCxcbiAgbWluOiBudW1iZXIsXG4gIHJlYWRJbnRvUmVxdWVzdDogUmVhZEludG9SZXF1ZXN0PFQ+XG4pOiB2b2lkIHtcbiAgY29uc3Qgc3RyZWFtID0gY29udHJvbGxlci5fY29udHJvbGxlZFJlYWRhYmxlQnl0ZVN0cmVhbTtcblxuICBjb25zdCBjdG9yID0gdmlldy5jb25zdHJ1Y3RvciBhcyBBcnJheUJ1ZmZlclZpZXdDb25zdHJ1Y3RvcjxUPjtcbiAgY29uc3QgZWxlbWVudFNpemUgPSBhcnJheUJ1ZmZlclZpZXdFbGVtZW50U2l6ZShjdG9yKTtcblxuICBjb25zdCB7IGJ5dGVPZmZzZXQsIGJ5dGVMZW5ndGggfSA9IHZpZXc7XG5cbiAgY29uc3QgbWluaW11bUZpbGwgPSBtaW4gKiBlbGVtZW50U2l6ZTtcbiAgYXNzZXJ0KG1pbmltdW1GaWxsID49IGVsZW1lbnRTaXplICYmIG1pbmltdW1GaWxsIDw9IGJ5dGVMZW5ndGgpO1xuICBhc3NlcnQobWluaW11bUZpbGwgJSBlbGVtZW50U2l6ZSA9PT0gMCk7XG5cbiAgbGV0IGJ1ZmZlcjogQXJyYXlCdWZmZXI7XG4gIHRyeSB7XG4gICAgYnVmZmVyID0gVHJhbnNmZXJBcnJheUJ1ZmZlcih2aWV3LmJ1ZmZlcik7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZWFkSW50b1JlcXVlc3QuX2Vycm9yU3RlcHMoZSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgcHVsbEludG9EZXNjcmlwdG9yOiBCWU9CUHVsbEludG9EZXNjcmlwdG9yPFQ+ID0ge1xuICAgIGJ1ZmZlcixcbiAgICBidWZmZXJCeXRlTGVuZ3RoOiBidWZmZXIuYnl0ZUxlbmd0aCxcbiAgICBieXRlT2Zmc2V0LFxuICAgIGJ5dGVMZW5ndGgsXG4gICAgYnl0ZXNGaWxsZWQ6IDAsXG4gICAgbWluaW11bUZpbGwsXG4gICAgZWxlbWVudFNpemUsXG4gICAgdmlld0NvbnN0cnVjdG9yOiBjdG9yLFxuICAgIHJlYWRlclR5cGU6ICdieW9iJ1xuICB9O1xuXG4gIGlmIChjb250cm9sbGVyLl9wZW5kaW5nUHVsbEludG9zLmxlbmd0aCA+IDApIHtcbiAgICBjb250cm9sbGVyLl9wZW5kaW5nUHVsbEludG9zLnB1c2gocHVsbEludG9EZXNjcmlwdG9yKTtcblxuICAgIC8vIE5vIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJDYWxsUHVsbElmTmVlZGVkKCkgY2FsbCBzaW5jZTpcbiAgICAvLyAtIE5vIGNoYW5nZSBoYXBwZW5zIG9uIGRlc2lyZWRTaXplXG4gICAgLy8gLSBUaGUgc291cmNlIGhhcyBhbHJlYWR5IGJlZW4gbm90aWZpZWQgb2YgdGhhdCB0aGVyZSdzIGF0IGxlYXN0IDEgcGVuZGluZyByZWFkKHZpZXcpXG5cbiAgICBSZWFkYWJsZVN0cmVhbUFkZFJlYWRJbnRvUmVxdWVzdChzdHJlYW0sIHJlYWRJbnRvUmVxdWVzdCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKHN0cmVhbS5fc3RhdGUgPT09ICdjbG9zZWQnKSB7XG4gICAgY29uc3QgZW1wdHlWaWV3ID0gbmV3IGN0b3IocHVsbEludG9EZXNjcmlwdG9yLmJ1ZmZlciwgcHVsbEludG9EZXNjcmlwdG9yLmJ5dGVPZmZzZXQsIDApO1xuICAgIHJlYWRJbnRvUmVxdWVzdC5fY2xvc2VTdGVwcyhlbXB0eVZpZXcpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChjb250cm9sbGVyLl9xdWV1ZVRvdGFsU2l6ZSA+IDApIHtcbiAgICBpZiAoUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckZpbGxQdWxsSW50b0Rlc2NyaXB0b3JGcm9tUXVldWUoY29udHJvbGxlciwgcHVsbEludG9EZXNjcmlwdG9yKSkge1xuICAgICAgY29uc3QgZmlsbGVkVmlldyA9IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJDb252ZXJ0UHVsbEludG9EZXNjcmlwdG9yPFQ+KHB1bGxJbnRvRGVzY3JpcHRvcik7XG5cbiAgICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJIYW5kbGVRdWV1ZURyYWluKGNvbnRyb2xsZXIpO1xuXG4gICAgICByZWFkSW50b1JlcXVlc3QuX2NodW5rU3RlcHMoZmlsbGVkVmlldyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGNvbnRyb2xsZXIuX2Nsb3NlUmVxdWVzdGVkKSB7XG4gICAgICBjb25zdCBlID0gbmV3IFR5cGVFcnJvcignSW5zdWZmaWNpZW50IGJ5dGVzIHRvIGZpbGwgZWxlbWVudHMgaW4gdGhlIGdpdmVuIGJ1ZmZlcicpO1xuICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVycm9yKGNvbnRyb2xsZXIsIGUpO1xuXG4gICAgICByZWFkSW50b1JlcXVlc3QuX2Vycm9yU3RlcHMoZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgY29udHJvbGxlci5fcGVuZGluZ1B1bGxJbnRvcy5wdXNoKHB1bGxJbnRvRGVzY3JpcHRvcik7XG5cbiAgUmVhZGFibGVTdHJlYW1BZGRSZWFkSW50b1JlcXVlc3Q8VD4oc3RyZWFtLCByZWFkSW50b1JlcXVlc3QpO1xuICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyQ2FsbFB1bGxJZk5lZWRlZChjb250cm9sbGVyKTtcbn1cblxuZnVuY3Rpb24gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclJlc3BvbmRJbkNsb3NlZFN0YXRlKGNvbnRyb2xsZXI6IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3REZXNjcmlwdG9yOiBQdWxsSW50b0Rlc2NyaXB0b3IpIHtcbiAgYXNzZXJ0KGZpcnN0RGVzY3JpcHRvci5ieXRlc0ZpbGxlZCAlIGZpcnN0RGVzY3JpcHRvci5lbGVtZW50U2l6ZSA9PT0gMCk7XG5cbiAgaWYgKGZpcnN0RGVzY3JpcHRvci5yZWFkZXJUeXBlID09PSAnbm9uZScpIHtcbiAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyU2hpZnRQZW5kaW5nUHVsbEludG8oY29udHJvbGxlcik7XG4gIH1cblxuICBjb25zdCBzdHJlYW0gPSBjb250cm9sbGVyLl9jb250cm9sbGVkUmVhZGFibGVCeXRlU3RyZWFtO1xuICBpZiAoUmVhZGFibGVTdHJlYW1IYXNCWU9CUmVhZGVyKHN0cmVhbSkpIHtcbiAgICB3aGlsZSAoUmVhZGFibGVTdHJlYW1HZXROdW1SZWFkSW50b1JlcXVlc3RzKHN0cmVhbSkgPiAwKSB7XG4gICAgICBjb25zdCBwdWxsSW50b0Rlc2NyaXB0b3IgPSBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyU2hpZnRQZW5kaW5nUHVsbEludG8oY29udHJvbGxlcik7XG4gICAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyQ29tbWl0UHVsbEludG9EZXNjcmlwdG9yKHN0cmVhbSwgcHVsbEludG9EZXNjcmlwdG9yKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclJlc3BvbmRJblJlYWRhYmxlU3RhdGUoY29udHJvbGxlcjogUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ5dGVzV3JpdHRlbjogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHVsbEludG9EZXNjcmlwdG9yOiBQdWxsSW50b0Rlc2NyaXB0b3IpIHtcbiAgYXNzZXJ0KHB1bGxJbnRvRGVzY3JpcHRvci5ieXRlc0ZpbGxlZCArIGJ5dGVzV3JpdHRlbiA8PSBwdWxsSW50b0Rlc2NyaXB0b3IuYnl0ZUxlbmd0aCk7XG5cbiAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckZpbGxIZWFkUHVsbEludG9EZXNjcmlwdG9yKGNvbnRyb2xsZXIsIGJ5dGVzV3JpdHRlbiwgcHVsbEludG9EZXNjcmlwdG9yKTtcblxuICBpZiAocHVsbEludG9EZXNjcmlwdG9yLnJlYWRlclR5cGUgPT09ICdub25lJykge1xuICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJFbnF1ZXVlRGV0YWNoZWRQdWxsSW50b1RvUXVldWUoY29udHJvbGxlciwgcHVsbEludG9EZXNjcmlwdG9yKTtcbiAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyUHJvY2Vzc1B1bGxJbnRvRGVzY3JpcHRvcnNVc2luZ1F1ZXVlKGNvbnRyb2xsZXIpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChwdWxsSW50b0Rlc2NyaXB0b3IuYnl0ZXNGaWxsZWQgPCBwdWxsSW50b0Rlc2NyaXB0b3IubWluaW11bUZpbGwpIHtcbiAgICAvLyBBIGRlc2NyaXB0b3IgZm9yIGEgcmVhZCgpIHJlcXVlc3QgdGhhdCBpcyBub3QgeWV0IGZpbGxlZCB1cCB0byBpdHMgbWluaW11bSBsZW5ndGggd2lsbCBzdGF5IGF0IHRoZSBoZWFkXG4gICAgLy8gb2YgdGhlIHF1ZXVlLCBzbyB0aGUgdW5kZXJseWluZyBzb3VyY2UgY2FuIGtlZXAgZmlsbGluZyBpdC5cbiAgICByZXR1cm47XG4gIH1cblxuICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyU2hpZnRQZW5kaW5nUHVsbEludG8oY29udHJvbGxlcik7XG5cbiAgY29uc3QgcmVtYWluZGVyU2l6ZSA9IHB1bGxJbnRvRGVzY3JpcHRvci5ieXRlc0ZpbGxlZCAlIHB1bGxJbnRvRGVzY3JpcHRvci5lbGVtZW50U2l6ZTtcbiAgaWYgKHJlbWFpbmRlclNpemUgPiAwKSB7XG4gICAgY29uc3QgZW5kID0gcHVsbEludG9EZXNjcmlwdG9yLmJ5dGVPZmZzZXQgKyBwdWxsSW50b0Rlc2NyaXB0b3IuYnl0ZXNGaWxsZWQ7XG4gICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVucXVldWVDbG9uZWRDaHVua1RvUXVldWUoXG4gICAgICBjb250cm9sbGVyLFxuICAgICAgcHVsbEludG9EZXNjcmlwdG9yLmJ1ZmZlcixcbiAgICAgIGVuZCAtIHJlbWFpbmRlclNpemUsXG4gICAgICByZW1haW5kZXJTaXplXG4gICAgKTtcbiAgfVxuXG4gIHB1bGxJbnRvRGVzY3JpcHRvci5ieXRlc0ZpbGxlZCAtPSByZW1haW5kZXJTaXplO1xuICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyQ29tbWl0UHVsbEludG9EZXNjcmlwdG9yKGNvbnRyb2xsZXIuX2NvbnRyb2xsZWRSZWFkYWJsZUJ5dGVTdHJlYW0sIHB1bGxJbnRvRGVzY3JpcHRvcik7XG5cbiAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclByb2Nlc3NQdWxsSW50b0Rlc2NyaXB0b3JzVXNpbmdRdWV1ZShjb250cm9sbGVyKTtcbn1cblxuZnVuY3Rpb24gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclJlc3BvbmRJbnRlcm5hbChjb250cm9sbGVyOiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyLCBieXRlc1dyaXR0ZW46IG51bWJlcikge1xuICBjb25zdCBmaXJzdERlc2NyaXB0b3IgPSBjb250cm9sbGVyLl9wZW5kaW5nUHVsbEludG9zLnBlZWsoKTtcbiAgYXNzZXJ0KENhblRyYW5zZmVyQXJyYXlCdWZmZXIoZmlyc3REZXNjcmlwdG9yLmJ1ZmZlcikpO1xuXG4gIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJJbnZhbGlkYXRlQllPQlJlcXVlc3QoY29udHJvbGxlcik7XG5cbiAgY29uc3Qgc3RhdGUgPSBjb250cm9sbGVyLl9jb250cm9sbGVkUmVhZGFibGVCeXRlU3RyZWFtLl9zdGF0ZTtcbiAgaWYgKHN0YXRlID09PSAnY2xvc2VkJykge1xuICAgIGFzc2VydChieXRlc1dyaXR0ZW4gPT09IDApO1xuICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJSZXNwb25kSW5DbG9zZWRTdGF0ZShjb250cm9sbGVyLCBmaXJzdERlc2NyaXB0b3IpO1xuICB9IGVsc2Uge1xuICAgIGFzc2VydChzdGF0ZSA9PT0gJ3JlYWRhYmxlJyk7XG4gICAgYXNzZXJ0KGJ5dGVzV3JpdHRlbiA+IDApO1xuICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJSZXNwb25kSW5SZWFkYWJsZVN0YXRlKGNvbnRyb2xsZXIsIGJ5dGVzV3JpdHRlbiwgZmlyc3REZXNjcmlwdG9yKTtcbiAgfVxuXG4gIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJDYWxsUHVsbElmTmVlZGVkKGNvbnRyb2xsZXIpO1xufVxuXG5mdW5jdGlvbiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyU2hpZnRQZW5kaW5nUHVsbEludG8oXG4gIGNvbnRyb2xsZXI6IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJcbik6IFB1bGxJbnRvRGVzY3JpcHRvciB7XG4gIGFzc2VydChjb250cm9sbGVyLl9ieW9iUmVxdWVzdCA9PT0gbnVsbCk7XG4gIGNvbnN0IGRlc2NyaXB0b3IgPSBjb250cm9sbGVyLl9wZW5kaW5nUHVsbEludG9zLnNoaWZ0KCkhO1xuICByZXR1cm4gZGVzY3JpcHRvcjtcbn1cblxuZnVuY3Rpb24gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclNob3VsZENhbGxQdWxsKGNvbnRyb2xsZXI6IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIpOiBib29sZWFuIHtcbiAgY29uc3Qgc3RyZWFtID0gY29udHJvbGxlci5fY29udHJvbGxlZFJlYWRhYmxlQnl0ZVN0cmVhbTtcblxuICBpZiAoc3RyZWFtLl9zdGF0ZSAhPT0gJ3JlYWRhYmxlJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChjb250cm9sbGVyLl9jbG9zZVJlcXVlc3RlZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICghY29udHJvbGxlci5fc3RhcnRlZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChSZWFkYWJsZVN0cmVhbUhhc0RlZmF1bHRSZWFkZXIoc3RyZWFtKSAmJiBSZWFkYWJsZVN0cmVhbUdldE51bVJlYWRSZXF1ZXN0cyhzdHJlYW0pID4gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKFJlYWRhYmxlU3RyZWFtSGFzQllPQlJlYWRlcihzdHJlYW0pICYmIFJlYWRhYmxlU3RyZWFtR2V0TnVtUmVhZEludG9SZXF1ZXN0cyhzdHJlYW0pID4gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgY29uc3QgZGVzaXJlZFNpemUgPSBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyR2V0RGVzaXJlZFNpemUoY29udHJvbGxlcik7XG4gIGFzc2VydChkZXNpcmVkU2l6ZSAhPT0gbnVsbCk7XG4gIGlmIChkZXNpcmVkU2l6ZSEgPiAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJDbGVhckFsZ29yaXRobXMoY29udHJvbGxlcjogUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcikge1xuICBjb250cm9sbGVyLl9wdWxsQWxnb3JpdGhtID0gdW5kZWZpbmVkITtcbiAgY29udHJvbGxlci5fY2FuY2VsQWxnb3JpdGhtID0gdW5kZWZpbmVkITtcbn1cblxuLy8gQSBjbGllbnQgb2YgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlciBtYXkgdXNlIHRoZXNlIGZ1bmN0aW9ucyBkaXJlY3RseSB0byBieXBhc3Mgc3RhdGUgY2hlY2suXG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyQ2xvc2UoY29udHJvbGxlcjogUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcikge1xuICBjb25zdCBzdHJlYW0gPSBjb250cm9sbGVyLl9jb250cm9sbGVkUmVhZGFibGVCeXRlU3RyZWFtO1xuXG4gIGlmIChjb250cm9sbGVyLl9jbG9zZVJlcXVlc3RlZCB8fCBzdHJlYW0uX3N0YXRlICE9PSAncmVhZGFibGUnKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGNvbnRyb2xsZXIuX3F1ZXVlVG90YWxTaXplID4gMCkge1xuICAgIGNvbnRyb2xsZXIuX2Nsb3NlUmVxdWVzdGVkID0gdHJ1ZTtcblxuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChjb250cm9sbGVyLl9wZW5kaW5nUHVsbEludG9zLmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCBmaXJzdFBlbmRpbmdQdWxsSW50byA9IGNvbnRyb2xsZXIuX3BlbmRpbmdQdWxsSW50b3MucGVlaygpO1xuICAgIGlmIChmaXJzdFBlbmRpbmdQdWxsSW50by5ieXRlc0ZpbGxlZCAlIGZpcnN0UGVuZGluZ1B1bGxJbnRvLmVsZW1lbnRTaXplICE9PSAwKSB7XG4gICAgICBjb25zdCBlID0gbmV3IFR5cGVFcnJvcignSW5zdWZmaWNpZW50IGJ5dGVzIHRvIGZpbGwgZWxlbWVudHMgaW4gdGhlIGdpdmVuIGJ1ZmZlcicpO1xuICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVycm9yKGNvbnRyb2xsZXIsIGUpO1xuXG4gICAgICB0aHJvdyBlO1xuICAgIH1cbiAgfVxuXG4gIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJDbGVhckFsZ29yaXRobXMoY29udHJvbGxlcik7XG4gIFJlYWRhYmxlU3RyZWFtQ2xvc2Uoc3RyZWFtKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJFbnF1ZXVlKFxuICBjb250cm9sbGVyOiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyLFxuICBjaHVuazogTm9uU2hhcmVkPEFycmF5QnVmZmVyVmlldz5cbikge1xuICBjb25zdCBzdHJlYW0gPSBjb250cm9sbGVyLl9jb250cm9sbGVkUmVhZGFibGVCeXRlU3RyZWFtO1xuXG4gIGlmIChjb250cm9sbGVyLl9jbG9zZVJlcXVlc3RlZCB8fCBzdHJlYW0uX3N0YXRlICE9PSAncmVhZGFibGUnKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgeyBidWZmZXIsIGJ5dGVPZmZzZXQsIGJ5dGVMZW5ndGggfSA9IGNodW5rO1xuICBpZiAoSXNEZXRhY2hlZEJ1ZmZlcihidWZmZXIpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignY2h1bmtcXCdzIGJ1ZmZlciBpcyBkZXRhY2hlZCBhbmQgc28gY2Fubm90IGJlIGVucXVldWVkJyk7XG4gIH1cbiAgY29uc3QgdHJhbnNmZXJyZWRCdWZmZXIgPSBUcmFuc2ZlckFycmF5QnVmZmVyKGJ1ZmZlcik7XG5cbiAgaWYgKGNvbnRyb2xsZXIuX3BlbmRpbmdQdWxsSW50b3MubGVuZ3RoID4gMCkge1xuICAgIGNvbnN0IGZpcnN0UGVuZGluZ1B1bGxJbnRvID0gY29udHJvbGxlci5fcGVuZGluZ1B1bGxJbnRvcy5wZWVrKCk7XG4gICAgaWYgKElzRGV0YWNoZWRCdWZmZXIoZmlyc3RQZW5kaW5nUHVsbEludG8uYnVmZmVyKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgJ1RoZSBCWU9CIHJlcXVlc3RcXCdzIGJ1ZmZlciBoYXMgYmVlbiBkZXRhY2hlZCBhbmQgc28gY2Fubm90IGJlIGZpbGxlZCB3aXRoIGFuIGVucXVldWVkIGNodW5rJ1xuICAgICAgKTtcbiAgICB9XG4gICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckludmFsaWRhdGVCWU9CUmVxdWVzdChjb250cm9sbGVyKTtcbiAgICBmaXJzdFBlbmRpbmdQdWxsSW50by5idWZmZXIgPSBUcmFuc2ZlckFycmF5QnVmZmVyKGZpcnN0UGVuZGluZ1B1bGxJbnRvLmJ1ZmZlcik7XG4gICAgaWYgKGZpcnN0UGVuZGluZ1B1bGxJbnRvLnJlYWRlclR5cGUgPT09ICdub25lJykge1xuICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVucXVldWVEZXRhY2hlZFB1bGxJbnRvVG9RdWV1ZShjb250cm9sbGVyLCBmaXJzdFBlbmRpbmdQdWxsSW50byk7XG4gICAgfVxuICB9XG5cbiAgaWYgKFJlYWRhYmxlU3RyZWFtSGFzRGVmYXVsdFJlYWRlcihzdHJlYW0pKSB7XG4gICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclByb2Nlc3NSZWFkUmVxdWVzdHNVc2luZ1F1ZXVlKGNvbnRyb2xsZXIpO1xuICAgIGlmIChSZWFkYWJsZVN0cmVhbUdldE51bVJlYWRSZXF1ZXN0cyhzdHJlYW0pID09PSAwKSB7XG4gICAgICBhc3NlcnQoY29udHJvbGxlci5fcGVuZGluZ1B1bGxJbnRvcy5sZW5ndGggPT09IDApO1xuICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVucXVldWVDaHVua1RvUXVldWUoY29udHJvbGxlciwgdHJhbnNmZXJyZWRCdWZmZXIsIGJ5dGVPZmZzZXQsIGJ5dGVMZW5ndGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhc3NlcnQoY29udHJvbGxlci5fcXVldWUubGVuZ3RoID09PSAwKTtcbiAgICAgIGlmIChjb250cm9sbGVyLl9wZW5kaW5nUHVsbEludG9zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYXNzZXJ0KGNvbnRyb2xsZXIuX3BlbmRpbmdQdWxsSW50b3MucGVlaygpLnJlYWRlclR5cGUgPT09ICdkZWZhdWx0Jyk7XG4gICAgICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJTaGlmdFBlbmRpbmdQdWxsSW50byhjb250cm9sbGVyKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHRyYW5zZmVycmVkVmlldyA9IG5ldyBVaW50OEFycmF5KHRyYW5zZmVycmVkQnVmZmVyLCBieXRlT2Zmc2V0LCBieXRlTGVuZ3RoKTtcbiAgICAgIFJlYWRhYmxlU3RyZWFtRnVsZmlsbFJlYWRSZXF1ZXN0KHN0cmVhbSwgdHJhbnNmZXJyZWRWaWV3IGFzIE5vblNoYXJlZDxVaW50OEFycmF5PiwgZmFsc2UpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChSZWFkYWJsZVN0cmVhbUhhc0JZT0JSZWFkZXIoc3RyZWFtKSkge1xuICAgIC8vIFRPRE86IElkZWFsbHkgaW4gdGhpcyBicmFuY2ggZGV0YWNoaW5nIHNob3VsZCBoYXBwZW4gb25seSBpZiB0aGUgYnVmZmVyIGlzIG5vdCBjb25zdW1lZCBmdWxseS5cbiAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRW5xdWV1ZUNodW5rVG9RdWV1ZShjb250cm9sbGVyLCB0cmFuc2ZlcnJlZEJ1ZmZlciwgYnl0ZU9mZnNldCwgYnl0ZUxlbmd0aCk7XG4gICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclByb2Nlc3NQdWxsSW50b0Rlc2NyaXB0b3JzVXNpbmdRdWV1ZShjb250cm9sbGVyKTtcbiAgfSBlbHNlIHtcbiAgICBhc3NlcnQoIUlzUmVhZGFibGVTdHJlYW1Mb2NrZWQoc3RyZWFtKSk7XG4gICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVucXVldWVDaHVua1RvUXVldWUoY29udHJvbGxlciwgdHJhbnNmZXJyZWRCdWZmZXIsIGJ5dGVPZmZzZXQsIGJ5dGVMZW5ndGgpO1xuICB9XG5cbiAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckNhbGxQdWxsSWZOZWVkZWQoY29udHJvbGxlcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRXJyb3IoY29udHJvbGxlcjogUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlciwgZTogYW55KSB7XG4gIGNvbnN0IHN0cmVhbSA9IGNvbnRyb2xsZXIuX2NvbnRyb2xsZWRSZWFkYWJsZUJ5dGVTdHJlYW07XG5cbiAgaWYgKHN0cmVhbS5fc3RhdGUgIT09ICdyZWFkYWJsZScpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyQ2xlYXJQZW5kaW5nUHVsbEludG9zKGNvbnRyb2xsZXIpO1xuXG4gIFJlc2V0UXVldWUoY29udHJvbGxlcik7XG4gIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJDbGVhckFsZ29yaXRobXMoY29udHJvbGxlcik7XG4gIFJlYWRhYmxlU3RyZWFtRXJyb3Ioc3RyZWFtLCBlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJGaWxsUmVhZFJlcXVlc3RGcm9tUXVldWUoXG4gIGNvbnRyb2xsZXI6IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIsXG4gIHJlYWRSZXF1ZXN0OiBSZWFkUmVxdWVzdDxOb25TaGFyZWQ8VWludDhBcnJheT4+XG4pIHtcbiAgYXNzZXJ0KGNvbnRyb2xsZXIuX3F1ZXVlVG90YWxTaXplID4gMCk7XG5cbiAgY29uc3QgZW50cnkgPSBjb250cm9sbGVyLl9xdWV1ZS5zaGlmdCgpO1xuICBjb250cm9sbGVyLl9xdWV1ZVRvdGFsU2l6ZSAtPSBlbnRyeS5ieXRlTGVuZ3RoO1xuXG4gIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJIYW5kbGVRdWV1ZURyYWluKGNvbnRyb2xsZXIpO1xuXG4gIGNvbnN0IHZpZXcgPSBuZXcgVWludDhBcnJheShlbnRyeS5idWZmZXIsIGVudHJ5LmJ5dGVPZmZzZXQsIGVudHJ5LmJ5dGVMZW5ndGgpO1xuICByZWFkUmVxdWVzdC5fY2h1bmtTdGVwcyh2aWV3IGFzIE5vblNoYXJlZDxVaW50OEFycmF5Pik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyR2V0QllPQlJlcXVlc3QoXG4gIGNvbnRyb2xsZXI6IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJcbik6IFJlYWRhYmxlU3RyZWFtQllPQlJlcXVlc3QgfCBudWxsIHtcbiAgaWYgKGNvbnRyb2xsZXIuX2J5b2JSZXF1ZXN0ID09PSBudWxsICYmIGNvbnRyb2xsZXIuX3BlbmRpbmdQdWxsSW50b3MubGVuZ3RoID4gMCkge1xuICAgIGNvbnN0IGZpcnN0RGVzY3JpcHRvciA9IGNvbnRyb2xsZXIuX3BlbmRpbmdQdWxsSW50b3MucGVlaygpO1xuICAgIGNvbnN0IHZpZXcgPSBuZXcgVWludDhBcnJheShmaXJzdERlc2NyaXB0b3IuYnVmZmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaXJzdERlc2NyaXB0b3IuYnl0ZU9mZnNldCArIGZpcnN0RGVzY3JpcHRvci5ieXRlc0ZpbGxlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3REZXNjcmlwdG9yLmJ5dGVMZW5ndGggLSBmaXJzdERlc2NyaXB0b3IuYnl0ZXNGaWxsZWQpO1xuXG4gICAgY29uc3QgYnlvYlJlcXVlc3Q6IFJlYWRhYmxlU3RyZWFtQllPQlJlcXVlc3QgPSBPYmplY3QuY3JlYXRlKFJlYWRhYmxlU3RyZWFtQllPQlJlcXVlc3QucHJvdG90eXBlKTtcbiAgICBTZXRVcFJlYWRhYmxlU3RyZWFtQllPQlJlcXVlc3QoYnlvYlJlcXVlc3QsIGNvbnRyb2xsZXIsIHZpZXcgYXMgTm9uU2hhcmVkPFVpbnQ4QXJyYXk+KTtcbiAgICBjb250cm9sbGVyLl9ieW9iUmVxdWVzdCA9IGJ5b2JSZXF1ZXN0O1xuICB9XG4gIHJldHVybiBjb250cm9sbGVyLl9ieW9iUmVxdWVzdDtcbn1cblxuZnVuY3Rpb24gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckdldERlc2lyZWRTaXplKGNvbnRyb2xsZXI6IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIpOiBudW1iZXIgfCBudWxsIHtcbiAgY29uc3Qgc3RhdGUgPSBjb250cm9sbGVyLl9jb250cm9sbGVkUmVhZGFibGVCeXRlU3RyZWFtLl9zdGF0ZTtcblxuICBpZiAoc3RhdGUgPT09ICdlcnJvcmVkJykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGlmIChzdGF0ZSA9PT0gJ2Nsb3NlZCcpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIHJldHVybiBjb250cm9sbGVyLl9zdHJhdGVneUhXTSAtIGNvbnRyb2xsZXIuX3F1ZXVlVG90YWxTaXplO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclJlc3BvbmQoY29udHJvbGxlcjogUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlciwgYnl0ZXNXcml0dGVuOiBudW1iZXIpIHtcbiAgYXNzZXJ0KGNvbnRyb2xsZXIuX3BlbmRpbmdQdWxsSW50b3MubGVuZ3RoID4gMCk7XG5cbiAgY29uc3QgZmlyc3REZXNjcmlwdG9yID0gY29udHJvbGxlci5fcGVuZGluZ1B1bGxJbnRvcy5wZWVrKCk7XG4gIGNvbnN0IHN0YXRlID0gY29udHJvbGxlci5fY29udHJvbGxlZFJlYWRhYmxlQnl0ZVN0cmVhbS5fc3RhdGU7XG5cbiAgaWYgKHN0YXRlID09PSAnY2xvc2VkJykge1xuICAgIGlmIChieXRlc1dyaXR0ZW4gIT09IDApIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2J5dGVzV3JpdHRlbiBtdXN0IGJlIDAgd2hlbiBjYWxsaW5nIHJlc3BvbmQoKSBvbiBhIGNsb3NlZCBzdHJlYW0nKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgYXNzZXJ0KHN0YXRlID09PSAncmVhZGFibGUnKTtcbiAgICBpZiAoYnl0ZXNXcml0dGVuID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdieXRlc1dyaXR0ZW4gbXVzdCBiZSBncmVhdGVyIHRoYW4gMCB3aGVuIGNhbGxpbmcgcmVzcG9uZCgpIG9uIGEgcmVhZGFibGUgc3RyZWFtJyk7XG4gICAgfVxuICAgIGlmIChmaXJzdERlc2NyaXB0b3IuYnl0ZXNGaWxsZWQgKyBieXRlc1dyaXR0ZW4gPiBmaXJzdERlc2NyaXB0b3IuYnl0ZUxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ2J5dGVzV3JpdHRlbiBvdXQgb2YgcmFuZ2UnKTtcbiAgICB9XG4gIH1cblxuICBmaXJzdERlc2NyaXB0b3IuYnVmZmVyID0gVHJhbnNmZXJBcnJheUJ1ZmZlcihmaXJzdERlc2NyaXB0b3IuYnVmZmVyKTtcblxuICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyUmVzcG9uZEludGVybmFsKGNvbnRyb2xsZXIsIGJ5dGVzV3JpdHRlbik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyUmVzcG9uZFdpdGhOZXdWaWV3KGNvbnRyb2xsZXI6IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aWV3OiBOb25TaGFyZWQ8QXJyYXlCdWZmZXJWaWV3Pikge1xuICBhc3NlcnQoY29udHJvbGxlci5fcGVuZGluZ1B1bGxJbnRvcy5sZW5ndGggPiAwKTtcbiAgYXNzZXJ0KCFJc0RldGFjaGVkQnVmZmVyKHZpZXcuYnVmZmVyKSk7XG5cbiAgY29uc3QgZmlyc3REZXNjcmlwdG9yID0gY29udHJvbGxlci5fcGVuZGluZ1B1bGxJbnRvcy5wZWVrKCk7XG4gIGNvbnN0IHN0YXRlID0gY29udHJvbGxlci5fY29udHJvbGxlZFJlYWRhYmxlQnl0ZVN0cmVhbS5fc3RhdGU7XG5cbiAgaWYgKHN0YXRlID09PSAnY2xvc2VkJykge1xuICAgIGlmICh2aWV3LmJ5dGVMZW5ndGggIT09IDApIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSB2aWV3XFwncyBsZW5ndGggbXVzdCBiZSAwIHdoZW4gY2FsbGluZyByZXNwb25kV2l0aE5ld1ZpZXcoKSBvbiBhIGNsb3NlZCBzdHJlYW0nKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgYXNzZXJ0KHN0YXRlID09PSAncmVhZGFibGUnKTtcbiAgICBpZiAodmlldy5ieXRlTGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICAnVGhlIHZpZXdcXCdzIGxlbmd0aCBtdXN0IGJlIGdyZWF0ZXIgdGhhbiAwIHdoZW4gY2FsbGluZyByZXNwb25kV2l0aE5ld1ZpZXcoKSBvbiBhIHJlYWRhYmxlIHN0cmVhbSdcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgaWYgKGZpcnN0RGVzY3JpcHRvci5ieXRlT2Zmc2V0ICsgZmlyc3REZXNjcmlwdG9yLmJ5dGVzRmlsbGVkICE9PSB2aWV3LmJ5dGVPZmZzZXQpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVGhlIHJlZ2lvbiBzcGVjaWZpZWQgYnkgdmlldyBkb2VzIG5vdCBtYXRjaCBieW9iUmVxdWVzdCcpO1xuICB9XG4gIGlmIChmaXJzdERlc2NyaXB0b3IuYnVmZmVyQnl0ZUxlbmd0aCAhPT0gdmlldy5idWZmZXIuYnl0ZUxlbmd0aCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdUaGUgYnVmZmVyIG9mIHZpZXcgaGFzIGRpZmZlcmVudCBjYXBhY2l0eSB0aGFuIGJ5b2JSZXF1ZXN0Jyk7XG4gIH1cbiAgaWYgKGZpcnN0RGVzY3JpcHRvci5ieXRlc0ZpbGxlZCArIHZpZXcuYnl0ZUxlbmd0aCA+IGZpcnN0RGVzY3JpcHRvci5ieXRlTGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RoZSByZWdpb24gc3BlY2lmaWVkIGJ5IHZpZXcgaXMgbGFyZ2VyIHRoYW4gYnlvYlJlcXVlc3QnKTtcbiAgfVxuXG4gIGNvbnN0IHZpZXdCeXRlTGVuZ3RoID0gdmlldy5ieXRlTGVuZ3RoO1xuICBmaXJzdERlc2NyaXB0b3IuYnVmZmVyID0gVHJhbnNmZXJBcnJheUJ1ZmZlcih2aWV3LmJ1ZmZlcik7XG4gIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJSZXNwb25kSW50ZXJuYWwoY29udHJvbGxlciwgdmlld0J5dGVMZW5ndGgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gU2V0VXBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyKHN0cmVhbTogUmVhZGFibGVCeXRlU3RyZWFtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydEFsZ29yaXRobTogKCkgPT4gdm9pZCB8IFByb21pc2VMaWtlPHZvaWQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwdWxsQWxnb3JpdGhtOiAoKSA9PiBQcm9taXNlPHZvaWQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5jZWxBbGdvcml0aG06IChyZWFzb246IGFueSkgPT4gUHJvbWlzZTx2b2lkPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGlnaFdhdGVyTWFyazogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdXRvQWxsb2NhdGVDaHVua1NpemU6IG51bWJlciB8IHVuZGVmaW5lZCkge1xuICBhc3NlcnQoc3RyZWFtLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIgPT09IHVuZGVmaW5lZCk7XG4gIGlmIChhdXRvQWxsb2NhdGVDaHVua1NpemUgIT09IHVuZGVmaW5lZCkge1xuICAgIGFzc2VydChOdW1iZXJJc0ludGVnZXIoYXV0b0FsbG9jYXRlQ2h1bmtTaXplKSk7XG4gICAgYXNzZXJ0KGF1dG9BbGxvY2F0ZUNodW5rU2l6ZSA+IDApO1xuICB9XG5cbiAgY29udHJvbGxlci5fY29udHJvbGxlZFJlYWRhYmxlQnl0ZVN0cmVhbSA9IHN0cmVhbTtcblxuICBjb250cm9sbGVyLl9wdWxsQWdhaW4gPSBmYWxzZTtcbiAgY29udHJvbGxlci5fcHVsbGluZyA9IGZhbHNlO1xuXG4gIGNvbnRyb2xsZXIuX2J5b2JSZXF1ZXN0ID0gbnVsbDtcblxuICAvLyBOZWVkIHRvIHNldCB0aGUgc2xvdHMgc28gdGhhdCB0aGUgYXNzZXJ0IGRvZXNuJ3QgZmlyZS4gSW4gdGhlIHNwZWMgdGhlIHNsb3RzIGFscmVhZHkgZXhpc3QgaW1wbGljaXRseS5cbiAgY29udHJvbGxlci5fcXVldWUgPSBjb250cm9sbGVyLl9xdWV1ZVRvdGFsU2l6ZSA9IHVuZGVmaW5lZCE7XG4gIFJlc2V0UXVldWUoY29udHJvbGxlcik7XG5cbiAgY29udHJvbGxlci5fY2xvc2VSZXF1ZXN0ZWQgPSBmYWxzZTtcbiAgY29udHJvbGxlci5fc3RhcnRlZCA9IGZhbHNlO1xuXG4gIGNvbnRyb2xsZXIuX3N0cmF0ZWd5SFdNID0gaGlnaFdhdGVyTWFyaztcblxuICBjb250cm9sbGVyLl9wdWxsQWxnb3JpdGhtID0gcHVsbEFsZ29yaXRobTtcbiAgY29udHJvbGxlci5fY2FuY2VsQWxnb3JpdGhtID0gY2FuY2VsQWxnb3JpdGhtO1xuXG4gIGNvbnRyb2xsZXIuX2F1dG9BbGxvY2F0ZUNodW5rU2l6ZSA9IGF1dG9BbGxvY2F0ZUNodW5rU2l6ZTtcblxuICBjb250cm9sbGVyLl9wZW5kaW5nUHVsbEludG9zID0gbmV3IFNpbXBsZVF1ZXVlKCk7XG5cbiAgc3RyZWFtLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIgPSBjb250cm9sbGVyO1xuXG4gIGNvbnN0IHN0YXJ0UmVzdWx0ID0gc3RhcnRBbGdvcml0aG0oKTtcbiAgdXBvblByb21pc2UoXG4gICAgcHJvbWlzZVJlc29sdmVkV2l0aChzdGFydFJlc3VsdCksXG4gICAgKCkgPT4ge1xuICAgICAgY29udHJvbGxlci5fc3RhcnRlZCA9IHRydWU7XG5cbiAgICAgIGFzc2VydCghY29udHJvbGxlci5fcHVsbGluZyk7XG4gICAgICBhc3NlcnQoIWNvbnRyb2xsZXIuX3B1bGxBZ2Fpbik7XG5cbiAgICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJDYWxsUHVsbElmTmVlZGVkKGNvbnRyb2xsZXIpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcbiAgICByID0+IHtcbiAgICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJFcnJvcihjb250cm9sbGVyLCByKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFNldFVwUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckZyb21VbmRlcmx5aW5nU291cmNlKFxuICBzdHJlYW06IFJlYWRhYmxlQnl0ZVN0cmVhbSxcbiAgdW5kZXJseWluZ0J5dGVTb3VyY2U6IFZhbGlkYXRlZFVuZGVybHlpbmdCeXRlU291cmNlLFxuICBoaWdoV2F0ZXJNYXJrOiBudW1iZXJcbikge1xuICBjb25zdCBjb250cm9sbGVyOiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyID0gT2JqZWN0LmNyZWF0ZShSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyLnByb3RvdHlwZSk7XG5cbiAgbGV0IHN0YXJ0QWxnb3JpdGhtOiAoKSA9PiB2b2lkIHwgUHJvbWlzZUxpa2U8dm9pZD47XG4gIGxldCBwdWxsQWxnb3JpdGhtOiAoKSA9PiBQcm9taXNlPHZvaWQ+O1xuICBsZXQgY2FuY2VsQWxnb3JpdGhtOiAocmVhc29uOiBhbnkpID0+IFByb21pc2U8dm9pZD47XG5cbiAgaWYgKHVuZGVybHlpbmdCeXRlU291cmNlLnN0YXJ0ICE9PSB1bmRlZmluZWQpIHtcbiAgICBzdGFydEFsZ29yaXRobSA9ICgpID0+IHVuZGVybHlpbmdCeXRlU291cmNlLnN0YXJ0IShjb250cm9sbGVyKTtcbiAgfSBlbHNlIHtcbiAgICBzdGFydEFsZ29yaXRobSA9ICgpID0+IHVuZGVmaW5lZDtcbiAgfVxuICBpZiAodW5kZXJseWluZ0J5dGVTb3VyY2UucHVsbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcHVsbEFsZ29yaXRobSA9ICgpID0+IHVuZGVybHlpbmdCeXRlU291cmNlLnB1bGwhKGNvbnRyb2xsZXIpO1xuICB9IGVsc2Uge1xuICAgIHB1bGxBbGdvcml0aG0gPSAoKSA9PiBwcm9taXNlUmVzb2x2ZWRXaXRoKHVuZGVmaW5lZCk7XG4gIH1cbiAgaWYgKHVuZGVybHlpbmdCeXRlU291cmNlLmNhbmNlbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgY2FuY2VsQWxnb3JpdGhtID0gcmVhc29uID0+IHVuZGVybHlpbmdCeXRlU291cmNlLmNhbmNlbCEocmVhc29uKTtcbiAgfSBlbHNlIHtcbiAgICBjYW5jZWxBbGdvcml0aG0gPSAoKSA9PiBwcm9taXNlUmVzb2x2ZWRXaXRoKHVuZGVmaW5lZCk7XG4gIH1cblxuICBjb25zdCBhdXRvQWxsb2NhdGVDaHVua1NpemUgPSB1bmRlcmx5aW5nQnl0ZVNvdXJjZS5hdXRvQWxsb2NhdGVDaHVua1NpemU7XG4gIGlmIChhdXRvQWxsb2NhdGVDaHVua1NpemUgPT09IDApIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdhdXRvQWxsb2NhdGVDaHVua1NpemUgbXVzdCBiZSBncmVhdGVyIHRoYW4gMCcpO1xuICB9XG5cbiAgU2V0VXBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyKFxuICAgIHN0cmVhbSwgY29udHJvbGxlciwgc3RhcnRBbGdvcml0aG0sIHB1bGxBbGdvcml0aG0sIGNhbmNlbEFsZ29yaXRobSwgaGlnaFdhdGVyTWFyaywgYXV0b0FsbG9jYXRlQ2h1bmtTaXplXG4gICk7XG59XG5cbmZ1bmN0aW9uIFNldFVwUmVhZGFibGVTdHJlYW1CWU9CUmVxdWVzdChyZXF1ZXN0OiBSZWFkYWJsZVN0cmVhbUJZT0JSZXF1ZXN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlldzogTm9uU2hhcmVkPEFycmF5QnVmZmVyVmlldz4pIHtcbiAgYXNzZXJ0KElzUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcihjb250cm9sbGVyKSk7XG4gIGFzc2VydCh0eXBlb2YgdmlldyA9PT0gJ29iamVjdCcpO1xuICBhc3NlcnQoQXJyYXlCdWZmZXIuaXNWaWV3KHZpZXcpKTtcbiAgYXNzZXJ0KCFJc0RldGFjaGVkQnVmZmVyKHZpZXcuYnVmZmVyKSk7XG4gIHJlcXVlc3QuX2Fzc29jaWF0ZWRSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyID0gY29udHJvbGxlcjtcbiAgcmVxdWVzdC5fdmlldyA9IHZpZXc7XG59XG5cbi8vIEhlbHBlciBmdW5jdGlvbnMgZm9yIHRoZSBSZWFkYWJsZVN0cmVhbUJZT0JSZXF1ZXN0LlxuXG5mdW5jdGlvbiBieW9iUmVxdWVzdEJyYW5kQ2hlY2tFeGNlcHRpb24obmFtZTogc3RyaW5nKTogVHlwZUVycm9yIHtcbiAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoXG4gICAgYFJlYWRhYmxlU3RyZWFtQllPQlJlcXVlc3QucHJvdG90eXBlLiR7bmFtZX0gY2FuIG9ubHkgYmUgdXNlZCBvbiBhIFJlYWRhYmxlU3RyZWFtQllPQlJlcXVlc3RgKTtcbn1cblxuLy8gSGVscGVyIGZ1bmN0aW9ucyBmb3IgdGhlIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIuXG5cbmZ1bmN0aW9uIGJ5dGVTdHJlYW1Db250cm9sbGVyQnJhbmRDaGVja0V4Y2VwdGlvbihuYW1lOiBzdHJpbmcpOiBUeXBlRXJyb3Ige1xuICByZXR1cm4gbmV3IFR5cGVFcnJvcihcbiAgICBgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlci5wcm90b3R5cGUuJHtuYW1lfSBjYW4gb25seSBiZSB1c2VkIG9uIGEgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcmApO1xufVxuIiwgImltcG9ydCB7IGFzc2VydERpY3Rpb25hcnksIGNvbnZlcnRVbnNpZ25lZExvbmdMb25nV2l0aEVuZm9yY2VSYW5nZSB9IGZyb20gJy4vYmFzaWMnO1xuaW1wb3J0IHR5cGUge1xuICBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXJSZWFkT3B0aW9ucyxcbiAgUmVhZGFibGVTdHJlYW1HZXRSZWFkZXJPcHRpb25zLFxuICBWYWxpZGF0ZWRSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXJSZWFkT3B0aW9uc1xufSBmcm9tICcuLi9yZWFkYWJsZS1zdHJlYW0vcmVhZGVyLW9wdGlvbnMnO1xuXG5leHBvcnQgZnVuY3Rpb24gY29udmVydFJlYWRlck9wdGlvbnMob3B0aW9uczogUmVhZGFibGVTdHJlYW1HZXRSZWFkZXJPcHRpb25zIHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiBzdHJpbmcpOiBSZWFkYWJsZVN0cmVhbUdldFJlYWRlck9wdGlvbnMge1xuICBhc3NlcnREaWN0aW9uYXJ5KG9wdGlvbnMsIGNvbnRleHQpO1xuICBjb25zdCBtb2RlID0gb3B0aW9ucz8ubW9kZTtcbiAgcmV0dXJuIHtcbiAgICBtb2RlOiBtb2RlID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWQgOiBjb252ZXJ0UmVhZGFibGVTdHJlYW1SZWFkZXJNb2RlKG1vZGUsIGAke2NvbnRleHR9IGhhcyBtZW1iZXIgJ21vZGUnIHRoYXRgKVxuICB9O1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0UmVhZGFibGVTdHJlYW1SZWFkZXJNb2RlKG1vZGU6IHN0cmluZywgY29udGV4dDogc3RyaW5nKTogJ2J5b2InIHtcbiAgbW9kZSA9IGAke21vZGV9YDtcbiAgaWYgKG1vZGUgIT09ICdieW9iJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYCR7Y29udGV4dH0gJyR7bW9kZX0nIGlzIG5vdCBhIHZhbGlkIGVudW1lcmF0aW9uIHZhbHVlIGZvciBSZWFkYWJsZVN0cmVhbVJlYWRlck1vZGVgKTtcbiAgfVxuICByZXR1cm4gbW9kZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRCeW9iUmVhZE9wdGlvbnMoXG4gIG9wdGlvbnM6IFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlclJlYWRPcHRpb25zIHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgY29udGV4dDogc3RyaW5nXG4pOiBWYWxpZGF0ZWRSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXJSZWFkT3B0aW9ucyB7XG4gIGFzc2VydERpY3Rpb25hcnkob3B0aW9ucywgY29udGV4dCk7XG4gIGNvbnN0IG1pbiA9IG9wdGlvbnM/Lm1pbiA/PyAxO1xuICByZXR1cm4ge1xuICAgIG1pbjogY29udmVydFVuc2lnbmVkTG9uZ0xvbmdXaXRoRW5mb3JjZVJhbmdlKFxuICAgICAgbWluLFxuICAgICAgYCR7Y29udGV4dH0gaGFzIG1lbWJlciAnbWluJyB0aGF0YFxuICAgIClcbiAgfTtcbn1cbiIsICJpbXBvcnQgYXNzZXJ0IGZyb20gJy4uLy4uL3N0dWIvYXNzZXJ0JztcbmltcG9ydCB7IFNpbXBsZVF1ZXVlIH0gZnJvbSAnLi4vc2ltcGxlLXF1ZXVlJztcbmltcG9ydCB7XG4gIFJlYWRhYmxlU3RyZWFtUmVhZGVyR2VuZXJpY0NhbmNlbCxcbiAgUmVhZGFibGVTdHJlYW1SZWFkZXJHZW5lcmljSW5pdGlhbGl6ZSxcbiAgUmVhZGFibGVTdHJlYW1SZWFkZXJHZW5lcmljUmVsZWFzZSxcbiAgcmVhZGVyTG9ja0V4Y2VwdGlvblxufSBmcm9tICcuL2dlbmVyaWMtcmVhZGVyJztcbmltcG9ydCB7IElzUmVhZGFibGVTdHJlYW1Mb2NrZWQsIHR5cGUgUmVhZGFibGVCeXRlU3RyZWFtLCB0eXBlIFJlYWRhYmxlU3RyZWFtIH0gZnJvbSAnLi4vcmVhZGFibGUtc3RyZWFtJztcbmltcG9ydCB7XG4gIElzUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcixcbiAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcixcbiAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclB1bGxJbnRvXG59IGZyb20gJy4vYnl0ZS1zdHJlYW0tY29udHJvbGxlcic7XG5pbXBvcnQgeyBzZXRGdW5jdGlvbk5hbWUsIHR5cGVJc09iamVjdCB9IGZyb20gJy4uL2hlbHBlcnMvbWlzY2VsbGFuZW91cyc7XG5pbXBvcnQgeyBuZXdQcm9taXNlLCBwcm9taXNlUmVqZWN0ZWRXaXRoIH0gZnJvbSAnLi4vaGVscGVycy93ZWJpZGwnO1xuaW1wb3J0IHsgYXNzZXJ0UmVxdWlyZWRBcmd1bWVudCB9IGZyb20gJy4uL3ZhbGlkYXRvcnMvYmFzaWMnO1xuaW1wb3J0IHsgYXNzZXJ0UmVhZGFibGVTdHJlYW0gfSBmcm9tICcuLi92YWxpZGF0b3JzL3JlYWRhYmxlLXN0cmVhbSc7XG5pbXBvcnQgeyBJc0RldGFjaGVkQnVmZmVyIH0gZnJvbSAnLi4vYWJzdHJhY3Qtb3BzL2VjbWFzY3JpcHQnO1xuaW1wb3J0IHR5cGUge1xuICBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXJSZWFkT3B0aW9ucyxcbiAgVmFsaWRhdGVkUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyUmVhZE9wdGlvbnNcbn0gZnJvbSAnLi9yZWFkZXItb3B0aW9ucyc7XG5pbXBvcnQgeyBjb252ZXJ0QnlvYlJlYWRPcHRpb25zIH0gZnJvbSAnLi4vdmFsaWRhdG9ycy9yZWFkZXItb3B0aW9ucyc7XG5pbXBvcnQgeyBpc0RhdGFWaWV3LCB0eXBlIE5vblNoYXJlZCwgdHlwZSBUeXBlZEFycmF5IH0gZnJvbSAnLi4vaGVscGVycy9hcnJheS1idWZmZXItdmlldyc7XG5cbi8qKlxuICogQSByZXN1bHQgcmV0dXJuZWQgYnkge0BsaW5rIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlci5yZWFkfS5cbiAqXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCB0eXBlIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRSZXN1bHQ8VCBleHRlbmRzIEFycmF5QnVmZmVyVmlldz4gPSB7XG4gIGRvbmU6IGZhbHNlO1xuICB2YWx1ZTogVDtcbn0gfCB7XG4gIGRvbmU6IHRydWU7XG4gIHZhbHVlOiBUIHwgdW5kZWZpbmVkO1xufTtcblxuLy8gQWJzdHJhY3Qgb3BlcmF0aW9ucyBmb3IgdGhlIFJlYWRhYmxlU3RyZWFtLlxuXG5leHBvcnQgZnVuY3Rpb24gQWNxdWlyZVJlYWRhYmxlU3RyZWFtQllPQlJlYWRlcihzdHJlYW06IFJlYWRhYmxlQnl0ZVN0cmVhbSk6IFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlciB7XG4gIHJldHVybiBuZXcgUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyKHN0cmVhbSBhcyBSZWFkYWJsZVN0cmVhbTxVaW50OEFycmF5Pik7XG59XG5cbi8vIFJlYWRhYmxlU3RyZWFtIEFQSSBleHBvc2VkIGZvciBjb250cm9sbGVycy5cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtQWRkUmVhZEludG9SZXF1ZXN0PFQgZXh0ZW5kcyBOb25TaGFyZWQ8QXJyYXlCdWZmZXJWaWV3Pj4oXG4gIHN0cmVhbTogUmVhZGFibGVCeXRlU3RyZWFtLFxuICByZWFkSW50b1JlcXVlc3Q6IFJlYWRJbnRvUmVxdWVzdDxUPlxuKTogdm9pZCB7XG4gIGFzc2VydChJc1JlYWRhYmxlU3RyZWFtQllPQlJlYWRlcihzdHJlYW0uX3JlYWRlcikpO1xuICBhc3NlcnQoc3RyZWFtLl9zdGF0ZSA9PT0gJ3JlYWRhYmxlJyB8fCBzdHJlYW0uX3N0YXRlID09PSAnY2xvc2VkJyk7XG5cbiAgKHN0cmVhbS5fcmVhZGVyISBhcyBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIpLl9yZWFkSW50b1JlcXVlc3RzLnB1c2gocmVhZEludG9SZXF1ZXN0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtRnVsZmlsbFJlYWRJbnRvUmVxdWVzdChzdHJlYW06IFJlYWRhYmxlQnl0ZVN0cmVhbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2h1bms6IEFycmF5QnVmZmVyVmlldyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9uZTogYm9vbGVhbikge1xuICBjb25zdCByZWFkZXIgPSBzdHJlYW0uX3JlYWRlciBhcyBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXI7XG5cbiAgYXNzZXJ0KHJlYWRlci5fcmVhZEludG9SZXF1ZXN0cy5sZW5ndGggPiAwKTtcblxuICBjb25zdCByZWFkSW50b1JlcXVlc3QgPSByZWFkZXIuX3JlYWRJbnRvUmVxdWVzdHMuc2hpZnQoKSE7XG4gIGlmIChkb25lKSB7XG4gICAgcmVhZEludG9SZXF1ZXN0Ll9jbG9zZVN0ZXBzKGNodW5rKTtcbiAgfSBlbHNlIHtcbiAgICByZWFkSW50b1JlcXVlc3QuX2NodW5rU3RlcHMoY2h1bmspO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZVN0cmVhbUdldE51bVJlYWRJbnRvUmVxdWVzdHMoc3RyZWFtOiBSZWFkYWJsZUJ5dGVTdHJlYW0pOiBudW1iZXIge1xuICByZXR1cm4gKHN0cmVhbS5fcmVhZGVyIGFzIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlcikuX3JlYWRJbnRvUmVxdWVzdHMubGVuZ3RoO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1IYXNCWU9CUmVhZGVyKHN0cmVhbTogUmVhZGFibGVCeXRlU3RyZWFtKTogYm9vbGVhbiB7XG4gIGNvbnN0IHJlYWRlciA9IHN0cmVhbS5fcmVhZGVyO1xuXG4gIGlmIChyZWFkZXIgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICghSXNSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIocmVhZGVyKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG4vLyBSZWFkZXJzXG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVhZEludG9SZXF1ZXN0PFQgZXh0ZW5kcyBOb25TaGFyZWQ8QXJyYXlCdWZmZXJWaWV3Pj4ge1xuICBfY2h1bmtTdGVwcyhjaHVuazogVCk6IHZvaWQ7XG5cbiAgX2Nsb3NlU3RlcHMoY2h1bms6IFQgfCB1bmRlZmluZWQpOiB2b2lkO1xuXG4gIF9lcnJvclN0ZXBzKGU6IGFueSk6IHZvaWQ7XG59XG5cbi8qKlxuICogQSBCWU9CIHJlYWRlciB2ZW5kZWQgYnkgYSB7QGxpbmsgUmVhZGFibGVTdHJlYW19LlxuICpcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNsYXNzIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlciB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX293bmVyUmVhZGFibGVTdHJlYW0hOiBSZWFkYWJsZUJ5dGVTdHJlYW07XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2Nsb3NlZFByb21pc2UhOiBQcm9taXNlPHVuZGVmaW5lZD47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2Nsb3NlZFByb21pc2VfcmVzb2x2ZT86ICh2YWx1ZT86IHVuZGVmaW5lZCkgPT4gdm9pZDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfY2xvc2VkUHJvbWlzZV9yZWplY3Q/OiAocmVhc29uOiBhbnkpID0+IHZvaWQ7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3JlYWRJbnRvUmVxdWVzdHM6IFNpbXBsZVF1ZXVlPFJlYWRJbnRvUmVxdWVzdDxhbnk+PjtcblxuICBjb25zdHJ1Y3RvcihzdHJlYW06IFJlYWRhYmxlU3RyZWFtPFVpbnQ4QXJyYXk+KSB7XG4gICAgYXNzZXJ0UmVxdWlyZWRBcmd1bWVudChzdHJlYW0sIDEsICdSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXInKTtcbiAgICBhc3NlcnRSZWFkYWJsZVN0cmVhbShzdHJlYW0sICdGaXJzdCBwYXJhbWV0ZXInKTtcblxuICAgIGlmIChJc1JlYWRhYmxlU3RyZWFtTG9ja2VkKHN0cmVhbSkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoaXMgc3RyZWFtIGhhcyBhbHJlYWR5IGJlZW4gbG9ja2VkIGZvciBleGNsdXNpdmUgcmVhZGluZyBieSBhbm90aGVyIHJlYWRlcicpO1xuICAgIH1cblxuICAgIGlmICghSXNSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyKHN0cmVhbS5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNvbnN0cnVjdCBhIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlciBmb3IgYSBzdHJlYW0gbm90IGNvbnN0cnVjdGVkIHdpdGggYSBieXRlICcgK1xuICAgICAgICAnc291cmNlJyk7XG4gICAgfVxuXG4gICAgUmVhZGFibGVTdHJlYW1SZWFkZXJHZW5lcmljSW5pdGlhbGl6ZSh0aGlzLCBzdHJlYW0pO1xuXG4gICAgdGhpcy5fcmVhZEludG9SZXF1ZXN0cyA9IG5ldyBTaW1wbGVRdWV1ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBwcm9taXNlIHRoYXQgd2lsbCBiZSBmdWxmaWxsZWQgd2hlbiB0aGUgc3RyZWFtIGJlY29tZXMgY2xvc2VkLCBvciByZWplY3RlZCBpZiB0aGUgc3RyZWFtIGV2ZXIgZXJyb3JzIG9yXG4gICAqIHRoZSByZWFkZXIncyBsb2NrIGlzIHJlbGVhc2VkIGJlZm9yZSB0aGUgc3RyZWFtIGZpbmlzaGVzIGNsb3NpbmcuXG4gICAqL1xuICBnZXQgY2xvc2VkKCk6IFByb21pc2U8dW5kZWZpbmVkPiB7XG4gICAgaWYgKCFJc1JlYWRhYmxlU3RyZWFtQllPQlJlYWRlcih0aGlzKSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoYnlvYlJlYWRlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ2Nsb3NlZCcpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fY2xvc2VkUHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJZiB0aGUgcmVhZGVyIGlzIGFjdGl2ZSwgYmVoYXZlcyB0aGUgc2FtZSBhcyB7QGxpbmsgUmVhZGFibGVTdHJlYW0uY2FuY2VsIHwgc3RyZWFtLmNhbmNlbChyZWFzb24pfS5cbiAgICovXG4gIGNhbmNlbChyZWFzb246IGFueSA9IHVuZGVmaW5lZCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghSXNSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIodGhpcykpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKGJ5b2JSZWFkZXJCcmFuZENoZWNrRXhjZXB0aW9uKCdjYW5jZWwnKSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX293bmVyUmVhZGFibGVTdHJlYW0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgocmVhZGVyTG9ja0V4Y2VwdGlvbignY2FuY2VsJykpO1xuICAgIH1cblxuICAgIHJldHVybiBSZWFkYWJsZVN0cmVhbVJlYWRlckdlbmVyaWNDYW5jZWwodGhpcywgcmVhc29uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRlbXB0cyB0byByZWFkcyBieXRlcyBpbnRvIHZpZXcsIGFuZCByZXR1cm5zIGEgcHJvbWlzZSByZXNvbHZlZCB3aXRoIHRoZSByZXN1bHQuXG4gICAqXG4gICAqIElmIHJlYWRpbmcgYSBjaHVuayBjYXVzZXMgdGhlIHF1ZXVlIHRvIGJlY29tZSBlbXB0eSwgbW9yZSBkYXRhIHdpbGwgYmUgcHVsbGVkIGZyb20gdGhlIHVuZGVybHlpbmcgc291cmNlLlxuICAgKi9cbiAgcmVhZDxUIGV4dGVuZHMgQXJyYXlCdWZmZXJWaWV3PihcbiAgICB2aWV3OiBULFxuICAgIG9wdGlvbnM/OiBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXJSZWFkT3B0aW9uc1xuICApOiBQcm9taXNlPFJlYWRhYmxlU3RyZWFtQllPQlJlYWRSZXN1bHQ8VD4+O1xuICByZWFkPFQgZXh0ZW5kcyBOb25TaGFyZWQ8QXJyYXlCdWZmZXJWaWV3Pj4oXG4gICAgdmlldzogVCxcbiAgICByYXdPcHRpb25zOiBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXJSZWFkT3B0aW9ucyB8IG51bGwgfCB1bmRlZmluZWQgPSB7fVxuICApOiBQcm9taXNlPFJlYWRhYmxlU3RyZWFtQllPQlJlYWRSZXN1bHQ8VD4+IHtcbiAgICBpZiAoIUlzUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyKHRoaXMpKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChieW9iUmVhZGVyQnJhbmRDaGVja0V4Y2VwdGlvbigncmVhZCcpKTtcbiAgICB9XG5cbiAgICBpZiAoIUFycmF5QnVmZmVyLmlzVmlldyh2aWV3KSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgobmV3IFR5cGVFcnJvcigndmlldyBtdXN0IGJlIGFuIGFycmF5IGJ1ZmZlciB2aWV3JykpO1xuICAgIH1cbiAgICBpZiAodmlldy5ieXRlTGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChuZXcgVHlwZUVycm9yKCd2aWV3IG11c3QgaGF2ZSBub24temVybyBieXRlTGVuZ3RoJykpO1xuICAgIH1cbiAgICBpZiAodmlldy5idWZmZXIuYnl0ZUxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgobmV3IFR5cGVFcnJvcihgdmlldydzIGJ1ZmZlciBtdXN0IGhhdmUgbm9uLXplcm8gYnl0ZUxlbmd0aGApKTtcbiAgICB9XG4gICAgaWYgKElzRGV0YWNoZWRCdWZmZXIodmlldy5idWZmZXIpKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChuZXcgVHlwZUVycm9yKCd2aWV3XFwncyBidWZmZXIgaGFzIGJlZW4gZGV0YWNoZWQnKSk7XG4gICAgfVxuXG4gICAgbGV0IG9wdGlvbnM6IFZhbGlkYXRlZFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlclJlYWRPcHRpb25zO1xuICAgIHRyeSB7XG4gICAgICBvcHRpb25zID0gY29udmVydEJ5b2JSZWFkT3B0aW9ucyhyYXdPcHRpb25zLCAnb3B0aW9ucycpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKGUpO1xuICAgIH1cbiAgICBjb25zdCBtaW4gPSBvcHRpb25zLm1pbjtcbiAgICBpZiAobWluID09PSAwKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChuZXcgVHlwZUVycm9yKCdvcHRpb25zLm1pbiBtdXN0IGJlIGdyZWF0ZXIgdGhhbiAwJykpO1xuICAgIH1cbiAgICBpZiAoIWlzRGF0YVZpZXcodmlldykpIHtcbiAgICAgIGlmIChtaW4gPiAodmlldyBhcyB1bmtub3duIGFzIFR5cGVkQXJyYXkpLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChuZXcgUmFuZ2VFcnJvcignb3B0aW9ucy5taW4gbXVzdCBiZSBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gdmlld1xcJ3MgbGVuZ3RoJykpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAobWluID4gdmlldy5ieXRlTGVuZ3RoKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChuZXcgUmFuZ2VFcnJvcignb3B0aW9ucy5taW4gbXVzdCBiZSBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gdmlld1xcJ3MgYnl0ZUxlbmd0aCcpKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fb3duZXJSZWFkYWJsZVN0cmVhbSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChyZWFkZXJMb2NrRXhjZXB0aW9uKCdyZWFkIGZyb20nKSk7XG4gICAgfVxuXG4gICAgbGV0IHJlc29sdmVQcm9taXNlITogKHJlc3VsdDogUmVhZGFibGVTdHJlYW1CWU9CUmVhZFJlc3VsdDxUPikgPT4gdm9pZDtcbiAgICBsZXQgcmVqZWN0UHJvbWlzZSE6IChyZWFzb246IGFueSkgPT4gdm9pZDtcbiAgICBjb25zdCBwcm9taXNlID0gbmV3UHJvbWlzZTxSZWFkYWJsZVN0cmVhbUJZT0JSZWFkUmVzdWx0PFQ+PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICByZXNvbHZlUHJvbWlzZSA9IHJlc29sdmU7XG4gICAgICByZWplY3RQcm9taXNlID0gcmVqZWN0O1xuICAgIH0pO1xuICAgIGNvbnN0IHJlYWRJbnRvUmVxdWVzdDogUmVhZEludG9SZXF1ZXN0PFQ+ID0ge1xuICAgICAgX2NodW5rU3RlcHM6IGNodW5rID0+IHJlc29sdmVQcm9taXNlKHsgdmFsdWU6IGNodW5rLCBkb25lOiBmYWxzZSB9KSxcbiAgICAgIF9jbG9zZVN0ZXBzOiBjaHVuayA9PiByZXNvbHZlUHJvbWlzZSh7IHZhbHVlOiBjaHVuaywgZG9uZTogdHJ1ZSB9KSxcbiAgICAgIF9lcnJvclN0ZXBzOiBlID0+IHJlamVjdFByb21pc2UoZSlcbiAgICB9O1xuICAgIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlclJlYWQodGhpcywgdmlldywgbWluLCByZWFkSW50b1JlcXVlc3QpO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbGVhc2VzIHRoZSByZWFkZXIncyBsb2NrIG9uIHRoZSBjb3JyZXNwb25kaW5nIHN0cmVhbS4gQWZ0ZXIgdGhlIGxvY2sgaXMgcmVsZWFzZWQsIHRoZSByZWFkZXIgaXMgbm8gbG9uZ2VyIGFjdGl2ZS5cbiAgICogSWYgdGhlIGFzc29jaWF0ZWQgc3RyZWFtIGlzIGVycm9yZWQgd2hlbiB0aGUgbG9jayBpcyByZWxlYXNlZCwgdGhlIHJlYWRlciB3aWxsIGFwcGVhciBlcnJvcmVkIGluIHRoZSBzYW1lIHdheVxuICAgKiBmcm9tIG5vdyBvbjsgb3RoZXJ3aXNlLCB0aGUgcmVhZGVyIHdpbGwgYXBwZWFyIGNsb3NlZC5cbiAgICpcbiAgICogQSByZWFkZXIncyBsb2NrIGNhbm5vdCBiZSByZWxlYXNlZCB3aGlsZSBpdCBzdGlsbCBoYXMgYSBwZW5kaW5nIHJlYWQgcmVxdWVzdCwgaS5lLiwgaWYgYSBwcm9taXNlIHJldHVybmVkIGJ5XG4gICAqIHRoZSByZWFkZXIncyB7QGxpbmsgUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyLnJlYWQgfCByZWFkKCl9IG1ldGhvZCBoYXMgbm90IHlldCBiZWVuIHNldHRsZWQuIEF0dGVtcHRpbmcgdG9cbiAgICogZG8gc28gd2lsbCB0aHJvdyBhIGBUeXBlRXJyb3JgIGFuZCBsZWF2ZSB0aGUgcmVhZGVyIGxvY2tlZCB0byB0aGUgc3RyZWFtLlxuICAgKi9cbiAgcmVsZWFzZUxvY2soKTogdm9pZCB7XG4gICAgaWYgKCFJc1JlYWRhYmxlU3RyZWFtQllPQlJlYWRlcih0aGlzKSkge1xuICAgICAgdGhyb3cgYnlvYlJlYWRlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ3JlbGVhc2VMb2NrJyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX293bmVyUmVhZGFibGVTdHJlYW0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlclJlbGVhc2UodGhpcyk7XG4gIH1cbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyLnByb3RvdHlwZSwge1xuICBjYW5jZWw6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICByZWFkOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgcmVsZWFzZUxvY2s6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICBjbG9zZWQ6IHsgZW51bWVyYWJsZTogdHJ1ZSB9XG59KTtcbnNldEZ1bmN0aW9uTmFtZShSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIucHJvdG90eXBlLmNhbmNlbCwgJ2NhbmNlbCcpO1xuc2V0RnVuY3Rpb25OYW1lKFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlci5wcm90b3R5cGUucmVhZCwgJ3JlYWQnKTtcbnNldEZ1bmN0aW9uTmFtZShSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIucHJvdG90eXBlLnJlbGVhc2VMb2NrLCAncmVsZWFzZUxvY2snKTtcbmlmICh0eXBlb2YgU3ltYm9sLnRvU3RyaW5nVGFnID09PSAnc3ltYm9sJykge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyLnByb3RvdHlwZSwgU3ltYm9sLnRvU3RyaW5nVGFnLCB7XG4gICAgdmFsdWU6ICdSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXInLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbn1cblxuLy8gQWJzdHJhY3Qgb3BlcmF0aW9ucyBmb3IgdGhlIHJlYWRlcnMuXG5cbmV4cG9ydCBmdW5jdGlvbiBJc1JlYWRhYmxlU3RyZWFtQllPQlJlYWRlcih4OiBhbnkpOiB4IGlzIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlciB7XG4gIGlmICghdHlwZUlzT2JqZWN0KHgpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoeCwgJ19yZWFkSW50b1JlcXVlc3RzJykpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4geCBpbnN0YW5jZW9mIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlclJlYWQ8VCBleHRlbmRzIE5vblNoYXJlZDxBcnJheUJ1ZmZlclZpZXc+PihcbiAgcmVhZGVyOiBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIsXG4gIHZpZXc6IFQsXG4gIG1pbjogbnVtYmVyLFxuICByZWFkSW50b1JlcXVlc3Q6IFJlYWRJbnRvUmVxdWVzdDxUPlxuKTogdm9pZCB7XG4gIGNvbnN0IHN0cmVhbSA9IHJlYWRlci5fb3duZXJSZWFkYWJsZVN0cmVhbTtcblxuICBhc3NlcnQoc3RyZWFtICE9PSB1bmRlZmluZWQpO1xuXG4gIHN0cmVhbS5fZGlzdHVyYmVkID0gdHJ1ZTtcblxuICBpZiAoc3RyZWFtLl9zdGF0ZSA9PT0gJ2Vycm9yZWQnKSB7XG4gICAgcmVhZEludG9SZXF1ZXN0Ll9lcnJvclN0ZXBzKHN0cmVhbS5fc3RvcmVkRXJyb3IpO1xuICB9IGVsc2Uge1xuICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJQdWxsSW50byhcbiAgICAgIHN0cmVhbS5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyIGFzIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIsXG4gICAgICB2aWV3LFxuICAgICAgbWluLFxuICAgICAgcmVhZEludG9SZXF1ZXN0XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyUmVsZWFzZShyZWFkZXI6IFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlcikge1xuICBSZWFkYWJsZVN0cmVhbVJlYWRlckdlbmVyaWNSZWxlYXNlKHJlYWRlcik7XG4gIGNvbnN0IGUgPSBuZXcgVHlwZUVycm9yKCdSZWFkZXIgd2FzIHJlbGVhc2VkJyk7XG4gIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlckVycm9yUmVhZEludG9SZXF1ZXN0cyhyZWFkZXIsIGUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyRXJyb3JSZWFkSW50b1JlcXVlc3RzKHJlYWRlcjogUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyLCBlOiBhbnkpIHtcbiAgY29uc3QgcmVhZEludG9SZXF1ZXN0cyA9IHJlYWRlci5fcmVhZEludG9SZXF1ZXN0cztcbiAgcmVhZGVyLl9yZWFkSW50b1JlcXVlc3RzID0gbmV3IFNpbXBsZVF1ZXVlKCk7XG4gIHJlYWRJbnRvUmVxdWVzdHMuZm9yRWFjaChyZWFkSW50b1JlcXVlc3QgPT4ge1xuICAgIHJlYWRJbnRvUmVxdWVzdC5fZXJyb3JTdGVwcyhlKTtcbiAgfSk7XG59XG5cbi8vIEhlbHBlciBmdW5jdGlvbnMgZm9yIHRoZSBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIuXG5cbmZ1bmN0aW9uIGJ5b2JSZWFkZXJCcmFuZENoZWNrRXhjZXB0aW9uKG5hbWU6IHN0cmluZyk6IFR5cGVFcnJvciB7XG4gIHJldHVybiBuZXcgVHlwZUVycm9yKFxuICAgIGBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIucHJvdG90eXBlLiR7bmFtZX0gY2FuIG9ubHkgYmUgdXNlZCBvbiBhIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlcmApO1xufVxuIiwgImltcG9ydCB0eXBlIHsgUXVldWluZ1N0cmF0ZWd5LCBRdWV1aW5nU3RyYXRlZ3lTaXplQ2FsbGJhY2sgfSBmcm9tICcuLi9xdWV1aW5nLXN0cmF0ZWd5JztcbmltcG9ydCBOdW1iZXJJc05hTiBmcm9tICcuLi8uLi9zdHViL251bWJlci1pc25hbic7XG5cbmV4cG9ydCBmdW5jdGlvbiBFeHRyYWN0SGlnaFdhdGVyTWFyayhzdHJhdGVneTogUXVldWluZ1N0cmF0ZWd5LCBkZWZhdWx0SFdNOiBudW1iZXIpOiBudW1iZXIge1xuICBjb25zdCB7IGhpZ2hXYXRlck1hcmsgfSA9IHN0cmF0ZWd5O1xuXG4gIGlmIChoaWdoV2F0ZXJNYXJrID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gZGVmYXVsdEhXTTtcbiAgfVxuXG4gIGlmIChOdW1iZXJJc05hTihoaWdoV2F0ZXJNYXJrKSB8fCBoaWdoV2F0ZXJNYXJrIDwgMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbnZhbGlkIGhpZ2hXYXRlck1hcmsnKTtcbiAgfVxuXG4gIHJldHVybiBoaWdoV2F0ZXJNYXJrO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gRXh0cmFjdFNpemVBbGdvcml0aG08VD4oc3RyYXRlZ3k6IFF1ZXVpbmdTdHJhdGVneTxUPik6IFF1ZXVpbmdTdHJhdGVneVNpemVDYWxsYmFjazxUPiB7XG4gIGNvbnN0IHsgc2l6ZSB9ID0gc3RyYXRlZ3k7XG5cbiAgaWYgKCFzaXplKSB7XG4gICAgcmV0dXJuICgpID0+IDE7XG4gIH1cblxuICByZXR1cm4gc2l6ZTtcbn1cbiIsICJpbXBvcnQgdHlwZSB7IFF1ZXVpbmdTdHJhdGVneSwgUXVldWluZ1N0cmF0ZWd5U2l6ZUNhbGxiYWNrIH0gZnJvbSAnLi4vcXVldWluZy1zdHJhdGVneSc7XG5pbXBvcnQgeyBhc3NlcnREaWN0aW9uYXJ5LCBhc3NlcnRGdW5jdGlvbiwgY29udmVydFVucmVzdHJpY3RlZERvdWJsZSB9IGZyb20gJy4vYmFzaWMnO1xuXG5leHBvcnQgZnVuY3Rpb24gY29udmVydFF1ZXVpbmdTdHJhdGVneTxUPihpbml0OiBRdWV1aW5nU3RyYXRlZ3k8VD4gfCBudWxsIHwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dDogc3RyaW5nKTogUXVldWluZ1N0cmF0ZWd5PFQ+IHtcbiAgYXNzZXJ0RGljdGlvbmFyeShpbml0LCBjb250ZXh0KTtcbiAgY29uc3QgaGlnaFdhdGVyTWFyayA9IGluaXQ/LmhpZ2hXYXRlck1hcms7XG4gIGNvbnN0IHNpemUgPSBpbml0Py5zaXplO1xuICByZXR1cm4ge1xuICAgIGhpZ2hXYXRlck1hcms6IGhpZ2hXYXRlck1hcmsgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZCA6IGNvbnZlcnRVbnJlc3RyaWN0ZWREb3VibGUoaGlnaFdhdGVyTWFyayksXG4gICAgc2l6ZTogc2l6ZSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogY29udmVydFF1ZXVpbmdTdHJhdGVneVNpemUoc2l6ZSwgYCR7Y29udGV4dH0gaGFzIG1lbWJlciAnc2l6ZScgdGhhdGApXG4gIH07XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRRdWV1aW5nU3RyYXRlZ3lTaXplPFQ+KGZuOiBRdWV1aW5nU3RyYXRlZ3lTaXplQ2FsbGJhY2s8VD4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiBzdHJpbmcpOiBRdWV1aW5nU3RyYXRlZ3lTaXplQ2FsbGJhY2s8VD4ge1xuICBhc3NlcnRGdW5jdGlvbihmbiwgY29udGV4dCk7XG4gIHJldHVybiBjaHVuayA9PiBjb252ZXJ0VW5yZXN0cmljdGVkRG91YmxlKGZuKGNodW5rKSk7XG59XG4iLCAiaW1wb3J0IHsgYXNzZXJ0RGljdGlvbmFyeSwgYXNzZXJ0RnVuY3Rpb24gfSBmcm9tICcuL2Jhc2ljJztcbmltcG9ydCB7IHByb21pc2VDYWxsLCByZWZsZWN0Q2FsbCB9IGZyb20gJy4uL2hlbHBlcnMvd2ViaWRsJztcbmltcG9ydCB0eXBlIHtcbiAgVW5kZXJseWluZ1NpbmssXG4gIFVuZGVybHlpbmdTaW5rQWJvcnRDYWxsYmFjayxcbiAgVW5kZXJseWluZ1NpbmtDbG9zZUNhbGxiYWNrLFxuICBVbmRlcmx5aW5nU2lua1N0YXJ0Q2FsbGJhY2ssXG4gIFVuZGVybHlpbmdTaW5rV3JpdGVDYWxsYmFjayxcbiAgVmFsaWRhdGVkVW5kZXJseWluZ1Npbmtcbn0gZnJvbSAnLi4vd3JpdGFibGUtc3RyZWFtL3VuZGVybHlpbmctc2luayc7XG5pbXBvcnQgeyBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyIH0gZnJvbSAnLi4vd3JpdGFibGUtc3RyZWFtJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRVbmRlcmx5aW5nU2luazxXPihvcmlnaW5hbDogVW5kZXJseWluZ1Npbms8Vz4gfCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiBzdHJpbmcpOiBWYWxpZGF0ZWRVbmRlcmx5aW5nU2luazxXPiB7XG4gIGFzc2VydERpY3Rpb25hcnkob3JpZ2luYWwsIGNvbnRleHQpO1xuICBjb25zdCBhYm9ydCA9IG9yaWdpbmFsPy5hYm9ydDtcbiAgY29uc3QgY2xvc2UgPSBvcmlnaW5hbD8uY2xvc2U7XG4gIGNvbnN0IHN0YXJ0ID0gb3JpZ2luYWw/LnN0YXJ0O1xuICBjb25zdCB0eXBlID0gb3JpZ2luYWw/LnR5cGU7XG4gIGNvbnN0IHdyaXRlID0gb3JpZ2luYWw/LndyaXRlO1xuICByZXR1cm4ge1xuICAgIGFib3J0OiBhYm9ydCA9PT0gdW5kZWZpbmVkID9cbiAgICAgIHVuZGVmaW5lZCA6XG4gICAgICBjb252ZXJ0VW5kZXJseWluZ1NpbmtBYm9ydENhbGxiYWNrKGFib3J0LCBvcmlnaW5hbCEsIGAke2NvbnRleHR9IGhhcyBtZW1iZXIgJ2Fib3J0JyB0aGF0YCksXG4gICAgY2xvc2U6IGNsb3NlID09PSB1bmRlZmluZWQgP1xuICAgICAgdW5kZWZpbmVkIDpcbiAgICAgIGNvbnZlcnRVbmRlcmx5aW5nU2lua0Nsb3NlQ2FsbGJhY2soY2xvc2UsIG9yaWdpbmFsISwgYCR7Y29udGV4dH0gaGFzIG1lbWJlciAnY2xvc2UnIHRoYXRgKSxcbiAgICBzdGFydDogc3RhcnQgPT09IHVuZGVmaW5lZCA/XG4gICAgICB1bmRlZmluZWQgOlxuICAgICAgY29udmVydFVuZGVybHlpbmdTaW5rU3RhcnRDYWxsYmFjayhzdGFydCwgb3JpZ2luYWwhLCBgJHtjb250ZXh0fSBoYXMgbWVtYmVyICdzdGFydCcgdGhhdGApLFxuICAgIHdyaXRlOiB3cml0ZSA9PT0gdW5kZWZpbmVkID9cbiAgICAgIHVuZGVmaW5lZCA6XG4gICAgICBjb252ZXJ0VW5kZXJseWluZ1NpbmtXcml0ZUNhbGxiYWNrKHdyaXRlLCBvcmlnaW5hbCEsIGAke2NvbnRleHR9IGhhcyBtZW1iZXIgJ3dyaXRlJyB0aGF0YCksXG4gICAgdHlwZVxuICB9O1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0VW5kZXJseWluZ1NpbmtBYm9ydENhbGxiYWNrKFxuICBmbjogVW5kZXJseWluZ1NpbmtBYm9ydENhbGxiYWNrLFxuICBvcmlnaW5hbDogVW5kZXJseWluZ1NpbmssXG4gIGNvbnRleHQ6IHN0cmluZ1xuKTogKHJlYXNvbjogYW55KSA9PiBQcm9taXNlPHZvaWQ+IHtcbiAgYXNzZXJ0RnVuY3Rpb24oZm4sIGNvbnRleHQpO1xuICByZXR1cm4gKHJlYXNvbjogYW55KSA9PiBwcm9taXNlQ2FsbChmbiwgb3JpZ2luYWwsIFtyZWFzb25dKTtcbn1cblxuZnVuY3Rpb24gY29udmVydFVuZGVybHlpbmdTaW5rQ2xvc2VDYWxsYmFjayhcbiAgZm46IFVuZGVybHlpbmdTaW5rQ2xvc2VDYWxsYmFjayxcbiAgb3JpZ2luYWw6IFVuZGVybHlpbmdTaW5rLFxuICBjb250ZXh0OiBzdHJpbmdcbik6ICgpID0+IFByb21pc2U8dm9pZD4ge1xuICBhc3NlcnRGdW5jdGlvbihmbiwgY29udGV4dCk7XG4gIHJldHVybiAoKSA9PiBwcm9taXNlQ2FsbChmbiwgb3JpZ2luYWwsIFtdKTtcbn1cblxuZnVuY3Rpb24gY29udmVydFVuZGVybHlpbmdTaW5rU3RhcnRDYWxsYmFjayhcbiAgZm46IFVuZGVybHlpbmdTaW5rU3RhcnRDYWxsYmFjayxcbiAgb3JpZ2luYWw6IFVuZGVybHlpbmdTaW5rLFxuICBjb250ZXh0OiBzdHJpbmdcbik6IFVuZGVybHlpbmdTaW5rU3RhcnRDYWxsYmFjayB7XG4gIGFzc2VydEZ1bmN0aW9uKGZuLCBjb250ZXh0KTtcbiAgcmV0dXJuIChjb250cm9sbGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyKSA9PiByZWZsZWN0Q2FsbChmbiwgb3JpZ2luYWwsIFtjb250cm9sbGVyXSk7XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRVbmRlcmx5aW5nU2lua1dyaXRlQ2FsbGJhY2s8Vz4oXG4gIGZuOiBVbmRlcmx5aW5nU2lua1dyaXRlQ2FsbGJhY2s8Vz4sXG4gIG9yaWdpbmFsOiBVbmRlcmx5aW5nU2luazxXPixcbiAgY29udGV4dDogc3RyaW5nXG4pOiAoY2h1bms6IFcsIGNvbnRyb2xsZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIpID0+IFByb21pc2U8dm9pZD4ge1xuICBhc3NlcnRGdW5jdGlvbihmbiwgY29udGV4dCk7XG4gIHJldHVybiAoY2h1bms6IFcsIGNvbnRyb2xsZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIpID0+IHByb21pc2VDYWxsKGZuLCBvcmlnaW5hbCwgW2NodW5rLCBjb250cm9sbGVyXSk7XG59XG4iLCAiaW1wb3J0IHsgSXNXcml0YWJsZVN0cmVhbSwgV3JpdGFibGVTdHJlYW0gfSBmcm9tICcuLi93cml0YWJsZS1zdHJlYW0nO1xuXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0V3JpdGFibGVTdHJlYW0oeDogdW5rbm93biwgY29udGV4dDogc3RyaW5nKTogYXNzZXJ0cyB4IGlzIFdyaXRhYmxlU3RyZWFtIHtcbiAgaWYgKCFJc1dyaXRhYmxlU3RyZWFtKHgpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgJHtjb250ZXh0fSBpcyBub3QgYSBXcml0YWJsZVN0cmVhbS5gKTtcbiAgfVxufVxuIiwgIi8qKlxuICogQSBzaWduYWwgb2JqZWN0IHRoYXQgYWxsb3dzIHlvdSB0byBjb21tdW5pY2F0ZSB3aXRoIGEgcmVxdWVzdCBhbmQgYWJvcnQgaXQgaWYgcmVxdWlyZWRcbiAqIHZpYSBpdHMgYXNzb2NpYXRlZCBgQWJvcnRDb250cm9sbGVyYCBvYmplY3QuXG4gKlxuICogQHJlbWFya3NcbiAqICAgVGhpcyBpbnRlcmZhY2UgaXMgY29tcGF0aWJsZSB3aXRoIHRoZSBgQWJvcnRTaWduYWxgIGludGVyZmFjZSBkZWZpbmVkIGluIFR5cGVTY3JpcHQncyBET00gdHlwZXMuXG4gKiAgIEl0IGlzIHJlZGVmaW5lZCBoZXJlLCBzbyBpdCBjYW4gYmUgcG9seWZpbGxlZCB3aXRob3V0IGEgRE9NLCBmb3IgZXhhbXBsZSB3aXRoXG4gKiAgIHtAbGluayBodHRwczovL3d3dy5ucG1qcy5jb20vcGFja2FnZS9hYm9ydGNvbnRyb2xsZXItcG9seWZpbGwgfCBhYm9ydGNvbnRyb2xsZXItcG9seWZpbGx9IGluIGEgTm9kZSBlbnZpcm9ubWVudC5cbiAqXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQWJvcnRTaWduYWwge1xuICAvKipcbiAgICogV2hldGhlciB0aGUgcmVxdWVzdCBpcyBhYm9ydGVkLlxuICAgKi9cbiAgcmVhZG9ubHkgYWJvcnRlZDogYm9vbGVhbjtcblxuICAvKipcbiAgICogSWYgYWJvcnRlZCwgcmV0dXJucyB0aGUgcmVhc29uIGZvciBhYm9ydGluZy5cbiAgICovXG4gIHJlYWRvbmx5IHJlYXNvbj86IGFueTtcblxuICAvKipcbiAgICogQWRkIGFuIGV2ZW50IGxpc3RlbmVyIHRvIGJlIHRyaWdnZXJlZCB3aGVuIHRoaXMgc2lnbmFsIGJlY29tZXMgYWJvcnRlZC5cbiAgICovXG4gIGFkZEV2ZW50TGlzdGVuZXIodHlwZTogJ2Fib3J0JywgbGlzdGVuZXI6ICgpID0+IHZvaWQpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBSZW1vdmUgYW4gZXZlbnQgbGlzdGVuZXIgdGhhdCB3YXMgcHJldmlvdXNseSBhZGRlZCB3aXRoIHtAbGluayBBYm9ydFNpZ25hbC5hZGRFdmVudExpc3RlbmVyfS5cbiAgICovXG4gIHJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZTogJ2Fib3J0JywgbGlzdGVuZXI6ICgpID0+IHZvaWQpOiB2b2lkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNBYm9ydFNpZ25hbCh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIEFib3J0U2lnbmFsIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcgfHwgdmFsdWUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdHJ5IHtcbiAgICByZXR1cm4gdHlwZW9mICh2YWx1ZSBhcyBBYm9ydFNpZ25hbCkuYWJvcnRlZCA9PT0gJ2Jvb2xlYW4nO1xuICB9IGNhdGNoIHtcbiAgICAvLyBBYm9ydFNpZ25hbC5wcm90b3R5cGUuYWJvcnRlZCB0aHJvd3MgaWYgaXRzIGJyYW5kIGNoZWNrIGZhaWxzXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbi8qKlxuICogQSBjb250cm9sbGVyIG9iamVjdCB0aGF0IGFsbG93cyB5b3UgdG8gYWJvcnQgYW4gYEFib3J0U2lnbmFsYCB3aGVuIGRlc2lyZWQuXG4gKlxuICogQHJlbWFya3NcbiAqICAgVGhpcyBpbnRlcmZhY2UgaXMgY29tcGF0aWJsZSB3aXRoIHRoZSBgQWJvcnRDb250cm9sbGVyYCBpbnRlcmZhY2UgZGVmaW5lZCBpbiBUeXBlU2NyaXB0J3MgRE9NIHR5cGVzLlxuICogICBJdCBpcyByZWRlZmluZWQgaGVyZSwgc28gaXQgY2FuIGJlIHBvbHlmaWxsZWQgd2l0aG91dCBhIERPTSwgZm9yIGV4YW1wbGUgd2l0aFxuICogICB7QGxpbmsgaHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2UvYWJvcnRjb250cm9sbGVyLXBvbHlmaWxsIHwgYWJvcnRjb250cm9sbGVyLXBvbHlmaWxsfSBpbiBhIE5vZGUgZW52aXJvbm1lbnQuXG4gKlxuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQWJvcnRDb250cm9sbGVyIHtcbiAgcmVhZG9ubHkgc2lnbmFsOiBBYm9ydFNpZ25hbDtcblxuICBhYm9ydChyZWFzb24/OiBhbnkpOiB2b2lkO1xufVxuXG5pbnRlcmZhY2UgQWJvcnRDb250cm9sbGVyQ29uc3RydWN0b3Ige1xuICBuZXcoKTogQWJvcnRDb250cm9sbGVyO1xufVxuXG5jb25zdCBzdXBwb3J0c0Fib3J0Q29udHJvbGxlciA9IHR5cGVvZiAoQWJvcnRDb250cm9sbGVyIGFzIGFueSkgPT09ICdmdW5jdGlvbic7XG5cbi8qKlxuICogQ29uc3RydWN0IGEgbmV3IEFib3J0Q29udHJvbGxlciwgaWYgc3VwcG9ydGVkIGJ5IHRoZSBwbGF0Zm9ybS5cbiAqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUFib3J0Q29udHJvbGxlcigpOiBBYm9ydENvbnRyb2xsZXIgfCB1bmRlZmluZWQge1xuICBpZiAoc3VwcG9ydHNBYm9ydENvbnRyb2xsZXIpIHtcbiAgICByZXR1cm4gbmV3IChBYm9ydENvbnRyb2xsZXIgYXMgQWJvcnRDb250cm9sbGVyQ29uc3RydWN0b3IpKCk7XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cbiIsICJpbXBvcnQgYXNzZXJ0IGZyb20gJy4uL3N0dWIvYXNzZXJ0JztcbmltcG9ydCB7XG4gIG5ld1Byb21pc2UsXG4gIHByb21pc2VSZWplY3RlZFdpdGgsXG4gIHByb21pc2VSZXNvbHZlZFdpdGgsXG4gIHNldFByb21pc2VJc0hhbmRsZWRUb1RydWUsXG4gIHVwb25Qcm9taXNlXG59IGZyb20gJy4vaGVscGVycy93ZWJpZGwnO1xuaW1wb3J0IHtcbiAgRGVxdWV1ZVZhbHVlLFxuICBFbnF1ZXVlVmFsdWVXaXRoU2l6ZSxcbiAgUGVla1F1ZXVlVmFsdWUsXG4gIHR5cGUgUXVldWVQYWlyLFxuICBSZXNldFF1ZXVlXG59IGZyb20gJy4vYWJzdHJhY3Qtb3BzL3F1ZXVlLXdpdGgtc2l6ZXMnO1xuaW1wb3J0IHR5cGUgeyBRdWV1aW5nU3RyYXRlZ3ksIFF1ZXVpbmdTdHJhdGVneVNpemVDYWxsYmFjayB9IGZyb20gJy4vcXVldWluZy1zdHJhdGVneSc7XG5pbXBvcnQgeyBTaW1wbGVRdWV1ZSB9IGZyb20gJy4vc2ltcGxlLXF1ZXVlJztcbmltcG9ydCB7IHNldEZ1bmN0aW9uTmFtZSwgdHlwZUlzT2JqZWN0IH0gZnJvbSAnLi9oZWxwZXJzL21pc2NlbGxhbmVvdXMnO1xuaW1wb3J0IHsgQWJvcnRTdGVwcywgRXJyb3JTdGVwcyB9IGZyb20gJy4vYWJzdHJhY3Qtb3BzL2ludGVybmFsLW1ldGhvZHMnO1xuaW1wb3J0IHsgSXNOb25OZWdhdGl2ZU51bWJlciB9IGZyb20gJy4vYWJzdHJhY3Qtb3BzL21pc2NlbGxhbmVvdXMnO1xuaW1wb3J0IHsgRXh0cmFjdEhpZ2hXYXRlck1hcmssIEV4dHJhY3RTaXplQWxnb3JpdGhtIH0gZnJvbSAnLi9hYnN0cmFjdC1vcHMvcXVldWluZy1zdHJhdGVneSc7XG5pbXBvcnQgeyBjb252ZXJ0UXVldWluZ1N0cmF0ZWd5IH0gZnJvbSAnLi92YWxpZGF0b3JzL3F1ZXVpbmctc3RyYXRlZ3knO1xuaW1wb3J0IHR5cGUge1xuICBVbmRlcmx5aW5nU2luayxcbiAgVW5kZXJseWluZ1NpbmtBYm9ydENhbGxiYWNrLFxuICBVbmRlcmx5aW5nU2lua0Nsb3NlQ2FsbGJhY2ssXG4gIFVuZGVybHlpbmdTaW5rU3RhcnRDYWxsYmFjayxcbiAgVW5kZXJseWluZ1NpbmtXcml0ZUNhbGxiYWNrLFxuICBWYWxpZGF0ZWRVbmRlcmx5aW5nU2lua1xufSBmcm9tICcuL3dyaXRhYmxlLXN0cmVhbS91bmRlcmx5aW5nLXNpbmsnO1xuaW1wb3J0IHsgYXNzZXJ0T2JqZWN0LCBhc3NlcnRSZXF1aXJlZEFyZ3VtZW50IH0gZnJvbSAnLi92YWxpZGF0b3JzL2Jhc2ljJztcbmltcG9ydCB7IGNvbnZlcnRVbmRlcmx5aW5nU2luayB9IGZyb20gJy4vdmFsaWRhdG9ycy91bmRlcmx5aW5nLXNpbmsnO1xuaW1wb3J0IHsgYXNzZXJ0V3JpdGFibGVTdHJlYW0gfSBmcm9tICcuL3ZhbGlkYXRvcnMvd3JpdGFibGUtc3RyZWFtJztcbmltcG9ydCB7IHR5cGUgQWJvcnRDb250cm9sbGVyLCB0eXBlIEFib3J0U2lnbmFsLCBjcmVhdGVBYm9ydENvbnRyb2xsZXIgfSBmcm9tICcuL2Fib3J0LXNpZ25hbCc7XG5cbnR5cGUgV3JpdGFibGVTdHJlYW1TdGF0ZSA9ICd3cml0YWJsZScgfCAnY2xvc2VkJyB8ICdlcnJvcmluZycgfCAnZXJyb3JlZCc7XG5cbmludGVyZmFjZSBXcml0ZU9yQ2xvc2VSZXF1ZXN0IHtcbiAgX3Jlc29sdmU6ICh2YWx1ZT86IHVuZGVmaW5lZCkgPT4gdm9pZDtcbiAgX3JlamVjdDogKHJlYXNvbjogYW55KSA9PiB2b2lkO1xufVxuXG50eXBlIFdyaXRlUmVxdWVzdCA9IFdyaXRlT3JDbG9zZVJlcXVlc3Q7XG50eXBlIENsb3NlUmVxdWVzdCA9IFdyaXRlT3JDbG9zZVJlcXVlc3Q7XG5cbmludGVyZmFjZSBQZW5kaW5nQWJvcnRSZXF1ZXN0IHtcbiAgX3Byb21pc2U6IFByb21pc2U8dW5kZWZpbmVkPjtcbiAgX3Jlc29sdmU6ICh2YWx1ZT86IHVuZGVmaW5lZCkgPT4gdm9pZDtcbiAgX3JlamVjdDogKHJlYXNvbjogYW55KSA9PiB2b2lkO1xuICBfcmVhc29uOiBhbnk7XG4gIF93YXNBbHJlYWR5RXJyb3Jpbmc6IGJvb2xlYW47XG59XG5cbi8qKlxuICogQSB3cml0YWJsZSBzdHJlYW0gcmVwcmVzZW50cyBhIGRlc3RpbmF0aW9uIGZvciBkYXRhLCBpbnRvIHdoaWNoIHlvdSBjYW4gd3JpdGUuXG4gKlxuICogQHB1YmxpY1xuICovXG5jbGFzcyBXcml0YWJsZVN0cmVhbTxXID0gYW55PiB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3N0YXRlITogV3JpdGFibGVTdHJlYW1TdGF0ZTtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfc3RvcmVkRXJyb3I6IGFueTtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfd3JpdGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXI8Vz4gfCB1bmRlZmluZWQ7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3dyaXRhYmxlU3RyZWFtQ29udHJvbGxlciE6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8Vz47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3dyaXRlUmVxdWVzdHMhOiBTaW1wbGVRdWV1ZTxXcml0ZVJlcXVlc3Q+O1xuICAvKiogQGludGVybmFsICovXG4gIF9pbkZsaWdodFdyaXRlUmVxdWVzdDogV3JpdGVSZXF1ZXN0IHwgdW5kZWZpbmVkO1xuICAvKiogQGludGVybmFsICovXG4gIF9jbG9zZVJlcXVlc3Q6IENsb3NlUmVxdWVzdCB8IHVuZGVmaW5lZDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfaW5GbGlnaHRDbG9zZVJlcXVlc3Q6IENsb3NlUmVxdWVzdCB8IHVuZGVmaW5lZDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcGVuZGluZ0Fib3J0UmVxdWVzdDogUGVuZGluZ0Fib3J0UmVxdWVzdCB8IHVuZGVmaW5lZDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfYmFja3ByZXNzdXJlITogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3Rvcih1bmRlcmx5aW5nU2luaz86IFVuZGVybHlpbmdTaW5rPFc+LCBzdHJhdGVneT86IFF1ZXVpbmdTdHJhdGVneTxXPik7XG4gIGNvbnN0cnVjdG9yKHJhd1VuZGVybHlpbmdTaW5rOiBVbmRlcmx5aW5nU2luazxXPiB8IG51bGwgfCB1bmRlZmluZWQgPSB7fSxcbiAgICAgICAgICAgICAgcmF3U3RyYXRlZ3k6IFF1ZXVpbmdTdHJhdGVneTxXPiB8IG51bGwgfCB1bmRlZmluZWQgPSB7fSkge1xuICAgIGlmIChyYXdVbmRlcmx5aW5nU2luayA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByYXdVbmRlcmx5aW5nU2luayA9IG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFzc2VydE9iamVjdChyYXdVbmRlcmx5aW5nU2luaywgJ0ZpcnN0IHBhcmFtZXRlcicpO1xuICAgIH1cblxuICAgIGNvbnN0IHN0cmF0ZWd5ID0gY29udmVydFF1ZXVpbmdTdHJhdGVneShyYXdTdHJhdGVneSwgJ1NlY29uZCBwYXJhbWV0ZXInKTtcbiAgICBjb25zdCB1bmRlcmx5aW5nU2luayA9IGNvbnZlcnRVbmRlcmx5aW5nU2luayhyYXdVbmRlcmx5aW5nU2luaywgJ0ZpcnN0IHBhcmFtZXRlcicpO1xuXG4gICAgSW5pdGlhbGl6ZVdyaXRhYmxlU3RyZWFtKHRoaXMpO1xuXG4gICAgY29uc3QgdHlwZSA9IHVuZGVybHlpbmdTaW5rLnR5cGU7XG4gICAgaWYgKHR5cGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0ludmFsaWQgdHlwZSBpcyBzcGVjaWZpZWQnKTtcbiAgICB9XG5cbiAgICBjb25zdCBzaXplQWxnb3JpdGhtID0gRXh0cmFjdFNpemVBbGdvcml0aG0oc3RyYXRlZ3kpO1xuICAgIGNvbnN0IGhpZ2hXYXRlck1hcmsgPSBFeHRyYWN0SGlnaFdhdGVyTWFyayhzdHJhdGVneSwgMSk7XG5cbiAgICBTZXRVcFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJGcm9tVW5kZXJseWluZ1NpbmsodGhpcywgdW5kZXJseWluZ1NpbmssIGhpZ2hXYXRlck1hcmssIHNpemVBbGdvcml0aG0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgd2hldGhlciBvciBub3QgdGhlIHdyaXRhYmxlIHN0cmVhbSBpcyBsb2NrZWQgdG8gYSB3cml0ZXIuXG4gICAqL1xuICBnZXQgbG9ja2VkKCk6IGJvb2xlYW4ge1xuICAgIGlmICghSXNXcml0YWJsZVN0cmVhbSh0aGlzKSkge1xuICAgICAgdGhyb3cgc3RyZWFtQnJhbmRDaGVja0V4Y2VwdGlvbignbG9ja2VkJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIElzV3JpdGFibGVTdHJlYW1Mb2NrZWQodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogQWJvcnRzIHRoZSBzdHJlYW0sIHNpZ25hbGluZyB0aGF0IHRoZSBwcm9kdWNlciBjYW4gbm8gbG9uZ2VyIHN1Y2Nlc3NmdWxseSB3cml0ZSB0byB0aGUgc3RyZWFtIGFuZCBpdCBpcyB0byBiZVxuICAgKiBpbW1lZGlhdGVseSBtb3ZlZCB0byBhbiBlcnJvcmVkIHN0YXRlLCB3aXRoIGFueSBxdWV1ZWQtdXAgd3JpdGVzIGRpc2NhcmRlZC4gVGhpcyB3aWxsIGFsc28gZXhlY3V0ZSBhbnkgYWJvcnRcbiAgICogbWVjaGFuaXNtIG9mIHRoZSB1bmRlcmx5aW5nIHNpbmsuXG4gICAqXG4gICAqIFRoZSByZXR1cm5lZCBwcm9taXNlIHdpbGwgZnVsZmlsbCBpZiB0aGUgc3RyZWFtIHNodXRzIGRvd24gc3VjY2Vzc2Z1bGx5LCBvciByZWplY3QgaWYgdGhlIHVuZGVybHlpbmcgc2luayBzaWduYWxlZFxuICAgKiB0aGF0IHRoZXJlIHdhcyBhbiBlcnJvciBkb2luZyBzby4gQWRkaXRpb25hbGx5LCBpdCB3aWxsIHJlamVjdCB3aXRoIGEgYFR5cGVFcnJvcmAgKHdpdGhvdXQgYXR0ZW1wdGluZyB0byBjYW5jZWxcbiAgICogdGhlIHN0cmVhbSkgaWYgdGhlIHN0cmVhbSBpcyBjdXJyZW50bHkgbG9ja2VkLlxuICAgKi9cbiAgYWJvcnQocmVhc29uOiBhbnkgPSB1bmRlZmluZWQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIUlzV3JpdGFibGVTdHJlYW0odGhpcykpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKHN0cmVhbUJyYW5kQ2hlY2tFeGNlcHRpb24oJ2Fib3J0JykpO1xuICAgIH1cblxuICAgIGlmIChJc1dyaXRhYmxlU3RyZWFtTG9ja2VkKHRoaXMpKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChuZXcgVHlwZUVycm9yKCdDYW5ub3QgYWJvcnQgYSBzdHJlYW0gdGhhdCBhbHJlYWR5IGhhcyBhIHdyaXRlcicpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gV3JpdGFibGVTdHJlYW1BYm9ydCh0aGlzLCByZWFzb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIENsb3NlcyB0aGUgc3RyZWFtLiBUaGUgdW5kZXJseWluZyBzaW5rIHdpbGwgZmluaXNoIHByb2Nlc3NpbmcgYW55IHByZXZpb3VzbHktd3JpdHRlbiBjaHVua3MsIGJlZm9yZSBpbnZva2luZyBpdHNcbiAgICogY2xvc2UgYmVoYXZpb3IuIER1cmluZyB0aGlzIHRpbWUgYW55IGZ1cnRoZXIgYXR0ZW1wdHMgdG8gd3JpdGUgd2lsbCBmYWlsICh3aXRob3V0IGVycm9yaW5nIHRoZSBzdHJlYW0pLlxuICAgKlxuICAgKiBUaGUgbWV0aG9kIHJldHVybnMgYSBwcm9taXNlIHRoYXQgd2lsbCBmdWxmaWxsIGlmIGFsbCByZW1haW5pbmcgY2h1bmtzIGFyZSBzdWNjZXNzZnVsbHkgd3JpdHRlbiBhbmQgdGhlIHN0cmVhbVxuICAgKiBzdWNjZXNzZnVsbHkgY2xvc2VzLCBvciByZWplY3RzIGlmIGFuIGVycm9yIGlzIGVuY291bnRlcmVkIGR1cmluZyB0aGlzIHByb2Nlc3MuIEFkZGl0aW9uYWxseSwgaXQgd2lsbCByZWplY3Qgd2l0aFxuICAgKiBhIGBUeXBlRXJyb3JgICh3aXRob3V0IGF0dGVtcHRpbmcgdG8gY2FuY2VsIHRoZSBzdHJlYW0pIGlmIHRoZSBzdHJlYW0gaXMgY3VycmVudGx5IGxvY2tlZC5cbiAgICovXG4gIGNsb3NlKCkge1xuICAgIGlmICghSXNXcml0YWJsZVN0cmVhbSh0aGlzKSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoc3RyZWFtQnJhbmRDaGVja0V4Y2VwdGlvbignY2xvc2UnKSk7XG4gICAgfVxuXG4gICAgaWYgKElzV3JpdGFibGVTdHJlYW1Mb2NrZWQodGhpcykpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjbG9zZSBhIHN0cmVhbSB0aGF0IGFscmVhZHkgaGFzIGEgd3JpdGVyJykpO1xuICAgIH1cblxuICAgIGlmIChXcml0YWJsZVN0cmVhbUNsb3NlUXVldWVkT3JJbkZsaWdodCh0aGlzKSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgobmV3IFR5cGVFcnJvcignQ2Fubm90IGNsb3NlIGFuIGFscmVhZHktY2xvc2luZyBzdHJlYW0nKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFdyaXRhYmxlU3RyZWFtQ2xvc2UodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIHtAbGluayBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIgfCB3cml0ZXJ9IGFuZCBsb2NrcyB0aGUgc3RyZWFtIHRvIHRoZSBuZXcgd3JpdGVyLiBXaGlsZSB0aGUgc3RyZWFtXG4gICAqIGlzIGxvY2tlZCwgbm8gb3RoZXIgd3JpdGVyIGNhbiBiZSBhY3F1aXJlZCB1bnRpbCB0aGlzIG9uZSBpcyByZWxlYXNlZC5cbiAgICpcbiAgICogVGhpcyBmdW5jdGlvbmFsaXR5IGlzIGVzcGVjaWFsbHkgdXNlZnVsIGZvciBjcmVhdGluZyBhYnN0cmFjdGlvbnMgdGhhdCBkZXNpcmUgdGhlIGFiaWxpdHkgdG8gd3JpdGUgdG8gYSBzdHJlYW1cbiAgICogd2l0aG91dCBpbnRlcnJ1cHRpb24gb3IgaW50ZXJsZWF2aW5nLiBCeSBnZXR0aW5nIGEgd3JpdGVyIGZvciB0aGUgc3RyZWFtLCB5b3UgY2FuIGVuc3VyZSBub2JvZHkgZWxzZSBjYW4gd3JpdGUgYXRcbiAgICogdGhlIHNhbWUgdGltZSwgd2hpY2ggd291bGQgY2F1c2UgdGhlIHJlc3VsdGluZyB3cml0dGVuIGRhdGEgdG8gYmUgdW5wcmVkaWN0YWJsZSBhbmQgcHJvYmFibHkgdXNlbGVzcy5cbiAgICovXG4gIGdldFdyaXRlcigpOiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXI8Vz4ge1xuICAgIGlmICghSXNXcml0YWJsZVN0cmVhbSh0aGlzKSkge1xuICAgICAgdGhyb3cgc3RyZWFtQnJhbmRDaGVja0V4Y2VwdGlvbignZ2V0V3JpdGVyJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIEFjcXVpcmVXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIodGhpcyk7XG4gIH1cbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoV3JpdGFibGVTdHJlYW0ucHJvdG90eXBlLCB7XG4gIGFib3J0OiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgY2xvc2U6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICBnZXRXcml0ZXI6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICBsb2NrZWQ6IHsgZW51bWVyYWJsZTogdHJ1ZSB9XG59KTtcbnNldEZ1bmN0aW9uTmFtZShXcml0YWJsZVN0cmVhbS5wcm90b3R5cGUuYWJvcnQsICdhYm9ydCcpO1xuc2V0RnVuY3Rpb25OYW1lKFdyaXRhYmxlU3RyZWFtLnByb3RvdHlwZS5jbG9zZSwgJ2Nsb3NlJyk7XG5zZXRGdW5jdGlvbk5hbWUoV3JpdGFibGVTdHJlYW0ucHJvdG90eXBlLmdldFdyaXRlciwgJ2dldFdyaXRlcicpO1xuaWYgKHR5cGVvZiBTeW1ib2wudG9TdHJpbmdUYWcgPT09ICdzeW1ib2wnKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShXcml0YWJsZVN0cmVhbS5wcm90b3R5cGUsIFN5bWJvbC50b1N0cmluZ1RhZywge1xuICAgIHZhbHVlOiAnV3JpdGFibGVTdHJlYW0nLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbn1cblxuZXhwb3J0IHtcbiAgQWNxdWlyZVdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcixcbiAgQ3JlYXRlV3JpdGFibGVTdHJlYW0sXG4gIElzV3JpdGFibGVTdHJlYW0sXG4gIElzV3JpdGFibGVTdHJlYW1Mb2NrZWQsXG4gIFdyaXRhYmxlU3RyZWFtLFxuICBXcml0YWJsZVN0cmVhbUFib3J0LFxuICBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRXJyb3JJZk5lZWRlZCxcbiAgV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyQ2xvc2VXaXRoRXJyb3JQcm9wYWdhdGlvbixcbiAgV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyUmVsZWFzZSxcbiAgV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyV3JpdGUsXG4gIFdyaXRhYmxlU3RyZWFtQ2xvc2VRdWV1ZWRPckluRmxpZ2h0XG59O1xuXG5leHBvcnQgdHlwZSB7XG4gIFVuZGVybHlpbmdTaW5rLFxuICBVbmRlcmx5aW5nU2lua1N0YXJ0Q2FsbGJhY2ssXG4gIFVuZGVybHlpbmdTaW5rV3JpdGVDYWxsYmFjayxcbiAgVW5kZXJseWluZ1NpbmtDbG9zZUNhbGxiYWNrLFxuICBVbmRlcmx5aW5nU2lua0Fib3J0Q2FsbGJhY2tcbn07XG5cbi8vIEFic3RyYWN0IG9wZXJhdGlvbnMgZm9yIHRoZSBXcml0YWJsZVN0cmVhbS5cblxuZnVuY3Rpb24gQWNxdWlyZVdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcjxXPihzdHJlYW06IFdyaXRhYmxlU3RyZWFtPFc+KTogV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyPFc+IHtcbiAgcmV0dXJuIG5ldyBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIoc3RyZWFtKTtcbn1cblxuLy8gVGhyb3dzIGlmIGFuZCBvbmx5IGlmIHN0YXJ0QWxnb3JpdGhtIHRocm93cy5cbmZ1bmN0aW9uIENyZWF0ZVdyaXRhYmxlU3RyZWFtPFc+KHN0YXJ0QWxnb3JpdGhtOiAoKSA9PiB2b2lkIHwgUHJvbWlzZUxpa2U8dm9pZD4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3cml0ZUFsZ29yaXRobTogKGNodW5rOiBXKSA9PiBQcm9taXNlPHZvaWQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2VBbGdvcml0aG06ICgpID0+IFByb21pc2U8dm9pZD4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhYm9ydEFsZ29yaXRobTogKHJlYXNvbjogYW55KSA9PiBQcm9taXNlPHZvaWQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGlnaFdhdGVyTWFyayA9IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaXplQWxnb3JpdGhtOiBRdWV1aW5nU3RyYXRlZ3lTaXplQ2FsbGJhY2s8Vz4gPSAoKSA9PiAxKSB7XG4gIGFzc2VydChJc05vbk5lZ2F0aXZlTnVtYmVyKGhpZ2hXYXRlck1hcmspKTtcblxuICBjb25zdCBzdHJlYW06IFdyaXRhYmxlU3RyZWFtPFc+ID0gT2JqZWN0LmNyZWF0ZShXcml0YWJsZVN0cmVhbS5wcm90b3R5cGUpO1xuICBJbml0aWFsaXplV3JpdGFibGVTdHJlYW0oc3RyZWFtKTtcblxuICBjb25zdCBjb250cm9sbGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyPFc+ID0gT2JqZWN0LmNyZWF0ZShXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyLnByb3RvdHlwZSk7XG5cbiAgU2V0VXBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyKHN0cmVhbSwgY29udHJvbGxlciwgc3RhcnRBbGdvcml0aG0sIHdyaXRlQWxnb3JpdGhtLCBjbG9zZUFsZ29yaXRobSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFib3J0QWxnb3JpdGhtLCBoaWdoV2F0ZXJNYXJrLCBzaXplQWxnb3JpdGhtKTtcbiAgcmV0dXJuIHN0cmVhbTtcbn1cblxuZnVuY3Rpb24gSW5pdGlhbGl6ZVdyaXRhYmxlU3RyZWFtPFc+KHN0cmVhbTogV3JpdGFibGVTdHJlYW08Vz4pIHtcbiAgc3RyZWFtLl9zdGF0ZSA9ICd3cml0YWJsZSc7XG5cbiAgLy8gVGhlIGVycm9yIHRoYXQgd2lsbCBiZSByZXBvcnRlZCBieSBuZXcgbWV0aG9kIGNhbGxzIG9uY2UgdGhlIHN0YXRlIGJlY29tZXMgZXJyb3JlZC4gT25seSBzZXQgd2hlbiBbW3N0YXRlXV0gaXNcbiAgLy8gJ2Vycm9yaW5nJyBvciAnZXJyb3JlZCcuIE1heSBiZSBzZXQgdG8gYW4gdW5kZWZpbmVkIHZhbHVlLlxuICBzdHJlYW0uX3N0b3JlZEVycm9yID0gdW5kZWZpbmVkO1xuXG4gIHN0cmVhbS5fd3JpdGVyID0gdW5kZWZpbmVkO1xuXG4gIC8vIEluaXRpYWxpemUgdG8gdW5kZWZpbmVkIGZpcnN0IGJlY2F1c2UgdGhlIGNvbnN0cnVjdG9yIG9mIHRoZSBjb250cm9sbGVyIGNoZWNrcyB0aGlzXG4gIC8vIHZhcmlhYmxlIHRvIHZhbGlkYXRlIHRoZSBjYWxsZXIuXG4gIHN0cmVhbS5fd3JpdGFibGVTdHJlYW1Db250cm9sbGVyID0gdW5kZWZpbmVkITtcblxuICAvLyBUaGlzIHF1ZXVlIGlzIHBsYWNlZCBoZXJlIGluc3RlYWQgb2YgdGhlIHdyaXRlciBjbGFzcyBpbiBvcmRlciB0byBhbGxvdyBmb3IgcGFzc2luZyBhIHdyaXRlciB0byB0aGUgbmV4dCBkYXRhXG4gIC8vIHByb2R1Y2VyIHdpdGhvdXQgd2FpdGluZyBmb3IgdGhlIHF1ZXVlZCB3cml0ZXMgdG8gZmluaXNoLlxuICBzdHJlYW0uX3dyaXRlUmVxdWVzdHMgPSBuZXcgU2ltcGxlUXVldWUoKTtcblxuICAvLyBXcml0ZSByZXF1ZXN0cyBhcmUgcmVtb3ZlZCBmcm9tIF93cml0ZVJlcXVlc3RzIHdoZW4gd3JpdGUoKSBpcyBjYWxsZWQgb24gdGhlIHVuZGVybHlpbmcgc2luay4gVGhpcyBwcmV2ZW50c1xuICAvLyB0aGVtIGZyb20gYmVpbmcgZXJyb25lb3VzbHkgcmVqZWN0ZWQgb24gZXJyb3IuIElmIGEgd3JpdGUoKSBjYWxsIGlzIGluLWZsaWdodCwgdGhlIHJlcXVlc3QgaXMgc3RvcmVkIGhlcmUuXG4gIHN0cmVhbS5faW5GbGlnaHRXcml0ZVJlcXVlc3QgPSB1bmRlZmluZWQ7XG5cbiAgLy8gVGhlIHByb21pc2UgdGhhdCB3YXMgcmV0dXJuZWQgZnJvbSB3cml0ZXIuY2xvc2UoKS4gU3RvcmVkIGhlcmUgYmVjYXVzZSBpdCBtYXkgYmUgZnVsZmlsbGVkIGFmdGVyIHRoZSB3cml0ZXJcbiAgLy8gaGFzIGJlZW4gZGV0YWNoZWQuXG4gIHN0cmVhbS5fY2xvc2VSZXF1ZXN0ID0gdW5kZWZpbmVkO1xuXG4gIC8vIENsb3NlIHJlcXVlc3QgaXMgcmVtb3ZlZCBmcm9tIF9jbG9zZVJlcXVlc3Qgd2hlbiBjbG9zZSgpIGlzIGNhbGxlZCBvbiB0aGUgdW5kZXJseWluZyBzaW5rLiBUaGlzIHByZXZlbnRzIGl0XG4gIC8vIGZyb20gYmVpbmcgZXJyb25lb3VzbHkgcmVqZWN0ZWQgb24gZXJyb3IuIElmIGEgY2xvc2UoKSBjYWxsIGlzIGluLWZsaWdodCwgdGhlIHJlcXVlc3QgaXMgc3RvcmVkIGhlcmUuXG4gIHN0cmVhbS5faW5GbGlnaHRDbG9zZVJlcXVlc3QgPSB1bmRlZmluZWQ7XG5cbiAgLy8gVGhlIHByb21pc2UgdGhhdCB3YXMgcmV0dXJuZWQgZnJvbSB3cml0ZXIuYWJvcnQoKS4gVGhpcyBtYXkgYWxzbyBiZSBmdWxmaWxsZWQgYWZ0ZXIgdGhlIHdyaXRlciBoYXMgZGV0YWNoZWQuXG4gIHN0cmVhbS5fcGVuZGluZ0Fib3J0UmVxdWVzdCA9IHVuZGVmaW5lZDtcblxuICAvLyBUaGUgYmFja3ByZXNzdXJlIHNpZ25hbCBzZXQgYnkgdGhlIGNvbnRyb2xsZXIuXG4gIHN0cmVhbS5fYmFja3ByZXNzdXJlID0gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIElzV3JpdGFibGVTdHJlYW0oeDogdW5rbm93bik6IHggaXMgV3JpdGFibGVTdHJlYW0ge1xuICBpZiAoIXR5cGVJc09iamVjdCh4KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHgsICdfd3JpdGFibGVTdHJlYW1Db250cm9sbGVyJykpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4geCBpbnN0YW5jZW9mIFdyaXRhYmxlU3RyZWFtO1xufVxuXG5mdW5jdGlvbiBJc1dyaXRhYmxlU3RyZWFtTG9ja2VkKHN0cmVhbTogV3JpdGFibGVTdHJlYW0pOiBib29sZWFuIHtcbiAgYXNzZXJ0KElzV3JpdGFibGVTdHJlYW0oc3RyZWFtKSk7XG5cbiAgaWYgKHN0cmVhbS5fd3JpdGVyID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gV3JpdGFibGVTdHJlYW1BYm9ydChzdHJlYW06IFdyaXRhYmxlU3RyZWFtLCByZWFzb246IGFueSk6IFByb21pc2U8dW5kZWZpbmVkPiB7XG4gIGlmIChzdHJlYW0uX3N0YXRlID09PSAnY2xvc2VkJyB8fCBzdHJlYW0uX3N0YXRlID09PSAnZXJyb3JlZCcpIHtcbiAgICByZXR1cm4gcHJvbWlzZVJlc29sdmVkV2l0aCh1bmRlZmluZWQpO1xuICB9XG4gIHN0cmVhbS5fd3JpdGFibGVTdHJlYW1Db250cm9sbGVyLl9hYm9ydFJlYXNvbiA9IHJlYXNvbjtcbiAgc3RyZWFtLl93cml0YWJsZVN0cmVhbUNvbnRyb2xsZXIuX2Fib3J0Q29udHJvbGxlcj8uYWJvcnQocmVhc29uKTtcblxuICAvLyBUeXBlU2NyaXB0IG5hcnJvd3MgdGhlIHR5cGUgb2YgYHN0cmVhbS5fc3RhdGVgIGRvd24gdG8gJ3dyaXRhYmxlJyB8ICdlcnJvcmluZycsXG4gIC8vIGJ1dCBpdCBkb2Vzbid0IGtub3cgdGhhdCBzaWduYWxpbmcgYWJvcnQgcnVucyBhdXRob3IgY29kZSB0aGF0IG1pZ2h0IGhhdmUgY2hhbmdlZCB0aGUgc3RhdGUuXG4gIC8vIFdpZGVuIHRoZSB0eXBlIGFnYWluIGJ5IGNhc3RpbmcgdG8gV3JpdGFibGVTdHJlYW1TdGF0ZS5cbiAgY29uc3Qgc3RhdGUgPSBzdHJlYW0uX3N0YXRlIGFzIFdyaXRhYmxlU3RyZWFtU3RhdGU7XG5cbiAgaWYgKHN0YXRlID09PSAnY2xvc2VkJyB8fCBzdGF0ZSA9PT0gJ2Vycm9yZWQnKSB7XG4gICAgcmV0dXJuIHByb21pc2VSZXNvbHZlZFdpdGgodW5kZWZpbmVkKTtcbiAgfVxuICBpZiAoc3RyZWFtLl9wZW5kaW5nQWJvcnRSZXF1ZXN0ICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gc3RyZWFtLl9wZW5kaW5nQWJvcnRSZXF1ZXN0Ll9wcm9taXNlO1xuICB9XG5cbiAgYXNzZXJ0KHN0YXRlID09PSAnd3JpdGFibGUnIHx8IHN0YXRlID09PSAnZXJyb3JpbmcnKTtcblxuICBsZXQgd2FzQWxyZWFkeUVycm9yaW5nID0gZmFsc2U7XG4gIGlmIChzdGF0ZSA9PT0gJ2Vycm9yaW5nJykge1xuICAgIHdhc0FscmVhZHlFcnJvcmluZyA9IHRydWU7XG4gICAgLy8gcmVhc29uIHdpbGwgbm90IGJlIHVzZWQsIHNvIGRvbid0IGtlZXAgYSByZWZlcmVuY2UgdG8gaXQuXG4gICAgcmVhc29uID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgY29uc3QgcHJvbWlzZSA9IG5ld1Byb21pc2U8dW5kZWZpbmVkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgc3RyZWFtLl9wZW5kaW5nQWJvcnRSZXF1ZXN0ID0ge1xuICAgICAgX3Byb21pc2U6IHVuZGVmaW5lZCEsXG4gICAgICBfcmVzb2x2ZTogcmVzb2x2ZSxcbiAgICAgIF9yZWplY3Q6IHJlamVjdCxcbiAgICAgIF9yZWFzb246IHJlYXNvbixcbiAgICAgIF93YXNBbHJlYWR5RXJyb3Jpbmc6IHdhc0FscmVhZHlFcnJvcmluZ1xuICAgIH07XG4gIH0pO1xuICBzdHJlYW0uX3BlbmRpbmdBYm9ydFJlcXVlc3QhLl9wcm9taXNlID0gcHJvbWlzZTtcblxuICBpZiAoIXdhc0FscmVhZHlFcnJvcmluZykge1xuICAgIFdyaXRhYmxlU3RyZWFtU3RhcnRFcnJvcmluZyhzdHJlYW0sIHJlYXNvbik7XG4gIH1cblxuICByZXR1cm4gcHJvbWlzZTtcbn1cblxuZnVuY3Rpb24gV3JpdGFibGVTdHJlYW1DbG9zZShzdHJlYW06IFdyaXRhYmxlU3RyZWFtPGFueT4pOiBQcm9taXNlPHVuZGVmaW5lZD4ge1xuICBjb25zdCBzdGF0ZSA9IHN0cmVhbS5fc3RhdGU7XG4gIGlmIChzdGF0ZSA9PT0gJ2Nsb3NlZCcgfHwgc3RhdGUgPT09ICdlcnJvcmVkJykge1xuICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKG5ldyBUeXBlRXJyb3IoXG4gICAgICBgVGhlIHN0cmVhbSAoaW4gJHtzdGF0ZX0gc3RhdGUpIGlzIG5vdCBpbiB0aGUgd3JpdGFibGUgc3RhdGUgYW5kIGNhbm5vdCBiZSBjbG9zZWRgKSk7XG4gIH1cblxuICBhc3NlcnQoc3RhdGUgPT09ICd3cml0YWJsZScgfHwgc3RhdGUgPT09ICdlcnJvcmluZycpO1xuICBhc3NlcnQoIVdyaXRhYmxlU3RyZWFtQ2xvc2VRdWV1ZWRPckluRmxpZ2h0KHN0cmVhbSkpO1xuXG4gIGNvbnN0IHByb21pc2UgPSBuZXdQcm9taXNlPHVuZGVmaW5lZD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IGNsb3NlUmVxdWVzdDogQ2xvc2VSZXF1ZXN0ID0ge1xuICAgICAgX3Jlc29sdmU6IHJlc29sdmUsXG4gICAgICBfcmVqZWN0OiByZWplY3RcbiAgICB9O1xuXG4gICAgc3RyZWFtLl9jbG9zZVJlcXVlc3QgPSBjbG9zZVJlcXVlc3Q7XG4gIH0pO1xuXG4gIGNvbnN0IHdyaXRlciA9IHN0cmVhbS5fd3JpdGVyO1xuICBpZiAod3JpdGVyICE9PSB1bmRlZmluZWQgJiYgc3RyZWFtLl9iYWNrcHJlc3N1cmUgJiYgc3RhdGUgPT09ICd3cml0YWJsZScpIHtcbiAgICBkZWZhdWx0V3JpdGVyUmVhZHlQcm9taXNlUmVzb2x2ZSh3cml0ZXIpO1xuICB9XG5cbiAgV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNsb3NlKHN0cmVhbS5fd3JpdGFibGVTdHJlYW1Db250cm9sbGVyKTtcblxuICByZXR1cm4gcHJvbWlzZTtcbn1cblxuLy8gV3JpdGFibGVTdHJlYW0gQVBJIGV4cG9zZWQgZm9yIGNvbnRyb2xsZXJzLlxuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbUFkZFdyaXRlUmVxdWVzdChzdHJlYW06IFdyaXRhYmxlU3RyZWFtKTogUHJvbWlzZTx1bmRlZmluZWQ+IHtcbiAgYXNzZXJ0KElzV3JpdGFibGVTdHJlYW1Mb2NrZWQoc3RyZWFtKSk7XG4gIGFzc2VydChzdHJlYW0uX3N0YXRlID09PSAnd3JpdGFibGUnKTtcblxuICBjb25zdCBwcm9taXNlID0gbmV3UHJvbWlzZTx1bmRlZmluZWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCB3cml0ZVJlcXVlc3Q6IFdyaXRlUmVxdWVzdCA9IHtcbiAgICAgIF9yZXNvbHZlOiByZXNvbHZlLFxuICAgICAgX3JlamVjdDogcmVqZWN0XG4gICAgfTtcblxuICAgIHN0cmVhbS5fd3JpdGVSZXF1ZXN0cy5wdXNoKHdyaXRlUmVxdWVzdCk7XG4gIH0pO1xuXG4gIHJldHVybiBwcm9taXNlO1xufVxuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbURlYWxXaXRoUmVqZWN0aW9uKHN0cmVhbTogV3JpdGFibGVTdHJlYW0sIGVycm9yOiBhbnkpIHtcbiAgY29uc3Qgc3RhdGUgPSBzdHJlYW0uX3N0YXRlO1xuXG4gIGlmIChzdGF0ZSA9PT0gJ3dyaXRhYmxlJykge1xuICAgIFdyaXRhYmxlU3RyZWFtU3RhcnRFcnJvcmluZyhzdHJlYW0sIGVycm9yKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBhc3NlcnQoc3RhdGUgPT09ICdlcnJvcmluZycpO1xuICBXcml0YWJsZVN0cmVhbUZpbmlzaEVycm9yaW5nKHN0cmVhbSk7XG59XG5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtU3RhcnRFcnJvcmluZyhzdHJlYW06IFdyaXRhYmxlU3RyZWFtLCByZWFzb246IGFueSkge1xuICBhc3NlcnQoc3RyZWFtLl9zdG9yZWRFcnJvciA9PT0gdW5kZWZpbmVkKTtcbiAgYXNzZXJ0KHN0cmVhbS5fc3RhdGUgPT09ICd3cml0YWJsZScpO1xuXG4gIGNvbnN0IGNvbnRyb2xsZXIgPSBzdHJlYW0uX3dyaXRhYmxlU3RyZWFtQ29udHJvbGxlcjtcbiAgYXNzZXJ0KGNvbnRyb2xsZXIgIT09IHVuZGVmaW5lZCk7XG5cbiAgc3RyZWFtLl9zdGF0ZSA9ICdlcnJvcmluZyc7XG4gIHN0cmVhbS5fc3RvcmVkRXJyb3IgPSByZWFzb247XG4gIGNvbnN0IHdyaXRlciA9IHN0cmVhbS5fd3JpdGVyO1xuICBpZiAod3JpdGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXJFbnN1cmVSZWFkeVByb21pc2VSZWplY3RlZCh3cml0ZXIsIHJlYXNvbik7XG4gIH1cblxuICBpZiAoIVdyaXRhYmxlU3RyZWFtSGFzT3BlcmF0aW9uTWFya2VkSW5GbGlnaHQoc3RyZWFtKSAmJiBjb250cm9sbGVyLl9zdGFydGVkKSB7XG4gICAgV3JpdGFibGVTdHJlYW1GaW5pc2hFcnJvcmluZyhzdHJlYW0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtRmluaXNoRXJyb3Jpbmcoc3RyZWFtOiBXcml0YWJsZVN0cmVhbSkge1xuICBhc3NlcnQoc3RyZWFtLl9zdGF0ZSA9PT0gJ2Vycm9yaW5nJyk7XG4gIGFzc2VydCghV3JpdGFibGVTdHJlYW1IYXNPcGVyYXRpb25NYXJrZWRJbkZsaWdodChzdHJlYW0pKTtcbiAgc3RyZWFtLl9zdGF0ZSA9ICdlcnJvcmVkJztcbiAgc3RyZWFtLl93cml0YWJsZVN0cmVhbUNvbnRyb2xsZXJbRXJyb3JTdGVwc10oKTtcblxuICBjb25zdCBzdG9yZWRFcnJvciA9IHN0cmVhbS5fc3RvcmVkRXJyb3I7XG4gIHN0cmVhbS5fd3JpdGVSZXF1ZXN0cy5mb3JFYWNoKHdyaXRlUmVxdWVzdCA9PiB7XG4gICAgd3JpdGVSZXF1ZXN0Ll9yZWplY3Qoc3RvcmVkRXJyb3IpO1xuICB9KTtcbiAgc3RyZWFtLl93cml0ZVJlcXVlc3RzID0gbmV3IFNpbXBsZVF1ZXVlKCk7XG5cbiAgaWYgKHN0cmVhbS5fcGVuZGluZ0Fib3J0UmVxdWVzdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgV3JpdGFibGVTdHJlYW1SZWplY3RDbG9zZUFuZENsb3NlZFByb21pc2VJZk5lZWRlZChzdHJlYW0pO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGFib3J0UmVxdWVzdCA9IHN0cmVhbS5fcGVuZGluZ0Fib3J0UmVxdWVzdDtcbiAgc3RyZWFtLl9wZW5kaW5nQWJvcnRSZXF1ZXN0ID0gdW5kZWZpbmVkO1xuXG4gIGlmIChhYm9ydFJlcXVlc3QuX3dhc0FscmVhZHlFcnJvcmluZykge1xuICAgIGFib3J0UmVxdWVzdC5fcmVqZWN0KHN0b3JlZEVycm9yKTtcbiAgICBXcml0YWJsZVN0cmVhbVJlamVjdENsb3NlQW5kQ2xvc2VkUHJvbWlzZUlmTmVlZGVkKHN0cmVhbSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgcHJvbWlzZSA9IHN0cmVhbS5fd3JpdGFibGVTdHJlYW1Db250cm9sbGVyW0Fib3J0U3RlcHNdKGFib3J0UmVxdWVzdC5fcmVhc29uKTtcbiAgdXBvblByb21pc2UoXG4gICAgcHJvbWlzZSxcbiAgICAoKSA9PiB7XG4gICAgICBhYm9ydFJlcXVlc3QuX3Jlc29sdmUoKTtcbiAgICAgIFdyaXRhYmxlU3RyZWFtUmVqZWN0Q2xvc2VBbmRDbG9zZWRQcm9taXNlSWZOZWVkZWQoc3RyZWFtKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgKHJlYXNvbjogYW55KSA9PiB7XG4gICAgICBhYm9ydFJlcXVlc3QuX3JlamVjdChyZWFzb24pO1xuICAgICAgV3JpdGFibGVTdHJlYW1SZWplY3RDbG9zZUFuZENsb3NlZFByb21pc2VJZk5lZWRlZChzdHJlYW0pO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtRmluaXNoSW5GbGlnaHRXcml0ZShzdHJlYW06IFdyaXRhYmxlU3RyZWFtKSB7XG4gIGFzc2VydChzdHJlYW0uX2luRmxpZ2h0V3JpdGVSZXF1ZXN0ICE9PSB1bmRlZmluZWQpO1xuICBzdHJlYW0uX2luRmxpZ2h0V3JpdGVSZXF1ZXN0IS5fcmVzb2x2ZSh1bmRlZmluZWQpO1xuICBzdHJlYW0uX2luRmxpZ2h0V3JpdGVSZXF1ZXN0ID0gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbUZpbmlzaEluRmxpZ2h0V3JpdGVXaXRoRXJyb3Ioc3RyZWFtOiBXcml0YWJsZVN0cmVhbSwgZXJyb3I6IGFueSkge1xuICBhc3NlcnQoc3RyZWFtLl9pbkZsaWdodFdyaXRlUmVxdWVzdCAhPT0gdW5kZWZpbmVkKTtcbiAgc3RyZWFtLl9pbkZsaWdodFdyaXRlUmVxdWVzdCEuX3JlamVjdChlcnJvcik7XG4gIHN0cmVhbS5faW5GbGlnaHRXcml0ZVJlcXVlc3QgPSB1bmRlZmluZWQ7XG5cbiAgYXNzZXJ0KHN0cmVhbS5fc3RhdGUgPT09ICd3cml0YWJsZScgfHwgc3RyZWFtLl9zdGF0ZSA9PT0gJ2Vycm9yaW5nJyk7XG5cbiAgV3JpdGFibGVTdHJlYW1EZWFsV2l0aFJlamVjdGlvbihzdHJlYW0sIGVycm9yKTtcbn1cblxuZnVuY3Rpb24gV3JpdGFibGVTdHJlYW1GaW5pc2hJbkZsaWdodENsb3NlKHN0cmVhbTogV3JpdGFibGVTdHJlYW0pIHtcbiAgYXNzZXJ0KHN0cmVhbS5faW5GbGlnaHRDbG9zZVJlcXVlc3QgIT09IHVuZGVmaW5lZCk7XG4gIHN0cmVhbS5faW5GbGlnaHRDbG9zZVJlcXVlc3QhLl9yZXNvbHZlKHVuZGVmaW5lZCk7XG4gIHN0cmVhbS5faW5GbGlnaHRDbG9zZVJlcXVlc3QgPSB1bmRlZmluZWQ7XG5cbiAgY29uc3Qgc3RhdGUgPSBzdHJlYW0uX3N0YXRlO1xuXG4gIGFzc2VydChzdGF0ZSA9PT0gJ3dyaXRhYmxlJyB8fCBzdGF0ZSA9PT0gJ2Vycm9yaW5nJyk7XG5cbiAgaWYgKHN0YXRlID09PSAnZXJyb3JpbmcnKSB7XG4gICAgLy8gVGhlIGVycm9yIHdhcyB0b28gbGF0ZSB0byBkbyBhbnl0aGluZywgc28gaXQgaXMgaWdub3JlZC5cbiAgICBzdHJlYW0uX3N0b3JlZEVycm9yID0gdW5kZWZpbmVkO1xuICAgIGlmIChzdHJlYW0uX3BlbmRpbmdBYm9ydFJlcXVlc3QgIT09IHVuZGVmaW5lZCkge1xuICAgICAgc3RyZWFtLl9wZW5kaW5nQWJvcnRSZXF1ZXN0Ll9yZXNvbHZlKCk7XG4gICAgICBzdHJlYW0uX3BlbmRpbmdBYm9ydFJlcXVlc3QgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgc3RyZWFtLl9zdGF0ZSA9ICdjbG9zZWQnO1xuXG4gIGNvbnN0IHdyaXRlciA9IHN0cmVhbS5fd3JpdGVyO1xuICBpZiAod3JpdGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICBkZWZhdWx0V3JpdGVyQ2xvc2VkUHJvbWlzZVJlc29sdmUod3JpdGVyKTtcbiAgfVxuXG4gIGFzc2VydChzdHJlYW0uX3BlbmRpbmdBYm9ydFJlcXVlc3QgPT09IHVuZGVmaW5lZCk7XG4gIGFzc2VydChzdHJlYW0uX3N0b3JlZEVycm9yID09PSB1bmRlZmluZWQpO1xufVxuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbUZpbmlzaEluRmxpZ2h0Q2xvc2VXaXRoRXJyb3Ioc3RyZWFtOiBXcml0YWJsZVN0cmVhbSwgZXJyb3I6IGFueSkge1xuICBhc3NlcnQoc3RyZWFtLl9pbkZsaWdodENsb3NlUmVxdWVzdCAhPT0gdW5kZWZpbmVkKTtcbiAgc3RyZWFtLl9pbkZsaWdodENsb3NlUmVxdWVzdCEuX3JlamVjdChlcnJvcik7XG4gIHN0cmVhbS5faW5GbGlnaHRDbG9zZVJlcXVlc3QgPSB1bmRlZmluZWQ7XG5cbiAgYXNzZXJ0KHN0cmVhbS5fc3RhdGUgPT09ICd3cml0YWJsZScgfHwgc3RyZWFtLl9zdGF0ZSA9PT0gJ2Vycm9yaW5nJyk7XG5cbiAgLy8gTmV2ZXIgZXhlY3V0ZSBzaW5rIGFib3J0KCkgYWZ0ZXIgc2luayBjbG9zZSgpLlxuICBpZiAoc3RyZWFtLl9wZW5kaW5nQWJvcnRSZXF1ZXN0ICE9PSB1bmRlZmluZWQpIHtcbiAgICBzdHJlYW0uX3BlbmRpbmdBYm9ydFJlcXVlc3QuX3JlamVjdChlcnJvcik7XG4gICAgc3RyZWFtLl9wZW5kaW5nQWJvcnRSZXF1ZXN0ID0gdW5kZWZpbmVkO1xuICB9XG4gIFdyaXRhYmxlU3RyZWFtRGVhbFdpdGhSZWplY3Rpb24oc3RyZWFtLCBlcnJvcik7XG59XG5cbi8vIFRPRE8ocmljZWEpOiBGaXggYWxwaGFiZXRpY2FsIG9yZGVyLlxuZnVuY3Rpb24gV3JpdGFibGVTdHJlYW1DbG9zZVF1ZXVlZE9ySW5GbGlnaHQoc3RyZWFtOiBXcml0YWJsZVN0cmVhbSk6IGJvb2xlYW4ge1xuICBpZiAoc3RyZWFtLl9jbG9zZVJlcXVlc3QgPT09IHVuZGVmaW5lZCAmJiBzdHJlYW0uX2luRmxpZ2h0Q2xvc2VSZXF1ZXN0ID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gV3JpdGFibGVTdHJlYW1IYXNPcGVyYXRpb25NYXJrZWRJbkZsaWdodChzdHJlYW06IFdyaXRhYmxlU3RyZWFtKTogYm9vbGVhbiB7XG4gIGlmIChzdHJlYW0uX2luRmxpZ2h0V3JpdGVSZXF1ZXN0ID09PSB1bmRlZmluZWQgJiYgc3RyZWFtLl9pbkZsaWdodENsb3NlUmVxdWVzdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtTWFya0Nsb3NlUmVxdWVzdEluRmxpZ2h0KHN0cmVhbTogV3JpdGFibGVTdHJlYW0pIHtcbiAgYXNzZXJ0KHN0cmVhbS5faW5GbGlnaHRDbG9zZVJlcXVlc3QgPT09IHVuZGVmaW5lZCk7XG4gIGFzc2VydChzdHJlYW0uX2Nsb3NlUmVxdWVzdCAhPT0gdW5kZWZpbmVkKTtcbiAgc3RyZWFtLl9pbkZsaWdodENsb3NlUmVxdWVzdCA9IHN0cmVhbS5fY2xvc2VSZXF1ZXN0O1xuICBzdHJlYW0uX2Nsb3NlUmVxdWVzdCA9IHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gV3JpdGFibGVTdHJlYW1NYXJrRmlyc3RXcml0ZVJlcXVlc3RJbkZsaWdodChzdHJlYW06IFdyaXRhYmxlU3RyZWFtKSB7XG4gIGFzc2VydChzdHJlYW0uX2luRmxpZ2h0V3JpdGVSZXF1ZXN0ID09PSB1bmRlZmluZWQpO1xuICBhc3NlcnQoc3RyZWFtLl93cml0ZVJlcXVlc3RzLmxlbmd0aCAhPT0gMCk7XG4gIHN0cmVhbS5faW5GbGlnaHRXcml0ZVJlcXVlc3QgPSBzdHJlYW0uX3dyaXRlUmVxdWVzdHMuc2hpZnQoKTtcbn1cblxuZnVuY3Rpb24gV3JpdGFibGVTdHJlYW1SZWplY3RDbG9zZUFuZENsb3NlZFByb21pc2VJZk5lZWRlZChzdHJlYW06IFdyaXRhYmxlU3RyZWFtKSB7XG4gIGFzc2VydChzdHJlYW0uX3N0YXRlID09PSAnZXJyb3JlZCcpO1xuICBpZiAoc3RyZWFtLl9jbG9zZVJlcXVlc3QgIT09IHVuZGVmaW5lZCkge1xuICAgIGFzc2VydChzdHJlYW0uX2luRmxpZ2h0Q2xvc2VSZXF1ZXN0ID09PSB1bmRlZmluZWQpO1xuXG4gICAgc3RyZWFtLl9jbG9zZVJlcXVlc3QuX3JlamVjdChzdHJlYW0uX3N0b3JlZEVycm9yKTtcbiAgICBzdHJlYW0uX2Nsb3NlUmVxdWVzdCA9IHVuZGVmaW5lZDtcbiAgfVxuICBjb25zdCB3cml0ZXIgPSBzdHJlYW0uX3dyaXRlcjtcbiAgaWYgKHdyaXRlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgZGVmYXVsdFdyaXRlckNsb3NlZFByb21pc2VSZWplY3Qod3JpdGVyLCBzdHJlYW0uX3N0b3JlZEVycm9yKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbVVwZGF0ZUJhY2twcmVzc3VyZShzdHJlYW06IFdyaXRhYmxlU3RyZWFtLCBiYWNrcHJlc3N1cmU6IGJvb2xlYW4pIHtcbiAgYXNzZXJ0KHN0cmVhbS5fc3RhdGUgPT09ICd3cml0YWJsZScpO1xuICBhc3NlcnQoIVdyaXRhYmxlU3RyZWFtQ2xvc2VRdWV1ZWRPckluRmxpZ2h0KHN0cmVhbSkpO1xuXG4gIGNvbnN0IHdyaXRlciA9IHN0cmVhbS5fd3JpdGVyO1xuICBpZiAod3JpdGVyICE9PSB1bmRlZmluZWQgJiYgYmFja3ByZXNzdXJlICE9PSBzdHJlYW0uX2JhY2twcmVzc3VyZSkge1xuICAgIGlmIChiYWNrcHJlc3N1cmUpIHtcbiAgICAgIGRlZmF1bHRXcml0ZXJSZWFkeVByb21pc2VSZXNldCh3cml0ZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhc3NlcnQoIWJhY2twcmVzc3VyZSk7XG5cbiAgICAgIGRlZmF1bHRXcml0ZXJSZWFkeVByb21pc2VSZXNvbHZlKHdyaXRlcik7XG4gICAgfVxuICB9XG5cbiAgc3RyZWFtLl9iYWNrcHJlc3N1cmUgPSBiYWNrcHJlc3N1cmU7XG59XG5cbi8qKlxuICogQSBkZWZhdWx0IHdyaXRlciB2ZW5kZWQgYnkgYSB7QGxpbmsgV3JpdGFibGVTdHJlYW19LlxuICpcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNsYXNzIFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcjxXID0gYW55PiB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX293bmVyV3JpdGFibGVTdHJlYW06IFdyaXRhYmxlU3RyZWFtPFc+O1xuICAvKiogQGludGVybmFsICovXG4gIF9jbG9zZWRQcm9taXNlITogUHJvbWlzZTx1bmRlZmluZWQ+O1xuICAvKiogQGludGVybmFsICovXG4gIF9jbG9zZWRQcm9taXNlX3Jlc29sdmU/OiAodmFsdWU/OiB1bmRlZmluZWQpID0+IHZvaWQ7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2Nsb3NlZFByb21pc2VfcmVqZWN0PzogKHJlYXNvbjogYW55KSA9PiB2b2lkO1xuICAvKiogQGludGVybmFsICovXG4gIF9jbG9zZWRQcm9taXNlU3RhdGUhOiAncGVuZGluZycgfCAncmVzb2x2ZWQnIHwgJ3JlamVjdGVkJztcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcmVhZHlQcm9taXNlITogUHJvbWlzZTx1bmRlZmluZWQ+O1xuICAvKiogQGludGVybmFsICovXG4gIF9yZWFkeVByb21pc2VfcmVzb2x2ZT86ICh2YWx1ZT86IHVuZGVmaW5lZCkgPT4gdm9pZDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcmVhZHlQcm9taXNlX3JlamVjdD86IChyZWFzb246IGFueSkgPT4gdm9pZDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcmVhZHlQcm9taXNlU3RhdGUhOiAncGVuZGluZycgfCAnZnVsZmlsbGVkJyB8ICdyZWplY3RlZCc7XG5cbiAgY29uc3RydWN0b3Ioc3RyZWFtOiBXcml0YWJsZVN0cmVhbTxXPikge1xuICAgIGFzc2VydFJlcXVpcmVkQXJndW1lbnQoc3RyZWFtLCAxLCAnV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyJyk7XG4gICAgYXNzZXJ0V3JpdGFibGVTdHJlYW0oc3RyZWFtLCAnRmlyc3QgcGFyYW1ldGVyJyk7XG5cbiAgICBpZiAoSXNXcml0YWJsZVN0cmVhbUxvY2tlZChzdHJlYW0pKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGlzIHN0cmVhbSBoYXMgYWxyZWFkeSBiZWVuIGxvY2tlZCBmb3IgZXhjbHVzaXZlIHdyaXRpbmcgYnkgYW5vdGhlciB3cml0ZXInKTtcbiAgICB9XG5cbiAgICB0aGlzLl9vd25lcldyaXRhYmxlU3RyZWFtID0gc3RyZWFtO1xuICAgIHN0cmVhbS5fd3JpdGVyID0gdGhpcztcblxuICAgIGNvbnN0IHN0YXRlID0gc3RyZWFtLl9zdGF0ZTtcblxuICAgIGlmIChzdGF0ZSA9PT0gJ3dyaXRhYmxlJykge1xuICAgICAgaWYgKCFXcml0YWJsZVN0cmVhbUNsb3NlUXVldWVkT3JJbkZsaWdodChzdHJlYW0pICYmIHN0cmVhbS5fYmFja3ByZXNzdXJlKSB7XG4gICAgICAgIGRlZmF1bHRXcml0ZXJSZWFkeVByb21pc2VJbml0aWFsaXplKHRoaXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGVmYXVsdFdyaXRlclJlYWR5UHJvbWlzZUluaXRpYWxpemVBc1Jlc29sdmVkKHRoaXMpO1xuICAgICAgfVxuXG4gICAgICBkZWZhdWx0V3JpdGVyQ2xvc2VkUHJvbWlzZUluaXRpYWxpemUodGhpcyk7XG4gICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gJ2Vycm9yaW5nJykge1xuICAgICAgZGVmYXVsdFdyaXRlclJlYWR5UHJvbWlzZUluaXRpYWxpemVBc1JlamVjdGVkKHRoaXMsIHN0cmVhbS5fc3RvcmVkRXJyb3IpO1xuICAgICAgZGVmYXVsdFdyaXRlckNsb3NlZFByb21pc2VJbml0aWFsaXplKHRoaXMpO1xuICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09ICdjbG9zZWQnKSB7XG4gICAgICBkZWZhdWx0V3JpdGVyUmVhZHlQcm9taXNlSW5pdGlhbGl6ZUFzUmVzb2x2ZWQodGhpcyk7XG4gICAgICBkZWZhdWx0V3JpdGVyQ2xvc2VkUHJvbWlzZUluaXRpYWxpemVBc1Jlc29sdmVkKHRoaXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhc3NlcnQoc3RhdGUgPT09ICdlcnJvcmVkJyk7XG5cbiAgICAgIGNvbnN0IHN0b3JlZEVycm9yID0gc3RyZWFtLl9zdG9yZWRFcnJvcjtcbiAgICAgIGRlZmF1bHRXcml0ZXJSZWFkeVByb21pc2VJbml0aWFsaXplQXNSZWplY3RlZCh0aGlzLCBzdG9yZWRFcnJvcik7XG4gICAgICBkZWZhdWx0V3JpdGVyQ2xvc2VkUHJvbWlzZUluaXRpYWxpemVBc1JlamVjdGVkKHRoaXMsIHN0b3JlZEVycm9yKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHByb21pc2UgdGhhdCB3aWxsIGJlIGZ1bGZpbGxlZCB3aGVuIHRoZSBzdHJlYW0gYmVjb21lcyBjbG9zZWQsIG9yIHJlamVjdGVkIGlmIHRoZSBzdHJlYW0gZXZlciBlcnJvcnMgb3JcbiAgICogdGhlIHdyaXRlcuKAmXMgbG9jayBpcyByZWxlYXNlZCBiZWZvcmUgdGhlIHN0cmVhbSBmaW5pc2hlcyBjbG9zaW5nLlxuICAgKi9cbiAgZ2V0IGNsb3NlZCgpOiBQcm9taXNlPHVuZGVmaW5lZD4ge1xuICAgIGlmICghSXNXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIodGhpcykpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKGRlZmF1bHRXcml0ZXJCcmFuZENoZWNrRXhjZXB0aW9uKCdjbG9zZWQnKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2Nsb3NlZFByb21pc2U7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZGVzaXJlZCBzaXplIHRvIGZpbGwgdGhlIHN0cmVhbeKAmXMgaW50ZXJuYWwgcXVldWUuIEl0IGNhbiBiZSBuZWdhdGl2ZSwgaWYgdGhlIHF1ZXVlIGlzIG92ZXItZnVsbC5cbiAgICogQSBwcm9kdWNlciBjYW4gdXNlIHRoaXMgaW5mb3JtYXRpb24gdG8gZGV0ZXJtaW5lIHRoZSByaWdodCBhbW91bnQgb2YgZGF0YSB0byB3cml0ZS5cbiAgICpcbiAgICogSXQgd2lsbCBiZSBgbnVsbGAgaWYgdGhlIHN0cmVhbSBjYW5ub3QgYmUgc3VjY2Vzc2Z1bGx5IHdyaXR0ZW4gdG8gKGR1ZSB0byBlaXRoZXIgYmVpbmcgZXJyb3JlZCwgb3IgaGF2aW5nIGFuIGFib3J0XG4gICAqIHF1ZXVlZCB1cCkuIEl0IHdpbGwgcmV0dXJuIHplcm8gaWYgdGhlIHN0cmVhbSBpcyBjbG9zZWQuIEFuZCB0aGUgZ2V0dGVyIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGludm9rZWQgd2hlblxuICAgKiB0aGUgd3JpdGVy4oCZcyBsb2NrIGlzIHJlbGVhc2VkLlxuICAgKi9cbiAgZ2V0IGRlc2lyZWRTaXplKCk6IG51bWJlciB8IG51bGwge1xuICAgIGlmICghSXNXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIodGhpcykpIHtcbiAgICAgIHRocm93IGRlZmF1bHRXcml0ZXJCcmFuZENoZWNrRXhjZXB0aW9uKCdkZXNpcmVkU2l6ZScpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9vd25lcldyaXRhYmxlU3RyZWFtID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IGRlZmF1bHRXcml0ZXJMb2NrRXhjZXB0aW9uKCdkZXNpcmVkU2l6ZScpO1xuICAgIH1cblxuICAgIHJldHVybiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXJHZXREZXNpcmVkU2l6ZSh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHdpbGwgYmUgZnVsZmlsbGVkIHdoZW4gdGhlIGRlc2lyZWQgc2l6ZSB0byBmaWxsIHRoZSBzdHJlYW3igJlzIGludGVybmFsIHF1ZXVlIHRyYW5zaXRpb25zXG4gICAqIGZyb20gbm9uLXBvc2l0aXZlIHRvIHBvc2l0aXZlLCBzaWduYWxpbmcgdGhhdCBpdCBpcyBubyBsb25nZXIgYXBwbHlpbmcgYmFja3ByZXNzdXJlLiBPbmNlIHRoZSBkZXNpcmVkIHNpemUgZGlwc1xuICAgKiBiYWNrIHRvIHplcm8gb3IgYmVsb3csIHRoZSBnZXR0ZXIgd2lsbCByZXR1cm4gYSBuZXcgcHJvbWlzZSB0aGF0IHN0YXlzIHBlbmRpbmcgdW50aWwgdGhlIG5leHQgdHJhbnNpdGlvbi5cbiAgICpcbiAgICogSWYgdGhlIHN0cmVhbSBiZWNvbWVzIGVycm9yZWQgb3IgYWJvcnRlZCwgb3IgdGhlIHdyaXRlcuKAmXMgbG9jayBpcyByZWxlYXNlZCwgdGhlIHJldHVybmVkIHByb21pc2Ugd2lsbCBiZWNvbWVcbiAgICogcmVqZWN0ZWQuXG4gICAqL1xuICBnZXQgcmVhZHkoKTogUHJvbWlzZTx1bmRlZmluZWQ+IHtcbiAgICBpZiAoIUlzV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyKHRoaXMpKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChkZWZhdWx0V3JpdGVyQnJhbmRDaGVja0V4Y2VwdGlvbigncmVhZHknKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3JlYWR5UHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJZiB0aGUgcmVhZGVyIGlzIGFjdGl2ZSwgYmVoYXZlcyB0aGUgc2FtZSBhcyB7QGxpbmsgV3JpdGFibGVTdHJlYW0uYWJvcnQgfCBzdHJlYW0uYWJvcnQocmVhc29uKX0uXG4gICAqL1xuICBhYm9ydChyZWFzb246IGFueSA9IHVuZGVmaW5lZCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghSXNXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIodGhpcykpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKGRlZmF1bHRXcml0ZXJCcmFuZENoZWNrRXhjZXB0aW9uKCdhYm9ydCcpKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fb3duZXJXcml0YWJsZVN0cmVhbSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChkZWZhdWx0V3JpdGVyTG9ja0V4Y2VwdGlvbignYWJvcnQnKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlckFib3J0KHRoaXMsIHJlYXNvbik7XG4gIH1cblxuICAvKipcbiAgICogSWYgdGhlIHJlYWRlciBpcyBhY3RpdmUsIGJlaGF2ZXMgdGhlIHNhbWUgYXMge0BsaW5rIFdyaXRhYmxlU3RyZWFtLmNsb3NlIHwgc3RyZWFtLmNsb3NlKCl9LlxuICAgKi9cbiAgY2xvc2UoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCFJc1dyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcih0aGlzKSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoZGVmYXVsdFdyaXRlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ2Nsb3NlJykpO1xuICAgIH1cblxuICAgIGNvbnN0IHN0cmVhbSA9IHRoaXMuX293bmVyV3JpdGFibGVTdHJlYW07XG5cbiAgICBpZiAoc3RyZWFtID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKGRlZmF1bHRXcml0ZXJMb2NrRXhjZXB0aW9uKCdjbG9zZScpKTtcbiAgICB9XG5cbiAgICBpZiAoV3JpdGFibGVTdHJlYW1DbG9zZVF1ZXVlZE9ySW5GbGlnaHQoc3RyZWFtKSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgobmV3IFR5cGVFcnJvcignQ2Fubm90IGNsb3NlIGFuIGFscmVhZHktY2xvc2luZyBzdHJlYW0nKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlckNsb3NlKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbGVhc2VzIHRoZSB3cml0ZXLigJlzIGxvY2sgb24gdGhlIGNvcnJlc3BvbmRpbmcgc3RyZWFtLiBBZnRlciB0aGUgbG9jayBpcyByZWxlYXNlZCwgdGhlIHdyaXRlciBpcyBubyBsb25nZXIgYWN0aXZlLlxuICAgKiBJZiB0aGUgYXNzb2NpYXRlZCBzdHJlYW0gaXMgZXJyb3JlZCB3aGVuIHRoZSBsb2NrIGlzIHJlbGVhc2VkLCB0aGUgd3JpdGVyIHdpbGwgYXBwZWFyIGVycm9yZWQgaW4gdGhlIHNhbWUgd2F5IGZyb21cbiAgICogbm93IG9uOyBvdGhlcndpc2UsIHRoZSB3cml0ZXIgd2lsbCBhcHBlYXIgY2xvc2VkLlxuICAgKlxuICAgKiBOb3RlIHRoYXQgdGhlIGxvY2sgY2FuIHN0aWxsIGJlIHJlbGVhc2VkIGV2ZW4gaWYgc29tZSBvbmdvaW5nIHdyaXRlcyBoYXZlIG5vdCB5ZXQgZmluaXNoZWQgKGkuZS4gZXZlbiBpZiB0aGVcbiAgICogcHJvbWlzZXMgcmV0dXJuZWQgZnJvbSBwcmV2aW91cyBjYWxscyB0byB7QGxpbmsgV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyLndyaXRlIHwgd3JpdGUoKX0gaGF2ZSBub3QgeWV0IHNldHRsZWQpLlxuICAgKiBJdOKAmXMgbm90IG5lY2Vzc2FyeSB0byBob2xkIHRoZSBsb2NrIG9uIHRoZSB3cml0ZXIgZm9yIHRoZSBkdXJhdGlvbiBvZiB0aGUgd3JpdGU7IHRoZSBsb2NrIGluc3RlYWQgc2ltcGx5IHByZXZlbnRzXG4gICAqIG90aGVyIHByb2R1Y2VycyBmcm9tIHdyaXRpbmcgaW4gYW4gaW50ZXJsZWF2ZWQgbWFubmVyLlxuICAgKi9cbiAgcmVsZWFzZUxvY2soKTogdm9pZCB7XG4gICAgaWYgKCFJc1dyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcih0aGlzKSkge1xuICAgICAgdGhyb3cgZGVmYXVsdFdyaXRlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ3JlbGVhc2VMb2NrJyk7XG4gICAgfVxuXG4gICAgY29uc3Qgc3RyZWFtID0gdGhpcy5fb3duZXJXcml0YWJsZVN0cmVhbTtcblxuICAgIGlmIChzdHJlYW0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGFzc2VydChzdHJlYW0uX3dyaXRlciAhPT0gdW5kZWZpbmVkKTtcblxuICAgIFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlclJlbGVhc2UodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogV3JpdGVzIHRoZSBnaXZlbiBjaHVuayB0byB0aGUgd3JpdGFibGUgc3RyZWFtLCBieSB3YWl0aW5nIHVudGlsIGFueSBwcmV2aW91cyB3cml0ZXMgaGF2ZSBmaW5pc2hlZCBzdWNjZXNzZnVsbHksXG4gICAqIGFuZCB0aGVuIHNlbmRpbmcgdGhlIGNodW5rIHRvIHRoZSB1bmRlcmx5aW5nIHNpbmsncyB7QGxpbmsgVW5kZXJseWluZ1Npbmsud3JpdGUgfCB3cml0ZSgpfSBtZXRob2QuIEl0IHdpbGwgcmV0dXJuXG4gICAqIGEgcHJvbWlzZSB0aGF0IGZ1bGZpbGxzIHdpdGggdW5kZWZpbmVkIHVwb24gYSBzdWNjZXNzZnVsIHdyaXRlLCBvciByZWplY3RzIGlmIHRoZSB3cml0ZSBmYWlscyBvciBzdHJlYW0gYmVjb21lc1xuICAgKiBlcnJvcmVkIGJlZm9yZSB0aGUgd3JpdGluZyBwcm9jZXNzIGlzIGluaXRpYXRlZC5cbiAgICpcbiAgICogTm90ZSB0aGF0IHdoYXQgXCJzdWNjZXNzXCIgbWVhbnMgaXMgdXAgdG8gdGhlIHVuZGVybHlpbmcgc2luazsgaXQgbWlnaHQgaW5kaWNhdGUgc2ltcGx5IHRoYXQgdGhlIGNodW5rIGhhcyBiZWVuXG4gICAqIGFjY2VwdGVkLCBhbmQgbm90IG5lY2Vzc2FyaWx5IHRoYXQgaXQgaXMgc2FmZWx5IHNhdmVkIHRvIGl0cyB1bHRpbWF0ZSBkZXN0aW5hdGlvbi5cbiAgICovXG4gIHdyaXRlKGNodW5rOiBXKTogUHJvbWlzZTx2b2lkPjtcbiAgd3JpdGUoY2h1bms6IFcgPSB1bmRlZmluZWQhKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCFJc1dyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcih0aGlzKSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoZGVmYXVsdFdyaXRlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ3dyaXRlJykpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9vd25lcldyaXRhYmxlU3RyZWFtID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKGRlZmF1bHRXcml0ZXJMb2NrRXhjZXB0aW9uKCd3cml0ZSB0bycpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyV3JpdGUodGhpcywgY2h1bmspO1xuICB9XG59XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlci5wcm90b3R5cGUsIHtcbiAgYWJvcnQ6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICBjbG9zZTogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIHJlbGVhc2VMb2NrOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgd3JpdGU6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICBjbG9zZWQ6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICBkZXNpcmVkU2l6ZTogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIHJlYWR5OiB7IGVudW1lcmFibGU6IHRydWUgfVxufSk7XG5zZXRGdW5jdGlvbk5hbWUoV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyLnByb3RvdHlwZS5hYm9ydCwgJ2Fib3J0Jyk7XG5zZXRGdW5jdGlvbk5hbWUoV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyLnByb3RvdHlwZS5jbG9zZSwgJ2Nsb3NlJyk7XG5zZXRGdW5jdGlvbk5hbWUoV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyLnByb3RvdHlwZS5yZWxlYXNlTG9jaywgJ3JlbGVhc2VMb2NrJyk7XG5zZXRGdW5jdGlvbk5hbWUoV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyLnByb3RvdHlwZS53cml0ZSwgJ3dyaXRlJyk7XG5pZiAodHlwZW9mIFN5bWJvbC50b1N0cmluZ1RhZyA9PT0gJ3N5bWJvbCcpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlci5wcm90b3R5cGUsIFN5bWJvbC50b1N0cmluZ1RhZywge1xuICAgIHZhbHVlOiAnV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyJyxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG59XG5cbi8vIEFic3RyYWN0IG9wZXJhdGlvbnMgZm9yIHRoZSBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIuXG5cbmZ1bmN0aW9uIElzV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyPFcgPSBhbnk+KHg6IGFueSk6IHggaXMgV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyPFc+IHtcbiAgaWYgKCF0eXBlSXNPYmplY3QoeCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh4LCAnX293bmVyV3JpdGFibGVTdHJlYW0nKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB4IGluc3RhbmNlb2YgV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyO1xufVxuXG4vLyBBIGNsaWVudCBvZiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIgbWF5IHVzZSB0aGVzZSBmdW5jdGlvbnMgZGlyZWN0bHkgdG8gYnlwYXNzIHN0YXRlIGNoZWNrLlxuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXJBYm9ydCh3cml0ZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlciwgcmVhc29uOiBhbnkpIHtcbiAgY29uc3Qgc3RyZWFtID0gd3JpdGVyLl9vd25lcldyaXRhYmxlU3RyZWFtO1xuXG4gIGFzc2VydChzdHJlYW0gIT09IHVuZGVmaW5lZCk7XG5cbiAgcmV0dXJuIFdyaXRhYmxlU3RyZWFtQWJvcnQoc3RyZWFtLCByZWFzb24pO1xufVxuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXJDbG9zZSh3cml0ZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcik6IFByb21pc2U8dW5kZWZpbmVkPiB7XG4gIGNvbnN0IHN0cmVhbSA9IHdyaXRlci5fb3duZXJXcml0YWJsZVN0cmVhbTtcblxuICBhc3NlcnQoc3RyZWFtICE9PSB1bmRlZmluZWQpO1xuXG4gIHJldHVybiBXcml0YWJsZVN0cmVhbUNsb3NlKHN0cmVhbSk7XG59XG5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlckNsb3NlV2l0aEVycm9yUHJvcGFnYXRpb24od3JpdGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIpOiBQcm9taXNlPHVuZGVmaW5lZD4ge1xuICBjb25zdCBzdHJlYW0gPSB3cml0ZXIuX293bmVyV3JpdGFibGVTdHJlYW07XG5cbiAgYXNzZXJ0KHN0cmVhbSAhPT0gdW5kZWZpbmVkKTtcblxuICBjb25zdCBzdGF0ZSA9IHN0cmVhbS5fc3RhdGU7XG4gIGlmIChXcml0YWJsZVN0cmVhbUNsb3NlUXVldWVkT3JJbkZsaWdodChzdHJlYW0pIHx8IHN0YXRlID09PSAnY2xvc2VkJykge1xuICAgIHJldHVybiBwcm9taXNlUmVzb2x2ZWRXaXRoKHVuZGVmaW5lZCk7XG4gIH1cblxuICBpZiAoc3RhdGUgPT09ICdlcnJvcmVkJykge1xuICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKHN0cmVhbS5fc3RvcmVkRXJyb3IpO1xuICB9XG5cbiAgYXNzZXJ0KHN0YXRlID09PSAnd3JpdGFibGUnIHx8IHN0YXRlID09PSAnZXJyb3JpbmcnKTtcblxuICByZXR1cm4gV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyQ2xvc2Uod3JpdGVyKTtcbn1cblxuZnVuY3Rpb24gV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyRW5zdXJlQ2xvc2VkUHJvbWlzZVJlamVjdGVkKHdyaXRlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyLCBlcnJvcjogYW55KSB7XG4gIGlmICh3cml0ZXIuX2Nsb3NlZFByb21pc2VTdGF0ZSA9PT0gJ3BlbmRpbmcnKSB7XG4gICAgZGVmYXVsdFdyaXRlckNsb3NlZFByb21pc2VSZWplY3Qod3JpdGVyLCBlcnJvcik7XG4gIH0gZWxzZSB7XG4gICAgZGVmYXVsdFdyaXRlckNsb3NlZFByb21pc2VSZXNldFRvUmVqZWN0ZWQod3JpdGVyLCBlcnJvcik7XG4gIH1cbn1cblxuZnVuY3Rpb24gV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyRW5zdXJlUmVhZHlQcm9taXNlUmVqZWN0ZWQod3JpdGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIsIGVycm9yOiBhbnkpIHtcbiAgaWYgKHdyaXRlci5fcmVhZHlQcm9taXNlU3RhdGUgPT09ICdwZW5kaW5nJykge1xuICAgIGRlZmF1bHRXcml0ZXJSZWFkeVByb21pc2VSZWplY3Qod3JpdGVyLCBlcnJvcik7XG4gIH0gZWxzZSB7XG4gICAgZGVmYXVsdFdyaXRlclJlYWR5UHJvbWlzZVJlc2V0VG9SZWplY3RlZCh3cml0ZXIsIGVycm9yKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXJHZXREZXNpcmVkU2l6ZSh3cml0ZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcik6IG51bWJlciB8IG51bGwge1xuICBjb25zdCBzdHJlYW0gPSB3cml0ZXIuX293bmVyV3JpdGFibGVTdHJlYW07XG4gIGNvbnN0IHN0YXRlID0gc3RyZWFtLl9zdGF0ZTtcblxuICBpZiAoc3RhdGUgPT09ICdlcnJvcmVkJyB8fCBzdGF0ZSA9PT0gJ2Vycm9yaW5nJykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKHN0YXRlID09PSAnY2xvc2VkJykge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgcmV0dXJuIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJHZXREZXNpcmVkU2l6ZShzdHJlYW0uX3dyaXRhYmxlU3RyZWFtQ29udHJvbGxlcik7XG59XG5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlclJlbGVhc2Uod3JpdGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIpIHtcbiAgY29uc3Qgc3RyZWFtID0gd3JpdGVyLl9vd25lcldyaXRhYmxlU3RyZWFtO1xuICBhc3NlcnQoc3RyZWFtICE9PSB1bmRlZmluZWQpO1xuICBhc3NlcnQoc3RyZWFtLl93cml0ZXIgPT09IHdyaXRlcik7XG5cbiAgY29uc3QgcmVsZWFzZWRFcnJvciA9IG5ldyBUeXBlRXJyb3IoXG4gICAgYFdyaXRlciB3YXMgcmVsZWFzZWQgYW5kIGNhbiBubyBsb25nZXIgYmUgdXNlZCB0byBtb25pdG9yIHRoZSBzdHJlYW0ncyBjbG9zZWRuZXNzYCk7XG5cbiAgV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyRW5zdXJlUmVhZHlQcm9taXNlUmVqZWN0ZWQod3JpdGVyLCByZWxlYXNlZEVycm9yKTtcblxuICAvLyBUaGUgc3RhdGUgdHJhbnNpdGlvbnMgdG8gXCJlcnJvcmVkXCIgYmVmb3JlIHRoZSBzaW5rIGFib3J0KCkgbWV0aG9kIHJ1bnMsIGJ1dCB0aGUgd3JpdGVyLmNsb3NlZCBwcm9taXNlIGlzIG5vdFxuICAvLyByZWplY3RlZCB1bnRpbCBhZnRlcndhcmRzLiBUaGlzIG1lYW5zIHRoYXQgc2ltcGx5IHRlc3Rpbmcgc3RhdGUgd2lsbCBub3Qgd29yay5cbiAgV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyRW5zdXJlQ2xvc2VkUHJvbWlzZVJlamVjdGVkKHdyaXRlciwgcmVsZWFzZWRFcnJvcik7XG5cbiAgc3RyZWFtLl93cml0ZXIgPSB1bmRlZmluZWQ7XG4gIHdyaXRlci5fb3duZXJXcml0YWJsZVN0cmVhbSA9IHVuZGVmaW5lZCE7XG59XG5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcldyaXRlPFc+KHdyaXRlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyPFc+LCBjaHVuazogVyk6IFByb21pc2U8dW5kZWZpbmVkPiB7XG4gIGNvbnN0IHN0cmVhbSA9IHdyaXRlci5fb3duZXJXcml0YWJsZVN0cmVhbTtcblxuICBhc3NlcnQoc3RyZWFtICE9PSB1bmRlZmluZWQpO1xuXG4gIGNvbnN0IGNvbnRyb2xsZXIgPSBzdHJlYW0uX3dyaXRhYmxlU3RyZWFtQ29udHJvbGxlcjtcblxuICBjb25zdCBjaHVua1NpemUgPSBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyR2V0Q2h1bmtTaXplKGNvbnRyb2xsZXIsIGNodW5rKTtcblxuICBpZiAoc3RyZWFtICE9PSB3cml0ZXIuX293bmVyV3JpdGFibGVTdHJlYW0pIHtcbiAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChkZWZhdWx0V3JpdGVyTG9ja0V4Y2VwdGlvbignd3JpdGUgdG8nKSk7XG4gIH1cblxuICBjb25zdCBzdGF0ZSA9IHN0cmVhbS5fc3RhdGU7XG4gIGlmIChzdGF0ZSA9PT0gJ2Vycm9yZWQnKSB7XG4gICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoc3RyZWFtLl9zdG9yZWRFcnJvcik7XG4gIH1cbiAgaWYgKFdyaXRhYmxlU3RyZWFtQ2xvc2VRdWV1ZWRPckluRmxpZ2h0KHN0cmVhbSkgfHwgc3RhdGUgPT09ICdjbG9zZWQnKSB7XG4gICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgobmV3IFR5cGVFcnJvcignVGhlIHN0cmVhbSBpcyBjbG9zaW5nIG9yIGNsb3NlZCBhbmQgY2Fubm90IGJlIHdyaXR0ZW4gdG8nKSk7XG4gIH1cbiAgaWYgKHN0YXRlID09PSAnZXJyb3JpbmcnKSB7XG4gICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoc3RyZWFtLl9zdG9yZWRFcnJvcik7XG4gIH1cblxuICBhc3NlcnQoc3RhdGUgPT09ICd3cml0YWJsZScpO1xuXG4gIGNvbnN0IHByb21pc2UgPSBXcml0YWJsZVN0cmVhbUFkZFdyaXRlUmVxdWVzdChzdHJlYW0pO1xuXG4gIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJXcml0ZShjb250cm9sbGVyLCBjaHVuaywgY2h1bmtTaXplKTtcblxuICByZXR1cm4gcHJvbWlzZTtcbn1cblxuY29uc3QgY2xvc2VTZW50aW5lbDogdW5pcXVlIHN5bWJvbCA9IHt9IGFzIGFueTtcblxudHlwZSBRdWV1ZVJlY29yZDxXPiA9IFcgfCB0eXBlb2YgY2xvc2VTZW50aW5lbDtcblxuLyoqXG4gKiBBbGxvd3MgY29udHJvbCBvZiBhIHtAbGluayBXcml0YWJsZVN0cmVhbSB8IHdyaXRhYmxlIHN0cmVhbX0ncyBzdGF0ZSBhbmQgaW50ZXJuYWwgcXVldWUuXG4gKlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY2xhc3MgV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxXID0gYW55PiB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2NvbnRyb2xsZWRXcml0YWJsZVN0cmVhbSE6IFdyaXRhYmxlU3RyZWFtPFc+O1xuICAvKiogQGludGVybmFsICovXG4gIF9xdWV1ZSE6IFNpbXBsZVF1ZXVlPFF1ZXVlUGFpcjxRdWV1ZVJlY29yZDxXPj4+O1xuICAvKiogQGludGVybmFsICovXG4gIF9xdWV1ZVRvdGFsU2l6ZSE6IG51bWJlcjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfYWJvcnRSZWFzb246IGFueTtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfYWJvcnRDb250cm9sbGVyOiBBYm9ydENvbnRyb2xsZXIgfCB1bmRlZmluZWQ7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3N0YXJ0ZWQhOiBib29sZWFuO1xuICAvKiogQGludGVybmFsICovXG4gIF9zdHJhdGVneVNpemVBbGdvcml0aG0hOiBRdWV1aW5nU3RyYXRlZ3lTaXplQ2FsbGJhY2s8Vz47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3N0cmF0ZWd5SFdNITogbnVtYmVyO1xuICAvKiogQGludGVybmFsICovXG4gIF93cml0ZUFsZ29yaXRobSE6IChjaHVuazogVykgPT4gUHJvbWlzZTx2b2lkPjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfY2xvc2VBbGdvcml0aG0hOiAoKSA9PiBQcm9taXNlPHZvaWQ+O1xuICAvKiogQGludGVybmFsICovXG4gIF9hYm9ydEFsZ29yaXRobSE6IChyZWFzb246IGFueSkgPT4gUHJvbWlzZTx2b2lkPjtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0lsbGVnYWwgY29uc3RydWN0b3InKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgcmVhc29uIHdoaWNoIHdhcyBwYXNzZWQgdG8gYFdyaXRhYmxlU3RyZWFtLmFib3J0KHJlYXNvbilgIHdoZW4gdGhlIHN0cmVhbSB3YXMgYWJvcnRlZC5cbiAgICpcbiAgICogQGRlcHJlY2F0ZWRcbiAgICogIFRoaXMgcHJvcGVydHkgaGFzIGJlZW4gcmVtb3ZlZCBmcm9tIHRoZSBzcGVjaWZpY2F0aW9uLCBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3doYXR3Zy9zdHJlYW1zL3B1bGwvMTE3Ny5cbiAgICogIFVzZSB7QGxpbmsgV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlci5zaWduYWx9J3MgYHJlYXNvbmAgaW5zdGVhZC5cbiAgICovXG4gIGdldCBhYm9ydFJlYXNvbigpOiBhbnkge1xuICAgIGlmICghSXNXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyKHRoaXMpKSB7XG4gICAgICB0aHJvdyBkZWZhdWx0Q29udHJvbGxlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ2Fib3J0UmVhc29uJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9hYm9ydFJlYXNvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbiBgQWJvcnRTaWduYWxgIHRoYXQgY2FuIGJlIHVzZWQgdG8gYWJvcnQgdGhlIHBlbmRpbmcgd3JpdGUgb3IgY2xvc2Ugb3BlcmF0aW9uIHdoZW4gdGhlIHN0cmVhbSBpcyBhYm9ydGVkLlxuICAgKi9cbiAgZ2V0IHNpZ25hbCgpOiBBYm9ydFNpZ25hbCB7XG4gICAgaWYgKCFJc1dyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIodGhpcykpIHtcbiAgICAgIHRocm93IGRlZmF1bHRDb250cm9sbGVyQnJhbmRDaGVja0V4Y2VwdGlvbignc2lnbmFsJyk7XG4gICAgfVxuICAgIGlmICh0aGlzLl9hYm9ydENvbnRyb2xsZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gT2xkZXIgYnJvd3NlcnMgb3Igb2xkZXIgTm9kZSB2ZXJzaW9ucyBtYXkgbm90IHN1cHBvcnQgYEFib3J0Q29udHJvbGxlcmAgb3IgYEFib3J0U2lnbmFsYC5cbiAgICAgIC8vIFdlIGRvbid0IHdhbnQgdG8gYnVuZGxlIGFuZCBzaGlwIGFuIGBBYm9ydENvbnRyb2xsZXJgIHBvbHlmaWxsIHRvZ2V0aGVyIHdpdGggb3VyIHBvbHlmaWxsLFxuICAgICAgLy8gc28gaW5zdGVhZCB3ZSBvbmx5IGltcGxlbWVudCBzdXBwb3J0IGZvciBgc2lnbmFsYCBpZiB3ZSBmaW5kIGEgZ2xvYmFsIGBBYm9ydENvbnRyb2xsZXJgIGNvbnN0cnVjdG9yLlxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlci5wcm90b3R5cGUuc2lnbmFsIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2Fib3J0Q29udHJvbGxlci5zaWduYWw7XG4gIH1cblxuICAvKipcbiAgICogQ2xvc2VzIHRoZSBjb250cm9sbGVkIHdyaXRhYmxlIHN0cmVhbSwgbWFraW5nIGFsbCBmdXR1cmUgaW50ZXJhY3Rpb25zIHdpdGggaXQgZmFpbCB3aXRoIHRoZSBnaXZlbiBlcnJvciBgZWAuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGlzIHJhcmVseSB1c2VkLCBzaW5jZSB1c3VhbGx5IGl0IHN1ZmZpY2VzIHRvIHJldHVybiBhIHJlamVjdGVkIHByb21pc2UgZnJvbSBvbmUgb2YgdGhlIHVuZGVybHlpbmdcbiAgICogc2luaydzIG1ldGhvZHMuIEhvd2V2ZXIsIGl0IGNhbiBiZSB1c2VmdWwgZm9yIHN1ZGRlbmx5IHNodXR0aW5nIGRvd24gYSBzdHJlYW0gaW4gcmVzcG9uc2UgdG8gYW4gZXZlbnQgb3V0c2lkZSB0aGVcbiAgICogbm9ybWFsIGxpZmVjeWNsZSBvZiBpbnRlcmFjdGlvbnMgd2l0aCB0aGUgdW5kZXJseWluZyBzaW5rLlxuICAgKi9cbiAgZXJyb3IoZTogYW55ID0gdW5kZWZpbmVkKTogdm9pZCB7XG4gICAgaWYgKCFJc1dyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIodGhpcykpIHtcbiAgICAgIHRocm93IGRlZmF1bHRDb250cm9sbGVyQnJhbmRDaGVja0V4Y2VwdGlvbignZXJyb3InKTtcbiAgICB9XG4gICAgY29uc3Qgc3RhdGUgPSB0aGlzLl9jb250cm9sbGVkV3JpdGFibGVTdHJlYW0uX3N0YXRlO1xuICAgIGlmIChzdGF0ZSAhPT0gJ3dyaXRhYmxlJykge1xuICAgICAgLy8gVGhlIHN0cmVhbSBpcyBjbG9zZWQsIGVycm9yZWQgb3Igd2lsbCBiZSBzb29uLiBUaGUgc2luayBjYW4ndCBkbyBhbnl0aGluZyB1c2VmdWwgaWYgaXQgZ2V0cyBhbiBlcnJvciBoZXJlLCBzb1xuICAgICAgLy8ganVzdCB0cmVhdCBpdCBhcyBhIG5vLW9wLlxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFcnJvcih0aGlzLCBlKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgW0Fib3J0U3RlcHNdKHJlYXNvbjogYW55KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5fYWJvcnRBbGdvcml0aG0ocmVhc29uKTtcbiAgICBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2xlYXJBbGdvcml0aG1zKHRoaXMpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIFtFcnJvclN0ZXBzXSgpIHtcbiAgICBSZXNldFF1ZXVlKHRoaXMpO1xuICB9XG59XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIucHJvdG90eXBlLCB7XG4gIGFib3J0UmVhc29uOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgc2lnbmFsOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgZXJyb3I6IHsgZW51bWVyYWJsZTogdHJ1ZSB9XG59KTtcbmlmICh0eXBlb2YgU3ltYm9sLnRvU3RyaW5nVGFnID09PSAnc3ltYm9sJykge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlci5wcm90b3R5cGUsIFN5bWJvbC50b1N0cmluZ1RhZywge1xuICAgIHZhbHVlOiAnV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcicsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xufVxuXG4vLyBBYnN0cmFjdCBvcGVyYXRpb25zIGltcGxlbWVudGluZyBpbnRlcmZhY2UgcmVxdWlyZWQgYnkgdGhlIFdyaXRhYmxlU3RyZWFtLlxuXG5mdW5jdGlvbiBJc1dyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIoeDogYW55KTogeCBpcyBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyPGFueT4ge1xuICBpZiAoIXR5cGVJc09iamVjdCh4KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHgsICdfY29udHJvbGxlZFdyaXRhYmxlU3RyZWFtJykpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4geCBpbnN0YW5jZW9mIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI7XG59XG5cbmZ1bmN0aW9uIFNldFVwV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxXPihzdHJlYW06IFdyaXRhYmxlU3RyZWFtPFc+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8Vz4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRBbGdvcml0aG06ICgpID0+IHZvaWQgfCBQcm9taXNlTGlrZTx2b2lkPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3cml0ZUFsZ29yaXRobTogKGNodW5rOiBXKSA9PiBQcm9taXNlPHZvaWQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsb3NlQWxnb3JpdGhtOiAoKSA9PiBQcm9taXNlPHZvaWQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFib3J0QWxnb3JpdGhtOiAocmVhc29uOiBhbnkpID0+IFByb21pc2U8dm9pZD4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGlnaFdhdGVyTWFyazogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpemVBbGdvcml0aG06IFF1ZXVpbmdTdHJhdGVneVNpemVDYWxsYmFjazxXPikge1xuICBhc3NlcnQoSXNXcml0YWJsZVN0cmVhbShzdHJlYW0pKTtcbiAgYXNzZXJ0KHN0cmVhbS5fd3JpdGFibGVTdHJlYW1Db250cm9sbGVyID09PSB1bmRlZmluZWQpO1xuXG4gIGNvbnRyb2xsZXIuX2NvbnRyb2xsZWRXcml0YWJsZVN0cmVhbSA9IHN0cmVhbTtcbiAgc3RyZWFtLl93cml0YWJsZVN0cmVhbUNvbnRyb2xsZXIgPSBjb250cm9sbGVyO1xuXG4gIC8vIE5lZWQgdG8gc2V0IHRoZSBzbG90cyBzbyB0aGF0IHRoZSBhc3NlcnQgZG9lc24ndCBmaXJlLiBJbiB0aGUgc3BlYyB0aGUgc2xvdHMgYWxyZWFkeSBleGlzdCBpbXBsaWNpdGx5LlxuICBjb250cm9sbGVyLl9xdWV1ZSA9IHVuZGVmaW5lZCE7XG4gIGNvbnRyb2xsZXIuX3F1ZXVlVG90YWxTaXplID0gdW5kZWZpbmVkITtcbiAgUmVzZXRRdWV1ZShjb250cm9sbGVyKTtcblxuICBjb250cm9sbGVyLl9hYm9ydFJlYXNvbiA9IHVuZGVmaW5lZDtcbiAgY29udHJvbGxlci5fYWJvcnRDb250cm9sbGVyID0gY3JlYXRlQWJvcnRDb250cm9sbGVyKCk7XG4gIGNvbnRyb2xsZXIuX3N0YXJ0ZWQgPSBmYWxzZTtcblxuICBjb250cm9sbGVyLl9zdHJhdGVneVNpemVBbGdvcml0aG0gPSBzaXplQWxnb3JpdGhtO1xuICBjb250cm9sbGVyLl9zdHJhdGVneUhXTSA9IGhpZ2hXYXRlck1hcms7XG5cbiAgY29udHJvbGxlci5fd3JpdGVBbGdvcml0aG0gPSB3cml0ZUFsZ29yaXRobTtcbiAgY29udHJvbGxlci5fY2xvc2VBbGdvcml0aG0gPSBjbG9zZUFsZ29yaXRobTtcbiAgY29udHJvbGxlci5fYWJvcnRBbGdvcml0aG0gPSBhYm9ydEFsZ29yaXRobTtcblxuICBjb25zdCBiYWNrcHJlc3N1cmUgPSBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyR2V0QmFja3ByZXNzdXJlKGNvbnRyb2xsZXIpO1xuICBXcml0YWJsZVN0cmVhbVVwZGF0ZUJhY2twcmVzc3VyZShzdHJlYW0sIGJhY2twcmVzc3VyZSk7XG5cbiAgY29uc3Qgc3RhcnRSZXN1bHQgPSBzdGFydEFsZ29yaXRobSgpO1xuICBjb25zdCBzdGFydFByb21pc2UgPSBwcm9taXNlUmVzb2x2ZWRXaXRoKHN0YXJ0UmVzdWx0KTtcbiAgdXBvblByb21pc2UoXG4gICAgc3RhcnRQcm9taXNlLFxuICAgICgpID0+IHtcbiAgICAgIGFzc2VydChzdHJlYW0uX3N0YXRlID09PSAnd3JpdGFibGUnIHx8IHN0cmVhbS5fc3RhdGUgPT09ICdlcnJvcmluZycpO1xuICAgICAgY29udHJvbGxlci5fc3RhcnRlZCA9IHRydWU7XG4gICAgICBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQWR2YW5jZVF1ZXVlSWZOZWVkZWQoY29udHJvbGxlcik7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIHIgPT4ge1xuICAgICAgYXNzZXJ0KHN0cmVhbS5fc3RhdGUgPT09ICd3cml0YWJsZScgfHwgc3RyZWFtLl9zdGF0ZSA9PT0gJ2Vycm9yaW5nJyk7XG4gICAgICBjb250cm9sbGVyLl9zdGFydGVkID0gdHJ1ZTtcbiAgICAgIFdyaXRhYmxlU3RyZWFtRGVhbFdpdGhSZWplY3Rpb24oc3RyZWFtLCByKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgKTtcbn1cblxuZnVuY3Rpb24gU2V0VXBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRnJvbVVuZGVybHlpbmdTaW5rPFc+KHN0cmVhbTogV3JpdGFibGVTdHJlYW08Vz4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5kZXJseWluZ1Npbms6IFZhbGlkYXRlZFVuZGVybHlpbmdTaW5rPFc+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhpZ2hXYXRlck1hcms6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaXplQWxnb3JpdGhtOiBRdWV1aW5nU3RyYXRlZ3lTaXplQ2FsbGJhY2s8Vz4pIHtcbiAgY29uc3QgY29udHJvbGxlciA9IE9iamVjdC5jcmVhdGUoV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlci5wcm90b3R5cGUpO1xuXG4gIGxldCBzdGFydEFsZ29yaXRobTogKCkgPT4gdm9pZCB8IFByb21pc2VMaWtlPHZvaWQ+O1xuICBsZXQgd3JpdGVBbGdvcml0aG06IChjaHVuazogVykgPT4gUHJvbWlzZTx2b2lkPjtcbiAgbGV0IGNsb3NlQWxnb3JpdGhtOiAoKSA9PiBQcm9taXNlPHZvaWQ+O1xuICBsZXQgYWJvcnRBbGdvcml0aG06IChyZWFzb246IGFueSkgPT4gUHJvbWlzZTx2b2lkPjtcblxuICBpZiAodW5kZXJseWluZ1Npbmsuc3RhcnQgIT09IHVuZGVmaW5lZCkge1xuICAgIHN0YXJ0QWxnb3JpdGhtID0gKCkgPT4gdW5kZXJseWluZ1Npbmsuc3RhcnQhKGNvbnRyb2xsZXIpO1xuICB9IGVsc2Uge1xuICAgIHN0YXJ0QWxnb3JpdGhtID0gKCkgPT4gdW5kZWZpbmVkO1xuICB9XG4gIGlmICh1bmRlcmx5aW5nU2luay53cml0ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgd3JpdGVBbGdvcml0aG0gPSBjaHVuayA9PiB1bmRlcmx5aW5nU2luay53cml0ZSEoY2h1bmssIGNvbnRyb2xsZXIpO1xuICB9IGVsc2Uge1xuICAgIHdyaXRlQWxnb3JpdGhtID0gKCkgPT4gcHJvbWlzZVJlc29sdmVkV2l0aCh1bmRlZmluZWQpO1xuICB9XG4gIGlmICh1bmRlcmx5aW5nU2luay5jbG9zZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgY2xvc2VBbGdvcml0aG0gPSAoKSA9PiB1bmRlcmx5aW5nU2luay5jbG9zZSEoKTtcbiAgfSBlbHNlIHtcbiAgICBjbG9zZUFsZ29yaXRobSA9ICgpID0+IHByb21pc2VSZXNvbHZlZFdpdGgodW5kZWZpbmVkKTtcbiAgfVxuICBpZiAodW5kZXJseWluZ1NpbmsuYWJvcnQgIT09IHVuZGVmaW5lZCkge1xuICAgIGFib3J0QWxnb3JpdGhtID0gcmVhc29uID0+IHVuZGVybHlpbmdTaW5rLmFib3J0IShyZWFzb24pO1xuICB9IGVsc2Uge1xuICAgIGFib3J0QWxnb3JpdGhtID0gKCkgPT4gcHJvbWlzZVJlc29sdmVkV2l0aCh1bmRlZmluZWQpO1xuICB9XG5cbiAgU2V0VXBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyKFxuICAgIHN0cmVhbSwgY29udHJvbGxlciwgc3RhcnRBbGdvcml0aG0sIHdyaXRlQWxnb3JpdGhtLCBjbG9zZUFsZ29yaXRobSwgYWJvcnRBbGdvcml0aG0sIGhpZ2hXYXRlck1hcmssIHNpemVBbGdvcml0aG1cbiAgKTtcbn1cblxuLy8gQ2xlYXJBbGdvcml0aG1zIG1heSBiZSBjYWxsZWQgdHdpY2UuIEVycm9yaW5nIHRoZSBzYW1lIHN0cmVhbSBpbiBtdWx0aXBsZSB3YXlzIHdpbGwgb2Z0ZW4gcmVzdWx0IGluIHJlZHVuZGFudCBjYWxscy5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDbGVhckFsZ29yaXRobXMoY29udHJvbGxlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxhbnk+KSB7XG4gIGNvbnRyb2xsZXIuX3dyaXRlQWxnb3JpdGhtID0gdW5kZWZpbmVkITtcbiAgY29udHJvbGxlci5fY2xvc2VBbGdvcml0aG0gPSB1bmRlZmluZWQhO1xuICBjb250cm9sbGVyLl9hYm9ydEFsZ29yaXRobSA9IHVuZGVmaW5lZCE7XG4gIGNvbnRyb2xsZXIuX3N0cmF0ZWd5U2l6ZUFsZ29yaXRobSA9IHVuZGVmaW5lZCE7XG59XG5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDbG9zZTxXPihjb250cm9sbGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyPFc+KSB7XG4gIEVucXVldWVWYWx1ZVdpdGhTaXplKGNvbnRyb2xsZXIsIGNsb3NlU2VudGluZWwsIDApO1xuICBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQWR2YW5jZVF1ZXVlSWZOZWVkZWQoY29udHJvbGxlcik7XG59XG5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJHZXRDaHVua1NpemU8Vz4oY29udHJvbGxlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxXPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2h1bms6IFcpOiBudW1iZXIge1xuICB0cnkge1xuICAgIHJldHVybiBjb250cm9sbGVyLl9zdHJhdGVneVNpemVBbGdvcml0aG0oY2h1bmspO1xuICB9IGNhdGNoIChjaHVua1NpemVFKSB7XG4gICAgV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVycm9ySWZOZWVkZWQoY29udHJvbGxlciwgY2h1bmtTaXplRSk7XG4gICAgcmV0dXJuIDE7XG4gIH1cbn1cblxuZnVuY3Rpb24gV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckdldERlc2lyZWRTaXplKGNvbnRyb2xsZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8YW55Pik6IG51bWJlciB7XG4gIHJldHVybiBjb250cm9sbGVyLl9zdHJhdGVneUhXTSAtIGNvbnRyb2xsZXIuX3F1ZXVlVG90YWxTaXplO1xufVxuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyV3JpdGU8Vz4oY29udHJvbGxlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxXPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaHVuazogVyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaHVua1NpemU6IG51bWJlcikge1xuICB0cnkge1xuICAgIEVucXVldWVWYWx1ZVdpdGhTaXplKGNvbnRyb2xsZXIsIGNodW5rLCBjaHVua1NpemUpO1xuICB9IGNhdGNoIChlbnF1ZXVlRSkge1xuICAgIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFcnJvcklmTmVlZGVkKGNvbnRyb2xsZXIsIGVucXVldWVFKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBzdHJlYW0gPSBjb250cm9sbGVyLl9jb250cm9sbGVkV3JpdGFibGVTdHJlYW07XG4gIGlmICghV3JpdGFibGVTdHJlYW1DbG9zZVF1ZXVlZE9ySW5GbGlnaHQoc3RyZWFtKSAmJiBzdHJlYW0uX3N0YXRlID09PSAnd3JpdGFibGUnKSB7XG4gICAgY29uc3QgYmFja3ByZXNzdXJlID0gV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckdldEJhY2twcmVzc3VyZShjb250cm9sbGVyKTtcbiAgICBXcml0YWJsZVN0cmVhbVVwZGF0ZUJhY2twcmVzc3VyZShzdHJlYW0sIGJhY2twcmVzc3VyZSk7XG4gIH1cblxuICBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQWR2YW5jZVF1ZXVlSWZOZWVkZWQoY29udHJvbGxlcik7XG59XG5cbi8vIEFic3RyYWN0IG9wZXJhdGlvbnMgZm9yIHRoZSBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyLlxuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQWR2YW5jZVF1ZXVlSWZOZWVkZWQ8Vz4oY29udHJvbGxlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxXPikge1xuICBjb25zdCBzdHJlYW0gPSBjb250cm9sbGVyLl9jb250cm9sbGVkV3JpdGFibGVTdHJlYW07XG5cbiAgaWYgKCFjb250cm9sbGVyLl9zdGFydGVkKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKHN0cmVhbS5faW5GbGlnaHRXcml0ZVJlcXVlc3QgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHN0YXRlID0gc3RyZWFtLl9zdGF0ZTtcbiAgYXNzZXJ0KHN0YXRlICE9PSAnY2xvc2VkJyAmJiBzdGF0ZSAhPT0gJ2Vycm9yZWQnKTtcbiAgaWYgKHN0YXRlID09PSAnZXJyb3JpbmcnKSB7XG4gICAgV3JpdGFibGVTdHJlYW1GaW5pc2hFcnJvcmluZyhzdHJlYW0pO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChjb250cm9sbGVyLl9xdWV1ZS5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCB2YWx1ZSA9IFBlZWtRdWV1ZVZhbHVlKGNvbnRyb2xsZXIpO1xuICBpZiAodmFsdWUgPT09IGNsb3NlU2VudGluZWwpIHtcbiAgICBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyUHJvY2Vzc0Nsb3NlKGNvbnRyb2xsZXIpO1xuICB9IGVsc2Uge1xuICAgIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJQcm9jZXNzV3JpdGUoY29udHJvbGxlciwgdmFsdWUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFcnJvcklmTmVlZGVkKGNvbnRyb2xsZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8YW55PiwgZXJyb3I6IGFueSkge1xuICBpZiAoY29udHJvbGxlci5fY29udHJvbGxlZFdyaXRhYmxlU3RyZWFtLl9zdGF0ZSA9PT0gJ3dyaXRhYmxlJykge1xuICAgIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFcnJvcihjb250cm9sbGVyLCBlcnJvcik7XG4gIH1cbn1cblxuZnVuY3Rpb24gV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlclByb2Nlc3NDbG9zZShjb250cm9sbGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyPGFueT4pIHtcbiAgY29uc3Qgc3RyZWFtID0gY29udHJvbGxlci5fY29udHJvbGxlZFdyaXRhYmxlU3RyZWFtO1xuXG4gIFdyaXRhYmxlU3RyZWFtTWFya0Nsb3NlUmVxdWVzdEluRmxpZ2h0KHN0cmVhbSk7XG5cbiAgRGVxdWV1ZVZhbHVlKGNvbnRyb2xsZXIpO1xuICBhc3NlcnQoY29udHJvbGxlci5fcXVldWUubGVuZ3RoID09PSAwKTtcblxuICBjb25zdCBzaW5rQ2xvc2VQcm9taXNlID0gY29udHJvbGxlci5fY2xvc2VBbGdvcml0aG0oKTtcbiAgV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNsZWFyQWxnb3JpdGhtcyhjb250cm9sbGVyKTtcbiAgdXBvblByb21pc2UoXG4gICAgc2lua0Nsb3NlUHJvbWlzZSxcbiAgICAoKSA9PiB7XG4gICAgICBXcml0YWJsZVN0cmVhbUZpbmlzaEluRmxpZ2h0Q2xvc2Uoc3RyZWFtKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgcmVhc29uID0+IHtcbiAgICAgIFdyaXRhYmxlU3RyZWFtRmluaXNoSW5GbGlnaHRDbG9zZVdpdGhFcnJvcihzdHJlYW0sIHJlYXNvbik7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICk7XG59XG5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJQcm9jZXNzV3JpdGU8Vz4oY29udHJvbGxlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxXPiwgY2h1bms6IFcpIHtcbiAgY29uc3Qgc3RyZWFtID0gY29udHJvbGxlci5fY29udHJvbGxlZFdyaXRhYmxlU3RyZWFtO1xuXG4gIFdyaXRhYmxlU3RyZWFtTWFya0ZpcnN0V3JpdGVSZXF1ZXN0SW5GbGlnaHQoc3RyZWFtKTtcblxuICBjb25zdCBzaW5rV3JpdGVQcm9taXNlID0gY29udHJvbGxlci5fd3JpdGVBbGdvcml0aG0oY2h1bmspO1xuICB1cG9uUHJvbWlzZShcbiAgICBzaW5rV3JpdGVQcm9taXNlLFxuICAgICgpID0+IHtcbiAgICAgIFdyaXRhYmxlU3RyZWFtRmluaXNoSW5GbGlnaHRXcml0ZShzdHJlYW0pO1xuXG4gICAgICBjb25zdCBzdGF0ZSA9IHN0cmVhbS5fc3RhdGU7XG4gICAgICBhc3NlcnQoc3RhdGUgPT09ICd3cml0YWJsZScgfHwgc3RhdGUgPT09ICdlcnJvcmluZycpO1xuXG4gICAgICBEZXF1ZXVlVmFsdWUoY29udHJvbGxlcik7XG5cbiAgICAgIGlmICghV3JpdGFibGVTdHJlYW1DbG9zZVF1ZXVlZE9ySW5GbGlnaHQoc3RyZWFtKSAmJiBzdGF0ZSA9PT0gJ3dyaXRhYmxlJykge1xuICAgICAgICBjb25zdCBiYWNrcHJlc3N1cmUgPSBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyR2V0QmFja3ByZXNzdXJlKGNvbnRyb2xsZXIpO1xuICAgICAgICBXcml0YWJsZVN0cmVhbVVwZGF0ZUJhY2twcmVzc3VyZShzdHJlYW0sIGJhY2twcmVzc3VyZSk7XG4gICAgICB9XG5cbiAgICAgIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJBZHZhbmNlUXVldWVJZk5lZWRlZChjb250cm9sbGVyKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgcmVhc29uID0+IHtcbiAgICAgIGlmIChzdHJlYW0uX3N0YXRlID09PSAnd3JpdGFibGUnKSB7XG4gICAgICAgIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDbGVhckFsZ29yaXRobXMoY29udHJvbGxlcik7XG4gICAgICB9XG4gICAgICBXcml0YWJsZVN0cmVhbUZpbmlzaEluRmxpZ2h0V3JpdGVXaXRoRXJyb3Ioc3RyZWFtLCByZWFzb24pO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICApO1xufVxuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyR2V0QmFja3ByZXNzdXJlKGNvbnRyb2xsZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8YW55Pik6IGJvb2xlYW4ge1xuICBjb25zdCBkZXNpcmVkU2l6ZSA9IFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJHZXREZXNpcmVkU2l6ZShjb250cm9sbGVyKTtcbiAgcmV0dXJuIGRlc2lyZWRTaXplIDw9IDA7XG59XG5cbi8vIEEgY2xpZW50IG9mIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIgbWF5IHVzZSB0aGVzZSBmdW5jdGlvbnMgZGlyZWN0bHkgdG8gYnlwYXNzIHN0YXRlIGNoZWNrLlxuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRXJyb3IoY29udHJvbGxlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxhbnk+LCBlcnJvcjogYW55KSB7XG4gIGNvbnN0IHN0cmVhbSA9IGNvbnRyb2xsZXIuX2NvbnRyb2xsZWRXcml0YWJsZVN0cmVhbTtcblxuICBhc3NlcnQoc3RyZWFtLl9zdGF0ZSA9PT0gJ3dyaXRhYmxlJyk7XG5cbiAgV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNsZWFyQWxnb3JpdGhtcyhjb250cm9sbGVyKTtcbiAgV3JpdGFibGVTdHJlYW1TdGFydEVycm9yaW5nKHN0cmVhbSwgZXJyb3IpO1xufVxuXG4vLyBIZWxwZXIgZnVuY3Rpb25zIGZvciB0aGUgV3JpdGFibGVTdHJlYW0uXG5cbmZ1bmN0aW9uIHN0cmVhbUJyYW5kQ2hlY2tFeGNlcHRpb24obmFtZTogc3RyaW5nKTogVHlwZUVycm9yIHtcbiAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoYFdyaXRhYmxlU3RyZWFtLnByb3RvdHlwZS4ke25hbWV9IGNhbiBvbmx5IGJlIHVzZWQgb24gYSBXcml0YWJsZVN0cmVhbWApO1xufVxuXG4vLyBIZWxwZXIgZnVuY3Rpb25zIGZvciB0aGUgV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlci5cblxuZnVuY3Rpb24gZGVmYXVsdENvbnRyb2xsZXJCcmFuZENoZWNrRXhjZXB0aW9uKG5hbWU6IHN0cmluZyk6IFR5cGVFcnJvciB7XG4gIHJldHVybiBuZXcgVHlwZUVycm9yKFxuICAgIGBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyLnByb3RvdHlwZS4ke25hbWV9IGNhbiBvbmx5IGJlIHVzZWQgb24gYSBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyYCk7XG59XG5cblxuLy8gSGVscGVyIGZ1bmN0aW9ucyBmb3IgdGhlIFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlci5cblxuZnVuY3Rpb24gZGVmYXVsdFdyaXRlckJyYW5kQ2hlY2tFeGNlcHRpb24obmFtZTogc3RyaW5nKTogVHlwZUVycm9yIHtcbiAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoXG4gICAgYFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlci5wcm90b3R5cGUuJHtuYW1lfSBjYW4gb25seSBiZSB1c2VkIG9uIGEgV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyYCk7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRXcml0ZXJMb2NrRXhjZXB0aW9uKG5hbWU6IHN0cmluZyk6IFR5cGVFcnJvciB7XG4gIHJldHVybiBuZXcgVHlwZUVycm9yKCdDYW5ub3QgJyArIG5hbWUgKyAnIGEgc3RyZWFtIHVzaW5nIGEgcmVsZWFzZWQgd3JpdGVyJyk7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRXcml0ZXJDbG9zZWRQcm9taXNlSW5pdGlhbGl6ZSh3cml0ZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcikge1xuICB3cml0ZXIuX2Nsb3NlZFByb21pc2UgPSBuZXdQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICB3cml0ZXIuX2Nsb3NlZFByb21pc2VfcmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgd3JpdGVyLl9jbG9zZWRQcm9taXNlX3JlamVjdCA9IHJlamVjdDtcbiAgICB3cml0ZXIuX2Nsb3NlZFByb21pc2VTdGF0ZSA9ICdwZW5kaW5nJztcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRXcml0ZXJDbG9zZWRQcm9taXNlSW5pdGlhbGl6ZUFzUmVqZWN0ZWQod3JpdGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIsIHJlYXNvbjogYW55KSB7XG4gIGRlZmF1bHRXcml0ZXJDbG9zZWRQcm9taXNlSW5pdGlhbGl6ZSh3cml0ZXIpO1xuICBkZWZhdWx0V3JpdGVyQ2xvc2VkUHJvbWlzZVJlamVjdCh3cml0ZXIsIHJlYXNvbik7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRXcml0ZXJDbG9zZWRQcm9taXNlSW5pdGlhbGl6ZUFzUmVzb2x2ZWQod3JpdGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIpIHtcbiAgZGVmYXVsdFdyaXRlckNsb3NlZFByb21pc2VJbml0aWFsaXplKHdyaXRlcik7XG4gIGRlZmF1bHRXcml0ZXJDbG9zZWRQcm9taXNlUmVzb2x2ZSh3cml0ZXIpO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0V3JpdGVyQ2xvc2VkUHJvbWlzZVJlamVjdCh3cml0ZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlciwgcmVhc29uOiBhbnkpIHtcbiAgaWYgKHdyaXRlci5fY2xvc2VkUHJvbWlzZV9yZWplY3QgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybjtcbiAgfVxuICBhc3NlcnQod3JpdGVyLl9jbG9zZWRQcm9taXNlU3RhdGUgPT09ICdwZW5kaW5nJyk7XG5cbiAgc2V0UHJvbWlzZUlzSGFuZGxlZFRvVHJ1ZSh3cml0ZXIuX2Nsb3NlZFByb21pc2UpO1xuICB3cml0ZXIuX2Nsb3NlZFByb21pc2VfcmVqZWN0KHJlYXNvbik7XG4gIHdyaXRlci5fY2xvc2VkUHJvbWlzZV9yZXNvbHZlID0gdW5kZWZpbmVkO1xuICB3cml0ZXIuX2Nsb3NlZFByb21pc2VfcmVqZWN0ID0gdW5kZWZpbmVkO1xuICB3cml0ZXIuX2Nsb3NlZFByb21pc2VTdGF0ZSA9ICdyZWplY3RlZCc7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRXcml0ZXJDbG9zZWRQcm9taXNlUmVzZXRUb1JlamVjdGVkKHdyaXRlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyLCByZWFzb246IGFueSkge1xuICBhc3NlcnQod3JpdGVyLl9jbG9zZWRQcm9taXNlX3Jlc29sdmUgPT09IHVuZGVmaW5lZCk7XG4gIGFzc2VydCh3cml0ZXIuX2Nsb3NlZFByb21pc2VfcmVqZWN0ID09PSB1bmRlZmluZWQpO1xuICBhc3NlcnQod3JpdGVyLl9jbG9zZWRQcm9taXNlU3RhdGUgIT09ICdwZW5kaW5nJyk7XG5cbiAgZGVmYXVsdFdyaXRlckNsb3NlZFByb21pc2VJbml0aWFsaXplQXNSZWplY3RlZCh3cml0ZXIsIHJlYXNvbik7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRXcml0ZXJDbG9zZWRQcm9taXNlUmVzb2x2ZSh3cml0ZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcikge1xuICBpZiAod3JpdGVyLl9jbG9zZWRQcm9taXNlX3Jlc29sdmUgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybjtcbiAgfVxuICBhc3NlcnQod3JpdGVyLl9jbG9zZWRQcm9taXNlU3RhdGUgPT09ICdwZW5kaW5nJyk7XG5cbiAgd3JpdGVyLl9jbG9zZWRQcm9taXNlX3Jlc29sdmUodW5kZWZpbmVkKTtcbiAgd3JpdGVyLl9jbG9zZWRQcm9taXNlX3Jlc29sdmUgPSB1bmRlZmluZWQ7XG4gIHdyaXRlci5fY2xvc2VkUHJvbWlzZV9yZWplY3QgPSB1bmRlZmluZWQ7XG4gIHdyaXRlci5fY2xvc2VkUHJvbWlzZVN0YXRlID0gJ3Jlc29sdmVkJztcbn1cblxuZnVuY3Rpb24gZGVmYXVsdFdyaXRlclJlYWR5UHJvbWlzZUluaXRpYWxpemUod3JpdGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIpIHtcbiAgd3JpdGVyLl9yZWFkeVByb21pc2UgPSBuZXdQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICB3cml0ZXIuX3JlYWR5UHJvbWlzZV9yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICB3cml0ZXIuX3JlYWR5UHJvbWlzZV9yZWplY3QgPSByZWplY3Q7XG4gIH0pO1xuICB3cml0ZXIuX3JlYWR5UHJvbWlzZVN0YXRlID0gJ3BlbmRpbmcnO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0V3JpdGVyUmVhZHlQcm9taXNlSW5pdGlhbGl6ZUFzUmVqZWN0ZWQod3JpdGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIsIHJlYXNvbjogYW55KSB7XG4gIGRlZmF1bHRXcml0ZXJSZWFkeVByb21pc2VJbml0aWFsaXplKHdyaXRlcik7XG4gIGRlZmF1bHRXcml0ZXJSZWFkeVByb21pc2VSZWplY3Qod3JpdGVyLCByZWFzb24pO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0V3JpdGVyUmVhZHlQcm9taXNlSW5pdGlhbGl6ZUFzUmVzb2x2ZWQod3JpdGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIpIHtcbiAgZGVmYXVsdFdyaXRlclJlYWR5UHJvbWlzZUluaXRpYWxpemUod3JpdGVyKTtcbiAgZGVmYXVsdFdyaXRlclJlYWR5UHJvbWlzZVJlc29sdmUod3JpdGVyKTtcbn1cblxuZnVuY3Rpb24gZGVmYXVsdFdyaXRlclJlYWR5UHJvbWlzZVJlamVjdCh3cml0ZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlciwgcmVhc29uOiBhbnkpIHtcbiAgaWYgKHdyaXRlci5fcmVhZHlQcm9taXNlX3JlamVjdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgc2V0UHJvbWlzZUlzSGFuZGxlZFRvVHJ1ZSh3cml0ZXIuX3JlYWR5UHJvbWlzZSk7XG4gIHdyaXRlci5fcmVhZHlQcm9taXNlX3JlamVjdChyZWFzb24pO1xuICB3cml0ZXIuX3JlYWR5UHJvbWlzZV9yZXNvbHZlID0gdW5kZWZpbmVkO1xuICB3cml0ZXIuX3JlYWR5UHJvbWlzZV9yZWplY3QgPSB1bmRlZmluZWQ7XG4gIHdyaXRlci5fcmVhZHlQcm9taXNlU3RhdGUgPSAncmVqZWN0ZWQnO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0V3JpdGVyUmVhZHlQcm9taXNlUmVzZXQod3JpdGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIpIHtcbiAgYXNzZXJ0KHdyaXRlci5fcmVhZHlQcm9taXNlX3Jlc29sdmUgPT09IHVuZGVmaW5lZCk7XG4gIGFzc2VydCh3cml0ZXIuX3JlYWR5UHJvbWlzZV9yZWplY3QgPT09IHVuZGVmaW5lZCk7XG5cbiAgZGVmYXVsdFdyaXRlclJlYWR5UHJvbWlzZUluaXRpYWxpemUod3JpdGVyKTtcbn1cblxuZnVuY3Rpb24gZGVmYXVsdFdyaXRlclJlYWR5UHJvbWlzZVJlc2V0VG9SZWplY3RlZCh3cml0ZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlciwgcmVhc29uOiBhbnkpIHtcbiAgYXNzZXJ0KHdyaXRlci5fcmVhZHlQcm9taXNlX3Jlc29sdmUgPT09IHVuZGVmaW5lZCk7XG4gIGFzc2VydCh3cml0ZXIuX3JlYWR5UHJvbWlzZV9yZWplY3QgPT09IHVuZGVmaW5lZCk7XG5cbiAgZGVmYXVsdFdyaXRlclJlYWR5UHJvbWlzZUluaXRpYWxpemVBc1JlamVjdGVkKHdyaXRlciwgcmVhc29uKTtcbn1cblxuZnVuY3Rpb24gZGVmYXVsdFdyaXRlclJlYWR5UHJvbWlzZVJlc29sdmUod3JpdGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIpIHtcbiAgaWYgKHdyaXRlci5fcmVhZHlQcm9taXNlX3Jlc29sdmUgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHdyaXRlci5fcmVhZHlQcm9taXNlX3Jlc29sdmUodW5kZWZpbmVkKTtcbiAgd3JpdGVyLl9yZWFkeVByb21pc2VfcmVzb2x2ZSA9IHVuZGVmaW5lZDtcbiAgd3JpdGVyLl9yZWFkeVByb21pc2VfcmVqZWN0ID0gdW5kZWZpbmVkO1xuICB3cml0ZXIuX3JlYWR5UHJvbWlzZVN0YXRlID0gJ2Z1bGZpbGxlZCc7XG59XG4iLCAiLy8vIDxyZWZlcmVuY2UgbGliPVwiZG9tXCIgLz5cblxuZnVuY3Rpb24gZ2V0R2xvYmFscygpOiB0eXBlb2YgZ2xvYmFsVGhpcyB8IHVuZGVmaW5lZCB7XG4gIGlmICh0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gZ2xvYmFsVGhpcztcbiAgfSBlbHNlIGlmICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gc2VsZjtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBnbG9iYWw7XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGNvbnN0IGdsb2JhbHMgPSBnZXRHbG9iYWxzKCk7XG4iLCAiLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJub2RlXCIgLz5cbmltcG9ydCB7IGdsb2JhbHMgfSBmcm9tICcuLi9nbG9iYWxzJztcbmltcG9ydCB7IHNldEZ1bmN0aW9uTmFtZSB9IGZyb20gJy4uL2xpYi9oZWxwZXJzL21pc2NlbGxhbmVvdXMnO1xuXG5pbnRlcmZhY2UgRE9NRXhjZXB0aW9uIGV4dGVuZHMgRXJyb3Ige1xuICBuYW1lOiBzdHJpbmc7XG4gIG1lc3NhZ2U6IHN0cmluZztcbn1cblxudHlwZSBET01FeGNlcHRpb25Db25zdHJ1Y3RvciA9IG5ldyAobWVzc2FnZT86IHN0cmluZywgbmFtZT86IHN0cmluZykgPT4gRE9NRXhjZXB0aW9uO1xuXG5mdW5jdGlvbiBpc0RPTUV4Y2VwdGlvbkNvbnN0cnVjdG9yKGN0b3I6IHVua25vd24pOiBjdG9yIGlzIERPTUV4Y2VwdGlvbkNvbnN0cnVjdG9yIHtcbiAgaWYgKCEodHlwZW9mIGN0b3IgPT09ICdmdW5jdGlvbicgfHwgdHlwZW9mIGN0b3IgPT09ICdvYmplY3QnKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoKGN0b3IgYXMgRE9NRXhjZXB0aW9uQ29uc3RydWN0b3IpLm5hbWUgIT09ICdET01FeGNlcHRpb24nKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHRyeSB7XG4gICAgbmV3IChjdG9yIGFzIERPTUV4Y2VwdGlvbkNvbnN0cnVjdG9yKSgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuLyoqXG4gKiBTdXBwb3J0OlxuICogLSBXZWIgYnJvd3NlcnNcbiAqIC0gTm9kZSAxOCBhbmQgaGlnaGVyIChodHRwczovL2dpdGh1Yi5jb20vbm9kZWpzL25vZGUvY29tbWl0L2U0YjFmYjVlNjQyMmMxZmYxNTEyMzRiYjlkZTc5MmQ0NWRkODhkODcpXG4gKi9cbmZ1bmN0aW9uIGdldEZyb21HbG9iYWwoKTogRE9NRXhjZXB0aW9uQ29uc3RydWN0b3IgfCB1bmRlZmluZWQge1xuICBjb25zdCBjdG9yID0gZ2xvYmFscz8uRE9NRXhjZXB0aW9uO1xuICByZXR1cm4gaXNET01FeGNlcHRpb25Db25zdHJ1Y3RvcihjdG9yKSA/IGN0b3IgOiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogU3VwcG9ydDpcbiAqIC0gQWxsIHBsYXRmb3Jtc1xuICovXG5mdW5jdGlvbiBjcmVhdGVQb2x5ZmlsbCgpOiBET01FeGNlcHRpb25Db25zdHJ1Y3RvciB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tc2hhZG93XG4gIGNvbnN0IGN0b3IgPSBmdW5jdGlvbiBET01FeGNlcHRpb24odGhpczogRE9NRXhjZXB0aW9uLCBtZXNzYWdlPzogc3RyaW5nLCBuYW1lPzogc3RyaW5nKSB7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZSB8fCAnJztcbiAgICB0aGlzLm5hbWUgPSBuYW1lIHx8ICdFcnJvcic7XG4gICAgaWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKSB7XG4gICAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCB0aGlzLmNvbnN0cnVjdG9yKTtcbiAgICB9XG4gIH0gYXMgYW55O1xuICBzZXRGdW5jdGlvbk5hbWUoY3RvciwgJ0RPTUV4Y2VwdGlvbicpO1xuICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlKTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGN0b3IucHJvdG90eXBlLCAnY29uc3RydWN0b3InLCB7IHZhbHVlOiBjdG9yLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0pO1xuICByZXR1cm4gY3Rvcjtcbn1cblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1yZWRlY2xhcmVcbmNvbnN0IERPTUV4Y2VwdGlvbjogRE9NRXhjZXB0aW9uQ29uc3RydWN0b3IgPSBnZXRGcm9tR2xvYmFsKCkgfHwgY3JlYXRlUG9seWZpbGwoKTtcblxuZXhwb3J0IHsgRE9NRXhjZXB0aW9uIH07XG4iLCAiaW1wb3J0IHsgSXNSZWFkYWJsZVN0cmVhbSwgSXNSZWFkYWJsZVN0cmVhbUxvY2tlZCwgUmVhZGFibGVTdHJlYW0sIFJlYWRhYmxlU3RyZWFtQ2FuY2VsIH0gZnJvbSAnLi4vcmVhZGFibGUtc3RyZWFtJztcbmltcG9ydCB7IEFjcXVpcmVSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXIsIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlclJlYWQgfSBmcm9tICcuL2RlZmF1bHQtcmVhZGVyJztcbmltcG9ydCB7IFJlYWRhYmxlU3RyZWFtUmVhZGVyR2VuZXJpY1JlbGVhc2UgfSBmcm9tICcuL2dlbmVyaWMtcmVhZGVyJztcbmltcG9ydCB7XG4gIEFjcXVpcmVXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIsXG4gIElzV3JpdGFibGVTdHJlYW0sXG4gIElzV3JpdGFibGVTdHJlYW1Mb2NrZWQsXG4gIFdyaXRhYmxlU3RyZWFtLFxuICBXcml0YWJsZVN0cmVhbUFib3J0LFxuICBXcml0YWJsZVN0cmVhbUNsb3NlUXVldWVkT3JJbkZsaWdodCxcbiAgV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyQ2xvc2VXaXRoRXJyb3JQcm9wYWdhdGlvbixcbiAgV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyUmVsZWFzZSxcbiAgV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyV3JpdGVcbn0gZnJvbSAnLi4vd3JpdGFibGUtc3RyZWFtJztcbmltcG9ydCBhc3NlcnQgZnJvbSAnLi4vLi4vc3R1Yi9hc3NlcnQnO1xuaW1wb3J0IHtcbiAgbmV3UHJvbWlzZSxcbiAgUGVyZm9ybVByb21pc2VUaGVuLFxuICBwcm9taXNlUmVzb2x2ZWRXaXRoLFxuICBzZXRQcm9taXNlSXNIYW5kbGVkVG9UcnVlLFxuICB1cG9uRnVsZmlsbG1lbnQsXG4gIHVwb25Qcm9taXNlLFxuICB1cG9uUmVqZWN0aW9uXG59IGZyb20gJy4uL2hlbHBlcnMvd2ViaWRsJztcbmltcG9ydCB7IG5vb3AgfSBmcm9tICcuLi8uLi91dGlscyc7XG5pbXBvcnQgeyB0eXBlIEFib3J0U2lnbmFsLCBpc0Fib3J0U2lnbmFsIH0gZnJvbSAnLi4vYWJvcnQtc2lnbmFsJztcbmltcG9ydCB7IERPTUV4Y2VwdGlvbiB9IGZyb20gJy4uLy4uL3N0dWIvZG9tLWV4Y2VwdGlvbic7XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZVN0cmVhbVBpcGVUbzxUPihzb3VyY2U6IFJlYWRhYmxlU3RyZWFtPFQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc3Q6IFdyaXRhYmxlU3RyZWFtPFQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXZlbnRDbG9zZTogYm9vbGVhbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2ZW50QWJvcnQ6IGJvb2xlYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldmVudENhbmNlbDogYm9vbGVhbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaWduYWw6IEFib3J0U2lnbmFsIHwgdW5kZWZpbmVkKTogUHJvbWlzZTx1bmRlZmluZWQ+IHtcbiAgYXNzZXJ0KElzUmVhZGFibGVTdHJlYW0oc291cmNlKSk7XG4gIGFzc2VydChJc1dyaXRhYmxlU3RyZWFtKGRlc3QpKTtcbiAgYXNzZXJ0KHR5cGVvZiBwcmV2ZW50Q2xvc2UgPT09ICdib29sZWFuJyk7XG4gIGFzc2VydCh0eXBlb2YgcHJldmVudEFib3J0ID09PSAnYm9vbGVhbicpO1xuICBhc3NlcnQodHlwZW9mIHByZXZlbnRDYW5jZWwgPT09ICdib29sZWFuJyk7XG4gIGFzc2VydChzaWduYWwgPT09IHVuZGVmaW5lZCB8fCBpc0Fib3J0U2lnbmFsKHNpZ25hbCkpO1xuICBhc3NlcnQoIUlzUmVhZGFibGVTdHJlYW1Mb2NrZWQoc291cmNlKSk7XG4gIGFzc2VydCghSXNXcml0YWJsZVN0cmVhbUxvY2tlZChkZXN0KSk7XG5cbiAgY29uc3QgcmVhZGVyID0gQWNxdWlyZVJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcjxUPihzb3VyY2UpO1xuICBjb25zdCB3cml0ZXIgPSBBY3F1aXJlV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyPFQ+KGRlc3QpO1xuXG4gIHNvdXJjZS5fZGlzdHVyYmVkID0gdHJ1ZTtcblxuICBsZXQgc2h1dHRpbmdEb3duID0gZmFsc2U7XG5cbiAgLy8gVGhpcyBpcyB1c2VkIHRvIGtlZXAgdHJhY2sgb2YgdGhlIHNwZWMncyByZXF1aXJlbWVudCB0aGF0IHdlIHdhaXQgZm9yIG9uZ29pbmcgd3JpdGVzIGR1cmluZyBzaHV0ZG93bi5cbiAgbGV0IGN1cnJlbnRXcml0ZSA9IHByb21pc2VSZXNvbHZlZFdpdGg8dm9pZD4odW5kZWZpbmVkKTtcblxuICByZXR1cm4gbmV3UHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgbGV0IGFib3J0QWxnb3JpdGhtOiAoKSA9PiB2b2lkO1xuICAgIGlmIChzaWduYWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgYWJvcnRBbGdvcml0aG0gPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGVycm9yID0gc2lnbmFsLnJlYXNvbiAhPT0gdW5kZWZpbmVkID8gc2lnbmFsLnJlYXNvbiA6IG5ldyBET01FeGNlcHRpb24oJ0Fib3J0ZWQnLCAnQWJvcnRFcnJvcicpO1xuICAgICAgICBjb25zdCBhY3Rpb25zOiBBcnJheTwoKSA9PiBQcm9taXNlPHZvaWQ+PiA9IFtdO1xuICAgICAgICBpZiAoIXByZXZlbnRBYm9ydCkge1xuICAgICAgICAgIGFjdGlvbnMucHVzaCgoKSA9PiB7XG4gICAgICAgICAgICBpZiAoZGVzdC5fc3RhdGUgPT09ICd3cml0YWJsZScpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFdyaXRhYmxlU3RyZWFtQWJvcnQoZGVzdCwgZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2VSZXNvbHZlZFdpdGgodW5kZWZpbmVkKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXByZXZlbnRDYW5jZWwpIHtcbiAgICAgICAgICBhY3Rpb25zLnB1c2goKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHNvdXJjZS5fc3RhdGUgPT09ICdyZWFkYWJsZScpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFJlYWRhYmxlU3RyZWFtQ2FuY2VsKHNvdXJjZSwgZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2VSZXNvbHZlZFdpdGgodW5kZWZpbmVkKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBzaHV0ZG93bldpdGhBY3Rpb24oKCkgPT4gUHJvbWlzZS5hbGwoYWN0aW9ucy5tYXAoYWN0aW9uID0+IGFjdGlvbigpKSksIHRydWUsIGVycm9yKTtcbiAgICAgIH07XG5cbiAgICAgIGlmIChzaWduYWwuYWJvcnRlZCkge1xuICAgICAgICBhYm9ydEFsZ29yaXRobSgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHNpZ25hbC5hZGRFdmVudExpc3RlbmVyKCdhYm9ydCcsIGFib3J0QWxnb3JpdGhtKTtcbiAgICB9XG5cbiAgICAvLyBVc2luZyByZWFkZXIgYW5kIHdyaXRlciwgcmVhZCBhbGwgY2h1bmtzIGZyb20gdGhpcyBhbmQgd3JpdGUgdGhlbSB0byBkZXN0XG4gICAgLy8gLSBCYWNrcHJlc3N1cmUgbXVzdCBiZSBlbmZvcmNlZFxuICAgIC8vIC0gU2h1dGRvd24gbXVzdCBzdG9wIGFsbCBhY3Rpdml0eVxuICAgIGZ1bmN0aW9uIHBpcGVMb29wKCkge1xuICAgICAgcmV0dXJuIG5ld1Byb21pc2U8dm9pZD4oKHJlc29sdmVMb29wLCByZWplY3RMb29wKSA9PiB7XG4gICAgICAgIGZ1bmN0aW9uIG5leHQoZG9uZTogYm9vbGVhbikge1xuICAgICAgICAgIGlmIChkb25lKSB7XG4gICAgICAgICAgICByZXNvbHZlTG9vcCgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBVc2UgYFBlcmZvcm1Qcm9taXNlVGhlbmAgaW5zdGVhZCBvZiBgdXBvblByb21pc2VgIHRvIGF2b2lkXG4gICAgICAgICAgICAvLyBhZGRpbmcgdW5uZWNlc3NhcnkgYC5jYXRjaChyZXRocm93QXNzZXJ0aW9uRXJyb3JSZWplY3Rpb24pYCBoYW5kbGVyc1xuICAgICAgICAgICAgUGVyZm9ybVByb21pc2VUaGVuKHBpcGVTdGVwKCksIG5leHQsIHJlamVjdExvb3ApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIG5leHQoZmFsc2UpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGlwZVN0ZXAoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICBpZiAoc2h1dHRpbmdEb3duKSB7XG4gICAgICAgIHJldHVybiBwcm9taXNlUmVzb2x2ZWRXaXRoKHRydWUpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gUGVyZm9ybVByb21pc2VUaGVuKHdyaXRlci5fcmVhZHlQcm9taXNlLCAoKSA9PiB7XG4gICAgICAgIHJldHVybiBuZXdQcm9taXNlPGJvb2xlYW4+KChyZXNvbHZlUmVhZCwgcmVqZWN0UmVhZCkgPT4ge1xuICAgICAgICAgIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlclJlYWQoXG4gICAgICAgICAgICByZWFkZXIsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIF9jaHVua1N0ZXBzOiBjaHVuayA9PiB7XG4gICAgICAgICAgICAgICAgY3VycmVudFdyaXRlID0gUGVyZm9ybVByb21pc2VUaGVuKFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcldyaXRlKHdyaXRlciwgY2h1bmspLCB1bmRlZmluZWQsIG5vb3ApO1xuICAgICAgICAgICAgICAgIHJlc29sdmVSZWFkKGZhbHNlKTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgX2Nsb3NlU3RlcHM6ICgpID0+IHJlc29sdmVSZWFkKHRydWUpLFxuICAgICAgICAgICAgICBfZXJyb3JTdGVwczogcmVqZWN0UmVhZFxuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gRXJyb3JzIG11c3QgYmUgcHJvcGFnYXRlZCBmb3J3YXJkXG4gICAgaXNPckJlY29tZXNFcnJvcmVkKHNvdXJjZSwgcmVhZGVyLl9jbG9zZWRQcm9taXNlLCBzdG9yZWRFcnJvciA9PiB7XG4gICAgICBpZiAoIXByZXZlbnRBYm9ydCkge1xuICAgICAgICBzaHV0ZG93bldpdGhBY3Rpb24oKCkgPT4gV3JpdGFibGVTdHJlYW1BYm9ydChkZXN0LCBzdG9yZWRFcnJvciksIHRydWUsIHN0b3JlZEVycm9yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNodXRkb3duKHRydWUsIHN0b3JlZEVycm9yKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0pO1xuXG4gICAgLy8gRXJyb3JzIG11c3QgYmUgcHJvcGFnYXRlZCBiYWNrd2FyZFxuICAgIGlzT3JCZWNvbWVzRXJyb3JlZChkZXN0LCB3cml0ZXIuX2Nsb3NlZFByb21pc2UsIHN0b3JlZEVycm9yID0+IHtcbiAgICAgIGlmICghcHJldmVudENhbmNlbCkge1xuICAgICAgICBzaHV0ZG93bldpdGhBY3Rpb24oKCkgPT4gUmVhZGFibGVTdHJlYW1DYW5jZWwoc291cmNlLCBzdG9yZWRFcnJvciksIHRydWUsIHN0b3JlZEVycm9yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNodXRkb3duKHRydWUsIHN0b3JlZEVycm9yKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0pO1xuXG4gICAgLy8gQ2xvc2luZyBtdXN0IGJlIHByb3BhZ2F0ZWQgZm9yd2FyZFxuICAgIGlzT3JCZWNvbWVzQ2xvc2VkKHNvdXJjZSwgcmVhZGVyLl9jbG9zZWRQcm9taXNlLCAoKSA9PiB7XG4gICAgICBpZiAoIXByZXZlbnRDbG9zZSkge1xuICAgICAgICBzaHV0ZG93bldpdGhBY3Rpb24oKCkgPT4gV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyQ2xvc2VXaXRoRXJyb3JQcm9wYWdhdGlvbih3cml0ZXIpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNodXRkb3duKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9KTtcblxuICAgIC8vIENsb3NpbmcgbXVzdCBiZSBwcm9wYWdhdGVkIGJhY2t3YXJkXG4gICAgaWYgKFdyaXRhYmxlU3RyZWFtQ2xvc2VRdWV1ZWRPckluRmxpZ2h0KGRlc3QpIHx8IGRlc3QuX3N0YXRlID09PSAnY2xvc2VkJykge1xuICAgICAgY29uc3QgZGVzdENsb3NlZCA9IG5ldyBUeXBlRXJyb3IoJ3RoZSBkZXN0aW5hdGlvbiB3cml0YWJsZSBzdHJlYW0gY2xvc2VkIGJlZm9yZSBhbGwgZGF0YSBjb3VsZCBiZSBwaXBlZCB0byBpdCcpO1xuXG4gICAgICBpZiAoIXByZXZlbnRDYW5jZWwpIHtcbiAgICAgICAgc2h1dGRvd25XaXRoQWN0aW9uKCgpID0+IFJlYWRhYmxlU3RyZWFtQ2FuY2VsKHNvdXJjZSwgZGVzdENsb3NlZCksIHRydWUsIGRlc3RDbG9zZWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2h1dGRvd24odHJ1ZSwgZGVzdENsb3NlZCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2V0UHJvbWlzZUlzSGFuZGxlZFRvVHJ1ZShwaXBlTG9vcCgpKTtcblxuICAgIGZ1bmN0aW9uIHdhaXRGb3JXcml0ZXNUb0ZpbmlzaCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgIC8vIEFub3RoZXIgd3JpdGUgbWF5IGhhdmUgc3RhcnRlZCB3aGlsZSB3ZSB3ZXJlIHdhaXRpbmcgb24gdGhpcyBjdXJyZW50V3JpdGUsIHNvIHdlIGhhdmUgdG8gYmUgc3VyZSB0byB3YWl0XG4gICAgICAvLyBmb3IgdGhhdCB0b28uXG4gICAgICBjb25zdCBvbGRDdXJyZW50V3JpdGUgPSBjdXJyZW50V3JpdGU7XG4gICAgICByZXR1cm4gUGVyZm9ybVByb21pc2VUaGVuKFxuICAgICAgICBjdXJyZW50V3JpdGUsXG4gICAgICAgICgpID0+IG9sZEN1cnJlbnRXcml0ZSAhPT0gY3VycmVudFdyaXRlID8gd2FpdEZvcldyaXRlc1RvRmluaXNoKCkgOiB1bmRlZmluZWRcbiAgICAgICk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNPckJlY29tZXNFcnJvcmVkKHN0cmVhbTogUmVhZGFibGVTdHJlYW0gfCBXcml0YWJsZVN0cmVhbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZTogUHJvbWlzZTx2b2lkPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiAocmVhc29uOiBhbnkpID0+IG51bGwpIHtcbiAgICAgIGlmIChzdHJlYW0uX3N0YXRlID09PSAnZXJyb3JlZCcpIHtcbiAgICAgICAgYWN0aW9uKHN0cmVhbS5fc3RvcmVkRXJyb3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdXBvblJlamVjdGlvbihwcm9taXNlLCBhY3Rpb24pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzT3JCZWNvbWVzQ2xvc2VkKHN0cmVhbTogUmVhZGFibGVTdHJlYW0gfCBXcml0YWJsZVN0cmVhbSwgcHJvbWlzZTogUHJvbWlzZTx2b2lkPiwgYWN0aW9uOiAoKSA9PiBudWxsKSB7XG4gICAgICBpZiAoc3RyZWFtLl9zdGF0ZSA9PT0gJ2Nsb3NlZCcpIHtcbiAgICAgICAgYWN0aW9uKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB1cG9uRnVsZmlsbG1lbnQocHJvbWlzZSwgYWN0aW9uKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzaHV0ZG93bldpdGhBY3Rpb24oYWN0aW9uOiAoKSA9PiBQcm9taXNlPHVua25vd24+LCBvcmlnaW5hbElzRXJyb3I/OiBib29sZWFuLCBvcmlnaW5hbEVycm9yPzogYW55KSB7XG4gICAgICBpZiAoc2h1dHRpbmdEb3duKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHNodXR0aW5nRG93biA9IHRydWU7XG5cbiAgICAgIGlmIChkZXN0Ll9zdGF0ZSA9PT0gJ3dyaXRhYmxlJyAmJiAhV3JpdGFibGVTdHJlYW1DbG9zZVF1ZXVlZE9ySW5GbGlnaHQoZGVzdCkpIHtcbiAgICAgICAgdXBvbkZ1bGZpbGxtZW50KHdhaXRGb3JXcml0ZXNUb0ZpbmlzaCgpLCBkb1RoZVJlc3QpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZG9UaGVSZXN0KCk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGRvVGhlUmVzdCgpOiBudWxsIHtcbiAgICAgICAgdXBvblByb21pc2UoXG4gICAgICAgICAgYWN0aW9uKCksXG4gICAgICAgICAgKCkgPT4gZmluYWxpemUob3JpZ2luYWxJc0Vycm9yLCBvcmlnaW5hbEVycm9yKSxcbiAgICAgICAgICBuZXdFcnJvciA9PiBmaW5hbGl6ZSh0cnVlLCBuZXdFcnJvcilcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2h1dGRvd24oaXNFcnJvcj86IGJvb2xlYW4sIGVycm9yPzogYW55KSB7XG4gICAgICBpZiAoc2h1dHRpbmdEb3duKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHNodXR0aW5nRG93biA9IHRydWU7XG5cbiAgICAgIGlmIChkZXN0Ll9zdGF0ZSA9PT0gJ3dyaXRhYmxlJyAmJiAhV3JpdGFibGVTdHJlYW1DbG9zZVF1ZXVlZE9ySW5GbGlnaHQoZGVzdCkpIHtcbiAgICAgICAgdXBvbkZ1bGZpbGxtZW50KHdhaXRGb3JXcml0ZXNUb0ZpbmlzaCgpLCAoKSA9PiBmaW5hbGl6ZShpc0Vycm9yLCBlcnJvcikpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZmluYWxpemUoaXNFcnJvciwgZXJyb3IpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbmFsaXplKGlzRXJyb3I/OiBib29sZWFuLCBlcnJvcj86IGFueSk6IG51bGwge1xuICAgICAgV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyUmVsZWFzZSh3cml0ZXIpO1xuICAgICAgUmVhZGFibGVTdHJlYW1SZWFkZXJHZW5lcmljUmVsZWFzZShyZWFkZXIpO1xuXG4gICAgICBpZiAoc2lnbmFsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgc2lnbmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Fib3J0JywgYWJvcnRBbGdvcml0aG0pO1xuICAgICAgfVxuICAgICAgaWYgKGlzRXJyb3IpIHtcbiAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc29sdmUodW5kZWZpbmVkKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9KTtcbn1cbiIsICJpbXBvcnQgdHlwZSB7IFF1ZXVpbmdTdHJhdGVneVNpemVDYWxsYmFjayB9IGZyb20gJy4uL3F1ZXVpbmctc3RyYXRlZ3knO1xuaW1wb3J0IGFzc2VydCBmcm9tICcuLi8uLi9zdHViL2Fzc2VydCc7XG5pbXBvcnQgeyBEZXF1ZXVlVmFsdWUsIEVucXVldWVWYWx1ZVdpdGhTaXplLCB0eXBlIFF1ZXVlUGFpciwgUmVzZXRRdWV1ZSB9IGZyb20gJy4uL2Fic3RyYWN0LW9wcy9xdWV1ZS13aXRoLXNpemVzJztcbmltcG9ydCB7XG4gIFJlYWRhYmxlU3RyZWFtQWRkUmVhZFJlcXVlc3QsXG4gIFJlYWRhYmxlU3RyZWFtRnVsZmlsbFJlYWRSZXF1ZXN0LFxuICBSZWFkYWJsZVN0cmVhbUdldE51bVJlYWRSZXF1ZXN0cyxcbiAgdHlwZSBSZWFkUmVxdWVzdFxufSBmcm9tICcuL2RlZmF1bHQtcmVhZGVyJztcbmltcG9ydCB7IFNpbXBsZVF1ZXVlIH0gZnJvbSAnLi4vc2ltcGxlLXF1ZXVlJztcbmltcG9ydCB7IElzUmVhZGFibGVTdHJlYW1Mb2NrZWQsIFJlYWRhYmxlU3RyZWFtLCBSZWFkYWJsZVN0cmVhbUNsb3NlLCBSZWFkYWJsZVN0cmVhbUVycm9yIH0gZnJvbSAnLi4vcmVhZGFibGUtc3RyZWFtJztcbmltcG9ydCB0eXBlIHsgVmFsaWRhdGVkVW5kZXJseWluZ1NvdXJjZSB9IGZyb20gJy4vdW5kZXJseWluZy1zb3VyY2UnO1xuaW1wb3J0IHsgc2V0RnVuY3Rpb25OYW1lLCB0eXBlSXNPYmplY3QgfSBmcm9tICcuLi9oZWxwZXJzL21pc2NlbGxhbmVvdXMnO1xuaW1wb3J0IHsgQ2FuY2VsU3RlcHMsIFB1bGxTdGVwcywgUmVsZWFzZVN0ZXBzIH0gZnJvbSAnLi4vYWJzdHJhY3Qtb3BzL2ludGVybmFsLW1ldGhvZHMnO1xuaW1wb3J0IHsgcHJvbWlzZVJlc29sdmVkV2l0aCwgdXBvblByb21pc2UgfSBmcm9tICcuLi9oZWxwZXJzL3dlYmlkbCc7XG5cbi8qKlxuICogQWxsb3dzIGNvbnRyb2wgb2YgYSB7QGxpbmsgUmVhZGFibGVTdHJlYW0gfCByZWFkYWJsZSBzdHJlYW19J3Mgc3RhdGUgYW5kIGludGVybmFsIHF1ZXVlLlxuICpcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNsYXNzIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8Uj4ge1xuICAvKiogQGludGVybmFsICovXG4gIF9jb250cm9sbGVkUmVhZGFibGVTdHJlYW0hOiBSZWFkYWJsZVN0cmVhbTxSPjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcXVldWUhOiBTaW1wbGVRdWV1ZTxRdWV1ZVBhaXI8Uj4+O1xuICAvKiogQGludGVybmFsICovXG4gIF9xdWV1ZVRvdGFsU2l6ZSE6IG51bWJlcjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfc3RhcnRlZCE6IGJvb2xlYW47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2Nsb3NlUmVxdWVzdGVkITogYm9vbGVhbjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcHVsbEFnYWluITogYm9vbGVhbjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcHVsbGluZyAhOiBib29sZWFuO1xuICAvKiogQGludGVybmFsICovXG4gIF9zdHJhdGVneVNpemVBbGdvcml0aG0hOiBRdWV1aW5nU3RyYXRlZ3lTaXplQ2FsbGJhY2s8Uj47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3N0cmF0ZWd5SFdNITogbnVtYmVyO1xuICAvKiogQGludGVybmFsICovXG4gIF9wdWxsQWxnb3JpdGhtITogKCkgPT4gUHJvbWlzZTx2b2lkPjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfY2FuY2VsQWxnb3JpdGhtITogKHJlYXNvbjogYW55KSA9PiBQcm9taXNlPHZvaWQ+O1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IoKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSWxsZWdhbCBjb25zdHJ1Y3RvcicpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGRlc2lyZWQgc2l6ZSB0byBmaWxsIHRoZSBjb250cm9sbGVkIHN0cmVhbSdzIGludGVybmFsIHF1ZXVlLiBJdCBjYW4gYmUgbmVnYXRpdmUsIGlmIHRoZSBxdWV1ZSBpc1xuICAgKiBvdmVyLWZ1bGwuIEFuIHVuZGVybHlpbmcgc291cmNlIG91Z2h0IHRvIHVzZSB0aGlzIGluZm9ybWF0aW9uIHRvIGRldGVybWluZSB3aGVuIGFuZCBob3cgdG8gYXBwbHkgYmFja3ByZXNzdXJlLlxuICAgKi9cbiAgZ2V0IGRlc2lyZWRTaXplKCk6IG51bWJlciB8IG51bGwge1xuICAgIGlmICghSXNSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyKHRoaXMpKSB7XG4gICAgICB0aHJvdyBkZWZhdWx0Q29udHJvbGxlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ2Rlc2lyZWRTaXplJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJHZXREZXNpcmVkU2l6ZSh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbG9zZXMgdGhlIGNvbnRyb2xsZWQgcmVhZGFibGUgc3RyZWFtLiBDb25zdW1lcnMgd2lsbCBzdGlsbCBiZSBhYmxlIHRvIHJlYWQgYW55IHByZXZpb3VzbHktZW5xdWV1ZWQgY2h1bmtzIGZyb21cbiAgICogdGhlIHN0cmVhbSwgYnV0IG9uY2UgdGhvc2UgYXJlIHJlYWQsIHRoZSBzdHJlYW0gd2lsbCBiZWNvbWUgY2xvc2VkLlxuICAgKi9cbiAgY2xvc2UoKTogdm9pZCB7XG4gICAgaWYgKCFJc1JlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIodGhpcykpIHtcbiAgICAgIHRocm93IGRlZmF1bHRDb250cm9sbGVyQnJhbmRDaGVja0V4Y2VwdGlvbignY2xvc2UnKTtcbiAgICB9XG5cbiAgICBpZiAoIVJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDYW5DbG9zZU9yRW5xdWV1ZSh0aGlzKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIHN0cmVhbSBpcyBub3QgaW4gYSBzdGF0ZSB0aGF0IHBlcm1pdHMgY2xvc2UnKTtcbiAgICB9XG5cbiAgICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2xvc2UodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogRW5xdWV1ZXMgdGhlIGdpdmVuIGNodW5rIGBjaHVua2AgaW4gdGhlIGNvbnRyb2xsZWQgcmVhZGFibGUgc3RyZWFtLlxuICAgKi9cbiAgZW5xdWV1ZShjaHVuazogUik6IHZvaWQ7XG4gIGVucXVldWUoY2h1bms6IFIgPSB1bmRlZmluZWQhKTogdm9pZCB7XG4gICAgaWYgKCFJc1JlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIodGhpcykpIHtcbiAgICAgIHRocm93IGRlZmF1bHRDb250cm9sbGVyQnJhbmRDaGVja0V4Y2VwdGlvbignZW5xdWV1ZScpO1xuICAgIH1cblxuICAgIGlmICghUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNhbkNsb3NlT3JFbnF1ZXVlKHRoaXMpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgc3RyZWFtIGlzIG5vdCBpbiBhIHN0YXRlIHRoYXQgcGVybWl0cyBlbnF1ZXVlJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFbnF1ZXVlKHRoaXMsIGNodW5rKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFcnJvcnMgdGhlIGNvbnRyb2xsZWQgcmVhZGFibGUgc3RyZWFtLCBtYWtpbmcgYWxsIGZ1dHVyZSBpbnRlcmFjdGlvbnMgd2l0aCBpdCBmYWlsIHdpdGggdGhlIGdpdmVuIGVycm9yIGBlYC5cbiAgICovXG4gIGVycm9yKGU6IGFueSA9IHVuZGVmaW5lZCk6IHZvaWQge1xuICAgIGlmICghSXNSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyKHRoaXMpKSB7XG4gICAgICB0aHJvdyBkZWZhdWx0Q29udHJvbGxlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ2Vycm9yJyk7XG4gICAgfVxuXG4gICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVycm9yKHRoaXMsIGUpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBbQ2FuY2VsU3RlcHNdKHJlYXNvbjogYW55KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgUmVzZXRRdWV1ZSh0aGlzKTtcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLl9jYW5jZWxBbGdvcml0aG0ocmVhc29uKTtcbiAgICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2xlYXJBbGdvcml0aG1zKHRoaXMpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIFtQdWxsU3RlcHNdKHJlYWRSZXF1ZXN0OiBSZWFkUmVxdWVzdDxSPik6IHZvaWQge1xuICAgIGNvbnN0IHN0cmVhbSA9IHRoaXMuX2NvbnRyb2xsZWRSZWFkYWJsZVN0cmVhbTtcblxuICAgIGlmICh0aGlzLl9xdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBjaHVuayA9IERlcXVldWVWYWx1ZSh0aGlzKTtcblxuICAgICAgaWYgKHRoaXMuX2Nsb3NlUmVxdWVzdGVkICYmIHRoaXMuX3F1ZXVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2xlYXJBbGdvcml0aG1zKHRoaXMpO1xuICAgICAgICBSZWFkYWJsZVN0cmVhbUNsb3NlKHN0cmVhbSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2FsbFB1bGxJZk5lZWRlZCh0aGlzKTtcbiAgICAgIH1cblxuICAgICAgcmVhZFJlcXVlc3QuX2NodW5rU3RlcHMoY2h1bmspO1xuICAgIH0gZWxzZSB7XG4gICAgICBSZWFkYWJsZVN0cmVhbUFkZFJlYWRSZXF1ZXN0KHN0cmVhbSwgcmVhZFJlcXVlc3QpO1xuICAgICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNhbGxQdWxsSWZOZWVkZWQodGhpcyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBbUmVsZWFzZVN0ZXBzXSgpOiB2b2lkIHtcbiAgICAvLyBEbyBub3RoaW5nLlxuICB9XG59XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIucHJvdG90eXBlLCB7XG4gIGNsb3NlOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgZW5xdWV1ZTogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIGVycm9yOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgZGVzaXJlZFNpemU6IHsgZW51bWVyYWJsZTogdHJ1ZSB9XG59KTtcbnNldEZ1bmN0aW9uTmFtZShSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyLnByb3RvdHlwZS5jbG9zZSwgJ2Nsb3NlJyk7XG5zZXRGdW5jdGlvbk5hbWUoUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlci5wcm90b3R5cGUuZW5xdWV1ZSwgJ2VucXVldWUnKTtcbnNldEZ1bmN0aW9uTmFtZShSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyLnByb3RvdHlwZS5lcnJvciwgJ2Vycm9yJyk7XG5pZiAodHlwZW9mIFN5bWJvbC50b1N0cmluZ1RhZyA9PT0gJ3N5bWJvbCcpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIucHJvdG90eXBlLCBTeW1ib2wudG9TdHJpbmdUYWcsIHtcbiAgICB2YWx1ZTogJ1JlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXInLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbn1cblxuLy8gQWJzdHJhY3Qgb3BlcmF0aW9ucyBmb3IgdGhlIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIuXG5cbmZ1bmN0aW9uIElzUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxSID0gYW55Pih4OiBhbnkpOiB4IGlzIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8Uj4ge1xuICBpZiAoIXR5cGVJc09iamVjdCh4KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHgsICdfY29udHJvbGxlZFJlYWRhYmxlU3RyZWFtJykpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4geCBpbnN0YW5jZW9mIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI7XG59XG5cbmZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDYWxsUHVsbElmTmVlZGVkKGNvbnRyb2xsZXI6IFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8YW55Pik6IHZvaWQge1xuICBjb25zdCBzaG91bGRQdWxsID0gUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlclNob3VsZENhbGxQdWxsKGNvbnRyb2xsZXIpO1xuICBpZiAoIXNob3VsZFB1bGwpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoY29udHJvbGxlci5fcHVsbGluZykge1xuICAgIGNvbnRyb2xsZXIuX3B1bGxBZ2FpbiA9IHRydWU7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgYXNzZXJ0KCFjb250cm9sbGVyLl9wdWxsQWdhaW4pO1xuXG4gIGNvbnRyb2xsZXIuX3B1bGxpbmcgPSB0cnVlO1xuXG4gIGNvbnN0IHB1bGxQcm9taXNlID0gY29udHJvbGxlci5fcHVsbEFsZ29yaXRobSgpO1xuICB1cG9uUHJvbWlzZShcbiAgICBwdWxsUHJvbWlzZSxcbiAgICAoKSA9PiB7XG4gICAgICBjb250cm9sbGVyLl9wdWxsaW5nID0gZmFsc2U7XG5cbiAgICAgIGlmIChjb250cm9sbGVyLl9wdWxsQWdhaW4pIHtcbiAgICAgICAgY29udHJvbGxlci5fcHVsbEFnYWluID0gZmFsc2U7XG4gICAgICAgIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDYWxsUHVsbElmTmVlZGVkKGNvbnRyb2xsZXIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIGUgPT4ge1xuICAgICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVycm9yKGNvbnRyb2xsZXIsIGUpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICApO1xufVxuXG5mdW5jdGlvbiBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyU2hvdWxkQ2FsbFB1bGwoY29udHJvbGxlcjogUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxhbnk+KTogYm9vbGVhbiB7XG4gIGNvbnN0IHN0cmVhbSA9IGNvbnRyb2xsZXIuX2NvbnRyb2xsZWRSZWFkYWJsZVN0cmVhbTtcblxuICBpZiAoIVJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDYW5DbG9zZU9yRW5xdWV1ZShjb250cm9sbGVyKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICghY29udHJvbGxlci5fc3RhcnRlZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChJc1JlYWRhYmxlU3RyZWFtTG9ja2VkKHN0cmVhbSkgJiYgUmVhZGFibGVTdHJlYW1HZXROdW1SZWFkUmVxdWVzdHMoc3RyZWFtKSA+IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGNvbnN0IGRlc2lyZWRTaXplID0gUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckdldERlc2lyZWRTaXplKGNvbnRyb2xsZXIpO1xuICBhc3NlcnQoZGVzaXJlZFNpemUgIT09IG51bGwpO1xuICBpZiAoZGVzaXJlZFNpemUhID4gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2xlYXJBbGdvcml0aG1zKGNvbnRyb2xsZXI6IFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8YW55Pikge1xuICBjb250cm9sbGVyLl9wdWxsQWxnb3JpdGhtID0gdW5kZWZpbmVkITtcbiAgY29udHJvbGxlci5fY2FuY2VsQWxnb3JpdGhtID0gdW5kZWZpbmVkITtcbiAgY29udHJvbGxlci5fc3RyYXRlZ3lTaXplQWxnb3JpdGhtID0gdW5kZWZpbmVkITtcbn1cblxuLy8gQSBjbGllbnQgb2YgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlciBtYXkgdXNlIHRoZXNlIGZ1bmN0aW9ucyBkaXJlY3RseSB0byBieXBhc3Mgc3RhdGUgY2hlY2suXG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2xvc2UoY29udHJvbGxlcjogUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxhbnk+KSB7XG4gIGlmICghUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNhbkNsb3NlT3JFbnF1ZXVlKGNvbnRyb2xsZXIpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3Qgc3RyZWFtID0gY29udHJvbGxlci5fY29udHJvbGxlZFJlYWRhYmxlU3RyZWFtO1xuXG4gIGNvbnRyb2xsZXIuX2Nsb3NlUmVxdWVzdGVkID0gdHJ1ZTtcblxuICBpZiAoY29udHJvbGxlci5fcXVldWUubGVuZ3RoID09PSAwKSB7XG4gICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNsZWFyQWxnb3JpdGhtcyhjb250cm9sbGVyKTtcbiAgICBSZWFkYWJsZVN0cmVhbUNsb3NlKHN0cmVhbSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFbnF1ZXVlPFI+KFxuICBjb250cm9sbGVyOiBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyPFI+LFxuICBjaHVuazogUlxuKTogdm9pZCB7XG4gIGlmICghUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNhbkNsb3NlT3JFbnF1ZXVlKGNvbnRyb2xsZXIpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3Qgc3RyZWFtID0gY29udHJvbGxlci5fY29udHJvbGxlZFJlYWRhYmxlU3RyZWFtO1xuXG4gIGlmIChJc1JlYWRhYmxlU3RyZWFtTG9ja2VkKHN0cmVhbSkgJiYgUmVhZGFibGVTdHJlYW1HZXROdW1SZWFkUmVxdWVzdHMoc3RyZWFtKSA+IDApIHtcbiAgICBSZWFkYWJsZVN0cmVhbUZ1bGZpbGxSZWFkUmVxdWVzdChzdHJlYW0sIGNodW5rLCBmYWxzZSk7XG4gIH0gZWxzZSB7XG4gICAgbGV0IGNodW5rU2l6ZTtcbiAgICB0cnkge1xuICAgICAgY2h1bmtTaXplID0gY29udHJvbGxlci5fc3RyYXRlZ3lTaXplQWxnb3JpdGhtKGNodW5rKTtcbiAgICB9IGNhdGNoIChjaHVua1NpemVFKSB7XG4gICAgICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRXJyb3IoY29udHJvbGxlciwgY2h1bmtTaXplRSk7XG4gICAgICB0aHJvdyBjaHVua1NpemVFO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBFbnF1ZXVlVmFsdWVXaXRoU2l6ZShjb250cm9sbGVyLCBjaHVuaywgY2h1bmtTaXplKTtcbiAgICB9IGNhdGNoIChlbnF1ZXVlRSkge1xuICAgICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVycm9yKGNvbnRyb2xsZXIsIGVucXVldWVFKTtcbiAgICAgIHRocm93IGVucXVldWVFO1xuICAgIH1cbiAgfVxuXG4gIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDYWxsUHVsbElmTmVlZGVkKGNvbnRyb2xsZXIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVycm9yKGNvbnRyb2xsZXI6IFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8YW55PiwgZTogYW55KSB7XG4gIGNvbnN0IHN0cmVhbSA9IGNvbnRyb2xsZXIuX2NvbnRyb2xsZWRSZWFkYWJsZVN0cmVhbTtcblxuICBpZiAoc3RyZWFtLl9zdGF0ZSAhPT0gJ3JlYWRhYmxlJykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIFJlc2V0UXVldWUoY29udHJvbGxlcik7XG5cbiAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNsZWFyQWxnb3JpdGhtcyhjb250cm9sbGVyKTtcbiAgUmVhZGFibGVTdHJlYW1FcnJvcihzdHJlYW0sIGUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckdldERlc2lyZWRTaXplKFxuICBjb250cm9sbGVyOiBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyPGFueT5cbik6IG51bWJlciB8IG51bGwge1xuICBjb25zdCBzdGF0ZSA9IGNvbnRyb2xsZXIuX2NvbnRyb2xsZWRSZWFkYWJsZVN0cmVhbS5fc3RhdGU7XG5cbiAgaWYgKHN0YXRlID09PSAnZXJyb3JlZCcpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBpZiAoc3RhdGUgPT09ICdjbG9zZWQnKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICByZXR1cm4gY29udHJvbGxlci5fc3RyYXRlZ3lIV00gLSBjb250cm9sbGVyLl9xdWV1ZVRvdGFsU2l6ZTtcbn1cblxuLy8gVGhpcyBpcyB1c2VkIGluIHRoZSBpbXBsZW1lbnRhdGlvbiBvZiBUcmFuc2Zvcm1TdHJlYW0uXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckhhc0JhY2twcmVzc3VyZShcbiAgY29udHJvbGxlcjogUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxhbnk+XG4pOiBib29sZWFuIHtcbiAgaWYgKFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJTaG91bGRDYWxsUHVsbChjb250cm9sbGVyKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNhbkNsb3NlT3JFbnF1ZXVlKFxuICBjb250cm9sbGVyOiBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyPGFueT5cbik6IGJvb2xlYW4ge1xuICBjb25zdCBzdGF0ZSA9IGNvbnRyb2xsZXIuX2NvbnRyb2xsZWRSZWFkYWJsZVN0cmVhbS5fc3RhdGU7XG5cbiAgaWYgKCFjb250cm9sbGVyLl9jbG9zZVJlcXVlc3RlZCAmJiBzdGF0ZSA9PT0gJ3JlYWRhYmxlJykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gU2V0VXBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyPFI+KHN0cmVhbTogUmVhZGFibGVTdHJlYW08Uj4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8Uj4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0QWxnb3JpdGhtOiAoKSA9PiB2b2lkIHwgUHJvbWlzZUxpa2U8dm9pZD4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHB1bGxBbGdvcml0aG06ICgpID0+IFByb21pc2U8dm9pZD4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbmNlbEFsZ29yaXRobTogKHJlYXNvbjogYW55KSA9PiBQcm9taXNlPHZvaWQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoaWdoV2F0ZXJNYXJrOiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpemVBbGdvcml0aG06IFF1ZXVpbmdTdHJhdGVneVNpemVDYWxsYmFjazxSPikge1xuICBhc3NlcnQoc3RyZWFtLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIgPT09IHVuZGVmaW5lZCk7XG5cbiAgY29udHJvbGxlci5fY29udHJvbGxlZFJlYWRhYmxlU3RyZWFtID0gc3RyZWFtO1xuXG4gIGNvbnRyb2xsZXIuX3F1ZXVlID0gdW5kZWZpbmVkITtcbiAgY29udHJvbGxlci5fcXVldWVUb3RhbFNpemUgPSB1bmRlZmluZWQhO1xuICBSZXNldFF1ZXVlKGNvbnRyb2xsZXIpO1xuXG4gIGNvbnRyb2xsZXIuX3N0YXJ0ZWQgPSBmYWxzZTtcbiAgY29udHJvbGxlci5fY2xvc2VSZXF1ZXN0ZWQgPSBmYWxzZTtcbiAgY29udHJvbGxlci5fcHVsbEFnYWluID0gZmFsc2U7XG4gIGNvbnRyb2xsZXIuX3B1bGxpbmcgPSBmYWxzZTtcblxuICBjb250cm9sbGVyLl9zdHJhdGVneVNpemVBbGdvcml0aG0gPSBzaXplQWxnb3JpdGhtO1xuICBjb250cm9sbGVyLl9zdHJhdGVneUhXTSA9IGhpZ2hXYXRlck1hcms7XG5cbiAgY29udHJvbGxlci5fcHVsbEFsZ29yaXRobSA9IHB1bGxBbGdvcml0aG07XG4gIGNvbnRyb2xsZXIuX2NhbmNlbEFsZ29yaXRobSA9IGNhbmNlbEFsZ29yaXRobTtcblxuICBzdHJlYW0uX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlciA9IGNvbnRyb2xsZXI7XG5cbiAgY29uc3Qgc3RhcnRSZXN1bHQgPSBzdGFydEFsZ29yaXRobSgpO1xuICB1cG9uUHJvbWlzZShcbiAgICBwcm9taXNlUmVzb2x2ZWRXaXRoKHN0YXJ0UmVzdWx0KSxcbiAgICAoKSA9PiB7XG4gICAgICBjb250cm9sbGVyLl9zdGFydGVkID0gdHJ1ZTtcblxuICAgICAgYXNzZXJ0KCFjb250cm9sbGVyLl9wdWxsaW5nKTtcbiAgICAgIGFzc2VydCghY29udHJvbGxlci5fcHVsbEFnYWluKTtcblxuICAgICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNhbGxQdWxsSWZOZWVkZWQoY29udHJvbGxlcik7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIHIgPT4ge1xuICAgICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVycm9yKGNvbnRyb2xsZXIsIHIpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gU2V0VXBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRnJvbVVuZGVybHlpbmdTb3VyY2U8Uj4oXG4gIHN0cmVhbTogUmVhZGFibGVTdHJlYW08Uj4sXG4gIHVuZGVybHlpbmdTb3VyY2U6IFZhbGlkYXRlZFVuZGVybHlpbmdTb3VyY2U8Uj4sXG4gIGhpZ2hXYXRlck1hcms6IG51bWJlcixcbiAgc2l6ZUFsZ29yaXRobTogUXVldWluZ1N0cmF0ZWd5U2l6ZUNhbGxiYWNrPFI+XG4pIHtcbiAgY29uc3QgY29udHJvbGxlcjogUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxSPiA9IE9iamVjdC5jcmVhdGUoUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlci5wcm90b3R5cGUpO1xuXG4gIGxldCBzdGFydEFsZ29yaXRobTogKCkgPT4gdm9pZCB8IFByb21pc2VMaWtlPHZvaWQ+O1xuICBsZXQgcHVsbEFsZ29yaXRobTogKCkgPT4gUHJvbWlzZTx2b2lkPjtcbiAgbGV0IGNhbmNlbEFsZ29yaXRobTogKHJlYXNvbjogYW55KSA9PiBQcm9taXNlPHZvaWQ+O1xuXG4gIGlmICh1bmRlcmx5aW5nU291cmNlLnN0YXJ0ICE9PSB1bmRlZmluZWQpIHtcbiAgICBzdGFydEFsZ29yaXRobSA9ICgpID0+IHVuZGVybHlpbmdTb3VyY2Uuc3RhcnQhKGNvbnRyb2xsZXIpO1xuICB9IGVsc2Uge1xuICAgIHN0YXJ0QWxnb3JpdGhtID0gKCkgPT4gdW5kZWZpbmVkO1xuICB9XG4gIGlmICh1bmRlcmx5aW5nU291cmNlLnB1bGwgIT09IHVuZGVmaW5lZCkge1xuICAgIHB1bGxBbGdvcml0aG0gPSAoKSA9PiB1bmRlcmx5aW5nU291cmNlLnB1bGwhKGNvbnRyb2xsZXIpO1xuICB9IGVsc2Uge1xuICAgIHB1bGxBbGdvcml0aG0gPSAoKSA9PiBwcm9taXNlUmVzb2x2ZWRXaXRoKHVuZGVmaW5lZCk7XG4gIH1cbiAgaWYgKHVuZGVybHlpbmdTb3VyY2UuY2FuY2VsICE9PSB1bmRlZmluZWQpIHtcbiAgICBjYW5jZWxBbGdvcml0aG0gPSByZWFzb24gPT4gdW5kZXJseWluZ1NvdXJjZS5jYW5jZWwhKHJlYXNvbik7XG4gIH0gZWxzZSB7XG4gICAgY2FuY2VsQWxnb3JpdGhtID0gKCkgPT4gcHJvbWlzZVJlc29sdmVkV2l0aCh1bmRlZmluZWQpO1xuICB9XG5cbiAgU2V0VXBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyKFxuICAgIHN0cmVhbSwgY29udHJvbGxlciwgc3RhcnRBbGdvcml0aG0sIHB1bGxBbGdvcml0aG0sIGNhbmNlbEFsZ29yaXRobSwgaGlnaFdhdGVyTWFyaywgc2l6ZUFsZ29yaXRobVxuICApO1xufVxuXG4vLyBIZWxwZXIgZnVuY3Rpb25zIGZvciB0aGUgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlci5cblxuZnVuY3Rpb24gZGVmYXVsdENvbnRyb2xsZXJCcmFuZENoZWNrRXhjZXB0aW9uKG5hbWU6IHN0cmluZyk6IFR5cGVFcnJvciB7XG4gIHJldHVybiBuZXcgVHlwZUVycm9yKFxuICAgIGBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyLnByb3RvdHlwZS4ke25hbWV9IGNhbiBvbmx5IGJlIHVzZWQgb24gYSBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyYCk7XG59XG4iLCAiaW1wb3J0IHtcbiAgQ3JlYXRlUmVhZGFibGVCeXRlU3RyZWFtLFxuICBDcmVhdGVSZWFkYWJsZVN0cmVhbSxcbiAgdHlwZSBEZWZhdWx0UmVhZGFibGVTdHJlYW0sXG4gIElzUmVhZGFibGVTdHJlYW0sXG4gIHR5cGUgUmVhZGFibGVCeXRlU3RyZWFtLFxuICBSZWFkYWJsZVN0cmVhbSxcbiAgUmVhZGFibGVTdHJlYW1DYW5jZWwsXG4gIHR5cGUgUmVhZGFibGVTdHJlYW1SZWFkZXJcbn0gZnJvbSAnLi4vcmVhZGFibGUtc3RyZWFtJztcbmltcG9ydCB7IFJlYWRhYmxlU3RyZWFtUmVhZGVyR2VuZXJpY1JlbGVhc2UgfSBmcm9tICcuL2dlbmVyaWMtcmVhZGVyJztcbmltcG9ydCB7XG4gIEFjcXVpcmVSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXIsXG4gIElzUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyLFxuICBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXJSZWFkLFxuICB0eXBlIFJlYWRSZXF1ZXN0XG59IGZyb20gJy4vZGVmYXVsdC1yZWFkZXInO1xuaW1wb3J0IHtcbiAgQWNxdWlyZVJlYWRhYmxlU3RyZWFtQllPQlJlYWRlcixcbiAgSXNSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIsXG4gIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlclJlYWQsXG4gIHR5cGUgUmVhZEludG9SZXF1ZXN0XG59IGZyb20gJy4vYnlvYi1yZWFkZXInO1xuaW1wb3J0IGFzc2VydCBmcm9tICcuLi8uLi9zdHViL2Fzc2VydCc7XG5pbXBvcnQgeyBuZXdQcm9taXNlLCBwcm9taXNlUmVzb2x2ZWRXaXRoLCBxdWV1ZU1pY3JvdGFzaywgdXBvblJlamVjdGlvbiB9IGZyb20gJy4uL2hlbHBlcnMvd2ViaWRsJztcbmltcG9ydCB7XG4gIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDbG9zZSxcbiAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVucXVldWUsXG4gIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFcnJvclxufSBmcm9tICcuL2RlZmF1bHQtY29udHJvbGxlcic7XG5pbXBvcnQge1xuICBJc1JlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIsXG4gIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJDbG9zZSxcbiAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVucXVldWUsXG4gIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJFcnJvcixcbiAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckdldEJZT0JSZXF1ZXN0LFxuICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyUmVzcG9uZCxcbiAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclJlc3BvbmRXaXRoTmV3Vmlld1xufSBmcm9tICcuL2J5dGUtc3RyZWFtLWNvbnRyb2xsZXInO1xuaW1wb3J0IHsgQ3JlYXRlQXJyYXlGcm9tTGlzdCB9IGZyb20gJy4uL2Fic3RyYWN0LW9wcy9lY21hc2NyaXB0JztcbmltcG9ydCB7IENsb25lQXNVaW50OEFycmF5IH0gZnJvbSAnLi4vYWJzdHJhY3Qtb3BzL21pc2NlbGxhbmVvdXMnO1xuaW1wb3J0IHR5cGUgeyBOb25TaGFyZWQgfSBmcm9tICcuLi9oZWxwZXJzL2FycmF5LWJ1ZmZlci12aWV3JztcblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtVGVlPFI+KHN0cmVhbTogUmVhZGFibGVTdHJlYW08Uj4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xvbmVGb3JCcmFuY2gyOiBib29sZWFuKTogW1JlYWRhYmxlU3RyZWFtPFI+LCBSZWFkYWJsZVN0cmVhbTxSPl0ge1xuICBhc3NlcnQoSXNSZWFkYWJsZVN0cmVhbShzdHJlYW0pKTtcbiAgYXNzZXJ0KHR5cGVvZiBjbG9uZUZvckJyYW5jaDIgPT09ICdib29sZWFuJyk7XG4gIGlmIChJc1JlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIoc3RyZWFtLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIpKSB7XG4gICAgcmV0dXJuIFJlYWRhYmxlQnl0ZVN0cmVhbVRlZShzdHJlYW0gYXMgdW5rbm93biBhcyBSZWFkYWJsZUJ5dGVTdHJlYW0pIGFzXG4gICAgICB1bmtub3duIGFzIFtSZWFkYWJsZVN0cmVhbTxSPiwgUmVhZGFibGVTdHJlYW08Uj5dO1xuICB9XG4gIHJldHVybiBSZWFkYWJsZVN0cmVhbURlZmF1bHRUZWUoc3RyZWFtLCBjbG9uZUZvckJyYW5jaDIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1EZWZhdWx0VGVlPFI+KFxuICBzdHJlYW06IFJlYWRhYmxlU3RyZWFtPFI+LFxuICBjbG9uZUZvckJyYW5jaDI6IGJvb2xlYW5cbik6IFtEZWZhdWx0UmVhZGFibGVTdHJlYW08Uj4sIERlZmF1bHRSZWFkYWJsZVN0cmVhbTxSPl0ge1xuICBhc3NlcnQoSXNSZWFkYWJsZVN0cmVhbShzdHJlYW0pKTtcbiAgYXNzZXJ0KHR5cGVvZiBjbG9uZUZvckJyYW5jaDIgPT09ICdib29sZWFuJyk7XG5cbiAgY29uc3QgcmVhZGVyID0gQWNxdWlyZVJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcjxSPihzdHJlYW0pO1xuXG4gIGxldCByZWFkaW5nID0gZmFsc2U7XG4gIGxldCByZWFkQWdhaW4gPSBmYWxzZTtcbiAgbGV0IGNhbmNlbGVkMSA9IGZhbHNlO1xuICBsZXQgY2FuY2VsZWQyID0gZmFsc2U7XG4gIGxldCByZWFzb24xOiBhbnk7XG4gIGxldCByZWFzb24yOiBhbnk7XG4gIGxldCBicmFuY2gxOiBEZWZhdWx0UmVhZGFibGVTdHJlYW08Uj47XG4gIGxldCBicmFuY2gyOiBEZWZhdWx0UmVhZGFibGVTdHJlYW08Uj47XG5cbiAgbGV0IHJlc29sdmVDYW5jZWxQcm9taXNlOiAodmFsdWU6IHVuZGVmaW5lZCB8IFByb21pc2U8dW5kZWZpbmVkPikgPT4gdm9pZDtcbiAgY29uc3QgY2FuY2VsUHJvbWlzZSA9IG5ld1Byb21pc2U8dW5kZWZpbmVkPihyZXNvbHZlID0+IHtcbiAgICByZXNvbHZlQ2FuY2VsUHJvbWlzZSA9IHJlc29sdmU7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHB1bGxBbGdvcml0aG0oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKHJlYWRpbmcpIHtcbiAgICAgIHJlYWRBZ2FpbiA9IHRydWU7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlc29sdmVkV2l0aCh1bmRlZmluZWQpO1xuICAgIH1cblxuICAgIHJlYWRpbmcgPSB0cnVlO1xuXG4gICAgY29uc3QgcmVhZFJlcXVlc3Q6IFJlYWRSZXF1ZXN0PFI+ID0ge1xuICAgICAgX2NodW5rU3RlcHM6IGNodW5rID0+IHtcbiAgICAgICAgLy8gVGhpcyBuZWVkcyB0byBiZSBkZWxheWVkIGEgbWljcm90YXNrIGJlY2F1c2UgaXQgdGFrZXMgYXQgbGVhc3QgYSBtaWNyb3Rhc2sgdG8gZGV0ZWN0IGVycm9ycyAodXNpbmdcbiAgICAgICAgLy8gcmVhZGVyLl9jbG9zZWRQcm9taXNlIGJlbG93KSwgYW5kIHdlIHdhbnQgZXJyb3JzIGluIHN0cmVhbSB0byBlcnJvciBib3RoIGJyYW5jaGVzIGltbWVkaWF0ZWx5LiBXZSBjYW5ub3QgbGV0XG4gICAgICAgIC8vIHN1Y2Nlc3NmdWwgc3luY2hyb25vdXNseS1hdmFpbGFibGUgcmVhZHMgZ2V0IGFoZWFkIG9mIGFzeW5jaHJvbm91c2x5LWF2YWlsYWJsZSBlcnJvcnMuXG4gICAgICAgIHF1ZXVlTWljcm90YXNrKCgpID0+IHtcbiAgICAgICAgICByZWFkQWdhaW4gPSBmYWxzZTtcbiAgICAgICAgICBjb25zdCBjaHVuazEgPSBjaHVuaztcbiAgICAgICAgICBjb25zdCBjaHVuazIgPSBjaHVuaztcblxuICAgICAgICAgIC8vIFRoZXJlIGlzIG5vIHdheSB0byBhY2Nlc3MgdGhlIGNsb25pbmcgY29kZSByaWdodCBub3cgaW4gdGhlIHJlZmVyZW5jZSBpbXBsZW1lbnRhdGlvbi5cbiAgICAgICAgICAvLyBJZiB3ZSBhZGQgb25lIHRoZW4gd2UnbGwgbmVlZCBhbiBpbXBsZW1lbnRhdGlvbiBmb3Igc2VyaWFsaXphYmxlIG9iamVjdHMuXG4gICAgICAgICAgLy8gaWYgKCFjYW5jZWxlZDIgJiYgY2xvbmVGb3JCcmFuY2gyKSB7XG4gICAgICAgICAgLy8gICBjaHVuazIgPSBTdHJ1Y3R1cmVkRGVzZXJpYWxpemUoU3RydWN0dXJlZFNlcmlhbGl6ZShjaHVuazIpKTtcbiAgICAgICAgICAvLyB9XG5cbiAgICAgICAgICBpZiAoIWNhbmNlbGVkMSkge1xuICAgICAgICAgICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVucXVldWUoYnJhbmNoMS5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyLCBjaHVuazEpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIWNhbmNlbGVkMikge1xuICAgICAgICAgICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVucXVldWUoYnJhbmNoMi5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyLCBjaHVuazIpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICBpZiAocmVhZEFnYWluKSB7XG4gICAgICAgICAgICBwdWxsQWxnb3JpdGhtKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBfY2xvc2VTdGVwczogKCkgPT4ge1xuICAgICAgICByZWFkaW5nID0gZmFsc2U7XG4gICAgICAgIGlmICghY2FuY2VsZWQxKSB7XG4gICAgICAgICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNsb3NlKGJyYW5jaDEuX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFjYW5jZWxlZDIpIHtcbiAgICAgICAgICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2xvc2UoYnJhbmNoMi5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghY2FuY2VsZWQxIHx8ICFjYW5jZWxlZDIpIHtcbiAgICAgICAgICByZXNvbHZlQ2FuY2VsUHJvbWlzZSh1bmRlZmluZWQpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgX2Vycm9yU3RlcHM6ICgpID0+IHtcbiAgICAgICAgcmVhZGluZyA9IGZhbHNlO1xuICAgICAgfVxuICAgIH07XG4gICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyUmVhZChyZWFkZXIsIHJlYWRSZXF1ZXN0KTtcblxuICAgIHJldHVybiBwcm9taXNlUmVzb2x2ZWRXaXRoKHVuZGVmaW5lZCk7XG4gIH1cblxuICBmdW5jdGlvbiBjYW5jZWwxQWxnb3JpdGhtKHJlYXNvbjogYW55KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY2FuY2VsZWQxID0gdHJ1ZTtcbiAgICByZWFzb24xID0gcmVhc29uO1xuICAgIGlmIChjYW5jZWxlZDIpIHtcbiAgICAgIGNvbnN0IGNvbXBvc2l0ZVJlYXNvbiA9IENyZWF0ZUFycmF5RnJvbUxpc3QoW3JlYXNvbjEsIHJlYXNvbjJdKTtcbiAgICAgIGNvbnN0IGNhbmNlbFJlc3VsdCA9IFJlYWRhYmxlU3RyZWFtQ2FuY2VsKHN0cmVhbSwgY29tcG9zaXRlUmVhc29uKTtcbiAgICAgIHJlc29sdmVDYW5jZWxQcm9taXNlKGNhbmNlbFJlc3VsdCk7XG4gICAgfVxuICAgIHJldHVybiBjYW5jZWxQcm9taXNlO1xuICB9XG5cbiAgZnVuY3Rpb24gY2FuY2VsMkFsZ29yaXRobShyZWFzb246IGFueSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNhbmNlbGVkMiA9IHRydWU7XG4gICAgcmVhc29uMiA9IHJlYXNvbjtcbiAgICBpZiAoY2FuY2VsZWQxKSB7XG4gICAgICBjb25zdCBjb21wb3NpdGVSZWFzb24gPSBDcmVhdGVBcnJheUZyb21MaXN0KFtyZWFzb24xLCByZWFzb24yXSk7XG4gICAgICBjb25zdCBjYW5jZWxSZXN1bHQgPSBSZWFkYWJsZVN0cmVhbUNhbmNlbChzdHJlYW0sIGNvbXBvc2l0ZVJlYXNvbik7XG4gICAgICByZXNvbHZlQ2FuY2VsUHJvbWlzZShjYW5jZWxSZXN1bHQpO1xuICAgIH1cbiAgICByZXR1cm4gY2FuY2VsUHJvbWlzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0YXJ0QWxnb3JpdGhtKCkge1xuICAgIC8vIGRvIG5vdGhpbmdcbiAgfVxuXG4gIGJyYW5jaDEgPSBDcmVhdGVSZWFkYWJsZVN0cmVhbShzdGFydEFsZ29yaXRobSwgcHVsbEFsZ29yaXRobSwgY2FuY2VsMUFsZ29yaXRobSk7XG4gIGJyYW5jaDIgPSBDcmVhdGVSZWFkYWJsZVN0cmVhbShzdGFydEFsZ29yaXRobSwgcHVsbEFsZ29yaXRobSwgY2FuY2VsMkFsZ29yaXRobSk7XG5cbiAgdXBvblJlamVjdGlvbihyZWFkZXIuX2Nsb3NlZFByb21pc2UsIChyOiBhbnkpID0+IHtcbiAgICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRXJyb3IoYnJhbmNoMS5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyLCByKTtcbiAgICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRXJyb3IoYnJhbmNoMi5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyLCByKTtcbiAgICBpZiAoIWNhbmNlbGVkMSB8fCAhY2FuY2VsZWQyKSB7XG4gICAgICByZXNvbHZlQ2FuY2VsUHJvbWlzZSh1bmRlZmluZWQpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfSk7XG5cbiAgcmV0dXJuIFticmFuY2gxLCBicmFuY2gyXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlQnl0ZVN0cmVhbVRlZShzdHJlYW06IFJlYWRhYmxlQnl0ZVN0cmVhbSk6IFtSZWFkYWJsZUJ5dGVTdHJlYW0sIFJlYWRhYmxlQnl0ZVN0cmVhbV0ge1xuICBhc3NlcnQoSXNSZWFkYWJsZVN0cmVhbShzdHJlYW0pKTtcbiAgYXNzZXJ0KElzUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcihzdHJlYW0uX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlcikpO1xuXG4gIGxldCByZWFkZXI6IFJlYWRhYmxlU3RyZWFtUmVhZGVyPE5vblNoYXJlZDxVaW50OEFycmF5Pj4gPSBBY3F1aXJlUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyKHN0cmVhbSk7XG4gIGxldCByZWFkaW5nID0gZmFsc2U7XG4gIGxldCByZWFkQWdhaW5Gb3JCcmFuY2gxID0gZmFsc2U7XG4gIGxldCByZWFkQWdhaW5Gb3JCcmFuY2gyID0gZmFsc2U7XG4gIGxldCBjYW5jZWxlZDEgPSBmYWxzZTtcbiAgbGV0IGNhbmNlbGVkMiA9IGZhbHNlO1xuICBsZXQgcmVhc29uMTogYW55O1xuICBsZXQgcmVhc29uMjogYW55O1xuICBsZXQgYnJhbmNoMTogUmVhZGFibGVCeXRlU3RyZWFtO1xuICBsZXQgYnJhbmNoMjogUmVhZGFibGVCeXRlU3RyZWFtO1xuXG4gIGxldCByZXNvbHZlQ2FuY2VsUHJvbWlzZTogKHZhbHVlOiB1bmRlZmluZWQgfCBQcm9taXNlPHVuZGVmaW5lZD4pID0+IHZvaWQ7XG4gIGNvbnN0IGNhbmNlbFByb21pc2UgPSBuZXdQcm9taXNlPHZvaWQ+KHJlc29sdmUgPT4ge1xuICAgIHJlc29sdmVDYW5jZWxQcm9taXNlID0gcmVzb2x2ZTtcbiAgfSk7XG5cbiAgZnVuY3Rpb24gZm9yd2FyZFJlYWRlckVycm9yKHRoaXNSZWFkZXI6IFJlYWRhYmxlU3RyZWFtUmVhZGVyPE5vblNoYXJlZDxVaW50OEFycmF5Pj4pIHtcbiAgICB1cG9uUmVqZWN0aW9uKHRoaXNSZWFkZXIuX2Nsb3NlZFByb21pc2UsIHIgPT4ge1xuICAgICAgaWYgKHRoaXNSZWFkZXIgIT09IHJlYWRlcikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJFcnJvcihicmFuY2gxLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIsIHIpO1xuICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVycm9yKGJyYW5jaDIuX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlciwgcik7XG4gICAgICBpZiAoIWNhbmNlbGVkMSB8fCAhY2FuY2VsZWQyKSB7XG4gICAgICAgIHJlc29sdmVDYW5jZWxQcm9taXNlKHVuZGVmaW5lZCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHB1bGxXaXRoRGVmYXVsdFJlYWRlcigpIHtcbiAgICBpZiAoSXNSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIocmVhZGVyKSkge1xuICAgICAgYXNzZXJ0KHJlYWRlci5fcmVhZEludG9SZXF1ZXN0cy5sZW5ndGggPT09IDApO1xuICAgICAgUmVhZGFibGVTdHJlYW1SZWFkZXJHZW5lcmljUmVsZWFzZShyZWFkZXIpO1xuXG4gICAgICByZWFkZXIgPSBBY3F1aXJlUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyKHN0cmVhbSk7XG4gICAgICBmb3J3YXJkUmVhZGVyRXJyb3IocmVhZGVyKTtcbiAgICB9XG5cbiAgICBjb25zdCByZWFkUmVxdWVzdDogUmVhZFJlcXVlc3Q8Tm9uU2hhcmVkPFVpbnQ4QXJyYXk+PiA9IHtcbiAgICAgIF9jaHVua1N0ZXBzOiBjaHVuayA9PiB7XG4gICAgICAgIC8vIFRoaXMgbmVlZHMgdG8gYmUgZGVsYXllZCBhIG1pY3JvdGFzayBiZWNhdXNlIGl0IHRha2VzIGF0IGxlYXN0IGEgbWljcm90YXNrIHRvIGRldGVjdCBlcnJvcnMgKHVzaW5nXG4gICAgICAgIC8vIHJlYWRlci5fY2xvc2VkUHJvbWlzZSBiZWxvdyksIGFuZCB3ZSB3YW50IGVycm9ycyBpbiBzdHJlYW0gdG8gZXJyb3IgYm90aCBicmFuY2hlcyBpbW1lZGlhdGVseS4gV2UgY2Fubm90IGxldFxuICAgICAgICAvLyBzdWNjZXNzZnVsIHN5bmNocm9ub3VzbHktYXZhaWxhYmxlIHJlYWRzIGdldCBhaGVhZCBvZiBhc3luY2hyb25vdXNseS1hdmFpbGFibGUgZXJyb3JzLlxuICAgICAgICBxdWV1ZU1pY3JvdGFzaygoKSA9PiB7XG4gICAgICAgICAgcmVhZEFnYWluRm9yQnJhbmNoMSA9IGZhbHNlO1xuICAgICAgICAgIHJlYWRBZ2FpbkZvckJyYW5jaDIgPSBmYWxzZTtcblxuICAgICAgICAgIGNvbnN0IGNodW5rMSA9IGNodW5rO1xuICAgICAgICAgIGxldCBjaHVuazIgPSBjaHVuaztcbiAgICAgICAgICBpZiAoIWNhbmNlbGVkMSAmJiAhY2FuY2VsZWQyKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBjaHVuazIgPSBDbG9uZUFzVWludDhBcnJheShjaHVuayk7XG4gICAgICAgICAgICB9IGNhdGNoIChjbG9uZUUpIHtcbiAgICAgICAgICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVycm9yKGJyYW5jaDEuX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlciwgY2xvbmVFKTtcbiAgICAgICAgICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVycm9yKGJyYW5jaDIuX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlciwgY2xvbmVFKTtcbiAgICAgICAgICAgICAgcmVzb2x2ZUNhbmNlbFByb21pc2UoUmVhZGFibGVTdHJlYW1DYW5jZWwoc3RyZWFtLCBjbG9uZUUpKTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghY2FuY2VsZWQxKSB7XG4gICAgICAgICAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRW5xdWV1ZShicmFuY2gxLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIsIGNodW5rMSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghY2FuY2VsZWQyKSB7XG4gICAgICAgICAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRW5xdWV1ZShicmFuY2gyLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIsIGNodW5rMik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVhZGluZyA9IGZhbHNlO1xuICAgICAgICAgIGlmIChyZWFkQWdhaW5Gb3JCcmFuY2gxKSB7XG4gICAgICAgICAgICBwdWxsMUFsZ29yaXRobSgpO1xuICAgICAgICAgIH0gZWxzZSBpZiAocmVhZEFnYWluRm9yQnJhbmNoMikge1xuICAgICAgICAgICAgcHVsbDJBbGdvcml0aG0oKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIF9jbG9zZVN0ZXBzOiAoKSA9PiB7XG4gICAgICAgIHJlYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgaWYgKCFjYW5jZWxlZDEpIHtcbiAgICAgICAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyQ2xvc2UoYnJhbmNoMS5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWNhbmNlbGVkMikge1xuICAgICAgICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJDbG9zZShicmFuY2gyLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChicmFuY2gxLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIuX3BlbmRpbmdQdWxsSW50b3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJSZXNwb25kKGJyYW5jaDEuX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlciwgMCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJyYW5jaDIuX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlci5fcGVuZGluZ1B1bGxJbnRvcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclJlc3BvbmQoYnJhbmNoMi5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyLCAwKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWNhbmNlbGVkMSB8fCAhY2FuY2VsZWQyKSB7XG4gICAgICAgICAgcmVzb2x2ZUNhbmNlbFByb21pc2UodW5kZWZpbmVkKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIF9lcnJvclN0ZXBzOiAoKSA9PiB7XG4gICAgICAgIHJlYWRpbmcgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9O1xuICAgIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlclJlYWQocmVhZGVyLCByZWFkUmVxdWVzdCk7XG4gIH1cblxuICBmdW5jdGlvbiBwdWxsV2l0aEJZT0JSZWFkZXIodmlldzogTm9uU2hhcmVkPEFycmF5QnVmZmVyVmlldz4sIGZvckJyYW5jaDI6IGJvb2xlYW4pIHtcbiAgICBpZiAoSXNSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXI8Tm9uU2hhcmVkPFVpbnQ4QXJyYXk+PihyZWFkZXIpKSB7XG4gICAgICBhc3NlcnQocmVhZGVyLl9yZWFkUmVxdWVzdHMubGVuZ3RoID09PSAwKTtcbiAgICAgIFJlYWRhYmxlU3RyZWFtUmVhZGVyR2VuZXJpY1JlbGVhc2UocmVhZGVyKTtcblxuICAgICAgcmVhZGVyID0gQWNxdWlyZVJlYWRhYmxlU3RyZWFtQllPQlJlYWRlcihzdHJlYW0pO1xuICAgICAgZm9yd2FyZFJlYWRlckVycm9yKHJlYWRlcik7XG4gICAgfVxuXG4gICAgY29uc3QgYnlvYkJyYW5jaCA9IGZvckJyYW5jaDIgPyBicmFuY2gyIDogYnJhbmNoMTtcbiAgICBjb25zdCBvdGhlckJyYW5jaCA9IGZvckJyYW5jaDIgPyBicmFuY2gxIDogYnJhbmNoMjtcblxuICAgIGNvbnN0IHJlYWRJbnRvUmVxdWVzdDogUmVhZEludG9SZXF1ZXN0PE5vblNoYXJlZDxBcnJheUJ1ZmZlclZpZXc+PiA9IHtcbiAgICAgIF9jaHVua1N0ZXBzOiBjaHVuayA9PiB7XG4gICAgICAgIC8vIFRoaXMgbmVlZHMgdG8gYmUgZGVsYXllZCBhIG1pY3JvdGFzayBiZWNhdXNlIGl0IHRha2VzIGF0IGxlYXN0IGEgbWljcm90YXNrIHRvIGRldGVjdCBlcnJvcnMgKHVzaW5nXG4gICAgICAgIC8vIHJlYWRlci5fY2xvc2VkUHJvbWlzZSBiZWxvdyksIGFuZCB3ZSB3YW50IGVycm9ycyBpbiBzdHJlYW0gdG8gZXJyb3IgYm90aCBicmFuY2hlcyBpbW1lZGlhdGVseS4gV2UgY2Fubm90IGxldFxuICAgICAgICAvLyBzdWNjZXNzZnVsIHN5bmNocm9ub3VzbHktYXZhaWxhYmxlIHJlYWRzIGdldCBhaGVhZCBvZiBhc3luY2hyb25vdXNseS1hdmFpbGFibGUgZXJyb3JzLlxuICAgICAgICBxdWV1ZU1pY3JvdGFzaygoKSA9PiB7XG4gICAgICAgICAgcmVhZEFnYWluRm9yQnJhbmNoMSA9IGZhbHNlO1xuICAgICAgICAgIHJlYWRBZ2FpbkZvckJyYW5jaDIgPSBmYWxzZTtcblxuICAgICAgICAgIGNvbnN0IGJ5b2JDYW5jZWxlZCA9IGZvckJyYW5jaDIgPyBjYW5jZWxlZDIgOiBjYW5jZWxlZDE7XG4gICAgICAgICAgY29uc3Qgb3RoZXJDYW5jZWxlZCA9IGZvckJyYW5jaDIgPyBjYW5jZWxlZDEgOiBjYW5jZWxlZDI7XG5cbiAgICAgICAgICBpZiAoIW90aGVyQ2FuY2VsZWQpIHtcbiAgICAgICAgICAgIGxldCBjbG9uZWRDaHVuaztcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGNsb25lZENodW5rID0gQ2xvbmVBc1VpbnQ4QXJyYXkoY2h1bmspO1xuICAgICAgICAgICAgfSBjYXRjaCAoY2xvbmVFKSB7XG4gICAgICAgICAgICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJFcnJvcihieW9iQnJhbmNoLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIsIGNsb25lRSk7XG4gICAgICAgICAgICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJFcnJvcihvdGhlckJyYW5jaC5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyLCBjbG9uZUUpO1xuICAgICAgICAgICAgICByZXNvbHZlQ2FuY2VsUHJvbWlzZShSZWFkYWJsZVN0cmVhbUNhbmNlbChzdHJlYW0sIGNsb25lRSkpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWJ5b2JDYW5jZWxlZCkge1xuICAgICAgICAgICAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyUmVzcG9uZFdpdGhOZXdWaWV3KGJ5b2JCcmFuY2guX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlciwgY2h1bmspO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVucXVldWUob3RoZXJCcmFuY2guX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlciwgY2xvbmVkQ2h1bmspO1xuICAgICAgICAgIH0gZWxzZSBpZiAoIWJ5b2JDYW5jZWxlZCkge1xuICAgICAgICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclJlc3BvbmRXaXRoTmV3VmlldyhieW9iQnJhbmNoLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIsIGNodW5rKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZWFkaW5nID0gZmFsc2U7XG4gICAgICAgICAgaWYgKHJlYWRBZ2FpbkZvckJyYW5jaDEpIHtcbiAgICAgICAgICAgIHB1bGwxQWxnb3JpdGhtKCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChyZWFkQWdhaW5Gb3JCcmFuY2gyKSB7XG4gICAgICAgICAgICBwdWxsMkFsZ29yaXRobSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgX2Nsb3NlU3RlcHM6IGNodW5rID0+IHtcbiAgICAgICAgcmVhZGluZyA9IGZhbHNlO1xuXG4gICAgICAgIGNvbnN0IGJ5b2JDYW5jZWxlZCA9IGZvckJyYW5jaDIgPyBjYW5jZWxlZDIgOiBjYW5jZWxlZDE7XG4gICAgICAgIGNvbnN0IG90aGVyQ2FuY2VsZWQgPSBmb3JCcmFuY2gyID8gY2FuY2VsZWQxIDogY2FuY2VsZWQyO1xuXG4gICAgICAgIGlmICghYnlvYkNhbmNlbGVkKSB7XG4gICAgICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckNsb3NlKGJ5b2JCcmFuY2guX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFvdGhlckNhbmNlbGVkKSB7XG4gICAgICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckNsb3NlKG90aGVyQnJhbmNoLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNodW5rICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBhc3NlcnQoY2h1bmsuYnl0ZUxlbmd0aCA9PT0gMCk7XG5cbiAgICAgICAgICBpZiAoIWJ5b2JDYW5jZWxlZCkge1xuICAgICAgICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclJlc3BvbmRXaXRoTmV3VmlldyhieW9iQnJhbmNoLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIsIGNodW5rKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFvdGhlckNhbmNlbGVkICYmIG90aGVyQnJhbmNoLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIuX3BlbmRpbmdQdWxsSW50b3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclJlc3BvbmQob3RoZXJCcmFuY2guX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlciwgMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFieW9iQ2FuY2VsZWQgfHwgIW90aGVyQ2FuY2VsZWQpIHtcbiAgICAgICAgICByZXNvbHZlQ2FuY2VsUHJvbWlzZSh1bmRlZmluZWQpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgX2Vycm9yU3RlcHM6ICgpID0+IHtcbiAgICAgICAgcmVhZGluZyA9IGZhbHNlO1xuICAgICAgfVxuICAgIH07XG4gICAgUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyUmVhZChyZWFkZXIsIHZpZXcsIDEsIHJlYWRJbnRvUmVxdWVzdCk7XG4gIH1cblxuICBmdW5jdGlvbiBwdWxsMUFsZ29yaXRobSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAocmVhZGluZykge1xuICAgICAgcmVhZEFnYWluRm9yQnJhbmNoMSA9IHRydWU7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlc29sdmVkV2l0aCh1bmRlZmluZWQpO1xuICAgIH1cblxuICAgIHJlYWRpbmcgPSB0cnVlO1xuXG4gICAgY29uc3QgYnlvYlJlcXVlc3QgPSBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyR2V0QllPQlJlcXVlc3QoYnJhbmNoMS5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyKTtcbiAgICBpZiAoYnlvYlJlcXVlc3QgPT09IG51bGwpIHtcbiAgICAgIHB1bGxXaXRoRGVmYXVsdFJlYWRlcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwdWxsV2l0aEJZT0JSZWFkZXIoYnlvYlJlcXVlc3QuX3ZpZXchLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHByb21pc2VSZXNvbHZlZFdpdGgodW5kZWZpbmVkKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHB1bGwyQWxnb3JpdGhtKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmIChyZWFkaW5nKSB7XG4gICAgICByZWFkQWdhaW5Gb3JCcmFuY2gyID0gdHJ1ZTtcbiAgICAgIHJldHVybiBwcm9taXNlUmVzb2x2ZWRXaXRoKHVuZGVmaW5lZCk7XG4gICAgfVxuXG4gICAgcmVhZGluZyA9IHRydWU7XG5cbiAgICBjb25zdCBieW9iUmVxdWVzdCA9IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJHZXRCWU9CUmVxdWVzdChicmFuY2gyLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIpO1xuICAgIGlmIChieW9iUmVxdWVzdCA9PT0gbnVsbCkge1xuICAgICAgcHVsbFdpdGhEZWZhdWx0UmVhZGVyKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHB1bGxXaXRoQllPQlJlYWRlcihieW9iUmVxdWVzdC5fdmlldyEsIHRydWUpO1xuICAgIH1cblxuICAgIHJldHVybiBwcm9taXNlUmVzb2x2ZWRXaXRoKHVuZGVmaW5lZCk7XG4gIH1cblxuICBmdW5jdGlvbiBjYW5jZWwxQWxnb3JpdGhtKHJlYXNvbjogYW55KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY2FuY2VsZWQxID0gdHJ1ZTtcbiAgICByZWFzb24xID0gcmVhc29uO1xuICAgIGlmIChjYW5jZWxlZDIpIHtcbiAgICAgIGNvbnN0IGNvbXBvc2l0ZVJlYXNvbiA9IENyZWF0ZUFycmF5RnJvbUxpc3QoW3JlYXNvbjEsIHJlYXNvbjJdKTtcbiAgICAgIGNvbnN0IGNhbmNlbFJlc3VsdCA9IFJlYWRhYmxlU3RyZWFtQ2FuY2VsKHN0cmVhbSwgY29tcG9zaXRlUmVhc29uKTtcbiAgICAgIHJlc29sdmVDYW5jZWxQcm9taXNlKGNhbmNlbFJlc3VsdCk7XG4gICAgfVxuICAgIHJldHVybiBjYW5jZWxQcm9taXNlO1xuICB9XG5cbiAgZnVuY3Rpb24gY2FuY2VsMkFsZ29yaXRobShyZWFzb246IGFueSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNhbmNlbGVkMiA9IHRydWU7XG4gICAgcmVhc29uMiA9IHJlYXNvbjtcbiAgICBpZiAoY2FuY2VsZWQxKSB7XG4gICAgICBjb25zdCBjb21wb3NpdGVSZWFzb24gPSBDcmVhdGVBcnJheUZyb21MaXN0KFtyZWFzb24xLCByZWFzb24yXSk7XG4gICAgICBjb25zdCBjYW5jZWxSZXN1bHQgPSBSZWFkYWJsZVN0cmVhbUNhbmNlbChzdHJlYW0sIGNvbXBvc2l0ZVJlYXNvbik7XG4gICAgICByZXNvbHZlQ2FuY2VsUHJvbWlzZShjYW5jZWxSZXN1bHQpO1xuICAgIH1cbiAgICByZXR1cm4gY2FuY2VsUHJvbWlzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0YXJ0QWxnb3JpdGhtKCk6IHZvaWQge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGJyYW5jaDEgPSBDcmVhdGVSZWFkYWJsZUJ5dGVTdHJlYW0oc3RhcnRBbGdvcml0aG0sIHB1bGwxQWxnb3JpdGhtLCBjYW5jZWwxQWxnb3JpdGhtKTtcbiAgYnJhbmNoMiA9IENyZWF0ZVJlYWRhYmxlQnl0ZVN0cmVhbShzdGFydEFsZ29yaXRobSwgcHVsbDJBbGdvcml0aG0sIGNhbmNlbDJBbGdvcml0aG0pO1xuXG4gIGZvcndhcmRSZWFkZXJFcnJvcihyZWFkZXIpO1xuXG4gIHJldHVybiBbYnJhbmNoMSwgYnJhbmNoMl07XG59XG4iLCAiaW1wb3J0IHsgdHlwZUlzT2JqZWN0IH0gZnJvbSAnLi4vaGVscGVycy9taXNjZWxsYW5lb3VzJztcbmltcG9ydCB0eXBlIHsgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZFJlc3VsdCB9IGZyb20gJy4vZGVmYXVsdC1yZWFkZXInO1xuXG4vKipcbiAqIEEgY29tbW9uIGludGVyZmFjZSBmb3IgYSBgUmVhZGFkYWJsZVN0cmVhbWAgaW1wbGVtZW50YXRpb24uXG4gKlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgaW50ZXJmYWNlIFJlYWRhYmxlU3RyZWFtTGlrZTxSID0gYW55PiB7XG4gIHJlYWRvbmx5IGxvY2tlZDogYm9vbGVhbjtcblxuICBnZXRSZWFkZXIoKTogUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyTGlrZTxSPjtcbn1cblxuLyoqXG4gKiBBIGNvbW1vbiBpbnRlcmZhY2UgZm9yIGEgYFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcmAgaW1wbGVtZW50YXRpb24uXG4gKlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgaW50ZXJmYWNlIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlckxpa2U8UiA9IGFueT4ge1xuICByZWFkb25seSBjbG9zZWQ6IFByb21pc2U8dW5kZWZpbmVkPjtcblxuICBjYW5jZWwocmVhc29uPzogYW55KTogUHJvbWlzZTx2b2lkPjtcblxuICByZWFkKCk6IFByb21pc2U8UmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZFJlc3VsdDxSPj47XG5cbiAgcmVsZWFzZUxvY2soKTogdm9pZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUmVhZGFibGVTdHJlYW1MaWtlPFI+KHN0cmVhbTogdW5rbm93bik6IHN0cmVhbSBpcyBSZWFkYWJsZVN0cmVhbUxpa2U8Uj4ge1xuICByZXR1cm4gdHlwZUlzT2JqZWN0KHN0cmVhbSkgJiYgdHlwZW9mIChzdHJlYW0gYXMgUmVhZGFibGVTdHJlYW1MaWtlPFI+KS5nZXRSZWFkZXIgIT09ICd1bmRlZmluZWQnO1xufVxuIiwgImltcG9ydCB7IENyZWF0ZVJlYWRhYmxlU3RyZWFtLCB0eXBlIERlZmF1bHRSZWFkYWJsZVN0cmVhbSB9IGZyb20gJy4uL3JlYWRhYmxlLXN0cmVhbSc7XG5pbXBvcnQge1xuICBpc1JlYWRhYmxlU3RyZWFtTGlrZSxcbiAgdHlwZSBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXJMaWtlLFxuICB0eXBlIFJlYWRhYmxlU3RyZWFtTGlrZVxufSBmcm9tICcuL3JlYWRhYmxlLXN0cmVhbS1saWtlJztcbmltcG9ydCB7IFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDbG9zZSwgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVucXVldWUgfSBmcm9tICcuL2RlZmF1bHQtY29udHJvbGxlcic7XG5pbXBvcnQgeyBHZXRJdGVyYXRvciwgR2V0TWV0aG9kLCBJdGVyYXRvckNvbXBsZXRlLCBJdGVyYXRvck5leHQsIEl0ZXJhdG9yVmFsdWUgfSBmcm9tICcuLi9hYnN0cmFjdC1vcHMvZWNtYXNjcmlwdCc7XG5pbXBvcnQgeyBwcm9taXNlUmVqZWN0ZWRXaXRoLCBwcm9taXNlUmVzb2x2ZWRXaXRoLCByZWZsZWN0Q2FsbCwgdHJhbnNmb3JtUHJvbWlzZVdpdGggfSBmcm9tICcuLi9oZWxwZXJzL3dlYmlkbCc7XG5pbXBvcnQgeyB0eXBlSXNPYmplY3QgfSBmcm9tICcuLi9oZWxwZXJzL21pc2NlbGxhbmVvdXMnO1xuaW1wb3J0IHsgbm9vcCB9IGZyb20gJy4uLy4uL3V0aWxzJztcblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtRnJvbTxSPihcbiAgc291cmNlOiBJdGVyYWJsZTxSPiB8IEFzeW5jSXRlcmFibGU8Uj4gfCBSZWFkYWJsZVN0cmVhbUxpa2U8Uj5cbik6IERlZmF1bHRSZWFkYWJsZVN0cmVhbTxSPiB7XG4gIGlmIChpc1JlYWRhYmxlU3RyZWFtTGlrZShzb3VyY2UpKSB7XG4gICAgcmV0dXJuIFJlYWRhYmxlU3RyZWFtRnJvbURlZmF1bHRSZWFkZXIoc291cmNlLmdldFJlYWRlcigpKTtcbiAgfVxuICByZXR1cm4gUmVhZGFibGVTdHJlYW1Gcm9tSXRlcmFibGUoc291cmNlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtRnJvbUl0ZXJhYmxlPFI+KGFzeW5jSXRlcmFibGU6IEl0ZXJhYmxlPFI+IHwgQXN5bmNJdGVyYWJsZTxSPik6IERlZmF1bHRSZWFkYWJsZVN0cmVhbTxSPiB7XG4gIGxldCBzdHJlYW06IERlZmF1bHRSZWFkYWJsZVN0cmVhbTxSPjtcbiAgY29uc3QgaXRlcmF0b3JSZWNvcmQgPSBHZXRJdGVyYXRvcihhc3luY0l0ZXJhYmxlLCAnYXN5bmMnKTtcblxuICBjb25zdCBzdGFydEFsZ29yaXRobSA9IG5vb3A7XG5cbiAgZnVuY3Rpb24gcHVsbEFsZ29yaXRobSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBsZXQgbmV4dFJlc3VsdDtcbiAgICB0cnkge1xuICAgICAgbmV4dFJlc3VsdCA9IEl0ZXJhdG9yTmV4dChpdGVyYXRvclJlY29yZCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoZSk7XG4gICAgfVxuICAgIGNvbnN0IG5leHRQcm9taXNlID0gcHJvbWlzZVJlc29sdmVkV2l0aChuZXh0UmVzdWx0KTtcbiAgICByZXR1cm4gdHJhbnNmb3JtUHJvbWlzZVdpdGgobmV4dFByb21pc2UsIGl0ZXJSZXN1bHQgPT4ge1xuICAgICAgaWYgKCF0eXBlSXNPYmplY3QoaXRlclJlc3VsdCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIHByb21pc2UgcmV0dXJuZWQgYnkgdGhlIGl0ZXJhdG9yLm5leHQoKSBtZXRob2QgbXVzdCBmdWxmaWxsIHdpdGggYW4gb2JqZWN0Jyk7XG4gICAgICB9XG4gICAgICBjb25zdCBkb25lID0gSXRlcmF0b3JDb21wbGV0ZShpdGVyUmVzdWx0KTtcbiAgICAgIGlmIChkb25lKSB7XG4gICAgICAgIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDbG9zZShzdHJlYW0uX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IEl0ZXJhdG9yVmFsdWUoaXRlclJlc3VsdCk7XG4gICAgICAgIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFbnF1ZXVlKHN0cmVhbS5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBjYW5jZWxBbGdvcml0aG0ocmVhc29uOiBhbnkpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBpdGVyYXRvciA9IGl0ZXJhdG9yUmVjb3JkLml0ZXJhdG9yO1xuICAgIGxldCByZXR1cm5NZXRob2Q6ICh0eXBlb2YgaXRlcmF0b3IpWydyZXR1cm4nXSB8IHVuZGVmaW5lZDtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuTWV0aG9kID0gR2V0TWV0aG9kKGl0ZXJhdG9yLCAncmV0dXJuJyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoZSk7XG4gICAgfVxuICAgIGlmIChyZXR1cm5NZXRob2QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZXNvbHZlZFdpdGgodW5kZWZpbmVkKTtcbiAgICB9XG4gICAgbGV0IHJldHVyblJlc3VsdDogSXRlcmF0b3JSZXN1bHQ8Uj4gfCBQcm9taXNlPEl0ZXJhdG9yUmVzdWx0PFI+PjtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuUmVzdWx0ID0gcmVmbGVjdENhbGwocmV0dXJuTWV0aG9kLCBpdGVyYXRvciwgW3JlYXNvbl0pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKGUpO1xuICAgIH1cbiAgICBjb25zdCByZXR1cm5Qcm9taXNlID0gcHJvbWlzZVJlc29sdmVkV2l0aChyZXR1cm5SZXN1bHQpO1xuICAgIHJldHVybiB0cmFuc2Zvcm1Qcm9taXNlV2l0aChyZXR1cm5Qcm9taXNlLCBpdGVyUmVzdWx0ID0+IHtcbiAgICAgIGlmICghdHlwZUlzT2JqZWN0KGl0ZXJSZXN1bHQpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBwcm9taXNlIHJldHVybmVkIGJ5IHRoZSBpdGVyYXRvci5yZXR1cm4oKSBtZXRob2QgbXVzdCBmdWxmaWxsIHdpdGggYW4gb2JqZWN0Jyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0pO1xuICB9XG5cbiAgc3RyZWFtID0gQ3JlYXRlUmVhZGFibGVTdHJlYW0oc3RhcnRBbGdvcml0aG0sIHB1bGxBbGdvcml0aG0sIGNhbmNlbEFsZ29yaXRobSwgMCk7XG4gIHJldHVybiBzdHJlYW07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZVN0cmVhbUZyb21EZWZhdWx0UmVhZGVyPFI+KFxuICByZWFkZXI6IFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlckxpa2U8Uj5cbik6IERlZmF1bHRSZWFkYWJsZVN0cmVhbTxSPiB7XG4gIGxldCBzdHJlYW06IERlZmF1bHRSZWFkYWJsZVN0cmVhbTxSPjtcblxuICBjb25zdCBzdGFydEFsZ29yaXRobSA9IG5vb3A7XG5cbiAgZnVuY3Rpb24gcHVsbEFsZ29yaXRobSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBsZXQgcmVhZFByb21pc2U7XG4gICAgdHJ5IHtcbiAgICAgIHJlYWRQcm9taXNlID0gcmVhZGVyLnJlYWQoKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChlKTtcbiAgICB9XG4gICAgcmV0dXJuIHRyYW5zZm9ybVByb21pc2VXaXRoKHJlYWRQcm9taXNlLCByZWFkUmVzdWx0ID0+IHtcbiAgICAgIGlmICghdHlwZUlzT2JqZWN0KHJlYWRSZXN1bHQpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBwcm9taXNlIHJldHVybmVkIGJ5IHRoZSByZWFkZXIucmVhZCgpIG1ldGhvZCBtdXN0IGZ1bGZpbGwgd2l0aCBhbiBvYmplY3QnKTtcbiAgICAgIH1cbiAgICAgIGlmIChyZWFkUmVzdWx0LmRvbmUpIHtcbiAgICAgICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNsb3NlKHN0cmVhbS5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gcmVhZFJlc3VsdC52YWx1ZTtcbiAgICAgICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVucXVldWUoc3RyZWFtLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIsIHZhbHVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbmNlbEFsZ29yaXRobShyZWFzb246IGFueSk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlc29sdmVkV2l0aChyZWFkZXIuY2FuY2VsKHJlYXNvbikpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKGUpO1xuICAgIH1cbiAgfVxuXG4gIHN0cmVhbSA9IENyZWF0ZVJlYWRhYmxlU3RyZWFtKHN0YXJ0QWxnb3JpdGhtLCBwdWxsQWxnb3JpdGhtLCBjYW5jZWxBbGdvcml0aG0sIDApO1xuICByZXR1cm4gc3RyZWFtO1xufVxuIiwgImltcG9ydCB7IGFzc2VydERpY3Rpb25hcnksIGFzc2VydEZ1bmN0aW9uLCBjb252ZXJ0VW5zaWduZWRMb25nTG9uZ1dpdGhFbmZvcmNlUmFuZ2UgfSBmcm9tICcuL2Jhc2ljJztcbmltcG9ydCB0eXBlIHtcbiAgUmVhZGFibGVTdHJlYW1Db250cm9sbGVyLFxuICBVbmRlcmx5aW5nQnl0ZVNvdXJjZSxcbiAgVW5kZXJseWluZ0RlZmF1bHRPckJ5dGVTb3VyY2UsXG4gIFVuZGVybHlpbmdEZWZhdWx0T3JCeXRlU291cmNlUHVsbENhbGxiYWNrLFxuICBVbmRlcmx5aW5nRGVmYXVsdE9yQnl0ZVNvdXJjZVN0YXJ0Q2FsbGJhY2ssXG4gIFVuZGVybHlpbmdTb3VyY2UsXG4gIFVuZGVybHlpbmdTb3VyY2VDYW5jZWxDYWxsYmFjayxcbiAgVmFsaWRhdGVkVW5kZXJseWluZ0RlZmF1bHRPckJ5dGVTb3VyY2Vcbn0gZnJvbSAnLi4vcmVhZGFibGUtc3RyZWFtL3VuZGVybHlpbmctc291cmNlJztcbmltcG9ydCB7IHByb21pc2VDYWxsLCByZWZsZWN0Q2FsbCB9IGZyb20gJy4uL2hlbHBlcnMvd2ViaWRsJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRVbmRlcmx5aW5nRGVmYXVsdE9yQnl0ZVNvdXJjZTxSPihcbiAgc291cmNlOiBVbmRlcmx5aW5nU291cmNlPFI+IHwgVW5kZXJseWluZ0J5dGVTb3VyY2UgfCBudWxsLFxuICBjb250ZXh0OiBzdHJpbmdcbik6IFZhbGlkYXRlZFVuZGVybHlpbmdEZWZhdWx0T3JCeXRlU291cmNlPFI+IHtcbiAgYXNzZXJ0RGljdGlvbmFyeShzb3VyY2UsIGNvbnRleHQpO1xuICBjb25zdCBvcmlnaW5hbCA9IHNvdXJjZSBhcyAoVW5kZXJseWluZ0RlZmF1bHRPckJ5dGVTb3VyY2U8Uj4gfCBudWxsKTtcbiAgY29uc3QgYXV0b0FsbG9jYXRlQ2h1bmtTaXplID0gb3JpZ2luYWw/LmF1dG9BbGxvY2F0ZUNodW5rU2l6ZTtcbiAgY29uc3QgY2FuY2VsID0gb3JpZ2luYWw/LmNhbmNlbDtcbiAgY29uc3QgcHVsbCA9IG9yaWdpbmFsPy5wdWxsO1xuICBjb25zdCBzdGFydCA9IG9yaWdpbmFsPy5zdGFydDtcbiAgY29uc3QgdHlwZSA9IG9yaWdpbmFsPy50eXBlO1xuICByZXR1cm4ge1xuICAgIGF1dG9BbGxvY2F0ZUNodW5rU2l6ZTogYXV0b0FsbG9jYXRlQ2h1bmtTaXplID09PSB1bmRlZmluZWQgP1xuICAgICAgdW5kZWZpbmVkIDpcbiAgICAgIGNvbnZlcnRVbnNpZ25lZExvbmdMb25nV2l0aEVuZm9yY2VSYW5nZShcbiAgICAgICAgYXV0b0FsbG9jYXRlQ2h1bmtTaXplLFxuICAgICAgICBgJHtjb250ZXh0fSBoYXMgbWVtYmVyICdhdXRvQWxsb2NhdGVDaHVua1NpemUnIHRoYXRgXG4gICAgICApLFxuICAgIGNhbmNlbDogY2FuY2VsID09PSB1bmRlZmluZWQgP1xuICAgICAgdW5kZWZpbmVkIDpcbiAgICAgIGNvbnZlcnRVbmRlcmx5aW5nU291cmNlQ2FuY2VsQ2FsbGJhY2soY2FuY2VsLCBvcmlnaW5hbCEsIGAke2NvbnRleHR9IGhhcyBtZW1iZXIgJ2NhbmNlbCcgdGhhdGApLFxuICAgIHB1bGw6IHB1bGwgPT09IHVuZGVmaW5lZCA/XG4gICAgICB1bmRlZmluZWQgOlxuICAgICAgY29udmVydFVuZGVybHlpbmdTb3VyY2VQdWxsQ2FsbGJhY2socHVsbCwgb3JpZ2luYWwhLCBgJHtjb250ZXh0fSBoYXMgbWVtYmVyICdwdWxsJyB0aGF0YCksXG4gICAgc3RhcnQ6IHN0YXJ0ID09PSB1bmRlZmluZWQgP1xuICAgICAgdW5kZWZpbmVkIDpcbiAgICAgIGNvbnZlcnRVbmRlcmx5aW5nU291cmNlU3RhcnRDYWxsYmFjayhzdGFydCwgb3JpZ2luYWwhLCBgJHtjb250ZXh0fSBoYXMgbWVtYmVyICdzdGFydCcgdGhhdGApLFxuICAgIHR5cGU6IHR5cGUgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZCA6IGNvbnZlcnRSZWFkYWJsZVN0cmVhbVR5cGUodHlwZSwgYCR7Y29udGV4dH0gaGFzIG1lbWJlciAndHlwZScgdGhhdGApXG4gIH07XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRVbmRlcmx5aW5nU291cmNlQ2FuY2VsQ2FsbGJhY2soXG4gIGZuOiBVbmRlcmx5aW5nU291cmNlQ2FuY2VsQ2FsbGJhY2ssXG4gIG9yaWdpbmFsOiBVbmRlcmx5aW5nRGVmYXVsdE9yQnl0ZVNvdXJjZSxcbiAgY29udGV4dDogc3RyaW5nXG4pOiAocmVhc29uOiBhbnkpID0+IFByb21pc2U8dm9pZD4ge1xuICBhc3NlcnRGdW5jdGlvbihmbiwgY29udGV4dCk7XG4gIHJldHVybiAocmVhc29uOiBhbnkpID0+IHByb21pc2VDYWxsKGZuLCBvcmlnaW5hbCwgW3JlYXNvbl0pO1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0VW5kZXJseWluZ1NvdXJjZVB1bGxDYWxsYmFjazxSPihcbiAgZm46IFVuZGVybHlpbmdEZWZhdWx0T3JCeXRlU291cmNlUHVsbENhbGxiYWNrPFI+LFxuICBvcmlnaW5hbDogVW5kZXJseWluZ0RlZmF1bHRPckJ5dGVTb3VyY2U8Uj4sXG4gIGNvbnRleHQ6IHN0cmluZ1xuKTogKGNvbnRyb2xsZXI6IFJlYWRhYmxlU3RyZWFtQ29udHJvbGxlcjxSPikgPT4gUHJvbWlzZTx2b2lkPiB7XG4gIGFzc2VydEZ1bmN0aW9uKGZuLCBjb250ZXh0KTtcbiAgcmV0dXJuIChjb250cm9sbGVyOiBSZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXI8Uj4pID0+IHByb21pc2VDYWxsKGZuLCBvcmlnaW5hbCwgW2NvbnRyb2xsZXJdKTtcbn1cblxuZnVuY3Rpb24gY29udmVydFVuZGVybHlpbmdTb3VyY2VTdGFydENhbGxiYWNrPFI+KFxuICBmbjogVW5kZXJseWluZ0RlZmF1bHRPckJ5dGVTb3VyY2VTdGFydENhbGxiYWNrPFI+LFxuICBvcmlnaW5hbDogVW5kZXJseWluZ0RlZmF1bHRPckJ5dGVTb3VyY2U8Uj4sXG4gIGNvbnRleHQ6IHN0cmluZ1xuKTogVW5kZXJseWluZ0RlZmF1bHRPckJ5dGVTb3VyY2VTdGFydENhbGxiYWNrPFI+IHtcbiAgYXNzZXJ0RnVuY3Rpb24oZm4sIGNvbnRleHQpO1xuICByZXR1cm4gKGNvbnRyb2xsZXI6IFJlYWRhYmxlU3RyZWFtQ29udHJvbGxlcjxSPikgPT4gcmVmbGVjdENhbGwoZm4sIG9yaWdpbmFsLCBbY29udHJvbGxlcl0pO1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0UmVhZGFibGVTdHJlYW1UeXBlKHR5cGU6IHN0cmluZywgY29udGV4dDogc3RyaW5nKTogJ2J5dGVzJyB7XG4gIHR5cGUgPSBgJHt0eXBlfWA7XG4gIGlmICh0eXBlICE9PSAnYnl0ZXMnKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgJHtjb250ZXh0fSAnJHt0eXBlfScgaXMgbm90IGEgdmFsaWQgZW51bWVyYXRpb24gdmFsdWUgZm9yIFJlYWRhYmxlU3RyZWFtVHlwZWApO1xuICB9XG4gIHJldHVybiB0eXBlO1xufVxuIiwgImltcG9ydCB7IGFzc2VydERpY3Rpb25hcnkgfSBmcm9tICcuL2Jhc2ljJztcbmltcG9ydCB0eXBlIHtcbiAgUmVhZGFibGVTdHJlYW1JdGVyYXRvck9wdGlvbnMsXG4gIFZhbGlkYXRlZFJlYWRhYmxlU3RyZWFtSXRlcmF0b3JPcHRpb25zXG59IGZyb20gJy4uL3JlYWRhYmxlLXN0cmVhbS9pdGVyYXRvci1vcHRpb25zJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRJdGVyYXRvck9wdGlvbnMob3B0aW9uczogUmVhZGFibGVTdHJlYW1JdGVyYXRvck9wdGlvbnMgfCBudWxsIHwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dDogc3RyaW5nKTogVmFsaWRhdGVkUmVhZGFibGVTdHJlYW1JdGVyYXRvck9wdGlvbnMge1xuICBhc3NlcnREaWN0aW9uYXJ5KG9wdGlvbnMsIGNvbnRleHQpO1xuICBjb25zdCBwcmV2ZW50Q2FuY2VsID0gb3B0aW9ucz8ucHJldmVudENhbmNlbDtcbiAgcmV0dXJuIHsgcHJldmVudENhbmNlbDogQm9vbGVhbihwcmV2ZW50Q2FuY2VsKSB9O1xufVxuIiwgImltcG9ydCB7IGFzc2VydERpY3Rpb25hcnkgfSBmcm9tICcuL2Jhc2ljJztcbmltcG9ydCB0eXBlIHsgU3RyZWFtUGlwZU9wdGlvbnMsIFZhbGlkYXRlZFN0cmVhbVBpcGVPcHRpb25zIH0gZnJvbSAnLi4vcmVhZGFibGUtc3RyZWFtL3BpcGUtb3B0aW9ucyc7XG5pbXBvcnQgeyB0eXBlIEFib3J0U2lnbmFsLCBpc0Fib3J0U2lnbmFsIH0gZnJvbSAnLi4vYWJvcnQtc2lnbmFsJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRQaXBlT3B0aW9ucyhvcHRpb25zOiBTdHJlYW1QaXBlT3B0aW9ucyB8IG51bGwgfCB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6IHN0cmluZyk6IFZhbGlkYXRlZFN0cmVhbVBpcGVPcHRpb25zIHtcbiAgYXNzZXJ0RGljdGlvbmFyeShvcHRpb25zLCBjb250ZXh0KTtcbiAgY29uc3QgcHJldmVudEFib3J0ID0gb3B0aW9ucz8ucHJldmVudEFib3J0O1xuICBjb25zdCBwcmV2ZW50Q2FuY2VsID0gb3B0aW9ucz8ucHJldmVudENhbmNlbDtcbiAgY29uc3QgcHJldmVudENsb3NlID0gb3B0aW9ucz8ucHJldmVudENsb3NlO1xuICBjb25zdCBzaWduYWwgPSBvcHRpb25zPy5zaWduYWw7XG4gIGlmIChzaWduYWwgIT09IHVuZGVmaW5lZCkge1xuICAgIGFzc2VydEFib3J0U2lnbmFsKHNpZ25hbCwgYCR7Y29udGV4dH0gaGFzIG1lbWJlciAnc2lnbmFsJyB0aGF0YCk7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBwcmV2ZW50QWJvcnQ6IEJvb2xlYW4ocHJldmVudEFib3J0KSxcbiAgICBwcmV2ZW50Q2FuY2VsOiBCb29sZWFuKHByZXZlbnRDYW5jZWwpLFxuICAgIHByZXZlbnRDbG9zZTogQm9vbGVhbihwcmV2ZW50Q2xvc2UpLFxuICAgIHNpZ25hbFxuICB9O1xufVxuXG5mdW5jdGlvbiBhc3NlcnRBYm9ydFNpZ25hbChzaWduYWw6IHVua25vd24sIGNvbnRleHQ6IHN0cmluZyk6IGFzc2VydHMgc2lnbmFsIGlzIEFib3J0U2lnbmFsIHtcbiAgaWYgKCFpc0Fib3J0U2lnbmFsKHNpZ25hbCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGAke2NvbnRleHR9IGlzIG5vdCBhbiBBYm9ydFNpZ25hbC5gKTtcbiAgfVxufVxuIiwgImltcG9ydCB7IGFzc2VydERpY3Rpb25hcnksIGFzc2VydFJlcXVpcmVkRmllbGQgfSBmcm9tICcuL2Jhc2ljJztcbmltcG9ydCB7IFJlYWRhYmxlU3RyZWFtIH0gZnJvbSAnLi4vcmVhZGFibGUtc3RyZWFtJztcbmltcG9ydCB7IFdyaXRhYmxlU3RyZWFtIH0gZnJvbSAnLi4vd3JpdGFibGUtc3RyZWFtJztcbmltcG9ydCB7IGFzc2VydFJlYWRhYmxlU3RyZWFtIH0gZnJvbSAnLi9yZWFkYWJsZS1zdHJlYW0nO1xuaW1wb3J0IHsgYXNzZXJ0V3JpdGFibGVTdHJlYW0gfSBmcm9tICcuL3dyaXRhYmxlLXN0cmVhbSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0UmVhZGFibGVXcml0YWJsZVBhaXI8UlMgZXh0ZW5kcyBSZWFkYWJsZVN0cmVhbSwgV1MgZXh0ZW5kcyBXcml0YWJsZVN0cmVhbT4oXG4gIHBhaXI6IHsgcmVhZGFibGU6IFJTOyB3cml0YWJsZTogV1MgfSB8IG51bGwgfCB1bmRlZmluZWQsXG4gIGNvbnRleHQ6IHN0cmluZ1xuKTogeyByZWFkYWJsZTogUlM7IHdyaXRhYmxlOiBXUyB9IHtcbiAgYXNzZXJ0RGljdGlvbmFyeShwYWlyLCBjb250ZXh0KTtcblxuICBjb25zdCByZWFkYWJsZSA9IHBhaXI/LnJlYWRhYmxlO1xuICBhc3NlcnRSZXF1aXJlZEZpZWxkKHJlYWRhYmxlLCAncmVhZGFibGUnLCAnUmVhZGFibGVXcml0YWJsZVBhaXInKTtcbiAgYXNzZXJ0UmVhZGFibGVTdHJlYW0ocmVhZGFibGUsIGAke2NvbnRleHR9IGhhcyBtZW1iZXIgJ3JlYWRhYmxlJyB0aGF0YCk7XG5cbiAgY29uc3Qgd3JpdGFibGUgPSBwYWlyPy53cml0YWJsZTtcbiAgYXNzZXJ0UmVxdWlyZWRGaWVsZCh3cml0YWJsZSwgJ3dyaXRhYmxlJywgJ1JlYWRhYmxlV3JpdGFibGVQYWlyJyk7XG4gIGFzc2VydFdyaXRhYmxlU3RyZWFtKHdyaXRhYmxlLCBgJHtjb250ZXh0fSBoYXMgbWVtYmVyICd3cml0YWJsZScgdGhhdGApO1xuXG4gIHJldHVybiB7IHJlYWRhYmxlLCB3cml0YWJsZSB9O1xufVxuIiwgImltcG9ydCBhc3NlcnQgZnJvbSAnLi4vc3R1Yi9hc3NlcnQnO1xuaW1wb3J0IHtcbiAgcHJvbWlzZVJlamVjdGVkV2l0aCxcbiAgcHJvbWlzZVJlc29sdmVkV2l0aCxcbiAgc2V0UHJvbWlzZUlzSGFuZGxlZFRvVHJ1ZSxcbiAgdHJhbnNmb3JtUHJvbWlzZVdpdGhcbn0gZnJvbSAnLi9oZWxwZXJzL3dlYmlkbCc7XG5pbXBvcnQgdHlwZSB7IFF1ZXVpbmdTdHJhdGVneSwgUXVldWluZ1N0cmF0ZWd5U2l6ZUNhbGxiYWNrIH0gZnJvbSAnLi9xdWV1aW5nLXN0cmF0ZWd5JztcbmltcG9ydCB7IEFjcXVpcmVSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3IsIHR5cGUgUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9yIH0gZnJvbSAnLi9yZWFkYWJsZS1zdHJlYW0vYXN5bmMtaXRlcmF0b3InO1xuaW1wb3J0IHsgZGVmYXVsdFJlYWRlckNsb3NlZFByb21pc2VSZWplY3QsIGRlZmF1bHRSZWFkZXJDbG9zZWRQcm9taXNlUmVzb2x2ZSB9IGZyb20gJy4vcmVhZGFibGUtc3RyZWFtL2dlbmVyaWMtcmVhZGVyJztcbmltcG9ydCB7XG4gIEFjcXVpcmVSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXIsXG4gIElzUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyLFxuICBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXIsXG4gIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlckVycm9yUmVhZFJlcXVlc3RzLFxuICB0eXBlIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRSZXN1bHRcbn0gZnJvbSAnLi9yZWFkYWJsZS1zdHJlYW0vZGVmYXVsdC1yZWFkZXInO1xuaW1wb3J0IHtcbiAgQWNxdWlyZVJlYWRhYmxlU3RyZWFtQllPQlJlYWRlcixcbiAgSXNSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIsXG4gIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlcixcbiAgUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyRXJyb3JSZWFkSW50b1JlcXVlc3RzLFxuICB0eXBlIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRSZXN1bHRcbn0gZnJvbSAnLi9yZWFkYWJsZS1zdHJlYW0vYnlvYi1yZWFkZXInO1xuaW1wb3J0IHsgUmVhZGFibGVTdHJlYW1QaXBlVG8gfSBmcm9tICcuL3JlYWRhYmxlLXN0cmVhbS9waXBlJztcbmltcG9ydCB7IFJlYWRhYmxlU3RyZWFtVGVlIH0gZnJvbSAnLi9yZWFkYWJsZS1zdHJlYW0vdGVlJztcbmltcG9ydCB7IFJlYWRhYmxlU3RyZWFtRnJvbSB9IGZyb20gJy4vcmVhZGFibGUtc3RyZWFtL2Zyb20nO1xuaW1wb3J0IHsgSXNXcml0YWJsZVN0cmVhbSwgSXNXcml0YWJsZVN0cmVhbUxvY2tlZCwgV3JpdGFibGVTdHJlYW0gfSBmcm9tICcuL3dyaXRhYmxlLXN0cmVhbSc7XG5pbXBvcnQgeyBTaW1wbGVRdWV1ZSB9IGZyb20gJy4vc2ltcGxlLXF1ZXVlJztcbmltcG9ydCB7XG4gIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIsXG4gIFJlYWRhYmxlU3RyZWFtQllPQlJlcXVlc3QsXG4gIFNldFVwUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcixcbiAgU2V0VXBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRnJvbVVuZGVybHlpbmdTb3VyY2Vcbn0gZnJvbSAnLi9yZWFkYWJsZS1zdHJlYW0vYnl0ZS1zdHJlYW0tY29udHJvbGxlcic7XG5pbXBvcnQge1xuICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyLFxuICBTZXRVcFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIsXG4gIFNldFVwUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckZyb21VbmRlcmx5aW5nU291cmNlXG59IGZyb20gJy4vcmVhZGFibGUtc3RyZWFtL2RlZmF1bHQtY29udHJvbGxlcic7XG5pbXBvcnQgdHlwZSB7XG4gIFVuZGVybHlpbmdCeXRlU291cmNlLFxuICBVbmRlcmx5aW5nQnl0ZVNvdXJjZVB1bGxDYWxsYmFjayxcbiAgVW5kZXJseWluZ0J5dGVTb3VyY2VTdGFydENhbGxiYWNrLFxuICBVbmRlcmx5aW5nU291cmNlLFxuICBVbmRlcmx5aW5nU291cmNlQ2FuY2VsQ2FsbGJhY2ssXG4gIFVuZGVybHlpbmdTb3VyY2VQdWxsQ2FsbGJhY2ssXG4gIFVuZGVybHlpbmdTb3VyY2VTdGFydENhbGxiYWNrXG59IGZyb20gJy4vcmVhZGFibGUtc3RyZWFtL3VuZGVybHlpbmctc291cmNlJztcbmltcG9ydCB7IG5vb3AgfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgeyBzZXRGdW5jdGlvbk5hbWUsIHR5cGVJc09iamVjdCB9IGZyb20gJy4vaGVscGVycy9taXNjZWxsYW5lb3VzJztcbmltcG9ydCB7IENyZWF0ZUFycmF5RnJvbUxpc3QsIFN5bWJvbEFzeW5jSXRlcmF0b3IgfSBmcm9tICcuL2Fic3RyYWN0LW9wcy9lY21hc2NyaXB0JztcbmltcG9ydCB7IENhbmNlbFN0ZXBzIH0gZnJvbSAnLi9hYnN0cmFjdC1vcHMvaW50ZXJuYWwtbWV0aG9kcyc7XG5pbXBvcnQgeyBJc05vbk5lZ2F0aXZlTnVtYmVyIH0gZnJvbSAnLi9hYnN0cmFjdC1vcHMvbWlzY2VsbGFuZW91cyc7XG5pbXBvcnQgeyBhc3NlcnRPYmplY3QsIGFzc2VydFJlcXVpcmVkQXJndW1lbnQgfSBmcm9tICcuL3ZhbGlkYXRvcnMvYmFzaWMnO1xuaW1wb3J0IHsgY29udmVydFF1ZXVpbmdTdHJhdGVneSB9IGZyb20gJy4vdmFsaWRhdG9ycy9xdWV1aW5nLXN0cmF0ZWd5JztcbmltcG9ydCB7IEV4dHJhY3RIaWdoV2F0ZXJNYXJrLCBFeHRyYWN0U2l6ZUFsZ29yaXRobSB9IGZyb20gJy4vYWJzdHJhY3Qtb3BzL3F1ZXVpbmctc3RyYXRlZ3knO1xuaW1wb3J0IHsgY29udmVydFVuZGVybHlpbmdEZWZhdWx0T3JCeXRlU291cmNlIH0gZnJvbSAnLi92YWxpZGF0b3JzL3VuZGVybHlpbmctc291cmNlJztcbmltcG9ydCB0eXBlIHtcbiAgUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyUmVhZE9wdGlvbnMsXG4gIFJlYWRhYmxlU3RyZWFtR2V0UmVhZGVyT3B0aW9uc1xufSBmcm9tICcuL3JlYWRhYmxlLXN0cmVhbS9yZWFkZXItb3B0aW9ucyc7XG5pbXBvcnQgeyBjb252ZXJ0UmVhZGVyT3B0aW9ucyB9IGZyb20gJy4vdmFsaWRhdG9ycy9yZWFkZXItb3B0aW9ucyc7XG5pbXBvcnQgdHlwZSB7IFN0cmVhbVBpcGVPcHRpb25zLCBWYWxpZGF0ZWRTdHJlYW1QaXBlT3B0aW9ucyB9IGZyb20gJy4vcmVhZGFibGUtc3RyZWFtL3BpcGUtb3B0aW9ucyc7XG5pbXBvcnQgdHlwZSB7IFJlYWRhYmxlU3RyZWFtSXRlcmF0b3JPcHRpb25zIH0gZnJvbSAnLi9yZWFkYWJsZS1zdHJlYW0vaXRlcmF0b3Itb3B0aW9ucyc7XG5pbXBvcnQgeyBjb252ZXJ0SXRlcmF0b3JPcHRpb25zIH0gZnJvbSAnLi92YWxpZGF0b3JzL2l0ZXJhdG9yLW9wdGlvbnMnO1xuaW1wb3J0IHsgY29udmVydFBpcGVPcHRpb25zIH0gZnJvbSAnLi92YWxpZGF0b3JzL3BpcGUtb3B0aW9ucyc7XG5pbXBvcnQgdHlwZSB7IFJlYWRhYmxlV3JpdGFibGVQYWlyIH0gZnJvbSAnLi9yZWFkYWJsZS1zdHJlYW0vcmVhZGFibGUtd3JpdGFibGUtcGFpcic7XG5pbXBvcnQgeyBjb252ZXJ0UmVhZGFibGVXcml0YWJsZVBhaXIgfSBmcm9tICcuL3ZhbGlkYXRvcnMvcmVhZGFibGUtd3JpdGFibGUtcGFpcic7XG5pbXBvcnQgdHlwZSB7IFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlckxpa2UsIFJlYWRhYmxlU3RyZWFtTGlrZSB9IGZyb20gJy4vcmVhZGFibGUtc3RyZWFtL3JlYWRhYmxlLXN0cmVhbS1saWtlJztcbmltcG9ydCB0eXBlIHsgTm9uU2hhcmVkIH0gZnJvbSAnLi9oZWxwZXJzL2FycmF5LWJ1ZmZlci12aWV3JztcblxuZXhwb3J0IHR5cGUgRGVmYXVsdFJlYWRhYmxlU3RyZWFtPFIgPSBhbnk+ID0gUmVhZGFibGVTdHJlYW08Uj4gJiB7XG4gIF9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXI6IFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8Uj5cbn07XG5cbmV4cG9ydCB0eXBlIFJlYWRhYmxlQnl0ZVN0cmVhbSA9IFJlYWRhYmxlU3RyZWFtPE5vblNoYXJlZDxVaW50OEFycmF5Pj4gJiB7XG4gIF9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXI6IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJcbn07XG5cbnR5cGUgUmVhZGFibGVTdHJlYW1TdGF0ZSA9ICdyZWFkYWJsZScgfCAnY2xvc2VkJyB8ICdlcnJvcmVkJztcblxuLyoqXG4gKiBBIHJlYWRhYmxlIHN0cmVhbSByZXByZXNlbnRzIGEgc291cmNlIG9mIGRhdGEsIGZyb20gd2hpY2ggeW91IGNhbiByZWFkLlxuICpcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNsYXNzIFJlYWRhYmxlU3RyZWFtPFIgPSBhbnk+IGltcGxlbWVudHMgQXN5bmNJdGVyYWJsZTxSPiB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3N0YXRlITogUmVhZGFibGVTdHJlYW1TdGF0ZTtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcmVhZGVyOiBSZWFkYWJsZVN0cmVhbVJlYWRlcjxSPiB8IHVuZGVmaW5lZDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfc3RvcmVkRXJyb3I6IGFueTtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfZGlzdHVyYmVkITogYm9vbGVhbjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcmVhZGFibGVTdHJlYW1Db250cm9sbGVyITogUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxSPiB8IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXI7XG5cbiAgY29uc3RydWN0b3IodW5kZXJseWluZ1NvdXJjZTogVW5kZXJseWluZ0J5dGVTb3VyY2UsIHN0cmF0ZWd5PzogeyBoaWdoV2F0ZXJNYXJrPzogbnVtYmVyOyBzaXplPzogdW5kZWZpbmVkIH0pO1xuICBjb25zdHJ1Y3Rvcih1bmRlcmx5aW5nU291cmNlPzogVW5kZXJseWluZ1NvdXJjZTxSPiwgc3RyYXRlZ3k/OiBRdWV1aW5nU3RyYXRlZ3k8Uj4pO1xuICBjb25zdHJ1Y3RvcihyYXdVbmRlcmx5aW5nU291cmNlOiBVbmRlcmx5aW5nU291cmNlPFI+IHwgVW5kZXJseWluZ0J5dGVTb3VyY2UgfCBudWxsIHwgdW5kZWZpbmVkID0ge30sXG4gICAgICAgICAgICAgIHJhd1N0cmF0ZWd5OiBRdWV1aW5nU3RyYXRlZ3k8Uj4gfCBudWxsIHwgdW5kZWZpbmVkID0ge30pIHtcbiAgICBpZiAocmF3VW5kZXJseWluZ1NvdXJjZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByYXdVbmRlcmx5aW5nU291cmNlID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgYXNzZXJ0T2JqZWN0KHJhd1VuZGVybHlpbmdTb3VyY2UsICdGaXJzdCBwYXJhbWV0ZXInKTtcbiAgICB9XG5cbiAgICBjb25zdCBzdHJhdGVneSA9IGNvbnZlcnRRdWV1aW5nU3RyYXRlZ3kocmF3U3RyYXRlZ3ksICdTZWNvbmQgcGFyYW1ldGVyJyk7XG4gICAgY29uc3QgdW5kZXJseWluZ1NvdXJjZSA9IGNvbnZlcnRVbmRlcmx5aW5nRGVmYXVsdE9yQnl0ZVNvdXJjZShyYXdVbmRlcmx5aW5nU291cmNlLCAnRmlyc3QgcGFyYW1ldGVyJyk7XG5cbiAgICBJbml0aWFsaXplUmVhZGFibGVTdHJlYW0odGhpcyk7XG5cbiAgICBpZiAodW5kZXJseWluZ1NvdXJjZS50eXBlID09PSAnYnl0ZXMnKSB7XG4gICAgICBpZiAoc3RyYXRlZ3kuc2l6ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdUaGUgc3RyYXRlZ3kgZm9yIGEgYnl0ZSBzdHJlYW0gY2Fubm90IGhhdmUgYSBzaXplIGZ1bmN0aW9uJyk7XG4gICAgICB9XG4gICAgICBjb25zdCBoaWdoV2F0ZXJNYXJrID0gRXh0cmFjdEhpZ2hXYXRlck1hcmsoc3RyYXRlZ3ksIDApO1xuICAgICAgU2V0VXBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRnJvbVVuZGVybHlpbmdTb3VyY2UoXG4gICAgICAgIHRoaXMgYXMgdW5rbm93biBhcyBSZWFkYWJsZUJ5dGVTdHJlYW0sXG4gICAgICAgIHVuZGVybHlpbmdTb3VyY2UsXG4gICAgICAgIGhpZ2hXYXRlck1hcmtcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFzc2VydCh1bmRlcmx5aW5nU291cmNlLnR5cGUgPT09IHVuZGVmaW5lZCk7XG4gICAgICBjb25zdCBzaXplQWxnb3JpdGhtID0gRXh0cmFjdFNpemVBbGdvcml0aG0oc3RyYXRlZ3kpO1xuICAgICAgY29uc3QgaGlnaFdhdGVyTWFyayA9IEV4dHJhY3RIaWdoV2F0ZXJNYXJrKHN0cmF0ZWd5LCAxKTtcbiAgICAgIFNldFVwUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckZyb21VbmRlcmx5aW5nU291cmNlKFxuICAgICAgICB0aGlzLFxuICAgICAgICB1bmRlcmx5aW5nU291cmNlLFxuICAgICAgICBoaWdoV2F0ZXJNYXJrLFxuICAgICAgICBzaXplQWxnb3JpdGhtXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIG9yIG5vdCB0aGUgcmVhZGFibGUgc3RyZWFtIGlzIGxvY2tlZCB0byBhIHtAbGluayBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXIgfCByZWFkZXJ9LlxuICAgKi9cbiAgZ2V0IGxvY2tlZCgpOiBib29sZWFuIHtcbiAgICBpZiAoIUlzUmVhZGFibGVTdHJlYW0odGhpcykpIHtcbiAgICAgIHRocm93IHN0cmVhbUJyYW5kQ2hlY2tFeGNlcHRpb24oJ2xvY2tlZCcpO1xuICAgIH1cblxuICAgIHJldHVybiBJc1JlYWRhYmxlU3RyZWFtTG9ja2VkKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbmNlbHMgdGhlIHN0cmVhbSwgc2lnbmFsaW5nIGEgbG9zcyBvZiBpbnRlcmVzdCBpbiB0aGUgc3RyZWFtIGJ5IGEgY29uc3VtZXIuXG4gICAqXG4gICAqIFRoZSBzdXBwbGllZCBgcmVhc29uYCBhcmd1bWVudCB3aWxsIGJlIGdpdmVuIHRvIHRoZSB1bmRlcmx5aW5nIHNvdXJjZSdzIHtAbGluayBVbmRlcmx5aW5nU291cmNlLmNhbmNlbCB8IGNhbmNlbCgpfVxuICAgKiBtZXRob2QsIHdoaWNoIG1pZ2h0IG9yIG1pZ2h0IG5vdCB1c2UgaXQuXG4gICAqL1xuICBjYW5jZWwocmVhc29uOiBhbnkgPSB1bmRlZmluZWQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIUlzUmVhZGFibGVTdHJlYW0odGhpcykpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKHN0cmVhbUJyYW5kQ2hlY2tFeGNlcHRpb24oJ2NhbmNlbCcpKTtcbiAgICB9XG5cbiAgICBpZiAoSXNSZWFkYWJsZVN0cmVhbUxvY2tlZCh0aGlzKSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgobmV3IFR5cGVFcnJvcignQ2Fubm90IGNhbmNlbCBhIHN0cmVhbSB0aGF0IGFscmVhZHkgaGFzIGEgcmVhZGVyJykpO1xuICAgIH1cblxuICAgIHJldHVybiBSZWFkYWJsZVN0cmVhbUNhbmNlbCh0aGlzLCByZWFzb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSB7QGxpbmsgUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyfSBhbmQgbG9ja3MgdGhlIHN0cmVhbSB0byB0aGUgbmV3IHJlYWRlci5cbiAgICpcbiAgICogVGhpcyBjYWxsIGJlaGF2ZXMgdGhlIHNhbWUgd2F5IGFzIHRoZSBuby1hcmd1bWVudCB2YXJpYW50LCBleGNlcHQgdGhhdCBpdCBvbmx5IHdvcmtzIG9uIHJlYWRhYmxlIGJ5dGUgc3RyZWFtcyxcbiAgICogaS5lLiBzdHJlYW1zIHdoaWNoIHdlcmUgY29uc3RydWN0ZWQgc3BlY2lmaWNhbGx5IHdpdGggdGhlIGFiaWxpdHkgdG8gaGFuZGxlIFwiYnJpbmcgeW91ciBvd24gYnVmZmVyXCIgcmVhZGluZy5cbiAgICogVGhlIHJldHVybmVkIEJZT0IgcmVhZGVyIHByb3ZpZGVzIHRoZSBhYmlsaXR5IHRvIGRpcmVjdGx5IHJlYWQgaW5kaXZpZHVhbCBjaHVua3MgZnJvbSB0aGUgc3RyZWFtIHZpYSBpdHNcbiAgICoge0BsaW5rIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlci5yZWFkIHwgcmVhZCgpfSBtZXRob2QsIGludG8gZGV2ZWxvcGVyLXN1cHBsaWVkIGJ1ZmZlcnMsIGFsbG93aW5nIG1vcmUgcHJlY2lzZVxuICAgKiBjb250cm9sIG92ZXIgYWxsb2NhdGlvbi5cbiAgICovXG4gIGdldFJlYWRlcih7IG1vZGUgfTogeyBtb2RlOiAnYnlvYicgfSk6IFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlcjtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSB7QGxpbmsgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyfSBhbmQgbG9ja3MgdGhlIHN0cmVhbSB0byB0aGUgbmV3IHJlYWRlci5cbiAgICogV2hpbGUgdGhlIHN0cmVhbSBpcyBsb2NrZWQsIG5vIG90aGVyIHJlYWRlciBjYW4gYmUgYWNxdWlyZWQgdW50aWwgdGhpcyBvbmUgaXMgcmVsZWFzZWQuXG4gICAqXG4gICAqIFRoaXMgZnVuY3Rpb25hbGl0eSBpcyBlc3BlY2lhbGx5IHVzZWZ1bCBmb3IgY3JlYXRpbmcgYWJzdHJhY3Rpb25zIHRoYXQgZGVzaXJlIHRoZSBhYmlsaXR5IHRvIGNvbnN1bWUgYSBzdHJlYW1cbiAgICogaW4gaXRzIGVudGlyZXR5LiBCeSBnZXR0aW5nIGEgcmVhZGVyIGZvciB0aGUgc3RyZWFtLCB5b3UgY2FuIGVuc3VyZSBub2JvZHkgZWxzZSBjYW4gaW50ZXJsZWF2ZSByZWFkcyB3aXRoIHlvdXJzXG4gICAqIG9yIGNhbmNlbCB0aGUgc3RyZWFtLCB3aGljaCB3b3VsZCBpbnRlcmZlcmUgd2l0aCB5b3VyIGFic3RyYWN0aW9uLlxuICAgKi9cbiAgZ2V0UmVhZGVyKCk6IFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcjxSPjtcbiAgZ2V0UmVhZGVyKFxuICAgIHJhd09wdGlvbnM6IFJlYWRhYmxlU3RyZWFtR2V0UmVhZGVyT3B0aW9ucyB8IG51bGwgfCB1bmRlZmluZWQgPSB1bmRlZmluZWRcbiAgKTogUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyPFI+IHwgUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyIHtcbiAgICBpZiAoIUlzUmVhZGFibGVTdHJlYW0odGhpcykpIHtcbiAgICAgIHRocm93IHN0cmVhbUJyYW5kQ2hlY2tFeGNlcHRpb24oJ2dldFJlYWRlcicpO1xuICAgIH1cblxuICAgIGNvbnN0IG9wdGlvbnMgPSBjb252ZXJ0UmVhZGVyT3B0aW9ucyhyYXdPcHRpb25zLCAnRmlyc3QgcGFyYW1ldGVyJyk7XG5cbiAgICBpZiAob3B0aW9ucy5tb2RlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBBY3F1aXJlUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyKHRoaXMpO1xuICAgIH1cblxuICAgIGFzc2VydChvcHRpb25zLm1vZGUgPT09ICdieW9iJyk7XG4gICAgcmV0dXJuIEFjcXVpcmVSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIodGhpcyBhcyB1bmtub3duIGFzIFJlYWRhYmxlQnl0ZVN0cmVhbSk7XG4gIH1cblxuICAvKipcbiAgICogUHJvdmlkZXMgYSBjb252ZW5pZW50LCBjaGFpbmFibGUgd2F5IG9mIHBpcGluZyB0aGlzIHJlYWRhYmxlIHN0cmVhbSB0aHJvdWdoIGEgdHJhbnNmb3JtIHN0cmVhbVxuICAgKiAob3IgYW55IG90aGVyIGB7IHdyaXRhYmxlLCByZWFkYWJsZSB9YCBwYWlyKS4gSXQgc2ltcGx5IHtAbGluayBSZWFkYWJsZVN0cmVhbS5waXBlVG8gfCBwaXBlc30gdGhlIHN0cmVhbVxuICAgKiBpbnRvIHRoZSB3cml0YWJsZSBzaWRlIG9mIHRoZSBzdXBwbGllZCBwYWlyLCBhbmQgcmV0dXJucyB0aGUgcmVhZGFibGUgc2lkZSBmb3IgZnVydGhlciB1c2UuXG4gICAqXG4gICAqIFBpcGluZyBhIHN0cmVhbSB3aWxsIGxvY2sgaXQgZm9yIHRoZSBkdXJhdGlvbiBvZiB0aGUgcGlwZSwgcHJldmVudGluZyBhbnkgb3RoZXIgY29uc3VtZXIgZnJvbSBhY3F1aXJpbmcgYSByZWFkZXIuXG4gICAqL1xuICBwaXBlVGhyb3VnaDxSUyBleHRlbmRzIFJlYWRhYmxlU3RyZWFtPihcbiAgICB0cmFuc2Zvcm06IHsgcmVhZGFibGU6IFJTOyB3cml0YWJsZTogV3JpdGFibGVTdHJlYW08Uj4gfSxcbiAgICBvcHRpb25zPzogU3RyZWFtUGlwZU9wdGlvbnNcbiAgKTogUlM7XG4gIHBpcGVUaHJvdWdoPFJTIGV4dGVuZHMgUmVhZGFibGVTdHJlYW0+KFxuICAgIHJhd1RyYW5zZm9ybTogeyByZWFkYWJsZTogUlM7IHdyaXRhYmxlOiBXcml0YWJsZVN0cmVhbTxSPiB9IHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgICByYXdPcHRpb25zOiBTdHJlYW1QaXBlT3B0aW9ucyB8IG51bGwgfCB1bmRlZmluZWQgPSB7fVxuICApOiBSUyB7XG4gICAgaWYgKCFJc1JlYWRhYmxlU3RyZWFtKHRoaXMpKSB7XG4gICAgICB0aHJvdyBzdHJlYW1CcmFuZENoZWNrRXhjZXB0aW9uKCdwaXBlVGhyb3VnaCcpO1xuICAgIH1cbiAgICBhc3NlcnRSZXF1aXJlZEFyZ3VtZW50KHJhd1RyYW5zZm9ybSwgMSwgJ3BpcGVUaHJvdWdoJyk7XG5cbiAgICBjb25zdCB0cmFuc2Zvcm0gPSBjb252ZXJ0UmVhZGFibGVXcml0YWJsZVBhaXIocmF3VHJhbnNmb3JtLCAnRmlyc3QgcGFyYW1ldGVyJyk7XG4gICAgY29uc3Qgb3B0aW9ucyA9IGNvbnZlcnRQaXBlT3B0aW9ucyhyYXdPcHRpb25zLCAnU2Vjb25kIHBhcmFtZXRlcicpO1xuXG4gICAgaWYgKElzUmVhZGFibGVTdHJlYW1Mb2NrZWQodGhpcykpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1JlYWRhYmxlU3RyZWFtLnByb3RvdHlwZS5waXBlVGhyb3VnaCBjYW5ub3QgYmUgdXNlZCBvbiBhIGxvY2tlZCBSZWFkYWJsZVN0cmVhbScpO1xuICAgIH1cbiAgICBpZiAoSXNXcml0YWJsZVN0cmVhbUxvY2tlZCh0cmFuc2Zvcm0ud3JpdGFibGUpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdSZWFkYWJsZVN0cmVhbS5wcm90b3R5cGUucGlwZVRocm91Z2ggY2Fubm90IGJlIHVzZWQgb24gYSBsb2NrZWQgV3JpdGFibGVTdHJlYW0nKTtcbiAgICB9XG5cbiAgICBjb25zdCBwcm9taXNlID0gUmVhZGFibGVTdHJlYW1QaXBlVG8oXG4gICAgICB0aGlzLCB0cmFuc2Zvcm0ud3JpdGFibGUsIG9wdGlvbnMucHJldmVudENsb3NlLCBvcHRpb25zLnByZXZlbnRBYm9ydCwgb3B0aW9ucy5wcmV2ZW50Q2FuY2VsLCBvcHRpb25zLnNpZ25hbFxuICAgICk7XG5cbiAgICBzZXRQcm9taXNlSXNIYW5kbGVkVG9UcnVlKHByb21pc2UpO1xuXG4gICAgcmV0dXJuIHRyYW5zZm9ybS5yZWFkYWJsZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQaXBlcyB0aGlzIHJlYWRhYmxlIHN0cmVhbSB0byBhIGdpdmVuIHdyaXRhYmxlIHN0cmVhbS4gVGhlIHdheSBpbiB3aGljaCB0aGUgcGlwaW5nIHByb2Nlc3MgYmVoYXZlcyB1bmRlclxuICAgKiB2YXJpb3VzIGVycm9yIGNvbmRpdGlvbnMgY2FuIGJlIGN1c3RvbWl6ZWQgd2l0aCBhIG51bWJlciBvZiBwYXNzZWQgb3B0aW9ucy4gSXQgcmV0dXJucyBhIHByb21pc2UgdGhhdCBmdWxmaWxsc1xuICAgKiB3aGVuIHRoZSBwaXBpbmcgcHJvY2VzcyBjb21wbGV0ZXMgc3VjY2Vzc2Z1bGx5LCBvciByZWplY3RzIGlmIGFueSBlcnJvcnMgd2VyZSBlbmNvdW50ZXJlZC5cbiAgICpcbiAgICogUGlwaW5nIGEgc3RyZWFtIHdpbGwgbG9jayBpdCBmb3IgdGhlIGR1cmF0aW9uIG9mIHRoZSBwaXBlLCBwcmV2ZW50aW5nIGFueSBvdGhlciBjb25zdW1lciBmcm9tIGFjcXVpcmluZyBhIHJlYWRlci5cbiAgICovXG4gIHBpcGVUbyhkZXN0aW5hdGlvbjogV3JpdGFibGVTdHJlYW08Uj4sIG9wdGlvbnM/OiBTdHJlYW1QaXBlT3B0aW9ucyk6IFByb21pc2U8dm9pZD47XG4gIHBpcGVUbyhkZXN0aW5hdGlvbjogV3JpdGFibGVTdHJlYW08Uj4gfCBudWxsIHwgdW5kZWZpbmVkLFxuICAgICAgICAgcmF3T3B0aW9uczogU3RyZWFtUGlwZU9wdGlvbnMgfCBudWxsIHwgdW5kZWZpbmVkID0ge30pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIUlzUmVhZGFibGVTdHJlYW0odGhpcykpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKHN0cmVhbUJyYW5kQ2hlY2tFeGNlcHRpb24oJ3BpcGVUbycpKTtcbiAgICB9XG5cbiAgICBpZiAoZGVzdGluYXRpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoYFBhcmFtZXRlciAxIGlzIHJlcXVpcmVkIGluICdwaXBlVG8nLmApO1xuICAgIH1cbiAgICBpZiAoIUlzV3JpdGFibGVTdHJlYW0oZGVzdGluYXRpb24pKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChcbiAgICAgICAgbmV3IFR5cGVFcnJvcihgUmVhZGFibGVTdHJlYW0ucHJvdG90eXBlLnBpcGVUbydzIGZpcnN0IGFyZ3VtZW50IG11c3QgYmUgYSBXcml0YWJsZVN0cmVhbWApXG4gICAgICApO1xuICAgIH1cblxuICAgIGxldCBvcHRpb25zOiBWYWxpZGF0ZWRTdHJlYW1QaXBlT3B0aW9ucztcbiAgICB0cnkge1xuICAgICAgb3B0aW9ucyA9IGNvbnZlcnRQaXBlT3B0aW9ucyhyYXdPcHRpb25zLCAnU2Vjb25kIHBhcmFtZXRlcicpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKGUpO1xuICAgIH1cblxuICAgIGlmIChJc1JlYWRhYmxlU3RyZWFtTG9ja2VkKHRoaXMpKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChcbiAgICAgICAgbmV3IFR5cGVFcnJvcignUmVhZGFibGVTdHJlYW0ucHJvdG90eXBlLnBpcGVUbyBjYW5ub3QgYmUgdXNlZCBvbiBhIGxvY2tlZCBSZWFkYWJsZVN0cmVhbScpXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAoSXNXcml0YWJsZVN0cmVhbUxvY2tlZChkZXN0aW5hdGlvbikpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKFxuICAgICAgICBuZXcgVHlwZUVycm9yKCdSZWFkYWJsZVN0cmVhbS5wcm90b3R5cGUucGlwZVRvIGNhbm5vdCBiZSB1c2VkIG9uIGEgbG9ja2VkIFdyaXRhYmxlU3RyZWFtJylcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFJlYWRhYmxlU3RyZWFtUGlwZVRvPFI+KFxuICAgICAgdGhpcywgZGVzdGluYXRpb24sIG9wdGlvbnMucHJldmVudENsb3NlLCBvcHRpb25zLnByZXZlbnRBYm9ydCwgb3B0aW9ucy5wcmV2ZW50Q2FuY2VsLCBvcHRpb25zLnNpZ25hbFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogVGVlcyB0aGlzIHJlYWRhYmxlIHN0cmVhbSwgcmV0dXJuaW5nIGEgdHdvLWVsZW1lbnQgYXJyYXkgY29udGFpbmluZyB0aGUgdHdvIHJlc3VsdGluZyBicmFuY2hlcyBhc1xuICAgKiBuZXcge0BsaW5rIFJlYWRhYmxlU3RyZWFtfSBpbnN0YW5jZXMuXG4gICAqXG4gICAqIFRlZWluZyBhIHN0cmVhbSB3aWxsIGxvY2sgaXQsIHByZXZlbnRpbmcgYW55IG90aGVyIGNvbnN1bWVyIGZyb20gYWNxdWlyaW5nIGEgcmVhZGVyLlxuICAgKiBUbyBjYW5jZWwgdGhlIHN0cmVhbSwgY2FuY2VsIGJvdGggb2YgdGhlIHJlc3VsdGluZyBicmFuY2hlczsgYSBjb21wb3NpdGUgY2FuY2VsbGF0aW9uIHJlYXNvbiB3aWxsIHRoZW4gYmVcbiAgICogcHJvcGFnYXRlZCB0byB0aGUgc3RyZWFtJ3MgdW5kZXJseWluZyBzb3VyY2UuXG4gICAqXG4gICAqIE5vdGUgdGhhdCB0aGUgY2h1bmtzIHNlZW4gaW4gZWFjaCBicmFuY2ggd2lsbCBiZSB0aGUgc2FtZSBvYmplY3QuIElmIHRoZSBjaHVua3MgYXJlIG5vdCBpbW11dGFibGUsXG4gICAqIHRoaXMgY291bGQgYWxsb3cgaW50ZXJmZXJlbmNlIGJldHdlZW4gdGhlIHR3byBicmFuY2hlcy5cbiAgICovXG4gIHRlZSgpOiBbUmVhZGFibGVTdHJlYW08Uj4sIFJlYWRhYmxlU3RyZWFtPFI+XSB7XG4gICAgaWYgKCFJc1JlYWRhYmxlU3RyZWFtKHRoaXMpKSB7XG4gICAgICB0aHJvdyBzdHJlYW1CcmFuZENoZWNrRXhjZXB0aW9uKCd0ZWUnKTtcbiAgICB9XG5cbiAgICBjb25zdCBicmFuY2hlcyA9IFJlYWRhYmxlU3RyZWFtVGVlKHRoaXMsIGZhbHNlKTtcbiAgICByZXR1cm4gQ3JlYXRlQXJyYXlGcm9tTGlzdChicmFuY2hlcyk7XG4gIH1cblxuICAvKipcbiAgICogQXN5bmNocm9ub3VzbHkgaXRlcmF0ZXMgb3ZlciB0aGUgY2h1bmtzIGluIHRoZSBzdHJlYW0ncyBpbnRlcm5hbCBxdWV1ZS5cbiAgICpcbiAgICogQXN5bmNocm9ub3VzbHkgaXRlcmF0aW5nIG92ZXIgdGhlIHN0cmVhbSB3aWxsIGxvY2sgaXQsIHByZXZlbnRpbmcgYW55IG90aGVyIGNvbnN1bWVyIGZyb20gYWNxdWlyaW5nIGEgcmVhZGVyLlxuICAgKiBUaGUgbG9jayB3aWxsIGJlIHJlbGVhc2VkIGlmIHRoZSBhc3luYyBpdGVyYXRvcidzIHtAbGluayBSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3IucmV0dXJuIHwgcmV0dXJuKCl9IG1ldGhvZFxuICAgKiBpcyBjYWxsZWQsIGUuZy4gYnkgYnJlYWtpbmcgb3V0IG9mIHRoZSBsb29wLlxuICAgKlxuICAgKiBCeSBkZWZhdWx0LCBjYWxsaW5nIHRoZSBhc3luYyBpdGVyYXRvcidzIHtAbGluayBSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3IucmV0dXJuIHwgcmV0dXJuKCl9IG1ldGhvZCB3aWxsIGFsc29cbiAgICogY2FuY2VsIHRoZSBzdHJlYW0uIFRvIHByZXZlbnQgdGhpcywgdXNlIHRoZSBzdHJlYW0ncyB7QGxpbmsgUmVhZGFibGVTdHJlYW0udmFsdWVzIHwgdmFsdWVzKCl9IG1ldGhvZCwgcGFzc2luZ1xuICAgKiBgdHJ1ZWAgZm9yIHRoZSBgcHJldmVudENhbmNlbGAgb3B0aW9uLlxuICAgKi9cbiAgdmFsdWVzKG9wdGlvbnM/OiBSZWFkYWJsZVN0cmVhbUl0ZXJhdG9yT3B0aW9ucyk6IFJlYWRhYmxlU3RyZWFtQXN5bmNJdGVyYXRvcjxSPjtcbiAgdmFsdWVzKHJhd09wdGlvbnM6IFJlYWRhYmxlU3RyZWFtSXRlcmF0b3JPcHRpb25zIHwgbnVsbCB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZCk6IFJlYWRhYmxlU3RyZWFtQXN5bmNJdGVyYXRvcjxSPiB7XG4gICAgaWYgKCFJc1JlYWRhYmxlU3RyZWFtKHRoaXMpKSB7XG4gICAgICB0aHJvdyBzdHJlYW1CcmFuZENoZWNrRXhjZXB0aW9uKCd2YWx1ZXMnKTtcbiAgICB9XG5cbiAgICBjb25zdCBvcHRpb25zID0gY29udmVydEl0ZXJhdG9yT3B0aW9ucyhyYXdPcHRpb25zLCAnRmlyc3QgcGFyYW1ldGVyJyk7XG4gICAgcmV0dXJuIEFjcXVpcmVSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3I8Uj4odGhpcywgb3B0aW9ucy5wcmV2ZW50Q2FuY2VsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB7QGluaGVyaXREb2MgUmVhZGFibGVTdHJlYW0udmFsdWVzfVxuICAgKi9cbiAgW1N5bWJvbC5hc3luY0l0ZXJhdG9yXShvcHRpb25zPzogUmVhZGFibGVTdHJlYW1JdGVyYXRvck9wdGlvbnMpOiBSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3I8Uj47XG5cbiAgW1N5bWJvbEFzeW5jSXRlcmF0b3JdKG9wdGlvbnM/OiBSZWFkYWJsZVN0cmVhbUl0ZXJhdG9yT3B0aW9ucyk6IFJlYWRhYmxlU3RyZWFtQXN5bmNJdGVyYXRvcjxSPiB7XG4gICAgLy8gU3R1YiBpbXBsZW1lbnRhdGlvbiwgb3ZlcnJpZGRlbiBiZWxvd1xuICAgIHJldHVybiB0aGlzLnZhbHVlcyhvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IFJlYWRhYmxlU3RyZWFtIHdyYXBwaW5nIHRoZSBwcm92aWRlZCBpdGVyYWJsZSBvciBhc3luYyBpdGVyYWJsZS5cbiAgICpcbiAgICogVGhpcyBjYW4gYmUgdXNlZCB0byBhZGFwdCB2YXJpb3VzIGtpbmRzIG9mIG9iamVjdHMgaW50byBhIHJlYWRhYmxlIHN0cmVhbSxcbiAgICogc3VjaCBhcyBhbiBhcnJheSwgYW4gYXN5bmMgZ2VuZXJhdG9yLCBvciBhIE5vZGUuanMgcmVhZGFibGUgc3RyZWFtLlxuICAgKi9cbiAgc3RhdGljIGZyb208Uj4oYXN5bmNJdGVyYWJsZTogSXRlcmFibGU8Uj4gfCBBc3luY0l0ZXJhYmxlPFI+IHwgUmVhZGFibGVTdHJlYW1MaWtlPFI+KTogUmVhZGFibGVTdHJlYW08Uj4ge1xuICAgIHJldHVybiBSZWFkYWJsZVN0cmVhbUZyb20oYXN5bmNJdGVyYWJsZSk7XG4gIH1cbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoUmVhZGFibGVTdHJlYW0sIHtcbiAgZnJvbTogeyBlbnVtZXJhYmxlOiB0cnVlIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoUmVhZGFibGVTdHJlYW0ucHJvdG90eXBlLCB7XG4gIGNhbmNlbDogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIGdldFJlYWRlcjogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIHBpcGVUaHJvdWdoOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgcGlwZVRvOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgdGVlOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgdmFsdWVzOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgbG9ja2VkOiB7IGVudW1lcmFibGU6IHRydWUgfVxufSk7XG5zZXRGdW5jdGlvbk5hbWUoUmVhZGFibGVTdHJlYW0uZnJvbSwgJ2Zyb20nKTtcbnNldEZ1bmN0aW9uTmFtZShSZWFkYWJsZVN0cmVhbS5wcm90b3R5cGUuY2FuY2VsLCAnY2FuY2VsJyk7XG5zZXRGdW5jdGlvbk5hbWUoUmVhZGFibGVTdHJlYW0ucHJvdG90eXBlLmdldFJlYWRlciwgJ2dldFJlYWRlcicpO1xuc2V0RnVuY3Rpb25OYW1lKFJlYWRhYmxlU3RyZWFtLnByb3RvdHlwZS5waXBlVGhyb3VnaCwgJ3BpcGVUaHJvdWdoJyk7XG5zZXRGdW5jdGlvbk5hbWUoUmVhZGFibGVTdHJlYW0ucHJvdG90eXBlLnBpcGVUbywgJ3BpcGVUbycpO1xuc2V0RnVuY3Rpb25OYW1lKFJlYWRhYmxlU3RyZWFtLnByb3RvdHlwZS50ZWUsICd0ZWUnKTtcbnNldEZ1bmN0aW9uTmFtZShSZWFkYWJsZVN0cmVhbS5wcm90b3R5cGUudmFsdWVzLCAndmFsdWVzJyk7XG5pZiAodHlwZW9mIFN5bWJvbC50b1N0cmluZ1RhZyA9PT0gJ3N5bWJvbCcpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJlYWRhYmxlU3RyZWFtLnByb3RvdHlwZSwgU3ltYm9sLnRvU3RyaW5nVGFnLCB7XG4gICAgdmFsdWU6ICdSZWFkYWJsZVN0cmVhbScsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xufVxuT2JqZWN0LmRlZmluZVByb3BlcnR5KFJlYWRhYmxlU3RyZWFtLnByb3RvdHlwZSwgU3ltYm9sQXN5bmNJdGVyYXRvciwge1xuICB2YWx1ZTogUmVhZGFibGVTdHJlYW0ucHJvdG90eXBlLnZhbHVlcyxcbiAgd3JpdGFibGU6IHRydWUsXG4gIGNvbmZpZ3VyYWJsZTogdHJ1ZVxufSk7XG5cbmV4cG9ydCB0eXBlIHtcbiAgUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9yLFxuICBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkUmVzdWx0LFxuICBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkUmVzdWx0LFxuICBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXJSZWFkT3B0aW9ucyxcbiAgVW5kZXJseWluZ0J5dGVTb3VyY2UsXG4gIFVuZGVybHlpbmdTb3VyY2UsXG4gIFVuZGVybHlpbmdTb3VyY2VTdGFydENhbGxiYWNrLFxuICBVbmRlcmx5aW5nU291cmNlUHVsbENhbGxiYWNrLFxuICBVbmRlcmx5aW5nU291cmNlQ2FuY2VsQ2FsbGJhY2ssXG4gIFVuZGVybHlpbmdCeXRlU291cmNlU3RhcnRDYWxsYmFjayxcbiAgVW5kZXJseWluZ0J5dGVTb3VyY2VQdWxsQ2FsbGJhY2ssXG4gIFN0cmVhbVBpcGVPcHRpb25zLFxuICBSZWFkYWJsZVdyaXRhYmxlUGFpcixcbiAgUmVhZGFibGVTdHJlYW1JdGVyYXRvck9wdGlvbnMsXG4gIFJlYWRhYmxlU3RyZWFtTGlrZSxcbiAgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyTGlrZVxufTtcblxuLy8gQWJzdHJhY3Qgb3BlcmF0aW9ucyBmb3IgdGhlIFJlYWRhYmxlU3RyZWFtLlxuXG4vLyBUaHJvd3MgaWYgYW5kIG9ubHkgaWYgc3RhcnRBbGdvcml0aG0gdGhyb3dzLlxuZXhwb3J0IGZ1bmN0aW9uIENyZWF0ZVJlYWRhYmxlU3RyZWFtPFI+KFxuICBzdGFydEFsZ29yaXRobTogKCkgPT4gdm9pZCB8IFByb21pc2VMaWtlPHZvaWQ+LFxuICBwdWxsQWxnb3JpdGhtOiAoKSA9PiBQcm9taXNlPHZvaWQ+LFxuICBjYW5jZWxBbGdvcml0aG06IChyZWFzb246IGFueSkgPT4gUHJvbWlzZTx2b2lkPixcbiAgaGlnaFdhdGVyTWFyayA9IDEsXG4gIHNpemVBbGdvcml0aG06IFF1ZXVpbmdTdHJhdGVneVNpemVDYWxsYmFjazxSPiA9ICgpID0+IDFcbik6IERlZmF1bHRSZWFkYWJsZVN0cmVhbTxSPiB7XG4gIGFzc2VydChJc05vbk5lZ2F0aXZlTnVtYmVyKGhpZ2hXYXRlck1hcmspKTtcblxuICBjb25zdCBzdHJlYW06IERlZmF1bHRSZWFkYWJsZVN0cmVhbTxSPiA9IE9iamVjdC5jcmVhdGUoUmVhZGFibGVTdHJlYW0ucHJvdG90eXBlKTtcbiAgSW5pdGlhbGl6ZVJlYWRhYmxlU3RyZWFtKHN0cmVhbSk7XG5cbiAgY29uc3QgY29udHJvbGxlcjogUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxSPiA9IE9iamVjdC5jcmVhdGUoUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlci5wcm90b3R5cGUpO1xuICBTZXRVcFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIoXG4gICAgc3RyZWFtLCBjb250cm9sbGVyLCBzdGFydEFsZ29yaXRobSwgcHVsbEFsZ29yaXRobSwgY2FuY2VsQWxnb3JpdGhtLCBoaWdoV2F0ZXJNYXJrLCBzaXplQWxnb3JpdGhtXG4gICk7XG5cbiAgcmV0dXJuIHN0cmVhbTtcbn1cblxuLy8gVGhyb3dzIGlmIGFuZCBvbmx5IGlmIHN0YXJ0QWxnb3JpdGhtIHRocm93cy5cbmV4cG9ydCBmdW5jdGlvbiBDcmVhdGVSZWFkYWJsZUJ5dGVTdHJlYW0oXG4gIHN0YXJ0QWxnb3JpdGhtOiAoKSA9PiB2b2lkIHwgUHJvbWlzZUxpa2U8dm9pZD4sXG4gIHB1bGxBbGdvcml0aG06ICgpID0+IFByb21pc2U8dm9pZD4sXG4gIGNhbmNlbEFsZ29yaXRobTogKHJlYXNvbjogYW55KSA9PiBQcm9taXNlPHZvaWQ+XG4pOiBSZWFkYWJsZUJ5dGVTdHJlYW0ge1xuICBjb25zdCBzdHJlYW06IFJlYWRhYmxlQnl0ZVN0cmVhbSA9IE9iamVjdC5jcmVhdGUoUmVhZGFibGVTdHJlYW0ucHJvdG90eXBlKTtcbiAgSW5pdGlhbGl6ZVJlYWRhYmxlU3RyZWFtKHN0cmVhbSk7XG5cbiAgY29uc3QgY29udHJvbGxlcjogUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlciA9IE9iamVjdC5jcmVhdGUoUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlci5wcm90b3R5cGUpO1xuICBTZXRVcFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIoc3RyZWFtLCBjb250cm9sbGVyLCBzdGFydEFsZ29yaXRobSwgcHVsbEFsZ29yaXRobSwgY2FuY2VsQWxnb3JpdGhtLCAwLCB1bmRlZmluZWQpO1xuXG4gIHJldHVybiBzdHJlYW07XG59XG5cbmZ1bmN0aW9uIEluaXRpYWxpemVSZWFkYWJsZVN0cmVhbShzdHJlYW06IFJlYWRhYmxlU3RyZWFtKSB7XG4gIHN0cmVhbS5fc3RhdGUgPSAncmVhZGFibGUnO1xuICBzdHJlYW0uX3JlYWRlciA9IHVuZGVmaW5lZDtcbiAgc3RyZWFtLl9zdG9yZWRFcnJvciA9IHVuZGVmaW5lZDtcbiAgc3RyZWFtLl9kaXN0dXJiZWQgPSBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIElzUmVhZGFibGVTdHJlYW0oeDogdW5rbm93bik6IHggaXMgUmVhZGFibGVTdHJlYW0ge1xuICBpZiAoIXR5cGVJc09iamVjdCh4KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHgsICdfcmVhZGFibGVTdHJlYW1Db250cm9sbGVyJykpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4geCBpbnN0YW5jZW9mIFJlYWRhYmxlU3RyZWFtO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gSXNSZWFkYWJsZVN0cmVhbURpc3R1cmJlZChzdHJlYW06IFJlYWRhYmxlU3RyZWFtKTogYm9vbGVhbiB7XG4gIGFzc2VydChJc1JlYWRhYmxlU3RyZWFtKHN0cmVhbSkpO1xuXG4gIHJldHVybiBzdHJlYW0uX2Rpc3R1cmJlZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIElzUmVhZGFibGVTdHJlYW1Mb2NrZWQoc3RyZWFtOiBSZWFkYWJsZVN0cmVhbSk6IGJvb2xlYW4ge1xuICBhc3NlcnQoSXNSZWFkYWJsZVN0cmVhbShzdHJlYW0pKTtcblxuICBpZiAoc3RyZWFtLl9yZWFkZXIgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG4vLyBSZWFkYWJsZVN0cmVhbSBBUEkgZXhwb3NlZCBmb3IgY29udHJvbGxlcnMuXG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZVN0cmVhbUNhbmNlbDxSPihzdHJlYW06IFJlYWRhYmxlU3RyZWFtPFI+LCByZWFzb246IGFueSk6IFByb21pc2U8dW5kZWZpbmVkPiB7XG4gIHN0cmVhbS5fZGlzdHVyYmVkID0gdHJ1ZTtcblxuICBpZiAoc3RyZWFtLl9zdGF0ZSA9PT0gJ2Nsb3NlZCcpIHtcbiAgICByZXR1cm4gcHJvbWlzZVJlc29sdmVkV2l0aCh1bmRlZmluZWQpO1xuICB9XG4gIGlmIChzdHJlYW0uX3N0YXRlID09PSAnZXJyb3JlZCcpIHtcbiAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChzdHJlYW0uX3N0b3JlZEVycm9yKTtcbiAgfVxuXG4gIFJlYWRhYmxlU3RyZWFtQ2xvc2Uoc3RyZWFtKTtcblxuICBjb25zdCByZWFkZXIgPSBzdHJlYW0uX3JlYWRlcjtcbiAgaWYgKHJlYWRlciAhPT0gdW5kZWZpbmVkICYmIElzUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyKHJlYWRlcikpIHtcbiAgICBjb25zdCByZWFkSW50b1JlcXVlc3RzID0gcmVhZGVyLl9yZWFkSW50b1JlcXVlc3RzO1xuICAgIHJlYWRlci5fcmVhZEludG9SZXF1ZXN0cyA9IG5ldyBTaW1wbGVRdWV1ZSgpO1xuICAgIHJlYWRJbnRvUmVxdWVzdHMuZm9yRWFjaChyZWFkSW50b1JlcXVlc3QgPT4ge1xuICAgICAgcmVhZEludG9SZXF1ZXN0Ll9jbG9zZVN0ZXBzKHVuZGVmaW5lZCk7XG4gICAgfSk7XG4gIH1cblxuICBjb25zdCBzb3VyY2VDYW5jZWxQcm9taXNlID0gc3RyZWFtLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXJbQ2FuY2VsU3RlcHNdKHJlYXNvbik7XG4gIHJldHVybiB0cmFuc2Zvcm1Qcm9taXNlV2l0aChzb3VyY2VDYW5jZWxQcm9taXNlLCBub29wKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtQ2xvc2U8Uj4oc3RyZWFtOiBSZWFkYWJsZVN0cmVhbTxSPik6IHZvaWQge1xuICBhc3NlcnQoc3RyZWFtLl9zdGF0ZSA9PT0gJ3JlYWRhYmxlJyk7XG5cbiAgc3RyZWFtLl9zdGF0ZSA9ICdjbG9zZWQnO1xuXG4gIGNvbnN0IHJlYWRlciA9IHN0cmVhbS5fcmVhZGVyO1xuXG4gIGlmIChyZWFkZXIgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGRlZmF1bHRSZWFkZXJDbG9zZWRQcm9taXNlUmVzb2x2ZShyZWFkZXIpO1xuXG4gIGlmIChJc1JlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcjxSPihyZWFkZXIpKSB7XG4gICAgY29uc3QgcmVhZFJlcXVlc3RzID0gcmVhZGVyLl9yZWFkUmVxdWVzdHM7XG4gICAgcmVhZGVyLl9yZWFkUmVxdWVzdHMgPSBuZXcgU2ltcGxlUXVldWUoKTtcbiAgICByZWFkUmVxdWVzdHMuZm9yRWFjaChyZWFkUmVxdWVzdCA9PiB7XG4gICAgICByZWFkUmVxdWVzdC5fY2xvc2VTdGVwcygpO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZVN0cmVhbUVycm9yPFI+KHN0cmVhbTogUmVhZGFibGVTdHJlYW08Uj4sIGU6IGFueSk6IHZvaWQge1xuICBhc3NlcnQoSXNSZWFkYWJsZVN0cmVhbShzdHJlYW0pKTtcbiAgYXNzZXJ0KHN0cmVhbS5fc3RhdGUgPT09ICdyZWFkYWJsZScpO1xuXG4gIHN0cmVhbS5fc3RhdGUgPSAnZXJyb3JlZCc7XG4gIHN0cmVhbS5fc3RvcmVkRXJyb3IgPSBlO1xuXG4gIGNvbnN0IHJlYWRlciA9IHN0cmVhbS5fcmVhZGVyO1xuXG4gIGlmIChyZWFkZXIgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGRlZmF1bHRSZWFkZXJDbG9zZWRQcm9taXNlUmVqZWN0KHJlYWRlciwgZSk7XG5cbiAgaWYgKElzUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyPFI+KHJlYWRlcikpIHtcbiAgICBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXJFcnJvclJlYWRSZXF1ZXN0cyhyZWFkZXIsIGUpO1xuICB9IGVsc2Uge1xuICAgIGFzc2VydChJc1JlYWRhYmxlU3RyZWFtQllPQlJlYWRlcihyZWFkZXIpKTtcbiAgICBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXJFcnJvclJlYWRJbnRvUmVxdWVzdHMocmVhZGVyLCBlKTtcbiAgfVxufVxuXG4vLyBSZWFkZXJzXG5cbmV4cG9ydCB0eXBlIFJlYWRhYmxlU3RyZWFtUmVhZGVyPFI+ID0gUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyPFI+IHwgUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyO1xuXG5leHBvcnQge1xuICBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXIsXG4gIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlclxufTtcblxuLy8gQ29udHJvbGxlcnNcblxuZXhwb3J0IHtcbiAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcixcbiAgUmVhZGFibGVTdHJlYW1CWU9CUmVxdWVzdCxcbiAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclxufTtcblxuLy8gSGVscGVyIGZ1bmN0aW9ucyBmb3IgdGhlIFJlYWRhYmxlU3RyZWFtLlxuXG5mdW5jdGlvbiBzdHJlYW1CcmFuZENoZWNrRXhjZXB0aW9uKG5hbWU6IHN0cmluZyk6IFR5cGVFcnJvciB7XG4gIHJldHVybiBuZXcgVHlwZUVycm9yKGBSZWFkYWJsZVN0cmVhbS5wcm90b3R5cGUuJHtuYW1lfSBjYW4gb25seSBiZSB1c2VkIG9uIGEgUmVhZGFibGVTdHJlYW1gKTtcbn1cbiIsICJpbXBvcnQgdHlwZSB7IFF1ZXVpbmdTdHJhdGVneUluaXQgfSBmcm9tICcuLi9xdWV1aW5nLXN0cmF0ZWd5JztcbmltcG9ydCB7IGFzc2VydERpY3Rpb25hcnksIGFzc2VydFJlcXVpcmVkRmllbGQsIGNvbnZlcnRVbnJlc3RyaWN0ZWREb3VibGUgfSBmcm9tICcuL2Jhc2ljJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRRdWV1aW5nU3RyYXRlZ3lJbml0KGluaXQ6IFF1ZXVpbmdTdHJhdGVneUluaXQgfCBudWxsIHwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6IHN0cmluZyk6IFF1ZXVpbmdTdHJhdGVneUluaXQge1xuICBhc3NlcnREaWN0aW9uYXJ5KGluaXQsIGNvbnRleHQpO1xuICBjb25zdCBoaWdoV2F0ZXJNYXJrID0gaW5pdD8uaGlnaFdhdGVyTWFyaztcbiAgYXNzZXJ0UmVxdWlyZWRGaWVsZChoaWdoV2F0ZXJNYXJrLCAnaGlnaFdhdGVyTWFyaycsICdRdWV1aW5nU3RyYXRlZ3lJbml0Jyk7XG4gIHJldHVybiB7XG4gICAgaGlnaFdhdGVyTWFyazogY29udmVydFVucmVzdHJpY3RlZERvdWJsZShoaWdoV2F0ZXJNYXJrKVxuICB9O1xufVxuIiwgImltcG9ydCB0eXBlIHsgUXVldWluZ1N0cmF0ZWd5LCBRdWV1aW5nU3RyYXRlZ3lJbml0IH0gZnJvbSAnLi9xdWV1aW5nLXN0cmF0ZWd5JztcbmltcG9ydCB7IHNldEZ1bmN0aW9uTmFtZSwgdHlwZUlzT2JqZWN0IH0gZnJvbSAnLi9oZWxwZXJzL21pc2NlbGxhbmVvdXMnO1xuaW1wb3J0IHsgYXNzZXJ0UmVxdWlyZWRBcmd1bWVudCB9IGZyb20gJy4vdmFsaWRhdG9ycy9iYXNpYyc7XG5pbXBvcnQgeyBjb252ZXJ0UXVldWluZ1N0cmF0ZWd5SW5pdCB9IGZyb20gJy4vdmFsaWRhdG9ycy9xdWV1aW5nLXN0cmF0ZWd5LWluaXQnO1xuXG4vLyBUaGUgc2l6ZSBmdW5jdGlvbiBtdXN0IG5vdCBoYXZlIGEgcHJvdG90eXBlIHByb3BlcnR5IG5vciBiZSBhIGNvbnN0cnVjdG9yXG5jb25zdCBieXRlTGVuZ3RoU2l6ZUZ1bmN0aW9uID0gKGNodW5rOiBBcnJheUJ1ZmZlclZpZXcpOiBudW1iZXIgPT4ge1xuICByZXR1cm4gY2h1bmsuYnl0ZUxlbmd0aDtcbn07XG5zZXRGdW5jdGlvbk5hbWUoYnl0ZUxlbmd0aFNpemVGdW5jdGlvbiwgJ3NpemUnKTtcblxuLyoqXG4gKiBBIHF1ZXVpbmcgc3RyYXRlZ3kgdGhhdCBjb3VudHMgdGhlIG51bWJlciBvZiBieXRlcyBpbiBlYWNoIGNodW5rLlxuICpcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnl0ZUxlbmd0aFF1ZXVpbmdTdHJhdGVneSBpbXBsZW1lbnRzIFF1ZXVpbmdTdHJhdGVneTxBcnJheUJ1ZmZlclZpZXc+IHtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICByZWFkb25seSBfYnl0ZUxlbmd0aFF1ZXVpbmdTdHJhdGVneUhpZ2hXYXRlck1hcms6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBRdWV1aW5nU3RyYXRlZ3lJbml0KSB7XG4gICAgYXNzZXJ0UmVxdWlyZWRBcmd1bWVudChvcHRpb25zLCAxLCAnQnl0ZUxlbmd0aFF1ZXVpbmdTdHJhdGVneScpO1xuICAgIG9wdGlvbnMgPSBjb252ZXJ0UXVldWluZ1N0cmF0ZWd5SW5pdChvcHRpb25zLCAnRmlyc3QgcGFyYW1ldGVyJyk7XG4gICAgdGhpcy5fYnl0ZUxlbmd0aFF1ZXVpbmdTdHJhdGVneUhpZ2hXYXRlck1hcmsgPSBvcHRpb25zLmhpZ2hXYXRlck1hcms7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaGlnaCB3YXRlciBtYXJrIHByb3ZpZGVkIHRvIHRoZSBjb25zdHJ1Y3Rvci5cbiAgICovXG4gIGdldCBoaWdoV2F0ZXJNYXJrKCk6IG51bWJlciB7XG4gICAgaWYgKCFJc0J5dGVMZW5ndGhRdWV1aW5nU3RyYXRlZ3kodGhpcykpIHtcbiAgICAgIHRocm93IGJ5dGVMZW5ndGhCcmFuZENoZWNrRXhjZXB0aW9uKCdoaWdoV2F0ZXJNYXJrJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9ieXRlTGVuZ3RoUXVldWluZ1N0cmF0ZWd5SGlnaFdhdGVyTWFyaztcbiAgfVxuXG4gIC8qKlxuICAgKiBNZWFzdXJlcyB0aGUgc2l6ZSBvZiBgY2h1bmtgIGJ5IHJldHVybmluZyB0aGUgdmFsdWUgb2YgaXRzIGBieXRlTGVuZ3RoYCBwcm9wZXJ0eS5cbiAgICovXG4gIGdldCBzaXplKCk6IChjaHVuazogQXJyYXlCdWZmZXJWaWV3KSA9PiBudW1iZXIge1xuICAgIGlmICghSXNCeXRlTGVuZ3RoUXVldWluZ1N0cmF0ZWd5KHRoaXMpKSB7XG4gICAgICB0aHJvdyBieXRlTGVuZ3RoQnJhbmRDaGVja0V4Y2VwdGlvbignc2l6ZScpO1xuICAgIH1cbiAgICByZXR1cm4gYnl0ZUxlbmd0aFNpemVGdW5jdGlvbjtcbiAgfVxufVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyhCeXRlTGVuZ3RoUXVldWluZ1N0cmF0ZWd5LnByb3RvdHlwZSwge1xuICBoaWdoV2F0ZXJNYXJrOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgc2l6ZTogeyBlbnVtZXJhYmxlOiB0cnVlIH1cbn0pO1xuaWYgKHR5cGVvZiBTeW1ib2wudG9TdHJpbmdUYWcgPT09ICdzeW1ib2wnKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShCeXRlTGVuZ3RoUXVldWluZ1N0cmF0ZWd5LnByb3RvdHlwZSwgU3ltYm9sLnRvU3RyaW5nVGFnLCB7XG4gICAgdmFsdWU6ICdCeXRlTGVuZ3RoUXVldWluZ1N0cmF0ZWd5JyxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG59XG5cbi8vIEhlbHBlciBmdW5jdGlvbnMgZm9yIHRoZSBCeXRlTGVuZ3RoUXVldWluZ1N0cmF0ZWd5LlxuXG5mdW5jdGlvbiBieXRlTGVuZ3RoQnJhbmRDaGVja0V4Y2VwdGlvbihuYW1lOiBzdHJpbmcpOiBUeXBlRXJyb3Ige1xuICByZXR1cm4gbmV3IFR5cGVFcnJvcihgQnl0ZUxlbmd0aFF1ZXVpbmdTdHJhdGVneS5wcm90b3R5cGUuJHtuYW1lfSBjYW4gb25seSBiZSB1c2VkIG9uIGEgQnl0ZUxlbmd0aFF1ZXVpbmdTdHJhdGVneWApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gSXNCeXRlTGVuZ3RoUXVldWluZ1N0cmF0ZWd5KHg6IGFueSk6IHggaXMgQnl0ZUxlbmd0aFF1ZXVpbmdTdHJhdGVneSB7XG4gIGlmICghdHlwZUlzT2JqZWN0KHgpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoeCwgJ19ieXRlTGVuZ3RoUXVldWluZ1N0cmF0ZWd5SGlnaFdhdGVyTWFyaycpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHggaW5zdGFuY2VvZiBCeXRlTGVuZ3RoUXVldWluZ1N0cmF0ZWd5O1xufVxuIiwgImltcG9ydCB0eXBlIHsgUXVldWluZ1N0cmF0ZWd5LCBRdWV1aW5nU3RyYXRlZ3lJbml0IH0gZnJvbSAnLi9xdWV1aW5nLXN0cmF0ZWd5JztcbmltcG9ydCB7IHNldEZ1bmN0aW9uTmFtZSwgdHlwZUlzT2JqZWN0IH0gZnJvbSAnLi9oZWxwZXJzL21pc2NlbGxhbmVvdXMnO1xuaW1wb3J0IHsgYXNzZXJ0UmVxdWlyZWRBcmd1bWVudCB9IGZyb20gJy4vdmFsaWRhdG9ycy9iYXNpYyc7XG5pbXBvcnQgeyBjb252ZXJ0UXVldWluZ1N0cmF0ZWd5SW5pdCB9IGZyb20gJy4vdmFsaWRhdG9ycy9xdWV1aW5nLXN0cmF0ZWd5LWluaXQnO1xuXG4vLyBUaGUgc2l6ZSBmdW5jdGlvbiBtdXN0IG5vdCBoYXZlIGEgcHJvdG90eXBlIHByb3BlcnR5IG5vciBiZSBhIGNvbnN0cnVjdG9yXG5jb25zdCBjb3VudFNpemVGdW5jdGlvbiA9ICgpOiAxID0+IHtcbiAgcmV0dXJuIDE7XG59O1xuc2V0RnVuY3Rpb25OYW1lKGNvdW50U2l6ZUZ1bmN0aW9uLCAnc2l6ZScpO1xuXG4vKipcbiAqIEEgcXVldWluZyBzdHJhdGVneSB0aGF0IGNvdW50cyB0aGUgbnVtYmVyIG9mIGNodW5rcy5cbiAqXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvdW50UXVldWluZ1N0cmF0ZWd5IGltcGxlbWVudHMgUXVldWluZ1N0cmF0ZWd5PGFueT4ge1xuICAvKiogQGludGVybmFsICovXG4gIHJlYWRvbmx5IF9jb3VudFF1ZXVpbmdTdHJhdGVneUhpZ2hXYXRlck1hcmshOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9uczogUXVldWluZ1N0cmF0ZWd5SW5pdCkge1xuICAgIGFzc2VydFJlcXVpcmVkQXJndW1lbnQob3B0aW9ucywgMSwgJ0NvdW50UXVldWluZ1N0cmF0ZWd5Jyk7XG4gICAgb3B0aW9ucyA9IGNvbnZlcnRRdWV1aW5nU3RyYXRlZ3lJbml0KG9wdGlvbnMsICdGaXJzdCBwYXJhbWV0ZXInKTtcbiAgICB0aGlzLl9jb3VudFF1ZXVpbmdTdHJhdGVneUhpZ2hXYXRlck1hcmsgPSBvcHRpb25zLmhpZ2hXYXRlck1hcms7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaGlnaCB3YXRlciBtYXJrIHByb3ZpZGVkIHRvIHRoZSBjb25zdHJ1Y3Rvci5cbiAgICovXG4gIGdldCBoaWdoV2F0ZXJNYXJrKCk6IG51bWJlciB7XG4gICAgaWYgKCFJc0NvdW50UXVldWluZ1N0cmF0ZWd5KHRoaXMpKSB7XG4gICAgICB0aHJvdyBjb3VudEJyYW5kQ2hlY2tFeGNlcHRpb24oJ2hpZ2hXYXRlck1hcmsnKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2NvdW50UXVldWluZ1N0cmF0ZWd5SGlnaFdhdGVyTWFyaztcbiAgfVxuXG4gIC8qKlxuICAgKiBNZWFzdXJlcyB0aGUgc2l6ZSBvZiBgY2h1bmtgIGJ5IGFsd2F5cyByZXR1cm5pbmcgMS5cbiAgICogVGhpcyBlbnN1cmVzIHRoYXQgdGhlIHRvdGFsIHF1ZXVlIHNpemUgaXMgYSBjb3VudCBvZiB0aGUgbnVtYmVyIG9mIGNodW5rcyBpbiB0aGUgcXVldWUuXG4gICAqL1xuICBnZXQgc2l6ZSgpOiAoY2h1bms6IGFueSkgPT4gMSB7XG4gICAgaWYgKCFJc0NvdW50UXVldWluZ1N0cmF0ZWd5KHRoaXMpKSB7XG4gICAgICB0aHJvdyBjb3VudEJyYW5kQ2hlY2tFeGNlcHRpb24oJ3NpemUnKTtcbiAgICB9XG4gICAgcmV0dXJuIGNvdW50U2l6ZUZ1bmN0aW9uO1xuICB9XG59XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKENvdW50UXVldWluZ1N0cmF0ZWd5LnByb3RvdHlwZSwge1xuICBoaWdoV2F0ZXJNYXJrOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgc2l6ZTogeyBlbnVtZXJhYmxlOiB0cnVlIH1cbn0pO1xuaWYgKHR5cGVvZiBTeW1ib2wudG9TdHJpbmdUYWcgPT09ICdzeW1ib2wnKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDb3VudFF1ZXVpbmdTdHJhdGVneS5wcm90b3R5cGUsIFN5bWJvbC50b1N0cmluZ1RhZywge1xuICAgIHZhbHVlOiAnQ291bnRRdWV1aW5nU3RyYXRlZ3knLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbn1cblxuLy8gSGVscGVyIGZ1bmN0aW9ucyBmb3IgdGhlIENvdW50UXVldWluZ1N0cmF0ZWd5LlxuXG5mdW5jdGlvbiBjb3VudEJyYW5kQ2hlY2tFeGNlcHRpb24obmFtZTogc3RyaW5nKTogVHlwZUVycm9yIHtcbiAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoYENvdW50UXVldWluZ1N0cmF0ZWd5LnByb3RvdHlwZS4ke25hbWV9IGNhbiBvbmx5IGJlIHVzZWQgb24gYSBDb3VudFF1ZXVpbmdTdHJhdGVneWApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gSXNDb3VudFF1ZXVpbmdTdHJhdGVneSh4OiBhbnkpOiB4IGlzIENvdW50UXVldWluZ1N0cmF0ZWd5IHtcbiAgaWYgKCF0eXBlSXNPYmplY3QoeCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh4LCAnX2NvdW50UXVldWluZ1N0cmF0ZWd5SGlnaFdhdGVyTWFyaycpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHggaW5zdGFuY2VvZiBDb3VudFF1ZXVpbmdTdHJhdGVneTtcbn1cbiIsICJpbXBvcnQgeyBhc3NlcnREaWN0aW9uYXJ5LCBhc3NlcnRGdW5jdGlvbiB9IGZyb20gJy4vYmFzaWMnO1xuaW1wb3J0IHsgcHJvbWlzZUNhbGwsIHJlZmxlY3RDYWxsIH0gZnJvbSAnLi4vaGVscGVycy93ZWJpZGwnO1xuaW1wb3J0IHR5cGUge1xuICBUcmFuc2Zvcm1lcixcbiAgVHJhbnNmb3JtZXJDYW5jZWxDYWxsYmFjayxcbiAgVHJhbnNmb3JtZXJGbHVzaENhbGxiYWNrLFxuICBUcmFuc2Zvcm1lclN0YXJ0Q2FsbGJhY2ssXG4gIFRyYW5zZm9ybWVyVHJhbnNmb3JtQ2FsbGJhY2ssXG4gIFZhbGlkYXRlZFRyYW5zZm9ybWVyXG59IGZyb20gJy4uL3RyYW5zZm9ybS1zdHJlYW0vdHJhbnNmb3JtZXInO1xuaW1wb3J0IHsgVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIgfSBmcm9tICcuLi90cmFuc2Zvcm0tc3RyZWFtJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRUcmFuc2Zvcm1lcjxJLCBPPihvcmlnaW5hbDogVHJhbnNmb3JtZXI8SSwgTz4gfCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiBzdHJpbmcpOiBWYWxpZGF0ZWRUcmFuc2Zvcm1lcjxJLCBPPiB7XG4gIGFzc2VydERpY3Rpb25hcnkob3JpZ2luYWwsIGNvbnRleHQpO1xuICBjb25zdCBjYW5jZWwgPSBvcmlnaW5hbD8uY2FuY2VsO1xuICBjb25zdCBmbHVzaCA9IG9yaWdpbmFsPy5mbHVzaDtcbiAgY29uc3QgcmVhZGFibGVUeXBlID0gb3JpZ2luYWw/LnJlYWRhYmxlVHlwZTtcbiAgY29uc3Qgc3RhcnQgPSBvcmlnaW5hbD8uc3RhcnQ7XG4gIGNvbnN0IHRyYW5zZm9ybSA9IG9yaWdpbmFsPy50cmFuc2Zvcm07XG4gIGNvbnN0IHdyaXRhYmxlVHlwZSA9IG9yaWdpbmFsPy53cml0YWJsZVR5cGU7XG4gIHJldHVybiB7XG4gICAgY2FuY2VsOiBjYW5jZWwgPT09IHVuZGVmaW5lZCA/XG4gICAgICB1bmRlZmluZWQgOlxuICAgICAgY29udmVydFRyYW5zZm9ybWVyQ2FuY2VsQ2FsbGJhY2soY2FuY2VsLCBvcmlnaW5hbCEsIGAke2NvbnRleHR9IGhhcyBtZW1iZXIgJ2NhbmNlbCcgdGhhdGApLFxuICAgIGZsdXNoOiBmbHVzaCA9PT0gdW5kZWZpbmVkID9cbiAgICAgIHVuZGVmaW5lZCA6XG4gICAgICBjb252ZXJ0VHJhbnNmb3JtZXJGbHVzaENhbGxiYWNrKGZsdXNoLCBvcmlnaW5hbCEsIGAke2NvbnRleHR9IGhhcyBtZW1iZXIgJ2ZsdXNoJyB0aGF0YCksXG4gICAgcmVhZGFibGVUeXBlLFxuICAgIHN0YXJ0OiBzdGFydCA9PT0gdW5kZWZpbmVkID9cbiAgICAgIHVuZGVmaW5lZCA6XG4gICAgICBjb252ZXJ0VHJhbnNmb3JtZXJTdGFydENhbGxiYWNrKHN0YXJ0LCBvcmlnaW5hbCEsIGAke2NvbnRleHR9IGhhcyBtZW1iZXIgJ3N0YXJ0JyB0aGF0YCksXG4gICAgdHJhbnNmb3JtOiB0cmFuc2Zvcm0gPT09IHVuZGVmaW5lZCA/XG4gICAgICB1bmRlZmluZWQgOlxuICAgICAgY29udmVydFRyYW5zZm9ybWVyVHJhbnNmb3JtQ2FsbGJhY2sodHJhbnNmb3JtLCBvcmlnaW5hbCEsIGAke2NvbnRleHR9IGhhcyBtZW1iZXIgJ3RyYW5zZm9ybScgdGhhdGApLFxuICAgIHdyaXRhYmxlVHlwZVxuICB9O1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0VHJhbnNmb3JtZXJGbHVzaENhbGxiYWNrPEksIE8+KFxuICBmbjogVHJhbnNmb3JtZXJGbHVzaENhbGxiYWNrPE8+LFxuICBvcmlnaW5hbDogVHJhbnNmb3JtZXI8SSwgTz4sXG4gIGNvbnRleHQ6IHN0cmluZ1xuKTogKGNvbnRyb2xsZXI6IFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyPE8+KSA9PiBQcm9taXNlPHZvaWQ+IHtcbiAgYXNzZXJ0RnVuY3Rpb24oZm4sIGNvbnRleHQpO1xuICByZXR1cm4gKGNvbnRyb2xsZXI6IFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyPE8+KSA9PiBwcm9taXNlQ2FsbChmbiwgb3JpZ2luYWwsIFtjb250cm9sbGVyXSk7XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRUcmFuc2Zvcm1lclN0YXJ0Q2FsbGJhY2s8SSwgTz4oXG4gIGZuOiBUcmFuc2Zvcm1lclN0YXJ0Q2FsbGJhY2s8Tz4sXG4gIG9yaWdpbmFsOiBUcmFuc2Zvcm1lcjxJLCBPPixcbiAgY29udGV4dDogc3RyaW5nXG4pOiBUcmFuc2Zvcm1lclN0YXJ0Q2FsbGJhY2s8Tz4ge1xuICBhc3NlcnRGdW5jdGlvbihmbiwgY29udGV4dCk7XG4gIHJldHVybiAoY29udHJvbGxlcjogVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8Tz4pID0+IHJlZmxlY3RDYWxsKGZuLCBvcmlnaW5hbCwgW2NvbnRyb2xsZXJdKTtcbn1cblxuZnVuY3Rpb24gY29udmVydFRyYW5zZm9ybWVyVHJhbnNmb3JtQ2FsbGJhY2s8SSwgTz4oXG4gIGZuOiBUcmFuc2Zvcm1lclRyYW5zZm9ybUNhbGxiYWNrPEksIE8+LFxuICBvcmlnaW5hbDogVHJhbnNmb3JtZXI8SSwgTz4sXG4gIGNvbnRleHQ6IHN0cmluZ1xuKTogKGNodW5rOiBJLCBjb250cm9sbGVyOiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxPPikgPT4gUHJvbWlzZTx2b2lkPiB7XG4gIGFzc2VydEZ1bmN0aW9uKGZuLCBjb250ZXh0KTtcbiAgcmV0dXJuIChjaHVuazogSSwgY29udHJvbGxlcjogVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8Tz4pID0+IHByb21pc2VDYWxsKGZuLCBvcmlnaW5hbCwgW2NodW5rLCBjb250cm9sbGVyXSk7XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRUcmFuc2Zvcm1lckNhbmNlbENhbGxiYWNrPEksIE8+KFxuICBmbjogVHJhbnNmb3JtZXJDYW5jZWxDYWxsYmFjayxcbiAgb3JpZ2luYWw6IFRyYW5zZm9ybWVyPEksIE8+LFxuICBjb250ZXh0OiBzdHJpbmdcbik6IChyZWFzb246IGFueSkgPT4gUHJvbWlzZTx2b2lkPiB7XG4gIGFzc2VydEZ1bmN0aW9uKGZuLCBjb250ZXh0KTtcbiAgcmV0dXJuIChyZWFzb246IGFueSkgPT4gcHJvbWlzZUNhbGwoZm4sIG9yaWdpbmFsLCBbcmVhc29uXSk7XG59XG4iLCAiaW1wb3J0IGFzc2VydCBmcm9tICcuLi9zdHViL2Fzc2VydCc7XG5pbXBvcnQge1xuICBuZXdQcm9taXNlLFxuICBwcm9taXNlUmVqZWN0ZWRXaXRoLFxuICBwcm9taXNlUmVzb2x2ZWRXaXRoLFxuICBzZXRQcm9taXNlSXNIYW5kbGVkVG9UcnVlLFxuICB0cmFuc2Zvcm1Qcm9taXNlV2l0aCxcbiAgdXBvblByb21pc2Vcbn0gZnJvbSAnLi9oZWxwZXJzL3dlYmlkbCc7XG5pbXBvcnQgeyBDcmVhdGVSZWFkYWJsZVN0cmVhbSwgdHlwZSBEZWZhdWx0UmVhZGFibGVTdHJlYW0sIFJlYWRhYmxlU3RyZWFtIH0gZnJvbSAnLi9yZWFkYWJsZS1zdHJlYW0nO1xuaW1wb3J0IHtcbiAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNhbkNsb3NlT3JFbnF1ZXVlLFxuICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2xvc2UsXG4gIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFbnF1ZXVlLFxuICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRXJyb3IsXG4gIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJHZXREZXNpcmVkU2l6ZSxcbiAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckhhc0JhY2twcmVzc3VyZVxufSBmcm9tICcuL3JlYWRhYmxlLXN0cmVhbS9kZWZhdWx0LWNvbnRyb2xsZXInO1xuaW1wb3J0IHR5cGUgeyBRdWV1aW5nU3RyYXRlZ3ksIFF1ZXVpbmdTdHJhdGVneVNpemVDYWxsYmFjayB9IGZyb20gJy4vcXVldWluZy1zdHJhdGVneSc7XG5pbXBvcnQgeyBDcmVhdGVXcml0YWJsZVN0cmVhbSwgV3JpdGFibGVTdHJlYW0sIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFcnJvcklmTmVlZGVkIH0gZnJvbSAnLi93cml0YWJsZS1zdHJlYW0nO1xuaW1wb3J0IHsgc2V0RnVuY3Rpb25OYW1lLCB0eXBlSXNPYmplY3QgfSBmcm9tICcuL2hlbHBlcnMvbWlzY2VsbGFuZW91cyc7XG5pbXBvcnQgeyBJc05vbk5lZ2F0aXZlTnVtYmVyIH0gZnJvbSAnLi9hYnN0cmFjdC1vcHMvbWlzY2VsbGFuZW91cyc7XG5pbXBvcnQgeyBjb252ZXJ0UXVldWluZ1N0cmF0ZWd5IH0gZnJvbSAnLi92YWxpZGF0b3JzL3F1ZXVpbmctc3RyYXRlZ3knO1xuaW1wb3J0IHsgRXh0cmFjdEhpZ2hXYXRlck1hcmssIEV4dHJhY3RTaXplQWxnb3JpdGhtIH0gZnJvbSAnLi9hYnN0cmFjdC1vcHMvcXVldWluZy1zdHJhdGVneSc7XG5pbXBvcnQgdHlwZSB7XG4gIFRyYW5zZm9ybWVyLFxuICBUcmFuc2Zvcm1lckNhbmNlbENhbGxiYWNrLFxuICBUcmFuc2Zvcm1lckZsdXNoQ2FsbGJhY2ssXG4gIFRyYW5zZm9ybWVyU3RhcnRDYWxsYmFjayxcbiAgVHJhbnNmb3JtZXJUcmFuc2Zvcm1DYWxsYmFjayxcbiAgVmFsaWRhdGVkVHJhbnNmb3JtZXJcbn0gZnJvbSAnLi90cmFuc2Zvcm0tc3RyZWFtL3RyYW5zZm9ybWVyJztcbmltcG9ydCB7IGNvbnZlcnRUcmFuc2Zvcm1lciB9IGZyb20gJy4vdmFsaWRhdG9ycy90cmFuc2Zvcm1lcic7XG5cbi8vIENsYXNzIFRyYW5zZm9ybVN0cmVhbVxuXG4vKipcbiAqIEEgdHJhbnNmb3JtIHN0cmVhbSBjb25zaXN0cyBvZiBhIHBhaXIgb2Ygc3RyZWFtczogYSB7QGxpbmsgV3JpdGFibGVTdHJlYW0gfCB3cml0YWJsZSBzdHJlYW19LFxuICoga25vd24gYXMgaXRzIHdyaXRhYmxlIHNpZGUsIGFuZCBhIHtAbGluayBSZWFkYWJsZVN0cmVhbSB8IHJlYWRhYmxlIHN0cmVhbX0sIGtub3duIGFzIGl0cyByZWFkYWJsZSBzaWRlLlxuICogSW4gYSBtYW5uZXIgc3BlY2lmaWMgdG8gdGhlIHRyYW5zZm9ybSBzdHJlYW0gaW4gcXVlc3Rpb24sIHdyaXRlcyB0byB0aGUgd3JpdGFibGUgc2lkZSByZXN1bHQgaW4gbmV3IGRhdGEgYmVpbmdcbiAqIG1hZGUgYXZhaWxhYmxlIGZvciByZWFkaW5nIGZyb20gdGhlIHJlYWRhYmxlIHNpZGUuXG4gKlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY2xhc3MgVHJhbnNmb3JtU3RyZWFtPEkgPSBhbnksIE8gPSBhbnk+IHtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfd3JpdGFibGUhOiBXcml0YWJsZVN0cmVhbTxJPjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcmVhZGFibGUhOiBEZWZhdWx0UmVhZGFibGVTdHJlYW08Tz47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2JhY2twcmVzc3VyZSE6IGJvb2xlYW47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2JhY2twcmVzc3VyZUNoYW5nZVByb21pc2UhOiBQcm9taXNlPHZvaWQ+O1xuICAvKiogQGludGVybmFsICovXG4gIF9iYWNrcHJlc3N1cmVDaGFuZ2VQcm9taXNlX3Jlc29sdmUhOiAoKSA9PiB2b2lkO1xuICAvKiogQGludGVybmFsICovXG4gIF90cmFuc2Zvcm1TdHJlYW1Db250cm9sbGVyITogVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8Tz47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgdHJhbnNmb3JtZXI/OiBUcmFuc2Zvcm1lcjxJLCBPPixcbiAgICB3cml0YWJsZVN0cmF0ZWd5PzogUXVldWluZ1N0cmF0ZWd5PEk+LFxuICAgIHJlYWRhYmxlU3RyYXRlZ3k/OiBRdWV1aW5nU3RyYXRlZ3k8Tz5cbiAgKTtcbiAgY29uc3RydWN0b3IocmF3VHJhbnNmb3JtZXI6IFRyYW5zZm9ybWVyPEksIE8+IHwgbnVsbCB8IHVuZGVmaW5lZCA9IHt9LFxuICAgICAgICAgICAgICByYXdXcml0YWJsZVN0cmF0ZWd5OiBRdWV1aW5nU3RyYXRlZ3k8ST4gfCBudWxsIHwgdW5kZWZpbmVkID0ge30sXG4gICAgICAgICAgICAgIHJhd1JlYWRhYmxlU3RyYXRlZ3k6IFF1ZXVpbmdTdHJhdGVneTxPPiB8IG51bGwgfCB1bmRlZmluZWQgPSB7fSkge1xuICAgIGlmIChyYXdUcmFuc2Zvcm1lciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByYXdUcmFuc2Zvcm1lciA9IG51bGw7XG4gICAgfVxuXG4gICAgY29uc3Qgd3JpdGFibGVTdHJhdGVneSA9IGNvbnZlcnRRdWV1aW5nU3RyYXRlZ3kocmF3V3JpdGFibGVTdHJhdGVneSwgJ1NlY29uZCBwYXJhbWV0ZXInKTtcbiAgICBjb25zdCByZWFkYWJsZVN0cmF0ZWd5ID0gY29udmVydFF1ZXVpbmdTdHJhdGVneShyYXdSZWFkYWJsZVN0cmF0ZWd5LCAnVGhpcmQgcGFyYW1ldGVyJyk7XG5cbiAgICBjb25zdCB0cmFuc2Zvcm1lciA9IGNvbnZlcnRUcmFuc2Zvcm1lcihyYXdUcmFuc2Zvcm1lciwgJ0ZpcnN0IHBhcmFtZXRlcicpO1xuICAgIGlmICh0cmFuc2Zvcm1lci5yZWFkYWJsZVR5cGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0ludmFsaWQgcmVhZGFibGVUeXBlIHNwZWNpZmllZCcpO1xuICAgIH1cbiAgICBpZiAodHJhbnNmb3JtZXIud3JpdGFibGVUeXBlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbnZhbGlkIHdyaXRhYmxlVHlwZSBzcGVjaWZpZWQnKTtcbiAgICB9XG5cbiAgICBjb25zdCByZWFkYWJsZUhpZ2hXYXRlck1hcmsgPSBFeHRyYWN0SGlnaFdhdGVyTWFyayhyZWFkYWJsZVN0cmF0ZWd5LCAwKTtcbiAgICBjb25zdCByZWFkYWJsZVNpemVBbGdvcml0aG0gPSBFeHRyYWN0U2l6ZUFsZ29yaXRobShyZWFkYWJsZVN0cmF0ZWd5KTtcbiAgICBjb25zdCB3cml0YWJsZUhpZ2hXYXRlck1hcmsgPSBFeHRyYWN0SGlnaFdhdGVyTWFyayh3cml0YWJsZVN0cmF0ZWd5LCAxKTtcbiAgICBjb25zdCB3cml0YWJsZVNpemVBbGdvcml0aG0gPSBFeHRyYWN0U2l6ZUFsZ29yaXRobSh3cml0YWJsZVN0cmF0ZWd5KTtcblxuICAgIGxldCBzdGFydFByb21pc2VfcmVzb2x2ZSE6ICh2YWx1ZTogdm9pZCB8IFByb21pc2VMaWtlPHZvaWQ+KSA9PiB2b2lkO1xuICAgIGNvbnN0IHN0YXJ0UHJvbWlzZSA9IG5ld1Byb21pc2U8dm9pZD4ocmVzb2x2ZSA9PiB7XG4gICAgICBzdGFydFByb21pc2VfcmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgfSk7XG5cbiAgICBJbml0aWFsaXplVHJhbnNmb3JtU3RyZWFtKFxuICAgICAgdGhpcywgc3RhcnRQcm9taXNlLCB3cml0YWJsZUhpZ2hXYXRlck1hcmssIHdyaXRhYmxlU2l6ZUFsZ29yaXRobSwgcmVhZGFibGVIaWdoV2F0ZXJNYXJrLCByZWFkYWJsZVNpemVBbGdvcml0aG1cbiAgICApO1xuICAgIFNldFVwVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJGcm9tVHJhbnNmb3JtZXIodGhpcywgdHJhbnNmb3JtZXIpO1xuXG4gICAgaWYgKHRyYW5zZm9ybWVyLnN0YXJ0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHN0YXJ0UHJvbWlzZV9yZXNvbHZlKHRyYW5zZm9ybWVyLnN0YXJ0KHRoaXMuX3RyYW5zZm9ybVN0cmVhbUNvbnRyb2xsZXIpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhcnRQcm9taXNlX3Jlc29sdmUodW5kZWZpbmVkKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhlIHJlYWRhYmxlIHNpZGUgb2YgdGhlIHRyYW5zZm9ybSBzdHJlYW0uXG4gICAqL1xuICBnZXQgcmVhZGFibGUoKTogUmVhZGFibGVTdHJlYW08Tz4ge1xuICAgIGlmICghSXNUcmFuc2Zvcm1TdHJlYW0odGhpcykpIHtcbiAgICAgIHRocm93IHN0cmVhbUJyYW5kQ2hlY2tFeGNlcHRpb24oJ3JlYWRhYmxlJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3JlYWRhYmxlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSB3cml0YWJsZSBzaWRlIG9mIHRoZSB0cmFuc2Zvcm0gc3RyZWFtLlxuICAgKi9cbiAgZ2V0IHdyaXRhYmxlKCk6IFdyaXRhYmxlU3RyZWFtPEk+IHtcbiAgICBpZiAoIUlzVHJhbnNmb3JtU3RyZWFtKHRoaXMpKSB7XG4gICAgICB0aHJvdyBzdHJlYW1CcmFuZENoZWNrRXhjZXB0aW9uKCd3cml0YWJsZScpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl93cml0YWJsZTtcbiAgfVxufVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyhUcmFuc2Zvcm1TdHJlYW0ucHJvdG90eXBlLCB7XG4gIHJlYWRhYmxlOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgd3JpdGFibGU6IHsgZW51bWVyYWJsZTogdHJ1ZSB9XG59KTtcbmlmICh0eXBlb2YgU3ltYm9sLnRvU3RyaW5nVGFnID09PSAnc3ltYm9sJykge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVHJhbnNmb3JtU3RyZWFtLnByb3RvdHlwZSwgU3ltYm9sLnRvU3RyaW5nVGFnLCB7XG4gICAgdmFsdWU6ICdUcmFuc2Zvcm1TdHJlYW0nLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbn1cblxuZXhwb3J0IHR5cGUge1xuICBUcmFuc2Zvcm1lcixcbiAgVHJhbnNmb3JtZXJDYW5jZWxDYWxsYmFjayxcbiAgVHJhbnNmb3JtZXJTdGFydENhbGxiYWNrLFxuICBUcmFuc2Zvcm1lckZsdXNoQ2FsbGJhY2ssXG4gIFRyYW5zZm9ybWVyVHJhbnNmb3JtQ2FsbGJhY2tcbn07XG5cbi8vIFRyYW5zZm9ybSBTdHJlYW0gQWJzdHJhY3QgT3BlcmF0aW9uc1xuXG5leHBvcnQgZnVuY3Rpb24gQ3JlYXRlVHJhbnNmb3JtU3RyZWFtPEksIE8+KHN0YXJ0QWxnb3JpdGhtOiAoKSA9PiB2b2lkIHwgUHJvbWlzZUxpa2U8dm9pZD4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybUFsZ29yaXRobTogKGNodW5rOiBJKSA9PiBQcm9taXNlPHZvaWQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbHVzaEFsZ29yaXRobTogKCkgPT4gUHJvbWlzZTx2b2lkPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuY2VsQWxnb3JpdGhtOiAocmVhc29uOiBhbnkpID0+IFByb21pc2U8dm9pZD4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdyaXRhYmxlSGlnaFdhdGVyTWFyayA9IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdyaXRhYmxlU2l6ZUFsZ29yaXRobTogUXVldWluZ1N0cmF0ZWd5U2l6ZUNhbGxiYWNrPEk+ID0gKCkgPT4gMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVhZGFibGVIaWdoV2F0ZXJNYXJrID0gMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVhZGFibGVTaXplQWxnb3JpdGhtOiBRdWV1aW5nU3RyYXRlZ3lTaXplQ2FsbGJhY2s8Tz4gPSAoKSA9PiAxKSB7XG4gIGFzc2VydChJc05vbk5lZ2F0aXZlTnVtYmVyKHdyaXRhYmxlSGlnaFdhdGVyTWFyaykpO1xuICBhc3NlcnQoSXNOb25OZWdhdGl2ZU51bWJlcihyZWFkYWJsZUhpZ2hXYXRlck1hcmspKTtcblxuICBjb25zdCBzdHJlYW06IFRyYW5zZm9ybVN0cmVhbTxJLCBPPiA9IE9iamVjdC5jcmVhdGUoVHJhbnNmb3JtU3RyZWFtLnByb3RvdHlwZSk7XG5cbiAgbGV0IHN0YXJ0UHJvbWlzZV9yZXNvbHZlITogKHZhbHVlOiB2b2lkIHwgUHJvbWlzZUxpa2U8dm9pZD4pID0+IHZvaWQ7XG4gIGNvbnN0IHN0YXJ0UHJvbWlzZSA9IG5ld1Byb21pc2U8dm9pZD4ocmVzb2x2ZSA9PiB7XG4gICAgc3RhcnRQcm9taXNlX3Jlc29sdmUgPSByZXNvbHZlO1xuICB9KTtcblxuICBJbml0aWFsaXplVHJhbnNmb3JtU3RyZWFtKHN0cmVhbSwgc3RhcnRQcm9taXNlLCB3cml0YWJsZUhpZ2hXYXRlck1hcmssIHdyaXRhYmxlU2l6ZUFsZ29yaXRobSwgcmVhZGFibGVIaWdoV2F0ZXJNYXJrLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlYWRhYmxlU2l6ZUFsZ29yaXRobSk7XG5cbiAgY29uc3QgY29udHJvbGxlcjogVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8Tz4gPSBPYmplY3QuY3JlYXRlKFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyLnByb3RvdHlwZSk7XG5cbiAgU2V0VXBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlcihzdHJlYW0sIGNvbnRyb2xsZXIsIHRyYW5zZm9ybUFsZ29yaXRobSwgZmx1c2hBbGdvcml0aG0sIGNhbmNlbEFsZ29yaXRobSk7XG5cbiAgY29uc3Qgc3RhcnRSZXN1bHQgPSBzdGFydEFsZ29yaXRobSgpO1xuICBzdGFydFByb21pc2VfcmVzb2x2ZShzdGFydFJlc3VsdCk7XG4gIHJldHVybiBzdHJlYW07XG59XG5cbmZ1bmN0aW9uIEluaXRpYWxpemVUcmFuc2Zvcm1TdHJlYW08SSwgTz4oc3RyZWFtOiBUcmFuc2Zvcm1TdHJlYW08SSwgTz4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0UHJvbWlzZTogUHJvbWlzZTx2b2lkPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd3JpdGFibGVIaWdoV2F0ZXJNYXJrOiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdyaXRhYmxlU2l6ZUFsZ29yaXRobTogUXVldWluZ1N0cmF0ZWd5U2l6ZUNhbGxiYWNrPEk+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWFkYWJsZUhpZ2hXYXRlck1hcms6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVhZGFibGVTaXplQWxnb3JpdGhtOiBRdWV1aW5nU3RyYXRlZ3lTaXplQ2FsbGJhY2s8Tz4pIHtcbiAgZnVuY3Rpb24gc3RhcnRBbGdvcml0aG0oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHN0YXJ0UHJvbWlzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHdyaXRlQWxnb3JpdGhtKGNodW5rOiBJKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIFRyYW5zZm9ybVN0cmVhbURlZmF1bHRTaW5rV3JpdGVBbGdvcml0aG0oc3RyZWFtLCBjaHVuayk7XG4gIH1cblxuICBmdW5jdGlvbiBhYm9ydEFsZ29yaXRobShyZWFzb246IGFueSk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0U2lua0Fib3J0QWxnb3JpdGhtKHN0cmVhbSwgcmVhc29uKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsb3NlQWxnb3JpdGhtKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0U2lua0Nsb3NlQWxnb3JpdGhtKHN0cmVhbSk7XG4gIH1cblxuICBzdHJlYW0uX3dyaXRhYmxlID0gQ3JlYXRlV3JpdGFibGVTdHJlYW0oc3RhcnRBbGdvcml0aG0sIHdyaXRlQWxnb3JpdGhtLCBjbG9zZUFsZ29yaXRobSwgYWJvcnRBbGdvcml0aG0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3cml0YWJsZUhpZ2hXYXRlck1hcmssIHdyaXRhYmxlU2l6ZUFsZ29yaXRobSk7XG5cbiAgZnVuY3Rpb24gcHVsbEFsZ29yaXRobSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gVHJhbnNmb3JtU3RyZWFtRGVmYXVsdFNvdXJjZVB1bGxBbGdvcml0aG0oc3RyZWFtKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbmNlbEFsZ29yaXRobShyZWFzb246IGFueSk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0U291cmNlQ2FuY2VsQWxnb3JpdGhtKHN0cmVhbSwgcmVhc29uKTtcbiAgfVxuXG4gIHN0cmVhbS5fcmVhZGFibGUgPSBDcmVhdGVSZWFkYWJsZVN0cmVhbShzdGFydEFsZ29yaXRobSwgcHVsbEFsZ29yaXRobSwgY2FuY2VsQWxnb3JpdGhtLCByZWFkYWJsZUhpZ2hXYXRlck1hcmssXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWFkYWJsZVNpemVBbGdvcml0aG0pO1xuXG4gIC8vIFRoZSBbW2JhY2twcmVzc3VyZV1dIHNsb3QgaXMgc2V0IHRvIHVuZGVmaW5lZCBzbyB0aGF0IGl0IGNhbiBiZSBpbml0aWFsaXNlZCBieSBUcmFuc2Zvcm1TdHJlYW1TZXRCYWNrcHJlc3N1cmUuXG4gIHN0cmVhbS5fYmFja3ByZXNzdXJlID0gdW5kZWZpbmVkITtcbiAgc3RyZWFtLl9iYWNrcHJlc3N1cmVDaGFuZ2VQcm9taXNlID0gdW5kZWZpbmVkITtcbiAgc3RyZWFtLl9iYWNrcHJlc3N1cmVDaGFuZ2VQcm9taXNlX3Jlc29sdmUgPSB1bmRlZmluZWQhO1xuICBUcmFuc2Zvcm1TdHJlYW1TZXRCYWNrcHJlc3N1cmUoc3RyZWFtLCB0cnVlKTtcblxuICBzdHJlYW0uX3RyYW5zZm9ybVN0cmVhbUNvbnRyb2xsZXIgPSB1bmRlZmluZWQhO1xufVxuXG5mdW5jdGlvbiBJc1RyYW5zZm9ybVN0cmVhbSh4OiB1bmtub3duKTogeCBpcyBUcmFuc2Zvcm1TdHJlYW0ge1xuICBpZiAoIXR5cGVJc09iamVjdCh4KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHgsICdfdHJhbnNmb3JtU3RyZWFtQ29udHJvbGxlcicpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHggaW5zdGFuY2VvZiBUcmFuc2Zvcm1TdHJlYW07XG59XG5cbi8vIFRoaXMgaXMgYSBuby1vcCBpZiBib3RoIHNpZGVzIGFyZSBhbHJlYWR5IGVycm9yZWQuXG5mdW5jdGlvbiBUcmFuc2Zvcm1TdHJlYW1FcnJvcihzdHJlYW06IFRyYW5zZm9ybVN0cmVhbSwgZTogYW55KSB7XG4gIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFcnJvcihzdHJlYW0uX3JlYWRhYmxlLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIsIGUpO1xuICBUcmFuc2Zvcm1TdHJlYW1FcnJvcldyaXRhYmxlQW5kVW5ibG9ja1dyaXRlKHN0cmVhbSwgZSk7XG59XG5cbmZ1bmN0aW9uIFRyYW5zZm9ybVN0cmVhbUVycm9yV3JpdGFibGVBbmRVbmJsb2NrV3JpdGUoc3RyZWFtOiBUcmFuc2Zvcm1TdHJlYW0sIGU6IGFueSkge1xuICBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlckNsZWFyQWxnb3JpdGhtcyhzdHJlYW0uX3RyYW5zZm9ybVN0cmVhbUNvbnRyb2xsZXIpO1xuICBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRXJyb3JJZk5lZWRlZChzdHJlYW0uX3dyaXRhYmxlLl93cml0YWJsZVN0cmVhbUNvbnRyb2xsZXIsIGUpO1xuICBUcmFuc2Zvcm1TdHJlYW1VbmJsb2NrV3JpdGUoc3RyZWFtKTtcbn1cblxuZnVuY3Rpb24gVHJhbnNmb3JtU3RyZWFtVW5ibG9ja1dyaXRlKHN0cmVhbTogVHJhbnNmb3JtU3RyZWFtKSB7XG4gIGlmIChzdHJlYW0uX2JhY2twcmVzc3VyZSkge1xuICAgIC8vIFByZXRlbmQgdGhhdCBwdWxsKCkgd2FzIGNhbGxlZCB0byBwZXJtaXQgYW55IHBlbmRpbmcgd3JpdGUoKSBjYWxscyB0byBjb21wbGV0ZS4gVHJhbnNmb3JtU3RyZWFtU2V0QmFja3ByZXNzdXJlKClcbiAgICAvLyBjYW5ub3QgYmUgY2FsbGVkIGZyb20gZW5xdWV1ZSgpIG9yIHB1bGwoKSBvbmNlIHRoZSBSZWFkYWJsZVN0cmVhbSBpcyBlcnJvcmVkLCBzbyB0aGlzIHdpbGwgd2lsbCBiZSB0aGUgZmluYWwgdGltZVxuICAgIC8vIF9iYWNrcHJlc3N1cmUgaXMgc2V0LlxuICAgIFRyYW5zZm9ybVN0cmVhbVNldEJhY2twcmVzc3VyZShzdHJlYW0sIGZhbHNlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBUcmFuc2Zvcm1TdHJlYW1TZXRCYWNrcHJlc3N1cmUoc3RyZWFtOiBUcmFuc2Zvcm1TdHJlYW0sIGJhY2twcmVzc3VyZTogYm9vbGVhbikge1xuICAvLyBQYXNzZXMgYWxzbyB3aGVuIGNhbGxlZCBkdXJpbmcgY29uc3RydWN0aW9uLlxuICBhc3NlcnQoc3RyZWFtLl9iYWNrcHJlc3N1cmUgIT09IGJhY2twcmVzc3VyZSk7XG5cbiAgaWYgKHN0cmVhbS5fYmFja3ByZXNzdXJlQ2hhbmdlUHJvbWlzZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgc3RyZWFtLl9iYWNrcHJlc3N1cmVDaGFuZ2VQcm9taXNlX3Jlc29sdmUoKTtcbiAgfVxuXG4gIHN0cmVhbS5fYmFja3ByZXNzdXJlQ2hhbmdlUHJvbWlzZSA9IG5ld1Byb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgc3RyZWFtLl9iYWNrcHJlc3N1cmVDaGFuZ2VQcm9taXNlX3Jlc29sdmUgPSByZXNvbHZlO1xuICB9KTtcblxuICBzdHJlYW0uX2JhY2twcmVzc3VyZSA9IGJhY2twcmVzc3VyZTtcbn1cblxuLy8gQ2xhc3MgVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJcblxuLyoqXG4gKiBBbGxvd3MgY29udHJvbCBvZiB0aGUge0BsaW5rIFJlYWRhYmxlU3RyZWFtfSBhbmQge0BsaW5rIFdyaXRhYmxlU3RyZWFtfSBvZiB0aGUgYXNzb2NpYXRlZCB7QGxpbmsgVHJhbnNmb3JtU3RyZWFtfS5cbiAqXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjbGFzcyBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxPPiB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2NvbnRyb2xsZWRUcmFuc2Zvcm1TdHJlYW06IFRyYW5zZm9ybVN0cmVhbTxhbnksIE8+O1xuICAvKiogQGludGVybmFsICovXG4gIF9maW5pc2hQcm9taXNlOiBQcm9taXNlPHVuZGVmaW5lZD4gfCB1bmRlZmluZWQ7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2ZpbmlzaFByb21pc2VfcmVzb2x2ZT86ICh2YWx1ZT86IHVuZGVmaW5lZCkgPT4gdm9pZDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfZmluaXNoUHJvbWlzZV9yZWplY3Q/OiAocmVhc29uOiBhbnkpID0+IHZvaWQ7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3RyYW5zZm9ybUFsZ29yaXRobTogKGNodW5rOiBhbnkpID0+IFByb21pc2U8dm9pZD47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2ZsdXNoQWxnb3JpdGhtOiAoKSA9PiBQcm9taXNlPHZvaWQ+O1xuICAvKiogQGludGVybmFsICovXG4gIF9jYW5jZWxBbGdvcml0aG06IChyZWFzb246IGFueSkgPT4gUHJvbWlzZTx2b2lkPjtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0lsbGVnYWwgY29uc3RydWN0b3InKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBkZXNpcmVkIHNpemUgdG8gZmlsbCB0aGUgcmVhZGFibGUgc2lkZeKAmXMgaW50ZXJuYWwgcXVldWUuIEl0IGNhbiBiZSBuZWdhdGl2ZSwgaWYgdGhlIHF1ZXVlIGlzIG92ZXItZnVsbC5cbiAgICovXG4gIGdldCBkZXNpcmVkU2l6ZSgpOiBudW1iZXIgfCBudWxsIHtcbiAgICBpZiAoIUlzVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIodGhpcykpIHtcbiAgICAgIHRocm93IGRlZmF1bHRDb250cm9sbGVyQnJhbmRDaGVja0V4Y2VwdGlvbignZGVzaXJlZFNpemUnKTtcbiAgICB9XG5cbiAgICBjb25zdCByZWFkYWJsZUNvbnRyb2xsZXIgPSB0aGlzLl9jb250cm9sbGVkVHJhbnNmb3JtU3RyZWFtLl9yZWFkYWJsZS5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyO1xuICAgIHJldHVybiBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyR2V0RGVzaXJlZFNpemUocmVhZGFibGVDb250cm9sbGVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbnF1ZXVlcyB0aGUgZ2l2ZW4gY2h1bmsgYGNodW5rYCBpbiB0aGUgcmVhZGFibGUgc2lkZSBvZiB0aGUgY29udHJvbGxlZCB0cmFuc2Zvcm0gc3RyZWFtLlxuICAgKi9cbiAgZW5xdWV1ZShjaHVuazogTyk6IHZvaWQ7XG4gIGVucXVldWUoY2h1bms6IE8gPSB1bmRlZmluZWQhKTogdm9pZCB7XG4gICAgaWYgKCFJc1RyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyKHRoaXMpKSB7XG4gICAgICB0aHJvdyBkZWZhdWx0Q29udHJvbGxlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ2VucXVldWUnKTtcbiAgICB9XG5cbiAgICBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlckVucXVldWUodGhpcywgY2h1bmspO1xuICB9XG5cbiAgLyoqXG4gICAqIEVycm9ycyBib3RoIHRoZSByZWFkYWJsZSBzaWRlIGFuZCB0aGUgd3JpdGFibGUgc2lkZSBvZiB0aGUgY29udHJvbGxlZCB0cmFuc2Zvcm0gc3RyZWFtLCBtYWtpbmcgYWxsIGZ1dHVyZVxuICAgKiBpbnRlcmFjdGlvbnMgd2l0aCBpdCBmYWlsIHdpdGggdGhlIGdpdmVuIGVycm9yIGBlYC4gQW55IGNodW5rcyBxdWV1ZWQgZm9yIHRyYW5zZm9ybWF0aW9uIHdpbGwgYmUgZGlzY2FyZGVkLlxuICAgKi9cbiAgZXJyb3IocmVhc29uOiBhbnkgPSB1bmRlZmluZWQpOiB2b2lkIHtcbiAgICBpZiAoIUlzVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIodGhpcykpIHtcbiAgICAgIHRocm93IGRlZmF1bHRDb250cm9sbGVyQnJhbmRDaGVja0V4Y2VwdGlvbignZXJyb3InKTtcbiAgICB9XG5cbiAgICBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlckVycm9yKHRoaXMsIHJlYXNvbik7XG4gIH1cblxuICAvKipcbiAgICogQ2xvc2VzIHRoZSByZWFkYWJsZSBzaWRlIGFuZCBlcnJvcnMgdGhlIHdyaXRhYmxlIHNpZGUgb2YgdGhlIGNvbnRyb2xsZWQgdHJhbnNmb3JtIHN0cmVhbS4gVGhpcyBpcyB1c2VmdWwgd2hlbiB0aGVcbiAgICogdHJhbnNmb3JtZXIgb25seSBuZWVkcyB0byBjb25zdW1lIGEgcG9ydGlvbiBvZiB0aGUgY2h1bmtzIHdyaXR0ZW4gdG8gdGhlIHdyaXRhYmxlIHNpZGUuXG4gICAqL1xuICB0ZXJtaW5hdGUoKTogdm9pZCB7XG4gICAgaWYgKCFJc1RyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyKHRoaXMpKSB7XG4gICAgICB0aHJvdyBkZWZhdWx0Q29udHJvbGxlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ3Rlcm1pbmF0ZScpO1xuICAgIH1cblxuICAgIFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyVGVybWluYXRlKHRoaXMpO1xuICB9XG59XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyLnByb3RvdHlwZSwge1xuICBlbnF1ZXVlOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgZXJyb3I6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICB0ZXJtaW5hdGU6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICBkZXNpcmVkU2l6ZTogeyBlbnVtZXJhYmxlOiB0cnVlIH1cbn0pO1xuc2V0RnVuY3Rpb25OYW1lKFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyLnByb3RvdHlwZS5lbnF1ZXVlLCAnZW5xdWV1ZScpO1xuc2V0RnVuY3Rpb25OYW1lKFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyLnByb3RvdHlwZS5lcnJvciwgJ2Vycm9yJyk7XG5zZXRGdW5jdGlvbk5hbWUoVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIucHJvdG90eXBlLnRlcm1pbmF0ZSwgJ3Rlcm1pbmF0ZScpO1xuaWYgKHR5cGVvZiBTeW1ib2wudG9TdHJpbmdUYWcgPT09ICdzeW1ib2wnKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlci5wcm90b3R5cGUsIFN5bWJvbC50b1N0cmluZ1RhZywge1xuICAgIHZhbHVlOiAnVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXInLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbn1cblxuLy8gVHJhbnNmb3JtIFN0cmVhbSBEZWZhdWx0IENvbnRyb2xsZXIgQWJzdHJhY3QgT3BlcmF0aW9uc1xuXG5mdW5jdGlvbiBJc1RyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyPE8gPSBhbnk+KHg6IGFueSk6IHggaXMgVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8Tz4ge1xuICBpZiAoIXR5cGVJc09iamVjdCh4KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHgsICdfY29udHJvbGxlZFRyYW5zZm9ybVN0cmVhbScpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHggaW5zdGFuY2VvZiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlcjtcbn1cblxuZnVuY3Rpb24gU2V0VXBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxJLCBPPihzdHJlYW06IFRyYW5zZm9ybVN0cmVhbTxJLCBPPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8Tz4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybUFsZ29yaXRobTogKGNodW5rOiBJKSA9PiBQcm9taXNlPHZvaWQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbHVzaEFsZ29yaXRobTogKCkgPT4gUHJvbWlzZTx2b2lkPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuY2VsQWxnb3JpdGhtOiAocmVhc29uOiBhbnkpID0+IFByb21pc2U8dm9pZD4pIHtcbiAgYXNzZXJ0KElzVHJhbnNmb3JtU3RyZWFtKHN0cmVhbSkpO1xuICBhc3NlcnQoc3RyZWFtLl90cmFuc2Zvcm1TdHJlYW1Db250cm9sbGVyID09PSB1bmRlZmluZWQpO1xuXG4gIGNvbnRyb2xsZXIuX2NvbnRyb2xsZWRUcmFuc2Zvcm1TdHJlYW0gPSBzdHJlYW07XG4gIHN0cmVhbS5fdHJhbnNmb3JtU3RyZWFtQ29udHJvbGxlciA9IGNvbnRyb2xsZXI7XG5cbiAgY29udHJvbGxlci5fdHJhbnNmb3JtQWxnb3JpdGhtID0gdHJhbnNmb3JtQWxnb3JpdGhtO1xuICBjb250cm9sbGVyLl9mbHVzaEFsZ29yaXRobSA9IGZsdXNoQWxnb3JpdGhtO1xuICBjb250cm9sbGVyLl9jYW5jZWxBbGdvcml0aG0gPSBjYW5jZWxBbGdvcml0aG07XG5cbiAgY29udHJvbGxlci5fZmluaXNoUHJvbWlzZSA9IHVuZGVmaW5lZDtcbiAgY29udHJvbGxlci5fZmluaXNoUHJvbWlzZV9yZXNvbHZlID0gdW5kZWZpbmVkO1xuICBjb250cm9sbGVyLl9maW5pc2hQcm9taXNlX3JlamVjdCA9IHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gU2V0VXBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlckZyb21UcmFuc2Zvcm1lcjxJLCBPPihzdHJlYW06IFRyYW5zZm9ybVN0cmVhbTxJLCBPPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtZXI6IFZhbGlkYXRlZFRyYW5zZm9ybWVyPEksIE8+KSB7XG4gIGNvbnN0IGNvbnRyb2xsZXI6IFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyPE8+ID0gT2JqZWN0LmNyZWF0ZShUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlci5wcm90b3R5cGUpO1xuXG4gIGxldCB0cmFuc2Zvcm1BbGdvcml0aG06IChjaHVuazogSSkgPT4gUHJvbWlzZTx2b2lkPjtcbiAgbGV0IGZsdXNoQWxnb3JpdGhtOiAoKSA9PiBQcm9taXNlPHZvaWQ+O1xuICBsZXQgY2FuY2VsQWxnb3JpdGhtOiAocmVhc29uOiBhbnkpID0+IFByb21pc2U8dm9pZD47XG5cbiAgaWYgKHRyYW5zZm9ybWVyLnRyYW5zZm9ybSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdHJhbnNmb3JtQWxnb3JpdGhtID0gY2h1bmsgPT4gdHJhbnNmb3JtZXIudHJhbnNmb3JtIShjaHVuaywgY29udHJvbGxlcik7XG4gIH0gZWxzZSB7XG4gICAgdHJhbnNmb3JtQWxnb3JpdGhtID0gY2h1bmsgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFbnF1ZXVlKGNvbnRyb2xsZXIsIGNodW5rIGFzIHVua25vd24gYXMgTyk7XG4gICAgICAgIHJldHVybiBwcm9taXNlUmVzb2x2ZWRXaXRoKHVuZGVmaW5lZCk7XG4gICAgICB9IGNhdGNoICh0cmFuc2Zvcm1SZXN1bHRFKSB7XG4gICAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKHRyYW5zZm9ybVJlc3VsdEUpO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBpZiAodHJhbnNmb3JtZXIuZmx1c2ggIT09IHVuZGVmaW5lZCkge1xuICAgIGZsdXNoQWxnb3JpdGhtID0gKCkgPT4gdHJhbnNmb3JtZXIuZmx1c2ghKGNvbnRyb2xsZXIpO1xuICB9IGVsc2Uge1xuICAgIGZsdXNoQWxnb3JpdGhtID0gKCkgPT4gcHJvbWlzZVJlc29sdmVkV2l0aCh1bmRlZmluZWQpO1xuICB9XG5cbiAgaWYgKHRyYW5zZm9ybWVyLmNhbmNlbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgY2FuY2VsQWxnb3JpdGhtID0gcmVhc29uID0+IHRyYW5zZm9ybWVyLmNhbmNlbCEocmVhc29uKTtcbiAgfSBlbHNlIHtcbiAgICBjYW5jZWxBbGdvcml0aG0gPSAoKSA9PiBwcm9taXNlUmVzb2x2ZWRXaXRoKHVuZGVmaW5lZCk7XG4gIH1cblxuICBTZXRVcFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyKHN0cmVhbSwgY29udHJvbGxlciwgdHJhbnNmb3JtQWxnb3JpdGhtLCBmbHVzaEFsZ29yaXRobSwgY2FuY2VsQWxnb3JpdGhtKTtcbn1cblxuZnVuY3Rpb24gVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDbGVhckFsZ29yaXRobXMoY29udHJvbGxlcjogVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8YW55Pikge1xuICBjb250cm9sbGVyLl90cmFuc2Zvcm1BbGdvcml0aG0gPSB1bmRlZmluZWQhO1xuICBjb250cm9sbGVyLl9mbHVzaEFsZ29yaXRobSA9IHVuZGVmaW5lZCE7XG4gIGNvbnRyb2xsZXIuX2NhbmNlbEFsZ29yaXRobSA9IHVuZGVmaW5lZCE7XG59XG5cbmZ1bmN0aW9uIFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyRW5xdWV1ZTxPPihjb250cm9sbGVyOiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxPPiwgY2h1bms6IE8pIHtcbiAgY29uc3Qgc3RyZWFtID0gY29udHJvbGxlci5fY29udHJvbGxlZFRyYW5zZm9ybVN0cmVhbTtcbiAgY29uc3QgcmVhZGFibGVDb250cm9sbGVyID0gc3RyZWFtLl9yZWFkYWJsZS5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyO1xuICBpZiAoIVJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDYW5DbG9zZU9yRW5xdWV1ZShyZWFkYWJsZUNvbnRyb2xsZXIpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignUmVhZGFibGUgc2lkZSBpcyBub3QgaW4gYSBzdGF0ZSB0aGF0IHBlcm1pdHMgZW5xdWV1ZScpO1xuICB9XG5cbiAgLy8gV2UgdGhyb3R0bGUgdHJhbnNmb3JtIGludm9jYXRpb25zIGJhc2VkIG9uIHRoZSBiYWNrcHJlc3N1cmUgb2YgdGhlIFJlYWRhYmxlU3RyZWFtLCBidXQgd2Ugc3RpbGxcbiAgLy8gYWNjZXB0IFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyRW5xdWV1ZSgpIGNhbGxzLlxuXG4gIHRyeSB7XG4gICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVucXVldWUocmVhZGFibGVDb250cm9sbGVyLCBjaHVuayk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyBUaGlzIGhhcHBlbnMgd2hlbiByZWFkYWJsZVN0cmF0ZWd5LnNpemUoKSB0aHJvd3MuXG4gICAgVHJhbnNmb3JtU3RyZWFtRXJyb3JXcml0YWJsZUFuZFVuYmxvY2tXcml0ZShzdHJlYW0sIGUpO1xuXG4gICAgdGhyb3cgc3RyZWFtLl9yZWFkYWJsZS5fc3RvcmVkRXJyb3I7XG4gIH1cblxuICBjb25zdCBiYWNrcHJlc3N1cmUgPSBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVySGFzQmFja3ByZXNzdXJlKHJlYWRhYmxlQ29udHJvbGxlcik7XG4gIGlmIChiYWNrcHJlc3N1cmUgIT09IHN0cmVhbS5fYmFja3ByZXNzdXJlKSB7XG4gICAgYXNzZXJ0KGJhY2twcmVzc3VyZSk7XG4gICAgVHJhbnNmb3JtU3RyZWFtU2V0QmFja3ByZXNzdXJlKHN0cmVhbSwgdHJ1ZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFcnJvcihjb250cm9sbGVyOiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxhbnk+LCBlOiBhbnkpIHtcbiAgVHJhbnNmb3JtU3RyZWFtRXJyb3IoY29udHJvbGxlci5fY29udHJvbGxlZFRyYW5zZm9ybVN0cmVhbSwgZSk7XG59XG5cbmZ1bmN0aW9uIFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyUGVyZm9ybVRyYW5zZm9ybTxJLCBPPihjb250cm9sbGVyOiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxPPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaHVuazogSSkge1xuICBjb25zdCB0cmFuc2Zvcm1Qcm9taXNlID0gY29udHJvbGxlci5fdHJhbnNmb3JtQWxnb3JpdGhtKGNodW5rKTtcbiAgcmV0dXJuIHRyYW5zZm9ybVByb21pc2VXaXRoKHRyYW5zZm9ybVByb21pc2UsIHVuZGVmaW5lZCwgciA9PiB7XG4gICAgVHJhbnNmb3JtU3RyZWFtRXJyb3IoY29udHJvbGxlci5fY29udHJvbGxlZFRyYW5zZm9ybVN0cmVhbSwgcik7XG4gICAgdGhyb3cgcjtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyVGVybWluYXRlPE8+KGNvbnRyb2xsZXI6IFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyPE8+KSB7XG4gIGNvbnN0IHN0cmVhbSA9IGNvbnRyb2xsZXIuX2NvbnRyb2xsZWRUcmFuc2Zvcm1TdHJlYW07XG4gIGNvbnN0IHJlYWRhYmxlQ29udHJvbGxlciA9IHN0cmVhbS5fcmVhZGFibGUuX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlcjtcblxuICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2xvc2UocmVhZGFibGVDb250cm9sbGVyKTtcblxuICBjb25zdCBlcnJvciA9IG5ldyBUeXBlRXJyb3IoJ1RyYW5zZm9ybVN0cmVhbSB0ZXJtaW5hdGVkJyk7XG4gIFRyYW5zZm9ybVN0cmVhbUVycm9yV3JpdGFibGVBbmRVbmJsb2NrV3JpdGUoc3RyZWFtLCBlcnJvcik7XG59XG5cbi8vIFRyYW5zZm9ybVN0cmVhbURlZmF1bHRTaW5rIEFsZ29yaXRobXNcblxuZnVuY3Rpb24gVHJhbnNmb3JtU3RyZWFtRGVmYXVsdFNpbmtXcml0ZUFsZ29yaXRobTxJLCBPPihzdHJlYW06IFRyYW5zZm9ybVN0cmVhbTxJLCBPPiwgY2h1bms6IEkpOiBQcm9taXNlPHZvaWQ+IHtcbiAgYXNzZXJ0KHN0cmVhbS5fd3JpdGFibGUuX3N0YXRlID09PSAnd3JpdGFibGUnKTtcblxuICBjb25zdCBjb250cm9sbGVyID0gc3RyZWFtLl90cmFuc2Zvcm1TdHJlYW1Db250cm9sbGVyO1xuXG4gIGlmIChzdHJlYW0uX2JhY2twcmVzc3VyZSkge1xuICAgIGNvbnN0IGJhY2twcmVzc3VyZUNoYW5nZVByb21pc2UgPSBzdHJlYW0uX2JhY2twcmVzc3VyZUNoYW5nZVByb21pc2U7XG4gICAgYXNzZXJ0KGJhY2twcmVzc3VyZUNoYW5nZVByb21pc2UgIT09IHVuZGVmaW5lZCk7XG4gICAgcmV0dXJuIHRyYW5zZm9ybVByb21pc2VXaXRoKGJhY2twcmVzc3VyZUNoYW5nZVByb21pc2UsICgpID0+IHtcbiAgICAgIGNvbnN0IHdyaXRhYmxlID0gc3RyZWFtLl93cml0YWJsZTtcbiAgICAgIGNvbnN0IHN0YXRlID0gd3JpdGFibGUuX3N0YXRlO1xuICAgICAgaWYgKHN0YXRlID09PSAnZXJyb3JpbmcnKSB7XG4gICAgICAgIHRocm93IHdyaXRhYmxlLl9zdG9yZWRFcnJvcjtcbiAgICAgIH1cbiAgICAgIGFzc2VydChzdGF0ZSA9PT0gJ3dyaXRhYmxlJyk7XG4gICAgICByZXR1cm4gVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJQZXJmb3JtVHJhbnNmb3JtPEksIE8+KGNvbnRyb2xsZXIsIGNodW5rKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlclBlcmZvcm1UcmFuc2Zvcm08SSwgTz4oY29udHJvbGxlciwgY2h1bmspO1xufVxuXG5mdW5jdGlvbiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0U2lua0Fib3J0QWxnb3JpdGhtPEksIE8+KHN0cmVhbTogVHJhbnNmb3JtU3RyZWFtPEksIE8+LCByZWFzb246IGFueSk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBjb250cm9sbGVyID0gc3RyZWFtLl90cmFuc2Zvcm1TdHJlYW1Db250cm9sbGVyO1xuICBpZiAoY29udHJvbGxlci5fZmluaXNoUHJvbWlzZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGNvbnRyb2xsZXIuX2ZpbmlzaFByb21pc2U7XG4gIH1cblxuICAvLyBzdHJlYW0uX3JlYWRhYmxlIGNhbm5vdCBjaGFuZ2UgYWZ0ZXIgY29uc3RydWN0aW9uLCBzbyBjYWNoaW5nIGl0IGFjcm9zcyBhIGNhbGwgdG8gdXNlciBjb2RlIGlzIHNhZmUuXG4gIGNvbnN0IHJlYWRhYmxlID0gc3RyZWFtLl9yZWFkYWJsZTtcblxuICAvLyBBc3NpZ24gdGhlIF9maW5pc2hQcm9taXNlIG5vdyBzbyB0aGF0IGlmIF9jYW5jZWxBbGdvcml0aG0gY2FsbHMgcmVhZGFibGUuY2FuY2VsKCkgaW50ZXJuYWxseSxcbiAgLy8gd2UgZG9uJ3QgcnVuIHRoZSBfY2FuY2VsQWxnb3JpdGhtIGFnYWluLlxuICBjb250cm9sbGVyLl9maW5pc2hQcm9taXNlID0gbmV3UHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29udHJvbGxlci5fZmluaXNoUHJvbWlzZV9yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICBjb250cm9sbGVyLl9maW5pc2hQcm9taXNlX3JlamVjdCA9IHJlamVjdDtcbiAgfSk7XG5cbiAgY29uc3QgY2FuY2VsUHJvbWlzZSA9IGNvbnRyb2xsZXIuX2NhbmNlbEFsZ29yaXRobShyZWFzb24pO1xuICBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlckNsZWFyQWxnb3JpdGhtcyhjb250cm9sbGVyKTtcblxuICB1cG9uUHJvbWlzZShjYW5jZWxQcm9taXNlLCAoKSA9PiB7XG4gICAgaWYgKHJlYWRhYmxlLl9zdGF0ZSA9PT0gJ2Vycm9yZWQnKSB7XG4gICAgICBkZWZhdWx0Q29udHJvbGxlckZpbmlzaFByb21pc2VSZWplY3QoY29udHJvbGxlciwgcmVhZGFibGUuX3N0b3JlZEVycm9yKTtcbiAgICB9IGVsc2Uge1xuICAgICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVycm9yKHJlYWRhYmxlLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIsIHJlYXNvbik7XG4gICAgICBkZWZhdWx0Q29udHJvbGxlckZpbmlzaFByb21pc2VSZXNvbHZlKGNvbnRyb2xsZXIpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfSwgciA9PiB7XG4gICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVycm9yKHJlYWRhYmxlLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIsIHIpO1xuICAgIGRlZmF1bHRDb250cm9sbGVyRmluaXNoUHJvbWlzZVJlamVjdChjb250cm9sbGVyLCByKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfSk7XG5cbiAgcmV0dXJuIGNvbnRyb2xsZXIuX2ZpbmlzaFByb21pc2U7XG59XG5cbmZ1bmN0aW9uIFRyYW5zZm9ybVN0cmVhbURlZmF1bHRTaW5rQ2xvc2VBbGdvcml0aG08SSwgTz4oc3RyZWFtOiBUcmFuc2Zvcm1TdHJlYW08SSwgTz4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgY29udHJvbGxlciA9IHN0cmVhbS5fdHJhbnNmb3JtU3RyZWFtQ29udHJvbGxlcjtcbiAgaWYgKGNvbnRyb2xsZXIuX2ZpbmlzaFByb21pc2UgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBjb250cm9sbGVyLl9maW5pc2hQcm9taXNlO1xuICB9XG5cbiAgLy8gc3RyZWFtLl9yZWFkYWJsZSBjYW5ub3QgY2hhbmdlIGFmdGVyIGNvbnN0cnVjdGlvbiwgc28gY2FjaGluZyBpdCBhY3Jvc3MgYSBjYWxsIHRvIHVzZXIgY29kZSBpcyBzYWZlLlxuICBjb25zdCByZWFkYWJsZSA9IHN0cmVhbS5fcmVhZGFibGU7XG5cbiAgLy8gQXNzaWduIHRoZSBfZmluaXNoUHJvbWlzZSBub3cgc28gdGhhdCBpZiBfZmx1c2hBbGdvcml0aG0gY2FsbHMgcmVhZGFibGUuY2FuY2VsKCkgaW50ZXJuYWxseSxcbiAgLy8gd2UgZG9uJ3QgYWxzbyBydW4gdGhlIF9jYW5jZWxBbGdvcml0aG0uXG4gIGNvbnRyb2xsZXIuX2ZpbmlzaFByb21pc2UgPSBuZXdQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb250cm9sbGVyLl9maW5pc2hQcm9taXNlX3Jlc29sdmUgPSByZXNvbHZlO1xuICAgIGNvbnRyb2xsZXIuX2ZpbmlzaFByb21pc2VfcmVqZWN0ID0gcmVqZWN0O1xuICB9KTtcblxuICBjb25zdCBmbHVzaFByb21pc2UgPSBjb250cm9sbGVyLl9mbHVzaEFsZ29yaXRobSgpO1xuICBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlckNsZWFyQWxnb3JpdGhtcyhjb250cm9sbGVyKTtcblxuICB1cG9uUHJvbWlzZShmbHVzaFByb21pc2UsICgpID0+IHtcbiAgICBpZiAocmVhZGFibGUuX3N0YXRlID09PSAnZXJyb3JlZCcpIHtcbiAgICAgIGRlZmF1bHRDb250cm9sbGVyRmluaXNoUHJvbWlzZVJlamVjdChjb250cm9sbGVyLCByZWFkYWJsZS5fc3RvcmVkRXJyb3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2xvc2UocmVhZGFibGUuX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlcik7XG4gICAgICBkZWZhdWx0Q29udHJvbGxlckZpbmlzaFByb21pc2VSZXNvbHZlKGNvbnRyb2xsZXIpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfSwgciA9PiB7XG4gICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVycm9yKHJlYWRhYmxlLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIsIHIpO1xuICAgIGRlZmF1bHRDb250cm9sbGVyRmluaXNoUHJvbWlzZVJlamVjdChjb250cm9sbGVyLCByKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfSk7XG5cbiAgcmV0dXJuIGNvbnRyb2xsZXIuX2ZpbmlzaFByb21pc2U7XG59XG5cbi8vIFRyYW5zZm9ybVN0cmVhbURlZmF1bHRTb3VyY2UgQWxnb3JpdGhtc1xuXG5mdW5jdGlvbiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0U291cmNlUHVsbEFsZ29yaXRobShzdHJlYW06IFRyYW5zZm9ybVN0cmVhbSk6IFByb21pc2U8dm9pZD4ge1xuICAvLyBJbnZhcmlhbnQuIEVuZm9yY2VkIGJ5IHRoZSBwcm9taXNlcyByZXR1cm5lZCBieSBzdGFydCgpIGFuZCBwdWxsKCkuXG4gIGFzc2VydChzdHJlYW0uX2JhY2twcmVzc3VyZSk7XG5cbiAgYXNzZXJ0KHN0cmVhbS5fYmFja3ByZXNzdXJlQ2hhbmdlUHJvbWlzZSAhPT0gdW5kZWZpbmVkKTtcblxuICBUcmFuc2Zvcm1TdHJlYW1TZXRCYWNrcHJlc3N1cmUoc3RyZWFtLCBmYWxzZSk7XG5cbiAgLy8gUHJldmVudCB0aGUgbmV4dCBwdWxsKCkgY2FsbCB1bnRpbCB0aGVyZSBpcyBiYWNrcHJlc3N1cmUuXG4gIHJldHVybiBzdHJlYW0uX2JhY2twcmVzc3VyZUNoYW5nZVByb21pc2U7XG59XG5cbmZ1bmN0aW9uIFRyYW5zZm9ybVN0cmVhbURlZmF1bHRTb3VyY2VDYW5jZWxBbGdvcml0aG08SSwgTz4oc3RyZWFtOiBUcmFuc2Zvcm1TdHJlYW08SSwgTz4sIHJlYXNvbjogYW55KTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGNvbnRyb2xsZXIgPSBzdHJlYW0uX3RyYW5zZm9ybVN0cmVhbUNvbnRyb2xsZXI7XG4gIGlmIChjb250cm9sbGVyLl9maW5pc2hQcm9taXNlICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gY29udHJvbGxlci5fZmluaXNoUHJvbWlzZTtcbiAgfVxuXG4gIC8vIHN0cmVhbS5fd3JpdGFibGUgY2Fubm90IGNoYW5nZSBhZnRlciBjb25zdHJ1Y3Rpb24sIHNvIGNhY2hpbmcgaXQgYWNyb3NzIGEgY2FsbCB0byB1c2VyIGNvZGUgaXMgc2FmZS5cbiAgY29uc3Qgd3JpdGFibGUgPSBzdHJlYW0uX3dyaXRhYmxlO1xuXG4gIC8vIEFzc2lnbiB0aGUgX2ZpbmlzaFByb21pc2Ugbm93IHNvIHRoYXQgaWYgX2ZsdXNoQWxnb3JpdGhtIGNhbGxzIHdyaXRhYmxlLmFib3J0KCkgb3JcbiAgLy8gd3JpdGFibGUuY2FuY2VsKCkgaW50ZXJuYWxseSwgd2UgZG9uJ3QgcnVuIHRoZSBfY2FuY2VsQWxnb3JpdGhtIGFnYWluLCBvciBhbHNvIHJ1biB0aGVcbiAgLy8gX2ZsdXNoQWxnb3JpdGhtLlxuICBjb250cm9sbGVyLl9maW5pc2hQcm9taXNlID0gbmV3UHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29udHJvbGxlci5fZmluaXNoUHJvbWlzZV9yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICBjb250cm9sbGVyLl9maW5pc2hQcm9taXNlX3JlamVjdCA9IHJlamVjdDtcbiAgfSk7XG5cbiAgY29uc3QgY2FuY2VsUHJvbWlzZSA9IGNvbnRyb2xsZXIuX2NhbmNlbEFsZ29yaXRobShyZWFzb24pO1xuICBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlckNsZWFyQWxnb3JpdGhtcyhjb250cm9sbGVyKTtcblxuICB1cG9uUHJvbWlzZShjYW5jZWxQcm9taXNlLCAoKSA9PiB7XG4gICAgaWYgKHdyaXRhYmxlLl9zdGF0ZSA9PT0gJ2Vycm9yZWQnKSB7XG4gICAgICBkZWZhdWx0Q29udHJvbGxlckZpbmlzaFByb21pc2VSZWplY3QoY29udHJvbGxlciwgd3JpdGFibGUuX3N0b3JlZEVycm9yKTtcbiAgICB9IGVsc2Uge1xuICAgICAgV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVycm9ySWZOZWVkZWQod3JpdGFibGUuX3dyaXRhYmxlU3RyZWFtQ29udHJvbGxlciwgcmVhc29uKTtcbiAgICAgIFRyYW5zZm9ybVN0cmVhbVVuYmxvY2tXcml0ZShzdHJlYW0pO1xuICAgICAgZGVmYXVsdENvbnRyb2xsZXJGaW5pc2hQcm9taXNlUmVzb2x2ZShjb250cm9sbGVyKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH0sIHIgPT4ge1xuICAgIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFcnJvcklmTmVlZGVkKHdyaXRhYmxlLl93cml0YWJsZVN0cmVhbUNvbnRyb2xsZXIsIHIpO1xuICAgIFRyYW5zZm9ybVN0cmVhbVVuYmxvY2tXcml0ZShzdHJlYW0pO1xuICAgIGRlZmF1bHRDb250cm9sbGVyRmluaXNoUHJvbWlzZVJlamVjdChjb250cm9sbGVyLCByKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfSk7XG5cbiAgcmV0dXJuIGNvbnRyb2xsZXIuX2ZpbmlzaFByb21pc2U7XG59XG5cbi8vIEhlbHBlciBmdW5jdGlvbnMgZm9yIHRoZSBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlci5cblxuZnVuY3Rpb24gZGVmYXVsdENvbnRyb2xsZXJCcmFuZENoZWNrRXhjZXB0aW9uKG5hbWU6IHN0cmluZyk6IFR5cGVFcnJvciB7XG4gIHJldHVybiBuZXcgVHlwZUVycm9yKFxuICAgIGBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlci5wcm90b3R5cGUuJHtuYW1lfSBjYW4gb25seSBiZSB1c2VkIG9uIGEgVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRDb250cm9sbGVyRmluaXNoUHJvbWlzZVJlc29sdmUoY29udHJvbGxlcjogVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8YW55Pikge1xuICBpZiAoY29udHJvbGxlci5fZmluaXNoUHJvbWlzZV9yZXNvbHZlID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb250cm9sbGVyLl9maW5pc2hQcm9taXNlX3Jlc29sdmUoKTtcbiAgY29udHJvbGxlci5fZmluaXNoUHJvbWlzZV9yZXNvbHZlID0gdW5kZWZpbmVkO1xuICBjb250cm9sbGVyLl9maW5pc2hQcm9taXNlX3JlamVjdCA9IHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRDb250cm9sbGVyRmluaXNoUHJvbWlzZVJlamVjdChjb250cm9sbGVyOiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxhbnk+LCByZWFzb246IGFueSkge1xuICBpZiAoY29udHJvbGxlci5fZmluaXNoUHJvbWlzZV9yZWplY3QgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHNldFByb21pc2VJc0hhbmRsZWRUb1RydWUoY29udHJvbGxlci5fZmluaXNoUHJvbWlzZSEpO1xuICBjb250cm9sbGVyLl9maW5pc2hQcm9taXNlX3JlamVjdChyZWFzb24pO1xuICBjb250cm9sbGVyLl9maW5pc2hQcm9taXNlX3Jlc29sdmUgPSB1bmRlZmluZWQ7XG4gIGNvbnRyb2xsZXIuX2ZpbmlzaFByb21pc2VfcmVqZWN0ID0gdW5kZWZpbmVkO1xufVxuXG4vLyBIZWxwZXIgZnVuY3Rpb25zIGZvciB0aGUgVHJhbnNmb3JtU3RyZWFtLlxuXG5mdW5jdGlvbiBzdHJlYW1CcmFuZENoZWNrRXhjZXB0aW9uKG5hbWU6IHN0cmluZyk6IFR5cGVFcnJvciB7XG4gIHJldHVybiBuZXcgVHlwZUVycm9yKFxuICAgIGBUcmFuc2Zvcm1TdHJlYW0ucHJvdG90eXBlLiR7bmFtZX0gY2FuIG9ubHkgYmUgdXNlZCBvbiBhIFRyYW5zZm9ybVN0cmVhbWApO1xufVxuIiwgIi8qIGM4IGlnbm9yZSBzdGFydCAqL1xuLy8gNjQgS2lCIChzYW1lIHNpemUgY2hyb21lIHNsaWNlIHRoZWlycyBibG9iIGludG8gVWludDhhcnJheSdzKVxuY29uc3QgUE9PTF9TSVpFID0gNjU1MzZcblxuaWYgKCFnbG9iYWxUaGlzLlJlYWRhYmxlU3RyZWFtKSB7XG4gIC8vIGBub2RlOnN0cmVhbS93ZWJgIGdvdCBpbnRyb2R1Y2VkIGluIHYxNi41LjAgYXMgZXhwZXJpbWVudGFsXG4gIC8vIGFuZCBpdCdzIHByZWZlcnJlZCBvdmVyIHRoZSBwb2x5ZmlsbGVkIHZlcnNpb24uIFNvIHdlIGFsc29cbiAgLy8gc3VwcHJlc3MgdGhlIHdhcm5pbmcgdGhhdCBnZXRzIGVtaXR0ZWQgYnkgTm9kZUpTIGZvciB1c2luZyBpdC5cbiAgdHJ5IHtcbiAgICBjb25zdCBwcm9jZXNzID0gcmVxdWlyZSgnbm9kZTpwcm9jZXNzJylcbiAgICBjb25zdCB7IGVtaXRXYXJuaW5nIH0gPSBwcm9jZXNzXG4gICAgdHJ5IHtcbiAgICAgIHByb2Nlc3MuZW1pdFdhcm5pbmcgPSAoKSA9PiB7fVxuICAgICAgT2JqZWN0LmFzc2lnbihnbG9iYWxUaGlzLCByZXF1aXJlKCdub2RlOnN0cmVhbS93ZWInKSlcbiAgICAgIHByb2Nlc3MuZW1pdFdhcm5pbmcgPSBlbWl0V2FybmluZ1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBwcm9jZXNzLmVtaXRXYXJuaW5nID0gZW1pdFdhcm5pbmdcbiAgICAgIHRocm93IGVycm9yXG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIC8vIGZhbGxiYWNrIHRvIHBvbHlmaWxsIGltcGxlbWVudGF0aW9uXG4gICAgT2JqZWN0LmFzc2lnbihnbG9iYWxUaGlzLCByZXF1aXJlKCd3ZWItc3RyZWFtcy1wb2x5ZmlsbC9kaXN0L3BvbnlmaWxsLmVzMjAxOC5qcycpKVxuICB9XG59XG5cbnRyeSB7XG4gIC8vIERvbid0IHVzZSBub2RlOiBwcmVmaXggZm9yIHRoaXMsIHJlcXVpcmUrbm9kZTogaXMgbm90IHN1cHBvcnRlZCB1bnRpbCBub2RlIHYxNC4xNFxuICAvLyBPbmx5IGBpbXBvcnQoKWAgY2FuIHVzZSBwcmVmaXggaW4gMTIuMjAgYW5kIGxhdGVyXG4gIGNvbnN0IHsgQmxvYiB9ID0gcmVxdWlyZSgnYnVmZmVyJylcbiAgaWYgKEJsb2IgJiYgIUJsb2IucHJvdG90eXBlLnN0cmVhbSkge1xuICAgIEJsb2IucHJvdG90eXBlLnN0cmVhbSA9IGZ1bmN0aW9uIG5hbWUgKHBhcmFtcykge1xuICAgICAgbGV0IHBvc2l0aW9uID0gMFxuICAgICAgY29uc3QgYmxvYiA9IHRoaXNcblxuICAgICAgcmV0dXJuIG5ldyBSZWFkYWJsZVN0cmVhbSh7XG4gICAgICAgIHR5cGU6ICdieXRlcycsXG4gICAgICAgIGFzeW5jIHB1bGwgKGN0cmwpIHtcbiAgICAgICAgICBjb25zdCBjaHVuayA9IGJsb2Iuc2xpY2UocG9zaXRpb24sIE1hdGgubWluKGJsb2Iuc2l6ZSwgcG9zaXRpb24gKyBQT09MX1NJWkUpKVxuICAgICAgICAgIGNvbnN0IGJ1ZmZlciA9IGF3YWl0IGNodW5rLmFycmF5QnVmZmVyKClcbiAgICAgICAgICBwb3NpdGlvbiArPSBidWZmZXIuYnl0ZUxlbmd0aFxuICAgICAgICAgIGN0cmwuZW5xdWV1ZShuZXcgVWludDhBcnJheShidWZmZXIpKVxuXG4gICAgICAgICAgaWYgKHBvc2l0aW9uID09PSBibG9iLnNpemUpIHtcbiAgICAgICAgICAgIGN0cmwuY2xvc2UoKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cbn0gY2F0Y2ggKGVycm9yKSB7fVxuLyogYzggaWdub3JlIGVuZCAqL1xuIiwgIi8qISBmZXRjaC1ibG9iLiBNSVQgTGljZW5zZS4gSmltbXkgV1x1MDBFNHJ0aW5nIDxodHRwczovL2ppbW15LndhcnRpbmcuc2Uvb3BlbnNvdXJjZT4gKi9cblxuLy8gVE9ETyAoamltbXl3YXJ0aW5nKTogaW4gdGhlIGZlYXR1cmUgdXNlIGNvbmRpdGlvbmFsIGxvYWRpbmcgd2l0aCB0b3AgbGV2ZWwgYXdhaXQgKHJlcXVpcmVzIDE0LngpXG4vLyBOb2RlIGhhcyByZWNlbnRseSBhZGRlZCB3aGF0d2cgc3RyZWFtIGludG8gY29yZVxuXG5pbXBvcnQgJy4vc3RyZWFtcy5janMnXG5cbi8vIDY0IEtpQiAoc2FtZSBzaXplIGNocm9tZSBzbGljZSB0aGVpcnMgYmxvYiBpbnRvIFVpbnQ4YXJyYXkncylcbmNvbnN0IFBPT0xfU0laRSA9IDY1NTM2XG5cbi8qKiBAcGFyYW0geyhCbG9iIHwgVWludDhBcnJheSlbXX0gcGFydHMgKi9cbmFzeW5jIGZ1bmN0aW9uICogdG9JdGVyYXRvciAocGFydHMsIGNsb25lID0gdHJ1ZSkge1xuICBmb3IgKGNvbnN0IHBhcnQgb2YgcGFydHMpIHtcbiAgICBpZiAoJ3N0cmVhbScgaW4gcGFydCkge1xuICAgICAgeWllbGQgKiAoLyoqIEB0eXBlIHtBc3luY0l0ZXJhYmxlSXRlcmF0b3I8VWludDhBcnJheT59ICovIChwYXJ0LnN0cmVhbSgpKSlcbiAgICB9IGVsc2UgaWYgKEFycmF5QnVmZmVyLmlzVmlldyhwYXJ0KSkge1xuICAgICAgaWYgKGNsb25lKSB7XG4gICAgICAgIGxldCBwb3NpdGlvbiA9IHBhcnQuYnl0ZU9mZnNldFxuICAgICAgICBjb25zdCBlbmQgPSBwYXJ0LmJ5dGVPZmZzZXQgKyBwYXJ0LmJ5dGVMZW5ndGhcbiAgICAgICAgd2hpbGUgKHBvc2l0aW9uICE9PSBlbmQpIHtcbiAgICAgICAgICBjb25zdCBzaXplID0gTWF0aC5taW4oZW5kIC0gcG9zaXRpb24sIFBPT0xfU0laRSlcbiAgICAgICAgICBjb25zdCBjaHVuayA9IHBhcnQuYnVmZmVyLnNsaWNlKHBvc2l0aW9uLCBwb3NpdGlvbiArIHNpemUpXG4gICAgICAgICAgcG9zaXRpb24gKz0gY2h1bmsuYnl0ZUxlbmd0aFxuICAgICAgICAgIHlpZWxkIG5ldyBVaW50OEFycmF5KGNodW5rKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB5aWVsZCBwYXJ0XG4gICAgICB9XG4gICAgLyogYzggaWdub3JlIG5leHQgMTAgKi9cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRm9yIGJsb2JzIHRoYXQgaGF2ZSBhcnJheUJ1ZmZlciBidXQgbm8gc3RyZWFtIG1ldGhvZCAobm9kZXMgYnVmZmVyLkJsb2IpXG4gICAgICBsZXQgcG9zaXRpb24gPSAwLCBiID0gKC8qKiBAdHlwZSB7QmxvYn0gKi8gKHBhcnQpKVxuICAgICAgd2hpbGUgKHBvc2l0aW9uICE9PSBiLnNpemUpIHtcbiAgICAgICAgY29uc3QgY2h1bmsgPSBiLnNsaWNlKHBvc2l0aW9uLCBNYXRoLm1pbihiLnNpemUsIHBvc2l0aW9uICsgUE9PTF9TSVpFKSlcbiAgICAgICAgY29uc3QgYnVmZmVyID0gYXdhaXQgY2h1bmsuYXJyYXlCdWZmZXIoKVxuICAgICAgICBwb3NpdGlvbiArPSBidWZmZXIuYnl0ZUxlbmd0aFxuICAgICAgICB5aWVsZCBuZXcgVWludDhBcnJheShidWZmZXIpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmNvbnN0IF9CbG9iID0gY2xhc3MgQmxvYiB7XG4gIC8qKiBAdHlwZSB7QXJyYXkuPChCbG9ifFVpbnQ4QXJyYXkpPn0gKi9cbiAgI3BhcnRzID0gW11cbiAgI3R5cGUgPSAnJ1xuICAjc2l6ZSA9IDBcbiAgI2VuZGluZ3MgPSAndHJhbnNwYXJlbnQnXG5cbiAgLyoqXG4gICAqIFRoZSBCbG9iKCkgY29uc3RydWN0b3IgcmV0dXJucyBhIG5ldyBCbG9iIG9iamVjdC4gVGhlIGNvbnRlbnRcbiAgICogb2YgdGhlIGJsb2IgY29uc2lzdHMgb2YgdGhlIGNvbmNhdGVuYXRpb24gb2YgdGhlIHZhbHVlcyBnaXZlblxuICAgKiBpbiB0aGUgcGFyYW1ldGVyIGFycmF5LlxuICAgKlxuICAgKiBAcGFyYW0geyp9IGJsb2JQYXJ0c1xuICAgKiBAcGFyYW0ge3sgdHlwZT86IHN0cmluZywgZW5kaW5ncz86IHN0cmluZyB9fSBbb3B0aW9uc11cbiAgICovXG4gIGNvbnN0cnVjdG9yIChibG9iUGFydHMgPSBbXSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgaWYgKHR5cGVvZiBibG9iUGFydHMgIT09ICdvYmplY3QnIHx8IGJsb2JQYXJ0cyA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRmFpbGVkIHRvIGNvbnN0cnVjdCBcXCdCbG9iXFwnOiBUaGUgcHJvdmlkZWQgdmFsdWUgY2Fubm90IGJlIGNvbnZlcnRlZCB0byBhIHNlcXVlbmNlLicpXG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBibG9iUGFydHNbU3ltYm9sLml0ZXJhdG9yXSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRmFpbGVkIHRvIGNvbnN0cnVjdCBcXCdCbG9iXFwnOiBUaGUgb2JqZWN0IG11c3QgaGF2ZSBhIGNhbGxhYmxlIEBAaXRlcmF0b3IgcHJvcGVydHkuJylcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMgIT09ICdvYmplY3QnICYmIHR5cGVvZiBvcHRpb25zICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdGYWlsZWQgdG8gY29uc3RydWN0IFxcJ0Jsb2JcXCc6IHBhcmFtZXRlciAyIGNhbm5vdCBjb252ZXJ0IHRvIGRpY3Rpb25hcnkuJylcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucyA9PT0gbnVsbCkgb3B0aW9ucyA9IHt9XG5cbiAgICBjb25zdCBlbmNvZGVyID0gbmV3IFRleHRFbmNvZGVyKClcbiAgICBmb3IgKGNvbnN0IGVsZW1lbnQgb2YgYmxvYlBhcnRzKSB7XG4gICAgICBsZXQgcGFydFxuICAgICAgaWYgKEFycmF5QnVmZmVyLmlzVmlldyhlbGVtZW50KSkge1xuICAgICAgICBwYXJ0ID0gbmV3IFVpbnQ4QXJyYXkoZWxlbWVudC5idWZmZXIuc2xpY2UoZWxlbWVudC5ieXRlT2Zmc2V0LCBlbGVtZW50LmJ5dGVPZmZzZXQgKyBlbGVtZW50LmJ5dGVMZW5ndGgpKVxuICAgICAgfSBlbHNlIGlmIChlbGVtZW50IGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICAgICAgcGFydCA9IG5ldyBVaW50OEFycmF5KGVsZW1lbnQuc2xpY2UoMCkpXG4gICAgICB9IGVsc2UgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBCbG9iKSB7XG4gICAgICAgIHBhcnQgPSBlbGVtZW50XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJ0ID0gZW5jb2Rlci5lbmNvZGUoYCR7ZWxlbWVudH1gKVxuICAgICAgfVxuXG4gICAgICB0aGlzLiNzaXplICs9IEFycmF5QnVmZmVyLmlzVmlldyhwYXJ0KSA/IHBhcnQuYnl0ZUxlbmd0aCA6IHBhcnQuc2l6ZVxuICAgICAgdGhpcy4jcGFydHMucHVzaChwYXJ0KVxuICAgIH1cblxuICAgIHRoaXMuI2VuZGluZ3MgPSBgJHtvcHRpb25zLmVuZGluZ3MgPT09IHVuZGVmaW5lZCA/ICd0cmFuc3BhcmVudCcgOiBvcHRpb25zLmVuZGluZ3N9YFxuICAgIGNvbnN0IHR5cGUgPSBvcHRpb25zLnR5cGUgPT09IHVuZGVmaW5lZCA/ICcnIDogU3RyaW5nKG9wdGlvbnMudHlwZSlcbiAgICB0aGlzLiN0eXBlID0gL15bXFx4MjAtXFx4N0VdKiQvLnRlc3QodHlwZSkgPyB0eXBlIDogJydcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgQmxvYiBpbnRlcmZhY2UncyBzaXplIHByb3BlcnR5IHJldHVybnMgdGhlXG4gICAqIHNpemUgb2YgdGhlIEJsb2IgaW4gYnl0ZXMuXG4gICAqL1xuICBnZXQgc2l6ZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3NpemVcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgdHlwZSBwcm9wZXJ0eSBvZiBhIEJsb2Igb2JqZWN0IHJldHVybnMgdGhlIE1JTUUgdHlwZSBvZiB0aGUgZmlsZS5cbiAgICovXG4gIGdldCB0eXBlICgpIHtcbiAgICByZXR1cm4gdGhpcy4jdHlwZVxuICB9XG5cbiAgLyoqXG4gICAqIFRoZSB0ZXh0KCkgbWV0aG9kIGluIHRoZSBCbG9iIGludGVyZmFjZSByZXR1cm5zIGEgUHJvbWlzZVxuICAgKiB0aGF0IHJlc29sdmVzIHdpdGggYSBzdHJpbmcgY29udGFpbmluZyB0aGUgY29udGVudHMgb2ZcbiAgICogdGhlIGJsb2IsIGludGVycHJldGVkIGFzIFVURi04LlxuICAgKlxuICAgKiBAcmV0dXJuIHtQcm9taXNlPHN0cmluZz59XG4gICAqL1xuICBhc3luYyB0ZXh0ICgpIHtcbiAgICAvLyBNb3JlIG9wdGltaXplZCB0aGFuIHVzaW5nIHRoaXMuYXJyYXlCdWZmZXIoKVxuICAgIC8vIHRoYXQgcmVxdWlyZXMgdHdpY2UgYXMgbXVjaCByYW1cbiAgICBjb25zdCBkZWNvZGVyID0gbmV3IFRleHREZWNvZGVyKClcbiAgICBsZXQgc3RyID0gJydcbiAgICBmb3IgYXdhaXQgKGNvbnN0IHBhcnQgb2YgdG9JdGVyYXRvcih0aGlzLiNwYXJ0cywgZmFsc2UpKSB7XG4gICAgICBzdHIgKz0gZGVjb2Rlci5kZWNvZGUocGFydCwgeyBzdHJlYW06IHRydWUgfSlcbiAgICB9XG4gICAgLy8gUmVtYWluaW5nXG4gICAgc3RyICs9IGRlY29kZXIuZGVjb2RlKClcbiAgICByZXR1cm4gc3RyXG4gIH1cblxuICAvKipcbiAgICogVGhlIGFycmF5QnVmZmVyKCkgbWV0aG9kIGluIHRoZSBCbG9iIGludGVyZmFjZSByZXR1cm5zIGFcbiAgICogUHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggdGhlIGNvbnRlbnRzIG9mIHRoZSBibG9iIGFzXG4gICAqIGJpbmFyeSBkYXRhIGNvbnRhaW5lZCBpbiBhbiBBcnJheUJ1ZmZlci5cbiAgICpcbiAgICogQHJldHVybiB7UHJvbWlzZTxBcnJheUJ1ZmZlcj59XG4gICAqL1xuICBhc3luYyBhcnJheUJ1ZmZlciAoKSB7XG4gICAgLy8gRWFzaWVyIHdheS4uLiBKdXN0IGEgdW5uZWNlc3Nhcnkgb3ZlcmhlYWRcbiAgICAvLyBjb25zdCB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5zaXplKTtcbiAgICAvLyBhd2FpdCB0aGlzLnN0cmVhbSgpLmdldFJlYWRlcih7bW9kZTogJ2J5b2InfSkucmVhZCh2aWV3KTtcbiAgICAvLyByZXR1cm4gdmlldy5idWZmZXI7XG5cbiAgICBjb25zdCBkYXRhID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5zaXplKVxuICAgIGxldCBvZmZzZXQgPSAwXG4gICAgZm9yIGF3YWl0IChjb25zdCBjaHVuayBvZiB0b0l0ZXJhdG9yKHRoaXMuI3BhcnRzLCBmYWxzZSkpIHtcbiAgICAgIGRhdGEuc2V0KGNodW5rLCBvZmZzZXQpXG4gICAgICBvZmZzZXQgKz0gY2h1bmsubGVuZ3RoXG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGEuYnVmZmVyXG4gIH1cblxuICBzdHJlYW0gKCkge1xuICAgIGNvbnN0IGl0ID0gdG9JdGVyYXRvcih0aGlzLiNwYXJ0cywgdHJ1ZSlcblxuICAgIHJldHVybiBuZXcgZ2xvYmFsVGhpcy5SZWFkYWJsZVN0cmVhbSh7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICB0eXBlOiAnYnl0ZXMnLFxuICAgICAgYXN5bmMgcHVsbCAoY3RybCkge1xuICAgICAgICBjb25zdCBjaHVuayA9IGF3YWl0IGl0Lm5leHQoKVxuICAgICAgICBjaHVuay5kb25lID8gY3RybC5jbG9zZSgpIDogY3RybC5lbnF1ZXVlKGNodW5rLnZhbHVlKVxuICAgICAgfSxcblxuICAgICAgYXN5bmMgY2FuY2VsICgpIHtcbiAgICAgICAgYXdhaXQgaXQucmV0dXJuKClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBCbG9iIGludGVyZmFjZSdzIHNsaWNlKCkgbWV0aG9kIGNyZWF0ZXMgYW5kIHJldHVybnMgYVxuICAgKiBuZXcgQmxvYiBvYmplY3Qgd2hpY2ggY29udGFpbnMgZGF0YSBmcm9tIGEgc3Vic2V0IG9mIHRoZVxuICAgKiBibG9iIG9uIHdoaWNoIGl0J3MgY2FsbGVkLlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0XVxuICAgKiBAcGFyYW0ge251bWJlcn0gW2VuZF1cbiAgICogQHBhcmFtIHtzdHJpbmd9IFt0eXBlXVxuICAgKi9cbiAgc2xpY2UgKHN0YXJ0ID0gMCwgZW5kID0gdGhpcy5zaXplLCB0eXBlID0gJycpIHtcbiAgICBjb25zdCB7IHNpemUgfSA9IHRoaXNcblxuICAgIGxldCByZWxhdGl2ZVN0YXJ0ID0gc3RhcnQgPCAwID8gTWF0aC5tYXgoc2l6ZSArIHN0YXJ0LCAwKSA6IE1hdGgubWluKHN0YXJ0LCBzaXplKVxuICAgIGxldCByZWxhdGl2ZUVuZCA9IGVuZCA8IDAgPyBNYXRoLm1heChzaXplICsgZW5kLCAwKSA6IE1hdGgubWluKGVuZCwgc2l6ZSlcblxuICAgIGNvbnN0IHNwYW4gPSBNYXRoLm1heChyZWxhdGl2ZUVuZCAtIHJlbGF0aXZlU3RhcnQsIDApXG4gICAgY29uc3QgcGFydHMgPSB0aGlzLiNwYXJ0c1xuICAgIGNvbnN0IGJsb2JQYXJ0cyA9IFtdXG4gICAgbGV0IGFkZGVkID0gMFxuXG4gICAgZm9yIChjb25zdCBwYXJ0IG9mIHBhcnRzKSB7XG4gICAgICAvLyBkb24ndCBhZGQgdGhlIG92ZXJmbG93IHRvIG5ldyBibG9iUGFydHNcbiAgICAgIGlmIChhZGRlZCA+PSBzcGFuKSB7XG4gICAgICAgIGJyZWFrXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHNpemUgPSBBcnJheUJ1ZmZlci5pc1ZpZXcocGFydCkgPyBwYXJ0LmJ5dGVMZW5ndGggOiBwYXJ0LnNpemVcbiAgICAgIGlmIChyZWxhdGl2ZVN0YXJ0ICYmIHNpemUgPD0gcmVsYXRpdmVTdGFydCkge1xuICAgICAgICAvLyBTa2lwIHRoZSBiZWdpbm5pbmcgYW5kIGNoYW5nZSB0aGUgcmVsYXRpdmVcbiAgICAgICAgLy8gc3RhcnQgJiBlbmQgcG9zaXRpb24gYXMgd2Ugc2tpcCB0aGUgdW53YW50ZWQgcGFydHNcbiAgICAgICAgcmVsYXRpdmVTdGFydCAtPSBzaXplXG4gICAgICAgIHJlbGF0aXZlRW5kIC09IHNpemVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBjaHVua1xuICAgICAgICBpZiAoQXJyYXlCdWZmZXIuaXNWaWV3KHBhcnQpKSB7XG4gICAgICAgICAgY2h1bmsgPSBwYXJ0LnN1YmFycmF5KHJlbGF0aXZlU3RhcnQsIE1hdGgubWluKHNpemUsIHJlbGF0aXZlRW5kKSlcbiAgICAgICAgICBhZGRlZCArPSBjaHVuay5ieXRlTGVuZ3RoXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2h1bmsgPSBwYXJ0LnNsaWNlKHJlbGF0aXZlU3RhcnQsIE1hdGgubWluKHNpemUsIHJlbGF0aXZlRW5kKSlcbiAgICAgICAgICBhZGRlZCArPSBjaHVuay5zaXplXG4gICAgICAgIH1cbiAgICAgICAgcmVsYXRpdmVFbmQgLT0gc2l6ZVxuICAgICAgICBibG9iUGFydHMucHVzaChjaHVuaylcbiAgICAgICAgcmVsYXRpdmVTdGFydCA9IDAgLy8gQWxsIG5leHQgc2VxdWVudGlhbCBwYXJ0cyBzaG91bGQgc3RhcnQgYXQgMFxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGJsb2IgPSBuZXcgQmxvYihbXSwgeyB0eXBlOiBTdHJpbmcodHlwZSkudG9Mb3dlckNhc2UoKSB9KVxuICAgIGJsb2IuI3NpemUgPSBzcGFuXG4gICAgYmxvYi4jcGFydHMgPSBibG9iUGFydHNcblxuICAgIHJldHVybiBibG9iXG4gIH1cblxuICBnZXQgW1N5bWJvbC50b1N0cmluZ1RhZ10gKCkge1xuICAgIHJldHVybiAnQmxvYidcbiAgfVxuXG4gIHN0YXRpYyBbU3ltYm9sLmhhc0luc3RhbmNlXSAob2JqZWN0KSB7XG4gICAgcmV0dXJuIChcbiAgICAgIG9iamVjdCAmJlxuICAgICAgdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiZcbiAgICAgIHR5cGVvZiBvYmplY3QuY29uc3RydWN0b3IgPT09ICdmdW5jdGlvbicgJiZcbiAgICAgIChcbiAgICAgICAgdHlwZW9mIG9iamVjdC5zdHJlYW0gPT09ICdmdW5jdGlvbicgfHxcbiAgICAgICAgdHlwZW9mIG9iamVjdC5hcnJheUJ1ZmZlciA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgKSAmJlxuICAgICAgL14oQmxvYnxGaWxlKSQvLnRlc3Qob2JqZWN0W1N5bWJvbC50b1N0cmluZ1RhZ10pXG4gICAgKVxuICB9XG59XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKF9CbG9iLnByb3RvdHlwZSwge1xuICBzaXplOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgdHlwZTogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIHNsaWNlOiB7IGVudW1lcmFibGU6IHRydWUgfVxufSlcblxuLyoqIEB0eXBlIHt0eXBlb2YgZ2xvYmFsVGhpcy5CbG9ifSAqL1xuZXhwb3J0IGNvbnN0IEJsb2IgPSBfQmxvYlxuZXhwb3J0IGRlZmF1bHQgQmxvYlxuIiwgImltcG9ydCBCbG9iIGZyb20gJy4vaW5kZXguanMnXG5cbmNvbnN0IF9GaWxlID0gY2xhc3MgRmlsZSBleHRlbmRzIEJsb2Ige1xuICAjbGFzdE1vZGlmaWVkID0gMFxuICAjbmFtZSA9ICcnXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7KltdfSBmaWxlQml0c1xuICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZU5hbWVcbiAgICogQHBhcmFtIHt7bGFzdE1vZGlmaWVkPzogbnVtYmVyLCB0eXBlPzogc3RyaW5nfX0gb3B0aW9uc1xuICAgKi8vLyBAdHMtaWdub3JlXG4gIGNvbnN0cnVjdG9yIChmaWxlQml0cywgZmlsZU5hbWUsIG9wdGlvbnMgPSB7fSkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgRmFpbGVkIHRvIGNvbnN0cnVjdCAnRmlsZSc6IDIgYXJndW1lbnRzIHJlcXVpcmVkLCBidXQgb25seSAke2FyZ3VtZW50cy5sZW5ndGh9IHByZXNlbnQuYClcbiAgICB9XG4gICAgc3VwZXIoZmlsZUJpdHMsIG9wdGlvbnMpXG5cbiAgICBpZiAob3B0aW9ucyA9PT0gbnVsbCkgb3B0aW9ucyA9IHt9XG5cbiAgICAvLyBTaW11bGF0ZSBXZWJJREwgdHlwZSBjYXN0aW5nIGZvciBOYU4gdmFsdWUgaW4gbGFzdE1vZGlmaWVkIG9wdGlvbi5cbiAgICBjb25zdCBsYXN0TW9kaWZpZWQgPSBvcHRpb25zLmxhc3RNb2RpZmllZCA9PT0gdW5kZWZpbmVkID8gRGF0ZS5ub3coKSA6IE51bWJlcihvcHRpb25zLmxhc3RNb2RpZmllZClcbiAgICBpZiAoIU51bWJlci5pc05hTihsYXN0TW9kaWZpZWQpKSB7XG4gICAgICB0aGlzLiNsYXN0TW9kaWZpZWQgPSBsYXN0TW9kaWZpZWRcbiAgICB9XG5cbiAgICB0aGlzLiNuYW1lID0gU3RyaW5nKGZpbGVOYW1lKVxuICB9XG5cbiAgZ2V0IG5hbWUgKCkge1xuICAgIHJldHVybiB0aGlzLiNuYW1lXG4gIH1cblxuICBnZXQgbGFzdE1vZGlmaWVkICgpIHtcbiAgICByZXR1cm4gdGhpcy4jbGFzdE1vZGlmaWVkXG4gIH1cblxuICBnZXQgW1N5bWJvbC50b1N0cmluZ1RhZ10gKCkge1xuICAgIHJldHVybiAnRmlsZSdcbiAgfVxuXG4gIHN0YXRpYyBbU3ltYm9sLmhhc0luc3RhbmNlXSAob2JqZWN0KSB7XG4gICAgcmV0dXJuICEhb2JqZWN0ICYmIG9iamVjdCBpbnN0YW5jZW9mIEJsb2IgJiZcbiAgICAgIC9eKEZpbGUpJC8udGVzdChvYmplY3RbU3ltYm9sLnRvU3RyaW5nVGFnXSlcbiAgfVxufVxuXG4vKiogQHR5cGUge3R5cGVvZiBnbG9iYWxUaGlzLkZpbGV9ICovLy8gQHRzLWlnbm9yZVxuZXhwb3J0IGNvbnN0IEZpbGUgPSBfRmlsZVxuZXhwb3J0IGRlZmF1bHQgRmlsZVxuIiwgIi8qISBmb3JtZGF0YS1wb2x5ZmlsbC4gTUlUIExpY2Vuc2UuIEppbW15IFdcdTAwRTRydGluZyA8aHR0cHM6Ly9qaW1teS53YXJ0aW5nLnNlL29wZW5zb3VyY2U+ICovXG5cbmltcG9ydCBDIGZyb20gJ2ZldGNoLWJsb2InXG5pbXBvcnQgRiBmcm9tICdmZXRjaC1ibG9iL2ZpbGUuanMnXG5cbnZhciB7dG9TdHJpbmdUYWc6dCxpdGVyYXRvcjppLGhhc0luc3RhbmNlOmh9PVN5bWJvbCxcbnI9TWF0aC5yYW5kb20sXG5tPSdhcHBlbmQsc2V0LGdldCxnZXRBbGwsZGVsZXRlLGtleXMsdmFsdWVzLGVudHJpZXMsZm9yRWFjaCxjb25zdHJ1Y3Rvcicuc3BsaXQoJywnKSxcbmY9KGEsYixjKT0+KGErPScnLC9eKEJsb2J8RmlsZSkkLy50ZXN0KGIgJiYgYlt0XSk/WyhjPWMhPT12b2lkIDA/YysnJzpiW3RdPT0nRmlsZSc/Yi5uYW1lOidibG9iJyxhKSxiLm5hbWUhPT1jfHxiW3RdPT0nYmxvYic/bmV3IEYoW2JdLGMsYik6Yl06W2EsYisnJ10pLFxuZT0oYyxmKT0+KGY/YzpjLnJlcGxhY2UoL1xccj9cXG58XFxyL2csJ1xcclxcbicpKS5yZXBsYWNlKC9cXG4vZywnJTBBJykucmVwbGFjZSgvXFxyL2csJyUwRCcpLnJlcGxhY2UoL1wiL2csJyUyMicpLFxueD0obiwgYSwgZSk9PntpZihhLmxlbmd0aDxlKXt0aHJvdyBuZXcgVHlwZUVycm9yKGBGYWlsZWQgdG8gZXhlY3V0ZSAnJHtufScgb24gJ0Zvcm1EYXRhJzogJHtlfSBhcmd1bWVudHMgcmVxdWlyZWQsIGJ1dCBvbmx5ICR7YS5sZW5ndGh9IHByZXNlbnQuYCl9fVxuXG5leHBvcnQgY29uc3QgRmlsZSA9IEZcblxuLyoqIEB0eXBlIHt0eXBlb2YgZ2xvYmFsVGhpcy5Gb3JtRGF0YX0gKi9cbmV4cG9ydCBjb25zdCBGb3JtRGF0YSA9IGNsYXNzIEZvcm1EYXRhIHtcbiNkPVtdO1xuY29uc3RydWN0b3IoLi4uYSl7aWYoYS5sZW5ndGgpdGhyb3cgbmV3IFR5cGVFcnJvcihgRmFpbGVkIHRvIGNvbnN0cnVjdCAnRm9ybURhdGEnOiBwYXJhbWV0ZXIgMSBpcyBub3Qgb2YgdHlwZSAnSFRNTEZvcm1FbGVtZW50Jy5gKX1cbmdldCBbdF0oKSB7cmV0dXJuICdGb3JtRGF0YSd9XG5baV0oKXtyZXR1cm4gdGhpcy5lbnRyaWVzKCl9XG5zdGF0aWMgW2hdKG8pIHtyZXR1cm4gbyYmdHlwZW9mIG89PT0nb2JqZWN0JyYmb1t0XT09PSdGb3JtRGF0YScmJiFtLnNvbWUobT0+dHlwZW9mIG9bbV0hPSdmdW5jdGlvbicpfVxuYXBwZW5kKC4uLmEpe3goJ2FwcGVuZCcsYXJndW1lbnRzLDIpO3RoaXMuI2QucHVzaChmKC4uLmEpKX1cbmRlbGV0ZShhKXt4KCdkZWxldGUnLGFyZ3VtZW50cywxKTthKz0nJzt0aGlzLiNkPXRoaXMuI2QuZmlsdGVyKChbYl0pPT5iIT09YSl9XG5nZXQoYSl7eCgnZ2V0Jyxhcmd1bWVudHMsMSk7YSs9Jyc7Zm9yKHZhciBiPXRoaXMuI2QsbD1iLmxlbmd0aCxjPTA7YzxsO2MrKylpZihiW2NdWzBdPT09YSlyZXR1cm4gYltjXVsxXTtyZXR1cm4gbnVsbH1cbmdldEFsbChhLGIpe3goJ2dldEFsbCcsYXJndW1lbnRzLDEpO2I9W107YSs9Jyc7dGhpcy4jZC5mb3JFYWNoKGM9PmNbMF09PT1hJiZiLnB1c2goY1sxXSkpO3JldHVybiBifVxuaGFzKGEpe3goJ2hhcycsYXJndW1lbnRzLDEpO2ErPScnO3JldHVybiB0aGlzLiNkLnNvbWUoYj0+YlswXT09PWEpfVxuZm9yRWFjaChhLGIpe3goJ2ZvckVhY2gnLGFyZ3VtZW50cywxKTtmb3IodmFyIFtjLGRdb2YgdGhpcylhLmNhbGwoYixkLGMsdGhpcyl9XG5zZXQoLi4uYSl7eCgnc2V0Jyxhcmd1bWVudHMsMik7dmFyIGI9W10sYz0hMDthPWYoLi4uYSk7dGhpcy4jZC5mb3JFYWNoKGQ9PntkWzBdPT09YVswXT9jJiYoYz0hYi5wdXNoKGEpKTpiLnB1c2goZCl9KTtjJiZiLnB1c2goYSk7dGhpcy4jZD1ifVxuKmVudHJpZXMoKXt5aWVsZCp0aGlzLiNkfVxuKmtleXMoKXtmb3IodmFyW2Fdb2YgdGhpcyl5aWVsZCBhfVxuKnZhbHVlcygpe2Zvcih2YXJbLGFdb2YgdGhpcyl5aWVsZCBhfX1cblxuLyoqIEBwYXJhbSB7Rm9ybURhdGF9IEYgKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JtRGF0YVRvQmxvYiAoRixCPUMpe1xudmFyIGI9YCR7cigpfSR7cigpfWAucmVwbGFjZSgvXFwuL2csICcnKS5zbGljZSgtMjgpLnBhZFN0YXJ0KDMyLCAnLScpLGM9W10scD1gLS0ke2J9XFxyXFxuQ29udGVudC1EaXNwb3NpdGlvbjogZm9ybS1kYXRhOyBuYW1lPVwiYFxuRi5mb3JFYWNoKCh2LG4pPT50eXBlb2Ygdj09J3N0cmluZydcbj9jLnB1c2gocCtlKG4pK2BcIlxcclxcblxcclxcbiR7di5yZXBsYWNlKC9cXHIoPyFcXG4pfCg/PCFcXHIpXFxuL2csICdcXHJcXG4nKX1cXHJcXG5gKVxuOmMucHVzaChwK2UobikrYFwiOyBmaWxlbmFtZT1cIiR7ZSh2Lm5hbWUsIDEpfVwiXFxyXFxuQ29udGVudC1UeXBlOiAke3YudHlwZXx8XCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIn1cXHJcXG5cXHJcXG5gLCB2LCAnXFxyXFxuJykpXG5jLnB1c2goYC0tJHtifS0tYClcbnJldHVybiBuZXcgQihjLHt0eXBlOlwibXVsdGlwYXJ0L2Zvcm0tZGF0YTsgYm91bmRhcnk9XCIrYn0pfVxuIiwgIi8qISBub2RlLWRvbWV4Y2VwdGlvbi4gTUlUIExpY2Vuc2UuIEppbW15IFdcdTAwRTRydGluZyA8aHR0cHM6Ly9qaW1teS53YXJ0aW5nLnNlL29wZW5zb3VyY2U+ICovXG5cbmlmICghZ2xvYmFsVGhpcy5ET01FeGNlcHRpb24pIHtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IE1lc3NhZ2VDaGFubmVsIH0gPSByZXF1aXJlKCd3b3JrZXJfdGhyZWFkcycpLFxuICAgIHBvcnQgPSBuZXcgTWVzc2FnZUNoYW5uZWwoKS5wb3J0MSxcbiAgICBhYiA9IG5ldyBBcnJheUJ1ZmZlcigpXG4gICAgcG9ydC5wb3N0TWVzc2FnZShhYiwgW2FiLCBhYl0pXG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGVyci5jb25zdHJ1Y3Rvci5uYW1lID09PSAnRE9NRXhjZXB0aW9uJyAmJiAoXG4gICAgICBnbG9iYWxUaGlzLkRPTUV4Y2VwdGlvbiA9IGVyci5jb25zdHJ1Y3RvclxuICAgIClcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdsb2JhbFRoaXMuRE9NRXhjZXB0aW9uXG4iLCAiaW1wb3J0IHsgc3RhdFN5bmMsIGNyZWF0ZVJlYWRTdHJlYW0sIHByb21pc2VzIGFzIGZzIH0gZnJvbSAnbm9kZTpmcydcbmltcG9ydCB7IGJhc2VuYW1lIH0gZnJvbSAnbm9kZTpwYXRoJ1xuaW1wb3J0IERPTUV4Y2VwdGlvbiBmcm9tICdub2RlLWRvbWV4Y2VwdGlvbidcblxuaW1wb3J0IEZpbGUgZnJvbSAnLi9maWxlLmpzJ1xuaW1wb3J0IEJsb2IgZnJvbSAnLi9pbmRleC5qcydcblxuY29uc3QgeyBzdGF0IH0gPSBmc1xuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIGZpbGVwYXRoIG9uIHRoZSBkaXNrXG4gKiBAcGFyYW0ge3N0cmluZ30gW3R5cGVdIG1pbWV0eXBlIHRvIHVzZVxuICovXG5jb25zdCBibG9iRnJvbVN5bmMgPSAocGF0aCwgdHlwZSkgPT4gZnJvbUJsb2Ioc3RhdFN5bmMocGF0aCksIHBhdGgsIHR5cGUpXG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggZmlsZXBhdGggb24gdGhlIGRpc2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBbdHlwZV0gbWltZXR5cGUgdG8gdXNlXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxCbG9iPn1cbiAqL1xuY29uc3QgYmxvYkZyb20gPSAocGF0aCwgdHlwZSkgPT4gc3RhdChwYXRoKS50aGVuKHN0YXQgPT4gZnJvbUJsb2Ioc3RhdCwgcGF0aCwgdHlwZSkpXG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggZmlsZXBhdGggb24gdGhlIGRpc2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBbdHlwZV0gbWltZXR5cGUgdG8gdXNlXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxGaWxlPn1cbiAqL1xuY29uc3QgZmlsZUZyb20gPSAocGF0aCwgdHlwZSkgPT4gc3RhdChwYXRoKS50aGVuKHN0YXQgPT4gZnJvbUZpbGUoc3RhdCwgcGF0aCwgdHlwZSkpXG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggZmlsZXBhdGggb24gdGhlIGRpc2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBbdHlwZV0gbWltZXR5cGUgdG8gdXNlXG4gKi9cbmNvbnN0IGZpbGVGcm9tU3luYyA9IChwYXRoLCB0eXBlKSA9PiBmcm9tRmlsZShzdGF0U3luYyhwYXRoKSwgcGF0aCwgdHlwZSlcblxuLy8gQHRzLWlnbm9yZVxuY29uc3QgZnJvbUJsb2IgPSAoc3RhdCwgcGF0aCwgdHlwZSA9ICcnKSA9PiBuZXcgQmxvYihbbmV3IEJsb2JEYXRhSXRlbSh7XG4gIHBhdGgsXG4gIHNpemU6IHN0YXQuc2l6ZSxcbiAgbGFzdE1vZGlmaWVkOiBzdGF0Lm10aW1lTXMsXG4gIHN0YXJ0OiAwXG59KV0sIHsgdHlwZSB9KVxuXG4vLyBAdHMtaWdub3JlXG5jb25zdCBmcm9tRmlsZSA9IChzdGF0LCBwYXRoLCB0eXBlID0gJycpID0+IG5ldyBGaWxlKFtuZXcgQmxvYkRhdGFJdGVtKHtcbiAgcGF0aCxcbiAgc2l6ZTogc3RhdC5zaXplLFxuICBsYXN0TW9kaWZpZWQ6IHN0YXQubXRpbWVNcyxcbiAgc3RhcnQ6IDBcbn0pXSwgYmFzZW5hbWUocGF0aCksIHsgdHlwZSwgbGFzdE1vZGlmaWVkOiBzdGF0Lm10aW1lTXMgfSlcblxuLyoqXG4gKiBUaGlzIGlzIGEgYmxvYiBiYWNrZWQgdXAgYnkgYSBmaWxlIG9uIHRoZSBkaXNrXG4gKiB3aXRoIG1pbml1bSByZXF1aXJlbWVudC4gSXRzIHdyYXBwZWQgYXJvdW5kIGEgQmxvYiBhcyBhIGJsb2JQYXJ0XG4gKiBzbyB5b3UgaGF2ZSBubyBkaXJlY3QgYWNjZXNzIHRvIHRoaXMuXG4gKlxuICogQHByaXZhdGVcbiAqL1xuY2xhc3MgQmxvYkRhdGFJdGVtIHtcbiAgI3BhdGhcbiAgI3N0YXJ0XG5cbiAgY29uc3RydWN0b3IgKG9wdGlvbnMpIHtcbiAgICB0aGlzLiNwYXRoID0gb3B0aW9ucy5wYXRoXG4gICAgdGhpcy4jc3RhcnQgPSBvcHRpb25zLnN0YXJ0XG4gICAgdGhpcy5zaXplID0gb3B0aW9ucy5zaXplXG4gICAgdGhpcy5sYXN0TW9kaWZpZWQgPSBvcHRpb25zLmxhc3RNb2RpZmllZFxuICB9XG5cbiAgLyoqXG4gICAqIFNsaWNpbmcgYXJndW1lbnRzIGlzIGZpcnN0IHZhbGlkYXRlZCBhbmQgZm9ybWF0dGVkXG4gICAqIHRvIG5vdCBiZSBvdXQgb2YgcmFuZ2UgYnkgQmxvYi5wcm90b3R5cGUuc2xpY2VcbiAgICovXG4gIHNsaWNlIChzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIG5ldyBCbG9iRGF0YUl0ZW0oe1xuICAgICAgcGF0aDogdGhpcy4jcGF0aCxcbiAgICAgIGxhc3RNb2RpZmllZDogdGhpcy5sYXN0TW9kaWZpZWQsXG4gICAgICBzaXplOiBlbmQgLSBzdGFydCxcbiAgICAgIHN0YXJ0OiB0aGlzLiNzdGFydCArIHN0YXJ0XG4gICAgfSlcbiAgfVxuXG4gIGFzeW5jICogc3RyZWFtICgpIHtcbiAgICBjb25zdCB7IG10aW1lTXMgfSA9IGF3YWl0IHN0YXQodGhpcy4jcGF0aClcbiAgICBpZiAobXRpbWVNcyA+IHRoaXMubGFzdE1vZGlmaWVkKSB7XG4gICAgICB0aHJvdyBuZXcgRE9NRXhjZXB0aW9uKCdUaGUgcmVxdWVzdGVkIGZpbGUgY291bGQgbm90IGJlIHJlYWQsIHR5cGljYWxseSBkdWUgdG8gcGVybWlzc2lvbiBwcm9ibGVtcyB0aGF0IGhhdmUgb2NjdXJyZWQgYWZ0ZXIgYSByZWZlcmVuY2UgdG8gYSBmaWxlIHdhcyBhY3F1aXJlZC4nLCAnTm90UmVhZGFibGVFcnJvcicpXG4gICAgfVxuICAgIHlpZWxkICogY3JlYXRlUmVhZFN0cmVhbSh0aGlzLiNwYXRoLCB7XG4gICAgICBzdGFydDogdGhpcy4jc3RhcnQsXG4gICAgICBlbmQ6IHRoaXMuI3N0YXJ0ICsgdGhpcy5zaXplIC0gMVxuICAgIH0pXG4gIH1cblxuICBnZXQgW1N5bWJvbC50b1N0cmluZ1RhZ10gKCkge1xuICAgIHJldHVybiAnQmxvYidcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBibG9iRnJvbVN5bmNcbmV4cG9ydCB7IEZpbGUsIEJsb2IsIGJsb2JGcm9tLCBibG9iRnJvbVN5bmMsIGZpbGVGcm9tLCBmaWxlRnJvbVN5bmMgfVxuIiwgImltcG9ydCB7RmlsZX0gZnJvbSAnZmV0Y2gtYmxvYi9mcm9tLmpzJztcbmltcG9ydCB7Rm9ybURhdGF9IGZyb20gJ2Zvcm1kYXRhLXBvbHlmaWxsL2VzbS5taW4uanMnO1xuXG5sZXQgcyA9IDA7XG5jb25zdCBTID0ge1xuXHRTVEFSVF9CT1VOREFSWTogcysrLFxuXHRIRUFERVJfRklFTERfU1RBUlQ6IHMrKyxcblx0SEVBREVSX0ZJRUxEOiBzKyssXG5cdEhFQURFUl9WQUxVRV9TVEFSVDogcysrLFxuXHRIRUFERVJfVkFMVUU6IHMrKyxcblx0SEVBREVSX1ZBTFVFX0FMTU9TVF9ET05FOiBzKyssXG5cdEhFQURFUlNfQUxNT1NUX0RPTkU6IHMrKyxcblx0UEFSVF9EQVRBX1NUQVJUOiBzKyssXG5cdFBBUlRfREFUQTogcysrLFxuXHRFTkQ6IHMrK1xufTtcblxubGV0IGYgPSAxO1xuY29uc3QgRiA9IHtcblx0UEFSVF9CT1VOREFSWTogZixcblx0TEFTVF9CT1VOREFSWTogZiAqPSAyXG59O1xuXG5jb25zdCBMRiA9IDEwO1xuY29uc3QgQ1IgPSAxMztcbmNvbnN0IFNQQUNFID0gMzI7XG5jb25zdCBIWVBIRU4gPSA0NTtcbmNvbnN0IENPTE9OID0gNTg7XG5jb25zdCBBID0gOTc7XG5jb25zdCBaID0gMTIyO1xuXG5jb25zdCBsb3dlciA9IGMgPT4gYyB8IDB4MjA7XG5cbmNvbnN0IG5vb3AgPSAoKSA9PiB7fTtcblxuY2xhc3MgTXVsdGlwYXJ0UGFyc2VyIHtcblx0LyoqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBib3VuZGFyeVxuXHQgKi9cblx0Y29uc3RydWN0b3IoYm91bmRhcnkpIHtcblx0XHR0aGlzLmluZGV4ID0gMDtcblx0XHR0aGlzLmZsYWdzID0gMDtcblxuXHRcdHRoaXMub25IZWFkZXJFbmQgPSBub29wO1xuXHRcdHRoaXMub25IZWFkZXJGaWVsZCA9IG5vb3A7XG5cdFx0dGhpcy5vbkhlYWRlcnNFbmQgPSBub29wO1xuXHRcdHRoaXMub25IZWFkZXJWYWx1ZSA9IG5vb3A7XG5cdFx0dGhpcy5vblBhcnRCZWdpbiA9IG5vb3A7XG5cdFx0dGhpcy5vblBhcnREYXRhID0gbm9vcDtcblx0XHR0aGlzLm9uUGFydEVuZCA9IG5vb3A7XG5cblx0XHR0aGlzLmJvdW5kYXJ5Q2hhcnMgPSB7fTtcblxuXHRcdGJvdW5kYXJ5ID0gJ1xcclxcbi0tJyArIGJvdW5kYXJ5O1xuXHRcdGNvbnN0IHVpOGEgPSBuZXcgVWludDhBcnJheShib3VuZGFyeS5sZW5ndGgpO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYm91bmRhcnkubGVuZ3RoOyBpKyspIHtcblx0XHRcdHVpOGFbaV0gPSBib3VuZGFyeS5jaGFyQ29kZUF0KGkpO1xuXHRcdFx0dGhpcy5ib3VuZGFyeUNoYXJzW3VpOGFbaV1dID0gdHJ1ZTtcblx0XHR9XG5cblx0XHR0aGlzLmJvdW5kYXJ5ID0gdWk4YTtcblx0XHR0aGlzLmxvb2tiZWhpbmQgPSBuZXcgVWludDhBcnJheSh0aGlzLmJvdW5kYXJ5Lmxlbmd0aCArIDgpO1xuXHRcdHRoaXMuc3RhdGUgPSBTLlNUQVJUX0JPVU5EQVJZO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwYXJhbSB7VWludDhBcnJheX0gZGF0YVxuXHQgKi9cblx0d3JpdGUoZGF0YSkge1xuXHRcdGxldCBpID0gMDtcblx0XHRjb25zdCBsZW5ndGhfID0gZGF0YS5sZW5ndGg7XG5cdFx0bGV0IHByZXZpb3VzSW5kZXggPSB0aGlzLmluZGV4O1xuXHRcdGxldCB7bG9va2JlaGluZCwgYm91bmRhcnksIGJvdW5kYXJ5Q2hhcnMsIGluZGV4LCBzdGF0ZSwgZmxhZ3N9ID0gdGhpcztcblx0XHRjb25zdCBib3VuZGFyeUxlbmd0aCA9IHRoaXMuYm91bmRhcnkubGVuZ3RoO1xuXHRcdGNvbnN0IGJvdW5kYXJ5RW5kID0gYm91bmRhcnlMZW5ndGggLSAxO1xuXHRcdGNvbnN0IGJ1ZmZlckxlbmd0aCA9IGRhdGEubGVuZ3RoO1xuXHRcdGxldCBjO1xuXHRcdGxldCBjbDtcblxuXHRcdGNvbnN0IG1hcmsgPSBuYW1lID0+IHtcblx0XHRcdHRoaXNbbmFtZSArICdNYXJrJ10gPSBpO1xuXHRcdH07XG5cblx0XHRjb25zdCBjbGVhciA9IG5hbWUgPT4ge1xuXHRcdFx0ZGVsZXRlIHRoaXNbbmFtZSArICdNYXJrJ107XG5cdFx0fTtcblxuXHRcdGNvbnN0IGNhbGxiYWNrID0gKGNhbGxiYWNrU3ltYm9sLCBzdGFydCwgZW5kLCB1aThhKSA9PiB7XG5cdFx0XHRpZiAoc3RhcnQgPT09IHVuZGVmaW5lZCB8fCBzdGFydCAhPT0gZW5kKSB7XG5cdFx0XHRcdHRoaXNbY2FsbGJhY2tTeW1ib2xdKHVpOGEgJiYgdWk4YS5zdWJhcnJheShzdGFydCwgZW5kKSk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdGNvbnN0IGRhdGFDYWxsYmFjayA9IChuYW1lLCBjbGVhcikgPT4ge1xuXHRcdFx0Y29uc3QgbWFya1N5bWJvbCA9IG5hbWUgKyAnTWFyayc7XG5cdFx0XHRpZiAoIShtYXJrU3ltYm9sIGluIHRoaXMpKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGNsZWFyKSB7XG5cdFx0XHRcdGNhbGxiYWNrKG5hbWUsIHRoaXNbbWFya1N5bWJvbF0sIGksIGRhdGEpO1xuXHRcdFx0XHRkZWxldGUgdGhpc1ttYXJrU3ltYm9sXTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNhbGxiYWNrKG5hbWUsIHRoaXNbbWFya1N5bWJvbF0sIGRhdGEubGVuZ3RoLCBkYXRhKTtcblx0XHRcdFx0dGhpc1ttYXJrU3ltYm9sXSA9IDA7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdGZvciAoaSA9IDA7IGkgPCBsZW5ndGhfOyBpKyspIHtcblx0XHRcdGMgPSBkYXRhW2ldO1xuXG5cdFx0XHRzd2l0Y2ggKHN0YXRlKSB7XG5cdFx0XHRcdGNhc2UgUy5TVEFSVF9CT1VOREFSWTpcblx0XHRcdFx0XHRpZiAoaW5kZXggPT09IGJvdW5kYXJ5Lmxlbmd0aCAtIDIpIHtcblx0XHRcdFx0XHRcdGlmIChjID09PSBIWVBIRU4pIHtcblx0XHRcdFx0XHRcdFx0ZmxhZ3MgfD0gRi5MQVNUX0JPVU5EQVJZO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChjICE9PSBDUikge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGluZGV4Kys7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGluZGV4IC0gMSA9PT0gYm91bmRhcnkubGVuZ3RoIC0gMikge1xuXHRcdFx0XHRcdFx0aWYgKGZsYWdzICYgRi5MQVNUX0JPVU5EQVJZICYmIGMgPT09IEhZUEhFTikge1xuXHRcdFx0XHRcdFx0XHRzdGF0ZSA9IFMuRU5EO1xuXHRcdFx0XHRcdFx0XHRmbGFncyA9IDA7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCEoZmxhZ3MgJiBGLkxBU1RfQk9VTkRBUlkpICYmIGMgPT09IExGKSB7XG5cdFx0XHRcdFx0XHRcdGluZGV4ID0gMDtcblx0XHRcdFx0XHRcdFx0Y2FsbGJhY2soJ29uUGFydEJlZ2luJyk7XG5cdFx0XHRcdFx0XHRcdHN0YXRlID0gUy5IRUFERVJfRklFTERfU1RBUlQ7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChjICE9PSBib3VuZGFyeVtpbmRleCArIDJdKSB7XG5cdFx0XHRcdFx0XHRpbmRleCA9IC0yO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChjID09PSBib3VuZGFyeVtpbmRleCArIDJdKSB7XG5cdFx0XHRcdFx0XHRpbmRleCsrO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFMuSEVBREVSX0ZJRUxEX1NUQVJUOlxuXHRcdFx0XHRcdHN0YXRlID0gUy5IRUFERVJfRklFTEQ7XG5cdFx0XHRcdFx0bWFyaygnb25IZWFkZXJGaWVsZCcpO1xuXHRcdFx0XHRcdGluZGV4ID0gMDtcblx0XHRcdFx0XHQvLyBmYWxscyB0aHJvdWdoXG5cdFx0XHRcdGNhc2UgUy5IRUFERVJfRklFTEQ6XG5cdFx0XHRcdFx0aWYgKGMgPT09IENSKSB7XG5cdFx0XHRcdFx0XHRjbGVhcignb25IZWFkZXJGaWVsZCcpO1xuXHRcdFx0XHRcdFx0c3RhdGUgPSBTLkhFQURFUlNfQUxNT1NUX0RPTkU7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpbmRleCsrO1xuXHRcdFx0XHRcdGlmIChjID09PSBIWVBIRU4pIHtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChjID09PSBDT0xPTikge1xuXHRcdFx0XHRcdFx0aWYgKGluZGV4ID09PSAxKSB7XG5cdFx0XHRcdFx0XHRcdC8vIGVtcHR5IGhlYWRlciBmaWVsZFxuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGRhdGFDYWxsYmFjaygnb25IZWFkZXJGaWVsZCcsIHRydWUpO1xuXHRcdFx0XHRcdFx0c3RhdGUgPSBTLkhFQURFUl9WQUxVRV9TVEFSVDtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGNsID0gbG93ZXIoYyk7XG5cdFx0XHRcdFx0aWYgKGNsIDwgQSB8fCBjbCA+IFopIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBTLkhFQURFUl9WQUxVRV9TVEFSVDpcblx0XHRcdFx0XHRpZiAoYyA9PT0gU1BBQ0UpIHtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdG1hcmsoJ29uSGVhZGVyVmFsdWUnKTtcblx0XHRcdFx0XHRzdGF0ZSA9IFMuSEVBREVSX1ZBTFVFO1xuXHRcdFx0XHRcdC8vIGZhbGxzIHRocm91Z2hcblx0XHRcdFx0Y2FzZSBTLkhFQURFUl9WQUxVRTpcblx0XHRcdFx0XHRpZiAoYyA9PT0gQ1IpIHtcblx0XHRcdFx0XHRcdGRhdGFDYWxsYmFjaygnb25IZWFkZXJWYWx1ZScsIHRydWUpO1xuXHRcdFx0XHRcdFx0Y2FsbGJhY2soJ29uSGVhZGVyRW5kJyk7XG5cdFx0XHRcdFx0XHRzdGF0ZSA9IFMuSEVBREVSX1ZBTFVFX0FMTU9TVF9ET05FO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFMuSEVBREVSX1ZBTFVFX0FMTU9TVF9ET05FOlxuXHRcdFx0XHRcdGlmIChjICE9PSBMRikge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHN0YXRlID0gUy5IRUFERVJfRklFTERfU1RBUlQ7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgUy5IRUFERVJTX0FMTU9TVF9ET05FOlxuXHRcdFx0XHRcdGlmIChjICE9PSBMRikge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGNhbGxiYWNrKCdvbkhlYWRlcnNFbmQnKTtcblx0XHRcdFx0XHRzdGF0ZSA9IFMuUEFSVF9EQVRBX1NUQVJUO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFMuUEFSVF9EQVRBX1NUQVJUOlxuXHRcdFx0XHRcdHN0YXRlID0gUy5QQVJUX0RBVEE7XG5cdFx0XHRcdFx0bWFyaygnb25QYXJ0RGF0YScpO1xuXHRcdFx0XHRcdC8vIGZhbGxzIHRocm91Z2hcblx0XHRcdFx0Y2FzZSBTLlBBUlRfREFUQTpcblx0XHRcdFx0XHRwcmV2aW91c0luZGV4ID0gaW5kZXg7XG5cblx0XHRcdFx0XHRpZiAoaW5kZXggPT09IDApIHtcblx0XHRcdFx0XHRcdC8vIGJveWVyLW1vb3JlIGRlcnJpdmVkIGFsZ29yaXRobSB0byBzYWZlbHkgc2tpcCBub24tYm91bmRhcnkgZGF0YVxuXHRcdFx0XHRcdFx0aSArPSBib3VuZGFyeUVuZDtcblx0XHRcdFx0XHRcdHdoaWxlIChpIDwgYnVmZmVyTGVuZ3RoICYmICEoZGF0YVtpXSBpbiBib3VuZGFyeUNoYXJzKSkge1xuXHRcdFx0XHRcdFx0XHRpICs9IGJvdW5kYXJ5TGVuZ3RoO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpIC09IGJvdW5kYXJ5RW5kO1xuXHRcdFx0XHRcdFx0YyA9IGRhdGFbaV07XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKGluZGV4IDwgYm91bmRhcnkubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRpZiAoYm91bmRhcnlbaW5kZXhdID09PSBjKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChpbmRleCA9PT0gMCkge1xuXHRcdFx0XHRcdFx0XHRcdGRhdGFDYWxsYmFjaygnb25QYXJ0RGF0YScsIHRydWUpO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0aW5kZXgrKztcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGluZGV4ID0gMDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2UgaWYgKGluZGV4ID09PSBib3VuZGFyeS5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdGluZGV4Kys7XG5cdFx0XHRcdFx0XHRpZiAoYyA9PT0gQ1IpIHtcblx0XHRcdFx0XHRcdFx0Ly8gQ1IgPSBwYXJ0IGJvdW5kYXJ5XG5cdFx0XHRcdFx0XHRcdGZsYWdzIHw9IEYuUEFSVF9CT1VOREFSWTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYyA9PT0gSFlQSEVOKSB7XG5cdFx0XHRcdFx0XHRcdC8vIEhZUEhFTiA9IGVuZCBib3VuZGFyeVxuXHRcdFx0XHRcdFx0XHRmbGFncyB8PSBGLkxBU1RfQk9VTkRBUlk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRpbmRleCA9IDA7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChpbmRleCAtIDEgPT09IGJvdW5kYXJ5Lmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0aWYgKGZsYWdzICYgRi5QQVJUX0JPVU5EQVJZKSB7XG5cdFx0XHRcdFx0XHRcdGluZGV4ID0gMDtcblx0XHRcdFx0XHRcdFx0aWYgKGMgPT09IExGKSB7XG5cdFx0XHRcdFx0XHRcdFx0Ly8gdW5zZXQgdGhlIFBBUlRfQk9VTkRBUlkgZmxhZ1xuXHRcdFx0XHRcdFx0XHRcdGZsYWdzICY9IH5GLlBBUlRfQk9VTkRBUlk7XG5cdFx0XHRcdFx0XHRcdFx0Y2FsbGJhY2soJ29uUGFydEVuZCcpO1xuXHRcdFx0XHRcdFx0XHRcdGNhbGxiYWNrKCdvblBhcnRCZWdpbicpO1xuXHRcdFx0XHRcdFx0XHRcdHN0YXRlID0gUy5IRUFERVJfRklFTERfU1RBUlQ7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoZmxhZ3MgJiBGLkxBU1RfQk9VTkRBUlkpIHtcblx0XHRcdFx0XHRcdFx0aWYgKGMgPT09IEhZUEhFTikge1xuXHRcdFx0XHRcdFx0XHRcdGNhbGxiYWNrKCdvblBhcnRFbmQnKTtcblx0XHRcdFx0XHRcdFx0XHRzdGF0ZSA9IFMuRU5EO1xuXHRcdFx0XHRcdFx0XHRcdGZsYWdzID0gMDtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRpbmRleCA9IDA7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGluZGV4ID0gMDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoaW5kZXggPiAwKSB7XG5cdFx0XHRcdFx0XHQvLyB3aGVuIG1hdGNoaW5nIGEgcG9zc2libGUgYm91bmRhcnksIGtlZXAgYSBsb29rYmVoaW5kIHJlZmVyZW5jZVxuXHRcdFx0XHRcdFx0Ly8gaW4gY2FzZSBpdCB0dXJucyBvdXQgdG8gYmUgYSBmYWxzZSBsZWFkXG5cdFx0XHRcdFx0XHRsb29rYmVoaW5kW2luZGV4IC0gMV0gPSBjO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAocHJldmlvdXNJbmRleCA+IDApIHtcblx0XHRcdFx0XHRcdC8vIGlmIG91ciBib3VuZGFyeSB0dXJuZWQgb3V0IHRvIGJlIHJ1YmJpc2gsIHRoZSBjYXB0dXJlZCBsb29rYmVoaW5kXG5cdFx0XHRcdFx0XHQvLyBiZWxvbmdzIHRvIHBhcnREYXRhXG5cdFx0XHRcdFx0XHRjb25zdCBfbG9va2JlaGluZCA9IG5ldyBVaW50OEFycmF5KGxvb2tiZWhpbmQuYnVmZmVyLCBsb29rYmVoaW5kLmJ5dGVPZmZzZXQsIGxvb2tiZWhpbmQuYnl0ZUxlbmd0aCk7XG5cdFx0XHRcdFx0XHRjYWxsYmFjaygnb25QYXJ0RGF0YScsIDAsIHByZXZpb3VzSW5kZXgsIF9sb29rYmVoaW5kKTtcblx0XHRcdFx0XHRcdHByZXZpb3VzSW5kZXggPSAwO1xuXHRcdFx0XHRcdFx0bWFyaygnb25QYXJ0RGF0YScpO1xuXG5cdFx0XHRcdFx0XHQvLyByZWNvbnNpZGVyIHRoZSBjdXJyZW50IGNoYXJhY3RlciBldmVuIHNvIGl0IGludGVycnVwdGVkIHRoZSBzZXF1ZW5jZVxuXHRcdFx0XHRcdFx0Ly8gaXQgY291bGQgYmUgdGhlIGJlZ2lubmluZyBvZiBhIG5ldyBzZXF1ZW5jZVxuXHRcdFx0XHRcdFx0aS0tO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFMuRU5EOlxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5leHBlY3RlZCBzdGF0ZSBlbnRlcmVkOiAke3N0YXRlfWApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGRhdGFDYWxsYmFjaygnb25IZWFkZXJGaWVsZCcpO1xuXHRcdGRhdGFDYWxsYmFjaygnb25IZWFkZXJWYWx1ZScpO1xuXHRcdGRhdGFDYWxsYmFjaygnb25QYXJ0RGF0YScpO1xuXG5cdFx0Ly8gVXBkYXRlIHByb3BlcnRpZXMgZm9yIHRoZSBuZXh0IGNhbGxcblx0XHR0aGlzLmluZGV4ID0gaW5kZXg7XG5cdFx0dGhpcy5zdGF0ZSA9IHN0YXRlO1xuXHRcdHRoaXMuZmxhZ3MgPSBmbGFncztcblx0fVxuXG5cdGVuZCgpIHtcblx0XHRpZiAoKHRoaXMuc3RhdGUgPT09IFMuSEVBREVSX0ZJRUxEX1NUQVJUICYmIHRoaXMuaW5kZXggPT09IDApIHx8XG5cdFx0XHQodGhpcy5zdGF0ZSA9PT0gUy5QQVJUX0RBVEEgJiYgdGhpcy5pbmRleCA9PT0gdGhpcy5ib3VuZGFyeS5sZW5ndGgpKSB7XG5cdFx0XHR0aGlzLm9uUGFydEVuZCgpO1xuXHRcdH0gZWxzZSBpZiAodGhpcy5zdGF0ZSAhPT0gUy5FTkQpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignTXVsdGlwYXJ0UGFyc2VyLmVuZCgpOiBzdHJlYW0gZW5kZWQgdW5leHBlY3RlZGx5Jyk7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIF9maWxlTmFtZShoZWFkZXJWYWx1ZSkge1xuXHQvLyBtYXRjaGVzIGVpdGhlciBhIHF1b3RlZC1zdHJpbmcgb3IgYSB0b2tlbiAoUkZDIDI2MTYgc2VjdGlvbiAxOS41LjEpXG5cdGNvbnN0IG0gPSBoZWFkZXJWYWx1ZS5tYXRjaCgvXFxiZmlsZW5hbWU9KFwiKC4qPylcInwoW14oKTw+QCw7OlxcXFxcIi9bXFxdPz17fVxcc1xcdF0rKSkoJHw7XFxzKS9pKTtcblx0aWYgKCFtKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Y29uc3QgbWF0Y2ggPSBtWzJdIHx8IG1bM10gfHwgJyc7XG5cdGxldCBmaWxlbmFtZSA9IG1hdGNoLnNsaWNlKG1hdGNoLmxhc3RJbmRleE9mKCdcXFxcJykgKyAxKTtcblx0ZmlsZW5hbWUgPSBmaWxlbmFtZS5yZXBsYWNlKC8lMjIvZywgJ1wiJyk7XG5cdGZpbGVuYW1lID0gZmlsZW5hbWUucmVwbGFjZSgvJiMoXFxkezR9KTsvZywgKG0sIGNvZGUpID0+IHtcblx0XHRyZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShjb2RlKTtcblx0fSk7XG5cdHJldHVybiBmaWxlbmFtZTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRvRm9ybURhdGEoQm9keSwgY3QpIHtcblx0aWYgKCEvbXVsdGlwYXJ0L2kudGVzdChjdCkpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdGYWlsZWQgdG8gZmV0Y2gnKTtcblx0fVxuXG5cdGNvbnN0IG0gPSBjdC5tYXRjaCgvYm91bmRhcnk9KD86XCIoW15cIl0rKVwifChbXjtdKykpL2kpO1xuXG5cdGlmICghbSkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ25vIG9yIGJhZCBjb250ZW50LXR5cGUgaGVhZGVyLCBubyBtdWx0aXBhcnQgYm91bmRhcnknKTtcblx0fVxuXG5cdGNvbnN0IHBhcnNlciA9IG5ldyBNdWx0aXBhcnRQYXJzZXIobVsxXSB8fCBtWzJdKTtcblxuXHRsZXQgaGVhZGVyRmllbGQ7XG5cdGxldCBoZWFkZXJWYWx1ZTtcblx0bGV0IGVudHJ5VmFsdWU7XG5cdGxldCBlbnRyeU5hbWU7XG5cdGxldCBjb250ZW50VHlwZTtcblx0bGV0IGZpbGVuYW1lO1xuXHRjb25zdCBlbnRyeUNodW5rcyA9IFtdO1xuXHRjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuXG5cdGNvbnN0IG9uUGFydERhdGEgPSB1aThhID0+IHtcblx0XHRlbnRyeVZhbHVlICs9IGRlY29kZXIuZGVjb2RlKHVpOGEsIHtzdHJlYW06IHRydWV9KTtcblx0fTtcblxuXHRjb25zdCBhcHBlbmRUb0ZpbGUgPSB1aThhID0+IHtcblx0XHRlbnRyeUNodW5rcy5wdXNoKHVpOGEpO1xuXHR9O1xuXG5cdGNvbnN0IGFwcGVuZEZpbGVUb0Zvcm1EYXRhID0gKCkgPT4ge1xuXHRcdGNvbnN0IGZpbGUgPSBuZXcgRmlsZShlbnRyeUNodW5rcywgZmlsZW5hbWUsIHt0eXBlOiBjb250ZW50VHlwZX0pO1xuXHRcdGZvcm1EYXRhLmFwcGVuZChlbnRyeU5hbWUsIGZpbGUpO1xuXHR9O1xuXG5cdGNvbnN0IGFwcGVuZEVudHJ5VG9Gb3JtRGF0YSA9ICgpID0+IHtcblx0XHRmb3JtRGF0YS5hcHBlbmQoZW50cnlOYW1lLCBlbnRyeVZhbHVlKTtcblx0fTtcblxuXHRjb25zdCBkZWNvZGVyID0gbmV3IFRleHREZWNvZGVyKCd1dGYtOCcpO1xuXHRkZWNvZGVyLmRlY29kZSgpO1xuXG5cdHBhcnNlci5vblBhcnRCZWdpbiA9IGZ1bmN0aW9uICgpIHtcblx0XHRwYXJzZXIub25QYXJ0RGF0YSA9IG9uUGFydERhdGE7XG5cdFx0cGFyc2VyLm9uUGFydEVuZCA9IGFwcGVuZEVudHJ5VG9Gb3JtRGF0YTtcblxuXHRcdGhlYWRlckZpZWxkID0gJyc7XG5cdFx0aGVhZGVyVmFsdWUgPSAnJztcblx0XHRlbnRyeVZhbHVlID0gJyc7XG5cdFx0ZW50cnlOYW1lID0gJyc7XG5cdFx0Y29udGVudFR5cGUgPSAnJztcblx0XHRmaWxlbmFtZSA9IG51bGw7XG5cdFx0ZW50cnlDaHVua3MubGVuZ3RoID0gMDtcblx0fTtcblxuXHRwYXJzZXIub25IZWFkZXJGaWVsZCA9IGZ1bmN0aW9uICh1aThhKSB7XG5cdFx0aGVhZGVyRmllbGQgKz0gZGVjb2Rlci5kZWNvZGUodWk4YSwge3N0cmVhbTogdHJ1ZX0pO1xuXHR9O1xuXG5cdHBhcnNlci5vbkhlYWRlclZhbHVlID0gZnVuY3Rpb24gKHVpOGEpIHtcblx0XHRoZWFkZXJWYWx1ZSArPSBkZWNvZGVyLmRlY29kZSh1aThhLCB7c3RyZWFtOiB0cnVlfSk7XG5cdH07XG5cblx0cGFyc2VyLm9uSGVhZGVyRW5kID0gZnVuY3Rpb24gKCkge1xuXHRcdGhlYWRlclZhbHVlICs9IGRlY29kZXIuZGVjb2RlKCk7XG5cdFx0aGVhZGVyRmllbGQgPSBoZWFkZXJGaWVsZC50b0xvd2VyQ2FzZSgpO1xuXG5cdFx0aWYgKGhlYWRlckZpZWxkID09PSAnY29udGVudC1kaXNwb3NpdGlvbicpIHtcblx0XHRcdC8vIG1hdGNoZXMgZWl0aGVyIGEgcXVvdGVkLXN0cmluZyBvciBhIHRva2VuIChSRkMgMjYxNiBzZWN0aW9uIDE5LjUuMSlcblx0XHRcdGNvbnN0IG0gPSBoZWFkZXJWYWx1ZS5tYXRjaCgvXFxibmFtZT0oXCIoW15cIl0qKVwifChbXigpPD5ALDs6XFxcXFwiL1tcXF0/PXt9XFxzXFx0XSspKS9pKTtcblxuXHRcdFx0aWYgKG0pIHtcblx0XHRcdFx0ZW50cnlOYW1lID0gbVsyXSB8fCBtWzNdIHx8ICcnO1xuXHRcdFx0fVxuXG5cdFx0XHRmaWxlbmFtZSA9IF9maWxlTmFtZShoZWFkZXJWYWx1ZSk7XG5cblx0XHRcdGlmIChmaWxlbmFtZSkge1xuXHRcdFx0XHRwYXJzZXIub25QYXJ0RGF0YSA9IGFwcGVuZFRvRmlsZTtcblx0XHRcdFx0cGFyc2VyLm9uUGFydEVuZCA9IGFwcGVuZEZpbGVUb0Zvcm1EYXRhO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoaGVhZGVyRmllbGQgPT09ICdjb250ZW50LXR5cGUnKSB7XG5cdFx0XHRjb250ZW50VHlwZSA9IGhlYWRlclZhbHVlO1xuXHRcdH1cblxuXHRcdGhlYWRlclZhbHVlID0gJyc7XG5cdFx0aGVhZGVyRmllbGQgPSAnJztcblx0fTtcblxuXHRmb3IgYXdhaXQgKGNvbnN0IGNodW5rIG9mIEJvZHkpIHtcblx0XHRwYXJzZXIud3JpdGUoY2h1bmspO1xuXHR9XG5cblx0cGFyc2VyLmVuZCgpO1xuXG5cdHJldHVybiBmb3JtRGF0YTtcbn1cbiIsICJpbXBvcnQgeyBMaXN0LCBHcmlkLCBBY3Rpb25QYW5lbCwgQWN0aW9uLCBJY29uLCBzaG93VG9hc3QsIFRvYXN0LCBJbWFnZSwgTG9jYWxTdG9yYWdlIH0gZnJvbSBcIkByYXljYXN0L2FwaVwiO1xuaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCwgdXNlTWVtbyB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IGZldGNoIGZyb20gXCJub2RlLWZldGNoXCI7XG5cbmludGVyZmFjZSBTVkcge1xuICBpZDogbnVtYmVyO1xuICB0aXRsZTogc3RyaW5nO1xuICBjYXRlZ29yeTogc3RyaW5nIHwgc3RyaW5nW107XG4gIHJvdXRlOiBzdHJpbmcgfCB7IGxpZ2h0OiBzdHJpbmc7IGRhcms6IHN0cmluZyB9O1xuICB3b3JkbWFyaz86IHN0cmluZyB8IHsgbGlnaHQ6IHN0cmluZzsgZGFyazogc3RyaW5nIH07XG4gIHVybDogc3RyaW5nO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDb21tYW5kKCkge1xuICBjb25zdCBbaXRlbXMsIHNldEl0ZW1zXSA9IHVzZVN0YXRlPFNWR1tdPihbXSk7XG4gIGNvbnN0IFtpc0xvYWRpbmcsIHNldElzTG9hZGluZ10gPSB1c2VTdGF0ZSh0cnVlKTtcbiAgY29uc3QgW2ZpbHRlciwgc2V0RmlsdGVyXSA9IHVzZVN0YXRlPHN0cmluZz4oXCJBbGxcIik7XG4gIGNvbnN0IFtpc0dyaWRWaWV3LCBzZXRJc0dyaWRWaWV3XSA9IHVzZVN0YXRlKHRydWUpOyAvLyBEZWZhdWx0IHRvIEdyaWQgYXMgcmVxdWVzdGVkXG4gIGNvbnN0IFtpc1Nob3dpbmdEZXRhaWwsIHNldElzU2hvd2luZ0RldGFpbF0gPSB1c2VTdGF0ZShmYWxzZSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBhc3luYyBmdW5jdGlvbiBsb2FkU2V0dGluZ3MoKSB7XG4gICAgICBjb25zdCBzdG9yZWREZXRhaWwgPSBhd2FpdCBMb2NhbFN0b3JhZ2UuZ2V0SXRlbTxzdHJpbmc+KFwic2hvd19kZXRhaWxfdjFcIik7XG4gICAgICBpZiAoc3RvcmVkRGV0YWlsKSBzZXRJc1Nob3dpbmdEZXRhaWwoSlNPTi5wYXJzZShzdG9yZWREZXRhaWwpKTtcbiAgICB9XG4gICAgbG9hZFNldHRpbmdzKCk7XG4gIH0sIFtdKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIExvY2FsU3RvcmFnZS5zZXRJdGVtKFwic2hvd19kZXRhaWxfdjFcIiwgSlNPTi5zdHJpbmdpZnkoaXNTaG93aW5nRGV0YWlsKSk7XG4gIH0sIFtpc1Nob3dpbmdEZXRhaWxdKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGFzeW5jIGZ1bmN0aW9uIGZldGNoU1ZHcygpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCJodHRwczovL2FwaS5zdmdsLmFwcFwiKTtcbiAgICAgICAgaWYgKCFyZXNwb25zZS5vaykgdGhyb3cgbmV3IEVycm9yKGBIVFRQIGVycm9yISBzdGF0dXM6ICR7cmVzcG9uc2Uuc3RhdHVzfWApO1xuICAgICAgICBjb25zdCBkYXRhID0gKGF3YWl0IHJlc3BvbnNlLmpzb24oKSkgYXMgU1ZHW107XG4gICAgICAgIHNldEl0ZW1zKGRhdGEpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgc2hvd1RvYXN0KHtcbiAgICAgICAgICBzdHlsZTogVG9hc3QuU3R5bGUuRmFpbHVyZSxcbiAgICAgICAgICB0aXRsZTogXCJGYWlsZWQgdG8gZmV0Y2ggU1ZHc1wiLFxuICAgICAgICAgIG1lc3NhZ2U6IFN0cmluZyhlcnJvciksXG4gICAgICAgIH0pO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgc2V0SXNMb2FkaW5nKGZhbHNlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZmV0Y2hTVkdzKCk7XG4gIH0sIFtdKTtcblxuICBjb25zdCBjYXRlZ29yaWVzID0gdXNlTWVtbygoKSA9PiB7XG4gICAgY29uc3QgY2F0cyA9IG5ldyBTZXQ8c3RyaW5nPihbXCJBbGxcIl0pO1xuICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGl0ZW0uY2F0ZWdvcnkpKSB7XG4gICAgICAgIGl0ZW0uY2F0ZWdvcnkuZm9yRWFjaCgoYykgPT4gY2F0cy5hZGQoYykpO1xuICAgICAgfSBlbHNlIGlmIChpdGVtLmNhdGVnb3J5KSB7XG4gICAgICAgIGNhdHMuYWRkKGl0ZW0uY2F0ZWdvcnkpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBBcnJheS5mcm9tKGNhdHMpLnNvcnQoKTtcbiAgfSwgW2l0ZW1zXSk7XG5cbiAgY29uc3QgZmlsdGVyZWRJdGVtcyA9IGl0ZW1zLmZpbHRlcigoaXRlbSkgPT4ge1xuICAgIGlmIChmaWx0ZXIgPT09IFwiQWxsXCIpIHJldHVybiB0cnVlO1xuICAgIGNvbnN0IGl0ZW1DYXRzID0gQXJyYXkuaXNBcnJheShpdGVtLmNhdGVnb3J5KSA/IGl0ZW0uY2F0ZWdvcnkgOiBbaXRlbS5jYXRlZ29yeV07XG4gICAgcmV0dXJuIGl0ZW1DYXRzLmluY2x1ZGVzKGZpbHRlcik7XG4gIH0pO1xuXG4gIGNvbnN0IHNlY3Rpb25zID0gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKGZpbHRlciAhPT0gXCJBbGxcIikgcmV0dXJuIFt7IHRpdGxlOiBmaWx0ZXIsIGl0ZW1zOiBmaWx0ZXJlZEl0ZW1zIH1dO1xuICAgIGNvbnN0IGdyb3VwczogUmVjb3JkPHN0cmluZywgU1ZHW10+ID0ge307XG4gICAgZmlsdGVyZWRJdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICBjb25zdCBjYXQgPSBBcnJheS5pc0FycmF5KGl0ZW0uY2F0ZWdvcnkpID8gaXRlbS5jYXRlZ29yeVswXSA6IChpdGVtLmNhdGVnb3J5IHx8IFwiVW5jYXRlZ29yaXplZFwiKTtcbiAgICAgICAgaWYgKCFncm91cHNbY2F0XSkgZ3JvdXBzW2NhdF0gPSBbXTtcbiAgICAgICAgZ3JvdXBzW2NhdF0ucHVzaChpdGVtKTtcbiAgICB9KTtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoZ3JvdXBzKS5zb3J0KCkubWFwKGNhdCA9PiAoeyB0aXRsZTogY2F0LCBpdGVtczogZ3JvdXBzW2NhdF0gfSkpO1xuICB9LCBbZmlsdGVyZWRJdGVtcywgZmlsdGVyXSk7XG5cbiAgY29uc3QgY29weVJhd1NWRyA9IGFzeW5jICh1cmw6IHN0cmluZykgPT4ge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHRvYXN0ID0gYXdhaXQgc2hvd1RvYXN0KHsgc3R5bGU6IFRvYXN0LlN0eWxlLkFuaW1hdGVkLCB0aXRsZTogXCJGZXRjaGluZyBTVkcuLi5cIiB9KTtcbiAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2godXJsKTtcbiAgICAgICAgY29uc3QgdGV4dCA9IGF3YWl0IHJlcy50ZXh0KCk7XG4gICAgICAgIGF3YWl0IENsaXBib2FyZC5jb3B5KHRleHQpO1xuICAgICAgICB0b2FzdC5zdHlsZSA9IFRvYXN0LlN0eWxlLlN1Y2Nlc3M7XG4gICAgICAgIHRvYXN0LnRpdGxlID0gXCJDb3BpZWQgU1ZHIENvZGUhXCI7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBzaG93VG9hc3QoeyBzdHlsZTogVG9hc3QuU3R5bGUuRmFpbHVyZSwgdGl0bGU6IFwiRmFpbGVkIHRvIGNvcHkgU1ZHXCIgfSk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IHRvZ2dsZVZpZXdBY3Rpb24gPSAoXG4gICAgPEFjdGlvblxuICAgICAgdGl0bGU9e2lzR3JpZFZpZXcgPyBcIlN3aXRjaCB0byBMaXN0IFZpZXdcIiA6IFwiU3dpdGNoIHRvIEdyaWQgVmlld1wifVxuICAgICAgaWNvbj17aXNHcmlkVmlldyA/IEljb24uTGlzdCA6IEljb24uR3JpZH1cbiAgICAgIG9uQWN0aW9uPXsoKSA9PiBzZXRJc0dyaWRWaWV3KCFpc0dyaWRWaWV3KX1cbiAgICAgIHNob3J0Y3V0PXt7IG1vZGlmaWVyczogW1wiY21kXCIsIFwic2hpZnRcIl0sIGtleTogXCJ2XCIgfX1cbiAgICAvPlxuICApO1xuXG4gIGNvbnN0IHRvZ2dsZURldGFpbEFjdGlvbiA9IChcbiAgICA8QWN0aW9uXG4gICAgICB0aXRsZT17aXNTaG93aW5nRGV0YWlsID8gXCJIaWRlIERldGFpbFwiIDogXCJTaG93IERldGFpbFwifVxuICAgICAgaWNvbj17SWNvbi5TaWRlYmFyTGVmdH1cbiAgICAgIG9uQWN0aW9uPXsoKSA9PiBzZXRJc1Nob3dpbmdEZXRhaWwoIWlzU2hvd2luZ0RldGFpbCl9XG4gICAgICBzaG9ydGN1dD17eyBtb2RpZmllcnM6IFtcImNtZFwiLCBcInNoaWZ0XCJdLCBrZXk6IFwiZFwiIH19XG4gICAgLz5cbiAgKTtcblxuICBjb25zdCByZW5kZXJBY3Rpb25zID0gKGl0ZW06IFNWRywgc3ZnVXJsOiBzdHJpbmcpID0+IChcbiAgICA8QWN0aW9uUGFuZWw+XG4gICAgICA8QWN0aW9uUGFuZWwuU2VjdGlvbj5cbiAgICAgICAgPEFjdGlvbi5Db3B5VG9DbGlwYm9hcmQgdGl0bGU9XCJDb3B5IFNWRyBVUkxcIiBjb250ZW50PXtzdmdVcmx9IC8+XG4gICAgICAgIDxBY3Rpb24gdGl0bGU9XCJDb3B5IFJhdyBTVkcgQ29kZVwiIGljb249e0ljb24uQ29kZX0gb25BY3Rpb249eygpID0+IGNvcHlSYXdTVkcoc3ZnVXJsKX0gLz5cbiAgICAgICAgPEFjdGlvbi5QYXN0ZSB0aXRsZT1cIlBhc3RlIFNWRyBVUkxcIiBjb250ZW50PXtzdmdVcmx9IC8+XG4gICAgICA8L0FjdGlvblBhbmVsLlNlY3Rpb24+XG4gICAgICA8QWN0aW9uUGFuZWwuU2VjdGlvbj5cbiAgICAgICAgPEFjdGlvbi5PcGVuSW5Ccm93c2VyIHRpdGxlPVwiT3BlbiBTVkdMIFNlYXJjaFwiIHVybD17YGh0dHBzOi8vc3ZnbC5hcHAvP3NlYXJjaD0ke2VuY29kZVVSSUNvbXBvbmVudChpdGVtLnRpdGxlKX1gfSAvPlxuICAgICAgICA8QWN0aW9uLk9wZW5JbkJyb3dzZXIgdGl0bGU9XCJWaXNpdCBPZmZpY2lhbCBXZWJzaXRlXCIgdXJsPXtpdGVtLnVybH0gaWNvbj17SWNvbi5HbG9iZX0gLz5cbiAgICAgIDwvQWN0aW9uUGFuZWwuU2VjdGlvbj5cbiAgICAgIDxBY3Rpb25QYW5lbC5TZWN0aW9uPlxuICAgICAgICB7dG9nZ2xlRGV0YWlsQWN0aW9ufVxuICAgICAgICB7dG9nZ2xlVmlld0FjdGlvbn1cbiAgICAgICAgPEFjdGlvbi5Db3B5VG9DbGlwYm9hcmQgdGl0bGU9XCJDb3B5IE5hbWVcIiBjb250ZW50PXtpdGVtLnRpdGxlfSBzaG9ydGN1dD17eyBtb2RpZmllcnM6IFtcImNtZFwiLCBcInNoaWZ0XCJdLCBrZXk6IFwiY1wiIH19IC8+XG4gICAgICA8L0FjdGlvblBhbmVsLlNlY3Rpb24+XG4gICAgPC9BY3Rpb25QYW5lbD5cbiAgKTtcblxuICBjb25zdCByZW5kZXJEZXRhaWwgPSAoaXRlbTogU1ZHLCBzdmdVcmw6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IG1hcmtkb3duID0gYFxuIVske2l0ZW0udGl0bGV9XSgke3N2Z1VybH0pXG5cbiMjICR7aXRlbS50aXRsZX1cblxufCBQcm9wZXJ0eSB8IFZhbHVlIHxcbnwgOi0tLSB8IDotLS0gfFxufCAqKlRpdGxlKiogfCAke2l0ZW0udGl0bGV9IHxcbnwgKipDYXRlZ29yeSoqIHwgJHtBcnJheS5pc0FycmF5KGl0ZW0uY2F0ZWdvcnkpID8gaXRlbS5jYXRlZ29yeS5qb2luKFwiLCBcIikgOiAoaXRlbS5jYXRlZ29yeSB8fCBcIkdlbmVyYWxcIil9IHxcbnwgKipPZmZpY2lhbCBVUkwqKiB8IFtWaXNpdCBTaXRlXSgke2l0ZW0udXJsfSkgfFxufCAqKlN0YXR1cyoqIHwgSGlnaCBGaWRlbGl0eSBBc3NldCBcdTI3MDUgfFxuICAgIGA7XG4gICAgY29uc3QgR3JpZERldGFpbCA9IChHcmlkLkl0ZW0gYXMgYW55KS5EZXRhaWwgfHwgKExpc3QuSXRlbSBhcyBhbnkpLkRldGFpbDtcbiAgICBpZiAoR3JpZERldGFpbCkge1xuICAgICAgcmV0dXJuIDxHcmlkRGV0YWlsIG1hcmtkb3duPXttYXJrZG93bn0gLz47XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9O1xuXG4gIGNvbnN0IGFjY2Vzc29yeSA9IChcbiAgICA8TGlzdC5Ecm9wZG93biB0b29sdGlwPVwiRmlsdGVyIGJ5IENhdGVnb3J5XCIgc3RvcmVWYWx1ZT17dHJ1ZX0gb25DaGFuZ2U9e3NldEZpbHRlcn0+XG4gICAgICB7Y2F0ZWdvcmllcy5tYXAoKGNhdCkgPT4gKFxuICAgICAgICA8TGlzdC5Ecm9wZG93bi5JdGVtIGtleT17Y2F0fSB0aXRsZT17Y2F0fSB2YWx1ZT17Y2F0fSAvPlxuICAgICAgKSl9XG4gICAgPC9MaXN0LkRyb3Bkb3duPlxuICApO1xuXG4gIGlmIChpc0dyaWRWaWV3KSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxHcmlkXG4gICAgICAgIGlzTG9hZGluZz17aXNMb2FkaW5nfVxuICAgICAgICBzZWFyY2hCYXJQbGFjZWhvbGRlcj1cIlNlYXJjaCBsb2dvcyBpbiBHcmlkIFZpZXcuLi5cIlxuICAgICAgICBzZWFyY2hCYXJBY2Nlc3Nvcnk9e2FjY2Vzc29yeX1cbiAgICAgICAgY29sdW1ucz17aXNTaG93aW5nRGV0YWlsID8gNSA6IDh9XG4gICAgICAgIGZpdD17R3JpZC5GaXQuQ29udGFpbn1cbiAgICAgICAgaXNTaG93aW5nRGV0YWlsPXtpc1Nob3dpbmdEZXRhaWx9XG4gICAgICA+XG4gICAgICAgIHtzZWN0aW9ucy5tYXAoKHNlY3Rpb24pID0+IChcbiAgICAgICAgICA8R3JpZC5TZWN0aW9uIHRpdGxlPXtzZWN0aW9uLnRpdGxlfSBrZXk9e3NlY3Rpb24udGl0bGV9PlxuICAgICAgICAgICAge3NlY3Rpb24uaXRlbXMubWFwKChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IHN2Z1VybCA9IHR5cGVvZiBpdGVtLnJvdXRlID09PSBcInN0cmluZ1wiID8gaXRlbS5yb3V0ZSA6IGl0ZW0ucm91dGUubGlnaHQ7XG4gICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPEdyaWQuSXRlbVxuICAgICAgICAgICAgICAgICAga2V5PXtpdGVtLmlkfVxuICAgICAgICAgICAgICAgICAgdGl0bGU9e2l0ZW0udGl0bGV9XG4gICAgICAgICAgICAgICAgICBjb250ZW50PXt7IHNvdXJjZTogc3ZnVXJsIH19XG4gICAgICAgICAgICAgICAgICBhY3Rpb25zPXtyZW5kZXJBY3Rpb25zKGl0ZW0sIHN2Z1VybCl9XG4gICAgICAgICAgICAgICAgICBkZXRhaWw9e3JlbmRlckRldGFpbChpdGVtLCBzdmdVcmwpfVxuICAgICAgICAgICAgICAgICAgcXVpY2tMb29rPXt7IHBhdGg6IHN2Z1VybCwgdGl0bGU6IGl0ZW0udGl0bGUgfX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSl9XG4gICAgICAgICAgPC9HcmlkLlNlY3Rpb24+XG4gICAgICAgICkpfVxuICAgICAgPC9HcmlkPlxuICAgICk7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxMaXN0XG4gICAgICBpc0xvYWRpbmc9e2lzTG9hZGluZ31cbiAgICAgIHNlYXJjaEJhclBsYWNlaG9sZGVyPVwiU2VhcmNoIGxvZ29zIGluIExpc3QgVmlldy4uLlwiXG4gICAgICB0aHJvdHRsZVxuICAgICAgc2VhcmNoQmFyQWNjZXNzb3J5PXthY2Nlc3Nvcnl9XG4gICAgICBpc1Nob3dpbmdEZXRhaWw9e2lzU2hvd2luZ0RldGFpbH1cbiAgICA+XG4gICAgICB7c2VjdGlvbnMubWFwKChzZWN0aW9uKSA9PiAoXG4gICAgICAgIDxMaXN0LlNlY3Rpb24gdGl0bGU9e3NlY3Rpb24udGl0bGV9IGtleT17c2VjdGlvbi50aXRsZX0+XG4gICAgICAgICAge3NlY3Rpb24uaXRlbXMubWFwKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzdmdVcmwgPSB0eXBlb2YgaXRlbS5yb3V0ZSA9PT0gXCJzdHJpbmdcIiA/IGl0ZW0ucm91dGUgOiBpdGVtLnJvdXRlLmxpZ2h0O1xuICAgICAgICAgICAgY29uc3QgZGV0YWlsTWFya2Rvd24gPSBgXG48aW1nIHNyYz1cIiR7c3ZnVXJsfVwiIHdpZHRoPVwiMjAwXCIgLz5cblxuIyMgJHtpdGVtLnRpdGxlfVxuXG58IFByb3BlcnR5IHwgVmFsdWUgfFxufCA6LS0tIHwgOi0tLSB8XG58ICoqVGl0bGUqKiB8ICR7aXRlbS50aXRsZX0gfFxufCAqKkFzc2V0IElEKiogfCBcXGAke2l0ZW0uaWR9XFxgIHxcbnwgKipRdWFsaXR5KiogfCBWZWN0b3IgUGVyZmVjdCBcdUQ4M0NcdURGQUYgfFxuICAgICAgICAgICAgYDtcblxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPExpc3QuSXRlbVxuICAgICAgICAgICAgICAgIGtleT17aXRlbS5pZH1cbiAgICAgICAgICAgICAgICB0aXRsZT17aXRlbS50aXRsZX1cbiAgICAgICAgICAgICAgICBzdWJ0aXRsZT17QXJyYXkuaXNBcnJheShpdGVtLmNhdGVnb3J5KSA/IGl0ZW0uY2F0ZWdvcnkuam9pbihcIiwgXCIpIDogaXRlbS5jYXRlZ29yeX1cbiAgICAgICAgICAgICAgICBpY29uPXt7IHNvdXJjZTogc3ZnVXJsLCBtYXNrOiBJbWFnZS5NYXNrLlJvdW5kZWRSZWN0IH19XG4gICAgICAgICAgICAgICAgYWN0aW9ucz17cmVuZGVyQWN0aW9ucyhpdGVtLCBzdmdVcmwpfVxuICAgICAgICAgICAgICAgIHF1aWNrTG9vaz17eyBwYXRoOiBzdmdVcmwsIHRpdGxlOiBpdGVtLnRpdGxlIH19XG4gICAgICAgICAgICAgICAgZGV0YWlsPXs8TGlzdC5JdGVtLkRldGFpbCBtYXJrZG93bj17ZGV0YWlsTWFya2Rvd259IC8+fVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9KX1cbiAgICAgICAgPC9MaXN0LlNlY3Rpb24+XG4gICAgICApKX1cbiAgICA8L0xpc3Q+XG4gICk7XG59XG4iLCAiLyoqXG4gKiBJbmRleC5qc1xuICpcbiAqIGEgcmVxdWVzdCBBUEkgY29tcGF0aWJsZSB3aXRoIHdpbmRvdy5mZXRjaFxuICpcbiAqIEFsbCBzcGVjIGFsZ29yaXRobSBzdGVwIG51bWJlcnMgYXJlIGJhc2VkIG9uIGh0dHBzOi8vZmV0Y2guc3BlYy53aGF0d2cub3JnL2NvbW1pdC1zbmFwc2hvdHMvYWU3MTY4MjJjYjNhNjE4NDMyMjZjZDA5MGVlZmM2NTg5NDQ2YzFkMi8uXG4gKi9cblxuaW1wb3J0IGh0dHAgZnJvbSAnbm9kZTpodHRwJztcbmltcG9ydCBodHRwcyBmcm9tICdub2RlOmh0dHBzJztcbmltcG9ydCB6bGliIGZyb20gJ25vZGU6emxpYic7XG5pbXBvcnQgU3RyZWFtLCB7UGFzc1Rocm91Z2gsIHBpcGVsaW5lIGFzIHB1bXB9IGZyb20gJ25vZGU6c3RyZWFtJztcbmltcG9ydCB7QnVmZmVyfSBmcm9tICdub2RlOmJ1ZmZlcic7XG5cbmltcG9ydCBkYXRhVXJpVG9CdWZmZXIgZnJvbSAnZGF0YS11cmktdG8tYnVmZmVyJztcblxuaW1wb3J0IHt3cml0ZVRvU3RyZWFtLCBjbG9uZX0gZnJvbSAnLi9ib2R5LmpzJztcbmltcG9ydCBSZXNwb25zZSBmcm9tICcuL3Jlc3BvbnNlLmpzJztcbmltcG9ydCBIZWFkZXJzLCB7ZnJvbVJhd0hlYWRlcnN9IGZyb20gJy4vaGVhZGVycy5qcyc7XG5pbXBvcnQgUmVxdWVzdCwge2dldE5vZGVSZXF1ZXN0T3B0aW9uc30gZnJvbSAnLi9yZXF1ZXN0LmpzJztcbmltcG9ydCB7RmV0Y2hFcnJvcn0gZnJvbSAnLi9lcnJvcnMvZmV0Y2gtZXJyb3IuanMnO1xuaW1wb3J0IHtBYm9ydEVycm9yfSBmcm9tICcuL2Vycm9ycy9hYm9ydC1lcnJvci5qcyc7XG5pbXBvcnQge2lzUmVkaXJlY3R9IGZyb20gJy4vdXRpbHMvaXMtcmVkaXJlY3QuanMnO1xuaW1wb3J0IHtGb3JtRGF0YX0gZnJvbSAnZm9ybWRhdGEtcG9seWZpbGwvZXNtLm1pbi5qcyc7XG5pbXBvcnQge2lzRG9tYWluT3JTdWJkb21haW4sIGlzU2FtZVByb3RvY29sfSBmcm9tICcuL3V0aWxzL2lzLmpzJztcbmltcG9ydCB7cGFyc2VSZWZlcnJlclBvbGljeUZyb21IZWFkZXJ9IGZyb20gJy4vdXRpbHMvcmVmZXJyZXIuanMnO1xuaW1wb3J0IHtcblx0QmxvYixcblx0RmlsZSxcblx0ZmlsZUZyb21TeW5jLFxuXHRmaWxlRnJvbSxcblx0YmxvYkZyb21TeW5jLFxuXHRibG9iRnJvbVxufSBmcm9tICdmZXRjaC1ibG9iL2Zyb20uanMnO1xuXG5leHBvcnQge0Zvcm1EYXRhLCBIZWFkZXJzLCBSZXF1ZXN0LCBSZXNwb25zZSwgRmV0Y2hFcnJvciwgQWJvcnRFcnJvciwgaXNSZWRpcmVjdH07XG5leHBvcnQge0Jsb2IsIEZpbGUsIGZpbGVGcm9tU3luYywgZmlsZUZyb20sIGJsb2JGcm9tU3luYywgYmxvYkZyb219O1xuXG5jb25zdCBzdXBwb3J0ZWRTY2hlbWFzID0gbmV3IFNldChbJ2RhdGE6JywgJ2h0dHA6JywgJ2h0dHBzOiddKTtcblxuLyoqXG4gKiBGZXRjaCBmdW5jdGlvblxuICpcbiAqIEBwYXJhbSAgIHtzdHJpbmcgfCBVUkwgfCBpbXBvcnQoJy4vcmVxdWVzdCcpLmRlZmF1bHR9IHVybCAtIEFic29sdXRlIHVybCBvciBSZXF1ZXN0IGluc3RhbmNlXG4gKiBAcGFyYW0gICB7Kn0gW29wdGlvbnNfXSAtIEZldGNoIG9wdGlvbnNcbiAqIEByZXR1cm4gIHtQcm9taXNlPGltcG9ydCgnLi9yZXNwb25zZScpLmRlZmF1bHQ+fVxuICovXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBmZXRjaCh1cmwsIG9wdGlvbnNfKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0Ly8gQnVpbGQgcmVxdWVzdCBvYmplY3Rcblx0XHRjb25zdCByZXF1ZXN0ID0gbmV3IFJlcXVlc3QodXJsLCBvcHRpb25zXyk7XG5cdFx0Y29uc3Qge3BhcnNlZFVSTCwgb3B0aW9uc30gPSBnZXROb2RlUmVxdWVzdE9wdGlvbnMocmVxdWVzdCk7XG5cdFx0aWYgKCFzdXBwb3J0ZWRTY2hlbWFzLmhhcyhwYXJzZWRVUkwucHJvdG9jb2wpKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKGBub2RlLWZldGNoIGNhbm5vdCBsb2FkICR7dXJsfS4gVVJMIHNjaGVtZSBcIiR7cGFyc2VkVVJMLnByb3RvY29sLnJlcGxhY2UoLzokLywgJycpfVwiIGlzIG5vdCBzdXBwb3J0ZWQuYCk7XG5cdFx0fVxuXG5cdFx0aWYgKHBhcnNlZFVSTC5wcm90b2NvbCA9PT0gJ2RhdGE6Jykge1xuXHRcdFx0Y29uc3QgZGF0YSA9IGRhdGFVcmlUb0J1ZmZlcihyZXF1ZXN0LnVybCk7XG5cdFx0XHRjb25zdCByZXNwb25zZSA9IG5ldyBSZXNwb25zZShkYXRhLCB7aGVhZGVyczogeydDb250ZW50LVR5cGUnOiBkYXRhLnR5cGVGdWxsfX0pO1xuXHRcdFx0cmVzb2x2ZShyZXNwb25zZSk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gV3JhcCBodHRwLnJlcXVlc3QgaW50byBmZXRjaFxuXHRcdGNvbnN0IHNlbmQgPSAocGFyc2VkVVJMLnByb3RvY29sID09PSAnaHR0cHM6JyA/IGh0dHBzIDogaHR0cCkucmVxdWVzdDtcblx0XHRjb25zdCB7c2lnbmFsfSA9IHJlcXVlc3Q7XG5cdFx0bGV0IHJlc3BvbnNlID0gbnVsbDtcblxuXHRcdGNvbnN0IGFib3J0ID0gKCkgPT4ge1xuXHRcdFx0Y29uc3QgZXJyb3IgPSBuZXcgQWJvcnRFcnJvcignVGhlIG9wZXJhdGlvbiB3YXMgYWJvcnRlZC4nKTtcblx0XHRcdHJlamVjdChlcnJvcik7XG5cdFx0XHRpZiAocmVxdWVzdC5ib2R5ICYmIHJlcXVlc3QuYm9keSBpbnN0YW5jZW9mIFN0cmVhbS5SZWFkYWJsZSkge1xuXHRcdFx0XHRyZXF1ZXN0LmJvZHkuZGVzdHJveShlcnJvcik7XG5cdFx0XHR9XG5cblx0XHRcdGlmICghcmVzcG9uc2UgfHwgIXJlc3BvbnNlLmJvZHkpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXNwb25zZS5ib2R5LmVtaXQoJ2Vycm9yJywgZXJyb3IpO1xuXHRcdH07XG5cblx0XHRpZiAoc2lnbmFsICYmIHNpZ25hbC5hYm9ydGVkKSB7XG5cdFx0XHRhYm9ydCgpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGFib3J0QW5kRmluYWxpemUgPSAoKSA9PiB7XG5cdFx0XHRhYm9ydCgpO1xuXHRcdFx0ZmluYWxpemUoKTtcblx0XHR9O1xuXG5cdFx0Ly8gU2VuZCByZXF1ZXN0XG5cdFx0Y29uc3QgcmVxdWVzdF8gPSBzZW5kKHBhcnNlZFVSTC50b1N0cmluZygpLCBvcHRpb25zKTtcblxuXHRcdGlmIChzaWduYWwpIHtcblx0XHRcdHNpZ25hbC5hZGRFdmVudExpc3RlbmVyKCdhYm9ydCcsIGFib3J0QW5kRmluYWxpemUpO1xuXHRcdH1cblxuXHRcdGNvbnN0IGZpbmFsaXplID0gKCkgPT4ge1xuXHRcdFx0cmVxdWVzdF8uYWJvcnQoKTtcblx0XHRcdGlmIChzaWduYWwpIHtcblx0XHRcdFx0c2lnbmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Fib3J0JywgYWJvcnRBbmRGaW5hbGl6ZSk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHJlcXVlc3RfLm9uKCdlcnJvcicsIGVycm9yID0+IHtcblx0XHRcdHJlamVjdChuZXcgRmV0Y2hFcnJvcihgcmVxdWVzdCB0byAke3JlcXVlc3QudXJsfSBmYWlsZWQsIHJlYXNvbjogJHtlcnJvci5tZXNzYWdlfWAsICdzeXN0ZW0nLCBlcnJvcikpO1xuXHRcdFx0ZmluYWxpemUoKTtcblx0XHR9KTtcblxuXHRcdGZpeFJlc3BvbnNlQ2h1bmtlZFRyYW5zZmVyQmFkRW5kaW5nKHJlcXVlc3RfLCBlcnJvciA9PiB7XG5cdFx0XHRpZiAocmVzcG9uc2UgJiYgcmVzcG9uc2UuYm9keSkge1xuXHRcdFx0XHRyZXNwb25zZS5ib2R5LmRlc3Ryb3koZXJyb3IpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0LyogYzggaWdub3JlIG5leHQgMTggKi9cblx0XHRpZiAocHJvY2Vzcy52ZXJzaW9uIDwgJ3YxNCcpIHtcblx0XHRcdC8vIEJlZm9yZSBOb2RlLmpzIDE0LCBwaXBlbGluZSgpIGRvZXMgbm90IGZ1bGx5IHN1cHBvcnQgYXN5bmMgaXRlcmF0b3JzIGFuZCBkb2VzIG5vdCBhbHdheXNcblx0XHRcdC8vIHByb3Blcmx5IGhhbmRsZSB3aGVuIHRoZSBzb2NrZXQgY2xvc2UvZW5kIGV2ZW50cyBhcmUgb3V0IG9mIG9yZGVyLlxuXHRcdFx0cmVxdWVzdF8ub24oJ3NvY2tldCcsIHMgPT4ge1xuXHRcdFx0XHRsZXQgZW5kZWRXaXRoRXZlbnRzQ291bnQ7XG5cdFx0XHRcdHMucHJlcGVuZExpc3RlbmVyKCdlbmQnLCAoKSA9PiB7XG5cdFx0XHRcdFx0ZW5kZWRXaXRoRXZlbnRzQ291bnQgPSBzLl9ldmVudHNDb3VudDtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHMucHJlcGVuZExpc3RlbmVyKCdjbG9zZScsIGhhZEVycm9yID0+IHtcblx0XHRcdFx0XHQvLyBpZiBlbmQgaGFwcGVuZWQgYmVmb3JlIGNsb3NlIGJ1dCB0aGUgc29ja2V0IGRpZG4ndCBlbWl0IGFuIGVycm9yLCBkbyBpdCBub3dcblx0XHRcdFx0XHRpZiAocmVzcG9uc2UgJiYgZW5kZWRXaXRoRXZlbnRzQ291bnQgPCBzLl9ldmVudHNDb3VudCAmJiAhaGFkRXJyb3IpIHtcblx0XHRcdFx0XHRcdGNvbnN0IGVycm9yID0gbmV3IEVycm9yKCdQcmVtYXR1cmUgY2xvc2UnKTtcblx0XHRcdFx0XHRcdGVycm9yLmNvZGUgPSAnRVJSX1NUUkVBTV9QUkVNQVRVUkVfQ0xPU0UnO1xuXHRcdFx0XHRcdFx0cmVzcG9uc2UuYm9keS5lbWl0KCdlcnJvcicsIGVycm9yKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0cmVxdWVzdF8ub24oJ3Jlc3BvbnNlJywgcmVzcG9uc2VfID0+IHtcblx0XHRcdHJlcXVlc3RfLnNldFRpbWVvdXQoMCk7XG5cdFx0XHRjb25zdCBoZWFkZXJzID0gZnJvbVJhd0hlYWRlcnMocmVzcG9uc2VfLnJhd0hlYWRlcnMpO1xuXG5cdFx0XHQvLyBIVFRQIGZldGNoIHN0ZXAgNVxuXHRcdFx0aWYgKGlzUmVkaXJlY3QocmVzcG9uc2VfLnN0YXR1c0NvZGUpKSB7XG5cdFx0XHRcdC8vIEhUVFAgZmV0Y2ggc3RlcCA1LjJcblx0XHRcdFx0Y29uc3QgbG9jYXRpb24gPSBoZWFkZXJzLmdldCgnTG9jYXRpb24nKTtcblxuXHRcdFx0XHQvLyBIVFRQIGZldGNoIHN0ZXAgNS4zXG5cdFx0XHRcdGxldCBsb2NhdGlvblVSTCA9IG51bGw7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0bG9jYXRpb25VUkwgPSBsb2NhdGlvbiA9PT0gbnVsbCA/IG51bGwgOiBuZXcgVVJMKGxvY2F0aW9uLCByZXF1ZXN0LnVybCk7XG5cdFx0XHRcdH0gY2F0Y2gge1xuXHRcdFx0XHRcdC8vIGVycm9yIGhlcmUgY2FuIG9ubHkgYmUgaW52YWxpZCBVUkwgaW4gTG9jYXRpb246IGhlYWRlclxuXHRcdFx0XHRcdC8vIGRvIG5vdCB0aHJvdyB3aGVuIG9wdGlvbnMucmVkaXJlY3QgPT0gbWFudWFsXG5cdFx0XHRcdFx0Ly8gbGV0IHRoZSB1c2VyIGV4dHJhY3QgdGhlIGVycm9ybmVvdXMgcmVkaXJlY3QgVVJMXG5cdFx0XHRcdFx0aWYgKHJlcXVlc3QucmVkaXJlY3QgIT09ICdtYW51YWwnKSB7XG5cdFx0XHRcdFx0XHRyZWplY3QobmV3IEZldGNoRXJyb3IoYHVyaSByZXF1ZXN0ZWQgcmVzcG9uZHMgd2l0aCBhbiBpbnZhbGlkIHJlZGlyZWN0IFVSTDogJHtsb2NhdGlvbn1gLCAnaW52YWxpZC1yZWRpcmVjdCcpKTtcblx0XHRcdFx0XHRcdGZpbmFsaXplKCk7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gSFRUUCBmZXRjaCBzdGVwIDUuNVxuXHRcdFx0XHRzd2l0Y2ggKHJlcXVlc3QucmVkaXJlY3QpIHtcblx0XHRcdFx0XHRjYXNlICdlcnJvcic6XG5cdFx0XHRcdFx0XHRyZWplY3QobmV3IEZldGNoRXJyb3IoYHVyaSByZXF1ZXN0ZWQgcmVzcG9uZHMgd2l0aCBhIHJlZGlyZWN0LCByZWRpcmVjdCBtb2RlIGlzIHNldCB0byBlcnJvcjogJHtyZXF1ZXN0LnVybH1gLCAnbm8tcmVkaXJlY3QnKSk7XG5cdFx0XHRcdFx0XHRmaW5hbGl6ZSgpO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdGNhc2UgJ21hbnVhbCc6XG5cdFx0XHRcdFx0XHQvLyBOb3RoaW5nIHRvIGRvXG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlICdmb2xsb3cnOiB7XG5cdFx0XHRcdFx0XHQvLyBIVFRQLXJlZGlyZWN0IGZldGNoIHN0ZXAgMlxuXHRcdFx0XHRcdFx0aWYgKGxvY2F0aW9uVVJMID09PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBIVFRQLXJlZGlyZWN0IGZldGNoIHN0ZXAgNVxuXHRcdFx0XHRcdFx0aWYgKHJlcXVlc3QuY291bnRlciA+PSByZXF1ZXN0LmZvbGxvdykge1xuXHRcdFx0XHRcdFx0XHRyZWplY3QobmV3IEZldGNoRXJyb3IoYG1heGltdW0gcmVkaXJlY3QgcmVhY2hlZCBhdDogJHtyZXF1ZXN0LnVybH1gLCAnbWF4LXJlZGlyZWN0JykpO1xuXHRcdFx0XHRcdFx0XHRmaW5hbGl6ZSgpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIEhUVFAtcmVkaXJlY3QgZmV0Y2ggc3RlcCA2IChjb3VudGVyIGluY3JlbWVudClcblx0XHRcdFx0XHRcdC8vIENyZWF0ZSBhIG5ldyBSZXF1ZXN0IG9iamVjdC5cblx0XHRcdFx0XHRcdGNvbnN0IHJlcXVlc3RPcHRpb25zID0ge1xuXHRcdFx0XHRcdFx0XHRoZWFkZXJzOiBuZXcgSGVhZGVycyhyZXF1ZXN0LmhlYWRlcnMpLFxuXHRcdFx0XHRcdFx0XHRmb2xsb3c6IHJlcXVlc3QuZm9sbG93LFxuXHRcdFx0XHRcdFx0XHRjb3VudGVyOiByZXF1ZXN0LmNvdW50ZXIgKyAxLFxuXHRcdFx0XHRcdFx0XHRhZ2VudDogcmVxdWVzdC5hZ2VudCxcblx0XHRcdFx0XHRcdFx0Y29tcHJlc3M6IHJlcXVlc3QuY29tcHJlc3MsXG5cdFx0XHRcdFx0XHRcdG1ldGhvZDogcmVxdWVzdC5tZXRob2QsXG5cdFx0XHRcdFx0XHRcdGJvZHk6IGNsb25lKHJlcXVlc3QpLFxuXHRcdFx0XHRcdFx0XHRzaWduYWw6IHJlcXVlc3Quc2lnbmFsLFxuXHRcdFx0XHRcdFx0XHRzaXplOiByZXF1ZXN0LnNpemUsXG5cdFx0XHRcdFx0XHRcdHJlZmVycmVyOiByZXF1ZXN0LnJlZmVycmVyLFxuXHRcdFx0XHRcdFx0XHRyZWZlcnJlclBvbGljeTogcmVxdWVzdC5yZWZlcnJlclBvbGljeVxuXHRcdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdFx0Ly8gd2hlbiBmb3J3YXJkaW5nIHNlbnNpdGl2ZSBoZWFkZXJzIGxpa2UgXCJBdXRob3JpemF0aW9uXCIsXG5cdFx0XHRcdFx0XHQvLyBcIldXVy1BdXRoZW50aWNhdGVcIiwgYW5kIFwiQ29va2llXCIgdG8gdW50cnVzdGVkIHRhcmdldHMsXG5cdFx0XHRcdFx0XHQvLyBoZWFkZXJzIHdpbGwgYmUgaWdub3JlZCB3aGVuIGZvbGxvd2luZyBhIHJlZGlyZWN0IHRvIGEgZG9tYWluXG5cdFx0XHRcdFx0XHQvLyB0aGF0IGlzIG5vdCBhIHN1YmRvbWFpbiBtYXRjaCBvciBleGFjdCBtYXRjaCBvZiB0aGUgaW5pdGlhbCBkb21haW4uXG5cdFx0XHRcdFx0XHQvLyBGb3IgZXhhbXBsZSwgYSByZWRpcmVjdCBmcm9tIFwiZm9vLmNvbVwiIHRvIGVpdGhlciBcImZvby5jb21cIiBvciBcInN1Yi5mb28uY29tXCJcblx0XHRcdFx0XHRcdC8vIHdpbGwgZm9yd2FyZCB0aGUgc2Vuc2l0aXZlIGhlYWRlcnMsIGJ1dCBhIHJlZGlyZWN0IHRvIFwiYmFyLmNvbVwiIHdpbGwgbm90LlxuXHRcdFx0XHRcdFx0Ly8gaGVhZGVycyB3aWxsIGFsc28gYmUgaWdub3JlZCB3aGVuIGZvbGxvd2luZyBhIHJlZGlyZWN0IHRvIGEgZG9tYWluIHVzaW5nXG5cdFx0XHRcdFx0XHQvLyBhIGRpZmZlcmVudCBwcm90b2NvbC4gRm9yIGV4YW1wbGUsIGEgcmVkaXJlY3QgZnJvbSBcImh0dHBzOi8vZm9vLmNvbVwiIHRvIFwiaHR0cDovL2Zvby5jb21cIlxuXHRcdFx0XHRcdFx0Ly8gd2lsbCBub3QgZm9yd2FyZCB0aGUgc2Vuc2l0aXZlIGhlYWRlcnNcblx0XHRcdFx0XHRcdGlmICghaXNEb21haW5PclN1YmRvbWFpbihyZXF1ZXN0LnVybCwgbG9jYXRpb25VUkwpIHx8ICFpc1NhbWVQcm90b2NvbChyZXF1ZXN0LnVybCwgbG9jYXRpb25VUkwpKSB7XG5cdFx0XHRcdFx0XHRcdGZvciAoY29uc3QgbmFtZSBvZiBbJ2F1dGhvcml6YXRpb24nLCAnd3d3LWF1dGhlbnRpY2F0ZScsICdjb29raWUnLCAnY29va2llMiddKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmVxdWVzdE9wdGlvbnMuaGVhZGVycy5kZWxldGUobmFtZSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Ly8gSFRUUC1yZWRpcmVjdCBmZXRjaCBzdGVwIDlcblx0XHRcdFx0XHRcdGlmIChyZXNwb25zZV8uc3RhdHVzQ29kZSAhPT0gMzAzICYmIHJlcXVlc3QuYm9keSAmJiBvcHRpb25zXy5ib2R5IGluc3RhbmNlb2YgU3RyZWFtLlJlYWRhYmxlKSB7XG5cdFx0XHRcdFx0XHRcdHJlamVjdChuZXcgRmV0Y2hFcnJvcignQ2Fubm90IGZvbGxvdyByZWRpcmVjdCB3aXRoIGJvZHkgYmVpbmcgYSByZWFkYWJsZSBzdHJlYW0nLCAndW5zdXBwb3J0ZWQtcmVkaXJlY3QnKSk7XG5cdFx0XHRcdFx0XHRcdGZpbmFsaXplKCk7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Ly8gSFRUUC1yZWRpcmVjdCBmZXRjaCBzdGVwIDExXG5cdFx0XHRcdFx0XHRpZiAocmVzcG9uc2VfLnN0YXR1c0NvZGUgPT09IDMwMyB8fCAoKHJlc3BvbnNlXy5zdGF0dXNDb2RlID09PSAzMDEgfHwgcmVzcG9uc2VfLnN0YXR1c0NvZGUgPT09IDMwMikgJiYgcmVxdWVzdC5tZXRob2QgPT09ICdQT1NUJykpIHtcblx0XHRcdFx0XHRcdFx0cmVxdWVzdE9wdGlvbnMubWV0aG9kID0gJ0dFVCc7XG5cdFx0XHRcdFx0XHRcdHJlcXVlc3RPcHRpb25zLmJvZHkgPSB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0XHRcdHJlcXVlc3RPcHRpb25zLmhlYWRlcnMuZGVsZXRlKCdjb250ZW50LWxlbmd0aCcpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBIVFRQLXJlZGlyZWN0IGZldGNoIHN0ZXAgMTRcblx0XHRcdFx0XHRcdGNvbnN0IHJlc3BvbnNlUmVmZXJyZXJQb2xpY3kgPSBwYXJzZVJlZmVycmVyUG9saWN5RnJvbUhlYWRlcihoZWFkZXJzKTtcblx0XHRcdFx0XHRcdGlmIChyZXNwb25zZVJlZmVycmVyUG9saWN5KSB7XG5cdFx0XHRcdFx0XHRcdHJlcXVlc3RPcHRpb25zLnJlZmVycmVyUG9saWN5ID0gcmVzcG9uc2VSZWZlcnJlclBvbGljeTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Ly8gSFRUUC1yZWRpcmVjdCBmZXRjaCBzdGVwIDE1XG5cdFx0XHRcdFx0XHRyZXNvbHZlKGZldGNoKG5ldyBSZXF1ZXN0KGxvY2F0aW9uVVJMLCByZXF1ZXN0T3B0aW9ucykpKTtcblx0XHRcdFx0XHRcdGZpbmFsaXplKCk7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdHJldHVybiByZWplY3QobmV3IFR5cGVFcnJvcihgUmVkaXJlY3Qgb3B0aW9uICcke3JlcXVlc3QucmVkaXJlY3R9JyBpcyBub3QgYSB2YWxpZCB2YWx1ZSBvZiBSZXF1ZXN0UmVkaXJlY3RgKSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gUHJlcGFyZSByZXNwb25zZVxuXHRcdFx0aWYgKHNpZ25hbCkge1xuXHRcdFx0XHRyZXNwb25zZV8ub25jZSgnZW5kJywgKCkgPT4ge1xuXHRcdFx0XHRcdHNpZ25hbC5yZW1vdmVFdmVudExpc3RlbmVyKCdhYm9ydCcsIGFib3J0QW5kRmluYWxpemUpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0bGV0IGJvZHkgPSBwdW1wKHJlc3BvbnNlXywgbmV3IFBhc3NUaHJvdWdoKCksIGVycm9yID0+IHtcblx0XHRcdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRcdFx0cmVqZWN0KGVycm9yKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHQvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL25vZGVqcy9ub2RlL3B1bGwvMjkzNzZcblx0XHRcdC8qIGM4IGlnbm9yZSBuZXh0IDMgKi9cblx0XHRcdGlmIChwcm9jZXNzLnZlcnNpb24gPCAndjEyLjEwJykge1xuXHRcdFx0XHRyZXNwb25zZV8ub24oJ2Fib3J0ZWQnLCBhYm9ydEFuZEZpbmFsaXplKTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgcmVzcG9uc2VPcHRpb25zID0ge1xuXHRcdFx0XHR1cmw6IHJlcXVlc3QudXJsLFxuXHRcdFx0XHRzdGF0dXM6IHJlc3BvbnNlXy5zdGF0dXNDb2RlLFxuXHRcdFx0XHRzdGF0dXNUZXh0OiByZXNwb25zZV8uc3RhdHVzTWVzc2FnZSxcblx0XHRcdFx0aGVhZGVycyxcblx0XHRcdFx0c2l6ZTogcmVxdWVzdC5zaXplLFxuXHRcdFx0XHRjb3VudGVyOiByZXF1ZXN0LmNvdW50ZXIsXG5cdFx0XHRcdGhpZ2hXYXRlck1hcms6IHJlcXVlc3QuaGlnaFdhdGVyTWFya1xuXHRcdFx0fTtcblxuXHRcdFx0Ly8gSFRUUC1uZXR3b3JrIGZldGNoIHN0ZXAgMTIuMS4xLjNcblx0XHRcdGNvbnN0IGNvZGluZ3MgPSBoZWFkZXJzLmdldCgnQ29udGVudC1FbmNvZGluZycpO1xuXG5cdFx0XHQvLyBIVFRQLW5ldHdvcmsgZmV0Y2ggc3RlcCAxMi4xLjEuNDogaGFuZGxlIGNvbnRlbnQgY29kaW5nc1xuXG5cdFx0XHQvLyBpbiBmb2xsb3dpbmcgc2NlbmFyaW9zIHdlIGlnbm9yZSBjb21wcmVzc2lvbiBzdXBwb3J0XG5cdFx0XHQvLyAxLiBjb21wcmVzc2lvbiBzdXBwb3J0IGlzIGRpc2FibGVkXG5cdFx0XHQvLyAyLiBIRUFEIHJlcXVlc3Rcblx0XHRcdC8vIDMuIG5vIENvbnRlbnQtRW5jb2RpbmcgaGVhZGVyXG5cdFx0XHQvLyA0LiBubyBjb250ZW50IHJlc3BvbnNlICgyMDQpXG5cdFx0XHQvLyA1LiBjb250ZW50IG5vdCBtb2RpZmllZCByZXNwb25zZSAoMzA0KVxuXHRcdFx0aWYgKCFyZXF1ZXN0LmNvbXByZXNzIHx8IHJlcXVlc3QubWV0aG9kID09PSAnSEVBRCcgfHwgY29kaW5ncyA9PT0gbnVsbCB8fCByZXNwb25zZV8uc3RhdHVzQ29kZSA9PT0gMjA0IHx8IHJlc3BvbnNlXy5zdGF0dXNDb2RlID09PSAzMDQpIHtcblx0XHRcdFx0cmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UoYm9keSwgcmVzcG9uc2VPcHRpb25zKTtcblx0XHRcdFx0cmVzb2x2ZShyZXNwb25zZSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gRm9yIE5vZGUgdjYrXG5cdFx0XHQvLyBCZSBsZXNzIHN0cmljdCB3aGVuIGRlY29kaW5nIGNvbXByZXNzZWQgcmVzcG9uc2VzLCBzaW5jZSBzb21ldGltZXNcblx0XHRcdC8vIHNlcnZlcnMgc2VuZCBzbGlnaHRseSBpbnZhbGlkIHJlc3BvbnNlcyB0aGF0IGFyZSBzdGlsbCBhY2NlcHRlZFxuXHRcdFx0Ly8gYnkgY29tbW9uIGJyb3dzZXJzLlxuXHRcdFx0Ly8gQWx3YXlzIHVzaW5nIFpfU1lOQ19GTFVTSCBpcyB3aGF0IGNVUkwgZG9lcy5cblx0XHRcdGNvbnN0IHpsaWJPcHRpb25zID0ge1xuXHRcdFx0XHRmbHVzaDogemxpYi5aX1NZTkNfRkxVU0gsXG5cdFx0XHRcdGZpbmlzaEZsdXNoOiB6bGliLlpfU1lOQ19GTFVTSFxuXHRcdFx0fTtcblxuXHRcdFx0Ly8gRm9yIGd6aXBcblx0XHRcdGlmIChjb2RpbmdzID09PSAnZ3ppcCcgfHwgY29kaW5ncyA9PT0gJ3gtZ3ppcCcpIHtcblx0XHRcdFx0Ym9keSA9IHB1bXAoYm9keSwgemxpYi5jcmVhdGVHdW56aXAoemxpYk9wdGlvbnMpLCBlcnJvciA9PiB7XG5cdFx0XHRcdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRcdFx0XHRyZWplY3QoZXJyb3IpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKGJvZHksIHJlc3BvbnNlT3B0aW9ucyk7XG5cdFx0XHRcdHJlc29sdmUocmVzcG9uc2UpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIEZvciBkZWZsYXRlXG5cdFx0XHRpZiAoY29kaW5ncyA9PT0gJ2RlZmxhdGUnIHx8IGNvZGluZ3MgPT09ICd4LWRlZmxhdGUnKSB7XG5cdFx0XHRcdC8vIEhhbmRsZSB0aGUgaW5mYW1vdXMgcmF3IGRlZmxhdGUgcmVzcG9uc2UgZnJvbSBvbGQgc2VydmVyc1xuXHRcdFx0XHQvLyBhIGhhY2sgZm9yIG9sZCBJSVMgYW5kIEFwYWNoZSBzZXJ2ZXJzXG5cdFx0XHRcdGNvbnN0IHJhdyA9IHB1bXAocmVzcG9uc2VfLCBuZXcgUGFzc1Rocm91Z2goKSwgZXJyb3IgPT4ge1xuXHRcdFx0XHRcdGlmIChlcnJvcikge1xuXHRcdFx0XHRcdFx0cmVqZWN0KGVycm9yKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRyYXcub25jZSgnZGF0YScsIGNodW5rID0+IHtcblx0XHRcdFx0XHQvLyBTZWUgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zNzUxOTgyOFxuXHRcdFx0XHRcdGlmICgoY2h1bmtbMF0gJiAweDBGKSA9PT0gMHgwOCkge1xuXHRcdFx0XHRcdFx0Ym9keSA9IHB1bXAoYm9keSwgemxpYi5jcmVhdGVJbmZsYXRlKCksIGVycm9yID0+IHtcblx0XHRcdFx0XHRcdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmVqZWN0KGVycm9yKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGJvZHkgPSBwdW1wKGJvZHksIHpsaWIuY3JlYXRlSW5mbGF0ZVJhdygpLCBlcnJvciA9PiB7XG5cdFx0XHRcdFx0XHRcdGlmIChlcnJvcikge1xuXHRcdFx0XHRcdFx0XHRcdHJlamVjdChlcnJvcik7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKGJvZHksIHJlc3BvbnNlT3B0aW9ucyk7XG5cdFx0XHRcdFx0cmVzb2x2ZShyZXNwb25zZSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRyYXcub25jZSgnZW5kJywgKCkgPT4ge1xuXHRcdFx0XHRcdC8vIFNvbWUgb2xkIElJUyBzZXJ2ZXJzIHJldHVybiB6ZXJvLWxlbmd0aCBPSyBkZWZsYXRlIHJlc3BvbnNlcywgc29cblx0XHRcdFx0XHQvLyAnZGF0YScgaXMgbmV2ZXIgZW1pdHRlZC4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9ub2RlLWZldGNoL25vZGUtZmV0Y2gvcHVsbC85MDNcblx0XHRcdFx0XHRpZiAoIXJlc3BvbnNlKSB7XG5cdFx0XHRcdFx0XHRyZXNwb25zZSA9IG5ldyBSZXNwb25zZShib2R5LCByZXNwb25zZU9wdGlvbnMpO1xuXHRcdFx0XHRcdFx0cmVzb2x2ZShyZXNwb25zZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBGb3IgYnJcblx0XHRcdGlmIChjb2RpbmdzID09PSAnYnInKSB7XG5cdFx0XHRcdGJvZHkgPSBwdW1wKGJvZHksIHpsaWIuY3JlYXRlQnJvdGxpRGVjb21wcmVzcygpLCBlcnJvciA9PiB7XG5cdFx0XHRcdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRcdFx0XHRyZWplY3QoZXJyb3IpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKGJvZHksIHJlc3BvbnNlT3B0aW9ucyk7XG5cdFx0XHRcdHJlc29sdmUocmVzcG9uc2UpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIE90aGVyd2lzZSwgdXNlIHJlc3BvbnNlIGFzLWlzXG5cdFx0XHRyZXNwb25zZSA9IG5ldyBSZXNwb25zZShib2R5LCByZXNwb25zZU9wdGlvbnMpO1xuXHRcdFx0cmVzb2x2ZShyZXNwb25zZSk7XG5cdFx0fSk7XG5cblx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcHJvbWlzZS9wcmVmZXItYXdhaXQtdG8tdGhlblxuXHRcdHdyaXRlVG9TdHJlYW0ocmVxdWVzdF8sIHJlcXVlc3QpLmNhdGNoKHJlamVjdCk7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBmaXhSZXNwb25zZUNodW5rZWRUcmFuc2ZlckJhZEVuZGluZyhyZXF1ZXN0LCBlcnJvckNhbGxiYWNrKSB7XG5cdGNvbnN0IExBU1RfQ0hVTksgPSBCdWZmZXIuZnJvbSgnMFxcclxcblxcclxcbicpO1xuXG5cdGxldCBpc0NodW5rZWRUcmFuc2ZlciA9IGZhbHNlO1xuXHRsZXQgcHJvcGVyTGFzdENodW5rUmVjZWl2ZWQgPSBmYWxzZTtcblx0bGV0IHByZXZpb3VzQ2h1bms7XG5cblx0cmVxdWVzdC5vbigncmVzcG9uc2UnLCByZXNwb25zZSA9PiB7XG5cdFx0Y29uc3Qge2hlYWRlcnN9ID0gcmVzcG9uc2U7XG5cdFx0aXNDaHVua2VkVHJhbnNmZXIgPSBoZWFkZXJzWyd0cmFuc2Zlci1lbmNvZGluZyddID09PSAnY2h1bmtlZCcgJiYgIWhlYWRlcnNbJ2NvbnRlbnQtbGVuZ3RoJ107XG5cdH0pO1xuXG5cdHJlcXVlc3Qub24oJ3NvY2tldCcsIHNvY2tldCA9PiB7XG5cdFx0Y29uc3Qgb25Tb2NrZXRDbG9zZSA9ICgpID0+IHtcblx0XHRcdGlmIChpc0NodW5rZWRUcmFuc2ZlciAmJiAhcHJvcGVyTGFzdENodW5rUmVjZWl2ZWQpIHtcblx0XHRcdFx0Y29uc3QgZXJyb3IgPSBuZXcgRXJyb3IoJ1ByZW1hdHVyZSBjbG9zZScpO1xuXHRcdFx0XHRlcnJvci5jb2RlID0gJ0VSUl9TVFJFQU1fUFJFTUFUVVJFX0NMT1NFJztcblx0XHRcdFx0ZXJyb3JDYWxsYmFjayhlcnJvcik7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdGNvbnN0IG9uRGF0YSA9IGJ1ZiA9PiB7XG5cdFx0XHRwcm9wZXJMYXN0Q2h1bmtSZWNlaXZlZCA9IEJ1ZmZlci5jb21wYXJlKGJ1Zi5zbGljZSgtNSksIExBU1RfQ0hVTkspID09PSAwO1xuXG5cdFx0XHQvLyBTb21ldGltZXMgZmluYWwgMC1sZW5ndGggY2h1bmsgYW5kIGVuZCBvZiBtZXNzYWdlIGNvZGUgYXJlIGluIHNlcGFyYXRlIHBhY2tldHNcblx0XHRcdGlmICghcHJvcGVyTGFzdENodW5rUmVjZWl2ZWQgJiYgcHJldmlvdXNDaHVuaykge1xuXHRcdFx0XHRwcm9wZXJMYXN0Q2h1bmtSZWNlaXZlZCA9IChcblx0XHRcdFx0XHRCdWZmZXIuY29tcGFyZShwcmV2aW91c0NodW5rLnNsaWNlKC0zKSwgTEFTVF9DSFVOSy5zbGljZSgwLCAzKSkgPT09IDAgJiZcblx0XHRcdFx0XHRCdWZmZXIuY29tcGFyZShidWYuc2xpY2UoLTIpLCBMQVNUX0NIVU5LLnNsaWNlKDMpKSA9PT0gMFxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXG5cdFx0XHRwcmV2aW91c0NodW5rID0gYnVmO1xuXHRcdH07XG5cblx0XHRzb2NrZXQucHJlcGVuZExpc3RlbmVyKCdjbG9zZScsIG9uU29ja2V0Q2xvc2UpO1xuXHRcdHNvY2tldC5vbignZGF0YScsIG9uRGF0YSk7XG5cblx0XHRyZXF1ZXN0Lm9uKCdjbG9zZScsICgpID0+IHtcblx0XHRcdHNvY2tldC5yZW1vdmVMaXN0ZW5lcignY2xvc2UnLCBvblNvY2tldENsb3NlKTtcblx0XHRcdHNvY2tldC5yZW1vdmVMaXN0ZW5lcignZGF0YScsIG9uRGF0YSk7XG5cdFx0fSk7XG5cdH0pO1xufVxuIiwgImV4cG9ydCBpbnRlcmZhY2UgTWltZUJ1ZmZlciBleHRlbmRzIEJ1ZmZlciB7XG5cdHR5cGU6IHN0cmluZztcblx0dHlwZUZ1bGw6IHN0cmluZztcblx0Y2hhcnNldDogc3RyaW5nO1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBgQnVmZmVyYCBpbnN0YW5jZSBmcm9tIHRoZSBnaXZlbiBkYXRhIFVSSSBgdXJpYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJpIERhdGEgVVJJIHRvIHR1cm4gaW50byBhIEJ1ZmZlciBpbnN0YW5jZVxuICogQHJldHVybnMge0J1ZmZlcn0gQnVmZmVyIGluc3RhbmNlIGZyb20gRGF0YSBVUklcbiAqIEBhcGkgcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkYXRhVXJpVG9CdWZmZXIodXJpOiBzdHJpbmcpOiBNaW1lQnVmZmVyIHtcblx0aWYgKCEvXmRhdGE6L2kudGVzdCh1cmkpKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihcblx0XHRcdCdgdXJpYCBkb2VzIG5vdCBhcHBlYXIgdG8gYmUgYSBEYXRhIFVSSSAobXVzdCBiZWdpbiB3aXRoIFwiZGF0YTpcIiknXG5cdFx0KTtcblx0fVxuXG5cdC8vIHN0cmlwIG5ld2xpbmVzXG5cdHVyaSA9IHVyaS5yZXBsYWNlKC9cXHI/XFxuL2csICcnKTtcblxuXHQvLyBzcGxpdCB0aGUgVVJJIHVwIGludG8gdGhlIFwibWV0YWRhdGFcIiBhbmQgdGhlIFwiZGF0YVwiIHBvcnRpb25zXG5cdGNvbnN0IGZpcnN0Q29tbWEgPSB1cmkuaW5kZXhPZignLCcpO1xuXHRpZiAoZmlyc3RDb21tYSA9PT0gLTEgfHwgZmlyc3RDb21tYSA8PSA0KSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignbWFsZm9ybWVkIGRhdGE6IFVSSScpO1xuXHR9XG5cblx0Ly8gcmVtb3ZlIHRoZSBcImRhdGE6XCIgc2NoZW1lIGFuZCBwYXJzZSB0aGUgbWV0YWRhdGFcblx0Y29uc3QgbWV0YSA9IHVyaS5zdWJzdHJpbmcoNSwgZmlyc3RDb21tYSkuc3BsaXQoJzsnKTtcblxuXHRsZXQgY2hhcnNldCA9ICcnO1xuXHRsZXQgYmFzZTY0ID0gZmFsc2U7XG5cdGNvbnN0IHR5cGUgPSBtZXRhWzBdIHx8ICd0ZXh0L3BsYWluJztcblx0bGV0IHR5cGVGdWxsID0gdHlwZTtcblx0Zm9yIChsZXQgaSA9IDE7IGkgPCBtZXRhLmxlbmd0aDsgaSsrKSB7XG5cdFx0aWYgKG1ldGFbaV0gPT09ICdiYXNlNjQnKSB7XG5cdFx0XHRiYXNlNjQgPSB0cnVlO1xuXHRcdH0gZWxzZSBpZihtZXRhW2ldKSB7XG5cdFx0XHR0eXBlRnVsbCArPSBgOyR7ICBtZXRhW2ldfWA7XG5cdFx0XHRpZiAobWV0YVtpXS5pbmRleE9mKCdjaGFyc2V0PScpID09PSAwKSB7XG5cdFx0XHRcdGNoYXJzZXQgPSBtZXRhW2ldLnN1YnN0cmluZyg4KTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0Ly8gZGVmYXVsdHMgdG8gVVMtQVNDSUkgb25seSBpZiB0eXBlIGlzIG5vdCBwcm92aWRlZFxuXHRpZiAoIW1ldGFbMF0gJiYgIWNoYXJzZXQubGVuZ3RoKSB7XG5cdFx0dHlwZUZ1bGwgKz0gJztjaGFyc2V0PVVTLUFTQ0lJJztcblx0XHRjaGFyc2V0ID0gJ1VTLUFTQ0lJJztcblx0fVxuXG5cdC8vIGdldCB0aGUgZW5jb2RlZCBkYXRhIHBvcnRpb24gYW5kIGRlY29kZSBVUkktZW5jb2RlZCBjaGFyc1xuXHRjb25zdCBlbmNvZGluZyA9IGJhc2U2NCA/ICdiYXNlNjQnIDogJ2FzY2lpJztcblx0Y29uc3QgZGF0YSA9IHVuZXNjYXBlKHVyaS5zdWJzdHJpbmcoZmlyc3RDb21tYSArIDEpKTtcblx0Y29uc3QgYnVmZmVyID0gQnVmZmVyLmZyb20oZGF0YSwgZW5jb2RpbmcpIGFzIE1pbWVCdWZmZXI7XG5cblx0Ly8gc2V0IGAudHlwZWAgYW5kIGAudHlwZUZ1bGxgIHByb3BlcnRpZXMgdG8gTUlNRSB0eXBlXG5cdGJ1ZmZlci50eXBlID0gdHlwZTtcblx0YnVmZmVyLnR5cGVGdWxsID0gdHlwZUZ1bGw7XG5cblx0Ly8gc2V0IHRoZSBgLmNoYXJzZXRgIHByb3BlcnR5XG5cdGJ1ZmZlci5jaGFyc2V0ID0gY2hhcnNldDtcblxuXHRyZXR1cm4gYnVmZmVyO1xufVxuXG5leHBvcnQgZGVmYXVsdCBkYXRhVXJpVG9CdWZmZXI7XG4iLCAiXG4vKipcbiAqIEJvZHkuanNcbiAqXG4gKiBCb2R5IGludGVyZmFjZSBwcm92aWRlcyBjb21tb24gbWV0aG9kcyBmb3IgUmVxdWVzdCBhbmQgUmVzcG9uc2VcbiAqL1xuXG5pbXBvcnQgU3RyZWFtLCB7UGFzc1Rocm91Z2h9IGZyb20gJ25vZGU6c3RyZWFtJztcbmltcG9ydCB7dHlwZXMsIGRlcHJlY2F0ZSwgcHJvbWlzaWZ5fSBmcm9tICdub2RlOnV0aWwnO1xuaW1wb3J0IHtCdWZmZXJ9IGZyb20gJ25vZGU6YnVmZmVyJztcblxuaW1wb3J0IEJsb2IgZnJvbSAnZmV0Y2gtYmxvYic7XG5pbXBvcnQge0Zvcm1EYXRhLCBmb3JtRGF0YVRvQmxvYn0gZnJvbSAnZm9ybWRhdGEtcG9seWZpbGwvZXNtLm1pbi5qcyc7XG5cbmltcG9ydCB7RmV0Y2hFcnJvcn0gZnJvbSAnLi9lcnJvcnMvZmV0Y2gtZXJyb3IuanMnO1xuaW1wb3J0IHtGZXRjaEJhc2VFcnJvcn0gZnJvbSAnLi9lcnJvcnMvYmFzZS5qcyc7XG5pbXBvcnQge2lzQmxvYiwgaXNVUkxTZWFyY2hQYXJhbWV0ZXJzfSBmcm9tICcuL3V0aWxzL2lzLmpzJztcblxuY29uc3QgcGlwZWxpbmUgPSBwcm9taXNpZnkoU3RyZWFtLnBpcGVsaW5lKTtcbmNvbnN0IElOVEVSTkFMUyA9IFN5bWJvbCgnQm9keSBpbnRlcm5hbHMnKTtcblxuLyoqXG4gKiBCb2R5IG1peGluXG4gKlxuICogUmVmOiBodHRwczovL2ZldGNoLnNwZWMud2hhdHdnLm9yZy8jYm9keVxuICpcbiAqIEBwYXJhbSAgIFN0cmVhbSAgYm9keSAgUmVhZGFibGUgc3RyZWFtXG4gKiBAcGFyYW0gICBPYmplY3QgIG9wdHMgIFJlc3BvbnNlIG9wdGlvbnNcbiAqIEByZXR1cm4gIFZvaWRcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQm9keSB7XG5cdGNvbnN0cnVjdG9yKGJvZHksIHtcblx0XHRzaXplID0gMFxuXHR9ID0ge30pIHtcblx0XHRsZXQgYm91bmRhcnkgPSBudWxsO1xuXG5cdFx0aWYgKGJvZHkgPT09IG51bGwpIHtcblx0XHRcdC8vIEJvZHkgaXMgdW5kZWZpbmVkIG9yIG51bGxcblx0XHRcdGJvZHkgPSBudWxsO1xuXHRcdH0gZWxzZSBpZiAoaXNVUkxTZWFyY2hQYXJhbWV0ZXJzKGJvZHkpKSB7XG5cdFx0XHQvLyBCb2R5IGlzIGEgVVJMU2VhcmNoUGFyYW1zXG5cdFx0XHRib2R5ID0gQnVmZmVyLmZyb20oYm9keS50b1N0cmluZygpKTtcblx0XHR9IGVsc2UgaWYgKGlzQmxvYihib2R5KSkge1xuXHRcdFx0Ly8gQm9keSBpcyBibG9iXG5cdFx0fSBlbHNlIGlmIChCdWZmZXIuaXNCdWZmZXIoYm9keSkpIHtcblx0XHRcdC8vIEJvZHkgaXMgQnVmZmVyXG5cdFx0fSBlbHNlIGlmICh0eXBlcy5pc0FueUFycmF5QnVmZmVyKGJvZHkpKSB7XG5cdFx0XHQvLyBCb2R5IGlzIEFycmF5QnVmZmVyXG5cdFx0XHRib2R5ID0gQnVmZmVyLmZyb20oYm9keSk7XG5cdFx0fSBlbHNlIGlmIChBcnJheUJ1ZmZlci5pc1ZpZXcoYm9keSkpIHtcblx0XHRcdC8vIEJvZHkgaXMgQXJyYXlCdWZmZXJWaWV3XG5cdFx0XHRib2R5ID0gQnVmZmVyLmZyb20oYm9keS5idWZmZXIsIGJvZHkuYnl0ZU9mZnNldCwgYm9keS5ieXRlTGVuZ3RoKTtcblx0XHR9IGVsc2UgaWYgKGJvZHkgaW5zdGFuY2VvZiBTdHJlYW0pIHtcblx0XHRcdC8vIEJvZHkgaXMgc3RyZWFtXG5cdFx0fSBlbHNlIGlmIChib2R5IGluc3RhbmNlb2YgRm9ybURhdGEpIHtcblx0XHRcdC8vIEJvZHkgaXMgRm9ybURhdGFcblx0XHRcdGJvZHkgPSBmb3JtRGF0YVRvQmxvYihib2R5KTtcblx0XHRcdGJvdW5kYXJ5ID0gYm9keS50eXBlLnNwbGl0KCc9JylbMV07XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIE5vbmUgb2YgdGhlIGFib3ZlXG5cdFx0XHQvLyBjb2VyY2UgdG8gc3RyaW5nIHRoZW4gYnVmZmVyXG5cdFx0XHRib2R5ID0gQnVmZmVyLmZyb20oU3RyaW5nKGJvZHkpKTtcblx0XHR9XG5cblx0XHRsZXQgc3RyZWFtID0gYm9keTtcblxuXHRcdGlmIChCdWZmZXIuaXNCdWZmZXIoYm9keSkpIHtcblx0XHRcdHN0cmVhbSA9IFN0cmVhbS5SZWFkYWJsZS5mcm9tKGJvZHkpO1xuXHRcdH0gZWxzZSBpZiAoaXNCbG9iKGJvZHkpKSB7XG5cdFx0XHRzdHJlYW0gPSBTdHJlYW0uUmVhZGFibGUuZnJvbShib2R5LnN0cmVhbSgpKTtcblx0XHR9XG5cblx0XHR0aGlzW0lOVEVSTkFMU10gPSB7XG5cdFx0XHRib2R5LFxuXHRcdFx0c3RyZWFtLFxuXHRcdFx0Ym91bmRhcnksXG5cdFx0XHRkaXN0dXJiZWQ6IGZhbHNlLFxuXHRcdFx0ZXJyb3I6IG51bGxcblx0XHR9O1xuXHRcdHRoaXMuc2l6ZSA9IHNpemU7XG5cblx0XHRpZiAoYm9keSBpbnN0YW5jZW9mIFN0cmVhbSkge1xuXHRcdFx0Ym9keS5vbignZXJyb3InLCBlcnJvcl8gPT4ge1xuXHRcdFx0XHRjb25zdCBlcnJvciA9IGVycm9yXyBpbnN0YW5jZW9mIEZldGNoQmFzZUVycm9yID9cblx0XHRcdFx0XHRlcnJvcl8gOlxuXHRcdFx0XHRcdG5ldyBGZXRjaEVycm9yKGBJbnZhbGlkIHJlc3BvbnNlIGJvZHkgd2hpbGUgdHJ5aW5nIHRvIGZldGNoICR7dGhpcy51cmx9OiAke2Vycm9yXy5tZXNzYWdlfWAsICdzeXN0ZW0nLCBlcnJvcl8pO1xuXHRcdFx0XHR0aGlzW0lOVEVSTkFMU10uZXJyb3IgPSBlcnJvcjtcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdGdldCBib2R5KCkge1xuXHRcdHJldHVybiB0aGlzW0lOVEVSTkFMU10uc3RyZWFtO1xuXHR9XG5cblx0Z2V0IGJvZHlVc2VkKCkge1xuXHRcdHJldHVybiB0aGlzW0lOVEVSTkFMU10uZGlzdHVyYmVkO1xuXHR9XG5cblx0LyoqXG5cdCAqIERlY29kZSByZXNwb25zZSBhcyBBcnJheUJ1ZmZlclxuXHQgKlxuXHQgKiBAcmV0dXJuICBQcm9taXNlXG5cdCAqL1xuXHRhc3luYyBhcnJheUJ1ZmZlcigpIHtcblx0XHRjb25zdCB7YnVmZmVyLCBieXRlT2Zmc2V0LCBieXRlTGVuZ3RofSA9IGF3YWl0IGNvbnN1bWVCb2R5KHRoaXMpO1xuXHRcdHJldHVybiBidWZmZXIuc2xpY2UoYnl0ZU9mZnNldCwgYnl0ZU9mZnNldCArIGJ5dGVMZW5ndGgpO1xuXHR9XG5cblx0YXN5bmMgZm9ybURhdGEoKSB7XG5cdFx0Y29uc3QgY3QgPSB0aGlzLmhlYWRlcnMuZ2V0KCdjb250ZW50LXR5cGUnKTtcblxuXHRcdGlmIChjdC5zdGFydHNXaXRoKCdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKSkge1xuXHRcdFx0Y29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcblx0XHRcdGNvbnN0IHBhcmFtZXRlcnMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKGF3YWl0IHRoaXMudGV4dCgpKTtcblxuXHRcdFx0Zm9yIChjb25zdCBbbmFtZSwgdmFsdWVdIG9mIHBhcmFtZXRlcnMpIHtcblx0XHRcdFx0Zm9ybURhdGEuYXBwZW5kKG5hbWUsIHZhbHVlKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGZvcm1EYXRhO1xuXHRcdH1cblxuXHRcdGNvbnN0IHt0b0Zvcm1EYXRhfSA9IGF3YWl0IGltcG9ydCgnLi91dGlscy9tdWx0aXBhcnQtcGFyc2VyLmpzJyk7XG5cdFx0cmV0dXJuIHRvRm9ybURhdGEodGhpcy5ib2R5LCBjdCk7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJuIHJhdyByZXNwb25zZSBhcyBCbG9iXG5cdCAqXG5cdCAqIEByZXR1cm4gUHJvbWlzZVxuXHQgKi9cblx0YXN5bmMgYmxvYigpIHtcblx0XHRjb25zdCBjdCA9ICh0aGlzLmhlYWRlcnMgJiYgdGhpcy5oZWFkZXJzLmdldCgnY29udGVudC10eXBlJykpIHx8ICh0aGlzW0lOVEVSTkFMU10uYm9keSAmJiB0aGlzW0lOVEVSTkFMU10uYm9keS50eXBlKSB8fCAnJztcblx0XHRjb25zdCBidWYgPSBhd2FpdCB0aGlzLmFycmF5QnVmZmVyKCk7XG5cblx0XHRyZXR1cm4gbmV3IEJsb2IoW2J1Zl0sIHtcblx0XHRcdHR5cGU6IGN0XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogRGVjb2RlIHJlc3BvbnNlIGFzIGpzb25cblx0ICpcblx0ICogQHJldHVybiAgUHJvbWlzZVxuXHQgKi9cblx0YXN5bmMganNvbigpIHtcblx0XHRjb25zdCB0ZXh0ID0gYXdhaXQgdGhpcy50ZXh0KCk7XG5cdFx0cmV0dXJuIEpTT04ucGFyc2UodGV4dCk7XG5cdH1cblxuXHQvKipcblx0ICogRGVjb2RlIHJlc3BvbnNlIGFzIHRleHRcblx0ICpcblx0ICogQHJldHVybiAgUHJvbWlzZVxuXHQgKi9cblx0YXN5bmMgdGV4dCgpIHtcblx0XHRjb25zdCBidWZmZXIgPSBhd2FpdCBjb25zdW1lQm9keSh0aGlzKTtcblx0XHRyZXR1cm4gbmV3IFRleHREZWNvZGVyKCkuZGVjb2RlKGJ1ZmZlcik7XG5cdH1cblxuXHQvKipcblx0ICogRGVjb2RlIHJlc3BvbnNlIGFzIGJ1ZmZlciAobm9uLXNwZWMgYXBpKVxuXHQgKlxuXHQgKiBAcmV0dXJuICBQcm9taXNlXG5cdCAqL1xuXHRidWZmZXIoKSB7XG5cdFx0cmV0dXJuIGNvbnN1bWVCb2R5KHRoaXMpO1xuXHR9XG59XG5cbkJvZHkucHJvdG90eXBlLmJ1ZmZlciA9IGRlcHJlY2F0ZShCb2R5LnByb3RvdHlwZS5idWZmZXIsICdQbGVhc2UgdXNlIFxcJ3Jlc3BvbnNlLmFycmF5QnVmZmVyKClcXCcgaW5zdGVhZCBvZiBcXCdyZXNwb25zZS5idWZmZXIoKVxcJycsICdub2RlLWZldGNoI2J1ZmZlcicpO1xuXG4vLyBJbiBicm93c2VycywgYWxsIHByb3BlcnRpZXMgYXJlIGVudW1lcmFibGUuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyhCb2R5LnByb3RvdHlwZSwge1xuXHRib2R5OiB7ZW51bWVyYWJsZTogdHJ1ZX0sXG5cdGJvZHlVc2VkOiB7ZW51bWVyYWJsZTogdHJ1ZX0sXG5cdGFycmF5QnVmZmVyOiB7ZW51bWVyYWJsZTogdHJ1ZX0sXG5cdGJsb2I6IHtlbnVtZXJhYmxlOiB0cnVlfSxcblx0anNvbjoge2VudW1lcmFibGU6IHRydWV9LFxuXHR0ZXh0OiB7ZW51bWVyYWJsZTogdHJ1ZX0sXG5cdGRhdGE6IHtnZXQ6IGRlcHJlY2F0ZSgoKSA9PiB7fSxcblx0XHQnZGF0YSBkb2VzblxcJ3QgZXhpc3QsIHVzZSBqc29uKCksIHRleHQoKSwgYXJyYXlCdWZmZXIoKSwgb3IgYm9keSBpbnN0ZWFkJyxcblx0XHQnaHR0cHM6Ly9naXRodWIuY29tL25vZGUtZmV0Y2gvbm9kZS1mZXRjaC9pc3N1ZXMvMTAwMCAocmVzcG9uc2UpJyl9XG59KTtcblxuLyoqXG4gKiBDb25zdW1lIGFuZCBjb252ZXJ0IGFuIGVudGlyZSBCb2R5IHRvIGEgQnVmZmVyLlxuICpcbiAqIFJlZjogaHR0cHM6Ly9mZXRjaC5zcGVjLndoYXR3Zy5vcmcvI2NvbmNlcHQtYm9keS1jb25zdW1lLWJvZHlcbiAqXG4gKiBAcmV0dXJuIFByb21pc2VcbiAqL1xuYXN5bmMgZnVuY3Rpb24gY29uc3VtZUJvZHkoZGF0YSkge1xuXHRpZiAoZGF0YVtJTlRFUk5BTFNdLmRpc3R1cmJlZCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoYGJvZHkgdXNlZCBhbHJlYWR5IGZvcjogJHtkYXRhLnVybH1gKTtcblx0fVxuXG5cdGRhdGFbSU5URVJOQUxTXS5kaXN0dXJiZWQgPSB0cnVlO1xuXG5cdGlmIChkYXRhW0lOVEVSTkFMU10uZXJyb3IpIHtcblx0XHR0aHJvdyBkYXRhW0lOVEVSTkFMU10uZXJyb3I7XG5cdH1cblxuXHRjb25zdCB7Ym9keX0gPSBkYXRhO1xuXG5cdC8vIEJvZHkgaXMgbnVsbFxuXHRpZiAoYm9keSA9PT0gbnVsbCkge1xuXHRcdHJldHVybiBCdWZmZXIuYWxsb2MoMCk7XG5cdH1cblxuXHQvKiBjOCBpZ25vcmUgbmV4dCAzICovXG5cdGlmICghKGJvZHkgaW5zdGFuY2VvZiBTdHJlYW0pKSB7XG5cdFx0cmV0dXJuIEJ1ZmZlci5hbGxvYygwKTtcblx0fVxuXG5cdC8vIEJvZHkgaXMgc3RyZWFtXG5cdC8vIGdldCByZWFkeSB0byBhY3R1YWxseSBjb25zdW1lIHRoZSBib2R5XG5cdGNvbnN0IGFjY3VtID0gW107XG5cdGxldCBhY2N1bUJ5dGVzID0gMDtcblxuXHR0cnkge1xuXHRcdGZvciBhd2FpdCAoY29uc3QgY2h1bmsgb2YgYm9keSkge1xuXHRcdFx0aWYgKGRhdGEuc2l6ZSA+IDAgJiYgYWNjdW1CeXRlcyArIGNodW5rLmxlbmd0aCA+IGRhdGEuc2l6ZSkge1xuXHRcdFx0XHRjb25zdCBlcnJvciA9IG5ldyBGZXRjaEVycm9yKGBjb250ZW50IHNpemUgYXQgJHtkYXRhLnVybH0gb3ZlciBsaW1pdDogJHtkYXRhLnNpemV9YCwgJ21heC1zaXplJyk7XG5cdFx0XHRcdGJvZHkuZGVzdHJveShlcnJvcik7XG5cdFx0XHRcdHRocm93IGVycm9yO1xuXHRcdFx0fVxuXG5cdFx0XHRhY2N1bUJ5dGVzICs9IGNodW5rLmxlbmd0aDtcblx0XHRcdGFjY3VtLnB1c2goY2h1bmspO1xuXHRcdH1cblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zdCBlcnJvcl8gPSBlcnJvciBpbnN0YW5jZW9mIEZldGNoQmFzZUVycm9yID8gZXJyb3IgOiBuZXcgRmV0Y2hFcnJvcihgSW52YWxpZCByZXNwb25zZSBib2R5IHdoaWxlIHRyeWluZyB0byBmZXRjaCAke2RhdGEudXJsfTogJHtlcnJvci5tZXNzYWdlfWAsICdzeXN0ZW0nLCBlcnJvcik7XG5cdFx0dGhyb3cgZXJyb3JfO1xuXHR9XG5cblx0aWYgKGJvZHkucmVhZGFibGVFbmRlZCA9PT0gdHJ1ZSB8fCBib2R5Ll9yZWFkYWJsZVN0YXRlLmVuZGVkID09PSB0cnVlKSB7XG5cdFx0dHJ5IHtcblx0XHRcdGlmIChhY2N1bS5ldmVyeShjID0+IHR5cGVvZiBjID09PSAnc3RyaW5nJykpIHtcblx0XHRcdFx0cmV0dXJuIEJ1ZmZlci5mcm9tKGFjY3VtLmpvaW4oJycpKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIEJ1ZmZlci5jb25jYXQoYWNjdW0sIGFjY3VtQnl0ZXMpO1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHR0aHJvdyBuZXcgRmV0Y2hFcnJvcihgQ291bGQgbm90IGNyZWF0ZSBCdWZmZXIgZnJvbSByZXNwb25zZSBib2R5IGZvciAke2RhdGEudXJsfTogJHtlcnJvci5tZXNzYWdlfWAsICdzeXN0ZW0nLCBlcnJvcik7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdHRocm93IG5ldyBGZXRjaEVycm9yKGBQcmVtYXR1cmUgY2xvc2Ugb2Ygc2VydmVyIHJlc3BvbnNlIHdoaWxlIHRyeWluZyB0byBmZXRjaCAke2RhdGEudXJsfWApO1xuXHR9XG59XG5cbi8qKlxuICogQ2xvbmUgYm9keSBnaXZlbiBSZXMvUmVxIGluc3RhbmNlXG4gKlxuICogQHBhcmFtICAgTWl4ZWQgICBpbnN0YW5jZSAgICAgICBSZXNwb25zZSBvciBSZXF1ZXN0IGluc3RhbmNlXG4gKiBAcGFyYW0gICBTdHJpbmcgIGhpZ2hXYXRlck1hcmsgIGhpZ2hXYXRlck1hcmsgZm9yIGJvdGggUGFzc1Rocm91Z2ggYm9keSBzdHJlYW1zXG4gKiBAcmV0dXJuICBNaXhlZFxuICovXG5leHBvcnQgY29uc3QgY2xvbmUgPSAoaW5zdGFuY2UsIGhpZ2hXYXRlck1hcmspID0+IHtcblx0bGV0IHAxO1xuXHRsZXQgcDI7XG5cdGxldCB7Ym9keX0gPSBpbnN0YW5jZVtJTlRFUk5BTFNdO1xuXG5cdC8vIERvbid0IGFsbG93IGNsb25pbmcgYSB1c2VkIGJvZHlcblx0aWYgKGluc3RhbmNlLmJvZHlVc2VkKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdjYW5ub3QgY2xvbmUgYm9keSBhZnRlciBpdCBpcyB1c2VkJyk7XG5cdH1cblxuXHQvLyBDaGVjayB0aGF0IGJvZHkgaXMgYSBzdHJlYW0gYW5kIG5vdCBmb3JtLWRhdGEgb2JqZWN0XG5cdC8vIG5vdGU6IHdlIGNhbid0IGNsb25lIHRoZSBmb3JtLWRhdGEgb2JqZWN0IHdpdGhvdXQgaGF2aW5nIGl0IGFzIGEgZGVwZW5kZW5jeVxuXHRpZiAoKGJvZHkgaW5zdGFuY2VvZiBTdHJlYW0pICYmICh0eXBlb2YgYm9keS5nZXRCb3VuZGFyeSAhPT0gJ2Z1bmN0aW9uJykpIHtcblx0XHQvLyBUZWUgaW5zdGFuY2UgYm9keVxuXHRcdHAxID0gbmV3IFBhc3NUaHJvdWdoKHtoaWdoV2F0ZXJNYXJrfSk7XG5cdFx0cDIgPSBuZXcgUGFzc1Rocm91Z2goe2hpZ2hXYXRlck1hcmt9KTtcblx0XHRib2R5LnBpcGUocDEpO1xuXHRcdGJvZHkucGlwZShwMik7XG5cdFx0Ly8gU2V0IGluc3RhbmNlIGJvZHkgdG8gdGVlZCBib2R5IGFuZCByZXR1cm4gdGhlIG90aGVyIHRlZWQgYm9keVxuXHRcdGluc3RhbmNlW0lOVEVSTkFMU10uc3RyZWFtID0gcDE7XG5cdFx0Ym9keSA9IHAyO1xuXHR9XG5cblx0cmV0dXJuIGJvZHk7XG59O1xuXG5jb25zdCBnZXROb25TcGVjRm9ybURhdGFCb3VuZGFyeSA9IGRlcHJlY2F0ZShcblx0Ym9keSA9PiBib2R5LmdldEJvdW5kYXJ5KCksXG5cdCdmb3JtLWRhdGEgZG9lc25cXCd0IGZvbGxvdyB0aGUgc3BlYyBhbmQgcmVxdWlyZXMgc3BlY2lhbCB0cmVhdG1lbnQuIFVzZSBhbHRlcm5hdGl2ZSBwYWNrYWdlJyxcblx0J2h0dHBzOi8vZ2l0aHViLmNvbS9ub2RlLWZldGNoL25vZGUtZmV0Y2gvaXNzdWVzLzExNjcnXG4pO1xuXG4vKipcbiAqIFBlcmZvcm1zIHRoZSBvcGVyYXRpb24gXCJleHRyYWN0IGEgYENvbnRlbnQtVHlwZWAgdmFsdWUgZnJvbSB8b2JqZWN0fFwiIGFzXG4gKiBzcGVjaWZpZWQgaW4gdGhlIHNwZWNpZmljYXRpb246XG4gKiBodHRwczovL2ZldGNoLnNwZWMud2hhdHdnLm9yZy8jY29uY2VwdC1ib2R5aW5pdC1leHRyYWN0XG4gKlxuICogVGhpcyBmdW5jdGlvbiBhc3N1bWVzIHRoYXQgaW5zdGFuY2UuYm9keSBpcyBwcmVzZW50LlxuICpcbiAqIEBwYXJhbSB7YW55fSBib2R5IEFueSBvcHRpb25zLmJvZHkgaW5wdXRcbiAqIEByZXR1cm5zIHtzdHJpbmcgfCBudWxsfVxuICovXG5leHBvcnQgY29uc3QgZXh0cmFjdENvbnRlbnRUeXBlID0gKGJvZHksIHJlcXVlc3QpID0+IHtcblx0Ly8gQm9keSBpcyBudWxsIG9yIHVuZGVmaW5lZFxuXHRpZiAoYm9keSA9PT0gbnVsbCkge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0Ly8gQm9keSBpcyBzdHJpbmdcblx0aWYgKHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJykge1xuXHRcdHJldHVybiAndGV4dC9wbGFpbjtjaGFyc2V0PVVURi04Jztcblx0fVxuXG5cdC8vIEJvZHkgaXMgYSBVUkxTZWFyY2hQYXJhbXNcblx0aWYgKGlzVVJMU2VhcmNoUGFyYW1ldGVycyhib2R5KSkge1xuXHRcdHJldHVybiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9VVRGLTgnO1xuXHR9XG5cblx0Ly8gQm9keSBpcyBibG9iXG5cdGlmIChpc0Jsb2IoYm9keSkpIHtcblx0XHRyZXR1cm4gYm9keS50eXBlIHx8IG51bGw7XG5cdH1cblxuXHQvLyBCb2R5IGlzIGEgQnVmZmVyIChCdWZmZXIsIEFycmF5QnVmZmVyIG9yIEFycmF5QnVmZmVyVmlldylcblx0aWYgKEJ1ZmZlci5pc0J1ZmZlcihib2R5KSB8fCB0eXBlcy5pc0FueUFycmF5QnVmZmVyKGJvZHkpIHx8IEFycmF5QnVmZmVyLmlzVmlldyhib2R5KSkge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0aWYgKGJvZHkgaW5zdGFuY2VvZiBGb3JtRGF0YSkge1xuXHRcdHJldHVybiBgbXVsdGlwYXJ0L2Zvcm0tZGF0YTsgYm91bmRhcnk9JHtyZXF1ZXN0W0lOVEVSTkFMU10uYm91bmRhcnl9YDtcblx0fVxuXG5cdC8vIERldGVjdCBmb3JtIGRhdGEgaW5wdXQgZnJvbSBmb3JtLWRhdGEgbW9kdWxlXG5cdGlmIChib2R5ICYmIHR5cGVvZiBib2R5LmdldEJvdW5kYXJ5ID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0cmV0dXJuIGBtdWx0aXBhcnQvZm9ybS1kYXRhO2JvdW5kYXJ5PSR7Z2V0Tm9uU3BlY0Zvcm1EYXRhQm91bmRhcnkoYm9keSl9YDtcblx0fVxuXG5cdC8vIEJvZHkgaXMgc3RyZWFtIC0gY2FuJ3QgcmVhbGx5IGRvIG11Y2ggYWJvdXQgdGhpc1xuXHRpZiAoYm9keSBpbnN0YW5jZW9mIFN0cmVhbSkge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0Ly8gQm9keSBjb25zdHJ1Y3RvciBkZWZhdWx0cyBvdGhlciB0aGluZ3MgdG8gc3RyaW5nXG5cdHJldHVybiAndGV4dC9wbGFpbjtjaGFyc2V0PVVURi04Jztcbn07XG5cbi8qKlxuICogVGhlIEZldGNoIFN0YW5kYXJkIHRyZWF0cyB0aGlzIGFzIGlmIFwidG90YWwgYnl0ZXNcIiBpcyBhIHByb3BlcnR5IG9uIHRoZSBib2R5LlxuICogRm9yIHVzLCB3ZSBoYXZlIHRvIGV4cGxpY2l0bHkgZ2V0IGl0IHdpdGggYSBmdW5jdGlvbi5cbiAqXG4gKiByZWY6IGh0dHBzOi8vZmV0Y2guc3BlYy53aGF0d2cub3JnLyNjb25jZXB0LWJvZHktdG90YWwtYnl0ZXNcbiAqXG4gKiBAcGFyYW0ge2FueX0gb2JqLmJvZHkgQm9keSBvYmplY3QgZnJvbSB0aGUgQm9keSBpbnN0YW5jZS5cbiAqIEByZXR1cm5zIHtudW1iZXIgfCBudWxsfVxuICovXG5leHBvcnQgY29uc3QgZ2V0VG90YWxCeXRlcyA9IHJlcXVlc3QgPT4ge1xuXHRjb25zdCB7Ym9keX0gPSByZXF1ZXN0W0lOVEVSTkFMU107XG5cblx0Ly8gQm9keSBpcyBudWxsIG9yIHVuZGVmaW5lZFxuXHRpZiAoYm9keSA9PT0gbnVsbCkge1xuXHRcdHJldHVybiAwO1xuXHR9XG5cblx0Ly8gQm9keSBpcyBCbG9iXG5cdGlmIChpc0Jsb2IoYm9keSkpIHtcblx0XHRyZXR1cm4gYm9keS5zaXplO1xuXHR9XG5cblx0Ly8gQm9keSBpcyBCdWZmZXJcblx0aWYgKEJ1ZmZlci5pc0J1ZmZlcihib2R5KSkge1xuXHRcdHJldHVybiBib2R5Lmxlbmd0aDtcblx0fVxuXG5cdC8vIERldGVjdCBmb3JtIGRhdGEgaW5wdXQgZnJvbSBmb3JtLWRhdGEgbW9kdWxlXG5cdGlmIChib2R5ICYmIHR5cGVvZiBib2R5LmdldExlbmd0aFN5bmMgPT09ICdmdW5jdGlvbicpIHtcblx0XHRyZXR1cm4gYm9keS5oYXNLbm93bkxlbmd0aCAmJiBib2R5Lmhhc0tub3duTGVuZ3RoKCkgPyBib2R5LmdldExlbmd0aFN5bmMoKSA6IG51bGw7XG5cdH1cblxuXHQvLyBCb2R5IGlzIHN0cmVhbVxuXHRyZXR1cm4gbnVsbDtcbn07XG5cbi8qKlxuICogV3JpdGUgYSBCb2R5IHRvIGEgTm9kZS5qcyBXcml0YWJsZVN0cmVhbSAoZS5nLiBodHRwLlJlcXVlc3QpIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge1N0cmVhbS5Xcml0YWJsZX0gZGVzdCBUaGUgc3RyZWFtIHRvIHdyaXRlIHRvLlxuICogQHBhcmFtIG9iai5ib2R5IEJvZHkgb2JqZWN0IGZyb20gdGhlIEJvZHkgaW5zdGFuY2UuXG4gKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn1cbiAqL1xuZXhwb3J0IGNvbnN0IHdyaXRlVG9TdHJlYW0gPSBhc3luYyAoZGVzdCwge2JvZHl9KSA9PiB7XG5cdGlmIChib2R5ID09PSBudWxsKSB7XG5cdFx0Ly8gQm9keSBpcyBudWxsXG5cdFx0ZGVzdC5lbmQoKTtcblx0fSBlbHNlIHtcblx0XHQvLyBCb2R5IGlzIHN0cmVhbVxuXHRcdGF3YWl0IHBpcGVsaW5lKGJvZHksIGRlc3QpO1xuXHR9XG59O1xuIiwgImV4cG9ydCBjbGFzcyBGZXRjaEJhc2VFcnJvciBleHRlbmRzIEVycm9yIHtcblx0Y29uc3RydWN0b3IobWVzc2FnZSwgdHlwZSkge1xuXHRcdHN1cGVyKG1lc3NhZ2UpO1xuXHRcdC8vIEhpZGUgY3VzdG9tIGVycm9yIGltcGxlbWVudGF0aW9uIGRldGFpbHMgZnJvbSBlbmQtdXNlcnNcblx0XHRFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCB0aGlzLmNvbnN0cnVjdG9yKTtcblxuXHRcdHRoaXMudHlwZSA9IHR5cGU7XG5cdH1cblxuXHRnZXQgbmFtZSgpIHtcblx0XHRyZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5uYW1lO1xuXHR9XG5cblx0Z2V0IFtTeW1ib2wudG9TdHJpbmdUYWddKCkge1xuXHRcdHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLm5hbWU7XG5cdH1cbn1cbiIsICJcbmltcG9ydCB7RmV0Y2hCYXNlRXJyb3J9IGZyb20gJy4vYmFzZS5qcyc7XG5cbi8qKlxuICogQHR5cGVkZWYge3sgYWRkcmVzcz86IHN0cmluZywgY29kZTogc3RyaW5nLCBkZXN0Pzogc3RyaW5nLCBlcnJubzogbnVtYmVyLCBpbmZvPzogb2JqZWN0LCBtZXNzYWdlOiBzdHJpbmcsIHBhdGg/OiBzdHJpbmcsIHBvcnQ/OiBudW1iZXIsIHN5c2NhbGw6IHN0cmluZ319IFN5c3RlbUVycm9yXG4qL1xuXG4vKipcbiAqIEZldGNoRXJyb3IgaW50ZXJmYWNlIGZvciBvcGVyYXRpb25hbCBlcnJvcnNcbiAqL1xuZXhwb3J0IGNsYXNzIEZldGNoRXJyb3IgZXh0ZW5kcyBGZXRjaEJhc2VFcnJvciB7XG5cdC8qKlxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IG1lc3NhZ2UgLSAgICAgIEVycm9yIG1lc3NhZ2UgZm9yIGh1bWFuXG5cdCAqIEBwYXJhbSAge3N0cmluZ30gW3R5cGVdIC0gICAgICAgIEVycm9yIHR5cGUgZm9yIG1hY2hpbmVcblx0ICogQHBhcmFtICB7U3lzdGVtRXJyb3J9IFtzeXN0ZW1FcnJvcl0gLSBGb3IgTm9kZS5qcyBzeXN0ZW0gZXJyb3Jcblx0ICovXG5cdGNvbnN0cnVjdG9yKG1lc3NhZ2UsIHR5cGUsIHN5c3RlbUVycm9yKSB7XG5cdFx0c3VwZXIobWVzc2FnZSwgdHlwZSk7XG5cdFx0Ly8gV2hlbiBlcnIudHlwZSBpcyBgc3lzdGVtYCwgZXJyLmVycm9yZWRTeXNDYWxsIGNvbnRhaW5zIHN5c3RlbSBlcnJvciBhbmQgZXJyLmNvZGUgY29udGFpbnMgc3lzdGVtIGVycm9yIGNvZGVcblx0XHRpZiAoc3lzdGVtRXJyb3IpIHtcblx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1tdWx0aS1hc3NpZ25cblx0XHRcdHRoaXMuY29kZSA9IHRoaXMuZXJybm8gPSBzeXN0ZW1FcnJvci5jb2RlO1xuXHRcdFx0dGhpcy5lcnJvcmVkU3lzQ2FsbCA9IHN5c3RlbUVycm9yLnN5c2NhbGw7XG5cdFx0fVxuXHR9XG59XG4iLCAiLyoqXG4gKiBJcy5qc1xuICpcbiAqIE9iamVjdCB0eXBlIGNoZWNrcy5cbiAqL1xuXG5jb25zdCBOQU1FID0gU3ltYm9sLnRvU3RyaW5nVGFnO1xuXG4vKipcbiAqIENoZWNrIGlmIGBvYmpgIGlzIGEgVVJMU2VhcmNoUGFyYW1zIG9iamVjdFxuICogcmVmOiBodHRwczovL2dpdGh1Yi5jb20vbm9kZS1mZXRjaC9ub2RlLWZldGNoL2lzc3Vlcy8yOTYjaXNzdWVjb21tZW50LTMwNzU5ODE0M1xuICogQHBhcmFtIHsqfSBvYmplY3QgLSBPYmplY3QgdG8gY2hlY2sgZm9yXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5leHBvcnQgY29uc3QgaXNVUkxTZWFyY2hQYXJhbWV0ZXJzID0gb2JqZWN0ID0+IHtcblx0cmV0dXJuIChcblx0XHR0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJlxuXHRcdHR5cGVvZiBvYmplY3QuYXBwZW5kID09PSAnZnVuY3Rpb24nICYmXG5cdFx0dHlwZW9mIG9iamVjdC5kZWxldGUgPT09ICdmdW5jdGlvbicgJiZcblx0XHR0eXBlb2Ygb2JqZWN0LmdldCA9PT0gJ2Z1bmN0aW9uJyAmJlxuXHRcdHR5cGVvZiBvYmplY3QuZ2V0QWxsID09PSAnZnVuY3Rpb24nICYmXG5cdFx0dHlwZW9mIG9iamVjdC5oYXMgPT09ICdmdW5jdGlvbicgJiZcblx0XHR0eXBlb2Ygb2JqZWN0LnNldCA9PT0gJ2Z1bmN0aW9uJyAmJlxuXHRcdHR5cGVvZiBvYmplY3Quc29ydCA9PT0gJ2Z1bmN0aW9uJyAmJlxuXHRcdG9iamVjdFtOQU1FXSA9PT0gJ1VSTFNlYXJjaFBhcmFtcydcblx0KTtcbn07XG5cbi8qKlxuICogQ2hlY2sgaWYgYG9iamVjdGAgaXMgYSBXM0MgYEJsb2JgIG9iamVjdCAod2hpY2ggYEZpbGVgIGluaGVyaXRzIGZyb20pXG4gKiBAcGFyYW0geyp9IG9iamVjdCAtIE9iamVjdCB0byBjaGVjayBmb3JcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBjb25zdCBpc0Jsb2IgPSBvYmplY3QgPT4ge1xuXHRyZXR1cm4gKFxuXHRcdG9iamVjdCAmJlxuXHRcdHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmXG5cdFx0dHlwZW9mIG9iamVjdC5hcnJheUJ1ZmZlciA9PT0gJ2Z1bmN0aW9uJyAmJlxuXHRcdHR5cGVvZiBvYmplY3QudHlwZSA9PT0gJ3N0cmluZycgJiZcblx0XHR0eXBlb2Ygb2JqZWN0LnN0cmVhbSA9PT0gJ2Z1bmN0aW9uJyAmJlxuXHRcdHR5cGVvZiBvYmplY3QuY29uc3RydWN0b3IgPT09ICdmdW5jdGlvbicgJiZcblx0XHQvXihCbG9ifEZpbGUpJC8udGVzdChvYmplY3RbTkFNRV0pXG5cdCk7XG59O1xuXG4vKipcbiAqIENoZWNrIGlmIGBvYmpgIGlzIGFuIGluc3RhbmNlIG9mIEFib3J0U2lnbmFsLlxuICogQHBhcmFtIHsqfSBvYmplY3QgLSBPYmplY3QgdG8gY2hlY2sgZm9yXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5leHBvcnQgY29uc3QgaXNBYm9ydFNpZ25hbCA9IG9iamVjdCA9PiB7XG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiYgKFxuXHRcdFx0b2JqZWN0W05BTUVdID09PSAnQWJvcnRTaWduYWwnIHx8XG5cdFx0XHRvYmplY3RbTkFNRV0gPT09ICdFdmVudFRhcmdldCdcblx0XHQpXG5cdCk7XG59O1xuXG4vKipcbiAqIGlzRG9tYWluT3JTdWJkb21haW4gcmVwb3J0cyB3aGV0aGVyIHN1YiBpcyBhIHN1YmRvbWFpbiAob3IgZXhhY3QgbWF0Y2gpIG9mXG4gKiB0aGUgcGFyZW50IGRvbWFpbi5cbiAqXG4gKiBCb3RoIGRvbWFpbnMgbXVzdCBhbHJlYWR5IGJlIGluIGNhbm9uaWNhbCBmb3JtLlxuICogQHBhcmFtIHtzdHJpbmd8VVJMfSBvcmlnaW5hbFxuICogQHBhcmFtIHtzdHJpbmd8VVJMfSBkZXN0aW5hdGlvblxuICovXG5leHBvcnQgY29uc3QgaXNEb21haW5PclN1YmRvbWFpbiA9IChkZXN0aW5hdGlvbiwgb3JpZ2luYWwpID0+IHtcblx0Y29uc3Qgb3JpZyA9IG5ldyBVUkwob3JpZ2luYWwpLmhvc3RuYW1lO1xuXHRjb25zdCBkZXN0ID0gbmV3IFVSTChkZXN0aW5hdGlvbikuaG9zdG5hbWU7XG5cblx0cmV0dXJuIG9yaWcgPT09IGRlc3QgfHwgb3JpZy5lbmRzV2l0aChgLiR7ZGVzdH1gKTtcbn07XG5cbi8qKlxuICogaXNTYW1lUHJvdG9jb2wgcmVwb3J0cyB3aGV0aGVyIHRoZSB0d28gcHJvdmlkZWQgVVJMcyB1c2UgdGhlIHNhbWUgcHJvdG9jb2wuXG4gKlxuICogQm90aCBkb21haW5zIG11c3QgYWxyZWFkeSBiZSBpbiBjYW5vbmljYWwgZm9ybS5cbiAqIEBwYXJhbSB7c3RyaW5nfFVSTH0gb3JpZ2luYWxcbiAqIEBwYXJhbSB7c3RyaW5nfFVSTH0gZGVzdGluYXRpb25cbiAqL1xuZXhwb3J0IGNvbnN0IGlzU2FtZVByb3RvY29sID0gKGRlc3RpbmF0aW9uLCBvcmlnaW5hbCkgPT4ge1xuXHRjb25zdCBvcmlnID0gbmV3IFVSTChvcmlnaW5hbCkucHJvdG9jb2w7XG5cdGNvbnN0IGRlc3QgPSBuZXcgVVJMKGRlc3RpbmF0aW9uKS5wcm90b2NvbDtcblxuXHRyZXR1cm4gb3JpZyA9PT0gZGVzdDtcbn07XG4iLCAiLyoqXG4gKiBIZWFkZXJzLmpzXG4gKlxuICogSGVhZGVycyBjbGFzcyBvZmZlcnMgY29udmVuaWVudCBoZWxwZXJzXG4gKi9cblxuaW1wb3J0IHt0eXBlc30gZnJvbSAnbm9kZTp1dGlsJztcbmltcG9ydCBodHRwIGZyb20gJ25vZGU6aHR0cCc7XG5cbi8qIGM4IGlnbm9yZSBuZXh0IDkgKi9cbmNvbnN0IHZhbGlkYXRlSGVhZGVyTmFtZSA9IHR5cGVvZiBodHRwLnZhbGlkYXRlSGVhZGVyTmFtZSA9PT0gJ2Z1bmN0aW9uJyA/XG5cdGh0dHAudmFsaWRhdGVIZWFkZXJOYW1lIDpcblx0bmFtZSA9PiB7XG5cdFx0aWYgKCEvXltcXF5gXFwtXFx3ISMkJSYnKisufH5dKyQvLnRlc3QobmFtZSkpIHtcblx0XHRcdGNvbnN0IGVycm9yID0gbmV3IFR5cGVFcnJvcihgSGVhZGVyIG5hbWUgbXVzdCBiZSBhIHZhbGlkIEhUVFAgdG9rZW4gWyR7bmFtZX1dYCk7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXJyb3IsICdjb2RlJywge3ZhbHVlOiAnRVJSX0lOVkFMSURfSFRUUF9UT0tFTid9KTtcblx0XHRcdHRocm93IGVycm9yO1xuXHRcdH1cblx0fTtcblxuLyogYzggaWdub3JlIG5leHQgOSAqL1xuY29uc3QgdmFsaWRhdGVIZWFkZXJWYWx1ZSA9IHR5cGVvZiBodHRwLnZhbGlkYXRlSGVhZGVyVmFsdWUgPT09ICdmdW5jdGlvbicgP1xuXHRodHRwLnZhbGlkYXRlSGVhZGVyVmFsdWUgOlxuXHQobmFtZSwgdmFsdWUpID0+IHtcblx0XHRpZiAoL1teXFx0XFx1MDAyMC1cXHUwMDdFXFx1MDA4MC1cXHUwMEZGXS8udGVzdCh2YWx1ZSkpIHtcblx0XHRcdGNvbnN0IGVycm9yID0gbmV3IFR5cGVFcnJvcihgSW52YWxpZCBjaGFyYWN0ZXIgaW4gaGVhZGVyIGNvbnRlbnQgW1wiJHtuYW1lfVwiXWApO1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGVycm9yLCAnY29kZScsIHt2YWx1ZTogJ0VSUl9JTlZBTElEX0NIQVInfSk7XG5cdFx0XHR0aHJvdyBlcnJvcjtcblx0XHR9XG5cdH07XG5cbi8qKlxuICogQHR5cGVkZWYge0hlYWRlcnMgfCBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHwgSXRlcmFibGU8cmVhZG9ubHkgW3N0cmluZywgc3RyaW5nXT4gfCBJdGVyYWJsZTxJdGVyYWJsZTxzdHJpbmc+Pn0gSGVhZGVyc0luaXRcbiAqL1xuXG4vKipcbiAqIFRoaXMgRmV0Y2ggQVBJIGludGVyZmFjZSBhbGxvd3MgeW91IHRvIHBlcmZvcm0gdmFyaW91cyBhY3Rpb25zIG9uIEhUVFAgcmVxdWVzdCBhbmQgcmVzcG9uc2UgaGVhZGVycy5cbiAqIFRoZXNlIGFjdGlvbnMgaW5jbHVkZSByZXRyaWV2aW5nLCBzZXR0aW5nLCBhZGRpbmcgdG8sIGFuZCByZW1vdmluZy5cbiAqIEEgSGVhZGVycyBvYmplY3QgaGFzIGFuIGFzc29jaWF0ZWQgaGVhZGVyIGxpc3QsIHdoaWNoIGlzIGluaXRpYWxseSBlbXB0eSBhbmQgY29uc2lzdHMgb2YgemVybyBvciBtb3JlIG5hbWUgYW5kIHZhbHVlIHBhaXJzLlxuICogWW91IGNhbiBhZGQgdG8gdGhpcyB1c2luZyBtZXRob2RzIGxpa2UgYXBwZW5kKCkgKHNlZSBFeGFtcGxlcy4pXG4gKiBJbiBhbGwgbWV0aG9kcyBvZiB0aGlzIGludGVyZmFjZSwgaGVhZGVyIG5hbWVzIGFyZSBtYXRjaGVkIGJ5IGNhc2UtaW5zZW5zaXRpdmUgYnl0ZSBzZXF1ZW5jZS5cbiAqXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhlYWRlcnMgZXh0ZW5kcyBVUkxTZWFyY2hQYXJhbXMge1xuXHQvKipcblx0ICogSGVhZGVycyBjbGFzc1xuXHQgKlxuXHQgKiBAY29uc3RydWN0b3Jcblx0ICogQHBhcmFtIHtIZWFkZXJzSW5pdH0gW2luaXRdIC0gUmVzcG9uc2UgaGVhZGVyc1xuXHQgKi9cblx0Y29uc3RydWN0b3IoaW5pdCkge1xuXHRcdC8vIFZhbGlkYXRlIGFuZCBub3JtYWxpemUgaW5pdCBvYmplY3QgaW4gW25hbWUsIHZhbHVlKHMpXVtdXG5cdFx0LyoqIEB0eXBlIHtzdHJpbmdbXVtdfSAqL1xuXHRcdGxldCByZXN1bHQgPSBbXTtcblx0XHRpZiAoaW5pdCBpbnN0YW5jZW9mIEhlYWRlcnMpIHtcblx0XHRcdGNvbnN0IHJhdyA9IGluaXQucmF3KCk7XG5cdFx0XHRmb3IgKGNvbnN0IFtuYW1lLCB2YWx1ZXNdIG9mIE9iamVjdC5lbnRyaWVzKHJhdykpIHtcblx0XHRcdFx0cmVzdWx0LnB1c2goLi4udmFsdWVzLm1hcCh2YWx1ZSA9PiBbbmFtZSwgdmFsdWVdKSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmIChpbml0ID09IG51bGwpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1lcS1udWxsLCBlcWVxZXFcblx0XHRcdC8vIE5vIG9wXG5cdFx0fSBlbHNlIGlmICh0eXBlb2YgaW5pdCA9PT0gJ29iamVjdCcgJiYgIXR5cGVzLmlzQm94ZWRQcmltaXRpdmUoaW5pdCkpIHtcblx0XHRcdGNvbnN0IG1ldGhvZCA9IGluaXRbU3ltYm9sLml0ZXJhdG9yXTtcblx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1lcS1udWxsLCBlcWVxZXFcblx0XHRcdGlmIChtZXRob2QgPT0gbnVsbCkge1xuXHRcdFx0XHQvLyBSZWNvcmQ8Qnl0ZVN0cmluZywgQnl0ZVN0cmluZz5cblx0XHRcdFx0cmVzdWx0LnB1c2goLi4uT2JqZWN0LmVudHJpZXMoaW5pdCkpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKHR5cGVvZiBtZXRob2QgIT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdIZWFkZXIgcGFpcnMgbXVzdCBiZSBpdGVyYWJsZScpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gU2VxdWVuY2U8c2VxdWVuY2U8Qnl0ZVN0cmluZz4+XG5cdFx0XHRcdC8vIE5vdGU6IHBlciBzcGVjIHdlIGhhdmUgdG8gZmlyc3QgZXhoYXVzdCB0aGUgbGlzdHMgdGhlbiBwcm9jZXNzIHRoZW1cblx0XHRcdFx0cmVzdWx0ID0gWy4uLmluaXRdXG5cdFx0XHRcdFx0Lm1hcChwYWlyID0+IHtcblx0XHRcdFx0XHRcdGlmIChcblx0XHRcdFx0XHRcdFx0dHlwZW9mIHBhaXIgIT09ICdvYmplY3QnIHx8IHR5cGVzLmlzQm94ZWRQcmltaXRpdmUocGFpcilcblx0XHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdFYWNoIGhlYWRlciBwYWlyIG11c3QgYmUgYW4gaXRlcmFibGUgb2JqZWN0Jyk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHJldHVybiBbLi4ucGFpcl07XG5cdFx0XHRcdFx0fSkubWFwKHBhaXIgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKHBhaXIubGVuZ3RoICE9PSAyKSB7XG5cdFx0XHRcdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ0VhY2ggaGVhZGVyIHBhaXIgbXVzdCBiZSBhIG5hbWUvdmFsdWUgdHVwbGUnKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0cmV0dXJuIFsuLi5wYWlyXTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignRmFpbGVkIHRvIGNvbnN0cnVjdCBcXCdIZWFkZXJzXFwnOiBUaGUgcHJvdmlkZWQgdmFsdWUgaXMgbm90IG9mIHR5cGUgXFwnKHNlcXVlbmNlPHNlcXVlbmNlPEJ5dGVTdHJpbmc+PiBvciByZWNvcmQ8Qnl0ZVN0cmluZywgQnl0ZVN0cmluZz4pJyk7XG5cdFx0fVxuXG5cdFx0Ly8gVmFsaWRhdGUgYW5kIGxvd2VyY2FzZVxuXHRcdHJlc3VsdCA9XG5cdFx0XHRyZXN1bHQubGVuZ3RoID4gMCA/XG5cdFx0XHRcdHJlc3VsdC5tYXAoKFtuYW1lLCB2YWx1ZV0pID0+IHtcblx0XHRcdFx0XHR2YWxpZGF0ZUhlYWRlck5hbWUobmFtZSk7XG5cdFx0XHRcdFx0dmFsaWRhdGVIZWFkZXJWYWx1ZShuYW1lLCBTdHJpbmcodmFsdWUpKTtcblx0XHRcdFx0XHRyZXR1cm4gW1N0cmluZyhuYW1lKS50b0xvd2VyQ2FzZSgpLCBTdHJpbmcodmFsdWUpXTtcblx0XHRcdFx0fSkgOlxuXHRcdFx0XHR1bmRlZmluZWQ7XG5cblx0XHRzdXBlcihyZXN1bHQpO1xuXG5cdFx0Ly8gUmV0dXJuaW5nIGEgUHJveHkgdGhhdCB3aWxsIGxvd2VyY2FzZSBrZXkgbmFtZXMsIHZhbGlkYXRlIHBhcmFtZXRlcnMgYW5kIHNvcnQga2V5c1xuXHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zdHJ1Y3Rvci1yZXR1cm5cblx0XHRyZXR1cm4gbmV3IFByb3h5KHRoaXMsIHtcblx0XHRcdGdldCh0YXJnZXQsIHAsIHJlY2VpdmVyKSB7XG5cdFx0XHRcdHN3aXRjaCAocCkge1xuXHRcdFx0XHRcdGNhc2UgJ2FwcGVuZCc6XG5cdFx0XHRcdFx0Y2FzZSAnc2V0Jzpcblx0XHRcdFx0XHRcdHJldHVybiAobmFtZSwgdmFsdWUpID0+IHtcblx0XHRcdFx0XHRcdFx0dmFsaWRhdGVIZWFkZXJOYW1lKG5hbWUpO1xuXHRcdFx0XHRcdFx0XHR2YWxpZGF0ZUhlYWRlclZhbHVlKG5hbWUsIFN0cmluZyh2YWx1ZSkpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gVVJMU2VhcmNoUGFyYW1zLnByb3RvdHlwZVtwXS5jYWxsKFxuXHRcdFx0XHRcdFx0XHRcdHRhcmdldCxcblx0XHRcdFx0XHRcdFx0XHRTdHJpbmcobmFtZSkudG9Mb3dlckNhc2UoKSxcblx0XHRcdFx0XHRcdFx0XHRTdHJpbmcodmFsdWUpXG5cdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0Y2FzZSAnZGVsZXRlJzpcblx0XHRcdFx0XHRjYXNlICdoYXMnOlxuXHRcdFx0XHRcdGNhc2UgJ2dldEFsbCc6XG5cdFx0XHRcdFx0XHRyZXR1cm4gbmFtZSA9PiB7XG5cdFx0XHRcdFx0XHRcdHZhbGlkYXRlSGVhZGVyTmFtZShuYW1lKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIFVSTFNlYXJjaFBhcmFtcy5wcm90b3R5cGVbcF0uY2FsbChcblx0XHRcdFx0XHRcdFx0XHR0YXJnZXQsXG5cdFx0XHRcdFx0XHRcdFx0U3RyaW5nKG5hbWUpLnRvTG93ZXJDYXNlKClcblx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRjYXNlICdrZXlzJzpcblx0XHRcdFx0XHRcdHJldHVybiAoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdHRhcmdldC5zb3J0KCk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBuZXcgU2V0KFVSTFNlYXJjaFBhcmFtcy5wcm90b3R5cGUua2V5cy5jYWxsKHRhcmdldCkpLmtleXMoKTtcblx0XHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0cmV0dXJuIFJlZmxlY3QuZ2V0KHRhcmdldCwgcCwgcmVjZWl2ZXIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0LyogYzggaWdub3JlIG5leHQgKi9cblx0fVxuXG5cdGdldCBbU3ltYm9sLnRvU3RyaW5nVGFnXSgpIHtcblx0XHRyZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5uYW1lO1xuXHR9XG5cblx0dG9TdHJpbmcoKSB7XG5cdFx0cmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh0aGlzKTtcblx0fVxuXG5cdGdldChuYW1lKSB7XG5cdFx0Y29uc3QgdmFsdWVzID0gdGhpcy5nZXRBbGwobmFtZSk7XG5cdFx0aWYgKHZhbHVlcy5sZW5ndGggPT09IDApIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdGxldCB2YWx1ZSA9IHZhbHVlcy5qb2luKCcsICcpO1xuXHRcdGlmICgvXmNvbnRlbnQtZW5jb2RpbmckL2kudGVzdChuYW1lKSkge1xuXHRcdFx0dmFsdWUgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpO1xuXHRcdH1cblxuXHRcdHJldHVybiB2YWx1ZTtcblx0fVxuXG5cdGZvckVhY2goY2FsbGJhY2ssIHRoaXNBcmcgPSB1bmRlZmluZWQpIHtcblx0XHRmb3IgKGNvbnN0IG5hbWUgb2YgdGhpcy5rZXlzKCkpIHtcblx0XHRcdFJlZmxlY3QuYXBwbHkoY2FsbGJhY2ssIHRoaXNBcmcsIFt0aGlzLmdldChuYW1lKSwgbmFtZSwgdGhpc10pO1xuXHRcdH1cblx0fVxuXG5cdCogdmFsdWVzKCkge1xuXHRcdGZvciAoY29uc3QgbmFtZSBvZiB0aGlzLmtleXMoKSkge1xuXHRcdFx0eWllbGQgdGhpcy5nZXQobmFtZSk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEB0eXBlIHsoKSA9PiBJdGVyYWJsZUl0ZXJhdG9yPFtzdHJpbmcsIHN0cmluZ10+fVxuXHQgKi9cblx0KiBlbnRyaWVzKCkge1xuXHRcdGZvciAoY29uc3QgbmFtZSBvZiB0aGlzLmtleXMoKSkge1xuXHRcdFx0eWllbGQgW25hbWUsIHRoaXMuZ2V0KG5hbWUpXTtcblx0XHR9XG5cdH1cblxuXHRbU3ltYm9sLml0ZXJhdG9yXSgpIHtcblx0XHRyZXR1cm4gdGhpcy5lbnRyaWVzKCk7XG5cdH1cblxuXHQvKipcblx0ICogTm9kZS1mZXRjaCBub24tc3BlYyBtZXRob2Rcblx0ICogcmV0dXJuaW5nIGFsbCBoZWFkZXJzIGFuZCB0aGVpciB2YWx1ZXMgYXMgYXJyYXlcblx0ICogQHJldHVybnMge1JlY29yZDxzdHJpbmcsIHN0cmluZ1tdPn1cblx0ICovXG5cdHJhdygpIHtcblx0XHRyZXR1cm4gWy4uLnRoaXMua2V5cygpXS5yZWR1Y2UoKHJlc3VsdCwga2V5KSA9PiB7XG5cdFx0XHRyZXN1bHRba2V5XSA9IHRoaXMuZ2V0QWxsKGtleSk7XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH0sIHt9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBGb3IgYmV0dGVyIGNvbnNvbGUubG9nKGhlYWRlcnMpIGFuZCBhbHNvIHRvIGNvbnZlcnQgSGVhZGVycyBpbnRvIE5vZGUuanMgUmVxdWVzdCBjb21wYXRpYmxlIGZvcm1hdFxuXHQgKi9cblx0W1N5bWJvbC5mb3IoJ25vZGVqcy51dGlsLmluc3BlY3QuY3VzdG9tJyldKCkge1xuXHRcdHJldHVybiBbLi4udGhpcy5rZXlzKCldLnJlZHVjZSgocmVzdWx0LCBrZXkpID0+IHtcblx0XHRcdGNvbnN0IHZhbHVlcyA9IHRoaXMuZ2V0QWxsKGtleSk7XG5cdFx0XHQvLyBIdHRwLnJlcXVlc3QoKSBvbmx5IHN1cHBvcnRzIHN0cmluZyBhcyBIb3N0IGhlYWRlci5cblx0XHRcdC8vIFRoaXMgaGFjayBtYWtlcyBzcGVjaWZ5aW5nIGN1c3RvbSBIb3N0IGhlYWRlciBwb3NzaWJsZS5cblx0XHRcdGlmIChrZXkgPT09ICdob3N0Jykge1xuXHRcdFx0XHRyZXN1bHRba2V5XSA9IHZhbHVlc1swXTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJlc3VsdFtrZXldID0gdmFsdWVzLmxlbmd0aCA+IDEgPyB2YWx1ZXMgOiB2YWx1ZXNbMF07XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fSwge30pO1xuXHR9XG59XG5cbi8qKlxuICogUmUtc2hhcGluZyBvYmplY3QgZm9yIFdlYiBJREwgdGVzdHNcbiAqIE9ubHkgbmVlZCB0byBkbyBpdCBmb3Igb3ZlcnJpZGRlbiBtZXRob2RzXG4gKi9cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFxuXHRIZWFkZXJzLnByb3RvdHlwZSxcblx0WydnZXQnLCAnZW50cmllcycsICdmb3JFYWNoJywgJ3ZhbHVlcyddLnJlZHVjZSgocmVzdWx0LCBwcm9wZXJ0eSkgPT4ge1xuXHRcdHJlc3VsdFtwcm9wZXJ0eV0gPSB7ZW51bWVyYWJsZTogdHJ1ZX07XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fSwge30pXG4pO1xuXG4vKipcbiAqIENyZWF0ZSBhIEhlYWRlcnMgb2JqZWN0IGZyb20gYW4gaHR0cC5JbmNvbWluZ01lc3NhZ2UucmF3SGVhZGVycywgaWdub3JpbmcgdGhvc2UgdGhhdCBkb1xuICogbm90IGNvbmZvcm0gdG8gSFRUUCBncmFtbWFyIHByb2R1Y3Rpb25zLlxuICogQHBhcmFtIHtpbXBvcnQoJ2h0dHAnKS5JbmNvbWluZ01lc3NhZ2VbJ3Jhd0hlYWRlcnMnXX0gaGVhZGVyc1xuICovXG5leHBvcnQgZnVuY3Rpb24gZnJvbVJhd0hlYWRlcnMoaGVhZGVycyA9IFtdKSB7XG5cdHJldHVybiBuZXcgSGVhZGVycyhcblx0XHRoZWFkZXJzXG5cdFx0XHQvLyBTcGxpdCBpbnRvIHBhaXJzXG5cdFx0XHQucmVkdWNlKChyZXN1bHQsIHZhbHVlLCBpbmRleCwgYXJyYXkpID0+IHtcblx0XHRcdFx0aWYgKGluZGV4ICUgMiA9PT0gMCkge1xuXHRcdFx0XHRcdHJlc3VsdC5wdXNoKGFycmF5LnNsaWNlKGluZGV4LCBpbmRleCArIDIpKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9LCBbXSlcblx0XHRcdC5maWx0ZXIoKFtuYW1lLCB2YWx1ZV0pID0+IHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHR2YWxpZGF0ZUhlYWRlck5hbWUobmFtZSk7XG5cdFx0XHRcdFx0dmFsaWRhdGVIZWFkZXJWYWx1ZShuYW1lLCBTdHJpbmcodmFsdWUpKTtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fSBjYXRjaCB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXG5cdCk7XG59XG4iLCAiY29uc3QgcmVkaXJlY3RTdGF0dXMgPSBuZXcgU2V0KFszMDEsIDMwMiwgMzAzLCAzMDcsIDMwOF0pO1xuXG4vKipcbiAqIFJlZGlyZWN0IGNvZGUgbWF0Y2hpbmdcbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gY29kZSAtIFN0YXR1cyBjb2RlXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5leHBvcnQgY29uc3QgaXNSZWRpcmVjdCA9IGNvZGUgPT4ge1xuXHRyZXR1cm4gcmVkaXJlY3RTdGF0dXMuaGFzKGNvZGUpO1xufTtcbiIsICIvKipcbiAqIFJlc3BvbnNlLmpzXG4gKlxuICogUmVzcG9uc2UgY2xhc3MgcHJvdmlkZXMgY29udGVudCBkZWNvZGluZ1xuICovXG5cbmltcG9ydCBIZWFkZXJzIGZyb20gJy4vaGVhZGVycy5qcyc7XG5pbXBvcnQgQm9keSwge2Nsb25lLCBleHRyYWN0Q29udGVudFR5cGV9IGZyb20gJy4vYm9keS5qcyc7XG5pbXBvcnQge2lzUmVkaXJlY3R9IGZyb20gJy4vdXRpbHMvaXMtcmVkaXJlY3QuanMnO1xuXG5jb25zdCBJTlRFUk5BTFMgPSBTeW1ib2woJ1Jlc3BvbnNlIGludGVybmFscycpO1xuXG4vKipcbiAqIFJlc3BvbnNlIGNsYXNzXG4gKlxuICogUmVmOiBodHRwczovL2ZldGNoLnNwZWMud2hhdHdnLm9yZy8jcmVzcG9uc2UtY2xhc3NcbiAqXG4gKiBAcGFyYW0gICBTdHJlYW0gIGJvZHkgIFJlYWRhYmxlIHN0cmVhbVxuICogQHBhcmFtICAgT2JqZWN0ICBvcHRzICBSZXNwb25zZSBvcHRpb25zXG4gKiBAcmV0dXJuICBWb2lkXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlc3BvbnNlIGV4dGVuZHMgQm9keSB7XG5cdGNvbnN0cnVjdG9yKGJvZHkgPSBudWxsLCBvcHRpb25zID0ge30pIHtcblx0XHRzdXBlcihib2R5LCBvcHRpb25zKTtcblxuXHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1lcS1udWxsLCBlcWVxZXEsIG5vLW5lZ2F0ZWQtY29uZGl0aW9uXG5cdFx0Y29uc3Qgc3RhdHVzID0gb3B0aW9ucy5zdGF0dXMgIT0gbnVsbCA/IG9wdGlvbnMuc3RhdHVzIDogMjAwO1xuXG5cdFx0Y29uc3QgaGVhZGVycyA9IG5ldyBIZWFkZXJzKG9wdGlvbnMuaGVhZGVycyk7XG5cblx0XHRpZiAoYm9keSAhPT0gbnVsbCAmJiAhaGVhZGVycy5oYXMoJ0NvbnRlbnQtVHlwZScpKSB7XG5cdFx0XHRjb25zdCBjb250ZW50VHlwZSA9IGV4dHJhY3RDb250ZW50VHlwZShib2R5LCB0aGlzKTtcblx0XHRcdGlmIChjb250ZW50VHlwZSkge1xuXHRcdFx0XHRoZWFkZXJzLmFwcGVuZCgnQ29udGVudC1UeXBlJywgY29udGVudFR5cGUpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXNbSU5URVJOQUxTXSA9IHtcblx0XHRcdHR5cGU6ICdkZWZhdWx0Jyxcblx0XHRcdHVybDogb3B0aW9ucy51cmwsXG5cdFx0XHRzdGF0dXMsXG5cdFx0XHRzdGF0dXNUZXh0OiBvcHRpb25zLnN0YXR1c1RleHQgfHwgJycsXG5cdFx0XHRoZWFkZXJzLFxuXHRcdFx0Y291bnRlcjogb3B0aW9ucy5jb3VudGVyLFxuXHRcdFx0aGlnaFdhdGVyTWFyazogb3B0aW9ucy5oaWdoV2F0ZXJNYXJrXG5cdFx0fTtcblx0fVxuXG5cdGdldCB0eXBlKCkge1xuXHRcdHJldHVybiB0aGlzW0lOVEVSTkFMU10udHlwZTtcblx0fVxuXG5cdGdldCB1cmwoKSB7XG5cdFx0cmV0dXJuIHRoaXNbSU5URVJOQUxTXS51cmwgfHwgJyc7XG5cdH1cblxuXHRnZXQgc3RhdHVzKCkge1xuXHRcdHJldHVybiB0aGlzW0lOVEVSTkFMU10uc3RhdHVzO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlbmllbmNlIHByb3BlcnR5IHJlcHJlc2VudGluZyBpZiB0aGUgcmVxdWVzdCBlbmRlZCBub3JtYWxseVxuXHQgKi9cblx0Z2V0IG9rKCkge1xuXHRcdHJldHVybiB0aGlzW0lOVEVSTkFMU10uc3RhdHVzID49IDIwMCAmJiB0aGlzW0lOVEVSTkFMU10uc3RhdHVzIDwgMzAwO1xuXHR9XG5cblx0Z2V0IHJlZGlyZWN0ZWQoKSB7XG5cdFx0cmV0dXJuIHRoaXNbSU5URVJOQUxTXS5jb3VudGVyID4gMDtcblx0fVxuXG5cdGdldCBzdGF0dXNUZXh0KCkge1xuXHRcdHJldHVybiB0aGlzW0lOVEVSTkFMU10uc3RhdHVzVGV4dDtcblx0fVxuXG5cdGdldCBoZWFkZXJzKCkge1xuXHRcdHJldHVybiB0aGlzW0lOVEVSTkFMU10uaGVhZGVycztcblx0fVxuXG5cdGdldCBoaWdoV2F0ZXJNYXJrKCkge1xuXHRcdHJldHVybiB0aGlzW0lOVEVSTkFMU10uaGlnaFdhdGVyTWFyaztcblx0fVxuXG5cdC8qKlxuXHQgKiBDbG9uZSB0aGlzIHJlc3BvbnNlXG5cdCAqXG5cdCAqIEByZXR1cm4gIFJlc3BvbnNlXG5cdCAqL1xuXHRjbG9uZSgpIHtcblx0XHRyZXR1cm4gbmV3IFJlc3BvbnNlKGNsb25lKHRoaXMsIHRoaXMuaGlnaFdhdGVyTWFyayksIHtcblx0XHRcdHR5cGU6IHRoaXMudHlwZSxcblx0XHRcdHVybDogdGhpcy51cmwsXG5cdFx0XHRzdGF0dXM6IHRoaXMuc3RhdHVzLFxuXHRcdFx0c3RhdHVzVGV4dDogdGhpcy5zdGF0dXNUZXh0LFxuXHRcdFx0aGVhZGVyczogdGhpcy5oZWFkZXJzLFxuXHRcdFx0b2s6IHRoaXMub2ssXG5cdFx0XHRyZWRpcmVjdGVkOiB0aGlzLnJlZGlyZWN0ZWQsXG5cdFx0XHRzaXplOiB0aGlzLnNpemUsXG5cdFx0XHRoaWdoV2F0ZXJNYXJrOiB0aGlzLmhpZ2hXYXRlck1hcmtcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdXJsICAgIFRoZSBVUkwgdGhhdCB0aGUgbmV3IHJlc3BvbnNlIGlzIHRvIG9yaWdpbmF0ZSBmcm9tLlxuXHQgKiBAcGFyYW0ge251bWJlcn0gc3RhdHVzIEFuIG9wdGlvbmFsIHN0YXR1cyBjb2RlIGZvciB0aGUgcmVzcG9uc2UgKGUuZy4sIDMwMi4pXG5cdCAqIEByZXR1cm5zIHtSZXNwb25zZX0gICAgQSBSZXNwb25zZSBvYmplY3QuXG5cdCAqL1xuXHRzdGF0aWMgcmVkaXJlY3QodXJsLCBzdGF0dXMgPSAzMDIpIHtcblx0XHRpZiAoIWlzUmVkaXJlY3Qoc3RhdHVzKSkge1xuXHRcdFx0dGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0ZhaWxlZCB0byBleGVjdXRlIFwicmVkaXJlY3RcIiBvbiBcInJlc3BvbnNlXCI6IEludmFsaWQgc3RhdHVzIGNvZGUnKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gbmV3IFJlc3BvbnNlKG51bGwsIHtcblx0XHRcdGhlYWRlcnM6IHtcblx0XHRcdFx0bG9jYXRpb246IG5ldyBVUkwodXJsKS50b1N0cmluZygpXG5cdFx0XHR9LFxuXHRcdFx0c3RhdHVzXG5cdFx0fSk7XG5cdH1cblxuXHRzdGF0aWMgZXJyb3IoKSB7XG5cdFx0Y29uc3QgcmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UobnVsbCwge3N0YXR1czogMCwgc3RhdHVzVGV4dDogJyd9KTtcblx0XHRyZXNwb25zZVtJTlRFUk5BTFNdLnR5cGUgPSAnZXJyb3InO1xuXHRcdHJldHVybiByZXNwb25zZTtcblx0fVxuXG5cdHN0YXRpYyBqc29uKGRhdGEgPSB1bmRlZmluZWQsIGluaXQgPSB7fSkge1xuXHRcdGNvbnN0IGJvZHkgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcblxuXHRcdGlmIChib2R5ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ2RhdGEgaXMgbm90IEpTT04gc2VyaWFsaXphYmxlJyk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgaGVhZGVycyA9IG5ldyBIZWFkZXJzKGluaXQgJiYgaW5pdC5oZWFkZXJzKTtcblxuXHRcdGlmICghaGVhZGVycy5oYXMoJ2NvbnRlbnQtdHlwZScpKSB7XG5cdFx0XHRoZWFkZXJzLnNldCgnY29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gbmV3IFJlc3BvbnNlKGJvZHksIHtcblx0XHRcdC4uLmluaXQsXG5cdFx0XHRoZWFkZXJzXG5cdFx0fSk7XG5cdH1cblxuXHRnZXQgW1N5bWJvbC50b1N0cmluZ1RhZ10oKSB7XG5cdFx0cmV0dXJuICdSZXNwb25zZSc7XG5cdH1cbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoUmVzcG9uc2UucHJvdG90eXBlLCB7XG5cdHR5cGU6IHtlbnVtZXJhYmxlOiB0cnVlfSxcblx0dXJsOiB7ZW51bWVyYWJsZTogdHJ1ZX0sXG5cdHN0YXR1czoge2VudW1lcmFibGU6IHRydWV9LFxuXHRvazoge2VudW1lcmFibGU6IHRydWV9LFxuXHRyZWRpcmVjdGVkOiB7ZW51bWVyYWJsZTogdHJ1ZX0sXG5cdHN0YXR1c1RleHQ6IHtlbnVtZXJhYmxlOiB0cnVlfSxcblx0aGVhZGVyczoge2VudW1lcmFibGU6IHRydWV9LFxuXHRjbG9uZToge2VudW1lcmFibGU6IHRydWV9XG59KTtcbiIsICIvKipcbiAqIFJlcXVlc3QuanNcbiAqXG4gKiBSZXF1ZXN0IGNsYXNzIGNvbnRhaW5zIHNlcnZlciBvbmx5IG9wdGlvbnNcbiAqXG4gKiBBbGwgc3BlYyBhbGdvcml0aG0gc3RlcCBudW1iZXJzIGFyZSBiYXNlZCBvbiBodHRwczovL2ZldGNoLnNwZWMud2hhdHdnLm9yZy9jb21taXQtc25hcHNob3RzL2FlNzE2ODIyY2IzYTYxODQzMjI2Y2QwOTBlZWZjNjU4OTQ0NmMxZDIvLlxuICovXG5cbmltcG9ydCB7Zm9ybWF0IGFzIGZvcm1hdFVybH0gZnJvbSAnbm9kZTp1cmwnO1xuaW1wb3J0IHtkZXByZWNhdGV9IGZyb20gJ25vZGU6dXRpbCc7XG5pbXBvcnQgSGVhZGVycyBmcm9tICcuL2hlYWRlcnMuanMnO1xuaW1wb3J0IEJvZHksIHtjbG9uZSwgZXh0cmFjdENvbnRlbnRUeXBlLCBnZXRUb3RhbEJ5dGVzfSBmcm9tICcuL2JvZHkuanMnO1xuaW1wb3J0IHtpc0Fib3J0U2lnbmFsfSBmcm9tICcuL3V0aWxzL2lzLmpzJztcbmltcG9ydCB7Z2V0U2VhcmNofSBmcm9tICcuL3V0aWxzL2dldC1zZWFyY2guanMnO1xuaW1wb3J0IHtcblx0dmFsaWRhdGVSZWZlcnJlclBvbGljeSwgZGV0ZXJtaW5lUmVxdWVzdHNSZWZlcnJlciwgREVGQVVMVF9SRUZFUlJFUl9QT0xJQ1lcbn0gZnJvbSAnLi91dGlscy9yZWZlcnJlci5qcyc7XG5cbmNvbnN0IElOVEVSTkFMUyA9IFN5bWJvbCgnUmVxdWVzdCBpbnRlcm5hbHMnKTtcblxuLyoqXG4gKiBDaGVjayBpZiBgb2JqYCBpcyBhbiBpbnN0YW5jZSBvZiBSZXF1ZXN0LlxuICpcbiAqIEBwYXJhbSAgeyp9IG9iamVjdFxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuY29uc3QgaXNSZXF1ZXN0ID0gb2JqZWN0ID0+IHtcblx0cmV0dXJuIChcblx0XHR0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJlxuXHRcdHR5cGVvZiBvYmplY3RbSU5URVJOQUxTXSA9PT0gJ29iamVjdCdcblx0KTtcbn07XG5cbmNvbnN0IGRvQmFkRGF0YVdhcm4gPSBkZXByZWNhdGUoKCkgPT4ge30sXG5cdCcuZGF0YSBpcyBub3QgYSB2YWxpZCBSZXF1ZXN0SW5pdCBwcm9wZXJ0eSwgdXNlIC5ib2R5IGluc3RlYWQnLFxuXHQnaHR0cHM6Ly9naXRodWIuY29tL25vZGUtZmV0Y2gvbm9kZS1mZXRjaC9pc3N1ZXMvMTAwMCAocmVxdWVzdCknKTtcblxuLyoqXG4gKiBSZXF1ZXN0IGNsYXNzXG4gKlxuICogUmVmOiBodHRwczovL2ZldGNoLnNwZWMud2hhdHdnLm9yZy8jcmVxdWVzdC1jbGFzc1xuICpcbiAqIEBwYXJhbSAgIE1peGVkICAgaW5wdXQgIFVybCBvciBSZXF1ZXN0IGluc3RhbmNlXG4gKiBAcGFyYW0gICBPYmplY3QgIGluaXQgICBDdXN0b20gb3B0aW9uc1xuICogQHJldHVybiAgVm9pZFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZXF1ZXN0IGV4dGVuZHMgQm9keSB7XG5cdGNvbnN0cnVjdG9yKGlucHV0LCBpbml0ID0ge30pIHtcblx0XHRsZXQgcGFyc2VkVVJMO1xuXG5cdFx0Ly8gTm9ybWFsaXplIGlucHV0IGFuZCBmb3JjZSBVUkwgdG8gYmUgZW5jb2RlZCBhcyBVVEYtOCAoaHR0cHM6Ly9naXRodWIuY29tL25vZGUtZmV0Y2gvbm9kZS1mZXRjaC9pc3N1ZXMvMjQ1KVxuXHRcdGlmIChpc1JlcXVlc3QoaW5wdXQpKSB7XG5cdFx0XHRwYXJzZWRVUkwgPSBuZXcgVVJMKGlucHV0LnVybCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHBhcnNlZFVSTCA9IG5ldyBVUkwoaW5wdXQpO1xuXHRcdFx0aW5wdXQgPSB7fTtcblx0XHR9XG5cblx0XHRpZiAocGFyc2VkVVJMLnVzZXJuYW1lICE9PSAnJyB8fCBwYXJzZWRVUkwucGFzc3dvcmQgIT09ICcnKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKGAke3BhcnNlZFVSTH0gaXMgYW4gdXJsIHdpdGggZW1iZWRkZWQgY3JlZGVudGlhbHMuYCk7XG5cdFx0fVxuXG5cdFx0bGV0IG1ldGhvZCA9IGluaXQubWV0aG9kIHx8IGlucHV0Lm1ldGhvZCB8fCAnR0VUJztcblx0XHRpZiAoL14oZGVsZXRlfGdldHxoZWFkfG9wdGlvbnN8cG9zdHxwdXQpJC9pLnRlc3QobWV0aG9kKSkge1xuXHRcdFx0bWV0aG9kID0gbWV0aG9kLnRvVXBwZXJDYXNlKCk7XG5cdFx0fVxuXG5cdFx0aWYgKCFpc1JlcXVlc3QoaW5pdCkgJiYgJ2RhdGEnIGluIGluaXQpIHtcblx0XHRcdGRvQmFkRGF0YVdhcm4oKTtcblx0XHR9XG5cblx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZXEtbnVsbCwgZXFlcWVxXG5cdFx0aWYgKChpbml0LmJvZHkgIT0gbnVsbCB8fCAoaXNSZXF1ZXN0KGlucHV0KSAmJiBpbnB1dC5ib2R5ICE9PSBudWxsKSkgJiZcblx0XHRcdChtZXRob2QgPT09ICdHRVQnIHx8IG1ldGhvZCA9PT0gJ0hFQUQnKSkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignUmVxdWVzdCB3aXRoIEdFVC9IRUFEIG1ldGhvZCBjYW5ub3QgaGF2ZSBib2R5Jyk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgaW5wdXRCb2R5ID0gaW5pdC5ib2R5ID9cblx0XHRcdGluaXQuYm9keSA6XG5cdFx0XHQoaXNSZXF1ZXN0KGlucHV0KSAmJiBpbnB1dC5ib2R5ICE9PSBudWxsID9cblx0XHRcdFx0Y2xvbmUoaW5wdXQpIDpcblx0XHRcdFx0bnVsbCk7XG5cblx0XHRzdXBlcihpbnB1dEJvZHksIHtcblx0XHRcdHNpemU6IGluaXQuc2l6ZSB8fCBpbnB1dC5zaXplIHx8IDBcblx0XHR9KTtcblxuXHRcdGNvbnN0IGhlYWRlcnMgPSBuZXcgSGVhZGVycyhpbml0LmhlYWRlcnMgfHwgaW5wdXQuaGVhZGVycyB8fCB7fSk7XG5cblx0XHRpZiAoaW5wdXRCb2R5ICE9PSBudWxsICYmICFoZWFkZXJzLmhhcygnQ29udGVudC1UeXBlJykpIHtcblx0XHRcdGNvbnN0IGNvbnRlbnRUeXBlID0gZXh0cmFjdENvbnRlbnRUeXBlKGlucHV0Qm9keSwgdGhpcyk7XG5cdFx0XHRpZiAoY29udGVudFR5cGUpIHtcblx0XHRcdFx0aGVhZGVycy5zZXQoJ0NvbnRlbnQtVHlwZScsIGNvbnRlbnRUeXBlKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRsZXQgc2lnbmFsID0gaXNSZXF1ZXN0KGlucHV0KSA/XG5cdFx0XHRpbnB1dC5zaWduYWwgOlxuXHRcdFx0bnVsbDtcblx0XHRpZiAoJ3NpZ25hbCcgaW4gaW5pdCkge1xuXHRcdFx0c2lnbmFsID0gaW5pdC5zaWduYWw7XG5cdFx0fVxuXG5cdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWVxLW51bGwsIGVxZXFlcVxuXHRcdGlmIChzaWduYWwgIT0gbnVsbCAmJiAhaXNBYm9ydFNpZ25hbChzaWduYWwpKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCBzaWduYWwgdG8gYmUgYW4gaW5zdGFuY2VvZiBBYm9ydFNpZ25hbCBvciBFdmVudFRhcmdldCcpO1xuXHRcdH1cblxuXHRcdC8vIFx1MDBBNzUuNCwgUmVxdWVzdCBjb25zdHJ1Y3RvciBzdGVwcywgc3RlcCAxNS4xXG5cdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWVxLW51bGwsIGVxZXFlcVxuXHRcdGxldCByZWZlcnJlciA9IGluaXQucmVmZXJyZXIgPT0gbnVsbCA/IGlucHV0LnJlZmVycmVyIDogaW5pdC5yZWZlcnJlcjtcblx0XHRpZiAocmVmZXJyZXIgPT09ICcnKSB7XG5cdFx0XHQvLyBcdTAwQTc1LjQsIFJlcXVlc3QgY29uc3RydWN0b3Igc3RlcHMsIHN0ZXAgMTUuMlxuXHRcdFx0cmVmZXJyZXIgPSAnbm8tcmVmZXJyZXInO1xuXHRcdH0gZWxzZSBpZiAocmVmZXJyZXIpIHtcblx0XHRcdC8vIFx1MDBBNzUuNCwgUmVxdWVzdCBjb25zdHJ1Y3RvciBzdGVwcywgc3RlcCAxNS4zLjEsIDE1LjMuMlxuXHRcdFx0Y29uc3QgcGFyc2VkUmVmZXJyZXIgPSBuZXcgVVJMKHJlZmVycmVyKTtcblx0XHRcdC8vIFx1MDBBNzUuNCwgUmVxdWVzdCBjb25zdHJ1Y3RvciBzdGVwcywgc3RlcCAxNS4zLjMsIDE1LjMuNFxuXHRcdFx0cmVmZXJyZXIgPSAvXmFib3V0OihcXC9cXC8pP2NsaWVudCQvLnRlc3QocGFyc2VkUmVmZXJyZXIpID8gJ2NsaWVudCcgOiBwYXJzZWRSZWZlcnJlcjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVmZXJyZXIgPSB1bmRlZmluZWQ7XG5cdFx0fVxuXG5cdFx0dGhpc1tJTlRFUk5BTFNdID0ge1xuXHRcdFx0bWV0aG9kLFxuXHRcdFx0cmVkaXJlY3Q6IGluaXQucmVkaXJlY3QgfHwgaW5wdXQucmVkaXJlY3QgfHwgJ2ZvbGxvdycsXG5cdFx0XHRoZWFkZXJzLFxuXHRcdFx0cGFyc2VkVVJMLFxuXHRcdFx0c2lnbmFsLFxuXHRcdFx0cmVmZXJyZXJcblx0XHR9O1xuXG5cdFx0Ly8gTm9kZS1mZXRjaC1vbmx5IG9wdGlvbnNcblx0XHR0aGlzLmZvbGxvdyA9IGluaXQuZm9sbG93ID09PSB1bmRlZmluZWQgPyAoaW5wdXQuZm9sbG93ID09PSB1bmRlZmluZWQgPyAyMCA6IGlucHV0LmZvbGxvdykgOiBpbml0LmZvbGxvdztcblx0XHR0aGlzLmNvbXByZXNzID0gaW5pdC5jb21wcmVzcyA9PT0gdW5kZWZpbmVkID8gKGlucHV0LmNvbXByZXNzID09PSB1bmRlZmluZWQgPyB0cnVlIDogaW5wdXQuY29tcHJlc3MpIDogaW5pdC5jb21wcmVzcztcblx0XHR0aGlzLmNvdW50ZXIgPSBpbml0LmNvdW50ZXIgfHwgaW5wdXQuY291bnRlciB8fCAwO1xuXHRcdHRoaXMuYWdlbnQgPSBpbml0LmFnZW50IHx8IGlucHV0LmFnZW50O1xuXHRcdHRoaXMuaGlnaFdhdGVyTWFyayA9IGluaXQuaGlnaFdhdGVyTWFyayB8fCBpbnB1dC5oaWdoV2F0ZXJNYXJrIHx8IDE2Mzg0O1xuXHRcdHRoaXMuaW5zZWN1cmVIVFRQUGFyc2VyID0gaW5pdC5pbnNlY3VyZUhUVFBQYXJzZXIgfHwgaW5wdXQuaW5zZWN1cmVIVFRQUGFyc2VyIHx8IGZhbHNlO1xuXG5cdFx0Ly8gXHUwMEE3NS40LCBSZXF1ZXN0IGNvbnN0cnVjdG9yIHN0ZXBzLCBzdGVwIDE2LlxuXHRcdC8vIERlZmF1bHQgaXMgZW1wdHkgc3RyaW5nIHBlciBodHRwczovL2ZldGNoLnNwZWMud2hhdHdnLm9yZy8jY29uY2VwdC1yZXF1ZXN0LXJlZmVycmVyLXBvbGljeVxuXHRcdHRoaXMucmVmZXJyZXJQb2xpY3kgPSBpbml0LnJlZmVycmVyUG9saWN5IHx8IGlucHV0LnJlZmVycmVyUG9saWN5IHx8ICcnO1xuXHR9XG5cblx0LyoqIEByZXR1cm5zIHtzdHJpbmd9ICovXG5cdGdldCBtZXRob2QoKSB7XG5cdFx0cmV0dXJuIHRoaXNbSU5URVJOQUxTXS5tZXRob2Q7XG5cdH1cblxuXHQvKiogQHJldHVybnMge3N0cmluZ30gKi9cblx0Z2V0IHVybCgpIHtcblx0XHRyZXR1cm4gZm9ybWF0VXJsKHRoaXNbSU5URVJOQUxTXS5wYXJzZWRVUkwpO1xuXHR9XG5cblx0LyoqIEByZXR1cm5zIHtIZWFkZXJzfSAqL1xuXHRnZXQgaGVhZGVycygpIHtcblx0XHRyZXR1cm4gdGhpc1tJTlRFUk5BTFNdLmhlYWRlcnM7XG5cdH1cblxuXHRnZXQgcmVkaXJlY3QoKSB7XG5cdFx0cmV0dXJuIHRoaXNbSU5URVJOQUxTXS5yZWRpcmVjdDtcblx0fVxuXG5cdC8qKiBAcmV0dXJucyB7QWJvcnRTaWduYWx9ICovXG5cdGdldCBzaWduYWwoKSB7XG5cdFx0cmV0dXJuIHRoaXNbSU5URVJOQUxTXS5zaWduYWw7XG5cdH1cblxuXHQvLyBodHRwczovL2ZldGNoLnNwZWMud2hhdHdnLm9yZy8jZG9tLXJlcXVlc3QtcmVmZXJyZXJcblx0Z2V0IHJlZmVycmVyKCkge1xuXHRcdGlmICh0aGlzW0lOVEVSTkFMU10ucmVmZXJyZXIgPT09ICduby1yZWZlcnJlcicpIHtcblx0XHRcdHJldHVybiAnJztcblx0XHR9XG5cblx0XHRpZiAodGhpc1tJTlRFUk5BTFNdLnJlZmVycmVyID09PSAnY2xpZW50Jykge1xuXHRcdFx0cmV0dXJuICdhYm91dDpjbGllbnQnO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzW0lOVEVSTkFMU10ucmVmZXJyZXIpIHtcblx0XHRcdHJldHVybiB0aGlzW0lOVEVSTkFMU10ucmVmZXJyZXIudG9TdHJpbmcoKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9XG5cblx0Z2V0IHJlZmVycmVyUG9saWN5KCkge1xuXHRcdHJldHVybiB0aGlzW0lOVEVSTkFMU10ucmVmZXJyZXJQb2xpY3k7XG5cdH1cblxuXHRzZXQgcmVmZXJyZXJQb2xpY3kocmVmZXJyZXJQb2xpY3kpIHtcblx0XHR0aGlzW0lOVEVSTkFMU10ucmVmZXJyZXJQb2xpY3kgPSB2YWxpZGF0ZVJlZmVycmVyUG9saWN5KHJlZmVycmVyUG9saWN5KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDbG9uZSB0aGlzIHJlcXVlc3Rcblx0ICpcblx0ICogQHJldHVybiAgUmVxdWVzdFxuXHQgKi9cblx0Y2xvbmUoKSB7XG5cdFx0cmV0dXJuIG5ldyBSZXF1ZXN0KHRoaXMpO1xuXHR9XG5cblx0Z2V0IFtTeW1ib2wudG9TdHJpbmdUYWddKCkge1xuXHRcdHJldHVybiAnUmVxdWVzdCc7XG5cdH1cbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoUmVxdWVzdC5wcm90b3R5cGUsIHtcblx0bWV0aG9kOiB7ZW51bWVyYWJsZTogdHJ1ZX0sXG5cdHVybDoge2VudW1lcmFibGU6IHRydWV9LFxuXHRoZWFkZXJzOiB7ZW51bWVyYWJsZTogdHJ1ZX0sXG5cdHJlZGlyZWN0OiB7ZW51bWVyYWJsZTogdHJ1ZX0sXG5cdGNsb25lOiB7ZW51bWVyYWJsZTogdHJ1ZX0sXG5cdHNpZ25hbDoge2VudW1lcmFibGU6IHRydWV9LFxuXHRyZWZlcnJlcjoge2VudW1lcmFibGU6IHRydWV9LFxuXHRyZWZlcnJlclBvbGljeToge2VudW1lcmFibGU6IHRydWV9XG59KTtcblxuLyoqXG4gKiBDb252ZXJ0IGEgUmVxdWVzdCB0byBOb2RlLmpzIGh0dHAgcmVxdWVzdCBvcHRpb25zLlxuICpcbiAqIEBwYXJhbSB7UmVxdWVzdH0gcmVxdWVzdCAtIEEgUmVxdWVzdCBpbnN0YW5jZVxuICogQHJldHVybiBUaGUgb3B0aW9ucyBvYmplY3QgdG8gYmUgcGFzc2VkIHRvIGh0dHAucmVxdWVzdFxuICovXG5leHBvcnQgY29uc3QgZ2V0Tm9kZVJlcXVlc3RPcHRpb25zID0gcmVxdWVzdCA9PiB7XG5cdGNvbnN0IHtwYXJzZWRVUkx9ID0gcmVxdWVzdFtJTlRFUk5BTFNdO1xuXHRjb25zdCBoZWFkZXJzID0gbmV3IEhlYWRlcnMocmVxdWVzdFtJTlRFUk5BTFNdLmhlYWRlcnMpO1xuXG5cdC8vIEZldGNoIHN0ZXAgMS4zXG5cdGlmICghaGVhZGVycy5oYXMoJ0FjY2VwdCcpKSB7XG5cdFx0aGVhZGVycy5zZXQoJ0FjY2VwdCcsICcqLyonKTtcblx0fVxuXG5cdC8vIEhUVFAtbmV0d29yay1vci1jYWNoZSBmZXRjaCBzdGVwcyAyLjQtMi43XG5cdGxldCBjb250ZW50TGVuZ3RoVmFsdWUgPSBudWxsO1xuXHRpZiAocmVxdWVzdC5ib2R5ID09PSBudWxsICYmIC9eKHBvc3R8cHV0KSQvaS50ZXN0KHJlcXVlc3QubWV0aG9kKSkge1xuXHRcdGNvbnRlbnRMZW5ndGhWYWx1ZSA9ICcwJztcblx0fVxuXG5cdGlmIChyZXF1ZXN0LmJvZHkgIT09IG51bGwpIHtcblx0XHRjb25zdCB0b3RhbEJ5dGVzID0gZ2V0VG90YWxCeXRlcyhyZXF1ZXN0KTtcblx0XHQvLyBTZXQgQ29udGVudC1MZW5ndGggaWYgdG90YWxCeXRlcyBpcyBhIG51bWJlciAodGhhdCBpcyBub3QgTmFOKVxuXHRcdGlmICh0eXBlb2YgdG90YWxCeXRlcyA9PT0gJ251bWJlcicgJiYgIU51bWJlci5pc05hTih0b3RhbEJ5dGVzKSkge1xuXHRcdFx0Y29udGVudExlbmd0aFZhbHVlID0gU3RyaW5nKHRvdGFsQnl0ZXMpO1xuXHRcdH1cblx0fVxuXG5cdGlmIChjb250ZW50TGVuZ3RoVmFsdWUpIHtcblx0XHRoZWFkZXJzLnNldCgnQ29udGVudC1MZW5ndGgnLCBjb250ZW50TGVuZ3RoVmFsdWUpO1xuXHR9XG5cblx0Ly8gNC4xLiBNYWluIGZldGNoLCBzdGVwIDIuNlxuXHQvLyA+IElmIHJlcXVlc3QncyByZWZlcnJlciBwb2xpY3kgaXMgdGhlIGVtcHR5IHN0cmluZywgdGhlbiBzZXQgcmVxdWVzdCdzIHJlZmVycmVyIHBvbGljeSB0byB0aGVcblx0Ly8gPiBkZWZhdWx0IHJlZmVycmVyIHBvbGljeS5cblx0aWYgKHJlcXVlc3QucmVmZXJyZXJQb2xpY3kgPT09ICcnKSB7XG5cdFx0cmVxdWVzdC5yZWZlcnJlclBvbGljeSA9IERFRkFVTFRfUkVGRVJSRVJfUE9MSUNZO1xuXHR9XG5cblx0Ly8gNC4xLiBNYWluIGZldGNoLCBzdGVwIDIuN1xuXHQvLyA+IElmIHJlcXVlc3QncyByZWZlcnJlciBpcyBub3QgXCJuby1yZWZlcnJlclwiLCBzZXQgcmVxdWVzdCdzIHJlZmVycmVyIHRvIHRoZSByZXN1bHQgb2YgaW52b2tpbmdcblx0Ly8gPiBkZXRlcm1pbmUgcmVxdWVzdCdzIHJlZmVycmVyLlxuXHRpZiAocmVxdWVzdC5yZWZlcnJlciAmJiByZXF1ZXN0LnJlZmVycmVyICE9PSAnbm8tcmVmZXJyZXInKSB7XG5cdFx0cmVxdWVzdFtJTlRFUk5BTFNdLnJlZmVycmVyID0gZGV0ZXJtaW5lUmVxdWVzdHNSZWZlcnJlcihyZXF1ZXN0KTtcblx0fSBlbHNlIHtcblx0XHRyZXF1ZXN0W0lOVEVSTkFMU10ucmVmZXJyZXIgPSAnbm8tcmVmZXJyZXInO1xuXHR9XG5cblx0Ly8gNC41LiBIVFRQLW5ldHdvcmstb3ItY2FjaGUgZmV0Y2gsIHN0ZXAgNi45XG5cdC8vID4gSWYgaHR0cFJlcXVlc3QncyByZWZlcnJlciBpcyBhIFVSTCwgdGhlbiBhcHBlbmQgYFJlZmVyZXJgL2h0dHBSZXF1ZXN0J3MgcmVmZXJyZXIsIHNlcmlhbGl6ZWRcblx0Ly8gPiAgYW5kIGlzb21vcnBoaWMgZW5jb2RlZCwgdG8gaHR0cFJlcXVlc3QncyBoZWFkZXIgbGlzdC5cblx0aWYgKHJlcXVlc3RbSU5URVJOQUxTXS5yZWZlcnJlciBpbnN0YW5jZW9mIFVSTCkge1xuXHRcdGhlYWRlcnMuc2V0KCdSZWZlcmVyJywgcmVxdWVzdC5yZWZlcnJlcik7XG5cdH1cblxuXHQvLyBIVFRQLW5ldHdvcmstb3ItY2FjaGUgZmV0Y2ggc3RlcCAyLjExXG5cdGlmICghaGVhZGVycy5oYXMoJ1VzZXItQWdlbnQnKSkge1xuXHRcdGhlYWRlcnMuc2V0KCdVc2VyLUFnZW50JywgJ25vZGUtZmV0Y2gnKTtcblx0fVxuXG5cdC8vIEhUVFAtbmV0d29yay1vci1jYWNoZSBmZXRjaCBzdGVwIDIuMTVcblx0aWYgKHJlcXVlc3QuY29tcHJlc3MgJiYgIWhlYWRlcnMuaGFzKCdBY2NlcHQtRW5jb2RpbmcnKSkge1xuXHRcdGhlYWRlcnMuc2V0KCdBY2NlcHQtRW5jb2RpbmcnLCAnZ3ppcCwgZGVmbGF0ZSwgYnInKTtcblx0fVxuXG5cdGxldCB7YWdlbnR9ID0gcmVxdWVzdDtcblx0aWYgKHR5cGVvZiBhZ2VudCA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdGFnZW50ID0gYWdlbnQocGFyc2VkVVJMKTtcblx0fVxuXG5cdC8vIEhUVFAtbmV0d29yayBmZXRjaCBzdGVwIDQuMlxuXHQvLyBjaHVua2VkIGVuY29kaW5nIGlzIGhhbmRsZWQgYnkgTm9kZS5qc1xuXG5cdGNvbnN0IHNlYXJjaCA9IGdldFNlYXJjaChwYXJzZWRVUkwpO1xuXG5cdC8vIFBhc3MgdGhlIGZ1bGwgVVJMIGRpcmVjdGx5IHRvIHJlcXVlc3QoKSwgYnV0IG92ZXJ3cml0ZSB0aGUgZm9sbG93aW5nXG5cdC8vIG9wdGlvbnM6XG5cdGNvbnN0IG9wdGlvbnMgPSB7XG5cdFx0Ly8gT3ZlcndyaXRlIHNlYXJjaCB0byByZXRhaW4gdHJhaWxpbmcgPyAoaXNzdWUgIzc3Nilcblx0XHRwYXRoOiBwYXJzZWRVUkwucGF0aG5hbWUgKyBzZWFyY2gsXG5cdFx0Ly8gVGhlIGZvbGxvd2luZyBvcHRpb25zIGFyZSBub3QgZXhwcmVzc2VkIGluIHRoZSBVUkxcblx0XHRtZXRob2Q6IHJlcXVlc3QubWV0aG9kLFxuXHRcdGhlYWRlcnM6IGhlYWRlcnNbU3ltYm9sLmZvcignbm9kZWpzLnV0aWwuaW5zcGVjdC5jdXN0b20nKV0oKSxcblx0XHRpbnNlY3VyZUhUVFBQYXJzZXI6IHJlcXVlc3QuaW5zZWN1cmVIVFRQUGFyc2VyLFxuXHRcdGFnZW50XG5cdH07XG5cblx0cmV0dXJuIHtcblx0XHQvKiogQHR5cGUge1VSTH0gKi9cblx0XHRwYXJzZWRVUkwsXG5cdFx0b3B0aW9uc1xuXHR9O1xufTtcbiIsICJleHBvcnQgY29uc3QgZ2V0U2VhcmNoID0gcGFyc2VkVVJMID0+IHtcblx0aWYgKHBhcnNlZFVSTC5zZWFyY2gpIHtcblx0XHRyZXR1cm4gcGFyc2VkVVJMLnNlYXJjaDtcblx0fVxuXG5cdGNvbnN0IGxhc3RPZmZzZXQgPSBwYXJzZWRVUkwuaHJlZi5sZW5ndGggLSAxO1xuXHRjb25zdCBoYXNoID0gcGFyc2VkVVJMLmhhc2ggfHwgKHBhcnNlZFVSTC5ocmVmW2xhc3RPZmZzZXRdID09PSAnIycgPyAnIycgOiAnJyk7XG5cdHJldHVybiBwYXJzZWRVUkwuaHJlZltsYXN0T2Zmc2V0IC0gaGFzaC5sZW5ndGhdID09PSAnPycgPyAnPycgOiAnJztcbn07XG4iLCAiaW1wb3J0IHtpc0lQfSBmcm9tICdub2RlOm5ldCc7XG5cbi8qKlxuICogQGV4dGVybmFsIFVSTFxuICogQHNlZSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1VSTHxVUkx9XG4gKi9cblxuLyoqXG4gKiBAbW9kdWxlIHV0aWxzL3JlZmVycmVyXG4gKiBAcHJpdmF0ZVxuICovXG5cbi8qKlxuICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93M2MuZ2l0aHViLmlvL3dlYmFwcHNlYy1yZWZlcnJlci1wb2xpY3kvI3N0cmlwLXVybHxSZWZlcnJlciBQb2xpY3kgXHUwMEE3OC40LiBTdHJpcCB1cmwgZm9yIHVzZSBhcyBhIHJlZmVycmVyfVxuICogQHBhcmFtIHtzdHJpbmd9IFVSTFxuICogQHBhcmFtIHtib29sZWFufSBbb3JpZ2luT25seT1mYWxzZV1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN0cmlwVVJMRm9yVXNlQXNBUmVmZXJyZXIodXJsLCBvcmlnaW5Pbmx5ID0gZmFsc2UpIHtcblx0Ly8gMS4gSWYgdXJsIGlzIG51bGwsIHJldHVybiBubyByZWZlcnJlci5cblx0aWYgKHVybCA9PSBudWxsKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tZXEtbnVsbCwgZXFlcWVxXG5cdFx0cmV0dXJuICduby1yZWZlcnJlcic7XG5cdH1cblxuXHR1cmwgPSBuZXcgVVJMKHVybCk7XG5cblx0Ly8gMi4gSWYgdXJsJ3Mgc2NoZW1lIGlzIGEgbG9jYWwgc2NoZW1lLCB0aGVuIHJldHVybiBubyByZWZlcnJlci5cblx0aWYgKC9eKGFib3V0fGJsb2J8ZGF0YSk6JC8udGVzdCh1cmwucHJvdG9jb2wpKSB7XG5cdFx0cmV0dXJuICduby1yZWZlcnJlcic7XG5cdH1cblxuXHQvLyAzLiBTZXQgdXJsJ3MgdXNlcm5hbWUgdG8gdGhlIGVtcHR5IHN0cmluZy5cblx0dXJsLnVzZXJuYW1lID0gJyc7XG5cblx0Ly8gNC4gU2V0IHVybCdzIHBhc3N3b3JkIHRvIG51bGwuXG5cdC8vIE5vdGU6IGBudWxsYCBhcHBlYXJzIHRvIGJlIGEgbWlzdGFrZSBhcyB0aGlzIGFjdHVhbGx5IHJlc3VsdHMgaW4gdGhlIHBhc3N3b3JkIGJlaW5nIGBcIm51bGxcImAuXG5cdHVybC5wYXNzd29yZCA9ICcnO1xuXG5cdC8vIDUuIFNldCB1cmwncyBmcmFnbWVudCB0byBudWxsLlxuXHQvLyBOb3RlOiBgbnVsbGAgYXBwZWFycyB0byBiZSBhIG1pc3Rha2UgYXMgdGhpcyBhY3R1YWxseSByZXN1bHRzIGluIHRoZSBmcmFnbWVudCBiZWluZyBgXCIjbnVsbFwiYC5cblx0dXJsLmhhc2ggPSAnJztcblxuXHQvLyA2LiBJZiB0aGUgb3JpZ2luLW9ubHkgZmxhZyBpcyB0cnVlLCB0aGVuOlxuXHRpZiAob3JpZ2luT25seSkge1xuXHRcdC8vIDYuMS4gU2V0IHVybCdzIHBhdGggdG8gbnVsbC5cblx0XHQvLyBOb3RlOiBgbnVsbGAgYXBwZWFycyB0byBiZSBhIG1pc3Rha2UgYXMgdGhpcyBhY3R1YWxseSByZXN1bHRzIGluIHRoZSBwYXRoIGJlaW5nIGBcIi9udWxsXCJgLlxuXHRcdHVybC5wYXRobmFtZSA9ICcnO1xuXG5cdFx0Ly8gNi4yLiBTZXQgdXJsJ3MgcXVlcnkgdG8gbnVsbC5cblx0XHQvLyBOb3RlOiBgbnVsbGAgYXBwZWFycyB0byBiZSBhIG1pc3Rha2UgYXMgdGhpcyBhY3R1YWxseSByZXN1bHRzIGluIHRoZSBxdWVyeSBiZWluZyBgXCI/bnVsbFwiYC5cblx0XHR1cmwuc2VhcmNoID0gJyc7XG5cdH1cblxuXHQvLyA3LiBSZXR1cm4gdXJsLlxuXHRyZXR1cm4gdXJsO1xufVxuXG4vKipcbiAqIEBzZWUge0BsaW5rIGh0dHBzOi8vdzNjLmdpdGh1Yi5pby93ZWJhcHBzZWMtcmVmZXJyZXItcG9saWN5LyNlbnVtZGVmLXJlZmVycmVycG9saWN5fGVudW0gUmVmZXJyZXJQb2xpY3l9XG4gKi9cbmV4cG9ydCBjb25zdCBSZWZlcnJlclBvbGljeSA9IG5ldyBTZXQoW1xuXHQnJyxcblx0J25vLXJlZmVycmVyJyxcblx0J25vLXJlZmVycmVyLXdoZW4tZG93bmdyYWRlJyxcblx0J3NhbWUtb3JpZ2luJyxcblx0J29yaWdpbicsXG5cdCdzdHJpY3Qtb3JpZ2luJyxcblx0J29yaWdpbi13aGVuLWNyb3NzLW9yaWdpbicsXG5cdCdzdHJpY3Qtb3JpZ2luLXdoZW4tY3Jvc3Mtb3JpZ2luJyxcblx0J3Vuc2FmZS11cmwnXG5dKTtcblxuLyoqXG4gKiBAc2VlIHtAbGluayBodHRwczovL3czYy5naXRodWIuaW8vd2ViYXBwc2VjLXJlZmVycmVyLXBvbGljeS8jZGVmYXVsdC1yZWZlcnJlci1wb2xpY3l8ZGVmYXVsdCByZWZlcnJlciBwb2xpY3l9XG4gKi9cbmV4cG9ydCBjb25zdCBERUZBVUxUX1JFRkVSUkVSX1BPTElDWSA9ICdzdHJpY3Qtb3JpZ2luLXdoZW4tY3Jvc3Mtb3JpZ2luJztcblxuLyoqXG4gKiBAc2VlIHtAbGluayBodHRwczovL3czYy5naXRodWIuaW8vd2ViYXBwc2VjLXJlZmVycmVyLXBvbGljeS8jcmVmZXJyZXItcG9saWNpZXN8UmVmZXJyZXIgUG9saWN5IFx1MDBBNzMuIFJlZmVycmVyIFBvbGljaWVzfVxuICogQHBhcmFtIHtzdHJpbmd9IHJlZmVycmVyUG9saWN5XG4gKiBAcmV0dXJucyB7c3RyaW5nfSByZWZlcnJlclBvbGljeVxuICovXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVSZWZlcnJlclBvbGljeShyZWZlcnJlclBvbGljeSkge1xuXHRpZiAoIVJlZmVycmVyUG9saWN5LmhhcyhyZWZlcnJlclBvbGljeSkpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKGBJbnZhbGlkIHJlZmVycmVyUG9saWN5OiAke3JlZmVycmVyUG9saWN5fWApO1xuXHR9XG5cblx0cmV0dXJuIHJlZmVycmVyUG9saWN5O1xufVxuXG4vKipcbiAqIEBzZWUge0BsaW5rIGh0dHBzOi8vdzNjLmdpdGh1Yi5pby93ZWJhcHBzZWMtc2VjdXJlLWNvbnRleHRzLyNpcy1vcmlnaW4tdHJ1c3R3b3J0aHl8UmVmZXJyZXIgUG9saWN5IFx1MDBBNzMuMi4gSXMgb3JpZ2luIHBvdGVudGlhbGx5IHRydXN0d29ydGh5P31cbiAqIEBwYXJhbSB7ZXh0ZXJuYWw6VVJMfSB1cmxcbiAqIEByZXR1cm5zIGB0cnVlYDogXCJQb3RlbnRpYWxseSBUcnVzdHdvcnRoeVwiLCBgZmFsc2VgOiBcIk5vdCBUcnVzdHdvcnRoeVwiXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc09yaWdpblBvdGVudGlhbGx5VHJ1c3R3b3J0aHkodXJsKSB7XG5cdC8vIDEuIElmIG9yaWdpbiBpcyBhbiBvcGFxdWUgb3JpZ2luLCByZXR1cm4gXCJOb3QgVHJ1c3R3b3J0aHlcIi5cblx0Ly8gTm90IGFwcGxpY2FibGVcblxuXHQvLyAyLiBBc3NlcnQ6IG9yaWdpbiBpcyBhIHR1cGxlIG9yaWdpbi5cblx0Ly8gTm90IGZvciBpbXBsZW1lbnRhdGlvbnNcblxuXHQvLyAzLiBJZiBvcmlnaW4ncyBzY2hlbWUgaXMgZWl0aGVyIFwiaHR0cHNcIiBvciBcIndzc1wiLCByZXR1cm4gXCJQb3RlbnRpYWxseSBUcnVzdHdvcnRoeVwiLlxuXHRpZiAoL14oaHR0cHx3cylzOiQvLnRlc3QodXJsLnByb3RvY29sKSkge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0Ly8gNC4gSWYgb3JpZ2luJ3MgaG9zdCBjb21wb25lbnQgbWF0Y2hlcyBvbmUgb2YgdGhlIENJRFIgbm90YXRpb25zIDEyNy4wLjAuMC84IG9yIDo6MS8xMjggW1JGQzQ2MzJdLCByZXR1cm4gXCJQb3RlbnRpYWxseSBUcnVzdHdvcnRoeVwiLlxuXHRjb25zdCBob3N0SXAgPSB1cmwuaG9zdC5yZXBsYWNlKC8oXlxcWyl8KF0kKS9nLCAnJyk7XG5cdGNvbnN0IGhvc3RJUFZlcnNpb24gPSBpc0lQKGhvc3RJcCk7XG5cblx0aWYgKGhvc3RJUFZlcnNpb24gPT09IDQgJiYgL14xMjdcXC4vLnRlc3QoaG9zdElwKSkge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0aWYgKGhvc3RJUFZlcnNpb24gPT09IDYgJiYgL14oKCgwKzopezd9KXwoOjooMCs6KXswLDZ9KSkwKjEkLy50ZXN0KGhvc3RJcCkpIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdC8vIDUuIElmIG9yaWdpbidzIGhvc3QgY29tcG9uZW50IGlzIFwibG9jYWxob3N0XCIgb3IgZmFsbHMgd2l0aGluIFwiLmxvY2FsaG9zdFwiLCBhbmQgdGhlIHVzZXIgYWdlbnQgY29uZm9ybXMgdG8gdGhlIG5hbWUgcmVzb2x1dGlvbiBydWxlcyBpbiBbbGV0LWxvY2FsaG9zdC1iZS1sb2NhbGhvc3RdLCByZXR1cm4gXCJQb3RlbnRpYWxseSBUcnVzdHdvcnRoeVwiLlxuXHQvLyBXZSBhcmUgcmV0dXJuaW5nIEZBTFNFIGhlcmUgYmVjYXVzZSB3ZSBjYW5ub3QgZW5zdXJlIGNvbmZvcm1hbmNlIHRvXG5cdC8vIGxldC1sb2NhbGhvc3QtYmUtbG9hbGhvc3QgKGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9kcmFmdC13ZXN0LWxldC1sb2NhbGhvc3QtYmUtbG9jYWxob3N0KVxuXHRpZiAodXJsLmhvc3QgPT09ICdsb2NhbGhvc3QnIHx8IHVybC5ob3N0LmVuZHNXaXRoKCcubG9jYWxob3N0JykpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHQvLyA2LiBJZiBvcmlnaW4ncyBzY2hlbWUgY29tcG9uZW50IGlzIGZpbGUsIHJldHVybiBcIlBvdGVudGlhbGx5IFRydXN0d29ydGh5XCIuXG5cdGlmICh1cmwucHJvdG9jb2wgPT09ICdmaWxlOicpIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdC8vIDcuIElmIG9yaWdpbidzIHNjaGVtZSBjb21wb25lbnQgaXMgb25lIHdoaWNoIHRoZSB1c2VyIGFnZW50IGNvbnNpZGVycyB0byBiZSBhdXRoZW50aWNhdGVkLCByZXR1cm4gXCJQb3RlbnRpYWxseSBUcnVzdHdvcnRoeVwiLlxuXHQvLyBOb3Qgc3VwcG9ydGVkXG5cblx0Ly8gOC4gSWYgb3JpZ2luIGhhcyBiZWVuIGNvbmZpZ3VyZWQgYXMgYSB0cnVzdHdvcnRoeSBvcmlnaW4sIHJldHVybiBcIlBvdGVudGlhbGx5IFRydXN0d29ydGh5XCIuXG5cdC8vIE5vdCBzdXBwb3J0ZWRcblxuXHQvLyA5LiBSZXR1cm4gXCJOb3QgVHJ1c3R3b3J0aHlcIi5cblx0cmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIEBzZWUge0BsaW5rIGh0dHBzOi8vdzNjLmdpdGh1Yi5pby93ZWJhcHBzZWMtc2VjdXJlLWNvbnRleHRzLyNpcy11cmwtdHJ1c3R3b3J0aHl8UmVmZXJyZXIgUG9saWN5IFx1MDBBNzMuMy4gSXMgdXJsIHBvdGVudGlhbGx5IHRydXN0d29ydGh5P31cbiAqIEBwYXJhbSB7ZXh0ZXJuYWw6VVJMfSB1cmxcbiAqIEByZXR1cm5zIGB0cnVlYDogXCJQb3RlbnRpYWxseSBUcnVzdHdvcnRoeVwiLCBgZmFsc2VgOiBcIk5vdCBUcnVzdHdvcnRoeVwiXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1VybFBvdGVudGlhbGx5VHJ1c3R3b3J0aHkodXJsKSB7XG5cdC8vIDEuIElmIHVybCBpcyBcImFib3V0OmJsYW5rXCIgb3IgXCJhYm91dDpzcmNkb2NcIiwgcmV0dXJuIFwiUG90ZW50aWFsbHkgVHJ1c3R3b3J0aHlcIi5cblx0aWYgKC9eYWJvdXQ6KGJsYW5rfHNyY2RvYykkLy50ZXN0KHVybCkpIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdC8vIDIuIElmIHVybCdzIHNjaGVtZSBpcyBcImRhdGFcIiwgcmV0dXJuIFwiUG90ZW50aWFsbHkgVHJ1c3R3b3J0aHlcIi5cblx0aWYgKHVybC5wcm90b2NvbCA9PT0gJ2RhdGE6Jykge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0Ly8gTm90ZTogVGhlIG9yaWdpbiBvZiBibG9iOiBhbmQgZmlsZXN5c3RlbTogVVJMcyBpcyB0aGUgb3JpZ2luIG9mIHRoZSBjb250ZXh0IGluIHdoaWNoIHRoZXkgd2VyZVxuXHQvLyBjcmVhdGVkLiBUaGVyZWZvcmUsIGJsb2JzIGNyZWF0ZWQgaW4gYSB0cnVzdHdvcnRoeSBvcmlnaW4gd2lsbCB0aGVtc2VsdmVzIGJlIHBvdGVudGlhbGx5XG5cdC8vIHRydXN0d29ydGh5LlxuXHRpZiAoL14oYmxvYnxmaWxlc3lzdGVtKTokLy50ZXN0KHVybC5wcm90b2NvbCkpIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdC8vIDMuIFJldHVybiB0aGUgcmVzdWx0IG9mIGV4ZWN1dGluZyBcdTAwQTczLjIgSXMgb3JpZ2luIHBvdGVudGlhbGx5IHRydXN0d29ydGh5PyBvbiB1cmwncyBvcmlnaW4uXG5cdHJldHVybiBpc09yaWdpblBvdGVudGlhbGx5VHJ1c3R3b3J0aHkodXJsKTtcbn1cblxuLyoqXG4gKiBNb2RpZmllcyB0aGUgcmVmZXJyZXJVUkwgdG8gZW5mb3JjZSBhbnkgZXh0cmEgc2VjdXJpdHkgcG9saWN5IGNvbnNpZGVyYXRpb25zLlxuICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93M2MuZ2l0aHViLmlvL3dlYmFwcHNlYy1yZWZlcnJlci1wb2xpY3kvI2RldGVybWluZS1yZXF1ZXN0cy1yZWZlcnJlcnxSZWZlcnJlciBQb2xpY3kgXHUwMEE3OC4zLiBEZXRlcm1pbmUgcmVxdWVzdCdzIFJlZmVycmVyfSwgc3RlcCA3XG4gKiBAY2FsbGJhY2sgbW9kdWxlOnV0aWxzL3JlZmVycmVyfnJlZmVycmVyVVJMQ2FsbGJhY2tcbiAqIEBwYXJhbSB7ZXh0ZXJuYWw6VVJMfSByZWZlcnJlclVSTFxuICogQHJldHVybnMge2V4dGVybmFsOlVSTH0gbW9kaWZpZWQgcmVmZXJyZXJVUkxcbiAqL1xuXG4vKipcbiAqIE1vZGlmaWVzIHRoZSByZWZlcnJlck9yaWdpbiB0byBlbmZvcmNlIGFueSBleHRyYSBzZWN1cml0eSBwb2xpY3kgY29uc2lkZXJhdGlvbnMuXG4gKiBAc2VlIHtAbGluayBodHRwczovL3czYy5naXRodWIuaW8vd2ViYXBwc2VjLXJlZmVycmVyLXBvbGljeS8jZGV0ZXJtaW5lLXJlcXVlc3RzLXJlZmVycmVyfFJlZmVycmVyIFBvbGljeSBcdTAwQTc4LjMuIERldGVybWluZSByZXF1ZXN0J3MgUmVmZXJyZXJ9LCBzdGVwIDdcbiAqIEBjYWxsYmFjayBtb2R1bGU6dXRpbHMvcmVmZXJyZXJ+cmVmZXJyZXJPcmlnaW5DYWxsYmFja1xuICogQHBhcmFtIHtleHRlcm5hbDpVUkx9IHJlZmVycmVyT3JpZ2luXG4gKiBAcmV0dXJucyB7ZXh0ZXJuYWw6VVJMfSBtb2RpZmllZCByZWZlcnJlck9yaWdpblxuICovXG5cbi8qKlxuICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93M2MuZ2l0aHViLmlvL3dlYmFwcHNlYy1yZWZlcnJlci1wb2xpY3kvI2RldGVybWluZS1yZXF1ZXN0cy1yZWZlcnJlcnxSZWZlcnJlciBQb2xpY3kgXHUwMEE3OC4zLiBEZXRlcm1pbmUgcmVxdWVzdCdzIFJlZmVycmVyfVxuICogQHBhcmFtIHtSZXF1ZXN0fSByZXF1ZXN0XG4gKiBAcGFyYW0ge29iamVjdH0gb1xuICogQHBhcmFtIHttb2R1bGU6dXRpbHMvcmVmZXJyZXJ+cmVmZXJyZXJVUkxDYWxsYmFja30gby5yZWZlcnJlclVSTENhbGxiYWNrXG4gKiBAcGFyYW0ge21vZHVsZTp1dGlscy9yZWZlcnJlcn5yZWZlcnJlck9yaWdpbkNhbGxiYWNrfSBvLnJlZmVycmVyT3JpZ2luQ2FsbGJhY2tcbiAqIEByZXR1cm5zIHtleHRlcm5hbDpVUkx9IFJlcXVlc3QncyByZWZlcnJlclxuICovXG5leHBvcnQgZnVuY3Rpb24gZGV0ZXJtaW5lUmVxdWVzdHNSZWZlcnJlcihyZXF1ZXN0LCB7cmVmZXJyZXJVUkxDYWxsYmFjaywgcmVmZXJyZXJPcmlnaW5DYWxsYmFja30gPSB7fSkge1xuXHQvLyBUaGVyZSBhcmUgMiBub3RlcyBpbiB0aGUgc3BlY2lmaWNhdGlvbiBhYm91dCBpbnZhbGlkIHByZS1jb25kaXRpb25zLiAgV2UgcmV0dXJuIG51bGwsIGhlcmUsIGZvclxuXHQvLyB0aGVzZSBjYXNlczpcblx0Ly8gPiBOb3RlOiBJZiByZXF1ZXN0J3MgcmVmZXJyZXIgaXMgXCJuby1yZWZlcnJlclwiLCBGZXRjaCB3aWxsIG5vdCBjYWxsIGludG8gdGhpcyBhbGdvcml0aG0uXG5cdC8vID4gTm90ZTogSWYgcmVxdWVzdCdzIHJlZmVycmVyIHBvbGljeSBpcyB0aGUgZW1wdHkgc3RyaW5nLCBGZXRjaCB3aWxsIG5vdCBjYWxsIGludG8gdGhpc1xuXHQvLyA+IGFsZ29yaXRobS5cblx0aWYgKHJlcXVlc3QucmVmZXJyZXIgPT09ICduby1yZWZlcnJlcicgfHwgcmVxdWVzdC5yZWZlcnJlclBvbGljeSA9PT0gJycpIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdC8vIDEuIExldCBwb2xpY3kgYmUgcmVxdWVzdCdzIGFzc29jaWF0ZWQgcmVmZXJyZXIgcG9saWN5LlxuXHRjb25zdCBwb2xpY3kgPSByZXF1ZXN0LnJlZmVycmVyUG9saWN5O1xuXG5cdC8vIDIuIExldCBlbnZpcm9ubWVudCBiZSByZXF1ZXN0J3MgY2xpZW50LlxuXHQvLyBub3QgYXBwbGljYWJsZSB0byBub2RlLmpzXG5cblx0Ly8gMy4gU3dpdGNoIG9uIHJlcXVlc3QncyByZWZlcnJlcjpcblx0aWYgKHJlcXVlc3QucmVmZXJyZXIgPT09ICdhYm91dDpjbGllbnQnKSB7XG5cdFx0cmV0dXJuICduby1yZWZlcnJlcic7XG5cdH1cblxuXHQvLyBcImEgVVJMXCI6IExldCByZWZlcnJlclNvdXJjZSBiZSByZXF1ZXN0J3MgcmVmZXJyZXIuXG5cdGNvbnN0IHJlZmVycmVyU291cmNlID0gcmVxdWVzdC5yZWZlcnJlcjtcblxuXHQvLyA0LiBMZXQgcmVxdWVzdCdzIHJlZmVycmVyVVJMIGJlIHRoZSByZXN1bHQgb2Ygc3RyaXBwaW5nIHJlZmVycmVyU291cmNlIGZvciB1c2UgYXMgYSByZWZlcnJlci5cblx0bGV0IHJlZmVycmVyVVJMID0gc3RyaXBVUkxGb3JVc2VBc0FSZWZlcnJlcihyZWZlcnJlclNvdXJjZSk7XG5cblx0Ly8gNS4gTGV0IHJlZmVycmVyT3JpZ2luIGJlIHRoZSByZXN1bHQgb2Ygc3RyaXBwaW5nIHJlZmVycmVyU291cmNlIGZvciB1c2UgYXMgYSByZWZlcnJlciwgd2l0aCB0aGVcblx0Ly8gICAgb3JpZ2luLW9ubHkgZmxhZyBzZXQgdG8gdHJ1ZS5cblx0bGV0IHJlZmVycmVyT3JpZ2luID0gc3RyaXBVUkxGb3JVc2VBc0FSZWZlcnJlcihyZWZlcnJlclNvdXJjZSwgdHJ1ZSk7XG5cblx0Ly8gNi4gSWYgdGhlIHJlc3VsdCBvZiBzZXJpYWxpemluZyByZWZlcnJlclVSTCBpcyBhIHN0cmluZyB3aG9zZSBsZW5ndGggaXMgZ3JlYXRlciB0aGFuIDQwOTYsIHNldFxuXHQvLyAgICByZWZlcnJlclVSTCB0byByZWZlcnJlck9yaWdpbi5cblx0aWYgKHJlZmVycmVyVVJMLnRvU3RyaW5nKCkubGVuZ3RoID4gNDA5Nikge1xuXHRcdHJlZmVycmVyVVJMID0gcmVmZXJyZXJPcmlnaW47XG5cdH1cblxuXHQvLyA3LiBUaGUgdXNlciBhZ2VudCBNQVkgYWx0ZXIgcmVmZXJyZXJVUkwgb3IgcmVmZXJyZXJPcmlnaW4gYXQgdGhpcyBwb2ludCB0byBlbmZvcmNlIGFyYml0cmFyeVxuXHQvLyAgICBwb2xpY3kgY29uc2lkZXJhdGlvbnMgaW4gdGhlIGludGVyZXN0cyBvZiBtaW5pbWl6aW5nIGRhdGEgbGVha2FnZS4gRm9yIGV4YW1wbGUsIHRoZSB1c2VyXG5cdC8vICAgIGFnZW50IGNvdWxkIHN0cmlwIHRoZSBVUkwgZG93biB0byBhbiBvcmlnaW4sIG1vZGlmeSBpdHMgaG9zdCwgcmVwbGFjZSBpdCB3aXRoIGFuIGVtcHR5XG5cdC8vICAgIHN0cmluZywgZXRjLlxuXHRpZiAocmVmZXJyZXJVUkxDYWxsYmFjaykge1xuXHRcdHJlZmVycmVyVVJMID0gcmVmZXJyZXJVUkxDYWxsYmFjayhyZWZlcnJlclVSTCk7XG5cdH1cblxuXHRpZiAocmVmZXJyZXJPcmlnaW5DYWxsYmFjaykge1xuXHRcdHJlZmVycmVyT3JpZ2luID0gcmVmZXJyZXJPcmlnaW5DYWxsYmFjayhyZWZlcnJlck9yaWdpbik7XG5cdH1cblxuXHQvLyA4LkV4ZWN1dGUgdGhlIHN0YXRlbWVudHMgY29ycmVzcG9uZGluZyB0byB0aGUgdmFsdWUgb2YgcG9saWN5OlxuXHRjb25zdCBjdXJyZW50VVJMID0gbmV3IFVSTChyZXF1ZXN0LnVybCk7XG5cblx0c3dpdGNoIChwb2xpY3kpIHtcblx0XHRjYXNlICduby1yZWZlcnJlcic6XG5cdFx0XHRyZXR1cm4gJ25vLXJlZmVycmVyJztcblxuXHRcdGNhc2UgJ29yaWdpbic6XG5cdFx0XHRyZXR1cm4gcmVmZXJyZXJPcmlnaW47XG5cblx0XHRjYXNlICd1bnNhZmUtdXJsJzpcblx0XHRcdHJldHVybiByZWZlcnJlclVSTDtcblxuXHRcdGNhc2UgJ3N0cmljdC1vcmlnaW4nOlxuXHRcdFx0Ly8gMS4gSWYgcmVmZXJyZXJVUkwgaXMgYSBwb3RlbnRpYWxseSB0cnVzdHdvcnRoeSBVUkwgYW5kIHJlcXVlc3QncyBjdXJyZW50IFVSTCBpcyBub3QgYVxuXHRcdFx0Ly8gICAgcG90ZW50aWFsbHkgdHJ1c3R3b3J0aHkgVVJMLCB0aGVuIHJldHVybiBubyByZWZlcnJlci5cblx0XHRcdGlmIChpc1VybFBvdGVudGlhbGx5VHJ1c3R3b3J0aHkocmVmZXJyZXJVUkwpICYmICFpc1VybFBvdGVudGlhbGx5VHJ1c3R3b3J0aHkoY3VycmVudFVSTCkpIHtcblx0XHRcdFx0cmV0dXJuICduby1yZWZlcnJlcic7XG5cdFx0XHR9XG5cblx0XHRcdC8vIDIuIFJldHVybiByZWZlcnJlck9yaWdpbi5cblx0XHRcdHJldHVybiByZWZlcnJlck9yaWdpbi50b1N0cmluZygpO1xuXG5cdFx0Y2FzZSAnc3RyaWN0LW9yaWdpbi13aGVuLWNyb3NzLW9yaWdpbic6XG5cdFx0XHQvLyAxLiBJZiB0aGUgb3JpZ2luIG9mIHJlZmVycmVyVVJMIGFuZCB0aGUgb3JpZ2luIG9mIHJlcXVlc3QncyBjdXJyZW50IFVSTCBhcmUgdGhlIHNhbWUsIHRoZW5cblx0XHRcdC8vICAgIHJldHVybiByZWZlcnJlclVSTC5cblx0XHRcdGlmIChyZWZlcnJlclVSTC5vcmlnaW4gPT09IGN1cnJlbnRVUkwub3JpZ2luKSB7XG5cdFx0XHRcdHJldHVybiByZWZlcnJlclVSTDtcblx0XHRcdH1cblxuXHRcdFx0Ly8gMi4gSWYgcmVmZXJyZXJVUkwgaXMgYSBwb3RlbnRpYWxseSB0cnVzdHdvcnRoeSBVUkwgYW5kIHJlcXVlc3QncyBjdXJyZW50IFVSTCBpcyBub3QgYVxuXHRcdFx0Ly8gICAgcG90ZW50aWFsbHkgdHJ1c3R3b3J0aHkgVVJMLCB0aGVuIHJldHVybiBubyByZWZlcnJlci5cblx0XHRcdGlmIChpc1VybFBvdGVudGlhbGx5VHJ1c3R3b3J0aHkocmVmZXJyZXJVUkwpICYmICFpc1VybFBvdGVudGlhbGx5VHJ1c3R3b3J0aHkoY3VycmVudFVSTCkpIHtcblx0XHRcdFx0cmV0dXJuICduby1yZWZlcnJlcic7XG5cdFx0XHR9XG5cblx0XHRcdC8vIDMuIFJldHVybiByZWZlcnJlck9yaWdpbi5cblx0XHRcdHJldHVybiByZWZlcnJlck9yaWdpbjtcblxuXHRcdGNhc2UgJ3NhbWUtb3JpZ2luJzpcblx0XHRcdC8vIDEuIElmIHRoZSBvcmlnaW4gb2YgcmVmZXJyZXJVUkwgYW5kIHRoZSBvcmlnaW4gb2YgcmVxdWVzdCdzIGN1cnJlbnQgVVJMIGFyZSB0aGUgc2FtZSwgdGhlblxuXHRcdFx0Ly8gICAgcmV0dXJuIHJlZmVycmVyVVJMLlxuXHRcdFx0aWYgKHJlZmVycmVyVVJMLm9yaWdpbiA9PT0gY3VycmVudFVSTC5vcmlnaW4pIHtcblx0XHRcdFx0cmV0dXJuIHJlZmVycmVyVVJMO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyAyLiBSZXR1cm4gbm8gcmVmZXJyZXIuXG5cdFx0XHRyZXR1cm4gJ25vLXJlZmVycmVyJztcblxuXHRcdGNhc2UgJ29yaWdpbi13aGVuLWNyb3NzLW9yaWdpbic6XG5cdFx0XHQvLyAxLiBJZiB0aGUgb3JpZ2luIG9mIHJlZmVycmVyVVJMIGFuZCB0aGUgb3JpZ2luIG9mIHJlcXVlc3QncyBjdXJyZW50IFVSTCBhcmUgdGhlIHNhbWUsIHRoZW5cblx0XHRcdC8vICAgIHJldHVybiByZWZlcnJlclVSTC5cblx0XHRcdGlmIChyZWZlcnJlclVSTC5vcmlnaW4gPT09IGN1cnJlbnRVUkwub3JpZ2luKSB7XG5cdFx0XHRcdHJldHVybiByZWZlcnJlclVSTDtcblx0XHRcdH1cblxuXHRcdFx0Ly8gUmV0dXJuIHJlZmVycmVyT3JpZ2luLlxuXHRcdFx0cmV0dXJuIHJlZmVycmVyT3JpZ2luO1xuXG5cdFx0Y2FzZSAnbm8tcmVmZXJyZXItd2hlbi1kb3duZ3JhZGUnOlxuXHRcdFx0Ly8gMS4gSWYgcmVmZXJyZXJVUkwgaXMgYSBwb3RlbnRpYWxseSB0cnVzdHdvcnRoeSBVUkwgYW5kIHJlcXVlc3QncyBjdXJyZW50IFVSTCBpcyBub3QgYVxuXHRcdFx0Ly8gICAgcG90ZW50aWFsbHkgdHJ1c3R3b3J0aHkgVVJMLCB0aGVuIHJldHVybiBubyByZWZlcnJlci5cblx0XHRcdGlmIChpc1VybFBvdGVudGlhbGx5VHJ1c3R3b3J0aHkocmVmZXJyZXJVUkwpICYmICFpc1VybFBvdGVudGlhbGx5VHJ1c3R3b3J0aHkoY3VycmVudFVSTCkpIHtcblx0XHRcdFx0cmV0dXJuICduby1yZWZlcnJlcic7XG5cdFx0XHR9XG5cblx0XHRcdC8vIDIuIFJldHVybiByZWZlcnJlclVSTC5cblx0XHRcdHJldHVybiByZWZlcnJlclVSTDtcblxuXHRcdGRlZmF1bHQ6XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKGBJbnZhbGlkIHJlZmVycmVyUG9saWN5OiAke3BvbGljeX1gKTtcblx0fVxufVxuXG4vKipcbiAqIEBzZWUge0BsaW5rIGh0dHBzOi8vdzNjLmdpdGh1Yi5pby93ZWJhcHBzZWMtcmVmZXJyZXItcG9saWN5LyNwYXJzZS1yZWZlcnJlci1wb2xpY3ktZnJvbS1oZWFkZXJ8UmVmZXJyZXIgUG9saWN5IFx1MDBBNzguMS4gUGFyc2UgYSByZWZlcnJlciBwb2xpY3kgZnJvbSBhIFJlZmVycmVyLVBvbGljeSBoZWFkZXJ9XG4gKiBAcGFyYW0ge0hlYWRlcnN9IGhlYWRlcnMgUmVzcG9uc2UgaGVhZGVyc1xuICogQHJldHVybnMge3N0cmluZ30gcG9saWN5XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVJlZmVycmVyUG9saWN5RnJvbUhlYWRlcihoZWFkZXJzKSB7XG5cdC8vIDEuIExldCBwb2xpY3ktdG9rZW5zIGJlIHRoZSByZXN1bHQgb2YgZXh0cmFjdGluZyBoZWFkZXIgbGlzdCB2YWx1ZXMgZ2l2ZW4gYFJlZmVycmVyLVBvbGljeWBcblx0Ly8gICAgYW5kIHJlc3BvbnNlXHUyMDE5cyBoZWFkZXIgbGlzdC5cblx0Y29uc3QgcG9saWN5VG9rZW5zID0gKGhlYWRlcnMuZ2V0KCdyZWZlcnJlci1wb2xpY3knKSB8fCAnJykuc3BsaXQoL1ssXFxzXSsvKTtcblxuXHQvLyAyLiBMZXQgcG9saWN5IGJlIHRoZSBlbXB0eSBzdHJpbmcuXG5cdGxldCBwb2xpY3kgPSAnJztcblxuXHQvLyAzLiBGb3IgZWFjaCB0b2tlbiBpbiBwb2xpY3ktdG9rZW5zLCBpZiB0b2tlbiBpcyBhIHJlZmVycmVyIHBvbGljeSBhbmQgdG9rZW4gaXMgbm90IHRoZSBlbXB0eVxuXHQvLyAgICBzdHJpbmcsIHRoZW4gc2V0IHBvbGljeSB0byB0b2tlbi5cblx0Ly8gTm90ZTogVGhpcyBhbGdvcml0aG0gbG9vcHMgb3ZlciBtdWx0aXBsZSBwb2xpY3kgdmFsdWVzIHRvIGFsbG93IGRlcGxveW1lbnQgb2YgbmV3IHBvbGljeVxuXHQvLyB2YWx1ZXMgd2l0aCBmYWxsYmFja3MgZm9yIG9sZGVyIHVzZXIgYWdlbnRzLCBhcyBkZXNjcmliZWQgaW4gXHUwMEE3IDExLjEgVW5rbm93biBQb2xpY3kgVmFsdWVzLlxuXHRmb3IgKGNvbnN0IHRva2VuIG9mIHBvbGljeVRva2Vucykge1xuXHRcdGlmICh0b2tlbiAmJiBSZWZlcnJlclBvbGljeS5oYXModG9rZW4pKSB7XG5cdFx0XHRwb2xpY3kgPSB0b2tlbjtcblx0XHR9XG5cdH1cblxuXHQvLyA0LiBSZXR1cm4gcG9saWN5LlxuXHRyZXR1cm4gcG9saWN5O1xufVxuIiwgImltcG9ydCB7RmV0Y2hCYXNlRXJyb3J9IGZyb20gJy4vYmFzZS5qcyc7XG5cbi8qKlxuICogQWJvcnRFcnJvciBpbnRlcmZhY2UgZm9yIGNhbmNlbGxlZCByZXF1ZXN0c1xuICovXG5leHBvcnQgY2xhc3MgQWJvcnRFcnJvciBleHRlbmRzIEZldGNoQmFzZUVycm9yIHtcblx0Y29uc3RydWN0b3IobWVzc2FnZSwgdHlwZSA9ICdhYm9ydGVkJykge1xuXHRcdHN1cGVyKG1lc3NhZ2UsIHR5cGUpO1xuXHR9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7ZUFBZ0JBLFFBQUk7QUFDbEIsZUFBTztNQUNUO0FDQ00sZUFBVSxhQUFhQyxJQUFNO0FBQ2pDLGVBQVEsT0FBT0EsT0FBTSxZQUFZQSxPQUFNLFFBQVMsT0FBT0EsT0FBTTtNQUMvRDtBQUVPLFlBQU0saUNBVVBEO0FBRVUsZUFBQSxnQkFBZ0IsSUFBYyxNQUFZO0FBQ3hELFlBQUk7QUFDRixpQkFBTyxlQUFlLElBQUksUUFBUTtZQUNoQyxPQUFPO1lBQ1AsY0FBYztVQUNmLENBQUE7aUJBQ0RFLEtBQU07O01BSVY7QUMxQkEsWUFBTSxrQkFBa0I7QUFDeEIsWUFBTSxzQkFBc0IsUUFBUSxVQUFVO0FBQzlDLFlB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VUFBVSxNQUFNLFFBQVEsS0FBSyxRQUFRLElBQUksS0FBSyxTQUFTLEtBQUssSUFBSSxJQUFJLEtBQUs7QUFBQSxZQUN6RSxNQUFNLEVBQUUsUUFBUSxRQUFRLE1BQU0saUJBQU0sS0FBSyxZQUFZO0FBQUEsWUFDckQsU0FBUyxjQUFjLE1BQU0sTUFBTTtBQUFBLFlBQ25DLFdBQVcsRUFBRSxNQUFNLFFBQVEsT0FBTyxLQUFLLE1BQU07QUFBQSxZQUM3QyxRQUFRLDRDQUFDLGdCQUFLLEtBQUssUUFBVixFQUFpQixVQUFVLGdCQUFnQjtBQUFBO0FBQUEsVUFOL0MsS0FBSztBQUFBLFFBT1o7QUFBQSxNQUVKLENBQUMsS0ExQnNDLFFBQVEsS0EyQmpELENBQ0Q7QUFBQTtBQUFBLEVBQ0g7QUFFSjsiLAogICJuYW1lcyI6IFsibm9vcCIsICJ4IiwgIl9hIiwgIkYiLCAiaSIsICJlIiwgInF1ZXVlTWljcm90YXNrIiwgInIiLCAiaXNBYm9ydFNpZ25hbCIsICJzdHJlYW1CcmFuZENoZWNrRXhjZXB0aW9uIiwgImRlZmF1bHRDb250cm9sbGVyQnJhbmRDaGVja0V4Y2VwdGlvbiIsICJET01FeGNlcHRpb24iLCAiUmVhZGFibGVTdHJlYW0iLCAiUE9PTF9TSVpFIiwgInByb2Nlc3MiLCAiQmxvYiIsICJjbG9uZSIsICJCbG9iIiwgInNpemUiLCAiRmlsZSIsICJGIiwgImYiLCAiZSIsICJGb3JtRGF0YSIsICJtIiwgImV4cG9ydHMiLCAibW9kdWxlIiwgImZzIiwgIm0iLCAiQm9keSIsICJmIiwgImkiLCAiY2xlYXIiLCAiaW1wb3J0X25vZGVfaHR0cCIsICJpbXBvcnRfbm9kZV9zdHJlYW0iLCAiaW1wb3J0X25vZGVfYnVmZmVyIiwgImkiLCAiU3RyZWFtIiwgInRvRm9ybURhdGEiLCAiaW1wb3J0X25vZGVfdXRpbCIsICJodHRwIiwgIklOVEVSTkFMUyIsICJpbXBvcnRfbm9kZV91dGlsIiwgIklOVEVSTkFMUyIsICJmb3JtYXRVcmwiLCAicmVzcG9uc2UiLCAiaHR0cHMiLCAiaHR0cCIsICJTdHJlYW0iLCAicyIsICJwdW1wIiwgInpsaWIiLCAiZSJdCn0K
