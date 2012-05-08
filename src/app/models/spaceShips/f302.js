define([ 
    'dojo/_base/declare',
    './_Interface'
    ], function (declare, _Interface) {
        return declare("app.model.spaceShips.f302", [_Interface], {
            position: {
                x:50,
                y:0,
                z:0
            },
            gameControls: false,
            
            shipModel: "models/spaceShips/f302.js"
            
            
        });
    });