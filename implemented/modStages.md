# Mod loading stages
 
Mods can be loaded in multiple stages of the game loading process. This allows the mod author to hook and manipulate values at the correct time. The mod dependencies do **not** consider the loading stages.



## Default

If the default loading point is used the mod is initialized after all the game's resources have been loaded and the title menu starts playing.

You can use the default loading point by specifying a script in the mod's package.json `main` entry.

### Sample `package.json`

```json
{
    "name": "test",
    "main": "mod.js"
}
```

## Preload

In the preload stage no code other than other mods have been loaded. Keep in mind that at this point you cannot use any of the game's code.

In order to use this stage you have to specify a script in the mod's package.json `preload` entry.

### Sample `package.json`

```json
{
    "name": "test",
    "preload": "mod.js"
}
```

### Simplify

If you add `Simplify` version `2.3.0` or greater as a dependency you can listen for the `preload` event. This is not very useful since the code has to be loaded with the preload entry this can help to structure code, especially when using tools that compress the source code into a single file like webpack.

#### `package.json`

```json
{
    "name": "test",
    "preload": "mod.js",
    "dependencies": {
        "Simplify": "^2.3.0"
    }
}
```

#### `mod.js`

```js
document.addEventListener('preload', () => console.log('preload'));
```

## Postload

In the postload stage the game code has been initialized and the game is waiting for the start call. Not that at this point, some paths (for assets, etc) have already been set.

In order to use this stage you have to specify a script in the mod's package.json `postload` entry.

### Sample `package.json`

```json
{
    "name": "test",
    "postload": "mod.js"
}
```

### Simplify

If you add `Simplify` version `2.3.0` or greater as a dependency you can listen for the `postload` event. This is useful when using tools that compress the source code into a single file like webpack.

#### `package.json`

```json
{
    "name": "test",
    "postload": "mod.js",
    "dependencies": {
        "Simplify": "^2.3.0"
    }
}
```

#### `mod.js`

```js
document.addEventListener('postload', () => console.log('postload'));
```

## modsLoaded

The modsLoaded stage is an event that is triggered after all mods have completed the default stage. In order to listen to this event one of the other three stages have to be used to load a script and add an event handler. Executing code at this point ensures that all mods have been loaded even when no dependency is set.

### Sample `mod.js`

```js
document.addEventListener('modsLoaded', () => console.log('modsLoaded'));
```

## simplifyInitialized

The simplifyInitialized stage is an event that is triggered after modsLoaded once simplify has completed all async operations. This ensures that all simplify features are available.

### Sample `package.json`

```json
{
    "name": "test",
    "main": "mod.js",
    "dependencies": {
        "Simplify": "^2.3.0"
    }
}
```

### Sample `mod.js`

```js
document.addEventListener('simplifyInitialized', () => console.log('simplifyInitialized'));
```

## All stages

All stages can be combined in a single file using the events described above.

```json
{
    "name": "test",
    "preload": "mod.js",
    "dependencies": {
        "Simplify": "^2.3.0"
    }
}
```

### Sample `mod.js`

```js
console.log('modLoad');

document.addEventListener('modsLoaded', () => console.log('modsLoaded'));
document.addEventListener('simplifyInitialized', () => console.log('simplifyInitialized'));
document.addEventListener('preload', () => console.log('preload'));
document.addEventListener('postload', () => console.log('postload'));
```

---

Author: 2767mr (Discord: 224155607278551040)