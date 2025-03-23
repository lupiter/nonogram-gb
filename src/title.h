#ifndef TITLE_H
#define TITLE_H

#include <gb/gb.h>

/**
 * Initializes the title screen by setting up the background tiles and palettes
 */
void init_title(void);

/**
 * Main title screen loop that waits for the START button to be pressed
 */
void title_loop(void);

#endif /* TITLE_H */ 