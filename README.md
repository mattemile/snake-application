# Snake Application

Un gioco Snake fatto con React e Vite, pensato come modo alternativo per presentarmi.

Il concetto è semplice: giocando a Snake si sblocca progressivamente un messaggio nascosto. Ogni volta che il serpente mangia un cibo, vengono rivelate nuove parole.

## Come funziona

- Il giocatore controlla il serpente con le frecce, WASD, oppure con swipe/bottoni su mobile
- Servono 15 cibi per sbloccare il messaggio completo
- Il serpente cresce ad ogni cibo mangiato, quindi bisogna stare attenti a non mordersi la coda
- Il campo di gioco ha i bordi collegati (si esce da un lato e si rientra dall'altro)

## Setup

```bash
npm install
npm run dev
```

Per buildare:

```bash
npm run build
npm run preview
```

## Stack

- React 19
- Vite 7
- CSS puro (niente librerie UI)

## Struttura

Il gioco sta tutto dentro `src/components/SnakeGame.jsx`. Il messaggio da rivelare e il numero di mosse necessarie si configurano direttamente nel file, nelle costanti in alto.
