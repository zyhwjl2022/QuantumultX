/* 
脚本功能: dftherh5解密

[rewrite local]
^https:\/\/(dftherh5.hcjvdum.com|ljevnf.ncibi1x.cc)\/api\/app\/ping\/config url script-request-header https://raw.githubusercontent.com/zyhwjl2022/QuantumultX/master/zyhwjl/dftherh5.js

[MITM]
hostname = dftherh5.hcjvdum.com ljevnf.ncibi1x.cc

*/
// config

//console.clear();
let body = $response.body

function loadScript(url) {
  const script = `
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '${url}', false);
    xhr.send(null);
    eval(xhr.responseText);
  `;
  eval(script);
}

// Load CryptoJS library
loadScript('https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js');

const te = CryptoJS;

function decrypt(e) {
  let t = "8ed2a631a6ab789a";
  const a = te.enc.Utf8.parse(t);
  const A = te.AES.decrypt(e, a, {
    mode: te.mode.ECB,
    padding: te.pad.Pkcs7
  });
  return JSON.parse(A.toString(te.enc.Utf8));
}

function encrypt(data) {
  let key = "8ed2a631a6ab789a";
  const parsedKey = te.enc.Utf8.parse(key);
  const encrypted = te.AES.encrypt(JSON.stringify(data), parsedKey, {
    mode: te.mode.ECB,
    padding: te.pad.Pkcs7
  });
  return encrypted.toString();
}

// 使用示例
console.log("============")
console.log("body:"+body)
let plainText = decrypt(body);
console.log("============")
console.log("plainText:"+plainText)
let deText = decrypt(plainText)
console.log("============")
console.log("deText:"+deText)


$done(body)
