/**
 * Simpliest assertion library ever :)
 * @param  {*} lvalue
 * @param  {*} rvalue
 */
module.exports = function(lvalue, rvalue) {
    if (lvalue !== rvalue) {
        throw new Error('Expected ' + rvalue + ', but ' + lvalue + ' found!');
    }
}
