const input: string = "太郎";
const name_sh: string = input ? input : "名無し";

// object literal
// object literalという名前はよく出てくるので覚えること。
const user = {
  name_sh, // shorthand property
  age: 20,
};

// スプレッド構文(spread syntax)
const obj1 = {
  bar: 456,
  baz: "abc",
};

const obj2 = {
  foo: 123,
  ...obj1, // spread syntax
};

// spread syntaxは第一階層のみdeep copyである。
// NOTE: ネストされたobjectはdeep copyされない（つまりshallow copy）なので注意。
const foo_obj = { num: 1234 };
const bar_obj = { ...foo_obj }; // deep copy

// スプレッド構文を使った後に、既存のproperty名を指定すると上書きできる
const obj_or = { a: 1, b: 2, c: 3 };
const obj_or2 = { ...obj_or, b: 100 };
console.log(obj_or2); // { a: 1, b: 100, c: 3 }

// FooBarObjという型を作っているのではなく、既存のobjectにFooBarObjという名前をつけているだけ。
type FooBarObj = {
  foo: number;
  readonly bar: string; // readonly property
  baz?: number; // optional property
};

const obj: FooBarObj = {
  foo: 123,
  bar: "aaa",
};

// readonlyのためエラー
// obj.bar = "bbb";

// typeは名前をつけているだけなのでこんな意味ないこともできる。
type UserId = string;
type MyFooObj = FooBarObj;

// index signature
// ただし、型安全性が破壊されるのであまり使わないほうがいい。代わりにMap objectを使うのが良い。
type PriceData = {
  [key: string]: number;
};
const data: PriceData = {
  apple: 100,
  orange: 150,
  banana: 200,
};
// これもOKになる
data.peach = 300;

// typeof
// ただしこれも型推論という確定していない情報を扱うため乱用しないほうがいい。
const obj_tof = {
  foo: 123,
  bar: "hi",
};
type T = typeof obj_tof; // ランタイムにより型推論されたobj_tofの型が代入される

// ====== 部分型関係(sub-typing relation) ======

type FooBar = {
  foo: string;
  bar: number;
};
type FooBarBaz = {
  foo: string;
  bar: number;
  baz: boolean;
};

const obj_subtr: FooBarBaz = {
  foo: "aaa",
  bar: 123,
  baz: true,
};
// FooBarBazはFooBarの部分型であるため代入可能
// ただし余剰分のbazが消えるわけではないので注意！！！
const obj_subtr2: FooBar = obj_subtr;
// FooBarはbaz propertyを持たないのでコンパイルエラー
// ただし、型情報を抜いてJavaScriptで書いた場合はエラーにならない。
// このあたりがJavaScriptのランタイムではOKだが、TypeScriptだとコンパイルエラーというややこしいところ。
console.log(obj_subtr2.baz);

// NOTE: 空のobject {}にはどんなobject literalも代入できる。
// {}は超巨大なobject、というイメージを持っておく。

// 部分型関係だがコンパイルエラーを吐くケース
// 確かにsyntax的には部分型代入なので間違ってないが、代入した時点でtellNumberは使えなくなるため、
// 無駄なことはするなよ、とコンパイルエラーが出る。
type User = { name: string; age: number };
const u: User = {
  name: "uhyo",
  age: 26,
  telNumber: "08099887879", // すぐ使えなくなるプロパティがあるためコンパイルエラー
};

// コンパイルエラーが出るにはobject literalを直接代入している、という条件が必要
// 以下の場合は直接代入していないのでコンパイルエラーは出ない。
// コンパイラはobj_subtr3が別の場所で使われる可能性を考慮しているため。
const obj_subtr3 = {
  name: "uhyo",
  age: 26,
  telNumber: "08099887879",
};
const u_subtr3: User = obj_subtr3;

// ====== 型引数(type parameters) ======

// ジェネリック型(generics)
// 引数をもつ型のことをジェネリック型という。
type HasName = {
  name: string;
};
// X extends Y はXがYの部分型である必要があることを表す
type Family<Parent extends HasName, Child extends Parent> = {
  mother: Parent;
  father: Parent;
  child: Child;
};

// 部分型関係の制約があるためエラー
const obj_gn: Family<number, string> = {
  mother: 1,
  father: 2,
  child: "aaa",
};

// 以下のようにするとエラーは出ない
type Animal = {
  name: string;
};
type Human = {
  name: string;
  age: number;
};
type T_gn = Family<Animal, Human>;

// ====== 配列 ======

const arr1 = [4, 5, 6];
const arr2 = [1, 2, 3, ...arr1];
// arrayがconstでもその要素には再代入可能。
arr1[0] = 100;

// number型のみの配列
const arr3: number[] = [1, 2, 300];
// string, number, booleanのみの配列
const arr3_2: (string | number | boolean)[] = [1, 2, 300, "aaa", true];

// generic的な書き方。上の書き方と同じ意味。
const arr4: Array<number> = [1, 2, 300];
// 配列の中にobject literalが入る型
const arr5: Array<{
  name: string;
}> = [{ name: "hoge" }, { name: "fuga" }, { name: "piyo" }];

const arr6: readonly number[] = [1, 10, 100];
arr6[0] = 1; // readonlyのためエラー

// 配列の最後の要素のpush, pop
arr1.push(7);
arr1.pop();
// 配列の先頭に7,6を追加。unshift()の返り値は新しい配列のlength
arr1.unshift(7, 6);

// 存在するかをbooleanで返す
arr1.includes(1);
// 存在すればそのindexを、存在しなければ-1を返す
arr1.indexOf(1);
// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
arr1.slice(1, 2);
arr1.concat([1, 2, 3]);
// length property
arr1.length; // 3

