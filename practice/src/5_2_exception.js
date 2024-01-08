function throwError() {
    var error = new Error("エラーが発生しました!!!!!");
    throw error;
}
try {
    console.log("エラーを発生させます");
    throwError();
    console.log("エラーを発生させました");
}
catch (err) {
    console.log("エラーをキャッチしました");
    console.log(err);
    console.log("プログラムを終了します");
}
try {
    console.log("エラーを発生させます");
    throwError();
    console.log("エラーを発生させました");
}
finally {
    console.log("finally節: プログラムを終了します");
}
console.log("try文の後ろ");
