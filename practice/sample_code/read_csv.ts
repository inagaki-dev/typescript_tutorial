type User = {
    name: string;
    age: number;
    premiumUser: boolean;
}

const data: string = `
uhyo,26,1
John Smith,17,0
Mary Sue,14,1
`;

const users: User[] = [];

// 返り値は配列
const lines = data.split("\n");

for (const line of lines) {
    if (line === "") {
        continue;
    }
    // 分割代入
    const [name, ageString, premiumUserString] = line.split(",");
    const age = Number(ageString);
    const premiumUser = premiumUserString === "1";
    // arrayにobjectをpushする
    users.push({
        name,
        age,
        premiumUser,
    });
}

for (const user of users) {
    if (user.premiumUser) {
        console.log(`${user.name} (${user.age}) はプレミアム会員です。`);
    } else {
        console.log(`${user.name} (${user.age}) はプレミアム会員ではありません。`);
    }
}