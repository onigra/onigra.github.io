---
title: "LaravelでPOPO(Plain Old Php Object)を追加する"
slug: "laravel-popo"
categories:
- laravel php
date: "2023-12-06T00:00:00+09:00"
---

## 背景

フレームワーク触ってて、例えばRailsだとActiveRecord継承してない普通のRubyのオブジェクト追加したくなることがある。同じようにLaravelを触り始めてそういうファイル追加する上で、パスとかtinkerやPHPUnitとかからアクセスする仕方を知りたかったんだけど `Laravel POPO` で検索するとDDD関連の記事が多く出て知りたいことに辿り着けなかったのでアウトプットしておくことにした。

## やりかた

- ファイルは `app/Models` 配下に追加する
- `namespace App\Models;` を書いておく

## 具体

```app/Models/Hello.php
<?php

namespace App\Models;

class Unko
{
    public static function hello() : string{
        return 'Hello, world';
    }

}
```

```
# php artisan tinker

Psy Shell v0.11.22 (PHP 8.0.29 — cli) by Justin Hileman
> App\Models\Unko::hello();
= "Hello, world"
```

```tests/Unit/UnkoTest.php
<?php

namespace Tests\Unit;

use App\Models\Unko;
use PHPUnit\Framework\TestCase;

class UnkoTest extends TestCase
{
    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function test_hello()
    {
        // when
        $actual = Unko::hello();

        // then
        $this->assertEquals($actual, 'Hello, world');
    }
}
```
