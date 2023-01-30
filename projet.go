package main

import (
    "fmt"
    "runtime"
    "sync"
    "io/ioutil"
    "os"
    "bufio"
    "strconv"
    "strings"
)

func check(e error) {
  if e != nil {
    panic(e)
  }
}

// Fonction pour écrire dans un fichier
func write(text string, file *os.File) {
  if _, err := file.WriteString(text); err != nil {
    panic(err)
  }
}

// Fonction pour lire les fichiers
func read(filename string) string {
	data, err := ioutil.ReadFile(filename)
	check(err)
	return string(data)
}

// Fonction de multiplication des matrices a et b, résultat placé dans la matrice c
func mult(a, b, c [][]int, wg *sync.WaitGroup) {
    defer wg.Done() // defer --> s'assure que le wg.Done() s'effectuera dès que la fonction en cours est terminée
    for i := 0; i < len(a); i++ {
        for j := 0; j < len(b[0]); j++ {
            for k := 0; k < len(b); k++ {
                c[i][j] += a[i][k] * b[k][j]
            }
        }
    }
}

func main() {
    // Choix du nombre de processus à utiliser
    runtime.GOMAXPROCS(4)

    // Ouverture des fichiers
    fileA, errA := os.Open("matriceA.txt")
    fileB, errB := os.Open("matriceB.txt")
    defer fileA.Close()
    defer fileB.Close()
    check(errA)
    check(errB)

    // Créez un scanner pour lire le fichier
	  scannerA := bufio.NewScanner(fileA)
    scannerB := bufio.NewScanner(fileB)

    // Tableaux pour les données
    var a [][]int
    var b [][]int

    // Pour chaque ligne de matriceA.txt :
    for scannerA.Scan() {
		   // Lisez la ligne en tant que chaîne
		   line := scannerA.Text()
		   // Convertissez la chaîne en tableau d'entiers
		   entries := strings.Split(line, " ")
		   var row []int
		   for _, entry := range entries {
			    num, _ := strconv.Atoi(entry)
			    row = append(row, num)
		   }
       // Ajoutez la ligne au tableau
		   a = append(a, row)
	  }

    // Pour chaque ligne de matriceB.txt :
    for scannerB.Scan() {
       // Lisez la ligne en tant que chaîne
       line := scannerB.Text()
       // Convertissez la chaîne en tableau d'entiers
       entries := strings.Split(line, " ")
       var row []int
       for _, entry := range entries {
          num, _ := strconv.Atoi(entry)
          row = append(row, num)
       }
       // Ajoutez la ligne au tableau
       b = append(b, row)
    }

    // Créer la matrice résultat
    c := make([][]int, len(a))
    for i := 0; i < len(c); i++ {
        c[i] = make([]int, len(b[0]))
    }

    // Créer le WaitGroup
    var wg sync.WaitGroup

    // Démarrer les goroutines
    for i := 0; i < len(a); i++ {
        wg.Add(1)
        go mult(a, b, c, &wg)
    }

    // Attente de la fin des goroutines
    wg.Wait()

    fmt.Println(c)


}
