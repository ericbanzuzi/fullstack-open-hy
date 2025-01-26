const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }
  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const reducer = (favorite, blog) => {
    return favorite.likes > blog.likes
      ? favorite
      : blog
  }

  const blog = blogs.reduce(reducer, blogs[0])
  return {
    title: blog.title,
    author: blog.author,
    likes: blog.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const authorReducer = (authors, blog) => {
    if (authors[blog.author]) {
      authors[blog.author]++
    } else {
      authors[blog.author] = 1
    }
    return authors
  }

  const authors = blogs.reduce(authorReducer, {})
  const authorBlogs = Object.keys(authors).map(author => {
    return {
      author,
      blogs: authors[author]
    }
  })

  const authorBlogreducer = (mostCommonAuthor, author) => {
    return mostCommonAuthor.blogs > author.blogs
      ? mostCommonAuthor
      : author
  }
  return authorBlogs.reduce(authorBlogreducer, authorBlogs[0])
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const authorReducer = (authors, blog) => {
    if (authors[blog.author]) {
      authors[blog.author] += blog.likes
    } else {
      authors[blog.author] = blog.likes
    }
    return authors
  }

  const authors = blogs.reduce(authorReducer, {})
  const authorLikes = Object.keys(authors).map(author => {
    return {
      author,
      likes: authors[author]
    }
  })

  const authorLikesReducer = (mostLikedAuthor, author) => {
    return mostLikedAuthor.likes > author.likes
      ? mostLikedAuthor
      : author
  }
  return authorLikes.reduce(authorLikesReducer, authorLikes[0])
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}