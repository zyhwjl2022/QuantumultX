/* 
脚本功能: dftherh5解密

[rewrite local]
^https:\/\/dftherh5.hcjvdum.com\/api\/app\/ping\/config url script-request-header https://raw.githubusercontent.com/zyhwjl2022/QuantumultX/master/zyhwjl/dftherh5.js

[MITM]
hostname = dftherh5.hcjvdum.com

*/
const $ = new Env("dftherh5解密");

!(async () => {
  const session = {};
  session.url = $request.url;
  session.body = $request.body;
  session.headers = $request.headers;
  $.log(JSON.stringify(session));
})()
  .catch((e) => $.logErr(e))
  .finally(() => $.done());
