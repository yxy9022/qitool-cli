const { log, error } = require('../utils/logger');
const { toUint8Array } = require('js-base64');
const { gunzip } = require('fflate');
/**
 * 解压数据
 * @param {*} data
 * @returns
 */
async function decompressData(data) {
  return new Promise((resolve, reject) => {
    gunzip(data, (err, decompressedData) => {
      if (err) {
        reject(err);
      } else {
        resolve(decompressedData);
      }
    });
  });
}

async function create(str, options) {
  if (!str) {
    error("missing required argument 'str'");
    return;
  }
  log();
  const decodeContent = toUint8Array(str);
  // 当前只支持gzip压缩
  const u8sData = await decompressData(decodeContent); // gunzip 解压缩，必须是b64_2解码数据,不是则说明服务端数据处理有问题
  let originalContentStr = new TextDecoder().decode(u8sData); // 将Uint8Array转回字符串
  log(`✨ 解码结果：`);
  log(JSON.parse(originalContentStr));
  log();
}

module.exports = (...args) => {
  return create(...args).catch(err => {
    error(err, '解析失败：');
    process.exit(1);
  });
};
