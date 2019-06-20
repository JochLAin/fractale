
const promisified = module.exports.promisified = (promises, onFulfilled, onError) => {
    const callback = (promise) => {
        if (promise instanceof Promise) {
            return promise.then(onFulfilled, onError);
        }
        try {
            return onFulfilled(promise);
        } catch (error) {
            if (onError instanceof Function) {
                return onError(error);
            }
            throw error;
        }
    };

    if (Array.isArray(promises) && promises.every(promise => promise instanceof Promise)) {
        return callback(Promise.all(promises));
    }
    return callback(promises);
};

module.exports.chain = (promises) => {
    return (props) => {
        const chain = Promise.resolve(props);
        const loop = function (state) {
            return Promise.resolve().then(() => {
                let current = promises.shift();
                if (current) return current(state).then(loop);
            });
        };
        return chain.then(loop);
    }
};
