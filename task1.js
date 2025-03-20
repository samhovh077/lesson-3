const { faker } = require('@faker-js/faker');

function Person(name, age) {
  this.name = name;
  this.age = age;
  this.growUp = setInterval(() => {
    this.age++;
    console.log(this.age, this.name);
  }, 1000);
}

const arr = Array.from({ length: 4 }, () => {
  return new Person(faker.person.fullName(), Math.floor(Math.random() * 50));
});

function check() {
  arr.forEach((person, i) => {
    if (person.age >= 40) {
      clearInterval(person.growUp);
      arr.splice(i, 1);
    }
  });
}

function add() {
  arr.push(new Person(faker.person.fullName(), Math.floor(Math.random() * 50)));
}
setInterval(check, 1000);
setInterval(add, 2000);
