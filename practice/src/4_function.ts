// ====== 関数 ======
function helloWorldNTimes(n: number): void {
  for (let i = 0; i < n; i++) {
    console.log("Hello World!");
  }
};

// --- 関数式(function expression) ---
type Human_fe = {
    height: number;
    weight: number;
};
const calcBMI = function (human: Human_fe): number {
    return human.weight / (human.height * human.height);
};


// destructing assignmentで引数を受け取るver.
const calcBMI2 = function ({ weight, height }: Human_fe): number {
    return weight / (height * height);
};
console.log(calcBMI2({ weight: 70, height: 1.75 })); // 22.86

// --- アロー関数式(arrow function expression) ---
// "function"と書かなくていい分、短く書ける。
const calcBMI3 = ({ height, weight }: Human_fe): number => {
    return weight / (height * height);
};
// arrow function expressionの省略記法
const calcBMI4 = ({ height, weight }: Human_fe): number => weight / (height * height);
// arrow function expressionの省略記法で返り値をobjectにするときは()で囲む。
type ReturnObj = { bmi: number }
const calcBMI5 = ({ height, weight }: Human_fe): ReturnObj => ({ bmi: weight / (height * height) });

// object literalの中で関数定義をする方法
const obj_fd = {
    // メソッド記法 (method syntax)
    // "function"と書かなくてよいのと、property名として関数名を一緒にできる
    // ただし、部分型関係の条件緩和が起こり型安全性が破壊される恐れがあるため、極力使わないほうがいい。
    double(n: number): number {
        return n * 2;
    },
    // <property name>: <arrow function expressionの省略記法>
    double2: (n: number): number => n * 2,
};


// --- 可変長引数 ---
// ...argsの部分をrest parameterと呼ぶ。
// rest parameterは配列でないとコンパイルエラー。
const sum_args = (base: number, ...args: number[]): number => {
    let result = base * 1000;
    for (const num of args) {
        result += num;
    }
    return result;
};
console.log(sum_args(100, 1, 2, 3)); // 1106

// spread syntaxを関数呼び出し時の引数に使う
const num_args = [1, 2, 3, 4, 5];
console.log(sum_args(100, ...num_args)); // 1115
// こんなこともできる
console.log(sum_args(100, ...num_args, 5, ...num_args));

// 関数呼び出し時の引数にspread syntaxを使うときは、対応する引数が可変長引数でないとコンパイルエラー。
const sum3 = (a: number, b: number, c: number): number => a + b + c;
const nums3 = [1, 2, 3];
// 配列は静的チェックではlengthが不明なのでコンパイルエラー。
// エラー回避にはtupleを使えば良いが、そもそも固定長引数の関数の呼び出しにspread syntaxを使うことはあまりない。
console.log(sum3(...nums3));  // コンパイルエラー


// --- optionalな引数 ---
const toLowerOrUpper = (str: string, upper?: boolean): string => {
    // upperが渡されない場合はuuper = undefinedとなる。
    if (upper) {
        return str.toUpperCase();
    } else {
        return str.toLowerCase();
    }
}

const toLowerOrUpper2 = (str: string, upper: boolean = false): string => {
    // upperが渡されない場合はupper = falseとなる。
    // upperにundefinedが渡されたときもupper = falseとなるので注意！！！
    if (upper) {
        return str.toUpperCase();
    } else {
        return str.toLowerCase();
    }
}

// NOTE: rest parameterとoptional parameterを併用するときは
// optional param -> rest paramの順で並べる。


// --- callback function ---
type UserCB = { name: string; age: number };
const getName = (u: UserCB): string => {
    console.log(`u is ${u}`);
    return u.name;
};
const users_cb: UserCB[] = [
    { name: "uhyo", age: 30 },
    { name: "kamio", age: 40 },
];
// consol.logは2回呼ばれる。
const names_cb = users_cb.map(getName);
console.log(names_cb); // ["uhyo", "kamio"]

