define([ 
    'dojo/_base/declare', 
    'dijit/_Widget',
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    'dojo/text!./templates/navigation.html',
    'dojo/on',
    'dijit/registry'
    ], function (declare, _Widget, _TemplatedMixin, _WidgetsInTemplateMixin, template, on, registry) {
        return declare("app.interface.Navigation", [_Widget, _TemplatedMixin, _WidgetsInTemplateMixin], {
            templateString: template,
            postCreate: function() {
                document.body.appendChild(this.domNode);
            },
            update: function() {
                var object;
                if(object = registry.byId('Mars')) {
                    this.positionX.innerHTML = object.position.x;
                    this.positionY.innerHTML = object.position.y;
                    this.positionZ.innerHTML = object.position.z;
                }
            }
        });
    });