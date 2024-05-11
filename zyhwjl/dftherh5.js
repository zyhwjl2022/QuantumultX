/* 
脚本功能: dftherh5解密

[rewrite local]
^https:\/\/dftherh5.hcjvdum.com\/api\/app\/ping\/config url script-request-header https://raw.githubusercontent.com/zyhwjl2022/QuantumultX/master/zyhwjl/dftherh5.js

[MITM]
hostname = dftherh5.hcjvdum.com

*/
// config

//console.clear();
let body = $response.body
var jsonData = JSON.parse(body);
var data = jsonData.data

/**
 * @supported A2BCC90F0711
 */

// Function to load external JavaScript files
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
// Load base64-js library
loadScript('https://cdn.jsdelivr.net/npm/base64-js@1.5.1/base64js.min.js');
let key = 'vEukA&w15z4VAD3kAY#fkL#rBnU!WDhN'; //  rTukA&w1578VAD3#AY3fkL#rBnU^DDuO 之前的
let nonceLength = 12;
let aesKey = [];
let aesIV = [];
let akey = null;
let iv = null;
let cipherG=null;

// Your decoding function
function decodeHttpResponseData(cipher) {
  cipherG=cipher
  // cipher Base64解码
  const cipherBytes = Array.from(base64js.toByteArray(cipher));
  //console.log("原数据："+cipher.substring(0,40))
  const nonce = cipherBytes.splice(0, nonceLength);
  //a=base64js.fromByteArray(cipherBytes);
  //console.log("真实数据："+a.substring(0,40))
  const enCodeKey = encodeUtf8(key);
  // 组装largeShaRaw数组计算KEY
  const largeShaRaw = [...enCodeKey, ...nonce];
  const largeShaRawMid = parseInt(largeShaRaw.length / 2);
  const largeShaRawByteArray = base64js.fromByteArray(largeShaRaw);
  const base64ShaRaw = CryptoJS.enc.Base64.parse(largeShaRawByteArray);
  const msgKeyLarge = Str16ToBytes(CryptoJS.SHA256(base64ShaRaw).toString());
  const msgKey = msgKeyLarge.splice(8, 16);
  // 计算sha256a
  const shaRawA = [...msgKey, ...largeShaRaw.splice(0, largeShaRawMid)];
  const sha256aByteArray = base64js.fromByteArray(shaRawA);
  const base64Sha256a = CryptoJS.enc.Base64.parse(sha256aByteArray);
  const sha256a = Str16ToBytes(CryptoJS.SHA256(base64Sha256a).toString());
  // 计算sha256b
  const shaRawB = [...largeShaRaw, ...msgKey];
  const sha256bByteArray = base64js.fromByteArray(shaRawB);
  const base64Sha256b = CryptoJS.enc.Base64.parse(sha256bByteArray);
  const sha256b = Str16ToBytes(CryptoJS.SHA256(base64Sha256b).toString());
  // 计算aesKey
  aesKey = [
    ...sha256a.splice(0, 8),
    ...sha256b.splice(8, 16),
    ...sha256a.splice(16, 24)
  ];
  // 计算aesIV
  aesIV = [
    ...sha256b.splice(0, 4),
    ...sha256a.splice(4, 8),
    ...sha256b.splice(8, 12)
  ];
  // cipher Data 转字节
  const data = base64js.fromByteArray(cipherBytes);
  // aesKey 转字节 后Base64解码
  akey = CryptoJS.enc.Base64.parse(base64js.fromByteArray(aesKey));
  // aesIV 转字节 后Base64解码
  iv = CryptoJS.enc.Base64.parse(base64js.fromByteArray(aesIV));
  // AES解码后转utf8字符串
  const wordArrayData = CryptoJS.AES.decrypt(data, akey, { iv, mode: CryptoJS.mode.CBC });
  result = wordArrayData.toString(CryptoJS.enc.Utf8);
  return result

  function Str16ToBytes(str) {
    let pos = 0;
    let len = str.length;
    if (len % 2 !== 0) {
      return null;
    }
    len /= 2;
    const hexA = [];
    for (let i = 0; i < len; i++) {
      const s = str.substr(pos, 2);
      const v = parseInt(s, 16);
      hexA.push(v);
      pos += 2;
    }
    return hexA;
  }

  function encodeUtf8(text) {
    const code = encodeURIComponent(text);
    const bytes = [];
    for (let i = 0; i < code.length; i++) {
      const c = code.charAt(i);
      if (c === '%') {
        const hex = code.charAt(i + 1) + code.charAt(i + 2);
        const hexVal = parseInt(hex, 16);
        bytes.push(hexVal);
        i += 2;
      } else {
        bytes.push(c.charCodeAt(0));
      }
    }
    return bytes;
  }
}

/**加密 */
function decode(plaintext){
  const encryptStr = CryptoJS.AES.encrypt(plaintext, akey, { iv, mode: CryptoJS.mode.CBC });
  result=cipherG.substring(0,16)+encryptStr.toString();
  // result=base64js.fromByteArray(new TextEncoder().encode(a))
  // a=base64js.toByteArray('abcdefghijklmnop'+wordArrayData1.toString())
  return result
}


function parseM3u8(data) {
  // 初始化enkey 值 重写m3u8 enkey 链接不然不能访问
  const enkeyUri = 'http://localhost:3881/api/h5app/media/enkey'
  // enkey匹配规则
  const reg = /\/api\/h5app\/media\/enkey/g
  // base64转字节数组
  const cipherBytes = toByteArray(data)
  // 字节数字转字符串文本文件
  const m3u8Text = new Buffer.from(cipherBytes, 'base64').toString()
  // 重写m3u8内容 不然不能访问
  const changeUrlM3u8 = m3u8Text.replace(reg, enkeyUri)

  // m3u8重新创建成为Unit8数组转Blob
  const encodeCipherBytes = stringToUint8Array(changeUrlM3u8)
  const blob = new Blob([encodeCipherBytes])
  return window.URL.createObjectURL(blob)
}

function stringToUint8Array(str) {
  const arr = []
  for (let i = 0, j = str.length; i < j; ++i) {
    arr.push(str.charCodeAt(i))
  }
  const tmpUint8Array = new Uint8Array(arr)
  return tmpUint8Array
}
plainData = decodeHttpResponseData(data)
plainJson = JSON.parse(plainData);
if (plainJson) {
  // 去广告
  if(plainJson.advertise){
    delete plainJson.advertise
  }
  if(plainJson.postCategory){
    delete plainJson.postCategory
  }
  if(plainJson.postSection){
    delete plainJson.postSection
  }
  if(plainJson.statConfigApp){
    delete plainJson.statConfigApp
  }
  // 去广告  
  
  if(plainJson.mediaInfo){
    if(typeof plainJson.mediaInfo.isBuy !== 'undefined'){
      plainJson.mediaInfo.isBuy = true;
    }
    if(typeof plainJson.mediaInfo.videoType !== 'undefined'){
      plainJson.mediaInfo.videoType = 0;
    }
  }
  if(typeof plainJson.watchCount !== 'undefined'){
    plainJson.watchCount = 100;
  }
  if(typeof plainJson.playable !== 'undefined'){
    plainJson.playable = true;
  }
  if(typeof plainJson.code !== 'undefined'){
    plainJson.code = 200;
  }

}
result = decode(JSON.stringify(plainJson))
//console.log(JSON.stringify(plainJson))
jsonData.data=result
//console.log("==========")
//console.log("处理数据："+result.substring(0,40))
console.log(JSON.stringify(plainJson))


$done(JSON.stringify(jsonData))
