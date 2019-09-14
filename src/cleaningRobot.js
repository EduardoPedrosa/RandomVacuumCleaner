// In this simple problem the world includes both the environment and the robot
// but in most problems the environment and world would be separate
class World {
    constructor(numFloors) {
        this.location = 0;
        this.floors = [];        
        for (let i = 0; i < numFloors; i++) {
            this.floors.push({dirty: false});
        }
        
        //weight of each position
        this.weight = [0, 0, 0,
                       0, 0, 0,
                       0, 0, 0]

        this.lastVisited = [] 
    }

    markFloorDirty(floorNumber) {
        this.floors[floorNumber].dirty = true;
    }

    simulate(action) {
        switch(action) {
            case 'SUCK':
                this.floors[this.location].dirty = false;
                break;
            case 'LEFT':
                if(this.location % 2 === 1){
                    this.location -= 1
                } 
                break;
            case 'RIGHT':
                if(this.location % 2 === 0) {
                    this.location += 1
                }
                break;
            case 'UP':
                if(this.location > 1) {
                    this.location -= 2;
                }
                break;
            case 'DOWN':
                if(this.location < 2) {
                    this.location += 2;
                }
                break;
        }

        return action;
    }

    simulateGoalBased(action){
        switch(action){
            case 'SUCK':
                this.floors[this.location].dirty = false
                break
            case 'LEFT':
                this.location -= 1
                break
            case 'RIGHT':
                this.location += 1
                break
            case 'UP':
                this.location -= 3
                break
            case 'DOWN':
                this.location +=3
                break
        }
    }

    updateWeight(action){
        this.weight.forEach((e, index) => {
            this.weight[index] = ++e
        })
        if(action === 'SUCK'){
            this.weight[this.location] += 3
        } else {
            this.weight[this.location] -= 2
        }
        console.log(this.weight[0], this.weight[1], this.weight[2] )
        console.log(this.weight[3], this.weight[4], this.weight[5])
        console.log(this.weight[6], this.weight[7], this.weight[8])
    }
}

// Rules are defined in code
function reflexVacuumAgent(world) {
    if (world.floors[world.location].dirty) { return 'SUCK'; }
    else { 
        const rand = Math.random()
        if(rand < 0.25){
            return "LEFT"
        } else if (rand < 0.5) {
            return "UP"
        } else if (rand < 0.75) {
            return "RIGHT"
        } else {
            return "DOWN"
        }
    }
}

function reflexVacuumAgentKnowing(world) {
    const rand = Math.random()
    if (world.floors[world.location].dirty) { return 'SUCK'; }
    else if (world.location == 0)           { 
        return rand < 0.5 ? "RIGHT" : "DOWN"; 
    } else if (world.location == 1){
        return rand < 0.5 ? "LEFT" : "DOWN";
    } else if (world.location == 2){
        return rand < 0.5 ? "RIGHT" : "UP";
    } else {
        return rand < 0.5 ? "LEFT" : "UP";
    }
}

function goalBasedVacuumAgent(world){
    const possibleCases = ['LEFT', 'RIGHT', 'UP', 'DOWN']
    const positions = []
    const possiblePositionsToGo = []

    if(world.floors[world.location].dirty) { return 'SUCK'; }
    else {
        positions.push(world.location % 3 - 1) //left
        positions.push(world.location % 3 + 1) //right
        positions.push(world.location - 3)  //up
        positions.push(world.location + 3) //down
        positions.forEach((value, index) => {
            if(value >= 0 && (!world.lastVisited.includes(value))){
                if(index < 2) { //para a esquerda e para a direita
                    if(value < 3) { //verificação horizontal
                        possiblePositionsToGo.push(positions[index])
                    }
                } else { //para cima e para baixo
                    if(value < 9) { //verificação vertical
                        possiblePositionsToGo.push(positions[index])
                    }
                }
            }
        })

        possiblePositionsToGo.sort((p1, p2) => {
            if(world.weight[p1] > world.weight[p2]){
                return -1
            }
            if(world.weight[p1] < world.weight[p2]){
                return 1
            }
            return 0
        })
        let bestPosition = possiblePositionsToGo[0]
        let i = 0
        const equalWeights = []
        while(world.weight[possiblePositionsToGo[i]] === world.weight[bestPosition]){
            equalWeights.push(possiblePositionsToGo[i])
            ++i
        }

        if(equalWeights.length > 1){
            //calculating randomly the number to take
            const rand = Math.random()
            const randFactor = 1 / equalWeights.length
            const resultPosition = Math.floor(rand / randFactor)
            bestPosition = equalWeights[resultPosition]
        }
        let result = -1
        positions.forEach((value, index) => {
            if(value === bestPosition){
                result = possibleCases[index]
                console.log(result)
            }
        })
        
        if(world.lastVisited.length === 2){
            world.lastVisited.shift()
        }
        world.lastVisited.push(world.location)
        
        return result
    }
}

// Rules are defined in data, in a table indexed by [location][dirty]
function tableVacuumAgent(world, table) {
    let location = world.location;
    let dirty = world.floors[location].dirty ? 1 : 0;
    return table[location][dirty];
}
