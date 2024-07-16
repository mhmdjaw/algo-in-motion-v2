export const switchCase =
  <S>({
    cases,
    defaultCase
  }: {
    cases: { [Property in keyof S]: () => unknown }
    defaultCase?: () => unknown
  }) =>
  <T>(expression: keyof S | (string & NonNullable<unknown>)): T =>
    (cases[expression as keyof S] || defaultCase)() as T
