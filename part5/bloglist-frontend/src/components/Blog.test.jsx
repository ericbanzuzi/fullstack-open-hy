import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { expect } from 'chai'

describe('<Blog />', () => {
  let container

  const removeBlog = vi.fn()
  const updateBlog = vi.fn()
  const blog = {
    'url': 'https://medium.com/datatau/hadoop-with-python-pyspark-a65a6f97ddf2',
    'title': 'Hadoop with Python (I): PySpark',
    'author': 'David Adrián Cañones',
    'likes': 0,
    'user': { 'name': 'Eric' }
  }

  beforeEach(() => {
    container = render(<Blog blog={blog} removeBlog={removeBlog} updateBlog={updateBlog} />).container
  })

  test('at start only title and author are displayed', () => {
    const div = container.querySelector('.defaultBlog')
    const headerDiv = div.querySelector('.header')

    expect(headerDiv).toBeInTheDocument()
    expect(headerDiv).toHaveTextContent(blog.title)
    expect(headerDiv).toHaveTextContent(blog.author)

    expect(container.querySelector('.url')).not.toBeInTheDocument()
    expect(container.querySelector('.likes')).not.toBeInTheDocument()
  })


  test('after clicking the button, full content is displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('View')
    await user.click(button)

    const div = container.querySelector('.extendedBlog')
    const headerDiv = div.querySelector('.header')
    const urlDiv = div.querySelector('.url')
    const likesDiv = div.querySelector('.likes')

    expect(headerDiv).toBeInTheDocument()
    expect(urlDiv).toBeInTheDocument()
    expect(likesDiv).toBeInTheDocument()

    expect(headerDiv).toHaveTextContent(blog.title)
    expect(headerDiv).toHaveTextContent(blog.author)

    expect(likesDiv).toHaveTextContent(blog.likes)
    expect(urlDiv).toHaveTextContent(blog.url)
  })

  test('pressing like twice calls onSubmit', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('View')
    await user.click(button)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(updateBlog.mock.calls).toHaveLength(2)
  })

})