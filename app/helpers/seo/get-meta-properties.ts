export const getMetaProperties = ({
  title,
  description,
  pathname,
  type = 'website'
}: {
  title?: string
  description: string
  pathname: string
  type?: 'website' | 'article'
}) => {
  return [
    {
      title: title ? `${title} | Algo in Motion` : 'Algo in Motion'
    },
    {
      property: 'og:title',
      content: title ?? 'Algo in Motion'
    },
    {
      name: 'twitter:title',
      content: title ?? 'Algo in Motion'
    },
    {
      name: 'description',
      content: description
    },
    {
      property: 'og:description',
      content: description
    },
    {
      name: 'twitter:description',
      content: description
    },
    {
      property: 'og:url',
      content: `https://algoinmotion.xyz${pathname}`
    },
    {
      property: 'og:type',
      content: type
    }
  ]
}
