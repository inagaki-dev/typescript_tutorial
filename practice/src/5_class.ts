// classはUserClassという型と、UserClassのクラスが代入された変数の２つを作成する。
// 下に書いてあるが、UserClass型はクラス自体の型ではなく、クラスを使って作成したインスタンスの型である。
class UserClass<T> {
    // static property, static method
    static adminName: string = "admin";
    static getAdminName(): UserClass<string> { return new UserClass(UserClass.adminName, 20, 30) }

    // static initialization block
    // classの宣言時に実行される。private propertyの操作等に使う。
    static superAdminUser: UserClass<string>;
    static {
        this.superAdminUser = new UserClass("superAdmin", 0, 0);
        this.superAdminUser.#realAge = 9999;
    }

    country: string = "Japan";
    readonly name: string;
    private age: number;
    // private propertyのJavaScript由来の記法
    #realAge: number;
    premiumUser?: boolean;
    readonly data?: T;

    constructor(name: string, age: number, realAge: number, data?: T) {
        this.name = name;
        this.age = age;
        // #を使ったprivate propertyへは#を付けてアクセスする。
        this.#realAge = realAge;
        this.data = data;
    }

    // defaultがpublicなので省略可能
    public isAdult(): boolean {
        return this.age >= 20;
    }

    setAge(age: number): void {
        this.age = age;
    }
}

// インスタンスの作成
// 最初のUserClassは型、２番目のUserClassはクラスが代入された変数
const ababa: UserClass<string> = new UserClass("ababa", 28, 35);
// static propertyはクラス名からのみアクセス可能。インスタンスでは不可。
console.log(ababa.adminName); // コンパイルエラー

// class expression
// 普通に定義する方法と何も変わらないのであまり使われない。
const UserClass2 = class {
    name: string = "Taro";
    age: number = 28;
}

// 型引数はコンストラクタ実行時に指定する
const ababa2 = new UserClass<string>("ababa2", 23, 24, "追加データ");
console.log(ababa2.data); // "追加データ": string型
// 型推論が効くときは型引数を省略できる
const ababa3 = new UserClass("ababa3", 23, 24, {num: 123});
console.log(ababa3.data); // {num: 123}: {num: number}型


// class宣言時に作成される変数UserClassを別の変数に代入し、それを使ってインスタンス作成もできる。変数なので。
// UserClass型はUserClassクラス自体の方ではなく、UserClassクラスを使って作成したインスタンスの型である。
// なのでクラスが代入された変数の型はUserClass型ではない。これ大切！！！
// NOTE: 確かに、valUserClassにカーソルを当てると typeof UserClass と表示される。
const valUserClass = UserClass;
const poyoi: UserClass<string> = new valUserClass("poyoi", 28, 35);

// クラスが代入された変数の型は new(引数リスト) => インスタンスの型 という構文で表す。
class User4 {
    name: string = "";
    age: number = 0;
}
// User4クラスの型は new () => User4
// それに対して別名としてMyUser4Constructorと付ける
type MyUser4Constructor = new () => User4;
// 当然こういうことができる
const MyUser4: MyUser4Constructor = User4;
// クラスなのでインスタンス化も可能。
const u4 = new MyUser4();

// new(引数リスト) => インスタンスの型 の構文はnew signatureを使って同様に書くこともできる。
type MyUser4Constructor2 = {
    new (): User4;  // new signature
}
const MyUser4_2: MyUser4Constructor = User4;


// --- instanceofによる型の絞り込み ---
// HasAge :> UserIof となる２つの型を定義
type HasAge = { age: number };
class UserIof {
    name: string;
    age: number;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
}

// UserIofはHasAgeの部分型なので引数にできる。
// instanceofでUserIofクラスでインスタンス化したかをチェック。(これを型の絞り込みという)
// customer.nameの部分にカーソルを当てると確かにUserIof型に変化している。
function getPrice(customer: HasAge) {
    if (customer instanceof UserIof && customer.name === "uhyo") {
        return 0;
    }
    return customer.age < 18 ? 1000 : 1800;
}

const customer1: HasAge = { age: 15};
const uhyo1 = new UserIof("uhyo", 15);
console.log(getPrice(customer1)); // 1000
// UserIofはHasAgeの部分型なので引数にできる。
console.log(getPrice(uhyo1)); // 0


// ====== 継承 ======

class UserIH {
    name: string;
    age: number;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
    public isAdult(): boolean {
        if (this.age >= 20) {
            return true;
        }
        return false;
    }
}

class premiumUser extends UserIH {
    rank: number;

    // constrtructorのoverride
    constructor(name: string, age: number, rank: number) {
        // super classのconstructorを呼び出す（必須）
        super(name, age);
        this.rank = rank;
    }
    // overrideをつけて明示的にoverrideする
    public override isAdult(): boolean {
        return true;
    }
}


// class宣言時のimplementsによる型チェック
// UserIPはUserIHの部分型であることをチェックできる。
// あくまでコンパイラによるチェックなので省略も可能。
// 継承(extends)との併用も可能。
class UserIP implements UserIH {
    name: string;
    age: number;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
    public isAdult(): boolean {
        return true;
    }
}


// ====== this ======

class UserThis {
    // static関連のthisはクラス自体を参照する。
    static foo = 123;
    static bar = this.foo * 2;
    static {
        console.log(`bar is ${this.bar}`);
    }

    name: string;
    #age: number;

    constructor(name: string, age: number) {
        this.name = name;
        this.#age = age;
    }
    // static関連意外は、thisはnew時に作成されるインスタンスを参照する。
    public isAdult(): boolean {
        return this.#age >= 20;
    }
    // 外部の関数の中でthisを使う場合は、thisの退避が必要だった。
    // これは外部の関数の中のthisは独自の定義を持つケースがあるため。
    public filterOlder2(users: readonly UserThis[]): UserThis[] {
        const _this = this;
        return users.filter(function(u) {return u.#age > _this.#age});
    }
    // arrow function を使えばthisの退避は不要。
    // これはarrow functionがthisをそのまま引き継ぐため。
    public filterOlder(users: readonly UserThis[]): UserThis[] {
        return users.filter(u => u.#age > this.#age);
    }
}

const uhyoThis = new UserThis("uhyo", 25);
const johnThis = new UserThis("john", 15);
const bobThis = new UserThis("bob", 40);
const older = uhyoThis.filterOlder([johnThis, bobThis]);  // [UserThis{name: "bob"}]

// thisをjohnThisに固定してメソッドを呼び出すapplyメソッド
// 第二引数はisAdultの引数リスト
console.log(uhyoThis.isAdult.apply(johnThis, [])); // false
// callメソッドはapplyとほぼ同じで、引数リストをfunc.call(obj, 1,2,3)のように渡す。
console.log(uhyoThis.isAdult.call(johnThis)); // false
// applyはReflectという予め用意されたグローバル変数を使っても書ける。
console.log(Reflect.apply(uhyoThis.isAdult, johnThis, [])); // false

// thisを固定したメソッドを生成するにはbindメソッドを使う。
const boundIsAdult = uhyoThis.isAdult.bind(uhyoThis);
console.log(boundIsAdult()); // true
// 1回bindで固定したらその後にcallとかを使ってもthisは変更できない。
console.log(boundIsAdult.call(johnThis)); // true


