// src/lib/queries.js
export const QUERY_POSTS = /* groq */ `
*[_type in ["post","externalPost"]] | order(publishedAt desc)[0...60]{
  _id,
  _type,
  title,
  // slug jadi string untuk keduanya
  "slug": coalesce(slug.current, slug),
  publishedAt,
  excerpt,

  // kembalikan array string kategori untuk 2 tipe
  "catTitles": select(
    _type == "externalPost" => categories,
    categories[]->title
  ),

  // cover: externalPost pakai imageUrl, post pakai asset url
  "coverUrl": coalesce(imageUrl, mainImage.asset->url),
  mainImage,

  // external source url (null untuk post biasa)
  "externalUrl": select(_type == "externalPost" => url, null)
}
`;

export const QUERY_POST_BY_SLUG = /* groq */ `
*[
  (_type=="post" && slug.current==$slug) ||
  (_type=="externalPost" && slug.current==$slug)
][0]{
  _id,
  _type,
  title,
  "slug": coalesce(slug.current, slug),
  publishedAt,
  excerpt,
  body,
  mainImage,
  "catTitles": select(
    _type == "externalPost" => categories,
    categories[]->title
  ),
  "coverUrl": coalesce(imageUrl, mainImage.asset->url),
  "externalUrl": select(_type == "externalPost" => url, null),
  author->{name}
}
`;
