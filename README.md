jsShogiKifu - Javascriptで動作する将棋棋譜解析&ビューワ
=======================================================

Web上で将棋の棋譜を表示するビューワにはJavaやFlashで実装されたものがいくつか
ありますが、Javaで作られたものは動作が遅く、Flashで作られたものはiPhoneで動作
しないといった問題がありました。またJavascriptで実装されているものもありますが、
特定のサイトでのみの動作を前提として実装されており、あまり汎用性の高い実装は
ありませんでした。

jsShogiKifuはJavascriptで実装されているためiPhoneでも問題なく動作します。また
汎用的に実装されているため、どのようなWebサイトにも簡単に組み込む事ができます。
動作も軽く、表示のカスタマイズも簡単です。ライセンスはMITライセンスで公開
されているため、商用非商用問わず自由に利用できます。

最新のソースコードは[GitHub上](https://github.com/bto/jsShogiKifu)にあります。

[knuさんのfork](https://github.com/bto/jsShogiKifu), [kkosさんのfork](https://github.com/kkos/jsShogiKifu)もご参照ください。

特徴
----

* Javascriptによる実装
* 棋譜解析部とビューワを完全に分離
  - デザインを簡単に変更可能
* ライブラリ非依存
  - 棋譜データ読み込みにajaxを使用する場合jQueryが必要
  - 棋譜表示に付属のjQueryShogiBoardを使用する場合jQueryが必要
* 名前空間を汚さない
  - 他のライブラリと衝突することがない
* 棋譜形式ごとに解析処理をモジュール化
  - モジュールを追加するだけで新しい棋譜形式に対応可能
  - 現在はkif, csa形式に対応

参照
----

[Javascriptで動作する将棋棋譜ビューワを作った](http://blog.bz2.jp/archives/2011/04/javascript-6.html)
