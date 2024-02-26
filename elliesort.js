let selectedBranch;

class Branch {
    container;
    animals = [];
    id;
    constructor(id) {
        this.id = id;
        const template = document.querySelector("#branch-template");
        const clone = template.content.cloneNode(true);
        this.container = clone.children[0];
        this.container.id = id;

        this.container.addEventListener("click", (e) => this.onClickHandler())
    }

    addAnimal(anAnimal) {
        this.container.querySelector(".animal-container").append(anAnimal.container);
        this.animals.push(anAnimal);
        return this;
    }

    getSelectedAnimals() {
        return this.animals.filter((a) => a.selected)
    }

    removeSelectedAnimals() {
        let selectedAnimals = this.getSelectedAnimals();
        this.animals = this.animals.filter((a) => !a.selected)
        selectedAnimals.forEach((a) => a.unselect());
        return selectedAnimals;
    }

    isBranchComplete() {
        if(this.animals.length == 0) {
            return true;
        }

        if(this.animals.length != 4){
            return false;
        }

        let animalColors = new Set();
        this.animals.forEach((a) => {
            animalColors.add(a.getColor());
        });

        return animalColors.size == 1;
    }

    onClickHandler() {
        if (selectedBranch == null) {
            if (this.animals.length == 0) {
                return;
            }

            for (let index = this.animals.length - 1; index >= 0; index--) {
                if (index == this.animals.length - 1) {
                    this.animals[index].select()
                } else if (this.animals[index].color == this.animals[index + 1].color) {
                    this.animals[index].select()
                } else {
                    break;
                }
            }

            selectedBranch = this;

        } else if (selectedBranch.id == this.id) {
            this.animals.forEach((a) => a.unselect())
            selectedBranch = null;
        } else {
            if (this.animals.length == 4) {
                return;
            }

            let selectedAnimals = selectedBranch.getSelectedAnimals()
            let numAnimals = this.animals.length;
            if (
                (selectedAnimals.length + numAnimals <= 4)
                && (
                    numAnimals == 0
                    || this.animals[numAnimals - 1].getColor() == selectedAnimals[0].getColor()
                )
            ) {
                selectedAnimals = selectedBranch.removeSelectedAnimals();
                let animalContainer = this.container.querySelector(".animal-container");
                selectedAnimals.forEach((a) => {
                    let oldPos = a.container.getBoundingClientRect();

                    //Append a hidden clone to find the new position so we can animate it
                    let containerClone = a.container.cloneNode(true);
                    containerClone.style.visibility = "hidden"
                    animalContainer.appendChild(containerClone);

                    let newPos = containerClone.getBoundingClientRect();

                    const translateTransform = `translate(${newPos.x - oldPos.x}px, ${newPos.y - oldPos.y}px)`;
                    a.container.animate([
                        {
                            transform: "translate(0,0)"
                        }
                        ,
                        {
                            transform: `${translateTransform}`
                        }

                    ], {
                        easing: "ease-out",
                        duration: 500
                    }).finished.then(() => {
                        containerClone.remove();
                        animalContainer.appendChild(a.container);
                        this.animals.push(a);
                        this.container.dispatchEvent(new CustomEvent("animalmoved", {bubbles: true}));
                    });


                });

                selectedBranch = null;
            }
        }
    }
}

class Animal {
    container;
    color;
    selected;
    constructor(color) {
        this.color = color;

        const animalTemplate = document.querySelector("#animal-template");
        const animalClone = animalTemplate.content.cloneNode(true);
        this.container = animalClone.children[0];
        this.container.style.backgroundColor = color;
    }

    getColor() {
        return this.color;
    }

    select() {
        this.selected = true;
        this.container.style.border = "thick solid yellow";
        this.container.classList.add("selected");
    }

    unselect() {
        this.selected = false;
        this.container.style.border = "";
        this.container.classList.remove("selected");
    }
}

const NUM_BRANCHES = 6;
let branches = [];

for (let i = 0; i < NUM_BRANCHES; i++) {
    branches.push(new Branch(i));
}

const allAnimals = [
    new Animal("skyblue"),
    new Animal("skyblue"),
    new Animal("skyblue"),
    new Animal("skyblue"),

    new Animal("orange"),
    new Animal("orange"),
    new Animal("orange"),
    new Animal("orange"),

    new Animal("pink"),
    new Animal("pink"),
    new Animal("pink"),
    new Animal("pink"),

    new Animal("lightgreen"),
    new Animal("lightgreen"),
    new Animal("lightgreen"),
    new Animal("lightgreen")
]

const shuffle = (array) => { 
    return array.sort(() => Math.random() - 0.5); 
}; 

const shuffledAnimals = shuffle(allAnimals); 

let branchCounter = 0;
shuffledAnimals.forEach((a) => {
    if(branches[branchCounter].animals.length >= 4) {
        branchCounter++;
    }

    branches[branchCounter].addAnimal(a);
})


const container = document.querySelector("#game-container");
branches.forEach((b) => {
    container.append(b.container);
});

container.addEventListener("animalmoved", () => {
    const completeBranches = branches.filter(b => b.isBranchComplete());
    if(completeBranches.length == branches.length) {
        const confettiContainer = document.querySelector(".confetti-container");
        confettiContainer.style.visibility = "visible";
    }
});