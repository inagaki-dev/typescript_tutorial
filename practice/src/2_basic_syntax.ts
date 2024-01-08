
// ====== variable ======
// --- const, let ---
const greeting = "Hello World";
let target = "World";


// ====== primitive ======
// --- number ---
const height: number = 6;

const binary: number = 0b1001;
const octal: number = 0o1001;
const hex: number = 0x1001;

const big: number = 1e8;
const small: number = 1e-8;

const million: number = 1_000_000;

const bignum: bigint = (123n + 456n) * 789n;

// --- string ---
const str1: string = "Hello";
const str2: string = 'World!!';
// template literal
console.log(`${str1}, ${str2}`);

// --- boolean ---
const yse: boolean = true;
const no: boolean = false;

// booleanへのキャスト
console.log(Boolean(123)) // true
console.log(Boolean(0)) // false
console.log(Boolean(NaN)) // false

console.log(Boolean("hello")) // true
console.log(Boolean("")) // false

console.log(Boolean(null)) // false
console.log(Boolean(undefined)) // false

// NOTE: objectはすべてtrueになる



// --- null, undefined ---
// 基本的にはundefinedを使う方がいいらしい
const nullValue: null = null;
const undefinedValue: undefined = undefined;

// ====== Operators ======

let foo: number = 10;
console.log(++foo); // 変動後の値11を返す
console.log(foo++); // 変動前の値11を返す
// ただし上記のようなincrement/decrementの返り値を使うのはややこしいので下記のように使うのが多い
foo++;


const left: number = 10;
const right: number = 2;
console.log(left === right); // false
console.log(left !== right); // true

// ==は以下のようなnullとundefinedを識別したいときだけ使ってもよい。
if (left == null) {
    console.log("left is null or undefined");
}

// NaNの判定
if (Number.isNaN(left)) {
    console.log("left is NaN");
}
if (!Number.isNaN(left)) {
    console.log("left is not NaN");
}

const t = true;
const f = false;
console.log(t && f); // false
console.log(t || f); // true

// !!はBoolean()と等価
const hello = "Hello";
console.log(!!hello); // true

// +のキャスト的な使い方
const str = "123";
const num_from_str = +str;  // Number(str)と等価

// &&, ||はboolean以外にも適用できる。
// &&は左辺をbooleanに変換した時にtrueなら右辺を返す。||は左辺がfalseなら右辺を返す。
const aaa: string = "aaa";
const bbb: undefined = undefined;
const ccc: string = "ccc"
console.log(aaa && bbb);  // undefined
console.log(ccc && aaa);  // aaa

// ||はデフォルト値の設定に使える
let name1: string = "Taro";
const name2: string = "";
console.log(name1 || "名無しさん");  // Taro
console.log(name2 || "名無しさん");  // 名無しさん

// 論理代入
name1 ||= name2;  // name1 || (name1 = name2)と等価。name1 = name1 || name2とは微妙に違うので注意。


// 空文字や0は正常に扱い、null, undefinedだけデフォルト値で返したいときは??を使う
const name3: string = "Taro";
const name4: number = 0;
const name5: null = null;
console.log(name3 ?? "名無しさん");  // Taro
console.log(name4 ?? "名無しさん");  // 0
console.log(name5 ?? "名無しさん");  // 名無しさん

// 条件 operator
const num_m: number = 90;
const message: string = 0 <= num_m && num_m <= 100 ? "OK" : "NG";


// bit operator
console.log(0b0101 & 0b1100);  // 0b0100
console.log(0b0101 | 0b1100);  // 0b1101
console.log(~0b0101); // 0b1010


// ====== 制御構文 ======

// if
const userName: string = "";
if (userName === "") {
    console.log("名前が空です");
} else if (userName === "Taro") {
    console.log(`こんにちは、Taroさん`);
} else {
    console.log(`こんにちは、${userName}さん`);
}


// switch
// breakを忘れないように注意
const num: number = 1;
switch (num) {
    case 1:
        console.log("1です");
        break;
    case 2:
        console.log("2です");
        break;
    default:
        console.log("1でも2でもありません");
}


// while
let i: number = 0;
while (true) {
    console.log(i);
    if (i < 5) {
        continue;
    }
    if (i === 10) {
        break;
    }
}

// for
for (let i = 0; i < 10; i++) {
    console.log(i);
}

