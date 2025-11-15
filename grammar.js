module.exports = grammar({
  name: 'trading_dsl',

  externals: $ => [],

  extras: $ => [/[\s\f\uFEFF\u2060\u200B]/, ','],

  rules: {
    source_file: $ => repeat(choice(
      $.name_statement,
      $.param_statement,
      $.assignment_statement,
      $.buy_statement,
      $.sell_statement,
      $.comment
    )),

    name_statement: $ => seq(
      'NAME',
      $.string
    ),

    param_statement: $ => seq(
      'PARAM',
      commaSep1($.param_definition)
    ),

    param_definition: $ => seq(
      $.identifier,
      '=',
      $.number
    ),

    assignment_statement: $ => seq(
      $.identifier,
      ':=',
      $.expression
    ),

    buy_statement: $ => seq(
      'BUY',
      ':',
      $.expression
    ),

    sell_statement: $ => seq(
      'SELL',
      ':',
      $.expression
    ),

    expression: $ => choice(
      $.function_call,
      $.identifier,
      $.number,
      $.string,
      $.price_variable,
      $.logical_expression,
      $.comparison_expression,
      $.not_expression
    ),

    not_expression: $ => seq(
      'not',
      $.expression
    ),

    function_call: $ => seq(
      $.identifier,
      '(',
      commaSep1($.expression),
      ')'
    ),

    logical_expression: $ => prec.left(2, seq(
      $.expression,
      choice('and', 'or', 'not'),
      $.expression
    )),

    comparison_expression: $ => prec.left(3, seq(
      $.expression,
      choice('<', '>', '<=', '>=', '==', '!='),
      $.expression
    )),

    price_variable: $ => choice('C', 'O', 'H', 'L', 'V'),

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