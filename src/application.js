import uWS from 'uWebSockets.js';
import Response from './response.js';
import Request from './request.js';
import Router from './router.js';
import { removeDuplicateSlashes, defaultSettings, compileTrust } from './utils.js';
import querystring from 'querystring';
import qs from 'qs';

class Application extends Router {
    constructor(settings = {}) {
        super(settings);
        if(!settings?.uwsOptions) {
            settings.uwsOptions = {};
        }
        if(settings.uwsOptions.key_file_name && settings.uwsOptions.cert_file_name) {
            this.uwsApp = uWS.SSLApp(settings.uwsOptions);
            this.ssl = true;
        } else {
            this.uwsApp = uWS.App(settings.uwsOptions);
            this.ssl = false;
        }
        this.engines = {};
        this.port = undefined;
        for(const key in defaultSettings) {
            if(!this.settings[key]) {
                if(typeof defaultSettings[key] === 'function') {
                    this.settings[key] = defaultSettings[key]();
                } else {
                    this.settings[key] = defaultSettings[key];
                }
            }
        }
    }

    set(key, value) {
        if(key === 'trust proxy') {
            if(!value) {
                delete this.settings['trust proxy fn'];
            } else {
                this.settings['trust proxy fn'] = compileTrust(value);
            }
        } else if(key === 'query parser') {
            if(value === 'extended') {
                this.settings['query parser fn'] = qs.parse;
            } else if(value === 'simple') {
                this.settings['query parser fn'] = querystring.parse;
            } else if(typeof value === 'function') {
                this.settings['query parser fn'] = value;
            } else {
                this.settings['query parser fn'] = undefined;
            }
        }

        this.settings[key] = value;
        return this;
    }

    enable(key) {
        this.settings[key] = true;
        return this;
    }

    disable(key) {
        this.settings[key] = false;
        return this;
    }

    enabled(key) {
        return !!this.settings[key];
    }

    disabled(key) {
        return !this.settings[key];
    }

    #createRequestHandler() {
        this.uwsApp.any('/*', async (res, req) => {

            const request = new Request(req, res, this);
            const response = new Response(res, req, this);
            request.res = response;
            response.req = request;
            res.onAborted(() => {
                const err = new Error('Request aborted');
                err.code = 'ECONNABORTED';
                response.aborted = true;
                response.socket.emit('error', err);
            });

            let matchedRoute = await this._routeRequest(request, response);

            if(!matchedRoute && !res.aborted && !response.headersSent) {
                response.status(404);
                response.send(this._generateErrorPage(`Cannot ${request.method} ${request.path}`));
            }
        });
    }

    listen(port, callback) {
        this.#createRequestHandler();
        if(!callback && typeof port === 'function') {
            callback = port;
            port = 0;
        }
        this.uwsApp.listen(port, socket => {
            this.port = uWS.us_socket_local_port(socket);
            if(!socket) {
                let err = new Error('EADDRINUSE: address already in use ' + this.port);
                err.code = 'EADDRINUSE';
                throw err;
            }
            callback(this.port);
        });
    }

    address() {
        return { port: this.port };
    }

    path() {
        let paths = [this.mountpath];
        let parent = this.parent;
        while(parent) {
            paths.unshift(parent.mountpath);
            parent = parent.parent;
        }
        let path = removeDuplicateSlashes(paths.join(''));
        return path === '/' ? '' : path;
    }

    engine(ext, fn) {
        if (typeof fn !== 'function') {
            throw new Error('callback function required');
        }
        const extension = ext[0] !== '.'
            ? '.' + ext
            : ext;
        this.engines[extension] = fn;
        return this;
    }
}

export default function(options) {
    return new Application(options);
}