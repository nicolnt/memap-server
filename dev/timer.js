module.exports = async (fn, name, time) => {
    if(time == undefined) time = 1;
    console.time(name);
    for (let i = 0; i < time; i++) {
        await fn();
    }
    console.timeEnd(name);
};