(function() {


module('Kifu');

test('ajax', 2, function() {
  stop(1000);
  var csa_file = 'test.csa';

  var source;
  jQuery.ajax({dataType: 'text', type: 'GET', url: csa_file,
    success: function(s) {
      source = s;
    }
  });

  Kifu.ajax({url: csa_file}, 'csa', function(kifu) {
    start();

    var info = kifu.info;
    same(info.format, 'csa', 'check format');
    same(info.source, source, 'source');
  });
});

test('boardPieceToPiece', 16, function() {
  same(Kifu.boardPieceToPiece('歩'), 'FU', '歩 -> FU');
  same(Kifu.boardPieceToPiece('香'), 'KY', '香 -> KY');
  same(Kifu.boardPieceToPiece('桂'), 'KE', '桂 -> KE');
  same(Kifu.boardPieceToPiece('銀'), 'GI', '銀 -> GI');
  same(Kifu.boardPieceToPiece('金'), 'KI', '金 -> KI');
  same(Kifu.boardPieceToPiece('角'), 'KA', '角 -> KA');
  same(Kifu.boardPieceToPiece('飛'), 'HI', '飛 -> HI');
  same(Kifu.boardPieceToPiece('王'), 'OU', '王 -> OU');
  same(Kifu.boardPieceToPiece('玉'), 'OU', '玉 -> OU');
  same(Kifu.boardPieceToPiece('と'), 'TO', 'と -> TO');
  same(Kifu.boardPieceToPiece('杏'), 'NY', '杏 -> NY');
  same(Kifu.boardPieceToPiece('圭'), 'NK', '圭 -> NK');
  same(Kifu.boardPieceToPiece('全'), 'NG', '全 -> NG');
  same(Kifu.boardPieceToPiece('馬'), 'UM', '馬 -> UM');
  same(Kifu.boardPieceToPiece('龍'), 'RY', '龍 -> RY');
  same(Kifu.boardPieceToPiece('竜'), 'RY', '竜 -> RY');
});

test('capitalize', 1, function() {
  var s = Kifu.capitalize('foo');
  same(s, 'Foo', 'capitalize');
});

test('clone', 6, function() {
  // simple object
  var h1 = {foo: 'foo'};
  var h2 = Kifu.clone(h1);
  same(h1, h2, 'same simple object');
  h2.foo = 'bar';
  QUnit.notDeepEqual(h1, h2, 'different simple object');

  // deep object
  h1 = {foo: 'foo', bar: {bar: 'bar', baz: null}};
  h2 = Kifu.clone(h1);
  same(h1, h2, 'same deep object');
  h2.bar.baz = 'baz';
  QUnit.notDeepEqual(h1, h2, 'different deep object');

  // simple array
  var a1 = [1, 2, null];
  var a2 = Kifu.clone(a1);
  same(a1, a2, 'same simple array');

  // deep array
  var a1 = [1, null, {foo: 'bar'}];
  var a2 = Kifu.clone(a1);
  same(a1, a2, 'same deep array');
});

test('directionToKanji', 3, function() {
  same(Kifu.directionToKanji('left'),        '左', 'left        -> 左');
  same(Kifu.directionToKanji('right'),       '右', 'right       -> 右');
  same(Kifu.directionToKanji('straight_up'), '直', 'straight_up -> 直');
});

test('integerToKanji', 11, function() {
  same(Kifu.integerToKanji(1),  '一',    '1 -> 一');
  same(Kifu.integerToKanji(2),  '二',    '2 -> 二');
  same(Kifu.integerToKanji(3),  '三',    '3 -> 三');
  same(Kifu.integerToKanji(4),  '四',    '4 -> 四');
  same(Kifu.integerToKanji(5),  '五',    '5 -> 五');
  same(Kifu.integerToKanji(6),  '六',    '6 -> 六');
  same(Kifu.integerToKanji(7),  '七',    '7 -> 七');
  same(Kifu.integerToKanji(8),  '八',    '8 -> 八');
  same(Kifu.integerToKanji(9),  '九',    '9 -> 九');
  same(Kifu.integerToKanji(10), '十',   '10 -> 十');
  same(Kifu.integerToKanji(11), '十一', '11 -> 十一');
});

test('integerToZenkaku', 10, function() {
  same(Kifu.integerToZenkaku(0),  '０', '0 -> ０');
  same(Kifu.integerToZenkaku(1),  '１', '1 -> １');
  same(Kifu.integerToZenkaku(2),  '２', '2 -> ２');
  same(Kifu.integerToZenkaku(3),  '３', '3 -> ３');
  same(Kifu.integerToZenkaku(4),  '４', '4 -> ４');
  same(Kifu.integerToZenkaku(5),  '５', '5 -> ５');
  same(Kifu.integerToZenkaku(6),  '６', '6 -> ６');
  same(Kifu.integerToZenkaku(7),  '７', '7 -> ７');
  same(Kifu.integerToZenkaku(8),  '８', '8 -> ８');
  same(Kifu.integerToZenkaku(9),  '９', '9 -> ９');
});

test('kanjiToDirection', 3, function() {
  same(Kifu.kanjiToDirection('左'), 'left',        '左 -> left');
  same(Kifu.kanjiToDirection('右'), 'right',       '右 -> right');
  same(Kifu.kanjiToDirection('直'), 'straight_up', '直 -> straight_up');
});

test('kanjiToMovement', 6, function() {
  same(Kifu.kanjiToMovement('上'), 'up',      '上 -> up');
  same(Kifu.kanjiToMovement('寄'), 'horizon', '寄 -> horizon');
  same(Kifu.kanjiToMovement('引'), 'down',    '引 -> down');
  same(Kifu.kanjiToMovement('下'), 'down',    '下 -> down');
  same(Kifu.kanjiToMovement('行'), 'up',      '行 -> up');
  same(Kifu.kanjiToMovement('入'), 'up',      '入 -> up');
});

test('kanjiToInteger', 11, function() {
  same(Kifu.kanjiToInteger('一'),    1, '一   ->  1');
  same(Kifu.kanjiToInteger('二'),    2, '二   ->  2');
  same(Kifu.kanjiToInteger('三'),    3, '三   ->  3');
  same(Kifu.kanjiToInteger('四'),    4, '四   ->  4');
  same(Kifu.kanjiToInteger('五'),    5, '五   ->  5');
  same(Kifu.kanjiToInteger('六'),    6, '六   ->  6');
  same(Kifu.kanjiToInteger('七'),    7, '七   ->  7');
  same(Kifu.kanjiToInteger('八'),    8, '八   ->  8');
  same(Kifu.kanjiToInteger('九'),    9, '九   ->  9');
  same(Kifu.kanjiToInteger('十'),   10, '十   -> 10');
  same(Kifu.kanjiToInteger('十一'), 11, '十一 -> 11');
});

test('load', 2, function() {
  var source = document.getElementById('csa1').innerHTML;
  same(Kifu.load('csa1'), source, 'load by id');
  same(Kifu.load('foo bar baz'), 'foo bar baz', 'load by string');
});

test('movementToKanji', 6, function() {
  same(Kifu.movementToKanji('up'),      '上', 'up      -> 上');
  same(Kifu.movementToKanji('horizon'), '寄', 'horizon -> 寄');
  same(Kifu.movementToKanji('down'),    '引', 'down    -> 引');
  same(Kifu.movementToKanji('down'),    '引', 'down    -> 引');
  same(Kifu.movementToKanji('up'),      '上', 'up      -> 上');
  same(Kifu.movementToKanji('up'),      '上', 'up      -> 上');
});

test('movePieceToPiece', 16, function() {
  same(Kifu.movePieceToPiece('歩'),   'FU', '歩   -> FU');
  same(Kifu.movePieceToPiece('香'),   'KY', '香   -> KY');
  same(Kifu.movePieceToPiece('桂'),   'KE', '桂   -> KE');
  same(Kifu.movePieceToPiece('銀'),   'GI', '銀   -> GI');
  same(Kifu.movePieceToPiece('金'),   'KI', '金   -> KI');
  same(Kifu.movePieceToPiece('角'),   'KA', '角   -> KA');
  same(Kifu.movePieceToPiece('飛'),   'HI', '飛   -> HI');
  same(Kifu.movePieceToPiece('王'),   'OU', '王   -> OU');
  same(Kifu.movePieceToPiece('玉'),   'OU', '玉   -> OU');
  same(Kifu.movePieceToPiece('と'),   'TO', 'と   -> TO');
  same(Kifu.movePieceToPiece('成香'), 'NY', '成香 -> NY');
  same(Kifu.movePieceToPiece('成桂'), 'NK', '成桂 -> NK');
  same(Kifu.movePieceToPiece('成銀'), 'NG', '成銀 -> NG');
  same(Kifu.movePieceToPiece('馬'),   'UM', '馬   -> UM');
  same(Kifu.movePieceToPiece('龍'),   'RY', '龍   -> RY');
  same(Kifu.movePieceToPiece('竜'),   'RY', '竜   -> RY');
});

test('noConflict', 2, function() {
  same(typeof Kifu, 'function');
  var k = Kifu.noConflict();
  same(typeof Kifu, 'undefined');
  Kifu = k;
});

test('pieceToBoardPiece', 14, function() {
  same(Kifu.pieceToBoardPiece('FU'), '歩', 'FU -> 歩');
  same(Kifu.pieceToBoardPiece('KY'), '香', 'KY -> 香');
  same(Kifu.pieceToBoardPiece('KE'), '桂', 'KE -> 桂');
  same(Kifu.pieceToBoardPiece('GI'), '銀', 'GI -> 銀');
  same(Kifu.pieceToBoardPiece('KI'), '金', 'KI -> 金');
  same(Kifu.pieceToBoardPiece('KA'), '角', 'KA -> 角');
  same(Kifu.pieceToBoardPiece('HI'), '飛', 'HI -> 飛');
  same(Kifu.pieceToBoardPiece('OU'), '王', 'OU -> 王');
  same(Kifu.pieceToBoardPiece('TO'), 'と', 'TO -> と');
  same(Kifu.pieceToBoardPiece('NY'), '杏', 'NY -> 杏');
  same(Kifu.pieceToBoardPiece('NK'), '圭', 'NK -> 圭');
  same(Kifu.pieceToBoardPiece('NG'), '全', 'NG -> 全');
  same(Kifu.pieceToBoardPiece('UM'), '馬', 'UM -> 馬');
  same(Kifu.pieceToBoardPiece('RY'), '龍', 'RY -> 龍');
});

test('pieceToMovePiece', 14, function() {
  same(Kifu.pieceToMovePiece('FU'), '歩',   'FU -> 歩');
  same(Kifu.pieceToMovePiece('KY'), '香',   'KY -> 香');
  same(Kifu.pieceToMovePiece('KE'), '桂',   'KE -> 桂');
  same(Kifu.pieceToMovePiece('GI'), '銀',   'GI -> 銀');
  same(Kifu.pieceToMovePiece('KI'), '金',   'KI -> 金');
  same(Kifu.pieceToMovePiece('KA'), '角',   'KA -> 角');
  same(Kifu.pieceToMovePiece('HI'), '飛',   'HI -> 飛');
  same(Kifu.pieceToMovePiece('OU'), '王',   'OU -> 王');
  same(Kifu.pieceToMovePiece('TO'), 'と',   'TO -> と');
  same(Kifu.pieceToMovePiece('NY'), '成香', 'NY -> 成香');
  same(Kifu.pieceToMovePiece('NK'), '成桂', 'NK -> 成桂');
  same(Kifu.pieceToMovePiece('NG'), '成銀', 'NG -> 成銀');
  same(Kifu.pieceToMovePiece('UM'), '馬',   'UM -> 馬');
  same(Kifu.pieceToMovePiece('RY'), '龍',   'RY -> 龍');
});

test('zenkakuToInteger', 10, function() {
  same(Kifu.zenkakuToInteger('０'),  0, '０ -> 0');
  same(Kifu.zenkakuToInteger('１'),  1, '１ -> 1');
  same(Kifu.zenkakuToInteger('２'),  2, '２ -> 2');
  same(Kifu.zenkakuToInteger('３'),  3, '３ -> 3');
  same(Kifu.zenkakuToInteger('４'),  4, '４ -> 4');
  same(Kifu.zenkakuToInteger('５'),  5, '５ -> 5');
  same(Kifu.zenkakuToInteger('６'),  6, '６ -> 6');
  same(Kifu.zenkakuToInteger('７'),  7, '７ -> 7');
  same(Kifu.zenkakuToInteger('８'),  8, '８ -> 8');
  same(Kifu.zenkakuToInteger('９'),  9, '９ -> 9');
});

test('initialization', 9, function() {
  // simple initialization
  var kifu = Kifu();
  var info = {};
  same(kifu.suite_init, Kifu.Suite(), 'simple suite_init');
  same(kifu.info,       info,         'simple info');
  same(kifu.moves,      Kifu.Move(),  'simple moves');

  // initialization with source
  var source = 'V2.2';
  info.source = source;
  var kifu = Kifu(source);
  same(kifu.suite_init, Kifu.Suite(), 'source suite_init');
  same(kifu.info,       info,         'source info');
  same(kifu.moves,      Kifu.Move(),  'source moves');

  // initialization with source and format
  info.format       = 'csa';
  info.player_start = 'black';
  info.version      = '2.2';
  var kifu = Kifu(source, 'csa');
  same(kifu.suite_init, Kifu.Suite(), 'source suite_init');
  same(kifu.info,       info,         'source info');
  same(kifu.moves,      Kifu.Move(),  'source moves');
});

test('moveNext, movePrev', 31, function() {
  var kifu = Kifu('V2.2');
  kifu.suite_init.hirate();
  kifu.parse('csa');
  kifu.moves.addMove(
    {from: {x: 2, y: 7}, to: {x: 2, y: 6, piece: 'FU'}, is_black: true});
  kifu.moves.addMove(
    {from: {x: 3, y: 3}, to: {x: 3, y: 4, piece: 'FU'}, is_black: false});
  var is_black = kifu.is_black;
  var moves    = kifu.moves.clone();
  var step     = kifu.step;
  var suite    = kifu.suite.clone();

  // 1st move
  var move = moves.get(1);
  suite.move(move);
  is_black = false;
  step     = 1;
  same(kifu.moveNext(), move,     '1st move');
  same(kifu.is_black,   is_black, '1st black');
  same(kifu.moves,      moves,    '1st moves');
  same(kifu.step,       step,     '1st step');
  same(kifu.suite,      suite,    '1st suite');

  // 2nd move
  var move = moves.get(2);
  suite.move(move);
  is_black = true;
  step     = 2;
  same(kifu.moveNext(), move,     '2nd move');
  same(kifu.is_black,   is_black, '2nd black');
  same(kifu.moves,      moves,    '2nd moves');
  same(kifu.step,       step,     '2nd step');
  same(kifu.suite,      suite,    '2nd suite');

  // 3rd move
  var move = moves.get(3);
  same(move,            undefined, '3rd move undefined');
  same(kifu.moveNext(), move,      '3rd move');
  same(kifu.is_black,   is_black,  '3rd black');
  same(kifu.moves,      moves,     '3rd moves');
  same(kifu.step,       step,      '3rd step');
  same(kifu.suite,      suite,     '3rd suite');

  // 2nd prev
  var move = moves.get(2);
  suite.moveReverse(move);
  is_black = false;
  step     = 1;
  same(kifu.movePrev(), move,     '2nd perv move');
  same(kifu.is_black,   is_black, '2nd perv black');
  same(kifu.moves,      moves,    '2nd perv moves');
  same(kifu.step,       step,     '2nd perv step');
  same(kifu.suite,      suite,    '2nd perv suite');

  // 1st prev
  var move = moves.get(1);
  suite.moveReverse(move);
  is_black = true;
  step     = 0;
  same(kifu.movePrev(), move,     '1st perv move');
  same(kifu.is_black,   is_black, '1st perv black');
  same(kifu.moves,      moves,    '1st perv moves');
  same(kifu.step,       step,     '1st perv step');
  same(kifu.suite,      suite,    '1st perv suite');

  // init prev
  var move = moves.get(0);
  same(kifu.movePrev(), move,     'init perv move');
  same(kifu.is_black,   is_black, 'init perv black');
  same(kifu.moves,      moves,    'init perv moves');
  same(kifu.step,       step,     'init perv step');
  same(kifu.suite,      suite,    'init perv suite');
});

test('parse', 7, function() {
  var info  = {
    format: 'csa', player_start: 'black', source: 'V2.2', version: '2.2'};
  var kifu  = Kifu('V2.2');
  var moves = Kifu.Move();
  var suite = Kifu.Suite();
  ok(kifu.parse('csa'), 'parse');
  same(kifu.is_black,   true,  'is_black');
  same(kifu.info,       info,  'info');
  same(kifu.moves,      moves, 'moves');
  same(kifu.step,       0,     'step');
  same(kifu.suite,      suite, 'suite');
  same(kifu.suite_init, suite, 'suite_init');
});

test('source', 5, function() {
  var kifu = Kifu();

  same(kifu.source(), undefined, 'first status');

  // string
  var source = 'V2.2';
  same(kifu.source(source), source, source);
  same(kifu.source(), source, source);

  // document id
  var source = document.getElementById('csa1').innerHTML;
  same(kifu.source('csa1'), source, source);
  same(kifu.source(), source, source);
});

test('_prepare', 10, function() {
  var kifu  = Kifu();
  var moves = Kifu.Move();
  kifu.suite_init.hirate();

  // ７六歩
  kifu.moves.addMove({to: {x: 7, y: 6, piece: 'FU'}});
  moves.addMove({
    from: {x: 7, y: 7, piece: 'FU'}, to: {x: 7, y: 6, piece: 'FU'},
    direction: false, movement: false, put: false,
    is_black: true, is_same_place: false, str: '７六歩'});
  ok(kifu._prepare(), '_prepare');
  same(kifu.moves, moves, '７六歩');

  // ３四歩
  kifu.moves.addMove({to: {x: 3, y: 4, piece: 'FU'}});
  moves.addMove({
    from: {x: 3, y: 3, piece: 'FU'}, to: {x: 3, y: 4, piece: 'FU'},
    direction: false, movement: false, put: false,
    is_black: false, is_same_place: false, str: '３四歩'});
  ok(kifu._prepare(), '_prepare');
  same(kifu.moves, moves, '３四歩');

  // ２二角成
  kifu.moves.addMove({from: {piece: 'KA'}, to: {x: 2, y: 2, piece: 'UM'}});
  moves.addMove({
    from: {x: 8, y: 8, piece: 'KA'}, to: {x: 2, y: 2, piece: 'UM'},
    stand: {piece: 'KA', stand: 'KA'},
    direction: false, movement: false, put: false,
    is_black: true, is_same_place: false, str: '２二角成'});
  ok(kifu._prepare(), '_prepare');
  same(kifu.moves, moves, '２二角成');

  // 同銀
  kifu.moves.addMove({to: {x: 0, y: 0, piece: 'GI'}});
  moves.addMove({
    from: {x: 3, y: 1, piece: 'GI'}, to: {x: 2, y: 2, piece: 'GI'},
    stand: {piece: 'UM', stand: 'KA'},
    direction: false, movement: false, put: false,
    is_black: false, is_same_place: true, str: '同銀'});
  ok(kifu._prepare(), '_prepare');
  same(kifu.moves, moves, '同銀');

  // ５五角
  kifu.moves.addMove({to: {x: 5, y: 5, piece: 'KA'}});
  moves.addMove({
    from: {x: 0, y: 0, piece: 'KA'}, to: {x: 5, y: 5, piece: 'KA'},
    direction: false, movement: false, put: false,
    is_black: true, is_same_place: false, str: '５五角'});
  ok(kifu._prepare(), '_prepare');
  same(kifu.moves, moves, '５五角');
});


})();

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2: */
