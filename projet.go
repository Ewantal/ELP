package main

import (
    "fmt"
    "runtime"
    "sync"
)

// multiplication des matrices a et b, résultat placé dans la matrice c
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
    // choix du nombre de processus à utiliser
    runtime.GOMAXPROCS(4)

    // créer les matrices
    a := [][]int{{1, 2, 3}, {4, 5, 6}}
    b := [][]int{{1, 2}, {3, 4}, {5, 6}}
    c := make([][]int, len(a))
    for i := 0; i < len(c); i++ {
        c[i] = make([]int, len(b[0]))
    }

    // créer le WaitGroup
    var wg sync.WaitGroup

    // démarrer les goroutines
    for i := 0; i < len(a); i++ {
        wg.Add(1)
        go mult(a, b, c, &wg)
    }

    // attente de la fin des goroutines
    wg.Wait()

    fmt.Println(c)
}

Dans ce code, je ne comprends pas pourquoi chaque goroutine ne fait pas le calcul total de la multiplication des deux matrices.
