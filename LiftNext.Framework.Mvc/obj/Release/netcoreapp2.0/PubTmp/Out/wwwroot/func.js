function sin(num)
{
    return Math.sin(num);
}
function cos(num)
{
    return Math.cos(num);
}
function tan(num) {
    return Math.tan(num);
}
function Asin(num) {
    return Math.asin(num);
}
function Acos(num) {
    return Math.acos(num);
}
function Atan(num) {
    return Math.atan(num);
}
function ROUNDDOWN(num1, num2) {
    return Math.floor(num1 * Math.pow(10, num2)) / Math.pow(10, num2);
}
function ROUNDUP(num1, num2) {
    return Math.ceil(num1 * Math.pow(10, num2)) / Math.pow(10, num2);
}

function CEILING(num1, num2) {
    if (num2 == 0) return num2;

    var m = num1 / num2;
    var n = Math.ceil(m);
    return num2 * n;
}
function FLOOR(num1, num2)
{
    if (num2 == 0) return num2;

    var m = num1 / num2;
    var n = Math.floor(m);
    return num2 * n;
}
function cont(num)
{
    for (var i= 1; i < arguments.length; i++)
    {
        if (num == arguments[i])
            return true;
    }
    return false;
}
function Pi() {
    return Math.PI;
}
function Abs(num) {
    return Math.abs(num);
}
function INT(num) {
    return parseInt(num);
}
function log(msg) {
    throw 'Error:' + msg;
}
