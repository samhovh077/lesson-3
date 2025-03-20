function Gladiator() {
  const health = faker.number.float({ min: 80, max: 100 });
  const speed = faker.number.float({ min: 1, max: 5, fractionDigits: 3 });

  this.name = faker.person.fullName();
  this.health = health;
  this.initialHealth = health;
  this.power = faker.number.float({ min: 2, max: 5, fractionDigits: 1 });
  this.speed = speed;
  this.initialspeed = speed;
  this.furious = false;
  this.id = faker.string.uuid();
}

function speed(gladiator) {
  if (gladiator.health <= 30 && !gladiator.furious) {
    logBattle(`${gladiator.name} becomes furious!`);
    gladiator.furious = true;
    gladiator.speed *= 3;
  } else if (!gladiator.furious) {
    gladiator.speed =
      gladiator.initialspeed * (gladiator.health / gladiator.initialHealth);
  }

  return (5 / gladiator.speed) * 1000;
}

const timeoutIds = {};

function die(gladiator, gladiators) {
  const ceaserDecision = Math.random() > 0.5;
  logBattle(`${gladiator.name} dying`, 'gray');
  if (ceaserDecision) {
    logBattle(`${gladiator.name} is spared by Caesar!`, 'green');
    gladiator.health = 50;
    gladiator.speed =
      gladiator.initialspeed * (gladiator.health / gladiator.initialHealth);
    gladiator.furious = false;
  } else {
    clearTimeout(timeoutIds[gladiator.id]);

    logBattle(`${gladiator.name} killed by Caesar!`, 'red');

    const index = gladiators.indexOf(gladiator);

    if (index !== -1) {
      gladiators.splice(index, 1);
    }
  }
}

function clearAllTimeouts(timeoutIds) {
  Object.values(timeoutIds).forEach((id) => {
    clearTimeout(id);
  });
}

function attack(gladiator, gladiators) {
  const id = setTimeout(() => {
    const opponents = gladiators.filter((item) => {
      return gladiator.id !== item.id;
    });

    if (opponents.length) {
      const opponentIndex = Math.floor(Math.random() * opponents.length);
      const opponent = opponents[opponentIndex];

      logBattle(
        `${gladiator.name} x ${gladiator.health.toFixed(1)} hits ${opponent.name} x ${opponent.health.toFixed(1)} with power ${gladiator.power}!`,
      );

      opponent.health -= gladiator.power;

      if (opponent.health <= 0) die(opponent, gladiators);

      if (opponent.health <= 30 && !opponent.furious) {
        clearTimeout(timeoutIds[opponent.id]);
        attack(opponent, gladiators);
      }

      attack(gladiator, gladiators);
    }
    if (gladiators.length < 2) {
      clearAllTimeouts(timeoutIds);
      logBattle(
        `${gladiators[0].name} won the battle with health ${gladiators[0].health.toFixed()}`,
      );
    }
  }, speed(gladiator));

  timeoutIds[gladiator.id] = id;
}

function start(gladiators) {
  gladiators.forEach((gladiator) => {
    attack(gladiator, gladiators);
  });
}

function logBattle(message, color = 'black') {
  const logDiv = document.getElementById('battle-log');
  logDiv.innerHTML += `<p style='color:${color}';>${message}</p>`;
  logDiv.scrollTop = logDiv.scrollHeight;
}

const button = document.getElementById('start-button');

button.addEventListener('click', () => {
  clearAllTimeouts(timeoutIds);

  const logDiv = document.getElementById('battle-log');
  logDiv.innerHTML = '';
  let gladiators = Array.from(
    { length: faker.number.int({ min: 2, max: 10 }) },
    () => {
      return new Gladiator();
    },
  );
  start(gladiators);
});
