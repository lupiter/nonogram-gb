#include <gb/gb.h>
#include <stdint.h>
#include <gbdk/platform.h>
#include <gb/drawing.h>
#include <assets/menu.h>
#include "graphics_util.h"

void init_menu(void) {
    blank_screen();

    set_bkg_data(0, menu_TILE_COUNT, menu_tiles);
    set_bkg_tiles(0, 0, menu_WIDTH / menu_TILE_W, menu_HEIGHT / menu_TILE_H, menu_map);
    
    SHOW_BKG;

    // Load the palettes at the start of a new frame
    vsync();
    if (_cpu == CGB_TYPE) {
        set_bkg_palette(BKGF_CGB_PAL0, CGB_ONE_PAL, menu_palettes);
    } else {
        BGP_REG = DMG_PALETTE(DMG_WHITE, DMG_LITE_GRAY, DMG_DARK_GRAY, DMG_BLACK);
    }
}

void menu_loop(void) {
    init_menu();

    while(1) {
        vsync();
        if (joypad() & J_A) {
            break;
        }
    }
}