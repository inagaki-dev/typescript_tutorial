// type FooBar = {
//     foo: string;
//     bar: number;
// }
// type FooBarBaz = {
//     foo: string;
//     bar: number;
//     baz: boolean;
// }
// const obj_subtr: FooBarBaz = {
var obj_subtr = {
    foo: "aaa",
    bar: 123,
    baz: true,
};
// FooBarBazはFooBarの部分型であるため代入可能
// ただし余剰分のbazが消える
// const obj_subtr2: FooBar = obj_subtr;
var obj_subtr2 = obj_subtr;
console.log(obj_subtr2.baz); // bazはFooBarには存在しないためエラー
