module.exports = grammar({
  name: 'trading_dsl',

  rules: {
    source_file: $ => repeat(choice(
      $.strategy_definition,
      $.parameter_definition,
      $.metadata_definition,
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

    metadata_definition: $ => seq(
      choice('NAME', 'TYPE'),
      field('value', $.string)
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