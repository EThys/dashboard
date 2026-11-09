export default defineEventHandler((event) => {
  setHeader(event, 'Content-Type', 'application/json')
  return {
    applinks: {
      apps: [],
      details: [
        {
          appID: '869X37PW2M.com.casa.casa.casa',
          paths: ['/open/*', '/open/*/*'],
        },
      ],
    },
  }
})