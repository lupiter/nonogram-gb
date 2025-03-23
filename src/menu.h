#ifndef MENU_H
#define MENU_H

#include <gb/gb.h>

/**
 * Initializes the menu screen by setting up the background tiles and palettes
 */
void init_menu(void);

/**
 * Main menu loop that waits for the START button to be pressed
 */
void menu_loop(void);

#endif /* MENU_H */ 