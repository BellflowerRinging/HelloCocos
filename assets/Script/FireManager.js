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
        BulletPoolCount: 20,
        BulletPerfab: cc.Prefab,
        BulletParentNode: cc.Node,
        BulletFireNode0: cc.Node,

        CubePoolCount: 20,
        CubePerfab: cc.Prefab,
        CubeParentNode: cc.Node,
        CubeFireNode: cc.Node,

        KillLabel: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        BulletPool = new cc.NodePool("BulletPool");
        CubePool = new cc.NodePool("CubePool");

        InitCreatePerfab(this.BulletPoolCount, this.BulletPerfab, BulletPool, this);
        InitCreatePerfab(this.CubePoolCount, this.CubePerfab, CubePool, this);

        CubeFirePosition = this.CubeFireNode.position;
        CubeDamager = 1;
        BulletDamage = 1;

        cc.director.getCollisionManager().enabled = true;
    },

    start() {
        this.schedule(function () {
            var tagerNode = this.BulletFireNode0
            var x = tagerNode.x;
            var y = tagerNode.y;
            if (tagerNode.parent != null) {
                x += tagerNode.parent.x;
                y += tagerNode.parent.y;
            }
            var bullet = fire(cc.v2(x, y), this.BulletParentNode, BulletPool);

            bullet.Damage = BulletDamage;
        }, 1);

        this.schedule(function () {
            var cube = fire(CubeFirePosition, this.CubeParentNode, CubePool);
            cube.Damage = CubeDamager;
        }, 1);
    },

    update(dt) {
        time += dt;
        CubeFirePosition.x = Math.random() * 640 - 320;
        CubeDamager = 1 + Math.floor(time / 4);
        BulletDamage = 1 + Math.floor(kill / 4);
        this.KillLabel.string = "Kill:" + kill;
    },

    /**
     * 
     * @param {node} cube 
     * @param {node} bullet 
    */
    CubeAndBulletOn(cube, bullet) {
        var cm = cube.getComponent("Bullet");
        var bm = bullet.getComponent("Bullet");
        console.log(cm.Damage + " " + bm.Damage);

        if (cm.Damage > bm.Damage) {
            cm.Damage -= bm.Damage;
            BulletPool.put(bullet);
        } else if (cm.Damage == bm.Damage) {
            CubePool.put(cube);
            BulletPool.put(bullet)
            kill++;
        } else {
            bm.Damage -= cm.Damage;
            CubePool.put(cube);
            kill++;
        }
    },

    /**
     * 
     * @param {node} cube 
     * @param {node} ship 
     */
    CubeAndPlayerShipOn(cube, ship) {
        this.reset();
    },

    /**
     * 
     * @param {node} cube 
     * @param {node} Wall 
     */
    CubeAndButtomWallOn(cube, Wall) {
        CubePool.put(cube);
    },

    /**
     * 
     * @param {node} bullet 
     * @param {node} wall 
     */
    BulletAndTopWallOn(bullet, wall) {
        BulletPool.put(bullet);
    },

    reset() {
        kill = 0;
        time = 0;
        CubeDamager = 1;
        BulletDamage = 1;

        for (let i = 0; i < AllUnitList.length; i++) {
            AllUnitList[i].destroy();
        }

        BulletPool.clear();
        CubePool.clear();
        InitCreatePerfab(this.BulletPoolCount, this.BulletPerfab, BulletPool, this);
        InitCreatePerfab(this.CubePoolCount, this.CubePerfab, CubePool, this);
    }
});

var BulletPool;
var CubePool;

var AllUnitList = [];

var CubeFirePosition;
var CubeDamager;
var time = 0;
var BulletDamage;
var kill = 0;
/**
 * 
 * @param {*} count 
 * @param {*} perfab 
 * @param {*} pool 
 */
function InitCreatePerfab(count, perfab, pool, thisM) {
    for (let index = 0; index < count; index++) {
        var n = cc.instantiate(perfab);
        var comp = n.getComponent("Bullet");
        comp.Manager = thisM;
        pool.put(n);
        AllUnitList.push(n);
    }
}

/**
 * 
 * @param {*} pos v2 
 * @param {*} parentNode 
 * @param {*} pool 
 */
function fire(pos, parentNode, pool) {
    var go = pool.get();
    if (go == null) return;

    go.setPosition(pos.x, pos.y);
    go.setParent(parentNode);

    return go.getComponent("Bullet");
}



