var queueService = require('../services/QueueService');

function TeamSocketController(socket) {
    socket.on('getTeams', async (participants) => {
        try {
            var queues = await queueService.findMainQueues();
            var lastTeamId = 100;
            var teams = [];
            var team = { participants: [], queues: queues };
            participants.forEach((participant) => {
                if (participant.teamId != lastTeamId) {
                    teams.push(team);
                    team = new { participants: [], queues: queues };
                }
                team.participants.push(participant);
                lastTeamId = participant.teamId;
            });
            teams.push(team);

            socket.emit('returnTeams', teams);
        } catch (error) {
            console.log(error);
        }
    });
};

module.exports = TeamSocketController;