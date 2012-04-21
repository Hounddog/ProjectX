define([ 'dojo/has', 'require' ], function (has, require) {
    var app = {};

    if (has('host-browser')) {
        require([ 'app/Chat', 'dojo/domReady!' ], function (Chat) {
            var loginName = prompt("Enter your name : ", "your name here");
            var chat = new Chat({loginName:loginName});
            //var chat = new Chat();
            document.body.appendChild(chat.domNode);
            chat.resize();//@todo need to fix this in app.Chat
        });
    }
});