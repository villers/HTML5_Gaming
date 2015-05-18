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
        var Preload = (function (_super) {
            __extends(Preload, _super);
            function Preload() {
                _super.apply(this, arguments);
            }
            Preload.prototype.preload = function () {
                this.preloadBar = this.add.sprite(290, 290, 'preload-bar');
                this.load.setPreloadSprite(this.preloadBar);
            };
            Preload.prototype.create = function () {
                this.game.state.start('main');
            };
            return Preload;
        })(Phaser.State);
        State.Preload = Preload;
    })(State = html5gaming.State || (html5gaming.State = {}));
})(html5gaming || (html5gaming = {}));
//# sourceMappingURL=Preload.js.map