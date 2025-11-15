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
      'PARAM',
      field('name', $.identifier),
      '=',
      field('value', choice($.number, $.string))
    ),

    metadata_statement: $ => seq(
      choice(
        seq('NAME', field('value', $.string)),
        seq('TYPE', field('value', $.string)),
        seq('BUY', field('condition', $.expression)),
        seq('SELL', field('condition', $.expression)),
        seq('REBALANCE', field('condition', $.expression)),
        'SELECTION',
        'ALLOCATION'
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