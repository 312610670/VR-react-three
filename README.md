# react pc 端的模板

包含 react, react-redux, react-router-dom, antd

使用 create-react-app 生成，[点击查看文档](https://create-react-app.dev/)

使用 redux 官方推出得[@reduxjs/toolkit](https://redux-toolkit.js.org/)工具

# 代码格式规范

使用 prettier 规范格式即可

## vscode 配置：

1. 安装插件 Prettier - Code formatter
2. ctrl + p 输入 `setting` 打开工作区设置
3. 搜索 `format on save` 并勾选
4. 选择一个 js 文件 ctrl + p 输入 `format document`
5. 选择`格式化文档，方法是...`
6. 选择 Prettier - Code formatter

这样即可保存的时候使用 prettier 格式化代码

## webstorm 配置：

高版本 webstorm 自带 prettier, 格式化快捷键为 ctrl + shift + alt + p

1. 打开 File -> Setting
2. 搜索 `file watchers`(Tools -> File Watchers)
3. 选择 file watchers 点击右侧 + 图标
4. 选择 Prettier 即可

> 注意配置 prettier 应用程序路径地址，以及文件类型

# 关于样式

在文件 src/modifyVars 可以配置全局的 less 变量

antd 皮肤变量可以在此配置，同实自己所写的 less 文件也可使用其中的变量

less 文件默认为 css modules，如果想写非 css modules 在 less 文件加入 global 即可。eg:

```less
:global {
  .app {
    color: @primary-color;
  }
}
```

# 如何换肤

考虑一些项目需要动态换肤得问题，即要改变 antd primary 得值
可以引入组件 AntResetStyle，通过传入 primaryColor 即可动态 换 ant 得 primaryColor

# 关于 moment

由于 moment 过大，去掉 moment 使用 Day 插件


# 环境变量配置
复制 .env.example 为 .env.local配置相对应的 domain 和 https等变量