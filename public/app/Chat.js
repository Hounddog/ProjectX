define([ 
    'dojo/_base/declare', 
    'dijit/_Widget',
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    'dojo/text!./templates/chat.html',
    'dojo/on',
    'dijit/layout/TabContainer',
    'dijit/layout/ContentPane',
    'dojo/dnd/move',
    'dijit/form/Form',
    'dijit/form/TextBox'
    ], function (declare, _Widget, _TemplatedMixin, _WidgetsInTemplateMixin, template, on) {
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
                on(this.inputForm, 'submit', dojo.hitch(this, function(event){
                    
                    this.inputForm.validate();
                    this.send();
                    event.preventDefault();
                }));
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
                this.socket.emit('message',  this.input.value );
                this.message({
                    message: [this.loginName, this.input.value]
                });
            },
            message: function(obj) {
                console.log(obj);
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