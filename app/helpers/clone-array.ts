export const clonedArray = <T>(a: T[]) =>
  a.map((a) => {
    return { ...a }
  })
