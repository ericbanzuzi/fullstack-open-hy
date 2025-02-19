import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> calls the event handler it received as props with the right details when a new blog is created', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const inputs = screen.getAllByRole('textbox')

  await user.type(inputs[0], 'This is a test title')
  await user.type(inputs[1], 'Eric Banzuzi')
  await user.type(inputs[2], 'https://testurl.com')

  const sendButton = screen.getByText('create')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('This is a test title')
  expect(createBlog.mock.calls[0][0].author).toBe('Eric Banzuzi')
  expect(createBlog.mock.calls[0][0].url).toBe('https://testurl.com')
})