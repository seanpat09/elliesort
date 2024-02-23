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
        this.animals.push(anAnimal);
        return this;
    }

    getSelectedAnimals() {
        return this.animals.filter((a) => a.selected )
    }

    removeSelectedAnimals() {
        let selectedAnimals = this.getSelectedAnimals();
        this.animals = this.animals.filter((a) => !a.selected)
        selectedAnimals.forEach((a) => a.unselect());
        return selectedAnimals;
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
            if(
                (selectedAnimals.length + numAnimals <= 4)
                 && (
                    numAnimals == 0
                    || this.animals[numAnimals - 1].getColor() == selectedAnimals[0].getColor() 
                 )
            ) {
                selectedAnimals = selectedBranch.removeSelectedAnimals();
                let animalContainer = this.container.querySelector(".animal-container");
                selectedAnimals.forEach((a) => {
                    animalContainer.appendChild(a.container);
                    this.animals.push(a)
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
    }

    getColor() {
        return this.color;
    }

    select() {
        this.selected = true;
        this.container.style.border = "thick solid yellow";
    }

    unselect() {
        this.selected = false;
        this.container.style.border = "";
    }
}

const NUM_BRANCHES = 3;
let branches = [];

for (let i = 0; i < NUM_BRANCHES; i++) {
    branches.push(new Branch(i));
}

branches[0]
    .addAnimal(new Animal("blue"))
    .addAnimal(new Animal("orange"))
    .addAnimal(new Animal("blue"))
    .addAnimal(new Animal("orange"));

branches[1]
    .addAnimal(new Animal("orange"))
    .addAnimal(new Animal("orange"))
    .addAnimal(new Animal("blue"))
    .addAnimal(new Animal("blue"));

branches.forEach((b) => {
    b.animals.forEach((a) => {
        const animalTemplate = document.querySelector("#animal-template");
        const animalClone = animalTemplate.content.cloneNode(true);
        a.container = animalClone.children[0];
        a.container.style.backgroundColor = a.getColor();
        b.container.querySelector(".animal-container").append(animalClone);
    });

    const container = document.querySelector("#game-container");
    container.append(b.container);
});