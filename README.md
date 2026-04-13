# Tests unitaires — SpaceWord

## C'est quoi un test unitaire ?

Un test unitaire, c'est un petit bout de code qui vérifie qu'une fonction fait bien ce qu'elle est censée faire. Par exemple, si tu as une fonction `addition(a, b)`, tu écris un test qui dit : "quand j'appelle `addition(2, 3)`, je m'attends à recevoir `5`". Si la fonction renvoie autre chose, le test échoue et tu sais qu'il y a un problème.

L'idée c'est d'automatiser ces vérifications pour ne pas avoir à tester à la main à chaque fois que tu modifies le code. C'est particulièrement utile dans un pipeline CI/CD : à chaque push sur GitHub, les tests tournent automatiquement et te préviennent si quelque chose est cassé.

---

## L'outil qu'on a utilisé : Vitest

Il existe plein de frameworks de tests en JavaScript (Jest, Mocha, Jasmine...). On a choisi **Vitest** parce que :

- il supporte nativement les modules ES (`import`/`export`) sans configuration complexe
- il est rapide
- sa syntaxe est identique à Jest, donc facile à apprendre

---

## Structure du projet

Voici les fichiers qu'on a créés ou modifiés :

```
space-word/
├── script.js             ← le code du jeu (on a ajouté les exports à la fin du fichier)
├── spaceword.test.js     ← nos tests
├── vitest.config.js      ← configuration de Vitest
├── vitest.setup.js       ← setup avant les tests
└── package.json          ← dépendances et scripts npm
```

---

## Les fichiers un par un

### `package.json`

```json
{
  "devDependencies": {
    "vitest": "^4.1.4",
    "jsdom": "^26.1.0"
  },
  "scripts": {
    "test": "vitest run"
  },
  "type": "module"
}
```

- `vitest` : le framework de test
- `jsdom` : simule un navigateur (voir plus bas pourquoi)
- `"test": "vitest run"` : quand tu fais `npm test`, ça lance Vitest
- `"type": "module"` : indique à Node.js qu'on utilise la syntaxe `import`/`export`

---

### `vitest.config.js`

```js
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.js"],
  },
});
```

Deux choses importantes ici :

**`environment: "jsdom"`** — Le code du jeu utilise `document`, `canvas`, etc. Ces objets n'existent que dans un navigateur, pas dans Node.js qui exécute nos tests. jsdom est une bibliothèque qui simule un navigateur dans Node.js pour que le code du jeu ne plante pas.

**`setupFiles`** — Ce fichier est exécuté _avant_ chaque fichier de test. On s'en sert pour préparer l'environnement (voir ci-dessous).

---

### `vitest.setup.js`

```js
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
```

Le jeu cherche un élément `<canvas>` dans le DOM dès le chargement de `script.js`. Si cet élément n'existe pas, il plante immédiatement avec une erreur `Cannot read properties of undefined`. Ce fichier crée ce canvas dans le DOM simulé _avant_ que le fichier de test importe `script.js`, ce qui évite le crash.

---

### `spaceword.test.js`

C'est là que vivent tous nos tests. Voici comment il est organisé :

```js
import { expect, test, describe } from "vitest";
import {
  getRandomInt,
  rectIntersect,
  circleIntersect,
  timeToString,
} from "./script.js";
```

On importe les outils de Vitest et les fonctions du jeu qu'on veut tester.

#### Les blocs `describe`

```js
describe("getRandomInt", () => {
  // tous les tests liés à getRandomInt
});
```

`describe` sert à regrouper les tests par fonction. C'est purement organisationnel, ça n'a pas d'impact sur l'exécution.

#### Les blocs `test`

```js
test("getRandomInt(42, 42) returns 42", () => {
  expect(getRandomInt(42, 42)).toBe(42);
});
```

Chaque `test` vérifie un comportement précis. La structure est toujours la même :

- un nom qui décrit ce qu'on vérifie
- un `expect(valeurReçue).toBe(valeurAttendue)`

#### Les matchers disponibles

| Matcher                         | Ce qu'il vérifie                      |
| ------------------------------- | ------------------------------------- |
| `.toBe(x)`                      | égalité stricte (===)                 |
| `.toBeGreaterThanOrEqual(x)`    | >= x                                  |
| `.toBeLessThanOrEqual(x)`       | <= x                                  |
| `.toMatch(/regex/)`             | correspond à une expression régulière |
| `typeof result).toBe("string")` | le type de la valeur                  |

---

## Les fonctions testées

On a testé 4 fonctions issues de `script.js` :

### `getRandomInt(min, max)`

Renvoie un entier aléatoire entre `min` et `max` inclus. On vérifie que la valeur retournée est toujours dans les bornes, et que quand `min === max` on obtient toujours cette valeur.

### `rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2)`

Vérifie si deux rectangles se chevauchent. Les paramètres sont les coordonnées (x, y) et les dimensions (largeur, hauteur) de chaque rectangle. L'implémentation du jeu utilise une collision **non stricte** : deux rectangles qui se touchent sur un bord retournent `true`.

### `circleIntersect(x1, y1, r1, x2, y2, r2)`

Vérifie si deux cercles se chevauchent. Les paramètres sont les coordonnées du centre et le rayon de chaque cercle. L'intersection est calculée en comparant la distance entre les centres à la somme des rayons.

### `timeToString(ms)`

Convertit un nombre de millisecondes en chaîne formatée `"HH:MM:SS"`. Si on passe une valeur non numérique comme `"toto"`, la fonction retourne `"NaN:NaN:NaN"`. À noter : `null` est traité comme `0` et retourne `"00:00:00"`.

---

## Lancer les tests

```bash
npm test
```

Résultat attendu :

```
✓ spaceword.test.js (22 tests)
  ✓ getRandomInt (7)
  ✓ rectIntersect (5)
  ✓ circleIntersect (5)
  ✓ timeToString (5)

Tests  22 passed (22)
```

---

## Intégration dans GitHub Actions

Pour que les tests tournent automatiquement à chaque push, on ajoute ce step dans le workflow CI :

```yaml
- name: Install dependencies
  run: npm install

- name: Run tests
  run: npm test
```

Si un test échoue, le workflow s'arrête et GitHub signale l'erreur directement sur la pull request.
