const lire = require('prompt');
const readline = require('readline');
const { exec } = require('child_process');
const { spawn } = require('child_process');


function error(chaine) {
  console.log("Erreur. "+chaine);
}

//Tuer un process (ID = pid)
async function Tuer(pid) {
  exec('kill '+pid);
  return 'Process '+pid+' tué.';
}

//Mettre en pause un process (ID = pid)
async function Pause(pid) {
  exec('kill -STOP '+pid);
  return 'Process '+pid+' mis en pause.';
}

//Continuer un process (ID = pid)
async function Continuer(pid) {
  exec('kill -CONT '+pid);
  return 'Process '+pid+' continue.';
}

//Chercher dans les variables environnement PATH
function CherchePath(programme_name, str="") {
  const checkInPath = () =>
  new Promise((resolve, reject) => {
    exec(`which ${programme_name}`, (error, stdout) => {
      if (error) {
        reject(error);
      } else if (stdout) {
        resolve(true);
      }
    });
  });

  checkInPath()
  .then(a => {
    if (a) {
      console.log(programme_name+" peut être lancé.");
      //console.log(programme_name+str);
      if (str=="back") {
        background(programme_name);
      } else {
        exec(programme_name, (error, stdout, stderr) => {
          console.log(stdout);
        });
      }
    }
  })
  .catch(error => {
    console.log(programme_name)+" n'a pas été trouvé dans les variables environnement.";
  });
}

//Lancer un programme en arrière plan
function background(programme_name) {
  const child = spawn(programme_name, [], {
    detached: true,
    stdio: 'ignore'
  });

  child.unref();
}


//Fonction qui lit les commandes de l'utilisateur
async function handleCommand() {
  try {
    const result = await lire.get([{name : "commande", description : " commande "}]);
    const args = result.commande.split(" ");

    switch (args[0]) {

      case "bing" : //Cas bing (distinction pour -k, -p, -c)
        switch (args[1]) {
          case "-k" :                           //Cas "-k"
            if (args[2]) {
              message = await Tuer(args[2]);
              console.log(message);
            } else {
              error("Vous n'avez pas entré d'ID de process.");
            }
            break;
          case "-p" :                           //Cas "-p"
            if (args[2]) {
              message = await Pause(args[2]);
              console.log(message);
            } else {
              error("Vous n'avez pas entré d'ID de process.");
            }
            break;
          case "-c" :                           //Cas "-c"
            if (args[2]) {
              message = await Continuer(args[2]);
              console.log(message);
            } else {
              error("Vous n'avez pas entré d'ID de process.");
            }
            break;
          default :
            error("Action non valide.");
        }
        handleCommand();
        break;

      case "lp" :
        if (args[1]) {
          error("Commande non valide.");
        } else {
          exec('ps -A', (err, stdout, stderr) => {
            console.log(stdout);
            handleCommand();
          });
        }
        break;

      default :
        if (result.commande.endsWith("!")) {
          prog_name = result.commande.substring(0,result.commande.length-1)
          CherchePath(prog_name,"back");
        } else {
          CherchePath(result.commande)
        }
        handleCommand();

    }

  } catch(err) {
    console.log(err);
  }
}

// Fonction qui sera appelée dès qu'une touche sera pressée
readline.emitKeypressEvents(process.stdin);
process.stdin.on("keypress", (ch, key) => {
	if(key && key.ctrl && key.name == "p") {
		process.exit(1);
	}
});
process.stdin.setRawMode(true);

// Message qui sera affiché dans le terminal
lire.message = "user";
lire.delimiter = ">";

lire.start();

handleCommand();
