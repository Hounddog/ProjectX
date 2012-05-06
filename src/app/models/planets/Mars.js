define([ 
    'dojo/_base/declare',
    './_Interface'
    ], function (declare, _Interface) {
        return declare("app.model.planets.Mars", [_Interface], {
            radius: 3.397,
            rotationSpeed: 1.6,
            id: 'Mars',
            position: {
                x:227.940,
                y:0,
                z:0
            },
            init: function() {
            }
        });
    });