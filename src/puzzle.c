#include <gb/gb.h>
#include <stdint.h>
#include <gbdk/platform.h>
#include <gb/drawing.h>
#include <assets/background/puzzle_assets.h>
#include "graphics_util.h"

void init_puzzle(void) {
    blank_screen();

    set_bkg_data(0, puzzle_assets_TILE_COUNT, puzzle_assets_tiles);
    set_bkg_tiles(0, 0, puzzle_assets_WIDTH / puzzle_assets_TILE_W, puzzle_assets_HEIGHT / puzzle_assets_TILE_H, puzzle_assets_map);
    
    SHOW_BKG;

    // Load the palettes at the start of a new frame
    vsync();
    if (_cpu == CGB_TYPE) {
        set_bkg_palette(BKGF_CGB_PAL0, CGB_ONE_PAL, puzzle_assets_palettes);
    } else {
        BGP_REG = DMG_PALETTE(DMG_WHITE, DMG_LITE_GRAY, DMG_DARK_GRAY, DMG_BLACK);
    }
}

void puzzle_loop(uint8_t selected_puzzle) {
    init_puzzle(selected_puzzle);

    while(1) {
        vsync();
        if (joypad() & J_START) {
            break;
        }
    }
}