import { readFile } from "fs/promises";
import { resolve } from "path";

// もっとも基礎的な非同期処理
// 非同期の関数の引数にコールバック関数を渡す
// NOTE: 非同期の関数の引数、返り値はその関数ごとに異なるので毎回調べに行く必要あり。
const ex8_2_3 = () => {
  setTimeout(() => {
    console.log("run");
  }, 3000);
};
ex8_2_3();

// Promiseを使った書き方 (チェーンは使用せず版)
const ex8_3_2 = () => {
  const p = readFile("foo.txt", "utf8");
  p.then(
    (result) => {
      console.log(result);
    },
    (error: unknown) => {
      console.log(error);
    }
  );
};
ex8_3_2();

// 自作版Promise
// Promise版ではないsetTimeoutをPromise版に変換している。
// (resolve, reject) => {} はexecutorと呼ばれる。
// NOTE: 今回のケースだと絶対失敗しないのでrejectは使っていない。
// また、同様の理由でsleep().catchも設定しなくてもエラーにならない。
const sleep = (duration: number) => {
  return new Promise<void>((resolve, reject) => {
    setTimeout(resolve, duration);
  });
};
const ex8_3_4 = () => {
  sleep(1000).then(() => console.log("1s経過しました"));
};
ex8_3_4();

// Promiseのstatic method
// 全部成功した場合にPromise.allのthenが実行される。
// NOTE: 他にもPromise.raceなどがある。Promise.raceのコード例は下のほうにある。
const ex8_3_6 = () => {
  const p = Promise.all([
    readFile("foo.txt", "utf8"),
    readFile("foo.txt", "utf8"),
    readFile("foo.txt", "utf8"),
  ]);
  p.then(([foo, bar, baz]) => console.log(foo, bar, baz));
};
ex8_3_6();

// Promise Chain
// finallyは絶対実行する、catchは失敗の場合のみコールバックが実行される。
// 成功のときはcatchは素通りする、というのが理解の上での最大のポイント。
// NOTE: 特に理由がなければこのチェーンの形で書くのが良いとのこと。
const ex8_3_8 = () => {
  readFile("foo.txt", "utf8")
    .finally(() => console.log("finally!!"))
    .catch(() => "catch!!")
    .then((result) => console.log(result));
};
ex8_3_8();

// 非同期処理を順番に実行する
const ex8_3_9 = () => {
  const repeat10 = (str: string) =>
    new Promise<string>((resolve) => {
      setTimeout(() => resolve(str.repeat(10)), 1000);
    });
  // ファイル読み込みが解決すると、別の非同期処理のrepeat10が実行される。
  readFile("foo.txt", "utf8")
    .then((result) => repeat10(result))
    .then((result) => {
      console.log(result);
    });
};
ex8_3_9();

// 成功したPromiseを失敗に変換させる
// NOTE: Promiseのエラーハンドリングの処理は必須。無いとUnhandledPromiseRejectionエラーが発生。
const ex8_3_10 = () => {
  console.log("ex8_3_10");
  const p1 = readFile("foo.txt", "utf8")
    .then((result) => {
      throw new Error("エラーが発生しました");
    })
    .then((result) => {
      console.log("ここは実行されません");
    })
    .catch((error) => {
      console.log(error.message);
    });
};
ex8_3_10();

// --- dynamic import ---
import("fs/promises")
  .then(({ readFile }) => readFile("foo.txt", "utf8"))
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log("エラー発生！", error);
  });

// --- async/await ---
// 宣言の仕方
async function main() {
  return 0;
}
// function expression
const func2 = async function () {
  return 0;
};
// arrow function
const func3 = async () => {
  return 0;
};

// 使用例
const ex8_4_2 = () => {
  async function get3() {
    console.log("get3: start");
    await sleep(3000);
    console.log("get3: end");
    return 3;
  }

  console.log("get3を呼び出します");
  const p = get3().then((num) => {
    console.log(`num is ${num}`);
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
const ex8_4_4 = () => {
  async function main() {
    const { readFile, writeFile } = await import("fs/promises");
    try {
      const fooContext = await readFile("foo.txt", "utf8");
      await writeFile("bar.txt", fooContext + fooContext);
      console.log("ファイルのコピーが完了しました");
    } catch {
      console.log("エラーが発生しました");
    }
  }

  main().then(() => {
    console.log("main関数が完了しました");
  });
};

// --- タイムアウト処理の実装 ---
import path from "path";
import { fileURLToPath } from "url";
const errorAfter1ms = async () => {
  await sleep(1);
  throw new Error("Time out!");
};
const filePath = fileURLToPath(import.meta.url);
const fileDir = path.dirname(filePath);
const dataFile = path.join(fileDir, "foo.txt");

// top level awaitとPromise.raceの併用
// NOTE: top level awaitの失敗はランタイムエラーと同じ扱いになるためエラーハンドリングが必要。
const data = await Promise.race([
  readFile(dataFile, "utf8"),
  errorAfter1ms(),
]).catch(() => {
  console.log("エラー発生");
  // プロセスを終了させる処理
  process.exit(1);
});
