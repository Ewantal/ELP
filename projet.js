var lire = require('prompt');
var colors = require("@colors/colors/safe");

async function handleCommand() {
  try {
    const result = await lire.get({
      properties: {
        commande: {
          description: colors.white("Quelle commande voulez vous entrer ? ")
        }
      }
    });
    switch (result.commande) {
      case 'lp':                                          //cas LP
        console.log('Vous voulez afficher les processus en cours.');
        const { exec } = require('child_process');
        exec('ps -A', (err, stdout, stderr) => {
            console.log(stdout);
            handleCommand();
        });
        break;
      case 'bing -k':                                    //cas BING -K
        console.log('Vous voulez tuer un processus.');
        processID = await whichProcess();
        if (processID) {
          console.log('Tuer le process '+processID);
          message = await Tuer(processID);
          console.log(message);
        }
        handleCommand();
        break;
      case 'bing -p':                                    //cas BING -p
        console.log('Vous voulez mettre en pause un processus.');
        processID = await whichProcess();
        if (processID) {
          console.log('Mettre en pause le process '+processID);
          message = await Pause(processID);
          console.log(message);
        }
        handleCommand();
        break;
      case 'bing -c':
        console.log('Vous voulez continuer un processus.');
        processID = await whichProcess();
        if (processID) {
          console.log('Continuer le process '+processID);
          message = await Continuer(processID);
          console.log(message);
        }
        handleCommand();
        break;
      case 'sortie':                                    //cas SORTIE
        console.log('Au revoir!');
        return;
      default:
        console.log('Commande non reconnue');
        handleCommand();
    }
  } catch(err) {
  console.log(err);
  }
}

async function whichProcess() {
  try {
    const result = await lire.get({
      properties: {
        commande: {
          description: colors.white("Quel est l'ID du processus ? ")
        }
      }
    });
    if (result.commande != 'sortie') {
      return result.commande;
    } else {
      return null;
    }
  } catch(err) {
  console.log(err);
  }
}

async function Tuer(pid) {
  const { exec } = require('child_process');
  exec('kill '+pid, (err, stdout, stderr) => {});
  return 'Process '+pid+' tué.';
}

async function Pause(pid) {
  const { exec } = require('child_process');
  exec('kill -STOP '+pid, (err, stdout, stderr) => {});
  return 'Process '+pid+' mis en pause.';
}

async function Continuer(pid) {
  const { exec } = require('child_process');
  exec('kill -CONT'+pid, (err, stdout, stderr) => {});
  return 'Process '+pid+' continue.';
}

lire.start();
handleCommand();
