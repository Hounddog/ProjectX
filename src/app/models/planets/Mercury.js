define([ 
    'dojo/_base/declare',
    './_Interface'
    ], function (declare, _Interface) {
        return declare("app.model.planets.Mercury", [_Interface], {
            radius: 2.439,
            rotationSpeed: 2.5,
            id: 'Mercury',
            position: {
                //x:57.910,
                x:0,
                y:0,
                z:0
            },
            init: function() {
            }
        });
    });