var data = "\nuhyo,26,1\nJohn Smith,17,0\nMary Sue,14,1\n";
var users = [];
// 返り値は配列
var lines = data.split("\n");
for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
    var line = lines_1[_i];
    if (line === "") {
        continue;
    }
    // 分割代入
    var _a = line.split(","), name_1 = _a[0], ageString = _a[1], premiumUserString = _a[2];
    var age = Number(ageString);
    var premiumUser = premiumUserString === "1";
    // arrayにobjectをpushする
    users.push({
        name: name_1,
        age: age,
        premiumUser: premiumUser,
    });
}
for (var _b = 0, users_1 = users; _b < users_1.length; _b++) {
    var user = users_1[_b];
    if (user.premiumUser) {
        console.log("".concat(user.name, " (").concat(user.age, ") \u306F\u30D7\u30EC\u30DF\u30A2\u30E0\u4F1A\u54E1\u3067\u3059\u3002"));
    }
    else {
        console.log("".concat(user.name, " (").concat(user.age, ") \u306F\u30D7\u30EC\u30DF\u30A2\u30E0\u4F1A\u54E1\u3067\u306F\u3042\u308A\u307E\u305B\u3093\u3002"));
    }
}
