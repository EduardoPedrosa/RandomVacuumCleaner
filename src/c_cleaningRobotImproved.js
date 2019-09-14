
function makeDiagram(selector) {
    let diagram = {}, world = new World(9);
    diagram.world = world;
    diagram.xPosition = (floorNumber) => (floorNumber % 3) * 200;
    diagram.yAreaPosition = (floorNumber) => {
        if (floorNumber < 3) {
            return 0
        } else if (floorNumber < 6) {
            return 200
        } else {
            return 400
        }
    }
    diagram.yRobotPosition = (floorNumber) => {
        return diagram.yAreaPosition(floorNumber) + 70
    }

    diagram.root = d3.select(selector);
    diagram.robot = diagram.root.append('g')
        .attr('class', 'robot')
        .style('transform', `translate(${diagram.xPosition(world.location)}px,translate(${diagram.yRobotPosition(world.location)}px)`);
    diagram.robot.append('rect')
        .attr('width', SIZE)
        .attr('height', SIZE)
        .attr('fill', 'hsl(120,25%,50%)');
    diagram.perceptText = diagram.robot.append('text')
        .attr('x', SIZE / 2)
        .attr('y', -25)
        .attr('text-anchor', 'middle');
    diagram.actionText = diagram.robot.append('text')
        .attr('x', SIZE / 2)
        .attr('y', -10)
        .attr('text-anchor', 'middle');

    diagram.floors = [];
    for (let floorNumber = 0; floorNumber < world.floors.length; floorNumber++) {
        diagram.floors[floorNumber] =
            diagram.root.append('rect')
                .attr('class', 'clean floor') // for css
                .attr('x', diagram.xPosition(floorNumber))
                .attr('y', diagram.yAreaPosition(floorNumber))
                .attr('width', SIZE)

                .attr('height', SIZE / 4)
                .attr('stroke', 'black')
                .on('click', function () {
                    world.markFloorDirty(floorNumber);
                    diagram.floors[floorNumber].attr('class', 'dirty floor');
                });
    }
    return diagram;
}

/* Rendering functions read from the state of the world (diagram.world) 
   and write to the state of the diagram (diagram.*). For most diagrams
   we only need one render function. For the vacuum cleaner example, to
   support the different styles (reader driven, agent driven) and the
   animation (agent perceives world, then pauses, then agent acts) I've
   broken up the render function into several. */

function renderDirty(diagram) {
    for (let floorNumber = 0; floorNumber < diagram.world.floors.length; floorNumber++) {
        const rand = Math.random()
        if(diagram.world.floors[floorNumber].dirty === false){
            diagram.world.floors[floorNumber].dirty  = rand < 0.05
        }
    }
}

function renderWorld(diagram) {
    for (let floorNumber = 0; floorNumber < diagram.world.floors.length; floorNumber++) {
        diagram.floors[floorNumber].attr('class', diagram.world.floors[floorNumber].dirty ? 'dirty floor' : 'clean floor');
    }
    diagram.robot.style('transform', `translate(${diagram.xPosition(diagram.world.location)}px, ${diagram.yRobotPosition(diagram.world.location)}px)`);
}

function renderAgentPercept(diagram, dirty) {
    let perceptLabel = { false: "It's clean", true: "It's dirty" }[dirty];
    diagram.perceptText.text(perceptLabel);
}

function renderAgentAction(diagram, action) {
    let actionLabel = { null: 'Waiting', 'SUCK': 'Vacuuming', 'LEFT': 'Going left', 'RIGHT': 'Going right', 'UP': 'Going up', 'DOWN': 'Going down' }[action];
    diagram.actionText.text(actionLabel);
}


function makeRandomAgentImprovedDiagram() {
    let diagram = makeDiagram('#random-agent-improved svg');

    function update() {
        let location = diagram.world.location;
        let percept = diagram.world.floors[location].dirty;
        let action = reflexVacuumAgent(diagram.world);
        diagram.world.simulate(action);
        renderDirty(diagram)
        renderWorld(diagram);
        renderAgentPercept(diagram, percept);
        renderAgentAction(diagram, action);
    }
    update();
    setInterval(update, STEP_TIME_MS);
}


makeRandomAgentImprovedDiagram()