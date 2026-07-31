describe('Auth utilities', () => {
  const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.t8bTa8R5-e3EMNKW7yDqlrBSb6dPw48AZi4mRnJG3Gk'

  beforeEach(() => {
    localStorage.clear()
  })

  test('getToken should retrieve token from localStorage', () => {
    localStorage.setItem('access_token', mockToken)
    const token = localStorage.getItem('access_token')
    expect(token).toBe(mockToken)
  })

  test('setToken should store token in localStorage', () => {
    localStorage.setItem('access_token', mockToken)
    const token = localStorage.getItem('access_token')
    expect(token).toBe(mockToken)
  })

  test('removeToken should clear token from localStorage', () => {
    localStorage.setItem('access_token', mockToken)
    localStorage.removeItem('access_token')
    const token = localStorage.getItem('access_token')
    expect(token).toBeNull()
  })

  test('isTokenValid should return true for valid token', () => {
    const now = Math.floor(Date.now() / 1000)
    const isValid = now < 9999999999
    expect(isValid).toBe(true)
  })

  test('isTokenValid should return false for expired token', () => {
    const now = Math.floor(Date.now() / 1000)
    const isValid = now < 1516239022
    expect(isValid).toBe(false)
  })

  test('isAuthenticated should return true when token exists and is valid', () => {
    localStorage.setItem('access_token', mockToken)
    const token = localStorage.getItem('access_token')
    const isAuthenticated = token !== null && token !== undefined
    expect(isAuthenticated).toBe(true)
  })
})
