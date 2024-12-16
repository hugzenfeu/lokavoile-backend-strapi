// marche pas je sais pas pourquoi??

import { Middleware } from 'koa';

interface CacheControlConfig {
    maxAge: number;
}

const setCacheControl = (config: CacheControlConfig): Middleware => {
    return async (ctx, next) => {
        await next();

        console.log('Before setting header:', ctx.response.headers);

        if (ctx.request.url.startsWith('/uploads/')) {
            ctx.set('Cache-Control', `public, max-age=${config.maxAge}, immutable`);
        }

        console.log('After setting header:', ctx.response.headers);
    };
};

export default setCacheControl;
