interface CacheItem {
    expireTime: EpochTimeStamp,
    value: any
}

class MemoryCache {
    cache: Map<string, CacheItem>;

    constructor() {
        this.cache = new Map();
    }

    get(key): any | null {
        const item = this.cache[key];

        if (item && (!item.expireTime || item.expireTime > Date.now())) {
            return item.value;
        } else {
            delete this.cache[key];
            return null;
        }
    }

    set(key: string, value: any, timeout: EpochTimeStamp|null) {
        if (timeout && timeout > 0) {
            const expireTime = Date.now() + timeout;
            const item: CacheItem = {
                expireTime,
                value
            }

            this.cache[key] = item;
        }
    }

    remove(key: string) {
        delete this.cache[key];
    }

    has(key: string): boolean {
        return key in this.cache;
    }
}

const cache = new MemoryCache();

export function CacheMiddleware(opts = {}) {
    const defaults = {
        timeout: 60 * 60 * 1000,
        onCacheMiss: () => {},
    }

    const options = {
        ...defaults,
        ...opts,
    }

    return function (req, res, next) {
        const cacheURL = req.originalURL || req.url;
        const cacheKey = "c_" + cacheURL;
        const cachedResponse = cache.get(cacheKey);

        if (cachedResponse) {
            const cachedBody = cachedResponse.body;
			const cachedHeaders = cachedResponse.headers;
			const cachedStatusCode = cachedResponse.statusCode;

			// Set headers that we cached
			if (cachedHeaders) {
				res.set(JSON.parse(cachedHeaders));
			}

			res.status(cachedStatusCode).send(cachedBody);
        } else {
            const originalSend = res.send;
            res.send = function (body) {
                cache.set(
                    cacheKey,
                    {
						body: typeof body === "object" ? JSON.stringify(body) : body,
						headers: JSON.stringify(res.getHeaders()),
						statusCode: res.statusCode
					},
					options.timeout,
                );
                originalSend.call(this, body);
            }

            next();
        }
    }
}

export default CacheMiddleware