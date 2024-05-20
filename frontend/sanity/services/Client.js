import { createClient } from '@sanity/client'

//Sanity client med env kodet id og token, api version samme som i undervisning
export const readClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: 'production',
  useCdn: false,
  apiVersion: '2022-03-07',
})

export const writeClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: 'production',
  useCdn: false,
  apiVersion: '2022-03-07',
  token: process.env.SANITY_USER_TOKEN
})