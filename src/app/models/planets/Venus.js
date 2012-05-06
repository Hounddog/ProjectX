define([ 
    'dojo/_base/declare',
    './_Interface'
    ], function (declare, _Interface) {
        return declare("app.model.planets.Venus", [_Interface], {
            radius: 6.052,
            rotationSpeed: 8.13,
            id: 'Venus',
            position: {
                x:108.200,
                y:0,
                z:0
            },
            init: function() {
            }
        });
    });