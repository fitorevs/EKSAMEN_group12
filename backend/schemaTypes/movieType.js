//SchemaType for film, har basis egenskaper til en film (navn, bilde url, imdb url) 
//+ referanse til sjangere som array, det gir mulighet å vise alle sjangere filmen har direkte i Sanity client
export const movieType = {
  name: 'film',
  title: 'Film',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Navn',
      type: 'string',
    },
    {
      name: 'coverURL',
      title: 'BildeUrl',
      type: 'string',
    },
    {
      name: 'IMDBURL',
      title: 'IMDB',
      type: 'string',
    },
    {
      name: 'genres',
      title: 'Sjangere',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'genre'}]
        }
      ]
    }
  ]
}