"use strict";
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
var ex8_3_4 = function () {
    var sleep = function (duration) {
        return new Promise(function (resolve, reject) {
            setTimeout(resolve, duration);
        });
    };
    sleep(1000).then(function () { return console.log("1s経過しました"); });
};
ex8_3_4();
// Promiseのstatic method
// 全部成功した場合にPromise.allのthenが実行される。
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
