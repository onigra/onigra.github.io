---
title: "Vue.jsでrouter-link(nuxt-link)のテストを書く時にRouterLinkStubが便利"
slug: "vue-test-utils-router-link-stub"
categories:
- JavaScript Vue.js Nuxt.js
date: "2018-03-19T23:42:57+09:00"
---

# 環境

- Node.js v9.8.0
- Nuxt.js v1.4.0
- Jest v22.4.2
- vue-test-utils v1.0.0-beta.12
- power-assert v1.4.4

# 本題

例えば、こういう `nuxt-link` （又は `router-link`）を使ったコンポーネントで

```js
// ~/components/Links.vue

<template>
  <div>
    <nuxt-link to="/">Top</nuxt-link>
    <nuxt-link to="/users">Users</nuxt-link>
    <nuxt-link to="/about">About</nuxt-link>
  </div>
</template>
```

こんな感じのテストを書くと、aタグにレンダリングされないでnuxt-linkのままになってしまう。

```js
// ~/test/components/Links.test.js

import { mount, RouterLinkStub } from '@vue/test-utils'
import assert from 'assert'
import Links from '~/components/Links.vue'

describe('Links', () => {
  test('Stubを使わない', () => {
    const wrapper = mount(Links)

    // aタグにレンダリングされないでnuxt-linkのままになってしまう
    assert(
      wrapper.html() ===
        '<div><nuxt-link to="/">Top</nuxt-link> <nuxt-link to="/users">Users</nuxt-link> <nuxt-link to="/about">About</nuxt-link></div>',
    )
  })
})
```

さらに、 `[Vue warn]: Unknown custom element: <nuxt-link> - did you register the component correctly? For recursive components, make sure to provide the "name" option.` というWarningが出る。

![](/images/unknown-custom-element.jpg)

これを回避するには、[vue-test-utilsのドキュメントに習うと](https://vue-test-utils.vuejs.org/ja/guides/using-with-vue-router.html)スタブを使うかテストでmountしてるVueに対してvue-routerを追加する方法があるんだけど、後者はダルいのでてっとり早くスタブを使うとこんな感じになる。

```js
const wrapper = mount(Links, {
  stubs: ['nuxt-link'],
})
```

しかしこれには問題があり、リンク部分がコメントになってしまいちゃんとしたDOMになってくれなくて、リンクが正しいかのテストができない。

```js
test('リンクがコメントになってしまう', () => {
  const wrapper = mount(Links, {
    stubs: ['nuxt-link'],
  })

  assert(wrapper.html() === '<div><!----> <!----> <!----></div>')
})
```

そこで[RouterLinkStub](https://vue-test-utils.vuejs.org/en/api/components/RouterLinkStub.html)を使うとちゃんとしたDOMになってくれて便利。

```js
test('ちゃんとしたDOMになる', () => {
  const wrapper = mount(Links, {
    stubs: {
      NuxtLink: RouterLinkStub,
    },
  })

  assert(wrapper.html() === '<div><a>Top</a> <a>Users</a> <a>About</a></div>')
})
```

こういうテストも書けるようになる。よかったですね。

```js
test('こういうテストが書けるようになる', () => {
  const wrapper = mount(Links, {
    stubs: {
      NuxtLink: RouterLinkStub,
    },
  })

  const links = wrapper.findAll(RouterLinkStub)

  assert(links.at(0).text() === 'Top')
  assert(links.at(0).props().to === '/')
  assert(links.at(1).text() === 'Users')
  assert(links.at(1).props().to === '/users')
  assert(links.at(2).text() === 'About')
  assert(links.at(2).props().to === '/about')
})
```

ちなみにRouterLinkStubのドキュメントはまだ[日本語版](https://vue-test-utils.vuejs.org/ja/)には載ってないが、[既に翻訳のPRはマージされてるので](https://github.com/vuejs/vue-test-utils/pull/422)そのうち出てくるだろう。感謝 :pray:

