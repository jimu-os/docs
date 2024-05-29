---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "GoBatis"
  text: "全自动化ORM映射框架"
  tagline: 基于XML编写更加简洁清晰的数据库操作
  image:
    src: /public/logo.svg
  actions:
    - theme: brand
      text: 什么是GoBatis?
      link: /zh/guide/intro
    - theme: alt
      text: 快速开始
      link: /zh/guide/start
    - theme: alt
      text: GitHub
      link: https://github.com/jimu-os/gobatis

features:
  - title: 自动装配
    details: 支持数据库结果集,自动适配映射,严格校验 模型对sql结果集的映射覆盖
  - title: 逻辑清晰,易于维护
    details: 数据库操作,主要依赖于对 xml 定义sql解析,sql 逻辑清晰可观,易于维护
---

