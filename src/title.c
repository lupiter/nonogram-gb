#include <gb/gb.h>
#include <stdint.h>
#include <gbdk/platform.h>
#include <gb/drawing.h>
#include <assets/title.h>
#include "graphics_util.h"

void init_title(void) {
    blank_screen();

    set_bkg_data(0, title_TILE_COUNT, title_tiles);
    set_bkg_tiles(0, 0, title_WIDTH / title_TILE_W, title_HEIGHT / title_TILE_H, title_map);
    
    SHOW_BKG;

    // Wait 4 frames
    // For SGB on PAL SNES this delay is required on startup, otherwise borders don't show up
    for (uint8_t i = 4; i != 0; i--) vsync();

    // Then load the palettes at the start of a new frame
    vsync();
    if (_cpu == CGB_TYPE) {
        set_bkg_palette(BKGF_CGB_PAL0, CGB_ONE_PAL, title_palettes);
    } else {
        BGP_REG = DMG_PALETTE(DMG_WHITE, DMG_LITE_GRAY, DMG_DARK_GRAY, DMG_BLACK);
    }
}

void title_loop(void) {
    init_title();

    while(1) {
        vsync();
        if (joypad() & J_START) {
            break;
        }
    }
}