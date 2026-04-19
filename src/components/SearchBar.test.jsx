import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchBar } from './SearchBar'

describe('SearchBar', () => {
  it('renders search input', () => {
    render(<SearchBar value="" onChange={() => {}} />)
    expect(screen.getByRole('textbox', { name: /search/i })).toBeInTheDocument()
  })

  it('displays current value', () => {
    render(<SearchBar value="pikachu" onChange={() => {}} />)
    expect(screen.getByDisplayValue('pikachu')).toBeInTheDocument()
  })

  it('calls onChange when user types', async () => {
    const handleChange = vi.fn()
    render(<SearchBar value="" onChange={handleChange} />)
    await userEvent.type(screen.getByRole('textbox'), 'char')
    expect(handleChange).toHaveBeenCalled()
  })
})