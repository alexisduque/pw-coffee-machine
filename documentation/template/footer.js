module.exports = function () {
    var dateFormat = function () {
        return (new Date()).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    return {
        height: '1cm',
        contents: '<div style="float:left;">Page {{page}}/{{pages}}</div><div style="float:right;">Created by Alexis Duque - GSoC 2016</div>'
    };
};
