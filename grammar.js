module.exports = grammar({
  name: 'trading_dsl',

  extras: $ => [
    /[\s\f\uFEFF\u2060\u200B]/,
    $.comment
  ],

  rules: {
    source_file: $ => repeat($._top_level_item),

    _top_level_item: $ => choice(
      $.strategy_declaration,
      $._statement
    ),

    strategy_declaration: $ => seq(
      'strategy',
      $.identifier,
      $.block
    ),

    block: $ => seq(
      '{',
      repeat($._statement),
      '}'
    ),

    _statement: $ => choice(
      $.assignment_statement,
      $.buy_statement,
      $.sell_statement,
      $.param_statement,
      $.name_statement,
      $.type_statement
    ),

    name_statement: $ => seq(
      'NAME',
      $.string
    ),

    type_statement: $ => seq(
      'TYPE',
      $.string
    ),

    param_statement: $ => seq(
      'PARAM',
      commaSep1($.param_assignment)
    ),

    param_assignment: $ => seq(
      $.identifier,
      '=',
      $.expression
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
      $.logical_expression,
      $.comparison_expression,
      $.additive_expression,
      $.multiplicative_expression,
      $.unary_expression,
      $.function_call,
      $.parenthesized_expression,
      $.price_variable,
      $.identifier,
      $.number,
      $.string
    ),

    parenthesized_expression: $ => seq(
      '(',
      $.expression,
      ')'
    ),

    unary_expression: $ => prec.left(5, seq(
      choice('-', 'not'),
      $.expression
    )),

    multiplicative_expression: $ => prec.left(4, seq(
      $.expression,
      choice('*', '/'),
      $.expression
    )),

    additive_expression: $ => prec.left(3, seq(
      $.expression,
      choice('+', '-'),
      $.expression
    )),

    comparison_expression: $ => prec.left(2, seq(
      $.expression,
      choice('<', '>', '<=', '>=', '==', '!='),
      $.expression
    )),

    logical_expression: $ => prec.left(1, seq(
      $.expression,
      choice('and', 'or'),
      $.expression
    )),

    function_call: $ => seq(
      $.identifier,
      '(',
      optional(commaSep1($.expression)),
      ')'
    ),

    price_variable: $ => choice('C', 'O', 'H', 'L', 'V'),

    identifier: $ => /[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*)*/,

    number: $ => /\d+(\.\d+)?/,

    string: $ => /"([^"\\]|\\.)*"/,

    comment: $ => token(choice(
      seq('//', /[^\n]*/),
      seq('#', /[^\n]*/),
      seq(
        '/*',
        repeat(choice(/[^*]/, /\*[^/]/)),
        '*/'
      )
    ))
  }
});

function commaSep(rule) {
  return optional(commaSep1(rule));
}

function commaSep1(rule) {
  return seq(rule, repeat(seq(',', rule)));
}