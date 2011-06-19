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
        なお、持ち駒においては偽の`piece`が渡されることはない。

<!--
Local variables:
mode: markdown
coding: utf-8
end:
-->
