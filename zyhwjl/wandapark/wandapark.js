/* 
脚本功能: 万达PARK随机

[rewrite local]
https://www.wandawic.com/api/interface/integral/qryProductList url script-request-body https://raw.githubusercontent.com/zyhwjl2022/QuantumultX/master/zyhwjl/wandapark/wandapark.js

[MITM]
hostname =www.wandawic.com

*/

let obj = JSON.parse($request.body);

const randomInteger = Math.floor(Math.random() * 3);//0,1,2
const TWO = "23072716391616864";
const TEN = "24020810155112219";
const FIVE = "24020810123714698";
let target = TWO;
if(randomInteger==0){
  //5
  target=FIVE;
}else if(randomInteger==1){
  //10
  target=TEN;
}
obj.data.productId=target;


$done({body:JSON.stringify(obj)});
