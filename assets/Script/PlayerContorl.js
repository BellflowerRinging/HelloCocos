// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,


    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        BgNode: { default: null, type: cc.Node },
        PlayerShip: { default: null, type: cc.Node },
        Speed: 10,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.parent.on(cc.Node.EventType.MOUSE_DOWN, MouseDownEvent, this);
        this.node.parent.on(cc.Node.EventType.TOUCH_START, MouseDownEvent, this);
        this.node.parent.on(cc.Node.EventType.MOUSE_UP, function (e) { MouseHoldOn = false; }, this);
        this.node.parent.on(cc.Node.EventType.TOUCH_END, function (e) { MouseHoldOn = false; }, this);
        this.node.parent.on(cc.Node.EventType.TOUCH_CANCEL, function (e) { MouseHoldOn = false; }, this);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, KeybordDownEvent, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, function (e) { MouseHoldOn = false; }, this);
    },

    start() {

    },

    update(dt) {
        if (MouseHoldOn)
            ShipMove(this.PlayerShip, this.Speed * forword);
    },
});

var MouseHoldOn = false;
var forword = 0;

var MouseDownEvent = function (e) {
    var half = this.BgNode.width / 2;
    if (e.getLocationX() < half) {
        forword = -1;
    } else {
        forword = 1;
    }
    MouseHoldOn = true;
}

var KeybordDownEvent = function (e) {
    switch (e.keyCode) {
        case cc.macro.KEY.a:
        case cc.macro.KEY.left:
            forword = -1;
            break;
        case cc.macro.KEY.d:
        case cc.macro.KEY.right:
            forword = 1;
            break;
        default:
            break;
    }
    MouseHoldOn = true;
}


var ShipMove = function (pn, s) {
    pn.x += s * cc.director.getDeltaTime();
}

