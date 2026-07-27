---
title: "Pythonあまり知らない人がMacでAnsibleリポジトリの最低限の開発環境をつくる"
slug: "ansible-development-setup"
categories:
- Ansible
date: "2019-01-27T20:17:41+09:00"
---

Ansibleに[プルリク](https://github.com/ansible/ansible/pull/51366)出すのに調べた。基本的にこれの通りにやればいい。

[Ansible module development: getting started](https://docs.ansible.com/ansible/devel/dev_guide/developing_modules_general.html)

## 環境構築

[Common environment setup](https://docs.ansible.com/ansible/devel/dev_guide/developing_modules_general.html#common-environment-setup)

## テストの実行

### Sanity tests

[Sanity Tests](https://docs.ansible.com/ansible/latest/dev_guide/testing_sanity.html)

- 静的解析とかするやつ
- `symlinks` はvenv配下だと必ず失敗するのでskipする


```sh
ansible-test sanity --skip-test symlinks --docker --python 3.6
```

### Unit tests

#### セットアップ

- 上記の環境構築をやった上で依存の取得

```sh
pip3 install -r ./test/runner/requirements/units.txt
```

#### テストの実行

- Macで全件流すと長いし色々落ちるので、修正した特定のテストだけ実行した方がベター
- 全件流すのはCIに任せればよい
- pytestでなんかサクッと `print` でデバッグプリント出したい時は `-s` を付けて実行すると楽
  - generateしたコマンド見たい時とか

```sh
# gem moduleのテストだけ実行する
pytest -s -r a --fulltrace --color yes test/units/modules/packaging/language/test_gem.py
```

## 参考

- [Ansibleモジュールを自作したらsanityテストをしてみよう](https://qiita.com/sky_jokerxx/items/b997117ea70bb8c8c1ec)
- [Ansibleモジュールを自作したらunitテストをしてみよう](https://qiita.com/sky_jokerxx/items/67e5617643d05344fdc0)
- [How can I see normal print output created during pytest run?](https://stackoverflow.com/questions/14405063/how-can-i-see-normal-print-output-created-during-pytest-run)

