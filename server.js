const express = require('express'); // importing a CommonJS module
const morgan = require('morgan');
const helmet = require('helmet');

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

server.use(express.json());
server.use(morgan('dev'));
server.use(helmet());
server.use(teamNamer);
server.use(gateKeeper);
// server.use(only);


// server.use((req, res, next) => {
//   res.status(404).send('Asa is Awesome');
// })

server.use('/api/hubs', restricted, only('asa'), hubsRouter);

server.get('/', (req, res, next) => {
  res.send(`
    <h2>Asa's World API</h2>
    <p>Welcome ${req.team} to Asa's world</p>
    `);
});

function teamNamer(req, res, next) {
  req.team = 'Asa Peeps'
  next();
}

//  const gateKeeper = (req, res, next) => {
//   const seconds = new Date().getSeconds();
//   if(seconds % 3 === 0) {
//     res.status(403).json({ You: 'Shall not pass!!'});
//   } else {
//     next();
//   }
// }

function gateKeeper(req, res, next) {
  const seconds = new Date().getSeconds();

  if(seconds % 3 === 0) {
    res.status(403).json({ You: 'Shall not pass!!'});
  } else {
    next();
  }
}

function restricted(req, res, next) {
  const password = req.headers.password;

  if(password === 'mellon') {
    next();
  } else {
    res.status(401).json({ message: 'Invalid credentials'});
  }
}

// function only(req, res, next) {
//   const onlyAsa = req.headers.name;
//   if (onlyAsa !== 'Asa') {
//     res.status(403).json({ message: 'You are not Asa!'});
    
//   } else {
//     next();
//   }
// }

function only(name) {
  return function(req, res, next) {
    const personName = req.headers.name || '';

    if (personName.toLowerCase() === name.toLowerCase()) {
      next();
    } else {
      res.status(401).json({ message: 'You have no access to this resource'});
    }
  }
}

module.exports = server;
