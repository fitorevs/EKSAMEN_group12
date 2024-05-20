//SchemaType for en bruker, har basis egenskaper til en bruker (navn, e-post, passord) 
//+ referanser til favoritte/øsnket filmer og favoritte sjangere som array, det gir mulighet å vise alle greiene under bruker felt direkte i Sanity client
export const userType = {
  name: 'user',
  title: 'Bruker',
  type: 'document',
  fields: [
    {
      name: 'username',
      title: 'Bruker',
      type: 'string',
    },
    {
      name: 'email',
      title: 'E-post',
      type: 'string',
    },
    {
      name: 'password',
      title: 'Passord',
      type: 'string',
    },
    {
      name: 'favMovies',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'film'}]
        }
      ]
    },
    {
      name: 'wishedMovies',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'film'}]
        }
      ]
    },
    {
      name: 'favGenres',
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