// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
require("FireManager");
var Bullet = cc.Class({
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
        Speed: 0,
        DamageLabel: cc.Label,
        DefaultSize: new cc.Size(20, 20),
        SizeIncrementK: 0.1,
        DefalutDamaage: 1,
        Damage:
        {
            get() { return this._damage },
            set(value) {
                if (value < 1 || value > 999) return;
                this._damage = value;
                this.DamageLabel.string = value;

                this.node.width = this.DefaultSize.width + (value - 1) * this.SizeIncrementK;
                this.node.height = this.DefaultSize.height + (value - 1) * this.SizeIncrementK;
                var coo = this.getComponent(cc.BoxCollider);
                coo.size = cc.size(this.node.width, this.node.height);
            },
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.Damage = this.DefalutDamaage;
    },

    start() {
    },

    update(dt) {
        this.node.y += this.Speed * dt;
    },

    Manager: null,

});
