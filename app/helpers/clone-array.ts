export const cloneArray = <T>(a: T[]) =>
  a.map((a) => {
    return { ...a }
  })
