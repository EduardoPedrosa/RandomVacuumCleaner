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
                if((this.location % 3 === 1) || (this.location % 3 === 2)){
                    this.location -= 1
                }
                break
            case 'RIGHT':
                if((this.location % 3 === 0) || (this.location % 3 === 1)){
                    this.location += 1
                }
                break
            case 'UP':
                if(this.location > 2){
                    this.location -= 3
                }
                break
            case 'DOWN':
                if(this.location < 6){
                    this.location +=3
                }
                break
        }
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
            if(value >= 0){
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
        const bestPosition = possiblePositionsToGo[0]
        const equalWeights = []
        for(let position = 1; position < possiblePositionsToGo.length; position++){
            if(world.weight[position] > world.weight[bestPosition]){
                bestPosition = position
            } else if (world.weight[position] === world.weight[bestPosition]) {
                equalWeights.push(position)
            }
        }


        positions.forEach((value, index) => {
            if(value === bestPosition){
                return possibleCases[index]
            }
        })
    }

}
// Rules are defined in data, in a table indexed by [location][dirty]
function tableVacuumAgent(world, table) {
    let location = world.location;
    let dirty = world.floors[location].dirty ? 1 : 0;
    return table[location][dirty];
}
