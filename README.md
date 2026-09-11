# Another Game Of Life

This is my friday implementation of [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) on raw web tech (HTML/JS/CSS).

## Implementation Description

The basic algorithmn solution implementation was inferred on paper first. No algorithm implementation seen before, only the rules it has to abide to. Each cell live/die/born by the said following rules:

- Borns: A 'dead' cell has exactly 3 neighbors.
- Dies: A 'living' cell dies in 1 of 2 ways.
    - Overpopulation: It has more than 1 neighbor.
    - Starvation: It has 1 or zero neighbors.
- Lives: A 'living' cell continues living if it has 2 or 3 neighbors.

