/*
 * proposal-stage1 - Cross-Modloader standards for CrossCode modding, as Cubic Impact modules
 * Written starting in 2019 by 20kdc
 * To the extent possible under law, the author(s) have dedicated all copyright and related and neighboring rights to this software to the public domain worldwide. This software is distributed without any warranty.
 * You should have received a copy of the CC0 Public Domain Dedication along with this software. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
 */

// Implements the barest additional logic needed for a working, portable item ID allocation thing.
// This is necessary because Item IDs are allocated contiguously.
// Ideally sc.PlayerModel.items would be changed to an Object & string IDs would be used on new items
// If you are in an ownership position where the legal issues with the amount of rewritten functions necessary are no concern, consider doing that instead!

//  HOW TO USE
// 1. Load it somehow before startCrossCode/ig.main is run
// 2. Make sure the module gets run (this should be done automatically when the module is registered or if you remove the module wrapping)
// 3. When inserting items into the Item Database, use registerItemAsCustom
// 4. It will try to do the rest

//  NOTES REGARDING USAGE BY MODLOADERS
// For compatibility to be preserved, the sc.Inventory API must be kept intact, along with the save format.
// I believe the involved system is simple enough that should a modloader need to rewrite the API, that is doable.
// Only one modloader can inject a given API implementation at any given time without potentially breaking stability.
// So I recommend that sc.inventory.registerItemAsCustom's existence be used as the sentinel for "an implementation is already in place".
// Additional per-modloader APIs not described here must use separate predicates, so that they can co-exist.

//  REGARDING THE SAVE FORMAT
// PlayerModel now has the object "customItems", which contains the customItemToId table,
//  mapping custom item strings to their corresponding IDs.
// The implementation then builds a reverse mapping from IDs in the save to IDs in the running game.

//  POSSIBLE ISSUES
// The remapping code here may not be complete, or may need updating in future CrossCode versions.
// In that case, that is a bug, and makes the remapping code here non-conforming.
// That is part of the implementation, and a modloader is free to reimplement it,
//  so long as it's trying to implement the save format, without breaking conformance.

ig.module("proposal.game.feature.custom-items.custom-items-model").requires("game.feature.inventory.inventory", "game.feature.player.player-model").defines(function () {
	sc.Inventory.inject({
		idToCustomItem: {},
		customItemToId: {},
		/*
		 * Registers an item ID. Use this when you know the item's ID for certain.
		 * I don't recommended using this post-load, as this may cause duplicates to be registered if a save with the item has been loaded.
		 * 
		 * @this {sc.Inventory}
		 * @param {string} name The unique unchanging string name of the item for serialization.
		 * @param {number} id The Item ID for this run of the game.
		 */
		registerItemAsCustom: function (name, id) {
			this.idToCustomItem[id] = name;
			this.customItemToId[name] = id;
		}
	});

	sc.PlayerModel.inject({
		// While it'd theoretically make sense to do this as a GameAddon, there's some issues with that.
		// This really has to 'wrap' the whole saving/loading business.
		// *After* save but *before* load.
		// Luckily everything to do with items is in PlayerModel, so disaster averted.
		/*
		 * @override
		 * @return Object
		 */
		getSaveData: function () {
			var data = this.parent();
			// On save, simply tag the whole thing with the custom item table.
			// The resulting mess can be sorted out by the load function.
			data["customItems"] = ig.copy(sc.inventory.customItemToId);
			return data;
		},
		/*
		 * @override
		 * @param {Object} data The JSON data.
		 */
		preLoad: function (data) {
			var mapping = {};

			/*
			 * Remaps an item's ID for the local environment.
			 *
			 * @param {*} data The ID within the file.
			 * @return number
			 */
			function remapRemoteItem(id) {
				if (id in mapping)
					return mapping[id];
				// Assume it's a vanilla item or something else was handling this - don't disturb it!
				return id;
			}

			if (data["customItems"]) {
				for (k in data["customItems"]) {
					if (!(k in sc.inventory.customItemToId)) {
						// Not good... register quick temporary items!
						sc.inventory.registerItemAsCustom(k, sc.inventory.items.length);
						sc.inventory.items.push({
							"name": {
								"en_US": "Oddity " + data["customItems"][k],
								"langUid": 13371337
							},
							"description": {
								"en_US": "It has '" + k + "' written on it.",
								"langUid": 13371337
							},
							"type": "KEY",
							"rarity": 0,
							"level": 1,
							"icon": "item-key",
							"order": 0,
							"noTrack": true
						});
					}
					mapping[data["customItems"][k]] = sc.inventory.customItemToId[k];
				}
			}
			// -- Remap data
			var newItems = [];
			for (var i = 0; i < data["items"].length; i++)
				newItems[remapRemoteItem(i)] = data["items"][i];
			data["items"] = newItems;

			data["equip"]["head"] = remapRemoteItem(data["equip"]["head"]);
			data["equip"]["leftArm"] = remapRemoteItem(data["equip"]["leftArm"]);
			data["equip"]["rightArm"] = remapRemoteItem(data["equip"]["rightArm"]);
			data["equip"]["torso"] = remapRemoteItem(data["equip"]["torso"]);
			data["equip"]["feet"] = remapRemoteItem(data["equip"]["feet"]);

			for (var i = 0; i < data["itemFavs"].length; i++)
				data["itemFavs"][i] = remapRemoteItem(data["itemFavs"][i]);
			for (var i = 0; i < data["itemNew"].length; i++)
				data["itemNew"][i] = remapRemoteItem(data["itemNew"][i]);

			var newItemToggles = {};
			for (k in data["itemToggles"])
				newItemToggles[remapRemoteItem(k)] = data["itemToggles"][k];
			data["itemToggles"] = newItemToggles;

			this.parent(data);
		}
	});
});

