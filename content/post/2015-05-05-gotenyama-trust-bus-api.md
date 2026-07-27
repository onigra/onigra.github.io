---
title: "勤務先のオフィスビルのシャトルバスの時刻表APIを作ってHubotで見れるようにした"
slug: "gotenyama-trust-bus-api"
categories:
- hubot
date: "2015-05-05T14:42:11Z"
---

これ作った。

[onigra/gotenyama_trust_bus_api](https://github.com/onigra/gotenyama_trust_bus_api)

4月から御殿山トラストタワーっていうビルにいて、駅から遠くてシャトルバスが出てるんだけど、カジュアルにバスの時間確認できるようにしたくて、雑にAPI作ってHerokuにホストした。

HerokuのURLとかAPIの使い方はREADME参照。御殿山トラストタワーに勤めてる人はよかったら使ってください。

で、これを作った本当の目的はHubotから使えるようにするためで、なるべくjs書きたくないからAPIを用意することにした。  
（このAPI使ってChromeエクステンション作りたいって人がいたっていうのもある）

![hubot1](/images/hubot-bus1.png)
![hubot2](/images/hubot-bus2.png)

#### 余談

js書きたくないならRuboty使えばいいじゃんって思うし、[実際plugin作ったんだけど](https://github.com/onigra/ruboty-gotenyamatrust_bus)なんとなくやめた。

あと、連休初日の朝に38度の熱が出て、病み上がりで頭が回ってない時に書いたのと、Ruboty Pluginの方の実装をコピペして作ったから命名が変。あとでなおす。

連休を寝て過ごしただけっていう結果にどうしてもしたくないというモチベーションで作った。

