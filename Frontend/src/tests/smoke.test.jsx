// smoke tests: verifies critical app shell renders safely.
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import ErrorBoundary from '../components/ErrorBoundary'

describe('app shell smoke checks', () => {
  it('renders children inside the error boundary shell', () => {
    render(
      <ErrorBoundary>
        <div>App content ready</div>
      </ErrorBoundary>
    )

    expect(screen.getByText('App content ready')).toBeInTheDocument()
  })
})
