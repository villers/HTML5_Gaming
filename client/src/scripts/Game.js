/// <reference path="typings/tsd.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var html5gaming;
(function (html5gaming) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this, {
                width: 800,
                height: 600,
                transparent: false,
                enableDebug: true
            });
            this.state.add('boot', html5gaming.State.Boot);
            this.state.add('preload', html5gaming.State.Preload);
            this.state.add('main', html5gaming.State.Main);
            this.state.start('boot');
        }
        return Game;
    })(Phaser.Game);
    html5gaming.Game = Game;
})(html5gaming || (html5gaming = {}));
//# sourceMappingURL=Game.js.map