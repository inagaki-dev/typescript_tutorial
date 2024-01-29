"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var promises_1 = require("fs/promises");
// もっとも基礎的な非同期処理
// 非同期の関数の引数にコールバック関数を渡す
// NOTE: 非同期の関数の引数、返り値はその関数ごとに異なるので毎回調べに行く必要あり。
var ex8_2_3 = function () {
    setTimeout(function () {
        console.log("run");
    }, 3000);
};
ex8_2_3();
// Promiseを使った書き方 (チェーンは使用せず版)
var ex8_3_2 = function () {
    var p = (0, promises_1.readFile)("foo.txt", "utf8");
    p.then(function (result) {
        console.log(result);
    }, function (error) {
        console.log(error);
    });
};
ex8_3_2();
// 自作版Promise
// Promise版ではないsetTimeoutをPromise版に変換している。
// (resolve, reject) => {} はexecutorと呼ばれる。
// NOTE: 今回のケースだと絶対失敗しないのでrejectは使っていない。
// また、同様の理由でsleep().catchも設定しなくてもエラーにならない。
var sleep = function (duration) {
    return new Promise(function (resolve, reject) {
        setTimeout(resolve, duration);
    });
};
var ex8_3_4 = function () {
    sleep(1000).then(function () { return console.log("1s経過しました"); });
};
ex8_3_4();
// Promiseのstatic method
// 全部成功した場合にPromise.allのthenが実行される。
// NOTE: 他にもPromise.raceなどがある。Promise.raceのコード例は下のほうにある。
var ex8_3_6 = function () {
    var p = Promise.all([
        (0, promises_1.readFile)("foo.txt", "utf8"),
        (0, promises_1.readFile)("foo.txt", "utf8"),
        (0, promises_1.readFile)("foo.txt", "utf8"),
    ]);
    p.then(function (_a) {
        var foo = _a[0], bar = _a[1], baz = _a[2];
        return console.log(foo, bar, baz);
    });
};
ex8_3_6();
// Promise Chain
// finallyは絶対実行する、catchは失敗の場合のみコールバックが実行される。
// 成功のときはcatchは素通りする、というのが理解の上での最大のポイント。
// NOTE: 特に理由がなければこのチェーンの形で書くのが良いとのこと。
var ex8_3_8 = function () {
    (0, promises_1.readFile)("foo.txt", "utf8")
        .finally(function () { return console.log("finally!!"); })
        .catch(function () { return "catch!!"; })
        .then(function (result) { return console.log(result); });
};
ex8_3_8();
// 非同期処理を順番に実行する
var ex8_3_9 = function () {
    var repeat10 = function (str) {
        return new Promise(function (resolve) {
            setTimeout(function () { return resolve(str.repeat(10)); }, 1000);
        });
    };
    // ファイル読み込みが解決すると、別の非同期処理のrepeat10が実行される。
    (0, promises_1.readFile)("foo.txt", "utf8")
        .then(function (result) { return repeat10(result); })
        .then(function (result) {
        console.log(result);
    });
};
ex8_3_9();
// 成功したPromiseを失敗に変換させる
// NOTE: Promiseのエラーハンドリングの処理は必須。無いとUnhandledPromiseRejectionエラーが発生。
var ex8_3_10 = function () {
    console.log("ex8_3_10");
    var p1 = (0, promises_1.readFile)("foo.txt", "utf8")
        .then(function (result) {
        throw new Error("エラーが発生しました");
    })
        .then(function (result) {
        console.log("ここは実行されません");
    })
        .catch(function (error) {
        console.log(error.message);
    });
};
ex8_3_10();
// --- dynamic import ---
Promise.resolve().then(function () { return require("fs/promises"); }).then(function (_a) {
    var readFile = _a.readFile;
    return readFile("foo.txt", "utf8");
})
    .then(function (result) {
    console.log(result);
})
    .catch(function (error) {
    console.log("エラー発生！", error);
});
// --- async/await ---
// 宣言の仕方
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, 0];
        });
    });
}
// function expression
var func2 = function () {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, 0];
        });
    });
};
// arrow function
var func3 = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, 0];
    });
}); };
// 使用例
var ex8_4_2 = function () {
    function get3() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("get3: start");
                        return [4 /*yield*/, sleep(3000)];
                    case 1:
                        _a.sent();
                        console.log("get3: end");
                        return [2 /*return*/, 3];
                }
            });
        });
    }
    console.log("get3を呼び出します");
    var p = get3().then(function (num) {
        console.log("num is ".concat(num));
    });
    console.log("get3を呼び出しました");
};
ex8_4_2();
// 次の順番で表示される
// get3を呼び出します
// get3: start
// get3を呼び出しました
// get3: end
// num is 3
// awaitのエラーハンドリング
// awaitは同期処理と同様にtry-catchでエラーハンドリングできる。
// 下の例だとawaitにcatchが書かれているので、awaitのPromiseは必ず解決する。
// そのため、mainの返り値のPromiseのcatchは不要となる。
// NOTE: 逆に、awaitにcatchが無い場合はmainの方でcatchを書かないとエラー。
var ex8_4_4 = function () {
    function main() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, readFile, writeFile, fooContext, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("fs/promises"); })];
                    case 1:
                        _a = _c.sent(), readFile = _a.readFile, writeFile = _a.writeFile;
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, readFile("foo.txt", "utf8")];
                    case 3:
                        fooContext = _c.sent();
                        return [4 /*yield*/, writeFile("bar.txt", fooContext + fooContext)];
                    case 4:
                        _c.sent();
                        console.log("ファイルのコピーが完了しました");
                        return [3 /*break*/, 6];
                    case 5:
                        _b = _c.sent();
                        console.log("エラーが発生しました");
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
    main().then(function () {
        console.log("main関数が完了しました");
    });
};
// --- タイムアウト処理の実装 ---
var path_1 = require("path");
var url_1 = require("url");
var errorAfter1ms = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, sleep(1)];
            case 1:
                _a.sent();
                throw new Error("Time out!");
        }
    });
}); };
var filePath = (0, url_1.fileURLToPath)(import.meta.url);
var fileDir = path_1.default.dirname(filePath);
var dataFile = path_1.default.join(fileDir, "foo.txt");
// top level awaitとPromise.raceの併用
// NOTE: top level awaitの失敗はランタイムエラーと同じ扱いになるためエラーハンドリングが必要。
var data = await Promise.race([
    (0, promises_1.readFile)(dataFile, "utf8"),
    errorAfter1ms(),
]).catch(function () {
    console.log("エラー発生");
    // プロセスを終了させる処理
    process.exit(1);
});
