define([ 'dojo/has', 'require' ], function (has, require) {
    var app = {};
    if (has('host-browser')) {
        require([ 'app/Chat','app/Engine', 'dojo/domReady!' ], function (Chat, Engine) {
            var loginName = prompt("Enter your name : ", "your name here");
            var chat = new Chat({loginName:loginName});
            document.body.appendChild(chat.domNode);
            chat.resize();//@todo need to fix this in app.Chat
            new Engine();
        });
    }
});
