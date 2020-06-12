const Hero = require('../model/heroes');
const Squad = require('../model/squad');

let data = require('../data/Default_Heroe');
let heroData = data.heroes;
let squadData = data.squads;

function getOverAll(hero) {
  let {
    strength: str, 
    perception: per, 
    endurance: end, 
    charisma: cha, 
    intelligence: int, 
    agility: agi, 
    luck: l
  } = hero.stats; 

  let arr = [str, per, end, cha, int, agi, l];
  return arr.reduce((total, value) => total + value);
}

exports.landingPage = (req, res, next) => {
  res.render('index', {
    title: 'Heroes Home'
  })
};

exports.formData = (req, res, next) => {
  Squad.find((err, squads) => {
    if(err) return res.send({error: err});
    res.render('register', {
      title: 'Create New Heroe',
      squads: squads
    });
    
  })
};

exports.getHeroes = (req, res, next) => {
  Hero.find({}, "", {lean: true}, (err, heroes) => {
    if(err) return res.send({error: err});

    for(hero of heroes) {
      hero.overall = getOverAll(hero);
    }
    res.render('heroes', {
      heroes: heroes,
      title: 'Heroes'
    })
  })
  };

exports.createHeroes = (req, res, next) => {
  let newHero = {
    name: req.body.name,
    description: req.body.description,
    stats: {
      strength: req.body.strength,
      perception: req.body.perception,
      endurance: req.body.endurance,
      charisma: req.body.charisma,
      intelligence: req.body.intelligence,
      agility: req.body.agility,
      luck: req.body.luck
    }
  };
  req.body.origin && (newHero.origin = req.body.origin);
  req.body.squad && (newHero.squad = req.body.squad);
  Hero.create(newHero, (err, hero) =>{
    if(err) {
      return res.send({error: err})
    }
    res.redirect('/heroes');
  })

};

exports.updateHero = ({params}, res, next) => {
  Hero.findById(params.heroId).then(hero => {

    Squad.find((err, squads) => {
      if(err) return res.send({error: err});
      res.render('update', {
        hero: hero,
        squads: squads,
        title: 'Edit Hero'
      })

    })
  })
};

exports.editHero = (req, res, next) => {
  Hero.findById(req.params.heroId, (err, hero) => {
    if(err) return res.send({error: err});
    hero.name = req.body.name,
    hero.description = req.body.description,
    hero.origin = req.body.origin,
    hero.stats.strength = req.body.strength,
    hero.stats.perception = req.body.perception,
    hero.stats.endurance = req.body.endurance,
    hero.stats.charisma = req.body.charisma,
    hero.stats.intelligence = req.body.intelligence,
    hero.stats.agility = req.body.agility,
    hero.stats.luck = req.body.luck

    hero.squad = undefined;
    req.body.squad && (hero.squad = req.body.squad);

    hero.save((err, updatedHero) => {
      if(err) return res.send({error: err});
      res.redirect('/heroes')
    });

  });
}

exports.deleteHero = (req, res, next) => {
  Hero.findByIdAndRemove(req.params.heroId).then(() => {
    console.log('deleted successfully');
    res.redirect('/heroes');
  }).catch(err => console.log(err))
}

exports.reset = (req, res, next) => {
  let p1 = new Promise((resolve, reject) => {
    Hero.deleteMany({}, (err, info) => {
      if(err) {reject('Error'); return res.send({error: err})};
      resolve('Success');
    });
  })

  let p2 = new Promise((resolve, reject) => {
    Squad.deleteMany({}, (err) => {
      if(err) {reject('Error'); return res.send({error: err})}
      resolve('Success');
    });
  });

  Promise.all([p1, p2]).then(() => {
    let p1 = new Promise((resolve, reject) => {
      Hero.insertMany(heroData, (err, info) => {
        if(err) {reject('Error'); return res.send({error: err})};
        resolve('Success');
      })
    });

    let p2 = new Promise((resolve, reject) => {
      Squad.insertMany(squadData, (err, info) => {
        if(err) {reject('Error'); return res.send({error: err})};
        resolve('Success');
      })
    });

    Promise.all([p1, p2]).then(() => {
      res.redirect('/heroes')
    })
  });
}

exports.getSquadsIndex = (req, res, next) => {
  Squad.find({}, null, {lean: true}, (err, squads) => {
    if(err) return res.send({error: err});

    Hero.find({squad: {$exists: true}}, "", {lean: true}, (err, heroes) => {
      if(err) return res.send({error: err});
      for(let i=0; i<squads.length; i++) {
        squads[i].heroes = [];

        for(let j=0; j<heroes.length; j++) {
          if(heroes[j].squad === squads[i].name){
            heroes[j].overall = getOverAll(heroes[j]);
            squads[i].heroes.push(heroes[j]);
            heroes.splice(j, 1);
            j--;
          }
        }

        let overall = squads[i].heroes.reduce((acc, value) => acc + value.overall, 0);
        squads[i].overall = overall;
      }
      res.render('squad', {
        title: 'Squad',
        squads: squads
      })

    })
  })
}

exports.createSquad = (req, res, next) => {
  res.render('create-squad', {
    title: 'Create Squad'
  })
}

exports.creatSquard = (req, res, next) => {
  let newSquad = {name: req.body.name };
  newSquad.hq = req.body.hq ? req.body.hq : 'Unknown';

  Squad.create(newSquad, (err, squad) => {
    if(err) return res.send({error: err})
    res.redirect('/squads')
  })
}

exports.deleteSquad = (req, res, next) => {
  Squad.findByIdAndRemove(req.params.squadId, (err, squad) => {
    if(err) {return res.send({error: err})}
    Hero.find({squad: {$exists: true}}, "squad", {}, (err, heroes) => {
      for(hero of heroes) {
        if(hero.squad === squad.name) {
          hero.squad = undefined;
          hero.save().then(result => {
            console.log('Squad Deleted');
            res.redirect('/squads');
          }).catch(err => res.send({error: err}))
        }
      }
    })
  })
}