// 高階関数(higher-order function)  *4章の内容
// 引数にcallback funcをとる関数のこと。
type usersHOF = { name: string; age: number };
const usersHOF: usersHOF[] = [
  { name: "uhyo", age: 10 },
  { name: "kamio", age: 40 },
];
// 20歳以上のユーザーを抽出
// 挙動としてはcallback funcの返り値はboolean[]で、trueの要素のみが返る仕組みになっている。
const adultUsers = usersHOF.filter((user: User) => user.age >= 20); // [ { name: "kamio", age: 40 } ]
// すべてのユーザーが20歳以上かどうか
const allAdult = usersHOF.every((user: User) => user.age >= 20); // false
// 少なくとも1人は20歳以上かどうか
const seniorExists = usersHOF.some((user: User) => user.age >= 20); // true
// 名前がkamioのユーザーを探して返す
const kamio = usersHOF.find((user: User) => user.name === "kamio"); // { name: "kamio", age: 40 }

// --- for-of loop ---
const arr7 = [1, 2, 3];
// ofの後ろにはiterableなobjectが来る
// 変数elmは毎回作り直されるのでconstで問題ない。
for (const elm of arr7) {
  console.log(elm);
}

// ====== tuple ======

let tuple1: [string, number] = ["a", 1];
tuple1 = ["b", 2];
console.log(tuple1[2]); // 要素数を超えるのでコンパイルエラー

// ラベル付きtuple
// ただ分かりやすいだけでJavaScriptやランタイム上では何の意味も持たない。
type User_tp = [name: string, age: number];
const uhyo: User_tp = ["uhyo", 26];

// readonly, optionalな要素をもつtuple
// tuple2[2]の型は string | undefined となる。
const tuple2: readonly [string, number, string?] = ["a", 1];

// ====== 分割代入(destructing assignment) ======

const obj_di = {
  foo_di: 123,
  bar_di: "aaa",
  "foo baz": true,
};
// property name: variable name で指定する。
const { foo_di, bar_di: barVar, "foo baz": fooBazVar } = obj_di;

// nestしたobjectの分割代入
const nested = {
  num_n: 123,
  obj_n: {
    foo_n: "aaa",
    baz_n: true,
  },
};
const {
  num_n,
  obj_n: { foo_n },
} = nested;
console.log(num_n, foo_n); // 123 "aaa"

// 配列の分割代入
const arr8 = [1, 2, 4, 8, 16, 32];
const [, n8_1, , n8_3, , n8_5] = arr8;

// ちょっと複雑なパターン
const obj_di2 = {
  arr: [1, 2, 3],
};
// 1つしか指定していないのでarr[0]のみが代入される
const {
  arr: [foo_di2],
} = obj_di2;

// ちょっと複雑なパターン2
const arr_di2: Array<{ name_di2: string }> = [
  { name_di2: "hoge" },
  { name_di2: "fuga" },
  { name_di2: "piyo" },
];
// arr_di2[0]のname_di2をname_di2という変数に代入
const [{ name_di2 }] = arr_di2;

// NOTE: tupleの分割代入も存在するが、配列と同様なので省略。

// --- 分割代入のデフォルト値 ---
type Obj_did = { foo?: number };
const obj_did1: Obj_did = {};
const obj_did2: Obj_did = { foo: 123 };

// デフォルト値はundefinedの場合のみであって、nullの場合は使われないことに注意！！
// 挙動としては、fooがundefinedのときにfooに500が代入される。
const { foo: foo_did1 = 500 } = obj_did1; // foo_did1は500になる
const { foo: foo_did2 = 500 } = obj_did2; // foo_did2は123になる

// 分割代入のデフォルト値を使わない場合はこう書く
const foo_did3 = obj_did1.foo !== undefined ? obj_did1.foo : 500;

// 分割代入により変数の型が一意に定まるケース
const obj_did4: Obj_did = {}; // fooはnumber | undefined 型
const { foo: foo_did4 = 500 } = obj_did4; // foo_did4はnumber型に確定する。

// ネストされたobjectのデフォルト値
type NestedObj = {
  obj?: {
    foo: number;
  };
};
const nested1: NestedObj = {
  obj: { foo: 123 },
};
const nested2: NestedObj = {};

// objに対してデフォルト値{foo: 500}を設定している。
// objがundefinedのとき、objに{foo: 500}が代入され、結果foo1に500が代入される。
// {foo: foo1}に対してのデフォルト値ではないことに注意！
// {foo: foo1}に対してデフォルト値を設定してしまうと、objがundefinedのときに存在しないfooプロパティを参照しにいってエラーを吐くため。
const { obj: { foo: foo1 } = { foo: 500 } } = nested1; // foo1は123になる
const { obj: { foo: foo2 } = { foo: 500 } } = nested2; // foo2は500になる

// --- rest pattern ---
const obj_rest = {
  foo: 123,
  bar: "aaa",
  baz: true,
};
// restObjはdeep copyである。
const { foo: foo_r, ...restObj } = obj_rest;
console.log(foo_r, restObj); // 123 { bar: "aaa", baz: true }
// NOTE: 配列でも同じ様にrest patternが使える

// --- Map ---
const map: Map<string, number> = new Map();
map.set("foo", 123);
// map.get()の返り値は number | undefined
console.log(map.get("foo")); // 123
console.log(map.get("bar")); // undefined
console.log(map.has("foo")); // true
map.delete("foo");
map.clear(); // 全削除
map.keys(); // keyのiterator
map.values(); // valueのiterator
map.entries(); // [key, value]のiterator

// --- Set ---
const set: Set<string> = new Set();
set.add("foo");
set.delete("foo");
set.has("foo"); // false

// NOTE: WeakMap, WeakSetは省略
