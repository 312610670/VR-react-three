function transColor(obj, reg, colors, hasAll) {
  let item = {};
  let flag = false;
  for (let key in obj) {
    let value = obj[key];
    if (reg.test(value)) {
      flag = true;
      item[key] = value.replace(reg, (a) => {
        return '@primary' + colors.indexOf(a);
      });
    } else {
      if (hasAll) {
        item[key] = value;
      }
    }
  }
  return flag ? item : false;
}

function main() {
  const fs = require('fs');
  const { blue } = require('@ant-design/colors');
  var css2json = require('css2json');

  const css = fs.readFileSync(
    '../../../node_modules/antd/dist/antd.css',
    'utf-8'
  );
  var json = css2json(css);
  let colorF = [];
  for (let i = 0; i < 10; i++) {
    colorF.push(blue[i]);
  }
  colorF.push('24, 144, 255');

  const colorReg = new RegExp('(' + colorF.join('|') + ')');
  const resetObj = {};
  for (let name in json) {
    let cssContent = json[name];
    const hasAll = /:hover|:active|:focus|:visited'/.test(name);
    let result = transColor(cssContent, colorReg, colorF, hasAll);
    if (result) {
      resetObj[name] = result;
    }
  }
  const keys = Object.keys(resetObj);
  const values = Object.values(resetObj);
  const resetString = keys
    .map((key, i) => {
      let value = values[i];
      let itemKeys = Object.keys(value);
      let itemValeus = Object.values(value);
      let itemstring = itemKeys
        .map((itemKey, itemIndex) => {
          return `${itemKey}: ${itemValeus[itemIndex]}`;
        })
        .join(';');
      return key + ` {${itemstring}}`;
    })
    .join('\n');
  const csstringmodule = `export default \`${resetString}\``;
  fs.writeFileSync('./antResetStyle.tsx', csstringmodule, 'utf-8');
}

main();
