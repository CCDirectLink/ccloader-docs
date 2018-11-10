# Multi-layer definitions
Use previously validated definitions to generate new ones.


## Problems
* Some definitions break after a new update because they were dependent on the order of code.
* Some definitions are hard to define because there is no clear condition relative to a code block.

## Solution
Allow definitions to use other definitions as conditions. 
### Advantages:
* Much easier to make simple conditions for normally hard to define object names/properties.
* Can minimize how often definitions need to be remade.
* Workers can be utilized to partition the workload.
### Disadvantages:
* Hard to verify if it’s unique enough.
* Requires a redesign of the current system.
* There must be n loops through the source code for n layers.

## Changes to the current format:
Entries would be a multidimensional array. 0th index is the layer 1,
1st index is layer 2, and so and so forth.

### How to implement:
The code will start on layer one.
Once all the dependencies for a layer are fulfilled, start finding the definitions for that layer.
Repeat the last step until there are no more layers left. 

## Who this will affect:
People who make definitions.

## Who wants this:
* ac2pic (Author; Aliases: ac4pic, blueberry, Emilie Fc, Emilio Firecrow, Discord: 208763015657553921)

## References
Original Document: https://docs.google.com/document/d/1a7PvKg3BbOsCPnK41ZS-40g_q5Cg0lQepQ56rd0YUPg/edit

---

* Author: ac2pic (Discord: 208763015657553921)
* Champion: 2767mr (Discord: 224155607278551040)