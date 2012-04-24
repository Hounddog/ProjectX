define([ 
    'dojo/_base/declare', 
    'dijit/_Widget',
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    'dojo/text!./templates/chat.html',
    'dojo/on',
    "dojo/_base/event",
    'dijit/layout/TabContainer',
    'dijit/layout/ContentPane',
    'dojo/dnd/move',
    'dijit/form/Form',
    'dijit/form/TextBox'
    ], function (declare, _Widget, _TemplatedMixin, _WidgetsInTemplateMixin, template, on, event) {
        return declare("app.Chat", [_Widget, _TemplatedMixin, _WidgetsInTemplateMixin], {
            /*
            * @todo need to implement resizing to show the tabcontainer properly
            * @todo implement webworker for the chat functionality
            */
            loginName: null,
            templateString: template,
            socket: io.connect(),
            postCreate: function() {
                //var dnd = new dojo.dnd.Moveable(this.chat);
                this.tabCont.startup(); 
                this.initSocket();
                var self = this;
                on(this.inputForm, 'submit', function(e){
                    event.stop(e);
                    self.send();
                });
            },
            
            resize: function() {
                this.tabCont.resize();
            },
            
            initSocket: function() {
                this.socket.emit('chatName',  this.loginName );
                this.socket.on('message', dojo.hitch(this, function(obj){
                    this.message(obj);
                }));
            },
            
            send: function() {
                var value = this.input.get('value');
                this.socket.emit('message', value);
                this.message({
                    message: [this.loginName, value]
                });
                this.input.set('value', '');
            },
            message: function(obj) {
                var el = document.createElement('p');
                if (obj.announcement) {
                    el.innerHTML = '<em>' + this.esc(obj.announcement) + '</em>';
                } else if (obj.message) {
                    el.innerHTML = '<b>' + this.esc(obj.message[0]) + ':</b> ' + this.esc(obj.message[1]);
                } 
                dojo.place(el, this.global.containerNode);
                this.global.containerNode.scrollTop = 1000000;
            },
            esc: function(msg){
                return msg.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            }
        });
    });