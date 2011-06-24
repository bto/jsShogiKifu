jsShogiKifu AM版
================

Masato Bitoさんによる[jsShogiKifu] (https://github.com/bto/jsShogiKifu)
のforkです。K.Kosakoさんによる改修を取り込んでいます。（cf. `README.kosako`）

最新のソースコードは[GitHub上](https://github.com/knu/jsShogiKifu)にあります。

K.Kosako版からの改修点
----------------------

*   画像を使わないレンダリングをサポート。

    それに伴い `piece_image_width`/`piece_image_height` を
    `piece_width`/`piece_height` に改名。（互換性のため古い名前も使用可能）

*   レンダリングエンジンを選択またはユーザ定義可能。

    `shogiBoard()`関数のオプション項目`renderer`で関数を指定できる。

    -   `"image"`

        画像でレンダリングを行う。規定値。

    -   `"text"`

        テキストでレンダリングを行う。現時点でIEでは正しく表示されない。

    -   `function(cell, piece, black_p) {...}`

        `cell`: jQueryオブジェクト, `piece`: 駒種, `black_p`: 先手かどうかのフラグ
        を受け取り、描画を行うユーザ関数。

        `piece`が空の場合は空の枡を描画する。

        `cell.jsbIsStand()`が真の場合は駒種ごとの持ち駒エリア。
        `cell.jsbGetNumber()`でその駒の枚数が得られる。
        なお、持ち駒においては空の`piece`が渡されることはない。

*   UIを改善。

    盤上左右1/3領域をクリックすることで前後の指し手に移動可能。

*   jQuery Mobile上での動作をサポート。

    -   左右のスワイプによりそれぞれ最初、最後の局面へ移動。

    -   指し手を示すselectボックスの状態更新通知を追加。

To-Do's
-------

*   レンダリングエンジンの改良。

    -   テキスト版

        -   持駒表示の改良。同種の駒は複数並べず、「角銀二歩三」のように枚数を付記。

        -   「全」「圭」「杏」の代わりに「成銀」「成桂」「成香」と表示するオプションの追加。

        -   成り駒にはそれ用のclassを振り、容易に赤く表示できるようにする。

    -   画像版

        -   持駒表示の改良。同種の駒は複数並べず、枚数を記したバッヂをオーバーレイ表示。
            また、二枚の場合は数でなく重ねて表示するオプションなど。

*   IE8/IE9での動作確認・対応。

*   Androidブラウザでの動作確認・対応。

*   棋譜の（手動・自動）更新への対応。

非推奨事項
----------

*   盤面テンプレートの `template_url` によるURL指定

    - ページロード後、動的にレンダリングを行うjQuery Mobileとの相性が悪い。
      （ただし、jQuery Mobileが部分的な動的更新をサポートすれば話は変わる）

<!--
Local variables:
mode: markdown
coding: utf-8
end:
-->
