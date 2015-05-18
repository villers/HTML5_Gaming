/// <reference path="../typings/tsd.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var html5gaming;
(function (html5gaming) {
    var State;
    (function (State) {
        var Main = (function (_super) {
            __extends(Main, _super);
            function Main() {
                _super.apply(this, arguments);
            }
            Main.prototype.create = function () {
                var thing = 'code !';
                this.add.text(10, 10, "Let's " + thing, { font: '65px Arial' });
            };
            return Main;
        })(Phaser.State);
        State.Main = Main;
    })(State = html5gaming.State || (html5gaming.State = {}));
})(html5gaming || (html5gaming = {}));
//# sourceMappingURL=Main.js.map