window.addEventListener("load", () => {
    let mainCtrl = new CardController();
    let btn = document.createElement("button");
    btn.textContent = "new card";
    btn.addEventListener("click", (e) => {
        let sample = new Card(mainCtrl);
        document.body.append(sample.handle);
    });
    document.body.append(btn);
});

let activeCard = null;

class CardController {
    constructor() {
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
}

window.addEventListener("mousemove", (e) => {
    if(activeCard !== null) {
        activeCard.grabMove(e);
    }
});

class Card {
    static classNames = {
        handle: "card-handle",
    };
    constructor(controller) {
        this.controller = controller;
        let handle = this.handle = document.createElement("div");
        handle.className = Card.classNames.handle;
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
        activeCard = this;
    }

    grabEnd(e) {
        this.handle.style["z-index"] = 0;
        this.controller.clearActive();
        activeCard = null;
    }

    grabMove(e) {
        this.setPos({
            x: e.pageX - this.mouse_offset.x,
            y: e.pageY - this.mouse_offset.y
        });
    }
}
