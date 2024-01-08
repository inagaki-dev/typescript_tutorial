type UserCL = {
    name: string;
    age: number;
}

function createUser(name: string, age: number): UserCL {
    if (name === "") {
        throw new Error("User name is empty");
    }
    return {
        name,
        age,
    };
}