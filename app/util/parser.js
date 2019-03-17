module.exports = {
    parseNotes: function(result) {
        for (var i = 0 in result) {
            if (result[i].note) {
                result[i].note = result[i].note.replace("style=", "data-style=").split('$|%');
            }
        }
    }
}