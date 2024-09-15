# µExpress

The Ultimate Express. Fastest http server with full Express compatibility, based on µWebSockets.

This library is a re-implementation of Express.js.
It is designed to be a drop-in replacement for Express.js, with the same API and functionality, while being much faster. It is not a fork of Express.js.

## Differences

- `case sensitive routing` is enabled by default.

## Performance tips

µExpress tries to optimize routing as much as possible, but it's only possible if:
- `case sensitive routing` is enabled (it is by default, unlike in normal Express).
- only string paths without regex characters like *, +, (), {}, :param, etc. can be optimized.

Optimized routes can be up to 10 times faster than normal routes, as they're using native uWS router.

## Compatibility

### express

- ✅ express()
- ✅ express.Router()
- ❌ SSL
- ❌ express.json()
- ❌ express.urlencoded()
- ❌ express.static()
- ❌ express.text()
- ❌ express.raw()

### Application

- ✅ app.listen()
- ✅ app.METHOD() (app.get, app.post, etc.)
- ✅ app.route()
- ✅ app.all()
- ✅ app.use()
- ✅ app.mountpath
- ✅ app.set()
- ✅ app.get()
- ✅ app.enable()
- ✅ app.disable()
- ✅ app.enabled()
- ✅ app.disabled()
- ✅ app.path()
- ⚠️ app.param() (deprecated `app.param(callback)` is not supported)
- ❌ app.engine()
- ❌ app.render()
- ❌ app.locals
- ✅ app.settings
- ❌ app.engines
- ❌ app.on("mount")

### Application settings

- ✅ case sensitive routing
- ✅ env
- ❌ etag
- ✅ jsonp callback name
- ✅ json escape
- ✅ json replacer
- ✅ json spaces
- ✅ query parser
- ❌ strict routing
- ❌ subdomain offset
- ❌ trust proxy
- ❌ views
- ❌ view cache
- ❌ view engine
- ❌ x-powered-by

### Request
- ✅ req.app
- ⚠️ req.baseUrl (`.use` is treated as `.all` when not a router)
- ❌ req.body
- ❌ req.cookies
- ❌ req.fresh
- ✅ req.hostname
- ✅ req.headers
- ✅ req.headersDistinct
- ✅ req.rawHeaders
- ✅ req.ip
- ❌ req.ips
- ✅ req.method
- ✅ req.url
- ✅ req.originalUrl
- ✅ req.params
- ✅ req.path
- ✅ req.protocol
- ✅ req.query
- ✅ req.res
- ⚠️ req.route (route impl. differs from express)
- ✅ req.secure
- ❌ req.signedCookies
- ❌ req.stale
- ✅ req.subdomains
- ✅ req.xhr
- ⚠️ req.connection, req.socket (only `remoteAddress`, `localPort` and `remotePort` are supported)
- ✅ req.accepts()
- ✅ req.acceptsCharsets()
- ✅ req.acceptsEncodings()
- ✅ req.acceptsLanguages()
- ✅ req.get()
- ✅ req.is()
- ✅ req.param()
- ✅ req.range()

### Response

- ✅ res.app
- ✅ res.headersSent
- ✅ res.req
- ❌ res.locals
- ✅ res.append()
- ✅ res.attachment()
- ✅ res.cookie()
- ✅ res.clearCookie()
- ✅ res.download()
- ✅ res.end()
- ✅ res.format()
- ✅ res.getHeader(), res.get()
- ✅ res.json()
- ✅ res.jsonp()
- ✅ res.links()
- ✅ res.location()
- ✅ res.redirect()
- ❌ res.render()
- ✅ res.send()
- ✅ piping to res
- ⚠️ res.sendFile() (`options` not supported yet)
- ✅ res.sendStatus()
- ✅ res.header(), res.setHeader(), res.set()
- ✅ res.status()
- ✅ res.type()
- ✅ res.vary()
- ✅ res.removeHeader()
- ✅ res.write()

### Router

- ✅ router.all()
- ✅ router.METHOD() (router.get, router.post, etc.)
- ✅ router.route()
- ✅ router.use()
- ⚠️ router.param() (deprecated `router.param(callback)` is not supported)
