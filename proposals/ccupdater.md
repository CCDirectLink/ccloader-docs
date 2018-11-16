# CrossCode Mod Updater

The CrossCode Mod Updater provides an easy interface for users and developers to manage their installed mods. This includes installing, uninstalling and updating mods.

## Current Situation / Problems

At the moment, no automated system for installing, uninstalling and updating mods exists. While tools exist to list mods and their download link they are either hard to use for a normal user or not noticed at all. Furthermore, these tools are restricted to Discord and Github, the later being a site designed for developers and the first one having a limited audience. The Discord bot is also lacking in user awareness.

## Solution

An automated tool is to be built that can handle the required tasks. This tool is split into 3 parts:

* The core which executes the requested operations.
* A CLI that allowes advanced users to quickly install mods.
* A CCLoader implentation that is designed to be used by the average Player and a small API that allowes mods for simple interactions with the updater

### Advantages
* Easier mod managment for users and developers
* A standardized interface allowes for tools to use the updater

### Disadvantages
* An internet connection is required
* Requires a centralized DB
* Requires fs access

## API - Core

###  `ModInfo`

```ts
interface ModInfo {
    public name: string;
    public description: string;
    public version: string;
    public download: {
        type: 'zip',
        url: string,
        sha256?: string
    }
    public licence?: string;
    public infoPage?: [{
        name: string,
        url: string
    }],
}
```

This is the main data structure containing metadata of mods

### `updater.getModList`

```ts
public updater.getModList(): Promise<ModInfo[] | null>
```

This method fetches a modlist from the database and returns it. If there is an error while downloading the metadata `null` is returned.

### `updater.getModInfo`

```ts
public updater.getModInfo(name: string): Promise<ModInfo | undefined | null>
```

This method fetches a single mod from the database and returns it. If no mod with the given name is found `undefined` is returned. If there is an error while downloading the metadata `null` is returned.

### `updater.installMod`

```ts
public updater.installMod(mod: string | ModInfo): Promise<string | null>
```

This method installs the given mod. If the operation is successful `null` is returned. Otherwise an error message is returned. This operation can fail if:
* The the download fails.
* The mod is already installed.
* The updater is missing permissions to write to the fs.

### `updater.updateMod`

```ts
public updater.updateMod(mod: string | ModInfo): Promise<string | null>
```

This method updates or installs the given mod. If the operation is successful `null` is returned. Otherwise an error message is returned. This operation can fail if:
* The the download fails.
* The same or a newer version of the mod is installed.
* The updater is missing permissions to write to the fs.

### `updater.deleteMod`

```ts
public updater.deleteMod(mod: string | ModInfo): Promise<string | null>
```

This method deletes the given mod. If the operation is successful `null` is returned. Otherwise an error message is returned. This operation can fail if:
* The the download fails.
* The mod doesn't exist.
* The updater is missing permissions to write to the fs.

### `updater.getInstalledMods`

```ts
public updater.getInstalledMods(): Promise<Array<{name: string, version: string}>>
```

This method returns a list of installed mods with their current version.

### `updater.getOutdatedMods`

```ts
public updater.getOutdatedMods(): Promise<Array<{name: string, version: string}> | null>
```

This method returns a list of installed mods with their current version that have an update available. If there is an error while downloading the metadata `null` is returned.

### `updater.isModOutdated`

```ts
public updater.isModOutdated(name: string | ModInfo): Promise<boolean | null>
```

This mod checks if an update is available. If there is an error while downloading the metadata `null` is returned.

### `updater.setCurrentPath`

```ts
public updater.setCurrentPath(path: string): Promise<boolean>
```

This method can be used to set the path to a mod directory. This method checks if the given path exist but not if it is in an CrossCode folder.

## API - CLI

The CLI automatically detects if it is executed in the CrossCode root directory, the assets directory or the mods directory and switch the target directory accordingly

### `>ccmu install <name>`

Installs the given mod and prints the version of the the installed mod.

### `>ccmu remove <name>`
### `>ccmu delete <name>`
### `>ccmu uninstall <name>`

Deletes the given mod.

### `>ccmu update <name>`

Updates the given mod.

### `>ccmu list`

Prints a list of available mods and their version.

### `>ccmu outdated`

Prins a list of outdated mods with their current and wanted version.

## API - CCLoader

### `mod.isOutdated`
```ts
public mod.isOutdated(): Promise<boolean | null>
```

Calls `updater.isModOutdated` for the current mod

## UI - CCLoader

A UI is to be added that
* shows a warning if mods are outdated
* gives an option to update mods
* gives an option to delete mods

---

Author: 2767mr (Discord: 224155607278551040)