// callback funcは関数に渡されるためだけに作られることが多いため、
// こんな感じで関数式を使って書くことが多い
const namesCB = users_cb.map((u: UserCB): string => u.name);


// ====== 関数の型 ======

type RepeatNum = (repeatNum: number) => string;
const xRepeat: RepeatNum = (repeatNum: number): string => "x".repeat(repeatNum);

// 関数の型を指定しなくても、TypeScriptの型推論で型注釈は付く。
const xRepeat2 = (repeatNum: number): string => "x".repeat(repeatNum);
// 関数の返り値の型は省略できる。（できるだけ書いたほうがいいが。）
const xRepeat3 = (repeatNum: number) => "x".repeat(repeatNum);
// 関数の型が指定されている場合は、関数の引数の型も省略できる。
// これはコードの内容から型推論する通常の型推論ではなく、typeで指定された型から関数の引数の型を推論している
// これをcontextual typingと呼ぶ。（本では逆方向の型推論、とも言っている）
const xRepeat4: RepeatNum = (repeatNum) => "x".repeat(repeatNum);

// callback funcは多くの場合、引数の型を省略できる
// numsFT.filter()の時点で引数が (value: number) => unknown 型であることが判明しているため。
// これもcontextual typingの一種とみなせる。
const numsFT = [1,2,3,4,5];
const arrFT = numsFT.filter((x) => x%3===0);

// 関数の引数の型が必要なときに指定しないと以下のエラーが出る
// error message: Parameter 'num' implicitly has an 'any' type.
const fErr = (num) => num*2;


// --- call signature ---
type MyFuncCS = {
    isUsed?: boolean;
    (arg: number): void;  // call signature
};
const doubleMF: MyFuncCS = (arg: number) => console.log(arg * 2);
// isUsed propertyにもアクセスできる
doubleMF.isUsed = true;
// call signatureの部分はcallでアクセスできる
doubleMF(100); // 200

// 以下２つは同じ関数を表す。
type FCS = (arg: string) => number;  // 普通の書き方
type GCS = { (arg: string): number };  // call signatureを使った書き方

// stringを受けるとnumberを返し、numberを受けるとbooleanを返す関数は以下のように書ける。
// TODO: 具体的に関数はどんなものがあるのかは要調査、、、
type SwapFunc = {
    (arg: string): number;
    (arg: number): boolean;
}


// ====== 関数の部分型関係(subtyping relation) ======

// --- 返り値の型による部分型関係 ---
type HasNameSR = { name: string };
type HasNameAndAge = {
    name: string;
    age: number;
}
// HasNameAndAge型のobjectを返す関数
const fromAge = (age: number): HasNameAndAge => ({
    name: "Taro",
    age,
});
// fSRはHasNameSR型を返す関数だが、sub-typing relationにより代入できる
const fSR: (age: number) => HasNameSR = fromAge;
// objSRには { name: "Taro", age: 28 } が入る
// つまりHasNameSR型に余分なageが付加されている。
const objSR: HasNameSR = fSR(28);
// 別の考え方
// 共変(covariant)の返り値がHasNameSR :> HasNameAndAge なので、関数も fSR :> fromAge が成り立つ

// NOTE: 返り値がvoidの関数はどんな関数も部分型となるので代入できる。
// 返り値voidの関数はめっちゃ巨大、というイメージを持っておく。


// --- 引数の型による部分型関係 ---
const showName = (obj: HasNameSR) => {
    console.log(obj.name);
};
// 使わないproperty ageがあるが、関数の実行上問題ないので代入できる
const g: (obj: HasNameAndAge) => void = showName;
// age propertyは何にも使われない。
console.log(g({ name: "Taro2", age: 28 }));  // Taro2
// 別の考え方
// 反変(contravariant)の引数がHasNameAndAge <: HasNameSR なので、関数は g :> showName が成り立つ


// --- 引数の数による部分型関係 ---
type UnaryFunc = (arg: number) => number;
type BinaryFunc = (left: number, right: number) => number;
const doubleSR: UnaryFunc = arg => arg*2;
const addSR: BinaryFunc = (left, right) => left + right;

