# Inheritance based definitions storage structure
New classes can be made by extending other classes. This develops a parent and child relationship. With that in mind, parent properties can be useful for the child. 


## Current Situtuation / Problems
Property definitions are often associated with a particular class. It is hard to determine whether that property can be useful for any other classes which leaves only the creator to other potential uses.

## Solution
Group definitions into classes (already implemented), and allow each class to inherit definitions from their parent classes. 
### Advantages
* Less definitions and duplicates.
### Disadvantages
* Possibility of conflicting names.
* Hard to pull off without a central base for all definitions.

## Changes to the current format
Create a new property object named "`_parents`" and reference the parent by name
and pass over a reference of the definitions.

### Implementation

TBD

## What this will affect

## Who wants this
* ac2pic (Author; Aliases: ac4pic, blueberry, Emilie Fc, Emilio Firecrow; Discord: 208763015657553921)

## References
Original Document: https://docs.google.com/document/d/14vj5YueoktW2E1TfQGnizDiMQBU8CA3woJyo3WMb738/edit?usp=sharing

---

* Author: ac2pic (Discord: 208763015657553921)