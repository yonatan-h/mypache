export enum TokenType {
  Comment = "com",
  Number = "num",
  Equal = "eq",
  Operator = "o",
  Space = "space",
  LeftParen = "(", //left parentises
  RightParen = ")", //right parentises
  Invalid = "invalid", //invalid or unhandled
  Symbol = "symbol",
  String = "String",
  Keyword = "Keyword",
}

interface BaseToken {
  tt: TokenType;
  val: string;
}

export interface ComT extends BaseToken {
  tt: TokenType.Comment;
}

export interface NumT extends BaseToken {
  tt: TokenType.Number;
}

export interface EqT extends BaseToken {
  tt: TokenType.Equal;
}

const operators = ["+", "-", "*", "/"];

export interface OperatorToken extends BaseToken {
  tt: TokenType.Operator;
}

export interface SpaceToken extends BaseToken {
  tt: TokenType.Space;
}

export interface LeftParenToken extends BaseToken {
  tt: TokenType.LeftParen;
}
export interface RightParenToken extends BaseToken {
  tt: TokenType.RightParen;
}

export interface InvalidToken extends BaseToken {
  tt: TokenType.Invalid;
}

export interface SymbolToken extends BaseToken {
  tt: TokenType.Symbol;
}

export interface StringToken extends BaseToken {
  tt: TokenType.String;
}

//python keywords
const keywords = [
  "if",
  "else",
  "elif",
  "for",
  "while",
  "def",
  "class",
  "import",
  "from",
];
export interface KeywordToken extends BaseToken {
  tt: TokenType.Keyword;
}

//for if else typescript support
export type Token =
  | ComT
  | NumT
  | EqT
  | OperatorToken
  | SpaceToken
  | InvalidToken
  | LeftParenToken
  | RightParenToken
  | SymbolToken
  | StringToken
  | KeywordToken;

type Matcher = (t: string) => { skip: number; token: Token } | undefined;
const matchers: Matcher[] = [
  //equal
  (t) => {
    if (t[0] === "=")
      return { token: { tt: TokenType.Equal, val: "=" }, skip: 1 };
  },

  //numbers, decimals
  (t) => {
    const res = t.match(/^-?(\d+)+(\.\d+)?/)?.[0];
    if (res) {
      const val = res;
      return { skip: res.length, token: { tt: TokenType.Number, val } };
    }
  },

  //operators
  (t) => {
    if (operators.includes(t[0]))
      return {
        skip: 1,
        token: { tt: TokenType.Operator, val: t[0] },
      };
  },

  //Ps
  (t) => {
    if (t[0] === "(")
      return { skip: 1, token: { tt: TokenType.LeftParen, val: "(" } };
    else if (t[0] === ")")
      return { skip: 1, token: { tt: TokenType.RightParen, val: ")" } };
  },

  //space and new lines
  (t) => {
    const res = t.match(/^\s+/)?.[0];
    if (res)
      return {
        skip: res.length,
        token: { tt: TokenType.Space, val: res },
      };
  },

  //strings
  (t) => {
    const res1 = t.match(/^"[^"]*"/)?.[0];
    const res2 = t.match(/^'[^']*'/)?.[0];
    const res = res1 || res2;
    if (res) {
      return { token: { tt: TokenType.String, val: res }, skip: res.length };
    }
  },

  //comments
  (t) => {
    const res = t.match(/^\#.*\n/)?.[0];
    if (res)
      return { token: { tt: TokenType.Comment, val: res }, skip: res.length };
  },

  //symbols, keywords
  (t) => {
    //try upto next space
    const res = t.match(/^[^\s^\(^\^'^")]+/)?.[0];
    if (!res) return;

    if (keywords.includes(res)) {
      return { skip: res.length, token: { tt: TokenType.Keyword, val: res } };
    } else {
      return { skip: res.length, token: { tt: TokenType.Symbol, val: res } };
    }
  },

  //invalid tokens
  (t) => {
    //try upto next space
    const res = t.match(/^[^\s]+\s/)?.[0];
    if (res) {
      return { skip: res.length, token: { tt: TokenType.Invalid, val: res } };
    } else {
      return { skip: t.length, token: { tt: TokenType.Invalid, val: t } };
    }
  },
];

export function tokenize(text: string) {
  const tokens: Token[] = [];
  while (text) {
    let hasMatched = false;
    for (const matcher of matchers) {
      const res = matcher(text);
      if (res) {
        text = text.slice(res.skip);
        tokens.push(res.token);
        hasMatched = true;
        break;
      }
    }
    if (!hasMatched) {
      throw new Error(`'${text}' could'nt be matched with any token!`);
    }
  }

  return tokens;
}
