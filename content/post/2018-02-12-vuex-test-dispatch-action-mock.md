---
title: "Vuex(Store)を使ったComponentのテストでActionをDispatchで書いた時のMockの書き方"
slug: "vuex-test-dispatch-action-mock"
categories:
- JavaScript Vue.js
date: "2018-02-12T22:15:53+09:00"
---

[vue-test-utilsのドキュメントにやり方は書いてあるんだけど](https://vue-test-utils.vuejs.org/ja/guides/using-with-vuex.html)、Storeのアクションを `dispatch` で呼んだ時にどう書くかちょっと悩んだのでメモ。

要はこういうやつ。

```javascript
<script>
export default {
  mounted() {
    this.$store.dispatch('users/fetch')
  }
}
</script>
```

Actionのmock定義する際のメソッド名を、dispatchを書く時みたいに `'storename/actionname'` みたいにして定義すればよい。

```javascript
describe('Users', () => {
  let actions
  let store

  beforeEach(() => {
    actions = {
      'users/fetch': jest.fn(),
    }
    store = new Vuex.Store({
      state: {
        users: {
          users: [],
        },
      },
      actions,
    })
  })
...
```

