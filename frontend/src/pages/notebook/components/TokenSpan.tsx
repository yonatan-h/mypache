import { Token, TokenType } from "./tokenize";

export default function TokenSpan({ token }: { token: Token }) {
  return (
    <span
      className={`
        whitespace-pre-wrap
        ${token.tt === TokenType.Number ? "text-[#008000]" : ""}
        ${token.tt === TokenType.String ? "text-[#BA2121]" : ""}
        ${token.tt === TokenType.Comment ? "text-[#408080] italic" : ""}
        ${token.tt === TokenType.Keyword ? "text-[#008229] font-bold" : ""}
        ${token.tt === TokenType.Invalid ? "text-red-500" : ""}
        ${token.tt === TokenType.Equal ? "text-[#AA22FF]" : ""}
        ${token.tt === TokenType.Operator ? "text-[#AA22FF] font-bold" : ""}

    `}
    >
      {token.val}
    </span>
  );
}
