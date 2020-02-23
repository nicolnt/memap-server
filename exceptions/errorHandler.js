module.exports = (err, req, res, next) => {
    const fs = require('fs')
    res.status(err.code).send({error:err.message});
    console.error("Error: " + err.stack);
    fs.appendFileSync(
        'exceptions/log/' + getDate() + 'error.txt', 
        getTime() + 'ERROR : ' + err + '\n')
};

const getTime = () => {
    const now = new Date();
    const ss = format2num(now.getSeconds());
    const mm = format2num(now.getMinutes());
    const hh = format2num(now.getHours());
    const DD = format2num(now.getDate());
    const MM = format2num(now.getMonth()+1);
    const YYYY = now.getFullYear();
    return '[' + YYYY + '-' + MM + '-' + DD + '/' + hh + ':' + mm + ':' + ss + ']'
}

const getDate = () => {
    const now = new Date();
    const DD = format2num(now.getDate());
    const MM = format2num(now.getMonth()+1);
    const YYYY = now.getFullYear();
    return '[' + YYYY + '_' + MM + '_' + DD + ']'
}

const format2num = (number) => {
    if(number < 10) {
        number = '0' + number;
    }
    return number;
}