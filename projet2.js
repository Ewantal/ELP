const lire = require('prompt');
const readline = require('readline');


function error(chaine) {
  console.log("Erreur. "+chaine);
}

//Tuer un process (ID = pid)
async function Tuer(pid) {
  const { exec } = require('child_process');
  exec('kill '+pid, (err, stdout, stderr) => {});
  return 'Process '+pid+' tué.';
}

//Mettre en pause un process (ID = pid)
async function Pause(pid) {
  const { exec } = require('child_process');
  exec('kill -STOP '+pid, (err, stdout, stderr) => {});
  return 'Process '+pid+' mis en pause.';
}

//Continuer un process (ID = pid)
async function Continuer(pid) {
  const { exec } = require('child_process');
  exec('kill -CONT '+pid, (err, stdout, stderr) => {});
  return 'Process '+pid+' continue.';
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
          const { exec } = require('child_process');
          exec('ps -A', (err, stdout, stderr) => {
            console.log(stdout);
            handleCommand();
          });
        }
        break;


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
