module.exports = grammar({
  name: 'trading_dsl',

  rules: {
    source_file: $ => repeat(choice(
      $.strategy_definition,
      $.parameter_definition,
      $.metadata_statement,
      $.comment
    )),

    strategy_definition: $ => seq(
      'strategy',
      field('name', $.identifier),
      '{',
      repeat($.assignment),
      '}'
    ),

    parameter_definition: $ => seq(
      $.param_keyword,
      field('name', $.identifier),
      '=',
      field('value', choice($.number, $.string))
    ),

    metadata_statement: $ => seq(
      choice(
        seq($.name_keyword, field('value', $.string)),
        seq($.type_keyword, field('value', $.string)),
        seq($.buy_keyword, field('condition', $.expression)),
        seq($.sell_keyword, field('condition', $.expression)),
        seq($.rebalance_keyword, field('condition', $.expression)),
        $.selection_keyword,
        $.allocation_keyword
      )
    ),

    assignment: $ => seq(
      field('left', $.identifier),
      '=',
      field('right', $.expression)
    ),

    expression: $ => choice(
      $.function_call,
      $.identifier,
      $.number,
      $.string
    ),

    function_call: $ => seq(
      field('function', $.identifier),
      '.',
      field('method', $.identifier),
      '(',
      commaSep($.number),
      ')'
    ),

    identifier: $ => /[A-Za-z_][A-Za-z0-9_]*/,

    number: $ => /\d+/,

    string: $ => /"[^"]*"/,

    // Keyword definitions for TradingDSL
    param_keyword: $ => 'PARAM',
    name_keyword: $ => 'NAME',
    type_keyword: $ => 'TYPE',
    buy_keyword: $ => 'BUY',
    sell_keyword: $ => 'SELL',
    rebalance_keyword: $ => 'REBALANCE',
    selection_keyword: $ => 'SELECTION',
    allocation_keyword: $ => 'ALLOCATION',

    comment: $ => choice(
      seq('//', /.*/),
      seq('#', /.*/)
    )
  }
});

function commaSep(rule) {
  return optional(commaSep1(rule));
}

function commaSep1(rule) {
  return seq(rule, repeat(seq(',', rule)));
}