// ====== ランタイムエラー（例外）処理

function throwError() {
  const error = new Error("エラーが発生しました!!!!!");
  throw error;
}

try {
  console.log("エラーを発生させます");
  throwError();
  console.log("エラーを発生させました");
} catch (err) {
  console.log("エラーをキャッチしました");
  console.log(err);
  console.log("プログラムを終了します");
}

// --- finally ---
// finallyはエラー発生時の割り込み処理として使用される。
// 割り込み処理が終わったらそのままエラーが発生する。
// エラーが発生しない場合はtryブロックの処理が終わった後に実行される。
// つまり、finallyブロックは必ず実行されるので、絶対に実行したい処理をかく。
try {
  console.log("エラーを発生させます");
  throwError();
  console.log("エラーを発生させました");
} finally {
  console.log("finally節: プログラムを終了します");
}
console.log("この行は実行されません");

// NOTE: catchブロックとfinallyブロックの両方がありエラーが発生した場合は、catch -> finallyの順で実行される。

// 実はfinallyはランタイムエラーだけではなく、returnによる関数の脱出に対しても割り込みできる。
function sumFin(max: number): number {
  try {
    let total = 0;
    for (let i = 0; i < max; i++) {
      total += i;
    }
    return total;
  } finally {
    console.log("関数sumFinから脱出します！！");
  }
}
console.log(sumFin(50));
