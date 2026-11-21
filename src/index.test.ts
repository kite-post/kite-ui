import { describe, expect, it } from 'vitest'

import { brand, version } from './index'

describe('@kite-post/ui', () => {
  it('експортує версію пакета', () => {
    expect(version).toMatch(/^\d+\.\d+\.\d+/)
  })

  it('коралова — головний колір бренду (1.3)', () => {
    expect(brand.coral).toBe('#FF5A36')
  })
})
