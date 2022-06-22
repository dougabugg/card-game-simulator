window.addEventListener("load", () => {
    let mainCtrl = new CardController();
    window.mainCtrl = mainCtrl;
    {
        let btn = document.createElement("button");
        btn.textContent = "new card";
        btn.addEventListener("click", (e) => {
            let sample = new VisibleCard(mainCtrl);
            document.body.append(sample.handle);
        });
        document.body.append(btn);
    }
    {
        let btn = document.createElement("button");
        btn.textContent = "new slot";
        btn.addEventListener("click", (e) => {
            let sample = new CardSlot(mainCtrl);
            document.body.append(sample.handle);
            sample.computeBounds();
        });
        document.body.append(btn);
    }
});

class CardController {
    constructor() {
        this.cardSlots = [];
        this.activeCard = null;
        let onMouseMove = (e) => this.onMouseMove(e);
        window.addEventListener("mousemove", onMouseMove);
    }

    onMouseMove(e) {
        if(this.activeCard !== null)
            this.activeCard.grabMove(e);
    }

    clearActive() {
        if(this.activeCard !== null) {
            this.activeCard.handle.classList.remove("active")
        }
        this.activeCard = null;
    }

    setActive(card) {
        this.clearActive();
        if(card !== null) {
            this.activeCard = card;
            card.handle.classList.add("active");
        }
    }

    getActive() {
        return this.activeCard;
    }

    registerSlot(cardSlot) {
        this.cardSlots.push(cardSlot);
    }

    snapCard(card) {
        // return;
        if(this.cardSlots.length == 0)
            return;
        let _s = this.cardSlots[0];
        let dim = {w: _s.bounds.width, h: _s.bounds.height};
        const cx = card.pos.x + dim.w/2;
        const cy = card.pos.y + dim.h/2;
        for(const slot of this.cardSlots) {
            if(slot.bounds.left > cx || slot.bounds.right < cx)
                continue;
            if(slot.bounds.top > cy || slot.bounds.bottom < cy)
                continue;
            console.log(slot.bounds, card.pos);
            card.setPos({x: slot.bounds.left, y: slot.bounds.top});
        }
    }
}

class VisibleCard {
    static classNames = {
        handle: "card-handle",
    };
    constructor(controller) {
        this.controller = controller;
        let handle = this.handle = document.createElement("div");
        handle.className = VisibleCard.classNames.handle;
        handle.addEventListener("mousedown", (e) => this.grabStart(e));
        handle.addEventListener("mouseup", (e) => this.grabEnd(e));
        this.pos = {x: 0, y: 0};
    }

    getPos() {
        return this.pos;
    }

    setPos(xypair) {
        this.pos = xypair;
        this.handle.style.left = `${xypair.x}px`;
        this.handle.style.top  = `${xypair.y}px`;
    }

    grabStart(e) {
        this.handle.style["z-index"] = 1;
        let pos = this.getPos();
        this.mouse_offset = {x: e.pageX - pos.x, y: e.pageY - pos.y};
        this.controller.setActive(this);
    }

    grabEnd(e) {
        this.handle.style["z-index"] = 0;
        this.controller.clearActive();
        this.controller.snapCard(this);
    }

    grabMove(e) {
        this.setPos({
            x: e.pageX - this.mouse_offset.x,
            y: e.pageY - this.mouse_offset.y
        });
    }
}

class CardSlot {
    static classNames = {
        handle: "card-slot",
    };
    constructor(controller) {
        this.controller = controller;
        controller.registerSlot(this);
        let handle = this.handle = document.createElement("div");
        handle.className = CardSlot.classNames.handle;
        this.bounds = null;
    }

    computeBounds() {
        let o = this.handle.getClientRects()[0];
        this.bounds = {
            left: o.left,
            top: o.top,
            right: o.right,
            bottom: o.bottom,
            width: o.width,
            height: o.height
        };
    }
}