// 使わない引数rightがあるが、関数実行上問題ないので代入できる
const bin: BinaryFunc = doubleSR;
// right=100は何にも使われない。
console.log(bin(10, 100)) // 20

// 別の考え方
// 反変(contravariant)の引数が (引数2個) <: (引数1個) なので、関数は bin :> doubleSR が成り立つ

// NOTE: 上記の返り値の型、引数の型、引数の数の３つの条件は同時発生する。1つでも満たしていないと代入できない。


// --- method syntaxと部分型関係 ---
type ObjMS = {
    func: (arg: HasNameSR) => string;  // ふつうの書き方
    method(arg: HasNameSR): string;  // method syntax
}
// それぞれ同じ処理を行う関数をセット
const something: ObjMS = {
    func:user => user.name,
    method: user => user.name,
}
const getAge = (user: HasNameAndAge) => String(user.age);
// 反変(contravariant)の引数が HasNameaSR :> HasNameAndAge なので、something.func <: getAge
// つまり代入できない。
something.func = getAge;  // コンパイルエラー
// しかしmethod syntaxを使った関数はなぜか代入できてしまう。
// これはTypeScriptの歴史的経緯や安全性よりも利便性を優先したため。
// したがって、method syntaxは極力使わないほうがいい。
something.method = getAge;  // OK


// --- readonlyと部分型関係 ---
// 引数がreadonlyの配列の関数を用意
function sumRO(nums: readonly number[]): number {
    let result = 0;
    for (const num of nums) {
        result += num;
    }
    return result;
}
// これはもちろんいける
const nums1: readonly number[] = [1, 10, 100];
console.log(sumRO(nums1)); // 111
// 普通の配列はreadonlyの配列の上位互換、
// つまりコード上の処理で書き込みしなければreadonlyとみなせるので代入できる。
const nums2: number[] = [1, 1, 2, 3, 5, 8];
console.log(sumRO(nums2)); // 20


// 引数が普通のnumber[]型、つまり書き込まれる可能性もあるとコンパイラは理解する。
function fillZero(nums: number[]): void {
    for (let i=0; i<nums.length; i++) {
        nums[i] = 0;
    }
}
// 書き込みがされる可能性がある引数に、readonlyの配列を渡すとコンパイルエラー
const numsFZ2: readonly number[] = [1, 1, 2, 3, 5, 8];
fillZero(numsFZ2);  // コンパイルエラー

// objectのreadonly
type UserRO = { name: string };
type ReadOnlyUser = { readonly name: string };
// nameをuhyoに変更する関数
const uhyoify = (user: UserRO) => { user.name = "uhyo" };
const john: ReadOnlyUser = { name: "John" };
john.name = "john";  // コンパイルエラー
uhyoify(john);  // なぜかコンパイルエラーにならない。
console.log(john.name); // uhyo
// つまり、objectのreadonlyは不完全、とおぼえておく。


// ====== generics ======

// ふつうの書き方
function repeat1<T>(element: T, length: number): T[] {
    const result: T[] = [];
    for (let i=0; i<length; i++) {
        result.push(element);
    }
    return result;
}
// function expression
const repeat2 = function<T>(element: T, length: number): T[] {
    const result: T[] = [];
    for (let i=0; i<length; i++) {
        result.push(element);
    }
    return result;
}
// arrow function expression
const repeat3 = <T>(element: T, length: number): T[] => {
    const result: T[] = [];
    for (let i=0; i<length; i++) {
        result.push(element);
    }
    return result;
}
// method syntax
const utils4 = {
    repeat<T>(element: T, length: number): T[] {
        const result: T[] = [];
        for (let i=0; i<length; i++) {
            result.push(element);
        }
        return result;
    }
}

// 呼び出し
const result1 = repeat1<string>("a", 5);
// 型引数は省略可能
const result2 = repeat2("a", 5);